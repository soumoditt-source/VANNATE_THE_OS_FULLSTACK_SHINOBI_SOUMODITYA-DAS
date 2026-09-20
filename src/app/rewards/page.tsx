"use client";
import { motion } from "framer-motion";
import { Leaf, TreePine, Award, Star, Heart, Droplets, Shield, TrendingUp, Gift, Zap } from "lucide-react";

const F = motion.div;

const BADGES = [
  { icon: Shield, name: "First Responder", desc: "Triggered 1st verified SOS report", color: "#ef4444", earned: true },
  { icon: Droplets, name: "Blood Hero", desc: "Donated blood 3+ times", color: "#8b5cf6", earned: true },
  { icon: Heart, name: "Generous Soul", desc: "Donated ₹5,000+ total", color: "#ec4899", earned: true },
  { icon: TreePine, name: "Green Guardian", desc: "5 trees planted in your name", color: "#10b981", earned: true },
  { icon: Star, name: "Community Star", desc: "Top 10% contributor this month", color: "#f59e0b", earned: false },
  { icon: Award, name: "Diamond Volunteer", desc: "100+ hours of field service", color: "#3b82f6", earned: false },
];

const IMPACT_TIMELINE = [
  { action: "Verified SOS: Live wire in water", points: 500, tree: true, time: "2 hours ago", color: "#ef4444" },
  { action: "Donated ₹1,000 to Flood Relief", points: 200, tree: false, time: "Yesterday", color: "#3b82f6" },
  { action: "Blood donation at AMRI Hospital", points: 350, tree: true, time: "3 days ago", color: "#8b5cf6" },
  { action: "Volunteered: 4hr food distribution", points: 400, tree: true, time: "1 week ago", color: "#10b981" },
];

export default function RewardsPage() {
  const totalKarma = 2450;
  const treesPlanted = 5;
  const level = Math.floor(totalKarma / 500) + 1;
  const levelProgress = (totalKarma % 500) / 500 * 100;

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 80px" }}>

        <F initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Award size={20} color="#f59e0b" />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800 }}>Karma & Impact</h1>
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Every good deed is tracked, rewarded, and made real</p>
            </div>
          </div>
        </F>

        {/* Hero Stats */}
        <F initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass" style={{ padding: 32, marginBottom: 24, background: "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(16,185,129,0.05) 100%)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(245,158,11,0.08)", filter: "blur(40px)" }} />
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, textAlign: "center", position: "relative" }}>
              <div>
                <div style={{ fontSize: 42, fontWeight: 900, color: "#f59e0b", letterSpacing: "-0.03em" }}>{totalKarma}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Karma Points</div>
              </div>
              <div>
                <div style={{ fontSize: 42, fontWeight: 900, color: "#10b981", letterSpacing: "-0.03em", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {treesPlanted} <TreePine size={28} />
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Trees Planted</div>
              </div>
              <div>
                <div style={{ fontSize: 42, fontWeight: 900, color: "#3b82f6", letterSpacing: "-0.03em" }}>Lv.{level}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Dharma Level</div>
              </div>
            </div>

            {/* Level Progress Bar */}
            <div style={{ marginTop: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
                <span>Level {level}</span>
                <span>{Math.floor(levelProgress)}% to Level {level + 1}</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${levelProgress}%`, height: "100%", background: "linear-gradient(90deg, #f59e0b, #10b981)", borderRadius: 3 }} />
              </div>
            </div>
          </div>
        </F>

        {/* Tree Planting Notification */}
        <F initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Leaf size={24} color="#10b981" />
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#10b981", margin: "0 0 4px 0" }}>🌳 Your latest tree was planted in Sundarbans, West Bengal</h4>
              <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>Partner NGO: Green Earth Foundation · GPS: 21.9497°N, 89.1833°E · Certificate available</p>
            </div>
          </div>
        </F>

        {/* Badges */}
        <F initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Achievement Badges</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
            {BADGES.map((b, i) => (
              <F key={b.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 + i * 0.06 }}>
                <div className="glass" style={{ padding: "18px 16px", opacity: b.earned ? 1 : 0.4, position: "relative" }}>
                  {!b.earned && <div style={{ position: "absolute", top: 8, right: 8, fontSize: 10, fontWeight: 700, color: "var(--text-muted)", background: "var(--surface)", padding: "2px 8px", borderRadius: 8 }}>LOCKED</div>}
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: b.color + "20", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                    <b.icon size={18} color={b.color} />
                  </div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, margin: 0 }}>{b.name}</h4>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{b.desc}</p>
                </div>
              </F>
            ))}
          </div>
        </F>

        {/* Impact Timeline */}
        <F initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Impact Timeline</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {IMPACT_TIMELINE.map((item, i) => (
              <F key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 + i * 0.08 }}>
                <div className="glass" style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{item.action}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.time}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {item.tree && <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><TreePine size={12} /> +1 Tree</span>}
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#f59e0b" }}>+{item.points}</span>
                  </div>
                </div>
              </F>
            ))}
          </div>
        </F>

        {/* Redeem Section */}
        <F initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <div className="glass" style={{ padding: 28, marginTop: 28, textAlign: "center", background: "linear-gradient(135deg, rgba(245,158,11,0.05), rgba(139,92,246,0.05))" }}>
            <Gift size={32} color="#f59e0b" style={{ margin: "0 auto 12px" }} />
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Redeem Karma Points</h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20, maxWidth: 400, margin: "0 auto 20px" }}>
              Exchange points for partner discounts, NGO certificates, government recognition letters, or plant more trees.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { label: "Plant a Tree (200 pts)", color: "#10b981" },
                { label: "NGO Certificate (500 pts)", color: "#3b82f6" },
                { label: "Govt Recognition (1000 pts)", color: "#8b5cf6" },
              ].map(r => (
                <button key={r.label} style={{ padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: r.color + "15", color: r.color, border: `1px solid ${r.color}30`, cursor: "pointer" }}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </F>
      </div>
    </div>
  );
}
