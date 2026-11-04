"""Geräteliste: HA-Energie-Dashboard + manuell hinzugefügte Sensoren."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from homeassistant.components.energy.data import async_get_manager
from homeassistant.core import HomeAssistant
from homeassistant.helpers import (
    area_registry as ar,
    device_registry as dr,
    entity_registry as er,
    floor_registry as fr,
)

from .const import GROUPING_AREA, GROUPING_CUSTOM, GROUPING_FLOOR, NO_GROUP_LABEL

PALETTE = (
    "#4e9a8a", "#c9a227", "#b5534b", "#5b7fbf", "#8e6bb8",
    "#d9822b", "#3f8f4f", "#c25e9a", "#6b8e9f", "#9a7b4f",
)


@dataclass
class Device:
    stat_id: str
    name: str
    group: str
    color: str
    source: str  # "energy" | "manual"
    ignored: bool
    included_in_stat: str | None

    def as_dict(self) -> dict[str, Any]:
        return {
            "stat_id": self.stat_id,
            "name": self.name,
            "group": self.group,
            "color": self.color,
            "source": self.source,
            "ignored": self.ignored,
            "included_in_stat": self.included_in_stat,
        }


async def async_energy_prefs(hass: HomeAssistant) -> dict[str, Any]:
    manager = await async_get_manager(hass)
    return dict(manager.data or {})


def grid_stat_from_prefs(prefs: dict[str, Any]) -> str | None:
    for source in prefs.get("energy_sources", []):
        if source.get("type") == "grid":
            # Format ab 2025: stat_energy_from direkt am Eintrag
            if source.get("stat_energy_from"):
                return source["stat_energy_from"]
            # älteres Format: flow_from-Liste
            for flow in source.get("flow_from", []) or []:
                if flow.get("stat_energy_from"):
                    return flow["stat_energy_from"]
    return None


def _auto_group(hass: HomeAssistant, entity_id: str, grouping: str) -> str | None:
    ent_reg = er.async_get(hass)
    entry = ent_reg.async_get(entity_id)
    if entry is None:
        return None
    area_id = entry.area_id
    if area_id is None and entry.device_id:
        device = dr.async_get(hass).async_get(entry.device_id)
        area_id = device.area_id if device else None
    if area_id is None:
        return None
    area = ar.async_get(hass).async_get_area(area_id)
    if area is None:
        return None
    if grouping == GROUPING_AREA:
        return area.name
    if grouping == GROUPING_FLOOR:
        if area.floor_id:
            floor = fr.async_get(hass).async_get_floor(area.floor_id)
            if floor:
                return floor.name
        return area.name
    return None


def _friendly_name(hass: HomeAssistant, entity_id: str) -> str:
    state = hass.states.get(entity_id)
    if state and state.attributes.get("friendly_name"):
        return str(state.attributes["friendly_name"])
    return entity_id


async def async_resolve_devices(
    hass: HomeAssistant, settings: dict[str, Any], prefs: dict[str, Any]
) -> list[Device]:
    """Alle Geräte inkl. ignorierter, in stabiler Reihenfolge."""
    overrides: dict[str, dict[str, Any]] = settings.get("devices", {})
    grouping = settings.get("grouping")
    result: list[Device] = []
    seen: set[str] = set()

    entries: list[tuple[str, str | None, str, str | None]] = []
    for dev in prefs.get("device_consumption", []) or []:
        stat_id = dev.get("stat_consumption")
        if stat_id and stat_id not in seen:
            seen.add(stat_id)
            entries.append((stat_id, dev.get("name"), "energy", dev.get("included_in_stat")))
    for stat_id, ov in overrides.items():
        if ov.get("manual") and stat_id not in seen:
            seen.add(stat_id)
            entries.append((stat_id, None, "manual", None))

    for index, (stat_id, prefs_name, source, included) in enumerate(entries):
        ov = overrides.get(stat_id, {})
        name = ov.get("name") or prefs_name or _friendly_name(hass, stat_id)
        if grouping == GROUPING_CUSTOM or ov.get("group"):
            group = ov.get("group") or NO_GROUP_LABEL
        elif grouping in (GROUPING_AREA, GROUPING_FLOOR):
            group = _auto_group(hass, stat_id, grouping) or NO_GROUP_LABEL
        else:
            group = ""
        result.append(
            Device(
                stat_id=stat_id,
                name=name,
                group=group,
                color=ov.get("color") or PALETTE[index % len(PALETTE)],
                source=source,
                ignored=bool(ov.get("ignored", False)),
                included_in_stat=included,
            )
        )
    return result


def energy_sensor_candidates(hass: HomeAssistant, exclude: set[str]) -> list[dict[str, str]]:
    """kWh-Sensoren, die als Gerät hinzugefügt werden können."""
    out = []
    for state in hass.states.async_all("sensor"):
        attrs = state.attributes
        if attrs.get("device_class") != "energy":
            continue
        if attrs.get("state_class") not in ("total", "total_increasing"):
            continue
        if state.entity_id in exclude:
            continue
        out.append(
            {
                "entity_id": state.entity_id,
                "name": str(attrs.get("friendly_name") or state.entity_id),
            }
        )
    out.sort(key=lambda c: c["name"].lower())
    return out
