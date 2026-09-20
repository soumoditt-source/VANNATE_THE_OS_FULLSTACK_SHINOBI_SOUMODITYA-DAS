"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Heart, TreePine, Award, MapPin, Clock, ThumbsUp, Share2, Leaf } from "lucide-react";

const F = motion.div;

const FEED = [
  {
    user: "Arjun Mehta", avatar: "AM", time: "2 hours ago",
    text: "Just triggered my first verified SOS for a live electric wire near Park Street. Help arrived in 4 minutes. CivicLens literally saved two people's lives today. 🙏",
    likes: 247, comments: 34, karma: 500, tree: true, type: "sos",
  },
  {
    user: "Priya Sharma", avatar: "PS", time: "5 hours ago",
    text: "Donated ₹2,500 to Flood Relief through Vannate. Got my trust QR instantly — I can track exactly where my money goes. This is how transparency should work!",
    likes: 189, comments: 21, karma: 300, tree: false, type: "donate",
  },
  {
    user: "Ravi Kumar", avatar: "RK", time: "Yesterday",
    text: "Completed 4 hours of food distribution at the Sector 7 relief camp as a volunteer. 200 families served. The dispatch system routed me perfectly via GPS.",
    likes: 312, comments: 45, karma: 400, tree: true, type: "volunteer",
  },
  {
    user: "Meera Dutta", avatar: "MD", time: "2 days ago",
    text: "3rd blood donation this year through Vannate's Smart Blood Bank. Got matched with a patient in 6 minutes! Feeling grateful to help. #BloodHero 🩸",
    likes: 456, comments: 67, karma: 350, tree: true, type: "blood",
  },
];

const TYPE_COLOR: Record<string, string> = { sos: "#ef4444", donate: "#3b82f6", volunteer: "#10b981", blood: "#8b5cf6" };
const TYPE_LABEL: Record<string, string> = { sos: "SOS Report", donate: "Donation", volunteer: "Volunteer", blood: "Blood Donor" };

export default function CommunityPage() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px 80px" }}>

        <F initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(236,72,153,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Heart size={20} color="#ec4899" />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800 }}>Community Impact Feed</h1>
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Real stories from real people making a difference</p>
            </div>
          </div>

          {/* Impact Banner */}
          <div style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(245,158,11,0.05))", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 14, padding: "16px 20px", display: "flex", justifyContent: "space-around", marginTop: 20, marginBottom: 32, textAlign: "center" }}>
            {[
              { label: "Lives Saved", value: "2,847", icon: Heart, color: "#ef4444" },
              { label: "Trees Planted", value: "1,204", icon: TreePine, color: "#10b981" },
              { label: "Active Heroes", value: "4,291", icon: Award, color: "#f59e0b" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <s.icon size={16} color={s.color} />
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </F>

        {/* Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {FEED.map((post, i) => (
            <F key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
              <div className="glass" style={{ padding: "20px 24px" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: TYPE_COLOR[post.type] + "20", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: TYPE_COLOR[post.type] }}>
                    {post.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{post.user}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                      <Clock size={10} /> {post.time}
                    </div>
                  </div>
                  <span style={{ padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700, background: TYPE_COLOR[post.type] + "15", color: TYPE_COLOR[post.type] }}>
                    {TYPE_LABEL[post.type]}
                  </span>
                </div>

                {/* Content */}
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.9)", marginBottom: 14 }}>{post.text}</p>

                {/* Karma + Tree Badge */}
                <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                  <span style={{ padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
                    +{post.karma} Karma
                  </span>
                  {post.tree && (
                    <span style={{ padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: "rgba(16,185,129,0.1)", color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
                      <Leaf size={10} /> Tree Planted
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 24, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 12 }}>
                  <button
                    onClick={() => {
                      const next = new Set(likedPosts);
                      if (next.has(i)) next.delete(i); else next.add(i);
                      setLikedPosts(next);
                    }}
                    style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: likedPosts.has(i) ? "#ef4444" : "var(--text-muted)" }}
                  >
                    <ThumbsUp size={14} /> {post.likes + (likedPosts.has(i) ? 1 : 0)}
                  </button>
                  <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>
                    <MessageCircle size={14} /> {post.comments}
                  </button>
                  <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>
                    <Share2 size={14} /> Share
                  </button>
                </div>
              </div>
            </F>
          ))}
        </div>
      </div>
    </div>
  );
}
