"use client";
import { useState, useEffect, useRef, ReactNode } from "react";

/* ============================================================================
   NYC DENTAL SMILES — PERFORMANCE BRIEFING
   ----------------------------------------------------------------------------
   All figures live in REPORT below. The presentation layer reads from it and
   holds no numbers of its own. To produce the next cycle, edit REPORT and the
   narrative strings. The components below do not need to change.

   Nothing here is estimated or inferred. Every value is carried from a source
   export, or is plain arithmetic on two figures already present; those are
   marked `derived` inline.

   SOURCE WINDOWS — these are not identical, and the report says so on its face:
     Instagram / Facebook (Metricool)   Aug 2 – Aug 15, 2026
     Search Console                     Aug 2 – Aug 16, 2026  (Aug 16 partial)
     Website (GA4)                      Aug 2 – Aug 16, 2026
     Short links (Short.io)             Aug 2 – Aug 17, 2026
     Email (Constant Contact)           Rolling 90 days ending Aug 16, 2026

   NOT IN THIS CYCLE:
     - No paid campaigns ran. There is no advertising section by design.
     - Instagram's native account export was unavailable. Account-level figures
       come from Metricool and are labelled as such throughout.
     - Follower age and gender were not in the export. They are omitted rather
       than carried forward from an earlier pull.
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
const VARIANT: Variant =
  process.env.NEXT_PUBLIC_REPORT_VARIANT === "internal" ? "internal" : "client";
const IS_INTERNAL: boolean = VARIANT === "internal";

const REPORT = {
  client: { name: "NYC Dental Smiles", short: "NYCDS", agency: "Figment Creative" },

  period: {
    label: "August 2 – 16, 2026",
    length: "15 days",
    comparedWith: "the 16 days before it (July 17 – August 1)",
    paidStatus:
      "No advertising ran during this period. The last paid flight ended August 1, which makes this the first clean read on organic performance since June.",
  },

  /* ------------------------------------------------------------- THE BRIEF */
  brief: {
    title: "The Brief",
    lede: "A concise summary of the period\u2019s performance, key findings, and recommended actions.",
    head: "This was the first reporting period without paid support. Reach declined as expected, while engagement remained steady.",
    items: [
      {
        role: "The outcome",
        text: "Instagram delivered 7,962 views with nothing paid behind it, and the account added 15 followers — three quarters of the month's growth in half the month's time.",
      },
      {
        role: "Strongest signal",
        text: "One post did a third of the work. The summer BBQ team carousel drew 2,633 views and reached 849 accounts, more than three times anything else published.",
      },
      {
        role: "Primary concern",
        text: "Google showed the site far less often — about 363 times a day, down from roughly 678. Click rate improved over the same stretch, so this needs a second period before we read it as a problem.",
        /* Same facts, no alarm vocabulary, and it names what we are doing about
           it rather than leaving an open worry sitting in the summary. */
        client: {
          role: "What we are monitoring",
          text: "Google showed the site less often this period — about 363 times a day, compared with roughly 678 in the two weeks before. The share of people who clicked through improved over the same stretch. We track this weekly and will keep reporting on it.",
        },
      },
      {
        role: "Next action",
        text: "Publish two more team and culture posts next cycle to find out whether the BBQ result repeats or was a one-off.",
      },
    ] as { role: string; text: string; client?: { role: string; text: string } }[],
  },

  /* ------------------------------------------------------------ SCOREBOARD */
  scoreboard: [
    {
      metric: "Instagram views",
      value: "7,962",
      sub: "Account total, Metricool",
      dir: "none",
      change: "16,010 across the full 30 days",
      reading:
        "Half the month produced half the views. The 30-day figure includes the paid flight that ended August 1, so the two are not a like-for-like comparison and no percentage change is shown.",
      tone: "",
    },
    {
      metric: "Followers",
      value: "750",
      sub: "At period close",
      dir: "up",
      change: "+15 this period · +20 across 30 days",
      reading:
        "The account added fifteen followers over the period, taking it to 750. Instagram credits one of those directly to the team carousel; the rest arrived steadily across the two weeks without a single identifiable source.",
      tone: "tone-good",
    },
    {
      metric: "Accounts engaged",
      value: "177",
      sub: "People who interacted",
      dir: "none",
      change: "259 across the full 30 days",
      reading:
        "Just over two thirds of the month's engaged accounts came from this half of it. Engagement concentrated into the organic stretch rather than the paid one.",
      tone: "",
    },
    {
      metric: "Engagement rate",
      value: "7.72%",
      sub: "Interactions ÷ reach, posts",
      dir: "up",
      change: "7.17% across 30 days",
      reading:
        "The share of people who saw a post and responded to it. It rose after the ads stopped, which means the audience now seeing the content is more inclined to act on it.",
      tone: "tone-good",
    },
    {
      metric: "Search clicks",
      value: "117",
      sub: "From Google",
      dir: "down",
      change: "177 in the 16 days before",
      reading:
        "Clicks fell about a third. Impressions fell by nearly half over the same stretch, so a larger share of the people who saw the site chose to visit it.",
      tone: "",
    },
    {
      metric: "Search click rate",
      value: "2.15%",
      sub: "Clicks ÷ impressions",
      dir: "up",
      change: "1.63% in the 16 days before",
      reading:
        "Fewer people saw the listings and more of them clicked. Whatever visibility remains is better matched to what people are actually searching for.",
      tone: "tone-good",
    },
    {
      metric: "Website sessions",
      value: "379",
      sub: "All sources",
      dir: "none",
      change: "938 across the full 30 days",
      reading:
        "The 30-day figure includes 59 sessions that arrived directly from paid Instagram and Facebook placements. This period had none, so the gap is the advertising, not the site.",
      tone: "",
    },
    {
      metric: "Link clicks",
      value: "143",
      sub: "Confirmed as real people",
      dir: "flat",
      change: "Not separately reported last cycle",
      reading:
        "Short.io recorded 1,170 requests in total. 143 came from real people; the rest was automated traffic, which we filter out. Every link figure in this report uses the verified count.",
      tone: "",
    },
  ],

  /* -------------------------------------------- THE PERIOD LINE (signature) */
  periodLine: {
    title: "Website visits stepped down when advertising stopped, then held a steady band",
    note:
      "New website visitors per day across 31 days. The shaded stretch is the paid flight. After it ended the daily figure settled into a narrower range instead of continuing to fall — that range is the organic baseline.",
    /* GA4 daily new users, Jul 17 – Aug 16. */
    series: [
      { d: "Jul 17", v: 41 }, { d: "Jul 18", v: 58 }, { d: "Jul 19", v: 36 },
      { d: "Jul 20", v: 31 }, { d: "Jul 21", v: 33 }, { d: "Jul 22", v: 27 },
      { d: "Jul 23", v: 33 }, { d: "Jul 24", v: 29 }, { d: "Jul 25", v: 24 },
      { d: "Jul 26", v: 14 }, { d: "Jul 27", v: 34 }, { d: "Jul 28", v: 27 },
      { d: "Jul 29", v: 30 }, { d: "Jul 30", v: 18 }, { d: "Jul 31", v: 18 },
      { d: "Aug 1", v: 19 }, { d: "Aug 2", v: 10 }, { d: "Aug 3", v: 21 },
      { d: "Aug 4", v: 19 }, { d: "Aug 5", v: 23 }, { d: "Aug 6", v: 35 },
      { d: "Aug 7", v: 19 }, { d: "Aug 8", v: 12 }, { d: "Aug 9", v: 7 },
      { d: "Aug 10", v: 34 }, { d: "Aug 11", v: 26 }, { d: "Aug 12", v: 30 },
      { d: "Aug 13", v: 20 }, { d: "Aug 14", v: 14 }, { d: "Aug 15", v: 7 },
      { d: "Aug 16", v: 8 },
    ],
    paidThrough: 15,          // index of Aug 1 — last day with advertising
    markers: [
      { i: 15, label: "Advertising ends" },
      { i: 20, label: "Team post" },
    ],
    /* derived: 472 visitors ÷ 16 days = 29.5; 285 ÷ 15 = 19.0 */
    bands: [
      { label: "With advertising", value: "30 a day", detail: "Jul 17 – Aug 1" },
      { label: "Organic only", value: "19 a day", detail: "Aug 2 – 16" },
    ],
  },

  /* ----------------------------------------------------------- WHAT WORKED */
  worked: {
    /* Internal build only. Framing the carousel against everything else invites
       a comparison that reads unfavourably for the reels, which are the
       account's consistent performers. */
    lede: "It was the only post in the period that was not about dentistry, and it out-reached everything else by more than three times.",
    lead: {
      kind: "Carousel",
      title: "Summer BBQ team carousel",
      date: "August 6",
      url: "https://www.instagram.com/p/DbtibXmFvC9/",
      why:
        "It showed the practice as a group of people rather than a set of services, reached more than three times as many accounts as anything else published, and brought in a follower directly. It also carried to Facebook, where it produced 18 clicks — every click Facebook generated this period came from this one post.",
      repeatable:
        "Worth testing, but once is not a pattern, and a result this far ahead of the account's normal range is more likely to be a moment than a new baseline. Team content is inexpensive to produce and there is a year of practice life to draw on. Two more posts of this kind will show which it was.",
    },
    /* Top content published inside this period, ranked by views. The four other
       posts supplied for the gallery (Jul 17, 18, 22, 29) fall outside Aug 2-16
       and are not shown here. Images are pulled by scripts/fetch-instagram.mjs
       and matched to each post by the shortcode in its permalink; until a file
       exists the card shows a labelled placeholder. */
    gallery: [
      {
        title: "Summer BBQ team carousel", format: "Carousel", date: "Aug 6",
        url: "https://www.instagram.com/p/DbtibXmFvC9/",
        views: "2,633", reach: "849", er: "7.66%", lead: true,
      },
      {
        title: "Dr. Laura on second opinions", format: "Reel", date: "Aug 14",
        url: "https://www.instagram.com/reel/DcBsX-ApCpW/",
        views: "999", reach: "674", er: "6.82%", lead: false,
      },
      {
        title: "Dr. Tamay on aesthetic dentistry", format: "Reel", date: "Aug 12",
        url: "https://www.instagram.com/reel/Db8wf3PJ2uP/",
        views: "662", reach: "497", er: "8.25%", lead: false,
      },
      {
        title: "Dr. Ben on general practice", format: "Reel", date: "Aug 8",
        url: "https://www.instagram.com/reel/DbyMIBUp4Zp/",
        views: "258", reach: "172", er: "8.14%", lead: false,
      },
      {
        title: "Patient testimonial", format: "Image", date: "Aug 7",
        url: "https://www.instagram.com/p/DbwCl47xLpb/",
        views: "169", reach: "84", er: "8.33%", lead: false,
      },
    ],
    galleryNote:
      "Everything published between August 2 and 15, ranked by views. Engagement is interactions divided by reach. These are per-post figures; the account total shown earlier is measured separately and the two will not add up to each other.",
    channel: {
      title: "The doctor reels remain the account's most dependable format",
      body:
        "The three doctor reels drew 999, 662 and 258 views, ahead of every other post published in the period apart from the carousel. Two of the three also earned a higher engagement rate than it did — 8.25% and 8.14% against 7.66% — meaning a greater share of the people who saw them responded. All three held viewers between seven and ten seconds on average, with Dr. Tamay's the longest at 10.2 seconds. The carousel is the unusual result here; the reels are the steady one.",
    },
  },

  /* -------------------------------------------------------- WHAT NEEDS WORK */
  attention: [
    {
      tag: "early",
      title: "Google showed the site far less often, and position slipped",
      body:
        "Search impressions averaged about 363 a day, down from roughly 678 in the two weeks before. Average position on desktop moved from 52.6 to 63.9 — further down the page. Click rate rose from 1.63% to 2.15% over the same stretch.",
      so:
        "Two explanations fit equally well: ordinary mid-August seasonality in a city that empties out, or a ranking change. The improved click rate argues against anything serious. One more period will separate them. We are not changing anything on the site until it does.",
    },
    {
      tag: "issue",
      title: "The 35th Street email list opens well below the other locations",
      body:
        "Across two separate campaigns sent to every location, 35th Street opened at 42% and 43%. The same emails to 5th Avenue and 60th Street opened between 57% and 61%. The content was identical. Only the list differed.",
      so:
        "A 15-point gap repeated across two campaigns is not random variation. It points to something about that list — how old it is, how it was collected, or how the sender name appears to those contacts. Worth reviewing before the next send.",
    },
    {
      tag: "issue",
      title: "The homepage attracts the most search interest and converts the least",
      body:
        "The homepage collected 4,071 of the period's 5,446 search impressions, sits at average position 62, and converts 1.74% of them. The doctor pages sit on page one and convert between 6% and 23% — Dr. Farahani's at 22.7%, Dr. Tamay's at 21.7%.",
      so:
        "High-intent searches like \u201cdentist nyc\u201d and \u201cdentist new york\u201d produce hundreds of impressions at positions 70 to 85 and no clicks at all. The visibility exists; the ranking does not support it. The doctor and condition pages already rank and convert, and are the surer place to put effort.",
    },
    {
      tag: "expected",
      title: "Reach and website visits are down against the 30-day figure",
      body:
        "New website visitors averaged 19 a day against about 30 a day while advertising ran. Instagram's average daily reach was 210 against 559 across the full 30 days.",
      so:
        "Paid social ended August 1. The 30-day comparison contains 59 sessions that came straight from paid placements; this period contains none. This is the advertising stopping, not the content weakening — and it gives us a clean baseline to plan the next flight against.",
    },
    {
      tag: "limitation",
      title: "Follower age and gender were not in this export",
      body:
        "Instagram's demographic breakdown was not included in the data available for this period. The previous report carried these figures forward from an earlier pull.",
      so:
        "Rather than repeat numbers we cannot confirm, they are left out this cycle. Location data was included and is reported: New York City accounts for 22.5% of followers. The demographic export will be pulled directly from Instagram next cycle.",
    },
  ],

  /* --------------------------------------------------------- WHAT WE LEARNED */
  learned: [
    { f: "33%", u: "of all Instagram views", t: "came from a single team photo carousel — the one post that showed people rather than dentistry." },
    { f: "+15", u: "new followers", t: "taking the account to 750, its highest point this year. Instagram attributes one directly to the team carousel; the rest built up across the period." },
    { f: "78%", u: "of verified link clicks", t: "went to a specific office page rather than the main site. People are choosing a location before they arrive." },
    { f: "3.7×", u: "better click rate on mobile", t: "than desktop in search — yet 80% of website visitors arrive on a desktop." },
    { f: "54%", u: "of emails are opened", t: "well above the industry benchmark. But only 3 in 100 of those who open go on to click." },
    { f: "0", u: "paid sessions", t: "this period, so every figure here reflects organic activity. It gives us a clean baseline to measure the next campaign against." },
  ],

  /* ------------------------------------------------------------- NEXT MOVES */
  moves: [
    {
      action: "Publish two more team and culture posts next cycle",
      why: "The BBQ carousel out-reached every other post by more than three times. One result is not a pattern, and this is the cheapest way to find out whether it is one.",
      owner: "Social — Figment",
      measure: "Reach per post, against the 849 the BBQ carousel achieved.",
    },
    {
      action: "Review the 35th Street email list before the next send",
      why: "It has opened 15 points below the other locations across two consecutive campaigns with identical content. That gap costs roughly one in six potential opens at that location.",
      owner: "Email — Figment, with practice input on list origin",
      measure: "Open rate on the next all-location send, against 5th Avenue and 60th Street.",
    },
    {
      action: "Put a booking link at the top of every doctor page",
      why: "Doctor pages convert search traffic between 6% and 23% and already sit on page one. They are the strongest pages the site has, and the ones most likely to be opened on a phone.",
      owner: "Web — Figment",
      measure: "Clicks from doctor pages through to the booking system next cycle.",
    },
    {
      action: "Send one email with a single call to action",
      why: "Opens are strong at 54% but only 3% of those openers click. Competing links are the most common cause, and one clear action per email is the standard first test.",
      owner: "Email — Figment",
      measure: "Click-to-open rate, against the current 3%.",
    },
    {
      action: "Hold all search changes for one more period",
      why: "Impressions fell but click rate improved. Acting on two weeks of mixed signal risks undoing something that is working. One more cycle will show whether the drop was seasonal.",
      owner: "Search — Figment",
      measure: "Daily impressions and average position through the next cycle.",
    },
  ],

  /* --------------------------------------------------- WHAT WE DO NEXT (client)
     The client-facing counterpart to `moves`. Same five actions, written as a
     forward plan rather than an operating instruction: no owners, no target
     metrics, and no restatement of the problems that sit in the internal
     Needs attention section. Nothing here overstates what the data supports. */
  plan: [
    {
      action: "Publish more team content",
      body: "The summer BBQ post reached more people than anything else this period. We would like to see whether that holds, so the next cycle includes two more posts featuring the team.",
    },
    {
      action: "Add booking links to the doctor pages",
      body: "The individual doctor pages are the strongest performers in search \u2014 they rank on the first page and a high share of people who see them click through. Making it easier to book directly from those pages is the natural next step.",
    },
    {
      action: "Test a simpler email",
      body: "More than half of the emails sent are being opened, which is well above the benchmark for healthcare. We will test a send built around one clear action to see whether more of those opens turn into clicks.",
    },
    {
      action: "Review the location email lists",
      body: "Open rates vary between locations. Before the next send we will check that each location list is current, so every office is reaching its patients equally well.",
    },
    {
      action: "Leave search settings as they are for one more cycle",
      body: "Search results moved around this period, and the underlying click rate improved. We would rather read one more period cleanly than change something that appears to be working.",
    },
  ],

  /* ---------------------------------------------------------------- DETAIL */
  detail: {
    instagram: {
      kv: [
        { k: "Views", v: "7,962" },
        { k: "Accounts engaged", v: "177" },
        { k: "Avg reach / day", v: "210" },
        { k: "Followers", v: "750" },
        { k: "Content published", v: "10" },
      ],
      published: [
        { label: "Stories", value: 5 },
        { label: "Reels", value: 3 },
        { label: "Feed posts", value: 2 },
      ],
      posts: [
        { t: "Summer BBQ team carousel", f: "Carousel", d: "Aug 6", v: "2,633", r: "849", i: "65", e: "7.66%" },
        { t: "Dr. Laura on second opinions", f: "Reel", d: "Aug 14", v: "999", r: "674", i: "46", e: "6.82%" },
        { t: "Dr. Tamay on aesthetic dentistry", f: "Reel", d: "Aug 12", v: "662", r: "497", i: "41", e: "8.25%" },
        { t: "Dr. Ben on general practice", f: "Reel", d: "Aug 8", v: "258", r: "172", i: "14", e: "8.14%" },
        { t: "Patient testimonial", f: "Image", d: "Aug 7", v: "169", r: "84", i: "7", e: "8.33%" },
      ],
      reels: [
        { t: "Dr. Tamay on aesthetic dentistry", w: "10.2s", p: "40.2%", s: "3" },
        { t: "Dr. Laura on second opinions", w: "9.2s", p: "40.7%", s: "0" },
        { t: "Dr. Ben on general practice", w: "7.0s", p: "32.4%", s: "1" },
      ],
      stories: "Five stories reached 179 accounts and drew 94 taps forward with no replies. Stories are working as filler between posts rather than as a channel in their own right.",
      cities: [
        { k: "New York, New York", v: "22.5%" },
        { k: "Sialkot, Punjab", v: "3.6%" },
        { k: "Los Angeles", v: "0.7%" },
        { k: "Toronto", v: "0.7%" },
        { k: "Philadelphia", v: "0.7%" },
      ],
      note:
        "Account totals are Metricool's account-level figures for August 2 – 15. Instagram's own native export was unavailable this cycle; the two sources can differ, sometimes materially. Post-level rows are used only to rank content against content. Follower age and gender were not in this export and are not shown.",
      /* The client build names the source but drops the reconciliation caveat,
         which raises a question about accuracy without giving the reader any
         way to act on it. Provenance is kept; the internal note keeps the rest. */
      clientNote:
        "Account totals are Metricool's account-level figures for August 2 – 15. Post-level rows are used only to rank content against content. Follower age and gender were not included in this export and are not shown.",
    },

    facebook: {
      rows: [
        { p: "Summer BBQ team carousel", i: "142", r: "71", x: "3", c: "1", s: "2", k: "18" },
        { p: "Patient testimonial", i: "29", r: "23", x: "0", c: "0", s: "1", k: "0" },
      ],
      note: "Facebook remains small in absolute terms. Every click it produced this period came from the team carousel.",
    },

    search: {
      kv: [
        { k: "Clicks", v: "117" },
        { k: "Impressions", v: "5,446" },
        { k: "Click rate", v: "2.15%" },
      ],
      devices: [
        { d: "Mobile", c: "60", i: "1,233", r: "4.87%", p: "36.2" },
        { d: "Desktop", c: "56", i: "4,207", r: "1.33%", p: "63.9" },
        { d: "Tablet", c: "1", i: "6", r: "16.67%", p: "42.0" },
      ],
      /* GSC daily impressions, Aug 2 – 16. Aug 16 is an incomplete day. */
      daily: [
        { date: "Aug 2", v: 513 }, { date: "Aug 3", v: 415 }, { date: "Aug 4", v: 310 },
        { date: "Aug 5", v: 338 }, { date: "Aug 6", v: 392 }, { date: "Aug 7", v: 240 },
        { date: "Aug 8", v: 442 }, { date: "Aug 9", v: 523 }, { date: "Aug 10", v: 493 },
        { date: "Aug 11", v: 350 }, { date: "Aug 12", v: 331 }, { date: "Aug 13", v: 367 },
        { date: "Aug 14", v: 372 }, { date: "Aug 15", v: 240 }, { date: "Aug 16", v: 120 },
      ],
      dailyNote:
        "Impressions per day. The final day was still processing when the data was exported, so the drop at the right edge is incomplete data rather than a real fall.",
      deviceRead:
        "Mobile produced more clicks than desktop from a fifth of the impressions. People searching on a phone are closer to booking — but four in five website visitors still arrive on a desktop.",
      pages: [
        { p: "Homepage", c: "71", i: "4,071", r: "1.74%", pos: "62.3" },
        { p: "Dr. James Eisdorfer", c: "8", i: "39", r: "20.51%", pos: "7.8" },
        { p: "Meet Our Dentists", c: "6", i: "487", r: "1.23%", pos: "51.0" },
        { p: "Dr. Michael Chesner", c: "6", i: "92", r: "6.52%", pos: "9.4" },
        { p: "Dr. Maria Tamay", c: "5", i: "23", r: "21.74%", pos: "5.3" },
        { p: "Dr. Sherman Farahani", c: "5", i: "22", r: "22.73%", pos: "3.9" },
        { p: "Locations", c: "3", i: "257", r: "1.17%", pos: "28.7" },
        { p: "Services", c: "3", i: "187", r: "1.60%", pos: "6.5" },
        { p: "Nerve pain after onlay (article)", c: "3", i: "82", r: "3.66%", pos: "12.4" },
        { p: "Dr. Ben Elchami", c: "3", i: "45", r: "6.67%", pos: "8.0" },
      ],
      queries: [
        { q: "nyc dental smiles", c: "27", i: "51", r: "52.94%", p: "1.4" },
        { q: "michael chesner", c: "3", i: "10", r: "30.00%", p: "5.2" },
        { q: "nyc dental smile team", c: "3", i: "7", r: "42.86%", p: "7.3" },
        { q: "dentist in new york", c: "2", i: "123", r: "1.63%", p: "66.8" },
        { q: "nerve pain after onlay", c: "2", i: "15", r: "13.33%", p: "6.3" },
        { q: "doris giraldo", c: "2", i: "11", r: "18.18%", p: "4.1" },
        { q: "dentist new york", c: "0", i: "160", r: "0.00%", p: "74.4" },
        { q: "dentist nyc", c: "0", i: "116", r: "0.00%", p: "79.2" },
        { q: "new york dentist", c: "0", i: "103", r: "0.00%", p: "71.1" },
        { q: "dentist manhattan", c: "0", i: "65", r: "0.00%", p: "84.8" },
      ],
      queryRead:
        "The bottom four rows show where the opportunity sits: strong demand for these searches, but the site currently appears too far down the results for people to reach it.",
      note:
        "Totals come from Search Console's daily chart export, which is complete. The query table is a sample — Google withholds low-volume queries, so query rows will not add up to the totals. August 16 was still processing at export and is an incomplete day.",
    },

    website: {
      kv: [
        { k: "Sessions", v: "379" },
        { k: "Users", v: "304" },
        { k: "Desktop", v: "80%" },
        { k: "Mobile", v: "20%" },
      ],
      sources: [
        { label: "Direct", value: 206 },
        { label: "Google — organic", value: 113 },
        { label: "Bing — organic", value: 23 },
        { label: "Other referrals", value: 15 },
        { label: "nycsmilepass.com", value: 9 },
        { label: "Instagram", value: 7 },
        { label: "Yahoo — organic", value: 3 },
        { label: "Facebook", value: 2 },
        { label: "ChatGPT", value: 1 },
      ],
      landing: [
        { label: "Homepage", value: 354 },
        { label: "Meet Our Dentists", value: 71 },
        { label: "Services", value: 35 },
        { label: "Locations", value: 32 },
        { label: "About", value: 21 },
        { label: "Dr. Sherman Farahani", value: 18 },
        { label: "Terms of Service", value: 15 },
        { label: "Why NYCDS", value: 14 },
      ],
      note:
        "No paid sessions were recorded this period. Across the full 30 days there were 59, all from Instagram and Facebook placements that ended August 1. Direct traffic at 54% is typical for a practice people already know by name.",
    },

    links: {
      kv: [
        { k: "Requests recorded", v: "1,170" },
        { k: "Real people", v: "143" },
        { k: "To a location page", v: "103" },
      ],
      dests: [
        { label: "58th Street", value: 32 },
        { label: "60th Street", value: 29 },
        { label: "35th Street", value: 24 },
        { label: "5th Avenue", value: 18 },
        { label: "Main website", value: 16 },
        { label: "Homepage", value: 13 },
      ],
      cities: [
        { label: "New York City", value: 16 },
        { label: "Queens", value: 6 },
        { label: "Brooklyn", value: 5 },
        { label: "Island Park", value: 5 },
      ],
      note:
        "Short.io records every request to a short link, including automated traffic no person initiated. Only clicks confirmed as coming from real people are reported, and every figure above uses that verified count. Six tracked links are included; links belonging to the periodontal practice are excluded from this report. The four location links account for 103 of the 132 clicks across those six.",
    },

    email: {
      window: "Rolling 90 days ending August 16, 2026",
      funnel: [
        { label: "Sent", value: 20657 },
        { label: "Delivered", value: 18597 },
        { label: "Opened", value: 9963 },
        { label: "Clicked", value: 274 },
      ],
      metrics: [
        { k: "Open rate", v: "54%" },
        { k: "Click rate", v: "1%" },
        { k: "Click-to-open", v: "3%" },
        { k: "Unsubscribed", v: "80" },
        { k: "Bounced", v: "2,060" },
      ],
      reads: [
        "Open rate is down 5 points on the previous 90 days but remains 23 points above the industry benchmark. Getting the email opened is working well.",
        "Click-to-open at 3% is the number with the most room to grow. People are opening the email; the next step is giving them a clearer reason to act.",
        "Unsubscribes rose from 25 to 80 while sending volume more than doubled. Some increase was expected; this is worth watching rather than acting on.",
        "Roughly one in ten sends did not reach an inbox, which suggests list hygiene is due.",
      ],
      campaigns: [
        { n: "July Whitening Promo — 5th Avenue", d: "Jul 6", r: 61 },
        { n: "Summer Promo Extensions — 60th Street", d: "Aug 1", r: 57 },
        { n: "Summer Promo Extensions — 5th Avenue", d: "Aug 1", r: 57 },
        { n: "July Whitening Promo — 60th Street", d: "Jul 6", r: 57 },
        { n: "Summer Promo Extensions — 35th Street", d: "Aug 1", r: 43 },
        { n: "Returning Customers — 933 5th Avenue", d: "Jun 15", r: 43 },
        { n: "250th Birthday — 58th Street", d: "Jun 5", r: 43 },
        { n: "July Whitening Promo — 35th Street", d: "Jul 6", r: 42 },
      ],
      note:
        "Constant Contact reports on a fixed 90-day rolling window that cannot be narrowed to match this report's period, so these figures are not comparable with the sections above and no period-on-period change is shown against them. Account totals cover every campaign sent from the account, including those belonging to the periodontal practice; the campaign list shows NYCDS campaigns only.",
    },

    method: [
      { q: "Where the Instagram totals come from", a: "Account-level figures reported by Metricool for August 2 – 15, not a sum of individual posts. Instagram's own native export was unavailable this cycle, and the two sources can differ. Post-level figures are used only to rank content against content, never to build a total.", internalOnly: true },
      { q: "Where the Instagram totals come from", a: "Account-level figures reported by Metricool for August 2 – 15, rather than a sum of the individual posts. Post-level figures are used only to rank content against content, never to build a total.", clientOnly: true },
      { q: "How engagement rate is calculated", a: "Interactions divided by reach — the share of people who saw something and responded to it. It is not calculated against follower count, which would flatter the number." },
      { q: "How link clicks are filtered", a: "Short.io records every request to a short link, including automated traffic. Only clicks confirmed as real people are reported. Six tracked NYCDS links are included; periodontal practice links are excluded." },
      { q: "How search totals are calculated", a: "From Search Console's daily chart export, which is complete. Query-level tables are a sample, because Google withholds low-volume queries, so those rows will not sum to the totals." },
      { q: "Which dates each figure covers", a: "Each platform exports on its own calendar, so the windows differ slightly. Instagram and Facebook cover August 2 \u2013 15, search and website cover August 2 \u2013 16, short links cover August 2 \u2013 17, and email reports on a fixed 90-day rolling window that cannot be narrowed. From the next cycle every source will be pulled on a single Sunday-to-Saturday fortnight so the dates match exactly." },
      { q: "What is missing this cycle", a: "No paid campaigns ran, so there is no advertising section. Follower age and gender were not in the export and are omitted rather than carried forward. August 16 was an incomplete day in Search Console at the time of export." },
    ] as { q: string; a: string; internalOnly?: boolean; clientOnly?: boolean }[],
  },
};
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Inter:wght@400;500;600;700&display=swap');

