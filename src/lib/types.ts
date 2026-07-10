export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'TRAINEE';
export type SkillLevel = 'NOVICE' | 'ROOKIE' | 'WARRIOR' | 'VETERAN' | 'ELITE' | 'APEX';

export interface Member {
  id: string;
  email: string;
  name: string;
  phone: string;
  photo: string;
  role: Role;
  skillLevel: SkillLevel;
  rank: number;
  rankTitle: string;
  bio: string;
  weightClass: string;
  discipline: string;
  joinedAt: string;
  updatedAt: string;
  attendanceCount?: number;
}

export interface Attendance {
  id: string;
  memberId: string;
  checkIn: string;
  checkOut: string | null;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  memberId: string;
  memberName: string;
  memberPhoto: string;
  memberRole: Role;
  content: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  memberId: string;
  memberName: string;
  memberPhoto: string;
  rating: number;
  comment: string;
  category: string;
  createdAt: string;
}

export interface ChatRoomState {
  id: string;
  isOpen: boolean;
  openedBy: string | null;
  openedAt: string | null;
}

export type ScreenView =
  | 'home'
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'chat'
  | 'feedback'
  | 'admin';

export const SKILL_LABELS: Record<SkillLevel, string> = {
  NOVICE: 'Novice',
  ROOKIE: 'Rookie',
  WARRIOR: 'Warrior',
  VETERAN: 'Veteran',
  ELITE: 'Elite',
  APEX: 'Apex',
};

export const SKILL_ORDER: SkillLevel[] = ['NOVICE', 'ROOKIE', 'WARRIOR', 'VETERAN', 'ELITE', 'APEX'];

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
];
