"use client";
import { useState, useEffect, useRef, ReactNode } from "react";
import { REPORT, IS_INTERNAL, NAV, numOf, has, SOURCE_WINDOWS } from "./report-data";

/* ==========================================================================
   PRESENTATION  ·  NYC Dental Smiles
   --------------------------------------------------------------------------
   Structure and styling only. Does not change between cycles; every figure,
   date and sentence lives in report-data.ts.
   ========================================================================== */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Inter:wght@400;500;600;700&display=swap');

.nyc {
  --paper: #FAFAF8;
  --paper-2: #F3EFEA;
  --ink: #251F22;
  --ink-2: #574C52;
  --ink-3: #6E6268;
  --plum: #6F5060;
  --plum-deep: #4E3846;
  --sand: #DED3C9;
  --sand-2: #EDE6DF;
  --steel: #8FA1A6;
  --steel-ink: #4F6169;
  --clay: #A6968D;
  --flag: #9C4444;
  --flag-bg: #F7EDEC;

  --measure: 44rem;
  --serif: 'Marcellus', 'Iowan Old Style', Georgia, serif;
  --sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  background: var(--paper);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 16px;
  line-height: 1.6;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}
.nyc *, .nyc *::before, .nyc *::after { box-sizing: border-box; }
/* Deliberately no element-level paragraph reset here: an element selector
   scoped under .nyc outranks the single-class rules below, which would
   silently override every margin the components set. */
.nyc h1, .nyc h2, .nyc h3, .nyc h4 { margin: 0; font-weight: 400; }

/* ---------- layout ---------- */
.wrap { max-width: var(--measure); margin: 0 auto; padding: 0 24px; }
.wide { max-width: 60rem; margin: 0 auto; padding: 0 24px; }

/* ---------- masthead ---------- */
.masthead { border-bottom: 1px solid var(--sand); background: var(--paper); }
.mast-inner { padding: 48px 0 32px; }
.mast-kicker {
  font-size: 11px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase;
  color: var(--plum); margin-bottom: 20px;
}
.mast-flag {
  display: inline-block; margin-left: 10px; padding: 3px 8px;
  border: 1px solid var(--plum); color: var(--plum); background: #F5F0F2;
  font-size: 10px; font-weight: 700; letter-spacing: .12em; border-radius: 2px;
}
.mast-title { font-family: var(--serif); font-size: clamp(30px, 5vw, 44px); line-height: 1.14; letter-spacing: -.01em; }
.mast-meta { margin-top: 18px; display: flex; flex-wrap: wrap; gap: 8px 20px; align-items: baseline; }
.mast-period { font-size: 15px; font-weight: 600; color: var(--ink); }
.mast-len { font-size: 13px; color: var(--ink-3); }
.mast-paid {
  margin-top: 18px; font-size: 14px; color: var(--ink-2);
  border-left: 2px solid var(--sand); padding-left: 14px;
}

/* ---------- sticky nav ---------- */
.railwrap { position: sticky; top: 0; z-index: 40; background: rgba(250,250,248,.94); backdrop-filter: blur(8px); border-bottom: 1px solid var(--sand); }
.rail { display: flex; gap: 4px; overflow-x: auto; padding: 10px 0; scrollbar-width: none; }
.rail::-webkit-scrollbar { display: none; }
.rail a {
  font-size: 12.5px; font-weight: 600; color: var(--ink-3); text-decoration: none;
  padding: 6px 10px; border-radius: 2px; white-space: nowrap; transition: color .15s, background .15s;
}
.rail a:hover { color: var(--plum); background: var(--sand-2); }
.rail a.on { color: var(--plum); background: var(--sand-2); }

/* ---------- section ---------- */
.sec { padding: 64px 0 8px; }
.sec-num {
  font-family: var(--serif); font-size: 13px; color: var(--plum);
  letter-spacing: .04em; margin-bottom: 10px;
}
.sec-title { font-family: var(--serif); font-size: clamp(24px, 3.4vw, 32px); line-height: 1.22; letter-spacing: -.005em; max-width: 30ch; }
.sec-lede { margin-top: 14px; font-size: 16.5px; color: var(--ink-2); max-width: 62ch; }
.rule { height: 1px; background: var(--sand); border: 0; margin: 0; }

/* reveal — content is ALWAYS visible in the markup. The entrance is an
   animation played on scroll-in, never a hidden start state. This keeps the
   server and client markup identical (no hydration mismatch) and means the
   report still reads in full if JavaScript never runs or fails. */
.rv { opacity: 1; transform: none; }
.rv.in { animation: rv-in .5s cubic-bezier(.2,.7,.3,1) both; }
@keyframes rv-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

/* ---------- the brief ---------- */
.brief-head { font-family: var(--serif); font-size: clamp(22px, 3.2vw, 30px); line-height: 1.28; margin: 8px 0 32px; max-width: 26ch; }
.brief-item { display: grid; grid-template-columns: 150px 1fr; gap: 24px; padding: 22px 0; border-top: 1px solid var(--sand); }
.brief-item:last-child { border-bottom: 1px solid var(--sand); }
.brief-role {
  font-size: 11px; font-weight: 700; letter-spacing: .13em; text-transform: uppercase;
  color: var(--plum); padding-top: 4px;
}
.brief-text { font-size: 16.5px; color: var(--ink); margin: 0; }

/* ---------- scoreboard ---------- */
.score { margin-top: 8px; }
.score-row { display: grid; grid-template-columns: 190px 1fr; gap: 28px; padding: 26px 0; border-top: 1px solid var(--sand); align-items: start; }
.score-row:last-child { border-bottom: 1px solid var(--sand); }
.score-metric { font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); }
.score-val { font-family: var(--serif); font-size: 40px; line-height: 1.05; margin-top: 6px; color: var(--ink); font-variant-numeric: tabular-nums; }
.score-sub { font-size: 12.5px; color: var(--ink-3); margin-top: 4px; }
.score-change { display: flex; align-items: baseline; gap: 7px; font-size: 13.5px; font-weight: 600; margin-bottom: 8px; }
.score-reading { font-size: 15.5px; color: var(--ink-2); margin: 0; }
.d-up { color: var(--steel-ink); }
.d-down { color: var(--plum); }
.d-flat, .d-none { color: var(--ink-3); font-weight: 500; }
.tone-good .score-val { color: var(--plum-deep); }

