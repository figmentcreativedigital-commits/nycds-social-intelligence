#!/usr/bin/env node
/* ==========================================================================
   gsc-pull.mjs · Google Search Console for NYCDS, EEC and NYC Smile Pass
   --------------------------------------------------------------------------
   Run from the NYCDS repo root, in your own Terminal (Google's API is not
   reachable from Claude's sandbox):

     node scripts/gsc-pull.mjs                  last completed Mon–Sun week, NYCDS
                                                (with its Smile Pass section)
     node scripts/gsc-pull.mjs --client eec     same, EEC
     node scripts/gsc-pull.mjs --week 2026-11-02    a specific week (a Monday)
     node scripts/gsc-pull.mjs --record         also write this week into the ledger
     node scripts/gsc-pull.mjs --verify         check against the published figures
     node scripts/gsc-pull.mjs --discover       check access; save 5 weeks of raw
                                                responses to calibrate on

   Auth: a Google service account (figment-reporting), key file at
   ~/.config/figment/google-reporting.json, outside the repo so it can never
   be committed. GOOGLE_REPORTING_KEY_FILE in .env.local overrides the path.
   The account has Restricted (read-only) access on each property, and the
   script asks for the read-only scope. The key is never printed.

   HOW THE FIGURES ARE BUILT (each checked Nov 3, 2026 against every published
   trend point, Sep 28 – Nov 1):
   - Totals are the property's daily rows (the Chart.csv export), summed
     Monday to Sunday. Search Console days run on Pacific time; the reports
     have always used them as they come. Fresh data is included (dataState
     "all"), as the dashboard export does, so the last days of a week pulled
     on Monday can still rise: Oct 26 – Nov 1 read 1,496 impressions for NYCDS
     on Nov 2 and 1,499 on Nov 3.
   - Average position is weighted by impressions. NYCDS uses all searches;
     EEC uses US searches only (the Countries.csv figure).
   - Pages and queries are Google's per-page and per-query rows. The query
     rows are a sample: Google withholds rare queries, so they are never
     summed into a total.
   - NYCDS doctor page click rate: every /dr-<name>/ and /doctors/dr-<name>/
     address, not the Our Doctors index. Reproduces all 5 published weeks.
   - NYCDS searches by name: see NAME_RULE below.
   - Trend points older than the previous week come from
     scripts/gsc-ledger.json (figures as reported). The previous week is
     re-read and restated, as both reports do with search.
   ========================================================================== */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const DEFAULT_TOKEN_URI = "https://oauth2.googleapis.com/token";

const CLIENTS = {
  nycds: { name: "NYC Dental Smiles", host: "nycdentalsmiles.com", siteEnv: "GSC_NYCDS_SITE" },
  eec: { name: "Edgard El Chaar, DDS, PC", host: "edgardelchaar.com", siteEnv: "GSC_EEC_SITE" },
  smilepass: { name: "NYC Smile Pass", host: "nycsmilepass.com", siteEnv: "GSC_SMILEPASS_SITE" },
};
const SMILEPASS_LAUNCH = "2026-07-01";

/* NAME_RULE · NYCDS "searches by name": queries naming the practice or one of
   its doctors, inside Google's query sample. The published weeks were matched
   by hand and no single rule reproduces all 5 of them (Sep 28 – Nov 1: 10.3,
   15.5, 7.5, 11.5, 12.1). This rule is fixed and written down: the practice
   name (and "nyc smiles"), Dr. El Chaar, and the surname of every doctor with
   a doctor page on the site, taken from the page addresses. Search-operator
   queries (site:) are people checking the index, not patients, and are left
   out. Changing the rule changes NAME_RULE_ID, and the trend is restated on
   the new rule rather than mixed. */
const NAME_RULE_ID = "v1-nov3";
const NAME_FIXED = [/nyc\s*dental\s*smile/i, /nycdentalsmile/i, /\bnyc\s*smiles?\b/i, /el\s*chaar/i, /elchaar/i];
const NAME_EXCLUDE = [/^site:/i, /\b(inurl|intitle|cache|related):/i];
const DOCTOR_PAGE = /^\/(?:doctors\/)?dr-([a-z]+(?:-[a-z]+)*)\/?$/i;

/* Published figures the discover summary checks against (Nov 2 reports). */
const PUBLISHED = {
  nycds: { "2026-10-26": [41, 1496], "2026-10-19": [43, 1699] },
  eec: { "2026-10-26": [40, 427], "2026-10-19": [52, 466] },
  smilepass: { "2026-10-26": [3, 47] },
};

/* ------------------------------------------------------------------ setup */

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);

loadEnvLocal();
const API = (process.env.GSC_BASE_URL || "https://searchconsole.googleapis.com/webmasters/v3").replace(/\/$/, "");
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
  if (!fs.existsSync(KEY_FILE)) {
    fail(`No key file at ${shownKeyPath}. Download a JSON key for the figment-reporting service account and move it there.`);
  }
  const mode = fs.statSync(KEY_FILE).mode & 0o777;
  let key;
  try { key = JSON.parse(fs.readFileSync(KEY_FILE, "utf8")); } catch {
    fail(`${shownKeyPath} is not valid JSON. It should be the key file downloaded from Google Cloud.`);
  }
  if (key?.type !== "service_account" || !key.client_email || !key.private_key) {
    const looks = key?.type ? `its type is "${key.type}"` : `its top-level fields are ${Object.keys(key || {}).slice(0, 6).join(", ") || "none"}`;
    fail(`${shownKeyPath} is not a service-account key (${looks}). The wrong file may have been the newest .json in Downloads. ` +
      `Download a new JSON key for figment-reporting from Google Cloud (IAM & Admin → Service Accounts → Keys) and move that one there.`);
  }
  return { key, mode };
}

