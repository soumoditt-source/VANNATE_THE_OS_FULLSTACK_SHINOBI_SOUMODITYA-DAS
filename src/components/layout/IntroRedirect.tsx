"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IntroRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if user has seen cinematic intro in this session
    const alreadySeen = window.sessionStorage.getItem("vannate-intro-seen-v1");
    if (!alreadySeen) {
      window.sessionStorage.setItem("vannate-intro-seen-v1", "true");
      window.location.replace("/intro");
    }
  }, []);

  return null;
}
