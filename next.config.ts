import type { NextConfig } from "next";

// Prototipe statis: diekspor sebagai HTML/JS murni (folder `out`), tanpa server.
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true
};

export default config;
