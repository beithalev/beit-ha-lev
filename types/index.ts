// ─── Auth / User ─────────────────────────────────────────────────────────────

export type UserRole = "student" | "rabbi" | "shidduch" | "admin";

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

// ─── Torah Study ──────────────────────────────────────────────────────────────

export interface RabbiProfile {
  id: string;
  profile: Profile;
  title: string;
  bio: string;
  specialties: string[];
  is_accepting_students: boolean;
}

export interface Classroom {
  id: string;
  rabbi_id: string;
  rabbi?: Profile;
  title: string;
  description: string;
  topic: string;
  is_live: boolean;
  jitsi_room_name: string;
  participant_count: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  classroom_id: string;
  user_id: string;
  user?: Pick<Profile, "display_name">;
  content: string;
  created_at: string;
}

// ─── Shidduch ────────────────────────────────────────────────────────────────

export type Gender = "male" | "female" | "other";
export type Denomination =
  | "ultra_orthodox"
  | "orthodox"
  | "modern_orthodox"
  | "traditional"
  | "conservative"
  | "reform"
  | "secular_jewish"
  | "other";

export interface ShidduchQuestionnaire {
  // Background
  denomination: Denomination;
  shabbat_observance: number;        // 1–5
  kashrut_level: number;             // 1–5
  // Lifestyle
  aliyah_plans: "yes" | "open" | "no";
  learning_importance: number;       // 1–5 (how important Torah learning is in a partner)
  community_involvement: number;     // 1–5
  // Family
  wants_children: "yes" | "open" | "no";
  ideal_family_size: "1-2" | "3-4" | "5+" | "open";
  // Partner prefs
  preferred_gender: Gender;
  age_min: number;
  age_max: number;
  geographic_flexibility: "local" | "national" | "international";
  // Values (free weights)
  values: string[];                  // e.g. ["chesed","learning","family"]
}

export interface ShidduchProfile {
  id: string;
  profile?: Profile;
  gender: Gender;
  age: number;
  background: string;
  denomination: Denomination;
  bio: string;
  questionnaire: ShidduchQuestionnaire;
  is_active: boolean;
  created_at: string;
}

export type MatchStatus = "pending" | "accepted" | "rejected" | "expired";

export interface ShidduchMatch {
  id: string;
  user_a: string;
  user_b: string;
  other_user?: ShidduchProfile;
  score: number;
  status: MatchStatus;
  created_at: string;
  last_message?: MatchMessage;
}

export interface MatchMessage {
  id: string;
  match_id: string;
  sender_id: string;
  sender?: Pick<Profile, "display_name">;
  content: string;
  created_at: string;
}
