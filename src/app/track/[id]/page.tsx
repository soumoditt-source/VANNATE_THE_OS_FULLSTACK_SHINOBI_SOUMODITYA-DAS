"use client";
import { motion } from "framer-motion";
import { CheckCircle, Package, MapPin, User, AlertTriangle, ShieldCheck } from "lucide-react";
import QRCode from "react-qr-code";

const STEPS = [
  { icon: ShieldCheck, label: "Donation Confirmed", detail: "Trust token issued · Payment verified on ledger", time: "10:32 AM", done: true, color: "#10b981" },
  { icon: Package, label: "NGO Accepted", detail: "NGO 108 received ₹500 · Volunteer auto-dispatched", time: "11:05 AM", done: true, color: "#3b82f6" },
  { icon: MapPin, label: "In Transit", detail: "Package VN-108-7F2A en-route · 4.6 km · ETA 23 min", time: "11:28 AM", done: true, color: "#8b5cf6" },
  { icon: User, label: "Beneficiary Handoff", detail: "Awaiting QR scan + photo confirmation from field volunteer", time: "—", done: false, color: "#f59e0b" },
  { icon: CheckCircle, label: "Impact Report", detail: "Vanna AI will auto-generate your impact note with citations", time: "—", done: false, color: "#6b7280" },
];
const F = motion.div;

export default function TrackPage({ params }: { params: { id: string } }) {
  const id = params.id || "VNT-DEMO01";
  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 80px" }}>
        <F initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Donation Tracker</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <span style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 700, color: "var(--brand)" }}>{id}</span>
            <span className="badge badge-success">Live Tracking</span>
          </div>
        </F>

        <F initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="glass" style={{ padding: "18px 24px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
            {[{ label: "Amount", value: "₹500" }, { label: "Cause", value: "Flood Relief" }, { label: "Progress", value: "3 / 5 steps" }].map(i => (
              <div key={i.label}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>{i.label}</div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{i.value}</div>
              </div>
            ))}
          </div>
        </F>

        <F initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="glass" style={{ padding: 28, marginBottom: 18 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 24 }}>Live Impact Trail</h2>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 19, top: 0, bottom: 0, width: 2, background: "var(--border)" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {STEPS.map((s, i) => (
                  <F key={s.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.12 }}>
                    <div style={{ display: "flex", gap: 16, paddingBottom: i < STEPS.length - 1 ? 24 : 0 }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, background: s.done ? s.color + "20" : "var(--surface)", border: `2px solid ${s.done ? s.color : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
                        <s.icon size={17} color={s.done ? s.color : "var(--text-muted)"} />
                      </div>
                      <div style={{ paddingTop: 8 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: s.done ? "var(--text)" : "var(--text-muted)" }}>{s.label}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3, lineHeight: 1.5 }}>{s.detail}</div>
                        <div style={{ fontSize: 11, color: s.done ? s.color : "var(--text-muted)", marginTop: 5, fontWeight: 600 }}>{s.time}</div>
                      </div>
                    </div>
                  </F>
                ))}
              </div>
            </div>
          </div>
        </F>

        <F initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <div className="glass" style={{ padding: 24, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ padding: 12, background: "white", borderRadius: 12, flexShrink: 0 }}>
              <QRCode value={`https://vannate.app/track/${id}`} size={80} />
            </div>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Share Your Impact</h3>
              <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>Anyone with this QR can verify your donation independently. Every checkpoint is immutable.</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                <AlertTriangle size={12} color="var(--text-muted)" />
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>See something wrong? <a href="/report" style={{ color: "var(--brand)", textDecoration: "none", fontWeight: 600 }}>Report misuse</a></span>
              </div>
            </div>
          </div>
        </F>
      </div>
    </div>
  );
}
