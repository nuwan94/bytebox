import type { NextConfig } from "next";

// GitHub Pages serves a project site from /<repo>, so the deploy workflow
// passes that prefix in. Locally it is empty and the site runs at /.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const config: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default config;
