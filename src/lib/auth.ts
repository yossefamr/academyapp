import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const hashBuf = Buffer.from(hash, 'hex');
  const testBuf = scryptSync(password, salt, 64);
  if (hashBuf.length !== testBuf.length) return false;
  return timingSafeEqual(hashBuf, testBuf);
}

export const SKILL_LEVELS = ['NOVICE', 'ROOKIE', 'WARRIOR', 'VETERAN', 'ELITE', 'APEX'] as const;
export type SkillLevel = (typeof SKILL_LEVELS)[number];

export const SKILL_LABELS: Record<SkillLevel, string> = {
  NOVICE: 'Novice',
  ROOKIE: 'Rookie',
  WARRIOR: 'Warrior',
  VETERAN: 'Veteran',
  ELITE: 'Elite',
  APEX: 'Apex',
};

export const SKILL_ORDER: SkillLevel[] = ['NOVICE', 'ROOKIE', 'WARRIOR', 'VETERAN', 'ELITE', 'APEX'];

export function skillIndex(level: string): number {
  return SKILL_ORDER.indexOf(level as SkillLevel);
}

/* Rank titles ladder */
export const RANK_TITLES = [
  'Unranked',
  'Pup',
  'Striker',
  'Enforcer',
  'Predator',
  'Alpha',
  'Prime Alpha',
  'Lycan Lord',
  'Apex Lycan',
] as const;

export function rankTitleFor(rank: number): string {
  if (rank <= 0) return RANK_TITLES[0];
  const idx = Math.min(rank, RANK_TITLES.length - 1);
  return RANK_TITLES[idx];
}