.nyc {
  --paper: #FAFAF8;
  --paper-2: #F3EFEA;
  --ink: #251F22;
  --ink-2: #574C52;
  --ink-3: #6E6268;
  --plum: #6F5060;
  --plum-deep: #4E3846;
  --sand: #DED3C9;
  --sand-2: #EDE6DF;
  --steel: #8FA1A6;
  --steel-ink: #4F6169;
  --clay: #A6968D;
  --flag: #9C4444;
  --flag-bg: #F7EDEC;

  --measure: 44rem;
  --serif: 'Marcellus', 'Iowan Old Style', Georgia, serif;
  --sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  background: var(--paper);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 16px;
  line-height: 1.6;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}
.nyc *, .nyc *::before, .nyc *::after { box-sizing: border-box; }
/* Deliberately no element-level paragraph reset here: an element selector
   scoped under .nyc outranks the single-class rules below, which would
   silently override every margin the components set. */
.nyc h1, .nyc h2, .nyc h3, .nyc h4 { margin: 0; font-weight: 400; }

/* ---------- layout ---------- */
.wrap { max-width: var(--measure); margin: 0 auto; padding: 0 24px; }
.wide { max-width: 60rem; margin: 0 auto; padding: 0 24px; }

/* ---------- masthead ---------- */
.masthead { border-bottom: 1px solid var(--sand); background: var(--paper); }
.mast-inner { padding: 48px 0 32px; }
.mast-kicker {
  font-size: 11px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase;
  color: var(--plum); margin-bottom: 20px;
}
.mast-flag {
  display: inline-block; margin-left: 10px; padding: 3px 8px;
  border: 1px solid var(--plum); color: var(--plum); background: #F5F0F2;
  font-size: 10px; font-weight: 700; letter-spacing: .12em; border-radius: 2px;
}
.mast-title { font-family: var(--serif); font-size: clamp(30px, 5vw, 44px); line-height: 1.14; letter-spacing: -.01em; }
.mast-meta { margin-top: 18px; display: flex; flex-wrap: wrap; gap: 8px 20px; align-items: baseline; }
.mast-period { font-size: 15px; font-weight: 600; color: var(--ink); }
.mast-len { font-size: 13px; color: var(--ink-3); }
.mast-paid {
  margin-top: 18px; font-size: 14px; color: var(--ink-2);
  border-left: 2px solid var(--sand); padding-left: 14px;
}

