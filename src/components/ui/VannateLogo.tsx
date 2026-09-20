"use client";
import React from "react";

interface VannateLogoProps {
  size?: number;
  showText?: boolean;
  glow?: boolean;
  className?: string;
  animate?: boolean;
}

export default function VannateLogo({
  size = 32,
  showText = false,
  glow = true,
  className = "",
  animate = false
}: VannateLogoProps) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 ${className}`}
      style={{ display: "inline-flex", alignItems: "center", gap: 10, userSelect: "none" }}
    >
      <div
        style={{
          width: size,
          height: size,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          filter: glow ? "drop-shadow(0 0 12px rgba(245, 158, 11, 0.45)) drop-shadow(0 0 6px rgba(16, 185, 129, 0.3))" : "none"
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transformOrigin: "center center",
            transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            animation: animate ? "spin 24s linear infinite" : "none"
          }}
        >
          <defs>
            {/* Golden Solar Gradient */}
            <linearGradient id="goldChakra" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="80%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            {/* Neon Cyan/Teal Protective Shield Gradient */}
            <linearGradient id="tealShield" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Sacred Core Glow */}
            <radialGradient id="sacredCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#10B981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#030712" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Ambient Glow */}
          <circle cx="50" cy="50" r="44" fill="url(#sacredCore)" />

          {/* Outer Sudarshana Chakra Spokes (8 Sacred Petals/Spokes) */}
          <g stroke="url(#goldChakra)" strokeWidth="2.5" strokeLinecap="round">
            {/* Spoke 0 deg */}
            <line x1="50" y1="6" x2="50" y2="18" />
            <polygon points="50,2 47,10 53,10" fill="url(#goldChakra)" />

            {/* Spoke 45 deg */}
            <line x1="81.1" y1="18.9" x2="72.6" y2="27.4" />
            <polygon points="84,16 77,20 81,25" fill="url(#goldChakra)" />

            {/* Spoke 90 deg */}
            <line x1="94" y1="50" x2="82" y2="50" />
            <polygon points="98,50 90,47 90,53" fill="url(#goldChakra)" />

            {/* Spoke 135 deg */}
            <line x1="81.1" y1="81.1" x2="72.6" y2="72.6" />
            <polygon points="84,84 81,75 77,80" fill="url(#goldChakra)" />

            {/* Spoke 180 deg */}
            <line x1="50" y1="94" x2="50" y2="82" />
            <polygon points="50,98 53,90 47,90" fill="url(#goldChakra)" />

            {/* Spoke 225 deg */}
            <line x1="18.9" y1="81.1" x2="27.4" y2="72.6" />
            <polygon points="16,84 23,80 19,75" fill="url(#goldChakra)" />

            {/* Spoke 270 deg */}
            <line x1="6" y1="50" x2="18" y2="50" />
            <polygon points="2,50 10,53 10,47" fill="url(#goldChakra)" />

            {/* Spoke 315 deg */}
            <line x1="18.9" y1="18.9" x2="27.4" y2="27.4" />
            <polygon points="16,16 19,25 23,20" fill="url(#goldChakra)" />
          </g>

          {/* Outer Chakra Rim */}
          <circle
            cx="50"
            cy="50"
            r="32"
            stroke="url(#goldChakra)"
            strokeWidth="2"
            strokeDasharray="4 2"
            fill="none"
          />

          {/* Inner Protective Shield (Octagon / Hexagon Sacred Boundary) */}
          <polygon
            points="50,22 70,30 78,50 70,70 50,78 30,70 22,50 30,30"
            stroke="url(#tealShield)"
            strokeWidth="2.5"
            fill="#030712"
            fillOpacity="0.85"
          />

          {/* Golden 'V' Monogram of VANNATE */}
          <path
            d="M36 34 L50 64 L64 34"
            stroke="url(#goldChakra)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Inner Light Core (Teal Seed of Compassion) */}
          <circle cx="50" cy="48" r="3.5" fill="#34D399" />
          <circle cx="50" cy="48" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>

      {showText && (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontWeight: 800,
              fontSize: size * 0.58,
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #FFFFFF 30%, #F59E0B 70%, #10B981 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            VANNATE
          </span>
          <span
            style={{
              fontSize: 9,
              letterSpacing: "0.22em",
              color: "#94A3B8",
              fontWeight: 600,
              textTransform: "uppercase",
              marginTop: 2
            }}
          >
            Autonomous OS
          </span>
        </div>
      )}
    </div>
  );
}
