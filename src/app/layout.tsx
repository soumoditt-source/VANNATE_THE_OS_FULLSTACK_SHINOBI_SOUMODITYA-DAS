import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AICopilot from "@/components/ui/AICopilot";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "VANNATE AI — Autonomous Humanitarian OS & Civic Emergency Grid",
  description: "India's first autonomous humanitarian OS: live crisis dispatch, zero-leakage relief vaults, AI verification, and paperless NGO operating system. Architected & built solely by Soumoditya Das.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Navbar />
        <main style={{ position: "relative", zIndex: 1, minHeight: "calc(100vh - 64px - 80px)" }}>
          {children}
        </main>
        
        <Footer />
        <AICopilot />
      </body>
    </html>
  );
}

