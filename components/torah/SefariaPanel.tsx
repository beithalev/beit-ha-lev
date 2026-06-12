"use client";
import { useState } from "react";
import { Search, BookOpen } from "lucide-react";

interface SefariaResult {
  ref: string;
  heRef: string;
  he: string | string[];
  text: string | string[];
}

function toSefariaRef(input: string) {
  return input.trim().replace(/:/g, ".").replace(/\s+/g, ".");
}

function flatten(value: string | string[]): string[] {
  return Array.isArray(value) ? value.filter(Boolean) : [value].filter(Boolean);
}

export default function SefariaPanel() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SefariaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const ref = toSefariaRef(query);
      const res = await fetch(`https://www.sefaria.org/api/texts/${encodeURIComponent(ref)}?context=0`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch {
      setError("Couldn't find that source. Try e.g. \"Genesis 1:1\" or \"Berakhot 2a\".");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={lookup} className="px-4 py-3 border-b border-navy-700/50 flex gap-2">
        <input
          className="input-field flex-1 py-2"
          placeholder="e.g. Genesis 1:1, Berakhot 2a…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn-gold px-3 shrink-0" disabled={loading || !query.trim()}>
          <Search size={16} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {!result && !error && !loading && (
          <div className="text-center text-slate-500 py-12">
            <BookOpen size={28} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Look up a source from Sefaria to share with the room.</p>
          </div>
        )}

        {loading && (
          <p className="text-center text-slate-500 text-sm py-12">Searching…</p>
        )}

        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div>
              <p className="text-gold-400 text-sm font-semibold">{result.ref}</p>
              <p className="text-slate-500 text-xs font-hebrew">{result.heRef}</p>
            </div>
            {flatten(result.he).map((line, i) => (
              <p key={`he-${i}`} dir="rtl" className="font-hebrew text-cream-100 text-base leading-relaxed">
                {line.replace(/<[^>]+>/g, "")}
              </p>
            ))}
            {flatten(result.text).map((line, i) => (
              <p key={`en-${i}`} className="text-slate-300 text-sm leading-relaxed">
                {line.replace(/<[^>]+>/g, "")}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
