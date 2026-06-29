"use client";
import { useState, useEffect } from "react";

const FALLBACK_DATA = {
  client: { name: "NYCDS", fullName: "NYC Dental Smiles", period: "June 22 – June 28, 2026" },
  kpi: {
    followers: { value: 704, change: 4, label: "Followers" },
    reach: { value: 925, label: "Reach" },
    views: { value: 3002, label: "Total Views" },
    engagementRate: { value: 2.3, label: "Engagement Rate", suffix: "%" },
    engagements: { value: 21, label: "Engagements" },
    watchTime: { value: "8s", label: "Watch Time" },
  },
  posts: [
    { id: 1, title: "Front-Tooth Crown — Craftsmanship in the Details (Reel)", type: "Reel", views: 279, reach: 184, likes: 10, comments: 0, saves: 0, shares: 2, isTop: true, igPostUrl: "https://www.instagram.com/reel/DaBSbf6xDye/" },
    { id: 2, title: "Which Summer Treat Is Toughest on Your Teeth?", type: "Post", views: 256, reach: 116, likes: 4, comments: 1, saves: 0, shares: 1, isTop: false, igPostUrl: "https://www.instagram.com/p/DaDpy0ElgCd/" },
    { id: 3, title: "Reasons to Smile — National Smile Month", type: "Post", views: 100, reach: 43, likes: 4, comments: 0, saves: 0, shares: 1, isTop: false, igPostUrl: "https://www.instagram.com/p/DaF4gDxFkdD/" },
  ] as any[],
  contentMix: { posts: 43, reels: 33, stories: 24 },
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

  opportunities.push({ title: "Evergreen Week Held Reach — Engagement Was the Soft Spot", body: `Accounts reached held roughly steady at ${reach} (outlier-adjusted; a Jun 22 reach spike of 809 on just 95 views was excluded as non-content carryover). Account views ran ${data.kpi.views.value.toLocaleString()} (Metricool) / 3,586 (native daily), with discovery days on Jun 23 (764 views) and Jun 27 (1,097). This was a quieter, evergreen week — a single solo Reel plus two carousels, no collab — so reach normalized while interactions stepped down. The lever now is reopening discovery: bring back the doctor-led / collab Reel format that drove last cycle.`, severity: "info" });

  insights.push({ title: `Engagement Normalized to ${er}%`, body: `${data.kpi.engagements.value} native account interactions against ${reach} accounts reached = ${er}% (native-IG counts per the locked rule; reach is outlier-adjusted). The step down from last week's 8.0% is the collab effect unwinding: that figure sat on a doctor-led collab Reel that pulled deep engagement, while this week's evergreen mix reached comparably but engaged more lightly. The front-tooth-crown Reel was the standout piece — 279 views, 184 reach, 10 likes — but saves stayed at 0 across all content. The reach is intact; the next lever is engagement depth and a return to the collab/doctor-led Reel format.`, severity: "info" });

  const sorted = [
    { name: "Reels", val: data.contentMix.reels },
    { name: "Posts", val: data.contentMix.posts },
    { name: "Stories", val: data.contentMix.stories },
  ].sort((a, b) => b.val - a.val);
  insights.push({ title: "Posts Led the Format Mix This Week", body: `${sorted[0].name} led at ${sorted[0].val}% of published-content views, ${sorted[1].name} ${sorted[1].val}%, ${sorted[2].name} ${sorted[2].val}%. With only one Reel shipped, the two carousels (356 combined views) out-viewed the solo crown Reel (279) and the 6 Stories (205 views). Reels still carried interactions (57% of them on a single piece), but the view mix tilted to feed posts this cycle. The lever is rebuilding Reel cadence — 2–3/week — so discovery doesn't lean on carousels alone.`, severity: "info" });

  const totalSaves = data.posts.reduce((s: number, p: any) => s + (p.saves || 0), 0);
  if (totalSaves < 2) {
    opportunities.push({ title: "Saves Remain the Weak Lever", body: `${totalSaves} saves across the week's owned content — again. Saves are the highest-weighted action in Meta's ranking, and the reach is there (~${reach}). But nothing this week was reference-worthy enough to bookmark — even the well-built crown Reel and the summer-treats explainer drew none. Procedure explainers and before/after carousels with a 'Save this before you book' CTA on the final frame are the fix — and they convert reach into the signal the algorithm rewards.`, severity: "warning" });
  }

  if (data.viewerSplit.nonFollowers >= 45) {
    opportunities.push({ title: "Convert Discovery Into Active Signals", body: `An estimated ${data.viewerSplit.nonFollowers}% of views came from non-followers (split carried — not separately re-exported this cycle). Reach held but interactions were light (${data.kpi.engagements.value} total), and saves were 0. The lever is the active layer: booking-link stickers on high-reach Stories, a save-prompt on Reel end-frames, and a return to the doctor-led format that converted discovery into engagement last cycle.`, severity: "warning" });
  }

  insights.push({ title: "Brand-Search Dependency on Google", body: `Fresh GSC this cycle (7-day, one-day lag): 94 clicks on 15,870 impressions at 0.59% CTR, pos ~35. Most clicks are brand/name terms (nyc dental smiles 10 clicks at 58.8% CTR pos 1.1, dr ben elchami, new dimension dentistry). The standout non-brand asset — the 'nerve pain after onlay' page — drew 7 clicks at position 5.1 this week, still ranking far better than the brand pages (51 clicks over 30 days). That page remains the blueprint for non-brand growth; replicate the template across 5–10 procedure questions.`, severity: "info" });

  insights.push({ title: "Mobile Outranks Desktop on Google", body: "GSC (7-day): Mobile ranks at position 16.7 vs Desktop at 47.7 — a ~2.9× ranking gap on the same content, with mobile converting at 2.67% CTR vs 0.35% on desktop. Mobile nearly matches desktop on clicks (43 vs 50) despite a fraction of the impressions. Mobile experience is the strongest SEO lever right now — audit Core Web Vitals and keep CTAs thumb-reachable above the fold.", severity: "info" });

  const topAge = data.audience.age.reduce((a, b) => (a.pct > b.pct ? a : b));
  insights.push({ title: "Audience Alignment", body: `Primary audience is ${topAge.range} (${topAge.pct}%), with a ${data.audience.gender.male}/${data.audience.gender.female} male/female split. The 25–44 range represents ${(data.audience.age[1]?.pct || 0) + (data.audience.age[2]?.pct || 0)}% — strong patient demographic for cosmetic and restorative work — and New York is the top follower market at ~23%, a tightly local, high-intent base.`, severity: "success" });

  if (data.kpi.followers.change != null && data.kpi.followers.change < 5) {
    opportunities.push({ title: "Follower Conversion Lag", body: `Net +${data.kpi.followers.change} this week (702→704). With an estimated ${data.viewerSplit.nonFollowers}% of views from non-followers and reach holding, the discovery is there — pinned content, a bio CTA refresh, and follow prompts on Story covers would capture more of it.`, severity: "warning" });
  }

  recommendations.push(
    { text: "Rebuild Reel cadence — only one Reel shipped this week and interactions softened. Aim for 2–3/week (provider spotlights, procedure explainers) so discovery doesn't lean on carousels alone", priority: "high" },
    { text: "Bring back the doctor-led / collab Reel format — last cycle's Dr. Laura collab drove the deep engagement this evergreen week lacked. It's the proven lever for reopening reach and interactions together", priority: "high" },
    { text: "Attack the saves problem directly — 0 saves again, across a well-built crown Reel and a summer-treats explainer. Add 'Save this before you book' CTAs to carousel end-frames and booking stickers to high-reach Stories", priority: "high" },
    { text: "Keep Stories as the daily reach engine — 6 Stories (205 views, 89% completion) sustained reach between posts. A recurring BTS / provider-spotlight Story cadence holds the discovery surface open day-to-day", priority: "medium" },
    { text: "Replicate the 'nerve pain after onlay' SEO template — 51 clicks over 30 days at position ~5, still outranking brand terms. Build 5+ procedure-question articles for non-brand growth", priority: "medium" },
    { text: "Investigate the 'appen…workramp.io' website referral (16 sessions / 1.8% at 30d) — recurring likely-spam/datacenter source; confirm and filter before it skews source reporting", priority: "low" },
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
    period: "June 22 – June 28, 2026",
    totalClicks: 58,
    topLinks: [
      { path: "NYCDS 35th Street", clicks: 15 },
      { path: "NYCDS 60th Street", clicks: 14 },
      { path: "NYCDS 58th Street", clicks: 13 },
      { path: "NYCDS 5th Ave", clicks: 11 },
      { path: "Website", clicks: 3 },
      { path: "Homepage", clicks: 2 },
    ],
    trafficSources: [
      { source: "Named NYCDS links (human)", clicks: 58 },
      { source: "Bot / social / excluded", clicks: 69 },
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
    period: "May 30 – June 28, 2026",
    totalClicks: 217,
    topLinks: [
      { path: "NYCDS 60th Street", clicks: 48 },
      { path: "NYCDS 58th Street", clicks: 39 },
      { path: "Website", clicks: 37 },
      { path: "NYCDS 5th Ave", clicks: 37 },
      { path: "NYCDS 35th Street", clicks: 34 },
      { path: "Homepage", clicks: 22 },
    ],
    trafficSources: [
      { source: "Named NYCDS links (human)", clicks: 217 },
      { source: "Bot / social / excluded", clicks: 375 },
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
    period: "June 22 – June 28, 2026",
    sessions: 237,
    topPages: [
      { page: "/", label: "Home", views: 195 },
      { page: "/ourdoctors", label: "Our Doctors", views: 33 },
      { page: "/dr-ben-elchami", label: "Dr. Ben Elchami", views: 22 },
      { page: "/about", label: "About", views: 16 },
      { page: "/implant-dentistry", label: "Implant Dentistry", views: 13 },
      { page: "/why-nycds", label: "Why NYCDS", views: 13 },
      { page: "/prosthodontics", label: "Prosthodontics", views: 12 },
    ],
    trafficSources: [
      { source: "Direct", sessions: 99, pct: 41.8 },
      { source: "Google", sessions: 85, pct: 35.9 },
      { source: "Facebook (paid)", sessions: 25, pct: 10.5 },
      { source: "Audience Network (paid)", sessions: 15, pct: 6.3 },
      { source: "Instagram (paid)", sessions: 7, pct: 3.0 },
      { source: "Other", sessions: 6, pct: 2.5 },
    ],
    devices: [
      { device: "Desktop", pct: 59.8 },
      { device: "Mobile", pct: 39.2 },
    ],
    dailyVisitors: [
      { date: "Jun 22", visitors: 29 },{ date: "Jun 23", visitors: 43 },
      { date: "Jun 24", visitors: 31 },{ date: "Jun 25", visitors: 30 },
      { date: "Jun 26", visitors: 19 },{ date: "Jun 27", visitors: 22 },
      { date: "Jun 28", visitors: 18 },
    ],
    search: {
      totalClicks: 94, totalImpressions: 15870, avgCTR: 0.59, avgPosition: 34.7,
      note: "7-day (one-day GSC lag — through Jun 27)",
      topQueries: [
        { query: "nyc dental smiles", clicks: 10, ctr: 58.82, position: 1.12 },
        { query: "dr ben elchami", clicks: 2, ctr: 11.11, position: 5.11 },
        { query: "new dimension dentistry", clicks: 2, ctr: 22.22, position: 7.89 },
        { query: "dentist in new york", clicks: 1, ctr: 1.09, position: 42.90 },
        { query: "dentist new york city", clicks: 1, ctr: 2.44, position: 39.88 },
      ],
      topPages: [
        { page: "Homepage", clicks: 38, impressions: 13729, ctr: 0.28 },
        { page: "Our Doctors", clicks: 12, impressions: 567, ctr: 2.12 },
        { page: "Dr. Michael Chesner", clicks: 10, impressions: 86, ctr: 11.63 },
        { page: "Nerve Pain After Onlay", clicks: 7, impressions: 663, ctr: 1.06 },
      ],
    },
  };
  const websiteData30d = {
    period: "May 30 – June 28, 2026",
    sessions: 881,
    topPages: [
      { page: "/", label: "Home", views: 681 },
      { page: "/ourdoctors", label: "Our Doctors", views: 163 },
      { page: "/about", label: "About", views: 34 },
      { page: "/locations", label: "Locations", views: 26 },
      { page: "/prosthodontics", label: "Prosthodontics", views: 25 },
      { page: "/dr-ben-elchami", label: "Dr. Ben Elchami", views: 24 },
      { page: "/why-nycds", label: "Why NYCDS", views: 23 },
    ],
    trafficSources: [
      { source: "Direct", sessions: 477, pct: 54.1 },
      { source: "Google", sessions: 295, pct: 33.5 },
      { source: "Facebook (paid)", sessions: 25, pct: 2.8 },
      { source: "appen-workramp (ref)", sessions: 16, pct: 1.8 },
      { source: "Audience Network (paid)", sessions: 15, pct: 1.7 },
      { source: "Instagram", sessions: 14, pct: 1.6 },
      { source: "Other", sessions: 39, pct: 4.4 },
    ],
    devices: [
      { device: "Desktop", pct: 73.5 },
      { device: "Mobile", pct: 25.8 },
    ],
    dailyVisitors: [
      { date: "May 30", visitors: 13 },{ date: "Jun 5", visitors: 17 },
      { date: "Jun 9", visitors: 22 },{ date: "Jun 13", visitors: 20 },
      { date: "Jun 17", visitors: 46 },{ date: "Jun 22", visitors: 29 },
      { date: "Jun 25", visitors: 30 },{ date: "Jun 28", visitors: 18 },
    ],
    search: {
      totalClicks: 319, totalImpressions: 30322, avgCTR: 1.05, avgPosition: 32.3,
      note: "30-day (May 31 – Jun 29)",
      topQueries: [
        { query: "nyc dental smiles", clicks: 36, ctr: 51.43, position: 1.21 },
        { query: "dr ben elchami", clicks: 4, ctr: 6.56, position: 4.28 },
        { query: "nyc dental smile team", clicks: 4, ctr: 18.18, position: 5.18 },
        { query: "nyc smiles", clicks: 3, ctr: 15.79, position: 3.68 },
        { query: "dr farahani dentist", clicks: 3, ctr: 25.00, position: 5.42 },
      ],
      topPages: [
        { page: "Homepage", clicks: 119, impressions: 22372, ctr: 0.53 },
        { page: "Our Doctors", clicks: 61, impressions: 2793, ctr: 2.18 },
        { page: "Nerve Pain After Onlay", clicks: 51, impressions: 2526, ctr: 2.02 },
        { page: "Dr. Michael Chesner", clicks: 29, impressions: 332, ctr: 8.73 },
      ],
    },
  };
  const websiteData = timeRange === "7d" ? websiteData7d : websiteData30d;

  const socialData7d = {
    period: "June 22 – June 28, 2026",
    followers: 704,
    followerGrowth: 4,
    follows: 4,
    unfollows: 0,
    totalViews: 3002,
    totalReach: 925,
    reachChange: 12.3,
    totalInteractions: 21,
    viewSplit: { followers: 40, nonFollowers: 60 },
    engagementSplit: { followers: 60, nonFollowers: 40 },
    viewsByType: { reels: 33, posts: 43, stories: 24 },
    interactionsByType: { reels: 57, posts: 43, stories: 0 },
    totalLikes: 18,
    totalComments: 1,
    totalSaves: 0,
    totalShares: 4,
    storyViews: 205, storyCompletion: 89, storyCount: 6,
    reelAvgWatchTime: "8s", reelSkipRate: "74%",
    dailyViews: [
      { date: "Jun 22", views: 95 },{ date: "Jun 23", views: 764 },
      { date: "Jun 24", views: 301 },{ date: "Jun 25", views: 151 },
      { date: "Jun 26", views: 627 },{ date: "Jun 27", views: 1097 },
      { date: "Jun 28", views: 551 },
    ],
    posts: [
      { id: 1, title: "Front-Tooth Crown — Craftsmanship", type: "Reel", date: "Jun 25", views: 279, reach: 184, likes: 10, comments: 0, saves: 0, shares: 2, er: 6.5, skipRate: 74, avgWatch: "8s", igUrl: "https://www.instagram.com/reel/DaBSbf6xDye/", isTop: true },
      { id: 2, title: "Which Summer Treat Is Toughest?", type: "Post", date: "Jun 26", views: 256, reach: 116, likes: 4, comments: 1, saves: 0, shares: 1, er: 5.2, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/p/DaDpy0ElgCd/", isTop: false },
      { id: 3, title: "Reasons to Smile — National Smile Month", type: "Post", date: "Jun 27", views: 100, reach: 43, likes: 4, comments: 0, saves: 0, shares: 1, er: 12.0, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/p/DaF4gDxFkdD/", isTop: false },
    ],
  };
  const socialData30d = {
    period: "May 30 – June 28, 2026",
    followers: 704,
    followerGrowth: 23,
    follows: 35,
    unfollows: 12,
    totalViews: 11648,
    totalReach: 2460,
    reachChange: 20.8,
    totalInteractions: 348,
    viewSplit: { followers: 31.3, nonFollowers: 68.7 },
    engagementSplit: { followers: 56.1, nonFollowers: 43.9 },
    viewsByType: { reels: 60.0, posts: 18.3, stories: 21.7 },
    interactionsByType: { reels: 69.5, posts: 14.4, stories: 16.1 },
    totalLikes: 280,
    totalComments: 14,
    totalSaves: 8,
    totalShares: 46,
    storyViews: 205, storyCompletion: 89, storyCount: 6,
    reelAvgWatchTime: "8–79s",
    reelSkipRate: "56–74%",
    dailyViews: [
      { date: "May 30", views: 350 },{ date: "Jun 4", views: 980 },
      { date: "Jun 5", views: 760 },{ date: "Jun 15", views: 1150 },
      { date: "Jun 18", views: 520 },{ date: "Jun 23", views: 764 },
      { date: "Jun 27", views: 1097 },{ date: "Jun 28", views: 551 },
    ],
    posts: [
      { id: 1, title: "Authenticity in Dentistry · Collab w/ EEC", type: "Reel", date: "Jun 4", views: 3600, reach: 761, likes: 0, comments: 0, saves: 0, shares: 0, er: 3.5, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/reel/DZK-h6ZAO_d/", isTop: true },
      { id: 2, title: "Plot Twist: We're All Concierge Dentists · Collab w/ EEC", type: "Reel", date: "Jun 15", views: 3100, reach: 655, likes: 0, comments: 0, saves: 0, shares: 0, er: 3.0, skipRate: 0, avgWatch: "8s", igUrl: "https://www.instagram.com/reel/DZnrjSHhL4a/", isTop: false },
      { id: 3, title: "Is Dentistry Losing Its Soul? · Collab w/ EEC", type: "Reel", date: "Jun 5", views: 1700, reach: 359, likes: 0, comments: 0, saves: 0, shares: 0, er: 4.0, skipRate: 0, avgWatch: "8s", igUrl: "https://www.instagram.com/reel/DZOF7qTBswB/", isTop: false },
      { id: 4, title: "Advancing Care Through Digital Dentistry", type: "Post", date: "Jun 18", views: 878, reach: 186, likes: 0, comments: 0, saves: 0, shares: 0, er: 2.0, skipRate: 0, avgWatch: "—", igUrl: "", isTop: false },
      { id: 5, title: "Front-Tooth Crown — Craftsmanship", type: "Reel", date: "Jun 25", views: 279, reach: 184, likes: 10, comments: 0, saves: 0, shares: 2, er: 6.5, skipRate: 74, avgWatch: "8s", igUrl: "https://www.instagram.com/reel/DaBSbf6xDye/", isTop: false },
      { id: 6, title: "Which Summer Treat Is Toughest?", type: "Post", date: "Jun 26", views: 256, reach: 116, likes: 4, comments: 1, saves: 0, shares: 1, er: 5.2, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/p/DaDpy0ElgCd/", isTop: false },
    ],
  };
  const socialData = timeRange === "7d" ? socialData7d : socialData30d;
  const overviewKpis = timeRange === "7d" ? [
    { label: "Followers", value: 704, change: "+4", delay: 0 },
    { label: "Views", value: 3002, delay: 80 },
    { label: "Reach", value: 925, change: "+12.3%", delay: 160 },
    { label: "Interactions", value: 21, delay: 240 },
    { label: "Non-Follower", value: "~60%", delay: 320 },
  ] : [
    { label: "Followers", value: 704, change: "+23", delay: 0 },
    { label: "Views", value: 11648, delay: 80 },
    { label: "Reach", value: 2460, delay: 160 },
    { label: "Interactions", value: 348, delay: 240 },
    { label: "Non-Follower", value: "~69%", delay: 320 },
  ];


  const adsData = {
    period: "May 30 – June 28, 2026",
    campaign: "Summer Campaign Ads",
    totalSpend: 196.71,
    budget: 250,
    impressions: 10944,
    reach: 7867,
    activeAds: 2,
    pctOfViews: 11.3,
    pctOfInteractions: 2.0,
    ads: [
      { name: "Summer smiles start here", spend: 166.94, impressions: 8675, reach: 5933, quality: "Below average (bottom 35%)" },
      { name: "Make it a summer to remember", spend: 29.77, impressions: 2269, reach: 1934, quality: "—" },
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
            <div><div className="exec-col-title">Discovery</div><div className="exec-col-body">An estimated {d.viewerSplit.nonFollowers}% of views came from non-followers (split carried — not separately re-exported). Reach held roughly steady at <em>~925 accounts</em> (outlier-adjusted; a Jun 22 reach spike of 809 on 95 views was excluded as non-content carryover). The solo front-tooth-crown Reel (Jun 25) reached well at 184, and account views ran 3,002 (Metricool) / 3,586 (native daily). A quieter, evergreen week with no collab — discovery was intact but narrower than last cycle's doctor-led Reel.</div></div>
            <div><div className="exec-col-title">Engagement</div><div className="exec-col-body">21 native interactions, ~2.3% engagement rate (21 &divide; 925 reach; native-IG counts, reach outlier-adjusted) — down from last week's collab-boosted 8.0% as the doctor-led Reel effect unwound. The crown Reel was the standout piece (10 likes on 184 reach), but saves stayed at 0 across all content. Reach held; engagement depth is the lever. Followers 702&rarr;704. 25&ndash;44 demo = 59.6%.</div></div>
            <div><div className="exec-col-title">Content</div><div className="exec-col-body">Posts led published-content views at {d.contentMix.posts}%, Reels {d.contentMix.reels}%, Stories {d.contentMix.stories}% — with only one Reel shipped, the two carousels (356 views) out-viewed the solo crown Reel (279) and 6 Stories (205). Fresh GSC this cycle (7-day): 94 clicks at pos ~35, brand-search heavy, with the nerve-pain page (7 clicks, pos 5.1) outranking the brand pages. Mobile ranks ~2.9&times; better than desktop — still the SEO lever.</div></div>
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
            <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ A quieter, evergreen week — the solo front-tooth-crown Reel (Jun 25) pulled 279 views, 184 reach and an ~8s average watch time, the strongest single piece. Two carousels out-viewed it on the feed. Reach held (~925) but interactions softened to 21 (2.3% native ER), with Reels still carrying 57% of them.</span>
          </div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Watch Time Analytics</div><div style={{ textAlign: "center", padding: "8px 0 22px" }}><div className="big-num">{d.kpi.watchTime.value}</div><div style={{ fontSize: 12, color: "#9B9196", marginTop: 2 }}>Avg Watch / Reel</div></div><div style={{ display: "flex", gap: 14 }}><div className="stat-box"><div className="big-num-sm plum">279</div><div className="stat-label">Reel Views</div></div><div className="stat-box"><div className="big-num-sm steel">{d.kpi.views.value.toLocaleString()}</div><div className="stat-label">Total Views</div></div></div><div className="alert-box plum-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>✦ The front-tooth-crown Reel held an ~8s average watch time on 279 views with a 74% skip rate — solid for a short evergreen clip, but well below last cycle's doctor-led Reel (1m 19s). The lever is bringing back the &ldquo;Ask the Doctor&rdquo; / philosophy format that holds attention longer.</span></div></div>
            <div className="card"><div className="card-hd">Engagement Breakdown</div><div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{[{ label: "Likes", value: d.posts.reduce((s: number, p: any) => s + (p.likes||0), 0), max: 15, color: "#6F5060" }, { label: "Comments", value: d.posts.reduce((s: number, p: any) => s + (p.comments||0), 0), max: 15, color: "#8FA1A6" }, { label: "Shares", value: d.posts.reduce((s: number, p: any) => s + (p.shares||0), 0), max: 15, color: "#A6968D" }, { label: "Saves", value: d.posts.reduce((s: number, p: any) => s + (p.saves||0), 0), max: 15, color: "#BE5A5A" }].map((m) => (<div key={m.label} style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 72, fontSize: 13, fontWeight: 500 }}>{m.label}</div><div style={{ flex: 1, height: 10, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}><div style={{ width: `${(Math.max(m.value, 0.5) / m.max) * 100}%`, height: "100%", background: m.color, borderRadius: 99, transition: "width 1.2s ease" }} /></div><div className="display-num" style={{ width: 30, textAlign: "right" as const }}>{m.value}</div></div>))}</div><div className="alert-box danger-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#BE5A5A" }}>▲ Account engagement normalized to 2.3% (21 native interactions ÷ 925 reach), with Reels carrying 57% of it. The owned-content breakdown below (18 likes, 4 shares, 1 comment, 0 saves on the 3 new pieces) shows the gap: reach is intact but active signals — especially saves — are flat. &ldquo;Save this before you book&rdquo; CTAs and booking stickers are the lever.</span></div></div>
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
            <InsightCard title={"Link Attribution · " + linkData.period} body={timeRange === "7d" ? "58 attributed human clicks over 7 days across the six allowlisted NYCDS links — 35th Street (15) led, then 60th Street (14), 58th Street (13), 5th Ave (11), Website (3) and Homepage (2). That 58 ties out cleanly to the 60 domain human-clicks. The /* wildcard (7), LinkedIn/FB/IG social links and bot/datacenter traffic are excluded. No /DDS-PC-Midtown or /DDS-PC-UES clicks appeared this week, so nothing was merged to EEC. Note: only path-level clicks were re-exported this cycle — geo/device panels below are carried from the prior pull and flagged accordingly." : "217 attributed human clicks over 30 days across the four office links plus Website and Homepage — 60th Street (48), 58th Street (39), Website (37), 5th Ave (37), 35th Street (34) and Homepage (22); all four locations active. The /* wildcard (214), social links and bot/datacenter traffic are excluded. No DDS-PC clicks appeared at 30 days either. Geo/device panels are carried from the prior pull (path-level only re-exported this cycle)." } severity="info" />
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
            <InsightCard title={"Website + Search · " + websiteData.period} body={timeRange === "7d" ? "237 sessions over 7 days (~34/day). Direct leads at 41.8% (99), Google 35.9% (85), then paid social — Facebook 10.5% (25), Audience Network 6.3% (15), Instagram 3.0% (7). Desktop 59.8% / Mobile 39.2%. The doctor pages are the engine — /ourdoctors (33) and /dr-ben-elchami (22) trail Home (195). Fresh GSC this cycle (7-day, one-day lag): 94 clicks, 0.59% CTR, pos ~35, brand-dominant." : "881 sessions over 30 days. Direct 54.1% (477) and Google 33.5% (295) carry ~88% combined. Desktop 73.5% / Mobile 25.8%. /ourdoctors (163) is the clear #2 page — provider pages are the conversion surface. ⚠ The 'appen…workramp.io' referral recurs (16 sessions / 1.8%) — same likely-spam/datacenter source as prior cycles; confirm and filter. GSC: the Nerve Pain After Onlay page (51 clicks, pos ~5) still outranks every brand term — the non-brand SEO template to replicate."} severity="info" />
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
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>⚡ Reach held roughly steady (~925, outlier-adjusted) on an evergreen, no-collab week, with discovery days on Jun 23 (764 views) and Jun 27 (1,097). Engagement normalized to 2.3% (21 native interactions). The Jun 22 reach reading of 809 on just 95 views was excluded as non-content carryover. (Daily series is the native Profile Growth &amp; Discovery export — reach is outlier-adjusted.)</span>
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
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Posts led views (43%) this week with only one Reel shipped, but that solo crown Reel still carried 57% of interactions; carousels took 43% and Stories none. The lever is rebuilding Reel cadence so discovery doesn't lean on carousels alone.</span>
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
                <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>▲ One Reel shipped this week (front-tooth crown, Jun 25) — 279 views at an ~8s average watch time and a 74% skip rate. It reached well (184) and drew 10 likes but 0 saves. The lever is a clear CTA / save-prompt and a return to the longer doctor-led format that held a 1m 19s watch last cycle.</span>
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
                <div style={{ fontSize: 36, fontWeight: 700, color: "#6F5060" }}>0.13%</div>
                <div style={{ fontSize: 12, color: "#9B9196", marginTop: 4 }}>Views → Follower Conversion</div>
              </div>
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(143,161,166,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#8FA1A6" }}>3,002</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>views</div>
                </div>
                <div style={{ flex: 0, display: "flex", alignItems: "center", fontSize: 16, color: "#D9CCC1" }}>→</div>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(143,161,166,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#8FA1A6" }}>925</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>reached</div>
                </div>
                <div style={{ flex: 0, display: "flex", alignItems: "center", fontSize: 16, color: "#D9CCC1" }}>→</div>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(111,80,96,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#6F5060" }}>+4</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>followers</div>
                </div>
              </div>
              <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(111,80,96,0.10)", borderRadius: 10, border: "1px solid rgba(111,80,96,0.25)" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>▲ Reach held (~925) but engagement normalized to 2.3% (21 native interactions) on a no-collab week. The gap is active signals — 0 saves across all content; add booking-CTA and save-prompt stickers and bring back the doctor-led Reel format to convert reach into interaction.</span>
              </div>
            </div>
          </div>

          <div className="card">
            <InsightCard title={"Social Intelligence · " + socialData.period} body={timeRange === "7d" ? "3,002 account views (Metricool; 3,586 native daily) with reach holding ~925 (outlier-adjusted) and engagement normalizing to 2.3% (21 native interactions ÷ 925) — a quieter, evergreen week with no collab, so reach held but interactions stepped down from last cycle's doctor-led Reel. Reels still carried 57% of interactions on a single piece. The front-tooth-crown Reel is the standout — 279 views, 184 reach, ~8s watch time — but saves stayed at 0 across all content. The lever is engagement depth and a return to the doctor-led / collab format." : "11,648 native account views reaching 2,460 accounts over Jun 1–28 (+20.8% reach) with 348 interactions — far ahead of the in-week figure, because the month's top content was the NYC Dental Smiles × EEC collab Reels: 'Authenticity in Dentistry' (3.6K NYCDS-side views, Jun 4), 'Plot Twist: We're All Concierge Dentists' (3.1K, Jun 15) and 'Is Dentistry Losing Its Soul?' (1.7K, Jun 5). Reels drove 60% of views and 69.5% of interactions; 68.7% of views came from non-followers. Paid 'Summer Campaign' ads contributed ~11.3% of views and 2.0% of interactions (see Paid Ads). Collab-reel reach/ER are modeled from account-level ratios — NYCDS-side per-post reach wasn't separately exported."} severity="success" />
            <InsightCard title="Key Insight" body="This was a quieter, evergreen week. With one solo Reel and two carousels (no collab), reach held roughly steady (~925, outlier-adjusted) but engagement normalized to 2.3% (21 native interactions ÷ 925) — down from last cycle's collab-boosted 8.0%. The front-tooth-crown Reel was the strongest piece (279 views, 184 reach, 10 likes) and still carried 57% of interactions. What's working: solid evergreen reach and a clean website/search funnel. What's not yet: engagement depth and saves — 0 saves across all content, and the view mix tilted to feed posts as Reel cadence dipped to one. Two levers: (1) rebuild Reel cadence to 2–3/week and bring back the doctor-led / collab format that drove deep engagement last cycle, and (2) add save-prompts and booking stickers to convert reach into action." severity="info" />
          </div>
        </>)}

        {tab === "ads" && (<>
          <div className="kpi-row">
            {[
              { label: "Total Spend", value: "$196.71", delay: 0 },
              { label: "Impressions", value: adsData.impressions, delay: 80 },
              { label: "Paid Reach", value: adsData.reach, delay: 160 },
              { label: "Active Ads", value: adsData.activeAds, delay: 240 },
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
              <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ ~$197 spent across the Summer Campaign for 10,944 impressions and 7,867 paid reach — about $0.025 per reached account. The whole set runs on a single $250 lifetime ad-set budget (Meta repeats that ad-set figure on each ad row, so it is not $250 per ad), leaving headroom to shift more toward the winner.</span>
            </div>
          </div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Spend Allocation</div>
              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <Donut data={[{ value: 85 }, { value: 15 }]} colors={["#6F5060", "#8FA1A6"]} size={120} stroke={18} />
                <div style={{ flex: 1 }}>
                  {[{ label: "Summer smiles start here", value: 85, color: "#6F5060" }, { label: "Make it a summer to remember", value: 15, color: "#8FA1A6" }].map((item) => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{item.label}</span>
                      <span className="display-num">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card"><div className="card-hd">Paid Contribution · Native IG (June)</div>
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
                <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Paid also sent 47 of the week's 237 website sessions (Facebook / Audience Network / Instagram).</span>
              </div>
            </div>
          </div>
          <div className="card">
            <InsightCard title={"Paid Ads · " + adsData.campaign} body="Two ads ran in the Summer Campaign set (May 30 – Jun 28). 'Summer smiles start here' took 85% of spend ($166.94) and most of the delivery (8,675 impressions / 5,933 reach) but carries a below-average quality ranking (bottom 35% of ads) — the creative or audience targeting needs a refresh to bring delivery cost down. 'Make it a summer to remember' ran lean ($29.77 / 2,269 impressions) and has no quality flag. Together they generated about 11.3% of June account views and 2.0% of interactions. ▲ No conversion events were tracked on either ad (Results blank), so there is no cost-per-booking yet — add a Lead or Booking event so next cycle can measure ROI, not just reach." severity="warning" />
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
