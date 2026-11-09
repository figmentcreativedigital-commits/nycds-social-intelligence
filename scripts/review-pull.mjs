#!/usr/bin/env node
/* ==========================================================================
   review-pull.mjs · monthly figures for the EEC 3 / 6 / 12 month review
   --------------------------------------------------------------------------
   Run from the NYCDS repo root, in your own Terminal (the APIs are not
   reachable from Claude's sandbox):

     node scripts/review-pull.mjs --client eec              24 months ending the
                                                            last complete month
     node scripts/review-pull.mjs --client eec --end 2026-10   a specific end month

   Saves pulls/review/eec/<end month>.json and .txt (/pulls/ is gitignored).
   Reads, by calendar month in New York time:
   - Instagram (Metricool brand "DDS PC"): followers (month-end reading),
     views, reach (daily reach summed), interactions (feed posts + reels, per
     piece on its publish date), accounts engaged, Story impressions, followers
     gained and lost; and every reel and feed post of the last 12 months with
     its figures as read now.
   - Search Console: clicks, impressions, click rate, position (all searches
     and US only, weighted by impressions); top pages and queries for each
     window.
   - GA4: new visitors (daily new users summed, as the weekly report does),
     sessions, engaged sessions, Google search, direct and other sources,
     new users reaching the 404 page; landing pages and devices per window.
     Our own traffic is left out of every report, as in ga4-pull.mjs.
   - Short.io: the same basis as the weekly pull (path view, all clicks, /*
     filtered out in the query, DDS-PC booking links on the NYCDS domain
     counted as EEC booking), from the month the first link was created.

   SELF-CHECK. It rebuilds the latest week held in all 3 ledgers from the same
   daily data and compares it with the figures as reported, and the same week's
   short link figures with the latest weekly Short.io pull on disk. A ✗ means
   the monthly basis differs from the weekly one and must be fixed before the
   figures are used.

   Keys and auth: the same as the weekly pulls (.env.local and the Google
   service-account key at ~/.config/figment/google-reporting.json). Nothing
   secret is printed or saved.
   ========================================================================== */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { CLIENTS as SIO, listLinks, listDomains, classify, zonedMidnight } from "./shortio-pull.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const TZ = "America/New_York";

const CLIENTS = {
  eec: {
    name: "Edgard El Chaar, DDS, PC",
    host: "edgardelchaar.com",
    metricoolBlogId: 6419911,
    gscSiteEnv: "GSC_EEC_SITE",
    ga4IdEnv: "GA4_EEC_PROPERTY",
    // Keep in step with ga4-pull.mjs (Walter, November 9, 2026).
    excludeSources: ["eec-prototype.vercel.app", "figmentcreative.com"],
    shortio: "eec",
    // Search and website figures are US only (Walter, November 9, 2026).
    // All-country totals are still read, for the self-check and for context.
    country: { label: "US", gsc: "usa", ga4: "United States" },
  },
};

/* ------------------------------------------------------------------ setup */

function loadEnvLocal() {
  for (const p of [path.join(process.cwd(), ".env.local"), path.join(SCRIPT_DIR, "..", ".env.local")]) {
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m || process.env[m[1]] !== undefined) continue;
      process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
    }
    return;
  }
}
loadEnvLocal();

