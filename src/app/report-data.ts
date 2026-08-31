/* ==========================================================================
   REPORT DATA  ·  NYC Dental Smiles
   --------------------------------------------------------------------------
   The only file that changes between reporting cycles. Edit the figures and
   narrative strings here; never edit page.tsx.

   Section titles, section ledes and chart headings now live in REPORT.copy
   and REPORT.detail. page.tsx holds no copy of its own.
   ========================================================================== */

/* ============================================================================
   NYC DENTAL SMILES — PERFORMANCE BRIEFING
   ----------------------------------------------------------------------------
   All figures live in REPORT below. The presentation layer reads from it and
   holds no numbers of its own.

   Nothing here is estimated or inferred. Every value is carried from a source
   export, or is plain arithmetic on two figures already present.

   SOURCE WINDOWS — all four aligned this cycle for the first time:
     Instagram (Metricool)              Aug 17 – Aug 30, 2026
     Search Console                     Aug 17 – Aug 30, 2026
     Website (GA4)                      Aug 17 – Aug 30, 2026
     Short links (Short.io)             Aug 17 – Aug 30, 2026
     Email (Constant Contact)           Aug 1 only — outside the window

   NOT IN THIS CYCLE — absent rather than empty. No section is rendered as a
   frame with nothing in it:
     - No paid campaigns ran, in this period or the one before it.
     - Facebook was not pulled.
     - Search Console device and query breakdowns were not pulled, so the
       brand / non-brand split is not reported this cycle.
     - Search Console daily impressions were not pulled, so there is no
       impressions-per-day chart.
     - Instagram reel retention, follower age, gender and city were not pulled.
     - Short.io city-level data was not pulled.
     - No email campaign was sent inside the window. The August 1 sends are
       shown for reference and compared with nothing.

   RESTATEMENT — last period's search figures have moved. That report was built
   while August 16 was still processing in Search Console and recorded 117
   clicks on 5,446 impressions. Complete, the comparison window (Aug 1 – 16)
   holds 125 clicks on 6,367 impressions. All comparisons here use the
   restated figures.
============================================================================ */

/* ---------------------------------------------------------------------------
   VARIANT — the only line that differs between the two reports.

     "client"    Brief · Period · Scoreboard · What worked · What we learned ·
                 Supporting detail
     "internal"  the above, plus Needs attention and Recommended next moves

   Section numbering, the section nav and the reporting-window strip all follow
   from this automatically. Nothing else needs editing to switch.
--------------------------------------------------------------------------- */
type Variant = "client" | "internal";

/* Set per Vercel project, not per file. Both deployments build from the same
   commit; only this environment variable differs.

     client project    NEXT_PUBLIC_REPORT_VARIANT unset, or "client"
     internal project  NEXT_PUBLIC_REPORT_VARIANT = "internal"

   The NEXT_PUBLIC_ prefix is required: this is a client component, so the value
   has to be inlined at build time. Anything other than "internal" falls back to
   the client report, so a missing or misspelt variable can never leak the
   internal version. */
export const VARIANT: Variant =
  process.env.NEXT_PUBLIC_REPORT_VARIANT === "internal" ? "internal" : "client";
export const IS_INTERNAL: boolean = VARIANT === "internal";

