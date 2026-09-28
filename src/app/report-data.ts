/* ==========================================================================
   REPORT DATA  ·  NYC Dental Smiles
   --------------------------------------------------------------------------
   The only file that changes between reporting cycles. Edit the figures and
   narrative strings here. page.tsx changed this cycle only to hide the Email
   panel when `detail.email` is null.

   THIS CYCLE — a single week.
     September 21 – 27 against September 14 – 20: two 7-day windows, Monday to
     Sunday, directly comparable. All exports read September 28.

   READ-DATE RULE (new this cycle).
     Metricool per-piece figures for posts and reels are lifetime totals and
     keep growing after a week closes. Last week's per-piece figures are the
     September 21 reading, taken 1 day after close, the same lag as this
     week's. Account-level figures (views, reach, engaged, followers) and GA4
     are taken from the September 28 reading for both weeks.

   SOCIAL — hidden until the social lead's write-up arrives after first
     review. Removed from ALL_SECTIONS; the data object is kept empty so
     page.tsx still compiles.

   EMAIL — no campaigns this cycle. `detail.email` is null and the panel does
     not render.

   SMILE PASS — lifetime view, August 1 – September 27. No ads since
     August 30 and no new sign-ups, both confirmed September 28.

   ENCODING — literal characters for apostrophes, dashes and the minus sign.
     No backslash-u escapes anywhere in the strings.

   Nothing here is estimated or inferred. Every value is carried from a source
   export, or is plain arithmetic on two figures already present.

   SOURCE WINDOWS:
     Instagram, Facebook (Metricool)  Sep 21 – 27 and Sep 14 – 20, 2026
     Search Console                   Sep 21 – 27 and Sep 14 – 20, 2026
     Website (GA4)                    Sep 21 – 27 and Sep 14 – 20, 2026
     Short links (Short.io)           Sep 21 – 27 and Sep 14 – 20, 2026
     Smile Pass                       Aug 1 – Sep 27, 2026
   ========================================================================== */

type Variant = "client" | "internal";

export const VARIANT: Variant =
  process.env.NEXT_PUBLIC_REPORT_VARIANT === "internal" ? "internal" : "client";
export const IS_INTERNAL: boolean = VARIANT === "internal";

