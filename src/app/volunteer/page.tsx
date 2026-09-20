"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, MapPin, Clock, CheckCircle2, AlertTriangle, Radio, Users, Truck, Shield, Zap } from "lucide-react";

const F = motion.div;

const TASKS = [
  { id: "VF-001", title: "Distribute 200 food packets — Sector 7 Relief Camp", severity: "critical", distance: "1.2 km", deadline: "45 min", agency: "Flood Relief", accepted: false },
  { id: "VF-002", title: "Medical supply escort — AMRI Hospital to camp", severity: "high", distance: "3.8 km", deadline: "2 hrs", agency: "Health", accepted: false },
  { id: "VF-003", title: "Structural damage assessment — Block C, Salt Lake", severity: "medium", distance: "5.1 km", deadline: "4 hrs", agency: "Municipal", accepted: false },
];

const SEVERITY_COLOR: Record<string, string> = { critical: "#ef4444", high: "#f59e0b", medium: "#3b82f6" };

export default function VolunteerPage() {
  const [tasks, setTasks] = useState(TASKS);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [eta, setEta] = useState(100);

  useEffect(() => {
    if (activeTask) {
      const interval = setInterval(() => {
        setEta(p => (p > 0 ? p - 1 : 0));
      }, 300);
      return () => clearInterval(interval);
    }
  }, [activeTask]);

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" }}>

        <F initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Navigation size={20} color="#10b981" />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800 }}>Volunteer Field Dispatch</h1>
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Live task routing · GPS telemetry · Impact verified</p>
            </div>
          </div>
        </F>

        {/* Live Stats */}
        <F initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 28 }}>
            {[
              { label: "Active Volunteers", value: "37", icon: Users, color: "#10b981" },
              { label: "Open Tasks", value: "12", icon: Radio, color: "#ef4444" },
              { label: "Dispatched Today", value: "84", icon: Truck, color: "#3b82f6" },
              { label: "Avg Response", value: "11 min", icon: Clock, color: "#f59e0b" },
            ].map(s => (
              <div key={s.label} className="glass" style={{ padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <s.icon size={14} color={s.color} />
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.label}</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </F>

        <AnimatePresence mode="wait">
          {!activeTask ? (
            <F key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Radio size={16} color="#ef4444" /> Incoming Field Tasks
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {tasks.map((t, i) => (
                  <F key={t.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <div className="glass" style={{ padding: "20px 24px", borderLeft: `4px solid ${SEVERITY_COLOR[t.severity]}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-muted)" }}>{t.id}</span>
                            <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700, background: SEVERITY_COLOR[t.severity] + "20", color: SEVERITY_COLOR[t.severity], textTransform: "uppercase" }}>
                              {t.severity}
                            </span>
                          </div>
                          <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{t.title}</h3>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} /> {t.distance}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> Deadline: {t.deadline}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Shield size={12} /> {t.agency}</span>
                      </div>
                      <button onClick={() => setActiveTask(t.id)} className="btn-primary" style={{ background: "#10b981", fontSize: 13, padding: "8px 20px" }}>
                        Accept & Navigate <Navigation size={13} />
                      </button>
                    </div>
                  </F>
                ))}
              </div>
            </F>
          ) : (
            <F key="active" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="glass" style={{ padding: 32, textAlign: "center" }}>
                <div style={{ width: 80, height: 80, background: "rgba(16,185,129,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <Navigation size={36} color="#10b981" style={{ animation: "bounce 1.5s infinite" }} />
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>En Route to Task</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 24 }}>
                  Live GPS telemetry broadcasting to NGO Command Center via Amazon Location Service.
                </p>

                {/* Simulated Progress */}
                <div style={{ width: "100%", maxWidth: 400, margin: "0 auto 24px", height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${100 - eta}%`, height: "100%", background: "linear-gradient(90deg, #10b981, #3b82f6)", transition: "width 0.3s" }} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#10b981" }}>ETA: {Math.ceil(eta * 0.45)} min remaining</p>

                <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
                  <button onClick={() => { setActiveTask(null); setEta(100); }} className="btn-primary" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}>
                    Cancel
                  </button>
                  <button onClick={() => { setActiveTask(null); setEta(100); }} className="btn-primary" style={{ background: "#10b981", color: "#000" }}>
                    <CheckCircle2 size={15} /> Mark Delivered
                  </button>
                </div>
              </div>
            </F>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>
    </div>
  );
}
