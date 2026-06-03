import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { rankCandidates } from "@/lib/matching/algorithm";
import MatchSuggestions from "@/components/shidduch/MatchSuggestions";
import type { ShidduchProfile } from "@/types";

export default async function MatchesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Get my profile
  const { data: myProfile } = await supabase
    .from("shidduch_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!myProfile) redirect("/shidduch/questionnaire");

  // Get all other active profiles
  const { data: allProfiles } = await supabase
    .from("shidduch_profiles")
    .select("*, profiles(display_name)")
    .eq("is_active", true)
    .neq("id", user.id);

  const ranked = rankCandidates(myProfile as ShidduchProfile, (allProfiles ?? []) as ShidduchProfile[]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="section-label mb-2">Shidduch</p>
        <h1 className="text-4xl font-serif text-cream-50">Your Suggestions</h1>
        <p className="text-slate-400 mt-2">
          Ranked by compatibility. No names or photos — just connection.
        </p>
      </div>
      <MatchSuggestions
        suggestions={ranked.slice(0, 20)}
        currentUserId={user.id}
      />
    </div>
  );
}
