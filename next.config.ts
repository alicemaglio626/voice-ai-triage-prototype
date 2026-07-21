import type { NextConfig } from "next";

// GitHub Pages serves a project site under /<repo>/, so the built assets need
// that prefix in production. Local `next dev` runs at the root (no prefix).
const repo = "voice-ai-triage-prototype";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export", // static HTML/JS — no server needed (GitHub Pages friendly)
  trailingSlash: true, // /triage-prototype/ -> triage-prototype/index.html
  images: { unoptimized: true },
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
};

export default nextConfig;
