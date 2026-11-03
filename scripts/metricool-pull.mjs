#!/usr/bin/env node
/* ==========================================================================
   metricool-pull.mjs · weekly Instagram and Facebook figures from Metricool
   --------------------------------------------------------------------------
   Run from the NYCDS repo root, in your own Terminal (the Metricool API is
   not reachable from Claude's sandbox):

     node scripts/metricool-pull.mjs                 last completed Mon–Sun week, NYCDS
     node scripts/metricool-pull.mjs --client eec    same, EEC (Metricool brand "DDS PC")
     node scripts/metricool-pull.mjs --week 2026-11-02   a specific week (a Monday)
     node scripts/metricool-pull.mjs --record        also write this week into the ledger
     node scripts/metricool-pull.mjs --verify        first-run check against known figures
     node scripts/metricool-pull.mjs --discover      list the brands the key can see

   Key: METRICOOL_USER_TOKEN and METRICOOL_USER_ID in .env.local (gitignored).
   Never in the repo or in chat.

   What it prints: the week's account figures, the scoreboard `cells` and
   `trend` for each Metricool row in that client's report format (keep each
   row's note), and the week's reels and feed posts ranked by views. It saves
   pulls/metricool/<client>/<monday>_<sunday>.txt and .json (/pulls/ is
   gitignored).

   HOW THE FIGURES ARE BUILT (each rule checked against the published
   5-week trends, Sep 28 – Nov 1):
   - Account figures come from Metricool's daily account timeline, summed
     Monday to Sunday in America/New_York. Followers is the Sunday reading.
   - Reach per day = the week's daily reach summed, ÷ 7, rounded.
   - Engagement rate = interactions ÷ (reach per day × 7), the published
     method for both clients.
   - Interactions = Metricool's "Total Content Interactions" (feed posts +
     reels), credited to each piece's publish date as its running total.
     It keeps growing after the week closes, so it is a per-piece figure:
     read it the day after the week closes.
   - Trend points older than the previous week come from
     scripts/metricool-ledger.json (figures as reported), never a re-pull,
     so the trend-shift guard holds. The previous week is re-read or kept
     per client (`restate` below), matching each report's rule.
   ========================================================================== */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TZ = "America/New_York";
const MINUS = "−"; // U+2212, as the reports use
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const LEDGER_PATH = path.join(SCRIPT_DIR, "metricool-ledger.json");

/* ----------------------------------------------------------------- config */

const CLIENTS = {
  nycds: {
    name: "NYC Dental Smiles",
    brand: "NYCDS",
    blogId: 6338794,
    facebook: true,
    // Previous week: account totals are re-read; per-piece figures keep their
    // day-after reading (NYCDS cycle ledger, Nov 2).
    restate: ["followers", "views", "reachPerDay", "fbPageVisits", "fbViews"],
    style: "nycds",
    rows: [
      { key: "followers", group: "Instagram", k: "Followers", fmt: "int", change: "abs" },
      { key: "views", group: "Instagram", k: "Views", fmt: "int", change: "pct0" },
      { key: "reachPerDay", group: "Instagram", k: "Reach per day", fmt: "int", change: "pct0" },
      { key: "interactions", group: "Instagram", k: "Interactions", fmt: "int", change: "abs" },
      { key: "er", group: "Instagram", k: "Engagement rate", fmt: "pct", change: "points" },
      { key: "fbPageVisits", group: "Facebook", k: "Page visits", fmt: "int", change: "abs" },
      { key: "fbViews", group: "Facebook", k: "Views", fmt: "int", change: "pct0" },
    ],
  },
  eec: {
    name: "Edgard El Chaar, DDS, PC",
    brand: "DDS PC",
    blogId: 6419911,
    facebook: false, // the EEC report does not carry Facebook
    // Previous week: everything is re-read and restated (EEC report rule).
    restate: ["followers", "views", "reachPerDay", "interactions", "er"],
    style: "eec",
    rows: [
      { key: "followers", group: "Instagram", k: "Followers", fmt: "int", change: "abs", prevChange: true },
      { key: "interactions", group: "Instagram", k: "Instagram interactions", fmt: "int", change: "pct1" },
      { key: "reachPerDay", group: "Instagram", k: "Instagram reach per day", fmt: "int", change: "pct1" },
      { key: "views", group: "Instagram", k: "Instagram views", fmt: "int", change: "pct1" },
      { key: "er", group: "Instagram", k: "Instagram engagement rate", fmt: "pct", change: "points" },
    ],
  },
};

