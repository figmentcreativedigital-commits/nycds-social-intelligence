/* ==========================================================================
   REPORT DATA  ·  NYC Dental Smiles
   --------------------------------------------------------------------------
   The only file that changes between reporting cycles. Edit the figures and
   narrative strings here; never edit page.tsx.

   THIS CYCLE — a single week.
     September 14 – 20 against September 7 – 13: two 7-day windows, Monday to
     Sunday, directly comparable.

   NEW SECTION — Smile Pass. An overview of NYC Smile Pass from August 1 to
     September 20, shown last in both builds. It has its own date range and is
     not part of the weekly comparison.

   NEW SECTION — Social. A written summary of Instagram from the social team,
     shown in both builds after What worked. Seven of its nine figures did not
     match the Metricool export and were corrected to it. The two content
     claims (Dr. Tamay's reel figures, the office manager post ranking second)
     matched exactly and are unchanged.

   ENCODING — literal characters for apostrophes, dashes and the minus sign.
     No backslash-u escapes anywhere in the strings.

   Nothing here is estimated or inferred. Every value is carried from a source
   export, or is plain arithmetic on two figures already present.

   SOURCE WINDOWS:
     Instagram, Facebook (Metricool)  Sep 14 – 20 and Sep 7 – 13, 2026
     Search Console                   Sep 14 – 20 and Sep 7 – 13, 2026
     Website (GA4)                    Sep 14 – 20 and Sep 7 – 13, 2026
     Short links (Short.io)           Sep 14 – 20 and Sep 7 – 13, 2026
     Email (Constant Contact)         one campaign sent Sep 15

   OPEN BEFORE THIS GOES TO THE PRACTICE:
     - Re-pull Search Console Chart.csv on Wednesday, September 23. Saturday
       and Sunday read 0 and 2 clicks, and September 7 – 13 rose from 41 to 45
       clicks between its first and second readings.
   ========================================================================== */

type Variant = "client" | "internal";

export const VARIANT: Variant =
  process.env.NEXT_PUBLIC_REPORT_VARIANT === "internal" ? "internal" : "client";
export const IS_INTERNAL: boolean = VARIANT === "internal";

