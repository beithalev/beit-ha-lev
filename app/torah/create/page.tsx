"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateRoomName } from "@/lib/utils";

const TOPICS = [
  "Parasha", "Talmud", "Halacha", "Machshava", "Kabbalah",
  "Philosophy", "History", "Hebrew", "Prayer", "Lifecycle", "Other",
];

export default function CreateRoomPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle]       = useState("");
  const [description, setDesc]  = useState("");
  const [topic, setTopic]       = useState("Parasha");
  const [isLive, setIsLive]     = useState(true);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Please sign in first."); setLoading(false); return; }

    const { data, error: err } = await supabase
      .from("classrooms")
      .insert({
        rabbi_id:         user.id,
        title:            title.trim(),
        description:      description.trim() || null,
        topic,
        is_live:          isLive,
        jitsi_room_name:  generateRoomName(title),
      })
      .select()
      .single();

    if (err) { setError(err.message); setLoading(false); return; }
    router.push(`/torah/${data.id}`);
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="mb-8">
        <p className="section-label mb-2">Torah Study</p>
        <h1 className="text-3xl font-serif text-cream-50">Create a Classroom</h1>
      </div>

      <form onSubmit={handleCreate} className="card space-y-5">
        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm text-slate-300 mb-1.5">Room Title *</label>
          <input className="input-field" placeholder="e.g. Parshat Bereshit — Deep Dive"
            value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1.5">Description</label>
          <textarea className="input-field resize-none h-24" placeholder="What will you cover today?"
            value={description} onChange={(e) => setDesc(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1.5">Topic</label>
          <select className="input-field" value={topic} onChange={(e) => setTopic(e.target.value)}>
            {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={isLive}
            onClick={() => setIsLive(!isLive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isLive ? "bg-gold-400" : "bg-navy-700"}`}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${isLive ? "translate-x-6" : "translate-x-1"}`} />
          </button>
          <span className="text-sm text-slate-300">Start as Live now</span>
        </div>

        <button type="submit" className="btn-gold w-full" disabled={loading}>
          {loading ? "Creating…" : "Create Room"}
        </button>
      </form>
    </div>
  );
}
