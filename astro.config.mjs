import { defineConfig } from "astro/config";

// Support both custom domain (root /) and GitHub Pages (/honeybee-learning)
const base = process.env.PUBLIC_BASE_PATH || "/";

export default defineConfig({
  output: "static",
  base,
  build: {
    format: "file",
  },
});
