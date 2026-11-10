/* ==========================================================================
   REVIEW DATA  ·  NYC Dental Smiles
   --------------------------------------------------------------------------
   The 3, 6 and 12-month review at /review. This is the only file that changes
   when the review moves forward a month; page.tsx in this folder holds the
   structure and styling, brand.ts the logo and monogram.

   Built the same way as the EEC review (ddspc-social-intelligence,
   src/app/review), with NYC Dental Smiles' own sources and brand.

   WINDOWS — rolling, each ending on the last full month (October 2026 here),
   each compared with the equal window just before it:
     3 months    Aug – Oct 2026        against May – Jul 2026
     6 months    May – Oct 2026        against Nov 2025 – Apr 2026
     12 months   Nov 2025 – Oct 2026   against Nov 2024 – Oct 2025

   COVERAGE RULE (Walter, Nov 9) — a measure appears only in the windows its
   source fully covers, and is compared only where the earlier window is
   covered too. Nothing is shown empty: an uncompared figure carries the date
   its record starts. What each source covers, from the Nov 9 pull:
     Instagram views         from Aug 23, 2025 (Metricool's account timelines)
     Instagram interactions  post history from June 2025
     Reach, engagement rate  from Jun 12, 2026, so the 3-month view only
     Follower gains/losses   from Jan 2026
     Facebook views          every month since Nov 2024
     Facebook page visits    from Mar 30, 2026
     Booking links           Dentrix links from Sep 12, 2025 (Murray Hill Oct
                             21); new links for each location from Sep 8, 2026
     Email                   every NYCDS email since Nov 2024 (none between
                             Dec 24, 2024 and Oct 14, 2025); confirmed opens on
                             every email from Apr 10, 2026
     Search                  US only, from Oct 7, 2025
     Website (GA4)           left out of every view: new visitors stop on
                             Sep 30, 2026 (see NOTES)

   US ONLY (Walter, Nov 9) — Search figures count the US only. Google lists
     only part of US search by page (188 of 631 clicks for Aug – Oct), so the
     client text gives no page figures. Walter, Nov 10: the client text does
     not say "US"; US is assumed. Internal notes still name it.

   SHORT LINKS — the NYCDS weekly basis: Short.io's unfiltered path view, which
     is the dashboard's Human clicks (the EEC review counts all clicks). Booking
     = the 4 Dentrix links and the 5 links created Sep 8, 2026 (4 to Weave,
     Murray Hill to the site's booking page), grouped by location. Website link
     clicks are held out of the client rows (see NOTES). Smile Pass, DDS-PC and
     unlisted paths are left out.

   SMILE PASS — out of the review (Walter, Nov 9: "The focus is NYCDS"),
     including the July 15, 2026 NYC Smile Pass announcement email.

   FACEBOOK — held out of the client view this edition: June 22 – July 31,
     2026 carries 20,051 of the year's 28,555 Facebook views, and decides the
     comparison in every window (3 months included). What ran then is with
     Walter; Facebook returns once that is settled. The figures are in NOTES.

   SOURCES — all read Nov 9, 2026:
     scripts/review-pull.mjs --client nycds → pulls/review/nycds/2026-10.json
       (md5 7386426f…, 218 requests, self-check 13 of 13 against the ledgers;
       Search and GA4 US only, all-country totals kept for the check)
     Constant Contact, read in the logged-in app (campaign details and each
       campaign's results). NYCDS = every sender other than EEC's ("Edgard El
       Chaar, DDS, PC", "DDS PC"), less the Smile Pass announcement: 49 sends,
       Nov 27, 2024 to Nov 5, 2026.
   ========================================================================== */

type Variant = "client" | "internal";
export const VARIANT: Variant =
  process.env.NEXT_PUBLIC_REPORT_VARIANT === "internal" ? "internal" : "client";
export const IS_INTERNAL: boolean = VARIANT === "internal";

export type WinId = "3m" | "6m" | "12m";

export const WINDOWS: { id: WinId; label: string; period: string; prior: string; months: string[]; priorMonths: string[] }[] = [
  { id: "3m", label: "3 months", period: "August – October 2026", prior: "May – July 2026",
    months: ["2026-08", "2026-09", "2026-10"], priorMonths: ["2026-05", "2026-06", "2026-07"] },
  { id: "6m", label: "6 months", period: "May – October 2026", prior: "November 2025 – April 2026",
    months: ["2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10"],
    priorMonths: ["2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04"] },
  { id: "12m", label: "12 months", period: "November 2025 – October 2026", prior: "November 2024 – October 2025",
    months: ["2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10"],
    priorMonths: ["2024-11", "2024-12", "2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09", "2025-10"] },
];
/* The window the page opens on. 12 months is the annual frame Walter asked for. */
export const DEFAULT_WIN: WinId = "12m";

type SectionDef = { id: string; label: string; internalOnly?: boolean };
export const ALL_SECTIONS: SectionDef[] = [
  { id: "numbers", label: "Numbers" },
  { id: "months", label: "By month" },
  { id: "worked", label: "What worked" },
  { id: "search", label: "Search" },
  { id: "notes", label: "Data notes", internalOnly: true },
  { id: "detail", label: "Detail" },
];
export const NAV = ALL_SECTIONS.filter((x) => IS_INTERNAL || !x.internalOnly);
export const has = (id: string) => NAV.some((n) => n.id === id);

const pick = <T,>(internal: T, client: T): T => (IS_INTERNAL ? internal : client);

