"use client";
/* ==========================================================================
   INTERACTIVE CHARTS  ·  NYC Dental Smiles
   --------------------------------------------------------------------------
   The only client code in the report. These components receive numbers and
   display labels as props and never import report-data.ts, so no report text
   reaches the browser bundle. Each renders its idle state on the server, so
   the page reads correctly before scripts load.

   Spark  — a 5-week trend line. Move across it with a mouse, a finger or
            the arrow keys to read each week's value.
   Daily  — 14 days, the week before then this week. Pointing at a day
            highlights it with the same weekday in the other week, and the
            readout above shows both values and the change.

   Colors come from CSS tokens set in page.tsx: --now (plum) for this week,
   --past (steel) for earlier weeks.
   ========================================================================== */
import { useRef, useState } from "react";

export type Fmt = "int" | "pct" | "pct1";
export type Day = { d: string; w: string; v: number; shade?: boolean };

const fmtV = (v: number, f: Fmt) =>
  f === "pct" ? `${v.toFixed(2)}%` : f === "pct1" ? `${v.toFixed(1)}%` : v.toLocaleString("en-US");

/* ------------------------------------------------------------------ Spark */
export function Spark({ name, values, labels, fmt }: { name: string; values: number[]; labels: string[]; fmt: Fmt }) {
  const [i, setI] = useState<number | null>(null);
  const ref = useRef<SVGSVGElement>(null);
  const W = 150, H = 40, P = 6;
  const n = values.length;
  const lo = Math.min(...values), hi = Math.max(...values);
  const span = hi - lo || 1;
  const x = (k: number) => (n === 1 ? W / 2 : P + (k * (W - 2 * P)) / (n - 1));
  const y = (v: number) => H - P - ((v - lo) / span) * (H - 2 * P);
  const pts = values.map((v, k) => `${x(k).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const last = n - 1;

  const pick = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const rel = ((clientX - r.left) / r.width) * W;
    let best = 0, d = Infinity;
    for (let k = 0; k < n; k++) { const dd = Math.abs(x(k) - rel); if (dd < d) { d = dd; best = k; } }
    setI(best);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); setI((p) => Math.max(0, (p ?? last) - 1)); }
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); setI((p) => Math.min(last, (p ?? last) + 1)); }
    else if (e.key === "Home") { e.preventDefault(); setI(0); }
    else if (e.key === "End") { e.preventDefault(); setI(last); }
  };
  const all = values.map((v, k) => `${labels[k]}: ${fmtV(v, fmt)}`).join(", ");
  const tipPos = i === null ? null : x(i) / W;

  return (
    <span className="spk">
      <svg
        ref={ref}
        width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="spark"
        role="slider" tabIndex={0}
        aria-label={`${name}, trend by week: ${all}`}
        aria-valuemin={0} aria-valuemax={last} aria-valuenow={i ?? last}
        aria-valuetext={`${labels[i ?? last]}: ${fmtV(values[i ?? last], fmt)}`}
        onPointerMove={(e) => pick(e.clientX)}
        onPointerDown={(e) => pick(e.clientX)}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") setI(null); }}
        onFocus={() => setI((p) => p ?? last)}
        onBlur={() => setI(null)}
        onKeyDown={onKey}
      >
        <line className="spk-g" x1={P} x2={W - P} y1={H - P} y2={H - P} />
        {i !== null ? <line className="spk-g" x1={x(i)} x2={x(i)} y1={2} y2={H - 2} /> : null}
        <polyline points={pts} fill="none" stroke="var(--past)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {values.map((v, k) => (
          <circle key={k} cx={x(k)} cy={y(v)}
            r={k === last ? 4.5 : i === k ? 4 : 2.5}
            fill={k === last ? "var(--now)" : "var(--past)"}
            stroke="var(--paper)" strokeWidth={k === last || i === k ? 2 : 0} />
        ))}
      </svg>
      {i !== null && tipPos !== null ? (
        <span className={`spk-tip${tipPos < 0.2 ? " l" : tipPos > 0.8 ? " r" : ""}`} style={{ left: `${tipPos * 100}%` }} aria-hidden="true">
          <span>{labels[i]}</span><b>{fmtV(values[i], fmt)}</b>
        </span>
      ) : null}
    </span>
  );
}

/* ------------------------------------------------------------------ Daily */
function Bars({ data, unit, compact, sel, setSel }: {
  data: Day[]; unit: string; compact: boolean; sel: number | null; setSel: (v: number | null) => void;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const W = compact ? 360 : 960, H = compact ? 230 : 280;
  const L = compact ? 26 : 34, R = 6, T = 30, B = compact ? 40 : 46;
  const n = data.length;
  const max = Math.max(...data.map((d) => d.v), 1);
  const step = Math.max(1, Math.ceil(max / 4));
  const top = step * 4;
  const slot = (W - L - R) / n;
  const gap = compact ? 3 : 10;
  const bw = slot - gap;
  const x = (k: number) => L + k * slot + gap / 2;
  const y = (v: number) => T + (H - T - B) * (1 - v / top);
  const split = data.findIndex((d) => !d.shade);
  const pair = sel === null ? null : sel >= split ? sel - split : sel + split;
  const peak = (a: number, b: number) => { let k = a; for (let j = a; j < b; j++) if (data[j].v > data[k].v) k = j; return k; };
  const peaks = split > 0 ? [peak(0, split), peak(split, n)] : [peak(0, n)];

  const pick = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const k = Math.floor((((clientX - r.left) / r.width) * W - L) / slot);
    setSel(k >= 0 && k < n ? k : null);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); setSel(Math.max(0, (sel ?? n) - 1)); }
    else if (e.key === "ArrowRight") { e.preventDefault(); setSel(Math.min(n - 1, (sel ?? -1) + 1)); }
    else if (e.key === "Escape") setSel(null);
  };
  /* rounded top only: a path with 4px radius on the data end, square at the baseline */
  const bar = (k: number) => {
    const h = Math.max(0, y(0) - y(data[k].v));
    const r = Math.min(4, h, bw / 2);
    const x0 = x(k), y0 = y(0);
    if (h === 0) return "";
    return `M${x0},${y0}V${y0 - h + r}Q${x0},${y0 - h} ${x0 + r},${y0 - h}H${x0 + bw - r}Q${x0 + bw},${y0 - h} ${x0 + bw},${y0 - h + r}V${y0}Z`;
  };
  const ticks = [0, step, step * 2, step * 3, top];

  return (
    <svg
      ref={ref} viewBox={`0 0 ${W} ${H}`} className={compact ? "ch-narrow" : "ch-wide"}
      role="slider" tabIndex={0}
      aria-label={`${unit} each day: ${data.map((d) => `${d.w} ${d.d} ${d.v}`).join(", ")}`}
      aria-valuemin={0} aria-valuemax={n - 1} aria-valuenow={sel ?? n - 1}
      aria-valuetext={sel === null ? "No day selected" : `${data[sel].w} ${data[sel].d}: ${data[sel].v}`}
      onPointerMove={(e) => pick(e.clientX)}
      onPointerDown={(e) => pick(e.clientX)}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") setSel(null); }}
      onBlur={() => setSel(null)}
      onKeyDown={onKey}
    >
      {ticks.map((t) => (
        <g key={t}>
          <line className={t === 0 ? "base" : "grid"} x1={L} x2={W - R} y1={y(t)} y2={y(t)} />
          <text x={L - 8} y={y(t) + 4} textAnchor="end">{t}</text>
        </g>
      ))}
      {split > 0 ? <rect className="dly-band" x={L} y={T - 22} width={split * slot} height={H - B - T + 22} /> : null}
      {data.map((d, k) => {
        const on = sel === null || sel === k || pair === k;
        const lab = compact ? (k % 2 === 0 ? d.d.split(" ")[1] : "") : d.w;
        return (
          <g key={d.d} className={`bar${on ? "" : " dim"}`}>
            <path className={`m ${d.shade ? "b-past" : "b-now"}`} d={bar(k)} />
            <text className={sel === k || pair === k ? "dk" : ""} x={x(k) + bw / 2} y={H - B + 18} textAnchor="middle">{lab}</text>
            {!compact ? <text className={sel === k || pair === k ? "dk" : ""} x={x(k) + bw / 2} y={H - B + 35} textAnchor="middle">{d.d}</text> : null}
            {peaks.includes(k) ? <text className="pk" x={x(k) + bw / 2} y={y(d.v) - 8} textAnchor="middle">{d.v}</text> : null}
          </g>
        );
      })}
    </svg>
  );
}

export function Daily({ data, unit, nowLabel, pastLabel }: { data: Day[]; unit: string; nowLabel: string; pastLabel: string }) {
  const [sel, setSel] = useState<number | null>(null);
  const split = data.findIndex((d) => !d.shade);
  const sum = (a: number, b: number) => data.slice(a, b).reduce((t, d) => t + d.v, 0);
  let nowI: number | null = null, pastI: number | null = null;
  if (sel !== null) { nowI = sel >= split ? sel : sel + split; pastI = nowI - split; }
  const nowV = nowI === null ? sum(split, data.length) : data[nowI].v;
  const pastV = pastI === null ? sum(0, split) : data[pastI].v;
  const diff = nowV - pastV;
  const chg = diff > 0 ? `+${diff}` : diff < 0 ? `−${Math.abs(diff)}` : "0";

  return (
    <div className={`dly${sel === null ? "" : " on"}`}>
      <div className="dly-read" aria-live="polite">
        <div className="dly-cell now">
          <span className="dly-k"><i />{nowLabel}</span>
          <span className="dly-d">{nowI === null ? "Whole week" : `${data[nowI].w}, ${data[nowI].d}`}</span>
          <span className="dly-v">{nowV}<small> {unit}</small></span>
        </div>
        <div className="dly-cell past">
          <span className="dly-k"><i />{pastLabel}</span>
          <span className="dly-d">{pastI === null ? "Whole week" : `${data[pastI].w}, ${data[pastI].d}`}</span>
          <span className="dly-v">{pastV}<small> {unit}</small></span>
        </div>
        <div className="dly-cell chg">
          <span className="dly-k">Change</span>
          <span className="dly-d">{sel === null ? "Week on week" : "Same weekday"}</span>
          <span className="dly-v">{chg}</span>
        </div>
        <p className="dly-hint">Point at a day to compare it with the same weekday in the other week.</p>
      </div>
      <Bars data={data} unit={unit} compact={false} sel={sel} setSel={setSel} />
      <Bars data={data} unit={unit} compact sel={sel} setSel={setSel} />
    </div>
  );
}
