"use client";

import QRCode from "react-qr-code";
import { ShieldCheck } from "lucide-react";

export default function TrustQR({ value, size = 128 }: { value: string; size?: number }) {
  return (
    <div className="relative inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
      <QRCode value={value} size={size} fgColor="#0f172a" bgColor="#ffffff" />
      <div className="absolute -bottom-3 -right-3 bg-brand-500 rounded-full p-2 text-white shadow-lg border-2 border-white">
        <ShieldCheck size={24} />
      </div>
    </div>
  );
}