let cachedToken = null;
async function accessToken(key) {
  if (cachedToken) return cachedToken;
  const now = Math.floor(Date.now() / 1000);
  const enc = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const aud = key.token_uri || DEFAULT_TOKEN_URI;
  const unsigned = `${enc({ alg: "RS256", typ: "JWT" })}.${enc({ iss: key.client_email, scope: SCOPE, aud, iat: now, exp: now + 3600 })}`;
  let sig;
  try { sig = crypto.sign("RSA-SHA256", Buffer.from(unsigned), key.private_key).toString("base64url"); } catch (e) {
    fail(`The private key in ${shownKeyPath} could not be used (${e.code || e.message}). Download a fresh JSON key.`);
  }
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
    const why = [body.error, body.error_description].filter(Boolean).join(": ");
    fail(`Google refused the service-account key (HTTP ${res.status}${why ? `, ${why}` : ""}). ` +
      `If the key was deleted in Google Cloud, create a new one. If it says invalid_grant with a time error, check the Mac's clock.`);
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
    if (res.status === 403 && /has not been used|is disabled|SERVICE_DISABLED/i.test(text)) {
      fail("The Google Search Console API is not enabled in the service account's Google Cloud project. Enable it under APIs & Services → Library, wait a minute, and run again.");
    }
    return { status: res.status, json, text: text.slice(0, 600) };
  }
}

async function listSites(key) {
  const r = await call(key, "GET", `${API}/sites`);
  if (r.status !== 200) fail(`Could not list Search Console properties (HTTP ${r.status}): ${r.text}`);
  return r.json?.siteEntry ?? [];
}

/** The property for a client: an override from .env.local, else the first
    form of its host the account can read (domain property first). */
function resolveSite(client, sites) {
  const readable = sites.filter((s) => s.permissionLevel && s.permissionLevel !== "siteUnverifiedUser");
  if (process.env[client.siteEnv]) {
    const want = process.env[client.siteEnv];
    return readable.find((s) => s.siteUrl === want)?.siteUrl ?? null;
  }
  const h = client.host;
  for (const form of [`sc-domain:${h}`, `https://${h}/`, `https://www.${h}/`, `http://${h}/`, `http://www.${h}/`]) {
    const hit = readable.find((s) => s.siteUrl === form);
    if (hit) return hit.siteUrl;
  }
  return null;
}

async function query(key, site, body) {
  const rows = [];
  for (let startRow = 0; ; startRow += 25000) {
    const r = await call(key, "POST", `${API}/sites/${encodeURIComponent(site)}/searchAnalytics/query`, { rowLimit: 25000, startRow, ...body });
    if (r.status !== 200) return { error: `HTTP ${r.status}: ${r.text}`, rows };
    const page = r.json?.rows ?? [];
    rows.push(...page);
    if (page.length < 25000) return { rows, responseAggregationType: r.json?.responseAggregationType };
  }
}

/* --------------------------------------------------------------- discover */

const sum = (rows, k) => rows.reduce((t, r) => t + (r[k] || 0), 0);
const inRange = (rows, a, b) => rows.filter((r) => r.keys[0] >= a && r.keys[0] <= b);

async function discover() {
  const { key, mode } = loadKey();
  console.log(`Key file ${shownKeyPath}: service account ${key.client_email}`);
  if (mode & 0o077) console.log(`  ! The key file is readable by other users on this Mac. Run: chmod 600 ${shownKeyPath}`);
  await accessToken(key);
  console.log("✓ Google accepted the key");

  const sites = await listSites(key);
  console.log(`\nProperties this account can see (${sites.length}):`);
  for (const s of sites) console.log(`  ${s.siteUrl.padEnd(40)} ${s.permissionLevel}`);

  const weeks = ["2026-09-28", "2026-10-05", "2026-10-12", "2026-10-19", "2026-10-26"];
  const sun = (m) => new Date(Date.parse(`${m}T00:00:00Z`) + 6 * 86400000).toISOString().slice(0, 10);
  const out = { readAt: new Date().toISOString(), serviceAccount: key.client_email, sites, clients: {} };
  let missing = 0;

  console.log();
  for (const [id, client] of Object.entries(CLIENTS)) {
    const site = resolveSite(client, sites);
    if (!site) {
      missing++;
      console.log(`✗ ${id}: no readable property for ${client.host}. In Search Console, add ${key.client_email} as a Restricted user on that property.`);
      continue;
    }
    console.log(`✓ ${id}: ${site}`);
    const c = (out.clients[id] = { site, data: {} });
    const q = async (label, body) => {
      const r = await query(key, site, { type: "web", ...body });
      c.data[label] = { body, ...r };
      if (r.error) console.log(`    ! ${label}: ${r.error}`);
      return r.rows;
    };

    const all = await q("date:all", { startDate: weeks[0], endDate: sun(weeks[4]), dimensions: ["date"], dataState: "all" });
    await q("date:final", { startDate: weeks[0], endDate: sun(weeks[4]), dimensions: ["date"] });
    for (const w of weeks) {
      for (const dim of ["device", "country", "page", "query"]) {
        await q(`${dim}:${w}`, { startDate: w, endDate: sun(w), dimensions: [dim], dataState: "all" });
      }
      await q(`none:${w}`, { startDate: w, endDate: sun(w), dataState: "all" });
    }
    if (id === "eec") {
      await q("date:usa", {
        startDate: weeks[0], endDate: sun(weeks[4]), dimensions: ["date"], dataState: "all",
        dimensionFilterGroups: [{ filters: [{ dimension: "country", operator: "equals", expression: "usa" }] }],
      });
    }
    if (id === "smilepass") {
      for (const dim of ["page", "query"]) {
        await q(`${dim}:since-launch`, { startDate: "2026-07-01", endDate: sun(weeks[4]), dimensions: [dim], dataState: "all" });
      }
      await q("date:since-launch", { startDate: "2026-07-01", endDate: sun(weeks[4]), dimensions: ["date"], dataState: "all" });
    }

    for (const w of weeks) {
      const r = inRange(all, w, sun(w));
      const pub = PUBLISHED[id]?.[w];
      const got = [sum(r, "clicks"), sum(r, "impressions")];
      console.log(`    week of ${w}: ${got[0]} clicks · ${got[1]} impressions${pub ? `   (published ${pub[0]} · ${pub[1]})${got[0] === pub[0] && got[1] === pub[1] ? " ✓" : ""}` : ""}`);
    }
  }

  const dir = path.join(process.cwd(), "pulls", "gsc");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `discover-${out.readAt.slice(0, 10)}.json`);
  fs.writeFileSync(file, JSON.stringify(out, null, 1) + "\n");
  console.log(`\nSaved ${path.relative(process.cwd(), file)} (${requestCount} requests). It holds query and page data and stays local (pulls/ is gitignored).`);
  if (missing) process.exit(1);
}

