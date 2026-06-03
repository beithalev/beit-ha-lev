"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Denomination, Gender, ShidduchQuestionnaire } from "@/types";

// ── Step definitions ──────────────────────────────────────────────────────────

const STEPS = ["About You", "Observance", "Life Goals", "Partner Preferences", "Bio"];

const DENOMINATIONS: { value: Denomination; label: string }[] = [
  { value: "ultra_orthodox",  label: "Ultra Orthodox / Haredi" },
  { value: "orthodox",        label: "Orthodox" },
  { value: "modern_orthodox", label: "Modern Orthodox" },
  { value: "traditional",     label: "Traditional / Masorti" },
  { value: "conservative",    label: "Conservative" },
  { value: "reform",          label: "Reform" },
  { value: "secular_jewish",  label: "Secular Jewish" },
  { value: "other",           label: "Other" },
];

const VALUES_OPTIONS = [
  "Torah learning", "Chesed", "Family", "Community", "Aliyah", "Career",
  "Creativity", "Travel", "Spirituality", "Social justice", "Music", "Nature",
];

function ScaleInput({
  label, value, onChange, low, high,
}: {
  label: string; value: number; onChange: (v: number) => void; low: string; high: string;
}) {
  return (
    <div>
      <label className="block text-sm text-slate-300 mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 w-20">{low}</span>
        <div className="flex gap-1.5 flex-1 justify-center">
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                value === v
                  ? "bg-gold-400 text-navy-950"
                  : "bg-navy-700 text-slate-300 hover:bg-navy-600"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500 w-20 text-right">{high}</span>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function QuestionnairePage() {
  const router  = useRouter();
  const supabase = createClient();
  const [step, setStep]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  // Form state
  const [gender, setGender]       = useState<Gender>("male");
  const [age, setAge]             = useState(25);
  const [background, setBackground] = useState("");
  const [bio, setBio]             = useState("");
  const [q, setQ]                 = useState<ShidduchQuestionnaire>({
    denomination:           "modern_orthodox",
    shabbat_observance:      3,
    kashrut_level:           3,
    aliyah_plans:           "open",
    learning_importance:     3,
    community_involvement:   3,
    wants_children:         "yes",
    ideal_family_size:      "3-4",
    preferred_gender:       "female",
    age_min:                22,
    age_max:                30,
    geographic_flexibility: "national",
    values:                 [],
  });

  function updateQ<K extends keyof ShidduchQuestionnaire>(key: K, val: ShidduchQuestionnaire[K]) {
    setQ((prev) => ({ ...prev, [key]: val }));
  }

  function toggleValue(v: string) {
    setQ((prev) => ({
      ...prev,
      values: prev.values.includes(v)
        ? prev.values.filter((x) => x !== v)
        : [...prev.values, v],
    }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Please sign in."); setLoading(false); return; }

    const { error: err } = await supabase
      .from("shidduch_profiles")
      .upsert({
        id:            user.id,
        gender,
        age,
        background:    background.trim(),
        denomination:  q.denomination,
        bio:           bio.trim(),
        questionnaire: q,
        is_active:     true,
      });

    if (err) { setError(err.message); setLoading(false); return; }
    router.push("/shidduch");
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>{STEPS[step]}</span>
          <span>{step + 1} / {STEPS.length}</span>
        </div>
        <div className="h-1.5 rounded-full bg-navy-700">
          <div
            className="h-full rounded-full bg-gold-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="card space-y-6">
        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
        )}

        {/* ── Step 0: About You ─────────────────────────────────────── */}
        {step === 0 && (
          <>
            <h2 className="text-xl font-serif text-cream-50">About You</h2>
            <div>
              <label className="block text-sm text-slate-300 mb-2">I am</label>
              <div className="flex gap-3">
                {(["male", "female", "other"] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`flex-1 py-2.5 rounded-lg capitalize text-sm font-medium transition-all ${
                      gender === g ? "bg-gold-400 text-navy-950" : "bg-navy-700 text-slate-300 hover:bg-navy-600"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Age</label>
              <input
                type="number" className="input-field w-32" min={18} max={99}
                value={age} onChange={(e) => setAge(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Background / Heritage (optional)</label>
              <input className="input-field" placeholder="e.g. Ashkenazi, Sephardic, Mizrachi, Baal Teshuva…"
                value={background} onChange={(e) => setBackground(e.target.value)} />
            </div>
          </>
        )}

        {/* ── Step 1: Observance ────────────────────────────────────── */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-serif text-cream-50">Your Observance</h2>
            <div>
              <label className="block text-sm text-slate-300 mb-2">How do you identify?</label>
              <div className="grid grid-cols-2 gap-2">
                {DENOMINATIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updateQ("denomination", value)}
                    className={`py-2.5 px-3 rounded-lg text-sm text-left transition-all ${
                      q.denomination === value
                        ? "bg-gold-400/20 border border-gold-400/50 text-gold-400"
                        : "bg-navy-700 border border-transparent text-slate-300 hover:bg-navy-600"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <ScaleInput label="Shabbat Observance" value={q.shabbat_observance}
              onChange={(v) => updateQ("shabbat_observance", v)}
              low="Minimal" high="Fully shomer" />
            <ScaleInput label="Kashrut Level" value={q.kashrut_level}
              onChange={(v) => updateQ("kashrut_level", v)}
              low="Not at all" high="Strictly kosher" />
          </>
        )}

        {/* ── Step 2: Life Goals ────────────────────────────────────── */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-serif text-cream-50">Life Goals</h2>
            {[
              { key: "aliyah_plans" as const, label: "Plans for Aliyah?", opts: ["yes", "open", "no"] as const },
              { key: "wants_children" as const, label: "Want children?", opts: ["yes", "open", "no"] as const },
            ].map(({ key, label, opts }) => (
              <div key={key}>
                <label className="block text-sm text-slate-300 mb-2">{label}</label>
                <div className="flex gap-2">
                  {opts.map((o) => (
                    <button key={o} type="button"
                      onClick={() => updateQ(key, o)}
                      className={`flex-1 py-2.5 rounded-lg capitalize text-sm font-medium transition-all ${
                        q[key] === o ? "bg-gold-400 text-navy-950" : "bg-navy-700 text-slate-300 hover:bg-navy-600"
                      }`}
                    >
                      {o === "open" ? "Open" : o === "yes" ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <label className="block text-sm text-slate-300 mb-2">Ideal family size</label>
              <div className="grid grid-cols-4 gap-2">
                {(["1-2", "3-4", "5+", "open"] as const).map((s) => (
                  <button key={s} type="button"
                    onClick={() => updateQ("ideal_family_size", s)}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                      q.ideal_family_size === s ? "bg-gold-400 text-navy-950" : "bg-navy-700 text-slate-300 hover:bg-navy-600"
                    }`}
                  >
                    {s === "open" ? "Open" : s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">What matters most to you? (choose any)</label>
              <div className="flex flex-wrap gap-2">
                {VALUES_OPTIONS.map((v) => (
                  <button key={v} type="button" onClick={() => toggleValue(v)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      q.values.includes(v)
                        ? "bg-gold-400/20 border border-gold-400/50 text-gold-400"
                        : "bg-navy-700 border border-transparent text-slate-400 hover:border-navy-500"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Step 3: Partner Preferences ──────────────────────────── */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-serif text-cream-50">Partner Preferences</h2>
            <div>
              <label className="block text-sm text-slate-300 mb-2">I am looking for</label>
              <div className="flex gap-3">
                {(["male", "female", "other"] as Gender[]).map((g) => (
                  <button key={g} type="button"
                    onClick={() => updateQ("preferred_gender", g)}
                    className={`flex-1 py-2.5 rounded-lg capitalize text-sm font-medium transition-all ${
                      q.preferred_gender === g ? "bg-gold-400 text-navy-950" : "bg-navy-700 text-slate-300 hover:bg-navy-600"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm text-slate-300 mb-1.5">Min Age</label>
                <input type="number" className="input-field" min={18} max={99}
                  value={q.age_min} onChange={(e) => updateQ("age_min", Number(e.target.value))} />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-slate-300 mb-1.5">Max Age</label>
                <input type="number" className="input-field" min={18} max={99}
                  value={q.age_max} onChange={(e) => updateQ("age_max", Number(e.target.value))} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Geographic flexibility</label>
              <div className="flex gap-2">
                {(["local", "national", "international"] as const).map((g) => (
                  <button key={g} type="button"
                    onClick={() => updateQ("geographic_flexibility", g)}
                    className={`flex-1 py-2.5 rounded-lg capitalize text-sm font-medium transition-all ${
                      q.geographic_flexibility === g ? "bg-gold-400 text-navy-950" : "bg-navy-700 text-slate-300 hover:bg-navy-600"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <ScaleInput label="How important is Torah learning in a partner?"
              value={q.learning_importance} onChange={(v) => updateQ("learning_importance", v)}
              low="Not important" high="Essential" />
          </>
        )}

        {/* ── Step 4: Bio ───────────────────────────────────────────── */}
        {step === 4 && (
          <>
            <h2 className="text-xl font-serif text-cream-50">Your Bio</h2>
            <p className="text-slate-400 text-sm">
              This is all your potential matches will see before the algorithm introduces you.
              No name, no photo — just who you are.
            </p>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">
                Tell us about yourself <span className="text-slate-500">(max 500 chars)</span>
              </label>
              <textarea
                className="input-field resize-none h-36"
                placeholder="A few sentences about your values, what you love, what you're looking for in life…"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
              />
              <div className="text-xs text-slate-500 text-right mt-1">{bio.length}/500</div>
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-2">
          {step > 0 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="btn-outline text-sm py-2.5">
              ← Back
            </button>
          ) : <div />}

          {step < STEPS.length - 1 ? (
            <button type="button" onClick={() => setStep(step + 1)} className="btn-gold">
              Continue →
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={loading} className="btn-gold">
              {loading ? "Saving…" : "Complete Profile ✓"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