/* Counts of 10,000 or more are shortened in the report text: rounded up to 3
   significant figures, so a figure is never shown below its true value and
   never 1% above it (Walter, Nov 9): 136,277 → 137k, 13,467 → 13.5k, 20,000 → 20k.
   Below 10,000 the exact count is shown. Data tables and chart tooltips keep
   exact counts. The same function as the EEC review. */
export const short = (v: number): string => {
  const a = Math.abs(v), sign = v < 0 ? "−" : "";
  if (a < 10000) return sign + a.toLocaleString("en-US");
  // Round up to 3 significant figures: 12.1k, 336k, 1.24M, 12.4M.
  if (a < 100000) return `${sign}${Math.ceil(a / 100) / 10}k`;
  if (Math.ceil(a / 1000) < 1000) return `${sign}${Math.ceil(a / 1000)}k`;
  if (a < 9990000) return `${sign}${Math.ceil(a / 10000) / 100}M`;
  if (a < 99900000) return `${sign}${Math.ceil(a / 100000) / 10}M`;
  return `${sign}${Math.ceil(a / 1000000)}M`;
};


/* ---------------------------------------------------------------- THE LEAD */
/* One hero per window; the switch shows one at a time. Figures and their
   `sub` lines are client-visible in both builds; only internalNote is not. */
type Lead = { kicker: string; headline: string; deck: string; figures: { v: string; l: string; sub: string }[]; internalNote: string; against: boolean };

const LEAD: Record<WinId, Lead> = {
  "12m": {
    kicker: "The year to October 31, 2026",
    against: false,
    headline: "2,211 booking link clicks and 2,703 clicks from Google search over the year.",
    deck: `Clicks from Google grew from 40 in November 2025 to more than 200 a month from January. Instagram views reached ${short(136277)}, and emails were delivered ${short(36989)} times.`,
    figures: [
      { v: "2,211", l: "Booking link clicks", sub: "Recorded from September 2025" },
      { v: "2,703", l: "Google search clicks", sub: "Recorded from October 2025" },
      { v: short(136277), l: "Instagram views", sub: "Recorded from August 23, 2025" },
    ],
    internalNote:
      `Only email compares at 12 months, and it does not lead: clicks 325 against 412, with the October 2025 new-website email (353) in the year before. Facebook is held out of the client view until Walter confirms what ran June 22 – July 31. Booking merges the 4 Dentrix links (from September 2025) with the 5 links of September 8, 2026 (396 clicks). Website link clicks are held out of the client rows.`,
  },
  "6m": {
    kicker: "May – October 2026",
    against: true,
    headline: "Instagram views rose 60% and email clicks 83% against November to April.",
    deck: "Email clicks rose 83% while deliveries rose only 8%, so the click rate rose to 1.09% from 0.65%. Booking link clicks reached 1,455, with each location’s new booking link live from September 8.",
    figures: [
      { v: short(83816), l: "Instagram views", sub: `Against ${short(52461)}` },
      { v: "210", l: "Email clicks", sub: "Against 115" },
      { v: "+109", l: "Net new followers", sub: "Daily figures start January 2026" },
    ],
    internalNote:
      `Views hold up without July: 13,293 a month against 8,744 (+52.0%). Booking stays out of the lead: 1,455 against 756 includes 396 on the September 8 links; the 4 Dentrix links read 1,059 against 756 (+40.1%). Search clicks +28.5% lean on November 2025 (40, the first full month): +10.8% a month without it. Responses +80.6% come mostly from posting more (72 pieces against 47; 22.7 a piece against 19.3). Name searches fall with Dr. El Chaar searches (619 appearances against 69): without them 15.4% against 16.2%. Facebook held out.`,
  },
  "3m": {
    kicker: "August – October 2026",
    against: true,
    headline: "Instagram responses more than doubled, and views rose 15% against May to July.",
    deck: "Dr. Tamay’s September 18 reel drew 177 responses, the most of any piece in the 12 months. Booking link clicks reached 852, with each location’s new booking link live from September 8.",
    figures: [
      { v: "1,145", l: "Instagram responses", sub: "Against 491" },
      { v: short(44824), l: "Instagram views", sub: `Against ${short(38992)}` },
      { v: "7.43%", l: "Engagement rate", sub: "Recorded from June 12, 2026" },
    ],
    internalNote:
      "Booking stays out of the lead: 852 against 603 includes 396 on the September 8 links; the 4 Dentrix links read 456 against 603 (−24.4%). Name searches clicked 16.3% against 10.4% rests on searches for Dr. El Chaar dropping away (29 appearances against 590); clicks 172 against 211. Search clicks −29.0% and appearances −64.8%. Facebook held out (May – July holds June 22 – July 31). Email clicks follow deliveries (13,467 against 5,775). Responses are not from posting more: 38 pieces against 34, 30.1 a piece against 14.4.",
  },
};

/* --------------------------------------------------------------- THE BRIEF */
const BRIEF = [
  { role: "The windows", text: "Each view ends October 31, 2026. 3 months is August to October, 6 months is May to October, and 12 months is November 2025 to October 2026. The review moves forward each month." },
  { role: "The comparison", text: "Each figure is compared with the equal period before it. Where that period has no full record, the figure stands alone with its start date." },
  { role: "What is left out", text: "A measure shows only in views its source fully covers. Website visits are left out while the site’s visit tracking is confirmed, and Facebook while we confirm a stretch from June 22 to July 31, 2026." },
];

/* -------------------------------------------------------------- THE NUMBERS */
/* Rows per window, in display order; groups render in the order they first
   appear. `prior` and `c` together, or `na` alone: never neither. Changes are
   percent for totals, points for rates, and a plain difference for net
   followers. Every note is client-visible unless it sits in noteInternal. */