/* ---------- sticky nav ---------- */
.railwrap { position: sticky; top: 0; z-index: 40; background: rgba(250,250,248,.94); backdrop-filter: blur(8px); border-bottom: 1px solid var(--sand); }
.rail { display: flex; gap: 4px; overflow-x: auto; padding: 10px 0; scrollbar-width: none; }
.rail::-webkit-scrollbar { display: none; }
.rail a {
  font-size: 12.5px; font-weight: 600; color: var(--ink-3); text-decoration: none;
  padding: 6px 10px; border-radius: 2px; white-space: nowrap; transition: color .15s, background .15s;
}
.rail a:hover { color: var(--plum); background: var(--sand-2); }
.rail a.on { color: var(--plum); background: var(--sand-2); }

/* ---------- section ---------- */
.sec { padding: 64px 0 8px; }
.sec-num {
  font-family: var(--serif); font-size: 13px; color: var(--plum);
  letter-spacing: .04em; margin-bottom: 10px;
}
.sec-title { font-family: var(--serif); font-size: clamp(24px, 3.4vw, 32px); line-height: 1.22; letter-spacing: -.005em; max-width: 30ch; }
.sec-lede { margin-top: 14px; font-size: 16.5px; color: var(--ink-2); max-width: 62ch; }
.rule { height: 1px; background: var(--sand); border: 0; margin: 0; }

