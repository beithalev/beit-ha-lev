"use client";
import Link from "next/link";
import { BookOpen, Heart } from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-6">✉️</div>
        <h1 className="text-3xl font-serif text-cream-50 mb-3">Check your email</h1>
        <p className="text-slate-400 mb-8">
          We sent a confirmation link to your email address. Click it to verify your account,
          then come back and dive in.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/torah" className="card flex flex-col items-center gap-2 py-6 hover:border-gold-400/40 cursor-pointer">
            <BookOpen size={24} className="text-gold-400" />
            <span className="text-cream-50 font-medium text-sm">Torah Study</span>
          </Link>
          <Link href="/shidduch" className="card flex flex-col items-center gap-2 py-6 hover:border-purple-400/40 cursor-pointer">
            <Heart size={24} className="text-purple-400" />
            <span className="text-cream-50 font-medium text-sm">Shidduch</span>
          </Link>
        </div>

        <p className="text-slate-500 text-sm mt-6">
          Already verified?{" "}
          <Link href="/auth/login" className="text-gold-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