export type Row = { group: string; k: string; v: string; prior?: string; c?: string; na?: string; note: string; noteInternal?: string };

const BOOK_DEF = "Clicks on each location’s booking links.";
const NEW_LINKS = "Each location also has a new booking link from September 8, 2026, and clicks on both count.";
const CLICKS_DEF = "People who clicked, counted once per email.";
const CONF_DEF = "Confirmed opens as a share of delivered emails";
const NAME_DEF = "Searches naming the practice or one of its doctors";
const SHORTIO_INT = "Short.io unfiltered path view (Human clicks), as the weekly report; every month read November 9.";

const NUMBERS: Record<WinId, Row[]> = {
  "3m": [
    { group: "Instagram", k: "Responses", v: "1,145", prior: "491", c: "+133.2%",
      note: "Likes, comments, saves and shares on pieces published in each period. Dr. Tamay’s September 18 reel drew 177.",
      noteInternal: "Metricool postsInteractions on the publish date, as read November 9; recent pieces are still gathering. 38 pieces on 37 days against 34 on 33: 30.1 a piece against 14.4." },
    { group: "Instagram", k: "Views", v: short(44824), prior: short(38992), c: "+15.0%",
      note: "Times the account’s content was seen." },
    { group: "Instagram", k: "Net new followers", v: "+55", prior: "+54", c: "+1 follower",
      note: "Followers gained less followers lost. Level with May to July. The account ended October at 790.",
      noteInternal: "Gained 85, lost 30, against 83 and 29. The account count moved from 735 on July 31 to 790 on October 31, matching the daily figures." },
    { group: "Instagram", k: "Reach per day", v: "168", na: "Recorded from June 12, 2026",
      note: "Average accounts reached per day.",
      noteInternal: `${short(15413)} summed daily reach over 92 days: August 174 a day, September 169, October 160. July ran at 917 a day with no July piece above 760 reach; unexplained, and outside this window.` },
    { group: "Instagram", k: "Engagement rate", v: "7.43%", na: "Recorded from June 12, 2026",
      note: "Responses divided by each day’s reach, summed over the period.",
      noteInternal: `1,145 interactions ÷ ${short(15413)} (reach per day × days), the weekly report’s formula.` },
    { group: "Short links", k: "Booking link clicks", v: "852", prior: "603", c: "+41.3%",
      note: `${BOOK_DEF} ${NEW_LINKS} The new links drew 396 of them; the 4 earlier links drew 456, against 603.`,
      noteInternal: `Lenox Hill 225, Plaza District 223, Upper East Side 175, Murray Hill 168, all locations 61; against 180, 141, 149, 133. ${SHORTIO_INT}` },
    { group: "Search", k: "Name searches clicked", v: "16.3%", prior: "10.4%", c: "+5.9 points",
      note: `${NAME_DEF} that led to a click: 172 clicks from 1,053 appearances, against 211 from 2,022. The rate rose mainly because searches for Dr. El Chaar by name showed this site far less often, 29 times against 590.`,
      noteInternal: "Rule v1-nov3 (practice name, nyc smiles, El Chaar, doctor surnames from the site’s doctor pages; site: queries out) on the US monthly query lists. El Chaar searches: 3 clicks from 590 appearances (May – July, weighted position 8.8) against 1 from 29 (August – October, positions 22 to 71, weighted 39.6). The pull does not show where those searches lead now. Without them, 16.7% against 14.5%." },
    { group: "Search", k: "Search click rate", v: "2.81%", prior: "1.39%", c: "+1.42 points",
      note: "Clicks as a share of appearances in Google results. The rate rose as the general searches described below fell away." },
    { group: "Search", k: "Search clicks", v: "631", prior: "889", c: "−29.0%",
      note: "Clicks from Google searches. May to July included June and July, the year’s 2 highest months, 297 and 312. Clicks have held between 201 and 227 a month since August.",
      noteInternal: "Clicks on queries at position 10 or better also eased: 175 against 238 (listed queries). Not explained by the general searches alone; watch the page-one terms." },
    { group: "Search", k: "Search appearances", v: short(22465), prior: short(63890), c: "−64.8%",
      note: "Times the site appeared in Google results. From March to July the homepage also appeared, well down the results, for general searches such as “dentist nyc”, which drew almost no clicks. Those appearances fell away from August.",
      noteInternal: "Average position 54.78 against 37.83 (kept out of the client rows: it follows the general-search appearances). June’s listed queries put 19,951 of 23,148 appearances beyond position 20." },
    { group: "Email", k: "Emails delivered", v: short(13467), prior: "5,775", c: "+133.2%",
      note: "Total deliveries across the period’s emails.",
      noteInternal: "11 sends on 7 dates against 8 on 5. 14,409 sent, 942 not delivered (6.5%), against 6,237 and 462 (7.4%). The July 15 Smile Pass announcement (729 delivered, 7 clicks) is left out." },
    { group: "Email", k: "Email clicks", v: "141", prior: "69", c: "+104.3%",
      note: `${CLICKS_DEF} Clicks rose with the number of emails delivered. The August 1 summer promotion drew 52.` },
    { group: "Email", k: "Email click rate", v: "1.05%", prior: "1.19%", c: "−0.15 points",
      note: "Clicks as a share of delivered emails. May to July included the July whitening promotion, at 1.36%." },
    { group: "Email", k: "Confirmed open rate", v: "10.40%", prior: "10.98%", c: "−0.58 points",
      note: `${CONF_DEF}: 1,400 against 634. May to July included the July whitening promotion, at 11.5%. All opens, including mail apps that load images on their own: 7,291, 54.1%.`,
      noteInternal: "5,891 of the 7,291 all opens are proxy." },
  ],
  "6m": [
    { group: "Instagram", k: "Views", v: short(83816), prior: short(52461), c: "+59.8%",
      note: "Times the account’s content was seen.",
      noteInternal: "Without July (17,351): 13,293 a month against 8,744, +52.0%. July reach ran at 917 a day with no piece above 760 reach." },
    { group: "Instagram", k: "Responses", v: "1,636", prior: "906", c: "+80.6%",
      note: "Likes, comments, saves and shares on pieces published in each period. The rise comes mostly from posting more often.",
      noteInternal: "72 pieces against 47; 22.7 a piece against 19.3." },
    { group: "Instagram", k: "Net new followers", v: "+109", na: "Daily figures start January 2026",
      note: "Followers gained less followers lost. The account ended October at 790.",
      noteInternal: "Gained 168, lost 59. November and December 2025 have no daily figures, so the earlier 6 months are not covered." },
    { group: "Email", k: "Emails delivered", v: short(19242), prior: short(17747), c: "+8.4%",
      note: "Total deliveries across the period’s emails.",
      noteInternal: "19 sends on 12 dates against 21 on 9. 1,404 not delivered (6.8%) against 1,050 (5.6%). The Smile Pass announcement is left out." },
    { group: "Email", k: "Email clicks", v: "210", prior: "115", c: "+82.6%",
      note: `${CLICKS_DEF} The August 1 summer promotion drew 52, and the July whitening promotion 50.` },
    { group: "Email", k: "Email click rate", v: "1.09%", prior: "0.65%", c: "+0.44 points",
      note: "Clicks as a share of delivered emails." },
    { group: "Email", k: "Confirmed open rate", v: "10.57%", na: "Every email from April 10, 2026",
      note: `2,034 confirmed opens, as a share of delivered emails. All opens, including mail apps that load images on their own: ${short(10274)}, 53.4%.`,
      noteInternal: "Before April 10 Constant Contact reported confirmed opens equal to all opens, except January 16 and 27 (30 proxy each) and February 11, which reads confirmed 0 on all 4 sends. So November to April has no comparable figure." },
    { group: "Short links", k: "Booking link clicks", v: "1,455", prior: "756", c: "+92.5%",
      note: `${BOOK_DEF} ${NEW_LINKS} The new links drew 396 of them; the 4 earlier links drew 1,059, against 756.`,
      noteInternal: `Lenox Hill 405, Plaza District 364, Upper East Side 324, Murray Hill 301, all locations 61; against 234, 199, 167, 156. Monthly 221, 155, 227, 195, 358, 299. ${SHORTIO_INT}` },
    { group: "Search", k: "Search clicks", v: "1,520", prior: "1,183", c: "+28.5%",
      note: "Clicks from Google searches. Google’s record for the site starts in October 2025, so the earlier period includes its first months.",
      noteInternal: "Without November 2025 (40): 253.3 a month against 228.6, +10.8%." },
    { group: "Search", k: "Search appearances", v: short(86355), prior: short(32138), c: "+168.7%",
      note: "Times the site appeared in Google results, including general searches such as “dentist nyc” from March to July, well down the results." },
    { group: "Search", k: "Name searches clicked", v: "12.5%", prior: "15.6%", c: "−3.2 points",
      note: `${NAME_DEF}: 383 clicks from 3,075 appearances, against 308 from 1,970. Clicks on these searches rose 24%. The rate fell mainly because searches for Dr. El Chaar by name showed this site 619 times, against 69, with few clicks.`,
      noteInternal: "El Chaar searches: 4 clicks from 619 appearances against 0 from 69. Without them, 15.4% against 16.2% (appearances 2,456 against 1,901)." },
    { group: "Search", k: "Search click rate", v: "1.76%", prior: "3.68%", c: "−1.92 points",
      note: "Clicks as a share of appearances. The general searches from March to July added many appearances with few clicks.",
      noteInternal: "Average position 42.24 against 27.13." },
  ],
  "12m": [
    { group: "Short links", k: "Booking link clicks", v: "2,211", na: "Recorded from September 2025",
      note: `${BOOK_DEF} ${NEW_LINKS} The new links drew 396 of them.`,
      noteInternal: `Lenox Hill 639, Plaza District 563, Upper East Side 491, Murray Hill 457, all locations 61. Dentrix 1,815. ${SHORTIO_INT}` },
    { group: "Search", k: "Search clicks", v: "2,703", na: "Recorded from October 2025",
      note: "Clicks from Google searches. They grew from 40 in November 2025 to more than 200 a month from January." },
    { group: "Search", k: "Search appearances", v: short(118493), na: "Recorded from October 2025",
      note: "Times the site appeared in Google results." },
    { group: "Search", k: "Name searches clicked", v: "13.7%", na: "Recorded from October 2025",
      note: `${NAME_DEF}: 691 clicks from 5,045 appearances. “nyc dental smiles” alone drew 332 clicks at an average position of 1.5.`,
      noteInternal: "Includes 688 appearances (4 clicks) on searches for Dr. El Chaar; without them, 15.8%." },
    { group: "Search", k: "Search click rate", v: "2.28%", na: "Recorded from October 2025",
      note: "Clicks as a share of appearances.",
      noteInternal: "Average position 38.15." },
    { group: "Instagram", k: "Views", v: short(136277), na: "Recorded from August 23, 2025",
      note: "Times the account’s content was seen." },
    { group: "Instagram", k: "Responses", v: "2,542", na: "Post history starts June 2025",
      note: "Likes, comments, saves and shares on pieces published in the year. Dr. Tamay’s September 18 reel drew the most, 177.",
      noteInternal: "119 pieces on 117 days. Metricool’s account timelines start August 23, 2025; interactions from June 20, 2025 come from its imported post history, so the year before is not covered." },
    { group: "Email", k: "Emails delivered", v: short(36989), prior: short(17684), c: "+109.2%",
      note: "Total deliveries across the year’s emails. The year before had emails in November and December 2024 and October 2025 only.",
      noteInternal: "40 sends on 21 dates against 8 on 4. 2,454 not delivered (6.2%) against 1,521 (7.9%). The Smile Pass announcement is left out." },
    { group: "Email", k: "Email clicks", v: "325", prior: "412", c: "−21.1%",
      note: `${CLICKS_DEF} The year before included the October 2025 email introducing the new website, which drew 353, the most of any email.` },
    { group: "Email", k: "Email click rate", v: "0.88%", prior: "2.33%", c: "−1.45 points",
      note: "Clicks as a share of delivered emails. The new-website email drew clicks from 4.5% of deliveries." },
  ],
};

