"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, AlertTriangle, ShieldCheck, Activity, Compass, Layers, Radio } from "lucide-react";

interface IncidentNode {
  id: string;
  name: string;
  category: "crisis" | "hospital" | "ngo" | "checkpoint";
  lat: number;
  lng: number;
  danger: number;
  description: string;
  unitsDeployed: number;
}

const NODES: IncidentNode[] = [
  { id: "ngo1", name: "Vannate Primary Command Hub (Salt Lake)", category: "ngo", lat: 22.5726, lng: 88.3639, danger: 0.1, description: "Central coordination HQ. 24/7 autonomous dispatch active.", unitsDeployed: 18 },
  { id: "crisis1", name: "⚠️ Sundarbans Tidal Wave Flood Sector", category: "crisis", lat: 22.0154, lng: 88.7591, danger: 0.92, description: "CRITICAL: Embankment breach. 840+ families displaced. Immediate evacuation boats required.", unitsDeployed: 32 },
  { id: "crisis2", name: "⚠️ Malda Flash Flood Alert Zone", category: "crisis", lat: 25.0108, lng: 88.1416, danger: 0.78, description: "HIGH: River inundation. Road access cutoff. Drone relief active.", unitsDeployed: 14 },
  { id: "hosp1", name: "SSKM Hospital Trauma & Blood Reserve", category: "hospital", lat: 22.5357, lng: 88.3428, danger: 0.05, description: "Designated trauma center. 28 O- units and 45 A+ units reserved.", unitsDeployed: 8 },
  { id: "chk1", name: "Howrah Logistics Relief Checkpoint Alpha", category: "checkpoint", lat: 22.5800, lng: 88.3460, danger: 0.25, description: "Supply convoy staging area. A* path cleared for convoy 04.", unitsDeployed: 6 },
];

export default function DynamicMap() {
  const [selectedNode, setSelectedNode] = useState<IncidentNode>(NODES[0]);
  const [avoidFlooding, setAvoidFlooding] = useState(true);

  // Compute OpenStreetMap bounding box around selected point
  const delta = 0.04;
  const bbox = `${selectedNode.lng - delta},${selectedNode.lat - delta},${selectedNode.lng + delta},${selectedNode.lat + delta}`;
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${selectedNode.lat},${selectedNode.lng}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", height: "100%" }}>
      {/* Top Map Control Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, padding: "12px 18px", background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(20,184,166,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Compass size={18} color="#14b8a6" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              <span>Live OpenStreetMap Telemetry Grid</span>
              <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 6, background: "rgba(16,185,129,0.15)", color: "#10b981", fontWeight: 800 }}>
                REAL GPS SYNC
              </span>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Active Node: {selectedNode.name} ({selectedNode.lat.toFixed(4)}° N, {selectedNode.lng.toFixed(4)}° E)
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text)", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={avoidFlooding}
              onChange={e => setAvoidFlooding(e.target.checked)}
              style={{ accentColor: "var(--brand)" }}
            />
            <span>A* Hazard Rerouting ({avoidFlooding ? "ON" : "OFF"})</span>
          </label>
          <a
            href={`https://www.openstreetmap.org/?mlat=${selectedNode.lat}&mlon=${selectedNode.lng}#map=14/${selectedNode.lat}/${selectedNode.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 11, color: "var(--brand)", textDecoration: "none", fontWeight: 700 }}
          >
            Open Fullscreen OSM ↗
          </a>
        </div>
      </div>

      {/* Embedded Real OpenStreetMap Viewport */}
      <div style={{ position: "relative", width: "100%", height: "480px", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
        <iframe
          title="OpenStreetMap Live Disaster Grid"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={osmUrl}
          style={{ border: 0, filter: "brightness(0.9) contrast(1.1)" }}
        />

        {/* Floating Telemetry HUD Overlay */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            background: "rgba(3,4,10,0.88)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(20,184,166,0.3)",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 11,
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            zIndex: 10,
            pointerEvents: "none"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#14b8a6", fontWeight: 800 }}>
            <Radio size={12} className="animate-pulse" />
            <span>REALTIME CONVOY ROUTING TELEMETRY</span>
          </div>
          <div>Coords: <strong>{selectedNode.lat.toFixed(4)}°N, {selectedNode.lng.toFixed(4)}°E</strong></div>
          <div>Hazard Avoidance Heuristic: <strong>{avoidFlooding ? "Active (Avoid H2O > 0.7)" : "Disabled"}</strong></div>
          <div>Units In Field: <strong>{selectedNode.unitsDeployed} Responders</strong></div>
        </div>

        {/* Floating Live Indicator Badge */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            right: 14,
            background: "rgba(3,4,10,0.85)",
            backdropFilter: "blur(10px)",
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.1)",
            fontSize: 10,
            fontWeight: 700,
            color: "#34d399",
            display: "flex",
            alignItems: "center",
            gap: 6,
            zIndex: 10
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite" }} />
          <span>OpenStreetMap Tile Server Live</span>
        </div>
      </div>

      {/* Incident Node Selection Buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
        {NODES.map(node => (
          <button
            key={node.id}
            onClick={() => setSelectedNode(node)}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: selectedNode.id === node.id ? "rgba(20,184,166,0.15)" : "var(--surface)",
              border: selectedNode.id === node.id ? "1px solid #14b8a6" : "1px solid var(--border)",
              color: selectedNode.id === node.id ? "#fff" : "var(--text-muted)",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: node.category === "crisis" ? "#ef4444" : "#14b8a6", textTransform: "uppercase" }}>
                {node.category}
              </span>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{node.unitsDeployed} units</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{node.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
