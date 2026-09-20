import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import AICopilot from "@/components/ui/AICopilot";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Vannate 2.0 — Humanity's Operating System",
  description: "Transparent donations, crisis response, and blood bank coordination — powered by AWS.",
  themeColor: "#03040a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Navbar />
        <main style={{ position: "relative", zIndex: 1, minHeight: "calc(100vh - 64px - 80px)" }}>
          {children}
        </main>
        
        {/* Global Hackathon Footer */}
        <footer style={{ 
          padding: "24px", 
          textAlign: "center", 
          background: "rgba(3,4,10,0.9)", 
          borderTop: "1px solid rgba(255,255,255,0.05)",
          color: "var(--text-muted)",
          fontSize: 13,
          fontFamily: "'Space Grotesk', sans-serif"
        }}>
          <p style={{ margin: 0 }}>AWS First Commit Hackathon | <strong style={{ color: "var(--brand)", letterSpacing: "1px" }}>ONLY BUILT BY SOUMODITYA DAS</strong></p>
        </footer>

        <AICopilot />
      </body>
    </html>
  );
}

