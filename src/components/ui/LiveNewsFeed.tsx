"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, ExternalLink, Activity } from "lucide-react";

type NewsItem = {
  id?: string;
  title: string;
  url: string;
  source: { name: string };
  publishedAt: string;
};

export default function LiveNewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          setNews(data.articles);
        }
      } catch (err) {
        console.warn("News feed fetch warning:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  useEffect(() => {
    if (news.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % news.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [news]);

  return (
    <div
      style={{
        background: "rgba(20, 184, 166, 0.06)",
        border: "1px solid rgba(20, 184, 166, 0.25)",
        borderRadius: "16px",
        padding: "18px 24px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", animation: "newsPulse 1.5s infinite" }} />
          <h3 style={{ color: "#14b8a6", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
            <Radio size={14} /> Live Disaster & Emergency Wire (Real API)
          </h3>
        </div>
        <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>
          Auto-sync 300s
        </span>
      </div>

      <div style={{ minHeight: "68px", position: "relative" }}>
        {loading ? (
          <div style={{ color: "var(--text-muted)", fontSize: "13px", display: "flex", alignItems: "center", gap: 8, padding: "12px 0" }}>
            <Activity size={16} className="animate-spin" /> Intercepting real disaster signals across Bharat...
          </div>
        ) : news.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.4 }}
            >
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px", display: "flex", gap: 12 }}>
                <span style={{ color: "#34d399", fontWeight: 700 }}>{news[currentIndex].source.name}</span>
                <span>{new Date(news[currentIndex].publishedAt).toLocaleDateString()}</span>
              </div>
              <a
                href={news[currentIndex].url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 700,
                  lineHeight: 1.5,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {news[currentIndex].title}
                <ExternalLink size={12} color="#14b8a6" />
              </a>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>Monitoring national disaster telemetry feeds.</div>
        )}
      </div>

      <style>{`
        @keyframes newsPulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  );
}
