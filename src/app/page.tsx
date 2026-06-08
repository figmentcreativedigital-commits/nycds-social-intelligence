"use client";
import { useState, useEffect } from "react";

const FALLBACK_DATA = {
  client: { name: "NYCDS", fullName: "NYC Dental Smiles", period: "June 1 – June 8, 2026" },
  kpi: {
    followers: { value: 690, change: 8, label: "Followers" },
    reach: { value: 362, label: "Reach" },
    views: { value: 3410, label: "Total Views" },
    engagementRate: { value: 51.9, label: "Engagement Rate", suffix: "%" },
    engagements: { value: 188, label: "Engagements" },
    watchTime: { value: "—", label: "Watch Time" },
  },
  posts: [
    { id: 1, title: "Authenticity in Dentistry · Collab w/ Dr. El Chaar", type: "Reel", views: 3300, reach: "—", likes: 0, comments: 0, saves: 0, shares: 0, isTop: true, isCollab: true, igPostUrl: "https://www.instagram.com/reel/DZK-h6ZAO_d/" },
    { id: 2, title: "Is Dentistry Losing Its Soul? · Collab w/ Dr. El Chaar", type: "Reel", views: 1400, reach: "—", likes: 0, comments: 0, saves: 0, shares: 0, isTop: false, isCollab: true, igPostUrl: "https://www.instagram.com/reel/DZOF7qTBswB/" },
    { id: 3, title: "What X-Rays Don’t Show You — Dr. Tamay", type: "Reel", views: 286, reach: 214, likes: 5, comments: 1, saves: 0, shares: 0, isTop: false, igPostUrl: "" },
  ] as any[],
  contentMix: { posts: 4, reels: 88, stories: 8 },
  audience: {
    gender: { male: 52, female: 48 },
    age: [
      { range: "18-24", pct: 6 }, { range: "25-34", pct: 30 }, { range: "35-44", pct: 29 },
      { range: "45-54", pct: 21 }, { range: "55-64", pct: 10 }, { range: "65+", pct: 4 },
    ],
  },
  viewerSplit: { followers: 27, nonFollowers: 73 },
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
    opportunities.push({ title: "Views Surged on Collab Reels — Reach Still Rebuilding", body: `Account views jumped to ${data.kpi.views.value.toLocaleString()} (from 1,327) on the back of two collaboration Reels with Dr. El Chaar — "Authenticity in Dentistry" (3.3K) and "Is Dentistry Losing Its Soul?" (1.4K). Reach itself dipped to ${reach} accounts (−26.9%): because NYCDS is a tagged co-author on those Reels, Instagram credits the account with the views and interactions but only a fraction of the reach. ${data.viewerSplit.nonFollowers}% of views came from non-followers — discovery is wide. The lever is converting that borrowed reach into NYCDS follows and rebuilding owned-content cadence.`, severity: "success" });
  }
  if (er >= 8) {
    insights.push({ title: "Engagement Rate Inflated by Collab Attribution", body: `Engagement rate computes to ${er}% (188 interactions ÷ 362 reach), but read it with caution this cycle. The collaboration Reels drove most of the 188 interactions while NYCDS was credited with only a sliver of their reach, shrinking the denominator. Treat it as a signal the collab content is resonating, not as a true content-engagement rate — NYCDS's own Jun 3 Reel ran a more representative 2.8% on 214 reach.`, severity: "info" });
  }
  const sorted = [
    { name: "Reels", val: data.contentMix.reels },
    { name: "Posts", val: data.contentMix.posts },
    { name: "Stories", val: data.contentMix.stories },
  ].sort((a, b) => b.val - a.val);
  insights.push({ title: "Content Format Distribution", body: `${sorted[0].name} lead at ${sorted[0].val}% of views, ${sorted[1].name} ${sorted[1].val}%, ${sorted[2].name} ${sorted[2].val}%. Reels drove 84% of interactions — overwhelmingly the discovery engine this cycle, led by the two Dr. El Chaar collaboration Reels. NYCDS's own Jun 3 explainer Reel held a modest 286 views; the 30-day window is still anchored by the May 12 implants Reel at 1,768.`, severity: "info" });

  const totalSaves = data.posts.reduce((s: number, p: any) => s + (p.saves || 0), 0);
  if (totalSaves < 2) {
    opportunities.push({ title: "Saves Remain the Weak Lever", body: `${totalSaves} saves across the week's owned content. Saves are the highest-weighted action in Meta's ranking. The collab Reels prove the audience will engage — the next step is reference-worthy owned posts (procedure explainers, before/after carousels) with a 'Save this before you book' CTA on the final frame.`, severity: "warning" });
  }

  if (data.viewerSplit.nonFollowers >= 45) {
    opportunities.push({ title: "Discovery Wide Open", body: `${data.viewerSplit.nonFollowers}% of viewers are non-followers — the widest discovery skew in months, fueled by the collab Reels reaching well beyond the follower set. The algorithm is pushing this content out; profile CTAs and follow prompts on Reel cover frames are the lever to convert these discoverers into followers and patients.`, severity: "success" });
  }

  insights.push({ title: "Brand-Search Dependency on Google", body: `Most Search Console clicks are brand/name terms (nyc dental smiles 31, dr farahani, michael chesner). The standout non-brand asset — the 'nerve pain after onlay' page — drew 48 clicks at position 6.3 over 28 days, ranking far better than the brand pages. That one page is the blueprint for non-brand growth; replicate the template across 5–10 procedure questions.`, severity: "info" });

  insights.push({ title: "Mobile Outranks Desktop on Google", body: "GSC: Mobile ranks at position 16.7 vs Desktop at 41.4 — a ~2.5× ranking gap on the same content, with mobile converting at 3.2% CTR vs 1.3% on desktop. Mobile experience is the strongest SEO lever right now. Audit mobile Core Web Vitals and keep CTAs thumb-reachable above the fold.", severity: "info" });

  const topAge = data.audience.age.reduce((a, b) => (a.pct > b.pct ? a : b));
  insights.push({ title: "Audience Alignment", body: `Primary audience is ${topAge.range} (${topAge.pct}%), with a ${data.audience.gender.male}/${data.audience.gender.female} male/female split. The 25–44 range represents ${(data.audience.age[1]?.pct || 0) + (data.audience.age[2]?.pct || 0)}% — strong patient demographic for cosmetic and restorative work.`, severity: "success" });

  if (data.kpi.followers.change != null && data.kpi.followers.change < 5) {
    opportunities.push({ title: "Follower Conversion Lag", body: `Net +${data.kpi.followers.change} this week (9 follows, 1 unfollow). With ${data.viewerSplit.nonFollowers}% of views from non-followers, pinned content and a bio CTA refresh would capture more of the discovery that's already arriving.`, severity: "warning" });
  }

  recommendations.push(
    { text: "Double down on the Dr. El Chaar collaboration-Reel format — the Jun 4/5 co-posted Reels (3.3K + 1.4K views) were the account's biggest week in months; line up the next two", priority: "high" },
    { text: "Convert the borrowed reach into follows: 73% of views were non-followers this week. Add follow prompts on Reel cover frames and pin a collab Reel to the profile", priority: "high" },
    { text: "Rebuild owned-content cadence — only one NYCDS-originated Reel published this week (Jun 3). Aim for 2–3/week so account reach isn't dependent on collab posts", priority: "high" },
    { text: "Replicate the 'nerve pain after onlay' template — 5+ procedure-question articles to expand non-brand SEO (it's the one page outranking brand terms at 48 clicks)", priority: "medium" },
    { text: "Add save-prompt CTAs to carousels: 'Save this before you book' — saves stayed at 0 on owned content", priority: "medium" },
    { text: "Track the ChatGPT referral source (2 sessions / 30d); ensure the homepage is parseable for AI overviews", priority: "low" },
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
    period: "June 1 – June 9, 2026",
    totalClicks: 44,
    topLinks: [
      { path: "NYCDS 58th Street", clicks: 12 },
      { path: "Website", clicks: 11 },
      { path: "NYCDS 60th Street", clicks: 8 },
      { path: "Homepage", clicks: 5 },
      { path: "NYCDS 35th Street", clicks: 4 },
      { path: "NYCDS 5th Ave", clicks: 4 },
    ],
    trafficSources: [
      { source: "Website (Locations)", clicks: 22 },
      { source: "Direct / Unknown", clicks: 41 },
    ],
    topCountries: [
      { country: "United States", clicks: 60 },
      { country: "Sweden", clicks: 1 },
      { country: "Other", clicks: 2 },
    ],
    topCities: [
      { city: "New York City", clicks: 7 },
      { city: "Brooklyn", clicks: 5 },
      { city: "Chicago", clicks: 3 },
    ],
    devices: [
      { os: "Mac OS X", clicks: 21 },
      { os: "Windows", clicks: 21 },
      { os: "iOS", clicks: 13 },
      { os: "Android", clicks: 4 },
    ],
  };
  const linkData30d = {
    period: "May 9 – June 9, 2026",
    totalClicks: 258,
    topLinks: [
      { path: "NYCDS 58th Street", clicks: 64 },
      { path: "NYCDS 5th Ave", clicks: 54 },
      { path: "NYCDS 35th Street", clicks: 53 },
      { path: "NYCDS 60th Street", clicks: 44 },
      { path: "Homepage", clicks: 31 },
      { path: "Website", clicks: 12 },
    ],
    trafficSources: [
      { source: "Website (Locations)", clicks: 116 },
      { source: "Direct / Unknown", clicks: 327 },
      { source: "Search", clicks: 2 },
    ],
    topCountries: [
      { country: "United States", clicks: 431 },
      { country: "Sweden", clicks: 26 },
      { country: "United Kingdom", clicks: 10 },
      { country: "Other", clicks: 30 },
    ],
    topCities: [
      { city: "New York City", clicks: 24 },
      { city: "Brooklyn", clicks: 9 },
      { city: "North Bergen", clicks: 5 },
      { city: "Secaucus", clicks: 5 },
    ],
    devices: [
      { os: "Windows", clicks: 173 },
      { os: "Mac OS X", clicks: 147 },
      { os: "Android", clicks: 60 },
      { os: "iOS", clicks: 59 },
    ],
  };
  const linkData = timeRange === "7d" ? linkData7d : linkData30d;

  const websiteData7d = {
    period: "June 1 – June 7, 2026",
    sessions: 162,
    topPages: [
      { page: "/", label: "Home", views: 140 },
      { page: "/ourdoctors", label: "Our Doctors", views: 40 },
      { page: "/comprehensive-care", label: "Comprehensive Care", views: 13 },
      { page: "/prosthodontics", label: "Prosthodontics", views: 12 },
      { page: "/about", label: "About", views: 10 },
      { page: "/services", label: "Services", views: 6 },
      { page: "/dr-james-eisdorfer", label: "Dr. James Eisdorfer", views: 4 },
      { page: "/eec-publications", label: "EEC Publications", views: 4 },
      { page: "/locations", label: "Locations", views: 4 },
    ],
    trafficSources: [
      { source: "Direct", sessions: 92, pct: 57.1 },
      { source: "Google", sessions: 50, pct: 31.1 },
      { source: "Bing", sessions: 5, pct: 3.1 },
      { source: "Figment Creative", sessions: 3, pct: 1.9 },
      { source: "Instagram", sessions: 3, pct: 1.9 },
      { source: "Other", sessions: 9, pct: 5.6 },
    ],
    devices: [
      { device: "Desktop", pct: 77.0 },
      { device: "Mobile", pct: 22.2 },
    ],
    dailyVisitors: [
      { date: "Jun 1", visitors: 16 },{ date: "Jun 2", visitors: 20 },
      { date: "Jun 3", visitors: 19 },{ date: "Jun 4", visitors: 22 },
      { date: "Jun 5", visitors: 21 },{ date: "Jun 6", visitors: 14 },
      { date: "Jun 7", visitors: 12 },
    ],
    search: {
      totalClicks: 270, totalImpressions: 14013, avgCTR: 1.93, avgPosition: 33.9,
      note: "28-day (May 10 – Jun 6)",
      topQueries: [
        { query: "nyc dental smiles", clicks: 31, ctr: 51.67, position: 1.30 },
        { query: "dr farahani dentist", clicks: 4, ctr: 44.44, position: 3.22 },
        { query: "dr michael chesner", clicks: 3, ctr: 11.54, position: 5.58 },
        { query: "michael chesner", clicks: 3, ctr: 17.65, position: 1.94 },
        { query: "dental smiles", clicks: 2, ctr: 2.41, position: 6.64 },
      ],
      topPages: [
        { page: "Homepage", clicks: 107, impressions: 7681, ctr: 1.39 },
        { page: "Our Doctors", clicks: 66, impressions: 2436, ctr: 2.71 },
        { page: "Nerve Pain After Onlay", clicks: 48, impressions: 2061, ctr: 2.33 },
        { page: "Dr. Michael Chesner", clicks: 32, impressions: 326, ctr: 9.82 },
      ],
    },
  };
  const websiteData30d = {
    period: "May 9 – June 6, 2026",
    sessions: 631,
    topPages: [
      { page: "/", label: "Home", views: 528 },
      { page: "/ourdoctors", label: "Our Doctors", views: 171 },
      { page: "/locations", label: "Locations", views: 50 },
      { page: "/services", label: "Services", views: 41 },
      { page: "/about", label: "About", views: 35 },
      { page: "/dr-michael-chesner", label: "Dr. Michael Chesner", views: 22 },
      { page: "/comprehensive-care", label: "Comprehensive Care", views: 19 },
      { page: "/dr-maria-tamay", label: "Dr. Maria Tamay", views: 19 },
      { page: "/why-nycds", label: "Why NYCDS", views: 18 },
    ],
    trafficSources: [
      { source: "Direct", sessions: 328, pct: 52.0 },
      { source: "Google", sessions: 245, pct: 38.8 },
      { source: "Bing", sessions: 12, pct: 1.9 },
      { source: "Figment Creative", sessions: 11, pct: 1.7 },
      { source: "Instagram", sessions: 8, pct: 1.3 },
      { source: "Yahoo", sessions: 6, pct: 1.0 },
      { source: "ChatGPT", sessions: 2, pct: 0.3 },
      { source: "Other", sessions: 19, pct: 3.0 },
    ],
    devices: [
      { device: "Desktop", pct: 75.6 },
      { device: "Mobile", pct: 24.2 },
    ],
    dailyVisitors: [
      { date: "May 9", visitors: 11 },{ date: "May 13", visitors: 24 },
      { date: "May 17", visitors: 7 },{ date: "May 19", visitors: 25 },
      { date: "May 23", visitors: 12 },{ date: "May 27", visitors: 23 },
      { date: "May 31", visitors: 13 },{ date: "Jun 4", visitors: 22 },
      { date: "Jun 6", visitors: 12 },
    ],
    search: {
      totalClicks: 270, totalImpressions: 14013, avgCTR: 1.93, avgPosition: 33.9,
      note: "28-day (May 10 – Jun 6)",
      topQueries: [
        { query: "nyc dental smiles", clicks: 31, ctr: 51.67, position: 1.30 },
        { query: "dr farahani dentist", clicks: 4, ctr: 44.44, position: 3.22 },
        { query: "dr michael chesner", clicks: 3, ctr: 11.54, position: 5.58 },
        { query: "michael chesner", clicks: 3, ctr: 17.65, position: 1.94 },
        { query: "dental smiles", clicks: 2, ctr: 2.41, position: 6.64 },
      ],
      topPages: [
        { page: "Homepage", clicks: 107, impressions: 7681, ctr: 1.39 },
        { page: "Our Doctors", clicks: 66, impressions: 2436, ctr: 2.71 },
        { page: "Nerve Pain After Onlay", clicks: 48, impressions: 2061, ctr: 2.33 },
        { page: "Dr. Michael Chesner", clicks: 32, impressions: 326, ctr: 9.82 },
      ],
    },
  };
  const websiteData = timeRange === "7d" ? websiteData7d : websiteData30d;

  const socialData7d = {
    period: "June 1 – June 7, 2026",
    followers: 690,
    followerGrowth: 8,
    follows: 9,
    unfollows: 1,
    totalViews: 3410,
    totalReach: 362,
    reachChange: -26.9,
    totalInteractions: 188,
    viewSplit: { followers: 26.6, nonFollowers: 73.4 },
    engagementSplit: { followers: 43.9, nonFollowers: 56.1 },
    viewsByType: { reels: 87.7, posts: 3.9, stories: 8.4 },
    interactionsByType: { reels: 84.2, posts: 2.3, stories: 13.5 },
    totalLikes: 5,
    totalComments: 1,
    totalSaves: 0,
    totalShares: 0,
    storyViews: 138, storyCompletion: 76, storyCount: 3,
    reelAvgWatchTime: "4s",
    reelSkipRate: "63%",
    dailyViews: [
      { date: "Jun 1", views: 164 },{ date: "Jun 2", views: 229 },
      { date: "Jun 3", views: 328 },{ date: "Jun 4", views: 339 },
      { date: "Jun 5", views: 2122 },{ date: "Jun 6", views: 486 },
      { date: "Jun 7", views: 329 },
    ],
    posts: [
      { id: 1, title: "What X-Rays Don’t Show You — Dr. Tamay", type: "Reel", date: "Jun 3", views: 286, reach: 214, likes: 5, comments: 1, saves: 0, shares: 0, er: 2.8, skipRate: 63, avgWatch: "4s", igUrl: "", isTop: true },
    ],
  };
  const socialData30d = {
    period: "May 8 – June 8, 2026",
    followers: 690,
    followerGrowth: 8,
    follows: 18,
    unfollows: 10,
    totalViews: 6048,
    totalReach: 3754,
    reachChange: 0,
    totalInteractions: 176,
    viewSplit: { followers: 38, nonFollowers: 62 },
    engagementSplit: { followers: 65, nonFollowers: 35 },
    viewsByType: { reels: 79, posts: 12, stories: 9 },
    interactionsByType: { reels: 80, posts: 12, stories: 8 },
    totalLikes: 164,
    totalComments: 10,
    totalSaves: 2,
    totalShares: 4,
    storyViews: 670, storyCompletion: 84, storyCount: 18,
    reelAvgWatchTime: "4–11s",
    reelSkipRate: "56–77%",
    dailyViews: [
      { date: "May 9", views: 807 },{ date: "May 10", views: 824 },
      { date: "May 14", views: 1117 },{ date: "May 15", views: 1010 },
      { date: "May 16", views: 460 },{ date: "May 29", views: 466 },
      { date: "Jun 5", views: 2122 },{ date: "Jun 6", views: 486 },
    ],
    posts: [
      { id: 1, title: "Dental Implants – Misunderstood", type: "Reel", date: "May 12", views: 1768, reach: 1103, likes: 64, comments: 1, saves: 1, shares: 0, er: 6.0, skipRate: 57, avgWatch: "10s", igUrl: "https://www.instagram.com/reel/DYP-UpfJ_26/", isTop: true },
      { id: 2, title: "Some Journeys Leave a Lasting Mark", type: "Reel", date: "May 9", views: 816, reach: 448, likes: 25, comments: 2, saves: 0, shares: 0, er: 6.0, skipRate: 61, avgWatch: "9s", igUrl: "https://www.instagram.com/reel/DYC4lmrJJOv/", isTop: false },
      { id: 3, title: "Toothbrush Still Doing Its Job?", type: "Reel", date: "May 14", views: 705, reach: 524, likes: 6, comments: 0, saves: 0, shares: 2, er: 1.1, skipRate: 74, avgWatch: "4s", igUrl: "https://www.instagram.com/reel/DYUzOKspMvg/", isTop: false },
      { id: 4, title: "A Quick Chat with Dr. Ben", type: "Reel", date: "May 28", views: 433, reach: 280, likes: 10, comments: 2, saves: 0, shares: 0, er: 4.3, skipRate: 58, avgWatch: "5s", igUrl: "https://www.instagram.com/reel/DY5V90Nx1bh/", isTop: false },
      { id: 5, title: "The Why Behind the White Coat – Dr. Laura", type: "Reel", date: "May 8", views: 392, reach: 294, likes: 8, comments: 0, saves: 0, shares: 0, er: 2.7, skipRate: 73, avgWatch: "5s", igUrl: "https://www.instagram.com/reel/DYFE8DoRapA/", isTop: false },
      { id: 6, title: "Precision in Every Case – Dr. Farahani", type: "Reel", date: "May 19", views: 385, reach: 257, likes: 17, comments: 1, saves: 0, shares: 0, er: 7.0, skipRate: 63, avgWatch: "8s", igUrl: "https://www.instagram.com/reel/DYh5JrWRTzl/", isTop: false },
      { id: 7, title: "Come With Me to My Appointment", type: "Reel", date: "May 30", views: 337, reach: 187, likes: 8, comments: 1, saves: 0, shares: 1, er: 4.8, skipRate: 56, avgWatch: "11s", igUrl: "https://www.instagram.com/reel/DY98lsXJRwu/", isTop: false },
    ],
  };
  const socialData = timeRange === "7d" ? socialData7d : socialData30d;
  const overviewKpis = timeRange === "7d" ? [
    { label: "Followers", value: 690, change: "+8", delay: 0 },
    { label: "Views", value: 3410, delay: 80 },
    { label: "Reach", value: 362, change: "−26.9%", delay: 160 },
    { label: "Interactions", value: 188, delay: 240 },
    { label: "Non-Follower", value: "73.4%", delay: 320 },
  ] : [
    { label: "Followers", value: 690, change: "+8", delay: 0 },
    { label: "Views", value: 6048, delay: 80 },
    { label: "Reach", value: 3754, delay: 160 },
    { label: "Interactions", value: 176, delay: 240 },
    { label: "Non-Follower", value: "~60%", delay: 320 },
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
            <div><div className="exec-col-title">Discovery</div><div className="exec-col-body">{d.viewerSplit.nonFollowers}% of views came from non-followers — the widest discovery skew in months, driven by two collaboration Reels with Dr. El Chaar (&ldquo;Authenticity in Dentistry&rdquo; 3.3K, &ldquo;Is Dentistry Losing Its Soul?&rdquo; 1.4K). Account views jumped to 3,410 (from 1,327). Reach itself dipped to 362 (−26.9%) — a collaborator-attribution effect, since NYCDS is credited with the Reels&rsquo; views but only a sliver of their reach.</div></div>
            <div><div className="exec-col-title">Engagement</div><div className="exec-col-body">188 account interactions (up from 40), 84% on Reels — overwhelmingly the two collab Reels. The headline ER (51.9%) is inflated by that same attribution quirk and should be read as a resonance signal, not a true rate; NYCDS&rsquo;s own Jun 3 Reel ran ~2.8%. Followers grew +8 net (9 follows / 1 unfollow). Saves stayed at 0 on owned content. 25–44 demo = 59% of audience.</div></div>
            <div><div className="exec-col-title">Content</div><div className="exec-col-body">Reels {d.contentMix.reels}% of views, Stories {d.contentMix.stories}%, Posts {d.contentMix.posts}%. Only one NYCDS-originated Reel published this week (Jun 3, 286 views); the 30d window is anchored by the May 12 implants Reel at 1,768. GSC 28d: 270 clicks at pos 34; brand-search heavy, but the nerve-pain page (48 clicks, pos 6.3) outranks every brand page. Mobile ranks ~2.5× better than desktop on Google — the SEO lever.</div></div>
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
          <div style={{ margin: "2px 0 16px", padding: "11px 16px", background: "rgba(88,130,220,0.08)", borderRadius: 10, border: "1px solid rgba(88,130,220,0.25)" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#5882DC" }}>⚡ The two collab Reels were co-posted with Dr. El Chaar — their views show on NYCDS&rsquo;s account, but per-reel reach and engagement live on the partner accounts, so NYCDS&rsquo;s share is captured in the account total (188 interactions) rather than per card.</span>
          </div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Watch Time Analytics</div><div style={{ textAlign: "center", padding: "8px 0 22px" }}><div className="big-num">{typeof d.kpi.watchTime.value === "string" ? d.kpi.watchTime.value.replace(/\s*\d+s$/, "") : d.kpi.watchTime.value}</div><div style={{ fontSize: 12, color: "#9B9196", marginTop: 2 }}>Total Watch Time</div></div><div style={{ display: "flex", gap: 14 }}><div className="stat-box"><div className="big-num-sm plum">7s</div><div className="stat-label">Avg Duration</div></div><div className="stat-box"><div className="big-num-sm steel">{d.kpi.views.value.toLocaleString()}</div><div className="stat-label">Total Views</div></div></div><div className="alert-box plum-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>✦ Reels drove 88% of views and 73% non-follower reach — the two collab Reels carried the week</span></div></div>
            <div className="card"><div className="card-hd">Engagement Breakdown</div><div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{[{ label: "Likes", value: d.posts.reduce((s: number, p: any) => s + (p.likes||0), 0), max: 50, color: "#6F5060" }, { label: "Comments", value: d.posts.reduce((s: number, p: any) => s + (p.comments||0), 0), max: 50, color: "#8FA1A6" }, { label: "Shares", value: d.posts.reduce((s: number, p: any) => s + (p.shares||0), 0), max: 50, color: "#A6968D" }, { label: "Saves", value: d.posts.reduce((s: number, p: any) => s + (p.saves||0), 0), max: 50, color: "#BE5A5A" }].map((m) => (<div key={m.label} style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 72, fontSize: 13, fontWeight: 500 }}>{m.label}</div><div style={{ flex: 1, height: 10, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}><div style={{ width: `${(Math.max(m.value, 0.5) / m.max) * 100}%`, height: "100%", background: m.color, borderRadius: 99, transition: "width 1.2s ease" }} /></div><div className="display-num" style={{ width: 30, textAlign: "right" as const }}>{m.value}</div></div>))}</div><div className="alert-box danger-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#BE5A5A" }}>▲ Breakdown reflects NYCDS-owned posts; the collab Reels’ engagement sits in the account total (188 interactions). 0 saves on owned content — the lever to push.</span></div></div>
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
            <InsightCard title={"Link Attribution · " + linkData.period} body={timeRange === "7d" ? "44 attributed human clicks over 7 days across the named location links — the /* wildcard (15), LinkedIn/FB, and data-center/bot traffic excluded. 58th Street led at 12, then Website 11, 60th Street 8, Homepage 5, 35th Street and 5th Ave 4 each. Click spike on Jun 4–5 (31 + 15) lines up with the collab Reels. US dominates; Linux/data-center clicks filtered out." : "258 attributed human clicks over 30 days across the four office links plus homepage. 58th Street (64), 5th Ave (54), 35th Street (53) and 60th Street (44) are evenly distributed — all four locations active. Website UTM drove 116 clicks; NYC and Brooklyn lead human cities. /* wildcard (253), LinkedIn/FB and bot traffic excluded."} severity="info" />
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
            <InsightCard title={"Website + Search · " + websiteData.period} body={timeRange === "7d" ? "162 sessions over 7 days (~23/day). Direct leads at 57.1% (92), Google 31.1% (50), with Figment Creative and Instagram referrals appearing. Desktop 77.0% / Mobile 22.2%. Jun 4 was the strongest day at 22 visitors — aligning with the collab Reels. GSC (28d): 270 clicks, 1.93% CTR, avg position 33.9 — brand and doctor queries dominate." : "631 sessions over 30 days. Direct 52.0% (328) and Google 38.8% (245) carry ~91% of traffic combined. 2 ChatGPT referrals appeared this period — small but worth monitoring for AI-driven traffic. Desktop 75.6% / Mobile 24.2%. GSC 28d: 270 clicks, 1.93% CTR, pos 33.9. Nerve Pain After Onlay page = 48 clicks at pos 6.3 — the non-brand SEO win to replicate."} severity="info" />
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
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>⚡ Steady traffic — the site held 12–25 visitors/day across the window with no single-day collapse. Direct + Google carry ~88% of sessions.</span>
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
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Reels dominate views (88%) and interactions (84%) — the collab format is the discovery engine</span>
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
                <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>▲ Reels carried 88% of views and 73% non-follower reach — the two Dr. El Chaar collab Reels drove the week.</span>
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
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>▲ Borrowed reach is wide but follower conversion is the gap — turn collab-Reel discovery into follows</span>
              </div>
            </div>
          </div>

          <div className="card">
            <InsightCard title={"Social Intelligence · " + socialData.period} body={timeRange === "7d" ? "3,410 views reaching 362 accounts (−26.9% WoW) — views surged on two Dr. El Chaar collaboration Reels (3.3K + 1.4K) while reach dipped, a collaborator-attribution effect. 73.4% non-follower views. 188 interactions (84% Reels); the 51.9% ER is inflated by the small reach denominator — read it as resonance, not a true rate. Only one owned Reel published (Jun 3, 286 views). 3 Stories at ~76% avg completion. Followers +8 net (9 follows, 1 unfollow)." : "6,048 views over 30 days across NYCDS-originated posts (the Jun 4–5 collab Reels live on the account totals, not the owned-post export). May 12 'Dental Implants Misunderstood' anchors at 1,768 views and 57% skip. Reels deliver the bulk of views and interactions — the workhorse format. Skip rates on the month's reels ranged 56–77% — content quality, not algorithm, is the differentiator."} severity="info" />
            <InsightCard title="Key Insight" body="The collaboration play worked: two co-posted Reels with Dr. El Chaar drove account views from 1,327 to 3,410 and pushed 73% non-follower discovery. The catch — that reach is borrowed (NYCDS is credited the views but little of the reach, so account reach read −26.9%) and owned cadence was thin (one originated Reel). What's working: the collab format and doctor-led educational Reels (May 12 implants anchors the month at 1,768). What's not: only +8 net follows off a big discovery week, and 0 saves on owned content. Convert the borrowed reach into follows and rebuild a 2–3 Reel/week owned cadence." severity="success" />
          </div>
        </>)}

        {tab === "audience" && (<>
          <div className="cols2">
            <div className="card"><div className="card-hd">Gender Split</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.audience.gender.male }, { value: d.audience.gender.female }]} colors={["#6F5060", "#8FA1A6"]} size={130} stroke={20} /><div style={{ flex: 1 }}>{[{ label: "Male", value: d.audience.gender.male, color: "#6F5060" }, { label: "Female", value: d.audience.gender.female, color: "#8FA1A6" }].map((g) => (<div key={g.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}><div style={{ width: 12, height: 12, borderRadius: 4, background: g.color }} /><span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{g.label}</span><span className="display-num-lg">{g.value}%</span></div>))}</div></div></div>
            <div className="card"><div className="card-hd">Age Distribution</div>{d.audience.age.map((a) => (<div key={a.range} className="age-row"><div className="age-label">{a.range}</div><div className="age-track"><div className="age-fill" style={{ width: `${(a.pct / 36) * 100}%`, background: a.pct >= 28 ? "#6F5060" : a.pct >= 20 ? "#8FA1A6" : "#A6968D" }} /></div><div className="age-pct">{a.pct}%</div></div>))}</div>
          </div>
          <div className="card"><div className="card-hd">Audience Intelligence</div>
            <InsightCard title="Core Patient Demographic" body="59% of the audience falls in the 25–44 age range (30% aged 25–34, 29% aged 35–44) — the prime demographic for general dentistry, cosmetic procedures, and Invisalign. Audience gender remains balanced at 52/48 male/female. This represents the highest lifetime patient value segment for NYC Dental Smiles." severity="success" />
            <InsightCard title="Gender Balance" body="At 52% male / 48% female, the follower base is nearly balanced. The 25–34 cohort is the largest single segment. Consider testing content themes that resonate with female audiences — cosmetic dentistry, teeth whitening, and wellness-focused oral health — to drive appointment bookings." severity="info" />
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
