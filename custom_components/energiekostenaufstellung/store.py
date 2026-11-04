"""Persistente Einstellungen (.storage/energiekostenaufstellung)."""

from __future__ import annotations

import copy
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import GROUPING_FLOOR, GROUPINGS, STORAGE_KEY, STORAGE_VERSION
from .core import Tariff, TariffError

DEFAULT_SETTINGS: dict[str, Any] = {
    "tariff": {"versions": []},
    # None = Netzquelle aus dem HA-Energie-Dashboard verwenden
    "grid_stat": None,
    # stat_id -> {name, ignored, group, color, manual}
    "devices": {},
    "grouping": GROUPING_FLOOR,
    "display": {"gross": True, "breakdown": True, "projection": False},
}


class SettingsError(ValueError):
    """Ungültige Einstellungen."""


def validate_settings(data: dict[str, Any]) -> dict[str, Any]:
    """Einstellungen prüfen und mit Standardwerten auffüllen."""
    settings = copy.deepcopy(DEFAULT_SETTINGS)
    for key in DEFAULT_SETTINGS:
        if key in data:
            settings[key] = data[key]

    try:
        Tariff.from_dict(settings["tariff"])
    except (TariffError, KeyError, TypeError, ValueError) as err:
        raise SettingsError(f"Tarif ungültig: {err}") from err

    if settings["grouping"] not in GROUPINGS:
        raise SettingsError("Unbekannte Gruppierung")

    grid = settings["grid_stat"]
    if grid is not None and not isinstance(grid, str):
        raise SettingsError("Netzbezug muss eine Statistik-ID sein")

    devices: dict[str, dict[str, Any]] = {}
    for stat_id, dev in (settings["devices"] or {}).items():
        if not isinstance(dev, dict):
            raise SettingsError(f"Gerät {stat_id} ungültig")
        devices[str(stat_id)] = {
            "name": (dev.get("name") or None),
            "ignored": bool(dev.get("ignored", False)),
            "group": (dev.get("group") or None),
            "color": (dev.get("color") or None),
            "manual": bool(dev.get("manual", False)),
        }
    settings["devices"] = devices

    display = copy.deepcopy(DEFAULT_SETTINGS["display"])
    display.update({k: bool(v) for k, v in (settings["display"] or {}).items() if k in display})
    settings["display"] = display
    return settings


class SettingsStore:
    """Lädt und speichert die Einstellungen."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self.data: dict[str, Any] = copy.deepcopy(DEFAULT_SETTINGS)

    async def async_load(self) -> None:
        stored = await self._store.async_load()
        if stored:
            try:
                self.data = validate_settings(stored)
            except SettingsError:
                self.data = copy.deepcopy(DEFAULT_SETTINGS)

    async def async_save(self, data: dict[str, Any]) -> dict[str, Any]:
        self.data = validate_settings(data)
        await self._store.async_save(self.data)
        return self.data

    @property
    def tariff(self) -> Tariff:
        return Tariff.from_dict(self.data["tariff"])
