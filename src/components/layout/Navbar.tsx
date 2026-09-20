"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Zap, ChevronDown, User, HeartHandshake, ShieldCheck } from "lucide-react";

type Mode = "citizen" | "volunteer" | "admin";

const MODES: Record<Mode, { label: string; icon: React.ReactNode; color: string; links: {href:string, label:string}[] }> = {
  citizen: {
    label: "Citizen / Donor",
    icon: <User size={14} />,
    color: "#3b82f6", // blue
    links: [
      { href: "/crisis", label: "Crisis Hub" },
      { href: "/blood", label: "Blood Bank" },
      { href: "/donate", label: "Donate" },
      { href: "/rewards", label: "Karma & Trees" },
      { href: "/community", label: "Community" },
    ]
  },
  volunteer: {
    label: "Volunteer Field",
    icon: <HeartHandshake size={14} />,
    color: "#10b981", // green
    links: [
      { href: "/volunteer", label: "Field Tasks" },
      { href: "/crisis", label: "Crisis Map" },
      { href: "/verify", label: "AI Scanner" },
      { href: "/portal", label: "My Impact" },
    ]
  },
  admin: {
    label: "NGO Admin",
    icon: <ShieldCheck size={14} />,
    color: "#f59e0b", // amber
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/analytics", label: "Analytics" },
      { href: "/crm", label: "CRM" },
      { href: "/verify", label: "Verification" },
    ]
  }
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("citizen");
  const [modeOpen, setModeOpen] = useState(false);

  const activeMode = MODES[mode];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(3,4,10,0.85)", backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: 64,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 30, height: 30, background: activeMode.color, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s" }}>
              <Zap size={16} color="white" />
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)", letterSpacing: "-0.02em" }}>
              Vannate
            </span>
          </Link>

          {/* Desktop Links based on Mode */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="desktop-nav">
            {activeMode.links.map(l => (
              <Link key={l.href} href={l.href} style={{
                padding: "8px 16px", color: "var(--text-muted)", fontSize: 14, fontWeight: 500,
                textDecoration: "none", borderRadius: 8, transition: "all 0.2s",
              }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = "var(--text)"; (e.target as HTMLElement).style.background = "var(--surface)"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = "var(--text-muted)"; (e.target as HTMLElement).style.background = "transparent"; }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side: Mode Switcher & Auth */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }} className="desktop-nav">
          
          <div style={{ position: "relative" }}>
            <button 
              onClick={() => setModeOpen(!modeOpen)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "var(--surface)", border: "1px solid rgba(255,255,255,0.1)",
                padding: "8px 14px", borderRadius: 20, color: "var(--text)",
                fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
              }}
            >
              <span style={{ color: activeMode.color }}>{activeMode.icon}</span>
              {activeMode.label}
              <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
            </button>

            {modeOpen && (
              <div style={{
                position: "absolute", top: "120%", right: 0, width: 180,
                background: "rgba(10,12,20,0.95)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
                padding: 6, display: "flex", flexDirection: "column", gap: 4,
                boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
              }}>
                {(Object.entries(MODES) as [Mode, typeof activeMode][]).map(([k, v]) => (
                  <button key={k} onClick={() => { setMode(k); setModeOpen(false); }} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 12px", background: mode === k ? "rgba(255,255,255,0.05)" : "transparent",
                    border: "none", borderRadius: 8, color: "var(--text)", cursor: "pointer",
                    fontSize: 13, fontWeight: 500, textAlign: "left"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = mode === k ? "rgba(255,255,255,0.05)" : "transparent"}
                  >
                    <span style={{ color: v.color }}>{v.icon}</span>
                    {v.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href="/login" className="btn-primary" style={{ padding: "8px 20px", fontSize: 14 }}>Sign In</Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)", display: "none" }} className="mobile-toggle">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 99,
          background: "rgba(3,4,10,0.97)", backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "16px 24px", display: "flex", flexDirection: "column", gap: 8,
        }}>
          <div style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: 8, display: "flex", gap: 8, overflowX: "auto" }}>
            {(Object.entries(MODES) as [Mode, typeof activeMode][]).map(([k, v]) => (
              <button key={k} onClick={() => setMode(k)} style={{
                padding: "8px 12px", background: mode === k ? v.color : "var(--surface)",
                border: "none", borderRadius: 8, color: mode === k ? "#000" : "var(--text)",
                fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0
              }}>
                {v.label}
              </button>
            ))}
          </div>
          {activeMode.links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              padding: "12px 16px", color: "var(--text)", fontSize: 15, fontWeight: 500,
              textDecoration: "none", borderRadius: 8, background: "var(--surface)",
            }}>{l.label}</Link>
          ))}
          <Link href="/login" className="btn-primary" onClick={() => setOpen(false)}>Sign In</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </>
  );
}

