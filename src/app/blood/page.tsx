"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Droplets, MapPin, Phone, User, CheckCircle, AlertTriangle, Clock, ChevronRight } from "lucide-react";

const DONORS = [
  { id: "d1", name: "Arjun M.", group: "O-", dist: "1.2 km", last: "84 days ago", available: true },
  { id: "d2", name: "Priya S.", group: "O+", dist: "2.1 km", last: "120 days ago", available: true },
  { id: "d3", name: "Ravi K.", group: "AB+", dist: "3.4 km", last: "45 days ago", available: false },
  { id: "d4", name: "Meera D.", group: "B-", dist: "4.0 km", last: "92 days ago", available: true },
];
const GROUP_COLOR: Record<string, string> = {
  "O-": "#ef4444", "O+": "#f59e0b", "AB+": "#3b82f6", "B-": "#8b5cf6", "A+": "#10b981", "B+": "#ec4899",
};
const F = motion.div;

export default function BloodPage() {
  const [mode, setMode] = useState<"find" | "request">("find");
  const [requested, setRequested] = useState(false);
  const [form, setForm] = useState({ group: "O-", units: "2", hospital: "", phone: "" });

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" }}>

        <F initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Droplets size={20} color="#ef4444" />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800 }}>Smart Blood Bank</h1>
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Geo-matched donors · Rare group priority · Designed for India's 1M-unit gap</p>
            </div>
          </div>
        </F>

        {/* Stats bar */}
        <F initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 28 }}>
            {[
              { label: "Eligible Donors", value: "2,847", color: "#10b981" },
              { label: "Requests Today", value: "34", color: "#f59e0b" },
              { label: "Matched in <8min", value: "91%", color: "#3b82f6" },
              { label: "Units Available", value: "1,240", color: "#8b5cf6" },
            ].map(s => (
              <div key={s.label} className="glass" style={{ padding: "16px 18px" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </F>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {(["find", "request"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              padding: "10px 24px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer",
              background: mode === m ? "var(--brand)" : "var(--surface)",
              border: `1px solid ${mode === m ? "var(--brand)" : "var(--border)"}`,
              color: mode === m ? "white" : "var(--text-muted)", transition: "all 0.2s",
            }}>{m === "find" ? "Find Donors" : "Request Blood"}</button>
          ))}
        </div>

        {mode === "find" && (
          <F initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {DONORS.map((d, i) => (
              <F key={d.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <div className="glass" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: (GROUP_COLOR[d.group] || "#3b82f6") + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontWeight: 800, fontSize: 15, color: GROUP_COLOR[d.group] || "#3b82f6" }}>{d.group}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                      {d.name}
                      {d.available
                        ? <span className="badge badge-success">Available</span>
                        : <span className="badge badge-warning">Cooldown</span>}
                    </div>
                    <div style={{ display: "flex", gap: 16, marginTop: 4, fontSize: 12, color: "var(--text-muted)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}><MapPin size={11} /> {d.dist}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={11} /> Last donated {d.last}</span>
                    </div>
                  </div>
                  {d.available && (
                    <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 13 }}>
                      <Phone size={13} /> Contact
                    </button>
                  )}
                </div>
              </F>
            ))}
          </F>
        )}

        {mode === "request" && !requested && (
          <F initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass" style={{ padding: 28 }}>
              <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Emergency Blood Request</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, display: "block" }}>Blood Group Needed</label>
                  <select className="input" value={form.group} onChange={e => setForm(f => ({ ...f, group: e.target.value }))}>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, display: "block" }}>Units Required</label>
                  <input className="input" type="number" min="1" max="10" value={form.units} onChange={e => setForm(f => ({ ...f, units: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, display: "block" }}>Hospital Name</label>
                  <input className="input" placeholder="e.g. AMRI Hospital, Kolkata" value={form.hospital} onChange={e => setForm(f => ({ ...f, hospital: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, display: "block" }}>Contact Number</label>
                  <input className="input" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <button className="btn-primary" style={{ justifyContent: "center" }} onClick={() => setRequested(true)}>
                  <AlertTriangle size={15} /> Send Emergency Request
                </button>
              </div>
            </div>
          </F>
        )}

        {mode === "request" && requested && (
          <F initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="glass" style={{ padding: 36, textAlign: "center" }}>
              <CheckCircle size={48} color="#10b981" style={{ margin: "0 auto 16px" }} />
              <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 8 }}>Request Sent!</h2>
              <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
                Pinging <strong style={{ color: "var(--text)" }}>47 eligible {form.group} donors</strong> within 6 km.<br />
                Expected first confirmation: <strong style={{ color: "#10b981" }}>≤ 8 minutes</strong>
              </p>
              <div className="glass" style={{ padding: "16px 24px", display: "inline-block" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Request ID</div>
                <div style={{ fontFamily: "monospace", fontWeight: 800, color: "var(--brand)", fontSize: 18 }}>
                  BLD-{Date.now().toString(36).toUpperCase().slice(-6)}
                </div>
              </div>
            </div>
          </F>
        )}
      </div>
    </div>
  );
}
