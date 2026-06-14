import Link from "next/link";
import { BookOpen, Heart, Users, Video, MessageSquare, Shield, ArrowRight, Star } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Live Torah Classrooms",
    desc: "Join open virtual rooms led by rabbis. Watch, listen, raise your hand, and join on camera for debate and discussion.",
    color: "gold",
  },
  {
    icon: MessageSquare,
    title: "Hevruta Chat",
    desc: "Real-time chat in every classroom. Ask questions, share sources, and connect with fellow learners as the shiur unfolds.",
    color: "gold",
  },
  {
    icon: Users,
    title: "Rabbi Marketplace",
    desc: "Find rabbis by topic and denomination. Support them through flexible payment or community fundraising.",
    color: "gold",
  },
  {
    icon: Heart,
    title: "Values-First Matching",
    desc: "No photos. No superficiality. A thoughtful questionnaire matched by observance, life goals, and what matters most.",
    color: "rose",
  },
  {
    icon: Shield,
    title: "Complete Privacy",
    desc: "Shidduch profiles have no images. Your identity stays protected until both parties choose to connect.",
    color: "rose",
  },
  {
    icon: BookOpen,
    title: "Every Denomination",
    desc: "From chassidish to reform — Beit Ha Lev is a home for every Jew who wants to learn and find love.",
    color: "rose",
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">

      {/* ── Background ─────────────────────────────────────────────── */}
      <div className="fixed inset-0 -z-10 bg-navy-950" />

      {/* Ambient orbs */}
      <div
        className="glow-orb fixed -z-10 w-[700px] h-[400px] opacity-25"
        style={{ background: "radial-gradient(ellipse, rgba(245,158,42,0.5) 0%, transparent 70%)", top: "-100px", left: "50%", transform: "translateX(-50%)" }}
      />
      <div
        className="glow-orb fixed -z-10 w-[400px] h-[400px] opacity-15"
        style={{ background: "radial-gradient(ellipse, rgba(245,158,42,0.5) 0%, transparent 70%)", top: "40%", right: "-150px" }}
      />
      <div
        className="glow-orb fixed -z-10 w-[300px] h-[300px] opacity-10"
        style={{ background: "radial-gradient(ellipse, rgba(245,158,42,0.4) 0%, transparent 70%)", top: "20%", left: "-100px" }}
      />

      {/* Star field */}
      <div
        className="fixed inset-0 -z-10 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(242,200,74,0.15) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center text-center px-5 pt-28 pb-24 max-w-5xl mx-auto">

        {/* Badge */}
        <div className="badge mb-8 animate-fade-in">
          <Star size={11} className="text-gold-400" />
          <span>Open Beta — Torah Study & Shidduch</span>
        </div>

        {/* Main heading */}
        <h1 className="font-serif text-6xl md:text-8xl font-bold text-cream-50 leading-[1.05] mb-4 animate-slide-up">
          Beit{" "}
          <span className="relative">
            <span className="gradient-gold">Ha Lev</span>
            <svg
              className="absolute -bottom-2 left-0 w-full"
              height="6" viewBox="0 0 200 6"
              fill="none" xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path d="M0 4 Q50 1 100 3 Q150 5 200 2" stroke="url(#g)" strokeWidth="2" strokeLinecap="round"/>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f2c84a" stopOpacity="0"/>
                  <stop offset="0.5" stopColor="#f2c84a"/>
                  <stop offset="1" stopColor="#f2c84a" stopOpacity="0"/>
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>

        {/* Hebrew subtitle */}
        <p className="text-2xl md:text-3xl text-gold-400/60 font-hebrew tracking-widest mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          בֵּית הַלֵּב
        </p>

        {/* Tagline */}
        <p className="text-slate-300/90 text-lg md:text-xl leading-relaxed max-w-2xl mb-3 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          A home for the heart.
        </p>
        <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Study Torah live with rabbis from around the world, and find your bashert
          through values-first, image-free matching.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in" style={{ animationDelay: "0.25s" }}>
          <Link href="/torah" className="btn-gold text-sm px-8 py-4">
            <BookOpen size={16} />
            Explore Torah Study
          </Link>
          <Link href="/shidduch" className="btn-outline text-sm px-8 py-4">
            <Heart size={16} />
            Find Your Bashert
          </Link>
        </div>

        {/* Soft bottom fade into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 -z-10 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(6,8,15,0.5))" }}
        />
      </section>

      {/* ── Divider ────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-5">
        <div className="gold-divider" />
      </div>

      {/* ── Features ───────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-24">
        <div className="text-center mb-16">
          <p className="section-label mb-4">What We Offer</p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-4">
            Torah &amp; Connection,{" "}
            <span className="gradient-gold">Together</span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-base">
            Two sacred pursuits — learning and love — on one platform built for the Jewish soul.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <div
              key={title}
              className="card-feature group"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  background: color === "rose"
                    ? "rgba(244,63,94,0.1)"
                    : "rgba(242,200,74,0.1)",
                  border: `1px solid ${color === "rose" ? "rgba(244,63,94,0.2)" : "rgba(242,200,74,0.2)"}`,
                }}
              >
                <Icon
                  size={20}
                  className={color === "rose" ? "text-rose-400" : "text-gold-400"}
                />
              </div>
              <div>
                <h3 className="font-serif text-lg text-cream-50 font-semibold mb-1.5">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Two-path CTA ───────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-5 pb-24 grid md:grid-cols-2 gap-5">

        {/* Torah card */}
        <div className="relative overflow-hidden rounded-3xl p-10 flex flex-col gap-6 group"
          style={{
            background: "linear-gradient(135deg, rgba(17,30,53,0.9) 0%, rgba(9,13,24,0.95) 100%)",
            border: "1px solid rgba(242,200,74,0.12)",
            boxShadow: "0 8px 48px rgba(0,0,0,0.5)",
          }}>
          <div
            className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity"
            style={{ background: "radial-gradient(circle, rgba(242,200,74,0.5) 0%, transparent 65%)", transform: "translate(40%, -40%)" }}
          />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center mb-5">
              <BookOpen size={22} className="text-gold-400" />
            </div>
            <h3 className="font-serif text-3xl text-cream-50 mb-3">Torah Study</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-7">
              Join a live classroom now, or browse upcoming sessions.<br/>
              Any topic, any level, any denomination.
            </p>
            <Link href="/torah" className="btn-gold text-sm w-fit">
              Browse Classrooms
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Shidduch card */}
        <div className="relative overflow-hidden rounded-3xl p-10 flex flex-col gap-6 group"
          style={{
            background: "linear-gradient(135deg, rgba(20,12,30,0.9) 0%, rgba(9,13,24,0.95) 100%)",
            border: "1px solid rgba(192,132,252,0.12)",
            boxShadow: "0 8px 48px rgba(0,0,0,0.5)",
          }}>
          <div
            className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity"
            style={{ background: "radial-gradient(circle, rgba(192,132,252,0.5) 0%, transparent 65%)", transform: "translate(40%, -40%)" }}
          />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center mb-5">
              <Heart size={22} className="text-purple-400" />
            </div>
            <h3 className="font-serif text-3xl text-cream-50 mb-3">Shidduch</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-7">
              Create a values-first profile and let our algorithm
              find your most compatible matches. No photos required.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 border border-purple-400/30 text-purple-300 hover:bg-purple-400/10 hover:border-purple-400/60"
            >
              Create a Profile
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden mx-5 mb-16 rounded-3xl px-10 py-16 text-center max-w-4xl md:mx-auto"
        style={{
          background: "linear-gradient(135deg, rgba(17,30,53,0.95) 0%, rgba(13,21,37,0.98) 100%)",
          border: "1px solid rgba(242,200,74,0.12)",
          boxShadow: "0 0 80px rgba(0,0,0,0.5)",
        }}>
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(242,200,74,0.12) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-40 opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(242,200,74,0.5) 0%, transparent 70%)", filter: "blur(40px)" }}
        />
        <div className="relative z-10">
          <p className="section-label mb-4">Ready to Begin?</p>
          <h2 className="font-serif text-3xl md:text-5xl text-cream-50 mb-4">
            Your Journey Starts Here
          </h2>
          <p className="text-slate-400 max-w-md mx-auto text-base mb-10">
            Whether you seek wisdom or your bashert — Beit Ha Lev is your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register" className="btn-gold text-sm px-8 py-4">
              Join the Community
              <ArrowRight size={15} />
            </Link>
            <Link href="/torah" className="btn-outline text-sm px-8 py-4">
              Browse Torah Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] py-10 text-center">
        <div className="text-gold-400/50 text-lg mb-2">✡</div>
        <p className="text-slate-500 text-sm">
          Beit Ha Lev &mdash; בֵּית הַלֵּב &mdash; A Home for the Heart
        </p>
        <p className="mt-1 text-slate-600 text-xs">Built with love, for the Jewish people.</p>
      </footer>
    </div>
  );
}
