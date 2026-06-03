import type { ShidduchProfile, ShidduchQuestionnaire } from "@/types";

// ─── Denomination compatibility ───────────────────────────────────────────────
// Distances on a spectrum; closer = more compatible
const DENOM_ORDER: Record<string, number> = {
  ultra_orthodox:   0,
  orthodox:         1,
  modern_orthodox:  2,
  traditional:      3,
  conservative:     4,
  reform:           5,
  secular_jewish:   6,
  other:            3, // neutral
};

function denomScore(a: string, b: string): number {
  const da = DENOM_ORDER[a] ?? 3;
  const db = DENOM_ORDER[b] ?? 3;
  const dist = Math.abs(da - db);
  // 0 apart → 1.0, 6 apart → 0.0
  return Math.max(0, 1 - dist / 6);
}

// ─── Numeric scale similarity (1–5) ──────────────────────────────────────────
function scaleScore(a: number, b: number, max = 5): number {
  return 1 - Math.abs(a - b) / (max - 1);
}

// ─── Categorical match ────────────────────────────────────────────────────────
function catScore(a: string, b: string): number {
  if (a === b) return 1;
  if (a === "open" || b === "open") return 0.6; // open is flexible
  return 0;
}

// ─── Geographic flexibility ───────────────────────────────────────────────────
const GEO_ORDER: Record<string, number> = { local: 0, national: 1, international: 2 };
function geoScore(a: string, b: string): number {
  const da = GEO_ORDER[a] ?? 1;
  const db = GEO_ORDER[b] ?? 1;
  return 1 - Math.abs(da - db) / 2;
}

// ─── Age compatibility ────────────────────────────────────────────────────────
function ageScore(seeker: ShidduchQuestionnaire, candidate: ShidduchProfile): number {
  const age = candidate.age;
  if (age >= seeker.age_min && age <= seeker.age_max) return 1;
  const over  = Math.max(0, age - seeker.age_max);
  const under = Math.max(0, seeker.age_min - age);
  const dist  = Math.max(over, under);
  return Math.max(0, 1 - dist / 10); // graceful falloff
}

// ─── Values overlap ───────────────────────────────────────────────────────────
function valuesScore(a: string[], b: string[]): number {
  if (!a.length && !b.length) return 1;
  const setA = new Set(a);
  const overlap = b.filter((v) => setA.has(v)).length;
  return overlap / Math.max(a.length, b.length);
}

// ─── Gender compatibility ─────────────────────────────────────────────────────
function genderCompatible(q: ShidduchQuestionnaire, candidate: ShidduchProfile): boolean {
  return candidate.gender === q.preferred_gender || q.preferred_gender === "other";
}

// ─── Master scoring function ──────────────────────────────────────────────────

interface Weight {
  key: string;
  score: number;
  weight: number;
}

export function computeMatchScore(
  seekerQ: ShidduchQuestionnaire,
  candidate: ShidduchProfile
): number {
  if (!genderCompatible(seekerQ, candidate)) return 0;
  const cQ = candidate.questionnaire;

  const weights: Weight[] = [
    { key: "denomination",        score: denomScore(seekerQ.denomination, cQ.denomination),                weight: 0.25 },
    { key: "shabbat",             score: scaleScore(seekerQ.shabbat_observance, cQ.shabbat_observance),    weight: 0.10 },
    { key: "kashrut",             score: scaleScore(seekerQ.kashrut_level, cQ.kashrut_level),              weight: 0.08 },
    { key: "aliyah",              score: catScore(seekerQ.aliyah_plans, cQ.aliyah_plans),                  weight: 0.10 },
    { key: "learning",            score: scaleScore(seekerQ.learning_importance, cQ.learning_importance),  weight: 0.10 },
    { key: "community",           score: scaleScore(seekerQ.community_involvement, cQ.community_involvement), weight: 0.05 },
    { key: "children",            score: catScore(seekerQ.wants_children, cQ.wants_children),              weight: 0.10 },
    { key: "family_size",         score: catScore(seekerQ.ideal_family_size, cQ.ideal_family_size),        weight: 0.05 },
    { key: "age",                 score: ageScore(seekerQ, candidate),                                     weight: 0.10 },
    { key: "geography",           score: geoScore(seekerQ.geographic_flexibility, cQ.geographic_flexibility), weight: 0.07 },
    { key: "values",              score: valuesScore(seekerQ.values, cQ.values),                           weight: 0.10 },
  ];

  const totalWeight = weights.reduce((s, w) => s + w.weight, 0);
  const raw = weights.reduce((s, w) => s + w.score * w.weight, 0);
  return Math.round((raw / totalWeight) * 100) / 100; // 0.00–1.00
}

export function rankCandidates(
  seeker: ShidduchProfile,
  candidates: ShidduchProfile[]
): Array<{ profile: ShidduchProfile; score: number }> {
  return candidates
    .filter((c) => c.id !== seeker.id)
    .map((c) => ({
      profile: c,
      score: computeMatchScore(seeker.questionnaire, c),
    }))
    .filter((r) => r.score > 0.3) // minimum threshold
    .sort((a, b) => b.score - a.score);
}
