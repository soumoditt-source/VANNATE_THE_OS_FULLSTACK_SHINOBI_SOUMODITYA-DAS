"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Scroll, BookOpen, Volume2, ShieldCheck, Heart, Users, Check } from "lucide-react";
import VannateLogo from "./VannateLogo";

interface Shloka {
  id: string;
  source: string;
  chapterVerse: string;
  sanskrit: string;
  transliteration: string;
  english: string;
  techApplication: string;
  pillar: string;
  icon: any;
  color: string;
}

const SHLOKAS: Shloka[] = [
  {
    id: "gita-17-20",
    source: "Bhagavad Gita",
    chapterVerse: "Chapter 17, Verse 20",
    sanskrit: "दातव्यमिति यद्दानं दीयतेऽनुपकारिणे।\nदेशे काले च पात्रे च तद्दानं सात्त्विकं स्मृतम्॥",
    transliteration: "Dātavyam iti yad dānaṁ dīyate ’nupakāriṇe |\ndeśe kāle ca pātre ca tad dānaṁ sāttvikaṁ smṛtam ||",
    english: "Charity given out of selfless duty, without expectation of return, at the proper time, in the right place, and to a worthy recipient — this is deemed purely Sattvic (Noble).",
    techApplication: "Vannate's Zero-Cash Relief Vault: Direct donor-to-beneficiary routing with cryptographic Section 80G tax proof, eliminating middlemen and leakages.",
    pillar: "Sattvic Dana (Pure Giving)",
    icon: Heart,
    color: "#F59E0B"
  },
  {
    id: "gita-2-47",
    source: "Bhagavad Gita",
    chapterVerse: "Chapter 2, Verse 47",
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    transliteration: "Karmaṇy-evādhikāras te mā phaleṣu kadācana |\nmā karma-phala-hetur bhūr mā te saṅgo ’stvakarmaṇi ||",
    english: "You have a divine right to perform your prescribed duty, but never to claim the fruits of your action. Never be motivated by reward, nor be drawn into inaction.",
    techApplication: "Autonomous Volunteer Grid: Over 37,000 emergency first-responders receive decentralized GPS missions without bureaucratic hurdles or monetary entanglements.",
    pillar: "Nishkama Karma (Selfless Action)",
    icon: Users,
    color: "#10B981"
  },
  {
    id: "gita-4-8",
    source: "Bhagavad Gita",
    chapterVerse: "Chapter 4, Verse 8",
    sanskrit: "परित्राणाय साधूनां विनाशाय च दुष्कृताम्।\nधर्मसंस्थापनार्थाय सम्भवामि युगे युगे॥",
    transliteration: "Paritrāṇāya sādhūnāṁ vināśāya ca duṣkṛtām |\ndharma-saṁsthāpanārthāya sambhavāmi yuge yuge ||",
    english: "For the protection of the innocent, the elimination of evil and deceit, and to firmly re-establish the foundations of righteousness (Dharma), I manifest across the ages.",
    techApplication: "Neural Anti-Prank & Anti-Black Money: Real-time OCR and Computer Vision detect fake crisis reports, recycled media, and illicit cash loops under the PMLA framework.",
    pillar: "Dharma Samsthapana (Upholding Truth)",
    icon: ShieldCheck,
    color: "#3B82F6"
  },
  {
    id: "maha-upanishad",
    source: "Maha Upanishad",
    chapterVerse: "Chapter 6, Verse 71-72",
    sanskrit: "अयं निजः परो वेत्ति गणना लघुचेतसाम्।\nउदारचरितानां तु वसुधैव कुटुम्बकम्॥",
    transliteration: "Ayaṁ nijaḥ paro vetti gaṇanā laghu-cetasām |\nudāra-caritānāṁ tu vasudhaiva kuṭumbakam ||",
    english: "To categorize one as our own and another as a stranger is the affliction of narrow minds. For the noble and compassionate, the entire earth is but one single family.",
    techApplication: "Decentralized Crisis Mesh: Multi-agency interoperability linking Police, Fire, Trauma Centers, and NGOs into one cohesive humanitarian fabric with 0 border friction.",
    pillar: "Vasudhaiva Kutumbakam (Universal Kinship)",
    icon: Sparkles,
    color: "#8B5CF6"
  }
];