export const REPORT = {
  client: { name: "NYC Dental Smiles", short: "NYCDS", agency: "Figment Creative" },

  period: {
    label: "September 21 – 27, 2026",
    length: "7 days",
    comparedWith: "the 7 days before it (September 14 – 20)",
    paidStatus:
      "No paid advertising ran in either week. Both are 7 days, Monday to Sunday, so every comparison is direct.",
  },

  copy: {
    scoreboard: {
      title: "The numbers that matter, and what each one means",
      lede: "10 measures, this week against the week before.",
    },
    worked: {
      title: "A reel about knowing each patient led the week",
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
    head: "Instagram held most of last week’s level without a standout reel. Views were 3,949 against 4,382, and last week’s figure included 2,464 from Dr. Tamay’s reel alone. Set that reel aside and last week was 1,916.",
    headClient: "A steady week on Instagram. 3,949 views, 10 new followers and 12 pieces published, with the week’s views spread across several posts rather than one.",
    items: [
      {
        role: "The outcome",
        text: "Views 4,382 to 3,949, down 10%. Daily reach 239 to 228. Interactions 198 to 127 and engagement rate 11.84% to 7.96%; last week the Tamay reel alone drew 163 interactions. The top piece this week drew 1,040 views, 26% of the total. Followers rose by 10 against 4.",
        client: {
          role: "The standout",
          text: "The reel about getting to know each patient was the week’s strongest piece: 1,040 views and 640 accounts reached. Instagram added 10 followers, against 4 the week before.",
        },
      },
      {
        role: "Strongest signal",
        text: "Doctor pages drew 22 search clicks from 151 appearances, 14.6%, against 13.3%. Dr. Chesner’s page led with 7 clicks and 10 website landings, up from 1, with no Chesner post or reel published. The exports show both together, not what drove them.",
        client: {
          role: "The wider picture",
          text: "People searching for the doctors keep finding them. The doctor pages turned 14.6% of their Google appearances into clicks, against 4.8% across the site. Dr. Chesner’s page drew the most.",
        },
      },
      {
        role: "What softened",
        text: "Website sessions 163 to 131, new visitors 111 to 96. Google visits in GA4 51 to 43, Search Console clicks 55 to 53. Desktop search click rate fell from 5.23% to 3.18% while mobile rose from 5.18% to 8.75%. Saturday and Sunday read 1 and 4 clicks and may rise.",
        client: {
          role: "What we are monitoring",
          text: "The website drew 96 new visitors, against 111 the week before, with the largest gap on Monday. Google is still processing the last days of the week, so search figures may rise.",
        },
      },
      {
        role: "Next action",
        text: "Fix the Short.io path filter: it has been missing 3 allowlist paths, and last cycle’s filter left out 2 booking links that were reported as drawing none. Make the next doctor-led reel. Read Metricool the day after each week closes and share that rule with the social lead.",
        client: {
          role: "What we are doing next",
          text: "We will keep producing doctor-led content, and we have tightened how the booking link figures are collected so every location is counted the same way.",
        },
      },
    ] as { role: string; text: string; client?: { role: string; text: string } }[],
  },

  /* ------------------------------------------------------------ SCOREBOARD */
  scoreboard: [
    {
      metric: "Instagram views",
      value: "3,949",
      sub: "Account total, Metricool",
      dir: "down",
      change: "4,382 the week before · −10%",
      reading: "Last week included 2,464 views from a single reel. This week’s top piece drew 1,040, and the rest were spread across posts, reels and Stories.",
      tone: "",
    },
    {
      metric: "Instagram reach per day",
      value: "228",
      sub: "Average accounts reached each day",
      dir: "down",
      change: "239 the week before · −5%",
      reading: "Close to last week’s level, which had more than doubled in the week of the Tamay reel.",
      tone: "",
    },
    {
      metric: "Instagram interactions",
      value: "127",
      sub: "Likes, comments, saves and shares on posts and reels",
      dir: "down",
      change: "198 the week before",
      reading: "Last week 163 came from a single reel. This week the top reel drew 81.",
      tone: "",
    },
    {
      metric: "Engagement rate",
      value: "7.96%",
      sub: "Interactions divided by reach",
      dir: "down",
      change: "11.84% the week before",
      reading: "Last week’s rate was lifted by a single reel at 14.8%. This week’s top reel engaged 12.7% of the people it reached.",
      tone: "",
    },
    {
      metric: "Followers",
      value: "774",
      sub: "At the end of the week",
      dir: "up",
      change: "+10 this week · +4 the week before",
      reading: "More than double the week before’s gain.",
      tone: "tone-good",
    },
    {
      metric: "Booking link clicks",
      value: "107",
      sub: "All 4 locations",
      dir: "down",
      change: "145 the week before · −26%",
      reading: "Lenox Hill 32, Plaza District 31, Upper East Side 30, Murray Hill 14. Most link clicks this week were automated, so treat this as a rough guide.",
      tone: "",
    },
    {
      metric: "Search click rate",
      value: "4.76%",
      sub: "Share of people who saw the site in Google and clicked",
      dir: "down",
      change: "5.21% the week before",
      reading: "Google showed the site more often, 1,113 times against 1,055, and clicks held close to last week.",
      tone: "",
    },
    {
      metric: "Search clicks",
      value: "53",
      sub: "From Google",
      dir: "flat",
      change: "55 the week before",
      reading: "Google is still processing the last days of this week, so this figure may rise.",
      tone: "",
    },
    {
      metric: "Doctor page click rate",
      value: "14.6%",
      sub: "All 7 doctor pages, Google search",
      dir: "up",
      change: "13.3% the week before",
      reading: "22 clicks from 151 appearances. Dr. Chesner’s page drew 7, the most of any page after the homepage.",
      tone: "tone-good",
    },
    {
      metric: "Website new visitors",
      value: "96",
      sub: "Google Analytics",
      dir: "down",
      change: "111 the week before · −14%",
      reading: "14 a day against 16. The largest daily gap was Monday: 10 against 17.",
      tone: "",
    },
  ],

  /* -------------------------------------------- THE PERIOD LINE (signature) */
  periodLine: {
    title: "New website visitors eased this week",
    note:
      "New website visitors each day across both weeks. No paid advertising ran in either week.",
    /* GA4 daily new visitors, Sep 14 – 27, read September 28. Sep 14 – 20
       restated from 109 to 111 since the September 21 pull (Sep 20: 9 to 11). */
    series: [
      { d: "Sep 14", v: 17 }, { d: "Sep 15", v: 14 }, { d: "Sep 16", v: 19 },
      { d: "Sep 17", v: 22 }, { d: "Sep 18", v: 19 }, { d: "Sep 19", v: 9 },
      { d: "Sep 20", v: 11 }, { d: "Sep 21", v: 10 }, { d: "Sep 22", v: 15 },
      { d: "Sep 23", v: 16 }, { d: "Sep 24", v: 20 }, { d: "Sep 25", v: 16 },
      { d: "Sep 26", v: 9 }, { d: "Sep 27", v: 10 },
    ],
    /* Index of the last day of the previous week (Sep 20). */
    splitAt: 6,
    shade: null as { through: number; label: string } | null,
    markers: [] as { i: number; label: string }[],
    /* derived: 111 ÷ 7 = 15.9; 96 ÷ 7 = 13.7 */
    bands: [
      { label: "September 14 – 20", value: "16 a day", detail: "Previous week" },
      { label: "September 21 – 27", value: "14 a day", detail: "This week" },
    ],
    read: {
      title: "Reading this fairly:",
      body: "Both weeks are 7 days with no paid advertising. New visitors went from 16 a day to 14. The largest daily gap is Monday, 10 against 17. Tuesday through Friday ran 15 to 20 a day, and both weekends were quiet.",
    },
  },

  /* ----------------------------------------------------------- WHAT WORKED */
  worked: {
    /* Internal build only. */
    lede: "No single piece carried the week. The reel on getting to know each patient led with 1,040 views, 640 accounts reached and 81 interactions, 26% of the week’s views. Doctor pages drew more search clicks, led by Dr. Chesner’s.",
    lead: {
      kind: "Reel",
      title: "Great dental care starts with knowing the person behind the smile",
      date: "September 23",
      url: "https://www.instagram.com/reel/DdpAub1p424/",
      why:
        "1,040 views and 640 accounts reached, with 81 interactions, 12.7% of the people it reached. Like Dr. Tamay’s reel last week, it is about how patients are treated rather than a procedure.",
      repeatable:
        "Dr. Farahani’s reel on restoring function and confidence followed with 598 views and 33 interactions. The Hudson Yards event post drew 561 views and 13 interactions.",
    },
    gallery: [
      {
        title: "Great dental care starts with knowing the person behind the smile", format: "Reel", date: "Sep 23",
        url: "https://www.instagram.com/reel/DdpAub1p424/",
        views: "1,040", reach: "640", er: "12.7%", lead: true,
      },
      {
        title: "A stable, healthy smile can change more than the way you look", format: "Reel", date: "Sep 24",
        url: "https://www.instagram.com/reel/Ddrpof5x8y2/",
        views: "598", reach: "389", er: "8.5%", lead: false,
      },
      {
        title: "We’re heading to Hudson Yards", format: "Post", date: "Sep 25",
        url: "https://www.instagram.com/p/DduFG7WFgDs/",
        views: "561", reach: "200", er: "6.5%", lead: false,
      },
    ],
    galleryNote:
      "All 3 feed pieces published September 21 – 27, ranked by views. 9 Stories complete the 12. Engagement is interactions divided by reach. These are per-piece figures and will not add up to the account totals, which Metricool measures separately.",
    channel: {
      title: "Search: doctor pages drew more clicks",
      body:
        "Doctor pages drew 22 clicks from 151 appearances, 14.6%, against 13.3% the week before. Dr. Chesner’s page led with 7. Across the site, clicks were 53 against 55 and appearances 1,113 against 1,055. On mobile, click rate rose from 5.18% to 8.75%; on desktop it fell from 5.23% to 3.18%.",
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
      title: "The short link filter has not matched the allowlist",
      body:
        "This week’s filter held 9 paths: 8 of the 11 on the allowlist plus the LinkedIn link. It was missing /NYCDS-35thStreet, /nycds-website and /all-locations-booking-weave, which Short.io’s path menu does not list. Last cycle’s filter was missing /58th-booking-weave and /murray-hill-booking, and the report said those 2 drew no clicks in either week. On the all-clicks basis they drew 39 and 13 in September 14 – 20.",
      so:
        "The Plaza District and Murray Hill booking buttons were never broken; the filter left them out. All 4 booking links are in this week’s filter, so the booking comparison is complete. The 3 missing paths are 1 information link, the main website link and the all-locations link. Short.io’s unfiltered view is not usable for this: it reports 364 total clicks for September 14 – 20, but its path list sums to 144 and its daily series to 157, its human-click figure, and it shows /ues-booking-weave at 14 against 49 filtered.",
    },
    {
      tag: "limitation",
      title: "Metricool’s per-piece figures keep growing after a week closes",
      body:
        "Read September 21, last week’s reels showed 176 interactions and the Tamay reel 2,464 views. Read September 28, the same week shows 180 and 2,680. Account-level views moved only from 4,380 to 4,382. This report compares per-piece figures at the same lag: each week read the day after it closed.",
      so:
        "A reader who pulls Metricool on a different day will get different per-piece figures from the same view. That is the likeliest reason the social update has not matched the export. Share the read-day rule with the social lead.",
    },
    {
      tag: "expected",
      title: "Instagram eased back after the Tamay week, less than expected",
      body:
        "Views 4,382 to 3,949, down 10%. Last week’s total included 2,464 from a single reel; without it, last week was 1,916. This week’s top piece drew 1,040, 26% of the total. Interactions fell from 198 to 127 and engagement rate from 11.84% to 7.96%, because the Tamay reel alone drew 163.",
      so:
        "The drop the last report warned about was smaller than it suggested. Views spread across more pieces this week, 12 against 7, most of them Stories.",
    },
    {
      tag: "early",
      title: "Search clicks moved from desktop to mobile",
      body:
        "Desktop click rate fell from 5.23% to 3.18%, 38 clicks to 25, on more appearances, 785 against 726. Mobile rose from 5.18% to 8.75%, 17 clicks to 28. Total clicks held at 53 against 55.",
      so:
        "1 week of movement in each direction. Worth watching for a second week before reading anything into it.",
    },
    {
      tag: "limitation",
      title: "The last days of search have not settled",
      body:
        "Daily clicks: 11, 9, 10, 14, 4, then 1 on Saturday and 4 on Sunday. September 14 – 20 did not change between its September 21 and September 28 readings, so last cycle’s re-pull would not have moved anything. September 7 – 13 did rise, from 41 to 45.",
      so:
        "Next cycle’s pull re-reads this week as its comparison column, which settles it without a separate midweek re-pull.",
    },
    {
      tag: "limitation",
      title: "Most short link clicks this week were automated",
      body:
        "Identified crawlers and bots account for at least 82 of this week’s 161 clicks: a Chinese search crawler 53, a generic crawler 11, Slack link previews 7, other bots 11. China accounts for 60 clicks. Short.io’s own label counts 30 as human, against 114 of 273 the week before; the report does not rely on that label, which has misclassified scanner traffic before. No country filter applied to either export.",
      so:
        "The automated share rose this week, so the week-to-week change in link clicks is approximate in either direction. The client build calls the figure a rough guide. A United States country filter, tested next cycle, would take most of it out.",
    },
  ],

  /* --------------------------------------------------------- WHAT WE LEARNED */
  learned: [
    { f: "1,040", u: "views on the week’s top reel", t: "about getting to know each patient. No single piece carried the week: it was 26% of views, against 56% for Dr. Tamay’s reel the week before." },
    { f: "3,949", u: "Instagram views", t: "against 4,382 the week before. Without last week’s standout reel, that week drew 1,916." },
    { f: "+10", u: "Instagram followers", t: "to 774, against +4 the week before." },
    { f: "14.6%", u: "click rate on doctor pages", t: "up from 13.3%, against 4.8% across the site. Doctor pages are still the part of the site that converts best in search." },
    { f: "7", u: "search clicks to Dr. Chesner’s page", t: "the most of any doctor page, and 10 website visits began there, up from 1." },
    { f: "107", u: "booking link clicks", t: "across all 4 locations, against 145 the week before. Every location drew clicks in both weeks, including Murray Hill and Plaza District." },
  ],

  /* ------------------------------------------------------------- NEXT MOVES */
  moves: [
    {
      action: "Fix the short link filter to the full allowlist",
      why: "3 allowlist paths are missing from this week’s filter, and last cycle’s filter left out 2 booking links that were then reported as drawing none. Short.io’s path menu does not list every path, so the missing ones have to be typed in.",
      owner: "Reporting — Figment",
      measure: "All 11 paths present in the filter screenshot filed with each export.",
    },
    {
      action: "Make the next doctor-led reel",
      why: "The 2 strongest reels in 2 weeks were about how patients are treated: Dr. Tamay’s reached 1,102 accounts and this week’s reached 640.",
      owner: "Social — Figment",
      measure: "Reach on the next doctor-led reel, against 640 and 1,102.",
    },
    {
      action: "Feature Dr. Chesner",
      why: "His page drew 7 search clicks and 10 website visits began there this week, the most of any doctor, with no Chesner post or reel published. A reel would show whether content adds to a page already drawing search.",
      owner: "Social — Figment",
      measure: "Visits to Dr. Chesner’s page in the week the reel runs, against 10.",
    },
    {
      action: "Share the Metricool read-day rule with the social lead",
      why: "Per-piece figures keep growing after a week closes. Reading on different days gives different numbers from the same view.",
      owner: "Social — Figment",
      measure: "Next week’s social update matching the export without changes.",
    },
    {
      action: "Give the Hudson Yards event its own tracked link",
      why: "The October 4 event post drew 561 views. A dedicated link would show how many people act on it.",
      owner: "Social — Figment",
      measure: "Clicks on the event link in the next report.",
    },
    {
      action: "Confirm what /raffle is",
      why: "A new short link, /raffle, drew 11 clicks this week, the most of any path on an unfiltered view. It is not on the allowlist and is not counted.",
      owner: "Account — Figment",
      measure: "A decision on whether it belongs in the NYCDS count.",
    },
  ],

  /* ---------------------------------------------------------------- DETAIL */
  detail: {
    subtitles: {
      instagram: "September 21 – 27 · account totals from Metricool",
      search: "September 21 – 27 · Google Search Console",
      website: "September 21 – 27 · Google Analytics",
      links: "September 21 – 27 · Short.io",
    },

    instagram: {
      kv: [
        { k: "Views", v: "3,949" },
        { k: "Reach per day", v: "228" },
        { k: "Accounts engaged", v: "133" },
        { k: "Followers", v: "774" },
        { k: "Content published", v: "12" },
        { k: "Interactions", v: "127" },
      ],
      publishedChart: {
        title: "What was published",
        note: "12 pieces against 7 the week before: 9 Stories against 4, with the same 2 reels and 1 post.",
      },
      published: [
        { label: "Stories", value: 9 },
        { label: "Reels", value: 2 },
        { label: "Feed posts", value: 1 },
      ],
      postsChart: {
        title: "The 3 feed pieces published this week",
        note: "Ranked by views. Engagement is interactions divided by reach.",
      },
      posts: [
        { t: "Great dental care starts with knowing the person behind the smile", f: "Reel", d: "Sep 23", v: "1,040", r: "640", i: "81", e: "12.7%" },
        { t: "A stable, healthy smile can change more than the way you look", f: "Reel", d: "Sep 24", v: "598", r: "389", i: "33", e: "8.5%" },
        { t: "We’re heading to Hudson Yards", f: "Post", d: "Sep 25", v: "561", r: "200", i: "13", e: "6.5%" },
      ],
      interactionsChart: {
        title: "Reels drew most of the interactions",
        note: "127 interactions on posts and reels. The top reel drew 81 of the 114 reel interactions.",
      },
      interactions: [
        { label: "Reels", value: 114 },
        { label: "Feed posts", value: 13 },
      ],
      viewsChart: {
        title: "Views by format",
        note: "From Metricool’s format summaries. Stories are shown as impressions. These are not summed; the account total of 3,949 is measured separately.",
      },
      viewsByFormat: [
        { label: "Reels", value: 1638 },
        { label: "Stories", value: 626 },
        { label: "Feed posts", value: 561 },
      ],
      storiesTitle: "Stories",
      stories:
        "9 Stories drew 626 impressions, against 239 from 4 the week before. Average reach per Story rose from 54 to 62.",
      note:
        "Account totals are Metricool’s account-level figures, read September 28 for both weeks. Last week’s views are restated from 4,380 to 4,382. Per-piece figures for posts and reels are lifetime totals that keep growing after a week closes, so last week’s are the September 21 reading, taken 1 day after close like this week’s. Read September 28, last week’s reels show 180 interactions and the Tamay reel 2,680 views. Engagement rate is interactions on posts and reels divided by reach: 127 against 1,596 this week and 198 against 1,673 the week before. Story interactions are not in the export. Metricool shows 10 followers acquired and 1 lost, which nets to 9, while the count rose by 10, from 764 to 774; the report uses the count. No paid advertising ran in either week.",
      clientNote:
        "Account totals come from Metricool’s account-level figures rather than a sum of individual posts. Figures for individual posts keep growing after a week ends, so each week is read the day after it closes. Engagement rate is interactions divided by reach. No paid advertising ran in either week.",
    },

    search: {
      kv: [
        { k: "Clicks", v: "53" },
        { k: "Impressions", v: "1,113" },
        { k: "Click rate", v: "4.76%" },
      ],
      impressionsChart: {
        title: "Impressions per day",
        note: "Daily appearances in Google results across the week.",
      },
      impressionsSeries: [
        { d: "Sep 21", v: 274 }, { d: "Sep 22", v: 169 }, { d: "Sep 23", v: 170 },
        { d: "Sep 24", v: 128 }, { d: "Sep 25", v: 119 }, { d: "Sep 26", v: 121 },
        { d: "Sep 27", v: 132 },
      ],
      pagesChart: {
        title: "The homepage collects the appearances; the doctor pages collect the clicks",
        note: "Clicks, appearances, click rate and average position by page. The 7 doctor pages together drew 22 clicks from 151 appearances.",
      },
      pages: [
        { p: "Homepage", c: "29", i: "859", r: "3.38%", pos: "46.8" },
        { p: "Dr. Michael Chesner", c: "7", i: "44", r: "15.91%", pos: "4.8" },
        { p: "Dr. James Eisdorfer", c: "5", i: "21", r: "23.81%", pos: "6.4" },
        { p: "Dr. Maria Tamay", c: "3", i: "18", r: "16.67%", pos: "4.2" },
        { p: "Dr. Ben Elchami", c: "2", i: "21", r: "9.52%", pos: "10.3" },
        { p: "Dr. Doris Giraldo", c: "2", i: "16", r: "12.50%", pos: "8.7" },
        { p: "Dr. Sherman Farahani", c: "2", i: "11", r: "18.18%", pos: "5.1" },
        { p: "Dr. Dana Kapparova", c: "1", i: "20", r: "5.00%", pos: "5.4" },
        { p: "Meet Our Dentists", c: "1", i: "172", r: "0.58%", pos: "42.2" },
        { p: "Locations", c: "1", i: "77", r: "1.30%", pos: "12.1" },
      ],
      devicesChart: {
        title: "Mobile click rate rose as desktop fell",
        note: "Clicks, appearances, click rate and average position by device. Mobile went from 5.18% to 8.75%, desktop from 5.23% to 3.18%.",
      },
      devices: [
        { d: "Mobile", c: "28", i: "320", r: "8.75%", pos: "30.5" },
        { d: "Desktop", c: "25", i: "785", r: "3.18%", pos: "49.9" },
        { d: "Tablet", c: "0", i: "8", r: "0%", pos: "3.8" },
      ],
      queriesChart: {
        title: "Searches that name the practice or a doctor bring the clicks",
        note: "From the query export, which holds 14 of the 53 clicks and 781 of the 1,113 appearances. Useful for share, not for totals.",
      },
      queries: [
        { q: "nyc dental smiles", c: "10", i: "18", r: "55.56%", pos: "1.3" },
        { q: "nyc smiles", c: "2", i: "5", r: "40.00%", pos: "3.8" },
        { q: "doris giraldo", c: "1", i: "1", r: "100.00%", pos: "1.0" },
        { q: "next dimension dentistry", c: "1", i: "1", r: "100.00%", pos: "13.0" },
      ],
      brandSplit: {
        title: "Named and general searches",
        note: "Matched on the practice names and doctor surnames. Shares within the query sample, not totals.",
        rows: [
          { k: "Names the practice or a doctor", c: "13", i: "73", r: "17.81%" },
          { k: "General searches", c: "1", i: "708", r: "0.14%" },
        ],
      },
      note:
        "Totals come from Search Console’s daily export, read September 28. Saturday and Sunday read 1 and 4 clicks and may rise. September 14 – 20 was re-read on September 28 and had not changed from its September 21 reading: 55 clicks on 1,055 appearances. Average position is weighted by appearances across all traffic, 44.0 this week against 46.0. Doctor-page click rate counts all 7 individual doctor pages in both weeks.",
    },

    website: {
      kv: [
        { k: "Sessions", v: "131" },
        { k: "New visitors", v: "96" },
        { k: "Desktop", v: "76%" },
        { k: "Mobile", v: "24%" },
      ],
      sourcesChart: {
        title: "Where visitors came from",
        note: "Sessions by source. Direct means someone typed the address or used a saved link.",
      },
      sources: [
        { label: "Direct", value: 63 },
        { label: "Google — organic", value: 43 },
        { label: "Instagram", value: 6 },
        { label: "Constant Contact", value: 3 },
        { label: "Yahoo — organic", value: 3 },
        { label: "Bing — organic", value: 2 },
      ],
      deviceChart: {
        title: "Desktop still leads",
        note: "Share of visitors by device, against 79% and 21% the week before.",
      },
      deviceSplit: [
        { label: "Desktop", pct: 76 },
        { label: "Mobile", pct: 24 },
      ],
      landingChart: {
        title: "Where visitors landed",
        note: "Views by landing page. Dr. Chesner’s page drew 10, up from 1.",
      },
      landing: [
        { label: "Homepage", value: 117 },
        { label: "Meet Our Dentists", value: 25 },
        { label: "Locations", value: 13 },
        { label: "Dr. Michael Chesner", value: 10 },
        { label: "Why NYC Dental Smiles", value: 10 },
        { label: "Cosmetic Dentistry", value: 8 },
      ],
      note:
        "No paid advertising ran in either week. Last week is restated from 162 sessions and 109 new visitors to 163 and 111. Visits from Google went from 51 to 43, and Search Console clicks from 55 to 53.",
    },

    links: {
      kv: [
        { k: "Booking · all 4 locations", v: "107" },
        { k: "Location pages", v: "40" },
        { k: "Homepage link", v: "14" },
        { k: "Total", v: "161" },
      ],
      destsChart: {
        title: "Clicks by link",
        note: "The practice’s short links with clicks this week. Every booking link drew clicks.",
      },
      dests: [
        { label: "Lenox Hill — booking", value: 32 },
        { label: "Plaza District — booking", value: 31 },
        { label: "Upper East Side — booking", value: 30 },
        { label: "Plaza District — information", value: 15 },
        { label: "Murray Hill — booking", value: 14 },
        { label: "Homepage", value: 14 },
        { label: "Lenox Hill — information", value: 13 },
        { label: "Upper East Side — information", value: 12 },
      ],
      note:
        "161 clicks this week against 270. Booking links drew 107 against 145, and location information links 40 against 73. Last week’s report showed no clicks on the Murray Hill and Plaza District booking links; they were missing from the collection filter, and the corrected figures for that week are 13 and 39. At least half of this week’s clicks came from automated sources, a larger share than last week, so the totals run well above real visits.",
    },

    /* No campaigns this cycle. page.tsx renders the Email panel only when
       this is not null. */
    email: null as null | {
      window: string;
      note: string;
      table: { head: string[]; rows: string[][] };
      tableInternal: { head: string[]; rows: string[][] };
      tableChart: { title: string; note: string };
    },

    facebook: {
      subtitle: "September 21 – 27 · account totals from Metricool",
      kv: [
        { k: "Followers", v: "982" },
        { k: "Views", v: "207" },
        { k: "Page visits", v: "15" },
        { k: "Content published", v: "3" },
      ],
      note:
        "Views 207 against 111, on 3 pieces against 2. Followers 982 against 981. Last week’s views are restated from 108 to 111. At this scale the figures move on single pieces of content and are reported for completeness.",
    },

    method: [
      { q: "What the report covers", a: "September 21 to 27, 2026, 7 full days, Monday to Sunday, compared with September 14 to 20. Both weeks are the same length, so every comparison is direct." },
      { q: "Where the Instagram totals come from", a: "Metricool’s account-level figures, not a sum of individual posts. Per-piece figures are used only to rank content against content." },
      { q: "How engagement rate is calculated", a: "Interactions on posts and reels divided by reach, meaning the share of people who saw something and engaged with it. It is not calculated against follower count, which would make the figure look higher than it is." },
      { q: "Why each week is read the day after it closes", a: "Figures for individual posts keep growing after a week ends. Reading each week the day after it closes means both weeks have had the same time to collect views." },
      { q: "Why the search figures may change", a: "Google keeps processing search data for several days, so the most recent days of any week are the least settled. September 14 to 20 did not change between readings a week apart; September 7 to 13 rose from 41 to 45 clicks." },
      { q: "How the doctor page click rate is calculated", a: "All 7 individual doctor pages, counted the same way in both weeks: 22 clicks from 151 appearances this week, 19 from 143 the week before." },
      { q: "How short link clicks are counted", a: "All clicks on the practice’s named short links, counted the same way in both weeks, including automated clicks. Last week’s figures were re-collected so that all 4 booking links are included." },
      { q: "Where the Social section is", a: "The social lead’s write-up arrives after first review. It is checked figure by figure against the Metricool export before it is added.", internalOnly: true },
      { q: "What is not in this report", a: "No paid advertising ran in either week. No email campaigns were sent this week. Story interactions are not in the Instagram export." },
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
  { id: "period", label: "The period" },
  { id: "scoreboard", label: "Scoreboard" },
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
  { k: "Instagram", v: "Sep 21 – 27", p: "Account-level figures from Metricool, against Sep 14 – 20." },
  { k: "Facebook", v: "Sep 21 – 27", p: "Account-level figures from Metricool." },
  { k: "Search", v: "Sep 21 – 27", p: "Against Sep 14 – 20, unchanged at 55 clicks on 1,055 appearances. The last days of this week may still rise." },
  { k: "Website", v: "Sep 21 – 27", p: "Full days." },
  { k: "Short links", v: "Sep 21 – 27", p: "Named links, re-collected for both weeks with all 4 booking links." },
  { k: "Smile Pass", v: "Aug 1 – Sep 27", p: "An overview of activity since launch, separate from the weekly figures." },
];
