"""Regelmäßige Kostenberechnung für die Sensoren (heute, Monat, Jahr)."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta
import logging
from typing import Any
from zoneinfo import ZoneInfo

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from homeassistant.util import dt as dt_util

from .const import DOMAIN
from .report import async_build_report
from .store import SettingsStore

_LOGGER = logging.getLogger(__name__)

UPDATE_INTERVAL = timedelta(minutes=5)
# Jahreswerte ändern sich kaum – seltener neu rechnen
YEAR_INTERVAL = timedelta(minutes=30)

PERIODS = ("day", "month", "year")
ANZEIGE_MAX = 8


def period_bounds(now: datetime, period: str, tz: ZoneInfo) -> tuple[datetime, datetime]:
    """Lokaler Beginn und Ende des laufenden Zeitraums (als UTC)."""
    local = now.astimezone(tz)
    if period == "day":
        start = datetime(local.year, local.month, local.day, tzinfo=tz)
        nxt = start.date() + timedelta(days=1)
        end = datetime(nxt.year, nxt.month, nxt.day, tzinfo=tz)
    elif period == "month":
        start = datetime(local.year, local.month, 1, tzinfo=tz)
        y, m = (local.year + 1, 1) if local.month == 12 else (local.year, local.month + 1)
        end = datetime(y, m, 1, tzinfo=tz)
    else:
        start = datetime(local.year, 1, 1, tzinfo=tz)
        end = datetime(local.year + 1, 1, 1, tzinfo=tz)
    return dt_util.as_utc(start), dt_util.as_utc(end)


@dataclass
class PeriodCosts:
    """Aufbereitete Kosten eines Zeitraums (alles in EUR)."""

    gross: float = 0.0
    net: float = 0.0
    kwh: float = 0.0
    variable_gross: float = 0.0
    fixed_gross: float = 0.0
    projection_gross: float | None = None
    rest_gross: float = 0.0
    rest_kwh: float = 0.0
    # stat_id -> {"name", "gross", "net", "kwh", "projection_gross"}
    devices: dict[str, dict[str, Any]] = field(default_factory=dict)

    def device_list(self) -> list[dict[str, Any]]:
        rows = sorted(self.devices.values(), key=lambda d: d["gross"], reverse=True)
        return [
            {"name": r["name"], "brutto": round(r["gross"], 2), "kwh": round(r["kwh"], 2)}
            for r in rows
        ]

    def anzeige(self) -> str:
        """Kurzer Text (Top-Geräte + Nicht erfasst) für Displays."""
        lines = [
            f"{r['name']}: {_eur(r['brutto'])}"
            for r in self.device_list()[:ANZEIGE_MAX]
            if r["brutto"] >= 0.005
        ]
        if self.rest_gross >= 0.005:
            lines.append(f"Nicht erfasst: {_eur(self.rest_gross)}")
        return "\n".join(lines)


def _eur(value: float) -> str:
    return f"{value:.2f} €".replace(".", ",")


def costs_from_report(report: dict[str, Any]) -> PeriodCosts:
    total = report["total"]["cost"]
    fixed_gross = sum(line["gross"] for line in report["fixed"])
    fixed_net = sum(line["net"] for line in report["fixed"])
    result = PeriodCosts(
        gross=total["gross"] + fixed_gross,
        net=total["net"] + fixed_net,
        kwh=total["kwh"],
        variable_gross=total["gross"],
        fixed_gross=fixed_gross,
        rest_gross=report["rest"]["cost"]["gross"],
        rest_kwh=report["rest"]["cost"]["kwh"],
    )
    proj = report["total"]["projection"]
    if proj is not None:
        fixed_proj = sum(
            (line["projection"] or {"gross": line["gross"]})["gross"] for line in report["fixed"]
        )
        result.projection_gross = proj["gross"] + fixed_proj
    for row in report["devices"]:
        dev_proj = row.get("projection")
        result.devices[row["stat_id"]] = {
            "name": row["name"],
            "gross": row["cost"]["gross"],
            "net": row["cost"]["net"],
            "kwh": row["cost"]["kwh"],
            "projection_gross": dev_proj["gross"] if dev_proj else None,
        }
    return result


class EnergiekostenCoordinator(DataUpdateCoordinator[dict[str, PeriodCosts]]):
    """Rechnet alle 5 Minuten heute und Monat, alle 30 Minuten das Jahr."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry, store: SettingsStore) -> None:
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=UPDATE_INTERVAL,
            config_entry=entry,
        )
        self._store = store
        self._year: PeriodCosts | None = None
        self._year_at: datetime | None = None
        self._year_key: int | None = None

    @property
    def store(self) -> SettingsStore:
        return self._store

    async def _async_update_data(self) -> dict[str, PeriodCosts]:
        tz = ZoneInfo(self.hass.config.time_zone)
        now = dt_util.utcnow()
        data: dict[str, PeriodCosts] = {}
        for period in ("day", "month"):
            start, end = period_bounds(now, period, tz)
            report = await async_build_report(self.hass, self._store.data, start, end)
            data[period] = costs_from_report(report)

        year_key = now.astimezone(tz).year
        if (
            self._year is None
            or self._year_key != year_key
            or self._year_at is None
            or now - self._year_at >= YEAR_INTERVAL
        ):
            start, end = period_bounds(now, "year", tz)
            report = await async_build_report(self.hass, self._store.data, start, end)
            self._year = costs_from_report(report)
            self._year_at = now
            self._year_key = year_key
        data["year"] = self._year
        return data
