"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { MatchMessage } from "@/types";

interface Props {
  matchId:         string;
  initialMessages: MatchMessage[];
  userId:          string;
  displayName:     string;
}

export default function MatchChat({ matchId, initialMessages, userId, displayName }: Props) {
  const supabase    = createClient();
  const [msgs, setMsgs]   = useState<MatchMessage[]>(initialMessages);
  const [text, setText]   = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef           = useRef<HTMLDivElement>(null);

  // Realtime
  useEffect(() => {
    const ch = supabase
      .channel(`match-${matchId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "match_messages", filter: `match_id=eq.${matchId}` },
        async (payload) => {
          const msg = payload.new as MatchMessage;
          const { data: p } = await supabase.from("profiles").select("display_name").eq("id", msg.sender_id).single();
          setMsgs((prev) => [...prev, { ...msg, sender: p ?? undefined }]);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [matchId, supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    await supabase.from("match_messages").insert({
      match_id:  matchId,
      sender_id: userId,
      content:   text.trim(),
    });
    setText("");
    setSending(false);
  }

  return (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {msgs.length === 0 && (
          <div className="text-center text-slate-500 py-12">
            <p className="text-2xl mb-2">✉️</p>
            <p>You&apos;re connected! Say שלום.</p>
          </div>
        )}
        {msgs.map((m) => {
          const isMine = m.sender_id === userId;
          return (
            <div key={m.id} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
              <span className="text-xs text-slate-500 mb-1">
                {isMine ? "You" : (m.sender?.display_name ?? "Match")}
              </span>
              <div
                className={`max-w-xs md:max-w-sm px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMine
                    ? "bg-gold-400/20 text-cream-100 rounded-tr-sm"
                    : "bg-navy-700 text-cream-100 rounded-tl-sm"
                }`}
              >
                {m.content}
              </div>
              <span className="text-xs text-slate-600 mt-0.5">{formatDate(m.created_at)}</span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={send} className="px-4 py-3 border-t border-navy-700/50 flex gap-2">
        <input
          className="input-field flex-1 py-2.5"
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={sending}
          maxLength={2000}
        />
        <button type="submit" className="btn-gold px-3 shrink-0" disabled={!text.trim() || sending}>
          <Send size={16} />
        </button>
      </form>
    </>
  );
}
