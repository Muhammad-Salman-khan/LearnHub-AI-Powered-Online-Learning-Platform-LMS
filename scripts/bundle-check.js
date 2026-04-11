#!/usr/bin/env node
/**
 * Bundle size check script for CI.
 * Warn if any client chunk exceeds 400KB (uncompressed).
 * Usage: node scripts/bundle-check.js
 */

const fs = require("fs");
const path = require("path");

const NEXT_STATIC = path.join(process.cwd(), ".next/static/chunks");
const MAX_SIZE = 400 * 1024; // 400KB warning threshold

function checkBundles() {
  if (!fs.existsSync(NEXT_STATIC)) {
    console.log("⚠️  No build output found. Run `npm run build` first.");
    process.exit(0);
  }

  const chunks = fs
    .readdirSync(NEXT_STATIC, { recursive: true })
    .filter((f) => f.endsWith(".js"))
    .map((f) => path.join(NEXT_STATIC, f));

  const oversized = [];

  for (const chunk of chunks) {
    const stats = fs.statSync(chunk);
    const sizeKB = (stats.size / 1024).toFixed(1);
    const relative = path.relative(path.join(process.cwd(), ".next"), chunk);

    if (stats.size > MAX_SIZE) {
      oversized.push({ file: relative, size: stats.size, sizeKB });
    }
  }

  if (oversized.length > 0) {
    console.log("⚠️  Bundle size warnings:");
    for (const { file, sizeKB } of oversized) {
      console.log(`  ${file}: ${sizeKB}KB`);
    }
    console.log(
      `\n💡 Tip: Split large components, use dynamic imports, or increase threshold.`,
    );
    // Don't fail CI, just warn
    process.exit(0);
  } else {
    console.log("✅ All client chunks are within budget (< 400KB).");
  }
}

checkBundles();
