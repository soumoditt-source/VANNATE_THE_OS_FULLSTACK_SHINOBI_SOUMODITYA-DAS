"use client";
/**
 * LiveIncidentMap
 * ───────────────
 * Real data sources:
 *  • User GPS via navigator.geolocation
 *  • Overpass API (OSM) — real hospitals, fire stations, police near user
 *  • GDACS RSS feed (UN) — real global disaster alerts
 *  • Nominatim — reverse geocode (free)
 *  • OpenStreetMap iFrame — real tile map centred on user's location
 *
 * Zero AI wrappers. Zero paid APIs.
 */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, AlertTriangle, ShieldCheck, Activity, Radio, Crosshair, Loader2, RefreshCw, Heart, Flame, Users } from "lucide-react";
import { useGeolocation, type GeoCoords } from "@/hooks/useDevicePermissions";

const F = motion.div;

interface NearbyPOI {
  id: number;
  type: "hospital" | "fire_station" | "police" | "ngo" | "pharmacy";
  name: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  tags?: Record<string, string>;
}

interface GdacsAlert {
  title: string;
  type: string;
  alertLevel: string;
  country: string;
  date: string;
  url: string;
}

// ── Overpass API query for real emergency POIs ────────────────────────────
async function fetchNearbyEmergencyPOIs(lat: number, lng: number, radiusKm = 10): Promise<NearbyPOI[]> {
  const r = radiusKm * 1000; // metres
  const query = `
    [out:json][timeout:20];
    (
      node["amenity"="hospital"](around:${r},${lat},${lng});
      node["amenity"="fire_station"](around:${r},${lat},${lng});
      node["amenity"="police"](around:${r},${lat},${lng});
      node["amenity"="pharmacy"](around:${r},${lat},${lng});
      node["amenity"="social_facility"](around:${r},${lat},${lng});
    );
    out body;
  `;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: "data=" + encodeURIComponent(query),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (!res.ok) throw new Error("Overpass API error");
  const data = await res.json();

  return (data.elements || [])
    .filter((e: any) => e.lat && e.lon)
    .map((e: any): NearbyPOI => {
      const amenity = e.tags?.amenity || "ngo";
      const typeMap: Record<string, NearbyPOI["type"]> = {
        hospital: "hospital", fire_station: "fire_station",
        police: "police", pharmacy: "pharmacy", social_facility: "ngo",
      };
      const dist = haversine(lat, lng, e.lat, e.lon);
      return {
        id: e.id,
        type: typeMap[amenity] || "ngo",
        name: e.tags?.name || e.tags?.["name:en"] || `${amenity.replace("_", " ")} (unnamed)`,
        lat: e.lat,
        lng: e.lon,
        distanceKm: dist,
        tags: e.tags,
      };
    })
    .sort((a: NearbyPOI, b: NearbyPOI) => (a.distanceKm || 99) - (b.distanceKm || 99))
    .slice(0, 20);
}

// ── GDACS RSS disaster alerts (UN, 100% free) ─────────────────────────────
async function fetchGdacsAlerts(): Promise<GdacsAlert[]> {
  // Use a CORS proxy for the RSS feed (allorigins is free)
  const url = "https://www.gdacs.org/xml/rss.xml";
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

  try {
    const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const json = await res.json();
    const text: string = json.contents || "";

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "application/xml");
    const items = Array.from(doc.querySelectorAll("item")).slice(0, 6);

    return items.map((item): GdacsAlert => ({
      title: item.querySelector("title")?.textContent?.trim() || "Disaster Alert",
      type: item.querySelector("gdacs\\:eventtype, eventtype")?.textContent?.trim() || "EQ",
      alertLevel: item.querySelector("gdacs\\:alertlevel, alertlevel")?.textContent?.trim() || "Green",
      country: item.querySelector("gdacs\\:country, country")?.textContent?.trim() || "Global",
      date: item.querySelector("pubDate")?.textContent?.trim() || "",
      url: item.querySelector("link")?.textContent?.trim() || "#",
    }));
  } catch {
    return [];
  }
}

// ── Haversine distance (km) ───────────────────────────────────────────────
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2));
}

const TYPE_META: Record<NearbyPOI["type"], { icon: any; color: string; label: string }> = {
  hospital:     { icon: Heart,   color: "#ef4444", label: "Hospital" },
  fire_station: { icon: Flame,   color: "#f97316", label: "Fire Station" },
  police:       { icon: ShieldCheck, color: "#3b82f6", label: "Police" },
  pharmacy:     { icon: Activity,    color: "#10b981", label: "Pharmacy" },
  ngo:          { icon: Users,       color: "#8b5cf6", label: "NGO / Shelter" },
};