/* ---------- what worked ---------- */
.work { border: 1px solid var(--sand); background: #fff; margin-top: 28px; }
.work-media { position: relative; background: var(--sand-2); border-bottom: 1px solid var(--sand); display: flex; align-items: center; justify-content: center; }
.work-media.has-img { aspect-ratio: 4 / 3; }
.work-media.no-img { padding: 26px 20px; }
.work-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.work-ph { text-align: center; }
.work-ph-label { font-size: 12px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); }
.work-ph-sub { font-size: 13px; color: var(--ink-3); margin-top: 8px; max-width: 34ch; }
.work-body { padding: 24px 26px 26px; }
.work-kicker { font-size: 11px; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; color: var(--plum); }
.work-title { font-family: var(--serif); font-size: 22px; line-height: 1.28; margin-top: 8px; }
.work-stats { display: flex; flex-wrap: wrap; gap: 0; margin: 20px 0; border-top: 1px solid var(--sand); border-bottom: 1px solid var(--sand); }
.work-stat { flex: 1 1 130px; padding: 14px 14px 14px 0; min-width: 0; }
.work-stat + .work-stat { border-left: 1px solid var(--sand); padding-left: 16px; }
.work-stat:last-child { padding-right: 0; }
.work-stat-v { font-family: var(--serif); font-size: 24px; line-height: 1; font-variant-numeric: tabular-nums; }
.work-stat-l { font-size: 11px; font-weight: 600; letter-spacing: .07em; text-transform: uppercase; color: var(--ink-3); margin-top: 6px; }
.work-q { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 6px; }
.work-a { font-size: 15.5px; color: var(--ink-2); margin: 0 0 18px; }
.work-a:last-child { margin-bottom: 0; }
.work-link { font-size: 13px; font-weight: 600; color: var(--plum); text-decoration: none; border-bottom: 1px solid var(--sand); }
.work-link:hover { border-color: var(--plum); }

.channel { margin-top: 32px; border-left: 3px solid var(--plum); padding: 4px 0 4px 20px; }
.channel-t { font-family: var(--serif); font-size: 20px; line-height: 1.3; }
.channel-b { font-size: 15.5px; color: var(--ink-2); margin: 10px 0 0; }

/* ---------- attention ---------- */
.att { padding: 26px 0; border-top: 1px solid var(--sand); }
.att:last-child { border-bottom: 1px solid var(--sand); }
.tag {
  display: inline-block; font-size: 10.5px; font-weight: 700; letter-spacing: .12em;
  text-transform: uppercase; padding: 4px 9px; border: 1px solid; border-radius: 2px;
}
.tag-issue { color: var(--flag); border-color: var(--flag); background: var(--flag-bg); }
.tag-expected { color: var(--steel-ink); border-color: var(--steel); background: #EEF2F3; }
.tag-limitation { color: var(--ink-2); border-color: var(--clay); background: var(--sand-2); }
.tag-early { color: var(--plum); border-color: var(--plum); background: #F5F0F2; }
.att-t { font-family: var(--serif); font-size: 20px; line-height: 1.32; margin: 14px 0 10px; max-width: 34ch; }
.att-b { font-size: 15.5px; color: var(--ink-2); margin: 0; }
.att-so { margin-top: 12px; font-size: 15px; color: var(--ink); border-left: 2px solid var(--sand); padding-left: 14px; }
.att-so b { font-weight: 700; }

/* ---------- learned ---------- */
.learn { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--sand); border: 1px solid var(--sand); margin-top: 28px; }
.learn-c { background: var(--paper); padding: 28px 24px; }
.learn-f { font-family: var(--serif); font-size: 38px; line-height: 1.05; color: var(--plum); font-variant-numeric: tabular-nums; }
.learn-u { font-size: 11.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); margin-top: 8px; }
.learn-t { font-size: 15px; color: var(--ink-2); margin: 14px 0 0; }

