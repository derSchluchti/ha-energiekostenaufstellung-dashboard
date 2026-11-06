"""Kosten-Sensoren: gesamt je Zeitraum, Hochrechnung, je Gerät (Monat)."""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN, PANEL_TITLE
from .coordinator import EnergiekostenCoordinator, PeriodCosts
from .devices import async_energy_prefs, async_resolve_devices

PERIOD_LABELS = {"day": "heute", "month": "Monat", "year": "Jahr"}
PERIOD_KEYS = {"day": "heute", "month": "monat", "year": "jahr"}


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    coordinator: EnergiekostenCoordinator = entry.runtime_data
    entities: list[SensorEntity] = []
    for period in ("day", "month", "year"):
        entities.append(PeriodCostSensor(coordinator, entry, period))
    for period in ("month", "year"):
        entities.append(ProjectionSensor(coordinator, entry, period))

    store = coordinator.store
    prefs = await async_energy_prefs(hass)
    for dev in await async_resolve_devices(hass, store.data, prefs):
        if not dev.ignored:
            entities.append(DeviceCostSensor(coordinator, entry, dev.stat_id, dev.name))
    async_add_entities(entities)


class _Base(CoordinatorEntity[EnergiekostenCoordinator], SensorEntity):
    _attr_has_entity_name = True
    _attr_device_class = SensorDeviceClass.MONETARY
    _attr_native_unit_of_measurement = "EUR"
    _attr_suggested_display_precision = 2

    def __init__(self, coordinator: EnergiekostenCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator)
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name=PANEL_TITLE,
            entry_type=DeviceEntryType.SERVICE,
        )

    def _costs(self, period: str) -> PeriodCosts | None:
        data = self.coordinator.data
        return data.get(period) if data else None


class PeriodCostSensor(_Base):
    """Gesamtkosten des laufenden Zeitraums inkl. Fixkosten-Anteil (brutto)."""

    _attr_icon = "mdi:cash"

    def __init__(self, coordinator, entry, period: str) -> None:
        super().__init__(coordinator, entry)
        self._period = period
        self._attr_unique_id = f"{entry.entry_id}_kosten_{PERIOD_KEYS[period]}"
        self._attr_name = f"Kosten {PERIOD_LABELS[period]}"

    @property
    def native_value(self) -> float | None:
        costs = self._costs(self._period)
        return round(costs.gross, 2) if costs else None

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        costs = self._costs(self._period)
        if costs is None:
            return None
        return {
            "netto": round(costs.net, 2),
            "kwh": round(costs.kwh, 3),
            "variabel_brutto": round(costs.variable_gross, 2),
            "fix_brutto": round(costs.fixed_gross, 2),
            "hochrechnung_brutto": (
                round(costs.projection_gross, 2) if costs.projection_gross is not None else None
            ),
            "nicht_erfasst_brutto": round(costs.rest_gross, 2),
            "nicht_erfasst_kwh": round(costs.rest_kwh, 3),
            "geraete": costs.device_list(),
            "anzeige": costs.anzeige(),
        }


class ProjectionSensor(_Base):
    """Lineare Hochrechnung auf den ganzen Monat bzw. das ganze Jahr (brutto)."""

    _attr_icon = "mdi:chart-timeline-variant"

    def __init__(self, coordinator, entry, period: str) -> None:
        super().__init__(coordinator, entry)
        self._period = period
        self._attr_unique_id = f"{entry.entry_id}_hochrechnung_{PERIOD_KEYS[period]}"
        self._attr_name = f"Hochrechnung {PERIOD_LABELS[period]}"

    @property
    def native_value(self) -> float | None:
        costs = self._costs(self._period)
        if costs is None or costs.projection_gross is None:
            return None
        return round(costs.projection_gross, 2)


class DeviceCostSensor(_Base):
    """Kosten eines Geräts im laufenden Monat (variabel, brutto)."""

    _attr_icon = "mdi:power-plug-outline"

    def __init__(self, coordinator, entry, stat_id: str, name: str) -> None:
        super().__init__(coordinator, entry)
        self._stat_id = stat_id
        self._attr_unique_id = f"{entry.entry_id}_geraet_monat_{stat_id}"
        self._attr_name = f"Kosten Monat {name}"

    @property
    def native_value(self) -> float | None:
        costs = self._costs("month")
        if costs is None:
            return None
        dev = costs.devices.get(self._stat_id)
        return round(dev["gross"], 2) if dev else None

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        costs = self._costs("month")
        dev = costs.devices.get(self._stat_id) if costs else None
        if dev is None:
            return None
        proj = dev["projection_gross"]
        return {
            "statistik_id": self._stat_id,
            "netto": round(dev["net"], 2),
            "kwh": round(dev["kwh"], 3),
            "hochrechnung_brutto": round(proj, 2) if proj is not None else None,
        }