export const REPORT = {
  client: { name: "NYC Dental Smiles", short: "NYCDS", agency: "Figment Creative" },

  period: {
    label: "August 17 – 30, 2026",
    length: "14 days",
    comparedWith: "the 15 days before it (August 2 – 16)",
    paidStatus:
      "No advertising ran in this period or the one before it. Both halves of August were organic, which makes this the first straight like-for-like comparison of the year.",
  },

  /* ---------------------------------------------------------- SECTION COPY
     Section titles and ledes. These change with the story each cycle, so they
     belong here rather than in the presentation layer. */
  copy: {
    scoreboard: {
      title: "The numbers that matter, and what each one means",
      lede: "Nine measures. Where a comparison would mislead, the figure gets context instead of a percentage change.",
    },
    worked: {
      title: "Two doctor pages and two clinical posts carried the period",
      galleryTitle: "The six strongest pieces this period, ranked by views",
    },
    attention: {
      title: "What needs attention",
      lede: "Five things worth a second look, each labeled so it is clear which ones to act on and which ones to just note.",
    },
    learned: {
      title: "What we learned",
      lede: "Six things worth carrying into the next cycle.",
    },
    moves: {
      title: "Recommended next moves",
      lede: "Five actions for the next cycle, each with the reason behind it and the number that will show whether it worked.",
    },
    detail: {
      title: "Supporting detail",
      lede: "Everything above, with the full figures behind it. Open only what you need.",
    },
  },

  /* ------------------------------------------------------------- THE BRIEF */
  brief: {
    title: "The Brief",
    lede: "A concise summary of the period\u2019s performance, key findings, and recommended actions.",
    head: "The site held flat with no advertising behind it, and the doctor pages are now the strongest thing we have in search.",
    /* Client build. Same period, same facts, opening on what the work achieved
       rather than on what held steady. */
    headClient: "The website held steady, and the individual doctor pages are the strongest thing it has in search. They convert at thirteen times the rate of the site as a whole.",
    items: [
      {
        role: "The outcome",
        text: "Website visits per day were flat: 25.4 against 25.3. Search clicks were near flat at \u22123.1% a day, with impressions up 11%. No advertising ran in either period, so this is a clean read.",
        client: {
          role: "The standout",
          text: "Three doctor pages drew 27 clicks from 121 appearances in Google. That is a 22.3% click rate, against 1.71% across the site. Two of them are also among the five most visited pages on the website.",
        },
      },
      {
        role: "Strongest signal",
        text: "Doctor pages convert search traffic at 22.3% against 1.71% site-wide. The homepage runs the other way: 4,912 impressions, 60 clicks, 1.2%. The visibility sits on the page that converts least.",
        client: {
          role: "The wider picture",
          text: "Website visits held at about 25 a day, and Google showed the site 11% more often than in the period before. Instagram published 15 pieces against 10, and the share of people engaging with what they saw rose from 7.72% to 10.66%. The content is performing well with the audience it reaches.",
        },
      },
      {
        role: "What softened",
        text: "Instagram views fell 20% a day and link clicks 24%, with follower growth slowing from +15 to +4. Engagement rate rose over the same stretch, so this is reach narrowing, not content weakening.",
        client: {
          role: "What we are monitoring",
          text: "Instagram reached fewer people this period, but a greater share of them engaged. The content is performing well with the audience it reaches, so the work now is widening that audience. We track this weekly and will keep reporting on it.",
        },
      },
      {
        role: "Next action",
        text: "Put a booking link at the top of every doctor page. They already rank on page one and convert better than anything else on the site.",
        client: {
          role: "The opportunity",
          text: "The doctor pages already rank well and draw a high share of the people who see them. Making it easier to book from those pages is the next step, and it is what we are taking on first.",
        },
      },
    ] as { role: string; text: string; client?: { role: string; text: string } }[],
  },

  /* ------------------------------------------------------------ SCOREBOARD */
  scoreboard: [
    {
      metric: "Book now clicks",
      value: "23",
      sub: "Instagram profile",
      dir: "none",
      change: "First cycle this has been reported",
      reading:
        "People who tapped Book now on the Instagram profile. It is the closest thing the account has to a direct measure of booking intent, and it is the number to beat next cycle.",
      tone: "",
    },
    {
      metric: "Website visits per day",
      value: "25.4",
      sub: "Sessions, daily average",
      dir: "flat",
      change: "25.3 a day in the 15 days before",
      reading:
        "Flat to within a rounding error. The totals differ, 356 against 379, because the earlier window was a day longer. That is why this is reported per day.",
      tone: "tone-good",
    },
    {
      metric: "Search clicks",
      value: "106",
      sub: "From Google",
      dir: "down",
      change: "125 in the 16 days before \u00b7 \u22123.1% a day",
      reading:
        "7.6 clicks a day against 7.8. Near flat once the different window lengths are accounted for.",
      tone: "",
    },
    {
      metric: "Search impressions per day",
      value: "442",
      sub: "Times the site appeared",
      dir: "up",
      change: "398 a day in the 16 days before",
      reading:
        "Up 11%. Google showed the site more often, not less. That reverses what the last report recorded, and that report treated the drop as its main open question.",
      tone: "tone-good",
    },
    {
      metric: "Doctor page click rate",
      value: "22.3%",
      sub: "Search, three doctor pages",
      dir: "up",
      change: "1.71% across the whole site",
      reading:
        "27 clicks from 121 impressions. Where these pages appear in Google, people choose them, at thirteen times the rate of the site as a whole.",
      tone: "tone-good",
    },
    {
      metric: "Instagram views",
      value: "5,934",
      sub: "Account total, Metricool",
      dir: "down",
      change: "7,962 in the 15 days before \u00b7 \u221220% a day",
      reading:
        "424 views a day against 531. Fewer views from more content, 15 pieces against 10, but a higher share of viewers engaged. The content is performing well with the audience it reaches.",
      tone: "",
    },
    {
      metric: "Engagement rate",
      value: "10.66%",
      sub: "Interactions \u00f7 reach",
      dir: "up",
      change: "7.72% in the period before",
      reading:
        "218 interactions against reach of 2,044. A smaller audience, and more of it engaged. The content is landing with the people who see it.",
      tone: "tone-good",
    },
    {
      metric: "Followers",
      value: "754",
      sub: "At period close",
      dir: "up",
      change: "+4 this period \u00b7 +15 the period before",
      reading:
        "Growth slowed to +4 from +15, in a period that published 50% more content. Followers track reach, not volume.",
      tone: "",
    },
    {
      metric: "Link clicks",
      value: "101",
      sub: "Short.io, all tracked links",
      dir: "down",
      change: "143 in the period before \u00b7 \u221224% a day",
      reading:
        "7.2 a day against 9.5. 94 came from the six named links. The other seven arrived on untracked paths and are not attributed.",
      tone: "",
    },
  ],

  /* -------------------------------------------- THE PERIOD LINE (signature) */
  periodLine: {
    title: "Website visits held flat across both halves of the month",
    note:
      "New website visitors per day across the 30 days of August. No advertising ran in either half, so this compares one organic period against another rather than showing a step down to a baseline.",
    /* GA4 daily new users, Aug 1 – 30. Aug 1–16 carried from the previous
       report's series; Aug 17–30 from this cycle's export. */
    series: [
      { d: "Aug 1", v: 19 }, { d: "Aug 2", v: 10 }, { d: "Aug 3", v: 21 },
      { d: "Aug 4", v: 19 }, { d: "Aug 5", v: 23 }, { d: "Aug 6", v: 35 },
      { d: "Aug 7", v: 19 }, { d: "Aug 8", v: 12 }, { d: "Aug 9", v: 7 },
      { d: "Aug 10", v: 34 }, { d: "Aug 11", v: 26 }, { d: "Aug 12", v: 30 },
      { d: "Aug 13", v: 20 }, { d: "Aug 14", v: 14 }, { d: "Aug 15", v: 7 },
      { d: "Aug 16", v: 8 }, { d: "Aug 17", v: 15 }, { d: "Aug 18", v: 30 },
      { d: "Aug 19", v: 21 }, { d: "Aug 20", v: 23 }, { d: "Aug 21", v: 9 },
      { d: "Aug 22", v: 7 }, { d: "Aug 23", v: 13 }, { d: "Aug 24", v: 24 },
      { d: "Aug 25", v: 20 }, { d: "Aug 26", v: 26 }, { d: "Aug 27", v: 29 },
      { d: "Aug 28", v: 16 }, { d: "Aug 29", v: 12 }, { d: "Aug 30", v: 12 },
    ],
    /* Index of the last day of the previous reporting period (Aug 16). The
       chart draws each half's average either side of it. */
    splitAt: 15,
    /* No shaded stretch this cycle — there was no advertising in either half.
       Set to a { through, label } object to shade a paid flight again. */
    shade: null as { through: number; label: string } | null,
    markers: [] as { i: number; label: string }[],
    /* derived: 304 visitors ÷ 16 days = 19.0; 257 ÷ 14 = 18.4 */
    bands: [
      { label: "August 1 – 16", value: "19 a day", detail: "Previous reporting period" },
      { label: "August 17 – 30", value: "18 a day", detail: "This period" },
    ],
    read: {
      title: "Reading this fairly:",
      body: "Both halves are the same kind of period, with no advertising in either. New visitors moved from 19 a day to 18, inside normal week-to-week variation. Sessions were flatter still, 25.3 against 25.4. The line is noisy day to day and level across the month.",
    },
  },

  /* ----------------------------------------------------------- WHAT WORKED */
  worked: {
    /* Internal build only. */
    lede: "Two findings this period. The doctor pages convert search traffic at thirteen times the site-wide rate, and the two strongest Instagram pieces were both clinical rather than team content. That is the opposite of what last period found.",
    lead: {
      kind: "Post",
      title: "The final smile is only part of the story",
      date: "August 28",
      url: "https://www.instagram.com/p/Dcl2RKFFgKc/",
      why:
        "It drew 1,102 views and reached 390 accounts, more than anything else published and about three times the next piece down. 27 interactions on that reach is 6.9%, below the account average for the period. It went further than it engaged. The subject is an All-on-6 case, the practice's highest-value service.",
      repeatable:
        "The August 27 reel is the counterweight. Fewer views at 878, but 47 interactions on 430 reach is 10.9%, the best engagement of the period. Reach and engagement came from two different pieces, published a day apart on related subjects. Running a reel and a post on the same subject on purpose is the test worth setting up.",
    },
    /* Top content published inside this period, ranked by views. Six of the
       fifteen pieces published. Engagement is interactions ÷ reach. */
    gallery: [
      {
        title: "The final smile is only part of the story", format: "Post", date: "Aug 28",
        url: "https://www.instagram.com/p/Dcl2RKFFgKc/",
        views: "1,102", reach: "390", er: "6.9%", lead: true,
      },
      {
        title: "The doctor. The process. The final result.", format: "Reel", date: "Aug 27",
        url: "https://www.instagram.com/reel/DcjkaPlxmaH/",
        views: "878", reach: "430", er: "10.9%", lead: false,
      },
      {
        title: "The best technology doesn\u2019t make care feel complicated", format: "Reel", date: "Aug 21",
        url: "https://www.instagram.com/reel/DcTt74bB-qy/",
        views: "339", reach: "178", er: "11.8%", lead: false,
      },
      {
        title: "What makes you trust someone with your smile?", format: "Reel", date: "Aug 20",
        url: "https://www.instagram.com/reel/DcRJEtzBRTw/",
        views: "336", reach: "221", er: "6.3%", lead: false,
      },
      {
        title: "There\u2019s a shift happening in cosmetic dentistry", format: "Post", date: "Aug 19",
        url: "https://www.instagram.com/p/DcOrKPQiLi1/",
        views: "289", reach: "117", er: "6.8%", lead: false,
      },
      {
        title: "What it feels like to finally feel good", format: "Reel", date: "Aug 24",
        url: "https://www.instagram.com/reel/Dcbde6LB9vg/",
        views: "188", reach: "100", er: "9.0%", lead: false,
      },
    ],
    galleryNote:
      "The six strongest of the 15 pieces published between August 17 and 30, ranked by views. Engagement is interactions divided by reach. These are per-post figures. The account total shown earlier is measured separately, and the two will not add up.",
    channel: {
      title: "The doctor pages convert search traffic at thirteen times the site-wide rate",
      body:
        "Three doctor pages drew 27 clicks from 121 impressions in Google, a 22.3% click rate against 1.71% across the site. Dr. Farahani\u2019s page converts at 29.6% and Dr. Eisdorfer\u2019s at 25.5%. Two of them are also among the five most visited pages on the website, at 73 and 21 views. The homepage runs the other way: 4,912 impressions, 60 clicks, 1.2%. The visibility sits on the page that converts least. The pages that convert are the ones people rarely see.",
    },
  },

  /* -------------------------------------------------------- WHAT NEEDS WORK */
  attention: [
    {
      tag: "early",
      title: "Instagram views fell 20% a day, on more content rather than less",
      body:
        "424 views a day against 531, from 15 pieces against 10. Average daily reach fell from 210 to 146. Engagement rate moved the other way, 7.72% to 10.66%, and follower growth slowed from +15 to +4.",
      so:
        "Fewer people reached, more of them engaging. The content is performing with the audience it reaches, so this is a distribution question rather than a content one. Falling reach alongside rising engagement usually means distribution narrowed toward existing followers, but the split runs the other way: 3,421 views from non-followers against 2,318 from followers. One more period will show whether this is a distribution change or just a quiet two weeks.",
    },
    {
      tag: "issue",
      title: "The 5th Avenue email list bounced at 13%",
      body:
        "99 of 774 sends on August 1 did not reach an inbox. The other three location lists bounced between 4% and 6% on the same day with the same content. 35th Street, the smallest list at 154 contacts, opened lowest at 43%, as it did last period.",
      so:
        "A 13% bounce rate is a list problem, not a content one. Sustained at that level it affects deliverability for every campaign sent from the account, not just this list. Worth cleaning before the next send. It sits outside the reporting window and is here because it is actionable, not because it is comparable.",
    },
    {
      tag: "expected",
      title: "Link clicks fell 24% a day alongside Instagram reach",
      body:
        "101 clicks against 143, or 7.2 a day against 9.5. 94 came from the six named links, and the four location links took 73 of those. That is 78% of named clicks, unchanged from last period.",
      so:
        "Instagram drives most of these links, and Instagram views fell by a similar 20%. The two move together, which points at reach rather than the links themselves. The location share holding steady says the behavior is unchanged even as the volume dropped.",
    },
    {
      tag: "early",
      title: "Last cycle\u2019s team-content recommendation appears not to have been actioned",
      body:
        "The previous report recommended two more team and culture posts, to test whether the August 6 BBQ carousel result repeated or was a one-off. No team content appears in the 15 pieces published this period, and the two strongest pieces are both clinical.",
      so:
        "The test has not been run, so the question that recommendation opened is still open. Worth confirming with the practice whether it was scheduled and slipped or declined, before the recommendation is repeated for a third cycle.",
    },
    {
      tag: "limitation",
      title: "Several sources were not pulled this cycle, and last period\u2019s search figures have been restated",
      body:
        "Facebook, Search Console device and query breakdowns, Search Console daily impressions, Instagram reel retention, follower demographics and Short.io city data are absent from this report. The brand / non-brand search split depends on the query export and is not reported. Separately, the previous report recorded 117 search clicks on 5,446 impressions; complete, that window holds 125 clicks on 6,367 impressions.",
      so:
        "Nothing has been estimated to fill the gaps. Those sections are absent rather than shown as empty frames. The restatement matters because the previous report treated falling impressions as its main open question. On the corrected figures, impressions rose 11% a day into this period. Restoring the missing exports to the weekly pull is on the next-moves list.",
    },
  ],

  /* --------------------------------------------------------- WHAT WE LEARNED */
  learned: [
    { f: "22.3%", u: "click rate on doctor pages", t: "against 1.71% across the site. 27 clicks from 121 impressions in Google, and the strongest single finding in this report." },
    { f: "23", u: "Book now clicks", t: "on the Instagram profile, plus 73 clicks through to a location page. This is the account\u2019s booking-intent measure and the number to beat next cycle." },
    { f: "25.4", u: "website visits a day", t: "against 25.3 in the period before. Flat, in a month with no advertising in either half." },
    { f: "10.66%", u: "Instagram engagement rate", t: "up from 7.72%. Reach fell, and the share of people engaging with what they saw rose nearly three points. The content is performing well with the audience it reaches." },
    { f: "78%", u: "of named link clicks", t: "went to a specific office rather than the main site, unchanged from last period. People choose a location before they arrive." },
    { f: "+11%", u: "search impressions a day", t: "442 against 398. Google showed the site more often while clicks held near flat." },
  ],

  /* ------------------------------------------------------------- NEXT MOVES */
  moves: [
    {
      action: "Put a booking link at the top of every doctor page",
      why: "Doctor pages convert search traffic at 22.3% against 1.71% site-wide, and they already rank on page one. They are the strongest pages the site has, and the shortest path from a search result to a booking.",
      owner: "Web \u2014 Figment",
      measure: "Clicks from doctor pages through to the booking system next cycle.",
    },
    {
      action: "Clean the 5th Avenue list before the next send",
      why: "99 of 774 sends did not reach an inbox, against 4\u20136% on the other three lists with identical content. Sustained at that level it affects deliverability for every campaign sent from the account.",
      owner: "Email \u2014 Figment, with practice input on list origin",
      measure: "Bounce rate on the next all-location send, against the other three lists.",
    },
    {
      action: "Pair a reel and a post on one clinical subject",
      why: "The August 28 post led on views and the August 27 reel led on engagement, a day apart on related subjects. Running the pairing on purpose shows whether the two formats reach different people or the same ones twice.",
      owner: "Social \u2014 Figment",
      measure: "Combined reach against the 390 and 430 those two pieces reached separately.",
    },
    {
      action: "Confirm the team-content test with the practice",
      why: "We recommended it last cycle and no team content was published. Repeating a recommendation nobody acted on wastes a cycle. Knowing whether it slipped or was declined settles it either way.",
      owner: "Account \u2014 Figment, with Adriana",
      measure: "A yes or no before the next content calendar is set.",
    },
    {
      action: "Restore the missing exports to the weekly pull",
      why: "Facebook, Search Console device and query data, daily impressions, reel retention and Short.io cities were all missing this cycle. The brand / non-brand search split cannot be reported without the query export.",
      owner: "Reporting \u2014 Figment",
      measure: "A complete export set at the start of the next cycle.",
    },
  ],

  /* ---------------------------------------------------------------- DETAIL */
  detail: {
    /* Panel subtitles. Dates live here, never in page.tsx. */
    subtitles: {
      instagram: "August 17 \u2013 30 \u00b7 account totals from Metricool",
      search: "August 17 \u2013 30 \u00b7 Google Search Console",
      website: "August 17 \u2013 30 \u00b7 Google Analytics",
      links: "August 17 \u2013 30 \u00b7 Short.io",
    },

    instagram: {
      kv: [
        { k: "Views", v: "5,934" },
        { k: "Accounts engaged", v: "133" },
        { k: "Avg reach / day", v: "146" },
        { k: "Followers", v: "754" },
        { k: "Content published", v: "15" },
        { k: "Book now clicks", v: "23" },
      ],
      publishedChart: {
        title: "What was published",
        note: "15 pieces across three formats, up from 10 in the period before.",
      },
      published: [
        { label: "Stories", value: 9 },
        { label: "Reels", value: 4 },
        { label: "Feed posts", value: 2 },
      ],
      postsChart: {
        title: "The six strongest pieces this period",
        note: "Ranked by views. Engagement is interactions divided by reach.",
      },
      posts: [
        { t: "The final smile is only part of the story", f: "Post", d: "Aug 28", v: "1,102", r: "390", i: "27", e: "6.9%" },
        { t: "The doctor. The process. The final result.", f: "Reel", d: "Aug 27", v: "878", r: "430", i: "47", e: "10.9%" },
        { t: "The best technology doesn\u2019t make care feel complicated", f: "Reel", d: "Aug 21", v: "339", r: "178", i: "21", e: "11.8%" },
        { t: "What makes you trust someone with your smile?", f: "Reel", d: "Aug 20", v: "336", r: "221", i: "14", e: "6.3%" },
        { t: "There\u2019s a shift happening in cosmetic dentistry", f: "Post", d: "Aug 19", v: "289", r: "117", i: "8", e: "6.8%" },
        { t: "What it feels like to finally feel good", f: "Reel", d: "Aug 24", v: "188", r: "100", i: "9", e: "9.0%" },
      ],
      interactionsChart: {
        title: "Where the interactions came from",
        note: "218 interactions across the period, by format. Four reels drew nearly two thirds of them.",
      },
      interactions: [
        { label: "Reels", value: 137 },
        { label: "Feed posts", value: 46 },
        { label: "Stories", value: 35 },
      ],
      viewsChart: {
        title: "Views by format",
        note: "Metricool\u2019s format breakdown totals 5,774 against the account figure of 5,934. The two are measured differently, so this shows share and is never summed into a total.",
      },
      viewsByFormat: [
        { label: "Reels", value: 2369 },
        { label: "Carousels", value: 1765 },
        { label: "Stories", value: 1307 },
        { label: "Feed posts", value: 333 },
      ],
      storiesTitle: "Stories",
      stories:
        "Nine stories drew 1,307 views and 35 interactions. Stories carry more volume than feed posts, but they still work as filler between posts rather than as a channel that drives engagement.",
      note:
        "Account totals are Metricool\u2019s account-level figures for August 17 \u2013 30, not a sum of individual posts. Post-level rows are used only to rank content against content. Reel retention, follower age, gender and city were not in this export and are not shown. Non-followers accounted for 3,421 of the views against 2,318 from followers, the reverse of what a narrowing reach would produce.",
      /* The client build names the source and drops the reconciliation caveat,
         which raises a question about accuracy without giving the reader any
         way to act on it. Provenance is kept; the internal note keeps the rest. */
      clientNote:
        "Account totals are Metricool\u2019s account-level figures for August 17 \u2013 30, rather than a sum of the individual posts. Post-level rows are used only to rank content against content. Reel retention and follower demographics were not included in this export and are not shown.",
    },

    search: {
      kv: [
        { k: "Clicks", v: "106" },
        { k: "Impressions", v: "6,195" },
        { k: "Click rate", v: "1.71%" },
      ],
      pagesChart: {
        title: "The homepage collects the impressions; the doctor pages collect the clicks",
        note: "Clicks and impressions by page in Google Search. The three doctor pages together drew 27 clicks from 121 impressions.",
      },
      pages: [
        { p: "Homepage", c: "60", i: "4,912", r: "1.2%" },
        { p: "Dr. James Eisdorfer", c: "12", i: "47", r: "25.5%" },
        { p: "Dr. Sherman Farahani", c: "8", i: "27", r: "29.6%" },
        { p: "Dr. Maria Tamay", c: "7", i: "47", r: "14.9%" },
        { p: "Locations", c: "5", i: "267", r: "1.9%" },
      ],
      note:
        "Totals come from Search Console\u2019s daily chart export, which is complete. Average position across the site is 59.9, weighted by impressions. The homepage\u2019s 4,912 low-ranking impressions dominate that number, so it is not a useful summary of how the site performs. The page table is a sample. Google withheld 75% of clicks and 30% of impressions, so the rows will not sum to the totals. Device and query breakdowns were not pulled this cycle. The comparison figures for August 1 \u2013 16 have been restated to 125 clicks on 6,367 impressions now that August 16 has finished processing.",
    },

    website: {
      kv: [
        { k: "Sessions", v: "356" },
        { k: "New visitors", v: "257" },
        { k: "Desktop", v: "73%" },
        { k: "Mobile", v: "27%" },
      ],
      sourcesChart: {
        title: "Where visitors came from",
        note: "Sessions by source. Direct means someone typed the address or used a saved link.",
      },
      sources: [
        { label: "Direct", value: 180 },
        { label: "Google — organic", value: 125 },
        { label: "Bing — organic", value: 16 },
        { label: "Instagram", value: 9 },
        { label: "nycsmilepass.com", value: 5 },
      ],
      deviceChart: {
        title: "Desktop still dominates the site",
        note: "Share of sessions by device. Mobile gained seven points on the period before.",
      },
      deviceSplit: [
        { label: "Desktop", pct: 73 },
        { label: "Mobile", pct: 27 },
      ],
      landingChart: {
        title: "Where visitors landed",
        note: "Views by landing page. Two doctor pages sit in the top five.",
      },
      landing: [
        { label: "Homepage", value: 327 },
        { label: "Meet Our Dentists", value: 73 },
        { label: "Locations", value: 32 },
        { label: "Dr. James Eisdorfer", value: 21 },
        { label: "Dr. Ben Elchami", value: 20 },
      ],
      note:
        "No paid sessions were recorded in this period or the one before it. Direct traffic at 51% is typical for a practice people already know by name. Landing page views total 624 against 356 sessions, because one visit can land on more than one page. The five pages above account for 473 of those views.",
    },

    links: {
      kv: [
        { k: "Clicks", v: "101" },
        { k: "From named links", v: "94" },
        { k: "To a location page", v: "73" },
      ],
      destsChart: {
        title: "Most link activity goes to a specific office, not the main site",
        note: "Clicks by destination across the six tracked links.",
      },
      dests: [
        { label: "58th Street", value: 21 },
        { label: "Main website", value: 20 },
        { label: "60th Street", value: 20 },
        { label: "5th Avenue", value: 17 },
        { label: "35th Street", value: 15 },
        { label: "LinkedIn", value: 1 },
      ],
      note:
        "Short.io filters automated traffic natively, and the figures above are its human-click count. Six tracked NYCDS links are included. Links belonging to the periodontal practice are excluded from this report, and none appeared in this window. Seven more clicks arrived on untracked paths and are not attributed to a destination. City-level data was not pulled this cycle.",
    },

    email: {
      window: "August 1, 2026 \u00b7 outside this reporting period",
      note:
        "No campaign was sent between August 17 and 30. The four location campaigns below went out on August 1 and are shown for reference only. They are not compared with anything else in this report.",
      table: {
        head: ["Campaign", "Sends", "Opens", "Clicks"],
        rows: [
          ["58th Street", "954", "450 (50%)", "11 (1%)"],
          ["60th Street", "1,971", "1,090 (58%)", "25 (1%)"],
          ["5th Avenue", "774", "390 (58%)", "12 (2%)"],
          ["35th Street", "154", "62 (43%)", "4 (3%)"],
          ["Total", "3,853", "1,992 (52%)", "52 (1%)"],
        ],
      },
      tableInternal: {
        head: ["Campaign", "Sends", "Opens", "Clicks", "Bounces", "Unsub"],
        rows: [
          ["58th Street", "954", "450 (50%)", "11 (1%)", "51 (5%)", "3"],
          ["60th Street", "1,971", "1,090 (58%)", "25 (1%)", "76 (4%)", "6"],
          ["5th Avenue", "774", "390 (58%)", "12 (2%)", "99 (13%)", "4"],
          ["35th Street", "154", "62 (43%)", "4 (3%)", "9 (6%)", "0"],
          ["Total", "3,853", "1,992 (52%)", "52 (1%)", "235 (6%)", "13"],
        ],
      },
      tableChart: {
        title: "The August 1 location sends",
        note: "Open rates run between 43% and 58%, all above the healthcare benchmark. 35th Street is the smallest list at 154 contacts and opens lowest, as it did last period.",
      },
    },

    method: [
      { q: "Where the Instagram totals come from", a: "Account-level figures reported by Metricool for August 17 \u2013 30, not a sum of individual posts. Metricool\u2019s format breakdowns do not reconcile to the account total: 5,774 by content type and 5,741 by follower type, against 5,934. They show share and are never summed. Post-level figures rank content against content only.", internalOnly: true },
      { q: "Where the Instagram totals come from", a: "Account-level figures reported by Metricool for August 17 \u2013 30, rather than a sum of the individual posts. Post-level figures are used only to rank content against content, never to build a total.", clientOnly: true },
      { q: "How engagement rate is calculated", a: "Interactions divided by reach, meaning the share of people who saw something and engaged with it. It is not calculated against follower count, which would flatter the number." },
      { q: "How link clicks are filtered", a: "Short.io filters automated traffic natively, and the figures reported are its human-click count. Six tracked NYCDS links are included. Periodontal practice links are excluded, and none appeared in this window." },
      { q: "How search totals are calculated", a: "From Search Console\u2019s daily chart export, which is complete. The page-level table is a sample, because Google withholds low-volume rows. It withheld 75% of clicks and 30% of impressions in this window, so those rows will not sum to the totals." },
      { q: "Why the search comparison covers sixteen days", a: "Search Console is compared against August 1 \u2013 16 while the website and Instagram are compared against August 2 \u2013 16. That earlier window has also been restated. The previous report was built while August 16 was still processing and recorded 117 clicks on 5,446 impressions, against 125 on 6,367 once complete. Per-day figures are used wherever the window lengths differ." },
      { q: "Which dates each figure covers", a: "Instagram, search, website and short links all cover August 17 \u2013 30, aligned for the first time this cycle. Email is the exception. No campaign was sent inside the window, so the August 1 sends are shown for reference and compared with nothing." },
      { q: "What is missing this cycle", a: "No paid campaigns ran, so there is no advertising section. Facebook, Search Console device and query breakdowns, daily search impressions, Instagram reel retention, follower demographics and Short.io city data were not pulled and are absent rather than estimated. The brand / non-brand search split depends on the query export and is not reported." },
    ] as { q: string; a: string; internalOnly?: boolean; clientOnly?: boolean }[],
  },
};

