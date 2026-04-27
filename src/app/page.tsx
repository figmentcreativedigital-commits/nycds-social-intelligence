"use client";
import { useState, useEffect } from "react";

const FALLBACK_DATA = {
  client: { name: "NYCDS", fullName: "NYC Dental Smiles", period: "Apr 13 – Apr 27, 2026" },
  kpi: {
    followers: { value: 681, change: 5, label: "Followers" },
    reach: { value: 895, label: "Reach" },
    views: { value: 6153, label: "Total Views" },
    engagementRate: { value: 20.3, label: "Engagement Rate", suffix: "%" },
    engagements: { value: 182, label: "Engagements" },
    watchTime: { value: "—", label: "Watch Time" },
  },
  posts: [
    { id: 1, title: "Building Patient Trust – Collab w/ EEC", type: "Reel", views: 2000, reach: 600, likes: 40, comments: 3, saves: 1, shares: 3, isTop: true, isCollab: true, igPostUrl: "" },
    { id: 2, title: "More Than a Job – Collab w/ EEC", type: "Reel", views: 1900, reach: 550, likes: 35, comments: 0, saves: 1, shares: 5, isTop: false, isCollab: true, igPostUrl: "" },
    { id: 3, title: "Team Culture – What Keeps Us Going", type: "Reel", views: 864, reach: 407, likes: 19, comments: 2, saves: 0, shares: 1, isTop: false, igPostUrl: "https://www.instagram.com/reel/DXcQnoSp92L/" },
    { id: 4, title: "Have You Seen Our Ad Yet?", type: "Reel", views: 696, reach: 275, likes: 10, comments: 3, saves: 1, shares: 4, isTop: false, igPostUrl: "https://www.instagram.com/reel/DXjqa3ZpvbN/" },
    { id: 5, title: "Your New Favorite Dentist", type: "Reel", views: 555, reach: 275, likes: 7, comments: 0, saves: 0, shares: 1, isTop: false, igPostUrl: "https://www.instagram.com/reel/DXhTaOyp0hT/" },
    { id: 6, title: "This Snack Is Bad for Your Teeth", type: "Reel", views: 356, reach: 248, likes: 8, comments: 0, saves: 0, shares: 0, isTop: false, igPostUrl: "https://www.instagram.com/reel/DXP0R0Mkb1G/" },
    { id: 7, title: "Don't Skip Your Cleanings", type: "Carousel", views: 289, reach: 157, likes: 3, comments: 0, saves: 0, shares: 1, isTop: false, igPostUrl: "https://www.instagram.com/p/DXSFpUZp0hG/" },
  ] as any[],
  contentMix: { posts: 6, reels: 76, stories: 17 },
  audience: {
    gender: { male: 52, female: 48 },
    age: [
      { range: "18–24", pct: 5 }, { range: "25–34", pct: 31 }, { range: "35–44", pct: 29 },
      { range: "45–54", pct: 21 }, { range: "55–64", pct: 10 }, { range: "65+", pct: 4 },
    ],
  },
  viewerSplit: { followers: 33, nonFollowers: 67 },
};
type ReportData = typeof FALLBACK_DATA;

