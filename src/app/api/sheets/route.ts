import { NextResponse } from "next/server";
import { google } from "googleapis";

async function getSheets() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";
  let key = process.env.GOOGLE_PRIVATE_KEY || "";
  if (key.startsWith('"') && key.endsWith('"')) key = key.slice(1, -1);
  key = key.replace(/\\n/g, "\n");

  const { JWT } = google.auth;
  const client = new JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  return google.sheets({ version: "v4", auth: client });
}

async function fetchRange(sheets: any, range: string) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range,
  });
  return res.data.values || [];
}

export async function GET() {
  try {
    const sheets = await getSheets();
    const [overviewRows, postRows, audienceRows] = await Promise.all([
      fetchRange(sheets, "'Overview Metrics'!A3:M100"),
      fetchRange(sheets, "'Post Performance'!A3:N100"),
      fetchRange(sheets, "'Audience Data'!A3:P100"),
    ]);

    const latest = overviewRows[0];
    if (!latest) return NextResponse.json({ error: "No data found in Overview Metrics" }, { status: 404 });

    const watchSec = Number(latest[9]) || 0;
    const watchH = Math.floor(watchSec / 3600);
    const watchM = Math.floor((watchSec % 3600) / 60);
    const watchS = watchSec % 60;
    const watchTimeStr = watchH > 0 ? `${watchH}h ${watchM}m ${watchS}s` : `${watchM}m ${watchS}s`;

    let periodStr = `${latest[0]} – ${latest[1]}`;
    try {
      const s = new Date(latest[0]), e = new Date(latest[1]);
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      periodStr = `${months[s.getMonth()]} ${s.getDate()} – ${months[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`;
    } catch {}

    const weekPosts = postRows.filter((r: string[]) => r[0] === latest[0]).map((r: string[], i: number) => ({
      id: i + 1, title: r[2] || `Post ${i + 1}`, type: r[3] || "Post",
      views: Number(r[4]) || 0, reach: Number(r[5]) || 0, likes: Number(r[6]) || 0,
      comments: Number(r[7]) || 0, saves: Number(r[8]) || 0, shares: Number(r[9]) || 0,
      isTop: (r[10] || "").toUpperCase() === "TRUE", mediaUrl: r[11] || "", igPostUrl: r[12] || "",
    }));

    const typeCount: Record<string, number> = {};
    weekPosts.forEach((p: any) => { const t = p.type.toLowerCase(); typeCount[t] = (typeCount[t] || 0) + 1; });
    const totalPosts = weekPosts.length || 1;
    const contentMix = {
      reels: Math.round(((typeCount["reel"] || 0) / totalPosts) * 100),
      posts: Math.round(((typeCount["post"] || 0) / totalPosts) * 100),
      stories: Math.round(((typeCount["story"] || 0) / totalPosts) * 100),
      carousels: Math.round(((typeCount["carousel"] || 0) / totalPosts) * 100),
    };

    const latestAudience = audienceRows.find((r: string[]) => r[0] === latest[0]) || audienceRows[0];
    const audience = latestAudience ? {
      gender: { male: Number(latestAudience[2]) || 50, female: Number(latestAudience[3]) || 50 },
      age: [
        { range: "18–24", pct: Number(latestAudience[4]) || 0 }, { range: "25–34", pct: Number(latestAudience[5]) || 0 },
        { range: "35–44", pct: Number(latestAudience[6]) || 0 }, { range: "45–54", pct: Number(latestAudience[7]) || 0 },
        { range: "55–64", pct: Number(latestAudience[8]) || 0 }, { range: "65+", pct: Number(latestAudience[9]) || 0 },
      ],
    } : { gender: { male: 50, female: 50 }, age: [{ range: "18–24", pct: 0 },{ range: "25–34", pct: 0 },{ range: "35–44", pct: 0 },{ range: "45–54", pct: 0 },{ range: "55–64", pct: 0 },{ range: "65+", pct: 0 }] };

    return NextResponse.json({
      client: { name: "NYCDS", fullName: "NYC Dental Smiles", period: periodStr },
      kpi: {
        followers: { value: Number(latest[3]) || 0, change: Number(latest[4]) || 0, label: "Followers" },
        reach: { value: Number(latest[5]) || 0, label: "Reach" },
        views: { value: Number(latest[6]) || 0, label: "Total Views" },
        engagementRate: { value: Number(latest[8]) || 0, label: "Engagement Rate", suffix: "%" },
        engagements: { value: Number(latest[7]) || 0, label: "Engagements" },
        watchTime: { value: watchTimeStr, label: "Watch Time" },
      },
      posts: weekPosts, contentMix, audience,
      viewerSplit: { followers: Number(latest[11]) || 50, nonFollowers: Number(latest[12]) || 50 },
    });
  } catch (err: any) {
    console.error("Sheets API error:", err?.message || err);
    return NextResponse.json({ error: "Failed to fetch sheet data", details: err?.message }, { status: 500 });
  }
}
