import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { roomName } = await req.json();
  if (typeof roomName !== "string" || !roomName.trim()) {
    return NextResponse.json({ error: "Missing roomName" }, { status: 400 });
  }

  const apiKey = process.env.DAILY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Daily API key not configured" }, { status: 500 });
  }

  const res = await fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: roomName,
      properties: {
        enable_chat: true,
        enable_screenshare: true,
      },
    }),
  });

  if (res.ok) {
    return NextResponse.json({ created: true });
  }

  const data = await res.json().catch(() => ({}));
  if (res.status === 400 && /already exists/i.test(JSON.stringify(data))) {
    return NextResponse.json({ created: false, existed: true });
  }

  return NextResponse.json({ error: data?.error ?? "Failed to create room" }, { status: res.status });
}
