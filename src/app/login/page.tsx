"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, User, Lock, Mail, Building2, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const F = motion.div;

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "ngo">("signin");
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
      {/* Background glow */}
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, background: "var(--brand-glow)", borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none", opacity: 0.3 }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        <F initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ width: 52, height: 52, background: "var(--brand)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Zap size={26} color="white" />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6 }}>Welcome to Vannate</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>The AI-native humanitarian operating system</p>
          </div>

          {step === 1 && (
            <div style={{ display: "flex", gap: 6, marginBottom: 24, background: "var(--surface)", padding: 4, borderRadius: 12, border: "1px solid var(--border)" }}>
              {(["signin", "ngo"] as const).map(m => (
                <button key={m} onClick={() => setMode(m)} style={{
                  flex: 1, padding: "10px", borderRadius: 9, fontWeight: 600, fontSize: 13, cursor: "pointer", border: "none",
                  background: mode === m ? "rgba(59,130,246,0.2)" : "transparent",
                  color: mode === m ? "var(--brand-light)" : "var(--text-muted)",
                  transition: "all 0.2s",
                }}>{m === "signin" ? "Sign In" : "Register NGO"}</button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <F key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <div className="glass" style={{ padding: 28 }}>
                  <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {mode === "ngo" && (
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                          <Building2 size={13} /> NGO Name
                        </label>
                        <input className="input" required type="text" placeholder="Flood Relief Foundation" />
                      </div>
                    )}
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                        <Mail size={13} /> Email Address
                      </label>
                      <input className="input" required type="email" placeholder="you@example.com" />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                        <Lock size={13} /> Password
                      </label>
                      <input className="input" required type="password" placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: "center", marginTop: 4 }}>
                      {loading ? "Generating Security Code..." : "Continue"} <ChevronRight size={15} />
                    </button>
                  </form>
                </div>
              </F>
            ) : (
              <F key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <div className="glass" style={{ padding: 28, textAlign: "center" }}>
                  <div style={{ width: 48, height: 48, background: "rgba(59,130,246,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <CheckCircle2 size={24} color="var(--brand)" />
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Verify Identity</h2>
                  <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>Enter the 6-digit secure code sent to your email.</p>
                  
                  <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <input 
                      required 
                      type="text" 
                      placeholder="Enter 6-Digit OTP" 
                      maxLength={6} 
                      className="input" 
                      style={{ textAlign: "center", fontSize: 20, letterSpacing: 8, padding: 16 }}
                      value={otp} 
                      onChange={e => setOtp(e.target.value)} 
                    />
                    <button type="submit" disabled={loading || otp.length < 6} className="btn-primary" style={{ justifyContent: "center", marginTop: 4 }}>
                      {loading ? "Verifying..." : "Verify & Access System"}
                    </button>
                    <button type="button" onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, textDecoration: "underline" }}>
                      Wrong email? Go back
                    </button>
                  </form>
                </div>
              </F>
            )}
          </AnimatePresence>

          {step === 1 && (
            <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text-muted)" }}>
              Want to donate instead?{" "}
              <Link href="/donate" style={{ color: "var(--brand)", fontWeight: 600, textDecoration: "none" }}>Give now →</Link>
            </p>
          )}
        </F>
      </div>
    </div>
  );
}