const ALERT_COLORS: Record<string, string> = {
  Red: "#ef4444", Orange: "#f97316", Green: "#10b981",
};

// ─────────────────────────────────────────────────────────────────────────
export default function LiveIncidentMap() {
  const geo = useGeolocation();
  const [pois, setPois] = useState<NearbyPOI[]>([]);
  const [gdacs, setGdacs] = useState<GdacsAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [poisLoading, setPoisLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<NearbyPOI | null>(null);
  const [activeCoords, setActiveCoords] = useState<GeoCoords | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // ── Load real data ────────────────────────────────────────────────────
  const loadAllData = useCallback(async (coords: GeoCoords) => {
    setPoisLoading(true);
    setError(null);
    try {
      const [poisData, gdacsData] = await Promise.allSettled([
        fetchNearbyEmergencyPOIs(coords.lat, coords.lng, 15),
        fetchGdacsAlerts(),
      ]);
      if (poisData.status === "fulfilled") setPois(poisData.value);
      if (gdacsData.status === "fulfilled") setGdacs(gdacsData.value);
      setLastUpdated(new Date().toLocaleTimeString("en-IN"));
    } catch (err: any) {
      setError("Failed to fetch nearby data. Check connection.");
    } finally {
      setPoisLoading(false);
    }
  }, []);

  const handleLocate = useCallback(async () => {
    setLoading(true);
    const coords = await geo.requestLocation();
    setLoading(false);
    if (coords) {
      setActiveCoords(coords);
      await loadAllData(coords);
    }
  }, [geo, loadAllData]);

  // ── Auto-load on mount if permission already granted ──────────────────
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then(result => {
        if (result.state === "granted") handleLocate();
      }).catch(() => {});
    }
  }, []);

  // ── Map URL ───────────────────────────────────────────────────────────
  const mapCoords = selectedPoi
    ? { lat: selectedPoi.lat, lng: selectedPoi.lng }
    : activeCoords
    ? { lat: activeCoords.lat, lng: activeCoords.lng }
    : { lat: 22.5726, lng: 88.3639 }; // Kolkata fallback

  const delta = 0.025;
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapCoords.lng - delta},${mapCoords.lat - delta},${mapCoords.lng + delta},${mapCoords.lat + delta}&layer=mapnik&marker=${mapCoords.lat},${mapCoords.lng}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, padding: "12px 16px", background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(20,184,166,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Radio size={18} color="#14b8a6" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              Live Emergency Grid
              {activeCoords && (
                <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 6, background: "rgba(16,185,129,0.15)", color: "#10b981", fontWeight: 800 }}>
                  YOUR LOCATION
                </span>
              )}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {activeCoords
                ? `${activeCoords.lat.toFixed(4)}°N ${activeCoords.lng.toFixed(4)}°E · ${activeCoords.city || ""}${lastUpdated ? ` · Updated ${lastUpdated}` : ""}`
                : "Grant location for real-time nearby data"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {activeCoords && (
            <button onClick={() => loadAllData(activeCoords)} disabled={poisLoading}
              style={{ padding: "7px 12px", borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <RefreshCw size={12} style={{ animation: poisLoading ? "spin 1s linear infinite" : "none" }} />
              {poisLoading ? "Updating…" : "Refresh"}
            </button>
          )}
          <button onClick={handleLocate} disabled={loading}
            className="btn-primary" style={{ fontSize: 12, padding: "7px 14px" }}>
            {loading
              ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Locating…</>
              : <><Crosshair size={13} /> {activeCoords ? "Re-Locate" : "Find My Location"}</>}
          </button>
        </div>
      </div>

      {/* ── Permission denied ────────────────────────────────────────────── */}
      {geo.state === "denied" && (
        <F initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ padding: "14px 18px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 13, color: "#ef4444", marginBottom: 3 }}>Location Permission Denied</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{geo.error}</p>
            </div>
          </div>
        </F>
      )}

      {/* ── Map viewport ─────────────────────────────────────────────────── */}
      <div style={{ position: "relative", width: "100%", height: 400, borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
        <iframe
          title="Live Emergency Map"
          src={osmUrl}
          width="100%" height="100%"
          style={{ border: 0, filter: "brightness(0.88) contrast(1.05) saturate(0.9)" }}
          frameBorder={0}
          scrolling="no"
        />

        {/* HUD */}
        <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(2,4,14,0.9)", backdropFilter: "blur(12px)", border: "1px solid rgba(20,184,166,0.25)", borderRadius: 9, padding: "9px 14px", fontSize: 11, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#14b8a6", fontWeight: 800, marginBottom: 4 }}>
            <div style={{ width: 6, height: 6, background: "#10b981", borderRadius: "50%", animation: "ocr-pulse 1.5s infinite" }} />
            LIVE OVERPASS / OSM TILE FEED
          </div>
          {activeCoords && (
            <div style={{ color: "rgba(255,255,255,0.6)" }}>
              {activeCoords.lat.toFixed(5)}°N {activeCoords.lng.toFixed(5)}°E
              {activeCoords.accuracy && <span> · ±{activeCoords.accuracy}m</span>}
            </div>
          )}
          <div style={{ color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
            {pois.length} emergency services found
          </div>
        </div>

        {selectedPoi && (
          <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, background: "rgba(2,4,14,0.92)", backdropFilter: "blur(12px)", border: `1px solid ${TYPE_META[selectedPoi.type].color}40`, borderRadius: 10, padding: "10px 14px", zIndex: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TYPE_META[selectedPoi.type].color, marginBottom: 2 }}>
                  {TYPE_META[selectedPoi.type].label.toUpperCase()}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedPoi.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                  {selectedPoi.distanceKm} km away · {selectedPoi.lat.toFixed(4)}°N {selectedPoi.lng.toFixed(4)}°E
                </div>
              </div>
              <a href={`https://www.openstreetmap.org/node/${selectedPoi.id}`} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 11, color: "var(--brand)", textDecoration: "none", fontWeight: 700, whiteSpace: "nowrap" }}>
                Open OSM ↗
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ── Nearby POI list ───────────────────────────────────────────────── */}
      {poisLoading && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border)" }}>
          <Loader2 size={16} color="var(--brand)" style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Fetching real emergency services from OpenStreetMap Overpass API…</span>
        </div>
      )}

      {pois.length > 0 && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 8 }}>
            <MapPin size={14} color="var(--brand)" />
            REAL NEARBY EMERGENCY SERVICES ({pois.length} found via OSM Overpass)
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
            {pois.map(poi => {
              const meta = TYPE_META[poi.type];
              const Icon = meta.icon;
              return (
                <button key={poi.id} onClick={() => setSelectedPoi(poi === selectedPoi ? null : poi)}
                  style={{
                    padding: "10px 14px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                    background: selectedPoi?.id === poi.id ? `${meta.color}12` : "var(--surface)",
                    border: `1px solid ${selectedPoi?.id === poi.id ? meta.color + "60" : "var(--border)"}`,
                    transition: "all 0.2s",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: `${meta.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={14} color={meta.color} />
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: meta.color, textTransform: "uppercase" }}>{meta.label}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", lineHeight: 1.3, marginBottom: 4 }}>
                    {poi.name.length > 40 ? poi.name.slice(0, 37) + "…" : poi.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {poi.distanceKm} km away
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── GDACS Global Disaster Alerts ──────────────────────────────────── */}
      {gdacs.length > 0 && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={14} color="#f97316" />
            GDACS GLOBAL DISASTER ALERTS (UN Real-Time Feed)
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {gdacs.map((alert, i) => {
              const alertColor = ALERT_COLORS[alert.alertLevel] || "#6b7280";
              return (
                <a key={i} href={alert.url} target="_blank" rel="noopener noreferrer"
                  style={{ textDecoration: "none", display: "block", padding: "12px 16px", background: "var(--surface)", borderRadius: 10, border: `1px solid ${alertColor}30`, borderLeft: `3px solid ${alertColor}`, transition: "background 0.2s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 3 }}>{alert.title}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {alert.country} · {alert.date ? new Date(alert.date).toLocaleDateString("en-IN") : ""}
                      </div>
                    </div>
                    <span style={{ flexShrink: 0, padding: "3px 8px", borderRadius: 6, background: `${alertColor}18`, color: alertColor, fontSize: 10, fontWeight: 800 }}>
                      {alert.alertLevel.toUpperCase()}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 8 }}>Source: GDACS (UN Office for the Coordination of Humanitarian Affairs)</p>
        </div>
      )}

      {error && (
        <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.06)", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)", fontSize: 12, color: "#ef4444" }}>
          {error}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ocr-pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
      `}</style>
    </div>
  );
}
