import {
  PartnerProfile,
  PhotoMemory,
  CalendarEvent,
  JournalEntry,
  StickyLoveNote,
  BucketListItem,
} from '../types';

import heroImg from '../assets/images/couple_hero_banner_1791938246946.jpg';
import cafeImg from '../assets/images/memory_cozy_cafe_1791938247648.jpg';
import picnicImg from '../assets/images/memory_sunset_picnic_1791938248590.jpg';
import cityImg from '../assets/images/memory_city_night_1791938248980.jpg';

const STORAGE_KEYS = {
  PROFILE: 'everus_profile_v1',
  PHOTOS: 'everus_photos_v1',
  EVENTS: 'everus_events_v1',
  JOURNAL: 'everus_journal_v1',
  NOTES: 'everus_notes_v1',
  BUCKET: 'everus_bucket_v1',
};

export const DEFAULT_PROFILE: PartnerProfile = {
  name1: 'Alex',
  name2: 'Maya',
  nickname1: 'My Love',
  nickname2: 'My Honey',
  relationshipStartDate: '2026-01-06T00:00:00',
  anniversaryNote: 'The day my whole world became brighter and softer.',
  pinLockEnabled: false,
  pinCode: '1234',
  activeUser: 'partner1',
};

export const INITIAL_PHOTOS: PhotoMemory[] = [
  {
    id: 'p-1',
    title: 'Golden Hour at the Cliffs',
    caption: 'Standing by the edge of the Pacific, listening to the crashing waves. We promised each other to keep choosing this adventure every single day.',
    imageUrl: heroImg,
    date: '2026-04-18',
    location: 'Pacific Coastline',
    uploadedBy: 'partner1',
    category: 'trips',
    isFavorite: true,
    tags: ['Sunset', 'Ocean', 'Weekend Trip'],
    createdAt: 1776510000000,
  },
  {
    id: 'p-2',
    title: 'Rainy Morning Cafe Date',
    caption: 'Our favorite corner table, warm oat lattes, fresh almond croissants, and planning out all the things we want to build together.',
    imageUrl: cafeImg,
    date: '2026-02-14',
    location: 'Little Hearth Bakery',
    uploadedBy: 'partner2',
    category: 'dates',
    isFavorite: true,
    tags: ['Coffee', 'First Valentine', 'Quiet Moments'],
    createdAt: 1771060000000,
  },
  {
    id: 'p-3',
    title: 'Sun-Drenched Meadow Picnic',
    caption: 'A woven blanket, fresh strawberries, artisanal sourdough, and reading chapters out loud to each other while the wildflowers swayed.',
    imageUrl: picnicImg,
    date: '2026-06-21',
    location: 'Oak Valley Meadow',
    uploadedBy: 'both',
    category: 'everyday',
    isFavorite: true,
    tags: ['Summer Solstice', 'Picnic', 'Flowers'],
    createdAt: 1782040000000,
  },
  {
    id: 'p-4',
    title: 'Strolling Under the Fairy Lights',
    caption: 'After an unforgettable midnight dinner, wandering through the stone alleyways holding hands in the crisp evening air.',
    imageUrl: cityImg,
    date: '2026-09-05',
    location: 'Old Town Quarter',
    uploadedBy: 'partner1',
    category: 'dates',
    isFavorite: false,
    tags: ['Night Walk', 'City Lights', 'Romantic'],
    createdAt: 1788640000000,
  },
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'e-1',
    title: 'The Day It All Started ❤️',
    date: '2026-01-06',
    time: '20:00',
    category: 'anniversary',
    location: 'Where we made it official',
    notes: 'The day we promised to be each other’s person.',
    createdBy: 'partner1',
    color: '#e11d48',
  },
  {
    id: 'e-2',
    title: 'Candlelight Pasta & Jazz Night',
    date: '2026-10-17',
    time: '19:30',
    category: 'date',
    location: 'Trattoria Bella',
    notes: 'Alex is making the reservation! Dress code: effortlessly chic.',
    createdBy: 'partner2',
    color: '#d97706',
  },
  {
    id: 'e-3',
    title: '300 Days Together Milestone!',
    date: '2026-11-02',
    time: '00:00',
    category: 'milestone',
    location: 'Home Sweet Home',
    notes: '300 incredible days side-by-side. Secret surprise incoming.',
    createdBy: 'partner1',
    color: '#8b5cf6',
  },
  {
    id: 'e-4',
    title: 'Weekend Cabin Retreat in the Pines',
    date: '2026-11-20',
    endDate: '2026-11-22',
    time: '15:00',
    category: 'trip',
    location: 'Lakefront Pine Cabin',
    notes: 'Hot cocoa, board games, fireplace reads, and watching the morning mist over the lake.',
    createdBy: 'partner1',
    color: '#059669',
  },
  {
    id: 'e-5',
    title: 'Stargazing & Telescope Night',
    date: '2026-10-25',
    time: '21:00',
    category: 'date',
    location: 'Highland Hilltop',
    notes: 'Bringing warm apple cider and our thick wool blanket.',
    createdBy: 'partner2',
    color: '#2563eb',
  },
  {
    id: 'e-6',
    title: 'Our 1-Year Anniversary Celebration 🎉',
    date: '2027-01-06',
    time: '18:00',
    category: 'anniversary',
    location: 'Secret Destination',
    notes: '365 days of being completely in love. A celebration we will never forget.',
    createdBy: 'partner1',
    color: '#e11d48',
  },
];

