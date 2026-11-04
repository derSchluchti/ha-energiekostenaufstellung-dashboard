// Schlanke SVG-Diagramme ohne externe Bibliothek
import { LitElement, html, svg, css, nothing } from "lit";
import { fmtEur, fmtKwh, fmtPct } from "./util.js";

const MONTH_SHORT = ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

export const fmtUnit = (v, unit) => (unit === "kwh" ? fmtKwh(v) : fmtEur(v));

function niceMax(v) {
  if (!(v > 0)) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  for (const m of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * exp >= v) return m * exp;
  return 10 * exp;
}

export function bucketLabel(iso, bucket, long = false) {
  const d = new Date(iso);
  if (bucket === "hour") return long ? `${String(d.getHours()).padStart(2, "0")}:00` : String(d.getHours());
  if (bucket === "day") return long ? `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}` : String(d.getDate());
  return long ? `${MONTH_SHORT[d.getMonth()]} ${d.getFullYear()}` : MONTH_SHORT[d.getMonth()];
}

class ResizeAware extends LitElement {
  static properties = { _w: { state: true } };
  connectedCallback() {
    super.connectedCallback();
    this._ro = new ResizeObserver((e) => {
      const w = Math.round(e[0].contentRect.width);
      if (w && w !== this._w) this._w = w;
    });
    this._ro.observe(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._ro?.disconnect();
  }
}

// --- Gestapelte Balken ----------------------------------------------------
export class EkdStackedChart extends ResizeAware {
  static properties = {
    ...ResizeAware.properties,
    keys: { attribute: false },
    bucket: {},
    stacks: { attribute: false }, // [{name, color, values: []}]
    unit: {},
    height: { type: Number },
    compact: { type: Boolean },
    _hover: { state: true },
  };

  constructor() {
    super();
    this.height = 260;
    this.unit = "eur";
  }

  render() {
    const w = this._w || 600;
    const h = this.height;
    const keys = this.keys || [];
    const stacks = this.stacks || [];
    const n = keys.length;
    if (!n) return html`<div class="empty">Keine Daten</div>`;
    const padL = this.compact ? 4 : 56;
    const padR = 8;
    const padT = 10;
    const padB = this.compact ? 4 : 24;
    const cw = w - padL - padR;
    const ch = h - padT - padB;
    const totals = keys.map((_, i) => stacks.reduce((s, st) => s + Math.max(0, st.values[i] || 0), 0));
    const max = niceMax(Math.max(...totals));
    const slot = cw / n;
    const bw = Math.max(1, slot * 0.7);
    const y = (v) => padT + ch - (v / max) * ch;
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
    const labelEvery = Math.max(1, Math.ceil(n / Math.max(1, Math.floor(cw / 34))));

    const bars = [];
    keys.forEach((_, i) => {
      let acc = 0;
      const x = padL + i * slot + (slot - bw) / 2;
      stacks.forEach((st) => {
        const v = Math.max(0, st.values[i] || 0);
        if (v <= 0) return;
        const y1 = y(acc + v);
        const y0 = y(acc);
        bars.push(svg`<rect x=${x} y=${y1} width=${bw} height=${Math.max(0.5, y0 - y1)} fill=${st.color} rx="1.5"></rect>`);
        acc += v;
      });
    });

    const hover = this._hover;
    return html`
      <div class="wrap" @mouseleave=${() => (this._hover = null)}>
        <svg width=${w} height=${h}>
          ${this.compact
            ? nothing
            : ticks.map(
                (t) => svg`<line x1=${padL} x2=${w - padR} y1=${y(t)} y2=${y(t)} class="grid"></line>
                  <text x=${padL - 6} y=${y(t) + 4} text-anchor="end" class="axis">${this.unit === "kwh" ? t.toLocaleString("de-AT", { maximumFractionDigits: 2 }) : fmtEur(t)}</text>`
              )}
          ${bars}
          ${hover != null
            ? svg`<rect x=${padL + hover * slot} y=${padT} width=${slot} height=${ch} class="hl"></rect>`
            : nothing}
          ${this.compact
            ? nothing
            : keys.map((k, i) =>
                i % labelEvery === 0
                  ? svg`<text x=${padL + i * slot + slot / 2} y=${h - 6} text-anchor="middle" class="axis">${bucketLabel(k, this.bucket)}</text>`
                  : nothing
              )}
          ${keys.map(
            (_, i) => svg`<rect x=${padL + i * slot} y=${padT} width=${slot} height=${ch} fill="transparent"
              @mouseenter=${() => (this._hover = i)}></rect>`
          )}
        </svg>
        ${hover != null ? this._tooltip(hover, padL + hover * slot + slot / 2, w) : nothing}
      </div>
      ${this.compact
        ? nothing
        : html`<div class="legend">
            ${stacks.map((s) => html`<span><i style="background:${s.color}"></i>${s.name}</span>`)}
          </div>`}
    `;
  }

