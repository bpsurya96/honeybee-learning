import { defineConfig } from "astro/config";

// Support both custom domain (root /) and GitHub Pages (/honeybee-learning)
const base = process.env.PUBLIC_BASE_PATH || "/";

export default defineConfig({
  output: "static",
  base,
  build: {
    format: "file",
  },
  vite: {
    plugins: [
      {
        name: "reviews-dev-middleware",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === "/reviews") {
              res.writeHead(302, { Location: "/reviews.html" });
              res.end();
              return;
            }
            next();
          });
        },
      },
    ],
  },
});
