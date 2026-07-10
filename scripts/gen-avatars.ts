#!/usr/bin/env bun
// Generates stylized lycan trainee avatar SVGs into public/trainees
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const OUT = join(process.cwd(), 'public/trainees');
mkdirSync(OUT, { recursive: true });

const PALETTE: Record<string, [string, string, string]> = {
  // name -> [bgFrom, bgTo, accent]
  superadmin: ['#2a0606', '#0a0a0c', '#ff2a2a'],
  coach: ['#1a1212', '#0a0a0c', '#c8102e'],
  trainee1: ['#3a0a0a', '#0a0a0c', '#ff5a5a'],
  trainee2: ['#0a1a2a', '#0a0a0c', '#5ab0ff'],
  trainee3: ['#2a1a0a', '#0a0a0c', '#ffb05a'],
  trainee4: ['#1a0a2a', '#0a0a0c', '#b05aff'],
  trainee5: ['#0a2a1a', '#0a0a0c', '#5affb0'],
  trainee6: ['#2a0a1a', '#0a0a0c', '#ff5ab0'],
  trainee7: ['#0a2a2a', '#0a0a0c', '#5affff'],
  trainee8: ['#2a2a0a', '#0a0a0c', '#ffff5a'],
};

function wolfHead(accent: string) {
  return `
    <g transform="translate(100 110)">
      <path d="M -52 -28 L -38 -64 L -22 -30 Z" fill="#6a6f78"/>
      <path d="M 52 -28 L 38 -64 L 22 -30 Z" fill="#6a6f78"/>
      <path d="M -46 -30 L -38 -54 L -28 -32 Z" fill="#15151a"/>
      <path d="M 46 -30 L 38 -54 L 28 -32 Z" fill="#15151a"/>
      <path d="M -54 -12 C -58 24, -36 52, 0 58 C 36 52, 58 24, 54 -12 C 46 -32, 26 -40, 0 -40 C -26 -40, -46 -32, -54 -12 Z" fill="#8a909a"/>
      <path d="M -54 -12 C -58 24, -36 52, 0 58 C 36 52, 58 24, 54 -12 C 46 -32, 26 -40, 0 -40 C -26 -40, -46 -32, -54 -12 Z" fill="url(#furShade)"/>
      <path d="M -20 18 C -20 36, -10 46, 0 48 C 10 46, 20 36, 20 18 C 14 28, 7 34, 0 35 C -7 34, -14 28, -20 18 Z" fill="#2a2d33"/>
      <path d="M -34 -8 L -28 -2 L -36 5 L -30 11 L -38 19 L -32 24" stroke="${accent}" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.9"/>
      <ellipse cx="-19" cy="-8" rx="6.5" ry="5" fill="${accent}"/>
      <ellipse cx="19" cy="-8" rx="6.5" ry="5" fill="${accent}"/>
      <ellipse cx="-19" cy="-8" rx="2" ry="4" fill="#1a0000"/>
      <ellipse cx="19" cy="-8" rx="2" ry="4" fill="#1a0000"/>
      <path d="M -13 32 L -9 44 L -5 32 Z" fill="#f4f4f5"/>
      <path d="M 13 32 L 9 44 L 5 32 Z" fill="#f4f4f5"/>
      <ellipse cx="0" cy="24" rx="4" ry="3" fill="#0a0a0c"/>
    </g>
  `;
}

function svg(name: string, bgFrom: string, bgTo: string, accent: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="400" height="400">
  <defs>
    <radialGradient id="bg" cx="50%" cy="35%" r="75%">
      <stop offset="0%" stop-color="${bgFrom}"/>
      <stop offset="100%" stop-color="${bgTo}"/>
    </radialGradient>
    <linearGradient id="furShade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.45"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="40%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="200" height="200" fill="url(#bg)"/>
  <rect width="200" height="200" fill="url(#glow)"/>
  ${wolfHead(accent)}
  <path d="M 30 20 L 36 70 M 60 14 L 64 80 M 90 18 L 92 76" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" opacity="0.5" fill="none"/>
</svg>`;
}

for (const [name, [a, b, c]] of Object.entries(PALETTE)) {
  writeFileSync(join(OUT, `${name}.svg`), svg(name, a, b, c), 'utf8');
  console.log('wrote', name + '.svg');
}
console.log('Done. Avatars in', OUT);
