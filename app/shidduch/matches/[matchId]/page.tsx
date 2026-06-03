import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import MatchChat from "@/components/shidduch/MatchChat";

interface Props { params: { matchId: string } }

export default async function MatchChatPage({ params }: Props) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: match } = await supabase
    .from("shidduch_matches")
    .select("*")
    .eq("id", params.matchId)
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
    .single();

  if (!match) notFound();

  // If pending, offer to accept
  if (match.status === "pending") {
    const isInitiator = match.user_a === user.id;
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="text-5xl mb-4">💌</div>
        <h1 className="text-2xl font-serif text-cream-50 mb-2">
          {isInitiator ? "Waiting for their response…" : "Someone is interested!"}
        </h1>
        <p className="text-slate-400 mb-6">
          Compatibility: {Math.round(match.score * 100)}%
        </p>
        {!isInitiator && <AcceptMatchButton matchId={match.id} />}
      </div>
    );
  }

  if (match.status !== "accepted") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
        This match is no longer active.
      </div>
    );
  }

  // Load messages
  const { data: messages } = await supabase
    .from("match_messages")
    .select("*, profiles(display_name)")
    .eq("match_id", params.matchId)
    .order("created_at", { ascending: true });

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="px-4 py-3 border-b border-navy-700/50 text-center">
        <h1 className="text-cream-50 font-semibold">Your Match</h1>
        <p className="text-xs text-slate-400">
          Compatibility {Math.round(match.score * 100)}% · All messages are private
        </p>
      </div>
      <MatchChat
        matchId={params.matchId}
        initialMessages={messages ?? []}
        userId={user.id}
        displayName={myProfile?.display_name ?? "You"}
      />
    </div>
  );
}

// Small server-side accept form
function AcceptMatchButton({ matchId }: { matchId: string }) {
  return (
    <form action={`/api/matches/${matchId}/accept`} method="POST">
      <button type="submit" className="btn-gold">Accept Match</button>
    </form>
  );
}
