import Link from "next/link";
import { BookOpen, Heart, Users, Video, MessageSquare, Shield } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Live Torah Classrooms",
    desc: "Join open virtual rooms led by rabbis. Watch, listen, raise your hand, and join on camera for debate and discussion.",
  },
  {
    icon: MessageSquare,
    title: "Hevruta Chat",
    desc: "Real-time chat in every classroom. Ask questions, share sources, and connect with fellow learners.",
  },
  {
    icon: Users,
    title: "Rabbi Marketplace",
    desc: "Find rabbis by topic and denomination. Support them through flexible payment or fundraising.",
  },
  {
    icon: Heart,
    title: "Shidduch Matching",
    desc: "No photos. No superficiality. A thoughtful questionnaire matched by values, observance, and life goals.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    desc: "Shidduch profiles have no images. Your identity is protected until you choose to share.",
  },
  {
    icon: BookOpen,
    title: "Any Denomination",
    desc: "From chassidish to reform — Beit Ha Lev is a home for every Jew who wants to learn and connect.",
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background radial gradient + star pattern */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(22,58,112,0.7) 0%, transparent 70%), #040d1a",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(242,200,74,0.18) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center text-center px-4 pt-24 pb-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-400/30 bg-gold-400/5 text-gold-400 text-xs font-medium mb-8 uppercase tracking-widest">
          <span>✡</span> Beta — Torah Study &amp; Shidduch
        </div>

        <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight text-cream-50 mb-4">
          Beit{" "}
          <span className="text-gold-400 relative">
            Ha Lev
            <span
              className="absolute -bottom-2 left-0 right-0 h-[2px] rounded-full"
              style={{ background: "linear-gradient(90deg, transparent, #f2c84a, transparent)" }}
            />
          </span>
        </h1>

        <p className="text-3xl md:text-4xl font-hebrew text-gold-300/80 mb-6 tracking-wide">
          בֵּית הַלֵּב
        </p>

        <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl mb-10">
          A home for the heart. Study Torah live with rabbis from around the world,
          and find your bashert through values-first, image-free matching.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/torah" className="btn-gold text-base px-8 py-4">
            <BookOpen size={18} /> Explore Torah Study
          </Link>
          <Link href="/shidduch" className="btn-outline text-base px-8 py-4">
            <Heart size={18} /> Find Your Bashert
          </Link>
        </div>
      </section>

      {/* ── Divider ────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4">
        <div
          className="h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(242,200,74,0.3), transparent)" }}
        />
      </div>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="section-label mb-3">What We Offer</p>
          <h2 className="text-3xl md:text-4xl font-serif text-cream-50">
            Torah & Connection, <span className="gold-text">Together</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card group">
              <div className="w-10 h-10 rounded-lg bg-gold-400/10 border border-gold-400/20 flex items-center justify-center mb-4 group-hover:bg-gold-400/20 transition-colors">
                <Icon size={20} className="text-gold-400" />
              </div>
              <h3 className="text-cream-50 font-semibold mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Two-path CTA ───────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 pb-24 grid md:grid-cols-2 gap-6">
        {/* Torah card */}
        <div className="relative overflow-hidden rounded-2xl border border-navy-700/60 p-8"
          style={{ background: "linear-gradient(135deg, #0d2040 0%, #071428 100%)" }}>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #f2c84a 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
          <BookOpen size={28} className="text-gold-400 mb-4" />
          <h3 className="text-2xl font-serif text-cream-50 mb-2">Torah Study</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Join a live classroom now, or browse upcoming sessions. Any topic, any level.
          </p>
          <Link href="/torah" className="btn-gold text-sm">Browse Classrooms</Link>
        </div>

        {/* Shidduch card */}
        <div className="relative overflow-hidden rounded-2xl border border-navy-700/60 p-8"
          style={{ background: "linear-gradient(135deg, #1a0d28 0%, #071428 100%)" }}>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #c084fc 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
          <Heart size={28} className="text-purple-400 mb-4" />
          <h3 className="text-2xl font-serif text-cream-50 mb-2">Shidduch</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Create a values-first profile and let our algorithm find your most compatible matches.
          </p>
          <Link href="/auth/register?tab=shidduch" className="btn-outline border-purple-400/50 text-purple-300 hover:bg-purple-400/10 text-sm">
            Create a Profile
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-navy-700/50 py-8 text-center text-slate-500 text-sm">
        <p>Beit Ha Lev &mdash; בֵּית הַלֵּב &mdash; A Home for the Heart</p>
        <p className="mt-1 text-xs">Built with love, for the Jewish people.</p>
      </footer>
    </div>
  );
}
