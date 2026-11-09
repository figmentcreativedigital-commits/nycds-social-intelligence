#!/usr/bin/env node
/* ==========================================================================
   ga4-pull.mjs · Google Analytics 4 for NYCDS, EEC and NYC Smile Pass
   --------------------------------------------------------------------------
   Run from the NYCDS repo root, in your own Terminal (Google's API is not
   reachable from Claude's sandbox):

     node scripts/ga4-pull.mjs                  last completed Mon–Sun week, NYCDS
                                                (with its Smile Pass section)
     node scripts/ga4-pull.mjs --client eec     same, EEC
     node scripts/ga4-pull.mjs --week 2026-11-02    a specific week (a Monday)
     node scripts/ga4-pull.mjs --record         also write this week into the ledger
     node scripts/ga4-pull.mjs --verify         check against the published figures
     node scripts/ga4-pull.mjs --discover       check access; save 5 weeks of raw
                                                reports to calibrate on

   HOW THE FIGURES ARE BUILT (checked Nov 3, 2026 against the published reports):
   - New visitors = newUsers by day in the property's time zone, summed
     Monday to Sunday (EEC and NYCDS properties run on New York time, the
     Smile Pass property on Los Angeles time; the reports always used them as
     they come). Sessions = the week's sessions as one figure.
   - Sources are session source / medium. "Seconds" for a source = engagement
     time ÷ sessions; "per active user" = engagement time ÷ active users.
   - Device shares are of active users. Landing-page counts leave out
     "(not set)". "Landings" and "views by landing page" are page views of
     sessions that started on that page.
   - Our own traffic is left out of every report for a client with
     excludeSources in its config (EEC: eec-prototype.vercel.app and
     figmentcreative.com, from November 9, 2026), by a session-source filter.
   - EEC scoreboard trend points older than the previous week come from
     scripts/ga4-ledger.json (figures as reported); the previous week is
     re-read and restated, as the EEC report does with GA4.

   Auth: the same Google service account as the Search Console pull
   (figment-reporting), key file at ~/.config/figment/google-reporting.json,
   outside the repo. GOOGLE_REPORTING_KEY_FILE in .env.local overrides the
   path. The account is a Viewer on each GA4 property, and the script asks for
   the read-only Analytics scope. The key is never printed.

   Properties are found by their web stream's address (Admin API). To skip
   the lookup, set GA4_NYCDS_PROPERTY, GA4_EEC_PROPERTY, GA4_SMILEPASS_PROPERTY
   in .env.local to the numeric property IDs (Admin → Property details).
   ========================================================================== */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const DEFAULT_TOKEN_URI = "https://oauth2.googleapis.com/token";

const CLIENTS = {
  nycds: { name: "NYC Dental Smiles", host: "nycdentalsmiles.com", idEnv: "GA4_NYCDS_PROPERTY", from: "2026-09-28" },
  /* excludeSources: our own traffic, left out of every report with a
     session-source filter (Walter, November 9, 2026). Visits through the
     review prototype and figmentcreative.com are Figment's, not the
     practice's audience. */
  eec: { name: "Edgard El Chaar, DDS, PC", host: "edgardelchaar.com", idEnv: "GA4_EEC_PROPERTY", from: "2026-09-28",
    excludeSources: ["eec-prototype.vercel.app", "figmentcreative.com"] },
  smilepass: { name: "NYC Smile Pass", host: "nycsmilepass.com", idEnv: "GA4_SMILEPASS_PROPERTY", from: "2026-07-01" },
};

/* Metrics per report. discover and the pull ask for the same lists, so the
   offline tests can replay the discover file. */
const ENG = ["sessions", "engagedSessions", "userEngagementDuration", "newUsers", "activeUsers", "screenPageViews"];
const M = {
  date: ENG, sourceMedium: ENG, totals: ENG,
  channel: ["sessions", "engagedSessions", "userEngagementDuration", "newUsers"],
  device: ["activeUsers", "newUsers", "sessions"],
  landingPage: ["sessions", "newUsers", "screenPageViews", "engagedSessions"],
  pageTitle: ["screenPageViews", "newUsers", "activeUsers"],
};

/* Published figures the discover summary prints beside its own (Nov 2 reports). */
const PUBLISHED = {
  eec: { newUsers: { "2026-09-28": 290, "2026-10-05": 393, "2026-10-12": 172, "2026-10-19": 294, "2026-10-26": 156 }, sessions: { "2026-10-05": 454, "2026-10-12": 233, "2026-10-19": 344, "2026-10-26": 204 } },
  nycds: { newUsers: { "2026-10-19": 3, "2026-10-26": 2 }, sessions: { "2026-10-19": 79, "2026-10-26": 64 } },
  smilepass: { newUsers: { "2026-10-19": 408, "2026-10-26": 266 } },
};

/* ------------------------------------------------------------------ setup */

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);

loadEnvLocal();
const DATA_API = (process.env.GA4_DATA_URL || "https://analyticsdata.googleapis.com/v1beta").replace(/\/$/, "");
const ADMIN_API = (process.env.GA4_ADMIN_URL || "https://analyticsadmin.googleapis.com/v1beta").replace(/\/$/, "");
const KEY_FILE = process.env.GOOGLE_REPORTING_KEY_FILE || path.join(os.homedir(), ".config", "figment", "google-reporting.json");
const shownKeyPath = KEY_FILE.startsWith(os.homedir()) ? `~${KEY_FILE.slice(os.homedir().length)}` : KEY_FILE;

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

function fail(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(2);
}

/* ------------------------------------------------------------------- auth */

function loadKey() {
  if (!fs.existsSync(KEY_FILE)) fail(`No key file at ${shownKeyPath}. It is the same key the Search Console pull uses.`);
  let key;
  try { key = JSON.parse(fs.readFileSync(KEY_FILE, "utf8")); } catch { fail(`${shownKeyPath} is not valid JSON.`); }
  if (key?.type !== "service_account" || !key.client_email || !key.private_key) fail(`${shownKeyPath} is not a service-account key.`);
  return key;
}

