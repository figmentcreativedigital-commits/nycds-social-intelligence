"use client";
import { useState, useEffect } from "react";

const FALLBACK_DATA = {
  client: { name: "NYCDS", fullName: "NYC Dental Smiles", period: "June 29 – July 5, 2026" },
  kpi: {
    followers: { value: 712, change: 8, label: "Followers" },
    reach: { value: 3360, label: "Reach" },
    views: { value: 3561, label: "Total Views" },
    engagementRate: { value: 1.3, label: "Engagement Rate", suffix: "%" },
    engagements: { value: 44, label: "Engagements" },
    watchTime: { value: "7s", label: "Watch Time" },
  },
  posts: [
    { id: 1, title: "Dental Care Should Feel Different (Reel)", type: "Reel", views: 330, reach: 229, likes: 11, comments: 0, saves: 1, shares: 1, isTop: true, igPostUrl: "https://www.instagram.com/reel/DaTPVCpRq5W/" },
    { id: 2, title: "What's In My Summer Bag", type: "Post", views: 88, reach: 31, likes: 6, comments: 0, saves: 0, shares: 0, isTop: false, igPostUrl: "https://www.instagram.com/p/DaTQkwKxrg6/" },
    { id: 3, title: "Stars, Stripes & Brighter Smiles — July 4th Whitening Promo", type: "Post", views: 66, reach: 34, likes: 2, comments: 0, saves: 0, shares: 0, isTop: false, igPostUrl: "https://www.instagram.com/p/DaTQM_7RW4A/" },
  ] as any[],
  contentMix: { posts: 26, reels: 55, stories: 19 },
  audience: {
    gender: { male: 51, female: 49 },
    age: [
      { range: "18-24", pct: 5.4 }, { range: "25-34", pct: 29.8 }, { range: "35-44", pct: 29.8 },
      { range: "45-54", pct: 20.8 }, { range: "55-64", pct: 9.6 }, { range: "65+", pct: 4.4 },
    ],
  },
  viewerSplit: { followers: 20, nonFollowers: 80 },
};
type ReportData = typeof FALLBACK_DATA;

