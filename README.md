# Energiekostenaufstellung für Home Assistant

Eigenes Panel „Energiekosten“ in der Seitenleiste: Was kostet jedes Gerät – stundengenau nach echtem Tarif, aufgeschlüsselt nach **Energie, Netz, Abgaben und USt**, mit Fixkosten getrennt.

- Rechnet **rückwirkend** aus den Langzeitstatistiken des Recorders – keine zusätzlichen Sensoren nötig.
- **Tarifmodell** mit beliebig vielen Positionen, Rabattfenster (z. B. SNAP / Nebenzeit) und Tarifversionen mit „gültig ab“.
- **Fixkosten** (Grundpreise, Messentgelt …) werden separat ausgewiesen und nicht auf Geräte verteilt – die Gerätekosten zeigen also, was du ohne das Gerät wirklich weniger zahlst.
- Geräte aus dem **HA-Energie-Dashboard** werden automatisch übernommen, einzeln ignorierbar; weitere kWh-Sensoren lassen sich hinzufügen.
- Zeile **„Nicht erfasst“** = Netzbezug minus Geräte (Unterzähler werden nicht doppelt gezählt).
- Zeiträume Tag / Woche / Monat / Jahr, Netto/Brutto-Umschalter, optionale Hochrechnung.
- Gruppierung nach Stockwerk, Bereich oder eigenen Gruppen.
- Diagramme: Verlauf gestapelt (€ oder kWh), Aufteilung inkl. Fixkosten, Geräte-Vergleich.
- **Kachel „Energiekosten Gerät“** für beliebige Dashboards.

## Installation über HACS

1. HACS → ⋮ → **Benutzerdefinierte Repositories**
2. URL `https://github.com/derSchluchti/ha-energiekostenaufstellung-dashboard`, Typ **Integration** → Hinzufügen
3. „Energiekostenaufstellung“ herunterladen, Home Assistant neu starten
4. Einstellungen → Geräte & Dienste → Integration hinzufügen → **Energiekostenaufstellung**
5. Panel „Energiekosten“ → **Einstellungen** → Tarif eintragen → Speichern

## Tarif eintragen

Alle Preise **netto**: variable Positionen in ct/kWh, Fixkosten in €/Jahr (werden je Tag mit 1/365 angesetzt). Jede Position bekommt eine Kategorie (Energie, Netz, Abgaben). Die Werte stehen auf deiner Stromrechnung.

Für EVN-Kunden in Niederösterreich gibt es den Button „Beispiel einfügen“ mit den Preisen von „Optima Garant Sonne“ und Netz NÖ (Stand 2026) – vor dem Speichern mit der eigenen Rechnung abgleichen.

Preisänderung? Neue Tarifversion mit dem Gültig-ab-Datum anlegen. Ältere Zeiträume werden weiter mit dem alten Tarif berechnet.

## Kachel für andere Dashboards

Nach der Installation steht im Kartenauswahl-Dialog **„Energiekosten Gerät“** zur Verfügung (kein extra Ressourcen-Eintrag nötig). Zeigt die Kosten eines Geräts im laufenden Tag/Woche/Monat/Jahr samt kWh und Mini-Verlauf; Klick öffnet das Panel.

```yaml
type: custom:energiekosten-card
stat_id: sensor.kaffeemaschine_energy
period: month        # day | week | month | year
show_chart: true
gross: true          # optional, sonst Standard aus den Einstellungen
name: Kaffee         # optional
```

## Voraussetzungen

- Home Assistant 2026.1 oder neuer
- Netzbezug (Hauptzähler) und Geräte als Energiesensoren mit Langzeitstatistik (`state_class: total` / `total_increasing`)

## Hinweise

- Kosten gibt es nur für Zeiträume, für die Statistiken vorliegen. Hat ein Gerät erst seit Oktober einen Zähler, zählt der Verbrauch davor zu „Nicht erfasst“.
- Die Umsatzsteuer wird über die Gesamtsumme berechnet; Versorger runden teilweise je Rechnungsteil, Abweichungen von 1–2 Cent sind möglich.
- Einstellungen ändern dürfen nur Administratoren; die Übersicht sehen alle Benutzer.

## Entwicklung

```
frontend/   Panel-Quellcode (Lit), Build: cd frontend && npm ci && npm run build
tests/      pytest (Rechenkern + Integration mit pytest-homeassistant-custom-component)
```
