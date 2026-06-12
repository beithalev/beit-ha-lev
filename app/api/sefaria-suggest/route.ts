import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (!q.trim()) return NextResponse.json({ completions: [] });

  const res = await fetch(`https://www.sefaria.org/api/name/${encodeURIComponent(q)}`);
  if (!res.ok) return NextResponse.json({ completions: [] });

  const data = await res.json();
  const completions: string[] = Array.isArray(data.completions) ? data.completions : [];
  return NextResponse.json({ completions });
}