let cachedToken = null;
async function accessToken(key) {
  if (cachedToken) return cachedToken;
  const now = Math.floor(Date.now() / 1000);
  const enc = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const aud = key.token_uri || DEFAULT_TOKEN_URI;
  const unsigned = `${enc({ alg: "RS256", typ: "JWT" })}.${enc({ iss: key.client_email, scope: SCOPE, aud, iat: now, exp: now + 3600 })}`;
  const sig = crypto.sign("RSA-SHA256", Buffer.from(unsigned), key.private_key).toString("base64url");
  let res, body;
  try {
    res = await fetch(aud, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${sig}` }),
    });
    body = await res.json().catch(() => ({}));
  } catch (e) {
    fail(`Could not reach Google's sign-in service (${e.cause?.code || e.message}).`);
  }
  if (!res.ok || !body.access_token) {
    fail(`Google refused the service-account key (HTTP ${res.status}${body.error ? `, ${body.error}${body.error_description ? `: ${body.error_description}` : ""}` : ""}).`);
  }
  cachedToken = body.access_token;
  return cachedToken;
}

/* ------------------------------------------------------------------- http */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let requestCount = 0;
async function call(key, method, url, body) {
  const token = await accessToken(key);
  for (let attempt = 1; attempt <= 3; attempt++) {
    requestCount++;
    let res;
    try {
      res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (e) {
      if (attempt === 3) return { status: 0, json: null, text: String(e.cause?.code || e.message) };
      await sleep(1000 * attempt);
      continue;
    }
    if ((res.status === 429 || res.status >= 500) && attempt < 3) { await sleep(2000 * attempt); continue; }
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch { /* not JSON */ }
    return { status: res.status, json, text: text.slice(0, 700) };
  }
}
const disabled = (r) => r.status === 403 && /SERVICE_DISABLED|has not been used|is disabled/i.test(r.text);

/* ------------------------------------------------------------- properties */

/** Every property the account can see, with its web stream addresses. */
async function listProperties(key) {
  const r = await call(key, "GET", `${ADMIN_API}/accountSummaries?pageSize=200`);
  if (disabled(r)) return { adminDisabled: true, properties: [] };
  if (r.status !== 200) fail(`Could not list GA4 properties (HTTP ${r.status}): ${r.text}`);
  const props = (r.json?.accountSummaries ?? []).flatMap((a) => (a.propertySummaries ?? []).map((p) => ({
    id: p.property.replace("properties/", ""), name: p.displayName, account: a.displayName, streams: [],
  })));
  for (const p of props) {
    const s = await call(key, "GET", `${ADMIN_API}/properties/${p.id}/dataStreams?pageSize=50`);
    if (s.status === 200) p.streams = (s.json?.dataStreams ?? []).map((d) => d.webStreamData?.defaultUri).filter(Boolean);
  }
  return { adminDisabled: false, properties: props };
}
const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return String(u).replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, ""); } };

function resolveProperty(client, props) {
  if (process.env[client.idEnv]) return { id: process.env[client.idEnv].replace(/\D/g, ""), name: "(from .env.local)", streams: [] };
  return props.find((p) => p.streams.some((u) => hostOf(u) === client.host)) ?? null;
}

async function report(key, propertyId, body) {
  const rows = [];
  let meta = null;
  for (let offset = 0; ; offset += 100000) {
    const r = await call(key, "POST", `${DATA_API}/properties/${propertyId}:runReport`, { limit: 100000, offset, ...body });
    if (disabled(r)) fail("The Google Analytics Data API is not enabled in the service account's Cloud project. Enable it under APIs & Services → Library and run again.");
    if (r.status === 403) return { error: `HTTP 403: the account has no access to property ${propertyId}. Add it as a Viewer under Admin → Property access management.`, rows };
    if (r.status !== 200) return { error: `HTTP ${r.status}: ${r.text}`, rows };
    const j = r.json ?? {};
    meta = { dimensionHeaders: j.dimensionHeaders, metricHeaders: j.metricHeaders, rowCount: j.rowCount, metadata: j.metadata };
    rows.push(...(j.rows ?? []).map((x) => [...(x.dimensionValues ?? []).map((v) => v.value), ...(x.metricValues ?? []).map((v) => Number(v.value))]));
    if (!j.rowCount || rows.length >= j.rowCount) return { ...meta, rows };
  }
}

/* --------------------------------------------------------------- discover */

const DAY = 86400000;
const addDays = (d, n) => new Date(Date.parse(`${d}T00:00:00Z`) + n * DAY).toISOString().slice(0, 10);
const compact = (d) => d.replaceAll("-", "");

