/* ==========================================================================
   REPORT DATA  ·  NYC Dental Smiles
   --------------------------------------------------------------------------
   The only file that changes between reporting cycles. page.tsx is unchanged
   this cycle.

   THIS CYCLE — a single week.
     September 28 – October 4 against September 21 – 27: two 7-day windows,
     Monday to Sunday, directly comparable. This week read October 5; last
     week is the September 28 reading.

   READ-DATE RULE — Metricool per-piece figures are each read the day after
     their week closed. Account-level figures: this week October 5, last week
     September 28.

   WEBSITE (GA4) — new-visitor counting broke from September 29, the same
     week the site's plugins were updated. Daily new visitors 19, 2, 3, 0, 1,
     3, 1 while Search Console clicks held at 9, 8, 7, 7, 7, 4, 2. 22 of 97
     sessions have source (not set). New visitors are not reported; sessions
     and landing pages are shown without comparison. The period line uses
     Search Console daily clicks this cycle instead of GA4 new visitors.

   SHORT LINKS — new basis from this cycle: Short.io unfiltered view, Clicks
     by All, 11 allowlist paths plus /raffle. The path filter cannot select
     /raffle, /nycds-website, /NYCDS-35thStreet or /all-locations-booking-weave.
     Sep 21 – 27 on this basis: 46 (booking 14). Earlier reports stand as
     published on the filtered basis.

   RAFFLE — Constant Contact sign-up landing page "New York City Dental Smiles
     Raffle Entry Form", live since September 22, read October 5: 46 unique
     visits, 24 submissions, 52% conversion, 24 new contacts on list "NYCDS
     Raffle Sept-Oct 2026", 84.8% mobile. Cumulative since launch; Constant
     Contact does not split it by week. /raffle in Short.io points to it.

   SOCIAL — hidden until the social lead's write-up arrives after first
     review. EMAIL — no campaigns; `detail.email` is null.

   SMILE PASS — unchanged, August 1 – September 27. Lifetime exports through
     October 4 for GA4, Search Console and sign-ups were not available.

   ENCODING — literal characters for apostrophes, dashes and the minus sign.
     No backslash-u escapes anywhere in the strings.

   Nothing here is estimated or inferred. Every value is carried from a source
   export, or is plain arithmetic on two figures already present.

   SOURCE WINDOWS:
     Instagram, Facebook (Metricool)  Sep 28 – Oct 4 and Sep 21 – 27, 2026
     Search Console                   Sep 28 – Oct 4 and Sep 21 – 27, 2026
     Website (GA4)                    Sep 28 – Oct 4 (no comparison)
     Short links (Short.io)           Sep 28 – Oct 4 and Sep 21 – 27, 2026
     Smile Pass                       Aug 1 – Sep 27, 2026
   ========================================================================== */

type Variant = "client" | "internal";

export const VARIANT: Variant =
  process.env.NEXT_PUBLIC_REPORT_VARIANT === "internal" ? "internal" : "client";
export const IS_INTERNAL: boolean = VARIANT === "internal";

