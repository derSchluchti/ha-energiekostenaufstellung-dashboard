import { LitElement, html, css, nothing } from "lit";
import {
  PERIODS,
  CATEGORIES,
  periodRange,
  shiftAnchor,
  periodLabel,
  fmtEur,
  fmtKwh,
  fmtPct,
} from "./util.js";

const DOMAIN = "energiekostenaufstellung";
const USER_DATA_KEY = `${DOMAIN}_display`;

class EkdOverview extends LitElement {
  static properties = {
    hass: { attribute: false },
    _period: { state: true },
    _anchor: { state: true },
    _report: { state: true },
    _error: { state: true },
    _loading: { state: true },
    _display: { state: true },
    _collapsed: { state: true },
  };

  constructor() {
    super();
    this._period = "month";
    this._anchor = new Date();
    this._display = null;
    this._collapsed = new Set();
    this._loading = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadUserDisplay().then(() => this.refresh());
    this._timer = setInterval(() => {
      if (this._report?.period?.is_current) this.refresh();
    }, 5 * 60 * 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._timer);
  }

  async _loadUserDisplay() {
    try {
      const res = await this.hass.callWS({ type: "frontend/get_user_data", key: USER_DATA_KEY });
      if (res?.value) {
        this._display = res.value.display ?? null;
        if (res.value.period) this._period = res.value.period;
      }
    } catch (e) {
      /* ohne Benutzerdaten weiter */
    }
  }

  _saveUserDisplay() {
    this.hass
      .callWS({
        type: "frontend/set_user_data",
        key: USER_DATA_KEY,
        value: { display: this._display, period: this._period },
      })
      .catch(() => {});
  }

  get _effectiveDisplay() {
    return this._display ?? this._report?.display ?? { gross: true, breakdown: true, projection: false };
  }

  async refresh() {
    const { start, end } = periodRange(this._period, this._anchor);
    this._loading = true;
    try {
      this._report = await this.hass.callWS({
        type: `${DOMAIN}/report`,
        start: start.toISOString(),
        end: end.toISOString(),
      });
      this._error = null;
    } catch (e) {
      this._error = e?.message || String(e);
    } finally {
      this._loading = false;
    }
  }

  _setPeriod(id) {
    this._period = id;
    this._anchor = new Date();
    this._saveUserDisplay();
    this.refresh();
  }

  _shift(dir) {
    this._anchor = shiftAnchor(this._period, this._anchor, dir);
    this.refresh();
  }

  _today() {
    this._anchor = new Date();
    this.refresh();
  }

  _toggle(key) {
    this._display = { ...this._effectiveDisplay, [key]: !this._effectiveDisplay[key] };
    this._saveUserDisplay();
  }

  _toggleGroup(name) {
    const s = new Set(this._collapsed);
    s.has(name) ? s.delete(name) : s.add(name);
    this._collapsed = s;
  }

  // --- Werte je nach Netto/Brutto ---------------------------------------
  _val(cost, gross) {
    if (!cost) return null;
    return gross ? cost.gross : cost.net;
  }

  _cells(cost, gross, breakdown) {
    if (!breakdown) return nothing;
    return html`
      ${CATEGORIES.map((c) => html`<td class="num">${cost && cost[`net_${c.id}`] != null ? fmtEur(cost[`net_${c.id}`]) : ""}</td>`)}
      ${gross ? html`<td class="num">${fmtEur(cost ? cost.vat : null)}</td>` : nothing}
    `;
  }

  _fixedAsCost(line) {
    // Fixkosten-Zeile in das Format der variablen Kosten bringen
    const c = { kwh: null, net: line.net, vat: line.vat, gross: line.gross };
    for (const cat of CATEGORIES) c[`net_${cat.id}`] = cat.id === line.category ? line.net : null;
    return c;
  }

  _sumCosts(list) {
    const out = { kwh: 0, net: 0, vat: 0, gross: 0 };
    for (const cat of CATEGORIES) out[`net_${cat.id}`] = 0;
    for (const c of list) {
      if (!c) continue;
      for (const k of Object.keys(out)) out[k] += c[k] ?? 0;
    }
    return out;
  }

  _row({ name, color, cost, projection, share, cls = "", disp, indent = false, kwh = true, onClick }) {
    const { gross, breakdown, projection: showProj } = disp;
    const showProjCol = showProj && this._report.period.is_current;
    return html`
      <tr class=${cls} @click=${onClick ?? nothing}>
        <td class=${indent ? "name indent" : "name"}>
          ${color ? html`<span class="dot" style="background:${color}"></span>` : nothing}${name}
        </td>
        <td class="num">${kwh && cost?.kwh != null ? fmtKwh(cost.kwh) : ""}</td>
        ${this._cells(cost, gross, breakdown)}
        <td class="num strong">${fmtEur(this._val(cost, gross))}</td>
        <td class="share">
          ${share != null
            ? html`<div class="bar"><div style="width:${Math.max(0, Math.min(1, share)) * 100}%;background:${color || "var(--primary-color)"}"></div></div>
                <span>${fmtPct(share)}</span>`
            : nothing}
        </td>
        ${showProjCol ? html`<td class="num">${projection ? fmtEur(this._val(projection, gross)) : ""}</td>` : nothing}
      </tr>
    `;
  }