  _tooltip(i, x, w) {
    const rows = this.stacks
      .map((s) => ({ ...s, v: s.values[i] || 0 }))
      .filter((s) => Math.abs(s.v) > 1e-9)
      .sort((a, b) => b.v - a.v);
    const total = rows.reduce((s, r) => s + Math.max(0, r.v), 0);
    const left = x > w / 2;
    return html`<div class="tip" style="${left ? `right:${w - x + 10}px` : `left:${x + 10}px`}">
      <b>${bucketLabel(this.keys[i], this.bucket, true)}</b>
      ${rows.map((r) => html`<div><i style="background:${r.color}"></i>${r.name}<span>${fmtUnit(r.v, this.unit)}</span></div>`)}
      <div class="sum">Summe<span>${fmtUnit(total, this.unit)}</span></div>
    </div>`;
  }

  static styles = css`
    :host { display: block; position: relative; }
    .wrap { position: relative; }
    svg { display: block; }
    .grid { stroke: var(--divider-color); stroke-width: 1; }
    .axis { fill: var(--secondary-text-color); font-size: 11px; }
    .hl { fill: var(--primary-text-color); opacity: 0.06; }
    .legend { display: flex; flex-wrap: wrap; gap: 6px 16px; justify-content: center; font-size: 12px; margin-top: 6px; color: var(--secondary-text-color); }
    .legend i, .tip i { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 6px; vertical-align: -1px; }
    .tip {
      position: absolute; top: 8px; pointer-events: none; z-index: 3; min-width: 200px;
      background: var(--card-background-color); border: 1px solid var(--divider-color); border-radius: 8px;
      padding: 8px 10px; font-size: 12px; box-shadow: 0 2px 8px rgba(0,0,0,.3);
    }
    .tip div { display: flex; align-items: center; gap: 2px; margin-top: 3px; }
    .tip span { margin-left: auto; padding-left: 14px; font-variant-numeric: tabular-nums; }
    .tip .sum { border-top: 1px solid var(--divider-color); padding-top: 3px; font-weight: 500; }
    .empty { color: var(--secondary-text-color); padding: 24px; text-align: center; }
  `;
}
if (!customElements.get("ekd-stacked-chart")) customElements.define("ekd-stacked-chart", EkdStackedChart);

// --- Ring -------------------------------------------------------------------
export class EkdDonut extends LitElement {
  static properties = {
    segments: { attribute: false }, // [{name, color, value}]
    unit: {},
    label: {},
    _hover: { state: true },
  };

