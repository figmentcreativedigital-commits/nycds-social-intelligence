/* ==========================================================================
   REPORT DATA  ·  NYC Dental Smiles
   --------------------------------------------------------------------------
   THIS CYCLE — a single week.
     October 12 – 18 against October 5 – 11: two 7-day windows, Monday to
     Sunday, directly comparable. Metricool account totals for both weeks
     read October 19 (fresh pull, 1:35 PM): Instagram views for October 5 – 11
     restated 5,513 to 5,514, Facebook views 228 to 240; reach per day,
     followers, accounts engaged and page visits unchanged. Per-piece figures
     keep their day-after reading (interactions 53). Search and Short.io for
     October 5 – 11 are the October 12 pulls; Short.io clicks do not change
     after the day.

   READ-DATE RULE — Metricool per-piece figures are each read the day after
     their week closed.

   WEBSITE (GA4) — Walter confirmed October 20 that NYC Dental Smiles GA4
     tracking has been fixed; fix date not given. The October 12 – 18 export
     still shows 31 of 79 sessions with no source, so copy says the fix is in
     and comparisons return after a full week recorded since it. No device or landing-page export this week, so those views are
     removed. Period line uses Search Console clicks.

   SHORT LINKS — Short.io unfiltered view, Clicks by All, the named practice
     paths. /nycsmilepass (254) is reported under Smile Pass. /kuYWnG (7) led
     to a missing page, was removed, and is omitted at Walter’s direction.
     /* is excluded. Homepage path / drew 0 this week.

   SEARCH — Chart.csv for totals. Name searches use the same match as last
     week (practice name, doctor surnames, “dental smile(s)” on its own); the
     rule reproduces last week’s 15 of 97 exactly. Doctor pages count every
     /dr- address, which now includes 3 new /doctors/ addresses.

   EMAIL — no campaign sent October 12 – 18.

   SOCIAL — hidden until the social lead's write-up arrives after first review.

   SMILE PASS — July 1 – October 18. Daily visitors from the Looker export,
     which matches the native GA4 series day for day through October 11.
     Sources: native GA4, property NYC Dental Smiles Membership. Sign-ups 6,
     from the website’s records (Walter, October 19). Current ads: Meta’s
     campaign-level export for September 20 – October 19, supplied October
     20; it includes Monday, October 19, and Meta’s export cannot be trimmed
     to Sunday. Leads: $153.20 of a $400 lifetime budget, no results.
     Engagement: $43.54 of $100, 156 profile visits at $0.28.

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
    label: "October 12 – 18, 2026",
    length: "7 days",
    comparedWith: "the 7 days before it (October 5 – 11)",
    paidStatus:
      "No paid advertising ran for NYC Dental Smiles in either week. Both are 7 days, Monday to Sunday, so every comparison is direct.",
  },

  copy: {
    scoreboard: {
      title: "The week in numbers",
      lede: "Each measure this week and the week before, with its trend over the last 5 weeks. This week is the plum point.",
    },
    worked: {
      title: "Event content and a short reel led the week",
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
    head: "Views and reach came down from the event week: views 2,205 against 5,514, reach per day 89 against 244. Without last week’s event post, feed pieces drew 889 views against 249. Engagement rate rose to 6.90% from 3.10%. Booking links drew 68 clicks against 55, and clicks from Google rose to 58 from 47.",
    headClient: "A steady week after the Hudson Yards event. Engagement rate rose to 6.90%, booking links drew 68 clicks, up from 55, and clicks from Google rose to 58 from 47.",
    items: [
      {
        role: "The outcome",
        text: "Views 5,514 to 2,205. Daily reach 244 to 89. Last week’s event post drew 2,538 views and reached 1,003 accounts on its own; without it, feed pieces drew 889 views against 249. Interactions 53 to 43, engagement rate 3.10% to 6.90%. Followers 779 to 780.",
        client: {
          role: "The standout",
          text: "Engagement rate rose to 6.90% from 3.10%. A short reel on what hygienists notice drew an engagement rate of 13.8%, and the Hudson Yards recap drew 635 views.",
        },
      },
      {
        role: "Strongest signal",
        text: "Booking links 55 to 68: Murray Hill 17, all locations 15, Upper East Side 15, Plaza District 12, Lenox Hill 9. Search clicks 47 to 58 and appearances 1,266 to 1,554. Doctor-page click rate 10.3% to 10.6%.",
        client: {
          role: "The wider picture",
          text: "Booking links drew 68 clicks, up from 55, led by Murray Hill with 17. Clicks from Google rose to 58 from 47, and the site appeared in Google 1,554 times, up from 1,266.",
        },
      },
      {
        role: "What softened",
        text: "Searches by name clicked through 7.5% against 15.5%. Average search position 49.1 against 40.8. Location information links 26 to 18. GA4 tracking is now fixed; this week’s export still shows 31 of 79 sessions with no source.",
        client: {
          role: "What we are monitoring",
          text: "The website’s visit tracking has now been fixed. Website figures return to the week-to-week comparison once a full week has been recorded since the fix.",
        },
      },
      {
        role: "Next action",
        text: "Confirm the date the GA4 fix went live and that it holds. Confirm 1 address per doctor page. Repeat the short educational reel.",
        client: {
          role: "What we are doing next",
          text: "We will build on the short reel format that drew the strongest engagement and keep directing people to the booking links.",
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
    weeks: ["Sep 14", "Sep 21", "Sep 28", "Oct 5", "Oct 12"],
    cols: [
      { label: "This week", sub: "Oct 12 – 18" },
      { label: "Previous week", sub: "Oct 5 – 11" },
    ],
    rows: [
      { group: "Instagram", k: "Views", note: "Last week’s Hudson Yards event post drew 2,538 on its own.", cells: [{ v: "2,205", c: "−60%" }, { v: "5,514" }], trend: [4382, 3949, 3383, 5514, 2205], fmt: "int" },
      { group: "Instagram", k: "Reach per day", note: "Average accounts reached each day. Last week’s event post reached 1,003 on its own.", cells: [{ v: "89", c: "−64%" }, { v: "244" }], trend: [239, 228, 160, 244, 89], fmt: "int" },
      { group: "Instagram", k: "Interactions", note: "Likes, comments, saves and shares on posts and reels. The Hudson Yards recap drew 24.", cells: [{ v: "43", c: "−10" }, { v: "53" }], trend: [198, 127, 51, 53, 43], fmt: "int" },
      { group: "Instagram", k: "Engagement rate", note: "Interactions divided by reach. The hygienist reel led at 13.8%.", cells: [{ v: "6.90%", c: "+3.80 points" }, { v: "3.10%" }], trend: [11.84, 7.96, 4.55, 3.10, 6.90], fmt: "pct" },
      { group: "Instagram", k: "Followers", note: "Account total at the end of each week.", cells: [{ v: "780", c: "+1" }, { v: "779" }], trend: [764, 774, 779, 779, 780], fmt: "int" },
      { group: "Booking links", k: "Booking link clicks", note: "Murray Hill 17, all locations 15, Upper East Side 15, Plaza District 12, Lenox Hill 9.", cells: [{ v: "68", c: "+24%" }, { v: "55" }], trend: [14, 35, 55, 68], fmt: "int" },
      { group: "Google search", k: "Times the site appeared", note: "Up for the 4th week running.", cells: [{ v: "1,554", c: "+23%" }, { v: "1,266" }], trend: [1055, 1113, 1190, 1266, 1554], fmt: "int" },
      { group: "Google search", k: "Clicks", note: "Tuesday, October 14 drew 25 of them.", cells: [{ v: "58", c: "+11" }, { v: "47" }], trend: [55, 53, 45, 47, 58], fmt: "int" },
      { group: "Google search", k: "Click rate", note: "Share of appearances that led to a click.", cells: [{ v: "3.73%", c: "+0.02 points" }, { v: "3.71%" }], trend: [5.21, 4.76, 3.78, 3.71, 3.73], fmt: "pct" },
      { group: "Google search", k: "Doctor page click rate", note: "All doctor pages, including 3 new addresses: 22 clicks from 208 appearances. Dr. Chesner’s page drew 6.", cells: [{ v: "10.6%", c: "+0.3 points" }, { v: "10.3%" }], trend: [13.3, 14.6, 8.3, 10.3, 10.6], fmt: "pct1" },
      { group: "Google search", k: "Searches by name", note: "Click rate on searches for the practice or a doctor: 8 clicks from 106 appearances. “nyc smiles” drew 3 more and is counted as a general search.", cells: [{ v: "7.5%", c: "−8.0 points" }, { v: "15.5%" }], trend: [18.3, 17.8, 10.3, 15.5, 7.5], fmt: "pct1" },
      { group: "Facebook", k: "Page visits", note: "Reported for completeness. At this scale the figures move on single pieces of content.", cells: [{ v: "22", c: "−4" }, { v: "26" }], trend: [0, 15, 4, 26, 22], fmt: "int" },
      { group: "Facebook", k: "Views", note: "Account total, Metricool.", cells: [{ v: "215", c: "−10%" }, { v: "240" }], trend: [111, 207, 309, 240, 215], fmt: "int" },
    ] as { group: string; k: string; note?: string; cells: { v: string; c?: string }[]; trend: number[]; fmt: "int" | "pct" | "pct1" }[],
    after: "Website visit tracking has now been fixed. Website figures appear in Supporting detail and return to this comparison once a full week has been recorded.",
  },

  /* -------------------------------------------- THE PERIOD LINE (signature) */
  periodLine: {
    title: "Clicks from Google rose to 58",
    note:
      "Clicks from Google search each day across both weeks. Shown in place of new website visitors until a full week has been recorded since the tracking fix. No paid advertising ran for NYC Dental Smiles in either week.",
    /* Search Console daily clicks. Oct 5 – 11 as read October 12; Oct 12 – 18 read October 19. */
    series: [
      { d: "Oct 5", v: 12 }, { d: "Oct 6", v: 6 }, { d: "Oct 7", v: 10 },
      { d: "Oct 8", v: 8 }, { d: "Oct 9", v: 6 }, { d: "Oct 10", v: 1 },
      { d: "Oct 11", v: 4 }, { d: "Oct 12", v: 7 }, { d: "Oct 13", v: 5 },
      { d: "Oct 14", v: 25 }, { d: "Oct 15", v: 11 }, { d: "Oct 16", v: 5 },
      { d: "Oct 17", v: 3 }, { d: "Oct 18", v: 2 },
    ],
    /* Index of the last day of the previous week (Oct 11). */
    splitAt: 6,
    shade: null as { through: number; label: string } | null,
    markers: [] as { i: number; label: string }[],
    /* derived: 47 ÷ 7 = 6.7; 58 ÷ 7 = 8.3 */
    bands: [
      { label: "October 5 – 11", value: "7 a day", detail: "Previous week" },
      { label: "October 12 – 18", value: "8 a day", detail: "This week" },
    ],
    read: {
      title: "Reading this fairly:",
      body: "Both weeks are 7 days with no paid advertising. Clicks went from 47 to 58. Tuesday, October 14 was the strongest day, with 25; the other 6 days drew 33. The weekend read 3 and 2, and Google may still add to those days.",
    },
  },

  /* ----------------------------------------------------------- WHAT WORKED */
  worked: {
    ledeClient: "The Hudson Yards recap drew the most views this week, and a short reel on what hygienists notice drew the strongest engagement.",
    /* Internal build only. */
    lede: "The Hudson Yards carousel led on views, with 635 and 264 accounts reached. The hygienist reel had the highest engagement rate, 13.8%, on 80 accounts reached. All 3 feed pieces engaged above 9%.",
    lead: {
      kind: "Post",
      title: "A few more moments from a day centered around wellness, connection, and plenty of reasons to smile",
      date: "October 15",
      url: "https://www.instagram.com/p/Dehnd-OFhHE/",
      stats: [
        { v: "635", l: "views" },
        { v: "264", l: "accounts reached" },
        { v: "24", l: "interactions" },
        { v: "9.1%", l: "engagement" },
      ],
      why:
        "635 views and 264 accounts reached, with 24 interactions: 20 likes, 2 saves and 2 shares. More moments from the Hudson Yards wellness event, a week after it.",
      repeatable:
        "The hygienist reel on October 14 drew the week’s highest engagement rate, 13.8%: 11 interactions from 80 accounts reached, including 3 shares. The review post on October 16 drew 12.1%.",
    },
    gallery: [
      {
        title: "A few more moments from a day centered around wellness, connection, and plenty of reasons to smile", format: "Post", date: "Oct 15",
        url: "https://www.instagram.com/p/Dehnd-OFhHE/",
        views: "635", reach: "264", er: "9.1%", lead: true,
      },
      {
        title: "Your hygienist notices a lot more than you might realize", format: "Reel", date: "Oct 14",
        url: "https://www.instagram.com/reel/DeZqrmYToh3/",
        views: "134", reach: "80", er: "13.8%", lead: false,
      },
      {
        title: "Being there for our patients when they need us most is what matters", format: "Post", date: "Oct 16",
        url: "https://www.instagram.com/p/DePyXZAxLTY/",
        views: "120", reach: "66", er: "12.1%", lead: false,
      },
    ],
    galleryNote:
      "The feed pieces from October 12 – 18, ranked by views. Engagement is interactions divided by reach.",
    channel: {
      title: "Search: clicks and appearances both rose",
      body:
        "Clicks from Google rose to 58 from 47, and the site appeared 1,554 times, up from 1,266. Doctor pages turned 10.6% of their Google appearances into clicks, up from 10.3%, and Dr. Chesner’s page drew 6.",
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
      title: "GA4 tracking is fixed; this week’s export still shows the gap",
      body:
        "31 of 79 sessions have no source recorded, against 33 of 88 the week before. The fix is in, and the date it went live is not yet recorded.",
      so:
        "Record the date the fix went live. Next week, check that sessions with no source fall and new visitors line up with Search Console clicks before website figures rejoin the comparison.",
    },
    {
      tag: "expected",
      title: "Views and reach came down from the event week",
      body:
        "Views 5,514 to 2,205 and reach per day 244 to 89. Last week’s event post drew 2,538 views and 1,003 reach on its own. Without it, feed pieces drew 889 views this week against 249.",
      so:
        "Compare next week with this one: neither includes an event.",
    },
    {
      tag: "early",
      title: "Searches by name clicked through less often",
      body:
        "8 clicks from 106 appearances, 7.5%, against 15 from 97. “nyc smiles” drew 3 clicks and falls outside the name match, which is unchanged from last week. Average position 49.1 against 40.8.",
      so:
        "Decide whether “nyc smiles” counts as a search for the practice. Watch 1 more week before acting.",
    },
    {
      tag: "note",
      title: "New doctor page addresses are showing in Google",
      body:
        "/doctors/dr-ben-elchami, /doctors/dr-michael-chesner and /doctors/dr-sherman-farahani drew 2 clicks from 14 appearances, alongside the original /dr- pages.",
      so:
        "Confirm with Aren which address Google should show for each doctor, and that the other redirects.",
    },
    {
      tag: "note",
      title: "1 day drove the rise in search clicks",
      body:
        "Tuesday, October 14 drew 25 of the 58 clicks. The other 6 days drew 33, an average of 5.5 a day against 6.7 last week. The exports do not show which searches drove Tuesday.",
      so:
        "Check next week whether the higher level holds.",
    },
    {
      tag: "limitation",
      title: "A short link led to a missing page",
      body:
        "/kuYWnG drew 7 clicks and led to a 404. It has been removed and is left out of this week’s totals.",
      so:
        "Check every named short link’s destination once a month.",
    },
  ],

  /* --------------------------------------------------------- WHAT WE LEARNED */
  learned: [
    { f: "6.90%", u: "Instagram engagement rate", t: "up from 3.10%. All 3 feed pieces engaged above 9%." },
    { f: "13.8%", u: "engagement on the hygienist reel", t: "the highest of the week, with 3 shares from 80 accounts reached." },
    { f: "68", u: "booking link clicks", t: "up from 55. Murray Hill led with 17." },
    { f: "58", u: "clicks from Google", t: "up from 47. The site appeared 1,554 times, up from 1,266." },
    { f: "10.6%", u: "click rate on doctor pages", t: "up from 10.3%, against 3.7% across the site." },
    { f: "4", u: "weeks of rising Google appearances", t: "from 1,055 in the week of September 14 to 1,554." },
  ],

  /* ------------------------------------------------------------- NEXT MOVES */
  moves: [
    {
      action: "Confirm the GA4 fix holds",
      why: "Tracking has been fixed, and this week’s export still shows 31 of 79 sessions with no source.",
      owner: "Web — Figment with Johana and Aren",
      measure: "GA4 visits back in line with Search Console clicks.",
    },
    {
      action: "Settle 1 address per doctor page",
      why: "3 doctors now show in Google under 2 addresses each.",
      owner: "Web — Figment with Aren",
      measure: "1 address per doctor in Search Console.",
    },
    {
      action: "Repeat the short educational reel",
      why: "The hygienist reel drew a 13.8% engagement rate and 3 shares.",
      owner: "Social — Figment",
      measure: "Engagement rate on the next reel, against 13.8%.",
    },
    {
      action: "Send the raffle contacts a booking-focused follow-up",
      why: "24 contacts joined through the raffle, and no email has gone out since October 8.",
      owner: "Email — Figment",
      measure: "Booking link clicks from the email.",
    },
    {
      action: "Check short link destinations monthly",
      why: "/kuYWnG drew 7 clicks to a missing page before it was removed.",
      owner: "Account — Figment",
      measure: "Every named link resolves.",
    },
    {
      action: "Decide how to count “nyc smiles”",
      why: "It drew 3 clicks this week and sits outside the name match.",
      owner: "Reporting — Figment",
      measure: "A settled rule, applied to both weeks.",
    },
  ],

  /* ---------------------------------------------------------------- DETAIL */
  detail: {
    subtitles: {
      instagram: "October 12 – 18 · account totals from Metricool",
      search: "October 12 – 18 · Google Search Console",
      website: "October 12 – 18 · Google Analytics",
      links: "October 12 – 18 · Short.io",
    },

    instagram: {
      kv: [
        { k: "Views", v: "2,205" },
        { k: "Reach per day", v: "89" },
        { k: "Accounts engaged", v: "61" },
        { k: "Followers", v: "780" },
        { k: "Interactions", v: "43" },
      ],
      postsChart: {
        title: "The feed pieces from this week",
        note: "Ranked by views. Engagement is interactions divided by reach.",
      },
      posts: [
        { t: "A few more moments from a day centered around wellness, connection, and plenty of reasons to smile", f: "Post", d: "Oct 15", v: "635", r: "264", i: "24", e: "9.1%" },
        { t: "Your hygienist notices a lot more than you might realize", f: "Reel", d: "Oct 14", v: "134", r: "80", i: "11", e: "13.8%" },
        { t: "Being there for our patients when they need us most is what matters", f: "Post", d: "Oct 16", v: "120", r: "66", i: "8", e: "12.1%" },
      ],
      interactionsChart: {
        title: "Posts drew most of the interactions",
        note: "43 interactions: 32 on posts and 11 on the reel.",
      },
      interactions: [
        { label: "Feed posts", value: 32 },
        { label: "Reels", value: 11 },
      ],
      viewsChart: {
        title: "Views by format",
        note: "From Metricool’s format summaries. Stories are shown as impressions. These are not summed; the account total of 2,205 is measured separately.",
      },
      viewsByFormat: [
        { label: "Feed posts", value: 755 },
        { label: "Stories", value: 317 },
        { label: "Reels", value: 134 },
      ],
      storiesTitle: "Stories",
      stories:
        "Stories drew 317 impressions, with an average reach of 22.",
      note:
        "Account totals are Metricool’s account-level figures: both weeks read October 19; last week’s views now read 5,514, against 5,513 on October 12. Per-piece figures are each read the day after their week closed. Engagement rate is interactions on posts and reels divided by reach: 43 against 623 this week and 53 against 1,708 the week before. 14 Stories this week. Without last week’s event post, feed pieces drew 889 views against 249. No paid advertising ran in either week.",
      clientNote:
        "Account totals come from Metricool’s account-level figures rather than a sum of individual posts. Figures for individual posts keep growing after a week ends, so each week is read the day after it closes. Engagement rate is interactions divided by reach. No paid advertising ran in either week.",
    },

    search: {
      kv: [
        { k: "Clicks", v: "58" },
        { k: "Impressions", v: "1,554" },
        { k: "Click rate", v: "3.73%" },
      ],
      impressionsChart: {
        title: "Impressions per day",
        note: "Daily appearances in Google results across the week.",
      },
      impressionsSeries: [
        { d: "Oct 12", v: 146 }, { d: "Oct 13", v: 243 }, { d: "Oct 14", v: 264 },
        { d: "Oct 15", v: 253 }, { d: "Oct 16", v: 227 }, { d: "Oct 17", v: 180 },
        { d: "Oct 18", v: 241 },
      ],
      pagesChart: {
        title: "The homepage collects the appearances; the doctor pages collect the clicks",
        note: "Clicks, appearances, click rate and average position by page. The doctor pages together drew 22 clicks from 208 appearances, including 3 new addresses under /doctors/.",
      },
      pages: [
        { p: "Homepage", c: "31", i: "1,146", r: "2.71%", pos: "50.4" },
        { p: "Dr. Michael Chesner", c: "6", i: "55", r: "10.91%", pos: "5.2" },
        { p: "Dr. Sherman Farahani", c: "5", i: "15", r: "33.33%", pos: "3.5" },
        { p: "Meet Our Dentists", c: "4", i: "165", r: "2.42%", pos: "29.7" },
        { p: "Dr. Maria Tamay", c: "3", i: "33", r: "9.09%", pos: "7.4" },
        { p: "Dr. James Eisdorfer", c: "3", i: "26", r: "11.54%", pos: "4.4" },
        { p: "Locations", c: "2", i: "100", r: "2.00%", pos: "27.8" },
        { p: "Dr. Ben Elchami, new address", c: "2", i: "10", r: "20.00%", pos: "7.3" },
        { p: "Services", c: "1", i: "77", r: "1.30%", pos: "4.8" },
        { p: "Dr. Doris Giraldo", c: "1", i: "30", r: "3.33%", pos: "6.2" },
        { p: "Dr. Dana Kapparova", c: "1", i: "20", r: "5.00%", pos: "10.0" },
        { p: "Dr. Ben Elchami", c: "1", i: "15", r: "6.67%", pos: "14.2" },
      ],
      devicesChart: {
        title: "Mobile clicks through at a higher rate than desktop",
        note: "Clicks, appearances, click rate and average position by device. Mobile 4.30% against 6.11%; desktop 3.55% against 2.76%.",
      },
      devices: [
        { d: "Desktop", c: "40", i: "1,126", r: "3.55%", pos: "55.2" },
        { d: "Mobile", c: "18", i: "419", r: "4.30%", pos: "33.2" },
        { d: "Tablet", c: "0", i: "9", r: "0%", pos: "29.7" },
      ],
      queriesChart: {
        title: "Searches that name the practice bring the clicks",
        note: "From the query export, which holds 13 of the 58 clicks and 1,130 of the appearances. Useful for share; totals come from the daily export.",
      },
      queries: [
        { q: "nyc dental smiles", c: "6", i: "12", r: "50.00%", pos: "1.3" },
        { q: "nyc smiles", c: "3", i: "10", r: "30.00%", pos: "2.5" },
        { q: "nyc dental smiles lenox hill", c: "1", i: "6", r: "16.67%", pos: "1.0" },
        { q: "dr chesner nyc", c: "1", i: "6", r: "16.67%", pos: "6.3" },
        { q: "dental clinic new york", c: "1", i: "3", r: "33.33%", pos: "132.7" },
        { q: "dentist", c: "1", i: "1", r: "100.00%", pos: "1.0" },
      ],
      brandSplit: {
        title: "Named and general searches",
        note: "Matched on the practice name and doctor surnames, the same rule as last week. These are shares within the query sample; totals come from the daily export.",
        rows: [
          { k: "Names the practice or a doctor", c: "8", i: "106", r: "7.55%" },
          { k: "General searches", c: "5", i: "1,024", r: "0.49%" },
        ],
      },
      note:
        "Totals come from Search Console’s daily export for October 12 – 18, read October 19. October 5 – 11 is as read October 12: 47 clicks on 1,266 appearances. Saturday and Sunday read 3 and 2 clicks and may rise. Average position is weighted by appearances, 49.1 this week against 40.8. Doctor-page click rate counts every doctor page address in both weeks.",
    },

    website: {
      kv: [
        { k: "Sessions", v: "79" },
      ],
      sourcesChart: {
        title: "Where visitors came from",
        note: "Sessions by source. Direct means someone typed the address or used a saved link. Source not recorded means the site did not record where the visit came from.",
      },
      sources: [
        { label: "Source not recorded", value: 31 },
        { label: "Google — organic", value: 21 },
        { label: "Direct", value: 18 },
        { label: "Constant Contact", value: 5 },
        { label: "Yahoo — organic", value: 2 },
      ],
      deviceChart: {
        title: "Visitors by device",
        note: "Share of visitors by device.",
      },
      deviceSplit: [] as { label: string; pct: number }[],
      landingChart: {
        title: "Where visitors landed",
        note: "Views by landing page.",
      },
      landing: [] as { label: string; value: number }[],
      note:
        "The site’s visit tracking has now been fixed. This week’s figures are shown without a comparison until a full week has been recorded since the fix. 2 further sessions came from a short link and a payment partner. No paid advertising ran for NYC Dental Smiles in either week.",
    },

    links: {
      kv: [
        { k: "Booking · all locations", v: "68" },
        { k: "Location pages", v: "18" },
        { k: "Website", v: "6" },
        { k: "Total", v: "92" },
      ],
      destsChart: {
        title: "Clicks by link",
        note: "The practice’s short links with clicks this week.",
      },
      dests: [
        { label: "Murray Hill — booking", value: 17 },
        { label: "All locations — booking", value: 15 },
        { label: "Upper East Side — booking", value: 15 },
        { label: "Plaza District — booking", value: 12 },
        { label: "Lenox Hill — booking", value: 9 },
        { label: "Plaza District — information", value: 8 },
        { label: "Murray Hill — information", value: 7 },
        { label: "Main website", value: 6 },
        { label: "Lenox Hill — information", value: 2 },
        { label: "Upper East Side — information", value: 1 },
      ],
      note:
        "92 clicks this week against 97. Booking links drew 68 against 55, and location information links 18 against 26. The Smile Pass link is reported in the Smile Pass section.",
    },

    email: null as null | {
      window: string;
      note: string;
      table: { head: string[]; rows: string[][] };
      tableInternal: { head: string[]; rows: string[][] };
      tableChart: { title: string; note: string };
    },

    facebook: {
      subtitle: "October 12 – 18 · account totals from Metricool",
      kv: [
        { k: "Followers", v: "983" },
        { k: "Views", v: "215" },
        { k: "Page visits", v: "22" },
      ],
      note:
        "Page visits 22 against 26. Views 215 against 240, restated from 228 in last week’s report. Followers 983 against 982. At this scale the figures move on single pieces of content and are reported for completeness.",
    },

    method: [
      { q: "What the report covers", a: "October 12 to 18, 2026, 7 full days, Monday to Sunday, compared with October 5 to 11. Both weeks are the same length, so every comparison is direct." },
      { q: "Where the Instagram totals come from", a: "Metricool’s account-level figures. Per-piece figures are used only to rank content against content." },
      { q: "How engagement rate is calculated", a: "Interactions on posts and reels divided by reach, meaning the share of people who saw something and engaged with it." },
      { q: "Why each week is read the day after it closes", a: "Figures for individual posts keep growing after a week ends. Reading each week the day after it closes means both weeks have had the same time to collect views." },
      { q: "Which reading the previous week uses", a: "Metricool account totals for October 5 to 11 were read again on October 19, so both weeks are read the same day. Search and short link figures are the October 12 readings.", internalOnly: true },
      { q: "Why the search figures may change", a: "Google keeps processing search data for several days, so the most recent days of any week are the least settled." },
      { q: "How the doctor page click rate is calculated", a: "Every doctor page address, counted the same way in both weeks: 22 clicks from 208 appearances this week, 20 from 195 the week before." },
      { q: "How searches by name are counted", a: "Searches that include the practice name or a doctor’s surname, matched the same way in both weeks, within Google’s query sample." },
      { q: "How short link clicks are counted", a: "All clicks on the practice’s named short links, counted the same way in both weeks. The Smile Pass link is reported in the Smile Pass section." },
      { q: "Why website figures are not compared this week", a: "Updates were made to the website at the end of September, and the way it counts visits changed from September 29. That has now been fixed. Until a full week has been recorded since the fix, website figures are shown without a week-to-week comparison, and the daily chart shows clicks from Google instead." },
      { q: "Where the Social section is", a: "The social lead’s write-up arrives after first review. It is checked figure by figure against the Metricool export before it is added.", internalOnly: true },
      { q: "What is not in this report", a: "No paid advertising ran for NYC Dental Smiles in either week, and no email campaign went out this week. Story interactions are not in the Instagram export." },
    ] as { q: string; a: string; internalOnly?: boolean; clientOnly?: boolean }[],
  },

  /* ------------------------------------------------------------ SMILE PASS
     A separate overview, not part of the weekly comparison. July 1 –
     October 18, 2026. Sources: GA4 property "NYC Dental Smiles Membership",
     Meta Ads (August export; current campaigns September 20 – October 19),
     Short.io, Site Kit's weekly email,
     Metricool (organic only), Search Console, and the website's own
     sign-up records. */
  smilepass: {
    title: "NYC Smile Pass",
    dateLine: "July 1 – October 18, 2026, since launch",
    lede:
      "Smile Pass since July 1. 6 sign-ups to date, against 2 a week ago. October 12 – 18 drew 169 new visitors, against 74, the most in a week since August. /nycsmilepass drew 254 clicks, 249 of them tagged from the Meta ads and 206 of those from Audience Network. The 2 current campaigns have spent $196.74, 78% of it on the leads campaign, which still records no sign-ups in Meta.",
    ledeClient:
      "An overview of NYC Smile Pass since July 1. Sign-ups reached 6, up from 2 a week ago, and the site drew 169 new visitors from October 12 to 18, the most in a week since the August launch campaign.",
    kv: [
      { k: "Sign-ups", v: "6" },
      { k: "New website visitors", v: "2,463" },
      { k: "People reached by the August campaign", v: "62,053" },
      { k: "Profile visits from the engagement ad", v: "156" },
      { k: "Instagram followers", v: "35" },
      { k: "Facebook followers", v: "29" },
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
      { d: "Oct 17", v: 27 }, { d: "Oct 18", v: 40 },
    ],
    dailyChart: {
      title: "Visits peaked with the August campaign and are rising again in October",
      /* indices into `daily`: 41 = Aug 11, 60 = Aug 30 */
      band: { from: 41, to: 60, label: "August campaign" },
      note:
        "New website visitors each day since July 1. 2,067 of the 2,463 arrived between August 11 and 30, during the launch campaign. October 12 – 18 drew 169, against 74 the week before, with 55 on October 15 and 40 on October 18. The same week, /nycsmilepass drew 254 clicks, 249 of them from the ads; clicks and visits are largely the same people and are not added together.",
      noteClient:
        "New website visitors each day since July 1. Most arrived during the August launch campaign. Visits rose again in October: 169 new visitors from October 12 to 18, against 74 the week before.",
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
          ["Reel Engagement/Follows Fall 2026", "Instagram profile visits", "$43.54 of $100", "1,266", "1,764", "6.29%", "156 profile visits, $0.28 each"],
          ["Reel Leads Fall 2026", "Sign-ups", "$153.20 of $400", "2,190", "3,380", "10.41%", "None recorded in Meta yet"],
          ["Total", "", "$196.74 of $500", "", "5,144", "", ""],
        ],
      },
      tableClient: {
        head: ["Ad", "Goal", "People reached", "Impressions", "Link click rate", "Result"],
        rows: [
          ["Engagement ad", "Visits to the Smile Pass Instagram profile", "1,266", "1,764", "6.29%", "156 profile visits, 28 cents each"],
          ["Leads ad", "Sign-ups", "2,190", "3,380", "10.41%", "Reported once Meta records sign-ups"],
        ],
      },
      note:
        "Meta’s campaign export for September 20 – October 19, which includes Monday, October 19. Both campaigns are active and end November 9, with $500 in lifetime budgets: $196.74 spent so far. 78% of the spend, $153.20, went to the leads campaign, which optimizes for sign-ups and still records none; the website had 6 sign-ups by October 19. Its link click rate is 10.41%, so people are clicking through. The engagement campaign has drawn 156 profile visits, up from 73 in the ad-level export to October 12. This week the ads link through /nycsmilepass: 249 of its 254 clicks carry the ads’ campaign tags, 206 from Audience Network, Meta’s placements in other apps and sites. Site Kit counts 89 visitors from Meta’s other placements for the week, against 24. People reached is not added across the 2 ads, since the same person can see both.",
      noteClient:
        "2 ads are running, with figures through October 19. The engagement ad brings people to the Smile Pass Instagram profile. The leads ad, which carries most of the budget, is set up to find people likely to sign up. People reached is counted per ad, since the same person can see both.",
    },
    sources: {
      title: "How visitors engaged, by source",
      table: {
        head: ["Source", "Visits", "Share that engaged", "Average time on site"],
        rows: [
          ["Instagram ads", "1,659", "4.0%", "0.8 seconds"],
          ["Facebook ads", "468", "14.1%", "10.1 seconds"],
          ["Direct", "233", "25.3%", "22.0 seconds"],
          ["Audience Network ads", "134", "32.8%", "0.6 seconds"],
          ["Google search", "82", "41.5%", "19.1 seconds"],
          ["Instagram and Facebook, unpaid", "44", "40.9%", "10.4 seconds"],
        ],
      },
      note:
        "July 1 – October 18. Instagram ad visitors, 1,659 of the 2,645 visits, engaged 4.0% of the time and averaged under a second. Facebook ad visitors engaged more than 3 times as often. Audience Network visits rose to 134 from 21 a week ago; they averaged under a second. Bing (6), unassigned (10) and Threads ads (9) are not shown.",
      noteClient:
        "A visit counts as engaged if it lasted at least 10 seconds or included a second page. Visitors from Google, direct visits and unpaid social spent the most time on the site. Sources with fewer than 20 visits are not shown.",
    },
    social: {
      title: "Smile Pass on social",
      table: {
        head: ["", "Instagram", "Facebook"],
        rows: [
          ["Followers", "35", "29"],
          ["Average reach per post", "49", "10"],
          ["Reels", "872 views · 97 average reach", "992 video views"],
          ["Strongest piece", "Sep 17 reel · 340 views · 277 reach", "—"],
        ],
      },
      note:
        "Unpaid content only, from July 10, the first piece, to October 18, from Metricool. Account-level reach and views include ad delivery and are not used: Facebook reports 27.21K views. Followers 35 and 29, against 30 and 14 a week ago. The strongest organic piece is still the September 17 reel, “Be honest: when was your last dentist appointment?”, with 340 views and 277 reach.",
      noteClient:
        "Unpaid posts only, from July 10. Instagram has grown to 35 followers and Facebook to 29. The strongest post is still the September 17 reel asking when you last saw a dentist, with 340 views.",
    },
    search: {
      title: "Search",
      kv: [
        { k: "Clicks from Google", v: "26" },
        { k: "Appearances in Google", v: "289" },
        { k: "Most common search", v: "“nyc dental smiles”" },
      ],
      note:
        "July 1 – October 18. Google reports 106 appearances for “nyc dental smiles” and 1 for “smile pass”. Google withholds low-volume searches, so the list covers 118 of the 289 appearances. The sign-up page drew 1 click. Site Kit shows 6 clicks for October 12 – 18.",
      noteClient:
        "Search presence is still early for a new site. Most searches that showed Smile Pass were for the NYC Dental Smiles name, and the site has drawn 26 clicks from Google since July.",
    },
    findings: {
      title: "What we learned",
      items: [
        {
          t: "Sign-ups tripled in a week",
          b: "6 sign-ups to date, from the website’s records, against 2 a week ago. Meta’s leads campaign shows no results through October 19 and GA4 has no sign-up event, so neither can link a sign-up to an ad.",
          client: { t: "Sign-ups reached 6", b: "Sign-ups rose to 6 from 2 a week ago. Connecting sign-ups to Meta and Google Analytics is the next step, so every future report can show where members come from." },
        },
        {
          t: "October brought the most visitors since August",
          b: "169 new visitors from October 12 to 18, against 74 and then 4 to 9 a week from August 31. Audience Network brought 206 of the 249 ad clicks on /nycsmilepass.",
          client: { t: "Visits keep rising", b: "169 new visitors came to the site from October 12 to 18, more than double the week before and the most since the launch campaign." },
        },
        {
          t: "The engagement ad is building the Instagram audience",
          b: "156 profile visits for $43.54 to October 19, 28 cents each, up from 73 to October 12. Instagram followers stand at 35, against 30 a week ago and 27 on September 27.",
          client: { t: "Instagram is growing", b: "The engagement ad has drawn 156 visits to the Smile Pass Instagram profile, up from 73 a week earlier, and the account has grown to 35 followers from 30." },
        },
        {
          t: "Facebook ad visitors were more engaged than Instagram’s",
          b: "14.1% of Facebook ad visits engaged against 4.0% from Instagram, averaging 10.1 seconds against 0.8. Instagram took 78% of the Instagram and Facebook ad visits.",
          client: { t: "Facebook ad visitors stayed longer", b: "Visitors from Facebook ads were more than 3 times as likely to engage as visitors from Instagram ads, and stayed longer on the site." },
        },
        {
          t: "The August campaign brought people in cheaply",
          b: "1,604 landing page views at 47 cents each, and 62,053 people reached. It was set to find people likely to open the page, and that is what it delivered.",
          client: { t: "The launch campaign reached a wide audience", b: "62,053 people saw the August ads and 1,604 visited the site from them, at 47 cents a visit." },
        },
      ],
    },
    next: {
      title: "What we’d do next",
      items: [
        { t: "Record each sign-up in Meta and Google Analytics", b: "The leads ad optimizes for sign-ups. Recording each completed sign-up lets Meta find more people like the ones who join, and lets every report measure sign-ups directly." },
        { t: "Compare sign-ups by ad placement", b: "Audience Network now brings most of the ad clicks. Once sign-ups are recorded, comparing them by placement will show where the budget works hardest." },
        { t: "Lead with the No Insurance message", b: "In August it drew a higher click rate, 3.12% against 2.49%, at a lower cost per visit." },
        { t: "Keep sharing Smile Pass from NYC Dental Smiles", b: "NYC Dental Smiles has 780 Instagram followers; Smile Pass has 35." },
      ],
    },
    method:
      "New visitor totals come from GA4’s daily series, July 1 – October 18, property NYC Dental Smiles Membership; visits by source cover the same dates. August campaign figures are Meta’s August export. Current ad figures are Meta’s campaign export for September 20 – October 19, which includes October 19. Short link clicks are Short.io, October 12 – 18. Social figures are organic only, July 10 – October 18, because Metricool’s account totals include ad delivery. Search covers July 1 – October 18. The sign-up count is from the website’s own records.",
    methodClient:
      "Figures cover July 1 to October 18, 2026. Website figures are from Google Analytics, ad figures from Meta through October 19, social figures from Metricool and search figures from Google Search Console. The sign-up count is from the website’s own records. Social figures cover unpaid posts only.",
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
  { k: "Instagram", v: "Oct 12 – 18", p: "Account-level figures from Metricool, against Oct 5 – 11." },
  { k: "Facebook", v: "Oct 12 – 18", p: "Account-level figures from Metricool." },
  { k: "Search", v: "Oct 12 – 18", p: "Against Oct 5 – 11. The last days of this week may still rise." },
  { k: "Website", v: "Oct 12 – 18", p: "Tracking now fixed. Shown without a comparison this week." },
  { k: "Short links", v: "Oct 12 – 18", p: "All named NYC Dental Smiles links, counted the same way in both weeks." },
  { k: "Smile Pass", v: "Jul 1 – Oct 18", p: "An overview since launch, separate from the weekly figures. Current ads: Meta, Sep 20 – Oct 19." },
];