/* ---------------------------------------------------------- MONTH BY MONTH */
/* Small multiples. Bars take the window's colors through CSS: plum for the
   window, steel for the earlier window where that window is compared
   (`priorIn`), pale for every other month. */
export type Chart = { id: string; title: string; unit: string; note: string; priorIn: WinId[]; points: { m: string; v: number }[]; caption: Partial<Record<WinId, string>> };

const months = (start: string, values: number[]) => {
  const [y0, m0] = start.split("-").map(Number);
  return values.map((v, i) => {
    const t = (m0 - 1) + i;
    return { m: `${y0 + Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, "0")}`, v };
  });
};

const CHARTS_ALL: (Chart & { internalOnly?: boolean; clientOnly?: boolean })[] = [
  { id: "c-book", title: "Booking link clicks", unit: "clicks", priorIn: ["3m", "6m"],
    points: months("2025-09", [60, 110, 115, 84, 123, 166, 148, 120, 221, 155, 227, 195, 358, 299]),
    note: "From September 2025. New links for each location went live September 8, 2026.",
    caption: { "3m": "852 against 603", "6m": "1,455 against 756", "12m": "2,211 · recorded from September 2025" } },
  { id: "c-resp", title: "Instagram responses", unit: "responses", priorIn: ["3m", "6m"],
    points: months("2025-09", [171, 40, 73, 198, 156, 191, 120, 168, 193, 66, 232, 352, 499, 294]),
    note: "By month published, from September 2025.",
    caption: { "3m": "1,145 against 491", "6m": "1,636 against 906", "12m": "2,542 · post history starts June 2025" } },
  { id: "c-views", title: "Instagram views", unit: "views", priorIn: ["3m", "6m"],
    points: months("2025-09", [8418, 24309, 6524, 10605, 5208, 7383, 7954, 14787, 9462, 12179, 17351, 15718, 13377, 15729]),
    note: "From September 2025.",
    caption: { "3m": `${short(44824)} against ${short(38992)}`, "6m": `${short(83816)} against ${short(52461)}`, "12m": `${short(136277)} · recorded from August 23, 2025` } },
  { id: "c-search", title: "Search clicks", unit: "clicks", priorIn: ["3m", "6m"],
    points: months("2025-11", [40, 161, 214, 256, 235, 277, 280, 297, 312, 227, 203, 201]),
    note: "From November 2025, the first full month on record.",
    caption: { "3m": "631 against 889", "6m": "1,520 against 1,183", "12m": "2,703 · recorded from October 2025" } },
  { id: "c-mail", title: "Email clicks", unit: "clicks", priorIn: ["3m", "6m", "12m"],
    points: months("2024-11", [0, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 385, 52, 18, 20, 20, 0, 5, 3, 16, 50, 52, 19, 70]),
    note: "By month sent. No email went out from January to September 2025 or in March 2026; the November 2024 email drew no clicks.",
    caption: { "3m": "141 against 69", "6m": "210 against 115", "12m": "325 against 412" } },
  { id: "c-fb", title: "Facebook views", unit: "views", priorIn: ["3m", "6m", "12m"], internalOnly: true,
    points: months("2024-11", [25, 40, 62, 79, 30, 29, 26, 75, 69, 32, 450, 722, 126, 477, 305, 571, 781, 1518, 1068, 10929, 9722, 1370, 696, 992]),
    note: "Every month since November 2024. June and July 2026 include the stretch from June 22 to July 31.",
    caption: { "3m": `3,058 against ${short(21719)}`, "6m": `${short(24777)} against 3,778`, "12m": `${short(28555)} against 1,639` } },
];