/* reveal — content is ALWAYS visible in the markup. The entrance is an
   animation played on scroll-in, never a hidden start state. This keeps the
   server and client markup identical (no hydration mismatch) and means the
   report still reads in full if JavaScript never runs or fails. */
.rv { opacity: 1; transform: none; }
.rv.in { animation: rv-in .5s cubic-bezier(.2,.7,.3,1) both; }
@keyframes rv-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

/* ---------- the brief ---------- */
.brief-head { font-family: var(--serif); font-size: clamp(22px, 3.2vw, 30px); line-height: 1.28; margin: 8px 0 32px; max-width: 26ch; }
.brief-item { display: grid; grid-template-columns: 150px 1fr; gap: 24px; padding: 22px 0; border-top: 1px solid var(--sand); }
.brief-item:last-child { border-bottom: 1px solid var(--sand); }
.brief-role {
  font-size: 11px; font-weight: 700; letter-spacing: .13em; text-transform: uppercase;
  color: var(--plum); padding-top: 4px;
}
.brief-text { font-size: 16.5px; color: var(--ink); margin: 0; }

/* ---------- scoreboard ---------- */
.score { margin-top: 8px; }
.score-row { display: grid; grid-template-columns: 190px 1fr; gap: 28px; padding: 26px 0; border-top: 1px solid var(--sand); align-items: start; }
.score-row:last-child { border-bottom: 1px solid var(--sand); }
.score-metric { font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); }
.score-val { font-family: var(--serif); font-size: 40px; line-height: 1.05; margin-top: 6px; color: var(--ink); font-variant-numeric: tabular-nums; }
.score-sub { font-size: 12.5px; color: var(--ink-3); margin-top: 4px; }
.score-change { display: flex; align-items: baseline; gap: 7px; font-size: 13.5px; font-weight: 600; margin-bottom: 8px; }
.score-reading { font-size: 15.5px; color: var(--ink-2); margin: 0; }
.d-up { color: var(--steel-ink); }
.d-down { color: var(--plum); }
.d-flat, .d-none { color: var(--ink-3); font-weight: 500; }
.tone-good .score-val { color: var(--plum-deep); }

/* ---------- what worked ---------- */
.work { border: 1px solid var(--sand); background: #fff; margin-top: 28px; }
.work-media { position: relative; background: var(--sand-2); border-bottom: 1px solid var(--sand); display: flex; align-items: center; justify-content: center; }
.work-media.has-img { aspect-ratio: 4 / 3; }
.work-media.no-img { padding: 26px 20px; }
.work-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.work-ph { text-align: center; }
.work-ph-label { font-size: 12px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); }
.work-ph-sub { font-size: 13px; color: var(--ink-3); margin-top: 8px; max-width: 34ch; }
.work-body { padding: 24px 26px 26px; }
.work-kicker { font-size: 11px; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; color: var(--plum); }
.work-title { font-family: var(--serif); font-size: 22px; line-height: 1.28; margin-top: 8px; }
.work-stats { display: flex; flex-wrap: wrap; gap: 0; margin: 20px 0; border-top: 1px solid var(--sand); border-bottom: 1px solid var(--sand); }
.work-stat { flex: 1 1 130px; padding: 14px 14px 14px 0; min-width: 0; }
.work-stat + .work-stat { border-left: 1px solid var(--sand); padding-left: 16px; }
.work-stat:last-child { padding-right: 0; }
.work-stat-v { font-family: var(--serif); font-size: 24px; line-height: 1; font-variant-numeric: tabular-nums; }
.work-stat-l { font-size: 11px; font-weight: 600; letter-spacing: .07em; text-transform: uppercase; color: var(--ink-3); margin-top: 6px; }
.work-q { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 6px; }
.work-a { font-size: 15.5px; color: var(--ink-2); margin: 0 0 18px; }
.work-a:last-child { margin-bottom: 0; }
.work-link { font-size: 13px; font-weight: 600; color: var(--plum); text-decoration: none; border-bottom: 1px solid var(--sand); }
.work-link:hover { border-color: var(--plum); }

.channel { margin-top: 32px; border-left: 3px solid var(--plum); padding: 4px 0 4px 20px; }
.channel-t { font-family: var(--serif); font-size: 20px; line-height: 1.3; }
.channel-b { font-size: 15.5px; color: var(--ink-2); margin: 10px 0 0; }

/* ---------- attention ---------- */
.att { padding: 26px 0; border-top: 1px solid var(--sand); }
.att:last-child { border-bottom: 1px solid var(--sand); }
.tag {
  display: inline-block; font-size: 10.5px; font-weight: 700; letter-spacing: .12em;
  text-transform: uppercase; padding: 4px 9px; border: 1px solid; border-radius: 2px;
}
.tag-issue { color: var(--flag); border-color: var(--flag); background: var(--flag-bg); }
.tag-expected { color: var(--steel-ink); border-color: var(--steel); background: #EEF2F3; }
.tag-limitation { color: var(--ink-2); border-color: var(--clay); background: var(--sand-2); }
.tag-early { color: var(--plum); border-color: var(--plum); background: #F5F0F2; }
.att-t { font-family: var(--serif); font-size: 20px; line-height: 1.32; margin: 14px 0 10px; max-width: 34ch; }
.att-b { font-size: 15.5px; color: var(--ink-2); margin: 0; }
.att-so { margin-top: 12px; font-size: 15px; color: var(--ink); border-left: 2px solid var(--sand); padding-left: 14px; }
.att-so b { font-weight: 700; }

/* ---------- learned ---------- */
.learn { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--sand); border: 1px solid var(--sand); margin-top: 28px; }
.learn-c { background: var(--paper); padding: 28px 24px; }
.learn-f { font-family: var(--serif); font-size: 38px; line-height: 1.05; color: var(--plum); font-variant-numeric: tabular-nums; }
.learn-u { font-size: 11.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); margin-top: 8px; }
.learn-t { font-size: 15px; color: var(--ink-2); margin: 14px 0 0; }

