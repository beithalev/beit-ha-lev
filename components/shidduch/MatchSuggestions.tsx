"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Heart, X, MapPin, Book } from "lucide-react";
import type { ShidduchProfile } from "@/types";

interface Suggestion {
  profile: ShidduchProfile;
  score:   number;
}

interface Props {
  suggestions:   Suggestion[];
  currentUserId: string;
}

const DENOM_LABELS: Record<string, string> = {
  ultra_orthodox:  "Haredi",
  orthodox:        "Orthodox",
  modern_orthodox: "Modern Orthodox",
  traditional:     "Traditional",
  conservative:    "Conservative",
  reform:          "Reform",
  secular_jewish:  "Secular Jewish",
  other:           "Other",
};

export default function MatchSuggestions({ suggestions, currentUserId }: Props) {
  const supabase = createClient();
  const [list, setList]       = useState(suggestions);
  const [loading, setLoading] = useState<string | null>(null);
  const [done, setDone]       = useState<Set<string>>(new Set());

  async function respond(candidateId: string, score: number, accept: boolean) {
    setLoading(candidateId);
    if (accept) {
      await supabase.from("shidduch_matches").upsert({
        user_a: currentUserId,
        user_b: candidateId,
        score,
        status: "pending",
      });
    }
    setDone((prev) => new Set([...prev, candidateId]));
    setLoading(null);
  }

  const visible = list.filter((s) => !done.has(s.profile.id));

  if (visible.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500">
        <Heart size={36} className="mx-auto mb-3 opacity-30" />
        <p>You&apos;ve reviewed all suggestions for now. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {visible.map(({ profile: p, score }) => (
        <div key={p.id} className="card space-y-4">
          {/* Score badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-navy-950 font-bold text-sm"
                style={{
                  background: `conic-gradient(#f2c84a ${score * 360}deg, #163a70 0)`,
                }}
              >
                <div className="w-9 h-9 rounded-full bg-navy-800 flex items-center justify-center text-gold-400 text-xs font-bold">
                  {Math.round(score * 100)}%
                </div>
              </div>
              <div>
                <p className="text-cream-50 font-medium">Compatibility</p>
                <p className="text-slate-500 text-xs">Based on your questionnaire</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-navy-700 text-slate-300 text-xs capitalize">
              {DENOM_LABELS[p.denomination] ?? p.denomination}
            </span>
          </div>

          {/* Profile info — no name, no photo */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-navy-900/50 rounded-lg py-2.5 px-2">
              <p className="text-gold-400 font-semibold">{p.age}</p>
              <p className="text-slate-500 text-xs mt-0.5">Age</p>
            </div>
            <div className="bg-navy-900/50 rounded-lg py-2.5 px-2 capitalize">
              <p className="text-gold-400 font-semibold">{p.gender}</p>
              <p className="text-slate-500 text-xs mt-0.5">Gender</p>
            </div>
            <div className="bg-navy-900/50 rounded-lg py-2.5 px-2">
              <p className="text-gold-400 font-semibold capitalize">{p.questionnaire?.geographic_flexibility ?? "—"}</p>
              <p className="text-slate-500 text-xs mt-0.5">Flexibility</p>
            </div>
          </div>

          {p.background && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <MapPin size={14} className="shrink-0" />
              <span>{p.background}</span>
            </div>
          )}

          {p.questionnaire?.values?.length > 0 && (
            <div className="flex items-start gap-2 text-sm text-slate-400">
              <Book size={14} className="shrink-0 mt-0.5" />
              <span className="line-clamp-1">{p.questionnaire.values.join(" · ")}</span>
            </div>
          )}

          {p.bio && (
            <blockquote className="border-l-2 border-gold-400/30 pl-4 text-slate-300 text-sm leading-relaxed italic line-clamp-4">
              {p.bio}
            </blockquote>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => respond(p.id, score, false)}
              disabled={loading === p.id}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-navy-600 text-slate-400 hover:border-red-500/40 hover:text-red-400 transition-all text-sm"
            >
              <X size={16} /> Pass
            </button>
            <button
              onClick={() => respond(p.id, score, true)}
              disabled={loading === p.id}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 transition-all text-sm font-medium"
            >
              <Heart size={16} /> Express Interest
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
