import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: { matchId: string } }
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify this user is user_b (the one accepting)
  const { data: match } = await supabase
    .from("shidduch_matches")
    .select("*")
    .eq("id", params.matchId)
    .eq("user_b", user.id)
    .single();

  if (!match) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { error } = await supabase
    .from("shidduch_matches")
    .update({ status: "accepted" })
    .eq("id", params.matchId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.redirect(
    new URL(`/shidduch/matches/${params.matchId}`, process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")
  );
}