/* ------------------------------------------------------------------ dates */

const DAY = 86400000;
const toUtc = (d) => Date.parse(`${d}T00:00:00Z`);
const addDays = (d, n) => new Date(toUtc(d) + n * DAY).toISOString().slice(0, 10);
const weekday = (d) => new Date(toUtc(d)).getUTCDay();
const nyToday = () => process.env.GSC_TODAY || // GSC_TODAY: offline tests only
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const lastCompletedMonday = () => { const t = nyToday(); return addDays(t, -((weekday(t) + 6) % 7) - 7); };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const short = (d) => `${MONTHS[+d.slice(5, 7) - 1]} ${+d.slice(8, 10)}`;
const range = (mon) => {
  const sun = addDays(mon, 6);
  return mon.slice(5, 7) === sun.slice(5, 7) ? `${short(mon)} – ${+sun.slice(8, 10)}` : `${short(mon)} – ${short(sun)}`;
};

/* ------------------------------------------------------------- arithmetic */

const MINUS = "−";
const rnd = (n, dp) => { const f = 10 ** dp; return Math.round((n + Math.sign(n) * Number.EPSILON) * f) / f; };
const int = (n) => Math.round(n).toLocaleString("en-US");
const pct = (c, i) => (i ? (100 * c) / i : null);
const pathOf = (u) => { try { return new URL(u).pathname; } catch { return u; } };

function totals(rows) {
  const clicks = sum(rows, "clicks"), impressions = sum(rows, "impressions");
  const position = impressions ? rows.reduce((t, r) => t + r.position * r.impressions, 0) / impressions : null;
  return { clicks, impressions, ctr: impressions ? rnd(pct(clicks, impressions), 2) : null, position };
}

/** NYCDS searches by name, on NAME_RULE (see the top of the file). */
function nameSplit(queryRows, surnames) {
  const sn = surnames.length ? new RegExp(`\\b(${surnames.join("|")})\\b`, "i") : null;
  const isNamed = (q) => !NAME_EXCLUDE.some((x) => x.test(q)) && (NAME_FIXED.some((x) => x.test(q)) || (sn && sn.test(q)));
  const named = queryRows.filter((r) => isNamed(r.keys[0]));
  const excluded = queryRows.filter((r) => NAME_EXCLUDE.some((x) => x.test(r.keys[0])));
  // General = everything else in the sample, so the 2 rows always add up to it.
  const general = queryRows.filter((r) => !isNamed(r.keys[0]));
  return { named, general, excluded };
}
function doctorPages(pageRows) {
  const rows = pageRows.filter((r) => DOCTOR_PAGE.test(pathOf(r.keys[0])));
  const surnames = [...new Set(rows.map((r) => pathOf(r.keys[0]).match(DOCTOR_PAGE)[1].split("-").pop().toLowerCase()))];
  return { rows, clicks: sum(rows, "clicks"), impressions: sum(rows, "impressions"), surnames };
}

const LABELS = {
  nycds: { "/": "Homepage", "/ourdoctors/": "Meet Our Dentists", "/locations/": "Locations", "/services/": "Services", "/about/": "About" },
  eec: { "/": "Homepage", "/our-doctors/": "Our Doctors", "/locations/": "Locations", "/about/": "About", "/dental-services/": "Dental Services", "/eec-publications/": "EEC Publications" },
  smilepass: { "/": "Homepage", "/join/": "Join" },
};
const title = (slug) => slug.split("-").filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
function pageLabel(clientId, url) {
  const p = pathOf(url);
  if (LABELS[clientId]?.[p]) return LABELS[clientId][p];
  const doc = p.match(DOCTOR_PAGE);
  if (doc) return `Dr. ${title(doc[1])}`;
  const seg = p.split("/").filter(Boolean).pop();
  return seg ? title(seg) : p;
}

/* ------------------------------------------------------------------- pull */

