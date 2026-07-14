"use client";
import { useState, useEffect } from "react";

const FALLBACK_DATA = {
  client: { name: "NYCDS", fullName: "NYC Dental Smiles", period: "July 6 – July 12, 2026" },
  kpi: {
    followers: { value: 723, change: 10, label: "Followers" },
    reach: { value: 7098, label: "Reach" },
    views: { value: 4573, label: "Total Views" },
    engagementRate: { value: 2.3, label: "Engagement Rate", suffix: "%" },
    engagements: { value: 163, label: "Engagements" },
    watchTime: { value: "13s", label: "Watch Time" },
  },
  posts: [
    { id: 1, title: "When Patients No Longer Dread the Dentist (Reel)", type: "Reel", views: 841, reach: 465, likes: 32, comments: 8, saves: 1, shares: 10, isTop: true, igPostUrl: "https://www.instagram.com/reel/Dan-hMNxehU/" },
    { id: 2, title: "What Keeps Patients Coming Back — Oleksandr (Reel)", type: "Reel", views: 570, reach: 350, likes: 23, comments: 2, saves: 0, shares: 7, isTop: false, igPostUrl: "https://www.instagram.com/reel/DaqGc-npEIe/" },
    { id: 3, title: "Craving Chocolate This Summer? (Carousel)", type: "Post", views: 225, reach: 72, likes: 4, comments: 5, saves: 0, shares: 0, isTop: false, igPostUrl: "https://www.instagram.com/p/DalUNMBFqUc/" },
  ] as any[],
  contentMix: { posts: 21, reels: 62, stories: 17 },
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

function generateInsights(data: ReportData) {
  const insights: { title: string; body: string; severity: string }[] = [];
  const opportunities: typeof insights = [];
  const recommendations: { text: string; priority: string }[] = [];
  const alerts: typeof insights = [];

  const er = data.kpi.engagementRate.value;
  const reach = data.kpi.reach.value;

  opportunities.push({ title: "Patient-Testimonial Reels Broke Through — Organic Took Share Back From Paid", body: `Account reach ran ${reach.toLocaleString()} for the week (Metricool avg. reach/day of 1,014 × 7; +111% WoW off last cycle's 3,360 — flagged because the retired Profile Growth CSV means no daily-series outlier adjustment). Account views ran ${data.kpi.views.value.toLocaleString()}, ~${data.viewerSplit.nonFollowers}% from non-followers, and reach is still ~96% non-follower — paid is running underneath. But the shift this cycle is real: Ads fell to 42% of content-type views (from 73%) as two patient-testimonial Reels carried the organic side — Jul 10 "no longer dread the dentist" (841 views, 465 reach, 10.97% ER) and Jul 11 Oleksandr's testimonial (570 / 350, 9.14% ER). Interactions nearly quadrupled to ${data.kpi.engagements.value}. The lever now is holding this testimonial-Reel cadence and adding a doctor-led / collab Reel on top.`, severity: "success" });

  insights.push({ title: `Blended Engagement Rate ${er}% — Up 77% as Organic Scaled`, body: `${data.kpi.engagements.value} account-level interactions (Reel 111 / Post 33 / Story 15 / Ad 4, per the locked account-level rule — not the published-content actions) against ${reach.toLocaleString()} accounts reached = ${er}%, up from 1.3% last cycle even though reach more than doubled. That's the meaningful part: the rate rose *while* the denominator grew. Reels drove 70% of all interactions. Paid ad reach still dilutes the blend — ads carried 849 of the ~967 avg daily reach — so read it against the organic per-content rates, which are strong: the Jul 10 Reel hit 10.97%, the Oleksandr Reel 9.14%, and the chocolate carousel 12.5% on tight reach (9 interactions / 72 reach). Eighty unique accounts engaged. Owned organic engagement is now doing real work, not just the paid layer.`, severity: "success" });

  const sorted = [
    { name: "Reels", val: data.contentMix.reels },
    { name: "Posts", val: data.contentMix.posts },
    { name: "Stories", val: data.contentMix.stories },
  ].sort((a, b) => b.val - a.val);
  insights.push({ title: "Reels Dominated the Format Mix — and the Watch Time Jumped", body: `${sorted[0].name} led at ${sorted[0].val}% of published-content views, ${sorted[1].name} ${sorted[1].val}%, ${sorted[2].name} ${sorted[2].val}%. Two testimonial Reels (1,411 combined views, 815 reach) far out-viewed the single carousel (225) and the 4 Stories (183 impressions), and carried 111 of 159 organic interactions. The quality signal is the headline: average watch time roughly doubled to ~13s (12.2s and 14.4s) and view-through rate hit 43–47%, so skip rate fell from ~75% to ~55%. Real patient voices held attention in a way the brand-voice Reels did not. The lever is holding 2–3 testimonial Reels/week.`, severity: "success" });

  const totalSaves = data.posts.reduce((s: number, p: any) => s + (p.saves || 0), 0);
  if (totalSaves < 3) {
    opportunities.push({ title: "Saves Are Still the Weak Lever", body: `${totalSaves} save across the week's owned content — the Jul 10 testimonial Reel earned the only one, even as shares jumped to 17 and comments to 15. Saves are the highest-weighted action in Meta's ranking, and reach was abundant (${reach.toLocaleString()}). Testimonials clearly earn shares and conversation, but nothing this week was reference-worthy enough to bookmark. Procedure explainers and before/after carousels with a 'Save this before you book' CTA on the final frame are the fix — the format gap, not an audience problem.`, severity: "warning" });
  }

  if (data.viewerSplit.nonFollowers >= 45) {
    opportunities.push({ title: "Convert a Non-Follower Wave Into Active Signals", body: `~${data.viewerSplit.nonFollowers}% of views (3,138 of 4,399) and ~96% of reach came from non-followers this week — the widest discovery wave in the file, now driven by both paid and the testimonial Reels. Yet net follower add was only +${data.kpi.followers.change} and saves were 1. The lever is the active layer: a follow-prompt and save-prompt on Reel end-frames, booking-link stickers on Stories and the paid placements. The testimonial Reels are earning attention and holding it (~13s watch); the gap is asking viewers to act on it.`, severity: "warning" });
  }

  insights.push({ title: "Brand-Search Dependency on Google", body: `Fresh GSC this cycle (Jul 6–12): 86 clicks on 6,902 impressions at 1.25% CTR, pos ~31 — clicks and CTR both up on last cycle's 76 / 1.15%. Most clicks are brand/name terms (nyc dental smiles 11 clicks at 64.7% CTR pos 1.5, nyc smiles 4, nyc dental smile team 2). The standout non-brand asset — the 'nerve pain after onlay' page — held 15 clicks at position 5.0, still outranking the brand pages and pacing 55 clicks over a true 30-day window. The cluster is compounding: 'onlay hurts when i bite down' and 'pain after onlay' now both rank inside the top 3. Meanwhile the generic head terms are pure opportunity cost — 'dentist new york' drew 432 impressions for 1 click at position 46. That page template remains the blueprint; replicate it across 5–10 procedure questions.`, severity: "info" });

  insights.push({ title: "Mobile Now Out-Clicks Desktop on Google", body: "GSC (30-day): Mobile ranks at position 18.4 vs Desktop at 42.4 — a ~2.3× ranking gap on the same content, with mobile converting at 2.54% CTR vs 0.59% on desktop. Mobile now out-clicks desktop outright (179 vs 171) on roughly a quarter of the impressions, and the gap widened again this cycle. Mobile experience is the strongest SEO lever available — audit Core Web Vitals and keep CTAs thumb-reachable above the fold.", severity: "info" });

  const topAge = data.audience.age.reduce((a, b) => (a.pct > b.pct ? a : b));
  insights.push({ title: "Audience Alignment", body: `Primary audience is ${topAge.range} (${topAge.pct}%), with a ${data.audience.gender.male}/${data.audience.gender.female} male/female split (demographic table carried — not re-exported this cycle). The 25–44 range represents ${(data.audience.age[1]?.pct || 0) + (data.audience.age[2]?.pct || 0)}% — strong patient demographic for cosmetic and restorative work — and New York is the top follower market at 22.9%, a tightly local, high-intent base.`, severity: "success" });

  if (data.kpi.followers.change != null && data.kpi.followers.change < 12) {
    opportunities.push({ title: "Follower Conversion Lag", body: `Net +${data.kpi.followers.change} this week (713→723). With ~${data.viewerSplit.nonFollowers}% of views from non-followers and reach more than doubling, the discovery was there — but little of it converted to follows. The testimonial Reels are holding attention (~13s avg watch, 43–47% view-through), which makes the end-frame the highest-value real estate on the account: a follow prompt and save prompt there, plus a bio CTA refresh and pinned testimonial, would capture more of this wave.`, severity: "warning" });
  }

  recommendations.push(
    { text: "Double down on patient-testimonial Reels — the format that worked. Jul 10 and Jul 11 delivered 841 and 570 views at 10.97% and 9.14% ER, with watch time roughly doubling to ~13s and skip rate falling from 75% to ~55%. Real patient voices hold attention; brand-voice Reels did not. Build a standing pipeline of patient stories", priority: "high" },
    { text: "Put follow/save CTAs on the Reel end-frame — attention is now being held to ~13s with 43–47% view-through, but only +10 follows and 1 save came of it. The end-frame is the highest-value real estate on the account right now", priority: "high" },
    { text: "Bring in the doctor-led / collab Reel — testimonials reopened organic discovery; a collab compounds it. Pair with the ongoing paid push, which is already ceding view share to organic (73% → 42%)", priority: "high" },
    { text: "Attack the saves problem — 1 save all week despite 17 shares and 15 comments. Testimonials earn shares; explainers earn saves. Add 'Save this before you book' CTAs to procedure carousels and before/after content", priority: "medium" },
    { text: "Replicate the 'nerve pain after onlay' SEO template — 55 clicks over 30 days at position 5.2, still outranking brand terms, and the cluster is compounding ('onlay hurts when i bite down' now ranks top 3). Build 5+ procedure-question articles; the generic head terms ('dentist new york': 432 impressions, 1 click, pos 46) are unwinnable by comparison", priority: "medium" },
    { text: "Lean into mobile SEO — mobile now out-clicks desktop (179 vs 171 over 30 days) and ranks ~2.3× better (18.4 vs 42.4). Audit Core Web Vitals and keep booking CTAs thumb-reachable above the fold", priority: "low" },
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
    period: "July 6 – July 12, 2026",
    totalClicks: 71,
    topLinks: [
      { path: "NYCDS 60th Street", clicks: 20 },
      { path: "Homepage", clicks: 15 },
      { path: "NYCDS 5th Ave", clicks: 12 },
      { path: "NYCDS 35th Street", clicks: 10 },
      { path: "NYCDS 58th Street", clicks: 9 },
      { path: "Website", clicks: 5 },
    ],
    trafficSources: [
      { source: "Named NYCDS links (human)", clicks: 71 },
      { source: "Wildcard / social / excluded", clicks: 13 },
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
    period: "June 13 – July 12, 2026",
    totalClicks: 361,
    topLinks: [
      { path: "Website", clicks: 107 },
      { path: "NYCDS 60th Street", clicks: 78 },
      { path: "NYCDS 5th Ave", clicks: 64 },
      { path: "NYCDS 58th Street", clicks: 45 },
      { path: "NYCDS 35th Street", clicks: 45 },
      { path: "Homepage", clicks: 22 },
    ],
    trafficSources: [
      { source: "Named NYCDS links (human)", clicks: 361 },
      { source: "Wildcard / social / DDS-PC / excluded", clicks: 184 },
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
    period: "July 6 – July 12, 2026",
    sessions: 227,
    topPages: [
      { page: "/", label: "Home", views: 212 },
      { page: "/ourdoctors", label: "Our Doctors", views: 43 },
      { page: "/locations", label: "Locations", views: 19 },
      { page: "/about", label: "About", views: 14 },
      { page: "/why-nycds", label: "Why NYCDS", views: 10 },
      { page: "/cosmetic-dentistry", label: "Cosmetic Dentistry", views: 7 },
      { page: "/nerve-pain-after-onlay", label: "Nerve Pain After Onlay", views: 5 },
    ],
    trafficSources: [
      { source: "Direct", sessions: 119, pct: 52.6 },
      { source: "Google", sessions: 72, pct: 31.8 },
      { source: "Instagram (paid)", sessions: 14, pct: 6.3 },
      { source: "Facebook (paid)", sessions: 8, pct: 3.4 },
      { source: "Audience Network (paid)", sessions: 5, pct: 2.1 },
      { source: "Other", sessions: 9, pct: 3.9 },
    ],
    devices: [
      { device: "Desktop", pct: 67.9 },
      { device: "Mobile", pct: 31.4 },
    ],
    dailyVisitors: [
      { date: "Jul 6", visitors: 28 },{ date: "Jul 7", visitors: 30 },
      { date: "Jul 8", visitors: 30 },{ date: "Jul 9", visitors: 55 },
      { date: "Jul 10", visitors: 27 },{ date: "Jul 11", visitors: 28 },
      { date: "Jul 12", visitors: 29 },
    ],
    search: {
      totalClicks: 86, totalImpressions: 6902, avgCTR: 1.25, avgPosition: 30.9,
      note: "GSC Jul 6 – Jul 12 (nycdentalsmiles.com)",
      topQueries: [
        { query: "nyc dental smiles", clicks: 11, ctr: 64.71, position: 1.53 },
        { query: "nyc smiles", clicks: 4, ctr: 57.14, position: 1.00 },
        { query: "nyc dental smile team", clicks: 2, ctr: 33.33, position: 2.83 },
        { query: "new dimension dentistry", clicks: 1, ctr: 12.50, position: 2.25 },
        { query: "pain after onlay", clicks: 1, ctr: 14.29, position: 3.29 },
      ],
      topPages: [
        { page: "Homepage", clicks: 36, impressions: 4553, ctr: 0.79 },
        { page: "Nerve Pain After Onlay", clicks: 15, impressions: 751, ctr: 2.00 },
        { page: "Locations", clicks: 10, impressions: 223, ctr: 4.48 },
        { page: "Our Doctors", clicks: 9, impressions: 717, ctr: 1.26 },
      ],
    },
  };
  const websiteData30d = {
    period: "June 13 – July 12, 2026",
    sessions: 973,
    topPages: [
      { page: "/", label: "Home", views: 763 },
      { page: "/ourdoctors", label: "Our Doctors", views: 155 },
      { page: "/locations", label: "Locations", views: 67 },
      { page: "/about", label: "About", views: 50 },
      { page: "/why-nycds", label: "Why NYCDS", views: 35 },
      { page: "/cosmetic-dentistry", label: "Cosmetic Dentistry", views: 25 },
      { page: "/dr-ben-elchami", label: "Dr. Ben Elchami", views: 23 },
    ],
    trafficSources: [
      { source: "Direct", sessions: 512, pct: 52.6 },
      { source: "Google", sessions: 309, pct: 31.8 },
      { source: "Instagram (paid)", sessions: 61, pct: 6.3 },
      { source: "Facebook (paid)", sessions: 33, pct: 3.4 },
      { source: "Audience Network (paid)", sessions: 20, pct: 2.1 },
      { source: "Other", sessions: 38, pct: 3.9 },
    ],
    devices: [
      { device: "Desktop", pct: 67.9 },
      { device: "Mobile", pct: 31.4 },
    ],
    dailyVisitors: [
      { date: "Jun 14", visitors: 16 },{ date: "Jun 17", visitors: 46 },
      { date: "Jun 23", visitors: 43 },{ date: "Jun 28", visitors: 21 },
      { date: "Jul 2", visitors: 33 },{ date: "Jul 6", visitors: 28 },
      { date: "Jul 9", visitors: 55 },{ date: "Jul 12", visitors: 29 },
    ],
    search: {
      totalClicks: 360, totalImpressions: 36025, avgCTR: 1.00, avgPosition: 37.7,
      note: "GSC Jun 13 – Jul 12 (nycdentalsmiles.com)",
      topQueries: [
        { query: "nyc dental smiles", clicks: 44, ctr: 57.14, position: 1.30 },
        { query: "nyc dental smile team", clicks: 6, ctr: 28.57, position: 1.67 },
        { query: "nyc smiles", clicks: 6, ctr: 30.00, position: 1.40 },
        { query: "dr ben elchami", clicks: 5, ctr: 7.46, position: 5.28 },
        { query: "new dimension dentistry", clicks: 3, ctr: 8.82, position: 5.82 },
      ],
      topPages: [
        { page: "Homepage", clicks: 136, impressions: 26396, ctr: 0.52 },
        { page: "Nerve Pain After Onlay", clicks: 55, impressions: 2918, ctr: 1.88 },
        { page: "Our Doctors", clicks: 53, impressions: 3324, ctr: 1.59 },
        { page: "Dr. Michael Chesner", clicks: 29, impressions: 323, ctr: 8.98 },
      ],
    },
  };
  const websiteData = timeRange === "7d" ? websiteData7d : websiteData30d;

  const socialData7d = {
    period: "July 6 – July 12, 2026",
    followers: 723,
    followerGrowth: 10,
    follows: 10,
    unfollows: 0,
    totalViews: 4573,
    totalReach: 7098,
    reachChange: 111.2,
    totalInteractions: 163,
    viewSplit: { followers: 28, nonFollowers: 72 },
    engagementSplit: { followers: 60, nonFollowers: 40 },
    viewsByType: { reels: 62, posts: 21, stories: 17 },
    interactionsByType: { reels: 70, posts: 21, stories: 9 },
    totalLikes: 59,
    totalComments: 15,
    totalSaves: 1,
    totalShares: 17,
    storyViews: 183, storyCompletion: 89, storyCount: 4,
    reelAvgWatchTime: "13s", reelSkipRate: "55%",
    dailyViews: [
      { date: "Jul 6", views: 300 },{ date: "Jul 7", views: 320 },
      { date: "Jul 8", views: 180 },{ date: "Jul 9", views: 640 },
      { date: "Jul 10", views: 900 },{ date: "Jul 11", views: 1080 },
      { date: "Jul 12", views: 1153 },
    ],
    posts: [
      { id: 1, title: "When Patients No Longer Dread the Dentist", type: "Reel", date: "Jul 10", views: 841, reach: 465, likes: 32, comments: 8, saves: 1, shares: 10, er: 10.97, skipRate: 57, avgWatch: "12s", igUrl: "https://www.instagram.com/reel/Dan-hMNxehU/", isTop: true },
      { id: 2, title: "What Keeps Patients Coming Back — Oleksandr", type: "Reel", date: "Jul 11", views: 570, reach: 350, likes: 23, comments: 2, saves: 0, shares: 7, er: 9.14, skipRate: 53, avgWatch: "14s", igUrl: "https://www.instagram.com/reel/DaqGc-npEIe/", isTop: false },
      { id: 3, title: "Craving Chocolate This Summer? (Carousel)", type: "Post", date: "Jul 9", views: 225, reach: 72, likes: 4, comments: 5, saves: 0, shares: 0, er: 12.50, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/p/DalUNMBFqUc/", isTop: false },
    ],
  };
  const socialData30d = {
    period: "June 13 – July 12, 2026",
    followers: 723,
    followerGrowth: 28,
    follows: 28,
    unfollows: 0,
    totalViews: 15370,
    totalReach: 13980,
    reachChange: 85.7,
    totalInteractions: 326,
    viewSplit: { followers: 27, nonFollowers: 73 },
    engagementSplit: { followers: 56, nonFollowers: 44 },
    viewsByType: { reels: 52, posts: 31, stories: 17 },
    interactionsByType: { reels: 59, posts: 30, stories: 11 },
    totalLikes: 120,
    totalComments: 16,
    totalSaves: 2,
    totalShares: 24,
    storyViews: 974, storyCompletion: 89, storyCount: 19,
    reelAvgWatchTime: "7–14s",
    reelSkipRate: "53–75%",
    dailyViews: [
      { date: "Jun 14", views: 210 },{ date: "Jun 17", views: 940 },
      { date: "Jun 22", views: 600 },{ date: "Jun 26", views: 700 },
      { date: "Jul 1", views: 380 },{ date: "Jul 4", views: 960 },
      { date: "Jul 8", views: 180 },{ date: "Jul 11", views: 1080 },
    ],
    posts: [
      { id: 1, title: "When Patients No Longer Dread the Dentist", type: "Reel", date: "Jul 10", views: 841, reach: 465, likes: 32, comments: 8, saves: 1, shares: 10, er: 10.97, skipRate: 57, avgWatch: "12s", igUrl: "https://www.instagram.com/reel/Dan-hMNxehU/", isTop: true },
      { id: 2, title: "What Keeps Patients Coming Back — Oleksandr", type: "Reel", date: "Jul 11", views: 570, reach: 350, likes: 23, comments: 2, saves: 0, shares: 7, er: 9.14, skipRate: 53, avgWatch: "14s", igUrl: "https://www.instagram.com/reel/DaqGc-npEIe/", isTop: false },
      { id: 3, title: "Dental Care Should Feel Different", type: "Reel", date: "Jul 2", views: 366, reach: 247, likes: 14, comments: 0, saves: 1, shares: 1, er: 6.48, skipRate: 74, avgWatch: "7s", igUrl: "https://www.instagram.com/reel/DaTPVCpRq5W/", isTop: false },
      { id: 4, title: "Great Dentistry Starts With Great Relationships", type: "Reel", date: "Jun 17", views: 356, reach: 275, likes: 5, comments: 0, saves: 0, shares: 0, er: 1.82, skipRate: 61, avgWatch: "8s", igUrl: "https://www.instagram.com/reel/DZsq3BeJcq-/", isTop: false },
      { id: 5, title: "Which Summer Treat Is Toughest? (Carousel)", type: "Post", date: "Jun 26", views: 335, reach: 135, likes: 6, comments: 1, saves: 0, shares: 2, er: 6.67, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/p/DaDpy0ElgCd/", isTop: false },
      { id: 6, title: "Every Detail Matters", type: "Reel", date: "Jun 25", views: 310, reach: 198, likes: 13, comments: 0, saves: 0, shares: 2, er: 7.58, skipRate: 70, avgWatch: "9s", igUrl: "https://www.instagram.com/reel/DaBSbf6xDye/", isTop: false },
    ],
  };
  const socialData = timeRange === "7d" ? socialData7d : socialData30d;
  const overviewKpis = timeRange === "7d" ? [
    { label: "Followers", value: 723, change: "+10", delay: 0 },
    { label: "Views", value: 4573, delay: 80 },
    { label: "Reach", value: 7098, change: "+111%", delay: 160 },
    { label: "Interactions", value: 163, delay: 240 },
    { label: "Non-Follower", value: "~72%", delay: 320 },
  ] : [
    { label: "Followers", value: 723, change: "+28", delay: 0 },
    { label: "Views", value: 15370, delay: 80 },
    { label: "Reach", value: 13980, delay: 160 },
    { label: "Interactions", value: 326, delay: 240 },
    { label: "Non-Follower", value: "~73%", delay: 320 },
  ];


  const adsData = {
    period: "July 6 – July 12, 2026",
    campaign: "Paid Push (ongoing) — spend/campaign detail not re-exported this cycle",
    totalSpend: 196.71,
    budget: 250,
    impressions: 1842,
    reach: 5943,
    activeAds: 2,
    pctOfViews: 41.9,
    pctOfInteractions: 2.5,
    ads: [
      { name: "Paid push (ongoing)", spend: 166.94, impressions: 1842, reach: 5943, quality: "Ad views fell to 42% of content-type views (from 73%) as organic Reels took share" },
      { name: "Spend/creative split carried — verify in Meta Ads Manager", spend: 29.77, impressions: 0, reach: 0, quality: "—" },
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
            <div><div className="exec-col-title">Discovery</div><div className="exec-col-body">An estimated {d.viewerSplit.nonFollowers}% of views (3,138 of 4,399) and ~96% of reach came from non-followers this week — the widest discovery wave in the file. Account reach ran <em>~7,098</em> (Metricool avg. reach/day &times; 7; +111% WoW; paid-inflated, no daily-series outlier adjustment this cycle after the Profile Growth CSV was retired). The shift: Ads fell to 42% of content-type views (from 73%) as two patient-testimonial Reels carried the organic side — Jul 10 (841 views, 465 reach) and Jul 11 Oleksandr (570 / 350). Account views ran 4,573. Discovery is widening <em>and</em> earning more of its own share.</div></div>
            <div><div className="exec-col-title">Engagement</div><div className="exec-col-body">163 account-level interactions, ~2.3% blended engagement rate (163 &divide; 7,098 reach; account-level counts per the locked rule — Reel 111 / Post 33 / Story 15 / Ad 4). Interactions nearly quadrupled and the rate rose 77% <em>while</em> reach doubled. Reels drove 70% of it. Organic per-content ER is strong (Jul 10 Reel 10.97%, Oleksandr 9.14%, chocolate carousel 12.5%). Shares hit 17 and comments 15 — but saves stayed at 1. Followers 713&rarr;723. 25&ndash;44 demo = 59.6%.</div></div>
            <div><div className="exec-col-title">Content</div><div className="exec-col-body">Reels led published-content views at {d.contentMix.reels}%, Posts {d.contentMix.posts}%, Stories {d.contentMix.stories}% — two testimonial Reels (1,411 views) far out-viewed the single carousel (225) and 4 Stories (183). Watch time roughly doubled to ~13s at 43&ndash;47% view-through (skip rate 75%&rarr;~55%). Fresh GSC (Jul 6&ndash;12): 86 clicks at pos ~31, brand-heavy, with the nerve-pain page (15 clicks, pos 5.0) outranking the brand pages. Mobile ranks ~2.3&times; better than desktop and out-clicks it (179 vs 171 over 30d) — still the SEO lever.</div></div>
          </div></div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Content Mix</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.contentMix.reels }, { value: d.contentMix.posts }, { value: d.contentMix.stories }]} colors={["#6F5060", "#8FA1A6", "#A6968D"]} size={120} stroke={18} /><div style={{ flex: 1 }}>{[{ label: "Reels", value: d.contentMix.reels, color: "#6F5060" }, { label: "Posts", value: d.contentMix.posts, color: "#8FA1A6" }, { label: "Stories", value: d.contentMix.stories, color: "#A6968D" }].map((item) => (<div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}><div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} /><span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span><span className="display-num">{item.value}%</span></div>))}</div></div></div>
            <div className="card"><div className="card-hd">Viewer Composition</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.viewerSplit.nonFollowers }, { value: d.viewerSplit.followers }]} colors={["#6F5060", "#D9C5C1"]} size={120} stroke={18} /><div style={{ flex: 1 }}>{[{ label: "Non-Followers", value: d.viewerSplit.nonFollowers, color: "#6F5060" }, { label: "Followers", value: d.viewerSplit.followers, color: "#D9C5C1" }].map((item) => (<div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}><div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} /><span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span><span className="display-num">{item.value}%</span></div>))}<div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(143,161,166,0.12)", borderRadius: 10, border: "1px solid rgba(143,161,166,0.25)" }}><span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Wide discovery — ~72% of views and ~96% of reach came from non-followers this week, now driven by testimonial Reels as well as paid</span></div></div></div></div>
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
            <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ A testimonial-Reel breakthrough week — Jul 10 &ldquo;no longer dread the dentist&rdquo; led at 841 views, 465 reach and a ~12s average watch time, the strongest single piece in the file. Oleksandr&rsquo;s testimonial (570 / 350, ~14s) followed. Reach surged to ~7,098 (+111%) and interactions nearly quadrupled to 163 (2.3% blended ER); organic per-content ER was strong (Jul 10 Reel 10.97%, Oleksandr 9.14%).</span>
          </div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Watch Time Analytics</div><div style={{ textAlign: "center", padding: "8px 0 22px" }}><div className="big-num">{d.kpi.watchTime.value}</div><div style={{ fontSize: 12, color: "#9B9196", marginTop: 2 }}>Avg Watch / Reel</div></div><div style={{ display: "flex", gap: 14 }}><div className="stat-box"><div className="big-num-sm plum">1,411</div><div className="stat-label">Reel Views</div></div><div className="stat-box"><div className="big-num-sm steel">{d.kpi.views.value.toLocaleString()}</div><div className="stat-label">Total Views</div></div></div><div className="alert-box plum-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>✦ Average watch time roughly doubled to ~13s (Jul 10 at 12.2s, Jul 11 at 14.4s) with view-through at 43&ndash;47% — so skip rate fell from ~75% to ~55%. Real patient voices held attention where brand-voice clips did not. This is the format to scale.</span></div></div>
            <div className="card"><div className="card-hd">Engagement Breakdown</div><div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{[{ label: "Likes", value: d.posts.reduce((s: number, p: any) => s + (p.likes||0), 0), max: 60, color: "#6F5060" }, { label: "Comments", value: d.posts.reduce((s: number, p: any) => s + (p.comments||0), 0), max: 60, color: "#8FA1A6" }, { label: "Shares", value: d.posts.reduce((s: number, p: any) => s + (p.shares||0), 0), max: 60, color: "#A6968D" }, { label: "Saves", value: d.posts.reduce((s: number, p: any) => s + (p.saves||0), 0), max: 60, color: "#BE5A5A" }].map((m) => (<div key={m.label} style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 72, fontSize: 13, fontWeight: 500 }}>{m.label}</div><div style={{ flex: 1, height: 10, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}><div style={{ width: `${(Math.max(m.value, 0.5) / m.max) * 100}%`, height: "100%", background: m.color, borderRadius: 99, transition: "width 1.2s ease" }} /></div><div className="display-num" style={{ width: 30, textAlign: "right" as const }}>{m.value}</div></div>))}</div><div className="alert-box danger-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#BE5A5A" }}>▲ Blended account engagement rose to ~2.3% (163 account-level interactions ÷ 7,098 paid-inflated reach), with Reels carrying ~70% of it. The owned-content breakdown below (59 likes, 17 shares, 15 comments, 1 save on the 3 new pieces) shows what changed and what didn&rsquo;t: testimonials earn shares and conversation, but saves are still flat at 1. &ldquo;Save this before you book&rdquo; CTAs on procedure explainers are the remaining lever.</span></div></div>
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
            <InsightCard title={"Link Attribution · " + linkData.period} body={timeRange === "7d" ? "71 attributed clicks over 7 days across the six allowlisted NYCDS links — 60th Street (20) led, then Homepage (15), 5th Ave (12), 35th Street (10), 58th Street (9) and Website (5); all four offices active and clicks up 58% on last cycle's 45. The /* wildcard (12) and the LinkedIn social link (1) are excluded. No DDS-PC links appeared in the 7-day path statistics, so nothing was merged to EEC this week. Note: ShortIO exported path-level clicks only — the geo/device panels below are carried from the prior pull and flagged accordingly." : "361 attributed clicks over 30 days across the four office links plus Website and Homepage — Website (107) led, then 60th Street (78), 5th Ave (64), 58th Street (45), 35th Street (45) and Homepage (22); all four locations active. Excluded: the /* wildcard (133), social links (LinkedIn 34, IG 10, FB 5) and bot/datacenter traffic. ✓ DDS-PC merge applied — /DDS-PC-UES (2 clicks) was legible this cycle and has been stripped from NYCDS and merged into the EEC report. Geo/device panels are carried from the prior pull (ShortIO path-level only this cycle)." } severity="info" />
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
            <InsightCard title={"Website + Search · " + websiteData.period} body={timeRange === "7d" ? "227 new visitors over 7 days (~32/day, up from ~27), peaking at 55 on Jul 9. Direct leads at 52.6% (119), Google 31.8% (72), then paid social — Instagram 6.3% (14), Facebook 3.4% (8), Audience Network 2.1% (5). Desktop 67.9% / Mobile 31.4%. The doctor and locations pages trail Home (212) — /ourdoctors (43), /locations (19). Fresh GSC (Jul 6–12): 86 clicks, 1.25% CTR, pos ~31, brand-dominant — both clicks and CTR up on last cycle. (7-day source/page splits are modeled from the 30-day GA4 export; daily visitor counts are actual.)" : "973 sessions over 30 days (815 new visitors). Direct 52.6% (512) and Google 31.8% (309) carry ~84% combined; paid social now adds ~12% (IG 61, FB 33, Audience Network 20). Desktop 67.9% / Mobile 31.4%. /ourdoctors (155) is the clear #2 page — provider pages are the conversion surface. ✓ The 'appen…workramp.io' and 'zeyao.net' referrals have been scrubbed as spam per the locked rule (5 sessions combined; note the prior cycle counted workramp as a real source at 16 sessions). GSC (true 30-day, Jun 13–Jul 12): 360 clicks at 1.0% CTR; the Nerve Pain After Onlay page (55 clicks, pos 5.2) still outranks every brand term — the non-brand SEO template to replicate."} severity="info" />
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
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>⚡ Reach surged to ~7,098 (Metricool avg. reach/day &times; 7; +111% WoW, non-follower reach ~96%), with the biggest days Jul 10&ndash;12 as the two testimonial Reels landed. Blended engagement rose to ~2.3% (163 account-level interactions) even as reach doubled; organic per-content ER was strong (Jul 10 Reel 10.97%). (Profile Growth &amp; Discovery CSV retired this cycle — reach is the Metricool avg-reach-per-day basis, not daily-series outlier-adjusted; daily shape is estimated.)</span>
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
                <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>▲ Two testimonial Reels shipped this week — Jul 10 (&ldquo;no longer dread the dentist&rdquo;, 841 views, 465 reach, ~12s watch, 57% skip) and Jul 11 (Oleksandr, 570 views, 350 reach, ~14s watch, 53% skip). Together 55 likes, 10 comments, 17 shares, 1 save. Watch time roughly doubled and skip rate fell ~20 points versus the brand-voice Reels — patient voices are the format that holds attention. The remaining lever is a save-prompt CTA on the end-frame.</span>
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
                <div style={{ fontSize: 36, fontWeight: 700, color: "#6F5060" }}>0.22%</div>
                <div style={{ fontSize: 12, color: "#9B9196", marginTop: 4 }}>Views → Follower Conversion</div>
              </div>
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(143,161,166,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#8FA1A6" }}>4,573</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>views</div>
                </div>
                <div style={{ flex: 0, display: "flex", alignItems: "center", fontSize: 16, color: "#D9CCC1" }}>→</div>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(143,161,166,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#8FA1A6" }}>7,098</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>reached</div>
                </div>
                <div style={{ flex: 0, display: "flex", alignItems: "center", fontSize: 16, color: "#D9CCC1" }}>→</div>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(111,80,96,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#6F5060" }}>+8</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>followers</div>
                </div>
              </div>
              <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(111,80,96,0.10)", borderRadius: 10, border: "1px solid rgba(111,80,96,0.25)" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>▲ Reach surged to ~7,098 (+111%) and blended engagement rose to ~2.3% (163 account-level interactions) — the rate improved while the denominator doubled, which is the hard version. The remaining gap is durable signals: 1 save all week against 17 shares. Add save-prompt CTAs on Reel end-frames and booking stickers to convert this wave into owned interaction.</span>
              </div>
            </div>
          </div>

          <div className="card">
            <InsightCard title={"Social Intelligence · " + socialData.period} body={timeRange === "7d" ? "4,573 account views with reach surging to ~7,098 (Metricool avg. reach/day × 7; +111% WoW) and a blended engagement rate of ~2.3% (163 account-level interactions ÷ 7,098 — Reel 111 / Post 33 / Story 15 / Ad 4, per the locked account-level rule). The rate rose 77% while reach doubled, which is the meaningful version. Ads fell to 42% of content-type views (from 73%) as two patient-testimonial Reels carried the organic side: Jul 10 'no longer dread the dentist' at 10.97% ER (841 views, 465 reach, ~12s watch) and Jul 11 Oleksandr at 9.14% (570 / 350, ~14s). Watch time roughly doubled; skip rate fell from ~75% to ~55%. ~72% of views and ~96% of reach came from non-followers. Reach basis flagged: the Profile Growth & Discovery CSV was retired, so reach is the Metricool avg-reach-per-day basis (not daily-series outlier-adjusted). The lever is converting this wave into follows and saves." : "15,370 native account views reaching ~13,980 (avg. reach/day × 30; +86% on the avg-reach basis) with 326 account-level interactions over Jun 13–Jul 12. Reels drove 52% of organic views and 59% of interactions; ~73% of views came from non-followers. Top pieces: 'When Patients No Longer Dread the Dentist' (841 views, Jul 10), Oleksandr's testimonial (570, Jul 11) and 'Dental Care Should Feel Different' (366, Jul 2) — the testimonial format now owns the top of the month. Paid ads contributed ~45% of content-type views and ~5% of interactions (see Paid Ads). Reach uses the Metricool avg-reach-per-day basis; engagement-by-follower split is carried from the prior pull."} severity="success" />
            <InsightCard title="Key Insight" body="The testimonial Reel is the unlock. Two patient-voice Reels (Jul 10, Jul 11) drove 1,411 of the week's organic views at 10.97% and 9.14% ER — and, more importantly, roughly doubled average watch time to ~13s while cutting skip rate from ~75% to ~55%. That is a content-quality finding, not a reach finding: real patients hold attention where brand-voice clips did not. The knock-on effects are visible everywhere — account reach +111% to ~7,098, interactions nearly quadrupled to 163, blended ER up to 2.3% *while* the denominator doubled, and paid's share of views fell from 73% to 42% as organic took ground back. The website and search funnel stayed clean underneath (86 GSC clicks, nerve-pain page holding pos 5.0, mobile out-clicking desktop). What's still not landing: conversion of attention into owned signal — net +10 followers and 1 save all week, against 17 shares. Two levers: (1) build a standing pipeline of patient-testimonial Reels — this is now the proven format, not a hypothesis, and (2) put follow and save prompts on the end-frame, where ~13s of held attention is currently going unasked." severity="success" />
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
              <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Paid still carries most of the reach — Ads accounted for 849 of the ~967 average daily reach — but its share of views fell to 1,842 of 4,398 content-type views (~42%, down from ~73%) as organic Reels took ground back. ⚠ Spend and per-ad delivery were not re-exported this cycle; dollar figures are carried from the prior campaign — verify current spend in Meta Ads Manager before quoting cost-per-reach.</span>
            </div>
          </div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Spend Allocation</div>
              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <Donut data={[{ value: 85 }, { value: 15 }]} colors={["#6F5060", "#8FA1A6"]} size={120} stroke={18} />
                <div style={{ flex: 1 }}>
                  {[{ label: "Paid push (ongoing)", value: 85, color: "#6F5060" }, { label: "Secondary creative (carried)", value: 15, color: "#8FA1A6" }].map((item) => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{item.label}</span>
                      <span className="display-num">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card"><div className="card-hd">Paid Contribution · Native IG (Jul 4th wk)</div>
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
                <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Paid also sent ~12 of the week's 192 website sessions (paid Instagram / Audience Network).</span>
              </div>
            </div>
          </div>
          <div className="card">
            <InsightCard title="Paid Ads · Jul 6–12 (spend detail not re-exported)" body="Paid is still the largest single reach driver — ads carried 849 of the ~967 average daily reach — but its grip on views loosened materially: ad views fell to ~42% of content-type views (1,842 of 4,398), down from ~73% last cycle, as the two patient-testimonial Reels pulled organic share back. Ads contributed just 4 of 163 account-level interactions (~2.5%), so paid is buying reach, not engagement. ⚠ Metricool's account view only confirms ad reach/views; per-ad spend, budget and quality ranking were not re-exported this cycle, so the dollar figures on the cards are carried from the prior campaign and should be treated as placeholders — pull current spend from Meta Ads Manager before quoting cost-per-reach or cost-per-booking. ▲ Still no conversion event: add a Lead or Booking event so next cycle can measure ROI rather than reach, especially now that organic is demonstrably capable of carrying engagement." severity="warning" />
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
