"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, MapPin, Camera, CheckCircle2, Navigation, Activity, ShieldAlert, Crosshair, Map, Leaf } from "lucide-react";
import Link from "next/link";

const F = motion.div;

export default function CrisisHub() {
  const [tab, setTab] = useState<"sos" | "hotspots">("sos");
  const [sosState, setSosState] = useState<"idle" | "camera" | "verifying" | "dispatching" | "success">("idle");
  const [scanProgress, setScanProgress] = useState(0);

  // Simulate AWS Rekognition scanning
  useEffect(() => {
    if (sosState === "verifying") {
      const interval = setInterval(() => {
        setScanProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setSosState("dispatching");
            return 100;
          }
          return p + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(interval);
    }
    if (sosState === "dispatching") {
      setTimeout(() => setSosState("success"), 2500);
    }
  }, [sosState]);

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", paddingBottom: 60 }}>
      {/* Dynamic Red Glow for SOS */}
      <div style={{ position: "fixed", top: "10%", left: "50%", transform: "translateX(-50%)", width: 800, height: 800, background: sosState !== "idle" ? "rgba(220, 38, 38, 0.15)" : "var(--brand-glow)", borderRadius: "50%", filter: "blur(150px)", pointerEvents: "none", zIndex: 0, transition: "background 1s ease" }} />

      <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: 900 }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 12 }}>
              <Activity color="var(--brand)" /> CivicLens Hub
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 15, marginTop: 4 }}>AI-Powered Civic Intelligence & Emergency Response</p>
          </div>
          <div style={{ display: "flex", gap: 8, background: "var(--surface)", padding: 6, borderRadius: 12, border: "1px solid var(--border)" }}>
            {(["sos", "hotspots"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "8px 16px", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer", border: "none",
                background: tab === t ? "rgba(255,255,255,0.1)" : "transparent", color: tab === t ? "#fff" : "var(--text-muted)", transition: "all 0.2s"
              }}>
                {t === "sos" ? "Hyper-Priority SOS" : "Civic Hotspots"}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {tab === "sos" && (
            <F key="sos" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              
              {sosState === "idle" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 20px", background: "rgba(20,22,30,0.4)", border: "1px solid rgba(220, 38, 38, 0.1)", borderRadius: 24, backdropFilter: "blur(12px)" }}>
                  <ShieldAlert size={48} color="#dc2626" style={{ marginBottom: 24 }} />
                  <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, textAlign: "center" }}>Life-Threatening Emergency?</h2>
                  <p style={{ color: "var(--text-muted)", textAlign: "center", maxWidth: 480, marginBottom: 36, lineHeight: 1.6 }}>
                    Triggering the CivicLens SOS will bypass normal municipal queues and simultaneously alert Police, Fire, and Medical agencies using live open-street telemetry.
                  </p>
                  
                  <button 
                    onClick={() => setSosState("camera")}
                    style={{
                      width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle at center, #ef4444 0%, #991b1b 100%)",
                      border: "8px solid rgba(239, 68, 68, 0.2)", color: "white", fontSize: 20, fontWeight: 800,
                      boxShadow: "0 0 60px rgba(220,38,38,0.4)", cursor: "pointer", transition: "transform 0.1s", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = "scale(0.95)"}
                    onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <Crosshair size={32} />
                    TRIGGER SOS
                  </button>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 24 }}>Powered by AWS IoT & API Gateway</p>
                </div>
              )}

              {sosState === "camera" && (
                <div className="glass" style={{ padding: 40, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 16, left: 16, background: "rgba(0,0,0,0.5)", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, background: "#ef4444", borderRadius: "50%", animation: "pulse 1s infinite" }} /> LIVE
                  </div>
                  
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Capture the Hazard</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>CivicLens requires visual evidence to prevent pranks.</p>
                  
                  {/* Simulated Camera Viewfinder */}
                  <div style={{ width: "100%", maxWidth: 400, height: 300, background: "#0a0c10", borderRadius: 16, border: "2px solid rgba(255,255,255,0.1)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: "url('https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=2000&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }}>
                    <div style={{ position: "absolute", inset: 20, border: "2px dashed rgba(255,255,255,0.4)", borderRadius: 12 }} />
                    <Camera size={48} color="rgba(255,255,255,0.5)" />
                  </div>

                  <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
                    <button onClick={() => setSosState("idle")} className="btn-primary" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}>Cancel</button>
                    <button onClick={() => setSosState("verifying")} className="btn-primary" style={{ background: "#ef4444" }}>Capture & Send</button>
                  </div>
                </div>
              )}

              {sosState === "verifying" && (
                <div className="glass" style={{ padding: 60, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  <Activity size={48} color="var(--brand)" style={{ marginBottom: 24, animation: "spin 2s linear infinite" }} />
                  <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Anti-Prank Verification</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 32, maxWidth: 400 }}>
                    AWS Rekognition AI is scanning the image authenticity to discard fake or fabricated inputs in real-time.
                  </p>
                  
                  <div style={{ width: "100%", maxWidth: 300, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, scanProgress)}%`, height: "100%", background: "var(--brand)", transition: "width 0.2s" }} />
                  </div>
                  <p style={{ fontSize: 12, color: "var(--brand)", marginTop: 12, fontWeight: 600 }}>{Math.floor(Math.min(100, scanProgress))}% Verified</p>
                </div>
              )}

              {sosState === "dispatching" && (
                <div className="glass" style={{ padding: 60, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", borderColor: "#ef4444" }}>
                  <Navigation size={48} color="#ef4444" style={{ marginBottom: 24, animation: "bounce 1s infinite" }} />
                  <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "#ef4444" }}>Zero-Latency Dispatch</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 16, maxWidth: 400 }}>
                    Image authenticated. Autonomous routing of live open-street telemetry to multiple agencies.
                  </p>
                  <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                    {["Police", "Fire", "Medical"].map(a => (
                      <div key={a} style={{ padding: "6px 12px", background: "rgba(239, 68, 68, 0.15)", borderRadius: 20, fontSize: 12, fontWeight: 600, color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                        {a} API Pinged
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sosState === "success" && (
                <div className="glass" style={{ padding: 40, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", background: "rgba(16, 185, 129, 0.05)", borderColor: "rgba(16, 185, 129, 0.2)" }}>
                  <div style={{ width: 80, height: 80, background: "rgba(16, 185, 129, 0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <CheckCircle2 size={40} color="#10b981" />
                  </div>
                  <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, color: "#10b981" }}>Help is on the way.</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 24, maxWidth: 460 }}>
                    Emergency services have received exact live telemetry. Estimated arrival: <strong style={{ color: "#fff" }}>4 Minutes</strong>.
                  </p>
                  
                  <div style={{ width: "100%", background: "rgba(0,0,0,0.3)", padding: 24, borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 32 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                      <div style={{ width: 40, height: 40, background: "rgba(16, 185, 129, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Leaf size={20} color="#10b981" />
                      </div>
                      <div style={{ textAlign: "left" }}>
                        <h4 style={{ fontSize: 16, fontWeight: 700, color: "#10b981", margin: 0 }}>Karma Rewarded</h4>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>You saved lives today.</p>
                      </div>
                    </div>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", margin: 0, textAlign: "left", lineHeight: 1.5 }}>
                      You earned <strong style={{ color: "#f59e0b" }}>+500 Karma Points</strong>. As a token of gratitude from the community, <strong>a tree is being planted in your name</strong> through our NGO partners.
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: 16 }}>
                    <Link href="/track" className="btn-primary" style={{ background: "#10b981", color: "#000" }}>Track Responders Live</Link>
                    <button onClick={() => setSosState("idle")} className="btn-primary" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}>Close</button>
                  </div>
                </div>
              )}
            </F>
          )}

          {tab === "hotspots" && (
            <F key="hotspots" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: 24, alignItems: "start" }}>
                
                {/* Simulated Map */}
                <div className="glass" style={{ height: 600, padding: 0, overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0c10" }}>
                  <Map size={48} color="rgba(255,255,255,0.1)" style={{ position: "absolute", zIndex: 0 }} />
                  
                  {/* Map Grid overlay to look techy */}
                  <div style={{ position: "absolute", inset: 0, backgroundSize: "40px 40px", backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)", zIndex: 0 }} />
                  
                  {/* Hotspots */}
                  <div style={{ position: "absolute", top: "30%", left: "40%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 40, height: 40, background: "rgba(239, 68, 68, 0.2)", border: "2px solid #ef4444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 2s infinite" }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>14</span>
                    </div>
                  </div>
                  <div style={{ position: "absolute", top: "60%", left: "65%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 30, height: 30, background: "rgba(245, 158, 11, 0.2)", border: "2px solid #f59e0b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>6</span>
                    </div>
                  </div>

                  <div style={{ position: "absolute", bottom: 16, right: 16, background: "rgba(0,0,0,0.6)", padding: "8px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, color: "var(--text-muted)", backdropFilter: "blur(8px)" }}>
                    Amazon Location Service
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div className="glass" style={{ padding: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Smart Clustering Active</h3>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                      145 complaints automatically grouped into 3 distinct operational hotspots using geo-spatial AWS queries.
                    </p>
                  </div>

                  {[
                    { title: "Live Electric Wire in Water", count: 14, type: "Critical", color: "#ef4444", loc: "Park Street, Sector 5" },
                    { title: "Fallen Tree blocking ambulance", count: 6, type: "High", color: "#f59e0b", loc: "Bypass Road, EM" },
                  ].map((h, i) => (
                    <div key={i} className="glass" style={{ padding: 16, borderLeft: `4px solid ${h.color}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{h.title}</h4>
                        <span style={{ background: `${h.color}20`, color: h.color, padding: "4px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                          {h.type}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={12} /> {h.loc}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}><strong>{h.count}</strong> clustered reports</span>
                        <button style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text)", padding: "4px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>View Detail</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </F>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