/* Metricool timeline metrics, as the REST API names them. Confirmed by the
   live --verify of Nov 3, 2026: Metricool answers an unknown name with HTTP
   400 and its list of valid fields, which is where the snake_case names come
   from (the connector's camelCase labels are not the API's). Candidates are
   tried in order and --verify reports which one resolved. `sparse` metrics
   have no row on days without content, so a missing day is a zero, not a gap. */
const METRICS = {
  followers:          { network: "instagram", agg: "last", candidates: [["account", "followers"]] },
  views:              { network: "instagram", agg: "sum",  candidates: [["account", "views"], ["account", "impressions"]] },
  reach:              { network: "instagram", agg: "sum",  candidates: [["account", "reach"], ["account", "impressionsUnique"]] },
  interactions:       { network: "instagram", agg: "sum",  candidates: [["account", "postsInteractions"]], sparse: true },
  accountsEngaged:    { network: "instagram", agg: "sum",  candidates: [["account", "accounts_engaged"]] },
  storiesImpressions: { network: "instagram", agg: "sum",  candidates: [["stories", "impressions"]], sparse: true },
  followersGained:    { network: "instagram", agg: "sum",  candidates: [["account", "followers_gained"]], optional: true, sparse: true },
  followersLost:      { network: "instagram", agg: "sum",  candidates: [["account", "followers_lost"]], optional: true, sparse: true },
  fbViews:            { network: "facebook",  agg: "sum",  candidates: [["account", "page_media_view"]], fb: true },
  fbPageVisits:       { network: "facebook",  agg: "sum",  candidates: [["account", "pageViews"]], fb: true },
  fbFollowers:        { network: "facebook",  agg: "last", candidates: [["account", "pageFollows"]], fb: true },
};

/* Known figures for --verify, Sep 28 – Nov 1, 2026. Closed weeks before
   Oct 26 are the published trend values (exact; account figures do not move
   on re-read). Oct 26 – Nov 1 is the connector reading of Nov 3, which may
   still settle by a few. Interactions are Nov 3 readings and can only grow. */
const VERIFY_WEEKS = ["2026-09-28", "2026-10-05", "2026-10-12", "2026-10-19", "2026-10-26"];
const VERIFY = {
  nycds: {
    followers: [779, 779, 780, 782, 792],
    views: [3383, 5514, 2208, 2962, 2593],
    reach: [1122, 1711, 629, 968, 791],
    accountsEngaged: [95, 92, 61, 65, 47],
    storiesImpressions: [1038, 397, 317, 118, 197],
    interactions: [60, 60, 44, 78, 44],
    fbViews: [309, 240, 220, 202, 82],
    fbPageVisits: [4, 26, 22, 10, 8],
    fbFollowers: [982, 982, 983, 981, 982],
    reels: [{ id: "DfFueasTiNl", views: 513, reach: 302, interactions: 30 }],
  },
  eec: {
    followers: [3251, 3257, 3264, 3267, 3353],
    views: [8526, 6626, 6083, 2951, 16731],
    reach: [3691, 2542, 2669, 950, 9773],
    accountsEngaged: [239, 164, 139, 54, 285],
    storiesImpressions: [1074, 509, 330, 198, 1847],
    interactions: [228, 141, 164, 31, 272],
    reels: [
      { id: "DfDRO6eBL4Q", views: 11460, reach: 9064, interactions: 260 },
      { id: "DfHo-y9ToSA", views: 413, reach: 261, interactions: 4 },
    ],
  },
};

/* -------------------------------------------------------------- arguments */

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const opt = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : null;
};

loadEnvLocal();
const BASE = (process.env.METRICOOL_BASE_URL || "https://app.metricool.com/api").replace(/\/$/, "");
const TOKEN = process.env.METRICOOL_USER_TOKEN || "";
const USER_ID = process.env.METRICOOL_USER_ID || "";

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

/* ------------------------------------------------------------------ dates */