async function pull(clientId, mon) {
  const { key } = loadKey();
  const sites = await listSites(key);
  const weeks = Array.from({ length: 5 }, (_, i) => addDays(mon, -7 * (4 - i)));
  const sun = (w) => addDays(w, 6);
  const raw = {};
  const warnings = [];
  const siteFor = (id) => {
    const s = resolveSite(CLIENTS[id], sites);
    if (!s) fail(`The service account cannot read ${CLIENTS[id].host} in Search Console. Add ${key.client_email} as a Restricted user on that property, or run --discover.`);
    return s;
  };
  const q = async (site, label, body) => {
    const r = await query(key, site, { type: "web", dataState: "all", ...body });
    raw[label] = { site, body, ...r };
    if (r.error) fail(`Search Console query "${label}" failed: ${r.error}`);
    return r.rows;
  };

  const site = siteFor(clientId);
  const out = { clientId, site, mon, weeks, readAt: new Date().toISOString(), byWeek: {}, raw, warnings };
  const daily = await q(site, "date", { startDate: weeks[0], endDate: sun(mon), dimensions: ["date"] });
  const dailyIn = (w) => daily.filter((r) => r.keys[0] >= w && r.keys[0] <= sun(w));
  for (const w of weeks) out.byWeek[w] = { ...totals(dailyIn(w)), days: dailyIn(w).length };
  for (const w of weeks) if (out.byWeek[w].days < 7) warnings.push(`week of ${short(w)}: Search Console has rows for ${out.byWeek[w].days} of 7 days (a day with no impressions has no row)`);
  out.daily = daily;

  const prev = weeks[3];
  for (const w of [prev, mon]) {
    out.byWeek[w].devices = await q(site, `device:${w}`, { startDate: w, endDate: sun(w), dimensions: ["device"] });
  }

  if (clientId === "nycds") {
    // Pages and queries for all 5 weeks: doctor pages and names are trend rows.
    for (const w of weeks) {
      const pages = await q(site, `page:${w}`, { startDate: w, endDate: sun(w), dimensions: ["page"] });
      const queries = await q(site, `query:${w}`, { startDate: w, endDate: sun(w), dimensions: ["query"] });
      Object.assign(out.byWeek[w], { pages, queries });
    }
    // Doctor surnames come from the doctor pages seen in any of the 5 weeks.
    const surnames = [...new Set(weeks.flatMap((w) => doctorPages(out.byWeek[w].pages).surnames))].sort();
    out.surnames = surnames;
    for (const w of weeks) {
      const b = out.byWeek[w];
      const doc = doctorPages(b.pages);
      const nm = nameSplit(b.queries, surnames);
      Object.assign(b, {
        doctorClicks: doc.clicks, doctorImpressions: doc.impressions, doctorCtr: doc.impressions ? rnd(pct(doc.clicks, doc.impressions), 1) : null,
        nameClicks: sum(nm.named, "clicks"), nameImpressions: sum(nm.named, "impressions"),
        nameCtr: sum(nm.named, "impressions") ? rnd(pct(sum(nm.named, "clicks"), sum(nm.named, "impressions")), 1) : null,
        sampleClicks: sum(b.queries, "clicks"), sampleImpressions: sum(b.queries, "impressions"),
        split: nm, doctorRows: doc.rows,
      });
    }
    // NYC Smile Pass, reported inside the NYCDS report since launch.
    const sp = siteFor("smilepass");
    const spDaily = await q(sp, "smilepass:date", { startDate: SMILEPASS_LAUNCH, endDate: sun(mon), dimensions: ["date"] });
    out.smilepass = {
      site: sp,
      sinceLaunch: totals(spDaily),
      week: totals(spDaily.filter((r) => r.keys[0] >= mon && r.keys[0] <= sun(mon))),
      prevWeek: totals(spDaily.filter((r) => r.keys[0] >= prev && r.keys[0] <= sun(prev))),
      pages: await q(sp, "smilepass:page", { startDate: SMILEPASS_LAUNCH, endDate: sun(mon), dimensions: ["page"] }),
      queries: await q(sp, "smilepass:query", { startDate: SMILEPASS_LAUNCH, endDate: sun(mon), dimensions: ["query"] }),
    };
  }

  if (clientId === "eec") {
    const us = await q(site, "date:usa", {
      startDate: weeks[0], endDate: sun(mon), dimensions: ["date"],
      dimensionFilterGroups: [{ filters: [{ dimension: "country", operator: "equals", expression: "usa" }] }],
    });
    for (const w of weeks) {
      const t = totals(us.filter((r) => r.keys[0] >= w && r.keys[0] <= sun(w)));
      Object.assign(out.byWeek[w], { usClicks: t.clicks, usImpressions: t.impressions, usPosition: t.position === null ? null : rnd(t.position, 2) });
    }
    for (const w of [prev, mon]) {
      const b = out.byWeek[w];
      b.pages = await q(site, `page:${w}`, { startDate: w, endDate: sun(w), dimensions: ["page"] });
      b.queries = await q(site, `query:${w}`, { startDate: w, endDate: sun(w), dimensions: ["query"] });
      b.sampleClicks = sum(b.queries, "clicks");
      b.sampleImpressions = sum(b.queries, "impressions");
    }
  }
  return out;
}

/* ------------------------------------------------------------- scoreboard */

const ROWS = {
  nycds: [
    { key: "nameCtr", k: "Searches by name", fmt: "pct1", change: "points1" },
    { key: "doctorCtr", k: "Doctor page click rate", fmt: "pct1", change: "points1" },
    { key: "ctr", k: "Click rate", fmt: "pct", change: "points2" },
    { key: "impressions", k: "Times the site appeared", fmt: "int", change: "pct0" },
    { key: "clicks", k: "Clicks", fmt: "int", change: "abs" },
  ],
  eec: [
    { key: "usPosition", k: "Average search position", fmt: "pos", change: "from" },
    { key: "clicks", k: "Search clicks", fmt: "int", change: "pct1" },
    { key: "ctr", k: "Search click rate", fmt: "pct", change: "points2" },
    { key: "impressions", k: "Search impressions", fmt: "int", change: "pct1" },
  ],
};
const display = (fmt, v) => v === null || v === undefined ? "—"
  : fmt === "int" ? int(v) : fmt === "pct" ? `${v.toFixed(2)}%` : fmt === "pct1" ? `${v.toFixed(1)}%` : v.toFixed(2);
const lit = (fmt, v) => v === null || v === undefined ? "null" : fmt === "int" ? String(Math.round(v)) : fmt === "pct1" ? v.toFixed(1) : v.toFixed(2);
const signed = (s, up) => `${up ? "+" : MINUS}${s}`;
function change(kind, cur, prev) {
  if (cur === null || prev === null || cur === undefined || prev === undefined) return "";
  const d = cur - prev;
  switch (kind) {
    case "abs": return d === 0 ? "0" : signed(int(Math.abs(d)), d > 0);
    case "pct0": { if (!prev) return ""; const p = Math.round((Math.abs(d) / prev) * 100); return p === 0 ? "0%" : signed(`${p}%`, d > 0); }
    case "pct1": { if (!prev) return ""; const p = rnd((Math.abs(d) / prev) * 100, 1); return p === 0 ? "0.0%" : signed(`${p.toFixed(1)}%`, d > 0); }
    case "points1": { const p = rnd(rnd(cur, 1) - rnd(prev, 1), 1); return p === 0 ? "0.0 points" : signed(`${Math.abs(p).toFixed(1)} points`, p > 0); }
    case "points2": { const p = rnd(rnd(cur, 2) - rnd(prev, 2), 2); return p === 0 ? "0.00 points" : signed(`${Math.abs(p).toFixed(2)} points`, p > 0); }
    case "from": return `from ${prev.toFixed(2)}`;
  }
  return "";
}