/* Explicitly typed rather than inferred: if no section currently carries one of
   the flags, an inferred union would drop that property and the NAV filter
   below would stop compiling. The annotation keeps both flags available whether
   or not any section is using them this cycle. */
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
];

/* Sections present in this build, in order. Numbering and nav both derive from
   this, so removing a section never leaves a gap in the sequence. */
export const NAV = ALL_SECTIONS.filter((x) => (IS_INTERNAL ? !x.clientOnly : !x.internalOnly));
const ORDINALS = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];
export const numOf = (id: string) => ORDINALS[NAV.findIndex((n) => n.id === id)] ?? "";
export const has = (id: string) => NAV.some((n) => n.id === id);

export const SOURCE_WINDOWS = [
  { k: "Instagram", v: "Aug 17 – 30", p: "Account-level figures from Metricool. Facebook was not pulled this cycle." },
  { k: "Search", v: "Aug 17 – 30", p: "Compared against Aug 1 – 16, a day wider than the other comparisons, and restated since the last report." },
  { k: "Website", v: "Aug 17 – 30", p: "Full days." },
  { k: "Short links", v: "Aug 17 – 30", p: "Aligned to the reporting window for the first time." },
  { k: "Email", v: "Aug 1 only", p: "No campaign was sent inside the window. Shown for reference and compared with nothing." },
];
