import type { NextConfig } from "next";

// Domains actually referenced by the app (checked against src/):
// - *.supabase.co        — REST API, storage, and realtime (wss) — used
//                           directly from the browser in PollCard.tsx
// - maps.googleapis.com / maps.gstatic.com — Google Maps JS API, loaded in
//                           CourtsMapClient.tsx
// - lh3.googleusercontent.com — Google account avatar images
// Fonts are self-hosted via next/font (no fonts.googleapis.com / gstatic
// font requests). Geolocation is not requested anywhere in the app (the
// courts map uses a fixed Nairobi center, not navigator.geolocation).
const isDev = process.env.NODE_ENV !== "production";

const CSP = [
  "default-src 'self'",
  // Google Maps injects its own <script> and relies on inline bootstrap
  // code; 'unsafe-eval' is only needed for dev (HMR/source maps).
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ""}https://maps.googleapis.com https://maps.gstatic.com`,
  // Google Maps controls are styled via inline <style> it injects itself.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co https://lh3.googleusercontent.com https://maps.gstatic.com https://*.googleapis.com https://*.ggpht.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://maps.googleapis.com https://maps.gstatic.com",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
