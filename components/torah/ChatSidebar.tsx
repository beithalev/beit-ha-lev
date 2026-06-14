"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { ChatMessage } from "@/types";

interface Props {
  classroomId: string;
  userId:      string | null;
  displayName: string;
}

export default function ChatSidebar({ classroomId, userId, displayName }: Props) {
  const supabase          = createClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText]         = useState("");
  const [sending, setSending]   = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);

  // Initial load
  useEffect(() => {
    supabase
      .from("classroom_messages")
      .select("*, profiles(display_name)")
      .eq("classroom_id", classroomId)
      .order("created_at", { ascending: true })
      .limit(200)
      .then(({ data }) => {
        if (data) setMessages(data as ChatMessage[]);
      });
  }, [classroomId, supabase]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`room-chat-${classroomId}`)
      .on(
        "postgres_changes",
        {
          event:  "INSERT",
          schema: "public",
          table:  "classroom_messages",
          filter: `classroom_id=eq.${classroomId}`,
        },
        async (payload) => {
          const msg = payload.new as ChatMessage;
          // Fetch sender name
          const { data: p } = await supabase
            .from("profile_public")
            .select("display_name")
            .eq("id", msg.user_id)
            .single();
          setMessages((prev) => [...prev, { ...msg, user: p ?? undefined }]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [classroomId, supabase]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !userId) return;
    setSending(true);
    await supabase.from("classroom_messages").insert({
      classroom_id: classroomId,
      user_id:      userId,
      content:      text.trim(),
    });
    setText("");
    setSending(false);
  }

  return (
    <>
      {/* Header */}
      <div className="px-4 py-3 border-b border-navy-700/50">
        <h2 className="text-base font-semibold text-cream-50">Live Chat</h2>
        <p className="text-sm text-slate-500">{messages.length} messages</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-slate-500 text-base text-center mt-10">
            No messages yet. Start the conversation!
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.user_id === userId ? "text-right" : ""}>
            <span className="text-sm text-gold-500 font-medium">
              {m.user_id === userId ? "You" : (m.user?.display_name ?? "Anonymous")}
            </span>
            <p
              className={`inline-block mt-0.5 px-3 py-1.5 rounded-xl text-base max-w-xs break-words ${
                m.user_id === userId
                  ? "bg-gold-400/20 text-cream-100"
                  : "bg-navy-700 text-cream-100"
              }`}
            >
              {m.content}
            </p>
            <div className="text-sm text-slate-600 mt-0.5">{formatDate(m.created_at)}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="px-4 py-3 border-t border-navy-700/50">
        {!userId && (
          <p className="text-xs text-slate-500 mb-2 text-center">
            <a href="/auth/login" className="text-gold-400 hover:underline">Sign in</a> to chat
          </p>
        )}
        <div className="flex gap-2">
          <input
            className="input-field flex-1 py-2"
            placeholder={userId ? "Say something…" : "Sign in to chat"}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!userId || sending}
            maxLength={2000}
          />
          <button
            type="submit"
            className="btn-gold px-3 py-2 shrink-0"
            disabled={!userId || !text.trim() || sending}
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </>
  );
}
