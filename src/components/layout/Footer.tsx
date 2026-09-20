import Link from "next/link";
import { Zap, Heart, Shield, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-12 border-t border-white/10 bg-[#03040a]/90 backdrop-blur-xl text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight font-space">Vannate</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Autonomous AI Humanitarian & Civic Intelligence Operating System for Bharat. Zero-latency emergency dispatch & transparent giving.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles size={13} />
              <span>AWS Cloud & Bedrock Powered</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Civic Response</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/crisis" className="hover:text-blue-400 transition-colors">Crisis SOS Engine</Link></li>
              <li><Link href="/blood" className="hover:text-red-400 transition-colors">Emergency Blood Network</Link></li>
              <li><Link href="/volunteer" className="hover:text-emerald-400 transition-colors">Volunteer Telemetry Dispatch</Link></li>
              <li><Link href="/verify" className="hover:text-amber-400 transition-colors">AI Currency & QR Verifier</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Platform & Impact</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/donate" className="hover:text-purple-400 transition-colors">Blockchain Donation Escrow</Link></li>
              <li><Link href="/rewards" className="hover:text-green-400 transition-colors">Karma & Tree Planting Rewards</Link></li>
              <li><Link href="/analytics" className="hover:text-cyan-400 transition-colors">Civic Analytics & Hotspots</Link></li>
              <li><Link href="/community" className="hover:text-pink-400 transition-colors">Community Stories</Link></li>
              <li><Link href="/crm" className="hover:text-indigo-400 transition-colors">Inter-Agency CRM</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Sole Creator & Architecture</h4>
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
              <div className="flex items-center gap-2 text-sm font-semibold text-white mb-1">
                <Heart size={14} className="text-red-400 fill-red-400" />
                <span>Created For Bharat</span>
              </div>
              <p className="text-xs text-gray-300 font-mono mb-2">
                ARCHITECTED & BUILT SOLELY BY
              </p>
              <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">
                SOUMODITYA DAS
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                Full-Stack, Distributed Systems & AI Safety Architecture.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Vannate. Solely engineered by Soumoditya Das. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              99.99% AWS Distributed Uptime
            </span>
            <Link href="/portal" className="hover:text-white transition-colors">My Portal</Link>
            <Link href="/intro" className="hover:text-white transition-colors">System Tour</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