/* ------------------------------------------------------------ WHAT WORKED */
export type Piece = { url: string; format: string; date: string; title: string; views: number; reach: number; responses: number; why?: string };

const P = {
  tamay: { url: "https://www.instagram.com/reel/DdbtWpZJZUm/", format: "Reel", date: "September 18, 2026", title: "Dr. Tamay on helping every patient feel comfortable, heard and confident", views: 3202, reach: 1612, responses: 177,
    why: "47 seconds with Dr. Tamay on how she works with the practice’s specialists to make each patient feel supported. The most responses of any piece in the 12 months, with 11 comments and 13 shares, and the best response rate of any piece above 1,000 reach, 11.0%." },
  team: { url: "https://www.instagram.com/p/DbtibXmFvC9/", format: "Post", date: "August 6, 2026", title: "Behind every great patient experience is an incredible team", views: 3011, reach: 931, responses: 66 },
  wellness: { url: "https://www.instagram.com/p/DePqlGSFqjX/", format: "Post", date: "October 8, 2026", title: "At the Manhattan Magazine Wellness Event at Hudson Yards", views: 2808, reach: 1069, responses: 43 },
  person: { url: "https://www.instagram.com/reel/DdpAub1p424/", format: "Reel", date: "September 23, 2026", title: "Great dental care starts with knowing the person behind the smile", views: 1254, reach: 769, responses: 93 },
  implants: { url: "https://www.instagram.com/reel/DYP-UpfJ_26/", format: "Reel", date: "May 12, 2026", title: "Dr. Tamay on common misconceptions about dental implants", views: 2313, reach: 1998, responses: 68 },
  farahani: { url: "https://www.instagram.com/reel/DSLU2lCkkf1/", format: "Reel", date: "December 12, 2025", title: "This or That with Dr. Farahani", views: 3759, reach: 2634, responses: 74 },
  cosmetic: { url: "https://www.instagram.com/reel/DVRaFcHkXHB/", format: "Reel", date: "February 27, 2026", title: "Before choosing cosmetic dentistry, watch this", views: 2902, reach: 2219, responses: 120 },
} satisfies Record<string, Piece>;

