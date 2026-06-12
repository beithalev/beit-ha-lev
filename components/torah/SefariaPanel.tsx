"use client";
import { useEffect, useRef, useState } from "react";
import { Search, BookOpen } from "lucide-react";

type SefariaText = string | SefariaText[];

interface SefariaResult {
  ref: string;
  heRef: string;
  he: SefariaText;
  text: SefariaText;
}

const PREFIX_STRIP = /^(talmud|gemara|mishnah|mishna|masechet|masechta|tractate)\s+/i;

function cleanQuery(input: string) {
  return input.trim().replace(PREFIX_STRIP, "");
}

function toSefariaRef(input: string) {
  return cleanQuery(input).replace(/:/g, ".").replace(/\s+/g, ".");
}

function flatten(value: SefariaText): string[] {
  if (Array.isArray(value)) return value.flatMap(flatten);
  return value ? [value] : [];
}

export default function SefariaPanel() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SefariaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const skipNextFetch = useRef(false);

  // Autocomplete suggestions as the user types
  useEffect(() => {
    if (skipNextFetch.current) { skipNextFetch.current = false; return; }
    if (query.trim().length < 2) { setSuggestions([]); return; }

    const handle = setTimeout(async () => {
      try {
        const res = await fetch(`https://www.sefaria.org/api/name/${encodeURIComponent(cleanQuery(query))}`);
        if (!res.ok) return;
        const data = await res.json();
        const completions: string[] = Array.isArray(data.completions) ? data.completions : [];
        setSuggestions(completions.slice(0, 8));
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(handle);
  }, [query]);

  async function runLookup(value: string) {
    if (!value.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setShowSuggestions(false);

    try {
      const ref = toSefariaRef(value);
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

  function selectSuggestion(s: string) {
    skipNextFetch.current = true;
    setQuery(s);
    setSuggestions([]);
    setShowSuggestions(false);
    runLookup(s);
  }

  return (
    <div className="flex flex-col h-full">
      <form
        onSubmit={(e) => { e.preventDefault(); runLookup(query); }}
        className="relative px-4 py-3 border-b border-navy-700/50 flex gap-2"
      >
        <input
          className="input-field flex-1 py-2"
          placeholder="Search for a source, e.g. Genesis, Berakhot…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        />
        <button type="submit" className="btn-gold px-3 shrink-0" disabled={loading || !query.trim()}>
          <Search size={16} />
        </button>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-4 right-16 top-full mt-1 bg-navy-800 border border-navy-700 rounded-lg overflow-hidden z-10 shadow-lg">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={() => selectSuggestion(s)}
                className="block w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-navy-700 hover:text-cream-50 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </form>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {!result && !error && !loading && (
          <div className="text-center text-slate-500 py-12">
            <BookOpen size={28} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Search for a source from Sefaria to share with the room.</p>
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
            {flatten(result.he).slice(0, 40).map((line, i) => (
              <p key={`he-${i}`} dir="rtl" className="font-hebrew text-cream-100 text-base leading-relaxed">
                {line.replace(/<[^>]+>/g, "")}
              </p>
            ))}
            {flatten(result.text).slice(0, 40).map((line, i) => (
              <p key={`en-${i}`} className="text-slate-300 text-sm leading-relaxed">
                {line.replace(/<[^>]+>/g, "")}
              </p>
            ))}
            {(flatten(result.he).length > 40 || flatten(result.text).length > 40) && (
              <p className="text-slate-500 text-xs italic">
                This source is long — showing the first part only. Try a more specific reference (e.g. a chapter or page).
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