  _renderTable() {
    const r = this._report;
    const disp = this._effectiveDisplay;
    const { gross, breakdown, projection } = disp;
    const showProjCol = projection && r.period.is_current;
    const totalVal = this._val(r.total.cost, gross) || 0;
    const share = (cost) => (totalVal > 0 ? (this._val(cost, gross) || 0) / totalVal : null);

    // Gruppen bilden
    const groups = new Map();
    for (const d of r.devices) {
      const g = d.group || "";
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push(d);
    }
    const sortVal = (d) => this._val(d.cost, gross) || 0;
    const groupList = [...groups.entries()].map(([name, devs]) => ({
      name,
      devs: devs.sort((a, b) => sortVal(b) - sortVal(a)),
      cost: this._sumCosts(devs.map((d) => d.cost)),
      projection: showProjCol ? this._sumCosts(devs.map((d) => d.projection)) : null,
    }));
    groupList.sort((a, b) => {
      if (a.name === "Ohne Gruppe") return 1;
      if (b.name === "Ohne Gruppe") return -1;
      return this._val(b.cost, gross) - this._val(a.cost, gross);
    });
    const grouped = groupList.length > 1 || (groupList.length === 1 && groupList[0].name !== "");

    const fixedCost = this._sumCosts(r.fixed.map((l) => this._fixedAsCost(l)));
    const fixedProj = showProjCol
      ? this._sumCosts(r.fixed.map((l) => (l.projection ? this._fixedAsCost({ ...l, ...l.projection }) : null)))
      : null;
    const sum = this._sumCosts([r.total.cost, fixedCost]);
    sum.kwh = r.total.cost.kwh;
    const sumProj = showProjCol ? this._sumCosts([r.total.projection, fixedProj]) : null;
    if (sumProj) sumProj.kwh = r.total.projection?.kwh ?? null;

    return html`
      <table>
        <thead>
          <tr>
            <th class="name">Gerät</th>
            <th class="num">Verbrauch</th>
            ${breakdown
              ? html`${CATEGORIES.map((c) => html`<th class="num">${c.label}</th>`)}${gross ? html`<th class="num">USt</th>` : nothing}`
              : nothing}
            <th class="num">${gross ? "Gesamt brutto" : "Gesamt netto"}</th>
            <th class="share">Anteil</th>
            ${showProjCol ? html`<th class="num">Hochrechnung</th>` : nothing}
          </tr>
        </thead>
        <tbody>
          ${groupList.map(
            (g) => html`
              ${grouped
                ? this._row({
                    name: html`<span class="chev">${this._collapsed.has(g.name) ? "▸" : "▾"}</span>${g.name}`,
                    cost: g.cost,
                    projection: g.projection,
                    share: share(g.cost),
                    cls: "group",
                    disp,
                    onClick: () => this._toggleGroup(g.name),
                  })
                : nothing}
              ${this._collapsed.has(g.name)
                ? nothing
                : g.devs.map((d) =>
                    this._row({
                      name: d.name,
                      color: d.color,
                      cost: d.cost,
                      projection: d.projection,
                      share: share(d.cost),
                      disp,
                      indent: grouped,
                    })
                  )}
            `
          )}
          ${this._row({
            name: "Nicht erfasst",
            color: "var(--disabled-text-color, #888)",
            cost: r.rest.cost,
            projection: r.rest.projection,
            share: share(r.rest.cost),
            cls: "rest",
            disp,
          })}
          ${this._row({
            name: "Variable Kosten gesamt",
            cost: r.total.cost,
            projection: r.total.projection,
            cls: "subtotal",
            disp,
          })}
          <tr class="section"><td colspan="20">Fixkosten (unabhängig vom Verbrauch)</td></tr>
          ${r.fixed.length === 0
            ? html`<tr><td class="name indent muted" colspan="20">Keine Fixkosten im Tarif hinterlegt</td></tr>`
            : r.fixed.map((l) =>
                this._row({
                  name: l.name,
                  cost: this._fixedAsCost(l),
                  projection: l.projection ? this._fixedAsCost({ ...l, ...l.projection }) : null,
                  disp,
                  indent: true,
                  kwh: false,
                })
              )}
          ${this._row({ name: "Fixkosten gesamt", cost: fixedCost, projection: fixedProj, cls: "subtotal", disp, kwh: false })}
          ${this._row({ name: "Summe", cost: sum, projection: sumProj, cls: "total", disp })}
        </tbody>
      </table>
    `;
  }

