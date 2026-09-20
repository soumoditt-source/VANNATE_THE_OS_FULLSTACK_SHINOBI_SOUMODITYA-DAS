"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Send, CheckCircle2 } from "lucide-react";

export default function ReportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ trackingId: "", issue: "", details: "", contact: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate report submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        {!submitted ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <AlertTriangle size={24} color="#ef4444" />
              <h1 style={{ fontSize: 24, fontWeight: 800 }}>Report Misuse</h1>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
              Report suspected fraud, fake crisis reports, or donation misuse. Your report is encrypted and reviewed within 2 hours.
            </p>
            <div className="glass" style={{ padding: 28 }}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Tracking / Case ID</label>
                  <input className="input" required placeholder="e.g. VNT-DEMO01" value={form.trackingId}
                    onChange={e => setForm(f => ({ ...f, trackingId: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Issue Type</label>
                  <select className="input" required value={form.issue}
                    onChange={e => setForm(f => ({ ...f, issue: e.target.value }))}>
                    <option value="">Select issue…</option>
                    <option value="fake_crisis">Fake Crisis Report</option>
                    <option value="donation_misuse">Donation Misuse</option>
                    <option value="duplicate_report">Duplicate Submission</option>
                    <option value="fraudulent_ngo">Fraudulent NGO</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Details</label>
                  <textarea className="input" required rows={4} placeholder="Describe what you observed…"
                    value={form.details} onChange={e => setForm(f => ({ ...f, details: e.target.value }))}
                    style={{ resize: "vertical" }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Your Email (optional, for follow-up)</label>
                  <input className="input" type="email" placeholder="you@example.com" value={form.contact}
                    onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
                </div>
                <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: "center", background: "#ef4444", marginTop: 4 }}>
                  {loading ? "Submitting…" : <><Send size={15} /> Submit Report</>}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: "center" }}>
            <div className="glass" style={{ padding: 48 }}>
              <CheckCircle2 size={56} color="#10b981" style={{ marginBottom: 20 }} />
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Report Received</h2>
              <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                Your report has been encrypted and flagged for priority review. Case ID: <strong style={{ color: "var(--brand)" }}>RPT-{Date.now().toString(36).toUpperCase()}</strong>
              </p>
              <a href="/" className="btn-primary" style={{ display: "inline-flex", justifyContent: "center" }}>Back to Home</a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
