import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateRoomName } from "@/lib/utils";

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("classroom_list")
    .select("*")
    .limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, topic, is_live } = body;

  if (!title?.trim()) return NextResponse.json({ error: "Title required" }, { status: 400 });

  const { data, error } = await supabase
    .from("classrooms")
    .insert({
      rabbi_id:        user.id,
      title:           title.trim(),
      description:     description?.trim() || null,
      topic:           topic || "General",
      is_live:         Boolean(is_live),
      jitsi_room_name: generateRoomName(title),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
