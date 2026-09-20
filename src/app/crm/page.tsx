"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Mail, Phone, MapPin, Star, Filter, ChevronRight, Building2, Award } from "lucide-react";

const F = motion.div;

const CONTACTS = [
  { name: "Kolkata Municipal Corp.", type: "Government", email: "kmc@gov.in", phone: "+91 33-2286-1000", area: "Kolkata", score: 95, status: "active" },
  { name: "Red Cross Society — WB", type: "NGO Partner", email: "wb@redcross.org", phone: "+91 33-2248-5678", area: "West Bengal", score: 88, status: "active" },
  { name: "AMRI Hospital Dhakuria", type: "Hospital", email: "emergency@amri.in", phone: "+91 33-6606-3636", area: "South Kolkata", score: 92, status: "active" },
  { name: "WB Fire & Emergency", type: "Emergency", email: "fire@wbgov.in", phone: "101", area: "West Bengal", score: 97, status: "active" },
  { name: "Green Earth Foundation", type: "NGO Partner", email: "info@greenearth.org", phone: "+91 98765-43210", area: "Sundarbans", score: 78, status: "pending" },
];

const TYPE_COLOR: Record<string, string> = { Government: "#3b82f6", "NGO Partner": "#10b981", Hospital: "#8b5cf6", Emergency: "#ef4444" };

export default function CRMPage() {
  const [search, setSearch] = useState("");
  const filtered = CONTACTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.type.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 80px" }}>

        <F initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={20} color="#3b82f6" />
              </div>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800 }}>Agency CRM</h1>
                <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Multi-agency coordination · Emergency dispatch contacts</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {Object.entries(TYPE_COLOR).map(([t, c]) => (
                <span key={t} style={{ padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: c + "15", color: c }}>{t}</span>
              ))}
            </div>
          </div>
        </F>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 24 }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input className="input" placeholder="Search agencies, hospitals, NGOs..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
        </div>

        {/* Contact Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((c, i) => (
            <F key={c.name} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
              <div className="glass" style={{ padding: "18px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: TYPE_COLOR[c.type] + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Building2 size={22} color={TYPE_COLOR[c.type]} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{c.name}</h3>
                    <span style={{ padding: "2px 8px", borderRadius: 8, fontSize: 10, fontWeight: 700, background: TYPE_COLOR[c.type] + "15", color: TYPE_COLOR[c.type] }}>{c.type}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text-muted)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Mail size={10} /> {c.email}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Phone size={10} /> {c.phone}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={10} /> {c.area}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                    <Star size={12} color="#f59e0b" />
                    <span style={{ fontSize: 16, fontWeight: 800, color: "#f59e0b" }}>{c.score}</span>
                  </div>
                  <span style={{ fontSize: 10, color: c.status === "active" ? "#10b981" : "#f59e0b", fontWeight: 700, textTransform: "uppercase" }}>{c.status}</span>
                </div>
              </div>
            </F>
          ))}
        </div>
      </div>
    </div>
  );
}
