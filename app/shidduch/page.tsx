import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Heart, Plus, MessageCircle } from "lucide-react";
import type { ShidduchMatch } from "@/types";

export default async function ShidduchPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Heart size={48} className="text-purple-400 mb-4" />
        <h1 className="text-3xl font-serif text-cream-50 mb-2">Find Your Bashert</h1>
        <p className="text-slate-400 max-w-md mb-6">
          No photos. No small talk. Just a thoughtful questionnaire matched to your values,
          observance level, and life goals.
        </p>
        <Link href="/auth/register?tab=shidduch" className="btn-gold">
          Create a Profile
        </Link>
      </div>
    );
  }

  // Check if user has a shidduch profile
  const { data: myProfile } = await supabase
    .from("shidduch_profiles")
    .select("id, is_active")
    .eq("id", user.id)
    .single();

  if (!myProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Heart size={48} className="text-purple-400 mb-4" />
        <h1 className="text-3xl font-serif text-cream-50 mb-2">Set Up Your Profile</h1>
        <p className="text-slate-400 max-w-md mb-6">
          Complete your questionnaire to start receiving matches.
        </p>
        <Link href="/shidduch/questionnaire" className="btn-gold">
          <Plus size={16} /> Start Questionnaire
        </Link>
      </div>
    );
  }

  // Fetch matches
  const { data: matches } = await supabase
    .from("shidduch_matches")
    .select("*, last_message:match_messages(content, created_at)")
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const accepted = (matches ?? []).filter((m: ShidduchMatch) => m.status === "accepted");
  const pending  = (matches ?? []).filter((m: ShidduchMatch) => m.status === "pending");

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <p className="section-label mb-2">Shidduch</p>
          <h1 className="text-4xl font-serif text-cream-50">Your Matches</h1>
        </div>
        <Link href="/shidduch/questionnaire" className="btn-outline text-sm shrink-0">
          Edit Profile
        </Link>
      </div>

      {/* Run matching */}
      <div className="card mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-cream-50 font-medium">Find New Matches</p>
          <p className="text-slate-400 text-sm">Our algorithm scans compatible profiles daily.</p>
        </div>
        <Link href="/shidduch/matches" className="btn-gold text-sm shrink-0">
          <Heart size={14} /> View Suggestions
        </Link>
      </div>

      {/* Active conversations */}
      {accepted.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-cream-50 mb-4">Conversations</h2>
          <div className="space-y-3">
            {accepted.map((m: ShidduchMatch) => (
              <Link
                key={m.id}
                href={`/shidduch/matches/${m.id}`}
                className="card flex items-center justify-between hover:border-purple-400/30"
              >
                <div>
                  <p className="text-cream-50 font-medium">Match #{m.id.slice(0, 6)}</p>
                  <p className="text-slate-400 text-sm">
                    Compatibility: {Math.round(m.score * 100)}%
                  </p>
                </div>
                <MessageCircle size={18} className="text-purple-400" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Pending */}
      {pending.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-cream-50 mb-4">Pending ({pending.length})</h2>
          <div className="space-y-3">
            {pending.map((m: ShidduchMatch) => (
              <div key={m.id} className="card flex items-center justify-between">
                <div>
                  <p className="text-cream-50 font-medium">Potential Match</p>
                  <p className="text-slate-400 text-sm">
                    Compatibility: {Math.round(m.score * 100)}%
                  </p>
                </div>
                <div className="flex gap-2">
                  <AcceptButton matchId={m.id} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {accepted.length === 0 && pending.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Heart size={36} className="mx-auto mb-3 opacity-30" />
          <p>No matches yet. Check back soon — we run matching daily!</p>
        </div>
      )}
    </div>
  );
}

// Small client button placeholder (would be a proper client component)
function AcceptButton({ matchId }: { matchId: string }) {
  return (
    <Link href={`/shidduch/matches/${matchId}`} className="btn-gold text-xs py-1.5 px-3">
      View
    </Link>
  );
}
