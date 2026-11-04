// Hilfsfunktionen: Zeiträume, Formatierung, Beispieltarif

export const PERIODS = [
  { id: "day", label: "Tag" },
  { id: "week", label: "Woche" },
  { id: "month", label: "Monat" },
  { id: "year", label: "Jahr" },
];

export const CATEGORIES = [
  { id: "energie", label: "Energie" },
  { id: "netz", label: "Netz" },
  { id: "abgaben", label: "Abgaben" },
];

const MONTHS = [
  "Jänner", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];
const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

export function periodRange(type, anchor) {
  const d = new Date(anchor);
  const y = d.getFullYear();
  const m = d.getMonth();
  let start;
  let end;
  if (type === "day") {
    start = new Date(y, m, d.getDate());
    end = new Date(y, m, d.getDate() + 1);
  } else if (type === "week") {
    const dow = (d.getDay() + 6) % 7; // Montag = 0
    start = new Date(y, m, d.getDate() - dow);
    end = new Date(y, m, d.getDate() - dow + 7);
  } else if (type === "month") {
    start = new Date(y, m, 1);
    end = new Date(y, m + 1, 1);
  } else {
    start = new Date(y, 0, 1);
    end = new Date(y + 1, 0, 1);
  }
  return { start, end };
}

export function shiftAnchor(type, anchor, dir) {
  const d = new Date(anchor);
  if (type === "day") d.setDate(d.getDate() + dir);
  else if (type === "week") d.setDate(d.getDate() + 7 * dir);
  else if (type === "month") d.setMonth(d.getMonth() + dir, 1);
  else d.setFullYear(d.getFullYear() + dir, 0, 1);
  return d;
}

function isoWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

const pad = (n) => String(n).padStart(2, "0");
const shortDate = (d) => `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.`;

export function periodLabel(type, start, end) {
  if (type === "day") {
    return `${WEEKDAYS[start.getDay()]}, ${start.getDate()}. ${MONTHS[start.getMonth()]} ${start.getFullYear()}`;
  }
  if (type === "week") {
    const last = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 1);
    return `KW ${isoWeek(start)} · ${shortDate(start)}–${shortDate(last)}${last.getFullYear()}`;
  }
  if (type === "month") return `${MONTHS[start.getMonth()]} ${start.getFullYear()}`;
  return String(start.getFullYear());
}

const eur = new Intl.NumberFormat("de-AT", { style: "currency", currency: "EUR" });
const num2 = new Intl.NumberFormat("de-AT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = new Intl.NumberFormat("de-AT", { style: "percent", maximumFractionDigits: 1 });

export const fmtEur = (v) => (v == null || Number.isNaN(v) ? "–" : eur.format(v));
export const fmtNum = (v) => (v == null || Number.isNaN(v) ? "–" : num2.format(v));
export const fmtKwh = (v) => (v == null ? "–" : `${num2.format(v)} kWh`);
export const fmtPct = (v) => (v == null || !Number.isFinite(v) ? "–" : pct.format(v));

export const deepCopy = (o) => JSON.parse(JSON.stringify(o));

// Beispieltarif: öffentliche Preise EVN NÖ „Optima Garant Sonne“ + Netz NÖ, Stand 2026 (netto)
export function exampleTariffVersion() {
  return {
    valid_from: `${new Date().getFullYear()}-01-01`,
    vat_percent: 20,
    reduced_window: { months: [4, 5, 6, 7, 8, 9], start_hour: 10, end_hour: 16 },
    variable: [
      { name: "Verbrauchspreis Energie", category: "energie", price_ct: 10.5, price_reduced_ct: 6.9 },
      { name: "Verbrauchspreis Netznutzung", category: "netz", price_ct: 8.79, price_reduced_ct: 7.03 },
      { name: "Verbrauchspreis Netzverlust", category: "netz", price_ct: 0.384, price_reduced_ct: null },
      { name: "Elektrizitätsabgabe", category: "abgaben", price_ct: 0.1, price_reduced_ct: null },
      { name: "Erneuerbaren-Förderbeitrag Netznutzung", category: "abgaben", price_ct: 0.583, price_reduced_ct: null },
      { name: "Erneuerbaren-Förderbeitrag Netzverlust", category: "abgaben", price_ct: 0.037, price_reduced_ct: null },
    ],
    fixed: [
      { name: "Grundpreis Energie", category: "energie", eur_per_year: 72.0 },
      { name: "Grundpreis Netz", category: "netz", eur_per_year: 54.0 },
      { name: "Entgelt für Messleistungen", category: "netz", eur_per_year: 26.16 },
      { name: "Erneuerbaren-Förderpauschale", category: "abgaben", eur_per_year: 19.02 },
      { name: "Erneuerbaren-Förderbeitrag Grundpreis", category: "abgaben", eur_per_year: 3.8 },
    ],
  };
}

export function emptyTariffVersion() {
  return {
    valid_from: new Date().toISOString().slice(0, 10),
    vat_percent: 20,
    reduced_window: null,
    variable: [{ name: "Energie", category: "energie", price_ct: 0, price_reduced_ct: null }],
    fixed: [],
  };
}
