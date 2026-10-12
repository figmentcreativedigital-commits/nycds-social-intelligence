/* ==========================================================================
   REPORT DATA  ·  NYC Dental Smiles
   --------------------------------------------------------------------------
   THIS CYCLE — a single week.
     October 5 – 11 against September 28 – October 4: two 7-day windows,
     Monday to Sunday, directly comparable. Both weeks read October 12, except
     last week's per-piece Instagram figures, which are the October 5 reading.

   READ-DATE RULE — Metricool per-piece figures are each read the day after
     their week closed. Account-level figures for both weeks: October 12.

   WEBSITE (GA4) — new-visitor counting still broken. New visitors 0, 0, 0,
     3, 0, 2, 2; 33 of 88 sessions have source (not set). Sessions and landing
     pages shown without comparison. Period line uses Search Console clicks.

   SHORT LINKS — Short.io unfiltered view, Clicks by All, 11 allowlist paths
     plus /raffle. /nycsmilepass (new, 72 clicks) leads to nycsmilepass.com
     and is reported under Smile Pass, not in the NYCDS link totals. /* (2) is
     excluded.

   RAFFLE — closed. Final figures are the October 5 reading of the Constant
     Contact entry form: 24 entries from 46 unique visits.

   SEARCH — the Oct 5 – 11 export runs to October 12. Totals use Chart.csv
     trimmed to October 11. Page and device rows include October 12, which
     added 6 appearances and 0 clicks.

   EMAIL — Manhattan Mag Post Event, sent October 8, from the campaign list
     view: 24 sends, 10 opens, 0 clicks, 1 bounce. Confirmed opens pending.

   SOCIAL — hidden until the social lead's write-up arrives after first review.

   SMILE PASS — unchanged this draft, August 1 – September 27. To be rebuilt
     from July 1 when the Meta Ads export arrives.

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
    label: "October 5 – 11, 2026",
    length: "7 days",
    comparedWith: "the 7 days before it (September 28 – October 4)",
    paidStatus:
      "No paid advertising ran for NYC Dental Smiles in either week. Both are 7 days, Monday to Sunday, so every comparison is direct.",
  },

  copy: {
    scoreboard: {
      title: "The week in numbers",
      lede: "Each measure this week and the week before, with its trend over the last 5 weeks. This week is the plum point.",
    },
    worked: {
      title: "The Hudson Yards event led the week",
      galleryTitle: "The 3 feed pieces published this week, ranked by views",
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
    head: "Instagram views rose to 5,513 from 3,383 and daily reach to 244 from 160. The Manhattan Magazine event post drew 2,538 views. Booking links drew 55 clicks against 35, and doctor pages turned 10.3% of their Google appearances into clicks, against 8.3%.",
    headClient: "The Hudson Yards event carried into a strong week. Instagram views rose to 5,513, the event post reached more than 1,000 people, and the booking links drew 55 clicks, up from 35.",
    items: [
      {
        role: "The outcome",
        text: "Views 3,383 to 5,513, up 63%. Daily reach 160 to 244, up 53%. The event post on October 8 drew 2,538 views and reached 1,003 accounts. The collab reel on Dr. El Chaar’s account added 980 views and is not in NYCDS totals. 7 pieces against 15, with no NYCDS reel. Followers held at 779: 4 new, 4 lost.",
        client: {
          role: "The standout",
          text: "The post from the Manhattan Magazine Wellness Event at Hudson Yards drew 2,538 views and reached 1,003 people. A second reel from the event, shared with Dr. El Chaar’s account, drew 980 more.",
        },
      },
      {
        role: "Strongest signal",
        text: "Booking links 35 to 55. Plaza District 18, Upper East Side 13, Lenox Hill 13, all locations 9, Murray Hill 2. Doctor-page click rate 8.3% to 10.3%, and searches naming the practice or a doctor 10.3% to 15.5%. The raffle closed with 24 entries.",
        client: {
          role: "The wider picture",
          text: "The booking links drew 55 clicks, up from 35, with every location drawing clicks. People searching for the practice or a doctor by name clicked through 15.5% of the time, up from 10.3%. The raffle closed with 24 new contacts on the mailing list.",
        },
      },
      {
        role: "What softened",
        text: "Engagement rate 4.55% to 3.10%: interactions held at 53 against 51 while reach rose. Facebook views 309 to 228. GA4 is still not counting correctly: 7 new visitors and 33 of 88 sessions with no source.",
        client: {
          role: "What we are monitoring",
          text: "We are still confirming how the website counts visits after the recent updates, so website figures are shown without a comparison this week.",
        },
      },
      {
        role: "Next action",
        text: "Get a fix date for GA4. Pull confirmed opens for the event email. Follow the event with a doctor-led reel while interest is high.",
        client: {
          role: "What we are doing next",
          text: "We will follow the event with more doctor-led content and keep building on the booking link activity.",
        },
      },
    ] as { role: string; text: string; client?: { role: string; text: string } }[],
  },

  /* ------------------------------------------------------------ SCOREBOARD */
  /* The ledger. `trend` runs oldest to newest and ends with this week. Each
     earlier point is that week's most recent reading, as published. Booking
     links start at September 21, when the current counting began; searches
     by name start at September 14, the first week the split was reported.
     Change strings start with "+" or "−" (minus sign) to draw an arrow. */
  scoreboard: {
    weeks: ["Sep 7", "Sep 14", "Sep 21", "Sep 28", "Oct 5"],
    cols: [
      { label: "This week", sub: "Oct 5 – 11" },
      { label: "Previous week", sub: "Sep 28 – Oct 4" },
    ],
    rows: [
      { group: "Instagram", k: "Views", note: "The Manhattan Magazine event post drew 2,538 of them.", cells: [{ v: "5,513", c: "+63%" }, { v: "3,383" }], trend: [1978, 4382, 3949, 3383, 5513], fmt: "int" },
      { group: "Instagram", k: "Reach per day", note: "Average accounts reached each day. The event post reached 1,003 on its own.", cells: [{ v: "244", c: "+53%" }, { v: "160" }], trend: [100, 239, 228, 160, 244], fmt: "int" },
      { group: "Instagram", k: "Interactions", note: "Likes, comments, saves and shares on posts and reels. The event post drew 40.", cells: [{ v: "53", c: "+2" }, { v: "51" }], trend: [42, 198, 127, 51, 53], fmt: "int" },
      { group: "Instagram", k: "Engagement rate", note: "Interactions divided by reach. Reach grew faster than interactions this week.", cells: [{ v: "3.10%", c: "−1.45 points" }, { v: "4.55%" }], trend: [6.00, 11.84, 7.96, 4.55, 3.10], fmt: "pct" },
      { group: "Instagram", k: "Followers", note: "Account total at the end of each week.", cells: [{ v: "779", c: "0" }, { v: "779" }], trend: [760, 764, 774, 779, 779], fmt: "int" },
      { group: "Instagram", k: "Content published", note: "2 posts and 5 Stories, plus a collab reel on Dr. El Chaar’s account.", cells: [{ v: "7", c: "−8" }, { v: "15" }], trend: [7, 7, 12, 15, 7], fmt: "int" },
      { group: "Booking links", k: "Booking link clicks", note: "Plaza District 18, Upper East Side 13, Lenox Hill 13, all locations 9, Murray Hill 2.", cells: [{ v: "55", c: "+57%" }, { v: "35" }], trend: [14, 35, 55], fmt: "int" },
      { group: "Google search", k: "Times the site appeared", note: "Up for the 3rd week running.", cells: [{ v: "1,266", c: "+6%" }, { v: "1,190" }], trend: [1738, 1055, 1113, 1190, 1266], fmt: "int" },
      { group: "Google search", k: "Clicks", note: "Google is still processing the last days of this week, so this figure may rise.", cells: [{ v: "47", c: "+2" }, { v: "45" }], trend: [45, 55, 53, 45, 47], fmt: "int" },
      { group: "Google search", k: "Click rate", note: "Share of appearances that led to a click.", cells: [{ v: "3.71%", c: "−0.07 points" }, { v: "3.78%" }], trend: [2.59, 5.21, 4.76, 3.78, 3.71], fmt: "pct" },
      { group: "Google search", k: "Doctor page click rate", note: "All 7 doctor pages: 20 clicks from 195 appearances. Dr. Farahani’s page drew 6.", cells: [{ v: "10.3%", c: "+2.0 points" }, { v: "8.3%" }], trend: [10.1, 13.3, 14.6, 8.3, 10.3], fmt: "pct1" },
      { group: "Google search", k: "Searches by name", note: "Click rate on searches for the practice or a doctor: 15 clicks from 97 appearances.", cells: [{ v: "15.5%", c: "+5.1 points" }, { v: "10.3%" }], trend: [18.3, 17.8, 10.3, 15.5], fmt: "pct1" },
      { group: "Facebook", k: "Page visits", note: "Reported for completeness. At this scale the figures move on single pieces of content.", cells: [{ v: "26", c: "+22" }, { v: "4" }], trend: [0, 15, 4, 26], fmt: "int" },
      { group: "Facebook", k: "Views", note: "1 piece published, against 3.", cells: [{ v: "228", c: "−26%" }, { v: "309" }], trend: [103, 111, 207, 309, 228], fmt: "int" },
    ] as { group: string; k: string; note?: string; cells: { v: string; c?: string }[]; trend: number[]; fmt: "int" | "pct" | "pct1" }[],
    after: "Website figures are being confirmed after recent updates and appear in Supporting detail.",
  },

  /* -------------------------------------------- THE PERIOD LINE (signature) */
  periodLine: {
    title: "Clicks from Google held steady",
    note:
      "Clicks from Google search each day across both weeks. Shown in place of new website visitors while we confirm how the site counts visits. No paid advertising ran for NYC Dental Smiles in either week.",
    /* Search Console daily clicks, both weeks read October 12. */
    series: [
      { d: "Sep 28", v: 9 }, { d: "Sep 29", v: 8 }, { d: "Sep 30", v: 7 },
      { d: "Oct 1", v: 7 }, { d: "Oct 2", v: 7 }, { d: "Oct 3", v: 4 },
      { d: "Oct 4", v: 3 }, { d: "Oct 5", v: 12 }, { d: "Oct 6", v: 6 },
      { d: "Oct 7", v: 10 }, { d: "Oct 8", v: 8 }, { d: "Oct 9", v: 6 },
      { d: "Oct 10", v: 1 }, { d: "Oct 11", v: 4 },
    ],
    /* Index of the last day of the previous week (Oct 4). */
    splitAt: 6,
    shade: null as { through: number; label: string } | null,
    markers: [] as { i: number; label: string }[],
    /* derived: 45 ÷ 7 = 6.4; 47 ÷ 7 = 6.7 */
    bands: [
      { label: "September 28 – October 4", value: "6 a day", detail: "Previous week" },
      { label: "October 5 – 11", value: "7 a day", detail: "This week" },
    ],
    read: {
      title: "Reading this fairly:",
      body: "Both weeks are 7 days with no paid advertising. Clicks went from 45 to 47. Monday was the strongest day, with 12. The weekend read 1 and 4, and Google may still add to those days.",
    },
  },

  /* ----------------------------------------------------------- WHAT WORKED */
  worked: {
    ledeClient: "The Manhattan Magazine event post was the week’s strongest piece, and a second reel from the event ran on Dr. El Chaar’s account.",
    /* Internal build only. */
    lede: "The event carried the week. The Manhattan Magazine post drew 2,538 views and reached 1,003 accounts. The collab reel from the same day added 980 views on Dr. El Chaar’s account.",
    lead: {
      kind: "Post",
      title: "We had such a great time at the Manhattan Magazine Wellness Event at Hudson Yards",
      date: "October 8",
      url: "https://www.instagram.com/p/DePqlGSFqjX/",
      stats: [
        { v: "2,538", l: "views" },
        { v: "1,003", l: "accounts reached" },
        { v: "40", l: "interactions" },
        { v: "12", l: "shares" },
      ],
      why:
        "2,538 views and 1,003 accounts reached, with 40 interactions, 12 of them shares. It shows the practice at the event: tooth gems, iTero scans and saliva testing.",
      repeatable:
        "The collab reel, “A few more moments from a day well spent at Hudson Yards”, drew 980 views and 41 interactions on Dr. El Chaar’s account. The team post on October 10 drew 249 views and 13 interactions.",
    },
    gallery: [
      {
        title: "We had such a great time at the Manhattan Magazine Wellness Event at Hudson Yards", format: "Post", date: "Oct 8",
        url: "https://www.instagram.com/p/DePqlGSFqjX/",
        views: "2,538", reach: "1,003", er: "4.0%", lead: true,
      },
      {
        title: "A few more moments from a day well spent at Hudson Yards", format: "Collab reel", date: "Oct 9",
        url: "https://www.instagram.com/reel/DeR44iuznAt/",
        views: "980", reach: "—", er: "—", lead: false,
      },
      {
        title: "Your dental care should come with a whole team behind it", format: "Post", date: "Oct 10",
        url: "https://www.instagram.com/p/DePxLHIxAZu/",
        views: "249", reach: "142", er: "9.2%", lead: false,
      },
    ],
    galleryNote:
      "The feed pieces from October 5 – 11, ranked by views. The collab reel was published on Dr. El Chaar’s account with NYC Dental Smiles as collaborator, so its reach is not reported to NYCDS. 5 Stories complete the week. Engagement is interactions divided by reach.",
    channel: {
      title: "Search: doctor pages and name searches drew more clicks",
      body:
        "Doctor pages turned 10.3% of their Google appearances into clicks, up from 8.3%, and Dr. Farahani’s page drew 6. Searches for the practice or a doctor by name clicked through 15.5% of the time, up from 10.3%. The site appeared in Google 1,266 times, up from 1,190.",
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
      title: "GA4 is still not counting new visitors correctly",
      body:
        "New visitors read 0, 0, 0, 3, 0, 2 and 2. Search Console clicks over the same days were 12, 6, 10, 8, 6, 1 and 4. 33 of 88 sessions have no source recorded, up from 22 of 97.",
      so:
        "This is the second full week. Ask Johana and Aren for a fix date, and confirm the GA4 tag fires on every page. Website figures stay out of the comparison until then.",
    },
    {
      tag: "expected",
      title: "Engagement rate fell as reach rose",
      body:
        "Interactions 51 to 53, reach per day 160 to 244, so the rate went from 4.55% to 3.10%. The event post drew most of the new reach at a 4.0% rate, below the 9.2% of the team post.",
      so:
        "Worth watching next week, once the event post’s reach has passed.",
    },
    {
      tag: "early",
      title: "No NYCDS reel went out this week",
      body:
        "7 pieces against 15: 2 posts and 5 Stories. The only reel was the collab on Dr. El Chaar’s account. Reels led reach in each of the 3 weeks before.",
      so:
        "A doctor-led reel next week would show whether reach holds without the event.",
    },
    {
      tag: "limitation",
      title: "Event email shows all opens only",
      body:
        "Manhattan Mag Post Event, October 8: 24 sends, 10 opens (43%), 0 clicks, 1 bounce, from the campaign list view.",
      so:
        "Pull the campaign’s Reporting page for confirmed opens. The send count, 24, is the same as the raffle list.",
    },
    {
      tag: "note",
      title: "A new Smile Pass short link drew the most clicks",
      body:
        "/nycsmilepass leads to nycsmilepass.com and drew 72 clicks this week, more than any NYCDS link. It is reported in the Smile Pass section, not in NYCDS link totals.",
      so:
        "Confirm where it was shared so the Smile Pass section can describe it accurately.",
    },
    {
      tag: "limitation",
      title: "The search export runs 1 day long",
      body:
        "The October 5 – 11 export includes October 12. Totals are trimmed to October 11 from the daily figures; page and device rows include 6 extra appearances and no clicks.",
      so:
        "Set the end date to Sunday on next week’s export.",
    },
  ],

  /* --------------------------------------------------------- WHAT WE LEARNED */
  learned: [
    { f: "2,538", u: "views on the event post", t: "with 1,003 accounts reached and 12 shares." },
    { f: "5,513", u: "Instagram views", t: "up from 3,383. Daily reach rose to 244 from 160." },
    { f: "55", u: "booking link clicks", t: "up from 35, with every location drawing clicks. Plaza District led with 18." },
    { f: "24", u: "raffle entries", t: "all new contacts for the mailing list. The raffle has closed." },
    { f: "15.5%", u: "click rate on searches by name", t: "up from 10.3%. People looking for the practice or a doctor find the site." },
    { f: "10.3%", u: "click rate on doctor pages", t: "up from 8.3%, against 3.7% across the site." },
  ],

  /* ------------------------------------------------------------- NEXT MOVES */
  moves: [
    {
      action: "Get a fix date for the website’s visit tracking",
      why: "GA4 has undercounted new visitors for 2 full weeks, and 33 of 88 sessions have no source.",
      owner: "Web — Figment with Johana and Aren",
      measure: "GA4 new visitors back in line with Search Console clicks.",
    },
    {
      action: "Follow the event with a doctor-led reel",
      why: "The event post reached 1,003 accounts. A reel next week shows whether that reach carries over.",
      owner: "Social — Figment",
      measure: "Reach on the next reel, against 221 for the last NYCDS reel.",
    },
    {
      action: "Pull confirmed opens for the event email",
      why: "The list view shows all opens, which include automated mail checks.",
      owner: "Email — Figment",
      measure: "Confirmed opens and clicks for Manhattan Mag Post Event.",
    },
    {
      action: "Send the raffle contacts a booking-focused follow-up",
      why: "24 new contacts joined through the raffle. The event email drew 10 opens and no clicks.",
      owner: "Email — Figment",
      measure: "Booking link clicks from the follow-up.",
    },
    {
      action: "Confirm where the Smile Pass short link was shared",
      why: "/nycsmilepass drew 72 clicks, the most of any link on the domain.",
      owner: "Account — Figment",
      measure: "A source for each placement of the link.",
    },
    {
      action: "End search exports on Sunday",
      why: "This week’s export included Monday, October 12.",
      owner: "Reporting — Figment",
      measure: "Export end date matches the week.",
    },
  ],

  /* ---------------------------------------------------------------- DETAIL */
  detail: {
    subtitles: {
      instagram: "October 5 – 11 · account totals from Metricool",
      search: "October 5 – 11 · Google Search Console",
      website: "October 5 – 11 · Google Analytics",
      links: "October 5 – 11 · Short.io",
    },

    instagram: {
      kv: [
        { k: "Views", v: "5,513" },
        { k: "Reach per day", v: "244" },
        { k: "Accounts engaged", v: "92" },
        { k: "Followers", v: "779" },
        { k: "Content published", v: "7" },
        { k: "Interactions", v: "53" },
      ],
      publishedChart: {
        title: "What was published",
        note: "7 pieces against 15 the week before: 5 Stories against 12, and 2 posts against 2. No NYCDS reel this week, against 1.",
      },
      published: [
        { label: "Stories", value: 5 },
        { label: "Feed posts", value: 2 },
        { label: "Reels", value: 0 },
      ],
      postsChart: {
        title: "The feed pieces from this week",
        note: "Ranked by views. Engagement is interactions divided by reach. The collab reel’s reach is reported to Dr. El Chaar’s account only.",
      },
      posts: [
        { t: "We had such a great time at the Manhattan Magazine Wellness Event at Hudson Yards", f: "Post", d: "Oct 8", v: "2,538", r: "1,003", i: "40", e: "4.0%" },
        { t: "A few more moments from a day well spent at Hudson Yards", f: "Collab reel", d: "Oct 9", v: "980", r: "—", i: "41", e: "—" },
        { t: "Your dental care should come with a whole team behind it", f: "Post", d: "Oct 10", v: "249", r: "142", i: "13", e: "9.2%" },
      ],
      interactionsChart: {
        title: "The event post drew most of the interactions",
        note: "53 interactions on NYCDS posts. The event post drew 40.",
      },
      interactions: [
        { label: "Feed posts", value: 53 },
        { label: "Reels", value: 0 },
      ],
      viewsChart: {
        title: "Views by format",
        note: "From Metricool’s format summaries. Stories are shown as impressions. These are not summed; the account total of 5,513 is measured separately.",
      },
      viewsByFormat: [
        { label: "Feed posts", value: 2787 },
        { label: "Stories", value: 397 },
        { label: "Reels", value: 0 },
      ],
      storiesTitle: "Stories",
      stories:
        "5 Stories drew 397 impressions, with an average reach of 62. The 4 Hudson Yards Stories from October 4, unmeasured last week, have now reached 337, 78, 70 and 64 accounts.",
      note:
        "Account totals are Metricool’s account-level figures, both weeks read October 12; last week’s views read 3,383, against 3,378 on October 5. Per-piece figures are each read the day after their week closed. Engagement rate is interactions on posts and reels divided by reach: 53 against 1,708 this week and 51 against 1,120 the week before. The collab reel is on Dr. El Chaar’s account and is not in NYCDS totals. Metricool shows 4 followers acquired and 4 lost. No paid advertising ran in either week.",
      clientNote:
        "Account totals come from Metricool’s account-level figures rather than a sum of individual posts. Figures for individual posts keep growing after a week ends, so each week is read the day after it closes. Engagement rate is interactions divided by reach. No paid advertising ran in either week.",
    },

    search: {
      kv: [
        { k: "Clicks", v: "47" },
        { k: "Impressions", v: "1,266" },
        { k: "Click rate", v: "3.71%" },
      ],
      impressionsChart: {
        title: "Impressions per day",
        note: "Daily appearances in Google results across the week.",
      },
      impressionsSeries: [
        { d: "Oct 5", v: 303 }, { d: "Oct 6", v: 198 }, { d: "Oct 7", v: 229 },
        { d: "Oct 8", v: 141 }, { d: "Oct 9", v: 141 }, { d: "Oct 10", v: 115 },
        { d: "Oct 11", v: 139 },
      ],
      pagesChart: {
        title: "The homepage collects the appearances; the doctor pages collect the clicks",
        note: "Clicks, appearances, click rate and average position by page. The 7 doctor pages together drew 20 clicks from 195 appearances.",
      },
      pages: [
        { p: "Homepage", c: "22", i: "954", r: "2.31%", pos: "42.8" },
        { p: "Dr. Sherman Farahani", c: "6", i: "28", r: "21.43%", pos: "5.4" },
        { p: "Dr. Michael Chesner", c: "4", i: "58", r: "6.90%", pos: "5.4" },
        { p: "Dr. James Eisdorfer", c: "4", i: "25", r: "16.00%", pos: "7.5" },
        { p: "Dr. Maria Tamay", c: "4", i: "23", r: "17.39%", pos: "7.1" },
        { p: "Meet Our Dentists", c: "3", i: "146", r: "2.05%", pos: "18.0" },
        { p: "Locations", c: "3", i: "93", r: "3.23%", pos: "22.7" },
        { p: "Services", c: "1", i: "84", r: "1.19%", pos: "6.6" },
        { p: "Dr. Dana Kapparova", c: "1", i: "21", r: "4.76%", pos: "10.3" },
        { p: "Dr. Doris Giraldo", c: "1", i: "19", r: "5.26%", pos: "8.2" },
      ],
      devicesChart: {
        title: "Mobile clicks through at more than twice the desktop rate",
        note: "Clicks, appearances, click rate and average position by device. Mobile 6.11% against 7.12%; desktop 2.76% against 2.69%.",
      },
      devices: [
        { d: "Desktop", c: "25", i: "907", r: "2.76%", pos: "46.8" },
        { d: "Mobile", c: "22", i: "360", r: "6.11%", pos: "26.2" },
        { d: "Tablet", c: "0", i: "5", r: "0%", pos: "39.8" },
      ],
      queriesChart: {
        title: "Searches that name the practice or a doctor bring the clicks",
        note: "From the query export, which holds 16 of the 47 clicks and 905 of the appearances. Useful for share; totals come from the daily export.",
      },
      queries: [
        { q: "nyc dental smiles", c: "8", i: "18", r: "44.44%", pos: "1.3" },
        { q: "nyc dental smiles lenox hill", c: "2", i: "5", r: "40.00%", pos: "1.0" },
        { q: "dr ben elchami", c: "1", i: "17", r: "5.88%", pos: "5.4" },
        { q: "dental smiles", c: "1", i: "10", r: "10.00%", pos: "4.7" },
        { q: "dr michael chesner", c: "1", i: "5", r: "20.00%", pos: "3.6" },
        { q: "dr giraldo", c: "1", i: "2", r: "50.00%", pos: "1.0" },
        { q: "dr farahani dentist", c: "1", i: "2", r: "50.00%", pos: "4.5" },
        { q: "new dimension dentistry", c: "1", i: "2", r: "50.00%", pos: "1.0" },
      ],
      brandSplit: {
        title: "Named and general searches",
        note: "Matched on the practice names and doctor surnames. These are shares within the query sample; totals come from the daily export.",
        rows: [
          { k: "Names the practice or a doctor", c: "15", i: "97", r: "15.46%" },
          { k: "General searches", c: "1", i: "808", r: "0.12%" },
        ],
      },
      note:
        "Totals come from Search Console’s daily export, read October 12 and trimmed to October 11. Page, device and query rows include October 12, which added 6 appearances and no clicks. Saturday and Sunday read 1 and 4 clicks and may rise. September 28 – October 4 now reads 45 clicks on 1,190 appearances. Average position is weighted by appearances, 40.8 this week against 43.8. Doctor-page click rate counts all 7 individual doctor pages in both weeks.",
    },

    website: {
      kv: [
        { k: "Sessions", v: "88" },
        { k: "Desktop", v: "73%" },
        { k: "Mobile", v: "25%" },
        { k: "Tablet", v: "2%" },
      ],
      sourcesChart: {
        title: "Where visitors came from",
        note: "Sessions by source. Direct means someone typed the address or used a saved link. Source not recorded means the site did not record where the visit came from.",
      },
      sources: [
        { label: "Source not recorded", value: 33 },
        { label: "Direct", value: 18 },
        { label: "Google — organic", value: 13 },
        { label: "Constant Contact", value: 11 },
        { label: "Wikipedia", value: 3 },
        { label: "Short links", value: 2 },
      ],
      deviceChart: {
        title: "Desktop still leads",
        note: "Share of visitors by device.",
      },
      deviceSplit: [
        { label: "Desktop", pct: 73 },
        { label: "Mobile", pct: 25 },
        { label: "Tablet", pct: 2 },
      ],
      landingChart: {
        title: "Where visitors landed",
        note: "Views by landing page.",
      },
      landing: [
        { label: "Homepage", value: 60 },
        { label: "Meet Our Dentists", value: 38 },
        { label: "Services", value: 24 },
        { label: "About", value: 18 },
        { label: "Locations", value: 10 },
      ],
      note:
        "We are confirming how the site counts visits after recent updates, so this week’s figures may be low and are not compared with last week. No paid advertising ran for NYC Dental Smiles in either week.",
    },

    links: {
      kv: [
        { k: "Booking · all locations", v: "55" },
        { k: "Location pages", v: "26" },
        { k: "Homepage and website", v: "16" },
        { k: "Total", v: "97" },
      ],
      destsChart: {
        title: "Clicks by link",
        note: "The practice’s short links with clicks this week.",
      },
      dests: [
        { label: "Plaza District — booking", value: 18 },
        { label: "Upper East Side — booking", value: 13 },
        { label: "Lenox Hill — booking", value: 13 },
        { label: "Homepage", value: 10 },
        { label: "All locations — booking", value: 9 },
        { label: "Upper East Side — information", value: 9 },
        { label: "Plaza District — information", value: 8 },
        { label: "Lenox Hill — information", value: 7 },
        { label: "Main website", value: 6 },
        { label: "Murray Hill — information", value: 2 },
        { label: "Murray Hill — booking", value: 2 },
      ],
      note:
        "97 clicks this week against 104. Booking links drew 55 against 35, and location information links 26 against 20. Last week included 43 raffle clicks; the raffle has closed. The Smile Pass link is reported in the Smile Pass section.",
    },

    email: {
      window: "October 5 – 11, 2026 · 1 campaign",
      note: "Manhattan Mag Post Event went out on October 8, after the Hudson Yards event. Percentages are calculated on sends.",
      table: {
        head: ["Campaign", "Sends", "Opens", "Clicks"],
        rows: [
          ["Manhattan Mag Post Event", "24", "10 (43%)", "0"],
        ],
      },
      tableInternal: {
        head: ["Campaign", "Sends", "All opens", "Confirmed", "Clicks", "Bounces"],
        rows: [
          ["Manhattan Mag Post Event", "24", "10 (43%)", "—", "0", "1 (4%)"],
        ],
      },
      tableChart: {
        title: "The campaign sent this week",
        note: "From the campaign list view. Confirmed opens to follow.",
      },
    } as null | {
      window: string;
      note: string;
      table: { head: string[]; rows: string[][] };
      tableInternal: { head: string[]; rows: string[][] };
      tableChart: { title: string; note: string };
    },

    facebook: {
      subtitle: "October 5 – 11 · account totals from Metricool",
      kv: [
        { k: "Followers", v: "982" },
        { k: "Views", v: "228" },
        { k: "Page visits", v: "26" },
        { k: "Content published", v: "1" },
      ],
      note:
        "Page visits 26 against 4. Views 228 against 309, on 1 piece against 3. Followers unchanged at 982. At this scale the figures move on single pieces of content and are reported for completeness.",
    },

    method: [
      { q: "What the report covers", a: "October 5 to 11, 2026, 7 full days, Monday to Sunday, compared with September 28 to October 4. Both weeks are the same length, so every comparison is direct." },
      { q: "Where the Instagram totals come from", a: "Metricool’s account-level figures. Per-piece figures are used only to rank content against content." },
      { q: "How engagement rate is calculated", a: "Interactions on posts and reels divided by reach, meaning the share of people who saw something and engaged with it." },
      { q: "Why each week is read the day after it closes", a: "Figures for individual posts keep growing after a week ends. Reading each week the day after it closes means both weeks have had the same time to collect views." },
      { q: "How collab posts are counted", a: "A collab published on Dr. El Chaar’s account is shown alongside NYC Dental Smiles’ own pieces, but its figures are not added to NYC Dental Smiles’ totals." },
      { q: "Why the search figures may change", a: "Google keeps processing search data for several days, so the most recent days of any week are the least settled." },
      { q: "How the doctor page click rate is calculated", a: "All 7 individual doctor pages, counted the same way in both weeks: 20 clicks from 195 appearances this week, 16 from 193 the week before." },
      { q: "How short link clicks are counted", a: "All clicks on the practice’s named short links, counted the same way in both weeks. The Smile Pass link is reported in the Smile Pass section." },
      { q: "Why website figures are not compared this week", a: "Updates were made to the website at the end of September, and the way it counts visits changed from September 29. Until that is confirmed, website figures are shown without a week-to-week comparison, and the daily chart shows clicks from Google instead." },
      { q: "Where the raffle figures come from", a: "Constant Contact’s report for the raffle entry form, which ran from September 22 until the raffle closed." },
      { q: "Where the Social section is", a: "The social lead’s write-up arrives after first review. It is checked figure by figure against the Metricool export before it is added.", internalOnly: true },
      { q: "What is not in this report", a: "No paid advertising ran for NYC Dental Smiles in either week. Story interactions are not in the Instagram export." },
    ] as { q: string; a: string; internalOnly?: boolean; clientOnly?: boolean }[],
  },

  /* ------------------------------------------------------------ SMILE PASS
     A separate overview, not part of the weekly comparison. Lifetime view,
     August 1 – September 27, 2026. Sources: GA4 property "NYC Dental Smiles
     Membership", Meta Ads, Metricool (organic only), Search Console, and the
     website's own sign-up records. See `method`. */
  smilepass: {
    title: "NYC Smile Pass",
    dateLine: "August 1 – September 27, 2026 · since launch",
    lede:
      "An overview of Smile Pass since launch, August 1 – September 27. The August campaign brought 97% of the site’s new visitors, and 1 sign-up has come in. No paid ads have run since August 30, and the site drew 8 new visitors from September 21 to 27. Instagram ad visitors averaged under a second on the site. GA4 has no sign-up tracking yet, so it cannot connect visits to sign-ups.",
    ledeClient:
      "An overview of NYC Smile Pass since launch, from August 1 to September 27. The August launch campaign introduced Smile Pass to 62,053 people and brought more than 2,000 visitors to the site, and 1 sign-up has come in. With a baseline now in place, the next steps focus on turning visits into members.",
    kv: [
      { k: "People reached by ads", v: "62,053" },
      { k: "Landing page views from ads", v: "1,604" },
      { k: "Cost per landing page view", v: "$0.47" },
      { k: "New website visitors", v: "2,128" },
      { k: "Instagram followers", v: "27" },
      { k: "Sign-ups", v: "1" },
    ],
    daily: [
      { d: "Aug 1", v: 0 }, { d: "Aug 2", v: 0 }, { d: "Aug 3", v: 5 }, { d: "Aug 4", v: 10 }, { d: "Aug 5", v: 3 }, { d: "Aug 6", v: 0 },
      { d: "Aug 7", v: 0 }, { d: "Aug 8", v: 4 }, { d: "Aug 9", v: 1 }, { d: "Aug 10", v: 11 }, { d: "Aug 11", v: 117 }, { d: "Aug 12", v: 157 },
      { d: "Aug 13", v: 204 }, { d: "Aug 14", v: 93 }, { d: "Aug 15", v: 31 }, { d: "Aug 16", v: 102 }, { d: "Aug 17", v: 142 }, { d: "Aug 18", v: 113 },
      { d: "Aug 19", v: 111 }, { d: "Aug 20", v: 78 }, { d: "Aug 21", v: 108 }, { d: "Aug 22", v: 128 }, { d: "Aug 23", v: 102 }, { d: "Aug 24", v: 80 },
      { d: "Aug 25", v: 105 }, { d: "Aug 26", v: 91 }, { d: "Aug 27", v: 69 }, { d: "Aug 28", v: 72 }, { d: "Aug 29", v: 109 }, { d: "Aug 30", v: 55 },
      { d: "Aug 31", v: 2 }, { d: "Sep 1", v: 2 }, { d: "Sep 2", v: 0 }, { d: "Sep 3", v: 0 }, { d: "Sep 4", v: 0 }, { d: "Sep 5", v: 0 },
      { d: "Sep 6", v: 0 }, { d: "Sep 7", v: 2 }, { d: "Sep 8", v: 1 }, { d: "Sep 9", v: 0 }, { d: "Sep 10", v: 0 }, { d: "Sep 11", v: 1 },
      { d: "Sep 12", v: 2 }, { d: "Sep 13", v: 0 }, { d: "Sep 14", v: 6 }, { d: "Sep 15", v: 0 }, { d: "Sep 16", v: 0 }, { d: "Sep 17", v: 0 },
      { d: "Sep 18", v: 1 }, { d: "Sep 19", v: 2 }, { d: "Sep 20", v: 0 }, { d: "Sep 21", v: 5 }, { d: "Sep 22", v: 0 }, { d: "Sep 23", v: 1 },
      { d: "Sep 24", v: 1 }, { d: "Sep 25", v: 0 }, { d: "Sep 26", v: 0 }, { d: "Sep 27", v: 1 },
    ],
    dailyChart: {
      title: "Visits peaked during the August campaign",
      /* indices into `daily`: 10 = Aug 11, 29 = Aug 30 */
      band: { from: 10, to: 29, label: "Aug 11 – 30" },
      note:
        "New website visitors each day. 2,067 of the 2,128 arrived between August 11 and 30, 97%. The campaign ended on August 30. The peak was 204 on August 13. From September 1 to 27 the site drew 25.",
      noteClient:
        "New website visitors each day. Most arrived between August 11 and 30, during the launch campaign. September has been quieter without paid ads running, as expected for a new site still building its search and social presence.",
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
        "1 campaign, August 2026 First Month Free, with a $750 lifetime budget, ending August 30. No paid ads have run since. It was set to optimize for landing page views, not sign-ups, and delivered those cheaply. Meta ranks both ads’ conversion rate in the bottom 35% of ads; quality is average. The No Insurance ad had the higher click rate and cheaper views but received 18% of the budget. People reached counts each person once, so the 2 ad rows add up to more than the campaign total. Meta counts 1,604 landing page views; Google Analytics recorded 2,068 visits from the ads, because the 2 measure a visit differently.",
      noteClient:
        "1 campaign ran, with a $750 budget, and ended on August 30. It was set up to bring people to the site, and it did so at 47 cents a visit. The No Insurance message drew a higher click rate than the general one. People reached counts each person once, so the 2 ads add up to more than the campaign total. Meta counts 1,604 landing page views, while Google Analytics recorded 2,068 visits from the ads; the 2 tools measure a visit slightly differently.",
    },
    sources: {
      title: "How visitors engaged, by source",
      table: {
        head: ["Source", "Visits", "Share that engaged", "Average time on site"],
        rows: [
          ["Instagram ads", "1,638", "3.7%", "0.7 seconds"],
          ["Facebook ads", "430", "10.9%", "4.7 seconds"],
          ["Direct", "79", "22.8%", "8.3 seconds"],
          ["Instagram and Facebook, unpaid", "29", "41.4%", "9.0 seconds"],
          ["Google search", "20", "40.0%", "10.7 seconds"],
        ],
      },
      note:
        "Instagram ad visitors, 1,638 of the 2,202 visits, engaged 3.7% of the time and averaged 0.7 seconds. Facebook ad visitors engaged 3 times as often. Paid visits have not changed since September 20, which fits no paid ads running. Bing (3) and unassigned (3) are not shown.",
      noteClient:
        "A visit counts as engaged if it lasted at least 10 seconds or included a second page. Visitors from Google, direct visits and Facebook ads spent the most time on the site; Instagram ad visits were typically brief. Sources with fewer than 5 visits are not shown.",
    },
    social: {
      title: "Smile Pass on social",
      table: {
        head: ["", "Instagram", "Facebook"],
        rows: [
          ["Followers", "27 · up 11", "4 · up 4"],
          ["Pieces published", "31 · 16 posts, 6 reels, 9 Stories", "11 · 5 posts, 6 reels"],
          ["Average reach per post", "42", "6"],
          ["Reels", "788 views · 104 average reach", "876 video views"],
          ["Strongest piece", "Sep 17 reel · 339 views · 276 reach", "—"],
        ],
      },
      note:
        "Unpaid content only. Metricool’s account-level reach and view totals include delivery from the ad campaign, so they are not used: Facebook reports 22.89K views on an account with 4 followers. The strongest organic piece is still the September 17 reel, “Be honest: when was your last dentist appointment?”, with 339 views and 276 reach. 2 reels went out this week: September 22 with 74 views and September 24 with 137.",
      noteClient:
        "Unpaid posts only. Both accounts are in their first weeks, and Instagram has grown to 27 followers, up 11. The strongest post was the September 17 reel asking when you last saw a dentist, with 339 views.",
    },
    search: {
      title: "Search",
      kv: [
        { k: "Clicks from Google", v: "4" },
        { k: "Appearances in Google", v: "152" },
        { k: "Most common search", v: "“nyc dental smiles”" },
      ],
      note:
        "8 weeks of Search Console data. Of the searches Google reports, 66 appearances were for “nyc dental smiles” and none mentioned Smile Pass by name. “dental membership plan nyc” appeared 4 times. Google withholds low-volume searches, so the list covers 72 of the 152 appearances.",
      noteClient:
        "Search presence is still early for a new site. Most of the searches that showed Smile Pass were for the NYC Dental Smiles name.",
    },
    findings: {
      title: "What we learned from the launch",
      items: [
        {
          t: "The ads brought people in cheaply",
          b: "1,604 landing page views at 47 cents each, and 62,053 people reached. The campaign was set to find people likely to open the page, and that is what it delivered.",
          client: { t: "The launch campaign reached a wide audience", b: "62,053 people saw the ads and 1,604 visited the site from them, at 47 cents a visit." },
        },
        {
          t: "Visits have not yet turned into sign-ups",
          b: "1 sign-up across 2,128 new visitors and $749.85 in ad spend. Instagram ad visits averaged 0.7 seconds and 3.7% engaged, and Meta rates both ads’ conversion in the bottom 35%.",
          client: { t: "Turning visits into sign-ups is the next focus", b: "1 sign-up has come in so far. Most ad visitors left quickly without continuing to the sign-up page, which shows where to focus next." },
        },
        {
          t: "Facebook ad visitors were more engaged than Instagram’s",
          b: "10.9% of Facebook ad visits engaged against 3.7% from Instagram, averaging 4.7 seconds against 0.7. Instagram took 79% of the ad visits.",
          client: { t: "Facebook ad visitors stayed longer", b: "Visitors from Facebook ads were 3 times as likely to engage as visitors from Instagram ads, and stayed longer on the site." },
        },
        {
          t: "Traffic follows the ads for now",
          b: "25 new visitors from September 1 to 27. Search drew 4 clicks in 8 weeks and the social accounts have 27 and 4 followers, so there is no steady source of visitors yet.",
          client: { t: "Search and social are still building", b: "As a new program, Smile Pass is still building its own search and social presence, so most visits so far have come from the campaign." },
        },
        {
          t: "GA4 cannot see sign-ups",
          b: "No sign-up event is set up, so GA4 shows zero regardless of what happens. The 1 sign-up is from the website’s own records. Setting this up is the first step for the next campaign, and it lets Meta optimize for sign-ups.",
          client: { t: "Every sign-up is counted", b: "The website records each sign-up, and that is the count shown here. We are now connecting sign-ups to Google Analytics and Meta as well, so future reports can show which visits and ads led to each one." },
        },
      ],
    },
    next: {
      title: "What we’d do next",
      items: [
        { t: "Track sign-ups in Google Analytics and Meta", b: "Record each completed sign-up as a key event, so every future report and campaign is measured on sign-ups rather than visits." },
        { t: "Set the next campaign to optimize for sign-ups", b: "The August campaign was set to find people likely to open the page. Once sign-ups are tracked, Meta can look for people likely to join instead." },
        { t: "Review the path from ad to sign-up", b: "Most ad visits were brief. Walking through each step from the ad to a completed sign-up on a phone will show where to make joining easier." },
        { t: "Lead with the No Insurance message", b: "It drew a higher click rate, 3.12% against 2.49%, at a lower cost per visit, on 18% of the budget." },
        { t: "Introduce Smile Pass to NYC Dental Smiles’ audience", b: "NYC Dental Smiles has 774 Instagram followers and 130 to 160 website visits a week. Smile Pass has 27 followers. Shared posts and links from the main practice reach people who already know it." },
      ],
    },
    method:
      "New visitor totals come from GA4’s daily series, August 1 – September 27. Visits by source cover the same dates. Ad figures are Meta’s August export; the campaign spent its full $750 lifetime budget and ended August 30, and no paid ads have run since, confirmed September 28. Social figures are organic only, because Metricool’s account totals include ad delivery. Search covers August 1 – September 27. The sign-up count is from the website’s own records, not GA4, and had not changed as of September 28. 4 files in this cycle’s export named for Smile Pass belonged to the NYC Dental Smiles property and were used for the weekly report instead.",
    methodClient:
      "Figures cover August 1 to September 27, 2026. Website figures are from Google Analytics, ad figures from Meta, social figures from Metricool and search figures from Google Search Console. The sign-up count is from the website’s own records. Social figures cover unpaid posts only.",
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
  { k: "Instagram", v: "Oct 5 – 11", p: "Account-level figures from Metricool, against Sep 28 – Oct 4." },
  { k: "Facebook", v: "Oct 5 – 11", p: "Account-level figures from Metricool." },
  { k: "Search", v: "Oct 5 – 11", p: "Against Sep 28 – Oct 4. The last days of this week may still rise." },
  { k: "Website", v: "Oct 5 – 11", p: "Under review. Shown without a comparison." },
  { k: "Short links", v: "Oct 5 – 11", p: "All named NYC Dental Smiles links, counted the same way in both weeks." },
  { k: "Email", v: "Oct 8", p: "1 campaign, Manhattan Mag Post Event." },
  { k: "Raffle form", v: "Sep 22 – close", p: "Constant Contact entry form. The raffle has closed." },
  { k: "Smile Pass", v: "Aug 1 – Sep 27", p: "An overview of activity since launch, separate from the weekly figures." },
];
