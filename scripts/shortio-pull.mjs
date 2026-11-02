#!/usr/bin/env node
/* ==========================================================================
   Short.io weekly pull · NYC Dental Smiles (EEC config can be added below)
   --------------------------------------------------------------------------
   Replaces the Path-view PDF export. Reads the domain's path view through the
   Short.io API for a Monday-to-Sunday week in America/New_York, plus the week
   before it, applies the locked counting rules, saves a dated snapshot, and
   prints the figures in ledger format.

   Usage (from the repo root):
     node scripts/shortio-pull.mjs --discover          list domains and links
     node scripts/shortio-pull.mjs                     last completed week
     node scripts/shortio-pull.mjs --week 2026-10-26   week starting that Monday
     add --detail to also save per-link breakdowns (referrer, browser, daily)

   Needs SHORTIO_API_KEY in .env.local (gitignored, never committed).
   SHORTIO_NYCDS_DOMAIN_ID skips the domain lookup (1384205 for
   nycdentalsmileteam.short.gy).

   BASIS — the path view: POST /statistics/domain/{id}/top, column "path".
     This is the query behind the dashboard's Path view on All clicks. Checked
     November 2, 2026: it reproduces the October 26 – November 1 PDF exactly
     (152, 13, 12, 11, 8, 1, 5, 5, 1; /nycsmilepass 441). The per-link endpoint
     is NOT used for counts: its totalClicks includes traffic the dashboard
     never shows (1,081 against 152 for /nycds-website) and its humanClicks
     differs from the path view on low-volume links. Its UTM fields come back
     empty, so campaign-tag splits still come from the dashboard.

   Counting rules (locked, see data-reconciliation):
     - Named practice links are an allowlist. /nycsmilepass is reported under
       Smile Pass. /DDS-PC-* links are EEC's and excluded. /* is excluded.
       Anything not on the allowlist is listed as unidentified and omitted.
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
async function request(url, { method = "GET", body } = {}) {
  const key = process.env.SHORTIO_API_KEY;
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
export async function listDomains() {
  const out = await request(`${LINKS_API}/api/domains`);
  return Array.isArray(out) ? out : out?.domains ?? [];
}

export async function listLinks(domainId) {
  const links = [];
  let pageToken = null;
  do {
    const q = { domain_id: domainId, limit: 150, ...(pageToken ? { pageToken } : {}) };
    const out = await request(`${LINKS_API}/api/links?${qs(q)}`);
    links.push(...(out?.links ?? []));
    pageToken = out?.nextPageToken ?? null;
  } while (pageToken);
  return links;
}

const windowQuery = (w) => ({ period: "custom", startDate: w.start, endDate: w.end, tzOffset: 0 });

async function pathView(domainId, w) {
  return stats(`/statistics/domain/${domainId}/top`, {
    method: "POST",
    body: { ...windowQuery(w), column: "path", limit: TOP_LIMIT },
  });
}

async function linkStats(linkId, w) {
  return stats(`/statistics/link/${encodeURIComponent(linkId)}?${qs(windowQuery(w))}`);
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
  return { cls: "unidentified", label: "Unidentified" };
}

/* -------------------------------------------------------------------- PULL */
async function pullWeek(domainId, links, rules, w, { detail = false } = {}) {
  let top;
  try { top = await pathView(domainId, w); }
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
      perLink.push({ path: norm(l.path), id: l.idString ?? l.id, raw: await linkStats(l.idString ?? l.id, w) });
      await sleep(150);
    }
  }
  return { window: w, rows, truncated: top.length >= TOP_LIMIT, perLink };
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

/* -------------------------------------------------------------------- MAIN */
function arg(argv, name) {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
}

async function resolveDomain(client) {
  if (process.env[client.domainEnv]) return { id: Number(process.env[client.domainEnv]), hostname: client.hostname ?? null };
  const domains = await listDomains();
  const denied = [];
  for (const d of domains) {
    let links;
    try { links = await listLinks(d.id); }
    catch (e) { if (e.status === 401 || e.status === 403) { denied.push(d.hostname); continue; } throw e; }
    if (links.some((l) => norm(l.path) === client.anchorPath)) return { id: d.id, hostname: d.hostname, links };
  }
  const skipped = denied.length ? ` This key cannot read: ${denied.join(", ")}.` : "";
  throw new Error(`No domain this key can read holds /${client.anchorPath}.${skipped} Check the key's access restriction, or set ${client.domainEnv} in .env.local.`);
}

export async function main(argv = process.argv.slice(2)) {
  loadEnv();
  if (!process.env.SHORTIO_API_KEY) {
    console.error("SHORTIO_API_KEY is not set. Add it to .env.local in the repo root.");
    process.exitCode = 1;
    return;
  }
  const clientKey = arg(argv, "--client") ?? "nycds";
  const rules = CLIENTS[clientKey];
  if (!rules) throw new Error(`Unknown client ${clientKey}`);

  if (argv.includes("--discover")) {
    for (const d of await listDomains()) {
      let links;
      try { links = await listLinks(d.id); }
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

  const domain = await resolveDomain(rules);
  const links = domain.links ?? (await listLinks(domain.id));
  console.log(`Domain ${domain.hostname ?? "from .env.local"} · id ${domain.id} · ${links.length} links\n`);
  const pulledAt = new Date().toLocaleString("en-US", { timeZone: TZ, dateStyle: "medium", timeStyle: "short" });

  const cur = await pullWeek(domain.id, links, rules, cw, { detail });
  const prev = await pullWeek(domain.id, links, rules, pw, { detail });
  const older = [];
  for (const n of [4, 3, 2]) older.push(await pullWeek(domain.id, links, rules, weekWindow(addDays(monday, -7 * n))));

  const report = printReport(rules, cur, prev, links, pulledAt, [...older, prev, cur]);
  console.log(report);

  const dir = path.join("pulls", "shortio", clientKey);
  fs.mkdirSync(dir, { recursive: true });
  const base = path.join(dir, `${cw.monday}_${cw.sunday}`);
  fs.writeFileSync(`${base}.json`, JSON.stringify({ client: clientKey, domain: { id: domain.id, hostname: domain.hostname }, pulledAt, statsHost, basis: "path view, All clicks", current: cur, previous: prev, earlier: older }, null, 2));
  fs.writeFileSync(`${base}.txt`, report + "\n");
  console.log(`\nSaved ${base}.json and ${base}.txt`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((e) => { console.error(e?.message || String(e)); process.exitCode = 1; });
}
