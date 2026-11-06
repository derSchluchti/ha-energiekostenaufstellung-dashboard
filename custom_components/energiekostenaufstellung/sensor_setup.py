"""Sensor-Plattform nach geänderten Einstellungen neu aufbauen (ohne Panel-Reload)."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntryState
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant

from .const import DOMAIN

PLATFORMS = [Platform.SENSOR]


async def async_rebuild_sensors(hass: HomeAssistant) -> None:
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.state is not ConfigEntryState.LOADED:
            continue
        await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
        await entry.runtime_data.async_refresh()
        await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
