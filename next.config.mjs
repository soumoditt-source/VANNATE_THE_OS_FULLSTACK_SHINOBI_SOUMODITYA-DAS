/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Output ─────────────────────────────────────────────────
  output: "standalone",

  // ── Build tolerances (AWS build environment) ───────────────
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // ── Security headers ───────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "X-Frame-Options",            value: "DENY" },
          { key: "X-XSS-Protection",           value: "1; mode=block" },
          { key: "Referrer-Policy",            value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",         value: "camera=(self), geolocation=(self), microphone=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' blob: data: https://*.unsplash.com https://*.tile.openstreetmap.org https://maps.gstatic.com https://maps.googleapis.com",
              "connect-src 'self' https://*.amazonaws.com https://nominatim.openstreetmap.org https://overpass-api.de wss:",
              "media-src 'self' blob:",
              "worker-src 'self' blob:",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // ── Image optimization ─────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "**.tile.openstreetmap.org" },
      { protocol: "https", hostname: "maps.googleapis.com" },
      { protocol: "https", hostname: "maps.gstatic.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // ── Performance ────────────────────────────────────────────
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // ── Webpack customization ──────────────────────────────────
  webpack(config) {
    // Suppress Three.js canvas optional require
    config.externals = config.externals || [];
    return config;
  },
};

export default nextConfig;