const WORKED: Record<WinId, { gallery: Piece[]; note: string }> = {
  "3m": { gallery: [P.team, P.wellness, P.person],
    note: "The next 2 by views, plus the September 23 reel: the second-most responses in the period, 93, from 769 accounts reached." },
  "6m": { gallery: [P.team, P.wellness, P.implants],
    note: "The next 2 by views, plus Dr. Tamay’s May 12 reel on dental implants: the widest reach in the period, 1,998." },
  "12m": { gallery: [P.farahani, P.cosmetic, P.team],
    note: "Dr. Farahani’s This or That reel: the most views and the widest reach of the year. Dr. Tamay’s February 27 reel on cosmetic dentistry: the second-most responses, 120. The August 6 team post: the third-most views." },
};

/* ------------------------------------------------------------------ SEARCH */
const SEARCH_TABLE = {
  head: ["Month", "Search clicks", "Appearances", "Click rate", "Position", "Name searches clicked"],
  rows: [
    ["November 2025", "40", "1,018", "3.93%", "26.53", "19.5%"],
    ["December 2025", "161", "4,036", "3.99%", "26.28", "16.9%"],
    ["January 2026", "214", "3,307", "6.47%", "15.79", "17.2%"],
    ["February 2026", "256", "4,514", "5.67%", "22.57", "20.6%"],
    ["March 2026", "235", "9,163", "2.56%", "26.91", "13.7%"],
    ["April 2026", "277", "10,100", "2.74%", "33.49", "12.0%"],
    ["May 2026", "280", "12,651", "2.21%", "35.33", "11.3%"],
    ["June 2026", "297", "29,605", "1.00%", "39.89", "9.3%"],
    ["July 2026", "312", "21,634", "1.44%", "36.49", "10.8%"],
    ["August 2026", "227", "11,064", "2.05%", "60.18", "17.7%"],
    ["September 2026", "203", "5,454", "3.72%", "51.53", "16.4%"],
    ["October 2026", "201", "5,947", "3.38%", "47.72", "14.8%"],
  ],
};

const SEARCH_CLIENT = [
  "Google’s record for the site starts in October 2025. Clicks grew from 40 in November to more than 200 a month from January, reached 312 in July, and have held between 201 and 227 a month since August.",
  "Searches for the practice by name lead. “nyc dental smiles” drew 332 clicks over the year at an average position of 1.5, and searches naming the practice or one of its doctors led to a click 13.7% of the time.",
  `From March to July the homepage also appeared for general searches such as “dentist nyc”, mostly well down the results, where it drew almost no clicks. Appearances peaked in June at ${short(29605)} and those general searches fell away from August, which is why appearances and the average position moved far more than clicks.`,
  "Website visits are left out while the site’s visit tracking is confirmed.",
];

const SEARCH_INTERNAL = [
  "Google lists only part of US search by page: 188 of 631 US clicks for August to October, 785 of 2,703 over the 12 months. So the client text gives no page figures. On the listed rows, doctor pages took 23 clicks from 415 appearances (5.5%) against 30 from 591 (5.1%) at 3 months, and 53 from 1,006 (5.3%) against 37 from 385 (9.6%) at 6 months. The homepage took 126 of the 188 listed clicks; Locations 20, Dr. Chesner 9, Meet Our Dentists 8, Dr. Giraldo 7.",
  "The general searches: in June, 8 queries such as “dentist nyc”, “dentists in new york” and “dentist office new york ny” each drew between 1,123 and 1,411 appearances at average positions of 32 to 61, with no clicks. Listed queries beyond position 20 carried 19,951 of June’s 23,148 listed appearances. Clicks on queries at position 10 or better also eased, 238 (May to July) to 175 (August to October), so the August step down is not only the general searches.",
  "Website (GA4): new visitors stop on September 30, 2026. October reads 14 US new visitors (23 all countries) on 323 sessions, 126 with no source. Every view ends in October, so the website is out of all 3. Through September, US visits from Google ran 290 (June), 249, 231 and 200; US new visitors 326, 451, 339 and 245. The weekly report already says the website figures are being confirmed.",
  "Searches by name use rule v1-nov3 on the US monthly query lists, with doctor surnames from the 12-month doctor pages: Chesner, Eisdorfer, Elchami, Farahani, Giraldo, Kapparova, Tamay. Top named queries over the year: “nyc dental smiles” 332, “nyc dental smile team” 74, “nyc smiles” 54, “dr michael chesner” 32, “michael chesner” 30.",
];

