// Lovelace-Kachel: Kosten eines Geräts im gewählten Zeitraum + Mini-Verlauf
import { LitElement, html, css, nothing } from "lit";
import "./charts.js";
import { periodRange, periodLabel, fmtEur, fmtKwh, PERIODS } from "./util.js";

const DOMAIN = "energiekostenaufstellung";
const BUCKET = { day: "hour", week: "day", month: "day", year: "month" };
const PERIOD_NOUN = { day: "Heute", week: "Diese Woche", month: "Dieser Monat", year: "Dieses Jahr" };

async function fetchDevices(hass) {
  const info = await hass.callWS({ type: `${DOMAIN}/settings` });
  return { devices: info.devices.filter((d) => !d.ignored), display: info.settings.display };
}

class EnergiekostenCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _data: { state: true },
    _error: { state: true },
    _period: { state: true },
  };

  static async getStubConfig(hass) {
    try {
      const { devices } = await fetchDevices(hass);
      return { stat_id: devices[0]?.stat_id ?? "", period: "month", show_chart: true };
    } catch (e) {
      return { stat_id: "", period: "month", show_chart: true };
    }
  }

  static getConfigElement() {
    return document.createElement("energiekosten-card-editor");
  }

  setConfig(config) {
    if (!config) throw new Error("Ungültige Konfiguration");
    this._config = { period: "month", show_chart: true, period_selector: true, ...config };
    this._period = this._storedPeriod() || this._config.period;
    this._loadedFor = null;
    if (this.hass) this._load();
  }

  get _storeKey() {
    return `energiekosten-card:${this._config.stat_id}:${this._config.period}`;
  }

  _storedPeriod() {
    try {
      const v = window.localStorage.getItem(this._storeKey);
      return PERIODS.some((p) => p.id === v) ? v : null;
    } catch (e) {
      return null;
    }
  }

  _selectPeriod(ev, id) {
    ev.stopPropagation();
    if (id === this._period) return;
    this._period = id;
    try {
      window.localStorage.setItem(this._storeKey, id);
    } catch (e) {
      /* ohne Speicher weiter */
    }
    this._load(true);
  }

  getCardSize() {
    return this._config?.show_chart ? 3 : 2;
  }

  getGridOptions() {
    return { columns: 6, rows: this._config?.show_chart ? 3 : 2, min_columns: 4, min_rows: 2 };
  }

  connectedCallback() {
    super.connectedCallback();
    this._timer = setInterval(() => this._load(true), 5 * 60 * 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._timer);
  }

  updated(changed) {
    if (changed.has("hass") && this.hass && this._config && this._loadedFor !== JSON.stringify(this._config) + this._period) {
      this._load();
    }
  }

  async _load(force = false) {
    if (!this.hass || !this._config) return;
    const key = JSON.stringify(this._config) + this._period;
    if (!force && this._loadedFor === key) return;
    this._loadedFor = key;
    if (!this._config.stat_id) {
      this._error = "Bitte ein Gerät auswählen.";
      return;
    }
    const period = this._period;
    const { start, end } = periodRange(period, new Date());
    try {
      const r = await this.hass.callWS({
        type: `${DOMAIN}/report`,
        start: start.toISOString(),
        end: end.toISOString(),
        bucket: BUCKET[period],
        stat_ids: [this._config.stat_id],
      });
      const dev = r.devices[0];
      if (!dev) {
        this._error = `Gerät ${this._config.stat_id} ist in der Energiekostenaufstellung nicht vorhanden.`;
        this._data = null;
        return;
      }
      if (period !== this._period) return; // inzwischen umgeschaltet
      this._data = { r, dev, start, end, period };
      this._error = null;
    } catch (e) {
      this._error = e?.message || String(e);
    }
  }

  _open() {
    history.pushState(null, "", "/energiekosten");
    window.dispatchEvent(new CustomEvent("location-changed"));
  }

  render() {
    if (!this._config) return nothing;
    const c = this._config;
    const d = this._data;
    const gross = c.gross ?? d?.r?.display?.gross ?? true;
    const name = c.name || d?.dev?.name || c.stat_id;
    const color = d?.dev?.color || "var(--primary-color)";
    const cost = d ? (gross ? d.dev.cost.gross : d.dev.cost.net) : null;
    const series = d?.r?.series;
    const values = series ? (series.devices[d.dev.stat_id] || []).map((v) => (gross ? v[0] : v[1])) : [];
    return html`
      <ha-card @click=${this._open}>
        <div class="head">
          <span class="dot" style="background:${color}"></span>
          <span class="name">${name}</span>
          ${c.period_selector
            ? html`<span class="seg">
                ${PERIODS.map(
                  (p) => html`<button class=${p.id === this._period ? "on" : ""} title=${p.label}
                    @click=${(ev) => this._selectPeriod(ev, p.id)}>${p.label[0]}</button>`
                )}
              </span>`
            : html`<span class="period">${d ? periodLabel(d.period, d.start, d.end) : PERIOD_NOUN[this._period]}</span>`}
        </div>
        ${this._error
          ? html`<div class="err">${this._error}</div>`
          : html`<div class="vals">
              <span class="cost">${fmtEur(cost)}</span>
              <span class="kwh">${d ? fmtKwh(d.dev.cost.kwh) : ""}</span>
              <span class="hint">
                ${c.period_selector && d ? html`${periodLabel(d.period, d.start, d.end)} · ` : nothing}${gross ? "brutto" : "netto"}
              </span>
            </div>
            ${c.show_chart && series
              ? html`<ekd-stacked-chart compact .height=${56} .keys=${series.keys} .bucket=${series.bucket}
                  .stacks=${[{ name, color, values }]} unit="eur"></ekd-stacked-chart>`
              : nothing}`}
      </ha-card>
    `;
  }

  static styles = css`
    ha-card { padding: 12px 14px 10px; cursor: pointer; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; }
    .head { display: flex; align-items: center; gap: 8px; font-size: 14px; }
    .dot { width: 10px; height: 10px; border-radius: 50%; flex: none; }
    .name { font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .period { margin-left: auto; color: var(--secondary-text-color); font-size: 12px; white-space: nowrap; }
    .vals { display: flex; align-items: baseline; gap: 10px; margin: 6px 0 4px; }
    .cost { font-size: 26px; font-weight: 500; font-variant-numeric: tabular-nums; }
    .kwh { color: var(--secondary-text-color); font-size: 13px; }
    .hint { margin-left: auto; color: var(--secondary-text-color); font-size: 11px; white-space: nowrap; }
    .seg { margin-left: auto; display: inline-flex; border: 1px solid var(--divider-color); border-radius: 12px; overflow: hidden; flex: none; }
    .seg button {
      border: none; background: transparent; color: var(--secondary-text-color); font: inherit; font-size: 12px;
      padding: 2px 8px; cursor: pointer; min-width: 26px;
    }
    .seg button.on { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    ekd-stacked-chart { margin-top: auto; }
    .err { color: var(--error-color, #db4437); font-size: 13px; padding: 8px 0; }
  `;
}

class EnergiekostenCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _devices: { state: true },
  };

  setConfig(config) {
    this._config = config;
  }

  updated(changed) {
    if (changed.has("hass") && this.hass && !this._devices) {
      this._devices = [];
      fetchDevices(this.hass)
        .then(({ devices }) => (this._devices = devices))
        .catch(() => {});
    }
  }

  _schema() {
    return [
      {
        name: "stat_id",
        required: true,
        selector: {
          select: {
            mode: "dropdown",
            options: (this._devices || []).map((d) => ({ value: d.stat_id, label: d.name })),
          },
        },
      },
      { name: "name", selector: { text: {} } },
      {
        name: "period",
        selector: { select: { mode: "dropdown", options: PERIODS.map((p) => ({ value: p.id, label: p.label })) } },
      },
      { name: "period_selector", selector: { boolean: {} } },
      { name: "show_chart", selector: { boolean: {} } },
      { name: "gross", selector: { boolean: {} } },
    ];
  }

  _label = (s) =>
    ({
      stat_id: "Gerät",
      name: "Name (optional)",
      period: "Standard-Zeitraum (laufend)",
      period_selector: "Zeitraum in der Kachel umschaltbar (T/W/M/J)",
      show_chart: "Mini-Verlauf anzeigen",
      gross: "Brutto (inkl. USt)",
    })[s.name] ?? s.name;

  _changed(ev) {
    const config = { ...ev.detail.value };
    if (!config.name) delete config.name;
    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }

  render() {
    if (!this.hass || !this._config) return nothing;
    const data = { period: "month", show_chart: true, period_selector: true, gross: true, ...this._config };
    return html`<ha-form .hass=${this.hass} .data=${data} .schema=${this._schema()}
      .computeLabel=${this._label} @value-changed=${this._changed}></ha-form>`;
  }
}

if (!customElements.get("energiekosten-card")) customElements.define("energiekosten-card", EnergiekostenCard);
if (!customElements.get("energiekosten-card-editor"))
  customElements.define("energiekosten-card-editor", EnergiekostenCardEditor);

window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === "energiekosten-card")) {
  window.customCards.push({
    type: "energiekosten-card",
    name: "Energiekosten Gerät",
    description: "Stromkosten eines Geräts im laufenden Zeitraum mit Mini-Verlauf (Energiekostenaufstellung)",
    preview: true,
    documentationURL: "https://github.com/derSchluchti/ha-energiekostenaufstellung-dashboard",
  });
}
