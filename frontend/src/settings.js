import { LitElement, html, css, nothing } from "lit";
import { CATEGORIES, deepCopy, exampleTariffVersion, emptyTariffVersion } from "./util.js";

const DOMAIN = "energiekostenaufstellung";
const MONTH_SHORT = ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const GROUPINGS = [
  { id: "none", label: "Keine" },
  { id: "area", label: "Bereich" },
  { id: "floor", label: "Stockwerk (sonst Bereich)" },
  { id: "custom", label: "Eigene Gruppen" },
];

class EkdSettings extends LitElement {
  static properties = {
    hass: { attribute: false },
    _info: { state: true },
    _s: { state: true },
    _dirty: { state: true },
    _msg: { state: true },
    _addSel: { state: true },
  };

  connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  async _load() {
    try {
      this._info = await this.hass.callWS({ type: `${DOMAIN}/settings` });
      this._s = deepCopy(this._info.settings);
      this._dirty = false;
      this._msg = null;
    } catch (e) {
      this._msg = { error: true, text: e?.message || String(e) };
    }
  }

  get _ro() {
    return !this._info?.can_edit;
  }

  _change(mutator) {
    const s = deepCopy(this._s);
    mutator(s);
    this._s = s;
    this._dirty = true;
  }

  async _save() {
    try {
      await this.hass.callWS({ type: `${DOMAIN}/save_settings`, settings: this._s });
      this._msg = { text: "Gespeichert." };
      await this._load();
      this._msg = { text: "Gespeichert." };
      this.dispatchEvent(new CustomEvent("settings-saved", { bubbles: true, composed: true }));
    } catch (e) {
      this._msg = { error: true, text: e?.message || String(e) };
    }
  }

  // --- Tarif ---------------------------------------------------------------
  _addVersion(example) {
    this._change((s) => {
      const versions = s.tariff.versions;
      let v;
      if (example) v = exampleTariffVersion();
      else if (versions.length) {
        v = deepCopy(versions[versions.length - 1]);
        v.valid_from = new Date().toISOString().slice(0, 10);
      } else v = emptyTariffVersion();
      if (versions.some((x) => x.valid_from === v.valid_from)) {
        const d = new Date(v.valid_from);
        d.setDate(d.getDate() + 1);
        v.valid_from = d.toISOString().slice(0, 10);
      }
      versions.push(v);
      versions.sort((a, b) => a.valid_from.localeCompare(b.valid_from));
    });
  }

  _fmt(value) {
    return value == null ? "" : String(value).replace(".", ",");
  }

