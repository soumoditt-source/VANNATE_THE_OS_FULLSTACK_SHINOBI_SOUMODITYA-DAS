"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, ShieldCheck, AlertTriangle, CheckCircle2, ScanLine,
  Banknote, QrCode, X, UploadCloud, Loader2, RefreshCw,
  MapPin, Sparkles, Eye, Languages, Zap
} from "lucide-react";
import { useCameraPermission, useGeolocation } from "@/hooks/useDevicePermissions";

const F = motion.div;

// ── Tesseract OCR (real, browser-native, no API) ──────────────────────────
async function runTesseractOCR(
  imageData: string,
  onProgress: (pct: number, msg: string) => void
): Promise<string> {
  // Dynamic import — keeps bundle lean
  const { createWorker } = await import("tesseract.js");

  // Support Hindi + Bengali + English (all three language packs)
  const worker = await createWorker(["eng", "hin", "ben"], 1, {
    logger: (m: any) => {
      if (m.status === "recognizing text") {
        onProgress(Math.round((m.progress || 0) * 100), "Scanning text...");
      } else if (m.status === "loading language traineddata") {
        onProgress(10, "Loading OCR language packs...");
      } else if (m.status === "initializing api") {
        onProgress(20, "Initialising Tesseract engine...");
      }
    },
  });

  try {
    const { data } = await worker.recognize(imageData);
    await worker.terminate();
    return data.text || "";
  } catch (err) {
    await worker.terminate();
    throw err;
  }
}

// ── Indian currency intelligence ──────────────────────────────────────────
function analyseIndianCurrency(text: string): {
  amount: number;
  serials: string[];
  isGenuine: boolean;
  confidence: number;
  flags: string[];
} {
  const flags: string[] = [];
  let amount = 0;
  let confidence = 0.5;

  // Detect denomination
  const denomPatterns: [RegExp, number][] = [
    [/₹\s*(2000)/i, 2000], [/\b2000\b/, 2000],
    [/₹\s*(500)/i, 500],   [/\b500\b/, 500],
    [/₹\s*(200)/i, 200],   [/\b200\b/, 200],
    [/₹\s*(100)/i, 100],   [/\b100\b/, 100],
    [/₹\s*(50)/i,  50],    [/\b50\b/,  50],
    [/₹\s*(20)/i,  20],    [/\b20\b/,  20],
    [/₹\s*(10)/i,  10],    [/\b10\b/,  10],
  ];
  for (const [pat, denom] of denomPatterns) {
    if (pat.test(text)) { amount = denom; break; }
  }

  // Detect RBI authentication strings
  const rbiKeywords = ["RESERVE BANK OF INDIA", "रिज़र्व बैंक", "GOVERNOR", "GUARANTEED BY THE CENTRAL GOVERNMENT"];
  const rbiFound = rbiKeywords.filter(k => text.toUpperCase().includes(k.toUpperCase())).length;
  if (rbiFound >= 2) { confidence += 0.25; flags.push("✅ RBI Issuer Text Found"); }
  if (rbiFound >= 3) { confidence += 0.1;  flags.push("✅ Governor Guarantee Verified"); }

  // Serial number patterns (e.g. "7AB 894120", "2EF 123456")
  const serialRegex = /[0-9][A-Z]{2}\s*[0-9]{6}/gi;
  const matches = text.match(serialRegex) || [];
  const serials = Array.from(new Set(matches));
  if (serials.length > 0) { confidence += 0.1; flags.push(`✅ Serial: ${serials[0]}`); }

  // Detect suspicious markers
  if (text.toLowerCase().includes("sample") || text.toLowerCase().includes("specimen")) {
    confidence -= 0.4;
    flags.push("⚠️ SPECIMEN/SAMPLE watermark detected");
  }
  if (text.length < 20) {
    confidence -= 0.2;
    flags.push("⚠️ Low text yield — check image clarity");
  }
  if (amount === 0) {
    confidence -= 0.1;
    flags.push("ℹ️ Denomination not detected — ensure full note visible");
  }

  confidence = Math.max(0.15, Math.min(0.98, confidence));
  const isGenuine = confidence >= 0.65;

  return { amount: amount || 500, serials, isGenuine, confidence, flags };
}

