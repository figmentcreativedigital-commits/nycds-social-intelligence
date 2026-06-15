"use client";
import { useState, useEffect } from "react";

const FALLBACK_DATA = {
  client: { name: "NYCDS", fullName: "NYC Dental Smiles", period: "June 8 – June 15, 2026" },
  kpi: {
    followers: { value: 690, change: 1, label: "Followers" },
    reach: { value: 540, label: "Reach" },
    views: { value: 1549, label: "Total Views" },
    engagementRate: { value: 8.0, label: "Engagement Rate", suffix: "%" },
    engagements: { value: 43, label: "Engagements" },
    watchTime: { value: "—", label: "Watch Time" },
  },
  posts: [
    { id: 1, title: "Behind the Scenes — Dr. Maria Tamay", type: "Story", views: 610, reach: 440, likes: 3, comments: 0, saves: 0, shares: 1, isTop: true, igPostUrl: "" },
    { id: 2, title: "A More Advanced Way — AI-Assisted Imaging", type: "Post", views: 155, reach: 64, likes: 6, comments: 0, saves: 0, shares: 3, isTop: false, igPostUrl: "https://www.instagram.com/p/DZcplDQRa9i/" },
    { id: 3, title: "Your Toothpaste Matters", type: "Carousel", views: 62, reach: 26, likes: 2, comments: 0, saves: 0, shares: 0, isTop: false, igPostUrl: "https://www.instagram.com/p/DZfeQ-ulkNI/" },
  ] as any[],
  contentMix: { posts: 19, reels: 24, stories: 57 },
  audience: {
    gender: { male: 52, female: 48 },
    age: [
      { range: "18-24", pct: 6 }, { range: "25-34", pct: 30 }, { range: "35-44", pct: 29 },
      { range: "45-54", pct: 21 }, { range: "55-64", pct: 10 }, { range: "65+", pct: 4 },
    ],
  },
  viewerSplit: { followers: 40, nonFollowers: 60 },
};
type ReportData = typeof FALLBACK_DATA;

