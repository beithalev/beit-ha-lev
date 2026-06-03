"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Heart, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/torah",    label: "Torah Study",  icon: BookOpen },
  { href: "/shidduch", label: "Shidduch",     icon: Heart    },
];

export default function Navbar() {
  const path = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 glass border-b border-navy-700/50">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-2xl leading-none" aria-hidden>✡</span>
          <div className="leading-tight">
            <div className="text-cream-50 font-serif font-semibold text-lg group-hover:text-gold-400 transition-colors">
              Beit Ha Lev
            </div>
            <div className="text-gold-400 text-xs font-hebrew tracking-wide">בֵּית הַלֵּב</div>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                path.startsWith(href)
                  ? "bg-gold-400/15 text-gold-400"
                  : "text-slate-300 hover:text-cream-50 hover:bg-navy-700/60"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-2">
          <Link href="/auth/login" className="btn-outline py-2 px-4 text-xs">
            <LogIn size={14} /> Sign in
          </Link>
          <Link href="/auth/register" className="btn-gold py-2 px-4 text-xs hidden sm:inline-flex">
            Join
          </Link>
        </div>
      </div>
    </header>
  );
}
