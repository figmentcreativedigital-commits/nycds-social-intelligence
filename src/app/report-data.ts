/* ==========================================================================
   REPORT DATA  ·  NYC Dental Smiles
   --------------------------------------------------------------------------
   THIS CYCLE — a single week.
     November 9 – 15 against November 2 – 8: two 7-day windows, Monday to
     Sunday, directly comparable. Built on the 4 API pulls
     (scripts/*-pull.mjs), all read November 16, 8:35 AM. Metricool account
     totals for both weeks read November 16: November 2 – 8 restated views
     3,739 to 3,744 and Facebook views 188 to 194; reach per day 231
     unchanged. Per-piece figures keep their day-after reading (interactions
     141, engagement rate 8.72%).

   READ-DATE RULE — Metricool per-piece figures are each read the day after
     their week closed.

   WEBSITE (GA4) — the October 19 fix still does not show. The pull reads 77
     sessions and 3 new visitors, 34 with no source (44%), against 46, 1 and
     22 the week before once its spam referral was removed. No spam referral
     this week. 3 sessions came from figmentcreative.com (Figment’s own
     visits); kept in, as NYCDS has no own-traffic rule yet (EEC removes
     them from November 9). Constant Contact sessions (3) come from earlier
     emails: no email went out this week (Walter, Nov 16). Client copy says
     website figures are being confirmed; no comparison; period line stays
     on Search Console clicks.

   BOOSTED POST — the NYC Dental Smiles boost (“Figment Creative 4743
     Standard Boosted Out of Feed”) still has no Meta figures. Walter’s Nov 2
     rule stands: report it as NYC Dental Smiles paid once its figures are
     pulled; until then internal only. /nycds-website drew 47 clicks this
     week against 90, which points to the boost having ended or slowed.

   SHORT LINKS — Short.io API pull, path view, unfiltered (equal to the
     dashboard’s Human clicks), every week read November 16 (Walter, Nov 9:
     one reading date for every week shown). Booking 96 against 54; trend
     94, 50, 59, 54, 96 (October 12 now reads 94, published 95). Murray Hill
     28, Lenox Hill 24, Plaza District 22, Upper East Side 19, all locations
     3, Dentrix Ascend links included (Walter, Nov 2). Veterans Day
     nomination: /vdaynom26 6 and /y9wdZ7 3, 9 against 13; nominations
     closed November 11. /nycsmilepass (11, against 453) is reported under
     Smile Pass. /* catch-all drew 573 clicks against 2: excluded, flagged
     internally. /4NwBwU (4) opens the same Modern Luxury article as
     /thewellnessconnection (1), which Walter ignores (Nov 9), so it is
     ignored too; /dgMYW6 (Top Docs article, 1) unidentified and omitted.

   SEARCH — Search Console API pull (the Chart.csv figures). November 2 – 8
     re-read November 16, unchanged: 37 clicks on 1,365 appearances. Searches
     by name on the written rule v1-nov3: 5 clicks from 82 appearances. Doctor
     pages count every /dr-<name>/ and /doctors/dr-<name>/ address: 16 clicks
     from 275 appearances, against 6 from 261. Dr. Doris Giraldo’s page drew
     no appearances for a 2nd week.

   EMAIL — no campaign November 9 – 15 (Walter, Nov 16). detail.email is
     null, so the panel does not render.

   SOCIAL — hidden until the social lead’s write-up arrives after first review.

   SMILE PASS — July 1 – November 15. Daily visitors from the GA4 pull,
     property NYC Dental Smiles Membership: 3,413 to date, 29 this week
     against 243. Organic social from the Metricool connector (brand
     6517050), read November 16: Instagram 50 followers (51 on November 8),
     Facebook 40; 8 reels, 4,194 organic views, 318 average reach; no new
     reels this week.
     Membership leads 10, unchanged: the website’s lead list of 13 entries
     (Walter’s WordPress screenshot, November 16), less 2 repeat submissions
     and 1 entry on November 10 that Walter says is not a lead. The Figment
     test entry no longer shows in the list (1 entry is in the trash). Names
     stay out of this file because the repo is public. Walter: call them
     membership leads.
     Fall ads: Meta’s final campaign export for October 1 – November 10;
     both ended November 9. Reel Leads Fall 2026 $399.88 of $400, reach
     7,884, 12,198 impressions, link CTR 14.09%, no results recorded. Reel
     Engagement/Follows Fall 2026 $99.93 of $100, reach 2,666, 4,216
     impressions, link CTR 6.21%, 336 profile visits at $0.30. Total $499.81
     of $500, 16,414 impressions. No quality ranking in this export.

   CONTENT PUBLISHED — removed from the ledger and client-facing detail at
     Walter’s request.

   ENCODING — literal characters for apostrophes, dashes and the minus sign.
     No backslash-u escapes anywhere in the strings.

   Nothing here is estimated or inferred. Every value is carried from a source
   export, or is plain arithmetic on two figures already present.
   ========================================================================== */

type Variant = "client" | "internal";

export const VARIANT: Variant =
  process.env.NEXT_PUBLIC_REPORT_VARIANT === "internal" ? "internal" : "client";
export const IS_INTERNAL: boolean = VARIANT === "internal";