export const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: 'j-1',
    title: 'The moment I knew you were the one',
    date: '2026-01-06',
    author: 'partner1',
    mood: 'deeply-in-love',
    location: 'The Overlook Bench',
    content: `I remember looking over at you while the wind was messing up your hair, and you were laughing so hard your eyes crinkled. I didn't care about anything else happening in the world. In that exact second, I realized that wherever you are is where I want to be. Jan 6th will always be etched into my soul as the best decision of my life.`,
    photoUrls: [heroImg],
    replies: [
      {
        id: 'r-1',
        author: 'partner2',
        content: `I still get butterflies reading this. You have made every single day since then feel like poetry.`,
        createdAt: 1767790000000,
      },
    ],
    createdAt: 1767744000000,
  },
  {
    id: 'j-2',
    title: 'Our silly kitchen pancake catastrophe',
    date: '2026-05-10',
    author: 'partner2',
    mood: 'playful',
    location: 'Our Kitchen',
    content: `Attempted sourdough blueberry pancakes on Sunday morning. You tried to flip one high in the air and it stuck directly to the cabinet door! We both collapsed on the floor in tears laughing. Even burnt slightly on one side, they were the sweetest pancakes because you made coffee and played our favorite acoustic vinyl.`,
    replies: [
      {
        id: 'r-2',
        author: 'partner1',
        content: `I stand by my flip technique! 10/10 would flip to the cabinet again.`,
        createdAt: 1778430000000,
      },
    ],
    createdAt: 1778420000000,
  },
  {
    id: 'j-3',
    title: 'Quiet gratitude for the small moments',
    date: '2026-09-18',
    author: 'partner1',
    mood: 'grateful',
    location: 'Living Room Sofa',
    content: `It doesn't always have to be grand trips or big spectacles. Tonight we just curled up under the fuzzy throw, sharing one pair of headphones, not even speaking for an hour. Just resting against each other. Having you as my safe harbor is the greatest blessing.`,
    replies: [],
    createdAt: 1789780000000,
  },
];

export const INITIAL_NOTES: StickyLoveNote[] = [
  {
    id: 'n-1',
    from: 'partner1',
    to: 'partner2',
    message: 'Good morning gorgeous! I left your favorite cold brew in the fridge. Have the sweetest day, thinking of you always ❤️',
    color: 'rose',
    createdAt: Date.now() - 3600000 * 5,
    isPinned: true,
  },
  {
    id: 'n-2',
    from: 'partner2',
    to: 'partner1',
    message: 'Thank you for giving the warmest hugs when I had a long day yesterday. You are my rock.',
    color: 'amber',
    createdAt: Date.now() - 3600000 * 28,
    isPinned: false,
  },
  {
    id: 'n-3',
    from: 'partner1',
    to: 'partner2',
    message: 'Can’t wait for our pasta date this weekend! Don’t peek at the playlist I made for the drive.',
    color: 'sky',
    createdAt: Date.now() - 3600000 * 52,
    isPinned: false,
  },
];

