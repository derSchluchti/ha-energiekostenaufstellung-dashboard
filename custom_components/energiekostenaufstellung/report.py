"""Berechnung der Kostenaufstellung für einen Zeitraum."""

from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Any
from zoneinfo import ZoneInfo

from homeassistant.components.recorder import get_instance
from homeassistant.components.recorder.statistics import statistics_during_period
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .core import CostResult, Tariff, fixed_costs, variable_cost
from .devices import Device, async_energy_prefs, async_resolve_devices, grid_stat_from_prefs

HOUR = timedelta(hours=1)
UNITS = {"energy": "kWh"}


def _floor_hour(dt: datetime) -> datetime:
    return dt.replace(minute=0, second=0, microsecond=0)


async def async_hourly_changes(
    hass: HomeAssistant, stat_ids: set[str], start: datetime, end: datetime
) -> dict[str, list[tuple[datetime, float]]]:
    """Stündliche Verbrauchswerte. Die noch nicht verdichtete letzte(n)
    Stunde(n) werden aus den 5-Minuten-Statistiken ergänzt."""
    if not stat_ids or end <= start:
        return {sid: [] for sid in stat_ids}
    recorder = get_instance(hass)
    hourly = await recorder.async_add_executor_job(
        statistics_during_period,
        hass, start, end, stat_ids, "hour", UNITS, {"change", "sum"},
    )
    result: dict[str, list[tuple[datetime, float]]] = {sid: [] for sid in stat_ids}
    last_sum: dict[str, float] = {}
    last_hour_end = start
    for sid, rows in hourly.items():
        for row in rows:
            change = row.get("change")
            row_start = datetime.fromtimestamp(row["start"], timezone.utc)
            last_hour_end = max(last_hour_end, row_start + HOUR)
            if change is not None:
                result[sid].append((row_start, float(change)))
            if row.get("sum") is not None:
                last_sum[sid] = float(row["sum"])

    if last_hour_end < end:
        short = await recorder.async_add_executor_job(
            statistics_during_period,
            hass, last_hour_end, end, stat_ids, "5minute", UNITS, {"change", "sum"},
        )
        for sid, rows in short.items():
            buckets: dict[datetime, float] = defaultdict(float)
            prev = last_sum.get(sid)
            for row in rows:
                row_sum = row.get("sum")
                # Verbrauch aus der Differenz zur letzten Summe (Stundenwert bzw.
                # vorherige 5-Minuten-Zeile). Das Feld "change" der ersten
                # 5-Minuten-Zeile ist bei neuen oder nachträglich importierten
                # Statistiken die komplette Summe und daher unbrauchbar.
                if prev is not None and row_sum is not None:
                    change = float(row_sum) - prev
                else:
                    change = row.get("change")
                if row_sum is not None:
                    prev = float(row_sum)
                if change is None:
                    continue
                row_start = datetime.fromtimestamp(row["start"], timezone.utc)
                buckets[_floor_hour(row_start)] += float(change)
            result[sid].extend(sorted(buckets.items()))
    return result


BUCKETS = ("hour", "day", "month")


def _bucket_start(local: datetime, bucket: str) -> datetime:
    if bucket == "hour":
        return local.replace(minute=0, second=0, microsecond=0)
    if bucket == "day":
        return local.replace(hour=0, minute=0, second=0, microsecond=0)
    return local.replace(day=1, hour=0, minute=0, second=0, microsecond=0)


def _bucket_keys(start: datetime, end: datetime, bucket: str, tz: ZoneInfo) -> list[datetime]:
    """Lokale Startzeitpunkte aller Buckets im Zeitraum [start, end)."""
    keys: list[datetime] = []
    if bucket == "hour":
        cur = _floor_hour(start.astimezone(timezone.utc))
        while cur < end:
            keys.append(cur.astimezone(tz))
            cur += HOUR
        return keys
    cur = _bucket_start(start.astimezone(tz), bucket)
    while cur < end:
        keys.append(cur)
        if bucket == "day":
            nxt = cur.date() + timedelta(days=1)
            cur = datetime(nxt.year, nxt.month, nxt.day, tzinfo=tz)
        else:
            y, m = (cur.year + 1, 1) if cur.month == 12 else (cur.year, cur.month + 1)
            cur = datetime(y, m, 1, tzinfo=tz)
    return keys


def _series(
    hourly: list[tuple[datetime, float]],
    keys: list[datetime],
    bucket: str,
    tariff: Tariff,
    tz: ZoneInfo,
) -> list[CostResult]:
    index = {k: i for i, k in enumerate(keys)}
    grouped: list[list[tuple[datetime, float]]] = [[] for _ in keys]
    for start, kwh in hourly:
        key = _bucket_start(start.astimezone(tz), bucket)
        i = index.get(key)
        if i is not None:
            grouped[i].append((start, kwh))
    return [variable_cost(g, tariff, tz) for g in grouped]


def _compact(results: list[CostResult]) -> list[list[float]]:
    """[brutto, netto, kWh] je Bucket."""
    return [[round(r.gross_total, 5), round(r.net_total, 5), round(r.kwh, 4)] for r in results]


def _cost_dict(res: CostResult) -> dict[str, float]:
    return {k: round(v, 6) for k, v in res.as_dict().items()}


