#!/usr/bin/env bun
// Generates PWA app icons (192, 512, maskable) + favicon from the Lycans crest SVG.
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const OUT = join(process.cwd(), 'public', 'icons');
mkdirSync(OUT, { recursive: true });

// Lycans crest SVG — black bg, blood claw, silver moon ring
const crest = (size: number) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="70%">
      <stop offset="0%" stop-color="#1a0606"/>
      <stop offset="60%" stop-color="#0a0a0c"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
    <linearGradient id="clawGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ff2a2a"/>
      <stop offset="60%" stop-color="#c8102e"/>
      <stop offset="100%" stop-color="#7a0000"/>
    </linearGradient>
    <radialGradient id="moonG" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#e8e8ea"/>
      <stop offset="100%" stop-color="#5a5f6a"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" rx="110" fill="url(#bg)"/>
  <!-- moon ring -->
  <circle cx="256" cy="232" r="150" fill="none" stroke="url(#moonG)" stroke-width="6" opacity="0.5"/>
  <circle cx="256" cy="232" r="140" fill="none" stroke="#c8102e" stroke-width="2" opacity="0.4"/>
  <!-- LYCANS arc text -->
  <path id="topArc" d="M 110 232 A 146 146 0 0 1 402 232" fill="none"/>
  <text fill="#f4f4f5" font-size="44" font-weight="900" letter-spacing="14" font-family="Arial, sans-serif" text-anchor="middle">
    <textPath href="#topArc" startOffset="50%">LYCANS</textPath>
  </text>
  <!-- MMA arc text bottom -->
  <path id="botArc" d="M 120 252 A 136 136 0 0 0 392 252" fill="none"/>
  <text fill="#c8102e" font-size="30" font-weight="800" letter-spacing="20" font-family="Arial, sans-serif" text-anchor="middle">
    <textPath href="#botArc" startOffset="50%">MMA</textPath>
  </text>
  <!-- wolf head -->
  <g transform="translate(256 224)">
    <path d="M -78 -42 L -58 -100 L -36 -48 Z" fill="#8a909a"/>
    <path d="M 78 -42 L 58 -100 L 36 -48 Z" fill="#8a909a"/>
    <path d="M -70 -46 L -58 -84 L -44 -50 Z" fill="#15151a"/>
    <path d="M 70 -46 L 58 -84 L 44 -50 Z" fill="#15151a"/>
    <path d="M -82 -20 C -88 48, -54 82, 0 92 C 54 82, 88 48, 82 -20 C 70 -58, 40 -72, 0 -72 C -40 -72, -70 -58, -82 -20 Z" fill="#9aa0aa"/>
    <path d="M -82 -20 C -88 48, -54 82, 0 92 C 54 82, 88 48, 82 -20 C 70 -58, 40 -72, 0 -72 C -40 -72, -70 -58, -82 -20 Z" fill="url(#furShade)"/>
    <path d="M -30 32 C -30 60, -14 76, 0 80 C 14 76, 30 60, 30 32 C 20 48, 10 56, 0 58 C -10 56, -20 48, -30 32 Z" fill="#2a2d33"/>
    <!-- blood mark -->
    <path d="M -50 -14 L -42 -4 L -54 8 L -44 18 L -56 30 L -48 40" stroke="url(#clawGrad)" stroke-width="6" stroke-linecap="round" fill="none"/>
    <ellipse cx="-28" cy="-14" rx="10" ry="8" fill="#ff3b3b"/>
    <ellipse cx="28" cy="-14" rx="10" ry="8" fill="#ff3b3b"/>
    <ellipse cx="-28" cy="-14" rx="3" ry="6" fill="#1a0000"/>
    <ellipse cx="28" cy="-14" rx="3" ry="6" fill="#1a0000"/>
    <path d="M -20 52 L -14 72 L -8 52 Z" fill="#f4f4f5"/>
    <path d="M 20 52 L 14 72 L 8 52 Z" fill="#f4f4f5"/>
    <ellipse cx="0" cy="40" rx="6" ry="5" fill="#0a0a0c"/>
  </g>
  <!-- big claw slash -->
  <g transform="translate(256 256) rotate(15)">
    <path d="M -60 -150 Q -64 -50 -40 60 Q -34 80 -20 90 L -20 -150 Z" fill="url(#clawGrad)" opacity="0.92"/>
    <path d="M -10 -160 Q -8 -50 10 70 Q 16 90 30 100 L 20 -160 Z" fill="url(#clawGrad)" opacity="0.92"/>
    <path d="M 40 -150 Q 46 -50 60 60 Q 66 80 80 90 L 70 -150 Z" fill="url(#clawGrad)" opacity="0.92"/>
  </g>
  <linearGradient id="furShade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0.5"/>
  </linearGradient>
</svg>`;

async function gen(size: number, name: string, maskable = false) {
  const svg = Buffer.from(crest(size));
  let pipeline = sharp(svg).resize(size, size);
  if (maskable) {
    // maskable: keep content within safe zone (80% center) — already padded by rounded bg
    pipeline = sharp(
      Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
        <defs><clipPath id="c"><rect width="${size}" height="${size}" rx="0"/></clipPath></defs>
        <rect width="${size}" height="${size}" fill="#0a0a0c"/>
      </svg>`)
    ).composite([{ input: svg, blend: 'over' }]).resize(size, size);
  }
  await pipeline.png().toFile(join(OUT, name));
  console.log('wrote', name);
}

await gen(192, 'icon-192.png');
await gen(512, 'icon-512.png');
await gen(512, 'icon-512-maskable.png', true);
await gen(180, 'apple-touch-icon.png');
await gen(32, 'favicon-32.png');
await gen(16, 'favicon-16.png');

// ICO-style favicon.svg replacement
writeFileSync(join(process.cwd(), 'public', 'logo.svg'), crest(512), 'utf8');
console.log('wrote public/logo.svg');
console.log('Done.');
