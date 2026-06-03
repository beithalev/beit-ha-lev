"use client";
import { useEffect, useRef } from "react";

interface Props {
  roomName:    string;
  displayName: string;
  subject:     string;
}

// Jitsi Meet External API types (minimal)
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    JitsiMeetExternalAPI: any;
  }
}

export default function JitsiRoom({ roomName, displayName, subject }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load Jitsi script dynamically
    const script = document.createElement("script");
    script.src   = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => {
      if (!window.JitsiMeetExternalAPI || !containerRef.current) return;
      apiRef.current = new window.JitsiMeetExternalAPI("meet.jit.si", {
        roomName,
        parentNode: containerRef.current,
        width:      "100%",
        height:     "100%",
        userInfo: { displayName },
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: true,
          subject,
          // Branding
          defaultLocalDisplayName: displayName,
          toolbarButtons: [
            "microphone", "camera", "closedcaptions", "desktop",
            "participants-pane", "chat", "raisehand",
            "tileview", "hangup",
          ],
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK:    false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_ALWAYS_VISIBLE: false,
          MOBILE_APP_PROMO:       false,
        },
      });
    };
    document.head.appendChild(script);

    return () => {
      apiRef.current?.dispose();
      document.head.removeChild(script);
    };
  }, [roomName, displayName, subject]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: "400px" }}
    />
  );
}