async function discover() {
  const key = loadKey();
  console.log(`Key file ${shownKeyPath}: service account ${key.client_email}`);
  await accessToken(key);
  console.log("✓ Google accepted the key for Analytics (read-only)");

  const { adminDisabled, properties } = await listProperties(key);
  if (adminDisabled) {
    const missing = Object.values(CLIENTS).filter((c) => !process.env[c.idEnv]);
    if (missing.length) {
      fail("The Google Analytics Admin API is not enabled, so the script cannot look up the property IDs. Either enable \"Google Analytics Admin API\" in the same Cloud project " +
        `(APIs & Services → Library), or add the numeric property IDs to .env.local: ${missing.map((c) => `${c.idEnv}=`).join(" ")} (GA4 Admin → Property details).`);
    }
  } else {
    console.log(`\nGA4 properties this account can see (${properties.length}):`);
    for (const p of properties) console.log(`  ${p.id.padEnd(11)} ${p.name.padEnd(34)} ${p.streams.join(", ") || "(no web stream)"}`);
  }

  const weeks = ["2026-09-28", "2026-10-05", "2026-10-12", "2026-10-19", "2026-10-26"];
  const end = addDays(weeks[4], 6);
  const out = { readAt: new Date().toISOString(), serviceAccount: key.client_email, properties, clients: {} };
  let missing = 0;

  for (const [id, client] of Object.entries(CLIENTS)) {
    console.log();
    const prop = resolveProperty(client, properties);
    if (!prop) {
      missing++;
      console.log(`✗ ${id}: no GA4 property with a web stream on ${client.host}. Add ${key.client_email} as a Viewer on it, or set ${client.idEnv} in .env.local.`);
      continue;
    }
    console.log(`✓ ${id}: property ${prop.id} · ${prop.name}`);
    const c = (out.clients[id] = { property: prop, data: {} });
    let failed = false;
    const q = async (label, body) => {
      const r = await report(key, prop.id, body);
      c.data[label] = { body, ...r };
      if (r.error && !failed) { console.log(`    ! ${label}: ${r.error}`); failed = true; }
      return r.rows;
    };
    const range = (a, b) => ({ dateRanges: [{ startDate: a, endDate: b }] });
    const dims = (...d) => d.map((name) => ({ name }));
    const mets = (...m) => m.map((name) => ({ name }));

    const daily = await q("date", { ...range(client.from, end), dimensions: dims("date"), metrics: mets(...M.date) });
    if (failed) { missing++; continue; }
    for (const w of weeks) {
      const r = { ...range(w, addDays(w, 6)) };
      await q(`sourceMedium:${w}`, { ...r, dimensions: dims("sessionSource", "sessionMedium"), metrics: mets(...M.sourceMedium) });
      await q(`channel:${w}`, { ...r, dimensions: dims("sessionDefaultChannelGroup"), metrics: mets(...M.channel) });
      await q(`device:${w}`, { ...r, dimensions: dims("deviceCategory"), metrics: mets(...M.device) });
      await q(`landingPage:${w}`, { ...r, dimensions: dims("landingPage"), metrics: mets(...M.landingPage) });
      await q(`pageTitle:${w}`, { ...r, dimensions: dims("pageTitle"), metrics: mets(...M.pageTitle) });
      await q(`totals:${w}`, { ...r, metrics: mets(...M.totals) });
    }
    if (id === "smilepass") {
      await q("sourceMedium:since-launch", { ...range(client.from, end), dimensions: dims("sessionSource", "sessionMedium"), metrics: mets(...M.sourceMedium) });
      await q("campaign:since-launch", { ...range(client.from, end), dimensions: dims("sessionSource", "sessionMedium", "sessionCampaignName"), metrics: mets("sessions", "newUsers") });
      await q("totals:since-launch", { ...range(client.from, end), metrics: mets(...M.totals) });
    }

    // Weekly summary beside the published figures.
    const idx = (name) => ["date", ...M.date].indexOf(name);
    for (const w of weeks) {
      const R = daily.filter((r) => r[0] >= compact(w) && r[0] <= compact(addDays(w, 6)));
      const nu = R.reduce((t, r) => t + r[idx("newUsers")], 0);
      const se = R.reduce((t, r) => t + r[idx("sessions")], 0);
      const tot = c.data[`totals:${w}`]?.rows?.[0];
      const pub = PUBLISHED[id] || {};
      const pn = pub.newUsers?.[w], ps = pub.sessions?.[w];
      console.log(`    week of ${w}: new users ${nu}${pn !== undefined ? ` (published ${pn})${nu === pn ? " ✓" : ""}` : ""} · sessions ${tot ? tot[0] : se}${ps !== undefined ? ` (published ${ps})${(tot ? tot[0] : se) === ps ? " ✓" : ""}` : ""}`);
    }
    const meta = c.data["date"]?.metadata;
    if (meta?.subjectToThresholding || meta?.dataLossFromOtherRow) console.log(`    ! GA flags this report: ${meta.subjectToThresholding ? "subject to thresholding " : ""}${meta.dataLossFromOtherRow ? "(other) row" : ""}`);
  }

  const dir = path.join(process.cwd(), "pulls", "ga4");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `discover-${out.readAt.slice(0, 10)}.json`);
  fs.writeFileSync(file, JSON.stringify(out, null, 1) + "\n");
  console.log(`\nSaved ${path.relative(process.cwd(), file)} (${requestCount} requests). It holds site traffic data and stays local (pulls/ is gitignored).`);
  if (missing) process.exit(1);
}

/* ------------------------------------------------------------------ dates */

const nyToday = () => process.env.GA4_TODAY || // GA4_TODAY: offline tests only
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const weekday = (d) => new Date(Date.parse(`${d}T00:00:00Z`)).getUTCDay();
const lastCompletedMonday = () => { const t = nyToday(); return addDays(t, -((weekday(t) + 6) % 7) - 7); };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const short = (d) => `${MONTHS[+d.slice(5, 7) - 1]} ${+d.slice(8, 10)}`;
const long = (d) => `${LONG[+d.slice(5, 7) - 1]} ${+d.slice(8, 10)}`;
const range = (mon) => {
  const sun = addDays(mon, 6);
  return mon.slice(5, 7) === sun.slice(5, 7) ? `${short(mon)} – ${+sun.slice(8, 10)}` : `${short(mon)} – ${short(sun)}`;
};
const isoOf = (c) => `${c.slice(0, 4)}-${c.slice(4, 6)}-${c.slice(6, 8)}`;

/* ------------------------------------------------------------- arithmetic */

const MINUS = "−";
const rnd = (n, dp) => { const f = 10 ** dp; return Math.round((n + Math.sign(n) * Number.EPSILON) * f) / f; };
const int = (n) => Math.round(n).toLocaleString("en-US");
const pct = (a, b) => (b ? (100 * a) / b : null);
const sumBy = (rows, f) => rows.reduce((t, r) => t + f(r), 0);

/** A report's rows as objects keyed by header name. */
function objects(rep) {
  const names = [...(rep.dimensionHeaders ?? []), ...(rep.metricHeaders ?? [])].map((h) => h.name);
  return rep.rows.map((r) => Object.fromEntries(names.map((n, i) => [n, r[i]])));
}