  _num(value) {
    if (value === "" || value == null) return null;
    const n = Number(String(value).replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }

  _renderVersion(v, vi) {
    const ro = this._ro;
    const upd = (fn) => this._change((s) => fn(s.tariff.versions[vi]));
    const win = v.reduced_window;
    return html`
      <div class="version">
        <div class="row">
          <label>Gültig ab <input type="date" .value=${v.valid_from} ?disabled=${ro}
            @change=${(e) => upd((x) => (x.valid_from = e.target.value))} /></label>
          <label>USt % <input class="short" type="text" inputmode="decimal" .value=${this._fmt(v.vat_percent)} ?disabled=${ro}
            @change=${(e) => upd((x) => (x.vat_percent = this._num(e.target.value) ?? 0))} /></label>
          ${ro ? nothing : html`<button class="danger" @click=${() => this._change((s) => s.tariff.versions.splice(vi, 1))}>Version löschen</button>`}
        </div>

        <div class="row">
          <label><input type="checkbox" .checked=${!!win} ?disabled=${ro}
            @change=${(e) => upd((x) => (x.reduced_window = e.target.checked ? { months: [4, 5, 6, 7, 8, 9], start_hour: 10, end_hour: 16 } : null))} />
            Rabattfenster (z. B. SNAP / Nebenzeit)</label>
        </div>
        ${win
          ? html`<div class="row indent">
              <span class="months">${MONTH_SHORT.map(
                (m, i) => html`<label class="chip"><input type="checkbox" .checked=${win.months.includes(i + 1)} ?disabled=${ro}
                  @change=${(e) => upd((x) => {
                    const set = new Set(x.reduced_window.months);
                    e.target.checked ? set.add(i + 1) : set.delete(i + 1);
                    x.reduced_window.months = [...set].sort((a, b) => a - b);
                  })} />${m}</label>`
              )}</span>
              <label>von <input class="short" type="number" min="0" max="23" .value=${String(win.start_hour)} ?disabled=${ro}
                @change=${(e) => upd((x) => (x.reduced_window.start_hour = Number(e.target.value)))} /> Uhr</label>
              <label>bis <input class="short" type="number" min="1" max="24" .value=${String(win.end_hour)} ?disabled=${ro}
                @change=${(e) => upd((x) => (x.reduced_window.end_hour = Number(e.target.value)))} /> Uhr</label>
            </div>`
          : nothing}

        <h4>Verbrauchsabhängig (netto, ct/kWh)</h4>
        <table>
          <tr><th>Bezeichnung</th><th>Kategorie</th><th>Normal</th>${win ? html`<th>Rabattfenster</th>` : nothing}<th></th></tr>
          ${v.variable.map(
            (p, pi) => html`<tr>
              <td><input class="wide" .value=${p.name} ?disabled=${ro} @change=${(e) => upd((x) => (x.variable[pi].name = e.target.value))} /></td>
              <td>${this._catSelect(p.category, ro, (val) => upd((x) => (x.variable[pi].category = val)))}</td>
              <td><input class="short" inputmode="decimal" .value=${this._fmt(p.price_ct)} ?disabled=${ro}
                @change=${(e) => upd((x) => (x.variable[pi].price_ct = this._num(e.target.value) ?? 0))} /></td>
              ${win
                ? html`<td><input class="short" inputmode="decimal" placeholder="wie normal" .value=${this._fmt(p.price_reduced_ct)} ?disabled=${ro}
                    @change=${(e) => upd((x) => (x.variable[pi].price_reduced_ct = this._num(e.target.value)))} /></td>`
                : nothing}
              <td>${ro ? nothing : html`<button class="icon" title="Entfernen" @click=${() => upd((x) => x.variable.splice(pi, 1))}>✕</button>`}</td>
            </tr>`
          )}
        </table>
        ${ro ? nothing : html`<button @click=${() => upd((x) => x.variable.push({ name: "", category: "energie", price_ct: 0, price_reduced_ct: null }))}>+ Position</button>`}

        <h4>Fixkosten (netto, € pro Jahr)</h4>
        <table>
          <tr><th>Bezeichnung</th><th>Kategorie</th><th>€/Jahr</th><th></th></tr>
          ${v.fixed.map(
            (p, pi) => html`<tr>
              <td><input class="wide" .value=${p.name} ?disabled=${ro} @change=${(e) => upd((x) => (x.fixed[pi].name = e.target.value))} /></td>
              <td>${this._catSelect(p.category, ro, (val) => upd((x) => (x.fixed[pi].category = val)))}</td>
              <td><input class="short" inputmode="decimal" .value=${this._fmt(p.eur_per_year)} ?disabled=${ro}
                @change=${(e) => upd((x) => (x.fixed[pi].eur_per_year = this._num(e.target.value) ?? 0))} /></td>
              <td>${ro ? nothing : html`<button class="icon" title="Entfernen" @click=${() => upd((x) => x.fixed.splice(pi, 1))}>✕</button>`}</td>
            </tr>`
          )}
        </table>
        ${ro ? nothing : html`<button @click=${() => upd((x) => x.fixed.push({ name: "", category: "netz", eur_per_year: 0 }))}>+ Fixkosten</button>`}
      </div>
    `;
  }

  _catSelect(value, ro, onChange) {
    return html`<select ?disabled=${ro} @change=${(e) => onChange(e.target.value)}>
      ${CATEGORIES.map((c) => html`<option value=${c.id} ?selected=${c.id === value}>${c.label}</option>`)}
    </select>`;
  }

  // --- Geräte --------------------------------------------------------------
  _dev(stat_id) {
    return this._s.devices[stat_id] || {};
  }

  _updDev(stat_id, patch) {
    this._change((s) => {
      s.devices[stat_id] = { ...(s.devices[stat_id] || {}), ...patch };
    });
  }

  _renderDevices() {
    const ro = this._ro;
    const custom = this._s.grouping === "custom";
    const pending = Object.entries(this._s.devices)
      .filter(([id, d]) => d.manual && !this._info.devices.some((x) => x.stat_id === id))
      .map(([id]) => ({ stat_id: id, name: id, source: "manual", color: "#888" }));
    const list = [...this._info.devices, ...pending];
    return html`
      <table>
        <tr><th></th><th>Name</th><th>Entity</th><th>${custom ? "Gruppe" : "Gruppe (leer = automatisch)"}</th><th>Farbe</th><th>Ignorieren</th><th></th></tr>
        ${list.map((d) => {
          const ov = this._dev(d.stat_id);
          return html`<tr class=${ov.ignored ? "ignored" : ""}>
            <td><span class="tag">${d.source === "energy" ? "auto" : "manuell"}</span></td>
            <td><input class="wide" placeholder=${d.name} .value=${ov.name || ""} ?disabled=${ro}
              @change=${(e) => this._updDev(d.stat_id, { name: e.target.value || null })} /></td>
            <td class="muted">${d.stat_id}</td>
            <td><input placeholder=${d.group || ""} .value=${ov.group || ""} ?disabled=${ro}
              @change=${(e) => this._updDev(d.stat_id, { group: e.target.value || null })} /></td>
            <td><input type="color" .value=${ov.color || d.color || "#888888"} ?disabled=${ro}
              @change=${(e) => this._updDev(d.stat_id, { color: e.target.value })} /></td>
            <td><input type="checkbox" .checked=${!!ov.ignored} ?disabled=${ro}
              @change=${(e) => this._updDev(d.stat_id, { ignored: e.target.checked })} /></td>
            <td>${!ro && d.source === "manual"
              ? html`<button class="icon" title="Entfernen" @click=${() => this._change((s) => delete s.devices[d.stat_id])}>✕</button>`
              : nothing}</td>
          </tr>`;
        })}
      </table>
      ${ro
        ? nothing
        : html`<div class="row">
            <select id="addsel" @change=${(e) => (this._addSel = e.target.value)}>
              <option value="">Energiesensor auswählen …</option>
              ${this._info.candidates
                .filter((c) => !this._s.devices[c.entity_id]?.manual)
                .map((c) => html`<option value=${c.entity_id}>${c.name} (${c.entity_id})</option>`)}
            </select>
            <button ?disabled=${!this._addSel}
              @click=${() => {
                this._updDev(this._addSel, { manual: true, ignored: false });
                this._addSel = "";
                this.shadowRoot.getElementById("addsel").value = "";
              }}>+ Gerät hinzufügen</button>
          </div>`}
      <div class="muted small">Geräte aus dem HA-Energie-Dashboard werden automatisch übernommen. Ignorierte Geräte zählen zu „Nicht erfasst“.</div>
    `;
  }

  _actions() {
    return html`<div class="actions">
      <button class="primary" ?disabled=${!this._dirty} @click=${this._save}>Speichern</button>
      <button ?disabled=${!this._dirty} @click=${this._load}>Verwerfen</button>
      ${this._dirty ? html`<span class="muted">Ungespeicherte Änderungen</span>` : nothing}
      ${this._msg ? html`<span class=${this._msg.error ? "err" : "ok"}>${this._msg.text}</span>` : nothing}
    </div>`;
  }

  render() {
    if (!this._s) return html`${this._msg ? html`<div class="warn">${this._msg.text}</div>` : html`lädt …`}`;
    const ro = this._ro;
    const s = this._s;
    return html`
      ${ro
        ? html`<div class="info">Nur Administratoren können die Einstellungen ändern (angemeldet als: ${this.hass?.user?.name ?? "?"}).</div>`
        : this._actions()}

      <section>
        <h3>Tarif</h3>
        ${s.tariff.versions.length === 0 ? html`<div class="muted">Noch kein Tarif hinterlegt.</div>` : nothing}
        ${s.tariff.versions.map((v, i) => this._renderVersion(v, i))}
        ${ro
          ? nothing
          : html`<div class="row">
              <button @click=${() => this._addVersion(false)}>+ Neue Tarifversion</button>
              <button @click=${() => this._addVersion(true)}>Beispiel einfügen: EVN NÖ „Optima Garant Sonne“ 2026</button>
            </div>`}
      </section>

      <section>
        <h3>Netzbezug</h3>
        <div class="row">
          <label>Statistik des Hauptzählers
            <input class="wide" placeholder=${this._info.grid_stat_auto || "sensor.…"} .value=${s.grid_stat || ""} ?disabled=${ro}
              @change=${(e) => this._change((x) => (x.grid_stat = e.target.value || null))} /></label>
        </div>
        <div class="muted small">Leer lassen = Netzquelle aus dem HA-Energie-Dashboard (${this._info.grid_stat_auto || "keine gefunden"}).</div>
      </section>

      <section>
        <h3>Geräte</h3>
        <div class="row">
          <label>Gruppierung
            <select ?disabled=${ro} @change=${(e) => this._change((x) => (x.grouping = e.target.value))}>
              ${GROUPINGS.map((g) => html`<option value=${g.id} ?selected=${g.id === s.grouping}>${g.label}</option>`)}
            </select></label>
        </div>
        ${this._renderDevices()}
      </section>

      <section>
        <h3>Anzeige (Standard für alle)</h3>
        <div class="row">
          <label><input type="checkbox" .checked=${s.display.gross} ?disabled=${ro}
            @change=${(e) => this._change((x) => (x.display.gross = e.target.checked))} /> Brutto anzeigen</label>
          <label><input type="checkbox" .checked=${s.display.breakdown} ?disabled=${ro}
            @change=${(e) => this._change((x) => (x.display.breakdown = e.target.checked))} /> Aufschlüsselung</label>
          <label><input type="checkbox" .checked=${s.display.projection} ?disabled=${ro}
            @change=${(e) => this._change((x) => (x.display.projection = e.target.checked))} /> Hochrechnung</label>
        </div>
        <div class="muted small">Die Umschalter in der Übersicht merken sich pro Benutzer die eigene Wahl.</div>
      </section>

      ${ro ? nothing : this._actions()}

    `;
  }

  static styles = css`
    :host { display: block; }
    section {
      background: var(--card-background-color); border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px); padding: 8px 16px 16px; margin-bottom: 16px;
    }
    h3 { margin: 8px 0 12px; font-weight: 500; }
    h4 { margin: 16px 0 6px; font-weight: 500; font-size: 14px; color: var(--secondary-text-color); }
    .version { border-left: 3px solid var(--primary-color); padding: 4px 0 12px 12px; margin-bottom: 16px; }
    .row { display: flex; flex-wrap: wrap; gap: 10px 18px; align-items: center; margin: 8px 0; }
    .indent { margin-left: 24px; }
    label { display: inline-flex; align-items: center; gap: 6px; }
    input, select {
      font: inherit; color: var(--primary-text-color); background: var(--secondary-background-color);
      border: 1px solid var(--divider-color); border-radius: 6px; padding: 5px 8px;
    }
    input[type="checkbox"] { width: auto; padding: 0; }
    input[type="color"] { padding: 0; width: 36px; height: 28px; }
    input.short { width: 70px; }
    input.wide { width: 320px; }
    table { border-collapse: collapse; }
    th { text-align: left; font-weight: 500; font-size: 12px; color: var(--secondary-text-color); padding: 4px 6px; }
    td { padding: 3px 6px; }
    tr.ignored td { opacity: 0.5; }
    .months { display: inline-flex; flex-wrap: wrap; gap: 4px; }
    .chip { border: 1px solid var(--divider-color); border-radius: 12px; padding: 2px 8px; font-size: 12px; }
    .tag { font-size: 11px; border-radius: 8px; padding: 1px 6px; background: var(--secondary-background-color); color: var(--secondary-text-color); }
    button {
      background: transparent; color: var(--primary-text-color); border: 1px solid var(--divider-color);
      border-radius: 18px; padding: 6px 14px; font: inherit; cursor: pointer;
    }
    button:disabled { opacity: 0.5; cursor: default; }
    button.primary { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: var(--primary-color); }
    button.danger { color: var(--error-color, #db4437); border-color: var(--error-color, #db4437); }
    button.icon { border: none; padding: 2px 8px; color: var(--secondary-text-color); }
    .muted { color: var(--secondary-text-color); }
    .small { font-size: 12px; }
    .info { background: var(--info-color, #039be5); color: #fff; padding: 8px 12px; border-radius: 8px; margin-bottom: 12px; }
    .warn { background: var(--warning-color, #ffa600); color: #000; padding: 8px 12px; border-radius: 8px; }
    .actions {
      display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin: 0 0 16px;
      padding: 10px 16px; border: 1px solid var(--divider-color); border-radius: var(--ha-card-border-radius, 12px);
      background: var(--card-background-color);
    }
    .ok { color: var(--success-color, #43a047); }
    .err { color: var(--error-color, #db4437); }
  `;
}

customElements.define("ekd-settings", EkdSettings);
