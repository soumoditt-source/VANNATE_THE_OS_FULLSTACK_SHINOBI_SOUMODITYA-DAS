"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Phone, FileText, ShieldCheck, ChevronRight, CheckCircle } from "lucide-react";
import QRCode from "react-qr-code";

const CAUSES = [
  { id: "flood", name: "India Flood Relief 2025", category: "Disaster", raised: "₹2.3Cr", goal: "₹5Cr", pct: 46 },
  { id: "blood", name: "National Blood Bank Network", category: "Health", raised: "₹45L", goal: "₹1Cr", pct: 45 },
  { id: "child", name: "Child Education Mission", category: "Education", raised: "₹87L", goal: "₹2Cr", pct: 43 },
  { id: "drought", name: "Drought Relief — Vidarbha", category: "Disaster", raised: "₹1.1Cr", goal: "₹3Cr", pct: 37 },
];

const CAT_COLOR: Record<string, string> = { Disaster: "#ef4444", Health: "#8b5cf6", Education: "#10b981" };
const F = motion.div;

export default function DonatePage() {
  const [step, setStep] = useState(1);
  const [selectedCause, setSelectedCause] = useState<typeof CAUSES[0] | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", amount: "500" });
  const [donationId, setDonationId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `VNT-${Date.now().toString(36).toUpperCase()}`;
    setDonationId(id);
    setStep(3);
  };

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Heart size={20} color="var(--brand)" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>Make a Trusted Donation</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Blockchain-backed · 100% traceable to beneficiaries</p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", gap: 6, marginBottom: 36 }}>
          {["Choose Cause", "Your Details", "Trust QR"].map((label, i) => (
            <div key={label} style={{ flex: 1 }}>
              <div style={{ height: 3, borderRadius: 2, background: step > i ? "var(--brand)" : "rgba(255,255,255,0.1)", marginBottom: 6, transition: "background 0.3s" }} />
              <span style={{ fontSize: 11, color: step > i ? "var(--brand)" : "var(--text-muted)", fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <F key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {CAUSES.map(c => (
                  <button key={c.id} onClick={() => { setSelectedCause(c); setStep(2); }}
                    style={{ display: "block", width: "100%", padding: "20px 24px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, cursor: "pointer", textAlign: "left", color: "var(--text)", transition: "all 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)"; (e.currentTarget as HTMLElement).style.background = "var(--surface-hover)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.background = "var(--surface)"; }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <span className="badge" style={{ background: CAT_COLOR[c.category] + "20", color: CAT_COLOR[c.category], border: `1px solid ${CAT_COLOR[c.category]}40`, marginBottom: 8 }}>{c.category}</span>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{c.raised} raised of {c.goal}</div>
                      </div>
                      <ChevronRight size={18} color="var(--text-muted)" />
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, marginTop: 14 }}>
                      <div style={{ height: "100%", width: `${c.pct}%`, background: CAT_COLOR[c.category], borderRadius: 2 }} />
                    </div>
                  </button>
                ))}
              </div>
            </F>
          )}

          {step === 2 && (
            <F key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="glass" style={{ padding: 28 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Donating to: <span style={{ color: "var(--brand)" }}>{selectedCause?.name}</span></h2>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}><FileText size={14} /> Full Name</label>
                    <input className="input" placeholder="Ravi Kumar" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}><Phone size={14} /> Phone Number</label>
                    <input className="input" placeholder="+91 98765 43210" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, display: "block" }}>Amount (₹)</label>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      {["250", "500", "1000", "2500"].map(amt => (
                        <button key={amt} type="button" onClick={() => setForm(f => ({ ...f, amount: amt }))}
                          style={{ flex: 1, padding: "8px 4px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", background: form.amount === amt ? "var(--brand)" : "var(--surface)", border: `1px solid ${form.amount === amt ? "var(--brand)" : "var(--border)"}`, color: form.amount === amt ? "white" : "var(--text-muted)", transition: "all 0.2s" }}>
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                    <input className="input" type="number" placeholder="Custom amount" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
                    <button type="submit" className="btn-primary" style={{ flex: 2 }}>Generate Trust QR <ShieldCheck size={16} /></button>
                  </div>
                </form>
              </div>
            </F>
          )}

          {step === 3 && (
            <F key="s3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="glass" style={{ padding: 36, textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 24 }}>
                  <CheckCircle size={20} color="#10b981" />
                  <span style={{ fontWeight: 700, color: "#34d399" }}>Donation Confirmed</span>
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 28, position: "relative" }}>
                  <div style={{ padding: 16, background: "white", borderRadius: 16 }}>
                    <QRCode value={`https://vannate.app/track/${donationId}`} size={160} />
                  </div>
                  <div style={{ position: "absolute", bottom: -12, right: "calc(50% - 80px)", width: 36, height: 36, background: "var(--brand)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid var(--bg)" }}>
                    <ShieldCheck size={18} color="white" />
                  </div>
                </div>
                <div className="glass" style={{ padding: "12px 20px", display: "inline-block", marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>DONATION ID</div>
                  <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 800, color: "var(--brand)" }}>{donationId}</div>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 24 }}>Show this QR to the NGO or share the link to track your impact in real-time.</p>
                <a href={`/track/${donationId}`} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>Track My Impact →</a>
              </div>
            </F>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
