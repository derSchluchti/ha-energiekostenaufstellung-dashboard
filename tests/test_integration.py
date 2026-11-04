"""Integrationstests mit Home Assistant – synthetische Daten."""

from datetime import datetime, timedelta, timezone

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.components.recorder.common import (
    async_wait_recording_done,
)

from homeassistant.components.energy.data import async_get_manager
from homeassistant.components.recorder.models import StatisticMeanType
from homeassistant.components.recorder.statistics import async_import_statistics
from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component

from custom_components.energiekostenaufstellung.const import DOMAIN, PANEL_URL_PATH

TARIFF = {
    "versions": [
        {
            "valid_from": "2026-01-01",
            "vat_percent": 20,
            "reduced_window": {"months": [4, 5, 6, 7, 8, 9], "start_hour": 10, "end_hour": 16},
            "variable": [
                {"name": "Energie", "category": "energie", "price_ct": 10.0, "price_reduced_ct": 5.0},
                {"name": "Netz", "category": "netz", "price_ct": 5.0},
                {"name": "Abgabe", "category": "abgaben", "price_ct": 1.0},
            ],
            "fixed": [{"name": "Zählermiete", "category": "netz", "eur_per_year": 36.5}],
        }
    ]
}


def _import(hass, stat_id, start, hours, kwh_per_hour):
    meta = {
        "mean_type": StatisticMeanType.NONE,
        "has_sum": True,
        "name": None,
        "source": "recorder",
        "statistic_id": stat_id,
        "unit_class": "energy",
        "unit_of_measurement": "kWh",
    }
    total = 0.0
    rows = []
    for i in range(hours):
        total += kwh_per_hour
        rows.append({"start": start + timedelta(hours=i), "state": total, "sum": total})
    async_import_statistics(hass, meta, rows)


@pytest.fixture(autouse=True)
def _recorder_first(recorder_mock, enable_custom_integrations):
    """Recorder muss vor hass eingerichtet werden."""
    yield


@pytest.fixture
async def setup_integration(hass: HomeAssistant):
    assert await async_setup_component(hass, "energy", {})
    entry = MockConfigEntry(domain=DOMAIN, data={}, title="Energiekosten")
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_panel_registered(hass: HomeAssistant, setup_integration):
    assert PANEL_URL_PATH in hass.data["frontend_panels"]
    panel = hass.data["frontend_panels"][PANEL_URL_PATH]
    assert panel.require_admin is False


async def test_report(hass: HomeAssistant, setup_integration, hass_ws_client):
    await hass.config.async_update(time_zone="Europe/Vienna")
    manager = await async_get_manager(hass)
    await manager.async_update(
        {
            "energy_sources": [
                {
                    "type": "grid",
                    "flow_from": [
                        {
                            "stat_energy_from": "sensor.netz",
                            "stat_cost": None,
                            "entity_energy_price": None,
                            "number_energy_price": None,
                        }
                    ],
                    "flow_to": [],
                    "cost_adjustment_day": 0.0,
                }
            ],
            "device_consumption": [
                {"stat_consumption": "sensor.geraet_a", "name": "Gerät A"},
                {"stat_consumption": "sensor.geraet_b", "name": "Gerät B"},
            ],
        }
    )

    # 2026-11-02 (Winter, kein Rabatt), 24 h: Netz 3 kWh/h, A 1 kWh/h, B 0,5 kWh/h
    day = datetime(2026, 11, 1, 23, tzinfo=timezone.utc)  # = 02.11. 00:00 Wien
    _import(hass, "sensor.netz", day - timedelta(hours=1), 25, 3.0)
    _import(hass, "sensor.geraet_a", day - timedelta(hours=1), 25, 1.0)
    _import(hass, "sensor.geraet_b", day - timedelta(hours=1), 25, 0.5)
    await async_wait_recording_done(hass)

    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {
            "type": f"{DOMAIN}/save_settings",
            "settings": {"tariff": TARIFF, "devices": {"sensor.geraet_b": {"ignored": True}}},
        }
    )
    msg = await client.receive_json()
    assert msg["success"], msg

    await client.send_json_auto_id(
        {
            "type": f"{DOMAIN}/report",
            "start": day.isoformat(),
            "end": (day + timedelta(days=1)).isoformat(),
        }
    )
    msg = await client.receive_json()
    assert msg["success"], msg
    r = msg["result"]

    assert r["grid_stat"] == "sensor.netz"
    assert [d["name"] for d in r["devices"]] == ["Gerät A"]
    assert [d["name"] for d in r["ignored"]] == ["Gerät B"]

    a = r["devices"][0]["cost"]
    assert a["kwh"] == pytest.approx(24.0)
    assert a["net"] == pytest.approx(24 * 0.16)
    assert a["gross"] == pytest.approx(24 * 0.16 * 1.2)

    assert r["total"]["cost"]["kwh"] == pytest.approx(72.0)
    # B ist ignoriert -> landet in „Nicht erfasst“
    assert r["rest"]["cost"]["kwh"] == pytest.approx(48.0)

    assert len(r["fixed"]) == 1
    assert r["fixed"][0]["gross"] == pytest.approx(0.12)


async def test_settings_require_admin(
    hass: HomeAssistant, setup_integration, hass_ws_client, hass_read_only_access_token
):
    client = await hass_ws_client(hass, hass_read_only_access_token)
    await client.send_json_auto_id({"type": f"{DOMAIN}/settings"})
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["can_edit"] is False

    await client.send_json_auto_id({"type": f"{DOMAIN}/save_settings", "settings": {}})
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "unauthorized"


async def test_invalid_tariff_rejected(hass: HomeAssistant, setup_integration, hass_ws_client):
    client = await hass_ws_client(hass)
    bad = {"versions": [{"valid_from": "2026-01-01", "variable": [{"name": "x", "category": "falsch", "price_ct": 1}]}]}
    await client.send_json_auto_id({"type": f"{DOMAIN}/save_settings", "settings": {"tariff": bad}})
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "invalid_settings"
