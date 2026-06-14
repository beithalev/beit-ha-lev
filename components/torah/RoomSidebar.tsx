"use client";
import { useState } from "react";
import { MessageSquare, BookOpen } from "lucide-react";
import ChatSidebar from "./ChatSidebar";
import SefariaPanel from "./SefariaPanel";

interface Props {
  classroomId: string;
  userId: string | null;
  displayName: string;
}

export default function RoomSidebar({ classroomId, userId, displayName }: Props) {
  const [tab, setTab] = useState<"chat" | "sources">("chat");

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-navy-700/50">
        <button
          onClick={() => setTab("chat")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
            tab === "chat" ? "text-gold-400 border-b-2 border-gold-400" : "text-slate-400 hover:text-cream-50"
          }`}
        >
          <MessageSquare size={14} /> Chat
        </button>
        <button
          onClick={() => setTab("sources")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
            tab === "sources" ? "text-gold-400 border-b-2 border-gold-400" : "text-slate-400 hover:text-cream-50"
          }`}
        >
          <BookOpen size={14} /> Sources
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {tab === "chat" ? (
          <ChatSidebar classroomId={classroomId} userId={userId} displayName={displayName} />
        ) : (
          <SefariaPanel />
        )}
      </div>
    </div>
  );
}