function loadLedger() {
  const p = path.join(SCRIPT_DIR, "gsc-ledger.json");
  if (!fs.existsSync(p)) fail("scripts/gsc-ledger.json is missing. It ships with this script; restore it from git.");
  return { p, ledger: JSON.parse(fs.readFileSync(p, "utf8")) };
}

/** Trend per row. Oldest 3 points from the ledger (as reported); the previous
    week re-read; this week from the pull. A searches-by-name point recorded on
    another rule is restated on the current one rather than mixed. */
function trends(pull, ledger) {
  const book = ledger[pull.clientId] || {};
  const out = {}, sources = {}, drift = [];
  for (const row of ROWS[pull.clientId]) {
    out[row.key] = []; sources[row.key] = [];
    pull.weeks.forEach((w, i) => {
      const fresh = pull.byWeek[w][row.key] ?? null;
      const kept = book[w]?.[row.key];
      const sameRule = row.key !== "nameCtr" || book[w]?.nameRule === NAME_RULE_ID;
      let v, src;
      if (i >= 3) { v = fresh; src = i === 4 ? "this pull" : "re-read"; }
      else if (kept !== undefined && sameRule) { v = kept; src = "ledger"; }
      else if (kept !== undefined) { v = fresh; src = "restated, name rule"; }
      else { v = fresh; src = "re-read (not in ledger)"; }
      const dp = row.fmt === "int" ? 0 : row.fmt === "pct1" ? 1 : 2;
      if (i < 4 && kept !== undefined && fresh !== null && sameRule && rnd(fresh, dp) !== rnd(kept, dp)) {
        drift.push(`${row.k}, week of ${short(w)}: reported ${display(row.fmt, kept)}, today ${display(row.fmt, fresh)}${src === "ledger" ? " (reported figure kept)" : " (restated)"}`);
      }
      out[row.key].push(v); sources[row.key].push(src);
    });
  }
  return { out, sources, drift };
}

/* ----------------------------------------------------------------- render */