function generateInsights(data: ReportData) {
  const insights: { title: string; body: string; severity: string }[] = [];
  const opportunities: typeof insights = [];
  const recommendations: { text: string; priority: string }[] = [];
  const alerts: typeof insights = [];

  const er = data.kpi.engagementRate.value;
  if (er < 5) {
    insights.push({ title: "Engagement Below Benchmark", body: `At ${er}%, engagement rate sits below the 5%+ benchmark for healthcare accounts under 10K followers. With ${data.kpi.reach.value.toLocaleString()} reach, content is being seen — hooks need strengthening to convert viewers into engagers.`, severity: "warning" });
  }
  insights.push({ title: "Content Format Distribution", body: `Reels dominate at ${data.contentMix.reels}% of views. With Posts at ${data.contentMix.posts}% and Stories at ${data.contentMix.stories}%, there is heavy reliance on short-form video. Consider diversifying with carousels and static educational posts.`, severity: "info" });
  const totalSaves = data.posts.reduce((s: number, p: any) => s + (p.saves || 0), 0);
  if (totalSaves < 3) {
    alerts.push({ title: "Zero Saves Across All Posts", body: "No saves this week. Saves signal high-value content to the algorithm — this is the single biggest lever to improve for algorithmic amplification.", severity: "danger" });
  }
  insights.push({ title: "Watch Time & Retention", body: "Average view duration of 6 seconds suggests viewers are sampling but not completing videos. The first 3 seconds must deliver a compelling hook to hold attention past the drop-off point.", severity: "warning" });
  if (data.viewerSplit.nonFollowers > 50) {
    opportunities.push({ title: "Strong Discovery Signal", body: `${data.viewerSplit.nonFollowers}% of viewers are non-followers — the algorithm is actively distributing content to new audiences. Optimize CTAs to convert discoverers into followers and patients.`, severity: "success" });
  }
  const topAge = data.audience.age.reduce((a, b) => (a.pct > b.pct ? a : b));
  insights.push({ title: "Audience Alignment", body: `Primary audience is ${topAge.range} (${topAge.pct}%), with a ${data.audience.gender.male}/${data.audience.gender.female} male/female split. The 25–44 range represents ${(data.audience.age[1]?.pct || 0) + (data.audience.age[2]?.pct || 0)}% — a strong patient demographic for general and cosmetic dentistry.`, severity: "success" });
  if (data.kpi.followers.change != null && data.kpi.followers.change < 5) {
    opportunities.push({ title: "Follower Growth Stalling", body: `+${data.kpi.followers.change} follower this week. With ${data.kpi.reach.value} reach, the conversion rate is very low. Strengthen profile CTAs, pin best content, and add follow prompts to captions.`, severity: "warning" });
  }
  recommendations.push(
    { text: "Open every Reel with a provocative question or surprising dental stat in the first 2 seconds", priority: "high" },
    { text: "Create save-worthy carousels: '5 Signs You Need a Deep Cleaning' or 'Flossing Myths Debunked'", priority: "high" },
    { text: "Add CTAs to every caption: 'Save this for your next visit' / 'Share with someone who needs this'", priority: "medium" },
    { text: "Diversify beyond Reels — test educational carousels and patient testimonials to balance content mix", priority: "medium" },
    { text: "Post between 7–9 AM and 6–8 PM when the 25–44 demographic is most active on Instagram", priority: "low" },
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
    period: "Apr 13 – Apr 27, 2026",
    totalClicks: 62,
    topLinks: [
      { path: "NYCDS 58th Street", clicks: 15 },
      { path: "NYCDS 35th Street", clicks: 14 },
      { path: "NYCDS 5th Ave", clicks: 14 },
      { path: "NYCDS 60th Street", clicks: 10 },
      { path: "Homepage", clicks: 2 },
    ],
    trafficSources: [
      { source: "Website", clicks: 23 },
      { source: "Direct / Unknown", clicks: 13 },
      { source: "Social", clicks: 22 },
      { source: "Google", clicks: 1 },
    ],
    topCountries: [
      { country: "United States", clicks: 33 },
      { country: "The Netherlands", clicks: 13 },
      { country: "Luxembourg", clicks: 4 },
      { country: "Sweden", clicks: 3 },
      { country: "Singapore", clicks: 2 },
    ],
    topCities: [
      { city: "New York City", clicks: 17 },
      { city: "Luxembourg", clicks: 4 },
      { city: "The Bronx", clicks: 4 },
      { city: "Lelystad", clicks: 2 },
      { city: "Dronten", clicks: 2 },
    ],
    devices: [
      { os: "Android", clicks: 19 },
      { os: "iOS", clicks: 15 },
      { os: "Windows", clicks: 10 },
      { os: "Mac OS X", clicks: 10 },
    ],
  };

  const websiteData = {
    period: "Apr 13 – Apr 27, 2026",
    sessions: 404,
    topPages: [
      { page: "/", label: "Home", views: 308 },
      { page: "/ourdoctors", label: "Our Doctors", views: 155 },
      { page: "/services", label: "Services", views: 32 },
      { page: "/about", label: "About", views: 26 },
      { page: "/locations", label: "Locations", views: 24 },
      { page: "/why-nycds", label: "Why NYCDS", views: 24 },
      { page: "/comprehensive-care", label: "Comprehensive Care", views: 15 },
      { page: "/dr-michael-chesner", label: "Dr. Michael Chesner", views: 14 },
      { page: "/nerve-pain-after-onlay", label: "Nerve Pain After Onlay", views: 13 },
    ],
    trafficSources: [
      { source: "Direct", medium: "(none)", sessions: 232, pct: 57.4 },
      { source: "Google", medium: "organic", sessions: 151, pct: 37.4 },
      { source: "Instagram", medium: "social", sessions: 8, pct: 2.0 },
      { source: "Yahoo", medium: "organic", sessions: 4, pct: 1.0 },
      { source: "Other", medium: "mixed", sessions: 9, pct: 2.2 },
    ],
    devices: [
      { device: "Mobile", pct: 78.5 },
      { device: "Desktop", pct: 21.5 },
    ],
    dailyVisitors: [
      { date: "Apr 13", visitors: 8 },{ date: "Apr 14", visitors: 12 },
      { date: "Apr 15", visitors: 15 },{ date: "Apr 16", visitors: 10 },
      { date: "Apr 17", visitors: 12 },{ date: "Apr 18", visitors: 18 },
      { date: "Apr 19", visitors: 35 },{ date: "Apr 20", visitors: 38 },
      { date: "Apr 21", visitors: 18 },{ date: "Apr 22", visitors: 42 },
      { date: "Apr 23", visitors: 35 },{ date: "Apr 24", visitors: 28 },
      { date: "Apr 25", visitors: 22 },{ date: "Apr 26", visitors: 25 },
      { date: "Apr 27", visitors: 20 },
    ],
    search: {
      totalClicks: 150,
      totalImpressions: 5120,
      avgCTR: 2.9,
      avgPosition: 30.0,
      topQueries: [
        { query: "nyc dental smiles", clicks: 7, impressions: 16, ctr: 43.8, position: 1.3 },
        { query: "dr michael chesner", clicks: 5, impressions: 21, ctr: 23.8, position: 2.9 },
        { query: "nyc dental smile team", clicks: 5, impressions: 13, ctr: 38.5, position: 1.3 },
        { query: "michael chesner", clicks: 4, impressions: 18, ctr: 22.2, position: 2.2 },
        { query: "nerve pain after onlay", clicks: 3, impressions: 22, ctr: 13.6, position: 1.1 },
      ],
      topPages: [
        { page: "Homepage", clicks: 57, impressions: 2952, ctr: 1.9 },
        { page: "Nerve Pain After Onlay", clicks: 37, impressions: 1008, ctr: 3.7 },
        { page: "Our Doctors", clicks: 31, impressions: 761, ctr: 4.1 },
        { page: "Dr. Michael Chesner", clicks: 19, impressions: 180, ctr: 10.6 },
        { page: "About", clicks: 3, impressions: 217, ctr: 1.4 },
      ],
      searchDevices: [
        { device: "Mobile", clicks: 90, pct: 60 },
        { device: "Desktop", clicks: 60, pct: 40 },
      ],
    },
  };

  const socialData = {
    period: "Apr 13 – Apr 27, 2026",
    followers: 681,
    followerStart: 676,
    followerGrowth: 5,
    follows: 5,
    unfollows: 4,
    totalViews: 6153,
    totalReach: 895,
    reachChange: 110.1,
    totalInteractions: 182,
    viewSplit: { followers: 33.4, nonFollowers: 66.6 },
    engagementSplit: { followers: 49.2, nonFollowers: 50.8 },
    viewsByType: { reels: 76.4, posts: 6.4, stories: 17.2 },
    interactionsByType: { reels: 84.3, posts: 2.2, stories: 13.5 },
    reelAvgWatchTime: "5–9s",
    reelSkipRate: "53–77%",
    postsPublished: 5,
    contentMix: { reels: 4, carousels: 1 },
    reelViews: 2115,
    carouselViews: 289,
    totalLikes: 45,
    totalComments: 5,
    totalSaves: 1,
    totalShares: 7,
    storyViews: 634,
    storyReach: 478,
    storyCompletion: 88,
    storyCount: 9,
    dailyViews: [
      { date: "Apr 13", views: 120 },{ date: "Apr 14", views: 135 },
      { date: "Apr 15", views: 110 },{ date: "Apr 16", views: 95 },
      { date: "Apr 17", views: 356 },{ date: "Apr 18", views: 289 },
      { date: "Apr 19", views: 80 },{ date: "Apr 20", views: 250 },
      { date: "Apr 21", views: 350 },{ date: "Apr 22", views: 864 },
      { date: "Apr 23", views: 400 },{ date: "Apr 24", views: 555 },
      { date: "Apr 25", views: 696 },{ date: "Apr 26", views: 200 },
      { date: "Apr 27", views: 150 },
    ],
    posts: [
      { id: 1, title: "Building Patient Trust – Collab w/ EEC", type: "Reel", date: "Apr 22", views: 2000, reach: 600, likes: 40, comments: 3, saves: 1, shares: 3, er: 5.0, skipRate: 0, avgWatch: "", profileActivity: 0, igUrl: "", isTop: true, isCollab: true },
      { id: 2, title: "More Than a Job – Collab w/ EEC", type: "Reel", date: "Apr 21", views: 1900, reach: 550, likes: 35, comments: 0, saves: 1, shares: 5, er: 4.5, skipRate: 0, avgWatch: "", profileActivity: 0, igUrl: "", isTop: false, isCollab: true },
      { id: 3, title: "Team Culture – What Keeps Us Going", type: "Reel", date: "Apr 22", views: 864, reach: 407, likes: 19, comments: 2, saves: 0, shares: 1, er: 4.7, skipRate: 62.7, avgWatch: "9s", profileActivity: 0, igUrl: "https://www.instagram.com/reel/DXcQnoSp92L/", isTop: false },
      { id: 4, title: "Have You Seen Our Ad Yet?", type: "Reel", date: "Apr 25", views: 696, reach: 275, likes: 10, comments: 3, saves: 1, shares: 4, er: 5.4, skipRate: 69, avgWatch: "5s", profileActivity: 0, igUrl: "https://www.instagram.com/reel/DXjqa3ZpvbN/", isTop: false },
      { id: 5, title: "Your New Favorite Dentist", type: "Reel", date: "Apr 24", views: 555, reach: 275, likes: 7, comments: 0, saves: 0, shares: 1, er: 2.5, skipRate: 76.8, avgWatch: "5s", profileActivity: 0, igUrl: "https://www.instagram.com/reel/DXhTaOyp0hT/", isTop: false },
      { id: 6, title: "This Snack Is Bad for Your Teeth", type: "Reel", date: "Apr 17", views: 356, reach: 248, likes: 8, comments: 0, saves: 0, shares: 0, er: 3.2, skipRate: 53, avgWatch: "", profileActivity: 0, igUrl: "https://www.instagram.com/reel/DXP0R0Mkb1G/", isTop: false },
      { id: 7, title: "Don't Skip Your Cleanings", type: "Carousel", date: "Apr 18", views: 289, reach: 157, likes: 3, comments: 0, saves: 0, shares: 1, er: 2.3, skipRate: 0, avgWatch: "", profileActivity: 0, igUrl: "https://www.instagram.com/p/DXSFpUZp0hG/", isTop: false },
    ],
  };

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
      <div className="tabs">{tabs.map((t) => (<button key={t.id} className={`tab ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}><span style={{ fontSize: 15 }}>{t.icon}</span> {t.label}</button>))}</div>

      <div className="grid">
        {tab === "overview" && (<>
          <div className="kpi-row">
            {[{ ...d.kpi.followers, delay: 0 }, { ...d.kpi.reach, delay: 80 }, { ...d.kpi.views, delay: 160 }, { ...d.kpi.engagementRate, delay: 240 }, { ...d.kpi.engagements, delay: 320 }, { ...d.kpi.watchTime, delay: 400 }].map((k, i) => (
              <div key={i} className="kpi" style={{ animationDelay: `${k.delay}ms` }}><div className="kpi-label">{k.label}</div><div className="kpi-val">{typeof k.value === "number" ? <AnimatedNumber value={k.value} suffix={"suffix" in k ? (k as any).suffix : ""} /> : <span>{k.value}</span>}</div>{"change" in k && k.change != null && (<div className="kpi-delta"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L12 8H2L7 2Z" fill="#8FA1A6" /></svg>+{k.change} this week</div>)}</div>
            ))}
          </div>
          <div className="exec"><div className="card-hd">Executive Summary</div><div className="exec-cols">
            <div><div className="exec-col-title">Discovery</div><div className="exec-col-body">{d.viewerSplit.nonFollowers}% of views from non-followers — strongest discovery signal yet. Reach surged +110% vs prior period to 895 accounts. "Team Culture" Reel led with 864 views and 62.7% skip rate (better than account average).</div></div>
            <div><div className="exec-col-title">Engagement</div><div className="exec-col-body">{d.kpi.engagements.value} interactions with 50.8% from non-followers — nearly even split. "Ad Spotted" Reel had best ER at 5.4%. Comments at 5. Saves still critically low at 1.</div></div>
            <div><div className="exec-col-title">Content</div><div className="exec-col-body">Reels drive {d.contentMix.reels}% of views and 84.3% of interactions. Skip rates improved: 62.7% on top Reel vs 68.9% typical. 681 followers (+5 net). 9 Stories with 88% completion.</div></div>
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
                <div className="postcard-header"><div className="postcard-type-badge">{p.type}</div>{p.isTop && <div className="postcard-top-badge">★ Top Post</div>}{p.isCollab && <div className="postcard-top-badge" style={{background: "rgba(88,130,220,0.15)", color: "#5882DC"}}>⚡ Collab</div>}</div>
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
            <div className="card"><div className="card-hd">Watch Time Analytics</div><div style={{ textAlign: "center", padding: "8px 0 22px" }}><div className="big-num">{typeof d.kpi.watchTime.value === "string" ? d.kpi.watchTime.value.replace(/\s*\d+s$/, "") : d.kpi.watchTime.value}</div><div style={{ fontSize: 12, color: "#9B9196", marginTop: 2 }}>Total Watch Time</div></div><div style={{ display: "flex", gap: 14 }}><div className="stat-box"><div className="big-num-sm plum">6s</div><div className="stat-label">Avg Duration</div></div><div className="stat-box"><div className="big-num-sm steel">{d.kpi.views.value.toLocaleString()}</div><div className="stat-label">Total Views</div></div></div><div className="alert-box plum-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>⚡ 6s avg signals weak retention — strengthen opening hooks</span></div></div>
            <div className="card"><div className="card-hd">Engagement Breakdown</div><div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{[{ label: "Likes", value: d.posts.reduce((s: number, p: any) => s + (p.likes||0), 0), max: 50, color: "#6F5060" }, { label: "Comments", value: d.posts.reduce((s: number, p: any) => s + (p.comments||0), 0), max: 50, color: "#8FA1A6" }, { label: "Shares", value: d.posts.reduce((s: number, p: any) => s + (p.shares||0), 0), max: 50, color: "#A6968D" }, { label: "Saves", value: d.posts.reduce((s: number, p: any) => s + (p.saves||0), 0), max: 50, color: "#BE5A5A" }].map((m) => (<div key={m.label} style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 72, fontSize: 13, fontWeight: 500 }}>{m.label}</div><div style={{ flex: 1, height: 10, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}><div style={{ width: `${(Math.max(m.value, 0.5) / m.max) * 100}%`, height: "100%", background: m.color, borderRadius: 99, transition: "width 1.2s ease" }} /></div><div className="display-num" style={{ width: 30, textAlign: "right" as const }}>{m.value}</div></div>))}</div><div className="alert-box danger-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#BE5A5A" }}>▲ Zero saves is the #1 gap — create bookmark-worthy content</span></div></div>
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
            <InsightCard title="Link Attribution · Apr 13 – Apr 27" body="58th Street leads with 15 clicks, closely followed by 35th Street and 5th Ave (14 each). NYC leads all cities with 17 clicks — strong local intent. Website UTM drives 23 clicks via the locations page. Social referrals jumped to 22 clicks — a significant increase. Mobile traffic leads at 63% (Android 19 + iOS 15)." severity="info" />
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
            <InsightCard title="Website Intelligence · Apr 13 – Apr 27" body="404 sessions (+55% vs prior). Direct traffic leads at 57.4%, overtaking Google (37.4%). Mobile dominates at 78.5% — dramatic flip from 27.6% last period. Google Search drives 150 clicks from 5,120 impressions (2.9% CTR). 'Nerve Pain After Onlay' is the #1 organic content page at 37 search clicks — educational SEO content is working. Dr. Michael Chesner's page achieves 10.6% CTR, the highest of any page. Branded queries ('nyc dental smiles') convert at 43.8% CTR, indicating strong brand recognition in search." severity="info" />
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
                      <div style={{ fontSize: 11, color: "#9B9196", marginTop: 2 }}>{p.type} · {p.date}{p.isTop ? " · ★ Top Post" : ""}{p.isCollab ? " · ⚡ Collab" : ""}</div>
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
            <InsightCard title="Social Intelligence · Apr 13 – Apr 27" body="6,153 views (last 7 days platform data) reaching 895 accounts (+110% vs prior period). 66.6% non-follower views — strongest discovery signal yet. The 'Team Culture' Reel (864 views, 62.7% skip, 9s avg watch) is the top performer with the best skip rate on the account. 'Ad Spotted' Reel achieved 5.4% ER with 696 views. Reels drive 76.4% of views and 84.3% of interactions. 9 Stories posted with 88% completion rate." severity="info" />
            <InsightCard title="Period Comparison" body="Reach surged +110% vs prior period. Non-follower views jumped to 66.6% (was 52.5%) — the algorithm is distributing content more aggressively. Skip rates improved: Team Culture at 62.7% beats the account typical of 68.9%. Followers grew to 681 (+5 net). The Reels-first strategy (76.4% of views) is working. Key gap: saves remain at 1 — save-worthy educational carousels needed." severity="success" />
          </div>
        </>)}

        {tab === "audience" && (<>
          <div className="cols2">
            <div className="card"><div className="card-hd">Gender Split</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.audience.gender.male }, { value: d.audience.gender.female }]} colors={["#6F5060", "#8FA1A6"]} size={130} stroke={20} /><div style={{ flex: 1 }}>{[{ label: "Male", value: d.audience.gender.male, color: "#6F5060" }, { label: "Female", value: d.audience.gender.female, color: "#8FA1A6" }].map((g) => (<div key={g.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}><div style={{ width: 12, height: 12, borderRadius: 4, background: g.color }} /><span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{g.label}</span><span className="display-num-lg">{g.value}%</span></div>))}</div></div></div>
            <div className="card"><div className="card-hd">Age Distribution</div>{d.audience.age.map((a) => (<div key={a.range} className="age-row"><div className="age-label">{a.range}</div><div className="age-track"><div className="age-fill" style={{ width: `${(a.pct / 36) * 100}%`, background: a.pct >= 28 ? "#6F5060" : a.pct >= 20 ? "#8FA1A6" : "#A6968D" }} /></div><div className="age-pct">{a.pct}%</div></div>))}</div>
          </div>
          <div className="card"><div className="card-hd">Audience Intelligence</div>
            <InsightCard title="Core Patient Demographic" body="63% of the audience falls in the 25–44 age range (33% aged 25–34, 30% aged 35–44) — the prime demographic for general dentistry, cosmetic procedures, and Invisalign. This represents the highest lifetime patient value segment for NYC Dental Smiles." severity="success" />
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
