import {
  Swords, Zap, Shield, Hand, Activity, Flame, Anchor, Wind,
} from 'lucide-react';

export interface Discipline {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: typeof Swords;
  accent: string;
}

export const DISCIPLINES: Discipline[] = [
  {
    id: 'mma',
    name: 'MMA',
    tagline: 'Mixed Martial Arts',
    description: 'The complete arsenal — striking, grappling & ground game fused into one fluid combat system.',
    icon: Swords,
    accent: '#c8102e',
  },
  {
    id: 'bjj',
    name: 'Brazilian Jiu-Jitsu',
    tagline: 'The Gentle Art',
    description: 'Submit larger opponents through leverage, chokes and joint locks. Chess on the mat.',
    icon: Anchor,
    accent: '#7a0d0d',
  },
  {
    id: 'mma-striking',
    name: 'MMA Striking',
    tagline: 'Stand-Up Warfare',
    description: 'Boxing + Muay Thai fused for the cage — distance, timing, entries and devastating combinations.',
    icon: Zap,
    accent: '#ff3b3b',
  },
  {
    id: 'kickboxing',
    name: 'Kickboxing',
    tagline: 'Fists & Feet',
    description: 'Explosive punches and kicks with footwork and ring IQ. High-output, high-reward.',
    icon: Hand,
    accent: '#d98a4a',
  },
  {
    id: 'muaythai',
    name: 'Muay Thai',
    tagline: 'The Art of Eight Limbs',
    description: 'Fists, elbows, knees and shins. The most brutal stand-up art on earth, forged in Thailand.',
    icon: Flame,
    accent: '#c8102e',
  },
  {
    id: 'boxing',
    name: 'Boxing',
    tagline: 'The Sweet Science',
    description: 'Pure hands. Head movement, footwork, angles and the science of hitting without being hit.',
    icon: Hand,
    accent: '#9aa0aa',
  },
  {
    id: 'wrestling',
    name: 'Wrestling',
    tagline: 'Control the Body',
    description: 'Takedowns, throws and top control. The foundation of MMA dominance.',
    icon: Shield,
    accent: '#5a5f6a',
  },
  {
    id: 'judo',
    name: 'Judo',
    tagline: 'The Gentle Way',
    description: 'Maximum efficiency, minimum effort. Throws and sweeps that send opponents flying.',
    icon: Wind,
    accent: '#b05aff',
  },
];

export interface AcademyInfo {
  name: string;
  shortName: string;
  tagline: string;
  email: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  website: string;
  websiteDisplay: string;
  address: string;
  addressShort: string;
  branches: string[];
  mapsUrl: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

export const ACADEMY: AcademyInfo = {
  name: 'Lycans Fight Club - MMA Academy',
  shortName: 'Lycans Fight Club',
  tagline: 'Fearless Fighters',
  email: 'lycansfightclub@gmail.com',
  phone: '+201117923050',
  phoneDisplay: '+20 11 1792 3050',
  whatsapp: '201117923050',
  website: 'https://lycansfightclub.com/',
  websiteDisplay: 'www.lycansfightclub.com',
  address: 'Beside Habaib, 1 Anwar Al Nady St, from Hassan Fahim, Al Sayda, Giza 12511, Egypt',
  addressShort: 'Faisal, Giza — Egypt',
  branches: ['Faisal', '6th of October', 'Haram', 'Nasr City'],
  mapsUrl: 'https://maps.app.goo.gl/wyCBEPFz6NkQMx3T9',
  instagram: 'https://www.instagram.com/lycans_fightclub?igsh=MTB3MXkxZGl3bTRsMw==',
  facebook: 'https://www.facebook.com/share/1eBZFjZf8S/',
  tiktok: 'https://www.tiktok.com/@lycansfightclub',
};
