"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  FileText,
  AlertTriangle,
  Send,
  UploadCloud,
  Cpu,
  FileSearch,
  Loader2,
  CheckCircle2,
  Activity,
  CloudRain,
  ExternalLink,
  ShieldCheck,
  QrCode,
  Download,
  Plus,
  Search,
  Filter,
  Hash,
  MapPin,
  Clock,
  Users,
  Package,
  TrendingUp,
  Zap,
  Award,
  Lock,
  DollarSign,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Shield,
  Printer,
  ChevronRight
} from "lucide-react";

const F = motion.div;

// Initial Cryptographic Digital Logbook entries (replaces physical paper register)
interface LogEntry {
  id: string;
  category: "INCIDENT" | "RATION" | "EXPENSE" | "AUDIT";
  title: string;
  officer: string;
  location: string;
  timestamp: string;
  hash: string;
  status: "SEALED & IMMUTABLE" | "PENDING_SIG";
  details: string;
}

const INITIAL_LOGS: LogEntry[] = [
  {
    id: "LOG-2026-0941",
    category: "RATION",
    title: "Dispatched 450 Emergency Food Kits to Ward 14 Flood Shelter",
    officer: "Officer R. Banerjee (Field Lead)",
    location: "South Kolkata Relief Depot (22.5126° N, 88.3639° E)",
    timestamp: "2026-09-20 17:42:10 IST",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    status: "SEALED & IMMUTABLE",
    details: "All kits sealed with QR codes. Verified beneficiary thumbprints: 450/450. Zero spoilage."
  },
  {
    id: "LOG-2026-0940",
    category: "INCIDENT",
    title: "Multi-Agency SOS Clearance: Structural Wall Collapse",
    officer: "Disaster Cell Dispatcher A. Roy",
    location: "Behala Crossing Depot (22.4988° N, 88.3120° E)",
    timestamp: "2026-09-20 16:15:32 IST",
    hash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    status: "SEALED & IMMUTABLE",
    details: "Routed to Fire Unit #4 and 3 nearest civilian first-responders. Evacuated 14 citizens safely."
  },
  {
    id: "LOG-2026-0939",
    category: "AUDIT",
    title: "FCRA & NGO Darpan Compliance Seal (Govt Ref: WB/2024/039821)",
    officer: "CA S. Mukherjee (Auditor)",
    location: "Headquarters Compliance Vault",
    timestamp: "2026-09-20 14:00:00 IST",
    hash: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    status: "SEALED & IMMUTABLE",
    details: "Quarterly utilization certificate verified. Zero non-conformance flags. 100% matched with bank statements."
  },
  {
    id: "LOG-2026-0938",
    category: "EXPENSE",
    title: "Direct Fuel & Oxygen Tank Replenishment for 4 Mobile Clinics",
    officer: "Treasurer P. Sen",
    location: "Howrah Logistics Base (22.5958° N, 88.2636° E)",
    timestamp: "2026-09-20 11:24:45 IST",
    hash: "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
    status: "SEALED & IMMUTABLE",
    details: "₹48,200 voucher approved against GST Invoice #GST-HOW-8821. Replaced paper cash voucher register."
  }
];

// Inventory items replacing manual stock books
interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  minThreshold: number;
  lastUpdated: string;
  location: string;
}

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: "INV-801", name: "High-Calorie Disaster Ration Kits", category: "Nutrition", currentStock: 1450, unit: "boxes", minThreshold: 500, lastUpdated: "12m ago", location: "Warehouse A-2" },
  { id: "INV-802", name: "Emergency Trauma & Burn First-Aid Kits", category: "Medical", currentStock: 340, unit: "kits", minThreshold: 100, lastUpdated: "1h ago", location: "Medical Vault" },
  { id: "INV-803", name: "Heavy-Duty Disaster Tarpaulin Tents", category: "Shelter", currentStock: 280, unit: "units", minThreshold: 75, lastUpdated: "3h ago", location: "Warehouse B-1" },
  { id: "INV-804", name: "Chlorine Water Purification Tablets", category: "Sanitation", currentStock: 12500, unit: "tabs", minThreshold: 3000, lastUpdated: "5h ago", location: "Sanitation Bay" },
  { id: "INV-805", name: "Thermal Wool Blankets", category: "Relief", currentStock: 620, unit: "pcs", minThreshold: 200, lastUpdated: "Just now", location: "Warehouse A-1" },
  { id: "INV-806", name: "O-Negative Emergency Blood Units", category: "Blood Bank", currentStock: 8, unit: "units", minThreshold: 15, lastUpdated: "20m ago", location: "Cold Storage #1" }
];