  render() {
    const { start, end } = periodRange(this._period, this._anchor);
    const disp = this._effectiveDisplay;
    const r = this._report;
    return html`
      <div class="toolbar">
        <div class="seg">
          ${PERIODS.map(
            (p) => html`<button class=${p.id === this._period ? "on" : ""} @click=${() => this._setPeriod(p.id)}>${p.label}</button>`
          )}
        </div>
        <div class="nav">
          <button class="icon" title="Zurück" @click=${() => this._shift(-1)}>‹</button>
          <span class="label">${periodLabel(this._period, start, end)}</span>
          <button class="icon" title="Weiter" @click=${() => this._shift(1)}>›</button>
          <button @click=${this._today}>Heute</button>
        </div>
      </div>
      <div class="toolbar">
        <div class="seg">
          <button class=${!disp.gross ? "on" : ""} @click=${() => disp.gross && this._toggle("gross")}>Netto</button>
          <button class=${disp.gross ? "on" : ""} @click=${() => !disp.gross && this._toggle("gross")}>Brutto</button>
        </div>
        <label><input type="checkbox" .checked=${disp.breakdown} @change=${() => this._toggle("breakdown")} /> Aufschlüsselung</label>
        <label><input type="checkbox" .checked=${disp.projection} @change=${() => this._toggle("projection")} /> Hochrechnung</label>
        ${this._loading ? html`<span class="muted">lädt …</span>` : nothing}
      </div>
      ${this._error ? html`<div class="warn">Fehler: ${this._error}</div>` : nothing}
      ${r?.warnings?.map((w) => html`<div class="warn">${w}</div>`)}
      ${r ? html`<div class="card">${this._renderTable()}</div>` : nothing}
      ${r && disp.projection && !r.period.is_current
        ? html`<div class="muted small">Hochrechnung gibt es nur für den laufenden Zeitraum.</div>`
        : nothing}
      ${r?.ignored?.length
        ? html`<div class="muted small">Ignoriert: ${r.ignored.map((d) => d.name).join(", ")}</div>`
        : nothing}
    `;
  }

  static styles = css`
    :host { display: block; }
    .toolbar { display: flex; flex-wrap: wrap; gap: 12px 20px; align-items: center; margin-bottom: 12px; }
    .seg { display: inline-flex; border: 1px solid var(--divider-color); border-radius: 18px; overflow: hidden; }
    .seg button { border: none; border-radius: 0; }
    button {
      background: transparent; color: var(--primary-text-color); border: 1px solid var(--divider-color);
      border-radius: 18px; padding: 6px 14px; font: inherit; cursor: pointer;
    }
    button.on { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    button.icon { font-size: 20px; line-height: 1; padding: 2px 12px; }
    .nav { display: flex; align-items: center; gap: 8px; }
    .label { min-width: 190px; text-align: center; font-weight: 500; }
    label { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
    .card {
      background: var(--card-background-color); border-radius: var(--ha-card-border-radius, 12px);
      border: 1px solid var(--divider-color); overflow-x: auto;
    }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th, td { padding: 8px 12px; border-bottom: 1px solid var(--divider-color); white-space: nowrap; }
    th { text-align: left; font-weight: 500; color: var(--secondary-text-color); }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    .strong { font-weight: 500; }
    .name.indent { padding-left: 32px; }
    .dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 8px; }
    .chev { display: inline-block; width: 16px; color: var(--secondary-text-color); }
    tr.group { cursor: pointer; background: var(--secondary-background-color); font-weight: 500; }
    tr.rest td.name { font-style: italic; }
    tr.subtotal td { font-weight: 500; border-top: 2px solid var(--divider-color); }
    tr.total td { font-weight: 700; border-top: 3px double var(--divider-color); font-size: 15px; }
    tr.section td { color: var(--secondary-text-color); font-size: 12px; text-transform: uppercase; letter-spacing: .04em; padding-top: 18px; }
    .share { min-width: 140px; }
    .share .bar { display: inline-block; width: 80px; height: 8px; background: var(--divider-color); border-radius: 4px; overflow: hidden; vertical-align: middle; margin-right: 8px; }
    .share .bar div { height: 100%; }
    .share span { font-size: 12px; color: var(--secondary-text-color); }
    .warn { background: var(--warning-color, #ffa600); color: #000; padding: 8px 12px; border-radius: 8px; margin-bottom: 10px; }
    .muted { color: var(--secondary-text-color); }
    .small { font-size: 12px; margin-top: 8px; }
  `;
}

customElements.define("ekd-overview", EkdOverview);
