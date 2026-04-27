#!/usr/bin/env node
/**
 * One-shot image-prep script.
 *
 * Inputs: the two source images the owner sent (sit at the project root).
 * Outputs:
 *   - public/images/brand/logo.png          (full logo, black bg, trimmed)
 *   - public/images/brand/logo-light.png    (alt with cream bg for light contexts, optional)
 *   - public/images/hero/ertiga.jpg         (compressed hero, ~1600px wide)
 *   - public/images/hero/ertiga-square.jpg  (1:1 crop for cards)
 *
 * Run: npm run process-images
 */
import sharp from "sharp";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, access } from "node:fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const LOGO_SRC  = resolve(repoRoot, "ChatGPT Image Apr 28, 2026, 03_23_38 AM.png");
const ERTIGA_SRC = resolve(repoRoot, "ChatGPT Image Apr 28, 2026, 02_52_46 AM.png");

const LOGO_OUT       = resolve(repoRoot, "public/images/brand/logo.png");
const ERTIGA_OUT     = resolve(repoRoot, "public/images/hero/ertiga.jpg");
const ERTIGA_SQ_OUT  = resolve(repoRoot, "public/images/hero/ertiga-square.jpg");

async function ensureExists(p) {
  try { await access(p); return true; } catch { return false; }
}

await mkdir(resolve(repoRoot, "public/images/brand"), { recursive: true });
await mkdir(resolve(repoRoot, "public/images/hero"), { recursive: true });

// --- Logo: trim excess pure-black padding, keep alpha intact ---
if (await ensureExists(LOGO_SRC)) {
  await sharp(LOGO_SRC)
    .trim({ background: "#000000", threshold: 12 })
    .resize({ width: 800, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: false })
    .toFile(LOGO_OUT);
  const meta = await sharp(LOGO_OUT).metadata();
  console.log(`✓ logo  → public/images/brand/logo.png  ${meta.width}x${meta.height}`);
} else {
  console.warn(`⚠ logo source not found at ${LOGO_SRC} — skipping logo prep.`);
}

// --- Ertiga hero: resize + jpeg-compress ---
if (await ensureExists(ERTIGA_SRC)) {
  await sharp(ERTIGA_SRC)
    .resize({ width: 1920, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(ERTIGA_OUT);
  const meta = await sharp(ERTIGA_OUT).metadata();
  console.log(`✓ hero  → public/images/hero/ertiga.jpg  ${meta.width}x${meta.height}`);

  // Square crop for cards / about page (focus on the front of the car)
  await sharp(ERTIGA_SRC)
    .resize({ width: 1200, height: 1200, fit: "cover", position: "center" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(ERTIGA_SQ_OUT);
  console.log(`✓ hero  → public/images/hero/ertiga-square.jpg  1200x1200`);
} else {
  console.warn(`⚠ ertiga source not found at ${ERTIGA_SRC} — skipping hero prep.`);
}

console.log("Done.");
