"use client";
import { motion } from "framer-motion";
import { BarChart2, Users, Package, Clock, CheckCircle, AlertTriangle, TrendingUp, FileText, Zap } from "lucide-react";

const STATS = [
  { label: "Trust Score (VTS)", value: "842/1000", icon: TrendingUp, color: "#10b981", sub: "↑ 23 pts this month" },
  { label: "Active Donations", value: "124", icon: Package, color: "#3b82f6", sub: "18 awaiting handoff" },
  { label: "Volunteers", value: "37", icon: Users, color: "#8b5cf6", sub: "12 deployed today" },
  { label: "Hours Saved/Wk", value: "17 hrs", icon: Clock, color: "#f59e0b", sub: "vs. manual ops" },
];

const TASKS = [
  { id: 1, label: "Q3 Impact Report draft", status: "ready", agent: "Vanna AI" },
  { id: 2, label: "FCRA filing — FY2025", status: "review", agent: "Compliance Agent" },
  { id: 3, label: "Donor outreach — Diwali campaign", status: "draft", agent: "Vanna AI" },
  { id: 4, label: "Volunteer skill verification", status: "pending", agent: "Volunteer Agent" },
];

const DONATIONS = [
  { id: "VNT-A3F2X", cause: "Flood Relief", amount: "₹500", status: "delivered", time: "2h ago" },
  { id: "VNT-B9K1M", cause: "Child Education", amount: "₹1,000", status: "in-transit", time: "5h ago" },
  { id: "VNT-C2L8P", cause: "Blood Bank", amount: "₹250", status: "confirmed", time: "1d ago" },
];

const STATUS_BADGE: Record<string, string> = {
  ready: "badge-success", review: "badge-warning", draft: "badge-brand", pending: "badge-warning",
  delivered: "badge-success", "in-transit": "badge-warning", confirmed: "badge-brand",
};
const F = motion.div;

export default function DashboardPage() {
  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        <F initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BarChart2 size={20} color="var(--brand)" />
              </div>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800 }}>NGO Command Center</h1>
                <p style={{ color: "var(--text-muted)", fontSize: 13 }}>NGO 108 · Kolkata · Powered by Vanna AI + AWS Bedrock</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#34d399" }}>All systems operational</span>
            </div>
          </div>
        </F>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
          {STATS.map((s, i) => (
            <F key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="glass" style={{ padding: "22px 22px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: s.color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <s.icon size={18} color={s.color} />
                  </div>
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: s.color, marginTop: 6 }}>{s.sub}</div>
              </div>
            </F>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="dash-grid">
          {/* Vanna Tasks */}
          <F initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <div className="glass" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <Zap size={16} color="#f59e0b" />
                <h2 style={{ fontWeight: 700, fontSize: 16 }}>Vanna AI Task Queue</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {TASKS.map(t => (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border)" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{t.label}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.agent}</div>
                    </div>
                    <span className={`badge ${STATUS_BADGE[t.status]}`}>{t.status}</span>
                  </div>
                ))}
              </div>
              <button className="btn-ghost" style={{ width: "100%", marginTop: 14, justifyContent: "center", fontSize: 13 }}>
                <FileText size={14} /> Generate New Draft
              </button>
            </div>
          </F>

          {/* Recent donations */}
          <F initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <div className="glass" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <Package size={16} color="var(--brand)" />
                <h2 style={{ fontWeight: 700, fontSize: 16 }}>Recent Donations</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {DONATIONS.map(d => (
                  <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border)" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{d.cause}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{d.id} · {d.time}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{d.amount}</div>
                      <span className={`badge ${STATUS_BADGE[d.status]}`}>{d.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </F>
        </div>

        {/* Trust Score bar */}
        <F initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <div className="glass" style={{ padding: 24, marginTop: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle size={16} color="#10b981" />
                <h2 style={{ fontWeight: 700, fontSize: 16 }}>Vannate Trust Score (VTS)</h2>
              </div>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#10b981" }}>842 / 1000</span>
            </div>
            <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "84.2%", background: "linear-gradient(90deg, #10b981, #3b82f6)", borderRadius: 4, transition: "width 1s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 11, color: "var(--text-muted)" }}>
              {["Govt Registration", "Activity Score", "Beneficiary Confirmations", "Media Proof", "Reviews", "Anomaly Flag: None"].map(l => (
                <span key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <CheckCircle size={10} color="#10b981" /> {l}
                </span>
              ))}
            </div>
          </div>
        </F>
      </div>
      <style>{`.dash-grid { @media (max-width: 768px) { grid-template-columns: 1fr; } }`}</style>
    </div>
  );
}