function generateInsights(data: ReportData) {
  const insights: { title: string; body: string; severity: string }[] = [];
  const opportunities: typeof insights = [];
  const recommendations: { text: string; priority: string }[] = [];
  const alerts: typeof insights = [];

  const er = data.kpi.engagementRate.value;
  const reach = data.kpi.reach.value;

  opportunities.push({ title: "Reach Grew +49.2% — Driven Entirely by Stories", body: `Accounts reached climbed to ${reach} (+49.2% WoW) with zero new Reels and zero collaborations this week. Stories carried it — 57% of all account views — led by the behind-the-scenes / Dr. Maria Tamay story, which alone pulled 610 views and reached 440 accounts at 83.1% non-followers. Account views normalized to ${data.kpi.views.value.toLocaleString()} (down from last week's collab-inflated 3,410), but the underlying organic reach is the healthiest signal: discovery is working without paid or partner amplification.`, severity: "success" });

  insights.push({ title: `Engagement Rate Solid at ${er}%`, body: `${data.kpi.engagements.value} interactions against ${reach} accounts reached = ${er}% — above the 5% healthcare benchmark. The catch: ${100 - 20.5}% of interactions came from existing followers, and they split evenly across Stories, Reels and Posts (36 / 36 / 28). The top-engaging owned post was the AI-imaging photo (9 interactions on 64 reach = 14.1%). Discovery reach is wide, but turning it into action is where the week falls short.`, severity: "info" });

  const sorted = [
    { name: "Reels", val: data.contentMix.reels },
    { name: "Posts", val: data.contentMix.posts },
    { name: "Stories", val: data.contentMix.stories },
  ].sort((a, b) => b.val - a.val);
  insights.push({ title: "Stories Lead the Format Mix", body: `${sorted[0].name} led at ${sorted[0].val}% of views, ${sorted[1].name} ${sorted[1].val}%, ${sorted[2].name} ${sorted[2].val}%. Notably, no Reels were published this week — the 24% of views still attributed to Reels is residual from the back catalog. Stories are quietly the strongest discovery format right now, but they expire in 24h; the lever is pairing that Story momentum with a steady Reel cadence so reach compounds rather than resets.`, severity: "info" });

  const totalSaves = data.posts.reduce((s: number, p: any) => s + (p.saves || 0), 0);
  if (totalSaves < 2) {
    opportunities.push({ title: "Saves Remain the Weak Lever", body: `${totalSaves} saves across the week's owned content. Saves are the highest-weighted action in Meta's ranking. The audience clearly watches (610-view story, +49% reach), but nothing is reference-worthy enough to bookmark. Procedure explainers and before/after carousels with a 'Save this before you book' CTA on the final frame are the fix.`, severity: "warning" });
  }

  if (data.viewerSplit.nonFollowers >= 45) {
    opportunities.push({ title: "Discovery Wide, Conversion Narrow", body: `${data.viewerSplit.nonFollowers}% of views came from non-followers — discovery is wide open. But external link taps fell to 2 (−33.3%) and net follows were just +1. The algorithm is delivering new audiences; the profile and Story CTAs aren't catching them. Add a booking-link sticker to high-reach Stories and refresh the bio CTA to convert the traffic that's already arriving.`, severity: "warning" });
  }

  insights.push({ title: "Brand-Search Dependency on Google", body: `Most Search Console clicks are brand/name terms (nyc dental smiles 33 clicks at 56.9% CTR, dr farahani, michael chesner). The standout non-brand asset — the 'nerve pain after onlay' page — drew 53 clicks at position 6.2 over 30 days, ranking far better than the brand pages. That one page is the blueprint for non-brand growth; replicate the template across 5–10 procedure questions.`, severity: "info" });

  insights.push({ title: "Mobile Outranks Desktop on Google", body: "GSC: Mobile ranks at position 17.5 vs Desktop at 40.8 — a ~2.3× ranking gap on the same content, with mobile converting at 2.93% CTR vs 1.17% on desktop. Mobile out-clicks desktop outright (143 vs 133). Mobile experience is the strongest SEO lever right now — audit Core Web Vitals and keep CTAs thumb-reachable above the fold.", severity: "info" });

  const topAge = data.audience.age.reduce((a, b) => (a.pct > b.pct ? a : b));
  insights.push({ title: "Audience Alignment", body: `Primary audience is ${topAge.range} (${topAge.pct}%), with a ${data.audience.gender.male}/${data.audience.gender.female} male/female split. The 25–44 range represents ${(data.audience.age[1]?.pct || 0) + (data.audience.age[2]?.pct || 0)}% — strong patient demographic for cosmetic and restorative work — and New York City alone accounts for 55% of recent viewers, a tightly local, high-intent base.`, severity: "success" });

  if (data.kpi.followers.change != null && data.kpi.followers.change < 5) {
    opportunities.push({ title: "Follower Conversion Lag", body: `Net +${data.kpi.followers.change} this week (4 follows, 3 unfollows). With ${data.viewerSplit.nonFollowers}% of views from non-followers and reach up +49%, the discovery is there — pinned content, a bio CTA refresh, and follow prompts on Story covers would capture more of it.`, severity: "warning" });
  }

  recommendations.push(
    { text: "Lean into Stories as the discovery engine — the behind-the-scenes / Dr. Tamay story hit 83% non-followers and drove the +49% reach week. Build a recurring BTS / provider-spotlight Story cadence", priority: "high" },
    { text: "Rebuild Reel cadence — zero Reels shipped this week, yet the format still pulls 24% of views from a thin back catalog. Aim for 2–3/week so reach compounds instead of resetting with each expiring Story", priority: "high" },
    { text: "Convert reach into action — external link taps fell to 2 (−33.3%) despite +49% reach. Add a booking-link sticker to high-reach Stories and refresh the bio CTA", priority: "high" },
    { text: "Replicate the 'nerve pain after onlay' template — 53 clicks at position 6.2, the one page outranking brand terms. Build 5+ procedure-question articles to expand non-brand SEO", priority: "medium" },
    { text: "Add save-prompt CTAs to carousels: 'Save this before you book' — saves stayed at 0 on owned content", priority: "medium" },
    { text: "Investigate the 'appen-stonecoal3' website referral (15 sessions / 6.3% this week) — looks like referral spam; confirm before it skews source reporting", priority: "low" },
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
    period: "June 8 – June 16, 2026",
    totalClicks: 50,
    topLinks: [
      { path: "Website", clicks: 15 },
      { path: "NYCDS 60th Street", clicks: 15 },
      { path: "Homepage", clicks: 5 },
      { path: "NYCDS 35th Street", clicks: 5 },
      { path: "NYCDS 58th Street", clicks: 5 },
      { path: "NYCDS 5th Ave", clicks: 5 },
    ],
    trafficSources: [
      { source: "Website (Locations)", clicks: 14 },
      { source: "Direct / Unknown", clicks: 48 },
    ],
    topCountries: [
      { country: "United States", clicks: 58 },
      { country: "Netherlands", clicks: 9 },
      { country: "Japan", clicks: 3 },
      { country: "Other", clicks: 9 },
    ],
    topCities: [
      { city: "New York City", clicks: 5 },
      { city: "London", clicks: 3 },
      { city: "Tokyo", clicks: 3 },
    ],
    devices: [
      { os: "Windows", clicks: 33 },
      { os: "Android", clicks: 18 },
      { os: "Mac OS X", clicks: 15 },
      { os: "iOS", clicks: 10 },
    ],
  };
  const linkData30d = {
    period: "May 16 – June 16, 2026",
    totalClicks: 201,
    topLinks: [
      { path: "NYCDS 60th Street", clicks: 48 },
      { path: "NYCDS 58th Street", clicks: 39 },
      { path: "NYCDS 35th Street", clicks: 36 },
      { path: "Homepage", clicks: 28 },
      { path: "Website", clicks: 26 },
      { path: "NYCDS 5th Ave", clicks: 24 },
    ],
    trafficSources: [
      { source: "Website (Locations)", clicks: 72 },
      { source: "Direct / Unknown", clicks: 266 },
      { source: "Email", clicks: 1 },
    ],
    topCountries: [
      { country: "United States", clicks: 322 },
      { country: "Netherlands", clicks: 23 },
      { country: "Sweden", clicks: 13 },
      { country: "Other", clicks: 18 },
    ],
    topCities: [
      { city: "New York City", clicks: 21 },
      { city: "Brooklyn", clicks: 5 },
      { city: "London", clicks: 3 },
      { city: "Vienna", clicks: 2 },
    ],
    devices: [
      { os: "Windows", clicks: 124 },
      { os: "Mac OS X", clicks: 117 },
      { os: "Android", clicks: 65 },
      { os: "iOS", clicks: 47 },
    ],
  };
  const linkData = timeRange === "7d" ? linkData7d : linkData30d;

  const websiteData7d = {
    period: "June 8 – June 14, 2026",
    sessions: 238,
    topPages: [
      { page: "/", label: "Home", views: 161 },
      { page: "/ourdoctors", label: "Our Doctors", views: 20 },
      { page: "/dr-laura-koo-min-chee", label: "Dr. Laura Koo Min Chee", views: 8 },
      { page: "/nerve-pain-after-onlay", label: "Nerve Pain After Onlay", views: 7 },
      { page: "/3d-cone-beam-cbct", label: "3D Cone Beam CBCT", views: 6 },
      { page: "/dr-michael-chesner", label: "Dr. Michael Chesner", views: 6 },
      { page: "/about", label: "About", views: 5 },
      { page: "/locations", label: "Locations", views: 5 },
      { page: "/implant-dentistry", label: "Implant Dentistry", views: 4 },
    ],
    trafficSources: [
      { source: "Direct", sessions: 135, pct: 56.7 },
      { source: "Google", sessions: 77, pct: 32.4 },
      { source: "appen-stonecoal3 (ref)", sessions: 15, pct: 6.3 },
      { source: "Instagram", sessions: 4, pct: 1.7 },
      { source: "Bing", sessions: 2, pct: 0.8 },
      { source: "Other", sessions: 5, pct: 2.1 },
    ],
    devices: [
      { device: "Desktop", pct: 83.1 },
      { device: "Mobile", pct: 16.4 },
    ],
    dailyVisitors: [
      { date: "Jun 8", visitors: 24 },{ date: "Jun 9", visitors: 30 },
      { date: "Jun 10", visitors: 35 },{ date: "Jun 11", visitors: 30 },
      { date: "Jun 12", visitors: 32 },{ date: "Jun 13", visitors: 20 },
      { date: "Jun 14", visitors: 14 },
    ],
    search: {
      totalClicks: 279, totalImpressions: 16366, avgCTR: 1.70, avgPosition: 33.8,
      note: "30-day (May 15 – Jun 13)",
      topQueries: [
        { query: "nyc dental smiles", clicks: 33, ctr: 56.90, position: 1.26 },
        { query: "nyc dental smile team", clicks: 4, ctr: 17.39, position: 5.00 },
        { query: "dr farahani dentist", clicks: 4, ctr: 33.33, position: 3.75 },
        { query: "dr michael chesner", clicks: 3, ctr: 10.71, position: 5.14 },
        { query: "pain after onlay", clicks: 2, ctr: 13.33, position: 3.80 },
      ],
      topPages: [
        { page: "Homepage", clicks: 109, impressions: 8984, ctr: 1.21 },
        { page: "Our Doctors", clicks: 72, impressions: 2776, ctr: 2.59 },
        { page: "Nerve Pain After Onlay", clicks: 53, impressions: 2332, ctr: 2.27 },
        { page: "Dr. Michael Chesner", clicks: 25, impressions: 335, ctr: 7.46 },
      ],
    },
  };
  const websiteData30d = {
    period: "May 16 – June 14, 2026",
    sessions: 712,
    topPages: [
      { page: "/", label: "Home", views: 558 },
      { page: "/ourdoctors", label: "Our Doctors", views: 142 },
      { page: "/locations", label: "Locations", views: 37 },
      { page: "/services", label: "Services", views: 33 },
      { page: "/dr-laura-koo-min-chee", label: "Dr. Laura Koo Min Chee", views: 22 },
      { page: "/dr-michael-chesner", label: "Dr. Michael Chesner", views: 22 },
      { page: "/about", label: "About", views: 21 },
      { page: "/comprehensive-care", label: "Comprehensive Care", views: 20 },
      { page: "/why-nycds", label: "Why NYCDS", views: 18 },
    ],
    trafficSources: [
      { source: "Direct", sessions: 399, pct: 56.0 },
      { source: "Google", sessions: 245, pct: 34.4 },
      { source: "appen-stonecoal3 (ref)", sessions: 15, pct: 2.1 },
      { source: "Bing", sessions: 12, pct: 1.7 },
      { source: "Figment Creative", sessions: 11, pct: 1.5 },
      { source: "Instagram", sessions: 8, pct: 1.1 },
      { source: "Other", sessions: 22, pct: 3.2 },
    ],
    devices: [
      { device: "Desktop", pct: 78.6 },
      { device: "Mobile", pct: 21.0 },
    ],
    dailyVisitors: [
      { date: "May 16", visitors: 8 },{ date: "May 20", visitors: 18 },
      { date: "May 24", visitors: 13 },{ date: "May 28", visitors: 22 },
      { date: "Jun 1", visitors: 14 },{ date: "Jun 5", visitors: 18 },
      { date: "Jun 9", visitors: 30 },{ date: "Jun 11", visitors: 35 },
      { date: "Jun 13", visitors: 16 },
    ],
    search: {
      totalClicks: 279, totalImpressions: 16366, avgCTR: 1.70, avgPosition: 33.8,
      note: "30-day (May 15 – Jun 13)",
      topQueries: [
        { query: "nyc dental smiles", clicks: 33, ctr: 56.90, position: 1.26 },
        { query: "nyc dental smile team", clicks: 4, ctr: 17.39, position: 5.00 },
        { query: "dr farahani dentist", clicks: 4, ctr: 33.33, position: 3.75 },
        { query: "dr michael chesner", clicks: 3, ctr: 10.71, position: 5.14 },
        { query: "pain after onlay", clicks: 2, ctr: 13.33, position: 3.80 },
      ],
      topPages: [
        { page: "Homepage", clicks: 109, impressions: 8984, ctr: 1.21 },
        { page: "Our Doctors", clicks: 72, impressions: 2776, ctr: 2.59 },
        { page: "Nerve Pain After Onlay", clicks: 53, impressions: 2332, ctr: 2.27 },
        { page: "Dr. Michael Chesner", clicks: 25, impressions: 335, ctr: 7.46 },
      ],
    },
  };
  const websiteData = timeRange === "7d" ? websiteData7d : websiteData30d;

  const socialData7d = {
    period: "June 8 – June 14, 2026",
    followers: 690,
    followerGrowth: 1,
    follows: 4,
    unfollows: 3,
    totalViews: 1549,
    totalReach: 540,
    reachChange: 49.2,
    totalInteractions: 43,
    viewSplit: { followers: 39.5, nonFollowers: 60.5 },
    engagementSplit: { followers: 79.5, nonFollowers: 20.5 },
    viewsByType: { reels: 23.8, posts: 19.2, stories: 57.1 },
    interactionsByType: { reels: 35.9, posts: 28.2, stories: 35.9 },
    totalLikes: 11,
    totalComments: 0,
    totalSaves: 0,
    totalShares: 4,
    storyViews: 759, storyCompletion: 91, storyCount: 3,
    reelAvgWatchTime: "n/a", reelSkipRate: "n/a",
    dailyViews: [
      { date: "Jun 8", views: 90 },{ date: "Jun 9", views: 170 },
      { date: "Jun 10", views: 240 },{ date: "Jun 11", views: 580 },
      { date: "Jun 12", views: 200 },{ date: "Jun 13", views: 150 },
      { date: "Jun 14", views: 119 },
    ],
    posts: [
      { id: 1, title: "Behind the Scenes — Dr. Maria Tamay", type: "Story", date: "Jun 11", views: 610, reach: 440, likes: 3, comments: 0, saves: 0, shares: 1, er: 0.9, skipRate: 0, avgWatch: "—", igUrl: "", isTop: true },
      { id: 2, title: "A More Advanced Way — AI-Assisted Imaging", type: "Post", date: "Jun 11", views: 155, reach: 64, likes: 6, comments: 0, saves: 0, shares: 3, er: 14.1, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/p/DZcplDQRa9i/", isTop: false },
      { id: 3, title: "Your Toothpaste Matters", type: "Carousel", date: "Jun 12", views: 62, reach: 26, likes: 2, comments: 0, saves: 0, shares: 0, er: 7.7, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/p/DZfeQ-ulkNI/", isTop: false },
    ],
  };
  const socialData30d = {
    period: "May 15 – June 15, 2026",
    followers: 690,
    followerGrowth: 8,
    follows: 12,
    unfollows: 4,
    totalViews: 3689,
    totalReach: 2270,
    reachChange: 0,
    totalInteractions: 83,
    viewSplit: { followers: 42, nonFollowers: 58 },
    engagementSplit: { followers: 70, nonFollowers: 30 },
    viewsByType: { reels: 40, posts: 26, stories: 34 },
    interactionsByType: { reels: 60, posts: 33, stories: 7 },
    totalLikes: 78,
    totalComments: 7,
    totalSaves: 0,
    totalShares: 10,
    storyViews: 1241, storyCompletion: 82, storyCount: 13,
    reelAvgWatchTime: "4–11s",
    reelSkipRate: "56–63%",
    dailyViews: [
      { date: "May 15", views: 172 },{ date: "May 19", views: 387 },
      { date: "May 21", views: 183 },{ date: "May 28", views: 444 },
      { date: "May 30", views: 350 },{ date: "Jun 3", views: 301 },
      { date: "Jun 9", views: 170 },{ date: "Jun 11", views: 580 },
    ],
    posts: [
      { id: 1, title: "A Quick Chat with Dr. Ben", type: "Reel", date: "May 28", views: 444, reach: 287, likes: 11, comments: 2, saves: 0, shares: 0, er: 4.5, skipRate: 57, avgWatch: "—", igUrl: "https://www.instagram.com/reel/DY5V90Nx1bh/", isTop: true },
      { id: 2, title: "Precision in Every Case — Dr. Farahani", type: "Reel", date: "May 19", views: 387, reach: 259, likes: 17, comments: 1, saves: 0, shares: 0, er: 6.9, skipRate: 63, avgWatch: "—", igUrl: "https://www.instagram.com/reel/DYh5JrWRTzl/", isTop: false },
      { id: 3, title: "Come With Me to My Appointment", type: "Reel", date: "May 30", views: 350, reach: 192, likes: 8, comments: 1, saves: 0, shares: 1, er: 5.2, skipRate: 56, avgWatch: "—", igUrl: "https://www.instagram.com/reel/DY98lsXJRwu/", isTop: false },
      { id: 4, title: "What X-Rays Don’t Tell You — Dr. Tamay", type: "Reel", date: "Jun 3", views: 301, reach: 221, likes: 8, comments: 1, saves: 0, shares: 0, er: 4.1, skipRate: 63, avgWatch: "—", igUrl: "https://www.instagram.com/reel/DZIvPDcJY03/", isTop: false },
      { id: 5, title: "A More Advanced Way — AI-Assisted Imaging", type: "Post", date: "Jun 11", views: 155, reach: 64, likes: 6, comments: 0, saves: 0, shares: 3, er: 14.1, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/p/DZcplDQRa9i/", isTop: false },
    ],
  };
  const socialData = timeRange === "7d" ? socialData7d : socialData30d;
  const overviewKpis = timeRange === "7d" ? [
    { label: "Followers", value: 690, change: "+1", delay: 0 },
    { label: "Views", value: 1549, delay: 80 },
    { label: "Reach", value: 540, change: "+49.2%", delay: 160 },
    { label: "Interactions", value: 43, delay: 240 },
    { label: "Non-Follower", value: "60.5%", delay: 320 },
  ] : [
    { label: "Followers", value: 690, change: "+1", delay: 0 },
    { label: "Views", value: 3689, delay: 80 },
    { label: "Reach", value: 2270, delay: 160 },
    { label: "Interactions", value: 83, delay: 240 },
    { label: "Non-Follower", value: "~58%", delay: 320 },
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
            <div><div className="exec-col-title">Discovery</div><div className="exec-col-body">{d.viewerSplit.nonFollowers}% of views came from non-followers and reach <em>grew +49.2%</em> to 540 accounts — all of it organic, with no new Reels and no collaborations this week. Stories carried the week (57% of all views), led by the behind-the-scenes / Dr. Maria Tamay story (610 views, 440 reach, 83.1% non-followers). Account views normalized to 1,549 after last week&rsquo;s collab-inflated 3,410, but the underlying reach growth is the healthier signal.</div></div>
            <div><div className="exec-col-title">Engagement</div><div className="exec-col-body">43 account interactions, ~8.0% engagement rate (43 &divide; 540 reach) — above the 5% healthcare benchmark, though 79.5% came from existing followers. Interactions split evenly across Stories, Reels and Posts (36 / 36 / 28). The top-engaging owned post was the AI-imaging photo (9 interactions on 64 reach = 14.1%). Followers +1 net (4 follows, 3 unfollows). Profile visits 66 (+13.8%), but external link taps fell to 2 (&minus;33.3%) — conversion is the gap. 25&ndash;44 demo = 59%.</div></div>
            <div><div className="exec-col-title">Content</div><div className="exec-col-body">Stories led views at {d.contentMix.stories}%, Reels {d.contentMix.reels}%, Posts {d.contentMix.posts}%. No new Reels were published — the 24% still coming from Reels is residual back-catalog. GSC 30d: 279 clicks at pos ~34; brand-search heavy, but the nerve-pain page (53 clicks, pos 6.2) outranks every brand page. Mobile ranks ~2.3&times; better than desktop on Google — the SEO lever.</div></div>
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
          <div style={{ margin: "2px 0 16px", padding: "11px 16px", background: "rgba(143,161,166,0.10)", borderRadius: 10, border: "1px solid rgba(143,161,166,0.30)" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ No Reels and no collaborations this week — yet reach grew +49.2% to 540 accounts. Stories carried discovery (57% of views), led by the behind-the-scenes / Dr. Maria Tamay story at 610 views and 83.1% non-follower reach. Feed posts held a steady baseline.</span>
          </div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Watch Time Analytics</div><div style={{ textAlign: "center", padding: "8px 0 22px" }}><div className="big-num">{typeof d.kpi.watchTime.value === "string" ? d.kpi.watchTime.value.replace(/\s*\d+s$/, "") : d.kpi.watchTime.value}</div><div style={{ fontSize: 12, color: "#9B9196", marginTop: 2 }}>Total Watch Time</div></div><div style={{ display: "flex", gap: 14 }}><div className="stat-box"><div className="big-num-sm plum">—</div><div className="stat-label">Avg Duration</div></div><div className="stat-box"><div className="big-num-sm steel">{d.kpi.views.value.toLocaleString()}</div><div className="stat-label">Total Views</div></div></div><div className="alert-box plum-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>✦ No Reels published this week — Stories drove 57% of views and 60.5% non-follower reach. Watch-time metrics resume when Reel publishing does.</span></div></div>
            <div className="card"><div className="card-hd">Engagement Breakdown</div><div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{[{ label: "Likes", value: d.posts.reduce((s: number, p: any) => s + (p.likes||0), 0), max: 15, color: "#6F5060" }, { label: "Comments", value: d.posts.reduce((s: number, p: any) => s + (p.comments||0), 0), max: 15, color: "#8FA1A6" }, { label: "Shares", value: d.posts.reduce((s: number, p: any) => s + (p.shares||0), 0), max: 15, color: "#A6968D" }, { label: "Saves", value: d.posts.reduce((s: number, p: any) => s + (p.saves||0), 0), max: 15, color: "#BE5A5A" }].map((m) => (<div key={m.label} style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 72, fontSize: 13, fontWeight: 500 }}>{m.label}</div><div style={{ flex: 1, height: 10, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}><div style={{ width: `${(Math.max(m.value, 0.5) / m.max) * 100}%`, height: "100%", background: m.color, borderRadius: 99, transition: "width 1.2s ease" }} /></div><div className="display-num" style={{ width: 30, textAlign: "right" as const }}>{m.value}</div></div>))}</div><div className="alert-box danger-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#BE5A5A" }}>▲ 15 interactions across owned posts this week (11 likes, 4 shares, 0 saves). Saves remain the weakest signal — carousels and explainers need &ldquo;Save this before you book&rdquo; CTAs to bank the reach Stories are generating.</span></div></div>
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
            <InsightCard title={"Link Attribution · " + linkData.period} body={timeRange === "7d" ? "50 attributed human clicks over 7 days across the named location links — the /* wildcard (16), LinkedIn/FB/IG, and data-center/bot traffic excluded. Website and 60th Street tied at 15, with the other three offices and the Homepage at 5 each. Click activity peaked Jun 10–11 (19 + 34) — aligning with the BTS story and AI-imaging post. US dominates; Linux/data-center clicks filtered out. No DDS-PC links appeared in the NYCDS export this cycle." : "201 attributed human clicks over 30 days across the four office links plus Website and Homepage. 60th Street (48), 58th Street (39), 35th Street (36) and 5th Ave (24) spread evenly — all four locations active. Website UTM drove 72 clicks; NYC (21) and Brooklyn (5) lead human cities. /* wildcard (180), LinkedIn/FB/IG and bot traffic excluded. No DDS-PC links present this cycle, so nothing merged to EEC."} severity="info" />
          </div>
        </>)}

        {tab === "website" && (<>
          <div className="kpi-row">
            {[
              { label: "Total Sessions", value: websiteData.sessions, delay: 0 },
              { label: "Page Views", value: websiteData.topPages.reduce((s, p) => s + p.views, 0), delay: 80 },
              { label: "Top Source", value: "Direct (56%)", delay: 160 },
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
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>✦ Desktop-heavy traffic (79%) — optimize for desktop conversion</span>
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
            <InsightCard title={"Website + Search · " + websiteData.period} body={timeRange === "7d" ? "238 sessions over 7 days (~34/day). Direct leads at 56.7% (135), Google 32.4% (77). A referral spike from 'appen-stonecoal3…' added 15 sessions (6.3%) — likely referral spam, worth confirming before it skews source reporting. Desktop 83.1% / Mobile 16.4%. GSC (30d): 279 clicks, 1.70% CTR, avg position ~34 — brand and doctor queries dominate, with the nerve-pain page the standout non-brand asset." : "712 sessions over 30 days. Direct 56.0% (399) and Google 34.4% (245) carry ~90% of traffic combined. Desktop 78.6% / Mobile 21.0%. GSC 30d: 279 clicks, 1.70% CTR, pos ~34. The Nerve Pain After Onlay page = 53 clicks at pos 6.2 — the non-brand SEO win to replicate across procedure-question articles."} severity="info" />
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
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>⚡ Stories drove the week — account views concentrated Jun 9–11 as the behind-the-scenes / Dr. Tamay story and the AI-imaging post landed. Reach grew +49.2% to 540 accounts with zero new Reels. (Daily shape modeled from posting cadence — native daily-views export pending.)</span>
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
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Stories led views (57%) this week with no Reels published; interactions split evenly across Stories, Reels and Posts (36 / 36 / 28)</span>
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
                <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>▲ No Reels published this week — Stories carried discovery. The 24% of views still coming from Reels is residual back-catalog; rebuilding a 2–3/week cadence is the lever (watch-time and skip-rate resume then).</span>
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
                <div style={{ fontSize: 36, fontWeight: 700, color: "#6F5060" }}>0.06%</div>
                <div style={{ fontSize: 12, color: "#9B9196", marginTop: 4 }}>Views → Follower Conversion</div>
              </div>
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(143,161,166,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#8FA1A6" }}>1,549</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>views</div>
                </div>
                <div style={{ flex: 0, display: "flex", alignItems: "center", fontSize: 16, color: "#D9CCC1" }}>→</div>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(143,161,166,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#8FA1A6" }}>540</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>reached</div>
                </div>
                <div style={{ flex: 0, display: "flex", alignItems: "center", fontSize: 16, color: "#D9CCC1" }}>→</div>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(111,80,96,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#6F5060" }}>+1</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>followers</div>
                </div>
              </div>
              <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(111,80,96,0.10)", borderRadius: 10, border: "1px solid rgba(111,80,96,0.25)" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>▲ Reach grew +49% but only +1 net follow and 2 link taps — converting discovery into action is the gap. Add booking-CTA stickers to high-reach Stories.</span>
              </div>
            </div>
          </div>

          <div className="card">
            <InsightCard title={"Social Intelligence · " + socialData.period} body={timeRange === "7d" ? "1,549 account views with reach up +49.2% to 540 accounts — and zero new Reels or collaborations. Stories carried it (57% of views), led by the behind-the-scenes / Dr. Maria Tamay story (610 views, 440 reach, 83.1% non-followers). 43 interactions, engagement rate 8.0% (43 ÷ 540), above the 5% benchmark but 79.5% from existing followers. 60.5% of views came from non-followers. Followers +1 net (4 follows, 3 unfollows); profile visits 66 (+13.8%) but external link taps fell to 2 (−33.3%)." : "Derived from content exports — native 30-day account-level Insights were held this cycle. Across the May 15 – Jun 15 window NYCDS published 4 Reels, 6 feed posts and 13 Stories. 'A Quick Chat with Dr. Ben' (444 views) and the May 19 Dr. Farahani Reel (387 views, 6.9% ER) led; reel skip rates ran 56–63%. The month leans on a thin Reel back-catalog — rebuilding cadence is the lever. Account totals shown are content-derived estimates."} severity="info" />
            <InsightCard title="Key Insight" body="The story this week is organic reach growth: +49.2% to 540 accounts with no Reels and no collaborations, driven almost entirely by Stories. The behind-the-scenes / Dr. Tamay story was the engine — 610 views and 83.1% non-follower reach. What's working: Stories as a discovery format and steady feed cadence. What's not: that discovery isn't converting — external link taps fell to 2 (−33.3%) and net follows were just +1 despite 60.5% non-follower views. Two levers: (1) add booking-CTA stickers to high-reach Stories to capture the traffic that's already arriving, and (2) rebuild a 2–3 Reel/week cadence — zero shipped this week, and Reel reach doesn't expire the way Stories do." severity="success" />
          </div>
        </>)}

        {tab === "audience" && (<>
          <div className="cols2">
            <div className="card"><div className="card-hd">Gender Split</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.audience.gender.male }, { value: d.audience.gender.female }]} colors={["#6F5060", "#8FA1A6"]} size={130} stroke={20} /><div style={{ flex: 1 }}>{[{ label: "Male", value: d.audience.gender.male, color: "#6F5060" }, { label: "Female", value: d.audience.gender.female, color: "#8FA1A6" }].map((g) => (<div key={g.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}><div style={{ width: 12, height: 12, borderRadius: 4, background: g.color }} /><span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{g.label}</span><span className="display-num-lg">{g.value}%</span></div>))}</div></div></div>
            <div className="card"><div className="card-hd">Age Distribution</div>{d.audience.age.map((a) => (<div key={a.range} className="age-row"><div className="age-label">{a.range}</div><div className="age-track"><div className="age-fill" style={{ width: `${(a.pct / 36) * 100}%`, background: a.pct >= 28 ? "#6F5060" : a.pct >= 20 ? "#8FA1A6" : "#A6968D" }} /></div><div className="age-pct">{a.pct}%</div></div>))}</div>
          </div>
          <div className="card"><div className="card-hd">Audience Intelligence</div>
            <InsightCard title="Core Patient Demographic" body="59% of the audience falls in the 25–44 age range (30% aged 25–34, 29% aged 35–44) — the prime demographic for general, cosmetic and restorative dentistry. Gender is balanced at 52/48 male/female, and New York City alone accounts for 55% of recent viewers — a tightly local, high-intent base. This is the highest lifetime-value segment for NYC Dental Smiles." severity="success" />
            <InsightCard title="Geography Is the Edge" body="At 55% of recent views, New York City dwarfs every other market (Chicago, Philadelphia and Hoboken trail at ~1% each). The follower base is balanced at 52% male / 48% female. Local intent is the asset — geo-specific Story CTAs, location-tagged content, and office-specific booking links convert this audience better than broad reach plays." severity="info" />
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
