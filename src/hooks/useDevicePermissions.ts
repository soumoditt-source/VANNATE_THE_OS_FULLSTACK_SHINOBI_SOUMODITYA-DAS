"use client";
/**
 * useDevicePermissions
 * ────────────────────
 * Bulletproof cross-device hook for Camera + Geolocation.
 * Works on: iOS Safari, Android Chrome, Desktop Chrome/Firefox/Edge,
 *           tablets, PWAs. HTTPS required for camera on mobile.
 */
import { useState, useCallback, useRef } from "react";

export type PermissionState = "idle" | "requesting" | "granted" | "denied" | "unavailable";

export interface GeoCoords {
  lat: number;
  lng: number;
  accuracy: number;
  city?: string;
  country?: string;
}

// ── Camera ─────────────────────────────────────────────────────────────────
export function useCameraPermission() {
  const [state, setState] = useState<PermissionState>("idle");
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const requestCamera = useCallback(async (videoEl: HTMLVideoElement | null) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setState("unavailable");
      setError("Camera API not supported on this browser. Try Chrome or Safari.");
      return null;
    }

    setState("requesting");
    setError(null);

    // Constraint cascade — most specific → most permissive (covers all devices)
    const constraintSets: MediaStreamConstraints[] = [
      { video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } } },
      { video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } } },
      { video: { facingMode: "user" } },
      { video: true },
    ];

    let stream: MediaStream | null = null;
    for (const constraints of constraintSets) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        break;
      } catch (err: any) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          // User denied — stop trying
          setState("denied");
          setError(
            "Camera access was denied. Please tap the camera/lock icon in your browser's address bar and enable camera permission, then reload."
          );
          return null;
        }
        // Otherwise try next constraint set
      }
    }

    if (!stream) {
      setState("denied");
      setError("No camera found on this device, or camera is in use by another app.");
      return null;
    }

    streamRef.current = stream;
    setState("granted");

    if (videoEl) {
      videoEl.srcObject = stream;
      videoEl.setAttribute("playsinline", "true"); // critical for iOS
      videoEl.setAttribute("autoplay", "true");
      videoEl.setAttribute("muted", "true");
      try { await videoEl.play(); } catch (_) {}
    }

    return stream;
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setState("idle");
  }, []);

  return { state, error, requestCamera, stopCamera, streamRef };
}

// ── Geolocation ────────────────────────────────────────────────────────────
export function useGeolocation() {
  const [state, setState] = useState<PermissionState>("idle");
  const [coords, setCoords] = useState<GeoCoords | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(async (): Promise<GeoCoords | null> => {
    if (!navigator.geolocation) {
      setState("unavailable");
      setError("Geolocation is not supported on this browser.");
      return null;
    }

    setState("requesting");
    setError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const base: GeoCoords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
          };

          // Reverse geocode with Nominatim (free, no key required)
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${base.lat}&lon=${base.lng}&format=json`,
              { headers: { "Accept-Language": "en" } }
            );
            if (res.ok) {
              const data = await res.json();
              base.city =
                data.address?.city ||
                data.address?.town ||
                data.address?.village ||
                data.address?.county ||
                "Unknown area";
              base.country = data.address?.country || "";
            }
          } catch (_) {}

          setState("granted");
          setCoords(base);
          resolve(base);
        },
        (err) => {
          setState("denied");
          const messages: Record<number, string> = {
            1: "Location access denied. Please enable it in your browser settings and reload.",
            2: "Unable to determine your location. Check your GPS or network connection.",
            3: "Location request timed out. Please try again.",
          };
          setError(messages[err.code] || "Location error. Please try again.");
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  return { state, coords, error, requestLocation };
}
