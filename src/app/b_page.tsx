"use client";
import { useState, useEffect } from "react";

const FALLBACK_DATA = {
  client: { name: "NYCDS", fullName: "NYC Dental Smiles", period: "Mar 23 – Mar 29, 2026" },
  kpi: {
    followers: { value: 668, change: 4, label: "Followers" },
    reach: { value: 543, label: "Reach" },
    views: { value: 1182, label: "Total Views" },
    engagementRate: { value: 11.8, label: "Engagement Rate", suffix: "%" },
    engagements: { value: 64, label: "Engagements" },
    watchTime: { value: "41m 6s", label: "Watch Time" },
  },
  posts: [
    { id: 1, title: "All-on-X", type: "Reel", views: 693, reach: 380, likes: 22, comments: 2, shares: 1, saves: 1, isTop: true, igPostUrl: "", mediaUrl: "" },
    { id: 2, title: "The Comfort Menu", type: "Post", views: 279, reach: 126, likes: 6, comments: 0, shares: 1, saves: 0, isTop: false, igPostUrl: "", mediaUrl: "" },
    { id: 3, title: "Testimonials", type: "Post", views: 127, reach: 58, likes: 6, comments: 0, shares: 0, saves: 0, isTop: false, igPostUrl: "", mediaUrl: "" },
    { id: 4, title: "Story (Mar 23–29)", type: "Story", views: 83, reach: 0, likes: 0, comments: 0, shares: 0, saves: 0, isTop: false, igPostUrl: "", mediaUrl: "" },
  ] as any[],
  contentMix: { posts: 36.3, reels: 43.5, stories: 20.2 },
  audience: {
    gender: { male: 52.7, female: 47.3 },
    age: [
      { range: "18–24", pct: 5.0 }, { range: "25–34", pct: 31.1 }, { range: "35–44", pct: 28.7 },
      { range: "45–54", pct: 20.7 }, { range: "55–64", pct: 10.2 }, { range: "65+", pct: 4.1 },
    ],
  },
  viewerSplit: { followers: 48.8, nonFollowers: 51.2 },
};
type ReportData = typeof FALLBACK_DATA;

