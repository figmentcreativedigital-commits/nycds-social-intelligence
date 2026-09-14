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

   SOURCE WINDOWS — all five aligned this cycle, including email for the first
   time in three cycles:
     Instagram (Metricool)              Aug 31 – Sep 13, 2026
     Facebook (Metricool)               Aug 31 – Sep 13, 2026
     Search Console                     Aug 31 – Sep 13, 2026
     Website (GA4)                      Aug 31 – Sep 13, 2026
     Email (Constant Contact)           Aug 31 – Sep 13, 2026
     Short links (Short.io)             Aug 31 – Sep 13, 2026

   BOTH WINDOWS ARE 14 DAYS, Monday to Sunday. Totals are directly comparable
   for the first time. Per-day figures are still shown where they aid reading,
   but no length adjustment is applied anywhere in this report.

   NOT IN THIS CYCLE — absent rather than empty. No section is rendered as a
   frame with nothing in it:
     - No paid campaigns ran, in this period or the two before it. Metricool's
       Ad column is empty across both views and interactions.
     - Short.io totals and period-over-period change are not reported. See the
       method note: the domain's click data carries automated traffic that
       cannot be separated per link with the current export.
     - Instagram reel retention and follower age and gender were not pulled.

   RESTATEMENT — the comparison window has moved again. The deployed report
   recorded 106 search clicks on 6,195 impressions for Aug 17 – 30. Re-pulled
   on Sep 14, that window holds 108 clicks on 6,576 impressions. All search
   comparisons here use the restated figures.

   BASIS CHANGE — doctor-page click rate. The deployed report reported 22.3%
   from three doctor pages. That was the three strongest, not a rule, and the
   strongest three change every cycle. This report counts all seven individual
   doctor pages, every cycle. On that basis Aug 17 – 30 is 11.3% and this
   period is 8.6%. The comparison shown is 11.3% to 8.6%, like for like. The
   22.3% figure does not appear in this report.

   REMOVED — Instagram Book now clicks. The deployed report carried 23 for
   Aug 17 – 30. Re-pulled, that window shows no Book now clicks and 2 Call
   clicks, and the 30-day window holds the same 2. The 23 is not reproducible
   and the metric is not reported. Email clicks take its place on the
   scoreboard.
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
    label: "August 31 – September 13, 2026",
    length: "14 days",
    comparedWith: "the 14 days before it (August 17 – 30)",
    paidStatus:
      "No advertising ran in this period or the one before it. Both windows are 14 days, Monday to Sunday, so totals compare directly with no adjustment. This is the cleanest read of the year so far.",
  },

  /* ---------------------------------------------------------- SECTION COPY
     Section titles and ledes. These change with the story each cycle, so they
     belong here rather than in the presentation layer. */
  copy: {
    scoreboard: {
      title: "The numbers that matter, and what each one means",
      lede: "Ten measures. Both windows are the same length this cycle, so every comparison below is a direct one, apart from the booking links, which are new.",
    },
    worked: {
      title: "Search got smaller and sharper, and the White Party ran as a pair",
      galleryTitle: "The six pieces published this period, ranked by views",
    },
    attention: {
      title: "What needs attention",
      lede: "Six things worth a second look, each labeled so it is clear which ones to act on and which ones to just note.",
    },
    learned: {
      title: "What we learned",
      lede: "Seven things worth carrying into the next cycle.",
    },
    moves: {
      title: "Recommended next moves",
      lede: "Six actions for the next cycle, each with the reason behind it and the number that will show whether it worked.",
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
    head: "Google showed the site 45% less often and the site converted that visibility 31% better. The impressions that went were mostly ones that never converted.",
    /* Client build. Same period, same facts, opening on what improved rather
       than on what narrowed. */
    headClient: "The site is being found by fewer people and converting more of them. Google showed it less often than last period, and the share of people who clicked through rose by nearly a third.",
    items: [
      {
        role: "The outcome",
        text: "Search impressions fell 45%, from 6,576 to 3,621, while click rate rose from 1.64% to 2.15% and average position improved from 62.8 to 56.6. Clicks fell 28%, less than impressions. No advertising ran in either window and both are 14 days, so this is a clean read.",
        client: {
          role: "The standout",
          text: "The click rate from Google rose from 1.64% to 2.15%, and the site\u2019s average position improved by 6 places. More of the people who saw the site chose it.",
        },
      },
      {
        role: "Strongest signal",
        text: "Mobile converts at 5.08% from position 38.7; desktop converts at 1.45% from position 60.95. Mobile is a fifth of impressions and nearly half of clicks. The seven doctor pages hold 8.6% against 2.15% site-wide, at positions between 8.8 and 12.5 while the site averages 56.6.",
        client: {
          role: "The wider picture",
          text: "The doctor pages are still the strongest part of the site in search. They draw 8.6% of the people who see them against 2.15% across the site, and they rank between 9th and 13th while the site as a whole sits near 57th.",
        },
      },
      {
        role: "What softened",
        text: "Website sessions fell 8.7% to 325 and new visitors 24.5% to 194. Instagram views fell 24% to 4,532 with reach at 118 a day against 147. Engagement rate rose over the same stretch, 10.66% to 11.62%.",
        client: {
          role: "What we are monitoring",
          text: "Instagram reached fewer people this period and a greater share of them engaged, moving from 10.66% to 11.62%. The content is performing well with the audience it reaches, so the work now is widening that audience.",
        },
      },
      {
        role: "Next action",
        text: "The non-brand queries carry the lost impressions and convert at 0.34%. Brand queries convert at 9.09%. The work is to grow the queries that already convert rather than chase the ones that never did.",
        client: {
          role: "The opportunity",
          text: "Searches that name the practice or a doctor convert far better than general ones. Building on the pages that already rank for those names is the next step, and it is what we are taking on first.",
        },
      },
    ] as { role: string; text: string; client?: { role: string; text: string } }[],
  },

  /* ------------------------------------------------------------ SCOREBOARD */
  scoreboard: [
    {
      metric: "Booking link clicks",
      value: "86",
      sub: "Four locations, Short.io",
      dir: "none",
      change: "First cycle reported \u00b7 links went live inside the period",
      reading:
        "Clicks that reached a booking calendar or booking page. Lenox Hill 26, Murray Hill 21, Plaza District 20, Upper East Side 19. The links went live partway through the window, so this is a part-period baseline rather than a full 14 days.",
      tone: "tone-good",
    },
    {
      metric: "Search click rate",
      value: "2.15%",
      sub: "Clicks \u00f7 impressions, Google",
      dir: "up",
      change: "1.64% in the 14 days before",
      reading:
        "78 clicks from 3,621 impressions. Up 31%. The site appeared less often and a greater share of the people who saw it chose it.",
      tone: "tone-good",
    },
    {
      metric: "Doctor page click rate",
      value: "8.6%",
      sub: "Search, all seven doctor pages",
      dir: "down",
      change: "11.3% in the 14 days before \u00b7 2.15% site-wide",
      reading:
        "29 clicks from 336 impressions. Four times the site-wide rate, from positions between 8.8 and 12.5. Both figures count all seven doctor pages, which is a change of basis from the last report.",
      tone: "tone-good",
    },
    {
      metric: "Website visits per day",
      value: "23.2",
      sub: "Sessions, daily average",
      dir: "down",
      change: "25.4 a day in the 14 days before \u00b7 325 against 356",
      reading:
        "Down 8.7%. Both windows are 14 days, so the totals compare directly. Google organic held at 103 sessions against 125.",
      tone: "",
    },
    {
      metric: "Search clicks",
      value: "78",
      sub: "From Google",
      dir: "down",
      change: "108 in the 14 days before \u00b7 \u221228%",
      reading:
        "5.6 clicks a day against 7.7. Clicks fell less than impressions, which is what a rising click rate looks like.",
      tone: "",
    },
    {
      metric: "Search impressions per day",
      value: "259",
      sub: "Times the site appeared",
      dir: "down",
      change: "470 a day in the 14 days before \u00b7 \u221245%",
      reading:
        "3,621 against 6,576. In the query sample, general searches account for most of what went, and those convert at 0.34%. Searches naming the practice or a doctor convert at 9.09%.",
      tone: "",
    },
    {
      metric: "Instagram views",
      value: "4,532",
      sub: "Account total, Metricool",
      dir: "down",
      change: "5,938 in the 14 days before \u00b7 \u221224%",
      reading:
        "324 views a day against 424, from 14 pieces against 15. Reach fell to 118 a day from 147, and a higher share of viewers engaged. The content is performing well with the audience it reaches.",
      tone: "",
    },
    {
      metric: "Engagement rate",
      value: "11.62%",
      sub: "Interactions \u00f7 reach",
      dir: "up",
      change: "10.66% in the period before",
      reading:
        "192 interactions against reach of 1,652. A smaller audience, and more of it engaged. Feed posts drew 83 interactions against 46 last period, overtaking reels for the first time.",
      tone: "tone-good",
    },
    {
      metric: "Followers",
      value: "760",
      sub: "At period close",
      dir: "up",
      change: "+6 this period \u00b7 +4 the period before",
      reading:
        "11 acquired against 3 lost, on 14 pieces published. Growth is small and steady rather than moving with content volume.",
      tone: "tone-good",
    },
    {
      metric: "Email clicks",
      value: "16",
      sub: "2 campaigns, Constant Contact",
      dir: "none",
      change: "First campaign inside a reporting window in three cycles",
      reading:
        "2,900 sends, 1,357 opens at 50% of delivered, 16 clicks. Open rate is well above the healthcare benchmark and click rate is not. The mail is being opened and not acted on.",
      tone: "",
    },
  ],

  /* -------------------------------------------- THE PERIOD LINE (signature) */
  periodLine: {
    title: "New visitors stepped down to a lower level and held there",
    note:
      "New website visitors per day across the 28 days from August 17 to September 13. No advertising ran in either half, so this compares one organic period against another rather than showing a step down to a baseline.",
    /* GA4 daily new users, Aug 17 – Sep 13. Aug 17–30 carried from the
       deployed report and re-verified against this cycle's export; Aug 31 –
       Sep 13 from this cycle's export. */
    series: [
      { d: "Aug 17", v: 15 }, { d: "Aug 18", v: 30 }, { d: "Aug 19", v: 21 },
      { d: "Aug 20", v: 23 }, { d: "Aug 21", v: 9 }, { d: "Aug 22", v: 7 },
      { d: "Aug 23", v: 13 }, { d: "Aug 24", v: 24 }, { d: "Aug 25", v: 20 },
      { d: "Aug 26", v: 26 }, { d: "Aug 27", v: 29 }, { d: "Aug 28", v: 16 },
      { d: "Aug 29", v: 12 }, { d: "Aug 30", v: 12 }, { d: "Aug 31", v: 10 },
      { d: "Sep 1", v: 19 }, { d: "Sep 2", v: 23 }, { d: "Sep 3", v: 25 },
      { d: "Sep 4", v: 11 }, { d: "Sep 5", v: 7 }, { d: "Sep 6", v: 7 },
      { d: "Sep 7", v: 14 }, { d: "Sep 8", v: 16 }, { d: "Sep 9", v: 18 },
      { d: "Sep 10", v: 16 }, { d: "Sep 11", v: 12 }, { d: "Sep 12", v: 7 },
      { d: "Sep 13", v: 9 },
    ],
    /* Index of the last day of the previous reporting period (Aug 30). The
       chart draws each half's average either side of it. */
    splitAt: 13,
    /* No shaded stretch this cycle — there was no advertising in either half.
       Set to a { through, label } object to shade a paid flight again. */
    shade: null as { through: number; label: string } | null,
    markers: [] as { i: number; label: string }[],
    /* derived: 257 visitors ÷ 14 days = 18.4; 194 ÷ 14 = 13.9 */
    bands: [
      { label: "August 17 – 30", value: "18 a day", detail: "Previous reporting period" },
      { label: "August 31 – September 13", value: "14 a day", detail: "This period" },
    ],
    read: {
      title: "Reading this fairly:",
      body: "Both halves are the same kind of period, the same length, with no advertising in either. New visitors moved from 18 a day to 14. The first half of the new window ran lower and the second half recovered to around 15, so the line is a step rather than a slide. Sessions moved less than new visitors, 25.4 a day to 23.2, meaning returning visitors held up better than first-time ones.",
    },
  },

  /* ----------------------------------------------------------- WHAT WORKED */
  worked: {
    /* Internal build only. */
    lede: "Two findings this period. Search traded volume for quality, losing 45% of impressions while improving click rate 31% and average position by 6 places. And the reel-and-post pairing recommended last cycle was actually run, on the White Party, a day apart.",
    lead: {
      kind: "Post",
      title: "A transformation like this starts long before procedure day",
      date: "September 10",
      url: "https://www.instagram.com/p/DdHiZHUlq4W/",
      why:
        "It drew 640 views and reached 221 accounts, the most of anything published this period. 18 interactions on that reach is 8.1%, below the account average of 11.62%. It went further than it engaged. The subject is a full-arch All-on-6 case built with the internal lab, the practice's highest-value service, and it is the second cycle running that an All-on-6 case has led on views.",
      repeatable:
        "The White Party pairing is the other half of the story. A carousel on September 2 drew 629 views and 13.5% engagement, the strongest engagement of the period. A reel on the same subject the next day drew 590 views and reached 384 accounts, the widest reach of anything published. Together they reached 607 accounts on one subject across two formats, against 221 for the single strongest clinical post. This is the pairing test from last cycle, and it worked.",
    },
    /* All content published inside this period, ranked by views. Six of the
       fourteen pieces; the other eight are stories. Engagement is
       interactions ÷ reach. */
    gallery: [
      {
        title: "A transformation like this starts long before procedure day", format: "Post", date: "Sep 10",
        url: "https://www.instagram.com/p/DdHiZHUlq4W/",
        views: "640", reach: "221", er: "8.1%", lead: true,
      },
      {
        title: "We had such a great time joining Dan\u2019s Papers White Party", format: "Post", date: "Sep 2",
        url: "https://www.instagram.com/p/DczEIlNFnQV/",
        views: "629", reach: "223", er: "13.5%", lead: false,
      },
      {
        title: "A little glimpse of NYCDS after hours", format: "Reel", date: "Sep 3",
        url: "https://www.instagram.com/reel/Dc1ketSxosl/",
        views: "590", reach: "384", er: "7.8%", lead: false,
      },
      {
        title: "Wondering which is right for you: veneers or bonding?", format: "Reel", date: "Sep 9",
        url: "https://www.instagram.com/reel/DdEv48bJh7z/",
        views: "251", reach: "145", er: "11.7%", lead: false,
      },
      {
        title: "Dental anxiety? Not here.", format: "Reel", date: "Sep 5",
        url: "https://www.instagram.com/reel/Dc6cspGJv5v/",
        views: "197", reach: "121", er: "7.4%", lead: false,
      },
      {
        title: "Great care is about more than the treatment itself", format: "Post", date: "Sep 8",
        url: "https://www.instagram.com/p/Dc1l4Xix2hs/",
        views: "168", reach: "93", er: "5.4%", lead: false,
      },
    ],
    galleryNote:
      "All six feed pieces published between August 31 and September 13, ranked by views. The other eight pieces were stories. Engagement is interactions divided by reach. These are per-post figures. The account total shown earlier is measured separately, and the two will not add up.",
    channel: {
      title: "Search lost volume it was not converting and kept the visibility that works",
      body:
        "Impressions fell from 6,576 to 3,621 while click rate rose from 1.64% to 2.15% and average position improved from 62.8 to 56.6. In the query sample, searches naming the practice or a doctor drew 16 clicks from 176 appearances, a 9.09% rate. General searches drew 9 clicks from 2,631 appearances, 0.34%. General searches also carry most of what was lost, falling from 4,318 appearances to 2,631. Mobile is where the site performs: 5.08% from position 38.7 against 1.45% from position 60.95 on desktop. Mobile is a fifth of impressions and nearly half of clicks.",
    },
  },

  /* -------------------------------------------------------- WHAT NEEDS WORK */
  attention: [
    {
      tag: "issue",
      title: "The Book now figure from last cycle does not reproduce",
      body:
        "The deployed report recorded 23 Book now clicks on the Instagram profile for August 17 – 30 and put the metric at the top of the scoreboard. Re-pulled on September 14, that same window shows no Book now clicks and 2 Call clicks. The 30-day window covering August 15 to September 13 holds the same 2 Call clicks and no Book now clicks, which means this period recorded no profile button activity of any kind.",
      so:
        "The 23 was not a restatement, it was a misread. Every caption published this period directs to the link in bio rather than to a profile button, so the native buttons were probably never the path. The metric is removed from this report rather than reported as zero against a benchmark that does not exist. Before it returns, confirm whether the Instagram profile action buttons are configured at all, and whether the link in bio is the tracked Short.io link.",
    },
    {
      tag: "issue",
      title: "Short.io click data carries automated traffic that the native filter is not catching",
      body:
        "Short.io reports human clicks rising from 109 to 420 across the two windows, a 285% increase. The country split is United States 209 and the Netherlands 153 this period, against 68 and 27 last. The 30-day city breakdown puts Groningen at 115, Ashburn at 54, The Dalles at 12 and Amsterdam at 6, which is 36% of all 519 human clicks in that window. The catch-all path went from 4 clicks to 113.",
      so:
        "No domain total and no period-over-period change is reported for short links this cycle. Per-link counts are shown as raw source figures with the limitation stated. The exports do not contain a path-by-country cross-tab, so the automated share cannot be removed per link without estimating, and nothing in this report is estimated. Two routes out, both one export away: Short.io's statistics pages carry a Filters control, so a country filter at export removes most of it. Better still, the four new booking links are tagged from the locations page, and 98 clicks over the 30 days arrived carrying those parameters. Automated traffic does not append tracking parameters, so a UTM-filtered export isolates site-originated human clicks directly.",
    },
    {
      tag: "issue",
      title: "Email opened well and was not acted on",
      body:
        "2 campaigns went to NYCDS lists inside the window. 2,900 sends, 1,357 opens at 50% of delivered, 16 clicks at 0.6%. RH NYCDS did not reach 182 of 2,856 contacts, 6%, which is in line with the account. White Party Email 2 did not reach 11 of 44, 25%, on a list small enough that the rate moves on single addresses. The 5th Avenue list flagged at 13% in the last report was recommended for cleaning and that has not been confirmed.",
      so:
        "A 50% open rate against a 0.6% click rate is a content and call-to-action question rather than a list one. The audience is reading the mail and not moving from it. That is the first thing to fix, and there is finally a comparable send to measure the fix against. The 5th Avenue cleaning is still open from last cycle.",
    },
    {
      tag: "issue",
      title: "Two booking links resolve to the same calendar, and it is not clear which is wrong",
      body:
        "/all-locations-booking-weave and /ues-booking-weave both resolve to Weave calendar 646d6584. Either the all-locations link is sending every location to the Upper East Side book, or 646d6584 is the group-wide calendar and the Upper East Side link is the one pointing somewhere too broad. From outside the account the two readings look identical. Murray Hill is also the only one of the four that points at a page on the NYCDS site rather than at a Weave calendar. Separately and unrelated, /doctors/test-doctor is live and drew 15 views, the fifth most visited landing page this period.",
      so:
        "Both links are taking appointments now, so this is worth settling before either reading gets built on. The Murray Hill difference may be deliberate if that page carries the booking embed. The test page should come down regardless.",
    },
    {
      tag: "limitation",
      title: "Doctor pages exist at two URL patterns and the search and website reports disagree",
      body:
        "Search Console reports doctor pages at /dr-sherman-farahani and the website report shows the same doctor at /doctors/dr-sherman-farahani, with 28 views against 9 on the shorter path. Six doctors appear at the short pattern in search; at least two appear at both patterns in the website report.",
      so:
        "Two live URLs for the same content split the ranking signal between them and make the two reports hard to reconcile. Worth confirming which pattern is canonical and redirecting the other. It has no effect on the figures in this report, because search and website totals are each taken from their own complete export.",
    },
    {
      tag: "expected",
      title: "Instagram views fell 24%, on the same volume of content",
      body:
        "324 views a day against 424, from 14 pieces against 15. Average daily reach fell from 147 to 118. Engagement rate moved the other way, 10.66% to 11.62%, and follower growth rose from +4 to +6. Non-followers took 2,419 of 4,318 categorized views, 56%, against 60% last period.",
      so:
        "Second consecutive period of falling reach alongside rising engagement. The pattern from last cycle holds: the content is performing with the audience it reaches, so this is a distribution question rather than a content one. Two periods makes it a trend rather than a quiet fortnight, and the non-follower share slipping 4 points is the first sign that distribution is narrowing toward existing followers.",
    },
  ],

  /* --------------------------------------------------------- WHAT WE LEARNED */
  learned: [
    { f: "86", u: "clicks on the new booking links", t: "across the four locations, in a part-period. These went live inside the window and give the practice its first direct measure of booking intent." },
    { f: "2.15%", u: "search click rate", t: "up from 1.64%. The site appeared 45% less often and converted a greater share of what it did get. Average position improved from 62.8 to 56.6." },
    { f: "8.6%", u: "click rate on doctor pages", t: "against 2.15% across the site, from positions between 9th and 13th. Counted across all seven doctor pages, the same way it will be counted every cycle." },
    { f: "5.08%", u: "click rate on mobile", t: "against 1.45% on desktop. Mobile is a fifth of the impressions and nearly half of the clicks, and ranks 22 places higher." },
    { f: "11.62%", u: "Instagram engagement rate", t: "up from 10.66%. Reach fell and the share of people engaging with what they saw rose. The content is performing well with the audience it reaches." },
    { f: "607", u: "accounts reached by the White Party pairing", t: "a carousel and a reel on the same subject a day apart, against 221 for the strongest single post. The pairing test from last cycle was run and it worked." },
    { f: "50%", u: "email open rate", t: "across 2 campaigns and 2,900 sends, well above the healthcare benchmark. 16 clicks followed, which is where the next piece of work sits." },
  ],

  /* ------------------------------------------------------------- NEXT MOVES */
  moves: [
    {
      action: "Rebuild the email call to action before the next send",
      why: "50% of delivered mail was opened and 0.6% was clicked. The audience is reading it. The click path is what is not working, and this is the first send inside a reporting window in three cycles, so there is finally something to measure against.",
      owner: "Email \u2014 Figment",
      measure: "Click rate on the next send, against 0.6%.",
    },
    {
      action: "Confirm the 5th Avenue list cleaning from last cycle",
      why: "It was recommended at 13% undelivered on the August 1 send and there has been no confirmation it happened. RH NYCDS came in at 6% this period, which is where the account should sit, so the question is only about that one list.",
      owner: "Email \u2014 Figment, with practice input on list origin",
      measure: "Undelivered share on the next 5th Avenue send, against 6% on RH NYCDS this period.",
    },
    {
      action: "Re-export Short.io filtered on the locations-page tag",
      why: "The link figures cannot carry a total while 36% of the domain's clicks come from Groningen, Ashburn, The Dalles and Amsterdam. The booking links are tagged from the locations page and 98 clicks arrived carrying those parameters over 30 days. Automated traffic does not append tracking parameters, so filtering on the tag isolates real site-driven clicks in one export.",
      owner: "Reporting \u2014 Figment",
      measure: "A tag-filtered export for both windows at the start of the next cycle, and the links section carrying a total again.",
    },
    {
      action: "Settle which calendar the all-locations and Upper East Side links should each use",
      why: "Both currently resolve to Weave calendar 646d6584. One of the two is pointing at the wrong book and there is no way to tell which from outside the account. Both are live and taking appointments. The test doctor page should come down in the same pass.",
      owner: "Web \u2014 Figment, with practice confirmation on calendar ownership",
      measure: "The two links resolving to different calendars, and the test page gone from the landing report.",
    },
    {
      action: "Confirm Instagram profile buttons and the tracked link in bio",
      why: "The Book now metric reported last cycle does not reproduce and the account shows no profile button activity at all in 30 days. Every caption directs to the link in bio, so the measure may belong on the short link rather than the button.",
      owner: "Social \u2014 Figment, with practice access",
      measure: "A configured and confirmed booking path, tracked, before it returns to the scoreboard.",
    },
    {
      action: "Run the format pairing again on a clinical subject",
      why: "The White Party carousel and reel reached 607 accounts across two formats a day apart, against 221 for the strongest single clinical post. The test worked on an event subject. Whether it carries to a treatment subject is the open question.",
      owner: "Social \u2014 Figment",
      measure: "Combined reach on the next pairing, against 607.",
    },
  ],

  /* ---------------------------------------------------------------- DETAIL */
  detail: {
    /* Panel subtitles. Dates live here, never in page.tsx. */
    subtitles: {
      instagram: "August 31 \u2013 September 13 \u00b7 account totals from Metricool",
      search: "August 31 \u2013 September 13 \u00b7 Google Search Console",
      website: "August 31 \u2013 September 13 \u00b7 Google Analytics",
      links: "August 31 \u2013 September 13 \u00b7 Short.io",
    },

    instagram: {
      kv: [
        { k: "Views", v: "4,532" },
        { k: "Accounts engaged", v: "127" },
        { k: "Avg reach / day", v: "118" },
        { k: "Followers", v: "760" },
        { k: "Content published", v: "14" },
        { k: "Interactions", v: "192" },
      ],
      publishedChart: {
        title: "What was published",
        note: "14 pieces across three formats, against 15 in the period before.",
      },
      published: [
        { label: "Stories", value: 8 },
        { label: "Reels", value: 3 },
        { label: "Feed posts", value: 3 },
      ],
      postsChart: {
        title: "The six feed pieces published this period",
        note: "Ranked by views. Engagement is interactions divided by reach.",
      },
      posts: [
        { t: "A transformation like this starts long before procedure day", f: "Post", d: "Sep 10", v: "640", r: "221", i: "18", e: "8.1%" },
        { t: "We had such a great time joining Dan\u2019s Papers White Party", f: "Post", d: "Sep 2", v: "629", r: "223", i: "30", e: "13.5%" },
        { t: "A little glimpse of NYCDS after hours", f: "Reel", d: "Sep 3", v: "590", r: "384", i: "30", e: "7.8%" },
        { t: "Wondering which is right for you: veneers or bonding?", f: "Reel", d: "Sep 9", v: "251", r: "145", i: "17", e: "11.7%" },
        { t: "Dental anxiety? Not here.", f: "Reel", d: "Sep 5", v: "197", r: "121", i: "9", e: "7.4%" },
        { t: "Great care is about more than the treatment itself", f: "Post", d: "Sep 8", v: "168", r: "93", i: "5", e: "5.4%" },
      ],
      interactionsChart: {
        title: "Feed posts overtook reels for the first time",
        note: "192 interactions across the period, by format. Feed posts drew 83 against 46 last period, while reels fell from 137 to 76.",
      },
      interactions: [
        { label: "Feed posts", value: 83 },
        { label: "Reels", value: 76 },
        { label: "Stories", value: 33 },
      ],
      viewsChart: {
        title: "Views by format",
        note: "Metricool\u2019s format breakdown totals 4,384 against the account figure of 4,532. The two are measured differently, so this shows share and is never summed into a total.",
      },
      viewsByFormat: [
        { label: "Carousels", value: 1759 },
        { label: "Reels", value: 1592 },
        { label: "Stories", value: 704 },
        { label: "Feed posts", value: 329 },
      ],
      storiesTitle: "Stories",
      stories:
        "8 stories drew 246 impressions across 244 accounts and 1 reply, and 33 interactions in Metricool\u2019s account view. Stories carry far less volume than the feed this period, reversing the pattern from the last report.",
      note:
        "Account totals are Metricool\u2019s account-level figures for August 31 \u2013 September 13, not a sum of individual posts. Metricool\u2019s breakdowns do not reconcile to the account total: 4,384 by content type and 4,318 by follower type, against 4,532. They show share and are never summed. Non-followers accounted for 2,419 of the categorized views against 1,893 from followers, a 56% share against 60% last period. Reel retention and follower age and gender were not in this export and are not shown. The Ad column is empty in both the views and interactions views, which is the confirmation that no paid ran.",
      /* The client build names the source and drops the reconciliation caveat,
         which raises a question about accuracy without giving the reader any
         way to act on it. Provenance is kept; the internal note keeps the rest. */
      clientNote:
        "Account totals are Metricool\u2019s account-level figures for August 31 \u2013 September 13, rather than a sum of the individual posts. Post-level rows are used only to rank content against content. Non-followers accounted for 2,419 of the categorized views against 1,893 from followers. Reel retention and follower demographics were not included in this export and are not shown.",
    },

    search: {
      kv: [
        { k: "Clicks", v: "78" },
        { k: "Impressions", v: "3,621" },
        { k: "Click rate", v: "2.15%" },
      ],
      /* RESTORED this cycle: daily impressions series, device table, query
         table, and the Position column on the pages table. */
      impressionsChart: {
        title: "Impressions per day",
        note: "Daily impressions across the 14 days. The window opened at 394 and closed at 169, with no single day carrying the fall.",
      },
      impressionsSeries: [
        { d: "Aug 31", v: 394 }, { d: "Sep 1", v: 275 }, { d: "Sep 2", v: 220 },
        { d: "Sep 3", v: 419 }, { d: "Sep 4", v: 202 }, { d: "Sep 5", v: 171 },
        { d: "Sep 6", v: 235 }, { d: "Sep 7", v: 325 }, { d: "Sep 8", v: 379 },
        { d: "Sep 9", v: 236 }, { d: "Sep 10", v: 151 }, { d: "Sep 11", v: 306 },
        { d: "Sep 12", v: 139 }, { d: "Sep 13", v: 169 },
      ],
      pagesChart: {
        title: "The homepage collects the impressions; the doctor pages collect the clicks",
        note: "Clicks, impressions, click rate and average position by page. The seven doctor pages together drew 29 clicks from 336 impressions.",
      },
      pages: [
        { p: "Homepage", c: "38", i: "2,873", r: "1.32%", pos: "58.6" },
        { p: "Dr. Maria Tamay", c: "9", i: "44", r: "20.45%", pos: "9.7" },
        { p: "Meet Our Dentists", c: "5", i: "275", r: "1.82%", pos: "36.9" },
        { p: "Dr. Michael Chesner", c: "4", i: "80", r: "5.00%", pos: "8.8" },
        { p: "Dr. Ben Elchami", c: "4", i: "62", r: "6.45%", pos: "12.3" },
        { p: "Dr. Sherman Farahani", c: "4", i: "35", r: "11.43%", pos: "9.7" },
        { p: "Dr. James Eisdorfer", c: "4", i: "33", r: "12.12%", pos: "12.5" },
        { p: "Dr. Doris Giraldo", c: "3", i: "37", r: "8.11%", pos: "11.4" },
        { p: "Dr. Dana Kapparova", c: "1", i: "45", r: "2.22%", pos: "9.1" },
      ],
      devicesChart: {
        title: "Mobile ranks 22 places higher and converts three times better",
        note: "Clicks, impressions, click rate and average position by device. Mobile is a fifth of the impressions and nearly half of the clicks.",
      },
      devices: [
        { d: "Desktop", c: "42", i: "2,905", r: "1.45%", pos: "60.9" },
        { d: "Mobile", c: "36", i: "709", r: "5.08%", pos: "38.7" },
        { d: "Tablet", c: "0", i: "7", r: "0%", pos: "52.4" },
      ],
      queriesChart: {
        title: "Searches that name the practice convert; general searches do not",
        note: "From the query export, which holds 25 of the 78 clicks and 2,807 of the 3,621 impressions. Shares are reliable; totals are not, and are taken from the daily chart export instead.",
      },
      queries: [
        { q: "nyc dental smiles", c: "12", i: "33", r: "36.36%", pos: "1.5" },
        { q: "nyc dental smile team", c: "4", i: "8", r: "50.00%", pos: "11.9" },
        { q: "nyc dental smile", c: "2", i: "7", r: "28.57%", pos: "1.3" },
        { q: "new dimension dentistry", c: "2", i: "6", r: "33.33%", pos: "1.0" },
        { q: "dr giraldo dentist", c: "2", i: "3", r: "66.67%", pos: "3.7" },
        { q: "dentist new york", c: "0", i: "120", r: "0%", pos: "75.0" },
        { q: "dentist in new york", c: "0", i: "109", r: "0%", pos: "62.7" },
      ],
      brandSplit: {
        title: "Brand and non-brand",
        note: "Matched on the practice names and the nine doctor surnames. From the query export, so these are shares within the sample rather than totals.",
        rows: [
          { k: "Names the practice or a doctor", c: "16", i: "176", r: "9.09%" },
          { k: "General searches", c: "9", i: "2,631", r: "0.34%" },
        ],
      },
      note:
        "Totals come from Search Console\u2019s daily chart export, which is complete. Average position across the site is 56.6, weighted by impressions, improved from 62.8. The homepage\u2019s 2,873 low-ranking impressions dominate that number, so it is not a useful summary of how the site performs. The page and query tables are samples. The query export holds 32% of the clicks and 78% of the impressions, so those rows will not sum to the totals, and the brand split is a share within the sample rather than a count of all searches. The comparison figures for August 17 \u2013 30 have been restated to 108 clicks on 6,576 impressions, from 106 on 6,195 in the last report. Doctor-page click rate counts all seven individual doctor pages in both windows; the last report counted three.",
    },

    website: {
      kv: [
        { k: "Sessions", v: "325" },
        { k: "New visitors", v: "194" },
        { k: "Desktop", v: "73%" },
        { k: "Mobile", v: "27%" },
      ],
      sourcesChart: {
        title: "Where visitors came from",
        note: "Sessions by source. Direct means someone typed the address or used a saved link.",
      },
      sources: [
        { label: "Direct", value: 169 },
        { label: "Google — organic", value: 103 },
        { label: "nycsmilepass.com", value: 14 },
        { label: "Bing — organic", value: 8 },
        { label: "Constant Contact", value: 8 },
        { label: "Instagram", value: 8 },
      ],
      deviceChart: {
        title: "Desktop still dominates the site",
        note: "Share of sessions by device. Unchanged from the period before at 73% and 27%.",
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
        { label: "Homepage", value: 273 },
        { label: "Meet Our Dentists", value: 59 },
        { label: "Locations", value: 38 },
        { label: "Dr. Sherman Farahani", value: 28 },
        { label: "Dr. Ben Elchami", value: 13 },
      ],
      note:
        "No paid sessions were recorded in this period or the one before it. Direct traffic at 52% is typical for a practice people already know by name. Constant Contact referrals appear for the first time, at 8 sessions, which follows the campaigns sent inside the window. Landing page views total 521 against 325 sessions, because one visit can land on more than one page. The five pages above account for 411 of those views. Two paths are excluded from the chart and carried in the internal build instead: a test page and a booking path belonging to the periodontal practice.",
    },

    links: {
      kv: [
        { k: "Lenox Hill", v: "64" },
        { k: "Plaza District", v: "46" },
        { k: "Murray Hill", v: "44" },
        { k: "Upper East Side", v: "43" },
      ],
      destsChart: {
        title: "Every location drew clicks to both its information link and its new booking link",
        note: "Clicks by destination across the eight tracked NYCDS links. Booking links went live inside this period, so they carry a part-period figure and nothing to compare against.",
      },
      dests: [
        { label: "Lenox Hill \u2014 information", value: 38 },
        { label: "Lenox Hill \u2014 booking", value: 26 },
        { label: "Plaza District \u2014 information", value: 26 },
        { label: "Murray Hill \u2014 information", value: 23 },
        { label: "Murray Hill \u2014 booking", value: 21 },
        { label: "Plaza District \u2014 booking", value: 20 },
        { label: "Upper East Side \u2014 information", value: 24 },
        { label: "Upper East Side \u2014 booking", value: 19 },
        { label: "Main website", value: 7 },
      ],
      note:
        "Eight tracked NYCDS links this cycle: an information link and a booking link for each of the four locations. The booking links went live inside the period, so they carry a part-period figure and there is nothing to compare them with. 86 clicks reached a booking calendar or booking page, against 118 to the information links. What attributes these to NYCDS is placement: all four are the booking buttons on the NYCDS locations page, and the clicks carry that page\u2019s tracking parameters. Address would not separate them, because the practice shares two of its four addresses with the periodontal practice. Placement does. No domain total and no comparison with the period before is reported. Short.io\u2019s own filtering left a large share of automated traffic in the counts: across the 30 days to September 13, more than a third of the clicks the tool recorded as human came from data center locations rather than from people, and the catch-all path rose from 4 clicks to 113. The booking links are the cleaner half of the data because they are tagged from the locations page and carry those parameters through the click, and 98 clicks over the 30 days arrived tagged that way. A filtered export restores the full section next cycle.",
    },

    email: {
      window: "August 31 \u2013 September 13, 2026 \u00b7 inside the reporting period",
      note:
        "2 campaigns went to NYCDS lists inside the window, the first to fall inside a reporting period in three cycles. A third campaign in the same Constant Contact account, RH 2.0, went to the periodontal practice\u2019s list of 3,412 and is excluded here, in the same way its short links are. Mixing it in would move every rate in the table. The August 1 location sends shown in the last report are not repeated. Percentages are calculated on delivered mail, matching Constant Contact\u2019s own reporting.",
      table: {
        head: ["Campaign", "Sends", "Opens", "Clicks"],
        rows: [
          ["RH NYCDS", "2,856", "1,344 (50%)", "15 (1%)"],
          ["White Party Email 2", "44", "13 (39%)", "1 (3%)"],
          ["Total", "2,900", "1,357 (50%)", "16 (0.6%)"],
        ],
      },
      tableInternal: {
        head: ["Campaign", "Sends", "Opens", "Clicks", "Bounces", "Unsub"],
        rows: [
          ["RH NYCDS", "2,856", "1,344 (50%)", "15 (1%)", "182 (6%)", "0"],
          ["White Party Email 2", "44", "13 (39%)", "1 (3%)", "11 (25%)", "0"],
          ["Total", "2,900", "1,357 (50%)", "16 (0.6%)", "193 (7%)", "0"],
        ],
      },
      tableChart: {
        title: "The two campaigns sent this period",
        note: "Open rates are 50% and 39% of delivered mail, both above the healthcare benchmark. Click rate is 0.6% across the two. Nobody unsubscribed.",
      },
    },

    facebook: {
      /* RESTORED this cycle. Absent from the last report. */
      subtitle: "August 31 \u2013 September 13 \u00b7 account totals from Metricool",
      kv: [
        { k: "Followers", v: "980" },
        { k: "Views", v: "321" },
        { k: "Page visits", v: "33" },
        { k: "Content published", v: "4" },
      ],
      note:
        "Facebook returns to this report after being absent last cycle. Views fell from 632 to 321 on 4 pieces against 5, and page visits rose from 21 to 33. Followers moved from 979 to 980, with 1 acquired and none lost. The page drew 4 reactions across the period. At this scale the figures move on single pieces of content and are reported for completeness rather than as a trend.",
    },

    method: [
      { q: "Where the Instagram totals come from", a: "Account-level figures reported by Metricool for August 31 \u2013 September 13, not a sum of individual posts. Metricool\u2019s breakdowns do not reconcile to the account total: 4,384 by content type and 4,318 by follower type, against 4,532. They show share and are never summed. Post-level figures rank content against content only.", internalOnly: true },
      { q: "Where the Instagram totals come from", a: "Account-level figures reported by Metricool for August 31 \u2013 September 13, rather than a sum of the individual posts. Post-level figures are used only to rank content against content, never to build a total.", clientOnly: true },
      { q: "How engagement rate is calculated", a: "Interactions divided by reach, meaning the share of people who saw something and engaged with it. It is not calculated against follower count, which would flatter the number. This period: 192 interactions against reach of 1,652." },
      { q: "How the doctor page click rate is calculated", a: "All seven individual doctor pages in Search Console, counted the same way in both windows: 29 clicks from 336 impressions this period, 37 from 326 in the period before. The last report counted the three strongest pages rather than all seven, which reported a higher figure on a basis that changes every cycle. Both windows here are shown on the all-seven basis." },
      { q: "How search totals are calculated", a: "From Search Console\u2019s daily chart export, which is complete. The page and query tables are samples, because Google withholds low-volume rows. The query export holds 32% of the clicks and 78% of the impressions in this window, so those rows will not sum to the totals and the brand split is a share within the sample rather than a count of all searches." },
      { q: "Why the search comparison has changed since the last report", a: "Search Console restates recent windows as processing completes. The last report recorded 106 clicks on 6,195 impressions for August 17 \u2013 30. Re-pulled on September 14, that window holds 108 clicks on 6,576 impressions. Every search comparison here uses the restated figures. The window was re-pulled specifically to check for this." },
      { q: "Why short links carry no total this cycle", a: "Short.io\u2019s own filtering left a large share of automated traffic in the counts. Across the 30 days to September 13, more than a third of the clicks the tool recorded as human came from data center locations rather than from people. The exports do not break clicks down by link and location together, so the automated share cannot be separated per link without estimating. Per-link counts are shown as raw source figures and no total or comparison is reported." },
      { q: "Which dates each figure covers", a: "Instagram, Facebook, search, website, email and short links all cover August 31 \u2013 September 13. Email and short links are filtered to NYCDS only; the periodontal practice shares both accounts and its campaign and links are excluded. Both this window and the comparison window are 14 days running Monday to Sunday, so totals compare directly with no length adjustment anywhere in this report." },
      { q: "How NYCDS figures are separated from the periodontal practice", a: "Constant Contact is a shared account covering both practices. It returned RH 2.0, a 3,412-send campaign to the periodontal list, alongside the two NYCDS sends. It is not counted here, because a list of 3,412 with different contacts and a different subject moves every percentage in the email table. Short links are attributed by placement rather than by address. The four booking links added during the period are the booking buttons on the NYCDS locations page and carry that page\u2019s tracking parameters. Address would not work here: the two practices share 130 East 35th Street and 933 Fifth Avenue, so two of the four locations appear on both sites under different neighborhood names. One link named for the periodontal practice drew fewer than 7 clicks and is excluded. Google Search Console, Analytics and Metricool are separate properties and need no filtering." },
      { q: "What is missing this cycle", a: "No paid campaigns ran, so there is no advertising section. Metricool\u2019s Ad column is empty in both the views and interactions views, which is the confirmation. Instagram reel retention and follower age and gender were not pulled and are absent rather than estimated. Instagram profile button activity is not reported: the figure carried in the last report does not reproduce, and the account shows no profile button activity across the last 30 days." },
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
  { k: "Instagram", v: "Aug 31 – Sep 13", p: "Account-level figures from Metricool." },
  { k: "Facebook", v: "Aug 31 – Sep 13", p: "Account-level figures from Metricool. Restored this cycle after being absent from the last report." },
  { k: "Search", v: "Aug 31 – Sep 13", p: "Compared against Aug 17 – 30, re-pulled and restated to 108 clicks on 6,576 impressions." },
  { k: "Website", v: "Aug 31 – Sep 13", p: "Full days." },
  { k: "Email", v: "Aug 31 – Sep 13", p: "2 NYCDS campaigns sent inside the window, the first in three cycles. A periodontal-practice campaign in the same account is excluded." },
  { k: "Short links", v: "Aug 31 – Sep 13", p: "Per-link counts only. Four booking links went live inside the period, so they carry a part-period figure. No domain total this cycle." },
];
