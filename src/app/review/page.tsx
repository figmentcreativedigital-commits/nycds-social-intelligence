import type { Metadata } from "next";
import { RV, IS_INTERNAL, NAV, has, WINDOWS, DEFAULT_WIN, short, type WinId, type Row, type Chart } from "./review-data";
import { MONO } from "./brand";

/* ==========================================================================
   3, 6 AND 12-MONTH REVIEW  ·  NYC Dental Smiles  ·  /review
   --------------------------------------------------------------------------
   Structure and styling only; every figure, date and sentence lives in
   review-data.ts in this folder. The same page as the EEC review
   (ddspc-social-intelligence, src/app/review/page.tsx) in the NYC Dental
   Smiles brand.

   SERVER-RENDERED, NO SCRIPT. No "use client", no hooks, no imports from the
   weekly report. The 3 / 6 / 12-month switch is 3 radio inputs and CSS
   :has(), so review-data.ts never reaches the browser and there is nothing to
   hydrate.

   STYLE. The CSS below is the weekly page's (src/app/page.tsx) copied as it
   stands on 64e7e0d, less its Smile Pass block, followed by the review's own
   additions. The weekly page is not modified; if its styling changes, copy
   the block again. Brand: NYC Dental Smiles Brand Guidelines (05/2025),
   plum #6F5060 for the selected period, steel #8FA1A6 for the period it is
   compared with; Marcellus for titles and headline figures, Area Normal
   (Figtree until the Adobe Fonts project is set) for text.
   ========================================================================== */

