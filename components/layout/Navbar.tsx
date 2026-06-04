"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Heart, LogIn, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/torah",    label: "Torah Study",  icon: BookOpen },
  { href: "/shidduch", label: "Shidduch",     icon: Heart    },
];

export default function Navbar() {
  const path = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16">
      {/* Backdrop */}
      <div className="absolute inset-0 glass border-b border-white/[0.05]" />

      <div className="relative max-w-7xl mx-auto h-full flex items-center justify-between px-5 md:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-lg bg-gold-400/10 group-hover:bg-gold-400/20 transition-colors" />
            <span className="text-gold-400 text-lg relative z-10">✡</span>
          </div>
          <div className="leading-tight">
            <div className="text-cream-50 font-serif font-bold text-base group-hover:text-gold-300 transition-colors">
              Beit Ha Lev
            </div>
            <div className="text-gold-500/70 text-[10px] font-hebrew tracking-wider">בֵּית הַלֵּב</div>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-0.5">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                path.startsWith(href)
                  ? "text-gold-400 bg-gold-400/10"
                  : "text-slate-400 hover:text-cream-100 hover:bg-white/5"
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-cream-50 hover:bg-white/5 transition-all font-medium"
          >
            <LogIn size={14} />
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="btn-gold py-2 px-4 text-xs"
          >
            <Sparkles size={13} />
            Join Free
          </Link>
        </div>
      </div>
    </header>
  );
}