/* How sources are grouped. Each rule is checked against the published reports. */
const isCC = (s) => /constantcontact|conta\.cc/i.test(s.sessionSource);
const isBio = (s) => /linkinbio|linkin\.bio|linktr\.ee/i.test(s.sessionSource);
const isDirect = (s) => s.sessionSource === "(direct)";
const isNotSet = (s) => s.sessionSource === "(not set)";
const isGoogle = (s) => s.sessionSource === "google" && s.sessionMedium === "organic";
const UNPAID_SOCIAL = (s) => (s.sessionMedium === "social") || (s.sessionMedium === "referral" && /(^|\.)(facebook|instagram)\.com$/i.test(s.sessionSource));
const SP_GROUPS = [
  { label: "Instagram ads", test: (s) => s.sessionSource === "ig" && s.sessionMedium === "paid", shown: true },
  { label: "Audience Network ads", test: (s) => s.sessionSource === "an" && s.sessionMedium === "paid", shown: true },
  { label: "Facebook ads", test: (s) => s.sessionSource === "fb" && s.sessionMedium === "paid", shown: true },
  { label: "Direct", test: isDirect, shown: true },
  { label: "Google search", test: isGoogle, shown: true },
  { label: "Instagram and Facebook, unpaid", test: UNPAID_SOCIAL, shown: true },
  { label: "Threads ads", test: (s) => s.sessionSource === "th" && s.sessionMedium === "paid" },
  { label: "Bing", test: (s) => s.sessionSource === "bing" },
  { label: "the unassigned group", test: isNotSet },
  { label: "Yahoo", test: (s) => s.sessionSource === "yahoo" },
];
const LANDING_LABELS = {
  nycds: { "/": "Homepage", "/ourdoctors": "Meet Our Dentists", "/locations": "Locations", "/comprehensive-care": "Comprehensive Care", "/orthodontics": "Orthodontics", "/services": "Services", "/about": "About" },
};
const titleCase = (slug) => slug.split("-").filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
const landingLabel = (client, p) => LANDING_LABELS[client]?.[p] ?? (p.match(/^\/(?:doctors\/)?dr-([a-z-]+)/i) ? `Dr. ${titleCase(p.match(/^\/(?:doctors\/)?dr-([a-z-]+)/i)[1])}` : titleCase(p.split("/").filter(Boolean).pop() || "Homepage"));

/* ------------------------------------------------------------------- pull */

async function pull(clientId, mon) {
  const key = loadKey();
  const { adminDisabled, properties } = await listProperties(key);
  const propFor = (id) => {
    const p = resolveProperty(CLIENTS[id], properties);
    if (!p) fail(adminDisabled ? `Set ${CLIENTS[id].idEnv} in .env.local, or enable the Google Analytics Admin API.` : `No GA4 property with a web stream on ${CLIENTS[id].host} is visible to ${key.client_email}. Add it as a Viewer, or run --discover.`);
    return p;
  };
  const weeks = Array.from({ length: 5 }, (_, i) => addDays(mon, -7 * (4 - i)));
  const prev = weeks[3];
  const sun = (w) => addDays(w, 6);
  const raw = {};
  const run = async (id, prop, label, a, b, dims, metrics) => {
    const ex = CLIENTS[id].excludeSources ?? [];
    const filter = ex.length ? { dimensionFilter: { notExpression: { filter: { fieldName: "sessionSource", inListFilter: { values: ex, caseSensitive: false } } } } } : {};
    const body = { dateRanges: [{ startDate: a, endDate: b }], ...(dims.length ? { dimensions: dims.map((name) => ({ name })) } : {}), metrics: metrics.map((name) => ({ name })), ...filter };
    const r = await report(key, prop.id, body);
    raw[`${id}:${label}`] = { property: prop.id, body, ...r };
    if (r.error) fail(`GA4 report "${label}" failed for ${CLIENTS[id].host}: ${r.error}`);
    return objects(r);
  };
  const out = { clientId, mon, weeks, readAt: new Date().toISOString(), excludedSources: CLIENTS[clientId].excludeSources ?? [], byWeek: {}, raw, warnings: [] };
  const prop = propFor(clientId);
  out.property = { id: prop.id, name: prop.name };

  const daily = await run(clientId, prop, "date", weeks[0], sun(mon), ["date"], M.date);
  out.daily = daily;
  for (const w of weeks) {
    const R = daily.filter((r) => isoOf(r.date) >= w && isoOf(r.date) <= sun(w));
    out.byWeek[w] = { newUsers: sumBy(R, (r) => r.newUsers), dailySessions: sumBy(R, (r) => r.sessions) };
  }
  const weeksDetailed = clientId === "eec" ? weeks : [prev, mon];
  for (const w of weeksDetailed) {
    out.byWeek[w].sources = await run(clientId, prop, `sourceMedium:${w}`, w, sun(w), ["sessionSource", "sessionMedium"], M.sourceMedium);
    out.byWeek[w].googleVisits = sumBy(out.byWeek[w].sources.filter(isGoogle), (r) => r.sessions);
  }
  for (const w of [prev, mon]) {
    const b = out.byWeek[w];
    b.totals = (await run(clientId, prop, `totals:${w}`, w, sun(w), [], M.totals))[0] ?? {};
    b.devices = await run(clientId, prop, `device:${w}`, w, sun(w), ["deviceCategory"], M.device);
    b.landing = await run(clientId, prop, `landingPage:${w}`, w, sun(w), ["landingPage"], M.landingPage);
    if (clientId === "eec") b.titles = await run(clientId, prop, `pageTitle:${w}`, w, sun(w), ["pageTitle"], M.pageTitle);
  }
  if (clientId === "nycds") {
    const sp = propFor("smilepass");
    const launch = CLIENTS.smilepass.from;
    const spDaily = await run("smilepass", sp, "date", launch, sun(mon), ["date"], M.date);
    const spSources = await run("smilepass", sp, "sourceMedium:since-launch", launch, sun(mon), ["sessionSource", "sessionMedium"], M.sourceMedium);
    out.smilepass = { property: { id: sp.id, name: sp.name }, daily: spDaily, sources: spSources };
  }
  return out;
}

/* ----------------------------------------------------------------- render */

