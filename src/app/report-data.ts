/* ==========================================================================
   REPORT DATA  ·  NYC Dental Smiles
   --------------------------------------------------------------------------
   THIS CYCLE — a single week.
     October 26 – November 1 against October 19 – 25: two 7-day windows,
     Monday to Sunday, directly comparable. Metricool account totals for both
     weeks read November 2: October 19 – 25 restated views 2,960 to 2,962,
     reach per day 138, Facebook views 201 to 202. Per-piece figures keep their
     day-after reading (interactions 63 and 42).

   READ-DATE RULE — Metricool per-piece figures are each read the day after
     their week closed.

   WEBSITE (GA4) — the October 19 fix still does not show in the October 26 –
     November 1 export: 2 new visitors for the week, 28 of 64 sessions with no
     source (44%), against 3 and 31 of 79 the week before. Client copy says
     website figures are being confirmed after the fix; no comparison; period
     line stays on Search Console clicks.

   BOOSTED POST — NYC Dental Smiles boosted one Facebook post this week
     ("Figment Creative 4743 Standard Boosted Out of Feed"), which drove 114 of
     /nycds-website's 152 short-link clicks. Its Meta figures are not in the
     Smile Pass ad export, so reach and spend are unknown. Flagged in Needs
     Attention and Next Moves; kept out of all client copy this cycle
     (Walter, Nov 2), to be reported as NYC Dental Smiles paid once the
     boost's Meta figures are pulled.

   SHORT LINKS — Short.io, Path view, All clicks, the named practice paths.
     /nycsmilepass (441) is reported under Smile Pass. /DDS-PC-UES (8) is EEC's
     and is excluded. /y9wdZ7 (6) is unidentified and omitted. /* is excluded.

   SEARCH — Chart.csv for totals. October 19 – 25 re-pulled November 2 and
     unchanged at 43 clicks on 1,699 appearances. Name searches use the same
     match as the prior weeks. Doctor pages count every address: 16 clicks from
     319 appearances this week.

   EMAIL — 2 campaigns, October 28, from each campaign's Reporting page. Rates
     are Constant Contact's, on delivered emails; bounce share on sends. End of
     Year Benefits | NYCDS: 3,778 sends, 3,537 delivered, 1,818 opens (CC
     reported, 51%), 27 clicks, 241 bounces, 7 unsubscribes. Oral
     Genome Offer Email #2: 38 sends, 16 opens, 1 click, 2 bounces.

   SOCIAL — hidden until the social lead's write-up arrives after first review.

   SMILE PASS — July 1 – November 1. Daily visitors from the GA4 time series,
     property NYC Dental Smiles Membership: 3,141 to date, 266 this week.
     Membership leads 9: the website's lead list of 12, less 2 repeat entries
     (Danny Warren, Xiomara Hernandez) and 1 Figment test entry, per Walter;
     1 new this week (Monday Erhabor, October 27). Walter: call them membership
     leads; the WordPress list was reconfirmed November 2. Current ads: Meta
     campaign export for October 3 – November 1, $427.60 of $500 spent, leads
     ad records 0 in Meta. Short.io /nycsmilepass 441, 432 tagged paid, 409
     Audience Network. The engagement-by-source GA4 export was not included this
     week, so the sources table shows sessions and share only.

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
    label: "October 26 – November 1, 2026",
    length: "7 days",
    comparedWith: "the 7 days before it (October 19 – 25)",
    paidStatus:
      "Both weeks are 7 days, Monday to Sunday, so every comparison is direct.",
  },

  copy: {
    scoreboard: {
      title: "The week in numbers",
      lede: "Each measure this week and the week before, with its trend over the last 5 weeks. This week is the plum point.",
    },
    worked: {
      title: "A reel on the mouth–body connection led the week",
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
    head: "Instagram settled back from last week’s reel: views 2,584 against 2,962, reach per day 113 against 138. The October 29 reel on the mouth–body connection reached 295 accounts with 28 interactions. Booking links rose to 45 from 28, and clicks from Google held at 41 against 43 while appearances came down to 1,496.",
    headClient: "Booking link clicks rose to 45 this week, up from 28, led by Murray Hill. A reel on how oral health connects to overall health reached 295 people, and Instagram followers grew to 792. The site drew 41 clicks from Google.",
    items: [
      {
        role: "The outcome",
        text: "Views 2,962 to 2,584. Daily reach 138 to 113. Interactions 63 to 42; engagement rate 6.52% to 5.31%. The October 29 oral–health reel drew 496 of the 1,222 feed views and 28 of the 42 interactions. Followers 782 to 792.",
        client: {
          role: "The standout",
          text: "Booking link clicks rose to 45 from 28. Murray Hill led with 13, then Lenox Hill with 12 and all locations with 11.",
        },
      },
      {
        role: "Strongest signal",
        text: "Booking links 28 to 45: Murray Hill 13, Lenox Hill 12, all locations 11, Plaza District 8, Upper East Side 1. Name searches clicked through 12.1% against 11.5%. The website short link drew 152 clicks, 114 of them from a boosted Facebook post.",
        client: {
          role: "The wider picture",
          text: "People searching for the practice or a doctor by name clicked through 12.1% of the time, up from 11.5%. The site appeared in Google 1,496 times and drew 41 clicks.",
        },
      },
      {
        role: "What softened",
        text: "Instagram views 2,962 to 2,584 and reach 138 to 113, after last week’s Hygiene Month reel. Google appearances 1,699 to 1,496 and clicks 43 to 41. Doctor–page click rate 5.0%. GA4 still shows the gap after the October 19 fix: 2 new visitors, 28 of 64 sessions with no source.",
        client: {
          role: "What we are monitoring",
          text: "We are confirming the website’s visit tracking after last month’s fix, so website figures are shown without a comparison this week.",
        },
      },
      {
        role: "Next action",
        internalOnly: true,
        text: "Confirm the GA4 tag with Aren and Johana. Settle 1 address per doctor page. Add a booking link to the next email. Confirm the boosted–post spend and whether to report it.",
        client: {
          role: "What we are doing next",
          text: "We will keep featuring the team through the month and add a booking link to the next email, building on the booking clicks that rose this week.",
        },
      },
    ] as { role: string; text: string; internalOnly?: boolean; client?: { role: string; text: string } }[],
  },

  /* ------------------------------------------------------------ SCOREBOARD */
  /* The ledger. `trend` runs oldest to newest and ends with this week. Each
     earlier point is that week's most recent reading, as published. Booking
     links start at September 21, when the current counting began.
     Change strings start with "+" or "−" (minus sign) to draw an arrow. */
  scoreboard: {
    weeks: ["Sep 28", "Oct 5", "Oct 12", "Oct 19", "Oct 26"],
    cols: [
      { label: "This week", sub: "Oct 26 – Nov 1" },
      { label: "Previous week", sub: "Oct 19 – 25" },
    ],
    rows: [
      { group: "Booking links", k: "Booking link clicks", note: "Murray Hill 13, Lenox Hill 12, all locations 11, Plaza District 8, Upper East Side 1.", cells: [{ v: "45", c: "+61%" }, { v: "28" }], trend: [35, 55, 68, 28, 45], fmt: "int" },
      { group: "Google search", k: "Searches by name", note: "Click rate on searches for the practice or a doctor: 11 clicks from 91 appearances.", cells: [{ v: "12.1%", c: "+0.6 points" }, { v: "11.5%" }], trend: [10.3, 15.5, 7.5, 11.5, 12.1], fmt: "pct1" },
      { group: "Google search", k: "Doctor page click rate", note: "All doctor pages: 16 clicks from 319 appearances.", cells: [{ v: "5.0%", c: "+0.2 points" }, { v: "4.8%" }], trend: [8.3, 10.3, 10.6, 4.8, 5.0], fmt: "pct1" },
      { group: "Google search", k: "Click rate", note: "Share of appearances that led to a click.", cells: [{ v: "2.74%", c: "+0.21 points" }, { v: "2.53%" }], trend: [3.78, 3.71, 3.73, 2.53, 2.74], fmt: "pct" },
      { group: "Google search", k: "Times the site appeared", note: "1,496 times in Google results, easing after 5 weeks of gains.", cells: [{ v: "1,496", c: "−12%" }, { v: "1,699" }], trend: [1190, 1266, 1554, 1699, 1496], fmt: "int" },
      { group: "Google search", k: "Clicks", note: "Held near the week before while the click rate rose; Monday was the strongest day at 10.", cells: [{ v: "41", c: "−2" }, { v: "43" }], trend: [45, 47, 58, 43, 41], fmt: "int" },
      { group: "Instagram", k: "Followers", note: "Account total at the end of each week.", cells: [{ v: "792", c: "+10" }, { v: "782" }], trend: [779, 779, 780, 782, 792], fmt: "int" },
      { group: "Instagram", k: "Views", note: "The Oct 29 oral-health reel drew 496, as the week came off last week’s Hygiene Month reel.", cells: [{ v: "2,584", c: "−13%" }, { v: "2,962" }], trend: [3383, 5514, 2208, 2962, 2584], fmt: "int" },
      { group: "Instagram", k: "Reach per day", note: "Average accounts reached each day. The oral-health reel reached 295 on its own.", cells: [{ v: "113", c: "−18%" }, { v: "138" }], trend: [160, 244, 90, 138, 113], fmt: "int" },
      { group: "Instagram", k: "Interactions", note: "Likes, comments, saves and shares on posts and reels. The oral-health reel drew 28.", cells: [{ v: "42", c: "−21" }, { v: "63" }], trend: [51, 53, 43, 63, 42], fmt: "int" },
      { group: "Instagram", k: "Engagement rate", note: "Interactions divided by reach; both eased from last week’s reel.", cells: [{ v: "5.31%", c: "−1.21 points" }, { v: "6.52%" }], trend: [4.55, 3.10, 6.83, 6.52, 5.31], fmt: "pct" },
      { group: "Facebook", k: "Page visits", note: "Reported for completeness. At this scale the figures move on single posts.", cells: [{ v: "8", c: "−2" }, { v: "10" }], trend: [4, 26, 22, 10, 8], fmt: "int" },
      { group: "Facebook", k: "Views", note: "Account total, Metricool; a single post swings it at this scale.", cells: [{ v: "82", c: "−59%" }, { v: "202" }], trend: [309, 240, 220, 202, 82], fmt: "int" },
    ] as { group: string; k: string; note?: string; cells: { v: string; c?: string }[]; trend: number[]; fmt: "int" | "pct" | "pct1" }[],
    after: "Website figures are being confirmed after the October 19 tracking fix and appear in Supporting detail.",
  },

  /* -------------------------------------------- THE PERIOD LINE (signature) */
  periodLine: {
    title: "Clicks from Google held at 41",
    note:
      "Clicks from Google search each day across both weeks. Shown in place of new website visitors while the website’s visit tracking is confirmed.",
    noteClient:
      "Clicks from Google search each day across both weeks.",
    /* Search Console daily clicks, both weeks read November 2. */
    series: [
      { d: "Oct 19", v: 11 }, { d: "Oct 20", v: 7 }, { d: "Oct 21", v: 7 },
      { d: "Oct 22", v: 7 }, { d: "Oct 23", v: 5 }, { d: "Oct 24", v: 3 },
      { d: "Oct 25", v: 3 }, { d: "Oct 26", v: 10 }, { d: "Oct 27", v: 8 },
      { d: "Oct 28", v: 7 }, { d: "Oct 29", v: 9 }, { d: "Oct 30", v: 4 },
      { d: "Oct 31", v: 1 }, { d: "Nov 1", v: 2 },
    ],
    /* Index of the last day of the previous week (Oct 25). */
    splitAt: 6,
    shade: null as { through: number; label: string } | null,
    markers: [] as { i: number; label: string }[],
    /* derived: 43 ÷ 7 = 6.1; 41 ÷ 7 = 5.9 */
    bands: [
      { label: "October 19 – 25", value: "6 a day", detail: "Previous week" },
      { label: "October 26 – November 1", value: "6 a day", detail: "This week" },
    ],
    read: {
      title: "Reading this fairly:",
      body: "Both weeks are 7 days. Clicks went from 43 to 41. This week was the steadier of the two, between 1 and 10 a day, with Monday, October 26 the strongest at 10. The weekend read 1 and 2, and Google may still add to those days.",
    },
  },

  /* ----------------------------------------------------------- WHAT WORKED */
  worked: {
    ledeClient: "A reel on how oral health connects to overall health was the week’s strongest piece, reaching 295 people. Reels led on Instagram, and the Smile Pass engagement ad lifted that account to 44 followers.",
    /* Internal build only. */
    lede: "The October 29 oral–health reel led: 496 views, 295 accounts reached and 28 interactions, 6 of them shares. Its engagement rate, 9.5%, was the week’s highest on feed content. The 3 feed posts drew 726 views between them.",
    lead: {
      kind: "Reel",
      title: "Your oral health affects more than just your teeth and gums",
      date: "October 29",
      url: "https://www.instagram.com/reel/DfFueasTiNl/",
      stats: [
        { v: "496", l: "views" },
        { v: "295", l: "accounts reached" },
        { v: "28", l: "interactions" },
        { v: "6", l: "shares" },
      ],
      why:
        "496 views and 295 accounts reached, with 28 interactions: 21 likes, 6 shares and 1 save. A reel on how oral bacteria and inflammation reach beyond the mouth, part of the practice’s wellness content. Viewers watched an average of 9.5 seconds of the 18–second reel.",
      repeatable:
        "The Veterans Day post on October 29 drew 395 views and 226 accounts reached. The Halloween candy post on October 30 drew 148.",
    },
    gallery: [
      {
        title: "Your oral health affects more than just your teeth and gums", format: "Reel", date: "Oct 29",
        url: "https://www.instagram.com/reel/DfFueasTiNl/",
        views: "496", reach: "295", er: "9.5%", lead: true,
      },
      {
        title: "This Veterans Day, we want to give back to someone who has given so much", format: "Post", date: "Oct 29",
        url: "https://www.instagram.com/p/DfFT6QFx5ye/",
        views: "395", reach: "226", er: "3.1%", lead: false,
      },
      {
        title: "Pumpkin spice latte season is officially here, and your smile can enjoy it too", format: "Post", date: "Oct 28",
        url: "https://www.instagram.com/p/DfDNU3hljX4/",
        views: "183", reach: "82", er: "4.9%", lead: false,
      },
    ],
    galleryNote:
      "The feed pieces from October 26 to November 1, ranked by views. Engagement is interactions divided by reach.",
    channel: {
      title: "Booking links rose, and name searches clicked through more often",
      body:
        "Booking link clicks rose to 45 from 28, led by Murray Hill with 13. Searches for the practice or a doctor by name clicked through 12.1% of the time, up from 11.5%, while the site appeared in Google 1,496 times.",
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
        "2 new visitors recorded for the week against 41 clicks from Google, and 28 of 64 sessions have no source (44%), against 3 and 31 of 79 the week before. The October 19 fix has not taken.",
      so:
        "Ask Aren and Johana to confirm the GA4 tag fires on every page; GA4’s Realtime report shows a visit within a minute. The client report says the fix is being confirmed.",
    },
    {
      tag: "note",
      title: "A boosted Facebook post drove the website short link",
      body:
        "/nycds-website drew 152 clicks, 114 of them tagged to a boosted post, “Standard Boosted Out of Feed”. Its Meta figures are not in the Smile Pass ad export, so reach and spend are unknown.",
      so:
        "Confirm the boost with the team, pull its Meta figures, and decide whether to report NYC Dental Smiles paid separately from Smile Pass.",
    },
    {
      tag: "early",
      title: "Doctor pages still take appearances with few clicks",
      body:
        "Doctor–page click rate 5.0%: 16 clicks from 319 appearances. The /doctors/ addresses continue alongside the original /dr- addresses.",
      so:
        "Settle 1 address per doctor with Aren, with a redirect from the other. Carried from the last 2 weeks.",
    },
    {
      tag: "expected",
      title: "Instagram came down from last week’s reel",
      body:
        "Views 2,962 to 2,584, reach per day 138 to 113. Last week’s Hygiene Month reel reached 600 on its own; this week’s strongest reached 295. The 3 feed posts drew 726 views between them.",
      so:
        "Compare next week with this one. Neither week has a single breakout piece.",
    },
    {
      tag: "note",
      title: "Google appearances came down after 5 weeks of gains",
      body:
        "1,496 appearances against 1,699. Clicks held at 41 against 43, and the click rate rose to 2.74% from 2.53%. The weekend read 1 and 2 clicks and may still rise.",
      so:
        "No action. Read it against next week.",
    },
    {
      tag: "limitation",
      title: "The End of Year email went out without a booking link",
      body:
        "End of Year Benefits reached 3,537 inboxes on October 28 and drew 27 clicks, a 0.8% click rate; 241 of its 3,778 sends bounced (6.4%).",
      so:
        "Add a booking link to the next send, and remove addresses that bounce from the list.",
    },
  ],
  /* --------------------------------------------------------- WHAT WE LEARNED */
  learned: [
    { f: "45", u: "booking link clicks", t: "up from 28, led by Murray Hill with 13." },
    { f: "295", u: "accounts reached by the oral-health reel", t: "the week’s strongest piece, with 28 interactions and 6 shares." },
    { f: "12.1%", u: "click rate on searches by name", t: "up from 11.5%. “nyc dental smiles” alone drew 5 clicks." },
    { f: "792", u: "Instagram followers", t: "up 10 on the week." },
    { f: "303", u: "profile visits from the Smile Pass engagement ad", t: "up from 245, at 29 cents each." },
    { f: "9", u: "Smile Pass membership leads", t: "up from 8, with 266 new visitors to the site this week." },
  ],
  /* ------------------------------------------------------------- NEXT MOVES */
  moves: [
    {
      action: "Confirm the GA4 tag fires on every page",
      why: "The October 19 fix still does not show: 2 new visitors for the week and 28 of 64 sessions with no source.",
      owner: "Web — Figment with Johana and Aren",
      measure: "GA4 visits in line with Search Console clicks.",
    },
    {
      action: "Pull the boosted-post figures and decide how to report them",
      why: "A boosted Facebook post drove 114 of the website short link’s 152 clicks, and its Meta figures are not in the Smile Pass export.",
      owner: "Account — Figment",
      measure: "Boost reach and spend recorded; a rule for reporting NYC Dental Smiles paid.",
    },
    {
      action: "Settle 1 address per doctor page",
      why: "Doctor pages drew 16 clicks from 319 appearances across 2 address sets.",
      owner: "Web — Figment with Aren",
      measure: "1 address per doctor in Search Console.",
    },
    {
      action: "Add a booking link to the next email",
      why: "The End of Year email drew 27 clicks and carried no booking link; booking short links rose to 45 this week.",
      owner: "Email — Figment",
      measure: "Booking link clicks from the next email.",
    },
    {
      action: "Wire membership-lead capture back to Meta and Google Analytics",
      why: "WordPress holds 9 membership leads to date, 1 of them this week, but the Meta leads ad records 0 results against its $339.92 spend. The leads are real and landing in WordPress; the ad just cannot see them.",
      owner: "Web — Figment",
      measure: "New leads attributed to the ad in Meta.",
    },
    {
      action: "Keep featuring the team through the month",
      why: "The oral-health reel reached 295 accounts, and the Dr. Tamay reel remains the strongest Smile Pass piece.",
      owner: "Social — Figment",
      measure: "Reach on the next staff reel, against 295.",
    },
  ],
  /* ---------------------------------------------------------------- DETAIL */
  detail: {
    subtitles: {
      instagram: "October 26 – November 1 · account totals from Metricool",
      search: "October 26 – November 1 · Google Search Console",
      website: "October 26 – November 1 · Google Analytics",
      links: "October 26 – November 1 · Short.io",
    },
    instagram: {
      kv: [
        { k: "Views", v: "2,584" },
        { k: "Reach per day", v: "113" },
        { k: "Accounts engaged", v: "47" },
        { k: "Followers", v: "792" },
        { k: "Interactions", v: "42" },
      ],
      postsChart: {
        title: "The feed pieces from this week",
        note: "Ranked by views. Engagement is interactions divided by reach.",
      },
      posts: [
        { t: "Your oral health affects more than just your teeth and gums", f: "Reel", d: "Oct 29", v: "496", r: "295", i: "28", e: "9.5%" },
        { t: "This Veterans Day, we want to give back to someone who has given so much", f: "Post", d: "Oct 29", v: "395", r: "226", i: "7", e: "3.1%" },
        { t: "Pumpkin spice latte season is officially here, and your smile can enjoy it too", f: "Post", d: "Oct 28", v: "183", r: "82", i: "4", e: "4.9%" },
        { t: "Which Halloween candy is better for your teeth", f: "Post", d: "Oct 30", v: "148", r: "61", i: "3", e: "4.9%" },
      ],
      interactionsChart: {
        title: "The reel drew most of the interactions",
        note: "42 interactions: 28 on the reel and 14 on the posts.",
      },
      interactions: [
        { label: "Feed posts", value: 14 },
        { label: "Reels", value: 28 },
      ],
      viewsChart: {
        title: "Views by format",
        note: "From Metricool’s format summaries. Stories are shown as impressions. These are not summed; the account total of 2,584 is measured separately.",
      },
      viewsByFormat: [
        { label: "Feed posts", value: 726 },
        { label: "Reels", value: 496 },
        { label: "Stories", value: 197 },
      ],
      storiesTitle: "Stories",
      stories:
        "Stories drew 197 impressions, with an average reach of 32.",
      note:
        "Account totals are Metricool’s account-level figures, both weeks read November 2; last week now reads 2,962 views and 138 reach per day, against 2,960 and 138 on October 26. Per-piece figures are each read the day after their week closed. Engagement rate is interactions on posts and reels divided by reach: 42 against 791 this week and 63 against 966 the week before. 6 Stories this week. Metricool shows 11 followers acquired and 3 lost. No paid advertising reached Instagram in either week.",
      clientNote:
        "Account totals come from Metricool’s account-level figures rather than a sum of individual posts. Figures for individual posts keep growing after a week ends, so each week is read the day after it closes. Engagement rate is interactions divided by reach.",
    },
    search: {
      kv: [
        { k: "Clicks", v: "41" },
        { k: "Impressions", v: "1,496" },
        { k: "Click rate", v: "2.74%" },
      ],
      impressionsChart: {
        title: "Impressions per day",
        note: "Daily appearances in Google results across the week.",
      },
      impressionsSeries: [
        { d: "Oct 26", v: 298 }, { d: "Oct 27", v: 349 }, { d: "Oct 28", v: 186 },
        { d: "Oct 29", v: 189 }, { d: "Oct 30", v: 168 }, { d: "Oct 31", v: 112 },
        { d: "Nov 1", v: 194 },
      ],
      pagesChart: {
        title: "The homepage collects the appearances; the doctor pages collect the clicks",
        note: "Clicks, appearances, click rate and average position by page. The doctor pages together drew 16 clicks from 319 appearances.",
      },
      pages: [
        { p: "Homepage", c: "20", i: "1,131", r: "1.77%", pos: "45.7" },
        { p: "Dr. Sherman Farahani", c: "4", i: "46", r: "8.70%", pos: "6.7" },
        { p: "Locations", c: "3", i: "94", r: "3.19%", pos: "22.8" },
        { p: "Dr. Michael Chesner", c: "3", i: "72", r: "4.17%", pos: "4.9" },
        { p: "Dr. Doris Giraldo", c: "3", i: "41", r: "7.32%", pos: "2.3" },
        { p: "Dr. Dana Kapparova", c: "2", i: "53", r: "3.77%", pos: "5.1" },
        { p: "Dr. Maria Tamay", c: "2", i: "53", r: "3.77%", pos: "5.3" },
        { p: "Dr. Ben Elchami", c: "2", i: "47", r: "4.26%", pos: "6.6" },
        { p: "Meet Our Dentists", c: "1", i: "171", r: "0.58%", pos: "35.1" },
        { p: "Services", c: "1", i: "62", r: "1.61%", pos: "7.7" },
      ],
      devicesChart: {
        title: "Mobile clicks through at a higher rate than desktop",
        note: "Clicks, appearances, click rate and average position by device. Mobile 3.38% against 2.43%.",
      },
      devices: [
        { d: "Desktop", c: "24", i: "986", r: "2.43%", pos: "50.6" },
        { d: "Mobile", c: "17", i: "503", r: "3.38%", pos: "33.8" },
        { d: "Tablet", c: "0", i: "7", r: "0%", pos: "63.6" },
      ],
      queriesChart: {
        title: "Searches that name the practice bring the clicks",
        note: "From the query export, which holds 12 of the 41 clicks and 1,163 of the appearances. Useful for share; totals come from the daily export.",
      },
      queries: [
        { q: "nyc dental smiles", c: "5", i: "9", r: "55.56%", pos: "1.3" },
        { q: "nyc dental smiles lenox hill", c: "2", i: "7", r: "28.57%", pos: "1.0" },
        { q: "dr giraldo dentist", c: "1", i: "3", r: "33.33%", pos: "1.0" },
        { q: "nyc smiles", c: "1", i: "3", r: "33.33%", pos: "3.3" },
        { q: "dentists near me", c: "1", i: "3", r: "33.33%", pos: "4.7" },
        { q: "dr chesner", c: "1", i: "3", r: "33.33%", pos: "5.0" },
      ],
      brandSplit: {
        title: "Named and general searches",
        note: "Matched on the practice name and doctor surnames, the same rule as the prior weeks. These are shares within the query sample; totals come from the daily export.",
        rows: [
          { k: "Names the practice or a doctor", c: "11", i: "91", r: "12.09%" },
          { k: "General searches", c: "1", i: "1,072", r: "0.09%" },
        ],
      },
      note:
        "Totals come from Search Console’s daily export for October 26 to November 1, read November 2. October 19 – 25 was re-read November 2 and is unchanged at 43 clicks on 1,699 appearances. Average position is weighted by appearances, 45.0 this week against 49.2. Doctor-page click rate counts every doctor page address in both weeks.",
    },
    website: {
      kv: [
        { k: "Sessions", v: "64" },
        { k: "Desktop", v: "66%" },
        { k: "Mobile", v: "34%" },
      ],
      sourcesChart: {
        title: "Where visitors came from",
        note: "Sessions by source. Direct means someone typed the address or used a saved link. Source not recorded means the site did not record where the visit came from.",
      },
      sources: [
        { label: "Source not recorded", value: 28 },
        { label: "Google — organic", value: 16 },
        { label: "Direct", value: 13 },
        { label: "Bing — organic", value: 3 },
        { label: "Constant Contact", value: 1 },
      ],
      deviceChart: {
        title: "Desktop leads",
        note: "Share of visitors by device.",
      },
      deviceSplit: [
        { label: "Desktop", pct: 66 },
        { label: "Mobile", pct: 34 },
      ] as { label: string; pct: number }[],
      landingChart: {
        title: "Where visitors landed",
        note: "Views by landing page.",
      },
      landing: [
        { label: "Meet Our Dentists", value: 41 },
        { label: "Homepage", value: 12 },
        { label: "Comprehensive Care", value: 7 },
        { label: "Locations", value: 7 },
        { label: "Orthodontics", value: 4 },
      ] as { label: string; value: number }[],
      note:
        "We are confirming the site’s visit tracking after the October 19 fix, so these figures are shown without a comparison. The week recorded 2 new visitors. 3 further sessions came from referrals.",
    },
    links: {
      kv: [
        { k: "Booking · all locations", v: "45" },
        { k: "Location pages", v: "6" },
        { k: "Homepage and website", v: "157" },
        { k: "Total", v: "208" },
      ],
      destsChart: {
        title: "Clicks by link",
        note: "The practice’s short links with clicks this week.",
      },
      dests: [
        { label: "Main website", value: 152 },
        { label: "Murray Hill — booking", value: 13 },
        { label: "Lenox Hill — booking", value: 12 },
        { label: "All locations — booking", value: 11 },
        { label: "Plaza District — booking", value: 8 },
        { label: "Homepage", value: 5 },
        { label: "Lenox Hill — information", value: 5 },
        { label: "Plaza District — information", value: 1 },
        { label: "Upper East Side — booking", value: 1 },
      ],
      note:
        "208 clicks this week against 74. The website and homepage links drew 157 against 32, booking links 45 against 28, and location information links 6 against 13. The website link drew 152. The Smile Pass link is reported in the Smile Pass section.",
    },
    email: {
      window: "October 28, 2026 · 2 campaigns",
      note: "The End of Year Benefits email reached 3,537 inboxes and drew 27 clicks. A small Oral Genome follow-up went out the same day. Rates are calculated on delivered emails.",
      table: {
        head: ["Campaign", "Sends", "Opens", "Clicks"],
        rows: [
          ["End of Year Benefits | NYCDS", "3,778", "1,818 (51.4%)", "27 (0.8%)"],
          ["Oral Genome Offer Email #2", "38", "16 (44.4%)", "1 (2.8%)"],
        ],
      },
      tableInternal: {
        head: ["Campaign", "Sends", "Opens", "Clicks", "Bounces"],
        rows: [
          ["End of Year Benefits | NYCDS", "3,778", "1,818 (51.4%)", "27 (0.8%)", "241 (6.4%)"],
          ["Oral Genome Offer Email #2", "38", "16 (44.4%)", "1 (2.8%)", "2 (5.3%)"],
        ],
      },
      tableChart: {
        title: "The campaigns sent this week",
        note: "From each campaign’s Reporting page. Open and click rates are on delivered emails, as Constant Contact reports them.",
      },
    } as null | {
      window: string;
      note: string;
      table: { head: string[]; rows: string[][] };
      tableInternal: { head: string[]; rows: string[][] };
      tableChart: { title: string; note: string };
    },
    facebook: {
      subtitle: "October 26 – November 1 · account totals from Metricool",
      kv: [
        { k: "Followers", v: "982" },
        { k: "Views", v: "82" },
        { k: "Page visits", v: "8" },
      ],
      note:
        "Page visits 8 against 10. Views 82 against 202, restated from 201 in last week’s report. Followers 982 against 981. At this scale the figures move on single pieces of content and are reported for completeness.",
    },
    method: [
      { q: "What the report covers", a: "October 26 to November 1, 2026, 7 full days, Monday to Sunday, compared with October 19 to 25. Both weeks are the same length, so every comparison is direct." },
      { q: "Where the Instagram totals come from", a: "Metricool’s account-level figures. Per-piece figures are used only to rank content against content." },
      { q: "How engagement rate is calculated", a: "Interactions on posts and reels divided by reach, meaning the share of people who saw something and engaged with it." },
      { q: "Why each week is read the day after it closes", a: "Figures for individual posts keep growing after a week ends. Reading each week the day after it closes means both weeks have had the same time to collect views." },
      { q: "Which reading the previous week uses", a: "Metricool account totals for October 19 to 25 were read again on November 2, so both weeks are read the same day. Search figures for that week were re-pulled the same day; short link figures are last week’s readings.", internalOnly: true },
      { q: "Why the search figures may change", a: "Google keeps processing search data for several days, so the most recent days of any week are the least settled." },
      { q: "How the doctor page click rate is calculated", a: "Every doctor page address, counted the same way in both weeks: 16 clicks from 319 appearances this week, 15 from 312 the week before." },
      { q: "How searches by name are counted", a: "Searches that include the practice name or a doctor’s surname, matched the same way in both weeks, within Google’s query sample." },
      { q: "How short link clicks are counted", a: "All clicks on the practice’s named short links, counted the same way in both weeks. The Smile Pass link is reported in the Smile Pass section." },
      { q: "Why website figures are not compared this week", a: "The way the site counts visits changed at the end of September. A fix was made on October 19 and is being confirmed; this week still recorded 2 new visitors. Until it is confirmed, website figures are shown without a week-to-week comparison, and the daily chart shows clicks from Google instead." },
      { q: "Where the Social section is", a: "The social lead’s write-up arrives after first review. It is checked figure by figure against the Metricool export before it is added.", internalOnly: true },
      { q: "What is not in this report", a: "Story interactions are not in the Instagram export. The Smile Pass section is reported since launch, separate from the weekly figures." },
    ] as { q: string; a: string; internalOnly?: boolean; clientOnly?: boolean }[],
  },
  /* ------------------------------------------------------------ SMILE PASS
     A separate overview, not part of the weekly comparison. July 1 –
     October 25, 2026. Sources: GA4 property "NYC Dental Smiles Membership",
     Meta Ads (August export; current campaigns October 1 – 26), Short.io,
     Metricool (organic only), Search Console, and the website's own
     membership lead list. */
  smilepass: {
    title: "NYC Smile Pass",
    dateLine: "July 1 – November 1, 2026, since launch",
    lede:
      "Smile Pass since July 1. 9 membership leads to date, against 8 a week ago, 1 of them new this week. October 26 – November 1 drew 266 new visitors, against 408. The October 23 Dr. Tamay reel remains the strongest Smile Pass piece. /nycsmilepass drew 441 clicks, 432 of them tagged from the ads and 409 of those from Audience Network. The 2 ads have spent $427.60, most of it on the leads ad, which records no leads in Meta though the website now holds 9.",
    ledeClient:
      "An overview of NYC Smile Pass since July 1. Membership leads reached 9, up from 8 a week ago, the site has drawn 3,141 new visitors since launch, and the Dr. Tamay reel remains the strongest Smile Pass post so far.",
    kv: [
      { k: "Membership leads", v: "9" },
      { k: "New website visitors", v: "3,141" },
      { k: "People reached by the August campaign", v: "62,053" },
      { k: "Profile visits from the engagement ad", v: "303" },
      { k: "Instagram followers", v: "44" },
      { k: "Facebook followers", v: "37" },
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
      { d: "Nov 1", v: 68 },
    ],
    dailyChart: {
      title: "Visits peaked with the August campaign and continued through the fall",
      /* indices into `daily`: 41 = Aug 11, 60 = Aug 30 */
      band: { from: 41, to: 60, label: "August campaign" },
      note:
        "New website visitors each day since July 1. 2,067 of the 3,141 arrived between August 11 and 30, during the launch campaign. October 26 – November 1 drew 266, against 408 the week before, with 77 on October 31. The same week, /nycsmilepass drew 441 clicks, 432 of them from the ads; clicks and visits are largely the same people and are not added together.",
      noteClient:
        "New website visitors each day since July 1. Most arrived during the August launch campaign, and visits have continued through the fall: 266 new visitors from October 26 to November 1.",
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
      title: "The ads running now",
      table: {
        head: ["Ad", "Goal", "Spend of budget", "People reached", "Impressions", "Link click rate", "Result"],
        rows: [
          ["New Engagement Ad", "Instagram profile visits", "$87.68 of $100", "2,338", "3,580", "6.51%", "303 profile visits, $0.29 each"],
          ["New Leads Ad", "Membership leads", "$339.92 of $400", "6,332", "9,533", "13.65%", "0 in Meta; 9 on the website"],
          ["Total", "", "$427.60 of $500", "", "13,113", "", ""],
        ],
      },
      tableClient: {
        head: ["Ad", "Goal", "People reached", "Impressions", "Link click rate", "Result"],
        rows: [
          ["Engagement ad", "Visits to the Smile Pass Instagram profile", "2,338", "3,580", "6.51%", "303 profile visits, 29 cents each"],
          ["Leads ad", "Membership leads", "6,332", "9,533", "13.65%", "9 membership leads to date on the website"],
        ],
      },
      note:
        "Meta’s campaign export for October 3 – November 1. Both ads are active and end November 9: $427.60 of $500 spent. 79% of the spend, $339.92, went to the leads ad, which optimizes for membership leads; Meta records none against it, though the website’s own list holds 9 leads, 1 of them this week. Meta ranks the leads ad’s quality in the bottom 20%, and its link click rate was 13.65%, down from 15.14%. The engagement ad has drawn 303 profile visits at 29 cents each, up from 245. This week the ads link through /nycsmilepass: 432 of its 441 clicks carry the ads’ campaign tags, 409 from Audience Network, Meta’s placements in other apps and sites. People reached is not added across the 2 ads, since the same person can see both.",
      noteClient:
        "2 ads are running, with figures from October 3 to November 1. The engagement ad brings people to the Smile Pass Instagram profile. The leads ad, which carries most of the budget, is set up to find people likely to become members; the website has recorded 9 membership leads to date. People reached is counted per ad, since the same person can see both.",
    },
    sources: {
      title: "Where visitors came from, by source",
      table: {
        head: ["Source", "Visits", "Share"],
        rows: [
          ["Instagram ads", "1,682", "49.8%"],
          ["Audience Network ads", "765", "22.7%"],
          ["Facebook ads", "484", "14.3%"],
          ["Direct", "249", "7.4%"],
          ["Google search", "103", "3.1%"],
          ["Instagram and Facebook, unpaid", "53", "1.6%"],
        ],
      },
      note:
        "July 1 – November 1, sessions by source from GA4, 3,371 in all. Paid Instagram brought 1,682, half the total; Audience Network 765 and Facebook ads 484. Audience Network has grown from 521 a week ago and is now the 2nd-largest source. The engagement-by-source export was not included this week, so time on site and engaged share are not shown. Threads ads (14), Bing (7), the unassigned group (11) and Yahoo (2) are not shown.",
      noteClient:
        "Sessions by source since July 1. Most visits came through the paid campaigns on Instagram, Audience Network and Facebook. Direct visits and Google search follow. Sources with fewer than 50 visits are not shown.",
    },
    social: {
      title: "Smile Pass on social",
      table: {
        head: ["", "Instagram", "Facebook"],
        rows: [
          ["Followers", "44", "37"],
          ["Average reach per post", "52", "13"],
          ["Reels", "3,517 views · 254 average reach", "1,057 video views"],
          ["Strongest piece", "Oct 23 reel · 2,597 views · 1,320 reach", "—"],
        ],
      },
      note:
        "Unpaid content only, from July 10, from Metricool. Account-level reach and views include ad delivery and are not used. Followers 44 and 37, against 39 and 35 a week ago; average reach per post 52 and 13. The strongest piece remains the October 23 reel, “No dental insurance? Dr. Tamay has some good news for you.”: 2,597 views, 1,320 reach and 150 interactions. Organic reel totals are carried from the October 25 reading pending this week’s Smile Pass export.",
      noteClient:
        "Unpaid posts only, from July 10. Instagram has grown to 44 followers and Facebook to 37. The strongest post remains the October 23 reel with Dr. Tamay, with 2,597 views and 150 interactions.",
    },
    search: {
      title: "Search",
      kv: [
        { k: "Clicks from Google", v: "35" },
        { k: "Appearances in Google", v: "392" },
        { k: "Most common search", v: "“nyc dental smiles”" },
      ],
      note:
        "July 1 – November 1, from the daily export. The query list shows 130 appearances for “nyc dental smiles” and 15 for “dental membership plan nyc”. The join page drew 1 click from 37 appearances. October 26 – November 1 drew 3 clicks from 47 appearances.",
      noteClient:
        "Search presence is still early for a new site. Most searches that showed Smile Pass were for the NYC Dental Smiles name, and the site has drawn 35 clicks from Google since July.",
    },
    findings: {
      title: "What we learned",
      items: [
        {
          t: "Membership leads rose to 9",
          b: "9 membership leads to date, from the website’s lead list after removing 1 test entry and 2 repeat submissions, against 8 a week ago, with 1 new this week. The Meta leads ad spent $339.92 at a 13.65% click rate but records no leads, and Meta ranks its quality in the bottom 20%; GA4 has no lead event either, so neither can yet link a lead to an ad.",
          client: { t: "Membership leads reached 9", b: "Membership leads rose to 9 from 8 a week ago. Connecting leads to Meta and Google Analytics is the next step, so every future report can show where they come from." },
        },
        {
          t: "The engagement ad keeps building the Instagram audience",
          b: "303 profile visits for $87.68 to November 1, 29 cents each, up from 245. Smile Pass Instagram followers reached 44, against 39 a week ago, and Facebook 37, against 35.",
          client: { t: "Instagram keeps growing", b: "The engagement ad has drawn 303 visits to the Smile Pass Instagram profile, up from 245, and the account has grown to 44 followers from 39." },
        },
        {
          t: "Audience Network drives most of the ad traffic",
          b: "409 of the 432 ad-tagged clicks on /nycsmilepass came through Audience Network, Meta’s placements in other apps and sites. It is now the 2nd-largest source of visits since launch, 765 against 521 a week ago.",
          client: { t: "The ads reach beyond Instagram and Facebook", b: "Most of the ad clicks came through Audience Network, Meta’s placements across other apps and sites, now the 2nd-largest source of visits to the site." },
        },
        {
          t: "A Dr. Tamay reel remains the strongest Smile Pass piece",
          b: "The October 23 reel: 2,597 views, 1,320 accounts reached, 150 interactions and 14 shares. Nothing this week surpassed it. Smile Pass followers grew to 44 on Instagram and 37 on Facebook.",
          client: { t: "A reel with Dr. Tamay is still the top post", b: "The October 23 reel with Dr. Tamay, with 1,320 people reached and 150 interactions, remains the strongest Smile Pass post, and the accounts grew to 44 followers on Instagram and 37 on Facebook." },
        },
        {
          t: "Visits since launch reached 3,141",
          b: "266 new visitors from October 26 to November 1, against 408 the week before. Most of the 3,141 since July arrived during the August campaign; October has added steadily.",
          client: { t: "Visits keep building", b: "The site has drawn 3,141 new visitors since July, with 266 from October 26 to November 1. Most arrived during the August launch campaign." },
        },
      ],
    },
    next: {
      title: "What we’d do next",
      items: [
        { t: "Wire membership-lead capture back to Meta and Google Analytics", b: "The website holds 9 leads the leads ad cannot see. Recording each lead lets Meta find more people like them, and lets every report measure leads directly." },
        { t: "Make more doctor-led reels", b: "The Dr. Tamay reel drew the most views and reach of any Smile Pass post. More reels with the doctors will show whether the format repeats." },
        { t: "Compare leads by ad placement", b: "Audience Network now brings most of the ad clicks. Once leads are recorded, comparing them by placement will show where the budget works hardest." },
        { t: "Keep sharing Smile Pass from NYC Dental Smiles", b: "NYC Dental Smiles has 792 Instagram followers; Smile Pass has 44." },
      ],
    },
    method:
      "New visitor totals come from GA4’s daily series, July 1 – November 1, property NYC Dental Smiles Membership; visits by source cover the same dates. August campaign figures are Meta’s August export. Current ad figures are Meta’s campaign export for October 3 – November 1. Short link clicks are Short.io, October 26 – November 1. Social figures are organic only, from July 10, from Metricool, because account totals include ad delivery. Search covers July 1 – November 1. Membership leads are the website’s own lead list, with repeat and test entries removed.",
    methodClient:
      "Figures cover July 1 to November 1, 2026. Website figures are from Google Analytics, ad figures from Meta for October 3 to November 1, social figures from Metricool and search figures from Google Search Console. Membership leads are from the website’s own records. Social figures cover unpaid posts only.",
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
  { k: "Instagram", v: "Oct 26 – Nov 1", p: "Account-level figures from Metricool, against Oct 19 – 25." },
  { k: "Facebook", v: "Oct 26 – Nov 1", p: "Account-level figures from Metricool." },
  { k: "Search", v: "Oct 26 – Nov 1", p: "Against Oct 19 – 25. The last days of this week may still rise." },
  { k: "Website", v: "Oct 26 – Nov 1", p: "Being confirmed after the October 19 fix. Shown without a comparison." },
  { k: "Short links", v: "Oct 26 – Nov 1", p: "All named NYC Dental Smiles links, counted the same way in both weeks." },
  { k: "Email", v: "Oct 28", p: "2 campaigns, from each campaign’s Constant Contact report." },
  { k: "Smile Pass", v: "Jul 1 – Nov 1", p: "An overview since launch, separate from the weekly figures. Current ads: Meta, Oct 3 – Nov 1." },
];
