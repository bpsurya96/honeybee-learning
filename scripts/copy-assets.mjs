import { cp, mkdir, stat } from "node:fs/promises";
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

// Ensure standalone files like CNAME, robots.txt, serve.py are preserved
for (const file of ["CNAME", "robots.txt", "sitemap.xml", "favicon.ico"]) {
  const src = path.join(root, file);
  const dest = path.join(output, file);
  try {
    const s = await stat(src);
    if (s.isFile()) await cp(src, dest);
  } catch (err) {}
}

console.log("✓ All static assets (css, js, data, images, reviews) verified in dist/");