/* ---------- moves ---------- */
.move { display: grid; grid-template-columns: 44px 1fr; gap: 20px; padding: 28px 0; border-top: 1px solid var(--sand); }
.move:last-child { border-bottom: 1px solid var(--sand); }
.move-n { font-family: var(--serif); font-size: 28px; color: var(--plum); line-height: 1; padding-top: 2px; }
.move-a { font-family: var(--serif); font-size: 21px; line-height: 1.3; max-width: 34ch; }
.move-w { font-size: 15.5px; color: var(--ink-2); margin: 12px 0 0; }
.move-meta { display: flex; flex-wrap: wrap; gap: 10px 32px; margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--sand-2); }
.move-meta div { min-width: 200px; }
.move-meta dt { font-size: 10.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
.move-meta dd { margin: 4px 0 0; font-size: 14px; color: var(--ink); }

/* ---------- what we do next (client) ---------- */
.plan { margin-top: 26px; }
.plan-i { display: grid; grid-template-columns: 8px 1fr; gap: 20px; padding: 24px 0; border-top: 1px solid var(--sand); }
.plan-i:last-child { border-bottom: 1px solid var(--sand); }
.plan-m { width: 8px; height: 8px; background: var(--plum); margin-top: 12px; }
.plan-t { font-family: var(--serif); font-size: 20px; line-height: 1.3; max-width: 34ch; }
.plan-b { font-size: 15.5px; color: var(--ink-2); margin: 10px 0 0; }
@media (max-width: 720px) { .plan-i { grid-template-columns: 8px 1fr; gap: 14px; } }

/* ---------- detail / disclosure ---------- */
.disc { border-top: 1px solid var(--sand); }
.disc:last-of-type { border-bottom: 1px solid var(--sand); }
.disc-btn {
  width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 20px 0; background: none; border: 0; cursor: pointer; text-align: left;
  font-family: var(--sans); color: var(--ink);
}
.disc-btn:focus-visible { outline: 2px solid var(--plum); outline-offset: 3px; }
.disc-t { font-family: var(--serif); font-size: 19px; line-height: 1.3; }
.disc-s { font-size: 13px; color: var(--ink-3); margin-top: 3px; }
.disc-i { flex-shrink: 0; width: 22px; height: 22px; position: relative; }
.disc-i::before, .disc-i::after { content: ''; position: absolute; background: var(--plum); transition: transform .22s ease; }
.disc-i::before { left: 0; top: 10px; width: 22px; height: 1.5px; }
.disc-i::after { left: 10px; top: 0; width: 1.5px; height: 22px; }
.disc-btn[aria-expanded="true"] .disc-i::after { transform: scaleY(0); }
.disc-panel { padding: 4px 0 34px; }

/* ---------- charts + tables ---------- */
.chart-t { font-size: 15px; font-weight: 700; color: var(--ink); margin: 0 0 4px; max-width: 46ch; }
.chart-n { font-size: 13.5px; color: var(--ink-3); margin: 0 0 16px; max-width: 62ch; }
.block { margin-bottom: 34px; }
.block:last-child { margin-bottom: 0; }

.bar-row { display: grid; grid-template-columns: 1fr; gap: 5px; padding: 9px 0; }
.bar-top { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
.bar-l { font-size: 14px; color: var(--ink); }
.bar-v { font-size: 14px; font-weight: 700; font-variant-numeric: tabular-nums; color: var(--ink); }
.bar-track { height: 7px; background: var(--sand-2); }
.bar-fill { height: 100%; background: var(--plum); transition: width .9s cubic-bezier(.2,.7,.3,1); }
.bar-fill.alt { background: var(--steel); }

.stack { display: flex; height: 34px; border: 1px solid var(--sand); overflow: hidden; }
.stack-seg { display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; min-width: 0; overflow: hidden; }
.stack-key { display: flex; flex-wrap: wrap; gap: 8px 22px; margin-top: 12px; }
.stack-key span { font-size: 13px; color: var(--ink-2); display: flex; align-items: center; gap: 7px; }
.stack-key i { width: 10px; height: 10px; display: block; }

table.t { width: 100%; border-collapse: collapse; font-size: 14px; }
table.t th {
  text-align: left; font-size: 10.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  color: var(--ink-3); padding: 0 10px 9px 0; border-bottom: 1px solid var(--sand); white-space: nowrap;
}
table.t td { padding: 11px 10px 11px 0; border-bottom: 1px solid var(--sand-2); vertical-align: top; }
table.t td.n, table.t th.n { text-align: right; font-variant-numeric: tabular-nums; padding-right: 0; }
table.t tr:last-child td { border-bottom: 1px solid var(--sand); }
.t-wrap { overflow-x: auto; }
.na { color: var(--ink-3); font-style: italic; font-size: 13px; }

.kv { display: flex; flex-wrap: wrap; gap: 1px; background: var(--sand); border: 1px solid var(--sand); margin-bottom: 22px; }
.kv > div { background: var(--paper); padding: 16px 18px; flex: 1 1 140px; }
.kv dt { font-size: 10.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); }
.kv dd { margin: 6px 0 0; font-family: var(--serif); font-size: 24px; line-height: 1; font-variant-numeric: tabular-nums; }

.note {
  font-size: 13.5px; color: var(--ink-2); background: var(--sand-2);
  border-left: 2px solid var(--clay); padding: 12px 16px; margin: 16px 0 0;
}
.note b { font-weight: 700; color: var(--ink); }

.spark-lbl { display: flex; justify-content: space-between; font-size: 11.5px; color: var(--ink-3); margin-top: 6px; }

/* ---------- method + footer ---------- */
.method-q { font-family: var(--serif); font-size: 17px; margin-bottom: 8px; }
.method-a { font-size: 15px; color: var(--ink-2); margin: 0 0 26px; max-width: 62ch; }
.foot { border-top: 1px solid var(--sand); margin-top: 64px; padding: 30px 0 60px; font-size: 13px; color: var(--ink-3); display: flex; flex-wrap: wrap; gap: 8px 20px; justify-content: space-between; }

/* ---------- responsive ---------- */
@media (max-width: 720px) {
  .brief-item { grid-template-columns: 1fr; gap: 8px; }
  .score-row { grid-template-columns: 1fr; gap: 12px; }
  .learn { grid-template-columns: 1fr; }
  .move { grid-template-columns: 30px 1fr; gap: 14px; }
  .move-n { font-size: 22px; }
  .work-stat + .work-stat { border-left: 0; padding-left: 0; }
  .work-stat { flex: 1 1 45%; }
  .sec { padding: 48px 0 4px; }
  .mast-inner { padding: 34px 0 26px; }
}

/* ---------- print ---------- */
@media print {
  .nyc { background: #fff; font-size: 11pt; }
  .railwrap, .no-print { display: none !important; }
  .rv, .rv.in { opacity: 1 !important; transform: none !important; animation: none !important; }
  .disc-panel { display: block !important; }
  .disc-i { display: none; }
  .sec, .work, .att, .move, .learn-c, .disc { break-inside: avoid; page-break-inside: avoid; }
  .sec { padding: 24pt 0 0; }
  .sec-title, .mast-title, .brief-head { break-after: avoid; }
  a { color: inherit; text-decoration: none; }
  .wrap, .wide { max-width: 100%; padding: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .nyc *, .nyc *::before, .nyc *::after { transition: none !important; animation: none !important; }
  .rv, .rv.in { opacity: 1 !important; transform: none !important; animation: none !important; }
}

/* ---------- source windows strip ---------- */
.srcs { display: flex; flex-wrap: wrap; gap: 1px; background: var(--sand); border: 1px solid var(--sand); margin-top: 26px; }
.srcs > div { background: var(--paper); padding: 14px 16px; flex: 1 1 155px; }
.srcs dt { font-size: 10.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); }
.srcs dd { margin: 5px 0 0; font-size: 14px; font-weight: 600; color: var(--ink); font-variant-numeric: tabular-nums; }
.srcs p { margin: 6px 0 0; font-size: 12.5px; color: var(--ink-3); line-height: 1.45; }

/* ---------- period line (signature) ---------- */
.pl { margin-top: 28px; border: 1px solid var(--sand); background: #fff; padding: 22px 22px 18px; }
.pl-svg { display: block; width: 100%; height: auto; }
.pl-bands { display: flex; flex-wrap: wrap; gap: 1px; background: var(--sand); border: 1px solid var(--sand); margin-top: 20px; }
.pl-band { background: var(--paper); padding: 14px 18px; flex: 1 1 180px; }
.pl-band dt { font-size: 10.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); }
.pl-band dd { margin: 6px 0 0; font-family: var(--serif); font-size: 26px; line-height: 1; }
.pl-band p { margin: 5px 0 0; font-size: 12.5px; color: var(--ink-3); }

/* ---------- post gallery ---------- */
.gal { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--sand); border: 1px solid var(--sand); margin-top: 28px; }
.gal-i { background: var(--paper); display: flex; flex-direction: column; text-decoration: none; color: inherit; transition: background .18s; }
.gal-i:hover { background: #fff; }
.gal-i:focus-visible { outline: 2px solid var(--plum); outline-offset: -2px; }
.gal-i.lead { grid-column: 1 / -1; }
/* Instagram's embed page stacks a header, the media, then a caption/actions
   footer. --ig-top lifts the header out of view and --ig-tall gives the iframe
   enough height that the media fills the frame before the footer is clipped.
   Adjust those two values if Instagram changes the embed chrome. */
.gal-shot { position: relative; aspect-ratio: 1 / 1; background: var(--sand-2); overflow: hidden; --ig-top: 56px; --ig-tall: 260px; }
/* The hero spans the full width, but Instagram renders its media at the width
   of the iframe. Letting it run edge to edge would make a square post taller
   than any sensible banner, so the frame is centred at a fixed width and the
   card height is set to match. 440px wide clears a square post (440 tall) and
   a 4:5 portrait (550 tall) without cropping either. */
.gal-i.lead .gal-shot { aspect-ratio: auto; height: 560px; --ig-tall: 420px; }
.gal-crop { position: absolute; inset: 0; overflow: hidden; }
.gal-i.lead .gal-crop { left: 50%; transform: translateX(-50%); width: min(100%, 440px); }
.gal-crop iframe {
  position: absolute; top: calc(var(--ig-top) * -1); left: 0;
  width: 100%; height: calc(100% + var(--ig-top) + var(--ig-tall));
  border: 0; display: block; background: var(--sand-2);
}
/* Shown only when printing, where iframes render blank. */
.gal-print { display: none; }
.gal-rank { position: absolute; top: 0; left: 0; background: var(--plum); color: #fff; font-family: var(--serif); font-size: 15px; line-height: 1; padding: 7px 10px; }
.gal-b { padding: 14px 16px 16px; display: flex; flex-direction: column; flex: 0 0 auto; }
.gal-k { font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--plum); }
.gal-t { font-family: var(--serif); font-size: 16px; line-height: 1.3; margin-top: 6px; }
.gal-i.lead .gal-t { font-size: 21px; }
.gal-s { display: flex; gap: 16px; margin-top: auto; padding-top: 14px; }
.gal-s div { min-width: 0; }
.gal-s b { display: block; font-family: var(--serif); font-size: 18px; font-weight: 400; line-height: 1; font-variant-numeric: tabular-nums; }
.gal-s span { display: block; font-size: 9.5px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--ink-3); margin-top: 5px; }
.gal-link { display: inline-block; margin-top: 14px; font-size: 12.5px; font-weight: 600; color: var(--plum); text-decoration: none; border-bottom: 1px solid var(--sand); padding-bottom: 2px; }
.gal-link:hover { border-bottom-color: var(--plum); }

@media (max-width: 520px) {
  .gal { grid-template-columns: 1fr; }
  .gal-i.lead .gal-shot { height: auto; aspect-ratio: 4 / 5; }
  .gal-i.lead .gal-crop { width: 100%; }
  .gal-i.lead .gal-t { font-size: 18px; }
}
@media print {
  .gal { grid-template-columns: repeat(2, 1fr); }
  .gal-i, .gal-i.lead { break-inside: avoid; }
  .gal-i .gal-shot, .gal-i.lead .gal-shot { aspect-ratio: 3 / 1; }
  .gal-crop { display: none; }
  .gal-print { display: flex; position: absolute; inset: 0; flex-direction: column;
    align-items: center; justify-content: center; text-align: center; padding: 12px; }
  .gal-print span { font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
  .gal-print em { font-style: normal; font-family: var(--serif); font-size: 14px; color: var(--ink); margin-top: 5px; }
  .gal-link { display: none; }
}

/* ---------- email funnel ---------- */
.fun-row { display: grid; gap: 5px; padding: 9px 0; }
.fun-top { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
.fun-l { font-size: 14px; color: var(--ink); }
.fun-v { font-size: 14px; font-weight: 700; font-variant-numeric: tabular-nums; }
.fun-track { height: 24px; background: var(--sand-2); display: flex; align-items: center; }
.fun-fill { height: 100%; background: var(--plum); display: flex; align-items: center; padding-left: 10px; color: #fff; font-size: 12px; font-weight: 700; transition: width .9s cubic-bezier(.2,.7,.3,1); }
.fun-fill.thin { background: var(--steel); color: var(--ink); padding-left: 0; }
.fun-out { font-size: 12px; font-weight: 700; color: var(--ink-2); padding-left: 10px; }

/* ---------- email reads ---------- */
.reads { margin: 18px 0 0; padding: 0; list-style: none; }
.reads li { font-size: 15px; color: var(--ink-2); padding: 11px 0 11px 18px; border-top: 1px solid var(--sand-2); position: relative; }
.reads li:first-child { border-top: 0; }
.reads li::before { content: ''; position: absolute; left: 0; top: 19px; width: 6px; height: 6px; background: var(--plum); }

/* ---------- campaign gap list ---------- */
.camp { display: grid; grid-template-columns: 1fr 62px 54px; gap: 12px; align-items: center; padding: 10px 0; border-top: 1px solid var(--sand-2); font-size: 14px; }
.camp:first-of-type { border-top: 0; }
.camp-n { color: var(--ink); }
.camp-d { font-size: 12.5px; color: var(--ink-3); text-align: right; }
.camp-r { font-weight: 700; font-variant-numeric: tabular-nums; text-align: right; }
.camp.low .camp-n, .camp.low .camp-r { color: var(--flag); }

@media (max-width: 720px) {
  .pl { padding: 16px 14px 14px; }
  .camp { grid-template-columns: 1fr 54px; }
  .camp-d { display: none; }
}

@media print {
  .pl { border-color: #999; }
  .pl-bands, .srcs { break-inside: avoid; }
}
`;
function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  /* Starts false on both server and client, so the first client render is
     byte-identical to the server's. The class is only ever added later. */
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    /* Already on screen when the page loaded — it is visible, leave it alone
       rather than animating it in after the fact. */
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setPlay(true); io.disconnect(); } }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`rv${play ? " in" : ""}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Section({
  id, num, title, lede, children,
}: { id: string; num: string; title: string; lede?: string; children: ReactNode }) {
  return (
    <section id={id} className="sec">
      <Reveal>
        <div className="sec-num">{num}</div>
        <h2 className="sec-title">{title}</h2>
        {lede ? <p className="sec-lede">{lede}</p> : null}
      </Reveal>
      {children}
    </section>
  );
}

function Delta({ dir, text }: { dir: string; text: string }) {
  const glyph = dir === "up" ? "▲" : dir === "down" ? "▼" : dir === "flat" ? "—" : "";
  return (
    <div className={`score-change d-${dir}`}>
      {glyph ? <span aria-hidden="true">{glyph}</span> : null}
      <span>{text}</span>
    </div>
  );
}

/** Line chart for a value over time. Endpoints are labelled directly. */
function Sparkline({ points, label }: { points: { date: string; v: number }[]; label: string }) {
  const W = 660, H = 130, PAD = 8, TOP = 26, BOT = 12;
  const vals = points.map((p) => p.v);
  const max = Math.max(...vals), min = Math.min(...vals);
  const span = max - min || 1;
  const x = (i: number) => PAD + (i / Math.max(points.length - 1, 1)) * (W - PAD * 2);
  const y = (v: number) => H - BOT - ((v - min) / span) * (H - TOP - BOT);
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(points.length - 1).toFixed(1)},${H} L${x(0).toFixed(1)},${H} Z`;
  const peakIdx = vals.indexOf(max);
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="130" role="img"
           aria-label={`${label}. Ranges from ${min.toLocaleString()} to ${max.toLocaleString()}.`}>
        <path d={area} fill="rgba(111,80,96,0.09)" />
        <path d={line} fill="none" stroke="#6F5060" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle key={i} cx={x(i)} cy={y(p.v)} r={i === peakIdx ? 3.5 : 2} fill={i === peakIdx ? "#6F5060" : "#FAFAF8"} stroke="#6F5060" strokeWidth="1.25" />
        ))}
        <text x={x(peakIdx)} y={y(max) - 9} textAnchor="middle" fontSize="11" fontWeight="700" fill="#4E3846">
          {max.toLocaleString()}
        </text>
      </svg>
      <div className="spark-lbl">
        <span>{points[0]?.date}</span>
        <span>{points[points.length - 1]?.date}</span>
      </div>
    </div>
  );
}

/** Ranked horizontal bars with the value printed on every row. */
function BarList({
  items, unit, alt = false, max: forcedMax,
}: { items: { label: string; value: number; note?: string }[]; unit?: string; alt?: boolean; max?: number }) {
  const max = forcedMax ?? Math.max(...items.map((i) => i.value), 1);
  return (
    <div>
      {items.map((it) => (
        <div className="bar-row" key={it.label}>
          <div className="bar-top">
            <span className="bar-l">{it.label}</span>
            <span className="bar-v">{it.value.toLocaleString()}{unit ? ` ${unit}` : ""}</span>
          </div>
          <div className="bar-track">
            <div className={`bar-fill${alt ? " alt" : ""}`} style={{ width: `${(it.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Single stacked bar for a two- or three-way split. Replaces donuts. */
function Stack({ parts }: { parts: { label: string; pct: number }[] }) {
  /* Each fill is paired with a text colour that clears WCAG AA against it.
     White fails on the two lighter fills, so those carry dark text instead. */
  const fills = [
    { bg: "#6F5060", fg: "#FFFFFF" },
    { bg: "#8FA1A6", fg: "#251F22" },
    { bg: "#A6968D", fg: "#251F22" },
  ];
  return (
    <div>
      <div className="stack">
        {parts.map((p, i) => {
          const f = fills[i % fills.length];
          return (
            <div key={p.label} className="stack-seg" style={{ width: `${p.pct}%`, background: f.bg, color: f.fg }}>
              {p.pct >= 14 ? `${p.pct}%` : ""}
            </div>
          );
        })}
      </div>
      <div className="stack-key">
        {parts.map((p, i) => (
          <span key={p.label}>
            <i style={{ background: fills[i % fills.length].bg }} />
            {p.label} — {p.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}

function Chart({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <div className="block">
      <p className="chart-t">{title}</p>
      {note ? <p className="chart-n">{note}</p> : null}
      {children}
    </div>
  );
}

function Note({ children }: { children: ReactNode }) {
  return <p className="note">{children}</p>;
}

function Disclosure({
  title, subtitle, defaultOpen = false, children,
}: { title: string; subtitle?: string; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="disc">
      <button className="disc-btn" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span>
          <span className="disc-t">{title}</span>
          {subtitle ? <span className="disc-s" style={{ display: "block" }}>{subtitle}</span> : null}
        </span>
        <span className="disc-i" aria-hidden="true" />
      </button>
      <div className="disc-panel" hidden={!open}>{children}</div>
    </div>
  );
}

function KV({ items }: { items: { k: string; v: string }[] }) {
  return (
    <dl className="kv">
      {items.map((i) => (
        <div key={i.k}>
          <dt>{i.k}</dt>
          <dd>{i.v}</dd>
        </div>
      ))}
    </dl>
  );
}

const TAG_LABEL: Record<string, string> = {
  issue: "Performance issue",
  expected: "Expected change",
  limitation: "Data limitation",
  early: "Too early to judge",
};

/** The signature chart. One continuous daily line across both halves of the
 *  month, with the paid stretch shaded and each half's average drawn directly
 *  on top of it, so the step down is visible rather than asserted. */
function PeriodChart({
  series, paidThrough, markers,
}: {
  series: { d: string; v: number }[];
  paidThrough: number;
  markers: { i: number; label: string }[];
}) {
  const W = 720, H = 230, L = 34, R = 14, T = 30, B = 34;
  const max = 60;
  const x = (i: number) => L + (i / Math.max(series.length - 1, 1)) * (W - L - R);
  const y = (v: number) => H - B - (v / max) * (H - T - B);

  const line = series.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(series.length - 1).toFixed(1)},${H - B} L${x(0).toFixed(1)},${H - B} Z`;

  const paidVals = series.slice(0, paidThrough + 1).map((p) => p.v);
  const orgVals = series.slice(paidThrough + 1).map((p) => p.v);
  const avg = (a: number[]) => a.reduce((s, n) => s + n, 0) / a.length;
  const paidAvg = avg(paidVals), orgAvg = avg(orgVals);

  return (
    <svg
      className="pl-svg" viewBox={`0 0 ${W} ${H}`} role="img"
      aria-label={`New website visitors per day from ${series[0].d} to ${series[series.length - 1].d}. Averaged ${paidAvg.toFixed(0)} a day while advertising ran, and ${orgAvg.toFixed(0)} a day after it ended.`}
    >
      {/* shaded paid stretch */}
      <rect x={x(0)} y={T - 12} width={x(paidThrough) - x(0)} height={H - B - T + 12} fill="#6F5060" opacity="0.055" />
      <text x={x(0) + 6} y={T - 16} fontSize="10.5" fontWeight="700" fill="#6F5060" letterSpacing="0.08em">ADVERTISING RUNNING</text>

      {/* gridlines */}
      {[0, 20, 40, 60].map((g) => (
        <g key={g}>
          <line x1={L} x2={W - R} y1={y(g)} y2={y(g)} stroke="#DED3C9" strokeWidth="1" />
          <text x={L - 7} y={y(g) + 3.5} fontSize="10" fill="#6E6268" textAnchor="end">{g}</text>
        </g>
      ))}

      <path d={area} fill="rgba(111,80,96,0.10)" />
      <path d={line} fill="none" stroke="#6F5060" strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round" />

      {/* per-half averages, drawn directly on the data */}
      <line x1={x(0)} x2={x(paidThrough)} y1={y(paidAvg)} y2={y(paidAvg)} stroke="#4E3846" strokeWidth="1.5" strokeDasharray="5 4" />
      <text x={x(paidThrough) - 4} y={y(paidAvg) - 7} fontSize="11" fontWeight="700" fill="#4E3846" textAnchor="end">{paidAvg.toFixed(0)} a day</text>
      <line x1={x(paidThrough)} x2={x(series.length - 1)} y1={y(orgAvg)} y2={y(orgAvg)} stroke="#4F6169" strokeWidth="1.5" strokeDasharray="5 4" />
      <text x={x(series.length - 1) - 2} y={y(orgAvg) - 7} fontSize="11" fontWeight="700" fill="#4F6169" textAnchor="end">{orgAvg.toFixed(0)} a day</text>

      {/* event markers */}
      {markers.map((m) => (
        <g key={m.label}>
          <line x1={x(m.i)} x2={x(m.i)} y1={T - 6} y2={H - B} stroke="#8FA1A6" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={x(m.i)} cy={y(series[m.i].v)} r="3.4" fill="#FAFAF8" stroke="#6F5060" strokeWidth="1.6" />
          <text x={x(m.i) + 5} y={T - 1} fontSize="10.5" fontWeight="600" fill="#4F6169">{m.label}</text>
        </g>
      ))}

      {/* x labels */}
      {[0, paidThrough, series.length - 1].map((i) => (
        <text key={i} x={x(i)} y={H - 12} fontSize="10.5" fill="#6E6268"
              textAnchor={i === 0 ? "start" : i === series.length - 1 ? "end" : "middle"}>
          {series[i].d}
        </text>
      ))}
    </svg>
  );
}

/** Post gallery. Images live in /public/posts/. If a file is not there yet the
 *  card falls back to a labelled placeholder rather than a broken image, so the
 *  report is publishable before the assets are dropped in. */
/* Instagram serves <permalink>/embed as a standalone page, so a plain iframe
   renders the real post with no API, no access token and no downloaded files.
   Paste a permalink into the data above and the post appears.

   Normalising: strip any tracking parameters Instagram appends when you copy a
   link from the app, drop trailing slashes, and fold /reels/ to /reel/, which
   is the form the embed endpoint expects. */
const embedFor = (url: string) =>
  url.split(/[?#]/)[0].replace(/\/+$/, "").replace("/reels/", "/reel/") + "/embed";

function Gallery({ items }: { items: { title: string; format: string; date: string; url: string; views: string; reach: string; er: string; lead: boolean }[] }) {
  return (
    <div className="gal">
      {items.map((p, i) => (
        <div key={p.url} className={`gal-i${p.lead ? " lead" : ""}`}>
          <div className="gal-shot">
            <div className="gal-crop">
              <iframe
                src={embedFor(p.url)}
                title={p.title}
                loading="lazy"
                scrolling="no"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            {/* Iframes do not render in print or PDF export, so a titled panel
                takes their place rather than leaving a blank rectangle. */}
            <div className="gal-print">
              <span>{p.format}</span>
              <em>{p.title}</em>
            </div>
            <div className="gal-rank">{i + 1}</div>
          </div>
          <div className="gal-b">
            <div className="gal-k">{p.format} · {p.date}</div>
            <h3 className="gal-t">{p.title}</h3>
            <div className="gal-s">
              <div><b>{p.views}</b><span>Views</span></div>
              <div><b>{p.reach}</b><span>Reach</span></div>
              <div><b>{p.er}</b><span>Engagement</span></div>
            </div>
            <a className="gal-link" href={p.url} target="_blank" rel="noopener noreferrer">
              View on Instagram →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Email funnel. A stepped bar, because the question is how many survive each
 *  stage — a shape a donut cannot answer. */
function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const top = steps[0]?.value || 1;
  return (
    <div>
      {steps.map((s) => {
        const pct = (s.value / top) * 100;
        const thin = pct < 18;
        return (
          <div className="fun-row" key={s.label}>
            <div className="fun-top">
              <span className="fun-l">{s.label}</span>
              <span className="fun-v">{s.value.toLocaleString()}</span>
            </div>
            <div className="fun-track">
              <div className={`fun-fill${thin ? " thin" : ""}`} style={{ width: `${Math.max(pct, 0.6)}%` }}>
                {!thin ? `${Math.round(pct)}% of sent` : ""}
              </div>
              {thin ? <span className="fun-out">{Math.round(pct)}% of sent</span> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ==========================================================================
   PAGE
   ========================================================================== */

const ALL_SECTIONS = [
  { id: "brief", label: "The brief" },
  { id: "period", label: "The period" },
  { id: "scoreboard", label: "Scoreboard" },
  { id: "worked", label: "What worked" },
  { id: "attention", label: "Needs attention", internalOnly: true },
  { id: "learned", label: "What we learned" },
  { id: "moves", label: "Next moves", internalOnly: true },
  { id: "plan", label: "What we do next", clientOnly: true },
  { id: "detail", label: "Detail" },
];

/* Sections present in this build, in order. Numbering and nav both derive from
   this, so removing a section never leaves a gap in the sequence. */
const NAV = ALL_SECTIONS.filter((x) => (IS_INTERNAL ? !x.clientOnly : !x.internalOnly));
const ORDINALS = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];
const numOf = (id: string) => ORDINALS[NAV.findIndex((n) => n.id === id)] ?? "";
const has = (id: string) => NAV.some((n) => n.id === id);

const SOURCE_WINDOWS = [
  { k: "Instagram, Facebook", v: "Aug 2 – 15", p: "Metricool reports in 14-day blocks, so social ends a day earlier." },
  { k: "Search", v: "Aug 2 – 16", p: "August 16 was still processing at export and is an incomplete day." },
  { k: "Website", v: "Aug 2 – 16", p: "Full days." },
  { k: "Short links", v: "Aug 2 – 17", p: "Short.io exported one extra day on its own calendar." },
  { k: "Email", v: "Rolling 90 days", p: "Cannot be narrowed to match. Reported separately and not compared." },
];

export default function Report() {
  const [active, setActive] = useState("brief");

  useEffect(() => {
    const ids = NAV.map((n) => n.id);
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (vis) setActive(vis.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const R = REPORT;
  const d = R.detail;

  return (
    <div className="nyc">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ---------------------------------------------------------- masthead */}
      <header className="masthead">
        <div className="wrap mast-inner">
          <div className="mast-kicker">
            {R.client.agency} · Performance Briefing
            {IS_INTERNAL ? <span className="mast-flag">Internal</span> : null}
          </div>
          <h1 className="mast-title">{R.client.name}</h1>
          <div className="mast-meta">
            <span className="mast-period">{R.period.label}</span>
            <span className="mast-len">{R.period.length} · compared with {R.period.comparedWith}</span>
          </div>
          <p className="mast-paid">{R.period.paidStatus}</p>
        </div>
      </header>

      {/* --------------------------------------------------------- sticky nav */}
      <div className="railwrap no-print">
        <div className="wide">
          <nav className="rail" aria-label="Report sections">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={active === n.id ? "on" : ""}>{n.label}</a>
            ))}
          </nav>
        </div>
      </div>

      <main className="wrap">

        {/* ------------------------------------------------------- the brief */}
        <Section id="brief" num={numOf("brief")} title={R.brief.title} lede={R.brief.lede}>
          <Reveal>
            <p className="brief-head">{R.brief.head}</p>
            {R.brief.items.map((item) => {
              const b = IS_INTERNAL ? item : (item.client ?? item);
              return (
                <div className="brief-item" key={item.role}>
                  <div className="brief-role">{b.role}</div>
                  <p className="brief-text">{b.text}</p>
                </div>
              );
            })}
          </Reveal>
        </Section>

        {/* ------------------------------------------------------ the period */}
        <Section id="period" num={numOf("period")} title={R.periodLine.title}
                 lede={R.periodLine.note}>
          <Reveal>
            <div className="pl">
              <PeriodChart
                series={R.periodLine.series}
                paidThrough={R.periodLine.paidThrough}
                markers={R.periodLine.markers}
              />
            </div>
            <dl className="pl-bands">
              {R.periodLine.bands.map((b) => (
                <div className="pl-band" key={b.label}>
                  <dt>{b.label}</dt>
                  <dd>{b.value}</dd>
                  <p>{b.detail}</p>
                </div>
              ))}
            </dl>
            <Note>
              <b>Reading this fairly:</b> the two halves are not the same kind of period. The first was
              supported by advertising and the second was not, so this is a step down to a baseline
              rather than a decline in performance. Everything after this point is the organic half.
            </Note>

            {IS_INTERNAL && <div style={{ marginTop: 34 }}>
              <p className="chart-t">The reporting windows are not identical, and that matters</p>
              <p className="chart-n">
                Each platform exports on its own calendar. Nothing here has been stretched to fit a
                single date range — the real window for each source is shown instead.
              </p>
              <dl className="srcs">
                {SOURCE_WINDOWS.map((s) => (
                  <div key={s.k}>
                    <dt>{s.k}</dt>
                    <dd>{s.v}</dd>
                    <p>{s.p}</p>
                  </div>
                ))}
              </dl>
            </div>}
          </Reveal>
        </Section>

        {/* ------------------------------------------------------ scoreboard */}
        <Section id="scoreboard" num={numOf("scoreboard")} title="The numbers that matter, and what each one means"
                 lede="Eight measures. Where a comparison would mislead, the figure is given context instead of a percentage change.">
          <div className="score">
            {R.scoreboard.map((s) => (
              <Reveal key={s.metric}>
                <div className={`score-row ${s.tone}`}>
                  <div>
                    <div className="score-metric">{s.metric}</div>
                    <div className="score-val">{s.value}</div>
                    <div className="score-sub">{s.sub}</div>
                  </div>
                  <div>
                    <Delta dir={s.dir} text={s.change} />
                    <p className="score-reading">{s.reading}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ----------------------------------------------------- what worked */}
        <Section id="worked" num={numOf("worked")} title="One team post did a third of the period's work"
                 lede={IS_INTERNAL ? R.worked.lede : undefined}>
          <Reveal>
            {/* The client build has no section lede here, so the gallery needs
                its own breathing room under the heading. */}
            <div style={{ marginTop: IS_INTERNAL ? 0 : 26 }}>
              <Chart title="Everything published this period, ranked by views" note={R.worked.galleryNote}>
                <Gallery items={R.worked.gallery} />
              </Chart>
            </div>
          </Reveal>
          <Reveal>
            <div className="work" style={{ marginTop: 34 }}>
              <div className="work-body">
                <div className="work-kicker">Top post · {R.worked.lead.kind} · {R.worked.lead.date}</div>
                <h3 className="work-title">{R.worked.lead.title}</h3>
                <div className="work-q" style={{ marginTop: 20 }}>Why it worked</div>
                <p className="work-a">{R.worked.lead.why}</p>
                <div className="work-q">Can we repeat it?</div>
                <p className="work-a">{R.worked.lead.repeatable}</p>
                <a className="work-link" href={R.worked.lead.url} target="_blank" rel="noopener noreferrer">
                  View the post on Instagram →
                </a>
              </div>
            </div>
            <div className="channel">
              <h3 className="channel-t">{R.worked.channel.title}</h3>
              <p className="channel-b">{R.worked.channel.body}</p>
            </div>
          </Reveal>
        </Section>

        {/* -------------------------------------------------- needs attention */}
{has("attention") && (
        <Section id="attention" num={numOf("attention")} title="What needs attention"
                 lede="Four of these are worth acting on and one is simply what happens when advertising stops. Each is labelled so the difference is clear.">
          {R.attention.map((a) => (
            <Reveal key={a.title}>
              <div className="att">
                <span className={`tag tag-${a.tag}`}>{TAG_LABEL[a.tag]}</span>
                <h3 className="att-t">{a.title}</h3>
                <p className="att-b">{a.body}</p>
                <p className="att-so"><b>What it means: </b>{a.so}</p>
              </div>
            </Reveal>
          ))}
        </Section>
        )}

        {/* ---------------------------------------------------- what we learned */}
        <Section id="learned" num={numOf("learned")} title="What we learned"
                 lede="Six things worth carrying into the next cycle.">
          <Reveal>
            <div className="learn">
              {R.learned.map((l) => (
                <div className="learn-c" key={l.f + l.u}>
                  <div className="learn-f">{l.f}</div>
                  <div className="learn-u">{l.u}</div>
                  <p className="learn-t">{l.t}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Section>

        {/* ------------------------------------------------------- next moves */}
{has("moves") && (
        <Section id="moves" num={numOf("moves")} title="Recommended next moves"
                 lede="Five actions for the next cycle, each with the reason behind it and the number that will show whether it worked.">
          {R.moves.map((m, i) => (
            <Reveal key={m.action}>
              <div className="move">
                <div className="move-n">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <h3 className="move-a">{m.action}</h3>
                  <p className="move-w">{m.why}</p>
                  <dl className="move-meta">
                    <div><dt>Owner</dt><dd>{m.owner}</dd></div>
                    <div><dt>What we measure next</dt><dd>{m.measure}</dd></div>
                  </dl>
                </div>
              </div>
            </Reveal>
          ))}
        </Section>
        )}

        {/* ------------------------------------------------ what we do next */}
        {has("plan") && (
        <Section id="plan" num={numOf("plan")} title="What we do next"
                 lede="Five things we are carrying into the next reporting period.">
          <div className="plan">
            {R.plan.map((p) => (
              <Reveal key={p.action}>
                <div className="plan-i">
                  <div className="plan-m" aria-hidden="true" />
                  <div>
                    <h3 className="plan-t">{p.action}</h3>
                    <p className="plan-b">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
        )}

        {/* ----------------------------------------------------------- detail */}
        <Section id="detail" num={numOf("detail")} title="Supporting detail"
                 lede="Everything above, with the full figures behind it. Open only what you need.">
          <div style={{ marginTop: 26 }}>

            <Disclosure title="Instagram" subtitle="August 2 – 15 · account totals from Metricool">
              <KV items={d.instagram.kv} />
              <Chart title="What was published" note="Ten pieces of content across three formats.">
                <BarList items={d.instagram.published} alt />
              </Chart>
              <Chart title="Every post this period" note="Ranked by views. Engagement is interactions divided by reach.">
                <div className="t-wrap">
                  <table className="t">
                    <thead>
                      <tr>
                        <th>Post</th><th>Format</th><th>Date</th>
                        <th className="n">Views</th><th className="n">Reach</th>
                        <th className="n">Interactions</th><th className="n">Engagement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.instagram.posts.map((p) => (
                        <tr key={p.t}>
                          <td>{p.t}</td><td>{p.f}</td><td>{p.d}</td>
                          <td className="n">{p.v}</td><td className="n">{p.r}</td>
                          <td className="n">{p.i}</td><td className="n">{p.e}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Chart>
              <Chart title="How long the reels held attention" note="Average watch time, and the share of viewers who stayed past three seconds.">
                <div className="t-wrap">
                  <table className="t">
                    <thead>
                      <tr><th>Reel</th><th className="n">Avg watch</th><th className="n">Past 3s</th><th className="n">Saves</th></tr>
                    </thead>
                    <tbody>
                      {d.instagram.reels.map((r) => (
                        <tr key={r.t}>
                          <td>{r.t}</td><td className="n">{r.w}</td><td className="n">{r.p}</td><td className="n">{r.s}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Chart>
              <Chart title="Stories">
                <p className="score-reading">{d.instagram.stories}</p>
              </Chart>
              <Chart title="Where followers are" note="Age and gender were not included in this export and are not shown.">
                <KV items={d.instagram.cities} />
              </Chart>
              <Note>{IS_INTERNAL ? d.instagram.note : d.instagram.clientNote}</Note>
            </Disclosure>

            <Disclosure title="Facebook" subtitle="August 2 – 15 · two posts">
              <div className="t-wrap">
                <table className="t">
                  <thead>
                    <tr>
                      <th>Post</th><th className="n">Impressions</th><th className="n">Reach</th>
                      <th className="n">Reactions</th><th className="n">Comments</th>
                      <th className="n">Shares</th><th className="n">Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.facebook.rows.map((f) => (
                      <tr key={f.p}>
                        <td>{f.p}</td><td className="n">{f.i}</td><td className="n">{f.r}</td>
                        <td className="n">{f.x}</td><td className="n">{f.c}</td>
                        <td className="n">{f.s}</td><td className="n">{f.k}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Note>{d.facebook.note}</Note>
            </Disclosure>

            <Disclosure title="Search" subtitle="August 2 – 16 · Google Search Console">
              <KV items={d.search.kv} />
              <Chart title="Impressions per day" note={d.search.dailyNote}>
                <Sparkline points={d.search.daily} label="Search impressions per day" />
              </Chart>
              <Chart title="Mobile out-clicks desktop on a fifth of the impressions" note={d.search.deviceRead}>
                <div className="t-wrap">
                  <table className="t">
                    <thead>
                      <tr><th>Device</th><th className="n">Clicks</th><th className="n">Impressions</th><th className="n">Click rate</th><th className="n">Avg position</th></tr>
                    </thead>
                    <tbody>
                      {d.search.devices.map((x) => (
                        <tr key={x.d}>
                          <td>{x.d}</td><td className="n">{x.c}</td><td className="n">{x.i}</td>
                          <td className="n">{x.r}</td><td className="n">{x.p}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Chart>
              <Chart title="Doctor pages rank on page one and convert; the homepage does neither" note="Position is where the page sits in Google's results on average. Lower is better.">
                <div className="t-wrap">
                  <table className="t">
                    <thead>
                      <tr><th>Page</th><th className="n">Clicks</th><th className="n">Impressions</th><th className="n">Click rate</th><th className="n">Position</th></tr>
                    </thead>
                    <tbody>
                      {d.search.pages.map((p) => (
                        <tr key={p.p}>
                          <td>{p.p}</td><td className="n">{p.c}</td><td className="n">{p.i}</td>
                          <td className="n">{p.r}</td><td className="n">{p.pos}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Chart>
              <Chart title="What people searched" note={d.search.queryRead}>
                <div className="t-wrap">
                  <table className="t">
                    <thead>
                      <tr><th>Query</th><th className="n">Clicks</th><th className="n">Impressions</th><th className="n">Click rate</th><th className="n">Position</th></tr>
                    </thead>
                    <tbody>
                      {d.search.queries.map((q) => (
                        <tr key={q.q}>
                          <td>{q.q}</td><td className="n">{q.c}</td><td className="n">{q.i}</td>
                          <td className="n">{q.r}</td><td className="n">{q.p}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Chart>
              <Note>{d.search.note}</Note>
            </Disclosure>

            <Disclosure title="Website" subtitle="August 2 – 16 · Google Analytics">
              <KV items={d.website.kv} />
              <Chart title="Where visitors came from" note="Sessions by source. Direct means someone typed the address or used a saved link.">
                <BarList items={d.website.sources} />
              </Chart>
              <Chart title="Desktop still dominates the site" note="Share of users by device. Search demand runs the other way — mobile clicks better than desktop.">
                <Stack parts={[{ label: "Desktop", pct: 80 }, { label: "Mobile", pct: 20 }]} />
              </Chart>
              <Chart title="Where visitors landed" note="Views by landing page.">
                <BarList items={d.website.landing} alt />
              </Chart>
              <Note>{d.website.note}</Note>
            </Disclosure>

            <Disclosure title="Links" subtitle="August 2 – 17 · Short.io">
              <KV items={d.links.kv} />
              <Chart title="Most link activity goes to a specific office, not the main site" note="Verified clicks by destination.">
                <BarList items={d.links.dests} />
              </Chart>
              <Chart title="Where the clicks came from" note="Verified clicks by city. Only locations with meaningful volume are shown.">
                <BarList items={d.links.cities} alt />
              </Chart>
              <Note>{d.links.note}</Note>
            </Disclosure>

            <Disclosure title="Email" subtitle={d.email.window}>
              <Note>{d.email.note}</Note>
              <div style={{ marginTop: 22 }}>
                <Chart title="Opens are strong; clicks are where the drop-off happens" note="Each stage as a share of everything sent.">
                  <Funnel steps={d.email.funnel} />
                </Chart>
              </div>
              <KV items={d.email.metrics} />
              <ul className="reads">
                {d.email.reads.map((r) => <li key={r}>{r}</li>)}
              </ul>
              <div style={{ marginTop: 30 }}>
                <Chart title="35th Street opens well below the other locations"
                       note="Open rate by campaign. The three lowest all sit 14 to 19 points under the top performers, and two of them are the same campaigns that did well elsewhere.">
                  <div>
                    {d.email.campaigns.map((c) => (
                      <div className={`camp${c.r <= 43 ? " low" : ""}`} key={c.n}>
                        <span className="camp-n">{c.n}</span>
                        <span className="camp-d">{c.d}</span>
                        <span className="camp-r">{c.r}%</span>
                      </div>
                    ))}
                  </div>
                </Chart>
              </div>
            </Disclosure>

            <Disclosure title="How these numbers were produced" subtitle="Sources, definitions and limitations">
              {d.method
                .filter((m) => (IS_INTERNAL ? !m.clientOnly : !m.internalOnly))
                .map((m) => (
                <div key={m.q}>
                  <h4 className="method-q">{m.q}</h4>
                  <p className="method-a">{m.a}</p>
                </div>
              ))}
            </Disclosure>

          </div>
        </Section>

        <footer className="foot">
          <span>{R.client.name} · {R.period.label}</span>
          <span>Prepared by {R.client.agency}</span>
        </footer>
      </main>
    </div>
  );
}