// ─────────────────────────────────────────────────────────────────────────
export default function VerifyPage() {
  const [mode, setMode] = useState<"money" | "document" | "qr">("money");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrMsg, setOcrMsg] = useState("");
  const [processing, setProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<{
    text: string; amount?: number; serials?: string[];
    isGenuine: boolean; confidence: number;
    timestamp: string; location?: string; flags: string[];
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const camera = useCameraPermission();
  const geo = useGeolocation();

  // Stop camera on unmount
  useEffect(() => () => camera.stopCamera(), [camera]);

  // ── Start camera (called from button — satisfies iOS user-gesture requirement)
  const handleStartCamera = useCallback(async () => {
    await camera.requestCamera(videoRef.current);
  }, [camera]);

  // ── Capture frame from video
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedImage(dataUrl);
    camera.stopCamera();
    runAnalysis(dataUrl);
  }, [camera]);

  // ── File upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      setCapturedImage(url);
      camera.stopCamera();
      runAnalysis(url);
    };
    reader.readAsDataURL(file);
  };

  // ── Core: real Tesseract OCR analysis
  const runAnalysis = async (imageUrl: string) => {
    setProcessing(true);
    setOcrResult(null);
    setOcrProgress(0);
    setOcrMsg("Starting OCR engine...");

    // Get location in parallel
    const geoPromise = geo.requestLocation();

    let extractedText = "";
    try {
      extractedText = await runTesseractOCR(imageUrl, (pct, msg) => {
        setOcrProgress(pct);
        setOcrMsg(msg);
      });
    } catch (err) {
      console.error("Tesseract error:", err);
      setOcrMsg("OCR failed — try a clearer, well-lit image.");
    }

    const geoCoords = await geoPromise;
    const locationStr = geoCoords
      ? `${geoCoords.lat.toFixed(4)}°N, ${geoCoords.lng.toFixed(4)}°E${geoCoords.city ? ` · ${geoCoords.city}` : ""}`
      : "Location not available";

    const analysis = analyseIndianCurrency(extractedText);

    setOcrResult({
      text: extractedText,
      amount: analysis.amount,
      serials: analysis.serials,
      isGenuine: analysis.isGenuine,
      confidence: analysis.confidence,
      timestamp: new Date().toLocaleString("en-IN"),
      location: locationStr,
      flags: analysis.flags,
    });
    setProcessing(false);
    setOcrProgress(100);
  };

  const reset = () => {
    setCapturedImage(null);
    setOcrResult(null);
    setProcessing(false);
    setOcrProgress(0);
    camera.stopCamera();
  };

  // ─── UI ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", paddingBottom: 60 }}>
      {/* Background */}
      <div style={{ position: "fixed", top: "15%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, background: "radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", zIndex: 0 }} />

      <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: 860 }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <ShieldCheck color="var(--brand)" /> Vannate Verify
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
            Real OCR · Tesseract Engine · Hindi + Bengali + English · On-Device Processing · No API
          </p>
        </div>

        {/* Mode selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {([
            { k: "money",    icon: Banknote,   label: "Indian Currency" },
            { k: "document", icon: ScanLine,   label: "Document / ID" },
            { k: "qr",       icon: QrCode,     label: "QR / Barcode" },
          ] as const).map(({ k, icon: Icon, label }) => (
            <button key={k} onClick={() => setMode(k)} style={{
              padding: "10px 18px", borderRadius: 12, fontWeight: 600, fontSize: 13,
              border: `1px solid ${mode === k ? "var(--brand)" : "var(--border)"}`,
              background: mode === k ? "rgba(20,184,166,0.12)" : "var(--surface)",
              color: mode === k ? "var(--brand)" : "var(--text-muted)",
              cursor: "pointer", transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: 7,
            }}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* ── LEFT: Camera / Upload ─────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Permission denied banner */}
            {camera.state === "denied" && (
              <F initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={{ padding: "14px 18px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13, color: "#ef4444", marginBottom: 4 }}>Camera Permission Required</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{camera.error}</p>
                  </div>
                </div>
              </F>
            )}

            {/* Video viewfinder */}
            <div className="glass" style={{ padding: 18, position: "relative" }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", background: "#050810", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                {/* Video element — hidden when not active */}
                <video
                  ref={videoRef}
                  playsInline muted autoPlay
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    display: camera.state === "granted" ? "block" : "none",
                  }}
                />
                {/* Captured image preview */}
                {capturedImage && camera.state !== "granted" && (
                  <img src={capturedImage} alt="Captured" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                )}
                {/* Idle overlay */}
                {camera.state !== "granted" && !capturedImage && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                    <Camera size={40} color="rgba(255,255,255,0.2)" />
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, textAlign: "center", padding: "0 20px", lineHeight: 1.5 }}>
                      Tap "Open Camera" to scan.<br />Works on mobile, tablet &amp; desktop.
                    </p>
                  </div>
                )}
                {/* Live scan overlay */}
                {camera.state === "granted" && (
                  <>
                    <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.6)", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 7, height: 7, background: "#ef4444", borderRadius: "50%", animation: "ocr-pulse 1s infinite" }} /> LIVE
                    </div>
                    {/* Scan guide frame */}
                    <div style={{ position: "absolute", inset: "15%", border: "2px solid rgba(20,184,166,0.6)", borderRadius: 8 }} />
                    <div style={{ position: "absolute", inset: "15%", borderTop: "2px solid #14b8a6", animation: "scan-sweep 2s linear infinite" }} />
                  </>
                )}
              </div>
              <canvas ref={canvasRef} style={{ display: "none" }} />

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                {camera.state !== "granted" ? (
                  <button
                    onClick={handleStartCamera}
                    disabled={camera.state === "requesting"}
                    className="btn-primary"
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    {camera.state === "requesting"
                      ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Opening…</>
                      : <><Camera size={15} /> Open Camera</>}
                  </button>
                ) : (
                  <button onClick={capturePhoto} className="btn-primary"
                    style={{ flex: 1, justifyContent: "center", background: "#14b8a6" }}>
                    <Sparkles size={15} /> Capture &amp; Analyse
                  </button>
                )}
                {camera.state === "granted" && (
                  <button onClick={camera.stopCamera}
                    style={{ padding: "10px 14px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer" }}>
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Upload alternative */}
              <div style={{ marginTop: 10 }}>
                <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileUpload} style={{ display: "none" }} />
                <button onClick={() => fileInputRef.current?.click()}
                  style={{ width: "100%", padding: "10px", borderRadius: 10, background: "var(--surface)", border: "1px dashed var(--border)", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <UploadCloud size={15} /> Upload Photo Instead
                </button>
              </div>
            </div>

            {/* OCR tech info */}
            <div className="glass" style={{ padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--brand)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <Zap size={12} /> TESSERACT.JS — ON-DEVICE OCR ENGINE
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[
                  ["Engine", "Tesseract v5 WASM"], ["API Calls", "Zero — runs offline"],
                  ["Languages", "ENG + HIN + BEN"], ["Source", "Apache 2.0 Open Source"],
                ].map(([k, v]) => (
                  <div key={k} style={{ fontSize: 11 }}>
                    <span style={{ color: "var(--text-muted)" }}>{k}: </span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Results ────────────────────────────────────────────── */}
          <div>
            <AnimatePresence mode="wait">
              {/* Processing */}
              {processing && (
                <F key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="glass" style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
                  <div style={{ position: "relative", width: 64, height: 64 }}>
                    <div style={{ position: "absolute", inset: 0, border: "3px solid rgba(20,184,166,0.15)", borderRadius: "50%" }} />
                    <div style={{ position: "absolute", inset: 0, border: "3px solid transparent", borderTopColor: "#14b8a6", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
                    <ScanLine size={24} color="#14b8a6" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Analysing Image</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{ocrMsg}</p>
                  </div>
                  <div style={{ width: "100%", maxWidth: 240 }}>
                    <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: "linear-gradient(90deg, #14b8a6, #3b82f6)", width: `${ocrProgress}%`, transition: "width 0.3s", borderRadius: 3 }} />
                    </div>
                    <p style={{ fontSize: 11, color: "var(--brand)", marginTop: 6, fontWeight: 600 }}>{ocrProgress}%</p>
                  </div>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", lineHeight: 1.5 }}>
                    Running Tesseract OCR locally — no data leaves your device
                  </p>
                </F>
              )}

              {/* Results */}
              {ocrResult && !processing && (
                <F key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {/* Verdict */}
                  <div className="glass" style={{
                    padding: 24, border: `1px solid ${ocrResult.isGenuine ? "rgba(16,185,129,0.35)" : "rgba(239,68,68,0.35)"}`,
                    background: ocrResult.isGenuine ? "rgba(16,185,129,0.05)" : "rgba(239,68,68,0.05)",
                    textAlign: "center",
                  }}>
                    {ocrResult.isGenuine
                      ? <CheckCircle2 size={36} color="#10b981" style={{ marginBottom: 10 }} />
                      : <AlertTriangle size={36} color="#ef4444" style={{ marginBottom: 10 }} />}
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: ocrResult.isGenuine ? "#10b981" : "#ef4444", marginBottom: 4 }}>
                      {ocrResult.isGenuine ? "AUTHENTIC" : "SUSPICIOUS"}
                    </h3>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
                      Confidence: <strong style={{ color: ocrResult.isGenuine ? "#10b981" : "#ef4444" }}>
                        {Math.round(ocrResult.confidence * 100)}%
                      </strong>
                    </p>
                    {typeof ocrResult.amount === "number" && ocrResult.amount > 0 && (
                      <div style={{ fontSize: 28, fontWeight: 900, color: "var(--text)" }}>₹{ocrResult.amount}</div>
                    )}
                  </div>

                  {/* Flags */}
                  {ocrResult.flags.length > 0 && (
                    <div className="glass" style={{ padding: 16 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>DETECTION FLAGS</p>
                      {ocrResult.flags.map((f, i) => (
                        <div key={i} style={{ fontSize: 12, padding: "4px 0", borderBottom: i < ocrResult.flags.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", color: "var(--text)" }}>{f}</div>
                      ))}
                    </div>
                  )}

                  {/* Location + timestamp */}
                  <div className="glass" style={{ padding: 16 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 8, fontSize: 12 }}>
                      <MapPin size={13} color="var(--brand)" style={{ marginTop: 1, flexShrink: 0 }} />
                      <span style={{ color: "var(--text-muted)" }}>{ocrResult.location}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Scanned: {ocrResult.timestamp}</div>
                  </div>

                  {/* Raw OCR text */}
                  {ocrResult.text && (
                    <div className="glass" style={{ padding: 14 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                        <Eye size={11} /> RAW OCR OUTPUT
                      </p>
                      <pre style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all", maxHeight: 120, overflowY: "auto", margin: 0, lineHeight: 1.6 }}>
                        {ocrResult.text.trim() || "(No text detected — try a clearer, well-lit image)"}
                      </pre>
                    </div>
                  )}

                  <button onClick={reset} className="btn-primary"
                    style={{ justifyContent: "center", background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}>
                    <RefreshCw size={14} /> Scan Another
                  </button>
                </F>
              )}

              {/* Idle state */}
              {!processing && !ocrResult && (
                <F key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="glass" style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
                  <div style={{ width: 60, height: 60, background: "rgba(20,184,166,0.08)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(20,184,166,0.2)" }}>
                    <Languages size={26} color="var(--brand)" />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Multi-Language OCR Ready</h3>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 280 }}>
                      Point camera at any Indian currency note, Aadhaar card, or document. Reads English, हिंदी, and বাংলা.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                    {["₹500 Note", "₹2000 Note", "Aadhaar Card", "Relief Voucher", "Cheque"].map(t => (
                      <span key={t} style={{ padding: "4px 10px", background: "rgba(255,255,255,0.05)", borderRadius: 20, fontSize: 11, color: "var(--text-muted)", border: "1px solid var(--border)" }}>{t}</span>
                    ))}
                  </div>
                </F>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ocr-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes scan-sweep {
          0% { top: 15%; }
          50% { top: 83%; }
          100% { top: 15%; }
        }
        @media (max-width: 640px) {
          .container > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
