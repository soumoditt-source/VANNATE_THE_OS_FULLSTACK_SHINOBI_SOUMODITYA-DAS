"use client";
import { motion } from "framer-motion";
import { User, Heart, Droplets, Shield, TreePine, Award, TrendingUp, MapPin, Clock, ChevronRight, Leaf } from "lucide-react";
import Link from "next/link";

const F = motion.div;

export default function PortalPage() {
  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Profile Header */}
        <F initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass" style={{ padding: 32, marginBottom: 24, display: "flex", alignItems: "center", gap: 24, background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.05))" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, color: "#fff", flexShrink: 0 }}>
              SD
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Soumoditya Das</h1>
              <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 8 }}>Volunteer · Donor · First Responder</p>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>Dharma Level 6</span>
                <span style={{ padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: "rgba(16,185,129,0.1)", color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}><TreePine size={10} /> 5 Trees</span>
              </div>
            </div>
            <Link href="/rewards" style={{ textDecoration: "none" }}>
              <div style={{ padding: "8px 16px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)", fontSize: 13, fontWeight: 600, color: "var(--text)", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <Award size={14} color="#f59e0b" /> View Karma
              </div>
            </Link>
          </div>
        </F>

        {/* Impact Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Total Donations", value: "₹12,500", icon: Heart, color: "#ef4444" },
            { label: "Blood Donations", value: "3", icon: Droplets, color: "#8b5cf6" },
            { label: "SOS Reports", value: "7", icon: Shield, color: "#f59e0b" },
            { label: "Volunteer Hours", value: "48 hrs", icon: Clock, color: "#10b981" },
          ].map((s, i) => (
            <F key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
              <div className="glass" style={{ padding: "18px 18px" }}>
                <s.icon size={18} color={s.color} style={{ marginBottom: 10 }} />
                <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.02em" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
              </div>
            </F>
          ))}
        </div>

        {/* Recent Activity */}
        <F initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="glass" style={{ padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Recent Activity</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { action: "Triggered SOS — Live wire report verified", time: "2 hours ago", karma: 500, color: "#ef4444" },
                { action: "Donated ₹1,000 to Flood Relief", time: "Yesterday", karma: 200, color: "#3b82f6" },
                { action: "Blood donation at AMRI Hospital", time: "3 days ago", karma: 350, color: "#8b5cf6" },
                { action: "4-hour food distribution volunteer shift", time: "1 week ago", karma: 400, color: "#10b981" },
              ].map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{a.action}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{a.time}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#f59e0b" }}>+{a.karma}</span>
                </div>
              ))}
            </div>
          </div>
        </F>

        {/* Quick Actions */}
        <F initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Quick Actions</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Report Emergency", href: "/crisis", color: "#ef4444", icon: Shield },
              { label: "Donate Now", href: "/donate", color: "#3b82f6", icon: Heart },
              { label: "Find Blood Donor", href: "/blood", color: "#8b5cf6", icon: Droplets },
              { label: "View Rewards", href: "/rewards", color: "#f59e0b", icon: Award },
            ].map(a => (
              <Link key={a.label} href={a.href} style={{ textDecoration: "none" }}>
                <div className="glass" style={{ padding: "18px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: a.color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <a.icon size={18} color={a.color} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{a.label}</span>
                  <ChevronRight size={14} color="var(--text-muted)" style={{ marginLeft: "auto" }} />
                </div>
              </Link>
            ))}
          </div>
        </F>
      </div>
    </div>
  );
}