function render(pull, ledger) {
  const { clientId, mon, weeks, byWeek } = pull;
  const prev = weeks[3];
  const cur = byWeek[mon], pre = byWeek[prev];
  const { out: T, sources, drift } = trends(pull, ledger);
  const L = [];
  const p = (s = "") => L.push(s);
  const fmtRow = (r) => ({ c: int(r.clicks), i: int(r.impressions), r: r.impressions ? `${rnd(pct(r.clicks, r.impressions), 2) === 0 ? "0" : rnd(pct(r.clicks, r.impressions), 2).toFixed(2)}%` : "0%" });
  const byClicks = (a, b) => b.clicks - a.clicks || b.impressions - a.impressions;

  p(`Search Console pull · ${CLIENTS[clientId].name} · ${pull.site}`);
  p(`Week: ${range(mon)}, ${mon.slice(0, 4)} · Monday to Sunday (Search Console days) · against ${range(prev)}`);
  p(`Read: ${new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" }).format(new Date(pull.readAt))} New York. Includes fresh data: the last days can still rise.`);
  p();
  const pos = (b) => (clientId === "eec" ? b.usPosition : b.position === null ? null : rnd(b.position, 1));
  p("TOTALS · daily export (Chart.csv)");
  p(`  Clicks            ${int(cur.clicks).padStart(7)}   from ${int(pre.clicks)}`);
  p(`  Impressions       ${int(cur.impressions).padStart(7)}   from ${int(pre.impressions)}`);
  p(`  Click rate        ${display("pct", cur.ctr).padStart(7)}   from ${display("pct", pre.ctr)}`);
  if (clientId === "eec") {
    p(`  Position, US      ${display("pos", cur.usPosition).padStart(7)}   from ${display("pos", pre.usPosition)}   US ${cur.usClicks} clicks · ${int(cur.usImpressions)} impressions`);
    p(`  Position, all     ${display("pos", rnd(cur.position, 2)).padStart(7)}   from ${display("pos", rnd(pre.position, 2))}`);
  } else {
    p(`  Position          ${pos(cur).toFixed(1).padStart(7)}   from ${pos(pre).toFixed(1)}   weighted by impressions`);
  }
  p(`  Query sample      ${cur.sampleClicks} of ${cur.clicks} clicks, ${int(cur.sampleImpressions)} of ${int(cur.impressions)} impressions` +
    ` (Google withholds ${Math.round(100 - pct(cur.sampleClicks, cur.clicks))}% of clicks and ${Math.round(100 - pct(cur.sampleImpressions, cur.impressions))}% of impressions)`);

  p();
  p("SCOREBOARD · replace each row's cells and trend; keep its note");
  p(`  weeks: [${weeks.map((w) => `"${short(w)}"`).join(", ")}]`);
  for (const row of ROWS[clientId]) {
    const t = T[row.key], c = t[4], v = t[3];
    if (clientId === "nycds") {
      p(`  k: "${row.k}"`);
      p(`    cells: [{ v: "${display(row.fmt, c)}", c: "${change(row.change, c, v)}" }, { v: "${display(row.fmt, v)}" }], trend: [${t.map((x) => lit(row.fmt, x)).join(", ")}],`);
    } else {
      const dp = row.fmt === "int" ? 0 : 2;
      const d = row.change === "from" ? (rnd(c, 2) < rnd(v, 2) ? "up" : rnd(c, 2) > rnd(v, 2) ? "down" : "flat") : (rnd(c, dp) > rnd(v, dp) ? "up" : rnd(c, dp) < rnd(v, dp) ? "down" : "flat");
      p(`  k: "${row.k}"`);
      p(`    trend: [${t.map((x) => lit(row.fmt, x)).join(", ")}],`);
      p(`    cells: [{ v: "${display(row.fmt, c)}", c: "${change(row.change, c, v)}", dir: "${d}" }, { v: "${display(row.fmt, v)}", c: "", dir: "flat" }],`);
    }
  }
  p();
  p("TREND SOURCES · oldest to newest");
  for (const row of ROWS[clientId]) p(`  ${row.k.padEnd(26)}${sources[row.key].join(" · ")}`);

  const devices = (b) => [...b.devices].sort(byClicks).map((r) => ({ d: title(r.keys[0].toLowerCase()), ...fmtRow(r), pos: r.position }));
  if (clientId === "nycds") {
    p();
    p("SEARCHES BY NAME · rule " + NAME_RULE_ID + " (practice name, nyc smiles, el chaar, doctor surnames; site: queries left out)");
    p(`  Doctor surnames, from the doctor pages: ${pull.surnames.join(", ")}`);
    p(`  This week ${cur.nameClicks} clicks from ${cur.nameImpressions} appearances = ${display("pct1", cur.nameCtr)} · week before ${pre.nameClicks} from ${pre.nameImpressions} = ${display("pct1", pre.nameCtr)}`);
    p(`  Matched this week: ${[...cur.split.named].sort(byClicks).map((r) => `${r.keys[0]} ${r.clicks}/${r.impressions}`).join(" · ")}`);
    if (cur.split.excluded.length) p(`  Left out of names (counted with general searches): ${cur.split.excluded.map((r) => `${r.keys[0]} ${r.clicks}/${r.impressions}`).join(" · ")}`);
    p(`  Doctor pages: ${cur.doctorClicks} clicks from ${cur.doctorImpressions} appearances · week before ${pre.doctorClicks} from ${pre.doctorImpressions}`);

    p();
    p("PERIOD LINE · daily clicks, both weeks");
    const days = Array.from({ length: 14 }, (_, i) => addDays(prev, i));
    const dmap = new Map(pull.daily.map((r) => [r.keys[0], r]));
    const series = days.map((d) => `{ d: "${short(d)}", v: ${dmap.get(d)?.clicks ?? 0} }`);
    p(`    series: [\n      ${series.slice(0, 7).join(", ")},\n      ${series.slice(7).join(", ")},\n    ],`);
    p(`    bands: ${range(prev)} ${int(pre.clicks)} ÷ 7 = ${(pre.clicks / 7).toFixed(1)} a day · ${range(mon)} ${int(cur.clicks)} ÷ 7 = ${(cur.clicks / 7).toFixed(1)} a day`);

    p();
    p("DETAIL · detail.search (labels are from the page address; check them)");
    p(`      kv: [\n        { k: "Clicks", v: "${int(cur.clicks)}" },\n        { k: "Impressions", v: "${int(cur.impressions)}" },\n        { k: "Click rate", v: "${display("pct", cur.ctr)}" },\n      ],`);
    p(`      impressionsSeries: [\n        ${days.slice(7).map((d) => `{ d: "${short(d)}", v: ${dmap.get(d)?.impressions ?? 0} }`).join(", ")},\n      ],`);
    p("      pages: [");
    for (const r of [...cur.pages].sort(byClicks).slice(0, 10)) {
      const f = fmtRow(r);
      p(`        { p: "${pageLabel("nycds", r.keys[0])}", c: "${f.c}", i: "${f.i}", r: "${f.r}", pos: "${r.position.toFixed(1)}" }, // ${pathOf(r.keys[0])}`);
    }
    p("      ],");
    p("      devices: [");
    for (const r of devices(cur)) p(`        { d: "${r.d}", c: "${r.c}", i: "${r.i}", r: "${r.r}", pos: "${r.pos.toFixed(1)}" },`);
    p("      ],");
    p("      queries: [");
    for (const r of [...cur.queries].sort(byClicks).slice(0, 6)) {
      const f = fmtRow(r);
      p(`        { q: "${r.keys[0].replace(/"/g, '\\"')}", c: "${f.c}", i: "${f.i}", r: "${f.r}", pos: "${r.position.toFixed(1)}" },`);
    }
    p("      ],");
    const gen = { clicks: sum(cur.split.general, "clicks"), impressions: sum(cur.split.general, "impressions") };
    p("      brandSplit rows: [");
    p(`        { k: "Names the practice or a doctor", c: "${cur.nameClicks}", i: "${int(cur.nameImpressions)}", r: "${display("pct", rnd(pct(cur.nameClicks, cur.nameImpressions), 2))}" },`);
    p(`        { k: "General searches", c: "${gen.clicks}", i: "${int(gen.impressions)}", r: "${display("pct", rnd(pct(gen.clicks, gen.impressions), 2))}" },`);
    p("      ],");

    const sp = pull.smilepass;
    const top = [...sp.queries].sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks);
    const join = sp.pages.find((r) => /\/join\/?$/.test(pathOf(r.keys[0])));
    p();
    p(`SMILE PASS · ${pull.smilepass.site} · ${short(SMILEPASS_LAUNCH)} – ${short(addDays(mon, 6))}`);
    p(`  Since launch ${sp.sinceLaunch.clicks} clicks · ${int(sp.sinceLaunch.impressions)} appearances · this week ${sp.week.clicks} · ${sp.week.impressions} · week before ${sp.prevWeek.clicks} · ${sp.prevWeek.impressions}`);
    p(`  Top searches: ${top.slice(0, 5).map((r) => `“${r.keys[0]}” ${r.impressions} appearances, ${r.clicks} clicks`).join(" · ")}`);
    p(`  Join page: ${join ? `${join.clicks} clicks from ${join.impressions} appearances` : "no appearances"}`);
    p(`      kv: [\n        { k: "Clicks from Google", v: "${int(sp.sinceLaunch.clicks)}" },\n        { k: "Appearances in Google", v: "${int(sp.sinceLaunch.impressions)}" },\n        { k: "Most common search", v: "“${top[0]?.keys[0] ?? ""}”" },\n      ],`);
  }

  if (clientId === "eec") {
    const nameQ = (b) => b.queries.filter((r) => /el\s*chaar|elchaar/i.test(r.keys[0]));
    const prevPos = new Map(nameQ(pre).map((r) => [r.keys[0], r.position]));
    p();
    p("DETAIL · search panel rows (labels are from the page address; check them)");
    p(`  ["Average position", "${display("pos", cur.usPosition)} · from ${display("pos", pre.usPosition)} · US only"],`);
    p(`  ["Clicks", "${int(cur.clicks)} · from ${int(pre.clicks)}"],`);
    p(`  ["Click rate", "${display("pct", cur.ctr)} · from ${display("pct", pre.ctr)}"],`);
    p(`  ["Impressions", "${int(cur.impressions)} · from ${int(pre.impressions)}"],`);
    for (const r of nameQ(cur).sort((a, b) => b.impressions - a.impressions).slice(0, 6)) {
      const was = prevPos.get(r.keys[0]);
      p(`  ["${r.keys[0]}", "position ${r.position.toFixed(2)}${was !== undefined ? ` · from ${was.toFixed(2)}` : ""} · ${r.clicks} ${r.clicks === 1 ? "click" : "clicks"} · ${r.impressions} impressions"],`);
    }
    for (const r of devices(cur).filter((r) => r.d !== "Tablet")) p(`  ["${r.d}", "${r.c} clicks · ${r.i} impressions · position ${r.pos.toFixed(2)} · all searches"],`);
    for (const r of [...cur.pages].sort(byClicks).slice(0, 6)) {
      p(`  ["${pageLabel("eec", r.keys[0])}", "${r.clicks} ${r.clicks === 1 ? "click" : "clicks"} · ${int(r.impressions)} impressions · position ${r.position.toFixed(2)}"], // ${pathOf(r.keys[0])}`);
    }
    const zero = [...cur.pages].filter((r) => r.clicks === 0 && r.position <= 3 && r.impressions >= 30).sort((a, b) => b.impressions - a.impressions);
    if (zero.length) p(`  Pages in the top 3 with no clicks: ${zero.map((r) => `${pathOf(r.keys[0])} ${r.impressions} impressions at ${r.position.toFixed(2)}`).join(" · ")}`);
    const tab = cur.devices.find((r) => r.keys[0] === "TABLET");
    if (tab) p(`  Tablets: ${tab.clicks} clicks on ${tab.impressions} impressions`);
  }

  if (drift.length) {
    p();
    p("DRIFT · today's reading against the ledger (informational)");
    for (const d of drift) p(`  ${d}`);
  }
  if (pull.warnings.length) {
    p();
    p("WARNINGS");
    for (const w of pull.warnings) p(`  ! ${w}`);
  }
  return L.join("\n");
}