export const INITIAL_BUCKET_LIST: BucketListItem[] = [
  {
    id: 'b-1',
    title: 'Watch the sunrise from the beach wrapped in one big blanket',
    category: 'cozy',
    isCompleted: true,
    completedDate: '2026-04-18',
    completedNote: 'Did this in Mendocino. We were freezing but so happy!',
    suggestedBy: 'partner2',
  },
  {
    id: 'b-2',
    title: 'Take an authentic handmade pasta-making workshop together',
    category: 'food',
    isCompleted: false,
    suggestedBy: 'partner1',
  },
  {
    id: 'b-3',
    title: 'Go on a spontaneous road trip with zero maps and just follow road signs',
    category: 'adventure',
    isCompleted: false,
    suggestedBy: 'partner1',
  },
  {
    id: 'b-4',
    title: 'Stargaze on top of the car hood during a meteor shower',
    category: 'cozy',
    isCompleted: false,
    suggestedBy: 'partner2',
  },
  {
    id: 'b-5',
    title: 'Build a giant cozy blanket fort in the living room for a movie marathon',
    category: 'cozy',
    isCompleted: true,
    completedDate: '2026-03-02',
    completedNote: 'Watched Lord of the Rings with fairy lights inside.',
    suggestedBy: 'partner2',
  },
  {
    id: 'b-6',
    title: 'Take a hot air balloon ride at dawn',
    category: 'travel',
    isCompleted: false,
    suggestedBy: 'partner1',
  },
];

// Helper functions for LocalStorage
export function getSavedProfile(): PartnerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error loading profile', e);
  }
  return DEFAULT_PROFILE;
}

export function saveProfile(profile: PartnerProfile): void {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export function getSavedPhotos(): PhotoMemory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PHOTOS);
    if (raw) {
      const parsed: PhotoMemory[] = JSON.parse(raw);
      if (parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading photos', e);
  }
  return INITIAL_PHOTOS;
}

export function savePhotos(photos: PhotoMemory[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
  } catch (e) {
    console.warn('LocalStorage quota warning for photos, using memory/fallback', e);
  }
}

export function getSavedEvents(): CalendarEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (raw) {
      const parsed: CalendarEvent[] = JSON.parse(raw);
      if (parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading events', e);
  }
  return INITIAL_EVENTS;
}

export function saveEvents(events: CalendarEvent[]): void {
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
}

export function getSavedJournal(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    if (raw) {
      const parsed: JournalEntry[] = JSON.parse(raw);
      if (parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading journal', e);
  }
  return INITIAL_JOURNAL;
}

export function saveJournal(journal: JournalEntry[]): void {
  localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(journal));
}

export function getSavedNotes(): StickyLoveNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (raw) {
      const parsed: StickyLoveNote[] = JSON.parse(raw);
      if (parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading notes', e);
  }
  return INITIAL_NOTES;
}

export function saveNotes(notes: StickyLoveNote[]): void {
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
}

export function getSavedBucketList(): BucketListItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUCKET);
    if (raw) {
      const parsed: BucketListItem[] = JSON.parse(raw);
      if (parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading bucket list', e);
  }
  return INITIAL_BUCKET_LIST;
}

export function saveBucketList(list: BucketListItem[]): void {
  localStorage.setItem(STORAGE_KEYS.BUCKET, JSON.stringify(list));
}

// Complete Backup Export and Import
export function exportSanctuaryData(): string {
  const data = {
    profile: getSavedProfile(),
    photos: getSavedPhotos(),
    events: getSavedEvents(),
    journal: getSavedJournal(),
    notes: getSavedNotes(),
    bucketList: getSavedBucketList(),
    exportedAt: new Date().toISOString(),
    version: '1.0',
  };
  return JSON.stringify(data, null, 2);
}

export function importSanctuaryData(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (data.profile) saveProfile(data.profile);
    if (Array.isArray(data.photos)) savePhotos(data.photos);
    if (Array.isArray(data.events)) saveEvents(data.events);
    if (Array.isArray(data.journal)) saveJournal(data.journal);
    if (Array.isArray(data.notes)) saveNotes(data.notes);
    if (Array.isArray(data.bucketList)) saveBucketList(data.bucketList);
    return true;
  } catch (e) {
    console.error('Failed to import data', e);
    return false;
  }
}
