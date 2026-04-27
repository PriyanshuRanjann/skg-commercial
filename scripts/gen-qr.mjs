#!/usr/bin/env node
/**
 * Generate the static QR sticker that drivers print and stick inside the cab.
 * Scanning it opens /feedback on the live site.
 *
 * Usage:
 *   node scripts/gen-qr.mjs                     # uses NEXT_PUBLIC_APP_URL or http://localhost:3000
 *   node scripts/gen-qr.mjs https://my.site     # explicit base URL
 *
 * Output: public/qr-feedback.png (~512x512 PNG with margin).
 */
import QRCode from "qrcode";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const baseUrl =
  process.argv[2] ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

const target = `${baseUrl.replace(/\/$/, "")}/feedback`;
const out = resolve(repoRoot, "public/qr-feedback.png");

await mkdir(dirname(out), { recursive: true });

const png = await QRCode.toBuffer(target, {
  errorCorrectionLevel: "H",
  margin: 2,
  width: 512,
  color: {
    dark: "#1a3a5c",
    light: "#ffffff",
  },
});

await writeFile(out, png);

console.log(`✓ QR generated → ${out}`);
console.log(`  Encodes: ${target}`);
console.log(`  Print this and stick it inside the cab.`);
