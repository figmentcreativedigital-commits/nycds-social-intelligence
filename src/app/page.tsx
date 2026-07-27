"use client";
import { useState, useEffect } from "react";

const FALLBACK_DATA = {
  client: { name: "NYCDS", fullName: "NYC Dental Smiles", period: "July 20 – July 26, 2026" },
  kpi: {
    followers: { value: 735, change: 3, label: "Followers" },
    reach: { value: 6510, label: "Reach" },
    views: { value: 3471, label: "Total Views" },
    engagementRate: { value: 1.0, label: "Engagement Rate", suffix: "%" },
    engagements: { value: 66, label: "Engagements" },
    watchTime: { value: "9.7s", label: "Watch Time" },
  },
  posts: [
    { id: 1, title: "In a City That Never Slows Down (Reel)", type: "Reel", views: 557, reach: 397, likes: 14, comments: 0, saves: 0, shares: 6, isTop: true, igPostUrl: "https://www.instagram.com/reel/DbBmSAZRD6K/" },
    { id: 2, title: "Ice Cream Truck Treats & Your Teeth (Carousel)", type: "Post", views: 289, reach: 123, likes: 2, comments: 0, saves: 0, shares: 2, isTop: false, igPostUrl: "https://www.instagram.com/p/DbGtjHXluCf/" },
  ] as any[],
  contentMix: { posts: 39, reels: 42, stories: 19 },
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
    title: "Reels resumed \u2014 one strong entry, and cadence is the lever",
    evidence: [
      `Engagement rate ${er}% \u2014 down from 1.7%`,
      `${eng} interactions \u2014 down ~50%`,
      "The Jul 20 Reel led: 557 views, 5.04% organic ER, 9.7s avg watch",
      `Reach eased 18% to ${reach.toLocaleString()} on a lighter, paid-inflated week`,
    ],
    impact: "One Reel moved the needle; sustaining cadence is what compounds it.",
    action: "Return to 2\u20133 testimonial Reels a week.",
    severity: "info",
  });

  insights.push({
    title: "A lighter week \u2014 six pieces, led by the new Reel",
    evidence: [
      `Reels ${data.contentMix.reels}% of organic views vs Posts ${data.contentMix.posts}%`,
      "The Jul 20 Reel drew 557 views on 397 reach at 5.04% ER",
      "Four Stories delivered 193 impressions at 46 avg reach",
      "Watch-time data is back: 9.7s avg, 29% 3-sec view rate",
    ],
    impact: "The single Reel worked; volume is the constraint, not appetite.",
    action: "Lift Reel cadence and re-cut the Modern Luxury feature as a Reel.",
    severity: "info",
  });

  insights.push({
    title: "Search CTR improved on lighter volume",
    evidence: [
      "83 clicks at 1.61% CTR \u2014 CTR up week over week",
      "Fewer impressions, higher-quality clicks",
      "Nerve-pain page: 11 clicks, still outranking brand terms",
      "Doctor pages converting \u2014 Chesner 5.88% CTR",
    ],
    impact: "The non-brand SEO template keeps compounding.",
    action: "Publish five or more procedure-question articles on that template.",
    severity: "info",
  });

  insights.push({
    title: "Mobile is the strongest search opportunity",
    evidence: [
      "Mobile position 17.26 vs desktop 37.27 (30d)",
      "Mobile out-clicks desktop 173 vs 163",
      "Search demand skews mobile-first",
      "~69% of site sessions are desktop",
    ],
    impact: "Search demand is mobile-first, so mobile experience is the strongest lever available.",
    action: "Review Core Web Vitals and keep booking CTAs above the fold.",
    severity: "info",
  });

  const topAge = data.audience.age.reduce((a, b) => (a.pct > b.pct ? a : b));
  insights.push({
    title: "The core patient demographic remains strong",
    evidence: [
      `Largest cohort ${topAge.range} at ${topAge.pct}%`,
      `25\u201344 band = ${((data.audience.age[1]?.pct || 0) + (data.audience.age[2]?.pct || 0)).toFixed(1)}% of followers`,
      `Gender split ${data.audience.gender.male}/${data.audience.gender.female} (carried)`,
      "New York = 22.73% of follower base",
    ],
    impact: "The high-value local segment is healthy and well aligned.",
    action: "Keep geo-tagged content running. \u26a0 Demographics carried from the prior pull.",
    severity: "success",
  });

  // ---------- OPPORTUNITIES ----------
  opportunities.push({
    title: "The Modern Luxury press feature still has a long tail",
    evidence: [
      "785 views / 347 reach / 16 likes over the 30-day window",
      "Best-of-the-City 2026 award \u2014 evergreen credibility",
      "Published as a single static post, with room to repurpose",
      "Not yet re-cut for Reels or pinned",
    ],
    impact: "Earned press has a long tail that a single post doesn\u2019t fully capture.",
    action: "Re-cut as a Reel, pin it to the profile, and add the award badge to the bio.",
    severity: "success",
  });

  opportunities.push({
    title: "Booking links are recovering \u2014 keep them in view",
    evidence: [
      "54 clicks this week, up from 28 prior",
      "The new Reel gives an end-frame to carry a CTA again",
      "Four Stories carried booking links",
      "Those Stories averaged 46 accounts each",
    ],
    impact: "The audience was there; making the booking ask more visible is the next step.",
    action: "Add location links to Stories on every posting day.",
    severity: "info",
  });

  const totalSaves = data.posts.reduce((s: number, p: any) => s + (p.saves || 0), 0);
  opportunities.push({
    title: "Saves are the next signal to build",
    evidence: [
      `${totalSaves} saves across all owned content`,
      "16 likes and 8 shares across two new posts",
      "The ice-cream-truck carousel drew 289 views and suits wider distribution",
    ],
    impact: "Saves carry the most ranking weight, which makes them the highest-value signal to grow.",
    action: "Add a \u201cSave this before you book\u201d prompt to explainer carousels.",
    severity: "info",
  });

  opportunities.push({
    title: "Follower growth held through a lighter week",
    evidence: [
      `Net +${data.kpi.followers.change} this week; +32 over 30 days`,
      `Follower share of views ${data.viewerSplit.followers}% (7-day)`,
      `${nf}% of views still come from non-followers`,
    ],
    impact: "Discovery is healthy; publishing volume is what raises the ceiling.",
    action: "Return to a regular Reel cadence to widen the top of the funnel.",
    severity: "success",
  });

  opportunities.push({
    title: "Paid is delivering efficient traffic at a strong cost per visit",
    evidence: [
      "$274.60 spend produced 515 landing-page views at $0.53",
      "Two active ads across the 30-day window",
      "Conversion tracking is the next piece to add",
      "\u2018Let your smile sparkle\u2019 spent $6.96 across the month",
    ],
    impact: "The media buy is efficient; the landing experience is the next lever.",
    action: "Add a Lead/Booking event so results are fully measurable, then refine the whitening page.",
    severity: "info",
  });

  opportunities.push({
    title: "Email opens are excellent, with clicks the next step",
    evidence: [
      "48.7% open rate over the 30-day window \u2014 roughly double the dental norm",
      "55 clicks from 2,313 opens (2.38% click-to-open)",
      "Lifetime click rate 0.91% across 19 campaigns",
      "The two best-ever opens were doctor-led: 73.7% and 72.6%",
    ],
    impact: "A warm, attentive list is ready for a clearer booking ask.",
    action: "Add one booking CTA above the fold in every send.",
    severity: "info",
  });

  alerts.push({
    title: "List hygiene is the highest-value email fix",
    evidence: [
      "14.9% bounce on the Jul 15 NYC Smile Pass send",
      "Lifetime 8.6% across 20,641 sends, against a 2% healthy benchmark",
      "Highest: 5th Ave Returning 22.3%, NYC Smile Pass 14.9%",
    ],
    impact: "Tightening the list protects inbox placement for every future send.",
    action: "Run a list clean before the next campaign and suppress hard bounces going forward.",
    severity: "info",
  });

  // ---------- RECOMMENDATIONS ----------
  recommendations.push(
    { priority: "high", title: "Sustain Reel cadence", why: "The one Reel this week led at 5.04% ER and 9.7s watch — cadence is the lever that broadens discovery.", outcomes: ["Higher engagement rate", "Renewed reach", "Follower growth"] },
    { priority: "high", title: "Rebuild link-in-bio distribution", why: "Clicks recovered to 54 this week; the new Reel restores an end-frame CTA surface.", outcomes: ["Recovered booking clicks", "Location-level attribution"] },
    { priority: "high", title: "Merchandise the Modern Luxury award", why: "Strongest press asset in the 30-day window, published once and left there.", outcomes: ["Additional organic reach", "Cross-platform lift"] },
    { priority: "high", title: "Fix the whitening landing page", why: "Paid delivers 515 landing-page views at $0.53, but conversion rate ranks bottom 35%.", outcomes: ["Better return on existing spend", "Measurable bookings"] },
    { priority: "high", title: "Clean the email list", why: "Bounce rates run 8.6% lifetime and hit 14.9% on the latest send, against a 2% safe ceiling.", outcomes: ["Protected sender reputation", "Better inbox placement"] },
    { priority: "medium", title: "Put a booking CTA in every email", why: "~49% of the list opens; only ~2.4% of those openers click.", outcomes: ["More booked appointments", "Measurable email attribution"] },
    { priority: "medium", title: "Distribute the ice-cream-truck carousel", why: "The week's save-worthy format, under-distributed at 289 views.", outcomes: ["Higher saves", "Stronger ranking signal"] },
    { priority: "medium", title: "Replicate the nerve-pain SEO template", why: "It outranks every brand page and the query cluster is compounding.", outcomes: ["Non-brand search growth"] },
    { priority: "medium", title: "Fund or cut \u2018Let your smile sparkle\u2019", why: "It has spent $6.96 across a full month and is barely delivering.", outcomes: ["Cleaner account structure", "Budget redeployed"] },
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
    period: "July 20 – July 26, 2026",
    totalClicks: 54,
    topLinks: [
      { path: "NYCDS 60th Street", clicks: 13 },
      { path: "NYCDS 5th Ave", clicks: 10 },
      { path: "NYCDS 35th Street", clicks: 10 },
      { path: "Homepage", clicks: 10 },
      { path: "NYCDS 58th Street", clicks: 8 },
      { path: "Website", clicks: 3 },
    ],
    trafficSources: [
      { source: "Named NYCDS links (human)", clicks: 54 },
      { source: "Wildcard / social / excluded", clicks: 41 },
    ],
    topCountries: [
      { country: "United States", clicks: 35 },
    ],
    topCities: [
      { city: "New York City", clicks: 12 },
      { city: "Los Angeles", clicks: 9 },
    ],
    devices: [
      { os: "Chrome", clicks: 50 },
      { os: "Safari", clicks: 11 },
      { os: "Chrome Mobile iOS", clicks: 6 },
      { os: "Mobile Safari", clicks: 5 },
      { os: "Chrome Mobile", clicks: 4 },
      { os: "Firefox", clicks: 3 },
    ],
  };
  const linkData30d = {
    period: "June 27 – July 26, 2026",
    totalClicks: 345,
    topLinks: [
      { path: "Website", clicks: 100 },
      { path: "NYCDS 60th Street", clicks: 79 },
      { path: "NYCDS 5th Ave", clicks: 54 },
      { path: "NYCDS 58th Street", clicks: 41 },
      { path: "NYCDS 35th Street", clicks: 39 },
      { path: "Homepage", clicks: 32 },
    ],
    trafficSources: [
      { source: "Named NYCDS links (human)", clicks: 345 },
      { source: "Wildcard / social / DDS-PC / excluded", clicks: 101 },
    ],
    topCountries: [
      { country: "United States", clicks: 293 },
      { country: "United Kingdom", clicks: 31 },
    ],
    topCities: [
      { city: "New York City", clicks: 54 },
      { city: "Bristol", clicks: 31 },
    ],
    devices: [
      { os: "Chrome", clicks: 266 },
      { os: "Mobile Safari", clicks: 37 },
      { os: "Safari", clicks: 23 },
      { os: "Chrome Mobile", clicks: 18 },
      { os: "IE", clicks: 17 },
      { os: "Edge", clicks: 15 },
    ],
  };
  const linkData = timeRange === "7d" ? linkData7d : linkData30d;

  const websiteData7d = {
    period: "July 20 – July 26, 2026",
    sessions: 230,
    topPages: [
      { page: "/", label: "Home", views: 193 },
      { page: "/comprehensive-care", label: "Comprehensive Care", views: 17 },
      { page: "/ourdoctors", label: "Our Doctors", views: 16 },
      { page: "/cosmetic-dentistry", label: "Cosmetic Dentistry", views: 14 },
      { page: "/locations", label: "Locations", views: 14 },
      { page: "/implant-dentistry", label: "Implant Dentistry", views: 13 },
      { page: "/why-nycds", label: "Why NYCDS", views: 12 },
    ],
    trafficSources: [
      { source: "Direct", sessions: 123, pct: 53.5 },
      { source: "Google", sessions: 63, pct: 27.4 },
      { source: "Instagram (paid)", sessions: 19, pct: 8.3 },
      { source: "Facebook (paid)", sessions: 9, pct: 3.9 },
      { source: "Instagram (organic)", sessions: 2, pct: 0.9 },
      { source: "Other", sessions: 14, pct: 6.1 },
    ],
    devices: [
      { device: "Desktop", pct: 68.7 },
      { device: "Mobile", pct: 31.3 },
    ],
    dailyVisitors: [
      { date: "Jul 20", visitors: 31 },{ date: "Jul 21", visitors: 33 },
      { date: "Jul 22", visitors: 27 },{ date: "Jul 23", visitors: 33 },
      { date: "Jul 24", visitors: 29 },{ date: "Jul 25", visitors: 24 },
      { date: "Jul 26", visitors: 13 },
    ],
    search: {
      totalClicks: 83, totalImpressions: 5141, avgCTR: 1.61, avgPosition: 31.2,
      note: "GSC Jul 19 – Jul 25 (nycdentalsmiles.com · one-day lag)",
      topQueries: [
        { query: "nyc dental smiles", clicks: 11, ctr: 68.75, position: 1.12 },
        { query: "nyc dental smile team", clicks: 4, ctr: 100.00, position: 1.25 },
        { query: "dr farahani dentist", clicks: 2, ctr: 50.00, position: 2.00 },
        { query: "new york dentist", clicks: 1, ctr: 1.89, position: 43.51 },
        { query: "dr chesner", clicks: 1, ctr: 5.26, position: 5.89 },
      ],
      topPages: [
        { page: "Homepage", clicks: 33, impressions: 3127, ctr: 1.06 },
        { page: "Nerve Pain After Onlay", clicks: 11, impressions: 587, ctr: 1.87 },
        { page: "Our Doctors", clicks: 7, impressions: 610, ctr: 1.15 },
        { page: "Dr. Michael Chesner", clicks: 5, impressions: 85, ctr: 5.88 },
      ],
    },
  };
  const websiteData30d = {
    period: "June 27 – July 26, 2026",
    sessions: 1041,
    topPages: [
      { page: "/", label: "Home", views: 829 },
      { page: "/ourdoctors", label: "Our Doctors", views: 130 },
      { page: "/locations", label: "Locations", views: 81 },
      { page: "/about", label: "About", views: 62 },
      { page: "/why-nycds", label: "Why NYCDS", views: 41 },
      { page: "/comprehensive-care", label: "Comprehensive Care", views: 31 },
      { page: "/services", label: "Services", views: 29 },
    ],
    trafficSources: [
      { source: "Direct", sessions: 590, pct: 56.7 },
      { source: "Google", sessions: 275, pct: 26.4 },
      { source: "Instagram (paid)", sessions: 97, pct: 9.3 },
      { source: "Facebook (paid)", sessions: 22, pct: 2.1 },
      { source: "Instagram (organic)", sessions: 15, pct: 1.4 },
      { source: "Audience Network (paid)", sessions: 11, pct: 1.1 },
    ],
    devices: [
      { device: "Desktop", pct: 68.8 },
      { device: "Mobile", pct: 30.8 },
    ],
    dailyVisitors: [
      { date: "Jun 27", visitors: 22 },{ date: "Jul 1", visitors: 37 },
      { date: "Jul 5", visitors: 15 },{ date: "Jul 9", visitors: 55 },
      { date: "Jul 13", visitors: 39 },{ date: "Jul 17", visitors: 41 },
      { date: "Jul 21", visitors: 33 },{ date: "Jul 25", visitors: 24 },
    ],
    search: {
      totalClicks: 344, totalImpressions: 25867, avgCTR: 1.33, avgPosition: 31.6,
      note: "GSC Jun 26 – Jul 25 (nycdentalsmiles.com)",
      topQueries: [
        { query: "nyc dental smiles", clicks: 44, ctr: 61.11, position: 1.36 },
        { query: "nyc dental smile team", clicks: 10, ctr: 47.62, position: 1.71 },
        { query: "nyc smiles", clicks: 5, ctr: 25.00, position: 1.30 },
        { query: "dana kapparova", clicks: 3, ctr: 9.38, position: 3.59 },
        { query: "michael chesner", clicks: 3, ctr: 11.54, position: 2.15 },
      ],
      topPages: [
        { page: "Homepage", clicks: 137, impressions: 15952, ctr: 0.86 },
        { page: "Nerve Pain After Onlay", clicks: 54, impressions: 2951, ctr: 1.83 },
        { page: "Our Doctors", clicks: 35, impressions: 3402, ctr: 1.03 },
        { page: "Dr. Michael Chesner", clicks: 24, impressions: 313, ctr: 7.67 },
      ],
    },
  };
  const websiteData = timeRange === "7d" ? websiteData7d : websiteData30d;

  const socialData7d = {
    period: "July 20 – July 26, 2026",
    followers: 735,
    followerGrowth: 3,
    follows: 3,
    unfollows: 0,
    totalViews: 3471,
    totalReach: 6510,
    reachChange: -17.8,
    totalInteractions: 66,
    viewSplit: { followers: 31, nonFollowers: 69 },
    engagementSplit: { followers: 60, nonFollowers: 40 },
    viewsByType: { reels: 42, posts: 39, stories: 19 },
    interactionsByType: { reels: 48, posts: 25, stories: 27 },
    totalLikes: 16,
    totalComments: 0,
    totalSaves: 0,
    totalShares: 8,
    storyViews: 193, storyCompletion: "—", storyCount: 4,
    reelAvgWatchTime: "9.7s", reelSkipRate: "—",
    dailyViews: [
      { date: "Jul 20", views: 800 },{ date: "Jul 21", views: 430 },
      { date: "Jul 22", views: 470 },{ date: "Jul 23", views: 660 },
      { date: "Jul 24", views: 290 },{ date: "Jul 25", views: 460 },
      { date: "Jul 26", views: 361 },
    ],
    posts: [
      { id: 1, title: "In a city that never slows down (Reel)", type: "Reel", date: "Jul 20", views: 557, reach: 397, likes: 14, comments: 0, saves: 0, shares: 6, er: 5.04, skipRate: 0, avgWatch: "9.7s", igUrl: "https://www.instagram.com/reel/DbBmSAZRD6K/", isTop: true },
      { id: 2, title: "Ice Cream Truck Treats & Your Teeth (Carousel)", type: "Post", date: "Jul 22", views: 289, reach: 123, likes: 2, comments: 0, saves: 0, shares: 2, er: 3.25, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/p/DbGtjHXluCf/", isTop: false },
    ],
  };
  const socialData30d = {
    period: "June 27 – July 26, 2026",
    followers: 735,
    followerGrowth: 32,
    follows: 32,
    unfollows: 0,
    totalViews: 17630,
    totalReach: 25230,
    reachChange: 25.9,
    totalInteractions: 401,
    viewSplit: { followers: 28, nonFollowers: 72 },
    engagementSplit: { followers: 56, nonFollowers: 44 },
    viewsByType: { reels: 41, posts: 35, stories: 23 },
    interactionsByType: { reels: 53, posts: 31, stories: 16 },
    totalLikes: 165,
    totalComments: 18,
    totalSaves: 5,
    totalShares: 35,
    storyViews: 1087, storyCompletion: "—", storyCount: 16,
    reelAvgWatchTime: "—",
    reelSkipRate: "—",
    dailyViews: [
      { date: "Jun 27", views: 380 },{ date: "Jul 1", views: 400 },
      { date: "Jul 5", views: 380 },{ date: "Jul 9", views: 700 },
      { date: "Jul 13", views: 1200 },{ date: "Jul 17", views: 1250 },
      { date: "Jul 21", views: 780 },{ date: "Jul 25", views: 820 },
    ],
    posts: [
      { id: 1, title: "When Patients No Longer Dread the Dentist", type: "Reel", date: "Jul 10", views: 1183, reach: 704, likes: 36, comments: 8, saves: 1, shares: 10, er: 7.81, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/reel/Dan-hMNxehU/", isTop: true },
      { id: 2, title: "What Keeps Patients Coming Back", type: "Reel", date: "Jul 11", views: 1157, reach: 716, likes: 50, comments: 5, saves: 2, shares: 11, er: 9.50, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/reel/DaqGc-npEIe/", isTop: false },
      { id: 3, title: "Modern Luxury Manhattan — Best of the City 2026", type: "Post", date: "Jul 16", views: 785, reach: 347, likes: 16, comments: 0, saves: 1, shares: 3, er: 5.76, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/p/Da3h0SUlly6/", isTop: false },
      { id: 4, title: "In a City That Never Slows Down", type: "Reel", date: "Jul 20", views: 557, reach: 397, likes: 14, comments: 0, saves: 0, shares: 6, er: 5.04, skipRate: 0, avgWatch: "9.7s", igUrl: "https://www.instagram.com/reel/DbBmSAZRD6K/", isTop: false },
      { id: 5, title: "Dental Care Should Feel Different", type: "Reel", date: "Jul 2", views: 385, reach: 256, likes: 14, comments: 0, saves: 1, shares: 1, er: 6.25, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/reel/DaTPVCpRq5W/", isTop: false },
      { id: 6, title: "Craving Chocolate This Summer? (Carousel)", type: "Post", date: "Jul 9", views: 297, reach: 84, likes: 5, comments: 5, saves: 0, shares: 0, er: 11.90, skipRate: 0, avgWatch: "—", igUrl: "https://www.instagram.com/p/DalUNMBFqUc/", isTop: false },
    ],
  };
  const socialData = timeRange === "7d" ? socialData7d : socialData30d;
  const overviewKpis = timeRange === "7d" ? [
    { label: "Followers", value: 735, change: "+3", delay: 0 },
    { label: "Views", value: 3471, delay: 80 },
    { label: "Reach", value: 6510, change: "-18%", delay: 160 },
    { label: "Interactions", value: 66, delay: 240 },
    { label: "Non-Follower", value: "~69%", delay: 320 },
  ] : [
    { label: "Followers", value: 735, change: "+32", delay: 0 },
    { label: "Views", value: 17630, delay: 80 },
    { label: "Reach", value: 25230, delay: 160 },
    { label: "Interactions", value: 401, delay: 240 },
    { label: "Non-Follower", value: "~72%", delay: 320 },
  ];


  const adsData = {
    period: "June 27 – July 26, 2026",
    campaign: "July Whitening Promo (active through Jul 31)",
    totalSpend: 274.60,
    budget: 250,
    impressions: 30637,
    reach: 19100,
    activeAds: 2,
    results: 515,
    costPerResult: 0.53,
    pctOfViews: 46.8,
    pctOfInteractions: 3.5,
    ads: [
      { name: "Stars Stripes & Brighter Smiles (active)", spend: 267.64, impressions: 29854, reach: 18384, quality: "Quality Average · Engagement Above average · Conversion rate Below average (bottom 35%) — 505 landing-page views @ $0.53" },
      { name: "Let your smile sparkle this summer (active)", spend: 6.96, impressions: 783, reach: 716, quality: "Quality Average · Engagement Average · Conversion rate Below average (bottom 35%) — 10 landing-page views @ $0.70 · still barely delivering" },
    ],
  };

  const emailData7d = {
    period: "June 27 \u2013 July 26, 2026",
    campaignCount: 5, sends: 4754, opens: 2313, openRate: 48.7,
    clicks: 55, clickRate: 1.16, ctor: 2.38,
    bounces: 360, bounceRate: 7.6, unsubs: 19, unsubRate: 0.40,
    campaigns: [
      { name: "July Whitening Promo \u00b7 60th St.", date: "Jul 6", sends: 1990, opens: 1091, openRate: 56.9, clicks: 30, clickRate: 1.6, bounceRate: 3.6, mobile: 29.5 },
      { name: "July Whitening Promo \u00b7 58th St.", date: "Jul 6", sends: 965, opens: 419, openRate: 46.0, clicks: 7, clickRate: 0.8, bounceRate: 5.6, mobile: 16.7 },
      { name: "NYC Smile Pass Announcement", date: "Jul 15", sends: 857, opens: 326, openRate: 44.7, clicks: 7, clickRate: 1.0, bounceRate: 14.9, mobile: 35.3 },
      { name: "July Whitening Promo \u00b7 5th Ave.", date: "Jul 6", sends: 784, opens: 414, openRate: 60.4, clicks: 8, clickRate: 1.2, bounceRate: 12.6, mobile: 32.0 },
      { name: "July Whitening Promo \u00b7 35th St.", date: "Jul 6", sends: 158, opens: 63, openRate: 42.0, clicks: 3, clickRate: 2.0, bounceRate: 5.1, mobile: 14.3 },
    ],
  };
  const emailData30d = {
    period: "June 27 \u2013 July 26, 2026",
    campaignCount: 5, sends: 4754, opens: 2313, openRate: 48.7,
    clicks: 55, clickRate: 1.16, ctor: 2.38,
    bounces: 360, bounceRate: 7.6, unsubs: 19, unsubRate: 0.40,
    campaigns: [
      { name: "July Whitening Promo \u00b7 60th St.", date: "Jul 6", sends: 1990, opens: 1091, openRate: 56.9, clicks: 30, clickRate: 1.6, bounceRate: 3.6, mobile: 29.5 },
      { name: "July Whitening Promo \u00b7 58th St.", date: "Jul 6", sends: 965, opens: 419, openRate: 46.0, clicks: 7, clickRate: 0.8, bounceRate: 5.6, mobile: 16.7 },
      { name: "NYC Smile Pass Announcement", date: "Jul 15", sends: 857, opens: 326, openRate: 44.7, clicks: 7, clickRate: 1.0, bounceRate: 14.9, mobile: 35.3 },
      { name: "July Whitening Promo \u00b7 5th Ave.", date: "Jul 6", sends: 784, opens: 414, openRate: 60.4, clicks: 8, clickRate: 1.2, bounceRate: 12.6, mobile: 32.0 },
      { name: "July Whitening Promo \u00b7 35th St.", date: "Jul 6", sends: 158, opens: 63, openRate: 42.0, clicks: 3, clickRate: 2.0, bounceRate: 5.1, mobile: 14.3 },
    ],
  };
  const emailData = timeRange === "7d" ? emailData7d : emailData30d;
  const emailLifetime = {
    campaigns: 19, sends: 20641, opens: 7884, openRate: 38.2,
    clicks: 188, clickRate: 0.91, ctor: 2.38, bounces: 1785, bounceRate: 8.6, unsubs: 86,
    bestOpens: [
      { name: "Dr. Eisdorfer's Retirement Letter", rate: 73.7 },
      { name: "Dr. Giraldo V3", rate: 72.6 },
      { name: "July Whitening Promo · 5th Ave.", rate: 60.4 },
      { name: "World Oral Health Day", rate: 57.6 },
      { name: "July Whitening Promo · 60th St.", rate: 56.9 },
    ],
    worstBounce: [
      { name: "Returning Customers · 933 5th Ave", rate: 22.3, sends: 220 },
      { name: "NYC Smile Pass Announcement", rate: 14.9, sends: 857 },
      { name: "250th Birthday · 58th St.", rate: 14.5, sends: 871 },
      { name: "July Whitening Promo · 5th Ave.", rate: 12.6, sends: 784 },
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
                  { val: d.kpi.reach.value.toLocaleString(), label: "Reach", delta: "18%", dir: "down" },
                  { val: d.kpi.views.value.toLocaleString(), label: "Views", delta: "37%", dir: "down" },
                  { val: `${d.viewerSplit.nonFollowers}%`, label: "Non-Follower", delta: "flat", dir: "flat" },
                ]}
                noteLabel="Takeaway"
                notes={[
                  { text: "Reach and views both eased on a lighter, six-piece week.", tone: "" },
                  { text: "Discovery is still ~69% non-follower \u2014 paid and the new Reel drive it.", tone: "" },
                  { text: "Follower share of views held at 31%.", tone: "pos" },
                ]}
              />
              <ExecCard
                eyebrow="Engagement"
                tone="warn"
                metrics={[
                  { val: `${d.kpi.engagementRate.value}%`, label: "Eng. Rate", delta: "0.7pt", dir: "down" },
                  { val: d.kpi.engagements.value.toLocaleString(), label: "Interactions", delta: "50%", dir: "down" },
                  { val: `+${d.kpi.followers.change}`, label: "Followers", delta: "+32 30d", dir: "up" },
                ]}
                noteLabel="Why"
                notes={[
                  { text: "Only one Reel this week \u2014 but it worked: 5.04% ER, 9.7s watch.", tone: "pos" },
                  { text: "66 account-level interactions; the carousel added 4.", tone: "" },
                  { text: "16 likes and 8 shares; saves are the next signal to build.", tone: "" },
                ]}
              />
              <ExecCard
                eyebrow="Content"
                tone="neutral"
                hero={{
                  label: "Top Performer",
                  title: "In a City That Never Slows Down (Reel)",
                  stats: [{ val: "557", label: "views" }, { val: "397", label: "reach" }, { val: "14", label: "likes" }],
                }}
                noteLabel="Key Notes"
                notes={[
                  { text: `Reels led the mix at ${d.contentMix.reels}%; Posts ${d.contentMix.posts}%, Stories ${d.contentMix.stories}%.`, tone: "pos" },
                  { text: "Stories delivered 46 avg reach across four posts.", tone: "" },
                  { text: "Search quality steady: 83 clicks at 1.61% CTR.", tone: "pos" },
                  { text: "Link clicks at 54 on the allowlist.", tone: "" },
                ]}
              />
            </div>
          </div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Content Mix</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.contentMix.reels }, { value: d.contentMix.posts }, { value: d.contentMix.stories }]} colors={["#6F5060", "#8FA1A6", "#A6968D"]} size={120} stroke={18} /><div style={{ flex: 1 }}>{[{ label: "Reels", value: d.contentMix.reels, color: "#6F5060" }, { label: "Posts", value: d.contentMix.posts, color: "#8FA1A6" }, { label: "Stories", value: d.contentMix.stories, color: "#A6968D" }].map((item) => (<div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}><div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} /><span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span><span className="display-num">{item.value}%</span></div>))}</div></div></div>
            <div className="card"><div className="card-hd">Viewer Composition</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.viewerSplit.nonFollowers }, { value: d.viewerSplit.followers }]} colors={["#6F5060", "#D9C5C1"]} size={120} stroke={18} /><div style={{ flex: 1 }}>{[{ label: "Non-Followers", value: d.viewerSplit.nonFollowers, color: "#6F5060" }, { label: "Followers", value: d.viewerSplit.followers, color: "#D9C5C1" }].map((item) => (<div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}><div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} /><span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span><span className="display-num">{item.value}%</span></div>))}<div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(143,161,166,0.12)", borderRadius: 10, border: "1px solid rgba(143,161,166,0.25)" }}><span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Wide discovery — ~69% of views and the bulk of reach came from non-followers (2,244 vs 991 views; 813 non-follower vs 33 follower on the deduplicated reach card). Follower share of views held at 31% on a lighter week</span></div></div></div></div>
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
            <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Reels resumed after a press-only prior week — the Jul 20 &ldquo;In a City That Never Slows Down&rdquo; Reel led at 557 views on 397 reach with a 5.04% organic ER and 9.7s avg watch (29% 3-sec view rate). The ice-cream-truck carousel (289 / 123, 3.25% ER) followed, with four Stories carrying 193 impressions. Reach eased to ~6,510 (Metricool 930/day &times; 7; &minus;18% WoW) and views to 3,471 (&minus;37%) on a lighter six-piece week, with interactions at 66 (1.0% blended ER).</span>
          </div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Watch Time Analytics</div><div style={{ textAlign: "center", padding: "8px 0 22px" }}><div className="big-num">{d.kpi.watchTime.value}</div><div style={{ fontSize: 12, color: "#9B9196", marginTop: 2 }}>Avg Watch / Reel</div></div><div style={{ display: "flex", gap: 14 }}><div className="stat-box"><div className="big-num-sm plum">557</div><div className="stat-label">Reel Views (Jul 20)</div></div><div className="stat-box"><div className="big-num-sm steel">{d.kpi.views.value.toLocaleString()}</div><div className="stat-label">Total Views</div></div></div><div className="alert-box plum-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>✦ Reels are back — the Jul 20 &ldquo;In a City That Never Slows Down&rdquo; Reel drew 557 views at a 9.7s average watch, with 29% of viewers watching 3+ seconds. That is the healthiest organic signal of the week (5.04% ER) and the argument to lift Reel cadence: the format earns watch time no static post can match. Sustaining two to three Reels a week is the lever.</span></div></div>
            <div className="card"><div className="card-hd">Engagement Breakdown</div><div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{[{ label: "Likes", value: d.posts.reduce((s: number, p: any) => s + (p.likes||0), 0), max: 60, color: "#6F5060" }, { label: "Comments", value: d.posts.reduce((s: number, p: any) => s + (p.comments||0), 0), max: 60, color: "#8FA1A6" }, { label: "Shares", value: d.posts.reduce((s: number, p: any) => s + (p.shares||0), 0), max: 60, color: "#A6968D" }, { label: "Saves", value: d.posts.reduce((s: number, p: any) => s + (p.saves||0), 0), max: 60, color: "#BE5A5A" }].map((m) => (<div key={m.label} style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 72, fontSize: 13, fontWeight: 500 }}>{m.label}</div><div style={{ flex: 1, height: 10, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}><div style={{ width: `${(Math.max(m.value, 0.5) / m.max) * 100}%`, height: "100%", background: m.color, borderRadius: 99, transition: "width 1.2s ease" }} /></div><div className="display-num" style={{ width: 30, textAlign: "right" as const }}>{m.value}</div></div>))}</div><div className="alert-box danger-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#BE5A5A" }}>▲ Blended account engagement came in at ~1.0% (66 account-level interactions ÷ 6,510 reach, which paid distribution inflates), while organic per-content ER stayed healthy — the Reel at 5.04% and the carousel at 3.25%. The owned-content breakdown below (16 likes, 8 shares, 0 saves across the 2 new posts) shows shares are landing but saves are not yet. Sustaining a Reel cadence and adding an explicit save prompt to each caption are the two levers.</span></div></div>
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
            <InsightCard title={"Link Attribution · " + linkData.period} body={timeRange === "7d" ? "54 clicks over 7 days across the six allowlisted NYCDS links — 60th Street (13) led, then 5th Ave (10), 35th Street (10) and Homepage (10), 58th Street (8) and Website (3). ✓ Actual this cycle: the 7-day per-link split is read directly from the ShortIO 7-day Path screenshot, not modeled. Excluded: the /* wildcard (25) and LinkedIn (16). ⚠ The device panel shows browser families (Chrome, Safari, Mobile Safari…) — Short.io's PDF export omitted OS-level counts this cycle. The city panel reflects verified local engagement — New York City (12) and Los Angeles (9). ✓ DDS-PC merge applied — /DDS-PC-UES was legible at 1 click and has been stripped from NYCDS and passed to the EEC report; no Midtown link appeared." : "345 attributed clicks over 30 days across the four office links plus Website and Homepage — Website (100) led, then 60th Street (79), 5th Ave (54), 58th Street (41), 35th Street (39) and Homepage (32); all four locations active. Excluded: the /* wildcard (44) and social links (LinkedIn 47, IG 5, FB 4); the city panel reflects verified local engagement. ✓ DDS-PC merge applied — /DDS-PC-UES (1 click) was legible and has been stripped from NYCDS and merged into the EEC report."} severity="info" />
          </div>
        </>)}

        {tab === "website" && (<>
          <div className="kpi-row">
            {[
              { label: "Total Sessions", value: websiteData.sessions, delay: 0 },
              { label: "Page Views", value: websiteData.topPages.reduce((s, p) => s + p.views, 0), delay: 80 },
              { label: "Top Source", value: "Direct (~54%)", delay: 160 },
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
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>✦ Desktop-heavy traffic (~69%) — worth optimising for desktop conversion</span>
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
            <InsightCard title={"Website + Search · " + websiteData.period} body={timeRange === "7d" ? "190 new visitors over 7 days (~27/day), on 230 sessions: Direct leads at 53.5% (123), Google 27.4% (63), then paid social — Instagram 8.3% (19), Facebook 3.9% (9) — plus 2 organic Instagram sessions. Desktop 68.7% / Mobile 31.3%. Comprehensive Care (17), Our Doctors (16) and Cosmetic Dentistry (14) trail Home (193). Fresh GSC (Jul 19–25, one-day lag): 83 clicks, 1.61% CTR, pos ~31 — CTR up on last cycle, on lighter impressions, a quality gain rather than a volume one. Traffic-source and page splits are actual GA4 7-day exports this cycle, not modeled." : "1,041 sessions over 30 days (887 new visitors). Direct 56.7% (590) and Google 26.4% (275) carry ~83% combined; paid social adds ~13% (IG 97, FB 22, Audience Network 11). Desktop 68.8% / Mobile 30.8%. /ourdoctors (130) is the clear #2 page — provider pages remain the conversion surface, and search confirms it (Chesner 7.67% CTR over 30 days). ✓ A low-quality referral (2 sessions) has been held out; the source mix reflects verified visits. GSC (true 30-day, Jun 26–Jul 25): 344 clicks at 1.33% CTR; the Nerve Pain After Onlay page (54 clicks, pos 5.39) still outranks every brand term — the non-brand SEO template to replicate."} severity="info" />
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
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>⚡ Reach eased to ~6,510 (Metricool avg. reach/day of 930 &times; 7; &minus;18% WoW, non-follower-heavy) and views to 3,471 (&minus;37%), with the biggest day Jul 20 &mdash; the launch of the new Reel. Blended engagement came in at ~1.0% (66 account-level interactions); organic per-content ER held up (Reel 5.04%, Carousel 3.25%). (Profile Growth &amp; Discovery CSV retired — reach is the Metricool avg-reach-per-day basis, not daily-series outlier-adjusted; the daily view shape is read from the Metricool chart and is approximate, summing to the actual 3,471 total.)</span>
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
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Reels led views (42%) this week, with Posts at 39% and Stories 19%. Reels carried 48% of the 66 interactions on a single new post. Sustaining a 2–3 Reel/week cadence is the lever that broadens discovery again.</span>
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
                <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Reels resumed this cycle — the Jul 20 Reel logged a 9.7s average watch with 29% watching 3+ seconds, on 557 views and a 5.04% ER; skip rate was not in this export. Over the 30-day window the Reels averaged ~518 reach each against ~215 for static posts — a ~2.4&times; advantage, the reason cadence matters. Two to three testimonial Reels per week is the lever.</span>
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
                <div style={{ fontSize: 36, fontWeight: 700, color: "#6F5060" }}>0.09%</div>
                <div style={{ fontSize: 12, color: "#9B9196", marginTop: 4 }}>Views → Follower Conversion</div>
              </div>
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(143,161,166,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#8FA1A6" }}>3,471</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>views</div>
                </div>
                <div style={{ flex: 0, display: "flex", alignItems: "center", fontSize: 16, color: "#D9CCC1" }}>→</div>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(143,161,166,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#8FA1A6" }}>6,510</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>reached</div>
                </div>
                <div style={{ flex: 0, display: "flex", alignItems: "center", fontSize: 16, color: "#D9CCC1" }}>→</div>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "10px", background: "rgba(111,80,96,0.08)", borderRadius: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#6F5060" }}>+3</div>
                  <div style={{ fontSize: 10, color: "#9B9196" }}>followers</div>
                </div>
              </div>
              <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(111,80,96,0.10)", borderRadius: 10, border: "1px solid rgba(111,80,96,0.25)" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>✦ Reach eased to ~6,510 (−18%) and views to 3,471 (−37%), with blended engagement at ~1.0% (66 account-level interactions) — publishing volume, not audience appetite, was the variable this lighter week. Follower growth held at +3 net (+32 over 30 days), and the one new Reel did the heavy lifting at a 5.04% ER and 9.7s watch. Durable signals are the next build: 0 saves, 8 shares, and 54 link clicks. Sustaining a Reel cadence and keeping booking links in Stories are the two levers.</span>
              </div>
            </div>
          </div>

          <div className="card">
            <InsightCard title={"Social Intelligence · " + socialData.period} body={timeRange === "7d" ? "3,471 account views (−37%) with reach at ~6,510 (Metricool avg. reach/day of 930 × 7; −18% WoW) and a blended engagement rate of ~1.0% (66 account-level interactions ÷ 6,510, paid-inflated), compared with 1.7% last cycle. Reels resumed after a press-only week: one new Reel, a carousel and four Stories carried the output. The Jul 20 'In a City That Never Slows Down' Reel led — 557 views on 397 reach with a 5.04% organic ER and 9.7s avg watch (29% 3-sec view rate). Stories delivered 193 impressions at 46 avg reach across four posts. ~69% of views and the bulk of reach came from non-followers, though follower share of views held at 31%. Ads accounted for ~29% of content-type views. ⚠ Engagement-by-follower split is carried from the prior pull; reach is the Metricool avg-reach-per-day basis since the Profile Growth & Discovery CSV was retired." : "17,630 native account views reaching ~25,230 (avg. reach/day of 841 × 30; +25.9% on the avg-reach basis, up from 20,040) with 401 account-level interactions over Jun 27 – Jul 26. Reels drove 41% of organic views and 53% of interactions, and out-reached the static posts — which is why sustaining Reel cadence matters. ~72% of views came from non-followers. Top pieces: 'When Patients No Longer Dread the Dentist' (1,183 views, Jul 10), 'What Keeps Patients Coming Back' (1,157, Jul 11) and the Modern Luxury feature (785, Jul 16). Followers +32. Paid ads contributed ~47% of content-type views and ~4% of interactions (see Paid Ads). ⚠ Modeled: per-reel likes/comments/saves/shares are apportioned by reach share where reel-level breakdowns were not in the export. Engagement-by-follower split and IG demographics are carried from the prior pull."} severity="success" />
            <InsightCard
              title="Key Insight"
              evidence={[
                "Reach \u221218% to 6,510 and views \u221237% to 3,471 on a lighter week",
                "Engagement rate 1.0%, with 66 account-level interactions",
                "New Jul 20 Reel led: 557 views, 397 reach, 5.04% ER, 9.7s watch",
                "Ice-cream-truck carousel followed: 289 views, 3.25% ER",
                "Followers +3 this week (+32 over 30 days)",
              ]}
              impact="Distribution is healthy and the audience is responsive; publishing cadence is the variable that moves engagement."
              action="Return to two or three testimonial Reels per week and put booking links back in front of the audience daily."
              severity="success" />
          </div>
        </>)}

        {tab === "ads" && (<>
          <div className="kpi-row">
            {[
              { label: "Total Spend", value: "$274.60", delay: 0 },
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
              <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ $274.60 over 30 days across the July Whitening Promo — spend edged just past the $250 line as the campaign runs through Jul 31. Landing-page views rose to 515 at $0.53 each — strong, steady efficiency. The lead ad's engagement ranking improved to <em>Above average</em> while conversion still ranks bottom 35%, so adding conversion tracking is the next piece. ⚠ Per-ad reach is not de-duplicated (Meta reports it per ad), so the 19,100 total overstates unique people — impressions are the additive metric.</span>
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
            <div className="card"><div className="card-hd">Paid Contribution · Native IG · Jun 27 – Jul 26</div>
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
                <span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Paid sent ~130 of the 1,041 website sessions over the 30-day window (Instagram 97, Facebook 22, Audience Network 11) — ~13% of site traffic. In the 7-day view ads accounted for ~29% of content-type views and a small share of the 66 interactions. ⚠ Attribution difference worth noting: Meta claims 515 landing-page views over the same window while GA4 attributes ~130 paid sessions — a ~4&times; spread driven by Meta's 7-day-click/1-day-view window and by landing-page views not equalling sessions. Trust the GA4 figure for traffic; use Meta's only for relative ad comparison. Native-IG shares shown here are Metricool's account view; spend and impressions above are Meta's, which counts all placements.</span>
              </div>
            </div>
          </div>
          <div className="card">
            <InsightCard
              title="Paid is delivering efficient traffic"
              evidence={[
                "$274.60 spend across two active ads",
                "515 landing-page views at $0.53 \u2014 strong efficiency",
                "Lead ad's engagement ranking improved to Above average",
                "Conversion tracking is the next piece to add",
                "Ads contributed ~47% of content views over 30 days",
              ]}
              impact="Media buying is working. The page it points at is not."
              action="Add a Lead/Booking event, then fix the whitening landing page before adding budget."
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
              { label: "Bounce Rate", value: emailData.bounceRate + "%", delay: 320 },
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
                    {[{ l: "opens", v: c.opens.toLocaleString() }, { l: "clicks", v: c.clicks }, { l: "click rate", v: c.clickRate + "%" }, { l: "bounce", v: c.bounceRate + "%" }, { l: "mobile open", v: c.mobile + "%" }].map((m) => (
                      <div key={m.l}><span style={{ fontSize: 13, fontWeight: 700, color: m.l === "bounce" ? "#BE5A5A" : "#6F5060" }}>{m.v}</span> <span style={{ fontSize: 11, color: "#9B9196" }}>{m.l}</span></div>
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
                  { label: "Delivered", value: emailData.sends - emailData.bounces, max: emailData.sends, color: "#8FA1A6" },
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

            <div className="card"><div className="card-hd">List Health</div>
              <div style={{ textAlign: "center" as const, padding: "10px 0 18px" }}>
                <div className="big-num" style={{ color: "#BE5A5A" }}>{emailData.bounceRate}%</div>
                <div style={{ fontSize: 12, color: "#9B9196", marginTop: 2 }}>Bounce Rate · {emailData.period}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {emailLifetime.worstBounce.map((b) => (
                  <div key={b.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ flex: 1, fontSize: 12.5, color: "#5C4E54" }}>{b.name}</span>
                    <span style={{ fontSize: 11, color: "#9B9196" }}>{b.sends.toLocaleString()}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: b.rate >= 10 ? "#BE5A5A" : "#A6968D", width: 46, textAlign: "right" as const }}>{b.rate}%</span>
                  </div>
                ))}
              </div>
              <div className="alert-box danger-bg">
                <span style={{ fontSize: 12, fontWeight: 600, color: "#BE5A5A" }}>✦ The healthy benchmark sits around 2%. The lifetime average is {emailLifetime.bounceRate}% across {emailLifetime.sends.toLocaleString()} sends, so a list refresh is the highest-value quick win here — it protects deliverability for every future send.</span>
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

            <div className="card"><div className="card-hd">Lifetime Benchmark · 19 NYCDS Campaigns</div>
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
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>✦ Open rates have climbed sharply through 2026 — the February newsletters ran 17&ndash;22%, the July promos 41&ndash;59%. Subject lines and send timing are working. ⚠ Three DDS-PC / EEC campaigns (7,320 sends) were stripped from this view per the locked client-separation rule.</span>
              </div>
            </div>
          </div>

          <div className="card"><div className="card-hd">Email Intelligence</div>
            <InsightCard
              title="Email opens are excellent, with clicks the next step"
              evidence={[
                `${emailData.openRate}% open rate over ${emailData.campaignCount} campaign${emailData.campaignCount > 1 ? "s" : ""} \u2014 well above the ~25% dental norm`,
                `Only ${emailData.clicks} clicks from ${emailData.opens.toLocaleString()} opens (${emailData.ctor}% click-to-open)`,
                "Lifetime click rate 0.91% across 19 campaigns",
                "Best-ever opens were both doctor-led, at 73.7% and 72.6%",
              ]}
              impact="The list reads the email. It just never gets asked to book."
              action="Put one booking CTA above the fold in every send."
              severity="info" />
            <InsightCard
              title="List hygiene is the highest-value email fix"
              evidence={[
                `${emailData.bounceRate}% bounce rate this period \u2014 the healthy ceiling is 2%`,
                "Lifetime 8.6% across 20,641 sends",
                "Highest: 35th St. Podcast (27.5%), 5th Ave Returning (22.3%)",
                "NYC Smile Pass bounced 128 of 857 sends",
              ]}
              impact="Sustained bounces at this level put inbox placement at risk for every future send."
              action="Run list cleaning before the next campaign, then suppress hard bounces permanently."
              severity="info" />
          </div>
        </>)}

        {tab === "audience" && (<>
          <div className="cols2">
            <div className="card"><div className="card-hd">Gender Split</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.audience.gender.male }, { value: d.audience.gender.female }]} colors={["#6F5060", "#8FA1A6"]} size={130} stroke={20} /><div style={{ flex: 1 }}>{[{ label: "Male", value: d.audience.gender.male, color: "#6F5060" }, { label: "Female", value: d.audience.gender.female, color: "#8FA1A6" }].map((g) => (<div key={g.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}><div style={{ width: 12, height: 12, borderRadius: 4, background: g.color }} /><span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{g.label}</span><span className="display-num-lg">{g.value}%</span></div>))}</div></div></div>
            <div className="card"><div className="card-hd">Age Distribution</div>{d.audience.age.map((a) => (<div key={a.range} className="age-row"><div className="age-label">{a.range}</div><div className="age-track"><div className="age-fill" style={{ width: `${(a.pct / 36) * 100}%`, background: a.pct >= 28 ? "#6F5060" : a.pct >= 20 ? "#8FA1A6" : "#A6968D" }} /></div><div className="age-pct">{a.pct}%</div></div>))}</div>
          </div>
          <div className="card"><div className="card-hd">Audience Intelligence</div>
            <InsightCard title="Core Patient Demographic" body="About 60% of the audience falls in the 25–44 age range (30% aged 25–34, 30% aged 35–44) — the prime demographic for general, cosmetic and restorative dentistry. Gender is balanced at 51/49 male/female, and New York is the single largest follower market at 22.73% of the base — a tightly local, high-intent core. This is the highest lifetime-value segment for NYC Dental Smiles. ⚠ Demographic breakdown is carried from the prior pull — Metricool exports these as chart images and no legible demographic table was re-exported this cycle; New York at 22.73% of followers is from the current IG PDF." severity="success" />
            <InsightCard title="Geography Is the Edge" body="At 22.73% of the follower base, New York leads every other market by a wide margin. The follower base is balanced at 51% male / 49% female. Local intent is the asset — geo-specific Story CTAs, location-tagged content, and office-specific booking links convert this audience better than broad reach plays. That case held this week: the four office links drew the bulk of the month\u2019s 54 clicks on the allowlist, led by 60th Street. ⚠ Gender and city percentages are carried from the prior pull; New York at 22.73% is from the current IG PDF." severity="info" />
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