export const REPORT = {
  client: { name: "NYC Dental Smiles", short: "NYCDS", agency: "Figment Creative" },

  period: {
    label: "September 14 – 20, 2026",
    length: "7 days",
    comparedWith: "the 7 days before it (September 7 – 13)",
    paidStatus:
      "No advertising ran in either week. Both are 7 days, Monday to Sunday, so every comparison is direct.",
  },

  copy: {
    scoreboard: {
      title: "The numbers that matter, and what each one means",
      lede: "Ten measures, this week against the week before.",
    },
    worked: {
      title: "Dr. Tamay’s reel carried the week",
      galleryTitle: "The three feed pieces published this week, ranked by views",
    },
    attention: {
      title: "What needs attention",
      lede: "Six things worth a second look, each labeled so it is clear which to act on and which to note.",
    },
    learned: {
      title: "What we learned",
      lede: "Six things worth carrying into the next report.",
    },
    moves: {
      title: "Recommended next moves",
      lede: "Six actions, each with the reason behind it and the number that shows whether it worked.",
    },
    detail: {
      title: "Supporting detail",
      lede: "The figures behind the report. Open only what you need.",
    },
  },

  /* ------------------------------------------------------------- THE BRIEF */
  brief: {
    title: "The Brief",
    lede: "The week in four points.",
    head: "Instagram views more than doubled, and one reel accounts for most of it. Dr. Tamay’s reel drew 2,464 of the week’s 4,380 views and 163 of its 198 interactions. Without it, views were level.",
    headClient: "A strong week on Instagram. Dr. Tamay’s reel reached 1,102 accounts and drew 2,464 views, more than half of everything the account earned this week.",
    items: [
      {
        role: "The outcome",
        text: "Views 1,978 to 4,380, daily reach 100 to 239, interactions 42 to 198. The Tamay reel is 56% of views and 82% of interactions. Excluding it, views were 1,916 against 1,978. Next week compares against this reel, so it will read as a sharp fall unless another piece performs the same way.",
        client: {
          role: "The standout",
          text: "Dr. Tamay’s reel about making patients feel comfortable reached 1,102 accounts. That is about five times the reach of anything else published this week.",
        },
      },
      {
        role: "Strongest signal",
        text: "Dr. Tamay’s page rose in the same week: 12 website visits, and 5 clicks from Google search, up from 2. The exports are weekly, so they show the two together, not which came first. Doctor pages as a group rose from 10.1% to 13.3% click rate.",
        client: {
          role: "The wider picture",
          text: "Dr. Tamay’s page also drew more attention this week: 12 website visits, and 5 clicks from Google, up from 2 the week before.",
        },
      },
      {
        role: "What softened",
        text: "Search impressions fell from 1,738 to 1,055, 86% of it on the homepage. In the query sample, general searches fell from 1,209 appearances to 691 and drew one click across both weeks. Click rate doubled, 2.59% to 5.21%. Saturday and Sunday read 0 and 2 clicks and have not settled. Google visits in GA4 fell 60 to 51 while Search Console clicks rose 45 to 55; the two disagree this week.",
        client: {
          role: "What we are monitoring",
          text: "Google showed the site less often, 1,055 times against 1,738, but more of the people who saw it clicked: 5.2% against 2.6%. Google is still processing the last days of this week, so these figures may rise.",
        },
      },
      {
        role: "Next action",
        text: "Make another doctor-led reel on the same subject. Re-pull search on Wednesday. Test the Murray Hill and Plaza District booking buttons, which have drawn no clicks in two weeks.",
        client: {
          role: "What we are doing next",
          text: "We will keep producing doctor-led content like Dr. Tamay’s reel. Because one piece lifted the whole week, next week’s comparison will look lower unless another performs the same way.",
        },
      },
    ] as { role: string; text: string; client?: { role: string; text: string } }[],
  },

  /* ------------------------------------------------------------ SCOREBOARD */
  scoreboard: [
    {
      metric: "Instagram views",
      value: "4,380",
      sub: "Account total, Metricool",
      dir: "up",
      change: "1,978 the week before · +121%",
      reading: "Dr. Tamay’s reel accounts for 2,464 of these, more than half. Without it, views were level with the week before.",
      tone: "tone-good",
    },
    {
      metric: "Instagram reach per day",
      value: "239",
      sub: "Average accounts reached each day",
      dir: "up",
      change: "100 the week before · +139%",
      reading: "More than doubled. The Tamay reel alone reached 1,102 accounts.",
      tone: "tone-good",
    },
    {
      metric: "Instagram interactions",
      value: "198",
      sub: "Likes, comments, saves and shares on posts and reels",
      dir: "up",
      change: "42 the week before",
      reading: "163 came from one reel. The office manager post drew 22.",
      tone: "tone-good",
    },
    {
      metric: "Engagement rate",
      value: "11.84%",
      sub: "Interactions divided by reach",
      dir: "up",
      change: "6.00% the week before",
      reading: "Nearly double. More people saw the content and a larger share of them responded.",
      tone: "tone-good",
    },
    {
      metric: "Followers",
      value: "764",
      sub: "At the end of the week",
      dir: "up",
      change: "+4 this week · +3 the week before",
      reading: "6 new and 2 lost. Steady growth.",
      tone: "tone-good",
    },
    {
      metric: "Booking link clicks",
      value: "93",
      sub: "All four locations",
      dir: "up",
      change: "80 the week before · +16%",
      reading: "Upper East Side 49 and Lenox Hill 44, against 38 and 42. Murray Hill and Plaza District drew none in either week.",
      tone: "tone-good",
    },
    {
      metric: "Search click rate",
      value: "5.21%",
      sub: "Share of people who saw the site in Google and clicked",
      dir: "up",
      change: "2.59% the week before",
      reading: "Doubled. Google showed the site less often, 1,055 times against 1,738, and more of the people who saw it clicked.",
      tone: "tone-good",
    },
    {
      metric: "Search clicks",
      value: "55",
      sub: "From Google",
      dir: "up",
      change: "45 the week before · +22%",
      reading: "Google is still processing the last days of this week, so this figure may rise.",
      tone: "",
    },
    {
      metric: "Doctor page click rate",
      value: "13.3%",
      sub: "All seven doctor pages, Google search",
      dir: "up",
      change: "10.1% the week before",
      reading: "19 clicks from 143 appearances. Dr. Tamay’s page drew 5 clicks, up from 2.",
      tone: "tone-good",
    },
    {
      metric: "Website new visitors",
      value: "109",
      sub: "Google Analytics",
      dir: "up",
      change: "94 the week before · +16%",
      reading: "15.6 a day against 13.4. Dr. Tamay’s page drew 12 visits in the week her reel ran.",
      tone: "",
    },
  ],

  /* -------------------------------------------- THE PERIOD LINE (signature) */
  periodLine: {
    title: "New website visitors edged up this week",
    note:
      "New website visitors each day across the two weeks. No advertising ran in either week.",
    /* GA4 daily new visitors, Sep 7 – 20. Sep 7 – 13 restated from 92 to 94
       between the September 14 and September 21 pulls. */
    series: [
      { d: "Sep 7", v: 14 }, { d: "Sep 8", v: 16 }, { d: "Sep 9", v: 18 },
      { d: "Sep 10", v: 16 }, { d: "Sep 11", v: 12 }, { d: "Sep 12", v: 7 },
      { d: "Sep 13", v: 11 }, { d: "Sep 14", v: 17 }, { d: "Sep 15", v: 14 },
      { d: "Sep 16", v: 19 }, { d: "Sep 17", v: 22 }, { d: "Sep 18", v: 19 },
      { d: "Sep 19", v: 9 }, { d: "Sep 20", v: 9 },
    ],
    /* Index of the last day of the previous week (Sep 13). */
    splitAt: 6,
    shade: null as { through: number; label: string } | null,
    markers: [] as { i: number; label: string }[],
    /* derived: 94 ÷ 7 = 13.4; 109 ÷ 7 = 15.6 */
    bands: [
      { label: "September 7 – 13", value: "13 a day", detail: "Previous week" },
      { label: "September 14 – 20", value: "16 a day", detail: "This week" },
    ],
    read: {
      title: "Reading this fairly:",
      body: "Both weeks are 7 days with no advertising. New visitors rose from 13 a day to 16. Wednesday through Friday ran highest, 19 to 22 a day. Dr. Tamay’s reel went out on Friday, and her page drew 12 visits across the week. The weekend was quieter than the week before.",
    },
  },

  /* ----------------------------------------------------------- WHAT WORKED */
  worked: {
    /* Internal build only. */
    lede: "One reel carried the week. Dr. Tamay’s reel on patient comfort drew 2,464 views, reached 1,102 accounts and took 163 of the week’s 198 interactions. Her page drew 12 visits and 5 search clicks in the same week.",
    lead: {
      kind: "Reel",
      title: "Dr. Tamay believes great dental care starts with making patients feel comfortable, heard, and confident in every decision",
      date: "September 18",
      url: "https://www.instagram.com/reel/DdbtWpZJZUm/",
      why:
        "2,464 views and 1,102 accounts reached, about five times the reach of anything else published this week. 163 interactions on that reach is 14.8%. It is a doctor speaking directly about how patients should feel, not about a procedure. The previous lead, the All-on-6 carousel on September 10, now shows 742 views.",
      repeatable:
        "The office manager post was next, with 669 views and 22 interactions, shared with DDS PC for Office Manager Appreciation Month. Both of this week’s strongest pieces were about people at the practice. The comprehensive care reel, about specialists working together, drew 311.",
    },
    gallery: [
      {
        title: "Dr. Tamay believes great dental care starts with making patients feel comfortable, heard, and confident in every decision", format: "Reel", date: "Sep 18",
        url: "https://www.instagram.com/reel/DdbtWpZJZUm/",
        views: "2,464", reach: "1,102", er: "14.8%", lead: true,
      },
      {
        title: "Behind every great dental practice is an office manager keeping countless moving pieces on track", format: "Post", date: "Sep 17",
        url: "https://www.instagram.com/p/DdZPXJTlrXy/",
        views: "669", reach: "218", er: "10.1%", lead: false,
      },
      {
        title: "At NYC Dental Smiles, comprehensive care starts with a team that works together", format: "Reel", date: "Sep 16",
        url: "https://www.instagram.com/reel/DdXGDHcJlsS/",
        views: "311", reach: "205", er: "6.3%", lead: false,
      },
    ],
    galleryNote:
      "All three feed pieces published September 14 – 20, ranked by views. Four Stories complete the seven. Engagement is interactions divided by reach. These are per-piece figures and will not add up to the account totals, which Metricool measures separately.",
    channel: {
      title: "Search: fewer appearances, more clicks",
      body:
        "Google showed the site 1,055 times against 1,738, and 590 of that fall was on the homepage. Click rate doubled, from 2.59% to 5.21%. Searches that name the practice or a doctor drew 15 clicks at 18.3%; general searches drew none from 691 appearances. Doctor pages rose from 10.1% to 13.3%, and Dr. Tamay’s page from 2 clicks to 5.",
    },
  },

  /* ---------------------------------------------------------------- SOCIAL */
  social: {
    title: "Social",
    lede: "How Instagram performed this week, and what we will keep doing.",
    items: [
      "Instagram followers are up 0.53%, while views increased 121% and overall interactions increased 371% compared with the previous period. Average daily reach also more than doubled, up 139%.",
      "Reels drove much of this growth, with Reel engagement up 23%, average reach per Reel up 296% and Reel interactions up 878%.",
      "Doctor-led, patient-focused content was the clear standout. Dr. Tamay’s patient comfort Reel generated 2,464 views and reached 1,102 accounts, significantly outperforming the rest of the content this period. Office Manager Appreciation content was the next strongest performer.",
    ],
    takeaway:
      "This was a strong week for both visibility and engagement, with doctor-led content driving the biggest response. We’ll continue leaning into patient-focused doctor content while building on the topics and formats that can help sustain this momentum.",
  },

  /* -------------------------------------------------------- NEEDS ATTENTION */
  attention: [
    {
      tag: "issue",
      title: "One reel carried the week, and next week compares against it",
      body:
        "The Tamay reel drew 2,464 of 4,380 views, 56%, and 163 of 198 interactions, 82%. Excluding it, views were 1,916 against 1,978 the week before, effectively level. Reach per reel rose from 165 to 654, but the other reel this week reached 205.",
      so:
        "The growth is real but it is one piece. Next week compares against a 2,464-view reel, so it will read as a steep fall unless something performs the same way. Worth telling the practice now, and worth a second doctor-led reel in the next week rather than waiting.",
    },
    {
      tag: "issue",
      title: "Two of the four booking links drew no clicks in either week",
      body:
        "/murray-hill-booking and /58th-booking-weave were in the filter and drew no clicks in either week, while Upper East Side and Lenox Hill drew 93 between them this week. In the August 31 – September 13 figures they drew 21 and 20. The 9 GA4 landing views on the Murray Hill booking page were likely testing. Separately, Sep 7 – 13 now shows Lenox Hill booking at 42 and Upper East Side at 38, more than the full August 31 – September 13 window showed when pulled on September 14 (26 and 19). Both exports carried a filter; the settings likely differed.",
      so:
        "Two weeks at zero while the other two draw 40 or more each is worth a quick test: tap both buttons on the locations page on a phone and confirm they reach a booking calendar. Record the exact filter settings with each export from now on.",
    },
    {
      tag: "limitation",
      title: "Search has not settled, and the two sources disagree",
      body:
        "Daily clicks: 17, 10, 7, 13, 6, then 0 on Saturday and 2 on Sunday. September 7 – 13 rose from 41 to 45 clicks between its first and second readings. Search Console shows clicks up from 45 to 55 while GA4 shows visits from Google down from 60 to 51.",
      so:
        "Re-pull Chart.csv on Wednesday. If the disagreement holds after that, it is worth checking whether GA4 is losing some Google visits to direct.",
    },
    {
      tag: "issue",
      title: "The White Party list was sent to again without cleaning",
      body:
        "White Party Email Set 2 went to the same 44 contacts on September 15. 12 did not receive it, 27%, the same 12 as the September 9 send. 11 opens, no clicks.",
      so:
        "Cleaning this list was recommended after the first send. At 27% undelivered on repeat sends, it affects the account’s sending reputation. Remove the 12 before anything else goes to it.",
    },
    {
      tag: "note",
      title: "The social update’s figures did not match the export",
      body:
        "Seven of nine figures differed, and not in one direction: views, reach and interactions were understated, while Reel engagement and reach per Reel were overstated. The two content claims matched exactly. All seven were corrected to the Metricool export so the Social section agrees with the scoreboard.",
      so:
        "The pattern suggests a different comparison window or source rather than a later pull. Worth confirming with the social team which Metricool view they use, so next week’s update matches without correction.",
    },
    {
      tag: "note",
      title: "The test doctor page is gone; a sitemap is registering as a landing page",
      body:
        "/doctors/test-doctor drew 15 landing views last week and none this week. /index.php/sitemap.xml registered 7 landing views, which is automated traffic.",
      so:
        "The test page looks resolved. The sitemap is excluded from the landing page chart and from nothing else, since its 7 views are too small to move any total.",
    },
  ],

  /* --------------------------------------------------------- WHAT WE LEARNED */
  learned: [
    { f: "2,464", u: "views on Dr. Tamay’s reel", t: "more than three times the 742 of the previous lead. A doctor talking about how patients should feel drew the strongest response of anything published this month." },
    { f: "12", u: "visits to Dr. Tamay’s page", t: "in the same week her reel ran, and 5 clicks from Google, up from 2." },
    { f: "5.21%", u: "search click rate", t: "double the 2.59% the week before. Google showed the site less often, and more of the people who saw it clicked." },
    { f: "13.3%", u: "click rate on doctor pages", t: "up from 10.1%, against 5.2% across the site. Doctor pages are still the part of the site that converts best in search." },
    { f: "11.84%", u: "Instagram engagement rate", t: "up from 6.00%. More people saw the content, and a larger share of them responded." },
    { f: "93", u: "booking link clicks", t: "across the four locations, against 80 the week before. Upper East Side and Lenox Hill drew all of them." },
  ],

  /* ------------------------------------------------------------- NEXT MOVES */
  moves: [
    {
      action: "Make another doctor-led reel on patient comfort",
      why: "The Tamay reel reached 1,102 accounts, and her page drew more visits the same week. It is the strongest piece published this month, and it was a doctor talking about how patients should feel.",
      owner: "Social — Figment",
      measure: "Reach on the next doctor-led reel, against 1,102.",
    },
    {
      action: "Set expectations for next week’s comparison",
      why: "Next week compares against a reel that carried 56% of this week’s views. Without another piece like it, the headline will read as a steep fall.",
      owner: "Account — Figment",
      measure: "Next week’s views excluding the Tamay reel, against 1,916.",
    },
    {
      action: "Test the Murray Hill and Plaza District booking buttons",
      why: "Neither drew a click in either week, while Upper East Side and Lenox Hill drew 93 between them this week. In the August 31 – September 13 figures they drew 21 and 20.",
      owner: "Reporting — Figment",
      measure: "Clicks on both in the next report, or a confirmed reason for zero.",
    },
    {
      action: "Clean the White Party list before any further send",
      why: "The same 12 of 44 contacts did not receive either of the last two sends. Repeat failures at 27% affect delivery for every campaign from the account.",
      owner: "Email — Figment",
      measure: "Undelivered on the next send to this list, against 27%.",
    },
    {
      action: "Re-pull search on Wednesday, September 23",
      why: "Saturday and Sunday read 0 and 2 clicks. The week before rose from 41 to 45 clicks after its first reading.",
      owner: "Reporting — Figment",
      measure: "Final search clicks and impressions for September 14 – 20.",
    },
    {
      action: "Align the social update’s source with the export",
      why: "Seven of nine figures in this week’s update differed from Metricool’s export, in both directions. They were corrected, but the correction should not be needed.",
      owner: "Social — Figment",
      measure: "Next week’s update matching the export without changes.",
    },
  ],

  /* ---------------------------------------------------------------- DETAIL */
  detail: {
    subtitles: {
      instagram: "September 14 – 20 · account totals from Metricool",
      search: "September 14 – 20 · Google Search Console",
      website: "September 14 – 20 · Google Analytics",
      links: "September 14 – 20 · Short.io",
    },

    instagram: {
      kv: [
        { k: "Views", v: "4,380" },
        { k: "Reach per day", v: "239" },
        { k: "Accounts engaged", v: "188" },
        { k: "Followers", v: "764" },
        { k: "Content published", v: "7" },
        { k: "Interactions", v: "198" },
      ],
      publishedChart: {
        title: "What was published",
        note: "7 pieces, the same number as the week before, with one more reel and one fewer post.",
      },
      published: [
        { label: "Stories", value: 4 },
        { label: "Reels", value: 2 },
        { label: "Feed posts", value: 1 },
      ],
      postsChart: {
        title: "The three feed pieces published this week",
        note: "Ranked by views. Engagement is interactions divided by reach.",
      },
      posts: [
        { t: "Dr. Tamay believes great dental care starts with making patients feel comfortable", f: "Reel", d: "Sep 18", v: "2,464", r: "1,102", i: "163", e: "14.8%" },
        { t: "Behind every great dental practice is an office manager", f: "Post", d: "Sep 17", v: "669", r: "218", i: "22", e: "10.1%" },
        { t: "At NYC Dental Smiles, comprehensive care starts with a team that works together", f: "Reel", d: "Sep 16", v: "311", r: "205", i: "13", e: "6.3%" },
      ],
      interactionsChart: {
        title: "Reels drew almost all the interactions",
        note: "198 interactions on posts and reels. 163 of the 176 reel interactions came from the Tamay reel.",
      },
      interactions: [
        { label: "Reels", value: 176 },
        { label: "Feed posts", value: 22 },
      ],
      viewsChart: {
        title: "Views by format",
        note: "From Metricool’s format summaries. Stories are shown as impressions. These are not summed; the account total of 4,380 is measured separately.",
      },
      viewsByFormat: [
        { label: "Reels", value: 2775 },
        { label: "Feed posts", value: 669 },
        { label: "Stories", value: 239 },
      ],
      storiesTitle: "Stories",
      stories:
        "4 Stories drew 239 impressions, against 111 from 4 the week before. Average reach per Story rose from 28 to 54.",
      note:
        "Account totals are Metricool’s account-level figures, not a sum of individual pieces. Engagement rate is interactions on posts and reels divided by reach: 198 against 1,673 this week and 42 against 700 the week before. Story interactions are not in this week’s export and are not included, so this rate is not comparable with earlier reports that included them. Excluding the Tamay reel, views were 1,916 against 1,978. No advertising ran in either week.",
      clientNote:
        "Account totals come from Metricool’s account-level figures rather than a sum of individual posts. Engagement rate is interactions divided by reach. No advertising ran in either week.",
    },

    search: {
      kv: [
        { k: "Clicks", v: "55" },
        { k: "Impressions", v: "1,055" },
        { k: "Click rate", v: "5.21%" },
      ],
      impressionsChart: {
        title: "Impressions per day",
        note: "Daily appearances in Google results across the week.",
      },
      impressionsSeries: [
        { d: "Sep 14", v: 232 }, { d: "Sep 15", v: 148 }, { d: "Sep 16", v: 124 },
        { d: "Sep 17", v: 167 }, { d: "Sep 18", v: 143 }, { d: "Sep 19", v: 90 },
        { d: "Sep 20", v: 151 },
      ],
      pagesChart: {
        title: "The homepage collects the appearances; the doctor pages collect the clicks",
        note: "Clicks, appearances, click rate and average position by page. The seven doctor pages together drew 19 clicks from 143 appearances.",
      },
      pages: [
        { p: "Homepage", c: "27", i: "819", r: "3.30%", pos: "49.2" },
        { p: "Dr. Michael Chesner", c: "5", i: "54", r: "9.26%", pos: "5.2" },
        { p: "Dr. Maria Tamay", c: "5", i: "25", r: "20.00%", pos: "5.1" },
        { p: "Dr. James Eisdorfer", c: "4", i: "11", r: "36.36%", pos: "8.0" },
        { p: "Dr. Sherman Farahani", c: "3", i: "15", r: "20.00%", pos: "6.1" },
        { p: "Locations", c: "6", i: "92", r: "6.52%", pos: "25.1" },
        { p: "Meet Our Dentists", c: "1", i: "116", r: "0.86%", pos: "33.5" },
        { p: "Dr. Dana Kapparova", c: "1", i: "14", r: "7.14%", pos: "8.7" },
        { p: "Dr. Ben Elchami", c: "1", i: "12", r: "8.33%", pos: "13.5" },
      ],
      devicesChart: {
        title: "Desktop click rate tripled",
        note: "Clicks, appearances, click rate and average position by device. Desktop went from 1.76% to 5.23%.",
      },
      devices: [
        { d: "Desktop", c: "38", i: "726", r: "5.23%", pos: "50.0" },
        { d: "Mobile", c: "17", i: "328", r: "5.18%", pos: "37.3" },
        { d: "Tablet", c: "0", i: "1", r: "0%", pos: "11.0" },
      ],
      queriesChart: {
        title: "Searches that name the practice or a doctor bring the clicks",
        note: "From the query export, which holds 15 of the 55 clicks and 773 of the 1,055 appearances. Useful for share, not for totals.",
      },
      queries: [
        { q: "nyc dental smiles", c: "8", i: "16", r: "50.00%", pos: "1.3" },
        { q: "nyc dental smile", c: "3", i: "3", r: "100.00%", pos: "1.3" },
        { q: "nyc smiles", c: "1", i: "7", r: "14.29%", pos: "2.9" },
        { q: "michael chesner", c: "1", i: "7", r: "14.29%", pos: "5.6" },
        { q: "dr chesner nyc", c: "1", i: "4", r: "25.00%", pos: "5.3" },
        { q: "dana kapparova", c: "1", i: "3", r: "33.33%", pos: "6.3" },
      ],
      brandSplit: {
        title: "Named and general searches",
        note: "Matched on the practice names and doctor surnames. Shares within the query sample, not totals.",
        rows: [
          { k: "Names the practice or a doctor", c: "15", i: "82", r: "18.29%" },
          { k: "General searches", c: "0", i: "691", r: "0%" },
        ],
      },
      note:
        "Totals come from Search Console’s daily export. Saturday and Sunday read 0 and 2 clicks and are likely to rise; re-pull on Wednesday. September 7 – 13 has been restated from 41 clicks and 1,705 appearances to 45 and 1,738. Average position is weighted by appearances across all traffic, 46.0 this week against 55.8. The homepage’s low-ranking appearances pull that average down. Doctor-page click rate counts all seven individual doctor pages in both weeks.",
    },

    website: {
      kv: [
        { k: "Sessions", v: "162" },
        { k: "New visitors", v: "109" },
        { k: "Desktop", v: "79%" },
        { k: "Mobile", v: "21%" },
      ],
      sourcesChart: {
        title: "Where visitors came from",
        note: "Sessions by source. Direct means someone typed the address or used a saved link.",
      },
      sources: [
        { label: "Direct", value: 80 },
        { label: "Google — organic", value: 51 },
        { label: "Constant Contact", value: 7 },
        { label: "Bing — organic", value: 5 },
        { label: "nycsmilepass.com", value: 5 },
        { label: "Instagram", value: 4 },
      ],
      deviceChart: {
        title: "Desktop still leads",
        note: "Share of visitors by device, against 77% and 23% the week before.",
      },
      deviceSplit: [
        { label: "Desktop", pct: 79 },
        { label: "Mobile", pct: 21 },
      ],
      landingChart: {
        title: "Where visitors landed",
        note: "Views by landing page. Dr. Tamay’s page and the comprehensive care page both appear in the week their reels ran.",
      },
      landing: [
        { label: "Homepage", value: 132 },
        { label: "Meet Our Dentists", value: 28 },
        { label: "Locations", value: 16 },
        { label: "Dr. Maria Tamay", value: 12 },
        { label: "Comprehensive Care", value: 9 },
      ],
      note:
        "No advertising ran in either week. Visits from Google fell from 60 to 51 while Search Console clicks rose, so the two sources disagree this week.",
    },

    links: {
      kv: [
        { k: "Booking · Upper East Side", v: "49" },
        { k: "Booking · Lenox Hill", v: "44" },
        { k: "Location pages", v: "91" },
        { k: "Homepage link", v: "52" },
      ],
      destsChart: {
        title: "Clicks by link",
        note: "The named NYCDS links with clicks this week. The Murray Hill and Plaza District booking links drew none.",
      },
      dests: [
        { label: "Homepage", value: 52 },
        { label: "Upper East Side — booking", value: 49 },
        { label: "Lenox Hill — booking", value: 44 },
        { label: "Plaza District — information", value: 25 },
        { label: "Upper East Side — information", value: 25 },
        { label: "Lenox Hill — information", value: 23 },
        { label: "Murray Hill — information", value: 18 },
        { label: "Main website", value: 14 },
        { label: "LinkedIn", value: 3 },
      ],
      note:
        "Named links only. 253 clicks this week against 232. The booking links for Upper East Side and Lenox Hill drew 93 against 80, and the four location information links 91 against 97. The Murray Hill and Plaza District booking links drew no clicks in either week. More than a third of clicks in both weeks come from automated sources, a similar share each week, so the comparison holds but the totals run higher than real visits.",
    },

    email: {
      window: "September 14 – 20, 2026 · one campaign",
      note:
        "One campaign went out this week: White Party Email Set 2 on September 15, to the same 44 contacts as the September 9 send. RH NYCDS and White Party Email 2 were covered in the previous report. Percentages are calculated on delivered mail.",
      table: {
        head: ["Campaign", "Sends", "All opens", "Confirmed opens", "Clicks"],
        rows: [
          ["White Party Email Set 2", "44", "11 (34%)", "—", "0"],
        ],
      },
      tableInternal: {
        head: ["Campaign", "Sends", "Delivered", "All opens", "Confirmed", "Clicks", "Bounces"],
        rows: [
          ["White Party Email Set 2", "44", "32", "11 (34%)", "—", "0", "12 (27%)"],
        ],
      },
      tableChart: {
        title: "The one campaign sent this week",
        note: "A second send to the White Party list. Confirmed opens were not pulled for this campaign.",
      },
    },

    facebook: {
      subtitle: "September 14 – 20 · account totals from Metricool",
      kv: [
        { k: "Followers", v: "981" },
        { k: "Views", v: "108" },
        { k: "Page visits", v: "0" },
        { k: "Content published", v: "2" },
      ],
      note:
        "Views 108 against 103, on 2 pieces against 1. Followers 981 against 980. At this scale the figures move on single pieces of content and are reported for completeness.",
    },

    method: [
      { q: "What the report covers", a: "September 14 to 20, 2026, seven full days, Monday to Sunday, compared with September 7 to 13. Both weeks are the same length, so every comparison is direct." },
      { q: "Where the Instagram totals come from", a: "Metricool’s account-level figures, not a sum of individual posts. Per-piece figures are used only to rank content against content." },
      { q: "How engagement rate is calculated", a: "Interactions on posts and reels divided by reach, meaning the share of people who saw something and responded to it. It is not calculated against follower count, which would make the figure look higher than it is." },
      { q: "Why one reel is shown separately", a: "Dr. Tamay’s reel drew 2,464 of the week’s 4,380 views. Reporting the total alone would suggest the whole account doubled. Excluding the reel, views were 1,916 against 1,978." },
      { q: "Why the search figures may change", a: "Google keeps processing search data for several days. Figures for September 7 to 13 rose from 41 to 45 clicks between our first and second readings, so the most recent days of any week are the least settled." },
      { q: "How the doctor page click rate is calculated", a: "All seven individual doctor pages, counted the same way in both weeks: 19 clicks from 143 appearances this week, 15 from 148 the week before." },
      { q: "How short link clicks are counted", a: "Clicks on the practice’s named short links, with automated requests to unrecognized paths removed. The Murray Hill and Plaza District booking links drew no clicks in either week." },
      { q: "How the Social section was checked", a: "Every figure in it was compared with the Metricool export. Seven were corrected to match, so the Social section and the scoreboard agree.", internalOnly: true },
      { q: "What is not in this report", a: "No advertising ran in either week. Confirmed email opens were not pulled for this week’s campaign. Story interactions are not in this week’s Instagram export." },
    ] as { q: string; a: string; internalOnly?: boolean; clientOnly?: boolean }[],
  },

  /* ------------------------------------------------------------ SMILE PASS
     A separate overview, not part of the weekly comparison. Covers August 1 –
     September 20, 2026. Sources: GA4 property "NYC Dental Smiles Membership",
     Meta Ads, Metricool (organic only), Search Console, and the website's own
     sign-up records. See `method` for how each window was handled. */
  smilepass: {
    title: "NYC Smile Pass",
    dateLine: "August 1 – September 20, 2026 · the program’s first weeks",
    lede:
      "An overview of Smile Pass in its first weeks, August 1 – September 20. The August campaign brought 97% of the site’s visitors, and one sign-up came in. Most visits ended on the homepage: Instagram ad visitors averaged under a second, and at most 57 of 2,203 visits went past the first page. GA4 has no sign-up tracking yet, so it cannot connect visits to sign-ups. These are launch figures and a useful baseline for the next campaign.",
    ledeClient:
      "An overview of NYC Smile Pass in its first weeks, from August 1 to September 20. The August launch campaign introduced Smile Pass to 62,053 people and brought more than 2,000 visitors to the site, and one sign-up has come in. With a baseline now in place, the next steps focus on turning visits into members.",
    kv: [
      { k: "People reached by ads", v: "62,053" },
      { k: "Landing page views from ads", v: "1,604" },
      { k: "Cost per landing page view", v: "$0.47" },
      { k: "New website visitors", v: "2,120" },
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
      { d: "Sep 18", v: 1 }, { d: "Sep 19", v: 2 }, { d: "Sep 20", v: 0 },
    ],
    dailyChart: {
      title: "Visits peaked during the August campaign",
      /* indices into `daily`: 10 = Aug 11, 29 = Aug 30 */
      band: { from: 10, to: 29, label: "Aug 11 – 30" },
      note:
        "New website visitors each day. 2,067 of the 2,120 arrived between August 11 and 30, 97%. The campaign ended on August 30. The peak was 204 on August 13. From September 1 to 20 the site drew 17.",
      noteClient:
        "New website visitors each day. Most arrived between August 11 and 30, during the launch campaign. September has been quieter without ads running, as expected for a new site still building its search and social presence.",
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
        "One campaign, August 2026 First Month Free, with a $750 lifetime budget, ending August 30. It was set to optimize for landing page views, not sign-ups, and delivered those cheaply. Meta ranks both ads’ conversion rate in the bottom 35% of ads; quality is average. The No Insurance ad had the higher click rate and cheaper views but received 18% of the budget. People reached counts each person once, so the two ad rows add up to more than the campaign total. Meta counts 1,604 landing page views; Google Analytics recorded 2,068 visits from the ads, because the two measure a visit differently.",
      noteClient:
        "One campaign ran, with a $750 budget, and ended on August 30. It was set up to bring people to the site, and it did so at 47 cents a visit. The No Insurance message drew a higher click rate than the general one. People reached counts each person once, so the two ads add up to more than the campaign total. Meta counts 1,604 landing page views, while Google Analytics recorded 2,068 visits from the ads; the two tools measure a visit slightly differently.",
    },
    sources: {
      title: "How visitors engaged, by source",
      table: {
        head: ["Source", "Visits", "Share that engaged", "Average time on site"],
        rows: [
          ["Instagram ads", "1,638", "3.7%", "0.7 seconds"],
          ["Facebook ads", "430", "10.9%", "4.7 seconds"],
          ["Direct", "78", "23.1%", "8.4 seconds"],
          ["Instagram and Facebook, unpaid", "28", "42.9%", "9.3 seconds"],
          ["Google search", "19", "42.1%", "11.3 seconds"],
        ],
      },
      note:
        "Instagram ad visitors, 1,638 of the 2,199 visits, engaged 3.7% of the time and averaged 0.7 seconds. Facebook ad visitors engaged three times as often. Across the site, 2,203 visits produced 2,260 page views, so at most 57 visits went past the first page. 9 visits landed directly on /join, and GA4 recorded 4 clicks in total. Bing (2) and unassigned (3) are not shown. These totals run to September 21, a partial day that adds 4 visitors.",
      noteClient:
        "A visit counts as engaged if it lasted at least 10 seconds or included a second page. Visitors from Google, direct visits and Facebook ads spent the most time on the site; Instagram ad visits were typically brief. Sources with fewer than 5 visits are not shown.",
    },
    social: {
      title: "Smile Pass on social",
      table: {
        head: ["", "Instagram", "Facebook"],
        rows: [
          ["Followers", "27 · up 11", "3 · up 3"],
          ["Pieces published", "28 · 15 posts, 4 reels, 9 Stories", "9 · 5 posts, 4 reels"],
          ["Average reach per post", "44", "6"],
          ["Reels", "574 views · 116 average reach", "727 video views"],
          ["Strongest piece", "Sep 17 reel · 336 views · 275 reach", "—"],
        ],
      },
      note:
        "Unpaid content only. Metricool’s account-level reach and view totals include delivery from the ad campaign, so they are not used: Facebook reports 22,740 views on an account with 3 followers. The strongest organic piece was the September 17 reel, “Be honest: when was your last dentist appointment?”, with 336 views and 275 reach.",
      noteClient:
        "Unpaid posts only. Both accounts are in their first weeks, and Instagram has grown to 27 followers, up 11. The strongest post was the September 17 reel asking when you last saw a dentist, with 336 views.",
    },
    search: {
      title: "Search",
      kv: [
        { k: "Clicks from Google", v: "3" },
        { k: "Appearances in Google", v: "126" },
        { k: "Most common search", v: "“nyc dental smiles”" },
      ],
      note:
        "Seven weeks of Search Console data. Of the searches Google reports, 52 appearances were for “nyc dental smiles” and none mentioned Smile Pass. Google withholds low-volume searches, so the list covers 56 of the 126 appearances.",
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
          b: "One sign-up across 2,120 new visitors and $749.85 in ad spend. At most 57 of 2,203 visits went past the first page, and Meta rates both ads’ conversion in the bottom 35%.",
          client: { t: "Turning visits into sign-ups is the next focus", b: "One sign-up came in over the period. Most visitors viewed the homepage without continuing to the sign-up page, which shows where to focus next." },
        },
        {
          t: "Facebook ad visitors were more engaged than Instagram’s",
          b: "10.9% of Facebook ad visits engaged against 3.7% from Instagram, averaging 4.7 seconds against 0.7. Instagram took 79% of the ad visits.",
          client: { t: "Facebook ad visitors stayed longer", b: "Visitors from Facebook ads were three times as likely to engage as visitors from Instagram ads, and stayed longer on the site." },
        },
        {
          t: "Traffic follows the ads for now",
          b: "17 new visitors from September 1 to 20. Search drew 3 clicks in seven weeks and the social accounts have 27 and 3 followers, so there is no steady source of visitors yet.",
          client: { t: "Search and social are still building", b: "As a new program, Smile Pass is still building its own search and social presence, so most visits so far have come from the campaign." },
        },
        {
          t: "GA4 cannot see sign-ups",
          b: "No sign-up event is set up, so GA4 shows zero regardless of what happens. The one sign-up is from the website’s own records. Setting this up is the first step for the next campaign, and it lets Meta optimize for sign-ups.",
          client: { t: "Sign-ups are not yet tracked in Google Analytics", b: "The sign-up count comes from the website’s own records. Google Analytics is not yet set up to record sign-ups, so it cannot show which visits led to one. We are setting that up." },
        },
      ],
    },
    next: {
      title: "What we’d do next",
      items: [
        { t: "Track sign-ups in Google Analytics and Meta", b: "Record each completed sign-up as a key event, so every future report and campaign is measured on sign-ups rather than visits." },
        { t: "Set the next campaign to optimize for sign-ups", b: "The August campaign was set to find people likely to open the page. Once sign-ups are tracked, Meta can look for people likely to join instead." },
        { t: "Review the path from homepage to sign-up", b: "Most visitors viewed only the homepage. Walking through each step from the ad to a completed sign-up on a phone will show where to make joining easier." },
        { t: "Lead with the No Insurance message", b: "It drew a higher click rate, 3.12% against 2.49%, at a lower cost per visit, on 18% of the budget." },
        { t: "Introduce Smile Pass to NYC Dental Smiles’ audience", b: "NYC Dental Smiles has 764 Instagram followers and about 160 website visits a week. Smile Pass has 27 followers. Shared posts and links from the main practice reach people who already know it." },
      ],
    },
    method:
      "New visitor totals come from GA4’s daily series, trimmed to August 1 – September 20. Other GA4 totals run to September 21, a partial day that adds 4 visitors to a base of more than 2,100. Ad figures are Meta’s August export; the campaign spent its full $750 lifetime budget inside August and ended August 30, so nothing ran in September. Social figures are organic only, because Metricool’s account totals include ad delivery. Search covers August 1 – September 21; September 21 recorded nothing. The sign-up count is from the website’s own records, not GA4. Four weekly traffic files in the export belonged to the EEC and NYC Dental Smiles properties and were excluded.",
    methodClient:
      "Figures cover August 1 to September 20, 2026. Website figures are from Google Analytics, ad figures from Meta, social figures from Metricool and search figures from Google Search Console. The sign-up count is from the website’s own records. Social figures cover unpaid posts only.",
  },
};

type SectionDef = { id: string; label: string; internalOnly?: boolean; clientOnly?: boolean };

export const ALL_SECTIONS: SectionDef[] = [
  { id: "brief", label: "The brief" },
  { id: "period", label: "The period" },
  { id: "scoreboard", label: "Scoreboard" },
  { id: "worked", label: "What worked" },
  { id: "social", label: "Social" },
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
  { k: "Instagram", v: "Sep 14 – 20", p: "Account-level figures from Metricool, against Sep 7 – 13." },
  { k: "Facebook", v: "Sep 14 – 20", p: "Account-level figures from Metricool." },
  { k: "Search", v: "Sep 14 – 20", p: "Against Sep 7 – 13, restated to 45 clicks on 1,738 appearances. The last days of this week may still rise." },
  { k: "Website", v: "Sep 14 – 20", p: "Full days." },
  { k: "Email", v: "Sep 14 – 20", p: "One campaign, sent September 15." },
  { k: "Short links", v: "Sep 14 – 20", p: "Named links. Two of the four booking links drew no clicks." },
  { k: "Smile Pass", v: "Aug 1 – Sep 20", p: "An overview of activity to date, separate from the weekly figures." },
];
