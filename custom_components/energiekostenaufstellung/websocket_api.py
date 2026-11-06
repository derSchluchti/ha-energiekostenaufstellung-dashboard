"""Websocket-Befehle für das Panel."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.util import dt as dt_util

from .const import DOMAIN
from .devices import (
    async_energy_prefs,
    async_resolve_devices,
    energy_sensor_candidates,
    grid_stat_from_prefs,
)
from .report import async_build_report
from .sensor_setup import async_rebuild_sensors
from .store import SettingsError, SettingsStore


@callback
def async_register(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_report)
    websocket_api.async_register_command(hass, ws_get_settings)
    websocket_api.async_register_command(hass, ws_save_settings)


def _store(hass: HomeAssistant) -> SettingsStore | None:
    return hass.data.get(DOMAIN)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/report",
        vol.Required("start"): str,
        vol.Required("end"): str,
        vol.Optional("bucket"): vol.In(["hour", "day", "month"]),
        vol.Optional("stat_ids"): [str],
    }
)
@websocket_api.async_response
async def ws_report(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "not_loaded", "Integration ist nicht eingerichtet")
        return
    start = dt_util.parse_datetime(msg["start"])
    end = dt_util.parse_datetime(msg["end"])
    if start is None or end is None or end <= start:
        connection.send_error(msg["id"], "invalid_format", "Ungültiger Zeitraum")
        return
    start = dt_util.as_utc(start)
    end = dt_util.as_utc(end)
    report = await async_build_report(
        hass, store.data, start, end, msg.get("bucket"), msg.get("stat_ids")
    )
    connection.send_result(msg["id"], report)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/settings"})
@websocket_api.async_response
async def ws_get_settings(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "not_loaded", "Integration ist nicht eingerichtet")
        return
    prefs = await async_energy_prefs(hass)
    devices = await async_resolve_devices(hass, store.data, prefs)
    present = {d.stat_id for d in devices}
    grid = grid_stat_from_prefs(prefs)
    exclude = present | ({grid} if grid else set()) | (
        {store.data["grid_stat"]} if store.data.get("grid_stat") else set()
    )
    connection.send_result(
        msg["id"],
        {
            "settings": store.data,
            "devices": [d.as_dict() for d in devices],
            "grid_stat_auto": grid,
            "candidates": energy_sensor_candidates(hass, exclude),
            "can_edit": bool(connection.user and connection.user.is_admin),
        },
    )


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/save_settings", vol.Required("settings"): dict}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_save_settings(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    store = _store(hass)
    if store is None:
        connection.send_error(msg["id"], "not_loaded", "Integration ist nicht eingerichtet")
        return
    try:
        saved = await store.async_save(msg["settings"])
    except SettingsError as err:
        connection.send_error(msg["id"], "invalid_settings", str(err))
        return
    connection.send_result(msg["id"], {"settings": saved})
    # Sensoren mit den neuen Einstellungen (Tarif, Geräteliste) neu aufbauen
    await async_rebuild_sensors(hass)