export default function GeetaShlokaSection() {
  const [activeTab, setActiveTab] = useState<string>("gita-17-20");
  const [copied, setCopied] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);

  const selected = SHLOKAS.find(s => s.id === activeTab) || SHLOKAS[0];

  // Synthesize a gentle sacred resonant frequency (432Hz Om drone tone)
  const playSacredChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(432, ctx.currentTime); // 432 Hz Healing Resonance
      osc.frequency.exponentialRampToValueAtTime(108, ctx.currentTime + 2.5);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.6);
      setAudioPlayed(true);
      setTimeout(() => setAudioPlayed(false), 2600);
    } catch (e) {
      console.warn("Audio chime could not be initialized:", e);
    }
  };

  const copyVerse = () => {
    const text = `${selected.sanskrit}\n\n${selected.transliteration}\n\n"${selected.english}"\n— ${selected.source} (${selected.chapterVerse})\n\nTechnology Implementation: ${selected.techApplication}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="dharmic-ethos"
      style={{
        padding: "100px 24px",
        position: "relative",
        background: "radial-gradient(ellipse at 50% 10%, rgba(245, 158, 11, 0.08) 0%, rgba(3, 7, 18, 0.95) 75%)",
        borderTop: "1px solid rgba(245, 158, 11, 0.2)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        overflow: "hidden"
      }}
    >
      {/* Background Decorative Chakra Geometry */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.03,
          pointerEvents: "none",
          width: 900,
          height: 900
        }}
      >
        <VannateLogo size={900} glow={false} animate={true} />
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
        {/* Header Badge & Title */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              borderRadius: 999,
              background: "rgba(245, 158, 11, 0.12)",
              border: "1px solid rgba(245, 158, 11, 0.35)",
              color: "#FDE68A",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 20
            }}
          >
            <BookOpen size={15} color="#F59E0B" />
            <span>The Sacred Philosophy of Dharma in Code</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: "clamp(32px, 4.5vw, 56px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
              marginBottom: 16,
              lineHeight: 1.15
            }}
          >
            Ancient Sanskrit Wisdom.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #10B981 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Made Digital.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: 18,
              color: "rgba(255, 255, 255, 0.65)",
              maxWidth: 680,
              margin: "0 auto",
              lineHeight: 1.7
            }}
          >
            VANNATE AI is not merely software; it is a sacred technological vow (*Sankalpa*). Every line of code is structured to reflect eternal Vedic truths of selfless duty, untainted charity, and universal brotherhood.
          </motion.p>
        </div>

        {/* Shloka Selector Tabs */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 40
          }}
        >
          {SHLOKAS.map(s => {
            const Icon = s.icon;
            const isSelected = s.id === activeTab;
            return (
              <button
                key={s.id}
                onClick={() => setActiveTab(s.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 20px",
                  borderRadius: 14,
                  background: isSelected ? `${s.color}22` : "rgba(255, 255, 255, 0.04)",
                  border: isSelected ? `2px solid ${s.color}` : "1px solid rgba(255, 255, 255, 0.08)",
                  color: isSelected ? "#FFFFFF" : "rgba(255, 255, 255, 0.6)",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  fontWeight: 600,
                  fontSize: 14,
                  boxShadow: isSelected ? `0 0 24px ${s.color}33` : "none"
                }}
              >
                <Icon size={16} color={s.color} />
                <span>{s.pillar}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Shloka Display Card */}
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            background: "rgba(10, 14, 26, 0.85)",
            backdropFilter: "blur(24px)",
            borderRadius: 24,
            border: `1px solid ${selected.color}44`,
            padding: "48px 40px",
            boxShadow: `0 24px 60px -12px rgba(0, 0, 0, 0.8), 0 0 40px ${selected.color}15`,
            position: "relative"
          }}
        >
          {/* Top Actions: Sacred Chime & Copy */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 32,
              paddingBottom: 20,
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <VannateLogo size={36} glow={true} />
              <div>
                <div style={{ fontSize: 13, color: selected.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {selected.source}
                </div>
                <div style={{ fontSize: 15, color: "#FFFFFF", fontWeight: 700 }}>
                  {selected.chapterVerse}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={playSacredChime}
                title="Play 432Hz Om Frequency Tone"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: audioPlayed ? "rgba(245, 158, 11, 0.25)" : "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  padding: "8px 16px",
                  borderRadius: 10,
                  color: audioPlayed ? "#FDE68A" : "#FFFFFF",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <Volume2 size={15} color={audioPlayed ? "#F59E0B" : "#94A3B8"} />
                <span>{audioPlayed ? "Resonating (432Hz)..." : "Sacred Drone"}</span>
              </button>

              <button
                onClick={copyVerse}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  padding: "8px 16px",
                  borderRadius: 10,
                  color: "#FFFFFF",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {copied ? <Check size={15} color="#10B981" /> : <Scroll size={15} />}
                <span>{copied ? "Copied!" : "Copy Shloka"}</span>
              </button>
            </div>
          </div>

          {/* Sanskrit Devanagari Script */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div
              style={{
                fontSize: "clamp(24px, 3.5vw, 42px)",
                fontWeight: 700,
                color: "#FDE68A",
                lineHeight: 1.6,
                fontFamily: "'Noto Sans Devanagari', serif",
                letterSpacing: "0.02em",
                textShadow: "0 0 30px rgba(245, 158, 11, 0.45)",
                whiteSpace: "pre-line"
              }}
            >
              {selected.sanskrit}
            </div>

            {/* Roman Transliteration */}
            <div
              style={{
                fontSize: "clamp(14px, 1.8vw, 18px)",
                color: "#CBD5E1",
                fontStyle: "italic",
                marginTop: 14,
                lineHeight: 1.6,
                whiteSpace: "pre-line",
                maxWidth: 800,
                margin: "14px auto 0"
              }}
            >
              {selected.transliteration}
            </div>
          </div>

          {/* English Translation & Technological Implementation */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              marginTop: 36,
              paddingTop: 28,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)"
            }}
            className="shloka-grid"
          >
            {/* English Meaning */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: 16,
                padding: "24px",
                border: "1px solid rgba(255, 255, 255, 0.06)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 10
                }}
              >
                <BookOpen size={14} color="#F59E0B" />
                <span>English Translation & Dharmic Essence</span>
              </div>
              <p style={{ fontSize: 16, color: "#F8FAFC", lineHeight: 1.7, margin: 0 }}>
                &ldquo;{selected.english}&rdquo;
              </p>
            </div>

            {/* Digital Architecture Mapping */}
            <div
              style={{
                background: `${selected.color}0D`,
                borderRadius: 16,
                padding: "24px",
                border: `1px solid ${selected.color}33`
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  color: selected.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 10
                }}
              >
                <selected.icon size={14} color={selected.color} />
                <span>VANNATE OS Engineering Execution</span>
              </div>
              <p style={{ fontSize: 15, color: "#F1F5F9", lineHeight: 1.7, margin: 0 }}>
                {selected.techApplication}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .shloka-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
