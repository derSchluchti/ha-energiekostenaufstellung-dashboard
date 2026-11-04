"""Tarifmodell: Tarifversionen mit variablen und fixen Positionen.

Bewusst ohne Home-Assistant-Abhängigkeiten, damit der Rechenkern
eigenständig testbar ist.

Alle Preise sind netto. Variable Preise in ct/kWh, fixe Preise in EUR/Jahr.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime
from typing import Any

CATEGORY_ENERGY = "energie"
CATEGORY_GRID = "netz"
CATEGORY_LEVIES = "abgaben"
CATEGORIES: tuple[str, ...] = (CATEGORY_ENERGY, CATEGORY_GRID, CATEGORY_LEVIES)

CATEGORY_LABELS: dict[str, str] = {
    CATEGORY_ENERGY: "Energie",
    CATEGORY_GRID: "Netz",
    CATEGORY_LEVIES: "Abgaben",
}


class TariffError(ValueError):
    """Ungültige Tarifdefinition."""


def _check_category(category: str) -> str:
    if category not in CATEGORIES:
        raise TariffError(f"Unbekannte Kategorie: {category!r}")
    return category


@dataclass(frozen=True)
class ReducedWindow:
    """Zeitfenster mit reduziertem Preis (z. B. SNAP / Nebenzeit).

    months: Monate 1–12, in denen das Fenster gilt.
    start_hour/end_hour: lokale Uhrzeit, Ende exklusiv (10–16 = 10:00–15:59).
    """

    months: frozenset[int]
    start_hour: int
    end_hour: int

    def __post_init__(self) -> None:
        if not self.months or any(m < 1 or m > 12 for m in self.months):
            raise TariffError("Rabattfenster: Monate müssen zwischen 1 und 12 liegen")
        if not 0 <= self.start_hour < self.end_hour <= 24:
            raise TariffError("Rabattfenster: Uhrzeit ungültig")

    def contains(self, local_dt: datetime) -> bool:
        return (
            local_dt.month in self.months
            and self.start_hour <= local_dt.hour < self.end_hour
        )

    def to_dict(self) -> dict[str, Any]:
        return {
            "months": sorted(self.months),
            "start_hour": self.start_hour,
            "end_hour": self.end_hour,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> ReducedWindow:
        return cls(
            months=frozenset(int(m) for m in data["months"]),
            start_hour=int(data["start_hour"]),
            end_hour=int(data["end_hour"]),
        )


@dataclass(frozen=True)
class VariablePosition:
    """Verbrauchsabhängige Position (ct/kWh netto)."""

    name: str
    category: str
    price_ct: float
    price_reduced_ct: float | None = None

    def __post_init__(self) -> None:
        _check_category(self.category)

    def price_eur(self, reduced: bool) -> float:
        if reduced and self.price_reduced_ct is not None:
            return self.price_reduced_ct / 100.0
        return self.price_ct / 100.0

    def to_dict(self) -> dict[str, Any]:
        return {
            "name": self.name,
            "category": self.category,
            "price_ct": self.price_ct,
            "price_reduced_ct": self.price_reduced_ct,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> VariablePosition:
        reduced = data.get("price_reduced_ct")
        return cls(
            name=str(data["name"]),
            category=str(data["category"]),
            price_ct=float(data["price_ct"]),
            price_reduced_ct=None if reduced in (None, "") else float(reduced),
        )


@dataclass(frozen=True)
class FixedPosition:
    """Zeitabhängige Position (EUR/Jahr netto, anteilig je Tag / 365)."""

    name: str
    category: str
    eur_per_year: float

    def __post_init__(self) -> None:
        _check_category(self.category)

    @property
    def eur_per_day(self) -> float:
        return self.eur_per_year / 365.0

    def to_dict(self) -> dict[str, Any]:
        return {
            "name": self.name,
            "category": self.category,
            "eur_per_year": self.eur_per_year,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> FixedPosition:
        return cls(
            name=str(data["name"]),
            category=str(data["category"]),
            eur_per_year=float(data["eur_per_year"]),
        )


@dataclass(frozen=True)
class TariffVersion:
    """Ein ab einem Datum gültiger Tarif."""

    valid_from: date
    vat_percent: float
    variable: tuple[VariablePosition, ...]
    fixed: tuple[FixedPosition, ...] = ()
    reduced_window: ReducedWindow | None = None

    @property
    def vat_factor(self) -> float:
        return self.vat_percent / 100.0

    def is_reduced(self, local_dt: datetime) -> bool:
        return self.reduced_window is not None and self.reduced_window.contains(
            local_dt
        )

    def variable_prices(self, local_dt: datetime) -> dict[str, float]:
        """Netto-Preis in EUR/kWh je Kategorie für die gegebene lokale Zeit."""
        reduced = self.is_reduced(local_dt)
        prices = dict.fromkeys(CATEGORIES, 0.0)
        for pos in self.variable:
            prices[pos.category] += pos.price_eur(reduced)
        return prices

    def position_prices(self, local_dt: datetime) -> list[tuple[VariablePosition, float]]:
        """Netto-Preis in EUR/kWh je einzelner Position."""
        reduced = self.is_reduced(local_dt)
        return [(pos, pos.price_eur(reduced)) for pos in self.variable]

    def to_dict(self) -> dict[str, Any]:
        return {
            "valid_from": self.valid_from.isoformat(),
            "vat_percent": self.vat_percent,
            "reduced_window": (
                self.reduced_window.to_dict() if self.reduced_window else None
            ),
            "variable": [p.to_dict() for p in self.variable],
            "fixed": [p.to_dict() for p in self.fixed],
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> TariffVersion:
        window = data.get("reduced_window")
        return cls(
            valid_from=date.fromisoformat(data["valid_from"]),
            vat_percent=float(data.get("vat_percent", 20.0)),
            reduced_window=ReducedWindow.from_dict(window) if window else None,
            variable=tuple(VariablePosition.from_dict(p) for p in data.get("variable", [])),
            fixed=tuple(FixedPosition.from_dict(p) for p in data.get("fixed", [])),
        )


@dataclass
class Tariff:
    """Sammlung von Tarifversionen, sortiert nach Gültigkeitsbeginn."""

    versions: list[TariffVersion] = field(default_factory=list)

    def __post_init__(self) -> None:
        self.versions.sort(key=lambda v: v.valid_from)
        dates = [v.valid_from for v in self.versions]
        if len(dates) != len(set(dates)):
            raise TariffError("Zwei Tarifversionen mit gleichem Gültig-ab-Datum")

    def version_at(self, local_date: date) -> TariffVersion | None:
        """Gültige Version für ein lokales Datum, None vor der ersten Version."""
        current: TariffVersion | None = None
        for version in self.versions:
            if version.valid_from <= local_date:
                current = version
            else:
                break
        return current

    def to_dict(self) -> dict[str, Any]:
        return {"versions": [v.to_dict() for v in self.versions]}

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Tariff:
        return cls(versions=[TariffVersion.from_dict(v) for v in data.get("versions", [])])