function save(pull, text) {
  const dir = path.join(process.cwd(), "pulls", "gsc", pull.clientId);
  fs.mkdirSync(dir, { recursive: true });
  const base = path.join(dir, `${pull.mon}_${addDays(pull.mon, 6)}`);
  fs.writeFileSync(`${base}.txt`, text + "\n");
  const slim = { ...pull, byWeek: Object.fromEntries(Object.entries(pull.byWeek).map(([w, b]) => [w, { ...b, split: undefined, doctorRows: undefined }])) };
  fs.writeFileSync(`${base}.json`, JSON.stringify(slim, null, 1) + "\n");
  return path.relative(process.cwd(), base);
}

function record(pull, ledgerFile, ledger) {
  const book = (ledger[pull.clientId] ||= {});
  const keys = pull.clientId === "nycds"
    ? ["clicks", "impressions", "ctr", "nameCtr", "doctorCtr", "nameClicks", "nameImpressions", "doctorClicks", "doctorImpressions"]
    : ["clicks", "impressions", "ctr", "usPosition", "usClicks", "usImpressions"];
  const pick = (b) => Object.fromEntries(keys.filter((k) => b[k] !== null && b[k] !== undefined).map((k) => [k, b[k]]));
  const extra = (b) => (pull.clientId === "nycds" ? { position: rnd(b.position, 1), nameRule: NAME_RULE_ID } : {});
  const prev = pull.weeks[3];
  book[pull.mon] = { ...pick(pull.byWeek[pull.mon]), ...extra(pull.byWeek[pull.mon]), source: `gsc-pull ${pull.readAt}` };
  book[prev] = { ...(book[prev] || {}), ...pick(pull.byWeek[prev]), ...extra(pull.byWeek[prev]), restated: `gsc-pull ${pull.readAt}` };
  // Older weeks recorded on another name rule are restated with it, so the trend never mixes rules.
  for (const w of pull.weeks.slice(0, 3)) {
    if (pull.clientId === "nycds" && book[w] && book[w].nameRule !== NAME_RULE_ID) {
      Object.assign(book[w], { nameCtr: pull.byWeek[w].nameCtr, nameClicks: pull.byWeek[w].nameClicks, nameImpressions: pull.byWeek[w].nameImpressions, nameRule: NAME_RULE_ID });
    }
  }
  ledger[pull.clientId] = Object.fromEntries(Object.entries(book).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(ledgerFile, JSON.stringify(ledger, null, 2) + "\n");
}

/* ------------------------------------------------------------------ verify */

/* Published Nov 2, every point reproduced by the Nov 3 discover run. Closed
   weeks must match exactly; Oct 26 – Nov 1 was read with fresh data and may
   have risen a little since. Searches by name is shown, not checked: no
   single rule reproduces the published series (see NAME_RULE). */
const VERIFY = {
  nycds: {
    clicks: [45, 47, 58, 43, 41], impressions: [1190, 1266, 1554, 1699, 1496], ctr: [3.78, 3.71, 3.73, 2.53, 2.74],
    doctorCtr: [8.3, 10.3, 10.6, 4.8, 5.0], position: [null, null, null, 49.2, 45.0],
    nameCtr: [10.3, 15.5, 7.5, 11.5, 12.1],
    dailyClicks: [11, 7, 7, 7, 5, 3, 3, 10, 8, 7, 9, 4, 1, 2],
    smilepass: { sinceLaunch: [35, 392], week: [3, 47], top: ["nyc dental smiles", 130], join: [1, 37] },
  },
  eec: {
    clicks: [65, 58, 62, 52, 40], impressions: [582, 518, 512, 466, 427], ctr: [11.17, 11.20, 12.11, 11.16, 9.37],
    usPosition: [4.74, 6.77, 5.05, 5.25, 4.79],
    pages: { "/our-doctors/": [10, 273, 5.71], "/dental-service/digital-dentistry/": [0, 98, 1.98] },
  },
};

async function verify() {
  const lines = [];
  let failures = 0;
  const p = (s = "") => { lines.push(s); console.log(s); };
  const check = (ok, label, detail) => { if (!ok) failures++; p(`  ${ok ? "✓" : "✗"} ${label}${detail ? `  ${detail}` : ""}`); };
  const mon = "2026-10-26";
  p(`Search Console --verify · Sep 28 – Nov 1, 2026 against the published figures`);
  for (const clientId of ["nycds", "eec"]) {
    const v = VERIFY[clientId];
    const pull = await pullClientCached(clientId, mon);
    const W = pull.weeks;
    p();
    p(`${CLIENTS[clientId].name} · ${pull.site}`);
    const series = (k, dp) => W.map((w) => (pull.byWeek[w][k] === null ? null : rnd(pull.byWeek[w][k], dp)));
    const near = (got, want, tol) => got !== null && Math.abs(got - want) <= tol + 1e-9;
    const cmp = (k, dp, tolLast, grow) => {
      const got = series(k, dp);
      const ok = v[k].every((want, i) => want === null || (i < 4 ? near(got[i], want, 0) : near(got[i], want, tolLast) && (!grow || got[i] >= want)));
      check(ok, k.padEnd(12), `[${got.join(", ")}]${ok ? "" : ` want [${v[k].join(", ")}]`}`);
    };
    cmp("clicks", 0, 2, true);
    cmp("impressions", 0, 6, true);
    cmp("ctr", 2, 0.3);
    if (clientId === "nycds") {
      cmp("position", 1, 0.2);
      cmp("doctorCtr", 1, 0.3);
      const days = Array.from({ length: 14 }, (_, i) => addDays(W[3], i));
      const dmap = new Map(pull.daily.map((r) => [r.keys[0], r.clicks]));
      const got = days.map((d) => dmap.get(d) ?? 0);
      check(v.dailyClicks.every((want, i) => (i < 11 ? got[i] === want : got[i] >= want)), "daily clicks", `[${got.join(", ")}]`);
      p(`  · searches by name, rule ${NAME_RULE_ID}: [${series("nameCtr", 1).join(", ")}] against the published [${v.nameCtr.join(", ")}] (shown, not checked)`);
      const sp = pull.smilepass, e = v.smilepass;
      const top = [...sp.queries].sort((a, b) => b.impressions - a.impressions)[0];
      const join = sp.pages.find((r) => /\/join\/?$/.test(pathOf(r.keys[0])));
      check(sp.sinceLaunch.clicks >= e.sinceLaunch[0] && sp.sinceLaunch.impressions >= e.sinceLaunch[1] && sp.sinceLaunch.impressions <= e.sinceLaunch[1] + 6,
        "smile pass  ", `since launch ${sp.sinceLaunch.clicks} · ${sp.sinceLaunch.impressions}, week ${sp.week.clicks} · ${sp.week.impressions}, top “${top?.keys[0]}” ${top?.impressions}, join ${join?.clicks} · ${join?.impressions}`);
      check(sp.week.clicks === e.week[0] && sp.week.impressions >= e.week[1] && top?.keys[0] === e.top[0] && top.impressions >= e.top[1] && join?.clicks === e.join[0] && join?.impressions >= e.join[1], "smile pass detail");
    } else {
      cmp("usPosition", 2, 0.05);
      for (const [pth, want] of Object.entries(v.pages)) {
        const r = pull.byWeek[mon].pages.find((x) => pathOf(x.keys[0]) === pth);
        check(r && r.clicks === want[0] && near(r.impressions, want[1], 3) && near(r.position, want[2], 0.02), `page ${pth}`, r ? `${r.clicks} · ${r.impressions} · ${r.position.toFixed(2)}` : "not found");
      }
    }
    for (const w of pull.warnings) p(`  ! ${w}`);
    const dir = path.join(process.cwd(), "pulls", "gsc");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `verify_${clientId}.json`), JSON.stringify(pull.raw, null, 1) + "\n");
  }
  p();
  p(failures ? `✗ ${failures} check(s) failed. Attach pulls/gsc/verify.txt and the verify_*.json files.` : "✓ All checks passed. The pull reproduces the published figures.");
  fs.writeFileSync(path.join(process.cwd(), "pulls", "gsc", "verify.txt"), lines.join("\n") + "\n");
  process.exit(failures ? 1 : 0);
}
const pullClientCached = (id, mon) => pull(id, mon);