async def async_build_report(
    hass: HomeAssistant,
    settings: dict[str, Any],
    start: datetime,
    end: datetime,
    bucket: str | None = None,
    only: list[str] | None = None,
) -> dict[str, Any]:
    tz = ZoneInfo(hass.config.time_zone)
    now = dt_util.utcnow()
    tariff = Tariff.from_dict(settings["tariff"])
    prefs = await async_energy_prefs(hass)
    grid_stat = settings.get("grid_stat") or grid_stat_from_prefs(prefs)
    devices = await async_resolve_devices(hass, settings, prefs)
    active: list[Device] = [d for d in devices if not d.ignored]
    if only is not None:
        # Kachel-Modus: nur die angefragten Geräte, kein Netzbezug
        wanted = set(only)
        active = [d for d in devices if d.stat_id in wanted]
        grid_stat = None

    calc_end = min(end, now)
    is_current = start <= now < end
    total_s = (end - start).total_seconds()
    elapsed_s = max(0.0, (calc_end - start).total_seconds())
    factor = (total_s / elapsed_s) if (is_current and elapsed_s > 0) else None

    warnings: list[str] = []
    if not tariff.versions:
        warnings.append("Noch kein Tarif hinterlegt – bitte unter Einstellungen eintragen.")
    if grid_stat is None and only is None:
        warnings.append("Kein Netzbezug gefunden – im HA-Energie-Dashboard oder in den Einstellungen festlegen.")

    stat_ids = {d.stat_id for d in active}
    if grid_stat:
        stat_ids.add(grid_stat)
    hourly = await async_hourly_changes(hass, stat_ids, start, calc_end)

    def proj(res: CostResult) -> dict[str, float] | None:
        return _cost_dict(res.scaled(factor)) if factor else None

    device_rows = []
    device_costs: dict[str, CostResult] = {}
    for dev in active:
        series = hourly.get(dev.stat_id, [])
        cost = variable_cost(series, tariff, tz)
        device_costs[dev.stat_id] = cost
        device_rows.append(
            {
                **dev.as_dict(),
                "cost": _cost_dict(cost),
                "projection": proj(cost),
                "data_from": series[0][0].isoformat() if series else None,
            }
        )

    total = variable_cost(hourly.get(grid_stat, []), tariff, tz) if grid_stat else CostResult()

    # Nicht erfasst: nur oberste Ebene abziehen (Unterzähler stecken im übergeordneten)
    active_ids = set(device_costs)
    rest = CostResult()
    rest.add(total)
    for dev in active:
        if dev.included_in_stat and dev.included_in_stat in active_ids:
            continue
        rest.add(device_costs[dev.stat_id], -1.0)

    unpriced = total.kwh_unpriced + sum(c.kwh_unpriced for c in device_costs.values())
    if unpriced > 0 and tariff.versions:
        warnings.append(
            f"{unpriced:.1f} kWh liegen vor der ersten Tarifversion und sind nicht bepreist."
        )

    fixed_now = fixed_costs(tariff, start, calc_end, tz)
    fixed_full = {(l.name, l.category): l for l in fixed_costs(tariff, start, end, tz)} if factor else {}
    fixed_rows = []
    for line in fixed_now:
        full = fixed_full.get((line.name, line.category))
        fixed_rows.append(
            {
                "name": line.name,
                "category": line.category,
                "days": round(line.days, 4),
                "net": round(line.net, 6),
                "vat": round(line.vat, 6),
                "gross": round(line.gross, 6),
                "projection": (
                    {"net": round(full.net, 6), "vat": round(full.vat, 6), "gross": round(full.gross, 6)}
                    if full else None
                ),
            }
        )

    series = None
    if bucket in BUCKETS:
        keys = _bucket_keys(start, end, bucket, tz)
        dev_series = {
            d.stat_id: _series(hourly.get(d.stat_id, []), keys, bucket, tariff, tz) for d in active
        }
        total_series = (
            _series(hourly.get(grid_stat, []), keys, bucket, tariff, tz)
            if grid_stat
            else [CostResult() for _ in keys]
        )
        rest_series = []
        for i, tot in enumerate(total_series):
            r = CostResult()
            r.add(tot)
            for dev in active:
                if dev.included_in_stat and dev.included_in_stat in active_ids:
                    continue
                r.add(dev_series[dev.stat_id][i], -1.0)
            rest_series.append(r)
        series = {
            "bucket": bucket,
            "keys": [k.isoformat() for k in keys],
            "devices": {sid: _compact(v) for sid, v in dev_series.items()},
            "total": _compact(total_series),
            "rest": _compact(rest_series),
        }

    return {
        "series": series,
        "period": {
            "start": start.isoformat(),
            "end": end.isoformat(),
            "calc_end": calc_end.isoformat(),
            "is_current": is_current,
            "elapsed_s": elapsed_s,
            "total_s": total_s,
        },
        "grid_stat": grid_stat,
        "grouping": settings.get("grouping"),
        "devices": device_rows,
        "ignored": [d.as_dict() for d in devices if d.ignored],
        "total": {"cost": _cost_dict(total), "projection": proj(total)},
        "rest": {"cost": _cost_dict(rest), "projection": proj(rest)},
        "fixed": fixed_rows,
        "display": settings.get("display"),
        "warnings": warnings,
    }
