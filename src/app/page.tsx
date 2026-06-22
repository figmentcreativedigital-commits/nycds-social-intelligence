"use client";
import { useState, useEffect } from "react";

const FALLBACK_DATA = {
  client: { name: "NYCDS", fullName: "NYC Dental Smiles", period: "June 15 – June 21, 2026" },
  kpi: {
    followers: { value: 700, change: 5, label: "Followers" },
    reach: { value: 824, label: "Reach" },
    views: { value: 3672, label: "Total Views" },
    engagementRate: { value: 8.0, label: "Engagement Rate", suffix: "%" },
    engagements: { value: 66, label: "Engagements" },
    watchTime: { value: "1m 19s", label: "Watch Time" },
  },
  posts: [
    { id: 1, title: "Treatment Philosophy — Dr. Laura (Reel)", type: "Reel", views: 552, reach: 264, likes: 4, comments: 0, saves: 0, shares: 0, isTop: true, igPostUrl: "" },
    { id: 2, title: "Tips to Keep Your Teeth White", type: "Post", views: 147, reach: 92, likes: 2, comments: 0, saves: 0, shares: 1, isTop: false, igPostUrl: "" },
    { id: 3, title: "Patient Testimonial", type: "Post", views: 51, reach: 24, likes: 1, comments: 0, saves: 0, shares: 0, isTop: false, igPostUrl: "" },
  ] as any[],
  contentMix: { posts: 16, reels: 45, stories: 39 },
  audience: {
    gender: { male: 51, female: 49 },
    age: [
      { range: "18-24", pct: 5.4 }, { range: "25-34", pct: 29.8 }, { range: "35-44", pct: 29.8 },
      { range: "45-54", pct: 20.8 }, { range: "55-64", pct: 9.6 }, { range: "65+", pct: 4.4 },
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

  opportunities.push({ title: "Reel Cadence Resumed — Reach Grew Again", body: `Accounts reached climbed to ${reach} (+52.6% WoW, from 540) as NYCDS shipped its first Reel in two cycles — "Great dentistry starts with relationships" featuring Dr. Laura (Jun 17). Account views hit ${data.kpi.views.value.toLocaleString()}, with big discovery days on Jun 16 (1,054 views) and Jun 19 (1,177). The reel format is back, and reach responded — the lever now is consistency: a steady 2–3 Reel/week cadence keeps this discovery surface open instead of spiking and fading.`, severity: "success" });

  insights.push({ title: `Engagement Held at ${er}% — Reels Carried It`, body: `${data.kpi.engagements.value} interactions against ${reach} accounts reached = ${er}%, steady with last week and above the 5% healthcare benchmark — and this time it came with +52.6% reach growth, not in spite of it. Reels drove 63.8% of all engagement and 46.6% of interactions came from non-followers, the widest discovery split in weeks. The Dr. Laura "treatment philosophy" Reel is the standout: 552 views, 264 reach, and a 1m 19s average watch time — audiences are spending real time on doctor-led content. The one gap: active signals on the new pieces were light (4 likes on the Reel, 0 saves) — strong consumption, thin CTA response.`, severity: "success" });

  const sorted = [
    { name: "Reels", val: data.contentMix.reels },
    { name: "Posts", val: data.contentMix.posts },
    { name: "Stories", val: data.contentMix.stories },
  ].sort((a, b) => b.val - a.val);
  insights.push({ title: "Reels Led the Format Mix", body: `${sorted[0].name} led at ${sorted[0].val}% of published-content views, ${sorted[1].name} ${sorted[1].val}%, ${sorted[2].name} ${sorted[2].val}%. With the cadence back, the single Dr. Laura Reel (552 views) out-pulled the 5 Stories (479 impressions) and drove 63.8% of all engagement. Reels are the discovery and engagement engine; Stories sustain day-to-day reach between them. The mix is healthily reel-forward — the lever is holding the cadence.`, severity: "info" });

  const totalSaves = data.posts.reduce((s: number, p: any) => s + (p.saves || 0), 0);
  if (totalSaves < 2) {
    opportunities.push({ title: "Saves Remain the Weak Lever", body: `${totalSaves} saves across the week's owned content — again. Saves are the highest-weighted action in Meta's ranking, and the reach is clearly there (+53% to ${reach}). But nothing this week was reference-worthy enough to bookmark. Procedure explainers and before/after carousels with a 'Save this before you book' CTA on the final frame are the fix — and they convert reach into the signal the algorithm rewards.`, severity: "warning" });
  }

  if (data.viewerSplit.nonFollowers >= 45) {
    opportunities.push({ title: "Discovery Wide — Convert the Watch Time", body: `An estimated ${data.viewerSplit.nonFollowers}% of views and 46.6% of interactions came from non-followers — discovery is wide open and the Reel reopened it. Engagement held at 8.0%, and the Dr. Laura Reel earned a 1m 19s watch time. The remaining lever is the active layer: that strong watch time came with only 4 likes and 0 saves. Booking-link stickers on high-reach Stories and a save-prompt on the reel's end frame convert the attention that's already arriving.`, severity: "warning" });
  }

  insights.push({ title: "Brand-Search Dependency on Google", body: `Search Console wasn't re-exported this cycle, so these carry from the prior 30-day pull: most clicks are brand/name terms (nyc dental smiles 33 clicks at 56.9% CTR, dr farahani, michael chesner). The standout non-brand asset — the 'nerve pain after onlay' page — drew 53 clicks at position 6.2, ranking far better than the brand pages. That one page is still the blueprint for non-brand growth; replicate the template across 5–10 procedure questions.`, severity: "info" });

  insights.push({ title: "Mobile Outranks Desktop on Google", body: "GSC: Mobile ranks at position 17.5 vs Desktop at 40.8 — a ~2.3× ranking gap on the same content, with mobile converting at 2.93% CTR vs 1.17% on desktop. Mobile out-clicks desktop outright (143 vs 133). Mobile experience is the strongest SEO lever right now — audit Core Web Vitals and keep CTAs thumb-reachable above the fold.", severity: "info" });

  const topAge = data.audience.age.reduce((a, b) => (a.pct > b.pct ? a : b));
  insights.push({ title: "Audience Alignment", body: `Primary audience is ${topAge.range} (${topAge.pct}%), with a ${data.audience.gender.male}/${data.audience.gender.female} male/female split. The 25–44 range represents ${(data.audience.age[1]?.pct || 0) + (data.audience.age[2]?.pct || 0)}% — strong patient demographic for cosmetic and restorative work — and New York is the top follower market at ~23%, a tightly local, high-intent base.`, severity: "success" });

  if (data.kpi.followers.change != null && data.kpi.followers.change < 5) {
    opportunities.push({ title: "Follower Conversion Lag", body: `Net +${data.kpi.followers.change} this week. With ${data.viewerSplit.nonFollowers}% of views from non-followers and reach up +52.6%, the discovery is there — pinned content, a bio CTA refresh, and follow prompts on Story covers would capture more of it.`, severity: "warning" });
  }

  recommendations.push(
    { text: "Hold the Reel cadence now that it's back — the Dr. Laura Reel reopened reach (+53% to 824). Aim for 2–3/week (provider spotlights, procedure explainers) so the discovery surface stays open instead of spiking and fading", priority: "high" },
    { text: "Expand the 'Ask the Doctor' / treatment-philosophy reel series — the Dr. Laura Reel held a 1m 19s watch time, the strongest content signal of the week. Doctor-led talking-head reels are the proven format; build a recurring cadence around them", priority: "high" },
    { text: "Add the CTA layer to the new content — the Dr. Laura Reel earned a 1m 19s watch time but only 4 likes and 0 saves. Strong consumption isn't converting to active signals; add save-prompts to carousels and booking stickers to high-reach Stories", priority: "high" },
    { text: "Keep Stories as the daily reach engine between Reels — 5 Stories (479 impr) sustained reach alongside the Reel. A recurring BTS / provider-spotlight Story cadence holds the discovery surface open day-to-day", priority: "medium" },
    { text: "Replicate the 'nerve pain after onlay' SEO template — 53 clicks at position 6.2, the one page outranking brand terms. Build 5+ procedure-question articles for non-brand growth (refresh the GSC export next cycle to track)", priority: "medium" },
    { text: "Investigate the 'appen-stonecoal3' website referral (16 sessions / 2.0% at 30d) — recurring likely-spam source; confirm and filter before it skews source reporting", priority: "low" },
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
    period: "June 15 – June 21, 2026",
    totalClicks: 56,
    topLinks: [
      { path: "NYCDS 5th Ave", clicks: 16 },
      { path: "NYCDS 60th Street", clicks: 10 },
      { path: "NYCDS 58th Street", clicks: 9 },
      { path: "Website", clicks: 8 },
      { path: "NYCDS 35th Street", clicks: 8 },
      { path: "Homepage", clicks: 5 },
    ],
    trafficSources: [
      { source: "Website (Locations)", clicks: 26 },
      { source: "Direct / Unknown", clicks: 167 },
    ],
    topCountries: [
      { country: "United States", clicks: 140 },
      { country: "Germany", clicks: 5 },
      { country: "India", clicks: 4 },
      { country: "Other", clicks: 11 },
    ],
    topCities: [
      { city: "Brooklyn", clicks: 8 },
      { city: "Southold", clicks: 8 },
      { city: "New York City", clicks: 4 },
      { city: "White Plains", clicks: 1 },
    ],
    devices: [
      { os: "Windows", clicks: 83 },
      { os: "Mac OS X", clicks: 50 },
      { os: "iOS", clicks: 13 },
      { os: "Android", clicks: 9 },
    ],
  };
  const linkData30d = {
    period: "May 23 – June 23, 2026",
    totalClicks: 209,
    topLinks: [
      { path: "NYCDS 60th Street", clicks: 50 },
      { path: "NYCDS 58th Street", clicks: 36 },
      { path: "Website", clicks: 34 },
      { path: "NYCDS 5th Ave", clicks: 31 },
      { path: "NYCDS 35th Street", clicks: 30 },
      { path: "Homepage", clicks: 28 },
    ],
    trafficSources: [
      { source: "Website (Locations)", clicks: 78 },
      { source: "Direct / Unknown", clicks: 500 },
    ],
    topCountries: [
      { country: "United States", clicks: 403 },
      { country: "Netherlands", clicks: 21 },
      { country: "Sweden", clicks: 15 },
      { country: "Other", clicks: 39 },
    ],
    topCities: [
      { city: "New York City", clicks: 19 },
      { city: "Brooklyn", clicks: 13 },
      { city: "Southold", clicks: 8 },
      { city: "Charleston", clicks: 6 },
    ],
    devices: [
      { os: "Windows", clicks: 181 },
      { os: "Mac OS X", clicks: 144 },
      { os: "Android", clicks: 55 },
      { os: "iOS", clicks: 49 },
    ],
  };
  const linkData = timeRange === "7d" ? linkData7d : linkData30d;

  const websiteData7d = {
    period: "June 15 – June 21, 2026",
    sessions: 211,
    topPages: [
      { page: "/", label: "Home", views: 161 },
      { page: "/ourdoctors", label: "Our Doctors", views: 63 },
      { page: "/cosmetic-dentistry", label: "Cosmetic Dentistry", views: 9 },
      { page: "/locations", label: "Locations", views: 9 },
      { page: "/dr-doris-giraldo", label: "Dr. Doris Giraldo", views: 6 },
      { page: "/dr-michael-chesner", label: "Dr. Michael Chesner", views: 6 },
      { page: "/dr-sherman-farahani", label: "Dr. Sherman Farahani", views: 4 },
      { page: "/about", label: "About", views: 3 },
      { page: "/dr-laura-koo-min-chee", label: "Dr. Laura Koo Min Chee", views: 3 },
    ],
    trafficSources: [
      { source: "Direct", sessions: 122, pct: 57.8 },
      { source: "Google", sessions: 77, pct: 36.5 },
      { source: "Instagram", sessions: 6, pct: 2.8 },
      { source: "(not set)", sessions: 2, pct: 0.9 },
      { source: "ChatGPT", sessions: 1, pct: 0.5 },
      { source: "Other", sessions: 3, pct: 1.4 },
    ],
    devices: [
      { device: "Desktop", pct: 76.7 },
      { device: "Mobile", pct: 22.8 },
    ],
    dailyVisitors: [
      { date: "Jun 15", visitors: 28 },{ date: "Jun 16", visitors: 35 },
      { date: "Jun 17", visitors: 38 },{ date: "Jun 18", visitors: 32 },
      { date: "Jun 19", visitors: 30 },{ date: "Jun 20", visitors: 26 },
      { date: "Jun 21", visitors: 22 },
    ],
    search: {
      totalClicks: 279, totalImpressions: 16366, avgCTR: 1.70, avgPosition: 33.8,
      note: "30-day (carried — GSC not re-exported this cycle)",
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
    period: "May 23 – June 20, 2026",
    sessions: 781,
    topPages: [
      { page: "/", label: "Home", views: 594 },
      { page: "/ourdoctors", label: "Our Doctors", views: 169 },
      { page: "/about", label: "About", views: 23 },
      { page: "/dr-michael-chesner", label: "Dr. Michael Chesner", views: 23 },
      { page: "/locations", label: "Locations", views: 23 },
      { page: "/comprehensive-care", label: "Comprehensive Care", views: 22 },
      { page: "/services", label: "Services", views: 20 },
      { page: "/why-nycds", label: "Why NYCDS", views: 18 },
      { page: "/dr-laura-koo-min-chee", label: "Dr. Laura Koo Min Chee", views: 16 },
    ],
    trafficSources: [
      { source: "Direct", sessions: 449, pct: 57.5 },
      { source: "Google", sessions: 267, pct: 34.2 },
      { source: "appen-stonecoal3 (ref)", sessions: 16, pct: 2.0 },
      { source: "Instagram", sessions: 14, pct: 1.8 },
      { source: "Bing", sessions: 10, pct: 1.3 },
      { source: "Figment Creative", sessions: 5, pct: 0.6 },
      { source: "Other", sessions: 20, pct: 2.6 },
    ],
    devices: [
      { device: "Desktop", pct: 78.2 },
      { device: "Mobile", pct: 21.4 },
    ],
    dailyVisitors: [
      { date: "May 23", visitors: 14 },{ date: "May 28", visitors: 24 },
      { date: "Jun 1", visitors: 18 },{ date: "Jun 5", visitors: 20 },
      { date: "Jun 9", visitors: 30 },{ date: "Jun 13", visitors: 22 },
      { date: "Jun 16", visitors: 35 },{ date: "Jun 18", visitors: 32 },
      { date: "Jun 20", visitors: 26 },
    ],
    search: {
      totalClicks: 279, totalImpressions: 16366, avgCTR: 1.70, avgPosition: 33.8,
      note: "30-day (carried — GSC not re-exported this cycle)",
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
    period: "June 15 – June 21, 2026",
    followers: 700,
    followerGrowth: 5,
    follows: 12,
    unfollows: 2,
    totalViews: 3672,
    totalReach: 824,
    reachChange: 52.6,
    totalInteractions: 66,
    viewSplit: { followers: 40, nonFollowers: 60 },
    engagementSplit: { followers: 53.4, nonFollowers: 46.6 },
    viewsByType: { reels: 44.9, posts: 16.1, stories: 39.0 },
    interactionsByType: { reels: 63.8, posts: 24.1, stories: 12.1 },
    totalLikes: 7,
    totalComments: 0,
    totalSaves: 0,
    totalShares: 1,
    storyViews: 479, storyCompletion: 85, storyCount: 5,
    reelAvgWatchTime: "1m 19s", reelSkipRate: "n/a",
    dailyViews: [
      { date: "Jun 15", views: 27 },{ date: "Jun 16", views: 1054 },
      { date: "Jun 17", views: 679 },{ date: "Jun 18", views: 485 },
      { date: "Jun 19", views: 1177 },{ date: "Jun 20", views: 430 },
      { date: "Jun 21", views: 139 },
    ],
    posts: [
      { id: 1, title: "Treatment Philosophy — Dr. Laura", type: "Reel", date: "Jun 17", views: 552, reach: 264, likes: 4, comments: 0, saves: 0, shares: 0, er: 1.52, skipRate: 0, avgWatch: "1m 19s", igUrl: "", isTop: true },
      { id: 2, title: "Tips to Keep Your Teeth White", type: "Post", date: "Jun 18", views: 147, reach: 92, likes: 2, comments: 0, saves: 0, shares: 1, er: 3.3, skipRate: 0, avgWatch: "—", igUrl: "", isTop: false },
      { id: 3, title: "Patient Testimonial", type: "Post", date: "Jun 16", views: 51, reach: 24, likes: 1, comments: 0, saves: 0, shares: 0, er: 4.2, skipRate: 0, avgWatch: "—", igUrl: "", isTop: false },
    ],
  };
  const socialData30d = {
    period: "May 23 – June 21, 2026",
    followers: 700,
    followerGrowth: 5,
    follows: 18,
    unfollows: 13,
    totalViews: 10120,
    totalReach: 2790,
    reachChange: 0,
    totalInteractions: 58,
    viewSplit: { followers: 42, nonFollowers: 58 },
    engagementSplit: { followers: 70, nonFollowers: 30 },
    viewsByType: { reels: 54.7, posts: 27.3, stories: 18.0 },
    interactionsByType: { reels: 62, posts: 38, stories: 0 },
    totalLikes: 48,
    totalComments: 4,
    totalSaves: 0,
    totalShares: 6,
    storyViews: 479, storyCompletion: 82, storyCount: 5,
    reelAvgWatchTime: "4–11s",
    reelSkipRate: "56–63%",
    dailyViews: [
      { date: "May 28", views: 448 },{ date: "May 30", views: 352 },
      { date: "Jun 3", views: 307 },{ date: "Jun 11", views: 175 },
      { date: "Jun 16", views: 1054 },{ date: "Jun 17", views: 679 },
      { date: "Jun 19", views: 1177 },{ date: "Jun 21", views: 139 },
    ],
    posts: [
      { id: 1, title: "A Quick Chat with Dr. Ben", type: "Reel", date: "May 28", views: 448, reach: 290, likes: 11, comments: 2, saves: 0, shares: 0, er: 4.48, skipRate: 57, avgWatch: "—", igUrl: "https://www.instagram.com/reel/DY5V90Nx1bh/", isTop: true },
      { id: 2, title: "Come With Me to My Appointment", type: "Reel", date: "May 30", views: 352, reach: 193, likes: 8, comments: 1, saves: 0, shares: 1, er: 5.18, skipRate: 56, avgWatch: "—", igUrl: "https://www.instagram.com/reel/DY98lsXJRwu/", isTop: false },
      { id: 3, title: "Treatment Philosophy — Dr. Laura", type: "Reel", date: "Jun 17", views: 552, reach: 264, likes: 4, comments: 0, saves: 0, shares: 0, er: 1.52, skipRate: 0, avgWatch: "1m 19s", igUrl: "", isTop: false },
      { id: 4, title: "What X-Rays Don’t Tell You — Dr. Tamay", type: "Reel", date: "Jun 3", views: 307, reach: 224, likes: 8, comments: 1, saves: 0, shares: 0, er: 4.02, skipRate: 63, avgWatch: "—", igUrl: "https://www.instagram.com/reel/DZIvPDcJY03/", isTop: false },
      { id: 5, title: "Why NYCDS? Exceptional Dentistry Beyond Your Smile", type: "Post", date: "May 29", views: 210, reach: 96, likes: 6, comments: 0, saves: 0, shares: 0, er: 6.25, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/p/DY71R-ClhCG/", isTop: false },
      { id: 6, title: "A More Advanced Way — AI-Assisted Imaging", type: "Post", date: "Jun 11", views: 175, reach: 75, likes: 6, comments: 0, saves: 0, shares: 3, er: 12.0, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/p/DZcplDQRa9i/", isTop: false },
      { id: 7, title: "Your Toothpaste Matters", type: "Carousel", date: "Jun 12", views: 150, reach: 62, likes: 3, comments: 0, saves: 0, shares: 0, er: 4.84, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/p/DZfeQ-ulkNI/", isTop: false },
    ],
  };
  const socialData = timeRange === "7d" ? socialData7d : socialData30d;
  const overviewKpis = timeRange === "7d" ? [
    { label: "Followers", value: 700, change: "+5", delay: 0 },
    { label: "Views", value: 3672, delay: 80 },
    { label: "Reach", value: 824, change: "+52.6%", delay: 160 },
    { label: "Interactions", value: 66, delay: 240 },
    { label: "Non-Follower", value: "~60%", delay: 320 },
  ] : [
    { label: "Followers", value: 700, change: "+5", delay: 0 },
    { label: "Views", value: 10120, delay: 80 },
    { label: "Reach", value: 2790, delay: 160 },
    { label: "Interactions", value: 58, delay: 240 },
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
            <div><div className="exec-col-title">Discovery</div><div className="exec-col-body">An estimated {d.viewerSplit.nonFollowers}% of views — and 46.6% of <em>interactions</em> — came from non-followers, the widest discovery split in weeks. Reach <em>grew +52.6%</em> to 824 accounts as the Reel cadence returned: the Jun 17 Dr. Laura &ldquo;treatment philosophy&rdquo; Reel reopened distribution at 552 views and a 1m 19s average watch time. Account views ran 3,672 (Metricool) / 3,991 (native daily). Discovery is wide open and people are watching — the surface is working.</div></div>
            <div><div className="exec-col-title">Engagement</div><div className="exec-col-body">66 interactions, ~8.0% engagement rate (66 &divide; 824 reach) — steady with last week and above the 5% healthcare benchmark, this time alongside +52.6% reach. Reels drove 63.8% of all engagement; the Dr. Laura Reel reached well (264) and held a 1m 19s average watch time. The one gap: active signals on the new pieces were light (4 likes on the Reel, 0 saves) — strong consumption, thin CTA response. Followers 690&rarr;700. 25&ndash;44 demo = 59.6%.</div></div>
            <div><div className="exec-col-title">Content</div><div className="exec-col-body">Stories led published-content views at {d.contentMix.stories}%, Reels {d.contentMix.reels}%, Posts {d.contentMix.posts}% — even with the Reel back, 5 Stories (479 impr) out-viewed the single Reel (348). GSC carries from the prior pull (not re-exported): 279 clicks at pos ~34, brand-search heavy, with the nerve-pain page (53 clicks, pos 6.2) outranking every brand page. Mobile ranks ~2.3&times; better than desktop — still the SEO lever.</div></div>
          </div></div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Content Mix</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.contentMix.reels }, { value: d.contentMix.posts }, { value: d.contentMix.stories }]} colors={["#6F5060", "#8FA1A6", "#A6968D"]} size={120} stroke={18} /><div style={{ flex: 1 }}>{[{ label: "Reels", value: d.contentMix.reels, color: "#6F5060" }, { label: "Posts", value: d.contentMix.posts, color: "#8FA1A6" }, { label: "Stories", value: d.contentMix.stories, color: "#A6968D" }].map((item) => (<div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}><div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} /><span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span><span className="display-num">{item.value}%</span></div>))}</div></div></div>
            <div className="card"><div className="card-hd">Viewer Composition</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.viewerSplit.nonFollowers }, { value: d.viewerSplit.followers }]} colors={["#6F5060", "#D9C5C1"]} size={120} stroke={18} /><div style={{ flex: 1 }}>{[{ label: "Non-Followers", value: d.viewerSplit.nonFollowers, color: "#6F5060" }, { label: "Followers", value: d.viewerSplit.followers, color: "#D9C5C1" }].map((item) => (<div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}><div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} /><span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span><span className="display-num">{item.value}%</span></div>))}<div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(143,161,166,0.12)", borderRadius: 10, border: "1px solid rgba(143,161,166,0.25)" }}><span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Wide discovery — 46.6% of interactions came from non-followers this week</span></div></div></div></div>
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
            <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ The Reel cadence resumed and led the week — the Jun 17 Dr. Laura &ldquo;treatment philosophy&rdquo; Reel pulled 552 views, 264 reach and a 1m 19s average watch time, reopening reach +52.6% to 824 accounts. Engagement held at 8.0% with Reels driving 63.8% of it.</span>
          </div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Watch Time Analytics</div><div style={{ textAlign: "center", padding: "8px 0 22px" }}><div className="big-num">{d.kpi.watchTime.value}</div><div style={{ fontSize: 12, color: "#9B9196", marginTop: 2 }}>Avg Watch / Reel</div></div><div style={{ display: "flex", gap: 14 }}><div className="stat-box"><div className="big-num-sm plum">552</div><div className="stat-label">Reel Views</div></div><div className="stat-box"><div className="big-num-sm steel">{d.kpi.views.value.toLocaleString()}</div><div className="stat-label">Total Views</div></div></div><div className="alert-box plum-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>✦ The Dr. Laura &ldquo;treatment philosophy&rdquo; Reel held a 1m 19s average watch time on 552 views — a standout for doctor-led educational content. Watch time this strong is the signal to expand the &ldquo;Ask the Doctor&rdquo; / philosophy series.</span></div></div>
            <div className="card"><div className="card-hd">Engagement Breakdown</div><div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{[{ label: "Likes", value: d.posts.reduce((s: number, p: any) => s + (p.likes||0), 0), max: 15, color: "#6F5060" }, { label: "Comments", value: d.posts.reduce((s: number, p: any) => s + (p.comments||0), 0), max: 15, color: "#8FA1A6" }, { label: "Shares", value: d.posts.reduce((s: number, p: any) => s + (p.shares||0), 0), max: 15, color: "#A6968D" }, { label: "Saves", value: d.posts.reduce((s: number, p: any) => s + (p.saves||0), 0), max: 15, color: "#BE5A5A" }].map((m) => (<div key={m.label} style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 72, fontSize: 13, fontWeight: 500 }}>{m.label}</div><div style={{ flex: 1, height: 10, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}><div style={{ width: `${(Math.max(m.value, 0.5) / m.max) * 100}%`, height: "100%", background: m.color, borderRadius: 99, transition: "width 1.2s ease" }} /></div><div className="display-num" style={{ width: 30, textAlign: "right" as const }}>{m.value}</div></div>))}</div><div className="alert-box danger-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#BE5A5A" }}>▲ Account engagement held at 8.0% (66 interactions ÷ 824 reach), with Reels driving 63.8% of it. The owned-content breakdown below (7 likes, 1 share, 0 saves on the 3 new pieces) shows the gap: consumption is strong but active signals are light. &ldquo;Save this before you book&rdquo; CTAs and booking stickers are the lever.</span></div></div>
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
            <InsightCard title={"Link Attribution · " + linkData.period} body={timeRange === "7d" ? "56 attributed human clicks over 7 days across the six named NYCDS links — 5th Ave (16) led, then 60th Street (10), 58th Street (9), Website (8), 35th Street (8) and Homepage (5). The /* wildcard (115), LinkedIn/FB/IG social links, Linux/data-center traffic and the geoname-coded datacenter spike (the Jun 17 raw bump of 132 was almost all bot) are excluded. Clean human geo is tight NY metro — Brooklyn, Southold, NYC, White Plains. One /DDS-PC-UES click was stripped and merged to EEC per the cross-account rule." : "209 attributed human clicks over 30 days across the four office links plus Website and Homepage — 60th Street (50), 58th Street (36), Website (34), 5th Ave (31), 35th Street (30) and Homepage (28); all four locations active. The /* wildcard (252), social links and the geoname datacenter (284) are excluded; NYC (19) and Brooklyn (13) lead human cities. One /DDS-PC-UES click was stripped and merged to EEC; no /DDS-PC-Midtown clicks appeared." } severity="info" />
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
            <InsightCard title={"Website + Search · " + websiteData.period} body={timeRange === "7d" ? "211 sessions over 7 days (~30/day). Direct leads at 57.8% (122), Google 36.5% (77), Instagram 2.8% (6). Desktop 76.7% / Mobile 22.8%. The doctor pages are the engine — /ourdoctors drew 63 landing views (#2 behind Home's 161), with individual provider pages (Giraldo, Chesner, Farahani, Koo Min Chee) all pulling traffic. GSC carries from the prior pull (not re-exported this cycle): 279 clicks, 1.70% CTR, pos ~34, brand-dominant." : "781 sessions over 30 days. Direct 57.5% (449) and Google 34.2% (267) carry ~92% combined. Desktop 78.2% / Mobile 21.4%. /ourdoctors (169) is the clear #2 page — provider pages are the conversion surface. ⚠ The 'appen-stonecoal3' referral recurs (16 sessions / 2.0%) — same likely-spam source as prior cycles; confirm and filter. GSC carried: the Nerve Pain After Onlay page (53 clicks, pos 6.2) still outranks every brand term — the non-brand SEO template to replicate."} severity="info" />
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
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>⚡ Reach grew +52.6% to 824 as the Reel cadence resumed, with discovery days on Jun 16 (1,054 views) and Jun 19 (1,177) — note Jun 19's views ran well ahead of reach (replays / back-catalog loops), so reach is the cleaner signal than the raw view count. Engagement held at 8.0%. (Daily series is the native Profile Growth &amp; Discovery export — no modeling this week.)</span>
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
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Reels led both views (45%) and interactions (63.8%) this week as the Dr. Laura Reel returned; Stories held 39% of views and posts 16%. The format mix is healthily reel-forward — the lever is sustaining that cadence.</span>
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
                <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>▲ The Reel cadence resumed (Dr. Laura, Jun 17) and consumption was strong — 552 views at a 1m 19s average watch time. Active signals (4 likes, 0 saves) lagged the watch time, so the lever is a clear CTA / save-prompt on high-watch reels to convert attention into action.</span>
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
                <div style={{ fontSize: 36, fontWeight: 700, color: "#6F5060" }}>0.14%</div>
                <div style={{ fontSize: 12, color: "#9B9196", marginTop: 4 }}>Views → Follower Conversion</div>
              </div>
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(143,161,166,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#8FA1A6" }}>3,672</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>views</div>
                </div>
                <div style={{ flex: 0, display: "flex", alignItems: "center", fontSize: 16, color: "#D9CCC1" }}>→</div>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(143,161,166,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#8FA1A6" }}>824</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>reached</div>
                </div>
                <div style={{ flex: 0, display: "flex", alignItems: "center", fontSize: 16, color: "#D9CCC1" }}>→</div>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(111,80,96,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#6F5060" }}>+5</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>followers</div>
                </div>
              </div>
              <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(111,80,96,0.10)", borderRadius: 10, border: "1px solid rgba(111,80,96,0.25)" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>▲ Reach grew +52.6% and engagement held at 8.0% (66 interactions) — a healthy combination. The gap is active signals on new content (4 likes, 0 saves on the Reel); add booking-CTA and save-prompt stickers to convert the strong watch time.</span>
              </div>
            </div>
          </div>

          <div className="card">
            <InsightCard title={"Social Intelligence · " + socialData.period} body={timeRange === "7d" ? "3,672 account views (Metricool; 3,991 native daily) with reach up +52.6% to 824 accounts and engagement holding at 8.0% (66 interactions ÷ 824) — the Reel cadence resumed and reach grew without engagement slipping. Reels drove 63.8% of interactions; 46.6% of interactions came from non-followers, the widest discovery split in weeks. The Dr. Laura 'treatment philosophy' Reel is the standout — 552 views, 264 reach, 1m 19s average watch time. The one gap: active signals on the new pieces were light (4 likes on the Reel, 0 saves) — strong consumption, thin CTA response. The Jun 15 concierge collab with EEC also drove a NYCDS follower." : "10,120 account views over 30 days with ~2,790 reach (93/day) and 55 accounts engaged. NYCDS published 4 Reels, 5 feed posts and 5 Stories in-window. 'A Quick Chat with Dr. Ben' (448 views, 4.48% ER) and the appointment Reel (352, 5.18%) led; the AI-imaging post over-indexed on engagement (12.0% on 75 reach). 58 interactions total (48 likes, 4 comments, 6 shares). The Jun 17 Dr. Laura Reel reached well and held the strongest watch time of the set — the cadence is back and working."} severity="success" />
            <InsightCard title="Key Insight" body="This was a strong reel-led week. The Reel cadence resumed — the Jun 17 Dr. Laura 'treatment philosophy' Reel reopened distribution at 552 views and a 1m 19s average watch time — and reach grew +52.6% to 824 while engagement held at 8.0% (66 interactions), the healthiest combination in weeks. Reels drove 63.8% of all engagement, and 46.6% of interactions came from non-followers. What's working: doctor-led video. People are spending over a minute on Dr. Laura's reel — that's a clear content signal. What's not yet: active CTAs. The strong watch time came with just 4 likes and 0 saves on the new pieces, and the testimonial post underperformed (51 views). Two levers: (1) expand the 'Ask the Doctor' / treatment-philosophy reel series — it's the proven format, and (2) add save-prompts and booking stickers to convert the watch time into action." severity="success" />
          </div>
        </>)}

        {tab === "audience" && (<>
          <div className="cols2">
            <div className="card"><div className="card-hd">Gender Split</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.audience.gender.male }, { value: d.audience.gender.female }]} colors={["#6F5060", "#8FA1A6"]} size={130} stroke={20} /><div style={{ flex: 1 }}>{[{ label: "Male", value: d.audience.gender.male, color: "#6F5060" }, { label: "Female", value: d.audience.gender.female, color: "#8FA1A6" }].map((g) => (<div key={g.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}><div style={{ width: 12, height: 12, borderRadius: 4, background: g.color }} /><span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{g.label}</span><span className="display-num-lg">{g.value}%</span></div>))}</div></div></div>
            <div className="card"><div className="card-hd">Age Distribution</div>{d.audience.age.map((a) => (<div key={a.range} className="age-row"><div className="age-label">{a.range}</div><div className="age-track"><div className="age-fill" style={{ width: `${(a.pct / 36) * 100}%`, background: a.pct >= 28 ? "#6F5060" : a.pct >= 20 ? "#8FA1A6" : "#A6968D" }} /></div><div className="age-pct">{a.pct}%</div></div>))}</div>
          </div>
          <div className="card"><div className="card-hd">Audience Intelligence</div>
            <InsightCard title="Core Patient Demographic" body="59% of the audience falls in the 25–44 age range (30% aged 25–34, 29% aged 35–44) — the prime demographic for general, cosmetic and restorative dentistry. Gender is balanced at 52/48 male/female, and New York is the single largest follower market at 22.5% of the base — a tightly local, high-intent core. This is the highest lifetime-value segment for NYC Dental Smiles." severity="success" />
            <InsightCard title="Geography Is the Edge" body="At 22.5% of the follower base, New York dwarfs every other market (Sialkot, Boston and LA trail in the low single digits). The follower base is balanced at 52% male / 48% female. Local intent is the asset — geo-specific Story CTAs, location-tagged content, and office-specific booking links convert this audience better than broad reach plays." severity="info" />
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
