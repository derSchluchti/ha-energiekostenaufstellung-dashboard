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
from custom_components.energiekostenaufstellung.sensor_setup import async_rebuild_sensors

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
    from homeassistant.components.frontend import DATA_EXTRA_MODULE_URL

    assert any("energiekosten-card.js" in u for u in hass.data[DATA_EXTRA_MODULE_URL].urls)


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
    assert r["series"] is None

    # Verlauf je Stunde
    await client.send_json_auto_id(
        {
            "type": f"{DOMAIN}/report",
            "start": day.isoformat(),
            "end": (day + timedelta(days=1)).isoformat(),
            "bucket": "hour",
        }
    )
    msg = await client.receive_json()
    s = msg["result"]["series"]
    assert len(s["keys"]) == 24
    assert s["devices"]["sensor.geraet_a"][5][2] == pytest.approx(1.0)
    assert s["devices"]["sensor.geraet_a"][5][0] == pytest.approx(0.16 * 1.2)
    assert s["rest"][5][2] == pytest.approx(2.0)

    # Kachel-Modus: nur ein Gerät, Tagesbuckets
    await client.send_json_auto_id(
        {
            "type": f"{DOMAIN}/report",
            "start": day.isoformat(),
            "end": (day + timedelta(days=1)).isoformat(),
            "bucket": "day",
            "stat_ids": ["sensor.geraet_b"],
        }
    )
    msg = await client.receive_json()
    r = msg["result"]
    assert [d["stat_id"] for d in r["devices"]] == ["sensor.geraet_b"]
    assert r["series"]["devices"]["sensor.geraet_b"][0][2] == pytest.approx(12.0)
    assert r["warnings"] == []


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


async def test_cost_sensors(hass: HomeAssistant, freezer):
    """Sensoren: heute/Monat inkl. Fixkosten-Anteil, je Gerät, Hochrechnung."""
    await hass.config.async_update(time_zone="Europe/Vienna")
    # 02.11.2026 12:00 Wien = 11:00 UTC
    freezer.move_to(datetime(2026, 11, 2, 11, 0, tzinfo=timezone.utc))
    assert await async_setup_component(hass, "energy", {})
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
            "device_consumption": [{"stat_consumption": "sensor.geraet_a", "name": "Gerät A"}],
        }
    )
    # ab 01.11. 23:00 Wien stündlich: Netz 3 kWh, A 1 kWh
    first = datetime(2026, 11, 1, 22, tzinfo=timezone.utc)
    _import(hass, "sensor.netz", first, 13, 3.0)
    _import(hass, "sensor.geraet_a", first, 13, 1.0)
    await async_wait_recording_done(hass)

    entry = MockConfigEntry(domain=DOMAIN, data={}, title="Energiekosten")
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    # wie save_settings im Panel (Websocket-Token passt nicht zur eingefrorenen Uhr)
    await hass.data[DOMAIN].async_save({"tariff": TARIFF})
    await async_rebuild_sensors(hass)
    await hass.async_block_till_done()

    # heute: 12 h x 3 kWh x 0,16 € netto x 1,2 + halber Tag Zählermiete (0,05 netto)
    today = hass.states.get("sensor.energiekosten_kosten_heute")
    assert float(today.state) == pytest.approx(36 * 0.16 * 1.2 + 0.06, abs=0.01)
    assert today.attributes["kwh"] == pytest.approx(36.0)
    assert today.attributes["geraete"][0]["name"] == "Gerät A"
    assert "Gerät A: 2,30 €" in today.attributes["anzeige"]
    assert "Nicht erfasst: 4,61 €" in today.attributes["anzeige"]

    # Monat: 13 h (inkl. 01.11. 23:00)
    month = hass.states.get("sensor.energiekosten_kosten_monat")
    assert month.attributes["kwh"] == pytest.approx(39.0)
    dev = hass.states.get("sensor.energiekosten_kosten_monat_gerat_a")
    assert float(dev.state) == pytest.approx(13 * 0.16 * 1.2, abs=0.01)

    proj = hass.states.get("sensor.energiekosten_hochrechnung_monat")
    assert float(proj.state) > float(month.state)
    assert hass.states.get("sensor.energiekosten_hochrechnung_jahr") is not None
