"""Tests für den Rechenkern – ausschließlich synthetische Daten."""

import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

import pytest

sys.path.insert(
    0, str(Path(__file__).parents[1] / "custom_components" / "energiekostenaufstellung")
)

from core import (  # noqa: E402
    CostResult,
    FixedPosition,
    ReducedWindow,
    Tariff,
    TariffError,
    TariffVersion,
    VariablePosition,
    fixed_costs,
    project,
    variable_cost,
)

TZ = ZoneInfo("Europe/Vienna")


def _version(valid_from=date(2026, 1, 1), energy_ct=10.0, vat=20.0):
    return TariffVersion(
        valid_from=valid_from,
        vat_percent=vat,
        reduced_window=ReducedWindow(frozenset(range(4, 10)), 10, 16),
        variable=(
            VariablePosition("Energie", "energie", energy_ct, energy_ct / 2),
            VariablePosition("Netz", "netz", 5.0),
            VariablePosition("Abgabe", "abgaben", 1.0),
        ),
        fixed=(FixedPosition("Grundpreis", "netz", 36.5),),
    )


def _hours(start_local: datetime, count: int, kwh: float = 1.0):
    start = start_local.astimezone(timezone.utc)
    return [(start + timedelta(hours=i), kwh) for i in range(count)]


def test_normal_hour_price():
    tariff = Tariff([_version()])
    res = variable_cost(_hours(datetime(2026, 11, 2, 12, tzinfo=TZ), 1), tariff, TZ)
    assert res.net["energie"] == pytest.approx(0.10)
    assert res.net["netz"] == pytest.approx(0.05)
    assert res.net["abgaben"] == pytest.approx(0.01)
    assert res.vat == pytest.approx(0.032)
    assert res.gross_total == pytest.approx(0.192)
    assert res.kwh_reduced == 0


def test_reduced_window_boundaries():
    tariff = Tariff([_version()])
    # 9:00 normal, 10:00–15:00 rabattiert (6 h), 16:00 normal
    res = variable_cost(_hours(datetime(2026, 7, 1, 9, tzinfo=TZ), 8), tariff, TZ)
    assert res.kwh == 8
    assert res.kwh_reduced == 6
    assert res.net["energie"] == pytest.approx(2 * 0.10 + 6 * 0.05)


def test_reduced_window_not_in_winter():
    tariff = Tariff([_version()])
    res = variable_cost(_hours(datetime(2026, 12, 1, 10, tzinfo=TZ), 6), tariff, TZ)
    assert res.kwh_reduced == 0


def test_version_switch_and_unpriced():
    tariff = Tariff([_version(date(2026, 3, 1), 10.0), _version(date(2026, 3, 2), 20.0)])
    res = variable_cost(_hours(datetime(2026, 2, 28, 23, tzinfo=TZ), 49), tariff, TZ)
    # 28.2. 23:00 = 1 h ohne Tarif, 1.3. = 24 h zu 10 ct, 2.3. = 24 h zu 20 ct
    assert res.kwh_unpriced == 1
    assert res.net["energie"] == pytest.approx(24 * 0.10 + 24 * 0.20)


def test_negative_hours_ignored():
    tariff = Tariff([_version()])
    start = datetime(2026, 11, 2, 0, tzinfo=TZ).astimezone(timezone.utc)
    res = variable_cost([(start, 2.0), (start + timedelta(hours=1), -500.0)], tariff, TZ)
    assert res.kwh == 2.0


def test_rest_is_total_minus_devices():
    tariff = Tariff([_version()])
    hours = datetime(2026, 11, 2, 0, tzinfo=TZ)
    total = variable_cost(_hours(hours, 10, 3.0), tariff, TZ)
    dev = variable_cost(_hours(hours, 10, 1.0), tariff, TZ)
    rest = total - dev
    assert rest.kwh == pytest.approx(20.0)
    assert rest.gross_total == pytest.approx(total.gross_total * 2 / 3)


def test_fixed_costs_full_month():
    tariff = Tariff([_version()])
    lines = fixed_costs(
        tariff, datetime(2026, 9, 1, tzinfo=TZ), datetime(2026, 10, 1, tzinfo=TZ), TZ
    )
    assert len(lines) == 1
    assert lines[0].days == pytest.approx(30)
    assert lines[0].net == pytest.approx(3.0)  # 36,5 €/Jahr = 0,10 €/Tag
    assert lines[0].gross == pytest.approx(3.6)


def test_fixed_costs_dst_day_counts_as_one_day():
    tariff = Tariff([_version()])
    lines = fixed_costs(
        tariff, datetime(2026, 10, 25, tzinfo=TZ), datetime(2026, 10, 26, tzinfo=TZ), TZ
    )
    assert lines[0].days == pytest.approx(1.0)


def test_fixed_costs_partial_day():
    tariff = Tariff([_version()])
    lines = fixed_costs(
        tariff, datetime(2026, 11, 4, tzinfo=TZ), datetime(2026, 11, 4, 12, tzinfo=TZ), TZ
    )
    assert lines[0].days == pytest.approx(0.5)


def test_projection():
    assert project(10.0, 4 * 86400, 30 * 86400) == pytest.approx(75.0)
    assert project(10.0, 0, 30 * 86400) is None


def test_tariff_roundtrip():
    tariff = Tariff([_version()])
    assert Tariff.from_dict(tariff.to_dict()) == tariff


def test_duplicate_version_dates_rejected():
    with pytest.raises(TariffError):
        Tariff([_version(), _version()])


def test_unknown_category_rejected():
    with pytest.raises(TariffError):
        VariablePosition("X", "sonstiges", 1.0)


def test_cost_result_scaled():
    res = CostResult()
    res.kwh = 2.0
    res.net["energie"] = 1.0
    res.vat = 0.2
    assert res.scaled(0.5).gross_total == pytest.approx(0.6)