const DAY = 86400000;
const toUtc = (d) => Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10));
const fromUtc = (ms) => new Date(ms).toISOString().slice(0, 10);
const addDays = (d, n) => fromUtc(toUtc(d) + n * DAY);
const weekday = (d) => new Date(toUtc(d)).getUTCDay(); // 0 = Sunday
const nyParts = (ms) => {
  const o = {};
  for (const p of new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date(ms))) o[p.type] = p.value;
  return { date: `${o.year}-${o.month}-${o.day}`, time: `${o.hour}:${o.minute}:${o.second}` };
};
function offsetMinutes(utcMs, tz = TZ) {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "longOffset" })
    .formatToParts(new Date(utcMs)).find((p) => p.type === "timeZoneName").value;
  const m = name.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
  return m ? (m[1] === "-" ? -1 : 1) * (+m[2] * 60 + +(m[3] || 0)) : 0;
}
/** A wall-clock time in a time zone, as UTC ms. DST-safe. */
function wallToUtc(date, time, tz) {
  const [h, mi, s = 0] = time.split(":").map(Number);
  const naive = toUtc(date) + ((h * 60 + mi) * 60 + s) * 1000;
  let off = offsetMinutes(naive, tz);
  off = offsetMinutes(naive - off * 60000, tz);
  return { ms: naive - off * 60000, off };
}
/** A New York wall-clock time as ISO 8601 with its offset, DST-safe. */
function nyIso(date, time) {
  const { off } = wallToUtc(date, time, TZ);
  const a = Math.abs(off);
  return `${date}T${time}${off < 0 ? "-" : "+"}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
}
const nyToday = () => process.env.METRICOOL_TODAY || nyParts(Date.now()).date; // METRICOOL_TODAY: offline tests only
function lastCompletedMonday() {
  const today = nyToday();
  const sinceMonday = (weekday(today) + 6) % 7;
  return addDays(today, -sinceMonday - 7);
}
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const short = (d) => `${MONTHS[+d.slice(5, 7) - 1]} ${+d.slice(8, 10)}`;
const range = (mon) => {
  const sun = addDays(mon, 6);
  return mon.slice(5, 7) === sun.slice(5, 7) ? `${short(mon)} – ${+sun.slice(8, 10)}` : `${short(mon)} – ${short(sun)}`;
};

/* ------------------------------------------------------------------- http */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let requestCount = 0;
async function get(pathAndQuery, params) {
  const qs = new URLSearchParams({ ...params, userId: USER_ID }).toString();
  const url = `${BASE}${pathAndQuery}?${qs}`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    requestCount++;
    let res;
    try {
      res = await fetch(url, { headers: { "X-Mc-Auth": TOKEN, "Content-Type": "application/json", Accept: "application/json" } });
    } catch (e) {
      if (attempt === 3) return { status: 0, json: null, text: String(e.cause?.code || e.message) };
      await sleep(1000 * attempt);
      continue;
    }
    if ((res.status === 429 || res.status >= 500) && attempt < 3) { await sleep(1500 * attempt); continue; }
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch { /* not JSON */ }
    if (res.status === 401 || res.status === 403) {
      fail(`Metricool refused the key (HTTP ${res.status}). Check METRICOOL_USER_TOKEN and METRICOOL_USER_ID in .env.local: ` +
        `the key must belong to the Metricool login that owns the brands (user ${USER_ID || "?"}). Run --discover to see what it can reach.`);
    }
    return { status: res.status, json, text: text.slice(0, 400) };
  }
}

function fail(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(2);
}

/* -------------------------------------------------------------- timelines */

/** Normalizes Metricool's timeline payload to Map<YYYY-MM-DD, number|null>. */
function parseTimeline(json) {
  let points = null;
  if (Array.isArray(json?.data) && json.data.length && Array.isArray(json.data[0]?.values)) {
    points = json.data.flatMap((s) => s.values);
  } else if (Array.isArray(json?.data)) points = json.data;
  else if (Array.isArray(json?.values)) points = json.values;
  else if (Array.isArray(json)) points = json;
  const out = new Map();
  for (const p of points || []) {
    const dt = typeof p?.dateTime === "object" ? p.dateTime?.dateTime : (p?.dateTime ?? p?.date ?? p?.day);
    const key = dateKey(dt);
    if (!key) continue;
    const v = p?.value ?? p?.total ?? null;
    out.set(key, v === null || v === undefined || v === "" ? null : Number(v));
  }
  return out;
}
/** Bucket date in New York. Daily buckets carry a New York midnight; anything
    else (UTC midnight, no offset) is read by its literal date. */
function dateKey(s) {
  if (s === undefined || s === null) return null;
  s = String(s);
  if (/^\d{8}$/.test(s)) return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  const lit = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (!lit) return null;
  if (/(Z|[+-]\d{2}:?\d{2})$/.test(s)) {
    const ms = Date.parse(s);
    if (!Number.isNaN(ms)) {
      const ny = nyParts(ms);
      if (ny.time === "00:00:00") return ny.date;
    }
  }
  return lit[1];
}

async function fetchTimeline(client, key, from, to, log) {
  const m = METRICS[key];
  const tried = [];
  for (const [subject, metric] of m.candidates) {
    const r = await get("/v2/analytics/timelines", {
      blogId: client.blogId, from: nyIso(from, "00:00:00"), to: nyIso(to, "23:59:59"),
      timezone: TZ, metric, subject, network: m.network,
    });
    const series = r.status >= 200 && r.status < 300 ? parseTimeline(r.json) : new Map();
    tried.push(`${subject}/${metric} → HTTP ${r.status}, ${series.size} days`);
    if (series.size) {
      log.resolved[key] = `${m.network} ${subject}/${metric}`;
      log.raw[key] = r.json;
      return series;
    }
    log.raw[`${key} (${subject}/${metric}, unresolved)`] = r.json ?? r.text;
  }
  log.unresolved[key] = tried;
  return null;
}

function aggregate(series, mon, agg, warn, label, sparse = false) {
  if (!series) return null;
  const days = Array.from({ length: 7 }, (_, i) => addDays(mon, i));
  const missing = days.filter((d) => !series.has(d));
  if (missing.length && !sparse) warn(`${label}, week of ${short(mon)}: no value for ${missing.map(short).join(", ")}`);
  if (agg === "last") {
    for (let i = 6; i >= 0; i--) {
      const v = series.get(days[i]);
      if (v !== null && v !== undefined) {
        if (i < 6) warn(`${label}, week of ${short(mon)}: no Sunday reading, using ${short(days[i])}`);
        return v;
      }
    }
    return null;
  }
  return days.reduce((t, d) => t + (series.get(d) ?? 0), 0);
}

/* ---------------------------------------------------------------- content */

const pick = (o, ...keys) => {
  for (const k of keys) {
    const v = k.split(".").reduce((x, p) => (x == null ? undefined : x[p]), o);
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
};
const num = (v) => (v === undefined || v === null || v === "" || Number.isNaN(Number(v)) ? null : Number(v));

function normalizePiece(p, format) {
  const likes = num(pick(p, "likes"));
  const comments = num(pick(p, "comments"));
  const saves = num(pick(p, "saved", "saves"));
  const shares = num(pick(p, "shares"));
  const parts = [likes, comments, saves, shares].filter((x) => x !== null);
  const url = pick(p, "url", "permalink", "link") ?? null;
  return {
    format,
    date: pieceDate(pick(p, "publishedAt", "timestamp", "created", "date")),
    url,
    id: url ? (url.match(/\/(?:reel|p|tv)\/([^/?#]+)/)?.[1] ?? null) : null,
    title: String(pick(p, "content", "text", "caption") ?? "").split("\n")[0].slice(0, 90),
    views: num(pick(p, "views", "videoViews", "impressions")),
    reach: num(pick(p, "reach")),
    interactions: num(pick(p, "interactions")) ?? (parts.length ? parts.reduce((a, b) => a + b, 0) : null),
    likes, comments, saves, shares,
  };
}

/** Publish date in New York. Metricool sends { dateTime, timezone } with the
    wall time in Europe/Madrid (live response, Nov 3), so a reel posted at
    20:10 Madrid on Oct 29 is 15:10 in New York, and one posted early Monday in
    Madrid can still belong to the New York Sunday. An offset is converted; a
    bare timestamp is read as given. */
function pieceDate(v) {
  if (v && typeof v === "object") {
    const dt = String(v.dateTime ?? "");
    const m = dt.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}(?::\d{2})?)/);
    if (m && v.timezone) {
      try { return nyParts(wallToUtc(m[1], m[2], v.timezone).ms).date; } catch { /* unknown zone: fall through */ }
    }
    v = dt;
  }
  const s = String(v ?? "");
  if (/^\d{14}$/.test(s)) return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  if (/^\d{8}$/.test(s)) return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  if (/(Z|[+-]\d{2}:?\d{2})$/.test(s) && !Number.isNaN(Date.parse(s))) return nyParts(Date.parse(s)).date;
  return s.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? "";
}

async function fetchContent(client, mon, log, warn) {
  const sun = addDays(mon, 6);
  const out = [];
  for (const [kind, format] of [["reels", "Reel"], ["posts", "Post"]]) {
    const r = await get(`/v2/analytics/${kind}/instagram`, {
      // A day either side: the API's window is not in New York time, so pieces are
      // filtered below on their New York publish date instead.
      blogId: client.blogId, from: `${addDays(mon, -1)}T00:00:00`, to: `${addDays(sun, 1)}T23:59:59`, timezone: TZ,
    });
    log.raw[`content:${kind}`] = r.json ?? r.text;
    const list = Array.isArray(r.json?.data) ? r.json.data : Array.isArray(r.json) ? r.json : null;
    if (!(r.status >= 200 && r.status < 300) || !list) {
      warn(`Instagram ${kind}: no list (HTTP ${r.status}); the account figures are unaffected`);
      continue;
    }
    for (const p of list) out.push(normalizePiece(p, format));
  }
  for (const p of out) if (!p.date) warn(`A ${p.format.toLowerCase()} has no readable publish date and is listed anyway: ${p.url ?? p.title}`);
  return out
    .filter((p) => !p.date || (p.date >= mon && p.date <= sun))
    .sort((a, b) => (b.views ?? -1) - (a.views ?? -1));
}

/* -------------------------------------------------------------- formatting */

const int = (n) => Math.round(n).toLocaleString("en-US");
const round2 = (n) => Math.round(n * 100) / 100;
const pct2 = (n) => `${n.toFixed(2)}%`;
const signed = (s, positive, zero) => (zero ? s : `${positive ? "+" : MINUS}${s}`);

function changeString(kind, cur, prev) {
  if (cur === null || prev === null || cur === undefined || prev === undefined) return "";
  const d = cur - prev;
  switch (kind) {
    case "abs": return d === 0 ? "0" : signed(int(Math.abs(d)), d > 0, false);
    case "pct0": {
      if (!prev) return "";
      const p = Math.round((Math.abs(d) / prev) * 100);
      return p === 0 ? "0%" : signed(`${p}%`, d > 0, false);
    }
    case "pct1": {
      if (!prev) return "";
      const p = Math.round((Math.abs(d) / prev) * 1000) / 10;
      return p === 0 ? "0.0%" : signed(`${p.toFixed(1)}%`, d > 0, false);
    }
    case "points": {
      const pd = round2(round2(cur) - round2(prev));
      return pd === 0 ? "0.00 points" : signed(`${Math.abs(pd).toFixed(2)} points`, pd > 0, false);
    }
  }
  return "";
}
const display = (fmt, v) => (v === null || v === undefined ? "—" : fmt === "pct" ? pct2(v) : int(v));
const trendLiteral = (fmt, arr) => `[${arr.map((v) => (v === null ? "null" : fmt === "pct" ? v.toFixed(2) : String(Math.round(v)))).join(", ")}]`;
const dir = (cur, prev) => (cur > prev ? "up" : cur < prev ? "down" : "flat");

function rowBlock(style, row, trend) {
  const cur = trend[4], prev = trend[3], prev2 = trend[2];
  const c = changeString(row.change, cur, prev);
  if (style === "nycds") {
    return `  k: "${row.k}" (${row.group})\n    cells: [{ v: "${display(row.fmt, cur)}", c: "${c}" }, { v: "${display(row.fmt, prev)}" }], trend: ${trendLiteral(row.fmt, trend)},`;
  }
  const pc = row.prevChange ? changeString(row.change, prev, prev2) : "";
  return `  k: "${row.k}"\n    trend: ${trendLiteral(row.fmt, trend)},\n    cells: [{ v: "${display(row.fmt, cur)}", c: "${c}", dir: "${dir(round2(cur), round2(prev))}" }, { v: "${display(row.fmt, prev)}", c: "${pc}", dir: "flat" }],`;
}

/* ------------------------------------------------------------------- pull */

async function pullClient(clientId, mon, { weeksBack = 4 } = {}) {
  const client = CLIENTS[clientId];
  const weeks = Array.from({ length: weeksBack + 1 }, (_, i) => addDays(mon, -7 * (weeksBack - i)));
  const from = weeks[0], to = addDays(mon, 6);
  const warnings = [];
  const warn = (w) => warnings.push(w);
  const log = { resolved: {}, unresolved: {}, raw: {} };

  const keys = Object.keys(METRICS).filter((k) => client.facebook || !METRICS[k].fb);
  const series = {};
  for (const k of keys) series[k] = await fetchTimeline(client, k, from, to, log);
  for (const [k, tried] of Object.entries(log.unresolved)) {
    if (!METRICS[k].optional) warn(`${k}: no candidate returned data (${tried.join("; ")})`);
  }

  const byWeek = {};
  for (const w of weeks) {
    const f = {};
    // Optional figures (followers gained/lost) only matter for the target week.
    for (const k of keys) f[k] = aggregate(series[k], w, METRICS[k].agg, METRICS[k].optional && w !== mon ? () => {} : warn, k, METRICS[k].sparse);
    f.reachPerDay = f.reach === null ? null : Math.round(f.reach / 7);
    f.er = f.interactions === null || !f.reachPerDay ? null : round2((100 * f.interactions) / (f.reachPerDay * 7));
    byWeek[w] = f;
  }
  const content = await fetchContent(client, mon, log, warn);
  return { client, clientId, mon, weeks, byWeek, content, warnings, log, readAt: new Date().toISOString() };
}

/* ------------------------------------------------------------------ report */

function loadLedger() {
  if (!fs.existsSync(LEDGER_PATH)) fail(`Ledger not found at ${path.relative(process.cwd(), LEDGER_PATH)}. It ships with this script; restore it from git.`);
  return JSON.parse(fs.readFileSync(LEDGER_PATH, "utf8"));
}

function buildTrends(pull, ledger) {
  const { client, clientId, weeks, byWeek } = pull;
  const book = ledger[clientId] || {};
  const n = weeks.length;
  const trends = {}, sources = {}, drift = [];
  for (const row of client.rows) {
    trends[row.key] = [];
    sources[row.key] = [];
    weeks.forEach((w, i) => {
      const fresh = byWeek[w][row.key];
      const kept = book[w]?.[row.key];
      const isTarget = i === n - 1;
      const isPrev = i === n - 2;
      let v, src;
      if (isTarget) { v = fresh; src = "this pull"; }
      else if (isPrev && client.restate.includes(row.key)) { v = fresh; src = "re-read"; }
      else if (kept !== undefined) { v = kept; src = "ledger"; }
      else { v = fresh; src = "re-read (not in ledger)"; }
      if (!isTarget && kept !== undefined && fresh !== null && fresh !== undefined && round2(fresh) !== round2(kept)) {
        drift.push(`${row.k}, week of ${short(w)}: ledger ${display(row.fmt, kept)}, today ${display(row.fmt, fresh)}${src === "ledger" ? " (ledger kept)" : " (restated)"}`);
      }
      trends[row.key].push(v ?? null);
      sources[row.key].push(src);
    });
  }
  return { trends, sources, drift };
}

function render(pull, ledger) {
  const { client, clientId, mon, weeks, byWeek, content, warnings, readAt } = pull;
  const cur = byWeek[mon];
  const prevMon = weeks[weeks.length - 2];
  const { trends, sources, drift } = buildTrends(pull, ledger);
  const ny = nyParts(Date.parse(readAt));
  const L = [];
  const p = (s = "") => L.push(s);

  p(`Metricool pull · ${client.name} (Metricool brand "${client.brand}", ${client.blogId})`);
  p(`Week: ${range(mon)}, ${mon.slice(0, 4)} · Monday to Sunday, ${TZ} · against ${range(prevMon)}`);
  p(`Read: ${ny.date} ${ny.time.slice(0, 5)} New York`);
  p();
  p("INSTAGRAM · account figures, Metricool");
  // Previous week as the report will show it: the trend value where the key
  // is a scoreboard row (ledger or re-read, per the client's rule), else re-read.
  const prevOf = (key) => (trends[key] ? trends[key][trends[key].length - 2] : byWeek[prevMon][key]);
  const line = (label, key, fmt, note = "") =>
    p(`  ${label.padEnd(18)}${display(fmt, cur[key]).padStart(9)}   from ${display(fmt, prevOf(key)).padEnd(8)} ${note}`.trimEnd());
  line("Followers", "followers", "int", `Sunday reading${cur.followersGained !== null && cur.followersGained !== undefined ? ` · ${cur.followersGained} gained, ${cur.followersLost ?? "?"} lost` : ""}`);
  line("Views", "views", "int", "all formats, window-scoped");
  line("Reach per day", "reachPerDay", "int", `daily reach summed ${cur.reach === null ? "—" : int(cur.reach)}, ÷ 7`);
  line("Interactions", "interactions", "int", "feed posts + reels, per piece, still growing");
  line("Engagement rate", "er", "pct", cur.er === null ? "" : `${int(cur.interactions)} ÷ (${int(cur.reachPerDay)} × 7)`);
  line("Accounts engaged", "accountsEngaged", "int");
  line("Story impressions", "storiesImpressions", "int", "a different unit; never added to views");
  if (client.facebook) {
    p();
    p("FACEBOOK · account figures, Metricool");
    line("Views", "fbViews", "int", "Page Media View");
    line("Page visits", "fbPageVisits", "int");
    line("Followers", "fbFollowers", "int", "Sunday reading");
  }

  p();
  p("SCOREBOARD · replace each row's cells and trend; keep its note");
  p(`  weeks: [${weeks.map((w) => `"${short(w)}"`).join(", ")}]`);
  for (const row of client.rows) p(rowBlock(client.style, row, trends[row.key]));

  p();
  p("TREND SOURCES · oldest to newest");
  for (const row of client.rows) p(`  ${row.k.padEnd(28)}${sources[row.key].join(" · ")}`);
  if (clientId === "eec") p("  Views are exact from the API; the 16.7K rounding note in report-data.ts can go.");

  p();
  p(`CONTENT · ${range(mon)} reels and feed posts, ranked by views, read now`);
  if (!content.length) p("  none returned");
  for (const c of content) {
    const er = c.interactions !== null && c.reach ? `${((100 * c.interactions) / c.reach).toFixed(1)}%` : "—";
    p(`  ${c.format.padEnd(5)} ${short(c.date || mon).padEnd(7)} ${display("int", c.views).padStart(7)} views · ${display("int", c.reach).padStart(6)} reach · ${display("int", c.interactions).padStart(4)} interactions · ER ${er}`);
    p(`        ${c.title || "(no caption)"}${c.url ? `\n        ${c.url}` : ""}`);
  }
  const pieceSum = content.reduce((t, c) => t + (c.interactions ?? 0), 0);
  if (content.length && cur.interactions !== null) {
    p(pieceSum === cur.interactions
      ? `  Per-piece interactions add to ${int(pieceSum)}, equal to the account figure.`
      : `  ! Per-piece interactions add to ${int(pieceSum)} against the account figure ${int(cur.interactions)}. Check for collab posts or a piece outside the list before using either.`);
  }

  if (drift.length) {
    p();
    p("DRIFT · today's reading against the ledger (informational)");
    for (const d of drift) p(`  ${d}`);
  }
  if (warnings.length) {
    p();
    p("WARNINGS");
    for (const w of warnings) p(`  ! ${w}`);
  }
  return L.join("\n");
}

function saveOutputs(pull, text) {
  const dir = path.join(process.cwd(), "pulls", "metricool", pull.clientId);
  fs.mkdirSync(dir, { recursive: true });
  const base = path.join(dir, `${pull.mon}_${addDays(pull.mon, 6)}`);
  fs.writeFileSync(`${base}.txt`, text + "\n");
  const { client, ...rest } = pull;
  fs.writeFileSync(`${base}.json`, JSON.stringify({ ...rest, blogId: client.blogId, requests: requestCount }, null, 2) + "\n");
  return path.relative(process.cwd(), base);
}

function record(pull, ledger) {
  const { client, clientId, weeks, byWeek, readAt } = pull;
  const book = (ledger[clientId] ||= {});
  const mon = weeks[weeks.length - 1], prevMon = weeks[weeks.length - 2];
  const keys = ["followers", "views", "reach", "reachPerDay", "interactions", "er", "accountsEngaged", "storiesImpressions",
    ...(client.facebook ? ["fbViews", "fbPageVisits", "fbFollowers"] : [])];
  const pickKeys = (f, ks) => Object.fromEntries(ks.filter((k) => f[k] !== null && f[k] !== undefined).map((k) => [k, f[k]]));
  book[mon] = { ...pickKeys(byWeek[mon], keys), source: `metricool-pull ${readAt}` };
  const restated = pickKeys(byWeek[prevMon], client.restate);
  if (Object.keys(restated).length) {
    book[prevMon] = { ...(book[prevMon] || {}), ...restated, restated: `metricool-pull ${readAt}` };
  }
  const sorted = Object.fromEntries(Object.entries(book).sort(([a], [b]) => a.localeCompare(b)));
  ledger[clientId] = sorted;
  fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2) + "\n");
}

/* ------------------------------------------------------------------ verify */

async function verify() {
  const lines = [];
  let failures = 0;
  const p = (s = "") => { lines.push(s); console.log(s); };
  p(`Metricool --verify · ${VERIFY_WEEKS[0]} to ${addDays(VERIFY_WEEKS[4], 6)} against known figures`);
  for (const clientId of ["nycds", "eec"]) {
    const exp = VERIFY[clientId];
    const pull = await pullClient(clientId, VERIFY_WEEKS[4]);
    p();
    p(`${CLIENTS[clientId].name} (brand ${CLIENTS[clientId].blogId})`);
    for (const [key, want] of Object.entries(exp)) {
      if (key === "reels") continue;
      const got = VERIFY_WEEKS.map((w) => pull.byWeek[w][key] ?? null);
      const bad = got.map((g, i) => {
        if (g === null) return true;
        const w = want[i];
        if (key === "interactions") return g < w || g > Math.ceil(w * 1.1) + 2; // can only grow
        if (i < 4 || key === "followers" || key.startsWith("fb")) return g !== w;
        return Math.abs(g - w) > Math.max(3, Math.ceil(w * 0.01)); // last week may still settle
      });
      const ok = !bad.some(Boolean);
      if (!ok) failures++;
      const via = pull.log.resolved[key] || "unresolved";
      p(`  ${ok ? "✓" : "✗"} ${key.padEnd(19)} ${ok ? "" : `got [${got.join(", ")}] want [${want.join(", ")}] `}via ${via}`);
    }
    for (const r of exp.reels) {
      const got = pull.content.find((c) => c.id === r.id);
      const ok = got && got.views >= r.views && got.reach >= r.reach && got.interactions >= r.interactions;
      if (!ok) failures++;
      p(`  ${ok ? "✓" : "✗"} reel ${r.id.padEnd(14)} ${got ? `${got.views} views · ${got.reach} reach · ${got.interactions} interactions` : "not in the reels list"} (want at least ${r.views} · ${r.reach} · ${r.interactions})`);
    }
    for (const w of pull.warnings) p(`  ! ${w}`);
    const dir = path.join(process.cwd(), "pulls", "metricool");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `verify_${clientId}.json`), JSON.stringify({ resolved: pull.log.resolved, unresolved: pull.log.unresolved, raw: pull.log.raw }, null, 2) + "\n");
  }
  p();
  p(failures ? `✗ ${failures} check(s) failed. Attach pulls/metricool/verify.txt and the two verify_*.json files.` : "✓ All checks passed. The pull reproduces the published figures; it is safe to use for the next cycle.");
  fs.writeFileSync(path.join(process.cwd(), "pulls", "metricool", "verify.txt"), lines.join("\n") + "\n");
  process.exit(failures ? 1 : 0);
}

/* -------------------------------------------------------------------- main */

async function discover() {
  const r = await get("/admin/simpleProfiles", {});
  const list = Array.isArray(r.json) ? r.json : Array.isArray(r.json?.data) ? r.json.data : null;
  if (!list) fail(`Could not list brands (HTTP ${r.status}): ${r.text}`);
  console.log(`Brands visible to this key (user ${USER_ID}):`);
  for (const b of list) {
    const ig = b.instagram ?? b.instagramData ?? b.networksData?.instagramData ?? "";
    console.log(`  ${String(b.id ?? b.blogId).padEnd(9)} ${String(b.label ?? b.name ?? "").padEnd(24)} ${ig}`);
  }
  for (const [id, c] of Object.entries(CLIENTS)) {
    const found = list.some((b) => Number(b.id ?? b.blogId) === c.blogId);
    console.log(`${found ? "✓" : "✗"} ${id}: brand ${c.blogId} ("${c.brand}") ${found ? "visible" : "NOT visible to this key"}`);
  }
}

async function main() {
  if (!TOKEN || !USER_ID) {
    fail("METRICOOL_USER_TOKEN and METRICOOL_USER_ID must be set in .env.local (run from the repo root).");
  }
  if (flag("--discover")) return discover();
  if (flag("--verify")) return verify();

  const clientId = (opt("--client") || "nycds").toLowerCase();
  if (!CLIENTS[clientId]) fail(`Unknown client "${clientId}". Use nycds or eec.`);
  const mon = opt("--week") || lastCompletedMonday();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(mon) || weekday(mon) !== 1) fail(`--week must be a Monday as YYYY-MM-DD (got ${mon}).`);
  if (addDays(mon, 7) > nyToday()) fail(`The week of ${short(mon)} has not closed yet in New York.`);

  const ledger = loadLedger();
  const pull = await pullClient(clientId, mon);
  const text = render(pull, ledger);
  console.log(text);
  const saved = saveOutputs(pull, text);
  console.log(`\nSaved ${saved}.txt and .json (${requestCount} requests).`);
  if (flag("--record")) {
    record(pull, ledger);
    console.log(`Ledger updated: ${range(mon)} recorded${CLIENTS[clientId].restate.length ? `, ${range(addDays(mon, -7))} restated (${CLIENTS[clientId].restate.join(", ")})` : ""}. Commit scripts/metricool-ledger.json with the cycle.`);
  } else {
    console.log("Ledger not updated. Run again with --record once these are the figures going into the report.");
  }
}

main().catch((e) => fail(e.stack || String(e)));
