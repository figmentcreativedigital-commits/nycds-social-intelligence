#!/usr/bin/env node
/* ==========================================================================
   Short.io weekly pull · NYC Dental Smiles and Edgard El Chaar, DDS, PC
   --------------------------------------------------------------------------
   Replaces the Path-view PDF export. Reads the domain's path view through the
   Short.io API for a Monday-to-Sunday week in America/New_York, plus the week
   before it, applies the locked counting rules, saves a dated snapshot, and
   prints the figures in ledger format.

   Usage (from the repo root):
     node scripts/shortio-pull.mjs --discover          list domains and links
     node scripts/shortio-pull.mjs                     last completed week
     node scripts/shortio-pull.mjs --week 2026-10-26   week starting that Monday
     add --client eec for EEC (the default is nycds)
     add --detail to also save per-link breakdowns (referrer, browser, daily)

   Each client has its own Secret key in .env.local (gitignored, never
   committed): SHORTIO_API_KEY for NYCDS, SHORTIO_EEC_API_KEY for EEC. The EEC
   pull also needs the NYCDS key, because 2 EEC booking links live on the NYCDS
   domain (see the eec config). SHORTIO_NYCDS_DOMAIN_ID and
   SHORTIO_EEC_DOMAIN_ID skip the domain lookup (1384205 for
   nycdentalsmileteam.short.gy; the EEC id prints on the first run).

   BASIS — the path view: POST /statistics/domain/{id}/top, column "path".
     NYCDS sends it unfiltered. Checked November 2, 2026: it reproduces the
     NYCDS October 26 – November 1 PDF exactly (152, 13, 12, 11, 8, 1, 5, 5, 1;
     /nycsmilepass 441). Found November 3: unfiltered, Short.io leaves out most
     automated clicks (on EEC it equals the dashboard's Human figure exactly;
     on NYCDS 665 against 676 Human and 2,545 all for that week). Any filter
     makes it count all clicks: NYCDS with /* filtered reads /nycds-website
     1,081, the figure the per-link endpoint gives. EEC reports on that
     filtered basis (pathFilter in its config); NYCDS's published figures are
     on the unfiltered one and stay there. The per-link endpoint
     is NOT used for counts: its totalClicks includes traffic the dashboard
     never shows (1,081 against 152 for /nycds-website) and its humanClicks
     differs from the path view on low-volume links. Its UTM fields come back
     empty, so campaign-tag splits still come from the dashboard.

   Counting rules (locked, see data-reconciliation):
     NYCDS
     - Named practice links are an allowlist. /nycsmilepass is reported under
       Smile Pass. /DDS-PC-* links are EEC's and excluded. /* is excluded.
       Anything not on the allowlist is listed as unidentified and omitted.
     EEC
     - Every path on links.edgardelchaar.com counts except /* (locked
       October 20, kept November 3). Paths other than the homepage and the 2
       booking links report together as Other named links.
     - /DDS-PC-Midtown and /DDS-PC-UES on the NYCDS domain book into EEC's
       CareStack and count as EEC booking (Walter, November 3, 2026). They are
       read from the NYCDS path view with the NYCDS key.
   ========================================================================== */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const TZ = "America/New_York";
const LINKS_API = "https://api.short.io";
const STATS_HOSTS = ["https://api-v2.short.io", "https://statistics.short.io"];
const TOP_LIMIT = 500;

/* ------------------------------------------------------------ CLIENT RULES */
/* path (no leading slash) → [label as it appears in report-data.ts, group]
   "" is the bare domain (the homepage link). Groups: web, booking, info. */
export const CLIENTS = {
  nycds: {
    name: "NYC Dental Smiles",
    hostname: "nycdentalsmileteam.short.gy",
    apiKeyEnv: "SHORTIO_API_KEY",
    domainEnv: "SHORTIO_NYCDS_DOMAIN_ID",
    anchorPath: "nycds-website",
    named: {
      "nycds-website": ["Main website", "web"],
      "": ["Homepage", "web"],
      "murray-hill-booking": ["Murray Hill — booking", "booking"],
      "lenoxhill-booking-weave": ["Lenox Hill — booking", "booking"],
      "58th-booking-weave": ["Plaza District — booking", "booking"],
      "ues-booking-weave": ["Upper East Side — booking", "booking"],
      "all-locations-booking-weave": ["All locations — booking", "booking"],
      /* Dentrix Ascend links, the former booking platform. They count as
         booking (Walter, November 2, 2026) and combine with each location's
         current booking link under the same label in the report. */
      "NYCDS-35thStreet": ["Murray Hill — booking", "booking"],
      "NYCDS-60th-Street": ["Lenox Hill — booking", "booking"],
      "NYCDS-58th-Street": ["Plaza District — booking", "booking"],
      "NYCDS-5thAve": ["Upper East Side — booking", "booking"],
    },
    separate: { nycsmilepass: "Smile Pass" },
    excludePrefixes: [["DDS-PC-", "EEC (DDS-PC)"]],
  },

  /* EEC. Labels match the detail panel rows in EEC's report-data.ts. Groups:
     home, booking, other. Every path not listed here, other than /*, counts
     as Other named links. */
  eec: {
    name: "Edgard El Chaar, DDS, PC",
    hostname: "links.edgardelchaar.com",
    apiKeyEnv: "SHORTIO_EEC_API_KEY",
    domainEnv: "SHORTIO_EEC_DOMAIN_ID",
    anchorPath: "eec-booking-midtown",
    format: "eec",
    named: {
      "": ["Homepage link", "home"],
      "eec-booking-midtown": ["Booking · Midtown", "booking"],
      "eec-booking-ues": ["Booking · Upper East Side", "booking"],
    },
    countOthers: ["Other named links", "other"],
    separate: {},
    excludePrefixes: [],
    /* The EEC basis is the dashboard's Path view with /* filtered out. Short.io
       answers an unfiltered path view with Human clicks only; any filter makes
       it count all clicks. Checked November 3, 2026: this filter reproduces the
       published Oct 26 – Nov 1 Path PDF exactly (98, 37, 13, 10, 9, 1 = 168),
       Oct 12 – 18 exactly (156), and the published booking and homepage trend
       for all 5 weeks. Unfiltered, the same weeks read 72, 100 and 89, which are
       the dashboard's Human figures. The paths value must be "/*": "*" does not
       match the catch-all. Also applied to the merged read below, so the
       DDS-PC links are on the same basis. */
    pathFilter: { exclude: { paths: ["/*"] } },
    /* Also read the same view with Human selected, for the week and the week
       before, to show alongside. Reported basis stays all clicks. */
    humanSplit: true,
    /* Links on another client's domain that count here. Read with that
       client's key and domain; path there → the path here it counts as. */
    merge: {
      client: "nycds",
      prefix: "DDS-PC-",
      paths: {
        "DDS-PC-Midtown": "eec-booking-midtown",
        "DDS-PC-UES": "eec-booking-ues",
      },
    },
  },
};