/* -------------------------------------------------------------------- main */

async function main() {
  if (flag("--discover")) return discover();
  if (flag("--verify")) return verify();
  const opt = (n) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : null; };
  const clientId = (opt("--client") || "nycds").toLowerCase();
  if (!ROWS[clientId]) fail(`Unknown client "${clientId}". Use nycds (includes Smile Pass) or eec.`);
  const mon = opt("--week") || lastCompletedMonday();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(mon) || weekday(mon) !== 1) fail(`--week must be a Monday as YYYY-MM-DD (got ${mon}).`);
  if (addDays(mon, 7) > nyToday()) fail(`The week of ${short(mon)} has not closed yet.`);
  const { p: ledgerFile, ledger } = loadLedger();
  const result = await pull(clientId, mon);
  const text = render(result, ledger);
  console.log(text);
  const saved = save(result, text);
  console.log(`\nSaved ${saved}.txt and .json (${requestCount} requests).`);
  if (flag("--record")) {
    record(result, ledgerFile, ledger);
    console.log(`Ledger updated: ${range(mon)} recorded, ${range(result.weeks[3])} restated. Commit scripts/gsc-ledger.json with the cycle.`);
  } else {
    console.log("Ledger not updated. Run again with --record once these are the figures going into the report.");
  }
}

main().catch((e) => fail(e.stack || String(e)));
