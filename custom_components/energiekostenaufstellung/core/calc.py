"""Rechenkern: Kosten aus stündlichen Verbrauchswerten und Tarif.

Ohne Home-Assistant-Abhängigkeiten. Eingabe sind stündliche kWh-Werte
(Startzeit der Stunde, zeitzonenbehaftet) – genau das, was die
Recorder-Statistik mit ``change`` und ``period: hour`` liefert.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from .tariff import CATEGORIES, Tariff


@dataclass
class CostResult:
    """Variable Kosten eines Verbrauchers in einem Zeitraum (EUR)."""

    kwh: float = 0.0
    kwh_reduced: float = 0.0
    # kWh ohne gültige Tarifversion (vor der ersten Version) – nicht bepreist
    kwh_unpriced: float = 0.0
    net: dict[str, float] = field(default_factory=lambda: dict.fromkeys(CATEGORIES, 0.0))
    vat: float = 0.0
    # Netto je einzelner Tarifposition (Name -> EUR), für Abgleich mit Rechnung
    positions: dict[str, float] = field(default_factory=dict)

    @property
    def net_total(self) -> float:
        return sum(self.net.values())

    @property
    def gross_total(self) -> float:
        return self.net_total + self.vat

    def add(self, other: CostResult, sign: float = 1.0) -> None:
        self.kwh += sign * other.kwh
        self.kwh_reduced += sign * other.kwh_reduced
        self.kwh_unpriced += sign * other.kwh_unpriced
        for cat in CATEGORIES:
            self.net[cat] += sign * other.net[cat]
        self.vat += sign * other.vat
        for name, value in other.positions.items():
            self.positions[name] = self.positions.get(name, 0.0) + sign * value

    def __sub__(self, other: CostResult) -> CostResult:
        result = CostResult()
        result.add(self)
        result.add(other, -1.0)
        return result

    def scaled(self, factor: float) -> CostResult:
        result = CostResult()
        result.add(self, factor)
        return result

    def as_dict(self) -> dict[str, float]:
        return {
            "kwh": self.kwh,
            "kwh_reduced": self.kwh_reduced,
            "kwh_unpriced": self.kwh_unpriced,
            **{f"net_{cat}": value for cat, value in self.net.items()},
            "net": self.net_total,
            "vat": self.vat,
            "gross": self.gross_total,
        }


def variable_cost(
    hourly: Iterable[tuple[datetime, float]],
    tariff: Tariff,
    tz: ZoneInfo,
) -> CostResult:
    """Variable Kosten aus stündlichen kWh-Werten.

    Negative Stundenwerte (Zählerreset, Korrektur) werden ignoriert.
    """
    result = CostResult()
    for start, kwh in hourly:
        if kwh is None or kwh <= 0:
            continue
        local = start.astimezone(tz)
        version = tariff.version_at(local.date())
        result.kwh += kwh
        if version is None:
            result.kwh_unpriced += kwh
            continue
        if version.is_reduced(local):
            result.kwh_reduced += kwh
        hour_net = 0.0
        for pos, price in version.position_prices(local):
            amount = kwh * price
            result.net[pos.category] += amount
            result.positions[pos.name] = result.positions.get(pos.name, 0.0) + amount
            hour_net += amount
        result.vat += hour_net * version.vat_factor
    return result


@dataclass
class FixedCostLine:
    name: str
    category: str
    net: float = 0.0
    vat: float = 0.0
    days: float = 0.0

    @property
    def gross(self) -> float:
        return self.net + self.vat


def _local_midnight(dt: datetime, tz: ZoneInfo) -> datetime:
    local = dt.astimezone(tz)
    return datetime(local.year, local.month, local.day, tzinfo=tz)


def fixed_costs(
    tariff: Tariff,
    start: datetime,
    end: datetime,
    tz: ZoneInfo,
) -> list[FixedCostLine]:
    """Fixkosten je Position für [start, end).

    Jeder Kalendertag zählt als 1/365 des Jahresbetrags; angebrochene Tage
    anteilig nach verstrichener Zeit dieses Tages (DST-sicher).
    """
    lines: dict[tuple[str, str], FixedCostLine] = {}
    if end <= start:
        return []
    day_start = _local_midnight(start, tz)
    while day_start < end:
        next_day = datetime(
            *(day_start + timedelta(days=1)).timetuple()[:3], tzinfo=tz
        )
        day_len = (next_day - day_start).total_seconds()
        overlap = (min(end, next_day) - max(start, day_start)).total_seconds()
        if overlap > 0:
            fraction = overlap / day_len
            version = tariff.version_at(day_start.date())
            if version is not None:
                for pos in version.fixed:
                    key = (pos.name, pos.category)
                    line = lines.setdefault(key, FixedCostLine(pos.name, pos.category))
                    amount = pos.eur_per_day * fraction
                    line.net += amount
                    line.vat += amount * version.vat_factor
                    line.days += fraction
        day_start = next_day
    return list(lines.values())


def project(value: float, elapsed_s: float, total_s: float) -> float | None:
    """Lineare Hochrechnung auf den gesamten Zeitraum."""
    if elapsed_s <= 0 or total_s <= 0:
        return None
    return value * total_s / elapsed_s