export const REPORT = {
  client: { name: "NYC Dental Smiles", short: "NYCDS", agency: "Figment Creative" },

  period: {
    label: "September 28 – October 4, 2026",
    length: "7 days",
    comparedWith: "the 7 days before it (September 21 – 27)",
    paidStatus:
      "No paid advertising ran in either week. Both are 7 days, Monday to Sunday, so every comparison is direct.",
  },

  copy: {
    scoreboard: {
      title: "The numbers that matter, and what each one means",
      lede: "10 measures, this week against the week before.",
    },
    worked: {
      title: "Dr. Kapparova’s work led the week",
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
    head: "A quieter week on Instagram and in search, and a strong one for the raffle. The raffle form has gained 24 new contacts for the mailing list since it went live September 22, from 46 visits, 52%. The raffle link drew 43 clicks and booking links 35, against 11 and 14. Views were 3,378 against 3,949 and search clicks 44 against 53.",
    headClient: "The raffle brought 24 new contacts to the practice’s mailing list, more than half of everyone who opened the entry form. Dr. Kapparova’s work led Instagram, followers kept growing, and the booking links drew 35 clicks, up from 14.",
    items: [
      {
        role: "The outcome",
        text: "Views 3,949 to 3,378, down 14%. Daily reach 228 to 160, interactions 127 to 51, engagement rate 7.96% to 4.55%. 1 reel went out against 2. 12 Stories, 4 of them from Hudson Yards on October 4 that Metricool has not measured yet. Followers +5 to 779.",
        client: {
          role: "The standout",
          text: "Dr. Kapparova’s reel on natural-looking aesthetic dentistry drew 346 views and engaged 14.5% of the people it reached, the highest rate of the week. Her whitening and bonding work was the week’s second piece.",
        },
      },
      {
        role: "Strongest signal",
        text: "The raffle form has 24 submissions from 46 unique visits since September 22, 52%, all new contacts, 85% on mobile. Constant Contact does not split this by week. The raffle link drew 43 clicks against 11, and booking links 35 against 14, on the same unfiltered basis. October 4, the day of the Hudson Yards event, carried 55 of the week’s 107 human clicks.",
        client: {
          role: "The wider picture",
          text: "24 people have entered the raffle and joined the practice’s mailing list since the entry form went live on September 22. The raffle link drew 43 clicks this week, up from 11, and the booking links drew 35, up from 14. The busiest day for the practice’s links was October 4, the day of the Hudson Yards event.",
        },
      },
      {
        role: "What softened",
        text: "Search clicks 53 to 44 on more appearances, 1,182 against 1,113. Doctor-page click rate 14.6% to 8.3%, and Dr. Chesner’s page 7 clicks to 2. Saturday and Sunday read 4 and 2 and may rise. GA4 new visitors fell to 0 to 3 a day from September 29 while Google clicks held at 7 to 8 a day.",
        client: {
          role: "What we are monitoring",
          text: "Google showed the site 1,182 times, more than the week before, and is still processing the last days of the week. We are confirming how the website counts visits after updates made during the week, so website figures are shown without a comparison this week.",
        },
      },
      {
        role: "Next action",
        text: "Check the GA4 tag with Johana after the plugin updates and confirm the date it was fixed. Check that the /doctors/ addresses redirect to the /dr- pages. Re-read the October 4 Stories next week.",
        client: {
          role: "What we are doing next",
          text: "We are confirming the website’s visit tracking, and we will keep producing doctor-led content like this week’s Dr. Kapparova pieces.",
        },
      },
    ] as { role: string; text: string; client?: { role: string; text: string } }[],
  },

  /* ------------------------------------------------------------ SCOREBOARD */
  scoreboard: [
    {
      metric: "Raffle entries",
      value: "24",
      sub: "New contacts for the practice’s mailing list",
      dir: "",
      change: "Since the entry form went live September 22",
      reading: "46 people opened the entry form and 24 entered, 52%. The raffle link drew 43 clicks this week, up from 11.",
      tone: "tone-good",
    },
    {
      metric: "Booking link clicks",
      value: "35",
      sub: "All locations",
      dir: "up",
      change: "14 the week before, counted the same way",
      reading: "Plaza District 12, Lenox Hill 11, Upper East Side 10, all locations 2. Link clicks are counted a new way from this week, so these do not compare with earlier reports.",
      tone: "tone-good",
    },
    {
      metric: "Followers",
      value: "779",
      sub: "At the end of the week",
      dir: "up",
      change: "+5 this week · +10 the week before",
      reading: "Still growing week over week.",
      tone: "tone-good",
    },
    {
      metric: "Instagram views",
      value: "3,378",
      sub: "Account total, Metricool",
      dir: "down",
      change: "3,949 the week before · −14%",
      reading: "Views were spread across 15 pieces. The top piece, Dr. Kapparova’s reel, drew 346.",
      tone: "",
    },
    {
      metric: "Instagram reach per day",
      value: "160",
      sub: "Average accounts reached each day",
      dir: "down",
      change: "228 the week before · −30%",
      reading: "The week’s reel reached 221 accounts, the most of any piece.",
      tone: "",
    },
    {
      metric: "Instagram interactions",
      value: "51",
      sub: "Likes, comments, saves and shares on posts and reels",
      dir: "down",
      change: "127 the week before",
      reading: "Dr. Kapparova’s reel drew 32 of them, the most of any piece.",
      tone: "",
    },
    {
      metric: "Engagement rate",
      value: "4.55%",
      sub: "Interactions divided by reach",
      dir: "down",
      change: "7.96% the week before",
      reading: "Dr. Kapparova’s reel engaged 14.5% of the people it reached, the strongest rate of the week.",
      tone: "",
    },
    {
      metric: "Google appearances",
      value: "1,182",
      sub: "Times the site appeared in Google results",
      dir: "up",
      change: "1,113 the week before · +6%",
      reading: "The site appeared in Google more often than the week before.",
      tone: "tone-good",
    },
    {
      metric: "Search clicks",
      value: "44",
      sub: "From Google",
      dir: "down",
      change: "53 the week before",
      reading: "Google is still processing the last days of this week, so this figure may rise.",
      tone: "",
    },
    {
      metric: "Website visits",
      value: "97",
      sub: "Google Analytics · under review",
      dir: "",
      change: "Not compared this week",
      reading: "We are confirming how the site counts visits after updates made during the week. Clicks from Google held steady through the week.",
      tone: "",
    },
  ],

  /* -------------------------------------------- THE PERIOD LINE (signature) */
  periodLine: {
    title: "Clicks from Google held steady through the week",
    note:
      "Clicks from Google search each day across both weeks. Shown in place of new website visitors this week while we review how the site counts visits. No paid advertising ran in either week.",
    /* Search Console daily clicks. Sep 21 – 27 is the September 28 reading;
       Sep 28 – Oct 4 the October 5 reading. GA4 new visitors are not used
       this cycle: they broke from September 29. */
    series: [
      { d: "Sep 21", v: 11 }, { d: "Sep 22", v: 9 }, { d: "Sep 23", v: 10 },
      { d: "Sep 24", v: 14 }, { d: "Sep 25", v: 4 }, { d: "Sep 26", v: 1 },
      { d: "Sep 27", v: 4 }, { d: "Sep 28", v: 9 }, { d: "Sep 29", v: 8 },
      { d: "Sep 30", v: 7 }, { d: "Oct 1", v: 7 }, { d: "Oct 2", v: 7 },
      { d: "Oct 3", v: 4 }, { d: "Oct 4", v: 2 },
    ],
    /* Index of the last day of the previous week (Sep 27). */
    splitAt: 6,
    shade: null as { through: number; label: string } | null,
    markers: [] as { i: number; label: string }[],
    /* derived: 53 ÷ 7 = 7.6; 44 ÷ 7 = 6.3 */
    bands: [
      { label: "September 21 – 27", value: "8 a day", detail: "Previous week" },
      { label: "September 28 – October 4", value: "6 a day", detail: "This week" },
    ],
    read: {
      title: "Reading this fairly:",
      body: "Both weeks are 7 days with no paid advertising. Clicks went from 53 to 44. Monday through Friday ran 7 to 9 a day, steadier than the week before. The weekend read 4 and 2, and Google may still add to those days.",
    },
  },

  /* ----------------------------------------------------------- WHAT WORKED */
  worked: {
    /* Internal build only. */
    lede: "No single piece carried the week. Dr. Kapparova featured in 2 of the 3 feed pieces: her reel on natural-looking aesthetic dentistry led with 346 views, 221 accounts reached and 32 interactions, 14.5%, and the whitening and bonding post followed with 261 views.",
    lead: {
      kind: "Reel",
      title: "The best aesthetic dentistry should look like it belongs to you",
      date: "October 1",
      url: "https://www.instagram.com/reel/Dd9jOgBxlea/",
      why:
        "346 views and 221 accounts reached, with 32 interactions, 14.5% of the people it reached, the highest rate of the week. It is Dr. Kapparova explaining how she plans a smile around the whole face.",
      repeatable:
        "The whitening and bonding post, also Dr. Kapparova’s work, drew 261 views and 9 interactions. The post on gum health drew 225 views and 10.",
    },
    gallery: [
      {
        title: "The best aesthetic dentistry should look like it belongs to you", format: "Reel", date: "Oct 1",
        url: "https://www.instagram.com/reel/Dd9jOgBxlea/",
        views: "346", reach: "221", er: "14.5%", lead: true,
      },
      {
        title: "This patient was looking for a brighter, more polished smile while still keeping the result natural", format: "Post", date: "Sep 30",
        url: "https://www.instagram.com/p/Dd7N597FtKE/",
        views: "261", reach: "100", er: "9.0%", lead: false,
      },
      {
        title: "A beautiful smile starts with what you can’t always see", format: "Post", date: "Oct 2",
        url: "https://www.instagram.com/p/DeAMyvqFvcU/",
        views: "225", reach: "106", er: "9.4%", lead: false,
      },
    ],
    galleryNote:
      "All 3 feed pieces published September 28 – October 4, ranked by views. 12 Stories complete the 15. Engagement is interactions divided by reach. These are per-piece figures read the day after the week closed and will not add up to the account totals.",
    channel: {
      title: "Search: the site appeared more often",
      body:
        "Google showed the site 1,182 times against 1,113. Doctor pages again drew clicks at more than twice the rate of the site overall, 8.3% against 3.72%. Dr. Farahani’s and Dr. Tamay’s pages drew 4 clicks each, and people searching the practice’s name clicked through 42% of the time.",
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
      title: "GA4 stopped counting new visitors correctly on September 29",
      body:
        "New visitors read 19 on September 28, then 2, 3, 0, 1, 3 and 1. Search Console clicks over the same days were 9, 8, 7, 7, 7, 4 and 2. 22 of the week’s 97 sessions have no source recorded, which did not appear before. The site’s plugins were updated during the week.",
      so:
        "The timing matches the plugin updates, but the exports cannot confirm the cause. Ask Johana to check that the GA4 tag fires on every page, and confirm the date it was fixed. Until then, website figures from September 29 are not comparable: this report holds back new visitors and shows sessions without a comparison.",
    },
    {
      tag: "limitation",
      title: "Short link clicks are now counted on the unfiltered view",
      body:
        "Short.io’s path filter does not offer /raffle, /nycds-website, /NYCDS-35thStreet or /all-locations-booking-weave, so it cannot cover the full NYCDS set. Both weeks are now read from the unfiltered view, Clicks by All: 104 clicks across the 12 paths this week against 46. Last week’s booking links read 107 on the filtered basis and 14 on this one.",
      so:
        "The unfiltered per-link counts sit close to Short.io’s human-click total, 104 of 107 this week, so they appear to leave out most automated traffic. The domain total of 239 includes clicks on paths outside the list. The 2 bases cannot be compared, so earlier reports’ link figures stand as published.",
    },
    {
      tag: "early",
      title: "Doctor pages drew fewer clicks on more appearances",
      body:
        "16 clicks from 192 appearances, 8.3%, against 22 from 151, 14.6%. Dr. Chesner’s page went from 7 clicks to 2 while its appearances rose from 44 to 56. GA4 shows visits landing on doctor pages at both /dr- and /doctors/ addresses, and this week several doctor page titles appear in 2 different capitalizations.",
      so:
        "Worth checking that the /doctors/ addresses redirect to the /dr- pages Google ranks, and whether page titles changed during the plugin updates. 1 week of lower click rate is not yet a trend.",
    },
    {
      tag: "expected",
      title: "Instagram eased with no standout piece",
      body:
        "Views 3,949 to 3,378, daily reach 228 to 160, interactions 127 to 51. 1 reel went out against 2. The reel was the week’s top piece, as a reel was in each of the last 3 weeks.",
      so:
        "Reels have led reach every week this month. A second reel in a week is the simplest thing to test.",
    },
    {
      tag: "limitation",
      title: "The Hudson Yards Stories have not been measured yet",
      body:
        "4 Stories posted on October 4 from the Hudson Yards event show 0 impressions in the export. Metricool’s Story count of 12 includes them, which pulls average reach per Story down to 28. On the 8 measured Stories it is 42.",
      so:
        "Re-read them next week and report them then. The raffle form’s 24 entries and the raffle link’s 43 clicks are the event figures available now; the form total is cumulative from September 22 and cannot be split by day.",
    },
    {
      tag: "limitation",
      title: "Last week’s search figures were not re-pulled",
      body:
        "September 21 – 27 is the September 28 reading, when Saturday and Sunday read 1 and 4 clicks. This week’s Saturday and Sunday read 4 and 2.",
      so:
        "Both weeks’ last days may still rise. Next cycle re-reads this week as its comparison, which settles it.",
    },
  ],

  /* --------------------------------------------------------- WHAT WE LEARNED */
  learned: [
    { f: "346", u: "views on Dr. Kapparova’s reel", t: "the week’s top piece. 14.5% of the people it reached engaged with it, the highest rate of the week." },
    { f: "24", u: "raffle entries", t: "all new contacts for the mailing list, from 46 people who opened the form. The raffle link drew 43 clicks this week, and the busiest day for the practice’s links was October 4, the day of the Hudson Yards event." },
    { f: "35", u: "booking link clicks", t: "against 14 the week before, counted the same way. Plaza District, Lenox Hill and Upper East Side each drew 10 to 12." },
    { f: "42%", u: "click rate on searches for the practice’s name", t: "8 clicks from 19 searches for “nyc dental smiles”. People looking for the practice find it." },
    { f: "+5", u: "Instagram followers", t: "to 779, growing for another week." },
    { f: "1,182", u: "times the site appeared in Google", t: "up from 1,113 the week before." },
  ],

  /* ------------------------------------------------------------- NEXT MOVES */
  moves: [
    {
      action: "Check the website’s visit tracking after the plugin updates",
      why: "GA4 new visitors fell to 0 to 3 a day from September 29 while Google clicks held at 7 to 8 a day, and 22 sessions have no source recorded.",
      owner: "Web — Figment with Johana",
      measure: "GA4 new visitors back in line with Search Console clicks, and the date the fix took effect.",
    },
    {
      action: "Export GA4 daily sessions for September 21 – October 4",
      why: "It shows exactly when counting changed, so the gap can be marked in the next report.",
      owner: "Reporting — Figment",
      measure: "The first day sessions dropped.",
    },
    {
      action: "Make the next doctor-led reel",
      why: "A reel was the week’s top piece for the 3rd week running, and this week 1 went out against 2.",
      owner: "Social — Figment",
      measure: "Reach on the next reel, against 221.",
    },
    {
      action: "Confirm the /doctors/ addresses redirect to the doctor pages",
      why: "GA4 shows visits landing on both /dr- and /doctors/ addresses, and doctor-page click rate in Google fell from 14.6% to 8.3%.",
      owner: "Web — Figment",
      measure: "1 address per doctor in next week’s landing pages.",
    },
    {
      action: "Re-read the Hudson Yards Stories next week",
      why: "The 4 October 4 Stories show 0 impressions in this week’s export.",
      owner: "Reporting — Figment",
      measure: "Impressions and reach for the 4 Stories.",
    },
    {
      action: "Send the 24 raffle contacts a welcome email",
      why: "They are new to the list and entered within the last 2 weeks. A welcome with booking links reaches them while the event is recent.",
      owner: "Email — Figment",
      measure: "Confirmed opens and booking link clicks from the welcome email.",
    },
  ],

  /* ---------------------------------------------------------------- DETAIL */
  detail: {
    subtitles: {
      instagram: "September 28 – October 4 · account totals from Metricool",
      search: "September 28 – October 4 · Google Search Console",
      website: "September 28 – October 4 · Google Analytics",
      links: "September 28 – October 4 · Short.io",
    },

    instagram: {
      kv: [
        { k: "Views", v: "3,378" },
        { k: "Reach per day", v: "160" },
        { k: "Accounts engaged", v: "95" },
        { k: "Followers", v: "779" },
        { k: "Content published", v: "15" },
        { k: "Interactions", v: "51" },
      ],
      publishedChart: {
        title: "What was published",
        note: "15 pieces against 12 the week before: 12 Stories against 9, 2 posts against 1, and 1 reel against 2.",
      },
      published: [
        { label: "Stories", value: 12 },
        { label: "Feed posts", value: 2 },
        { label: "Reels", value: 1 },
      ],
      postsChart: {
        title: "The 3 feed pieces published this week",
        note: "Ranked by views. Engagement is interactions divided by reach.",
      },
      posts: [
        { t: "The best aesthetic dentistry should look like it belongs to you", f: "Reel", d: "Oct 1", v: "346", r: "221", i: "32", e: "14.5%" },
        { t: "This patient was looking for a brighter, more polished smile", f: "Post", d: "Sep 30", v: "261", r: "100", i: "9", e: "9.0%" },
        { t: "A beautiful smile starts with what you can’t always see", f: "Post", d: "Oct 2", v: "225", r: "106", i: "10", e: "9.4%" },
      ],
      interactionsChart: {
        title: "The reel drew most of the interactions",
        note: "51 interactions on posts and reels. The reel drew 32.",
      },
      interactions: [
        { label: "Reels", value: 32 },
        { label: "Feed posts", value: 19 },
      ],
      viewsChart: {
        title: "Views by format",
        note: "From Metricool’s format summaries. Stories are shown as impressions. These are not summed; the account total of 3,378 is measured separately.",
      },
      viewsByFormat: [
        { label: "Feed posts", value: 486 },
        { label: "Stories", value: 366 },
        { label: "Reels", value: 346 },
      ],
      storiesTitle: "Stories",
      stories:
        "12 Stories drew 366 impressions, against 626 from 9 the week before. 4 posted from Hudson Yards on October 4 show 0 so far. Average reach on the 8 measured Stories was 42, against 62.",
      note:
        "Account totals are Metricool’s account-level figures: this week read October 5, last week read September 28. Per-piece figures are each read the day after their week closed. Engagement rate is interactions on posts and reels divided by reach: 51 against 1,120 this week and 127 against 1,596 the week before. Story interactions are not in the export. Metricool shows 5 followers acquired and 1 lost, while the count rose by 5, from 774 to 779; the report uses the count. No paid advertising ran in either week.",
      clientNote:
        "Account totals come from Metricool’s account-level figures rather than a sum of individual posts. Figures for individual posts keep growing after a week ends, so each week is read the day after it closes. Engagement rate is interactions divided by reach. No paid advertising ran in either week.",
    },

    search: {
      kv: [
        { k: "Clicks", v: "44" },
        { k: "Impressions", v: "1,182" },
        { k: "Click rate", v: "3.72%" },
      ],
      impressionsChart: {
        title: "Impressions per day",
        note: "Daily appearances in Google results across the week.",
      },
      impressionsSeries: [
        { d: "Sep 28", v: 154 }, { d: "Sep 29", v: 133 }, { d: "Sep 30", v: 147 },
        { d: "Oct 1", v: 251 }, { d: "Oct 2", v: 188 }, { d: "Oct 3", v: 124 },
        { d: "Oct 4", v: 185 },
      ],
      pagesChart: {
        title: "The homepage collects the appearances; the doctor pages collect the clicks",
        note: "Clicks, appearances, click rate and average position by page. The 7 doctor pages together drew 16 clicks from 192 appearances.",
      },
      pages: [
        { p: "Homepage", c: "23", i: "901", r: "2.55%", pos: "44.6" },
        { p: "Dr. Sherman Farahani", c: "4", i: "26", r: "15.38%", pos: "8.8" },
        { p: "Dr. Maria Tamay", c: "4", i: "22", r: "18.18%", pos: "10.9" },
        { p: "Dr. James Eisdorfer", c: "3", i: "20", r: "15.00%", pos: "10.8" },
        { p: "Dr. Michael Chesner", c: "2", i: "56", r: "3.57%", pos: "6.0" },
        { p: "Dr. Dana Kapparova", c: "2", i: "25", r: "8.00%", pos: "10.5" },
        { p: "Locations", c: "2", i: "90", r: "2.22%", pos: "14.4" },
        { p: "Dr. Ben Elchami", c: "1", i: "26", r: "3.85%", pos: "10.6" },
        { p: "Meet Our Dentists", c: "1", i: "161", r: "0.62%", pos: "29.3" },
        { p: "Services", c: "1", i: "90", r: "1.11%", pos: "5.7" },
      ],
      devicesChart: {
        title: "Mobile still clicks through more often",
        note: "Clicks, appearances, click rate and average position by device. Mobile 6.87% against 8.75%; desktop 2.70% against 3.18%.",
      },
      devices: [
        { d: "Desktop", c: "24", i: "889", r: "2.70%", pos: "47.1" },
        { d: "Mobile", c: "20", i: "291", r: "6.87%", pos: "33.6" },
        { d: "Tablet", c: "0", i: "2", r: "0%", pos: "94.0" },
      ],
      queriesChart: {
        title: "Searches that name the practice bring most of the clicks",
        note: "From the query export, which holds 11 of the 44 clicks and 852 of the 1,182 appearances. Useful for share, not for totals.",
      },
      queries: [
        { q: "nyc dental smiles", c: "8", i: "19", r: "42.11%", pos: "1.4" },
        { q: "nyc smiles", c: "1", i: "8", r: "12.50%", pos: "32.8" },
        { q: "dentist near me", c: "1", i: "2", r: "50.00%", pos: "4.5" },
        { q: "dentist east side", c: "1", i: "1", r: "100.00%", pos: "1.0" },
      ],
      brandSplit: {
        title: "Named and general searches",
        note: "Matched on the practice names and doctor surnames. Shares within the query sample, not totals.",
        rows: [
          { k: "Names the practice or a doctor", c: "9", i: "87", r: "10.34%" },
          { k: "General searches", c: "2", i: "765", r: "0.26%" },
        ],
      },
      note:
        "Totals come from Search Console’s daily export, read October 5. Saturday and Sunday read 4 and 2 clicks and may rise. September 21 – 27 is the September 28 reading and was not re-pulled. Average position is weighted by appearances, 43.9 this week against 44.0. Doctor-page click rate counts all 7 individual doctor pages in both weeks.",
    },

    website: {
      kv: [
        { k: "Sessions", v: "97" },
        { k: "Desktop", v: "72%" },
        { k: "Mobile", v: "25%" },
        { k: "Tablet", v: "3%" },
      ],
      sourcesChart: {
        title: "Where visitors came from",
        note: "Sessions by source. Direct means someone typed the address or used a saved link. Source not recorded means the site did not record where the visit came from.",
      },
      sources: [
        { label: "Direct", value: 34 },
        { label: "Google — organic", value: 29 },
        { label: "Source not recorded", value: 22 },
        { label: "Short links", value: 3 },
        { label: "Constant Contact", value: 2 },
        { label: "nycsmilepass.com", value: 2 },
      ],
      deviceChart: {
        title: "Desktop still leads",
        note: "Share of visitors by device.",
      },
      deviceSplit: [
        { label: "Desktop", pct: 72 },
        { label: "Mobile", pct: 25 },
        { label: "Tablet", pct: 3 },
      ],
      landingChart: {
        title: "Where visitors landed",
        note: "Views by landing page.",
      },
      landing: [
        { label: "Homepage", value: 69 },
        { label: "Meet Our Dentists", value: 20 },
        { label: "Locations", value: 13 },
        { label: "Dr. Edgard El Chaar", value: 12 },
        { label: "Dr. Sherman Farahani", value: 11 },
        { label: "Dr. Laura Koo Min Chee", value: 7 },
      ],
      note:
        "We are reviewing how the site counts visits after updates made during the week, so this week’s figures may be low and are not compared with last week. No paid advertising ran in either week.",
    },

    links: {
      kv: [
        { k: "Booking · all locations", v: "35" },
        { k: "Raffle", v: "43" },
        { k: "Location pages", v: "20" },
        { k: "Total", v: "104" },
      ],
      destsChart: {
        title: "Clicks by link",
        note: "The practice’s short links with clicks this week.",
      },
      dests: [
        { label: "Raffle", value: 43 },
        { label: "Plaza District — booking", value: 12 },
        { label: "Lenox Hill — booking", value: 11 },
        { label: "Upper East Side — booking", value: 10 },
        { label: "Main website", value: 6 },
        { label: "Murray Hill — information", value: 6 },
        { label: "Plaza District — information", value: 5 },
        { label: "Lenox Hill — information", value: 5 },
        { label: "Upper East Side — information", value: 4 },
        { label: "All locations — booking", value: 2 },
      ],
      note:
        "104 clicks this week against 46, both weeks counted the same way. Booking links drew 35 against 14, the raffle link 43 against 11, and location information links 20 against 12. The Murray Hill booking link and the homepage link drew no clicks this week. The raffle link leads to the raffle entry form, which has 24 entries from 46 visits since September 22. From this week, link clicks are counted on a view that includes every link the practice uses, including the raffle link, so they do not compare with figures in earlier reports.",
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
      subtitle: "September 28 – October 4 · account totals from Metricool",
      kv: [
        { k: "Followers", v: "982" },
        { k: "Views", v: "286" },
        { k: "Page visits", v: "1" },
        { k: "Content published", v: "3" },
      ],
      note:
        "Views 286 against 207, on 3 pieces in both weeks. Followers unchanged at 982. Page visits 1 against 15. At this scale the figures move on single pieces of content and are reported for completeness.",
    },

    method: [
      { q: "What the report covers", a: "September 28 to October 4, 2026, 7 full days, Monday to Sunday, compared with September 21 to 27. Both weeks are the same length, so every comparison is direct." },
      { q: "Where the Instagram totals come from", a: "Metricool’s account-level figures, not a sum of individual posts. Per-piece figures are used only to rank content against content." },
      { q: "How engagement rate is calculated", a: "Interactions on posts and reels divided by reach, meaning the share of people who saw something and engaged with it. It is not calculated against follower count, which would make the figure look higher than it is." },
      { q: "Why each week is read the day after it closes", a: "Figures for individual posts keep growing after a week ends. Reading each week the day after it closes means both weeks have had the same time to collect views." },
      { q: "Why the search figures may change", a: "Google keeps processing search data for several days, so the most recent days of any week are the least settled." },
      { q: "How the doctor page click rate is calculated", a: "All 7 individual doctor pages, counted the same way in both weeks: 16 clicks from 192 appearances this week, 22 from 151 the week before." },
      { q: "How short link clicks are counted", a: "All clicks on the practice’s 12 named short links, including the raffle link, counted the same way in both weeks. This is a new basis from this week, so link figures do not compare with earlier reports." },
      { q: "Why website figures are not compared this week", a: "Updates were made to the website during the week, and the way it counts visits changed from September 29. Until that is confirmed, this report shows website figures without a week-to-week comparison, and the daily chart shows clicks from Google instead." },
      { q: "Where the Social section is", a: "The social lead’s write-up arrives after first review. It is checked figure by figure against the Metricool export before it is added.", internalOnly: true },
      { q: "Where the raffle figures come from", a: "Constant Contact’s report for the raffle entry form, read October 5. It covers the whole time the form has been live, from September 22, and does not split entries by week." },
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
  { k: "Instagram", v: "Sep 28 – Oct 4", p: "Account-level figures from Metricool, against Sep 21 – 27." },
  { k: "Facebook", v: "Sep 28 – Oct 4", p: "Account-level figures from Metricool." },
  { k: "Search", v: "Sep 28 – Oct 4", p: "Against Sep 21 – 27. The last days of both weeks may still rise." },
  { k: "Website", v: "Sep 28 – Oct 4", p: "Under review from September 29. Shown without a comparison." },
  { k: "Short links", v: "Sep 28 – Oct 4", p: "All 12 named links, counted the same way in both weeks." },
  { k: "Raffle form", v: "Sep 22 – Oct 5", p: "Constant Contact entry form, since it went live." },
  { k: "Smile Pass", v: "Aug 1 – Sep 27", p: "An overview of activity since launch, separate from the weekly figures." },
];