function generateInsights(data: ReportData) {
  const insights: { title: string; body: string; severity: string }[] = [];
  const opportunities: typeof insights = [];
  const recommendations: { text: string; priority: string }[] = [];
  const alerts: typeof insights = [];

  const er = data.kpi.engagementRate.value;
  const reach = data.kpi.reach.value;

  opportunities.push({ title: "A Paid-Driven Discovery Surge — Engagement Didn't Scale With It", body: `Account reach ran ${reach.toLocaleString()} for the week (Metricool avg. reach/day of 480 × 7 — the same basis last cycle's 925 was built on; flagged because the retired Profile Growth CSV means no daily-series outlier adjustment this cycle). That's a large step up, but it's paid-led: Ads accounted for 2,698 of the week's 3,707 content-type views, and non-follower reach hit ~93%. Account views ran ${data.kpi.views.value.toLocaleString()} (79.9% from non-followers). The solo-brand Reel (Jul 2, "Dental care should feel different") drove the organic side — 330 views, 229 reach — with the July 4th push spiking reach Jul 3–4. Reach is not the problem; converting borrowed, largely-paid attention into saved/followed signals is. The lever remains a doctor-led / collab Reel to reopen *organic* discovery.`, severity: "info" });

  insights.push({ title: `Blended Engagement Rate ${er}% — Diluted by Paid Reach`, body: `${data.kpi.engagements.value} account-level interactions (Reel 18 / Post 15 / Story 10 / Ad 1, per the locked account-level rule — not the 21 published-content actions) against ${reach.toLocaleString()} accounts reached = ${er}%. The blended rate reads low because paid ad reach inflates the denominator; the *organic per-content* rates are healthy — the Reel landed 5.68% and the "what's in my bag" post hit 19.4% ER on tight reach (6 interactions / 31 reach). Twenty-four unique accounts engaged. The read: paid put the brand in front of many non-followers, but owned organic engagement is where the depth is. Push booking-link and save CTAs on the high-reach paid placements to recover signal from the borrowed reach.`, severity: "info" });

  const sorted = [
    { name: "Reels", val: data.contentMix.reels },
    { name: "Posts", val: data.contentMix.posts },
    { name: "Stories", val: data.contentMix.stories },
  ].sort((a, b) => b.val - a.val);
  insights.push({ title: "Reels Led the Format Mix This Week", body: `${sorted[0].name} led at ${sorted[0].val}% of published-content views, ${sorted[1].name} ${sorted[1].val}%, ${sorted[2].name} ${sorted[2].val}%. The single solo Reel (330 views, 229 reach) out-viewed the two feed posts combined (154 views) and the 4 Stories (111 impressions), and carried the interaction load (Reel 18 of 43 organic interactions). The mix flipped from last cycle's post-led week back toward Reels — the right direction. The lever is holding a 2–3 Reel/week cadence so discovery doesn't collapse back to a single piece.`, severity: "info" });

  const totalSaves = data.posts.reduce((s: number, p: any) => s + (p.saves || 0), 0);
  if (totalSaves < 3) {
    opportunities.push({ title: "Saves Are Still the Weak Lever", body: `${totalSaves} save across the week's owned content — the Reel earned the only one. Saves are the highest-weighted action in Meta's ranking, and reach was abundant (${reach.toLocaleString()}, heavily paid). But nothing was reference-worthy enough to bookmark at scale. Procedure explainers and before/after carousels with a 'Save this before you book' CTA on the final frame are the fix — especially valuable this week to recover durable signal from the large paid-driven, non-follower reach.`, severity: "warning" });
  }

  if (data.viewerSplit.nonFollowers >= 45) {
    opportunities.push({ title: "Convert a Non-Follower Wave Into Active Signals", body: `~${data.viewerSplit.nonFollowers}% of views (2,911 of 3,645) and ~93% of reach came from non-followers this week — a genuine discovery wave, largely paid. Yet net follower add was only +${data.kpi.followers.change} and saves were 1. The lever is the active layer: booking-link stickers on the high-reach paid + Story placements, a follow-prompt and save-prompt on Reel end-frames, and a doctor-led Reel to convert borrowed attention into owned audience before the paid window closes.`, severity: "warning" });
  }

  insights.push({ title: "Brand-Search Dependency on Google", body: `Fresh GSC this cycle (7-day, one-day lag through Jul 4): 76 clicks on 6,624 impressions at 1.15% CTR, pos ~33. Most clicks are brand/name terms (nyc dental smiles 8 clicks at 61.5% CTR pos 1.2, dr chesner dentist, nyc dental smile team, dr ben elchami). The standout non-brand asset — the 'nerve pain after onlay' page — jumped to 16 clicks at position 5.0 this week (up from 7), still outranking the brand pages and pacing 17 clicks over the trailing 30 days. That page remains the blueprint for non-brand growth; replicate the template across 5–10 procedure questions.`, severity: "info" });

  insights.push({ title: "Mobile Outranks Desktop on Google", body: "GSC (7-day): Mobile ranks at position 18.8 vs Desktop at 37.7 — a ~2× ranking gap on the same content, with mobile converting at 2.36% CTR vs 0.69% on desktop. Mobile now out-clicks desktop outright (40 vs 34) on a fraction of the impressions. Mobile experience is the strongest SEO lever right now — audit Core Web Vitals and keep CTAs thumb-reachable above the fold.", severity: "info" });

  const topAge = data.audience.age.reduce((a, b) => (a.pct > b.pct ? a : b));
  insights.push({ title: "Audience Alignment", body: `Primary audience is ${topAge.range} (${topAge.pct}%), with a ${data.audience.gender.male}/${data.audience.gender.female} male/female split (demographic table carried — not re-exported this cycle). The 25–44 range represents ${(data.audience.age[1]?.pct || 0) + (data.audience.age[2]?.pct || 0)}% — strong patient demographic for cosmetic and restorative work — and New York is the top follower market at 22.7%, a tightly local, high-intent base.`, severity: "success" });

  if (data.kpi.followers.change != null && data.kpi.followers.change < 12) {
    opportunities.push({ title: "Follower Conversion Lag", body: `Net +${data.kpi.followers.change} this week (704→712). With ~${data.viewerSplit.nonFollowers}% of views from non-followers and a large paid-driven reach wave, the discovery was there — but little of it converted to follows. Pinned content, a bio CTA refresh, and follow prompts on Story covers and Reel end-frames would capture more of it before the paid reach recedes.`, severity: "warning" });
  }

  recommendations.push(
    { text: "Capitalize on the paid reach wave before it recedes — this week put the brand in front of ~2,900 non-followers, mostly via ads. Layer booking-link and follow/save CTAs directly onto the paid creative and high-reach Stories so borrowed attention converts to owned signal", priority: "high" },
    { text: "Bring back the doctor-led / collab Reel — the solo brand Reel (330 views, 5.68% ER) worked, but a collab is the proven lever for reopening *organic* discovery rather than renting it. Pair it with the paid push for compounding reach", priority: "high" },
    { text: "Hold Reel cadence at 2–3/week — the format led the mix again this cycle (330 Reel views vs 154 across two posts). Provider spotlights and procedure explainers keep discovery from collapsing back onto a single piece", priority: "high" },
    { text: "Attack the saves problem — 1 save all week despite abundant reach. Add 'Save this before you book' CTAs to carousel/Reel end-frames; saves are the highest-weighted ranking signal and the cheapest way to bank durable value from a paid reach spike", priority: "medium" },
    { text: "Replicate the 'nerve pain after onlay' SEO template — 16 clicks this week at position 5.0, still outranking brand terms. Build 5+ procedure-question articles for non-brand search growth", priority: "medium" },
    { text: "Lean into mobile SEO — mobile now out-clicks desktop (40 vs 34) and ranks ~2× better (18.8 vs 37.7). Audit Core Web Vitals and keep booking CTAs thumb-reachable above the fold", priority: "low" },
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
    period: "June 29 – July 5, 2026",
    totalClicks: 45,
    topLinks: [
      { path: "Website", clicks: 17 },
      { path: "NYCDS 5th Ave", clicks: 12 },
      { path: "NYCDS 60th Street", clicks: 7 },
      { path: "NYCDS 35th Street", clicks: 6 },
      { path: "NYCDS 58th Street", clicks: 3 },
      { path: "Homepage", clicks: 0 },
    ],
    trafficSources: [
      { source: "Named NYCDS links (human)", clicks: 45 },
      { source: "Bot / social / excluded", clicks: 54 },
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
    period: "June 6 – July 5, 2026",
    totalClicks: 213,
    topLinks: [
      { path: "NYCDS 60th Street", clicks: 46 },
      { path: "NYCDS 5th Ave", clicks: 46 },
      { path: "Website", clicks: 43 },
      { path: "NYCDS 35th Street", clicks: 36 },
      { path: "NYCDS 58th Street", clicks: 31 },
      { path: "Homepage", clicks: 11 },
    ],
    trafficSources: [
      { source: "Named NYCDS links (human)", clicks: 213 },
      { source: "Bot / social / excluded", clicks: 321 },
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
    period: "June 29 – July 5, 2026",
    sessions: 192,
    topPages: [
      { page: "/", label: "Home", views: 119 },
      { page: "/ourdoctors", label: "Our Doctors", views: 30 },
      { page: "/locations", label: "Locations", views: 23 },
      { page: "/about", label: "About", views: 18 },
      { page: "/why-nycds", label: "Why NYCDS", views: 8 },
      { page: "/comprehensive-care", label: "Comprehensive Care", views: 5 },
      { page: "/nerve-pain-after-onlay", label: "Nerve Pain After Onlay", views: 4 },
    ],
    trafficSources: [
      { source: "Direct", sessions: 97, pct: 51.3 },
      { source: "Google", sessions: 68, pct: 36.0 },
      { source: "Instagram (paid)", sessions: 7, pct: 3.7 },
      { source: "Audience Network (paid)", sessions: 5, pct: 2.6 },
      { source: "Instagram (social)", sessions: 3, pct: 1.6 },
      { source: "Other", sessions: 12, pct: 4.8 },
    ],
    devices: [
      { device: "Desktop", pct: 70.4 },
      { device: "Mobile", pct: 29.0 },
    ],
    dailyVisitors: [
      { date: "Jun 29", visitors: 23 },{ date: "Jun 30", visitors: 25 },
      { date: "Jul 1", visitors: 37 },{ date: "Jul 2", visitors: 33 },
      { date: "Jul 3", visitors: 11 },{ date: "Jul 4", visitors: 20 },
      { date: "Jul 5", visitors: 11 },
    ],
    search: {
      totalClicks: 76, totalImpressions: 6624, avgCTR: 1.15, avgPosition: 32.9,
      note: "7-day (one-day GSC lag — through Jul 4)",
      topQueries: [
        { query: "nyc dental smiles", clicks: 8, ctr: 61.54, position: 1.23 },
        { query: "dr chesner dentist", clicks: 2, ctr: 28.57, position: 1.71 },
        { query: "nyc dental smile team", clicks: 2, ctr: 33.33, position: 1.33 },
        { query: "dr ben elchami", clicks: 2, ctr: 11.11, position: 5.00 },
        { query: "smile dentist nyc", clicks: 1, ctr: 3.33, position: 3.33 },
      ],
      topPages: [
        { page: "Homepage", clicks: 28, impressions: 3859, ctr: 0.73 },
        { page: "Nerve Pain After Onlay", clicks: 16, impressions: 781, ctr: 2.05 },
        { page: "Our Doctors", clicks: 9, impressions: 1211, ctr: 0.74 },
        { page: "Dr. Michael Chesner", clicks: 8, impressions: 82, ctr: 9.76 },
      ],
    },
  };
  const websiteData30d = {
    period: "June 6 – July 5, 2026",
    sessions: 912,
    topPages: [
      { page: "/", label: "Home", views: 663 },
      { page: "/ourdoctors", label: "Our Doctors", views: 151 },
      { page: "/locations", label: "Locations", views: 45 },
      { page: "/about", label: "About", views: 43 },
      { page: "/dr-ben-elchami", label: "Dr. Ben Elchami", views: 25 },
      { page: "/dr-michael-chesner", label: "Dr. Michael Chesner", views: 22 },
      { page: "/comprehensive-care", label: "Comprehensive Care", views: 20 },
    ],
    trafficSources: [
      { source: "Direct", sessions: 483, pct: 53.0 },
      { source: "Google", sessions: 313, pct: 34.4 },
      { source: "Facebook (paid)", sessions: 27, pct: 3.0 },
      { source: "Audience Network (paid)", sessions: 20, pct: 2.2 },
      { source: "appen-workramp (ref)", sessions: 16, pct: 1.8 },
      { source: "Other", sessions: 53, pct: 5.6 },
    ],
    devices: [
      { device: "Desktop", pct: 72.8 },
      { device: "Mobile", pct: 26.6 },
    ],
    dailyVisitors: [
      { date: "Jun 6", visitors: 14 },{ date: "Jun 10", visitors: 36 },
      { date: "Jun 14", visitors: 16 },{ date: "Jun 17", visitors: 46 },
      { date: "Jun 22", visitors: 29 },{ date: "Jun 25", visitors: 30 },
      { date: "Jul 2", visitors: 33 },{ date: "Jul 5", visitors: 11 },
    ],
    search: {
      totalClicks: 88, totalImpressions: 7911, avgCTR: 1.11, avgPosition: 32.7,
      note: "GSC Jun 26 – Jul 4 (full 30-day GSC not exported this cycle)",
      topQueries: [
        { query: "nyc dental smiles", clicks: 9, ctr: 60.00, position: 1.20 },
        { query: "dr chesner dentist", clicks: 2, ctr: 28.57, position: 1.71 },
        { query: "nyc dental smile team", clicks: 2, ctr: 28.57, position: 1.29 },
        { query: "dr ben elchami", clicks: 2, ctr: 9.09, position: 4.73 },
        { query: "dentist new york", clicks: 1, ctr: 0.78, position: 43.44 },
      ],
      topPages: [
        { page: "Homepage", clicks: 34, impressions: 4583, ctr: 0.74 },
        { page: "Nerve Pain After Onlay", clicks: 17, impressions: 929, ctr: 1.83 },
        { page: "Our Doctors", clicks: 10, impressions: 1371, ctr: 0.73 },
        { page: "Dr. Michael Chesner", clicks: 9, impressions: 94, ctr: 9.57 },
      ],
    },
  };
  const websiteData = timeRange === "7d" ? websiteData7d : websiteData30d;

  const socialData7d = {
    period: "June 29 – July 5, 2026",
    followers: 712,
    followerGrowth: 8,
    follows: 8,
    unfollows: 0,
    totalViews: 3561,
    totalReach: 3360,
    reachChange: 263.2,
    totalInteractions: 44,
    viewSplit: { followers: 20, nonFollowers: 80 },
    engagementSplit: { followers: 60, nonFollowers: 40 },
    viewsByType: { reels: 55, posts: 26, stories: 19 },
    interactionsByType: { reels: 42, posts: 35, stories: 23 },
    totalLikes: 19,
    totalComments: 0,
    totalSaves: 1,
    totalShares: 1,
    storyViews: 111, storyCompletion: 89, storyCount: 4,
    reelAvgWatchTime: "7s", reelSkipRate: "75%",
    dailyViews: [
      { date: "Jun 29", views: 385 },{ date: "Jun 30", views: 130 },
      { date: "Jul 1", views: 45 },{ date: "Jul 2", views: 540 },
      { date: "Jul 3", views: 700 },{ date: "Jul 4", views: 1040 },
      { date: "Jul 5", views: 721 },
    ],
    posts: [
      { id: 1, title: "Dental Care Should Feel Different", type: "Reel", date: "Jul 2", views: 330, reach: 229, likes: 11, comments: 0, saves: 1, shares: 1, er: 5.68, skipRate: 75, avgWatch: "7s", igUrl: "https://www.instagram.com/reel/DaTPVCpRq5W/", isTop: true },
      { id: 2, title: "What's In My Summer Bag", type: "Post", date: "Jul 5", views: 88, reach: 31, likes: 6, comments: 0, saves: 0, shares: 0, er: 19.35, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/p/DaTQkwKxrg6/", isTop: false },
      { id: 3, title: "Stars, Stripes & Brighter Smiles — July 4th Whitening Promo", type: "Post", date: "Jul 3", views: 66, reach: 34, likes: 2, comments: 0, saves: 0, shares: 0, er: 5.88, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/p/DaTQM_7RW4A/", isTop: false },
    ],
  };
  const socialData30d = {
    period: "June 6 – July 5, 2026",
    followers: 712,
    followerGrowth: 20,
    follows: 30,
    unfollows: 10,
    totalViews: 12230,
    totalReach: 7530,
    reachChange: 206.1,
    totalInteractions: 160,
    viewSplit: { followers: 28, nonFollowers: 72 },
    engagementSplit: { followers: 56, nonFollowers: 44 },
    viewsByType: { reels: 47, posts: 35, stories: 18 },
    interactionsByType: { reels: 49, posts: 38, stories: 13 },
    totalLikes: 54,
    totalComments: 1,
    totalSaves: 1,
    totalShares: 10,
    storyViews: 864, storyCompletion: 89, storyCount: 15,
    reelAvgWatchTime: "7–9s",
    reelSkipRate: "70–75%",
    dailyViews: [
      { date: "Jun 6", views: 210 },{ date: "Jun 11", views: 640 },
      { date: "Jun 17", views: 980 },{ date: "Jun 22", views: 470 },
      { date: "Jun 26", views: 610 },{ date: "Jul 2", views: 540 },
      { date: "Jul 4", views: 1040 },{ date: "Jul 5", views: 721 },
    ],
    posts: [
      { id: 1, title: "Great Dentistry Starts With Great Relationships", type: "Reel", date: "Jun 17", views: 351, reach: 269, likes: 4, comments: 0, saves: 0, shares: 0, er: 1.49, skipRate: 0, avgWatch: "8s", igUrl: "https://www.instagram.com/reel/DZsq3BeJcq-/", isTop: true },
      { id: 2, title: "Dental Care Should Feel Different", type: "Reel", date: "Jul 2", views: 330, reach: 229, likes: 11, comments: 0, saves: 1, shares: 1, er: 5.68, skipRate: 75, avgWatch: "7s", igUrl: "https://www.instagram.com/reel/DaTPVCpRq5W/", isTop: false },
      { id: 3, title: "Which Summer Treat Is Toughest?", type: "Post", date: "Jun 26", views: 312, reach: 130, likes: 5, comments: 1, saves: 0, shares: 2, er: 6.15, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/p/DaDpy0ElgCd/", isTop: false },
      { id: 4, title: "Every Detail Matters", type: "Reel", date: "Jun 25", views: 291, reach: 189, likes: 10, comments: 0, saves: 0, shares: 2, er: 6.35, skipRate: 74, avgWatch: "8s", igUrl: "https://www.instagram.com/reel/DaBSbf6xDye/", isTop: false },
      { id: 5, title: "A More Advanced Way to Understand Your Care", type: "Post", date: "Jun 11", views: 186, reach: 86, likes: 6, comments: 0, saves: 1, shares: 2, er: 10.47, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/p/DZcplDQRa9i/", isTop: false },
      { id: 6, title: "From Your Morning Coffee to Your Daily Brush", type: "Post", date: "Jun 18", views: 180, reach: 104, likes: 2, comments: 0, saves: 0, shares: 1, er: 2.88, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/p/DZqYkR_R7Ue/", isTop: false },
    ],
  };
  const socialData = timeRange === "7d" ? socialData7d : socialData30d;
  const overviewKpis = timeRange === "7d" ? [
    { label: "Followers", value: 712, change: "+8", delay: 0 },
    { label: "Views", value: 3561, delay: 80 },
    { label: "Reach", value: 3360, change: "+263%", delay: 160 },
    { label: "Interactions", value: 44, delay: 240 },
    { label: "Non-Follower", value: "~80%", delay: 320 },
  ] : [
    { label: "Followers", value: 712, change: "+20", delay: 0 },
    { label: "Views", value: 12230, delay: 80 },
    { label: "Reach", value: 7530, delay: 160 },
    { label: "Interactions", value: 160, delay: 240 },
    { label: "Non-Follower", value: "~72%", delay: 320 },
  ];


  const adsData = {
    period: "June 29 – July 5, 2026",
    campaign: "Paid Push (incl. July 4th) — spend/campaign detail not re-exported this cycle",
    totalSpend: 196.71,
    budget: 250,
    impressions: 2698,
    reach: 423,
    activeAds: 2,
    pctOfViews: 72.8,
    pctOfInteractions: 2.3,
    ads: [
      { name: "July 4th whitening promo (boosted)", spend: 166.94, impressions: 2698, reach: 423, quality: "Ad views drove 73% of content-type views this week" },
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
            <div><div className="exec-col-title">Discovery</div><div className="exec-col-body">An estimated {d.viewerSplit.nonFollowers}% of views (2,911 of 3,645) and ~93% of reach came from non-followers this week — a large discovery wave, largely <em>paid</em>. Account reach ran <em>~3,360</em> (Metricool avg. reach/day &times; 7; paid-inflated, no daily-series outlier adjustment this cycle after the Profile Growth CSV was retired). The solo-brand Reel (Jul 2) drove the organic side at 229 reach; account views ran 3,561, spiking Jul 3–4 on the July 4th push. Discovery was wide but rented — converting it to follows/saves is the gap.</div></div>
            <div><div className="exec-col-title">Engagement</div><div className="exec-col-body">44 account-level interactions, ~1.3% blended engagement rate (44 &divide; 3,360 reach; account-level counts per the locked rule, not the 21 published actions). The blend reads low because paid ad reach inflates the denominator — organic per-content ER is healthy (the Reel 5.68%, the &ldquo;what&rsquo;s in my bag&rdquo; post 19.4%). Saves stayed at 1. Followers 704&rarr;712. 25&ndash;44 demo = 59.6%.</div></div>
            <div><div className="exec-col-title">Content</div><div className="exec-col-body">Reels led published-content views at {d.contentMix.reels}%, Posts {d.contentMix.posts}%, Stories {d.contentMix.stories}% — the solo Reel (330 views) out-viewed the two feed posts combined (154) and 4 Stories (111). Fresh GSC this cycle (7-day): 76 clicks at pos ~33, brand-search heavy, with the nerve-pain page (16 clicks, pos 5.0) outranking the brand pages. Mobile ranks ~2&times; better than desktop and now out-clicks it (40 vs 34) — still the SEO lever.</div></div>
          </div></div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Content Mix</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.contentMix.reels }, { value: d.contentMix.posts }, { value: d.contentMix.stories }]} colors={["#6F5060", "#8FA1A6", "#A6968D"]} size={120} stroke={18} /><div style={{ flex: 1 }}>{[{ label: "Reels", value: d.contentMix.reels, color: "#6F5060" }, { label: "Posts", value: d.contentMix.posts, color: "#8FA1A6" }, { label: "Stories", value: d.contentMix.stories, color: "#A6968D" }].map((item) => (<div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}><div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} /><span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span><span className="display-num">{item.value}%</span></div>))}</div></div></div>
            <div className="card"><div className="card-hd">Viewer Composition</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.viewerSplit.nonFollowers }, { value: d.viewerSplit.followers }]} colors={["#6F5060", "#D9C5C1"]} size={120} stroke={18} /><div style={{ flex: 1 }}>{[{ label: "Non-Followers", value: d.viewerSplit.nonFollowers, color: "#6F5060" }, { label: "Followers", value: d.viewerSplit.followers, color: "#D9C5C1" }].map((item) => (<div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}><div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} /><span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span><span className="display-num">{item.value}%</span></div>))}<div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(143,161,166,0.12)", borderRadius: 10, border: "1px solid rgba(143,161,166,0.25)" }}><span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Wide discovery — ~80% of views and ~93% of reach came from non-followers this week (largely paid)</span></div></div></div></div>
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
            <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ A paid-heavy discovery week — the solo-brand Reel (Jul 2) led at 330 views, 229 reach and a ~7s average watch time, the strongest single piece. The July 4th whitening promo and &ldquo;what&rsquo;s in my bag&rdquo; post followed. Reach surged (~3,360, largely paid) but blended interactions read 44 (1.3% ER); organic per-content ER stayed healthy (Reel 5.68%, top post 19.4%).</span>
          </div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Watch Time Analytics</div><div style={{ textAlign: "center", padding: "8px 0 22px" }}><div className="big-num">{d.kpi.watchTime.value}</div><div style={{ fontSize: 12, color: "#9B9196", marginTop: 2 }}>Avg Watch / Reel</div></div><div style={{ display: "flex", gap: 14 }}><div className="stat-box"><div className="big-num-sm plum">330</div><div className="stat-label">Reel Views</div></div><div className="stat-box"><div className="big-num-sm steel">{d.kpi.views.value.toLocaleString()}</div><div className="stat-label">Total Views</div></div></div><div className="alert-box plum-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>✦ The solo-brand Reel (Jul 2) held a ~7s average watch time on 330 views with a 75% skip rate — typical for a short brand clip. The lever is a doctor-led / &ldquo;Ask the Doctor&rdquo; format that holds attention longer and reopens organic reach.</span></div></div>
            <div className="card"><div className="card-hd">Engagement Breakdown</div><div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{[{ label: "Likes", value: d.posts.reduce((s: number, p: any) => s + (p.likes||0), 0), max: 15, color: "#6F5060" }, { label: "Comments", value: d.posts.reduce((s: number, p: any) => s + (p.comments||0), 0), max: 15, color: "#8FA1A6" }, { label: "Shares", value: d.posts.reduce((s: number, p: any) => s + (p.shares||0), 0), max: 15, color: "#A6968D" }, { label: "Saves", value: d.posts.reduce((s: number, p: any) => s + (p.saves||0), 0), max: 15, color: "#BE5A5A" }].map((m) => (<div key={m.label} style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 72, fontSize: 13, fontWeight: 500 }}>{m.label}</div><div style={{ flex: 1, height: 10, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}><div style={{ width: `${(Math.max(m.value, 0.5) / m.max) * 100}%`, height: "100%", background: m.color, borderRadius: 99, transition: "width 1.2s ease" }} /></div><div className="display-num" style={{ width: 30, textAlign: "right" as const }}>{m.value}</div></div>))}</div><div className="alert-box danger-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#BE5A5A" }}>▲ Blended account engagement was ~1.3% (44 account-level interactions ÷ 3,360 paid-inflated reach), with Reels carrying ~42% of it. The owned-content breakdown below (19 likes, 1 share, 0 comments, 1 save on the 3 new pieces) shows the gap: paid reach is abundant but durable signals — especially saves — are flat. &ldquo;Save this before you book&rdquo; CTAs and booking stickers are the lever.</span></div></div>
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
            <InsightCard title={"Link Attribution · " + linkData.period} body={timeRange === "7d" ? "45 attributed clicks over 7 days across the six allowlisted NYCDS links — Website (17) led, then 5th Ave (12), 60th Street (7), 35th Street (6), 58th Street (3) and Homepage (~0). The domain saw 99 total / 63 human clicks; the /* wildcard (6), LinkedIn/FB/IG social links (4 each) and bot/datacenter traffic are excluded. No legible /DDS-PC-Midtown or /DDS-PC-UES clicks this cycle (below the export's visible cutoff — ignored per direction), so nothing was merged to EEC. Note: ShortIO exported summary + path-level clicks only — the geo/device panels below are carried from the prior pull and flagged accordingly." : "213 attributed clicks over 30 days across the four office links plus Website and Homepage — 60th Street (46) and 5th Ave (46) led, then Website (43), 35th Street (36), 58th Street (31) and Homepage (11); all four locations active. Domain total 534 / 396 human; the /* wildcard (137), social links and bot/datacenter traffic are excluded. No legible DDS-PC clicks at 30 days either. Geo/device panels are carried from the prior pull (ShortIO summary + path-level only this cycle)." } severity="info" />
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
            <InsightCard title={"Website + Search · " + websiteData.period} body={timeRange === "7d" ? "192 sessions over 7 days (~27/day). Direct leads at 51.3% (97), Google 36.0% (68), then paid social — Instagram 3.7% (7), Audience Network 2.6% (5), plus IG social 1.6% (3). Desktop 70.4% / Mobile 29.0%. The doctor and locations pages trail Home (119) — /ourdoctors (30), /locations (23), /about (18). Fresh GSC this cycle (7-day, one-day lag through Jul 4): 76 clicks, 1.15% CTR, pos ~33, brand-dominant." : "912 sessions over 30 days. Direct 53.0% (483) and Google 34.4% (313) carry ~87% combined. Desktop 72.8% / Mobile 26.6%. /ourdoctors (151) is the clear #2 page — provider pages are the conversion surface. ⚠ The 'appen…workramp.io' referral recurs (16 sessions / 1.8%) — same likely-spam/datacenter source as prior cycles; confirm and filter. GSC (Jun 26–Jul 4 window; full 30-day not exported): the Nerve Pain After Onlay page (17 clicks, pos ~5) still outranks every brand term — the non-brand SEO template to replicate."} severity="info" />
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
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>⚡ Reach surged to ~3,360 (Metricool avg. reach/day &times; 7; largely paid, non-follower reach ~93%), with the biggest days Jul 3–4 on the July 4th push. Blended engagement was ~1.3% (44 account-level interactions), diluted by paid reach; organic per-content ER stayed healthy (Reel 5.68%). (Profile Growth &amp; Discovery CSV retired this cycle — reach is the Metricool avg-reach-per-day basis, not daily-series outlier-adjusted.)</span>
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
                <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>▲ One Reel shipped this week (Jul 2, &ldquo;Dental care should feel different&rdquo;) — 330 views at a ~7s average watch time and a 75% skip rate. It reached 229 and drew 11 likes, 1 save. The lever is a clear save-prompt CTA and a doctor-led format that holds attention longer and reopens organic reach.</span>
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
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#8FA1A6" }}>3,561</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>views</div>
                </div>
                <div style={{ flex: 0, display: "flex", alignItems: "center", fontSize: 16, color: "#D9CCC1" }}>→</div>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(143,161,166,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#8FA1A6" }}>3,360</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>reached</div>
                </div>
                <div style={{ flex: 0, display: "flex", alignItems: "center", fontSize: 16, color: "#D9CCC1" }}>→</div>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(111,80,96,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#6F5060" }}>+8</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>followers</div>
                </div>
              </div>
              <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(111,80,96,0.10)", borderRadius: 10, border: "1px solid rgba(111,80,96,0.25)" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>▲ Reach surged to ~3,360 (largely paid) but blended engagement was ~1.3% (44 account-level interactions). The gap is durable signals — 1 save all week; add booking-CTA and save-prompt stickers and a doctor-led Reel to convert borrowed paid reach into owned interaction.</span>
              </div>
            </div>
          </div>

          <div className="card">
            <InsightCard title={"Social Intelligence · " + socialData.period} body={timeRange === "7d" ? "3,561 account views with reach surging to ~3,360 (Metricool avg. reach/day × 7; largely paid — Ads drove 2,698 of 3,707 content-type views) and a blended engagement rate of ~1.3% (44 account-level interactions ÷ 3,360, per the locked account-level rule vs 21 published). The blend is diluted by paid reach; organic per-content ER is healthy — the solo-brand Reel (Jul 2) at 5.68% (330 views, 229 reach, ~7s watch) and the 'what's in my bag' post at 19.4%. ~80% of views and ~93% of reach came from non-followers. Reach basis flagged: the Profile Growth & Discovery CSV was retired this cycle, so reach is the Metricool avg-reach-per-day basis (not daily-series outlier-adjusted). The lever is converting the paid discovery wave into follows and saves." : "12,230 native account views reaching ~7,530 (avg. reach/day × 30; +206% on the avg-reach basis, paid-driven) with 160 account-level interactions over Jun 6–Jul 5. Reels drove 47% of organic views and 49% of interactions; ~72% of views came from non-followers. Top pieces: 'Great Dentistry Starts With Great Relationships' (351 views, Jun 17), 'Dental Care Should Feel Different' (330, Jul 2) and 'Which Summer Treat Is Toughest?' (312, Jun 26). Paid ads contributed ~73% of content-type views and ~2% of interactions (see Paid Ads). 30-day follower flow is estimated (net balance not separately exported); reach uses the Metricool avg-reach-per-day basis."} severity="success" />
            <InsightCard title="Key Insight" body="This was a paid-driven discovery week. A July 4th ad push put the brand in front of ~2,900 non-followers, lifting account reach to ~3,360 (avg-reach basis, paid-inflated) — but the blended engagement rate reads ~1.3% (44 account-level interactions ÷ 3,360) precisely because paid reach balloons the denominator. Organic per-content engagement is healthy: the solo-brand Reel (Jul 2) hit 5.68% and the 'what's in my bag' post 19.4%. What's working: a strong paid reach wave, a Reel-led mix, and a clean website/search funnel (nerve-pain page 16 clicks at pos 5.0; mobile now out-clicks desktop). What's not yet: converting rented attention into owned signal — net +8 followers and 1 save all week. Two levers: (1) layer booking-link, follow and save CTAs onto the paid creative and Stories before the reach recedes, and (2) bring back a doctor-led / collab Reel to reopen organic (not rented) discovery." severity="info" />
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
              <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Paid drove the week's reach — Ads accounted for 2,698 of 3,707 content-type views (~73%) and 423 reach, concentrated on the July 4th push. ⚠ Spend and per-ad delivery were not re-exported this cycle; figures shown are carried from the prior campaign — verify current spend in Meta Ads Manager before quoting cost-per-reach.</span>
            </div>
          </div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Spend Allocation</div>
              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <Donut data={[{ value: 85 }, { value: 15 }]} colors={["#6F5060", "#8FA1A6"]} size={120} stroke={18} />
                <div style={{ flex: 1 }}>
                  {[{ label: "July 4th whitening promo (boosted)", value: 85, color: "#6F5060" }, { label: "Secondary creative (carried)", value: 15, color: "#8FA1A6" }].map((item) => (
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
            <InsightCard title="Paid Ads · Jul 4th Week (spend detail not re-exported)" body="Paid was the dominant reach driver this week — ads accounted for ~73% of content-type views (2,698) and 423 reach, concentrated on the July 4th whitening promo. ⚠ Metricool's account view only confirms ad reach/views; per-ad spend, budget and quality ranking were not re-exported this cycle, so the dollar figures on the cards are carried from the prior Summer Campaign and should be treated as placeholders — pull current spend from Meta Ads Manager before quoting cost-per-reach or cost-per-booking. ▲ The paid push inflated account reach and compressed the blended engagement rate to ~1.3%; add a Lead or Booking conversion event so next cycle can measure ROI, not just reach." severity="warning" />
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