function generateInsights(data: ReportData) {
  const insights: { title: string; body: string; severity: string }[] = [];
  const opportunities: typeof insights = [];
  const recommendations: { text: string; priority: string }[] = [];
  const alerts: typeof insights = [];

  insights.push({ title: "Discovery vs. Engagement Gap", body: `${data.viewerSplit.nonFollowers}% of views came from non-followers, but only 22.7% of interactions came from non-followers. Discovery is building, but content is not yet converting new viewers into engagers — hooks and CTAs need strengthening.`, severity: "warning" });
  insights.push({ title: "Content Format Distribution", body: `Reels lead at ${data.contentMix.reels}% of views and 50.7% of interactions, but Posts (${data.contentMix.posts}%) and Stories (${data.contentMix.stories}%) contribute meaningfully. This is a balanced mix — continue diversifying rather than over-indexing on one format.`, severity: "info" });
  const totalSaves = data.posts.reduce((s: number, p: any) => s + (p.saves || 0), 0);
  if (totalSaves <= 1) {
    alerts.push({ title: "Near-Zero Saves Across All Posts", body: `Only ${totalSaves} save this week. Saves are the #1 signal to the algorithm that content has lasting value. Creating reference-worthy, save-driven content is the single biggest lever to improve.`, severity: "danger" });
  }
  insights.push({ title: "Watch Time & Retention", body: "Average view duration of 6 seconds with a 64.9% skip rate on the top Reel. Viewers are sampling but not completing videos. The first 3 seconds must deliver a compelling hook to hold attention past the drop-off point.", severity: "warning" });
  if (data.viewerSplit.nonFollowers > 50) {
    opportunities.push({ title: "Moderate Discovery Signal", body: `${data.viewerSplit.nonFollowers}% of viewers are non-followers — the algorithm is beginning to distribute content to new audiences. Optimize CTAs and profile to convert these discoverers into followers and patients.`, severity: "success" });
  }
  const topAge = data.audience.age.reduce((a, b) => (a.pct > b.pct ? a : b));
  insights.push({ title: "Audience Alignment", body: `Primary audience is ${topAge.range} (${topAge.pct}%), with a ${data.audience.gender.male}/${data.audience.gender.female} male/female split. The 25–44 range represents ${(data.audience.age[1]?.pct || 0) + (data.audience.age[2]?.pct || 0)}% — a strong patient demographic for general and cosmetic dentistry.`, severity: "success" });
  if (data.kpi.followers.change != null && data.kpi.followers.change < 10) {
    opportunities.push({ title: "Steady but Modest Growth", body: `+${data.kpi.followers.change} followers this week from ${data.kpi.reach.value} reach. Growth is steady but conversion remains low. Strengthen profile CTAs, pin best content, and add follow prompts to captions.`, severity: "warning" });
  }
  opportunities.push({ title: "Save-Driven Content Gap", body: "Despite 64 interactions, saves remain at 1. Create reference-worthy content — educational carousels, procedure breakdowns, dental myth lists — to drive saves and extend algorithmic shelf life.", severity: "warning" });

  recommendations.push(
    { text: "Open every Reel with a provocative question or surprising dental stat in the first 2 seconds", priority: "high" },
    { text: "Create save-worthy carousels: '5 Signs You Need a Deep Cleaning' or 'Flossing Myths Debunked'", priority: "high" },
    { text: "Add CTAs to every caption: 'Save this for your next visit' / 'Share with someone who needs this'", priority: "medium" },
    { text: "Continue balancing content mix — Reels for discovery, Posts for follower engagement, Stories for retention", priority: "medium" },
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
  const [loading, setLoading] = useState(true);
  const [d, setD] = useState<ReportData>(FALLBACK_DATA);
  const [mediaUrls, setMediaUrls] = useState<Record<number, string>>({});
  const [editingMedia, setEditingMedia] = useState<number | null>(null);
  const [mediaInput, setMediaInput] = useState("");
  const engine = generateInsights(d);

  useEffect(() => {
    fetch("/api/sheets")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setD(data);
          const urls: Record<number, string> = {};
          (data.posts || []).forEach((p: any) => { if (p.igPostUrl) urls[p.id] = p.igPostUrl; else if (p.mediaUrl) urls[p.id] = p.mediaUrl; });
          setMediaUrls(urls);
        }
        setLoading(false); setTimeout(() => setLoaded(true), 80);
      })
      .catch(() => { setLoading(false); setTimeout(() => setLoaded(true), 80); });
  }, []);

  const handleMediaSave = (postId: number) => { if (mediaInput.trim()) setMediaUrls((prev) => ({ ...prev, [postId]: mediaInput.trim() })); setEditingMedia(null); setMediaInput(""); };
  const handleMediaRemove = (postId: number) => { setMediaUrls((prev) => { const n = { ...prev }; delete n[postId]; return n; }); };
  const isVideo = (url: string) => /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);
  const isIgEmbed = (url: string) => /instagram\.com\/(p|reel)\//i.test(url);

  const linkData = {
    period: "Feb 28 – Mar 31, 2026",
    totalClicks: 269,
    humanClicks: 195,
    botClicks: 74,
    topLinks: [
      { path: "NYCDS 60th Street", clicks: 50 },
      { path: "NYCDS 5th Ave", clicks: 26 },
      { path: "NYCDS 58th Street", clicks: 25 },
      { path: "NYCDS 35th Street", clicks: 24 },
      { path: "DDS-PC Midtown", clicks: 13 },
      { path: "DDS-PC UES", clicks: 12 },
      { path: "NYCDS Website", clicks: 7 },
      { path: "Homepage", clicks: 5 },
    ],
    trafficSources: [
      { source: "Link in Bio", clicks: 80 },
      { source: "Referral", clicks: 75 },
      { source: "Google", clicks: 30 },
      { source: "Search", clicks: 1 },
    ],
    topCountries: [
      { country: "United States", clicks: 133 },
      { country: "China", clicks: 13 },
      { country: "Sweden", clicks: 8 },
      { country: "Poland", clicks: 8 },
      { country: "Singapore", clicks: 6 },
    ],
    topCities: [
      { city: "New York City", clicks: 48 },
      { city: "Portland", clicks: 20 },
      { city: "Warsaw", clicks: 8 },
      { city: "Dallas", clicks: 8 },
      { city: "Latham", clicks: 7 },
    ],
    devices: [
      { os: "Mac OS X", clicks: 62 },
      { os: "Windows", clicks: 61 },
      { os: "Android", clicks: 35 },
      { os: "iOS", clicks: 29 },
    ],
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "◉" },
    { id: "content", label: "Content", icon: "◫" },
    { id: "links", label: "Links", icon: "⊞" },
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
            <div><div className="exec-col-title">Discovery</div><div className="exec-col-body">{d.viewerSplit.nonFollowers}% of views come from non-followers — moderate discovery with room to grow. The algorithm is beginning to distribute content to new audiences, with reach up 68.1% week-over-week.</div></div>
            <div><div className="exec-col-title">Engagement</div><div className="exec-col-body">{d.kpi.engagementRate.value}% rate with {d.kpi.engagements.value} total interactions. Engagement is primarily follower-driven (77.3% from existing audience). Only 1 save — this remains the key gap for algorithmic amplification.</div></div>
            <div><div className="exec-col-title">Content</div><div className="exec-col-body">Balanced content mix with Reels at {d.contentMix.reels}%, Posts at {d.contentMix.posts}%, and Stories at {d.contentMix.stories}%. Reels lead in discovery while posts sustain follower engagement.</div></div>
          </div></div>
          <div className="cols2">
            <div className="card"><div className="card-hd">Content Mix</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.contentMix.reels }, { value: d.contentMix.posts }, { value: d.contentMix.stories }]} colors={["#6F5060", "#8FA1A6", "#A6968D"]} size={120} stroke={18} /><div style={{ flex: 1 }}>{[{ label: "Reels", value: d.contentMix.reels, color: "#6F5060" }, { label: "Posts", value: d.contentMix.posts, color: "#8FA1A6" }, { label: "Stories", value: d.contentMix.stories, color: "#A6968D" }].map((item) => (<div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}><div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} /><span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span><span className="display-num">{item.value}%</span></div>))}</div></div></div>
            <div className="card"><div className="card-hd">Viewer Composition</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.viewerSplit.nonFollowers }, { value: d.viewerSplit.followers }]} colors={["#6F5060", "#D9C5C1"]} size={120} stroke={18} /><div style={{ flex: 1 }}>{[{ label: "Non-Followers", value: d.viewerSplit.nonFollowers, color: "#6F5060" }, { label: "Followers", value: d.viewerSplit.followers, color: "#D9C5C1" }].map((item) => (<div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}><div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} /><span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span><span className="display-num">{item.value}%</span></div>))}<div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(143,161,166,0.12)", borderRadius: 10, border: "1px solid rgba(143,161,166,0.25)" }}><span style={{ fontSize: 12, fontWeight: 600, color: "#728990" }}>✦ Moderate discovery — building new audience reach</span></div></div></div></div>
          </div>
          {engine.alerts.length > 0 && <div>{engine.alerts.map((a, i) => <InsightCard key={i} {...a} />)}</div>}
        </>)}

        {tab === "content" && (<>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
            {d.posts.map((p: any) => { const url = mediaUrls[p.id]; const isEditing = editingMedia === p.id; const maxViews = Math.max(...d.posts.map((x: any) => x.views), 1); return (
              <div key={p.id} className={`postcard ${p.isTop ? "postcard-top" : ""}`}>
                <div className="postcard-header"><div className="postcard-type-badge">{p.type}</div>{p.isTop && <div className="postcard-top-badge">★ Top Post</div>}</div>
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
            <div className="card"><div className="card-hd">Watch Time Analytics</div><div style={{ textAlign: "center", padding: "8px 0 22px" }}><div className="big-num">{typeof d.kpi.watchTime.value === "string" ? d.kpi.watchTime.value.replace(/\s*\d+s$/, "") : d.kpi.watchTime.value}</div><div style={{ fontSize: 12, color: "#9B9196", marginTop: 2 }}>Total Watch Time</div></div><div style={{ display: "flex", gap: 14 }}><div className="stat-box"><div className="big-num-sm plum">6s</div><div className="stat-label">Avg Duration</div></div><div className="stat-box"><div className="big-num-sm steel">{d.kpi.views.value.toLocaleString()}</div><div className="stat-label">Total Views</div></div></div><div className="alert-box plum-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#6F5060" }}>⚡ 6s avg with 64.9% skip rate — strengthen opening hooks</span></div></div>
            <div className="card"><div className="card-hd">Engagement Breakdown</div><div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{[{ label: "Likes", value: d.posts.reduce((s: number, p: any) => s + (p.likes||0), 0), max: 50, color: "#6F5060" }, { label: "Comments", value: d.posts.reduce((s: number, p: any) => s + (p.comments||0), 0), max: 50, color: "#8FA1A6" }, { label: "Shares", value: d.posts.reduce((s: number, p: any) => s + (p.shares||0), 0), max: 50, color: "#A6968D" }, { label: "Saves", value: d.posts.reduce((s: number, p: any) => s + (p.saves||0), 0), max: 50, color: "#BE5A5A" }].map((m) => (<div key={m.label} style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 72, fontSize: 13, fontWeight: 500 }}>{m.label}</div><div style={{ flex: 1, height: 10, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}><div style={{ width: `${(Math.max(m.value, 0.5) / m.max) * 100}%`, height: "100%", background: m.color, borderRadius: 99, transition: "width 1.2s ease" }} /></div><div className="display-num" style={{ width: 30, textAlign: "right" as const }}>{m.value}</div></div>))}</div><div className="alert-box danger-bg"><span style={{ fontSize: 12, fontWeight: 600, color: "#BE5A5A" }}>▲ Only 1 save — create bookmark-worthy content to boost reach</span></div></div>
          </div>
        </>)}

        {tab === "links" && (<>
          <div className="kpi-row">
            {[
              { label: "Total Clicks", value: linkData.totalClicks, delay: 0 },
              { label: "Human Clicks", value: linkData.humanClicks, delay: 80 },
              { label: "Bot Traffic", value: `${((linkData.botClicks / linkData.totalClicks) * 100).toFixed(1)}%`, delay: 160 },
            ].map((k, i) => (
              <div key={i} className="kpi" style={{ animationDelay: `${k.delay}ms` }}>
                <div className="kpi-label">{k.label}</div>
                <div className="kpi-val">{typeof k.value === "number" ? <AnimatedNumber value={k.value} /> : <span>{k.value}</span>}</div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-hd">Top Links</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {linkData.topLinks.map((link, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 20, fontSize: 12, fontWeight: 600, color: "#9B9196", textAlign: "right" as const }}>{i + 1}</div>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "#5C4E54" }}>{link.path}</div>
                  <div style={{ flex: 1, height: 8, background: "#D9CCC1", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${(link.clicks / linkData.topLinks[0].clicks) * 100}%`, height: "100%", background: i === 0 ? "#6F5060" : i < 4 ? "#8FA1A6" : "#A6968D", borderRadius: 99, transition: "width 1.2s ease" }} />
                  </div>
                  <div className="display-num" style={{ width: 36, textAlign: "right" as const }}>{link.clicks}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="cols2">
            <div className="card">
              <div className="card-hd">Traffic Sources</div>
              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <Donut data={linkData.trafficSources.map(s => ({ value: (s.clicks / linkData.trafficSources.reduce((a, b) => a + b.clicks, 0)) * 100 }))} colors={["#6F5060", "#8FA1A6", "#A6968D", "#D9CCC1"]} size={120} stroke={18} />
                <div style={{ flex: 1 }}>
                  {linkData.trafficSources.map((s, i) => (
                    <div key={s.source} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: ["#6F5060", "#8FA1A6", "#A6968D", "#D9CCC1"][i] }} />
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{s.source}</span>
                      <span className="display-num">{s.clicks}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-hd">Device Breakdown</div>
              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <Donut data={linkData.devices.map(d => ({ value: (d.clicks / linkData.devices.reduce((a, b) => a + b.clicks, 0)) * 100 }))} colors={["#6F5060", "#8FA1A6", "#A6968D", "#D9CCC1"]} size={120} stroke={18} />
                <div style={{ flex: 1 }}>
                  {linkData.devices.map((d, i) => (
                    <div key={d.os} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: ["#6F5060", "#8FA1A6", "#A6968D", "#D9CCC1"][i] }} />
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{d.os}</span>
                      <span className="display-num">{d.clicks}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="cols2">
            <div className="card">
              <div className="card-hd">Top Countries</div>
              {linkData.topCountries.map((c) => (
                <div key={c.country} className="age-row">
                  <div className="age-label" style={{ width: 100 }}>{c.country}</div>
                  <div className="age-track"><div className="age-fill" style={{ width: `${(c.clicks / linkData.topCountries[0].clicks) * 100}%`, background: c.clicks >= 50 ? "#6F5060" : c.clicks >= 10 ? "#8FA1A6" : "#A6968D" }} /></div>
                  <div className="age-pct">{c.clicks}</div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-hd">Top Cities</div>
              {linkData.topCities.map((c) => (
                <div key={c.city} className="age-row">
                  <div className="age-label" style={{ width: 100 }}>{c.city}</div>
                  <div className="age-track"><div className="age-fill" style={{ width: `${(c.clicks / linkData.topCities[0].clicks) * 100}%`, background: c.clicks >= 20 ? "#6F5060" : c.clicks >= 8 ? "#8FA1A6" : "#A6968D" }} /></div>
                  <div className="age-pct">{c.clicks}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "rgba(143,161,166,0.12)", border: "1px solid rgba(143,161,166,0.35)", borderRadius: 14, padding: "18px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}><div style={{ width: 8, height: 8, borderRadius: 99, background: "#8FA1A6", flexShrink: 0 }} /><span style={{ fontWeight: 700, fontSize: 13, color: "#6F5060" }}>Link Attribution Insight</span></div>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: "#5C4E54" }}>Link in Bio drives 43% of attributed click traffic, with 60th Street as the top destination (50 clicks). 72.5% of total clicks are human — 27.5% is bot traffic (Bytespider, crawlers). NYC accounts for 48 of 133 U.S. clicks, confirming local audience alignment.</div>
          </div>
        </>)}

        {tab === "audience" && (<>
          <div className="cols2">
            <div className="card"><div className="card-hd">Gender Split</div><div style={{ display: "flex", alignItems: "center", gap: 28 }}><Donut data={[{ value: d.audience.gender.male }, { value: d.audience.gender.female }]} colors={["#6F5060", "#8FA1A6"]} size={130} stroke={20} /><div style={{ flex: 1 }}>{[{ label: "Male", value: d.audience.gender.male, color: "#6F5060" }, { label: "Female", value: d.audience.gender.female, color: "#8FA1A6" }].map((g) => (<div key={g.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}><div style={{ width: 12, height: 12, borderRadius: 4, background: g.color }} /><span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{g.label}</span><span className="display-num-lg">{g.value}%</span></div>))}</div></div></div>
            <div className="card"><div className="card-hd">Age Distribution</div>{d.audience.age.map((a) => (<div key={a.range} className="age-row"><div className="age-label">{a.range}</div><div className="age-track"><div className="age-fill" style={{ width: `${(a.pct / 36) * 100}%`, background: a.pct >= 28 ? "#6F5060" : a.pct >= 20 ? "#8FA1A6" : "#A6968D" }} /></div><div className="age-pct">{a.pct}%</div></div>))}</div>
          </div>
          <div className="card"><div className="card-hd">Audience Intelligence</div>
            <InsightCard title="Core Patient Demographic" body="60% of the audience falls in the 25–44 age range — the prime demographic for general dentistry, cosmetic procedures, and Invisalign. This represents the highest lifetime patient value segment for NYC Dental Smiles." severity="success" />
            <InsightCard title="Gender Balance" body="At 52.7% male / 47.3% female, the audience is nearly balanced. Consider testing content themes that resonate with female audiences — cosmetic dentistry, teeth whitening, and wellness-focused oral health — to drive appointment bookings." severity="info" />
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