export const REPORT = {
  client: { name: "NYC Dental Smiles", short: "NYCDS", agency: "Figment Creative" },

  period: {
    label: "November 9 – 15, 2026",
    length: "7 days",
    comparedWith: "the 7 days before it (November 2 – 8)",
    paidStatus:
      "Both weeks are 7 days, Monday to Sunday, so every comparison is direct.",
  },

  copy: {
    scoreboard: {
      title: "The week in numbers",
      lede: "Each measure this week and the week before, with its trend over the last 5 weeks. This week is the plum point.",
    },
    worked: {
      title: "Dr. Farahani’s bridge restoration led the week",
      galleryTitle: "The feed pieces from this week, ranked by views",
    },
    attention: {
      title: "What needs attention",
      lede: "7 things worth a second look, each labeled so it is clear which to act on and which to note.",
    },
    learned: {
      title: "Learnings",
      lede: "6 things worth carrying into the next report.",
    },
    moves: {
      title: "Recommended next moves",
      lede: "7 actions, each with the reason behind it and the number that shows whether it worked.",
    },
    detail: {
      title: "Supporting detail",
      lede: "The figures behind the report. Open only what you need.",
    },
  },

  /* ------------------------------------------------------------- THE BRIEF */
  brief: {
    title: "The Brief",
    lede: "The week in brief.",
    head: "Booking links rose to 96 from 54, the most of the 5 weeks shown, with every location up. Google clicks 42 against 37 on 1,534 appearances, average position 38.6 from 43.8, and doctor-page click rate 5.8% from 2.3%. Instagram fell back after the Veterans Day reel week: reach per day 141 against 231, interactions 27 against 141, engagement rate 2.74%. Followers 801. Smile Pass drew 29 new visitors against 243 once the fall ads ended November 9; membership leads hold at 10.",
    headClient: "Booking links drew 96 clicks, up from 54, with every location rising. Clicks from Google rose to 42, and doctor pages clicked through 5.8% of the time, up from 2.3%. On Instagram, Dr. Farahani’s bridge restoration led the week, and followers rose to 801.",
    items: [
      {
        role: "The outcome",
        text: "Booking links 54 to 96: Murray Hill 10 to 28, Plaza District 9 to 22, Upper East Side 10 to 19, Lenox Hill 20 to 24. The link page drew 28 clicks against 3. Google clicks 37 to 42, appearances 1,365 to 1,534, average position 43.8 to 38.6.",
        client: {
          role: "The standout",
          text: "Booking links drew 96 clicks, up from 54, and every location rose: Murray Hill 28, Lenox Hill 24, Plaza District 22 and Upper East Side 19.",
        },
      },
      {
        role: "Strongest signal",
        text: "Doctor-page click rate 2.3% to 5.8%: 16 clicks from 275 appearances, 6 of them on Dr. Tamay’s page. Dr. Farahani’s November 10 bridge post led Instagram: 305 views, 10.4%. Followers 798 to 801; 9 Stories drew 321 impressions against 206.",
        client: {
          role: "The wider picture",
          text: "Doctor pages clicked through from Google 5.8% of the time, up from 2.3%, led by Dr. Tamay’s page. On Instagram, Dr. Farahani’s bridge restoration drew the week’s highest engagement rate, 10.4%, and followers rose to 801.",
        },
      },
      {
        role: "What softened",
        text: "Instagram after the Veterans Day reel week: reach per day 231 to 141, interactions 141 to 27, engagement rate 8.72% to 2.74%, views 3,744 to 2,596. Name searches 20.0% to 6.1%. Facebook page visits 24 to 12. GA4 still shows the gap: 3 new visitors, 34 of 77 sessions with no source. Smile Pass 29 new visitors after the ads ended.",
        client: {
          role: "What we are monitoring",
          text: "We are confirming the website’s visit tracking after last month’s fix, so website figures are shown without a comparison this week.",
        },
      },
      {
        role: "Next action",
        internalOnly: true,
        text: "Confirm the GA4 tag with Aren and Johana. Find what sent 573 clicks to short-link addresses that do not exist. Pull the boosted post’s Meta figures. Check Dr. Giraldo’s page with Aren. Plan the next doctor-led reel.",
        client: {
          role: "What we are doing next",
          text: "We will keep building on the doctor-led content that led this week.",
        },
      },
    ] as { role: string; text: string; internalOnly?: boolean; client?: { role: string; text: string } }[],
  },

  /* ------------------------------------------------------------ SCOREBOARD */
  /* The ledger. `trend` runs oldest to newest and ends with this week. Each
     earlier point is that week's most recent reading, as published. Booking
     links are restated on the current rules for every week shown, all read
     the same day (Dentrix links included from the Nov 2 – 8 cycle).
     Change strings start with "+" or "−" (minus sign) to draw an arrow. */
  scoreboard: {
    weeks: ["Oct 12", "Oct 19", "Oct 26", "Nov 2", "Nov 9"],
    cols: [
      { label: "This week", sub: "Nov 9 – 15" },
      { label: "Previous week", sub: "Nov 2 – 8" },
    ],
    rows: [
      { group: "Booking links", k: "Booking link clicks", note: "Murray Hill 28, Lenox Hill 24, Plaza District 22, Upper East Side 19, all locations 3. Every week is read the same day; the latest week may still rise.", cells: [{ v: "96", c: "+78%" }, { v: "54" }], trend: [94, 50, 59, 54, 96], fmt: "int" },
      { group: "Google search", k: "Doctor page click rate", note: "All doctor pages: 16 clicks from 275 appearances. Dr. Tamay’s page led with 6.", cells: [{ v: "5.8%", c: "+3.5 points" }, { v: "2.3%" }], trend: [10.6, 4.8, 5.0, 2.3, 5.8], fmt: "pct1" },
      { group: "Google search", k: "Clicks", note: "Monday, November 9, led with 11.", cells: [{ v: "42", c: "+5" }, { v: "37" }], trend: [58, 43, 41, 37, 42], fmt: "int" },
      { group: "Google search", k: "Times the site appeared", note: "1,534 times in Google results, with the average position improving to 38.6 from 43.8.", cells: [{ v: "1,534", c: "+12%" }, { v: "1,365" }], trend: [1554, 1699, 1499, 1365, 1534], fmt: "int" },
      { group: "Google search", k: "Click rate", note: "Share of appearances that led to a click, steady with the week before.", cells: [{ v: "2.74%", c: "+0.03 points" }, { v: "2.71%" }], trend: [3.73, 2.53, 2.74, 2.71, 2.74], fmt: "pct" },
      { group: "Google search", k: "Searches by name", note: "Click rate on searches for the practice or a doctor: 5 clicks from 82 appearances, against 75 the week before, when “nyc dental smiles lenox hill” alone drew 7.", cells: [{ v: "6.1%", c: "−13.9 points" }, { v: "20.0%" }], trend: [11.7, 14.9, 15.7, 20.0, 6.1], fmt: "pct1" },
      { group: "Instagram", k: "Followers", note: "Account total at the end of each week: 5 gained, 2 lost.", cells: [{ v: "801", c: "+3" }, { v: "798" }], trend: [780, 782, 792, 798, 801], fmt: "int" },
      { group: "Instagram", k: "Reach per day", note: "Average accounts reached each day, the 2nd highest of the 5 weeks. The week before included the Veterans Day reel, which reached 731 on its own.", cells: [{ v: "141", c: "−39%" }, { v: "231" }], trend: [90, 138, 113, 231, 141], fmt: "int" },
      { group: "Instagram", k: "Interactions", note: "Likes, comments, saves and shares on posts and reels. Dr. Farahani’s bridge post drew 12; the Veterans Day reel drew 73 the week before.", cells: [{ v: "27", c: "−114" }, { v: "141" }], trend: [43, 63, 42, 141, 27], fmt: "int" },
      { group: "Instagram", k: "Engagement rate", note: "Interactions divided by reach. The bridge post led at 10.4%, and the World Diabetes Day post drew 9.0%.", cells: [{ v: "2.74%", c: "−5.98 points" }, { v: "8.72%" }], trend: [6.83, 6.52, 5.31, 8.72, 2.74], fmt: "pct" },
      { group: "Instagram", k: "Views", note: "Account total, including views of earlier posts. The bridge post drew 305.", cells: [{ v: "2,596", c: "−31%" }, { v: "3,744" }], trend: [2208, 2962, 2593, 3744, 2596], fmt: "int" },
      { group: "Facebook", k: "Page visits", note: "Reported for completeness. At this scale the figures move on single posts.", cells: [{ v: "12", c: "−12" }, { v: "24" }], trend: [22, 10, 8, 24, 12], fmt: "int" },
      { group: "Facebook", k: "Views", note: "Account total, Metricool; a single post swings it at this scale.", cells: [{ v: "83", c: "−57%" }, { v: "194" }], trend: [220, 202, 85, 194, 83], fmt: "int" },
    ] as { group: string; k: string; note?: string; cells: { v: string; c?: string }[]; trend: number[]; fmt: "int" | "pct" | "pct1" }[],
    after: "Website figures are being confirmed after the October 19 tracking fix and appear in Supporting detail.",
  },

  /* -------------------------------------------- THE PERIOD LINE (signature) */
  periodLine: {
    title: "Clicks from Google rose to 42, with 11 on Monday",
    note:
      "Clicks from Google search each day across both weeks. Shown in place of new website visitors while the website’s visit tracking is confirmed.",
    noteClient:
      "Clicks from Google search each day across both weeks.",
    /* Search Console daily clicks, both weeks read November 16. */
    series: [
      { d: "Nov 2", v: 6 }, { d: "Nov 3", v: 8 }, { d: "Nov 4", v: 8 },
      { d: "Nov 5", v: 3 }, { d: "Nov 6", v: 4 }, { d: "Nov 7", v: 4 },
      { d: "Nov 8", v: 4 }, { d: "Nov 9", v: 11 }, { d: "Nov 10", v: 4 },
      { d: "Nov 11", v: 7 }, { d: "Nov 12", v: 8 }, { d: "Nov 13", v: 7 },
      { d: "Nov 14", v: 3 }, { d: "Nov 15", v: 2 },
    ],
    /* Index of the last day of the previous week (Nov 8). */
    splitAt: 6,
    shade: null as { through: number; label: string } | null,
    markers: [] as { i: number; label: string }[],
    /* derived: 37 ÷ 7 = 5.3; 42 ÷ 7 = 6.0 */
    bands: [
      { label: "November 2 – 8", value: "5 a day", detail: "Previous week" },
      { label: "November 9 – 15", value: "6 a day", detail: "This week" },
    ],
    read: {
      title: "Reading this fairly:",
      body: "Both weeks are 7 days. Clicks went from 37 to 42. Monday, November 9, was the strongest day of the 2 weeks with 11, and Wednesday through Friday drew 7, 8 and 7. Google may still add to the last days of the week.",
    },
  },

  /* ----------------------------------------------------------- WHAT WORKED */
  worked: {
    ledeClient: "Dr. Farahani’s bridge restoration was the week’s strongest piece, with 305 views and a 10.4% engagement rate. Instagram followers rose to 801, and booking links rose at every location.",
    /* Internal build only. */
    lede: "The November 10 post on Dr. Farahani’s lower bridge restoration led: 305 views, 115 accounts reached and 12 interactions, 10.4%. The November 14 World Diabetes Day post drew 9.0% and the November 13 reel 6.6%. 3 pieces against 3 the week before, which included the Veterans Day reel (1,257 views, 731 reach, 73 interactions); without a piece like it, reach and interactions fell back.",
    lead: {
      kind: "Post",
      title: "A smile can feel completely different when the details are right",
      date: "November 10",
      url: "https://www.instagram.com/p/DfktyESCTr9/",
      stats: [
        { v: "305", l: "views" },
        { v: "115", l: "accounts reached" },
        { v: "12", l: "interactions" },
        { v: "10.4%", l: "engagement rate" },
      ],
      why:
        "305 views and 115 accounts reached, with 12 interactions: 9 likes, 2 shares and 1 save. Its 10.4% engagement rate was the week’s highest. Dr. Farahani restored the patient’s lower front teeth with a bridge designed for both function and appearance, and the post invites patients to book with him through the link in bio.",
      repeatable:
        "The November 14 World Diabetes Day post on blood sugar and oral health drew a 9.0% engagement rate. The November 13 reel on the patient experience reached 122 accounts, and viewers watched 55% of it on average.",
    },
    gallery: [
      {
        title: "A smile can feel completely different when the details are right", format: "Post", date: "Nov 10",
        url: "https://www.instagram.com/p/DfktyESCTr9/",
        views: "305", reach: "115", er: "10.4%", lead: true,
      },
      {
        title: "Great dental care goes beyond what happens in the treatment chair", format: "Reel", date: "Nov 13",
        url: "https://www.instagram.com/reel/DfsluhgxrhY/",
        views: "210", reach: "122", er: "6.6%", lead: false,
      },
      {
        title: "Did you know your blood sugar can affect your oral health?", format: "Post", date: "Nov 14",
        url: "https://www.instagram.com/p/DfunNlrFibp/",
        views: "171", reach: "78", er: "9.0%", lead: false,
      },
    ],
    galleryNote:
      "The feed pieces from November 9 to 15, ranked by views. Engagement is interactions divided by reach.",
    channel: {
      title: "Booking links rose at every location, and doctor pages drew more clicks",
      body:
        "Booking links drew 96 clicks, up from 54: Murray Hill 28, Lenox Hill 24, Plaza District 22 and Upper East Side 19, each up from the week before. Doctor pages clicked through from Google 5.8% of the time, up from 2.3%, led by Dr. Tamay’s page with 6 clicks.",
    },
  },
  /* ---------------------------------------------------------------- SOCIAL */
  /* Hidden this cycle: the social lead's write-up arrives after first review.
     Not in ALL_SECTIONS, so it does not render. When it arrives, check every
     figure against the Metricool export before adding it back. */
  social: {
    title: "Social",
    lede: "",
    items: [] as string[],
    takeaway: "",
  },

  /* -------------------------------------------------------- NEEDS ATTENTION */
  attention: [
    {
      tag: "issue",
      title: "The GA4 fix still does not show in the data",
      body:
        "3 new visitors for the week against 42 clicks from Google, and 34 of 77 sessions have no source (44%), against 1 and 22 of 46 the week before. The October 19 fix has not taken.",
      so:
        "Ask Aren and Johana to confirm the GA4 tag fires on every page; GA4’s Realtime report shows a visit within a minute. The client report says the fix is being confirmed.",
    },
    {
      tag: "early",
      title: "573 clicks went to short-link addresses that do not exist",
      body:
        "Short.io’s catch-all, which collects clicks on mistyped or deleted short codes, drew 573 clicks this week against 2. They are left out of every figure here. A jump this size points to a mistyped link in circulation or to automated traffic.",
      so:
        "Check the catch-all’s statistics in Short.io for referrers and the codes used, and fix any printed or shared link that carries a typo.",
    },
    {
      tag: "note",
      title: "The boosted Facebook post still has no Meta figures",
      body:
        "/nycds-website drew 47 clicks this week against 90; last week 77 of its clicks opened in Facebook’s in-app browser. That points to the boost, “Standard Boosted Out of Feed”, having ended or slowed. Its Meta figures are not in the Smile Pass export, so reach, spend and dates are still unknown.",
      so:
        "Pull the boost’s figures and dates from Ads Manager for the NYC Dental Smiles page, then report it as NYC Dental Smiles paid, as decided November 2.",
    },
    {
      tag: "early",
      title: "Doctor pages drew more clicks, but Dr. Giraldo’s page still does not appear",
      body:
        "Doctor-page click rate 5.8%: 16 clicks from 275 appearances, against 6 from 261. Dr. Doris Giraldo’s page drew no appearances for a 2nd week, though searches for her name appeared 4 times.",
      so:
        "Check with Aren that Dr. Giraldo’s page is live at a /doctors/ address, redirected from the old one and in the sitemap.",
    },
    {
      tag: "note",
      title: "Instagram fell back after the Veterans Day week",
      body:
        "Reach per day 141 against 231 and interactions 27 against 141. The week before carried the Veterans Day reel (731 reach, 73 interactions) and Dr. Farahani’s dental anxiety reel (51 interactions); this week’s 1 reel, 9 seconds long, drew 8. Reach per day was still above 3 of the 4 earlier weeks shown.",
      so:
        "Plan the next doctor-led reel; the 2 doctor reels drew 124 interactions the week before.",
    },
    {
      tag: "limitation",
      title: "Name searches clicked through less often, on a thin sample",
      body:
        "6.1%: 5 clicks from 82 appearances, against 15 from 75. “nyc dental smiles lenox hill” drew 7 clicks last week and none from 4 appearances this week, and searches for Dr. Chesner and Dr. Elchami appeared 41 times without a click. The query sample holds only 7 of the week’s 42 clicks, against 17 of 37.",
      so:
        "No action. Read it against next week.",
    },
    {
      tag: "note",
      title: "Smile Pass visits dropped once the fall ads ended",
      body:
        "29 new visitors November 9 – 15 against 243, and /nycsmilepass 11 clicks against 453. The fall ads ended November 9 at $499.81 of $500. Membership leads hold at 10; the November 10 entry on the lead list is not a lead.",
      so:
        "Decide the next Smile Pass push, and wire lead capture to Meta and GA4 before any new ad runs.",
    },
  ],
  /* --------------------------------------------------------- WHAT WE LEARNED */
  learned: [
    { f: "96", u: "booking link clicks", t: "up from 54, with all 4 locations rising." },
    { f: "28", u: "booking link clicks for Murray Hill", t: "the most of any location, up from 10." },
    { f: "5.8%", u: "click rate on doctor pages in Google", t: "up from 2.3%. Dr. Tamay’s page drew 6 clicks from 43 appearances." },
    { f: "38.6", u: "average position in Google", t: "improved from 43.8, with appearances up to 1,534." },
    { f: "10.4%", u: "engagement rate on Dr. Farahani’s bridge post", t: "the week’s highest, with 305 views." },
    { f: "801", u: "Instagram followers", t: "up from 798, with 9 Stories drawing 321 impressions." },
  ],
  /* ------------------------------------------------------------- NEXT MOVES */
  moves: [
    {
      action: "Confirm the GA4 tag fires on every page",
      why: "The October 19 fix still does not show: 3 new visitors for the week, and 34 of 77 sessions with no source.",
      owner: "Web — Figment with Johana and Aren",
      measure: "GA4 visits in line with Search Console clicks.",
    },
    {
      action: "Find what sent 573 clicks to the short-link catch-all",
      why: "Clicks on short codes that do not exist rose to 573 from 2. If a printed or shared link carries a typo, the people using it never reach a booking or website link.",
      owner: "Account — Figment",
      measure: "Catch-all clicks back near 0, or the source found and fixed.",
    },
    {
      action: "Pull the boosted-post figures and report them as NYC Dental Smiles paid",
      why: "The website short link fell to 47 clicks from 90, so the boost has likely ended; its reach, spend and dates are still unknown.",
      owner: "Account — Figment",
      measure: "Boost reach, spend and dates in next week’s report.",
    },
    {
      action: "Confirm Dr. Giraldo’s page address with Aren",
      why: "Doctor pages drew 16 clicks from 275 appearances, but Dr. Giraldo’s page drew none for a 2nd week.",
      owner: "Web — Figment with Aren",
      measure: "Dr. Giraldo’s /doctors/ page back in Search Console.",
    },
    {
      action: "Plan the next doctor-led reel",
      why: "The Veterans Day and dental anxiety reels drew 124 of 141 interactions the week before; this week’s 1 reel drew 8, and Dr. Farahani’s bridge post led at 10.4%.",
      owner: "Social — Figment",
      measure: "Reach on the next doctor reel, against 731.",
    },
    {
      action: "Add a booking link and remove bounced addresses before the next email",
      why: "Neither the October 28 nor the November 5 email carried a booking link, and 236 of the 3,768 Veterans Day sends bounced. No email went out this week.",
      owner: "Email — Figment",
      measure: "Booking link clicks from the next email, and bounces under 2% of sends.",
    },
    {
      action: "Wire membership-lead capture back to Meta and Google Analytics",
      why: "The fall leads ad spent $399.88 and Meta records no leads, while WordPress holds 10. Any new Smile Pass ad needs lead capture in place first.",
      owner: "Web — Figment",
      measure: "New leads attributed to the ad in Meta.",
    },
  ],
  /* ---------------------------------------------------------------- DETAIL */
  detail: {
    subtitles: {
      instagram: "November 9 – 15 · account totals from Metricool",
      search: "November 9 – 15 · Google Search Console",
      website: "November 9 – 15 · Google Analytics",
      links: "November 9 – 15 · Short.io",
    },
    instagram: {
      kv: [
        { k: "Views", v: "2,596" },
        { k: "Reach per day", v: "141" },
        { k: "Accounts engaged", v: "76" },
        { k: "Followers", v: "801" },
        { k: "Interactions", v: "27" },
      ],
      postsChart: {
        title: "The feed pieces from this week",
        note: "Ranked by views. Engagement is interactions divided by reach.",
      },
      posts: [
        { t: "A smile can feel completely different when the details are right", f: "Post", d: "Nov 10", v: "305", r: "115", i: "12", e: "10.4%" },
        { t: "Great dental care goes beyond what happens in the treatment chair", f: "Reel", d: "Nov 13", v: "210", r: "122", i: "8", e: "6.6%" },
        { t: "Did you know your blood sugar can affect your oral health?", f: "Post", d: "Nov 14", v: "171", r: "78", i: "7", e: "9.0%" },
      ],
      interactionsChart: {
        title: "The feed posts drew most of the interactions",
        note: "27 interactions: 19 on the 2 feed posts and 8 on the reel.",
      },
      interactions: [
        { label: "Feed posts", value: 19 },
        { label: "Reels", value: 8 },
      ],
      viewsChart: {
        title: "Views by format",
        note: "From Metricool’s format summaries. Stories are shown as impressions. These are not summed; the account total of 2,596 is measured separately.",
      },
      viewsByFormat: [
        { label: "Feed posts", value: 476 },
        { label: "Reels", value: 210 },
        { label: "Stories", value: 321 },
      ],
      storiesTitle: "Stories",
      stories:
        "Stories drew 321 impressions, with an average reach of 33.",
      note:
        "Account totals are Metricool’s account-level figures, both weeks read November 16; last week now reads 3,744 views and 231 reach per day, against 3,739 and 231 on November 9. Per-piece figures are each read the day after their week closed. Engagement rate is interactions on posts and reels divided by reach: 27 against 986 this week and 141 against 1,614 the week before. 9 Stories this week, against 6, with 321 impressions against 206. Metricool shows 5 followers acquired and 2 lost. None of the week’s Instagram pieces carried paid reach.",
      clientNote:
        "Account totals come from Metricool’s account-level figures rather than a sum of individual posts. Figures for individual posts keep growing after a week ends, so each week is read the day after it closes. Engagement rate is interactions divided by reach.",
    },
    search: {
      kv: [
        { k: "Clicks", v: "42" },
        { k: "Impressions", v: "1,534" },
        { k: "Click rate", v: "2.74%" },
      ],
      impressionsChart: {
        title: "Impressions per day",
        note: "Daily appearances in Google results across the week.",
      },
      impressionsSeries: [
        { d: "Nov 9", v: 222 }, { d: "Nov 10", v: 140 }, { d: "Nov 11", v: 156 },
        { d: "Nov 12", v: 222 }, { d: "Nov 13", v: 249 }, { d: "Nov 14", v: 279 },
        { d: "Nov 15", v: 266 },
      ],
      pagesChart: {
        title: "The homepage draws most of the appearances, and doctor pages click through more often",
        note: "Clicks, appearances, click rate and average position by page. The doctor pages together drew 16 clicks from 275 appearances.",
      },
      pages: [
        { p: "Homepage", c: "25", i: "1,028", r: "2.43%", pos: "38.7" },
        { p: "Dr. Maria Tamay", c: "6", i: "43", r: "13.95%", pos: "3.1" },
        { p: "Dr. Ben Elchami", c: "3", i: "58", r: "5.17%", pos: "5.3" },
        { p: "Dr. Dana Kapparova", c: "2", i: "40", r: "5.00%", pos: "4.0" },
        { p: "Dr. Sherman Farahani", c: "2", i: "31", r: "6.45%", pos: "4.5" },
        { p: "Dr. Laura Koo Min Chee", c: "2", i: "21", r: "9.52%", pos: "9.1" },
        { p: "Locations", c: "1", i: "100", r: "1.00%", pos: "28.7" },
        { p: "Services", c: "1", i: "77", r: "1.30%", pos: "10.5" },
        { p: "Dr. Michael Chesner", c: "1", i: "63", r: "1.59%", pos: "5.8" },
        { p: "Meet Our Dentists", c: "0", i: "219", r: "0%", pos: "42.6" },
      ],
      devicesChart: {
        title: "Mobile clicks through at a higher rate than desktop",
        note: "Clicks, appearances, click rate and average position by device. Mobile 2.87% against 2.60%.",
      },
      devices: [
        { d: "Desktop", c: "26", i: "1,000", r: "2.60%", pos: "47.3" },
        { d: "Mobile", c: "15", i: "523", r: "2.87%", pos: "22.2" },
        { d: "Tablet", c: "1", i: "11", r: "9.09%", pos: "23.3" },
      ],
      queriesChart: {
        title: "Searches that name the practice or a doctor bring the clicks",
        note: "From the query export, which holds 7 of the 42 clicks and 1,081 of the appearances. Useful for share; totals come from the daily export.",
      },
      queries: [
        { q: "nyc dental smiles", c: "3", i: "10", r: "30.00%", pos: "1.3" },
        { q: "dana kapparova", c: "2", i: "9", r: "22.22%", pos: "6.2" },
        { q: "dental smiles", c: "1", i: "14", r: "7.14%", pos: "4.6" },
        { q: "121 east 60th street dentist", c: "1", i: "3", r: "33.33%", pos: "1.0" },
      ],
      brandSplit: {
        title: "Named and general searches",
        note: "Matched on the practice name, “nyc smiles”, Dr. El Chaar and doctor surnames, the same rule for every week shown. These are shares within the query sample; totals come from the daily export.",
        rows: [
          { k: "Names the practice or a doctor", c: "5", i: "82", r: "6.10%" },
          { k: "General searches", c: "2", i: "999", r: "0.20%" },
        ],
      },
      note:
        "Totals come from Search Console’s daily export for November 9 to 15, read November 16. November 2 – 8 was re-read the same day and is unchanged: 37 clicks on 1,365 appearances. Average position is weighted by appearances, 38.6 this week against 43.8. Doctor-page click rate counts every doctor page address in both weeks.",
    },
    website: {
      kv: [
        { k: "Sessions", v: "77" },
        { k: "Desktop", v: "68%" },
        { k: "Mobile", v: "30%" },
      ],
      sourcesChart: {
        title: "Where visitors came from",
        note: "Sessions by source. Direct means someone typed the address or used a saved link. Source not recorded means the site did not record where the visit came from.",
      },
      sources: [
        { label: "Source not recorded", value: 34 },
        { label: "Google — organic", value: 16 },
        { label: "Direct", value: 15 },
        { label: "Constant Contact", value: 3 },
        { label: "Bing — organic", value: 1 },
      ],
      deviceChart: {
        title: "Desktop leads",
        note: "Share of visitors by device.",
      },
      deviceSplit: [
        { label: "Desktop", pct: 68 },
        { label: "Mobile", pct: 30 },
      ] as { label: string; pct: number }[],
      landingChart: {
        title: "Where visitors landed",
        note: "Views by landing page.",
      },
      landing: [
        { label: "Homepage", value: 47 },
        { label: "Meet Our Dentists", value: 28 },
        { label: "Locations", value: 12 },
        { label: "About", value: 10 },
        { label: "Dr. Laura Koo Min Chee", value: 7 },
      ] as { label: string; value: number }[],
      note:
        "We are confirming the site’s visit tracking after the October 19 fix, so these figures are shown without a comparison. The week recorded 3 new visitors. 8 further sessions came from referrals.",
    },
    links: {
      kv: [
        { k: "Booking · all locations", v: "96" },
        { k: "Homepage and website", v: "75" },
        { k: "Veterans Day nomination", v: "9" },
        { k: "Total", v: "180" },
      ],
      destsChart: {
        title: "Clicks by link",
        note: "The practice’s short links with clicks this week.",
      },
      dests: [
        { label: "Main website", value: 47 },
        { label: "Homepage", value: 28 },
        { label: "Murray Hill — booking", value: 28 },
        { label: "Lenox Hill — booking", value: 24 },
        { label: "Plaza District — booking", value: 22 },
        { label: "Upper East Side — booking", value: 19 },
        { label: "Veterans Day nomination", value: 9 },
        { label: "All locations — booking", value: 3 },
      ],
      note:
        "180 clicks this week against 160, with every week read November 16. Booking links drew 96 against 54, the website and homepage links 75 against 93, and the Veterans Day nomination links 9 against 13; nominations closed November 11. Booking links include the practice’s earlier online booking links. The Smile Pass link is reported in the Smile Pass section.",
    },
    email: null as null | {
      window: string;
      note: string;
      table: { head: string[]; rows: string[][] };
      tableInternal: { head: string[]; rows: string[][] };
      tableChart: { title: string; note: string };
    },
    facebook: {
      subtitle: "November 9 – 15 · account totals from Metricool",
      kv: [
        { k: "Followers", v: "982" },
        { k: "Views", v: "83" },
        { k: "Page visits", v: "12" },
      ],
      note:
        "Page visits 12 against 24. Views 83 against 194 for the week before, both read November 16. Followers 982, unchanged. At this scale the figures move on single pieces of content and are reported for completeness.",
    },
    method: [
      { q: "What the report covers", a: "November 9 to 15, 2026, 7 full days, Monday to Sunday, compared with November 2 to 8. Both weeks are the same length, so every comparison is direct." },
      { q: "Where the Instagram totals come from", a: "Metricool’s account-level figures. Per-piece figures are used only to rank content against content." },
      { q: "How engagement rate is calculated", a: "Interactions on posts and reels divided by reach, meaning the share of people who saw something and engaged with it." },
      { q: "Why each week is read the day after it closes", a: "Figures for individual posts keep growing after a week ends. Reading each week the day after it closes means both weeks have had the same time to collect views." },
      { q: "Which reading the previous week uses", a: "Metricool account totals for November 2 to 8 were read again on November 16, so both weeks are read the same day; per-piece interactions and engagement rate keep their November 9 reading. Search figures for that week were re-read the same day, and short link figures for every week shown were read November 16.", internalOnly: true },
      { q: "Why the search figures may change", a: "Google keeps processing search data for several days, so the most recent days of any week are the least settled." },
      { q: "How the doctor page click rate is calculated", a: "Every doctor page address, counted the same way in both weeks: 16 clicks from 275 appearances this week, 6 from 261 the week before." },
      { q: "How searches by name are counted", a: "Searches that include the practice name, “nyc smiles”, Dr. El Chaar’s name or a doctor’s surname, within Google’s query sample. The same rule is applied to every week shown, so earlier weeks can read slightly differently from past reports." },
      { q: "How short link clicks are counted", a: "Clicks on the practice’s named short links, counted the same way in every week shown. Booking links include the practice’s earlier online booking links. Every week is read on the same day, and the most recent week can still rise as Short.io finishes counting. The Smile Pass link is reported in the Smile Pass section." },
      { q: "Why website figures are not compared this week", a: "The way the site counts visits changed at the end of September. A fix was made on October 19 and is being confirmed; this week recorded 3 new visitors. Until it is confirmed, website figures are shown without a week-to-week comparison, and the daily chart shows clicks from Google instead." },
      { q: "Where the Social section is", a: "The social lead’s write-up arrives after first review. It is checked figure by figure against the Metricool export before it is added.", internalOnly: true },
      { q: "What is not in this report", a: "Story interactions are not in the Instagram export. The Smile Pass section is reported since launch, separate from the weekly figures." },
    ] as { q: string; a: string; internalOnly?: boolean; clientOnly?: boolean }[],
  },
  /* ------------------------------------------------------------ SMILE PASS
     A separate overview, not part of the weekly comparison. July 1 –
     November 15, 2026. Sources: GA4 property "NYC Dental Smiles Membership",
     Meta Ads (August export; fall campaigns, final export October 1 –
     November 10), Short.io,
     Metricool (organic only), Search Console, and the website's own
     membership lead list. */
  smilepass: {
    title: "NYC Smile Pass",
    dateLine: "July 1 – November 15, 2026, since launch",
    lede:
      "Smile Pass since July 1. 10 membership leads to date, unchanged; the November 10 entry on the lead list is not a lead. November 9 – 15 drew 29 new visitors, against 243, after the fall ads ended November 9, and /nycsmilepass 11 clicks against 453. The 2 fall ads finished at $499.81 of $500; the leads ad records no leads in Meta, though the website holds 10. The October 23 Dr. Tamay reel remains the strongest Smile Pass piece.",
    ledeClient:
      "An overview of NYC Smile Pass since July 1. The site has recorded 10 membership leads and 3,413 new visitors since launch. The fall ads, which ended November 9, drew 336 visits to the Smile Pass Instagram profile, and the Dr. Tamay reel remains the strongest Smile Pass post so far.",
    kv: [
      { k: "Membership leads", v: "10" },
      { k: "New website visitors", v: "3,413" },
      { k: "People reached by the August campaign", v: "62,053" },
      { k: "Profile visits from the engagement ad", v: "336" },
      { k: "Instagram followers", v: "50" },
      { k: "Facebook followers", v: "40" },
    ],
    daily: [
      { d: "Jul 1", v: 3 }, { d: "Jul 2", v: 2 }, { d: "Jul 3", v: 0 }, { d: "Jul 4", v: 2 }, { d: "Jul 5", v: 1 }, { d: "Jul 6", v: 6 },
      { d: "Jul 7", v: 1 }, { d: "Jul 8", v: 0 }, { d: "Jul 9", v: 2 }, { d: "Jul 10", v: 7 }, { d: "Jul 11", v: 0 }, { d: "Jul 12", v: 1 },
      { d: "Jul 13", v: 11 }, { d: "Jul 14", v: 6 }, { d: "Jul 15", v: 3 }, { d: "Jul 16", v: 2 }, { d: "Jul 17", v: 1 }, { d: "Jul 18", v: 1 },
      { d: "Jul 19", v: 1 }, { d: "Jul 20", v: 6 }, { d: "Jul 21", v: 1 }, { d: "Jul 22", v: 4 }, { d: "Jul 23", v: 5 }, { d: "Jul 24", v: 2 },
      { d: "Jul 25", v: 0 }, { d: "Jul 26", v: 1 }, { d: "Jul 27", v: 6 }, { d: "Jul 28", v: 1 }, { d: "Jul 29", v: 5 }, { d: "Jul 30", v: 2 },
      { d: "Jul 31", v: 1 }, { d: "Aug 1", v: 0 }, { d: "Aug 2", v: 0 }, { d: "Aug 3", v: 5 }, { d: "Aug 4", v: 10 }, { d: "Aug 5", v: 3 },
      { d: "Aug 6", v: 0 }, { d: "Aug 7", v: 0 }, { d: "Aug 8", v: 4 }, { d: "Aug 9", v: 1 }, { d: "Aug 10", v: 11 }, { d: "Aug 11", v: 117 },
      { d: "Aug 12", v: 157 }, { d: "Aug 13", v: 204 }, { d: "Aug 14", v: 93 }, { d: "Aug 15", v: 31 }, { d: "Aug 16", v: 102 }, { d: "Aug 17", v: 142 },
      { d: "Aug 18", v: 113 }, { d: "Aug 19", v: 111 }, { d: "Aug 20", v: 78 }, { d: "Aug 21", v: 108 }, { d: "Aug 22", v: 128 }, { d: "Aug 23", v: 102 },
      { d: "Aug 24", v: 80 }, { d: "Aug 25", v: 105 }, { d: "Aug 26", v: 91 }, { d: "Aug 27", v: 69 }, { d: "Aug 28", v: 72 }, { d: "Aug 29", v: 109 },
      { d: "Aug 30", v: 55 }, { d: "Aug 31", v: 2 }, { d: "Sep 1", v: 2 }, { d: "Sep 2", v: 0 }, { d: "Sep 3", v: 0 }, { d: "Sep 4", v: 0 },
      { d: "Sep 5", v: 0 }, { d: "Sep 6", v: 0 }, { d: "Sep 7", v: 2 }, { d: "Sep 8", v: 1 }, { d: "Sep 9", v: 0 }, { d: "Sep 10", v: 0 },
      { d: "Sep 11", v: 1 }, { d: "Sep 12", v: 2 }, { d: "Sep 13", v: 0 }, { d: "Sep 14", v: 6 }, { d: "Sep 15", v: 0 }, { d: "Sep 16", v: 0 },
      { d: "Sep 17", v: 0 }, { d: "Sep 18", v: 1 }, { d: "Sep 19", v: 2 }, { d: "Sep 20", v: 0 }, { d: "Sep 21", v: 5 }, { d: "Sep 22", v: 0 },
      { d: "Sep 23", v: 1 }, { d: "Sep 24", v: 1 }, { d: "Sep 25", v: 0 }, { d: "Sep 26", v: 0 }, { d: "Sep 27", v: 1 }, { d: "Sep 28", v: 6 },
      { d: "Sep 29", v: 0 }, { d: "Sep 30", v: 1 }, { d: "Oct 1", v: 1 }, { d: "Oct 2", v: 0 }, { d: "Oct 3", v: 0 }, { d: "Oct 4", v: 0 },
      { d: "Oct 5", v: 16 }, { d: "Oct 6", v: 3 }, { d: "Oct 7", v: 0 }, { d: "Oct 8", v: 1 }, { d: "Oct 9", v: 28 }, { d: "Oct 10", v: 18 },
      { d: "Oct 11", v: 8 }, { d: "Oct 12", v: 11 }, { d: "Oct 13", v: 15 }, { d: "Oct 14", v: 12 }, { d: "Oct 15", v: 55 }, { d: "Oct 16", v: 9 },
      { d: "Oct 17", v: 27 }, { d: "Oct 18", v: 44 }, { d: "Oct 19", v: 46 }, { d: "Oct 20", v: 19 }, { d: "Oct 21", v: 118 }, { d: "Oct 22", v: 64 },
      { d: "Oct 23", v: 59 }, { d: "Oct 24", v: 75 }, { d: "Oct 25", v: 27 },
      { d: "Oct 26", v: 50 }, { d: "Oct 27", v: 13 }, { d: "Oct 28", v: 8 }, { d: "Oct 29", v: 7 }, { d: "Oct 30", v: 43 }, { d: "Oct 31", v: 77 },
      { d: "Nov 1", v: 68 }, { d: "Nov 2", v: 39 }, { d: "Nov 3", v: 67 }, { d: "Nov 4", v: 38 }, { d: "Nov 5", v: 31 }, { d: "Nov 6", v: 16 },
      { d: "Nov 7", v: 39 }, { d: "Nov 8", v: 13 }, { d: "Nov 9", v: 4 }, { d: "Nov 10", v: 17 }, { d: "Nov 11", v: 2 }, { d: "Nov 12", v: 4 },
      { d: "Nov 13", v: 2 }, { d: "Nov 14", v: 0 }, { d: "Nov 15", v: 0 },
    ],
    dailyChart: {
      title: "Visits peaked with the August campaign and continued through the fall",
      /* indices into `daily`: 41 = Aug 11, 60 = Aug 30 */
      band: { from: 41, to: 60, label: "August campaign" },
      note:
        "New website visitors each day since July 1. 2,067 of the 3,413 arrived between August 11 and 30, during the launch campaign. November 9 – 15 drew 29, against 243 the week before: the fall ads ended November 9, and 17 of the 29 came on November 10. The same week, /nycsmilepass drew 11 clicks, against 453; clicks and visits are largely the same people and are not added together.",
      noteClient:
        "New website visitors each day since July 1. Most arrived during the August launch campaign and the fall campaign, which ran from October to November 9.",
    },
    ads: {
      title: "The August campaign",
      table: {
        head: ["Ad", "Spend", "People reached", "Landing page views", "Cost per view", "Click rate"],
        rows: [
          ["August Promo · General", "$616.81", "53,392", "1,293", "$0.48", "2.49%"],
          ["August Promo · No Insurance", "$133.04", "9,132", "311", "$0.43", "3.12%"],
          ["Campaign total", "$749.85", "62,053", "1,604", "$0.47", "2.58%"],
        ],
      },
      note:
        "1 campaign, August 2026 First Month Free, with a $750 lifetime budget, ending August 30. It was set to optimize for landing page views and delivered those cheaply. Meta ranks both ads’ conversion rate in the bottom 35% of ads; quality is average. The No Insurance ad had the higher click rate and cheaper views but received 18% of the budget. People reached counts each person once, so the 2 ad rows add up to more than the campaign total.",
      noteClient:
        "The launch campaign ran with a $750 budget and ended on August 30. It was set up to bring people to the site, and it did so at 47 cents a visit. The No Insurance message drew a higher click rate than the general one. People reached counts each person once, so the 2 ads add up to more than the campaign total.",
    },
    adsNow: {
      title: "The fall ads, which ended November 9",
      table: {
        head: ["Ad", "Goal", "Spend of budget", "People reached", "Impressions", "Link click rate", "Result"],
        rows: [
          ["Reel Engagement/Follows Fall 2026", "Instagram profile visits", "$99.93 of $100", "2,666", "4,216", "6.21%", "336 profile visits, $0.30 each"],
          ["Reel Leads Fall 2026", "Membership leads", "$399.88 of $400", "7,884", "12,198", "14.09%", "0 in Meta; 10 on the website"],
          ["Total", "", "$499.81 of $500", "", "16,414", "", ""],
        ],
      },
      tableClient: {
        head: ["Ad", "Goal", "People reached", "Impressions", "Link click rate", "Result"],
        rows: [
          ["Engagement ad", "Visits to the Smile Pass Instagram profile", "2,666", "4,216", "6.21%", "336 profile visits, 30 cents each"],
          ["Leads ad", "Membership leads", "7,884", "12,198", "14.09%", "10 membership leads to date on the website"],
        ],
      },
      note:
        "Meta’s final campaign export for October 1 – November 10; both ads ended November 9, with $499.81 of $500 spent. 80% of the spend, $399.88, went to the leads ad, which optimized for membership leads; Meta records none against it, though the website’s own list holds 10. Its link click rate finished at 14.09%. The engagement ad drew 336 profile visits at 30 cents each. Against last week’s partial reading, reach finished at 7,884 and 2,666, from 7,837 and 2,662. This export carries no quality ranking. People reached is not added across the 2 ads, since the same person can see both.",
      noteClient:
        "2 ads ran this fall, from October 1 to November 9. The engagement ad brought people to the Smile Pass Instagram profile. The leads ad, which carried most of the budget, was set up to find people likely to become members; the website has recorded 10 membership leads to date. People reached is counted per ad, since the same person can see both.",
    },
    sources: {
      title: "Where visitors came from, by source",
      table: {
        head: ["Source", "Visits", "Share"],
        rows: [
          ["Instagram ads", "1,698", "45.4%"],
          ["Audience Network ads", "1,024", "27.4%"],
          ["Facebook ads", "492", "13.1%"],
          ["Direct", "278", "7.4%"],
          ["Google search", "126", "3.4%"],
          ["Instagram and Facebook, unpaid", "67", "1.8%"],
        ],
      },
      note:
        "July 1 – November 15, sessions by source from GA4, 3,743 in all. Paid Instagram brought 1,698, 45% of the total; Audience Network 1,024 and Facebook ads 492. With the ads ended November 9, Audience Network added 4 visits this week and paid Instagram and Facebook none; Direct rose to 278 from 252 and Google search to 126 from 107. Threads ads (34), Bing (7), the unassigned group (11), Yahoo (2) and 4 referral visits are not shown.",
      noteClient:
        "Sessions by source since July 1. Most visits came through the paid campaigns on Instagram, Audience Network and Facebook. Direct visits and Google search follow. Sources with fewer than 50 visits are not shown.",
    },
    social: {
      title: "Smile Pass on social",
      table: {
        head: ["", "Instagram", "Facebook"],
        rows: [
          ["Followers", "50", "40"],
          ["Average reach per post", "52", "15"],
          ["Reels", "4,194 views · 318 average reach", "1,112 video views"],
          ["Strongest piece", "Oct 23 reel · 3,267 views · 1,825 reach", "—"],
        ],
      },
      note:
        "Unpaid content only, from July 10, from Metricool, read November 16. Account-level reach and views include ad delivery and are not used. Followers 50 and 40, against 51 and 40 on November 8 as read today. Average reach per post 52 and 15. No new Smile Pass reels this week; the 8 reels have drawn 4,194 organic views, from 4,077. The strongest piece remains the October 23 reel, “No dental insurance? Dr. Tamay has some good news for you.”: 3,267 views, 1,825 reach and 166 interactions, up from 3,150, 1,749 and 165 at the November 9 reading.",
      noteClient:
        "Unpaid posts only, from July 10. Instagram has 50 followers and Facebook 40. The strongest post remains the October 23 reel with Dr. Tamay, now at 3,267 views and 166 interactions.",
    },
    search: {
      title: "Search",
      kv: [
        { k: "Clicks from Google", v: "44" },
        { k: "Appearances in Google", v: "504" },
        { k: "Most common search", v: "“nyc dental smiles”" },
      ],
      note:
        "July 1 – November 15, from the daily export. The query list shows 147 appearances for “nyc dental smiles” and 25 for “dental membership plan nyc”. The join page drew 1 click from 47 appearances. November 9 – 15 drew 5 clicks from 47 appearances, against 4 from 65.",
      noteClient:
        "Search presence is still early for a new site. Most searches that showed Smile Pass were for the NYC Dental Smiles name, and the site has drawn 44 clicks from Google since July.",
    },
    findings: {
      title: "What we learned",
      items: [
        {
          t: "Membership leads hold at 10",
          b: "10 membership leads to date: the website’s lead list of 13 entries, less 2 repeat submissions and 1 entry on November 10 that is not a lead. None new this week. The Meta leads ad spent $399.88 at a 14.09% link click rate but records no leads; GA4 has no lead event either, so neither can yet link a lead to an ad.",
          client: { t: "10 membership leads to date", b: "The website has recorded 10 membership leads since launch. Connecting leads to Meta and Google Analytics is the next step, so every future report can show where they come from." },
        },
        {
          t: "The engagement ad finished at 336 profile visits",
          b: "336 profile visits for $99.93, 30 cents each, by November 9. Smile Pass Instagram followers read 50 on November 15, against 51 a week earlier, and Facebook 40.",
          client: { t: "The engagement ad brought 336 profile visits", b: "The engagement ad drew 336 visits to the Smile Pass Instagram profile at 30 cents each, and the account has 50 followers." },
        },
        {
          t: "Visits fell back once the ads ended",
          b: "29 new visitors from November 9 to 15 against 243, 17 of them on November 10. Audience Network finished at 1,024 visits, paid Instagram at 1,698 and Facebook ads at 492. Direct reached 278 and Google search 126.",
          client: { t: "The ads reached beyond Instagram and Facebook", b: "Audience Network, Meta’s placements across other apps and sites, brought 1,024 visits during the campaigns, 27% of all visits to the site." },
        },
        {
          t: "A Dr. Tamay reel remains the strongest Smile Pass piece",
          b: "The October 23 reel: 3,267 views, 1,825 accounts reached, 166 interactions and 15 shares, up from 3,150, 1,749 and 165 at the November 9 reading. Nothing since has surpassed it.",
          client: { t: "A reel with Dr. Tamay is still the top post", b: "The October 23 reel with Dr. Tamay has now reached 1,825 people with 166 interactions." },
        },
        {
          t: "Visits since launch reached 3,413",
          b: "2,067 of the 3,413 arrived during the August campaign; the fall campaign added through October and early November.",
          client: { t: "Visits keep building", b: "The site has drawn 3,413 new visitors since July. Most arrived during the August launch campaign and the fall campaign." },
        },
      ],
    },
    next: {
      title: "What we’d do next",
      items: [
        { t: "Wire membership-lead capture back to Meta and Google Analytics", b: "The website holds 10 leads the leads ad could not see. Recording each lead lets Meta find more people like them, and lets every report measure leads directly." },
        { t: "Make more doctor-led reels", b: "The Dr. Tamay reel drew the most views and reach of any Smile Pass post. More reels with the doctors will show whether the format repeats." },
        { t: "Compare leads by ad placement", b: "Audience Network brought 1,024 visits during the campaigns. Once leads are recorded, comparing them by placement will show where the budget works hardest." },
        { t: "Keep sharing Smile Pass from NYC Dental Smiles", b: "NYC Dental Smiles has 801 Instagram followers; Smile Pass has 50." },
      ],
    },
    method:
      "New visitor totals come from GA4’s daily series, July 1 – November 15, property NYC Dental Smiles Membership; visits by source cover the same dates. August campaign figures are Meta’s August export. Fall ad figures are Meta’s final campaign export for October 1 – November 10; both ads ended November 9. Short link clicks are Short.io, November 9 – 15. Social figures are organic only, from July 10, from Metricool, because account totals include ad delivery. Search covers July 1 – November 15. Membership leads are the website’s own lead list, with repeat entries and entries that are not leads removed.",
    methodClient:
      "Figures cover July 1 to November 15, 2026. Website figures are from Google Analytics, ad figures from Meta for October 1 to November 9, social figures from Metricool and search figures from Google Search Console. Membership leads are from the website’s own records. Social figures cover unpaid posts only.",
  },
};

