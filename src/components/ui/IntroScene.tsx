"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import VannateLogo from "./VannateLogo";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
  color: string; life: number; maxLife: number;
}

type Language = "hi" | "bn" | "en";

const SCRIPT = [
  {
    id: 0, duration: 6000, isTitle: false,
    primary: "दातव्यमिति यद्दानं दीयतेऽनुपकारिणे।",
    transliteration: "Dātavyam iti yad dānaṁ dīyate 'nupakāriṇe",
    secondary: "Charity given without expectation of return, at the proper time and place, to a worthy person — this is the purest Dharma.",
    sub: "— Bhagavad Gita 17.20 · Foundation of VANNATE's Zero-Cash Relief Vault",
  },
  {
    id: 1, duration: 5500, isTitle: false,
    primary: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
    transliteration: "Karmaṇy-evādhikāras te mā phaleṣu kadācana",
    secondary: "You have the right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of results, and never be attached to inaction.",
    sub: "— Bhagavad Gita 2.47 · Principle Behind VANNATE's Autonomous Volunteer Grid",
  },
  {
    id: 2, duration: 5500, isTitle: false,
    primary: "वसुधैव कुटुम्बकम्",
    transliteration: "Vasudhaiva Kuṭumbakam",
    secondary: "The entire world is one single family. For the generous and compassionate, there is no stranger — only a member of the universal family not yet met.",
    sub: "— Maha Upanishad 6.71-72 · The Philosophy of VANNATE's Multi-Agency Emergency Grid",
  },
  {
    id: 3, duration: 99999, isTitle: true,
    primary: "VANNATE AI",
    transliteration: "",
    secondary: "The Architecture of Dharma",
    sub: "Humanity · Karma · Compassion",
  },
];

// AI Voice narration scripts per language for each slide
const VOICE_SCRIPTS: Record<Language, string[]> = {
  en: [
    "Charity given without expectation of return, at the proper time and place, to a worthy person — this is the purest Dharma. This principle is the foundation of VANNATE's Zero-Cash Relief Vault.",
    "You have the right to perform your prescribed duties, but you are not entitled to the fruits of your actions. This is the principle behind VANNATE's Autonomous Volunteer Grid.",
    "The entire world is one single family. For the generous and compassionate, there is no stranger. This philosophy drives VANNATE's Multi-Agency Emergency Grid.",
    "Welcome to VANNATE AI. The Architecture of Dharma. Built on Humanity, Karma, and Compassion.",
  ],
  hi: [
    "बिना किसी अपेक्षा के, सही समय और स्थान पर, किसी योग्य व्यक्ति को दिया गया दान — यही सबसे शुद्ध धर्म है। यही सिद्धांत VANNATE के शून्य-नकद राहत कोष की नींव है।",
    "आपको अपने निर्धारित कर्तव्यों को निभाने का अधिकार है, लेकिन उनके फलों पर आपका कोई अधिकार नहीं है। यही VANNATE के स्वायत्त स्वयंसेवक ग्रिड का मार्गदर्शक सिद्धांत है।",
    "यह सम्पूर्ण विश्व एक ही परिवार है। उदार और दयालु व्यक्ति के लिए कोई अजनबी नहीं होता। यही VANNATE के बहु-एजेंसी आपातकालीन ग्रिड की दर्शन है।",
    "VANNATE AI में आपका स्वागत है। धर्म की वास्तुकला। मानवता, कर्म और करुणा पर आधारित।",
  ],
  bn: [
    "বিনা প্রতিদান আশায়, সঠিক সময়ে ও স্থানে, যোগ্য ব্যক্তিকে দেওয়া দান — এটাই সর্বোচ্চ ধর্ম। এই নীতিই VANNATE-এর শূন্য-নগদ ত্রাণ ভল্টের ভিত্তি।",
    "আপনার নির্ধারিত কর্তব্য পালন করার অধিকার আছে, কিন্তু তার ফলের উপর কোনো দাবি নেই। এটাই VANNATE-এর স্বায়ত্তশাসিত স্বেচ্ছাসেবক গ্রিডের মূলনীতি।",
    "এই সমগ্র বিশ্ব এক পরিবার। উদার ও করুণাময়ের কাছে কোনো অপরিচিত নেই। এই দর্শনই VANNATE-এর বহু-সংস্থা জরুরি গ্রিডকে চালিত করে।",
    "VANNATE AI-তে আপনাকে স্বাগতম। ধর্মের স্থাপত্য। মানবতা, কর্ম এবং করুণার উপর নির্মিত।",
  ],
};