export const metadata: Metadata = {
  title: "NYC Dental Smiles: 3, 6 and 12-month review",
  description: "3, 6 and 12-month review prepared by Figment Creative.",
  robots: { index: false, follow: false },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Figtree:wght@400;600;800&display=swap');

:root {
  --plum: #6F5060;
  --plum-deep: #563E4A;
  --steel: #8FA1A6;
  --taupe: #A6968D;
  --ink: #1F1E21;
  --body: #3A3A3E;
  --muted: #5F6267;
  --paper: #FFFFFF;
  --wash: #F7F2F1;
  --rule: #CFD0D1;
  --rule-soft: #E7E7E8;
  --now: #6F5060;
  --past: #8FA1A6;
  --track: #E8DCDA;
  --display: 'Marcellus', 'Iowan Old Style', Georgia, serif;
  --text: 'area-normal', 'Figtree', 'Helvetica Neue', Arial, sans-serif;
  --max: 1180px;
  --gut: clamp(20px, 5vw, 64px);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
body { font-family: var(--text); font-size: 17px; line-height: 1.6; color: var(--body); background: var(--paper); -webkit-font-smoothing: antialiased; }
h1, h2, h3, h4 { font-family: var(--text); font-weight: 800; color: var(--ink); line-height: 1.2; text-wrap: balance; }
a { color: inherit; }
:focus-visible { outline: 2px solid var(--now); outline-offset: 3px; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.wrap { max-width: var(--max); margin: 0 auto; padding-left: var(--gut); padding-right: var(--gut); }

/* ---------- masthead: the week's headline is the hero ---------- */
.mast { position: relative; overflow: hidden; background: var(--plum); color: #fff; padding: 40px 0 64px; }
.mast-wm { position: absolute; right: -9%; top: 50%; transform: translateY(-50%); width: min(58vw, 760px); opacity: .07; pointer-events: none; }
.mast .wrap { position: relative; }
.mast-top { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; padding-bottom: 26px; border-bottom: 1px solid rgba(255,255,255,.3); }
.mast-logo { display: block; }
.mast-logo img { width: 248px; height: auto; display: block; }
.mast-kind { font-family: var(--display); font-size: 17px; color: rgba(255,255,255,.9); margin-top: 16px; }
.mast-badge { display: inline-block; margin-left: 10px; padding: 1px 11px; border: 1px solid rgba(255,255,255,.6); border-radius: 30px; font-family: var(--text); font-size: 13px; vertical-align: 2px; }
.mast-when { text-align: right; font-size: 15px; color: rgba(255,255,255,.88); line-height: 1.5; }
.mast-when b { display: block; font-weight: 800; font-size: 18px; color: #fff; }
.mast-head { font-family: var(--display); font-weight: 400; font-size: clamp(26px, 3.2vw, 40px); line-height: 1.32; color: #fff; max-width: 30ch; margin-top: 40px; }
.mast-paid { margin-top: 18px; font-size: 15px; color: rgba(255,255,255,.82); max-width: 62ch; }
@media (max-width: 640px) { .mast-when { text-align: left; } .mast-logo img { width: 200px; } }

/* ---------- brief: short columns under the headline ---------- */
.brief { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 36px; padding: 44px 0 8px; }
.brief-i { border-top: 2px solid var(--plum); padding-top: 16px; }
.brief-role { font-family: var(--display); font-weight: 400; font-size: 19px; color: var(--plum); margin-bottom: 10px; }
.brief-text { font-size: 16px; line-height: 1.6; color: var(--body); }

/* ---------- nav ---------- */
.rail { position: sticky; top: 0; z-index: 20; background: rgba(255,255,255,.96); border-bottom: 1px solid var(--rule); margin-top: 40px; }
.rail-in { display: flex; gap: 26px; overflow-x: auto; padding-top: 13px; padding-bottom: 13px; scrollbar-width: none; }
.rail-in::-webkit-scrollbar { display: none; }
.rail a { font-size: 15px; color: var(--muted); text-decoration: none; white-space: nowrap; padding-bottom: 2px; border-bottom: 2px solid transparent; }
.rail a:hover, .rail a:focus-visible { color: var(--plum); border-bottom-color: var(--plum); }

/* ---------- sections ---------- */
.sec { padding: 72px 0; border-top: 1px solid var(--rule-soft); scroll-margin-top: 48px; }
.sec-wash { background: var(--wash); border-top: none; }
.sec-head { max-width: 62ch; margin-bottom: 36px; }
.sec-t { font-family: var(--display); font-weight: 400; font-size: clamp(30px, 3.2vw, 42px); color: var(--plum); margin-bottom: 12px; }
.sec-lede { font-size: 19px; line-height: 1.6; color: var(--body); }

/* ---------- the week in numbers ---------- */
.lg { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
.lg-cols th { font-weight: 400; font-size: 14px; color: var(--muted); text-align: right; padding: 0 0 10px 16px; vertical-align: bottom; line-height: 1.3; }
.lg-cols th:first-child { text-align: left; padding-left: 0; }
.lg-cols th small { display: block; font-size: 13px; }
.lg-g th { text-align: left; font-family: var(--display); font-weight: 400; font-size: 22px; color: var(--plum); padding: 32px 0 10px; border-bottom: 2px solid var(--plum); }
.lg-r td { padding: 16px 0 16px 16px; border-bottom: 1px solid var(--rule-soft); vertical-align: middle; text-align: right; }
.lg-r td:first-child { text-align: left; padding-left: 0; width: 42%; }
.lg-k { font-size: 17px; color: var(--ink); font-weight: 800; }
.lg-n { font-size: 14px; color: var(--muted); margin-top: 3px; max-width: 52ch; line-height: 1.5; }
.lg-v { font-size: 24px; color: var(--ink); font-weight: 800; }
.lg-p { font-size: 17px; color: var(--muted); }
.lg-c { font-size: 15px; color: var(--body); white-space: nowrap; }
.lg-c i { font-style: normal; color: var(--muted); margin-right: 5px; font-size: 12px; }
.lg-c.up i { color: var(--plum); }
.lg-after { margin-top: 22px; font-size: 15px; color: var(--muted); max-width: 70ch; }
.spark { display: block; margin-left: auto; overflow: visible; }
@media (max-width: 760px) {
  .lg-cols { display: none; }
  .lg-r { display: grid; grid-template-columns: 1fr auto auto; gap: 4px 16px; padding: 14px 0; border-bottom: 1px solid var(--rule-soft); }
  .lg-r td { border: none; padding: 0; }
  .lg-r td:first-child { grid-column: 1 / -1; width: auto; }
  .lg-r td.lg-sp { grid-column: 1; text-align: left; }
  .spark { margin-left: 0; }
  .lg-r td.lg-pv { display: none; }
  .lg-g th { display: block; }
}

/* trend-line scrubbing */
.spk { position: relative; display: inline-block; vertical-align: middle; }
.lg-sp .spk { float: right; }
.spk svg { cursor: crosshair; touch-action: pan-y; -webkit-tap-highlight-color: transparent; border-radius: 4px; }
.spk svg:focus { outline: none; }
.spk svg:focus-visible { outline: 2px solid var(--plum); outline-offset: 4px; }
.spk-g { stroke: var(--rule); stroke-width: 1; }
.spk-tip { position: absolute; bottom: calc(100% + 6px); transform: translateX(-50%); white-space: nowrap; pointer-events: none;
  background: var(--plum); color: #fff; border-radius: 6px; padding: 5px 9px; font-size: 13px; line-height: 1.2; z-index: 3;
  display: flex; gap: 8px; align-items: baseline; box-shadow: 0 2px 8px rgba(31,30,33,.16); }
.spk-tip b { font-size: 15px; font-variant-numeric: tabular-nums; }
.spk-tip span { opacity: .88; }
.spk-tip.l { transform: translateX(-10px); }
.spk-tip.r { transform: translateX(calc(-100% + 10px)); }
@media (max-width: 760px) { .lg-sp .spk { float: none; } }

/* ---------- daily chart ---------- */
.chart svg { width: 100%; height: auto; display: block; overflow: visible; }
.chart text { font-family: var(--text); fill: var(--muted); font-size: 13px; }
.chart svg.ch-narrow { display: none; }
@media (max-width: 640px) { .chart svg.ch-wide { display: none; } .chart svg.ch-narrow { display: block; } .chart .ch-narrow text { font-size: 12px; } }
.chart .pk { fill: var(--ink); font-size: 14px; font-weight: 800; }
.chart .grid { stroke: var(--rule-soft); stroke-width: 1; }
.chart .base { stroke: var(--rule); stroke-width: 1; }
.chart .b-now { fill: var(--now); }
.chart .b-past { fill: var(--past); }
.chart svg[role="slider"] { cursor: crosshair; touch-action: pan-y; -webkit-tap-highlight-color: transparent; }
.chart svg[role="slider"]:focus { outline: none; }
.chart svg[role="slider"]:focus-visible { outline: 2px solid var(--plum); outline-offset: 6px; border-radius: 4px; }
.chart g.bar path.m { transition: opacity .15s ease; }
.chart g.bar.dim path.m { opacity: .28; }
.chart .dly-band { fill: var(--steel); opacity: .09; }
.chart text.dk { fill: var(--ink); font-weight: 800; }
.dly-read { display: flex; align-items: stretch; flex-wrap: wrap; margin: 4px 0 22px; min-height: 76px; background: #fff; border: 1px solid var(--rule-soft); border-radius: 8px; }
.dly-cell { display: flex; flex-direction: column; gap: 2px; padding: 12px 22px; border-right: 1px solid var(--rule-soft); min-width: 150px; }
.dly-k { font-size: 13px; color: var(--muted); display: inline-flex; align-items: center; gap: 7px; }
.dly-k i { width: 10px; height: 10px; border-radius: 2px; display: inline-block; }
.dly-cell.now .dly-k i { background: var(--now); }
.dly-cell.past .dly-k i { background: var(--past); }
.dly-d { font-size: 15px; color: var(--body); }
.dly-v { font-size: 26px; line-height: 1.1; color: var(--ink); font-weight: 800; font-variant-numeric: tabular-nums; }
.dly-v small { font-size: 14px; font-weight: 400; color: var(--muted); }
.dly-cell.chg { border-right: none; }
.dly-hint { margin: 0 0 0 auto; align-self: center; padding: 12px 22px; max-width: 30ch; font-size: 14px; line-height: 1.45; color: var(--muted); }
.dly.on .dly-hint { visibility: hidden; }
@media (max-width: 760px) {
  .dly-read { min-height: 0; }
  .dly-cell { min-width: 0; flex: 1 1 0; padding: 10px 12px; }
  .dly-cell.chg { flex: 0 0 auto; }
  .dly-cell.chg .dly-d { display: none; }
  .dly-k { font-size: 12px; gap: 5px; white-space: nowrap; }
  .dly-d { font-size: 14px; white-space: nowrap; }
  .dly-v { font-size: 21px; }
  .dly-v small { display: none; }
  .dly-hint { display: none; }
}
@media (prefers-reduced-motion: reduce) { .chart g.bar path.m { transition: none; } }
.key { display: flex; gap: 24px; flex-wrap: wrap; font-size: 14px; color: var(--body); margin-bottom: 14px; }
.key span { display: inline-flex; align-items: center; gap: 8px; }
.key i { width: 12px; height: 12px; border-radius: 3px; display: inline-block; }
.bands { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1px; background: var(--rule-soft); border: 1px solid var(--rule-soft); margin-top: 24px; }
.bands div { background: var(--paper); padding: 16px 20px; }
.bands dt { font-size: 14px; color: var(--muted); }
.bands dd { font-size: 24px; font-weight: 800; color: var(--ink); }
.bands dd small { display: block; font-size: 13px; font-weight: 400; color: var(--muted); }
.note { margin-top: 24px; max-width: 66ch; font-size: 16px; line-height: 1.65; color: var(--body); }
.note b { color: var(--ink); }
.tv { margin-top: 18px; font-size: 15px; }
.tv summary { cursor: pointer; color: var(--plum); }
.tv table { margin-top: 12px; border-collapse: collapse; font-variant-numeric: tabular-nums; }
.tv td, .tv th { padding: 5px 18px 5px 0; border-bottom: 1px solid var(--rule-soft); text-align: left; font-weight: 400; }
.tv th { color: var(--muted); }

/* ---------- what worked ---------- */
.hero { display: grid; grid-template-columns: minmax(280px, 400px) 1fr; gap: 48px; align-items: start; }
@media (max-width: 900px) { .hero { grid-template-columns: 1fr; } }
.ig { position: relative; width: 100%; aspect-ratio: 4/5; overflow: hidden; background: #241D21; border-radius: 4px; }
.ig iframe { position: absolute; top: -56px; left: -1px; width: calc(100% + 2px); height: calc(100% + 130px); border: 0; }
.hero-meta { font-size: 15px; color: var(--muted); margin-bottom: 10px; }
.hero-t { font-family: var(--display); font-weight: 400; font-size: clamp(24px, 2.4vw, 30px); line-height: 1.3; color: var(--ink); margin-bottom: 24px; max-width: 30ch; }
.stats { display: grid; grid-template-columns: repeat(4, auto); justify-content: start; gap: 8px 40px; padding: 18px 0; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); margin-bottom: 22px; }
.stats b { display: block; font-size: 30px; font-weight: 800; color: var(--ink); line-height: 1.1; font-variant-numeric: tabular-nums; }
.stats span { font-size: 14px; color: var(--muted); }
@media (max-width: 520px) { .stats { grid-template-columns: repeat(2, auto); } }
.why { font-size: 16px; line-height: 1.7; max-width: 58ch; }
.why + .why { margin-top: 14px; }
.gal { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 32px; margin-top: 56px; }
.gal-d { font-size: 14px; color: var(--muted); margin-top: 12px; }
.gal-t { font-size: 17px; font-weight: 800; line-height: 1.4; color: var(--ink); margin: 4px 0 8px; }
.gal-s { font-size: 14px; color: var(--body); font-variant-numeric: tabular-nums; }
.gal-note { margin-top: 32px; font-size: 15px; color: var(--muted); max-width: 66ch; }
.chan { margin-top: 56px; padding: 26px 30px; background: var(--paper); border-left: 3px solid var(--steel); max-width: 78ch; }
.chan h3 { font-family: var(--display); font-weight: 400; font-size: 22px; color: var(--plum); margin-bottom: 8px; }
.chan p { font-size: 16px; line-height: 1.7; }

/* ---------- text sections ---------- */
.soc { max-width: 70ch; }
.soc p { font-size: 17px; line-height: 1.7; padding: 18px 0; border-bottom: 1px solid var(--rule-soft); }
.soc-take { margin-top: 26px; padding: 22px 26px; border-left: 3px solid var(--plum); background: var(--paper); }
.soc-take h3 { font-family: var(--display); font-weight: 400; font-size: 19px; color: var(--plum); margin-bottom: 6px; }
.att { max-width: 78ch; }
.att-i { padding: 26px 0; border-bottom: 1px solid var(--rule-soft); }
.att-tag { font-family: var(--display); font-size: 16px; color: var(--plum); margin-bottom: 6px; }
.att-t { font-size: 22px; margin-bottom: 10px; }
.att-b { font-size: 16px; line-height: 1.7; }
.att-so { margin-top: 12px; padding-left: 14px; border-left: 2px solid var(--track); font-size: 16px; line-height: 1.7; color: var(--ink); }
.learn { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px 56px; }
.learn-i { padding-top: 16px; border-top: 2px solid var(--steel); }
.learn-f { font-size: 44px; line-height: 1; font-weight: 800; color: var(--plum); font-variant-numeric: tabular-nums; letter-spacing: -.01em; }
.learn-u { font-family: var(--display); font-weight: 400; font-size: 19px; color: var(--ink); margin: 10px 0 8px; }
.learn-t { font-size: 16px; line-height: 1.7; }
.mv-i { display: grid; grid-template-columns: 1fr 260px; gap: 36px; padding: 26px 0; border-bottom: 1px solid var(--rule-soft); }
.mv-i h3 { font-size: 22px; margin-bottom: 10px; }
.mv-i p { font-size: 16px; line-height: 1.7; }
.mv-m dt { font-size: 14px; color: var(--muted); }
.mv-m dd { font-size: 15px; color: var(--ink); margin-bottom: 12px; }
@media (max-width: 860px) { .mv-i { grid-template-columns: 1fr; gap: 12px; } }

/* ---------- detail ---------- */
.dt { border-top: 1px solid var(--rule); max-width: 960px; }
.dt details { border-bottom: 1px solid var(--rule); }
.dt summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: baseline; gap: 16px; padding: 20px 0; font-family: var(--display); font-size: 22px; color: var(--plum); }
.dt summary small { font-family: var(--text); font-size: 14px; color: var(--muted); margin-left: auto; text-align: right; }
.dt summary::-webkit-details-marker { display: none; }
.dt summary::after { content: "+"; font-family: var(--text); font-size: 24px; color: var(--steel); line-height: 1; }
.dt details[open] summary::after { content: "\\2013"; }
.dt-p { padding: 4px 0 34px; }
.dt-h { font-size: 16px; font-weight: 800; color: var(--ink); margin: 28px 0 4px; }
.dt-h:first-child { margin-top: 6px; }
.dt-s { font-size: 14px; color: var(--muted); margin-bottom: 14px; max-width: 70ch; }
.kv { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1px; background: var(--rule-soft); border: 1px solid var(--rule-soft); margin: 6px 0 8px; }
.kv div { background: var(--paper); padding: 14px 16px; }
.kv dt { font-size: 13px; color: var(--muted); }
.kv dd { font-size: 22px; font-weight: 800; color: var(--ink); font-variant-numeric: tabular-nums; }
.tbl { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; font-size: 15px; }
.tbl th { font-weight: 400; color: var(--muted); font-size: 13px; text-align: right; padding: 6px 0 8px 14px; border-bottom: 1px solid var(--rule); }
.tbl td { padding: 9px 0 9px 14px; border-bottom: 1px solid var(--rule-soft); text-align: right; color: var(--ink); vertical-align: top; }
.tbl th:first-child, .tbl td:first-child { text-align: left; padding-left: 0; }
.tbl td:first-child { color: var(--body); }
.tbl th.tl, .tbl td.tl { text-align: left; }
.tbl th.tr, .tbl td.tr { text-align: right; }
.tbl-wrap { overflow-x: auto; }
.bl { display: grid; gap: 10px; max-width: 760px; }
.bl-r { display: grid; grid-template-columns: minmax(150px, 230px) 1fr 56px; gap: 14px; align-items: center; font-size: 15px; }
.bl-l { color: var(--body); }
.bl-b { height: 14px; position: relative; }
.bl-b span { position: absolute; left: 0; top: 0; bottom: 0; background: var(--now); border-radius: 0 4px 4px 0; min-width: 2px; }
.bl-v { text-align: right; font-weight: 800; color: var(--ink); font-variant-numeric: tabular-nums; }
@media (max-width: 560px) { .bl-r { grid-template-columns: 1fr 48px; } .bl-b { grid-column: 1 / -1; grid-row: 2; } }
.dt-note { font-size: 15px; line-height: 1.7; color: var(--muted); max-width: 70ch; margin-top: 18px; }
.faq { padding: 14px 0; border-bottom: 1px solid var(--rule-soft); max-width: 70ch; }
.faq h3 { font-size: 16px; color: var(--ink); margin-bottom: 4px; }
.faq p { font-size: 15px; line-height: 1.65; color: var(--muted); }

.foot { background: var(--plum); color: rgba(255,255,255,.88); padding: 36px 0; font-size: 14px; }
.foot-in { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
.foot img { width: 44px; height: 44px; display: block; opacity: .9; }

@media print {
  .rail, .ig, .tv, .dly-hint { display: none; }
  .mast { background: #fff; color: var(--ink); }
  .mast-head, .mast-when b { color: var(--plum); }
  .mast-when, .mast-kind, .mast-paid { color: var(--muted); }
  .mast-wm { display: none; }
  .mast-logo img { filter: brightness(0) saturate(100%) invert(33%) sepia(12%) saturate(900%) hue-rotate(275deg); }
  .dt details > *:not(summary) { display: block; }
  .sec { padding: 32px 0; break-inside: avoid; }
  .foot { background: #fff; color: var(--muted); border-top: 1px solid var(--rule); }
  .foot img { filter: brightness(0) saturate(100%) invert(33%) sepia(12%) saturate(900%) hue-rotate(275deg); }
}
`;

/* Additions for the review. The window switch is CSS only: 3 radio inputs in
   the rail, and :has() on the page wrapper shows the matching .wv block and
   colors the month charts. No script, nothing to hydrate. Browsers without
   :has() show the default window, which the rules below build from
   DEFAULT_WIN. */
const REVIEW_CSS = `
/* ---------- top bar: brand, sections, period switch ---------- */
.top { position: sticky; top: 0; z-index: 40; background: var(--plum); color: #fff; border-bottom: 1px solid rgba(255,255,255,.16); }
.top-in { display: flex; align-items: center; gap: 20px; min-height: 68px; }
.top .wrap { max-width: 1440px; padding-left: clamp(16px, 3vw, 40px); padding-right: clamp(16px, 3vw, 40px); }
.brand { display: grid; grid-template-columns: auto auto; grid-template-rows: auto auto; column-gap: 12px; align-items: center; flex: none; color: #fff; }
.brand-a { display: contents; color: #fff; text-decoration: none; }
.brand-a img { grid-row: 1 / 3; width: 40px; height: 40px; display: block; }
.brand-a b { font-size: 11px; font-weight: 400; letter-spacing: .16em; text-transform: uppercase; white-space: nowrap; align-self: end; }
.brand-s { font-size: 13px; color: rgba(255,255,255,.9); white-space: nowrap; align-self: start; margin-top: 2px; }
.brand-s a { color: #fff; text-decoration: underline; text-decoration-color: rgba(255,255,255,.5); text-underline-offset: 3px; }
.brand-s a:hover { text-decoration-color: #fff; }
.badge { font-style: normal; margin-left: 8px; padding: 0 8px; border: 1px solid rgba(255,255,255,.6); border-radius: 20px; font-size: 11px; }
.links { display: flex; align-items: center; gap: 2px; flex: 1; min-width: 0; overflow-x: auto; scrollbar-width: none; }
.links::-webkit-scrollbar { display: none; }
.links a { color: rgba(255,255,255,.92); text-decoration: none; font-size: 15px; white-space: nowrap; padding: 8px 11px; border-radius: 6px; }
.links a:hover, .links a:focus-visible { background: rgba(255,255,255,.12); color: #fff; }
.links a:focus-visible { outline: 2px solid #fff; outline-offset: 1px; }
.seg { display: inline-flex; flex: none; align-items: center; gap: 2px; padding: 3px; border: 1px solid rgba(255,255,255,.4); border-radius: 30px; margin: 0; }
.seg legend { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.seg label { position: relative; cursor: pointer; }
.seg input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; }
.seg span { display: block; font-size: 14px; line-height: 1.2; padding: 7px 14px; border-radius: 30px; color: rgba(255,255,255,.92); white-space: nowrap; }
.seg label:hover span { background: rgba(255,255,255,.12); }
.seg input:checked + span, .seg label:hover input:checked + span { background: #fff; color: var(--plum); font-weight: 800; }
.seg input:focus-visible + span { outline: 2px solid #fff; outline-offset: 2px; }
.sec { scroll-margin-top: 84px; }
@media (max-width: 1220px) {
  .top-in { flex-wrap: wrap; gap: 0 16px; padding-top: 10px; }
  .brand { order: 1; }
  .seg { order: 2; margin-left: auto; }
  .links { order: 3; flex-basis: 100%; margin: 6px 0 4px; padding-bottom: 4px; }
  .links a:first-child { padding-left: 0; }
  .links { mask-image: linear-gradient(90deg, #000 88%, transparent); -webkit-mask-image: linear-gradient(90deg, #000 88%, transparent); }
  .sec { scroll-margin-top: 124px; }
}
@media (max-width: 560px) {
  .brand-a b, .brand-s { display: none; }
  .seg span { padding: 7px 11px; font-size: 13px; }
}

/* ---------- intro: one compact band (not .intro, which "What worked" uses) ---------- */
.intro { background: var(--plum); color: #fff; padding: 40px 0 44px; }
.intro-in.wv { display: none; }
.intro-in { grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 48px; align-items: center; }
.intro-k { font-family: var(--text); font-weight: 600; font-size: 13px; letter-spacing: .16em; text-transform: uppercase; color: rgba(255,255,255,.9); margin-bottom: 14px; }
.intro .mast-head { font-family: var(--display); font-weight: 400; font-size: clamp(26px, 2.8vw, 38px); line-height: 1.28; color: #fff; max-width: 26ch; margin-top: 0; }
.intro-deck { font-size: 17px; line-height: 1.6; color: rgba(255,255,255,.92); max-width: 52ch; margin-top: 16px; }
.intro-meta { font-size: 13px; color: rgba(255,255,255,.9); margin-top: 14px; }
.intro-note { font-size: 14px; line-height: 1.6; color: rgba(255,255,255,.92); margin-top: 16px; padding: 12px 14px; border-left: 2px solid rgba(255,255,255,.5); background: rgba(0,0,0,.12); max-width: 64ch; }
.tiles { list-style: none; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.tile { background: rgba(255,255,255,.09); border: 1px solid rgba(255,255,255,.2); border-radius: 12px; padding: 18px 16px 16px; }
.tile b { display: block; font-family: var(--display); font-weight: 400; font-size: clamp(26px, 2.5vw, 36px); line-height: 1.05; color: #fff; font-variant-numeric: lining-nums; }
.tile span { display: block; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.92); margin-top: 10px; line-height: 1.35; }
.tile small { display: block; font-size: 13px; color: rgba(255,255,255,.9); margin-top: 6px; line-height: 1.4; }
@media (max-width: 900px) {
  .intro { padding: 28px 0 32px; }
  .intro-in { grid-template-columns: 1fr; gap: 24px; }
}
@media (max-width: 480px) { .tiles { grid-template-columns: 1fr 1fr; } .tile:last-child { grid-column: 1 / -1; } }

/* ---------- how to read: a slim strip under the hero ---------- */
.how { border-bottom: 1px solid var(--rule-soft); }
.how-in { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 32px; padding-top: 22px; padding-bottom: 22px; }
.how-t { font-family: var(--display); font-weight: 400; font-size: 18px; color: var(--plum); margin-bottom: 6px; }
.how-i p { font-size: 14.5px; line-height: 1.6; color: var(--body); }
@media (max-width: 860px) { .how-in { grid-template-columns: 1fr; gap: 14px; } }

.wv { display: none; }


.lg-na { font-size: 14px; color: var(--muted); text-align: right; }
.lg-ni { font-size: 14px; color: var(--plum); margin-top: 6px; max-width: 60ch; line-height: 1.5; }
.lg-ni b { font-weight: 800; }
@media (max-width: 760px) { .lg-r td.lg-na { grid-column: 2 / -1; text-align: right; } }

.mcs { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 48px 56px; }
.mc h3 { font-size: 20px; margin-bottom: 4px; }
.mc-cap { font-size: 15px; color: var(--ink); font-weight: 800; margin-bottom: 12px; font-variant-numeric: tabular-nums; }
.mc-note { font-size: 14px; color: var(--muted); margin-top: 10px; line-height: 1.55; }
.mc svg { width: 100%; height: auto; display: block; overflow: visible; }
.mc text { font-family: var(--text); fill: var(--muted); font-size: 12px; }
.mc .grid { stroke: var(--rule-soft); stroke-width: 1; }
.mc .base { stroke: var(--rule); stroke-width: 1; }
.mc rect.b { fill: var(--rule); }
.mc .tv { margin-top: 10px; font-size: 14px; }
@media (max-width: 420px) { .mcs { grid-template-columns: 1fr; } }

.srch { max-width: 70ch; }
.srch p { font-size: 17px; line-height: 1.7; padding: 16px 0; border-bottom: 1px solid var(--rule-soft); }
.srch-int { margin-top: 30px; padding: 22px 26px; border-left: 3px solid var(--plum); background: var(--paper); max-width: 78ch; }
.srch-int h3 { font-family: var(--display); font-weight: 400; font-size: 19px; color: var(--plum); margin-bottom: 8px; }
.srch-int p { font-size: 16px; line-height: 1.7; padding: 8px 0; }
.st { width: 100%; max-width: 860px; border-collapse: collapse; margin-top: 30px; font-variant-numeric: tabular-nums; }
.st th { font-weight: 400; font-size: 14px; color: var(--muted); text-align: right; padding: 0 0 10px 14px; border-bottom: 2px solid var(--plum); }
.st th:first-child, .st td:first-child { text-align: left; padding-left: 0; }
.st td { padding: 12px 0 12px 14px; border-bottom: 1px solid var(--rule-soft); text-align: right; font-size: 16px; color: var(--ink); }
.st-wrap { overflow-x: auto; }
.st-note { font-size: 14px; color: var(--muted); margin-top: 12px; max-width: 70ch; }

@media print { .top { position: static; } .links, .seg { display: none; } .intro { background: #fff; color: var(--ink); } .intro .mast-head, .tile b { color: var(--plum); } .intro-k, .intro-deck, .intro-meta, .tile span, .tile small { color: var(--muted); } .tile { border-color: var(--rule); } }
`;

const WIN_IDS = WINDOWS.map((w) => w.id);
const num = (id: WinId) => id.replace("m", "");

/* The switch rules, built from the window list so the default lives in one
   place (review-data.ts). Resets come before highlights: a bar can belong to
   several windows, and the later rule of equal weight wins. */
function switchCss() {
  const on = (w: WinId) => `.rv:has(#win-${w}:checked)`;
  const others = WIN_IDS.filter((w) => w !== DEFAULT_WIN);
  const d = num(DEFAULT_WIN);
  const lines: string[] = [];
  lines.push(`.wv-${DEFAULT_WIN} { display: block; }`, `.intro-in.wv-${DEFAULT_WIN} { display: grid; }`);
  lines.push(`.mc rect.i${d} { fill: var(--now); }`, `.mc rect.p${d} { fill: var(--past); }`);
  lines.push(`.hide-${DEFAULT_WIN} { display: none; }`);
  for (const w of others) {
    lines.push(`${on(w)} .wv-${DEFAULT_WIN} { display: none; }`);
    lines.push(`${on(w)} .wv-${w} { display: block; }`, `${on(w)} .intro-in.wv-${w} { display: grid; }`);
    lines.push(`${on(w)} .mc rect.i${d}, ${on(w)} .mc rect.p${d} { fill: var(--rule); }`);
    lines.push(`${on(w)} .hide-${DEFAULT_WIN} { display: block; }`);
  }
  for (const w of others) {
    const n = num(w);
    lines.push(`${on(w)} .mc rect.i${n} { fill: var(--now); }`, `${on(w)} .mc rect.p${n} { fill: var(--past); }`);
    lines.push(`${on(w)} .hide-${w} { display: none; }`);
  }
  return lines.join("\n");
}

/* --------------------------------------------------------------- helpers */

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthLong = (m: string) => `${MONTH_NAMES[Number(m.slice(5, 7)) - 1]} ${m.slice(0, 4)}`;
const monthShort = (m: string) => `${MONTH_NAMES[Number(m.slice(5, 7)) - 1].slice(0, 3)} ${m.slice(0, 4)}`;
// Exact counts, for chart tooltips and the tables under each chart.
const fmtInt = (v: number) => v.toLocaleString("en-US");
const fmtTick = (v: number) => (v >= 10000 ? `${v / 1000}k` : v.toLocaleString("en-US"));

function niceMax(n: number) {
  const steps = [5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000, 20000, 25000, 50000];
  for (const s of steps) { const m = Math.ceil(n / s) * s; if (m / s <= 4) return { max: m, step: s }; }
  return { max: Math.ceil(n / 100000) * 100000, step: 100000 };
}

function Section({ id, title, lede, wash, children }: { id: string; title: string; lede?: string; wash?: boolean; children: React.ReactNode }) {
  return (
    <section id={id} className={`sec${wash ? " sec-wash" : ""}`} aria-labelledby={`${id}-t`}>
      <div className="wrap">
        <div className="sec-head">
          <h2 className="sec-t" id={`${id}-t`}>{title}</h2>
          {lede ? <p className="sec-lede">{lede}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

/* One block per window; the switch shows the selected one. */
function PerWin({ render, className }: { render: (w: (typeof WINDOWS)[number]) => React.ReactNode; className?: string }) {
  return (
    <>
      {WINDOWS.map((w) => (
        <div key={w.id} className={`wv wv-${w.id}${className ? ` ${className}` : ""}`}>{render(w)}</div>
      ))}
    </>
  );
}

function igEmbed(url: string) {
  const m = url.match(/instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
  return m ? `https://www.instagram.com/p/${m[1]}/embed` : url;
}

function IgFrame({ url, title }: { url: string; title: string }) {
  return (
    <div className="ig">
      <iframe src={igEmbed(url)} title={title} scrolling="no" loading="lazy" allowFullScreen />
    </div>
  );
}

/* Monthly bars, server-rendered. Each bar carries a class per window it
   belongs to (i3, i6, i12) and per window it is the comparison for (p3, p6,
   p12, only where that window is compared); the switch CSS colors them. */
function MonthChart({ c }: { c: Chart }) {
  const W = 560, H = 196, L = 44, R = 6, T = 14, B = 30;
  const pw = W - L - R, ph = H - T - B;
  const n = c.points.length;
  const slot = pw / n;
  const bw = Math.max(4, Math.min(24, slot * 0.66));
  const { max, step } = niceMax(Math.max(1, ...c.points.map((p) => p.v)));
  const y = (v: number) => T + ph - (v / max) * ph;
  const ticks: number[] = [];
  for (let t = 0; t <= max; t += step) ticks.push(t);
  const last = n - 1;
  const labelAt = new Set<number>([0, last]);
  c.points.forEach((p, i) => { if (p.m.endsWith("-01") && i > 2 && i < last - 2) labelAt.add(i); });
  const cls = (m: string) =>
    WINDOWS.flatMap((w) => [
      w.months.includes(m) ? `i${num(w.id)}` : "",
      c.priorIn.includes(w.id) && w.priorMonths.includes(m) ? `p${num(w.id)}` : "",
    ]).filter(Boolean).join(" ");
  const hidden = WIN_IDS.filter((w) => !c.caption[w]).map((w) => `hide-${w}`).join(" ");
  return (
    <figure className={`mc${hidden ? ` ${hidden}` : ""}`}>
      <h3>{c.title}</h3>
      <PerWin render={(w) => (c.caption[w.id] ? <p className="mc-cap">{w.label}: {c.caption[w.id]}</p> : null)} />
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${c.title} by month, ${monthLong(c.points[0].m)} to ${monthLong(c.points[last].m)}. The figures are in the table below.`}>
        {ticks.map((t) => (
          <g key={t}>
            <line className={t === 0 ? "base" : "grid"} x1={L} x2={W - R} y1={y(t)} y2={y(t)} />
            <text x={L - 8} y={y(t) + 4} textAnchor="end">{fmtTick(t)}</text>
          </g>
        ))}
        {c.points.map((p, i) => {
          const cx = L + i * slot + slot / 2;
          const h = Math.max((p.v / max) * ph, p.v > 0 ? 2 : 0);
          return (
            <g key={p.m}>
              <rect className={`b ${cls(p.m)}`} x={cx - bw / 2} y={T + ph - h} width={bw} height={h} rx={Math.min(3, bw / 2)}>
                <title>{`${monthLong(p.m)}: ${fmtInt(p.v)} ${c.unit}`}</title>
              </rect>
              {labelAt.has(i) ? (
                <text x={cx} y={H - 8} textAnchor={i === 0 ? "start" : i === last ? "end" : "middle"}>{i === 0 || i === last ? monthShort(p.m) : p.m.slice(0, 4)}</text>
              ) : null}
            </g>
          );
        })}
      </svg>
      <p className="mc-note">{c.note}</p>
      <details className="tv">
        <summary>Show the monthly figures as a table</summary>
        <table>
          <thead><tr><th scope="col">Month</th><th scope="col">{c.title}</th></tr></thead>
          <tbody>{c.points.map((p) => <tr key={p.m}><td>{monthLong(p.m)}</td><td>{fmtInt(p.v)}</td></tr>)}</tbody>
        </table>
      </details>
    </figure>
  );
}

function Numbers({ w }: { w: (typeof WINDOWS)[number] }) {
  const rows = RV.numbers.rows[w.id];
  const groups: { name: string; rows: Row[] }[] = [];
  for (const r of rows) {
    const g = groups.find((x) => x.name === r.group);
    if (g) g.rows.push(r); else groups.push({ name: r.group, rows: [r] });
  }
  return (
    <table className="lg">
      <caption className="sr">Each measure for {w.period} against {w.prior}</caption>
      <thead>
        <tr className="lg-cols">
          <th scope="col">Measure</th>
          <th scope="col">{w.label}<small>{w.period}</small></th>
          <th scope="col">Change</th>
          <th scope="col">Period before<small>{w.prior}</small></th>
        </tr>
      </thead>
      {groups.map((g) => (
        <tbody key={g.name}>
          <tr className="lg-g"><th colSpan={4} scope="colgroup">{g.name}</th></tr>
          {g.rows.map((r) => {
            const c = r.c ?? "";
            const arrow = c.startsWith("+") ? "▲" : c.startsWith("−") ? "▼" : "";
            return (
              <tr className="lg-r" key={r.k}>
                <td>
                  <div className="lg-k">{r.k}</div>
                  <div className="lg-n">{r.note}</div>
                  {IS_INTERNAL && r.noteInternal ? <div className="lg-ni"><b>Internal: </b>{r.noteInternal}</div> : null}
                </td>
                <td><span className="lg-v">{r.v}</span></td>
                {r.na ? (
                  <td className="lg-na" colSpan={2}>{r.na}</td>
                ) : (
                  <>
                    <td className="lg-c">{arrow ? <i aria-hidden="true">{arrow}</i> : null}{c}</td>
                    <td className="lg-pv"><span className="lg-p">{r.prior}</span></td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      ))}
    </table>
  );
}

/* ================================================================== PAGE */
export default function ReviewPage() {
  return (
    <div className="rv">
      <style dangerouslySetInnerHTML={{ __html: CSS + REVIEW_CSS + switchCss() }} />

      <h1 className="sr">{RV.client}: 3, 6 and 12-month review</h1>

      <header className="top">
        <div className="wrap top-in">
          <div className="brand">
            <a className="brand-a" href="#top" aria-label={`${RV.client}, back to the top`}>
              <img src={MONO} alt="" width={40} height={40} />
              <b>{RV.client}</b>
            </a>
            <small className="brand-s">3, 6 and 12-month review{IS_INTERNAL ? <i className="badge">Internal</i> : null} · <a href="/">Weekly report</a></small>
          </div>
          <nav className="links" aria-label="Review sections">
            {NAV.map((n) => <a key={n.id} href={`#${n.id}`}>{n.label}</a>)}
          </nav>
          <fieldset className="seg">
            <legend>Period</legend>
            {WINDOWS.map((w) => (
              <label key={w.id}>
                <input type="radio" name="win" id={`win-${w.id}`} value={w.id} defaultChecked={w.id === DEFAULT_WIN} />
                <span>{w.label}</span>
              </label>
            ))}
          </fieldset>
        </div>
      </header>

      <section className="intro" id="top" aria-label="Summary">
        <div className="wrap">
          <PerWin className="intro-in" render={(w) => {
            const l = RV.lead[w.id];
            return (
              <>
                <div className="intro-copy">
                  <p className="intro-k">{w.label} · {w.period}</p>
                  <h2 className="mast-head">{l.headline}</h2>
                  <p className="intro-deck">{l.deck}</p>
                  <p className="intro-meta">{l.against ? `Against ${w.prior} · ` : ""}Read {RV.readOn}</p>
                  {IS_INTERNAL ? <p className="intro-note">{l.internalNote}</p> : null}
                </div>
                <ul className="tiles">
                  {l.figures.map((f) => <li className="tile" key={f.l}><b>{f.v}</b><span>{f.l}</span><small>{f.sub}</small></li>)}
                </ul>
              </>
            );
          }} />
        </div>
      </section>

      <div className="how">
        <div className="wrap how-in">
          {RV.brief.map((b) => (
            <div className="how-i" key={b.role}>
              <h2 className="how-t">{b.role}</h2>
              <p>{b.text}</p>
            </div>
          ))}
        </div>
      </div>

      <main>
        <Section id="numbers" title="The numbers" lede={RV.numbers.lede}>
          <PerWin render={(w) => <Numbers w={w} />} />
        </Section>

        <Section id="months" title="Month by month" lede={RV.months.lede} wash>
          <div className="key">
            <span><i style={{ background: "var(--now)" }} />Selected period</span>
            <span><i style={{ background: "var(--past)" }} />Period compared</span>
            <span><i style={{ background: "var(--rule)" }} />Other months</span>
          </div>
          <div className="mcs">
            {RV.months.charts.map((c) => <MonthChart key={c.id} c={c} />)}
          </div>
        </Section>

        <Section id="worked" title="What worked" lede={RV.worked.lede}>
          <div className="hero">
            <IgFrame url={RV.worked.hero.url} title={RV.worked.hero.title} />
            <div>
              <p className="hero-meta">{RV.worked.hero.format}, {RV.worked.hero.date}</p>
              <h3 className="hero-t">{RV.worked.hero.title}</h3>
              <div className="stats">
                <div><b>{short(RV.worked.hero.views)}</b><span>Views</span></div>
                <div><b>{short(RV.worked.hero.reach)}</b><span>Accounts reached</span></div>
                <div><b>{short(RV.worked.hero.responses)}</b><span>Responses</span></div>
              </div>
              <p className="why">{RV.worked.hero.why}</p>
            </div>
          </div>
          <PerWin render={(w) => (
            <>
              <div className="gal">
                {RV.worked.byWin[w.id].gallery.map((g) => (
                  <div key={g.url}>
                    <IgFrame url={g.url} title={g.title} />
                    <p className="gal-d">{g.format}, {g.date}</p>
                    <p className="gal-t">{g.title}</p>
                    <p className="gal-s">{short(g.views)} views, {short(g.reach)} reach, {short(g.responses)} responses</p>
                  </div>
                ))}
              </div>
              <p className="gal-note">{RV.worked.byWin[w.id].note} {RV.worked.footnote}</p>
            </>
          )} />
        </Section>

        <Section id="search" title="Search" lede={RV.search.lede} wash>
          <div className="srch">
            {RV.search.paras.map((p) => <p key={p}>{p}</p>)}
          </div>
          <div className="st-wrap">
            <table className="st">
              <caption className="sr">US search by month, November 2025 to October 2026</caption>
              <thead><tr>{RV.search.table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
              <tbody>{RV.search.table.rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <p className="st-note">{RV.search.tableNote}</p>
          {IS_INTERNAL && RV.search.parasInternal.length ? (
            <div className="srch-int">
              <h3>Internal</h3>
              {RV.search.parasInternal.map((p) => <p key={p}>{p}</p>)}
            </div>
          ) : null}
        </Section>

        {has("notes") ? (
          <Section id="notes" title="Data notes" lede={RV.notes.lede}>
            <div className="att">
              {RV.notes.items.map((a) => (
                <div className="att-i" key={a.title}>
                  <h3 className="att-t">{a.title}</h3>
                  <p className="att-b">{a.body}</p>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        <Section id="detail" title="Detail" lede={RV.detail.lede} wash={has("notes")}>
          <div className="dt">
            {RV.detail.panels.map((p) => (
              <details key={p.id}>
                <summary>{p.title}</summary>
                <div className="dt-p">
                  {p.rows.length ? <table><tbody>{p.rows.map((row) => <tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td></tr>)}</tbody></table> : null}
                  {(p.faq ?? []).map((f) => <div className="faq" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
                  {p.note ? <p className="dt-note">{p.note}</p> : null}
                </div>
              </details>
            ))}
          </div>
        </Section>
      </main>

      <footer className="foot">
        <div className="wrap foot-in">
          <span>{RV.client}, 3, 6 and 12-month review to October 31, 2026</span>
          <img src={MONO} alt="" aria-hidden="true" width={44} height={44} />
          <span>Prepared by {RV.studio}</span>
        </div>
      </footer>
    </div>
  );
}
