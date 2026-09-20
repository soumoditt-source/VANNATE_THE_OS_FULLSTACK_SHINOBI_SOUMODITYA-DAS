"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// /track → redirect to a demo tracking ID so it never 404s
export default function TrackIndexPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/track/VNT-DEMO01");
  }, [router]);
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", flexDirection: "column", gap: 12,
    }}>
      <div style={{
        width: 40, height: 40, border: "3px solid var(--brand)",
        borderTopColor: "transparent", borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading tracker…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