const LANG_OPTIONS: { code: Language; label: string; native: string; flag: string }[] = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", native: "हिंदी", flag: "🇮🇳" },
  { code: "bn", label: "Bengali", native: "বাংলা", flag: "🪔" },
];

const LANG_VOICE_MAP: Record<Language, string> = {
  en: "en-IN",
  hi: "hi-IN",
  bn: "bn-IN",
};

export default function IntroScene() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [step, setStep] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [pageOut, setPageOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  const [lang, setLang] = useState<Language | null>(null);
  const [langChosen, setLangChosen] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // Speak narration for current slide
  const speakSlide = useCallback((slideIndex: number, language: Language) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const text = VOICE_SCRIPTS[language][slideIndex];
    if (!text) return;
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = LANG_VOICE_MAP[language];
    utt.rate = 0.88;
    utt.pitch = 1.05;
    utt.volume = 1;
    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const targetLang = LANG_VOICE_MAP[language];
    const match = voices.find(v => v.lang === targetLang) ||
                  voices.find(v => v.lang.startsWith(language)) ||
                  voices.find(v => v.lang.startsWith("en"));
    if (match) utt.voice = match;
    speechRef.current = utt;
    window.speechSynthesis.speak(utt);
  }, []);

  const stopSpeech = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  useEffect(() => {
    if (!mounted || !langChosen || !lang || step >= SCRIPT.length - 1) return;
    speakSlide(step, lang);
    const d = SCRIPT[step].duration;
    const t = setTimeout(() => {
      stopSpeech();
      setFadeOut(true);
      setTimeout(() => {
        setStep(s => s + 1);
        setFadeOut(false);
        setFadeIn(true);
        setTimeout(() => setFadeIn(false), 1200);
      }, 800);
    }, d);
    setFadeIn(true);
    setTimeout(() => setFadeIn(false), 1200);
    return () => { clearTimeout(t); stopSpeech(); };
  }, [step, mounted, langChosen, lang, speakSlide, stopSpeech]);

  const handleEnter = useCallback(() => {
    stopSpeech();
    setPageOut(true);
    setTimeout(() => router.push("/"), 1000);
  }, [router, stopSpeech]);

  const handleLangSelect = useCallback((code: Language) => {
    setLang(code);
    setLangChosen(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize);

    function spawnParticles(t: number) {
      if (Math.random() < 0.35) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 100 + Math.random() * 60;
        const cx = W / 2, cy = H * 0.38;
        const gold = Math.random() > 0.6;
        particlesRef.current.push({
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -Math.random() * 1.5 - 0.5,
          size: Math.random() * 2.5 + 0.5,
          opacity: 0.9,
          color: gold
            ? `hsl(${42 + Math.random() * 16}, 100%, ${62 + Math.random() * 15}%)`
            : `hsl(${174 + Math.random() * 12}, 90%, ${52 + Math.random() * 18}%)`,
          life: 0,
          maxLife: 80 + Math.random() * 80,
        });
      }
    }

    function drawChakra(t: number) {
      const cx = W / 2, cy = H * 0.38;
      const r = Math.min(W, H) * 0.14;
      const rot = t * 0.04;
      const innerRot = -t * 0.08;
      const pulse = 1 + Math.sin(t * 0.12) * 0.04;

      ctx.save();
      ctx.translate(cx, cy);

      for (let g = 3; g >= 1; g--) {
        ctx.beginPath();
        ctx.arc(0, 0, r * pulse * (1 + g * 0.18), 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * (1 + g * 0.22));
        glow.addColorStop(0, `rgba(255, 190, 0, 0.0)`);
        glow.addColorStop(1, `rgba(255, 160, 0, ${0.07 / g})`);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      const spokes = 32;
      ctx.save();
      ctx.rotate(rot);
      for (let i = 0; i < spokes; i++) {
        const a = (i * Math.PI * 2) / spokes;
        const a2 = ((i + 0.5) * Math.PI * 2) / spokes;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r * 0.85 * pulse, Math.sin(a) * r * 0.85 * pulse);
        ctx.lineTo(Math.cos(a2) * r * 1.12 * pulse, Math.sin(a2) * r * 1.12 * pulse);
        ctx.lineTo(Math.cos(a + (Math.PI * 2) / spokes) * r * 0.85 * pulse, Math.sin(a + (Math.PI * 2) / spokes) * r * 0.85 * pulse);
        ctx.closePath();
        const grad = ctx.createLinearGradient(
          Math.cos(a) * r * 0.85, Math.sin(a) * r * 0.85,
          Math.cos(a2) * r * 1.15, Math.sin(a2) * r * 1.15
        );
        grad.addColorStop(0, "#f59e0b");
        grad.addColorStop(1, "#fbbf24");
        ctx.fillStyle = grad;
        ctx.shadowColor = "#f59e0b";
        ctx.shadowBlur = 12;
        ctx.fill();
      }
      ctx.restore();

      ctx.save();
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.arc(0, 0, r * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 4;
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.rotate(innerRot);
      const starPoints = 6;
      ctx.beginPath();
      for (let i = 0; i < starPoints * 2; i++) {
        const angle = (i * Math.PI) / starPoints - Math.PI / 2;
        const rr = i % 2 === 0 ? r * 0.65 * pulse : r * 0.35 * pulse;
        if (i === 0) ctx.moveTo(Math.cos(angle) * rr, Math.sin(angle) * rr);
        else ctx.lineTo(Math.cos(angle) * rr, Math.sin(angle) * rr);
      }
      ctx.closePath();
      ctx.strokeStyle = "#fde68a";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#fde68a";
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.rotate(rot * 1.5);
      for (let i = 0; i < 16; i++) {
        const a = (i * Math.PI * 2) / 16;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * r * 0.78 * pulse, Math.sin(a) * r * 0.78 * pulse);
        ctx.strokeStyle = `rgba(251, 191, 36, ${0.4 + Math.sin(t * 0.1 + i) * 0.2})`;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "#f59e0b";
        ctx.stroke();
      }
      ctx.restore();

      const hub = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.22 * pulse);
      hub.addColorStop(0, "#ffffff");
      hub.addColorStop(0.3, "#fde68a");
      hub.addColorStop(1, "rgba(245,158,11,0)");
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.22 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = hub;
      ctx.shadowColor = "#fff";
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
    }

    function drawSilhouette() {
      const cx = W / 2, baseY = H * 0.72;
      const scale = Math.min(W, H) * 0.001;

      ctx.save();
      ctx.globalAlpha = 0.85;

      const bodyGrad = ctx.createLinearGradient(cx - 30 * scale, baseY - 160 * scale, cx + 30 * scale, baseY);
      bodyGrad.addColorStop(0, "#0a0a14");
      bodyGrad.addColorStop(1, "#06060e");
      ctx.fillStyle = bodyGrad;

      ctx.beginPath();
      ctx.ellipse(cx, baseY - 80 * scale, 28 * scale, 55 * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, baseY - 150 * scale, 22 * scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(cx + 18 * scale, baseY - 175 * scale, 6 * scale, 18 * scale, -0.4, 0, Math.PI * 2);
      const featherGrad = ctx.createLinearGradient(
        cx + 12 * scale, baseY - 190 * scale,
        cx + 24 * scale, baseY - 160 * scale
      );
      featherGrad.addColorStop(0, "rgba(20,184,166,0.8)");
      featherGrad.addColorStop(1, "rgba(59,130,246,0.4)");
      ctx.fillStyle = featherGrad;
      ctx.shadowColor = "#14b8a6";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.fillStyle = "#0a0a14";
      ctx.ellipse(cx - 45 * scale, baseY - 90 * scale, 10 * scale, 35 * scale, -0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx - 20 * scale, baseY - 110 * scale);
      ctx.lineTo(cx - 65 * scale, baseY - 60 * scale);
      ctx.strokeStyle = "rgba(212,175,55,0.7)";
      ctx.lineWidth = 3 * scale;
      ctx.shadowColor = "#d4af37";
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.fillStyle = "#0a0a14";
      ctx.ellipse(cx + 46 * scale, baseY - 105 * scale, 10 * scale, 38 * scale, 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(cx - 12 * scale, baseY - 20 * scale, 18 * scale, 40 * scale, 0.1, 0, Math.PI * 2);
      ctx.fillStyle = "#070712";
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 14 * scale, baseY - 18 * scale, 16 * scale, 38 * scale, -0.15, 0, Math.PI * 2);
      ctx.fill();

      const crownGrad = ctx.createRadialGradient(cx, baseY - 168 * scale, 2, cx, baseY - 168 * scale, 20 * scale);
      crownGrad.addColorStop(0, "rgba(255,200,50,0.6)");
      crownGrad.addColorStop(1, "rgba(255,200,50,0)");
      ctx.beginPath();
      ctx.arc(cx, baseY - 168 * scale, 20 * scale, 0, Math.PI * 2);
      ctx.fillStyle = crownGrad;
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.restore();
    }

    const stars: { x: number; y: number; r: number; flicker: number }[] = [];
    for (let i = 0; i < 280; i++) {
      stars.push({
        x: Math.random() * 2000, y: Math.random() * 1200,
        r: Math.random() * 1.2 + 0.1,
        flicker: Math.random() * Math.PI * 2,
      });
    }

    function drawStars(t: number) {
      stars.forEach(s => {
        const alpha = 0.3 + Math.sin(t * 0.02 + s.flicker) * 0.3;
        ctx.beginPath();
        ctx.arc((s.x % W), (s.y % H), s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });
    }

    function drawParticles() {
      particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife);
      particlesRef.current.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.vy -= 0.01;
        p.life++;
        const progress = p.life / p.maxLife;
        p.opacity = (1 - progress) * 0.9;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    const render = () => {
      timeRef.current++;
      const t = timeRef.current;

      const bg = ctx.createRadialGradient(W / 2, H * 0.38, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
      bg.addColorStop(0, "#080c1c");
      bg.addColorStop(0.5, "#04060f");
      bg.addColorStop(1, "#020308");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      drawStars(t);
      drawSilhouette();
      drawChakra(t);
      spawnParticles(t);
      drawParticles();

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [mounted]);

  if (!mounted) return null;

  const current = SCRIPT[step];

  // --- Language Picker Screen ---
  if (!langChosen) {
    return (
      <div style={{
        width: "100vw", height: "100vh",
        background: "linear-gradient(135deg, #020308 0%, #080c1c 60%, #04060f 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 0, position: "relative", overflow: "hidden",
      }}>
        {/* Animated background glow */}
        <div style={{
          position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
          animation: "langGlowPulse 3s ease-in-out infinite",
        }} />
        <div style={{ position: "absolute", top: "3vh", left: "5vw", opacity: 0.7, zIndex: 10 }}>
          <VannateLogo size={34} showText={true} glow={true} />
        </div>
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
          {/* Dharma Chakra symbol */}
          <div style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", marginBottom: 4, filter: "drop-shadow(0 0 24px rgba(245,158,11,0.6))" }}>☸</div>
          <div style={{ textAlign: "center" }}>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 900,
              color: "#f59e0b", letterSpacing: "0.05em", marginBottom: 8,
              textShadow: "0 0 40px rgba(245,158,11,0.4)",
            }}>VANNATE AI</h1>
            <p style={{
              color: "rgba(255,255,255,0.45)", fontSize: "clamp(0.8rem,1.4vw,1rem)",
              letterSpacing: "0.18em", textTransform: "uppercase",
            }}>Choose Your Language · अपनी भाषा चुनें · আপনার ভাষা বেছে নিন</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "min(340px, 90vw)" }}>
            {LANG_OPTIONS.map(opt => (
              <button
                key={opt.code}
                onClick={() => handleLangSelect(opt.code)}
                style={{
                  display: "flex", alignItems: "center", gap: 18,
                  padding: "18px 28px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  borderRadius: 16, cursor: "pointer",
                  backdropFilter: "blur(14px)",
                  transition: "all 0.28s ease",
                  width: "100%",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(245,158,11,0.12)";
                  e.currentTarget.style.borderColor = "rgba(245,158,11,0.6)";
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(245,158,11,0.15)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(245,158,11,0.25)";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span style={{ fontSize: "1.8rem" }}>{opt.flag}</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: "1.05rem", letterSpacing: "0.03em" }}>{opt.native}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>{opt.label}</div>
                </div>
                <span style={{ marginLeft: "auto", color: "rgba(245,158,11,0.5)", fontSize: "1.2rem" }}>→</span>
              </button>
            ))}
          </div>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.72rem", letterSpacing: "0.1em", marginTop: 8 }}>
            AI voice narration enabled · वॉयस नैरेशन सक्षम · কণ্ঠ বর্ণনা সক্ষম
          </p>
        </div>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&display=swap');
          @keyframes langGlowPulse {
            0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
            50% { opacity: 1; transform: translateX(-50%) scale(1.1); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100vw", height: "100vh",
        background: "#020308",
        overflow: "hidden", position: "relative",
        opacity: pageOut ? 0 : 1,
        transition: "opacity 1s ease-in-out",
        cursor: current.isTitle ? "pointer" : "default",
      }}
      onClick={current.isTitle ? handleEnter : undefined}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 38%, transparent 28%, rgba(2,3,8,0.55) 80%)",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "35%",
        background: "linear-gradient(to bottom, transparent, rgba(2,3,8,0.98))",
        pointerEvents: "none",
      }} />

      <div
        key={step}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "0 6vw 8vh",
          display: "flex", flexDirection: "column",
          alignItems: current.isTitle ? "center" : "flex-start",
          textAlign: current.isTitle ? "center" : "left",
          opacity: fadeOut ? 0 : fadeIn ? 0 : 1,
          transform: fadeOut ? "translateY(20px)" : fadeIn ? "translateY(20px)" : "translateY(0)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
          animation: !fadeIn && !fadeOut ? "introTextIn 1s ease forwards" : "none",
        }}
      >
        {/* Sanskrit Devanagari Primary */}
        <p style={{
          fontFamily: current.isTitle ? "'Playfair Display', Georgia, serif" : "'Noto Sans Devanagari', Georgia, serif",
          fontSize: current.isTitle
            ? "clamp(3.5rem, 8vw, 7rem)"
            : "clamp(1.6rem, 3vw, 2.6rem)",
          fontWeight: current.isTitle ? 900 : 600,
          color: current.isTitle ? "#f59e0b" : "#FDE68A",
          lineHeight: 1.3,
          marginBottom: "0.5rem",
          textShadow: current.isTitle
            ? "0 0 60px rgba(245,158,11,0.5), 0 4px 30px rgba(0,0,0,0.9)"
            : "0 0 40px rgba(245,158,11,0.35), 0 4px 20px rgba(0,0,0,0.9)",
          letterSpacing: current.isTitle ? "0.06em" : "0.02em",
        }}>
          {current.primary}
        </p>

        {/* Roman Transliteration (for non-title slides) */}
        {!current.isTitle && (current as any).transliteration && (
          <p style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(0.9rem, 1.4vw, 1.15rem)",
            color: "rgba(16,185,129,0.85)",
            marginBottom: "1rem",
            letterSpacing: "0.04em",
          }}>
            {(current as any).transliteration}
          </p>
        )}

        {/* English Translation */}
        <p style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: current.isTitle
            ? "clamp(1rem, 1.8vw, 1.4rem)"
            : "clamp(0.9rem, 1.4vw, 1.1rem)",
          color: current.isTitle ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.6)",
          lineHeight: 1.7,
          marginBottom: current.sub ? "0.5rem" : 0,
          fontWeight: 400,
          maxWidth: current.isTitle ? "600px" : "780px",
          letterSpacing: current.isTitle ? "0.12em" : "0",
          textTransform: current.isTitle ? "uppercase" : "none",
        }}>
          {current.secondary}
        </p>

        {/* Source Attribution & Tech Application */}
        {current.sub && (
          <p style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(0.7rem, 0.9vw, 0.85rem)",
            color: "rgba(245,158,11,0.65)",
            letterSpacing: "0.08em",
            marginTop: 4,
            maxWidth: 780,
            lineHeight: 1.5,
          }}>
            {current.sub}
          </p>
        )}
        {current.isTitle && (
          <button
            onClick={handleEnter}
            style={{
              marginTop: "2.5rem",
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.45)",
              color: "#f59e0b",
              padding: "14px 42px",
              fontSize: "0.88rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              borderRadius: "50px",
              cursor: "pointer",
              backdropFilter: "blur(12px)",
              boxShadow: "0 0 30px rgba(245,158,11,0.12)",
              transition: "all 0.35s ease",
              animation: "ctaPulse 2.5s ease-in-out infinite",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(245,158,11,0.22)";
              e.currentTarget.style.boxShadow = "0 0 50px rgba(245,158,11,0.35)";
              e.currentTarget.style.transform = "scale(1.04)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(245,158,11,0.1)";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(245,158,11,0.12)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Awaken System ✦
          </button>
        )}
      </div>

      <div style={{
        position: "absolute", bottom: "3.5vh", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", gap: "8px",
      }}>
        {SCRIPT.map((_, i) => (
          <div key={i} style={{
            width: i === step ? "24px" : "6px",
            height: "6px", borderRadius: "3px",
            background: i === step ? "#f59e0b" : "rgba(255,255,255,0.2)",
            transition: "all 0.4s ease",
          }} />
        ))}
      </div>

      {/* Top Logo Watermark */}
      <div style={{
        position: "absolute", top: "3vh", left: "5vw",
        display: "flex", alignItems: "center", gap: "12px",
        opacity: 0.8,
        zIndex: 10,
      }}>
        <VannateLogo size={34} showText={true} glow={true} />
      </div>

      {!current.isTitle && (
        <button
          onClick={handleEnter}
          style={{
            position: "absolute", top: "3vh", right: "5vw",
            background: "none", border: "none",
            color: "rgba(255,255,255,0.3)",
            fontSize: "0.8rem", letterSpacing: "0.15em",
            textTransform: "uppercase", cursor: "pointer",
            transition: "color 0.3s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
        >
          Skip →
        </button>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');
        @keyframes introTextIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(245,158,11,0.12); }
          50%       { box-shadow: 0 0 45px rgba(245,158,11,0.28); }
        }
      `}</style>
    </div>
  );
}
