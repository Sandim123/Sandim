export interface PartnerProfile {
  name1: string; // e.g. "Alex"
  name2: string; // e.g. "Maya"
  nickname1?: string;
  nickname2?: string;
  avatar1?: string;
  avatar2?: string;
  relationshipStartDate: string; // "2026-01-06T00:00:00"
  anniversaryNote?: string;
  pinLockEnabled: boolean;
  pinCode?: string;
  activeUser: 'partner1' | 'partner2';
}

export interface UserAccount {
  id: 'partner1' | 'partner2';
  username: string;
  displayName: string;
  passwordHash: string;
  salt: string;
  avatar?: string;
  lastLoginAt?: number;
}

export interface LoginSession {
  userId: 'partner1' | 'partner2';
  token: string;
  loggedInAt: number;
  expiresAt: number;
}

export interface PartnerWelcomeMessage {
  id: string;
  targetUser: 'partner2'; // For her
  createdBy: 'partner1'; // From him
  title: string;
  message: string;
  theme: 'romantic' | 'surprise-date' | 'sweet-morning' | 'celebration';
  photoUrl?: string;
  isEnabled: boolean;
  frequency: 'always' | 'once_until_acknowledged' | 'every_session';
  acknowledgedAt?: number;
  displayCount: number;
  lastShownAt?: number;
  responseNote?: string;
  responseCreatedAt?: number;
}

export interface PhotoMemory {
  id: string;
  title: string;
  caption?: string;
  imageUrl: string;
  date: string; // YYYY-MM-DD
  location?: string;
  uploadedBy: 'partner1' | 'partner2' | 'both';
  category: 'favorite' | 'trips' | 'dates' | 'everyday' | 'celebrations';
  isFavorite: boolean;
  tags?: string[];
  createdAt: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  endDate?: string; // for multi-day trips
  location?: string;
  category: 'date' | 'anniversary' | 'trip' | 'surprise' | 'movie' | 'milestone';
  notes?: string;
  createdBy: 'partner1' | 'partner2';
  color?: string;
  reminder?: boolean;
}

export interface JournalReply {
  id: string;
  author: 'partner1' | 'partner2';
  content: string;
  createdAt: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  author: 'partner1' | 'partner2';
  mood: 'deeply-in-love' | 'grateful' | 'adventurous' | 'peaceful' | 'playful' | 'nostalgic';
  content: string;
  location?: string;
  isLocked?: boolean;
  photoIds?: string[];
  photoUrls?: string[];
  replies?: JournalReply[];
  createdAt: number;
}

export interface StickyLoveNote {
  id: string;
  from: 'partner1' | 'partner2';
  to: 'partner1' | 'partner2';
  message: string;
  color: 'rose' | 'amber' | 'emerald' | 'sky' | 'violet';
  createdAt: number;
  isPinned?: boolean;
}

export interface BucketListItem {
  id: string;
  title: string;
  category: 'travel' | 'food' | 'adventure' | 'cozy' | 'growth';
  isCompleted: boolean;
  completedDate?: string;
  completedNote?: string;
  suggestedBy: 'partner1' | 'partner2';
}

export interface TimeDuration {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
}

export interface Milestone {
  days: number;
  title: string;
  targetDate: Date;
  isPast: boolean;
  daysLeft: number;
}