/* ----------------------------------------------------------------- HELPERS */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (n) => (n == null ? "—" : Number(n).toLocaleString("en-US"));
const norm = (p) => String(p ?? "").replace(/^\/+/, "");

/** Milliseconds the zone is ahead of UTC at a given instant. */
function zoneOffsetMs(utcMs, tz) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit",
    day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const g = (t) => Number(parts.find((p) => p.type === t).value);
  return Date.UTC(g("year"), g("month") - 1, g("day"), g("hour"), g("minute"), g("second")) - utcMs;
}

/** UTC ms of local midnight for a YYYY-MM-DD date in the zone (DST-safe). */
export function zonedMidnight(ymd, tz = TZ) {
  const [y, m, d] = ymd.split("-").map(Number);
  const wall = Date.UTC(y, m - 1, d);
  let t = wall;
  for (let i = 0; i < 4; i++) {
    const next = wall - zoneOffsetMs(t, tz);
    if (next === t) break;
    t = next;
  }
  return t;
}

const addDays = (ymd, n) => {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
};

/** Monday of the last fully completed Monday–Sunday week, in the zone. */
export function lastCompletedMonday(now = Date.now(), tz = TZ) {
  const local = new Date(now + zoneOffsetMs(now, tz));
  const ymd = local.toISOString().slice(0, 10);
  const dow = local.getUTCDay(); // 0 Sun … 6 Sat
  const sinceMonday = (dow + 6) % 7;
  return addDays(ymd, -sinceMonday - 7);
}

/** Week window: [Monday 00:00, next Monday 00:00) in the zone. */
export function weekWindow(monday, tz = TZ) {
  const start = zonedMidnight(monday, tz);
  const end = zonedMidnight(addDays(monday, 7), tz) - 1;
  const label = (ymd) => new Date(ymd + "T12:00:00Z")
    .toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  return { monday, sunday: addDays(monday, 6), start, end, short: label(monday), label: `${label(monday)} – ${label(addDays(monday, 6))}` };
}