// Volunteer Roster replacing muster rolls
const VOLUNTEER_ROSTER = [
  { name: "Ananya Sharma", role: "Triage Medic", zone: "Ward 14 Flood Zone", checkIn: "08:15 IST", status: "Active in Field", hoursMonth: 46, karma: 1240 },
  { name: "Rahul Mukherjee", role: "Heavy Logistics Driver", zone: "Howrah Supply Depot", checkIn: "09:00 IST", status: "Active in Field", hoursMonth: 62, karma: 1680 },
  { name: "Pooja Das", role: "Beneficiary Biometrics Lead", zone: "Salt Lake Camp 3", checkIn: "10:30 IST", status: "Active in Field", hoursMonth: 38, karma: 990 },
  { name: "Vikram Sengupta", role: "Drone Aerial Recon", zone: "Riverbank Sector 9", checkIn: "12:00 IST", status: "Active in Field", hoursMonth: 54, karma: 1420 },
  { name: "Sneha Roy", role: "Tele-Health Counselor", zone: "Remote Command HQ", checkIn: "13:15 IST", status: "Online", hoursMonth: 29, karma: 810 }
];

// Donations with 80G capability
const DONATIONS_DATA = [
  { id: "VNT-80G-9021", donorName: "Aarav Mehta", pan: "ABCDE1234F", amount: 25000, date: "2026-09-20", cause: "Sundarbans Flood Emergency", taxExempt: "80G (50% Exemption)" },
  { id: "VNT-80G-9022", donorName: "Priyanka Nambiar", pan: "BNMPK9876Z", amount: 10000, date: "2026-09-19", cause: "Medical Trauma Van Replenishment", taxExempt: "80G (50% Exemption)" },
  { id: "VNT-80G-9023", donorName: "Tata Community Trust", pan: "AAACT0921E", amount: 500000, date: "2026-09-18", cause: "Institutional CSR Grant - Clean Water", taxExempt: "CSR 135 Compliant" },
  { id: "VNT-80G-9024", donorName: "Debabrata Sen", pan: "DEFGH5678J", amount: 5000, date: "2026-09-18", cause: "Emergency Blood Donor Logistics", taxExempt: "80G (50% Exemption)" }
];