  render() {
    const segs = (this.segments || []).filter((s) => s.value > 0);
    const total = segs.reduce((s, x) => s + x.value, 0);
    const R = 80;
    const r = 52;
    const c = 100;
    let a0 = -Math.PI / 2;
    const arcs = segs.map((s, i) => {
      const frac = s.value / total;
      const a1 = a0 + frac * 2 * Math.PI;
      const large = a1 - a0 > Math.PI ? 1 : 0;
      const p = (a, rad) => `${c + rad * Math.cos(a)} ${c + rad * Math.sin(a)}`;
      const d =
        frac >= 0.9999
          ? `M ${c} ${c - R} A ${R} ${R} 0 1 1 ${c - 0.01} ${c - R} L ${c - 0.01} ${c - r} A ${r} ${r} 0 1 0 ${c} ${c - r} Z`
          : `M ${p(a0, R)} A ${R} ${R} 0 ${large} 1 ${p(a1, R)} L ${p(a1, r)} A ${r} ${r} 0 ${large} 0 ${p(a0, r)} Z`;
      a0 = a1;
      return svg`<path d=${d} fill=${s.color} opacity=${this._hover == null || this._hover === i ? 1 : 0.35}
        @mouseenter=${() => (this._hover = i)} @mouseleave=${() => (this._hover = null)}></path>`;
    });
    const h = this._hover != null ? segs[this._hover] : null;
    return html`
      <div class="box">
        <svg viewBox="0 0 200 200" width="200" height="200">
          ${total > 0 ? arcs : svg`<circle cx=${c} cy=${c} r=${(R + r) / 2} fill="none" stroke="var(--divider-color)" stroke-width=${R - r}></circle>`}
          <text x=${c} y=${c - 4} text-anchor="middle" class="big">${fmtUnit(h ? h.value : total, this.unit)}</text>
          <text x=${c} y=${c + 16} text-anchor="middle" class="small">${h ? h.name : this.label || "Gesamt"}</text>
        </svg>
        <div class="list">
          ${segs.map(
            (s, i) => html`<div @mouseenter=${() => (this._hover = i)} @mouseleave=${() => (this._hover = null)}>
              <i style="background:${s.color}"></i>${s.name}<span>${fmtPct(s.value / total)}</span>
            </div>`
          )}
        </div>
      </div>
    `;
  }

  static styles = css`
    .box { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; justify-content: center; }
    .big { fill: var(--primary-text-color); font-size: 18px; font-weight: 500; }
    .small { fill: var(--secondary-text-color); font-size: 11px; }
    path { cursor: default; transition: opacity .15s; }
    .list { font-size: 13px; min-width: 180px; }
    .list div { display: flex; align-items: center; padding: 2px 0; }
    .list i { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 8px; }
    .list span { margin-left: auto; padding-left: 16px; color: var(--secondary-text-color); font-variant-numeric: tabular-nums; }
  `;
}
if (!customElements.get("ekd-donut")) customElements.define("ekd-donut", EkdDonut);

// --- Horizontale Balken -----------------------------------------------------
export class EkdHBars extends LitElement {
  static properties = {
    items: { attribute: false }, // [{name, color, value}]
    unit: {},
  };

  render() {
    const items = [...(this.items || [])].sort((a, b) => b.value - a.value);
    const max = niceMax(Math.max(0, ...items.map((i) => i.value)));
    return html`${items.map(
      (i) => html`<div class="row">
        <div class="name" title=${i.name}>${i.name}</div>
        <div class="track"><div class="bar" style="width:${Math.max(0, (i.value / max) * 100)}%;background:${i.color}"></div></div>
        <div class="val">${fmtUnit(i.value, this.unit)}</div>
      </div>`
    )}`;
  }

  static styles = css`
    :host { display: block; }
    .row { display: grid; grid-template-columns: minmax(90px, 160px) 1fr auto; gap: 10px; align-items: center; margin: 7px 0; font-size: 13px; }
    .name { text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .track { height: 16px; background: var(--secondary-background-color); border-radius: 4px; overflow: hidden; }
    .bar { height: 100%; border-radius: 4px; opacity: .85; }
    .val { min-width: 84px; text-align: right; font-variant-numeric: tabular-nums; color: var(--secondary-text-color); }
  `;
}
if (!customElements.get("ekd-hbars")) customElements.define("ekd-hbars", EkdHBars);