const ROWS = {
  eec: [
    { key: "newUsers", k: "Website new visitors", fmt: "int", change: "pct1" },
    { key: "googleVisits", k: "Visits from Google search", fmt: "int", change: "pct1" },
  ],
};
function change(kind, cur, prev) {
  if (cur === null || prev === null || cur === undefined || prev === undefined || !prev) return "";
  const d = cur - prev;
  const p = kind === "pct1" ? rnd((Math.abs(d) / prev) * 100, 1).toFixed(1) : Math.round((Math.abs(d) / prev) * 100);
  return +p === 0 ? (kind === "pct1" ? "0.0%" : "0%") : `${d > 0 ? "+" : MINUS}${p}%`;
}

function loadLedger() {
  const p = path.join(SCRIPT_DIR, "ga4-ledger.json");
  if (!fs.existsSync(p)) fail("scripts/ga4-ledger.json is missing. It ships with this script; restore it from git.");
  return { p, ledger: JSON.parse(fs.readFileSync(p, "utf8")) };
}

function trends(pull, ledger) {
  const book = ledger[pull.clientId] || {};
  const out = {}, sources = {}, drift = [];
  for (const row of ROWS[pull.clientId] || []) {
    out[row.key] = []; sources[row.key] = [];
    pull.weeks.forEach((w, i) => {
      const fresh = pull.byWeek[w][row.key] ?? null;
      const kept = book[w]?.[row.key];
      let v, src;
      if (i >= 3) { v = fresh; src = i === 4 ? "this pull" : "re-read"; }
      else if (kept !== undefined) { v = kept; src = "ledger"; }
      else { v = fresh; src = "re-read (not in ledger)"; }
      if (i < 4 && kept !== undefined && fresh !== null && fresh !== kept) drift.push(`${row.k}, week of ${short(w)}: reported ${int(kept)}, today ${int(fresh)}${src === "ledger" ? " (reported figure kept)" : " (restated)"}`);
      out[row.key].push(v); sources[row.key].push(src);
    });
  }
  return { out, sources, drift };
}

const engagement = (rows) => {
  const s = sumBy(rows, (r) => r.sessions), e = sumBy(rows, (r) => r.engagedSessions), t = sumBy(rows, (r) => r.userEngagementDuration);
  return { sessions: s, engaged: e, rate: s ? rnd(pct(e, s), 1) : null, seconds: s ? t / s : null };
};
const deviceSplit = (devs) => {
  const au = sumBy(devs, (r) => r.activeUsers);
  const share = (c) => (au ? Math.round(pct(sumBy(devs.filter((r) => r.deviceCategory === c), (r) => r.activeUsers), au)) : 0);
  return { desktop: share("desktop"), mobile: share("mobile"), tablet: share("tablet") };
};
const realLanding = (rows) => rows.filter((r) => r.landingPage && r.landingPage !== "(not set)");

