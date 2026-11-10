import type { Metadata } from "next";
import { RV, IS_INTERNAL, NAV, has, WINDOWS, DEFAULT_WIN, short, type WinId, type Row, type Chart, type Card, type Chapter, type Query } from "./review-data";
import { MONO } from "./brand";

/* ==========================================================================
   3, 6 AND 12-MONTH REVIEW  ·  NYC Dental Smiles  ·  /review
   --------------------------------------------------------------------------
   Structure and styling only; every figure, date and sentence lives in
   review-data.ts in this folder.

   THE STORY (Walter, Nov 10: "bring this report to life"). The page reads
   in the order people meet the practice, and the hero's path row is the map:
     01 Seen on Instagram     (and What worked, the pieces that went furthest)
     02 Found on Google
     03 Visited the website   (January to September 2026 in every view)
     04 Clicked to book
     05 Kept in touch by email
   then every measure with its notes, and how the review is built. Each
   chapter: a takeaway and a short paragraph for the selected period, a few
   figures, and its monthly charts.

   SERVER-RENDERED, NO SCRIPT. No "use client", no hooks. The 3 / 6 / 12-month
   switch is 3 radio inputs and CSS :has(), so review-data.ts never reaches
   the browser and there is nothing to hydrate. The charts are HTML and CSS
   (not SVG), so their text stays full size on a phone; hovering a month shows
   its exact figure, and every chart has a table view.

   COLOR. Brand plum #6F5060 is the selected period; the period it is
   compared with and every other month are lighter steps of the same plum,
   #9B7D8B and #C6AEB8 (checked with the dataviz palette validator as an
   ordinal ramp on white: monotone, visible steps, light end 2.07:1). Charts
   always sit on white panels, which is the surface the ramp was checked on.
   Text never takes a series color. Brand: NYC Dental Smiles Brand Guidelines
   (05/2025); Marcellus for titles and headlines, Area Normal (Figtree until
   the Adobe Fonts project is set) for text and every figure.
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
  --ink: #1F1E21;
  --body: #3A3A3E;
  --muted: #5F6267;
  --paper: #FFFFFF;
  --wash: #F7F2F1;
  --rule: #CFD0D1;
  --rule-soft: #E7E7E8;
  --sel: #6F5060;
  --cmp: #9B7D8B;
  --ctx: #C6AEB8;
  --display: 'Marcellus', 'Iowan Old Style', Georgia, serif;
  --text: 'area-normal', 'Figtree', 'Helvetica Neue', Arial, sans-serif;
  --max: 1200px;
  --gut: clamp(20px, 5vw, 64px);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
body { font-family: var(--text); font-size: 17px; line-height: 1.6; color: var(--body); background: var(--paper); -webkit-font-smoothing: antialiased; }
h1, h2, h3, h4 { font-family: var(--text); font-weight: 800; color: var(--ink); line-height: 1.2; text-wrap: balance; }
a { color: inherit; }
:focus-visible { outline: 2px solid var(--plum); outline-offset: 3px; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.wrap { max-width: var(--max); margin: 0 auto; padding-left: var(--gut); padding-right: var(--gut); }
.wv { display: none; }

/* ---------- top bar: brand, sections, period switch ---------- */
.top { position: sticky; top: 0; z-index: 40; background: var(--plum); color: #fff; border-bottom: 1px solid rgba(255,255,255,.16); }
.top .wrap { max-width: 1440px; padding-left: clamp(16px, 3vw, 40px); padding-right: clamp(16px, 3vw, 40px); }
.top-in { display: flex; align-items: center; gap: 20px; min-height: 68px; }
.brand { display: grid; grid-template-columns: auto auto; grid-template-rows: auto auto; column-gap: 12px; align-items: center; flex: none; color: #fff; }
.brand-a { display: contents; color: #fff; text-decoration: none; }
.brand-a img { grid-row: 1 / 3; width: 40px; height: 40px; display: block; }
.brand-a b { font-size: 11px; font-weight: 400; letter-spacing: .16em; text-transform: uppercase; white-space: nowrap; align-self: end; }
.brand-s { display: flex; gap: 12px; align-items: baseline; font-size: 13px; color: rgba(255,255,255,.9); white-space: nowrap; align-self: start; margin-top: 2px; }
.brand-s a { color: #fff; text-decoration: underline; text-decoration-color: rgba(255,255,255,.5); text-underline-offset: 3px; }
.brand-s a:hover { text-decoration-color: #fff; }
.badge { font-style: normal; padding: 0 8px; border: 1px solid rgba(255,255,255,.6); border-radius: 20px; font-size: 11px; }
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
@media (max-width: 1220px) {
  .top-in { flex-wrap: wrap; gap: 0 16px; padding-top: 10px; }
  .brand { order: 1; }
  .seg { order: 2; margin-left: auto; }
  .links { order: 3; flex-basis: 100%; margin: 6px 0 4px; padding-bottom: 4px; }
  .links a:first-child { padding-left: 0; }
  .links { mask-image: linear-gradient(90deg, #000 88%, transparent); -webkit-mask-image: linear-gradient(90deg, #000 88%, transparent); }
}
@media (max-width: 560px) {
  .brand-a b, .brand-s { display: none; }
  .seg span { padding: 7px 11px; font-size: 13px; }
}

/* ---------- hero: the period's headline, then the path ---------- */
.hero { position: relative; overflow: hidden; background: var(--plum); color: #fff; padding: 56px 0 60px; }
.hero-wm { position: absolute; right: -6%; top: -8%; width: min(46vw, 620px); opacity: .06; pointer-events: none; }
.hero .wrap { position: relative; }
.hero-k { font-size: 16px; font-weight: 600; color: rgba(255,255,255,.88); margin-bottom: 18px; }
.hero-h { font-family: var(--display); font-weight: 400; font-size: clamp(30px, 3.7vw, 50px); line-height: 1.18; color: #fff; max-width: 24ch; }
.hero-d { font-size: 18px; line-height: 1.6; color: rgba(255,255,255,.9); max-width: 60ch; margin-top: 20px; }
.hero-m { font-size: 14px; color: rgba(255,255,255,.8); margin-top: 14px; }
.hero-note { font-size: 14px; line-height: 1.6; color: rgba(255,255,255,.92); margin-top: 18px; padding: 12px 14px; border-left: 2px solid rgba(255,255,255,.5); background: rgba(0,0,0,.14); max-width: 76ch; }

/* The path: 5 stops on one line, in the order people meet the practice. */
.path { list-style: none; position: relative; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); margin-top: 56px; }
.path::before { content: ""; position: absolute; left: 7px; right: 0; top: 7px; border-top: 1px solid rgba(255,255,255,.42); }
.path li { position: relative; padding: 32px 24px 0 0; }
.path li::before { content: ""; position: absolute; left: 0; top: 0; width: 15px; height: 15px; border-radius: 50%; background: var(--plum); border: 2px solid #fff; }
.path a { display: block; color: #fff; text-decoration: none; border-radius: 6px; }
.path a:hover .p-l { text-decoration: underline; text-decoration-color: rgba(255,255,255,.6); text-underline-offset: 3px; }
.path a:focus-visible { outline: 2px solid #fff; outline-offset: 6px; }
.p-step { display: block; font-family: var(--display); font-size: 20px; line-height: 1.2; color: #fff; }
.p-v { display: block; font-size: clamp(32px, 3.4vw, 48px); font-weight: 800; line-height: 1.04; letter-spacing: -.015em; margin-top: 10px; font-variant-numeric: proportional-nums lining-nums; }
.p-l { display: block; font-size: 15px; font-weight: 600; margin-top: 6px; }
.p-s { display: block; font-size: 13.5px; line-height: 1.45; color: rgba(255,255,255,.82); margin-top: 4px; max-width: 24ch; }
@media (max-width: 900px) {
  .hero { padding: 36px 0 40px; }
  .path { grid-template-columns: 1fr; gap: 22px; margin-top: 36px; }
  .path::before { left: 7px; top: 8px; bottom: 8px; right: auto; border-top: none; border-left: 1px solid rgba(255,255,255,.42); }
  .path li { padding: 0 0 0 34px; }
  .path li::before { top: 4px; }
  .p-v { margin-top: 4px; font-size: 32px; }
}
.how { border-bottom: 1px solid var(--rule-soft); }
.how p { padding-top: 16px; padding-bottom: 16px; font-size: 15px; color: var(--muted); }

/* ---------- chapters ---------- */
.ch { padding: 88px 0; scroll-margin-top: 84px; }
.ch-wash { background: var(--wash); }
.ch-grid { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 64px; align-items: start; }
.ch-text { position: sticky; top: 104px; }
.ch-k { display: flex; align-items: baseline; gap: 14px; font-family: var(--display); font-weight: 400; font-size: 22px; color: var(--plum); margin-bottom: 18px; }
.ch-n { font-size: 15px; font-family: var(--text); font-weight: 600; color: var(--plum); border: 1px solid var(--cmp); border-radius: 30px; padding: 1px 10px; position: relative; top: -2px; }
.ch-t { font-family: var(--display); font-weight: 400; font-size: clamp(26px, 2.5vw, 34px); line-height: 1.24; color: var(--ink); max-width: 22ch; }
.ch-b { font-size: 17px; line-height: 1.7; margin-top: 16px; max-width: 54ch; }
.ch-after { margin-top: 26px; }
.ch-after p { font-size: 15px; line-height: 1.7; color: var(--body); padding: 12px 0; border-top: 1px solid var(--rule); max-width: 62ch; }
.ch-int { margin-top: 26px; padding: 18px 20px; border-left: 3px solid var(--plum); background: rgba(111,80,96,.06); max-width: 80ch; }
.ch-int h4 { font-family: var(--display); font-weight: 400; font-size: 18px; color: var(--plum); margin-bottom: 6px; }
.ch-int p { font-size: 14.5px; line-height: 1.65; padding: 5px 0; }
.ch-figs { display: grid; gap: 22px; }
@media (max-width: 980px) {
  .ch { padding: 60px 0; scroll-margin-top: 124px; }
  .ch-grid { grid-template-columns: 1fr; gap: 36px; }
  .ch-text { position: static; }
}

/* figures beside the takeaway: plain rows, no boxes */
.st { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 28px; margin-top: 30px; max-width: 520px; }
.st-i { padding: 14px 0 16px; border-top: 1px solid var(--rule); }
.st dt { font-size: 14px; color: var(--muted); }
.st-v { font-size: 30px; font-weight: 800; line-height: 1.12; color: var(--ink); font-variant-numeric: proportional-nums lining-nums; letter-spacing: -.01em; }
.st-c { font-size: 14px; color: var(--body); margin-top: 2px; line-height: 1.4; }
.chg { font-weight: 800; color: var(--ink); white-space: nowrap; font-variant-numeric: tabular-nums; }
.chg i { font-style: normal; font-size: 11px; margin-right: 4px; color: var(--muted); }

/* legend for the monthly charts */
.key { display: flex; gap: 6px 22px; flex-wrap: wrap; font-size: 14px; color: var(--body); }
.key span { display: inline-flex; align-items: center; gap: 8px; }
.key i { width: 12px; height: 12px; border-radius: 3px; display: inline-block; }

/* ---------- monthly chart: HTML columns, brackets for each period ---------- */
.vc { background: var(--paper); border: 1px solid var(--rule-soft); border-radius: 10px; padding: 22px 22px 16px; }
.vc-t { display: block; font-size: 17px; font-weight: 800; color: var(--ink); margin-bottom: 8px; }
.vc-in { margin-left: 44px; }
.vc-row { display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); }
.vc-br { min-height: 40px; align-items: end; }
.vc-b { display: none; flex-direction: column; align-items: center; justify-content: end; margin: 0 2px; padding-bottom: 5px; border-bottom: 2px solid var(--sel); text-align: center; line-height: 1.2; min-width: 0; }
.vc-b.past { border-bottom-color: var(--cmp); }
.vc-b small { font-size: 12px; color: var(--muted); white-space: nowrap; }
.vc-b b { font-size: 15px; font-weight: 800; color: var(--ink); font-variant-numeric: tabular-nums; white-space: nowrap; }
.vc-p { position: relative; height: 172px; margin-top: 10px; }
.vc-g { position: absolute; left: 0; right: 0; border-top: 1px solid var(--rule-soft); }
.vc-g.base { border-top-color: var(--rule); }
.vc-g i { position: absolute; right: calc(100% + 8px); top: 0; transform: translateY(-50%); font-style: normal; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; white-space: nowrap; }
.vc-band { position: absolute; top: 0; bottom: 0; background: #F4EEF1; border-radius: 4px; }
.vc-band span { position: absolute; left: 6px; top: 4px; font-size: 12px; color: var(--muted); white-space: nowrap; }
.vc-band.r span { left: auto; right: 6px; }
.vc-cols { position: absolute; inset: 0; grid-template-rows: 100%; }
.vc-c { position: relative; height: 100%; display: flex; align-items: flex-end; justify-content: center; }
.vc-c > b { display: block; width: min(24px, 66%); height: var(--h); background: var(--ctx); border-radius: 4px 4px 0 0; transition: background-color .2s ease; }
.vc-c.z > b { height: 0; }
.vc-c:hover { z-index: 3; }
.vc-c:hover > b { box-shadow: 0 0 0 2px var(--paper), 0 0 0 3px var(--ink); }
.vc-tip { position: absolute; bottom: calc(var(--h) + 10px); left: 50%; transform: translateX(-50%); opacity: 0; pointer-events: none; background: var(--ink); color: #fff; border-radius: 6px; padding: 6px 10px; font-size: 13px; line-height: 1.3; white-space: nowrap; transition: opacity .12s ease; }
.vc-tip strong { font-size: 15px; font-variant-numeric: tabular-nums; }
.vc-tip em { display: block; font-style: normal; opacity: .82; font-size: 12px; }
.vc-c.l .vc-tip { left: 0; transform: none; }
.vc-c.r .vc-tip { left: auto; right: 0; transform: none; }
.vc-c:hover .vc-tip { opacity: 1; }
.vc-p:has(.vc-c:hover) .vc-a { opacity: .12; }
.vc-a { position: absolute; bottom: calc(var(--h) + 8px); transform: translateX(-50%); pointer-events: none; font-size: 12.5px; line-height: 1.25; color: var(--ink); font-weight: 600; text-align: center; white-space: nowrap; padding-bottom: 8px; }
.vc-a::after { content: ""; position: absolute; left: 50%; bottom: 0; height: 6px; border-left: 1px solid var(--ink); }
.vc-a.r { transform: translateX(calc(-100% + 12px)); text-align: right; }
.vc-a.r::after { left: auto; right: 12px; }
.vc-a.l { transform: translateX(-12px); text-align: left; }
.vc-a.l::after { left: 12px; }
.vc-x { margin-top: 8px; }
.vc-x span { text-align: center; font-size: 12px; color: var(--muted); line-height: 1.25; white-space: nowrap; }
.vc-x small { display: block; font-size: 11px; color: var(--muted); }
.vc-note { font-size: 14px; color: var(--muted); margin-top: 14px; line-height: 1.55; }
@media (max-width: 560px) {
  .vc { padding: 18px 14px 14px; }
  .vc-in { margin-left: 34px; }
  .vc-x span.mn { visibility: hidden; }
  .vc-b small { font-size: 11px; }
  .vc-b b { font-size: 13px; }
  .vc-a { font-size: 11.5px; }
}
@media (prefers-reduced-motion: reduce) { .vc-c > b, .vc-tip { transition: none; } }

/* table views */
.tv { margin-top: 12px; font-size: 14px; }
.tv summary { cursor: pointer; color: var(--plum); }
.tv-w { overflow-x: auto; }
.tv table { margin-top: 10px; border-collapse: collapse; font-variant-numeric: tabular-nums; }
.tv td, .tv th { padding: 5px 16px 5px 0; border-bottom: 1px solid var(--rule-soft); text-align: right; font-weight: 400; white-space: nowrap; }
.tv td:first-child, .tv th:first-child { text-align: left; }
.tv th { color: var(--muted); }

/* ---------- where website visits came from: ranked bars ---------- */
.rb { background: var(--paper); border: 1px solid var(--rule-soft); border-radius: 10px; padding: 24px 24px 16px; }
.rb-h { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; flex-wrap: wrap; margin-bottom: 18px; }
.rb-h b { font-size: 17px; font-weight: 800; color: var(--ink); }
.rb-h span { font-size: 14px; color: var(--muted); }
.rb-r { display: grid; grid-template-columns: 132px minmax(0, 1fr) 104px; gap: 14px; align-items: center; padding: 6px 0; }
.rb-k { font-size: 15px; color: var(--ink); }
.rb-t { height: 18px; }
.rb-t i { display: block; height: 100%; min-width: 3px; background: var(--sel); border-radius: 0 4px 4px 0; }
.rb-r.o .rb-t i { background: #C9CACC; }
.rb-v { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
.rb-v b { font-size: 16px; font-weight: 800; color: var(--ink); }
.rb-v small { font-size: 13px; color: var(--muted); margin-left: 6px; display: inline-block; min-width: 3.2em; text-align: right; }
.rb-n { font-size: 14px; color: var(--muted); margin-top: 14px; line-height: 1.55; }
.rb-q .rb-r { grid-template-columns: minmax(150px, 220px) minmax(0, 1fr) 96px; }
.rb-q .rb-k { overflow-wrap: anywhere; }
.rb-q .rb-v small { min-width: 0; }
@media (max-width: 560px) { .rb { padding: 18px 14px 14px; } .rb-q .rb-r { grid-template-columns: 1fr auto; } .rb-r { grid-template-columns: 1fr auto; gap: 4px 12px; } .rb-t { grid-column: 1 / -1; grid-row: 2; height: 14px; } }

/* ---------- what worked ---------- */
.sec { padding: 80px 0; scroll-margin-top: 84px; }
.sec-wash { background: var(--wash); }
.sec-head { max-width: 62ch; margin-bottom: 36px; }
.sec-k { font-family: var(--display); font-weight: 400; font-size: 18px; color: var(--plum); margin-bottom: 8px; }
.sec-t { font-family: var(--display); font-weight: 400; font-size: clamp(28px, 3vw, 40px); color: var(--ink); margin-bottom: 12px; }
.sec-lede { font-size: 18px; line-height: 1.6; color: var(--body); }
@media (max-width: 980px) { .sec { padding: 60px 0; scroll-margin-top: 124px; } }
.wk { display: grid; grid-template-columns: minmax(280px, 400px) 1fr; gap: 48px; align-items: start; }
@media (max-width: 900px) { .wk { grid-template-columns: 1fr; } }
.ig { position: relative; width: 100%; aspect-ratio: 4/5; overflow: hidden; background: #241D21; border-radius: 6px; }
.ig iframe { position: absolute; top: -56px; left: -1px; width: calc(100% + 2px); height: calc(100% + 130px); border: 0; }
.wk-meta { font-size: 15px; color: var(--muted); margin-bottom: 10px; }
.wk-t { font-family: var(--display); font-weight: 400; font-size: clamp(24px, 2.4vw, 30px); line-height: 1.3; color: var(--ink); margin-bottom: 24px; max-width: 30ch; }
.stats { display: grid; grid-template-columns: repeat(3, auto); justify-content: start; gap: 8px 44px; padding: 18px 0; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); margin-bottom: 22px; }
.stats b { display: block; font-size: 32px; font-weight: 800; color: var(--ink); line-height: 1.1; font-variant-numeric: proportional-nums lining-nums; }
.stats span { font-size: 14px; color: var(--muted); }
.why { font-size: 16px; line-height: 1.7; max-width: 58ch; }
.gal { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 32px; margin-top: 56px; }
.gal-d { font-size: 14px; color: var(--muted); margin-top: 12px; }
.gal-t { font-size: 17px; font-weight: 800; line-height: 1.4; color: var(--ink); margin: 4px 0 8px; }
.gal-s { font-size: 14px; color: var(--body); font-variant-numeric: tabular-nums; }
.gal-note { margin-top: 32px; font-size: 15px; color: var(--muted); max-width: 66ch; }

/* ---------- every measure ---------- */
.lg { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
.lg-cols th { font-weight: 400; font-size: 14px; color: var(--muted); text-align: right; padding: 0 0 10px 16px; vertical-align: bottom; line-height: 1.3; }
.lg-cols th:first-child { text-align: left; padding-left: 0; }
.lg-cols th small { display: block; font-size: 13px; }
.lg-g th { text-align: left; font-family: var(--display); font-weight: 400; font-size: 22px; color: var(--plum); padding: 32px 0 10px; border-bottom: 2px solid var(--plum); }
.lg-r td { padding: 16px 0 16px 16px; border-bottom: 1px solid var(--rule-soft); vertical-align: middle; text-align: right; }
.lg-r td:first-child { text-align: left; padding-left: 0; width: 46%; }
.lg-k { font-size: 17px; color: var(--ink); font-weight: 800; }
.lg-n { font-size: 14px; color: var(--muted); margin-top: 3px; max-width: 60ch; line-height: 1.5; }
.lg-ni { font-size: 14px; color: var(--plum); margin-top: 6px; max-width: 60ch; line-height: 1.5; }
.lg-ni b { font-weight: 800; }
.lg-v { font-size: 24px; color: var(--ink); font-weight: 800; }
.lg-p { font-size: 17px; color: var(--muted); }
.lg-c { font-size: 15px; white-space: nowrap; }
.lg-na { font-size: 14px; color: var(--muted); text-align: right; }
@media (max-width: 760px) {
  .lg-cols { display: none; }
  .lg-r { display: grid; grid-template-columns: 1fr auto auto; gap: 4px 16px; padding: 14px 0; border-bottom: 1px solid var(--rule-soft); }
  .lg-r td { border: none; padding: 0; }
  .lg-r td:first-child { grid-column: 1 / -1; width: auto; }
  .lg-r td.lg-pv { display: none; }
  .lg-r td.lg-na { grid-column: 2 / -1; text-align: right; }
  .lg-g th { display: block; }
}

/* ---------- search table, notes ---------- */
.stb-w { overflow-x: auto; margin-top: 8px; }
.stb { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
.stb th { font-weight: 400; font-size: 13px; color: var(--muted); text-align: right; padding: 0 0 8px 12px; border-bottom: 1px solid var(--rule); white-space: nowrap; }
.stb td { padding: 7px 0 7px 12px; border-bottom: 1px solid var(--rule-soft); text-align: right; font-size: 14px; color: var(--ink); white-space: nowrap; }
.stb th:first-child, .stb td:first-child { text-align: left; padding-left: 0; }
.att { max-width: 80ch; }
.att-i { padding: 24px 0; border-bottom: 1px solid var(--rule); }
.att-t { font-size: 20px; margin-bottom: 8px; }
.att-b { font-size: 15.5px; line-height: 1.7; }
.att .vc { margin-top: 28px; max-width: 720px; }

/* ---------- about ---------- */
.dt { border-top: 1px solid var(--rule); max-width: 960px; }
.dt details { border-bottom: 1px solid var(--rule); }
.dt summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: baseline; gap: 16px; padding: 20px 0; font-family: var(--display); font-size: 22px; color: var(--plum); }
.dt summary::-webkit-details-marker { display: none; }
.dt summary::after { content: "+"; font-family: var(--text); font-size: 24px; color: var(--steel); line-height: 1; }
.dt details[open] summary::after { content: "\\2013"; }
.dt-p { padding: 4px 0 34px; }
.kvt { border-collapse: collapse; max-width: 820px; }
.kvt td { padding: 10px 24px 10px 0; border-bottom: 1px solid var(--rule-soft); vertical-align: top; font-size: 15px; line-height: 1.6; }
.kvt td:first-child { color: var(--ink); font-weight: 600; white-space: nowrap; }
.dt-note { font-size: 15px; line-height: 1.7; color: var(--muted); max-width: 70ch; margin-top: 18px; }
.faq { padding: 14px 0; border-bottom: 1px solid var(--rule-soft); max-width: 70ch; }
.faq h3 { font-size: 16px; color: var(--ink); margin-bottom: 4px; }
.faq p { font-size: 15px; line-height: 1.65; color: var(--muted); }
@media (max-width: 640px) { .kvt td:first-child { white-space: normal; } }

.foot { background: var(--plum); color: rgba(255,255,255,.88); padding: 36px 0; font-size: 14px; }
.foot-in { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
.foot img { width: 44px; height: 44px; display: block; opacity: .9; }

@media print {
  .top { position: static; } .links, .seg, .ig, .tv, .vc-tip { display: none; }
  .hero, .foot { background: #fff; color: var(--ink); }
  .hero-h, .p-step, .p-v, .p-l { color: var(--plum); }
  .hero-k, .hero-d, .hero-m, .p-s, .foot { color: var(--muted); }
  .path::before, .path li::before { border-color: var(--plum); }
  .hero-wm { display: none; }
  .ch-text { position: static; }
  .vc-c > b, .rb-t i, .key i { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .ch, .sec { padding: 32px 0; }
  .vc, .rb { break-inside: avoid; }
  .dt details > *:not(summary) { display: block; }
  .foot img { filter: brightness(0) saturate(100%) invert(33%) sepia(12%) saturate(900%) hue-rotate(275deg); }
}
`;

const WIN_IDS = WINDOWS.map((w) => w.id);
const num = (id: WinId) => id.replace("m", "");

/* The switch rules, built from the window list so the default lives in one
   place (review-data.ts). Resets come before highlights: a month can belong
   to several windows, and the later rule of equal weight wins. */
function switchCss() {
  const on = (w: WinId) => `.rv:has(#win-${w}:checked)`;
  const others = WIN_IDS.filter((w) => w !== DEFAULT_WIN);
  const d = num(DEFAULT_WIN);
  const L: string[] = [];
  L.push(`.wv-${DEFAULT_WIN} { display: block; }`, `.vc-b.b${d} { display: flex; }`);
  L.push(`.vc-c.i${d} > b { background: var(--sel); }`, `.vc-c.p${d} > b { background: var(--cmp); }`);
  L.push(`.rv .hide-${DEFAULT_WIN} { display: none; }`);
  for (const w of others) {
    L.push(`${on(w)} .wv-${DEFAULT_WIN} { display: none; }`, `${on(w)} .wv-${w} { display: block; }`);
    L.push(`${on(w)} .vc-b.b${d} { display: none; }`);
    L.push(`${on(w)} .vc-c.i${d} > b, ${on(w)} .vc-c.p${d} > b { background: var(--ctx); }`);
    L.push(`${on(w)} .hide-${DEFAULT_WIN} { display: inline-flex; }`);
  }
  for (const w of others) {
    const n = num(w);
    L.push(`${on(w)} .vc-b.b${n} { display: flex; }`);
    L.push(`${on(w)} .vc-c.i${n} > b { background: var(--sel); }`, `${on(w)} .vc-c.p${n} > b { background: var(--cmp); }`);
    L.push(`${on(w)} .hide-${w} { display: none; }`);
  }
  return L.join("\n");
}

/* --------------------------------------------------------------- helpers */

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthLong = (m: string) => `${MONTH_NAMES[Number(m.slice(5, 7)) - 1]} ${m.slice(0, 4)}`;
const mon = (m: string) => MONTH_NAMES[Number(m.slice(5, 7)) - 1].slice(0, 3);
// Exact counts for tooltips and tables; short() for the bracket totals.
const fmtInt = (v: number) => v.toLocaleString("en-US");
const fmtTick = (v: number) => (v >= 10000 ? `${v / 1000}k` : v.toLocaleString("en-US"));
const fmtTotal = (v: number) => (v >= 10000 ? short(v) : fmtInt(v));

function niceMax(n: number) {
  const steps = [5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000, 20000, 25000, 50000];
  for (const s of steps) { const m = Math.ceil(n / s) * s; if (m / s <= 4) return { max: m, step: s }; }
  return { max: Math.ceil(n / 100000) * 100000, step: 100000 };
}

/* One block per window; the switch shows the selected one. */
function PerWin({ render }: { render: (w: (typeof WINDOWS)[number]) => React.ReactNode }) {
  return (
    <>
      {WINDOWS.map((w) => (
        <div key={w.id} className={`wv wv-${w.id}`}>{render(w)}</div>
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

function Change({ c }: { c: string }) {
  const arrow = c.startsWith("+") ? "▲" : c.startsWith("−") ? "▼" : "";
  return <span className={`chg${c.startsWith("+") ? " up" : ""}`}>{arrow ? <i aria-hidden="true">{arrow}</i> : null}{c}</span>;
}

function Figures({ cards }: { cards: Card[] }) {
  return (
    <dl className="st">
      {cards.map((c) => (
        <div className="st-i" key={c.k}>
          <dt>{c.k}</dt>
          <dd className="st-v">{c.v}</dd>
          <dd className="st-c">{c.na ? c.na : <><Change c={c.c ?? ""} /> against {c.prior}</>}</dd>
        </div>
      ))}
    </dl>
  );
}

/* Legend for a chapter's charts. "Period compared" hides in any window none
   of the chapter's charts compares (12 months, this edition), and "Other
   months" where no chart has one. */
function Key({ charts }: { charts: Chart[] }) {
  const hide = WIN_IDS.filter((w) => !charts.some((c) => c.priorIn.includes(w))).map((w) => `hide-${w}`).join(" ");
  // "Other months" hides where every month of every chart is in the window (Search and Email at 12 months).
  const rest = WINDOWS.filter((w) => charts.every((c) => c.points.every((p) => w.months.includes(p.m) || (c.priorIn.includes(w.id) && w.priorMonths.includes(p.m))))).map((w) => `hide-${w.id}`).join(" ");
  return (
    <div className="key" aria-hidden="true">
      <span><i style={{ background: "var(--sel)" }} />Selected period</span>
      <span className={hide}><i style={{ background: "var(--cmp)" }} />Period compared</span>
      <span className={rest}><i style={{ background: "var(--ctx)" }} />Other months</span>
    </div>
  );
}

/* Monthly columns. Each column carries a class per window it belongs to (i3,
   i6, i12) and per window it is the comparison for (p3, p6, p12, only where
   that window is compared); the switch CSS colors them. Above the columns, a
   bracket per period names it and gives its total, summed here from the same
   points, so the brackets always add up to the bars. */
function MonthChart({ c }: { c: Chart }) {
  const n = c.points.length;
  const top = Math.max(1, ...c.points.map((p) => p.v)) * (c.ann || c.band ? 1.18 : 1);
  const { max, step } = niceMax(top);
  const h = (v: number) => `${((v / max) * 100).toFixed(2)}%`;
  const ticks: number[] = [];
  for (let t = 0; t <= max; t += step) ticks.push(t);
  const at = (m: string) => c.points.findIndex((p) => p.m === m);
  const span = (ms: string[]) => {
    const a = at(ms[0]), b = at(ms[ms.length - 1]);
    return a >= 0 && b - a + 1 === ms.length ? { a, b, total: c.points.slice(a, b + 1).reduce((s, p) => s + p.v, 0) } : null;
  };
  const brackets = WINDOWS.flatMap((w) => {
    const out: { key: string; win: WinId; past: boolean; a: number; b: number; total: number }[] = [];
    const now = span(w.months);
    if (now) out.push({ key: `${w.id}-now`, win: w.id, past: false, ...now });
    const past = c.priorIn.includes(w.id) ? span(w.priorMonths) : null;
    if (past) out.push({ key: `${w.id}-past`, win: w.id, past: true, ...past });
    return out;
  });
  const cls = (m: string) =>
    WINDOWS.flatMap((w) => [
      w.months.includes(m) ? `i${num(w.id)}` : "",
      c.priorIn.includes(w.id) && w.priorMonths.includes(m) ? `p${num(w.id)}` : "",
    ]).filter(Boolean).join(" ");
  const first = c.points[0].m, last = c.points[n - 1].m;
  const edge = (i: number) => (i < 2 ? " l" : i > n - 3 ? " r" : "");
  const band = c.band ? { a: at(c.band.from), b: at(c.band.to) } : null;
  return (
    <figure className="vc">
      <figcaption className="vc-t">{c.title}</figcaption>
      <div className="vc-in">
        <div className="vc-row vc-br" style={{ "--n": n } as React.CSSProperties}>
          {brackets.map((x) => (
            <div key={x.key} className={`vc-b b${num(x.win)}${x.past ? " past" : ""}`} style={{ gridColumn: `${x.a + 1} / ${x.b + 2}`, gridRow: 1 }}>
              <small>{mon(c.points[x.a].m)} – {mon(c.points[x.b].m)}</small>
              <b>{fmtTotal(x.total)}</b>
            </div>
          ))}
        </div>
        <div className="vc-p" role="img" aria-label={`${c.title} by month, ${monthLong(first)} to ${monthLong(last)}. The figures are in the table below.`}>
          {ticks.map((t) => (
            <div key={t} className={`vc-g${t === 0 ? " base" : ""}`} style={{ bottom: h(t) }}><i>{fmtTick(t)}</i></div>
          ))}
          {band && band.a >= 0 && band.b >= 0 ? (
            <div className={`vc-band${(band.a + band.b) / 2 > n / 2 ? " r" : ""}`} style={{ left: `${(band.a / n) * 100}%`, width: `${((band.b - band.a + 1) / n) * 100}%` }}><span>{c.band!.text}</span></div>
          ) : null}
          <div className="vc-row vc-cols" style={{ "--n": n } as React.CSSProperties}>
            {c.points.map((p, i) => (
              <div key={p.m} className={`vc-c ${cls(p.m)}${p.v === 0 ? " z" : ""}${edge(i)}`} style={{ "--h": h(p.v) } as React.CSSProperties}>
                <b />
                <span className="vc-tip"><strong>{fmtInt(p.v)}</strong> {c.unit}<em>{monthLong(p.m)}</em></span>
              </div>
            ))}
          </div>
          {(c.ann ?? []).map((a) => {
            const i = at(a.m);
            if (i < 0) return null;
            return (
              <div key={a.m} className={`vc-a${edge(i)}`} style={{ left: `${((i + 0.5) / n) * 100}%`, "--h": h(c.points[i].v) } as React.CSSProperties}>{a.text}</div>
            );
          })}
        </div>
        <div className="vc-row vc-x" style={{ "--n": n } as React.CSSProperties} aria-hidden="true">
          {c.points.map((p, i) => {
            const key = i === 0 || i === n - 1 || p.m.endsWith("-01");
            return <span key={p.m} className={key ? "" : "mn"}>{mon(p.m)}{i === 0 || p.m.endsWith("-01") ? <small>{p.m.slice(0, 4)}</small> : null}</span>;
          })}
        </div>
      </div>
      <p className="vc-note">{c.note}</p>
      <details className="tv">
        <summary>Show the monthly figures as a table</summary>
        <div className="tv-w">
          <table>
            <thead><tr><th scope="col">Month</th><th scope="col">{c.title}</th></tr></thead>
            <tbody>{c.points.map((p) => <tr key={p.m}><td>{monthLong(p.m)}</td><td>{fmtInt(p.v)}</td></tr>)}</tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

/* Top searches for the selected period: ranked bars, clicks only. */
function TopSearches({ q }: { q: Record<WinId, { rows: Query[]; note: string }> }) {
  return (
    <PerWin render={(w) => {
      const t = q[w.id];
      const top = Math.max(...t.rows.map((r) => r.clicks));
      return (
        <figure className="rb rb-q">
          <figcaption className="rb-h"><b>Top searches</b><span>{w.period}</span></figcaption>
          {t.rows.map((r) => (
            <div className="rb-r" key={r.q}>
              <span className="rb-k">{r.q}</span>
              <span className="rb-t" aria-hidden="true"><i style={{ width: `${((r.clicks / top) * 100).toFixed(2)}%` }} /></span>
              <span className="rb-v"><b>{fmtInt(r.clicks)}</b><small>clicks</small></span>
            </div>
          ))}
          <p className="rb-n">{t.note}</p>
          <details className="tv">
            <summary>Show these searches as a table</summary>
            <div className="tv-w">
              <table>
                <thead><tr><th scope="col">Search</th><th scope="col">Clicks</th><th scope="col">Appearances</th></tr></thead>
                <tbody>{t.rows.map((r) => <tr key={r.q}><td>{r.q}</td><td>{fmtInt(r.clicks)}</td><td>{fmtInt(r.appearances)}</td></tr>)}</tbody>
              </table>
            </div>
          </details>
        </figure>
      );
    }} />
  );
}

function ChapterHead({ ch, title }: { ch: { id: string; n: string }; title: string }) {
  return <h2 className="ch-k" id={`${ch.id}-t`}><span className="ch-n">{ch.n}</span>{title}</h2>;
}

const TITLES: Record<string, string> = {
  instagram: "Seen on Instagram",
  search: "Found on Google",
  website: "Visited the website",
  booking: "Clicked to book",
  email: "Kept in touch by email",
};

function ChapterSection({ ch, wash, children }: { ch: Chapter; wash?: boolean; children?: React.ReactNode }) {
  return (
    <section id={ch.id} className={`ch${wash ? " ch-wash" : ""}`} aria-labelledby={`${ch.id}-t`}>
      <div className="wrap ch-grid">
        <div className="ch-text">
          <ChapterHead ch={ch} title={TITLES[ch.id]} />
          <PerWin render={(w) => (
            <>
              <h3 className="ch-t">{ch.text[w.id].h}</h3>
              <p className="ch-b">{ch.text[w.id].b}</p>
              <Figures cards={ch.cards[w.id]} />
            </>
          )} />
          {ch.after ? <div className="ch-after">{ch.after.map((p) => <p key={p}>{p}</p>)}</div> : null}
        </div>
        <div className="ch-figs">
          <Key charts={ch.charts} />
          {ch.charts.map((c) => <MonthChart key={c.id} c={c} />)}
          {ch.queries ? <TopSearches q={ch.queries} /> : null}
          {children}
        </div>
      </div>
    </section>
  );
}

/* The full table follows the chapters' order; "Short links" reads as Booking. */
const GROUP_ORDER = ["Instagram", "Search", "Short links", "Email"];
const GROUP_LABEL: Record<string, string> = { "Short links": "Booking" };
/* Search rows lead with clicks; the name-search rate comes last, as its
   3-month rise rests on Dr. El Chaar searches dropping away (Nov 10 review). */
const SEARCH_ORDER = ["Search clicks", "Search appearances", "Search click rate", "Name searches clicked"];

function Numbers({ w }: { w: (typeof WINDOWS)[number] }) {
  const rows = RV.numbers.rows[w.id];
  const compared = rows.some((r) => !r.na);
  const groups: { name: string; rows: Row[] }[] = [];
  for (const r of rows) {
    const g = groups.find((x) => x.name === r.group);
    if (g) g.rows.push(r); else groups.push({ name: r.group, rows: [r] });
  }
  groups.sort((x, y) => GROUP_ORDER.indexOf(x.name) - GROUP_ORDER.indexOf(y.name));
  for (const g of groups) if (g.name === "Search") g.rows.sort((x, y) => SEARCH_ORDER.indexOf(x.k) - SEARCH_ORDER.indexOf(y.k));
  return (
    <table className="lg">
      <caption className="sr">{compared ? `Each measure for ${w.period} against ${w.prior}` : `Each measure for ${w.period}`}</caption>
      <thead>
        <tr className="lg-cols">
          <th scope="col">Measure</th>
          <th scope="col">{w.label}<small>{w.period}</small></th>
          {compared ? (
            <>
              <th scope="col">Change</th>
              <th scope="col">Period before<small>{w.prior}</small></th>
            </>
          ) : <th scope="col" colSpan={2}>Recorded or shown from</th>}
        </tr>
      </thead>
      {groups.map((g) => (
        <tbody key={g.name}>
          <tr className="lg-g"><th colSpan={4} scope="colgroup">{GROUP_LABEL[g.name] ?? g.name}</th></tr>
          {g.rows.map((r) => (
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
                  <td className="lg-c"><Change c={r.c ?? ""} /></td>
                  <td className="lg-pv"><span className="lg-p">{r.prior}</span></td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      ))}
    </table>
  );
}

function Referrers() {
  const W = RV.website;
  const top = Math.max(...W.rows.map((r) => r.v));
  return (
    <figure className="rb">
      <figcaption className="rb-h"><b>Where website visits came from</b><span>{W.period}</span></figcaption>
      {W.rows.map((r) => (
        <div className={`rb-r${r.k === "Other sources" ? " o" : ""}`} key={r.k}>
          <span className="rb-k">{r.k}</span>
          <span className="rb-t" aria-hidden="true"><i style={{ width: `${((r.v / top) * 100).toFixed(2)}%` }} /></span>
          <span className="rb-v"><b>{fmtInt(r.v)}</b><small>{r.share}</small></span>
        </div>
      ))}
      <p className="rb-n">{W.note}</p>
      <details className="tv">
        <summary>Show visits by month as a table</summary>
        <div className="tv-w">
          <table>
            <thead><tr><th scope="col">Source</th>{W.months.map((m) => <th scope="col" key={m}>{mon(m)}</th>)}<th scope="col">Total</th></tr></thead>
            <tbody>{W.rows.map((r) => <tr key={r.k}><td>{r.k}</td>{r.months.map((v, i) => <td key={i}>{fmtInt(v)}</td>)}<td>{fmtInt(r.v)}</td></tr>)}</tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

/* ================================================================== PAGE */
export default function ReviewPage() {
  const [ig, search, booking, email] = ["instagram", "search", "booking", "email"].map((id) => RV.chapters.find((c) => c.id === id)!);
  const W = RV.website;
  return (
    <div className="rv">
      <style dangerouslySetInnerHTML={{ __html: CSS + switchCss() }} />

      <h1 className="sr">{RV.client}: 3, 6 and 12-month review</h1>

      <header className="top">
        <div className="wrap top-in">
          <div className="brand">
            <a className="brand-a" href="#top" aria-label={`${RV.client}, back to the top`}>
              <img src={MONO} alt="" width={40} height={40} />
              <b>{RV.client}</b>
            </a>
            <small className="brand-s"><span>3, 6 and 12-month review</span>{IS_INTERNAL ? <i className="badge">Internal</i> : null}<a href="/">Weekly report</a></small>
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

      <section className="hero" id="top" aria-label="Summary">
        <img className="hero-wm" src={MONO} alt="" aria-hidden="true" />
        <div className="wrap">
          <PerWin render={(w) => {
            const l = RV.lead[w.id];
            return (
              <>
                <p className="hero-k">{w.label}: {w.period}</p>
                <h2 className="hero-h">{l.headline}</h2>
                <p className="hero-d">{l.deck}</p>
                <p className="hero-m">{l.against ? `Compared with ${w.prior}. ` : ""}Read {RV.readOn}.</p>
                {IS_INTERNAL ? <p className="hero-note">{l.internalNote}</p> : null}
                <ol className="path" aria-label="The period at a glance">
                  {RV.journey[w.id].map((s) => (
                    <li key={s.href}>
                      <a href={s.href}>
                        <span className="p-step">{s.step}</span>
                        <span className="p-v">{s.v}</span>
                        <span className="p-l">{s.label}</span>
                        <span className="p-s">{s.sub}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </>
            );
          }} />
        </div>
      </section>

      <div className="how"><p className="wrap">{RV.howTo}</p></div>

      <main>
        <ChapterSection ch={ig} />

        <section id="worked" className="sec sec-wash" aria-labelledby="worked-t">
          <div className="wrap">
            <div className="sec-head">
              <p className="sec-k">Seen on Instagram</p>
              <h2 className="sec-t" id="worked-t">What worked</h2>
              <p className="sec-lede">{RV.worked.lede}</p>
            </div>
            <div className="wk">
              <IgFrame url={RV.worked.hero.url} title={RV.worked.hero.title} />
              <div>
                <p className="wk-meta">{RV.worked.hero.format}, {RV.worked.hero.date}</p>
                <h3 className="wk-t">{RV.worked.hero.title}</h3>
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
          </div>
        </section>

        <ChapterSection ch={search}>
          <details className="tv">
            <summary>Show search by month as a table</summary>
            <div className="stb-w">
              <table className="stb">
                <caption className="sr">Search by month, November 2025 to October 2026</caption>
                <thead><tr>{RV.search.table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
                <tbody>{RV.search.table.rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
              </table>
            </div>
            <p className="vc-note">{RV.search.tableNote}</p>
          </details>
          {IS_INTERNAL && RV.search.parasInternal.length ? (
            <div className="ch-int"><h4>Internal</h4>{RV.search.parasInternal.map((p) => <p key={p}>{p}</p>)}</div>
          ) : null}
        </ChapterSection>

        <section id="website" className="ch ch-wash" aria-labelledby="website-t">
          <div className="wrap ch-grid">
            <div className="ch-text">
              <ChapterHead ch={W} title={TITLES.website} />
              <h3 className="ch-t">{W.h}</h3>
              <p className="ch-b">{W.b}</p>
              <Figures cards={W.cards} />
            </div>
            <div className="ch-figs">
              <Referrers />
              {IS_INTERNAL && W.internal.length ? (
                <div className="ch-int"><h4>Internal</h4>{W.internal.map((p) => <p key={p}>{p}</p>)}</div>
              ) : null}
            </div>
          </div>
        </section>

        <ChapterSection ch={booking} />
        <ChapterSection ch={email} wash />

        <section id="numbers" className="sec" aria-labelledby="numbers-t">
          <div className="wrap">
            <div className="sec-head">
              <h2 className="sec-t" id="numbers-t">All the numbers</h2>
              <p className="sec-lede">{RV.numbers.lede}</p>
            </div>
            <PerWin render={(w) => <Numbers w={w} />} />
          </div>
        </section>

        {has("notes") ? (
          <section id="notes" className="sec sec-wash" aria-labelledby="notes-t">
            <div className="wrap">
              <div className="sec-head">
                <h2 className="sec-t" id="notes-t">Data notes</h2>
                <p className="sec-lede">{RV.notes.lede}</p>
              </div>
              <div className="att">
                {RV.notes.items.map((a) => (
                  <div className="att-i" key={a.title}>
                    <h3 className="att-t">{a.title}</h3>
                    <p className="att-b">{a.body}</p>
                  </div>
                ))}
                {RV.internalCharts.map((c) => <MonthChart key={c.id} c={c} />)}
              </div>
            </div>
          </section>
        ) : null}

        <section id="detail" className={`sec${has("notes") ? "" : " sec-wash"}`} aria-labelledby="detail-t">
          <div className="wrap">
            <div className="sec-head">
              <h2 className="sec-t" id="detail-t">About this review</h2>
              <p className="sec-lede">{RV.detail.lede}</p>
            </div>
            <div className="dt">
              {RV.detail.panels.map((p) => (
                <details key={p.id}>
                  <summary>{p.title}</summary>
                  <div className="dt-p">
                    {p.rows.length ? <table className="kvt"><tbody>{p.rows.map((row) => <tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td></tr>)}</tbody></table> : null}
                    {(p.faq ?? []).map((f) => <div className="faq" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
                    {p.note ? <p className="dt-note">{p.note}</p> : null}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
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
