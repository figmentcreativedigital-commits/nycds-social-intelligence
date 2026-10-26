/* ==========================================================================
   REPORT DATA  ·  NYC Dental Smiles
   --------------------------------------------------------------------------
   THIS CYCLE — a single week.
     October 19 – 25 against October 12 – 18: two 7-day windows, Monday to
     Sunday, directly comparable. Metricool account totals for both weeks
     read October 26: October 12 – 18 restated views 2,205 to 2,208, reach
     per day 89 to 90 (engagement rate 6.90% to 6.83%), Facebook views 215 to
     220. Per-piece figures keep their day-after reading (interactions 43 and
     63). Search Console and Short.io for October 12 – 18 were re-pulled
     October 26 and match last week’s report exactly.

   READ-DATE RULE — Metricool per-piece figures are each read the day after
     their week closed.

   WEBSITE (GA4) — Walter: the fix went live Monday, October 19. The
     October 19 – 25 export does not show it: 3 new visitors for the week,
     34 of 83 sessions with no source (41%), against 31 of 79 the week before.
     Client copy says website figures are being confirmed after the fix; no
     comparison; period line stays on Search Console clicks.

   SHORT LINKS — Short.io unfiltered view, Clicks by All, the named practice
     paths. /nycsmilepass (669) is reported under Smile Pass. /kuYWnG (4) is
     omitted at Walter’s direction. /thewellnessconnection (1) leads to the
     Modern Luxury feature and is counted (Walter, October 26). /* is excluded.

   SEARCH — Chart.csv for totals. Name searches use the same match as the
     last 2 weeks. Doctor pages count every /dr- address, including the
     /doctors/ addresses, which now hold 160 of 312 doctor-page appearances.

   EMAIL — no campaign data supplied for October 19 – 25. GA4 shows 5
     sessions from Constant Contact pages.

   SOCIAL — hidden until the social lead's write-up arrives after first review.

   SMILE PASS — July 1 – October 25. Daily visitors from the Looker export,
     trimmed to October 25; October 18 now reads 44 (was 40), so October
     12 – 18 restates 169 to 173. Sources: native GA4, property NYC Dental
     Smiles Membership. Membership leads 8: the website’s lead list of 11,
     less 2 repeat entries and 1 Figment test entry, per Walter (October 26);
     the earlier 1, 2 and 6 were counted the same way. Walter: call them
     membership leads. Current ads: Meta campaign export for October 1 – 26,
     which includes part of October 26; a re-export ending October 25 was
     requested. Short.io /nycsmilepass 669, 657 tagged paid, 631 Audience
     Network.

   CONTENT PUBLISHED — removed from the ledger and client-facing detail at
     Walter's request: piece counts move with collabs and Stories while grid
     posts stay steady.

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
    label: "October 19 – 25, 2026",
    length: "7 days",
    comparedWith: "the 7 days before it (October 12 – 18)",
    paidStatus:
      "No paid advertising ran for NYC Dental Smiles in either week. Both are 7 days, Monday to Sunday, so every comparison is direct.",
  },

  copy: {
    scoreboard: {
      title: "The week in numbers",
      lede: "Each measure this week and the week before, with its trend over the last 5 weeks. This week is the plum point.",
    },
    worked: {
      title: "A short reel on flossing led the week",
      galleryTitle: "The feed pieces from this week, ranked by views",
    },
    attention: {
      title: "What needs attention",
      lede: "6 things worth a second look, each labeled so it is clear which to act on and which to note.",
    },
    learned: {
      title: "What we learned",
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
    lede: "The week in 4 points.",
    head: "Instagram picked up: views 2,960 against 2,208 and reach per day 138 against 90. The flossing reel reached 600 accounts and drew 46 interactions, 13 of them shares. Booking links drew 28 clicks against 68, and clicks from Google fell to 43 from 58 while appearances rose to 1,699.",
    headClient: "Instagram reach grew this week. Views rose to 2,960 and daily reach to 138, and a short reel on flossing reached 600 people and was shared 13 times. The site appeared in Google 1,699 times, up for the 5th week running.",
    items: [
      {
        role: "The outcome",
        text: "Views 2,208 to 2,960. Daily reach 90 to 138. Interactions 43 to 63; engagement rate 6.83% to 6.52%. The flossing reel drew 901 of the 1,257 feed views and 46 of the 63 interactions. Followers 780 to 782.",
        client: {
          role: "The standout",
          text: "A short reel on flossing reached 600 people, drew 46 interactions and was shared 13 times. Instagram views rose to 2,960 from 2,208 and daily reach to 138 from 90.",
        },
      },
      {
        role: "Strongest signal",
        text: "Searches by name clicked through 11.5% against 7.5%. Google appearances 1,554 to 1,699, up for the 5th week. Website and homepage short links 6 to 32.",
        client: {
          role: "The wider picture",
          text: "The site appeared in Google 1,699 times, up from 1,554. People searching for the practice or a doctor by name clicked through 11.5% of the time, up from 7.5%, and the website short links drew 32 clicks, up from 6.",
        },
      },
      {
        role: "What softened",
        text: "Booking links 68 to 28; Upper East Side booking drew 0. Search clicks 58 to 43 and click rate 3.73% to 2.53%. Doctor-page click rate 10.6% to 4.8%. GA4 still shows the gap after the October 19 fix: 3 new visitors, 34 of 83 sessions with no source.",
        client: {
          role: "What we are monitoring",
          text: "We are confirming the website’s visit tracking after last week’s fix, so website figures are shown without a comparison this week.",
        },
      },
      {
        role: "Next action",
        text: "Confirm the GA4 tag with Aren and Johana. Check every booking link. Settle 1 address per doctor page. Make more short educational reels.",
        client: {
          role: "What we are doing next",
          text: "We will keep building on short educational reels, which reached the most people this week, and review how the booking links are shared.",
        },
      },
    ] as { role: string; text: string; client?: { role: string; text: string } }[],
  },

  /* ------------------------------------------------------------ SCOREBOARD */
  /* The ledger. `trend` runs oldest to newest and ends with this week. Each
     earlier point is that week's most recent reading, as published. Booking
     links start at September 21, when the current counting began.
     Change strings start with "+" or "−" (minus sign) to draw an arrow. */
  scoreboard: {
    weeks: ["Sep 21", "Sep 28", "Oct 5", "Oct 12", "Oct 19"],
    cols: [
      { label: "This week", sub: "Oct 19 – 25" },
      { label: "Previous week", sub: "Oct 12 – 18" },
    ],
    rows: [
      { group: "Instagram", k: "Views", note: "The flossing reel drew 901 of them.", cells: [{ v: "2,960", c: "+34%" }, { v: "2,208" }], trend: [3949, 3383, 5514, 2208, 2960], fmt: "int" },
      { group: "Instagram", k: "Reach per day", note: "Average accounts reached each day. The flossing reel reached 600 on its own.", cells: [{ v: "138", c: "+53%" }, { v: "90" }], trend: [228, 160, 244, 90, 138], fmt: "int" },
      { group: "Instagram", k: "Interactions", note: "Likes, comments, saves and shares on posts and reels. The flossing reel drew 46.", cells: [{ v: "63", c: "+20" }, { v: "43" }], trend: [127, 51, 53, 43, 63], fmt: "int" },
      { group: "Instagram", k: "Engagement rate", note: "Interactions divided by reach. Reach grew faster than interactions.", cells: [{ v: "6.52%", c: "−0.31 points" }, { v: "6.83%" }], trend: [7.96, 4.55, 3.10, 6.83, 6.52], fmt: "pct" },
      { group: "Instagram", k: "Followers", note: "Account total at the end of each week.", cells: [{ v: "782", c: "+2" }, { v: "780" }], trend: [774, 779, 779, 780, 782], fmt: "int" },
      { group: "Booking links", k: "Booking link clicks", note: "Plaza District 10, Murray Hill 8, all locations 5, Lenox Hill 5.", cells: [{ v: "28", c: "−59%" }, { v: "68" }], trend: [14, 35, 55, 68, 28], fmt: "int" },
      { group: "Google search", k: "Times the site appeared", note: "Up for the 5th week running.", cells: [{ v: "1,699", c: "+9%" }, { v: "1,554" }], trend: [1113, 1190, 1266, 1554, 1699], fmt: "int" },
      { group: "Google search", k: "Clicks", note: "Last week included Tuesday, October 14, with 25.", cells: [{ v: "43", c: "−15" }, { v: "58" }], trend: [53, 45, 47, 58, 43], fmt: "int" },
      { group: "Google search", k: "Click rate", note: "Share of appearances that led to a click.", cells: [{ v: "2.53%", c: "−1.20 points" }, { v: "3.73%" }], trend: [4.76, 3.78, 3.71, 3.73, 2.53], fmt: "pct" },
      { group: "Google search", k: "Doctor page click rate", note: "All doctor pages: 15 clicks from 312 appearances. The new /doctors/ addresses hold 160 of the appearances.", cells: [{ v: "4.8%", c: "−5.8 points" }, { v: "10.6%" }], trend: [14.6, 8.3, 10.3, 10.6, 4.8], fmt: "pct1" },
      { group: "Google search", k: "Searches by name", note: "Click rate on searches for the practice or a doctor: 15 clicks from 130 appearances.", cells: [{ v: "11.5%", c: "+4.0 points" }, { v: "7.5%" }], trend: [17.8, 10.3, 15.5, 7.5, 11.5], fmt: "pct1" },
      { group: "Facebook", k: "Page visits", note: "Reported for completeness. At this scale the figures move on single pieces of content.", cells: [{ v: "10", c: "−12" }, { v: "22" }], trend: [15, 4, 26, 22, 10], fmt: "int" },
      { group: "Facebook", k: "Views", note: "Account total, Metricool.", cells: [{ v: "201", c: "−9%" }, { v: "220" }], trend: [207, 309, 240, 220, 201], fmt: "int" },
    ] as { group: string; k: string; note?: string; cells: { v: string; c?: string }[]; trend: number[]; fmt: "int" | "pct" | "pct1" }[],
    after: "Website figures are being confirmed after last week’s tracking fix and appear in Supporting detail.",
  },

  /* -------------------------------------------- THE PERIOD LINE (signature) */
  periodLine: {
    title: "Clicks from Google held steady outside last week’s peak day",
    note:
      "Clicks from Google search each day across both weeks. Shown in place of new website visitors while the website’s visit tracking is confirmed. No paid advertising ran for NYC Dental Smiles in either week.",
    /* Search Console daily clicks, both weeks read October 26. */
    series: [
      { d: "Oct 12", v: 7 }, { d: "Oct 13", v: 5 }, { d: "Oct 14", v: 25 },
      { d: "Oct 15", v: 11 }, { d: "Oct 16", v: 5 }, { d: "Oct 17", v: 3 },
      { d: "Oct 18", v: 2 }, { d: "Oct 19", v: 11 }, { d: "Oct 20", v: 7 },
      { d: "Oct 21", v: 7 }, { d: "Oct 22", v: 7 }, { d: "Oct 23", v: 5 },
      { d: "Oct 24", v: 3 }, { d: "Oct 25", v: 3 },
    ],
    /* Index of the last day of the previous week (Oct 18). */
    splitAt: 6,
    shade: null as { through: number; label: string } | null,
    markers: [] as { i: number; label: string }[],
    /* derived: 58 ÷ 7 = 8.3; 43 ÷ 7 = 6.1 */
    bands: [
      { label: "October 12 – 18", value: "8 a day", detail: "Previous week" },
      { label: "October 19 – 25", value: "6 a day", detail: "This week" },
    ],
    read: {
      title: "Reading this fairly:",
      body: "Both weeks are 7 days with no paid advertising. Clicks went from 58 to 43. Last week included Tuesday, October 14, with 25; its other 6 days averaged 5.5 a day, against 6.1 this week. Monday, October 19 was this week’s strongest day, with 11.",
    },
  },

  /* ----------------------------------------------------------- WHAT WORKED */
  worked: {
    ledeClient: "A short reel on flossing was the week’s strongest piece, reaching 600 people, and the Modern Luxury feature drew the highest engagement.",
    /* Internal build only. */
    lede: "The flossing reel led: 901 views, 600 accounts reached and 46 interactions, 13 of them shares, against 80 reached for last week’s hygienist reel. Its engagement rate, 7.7%, was below the hygienist reel’s 13.8% on a much larger audience.",
    lead: {
      kind: "Reel",
      title: "Is flossing really that important? Short answer: yes.",
      date: "October 22",
      url: "https://www.instagram.com/reel/DeznWZnRkDx/",
      stats: [
        { v: "901", l: "views" },
        { v: "600", l: "accounts reached" },
        { v: "46", l: "interactions" },
        { v: "13", l: "shares" },
      ],
      why:
        "901 views and 600 accounts reached, with 46 interactions: 30 likes, 13 shares and 3 comments. Viewers watched an average of 9.9 seconds of the 25-second reel.",
      repeatable:
        "The Modern Luxury feature post on October 21 drew 356 views and the week’s highest engagement rate, 12.1%, with 4 comments. A collab post on Dr. El Chaar’s account, “Orthodontics has come a long way”, drew 11 likes and 3 shares.",
    },
    gallery: [
      {
        title: "Is flossing really that important? Short answer: yes.", format: "Reel", date: "Oct 22",
        url: "https://www.instagram.com/reel/DeznWZnRkDx/",
        views: "901", reach: "600", er: "7.7%", lead: true,
      },
      {
        title: "Your overall health can be influenced by more than you might think", format: "Post", date: "Oct 21",
        url: "https://www.instagram.com/p/DexNXyzRsi9/",
        views: "356", reach: "141", er: "12.1%", lead: false,
      },
    ],
    galleryNote:
      "The feed pieces from October 19 – 25, ranked by views. A collab post on Dr. El Chaar’s account reports only likes and shares to NYC Dental Smiles, 11 and 3, so it is not ranked. Engagement is interactions divided by reach.",
    channel: {
      title: "Search: more appearances, and name searches clicked through more often",
      body:
        "The site appeared in Google 1,699 times, up from 1,554, the 5th week running. Searches for the practice or a doctor by name clicked through 11.5% of the time, up from 7.5%, and “nyc dental smiles” alone drew 11 clicks.",
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
      title: "The GA4 fix does not show in this week’s data",
      body:
        "The fix went live October 19. The week still recorded 3 new visitors against 43 clicks from Google, and 34 of 83 sessions have no source (41%), against 31 of 79 the week before. Those 34 sessions show 0 engaged.",
      so:
        "Ask Aren and Johana to confirm the GA4 tag fires on every page; GA4’s Realtime report shows a visit within a minute. The client report says the fix is being confirmed.",
    },
    {
      tag: "issue",
      title: "Booking link clicks fell to 28 from 68",
      body:
        "Upper East Side booking 0 (15 last week), Murray Hill 8 (17), Plaza District 10 (12), all locations 5 (15), Lenox Hill 5 (9). Website and homepage links rose to 32 from 6, 25 of them on /nycds-website.",
      so:
        "Check that each booking link still opens the booking page and confirm where they are shared. Watch next week before reading a trend.",
    },
    {
      tag: "early",
      title: "The new doctor addresses are taking appearances with few clicks",
      body:
        "Doctor-page click rate 4.8% against 10.6%. The /doctors/ addresses hold 160 of the 312 doctor-page appearances and drew 2 clicks; the original addresses drew 13 from 152.",
      so:
        "Settle 1 address per doctor with Aren, with a redirect from the other. Carried from last week.",
    },
    {
      tag: "expected",
      title: "Search clicks came down from last week’s peak day",
      body:
        "43 clicks against 58. Last week’s Tuesday, October 14 drew 25; its other 6 days averaged 5.5 a day, against 6.1 this week. Click rate 2.53% against 3.73% as appearances rose to 1,699.",
      so:
        "No action. Read it against the doctor addresses above.",
    },
    {
      tag: "note",
      title: "The removed short link is still drawing clicks",
      body:
        "/kuYWnG drew 4 clicks to the missing page this week, after 7 last week. It is left out of the totals.",
      so:
        "Find where it is still posted and replace it with a working link.",
    },
    {
      tag: "limitation",
      title: "Constant Contact sent visits with no campaign in the report",
      body:
        "GA4 shows 5 sessions from Constant Contact pages this week. No campaign data was supplied for October 19 – 25.",
      so:
        "Confirm whether an email went out; if so, add its figures.",
    },
  ],

  /* --------------------------------------------------------- WHAT WE LEARNED */
  learned: [
    { f: "600", u: "accounts reached by the flossing reel", t: "with 46 interactions and 13 shares." },
    { f: "138", u: "Instagram reach per day", t: "up from 90. Views rose to 2,960 from 2,208." },
    { f: "12.1%", u: "engagement on the Modern Luxury feature", t: "the highest of the week, with 4 comments." },
    { f: "1,699", u: "Google appearances", t: "up for the 5th week running, from 1,113 in the week of September 21." },
    { f: "11.5%", u: "click rate on searches by name", t: "up from 7.5%. “nyc dental smiles” alone drew 11 clicks." },
    { f: "32", u: "website short link clicks", t: "up from 6." },
  ],

  /* ------------------------------------------------------------- NEXT MOVES */
  moves: [
    {
      action: "Confirm the GA4 tag fires on every page",
      why: "The October 19 fix does not show: 3 new visitors for the week and 34 of 83 sessions with no source.",
      owner: "Web — Figment with Johana and Aren",
      measure: "GA4 visits in line with Search Console clicks.",
    },
    {
      action: "Check every booking link",
      why: "Booking link clicks fell to 28 from 68, and the Upper East Side link drew none.",
      owner: "Account — Figment",
      measure: "Each link opens the booking page; booking clicks next week.",
    },
    {
      action: "Settle 1 address per doctor page",
      why: "The /doctors/ addresses hold 160 of 312 doctor-page appearances and drew 2 clicks.",
      owner: "Web — Figment with Aren",
      measure: "1 address per doctor in Search Console.",
    },
    {
      action: "Make more short educational reels",
      why: "The flossing reel reached 600 accounts and drew 13 shares.",
      owner: "Social — Figment",
      measure: "Reach on the next reel, against 600.",
    },
    {
      action: "Replace /kuYWnG where it is still posted",
      why: "It drew 4 clicks to a missing page this week.",
      owner: "Account — Figment",
      measure: "No clicks on /kuYWnG.",
    },
    {
      action: "Send the raffle contacts a booking-focused follow-up",
      why: "24 contacts joined through the raffle, and no campaign has been reported since October 8.",
      owner: "Email — Figment",
      measure: "Booking link clicks from the email.",
    },
  ],

  /* ---------------------------------------------------------------- DETAIL */
  detail: {
    subtitles: {
      instagram: "October 19 – 25 · account totals from Metricool",
      search: "October 19 – 25 · Google Search Console",
      website: "October 19 – 25 · Google Analytics",
      links: "October 19 – 25 · Short.io",
    },

    instagram: {
      kv: [
        { k: "Views", v: "2,960" },
        { k: "Reach per day", v: "138" },
        { k: "Accounts engaged", v: "65" },
        { k: "Followers", v: "782" },
        { k: "Interactions", v: "63" },
      ],
      postsChart: {
        title: "The feed pieces from this week",
        note: "Ranked by views. Engagement is interactions divided by reach.",
      },
      posts: [
        { t: "Is flossing really that important? Short answer: yes.", f: "Reel", d: "Oct 22", v: "901", r: "600", i: "46", e: "7.7%" },
        { t: "Your overall health can be influenced by more than you might think", f: "Post", d: "Oct 21", v: "356", r: "141", i: "17", e: "12.1%" },
      ],
      interactionsChart: {
        title: "The reel drew most of the interactions",
        note: "63 interactions: 46 on the reel and 17 on the post.",
      },
      interactions: [
        { label: "Feed posts", value: 17 },
        { label: "Reels", value: 46 },
      ],
      viewsChart: {
        title: "Views by format",
        note: "From Metricool’s format summaries. Stories are shown as impressions. These are not summed; the account total of 2,960 is measured separately.",
      },
      viewsByFormat: [
        { label: "Reels", value: 901 },
        { label: "Feed posts", value: 356 },
        { label: "Stories", value: 118 },
      ],
      storiesTitle: "Stories",
      stories:
        "Stories drew 118 impressions, with an average reach of 29.",
      note:
        "Account totals are Metricool’s account-level figures, both weeks read October 26; last week now reads 2,208 views and 90 reach per day, against 2,205 and 89 on October 19. Per-piece figures are each read the day after their week closed. Engagement rate is interactions on posts and reels divided by reach: 63 against 966 this week and 43 against 630 the week before, restated from 623. 4 Stories this week. Metricool shows 4 followers acquired and 2 lost. No paid advertising ran in either week.",
      clientNote:
        "Account totals come from Metricool’s account-level figures rather than a sum of individual posts. Figures for individual posts keep growing after a week ends, so each week is read the day after it closes. Engagement rate is interactions divided by reach. No paid advertising ran in either week.",
    },

    search: {
      kv: [
        { k: "Clicks", v: "43" },
        { k: "Impressions", v: "1,699" },
        { k: "Click rate", v: "2.53%" },
      ],
      impressionsChart: {
        title: "Impressions per day",
        note: "Daily appearances in Google results across the week.",
      },
      impressionsSeries: [
        { d: "Oct 19", v: 332 }, { d: "Oct 20", v: 267 }, { d: "Oct 21", v: 230 },
        { d: "Oct 22", v: 230 }, { d: "Oct 23", v: 235 }, { d: "Oct 24", v: 162 },
        { d: "Oct 25", v: 243 },
      ],
      pagesChart: {
        title: "The homepage collects the appearances; the doctor pages collect the clicks",
        note: "Clicks, appearances, click rate and average position by page. The doctor pages together drew 15 clicks from 312 appearances; the new /doctors/ addresses hold 160 of those appearances, with 2 clicks.",
      },
      pages: [
        { p: "Homepage", c: "18", i: "1,221", r: "1.47%", pos: "50.1" },
        { p: "Meet Our Dentists", c: "5", i: "231", r: "2.16%", pos: "35.9" },
        { p: "Dr. James Eisdorfer", c: "5", i: "31", r: "16.13%", pos: "4.1" },
        { p: "Dr. Michael Chesner", c: "4", i: "25", r: "16.00%", pos: "4.0" },
        { p: "Locations", c: "3", i: "110", r: "2.73%", pos: "31.2" },
        { p: "Dr. Maria Tamay", c: "3", i: "40", r: "7.50%", pos: "3.0" },
        { p: "About", c: "2", i: "82", r: "2.44%", pos: "33.7" },
        { p: "Dr. Michael Chesner, new address", c: "1", i: "54", r: "1.85%", pos: "6.7" },
        { p: "Dr. Doris Giraldo", c: "1", i: "40", r: "2.50%", pos: "3.2" },
        { p: "Dr. Sherman Farahani, new address", c: "1", i: "35", r: "2.86%", pos: "6.6" },
      ],
      devicesChart: {
        title: "Mobile clicks through at more than 3 times the desktop rate",
        note: "Clicks, appearances, click rate and average position by device. Mobile 5.35% against 4.30%; desktop 1.59% against 3.55%.",
      },
      devices: [
        { d: "Mobile", c: "23", i: "430", r: "5.35%", pos: "28.2" },
        { d: "Desktop", c: "20", i: "1,260", r: "1.59%", pos: "56.4" },
        { d: "Tablet", c: "0", i: "9", r: "0%", pos: "49.2" },
      ],
      queriesChart: {
        title: "Searches that name the practice bring the clicks",
        note: "From the query export, which holds 16 of the 43 clicks and 1,312 of the appearances. Useful for share; totals come from the daily export.",
      },
      queries: [
        { q: "nyc dental smiles", c: "11", i: "16", r: "68.75%", pos: "1.4" },
        { q: "dentist 10022", c: "1", i: "7", r: "14.29%", pos: "77.4" },
        { q: "doris giraldo", c: "1", i: "6", r: "16.67%", pos: "2.5" },
        { q: "dr giraldo dentist", c: "1", i: "5", r: "20.00%", pos: "1.8" },
        { q: "dr michael chesner", c: "1", i: "4", r: "25.00%", pos: "5.0" },
        { q: "edgar el chaar", c: "1", i: "1", r: "100.00%", pos: "23.0" },
      ],
      brandSplit: {
        title: "Named and general searches",
        note: "Matched on the practice name and doctor surnames, the same rule as the last 2 weeks. These are shares within the query sample; totals come from the daily export.",
        rows: [
          { k: "Names the practice or a doctor", c: "15", i: "130", r: "11.54%" },
          { k: "General searches", c: "1", i: "1,182", r: "0.08%" },
        ],
      },
      note:
        "Totals come from Search Console’s daily export for October 19 – 25, read October 26. October 12 – 18 was re-read October 26 and is unchanged at 58 clicks on 1,554 appearances. Saturday and Sunday read 3 clicks each and may rise. Average position is weighted by appearances, 49.2 this week against 49.1. Doctor-page click rate counts every doctor page address in both weeks.",
    },

    website: {
      kv: [
        { k: "Sessions", v: "83" },
        { k: "Desktop", v: "70%" },
        { k: "Mobile", v: "30%" },
      ],
      sourcesChart: {
        title: "Where visitors came from",
        note: "Sessions by source. Direct means someone typed the address or used a saved link. Source not recorded means the site did not record where the visit came from.",
      },
      sources: [
        { label: "Source not recorded", value: 34 },
        { label: "Google — organic", value: 25 },
        { label: "Direct", value: 12 },
        { label: "Constant Contact", value: 5 },
        { label: "Bing — organic", value: 3 },
      ],
      deviceChart: {
        title: "Desktop leads",
        note: "Share of visitors by device.",
      },
      deviceSplit: [
        { label: "Desktop", pct: 70 },
        { label: "Mobile", pct: 30 },
      ] as { label: string; pct: number }[],
      landingChart: {
        title: "Where visitors landed",
        note: "Views by landing page.",
      },
      landing: [
        { label: "Homepage", value: 60 },
        { label: "Meet Our Dentists", value: 24 },
        { label: "Locations", value: 11 },
        { label: "Restorative Dentistry", value: 7 },
        { label: "Services", value: 7 },
      ] as { label: string; value: number }[],
      note:
        "We are confirming the site’s visit tracking after last week’s fix, so these figures are shown without a comparison. 4 further sessions came from other referrals. No paid advertising ran for NYC Dental Smiles in either week.",
    },

    links: {
      kv: [
        { k: "Booking · all locations", v: "28" },
        { k: "Location pages", v: "13" },
        { k: "Homepage and website", v: "32" },
        { k: "Total", v: "74" },
      ],
      destsChart: {
        title: "Clicks by link",
        note: "The practice’s short links with clicks this week, including the new link to the Modern Luxury feature.",
      },
      dests: [
        { label: "Main website", value: 25 },
        { label: "Plaza District — booking", value: 10 },
        { label: "Murray Hill — booking", value: 8 },
        { label: "Homepage", value: 7 },
        { label: "Plaza District — information", value: 6 },
        { label: "All locations — booking", value: 5 },
        { label: "Lenox Hill — booking", value: 5 },
        { label: "Upper East Side — information", value: 5 },
        { label: "Murray Hill — information", value: 1 },
        { label: "Lenox Hill — information", value: 1 },
        { label: "Modern Luxury feature", value: 1 },
      ],
      note:
        "74 clicks this week against 92. The homepage and website links drew 32 against 6, booking links 28 against 68, and location information links 13 against 18. The Smile Pass link is reported in the Smile Pass section.",
    },

    email: null as null | {
      window: string;
      note: string;
      table: { head: string[]; rows: string[][] };
      tableInternal: { head: string[]; rows: string[][] };
      tableChart: { title: string; note: string };
    },

    facebook: {
      subtitle: "October 19 – 25 · account totals from Metricool",
      kv: [
        { k: "Followers", v: "981" },
        { k: "Views", v: "201" },
        { k: "Page visits", v: "10" },
      ],
      note:
        "Page visits 10 against 22. Views 201 against 220, restated from 215 in last week’s report. Followers 981 against 983. At this scale the figures move on single pieces of content and are reported for completeness.",
    },

    method: [
      { q: "What the report covers", a: "October 19 to 25, 2026, 7 full days, Monday to Sunday, compared with October 12 to 18. Both weeks are the same length, so every comparison is direct." },
      { q: "Where the Instagram totals come from", a: "Metricool’s account-level figures. Per-piece figures are used only to rank content against content." },
      { q: "How engagement rate is calculated", a: "Interactions on posts and reels divided by reach, meaning the share of people who saw something and engaged with it." },
      { q: "Why each week is read the day after it closes", a: "Figures for individual posts keep growing after a week ends. Reading each week the day after it closes means both weeks have had the same time to collect views." },
      { q: "Which reading the previous week uses", a: "Metricool account totals for October 12 to 18 were read again on October 26, so both weeks are read the same day. Search and short link figures for that week were re-pulled the same day and are unchanged.", internalOnly: true },
      { q: "Why the search figures may change", a: "Google keeps processing search data for several days, so the most recent days of any week are the least settled." },
      { q: "How the doctor page click rate is calculated", a: "Every doctor page address, counted the same way in both weeks: 15 clicks from 312 appearances this week, 22 from 208 the week before." },
      { q: "How searches by name are counted", a: "Searches that include the practice name or a doctor’s surname, matched the same way in both weeks, within Google’s query sample." },
      { q: "How short link clicks are counted", a: "All clicks on the practice’s named short links, counted the same way in both weeks. The Smile Pass link is reported in the Smile Pass section." },
      { q: "Why website figures are not compared this week", a: "Updates were made to the website at the end of September, and the way it counts visits changed from September 29. A fix was made on October 19 and is being confirmed. Until then, website figures are shown without a week-to-week comparison, and the daily chart shows clicks from Google instead." },
      { q: "Where the Social section is", a: "The social lead’s write-up arrives after first review. It is checked figure by figure against the Metricool export before it is added.", internalOnly: true },
      { q: "What is not in this report", a: "No paid advertising ran for NYC Dental Smiles in either week. Story interactions are not in the Instagram export." },
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
    dateLine: "July 1 – October 25, 2026, since launch",
    lede:
      "Smile Pass since July 1. 8 membership leads to date, against 6 a week ago. October 19 – 25 drew 408 new visitors, against 173. A Dr. Tamay reel on October 23 reached 1,320 accounts, the strongest Smile Pass piece so far. /nycsmilepass drew 669 clicks, 657 of them tagged from the ads and 631 of those from Audience Network. The 2 campaigns have spent $319.11, 79% on the leads campaign, which still records no leads in Meta.",
    ledeClient:
      "An overview of NYC Smile Pass since July 1. Membership leads reached 8, up from 6 a week ago, the site drew 408 new visitors from October 19 to 25, and a reel with Dr. Tamay became the strongest Smile Pass post so far.",
    kv: [
      { k: "Membership leads", v: "8" },
      { k: "New website visitors", v: "2,875" },
      { k: "People reached by the August campaign", v: "62,053" },
      { k: "Profile visits from the engagement ad", v: "245" },
      { k: "Instagram followers", v: "39" },
      { k: "Facebook followers", v: "35" },
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
    ],
    dailyChart: {
      title: "Visits peaked with the August campaign and are rising again in October",
      /* indices into `daily`: 41 = Aug 11, 60 = Aug 30 */
      band: { from: 41, to: 60, label: "August campaign" },
      note:
        "New website visitors each day since July 1. 2,067 of the 2,875 arrived between August 11 and 30, during the launch campaign. October 19 – 25 drew 408, against 173 the week before (restated from 169), with 118 on October 21. The same week, /nycsmilepass drew 669 clicks, 657 of them from the ads; clicks and visits are largely the same people and are not added together.",
      noteClient:
        "New website visitors each day since July 1. Most arrived during the August launch campaign. Visits kept rising in October: 408 new visitors from October 19 to 25, against 173 the week before.",
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
        head: ["Campaign", "Goal", "Spend of budget", "People reached", "Impressions", "Link click rate", "Result"],
        rows: [
          ["Reel Engagement/Follows Fall 2026", "Instagram profile visits", "$67.60 of $100", "1,775", "2,653", "6.82%", "245 profile visits, $0.28 each"],
          ["Reel Leads Fall 2026", "Membership leads", "$251.51 of $400", "3,593", "6,144", "15.14%", "None recorded in Meta yet"],
          ["Total", "", "$319.11 of $500", "", "8,797", "", ""],
        ],
      },
      tableClient: {
        head: ["Ad", "Goal", "People reached", "Impressions", "Link click rate", "Result"],
        rows: [
          ["Engagement ad", "Visits to the Smile Pass Instagram profile", "1,775", "2,653", "6.82%", "245 profile visits, 28 cents each"],
          ["Leads ad", "Membership leads", "3,593", "6,144", "15.14%", "Reported once Meta records membership leads"],
        ],
      },
      note:
        "Meta’s campaign export for October 1 – 26, which includes part of Monday, October 26; a re-export ending October 25 was requested. Both campaigns are active and end November 9: $319.11 of $500 spent. 79% of the spend, $251.51, went to the leads campaign, which optimizes for membership leads and still records none; the website has 8. Its link click rate rose to 15.14%. The engagement campaign has drawn 245 profile visits, up from 156 to October 19. This week the ads link through /nycsmilepass: 657 of its 669 clicks carry the ads’ campaign tags, 631 from Audience Network, Meta’s placements in other apps and sites. People reached is not added across the 2 campaigns, since the same person can see both.",
      noteClient:
        "2 ads are running, with figures through October 26. The engagement ad brings people to the Smile Pass Instagram profile. The leads ad, which carries most of the budget, is set up to find people likely to become members. People reached is counted per ad, since the same person can see both.",
    },
    sources: {
      title: "How visitors engaged, by source",
      table: {
        head: ["Source", "Visits", "Share that engaged", "Average time on site"],
        rows: [
          ["Instagram ads", "1,671", "4.1%", "1.0 seconds"],
          ["Audience Network ads", "521", "27.1%", "2.5 seconds"],
          ["Facebook ads", "481", "15.2%", "10.2 seconds"],
          ["Direct", "241", "24.9%", "21.3 seconds"],
          ["Google search", "97", "41.2%", "18.5 seconds"],
          ["Instagram and Facebook, unpaid", "48", "45.8%", "10.4 seconds"],
        ],
      },
      note:
        "July 1 – October 25. Audience Network visits rose to 521 from 134 a week ago and are now the 2nd-largest source; they averaged 2.5 seconds. Instagram ad visitors, 1,671 of the 3,086 visits, engaged 4.1% of the time. Facebook ad visitors engaged more than 3 times as often. Unassigned (11), Threads ads (9), Bing (6) and Yahoo (1) are not shown.",
      noteClient:
        "A visit counts as engaged if it lasted at least 10 seconds or included a second page. Visitors from Google, direct visits and unpaid social spent the most time on the site. Sources with fewer than 20 visits are not shown.",
    },
    social: {
      title: "Smile Pass on social",
      table: {
        head: ["", "Instagram", "Facebook"],
        rows: [
          ["Followers", "39", "35"],
          ["Average reach per post", "51", "13"],
          ["Reels", "3,517 views · 254 average reach", "1,057 video views"],
          ["Strongest piece", "Oct 23 reel · 2,597 views · 1,320 reach", "—"],
        ],
      },
      note:
        "Unpaid content only, from July 10, the first piece, to October 25, from Metricool. Account-level reach and views include ad delivery and are not used: Facebook reports 29.64K views. Followers 39 and 35, against 35 and 29 a week ago. The new strongest piece is the October 23 reel, “No dental insurance? Dr. Tamay has some good news for you.”: 2,597 views, 1,320 reach, 150 interactions, 14 shares and 7 reposts. Metricool reports all of it as organic; the current campaigns are named for reels, so confirm whether this reel is also the ad creative.",
      noteClient:
        "Unpaid posts only, from July 10. Instagram has grown to 39 followers and Facebook to 35. The strongest post is now the October 23 reel with Dr. Tamay, with 2,597 views and 150 interactions.",
    },
    search: {
      title: "Search",
      kv: [
        { k: "Clicks from Google", v: "32" },
        { k: "Appearances in Google", v: "345" },
        { k: "Most common search", v: "“nyc dental smiles”" },
      ],
      note:
        "July 1 – October 25, from the daily export. The query list, which runs to October 26, shows 121 appearances for “nyc dental smiles” and 1 for “smile pass”, and covers 138 of the appearances. The join page drew 1 click. October 19 – 25 drew 6 clicks from 56 appearances.",
      noteClient:
        "Search presence is still early for a new site. Most searches that showed Smile Pass were for the NYC Dental Smiles name, and the site has drawn 32 clicks from Google since July.",
    },
    findings: {
      title: "What we learned",
      items: [
        {
          t: "Membership leads rose to 8",
          b: "8 membership leads to date, from the website’s lead list after removing 2 repeat entries and 1 test entry, against 6 a week ago. Meta’s leads campaign records none through October 26 and GA4 has no lead event, so neither can link a lead to an ad.",
          client: { t: "Membership leads reached 8", b: "Membership leads rose to 8 from 6 a week ago. Connecting leads to Meta and Google Analytics is the next step, so every future report can show where they come from." },
        },
        {
          t: "A Dr. Tamay reel became the strongest Smile Pass piece",
          b: "October 23: 2,597 views, 1,320 accounts reached, 150 interactions and 14 shares, an 11.4% engagement rate. The previous best, the September 17 reel, reached 279.",
          client: { t: "A reel with Dr. Tamay reached the most people yet", b: "The October 23 reel with Dr. Tamay reached 1,320 people and drew 150 interactions, the strongest Smile Pass post to date." },
        },
        {
          t: "Visits more than doubled again",
          b: "408 new visitors from October 19 to 25, against 173 and 74 the 2 weeks before. Audience Network brought 631 of the 657 ad-tagged clicks on /nycsmilepass; its visitors averaged 2.5 seconds on the site.",
          client: { t: "Visits keep rising", b: "408 new visitors came to the site from October 19 to 25, more than double the week before and the most since the launch campaign." },
        },
        {
          t: "The engagement ad keeps building the Instagram audience",
          b: "245 profile visits for $67.60 to October 26, 28 cents each, up from 156 to October 19. Instagram followers 39, against 35 a week ago.",
          client: { t: "Instagram keeps growing", b: "The engagement ad has drawn 245 visits to the Smile Pass Instagram profile, up from 156 a week earlier, and the account has grown to 39 followers from 35." },
        },
        {
          t: "Facebook ad visitors were more engaged than Instagram’s",
          b: "15.2% of Facebook ad visits engaged against 4.1% from Instagram, averaging 10.2 seconds against 1.0. Instagram took 78% of the Instagram and Facebook ad visits.",
          client: { t: "Facebook ad visitors stayed longer", b: "Visitors from Facebook ads were more than 3 times as likely to engage as visitors from Instagram ads, and stayed longer on the site." },
        },
      ],
    },
    next: {
      title: "What we’d do next",
      items: [
        { t: "Record each membership lead in Meta and Google Analytics", b: "The leads ad is set up to find people likely to become members. Recording each lead lets Meta find more people like them, and lets every report measure leads directly." },
        { t: "Make more doctor-led reels", b: "The Dr. Tamay reel drew the most views and reach of any Smile Pass post. More reels with the doctors will show whether the format repeats." },
        { t: "Compare leads by ad placement", b: "Audience Network now brings most of the ad clicks. Once leads are recorded, comparing them by placement will show where the budget works hardest." },
        { t: "Keep sharing Smile Pass from NYC Dental Smiles", b: "NYC Dental Smiles has 782 Instagram followers; Smile Pass has 39." },
      ],
    },
    method:
      "New visitor totals come from GA4’s daily series, July 1 – October 25, property NYC Dental Smiles Membership; visits by source cover the same dates. August campaign figures are Meta’s August export. Current ad figures are Meta’s campaign export for October 1 – 26. Short link clicks are Short.io, October 19 – 25. Social figures are organic only, July 10 – October 25, because Metricool’s account totals include ad delivery. Search covers July 1 – October 25. Membership leads are the website’s own lead list, with repeat and test entries removed.",
    methodClient:
      "Figures cover July 1 to October 25, 2026. Website figures are from Google Analytics, ad figures from Meta through October 26, social figures from Metricool and search figures from Google Search Console. Membership leads are from the website’s own records. Social figures cover unpaid posts only.",
  },
};