export default function NgoManagementSystem() {
  const [activeTab, setActiveTab] = useState<"overview" | "logbook" | "inventory" | "roster" | "80g" | "ai" | "saas">("overview");

  // Logbook state
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [newLogCategory, setNewLogCategory] = useState<LogEntry["category"]>("INCIDENT");
  const [newLogTitle, setNewLogTitle] = useState("");
  const [newLogLocation, setNewLogLocation] = useState("Kolkata Emergency Zone 1");
  const [newLogOfficer, setNewLogOfficer] = useState("Officer S. Das (HQ Admin)");
  const [newLogDetails, setNewLogDetails] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [selectedLogForVerification, setSelectedLogForVerification] = useState<LogEntry | null>(null);

  // Inventory state
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [stockFilter, setStockFilter] = useState("all");

  // 80G Certificate Modal State
  const [selected80G, setSelected80G] = useState<typeof DONATIONS_DATA[0] | null>(null);

  // AI Document Engine State
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedData, setParsedData] = useState<{ name: string; size: string; textSnippet: string; wordCount: number; complianceScore: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add Log Entry (replaces paper log register)
  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogTitle.trim()) return;

    // Generate simulated SHA-256 hash
    const fakeHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const newEntry: LogEntry = {
      id: `LOG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newLogCategory,
      title: newLogTitle,
      officer: newLogOfficer,
      location: newLogLocation,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19) + " IST",
      hash: fakeHash,
      status: "SEALED & IMMUTABLE",
      details: newLogDetails || "Standard field report recorded and cryptographically sealed on the Vannate Ledger."
    };

    setLogs([newEntry, ...logs]);
    setNewLogTitle("");
    setNewLogDetails("");
  };

  // Handle Inventory Restock / Dispatch
  const handleStockAdjust = (id: string, delta: number) => {
    setInventory(items =>
      items.map(item => {
        if (item.id === id) {
          const updated = Math.max(0, item.currentStock + delta);
          return { ...item, currentStock: updated, lastUpdated: "Just now" };
        }
        return item;
      })
    );
  };

  // AI Document Upload Engine
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadProgress(0);
    setParsedData(null);

    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 90) clearInterval(interval);
        return p + 15;
      });
    }, 150);

    const reader = new FileReader();
    reader.onload = event => {
      const text = (event.target?.result as string) || "";
      const snippet = text.substring(0, 400) + (text.length > 400 ? "..." : "");
      const words = text ? text.split(/\s+/).length : Math.floor(file.size / 8);

      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
        setParsedData({
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
          textSnippet: snippet || "[Document Binary Scanned: Verified Govt Seal, 80G Exemption Audit, FCRA Annual Log]",
          wordCount: words || 1420,
          complianceScore: 98.4
        });
        setIsProcessing(false);
      }, 1800);
    };

    if (file.type.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".csv") || file.name.endsWith(".json")) {
      reader.readAsText(file);
    } else {
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
        setParsedData({
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
          textSnippet: `[AWS Bedrock OCR Extraction]: Document ${file.name} successfully parsed. Extracted 80G Certificate, Bank Audits, and FCRA Schedule III verification stamps. Zero discrepancies detected against Govt Darpan Registry.`,
          wordCount: Math.floor(file.size / 12) + 2100,
          complianceScore: 99.1
        });
        setIsProcessing(false);
      }, 1800);
    }
  };

  const filteredLogs = logs.filter(
    l =>
      l.title.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.officer.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.category.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.id.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "40px 24px 100px" }}>

        {/* ── Enterprise Header ── */}
        <F initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(16,185,129,0.15))", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(59,130,246,0.3)" }}>
                <Building2 size={28} color="var(--brand)" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em" }}>Vannate NGO Internal Management OS</h1>
                  <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 800, background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>
                    INSTITUTIONAL LICENSE v2.4
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>
                  All-in-One Paperless NGO Operating System · Replaces Physical Registers, Logbooks & Excel Sheets · Darpan ID: <strong>WB/2024/039821</strong>
                </p>
              </div>
            </div>

            {/* Quick Actions & Revenue Value Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ padding: "8px 16px", borderRadius: 10, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Admin Hours Saved</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#f59e0b" }}>42 hrs / week</div>
              </div>
              <button
                onClick={() => setActiveTab("saas")}
                className="btn-primary"
                style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, padding: "10px 18px", borderRadius: 10 }}
              >
                <Sparkles size={15} /> SaaS Revenue Model
              </button>
            </div>
          </div>
        </F>

        {/* ── High-Impact Metrics Grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 28 }}>
          {[
            { label: "VTS Trust Index", value: "842 / 1000", sub: "Top 2% in Bharat", icon: TrendingUp, color: "#10b981" },
            { label: "Cryptographic Logs", value: `${logs.length + 148}`, sub: "100% SHA-256 Sealed", icon: Lock, color: "#3b82f6" },
            { label: "Relief Inventory Value", value: "₹28.4 Lakh", sub: "14,800+ units tracked", icon: Package, color: "#8b5cf6" },
            { label: "80G Tax Exemption Filed", value: "₹5,40,000", sub: "1-Click PDF Generation", icon: DollarSign, color: "#f59e0b" },
            { label: "Active Field Volunteers", value: "37 Deployed", sub: "GPS Geofence Verified", icon: Users, color: "#06b6d4" },
          ].map((m, i) => (
            <F key={m.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="glass" style={{ padding: "20px 20px", position: "relative", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: m.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <m.icon size={18} color={m.color} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: m.color, background: m.color + "15", padding: "2px 8px", borderRadius: 8 }}>Active</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.02em" }}>{m.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{m.label}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6, fontWeight: 600 }}>{m.sub}</div>
              </div>
            </F>
          ))}
        </div>

        {/* ── Enterprise Tab Navigation Bar ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, borderBottom: "1px solid var(--border)", paddingBottom: 12, overflowX: "auto" }}>
          {[
            { id: "overview", label: "Overview & VTS Score", icon: Activity },
            { id: "logbook", label: "Cryptographic Logbook", icon: Lock, badge: "Replaces Paper" },
            { id: "inventory", label: "Aid Stock & Inventory", icon: Package, badge: "Live" },
            { id: "roster", label: "Volunteer Attendance", icon: Users, badge: "GPS Geofenced" },
            { id: "80g", label: "80G Receipts & Ledger", icon: FileText, badge: "Tax Ready" },
            { id: "ai", label: "AI Document Engine", icon: Cpu, badge: "FCRA / Audit" },
            { id: "saas", label: "SaaS Revenue Prospect", icon: DollarSign, badge: "Monetization" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 10,
                border: activeTab === tab.id ? "1px solid var(--brand)" : "1px solid transparent",
                background: activeTab === tab.id ? "rgba(59,130,246,0.15)" : "var(--surface)",
                color: activeTab === tab.id ? "#fff" : "var(--text-muted)",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s"
              }}
            >
              <tab.icon size={16} color={activeTab === tab.id ? "var(--brand)" : "var(--text-muted)"} />
              {tab.label}
              {tab.badge && (
                <span
                  style={{
                    fontSize: 9,
                    padding: "2px 6px",
                    borderRadius: 6,
                    background: activeTab === tab.id ? "var(--brand)" : "rgba(255,255,255,0.08)",
                    color: "#fff",
                    fontWeight: 800
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 1: OVERVIEW & TRUST ENGINE */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>

              {/* VTS Score Deep Breakdown */}
              <div className="glass" style={{ padding: 28 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <ShieldCheck size={22} color="#10b981" />
                    <div>
                      <h2 style={{ fontSize: 18, fontWeight: 800 }}>Vannate Trust Score (VTS) Diagnostic</h2>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Automated Government & Public Verification Pipeline</p>
                    </div>
                  </div>
                  <span style={{ fontSize: 26, fontWeight: 900, color: "#10b981" }}>842 <span style={{ fontSize: 14, color: "var(--text-muted)" }}>/ 1000</span></span>
                </div>

                <div style={{ height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 5, overflow: "hidden", marginBottom: 20 }}>
                  <div style={{ height: "100%", width: "84.2%", background: "linear-gradient(90deg, #10b981, #3b82f6)", borderRadius: 5 }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {[
                    { title: "NGO Darpan Govt Seal", status: "Verified (WB/2024)", pts: "+200", color: "#10b981" },
                    { title: "FCRA Foreign Contribution", status: "Schedule III Active", pts: "+180", color: "#10b981" },
                    { title: "80G / 12A Tax Status", status: "Valid until 2028", pts: "+190", color: "#10b981" },
                    { title: "Beneficiary Biometric Match", status: "98.8% GPS Verified", pts: "+150", color: "#10b981" },
                    { title: "Realtime Ledger Audit", status: "Zero Hash Collisions", pts: "+122", color: "#3b82f6" },
                    { title: "Community Grievance Flag", status: "0 Active Flags", pts: "Clean", color: "#10b981" },
                  ].map(v => (
                    <div key={v.title} style={{ padding: "12px 14px", background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 700 }}>{v.title}</span>
                        <span style={{ fontSize: 11, fontWeight: 800, color: v.color }}>{v.pts}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{v.status}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What This System Replaces in Physical NGO */}
              <div className="glass" style={{ padding: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <Zap size={20} color="#f59e0b" />
                  <h2 style={{ fontSize: 18, fontWeight: 800 }}>Physical Works Replaced Entirely</h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { old: "Paper Shift Register & Daily Incident Diary", new: "Cryptographic SHA-256 Sealed Digital Logbook", saved: "Save 12 hrs/wk" },
                    { old: "Manual Warehouse Stock Ledger & Bin Cards", new: "Real-time Barcode & Geocoded Inventory Vault", saved: "Zero Theft/Leakage" },
                    { old: "Paper Carbon 80G Receipt Books & Postal Delay", new: "Instant PDF 80G Tax Receipts via Email & WhatsApp", saved: "Save ₹80k/yr in courier" },
                    { old: "Paper Muster Roll for Field Volunteers", new: "GPS Geofenced Biometric Shift Check-In", saved: "No Ghost Volunteers" },
                    { old: "Year-End Panic for CA / FCRA Audit Compilation", new: "1-Click Immutable Audit Package for Govt Inspectors", saved: "100% Clean Audit" },
                  ].map((r, idx) => (
                    <div key={idx} style={{ padding: "12px 14px", background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: "#ef4444", textDecoration: "line-through" }}>❌ {r.old}</span>
                        <span style={{ fontSize: 10, fontWeight: 800, color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "2px 6px", borderRadius: 6 }}>{r.saved}</span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#34d399" }}>⚡ {r.new}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 2: CRYPTOGRAPHIC LOGBOOK (REPLACES PAPER REGISTERS) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "logbook" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Action Bar & Quick Form */}
            <div className="glass" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Lock size={20} color="var(--brand)" />
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 800 }}>New Immutable Log Entry</h2>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Permanently records incident notes, aid distribution, or financial vouchers with SHA-256 seal.</p>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                  <ShieldCheck size={14} color="#10b981" /> Tamper-Proof Cryptographic Vault Active
                </div>
              </div>

              <form onSubmit={handleCreateLog} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 12 }}>
                  <select
                    value={newLogCategory}
                    onChange={e => setNewLogCategory(e.target.value as any)}
                    className="input"
                    style={{ fontSize: 13 }}
                  >
                    <option value="INCIDENT">Incident / Emergency Response</option>
                    <option value="RATION">Ration & Relief Distribution</option>
                    <option value="EXPENSE">Expense / Financial Voucher</option>
                    <option value="AUDIT">Govt / CA Compliance Audit</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Entry Title (e.g., Dispatched 200 water cans to Camp 4)..."
                    value={newLogTitle}
                    onChange={e => setNewLogTitle(e.target.value)}
                    className="input"
                    style={{ fontSize: 13 }}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Field Officer Name"
                    value={newLogOfficer}
                    onChange={e => setNewLogOfficer(e.target.value)}
                    className="input"
                    style={{ fontSize: 13 }}
                    required
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 12 }}>
                  <input
                    type="text"
                    placeholder="Detailed Notes, Beneficiary counts, or Voucher number..."
                    value={newLogDetails}
                    onChange={e => setNewLogDetails(e.target.value)}
                    className="input"
                    style={{ fontSize: 13 }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      placeholder="GPS / Location Tag"
                      value={newLogLocation}
                      onChange={e => setNewLogLocation(e.target.value)}
                      className="input"
                      style={{ fontSize: 13, flex: 1 }}
                    />
                    <button type="submit" className="btn-primary" style={{ padding: "0 20px", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                      <Lock size={14} /> Seal Entry
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Log Entries List */}
            <div className="glass" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <FileText size={18} color="#3b82f6" />
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Official Digital Master Logbook ({filteredLogs.length} Entries)</h3>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ position: "relative" }}>
                    <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                      type="text"
                      placeholder="Search logbook..."
                      value={logSearch}
                      onChange={e => setLogSearch(e.target.value)}
                      className="input"
                      style={{ paddingLeft: 34, fontSize: 12, height: 36, width: 220 }}
                    />
                  </div>
                  <button
                    onClick={() => alert("Audit Package Exported: Downloaded 152 SHA-256 cryptographically sealed entries in CSV & PDF format for Govt Inspector.")}
                    className="btn-ghost"
                    style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <Download size={14} /> Export Audit Log
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filteredLogs.map(log => (
                  <div
                    key={log.id}
                    style={{
                      padding: "16px 20px",
                      background: "var(--surface)",
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: 6,
                            fontSize: 10,
                            fontWeight: 800,
                            background:
                              log.category === "INCIDENT"
                                ? "rgba(239,68,68,0.15)"
                                : log.category === "RATION"
                                ? "rgba(16,185,129,0.15)"
                                : log.category === "EXPENSE"
                                ? "rgba(245,158,11,0.15)"
                                : "rgba(139,92,246,0.15)",
                            color:
                              log.category === "INCIDENT"
                                ? "#ef4444"
                                : log.category === "RATION"
                                ? "#10b981"
                                : log.category === "EXPENSE"
                                ? "#f59e0b"
                                : "#8b5cf6"
                          }}
                        >
                          {log.category}
                        </span>
                        <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{log.title}</h4>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{log.timestamp}</span>
                        <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: "rgba(16,185,129,0.1)", color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
                          <ShieldCheck size={11} /> {log.status}
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                      {log.details}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10, flexWrap: "wrap", gap: 8 }}>
                      <div style={{ display: "flex", gap: 16, fontSize: 11, color: "var(--text-muted)" }}>
                        <span>👤 {log.officer}</span>
                        <span>📍 {log.location}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "monospace" }}>
                          SHA-256: {log.hash.substring(0, 16)}...{log.hash.substring(48)}
                        </span>
                        <button
                          onClick={() => setSelectedLogForVerification(log)}
                          style={{
                            padding: "4px 8px",
                            borderRadius: 6,
                            background: "rgba(59,130,246,0.1)",
                            border: "1px solid rgba(59,130,246,0.3)",
                            fontSize: 10,
                            fontWeight: 700,
                            color: "var(--brand)",
                            cursor: "pointer"
                          }}
                        >
                          Verify Seal
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 3: INVENTORY & RELIEF WAREHOUSE VAULT */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "inventory" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="glass" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800 }}>Relief Stock Vault (Replaces Paper Bin Cards)</h2>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Live stock level monitoring with threshold warnings & QR dispatch tracking.</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => {
                      const name = prompt("Enter new item name:");
                      if (!name) return;
                      const newItem: InventoryItem = {
                        id: `INV-${Math.floor(800 + Math.random() * 100)}`,
                        name,
                        category: "Relief Supplies",
                        currentStock: 100,
                        unit: "units",
                        minThreshold: 25,
                        lastUpdated: "Just now",
                        location: "Main Bay"
                      };
                      setInventory([newItem, ...inventory]);
                    }}
                    className="btn-primary"
                    style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <Plus size={14} /> Add Stock Item
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
                {inventory.map(item => {
                  const isLow = item.currentStock <= item.minThreshold;
                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: "18px 20px",
                        background: "var(--surface)",
                        borderRadius: 12,
                        border: isLow ? "1px solid rgba(239,68,68,0.4)" : "1px solid var(--border)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <span style={{ fontSize: 10, fontWeight: 800, color: "var(--text-muted)" }}>{item.id} · {item.category}</span>
                          <h4 style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{item.name}</h4>
                        </div>
                        {isLow && (
                          <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 800, background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>
                            LOW STOCK
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <div>
                          <span style={{ fontSize: 28, fontWeight: 900, color: isLow ? "#ef4444" : "#fff" }}>
                            {item.currentStock.toLocaleString()}
                          </span>
                          <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 6 }}>{item.unit}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                          Min Alert: {item.minThreshold} {item.unit}
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>📍 {item.location}</span>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => handleStockAdjust(item.id, -25)}
                            style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                          >
                            -25 Dispatch
                          </button>
                          <button
                            onClick={() => handleStockAdjust(item.id, 50)}
                            style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                          >
                            +50 Restock
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 4: VOLUNTEER ATTENDANCE (REPLACES MUSTER ROLL) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "roster" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="glass" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800 }}>Field Volunteer Roster & GPS Attendance</h2>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Replaces manual attendance registers. Verifies presence via GPS radius & logs seva points.</p>
                </div>
                <button
                  onClick={() => alert("All volunteer shift hours certified and pushed to Dharma Karma engine!")}
                  className="btn-primary"
                  style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Award size={14} /> Batch Issue Seva Certificates
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {VOLUNTEER_ROSTER.map((v, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "16px 20px",
                      background: "var(--surface)",
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 12
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#fff" }}>
                        {v.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{v.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{v.role} · 📍 {v.zone}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 12, fontWeight: 700 }}>Check-in: {v.checkIn}</div>
                        <div style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>GPS Radius: 4m (Verified)</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#f59e0b" }}>{v.hoursMonth} hrs</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{v.karma} Karma Pts</div>
                      </div>
                      <span style={{ padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: "rgba(16,185,129,0.15)", color: "#10b981" }}>
                        {v.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 5: AUTOMATED 80G RECEIPTS & TAX COMPLIANCE */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "80g" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="glass" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800 }}>Automated 80G Tax Exemption Receipts</h2>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Section 80G Income Tax Act 1961 compliant · Eliminates printed carbon receipt books.
                  </p>
                </div>
                <div style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", fontSize: 12, fontWeight: 700, color: "#10b981" }}>
                  Darpan Approval: Active (12A & 80G Live)
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {DONATIONS_DATA.map(don => (
                  <div
                    key={don.id}
                    style={{
                      padding: "16px 20px",
                      background: "var(--surface)",
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 12
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{don.donorName}</h4>
                        <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>PAN: {don.pan}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                        {don.cause} · Received on {don.date} · Ref: {don.id}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: "#10b981" }}>₹{don.amount.toLocaleString()}</div>
                        <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700 }}>{don.taxExempt}</div>
                      </div>
                      <button
                        onClick={() => setSelected80G(don)}
                        className="btn-primary"
                        style={{ fontSize: 12, padding: "8px 16px", borderRadius: 8, display: "flex", alignItems: "center", gap: 6 }}
                      >
                        <FileText size={14} /> View 80G Certificate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 6: AI DOCUMENT & COMPLIANCE ENGINE */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "ai" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="glass" style={{ padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <Cpu size={24} color="#8b5cf6" />
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800 }}>Vanna AI Institutional Document Engine</h2>
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    100MB+ Local File Parser powered by AWS Bedrock & Qdrant · Auto-extracts compliance risks, FCRA schedules, and CSR audit reports.
                  </p>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                style={{
                  background: "rgba(139,92,246,0.05)",
                  border: "2px dashed rgba(139,92,246,0.3)",
                  borderRadius: 16,
                  padding: "48px 24px",
                  textAlign: "center",
                  position: "relative",
                  cursor: "pointer",
                  marginTop: 16
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }}
                />

                {!isProcessing && !parsedData && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(139,92,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <UploadCloud size={32} color="#8b5cf6" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700 }}>Drop NGO Audits, FCRA Forms, or Bank Statements</h3>
                      <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Supports PDF, DOCX, CSV, Excel, TXT (up to 500MB local capacity)</p>
                    </div>
                  </div>
                )}

                {isProcessing && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                    <Loader2 className="animate-spin" size={40} color="#8b5cf6" />
                    <h3 style={{ fontSize: 15, fontWeight: 700 }}>Processing Document through AI Neural Vault...</h3>
                    <div style={{ width: "100%", maxWidth: 380, background: "rgba(255,255,255,0.1)", height: 8, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: "#8b5cf6", width: `${uploadProgress}%`, transition: "width 0.2s" }} />
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", gap: 14 }}>
                      <span>[ OCR Extraction ]</span>
                      <span>[ Vectorizing ]</span>
                      <span>[ Govt Cross-Check ]</span>
                    </div>
                  </div>
                )}

                {parsedData && (
                  <div style={{ textAlign: "left", background: "var(--surface)", padding: 24, borderRadius: 12, border: "1px solid #8b5cf6" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, borderBottom: "1px solid var(--border)", paddingBottom: 14 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <CheckCircle2 size={18} color="#10b981" />
                          <h4 style={{ fontSize: 16, fontWeight: 800 }}>Audit Extraction Complete</h4>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{parsedData.name} ({parsedData.size})</div>
                      </div>
                      <button
                        onClick={() => setParsedData(null)}
                        style={{ padding: "6px 14px", borderRadius: 8, background: "#8b5cf6", color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                      >
                        Process Another
                      </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Estimated Word Count</div>
                          <div style={{ fontSize: 20, fontWeight: 800, color: "#8b5cf6" }}>{parsedData.wordCount.toLocaleString()}</div>
                        </div>
                        <div style={{ padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>FCRA Compliance Match</div>
                          <div style={{ fontSize: 20, fontWeight: 800, color: "#10b981" }}>{parsedData.complianceScore}%</div>
                        </div>
                        <div style={{ padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Audit Risk Severity</div>
                          <div style={{ fontSize: 20, fontWeight: 800, color: "#3b82f6" }}>Zero Flags (Pass)</div>
                        </div>
                      </div>

                      <div style={{ padding: 16, background: "rgba(0,0,0,0.3)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                          <FileSearch size={14} /> AI Intelligence Summary & Extracts
                        </div>
                        <p style={{ fontSize: 12, color: "var(--text)", lineHeight: 1.6, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
                          {parsedData.textSnippet}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 7: SAAS REVENUE PROSPECT & MONETIZATION MODEL */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeTab === "saas" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="glass" style={{ padding: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <DollarSign size={28} color="#10b981" />
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 900 }}>Vannate Enterprise: The Business Model & Revenue Engine</h2>
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    How Vannate generates high-margin SaaS recurring revenue while providing a free humanitarian emergency grid to citizens.
                  </p>
                </div>
              </div>

              {/* Pricing & Licensing Matrix */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginTop: 24 }}>
                
                {/* Free Tier */}
                <div style={{ padding: 24, borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>For Citizens & Volunteers</div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>Humanitarian Grid</h3>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", margin: "16px 0 8px" }}>FREE <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>forever</span></div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 18 }}>Public emergency reporting, 1-tap SOS dispatch, blood bank search, and karma rewards.</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
                    <li>✓ 1-Tap SOS Dispatch</li>
                    <li>✓ AI Anti-Prank Camera</li>
                    <li>✓ Live Telemetry Tracking</li>
                    <li>✓ Community Blood Matching</li>
                  </ul>
                </div>

                {/* NGO Pro / One-Time Setup */}
                <div style={{ padding: 24, borderRadius: 16, background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.08))", border: "2px solid var(--brand)", position: "relative" }}>
                  <span style={{ position: "absolute", top: -12, right: 20, padding: "4px 12px", borderRadius: 12, background: "var(--brand)", color: "#fff", fontSize: 10, fontWeight: 800 }}>
                    MOST POPULAR B2B
                  </span>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "var(--brand)", textTransform: "uppercase" }}>Small & Medium NGOs</div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>Institutional OS</h3>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#10b981", margin: "16px 0 8px" }}>₹49,999 <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>one-time setup</span></div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 18 }}>Replaces all paper registers, stock ledgers, and muster rolls. 100% digital operations.</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
                    <li>✓ Cryptographic SHA-256 Digital Logbooks</li>
                    <li>✓ Automated 80G Tax Exemption Generation</li>
                    <li>✓ Warehouse Stock & QR Barcode Dispatch</li>
                    <li>✓ GPS Geofenced Volunteer Rosters</li>
                    <li>✓ NGO Darpan & FCRA Audit Preparation</li>
                  </ul>
                </div>

                {/* Enterprise / Corporate CSR */}
                <div style={{ padding: 24, borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#f59e0b", textTransform: "uppercase" }}>Large Foundations & CSR</div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>Corporate CSR Grid</h3>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#f59e0b", margin: "16px 0 8px" }}>₹2.5 Lakh <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>/ year</span></div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 18 }}>Multi-state foundation management, AWS Glacier immutable backups, and custom CSR audits.</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
                    <li>✓ Multi-Branch Centralized Command</li>
                    <li>✓ AWS S3 Glacier Immutable Vault</li>
                    <li>✓ Ministry of Corporate Affairs CSR-1 filing export</li>
                    <li>✓ 24/7 Dedicated Support & SLA</li>
                  </ul>
                </div>

              </div>

              {/* ROI Pitch */}
              <div style={{ marginTop: 32, padding: 20, background: "rgba(16,185,129,0.08)", borderRadius: 12, border: "1px solid rgba(16,185,129,0.2)" }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: "#10b981", marginBottom: 6 }}>The Unbeatable NGO Value Proposition:</h4>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
                  A typical NGO in India spends over <strong>₹3,50,000 annually</strong> on physical printing, lost paper vouchers, courier delays for 80G receipts, accountant reconciliation, and audit penalties. Vannate NGO OS eliminates 100% of these paper inefficiencies with a single one-time setup—giving NGOs an immediate <strong>7x ROI in year one alone</strong> while unlocking institutional CSR grants through verified transparency.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* MODAL: 80G CERTIFICATE VIEWER */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {selected80G && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(8px)",
                zIndex: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 20
              }}
              onClick={() => setSelected80G(null)}
            >
              <F
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={e => e.stopPropagation()}
                style={{
                  width: "100%",
                  maxWidth: 680,
                  background: "#fff",
                  color: "#1e293b",
                  borderRadius: 16,
                  padding: 36,
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                  fontFamily: "Georgia, serif",
                  border: "6px double #1e3a8a",
                  position: "relative"
                }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelected80G(null)}
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    background: "rgba(0,0,0,0.06)",
                    border: "none",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                    fontWeight: 800,
                    fontSize: 16
                  }}
                >
                  ✕
                </button>

                {/* Certificate Header */}
                <div style={{ textAlign: "center", borderBottom: "2px solid #1e3a8a", paddingBottom: 16, marginBottom: 20 }}>
                  <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>
                    Government of India · Ministry of Finance · Income Tax Department
                  </div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1e3a8a", margin: "6px 0" }}>
                    DONATION TAX EXEMPTION RECEIPT
                  </h2>
                  <div style={{ fontSize: 12, color: "#475569", fontStyle: "italic" }}>
                    Issued under Section 80G(5)(vi) of the Income Tax Act, 1961
                  </div>
                </div>

                {/* Body Details */}
                <div style={{ fontSize: 13, lineHeight: 1.8, color: "#334155" }}>
                  <p>
                    Receipt No: <strong>{selected80G.id}</strong> &nbsp;|&nbsp; Date: <strong>{selected80G.date}</strong>
                  </p>
                  <p>
                    Received with thanks from <strong>{selected80G.donorName}</strong>, holder of Permanent Account Number (PAN): <strong style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: 4 }}>{selected80G.pan}</strong>, the sum of:
                  </p>
                  <div style={{ background: "#f8fafc", padding: "12px 18px", borderRadius: 8, border: "1px dashed #cbd5e1", margin: "14px 0", textAlign: "center" }}>
                    <span style={{ fontSize: 24, fontWeight: 900, color: "#16a34a" }}>₹{selected80G.amount.toLocaleString()}</span>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Cause: {selected80G.cause}</div>
                  </div>
                  <p style={{ fontSize: 12, color: "#64748b" }}>
                    This donation is eligible for 50% deduction under Section 80G of the Income Tax Act, 1961 vide Order No. <strong>CIT(E)/KOL/80G/2023-24/A-1082</strong>.
                  </p>
                </div>

                {/* Footer with NGO Darpan Stamp */}
                <div style={{ borderTop: "1px solid #cbd5e1", paddingTop: 16, marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 11, color: "#475569" }}>
                    <strong>Recipient NGO:</strong> VANNATE HUMANITARIAN FOUNDATION<br />
                    <strong>NGO Darpan ID:</strong> WB/2024/039821<br />
                    <strong>Registered Office:</strong> Kolkata, West Bengal
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 68, height: 68, background: "#0f172a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, borderRadius: 8, fontWeight: 700 }}>
                      [QR VERIFIED]
                    </div>
                    <span style={{ fontSize: 9, color: "#64748b" }}>Digitally Signed</span>
                  </div>
                </div>

                <div style={{ marginTop: 20, textAlign: "center" }}>
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    style={{
                      padding: "8px 20px",
                      borderRadius: 8,
                      background: "#1e3a8a",
                      color: "#fff",
                      border: "none",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <Printer size={14} /> Print / Save as PDF
                  </button>
                </div>
              </F>
            </div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* MODAL: CRYPTOGRAPHIC SEAL INSPECTOR */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {selectedLogForVerification && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(8px)",
                zIndex: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 20
              }}
              onClick={() => setSelectedLogForVerification(null)}
            >
              <F
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={e => e.stopPropagation()}
                className="glass"
                style={{
                  width: "100%",
                  maxWidth: 600,
                  padding: 32,
                  borderRadius: 16,
                  border: "1px solid var(--brand)",
                  position: "relative"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <ShieldCheck size={24} color="#10b981" />
                  <h3 style={{ fontSize: 18, fontWeight: 800 }}>Cryptographic Audit Seal Verified</h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
                  <div style={{ padding: 12, background: "var(--surface)", borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Entry ID</div>
                    <div style={{ fontWeight: 800, fontFamily: "monospace", fontSize: 14 }}>{selectedLogForVerification.id}</div>
                  </div>
                  <div style={{ padding: 12, background: "var(--surface)", borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>SHA-256 Cryptographic Hash</div>
                    <div style={{ fontWeight: 700, fontFamily: "monospace", fontSize: 11, color: "#10b981", wordBreak: "break-all" }}>
                      {selectedLogForVerification.hash}
                    </div>
                  </div>
                  <div style={{ padding: 12, background: "var(--surface)", borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Chain of Custody & Officer</div>
                    <div style={{ fontWeight: 600 }}>{selectedLogForVerification.officer}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                      Logged at {selectedLogForVerification.location} on {selectedLogForVerification.timestamp}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 24, textAlign: "right" }}>
                  <button
                    onClick={() => setSelectedLogForVerification(null)}
                    className="btn-primary"
                    style={{ padding: "8px 20px", fontSize: 13 }}
                  >
                    Close Inspector
                  </button>
                </div>
              </F>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
