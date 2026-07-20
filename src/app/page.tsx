"use client";
import { useState, useEffect } from "react";

const FALLBACK_DATA = {
  client: { name: "NYCDS", fullName: "NYC Dental Smiles", period: "July 13 – July 19, 2026" },
  kpi: {
    followers: { value: 732, change: 11, label: "Followers" },
    reach: { value: 7917, label: "Reach" },
    views: { value: 5538, label: "Total Views" },
    engagementRate: { value: 1.7, label: "Engagement Rate", suffix: "%" },
    engagements: { value: 133, label: "Engagements" },
    watchTime: { value: "—", label: "Watch Time" },
  },
  posts: [
    { id: 1, title: "Modern Luxury Manhattan — Best of the City 2026", type: "Post", views: 733, reach: 335, likes: 15, comments: 0, saves: 1, shares: 3, isTop: true, igPostUrl: "" },
    { id: 2, title: "The Summer Sip Index (Carousel)", type: "Post", views: 144, reach: 60, likes: 3, comments: 0, saves: 0, shares: 1, isTop: false, igPostUrl: "" },
    { id: 3, title: "Recent Words From a Lenox Hill Patient", type: "Post", views: 70, reach: 42, likes: 6, comments: 0, saves: 0, shares: 0, isTop: false, igPostUrl: "" },
  ] as any[],
  contentMix: { posts: 37, reels: 34, stories: 29 },
  audience: {
    gender: { male: 51, female: 49 },
    age: [
      { range: "18-24", pct: 5.4 }, { range: "25-34", pct: 29.8 }, { range: "35-44", pct: 29.8 },
      { range: "45-54", pct: 20.8 }, { range: "55-64", pct: 9.6 }, { range: "65+", pct: 4.4 },
    ],
  },
  viewerSplit: { followers: 31, nonFollowers: 69 },
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
    title: "Engagement fell because no Reels were published",
    evidence: [
      `Engagement rate ${er}% \u2014 down from 2.3%`,
      `${eng} interactions \u2014 down 18%`,
      "Reel interactions 66 \u2014 all carryover, none new",
      `Reach still grew 12% to ${reach.toLocaleString()}`,
    ],
    impact: "Distribution held. Conversion of that reach slowed.",
    action: "Restore 2\u20133 testimonial Reels per week.",
    severity: "warning",
  });

  insights.push({
    title: "Static posts led the content mix for the first time",
    evidence: [
      `Posts ${data.contentMix.posts}% of organic views vs Reels ${data.contentMix.reels}%`,
      "Reel share is entirely prior-week carryover",
      "Stories over-delivered \u2014 147 avg reach vs 60 monthly",
      "No watch-time data \u2014 nothing published",
    ],
    impact: "Owned formats can hold one week, not a quarter.",
    action: "Re-cut the press feature as a Reel.",
    severity: "info",
  });

  insights.push({
    title: "Search quality improved while volume fell",
    evidence: [
      "90 clicks at 1.43% CTR \u2014 up from 86 at 1.25%",
      "9% fewer impressions",
      "Nerve-pain page: 16 clicks at position 5.7",
      "Doctor pages converting \u2014 Chesner 9.72%, Eisdorfer 15.38%",
    ],
    impact: "The non-brand SEO template is compounding.",
    action: "Publish 5+ procedure-question articles on that template.",
    severity: "info",
  });

  insights.push({
    title: "Mobile outranks desktop 2.4\u00d7 on Google",
    evidence: [
      "Mobile position 17.7 vs desktop 42.2 (30d)",
      "Mobile out-clicks desktop 184 vs 170",
      "Mobile CTR 2.51% vs desktop 0.58%",
      "Yet 72.8% of site sessions are desktop",
    ],
    impact: "Search demand is mobile. The site is not built for it.",
    action: "Audit Core Web Vitals; keep booking CTAs above the fold.",
    severity: "info",
  });

  const topAge = data.audience.age.reduce((a, b) => (a.pct > b.pct ? a : b));
  insights.push({
    title: "Core patient demographic holds",
    evidence: [
      `Largest cohort ${topAge.range} at ${topAge.pct}%`,
      `25\u201344 band = ${((data.audience.age[1]?.pct || 0) + (data.audience.age[2]?.pct || 0)).toFixed(1)}% of followers`,
      `Gender split ${data.audience.gender.male}/${data.audience.gender.female}`,
      "New York = 22.9% of follower base",
    ],
    impact: "The high-value local segment is intact.",
    action: "Keep geo-tagged, office-specific content running.",
    severity: "success",
  });

  // ---------- OPPORTUNITIES ----------
  opportunities.push({
    title: "The press feature was the week\u2019s biggest asset \u2014 and it was used once",
    evidence: [
      "733 views / 335 reach / 15 likes on Instagram",
      "Best LinkedIn post of the window \u2014 78 impressions, 6 link clicks",
      "45 views on Facebook",
      "Published as a single static post, never repurposed",
    ],
    impact: "Earned press has a tail one post cannot capture.",
    action: "Re-cut as a Reel, pin to profile, add the award badge to bio.",
    severity: "success",
  });

  opportunities.push({
    title: "Link clicks collapsed 61%",
    evidence: [
      "33 human clicks vs 85 the prior week",
      "No Reel end-frames to carry a CTA",
      "Only 4 Stories carried booking links",
      "Those Stories averaged 147 accounts each",
    ],
    impact: "The audience showed up. The booking ask did not.",
    action: "Put location links in Stories every posting day.",
    severity: "danger",
  });

  const totalSaves = data.posts.reduce((s: number, p: any) => s + (p.saves || 0), 0);
  opportunities.push({
    title: "Saves remain the weakest signal",
    evidence: [
      `${totalSaves} save across all owned content`,
      "4 shares, 0 comments",
      "Summer Sip Index \u2014 the one save-worthy piece \u2014 drew just 144 views",
    ],
    impact: "Meta weights saves highest. The account generates almost none.",
    action: "Add a \u201cSave this before you book\u201d CTA to explainer carousels.",
    severity: "warning",
  });

  opportunities.push({
    title: "Follower conversion hit its best weekly rate on file",
    evidence: [
      `Net +${data.kpi.followers.change} \u2014 1.57/day vs a 1.03/day monthly average`,
      `Follower share of views rose to ${data.viewerSplit.followers}% from 28%`,
      `${nf}% of views still come from non-followers`,
    ],
    impact: "Press converted attention. Publishing volume caps the ceiling.",
    action: "Restore Reel cadence to widen the top of the funnel.",
    severity: "success",
  });

  opportunities.push({
    title: "Paid buys cheap clicks that do not convert",
    evidence: [
      "$203.25 spend produced 387 landing-page views at $0.53",
      "Spend fell 46% while results rose \u2014 efficiency improved",
      "Conversion rate ranks Below average (bottom 35%) on both ads",
      "\u2018Let your smile sparkle\u2019 spent $5.78 in a month \u2014 effectively dormant",
    ],
    impact: "The buy is efficient. The landing page wastes it.",
    action: "Add a Lead/Booking event and fix the whitening page before raising budget.",
    severity: "warning",
  });

  // ---------- RECOMMENDATIONS ----------
  recommendations.push(
    { priority: "high", title: "Restore Reel publishing", why: "Engagement dropped immediately after Reel production stopped.", outcomes: ["Higher engagement rate", "Renewed reach", "Follower growth"] },
    { priority: "high", title: "Rebuild link-in-bio distribution", why: "Clicks fell 61% with no end-frames and only four Stories carrying links.", outcomes: ["Recovered booking clicks", "Location-level attribution"] },
    { priority: "high", title: "Merchandise the Modern Luxury award", why: "Best-performing content of the week, published once and left there.", outcomes: ["Additional organic reach", "Cross-platform lift"] },
    { priority: "high", title: "Fix the whitening landing page", why: "Paid delivers 387 landing-page views at $0.53, but conversion rate ranks bottom 35%.", outcomes: ["Better return on existing spend", "Measurable bookings"] },
    { priority: "medium", title: "Distribute the Summer Sip Index", why: "The only save-worthy format published, and it was under-distributed.", outcomes: ["Higher saves", "Stronger ranking signal"] },
    { priority: "medium", title: "Replicate the nerve-pain SEO template", why: "It outranks every brand page and the query cluster is compounding.", outcomes: ["Non-brand search growth"] },
    { priority: "medium", title: "Fund or cut \u2018Let your smile sparkle\u2019", why: "It has spent $5.78 across a full month and is effectively dormant.", outcomes: ["Cleaner account structure", "Budget redeployed"] },
    { priority: "low", title: "Improve mobile SEO", why: "Strong opportunity, but not the constraint on growth today.", outcomes: ["Long-term traffic improvement"] },
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
  const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d");
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

  const linkData7d = {
    period: "July 13 – July 19, 2026",
    totalClicks: 28,
    topLinks: [
      { path: "Website", clicks: 9 },
      { path: "NYCDS 60th Street", clicks: 6 },
      { path: "NYCDS 5th Ave", clicks: 4 },
      { path: "NYCDS 58th Street", clicks: 4 },
      { path: "NYCDS 35th Street", clicks: 3 },
      { path: "Homepage", clicks: 2 },
    ],
    trafficSources: [
      { source: "Named NYCDS links (human)", clicks: 28 },
      { source: "Wildcard / social / excluded", clicks: 5 },
    ],
    topCountries: [
      { country: "United States", clicks: 281 },
      { country: "United Kingdom", clicks: 45 },
      { country: "Netherlands", clicks: 33 },
      { country: "Other", clicks: 43 },
    ],
    topCities: [
      { city: "New York City", clicks: 50 },
      { city: "Bristol", clicks: 31 },
      { city: "Columbus", clicks: 16 },
      { city: "Southold", clicks: 16 },
    ],
    devices: [
      { os: "Windows", clicks: 191 },
      { os: "Mac OS X", clicks: 91 },
      { os: "iOS", clicks: 68 },
      { os: "Android", clicks: 38 },
    ],
  };
  const linkData30d = {
    period: "June 20 – July 19, 2026",
    totalClicks: 336,
    topLinks: [
      { path: "Website", clicks: 101 },
      { path: "NYCDS 60th Street", clicks: 74 },
      { path: "NYCDS 5th Ave", clicks: 52 },
      { path: "NYCDS 58th Street", clicks: 43 },
      { path: "NYCDS 35th Street", clicks: 41 },
      { path: "Homepage", clicks: 25 },
    ],
    trafficSources: [
      { source: "Named NYCDS links (human)", clicks: 336 },
      { source: "Wildcard / social / DDS-PC / excluded", clicks: 66 },
    ],
    topCountries: [
      { country: "United States", clicks: 281 },
      { country: "United Kingdom", clicks: 45 },
      { country: "Netherlands", clicks: 33 },
      { country: "Other", clicks: 43 },
    ],
    topCities: [
      { city: "New York City", clicks: 50 },
      { city: "Bristol", clicks: 31 },
      { city: "Columbus", clicks: 16 },
      { city: "Southold", clicks: 16 },
    ],
    devices: [
      { os: "Windows", clicks: 191 },
      { os: "Mac OS X", clicks: 91 },
      { os: "iOS", clicks: 68 },
      { os: "Android", clicks: 38 },
    ],
  };
  const linkData = timeRange === "7d" ? linkData7d : linkData30d;

  const websiteData7d = {
    period: "July 13 – July 19, 2026",
    sessions: 319,
    topPages: [
      { page: "/", label: "Home", views: 247 },
      { page: "/ourdoctors", label: "Our Doctors", views: 59 },
      { page: "/about", label: "About", views: 24 },
      { page: "/locations", label: "Locations", views: 24 },
      { page: "/comprehensive-care", label: "Comprehensive Care", views: 7 },
      { page: "/dr-james-eisdorfer", label: "Dr. James Eisdorfer", views: 7 },
      { page: "/restorative-dentistry", label: "Restorative Dentistry", views: 6 },
    ],
    trafficSources: [
      { source: "Direct", sessions: 195, pct: 61.1 },
      { source: "Google", sessions: 73, pct: 22.9 },
      { source: "Instagram (paid)", sessions: 30, pct: 9.4 },
      { source: "Facebook (paid)", sessions: 5, pct: 1.6 },
      { source: "Instagram (organic)", sessions: 5, pct: 1.6 },
      { source: "Other", sessions: 11, pct: 3.4 },
    ],
    devices: [
      { device: "Desktop", pct: 72.8 },
      { device: "Mobile", pct: 27.2 },
    ],
    dailyVisitors: [
      { date: "Jul 13", visitors: 39 },{ date: "Jul 14", visitors: 22 },
      { date: "Jul 15", visitors: 46 },{ date: "Jul 16", visitors: 21 },
      { date: "Jul 17", visitors: 41 },{ date: "Jul 18", visitors: 58 },
      { date: "Jul 19", visitors: 34 },
    ],
    search: {
      totalClicks: 90, totalImpressions: 6288, avgCTR: 1.43, avgPosition: 30.1,
      note: "GSC Jul 12 – Jul 18 (nycdentalsmiles.com · one-day lag)",
      topQueries: [
        { query: "nyc dental smiles", clicks: 12, ctr: 46.15, position: 1.46 },
        { query: "dr giraldo dentist", clicks: 2, ctr: 33.33, position: 6.50 },
        { query: "nyc dental smile team", clicks: 2, ctr: 50.00, position: 1.25 },
        { query: "michael chesner", clicks: 1, ctr: 12.50, position: 2.50 },
        { query: "pain after onlay", clicks: 1, ctr: 25.00, position: 2.50 },
      ],
      topPages: [
        { page: "Homepage", clicks: 37, impressions: 3950, ctr: 0.94 },
        { page: "Nerve Pain After Onlay", clicks: 16, impressions: 699, ctr: 2.29 },
        { page: "Our Doctors", clicks: 9, impressions: 789, ctr: 1.14 },
        { page: "Dr. Michael Chesner", clicks: 7, impressions: 72, ctr: 9.72 },
      ],
    },
  };
  const websiteData30d = {
    period: "June 20 – July 19, 2026",
    sessions: 1051,
    topPages: [
      { page: "/", label: "Home", views: 822 },
      { page: "/ourdoctors", label: "Our Doctors", views: 152 },
      { page: "/locations", label: "Locations", views: 79 },
      { page: "/about", label: "About", views: 69 },
      { page: "/why-nycds", label: "Why NYCDS", views: 35 },
      { page: "/accessibility-statement", label: "Accessibility", views: 28 },
      { page: "/dr-ben-elchami", label: "Dr. Ben Elchami", views: 26 },
    ],
    trafficSources: [
      { source: "Direct", sessions: 570, pct: 54.2 },
      { source: "Google", sessions: 300, pct: 28.5 },
      { source: "Instagram (paid)", sessions: 83, pct: 7.9 },
      { source: "Facebook (paid)", sessions: 38, pct: 3.6 },
      { source: "Audience Network (paid)", sessions: 20, pct: 1.9 },
      { source: "Other", sessions: 40, pct: 3.8 },
    ],
    devices: [
      { device: "Desktop", pct: 67.5 },
      { device: "Mobile", pct: 32.0 },
    ],
    dailyVisitors: [
      { date: "Jun 20", visitors: 21 },{ date: "Jun 23", visitors: 43 },
      { date: "Jun 26", visitors: 19 },{ date: "Jun 30", visitors: 25 },
      { date: "Jul 3", visitors: 11 },{ date: "Jul 9", visitors: 55 },
      { date: "Jul 15", visitors: 46 },{ date: "Jul 18", visitors: 58 },
    ],
    search: {
      totalClicks: 363, totalImpressions: 36698, avgCTR: 0.99, avgPosition: 37.2,
      note: "GSC Jun 19 – Jul 18 (nycdentalsmiles.com)",
      topQueries: [
        { query: "nyc dental smiles", clicks: 45, ctr: 57.69, position: 1.38 },
        { query: "nyc dental smile team", clicks: 6, ctr: 26.09, position: 1.65 },
        { query: "dr ben elchami", clicks: 5, ctr: 7.35, position: 5.79 },
        { query: "nyc smiles", clicks: 5, ctr: 21.74, position: 1.43 },
        { query: "dana kapparova", clicks: 3, ctr: 10.34, position: 3.34 },
      ],
      topPages: [
        { page: "Homepage", clicks: 141, impressions: 26754, ctr: 0.53 },
        { page: "Nerve Pain After Onlay", clicks: 55, impressions: 3024, ctr: 1.82 },
        { page: "Our Doctors", clicks: 45, impressions: 3368, ctr: 1.34 },
        { page: "Dr. Michael Chesner", clicks: 29, impressions: 307, ctr: 9.45 },
      ],
    },
  };
  const websiteData = timeRange === "7d" ? websiteData7d : websiteData30d;

  const socialData7d = {
    period: "July 13 – July 19, 2026",
    followers: 732,
    followerGrowth: 11,
    follows: 11,
    unfollows: 0,
    totalViews: 5538,
    totalReach: 7917,
    reachChange: 11.5,
    totalInteractions: 133,
    viewSplit: { followers: 31, nonFollowers: 69 },
    engagementSplit: { followers: 60, nonFollowers: 40 },
    viewsByType: { reels: 34, posts: 37, stories: 29 },
    interactionsByType: { reels: 50, posts: 32, stories: 18 },
    totalLikes: 24,
    totalComments: 0,
    totalSaves: 1,
    totalShares: 4,
    storyViews: 600, storyCompletion: 89, storyCount: 4,
    reelAvgWatchTime: "—", reelSkipRate: "—",
    dailyViews: [
      { date: "Jul 13", views: 1060 },{ date: "Jul 14", views: 900 },
      { date: "Jul 15", views: 490 },{ date: "Jul 16", views: 780 },
      { date: "Jul 17", views: 1250 },{ date: "Jul 18", views: 750 },
      { date: "Jul 19", views: 308 },
    ],
    posts: [
      { id: 1, title: "Modern Luxury Manhattan — Best of the City 2026", type: "Post", date: "Jul 16", views: 733, reach: 335, likes: 15, comments: 0, saves: 1, shares: 3, er: 5.67, skipRate: 0, avgWatch: "—", igUrl: "", isTop: true },
      { id: 2, title: "The Summer Sip Index (Carousel)", type: "Post", date: "Jul 17", views: 144, reach: 60, likes: 3, comments: 0, saves: 0, shares: 1, er: 6.67, skipRate: 0, avgWatch: "—", igUrl: "", isTop: false },
      { id: 3, title: "Recent Words From a Lenox Hill Patient", type: "Post", date: "Jul 18", views: 70, reach: 42, likes: 6, comments: 0, saves: 0, shares: 0, er: 14.29, skipRate: 0, avgWatch: "—", igUrl: "", isTop: false },
    ],
  };
  const socialData30d = {
    period: "June 20 – July 19, 2026",
    followers: 732,
    followerGrowth: 31,
    follows: 31,
    unfollows: 0,
    totalViews: 16580,
    totalReach: 20040,
    reachChange: 43.3,
    totalInteractions: 388,
    viewSplit: { followers: 28, nonFollowers: 72 },
    engagementSplit: { followers: 56, nonFollowers: 44 },
    viewsByType: { reels: 41, posts: 35, stories: 24 },
    interactionsByType: { reels: 54, posts: 31, stories: 14 },
    totalLikes: 167,
    totalComments: 19,
    totalSaves: 5,
    totalShares: 31,
    storyViews: 1095, storyCompletion: 89, storyCount: 18,
    reelAvgWatchTime: "—",
    reelSkipRate: "—",
    dailyViews: [
      { date: "Jun 20", views: 100 },{ date: "Jun 23", views: 200 },
      { date: "Jun 26", views: 700 },{ date: "Jun 30", views: 380 },
      { date: "Jul 3", views: 960 },{ date: "Jul 8", views: 180 },
      { date: "Jul 11", views: 1080 },{ date: "Jul 17", views: 1250 },
    ],
    posts: [
      { id: 1, title: "When Patients No Longer Dread the Dentist", type: "Reel", date: "Jul 10", views: 1170, reach: 700, likes: 43, comments: 5, saves: 2, shares: 8, er: 8.29, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/reel/Dan-hMNxehU/", isTop: true },
      { id: 2, title: "What Keeps Patients Coming Back — Oleksandr", type: "Reel", date: "Jul 11", views: 1140, reach: 713, likes: 43, comments: 5, saves: 1, shares: 10, er: 8.28, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/reel/DaqGc-npEIe/", isTop: false },
      { id: 3, title: "Modern Luxury Manhattan — Best of the City 2026", type: "Post", date: "Jul 16", views: 733, reach: 335, likes: 15, comments: 0, saves: 1, shares: 3, er: 5.67, skipRate: 0, avgWatch: "—", igUrl: "", isTop: false },
      { id: 4, title: "Dental Care Should Feel Different", type: "Reel", date: "Jul 2", views: 374, reach: 253, likes: 16, comments: 2, saves: 1, shares: 2, er: 8.30, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/reel/DaTPVCpRq5W/", isTop: false },
      { id: 5, title: "Which Summer Treat Is Toughest? (Carousel)", type: "Post", date: "Jun 26", views: 362, reach: 146, likes: 6, comments: 1, saves: 0, shares: 2, er: 6.16, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/p/DaDpy0ElgCd/", isTop: false },
      { id: 6, title: "Every Detail Matters", type: "Reel", date: "Jun 25", views: 329, reach: 212, likes: 12, comments: 1, saves: 0, shares: 4, er: 8.02, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/reel/DaBSbf6xDye/", isTop: false },
    ],
  };
  const socialData = timeRange === "7d" ? socialData7d : socialData30d;
  const overviewKpis = timeRange === "7d" ? [
    { label: "Followers", value: 732, change: "+11", delay: 0 },
    { label: "Views", value: 5538, delay: 80 },
    { label: "Reach", value: 7917, change: "+12%", delay: 160 },
    { label: "Interactions", value: 133, delay: 240 },
    { label: "Non-Follower", value: "~69%", delay: 320 },
  ] : [
    { label: "Followers", value: 732, change: "+31", delay: 0 },
    { label: "Views", value: 16580, delay: 80 },
    { label: "Reach", value: 20040, delay: 160 },
    { label: "Interactions", value: 388, delay: 240 },
    { label: "Non-Follower", value: "~72%", delay: 320 },
  ];


  const adsData = {
    period: "June 20 – July 19, 2026",
    campaign: "July Whitening Promo (active through Jul 31)",
    totalSpend: 203.25,
    budget: 250,
    impressions: 22670,
    reach: 15293,
    activeAds: 2,
    results: 387,
    costPerResult: 0.53,
    pctOfViews: 46.5,
    pctOfInteractions: 4.1,
    ads: [
      { name: "Stars Stripes & Brighter Smiles (active)", spend: 197.47, impressions: 22007, reach: 14686, quality: "Quality Average · Engagement Average · Conversion rate Below average (bottom 35%) — 379 landing-page views @ $0.52" },
      { name: "Let your smile sparkle this summer (active)", spend: 5.78, impressions: 663, reach: 607, quality: "Quality Average · Engagement Average · Conversion rate Below average (bottom 35%) — 8 landing-page views @ $0.72 · still barely delivering" },
    ],
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "◉" },
    { id: "content", label: "Content", icon: "◫" },
    { id: "links", label: "Links", icon: "⊞" },
    { id: "website", label: "Website", icon: "◈" },
    { id: "social", label: "Social", icon: "◍" },
    { id: "ads", label: "Ads", icon: "◇" },
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
      <div className="hdr"><div className="hdr-top"><div><div className="hdr-brand">Figment Creative · Social Intelligence</div><div className="hdr-title">{d.client.fullName}</div><div className="hdr-sub">Social Media Performance · {d.client.period}</div></div><div className="hdr-badge"><div className="hdr-pulse" />Weekly Report</div></div></div>
      {(tab === "links" || tab === "social" || tab === "website") && <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "12px 0 4px" }}>
        {(["7d", "30d"] as const).map((r) => (
          <button key={r} onClick={() => setTimeRange(r)} style={{ padding: "6px 18px", borderRadius: 99, border: `1.5px solid ${timeRange === r ? "#6F5060" : "#D9CCC1"}`, background: timeRange === r ? "#6F5060" : "transparent", color: timeRange === r ? "#fff" : "#6F5060", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>{r === "7d" ? "Last 7 Days" : "Last 30 Days"}</button>
        ))}
      </div>}
      <div className="tabs">{tabs.map((t) => (<button key={t.id} className={`tab ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}><span style={{ fontSize: 15 }}>{t.icon}</span> {t.label}</button>))}</div>

      <div className="grid">
        {tab === "overview" && (<>
          <div className="kpi-row">
            {[{ ...d.kpi.followers, delay: 0 }, { ...d.kpi.reach, delay: 80 }, { ...d.kpi.views, delay: 160 }, { ...d.kpi.engagementRate, delay: 240 }, { ...d.kpi.engagements, delay: 320 }, { ...d.kpi.watchTime, delay: 400 }].map((k, i) => (
              <div key={i} className="kpi" style={{ animationDelay: `${k.delay}ms` }}><div className="kpi-label">{k.label}</div><div className="kpi-val">{typeof k.value === "number" ? <AnimatedNumber value={k.value} suffix={"suffix" in k ? (k as any).suffix : ""} /> : <span>{k.value}</span>}</div>{"change" in k && k.change != null && (<div className="kpi-delta"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L12 8H2L7 2Z" fill="#8FA1A6" /></svg>+{k.change} this week</div>)}</div>
            ))}
          </div>
          <div className="exec"><div className="card-hd">Executive Summary</div>
            <div className="exec-grid">
              <ExecCard
                eyebrow="Discovery"
                tone="pos"
                metrics={[
                  { val: d.kpi.reach.value.toLocaleString(), label: "Reach", delta: "12%", dir: "up" },
                  { val: d.kpi.views.value.toLocaleString(), label: "Views", delta: "21%", dir: "up" },
                  { val: `${d.viewerSplit.nonFollowers}%`, label: "Non-Follower", delta: "3pt", dir: "down" },
                ]}
                noteLabel="Takeaway"
                notes={[
                  { text: "Reach and views both grew week over week.", tone: "pos" },
                  { text: "Discovery is still ~97% non-follower \u2014 paid and carryover Reels drive it.", tone: "" },
                  { text: "Follower share of views improved to 31%, up from 28%.", tone: "pos" },
                ]}
              />
              <ExecCard
                eyebrow="Engagement"
                tone="warn"
                metrics={[
                  { val: `${d.kpi.engagementRate.value}%`, label: "Eng. Rate", delta: "0.6pt", dir: "down" },
                  { val: d.kpi.engagements.value.toLocaleString(), label: "Interactions", delta: "18%", dir: "down" },
                  { val: `+${d.kpi.followers.change}`, label: "Followers", delta: "best on file", dir: "up" },
                ]}
                noteLabel="Why"
                notes={[
                  { text: "Zero Reels published \u2014 a first for this account.", tone: "neg" },
                  { text: "Reel interactions fell to 66, all prior-week carryover.", tone: "neg" },
                  { text: "Post interactions rose to 42 on the press feature.", tone: "pos" },
                  { text: "Saves 1 \u00b7 Shares 4 \u00b7 Comments 0.", tone: "neg" },
                ]}
              />
              <ExecCard
                eyebrow="Content"
                tone="neutral"
                hero={{
                  label: "Top Performer",
                  title: "Modern Luxury Manhattan \u2014 Best of the City 2026",
                  stats: [{ val: "733", label: "views" }, { val: "335", label: "reach" }, { val: "15", label: "likes" }],
                }}
                noteLabel="Key Notes"
                notes={[
                  { text: `Posts led the mix at ${d.contentMix.posts}%; Reels ${d.contentMix.reels}% is carryover.`, tone: "" },
                  { text: "Stories over-delivered \u2014 147 avg reach vs 60 monthly.", tone: "pos" },
                  { text: "Search quality up: 90 clicks at 1.43% CTR.", tone: "pos" },
                  { text: "Link clicks fell 61% to 33.", tone: "neg" },
                ]}
              />
            </div>
          </div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Content Mix</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.contentMix.reels }, { value: d.contentMix.posts }, { value: d.contentMix.stories }]} colors={["#6F5060", "#8FA1A6", "#A6968D"]} size={120} stroke={18} /><div style={{ flex: 1 }}>{[{ label: "Reels", value: d.contentMix.reels, color: "#6F5060" }, { label: "Posts", value: d.contentMix.posts, color: "#8FA1A6" }, { label: "Stories", value: d.contentMix.stories, color: "#A6968D" }].map((item) => (<div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}><div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} /><span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span><span className="display-num">{item.value}%</span></div>))}</div></div></div>
            <div className="card"><div className="card-hd">Viewer Composition</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.viewerSplit.nonFollowers }, { value: d.viewerSplit.followers }]} colors={["#6F5060", "#D9C5C1"]} size={120} stroke={18} /><div style={{ flex: 1 }}>{[{ label: "Non-Followers", value: d.viewerSplit.nonFollowers, color: "#6F5060" }, { label: "Followers", value: d.viewerSplit.followers, color: "#D9C5C1" }].map((item) => (<div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}><div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} /><span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span><span className="display-num">{item.value}%</span></div>))}<div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(143,161,166,0.12)", borderRadius: 10, border: "1px solid rgba(143,161,166,0.25)" }}><span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Wide discovery — ~69% of views and ~97% of reach came from non-followers (1,022 vs 35 on the deduplicated reach card). Follower share of views improved to 31% from 28% as the press feature pulled in owned audience</span></div></div></div></div>
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
            <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ A press-led, Reel-free week — the Modern Luxury Manhattan &ldquo;Best of the City 2026&rdquo; feature led at 733 views on 335 reach with 15 likes, the strongest static post in the file, and it travelled (LinkedIn 78 impressions / 6 reactions / 6 link clicks; Facebook 45 views). The Summer Sip Index carousel (144 / 60) and the Lenox Hill patient quote (70 / 42, 14.29% ER) followed. Reach rose to ~7,917 (+12%) but interactions fell to 133 (1.7% blended ER) with no new Reels published.</span>
          </div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Watch Time Analytics</div><div style={{ textAlign: "center", padding: "8px 0 22px" }}><div className="big-num">{d.kpi.watchTime.value}</div><div style={{ fontSize: 12, color: "#9B9196", marginTop: 2 }}>Avg Watch / Reel</div></div><div style={{ display: "flex", gap: 14 }}><div className="stat-box"><div className="big-num-sm plum">1,287</div><div className="stat-label">Reel Views (carryover)</div></div><div className="stat-box"><div className="big-num-sm steel">{d.kpi.views.value.toLocaleString()}</div><div className="stat-label">Total Views</div></div></div><div className="alert-box plum-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>✦ No Reels were published this cycle, so there is no fresh watch-time or view-through data — the 1,287 Reel views shown are residual traffic on the Jul 10 and Jul 11 testimonials from last cycle, which were still earning 66 interactions a full week after posting. That residual is the argument for restoring cadence: the format keeps working after you stop feeding it, but only for so long.</span></div></div>
            <div className="card"><div className="card-hd">Engagement Breakdown</div><div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{[{ label: "Likes", value: d.posts.reduce((s: number, p: any) => s + (p.likes||0), 0), max: 60, color: "#6F5060" }, { label: "Comments", value: d.posts.reduce((s: number, p: any) => s + (p.comments||0), 0), max: 60, color: "#8FA1A6" }, { label: "Shares", value: d.posts.reduce((s: number, p: any) => s + (p.shares||0), 0), max: 60, color: "#A6968D" }, { label: "Saves", value: d.posts.reduce((s: number, p: any) => s + (p.saves||0), 0), max: 60, color: "#BE5A5A" }].map((m) => (<div key={m.label} style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 72, fontSize: 13, fontWeight: 500 }}>{m.label}</div><div style={{ flex: 1, height: 10, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}><div style={{ width: `${(Math.max(m.value, 0.5) / m.max) * 100}%`, height: "100%", background: m.color, borderRadius: 99, transition: "width 1.2s ease" }} /></div><div className="display-num" style={{ width: 30, textAlign: "right" as const }}>{m.value}</div></div>))}</div><div className="alert-box danger-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#BE5A5A" }}>▲ Blended account engagement fell to ~1.7% (133 account-level interactions ÷ 7,917 paid-inflated reach) as Reel supply went to zero; Reels still carried ~50% of interactions on carryover alone. The owned-content breakdown below (24 likes, 4 shares, 0 comments, 1 save across the 3 new posts) is the honest picture: a press feature earns likes, not conversation. Comments went to zero for the first time in the file — static posts without a question prompt do not start dialogue. Restore Reels and put an explicit question in every caption.</span></div></div>
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
            <InsightCard title={"Link Attribution · " + linkData.period} body={timeRange === "7d" ? "Link performance collapsed this week: 33 human clicks over 7 days against 85 the prior week — a 61% drop, and the sharpest single-week decline in the file. About 28 of those land on the six allowlisted NYCDS links. The cause tracks directly to supply: no Reels shipped, so no end-frame link prompts, and only four Stories carried booking links. Reach was not the problem — those four Stories averaged 147 accounts each. ⚠ Modeled: ShortIO provides per-path counts only for the 30-day window, so the 7-day per-link split is apportioned from 30-day proportions (Website 9, 60th Street 6, 5th Ave 4, 58th Street 4, 35th Street 3, Homepage 2); the 33-click total and the week-over-week comparison are actual, read from the daily click series. Geo and device panels are the 30-day pull. ✓ DDS-PC merge applied — /DDS-PC-UES was legible at 1 click and has been stripped from NYCDS and passed to the EEC report; no Midtown link appeared." : "336 attributed clicks over 30 days across the four office links plus Website and Homepage — Website (101) led, then 60th Street (74), 5th Ave (52), 58th Street (43), 35th Street (41) and Homepage (25); all four locations active. Total human clicks were 403, down 20.8% on the prior 30-day window. Excluded: the /* wildcard (20), social links (LinkedIn 32, IG 6, FB 4), Linux/datacenter traffic (13 Linux; Ashburn's 71 clicks are datacenter and are excluded from the city panel), and the 222 non-human clicks in the raw 625 total. ✓ DDS-PC merge applied — /DDS-PC-UES (1 click) was legible and has been stripped from NYCDS and merged into the EEC report. UTM traffic confirms the locations page is the workhorse referrer (113 clicks, utm_medium=locationspage)."} severity="info" />
          </div>
        </>)}

        {tab === "website" && (<>
          <div className="kpi-row">
            {[
              { label: "Total Sessions", value: websiteData.sessions, delay: 0 },
              { label: "Page Views", value: websiteData.topPages.reduce((s, p) => s + p.views, 0), delay: 80 },
              { label: "Top Source", value: "Direct (~52%)", delay: 160 },
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
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>✦ Desktop-heavy traffic (~71%) — optimize for desktop conversion</span>
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
                      <div style={{ textAlign: "center" as const }}><div className="display-num">{q.ctr}%</div><div style={{ fontSize: 9, color: "#9B9196" }}>CTR</div></div>
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
                        <div style={{ textAlign: "center" as const }}><div className="display-num">{p.ctr}%</div><div style={{ fontSize: 9, color: "#9B9196" }}>CTR</div></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="card">
            <InsightCard title={"Website + Search · " + websiteData.period} body={timeRange === "7d" ? "261 new visitors over 7 days (~37/day, up from ~32), peaking at 58 on Jul 18 — the site's best week in the file. 319 sessions: Direct leads at 61.1% (195), Google 22.9% (73), then paid social — Instagram 9.4% (30), Facebook 1.6% (5) — plus 5 organic Instagram sessions. Desktop 72.8% / Mobile 27.2%, a heavier desktop skew than last cycle. /ourdoctors (59 views) and /locations (24) trail Home (247), but the doctor pages are converting in search. Fresh GSC (Jul 12–18, one-day lag): 90 clicks, 1.43% CTR, pos ~30 — clicks and CTR both up on last cycle's 86 / 1.25%, on 9% fewer impressions, which is a quality gain rather than a volume one. Traffic-source and page splits are actual GA4 7-day exports this cycle, not modeled." : "1,051 sessions over 30 days (886 new visitors). Direct 54.2% (570) and Google 28.5% (300) carry ~83% combined; paid social adds ~13% (IG 83, FB 38, Audience Network 20). Desktop 67.5% / Mobile 32.0% / Tablet 0.6%. /ourdoctors (152) is the clear #2 page — provider pages remain the conversion surface, and search confirms it (Chesner 9.45% CTR, Eisdorfer 21.19% over 30 days). ✓ The 'zeyao.net' referral (2 sessions) has been scrubbed as spam per the locked rule; workramp.io did not appear this cycle. GSC (true 30-day, Jun 19–Jul 18): 363 clicks at 0.99% CTR; the Nerve Pain After Onlay page (55 clicks, pos 5.22) still outranks every brand term — the non-brand SEO template to replicate."} severity="info" />
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

          <div className="card"><div className="card-hd">Performance Over Time · {socialData.period}</div>
            <div style={{ position: "relative", height: 180 }}>
              <svg viewBox="0 0 700 160" style={{ width: "100%", height: "100%" }}>
                <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6F5060" stopOpacity="0.18" /><stop offset="100%" stopColor="#6F5060" stopOpacity="0" /></linearGradient></defs>
                {(() => {
                  const pts = socialData.dailyViews;
                  const maxV = Math.max(...pts.map(p => p.views));
                  const coords = pts.map((p, i) => ({ x: 30 + (i / (pts.length - 1)) * 640, y: 145 - (p.views / maxV) * 130 }));
                  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
                  const area = `${line} L${coords[coords.length-1].x},150 L${coords[0].x},150 Z`;
                  return (<>
                    {[0, 0.25, 0.5, 0.75, 1].map(f => { const y = 145 - f * 130; return <line key={f} x1="30" x2="670" y1={y} y2={y} stroke="#D9CCC1" strokeWidth="0.5" strokeDasharray="4,4" />; })}
                    <path d={area} fill="url(#sg)" />
                    <path d={line} fill="none" stroke="#6F5060" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {coords.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r={pts[i].views >= 484 ? 5 : 3} fill={pts[i].views >= 484 ? "#6F5060" : "#8FA1A6"} stroke="#FAFAF8" strokeWidth="1.5" />)}
                    {pts.map((p, i) => <text key={`l${i}`} x={coords[i].x} y="158" textAnchor="middle" fontSize="8" fill="#9B9196">{p.date.replace("Apr ", "4/").replace("Mar ", "3/")}</text>)}
                    {pts.filter(p => p.views >= 484).map((p, idx) => { const i = pts.indexOf(p); return <text key={`v${idx}`} x={coords[i].x} y={coords[i].y - 10} textAnchor="middle" fontSize="9" fontWeight="700" fill="#6F5060">{p.views}</text>; })}
                  </>);
                })()}
              </svg>
            </div>
            <div style={{ marginTop: 8, padding: "10px 14px", background: "rgba(111,80,96,0.10)", borderRadius: 10, border: "1px solid rgba(111,80,96,0.25)" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>⚡ Reach rose to ~7,917 (Metricool avg. reach/day of 1,131 &times; 7; +12% WoW, non-follower reach ~97%) and views to 5,538 (+21%), with the biggest days Jul 13 and Jul 17 &mdash; the latter carrying the Summer Sip Index plus the week&rsquo;s strongest Story (474 reach). Blended engagement fell to ~1.7% (133 account-level interactions) as Reel supply went to zero; organic per-content ER held up (Lenox Hill post 14.29%, Summer Sip 6.67%). (Profile Growth &amp; Discovery CSV retired — reach is the Metricool avg-reach-per-day basis, not daily-series outlier-adjusted; the daily view shape is read from the Metricool chart and is approximate, summing to the actual 5,538 total.)</span>
            </div>
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
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Reels led views (55%) this week — the solo Reel out-viewed both feed posts combined and carried ~42% of account interactions; posts took ~35% and Stories ~23%. The lever is holding a 2–3 Reel/week cadence so discovery doesn't collapse onto a single piece.</span>
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
                <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>▲ No Reels shipped this week — the first reel-free cycle in the file, and the clearest single cause of the engagement-rate drop from 2.3% to 1.7%. Watch time and skip rate are unavailable as a result. What the gap proves is how much the format carries: the Jul 10 and Jul 11 testimonials were still booking 66 interactions and 1,287 views a week after posting, with no new supply behind them. Over the 30-day window the four Reels averaged 470 reach each against 107 for posts — a 4.4&times; advantage. Restore two to three testimonial Reels per week.</span>
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
                <div style={{ fontSize: 36, fontWeight: 700, color: "#6F5060" }}>0.20%</div>
                <div style={{ fontSize: 12, color: "#9B9196", marginTop: 4 }}>Views → Follower Conversion</div>
              </div>
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(143,161,166,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#8FA1A6" }}>5,538</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>views</div>
                </div>
                <div style={{ flex: 0, display: "flex", alignItems: "center", fontSize: 16, color: "#D9CCC1" }}>→</div>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(143,161,166,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#8FA1A6" }}>7,917</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>reached</div>
                </div>
                <div style={{ flex: 0, display: "flex", alignItems: "center", fontSize: 16, color: "#D9CCC1" }}>→</div>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(111,80,96,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#6F5060" }}>+11</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>followers</div>
                </div>
              </div>
              <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(111,80,96,0.10)", borderRadius: 10, border: "1px solid rgba(111,80,96,0.25)" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>▲ Reach rose to ~7,917 (+12%) and views to 5,538 (+21%), but blended engagement fell to ~1.7% (133 account-level interactions) — supply, not demand, was the constraint. The one bright spot is follower conversion: +11 net is the strongest weekly rate on file (1.57/day vs a 1.03/day monthly average), so the press feature did pull discovery into follows. Durable signals stayed thin: 1 save, 4 shares, 0 comments, and ShortIO clicks down 61% to 33. Restore Reel cadence and put booking links back in Stories.</span>
              </div>
            </div>
          </div>

          <div className="card">
            <InsightCard title={"Social Intelligence · " + socialData.period} body={timeRange === "7d" ? "5,538 account views (+21%) with reach at ~7,917 (Metricool avg. reach/day of 1,131 × 7; +12% WoW) but a blended engagement rate of ~1.7% (133 account-level interactions ÷ 7,917 — Reel 66 / Post 42 / Story 23 / Ad 2, per the locked account-level rule), down from 2.3%. The reason is simple and worth stating plainly: zero Reels were published. The week ran on three static posts and four Stories. The Modern Luxury Manhattan 'Best of the City 2026' feature carried it — 733 views on 335 reach with 15 likes, and it travelled: 78 LinkedIn impressions with 6 reactions and 6 link clicks (the account's best LinkedIn post of the window) plus 45 Facebook views. Stories over-delivered at 600 impressions and 147 avg reach across four posts, against a 60 monthly average. ~69% of views and ~97% of reach came from non-followers, though follower share of views improved to 31%. Ads fell to ~29% of content-type views. Reach basis flagged: Metricool avg-reach-per-day, no daily-series outlier adjustment since the Profile Growth & Discovery CSV was retired." : "16,580 native account views reaching ~20,040 (avg. reach/day of 668 × 30; +43% on the avg-reach basis) with 388 account-level interactions over Jun 20 – Jul 19. Reels still drove 41% of organic views and 54% of interactions off just four posts, averaging 470 reach each against 107 for the eight static posts — a 4.4× per-post advantage that makes the reel-free final week costly. ~72% of views came from non-followers. Top pieces: 'When Patients No Longer Dread the Dentist' (1,170 views, Jul 10), Oleksandr's testimonial (1,140, Jul 11) and the Modern Luxury feature (733, Jul 16). Followers +31. Paid ads contributed ~47% of content-type views and ~4% of interactions (see Paid Ads). ⚠ Modeled: per-reel likes/comments/saves/shares are apportioned from the Metricool reel totals (114/13/4/24) by reach share — reel-level breakdowns were not in the export. Engagement-by-follower split and IG demographics are carried from the prior pull."} severity="success" />
            <InsightCard title="Key Insight" body="This was a reel-free week, and the dashboard is mostly a measurement of what that costs. Reach rose 12% to ~7,917 and views 21% to 5,538, but interactions fell 18% to 133 and blended ER dropped from 2.3% to 1.7%. The distribution engine kept running; there was simply less new content to convert it. The clearest evidence sits in the carryover: the Jul 10 and Jul 11 testimonial Reels, published in the *previous* cycle, still booked 66 of this week's 133 interactions and 1,287 views entirely on residual circulation. Over 30 days Reels averaged 470 reach per post versus 107 for static — a 4.4× gap. What did work is worth banking. The Modern Luxury Manhattan 'Best of the City 2026' feature was the strongest single static post in the file (733 views, 335 reach, 15 likes) and the only piece that travelled cross-platform, taking LinkedIn to its best post of the window (78 impressions, 6 reactions, 6 link clicks). Stories over-delivered at 147 avg reach against a 60 monthly average. Follower conversion hit its best weekly rate on file at +11. Search improved on quality: 90 GSC clicks at 1.43% CTR on 9% fewer impressions, with the nerve-pain page holding position 5.7 and the doctor pages now converting (Chesner 9.72% CTR, Eisdorfer 15.38%). What is not landing: link attribution fell off a cliff — 33 human clicks against 85 the week before, -61% — because there were no Reel end-frames and only four Stories carrying booking links. Two levers: (1) restore two to three patient-testimonial Reels per week, which is the proven format and now also the proven absence, and (2) get booking links back in front of the audience daily — the reach was there this week, the ask was not." severity="success" />
          </div>
        </>)}

        {tab === "ads" && (<>
          <div className="kpi-row">
            {[
              { label: "Total Spend", value: "$203.25", delay: 0 },
              { label: "Landing-Page Views", value: adsData.results, delay: 80 },
              { label: "Cost / Result", value: "$0.53", delay: 160 },
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
              <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ $203.25 over 30 days, now consolidated into a single ad set — the Summer Campaign has fully rolled out of the window and every dollar sits in the July Whitening Promo. Spend fell 46% while landing-page views rose to 387 at $0.53 each, materially cheaper traffic than last cycle. Quality and engagement rankings both improved to <em>Average</em>, but conversion rate ranks <em>Below average (bottom 35%)</em> on both ads — cheap clicks that stall on arrival. ⚠ Per-ad reach is not de-duplicated (Meta reports it per ad), so the 15,293 total overstates unique people — impressions are the additive metric.</span>
            </div>
          </div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Spend Allocation</div>
              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <Donut data={[{ value: 97 }, { value: 3 }]} colors={["#6F5060", "#8FA1A6"]} size={120} stroke={18} />
                <div style={{ flex: 1 }}>
                  {[{ label: "Stars Stripes & Brighter Smiles", value: 97, color: "#6F5060" }, { label: "Let your smile sparkle", value: 3, color: "#8FA1A6" }].map((item) => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{item.label}</span>
                      <span className="display-num">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card"><div className="card-hd">Paid Contribution · Native IG · Jun 20 – Jul 19</div>
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
                <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Paid sent ~141 of the 1,051 website sessions over the 30-day window (Instagram 83, Facebook 38, Audience Network 20) — ~13% of site traffic, up from ~12%. In the 7-day view ads fell to ~29% of content-type views and just 2 of 133 interactions. ⚠ Attribution gap worth watching: Meta claims 387 landing-page views over the same window while GA4 attributes 141 paid sessions — a ~2.7&times; spread driven by Meta's 7-day-click/1-day-view window and by landing-page views not equalling sessions. Trust the GA4 figure for traffic; use Meta's only for relative ad comparison. Native-IG shares shown here are Metricool's account view; spend and impressions above are Meta's, which counts all placements.</span>
              </div>
            </div>
          </div>
          <div className="card">
            <InsightCard
              title="Cheap paid traffic that stalls on arrival"
              evidence={[
                "$203.25 spend \u2014 down 46%, now one ad set",
                "387 landing-page views at $0.53 \u2014 materially cheaper",
                "Quality and engagement rankings improved to Average",
                "Conversion rate ranks Below average on both ads",
                "Ads = 47% of content views but 4% of interactions",
              ]}
              impact="Media buying is working. The page it points at is not."
              action="Add a Lead/Booking event, then fix the whitening landing page before adding budget."
              severity="warning" />
          </div>
        </>)}

        {tab === "audience" && (<>
          <div className="cols2">
            <div className="card"><div className="card-hd">Gender Split</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.audience.gender.male }, { value: d.audience.gender.female }]} colors={["#6F5060", "#8FA1A6"]} size={130} stroke={20} /><div style={{ flex: 1 }}>{[{ label: "Male", value: d.audience.gender.male, color: "#6F5060" }, { label: "Female", value: d.audience.gender.female, color: "#8FA1A6" }].map((g) => (<div key={g.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}><div style={{ width: 12, height: 12, borderRadius: 4, background: g.color }} /><span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{g.label}</span><span className="display-num-lg">{g.value}%</span></div>))}</div></div></div>
            <div className="card"><div className="card-hd">Age Distribution</div>{d.audience.age.map((a) => (<div key={a.range} className="age-row"><div className="age-label">{a.range}</div><div className="age-track"><div className="age-fill" style={{ width: `${(a.pct / 36) * 100}%`, background: a.pct >= 28 ? "#6F5060" : a.pct >= 20 ? "#8FA1A6" : "#A6968D" }} /></div><div className="age-pct">{a.pct}%</div></div>))}</div>
          </div>
          <div className="card"><div className="card-hd">Audience Intelligence</div>
            <InsightCard title="Core Patient Demographic" body="59% of the audience falls in the 25–44 age range (30% aged 25–34, 29% aged 35–44) — the prime demographic for general, cosmetic and restorative dentistry. Gender is balanced at 52/48 male/female, and New York is the single largest follower market at 22.5% of the base — a tightly local, high-intent core. This is the highest lifetime-value segment for NYC Dental Smiles. ⚠ Demographic breakdown is carried from the prior pull — Metricool exports these as chart images and no demographic table was re-exported this cycle; New York at 22.86% of followers is confirmed current." severity="success" />
            <InsightCard title="Geography Is the Edge" body="At 22.5% of the follower base, New York dwarfs every other market (Sialkot, Boston and LA trail in the low single digits). The follower base is balanced at 52% male / 48% female. Local intent is the asset — geo-specific Story CTAs, location-tagged content, and office-specific booking links convert this audience better than broad reach plays. That case got stronger this week: ShortIO shows the locations page driving 113 of the month\u2019s clicks as a referrer, while overall link clicks fell 61% when Stories and Reels stopped carrying them. ⚠ Gender and city percentages carried from the prior pull." severity="info" />
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
