"use client";
import { useState, useEffect } from "react";

const FALLBACK_DATA = {
  client: { name: "NYCDS", fullName: "NYC Dental Smiles", period: "July 1 – 31, 2026" },
  kpi: {
    followers: { value: 735, change: 27, label: "Followers" },
    reach: { value: 28427, label: "Reach" },
    views: { value: 17350, label: "Total Views" },
    engagementRate: { value: 1.39, label: "Engagement Rate", suffix: "%" },
    engagements: { value: 394, label: "Engagements" },
    watchTime: { value: "12.1s", label: "Watch Time" },
  },
  posts: [
    { id: 1, title: "What Keeps Patients Coming Back \u2014 Oleksandr (Reel)", type: "Reel", views: 1162, reach: 720, likes: 50, comments: 5, saves: 2, shares: 11, isTop: true, igPostUrl: "https://www.instagram.com/reel/DaqGc-npEIe/" },
    { id: 2, title: "When Patients No Longer Dread the Dentist (Reel)", type: "Reel", views: 1185, reach: 706, likes: 36, comments: 8, saves: 1, shares: 10, isTop: false, igPostUrl: "https://www.instagram.com/reel/Dan-hMNxehU/" },
  ] as any[],
  contentMix: { posts: 35, reels: 41, stories: 24 },
  audience: {
    gender: { male: 51, female: 49 },
    age: [
      { range: "18-24", pct: 5.4 }, { range: "25-34", pct: 29.8 }, { range: "35-44", pct: 29.8 },
      { range: "45-54", pct: 20.8 }, { range: "55-64", pct: 9.6 }, { range: "65+", pct: 4.4 },
    ],
  },
  viewerSplit: { followers: 28, nonFollowers: 72 },
};
type ReportData = typeof FALLBACK_DATA;

type Insight = { title: string; evidence: string[]; impact: string; action: string; severity: string };
type Rec = { priority: string; title: string; why: string; outcomes: string[] };

function generateInsights(data: ReportData) {
  const insights: Insight[] = [];
  const opportunities: Insight[] = [];
  const alerts: Insight[] = [];
  const recommendations: Rec[] = [];

  const er = data.kpi.engagementRate.value;
  const reach = data.kpi.reach.value;
  const views = data.kpi.views.value;
  const eng = data.kpi.engagements.value;
  const nf = data.viewerSplit.nonFollowers;

  // ---------- KEY INSIGHTS ----------
  insights.push({
    title: "Account-level reconciliation recovered 169 interactions the CSVs missed",
    evidence: [
      `${eng} account-level interactions across July`,
      "Published content alone accounts for only 225",
      "The gap is older content still earning engagement inside the month",
      `Engagement rate lands at ${er}% \u2014 not the 0.79% a CSV-only read would show`,
    ],
    impact: "Nearly half of July\u2019s engagement lives outside the month\u2019s published posts \u2014 the library is still working.",
    action: "Keep reporting from account-level exports; treat the back catalogue as an active asset, not archive.",
    severity: "info",
  });

  insights.push({
    title: "Enormous discovery, thin conversion \u2014 the defining pattern of July",
    evidence: [
      `${reach.toLocaleString()} reach, of which 96% was non-follower`,
      `${nf}% of ${views.toLocaleString()} views came from non-followers`,
      "Yet the account added only 27 followers all month",
      "Profile activity: 4 email clicks, zero Book Now, Call or Direction",
    ],
    impact: "The account reaches new people at scale but gives them almost no reason to act.",
    action: "Add explicit follow and booking prompts to Reel end-cards and Story CTAs; audit the profile action buttons.",
    severity: "warn",
  });

  insights.push({
    title: "Google sees NYCDS everywhere \u2014 it just ranks it deep",
    evidence: [
      "25,004 impressions across the NYC dental market in July",
      "The homepage absorbs 15,311 of them at position 41.1 and 0.90% CTR",
      "Where NYCDS holds page 1 it converts: nerve-pain article pos 5.6, 59 clicks",
      "Doctor bios hit 8.7\u201315.5% CTR \u2014 Eisdorfer 15.5%, Tamay 11.5%, Farahani 11.2%",
    ],
    impact: "The visibility is already there; rank depth is the only thing suppressing clicks.",
    action: "Replicate the nerve-pain template \u2014 condition and procedure articles that can hold page 1.",
    severity: "info",
  });

  insights.push({
    title: "July\u2019s search growth came entirely from bios and locations",
    evidence: [
      "Month-over-month, Locations grew +15 clicks, Dr. Maria Tamay +12, Dr. Sherman Farahani +9",
      "Every growing page is a bio or a location page \u2014 none is the homepage",
      "Growing queries are all brand variants: \u2018nyc dental smile team\u2019 +8, \u2018nyc smiles\u2019 +5, \u2018nyc dental smiles\u2019 +4",
      "No new pages earned first impressions in July",
    ],
    impact: "Growth is coming from people looking for specific doctors and offices, not from category demand.",
    action: "Build out the bio and location pages further \u2014 they are the only surfaces currently gaining ground.",
    severity: "success",
  });

  insights.push({
    title: "Mobile now out-clicks desktop in search \u2014 from 42% of the impressions",
    evidence: [
      "Mobile 185 clicks vs desktop 176 across July",
      "Mobile converts at 2.52% CTR against desktop\u2019s 1.01%",
      "Mobile also ranks better: position 17.4 vs 40.4",
      "Yet 69.4% of site sessions arrive on desktop",
    ],
    impact: "Search demand is decisively mobile-first while the site experience is still desktop-weighted.",
    action: "Review Core Web Vitals on mobile and keep booking CTAs above the fold.",
    severity: "info",
  });

  insights.push({
    title: "One page-1 ranking is producing no clicks at all",
    evidence: [
      "\u2018smile dental nyc\u2019 holds position 5.45 on 181 impressions",
      "It converted zero clicks across the entire month",
      "Comparable page-1 brand terms convert at 32\u201360%",
    ],
    impact: "A page-1 placement returning nothing usually means the SERP itself is absorbing the click.",
    action: "Inspect the live SERP for that query \u2014 check for a competing local pack or a near-identical business name.",
    severity: "warn",
  });

  const topAge = data.audience.age.reduce((a, b) => (a.pct > b.pct ? a : b));
  insights.push({
    title: "The core patient demographic remains strong",
    evidence: [
      `Largest cohort ${topAge.range} at ${topAge.pct}%`,
      `25\u201344 band = ${((data.audience.age[1]?.pct || 0) + (data.audience.age[2]?.pct || 0)).toFixed(1)}% of followers`,
      `Gender split ${data.audience.gender.male}/${data.audience.gender.female}`,
      "New York = 22.73% of follower base",
    ],
    impact: "The high-value local segment is healthy and well aligned.",
    action: "Keep geo-tagged content running.",
    severity: "success",
  });

  // ---------- OPPORTUNITIES ----------
  opportunities.push({
    title: "Reels are the engine \u2014 four pieces carried half the month\u2019s engagement",
    evidence: [
      "4 Reels drove 3,691 views and 198 interactions",
      "12 posts drove 3,204 views and 118 interactions",
      "The Jul 11 Oleksandr Reel: 9.44% ER, 16.6s average watch, 50.3% view rate",
      "Reels out-reach static posts on every measure that matters",
    ],
    impact: "Reel cadence is the single highest-leverage variable in the content mix.",
    action: "Move to a consistent 2\u20133 Reel per week cadence built on patient-story formats.",
    severity: "success",
  });

  opportunities.push({
    title: "Paid carried 46% of distribution \u2014 and it just ended",
    evidence: [
      "Ad views totalled 7,730 of the month\u2019s content views",
      "$312.50 final spend produced 596 landing-page views at $0.52",
      "$0.52 per result vs $0.77 on the comparable EEC campaign",
      "One ad did all the work \u2014 \u2018Let your smile sparkle\u2019 spent $6.97 all month",
    ],
    impact: "August loses nearly half its distribution unless a flight replaces it.",
    action: "Green-light an August flight on the winning creative, with a Lead/Booking event added first.",
    severity: "warn",
  });

  opportunities.push({
    title: "The LinkedIn bio link is outperforming three of the four office links",
    evidence: [
      "67 clicks in July \u2014 third-highest of any tracked link",
      "Ahead of 5th Ave (58), 58th Street (43) and 35th Street (39)",
      "LinkedIn itself drew 413 impressions and 31 clicks from just 2 posts",
      "Currently bucketed outside the named allowlist",
    ],
    impact: "A channel treated as incidental is quietly performing like a primary one.",
    action: "Consider promoting the LinkedIn link into the tracked allowlist and increasing post cadence.",
    severity: "success",
  });

  const totalSaves = data.posts.reduce((s: number, p: any) => s + (p.saves || 0), 0);
  opportunities.push({
    title: "Saves are the weakest signal in the mix",
    evidence: [
      "Only 5 saves across all July content",
      "Against 166 likes and 36 shares",
      "Explainer carousels are the natural save format and aren\u2019t prompting it",
    ],
    impact: "Saves carry the most ranking weight, which makes them the highest-value signal to grow.",
    action: "Add a \u201cSave this before you book\u201d prompt to every explainer carousel.",
    severity: "info",
  });

  opportunities.push({
    title: "The Modern Luxury press feature still has a long tail",
    evidence: [
      "794 IG views / 352 reach / 16 likes in July",
      "183 LinkedIn impressions and 22 clicks \u2014 the best LinkedIn post of the month",
      "Best-of-the-City 2026 award \u2014 evergreen credibility",
      "Not yet re-cut for Reels or pinned",
    ],
    impact: "Earned press has a long tail that a single post doesn\u2019t fully capture.",
    action: "Re-cut as a Reel, pin it to the profile, and add the award badge to the bio.",
    severity: "success",
  });

  opportunities.push({
    title: "Email opens are excellent, with clicks the next step",
    evidence: [
      "49.0% open rate across 4,754 sends in five campaigns",
      "5th Ave (60.9%) and 60th St. (57.2%) both cleared 57%",
      "56 clicks from 2,329 opens \u2014 2.40% click-to-open",
      "Unsubscribes held at 0.40%",
    ],
    impact: "A warm, attentive list is ready for a clearer booking ask.",
    action: "Add one booking CTA above the fold in every send.",
    severity: "info",
  });

  alerts.push({
    title: "Paid concluded Jul 31 \u2014 August is running fully organic",
    evidence: [
      "The July Whitening Promo ended at $312.50 / 596 results / $0.52 each",
      "Paid accounted for 7,730 views \u2014 46% of July content distribution",
      "No August campaign is live yet",
    ],
    impact: "Every week without a flight leaves the proven $0.52 acquisition channel idle.",
    action: "Decide the August offer and relaunch on the winning creative before mid-month.",
    severity: "warn",
  });

  // ---------- RECOMMENDATIONS ----------
  recommendations.push(
    { priority: "high", title: "Plan the August paid flight", why: "July closed at $0.52 per landing-page view \u2014 the most efficient paid channel across both practices \u2014 and paid carried 46% of distribution.", outcomes: ["Restores lost reach", "Proven cost per result"] },
    { priority: "high", title: "Add a Lead/Booking event before relaunch", why: "596 landing-page views were bought at $0.52, but nothing downstream is measured yet.", outcomes: ["True cost per booking", "Optimisable campaign"] },
    { priority: "high", title: "Fix the conversion gap on the profile", why: "28,427 reach and 17,350 views produced 4 email clicks and zero Book Now, Call or Direction clicks.", outcomes: ["More booked appointments", "Measurable profile intent"] },
    { priority: "high", title: "Sustain a 2\u20133 Reel weekly cadence", why: "Four Reels drove 52% of July engagement and every top-performing piece was a Reel.", outcomes: ["Broader discovery", "Higher engagement rate"] },
    { priority: "high", title: "Replicate the nerve-pain SEO template", why: "25,004 monthly impressions with a homepage ranked 41.1 \u2014 page-1 condition articles are how that converts.", outcomes: ["More search clicks", "Durable organic growth"] },
    { priority: "medium", title: "Investigate \u2018smile dental nyc\u2019", why: "Position 5.45 on 181 impressions with zero clicks suggests the SERP is absorbing the intent.", outcomes: ["Recovered page-1 traffic", "Competitive clarity"] },
    { priority: "medium", title: "Put a booking CTA in every email", why: "49% of the list opens; only 2.40% of those openers click.", outcomes: ["More booked appointments", "Higher click-to-open"] },
    { priority: "medium", title: "Expand doctor-bio SEO", why: "Bio pages convert at 8.7\u201315.5% CTR and are where July\u2019s growth happened \u2014 Tamay +12 clicks and Farahani +9 month-over-month.", outcomes: ["More qualified clicks", "Provider-led discovery"] },
    { priority: "medium", title: "Promote the LinkedIn link and cadence", why: "67 link clicks and 31 post clicks from only 2 posts \u2014 the channel is over-delivering on minimal input.", outcomes: ["New referral channel", "Professional audience reach"] },
    { priority: "low", title: "Improve mobile SEO", why: "Mobile out-clicks desktop in search while site traffic runs 69.4% desktop.", outcomes: ["Long-term search gains"] },
  );

  return { insights, opportunities, recommendations, alerts };
}

