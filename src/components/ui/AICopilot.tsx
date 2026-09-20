"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, User } from "lucide-react";

interface Msg { role: "user" | "assistant"; text: string; }
const INIT: Msg[] = [{ role: "assistant", text: "Hi, I'm Vanna — Vannate's AI relief coordinator, powered by AWS Bedrock. I cite sources or refuse. How can I help coordinate today?" }];

export default function AICopilot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(INIT);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Msg = { role: "user", text: input };
    setMsgs(m => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: msgs.concat(userMsg) }) });
      const data = await res.json();
      setMsgs(m => [...m, { role: "assistant", text: data.reply || "I'm unable to respond right now." }]);
    } catch { setMsgs(m => [...m, { role: "assistant", text: "Connection error. Please try again." }]); }
    finally { setLoading(false); }
  };

  return (
    <>
      <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }} onClick={() => setOpen(o => !o)} style={{ position: "fixed", bottom: 24, right: 24, zIndex: 200, width: 56, height: 56, borderRadius: "50%", background: "var(--brand)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px var(--brand-glow)" }}>
        {open ? <X size={22} color="white" /> : <Bot size={22} color="white" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.96 }} style={{ position: "fixed", bottom: 92, right: 24, zIndex: 199, width: 340, height: 480, display: "flex", flexDirection: "column", background: "rgba(7,11,20,0.97)", border: "1px solid var(--border-strong)", borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
            <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot size={16} color="var(--brand)" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>Vanna AI</div>
                <div style={{ fontSize: 11, color: "#10b981" }}>● AWS Bedrock · Cites or refuses</div>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 8, justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  {m.role === "assistant" && <div style={{ width: 24, height: 24, borderRadius: 7, background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}><Bot size={13} color="var(--brand)" /></div>}
                  <div style={{ maxWidth: "78%", padding: "9px 13px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "4px 14px 14px 14px", background: m.role === "user" ? "var(--brand)" : "rgba(255,255,255,0.06)", fontSize: 13, lineHeight: 1.6, color: "var(--text)" }}>
                    {m.text}
                  </div>
                  {m.role === "user" && <div style={{ width: 24, height: 24, borderRadius: 7, background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}><User size={13} color="var(--text-muted)" /></div>}
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 7, background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}><Bot size={13} color="var(--brand)" /></div>
                  <div style={{ padding: "9px 14px", borderRadius: "4px 14px 14px 14px", background: "rgba(255,255,255,0.06)", display: "flex", gap: 4, alignItems: "center" }}>
                    {[0, 1, 2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand)", animation: "bounce 1s infinite", animationDelay: `${i * 0.15}s` }} />)}
                  </div>
                </div>
              )}
              <div ref={bottom} />
            </div>

            <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask Vanna…" style={{ flex: 1, padding: "9px 13px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)", fontSize: 13, outline: "none" }} />
              <button onClick={send} style={{ width: 36, height: 36, borderRadius: 10, background: "var(--brand)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Send size={15} color="white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
    </>
  );
}
