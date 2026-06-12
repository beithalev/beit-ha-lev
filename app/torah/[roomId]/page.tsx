import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import JitsiRoom from "@/components/torah/JitsiRoom";
import RoomSidebar from "@/components/torah/RoomSidebar";

interface Props { params: { roomId: string } }

export default async function RoomPage({ params }: Props) {
  const supabase = createClient();

  const { data: classroom } = await supabase
    .from("classrooms")
    .select("*, profiles(display_name)")
    .eq("id", params.roomId)
    .single();

  if (!classroom) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile }  = user
    ? await supabase.from("profiles").select("display_name").eq("id", user.id).single()
    : { data: null };

  const displayName = profile?.display_name ?? "Guest";

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden">
      {/* Video area */}
      <div className="flex-1 bg-navy-950 flex flex-col">
        {/* Room header */}
        <div className="px-5 py-3 border-b border-navy-700/50 flex items-center justify-between">
          <div>
            <h1 className="text-cream-50 font-semibold">{classroom.title}</h1>
            <p className="text-xs text-slate-400">
              {classroom.topic} · by {classroom.profiles?.display_name}
            </p>
          </div>
          {classroom.is_live && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              LIVE
            </span>
          )}
        </div>

        {/* Jitsi iframe */}
        <div className="flex-1">
          <JitsiRoom
            roomName={classroom.jitsi_room_name}
            displayName={displayName}
            subject={classroom.title}
          />
        </div>
      </div>

      {/* Chat / Sources sidebar */}
      <div className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-navy-700/50 flex flex-col bg-navy-900">
        <RoomSidebar
          classroomId={params.roomId}
          userId={user?.id ?? null}
          displayName={displayName}
        />
      </div>
    </div>
  );
}