function loadEnv(file = ".env.local") {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

/* -------------------------------------------------------------------- HTTP */
/* `key` is the client's Secret key. Each client has its own (apiKeyEnv), and
   each key is restricted to its own domain, so it is passed on every call. */
async function request(url, { method = "GET", body, key } = {}) {
  if (!key) throw new Error(`No API key passed for ${method} ${url.replace(/\?.*$/, "")}`);
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, {
      method,
      headers: {
        authorization: key,
        accept: "application/json",
        ...(body ? { "content-type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 429 || res.status >= 500) { await sleep(1000 * 2 ** attempt); continue; }
    const text = await res.text();
    if (!res.ok) {
      const err = new Error(`${res.status} ${method} ${url.replace(/\?.*$/, "")}: ${text.slice(0, 200)}`);
      err.status = res.status;
      throw err;
    }
    return text ? JSON.parse(text) : null;
  }
  throw new Error(`Gave up after retries: ${url.replace(/\?.*$/, "")}`);
}

let statsHost = null;
async function stats(pathAndQuery, opts) {
  const hosts = statsHost ? [statsHost] : STATS_HOSTS;
  let last;
  for (const h of hosts) {
    try {
      const out = await request(h + pathAndQuery, opts);
      statsHost = h;
      return out;
    } catch (e) {
      last = e;
      if (e.status && e.status !== 404) throw e;
    }
  }
  throw last;
}

const qs = (o) => new URLSearchParams(Object.entries(o).map(([k, v]) => [k, String(v)])).toString();

/* --------------------------------------------------------------------- API */
export async function listDomains(key) {
  const out = await request(`${LINKS_API}/api/domains`, { key });
  return Array.isArray(out) ? out : out?.domains ?? [];
}

export async function listLinks(domainId, key) {
  const links = [];
  let pageToken = null;
  do {
    const q = { domain_id: domainId, limit: 150, ...(pageToken ? { pageToken } : {}) };
    const out = await request(`${LINKS_API}/api/links?${qs(q)}`, { key });
    links.push(...(out?.links ?? []));
    pageToken = out?.nextPageToken ?? null;
  } while (pageToken);
  return links;
}

const windowQuery = (w) => ({ period: "custom", startDate: w.start, endDate: w.end, tzOffset: 0 });

/* `filter` is spread into the body: include / exclude (see the eec config).
   NYCDS sends none, which is the unfiltered view its reports are built on. */
async function pathView(domainId, w, key, filter = {}) {
  return stats(`/statistics/domain/${domainId}/top`, {
    method: "POST", key,
    body: { ...windowQuery(w), column: "path", limit: TOP_LIMIT, ...filter },
  });
}

async function linkStats(linkId, w, key) {
  return stats(`/statistics/link/${encodeURIComponent(linkId)}?${qs(windowQuery(w))}`, { key });
}

/* ---------------------------------------------------------------- CLASSIFY */
export function classify(p, rules) {
  const path = norm(p);
  if (path === "*" || path === "/*") return { cls: "excluded", label: "/* catch-all" };
  if (path in rules.named) {
    const [label, group] = rules.named[path];
    return { cls: "named", label, group };
  }
  const ci = Object.keys(rules.named).find((k) => k.toLowerCase() === path.toLowerCase());
  if (ci !== undefined) {
    const [label, group] = rules.named[ci];
    return { cls: "named", label, group, caseWarning: `/${path} matched /${ci} ignoring case` };
  }
  if (path in rules.separate) return { cls: "separate", label: rules.separate[path] };
  for (const [prefix, owner] of rules.excludePrefixes) {
    if (path.toLowerCase().startsWith(prefix.toLowerCase())) return { cls: "excluded", label: owner };
  }
  if (rules.countOthers) {
    const [label, group] = rules.countOthers;
    return { cls: "named", label, group, other: true };
  }
  return { cls: "unidentified", label: "Unidentified" };
}

/* -------------------------------------------------------------------- PULL */
async function pullWeek(domainId, links, rules, w, { detail = false, key, human = false } = {}) {
  let top;
  try { top = await pathView(domainId, w, key, rules.pathFilter); }
  catch (e) { throw new Error(`Path view failed for ${w.label}: ${e.message}`); }
  if (!Array.isArray(top)) throw new Error(`Path view returned no rows for ${w.label}`);

  const catalog = new Map(links.map((l) => [norm(l.path), l]));
  const rows = top.map((t) => {
    const p = norm(t.column), l = catalog.get(p);
    return {
      path: p, total: Number(t.score),
      id: l ? (l.idString ?? l.id) : null, title: l?.title ?? null,
      originalURL: l?.originalURL ?? null, createdAt: l?.createdAt ?? null,
      ...classify(p, rules),
    };
  });

  let perLink = null;
  if (detail) {
    perLink = [];
    for (const l of links) {
      perLink.push({ path: norm(l.path), id: l.idString ?? l.id, raw: await linkStats(l.idString ?? l.id, w, key) });
      await sleep(150);
    }
  }
  const week = { window: w, rows, truncated: top.length >= TOP_LIMIT, perLink };
  if (human) {
    const filter = { ...(rules.pathFilter ?? {}), include: { ...(rules.pathFilter?.include ?? {}), human: true } };
    let h;
    try { h = await pathView(domainId, w, key, filter); }
    catch (e) { throw new Error(`Human path view failed for ${w.label}: ${e.message}`); }
    week.humanRows = Array.isArray(h) ? h.map((t) => ({ path: norm(t.column), total: Number(t.score) })) : [];
  }
  return week;
}

function summarize(week) {
  const sum = (f) => week.rows.filter(f).reduce((a, r) => a + r.total, 0);
  const byGroup = (g) => sum((r) => r.cls === "named" && r.group === g);
  return {
    named: week.rows.filter((r) => r.cls === "named"),
    booking: byGroup("booking"), info: byGroup("info"), web: byGroup("web"),
    total: sum((r) => r.cls === "named"),
    domainTotal: sum(() => true),
    separate: week.rows.filter((r) => r.cls === "separate"),
    excluded: week.rows.filter((r) => r.cls === "excluded" && r.total > 0),
    unidentified: week.rows.filter((r) => r.cls === "unidentified" && r.total > 0),
  };
}

function checks(cur, curSum, rules, links) {
  const out = [];
  const ok = (m) => out.push(`  ✓ ${m}`);
  const warn = (m) => out.push(`  ! ${m}`);

  const linkPaths = new Set(links.map((l) => norm(l.path)));
  const missing = Object.keys(rules.named).filter((p) => !linkPaths.has(p));
  missing.length ? warn(`allowlist paths with no link on the domain: ${missing.map((p) => "/" + p).join(", ")}`)
                 : ok("every allowlisted path exists as a link");

  cur.truncated ? warn(`path view hit the ${TOP_LIMIT}-row limit; some paths may be missing`)
                : ok(`path view complete: ${cur.rows.length} paths, ${fmt(curSum.domainTotal)} clicks on the domain`);

  const parts = curSum.total + curSum.separate.reduce((a, r) => a + r.total, 0)
    + curSum.excluded.reduce((a, r) => a + r.total, 0) + curSum.unidentified.reduce((a, r) => a + r.total, 0);
  parts === curSum.domainTotal ? ok(`every click is accounted for: named, Smile Pass, excluded and unidentified sum to ${fmt(parts)}`)
                               : warn(`classified clicks ${fmt(parts)} do not equal the domain total ${fmt(curSum.domainTotal)}`);

  const fresh = links.filter((l) => l.createdAt && Date.parse(l.createdAt) >= cur.window.start && Date.parse(l.createdAt) <= cur.window.end);
  if (fresh.length) warn(`links created this week (confirm owner before adding): ${fresh.map((l) => `/${norm(l.path)}${l.title ? ` (${l.title})` : ""}`).join(", ")}`);

  cur.rows.filter((r) => r.caseWarning).forEach((r) => warn(r.caseWarning));
  return out;
}

function printReport(rules, cur, prev, links, pulledAt, trend = []) {
  const c = summarize(cur), p = summarize(prev);
  const hasInfo = Object.values(rules.named).some(([, g]) => g === "info");
  const prevOf = (r) => prev.rows.find((x) => x.path === r.path)?.total ?? 0;
  const L = [];
  const row = (label, a, b) => L.push(`  ${label.padEnd(52)}${String(a).padStart(7)}${String(b).padStart(9)}`);
  const year = cur.window.sunday.slice(0, 4);

  L.push(`Short.io · ${rules.name} · ${cur.window.label}, ${year} against ${prev.window.label}`);
  L.push(`Window ${TZ}, Monday 00:00 to Sunday 23:59. Pulled ${pulledAt}.`);
  L.push(`Basis: path view, All clicks (the same figures as the dashboard's Path view export).`);
  L.push("");
  L.push(`  ${"Named practice links".padEnd(52)}${"This wk".padStart(7)}${"Prev wk".padStart(9)}`);
  for (const [pth] of Object.entries(rules.named)) {
    const r = cur.rows.find((x) => x.path === pth) ?? { path: pth, total: 0, ...classify(pth, rules) };
    row(`${r.label}  /${r.path}`, fmt(r.total), fmt(prevOf(r)));
  }
  L.push("");
  row("Booking links", fmt(c.booking), fmt(p.booking));
  if (hasInfo) row("Location information links", fmt(c.info), fmt(p.info));
  row("Homepage and website", fmt(c.web), fmt(p.web));
  row("Named total", fmt(c.total), fmt(p.total));
  L.push("");
  const block = (title, list, prevList) => {
    L.push(`  ${title}`);
    const paths = [...new Set([...list, ...prevList].map((r) => r.path))];
    if (!paths.length) L.push("    none");
    for (const pth of paths) {
      const r = list.find((x) => x.path === pth) ?? prevList.find((x) => x.path === pth);
      const t = list.find((x) => x.path === pth)?.total ?? 0;
      const extra = r.cls === "unidentified" && r.title && r.title !== r.path ? `  (${r.title.slice(0, 24)})` : "";
      row(`${r.cls === "unidentified" ? "" : r.label + "  "}/${r.path}${extra}`, fmt(t), fmt(prevOf(r)));
    }
  };
  block("Reported separately", c.separate, p.separate);
  block("Excluded", c.excluded, p.excluded);
  block("Unidentified, omitted", c.unidentified, p.unidentified);
  L.push("");
  L.push("Checks");
  L.push(...checks(cur, c, rules, links));
  L.push("");

  // Ready to paste into report-data.ts → detail.links
  const byLabel = new Map();
  for (const r of c.named) byLabel.set(r.label, (byLabel.get(r.label) ?? 0) + r.total);
  const dests = [...byLabel].filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([label, v]) => `        { label: "${label}", value: ${v} },`);
  L.push("For report-data.ts · detail.links");
  L.push("      kv: [");
  L.push(`        { k: "Booking · all locations", v: "${fmt(c.booking)}" },`);
  if (hasInfo) L.push(`        { k: "Location pages", v: "${fmt(c.info)}" },`);
  L.push(`        { k: "Homepage and website", v: "${fmt(c.web)}" },`);
  L.push(`        { k: "Total", v: "${fmt(c.total)}" },`);
  L.push("      ],");
  L.push("      dests: [", ...dests, "      ],");

  // Scoreboard row, restated on the current rules for every week shown
  if (trend.length) {
    const tb = trend.map((t) => summarize(t).booking);
    let chg = "";
    if (p.booking > 0) {
      const pct = Math.round(((c.booking - p.booking) / p.booking) * 100);
      chg = `${pct >= 0 ? "+" : "−"}${Math.abs(pct)}%`;
    }
    L.push("");
    L.push(`Booking link clicks by week, every week counted on the current rules`);
    L.push("  " + trend.map((t, i) => `${t.window.short} ${tb[i]}`).join("  ·  "));
    L.push("");
    L.push("For report-data.ts · scoreboard (weeks, and the Booking link clicks row)");
    L.push(`    weeks: [${trend.map((t) => `"${t.window.short}"`).join(", ")}],`);
    L.push(`      cells: [{ v: "${fmt(c.booking)}"${chg ? `, c: "${chg}"` : ""} }, { v: "${fmt(p.booking)}" }], trend: [${tb.join(", ")}],`);
  }
  return L.join("\n");
}

/* --------------------------------------------------------------------- EEC */
/** Rows on another client's domain that count for this one (rules.merge),
    read with that client's key. Only paths under merge.prefix are kept. */
async function pullMerged(src, rules, w) {
  let top;
  try { top = await pathView(src.id, w, src.key, rules.pathFilter); }
  catch (e) { throw new Error(`Path view on ${src.hostname} failed for ${w.label}: ${e.message}`); }
  if (!Array.isArray(top)) throw new Error(`Path view on ${src.hostname} returned no rows for ${w.label}`);
  const m = rules.merge;
  const map = new Map(Object.entries(m.paths).map(([from, to]) => [from.toLowerCase(), [from, to]]));
  const catalog = new Map(src.links.map((l) => [norm(l.path), l]));
  const rows = [];
  for (const t of top) {
    const p = norm(t.column);
    if (!p.toLowerCase().startsWith(m.prefix.toLowerCase())) continue;
    const l = catalog.get(p);
    const base = {
      path: p, total: Number(t.score), source: src.hostname,
      id: l ? (l.idString ?? l.id) : null, title: l?.title ?? null,
      originalURL: l?.originalURL ?? null, createdAt: l?.createdAt ?? null,
    };
    const hit = map.get(p.toLowerCase());
    if (!hit) { rows.push({ ...base, cls: "unmapped", label: "Not mapped" }); continue; }
    const [from, to] = hit;
    rows.push({
      ...base, countsAs: to, ...classify(to, rules),
      ...(from !== p ? { caseWarning: `${src.hostname}/${p} matched /${from} ignoring case` } : {}),
    });
  }
  return { rows, rowsRead: top.length, truncated: top.length >= TOP_LIMIT, starRow: top.some((t) => norm(t.column) === "*") };
}

function summarizeEec(week) {
  const own = week.rows, mrg = week.merged?.rows ?? [];
  const named = (r) => r.cls === "named";
  const sum = (list, f) => list.filter(f).reduce((a, r) => a + r.total, 0);
  const both = (f) => sum(own, (r) => named(r) && f(r)) + sum(mrg, (r) => named(r) && f(r));
  return {
    home: both((r) => r.group === "home"),
    booking: both((r) => r.group === "booking"),
    other: both((r) => r.group === "other"),
    total: both(() => true),
    byLabel: (label) => both((r) => r.label === label),
    listed: sum(own, named),          // = the dashboard's Total clicks with /* filtered out
    domainTotal: sum(own, () => true),
    mergedTotal: sum(mrg, named),
    excluded: own.filter((r) => r.cls === "excluded" && r.total > 0),
    unidentified: own.filter((r) => r.cls === "unidentified" && r.total > 0),
    unmapped: mrg.filter((r) => r.cls === "unmapped" && r.total > 0),
  };
}

/** EEC scoreboard cell change: one decimal, U+2212 minus, and a dir field. */
export function pctCell(cur, prev) {
  if (!(prev > 0)) return { c: "", dir: "flat" };
  const raw = ((cur - prev) / prev) * 100;
  const r = Math.round(Math.abs(raw) * 10) / 10;
  if (r === 0) return { c: "0.0%", dir: "flat" };
  return { c: `${raw > 0 ? "+" : "−"}${r.toFixed(1)}%`, dir: raw > 0 ? "up" : "down" };
}

function checksEec(cur, c, rules, links, src) {
  const out = [];
  const ok = (m) => out.push(`  ✓ ${m}`);
  const warn = (m) => out.push(`  ! ${m}`);
  const host = rules.hostname;
  const inWeek = (l) => l.createdAt && Date.parse(l.createdAt) >= cur.window.start && Date.parse(l.createdAt) <= cur.window.end;

  /* The bare domain / is the domain's root redirect, not an entry in the link
     catalog, so it is not looked for there. */
  const linkPaths = new Set(links.map((l) => norm(l.path)));
  const missing = Object.keys(rules.named).filter((p) => p !== "" && !linkPaths.has(p));
  missing.length ? warn(`named paths with no link on ${host}: ${missing.map((p) => "/" + p).join(", ")}`)
                 : ok(`every named path exists as a link on ${host}${"" in rules.named && !linkPaths.has("") ? " (/ is the domain root)" : ""}`);

  if (rules.pathFilter) {
    const star = cur.rows.some((r) => r.path === "*");
    star ? warn(`a /* row came back from ${host}, so the /* filter was not applied: these are not the reported figures`)
         : ok(`/* filter applied on ${host}: no /* row in the listing`);
    if (src) {
      cur.merged.starRow ? warn(`a /* row came back from ${src.hostname}, so the /* filter was not applied there`)
                         : ok(`/* filter applied on ${src.hostname}`);
    }
  }
  if (src) {
    const srcPaths = new Set(src.links.map((l) => norm(l.path)));
    const gone = Object.keys(rules.merge.paths).filter((p) => !srcPaths.has(p));
    gone.length ? warn(`merged paths with no link on ${src.hostname}: ${gone.map((p) => "/" + p).join(", ")}`)
                : ok(`${Object.keys(rules.merge.paths).map((p) => "/" + p).join(" and ")} exist on ${src.hostname}`);
  }

  cur.truncated ? warn(`path view hit the ${TOP_LIMIT}-row limit on ${host}; some paths may be missing`)
                : ok(`path view complete: ${cur.rows.length} paths, ${fmt(c.domainTotal)} clicks on ${host}`);
  if (src) {
    cur.merged.truncated ? warn(`path view hit the ${TOP_LIMIT}-row limit on ${src.hostname}; a /${rules.merge.prefix}* row may be missing`)
                         : ok(`path view complete on ${src.hostname}: ${cur.merged.rowsRead} paths read for /${rules.merge.prefix}*`);
  }

  const parts = c.listed + c.excluded.reduce((a, r) => a + r.total, 0) + c.unidentified.reduce((a, r) => a + r.total, 0);
  parts === c.domainTotal ? ok(`every click on ${host} is accounted for: listed paths ${fmt(c.listed)}${parts > c.listed ? ` and /* ${fmt(parts - c.listed)}` : ""} sum to ${fmt(parts)}`)
                          : warn(`classified clicks ${fmt(parts)} do not equal the domain total ${fmt(c.domainTotal)}`);
  const sumRows = c.home + c.booking + c.other;
  sumRows === c.total && c.total === c.listed + c.mergedTotal
    ? ok(`Named links total ${fmt(c.total)} = listed paths ${fmt(c.listed)} + ${fmt(c.mergedTotal)} from ${src ? src.hostname : "other domains"}, and = homepage + booking + other`)
    : warn(`Named links total ${fmt(c.total)} does not reconcile: rows sum to ${fmt(sumRows)}, listed ${fmt(c.listed)} + merged ${fmt(c.mergedTotal)}`);

  if (c.unmapped.length) warn(`/${rules.merge.prefix}* paths on ${src.hostname} with no mapping, omitted: ${c.unmapped.map((r) => `/${r.path} (${r.total})`).join(", ")}`);

  const fresh = links.filter(inWeek);
  if (fresh.length) warn(`links created this week on ${host}, counted under the every-path rule (confirm they belong): ${fresh.map((l) => `/${norm(l.path)}${l.title ? ` (${l.title})` : ""}`).join(", ")}`);
  if (src) {
    const freshSrc = src.links.filter((l) => inWeek(l) && norm(l.path).toLowerCase().startsWith(rules.merge.prefix.toLowerCase()));
    if (freshSrc.length) warn(`/${rules.merge.prefix}* links created this week on ${src.hostname}: ${freshSrc.map((l) => `/${norm(l.path)}`).join(", ")}`);
  }

  [...cur.rows, ...(cur.merged?.rows ?? [])].filter((r) => r.caseWarning).forEach((r) => warn(r.caseWarning));
  return out;
}

function printEecReport(rules, cur, prev, links, src, pulledAt, trend = []) {
  const c = summarizeEec(cur), p = summarizeEec(prev);
  const host = rules.hostname;
  const L = [];
  const row = (label, a, b) => L.push(`  ${label.padEnd(52)}${String(a).padStart(7)}${String(b).padStart(9)}`);
  const head = (title) => L.push(`  ${title.padEnd(52)}${"This wk".padStart(7)}${"Prev wk".padStart(9)}`);
  const year = cur.window.sunday.slice(0, 4);
  const own = (week, pth) => week.rows.find((x) => x.path === pth)?.total ?? 0;
  const merged = (week, pth) => (week.merged?.rows ?? []).filter((x) => x.path.toLowerCase() === pth.toLowerCase()).reduce((a, r) => a + r.total, 0);
  const mergedNames = rules.merge ? Object.keys(rules.merge.paths).map((x) => "/" + x).join(" and ") : "";
  const bookingLabels = Object.values(rules.named).filter(([, g]) => g === "booking").map(([l]) => l);
  const [otherLabel] = rules.countOthers;

  L.push(`Short.io · ${rules.name} · ${cur.window.label}, ${year} against ${prev.window.label}`);
  L.push(`Window ${TZ}, Monday 00:00 to Sunday 23:59. Pulled ${pulledAt}.`);
  L.push(rules.pathFilter
    ? `Basis: path view, All clicks, catch-all /* filtered out in the query (the dashboard's Path view with /* filtered).`
    : `Basis: path view, unfiltered.`);
  L.push(`Every path on ${host} counts except /*.${src ? ` ${mergedNames} on ${src.hostname} count as booking.` : ""}`);
  L.push("");

  head(host);
  for (const pth of Object.keys(rules.named)) row(`${rules.named[pth][0]}  /${pth}`, fmt(own(cur, pth)), fmt(own(prev, pth)));
  const others = [...new Set([...cur.rows, ...prev.rows].filter((r) => r.other).map((r) => r.path))]
    .sort((a, b) => own(cur, b) - own(cur, a) || own(prev, b) - own(prev, a) || a.localeCompare(b));
  for (const pth of others) row(`${otherLabel}  /${pth}`, fmt(own(cur, pth)), fmt(own(prev, pth)));
  row("Paths listed, /* left out (the dashboard's Total)", fmt(c.listed), fmt(p.listed));

  if (src) {
    L.push("");
    head(`From ${src.hostname}`);
    for (const [pth, to] of Object.entries(rules.merge.paths)) row(`${rules.named[to][0]}  /${pth}`, fmt(merged(cur, pth)), fmt(merged(prev, pth)));
  }

  L.push("");
  L.push("  Excluded");
  const exPaths = [...new Set([...c.excluded, ...p.excluded].map((r) => r.path))];
  if (!exPaths.length) L.push(rules.pathFilter ? "    /* catch-all, filtered out in the query" : "    none");
  for (const pth of exPaths) {
    const r = [...c.excluded, ...p.excluded].find((x) => x.path === pth);
    row(`${r.label}  /${pth}`, fmt(own(cur, pth)), fmt(own(prev, pth)));
  }
  const unm = [...new Set([...c.unmapped, ...p.unmapped].map((r) => r.path))];
  if (unm.length) {
    L.push(`  Not mapped, omitted (on ${src.hostname})`);
    for (const pth of unm) row(`/${pth}`, fmt(merged(cur, pth)), fmt(merged(prev, pth)));
  }

  L.push("");
  head("For the report");
  row("Homepage link", fmt(c.home), fmt(p.home));
  for (const label of bookingLabels) row(label, fmt(c.byLabel(label)), fmt(p.byLabel(label)));
  row("Booking total", fmt(c.booking), fmt(p.booking));
  row(otherLabel, fmt(c.other), fmt(p.other));
  row("Named links total", fmt(c.total), fmt(p.total));

  /* The dashboard's Human figure for the same view, shown alongside. Not the
     reported basis. Merged links are not split. */
  if (cur.humanRows && prev.humanRows) {
    const h = (week, pth) => week.humanRows.find((x) => x.path === pth)?.total ?? 0;
    const hsum = (week) => week.humanRows.filter((x) => x.path !== "*").reduce((a, r) => a + r.total, 0);
    const paths = [...Object.keys(rules.named), ...others];
    L.push("");
    head("Human clicks, same view (not the basis)");
    for (const pth of paths) row(`${pth in rules.named ? rules.named[pth][0] : otherLabel}  /${pth}`, fmt(h(cur, pth)), fmt(h(prev, pth)));
    row("Human, paths listed", fmt(hsum(cur)), fmt(hsum(prev)));
    const share = (a, b) => (b > 0 ? `${Math.round((a / b) * 100)}%` : "—");
    row("Human share of paths listed", share(hsum(cur), c.listed), share(hsum(prev), p.listed));
  }

  if (others.length) {
    const cat = new Map(links.map((l) => [norm(l.path), l]));
    L.push("");
    L.push(`  What the ${otherLabel.toLowerCase()} are`);
    for (const pth of others) {
      const l = cat.get(pth);
      L.push(`    /${pth.padEnd(16)} ` + (l
        ? `${(l.title || "no title").slice(0, 40)}  →  ${(l.originalURL ?? "").slice(0, 70)}  ·  created ${String(l.createdAt ?? "").slice(0, 10)}`
        : "not in the link catalog (deleted, or the catalog was read before it was created)"));
    }
  }

  L.push("");
  L.push("Checks");
  L.push(...checksEec(cur, c, rules, links, src));
  L.push("");

  // Ready to paste into EEC's report-data.ts → detail.panels → id "links" → rows
  const cell = (a, b) => `"${fmt(a)} · from ${fmt(b)}"`;
  L.push(`For report-data.ts · detail panel "links" · rows`);
  L.push("        rows: [");
  L.push(`          ["Homepage link", ${cell(c.home, p.home)}],`);
  for (const label of bookingLabels) L.push(`          ["${label}", ${cell(c.byLabel(label), p.byLabel(label))}],`);
  L.push(`          ["Booking total", ${cell(c.booking, p.booking)}],`);
  L.push(`          ["${otherLabel}", ${cell(c.other, p.other)}],`);
  L.push(`          ["Named links total", ${cell(c.total, p.total)}],`);
  L.push("        ],");

  // Scoreboard rows, restated on the current rules for every week shown
  if (trend.length) {
    const ts = trend.map((t) => summarizeEec(t));
    const series = [
      ["Booking link clicks", (s) => s.booking],
      ["Homepage link clicks", (s) => s.home],
    ];
    L.push("");
    L.push("By week, every week counted on the current rules");
    for (const [k, f] of series) {
      L.push(`  ${k.padEnd(22)}` + trend.map((t, i) => {
        const fromSrc = k.startsWith("Booking") ? ts[i].mergedTotal : 0;
        return `${t.window.short} ${f(ts[i])}${fromSrc ? ` (${fromSrc} from /${rules.merge.prefix}*)` : ""}`;
      }).join("  ·  "));
    }
    L.push("");
    L.push("For report-data.ts · scoreboard (weeks, then trend and cells for each row; k, note, group and fmt stay as they are)");
    L.push(`    weeks: [${trend.map((t) => `"${t.window.short}"`).join(", ")}],`);
    for (const [k, f] of series) {
      const a = f(c), b = f(p), { c: chg, dir } = pctCell(a, b);
      L.push(`      ${k}`);
      L.push(`        trend: [${ts.map(f).join(", ")}],`);
      L.push(`        cells: [{ v: "${fmt(a)}", c: "${chg}", dir: "${dir}" }, { v: "${fmt(b)}", c: "", dir: "flat" }],`);
    }
  }
  return L.join("\n");
}

/* -------------------------------------------------------------------- MAIN */
function arg(argv, name) {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
}

async function resolveDomain(client, key) {
  if (process.env[client.domainEnv]) return { id: Number(process.env[client.domainEnv]), hostname: client.hostname ?? null };
  const domains = await listDomains(key);
  const denied = [];
  for (const d of domains) {
    let links;
    try { links = await listLinks(d.id, key); }
    catch (e) { if (e.status === 401 || e.status === 403) { denied.push(d.hostname); continue; } throw e; }
    if (links.some((l) => norm(l.path) === client.anchorPath)) return { id: d.id, hostname: d.hostname, links };
  }
  const skipped = denied.length ? ` This key cannot read: ${denied.join(", ")}.` : "";
  throw new Error(`No domain this key can read holds /${client.anchorPath}.${skipped} Check the key's access restriction, or set ${client.domainEnv} in .env.local.`);
}

export async function main(argv = process.argv.slice(2)) {
  loadEnv();
  const clientKey = arg(argv, "--client") ?? "nycds";
  const rules = CLIENTS[clientKey];
  if (!rules) throw new Error(`Unknown client ${clientKey}`);
  const key = process.env[rules.apiKeyEnv];
  if (!key) {
    console.error(`${rules.apiKeyEnv} is not set. Add it to .env.local in the repo root.`);
    process.exitCode = 1;
    return;
  }

  if (argv.includes("--discover")) {
    for (const d of await listDomains(key)) {
      let links;
      try { links = await listLinks(d.id, key); }
      catch (e) { if (e.status === 401 || e.status === 403) { console.log(`\nDomain ${d.hostname}  id ${d.id}  not readable with this key`); continue; } throw e; }
      console.log(`\nDomain ${d.hostname}  id ${d.id}  ${links.length} links`);
      for (const l of links.sort((a, b) => norm(a.path).localeCompare(norm(b.path)))) {
        const c = classify(l.path, rules);
        console.log(`  /${norm(l.path).padEnd(30)} ${String(l.idString ?? l.id).padEnd(12)} ${c.cls.padEnd(13)} ${(l.originalURL ?? "").slice(0, 60)}`);
      }
    }
    return;
  }

  const monday = arg(argv, "--week") ?? lastCompletedMonday();
  if (new Date(monday + "T12:00:00Z").getUTCDay() !== 1) throw new Error(`--week must be a Monday (got ${monday})`);
  const cw = weekWindow(monday), pw = weekWindow(addDays(monday, -7));
  const detail = argv.includes("--detail");

  /* A second source: links on another client's domain that count here,
     read with that client's own key (rules.merge). */
  let src = null;
  if (rules.merge) {
    const from = CLIENTS[rules.merge.client];
    const srcKey = process.env[from.apiKeyEnv];
    if (!srcKey) {
      console.error(`${from.apiKeyEnv} is not set. The ${clientKey} pull reads ${Object.keys(rules.merge.paths).map((p) => "/" + p).join(" and ")} on ${from.hostname} with it. Add it to .env.local in the repo root.`);
      process.exitCode = 1;
      return;
    }
    const d = await resolveDomain(from, srcKey);
    src = { id: d.id, hostname: d.hostname ?? from.hostname, key: srcKey, links: d.links ?? (await listLinks(d.id, srcKey)) };
  }

  const domain = await resolveDomain(rules, key);
  const links = domain.links ?? (await listLinks(domain.id, key));
  console.log(`Domain ${domain.hostname ?? "from .env.local"} · id ${domain.id} · ${links.length} links${src ? "" : "\n"}`);
  if (src) console.log(`Also reading ${src.hostname} · id ${src.id} · ${src.links.length} links, for /${rules.merge.prefix}* only\n`);
  const pulledAt = new Date().toLocaleString("en-US", { timeZone: TZ, dateStyle: "medium", timeStyle: "short" });

  const pull = async (w, opts = {}) => {
    const week = await pullWeek(domain.id, links, rules, w, { ...opts, key });
    if (src) week.merged = await pullMerged(src, rules, w);
    return week;
  };
  const cur = await pull(cw, { detail, ...(rules.humanSplit ? { human: true } : {}) });
  const prev = await pull(pw, { detail, ...(rules.humanSplit ? { human: true } : {}) });
  const older = [];
  for (const n of [4, 3, 2]) older.push(await pull(weekWindow(addDays(monday, -7 * n))));

  const report = rules.format === "eec"
    ? printEecReport(rules, cur, prev, links, src, pulledAt, [...older, prev, cur])
    : printReport(rules, cur, prev, links, pulledAt, [...older, prev, cur]);
  console.log(report);

  const dir = path.join("pulls", "shortio", clientKey);
  fs.mkdirSync(dir, { recursive: true });
  const base = path.join(dir, `${cw.monday}_${cw.sunday}`);
  const mergedFrom = src ? { mergedFrom: { id: src.id, hostname: src.hostname, paths: rules.merge.paths } } : {};
  const basis = rules.pathFilter ? { basis: "path view, All clicks, /* filtered out in the query", filter: rules.pathFilter } : { basis: "path view, All clicks" };
  fs.writeFileSync(`${base}.json`, JSON.stringify({ client: clientKey, domain: { id: domain.id, hostname: domain.hostname }, ...mergedFrom, pulledAt, statsHost, ...basis, current: cur, previous: prev, earlier: older }, null, 2));
  fs.writeFileSync(`${base}.txt`, report + "\n");
  console.log(`\nSaved ${base}.json and ${base}.txt`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((e) => { console.error(e?.message || String(e)); process.exitCode = 1; });
}