type SectionDef = { id: string; label: string; internalOnly?: boolean; clientOnly?: boolean };

export const ALL_SECTIONS: SectionDef[] = [
  { id: "brief", label: "The brief" },
  { id: "scoreboard", label: "The week in numbers" },
  { id: "period", label: "Daily clicks" },
  { id: "worked", label: "What worked" },
  { id: "attention", label: "Needs attention", internalOnly: true },
  { id: "learned", label: "What we learned" },
  { id: "moves", label: "Next moves", internalOnly: true },
  { id: "detail", label: "Detail" },
  { id: "smilepass", label: "Smile Pass" },
];

export const NAV = ALL_SECTIONS.filter((x) => (IS_INTERNAL ? !x.clientOnly : !x.internalOnly));
const ORDINALS = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
export const numOf = (id: string) => ORDINALS[NAV.findIndex((n) => n.id === id)] ?? "";
export const has = (id: string) => NAV.some((n) => n.id === id);

export const SOURCE_WINDOWS = [
  { k: "Instagram", v: "Oct 19 – 25", p: "Account-level figures from Metricool, against Oct 12 – 18." },
  { k: "Facebook", v: "Oct 19 – 25", p: "Account-level figures from Metricool." },
  { k: "Search", v: "Oct 19 – 25", p: "Against Oct 12 – 18. The last days of this week may still rise." },
  { k: "Website", v: "Oct 19 – 25", p: "Being confirmed after the October 19 fix. Shown without a comparison." },
  { k: "Short links", v: "Oct 19 – 25", p: "All named NYC Dental Smiles links, counted the same way in both weeks." },
  { k: "Smile Pass", v: "Jul 1 – Oct 25", p: "An overview since launch, separate from the weekly figures. Current ads: Meta, Oct 1 – 26." },
];
