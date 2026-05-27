"use client";
import { useState, useEffect } from "react";

const FALLBACK_DATA = {
  client: { name: "NYCDS", fullName: "NYC Dental Smiles", period: "May 17 – May 24, 2026" },
  kpi: {
    followers: { value: 680, change: 1, label: "Followers" },
    reach: { value: 451, label: "Reach" },
    views: { value: 1540, label: "Total Views" },
    engagementRate: { value: 10.6, label: "Engagement Rate", suffix: "%" },
    engagements: { value: 48, label: "Engagements" },
    watchTime: { value: "37m 25s", label: "Watch Time" },
  },
  posts: [
    { id: 1, title: "Precision in Every Case – Dr. Farahani", type: "Reel", views: 374, reach: 248, likes: 17, comments: 1, saves: 0, shares: 0, isTop: true, igPostUrl: "https://www.instagram.com/reel/DYh5JrWRTzl/" },
    { id: 2, title: "Veneers – How Long Do They Last?", type: "Carousel", views: 164, reach: 73, likes: 4, comments: 0, saves: 1, shares: 1, isTop: false, igPostUrl: "https://www.instagram.com/p/DYkTZunFv03/" },
    { id: 3, title: "Skip These After Whitening", type: "Carousel", views: 158, reach: 68, likes: 4, comments: 0, saves: 0, shares: 1, isTop: false, igPostUrl: "https://www.instagram.com/p/DYnJY9klkO3/" },
  ] as any[],
  contentMix: { posts: 31, reels: 54, stories: 15 },
  audience: {
    gender: { male: 52, female: 48 },
    age: [
      { range: "18-24", pct: 5 }, { range: "25-34", pct: 31 }, { range: "35-44", pct: 29 },
      { range: "45-54", pct: 21 }, { range: "55-64", pct: 10 }, { range: "65+", pct: 4 },
    ],
  },
  viewerSplit: { followers: 41, nonFollowers: 59 },
};
type ReportData = typeof FALLBACK_DATA;