function render(pull, ledger) {
  const { clientId, mon, weeks, byWeek } = pull;
  const prev = weeks[3];
  const cur = byWeek[mon], pre = byWeek[prev];
  const L = [];
  const p = (s = "") => L.push(s);
  const sessions = (b) => b.totals.sessions ?? b.dailySessions;
  p(`GA4 pull · ${CLIENTS[clientId].name} · property ${pull.property.id} (${pull.property.name})`);
  p(`Week: ${range(mon)}, ${mon.slice(0, 4)} · Monday to Sunday in the property's time zone · against ${range(prev)}`);
  p(`Read: ${new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" }).format(new Date(pull.readAt))} New York. GA keeps processing for a few days: sessions can still move by 1 or 2.`);
  if (pull.excludedSources?.length) p(`Our own traffic left out of every figure: ${pull.excludedSources.join(", ")}.`);
  p();
  p("TOTALS");
  p(`  Sessions          ${int(sessions(cur)).padStart(6)}   from ${int(sessions(pre))}`);
  p(`  New visitors      ${int(cur.newUsers).padStart(6)}   from ${int(pre.newUsers)}`);
  p(`  Active users      ${int(cur.totals.activeUsers ?? 0).padStart(6)}   from ${int(pre.totals.activeUsers ?? 0)}`);
  const perUser = (b) => (b.totals.activeUsers ? b.totals.userEngagementDuration / b.totals.activeUsers : null);
  p(`  Engagement time   ${(perUser(cur) ?? 0).toFixed(1).padStart(6)}s  per active user, from ${(perUser(pre) ?? 0).toFixed(1)}s`);

  if (clientId === "eec") {
    const { out: T, sources, drift } = trends(pull, ledger);
    p();
    p("SCOREBOARD · Website group; replace each row's cells and trend, keep its note");
    p(`  weeks: [${weeks.map((w) => `"${short(w)}"`).join(", ")}]`);
    for (const row of ROWS.eec) {
      const t = T[row.key], c = t[4], v = t[3];
      p(`  k: "${row.k}"`);
      p(`    trend: [${t.join(", ")}],`);
      p(`    cells: [{ v: "${int(c)}", c: "${change(row.change, c, v)}", dir: "${c > v ? "up" : c < v ? "down" : "flat"}" }, { v: "${int(v)}", c: "", dir: "flat" }],`);
    }
    p("  TREND SOURCES");
    for (const row of ROWS.eec) p(`    ${row.k.padEnd(26)}${sources[row.key].join(" · ")}`);

    const days = Array.from({ length: 14 }, (_, i) => addDays(prev, i));
    const dmap = new Map(pull.daily.map((r) => [isoOf(r.date), r.newUsers]));
    p();
    p("PERIOD CHART · period_.daily, new visitors each day");
    p(`    daily: [\n${days.map((d, i) => `      { d: "${short(d)}", v: ${dmap.get(d) ?? 0}${i < 7 ? ", shade: true" : ""} },`).join("\n")}\n    ],`);

    const groups = (b) => {
      const direct = b.sources.filter(isDirect), google = b.sources.filter(isGoogle);
      const other = b.sources.filter((r) => !isDirect(r) && !isGoogle(r) && !isNotSet(r));
      return { direct: engagement(direct), google: engagement(google), other: engagement(other), otherRows: other };
    };
    const g = groups(cur), gp = groups(pre);
    p();
    p("VISITS THAT ENGAGED · engagement.rows (seconds = engagement time ÷ sessions)");
    p(`    rows: [\n      { label: "Direct", sessions: ${g.direct.sessions}, engaged: ${g.direct.engaged}, seconds: ${Math.round(g.direct.seconds ?? 0)} },\n      { label: "Google search", sessions: ${g.google.sessions}, engaged: ${g.google.engaged}, seconds: ${Math.round(g.google.seconds ?? 0)} },\n      { label: "Other sources", sessions: ${g.other.sessions}, engaged: ${g.other.engaged}, seconds: ${Math.round(g.other.seconds ?? 0)} },\n    ],`);
    p(`  Other sources: ${g.otherRows.sort((a, b) => b.sessions - a.sessions).map((r) => `${r.sessionSource} / ${r.sessionMedium} ${r.sessions} sessions, ${r.engagedSessions} engaged, ${(r.sessions ? r.userEngagementDuration / r.sessions : 0).toFixed(1)}s`).join(" · ") || "none"}`);
    const ns = cur.sources.filter(isNotSet);
    if (ns.length) p(`  Source not set: ${sumBy(ns, (r) => r.sessions)} sessions (left out of the 3 rows)`);

    const cc = (b) => sumBy(b.sources.filter(isCC), (r) => r.sessions), bio = (b) => sumBy(b.sources.filter(isBio), (r) => r.sessions);
    const busiest = days.slice(7).reduce((best, d) => ((dmap.get(d) ?? 0) > (dmap.get(best) ?? 0) ? d : best), days[7]);
    const lpViews = (b, path) => sumBy(b.landing.filter((r) => r.landingPage === path), (r) => r.screenPageViews);
    const dv = deviceSplit(cur.devices), dvp = deviceSplit(pre.devices);
    const n404 = (b) => sumBy((b.titles || []).filter((r) => /^404\b/i.test(r.pageTitle)), (r) => r.newUsers);
    const eng = (x) => `${x.rate?.toFixed(1)}% · ${Math.round(x.seconds ?? 0)} seconds average`;
    p();
    p("DETAIL · website panel rows");
    p(`  ["Sessions", "${int(sessions(cur))} · from ${int(sessions(pre))}"],`);
    p(`  ["New visitors", "${int(cur.newUsers)} · from ${int(pre.newUsers)}"],`);
    p(`  ["Direct visits", "${g.direct.sessions} · from ${gp.direct.sessions}"],`);
    p(`  ["Direct visitors engaged", "${eng(g.direct)} · from ${gp.direct.rate?.toFixed(1)}% and ${Math.round(gp.direct.seconds ?? 0)} seconds"],`);
    p(`  ["Visits from Google search", "${g.google.sessions} · from ${gp.google.sessions}"],`);
    p(`  ["Google visitors engaged", "${eng(g.google)} · from ${gp.google.rate?.toFixed(1)}% and ${Math.round(gp.google.seconds ?? 0)} seconds"],`);
    p(`  ["Visits from Constant Contact", "${cc(cur)} · from ${cc(pre) || "none"}"],`);
    p(`  ["Visits from the Instagram bio link", "${bio(cur)} · from ${bio(pre) || "none"}"],`);
    p(`  ["Busiest day", "${long(busiest)} · ${dmap.get(busiest) ?? 0} new visitors"],`);
    p(`  ["Landing pages", "${realLanding(cur.landing).length} · from ${realLanding(pre.landing).length}"],`);
    p(`  ["Homepage landings", "${lpViews(cur, "/")} · from ${lpViews(pre, "/")}"],`);
    p(`  ["Our Doctors landings", "${lpViews(cur, "/our-doctors")} · from ${lpViews(pre, "/our-doctors")}"],`);
    p(`  ["Desktop / mobile", "${dv.desktop}% / ${dv.mobile}% · from ${dvp.desktop}% / ${dvp.mobile}%"],`);
    p(`  New users reaching the 404 page: ${n404(cur)} · from ${n404(pre)}`);
    p(`  Precise: Direct ${g.direct.engaged} of ${g.direct.sessions} engaged, ${(g.direct.seconds ?? 0).toFixed(1)}s · Google ${g.google.engaged} of ${g.google.sessions}, ${(g.google.seconds ?? 0).toFixed(1)}s · week before Direct ${(gp.direct.seconds ?? 0).toFixed(1)}s, Google ${(gp.google.seconds ?? 0).toFixed(1)}s`);
    if (drift.length) { p(); p("DRIFT · today's reading against the ledger (informational)"); for (const d of drift) p(`  ${d}`); }
  }

  if (clientId === "nycds") {
    const label = (r) => isNotSet(r) ? "Source not recorded" : isDirect(r) ? "Direct" : isCC(r) ? "Constant Contact"
      : r.sessionMedium === "organic" ? `${titleCase(r.sessionSource)} — organic` : null;
    const srcRows = (b) => {
      const m = new Map();
      for (const r of b.sources) { const l = label(r); if (l) m.set(l, (m.get(l) ?? 0) + r.sessions); }
      return [...m.entries()].sort((a, c) => c[1] - a[1]);
    };
    const referrals = (b) => sumBy(b.sources.filter((r) => !label(r)), (r) => r.sessions);
    const dv = deviceSplit(cur.devices);
    const notSet = (b) => sumBy(b.sources.filter(isNotSet), (r) => r.sessions);
    p(`  Source not recorded ${notSet(cur)} of ${int(sessions(cur))} (${Math.round(pct(notSet(cur), sessions(cur)))}%) · from ${notSet(pre)} of ${int(sessions(pre))}`);
    p();
    p("DETAIL · detail.website");
    p(`      kv: [\n        { k: "Sessions", v: "${int(sessions(cur))}" },\n        { k: "Desktop", v: "${dv.desktop}%" },\n        { k: "Mobile", v: "${dv.mobile}%" },\n      ],`);
    p(`      sources: [\n${srcRows(cur).map(([l, v]) => `        { label: "${l}", value: ${v} },`).join("\n")}\n      ],`);
    p(`      deviceSplit: [\n        { label: "Desktop", pct: ${dv.desktop} },\n        { label: "Mobile", pct: ${dv.mobile} },\n      ],`);
    const lp = realLanding(cur.landing).sort((a, b) => b.screenPageViews - a.screenPageViews || b.sessions - a.sessions).slice(0, 5);
    p(`      landing: [\n${lp.map((r) => `        { label: "${landingLabel("nycds", r.landingPage)}", value: ${r.screenPageViews} }, // ${r.landingPage}`).join("\n")}\n      ],`);
    p(`  Further sessions from other referrals: ${referrals(cur)} (${cur.sources.filter((r) => !label(r)).map((r) => r.sessionSource).join(", ") || "none"})`);

    const sp = pull.smilepass;
    const launch = CLIENTS.smilepass.from, end = addDays(mon, 6);
    const n = Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${launch}T00:00:00Z`)) / DAY) + 1;
    const days = Array.from({ length: n }, (_, i) => addDays(launch, i));
    const dm = new Map(sp.daily.map((r) => [isoOf(r.date), r.newUsers]));
    const total = sumBy(sp.daily, (r) => r.newUsers);
    const inWeek = (w) => sumBy(days.filter((d) => d >= w && d <= addDays(w, 6)), (d) => dm.get(d) ?? 0);
    const camp = sumBy(days.filter((d) => d >= "2026-08-11" && d <= "2026-08-30"), (d) => dm.get(d) ?? 0);
    const allSessions = sumBy(sp.sources, (r) => r.sessions);
    const grouped = SP_GROUPS.map((g) => ({ ...g, sessions: sumBy(sp.sources.filter(g.test), (r) => r.sessions) }));
    const ungrouped = sp.sources.filter((r) => !SP_GROUPS.some((g) => g.test(r)));
    p();
    p(`SMILE PASS · property ${sp.property.id} (${sp.property.name}) · ${short(launch)} – ${short(end)}`);
    p(`  New visitors since launch ${int(total)} · this week ${inWeek(mon)} · week before ${inWeek(prev)} · Aug 11 – 30 campaign ${int(camp)} · sessions ${int(allSessions)}`);
    p(`    kv: { k: "New website visitors", v: "${int(total)}" },`);
    p(`    daily: [`);
    for (let i = 0; i < days.length; i += 6) p(`      ${days.slice(i, i + 6).map((d) => `{ d: "${short(d)}", v: ${dm.get(d) ?? 0} }`).join(", ")},`);
    p(`    ],`);
    p(`    dailyChart band: { from: ${days.indexOf("2026-08-11")}, to: ${days.indexOf("2026-08-30")}, label: "August campaign" }`);
    p(`    sources table rows (Source / Visits / Share of ${int(allSessions)}):`);
    for (const g of grouped.filter((g) => g.shown)) p(`          ["${g.label}", "${int(g.sessions)}", "${rnd(pct(g.sessions, allSessions), 1).toFixed(1)}%"],`);
    p(`    Not shown: ${grouped.filter((g) => !g.shown).map((g) => `${g.label} (${g.sessions})`).join(", ")}${ungrouped.length ? `; other: ${ungrouped.map((r) => `${r.sessionSource} / ${r.sessionMedium} ${r.sessions}`).join(", ")}` : ""}`);
  }

  if (pull.warnings.length) { p(); p("WARNINGS"); for (const w of pull.warnings) p(`  ! ${w}`); }
  return L.join("\n");
}

function save(pull, text) {
  const dir = path.join(process.cwd(), "pulls", "ga4", pull.clientId);
  fs.mkdirSync(dir, { recursive: true });
  const base = path.join(dir, `${pull.mon}_${addDays(pull.mon, 6)}`);
  fs.writeFileSync(`${base}.txt`, text + "\n");
  fs.writeFileSync(`${base}.json`, JSON.stringify(pull, null, 1) + "\n");
  return path.relative(process.cwd(), base);
}

function record(pull, file, ledger) {
  const book = (ledger[pull.clientId] ||= {});
  const keep = (b) => ({ newUsers: b.newUsers, sessions: b.totals?.sessions ?? b.dailySessions, ...(b.googleVisits !== undefined ? { googleVisits: b.googleVisits } : {}) });
  const prev = pull.weeks[3];
  book[pull.mon] = { ...keep(pull.byWeek[pull.mon]), source: `ga4-pull ${pull.readAt}` };
  book[prev] = { ...(book[prev] || {}), ...keep(pull.byWeek[prev]), restated: `ga4-pull ${pull.readAt}` };
  ledger[pull.clientId] = Object.fromEntries(Object.entries(book).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(file, JSON.stringify(ledger, null, 2) + "\n");
}

/* ------------------------------------------------------------------ verify */

/* Published Nov 2, reproduced by the Nov 3 discover run. Visitor counts are
   exact; sessions settle by 1 or 2 for a few days, so they get that much room. */
const VERIFY = {
  eec: {
    newUsers: [290, 393, 172, 294, 156], googleVisits: [103, 85, 99, 83, 64], sessions: [null, 454, 233, 344, 204],
    week: { direct: [131, 26], google: [64, 42], other: [9, 5], homepage: 177, ourDoctors: 18, landingPages: 32, n404: 60, activeUsers: 168, desktop: 68 },
  },
  nycds: {
    newUsers: [null, null, null, 3, 2], sessions: [null, null, null, null, 64],
    week: { notSet: 28, google: 16, direct: 13, desktop: 66, ourdoctors: 41 },
    smilepass: { total: 3141, week: 266, prev: 408, ig: 1682, fb: 484, direct: 249, google: 103, unpaid: 53 },
  },
};

async function verify() {
  const lines = [];
  let failures = 0;
  const p = (s = "") => { lines.push(s); console.log(s); };
  const check = (ok, label, detail = "") => { if (!ok) failures++; p(`  ${ok ? "✓" : "✗"} ${label}${detail ? `  ${detail}` : ""}`); };
  const mon = "2026-10-26";
  const near = (a, b, t) => a !== null && a !== undefined && Math.abs(a - b) <= t;
  p("GA4 --verify · Sep 28 – Nov 1, 2026 against the published figures");
  for (const clientId of ["eec", "nycds"]) {
    const v = VERIFY[clientId];
    const r = await pull(clientId, mon);
    const W = r.weeks, cur = r.byWeek[mon];
    p();
    p(`${CLIENTS[clientId].name} · property ${r.property.id}`);
    const series = (k) => W.map((w) => (k === "sessions" ? r.byWeek[w].totals?.sessions ?? r.byWeek[w].dailySessions : r.byWeek[w][k] ?? null));
    const cmp = (k, tol) => { const got = series(k); const ok = v[k].every((want, i) => want === null || near(got[i], want, tol)); check(ok, k.padEnd(13), `[${got.map((x) => x ?? "—").join(", ")}]${ok ? "" : ` want [${v[k].join(", ")}]`}`); };
    cmp("newUsers", 0);
    if (v.googleVisits) cmp("googleVisits", 0);
    cmp("sessions", 2);
    const w = v.week;
    const dv = deviceSplit(cur.devices);
    if (clientId === "eec") {
      const direct = engagement(cur.sources.filter(isDirect)), google = engagement(cur.sources.filter(isGoogle));
      const other = engagement(cur.sources.filter((x) => !isDirect(x) && !isGoogle(x) && !isNotSet(x)));
      const lp = (path) => sumBy(cur.landing.filter((x) => x.landingPage === path), (x) => x.screenPageViews);
      const n404 = sumBy(cur.titles.filter((x) => /^404\b/i.test(x.pageTitle)), (x) => x.newUsers);
      check(near(direct.sessions, w.direct[0], 2) && direct.engaged === w.direct[1] && google.sessions === w.google[0] && google.engaged === w.google[1] && other.sessions === w.other[0] && other.engaged === w.other[1],
        "visits that engaged", `Direct ${direct.sessions}/${direct.engaged} ${(direct.seconds ?? 0).toFixed(1)}s · Google ${google.sessions}/${google.engaged} ${(google.seconds ?? 0).toFixed(1)}s · Other ${other.sessions}/${other.engaged} ${(other.seconds ?? 0).toFixed(1)}s`);
      check(lp("/") === w.homepage && lp("/our-doctors") === w.ourDoctors && realLanding(cur.landing).length === w.landingPages && n404 === w.n404 && near(cur.totals.activeUsers, w.activeUsers, 1) && dv.desktop === w.desktop,
        "website panel", `homepage ${lp("/")} · our doctors ${lp("/our-doctors")} · ${realLanding(cur.landing).length} landing pages · 404 ${n404} · active ${cur.totals.activeUsers} · desktop ${dv.desktop}%`);
    } else {
      const s = (f) => sumBy(cur.sources.filter(f), (x) => x.sessions);
      const od = sumBy(cur.landing.filter((x) => x.landingPage === "/ourdoctors"), (x) => x.screenPageViews);
      check(s(isNotSet) === w.notSet && s(isGoogle) === w.google && s(isDirect) === w.direct && dv.desktop === w.desktop && od === w.ourdoctors,
        "website panel", `not recorded ${s(isNotSet)} · Google ${s(isGoogle)} · Direct ${s(isDirect)} · desktop ${dv.desktop}% · Meet Our Dentists ${od}`);
      const sp = r.smilepass, e = v.smilepass;
      const total = sumBy(sp.daily, (x) => x.newUsers);
      const inW = (a) => sumBy(sp.daily.filter((x) => isoOf(x.date) >= a && isoOf(x.date) <= addDays(a, 6)), (x) => x.newUsers);
      const g = (label) => sumBy(sp.sources.filter(SP_GROUPS.find((x) => x.label === label).test), (x) => x.sessions);
      check(total === e.total && inW(mon) === e.week && inW(W[3]) === e.prev, "smile pass visitors", `${total} since launch · ${inW(mon)} · ${inW(W[3])}`);
      check(g("Instagram ads") === e.ig && g("Facebook ads") === e.fb && g("Direct") === e.direct && g("Google search") === e.google && g("Instagram and Facebook, unpaid") === e.unpaid,
        "smile pass sources", `Instagram ads ${g("Instagram ads")} · Facebook ads ${g("Facebook ads")} · Direct ${g("Direct")} · Google ${g("Google search")} · unpaid social ${g("Instagram and Facebook, unpaid")} · Audience Network ${g("Audience Network ads")}`);
    }
    const dir = path.join(process.cwd(), "pulls", "ga4");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `verify_${clientId}.json`), JSON.stringify(r.raw, null, 1) + "\n");
  }
  p();
  p(failures ? `✗ ${failures} check(s) failed. Attach pulls/ga4/verify.txt and the verify_*.json files.` : "✓ All checks passed. The pull reproduces the published figures.");
  fs.writeFileSync(path.join(process.cwd(), "pulls", "ga4", "verify.txt"), lines.join("\n") + "\n");
  process.exit(failures ? 1 : 0);
}

/* -------------------------------------------------------------------- main */

async function main() {
  if (flag("--discover")) return discover();
  if (flag("--verify")) return verify();
  const opt = (n) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : null; };
  const clientId = (opt("--client") || "nycds").toLowerCase();
  if (!["nycds", "eec"].includes(clientId)) fail(`Unknown client "${clientId}". Use nycds (includes Smile Pass) or eec.`);
  const mon = opt("--week") || lastCompletedMonday();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(mon) || weekday(mon) !== 1) fail(`--week must be a Monday as YYYY-MM-DD (got ${mon}).`);
  if (addDays(mon, 7) > nyToday()) fail(`The week of ${short(mon)} has not closed yet.`);
  const { p: file, ledger } = loadLedger();
  const result = await pull(clientId, mon);
  const text = render(result, ledger);
  console.log(text);
  console.log(`\nSaved ${save(result, text)}.txt and .json (${requestCount} requests).`);
  if (flag("--record")) {
    record(result, file, ledger);
    console.log(`Ledger updated: ${range(mon)} recorded, ${range(result.weeks[3])} restated. Commit scripts/ga4-ledger.json with the cycle.`);
  } else {
    console.log("Ledger not updated. Run again with --record once these are the figures going into the report.");
  }
}

main().catch((e) => fail(e.stack || String(e)));
