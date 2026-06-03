"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BookOpen, Heart, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

const roles: { value: UserRole; label: string; desc: string; icon: React.ElementType }[] = [
  { value: "student",  label: "Student / Learner", desc: "Join Torah classrooms and connect with rabbis.", icon: GraduationCap },
  { value: "rabbi",    label: "Rabbi / Teacher",   desc: "Host live study rooms and share your Torah.", icon: BookOpen },
  { value: "shidduch", label: "Shidduch",          desc: "Create a profile and find your bashert.", icon: Heart },
];

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep]           = useState<"role" | "details">("role");
  const [role, setRole]           = useState<UserRole>("student");
  const [displayName, setName]    = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName, role },
        emailRedirectTo: `${window.location.origin}/auth/onboarding`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/auth/onboarding");
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <span className="text-4xl">✡</span>
          <h1 className="text-3xl font-serif text-cream-50 mt-3">Join Beit Ha Lev</h1>
          <p className="text-slate-400 text-sm mt-1">בֵּית הַלֵּב</p>
        </div>

        {step === "role" ? (
          <div className="card space-y-4">
            <p className="text-cream-50 font-medium mb-2">I am joining as…</p>
            {roles.map(({ value, label, desc, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={cn(
                  "w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all",
                  role === value
                    ? "border-gold-400/60 bg-gold-400/10"
                    : "border-navy-700 hover:border-navy-600 bg-navy-900/40"
                )}
              >
                <Icon size={20} className={role === value ? "text-gold-400 mt-0.5" : "text-slate-400 mt-0.5"} />
                <div>
                  <div className={cn("font-medium text-sm", role === value ? "text-gold-400" : "text-cream-50")}>
                    {label}
                  </div>
                  <div className="text-slate-400 text-xs mt-0.5">{desc}</div>
                </div>
              </button>
            ))}
            <button className="btn-gold w-full mt-2" onClick={() => setStep("details")}>
              Continue
            </button>
            <p className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-gold-400 hover:underline">Sign in</Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="card space-y-5">
            <button
              type="button"
              onClick={() => setStep("role")}
              className="text-slate-400 text-sm hover:text-cream-50"
            >
              ← Back
            </button>

            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Display Name</label>
              <input
                className="input-field"
                placeholder="How you&apos;ll appear on the platform"
                value={displayName}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Email</label>
              <input type="email" className="input-field" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Password</label>
              <input type="password" className="input-field" placeholder="Min. 8 characters"
                value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
            </div>

            <button type="submit" className="btn-gold w-full" disabled={loading}>
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