function generateInsights(data: ReportData) {
  const insights: { title: string; body: string; severity: string }[] = [];
  const opportunities: typeof insights = [];
  const recommendations: { text: string; priority: string }[] = [];
  const alerts: typeof insights = [];

  const er = data.kpi.engagementRate.value;
  const reach = data.kpi.reach.value;

  if (reach < 800) {
    alerts.push({ title: "Reach Collapse This Cycle", body: `Reach fell to ${reach} accounts (-61.5% WoW) — the same magnitude of decline seen across EEC this period. Likely platform-wide algorithmic compression rather than content quality. Engagement rate jumped to ${er}% on smaller reach, which suggests committed audience is still active. Hold publishing cadence; do not over-correct.`, severity: "danger" });
  }
  if (er >= 8) {
    insights.push({ title: "Engagement Rate Strong", body: `At ${er}%, engagement is well above the 5%+ healthcare benchmark. The compressed reach is concentrating views among genuinely interested accounts — they're interacting. The signal is healthy even if the volume isn't.`, severity: "success" });
  }
  const sorted = [
    { name: "Reels", val: data.contentMix.reels },
    { name: "Posts", val: data.contentMix.posts },
    { name: "Stories", val: data.contentMix.stories },
  ].sort((a, b) => b.val - a.val);
  insights.push({ title: "Content Format Distribution", body: `${sorted[0].name} lead at ${sorted[0].val}% of views, ${sorted[1].name} ${sorted[1].val}%, ${sorted[2].name} ${sorted[2].val}%. Reels still drive 59% of interactions on a smaller share of impressions — efficient format. The May 19 Dr. Farahani Reel beat typical skip rate by 10 points (64% vs 74%).`, severity: "info" });

  const totalSaves = data.posts.reduce((s: number, p: any) => s + (p.saves || 0), 0);
  if (totalSaves < 2) {
    opportunities.push({ title: "Saves Still the Weak Lever", body: `${totalSaves} save${totalSaves === 1 ? "" : "s"} across 3 published posts. Saves are the highest-weighted action in Meta's ranking — content needs to be reference-worthy. Carousels like 'Skip these after whitening' are the right format; the hook + final-slide CTA need to push readers to bookmark.`, severity: "warning" });
  }

  if (data.viewerSplit.nonFollowers > 50) {
    opportunities.push({ title: "Discovery Still Working", body: `${data.viewerSplit.nonFollowers}% of viewers are non-followers, on par with high-discovery weeks. While reach contracted, the algorithm is still distributing content outside the follower set. Profile CTAs and follow prompts on Reel cover frames are the conversion lever here.`, severity: "success" });
  }

  insights.push({ title: "Brand-Search Dependency on Google", body: `~85% of Search Console queries are brand/name terms (nyc dental smiles, dr michael chesner, michael chesner). The single non-brand top-5 query — 'nerve pain after onlay' — drives 157 clicks to one informational page at position 5.6. The blueprint for non-brand growth is sitting in that one page; replicate the template for 5–10 other procedure questions.`, severity: "info" });

  insights.push({ title: "Mobile Outranks Desktop on Google", body: "GSC: Mobile ranks at position 13.92 vs Desktop at 36.48 — a 2.6× ranking gap on the same content. Mobile experience is the strongest SEO lever right now. Audit mobile Core Web Vitals and ensure CTAs are thumb-reachable above the fold.", severity: "info" });

  const topAge = data.audience.age.reduce((a, b) => (a.pct > b.pct ? a : b));
  insights.push({ title: "Audience Alignment", body: `Primary audience is ${topAge.range} (${topAge.pct}%), with a ${data.audience.gender.male}/${data.audience.gender.female} male/female split. The 25–44 range represents ${(data.audience.age[1]?.pct || 0) + (data.audience.age[2]?.pct || 0)}% — strong patient demographic for cosmetic and restorative work.`, severity: "success" });

  if (data.kpi.followers.change != null && data.kpi.followers.change < 5) {
    opportunities.push({ title: "Follower Growth Stalling", body: `+${data.kpi.followers.change} net follower this week (4 follows, 3 unfollows). Reach contraction limits the discovery pool — focus is on conversion, not volume. Pinned content and bio CTA refresh would help capture the discovery share that exists.`, severity: "warning" });
  }

  recommendations.push(
    { text: "Replicate the 'nerve pain after onlay' template — 5+ procedure-question articles to expand non-brand SEO surface", priority: "high" },
    { text: "Open Reels with a question hook in the first 2 seconds — Dr. Farahani's Reel beat typical skip rate by 10pts, prove repeatable", priority: "high" },
    { text: "Add save-prompt CTAs to carousels: 'Save this before your next cleaning' / 'Bookmark for later'", priority: "high" },
    { text: "Audit mobile page speed and CTA placement — mobile already ranks 2.6× better than desktop on Google", priority: "medium" },
    { text: "Pin top-performing Dr. Farahani Reel to profile to convert discovery views into follows", priority: "medium" },
    { text: "Track the ChatGPT referral source (2 sessions / 30d) — small but rising; ensure homepage is parseable for AI overviews", priority: "low" },
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
    period: "May 17 – May 24, 2026",
    totalClicks: 60,
    topLinks: [
      { path: "NYCDS 58th Street", clicks: 16 },
      { path: "NYCDS 35th Street", clicks: 13 },
      { path: "NYCDS 5th Ave", clicks: 13 },
      { path: "NYCDS 60th Street", clicks: 10 },
      { path: "Homepage", clicks: 5 },
      { path: "Website", clicks: 3 },
    ],
    trafficSources: [
      { source: "Website (Locations)", clicks: 26 },
      { source: "Direct / Unknown", clicks: 32 },
      { source: "Search", clicks: 2 },
    ],
    topCountries: [
      { country: "United States", clicks: 51 },
      { country: "Canada", clicks: 3 },
      { country: "United Kingdom", clicks: 2 },
      { country: "Other", clicks: 4 },
    ],
    topCities: [
      { city: "New York City", clicks: 6 },
      { city: "Brooklyn", clicks: 2 },
      { city: "Portland", clicks: 1 },
    ],
    devices: [
      { os: "Windows", clicks: 22 },
      { os: "Mac OS X", clicks: 14 },
      { os: "iOS", clicks: 11 },
      { os: "Android", clicks: 7 },
      { os: "Linux", clicks: 6 },
    ],
  };
  const linkData30d = {
    period: "Apr 27 – May 27, 2026",
    totalClicks: 259,
    topLinks: [
      { path: "NYCDS 58th Street", clicks: 69 },
      { path: "NYCDS 35th Street", clicks: 57 },
      { path: "NYCDS 5th Ave", clicks: 56 },
      { path: "NYCDS 60th Street", clicks: 41 },
      { path: "Homepage", clicks: 23 },
      { path: "Website", clicks: 13 },
    ],
    trafficSources: [
      { source: "Website (Locations)", clicks: 111 },
      { source: "Direct / Unknown", clicks: 138 },
      { source: "Search", clicks: 10 },
    ],
    topCountries: [
      { country: "United States", clicks: 218 },
      { country: "Canada", clicks: 13 },
      { country: "United Kingdom", clicks: 9 },
      { country: "Netherlands", clicks: 6 },
      { country: "Other", clicks: 13 },
    ],
    topCities: [
      { city: "New York City", clicks: 25 },
      { city: "Brooklyn", clicks: 9 },
      { city: "Portland", clicks: 6 },
      { city: "North Bergen", clicks: 5 },
      { city: "Piscataway", clicks: 5 },
      { city: "Secaucus", clicks: 5 },
    ],
    devices: [
      { os: "Windows", clicks: 92 },
      { os: "Mac OS X", clicks: 62 },
      { os: "iOS", clicks: 47 },
      { os: "Android", clicks: 31 },
      { os: "Linux", clicks: 27 },
    ],
  };
  const linkData = timeRange === "7d" ? linkData7d : linkData30d;

  const websiteData7d = {
    period: "May 20 – May 26, 2026",
    sessions: 120,
    topPages: [
      { page: "/", label: "Home", views: 89 },
      { page: "/services", label: "Services", views: 23 },
      { page: "/ourdoctors", label: "Our Doctors", views: 21 },
      { page: "/locations", label: "Locations", views: 14 },
      { page: "/about", label: "About", views: 6 },
      { page: "/dr-michael-chesner", label: "Dr. Michael Chesner", views: 6 },
      { page: "/comprehensive-care", label: "Comprehensive Care", views: 3 },
      { page: "/testimonials/708-2", label: "Testimonials", views: 2 },
      { page: "/cosmetic-dentistry", label: "Cosmetic Dentistry", views: 2 },
    ],
    trafficSources: [
      { source: "Direct", sessions: 67, pct: 55.8 },
      { source: "Google", sessions: 40, pct: 33.3 },
      { source: "Figment Creative", sessions: 5, pct: 4.2 },
      { source: "Bing", sessions: 4, pct: 3.3 },
      { source: "snucm.com", sessions: 2, pct: 1.7 },
      { source: "Other", sessions: 2, pct: 1.6 },
    ],
    devices: [
      { device: "Desktop", pct: 79.8 },
      { device: "Mobile", pct: 20.2 },
    ],
    dailyVisitors: [
      { date: "May 20", visitors: 21 },{ date: "May 21", visitors: 5 },
      { date: "May 22", visitors: 12 },{ date: "May 23", visitors: 12 },
      { date: "May 24", visitors: 14 },{ date: "May 25", visitors: 6 },
      { date: "May 26", visitors: 17 },
    ],
    search: {
      totalClicks: 55, totalImpressions: 3366, avgCTR: 1.63, avgPosition: 40.41,
      note: "7-day (May 19 – May 25)",
      topQueries: [
        { query: "nyc dental smiles", clicks: 72, ctr: 45.57, position: 1.34 },
        { query: "nyc dental smile team", clicks: 23, ctr: 22.33, position: 1.38 },
        { query: "dr michael chesner", clicks: 15, ctr: 14.29, position: 5.65 },
        { query: "michael chesner", clicks: 15, ctr: 15.31, position: 2.78 },
        { query: "nerve pain after onlay", clicks: 10, ctr: 6.21, position: 1.71 },
        { query: "doris giraldo", clicks: 9, ctr: 16.07, position: 4.95 },
      ],
      topPages: [
        { page: "Homepage", clicks: 378, impressions: 20137, ctr: 1.88 },
        { page: "Our Doctors", clicks: 195, impressions: 4403, ctr: 4.43 },
        { page: "Nerve Pain After Onlay", clicks: 157, impressions: 6734, ctr: 2.33 },
        { page: "Dr. Michael Chesner", clicks: 93, impressions: 1035, ctr: 8.99 },
      ],
    },
  };
  const websiteData30d = {
    period: "Apr 27 – May 25, 2026",
    sessions: 681,
    topPages: [
      { page: "/", label: "Home", views: 516 },
      { page: "/ourdoctors", label: "Our Doctors", views: 222 },
      { page: "/locations", label: "Locations", views: 92 },
      { page: "/services", label: "Services", views: 47 },
      { page: "/about", label: "About", views: 44 },
      { page: "/dr-maria-tamay", label: "Dr. Maria Tamay", views: 33 },
      { page: "/dr-michael-chesner", label: "Dr. Michael Chesner", views: 28 },
      { page: "/dr-laura-koo-min-chee", label: "Dr. Laura Koo-Min-Chee", views: 16 },
      { page: "/restorative-dentistry", label: "Restorative Dentistry", views: 16 },
    ],
    trafficSources: [
      { source: "Direct", sessions: 347, pct: 50.5 },
      { source: "Google", sessions: 282, pct: 41.0 },
      { source: "Bing", sessions: 12, pct: 1.7 },
      { source: "Figment Creative", sessions: 8, pct: 1.2 },
      { source: "Instagram", sessions: 8, pct: 1.2 },
      { source: "Yahoo", sessions: 5, pct: 0.7 },
      { source: "Constant Contact", sessions: 5, pct: 0.7 },
      { source: "ChatGPT", sessions: 2, pct: 0.3 },
      { source: "Other", sessions: 12, pct: 1.7 },
    ],
    devices: [
      { device: "Desktop", pct: 73.7 },
      { device: "Mobile", pct: 26.1 },
      { device: "Tablet", pct: 0.2 },
    ],
    dailyVisitors: [
      { date: "Apr 27", visitors: 30 },{ date: "May 1", visitors: 13 },
      { date: "May 5", visitors: 28 },{ date: "May 9", visitors: 11 },
      { date: "May 13", visitors: 22 },{ date: "May 17", visitors: 12 },
      { date: "May 19", visitors: 27 },{ date: "May 22", visitors: 8 },
      { date: "May 25", visitors: 13 },
    ],
    search: {
      totalClicks: 308, totalImpressions: 12018, avgCTR: 2.56, avgPosition: 30.19,
      note: "30-day (Apr 26 – May 25)",
      topQueries: [
        { query: "nyc dental smiles", clicks: 72, ctr: 45.57, position: 1.34 },
        { query: "nyc dental smile team", clicks: 23, ctr: 22.33, position: 1.38 },
        { query: "dr michael chesner", clicks: 15, ctr: 14.29, position: 5.65 },
        { query: "michael chesner", clicks: 15, ctr: 15.31, position: 2.78 },
        { query: "nerve pain after onlay", clicks: 10, ctr: 6.21, position: 1.71 },
        { query: "doris giraldo", clicks: 9, ctr: 16.07, position: 4.95 },
      ],
      topPages: [
        { page: "Homepage", clicks: 378, impressions: 20137, ctr: 1.88 },
        { page: "Our Doctors", clicks: 195, impressions: 4403, ctr: 4.43 },
        { page: "Nerve Pain After Onlay", clicks: 157, impressions: 6734, ctr: 2.33 },
        { page: "Dr. Michael Chesner", clicks: 93, impressions: 1035, ctr: 8.99 },
      ],
    },
  };
  const websiteData = timeRange === "7d" ? websiteData7d : websiteData30d;

  const socialData7d = {
    period: "May 17 – May 24, 2026",
    followers: 680,
    followerGrowth: 1,
    follows: 4,
    unfollows: 3,
    totalViews: 1540,
    totalReach: 451,
    reachChange: -61.5,
    totalInteractions: 48,
    viewSplit: { followers: 40.7, nonFollowers: 59.3 },
    engagementSplit: { followers: 68.5, nonFollowers: 31.5 },
    viewsByType: { reels: 54.4, posts: 31.0, stories: 14.6 },
    interactionsByType: { reels: 59.3, posts: 25.9, stories: 14.8 },
    totalLikes: 25,
    totalComments: 1,
    totalSaves: 1,
    totalShares: 2,
    storyViews: 148, storyCompletion: 76, storyCount: 3,
    reelAvgWatchTime: "8s",
    reelSkipRate: "64%",
    dailyViews: [
      { date: "May 17", views: 60 },{ date: "May 18", views: 50 },
      { date: "May 19", views: 480 },{ date: "May 20", views: 320 },
      { date: "May 21", views: 290 },{ date: "May 22", views: 200 },
      { date: "May 23", views: 140 },
    ],
    posts: [
      { id: 1, title: "Precision in Every Case – Dr. Farahani", type: "Reel", date: "May 19", views: 374, reach: 248, likes: 17, comments: 1, saves: 0, shares: 0, er: 7.3, skipRate: 64, avgWatch: "8s", igUrl: "https://www.instagram.com/reel/DYh5JrWRTzl/", isTop: true },
      { id: 2, title: "Veneers – How Long Do They Last?", type: "Carousel", date: "May 20", views: 164, reach: 73, likes: 4, comments: 0, saves: 1, shares: 1, er: 8.2, skipRate: 0, avgWatch: "", igUrl: "https://www.instagram.com/p/DYkTZunFv03/", isTop: false },
      { id: 3, title: "Skip These After Whitening", type: "Carousel", date: "May 21", views: 158, reach: 68, likes: 4, comments: 0, saves: 0, shares: 1, er: 7.4, skipRate: 0, avgWatch: "", igUrl: "https://www.instagram.com/p/DYnJY9klkO3/", isTop: false },
    ],
  };
  const socialData30d = {
    period: "Apr 27 – May 27, 2026",
    followers: 680,
    followerGrowth: 1,
    follows: 12,
    unfollows: 11,
    totalViews: 6056,
    totalReach: 3800,
    reachChange: 0,
    totalInteractions: 166,
    viewSplit: { followers: 30, nonFollowers: 70 },
    engagementSplit: { followers: 60, nonFollowers: 40 },
    viewsByType: { reels: 76, posts: 11, stories: 13 },
    interactionsByType: { reels: 92, posts: 7, stories: 1 },
    totalLikes: 158,
    totalComments: 5,
    totalSaves: 2,
    totalShares: 8,
    storyViews: 786, storyCompletion: 85, storyCount: 15,
    reelAvgWatchTime: "6-10s",
    reelSkipRate: "58–78%",
    dailyViews: [
      { date: "Apr 29", views: 477 },{ date: "May 8", views: 580 },
      { date: "May 9", views: 804 },{ date: "May 12", views: 1696 },
      { date: "May 14", views: 697 },{ date: "May 15", views: 163 },
      { date: "May 19", views: 374 },{ date: "May 20", views: 164 },
      { date: "May 21", views: 158 },
    ],
    posts: [
      { id: 1, title: "Dental Implants – Misunderstood", type: "Reel", date: "May 12", views: 1696, reach: 1003, likes: 61, comments: 1, saves: 1, shares: 0, er: 6.3, skipRate: 58, avgWatch: "10s", igUrl: "https://www.instagram.com/reel/DYP-UpfJ_26/", isTop: true },
      { id: 2, title: "Some Journeys Leave a Lasting Mark", type: "Reel", date: "May 9", views: 804, reach: 436, likes: 24, comments: 2, saves: 0, shares: 0, er: 6.0, skipRate: 61, avgWatch: "9s", igUrl: "https://www.instagram.com/reel/DYC4lmrJJOv/", isTop: false },
      { id: 3, title: "Toothbrush Still Doing Its Job?", type: "Reel", date: "May 14", views: 697, reach: 520, likes: 6, comments: 0, saves: 0, shares: 2, er: 1.5, skipRate: 74, avgWatch: "4s", igUrl: "https://www.instagram.com/reel/DYUzOKspMvg/", isTop: false },
      { id: 4, title: "What Is a Prosthodontist?", type: "Reel", date: "Apr 29", views: 477, reach: 314, likes: 20, comments: 1, saves: 0, shares: 2, er: 7.3, skipRate: 59, avgWatch: "10s", igUrl: "https://www.instagram.com/reel/DXuuSkHEXIi/", isTop: false },
      { id: 5, title: "The Why Behind the White Coat – Dr. Laura", type: "Reel", date: "May 8", views: 391, reach: 292, likes: 8, comments: 0, saves: 0, shares: 0, er: 2.7, skipRate: 73, avgWatch: "5s", igUrl: "https://www.instagram.com/reel/DYFE8DoRapA/", isTop: false },
      { id: 6, title: "Precision in Every Case – Dr. Farahani", type: "Reel", date: "May 19", views: 374, reach: 248, likes: 17, comments: 1, saves: 0, shares: 0, er: 7.3, skipRate: 64, avgWatch: "8s", igUrl: "https://www.instagram.com/reel/DYh5JrWRTzl/", isTop: false },
      { id: 7, title: "Veneers – How Long Do They Last?", type: "Carousel", date: "May 20", views: 164, reach: 73, likes: 4, comments: 0, saves: 1, shares: 1, er: 8.2, skipRate: 0, avgWatch: "", igUrl: "https://www.instagram.com/p/DYkTZunFv03/", isTop: false },
    ],
  };
  const socialData = timeRange === "7d" ? socialData7d : socialData30d;
  const overviewKpis = timeRange === "7d" ? [
    { label: "Followers", value: 680, change: "+1", delay: 0 },
    { label: "Views", value: 1540, delay: 80 },
    { label: "Reach", value: 451, change: "-61.5%", delay: 160 },
    { label: "Interactions", value: 48, delay: 240 },
    { label: "Non-Follower", value: "59.3%", delay: 320 },
  ] : [
    { label: "Followers", value: 680, change: "+1", delay: 0 },
    { label: "Views", value: 6056, delay: 80 },
    { label: "Reach", value: 3800, delay: 160 },
    { label: "Interactions", value: 166, delay: 240 },
    { label: "Non-Follower", value: "70%", delay: 320 },
  ];


  const tabs = [
    { id: "overview", label: "Overview", icon: "◉" },
    { id: "content", label: "Content", icon: "◫" },
    { id: "links", label: "Links", icon: "⊞" },
    { id: "website", label: "Website", icon: "◈" },
    { id: "social", label: "Social", icon: "◍" },
    { id: "audience", label: "Audience", icon: "◎" },
    { id: "insights", label: "Insights", icon: "✦" },
  ];

  const sev: Record<string, { bg: string; border: string; dot: string }> = {
    success: { bg: "rgba(143,161,166,0.12)", border: "rgba(143,161,166,0.35)", dot: "#8FA1A6" },
    warning: { bg: "rgba(111,80,96,0.10)", border: "rgba(111,80,96,0.30)", dot: "#6F5060" },
    danger: { bg: "rgba(190,90,90,0.10)", border: "rgba(190,90,90,0.30)", dot: "#BE5A5A" },
    info: { bg: "rgba(166,150,141,0.12)", border: "rgba(166,150,141,0.35)", dot: "#A6968D" },
  };

  function InsightCard({ title, body, severity }: { title: string; body: string; severity: string }) {
    const s = sev[severity] || sev.info;
    return (<div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: "18px 22px", marginBottom: 12 }}><div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}><div style={{ width: 8, height: 8, borderRadius: 99, background: s.dot, flexShrink: 0 }} /><span style={{ fontWeight: 700, fontSize: 13, color: "#6F5060" }}>{title}</span></div><div style={{ fontSize: 13, lineHeight: 1.7, color: "#5C4E54" }}>{body}</div></div>);
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
          <div className="exec"><div className="card-hd">Executive Summary</div><div className="exec-cols">
            <div><div className="exec-col-title">Discovery</div><div className="exec-col-body">{d.viewerSplit.nonFollowers}% non-follower views — discovery is still working despite the reach contraction. Reach 451 (-61.5% WoW), the same magnitude EEC saw this period — pattern, not signal. May 19 Dr. Farahani Reel hit 71.2% non-follower views and beat typical skip rate by 10 points (64% vs 74%).</div></div>
            <div><div className="exec-col-title">Engagement</div><div className="exec-col-body">10.6% ER on 48 interactions — well above the 5% healthcare benchmark. Reels still drive 59% of interactions. 4 follows / 3 unfollows net to +1 follower. 1 save and 2 shares across 3 posts — saves remain the lever to push. 25–44 demo = 60% of audience.</div></div>
            <div><div className="exec-col-title">Content</div><div className="exec-col-body">Reels {d.contentMix.reels}% of views, Posts {d.contentMix.posts}%, Stories {d.contentMix.stories}%. May 12 'Dental Implants Misunderstood' anchors 30d at 1,696 views and 58% skip. GSC 30d: 308 clicks at pos 30; 85% brand-search heavy. Mobile ranks 2.6× better than desktop on Google — the SEO lever.</div></div>
          </div></div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Content Mix</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.contentMix.reels }, { value: d.contentMix.posts }, { value: d.contentMix.stories }]} colors={["#6F5060", "#8FA1A6", "#A6968D"]} size={120} stroke={18} /><div style={{ flex: 1 }}>{[{ label: "Reels", value: d.contentMix.reels, color: "#6F5060" }, { label: "Posts", value: d.contentMix.posts, color: "#8FA1A6" }, { label: "Stories", value: d.contentMix.stories, color: "#A6968D" }].map((item) => (<div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}><div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} /><span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span><span className="display-num">{item.value}%</span></div>))}</div></div></div>
            <div className="card"><div className="card-hd">Viewer Composition</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.viewerSplit.nonFollowers }, { value: d.viewerSplit.followers }]} colors={["#6F5060", "#D9C5C1"]} size={120} stroke={18} /><div style={{ flex: 1 }}>{[{ label: "Non-Followers", value: d.viewerSplit.nonFollowers, color: "#6F5060" }, { label: "Followers", value: d.viewerSplit.followers, color: "#D9C5C1" }].map((item) => (<div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}><div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} /><span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span><span className="display-num">{item.value}%</span></div>))}<div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(143,161,166,0.12)", borderRadius: 10, border: "1px solid rgba(143,161,166,0.25)" }}><span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Strong discovery — content reaching new audiences</span></div></div></div></div>
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
          <div className="cols2">
            <div className="card"><div className="card-hd">Watch Time Analytics</div><div style={{ textAlign: "center", padding: "8px 0 22px" }}><div className="big-num">{typeof d.kpi.watchTime.value === "string" ? d.kpi.watchTime.value.replace(/\s*\d+s$/, "") : d.kpi.watchTime.value}</div><div style={{ fontSize: 12, color: "#9B9196", marginTop: 2 }}>Total Watch Time</div></div><div style={{ display: "flex", gap: 14 }}><div className="stat-box"><div className="big-num-sm plum">8s</div><div className="stat-label">Avg Duration</div></div><div className="stat-box"><div className="big-num-sm steel">{d.kpi.views.value.toLocaleString()}</div><div className="stat-label">Total Views</div></div></div><div className="alert-box plum-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>✦ 64% skip rate beat typical 74% — best retention curve in 30 days</span></div></div>
            <div className="card"><div className="card-hd">Engagement Breakdown</div><div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{[{ label: "Likes", value: d.posts.reduce((s: number, p: any) => s + (p.likes||0), 0), max: 50, color: "#6F5060" }, { label: "Comments", value: d.posts.reduce((s: number, p: any) => s + (p.comments||0), 0), max: 50, color: "#8FA1A6" }, { label: "Shares", value: d.posts.reduce((s: number, p: any) => s + (p.shares||0), 0), max: 50, color: "#A6968D" }, { label: "Saves", value: d.posts.reduce((s: number, p: any) => s + (p.saves||0), 0), max: 50, color: "#BE5A5A" }].map((m) => (<div key={m.label} style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 72, fontSize: 13, fontWeight: 500 }}>{m.label}</div><div style={{ flex: 1, height: 10, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}><div style={{ width: `${(Math.max(m.value, 0.5) / m.max) * 100}%`, height: "100%", background: m.color, borderRadius: 99, transition: "width 1.2s ease" }} /></div><div className="display-num" style={{ width: 30, textAlign: "right" as const }}>{m.value}</div></div>))}</div><div className="alert-box danger-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#BE5A5A" }}>▲ 1 save across 3 posts — still the weakest signal; carousels need bookmark CTAs</span></div></div>
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
            <InsightCard title={"Link Attribution · " + linkData.period} body={timeRange === "7d" ? "247 human clicks — massive surge (+815% vs prior week). General /* link drove 132 clicks (possible campaign or shared link). 5th Ave (36), 58th St (33), 35th St (23) locations active. US dominates at 214. Windows leads devices at 104 — desktop/office traffic. FakeGoogle (5 clicks) filtered." : "389 human clicks over 30 days. Location links distributed across all 4 offices. Website UTM drives 111 clicks. NYC leads cities at 75. Consistent upward trend in link engagement."} severity="info" />
          </div>
        </>)}

        {tab === "website" && (<>
          <div className="kpi-row">
            {[
              { label: "Total Sessions", value: websiteData.sessions, delay: 0 },
              { label: "Page Views", value: websiteData.topPages.reduce((s, p) => s + p.views, 0), delay: 80 },
              { label: "Top Source", value: "Google (47.9%)", delay: 160 },
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
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>✦ Desktop-heavy traffic (72%) — optimize for desktop conversion</span>
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
            <InsightCard title={"Website + Search · " + websiteData.period} body={timeRange === "7d" ? "120 sessions over 7 days (~17/day). Direct leads at 55.8% (67 sessions), Google 33.3% (40), with Figment Creative referrals at 4.2%. Desktop 79.8% / Mobile 20.2%. May 20 was the strongest day at 21 visitors; May 21 dipped to 5. GSC 7d shows position degrading from 32 (May 19) to 51 (May 24) — investigate." : "681 sessions over 30 days. Direct 50.5% (347) and Google 41.0% (282) carry 91% of traffic combined. 2 ChatGPT referrals appeared this period — small but worth monitoring for AI-driven traffic. Desktop 73.7% / Mobile 26.1%. GSC 30d: 308 clicks, 2.56% CTR, pos 30.19. Nerve Pain After Onlay page = 157 clicks at pos 5.59 — the non-brand SEO win to replicate."} severity="info" />
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
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>⚡ Spike-driven performance — Apr 10–12 generated 40% of all views. Growth depends on individual content wins, not sustained distribution.</span>
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
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Posts dominate both views (45.3%) and interactions (50.5%) — proof-based content wins</span>
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
                <span style={{ fontSize: 12, fontWeight: 600, color: "#BE5A5A" }}>▲ Hooks are failing — 71–82% skip within first 3 seconds. Reels need immediate visual payoff.</span>
              </div>
            </div>
          </div>

          <div className="cols2">
            <div className="card"><div className="card-hd">Engagement Breakdown</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Likes", value: socialData.totalLikes, max: 65, color: "#6F5060" },
                  { label: "Shares", value: socialData.totalShares, max: 65, color: "#8FA1A6" },
                  { label: "Saves", value: socialData.totalSaves, max: 65, color: "#A6968D" },
                  { label: "Comments", value: socialData.totalComments, max: 65, color: "#BE5A5A" },
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
                <div style={{ fontSize: 36, fontWeight: 700, color: "#6F5060" }}>0.13%</div>
                <div style={{ fontSize: 12, color: "#9B9196", marginTop: 4 }}>Views → Follower Conversion</div>
              </div>
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(143,161,166,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#8FA1A6" }}>4,690</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>views</div>
                </div>
                <div style={{ flex: 0, display: "flex", alignItems: "center", fontSize: 16, color: "#D9CCC1" }}>→</div>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(143,161,166,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#8FA1A6" }}>1,026</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>reached</div>
                </div>
                <div style={{ flex: 0, display: "flex", alignItems: "center", fontSize: 16, color: "#D9CCC1" }}>→</div>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(111,80,96,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#6F5060" }}>+6</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>followers</div>
                </div>
              </div>
              <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(111,80,96,0.10)", borderRadius: 10, border: "1px solid rgba(111,80,96,0.25)" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>▲ Primary constraint: content attracts attention but does not convert to audience</span>
              </div>
            </div>
          </div>

          <div className="card">
            <InsightCard title={"Social Intelligence · " + socialData.period} body={timeRange === "7d" ? "1,540 views reaching 451 accounts (-61.5% WoW — parallel to EEC). 59.3% non-follower views. 10.6% ER on 48 interactions — above 5% healthcare benchmark. May 19 Dr. Farahani Reel hit 64% skip rate vs 74% typical (beat avg by 10pts), 71% non-followers. 3 posts published: 1 Reel + 2 Carousels. 3 Stories at 76% avg completion." : "6,056 views over 30 days across 11 posts (7 Reels + 4 Carousels) and 15 Stories. May 12 'Dental Implants Misunderstood' breakout at 1,696 views and 58% skip. Reels deliver 76% of views and 92% of interactions — the workhorse format. Skip rates vary widely (58–78%) — content quality, not algorithm, is the differentiator."} severity="info" />
            <InsightCard title="Key Insight" body="The reach collapse (-61.5%) is platform-wide, not a NYCDS-specific failure — EEC saw exactly the same magnitude this period. What's working: Dr. Farahani's Reel beat typical skip rate by 10 points, the second consecutive doctor-led Reel to outperform (after May 12's Dr. Tamay). Formula confirmed: doctor-led, educational, under 45s. What's not: saves (1 across 3 posts) and the 60-second carousels need stronger bookmark CTAs to compound algorithmic weight." severity="success" />
          </div>
        </>)}

        {tab === "audience" && (<>
          <div className="cols2">
            <div className="card"><div className="card-hd">Gender Split</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.audience.gender.male }, { value: d.audience.gender.female }]} colors={["#6F5060", "#8FA1A6"]} size={130} stroke={20} /><div style={{ flex: 1 }}>{[{ label: "Male", value: d.audience.gender.male, color: "#6F5060" }, { label: "Female", value: d.audience.gender.female, color: "#8FA1A6" }].map((g) => (<div key={g.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}><div style={{ width: 12, height: 12, borderRadius: 4, background: g.color }} /><span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{g.label}</span><span className="display-num-lg">{g.value}%</span></div>))}</div></div></div>
            <div className="card"><div className="card-hd">Age Distribution</div>{d.audience.age.map((a) => (<div key={a.range} className="age-row"><div className="age-label">{a.range}</div><div className="age-track"><div className="age-fill" style={{ width: `${(a.pct / 36) * 100}%`, background: a.pct >= 28 ? "#6F5060" : a.pct >= 20 ? "#8FA1A6" : "#A6968D" }} /></div><div className="age-pct">{a.pct}%</div></div>))}</div>
          </div>
          <div className="card"><div className="card-hd">Audience Intelligence</div>
            <InsightCard title="Core Patient Demographic" body="60% of the audience falls in the 25–44 age range (31% aged 25–34, 29% aged 35–44) — the prime demographic for general dentistry, cosmetic procedures, and Invisalign. Audience gender remains balanced at 52/48 male/female. This represents the highest lifetime patient value segment for NYC Dental Smiles." severity="success" />
            <InsightCard title="Gender Balance" body="At 52% male / 48% female (excluding 28.6% who preferred not to say), the audience is nearly balanced. The 25–34 male segment is the largest single cohort. Consider testing content themes that resonate with female audiences — cosmetic dentistry, teeth whitening, and wellness-focused oral health — to drive appointment bookings." severity="info" />
          </div>
        </>)}

        {tab === "insights" && (<>
          <div className="cols2">
            <div><div className="section-label">Key Insights</div>{engine.insights.map((ins, i) => <InsightCard key={i} {...ins} />)}</div>
            <div><div className="section-label">Growth Opportunities</div>{engine.opportunities.map((o, i) => <InsightCard key={i} {...o} />)}{engine.alerts.map((a, i) => <InsightCard key={`a${i}`} {...a} />)}</div>
          </div>
          <div className="card"><div className="card-hd">Strategic Recommendations</div>{engine.recommendations.map((r, i) => (<div key={i} className="rec"><span className={`rec-badge ${r.priority}`}>{r.priority}</span><span style={{ fontSize: 13, lineHeight: 1.6 }}>{r.text}</span></div>))}</div>
        </>)}

        <div className="footer"><span>NYC Dental Smiles · Powered by Figment Creative</span></div>
      </div>
    </div>
  );
}
