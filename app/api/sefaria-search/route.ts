import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch("https://www.sefaria.org/api/search-wrapper", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Search failed" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