function AnimatedNumber({ value, suffix = "" }: { value: number | string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (typeof value !== "number") return;
    let start = 0;
    const duration = 1400;
    const step = (ts: number) => { if (!start) start = ts; const p = Math.min((ts - start) / duration, 1); setDisplay(Math.floor((1 - Math.pow(1 - p, 4)) * value)); if (p < 1) requestAnimationFrame(step); else setDisplay(value); };
    requestAnimationFrame(step);
  }, [value]);
  if (typeof value !== "number") return <span>{value}{suffix}</span>;
  return <span>{display.toLocaleString()}{suffix}</span>;
}

function Donut({ data, size = 130, stroke = 18, colors }: { data: { value: number }[]; size?: number; stroke?: number; colors: string[] }) {
  const r = (size - stroke) / 2, C = 2 * Math.PI * r;
  let off = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      {data.map((d, i) => { const dash = (d.value / 100) * C, gap = C - dash, o = off; off += dash; return <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={colors[i]} strokeWidth={stroke} strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-o} strokeLinecap="round" style={{ transition: "all 1.2s cubic-bezier(.4,0,.2,1)" }} />; })}
    </svg>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const d = FALLBACK_DATA;
  const [mediaUrls, setMediaUrls] = useState<Record<number, string>>(() => {
    const urls: Record<number, string> = {};
    FALLBACK_DATA.posts.forEach((p: any) => { if (p.igPostUrl) urls[p.id] = p.igPostUrl; });
    return urls;
  });
  const [editingMedia, setEditingMedia] = useState<number | null>(null);
  const [mediaInput, setMediaInput] = useState("");
  const engine = generateInsights(d);

  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  const handleMediaSave = (postId: number) => { if (mediaInput.trim()) setMediaUrls((prev) => ({ ...prev, [postId]: mediaInput.trim() })); setEditingMedia(null); setMediaInput(""); };
  const handleMediaRemove = (postId: number) => { setMediaUrls((prev) => { const n = { ...prev }; delete n[postId]; return n; }); };
  const isVideo = (url: string) => /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);
  const isIgEmbed = (url: string) => /instagram\.com\/(p|reel)\//i.test(url);

  const linkData = {
    period: "July 1 – 31, 2026",
    totalClicks: 552,
    topLinks: [
      { path: "Website", clicks: 293 },
      { path: "NYCDS 60th Street", clicks: 87 },
      { path: "NYCDS 5th Ave", clicks: 58 },
      { path: "NYCDS 58th Street", clicks: 43 },
      { path: "NYCDS 35th Street", clicks: 39 },
      { path: "Homepage", clicks: 32 },
    ],
    trafficSources: [
      { source: "Named NYCDS links", clicks: 552 },
      { source: "Social / wildcard (excluded)", clicks: 116 },
    ],
    topCountries: [
      { country: "United States", clicks: 514 },
      { country: "United Kingdom", clicks: 42 },
      { country: "The Netherlands", clicks: 34 },
      { country: "Brazil", clicks: 24 },
    ],
    topCities: [
      { city: "New York City", clicks: 65 },
      { city: "Chicago", clicks: 17 },
      { city: "Southold, NY", clicks: 15 },
    ],
    devices: [
      { os: "Chrome", clicks: 449 },
      { os: "Mobile Safari", clicks: 59 },
      { os: "Safari", clicks: 33 },
      { os: "Chrome Mobile", clicks: 23 },
      { os: "Edge", clicks: 18 },
      { os: "Chrome Mobile iOS", clicks: 12 },
    ],
  };

  const websiteData = {
    period: "July 1 – 31, 2026",
    sessions: 1093,
    topPages: [
      { page: "/", label: "Home", views: 867 },
      { page: "/ourdoctors", label: "Our Doctors", views: 143 },
      { page: "/locations", label: "Locations", views: 92 },
      { page: "/about", label: "About", views: 77 },
      { page: "/why-nycds", label: "Why NYCDS", views: 45 },
      { page: "/comprehensive-care", label: "Comprehensive Care", views: 31 },
      { page: "/cosmetic-dentistry", label: "Cosmetic Dentistry", views: 30 },
    ],
    trafficSources: [
      { source: "Direct", sessions: 615, pct: 56.2 },
      { source: "Google", sessions: 291, pct: 26.6 },
      { source: "Instagram (paid)", sessions: 108, pct: 9.9 },
      { source: "Facebook (paid)", sessions: 23, pct: 2.1 },
      { source: "Instagram (organic)", sessions: 16, pct: 1.5 },
      { source: "Bing / Yahoo", sessions: 13, pct: 1.2 },
      { source: "Other", sessions: 27, pct: 2.5 },
    ],
    devices: [
      { device: "Desktop", pct: 69.4 },
      { device: "Mobile", pct: 30.4 },
      { device: "Tablet", pct: 0.2 },
    ],
    dailyVisitors: [
      { date: "Jul 1", visitors: 37 },{ date: "Jul 2", visitors: 33 },{ date: "Jul 3", visitors: 11 },
      { date: "Jul 4", visitors: 20 },{ date: "Jul 5", visitors: 15 },{ date: "Jul 6", visitors: 28 },
      { date: "Jul 7", visitors: 30 },{ date: "Jul 8", visitors: 30 },{ date: "Jul 9", visitors: 55 },
      { date: "Jul 10", visitors: 27 },{ date: "Jul 11", visitors: 28 },{ date: "Jul 12", visitors: 29 },
      { date: "Jul 13", visitors: 39 },{ date: "Jul 14", visitors: 22 },{ date: "Jul 15", visitors: 46 },
      { date: "Jul 16", visitors: 21 },{ date: "Jul 17", visitors: 41 },{ date: "Jul 18", visitors: 58 },
      { date: "Jul 19", visitors: 36 },{ date: "Jul 20", visitors: 31 },{ date: "Jul 21", visitors: 33 },
      { date: "Jul 22", visitors: 27 },{ date: "Jul 23", visitors: 33 },{ date: "Jul 24", visitors: 29 },
      { date: "Jul 25", visitors: 24 },{ date: "Jul 26", visitors: 14 },{ date: "Jul 27", visitors: 34 },
      { date: "Jul 28", visitors: 27 },{ date: "Jul 29", visitors: 30 },{ date: "Jul 30", visitors: 18 },
      { date: "Jul 31", visitors: 18 },
    ],
    search: {
      totalClicks: 367, totalImpressions: 25004, avgCTR: 1.47, avgPosition: 33.7,
      note: "GSC Jul 1 \u2013 31, 2026 (nycdentalsmiles.com \u00b7 totals summed from daily chart)",
      devices: [
        { device: "Mobile", clicks: 185, impressions: 7350, ctr: 2.52, position: 17.4 },
        { device: "Desktop", clicks: 176, impressions: 17451, ctr: 1.01, position: 40.4 },
        { device: "Tablet", clicks: 6, impressions: 203, ctr: 2.96, position: 49.6 },
      ],
      topQueries: [
        { query: "nyc dental smiles", clicks: 43, ctr: 56.58 as number | null, position: 1.38 },
        { query: "nyc dental smile team", clicks: 12, ctr: 60.00 as number | null, position: 1.75 },
        { query: "nyc smiles", clicks: 8, ctr: 32.00 as number | null, position: 1.40 },
        { query: "dentist in new york", clicks: 4, ctr: 1.14 as number | null, position: 45.66 },
        { query: "dana kapparova", clicks: 3, ctr: 8.57 as number | null, position: 4.31 },
        { query: "michael chesner", clicks: 3, ctr: 9.09 as number | null, position: 2.58 },
        { query: "dr chesner dentist", clicks: 3, ctr: 30.00 as number | null, position: 1.50 },
        { query: "pain after onlay procedure", clicks: 2, ctr: 11.76 as number | null, position: 2.76 },
      ],
      topPages: [
        { page: "Homepage", clicks: 138, impressions: 15311, ctr: 0.90 as number | null },
        { page: "Nerve Pain After Onlay", clicks: 59, impressions: 3015, ctr: 1.96 as number | null },
        { page: "Our Doctors", clicks: 36, impressions: 2880, ctr: 1.25 as number | null },
        { page: "Dr. Michael Chesner", clicks: 27, impressions: 311, ctr: 8.68 as number | null },
        { page: "Locations", clicks: 22, impressions: 901, ctr: 2.44 as number | null },
        { page: "Dr. James Eisdorfer", clicks: 20, impressions: 129, ctr: 15.50 as number | null },
        { page: "Dr. Maria Tamay", clicks: 18, impressions: 156, ctr: 11.54 as number | null },
        { page: "Dr. Doris Giraldo", clicks: 15, impressions: 162, ctr: 9.26 as number | null },
      ],
    },
  };

  const socialData = {
    period: "July 1 \u2013 31, 2026",
    followers: 735,
    followerGrowth: 27,
    follows: 27,
    unfollows: 0,
    totalViews: 17350,
    totalReach: 28427,
    totalInteractions: 394,
    accountsEngaged: 219,
    profileClicks: { email: 4, bookNow: 0, call: 0, direction: 0 },
    viewSplit: { followers: 28, nonFollowers: 72 },
    reachSplit: { followers: 4, nonFollowers: 96 },
    engagementSplit: { followers: 28, nonFollowers: 72 },
    viewsByType: { reels: 41, posts: 35, stories: 24 },
    interactionsByType: { reels: 52, posts: 31, stories: 17 },
    totalLikes: 166,
    totalComments: 18,
    totalSaves: 5,
    totalShares: 36,
    storyViews: 1120, storyCompletion: "85.3%", storyCount: 17,
    reelAvgWatchTime: "12.1s", reelSkipRate: "41.2%",
    posts: [
      { id: 1, title: "When Patients No Longer Dread the Dentist (Reel)", type: "Reel", date: "Jul 10", views: 1185, reach: 706, likes: 36, comments: 8, saves: 1, shares: 10, er: 7.79, skipRate: 42.6, avgWatch: "10.3s", igUrl: "https://www.instagram.com/reel/Dan-hMNxehU/", isTop: false },
      { id: 2, title: "What Keeps Patients Coming Back \u2014 Oleksandr (Reel)", type: "Reel", date: "Jul 11", views: 1162, reach: 720, likes: 50, comments: 5, saves: 2, shares: 11, er: 9.44, skipRate: 50.3, avgWatch: "16.6s", igUrl: "https://www.instagram.com/reel/DaqGc-npEIe/", isTop: true },
      { id: 3, title: "Featured in Modern Luxury Manhattan (Carousel)", type: "Post", date: "Jul 16", views: 794, reach: 352, likes: 16, comments: 0, saves: 1, shares: 3, er: 5.68, skipRate: 0, avgWatch: "\u2014", igUrl: "https://www.instagram.com/p/Da3h0SUlly6/", isTop: false },
      { id: 4, title: "A City That Never Slows Down (Reel)", type: "Reel", date: "Jul 20", views: 569, reach: 406, likes: 14, comments: 0, saves: 0, shares: 6, er: 4.93, skipRate: 29.1, avgWatch: "9.9s", igUrl: "https://www.instagram.com/reel/DbBmSAZRD6K/", isTop: false },
      { id: 5, title: "Dental Care Should Feel Different (Reel)", type: "Reel", date: "Jul 2", views: 386, reach: 256, likes: 14, comments: 0, saves: 1, shares: 1, er: 6.25, skipRate: 27.0, avgWatch: "7.3s", igUrl: "https://www.instagram.com/reel/DaTPVCpRq5W/", isTop: false },
      { id: 6, title: "Ice Cream Truck Treat (Carousel)", type: "Post", date: "Jul 22", views: 326, reach: 138, likes: 2, comments: 0, saves: 0, shares: 2, er: 2.90, skipRate: 0, avgWatch: "\u2014", igUrl: "https://www.instagram.com/p/DbGtjHXluCf/", isTop: false },
      { id: 7, title: "Craving Chocolate This Summer? (Carousel)", type: "Post", date: "Jul 9", views: 297, reach: 84, likes: 5, comments: 5, saves: 0, shares: 0, er: 11.90, skipRate: 0, avgWatch: "\u2014", igUrl: "https://www.instagram.com/p/DalUNMBFqUc/", isTop: false },
      { id: 8, title: "Hydroxyapatite vs Fluoride (Carousel)", type: "Post", date: "Jul 29", views: 292, reach: 129, likes: 6, comments: 0, saves: 0, shares: 2, er: 6.20, skipRate: 0, avgWatch: "\u2014", igUrl: "https://www.instagram.com/p/DbY5c3plpTw/", isTop: false },
      { id: 9, title: "Introducing the Summer Sip Index (Carousel)", type: "Post", date: "Jul 17", views: 190, reach: 67, likes: 4, comments: 0, saves: 0, shares: 0, er: 5.97, skipRate: 0, avgWatch: "\u2014", igUrl: "https://www.instagram.com/p/Da6K1OVlu4x/", isTop: false },
      { id: 10, title: "POV: Packing for the Perfect Summer Day", type: "Post", date: "Jul 5", views: 191, reach: 71, likes: 10, comments: 0, saves: 0, shares: 0, er: 14.08, skipRate: 0, avgWatch: "\u2014", igUrl: "https://www.instagram.com/p/DaTQkwKxrg6/", isTop: false },
      { id: 11, title: "Recent Words from a Lenox Hill Patient", type: "Post", date: "Jul 18", views: 161, reach: 53, likes: 6, comments: 0, saves: 0, shares: 1, er: 13.21, skipRate: 0, avgWatch: "\u2014", igUrl: "https://www.instagram.com/p/Da8D_hXnE0r/", isTop: false },
      { id: 12, title: "Stars, Stripes, and Brighter Smiles", type: "Post", date: "Jul 3", views: 131, reach: 50, likes: 3, comments: 0, saves: 0, shares: 0, er: 6.00, skipRate: 0, avgWatch: "\u2014", igUrl: "https://www.instagram.com/p/DaTQM_7RW4A/", isTop: false },
    ],
  };
  const linkedInData = {
    period: "July 1 \u2013 31, 2026",
    followers: 127, posts: 2, impressions: 413, reactions: 22, comments: 0, clicks: 31, shares: 3,
    topPosts: [
      { title: "Featured in Modern Luxury Manhattan \u2014 Best of the City 2026", type: "Document", date: "Jul 16", impressions: 183, reactions: 6, clicks: 22, er: 16.94, url: "https://www.linkedin.com/feed/update/urn:li:ugcPost:7483620179592138753" },
      { title: "Riding the Hampton Jitney", type: "Text", date: "Jul 23", impressions: 93, reactions: 7, clicks: 8, er: 17.20, url: "https://www.linkedin.com/feed/update/urn:li:share:7486092628414062594" },
    ] as { title: string; type: string; date: string; impressions: number; reactions: number; clicks: number; er: number; url: string }[],
    note: "Two posts in July drew 413 account impressions, 22 reactions, 3 shares and 31 clicks \u2014 a 17.03 engagement rate on published content and 15 clicks per post. The Modern Luxury feature (183 impressions, 22 clicks) did the heavier lifting. Followers +2 to 127.",
  };
  const overviewKpis = [
    { label: "Followers", value: 735, delay: 0 },
    { label: "Views", value: 17350, delay: 80 },
    { label: "Reach", value: 28427, delay: 160 },
    { label: "Interactions", value: 394, delay: 240 },
    { label: "Non-Follower", value: "72%", delay: 320 },
  ];


  const adsData = {
    period: "July 1 – 31, 2026 (final)",
    campaign: "July Whitening Promo (concluded Jul 31)",
    totalSpend: 312.50,
    budget: 250,
    impressions: 35238,
    reach: 22037,
    activeAds: 2,
    results: 596,
    costPerResult: 0.52,
    pctOfViews: 0,
    pctOfInteractions: 0,
    ads: [
      { name: "Stars Stripes & Brighter Smiles (concluded)", spend: 305.53, impressions: 34452, reach: 21318, quality: "Quality Average · Engagement Above average · Conversion rate Below average (bottom 35%) — 586 landing-page views @ $0.52 · did virtually all the work" },
      { name: "Let your smile sparkle this summer (concluded)", spend: 6.97, impressions: 786, reach: 719, quality: "Quality Average · Engagement Average · Conversion rate Below average (bottom 35%) — 10 landing-page views @ $0.70 · barely delivered all month" },
    ],
  };

  const emailData = {
    period: "July 1 \u2013 31, 2026",
    campaignCount: 5, sends: 4754, opens: 2329, openRate: 49.0,
    clicks: 56, clickRate: 1.18, ctor: 2.40,
    unsubs: 19, unsubRate: 0.40,
    campaigns: [
      { name: "July Whitening Promo \u00b7 60th St.", date: "Jul 6", sends: 1990, opens: 1097, openRate: 57.2, clicks: 31, clickRate: 1.6, mobile: 34.9 },
      { name: "July Whitening Promo \u00b7 58th St.", date: "Jul 6", sends: 965, opens: 420, openRate: 46.1, clicks: 7, clickRate: 0.8, mobile: 16.0 },
      { name: "NYC Smile Pass Announcement", date: "Jul 15", sends: 857, opens: 332, openRate: 45.5, clicks: 7, clickRate: 1.0, mobile: 36.8 },
      { name: "July Whitening Promo \u00b7 5th Ave.", date: "Jul 6", sends: 784, opens: 417, openRate: 60.9, clicks: 8, clickRate: 1.2, mobile: 34.6 },
      { name: "July Whitening Promo \u00b7 35th St.", date: "Jul 6", sends: 158, opens: 63, openRate: 42.0, clicks: 3, clickRate: 2.0, mobile: 14.3 },
    ],
  };
  const emailLifetime = {
    campaigns: 23, sends: 24494, opens: 9693, openRate: 39.6,
    clicks: 236, clickRate: 0.96, ctor: 2.43, unsubs: 97, unsubRate: 0.40,
    bestOpens: [
      { name: "Dr. Eisdorfer's Retirement Letter", rate: 73.7 },
      { name: "Dr. Giraldo V3", rate: 72.6 },
      { name: "July Whitening Promo · 5th Ave.", rate: 60.4 },
      { name: "World Oral Health Day", rate: 57.6 },
      { name: "July Whitening Promo · 60th St.", rate: 56.9 },
    ],
    unsubTrend: [
      { name: "July \u00b7 5 campaigns", rate: 0.40, sends: 4754 },
      { name: "Lifetime · 23 campaigns", rate: 0.40, sends: 24494 },
    ],
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "◉" },
    { id: "content", label: "Content", icon: "◫" },
    { id: "links", label: "Links", icon: "⊞" },
    { id: "website", label: "Website", icon: "◈" },
    { id: "social", label: "Social", icon: "◍" },
    { id: "ads", label: "Ads", icon: "◇" },
    { id: "email", label: "Email", icon: "✉" },
    { id: "audience", label: "Audience", icon: "◎" },
    { id: "insights", label: "Insights", icon: "✦" },
  ];

  const sev: Record<string, { bg: string; border: string; dot: string }> = {
    success: { bg: "rgba(143,161,166,0.12)", border: "rgba(143,161,166,0.35)", dot: "#8FA1A6" },
    warning: { bg: "rgba(111,80,96,0.10)", border: "rgba(111,80,96,0.30)", dot: "#6F5060" },
    danger: { bg: "rgba(190,90,90,0.10)", border: "rgba(190,90,90,0.30)", dot: "#BE5A5A" },
    info: { bg: "rgba(166,150,141,0.12)", border: "rgba(166,150,141,0.35)", dot: "#A6968D" },
  };

  const sevMark: Record<string, string> = { success: "\u25B2", warning: "\u25BC", danger: "\u25CF", info: "\u25C6" };
  const sevColor: Record<string, string> = { success: "#8FA1A6", warning: "#6F5060", danger: "#BE5A5A", info: "#A6968D" };

  function InsightCard({ title, body, evidence, impact, action, severity }: { title: string; body?: string; evidence?: string[]; impact?: string; action?: string; severity: string }) {
    const sv = severity || "info";
    if (!evidence) {
      const s2 = sev[sv] || sev.info;
      return (<div style={{ background: s2.bg, border: `1px solid ${s2.border}`, borderRadius: 14, padding: "18px 22px", marginBottom: 12 }}><div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}><div style={{ width: 8, height: 8, borderRadius: 99, background: s2.dot, flexShrink: 0 }} /><span style={{ fontWeight: 700, fontSize: 13, color: "#6F5060" }}>{title}</span></div><div style={{ fontSize: 13, lineHeight: 1.7, color: "#5C4E54" }}>{body}</div></div>);
    }
    return (
      <div className={`ins sev-${sv}`}>
        <div className="ins-title"><span className="ins-mark" style={{ color: sevColor[sv] }}>{sevMark[sv]}</span><span>{title}</span></div>
        <div className="ins-label">Evidence</div>
        <ul className="ins-ev">{evidence.map((e, i) => <li key={i}>{e}</li>)}</ul>
        {impact && <><div className="ins-label">Business Impact</div><div className="ins-impact">{impact}</div></>}
        {action && <><div className="ins-label">Recommended Action</div><div className="ins-action">{action}</div></>}
      </div>
    );
  }

  function ExecCard({ eyebrow, tone, metrics, hero, noteLabel, notes }: { eyebrow: string; tone: string; metrics?: { val: string; label: string; delta?: string; dir?: string }[]; hero?: { label: string; title: string; stats: { val: string; label: string }[] }; noteLabel: string; notes: { text: string; tone?: string }[] }) {
    return (
      <div className={`exec-card tone-${tone}`}>
        <div className="exec-eyebrow">{eyebrow}</div>
        {metrics && (<div className="exec-metrics">{metrics.map((m, i) => (
          <div key={i} className="exec-metric">
            <div className="exec-metric-val">{m.val}</div>
            <div className="exec-metric-label">{m.label}</div>
            {m.delta && <div className={`exec-metric-delta ${m.dir || "flat"}`}>{m.dir === "up" ? "\u25B2" : m.dir === "down" ? "\u25BC" : "\u2014"} {m.delta}</div>}
          </div>))}
        </div>)}
        {hero && (<div className="exec-hero">
          <div className="exec-hero-label">{hero.label}</div>
          <div className="exec-hero-title">{hero.title}</div>
          <div className="exec-hero-stats">{hero.stats.map((h, i) => <div key={i} className="exec-hero-stat">{h.val} <span>{h.label}</span></div>)}</div>
        </div>)}
        <div className="exec-note-label">{noteLabel}</div>
        <ul className="exec-list">{notes.map((n, i) => <li key={i} className={n.tone || ""}>{n.text}</li>)}</ul>
      </div>
    );
  }

  if (loading) {
    return (<div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#FAFAF8", fontFamily: "'Marcellus', serif" }}><div style={{ width: 40, height: 40, border: "3px solid #D9CCC1", borderTopColor: "#6F5060", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><div style={{ marginTop: 16, fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#9B9196" }}>Loading report...</div><style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>);
  }

  return (
    <div className={`root ${loaded ? "on" : ""}`}>
      <style>{`@media (min-width: 1024px) { .root { zoom: 1.25; } }`}</style>
      <div className="hdr"><div className="hdr-top"><div><div className="hdr-brand">Figment Creative · Social Intelligence</div><div className="hdr-title">{d.client.fullName}</div><div className="hdr-sub">Monthly Performance Report · {d.client.period}</div></div><div className="hdr-badge"><div className="hdr-pulse" />Monthly Report</div></div></div>
      <div className="tabs">{tabs.map((t) => (<button key={t.id} className={`tab ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}><span style={{ fontSize: 15 }}>{t.icon}</span> {t.label}</button>))}</div>

      <div className="grid">
        {tab === "overview" && (<>
          <div className="kpi-row">
            {[{ ...d.kpi.followers, delay: 0 }, { ...d.kpi.reach, delay: 80 }, { ...d.kpi.views, delay: 160 }, { ...d.kpi.engagementRate, delay: 240 }, { ...d.kpi.engagements, delay: 320 }, { ...d.kpi.watchTime, delay: 400 }].map((k, i) => (
              <div key={i} className="kpi" style={{ animationDelay: `${k.delay}ms` }}><div className="kpi-label">{k.label}</div><div className="kpi-val">{typeof k.value === "number" ? <AnimatedNumber value={k.value} suffix={"suffix" in k ? (k as any).suffix : ""} /> : <span>{k.value}</span>}</div>{"change" in k && k.change != null && (<div className="kpi-delta"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L12 8H2L7 2Z" fill="#8FA1A6" /></svg>+{k.change}</div>)}</div>
            ))}
          </div>
          <div className="exec"><div className="card-hd">Executive Summary</div>
            <div className="exec-grid">
              <ExecCard
                eyebrow="Discovery"
                tone="pos"
                metrics={[
                  { val: d.kpi.reach.value.toLocaleString(), label: "Reach" },
                  { val: d.kpi.views.value.toLocaleString(), label: "Views" },
                  { val: `${d.viewerSplit.nonFollowers}%`, label: "Non-Follower" },
                ]}
                noteLabel="Takeaway"
                notes={[
                  { text: "17,350 account views across 29 pieces \u2014 the strongest reach month on record.", tone: "pos" },
                  { text: "Paid carried 7,730 views (46% of content views) before concluding Jul 31.", tone: "" },
                  { text: "Reach was 96% non-follower \u2014 discovery is almost entirely new audience.", tone: "pos" },
                ]}
              />
              <ExecCard
                eyebrow="Engagement"
                tone="warn"
                metrics={[
                  { val: `${d.kpi.engagementRate.value}%`, label: "Eng. Rate" },
                  { val: d.kpi.engagements.value.toLocaleString(), label: "Interactions" },
                  { val: `+${d.kpi.followers.change}`, label: "Followers" },
                ]}
                noteLabel="Why"
                notes={[
                  { text: "394 account-level interactions \u2014 169 more than published content alone earned.", tone: "pos" },
                  { text: "Reels drove 52% of interactions from 4 pieces; 12 posts drove 31%.", tone: "pos" },
                  { text: "+27 followers on 28,427 reach \u2014 huge top-of-funnel, thin conversion.", tone: "neg" },
                ]}
              />
              <ExecCard
                eyebrow="Content"
                tone="neutral"
                hero={{
                  label: "Top Performer",
                  title: "What Keeps Patients Coming Back \u2014 Oleksandr (Reel)",
                  stats: [{ val: "1,162", label: "views" }, { val: "9.44%", label: "ER" }, { val: "16.6s", label: "watch" }],
                }}
                noteLabel="Key Notes"
                notes={[
                  { text: `Reels led the mix at ${d.contentMix.reels}%; Posts ${d.contentMix.posts}%, Stories ${d.contentMix.stories}%.`, tone: "pos" },
                  { text: "17 Stories delivered 1,120 impressions and 65 interactions.", tone: "" },
                  { text: "Search took 367 clicks on 25,004 impressions at 1.47% CTR.", tone: "pos" },
                  { text: "552 clicks on the named allowlist \u2014 all four offices active.", tone: "pos" },
                ]}
              />
            </div>
          </div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Content Mix</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.contentMix.reels }, { value: d.contentMix.posts }, { value: d.contentMix.stories }]} colors={["#6F5060", "#8FA1A6", "#A6968D"]} size={120} stroke={18} /><div style={{ flex: 1 }}>{[{ label: "Reels", value: d.contentMix.reels, color: "#6F5060" }, { label: "Posts", value: d.contentMix.posts, color: "#8FA1A6" }, { label: "Stories", value: d.contentMix.stories, color: "#A6968D" }].map((item) => (<div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}><div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} /><span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span><span className="display-num">{item.value}%</span></div>))}</div></div></div>
            <div className="card"><div className="card-hd">Viewer Composition</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.viewerSplit.nonFollowers }, { value: d.viewerSplit.followers }]} colors={["#6F5060", "#D9C5C1"]} size={120} stroke={18} /><div style={{ flex: 1 }}>{[{ label: "Non-Followers", value: d.viewerSplit.nonFollowers, color: "#6F5060" }, { label: "Followers", value: d.viewerSplit.followers, color: "#D9C5C1" }].map((item) => (<div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}><div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} /><span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span><span className="display-num">{item.value}%</span></div>))}<div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(143,161,166,0.12)", borderRadius: 10, border: "1px solid rgba(143,161,166,0.25)" }}><span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Discovery is overwhelmingly non-follower-led — 72% of views and 96% of reach came from people who don’t follow the account. Organic Reels and search are doing that work now that paid has concluded. The gap between that reach and +27 net followers is the clearest growth opportunity in the report.</span></div></div></div></div>
          </div>
          {engine.alerts.length > 0 && <div>{engine.alerts.map((a, i) => <InsightCard key={i} {...a} />)}</div>}
        </>)}

        {tab === "content" && (<>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
            {d.posts.map((p: any) => { const url = mediaUrls[p.id]; const isEditing = editingMedia === p.id; const maxViews = Math.max(...d.posts.map((x: any) => x.views), 1); return (
              <div key={p.id} className={`postcard ${p.isTop ? "postcard-top" : ""}`}>
                <div className="postcard-header"><div className="postcard-type-badge">{p.type}</div>{p.isTop && <div className="postcard-top-badge">★ Top Post</div>}{(p as any).isCollab && <div className="postcard-top-badge" style={{background: "rgba(88,130,220,0.15)", color: "#5882DC"}}>⚡ Collab</div>}</div>
                <div className="postcard-title">{p.title}</div>
                <div className={`postcard-media ${url ? "has-media" : ""}`}>
                  {!url && !isEditing && (<div className="postcard-media-empty" onClick={() => { setEditingMedia(p.id); setMediaInput(""); }}><div className="postcard-empty-inner"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A6968D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="4"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span className="postcard-empty-label">Add Post Visual</span><span className="postcard-empty-hint">Image, video, or Instagram link</span></div></div>)}
                  {isEditing && (<div className="postcard-media-input"><input className="media-input" type="text" placeholder="Paste image, video, or Instagram URL..." value={mediaInput} onChange={(e) => setMediaInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleMediaSave(p.id); if (e.key === "Escape") { setEditingMedia(null); setMediaInput(""); } }} autoFocus /><div style={{ display: "flex", gap: 6 }}><button className="media-btn secondary" onClick={() => { setEditingMedia(null); setMediaInput(""); }}>Cancel</button><button className="media-btn primary" onClick={() => handleMediaSave(p.id)}>Save</button></div></div>)}
                  {url && !isEditing && (<div className="postcard-media-filled">{isIgEmbed(url) ? (<div className="postcard-ig-crop"><iframe src={url.replace(/\/?(\?.*)?$/, "/embed")} title={p.title} scrolling="no" allowFullScreen /></div>) : isVideo(url) ? (<video controls playsInline preload="metadata"><source src={url} /></video>) : (<img src={url} alt={p.title} />)}<div className="postcard-media-actions"><button onClick={() => { setEditingMedia(p.id); setMediaInput(url); }}>✎</button><button onClick={() => handleMediaRemove(p.id)}>✕</button></div></div>)}
                </div>
                <div className="postcard-primary"><div className="postcard-hero-metric"><span className="postcard-hero-val">{p.views?.toLocaleString()}</span><span className="postcard-hero-label">Views</span></div><div className="postcard-hero-divider" /><div className="postcard-hero-metric"><span className="postcard-hero-val">{p.reach?.toLocaleString()}</span><span className="postcard-hero-label">Reach</span></div></div>
                <div className="postcard-perf-bar"><div className="postcard-perf-fill" style={{ width: `${(p.views / maxViews) * 100}%` }} /></div>
                <div className="postcard-secondary">{[{ icon: "♡", val: p.likes, label: "Likes" }, { icon: "↗", val: p.shares, label: "Shares" }, { icon: "💬", val: p.comments, label: "Comments" }, { icon: "⊕", val: p.saves, label: "Saves" }].map((m) => (<div key={m.label} className={`postcard-sec-item ${m.val === 0 ? "zero" : ""}`}><span className="postcard-sec-val">{m.val}</span><span className="postcard-sec-label">{m.label}</span></div>))}</div>
              </div>); })}
          </div>
          <div style={{ margin: "2px 0 16px", padding: "11px 16px", background: "rgba(143,161,166,0.10)", borderRadius: 10, border: "1px solid rgba(143,161,166,0.30)" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ A 29-piece month led by Reels. The Jul 11 &ldquo;What Keeps Patients Coming Back&rdquo; Reel was the standout at 1,162 views on 720 reach with a 16.6s avg watch (9.44% ER, 50.3% three-second view rate), with the Jul 10 &ldquo;No Longer Dread the Dentist&rdquo; Reel close behind at 1,185 views. The Modern Luxury feature led static content at 794 views. 17 Stories carried 1,120 impressions and 65 interactions. Account reach reached ~28,427 (Metricool 917/day &times; 31) on 17,350 views, with 394 account-level interactions (1.39% blended ER).</span>
          </div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Watch Time Analytics</div><div style={{ textAlign: "center", padding: "8px 0 22px" }}><div className="big-num">{d.kpi.watchTime.value}</div><div style={{ fontSize: 12, color: "#9B9196", marginTop: 2 }}>Avg Watch / Reel</div></div><div style={{ display: "flex", gap: 14 }}><div className="stat-box"><div className="big-num-sm plum">3,691</div><div className="stat-label">Reel Views (July)</div></div><div className="stat-box"><div className="big-num-sm steel">{d.kpi.views.value.toLocaleString()}</div><div className="stat-label">Total Views</div></div></div><div className="alert-box plum-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>✦ July’s Reels held viewers for a 12.1s average watch across 3,691 views. The Jul 11 Oleksandr Reel led at 16.6s on 1,162 views and 720 reach (9.44% ER) — the strongest retention of the month and roughly double the Jul 2 Reel’s 7.3s.</span></div></div>
            <div className="card"><div className="card-hd">Engagement Breakdown</div><div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{[{ label: "Likes", value: d.posts.reduce((s: number, p: any) => s + (p.likes||0), 0), max: 60, color: "#6F5060" }, { label: "Comments", value: d.posts.reduce((s: number, p: any) => s + (p.comments||0), 0), max: 60, color: "#8FA1A6" }, { label: "Shares", value: d.posts.reduce((s: number, p: any) => s + (p.shares||0), 0), max: 60, color: "#A6968D" }, { label: "Saves", value: d.posts.reduce((s: number, p: any) => s + (p.saves||0), 0), max: 60, color: "#BE5A5A" }].map((m) => (<div key={m.label} style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 72, fontSize: 13, fontWeight: 500 }}>{m.label}</div><div style={{ flex: 1, height: 10, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}><div style={{ width: `${(Math.max(m.value, 0.5) / m.max) * 100}%`, height: "100%", background: m.color, borderRadius: 99, transition: "width 1.2s ease" }} /></div><div className="display-num" style={{ width: 30, textAlign: "right" as const }}>{m.value}</div></div>))}</div><div className="alert-box danger-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#BE5A5A" }}>▲ Blended account engagement came in at 1.39% (394 account-level interactions ÷ 28,427 reach) across a 29-piece month. Per-content ER told the sharper story: Reels ran 4.93–9.44% while static posts ranged 2.90–14.08%, with the smallest-reach posts posting the highest rates. Saves remain the gap at just 5 for the month.</span></div></div>
          </div>
        </>)}

        {tab === "links" && (<>
          <div className="kpi-row">
            {[
              { label: "Total Clicks", value: linkData.totalClicks, delay: 0 },
            ].map((k, i) => (
              <div key={i} className="kpi" style={{ animationDelay: `${k.delay}ms` }}>
                <div className="kpi-label">{k.label}</div>
                <div className="kpi-val">{typeof k.value === "number" ? <AnimatedNumber value={k.value} /> : <span>{k.value}</span>}</div>
              </div>
            ))}
          </div>
          <div className="card"><div className="card-hd">Top Links · {linkData.period}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {linkData.topLinks.map((l, i) => {
                const maxClicks = Math.max(...linkData.topLinks.map(x => x.clicks));
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 99, background: "#6F5060", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ width: 140, fontSize: 13, fontWeight: 500, flexShrink: 0 }}>{l.path}</div>
                    <div style={{ flex: 1, height: 10, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${(l.clicks / maxClicks) * 100}%`, height: "100%", background: i === 0 ? "#6F5060" : i < 3 ? "#8FA1A6" : "#A6968D", borderRadius: 99, transition: "width 1.2s ease" }} />
                    </div>
                    <div className="display-num" style={{ width: 40, textAlign: "right" as const }}>{l.clicks}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Traffic Sources</div>
              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <Donut data={linkData.trafficSources.map(s => ({ value: Math.round((s.clicks / linkData.trafficSources.reduce((a, b) => a + b.clicks, 0)) * 100) }))} colors={["#6F5060", "#8FA1A6", "#A6968D", "#D9C5C1"]} size={120} stroke={18} />
                <div style={{ flex: 1 }}>
                  {linkData.trafficSources.map((s, i) => (
                    <div key={s.source} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: ["#6F5060", "#8FA1A6", "#A6968D", "#D9C5C1"][i] }} />
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{s.source}</span>
                      <span className="display-num">{s.clicks}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card"><div className="card-hd">Device Breakdown</div>
              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <Donut data={linkData.devices.map(d => ({ value: Math.round((d.clicks / linkData.devices.reduce((a, b) => a + b.clicks, 0)) * 100) }))} colors={["#6F5060", "#8FA1A6", "#A6968D", "#D9C5C1"]} size={120} stroke={18} />
                <div style={{ flex: 1 }}>
                  {linkData.devices.map((d, i) => (
                    <div key={d.os} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: ["#6F5060", "#8FA1A6", "#A6968D", "#D9C5C1"][i] }} />
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{d.os}</span>
                      <span className="display-num">{d.clicks}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Top Countries</div>
              {linkData.topCountries.map((c) => {
                const max = Math.max(...linkData.topCountries.map(x => x.clicks));
                return (
                  <div key={c.country} className="age-row">
                    <div className="age-label" style={{ width: 110 }}>{c.country}</div>
                    <div className="age-track"><div className="age-fill" style={{ width: `${(c.clicks / max) * 100}%`, background: c.clicks === max ? "#6F5060" : "#8FA1A6" }} /></div>
                    <div className="age-pct">{c.clicks}</div>
                  </div>
                );
              })}
            </div>
            <div className="card"><div className="card-hd">Top Cities</div>
              {linkData.topCities.map((c) => {
                const max = Math.max(...linkData.topCities.map(x => x.clicks));
                return (
                  <div key={c.city} className="age-row">
                    <div className="age-label" style={{ width: 110 }}>{c.city}</div>
                    <div className="age-track"><div className="age-fill" style={{ width: `${(c.clicks / max) * 100}%`, background: c.clicks === max ? "#6F5060" : "#8FA1A6" }} /></div>
                    <div className="age-pct">{c.clicks}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card">
            <InsightCard title={"Link Attribution · " + linkData.period} body={"552 clicks across the six allowlisted NYCDS links in July, and Website-led: Website (293) took more than half, with 60th Street (87), 5th Ave (58), 58th Street (43), 35th Street (39) and Homepage (32) behind it — all four offices active every week of the month. ✓ True calendar-month export. Excluded: 116 social and wildcard clicks, of which the LinkedIn link alone drew 67 — more than three of the four office links, and worth watching as a channel in its own right. ✓ Bot filtering applied — Short.io logged 905 raw clicks against 659 human, and the 235 clicks that landed on no named path account for nearly all of the difference, so the named-link totals above are effectively clean. Two single-day spikes (Jul 5 and Jul 31) were datacenter bursts and are excluded. New York City (65) leads the verified city panel; the US accounts for 514 of all clicks. ✓ DDS-PC merge applied — UES and Midtown links are stripped from NYCDS and carried in the EEC report."} severity="info" />
          </div>
        </>)}

        {tab === "website" && (<>
          <div className="kpi-row">
            {[
              { label: "Total Sessions", value: websiteData.sessions, delay: 0 },
              { label: "Page Views", value: websiteData.topPages.reduce((s, p) => s + p.views, 0), delay: 80 },
              { label: "Top Source", value: "Direct (51–56%)", delay: 160 },
            ].map((k, i) => (
              <div key={i} className="kpi" style={{ animationDelay: `${k.delay}ms` }}>
                <div className="kpi-label">{k.label}</div>
                <div className="kpi-val">{typeof k.value === "number" ? <AnimatedNumber value={k.value} /> : <span>{k.value}</span>}</div>
              </div>
            ))}
          </div>
          <div className="card"><div className="card-hd">Visitors Over Time · {websiteData.period}</div>
            <div style={{ position: "relative", height: 180 }}>
              <svg viewBox="0 0 700 160" style={{ width: "100%", height: "100%" }}>
                <defs><linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6F5060" stopOpacity="0.18" /><stop offset="100%" stopColor="#6F5060" stopOpacity="0" /></linearGradient></defs>
                {(() => {
                  const pts = websiteData.dailyVisitors;
                  const maxV = Math.max(...pts.map(p => p.visitors));
                  const coords = pts.map((p, i) => ({ x: 30 + (i / (pts.length - 1)) * 640, y: 145 - (p.visitors / maxV) * 130 }));
                  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
                  const area = `${line} L${coords[coords.length-1].x},150 L${coords[0].x},150 Z`;
                  return (<>
                    {[0, 0.25, 0.5, 0.75, 1].map(f => { const y = 145 - f * 130; return <line key={f} x1="30" x2="670" y1={y} y2={y} stroke="#D9CCC1" strokeWidth="0.5" strokeDasharray="4,4" />; })}
                    <path d={area} fill="url(#vg)" />
                    <path d={line} fill="none" stroke="#6F5060" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {coords.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r="3" fill="#6F5060" stroke="#FAFAF8" strokeWidth="1.5" />)}
                    {pts.map((p, i) => <text key={`l${i}`} x={coords[i].x} y="158" textAnchor="middle" fontSize="8" fill="#9B9196">{p.date.replace("Apr ", "4/").replace("Mar ", "3/")}</text>)}
                  </>);
                })()}
              </svg>
            </div>
          </div>
          <div className="card"><div className="card-hd">Top Pages</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {websiteData.topPages.map((p, i) => {
                const maxViews = websiteData.topPages[0].views;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 99, background: i === 0 ? "#6F5060" : i < 3 ? "#8FA1A6" : "#A6968D", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ width: 150, fontSize: 13, fontWeight: 500, flexShrink: 0 }}>{p.label}</div>
                    <div style={{ flex: 1, height: 10, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${(p.views / maxViews) * 100}%`, height: "100%", background: i === 0 ? "#6F5060" : i < 3 ? "#8FA1A6" : "#A6968D", borderRadius: 99, transition: "width 1.2s ease" }} />
                    </div>
                    <div className="display-num" style={{ width: 40, textAlign: "right" as const }}>{p.views}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Traffic Sources</div>
              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <Donut data={websiteData.trafficSources.map(s => ({ value: Math.round(s.pct) }))} colors={["#6F5060", "#8FA1A6", "#A6968D", "#D9C5C1", "#BEB0A7"]} size={120} stroke={18} />
                <div style={{ flex: 1 }}>
                  {websiteData.trafficSources.map((s, i) => (
                    <div key={s.source} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: ["#6F5060", "#8FA1A6", "#A6968D", "#D9C5C1", "#BEB0A7"][i] }} />
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{s.source}</span>
                      <span className="display-num">{s.sessions}</span>
                      <span style={{ fontSize: 11, color: "#9B9196", width: 44, textAlign: "right" as const }}>{s.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card"><div className="card-hd">Device Breakdown</div>
              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <Donut data={websiteData.devices.map(d => ({ value: Math.round(d.pct) }))} colors={["#6F5060", "#8FA1A6"]} size={120} stroke={18} />
                <div style={{ flex: 1 }}>
                  {websiteData.devices.map((dv, i) => (
                    <div key={dv.device} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: ["#6F5060", "#8FA1A6"][i] }} />
                      <span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{dv.device}</span>
                      <span className="display-num-lg">{dv.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(111,80,96,0.10)", borderRadius: 10, border: "1px solid rgba(111,80,96,0.25)" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>✦ Desktop-heavy site traffic (69.4%) — yet search demand is mobile-first</span>
              </div>
            </div>
          </div>
          <div className="card"><div className="card-hd">Google Search Performance · {websiteData.period}</div>
            <div className="kpi-row" style={{ marginBottom: 18 }}>
              {[
                { label: "Search Clicks", value: websiteData.search.totalClicks },
                { label: "Impressions", value: websiteData.search.totalImpressions.toLocaleString() },
                { label: "Avg CTR", value: `${websiteData.search.avgCTR}%` },
                { label: "Avg Position", value: websiteData.search.avgPosition.toFixed(0) },
              ].map((k, i) => (
                <div key={i} className="kpi" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="kpi-label">{k.label}</div>
                  <div className="kpi-val">{typeof k.value === "number" ? <AnimatedNumber value={k.value} /> : <span>{k.value}</span>}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Top Search Queries</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {websiteData.search.topQueries.map((q, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 12px", background: i === 0 ? "rgba(111,80,96,0.08)" : "rgba(143,161,166,0.06)", borderRadius: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 99, background: i === 0 ? "#6F5060" : "#8FA1A6", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{q.query}</div>
                    <div style={{ display: "flex", gap: 14, flexShrink: 0 }}>
                      <div style={{ textAlign: "center" as const }}><div className="display-num">{q.clicks}</div><div style={{ fontSize: 9, color: "#9B9196" }}>clicks</div></div>
                      <div style={{ textAlign: "center" as const }}><div className="display-num">{q.ctr != null ? `${q.ctr}%` : "—"}</div><div style={{ fontSize: 9, color: "#9B9196" }}>CTR</div></div>
                      <div style={{ textAlign: "center" as const }}><div className="display-num">#{q.position.toFixed(1)}</div><div style={{ fontSize: 9, color: "#9B9196" }}>pos</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card"><div className="card-hd">Top Pages in Search</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {websiteData.search.topPages.map((p, i) => {
                  const maxClicks = websiteData.search.topPages[0].clicks;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 120, fontSize: 13, fontWeight: 500, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{p.page}</div>
                      <div style={{ flex: 1, height: 10, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ width: `${(p.clicks / maxClicks) * 100}%`, height: "100%", background: i === 0 ? "#6F5060" : "#8FA1A6", borderRadius: 99, transition: "width 1.2s ease" }} />
                      </div>
                      <div style={{ display: "flex", gap: 14, flexShrink: 0 }}>
                        <div style={{ textAlign: "center" as const }}><div className="display-num">{p.clicks}</div><div style={{ fontSize: 9, color: "#9B9196" }}>clicks</div></div>
                        <div style={{ textAlign: "center" as const }}><div className="display-num">{p.ctr != null ? `${p.ctr}%` : "—"}</div><div style={{ fontSize: 9, color: "#9B9196" }}>CTR</div></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="card">
            <InsightCard title={"Website + Search · " + websiteData.period} body={"924 new visitors across July (~30/day) on 1,093 sessions, peaking Jul 18 at 58. Direct leads at 56.2% (615) with Google at 26.6% (291); paid social contributed 131 sessions (Instagram 108, Facebook 23) before the campaign closed Jul 31. The long tail is worth noting: nycsmilepass.com sent 9 sessions — the Smile Pass property is now feeding the main site — and ChatGPT sent 3. Desktop 69.4% / Mobile 30.4% / Tablet 0.2%. Home (867 views) dominates, with Our Doctors (143) and Locations (92) the clear secondary surfaces. Search (GSC, Jul 1–31): 367 clicks on 25,004 impressions at 1.47% CTR, blended position 33.7 — totals summed from the daily chart, since Google withheld 264 clicks and 11,802 impressions as anonymized low-volume queries, roughly 72% of the month's search traffic. The blended position is held down by the homepage, which absorbs 15,311 impressions at position 41.1 and converts at 0.90%. Where the site ranks page 1 it performs: the nerve-pain article took 59 clicks at position 5.6, and the doctor bios convert at 8.7–15.5% (Eisdorfer 15.5%, Tamay 11.5%, Farahani 11.2%). Mobile now out-clicks desktop outright — 185 vs 176 — from 42% of the impressions, at 2.52% CTR against desktop's 1.01%. Brand terms own position ~1.4 and convert at 32–60%; the volume terms ('dentist new york' 408 impressions, 'dentist nyc' 292) sit at position 45–54 with almost no clicks. One anomaly to investigate: 'smile dental nyc' holds position 5.45 on 181 impressions and took zero clicks. Google’s own July summary confirms the totals independently and adds the month-over-month picture: the only pages gaining clicks were Locations (+15), Dr. Maria Tamay (+12) and Dr. Sherman Farahani (+9), and the only growing queries were brand variants — ‘nyc dental smile team’ (+8), ‘nyc smiles’ (+5) and ‘nyc dental smiles’ (+4). No page earned first impressions in July. Growth is coming from people searching for specific doctors and offices, not from category demand."} severity="info" />
          </div>
        </>)}

        {tab === "social" && (<>
          <div className="kpi-row">
            {[
              { label: "Total Views", value: socialData.totalViews, delay: 0 },
              { label: "Accounts Reached", value: socialData.totalReach, delay: 80 },
              { label: "Interactions", value: socialData.totalInteractions, delay: 160 },
              { label: "Followers", value: socialData.followers, delay: 240 },
              { label: "Net Growth", value: `+${socialData.followerGrowth}`, delay: 320 },
            ].map((k, i) => (
              <div key={i} className="kpi" style={{ animationDelay: `${k.delay}ms` }}>
                <div className="kpi-label">{k.label}</div>
                <div className="kpi-val">{typeof k.value === "number" ? <AnimatedNumber value={k.value} /> : <span>{k.value}</span>}</div>
              </div>
            ))}
          </div>

          <div className="card"><div className="card-hd">Content Performance</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {socialData.posts.map((p, i) => {
                const maxV = socialData.posts[0].views;
                return (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 99, background: p.isTop ? "#6F5060" : i < 3 ? "#8FA1A6" : "#A6968D", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ minWidth: 0, flex: "0 0 200px" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{p.title}</div>
                      <div style={{ fontSize: 11, color: "#9B9196", marginTop: 2 }}>{p.type} · {p.date}{p.isTop ? " · ★ Top Post" : ""}{(p as any).isCollab ? " · ⚡ Collab" : ""}</div>
                    </div>
                    <div style={{ flex: 1, height: 10, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${(p.views / maxV) * 100}%`, height: "100%", background: p.isTop ? "#6F5060" : i < 3 ? "#8FA1A6" : "#A6968D", borderRadius: 99, transition: "width 1.2s ease" }} />
                    </div>
                    <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
                      <div style={{ textAlign: "center" as const }}><div className="display-num">{p.views.toLocaleString()}</div><div style={{ fontSize: 9, color: "#9B9196" }}>views</div></div>
                      <div style={{ textAlign: "center" as const }}><div className="display-num">{p.reach}</div><div style={{ fontSize: 9, color: "#9B9196" }}>reach</div></div>
                      <div style={{ textAlign: "center" as const }}><div className="display-num">{p.er}%</div><div style={{ fontSize: 9, color: "#9B9196" }}>ER</div></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card"><div className="card-hd">LinkedIn · {linkedInData.period}</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const, marginBottom: 14 }}>
              {[{ label: "Followers", value: linkedInData.followers }, { label: "Impressions", value: linkedInData.impressions }, { label: "Reactions", value: linkedInData.reactions }, { label: "Clicks", value: linkedInData.clicks }, { label: "Posts", value: linkedInData.posts }].map((m) => (
                <div key={m.label} style={{ flex: "1 1 90px", textAlign: "center" as const, padding: "12px 8px", background: "#F3EDEA", borderRadius: 10 }}>
                  <div className="display-num" style={{ fontSize: 20, color: "#6F5060" }}>{m.value.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: "#9B9196", marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {linkedInData.topPosts.map((p, i) => {
                const maxImp = Math.max(...linkedInData.topPosts.map((x) => x.impressions), 1);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: "0 0 210px", minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{p.title}</div>
                      <div style={{ fontSize: 11, color: "#9B9196", marginTop: 2 }}>{p.type} · {p.date}</div>
                    </div>
                    <div style={{ flex: 1, height: 10, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${(p.impressions / maxImp) * 100}%`, height: "100%", background: i === 0 ? "#6F5060" : "#8FA1A6", borderRadius: 99, transition: "width 1.2s ease" }} />
                    </div>
                    <div style={{ display: "flex", gap: 14, flexShrink: 0 }}>
                      <div style={{ textAlign: "center" as const }}><div className="display-num">{p.impressions}</div><div style={{ fontSize: 9, color: "#9B9196" }}>impr</div></div>
                      <div style={{ textAlign: "center" as const }}><div className="display-num">{p.reactions}</div><div style={{ fontSize: 9, color: "#9B9196" }}>react</div></div>
                      <div style={{ textAlign: "center" as const }}><div className="display-num">{p.clicks}</div><div style={{ fontSize: 9, color: "#9B9196" }}>clicks</div></div>
                      <div style={{ textAlign: "center" as const }}><div className="display-num">{p.er}%</div><div style={{ fontSize: 9, color: "#9B9196" }}>eng</div></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(143,161,166,0.12)", borderRadius: 10, border: "1px solid rgba(143,161,166,0.25)" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ {linkedInData.note}</span>
            </div>
          </div>

          <div className="cols2">
            <div className="card"><div className="card-hd">Views by Content Type</div>
              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <Donut data={[{ value: Math.round(socialData.viewsByType.posts) }, { value: Math.round(socialData.viewsByType.reels) }, { value: Math.round(socialData.viewsByType.stories) }]} colors={["#6F5060", "#8FA1A6", "#A6968D"]} size={120} stroke={18} />
                <div style={{ flex: 1 }}>
                  {[
                    { label: "Posts", value: socialData.viewsByType.posts, color: "#6F5060" },
                    { label: "Reels", value: socialData.viewsByType.reels, color: "#8FA1A6" },
                    { label: "Stories", value: socialData.viewsByType.stories, color: "#A6968D" },
                  ].map((item) => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span>
                      <span className="display-num">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card"><div className="card-hd">Interactions by Type</div>
              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <Donut data={[{ value: Math.round(socialData.interactionsByType.posts) }, { value: Math.round(socialData.interactionsByType.reels) }, { value: Math.round(socialData.interactionsByType.stories) }]} colors={["#6F5060", "#8FA1A6", "#A6968D"]} size={120} stroke={18} />
                <div style={{ flex: 1 }}>
                  {[
                    { label: "Posts", value: socialData.interactionsByType.posts, color: "#6F5060" },
                    { label: "Reels", value: socialData.interactionsByType.reels, color: "#8FA1A6" },
                    { label: "Stories", value: socialData.interactionsByType.stories, color: "#A6968D" },
                  ].map((item) => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span>
                      <span className="display-num">{item.value}%</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 10, padding: "10px 14px", background: "rgba(143,161,166,0.12)", borderRadius: 10, border: "1px solid rgba(143,161,166,0.25)" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Reels led organic content views at ~41%, with Posts at 35% and Stories 24%. On engagement the gap is wider: Reels carried 198 of the 381 organic interactions (52%) from just 4 pieces, against 118 from 12 posts and 65 from 17 Stories. Splits are from the native account-level content-type breakdown. Sustaining a 2–3 Reel/week cadence is the lever that broadens discovery.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="cols2">
            <div className="card"><div className="card-hd">Discovery Funnel</div>
              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <Donut data={[{ value: Math.round(socialData.viewSplit.nonFollowers) }, { value: Math.round(socialData.viewSplit.followers) }]} colors={["#6F5060", "#D9C5C1"]} size={120} stroke={18} />
                <div style={{ flex: 1 }}>
                  {[
                    { label: "Non-Followers (views)", value: socialData.viewSplit.nonFollowers, color: "#6F5060" },
                    { label: "Followers (views)", value: socialData.viewSplit.followers, color: "#D9C5C1" },
                  ].map((item) => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span>
                      <span className="display-num-lg">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card"><div className="card-hd">Reel Diagnostic</div>
              <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                <div className="stat-box" style={{ flex: 1, textAlign: "center" as const, padding: "14px", background: "rgba(111,80,96,0.08)", borderRadius: 12 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#6F5060" }}>{socialData.reelAvgWatchTime}</div>
                  <div style={{ fontSize: 11, color: "#9B9196", marginTop: 4 }}>Avg Watch Time</div>
                </div>
                <div className="stat-box" style={{ flex: 1, textAlign: "center" as const, padding: "14px", background: "rgba(190,90,90,0.08)", borderRadius: 12 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#BE5A5A" }}>{socialData.reelSkipRate}</div>
                  <div style={{ fontSize: 11, color: "#9B9196", marginTop: 4 }}>Skip Rate</div>
                </div>
              </div>
              <div style={{ padding: "10px 14px", background: "rgba(190,90,90,0.10)", borderRadius: 10, border: "1px solid rgba(190,90,90,0.25)" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ July&rsquo;s four Reels averaged 12.1s of watch time and a 41.2% three-second view rate. The Jul 11 Oleksandr Reel led on every quality measure — 16.6s average watch and a 50.3% view rate, roughly double the Jul 2 and Jul 20 Reels. Reels averaged 522 reach each against 267 for static posts — a ~2&times; distribution advantage, the reason cadence matters. Two to three testimonial Reels per week is the lever.</span>
              </div>
            </div>
          </div>

          <div className="cols2">
            <div className="card"><div className="card-hd">Engagement Breakdown</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Likes", value: socialData.totalLikes, max: 80, color: "#6F5060" },
                  { label: "Shares", value: socialData.totalShares, max: 80, color: "#8FA1A6" },
                  { label: "Saves", value: socialData.totalSaves, max: 80, color: "#A6968D" },
                  { label: "Comments", value: socialData.totalComments, max: 80, color: "#BE5A5A" },
                ].map((m) => (
                  <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 72, fontSize: 13, fontWeight: 500 }}>{m.label}</div>
                    <div style={{ flex: 1, height: 10, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${(Math.max(m.value, 0.5) / m.max) * 100}%`, height: "100%", background: m.color, borderRadius: 99, transition: "width 1.2s ease" }} />
                    </div>
                    <div className="display-num" style={{ width: 30, textAlign: "right" as const }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card"><div className="card-hd">Growth Efficiency</div>
              <div style={{ textAlign: "center" as const, padding: "12px 0 18px" }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: "#6F5060" }}>±0</div>
                <div style={{ fontSize: 12, color: "#9B9196", marginTop: 4 }}>Net Followers This Week</div>
              </div>
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(143,161,166,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#8FA1A6" }}>17,350</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>views</div>
                </div>
                <div style={{ flex: 0, display: "flex", alignItems: "center", fontSize: 16, color: "#D9CCC1" }}>→</div>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(143,161,166,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#8FA1A6" }}>28,427</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>reached</div>
                </div>
                <div style={{ flex: 0, display: "flex", alignItems: "center", fontSize: 16, color: "#D9CCC1" }}>→</div>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(111,80,96,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#6F5060" }}>±0</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>followers</div>
                </div>
              </div>
              <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(111,80,96,0.10)", borderRadius: 10, border: "1px solid rgba(111,80,96,0.25)" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>✦ Followers grew +27 to 735 across July — real growth, but thin against the scale of discovery: 96% of reach and 72% of views came from non-followers. The account converts attention into clicks more readily than follows: 552 named-link clicks against 394 content interactions. Durable signals remain the build: just 5 saves against 166 likes and 36 shares. Sustaining Reel cadence and adding explicit follow and booking prompts are the two levers.</span>
              </div>
            </div>
          </div>

          <div className="card">
            <InsightCard title={"Social Intelligence · " + socialData.period} body={"17,350 account views reaching ~28,427 (Metricool avg. reach/day of 917 × 31) with 394 account-level interactions across 29 pieces — a blended engagement rate of 1.39% (394 ÷ 28,427). The reconciliation matters this month: published content earned 225 interactions, but the account-level report shows 394. That 169-interaction gap is older content still earning engagement inside July, and it would have vanished from a CSV-only read. Reels remain the engine — 4 pieces drove 3,691 views and 198 interactions (52% of all engagement), against 3,204 views and 118 interactions from 12 posts. Paid contributed 7,730 views, 46% of content distribution, before concluding Jul 31 — August will look materially different. Top pieces: 'When Patients No Longer Dread the Dentist' (1,185 views, Jul 10), 'What Keeps Patients Coming Back' (1,162 views, 9.44% ER, 16.6s average watch — the month's best performer on every quality measure) and the Modern Luxury feature (794 views, Jul 16). 17 Stories delivered 1,120 impressions and 65 interactions. The structural story is discovery without conversion: 72% of views and 96% of reach came from non-followers, yet the account added only 27 followers. Profile activity reinforces it — 4 email clicks all month, and zero Book Now, Call or Direction clicks against 17,350 views."} severity="success" />
            <InsightCard
              title="Key Insight"
              evidence={[
                "Paid concluded Jul 31 after carrying 7,730 views \u2014 46% of content distribution",
                "Engagement rate 1.39%, with 394 account-level interactions across 29 pieces",
                "The Jul 11 Oleksandr Reel led: 1,162 views, 9.44% ER, 16.6s watch",
                "The hydroxyapatite carousel led engagement: 6.35% ER on 126 reach",
                "Followers +27 across July; 552 clicks on the named allowlist",
              ]}
              impact="The organic baseline is now visible and it is healthy \u2014 views held, links converted, engagement quality stayed up. Paid was amplifying reach, not carrying the account."
              action="Plan the August flight on the winning creative, and hold a 2\u20133 Reel weekly cadence so organic keeps compounding underneath it."
              severity="success" />
          </div>
        </>)}

        {tab === "ads" && (<>
          <div className="kpi-row">
            {[
              { label: "Total Spend", value: "$312.50", delay: 0 },
              { label: "Landing-Page Views", value: adsData.results, delay: 80 },
              { label: "Cost / Result", value: "$0.52", delay: 160 },
              { label: "Impressions", value: adsData.impressions, delay: 240 },
              { label: "Paid Reach", value: adsData.reach, delay: 320 },
            ].map((k, i) => (
              <div key={i} className="kpi" style={{ animationDelay: `${k.delay}ms` }}>
                <div className="kpi-label">{k.label}</div>
                <div className="kpi-val">{typeof k.value === "number" ? <AnimatedNumber value={k.value} /> : <span>{k.value}</span>}</div>
              </div>
            ))}
          </div>
          <div className="card"><div className="card-hd">Ad Performance · {adsData.campaign} · {adsData.period}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {adsData.ads.map((a, i) => {
                const maxImp = Math.max(...adsData.ads.map(x => x.impressions));
                return (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 99, background: i === 0 ? "#6F5060" : "#8FA1A6", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{a.name}</div>
                      <div className="display-num" style={{ fontSize: 15 }}>${a.spend.toFixed(2)}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, paddingLeft: 32 }}>
                      <div style={{ flex: 1, height: 10, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ width: `${(a.impressions / maxImp) * 100}%`, height: "100%", background: i === 0 ? "#6F5060" : "#8FA1A6", borderRadius: 99, transition: "width 1.2s ease" }} />
                      </div>
                      <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
                        <div style={{ textAlign: "center" as const }}><div className="display-num">{a.impressions.toLocaleString()}</div><div style={{ fontSize: 9, color: "#9B9196" }}>impr</div></div>
                        <div style={{ textAlign: "center" as const }}><div className="display-num">{a.reach.toLocaleString()}</div><div style={{ fontSize: 9, color: "#9B9196" }}>reach</div></div>
                      </div>
                    </div>
                    <div style={{ paddingLeft: 32, fontSize: 11, color: a.quality.indexOf("Below") === 0 ? "#BE5A5A" : "#9B9196" }}>Quality ranking: {a.quality}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 16, padding: "11px 16px", background: "rgba(143,161,166,0.10)", borderRadius: 10, border: "1px solid rgba(143,161,166,0.30)" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Final wrap: the July Whitening Promo concluded Jul 31 at $312.50 total spend, 35,238 impressions and 596 landing-page views at $0.52 each — the most efficient paid acquisition across both practices (EEC's comparable campaign ran $0.77). Delivery was lopsided by design of the auction, not the budget: &ldquo;Stars Stripes &amp; Brighter Smiles&rdquo; ($305.53, 586 results) did virtually all the work while &ldquo;Let your smile sparkle&rdquo; spent $6.97 all month. The lead ad held <em>Above average</em> engagement but bottom-35% conversion ranking — add a Lead/Booking event before the next flight. ⚠ Per-ad reach is not de-duplicated (Meta reports it per ad), so the 22,037 total overstates unique people — impressions are the additive metric.</span>
            </div>
          </div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Spend Allocation</div>
              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <Donut data={[{ value: 98 }, { value: 2 }]} colors={["#6F5060", "#8FA1A6"]} size={120} stroke={18} />
                <div style={{ flex: 1 }}>
                  {[{ label: "Stars Stripes & Brighter Smiles", value: 98, color: "#6F5060" }, { label: "Let your smile sparkle", value: 2, color: "#8FA1A6" }].map((item) => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{item.label}</span>
                      <span className="display-num">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card"><div className="card-hd">Paid Contribution · July 1 – 31</div>
              <div style={{ display: "flex", gap: 14 }}>
                <div className="stat-box" style={{ flex: 1, textAlign: "center" as const, padding: "16px", background: "rgba(111,80,96,0.08)", borderRadius: 12 }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: "#6F5060" }}>{adsData.pctOfViews}%</div>
                  <div style={{ fontSize: 11, color: "#9B9196", marginTop: 4 }}>of Views from ads</div>
                </div>
                <div className="stat-box" style={{ flex: 1, textAlign: "center" as const, padding: "16px", background: "rgba(143,161,166,0.10)", borderRadius: 12 }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: "#8FA1A6" }}>{adsData.pctOfInteractions}%</div>
                  <div style={{ fontSize: 11, color: "#9B9196", marginTop: 4 }}>of Interactions from ads</div>
                </div>
              </div>
              <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(143,161,166,0.12)", borderRadius: 10, border: "1px solid rgba(143,161,166,0.25)" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ The 0% figures are correct by design: the July ads ran as standalone landing-page units, not boosted posts, so they add nothing to the organic content views and interactions reported on the Social tab — same structure as EEC. Their contribution shows up on the website instead: paid sent 131 of the 1,093 sessions across July (Instagram 108, Facebook 23), ~12% of site traffic. ⚠ Attribution difference worth noting: Meta claims 596 landing-page views while GA4 attributes 131 paid sessions — a ~4.5&times; spread driven by Meta's 7-day-click/1-day-view window and by landing-page views not equalling sessions. Trust the GA4 figure for traffic; use Meta's only for relative ad comparison.</span>
              </div>
            </div>
          </div>
          <div className="card">
            <InsightCard
              title="The July flight closed at benchmark-setting efficiency"
              evidence={[
                "$312.50 final spend / 35,238 impressions / 596 landing-page views",
                "$0.52 per result \u2014 vs $0.77 on the comparable EEC campaign",
                "One ad carried the flight: Stars Stripes did 586 of 596 results",
                "Lead ad held Above-average engagement, bottom-35% conversion ranking",
                "No downstream booking event was tracked",
              ]}
              impact="The account now has a proven creative and a proven $0.52 acquisition cost \u2014 and no campaign live to use them."
              action="Add a Lead/Booking event, then relaunch in August on the winning creative; retire \u2018Let your smile sparkle\u2019."
              severity="info" />
          </div>
        </>)}

        {tab === "email" && (<>
          <div className="kpi-row">
            {[
              { label: "Sends", value: emailData.sends, delay: 0 },
              { label: "Open Rate", value: emailData.openRate + "%", delay: 80 },
              { label: "Click Rate", value: emailData.clickRate + "%", delay: 160 },
              { label: "Click-to-Open", value: emailData.ctor + "%", delay: 240 },
              { label: "Unsub Rate", value: emailData.unsubRate + "%", delay: 320 },
            ].map((k, i) => (
              <div key={i} className="kpi" style={{ animationDelay: `${k.delay}ms` }}>
                <div className="kpi-label">{k.label}</div>
                <div className="kpi-val">{typeof k.value === "number" ? <AnimatedNumber value={k.value} /> : <span>{k.value}</span>}</div>
              </div>
            ))}
          </div>

          <div className="card"><div className="card-hd">Campaign Performance · {emailData.period}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {emailData.campaigns.map((c, i) => (
                <div key={i} style={{ paddingBottom: 14, borderBottom: i < emailData.campaigns.length - 1 ? "1px solid rgba(111,80,96,0.10)" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8, gap: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#3A2D33" }}>{c.name}</span>
                    <span style={{ fontSize: 11, color: "#9B9196", flexShrink: 0 }}>{c.date} · {c.sends.toLocaleString()} sends</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}>
                    <div style={{ flex: 1, height: 10, background: "#D9CCC1", borderRadius: 99, overflow: "hidden", position: "relative" }}>
                      <div style={{ width: `${c.openRate}%`, height: "100%", background: "#6F5060", borderRadius: 99, transition: "width 1.2s ease" }} />
                    </div>
                    <span className="display-num" style={{ width: 52, textAlign: "right" as const, fontSize: 15 }}>{c.openRate}%</span>
                  </div>
                  <div style={{ display: "flex", gap: 18, flexWrap: "wrap" as const }}>
                    {[{ l: "opens", v: c.opens.toLocaleString() }, { l: "clicks", v: c.clicks }, { l: "click rate", v: c.clickRate + "%" }].map((m) => (
                      <div key={m.l}><span style={{ fontSize: 13, fontWeight: 700, color: "#6F5060" }}>{m.v}</span> <span style={{ fontSize: 11, color: "#9B9196" }}>{m.l}</span></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cols2">
            <div className="card"><div className="card-hd">Open → Click Funnel · {emailData.period}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 4 }}>
                {[
                  { label: "Sent", value: emailData.sends, max: emailData.sends, color: "#8FA1A6" },
                  { label: "Opened", value: emailData.opens, max: emailData.sends, color: "#6F5060" },
                  { label: "Clicked", value: emailData.clicks, max: emailData.sends, color: "#BE5A5A" },
                ].map((m) => (
                  <div key={m.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{m.label}</span>
                      <span className="display-num">{m.value.toLocaleString()}</span>
                    </div>
                    <div style={{ height: 10, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${Math.max((m.value / m.max) * 100, 0.6)}%`, height: "100%", background: m.color, borderRadius: 99, transition: "width 1.4s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="alert-box danger-bg">
                <span style={{ fontSize: 12, fontWeight: 600, color: "#BE5A5A" }}>✦ The opportunity sits at the click. A {emailData.openRate}% open rate is strong for dental — well above the ~25% industry norm — and {emailData.ctor}% of openers currently click. The audience is engaged and ready for a clearer booking ask.</span>
              </div>
            </div>

            <div className="card"><div className="card-hd">List Loyalty</div>
              <div style={{ textAlign: "center" as const, padding: "10px 0 18px" }}>
                <div className="big-num" style={{ color: "#8FA1A6" }}>{emailData.unsubRate}%</div>
                <div style={{ fontSize: 12, color: "#9B9196", marginTop: 2 }}>Unsubscribe Rate · {emailData.period}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {emailLifetime.unsubTrend.map((b) => (
                  <div key={b.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ flex: 1, fontSize: 12.5, color: "#5C4E54" }}>{b.name}</span>
                    <span style={{ fontSize: 11, color: "#9B9196" }}>{b.sends.toLocaleString()}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: b.rate >= 0.5 ? "#A6968D" : "#8FA1A6", width: 46, textAlign: "right" as const }}>{b.rate}%</span>
                  </div>
                ))}
              </div>
              <div className="alert-box plum-bg">
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>✦ The list is loyal. Unsubscribes ran 0.40% across July&rsquo;s 4,754 sends — 19 people — matching the lifetime rate exactly and sitting comfortably inside the ~0.5% healthy range even as send volume and frequency have grown through the summer promos.</span>
              </div>
            </div>
          </div>

          <div className="cols2">
            <div className="card"><div className="card-hd">Best Open Rates · All Campaigns</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 11, paddingTop: 2 }}>
                {emailLifetime.bestOpens.map((b) => (
                  <div key={b.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ flex: 1, fontSize: 13, color: "#5C4E54" }}>{b.name}</span>
                    <div style={{ width: 90, height: 8, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${b.rate}%`, height: "100%", background: "#6F5060", borderRadius: 99 }} />
                    </div>
                    <span className="display-num" style={{ width: 48, textAlign: "right" as const }}>{b.rate}%</span>
                  </div>
                ))}
              </div>
              <div className="alert-box plum-bg">
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>✦ The two best-performing emails ever sent were both about a <em>person</em> — Dr. Eisdorfer&rsquo;s retirement letter (73.7%) and Dr. Giraldo&rsquo;s introduction (72.6%). Same finding as the social side: doctor-led content outperforms brand-voice content.</span>
              </div>
            </div>

            <div className="card"><div className="card-hd">Lifetime Benchmark · 23 NYCDS Campaigns</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { l: "Total Sends", v: emailLifetime.sends.toLocaleString(), c: "#8FA1A6" },
                  { l: "Total Opens", v: emailLifetime.opens.toLocaleString(), c: "#6F5060" },
                  { l: "Avg Open Rate", v: emailLifetime.openRate + "%", c: "#6F5060" },
                  { l: "Avg Click Rate", v: emailLifetime.clickRate + "%", c: "#BE5A5A" },
                  { l: "Click-to-Open", v: emailLifetime.ctor + "%", c: "#BE5A5A" },
                  { l: "Unsubscribes", v: emailLifetime.unsubs, c: "#A6968D" },
                ].map((m) => (
                  <div key={m.l} style={{ textAlign: "center" as const, padding: "13px 8px", background: "#F3EDEA", borderRadius: 10 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: m.c, fontFamily: "'Marcellus', serif" }}>{m.v}</div>
                    <div className="stat-label">{m.l}</div>
                  </div>
                ))}
              </div>
              <div className="alert-box plum-bg">
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>✦ Open rates have climbed sharply through 2026 — the February newsletters ran 17&ndash;22%, the July&ndash;August promo sends 35&ndash;60%. Subject lines and send timing are working, and the Nov/Dec seasonal newsletters (60&ndash;63%) remain the benchmark to beat. ⚠ DDS-PC / EEC campaigns are stripped from this view per the locked client-separation rule.</span>
              </div>
            </div>
          </div>

          <div className="card"><div className="card-hd">Email Intelligence</div>
            <InsightCard
              title="Email opens are excellent, with clicks the next step"
              evidence={[
                `${emailData.openRate}% open rate over ${emailData.campaignCount} campaign${emailData.campaignCount > 1 ? "s" : ""} \u2014 well above the ~25% dental norm`,
                `${emailData.clicks} clicks from ${emailData.opens.toLocaleString()} opens (${emailData.ctor}% click-to-open)`,
                "Lifetime click rate 0.96% across 23 campaigns",
                "Best-ever opens were both doctor-led, at 73.7% and 72.6%",
              ]}
              impact="The list reads the email. It just never gets asked to book."
              action="Put one booking CTA above the fold in every send."
              severity="info" />
            <InsightCard
              title="The multi-location send structure is working"
              evidence={[
                "Four location-segmented sends went out Jul 6 \u2014 3,897 emails in one coordinated push",
                "60th St. (52.9%) and 5th Ave (52.1%) both cleared half the list opening",
                "58th St. held 44.4%; 35th St. trails at 35.4% on the smallest list",
                "Mobile opens run ~22\u201334% across locations \u2014 desktop-read, like the website",
              ]}
              impact="Location-level segmentation lets each office's list be measured and improved on its own."
              action="Test subject-line variants on the 35th St. list \u2014 the one segment below 40%."
              severity="info" />
          </div>
        </>)}

        {tab === "audience" && (<>
          <div className="cols2">
            <div className="card"><div className="card-hd">Gender Split</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.audience.gender.male }, { value: d.audience.gender.female }]} colors={["#6F5060", "#8FA1A6"]} size={130} stroke={20} /><div style={{ flex: 1 }}>{[{ label: "Male", value: d.audience.gender.male, color: "#6F5060" }, { label: "Female", value: d.audience.gender.female, color: "#8FA1A6" }].map((g) => (<div key={g.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}><div style={{ width: 12, height: 12, borderRadius: 4, background: g.color }} /><span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{g.label}</span><span className="display-num-lg">{g.value}%</span></div>))}</div></div></div>
            <div className="card"><div className="card-hd">Age Distribution</div>{d.audience.age.map((a) => (<div key={a.range} className="age-row"><div className="age-label">{a.range}</div><div className="age-track"><div className="age-fill" style={{ width: `${(a.pct / 36) * 100}%`, background: a.pct >= 28 ? "#6F5060" : a.pct >= 20 ? "#8FA1A6" : "#A6968D" }} /></div><div className="age-pct">{a.pct}%</div></div>))}</div>
          </div>
          <div className="card"><div className="card-hd">Audience Intelligence</div>
            <InsightCard title="Core Patient Demographic" body="About 60% of the audience falls in the 25–44 age range (30% aged 25–34, 30% aged 35–44) — the prime demographic for general, cosmetic and restorative dentistry. Gender is balanced at 51/49 male/female, and New York is the single largest follower market at 22.73% of the base — a tightly local, high-intent core. This is the highest lifetime-value segment for NYC Dental Smiles. The July follower base grew +27 to 735, and Sialkot (4.12%) is the only non-US city in the top five — worth monitoring, since it contributes reach but no local patient value." severity="success" />
            <InsightCard title="Geography Is the Edge" body="At 22.73% of the follower base, New York leads every other market by a wide margin. Local intent is the asset — geo-specific Story CTAs, location-tagged content, and office-specific booking links convert this audience better than broad reach plays. July bears that out: the named allowlist drew 552 clicks with all four office links active every week, and New York City (65) leads the verified city panel by a factor of four. The tension to manage is that reach is now 96% non-follower and heavily out-of-market — the volume is national, the value is local, and the geo-targeted surfaces are what bridge the two." severity="info" />
          </div>
        </>)}

        {tab === "insights" && (<>
          <div className="cols2">
            <div><div className="section-label">Key Insights</div>{engine.insights.map((ins, i) => <InsightCard key={i} {...ins} />)}</div>
            <div><div className="section-label">Growth Opportunities</div>{engine.opportunities.map((o, i) => <InsightCard key={i} {...o} />)}{engine.alerts.map((a, i) => <InsightCard key={`a${i}`} {...a} />)}</div>
          </div>
          <div className="card"><div className="card-hd">Strategic Recommendations</div>
            {["high", "medium", "low"].map((pri) => {
              const items = engine.recommendations.filter((r) => r.priority === pri);
              if (!items.length) return null;
              return (
                <div key={pri} className="rec-group">
                  <div className="rec-group-hd">
                    <span className={`rec-badge ${pri}`}>{pri} priority</span>
                    <span className="rec-group-count">{items.length} action{items.length > 1 ? "s" : ""}</span>
                  </div>
                  {items.map((r, i) => (
                    <div key={i} className="rec-item">
                      <div className="rec-title">{r.title}</div>
                      <div className="rec-why"><strong>Why</strong>{r.why}</div>
                      <div className="rec-outcomes">{r.outcomes.map((o, j) => <span key={j} className="rec-chip">{o}</span>)}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </>)}

        <div className="footer"><span>NYC Dental Smiles · Powered by Figment Creative</span></div>
      </div>
    </div>
  );
}
