"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Heart, TrendingUp, ChevronRight, MapPin, Droplets, Bot, Globe as GlobeIcon } from "lucide-react";

// Use the 3D globe component
const Globe = dynamic(() => import("@/components/three/Globe"), { ssr: false, loading: () => <div style={{ width: "100%", height: "100%" }} /> });

const STATS = [
  { label: "Lives Impacted", value: "2.4M+", icon: Heart, color: "#ef4444" },
  { label: "Donations Tracked", value: "₹47Cr+", icon: TrendingUp, color: "#10b981" },
  { label: "NGOs Onboarded", value: "380+", icon: GlobeIcon, color: "#3b82f6" },
  { label: "Avg Response", value: "< 2hr", icon: Zap, color: "#f59e0b" },
];

const FEATURES = [
  {
    icon: ShieldCheck, color: "#3b82f6",
    title: "QR Trust Engine",
    desc: "Every rupee gets a tamper-proof QR code. Donors track their impact in real-time from wallet to beneficiary.",
    href: "/donate",
  },
  {
    icon: MapPin, color: "#ef4444",
    title: "Crisis Command Center",
    desc: "AI-ranked live disaster events from IoT sensors and field volunteer reports — updated every 60 seconds.",
    href: "/crisis",
  },
  {
    icon: Droplets, color: "#8b5cf6",
    title: "Blood Bank Network",
    desc: "Instantly locate donors, request blood, and coordinate hospital logistics — even offline in disaster zones.",
    href: "/blood",
  },
  {
    icon: Bot, color: "#10b981",
    title: "AI Copilot (AWS Bedrock)",
    desc: "Claude-powered relief coordinator that drafts appeals, summarizes crises, and guides NGO operations.",
    href: "/dashboard",
  },
];

const F = motion.div;

export default function HomePage() {
  return (
    <div style={{ paddingTop: 64 }}>

      {/* ── Hero ── */}
      <section style={{
        minHeight: "calc(100vh - 64px)", display: "grid",
        gridTemplateColumns: "1fr 1fr", gap: 0,
        maxWidth: 1400, margin: "0 auto", padding: "0 24px",
        alignItems: "center",
      }} className="hero-grid">
        {/* Left */}
        <F initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
          style={{ padding: "80px 0" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 14px", borderRadius: 999,
            background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)",
            fontSize: 12, fontWeight: 600, color: "#93c5fd", marginBottom: 28,
          }}>
            <Zap size={12} /> AWS Hackathon 2025 — Built for Humanity
          </div>

          <h1 style={{
            fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 900,
            lineHeight: 1.05, letterSpacing: "-0.03em",
            marginBottom: 24, color: "var(--text)",
          }}>
            Humanity&apos;s<br />
            <span className="gradient-text">Operating System</span>
          </h1>

          <p style={{ fontSize: 18, color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 480, marginBottom: 40 }}>
            Vannate makes every donation, blood request, and crisis response completely transparent and instant. Built on AWS. Trusted by humans.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/donate" className="btn-primary">
              Donate Now <ChevronRight size={16} />
            </Link>
            <Link href="/crisis" className="btn-ghost">
              View Crisis Hub <MapPin size={16} />
            </Link>
          </div>

          <div style={{ display: "flex", gap: 24, marginTop: 48, flexWrap: "wrap" }}>
            {["Blockchain-backed", "AWS Powered", "100% Transparent"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand)" }} />
                {t}
              </div>
            ))}
          </div>
        </F>

        {/* Right — Three.js Globe */}
        <F initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
          style={{ height: 600, position: "relative" }}>
          <Globe />
          {/* Floating badge */}
          <div className="glass float" style={{
            position: "absolute", bottom: 100, left: 24,
            padding: "12px 16px", display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", animation: "pulse-ring 2s infinite" }} />
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>LIVE</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>3 Active Crisis Events</div>
            </div>
          </div>
        </F>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: "80px 24px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
          {STATS.map((s, i) => (
            <F key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass" style={{ padding: "28px 24px", textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: s.color + "20", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <s.icon size={22} color={s.color} />
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.label}</div>
            </F>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section">
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <F initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16 }}>
              Every crisis tool in one system
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 17, maxWidth: 520, margin: "0 auto" }}>
              From the moment a disaster strikes to the last mile of aid delivery — Vannate has every step covered.
            </p>
          </F>
        </div>
        <div className="grid-3" style={{ gap: 20 }}>
          {FEATURES.map((f, i) => (
            <F key={f.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}>
              <Link href={f.href} style={{ textDecoration: "none", display: "block" }}>
                <div className="glass" style={{ padding: "32px 28px", height: "100%", transition: "border-color 0.2s", cursor: "pointer" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: f.color + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                    <f.icon size={24} color={f.color} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 20, color: f.color, fontSize: 13, fontWeight: 600 }}>
                    Explore <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            </F>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ padding: "0 24px 96px" }}>
        <F initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="glass-strong" style={{
            padding: "64px 48px", textAlign: "center", position: "relative", overflow: "hidden",
            background: "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.08) 100%)",
          }}>
            <div style={{ position: "absolute", top: "-60px", right: "-60px", width: 300, height: 300, borderRadius: "50%", background: "var(--brand-glow)", filter: "blur(80px)", pointerEvents: "none" }} />
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16 }}>
              Ready to make your donation matter?
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 16, marginBottom: 32 }}>
              Join 380+ NGOs and 2.4M+ beneficiaries on the most transparent humanitarian platform in India.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/donate" className="btn-primary">Start Donating</Link>
              <Link href="/login?mode=ngo" className="btn-ghost">Register Your NGO</Link>
            </div>
          </div>
        </F>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, background: "var(--brand)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={12} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Vannate</span>
            <span style={{ color: "var(--text-muted)", fontSize: 13 }}>— Humanity Above All</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>© 2025 Vannate Foundation · AWS Hackathon Submission</p>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