type SectionDef = { id: string; label: string; internalOnly?: boolean; clientOnly?: boolean };

export const ALL_SECTIONS: SectionDef[] = [
  { id: "brief", label: "The brief" },
  { id: "scoreboard", label: "The week in numbers" },
  { id: "period", label: "Daily clicks" },
  { id: "worked", label: "What worked" },
  { id: "attention", label: "Needs attention", internalOnly: true },
  { id: "learned", label: "Learnings" },
  { id: "moves", label: "Next moves", internalOnly: true },
  { id: "detail", label: "Detail" },
  { id: "smilepass", label: "Smile Pass" },
];

export const NAV = ALL_SECTIONS.filter((x) => (IS_INTERNAL ? !x.clientOnly : !x.internalOnly));
const ORDINALS = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
export const numOf = (id: string) => ORDINALS[NAV.findIndex((n) => n.id === id)] ?? "";
export const has = (id: string) => NAV.some((n) => n.id === id);

export const SOURCE_WINDOWS = [
  { k: "Instagram", v: "Nov 9 – 15", p: "Account-level figures from Metricool, against Nov 2 – 8." },
  { k: "Facebook", v: "Nov 9 – 15", p: "Account-level figures from Metricool." },
  { k: "Search", v: "Nov 9 – 15", p: "Against Nov 2 – 8. The last days of this week may still rise." },
  { k: "Website", v: "Nov 9 – 15", p: "Being confirmed after the October 19 fix. Shown without a comparison." },
  { k: "Short links", v: "Nov 9 – 15", p: "All named NYC Dental Smiles links, every week read the same day." },
  { k: "Smile Pass", v: "Jul 1 – Nov 15", p: "An overview since launch, separate from the weekly figures. Fall ads: Meta, Oct 1 – Nov 9." },
];
