import Link from "next/link";
import { Heart, Sparkles, BookOpen, ShieldCheck } from "lucide-react";
import VannateLogo from "@/components/ui/VannateLogo";

export default function Footer() {
  return (
    <footer className="w-full py-14 border-t border-white/10 bg-[#03040a]/95 backdrop-blur-2xl text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dharmic Philosophy Quote Ribbon */}
        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 border border-amber-500/25 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <BookOpen size={20} className="text-amber-400" />
            </div>
            <div>
              <div className="text-amber-200 font-serif text-base sm:text-lg font-semibold tracking-wide">
                दातव्यमिति यद्दानं दीयतेऽनुपकारिणे। देशे काले च पात्रे च तद्दानं सात्त्विकं स्मृतम्॥
              </div>
              <div className="text-xs text-gray-300 italic mt-0.5">
                &ldquo;Charity given without expectation of return, at the proper time and place, to a worthy recipient, is the purest Dharma.&rdquo; — Bhagavad Gita 17.20
              </div>
            </div>
          </div>

          <Link
            href="/#dharmic-ethos"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold tracking-wider uppercase text-amber-300 whitespace-nowrap transition-all"
          >
            Explore Philosophy ✦
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <VannateLogo size={32} showText={true} glow={true} />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Autonomous AI Humanitarian & Civic Intelligence Operating System for Bharat. Zero-latency emergency dispatch, paperless NGO operating system & transparent giving.
            </p>
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold w-fit">
                <Sparkles size={13} />
                <span>AWS Cloud & Bedrock Powered</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold w-fit">
                <ShieldCheck size={13} />
                <span>DPIIT Approved · Darpan WB/2024/039821</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Civic Response</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/crisis" className="hover:text-blue-400 transition-colors">Crisis SOS Engine & Map</Link></li>
              <li><Link href="/blood" className="hover:text-red-400 transition-colors">Emergency Blood Network</Link></li>
              <li><Link href="/volunteer" className="hover:text-emerald-400 transition-colors">Volunteer Telemetry Dispatch</Link></li>
              <li><Link href="/verify" className="hover:text-amber-400 transition-colors">AI Currency & QR Scanner</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Enterprise & Impact</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/dashboard" className="hover:text-amber-400 transition-colors">NGO OS (SHA-256 Logbook & 80G)</Link></li>
              <li><Link href="/donate" className="hover:text-purple-400 transition-colors">Zero-Cash Relief Escrow</Link></li>
              <li><Link href="/rewards" className="hover:text-green-400 transition-colors">Karma & Tree Planting Rewards</Link></li>
              <li><Link href="/community" className="hover:text-pink-400 transition-colors">Community Mutual Aid</Link></li>
              <li><Link href="/intro" className="hover:text-amber-300 transition-colors">Awakening Portal Tour</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Sole Creator & Architecture</h4>
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
              <div className="flex items-center gap-2 text-sm font-semibold text-white mb-1">
                <Heart size={14} className="text-red-400 fill-red-400" />
                <span>Built For Bharat</span>
              </div>
              <p className="text-xs text-gray-300 font-mono mb-2">
                ARCHITECTED & BUILT SOLELY BY
              </p>
              <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-300 to-amber-300">
                SOUMODITYA DAS
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                Fullstack Shinobi · AWS First Commit Hackathon Edition.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} VANNATE AI. Solely engineered by Soumoditya Das. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              100% AWS Distributed Uptime
            </span>
            <Link href="/dashboard" className="hover:text-white transition-colors">Auditor Portal</Link>
            <Link href="/intro" className="hover:text-white transition-colors">Sacred Intro</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
