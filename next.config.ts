import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const repoBasePath = "/football-iq";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isGitHubPages
    ? {
        output: "export",
        basePath: repoBasePath,
        assetPrefix: repoBasePath,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
