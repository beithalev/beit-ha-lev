"use client";
import { useEffect, useRef } from "react";

interface Props {
  roomName:    string;
  displayName: string;
  subject:     string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DailyIframe: any;
  }
}

export default function DailyRoom({ roomName, displayName }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const callRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const domain = process.env.NEXT_PUBLIC_DAILY_DOMAIN;
    if (!domain) return;

    let cancelled = false;
    let script: HTMLScriptElement | null = null;

    fetch("/api/daily-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName }),
    })
      .catch(() => {})
      .finally(() => {
        if (cancelled || !containerRef.current) return;

        script = document.createElement("script");
        script.src   = "https://unpkg.com/@daily-co/daily-js";
        script.async = true;
        script.onload = () => {
          if (!window.DailyIframe || !containerRef.current) return;
          callRef.current = window.DailyIframe.createFrame(containerRef.current, {
            url: `https://${domain}.daily.co/${roomName}`,
            userName: displayName,
            showLeaveButton: true,
            iframeStyle: {
              width:  "100%",
              height: "100%",
              border: "0",
            },
          });
          callRef.current.join();
        };
        document.head.appendChild(script);
      });

    return () => {
      cancelled = true;
      callRef.current?.destroy();
      if (script) document.head.removeChild(script);
    };
  }, [roomName, displayName]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: "400px" }}
    />
  );
}
