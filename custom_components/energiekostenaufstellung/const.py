"""Konstanten der Integration Energiekostenaufstellung."""

DOMAIN = "energiekostenaufstellung"

PANEL_URL_PATH = "energiekosten"
PANEL_TITLE = "Energiekosten"
PANEL_ICON = "mdi:cash-multiple"
PANEL_COMPONENT = "energiekosten-panel"
STATIC_URL = f"/{DOMAIN}_static"

STORAGE_KEY = DOMAIN
STORAGE_VERSION = 1

GROUPING_NONE = "none"
GROUPING_AREA = "area"
GROUPING_FLOOR = "floor"
GROUPING_CUSTOM = "custom"
GROUPINGS = (GROUPING_NONE, GROUPING_AREA, GROUPING_FLOOR, GROUPING_CUSTOM)

NO_GROUP_LABEL = "Ohne Gruppe"