/* ------------------------------------------------------------ DATA NOTES */
const NOTES = [
  { title: `Facebook views: ${short(20051)} between June 22 and July 31`, body: `That is 70% of the 12 months’ ${short(28555)} (June 1 to 21 recorded 600). Page visits peaked on June 22 (59). The same stretch has Instagram reach at 917 a day in July with no July piece above 760 reach, and 293 /nycds-website clicks in July. It decides the Facebook comparison in every window: 3 months 3,058 against 21,719 (−85.9%; without the stretch 33.2 a day against 32.1, +3.6%), 6 months 24,777 against 3,778, 12 months 28,555 against 1,639. Page visits: 3 months 175 against 320, 6 months 495 (from March 30, 2026). So Facebook is held out of the client view until Walter confirms what ran; if it was a boost or an ad, report it as paid or take it out. The chart stays in the internal build. The year before is thin too: Metricool returns Facebook views on 8 to 14 days a month before September 2025 (a day without views has no row).` },
  { title: "Website visit tracking stops on September 30, 2026", body: "GA4 US new visitors read 14 for October (all countries 23), and 126 of 323 October sessions have no source, against 8 of 481 in September. Every window ends in October, so website figures are out of all 3; the client brief and FAQ say they are being confirmed, as the weekly report does. The pull already leaves out gipkd.com, figmentcreative.com and every *.vercel.app source." },
  { title: "Booking links: 2 sets, one basis in every window", body: "The 4 Dentrix links (NYCDS-58th-Street, NYCDS-60th-Street, NYCDS-5thAve from September 12, 2025; NYCDS-35thStreet from October 21, 2025) and the 5 links created September 8, 2026 (4 to Weave, including all locations, which shares the Upper East Side address; murray-hill-booking to the site’s booking page) count together, as in the weekly report. Every window gives the total, with the new links’ 396 and the earlier links’ figure in the client note; booking does not lead the 3 or 6-month view. The Dentrix links alone: 456 against 603 at 3 months (−24.4%), 1,059 against 756 at 6 months (+40.1%). /nycds-5thave (lowercase) counts with NYCDS-5thAve, as in the weekly pull; the older /60thStreet and /58thStreet paths (not on the allowlist) are left out." },
  { title: "Website link clicks are held out of the client rows", body: "6 months read 751 against 352, all of it from July (325, unexplained) and October (200, mostly the boosted Facebook post: 152 of the week of October 26, 114 attributed); the other 4 months average 56.5 against 58.7. The bare short domain has also been a link page made in Short.io since February 25, 2026, not the homepage (23 to 183 clicks at 6 months). 3 months 338 against 413; 12 months 1,103. The client copy does not mention the boost (Nov 2 rule)." },
  { title: "Search: general searches and Dr. El Chaar searches", body: "Appearances rose from about 4,000 a month (December to February) to 29,605 in June as the homepage showed for general searches at positions 30 to 60, then fell from August. They drive the appearances, click rate and position comparisons at 3 and 6 months; the client notes explain them. Separately, searches for Dr. El Chaar by name (inside the name rule) showed this site 590 times May to July (weighted position 8.8) and 29 times August to October (39.6): that, not more clicks, lifts the 3-month name-search rate (clicks 172 against 211; without El Chaar searches 16.7% against 14.5%) and lowers the 6-month one (619 against 69; without them 15.4% against 16.2%). Both client notes say so. Decide whether El Chaar stays in the NYCDS name rule (it is in the weekly rule v1-nov3). Search Console starts October 7, 2025." },
  { title: "Instagram history", body: "Metricool’s account timelines start August 23, 2025; interactions from June 20, 2025 come from its imported post history; the follower count starts June 17, 2026 and daily gains and losses January 2026. So 12-month views and responses stand alone, and net followers compare only at 3 months." },
  { title: "Email: what counts as NYCDS", body: "Every Constant Contact sender other than EEC’s, less the July 15 NYC Smile Pass announcement (Smile Pass is out of the review): 49 sends since November 2024. That includes the small event lists (White Party, Manhattan Magazine, Dr. Eisdorfer’s party). The 2 Oral Genome emails are sent as “Edgard El Chaar, DDS, PC” and are counted in the EEC review, not here; the NYCDS October 26 – November 1 report counted the second as NYCDS. No NYCDS email went out between December 24, 2024 and October 14, 2025." },
  { title: "Short links count Human clicks here, all clicks in EEC", body: "This review uses the NYCDS weekly basis (Short.io’s unfiltered path view, which equals the dashboard’s Human clicks). The EEC review counts all clicks. The 2 reviews’ short-link figures are not on the same basis (open decision 3 in the NYCDS handoff)." },
  { title: "Self-check passed", body: "The pull rebuilt the October 19 week from its monthly data and matched the ledgers (all-country): Search 43 clicks and 1,699 impressions at position 49.2, GA4 3 new visitors, Instagram 2,962 views, 138 reach per day, 782 followers, Facebook 202 views and 10 page visits, Short.io 82 named clicks. Instagram interactions read 86 against the 63 published, as expected: pieces keep gathering after a week closes. US Search and GA4 figures sit within the all-country figures in every month." },
];