/* ---------- moves ---------- */
.move { display: grid; grid-template-columns: 44px 1fr; gap: 20px; padding: 28px 0; border-top: 1px solid var(--sand); }
.move:last-child { border-bottom: 1px solid var(--sand); }
.move-n { font-family: var(--serif); font-size: 28px; color: var(--plum); line-height: 1; padding-top: 2px; }
.move-a { font-family: var(--serif); font-size: 21px; line-height: 1.3; max-width: 34ch; }
.move-w { font-size: 15.5px; color: var(--ink-2); margin: 12px 0 0; }
.move-meta { display: flex; flex-wrap: wrap; gap: 10px 32px; margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--sand-2); }
.move-meta div { min-width: 200px; }
.move-meta dt { font-size: 10.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
.move-meta dd { margin: 4px 0 0; font-size: 14px; color: var(--ink); }

/* ---------- what we do next (client) ---------- */
.plan { margin-top: 26px; }
.plan-i { display: grid; grid-template-columns: 8px 1fr; gap: 20px; padding: 24px 0; border-top: 1px solid var(--sand); }
.plan-i:last-child { border-bottom: 1px solid var(--sand); }
.plan-m { width: 8px; height: 8px; background: var(--plum); margin-top: 12px; }
.plan-t { font-family: var(--serif); font-size: 20px; line-height: 1.3; max-width: 34ch; }
.plan-b { font-size: 15.5px; color: var(--ink-2); margin: 10px 0 0; }
@media (max-width: 720px) { .plan-i { grid-template-columns: 8px 1fr; gap: 14px; } }

/* ---------- detail / disclosure ---------- */
.disc { border-top: 1px solid var(--sand); }
.disc:last-of-type { border-bottom: 1px solid var(--sand); }
.disc-btn {
  width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 20px 0; background: none; border: 0; cursor: pointer; text-align: left;
  font-family: var(--sans); color: var(--ink);
}
.disc-btn:focus-visible { outline: 2px solid var(--plum); outline-offset: 3px; }
.disc-t { font-family: var(--serif); font-size: 19px; line-height: 1.3; }
.disc-s { font-size: 13px; color: var(--ink-3); margin-top: 3px; }
.disc-i { flex-shrink: 0; width: 22px; height: 22px; position: relative; }
.disc-i::before, .disc-i::after { content: ''; position: absolute; background: var(--plum); transition: transform .22s ease; }
.disc-i::before { left: 0; top: 10px; width: 22px; height: 1.5px; }
.disc-i::after { left: 10px; top: 0; width: 1.5px; height: 22px; }
.disc-btn[aria-expanded="true"] .disc-i::after { transform: scaleY(0); }
.disc-panel { padding: 4px 0 34px; }

/* ---------- charts + tables ---------- */
.chart-t { font-size: 15px; font-weight: 700; color: var(--ink); margin: 0 0 4px; max-width: 46ch; }
.chart-n { font-size: 13.5px; color: var(--ink-3); margin: 0 0 16px; max-width: 62ch; }
.block { margin-bottom: 34px; }
.block:last-child { margin-bottom: 0; }

.bar-row { display: grid; grid-template-columns: 1fr; gap: 5px; padding: 9px 0; }
.bar-top { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
.bar-l { font-size: 14px; color: var(--ink); }
.bar-v { font-size: 14px; font-weight: 700; font-variant-numeric: tabular-nums; color: var(--ink); }
.bar-track { height: 7px; background: var(--sand-2); }
.bar-fill { height: 100%; background: var(--plum); transition: width .9s cubic-bezier(.2,.7,.3,1); }
.bar-fill.alt { background: var(--steel); }

.stack { display: flex; height: 34px; border: 1px solid var(--sand); overflow: hidden; }
.stack-seg { display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; min-width: 0; overflow: hidden; }
.stack-key { display: flex; flex-wrap: wrap; gap: 8px 22px; margin-top: 12px; }
.stack-key span { font-size: 13px; color: var(--ink-2); display: flex; align-items: center; gap: 7px; }
.stack-key i { width: 10px; height: 10px; display: block; }

table.t { width: 100%; border-collapse: collapse; font-size: 14px; }
table.t th {
  text-align: left; font-size: 10.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  color: var(--ink-3); padding: 0 10px 9px 0; border-bottom: 1px solid var(--sand); white-space: nowrap;
}
table.t td { padding: 11px 10px 11px 0; border-bottom: 1px solid var(--sand-2); vertical-align: top; }
table.t td.n, table.t th.n { text-align: right; font-variant-numeric: tabular-nums; padding-right: 0; }
table.t tr:last-child td { border-bottom: 1px solid var(--sand); }
.t-wrap { overflow-x: auto; }
.na { color: var(--ink-3); font-style: italic; font-size: 13px; }

.kv { display: flex; flex-wrap: wrap; gap: 1px; background: var(--sand); border: 1px solid var(--sand); margin-bottom: 22px; }
.kv > div { background: var(--paper); padding: 16px 18px; flex: 1 1 140px; }
.kv dt { font-size: 10.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); }
.kv dd { margin: 6px 0 0; font-family: var(--serif); font-size: 24px; line-height: 1; font-variant-numeric: tabular-nums; }

.note {
  font-size: 13.5px; color: var(--ink-2); background: var(--sand-2);
  border-left: 2px solid var(--clay); padding: 12px 16px; margin: 16px 0 0;
}
.note b { font-weight: 700; color: var(--ink); }

.spark-lbl { display: flex; justify-content: space-between; font-size: 11.5px; color: var(--ink-3); margin-top: 6px; }

/* ---------- method + footer ---------- */
.method-q { font-family: var(--serif); font-size: 17px; margin-bottom: 8px; }
.method-a { font-size: 15px; color: var(--ink-2); margin: 0 0 26px; max-width: 62ch; }
.foot { border-top: 1px solid var(--sand); margin-top: 64px; padding: 30px 0 60px; font-size: 13px; color: var(--ink-3); display: flex; flex-wrap: wrap; gap: 8px 20px; justify-content: space-between; }

/* ---------- responsive ---------- */
@media (max-width: 720px) {
  .brief-item { grid-template-columns: 1fr; gap: 8px; }
  .score-row { grid-template-columns: 1fr; gap: 12px; }
  .learn { grid-template-columns: 1fr; }
  .move { grid-template-columns: 30px 1fr; gap: 14px; }
  .move-n { font-size: 22px; }
  .work-stat + .work-stat { border-left: 0; padding-left: 0; }
  .work-stat { flex: 1 1 45%; }
  .sec { padding: 48px 0 4px; }
  .mast-inner { padding: 34px 0 26px; }
}

/* ---------- print ---------- */
@media print {
  .nyc { background: #fff; font-size: 11pt; }
  .railwrap, .no-print { display: none !important; }
  .rv, .rv.in { opacity: 1 !important; transform: none !important; animation: none !important; }
  .disc-panel { display: block !important; }
  .disc-i { display: none; }
  .sec, .work, .att, .move, .learn-c, .disc { break-inside: avoid; page-break-inside: avoid; }
  .sec { padding: 24pt 0 0; }
  .sec-title, .mast-title, .brief-head { break-after: avoid; }
  a { color: inherit; text-decoration: none; }
  .wrap, .wide { max-width: 100%; padding: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .nyc *, .nyc *::before, .nyc *::after { transition: none !important; animation: none !important; }
  .rv, .rv.in { opacity: 1 !important; transform: none !important; animation: none !important; }
}

/* ---------- source windows strip ---------- */
.srcs { display: flex; flex-wrap: wrap; gap: 1px; background: var(--sand); border: 1px solid var(--sand); margin-top: 26px; }
.srcs > div { background: var(--paper); padding: 14px 16px; flex: 1 1 155px; }
.srcs dt { font-size: 10.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); }
.srcs dd { margin: 5px 0 0; font-size: 14px; font-weight: 600; color: var(--ink); font-variant-numeric: tabular-nums; }
.srcs p { margin: 6px 0 0; font-size: 12.5px; color: var(--ink-3); line-height: 1.45; }

/* ---------- period line (signature) ---------- */
.pl { margin-top: 28px; border: 1px solid var(--sand); background: #fff; padding: 22px 22px 18px; }
.pl-svg { display: block; width: 100%; height: auto; }
.pl-bands { display: flex; flex-wrap: wrap; gap: 1px; background: var(--sand); border: 1px solid var(--sand); margin-top: 20px; }
.pl-band { background: var(--paper); padding: 14px 18px; flex: 1 1 180px; }
.pl-band dt { font-size: 10.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); }
.pl-band dd { margin: 6px 0 0; font-family: var(--serif); font-size: 26px; line-height: 1; }
.pl-band p { margin: 5px 0 0; font-size: 12.5px; color: var(--ink-3); }

/* ---------- post gallery ---------- */
.gal { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--sand); border: 1px solid var(--sand); margin-top: 28px; }
.gal-i { background: var(--paper); display: flex; flex-direction: column; text-decoration: none; color: inherit; transition: background .18s; }
.gal-i:hover { background: #fff; }
.gal-i:focus-visible { outline: 2px solid var(--plum); outline-offset: -2px; }
.gal-i.lead { grid-column: 1 / -1; }
/* Instagram's embed page stacks a header, the media, then a caption/actions
   footer. --ig-top lifts the header out of view and --ig-tall gives the iframe
   enough height that the media fills the frame before the footer is clipped.
   Adjust those two values if Instagram changes the embed chrome. */
.gal-shot { position: relative; aspect-ratio: 1 / 1; background: var(--sand-2); overflow: hidden; --ig-top: 56px; --ig-tall: 260px; }
/* The hero spans the full width, but Instagram renders its media at the width
   of the iframe. Letting it run edge to edge would make a square post taller
   than any sensible banner, so the frame is centred at a fixed width and the
   card height is set to match. 440px wide clears a square post (440 tall) and
   a 4:5 portrait (550 tall) without cropping either. */
.gal-i.lead .gal-shot { aspect-ratio: auto; height: 560px; --ig-tall: 420px; }
.gal-crop { position: absolute; inset: 0; overflow: hidden; }
.gal-i.lead .gal-crop { left: 50%; transform: translateX(-50%); width: min(100%, 440px); }
.gal-crop iframe {
  position: absolute; top: calc(var(--ig-top) * -1); left: 0;
  width: 100%; height: calc(100% + var(--ig-top) + var(--ig-tall));
  border: 0; display: block; background: var(--sand-2);
}
/* Shown only when printing, where iframes render blank. */
.gal-print { display: none; }
.gal-rank { position: absolute; top: 0; left: 0; background: var(--plum); color: #fff; font-family: var(--serif); font-size: 15px; line-height: 1; padding: 7px 10px; }
.gal-b { padding: 14px 16px 16px; display: flex; flex-direction: column; flex: 0 0 auto; }
.gal-k { font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--plum); }
.gal-t { font-family: var(--serif); font-size: 16px; line-height: 1.3; margin-top: 6px; }
.gal-i.lead .gal-t { font-size: 21px; }
.gal-s { display: flex; gap: 16px; margin-top: auto; padding-top: 14px; }
.gal-s div { min-width: 0; }
.gal-s b { display: block; font-family: var(--serif); font-size: 18px; font-weight: 400; line-height: 1; font-variant-numeric: tabular-nums; }
.gal-s span { display: block; font-size: 9.5px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--ink-3); margin-top: 5px; }
.gal-link { display: inline-block; margin-top: 14px; font-size: 12.5px; font-weight: 600; color: var(--plum); text-decoration: none; border-bottom: 1px solid var(--sand); padding-bottom: 2px; }
.gal-link:hover { border-bottom-color: var(--plum); }

@media (max-width: 520px) {
  .gal { grid-template-columns: 1fr; }
  .gal-i.lead .gal-shot { height: auto; aspect-ratio: 4 / 5; }
  .gal-i.lead .gal-crop { width: 100%; }
  .gal-i.lead .gal-t { font-size: 18px; }
}
@media print {
  .gal { grid-template-columns: repeat(2, 1fr); }
  .gal-i, .gal-i.lead { break-inside: avoid; }
  .gal-i .gal-shot, .gal-i.lead .gal-shot { aspect-ratio: 3 / 1; }
  .gal-crop { display: none; }
  .gal-print { display: flex; position: absolute; inset: 0; flex-direction: column;
    align-items: center; justify-content: center; text-align: center; padding: 12px; }
  .gal-print span { font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
  .gal-print em { font-style: normal; font-family: var(--serif); font-size: 14px; color: var(--ink); margin-top: 5px; }
  .gal-link { display: none; }
}

/* ---------- email funnel ---------- */
.fun-row { display: grid; gap: 5px; padding: 9px 0; }
.fun-top { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
.fun-l { font-size: 14px; color: var(--ink); }
.fun-v { font-size: 14px; font-weight: 700; font-variant-numeric: tabular-nums; }
.fun-track { height: 24px; background: var(--sand-2); display: flex; align-items: center; }
.fun-fill { height: 100%; background: var(--plum); display: flex; align-items: center; padding-left: 10px; color: #fff; font-size: 12px; font-weight: 700; transition: width .9s cubic-bezier(.2,.7,.3,1); }
.fun-fill.thin { background: var(--steel); color: var(--ink); padding-left: 0; }
.fun-out { font-size: 12px; font-weight: 700; color: var(--ink-2); padding-left: 10px; }

/* ---------- email reads ---------- */
.reads { margin: 18px 0 0; padding: 0; list-style: none; }
.reads li { font-size: 15px; color: var(--ink-2); padding: 11px 0 11px 18px; border-top: 1px solid var(--sand-2); position: relative; }
.reads li:first-child { border-top: 0; }
.reads li::before { content: ''; position: absolute; left: 0; top: 19px; width: 6px; height: 6px; background: var(--plum); }

/* ---------- campaign gap list ---------- */
.camp { display: grid; grid-template-columns: 1fr 62px 54px; gap: 12px; align-items: center; padding: 10px 0; border-top: 1px solid var(--sand-2); font-size: 14px; }
.camp:first-of-type { border-top: 0; }
.camp-n { color: var(--ink); }
.camp-d { font-size: 12.5px; color: var(--ink-3); text-align: right; }
.camp-r { font-weight: 700; font-variant-numeric: tabular-nums; text-align: right; }
.camp.low .camp-n, .camp.low .camp-r { color: var(--flag); }

@media (max-width: 720px) {
  .pl { padding: 16px 14px 14px; }
  .camp { grid-template-columns: 1fr 54px; }
  .camp-d { display: none; }
}

@media print {
  .pl { border-color: #999; }
  .pl-bands, .srcs { break-inside: avoid; }
}
`;
function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  /* Starts false on both server and client, so the first client render is
     byte-identical to the server's. The class is only ever added later. */
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    /* Already on screen when the page loaded — it is visible, leave it alone
       rather than animating it in after the fact. */
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setPlay(true); io.disconnect(); } }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`rv${play ? " in" : ""}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Section({
  id, num, title, lede, children,
}: { id: string; num: string; title: string; lede?: string; children: ReactNode }) {
  return (
    <section id={id} className="sec">
      <Reveal>
        <div className="sec-num">{num}</div>
        <h2 className="sec-title">{title}</h2>
        {lede ? <p className="sec-lede">{lede}</p> : null}
      </Reveal>
      {children}
    </section>
  );
}

function Delta({ dir, text }: { dir: string; text: string }) {
  const glyph = dir === "up" ? "▲" : dir === "down" ? "▼" : dir === "flat" ? "—" : "";
  return (
    <div className={`score-change d-${dir}`}>
      {glyph ? <span aria-hidden="true">{glyph}</span> : null}
      <span>{text}</span>
    </div>
  );
}

/** Ranked horizontal bars with the value printed on every row. */
function BarList({
  items, unit, alt = false, max: forcedMax,
}: { items: { label: string; value: number; note?: string }[]; unit?: string; alt?: boolean; max?: number }) {
  const max = forcedMax ?? Math.max(...items.map((i) => i.value), 1);
  return (
    <div>
      {items.map((it) => (
        <div className="bar-row" key={it.label}>
          <div className="bar-top">
            <span className="bar-l">{it.label}</span>
            <span className="bar-v">{it.value.toLocaleString()}{unit ? ` ${unit}` : ""}</span>
          </div>
          <div className="bar-track">
            <div className={`bar-fill${alt ? " alt" : ""}`} style={{ width: `${(it.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Single stacked bar for a two- or three-way split. Replaces donuts. */
function Stack({ parts }: { parts: { label: string; pct: number }[] }) {
  /* Each fill is paired with a text colour that clears WCAG AA against it.
     White fails on the two lighter fills, so those carry dark text instead. */
  const fills = [
    { bg: "#6F5060", fg: "#FFFFFF" },
    { bg: "#8FA1A6", fg: "#251F22" },
    { bg: "#A6968D", fg: "#251F22" },
  ];
  return (
    <div>
      <div className="stack">
        {parts.map((p, i) => {
          const f = fills[i % fills.length];
          return (
            <div key={p.label} className="stack-seg" style={{ width: `${p.pct}%`, background: f.bg, color: f.fg }}>
              {p.pct >= 14 ? `${p.pct}%` : ""}
            </div>
          );
        })}
      </div>
      <div className="stack-key">
        {parts.map((p, i) => (
          <span key={p.label}>
            <i style={{ background: fills[i % fills.length].bg }} />
            {p.label} — {p.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}

function Chart({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <div className="block">
      <p className="chart-t">{title}</p>
      {note ? <p className="chart-n">{note}</p> : null}
      {children}
    </div>
  );
}

function Note({ children }: { children: ReactNode }) {
  return <p className="note">{children}</p>;
}

function Disclosure({
  title, subtitle, defaultOpen = false, children,
}: { title: string; subtitle?: string; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="disc">
      <button className="disc-btn" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span>
          <span className="disc-t">{title}</span>
          {subtitle ? <span className="disc-s" style={{ display: "block" }}>{subtitle}</span> : null}
        </span>
        <span className="disc-i" aria-hidden="true" />
      </button>
      <div className="disc-panel" hidden={!open}>{children}</div>
    </div>
  );
}

/** Plain table driven entirely by data, so the column set can differ between
 *  the internal and client builds without touching this file. First column is
 *  the label; the rest are numeric and right-aligned. */
function SimpleTable({ table }: { table: { head: string[]; rows: string[][] } }) {
  return (
    <div className="t-wrap">
      <table className="t">
        <thead>
          <tr>
            {table.head.map((h, i) => (
              <th key={h} className={i === 0 ? undefined : "n"}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td key={i} className={i === 0 ? undefined : "n"}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KV({ items }: { items: { k: string; v: string }[] }) {
  return (
    <dl className="kv">
      {items.map((i) => (
        <div key={i.k}>
          <dt>{i.k}</dt>
          <dd>{i.v}</dd>
        </div>
      ))}
    </dl>
  );
}

const TAG_LABEL: Record<string, string> = {
  issue: "Performance issue",
  expected: "Expected change",
  limitation: "Data limitation",
  early: "Too early to judge",
};

/** The signature chart. One continuous daily line across both halves of the
 *  month, with each half's average drawn directly on top of it so any step
 *  between them is visible rather than asserted.
 *
 *  `splitAt` is the index of the last day of the earlier half — whatever that
 *  half represents. It was a paid flight; this cycle it is simply the previous
 *  reporting period. Pass `shade` to tint the earlier half and label it. */
function PeriodChart({
  series, splitAt, markers, shade,
}: {
  series: { d: string; v: number }[];
  splitAt: number;
  markers: { i: number; label: string }[];
  shade?: { through: number; label: string } | null;
}) {
  const W = 720, H = 230, L = 34, R = 14, T = 30, B = 34;
  const max = 60;
  const x = (i: number) => L + (i / Math.max(series.length - 1, 1)) * (W - L - R);
  const y = (v: number) => H - B - (v / max) * (H - T - B);

  const line = series.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(series.length - 1).toFixed(1)},${H - B} L${x(0).toFixed(1)},${H - B} Z`;

  /* Clamp so a split at either edge can never produce an empty half, a NaN
     average or a negative-index label lookup. */
  const cut = Math.min(Math.max(splitAt, 0), series.length - 2);
  const firstVals = series.slice(0, cut + 1).map((p) => p.v);
  const secondVals = series.slice(cut + 1).map((p) => p.v);
  const avg = (a: number[]) => a.reduce((s, n) => s + n, 0) / a.length;
  const firstAvg = avg(firstVals), secondAvg = avg(secondVals);

  return (
    <svg
      className="pl-svg" viewBox={`0 0 ${W} ${H}`} role="img"
      aria-label={`New website visitors per day from ${series[0].d} to ${series[series.length - 1].d}. Averaged ${firstAvg.toFixed(0)} a day through ${series[cut].d}, and ${secondAvg.toFixed(0)} a day after it.`}
    >
      {/* shaded earlier stretch, only when there is something to shade */}
      {shade ? (
        <>
          <rect x={x(0)} y={T - 12} width={x(shade.through) - x(0)} height={H - B - T + 12} fill="#6F5060" opacity="0.055" />
          <text x={x(0) + 6} y={T - 16} fontSize="10.5" fontWeight="700" fill="#6F5060" letterSpacing="0.08em">{shade.label}</text>
        </>
      ) : null}

      {/* gridlines */}
      {[0, 20, 40, 60].map((g) => (
        <g key={g}>
          <line x1={L} x2={W - R} y1={y(g)} y2={y(g)} stroke="#DED3C9" strokeWidth="1" />
          <text x={L - 7} y={y(g) + 3.5} fontSize="10" fill="#6E6268" textAnchor="end">{g}</text>
        </g>
      ))}

      <path d={area} fill="rgba(111,80,96,0.10)" />
      <path d={line} fill="none" stroke="#6F5060" strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round" />

      {/* per-half averages, drawn directly on the data */}
      <line x1={x(0)} x2={x(cut)} y1={y(firstAvg)} y2={y(firstAvg)} stroke="#4E3846" strokeWidth="1.5" strokeDasharray="5 4" />
      <text x={x(cut) - 4} y={y(firstAvg) - 7} fontSize="11" fontWeight="700" fill="#4E3846" textAnchor="end">{firstAvg.toFixed(0)} a day</text>
      <line x1={x(cut)} x2={x(series.length - 1)} y1={y(secondAvg)} y2={y(secondAvg)} stroke="#4F6169" strokeWidth="1.5" strokeDasharray="5 4" />
      <text x={x(series.length - 1) - 2} y={y(secondAvg) - 7} fontSize="11" fontWeight="700" fill="#4F6169" textAnchor="end">{secondAvg.toFixed(0)} a day</text>

      {/* event markers */}
      {markers.map((m) => (
        <g key={m.label}>
          <line x1={x(m.i)} x2={x(m.i)} y1={T - 6} y2={H - B} stroke="#8FA1A6" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={x(m.i)} cy={y(series[m.i].v)} r="3.4" fill="#FAFAF8" stroke="#6F5060" strokeWidth="1.6" />
          <text x={x(m.i) + 5} y={T - 1} fontSize="10.5" fontWeight="600" fill="#4F6169">{m.label}</text>
        </g>
      ))}

      {/* x labels */}
      {[0, cut, series.length - 1].map((i) => (
        <text key={i} x={x(i)} y={H - 12} fontSize="10.5" fill="#6E6268"
              textAnchor={i === 0 ? "start" : i === series.length - 1 ? "end" : "middle"}>
          {series[i].d}
        </text>
      ))}
    </svg>
  );
}

/** Post gallery. Images live in /public/posts/. If a file is not there yet the
 *  card falls back to a labelled placeholder rather than a broken image, so the
 *  report is publishable before the assets are dropped in. */
/* Instagram serves <permalink>/embed as a standalone page, so a plain iframe
   renders the real post with no API, no access token and no downloaded files.
   Paste a permalink into the data above and the post appears.

   Normalising: strip any tracking parameters Instagram appends when you copy a
   link from the app, drop trailing slashes, and fold /reels/ to /reel/, which
   is the form the embed endpoint expects. */
const embedFor = (url: string) =>
  url.split(/[?#]/)[0].replace(/\/+$/, "").replace("/reels/", "/reel/") + "/embed";

function Gallery({ items }: { items: { title: string; format: string; date: string; url: string; views: string; reach: string; er: string; lead: boolean }[] }) {
  return (
    <div className="gal">
      {items.map((p, i) => (
        <div key={p.url} className={`gal-i${p.lead ? " lead" : ""}`}>
          <div className="gal-shot">
            <div className="gal-crop">
              <iframe
                src={embedFor(p.url)}
                title={p.title}
                loading="lazy"
                scrolling="no"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            {/* Iframes do not render in print or PDF export, so a titled panel
                takes their place rather than leaving a blank rectangle. */}
            <div className="gal-print">
              <span>{p.format}</span>
              <em>{p.title}</em>
            </div>
            <div className="gal-rank">{i + 1}</div>
          </div>
          <div className="gal-b">
            <div className="gal-k">{p.format} · {p.date}</div>
            <h3 className="gal-t">{p.title}</h3>
            <div className="gal-s">
              <div><b>{p.views}</b><span>Views</span></div>
              <div><b>{p.reach}</b><span>Reach</span></div>
              <div><b>{p.er}</b><span>Engagement</span></div>
            </div>
            <a className="gal-link" href={p.url} target="_blank" rel="noopener noreferrer">
              View on Instagram →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Report() {
  const [active, setActive] = useState("brief");

  useEffect(() => {
    const ids = NAV.map((n) => n.id);
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (vis) setActive(vis.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const R = REPORT;
  const d = R.detail;

  return (
    <div className="nyc">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ---------------------------------------------------------- masthead */}
      <header className="masthead">
        <div className="wrap mast-inner">
          <div className="mast-kicker">
            {R.client.agency} · Performance Briefing
            {IS_INTERNAL ? <span className="mast-flag">Internal</span> : null}
          </div>
          <h1 className="mast-title">{R.client.name}</h1>
          <div className="mast-meta">
            <span className="mast-period">{R.period.label}</span>
            <span className="mast-len">{R.period.length} · compared with {R.period.comparedWith}</span>
          </div>
          {/* Internal only. In the client build the Brief's opening item says the same
              thing a few lines further down, so this repeats rather than adds. */}
          {IS_INTERNAL ? <p className="mast-paid">{R.period.paidStatus}</p> : null}
        </div>
      </header>

      {/* --------------------------------------------------------- sticky nav */}
      <div className="railwrap no-print">
        <div className="wide">
          <nav className="rail" aria-label="Report sections">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={active === n.id ? "on" : ""}>{n.label}</a>
            ))}
          </nav>
        </div>
      </div>

      <main className="wrap">

        {/* ------------------------------------------------------- the brief */}
        <Section id="brief" num={numOf("brief")} title={R.brief.title} lede={R.brief.lede}>
          <Reveal>
            <p className="brief-head">{IS_INTERNAL ? R.brief.head : R.brief.headClient}</p>
            {R.brief.items.map((item) => {
              const b = IS_INTERNAL ? item : (item.client ?? item);
              return (
                <div className="brief-item" key={item.role}>
                  <div className="brief-role">{b.role}</div>
                  <p className="brief-text">{b.text}</p>
                </div>
              );
            })}
          </Reveal>
        </Section>

        {/* ------------------------------------------------------ the period */}
        <Section id="period" num={numOf("period")} title={R.periodLine.title}
                 lede={R.periodLine.note}>
          <Reveal>
            <div className="pl">
              <PeriodChart
                series={R.periodLine.series}
                splitAt={R.periodLine.splitAt}
                markers={R.periodLine.markers}
                shade={R.periodLine.shade}
              />
            </div>
            <dl className="pl-bands">
              {R.periodLine.bands.map((b) => (
                <div className="pl-band" key={b.label}>
                  <dt>{b.label}</dt>
                  <dd>{b.value}</dd>
                  <p>{b.detail}</p>
                </div>
              ))}
            </dl>
            <Note>
              <b>{R.periodLine.read.title}</b> {R.periodLine.read.body}
            </Note>

            {IS_INTERNAL && <div style={{ marginTop: 34 }}>
              <p className="chart-t">The reporting windows are not identical, and that matters</p>
              <p className="chart-n">
                Each platform exports on its own calendar. Nothing here has been stretched to fit a
                single date range — the real window for each source is shown instead.
              </p>
              <dl className="srcs">
                {SOURCE_WINDOWS.map((s) => (
                  <div key={s.k}>
                    <dt>{s.k}</dt>
                    <dd>{s.v}</dd>
                    <p>{s.p}</p>
                  </div>
                ))}
              </dl>
            </div>}
          </Reveal>
        </Section>

        {/* ------------------------------------------------------ scoreboard */}
        <Section id="scoreboard" num={numOf("scoreboard")} title={R.copy.scoreboard.title}
                 lede={R.copy.scoreboard.lede}>
          <div className="score">
            {R.scoreboard.map((s) => (
              <Reveal key={s.metric}>
                <div className={`score-row ${s.tone}`}>
                  <div>
                    <div className="score-metric">{s.metric}</div>
                    <div className="score-val">{s.value}</div>
                    <div className="score-sub">{s.sub}</div>
                  </div>
                  <div>
                    <Delta dir={s.dir} text={s.change} />
                    <p className="score-reading">{s.reading}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ----------------------------------------------------- what worked */}
        <Section id="worked" num={numOf("worked")} title={R.copy.worked.title}
                 lede={IS_INTERNAL ? R.worked.lede : undefined}>
          <Reveal>
            {/* The client build has no section lede here, so the gallery needs
                its own breathing room under the heading. */}
            <div style={{ marginTop: IS_INTERNAL ? 0 : 26 }}>
              <Chart title={R.copy.worked.galleryTitle} note={R.worked.galleryNote}>
                <Gallery items={R.worked.gallery} />
              </Chart>
            </div>
          </Reveal>
          <Reveal>
            <div className="work" style={{ marginTop: 34 }}>
              <div className="work-body">
                <div className="work-kicker">Top post · {R.worked.lead.kind} · {R.worked.lead.date}</div>
                <h3 className="work-title">{R.worked.lead.title}</h3>
                <div className="work-q" style={{ marginTop: 20 }}>Why it worked</div>
                <p className="work-a">{R.worked.lead.why}</p>
                <div className="work-q">Can we repeat it?</div>
                <p className="work-a">{R.worked.lead.repeatable}</p>
                <a className="work-link" href={R.worked.lead.url} target="_blank" rel="noopener noreferrer">
                  View the post on Instagram →
                </a>
              </div>
            </div>
            <div className="channel">
              <h3 className="channel-t">{R.worked.channel.title}</h3>
              <p className="channel-b">{R.worked.channel.body}</p>
            </div>
          </Reveal>
        </Section>

        {/* -------------------------------------------------- needs attention */}
{has("attention") && (
        <Section id="attention" num={numOf("attention")} title={R.copy.attention.title}
                 lede={R.copy.attention.lede}>
          {R.attention.map((a) => (
            <Reveal key={a.title}>
              <div className="att">
                <span className={`tag tag-${a.tag}`}>{TAG_LABEL[a.tag]}</span>
                <h3 className="att-t">{a.title}</h3>
                <p className="att-b">{a.body}</p>
                <p className="att-so"><b>What it means: </b>{a.so}</p>
              </div>
            </Reveal>
          ))}
        </Section>
        )}

        {/* ---------------------------------------------------- what we learned */}
        <Section id="learned" num={numOf("learned")} title={R.copy.learned.title}
                 lede={R.copy.learned.lede}>
          <Reveal>
            <div className="learn">
              {R.learned.map((l) => (
                <div className="learn-c" key={l.f + l.u}>
                  <div className="learn-f">{l.f}</div>
                  <div className="learn-u">{l.u}</div>
                  <p className="learn-t">{l.t}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Section>

        {/* ------------------------------------------------------- next moves */}
{has("moves") && (
        <Section id="moves" num={numOf("moves")} title={R.copy.moves.title}
                 lede={R.copy.moves.lede}>
          {R.moves.map((m, i) => (
            <Reveal key={m.action}>
              <div className="move">
                <div className="move-n">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <h3 className="move-a">{m.action}</h3>
                  <p className="move-w">{m.why}</p>
                  <dl className="move-meta">
                    <div><dt>Owner</dt><dd>{m.owner}</dd></div>
                    <div><dt>What we measure next</dt><dd>{m.measure}</dd></div>
                  </dl>
                </div>
              </div>
            </Reveal>
          ))}
        </Section>
        )}

        {/* ----------------------------------------------------------- detail */}
        <Section id="detail" num={numOf("detail")} title={R.copy.detail.title}
                 lede={R.copy.detail.lede}>
          <div style={{ marginTop: 26 }}>

            <Disclosure title="Instagram" subtitle={REPORT.detail.subtitles.instagram}>
              <KV items={d.instagram.kv} />
              <Chart title={d.instagram.publishedChart.title} note={d.instagram.publishedChart.note}>
                <BarList items={d.instagram.published} alt />
              </Chart>
              <Chart title={d.instagram.postsChart.title} note={d.instagram.postsChart.note}>
                <div className="t-wrap">
                  <table className="t">
                    <thead>
                      <tr>
                        <th>Post</th><th>Format</th><th>Date</th>
                        <th className="n">Views</th><th className="n">Reach</th>
                        <th className="n">Interactions</th><th className="n">Engagement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.instagram.posts.map((p) => (
                        <tr key={p.t}>
                          <td>{p.t}</td><td>{p.f}</td><td>{p.d}</td>
                          <td className="n">{p.v}</td><td className="n">{p.r}</td>
                          <td className="n">{p.i}</td><td className="n">{p.e}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Chart>
              <Chart title={d.instagram.interactionsChart.title} note={d.instagram.interactionsChart.note}>
                <BarList items={d.instagram.interactions} />
              </Chart>
              <Chart title={d.instagram.viewsChart.title} note={d.instagram.viewsChart.note}>
                <BarList items={d.instagram.viewsByFormat} alt />
              </Chart>
              <Chart title={d.instagram.storiesTitle}>
                <p className="score-reading">{d.instagram.stories}</p>
              </Chart>
              <Note>{IS_INTERNAL ? d.instagram.note : d.instagram.clientNote}</Note>
            </Disclosure>

            <Disclosure title="Search" subtitle={REPORT.detail.subtitles.search}>
              <KV items={d.search.kv} />
              <Chart title={d.search.pagesChart.title} note={d.search.pagesChart.note}>
                <div className="t-wrap">
                  <table className="t">
                    <thead>
                      <tr><th>Page</th><th className="n">Clicks</th><th className="n">Impressions</th><th className="n">Click rate</th></tr>
                    </thead>
                    <tbody>
                      {d.search.pages.map((p) => (
                        <tr key={p.p}>
                          <td>{p.p}</td><td className="n">{p.c}</td><td className="n">{p.i}</td>
                          <td className="n">{p.r}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Chart>
              <Note>{d.search.note}</Note>
            </Disclosure>

            <Disclosure title="Website" subtitle={REPORT.detail.subtitles.website}>
              <KV items={d.website.kv} />
              <Chart title={d.website.sourcesChart.title} note={d.website.sourcesChart.note}>
                <BarList items={d.website.sources} />
              </Chart>
              <Chart title={d.website.deviceChart.title} note={d.website.deviceChart.note}>
                <Stack parts={d.website.deviceSplit} />
              </Chart>
              <Chart title={d.website.landingChart.title} note={d.website.landingChart.note}>
                <BarList items={d.website.landing} alt />
              </Chart>
              <Note>{d.website.note}</Note>
            </Disclosure>

            <Disclosure title="Links" subtitle={REPORT.detail.subtitles.links}>
              <KV items={d.links.kv} />
              <Chart title={d.links.destsChart.title} note={d.links.destsChart.note}>
                <BarList items={d.links.dests} />
              </Chart>
              <Note>{d.links.note}</Note>
            </Disclosure>

            <Disclosure title="Email" subtitle={d.email.window}>
              <Note>{d.email.note}</Note>
              <div style={{ marginTop: 22 }}>
                <Chart title={d.email.tableChart.title} note={d.email.tableChart.note}>
                  <SimpleTable table={IS_INTERNAL ? d.email.tableInternal : d.email.table} />
                </Chart>
              </div>
            </Disclosure>

            <Disclosure title="How these numbers were produced" subtitle="Sources, definitions and limitations">
              {d.method
                .filter((m) => (IS_INTERNAL ? !m.clientOnly : !m.internalOnly))
                .map((m) => (
                <div key={m.q}>
                  <h4 className="method-q">{m.q}</h4>
                  <p className="method-a">{m.a}</p>
                </div>
              ))}
            </Disclosure>

          </div>
        </Section>

        <footer className="foot">
          <span>{R.client.name} · {R.period.label}</span>
          <span>Prepared by {R.client.agency}</span>
        </footer>
      </main>
    </div>
  );
}
