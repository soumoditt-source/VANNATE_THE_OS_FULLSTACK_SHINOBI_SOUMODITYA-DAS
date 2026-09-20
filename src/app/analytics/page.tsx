"use client";
import { motion } from "framer-motion";
import { BarChart2, TrendingUp, MapPin, Users, AlertTriangle, Clock, Activity, Eye } from "lucide-react";

const F = motion.div;

const HOTSPOT_DATA = [
  { area: "Park Street, Sector 5", reports: 47, severity: "Critical", type: "Waterlogging + Live Wire", color: "#ef4444" },
  { area: "Bypass Road, EM", reports: 23, severity: "High", type: "Fallen Trees", color: "#f59e0b" },
  { area: "Salt Lake, Block C", reports: 18, severity: "Medium", type: "Road Damage", color: "#3b82f6" },
  { area: "Howrah Bridge Approach", reports: 12, severity: "Low", type: "Garbage Accumulation", color: "#10b981" },
];

export default function AnalyticsPage() {
  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>

        <F initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(139,92,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BarChart2 size={20} color="#8b5cf6" />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800 }}>Civic Analytics Engine</h1>
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>AI-powered heatmaps · Sentiment analysis · Priority scoring</p>
            </div>
          </div>
        </F>

        {/* KPI Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Total Reports", value: "1,847", change: "+12%", icon: Activity, color: "#8b5cf6" },
            { label: "Avg Resolution", value: "2.3 hrs", change: "-18%", icon: Clock, color: "#10b981" },
            { label: "Active Hotspots", value: "14", change: "+3", icon: MapPin, color: "#ef4444" },
            { label: "Citizens Engaged", value: "4,291", change: "+340", icon: Users, color: "#3b82f6" },
          ].map((s, i) => (
            <F key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="glass" style={{ padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <s.icon size={18} color={s.color} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: s.change.startsWith("-") ? "#10b981" : "#f59e0b" }}>{s.change}</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
              </div>
            </F>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }} className="dash-grid">
          {/* Chart Area - Simulated Bar Chart */}
          <F initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="glass" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
                <TrendingUp size={16} color="#8b5cf6" /> Weekly Report Volume
              </h2>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 200 }}>
                {[65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                  <F key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.4 + i * 0.08, duration: 0.6 }}
                    style={{ flex: 1, background: `linear-gradient(to top, #8b5cf620, #8b5cf6${Math.floor(h * 0.8).toString(16)})`, borderRadius: "6px 6px 0 0", border: "1px solid rgba(139,92,246,0.2)", position: "relative" }}>
                    <span style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", fontSize: 10, fontWeight: 700, color: "#8b5cf6" }}>{Math.floor(h * 2.1)}</span>
                  </F>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                  <span key={d} style={{ fontSize: 10, color: "var(--text-muted)", flex: 1, textAlign: "center" }}>{d}</span>
                ))}
              </div>
            </div>
          </F>

          {/* Severity Distribution */}
          <F initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <div className="glass" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <AlertTriangle size={16} color="#f59e0b" /> Severity Distribution
              </h2>
              {[
                { label: "Critical", count: 47, pct: 25, color: "#ef4444" },
                { label: "High", count: 68, pct: 37, color: "#f59e0b" },
                { label: "Medium", count: 42, pct: 23, color: "#3b82f6" },
                { label: "Low", count: 28, pct: 15, color: "#10b981" },
              ].map(s => (
                <div key={s.label} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, color: s.color }}>{s.label}</span>
                    <span style={{ color: "var(--text-muted)" }}>{s.count} ({s.pct}%)</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                    <F initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ delay: 0.5, duration: 0.8 }}
                      style={{ height: "100%", background: s.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </F>
        </div>

        {/* Hotspot Table */}
        <F initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <div className="glass" style={{ padding: 24, marginTop: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Eye size={16} color="#ef4444" /> Active Civic Hotspots (AI-Clustered)
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Location", "Reports", "Severity", "Issue Type", "Action"].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HOTSPOT_DATA.map((h, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <td style={{ padding: "12px", fontWeight: 600 }}>{h.area}</td>
                      <td style={{ padding: "12px", fontWeight: 800, color: h.color }}>{h.reports}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700, background: h.color + "20", color: h.color }}>{h.severity}</span>
                      </td>
                      <td style={{ padding: "12px", color: "var(--text-muted)" }}>{h.type}</td>
                      <td style={{ padding: "12px" }}>
                        <button style={{ padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", cursor: "pointer" }}>Dispatch</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </F>
      </div>
      <style>{`.dash-grid { @media (max-width: 768px) { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