/* ---------------------------------------------------------------- DETAIL */
type Panel = { id: string; title: string; rows: [string, string][]; note: string; noteClient?: string; faq?: { q: string; a: string }[] };

const DETAIL_PANELS: Panel[] = [
  { id: "coverage", title: "What each source covers",
    rows: [
      ["Instagram views", "August 23, 2025 onward"],
      ["Instagram responses", "Post history from June 2025"],
      ["Followers gained and lost", "January 2026 onward"],
      ["Instagram reach and engagement rate", "June 12, 2026 onward"],
      ["Booking links", "September 2025 onward; new links for each location from September 8, 2026"],
      ["Email", "NYC Dental Smiles emails since November 2024"],
      ["Confirmed email opens", "Every email from April 10, 2026"],
      ["Search", "October 2025 onward"],
      ["Website visits", "Left out while the site’s visit tracking is confirmed"],
    ],
    note: "From the November 9 pull. A measure appears in a view only when its source covers every month of it, and is compared only when the earlier window is covered as well. Search Console starts October 7, 2025. GA4 starts October 10, 2025 and its new visitors stop on September 30, 2026, so the website is out of every view this edition.",
    noteClient: "A measure appears in a view only when its record covers every month, and is compared only when the earlier period is covered too." },
  { id: "method", title: "How the figures are measured",
    rows: [],
    note: "Instagram and Facebook: Metricool account timelines summed by day in New York time; responses are interactions (likes, comments, saves, shares) on feed posts and reels on their publish date; engagement rate is interactions ÷ summed daily reach. Short links: Short.io path view, unfiltered (Human clicks), nycdentalsmileteam.short.gy; booking = the 4 Dentrix links and the 5 links of September 8, 2026, by location; website links held out; Smile Pass, DDS-PC and unlisted paths left out. Email: Constant Contact per-send results, rates on delivered, the Smile Pass announcement left out. Search: Search Console daily rows filtered to the US, position impression-weighted; searches by name on rule v1-nov3 over the US monthly query lists.",
    noteClient: "Instagram figures are summed by day. Responses are likes, comments, saves and shares on pieces published in the period; engagement rate is responses divided by each day’s reach, summed. Short links count clicks on each location’s booking links. Email clicks count each person once per email; email rates use delivered emails. Search figures come from Google.",
    faq: [
      { q: "Why do some figures have no comparison?", a: "A figure is compared only when its source fully covers the earlier period. Otherwise it shows the date its record starts." },
      { q: "Why is Facebook not shown?", a: "Facebook views from June 22 to July 31, 2026 ran far above any other part of the year, and that stretch falls inside every comparison here. We are confirming it, and Facebook returns in a later edition." },
      { q: "Why are website visits not shown?", a: "Website visits are left out while the site’s visit tracking is confirmed. Every view here includes October, and the visits return once the tracking is confirmed." },
      { q: "Why does each location have more than one booking link?", a: "Each location kept its earlier booking link when its new one went live on September 8, 2026. Clicks on both count." },
      { q: "Why are email opens shown as confirmed opens?", a: "Many mail apps open every message on arrival to load images. Confirmed opens count people only; the email platform has reported them on every email since April 2026. All opens are shown alongside." },
      { q: "Why does Instagram’s app show different numbers?", a: "The app counts views differently and keeps updating. Every Instagram figure here comes from one reporting tool, read November 9, 2026, so the periods compare." },
      { q: "Will these figures change?", a: "Slightly. Responses keep coming in after a piece is published, Google keeps processing recent days, and short-link counts can be revised." },
      { q: "How often is the review updated?", a: "Monthly. Each view moves forward one month." },
    ] },
];

/* --------------------------------------------------------------- EXPORT */
export const RV = {
  client: "NYC Dental Smiles",
  studio: "Figment Creative",
  readOn: "November 9, 2026",
  lead: LEAD,
  brief: BRIEF,
  numbers: {
    lede: "Each measure against the equal period before it. Figures without a comparison show when their record starts.",
    rows: Object.fromEntries(
      (Object.keys(NUMBERS) as WinId[]).map((w) => [w, NUMBERS[w].map((r) => ({ ...r, noteInternal: IS_INTERNAL ? r.noteInternal : undefined }))]),
    ) as Record<WinId, Row[]>,
  },
  months: {
    lede: "Each measure by month. Plum is the selected period, steel the period it is compared with.",
    charts: CHARTS_ALL.filter((c) => (IS_INTERNAL ? !c.clientOnly : !c.internalOnly)) as Chart[],
  },
  worked: {
    lede: "The Instagram pieces that went furthest.",
    hero: P.tamay as Piece,
    byWin: WORKED,
    footnote: "Read November 9, 2026. Pieces keep gathering responses.",
  },
  search: {
    lede: "The new site’s first year in Google.",
    paras: SEARCH_CLIENT,
    parasInternal: IS_INTERNAL ? SEARCH_INTERNAL : [],
    table: SEARCH_TABLE,
    tableNote: "Google’s search reporting. Position is the average place in the results, lower is better. Name searches clicked: searches naming the practice or one of its doctors that led to a click.",
  },
  notes: { lede: "Gaps, oddities and open questions. Internal only.", items: IS_INTERNAL ? NOTES : [] },
  detail: { lede: "How the review is built and what each source covers.", panels: DETAIL_PANELS.map((p) => ({ ...p, note: pick(p.note, p.noteClient ?? p.note) })) },
};
