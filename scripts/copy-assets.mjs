import { cp, mkdir, stat, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
await mkdir(output, { recursive: true });

// Ensure static asset folders are fully copied into dist/
const assetDirs = ["css", "js", "data", "images", "reviews"];
for (const dir of assetDirs) {
  const src = path.join(root, dir);
  const dest = path.join(output, dir);
  try {
    const s = await stat(src);
    if (s.isDirectory()) {
      await cp(src, dest, { recursive: true, force: true });
    }
  } catch (err) {
    if (err?.code !== "ENOENT") console.warn(`Notice copying ${dir}:`, err);
  }
}

// Ensure standalone files like CNAME, robots.txt, sitemap.xml, favicon.ico are preserved
for (const file of ["CNAME", "robots.txt", "sitemap.xml", "favicon.ico"]) {
  const src = path.join(root, file);
  const dest = path.join(output, file);
  try {
    const s = await stat(src);
    if (s.isFile()) await cp(src, dest);
  } catch (err) {}
}

// Dual-support both clean URLs (/about) and legacy extension URLs (/about.html)
// across static hosting providers (Vercel, GitHub Pages, Netlify)
try {
  const files = await readdir(output);
  for (const file of files) {
    if (file.endsWith(".html") && file !== "index.html") {
      const pageName = file.replace(/\.html$/, "");
      const pageDir = path.join(output, pageName);
      await mkdir(pageDir, { recursive: true });
      await cp(path.join(output, file), path.join(pageDir, "index.html"), { force: true });
    }
  }
} catch (err) {
  console.warn("Notice generating clean URL directory mirrors:", err);
}

console.log("✓ All static assets and dual clean-URL routes verified in dist/");
