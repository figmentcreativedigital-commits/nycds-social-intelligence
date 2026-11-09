/* ==========================================================================
   REPORT DATA  ·  NYC Dental Smiles
   --------------------------------------------------------------------------
   THIS CYCLE — a single week.
     November 2 – 8 against October 26 – November 1: two 7-day windows,
     Monday to Sunday, directly comparable. The first cycle built on the 4 API
     pulls (scripts/*-pull.mjs), all read November 9. Metricool account totals
     for both weeks read November 9: October 26 – November 1 restated views
     2,584 to 2,593 and Facebook views 82 to 85; reach per day 113 unchanged.
     Per-piece figures keep their day-after reading (interactions 42).

   READ-DATE RULE — Metricool per-piece figures are each read the day after
     their week closed.

   WEBSITE (GA4) — the October 19 fix still does not show. The pull reads 51
     sessions and 6 new visitors; 5 of each came from a spam referral
     (gipkd.com, no engagement, all landing on the homepage), dropped
     silently: 46 sessions, 1 new visitor, 22 with no source (48%), against 64,
     2 and 28 the week before. Homepage landing views 30 less the 5 spam views
     = 25. Device shares are GA4's active-user split and still include the
     spam visitors (the pull has no source × device split). Client copy says
     website figures are being confirmed; no comparison; period line stays on
     Search Console clicks.

   BOOSTED POST — the NYC Dental Smiles boost ("Figment Creative 4743
     Standard Boosted Out of Feed", 114 of /nycds-website's 152 clicks the week
     before) still has no Meta figures: it is not in the Smile Pass campaign
     export. Walter's Nov 2 rule stands: report it as NYC Dental Smiles paid
     once its figures are pulled; until then internal only. This week
     /nycds-website drew 89 Human clicks (238 total); 77 opened in Facebook's
     in-app browser and 79 came from Facebook referrers (Short.io link
     statistics, Nov 9), which points to the boost still running. Short.io's
     link statistics carry no campaign tags to confirm it.

   SHORT LINKS — Short.io API pull, path view, unfiltered, every week read
     November 9 (Walter, Nov 9: one reading date for every week shown).
     Short.io keeps adding clicks to a week after it closes: October 26 –
     November 1 booking read 51 on November 3 and 59 on November 9; October
     19 – 25 read 41 and 50. Dentrix Ascend links count as booking from this
     cycle (Walter, Nov 2), so the booking trend is replaced: 87, 95, 50, 59,
     54. Veterans Day nomination: /vdaynom26 (confirmed live by Walter, Nov 9)
     and /y9wdZ7 (opens the same Google Form, created October 29), 13 this
     week and 6 the week before. /nycsmilepass (445) is reported under Smile
     Pass. /thewellnessconnection (1) is omitted (Walter, Nov 9). /* is
     excluded.

   SEARCH — Search Console API pull (the Chart.csv figures). October 26 –
     November 1 re-read November 9: 41 clicks on 1,499 appearances (reported
     1,496). Searches by name on the written rule (Walter, Nov 3): practice
     name, "nyc smiles", El Chaar, doctor surnames from the site's doctor
     pages; site: queries left out. Trend restated on the rule: 17.5, 11.7,
     14.9, 15.7, 20.0. Doctor pages count every /dr-<name>/ and
     /doctors/dr-<name>/ address: 6 clicks from 261 appearances this week, 16
     from 322 the week before. Dr. Doris Giraldo's page drew no appearances.

   EMAIL — 1 campaign, November 5, from its Reporting page. Rates are
     Constant Contact's, on delivered emails; bounce share on sends. Veterans
     Day Email - NYCDS: 3,768 sends, 3,532 delivered, 334 confirmed opens
     (9.5%), 1,795 all opens (50.8%), 28 clicks (0.8%), 236 bounces (6.3%),
     10 unsubscribes, 3 spam reports, 0 bot clicks removed. Links: the
     nomination Google Form 22 unique clicks, conta.cc/4sIDFZD 19 (the
     email's own web version, per Walter), 41 in all. The form link goes
     straight to Google Forms, so those clicks never reach Short.io and are
     not added to the 13 nomination short-link clicks. No booking link.

   SOCIAL — hidden until the social lead's write-up arrives after first review.

   SMILE PASS — July 1 – November 8. Daily visitors from the GA4 pull,
     property NYC Dental Smiles Membership: 3,384 to date, 243 this week.
     Organic social from the Metricool connector (brand 6517050), read
     November 9: Instagram 51 followers (46 on November 1 as read today; 44 in
     last week's report), Facebook 40; per-reel organic figures replace the
     October 25 reel totals.
     Membership leads 10: the website's lead list of 13 entries (Walter's
     WordPress screenshot, November 9), less 2 repeat submissions and 1
     Figment test entry; 1 new this week, November 6. Names stay out of this
     file because the repo is public. Walter: call them membership leads.
     Current ads: Meta campaign export for October 1 – November 9, which
     includes part of November 9, the ads' last day: $499.32 of $500 spent.
     Reel Leads Fall 2026 $399.39 of $400, reach 7,837, 12,140 impressions,
     link CTR 14.14%, no results recorded. Reel Engagement/Follows Fall 2026
     $99.93 of $100, reach 2,662, 4,214 impressions, link CTR 6.22%, 336
     profile visits at $0.30. The export carries no quality ranking.
     Short.io /nycsmilepass 445 (Human clicks; 508 total). Short.io's link
     statistics carry no campaign-tag breakdown, so the ad-tagged and
     Audience Network shares are not reported from Short.io this cycle;
     Audience Network comes from GA4 sources instead (1,020 visits since
     launch, from 765).

   CONTENT PUBLISHED — removed from the ledger and client-facing detail at
     Walter's request.

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
    label: "November 2 – 8, 2026",
    length: "7 days",
    comparedWith: "the 7 days before it (October 26 – November 1)",
    paidStatus:
      "Both weeks are 7 days, Monday to Sunday, so every comparison is direct.",
  },

  copy: {
    scoreboard: {
      title: "The week in numbers",
      lede: "Each measure this week and the week before, with its trend over the last 5 weeks. This week is the plum point.",
    },
    worked: {
      title: "A Veterans Day reel led the week",
      galleryTitle: "The feed pieces from this week, ranked by views",
    },
    attention: {
      title: "What needs attention",
      lede: "6 things worth a second look, each labeled so it is clear which to act on and which to note.",
    },
    learned: {
      title: "Learnings",
      lede: "6 things worth carrying into the next report.",
    },
    moves: {
      title: "Recommended next moves",
      lede: "6 actions, each with the reason behind it and the number that shows whether it worked.",
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
    head: "Every Instagram measure rose: reach per day 231 against 113, interactions 141 against 42, engagement rate 8.72% against 5.31%, views 3,739 against 2,593. The November 5 Veterans Day reel reached 731 accounts. Name searches clicked through 20.0% against 15.7%. Booking links read 54 against 59, with every week read today, and Google clicks 37 against 41 on 1,365 appearances.",
    headClient: "Instagram reach per day more than doubled to 231, and interactions rose to 141, led by a Veterans Day reel on Dr. El Chaar’s Army service that reached 731 people. Searches for the practice or a doctor by name clicked through 20% of the time, and booking links drew 54 clicks, led by Lenox Hill.",
    items: [
      {
        role: "The outcome",
        text: "Reach per day 113 to 231. Interactions 42 to 141; engagement rate 5.31% to 8.72%. Views 2,593 to 3,739. The 2 reels drew 124 of the 141 interactions: Veterans Day 73, dental anxiety 51. Followers 792 to 798.",
        client: {
          role: "The standout",
          text: "Instagram reach per day rose to 231 from 113, and interactions rose to 141 from 42. The Veterans Day reel reached 731 people, and Dr. Farahani’s reel on dental anxiety drew the week’s highest engagement rate, 13.5%.",
        },
      },
      {
        role: "Strongest signal",
        text: "Name searches 15.7% to 20.0%: 15 clicks from 75 appearances, 7 of them on “nyc dental smiles lenox hill”. Average position 45.0 to 43.8. Facebook page visits 8 to 24. The Veterans Day nomination links drew 13 clicks; nominations close November 11.",
        client: {
          role: "The wider picture",
          text: "People searching for the practice or a doctor by name clicked through 20% of the time, up from 15.7%. Booking links drew 54 clicks, led by Lenox Hill with 20, and the Veterans Day nomination links drew 13.",
        },
      },
      {
        role: "What softened",
        text: "Booking links 59 to 54, every week read today; last week read 51 on November 3, so this week will likely rise. Google clicks 41 to 37, appearances 1,499 to 1,365, doctor–page click rate 5.0% to 2.3%. GA4 still shows the gap: 1 new visitor once a spam referral is removed, 22 of 46 sessions with no source.",
        client: {
          role: "What we are monitoring",
          text: "We are confirming the website’s visit tracking after last month’s fix, so website figures are shown without a comparison this week.",
        },
      },
      {
        role: "Next action",
        internalOnly: true,
        text: "Confirm the GA4 tag with Aren and Johana. Check Dr. Giraldo’s page address with Aren. Add a booking link and remove bounced addresses before the next email. Pull the boosted post’s Meta figures and report it as NYC Dental Smiles paid.",
        client: {
          role: "What we are doing next",
          text: "We will keep building on the doctor-led reels that led this week.",
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
    weeks: ["Oct 5", "Oct 12", "Oct 19", "Oct 26", "Nov 2"],
    cols: [
      { label: "This week", sub: "Nov 2 – 8" },
      { label: "Previous week", sub: "Oct 26 – Nov 1" },
    ],
    rows: [
      { group: "Instagram", k: "Reach per day", note: "Average accounts reached each day. The Veterans Day reel reached 731 on its own.", cells: [{ v: "231", c: "+104%" }, { v: "113" }], trend: [244, 90, 138, 113, 231], fmt: "int" },
      { group: "Instagram", k: "Interactions", note: "Likes, comments, saves and shares on posts and reels. The 2 reels drew 124.", cells: [{ v: "141", c: "+99" }, { v: "42" }], trend: [53, 43, 63, 42, 141], fmt: "int" },
      { group: "Instagram", k: "Engagement rate", note: "Interactions divided by reach. The dental anxiety reel led at 13.5%.", cells: [{ v: "8.72%", c: "+3.41 points" }, { v: "5.31%" }], trend: [3.10, 6.83, 6.52, 5.31, 8.72], fmt: "pct" },
      { group: "Instagram", k: "Views", note: "The Veterans Day reel drew 1,257 and the dental anxiety reel 628.", cells: [{ v: "3,739", c: "+44%" }, { v: "2,593" }], trend: [5514, 2208, 2962, 2593, 3739], fmt: "int" },
      { group: "Instagram", k: "Followers", note: "Account total at the end of each week.", cells: [{ v: "798", c: "+6" }, { v: "792" }], trend: [779, 780, 782, 792, 798], fmt: "int" },
      { group: "Google search", k: "Searches by name", note: "Click rate on searches for the practice or a doctor: 15 clicks from 75 appearances.", cells: [{ v: "20.0%", c: "+4.3 points" }, { v: "15.7%" }], trend: [17.5, 11.7, 14.9, 15.7, 20.0], fmt: "pct1" },
      { group: "Google search", k: "Click rate", note: "Share of appearances that led to a click, steady with the week before.", cells: [{ v: "2.71%", c: "−0.03 points" }, { v: "2.74%" }], trend: [3.71, 3.73, 2.53, 2.74, 2.71], fmt: "pct" },
      { group: "Google search", k: "Clicks", note: "Steady at 3 to 8 a day; Tuesday and Wednesday led with 8 each.", cells: [{ v: "37", c: "−4" }, { v: "41" }], trend: [47, 58, 43, 41, 37], fmt: "int" },
      { group: "Google search", k: "Times the site appeared", note: "1,365 times in Google results, with the average position improving to 43.8 from 45.0.", cells: [{ v: "1,365", c: "−9%" }, { v: "1,499" }], trend: [1266, 1554, 1699, 1499, 1365], fmt: "int" },
      { group: "Google search", k: "Doctor page click rate", note: "All doctor pages: 6 clicks from 261 appearances. Each page sits near position 4 or 5 in Google.", cells: [{ v: "2.3%", c: "−2.7 points" }, { v: "5.0%" }], trend: [10.3, 10.6, 4.8, 5.0, 2.3], fmt: "pct1" },
      { group: "Booking links", k: "Booking link clicks", note: "Lenox Hill 20, Murray Hill 10, Upper East Side 10, Plaza District 9, all locations 5. Every week is read the same day; the latest week may still rise.", cells: [{ v: "54", c: "−8%" }, { v: "59" }], trend: [87, 95, 50, 59, 54], fmt: "int" },
      { group: "Facebook", k: "Page visits", note: "Reported for completeness. At this scale the figures move on single posts.", cells: [{ v: "24", c: "+16" }, { v: "8" }], trend: [26, 22, 10, 8, 24], fmt: "int" },
      { group: "Facebook", k: "Views", note: "Account total, Metricool; a single post swings it at this scale.", cells: [{ v: "188", c: "+121%" }, { v: "85" }], trend: [240, 220, 202, 85, 188], fmt: "int" },
    ] as { group: string; k: string; note?: string; cells: { v: string; c?: string }[]; trend: number[]; fmt: "int" | "pct" | "pct1" }[],
    after: "Website figures are being confirmed after the October 19 tracking fix and appear in Supporting detail.",
  },

  /* -------------------------------------------- THE PERIOD LINE (signature) */
  periodLine: {
    title: "Clicks from Google came in steadily, 3 to 8 a day",
    note:
      "Clicks from Google search each day across both weeks. Shown in place of new website visitors while the website’s visit tracking is confirmed.",
    noteClient:
      "Clicks from Google search each day across both weeks.",
    /* Search Console daily clicks, both weeks read November 9. */
    series: [
      { d: "Oct 26", v: 10 }, { d: "Oct 27", v: 8 }, { d: "Oct 28", v: 7 },
      { d: "Oct 29", v: 9 }, { d: "Oct 30", v: 4 }, { d: "Oct 31", v: 1 },
      { d: "Nov 1", v: 2 }, { d: "Nov 2", v: 6 }, { d: "Nov 3", v: 8 },
      { d: "Nov 4", v: 8 }, { d: "Nov 5", v: 3 }, { d: "Nov 6", v: 4 },
      { d: "Nov 7", v: 4 }, { d: "Nov 8", v: 4 },
    ],
    /* Index of the last day of the previous week (Nov 1). */
    splitAt: 6,
    shade: null as { through: number; label: string } | null,
    markers: [] as { i: number; label: string }[],
    /* derived: 41 ÷ 7 = 5.9; 37 ÷ 7 = 5.3 */
    bands: [
      { label: "October 26 – November 1", value: "6 a day", detail: "Previous week" },
      { label: "November 2 – 8", value: "5 a day", detail: "This week" },
    ],
    read: {
      title: "Reading this fairly:",
      body: "Both weeks are 7 days. Clicks went from 41 to 37. This week was the more even of the two, between 3 and 8 a day, with Tuesday and Wednesday, November 3 and 4, the strongest at 8 each. Google may still add to the last days of the week.",
    },
  },

  /* ----------------------------------------------------------- WHAT WORKED */
  worked: {
    ledeClient: "A Veterans Day reel on Dr. El Chaar’s Army service was the week’s strongest piece, reaching 731 people. Reels led on Instagram, and reach per day rose to 231 from 113.",
    /* Internal build only. */
    lede: "The November 5 Veterans Day reel led: 1,257 views, 731 accounts reached and 73 interactions, 9 of them comments and 6 shares. Dr. Farahani’s November 6 reel on dental anxiety drew 51 interactions at 13.5%, the week’s highest engagement rate. The 2 reels drew 124 of the 141 interactions.",
    lead: {
      kind: "Reel",
      title: "For Dr. El Chaar, this one is personal",
      date: "November 5",
      url: "https://www.instagram.com/reel/DfXTjoixxN9/",
      stats: [
        { v: "1,257", l: "views" },
        { v: "731", l: "accounts reached" },
        { v: "73", l: "interactions" },
        { v: "9", l: "comments" },
      ],
      why:
        "1,257 views and 731 accounts reached, with 73 interactions: 58 likes, 9 comments and 6 shares. Dr. El Chaar is a retired U.S. Army Major, and the reel invites nominations of a veteran to receive a complimentary smile restoration from the team, open through November 11. Viewers watched an average of 12.7 seconds of the 85-second reel.",
      repeatable:
        "Dr. Farahani’s November 6 reel on dental anxiety drew 628 views, 378 accounts reached and a 13.5% engagement rate, the week’s highest. The November 7 post on Dr. Farahani’s patient care drew 453 views.",
    },
    gallery: [
      {
        title: "For Dr. El Chaar, this one is personal", format: "Reel", date: "Nov 5",
        url: "https://www.instagram.com/reel/DfXTjoixxN9/",
        views: "1,257", reach: "731", er: "10.0%", lead: true,
      },
      {
        title: "Dental anxiety is real, and you don’t have to hide it when you walk through our doors", format: "Reel", date: "Nov 6",
        url: "https://www.instagram.com/reel/Dfaapl5RaTn/",
        views: "628", reach: "378", er: "13.5%", lead: false,
      },
      {
        title: "A great dental experience is about more than the final result", format: "Post", date: "Nov 7",
        url: "https://www.instagram.com/p/DfabL6KRS5P/",
        views: "453", reach: "245", er: "6.9%", lead: false,
      },
    ],
    galleryNote:
      "The feed pieces from November 2 to 8, ranked by views. Engagement is interactions divided by reach.",
    channel: {
      title: "Searches by name clicked through more often, and Lenox Hill led booking",
      body:
        "Searches for the practice or a doctor by name clicked through 20.0% of the time, up from 15.7%, and “nyc dental smiles lenox hill” drew 7 clicks from 12 appearances. Booking links drew 54 clicks, led by Lenox Hill with 20, and the Veterans Day nomination links drew 13.",
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
        "1 new visitor for the week against 37 clicks from Google, once 5 sessions from a spam referral (gipkd.com) are removed, and 22 of 46 sessions have no source (48%), against 2 and 28 of 64 the week before. The October 19 fix has not taken.",
      so:
        "Ask Aren and Johana to confirm the GA4 tag fires on every page; GA4’s Realtime report shows a visit within a minute. The client report says the fix is being confirmed.",
    },
    {
      tag: "note",
      title: "The boosted Facebook post still has no Meta figures",
      body:
        "/nycds-website drew 89 clicks this week, 77 of them opened in Facebook’s in-app browser, which points to the boost, “Standard Boosted Out of Feed”, still running. Its Meta figures are not in the Smile Pass campaign export, so reach and spend are still unknown, and Short.io’s link statistics carry no campaign tags to separate it.",
      so:
        "Pull the boost’s figures from Ads Manager for the NYC Dental Smiles page, then report it as NYC Dental Smiles paid, as decided November 2.",
    },
    {
      tag: "early",
      title: "Doctor pages drew fewer clicks, and Dr. Giraldo’s page did not appear",
      body:
        "Doctor–page click rate 2.3%: 6 clicks from 261 appearances, against 16 from 322. Every doctor page in Search Console now shows its /doctors/ address. Dr. Doris Giraldo’s page drew no appearances, against 3 clicks from 41 on /dr-doris-giraldo/ last week.",
      so:
        "Check with Aren that Dr. Giraldo’s page is live at a /doctors/ address, redirected from the old one and in the sitemap.",
    },
    {
      tag: "limitation",
      title: "Short.io keeps adding clicks after a week closes",
      body:
        "Booking clicks for October 26 – November 1 read 51 on November 3 and 59 today; October 19 – 25 read 41 and 50. Every week is now read the same day, so this week’s 54 will likely rise too.",
      so:
        "Track a few weeks of movement before settling the Short.io basis: unfiltered here, all clicks for EEC.",
    },
    {
      tag: "note",
      title: "Google appearances eased while position improved",
      body:
        "1,365 appearances against 1,499 and 37 clicks against 41. The click rate held at 2.71%, and average position improved to 43.8 from 45.0.",
      so:
        "No action. Read it against next week.",
    },
    {
      tag: "limitation",
      title: "The Veterans Day email carried no booking link, and bounces held at 6%",
      body:
        "The November 5 email reached 3,532 inboxes and 28 people clicked: 22 opened the nomination form and 19 the email’s web version, some both. The form link goes straight to Google Forms, so those clicks never reach Short.io. 236 of its 3,768 sends bounced (6.3%), against 241 on October 28, so the bouncing addresses are still on the list. 10 unsubscribes and 3 spam reports.",
      so:
        "Remove bounced addresses before the next send, and add a booking link where it fits the message.",
    },
  ],
  /* --------------------------------------------------------- WHAT WE LEARNED */
  learned: [
    { f: "231", u: "accounts reached per day on Instagram", t: "up from 113. The Veterans Day reel reached 731 on its own." },
    { f: "141", u: "Instagram interactions", t: "up from 42, 124 of them on the week’s 2 reels." },
    { f: "20.0%", u: "click rate on searches by name", t: "up from 15.7%. “nyc dental smiles lenox hill” alone drew 7 clicks." },
    { f: "13.5%", u: "engagement rate on Dr. Farahani’s dental anxiety reel", t: "the week’s highest, with 51 interactions." },
    { f: "20", u: "booking link clicks for Lenox Hill", t: "the most of any location, up from 17." },
    { f: "10", u: "Smile Pass membership leads", t: "up from 9, with 243 new visitors to the site this week." },
  ],
  /* ------------------------------------------------------------- NEXT MOVES */
  moves: [
    {
      action: "Confirm the GA4 tag fires on every page",
      why: "The October 19 fix still does not show: 1 new visitor for the week once a spam referral is removed, and 22 of 46 sessions with no source.",
      owner: "Web — Figment with Johana and Aren",
      measure: "GA4 visits in line with Search Console clicks.",
    },
    {
      action: "Pull the boosted-post figures and report them as NYC Dental Smiles paid",
      why: "The website short link drew 89 clicks, 77 of them in Facebook’s in-app browser, and the boost’s Meta figures are still not in the Smile Pass export.",
      owner: "Account — Figment",
      measure: "Boost reach, spend and clicks in next week’s report.",
    },
    {
      action: "Confirm Dr. Giraldo’s page address with Aren",
      why: "Doctor pages drew 6 clicks from 261 appearances, and Dr. Giraldo’s page drew none after its /dr- address dropped out of Search Console.",
      owner: "Web — Figment with Aren",
      measure: "Dr. Giraldo’s /doctors/ page back in Search Console.",
    },
    {
      action: "Add a booking link and remove bounced addresses before the next email",
      why: "Neither the October 28 nor the November 5 email carried a booking link, and 236 of the 3,768 Veterans Day sends bounced, against 241 a week earlier.",
      owner: "Email — Figment",
      measure: "Booking link clicks from the next email, and bounces under 2% of sends.",
    },
    {
      action: "Wire membership-lead capture back to Meta and Google Analytics",
      why: "WordPress holds 10 membership leads to date, 1 of them this week, but the Meta leads ad records 0 results against its $399.39 spend. The leads are real and landing in WordPress; the ad just cannot see them.",
      owner: "Web — Figment",
      measure: "New leads attributed to the ad in Meta.",
    },
    {
      action: "Build on the doctor-led reels",
      why: "The Veterans Day reel reached 731 accounts and Dr. Farahani’s dental anxiety reel drew a 13.5% engagement rate; the 2 reels drew 124 of the 141 interactions.",
      owner: "Social — Figment",
      measure: "Reach on the next doctor reel, against 731.",
    },
  ],
  /* ---------------------------------------------------------------- DETAIL */
  detail: {
    subtitles: {
      instagram: "November 2 – 8 · account totals from Metricool",
      search: "November 2 – 8 · Google Search Console",
      website: "November 2 – 8 · Google Analytics",
      links: "November 2 – 8 · Short.io",
    },
    instagram: {
      kv: [
        { k: "Views", v: "3,739" },
        { k: "Reach per day", v: "231" },
        { k: "Accounts engaged", v: "149" },
        { k: "Followers", v: "798" },
        { k: "Interactions", v: "141" },
      ],
      postsChart: {
        title: "The feed pieces from this week",
        note: "Ranked by views. Engagement is interactions divided by reach.",
      },
      posts: [
        { t: "For Dr. El Chaar, this one is personal", f: "Reel", d: "Nov 5", v: "1,257", r: "731", i: "73", e: "10.0%" },
        { t: "Dental anxiety is real, and you don’t have to hide it when you walk through our doors", f: "Reel", d: "Nov 6", v: "628", r: "378", i: "51", e: "13.5%" },
        { t: "A great dental experience is about more than the final result", f: "Post", d: "Nov 7", v: "453", r: "245", i: "17", e: "6.9%" },
      ],
      interactionsChart: {
        title: "The reels drew most of the interactions",
        note: "141 interactions: 124 on the 2 reels and 17 on the post.",
      },
      interactions: [
        { label: "Feed posts", value: 17 },
        { label: "Reels", value: 124 },
      ],
      viewsChart: {
        title: "Views by format",
        note: "From Metricool’s format summaries. Stories are shown as impressions. These are not summed; the account total of 3,739 is measured separately.",
      },
      viewsByFormat: [
        { label: "Feed posts", value: 453 },
        { label: "Reels", value: 1885 },
        { label: "Stories", value: 206 },
      ],
      storiesTitle: "Stories",
      stories:
        "Stories drew 206 impressions, with an average reach of 34.",
      note:
        "Account totals are Metricool’s account-level figures, both weeks read November 9; last week now reads 2,593 views and 113 reach per day, against 2,584 and 113 on November 2. Per-piece figures are each read the day after their week closed. Engagement rate is interactions on posts and reels divided by reach: 141 against 1,614 this week and 42 against 791 the week before. 6 Stories this week. Metricool shows 8 followers acquired and 2 lost. None of the week’s Instagram pieces carried paid reach.",
      clientNote:
        "Account totals come from Metricool’s account-level figures rather than a sum of individual posts. Figures for individual posts keep growing after a week ends, so each week is read the day after it closes. Engagement rate is interactions divided by reach.",
    },
    search: {
      kv: [
        { k: "Clicks", v: "37" },
        { k: "Impressions", v: "1,365" },
        { k: "Click rate", v: "2.71%" },
      ],
      impressionsChart: {
        title: "Impressions per day",
        note: "Daily appearances in Google results across the week.",
      },
      impressionsSeries: [
        { d: "Nov 2", v: 168 }, { d: "Nov 3", v: 240 }, { d: "Nov 4", v: 268 },
        { d: "Nov 5", v: 193 }, { d: "Nov 6", v: 171 }, { d: "Nov 7", v: 122 },
        { d: "Nov 8", v: 203 },
      ],
      pagesChart: {
        title: "The homepage draws most of the appearances and clicks",
        note: "Clicks, appearances, click rate and average position by page. The doctor pages together drew 6 clicks from 261 appearances.",
      },
      pages: [
        { p: "Homepage", c: "24", i: "1,058", r: "2.27%", pos: "45.4" },
        { p: "Meet Our Dentists", c: "5", i: "137", r: "3.65%", pos: "26.5" },
        { p: "Locations", c: "2", i: "91", r: "2.20%", pos: "22.4" },
        { p: "Services", c: "2", i: "72", r: "2.78%", pos: "5.1" },
        { p: "Dr. Dana Kapparova", c: "2", i: "59", r: "3.39%", pos: "3.8" },
        { p: "Dr. Sherman Farahani", c: "2", i: "40", r: "5.00%", pos: "5.1" },
        { p: "Dr. Michael Chesner", c: "1", i: "62", r: "1.61%", pos: "4.3" },
        { p: "Dr. Maria Tamay", c: "1", i: "45", r: "2.22%", pos: "4.8" },
        { p: "About", c: "0", i: "68", r: "0%", pos: "29.0" },
        { p: "Dr. Ben Elchami", c: "0", i: "55", r: "0%", pos: "5.3" },
      ],
      devicesChart: {
        title: "Mobile clicks through at a higher rate than desktop",
        note: "Clicks, appearances, click rate and average position by device. Mobile 3.21% against 2.40%.",
      },
      devices: [
        { d: "Desktop", c: "19", i: "791", r: "2.40%", pos: "50.7" },
        { d: "Mobile", c: "18", i: "560", r: "3.21%", pos: "33.8" },
        { d: "Tablet", c: "0", i: "14", r: "0%", pos: "55.4" },
      ],
      queriesChart: {
        title: "Searches that name the practice bring the clicks",
        note: "From the query export, which holds 17 of the 37 clicks and 1,056 of the appearances. Useful for share; totals come from the daily export.",
      },
      queries: [
        { q: "nyc dental smiles lenox hill", c: "7", i: "12", r: "58.33%", pos: "1.0" },
        { q: "nyc dental smiles", c: "6", i: "13", r: "46.15%", pos: "1.3" },
        { q: "dr giraldo dentist", c: "1", i: "4", r: "25.00%", pos: "2.5" },
        { q: "nyc smiles", c: "1", i: "3", r: "33.33%", pos: "2.7" },
        { q: "best dentist for people with anxiety near me", c: "1", i: "1", r: "100.00%", pos: "2.0" },
        { q: "dentist on 16th street", c: "1", i: "1", r: "100.00%", pos: "1.0" },
      ],
      brandSplit: {
        title: "Named and general searches",
        note: "Matched on the practice name, “nyc smiles”, Dr. El Chaar and doctor surnames, the same rule for every week shown. These are shares within the query sample; totals come from the daily export.",
        rows: [
          { k: "Names the practice or a doctor", c: "15", i: "75", r: "20.00%" },
          { k: "General searches", c: "2", i: "981", r: "0.20%" },
        ],
      },
      note:
        "Totals come from Search Console’s daily export for November 2 to 8, read November 9. October 26 – November 1 was re-read the same day: 41 clicks on 1,499 appearances. Average position is weighted by appearances, 43.8 this week against 45.0. Doctor-page click rate counts every doctor page address in both weeks.",
    },
    website: {
      kv: [
        { k: "Sessions", v: "46" },
        { k: "Desktop", v: "64%" },
        { k: "Mobile", v: "36%" },
      ],
      sourcesChart: {
        title: "Where visitors came from",
        note: "Sessions by source. Direct means someone typed the address or used a saved link. Source not recorded means the site did not record where the visit came from.",
      },
      sources: [
        { label: "Source not recorded", value: 22 },
        { label: "Google — organic", value: 10 },
        { label: "Direct", value: 7 },
      ],
      deviceChart: {
        title: "Desktop leads",
        note: "Share of visitors by device.",
      },
      deviceSplit: [
        { label: "Desktop", pct: 64 },
        { label: "Mobile", pct: 36 },
      ] as { label: string; pct: number }[],
      landingChart: {
        title: "Where visitors landed",
        note: "Views by landing page.",
      },
      landing: [
        { label: "Meet Our Dentists", value: 26 },
        { label: "Homepage", value: 25 },
        { label: "Services", value: 19 },
        { label: "About", value: 12 },
        { label: "Locations", value: 9 },
      ] as { label: string; value: number }[],
      note:
        "We are confirming the site’s visit tracking after the October 19 fix, so these figures are shown without a comparison. The week recorded 1 new visitor. 7 further sessions came from referrals.",
    },
    links: {
      kv: [
        { k: "Booking · all locations", v: "54" },
        { k: "Homepage and website", v: "92" },
        { k: "Veterans Day nomination", v: "13" },
        { k: "Total", v: "159" },
      ],
      destsChart: {
        title: "Clicks by link",
        note: "The practice’s short links with clicks this week.",
      },
      dests: [
        { label: "Main website", value: 89 },
        { label: "Lenox Hill — booking", value: 20 },
        { label: "Veterans Day nomination", value: 13 },
        { label: "Murray Hill — booking", value: 10 },
        { label: "Upper East Side — booking", value: 10 },
        { label: "Plaza District — booking", value: 9 },
        { label: "All locations — booking", value: 5 },
        { label: "Homepage", value: 3 },
      ],
      note:
        "159 clicks this week against 222, with every week read November 9. Booking links drew 54 against 59, the website and homepage links 92 against 157, and the Veterans Day nomination links 13 against 6. Most of the website link’s 89 clicks came from Facebook. Booking links include the practice’s earlier online booking links. The Smile Pass link is reported in the Smile Pass section.",
    },
    email: {
      window: "November 5, 2026 · 1 campaign",
      note: "The Veterans Day email reached 3,532 inboxes on November 5, and 28 people clicked through, 22 of them to the veteran nomination form. Confirmed opens leave out the opens mail apps record on their own when they preload images. Rates are calculated on delivered emails.",
      table: {
        head: ["Campaign", "Sends", "Confirmed opens", "All opens", "Clicks"],
        rows: [
          ["Veterans Day Email - NYCDS", "3,768", "334 (9.5%)", "1,795 (50.8%)", "28 (0.8%)"],
        ],
      },
      tableInternal: {
        head: ["Campaign", "Sends", "Confirmed opens", "All opens", "Clicks", "Bounces"],
        rows: [
          ["Veterans Day Email - NYCDS", "3,768", "334 (9.5%)", "1,795 (50.8%)", "28 (0.8%)", "236 (6.3%)"],
        ],
      },
      tableChart: {
        title: "The campaign sent this week",
        note: "From the campaign’s Reporting page. Open and click rates are on delivered emails, as Constant Contact reports them.",
      },
    } as null | {
      window: string;
      note: string;
      table: { head: string[]; rows: string[][] };
      tableInternal: { head: string[]; rows: string[][] };
      tableChart: { title: string; note: string };
    },
    facebook: {
      subtitle: "November 2 – 8 · account totals from Metricool",
      kv: [
        { k: "Followers", v: "982" },
        { k: "Views", v: "188" },
        { k: "Page visits", v: "24" },
      ],
      note:
        "Page visits 24 against 8. Views 188 against 85, restated from 82 in last week’s report. Followers 982, unchanged. At this scale the figures move on single pieces of content and are reported for completeness.",
    },
    method: [
      { q: "What the report covers", a: "November 2 to 8, 2026, 7 full days, Monday to Sunday, compared with October 26 to November 1. Both weeks are the same length, so every comparison is direct." },
      { q: "Where the Instagram totals come from", a: "Metricool’s account-level figures. Per-piece figures are used only to rank content against content." },
      { q: "How engagement rate is calculated", a: "Interactions on posts and reels divided by reach, meaning the share of people who saw something and engaged with it." },
      { q: "Why each week is read the day after it closes", a: "Figures for individual posts keep growing after a week ends. Reading each week the day after it closes means both weeks have had the same time to collect views." },
      { q: "Which reading the previous week uses", a: "Metricool account totals for October 26 to November 1 were read again on November 9, so both weeks are read the same day. Search figures for that week were re-read the same day, and short link figures for every week shown were read November 9.", internalOnly: true },
      { q: "Why the search figures may change", a: "Google keeps processing search data for several days, so the most recent days of any week are the least settled." },
      { q: "How the doctor page click rate is calculated", a: "Every doctor page address, counted the same way in both weeks: 6 clicks from 261 appearances this week, 16 from 322 the week before." },
      { q: "How searches by name are counted", a: "Searches that include the practice name, “nyc smiles”, Dr. El Chaar’s name or a doctor’s surname, within Google’s query sample. The same rule is applied to every week shown, so earlier weeks can read slightly differently from past reports." },
      { q: "How short link clicks are counted", a: "Clicks on the practice’s named short links, counted the same way in every week shown. Booking links include the practice’s earlier online booking links. Every week is read on the same day, and the most recent week can still rise as Short.io finishes counting. The Smile Pass link is reported in the Smile Pass section." },
      { q: "Why website figures are not compared this week", a: "The way the site counts visits changed at the end of September. A fix was made on October 19 and is being confirmed; this week still recorded 1 new visitor. Until it is confirmed, website figures are shown without a week-to-week comparison, and the daily chart shows clicks from Google instead." },
      { q: "Where the Social section is", a: "The social lead’s write-up arrives after first review. It is checked figure by figure against the Metricool export before it is added.", internalOnly: true },
      { q: "What is not in this report", a: "Story interactions are not in the Instagram export. The Smile Pass section is reported since launch, separate from the weekly figures." },
    ] as { q: string; a: string; internalOnly?: boolean; clientOnly?: boolean }[],
  },
  /* ------------------------------------------------------------ SMILE PASS
     A separate overview, not part of the weekly comparison. July 1 –
     November 8, 2026. Sources: GA4 property "NYC Dental Smiles Membership",
     Meta Ads (August export; fall campaigns October 1 – November 9), Short.io,
     Metricool (organic only), Search Console, and the website's own
     membership lead list. */
  smilepass: {
    title: "NYC Smile Pass",
    dateLine: "July 1 – November 8, 2026, since launch",
    lede:
      "Smile Pass since July 1. 10 membership leads to date, against 9 a week ago, 1 of them new this week. November 2 – 8 drew 243 new visitors, against 266. The October 23 Dr. Tamay reel remains the strongest Smile Pass piece. /nycsmilepass drew 445 clicks. The 2 fall ads have spent $499.32 of $500 and end November 9; the leads ad still records no leads in Meta, though the website now holds 10.",
    ledeClient:
      "An overview of NYC Smile Pass since July 1. Membership leads reached 10, up from 9 a week ago, the site has drawn 3,384 new visitors since launch, and the Dr. Tamay reel remains the strongest Smile Pass post so far.",
    kv: [
      { k: "Membership leads", v: "10" },
      { k: "New website visitors", v: "3,384" },
      { k: "People reached by the August campaign", v: "62,053" },
      { k: "Profile visits from the engagement ad", v: "336" },
      { k: "Instagram followers", v: "51" },
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
      { d: "Nov 7", v: 39 }, { d: "Nov 8", v: 13 },
    ],
    dailyChart: {
      title: "Visits peaked with the August campaign and continued through the fall",
      /* indices into `daily`: 41 = Aug 11, 60 = Aug 30 */
      band: { from: 41, to: 60, label: "August campaign" },
      note:
        "New website visitors each day since July 1. 2,067 of the 3,384 arrived between August 11 and 30, during the launch campaign. November 2 – 8 drew 243, against 266 the week before, with 67 on November 3. The same week, /nycsmilepass drew 445 clicks; clicks and visits are largely the same people and are not added together.",
      noteClient:
        "New website visitors each day since July 1. Most arrived during the August launch campaign, and visits have continued through the fall: 243 new visitors from November 2 to 8.",
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
      title: "The fall ads, which end November 9",
      table: {
        head: ["Ad", "Goal", "Spend of budget", "People reached", "Impressions", "Link click rate", "Result"],
        rows: [
          ["Reel Engagement/Follows Fall 2026", "Instagram profile visits", "$99.93 of $100", "2,662", "4,214", "6.22%", "336 profile visits, $0.30 each"],
          ["Reel Leads Fall 2026", "Membership leads", "$399.39 of $400", "7,837", "12,140", "14.14%", "0 in Meta; 10 on the website"],
          ["Total", "", "$499.32 of $500", "", "16,354", "", ""],
        ],
      },
      tableClient: {
        head: ["Ad", "Goal", "People reached", "Impressions", "Link click rate", "Result"],
        rows: [
          ["Engagement ad", "Visits to the Smile Pass Instagram profile", "2,662", "4,214", "6.22%", "336 profile visits, 30 cents each"],
          ["Leads ad", "Membership leads", "7,837", "12,140", "14.14%", "10 membership leads to date on the website"],
        ],
      },
      note:
        "Meta’s campaign export for October 1 – November 9, which includes part of November 9, the ads’ last day: $499.32 of $500 spent. 80% of the spend, $399.39, went to the leads ad, which optimizes for membership leads; Meta records none against it, though the website’s own list holds 10 leads, 1 of them this week. Its link click rate was 14.14%, up from 13.65%. The engagement ad has drawn 336 profile visits at 30 cents each, up from 303. This export carries no quality ranking. People reached is not added across the 2 ads, since the same person can see both.",
      noteClient:
        "2 ads ran this fall, with figures from October 1 to November 9, when both end. The engagement ad brings people to the Smile Pass Instagram profile. The leads ad, which carries most of the budget, is set up to find people likely to become members; the website has recorded 10 membership leads to date. People reached is counted per ad, since the same person can see both.",
    },
    sources: {
      title: "Where visitors came from, by source",
      table: {
        head: ["Source", "Visits", "Share"],
        rows: [
          ["Instagram ads", "1,698", "46.0%"],
          ["Audience Network ads", "1,020", "27.6%"],
          ["Facebook ads", "492", "13.3%"],
          ["Direct", "252", "6.8%"],
          ["Google search", "107", "2.9%"],
          ["Instagram and Facebook, unpaid", "64", "1.7%"],
        ],
      },
      note:
        "July 1 – November 8, sessions by source from GA4, 3,691 in all. Paid Instagram brought 1,698, 46% of the total; Audience Network 1,020 and Facebook ads 492. Audience Network has grown from 765 a week ago and remains the 2nd-largest source. Threads ads (34), Bing (7), the unassigned group (13) and Yahoo (2) are not shown.",
      noteClient:
        "Sessions by source since July 1. Most visits came through the paid campaigns on Instagram, Audience Network and Facebook. Direct visits and Google search follow. Sources with fewer than 50 visits are not shown.",
    },
    social: {
      title: "Smile Pass on social",
      table: {
        head: ["", "Instagram", "Facebook"],
        rows: [
          ["Followers", "51", "40"],
          ["Average reach per post", "52", "15"],
          ["Reels", "4,077 views · 309 average reach", "1,112 video views"],
          ["Strongest piece", "Oct 23 reel · 3,150 views · 1,749 reach", "—"],
        ],
      },
      note:
        "Unpaid content only, from July 10, from Metricool, read November 9. Account-level reach and views include ad delivery and are not used. Followers 51 and 40, against 46 and 37 on November 1 as read today; last week’s report showed 44 for Instagram, from an earlier reading. Average reach per post 52 and 15. The strongest piece remains the October 23 reel, “No dental insurance? Dr. Tamay has some good news for you.”: 3,150 views, 1,749 reach and 165 interactions, up from 2,597, 1,320 and 150 at the October 25 reading. Reel totals now come from Metricool’s per-reel organic figures, read the same day.",
      noteClient:
        "Unpaid posts only, from July 10. Instagram has grown to 51 followers and Facebook to 40. The strongest post remains the October 23 reel with Dr. Tamay, now at 3,150 views and 165 interactions.",
    },
    search: {
      title: "Search",
      kv: [
        { k: "Clicks from Google", v: "39" },
        { k: "Appearances in Google", v: "457" },
        { k: "Most common search", v: "“nyc dental smiles”" },
      ],
      note:
        "July 1 – November 8, from the daily export. The query list shows 141 appearances for “nyc dental smiles” and 23 for “dental membership plan nyc”. The join page drew 1 click from 43 appearances. November 2 – 8 drew 4 clicks from 65 appearances, against 3 from 47.",
      noteClient:
        "Search presence is still early for a new site. Most searches that showed Smile Pass were for the NYC Dental Smiles name, and the site has drawn 39 clicks from Google since July.",
    },
    findings: {
      title: "What we learned",
      items: [
        {
          t: "Membership leads rose to 10",
          b: "10 membership leads to date, from the website’s lead list after removing 1 test entry and 2 repeat submissions, against 9 a week ago, with 1 new this week, on November 6. The Meta leads ad spent $399.39 at a 14.14% link click rate but records no leads; GA4 has no lead event either, so neither can yet link a lead to an ad.",
          client: { t: "Membership leads reached 10", b: "Membership leads rose to 10 from 9 a week ago. Connecting leads to Meta and Google Analytics is the next step, so every future report can show where they come from." },
        },
        {
          t: "The engagement ad keeps building the Instagram audience",
          b: "336 profile visits for $99.93 to November 9, 30 cents each, up from 303. Smile Pass Instagram followers reached 51, against 46 on November 1 as read today, and Facebook 40, against 37.",
          client: { t: "Instagram keeps growing", b: "The engagement ad has drawn 336 visits to the Smile Pass Instagram profile, up from 303, and the account has grown to 51 followers from 46." },
        },
        {
          t: "Audience Network brought the most new ad visits",
          b: "Audience Network, Meta’s placements in other apps and sites, has brought 1,020 visits since launch, against 765 a week ago, and remains the 2nd-largest source. Paid Instagram rose to 1,698 from 1,682 and Facebook ads to 492 from 484. Short.io’s link statistics carry no campaign tags, so this week’s split comes from GA4.",
          client: { t: "The ads reach beyond Instagram and Facebook", b: "Audience Network, Meta’s placements across other apps and sites, brought the most new visits from the ads this week and remains the 2nd-largest source of visits to the site." },
        },
        {
          t: "A Dr. Tamay reel remains the strongest Smile Pass piece",
          b: "The October 23 reel: 3,150 views, 1,749 accounts reached, 165 interactions and 15 shares, up from 2,597, 1,320 and 150 at the October 25 reading. Nothing since has surpassed it. Smile Pass followers grew to 51 on Instagram and 40 on Facebook.",
          client: { t: "A reel with Dr. Tamay is still the top post", b: "The October 23 reel with Dr. Tamay has now reached 1,749 people with 165 interactions, and the accounts grew to 51 followers on Instagram and 40 on Facebook." },
        },
        {
          t: "Visits since launch reached 3,384",
          b: "243 new visitors from November 2 to 8, against 266 the week before. Most of the 3,384 since July arrived during the August campaign; October and November have added steadily.",
          client: { t: "Visits keep building", b: "The site has drawn 3,384 new visitors since July, with 243 from November 2 to 8. Most arrived during the August launch campaign." },
        },
      ],
    },
    next: {
      title: "What we’d do next",
      items: [
        { t: "Wire membership-lead capture back to Meta and Google Analytics", b: "The website holds 10 leads the leads ad cannot see. Recording each lead lets Meta find more people like them, and lets every report measure leads directly." },
        { t: "Make more doctor-led reels", b: "The Dr. Tamay reel drew the most views and reach of any Smile Pass post. More reels with the doctors will show whether the format repeats." },
        { t: "Compare leads by ad placement", b: "Audience Network brought the most new ad visits this week. Once leads are recorded, comparing them by placement will show where the budget works hardest." },
        { t: "Keep sharing Smile Pass from NYC Dental Smiles", b: "NYC Dental Smiles has 798 Instagram followers; Smile Pass has 51." },
      ],
    },
    method:
      "New visitor totals come from GA4’s daily series, July 1 – November 8, property NYC Dental Smiles Membership; visits by source cover the same dates. August campaign figures are Meta’s August export. Fall ad figures are Meta’s campaign export for October 1 – November 9. Short link clicks are Short.io, November 2 – 8. Social figures are organic only, from July 10, from Metricool, because account totals include ad delivery. Search covers July 1 – November 8. Membership leads are the website’s own lead list, with repeat and test entries removed.",
    methodClient:
      "Figures cover July 1 to November 8, 2026. Website figures are from Google Analytics, ad figures from Meta for October 1 to November 9, social figures from Metricool and search figures from Google Search Console. Membership leads are from the website’s own records. Social figures cover unpaid posts only.",
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
  { k: "Instagram", v: "Nov 2 – 8", p: "Account-level figures from Metricool, against Oct 26 – Nov 1." },
  { k: "Facebook", v: "Nov 2 – 8", p: "Account-level figures from Metricool." },
  { k: "Search", v: "Nov 2 – 8", p: "Against Oct 26 – Nov 1. The last days of this week may still rise." },
  { k: "Website", v: "Nov 2 – 8", p: "Being confirmed after the October 19 fix. Shown without a comparison." },
  { k: "Short links", v: "Nov 2 – 8", p: "All named NYC Dental Smiles links, every week read the same day." },
  { k: "Email", v: "Nov 5", p: "1 campaign, from its Constant Contact report." },
  { k: "Smile Pass", v: "Jul 1 – Nov 8", p: "An overview since launch, separate from the weekly figures. Fall ads: Meta, Oct 1 – Nov 9." },
];