const argv = process.argv.slice(2);
const opt = (n) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : null; };
function fail(msg) { console.error(`\n✗ ${msg}\n`); process.exit(2); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let requests = 0;

/* ------------------------------------------------------------------ dates */

const DAY = 86400000;
const toUtc = (d) => Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10));
const fromUtc = (ms) => new Date(ms).toISOString().slice(0, 10);
const addDays = (d, n) => fromUtc(toUtc(d) + n * DAY);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function nyParts(ms) {
  const o = {};
  for (const p of new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date(ms))) o[p.type] = p.value;
  return { date: `${o.year}-${o.month}-${o.day}`, time: `${o.hour}:${o.minute}:${o.second}` };
}
const nyToday = () => process.env.REVIEW_TODAY || nyParts(Date.now()).date; // REVIEW_TODAY: offline tests only
const addMonths = (m, n) => { const y = +m.slice(0, 4), mo = +m.slice(5, 7) - 1 + n; return `${y + Math.floor(mo / 12)}-${String(((mo % 12) + 12) % 12 + 1).padStart(2, "0")}`; };
const firstDay = (m) => `${m}-01`;
const lastDay = (m) => addDays(firstDay(addMonths(m, 1)), -1);
const daysIn = (m) => +lastDay(m).slice(8, 10);
const mLabel = (m) => `${MONTHS[+m.slice(5, 7) - 1]} ${m.slice(0, 4)}`;
const short = (d) => `${MONTHS[+d.slice(5, 7) - 1]} ${+d.slice(8, 10)}`;
function offsetMinutes(utcMs, tz = TZ) {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "longOffset" }).formatToParts(new Date(utcMs)).find((p) => p.type === "timeZoneName").value;
  const m = name.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
  return m ? (m[1] === "-" ? -1 : 1) * (+m[2] * 60 + +(m[3] || 0)) : 0;
}
function wallToUtc(date, time, tz) {
  const [h, mi, s = 0] = time.split(":").map(Number);
  const naive = toUtc(date) + ((h * 60 + mi) * 60 + s) * 1000;
  let off = offsetMinutes(naive, tz);
  off = offsetMinutes(naive - off * 60000, tz);
  return { ms: naive - off * 60000, off };
}
function nyIso(date, time) {
  const { off } = wallToUtc(date, time, TZ);
  const a = Math.abs(off);
  return `${date}T${time}${off < 0 ? "-" : "+"}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
}

/* ------------------------------------------------------- Google auth/http */

const KEY_FILE = process.env.GOOGLE_REPORTING_KEY_FILE || path.join(os.homedir(), ".config", "figment", "google-reporting.json");
const shownKeyPath = KEY_FILE.startsWith(os.homedir()) ? `~${KEY_FILE.slice(os.homedir().length)}` : KEY_FILE;
function loadGoogleKey() {
  if (!fs.existsSync(KEY_FILE)) fail(`No key file at ${shownKeyPath}. It is the same key the Search Console and GA4 pulls use.`);
  let key;
  try { key = JSON.parse(fs.readFileSync(KEY_FILE, "utf8")); } catch { fail(`${shownKeyPath} is not valid JSON.`); }
  if (key?.type !== "service_account" || !key.client_email || !key.private_key) fail(`${shownKeyPath} is not a service-account key.`);
  return key;
}
const tokens = {};
async function googleToken(key, scope) {
  if (tokens[scope]) return tokens[scope];
  const now = Math.floor(Date.now() / 1000);
  const enc = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const aud = key.token_uri || "https://oauth2.googleapis.com/token";
  const unsigned = `${enc({ alg: "RS256", typ: "JWT" })}.${enc({ iss: key.client_email, scope, aud, iat: now, exp: now + 3600 })}`;
  const sig = crypto.sign("RSA-SHA256", Buffer.from(unsigned), key.private_key).toString("base64url");
  const res = await fetch(aud, {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${sig}` }),
  }).catch((e) => fail(`Could not reach Google's sign-in service (${e.cause?.code || e.message}).`));
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.access_token) fail(`Google refused the service-account key (HTTP ${res.status}${body.error ? `, ${body.error}` : ""}).`);
  return (tokens[scope] = body.access_token);
}
async function gcall(key, scope, method, url, body) {
  const token = await googleToken(key, scope);
  for (let attempt = 1; attempt <= 3; attempt++) {
    requests++;
    let res;
    try {
      res = await fetch(url, { method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" }, body: body ? JSON.stringify(body) : undefined });
    } catch (e) {
      if (attempt === 3) return { status: 0, json: null, text: String(e.cause?.code || e.message) };
      await sleep(1000 * attempt); continue;
    }
    if ((res.status === 429 || res.status >= 500) && attempt < 3) { await sleep(2000 * attempt); continue; }
    const text = await res.text();
    let json = null; try { json = JSON.parse(text); } catch { /* not JSON */ }
    return { status: res.status, json, text: text.slice(0, 600) };
  }
}

/* --------------------------------------------------------- Search Console */

const GSC_API = (process.env.GSC_BASE_URL || "https://searchconsole.googleapis.com/webmasters/v3").replace(/\/$/, "");
const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

async function gscQuery(key, site, body) {
  const rows = [];
  for (let startRow = 0; ; startRow += 25000) {
    const r = await gcall(key, GSC_SCOPE, "POST", `${GSC_API}/sites/${encodeURIComponent(site)}/searchAnalytics/query`, { type: "web", dataState: "all", rowLimit: 25000, startRow, ...body });
    if (r.status !== 200) fail(`Search Console query failed (HTTP ${r.status}): ${r.text}`);
    const page = r.json?.rows ?? [];
    rows.push(...page);
    if (page.length < 25000) return rows;
  }
}
async function gscSite(key, client) {
  if (process.env[client.gscSiteEnv]) return process.env[client.gscSiteEnv];
  const r = await gcall(key, GSC_SCOPE, "GET", `${GSC_API}/sites`);
  if (r.status !== 200) fail(`Could not list Search Console properties (HTTP ${r.status}): ${r.text}`);
  const readable = (r.json?.siteEntry ?? []).filter((s) => s.permissionLevel && s.permissionLevel !== "siteUnverifiedUser");
  const h = client.host;
  for (const form of [`sc-domain:${h}`, `https://${h}/`, `https://www.${h}/`, `http://${h}/`, `http://www.${h}/`]) {
    if (readable.some((s) => s.siteUrl === form)) return form;
  }
  fail(`The service account cannot read ${h} in Search Console.`);
}
function gscMonth(rows) {
  const clicks = rows.reduce((t, r) => t + r.clicks, 0), impressions = rows.reduce((t, r) => t + r.impressions, 0);
  const posImpr = rows.reduce((t, r) => t + r.position * r.impressions, 0);
  return { clicks, impressions, posImpr, position: impressions ? posImpr / impressions : null, days: rows.length };
}

const gscCountry = (code) => ({ dimensionFilterGroups: [{ filters: [{ dimension: "country", operator: "equals", expression: code }] }] });

// Top-level monthly figures, daily rows and window page and query lists are
// for client.country when it is set (US only for EEC); "all" holds every
// country. US position is always read, as the weekly reports use it.
async function pullGsc(client, months, windows) {
  const key = loadGoogleKey();
  const site = await gscSite(key, client);
  const from = firstDay(months[0]), to = lastDay(months[months.length - 1]);
  const scope = client.country ? gscCountry(client.country.gsc) : {};
  const all = await gscQuery(key, site, { startDate: from, endDate: to, dimensions: ["date"] });
  const us = await gscQuery(key, site, { startDate: from, endDate: to, dimensions: ["date"], ...gscCountry("usa") });
  const daily = !client.country ? all : client.country.gsc === "usa" ? us : await gscQuery(key, site, { startDate: from, endDate: to, dimensions: ["date"], ...scope });
  const monthly = {};
  for (const m of months) {
    const of = (rows) => gscMonth(rows.filter((r) => r.keys[0].startsWith(m)));
    const s = of(daily), a = of(all), u = of(us);
    monthly[m] = { clicks: s.clicks, impressions: s.impressions, posImpr: s.posImpr, position: s.position, days: s.days,
      usClicks: u.clicks, usImpressions: u.impressions, usPosImpr: u.posImpr, usPosition: u.position, usDays: u.days,
      all: { clicks: a.clicks, impressions: a.impressions, posImpr: a.posImpr, position: a.position, days: a.days } };
  }
  // Page lists for one country cover only part of its clicks: Google leaves
  // privacy-filtered searches out of page rows once a country is set, by
  // filter or by a page × country read (Nov 9 pull: US pages 281 of 678 US
  // clicks for Aug–Oct either way, close to the 265 with a known query). Each
  // list carries its coverage of the monthly total, so copy can say so, and
  // the all-country list (complete) is kept beside it: page claims for one
  // country rest on bounds from it (all-country page clicks less every click
  // from outside the country).
  const win = {};
  for (const w of windows) {
    const r = { startDate: firstDay(w.months[0]), endDate: lastDay(w.months[w.months.length - 1]) };
    const pages = await gscQuery(key, site, { ...r, dimensions: ["page"], ...scope });
    const total = w.months.reduce((t, m) => t + monthly[m].clicks, 0);
    win[w.id] = { pages, pagesCover: { clicks: pages.reduce((t, x) => t + x.clicks, 0), of: total }, queries: await gscQuery(key, site, { ...r, dimensions: ["query"], ...scope }),
      ...(client.country ? { pagesAll: await gscQuery(key, site, { ...r, dimensions: ["page"] }) } : {}) };
  }
  const firstDate = all.length ? all.map((r) => r.keys[0]).sort()[0] : null;
  return { site, country: client.country?.label ?? "All", firstDate, monthly, daily, dailyAll: all, dailyUs: us, windows: win };
}

/* -------------------------------------------------------------------- GA4 */

const GA4_DATA = (process.env.GA4_DATA_URL || "https://analyticsdata.googleapis.com/v1beta").replace(/\/$/, "");
const GA4_ADMIN = (process.env.GA4_ADMIN_URL || "https://analyticsadmin.googleapis.com/v1beta").replace(/\/$/, "");
const GA4_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const ENG = ["sessions", "engagedSessions", "userEngagementDuration", "newUsers", "activeUsers", "screenPageViews"];

async function ga4Property(key, client) {
  if (process.env[client.ga4IdEnv]) return process.env[client.ga4IdEnv].replace(/\D/g, "");
  const r = await gcall(key, GA4_SCOPE, "GET", `${GA4_ADMIN}/accountSummaries?pageSize=200`);
  if (r.status !== 200) fail(`Could not list GA4 properties (HTTP ${r.status}). Set ${client.ga4IdEnv} in .env.local.`);
  for (const a of r.json?.accountSummaries ?? []) for (const p of a.propertySummaries ?? []) {
    const id = p.property.replace("properties/", "");
    const s = await gcall(key, GA4_SCOPE, "GET", `${GA4_ADMIN}/properties/${id}/dataStreams?pageSize=50`);
    const hosts = (s.json?.dataStreams ?? []).map((d) => d.webStreamData?.defaultUri).filter(Boolean).map((u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } });
    if (hosts.includes(client.host)) return id;
  }
  fail(`No GA4 property with a web stream on ${client.host}. Set ${client.ga4IdEnv} in .env.local.`);
}
async function ga4Report(key, prop, body) {
  const rows = [];
  let headers = null;
  for (let offset = 0; ; offset += 100000) {
    const r = await gcall(key, GA4_SCOPE, "POST", `${GA4_DATA}/properties/${prop}:runReport`, { limit: 100000, offset, ...body });
    if (r.status !== 200) fail(`GA4 report failed (HTTP ${r.status}): ${r.text}`);
    const j = r.json ?? {};
    headers = [...(j.dimensionHeaders ?? []), ...(j.metricHeaders ?? [])].map((h) => h.name);
    rows.push(...(j.rows ?? []).map((x) => [...(x.dimensionValues ?? []).map((v) => v.value), ...(x.metricValues ?? []).map((v) => Number(v.value))]));
    if (!j.rowCount || rows.length >= j.rowCount) break;
  }
  return rows.map((r) => Object.fromEntries((headers ?? []).map((n, i) => [n, r[i]])));
}
const isGoogle = (s) => s.sessionSource === "google" && s.sessionMedium === "organic";
const isDirect = (s) => s.sessionSource === "(direct)";
const isCC = (s) => /constantcontact|conta\.cc/i.test(s.sessionSource);
const isBio = (s) => /linkinbio|linkin\.bio|linktr\.ee/i.test(s.sessionSource);
const isoOf = (d) => `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;

async function pullGa4(client, months, windows, checkWeek) {
  const key = loadGoogleKey();
  const prop = await ga4Property(key, client);
  const ex = client.excludeSources ?? [];
  const exclusion = ex.length ? { notExpression: { filter: { fieldName: "sessionSource", inListFilter: { values: ex, caseSensitive: false } } } } : null;
  // Every report drops own traffic. scoped() also keeps only client.country
  // (US only for EEC); everything() reads every country, for the self-check
  // against the weekly ledgers (which are all-country) and for context.
  const country = client.country ? { filter: { fieldName: "country", stringFilter: { matchType: "EXACT", value: client.country.ga4 } } } : null;
  const withFilter = (...extra) => {
    const parts = [exclusion, ...extra].filter(Boolean);
    return parts.length === 0 ? {} : parts.length === 1 ? { dimensionFilter: parts[0] } : { dimensionFilter: { andGroup: { expressions: parts } } };
  };
  const scoped = (extra) => withFilter(country, extra);
  const everything = () => withFilter();
  const range = (a, b) => ({ dateRanges: [{ startDate: a, endDate: b }] });
  const dims = (...d) => d.map((name) => ({ name }));
  const mets = (...m) => m.map((name) => ({ name }));
  const from = firstDay(months[0]), to = lastDay(months[months.length - 1]);

  const daily = await ga4Report(key, prop, { ...range(from, to), dimensions: dims("date"), metrics: mets(...ENG), ...scoped() });
  const bySource = await ga4Report(key, prop, { ...range(from, to), dimensions: dims("yearMonth", "sessionSource", "sessionMedium"), metrics: mets("sessions", "engagedSessions", "userEngagementDuration", "newUsers"), ...scoped() });
  const n404 = await ga4Report(key, prop, { ...range(from, to), dimensions: dims("yearMonth", "pageTitle"), metrics: mets("newUsers", "screenPageViews"),
    ...scoped({ filter: { fieldName: "pageTitle", stringFilter: { matchType: "BEGINS_WITH", value: "404" } } }) });
  const dailyAll = country ? await ga4Report(key, prop, { ...range(from, to), dimensions: dims("date"), metrics: mets("sessions", "newUsers"), ...everything() }) : daily;
  const bySourceAll = country ? await ga4Report(key, prop, { ...range(from, to), dimensions: dims("yearMonth", "sessionSource", "sessionMedium"), metrics: mets("sessions"), ...everything() }) : bySource;

  const monthly = {};
  for (const m of months) {
    const D = daily.filter((r) => isoOf(r.date).startsWith(m));
    const S = bySource.filter((r) => r.yearMonth === m.replace("-", ""));
    const s = (rows, k) => rows.reduce((t, r) => t + (r[k] || 0), 0);
    const g = S.filter(isGoogle), d = S.filter(isDirect);
    monthly[m] = {
      days: dailyAll.filter((r) => isoOf(r.date).startsWith(m) && r.sessions > 0).length,
      newUsers: s(D, "newUsers"), sessions: s(D, "sessions"), engagedSessions: s(D, "engagedSessions"), engagementTime: s(D, "userEngagementDuration"),
      googleVisits: s(g, "sessions"), googleEngaged: s(g, "engagedSessions"), googleTime: s(g, "userEngagementDuration"),
      direct: s(d, "sessions"), directEngaged: s(d, "engagedSessions"), directTime: s(d, "userEngagementDuration"),
      constantContact: s(S.filter(isCC), "sessions"), bioLink: s(S.filter(isBio), "sessions"),
      other: s(S.filter((x) => !isGoogle(x) && !isDirect(x) && x.sessionSource !== "(not set)"), "sessions"),
      new404: s(n404.filter((r) => r.yearMonth === m.replace("-", "")), "newUsers"),
      all: (() => { const DA = dailyAll.filter((r) => isoOf(r.date).startsWith(m)), SA = bySourceAll.filter((r) => r.yearMonth === m.replace("-", ""));
        return { newUsers: s(DA, "newUsers"), sessions: s(DA, "sessions"), googleVisits: s(SA.filter(isGoogle), "sessions") }; })(),
    };
  }
  const win = {};
  for (const w of windows) {
    const a = firstDay(w.months[0]), b = lastDay(w.months[w.months.length - 1]);
    win[w.id] = {
      totals: (await ga4Report(key, prop, { ...range(a, b), metrics: mets(...ENG), ...scoped() }))[0] ?? {},
      devices: await ga4Report(key, prop, { ...range(a, b), dimensions: dims("deviceCategory"), metrics: mets("activeUsers", "sessions"), ...scoped() }),
      landing: await ga4Report(key, prop, { ...range(a, b), dimensions: dims("landingPage"), metrics: mets("sessions", "newUsers", "engagedSessions", "screenPageViews"), ...scoped() }),
      sources: await ga4Report(key, prop, { ...range(a, b), dimensions: dims("sessionSource", "sessionMedium"), metrics: mets("sessions", "engagedSessions", "userEngagementDuration", "newUsers"), ...scoped() }),
    };
  }
  let check = null;
  if (checkWeek) {
    const read = async (f) => (await ga4Report(key, prop, { ...range(checkWeek, addDays(checkWeek, 6)), dimensions: dims("sessionSource", "sessionMedium"), metrics: mets("sessions"), ...f })).filter(isGoogle).reduce((t, r) => t + r.sessions, 0);
    check = { googleVisits: await read(everything()), scopedGoogleVisits: country ? await read(scoped()) : null };
  }
  const firstDate = dailyAll.filter((r) => r.sessions > 0).map((r) => isoOf(r.date)).sort()[0] ?? null;
  return { property: prop, excludedSources: ex, country: client.country?.label ?? "All", firstDate, monthly,
    daily: daily.map((r) => ({ ...r, date: isoOf(r.date) })), dailyAll: dailyAll.map((r) => ({ date: isoOf(r.date), sessions: r.sessions, newUsers: r.newUsers })), windows: win, check };
}

/* -------------------------------------------------------------- Metricool */

const MC_BASE = (process.env.METRICOOL_BASE_URL || "https://app.metricool.com/api").replace(/\/$/, "");
const MC_METRICS = {
  followers:          { agg: "last", candidates: [["account", "followers"]] },
  views:              { agg: "sum",  candidates: [["account", "views"], ["account", "impressions"]] },
  reach:              { agg: "sum",  candidates: [["account", "reach"], ["account", "impressionsUnique"]] },
  interactions:       { agg: "sum",  candidates: [["account", "postsInteractions"]], sparse: true },
  accountsEngaged:    { agg: "sum",  candidates: [["account", "accounts_engaged"]] },
  storiesImpressions: { agg: "sum",  candidates: [["stories", "impressions"]], sparse: true },
  followersGained:    { agg: "sum",  candidates: [["account", "followers_gained"]], sparse: true, optional: true },
  followersLost:      { agg: "sum",  candidates: [["account", "followers_lost"]], sparse: true, optional: true },
};
async function mcGet(p, params) {
  const url = `${MC_BASE}${p}?${new URLSearchParams({ ...params, userId: process.env.METRICOOL_USER_ID || "" })}`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    requests++;
    let res;
    try { res = await fetch(url, { headers: { "X-Mc-Auth": process.env.METRICOOL_USER_TOKEN || "", Accept: "application/json" } }); }
    catch (e) { if (attempt === 3) return { status: 0, json: null, text: String(e.cause?.code || e.message) }; await sleep(1000 * attempt); continue; }
    if ((res.status === 429 || res.status >= 500) && attempt < 3) { await sleep(1500 * attempt); continue; }
    if (res.status === 401 || res.status === 403) fail(`Metricool refused the key (HTTP ${res.status}). Check METRICOOL_USER_TOKEN and METRICOOL_USER_ID in .env.local.`);
    const text = await res.text();
    let json = null; try { json = JSON.parse(text); } catch { /* not JSON */ }
    return { status: res.status, json, text: text.slice(0, 400) };
  }
}
function dateKey(s) {
  if (s === undefined || s === null) return null;
  s = String(s);
  if (/^\d{8}$/.test(s)) return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  const lit = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (!lit) return null;
  if (/(Z|[+-]\d{2}:?\d{2})$/.test(s)) {
    const ms = Date.parse(s);
    if (!Number.isNaN(ms)) { const ny = nyParts(ms); if (ny.time === "00:00:00") return ny.date; }
  }
  return lit[1];
}
function parseTimeline(json) {
  let points = null;
  if (Array.isArray(json?.data) && json.data.length && Array.isArray(json.data[0]?.values)) points = json.data.flatMap((s) => s.values);
  else if (Array.isArray(json?.data)) points = json.data;
  else if (Array.isArray(json?.values)) points = json.values;
  else if (Array.isArray(json)) points = json;
  const out = new Map();
  for (const p of points || []) {
    const dt = typeof p?.dateTime === "object" ? p.dateTime?.dateTime : (p?.dateTime ?? p?.date ?? p?.day);
    const k = dateKey(dt);
    if (!k) continue;
    const v = p?.value ?? p?.total ?? null;
    out.set(k, v === null || v === undefined || v === "" ? null : Number(v));
  }
  return out;
}
function chunks(from, to, days = 92) {
  const out = [];
  for (let a = from; a <= to; a = addDays(a, days)) out.push([a, addDays(a, days - 1) > to ? to : addDays(a, days - 1)]);
  return out;
}
const pick = (o, ...keys) => { for (const k of keys) { const v = k.split(".").reduce((x, p) => (x == null ? undefined : x[p]), o); if (v !== undefined && v !== null && v !== "") return v; } return undefined; };
const num = (v) => (v === undefined || v === null || v === "" || Number.isNaN(Number(v)) ? null : Number(v));
function pieceDate(v) {
  if (v && typeof v === "object") {
    const dt = String(v.dateTime ?? "");
    const m = dt.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}(?::\d{2})?)/);
    if (m && v.timezone) { try { return nyParts(wallToUtc(m[1], m[2], v.timezone).ms).date; } catch { /* fall through */ } }
    v = dt;
  }
  const s = String(v ?? "");
  if (/^\d{8,14}$/.test(s)) return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  if (/(Z|[+-]\d{2}:?\d{2})$/.test(s) && !Number.isNaN(Date.parse(s))) return nyParts(Date.parse(s)).date;
  return s.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? "";
}
function normalizePiece(p, format) {
  const likes = num(pick(p, "likes")), comments = num(pick(p, "comments")), saves = num(pick(p, "saved", "saves")), shares = num(pick(p, "shares"));
  const parts = [likes, comments, saves, shares].filter((x) => x !== null);
  const url = pick(p, "url", "permalink", "link") ?? null;
  return {
    format, date: pieceDate(pick(p, "publishedAt", "timestamp", "created", "date")), url,
    type: pick(p, "type") ?? null,
    title: String(pick(p, "content", "text", "caption") ?? "").split("\n")[0].slice(0, 120),
    caption: String(pick(p, "content", "text", "caption") ?? "").slice(0, 600),
    views: num(pick(p, "views", "videoViews", "impressions")), reach: num(pick(p, "reach")),
    interactions: num(pick(p, "interactions")) ?? (parts.length ? parts.reduce((a, b) => a + b, 0) : null),
    likes, comments, saves, shares, reposts: num(pick(p, "reposts")), follows: num(pick(p, "follows")),
    durationSeconds: num(pick(p, "durationSeconds")), averageWatchTime: num(pick(p, "averageWatchTime")), skipRate: num(pick(p, "reelsSkipRate")),
  };
}

async function pullMetricool(client, months, contentFrom) {
  if (!process.env.METRICOOL_USER_TOKEN || !process.env.METRICOOL_USER_ID) fail("METRICOOL_USER_TOKEN and METRICOOL_USER_ID must be set in .env.local.");
  const from = firstDay(months[0]), to = lastDay(months[months.length - 1]);
  const series = {}, resolved = {}, warnings = [];
  for (const [k, m] of Object.entries(MC_METRICS)) {
    let chosen = null;
    const all = new Map();
    for (const [subject, metric] of m.candidates) {
      let any = false;
      for (const [a, b] of chunks(from, to)) {
        const r = await mcGet("/v2/analytics/timelines", { blogId: client.metricoolBlogId, from: nyIso(a, "00:00:00"), to: nyIso(b, "23:59:59"), timezone: TZ, metric, subject, network: "instagram" });
        if (r.status >= 200 && r.status < 300) { const s = parseTimeline(r.json); if (s.size) any = true; for (const [d, v] of s) all.set(d, v); }
        await sleep(120);
      }
      if (any) { chosen = `${subject}/${metric}`; break; }
    }
    if (!chosen) { if (!m.optional) warnings.push(`Instagram ${k}: no timeline from Metricool`); continue; }
    resolved[k] = chosen;
    series[k] = all;
  }
  const monthly = {};
  for (const mo of months) {
    const days = Array.from({ length: daysIn(mo) }, (_, i) => addDays(firstDay(mo), i));
    const row = { daysInMonth: days.length };
    for (const [k, m] of Object.entries(MC_METRICS)) {
      const s = series[k];
      if (!s) { row[k] = null; continue; }
      const vals = days.map((d) => s.get(d));
      // A zero followers or reach reading means Metricool has no data for that day.
      const present = vals.filter((v) => v !== null && v !== undefined && !((k === "followers" || k === "reach") && v === 0));
      row[`${k}Days`] = present.length;
      if (m.agg === "last") {
        let last = null, lastDate = null;
        days.forEach((d, i) => { const v = vals[i]; if (v !== null && v !== undefined && v !== 0) { last = v; lastDate = d; } });
        row[k] = last; row[`${k}Date`] = lastDate;
      } else row[k] = present.length || m.sparse ? present.reduce((t, v) => t + v, 0) : null;
    }
    row.reachPerDay = row.reach !== null && row.reachDays === days.length ? Math.round(row.reach / days.length) : null;
    row.er = row.reach && row.reachDays === days.length && row.interactions !== null ? Math.round((row.interactions / row.reach) * 10000) / 100 : null;
    monthly[mo] = row;
  }
  const firstDates = Object.fromEntries(Object.entries(series).map(([k, s]) => [k, [...s].filter(([, v]) => v !== null && v !== 0).map(([d]) => d).sort()[0] ?? null]));
  // Every reel and feed post published in the content window, with its figures as read now.
  const content = new Map();
  for (const [kind, format] of [["reels", "Reel"], ["posts", "Post"]]) {
    for (const [a, b] of chunks(addDays(firstDay(contentFrom), -1), addDays(to, 1))) {
      const r = await mcGet(`/v2/analytics/${kind}/instagram`, { blogId: client.metricoolBlogId, from: `${a}T00:00:00`, to: `${b}T23:59:59`, timezone: TZ });
      const list = Array.isArray(r.json?.data) ? r.json.data : Array.isArray(r.json) ? r.json : [];
      if (!(r.status >= 200 && r.status < 300)) warnings.push(`Instagram ${kind} ${a} – ${b}: HTTP ${r.status}`);
      for (const p of list) { const n = normalizePiece(p, format); if (n.url) content.set(n.url, n); }
      await sleep(120);
    }
  }
  const pieces = [...content.values()].filter((p) => p.date >= firstDay(contentFrom) && p.date <= to).sort((x, y) => (y.views ?? -1) - (x.views ?? -1));
  return { blogId: client.metricoolBlogId, resolved, firstDates, monthly, daily: Object.fromEntries(Object.entries(series).map(([k, s]) => [k, Object.fromEntries([...s].sort())])), content: pieces, warnings };
}

/* --------------------------------------------------------------- Short.io */

const SIO_LINKS = (process.env.SHORTIO_LINKS_API || "https://api.short.io").replace(/\/$/, "");
const SIO_STATS = (process.env.SHORTIO_STATS_HOST || "https://api-v2.short.io").replace(/\/$/, "");
const norm = (p) => String(p ?? "").replace(/^\/+/, "");
async function sioRequest(url, { method = "GET", body, key } = {}) {
  for (let attempt = 0; attempt < 4; attempt++) {
    requests++;
    const res = await fetch(url, { method, headers: { authorization: key, accept: "application/json", ...(body ? { "content-type": "application/json" } : {}) }, body: body ? JSON.stringify(body) : undefined });
    if (res.status === 429 || res.status >= 500) { await sleep(1000 * 2 ** attempt); continue; }
    const text = await res.text();
    if (!res.ok) throw new Error(`Short.io ${res.status} ${method} ${url.replace(/\?.*$/, "")}: ${text.slice(0, 200)}`);
    return text ? JSON.parse(text) : null;
  }
  throw new Error(`Short.io gave up after retries: ${url.replace(/\?.*$/, "")}`);
}
async function sioDomainId(rules, key) {
  if (process.env[rules.domainEnv]) return Number(process.env[rules.domainEnv]);
  for (const d of await listDomains(key)) {
    try { if ((await listLinks(d.id, key)).some((l) => norm(l.path) === rules.anchorPath)) return d.id; } catch { /* not readable */ }
  }
  throw new Error(`No Short.io domain readable with ${rules.apiKeyEnv} holds /${rules.anchorPath}. Set ${rules.domainEnv} in .env.local.`);
}
async function sioPathView(domainId, startMs, endMs, key, filter) {
  return sioRequest(`${SIO_STATS}/statistics/domain/${domainId}/top`, { method: "POST", key, body: { period: "custom", startDate: startMs, endDate: endMs, tzOffset: 0, column: "path", limit: 500, ...filter } });
}

async function pullShortio(client, months, checkWeek) {
  const rules = SIO[client.shortio];
  const key = process.env[rules.apiKeyEnv];
  if (!key) fail(`${rules.apiKeyEnv} is not set in .env.local.`);
  const mergeFrom = SIO[rules.merge.client];
  const mkey = process.env[mergeFrom.apiKeyEnv];
  if (!mkey) fail(`${mergeFrom.apiKeyEnv} is not set in .env.local (the EEC pull reads the DDS-PC links with it).`);
  const domainId = await sioDomainId(rules, key);
  const mergeId = await sioDomainId(mergeFrom, mkey);
  const links = await listLinks(domainId, key);
  const mergeLinks = (await listLinks(mergeId, mkey)).filter((l) => norm(l.path).toLowerCase().startsWith(rules.merge.prefix.toLowerCase()));
  const created = [...links, ...mergeLinks].map((l) => l.createdAt).filter(Boolean).map((c) => nyParts(Date.parse(c)).date).sort();
  const startMonth = created.length ? created[0].slice(0, 7) : months[0];
  const mergeMap = new Map(Object.entries(rules.merge.paths).map(([a, b]) => [a.toLowerCase(), b]));

  const read = async (startMs, endMs) => {
    const top = await sioPathView(domainId, startMs, endMs, key, rules.pathFilter);
    await sleep(250);
    const mtop = await sioPathView(mergeId, startMs, endMs, mkey, rules.pathFilter);
    await sleep(250);
    if (!Array.isArray(top) || !Array.isArray(mtop)) throw new Error("Short.io path view returned no rows");
    const out = { home: 0, midtown: 0, ues: 0, booking: 0, other: 0, total: 0, byPath: {}, starRow: top.some((t) => norm(t.column) === "*") || mtop.some((t) => norm(t.column) === "*") };
    const add = (p, n) => {
      const c = classify(p, rules);
      if (c.cls !== "named") return;
      out.byPath[p] = (out.byPath[p] ?? 0) + n;
      out.total += n;
      if (c.group === "home") out.home += n;
      else if (c.group === "booking") { out.booking += n; if (p === "eec-booking-midtown") out.midtown += n; else out.ues += n; }
      else out.other += n;
    };
    for (const t of top) add(norm(t.column), Number(t.score));
    for (const t of mtop) { const to = mergeMap.get(norm(t.column).toLowerCase()); if (to) add(to, Number(t.score)); }
    return out;
  };
  const monthly = {};
  for (const m of months) {
    if (m < startMonth) { monthly[m] = null; continue; }
    monthly[m] = await read(zonedMidnight(firstDay(m), TZ), zonedMidnight(firstDay(addMonths(m, 1)), TZ) - 1);
  }
  const check = checkWeek ? await read(zonedMidnight(checkWeek, TZ), zonedMidnight(addDays(checkWeek, 7), TZ) - 1) : null;
  const catalog = [...links.map((l) => ({ ...l, domain: rules.hostname })), ...mergeLinks.map((l) => ({ ...l, domain: mergeFrom.hostname }))]
    .map((l) => ({ path: norm(l.path), domain: l.domain, title: l.title ?? null, originalURL: l.originalURL ?? null, createdAt: l.createdAt ? nyParts(Date.parse(l.createdAt)).date : null }));
  return { basis: "path view, All clicks, /* filtered out in the query; DDS-PC links on the NYCDS domain counted as EEC booking", startMonth, monthly, links: catalog, check };
}

/* ------------------------------------------------------------- self-check */

function ledger(name) {
  const f = path.join(SCRIPT_DIR, `${name}-ledger.json`);
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : null;
}
function pickCheckWeek(clientId, end) {
  const books = ["gsc", "ga4", "metricool"].map((n) => ledger(n)?.[clientId] ?? {});
  const weeks = Object.keys(books[0]).filter((w) => books.every((b) => b[w]) && addDays(w, 6) <= lastDay(end)).sort();
  return weeks.length ? weeks[weeks.length - 1] : null;
}
function latestWeeklyShortio(clientId, week) {
  const dir = path.join(process.cwd(), "pulls", "shortio", clientId);
  if (!fs.existsSync(dir)) return null;
  for (const f of fs.readdirSync(dir).filter((x) => /^\d{4}-\d{2}-\d{2}_\d{4}-\d{2}-\d{2}\.json$/.test(x)).sort().reverse()) {
    const j = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    for (const w of [j.current, j.previous, ...(j.earlier ?? [])]) {
      if (w?.window?.monday !== week) continue;
      const own = w.rows.filter((r) => r.cls === "named").reduce((t, r) => t + r.total, 0);
      const merged = (w.merged?.rows ?? []).filter((r) => r.cls === "named").reduce((t, r) => t + r.total, 0);
      return { file: f, pulledAt: j.pulledAt, total: own + merged };
    }
  }
  return null;
}

/* ----------------------------------------------------------------- report */

const int = (n) => (n === null || n === undefined ? "—" : Math.round(n).toLocaleString("en-US"));
const p2 = (n) => (n === null || n === undefined ? "—" : n.toFixed(2));

async function main() {
  const clientId = opt("--client") || "eec";
  const client = CLIENTS[clientId];
  if (!client) fail(`Unknown client ${clientId}. This pull is set up for: ${Object.keys(CLIENTS).join(", ")}.`);
  const end = opt("--end") || addMonths(nyToday().slice(0, 7), -1);
  if (!/^\d{4}-\d{2}$/.test(end)) fail(`--end must be a month as YYYY-MM (got ${end}).`);
  if (lastDay(end) >= nyToday()) fail(`${mLabel(end)} has not finished yet.`);
  const months = Array.from({ length: 24 }, (_, i) => addMonths(end, i - 23));
  const windows = [3, 6, 12].map((n) => ({ id: `${n}m`, n, months: months.slice(24 - n), prior: months.slice(24 - 2 * n, 24 - n) }));
  const checkWeek = pickCheckWeek(clientId, end);
  const readAt = new Date().toISOString();

  console.log(`Review pull · ${client.name} · ${mLabel(months[0])} – ${mLabel(end)} by calendar month (New York)`);
  console.log(`Windows: 3 months ${mLabel(windows[0].months[0])} – ${mLabel(end)}, 6 months from ${mLabel(windows[1].months[0])}, 12 months from ${mLabel(windows[2].months[0])}`);
  console.log("Reading Instagram…");
  const metricool = await pullMetricool(client, months, windows[2].months[0]);
  console.log("Reading Search Console…");
  const gsc = await pullGsc(client, months, windows);
  console.log("Reading GA4…");
  const ga4 = await pullGa4(client, months, windows, checkWeek);
  console.log("Reading Short.io…");
  const shortio = await pullShortio(client, months, checkWeek);

  /* Self-check: one ledger week rebuilt from the monthly pull's daily data. */
  const checks = [];
  const ok = (good, label, detail) => checks.push(`  ${good ? "✓" : "✗"} ${label}${detail ? `  ${detail}` : ""}`);
  if (checkWeek) {
    const days = Array.from({ length: 7 }, (_, i) => addDays(checkWeek, i));
    const L = { gsc: ledger("gsc")[clientId][checkWeek], ga4: ledger("ga4")[clientId][checkWeek], mc: ledger("metricool")[clientId][checkWeek] };
    const g = gscMonth(gsc.dailyAll.filter((r) => days.includes(r.keys[0]))), gu = gscMonth(gsc.dailyUs.filter((r) => days.includes(r.keys[0])));
    ok(g.clicks === L.gsc.clicks && g.impressions === L.gsc.impressions, `Search Console week of ${short(checkWeek)}, all countries: ${g.clicks} clicks, ${g.impressions} impressions`, `ledger ${L.gsc.clicks}, ${L.gsc.impressions}`);
    if (L.gsc.usClicks !== undefined) ok(gu.clicks === L.gsc.usClicks && gu.impressions === L.gsc.usImpressions, `Search Console week of ${short(checkWeek)}, US: ${gu.clicks} clicks, ${gu.impressions} impressions`, `ledger ${L.gsc.usClicks}, ${L.gsc.usImpressions}`);
    ok(Math.abs(gu.position - L.gsc.usPosition) < 0.006, `US position ${p2(gu.position)}`, `ledger ${L.gsc.usPosition}`);
    const nu = ga4.dailyAll.filter((r) => days.includes(r.date)).reduce((t, r) => t + r.newUsers, 0);
    ok(nu === L.ga4.newUsers, `GA4 new visitors, all countries ${nu}`, `ledger ${L.ga4.newUsers}`);
    ok(ga4.check.googleVisits === L.ga4.googleVisits, `GA4 visits from Google, all countries ${ga4.check.googleVisits}`, `ledger ${L.ga4.googleVisits}`);
    if (ga4.check.scopedGoogleVisits !== null) {
      const nuS = ga4.daily.filter((r) => days.includes(r.date)).reduce((t, r) => t + r.newUsers, 0);
      ok(nuS <= nu && ga4.check.scopedGoogleVisits <= ga4.check.googleVisits, `GA4 ${ga4.country} only: ${nuS} new visitors, ${ga4.check.scopedGoogleVisits} visits from Google`, "(no more than all countries)");
    }
    const d = metricool.daily;
    const s = (k) => days.reduce((t, x) => t + (d[k]?.[x] ?? 0), 0);
    ok(s("views") === L.mc.views, `Instagram views ${int(s("views"))}`, `ledger ${int(L.mc.views)}`);
    ok(Math.round(s("reach") / 7) === L.mc.reachPerDay, `Instagram reach per day ${Math.round(s("reach") / 7)}`, `ledger ${L.mc.reachPerDay}`);
    ok((d.followers?.[days[6]] ?? null) === L.mc.followers, `Instagram followers on ${short(days[6])} ${int(d.followers?.[days[6]])}`, `ledger ${int(L.mc.followers)}`);
    const it = s("interactions");
    ok(it >= L.mc.interactions && it <= L.mc.interactions * 1.5 + 10, `Instagram interactions ${it}`, `ledger ${L.mc.interactions} (interactions keep growing after a week closes)`);
    const wk = latestWeeklyShortio(clientId, checkWeek);
    if (wk) ok(shortio.check.total === wk.total, `Short.io week of ${short(checkWeek)}: ${shortio.check.total} named clicks`, `weekly pull ${wk.file} read ${wk.total} (${wk.pulledAt}); Short.io can revise past weeks`);
    else checks.push(`  · Short.io: no weekly pull on disk holds the week of ${short(checkWeek)}, so it is not checked`);
  } else checks.push("  · No ledger week falls inside these months, so nothing is checked");
  ok(Object.values(shortio.monthly).every((m) => !m || !m.starRow), "Short.io /* filter applied in every month: no /* row came back");
  if (gsc.country !== "All") ok(months.every((m) => gsc.monthly[m].clicks <= gsc.monthly[m].all.clicks && gsc.monthly[m].impressions <= gsc.monthly[m].all.impressions), `Search Console ${gsc.country} figures are within all-country figures in every month`);
  if (ga4.country !== "All") ok(months.every((m) => ga4.monthly[m].newUsers <= ga4.monthly[m].all.newUsers && ga4.monthly[m].sessions <= ga4.monthly[m].all.sessions && ga4.monthly[m].googleVisits <= ga4.monthly[m].all.googleVisits), `GA4 ${ga4.country} figures are within all-country figures in every month`);

  /* Text summary. */
  const L = [];
  L.push(`Review pull · ${client.name} · ${mLabel(months[0])} – ${mLabel(end)}`);
  L.push(`Read ${new Intl.DateTimeFormat("en-US", { timeZone: TZ, dateStyle: "medium", timeStyle: "short" }).format(new Date(readAt))} New York · ${requests} requests`);
  L.push(`Our own traffic left out of every GA4 figure: ${client.excludeSources.join(", ")}.`);
  L.push("");
  L.push("COVERAGE · first day each source has data");
  L.push(`  Instagram views ${metricool.firstDates.views ?? "none"} · reach ${metricool.firstDates.reach ?? "none"} · followers ${metricool.firstDates.followers ?? "none"} · interactions ${metricool.firstDates.interactions ?? "none"}`);
  L.push(`  Search Console ${gsc.firstDate ?? "none"} (Google keeps 16 months) · GA4 ${ga4.firstDate ?? "none"} · Short.io from ${mLabel(shortio.startMonth)} (first link created)`);
  L.push("");
  const head = (cols) => L.push(`  ${"Month".padEnd(10)}${cols.map((c) => c.padStart(11)).join("")}`);
  L.push("INSTAGRAM");
  head(["Followers", "Views", "Reach/day", "Interact.", "ER", "Engaged"]);
  for (const m of months) { const r = metricool.monthly[m]; L.push(`  ${mLabel(m).padEnd(10)}${[int(r.followers), int(r.views), int(r.reachPerDay), int(r.interactions), r.er === null ? "—" : r.er.toFixed(2) + "%", int(r.accountsEngaged)].map((c) => c.padStart(11)).join("")}`); }
  L.push("");
  L.push(`SEARCH CONSOLE · ${gsc.country === "All" ? "all countries" : `${gsc.country} only; last column all countries`}`);
  head(["Clicks", "Impr.", "Rate", "US pos.", "Days", "All clicks"]);
  for (const m of months) { const r = gsc.monthly[m]; L.push(`  ${mLabel(m).padEnd(10)}${[int(r.clicks), int(r.impressions), r.impressions ? (100 * r.clicks / r.impressions).toFixed(2) + "%" : "—", p2(r.usPosition), String(r.days), int(r.all.clicks)].map((c) => c.padStart(11)).join("")}`); }
  L.push(`  Page lists cover: ${windows.map((w) => { const x = gsc.windows[w.id]; return `${w.id} ${int(x.pagesCover.clicks)} of ${int(x.pagesCover.of)} clicks`; }).join(" · ")}${gsc.country === "All" ? "" : ` (Google leaves part of ${gsc.country} search out of page lists)`}`);
  L.push("");
  L.push(`GA4 · ${ga4.country === "All" ? "all countries" : `${ga4.country} only; last 2 columns all countries`}`);
  head(["New vis.", "Sessions", "Google", "Direct", "404 new", "Days", "All new", "All Google"]);
  for (const m of months) { const r = ga4.monthly[m]; L.push(`  ${mLabel(m).padEnd(10)}${[int(r.newUsers), int(r.sessions), int(r.googleVisits), int(r.direct), int(r.new404), String(r.days), int(r.all.newUsers), int(r.all.googleVisits)].map((c) => c.padStart(11)).join("")}`); }
  L.push("");
  L.push("SHORT.IO · named links, all clicks");
  head(["Homepage", "Booking", "Midtown", "UES", "Other", "Total"]);
  for (const m of months) { const r = shortio.monthly[m]; L.push(`  ${mLabel(m).padEnd(10)}${(r ? [r.home, r.booking, r.midtown, r.ues, r.other, r.total].map(int) : Array(6).fill("—")).map((c) => c.padStart(11)).join("")}`); }
  L.push("");
  L.push(`INSTAGRAM CONTENT · ${metricool.content.length} reels and feed posts published ${mLabel(windows[2].months[0])} – ${mLabel(end)}, figures as read now; top 5 by views`);
  for (const p of metricool.content.slice(0, 5)) L.push(`  ${p.format.padEnd(5)} ${short(p.date).padEnd(7)} ${int(p.views).padStart(7)} views · ${int(p.reach).padStart(6)} reach · ${int(p.interactions).padStart(4)} interactions  ${p.title.slice(0, 50)}`);
  L.push("");
  L.push(`SELF-CHECK · ${checkWeek ? `week of ${short(checkWeek)} rebuilt from the monthly data, against the ledgers` : "no week to check"}`);
  L.push(...checks);
  if (metricool.warnings.length) { L.push(""); L.push("WARNINGS"); for (const w of metricool.warnings) L.push(`  ! ${w}`); }
  const text = L.join("\n");
  console.log("\n" + text);

  const dir = path.join(process.cwd(), "pulls", "review", clientId);
  fs.mkdirSync(dir, { recursive: true });
  const base = path.join(dir, end);
  fs.writeFileSync(`${base}.json`, JSON.stringify({ client: clientId, end, months, windows, readAt, checkWeek, checks, metricool, gsc, ga4, shortio }, null, 2));
  fs.writeFileSync(`${base}.txt`, text + "\n");
  console.log(`\nSaved ${base}.json and ${base}.txt`);
  if (checks.some((c) => c.includes("✗"))) { console.log("\nA check failed: send Claude the output before these figures are used."); process.exitCode = 1; }
}

main().catch((e) => fail(e.stack || String(e)));
