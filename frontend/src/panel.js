import { LitElement, html, css } from "lit";
import "./overview.js";
import "./settings.js";

class EnergiekostenPanel extends LitElement {
  static properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    route: { attribute: false },
    panel: { attribute: false },
    _tab: { state: true },
  };

  constructor() {
    super();
    this._tab = "overview";
  }

  _onSaved() {
    this.shadowRoot.querySelector("ekd-overview")?.refresh();
  }

  render() {
    return html`
      <div class="header">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">Energiekosten</div>
        <div class="tabs">
          <button class=${this._tab === "overview" ? "on" : ""} @click=${() => (this._tab = "overview")}>Übersicht</button>
          <button class=${this._tab === "settings" ? "on" : ""} @click=${() => (this._tab = "settings")}>Einstellungen</button>
        </div>
      </div>
      <div class="content" @settings-saved=${this._onSaved}>
        <ekd-overview .hass=${this.hass} ?hidden=${this._tab !== "overview"}></ekd-overview>
        ${this._tab === "settings" ? html`<ekd-settings .hass=${this.hass}></ekd-settings>` : ""}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block; min-height: 100vh; background: var(--primary-background-color);
      color: var(--primary-text-color); font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    }
    .header {
      display: flex; align-items: center; gap: 12px; height: 56px; padding: 0 12px;
      background: var(--app-header-background-color, var(--primary-background-color));
      color: var(--app-header-text-color, var(--primary-text-color));
      border-bottom: 1px solid var(--divider-color); position: sticky; top: 0; z-index: 2;
    }
    .title { font-size: 20px; flex: 1; }
    .tabs button {
      background: transparent; border: none; color: inherit; font: inherit; padding: 16px 14px;
      cursor: pointer; border-bottom: 2px solid transparent; opacity: 0.75;
    }
    .tabs button.on { border-bottom-color: var(--primary-color); opacity: 1; }
    .content { padding: 16px; max-width: 1400px; margin: 0 auto; }
    [hidden] { display: none !important; }
  `;
}

customElements.define("energiekosten-panel", EnergiekostenPanel);
