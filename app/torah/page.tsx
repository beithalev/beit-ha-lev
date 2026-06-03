import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { BookOpen, Plus, Radio, Users } from "lucide-react";
import type { Classroom } from "@/types";

export const revalidate = 30;

export default async function TorahPage() {
  const supabase = createClient();

  const { data: classrooms } = await supabase
    .from("classroom_list")
    .select("*")
    .order("is_live", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  const live    = (classrooms ?? []).filter((c: Classroom) => c.is_live);
  const upcoming = (classrooms ?? []).filter((c: Classroom) => !c.is_live);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <p className="section-label mb-2">Torah Study</p>
          <h1 className="text-4xl font-serif text-cream-50">
            Live Classrooms
          </h1>
          <p className="text-slate-400 mt-2 max-w-xl">
            Join a rabbi-led session, ask questions on camera, and learn with
            fellow Jews from around the world.
          </p>
        </div>
        <Link href="/torah/create" className="btn-gold shrink-0">
          <Plus size={16} /> Create Room
        </Link>
      </div>

      {/* Live now */}
      {live.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Radio size={16} className="text-red-400 animate-pulse" />
            <h2 className="text-lg font-semibold text-cream-50">Live Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {live.map((c: Classroom & { rabbi_name: string; rabbi_title?: string }) => (
              <ClassroomCard key={c.id} classroom={c} isLive />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming / recent */}
      <section>
        <h2 className="text-lg font-semibold text-cream-50 mb-4">
          {live.length > 0 ? "Other Rooms" : "All Rooms"}
        </h2>
        {upcoming.length === 0 && live.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <BookOpen size={36} className="mx-auto mb-3 opacity-40" />
            <p>No classrooms yet. Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {upcoming.map((c: Classroom & { rabbi_name: string; rabbi_title?: string }) => (
              <ClassroomCard key={c.id} classroom={c} isLive={false} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ── Inline card (server component) ──────────────────────────────────────────
function ClassroomCard({
  classroom: c,
  isLive,
}: {
  classroom: Classroom & { rabbi_name: string; rabbi_title?: string; message_count?: number };
  isLive: boolean;
}) {
  return (
    <Link href={`/torah/${c.id}`} className="card block group hover:scale-[1.01] transition-transform">
      <div className="flex items-start justify-between mb-3">
        <span className="section-label">{c.topic ?? "General"}</span>
        {isLive && (
          <span className="flex items-center gap-1 text-xs text-red-400 font-medium">
            <Radio size={12} className="animate-pulse" /> LIVE
          </span>
        )}
      </div>
      <h3 className="text-cream-50 font-semibold text-lg leading-snug mb-1 group-hover:text-gold-400 transition-colors">
        {c.title}
      </h3>
      {c.description && (
        <p className="text-slate-400 text-sm line-clamp-2 mb-4">{c.description}</p>
      )}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {c.rabbi_title ? `${c.rabbi_title} ` : ""}
          {c.rabbi_name}
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} /> {c.participant_count ?? 0}
        </span>
      </div>
    </Link>
  );
}
