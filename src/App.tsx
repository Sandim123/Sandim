/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LoginScreen } from './components/LoginScreen';
import { WelcomePopupModal } from './components/WelcomePopupModal';
import { SurpriseMessageManager } from './components/SurpriseMessageManager';
import { RelationshipCounter } from './components/RelationshipCounter';
import { PhotoGallery } from './components/PhotoGallery';
import { InteractiveCalendar } from './components/InteractiveCalendar';
import { MemoryJournal } from './components/MemoryJournal';
import { LoveNotesBoard } from './components/LoveNotesBoard';
import { BucketList } from './components/BucketList';
import { ProfileModal } from './components/ProfileModal';

import {
  PartnerProfile,
  UserAccount,
  PhotoMemory,
  CalendarEvent,
  JournalEntry,
  StickyLoveNote,
  BucketListItem,
  PartnerWelcomeMessage,
} from './types';

import {
  getSavedProfile,
  saveProfile,
  getSavedPhotos,
  savePhotos,
  getSavedEvents,
  saveEvents,
  getSavedJournal,
  saveJournal,
  getSavedNotes,
  saveNotes,
  getSavedBucketList,
  saveBucketList,
} from './lib/storage';

import {
  getActiveSession,
  createSession,
  clearSession,
  getStoredAccounts,
  getStoredWelcomeMessage,
} from './lib/auth';

import { calculateRelationshipTime, formatDatePretty } from './lib/dateUtils';
import heroImg from './assets/images/couple_hero_banner_1791938246946.jpg';
import {
  Heart,
  Clock,
  Camera,
  Calendar as CalendarIcon,
  BookOpen,
  ArrowRight,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  Send,
} from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<PartnerProfile>(getSavedProfile);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isInitializingAuth, setIsInitializingAuth] = useState(true);

  // Content state (only rendered when authenticated)
  const [photos, setPhotos] = useState<PhotoMemory[]>(getSavedPhotos);
  const [events, setEvents] = useState<CalendarEvent[]>(getSavedEvents);
  const [journal, setJournal] = useState<JournalEntry[]>(getSavedJournal);
  const [notes, setNotes] = useState<StickyLoveNote[]>(getSavedNotes);
  const [bucketList, setBucketList] = useState<BucketListItem[]>(getSavedBucketList);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'counter' | 'photos' | 'calendar' | 'journal' | 'bucket'
  >('overview');

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSurpriseManagerOpen, setIsSurpriseManagerOpen] = useState(false);
  const [activeWelcomePopup, setActiveWelcomePopup] = useState<PartnerWelcomeMessage | null>(null);

  // Check active session on mount
  useEffect(() => {
    const session = getActiveSession();
    if (session) {
      const accounts = getStoredAccounts();
      const user = accounts.find((a) => a.id === session.userId);
      if (user) {
        setCurrentUser(user);
        // Keep activeUser in profile aligned
        setProfile((prev) => ({ ...prev, activeUser: user.id }));
      }
    }
    setIsInitializingAuth(false);
  }, []);

  // When user logs in
  const handleLoginSuccess = (user: UserAccount) => {
    createSession(user.id);
    setCurrentUser(user);
    setProfile((prev) => {
      const updated: PartnerProfile = { ...prev, activeUser: user.id };
      saveProfile(updated);
      return updated;
    });

    // Check if user is Her ('partner2'), and show popup right after login!
    if (user.id === 'partner2') {
      const msg = getStoredWelcomeMessage();
      if (msg.isEnabled) {
        if (
          msg.frequency === 'every_session' ||
          (msg.frequency === 'once_until_acknowledged' && !msg.acknowledgedAt)
        ) {
          // Trigger the surprise popup immediately
          setTimeout(() => {
            setActiveWelcomePopup(msg);
          }, 300);
        }
      }
    }
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    setActiveTab('overview');
  };

  // Sync profile changes
  const handleUpdateProfile = (newProfile: PartnerProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  // Photo handlers
  const handleAddPhoto = (newPhoto: Omit<PhotoMemory, 'id' | 'createdAt'>) => {
    const photo: PhotoMemory = {
      ...newPhoto,
      id: `p-${Date.now()}`,
      createdAt: Date.now(),
    };
    const updated = [photo, ...photos];
    setPhotos(updated);
    savePhotos(updated);
  };

  const handleDeletePhoto = (id: string) => {
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
    savePhotos(updated);
  };

  const handleToggleFavoritePhoto = (id: string) => {
    const updated = photos.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
    setPhotos(updated);
    savePhotos(updated);
  };

  // Calendar handlers
  const handleAddEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const event: CalendarEvent = {
      ...newEvent,
      id: `e-${Date.now()}`,
    };
    const updated = [...events, event].sort((a, b) => a.date.localeCompare(b.date));
    setEvents(updated);
    saveEvents(updated);
  };

  const handleUpdateEvent = (updatedEvent: CalendarEvent) => {
    const updated = events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e));
    setEvents(updated);
    saveEvents(updated);
  };

  const handleDeleteEvent = (id: string) => {
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    saveEvents(updated);
  };

  // Journal handlers
  const handleAddJournalEntry = (newEntry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const entry: JournalEntry = {
      ...newEntry,
      id: `j-${Date.now()}`,
      createdAt: Date.now(),
    };
    const updated = [entry, ...journal];
    setJournal(updated);
    saveJournal(updated);
  };

  const handleUpdateJournalEntry = (updatedEntry: JournalEntry) => {
    const updated = journal.map((j) => (j.id === updatedEntry.id ? updatedEntry : j));
    setJournal(updated);
    saveJournal(updated);
  };

  const handleDeleteJournalEntry = (id: string) => {
    const updated = journal.filter((j) => j.id !== id);
    setJournal(updated);
    saveJournal(updated);
  };

  const handleAddReply = (
    entryId: string,
    replyData: { author: 'partner1' | 'partner2'; content: string }
  ) => {
    const updated = journal.map((entry) => {
      if (entry.id === entryId) {
        const newReply = {
          id: `r-${Date.now()}`,
          author: replyData.author,
          content: replyData.content,
          createdAt: Date.now(),
        };
        return {
          ...entry,
          replies: [...(entry.replies || []), newReply],
        };
      }
      return entry;
    });
    setJournal(updated);
    saveJournal(updated);
  };

  // Sticky notes handlers
  const handleAddNote = (newNote: Omit<StickyLoveNote, 'id' | 'createdAt'>) => {
    const note: StickyLoveNote = {
      ...newNote,
      id: `n-${Date.now()}`,
      createdAt: Date.now(),
    };
    const updated = [note, ...notes];
    setNotes(updated);
    saveNotes(updated);
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    saveNotes(updated);
  };

  // Bucket list handlers
  const handleToggleBucket = (id: string, note?: string) => {
    const updated = bucketList.map((item) => {
      if (item.id === id) {
        const isNowDone = !item.isCompleted;
        return {
          ...item,
          isCompleted: isNowDone,
          completedDate: isNowDone ? new Date().toISOString().split('T')[0] : undefined,
          completedNote: isNowDone ? note || 'Completed together with love ❤️' : undefined,
        };
      }
      return item;
    });
    setBucketList(updated);
    saveBucketList(updated);
  };

  const handleAddBucketItem = (newItem: Omit<BucketListItem, 'id'>) => {
    const item: BucketListItem = {
      ...newItem,
      id: `b-${Date.now()}`,
    };
    const updated = [...bucketList, item];
    setBucketList(updated);
    saveBucketList(updated);
  };

  const handleDeleteBucketItem = (id: string) => {
    const updated = bucketList.filter((b) => b.id !== id);
    setBucketList(updated);
    saveBucketList(updated);
  };

  const handleDataReload = () => {
    setProfile(getSavedProfile());
    setPhotos(getSavedPhotos());
    setEvents(getSavedEvents());
    setJournal(getSavedJournal());
    setNotes(getSavedNotes());
    setBucketList(getSavedBucketList());
  };

  // Live timer calculations
  const [duration, setDuration] = useState(() => calculateRelationshipTime(profile.relationshipStartDate));
  useEffect(() => {
    const t = setInterval(() => {
      setDuration(calculateRelationshipTime(profile.relationshipStartDate));
    }, 1000);
    return () => clearInterval(t);
  }, [profile.relationshipStartDate]);

  // Today upcoming events
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingEvents = events
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  // If loading session
  if (isInitializingAuth) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <Heart className="w-8 h-8 text-[#c85a54] animate-pulse" />
      </div>
    );
  }

  // If not logged in, enforce authentication barrier completely!
  if (!currentUser) {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        profile={profile}
      />
    );
  }

  const isHim = currentUser.id === 'partner1';
  const partnerName = isHim ? profile.name2 : profile.name1;
  const currentWelcomeMsg = getStoredWelcomeMessage();

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2420] flex flex-col font-sans selection:bg-[#c85a54]/20 selection:text-[#2c2420]">
      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSurpriseManager={() => setIsSurpriseManagerOpen(true)}
      />

      {/* Main Content Area (pb-24 on mobile prevents fixed bottom bar overlap) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 pb-24 md:pb-12">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-14">
            {/* Pop-up for Her quick manager prompt (only visible to him) */}
            {isHim && (
              <div className="bg-[#fcedeb] border border-[#fecdd3] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#c85a54] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Welcome Pop-up for {profile.name2}</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-[#2c2420]">
                    Current Message: "{currentWelcomeMsg.title}"
                  </h4>
                  <p className="text-xs text-[#6e635b]">
                    {currentWelcomeMsg.isEnabled
                      ? `Active: Pops up right after ${profile.name2} logs in.`
                      : 'Currently disabled.'}
                    {currentWelcomeMsg.responseNote && (
                      <span className="text-[#c85a54] font-medium block sm:inline sm:ml-2">
                        Her latest reply: "{currentWelcomeMsg.responseNote}"
                      </span>
                    )}
                  </p>
                </div>

                <button
                  onClick={() => setIsSurpriseManagerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Edit Pop-up Message</span>
                </button>
              </div>
            )}

            {/* Split-Screen Hero Section (Per Frontend Design Skill) */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
              {/* Left Column: Typographic Hierarchy */}
              <div className="flex flex-col justify-center space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c85a54]">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>Logged in as {currentUser.displayName}</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2c2420] text-balance leading-[1.12]">
                  {profile.name1} & {profile.name2}
                </h1>

                <p className="text-base sm:text-lg text-[#6e635b] leading-relaxed max-w-xl font-light">
                  Counting every single second since January 6th, 2026. A private home for our shared photos,
                  dates on our calendar, and heartfelt journal letters to each other.
                </p>

                {/* Navigation CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('counter')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] rounded-lg transition-colors shadow-xs cursor-pointer"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Watch Our Timer</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('photos')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#2c2420] bg-[#efeae3] hover:bg-[#e4ddd3] rounded-lg transition-colors border border-[#ded6cb] cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-[#c85a54]" />
                    <span>Photo Album</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('journal')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#2c2420] bg-white hover:bg-[#faf8f5] rounded-lg transition-colors border border-[#ded6cb] cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-[#c85a54]" />
                    <span>Secret Journal</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Hero Visual Container */}
              <div className="relative rounded-2xl overflow-hidden border border-[#e8e2d8] shadow-md min-h-[320px] sm:min-h-[420px] bg-[#1c1917]">
                <img
                  src={heroImg}
                  alt="Couple embracing at sunset"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 text-white space-y-1">
                  <div className="text-xs text-[#fcd34d] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Since January 6th, 2026</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold">
                    Where Two Worlds Became One
                  </h3>
                  <p className="text-xs text-[#e0d7cd] italic max-w-md">
                    "{profile.anniversaryNote || 'The best decision of our lives, celebrated every second.'}"
                  </p>
                </div>
              </div>
            </section>

            {/* 4-Item KPI / Metrics Strip (Full-width below hero split per rule) */}
            <section className="bg-white border border-[#e8e2d8] rounded-2xl p-6 grid grid-cols-2 lg:grid-cols-4 gap-6 shadow-xs text-center">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#8c827a]">
                  Days Together
                </span>
                <div className="font-serif text-3xl sm:text-4xl font-bold text-[#c85a54] tabular-nums mt-1">
                  {duration.totalDays} Days
                </div>
                <p className="text-[11px] text-[#8c827a] mt-0.5">Since Jan 6, 2026</p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#8c827a]">
                  Photos Captured
                </span>
                <div className="font-serif text-3xl sm:text-4xl font-bold text-[#2c2420] tabular-nums mt-1">
                  {photos.length}
                </div>
                <p className="text-[11px] text-[#8c827a] mt-0.5">In our shared album</p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#8c827a]">
                  Upcoming Plans
                </span>
                <div className="font-serif text-3xl sm:text-4xl font-bold text-[#2c2420] tabular-nums mt-1">
                  {upcomingEvents.length}
                </div>
                <p className="text-[11px] text-[#8c827a] mt-0.5">On our shared calendar</p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#8c827a]">
                  Journal Memories
                </span>
                <div className="font-serif text-3xl sm:text-4xl font-bold text-[#2c2420] tabular-nums mt-1">
                  {journal.length}
                </div>
                <p className="text-[11px] text-[#8c827a] mt-0.5">Private letters & reflections</p>
              </div>
            </section>

            {/* Live Relationship Counter Spotlight Strip */}
            <section className="bg-[#faf6f0] border border-[#e8e2d8] rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ece4d8]">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#c85a54]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Real-Time Relationship Counter</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#2c2420]">
                    Time Spent In Love
                  </h3>
                </div>

                <button
                  onClick={() => setActiveTab('counter')}
                  className="text-xs font-semibold text-[#c85a54] hover:text-[#9f3a38] flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <span>Open Full Milestone Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                <div className="bg-white border border-[#ede7de] rounded-xl p-3 text-center">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2c2420] tabular-nums">
                    {duration.years}
                  </div>
                  <div className="text-[10px] uppercase font-semibold text-[#8c827a]">Years</div>
                </div>
                <div className="bg-white border border-[#ede7de] rounded-xl p-3 text-center">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2c2420] tabular-nums">
                    {duration.months}
                  </div>
                  <div className="text-[10px] uppercase font-semibold text-[#8c827a]">Months</div>
                </div>
                <div className="bg-white border border-[#ede7de] rounded-xl p-3 text-center">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2c2420] tabular-nums">
                    {duration.days}
                  </div>
                  <div className="text-[10px] uppercase font-semibold text-[#8c827a]">Days</div>
                </div>
                <div className="bg-white border border-[#ede7de] rounded-xl p-3 text-center">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2c2420] tabular-nums">
                    {String(duration.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] uppercase font-semibold text-[#8c827a]">Hours</div>
                </div>
                <div className="bg-white border border-[#ede7de] rounded-xl p-3 text-center">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2c2420] tabular-nums">
                    {String(duration.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] uppercase font-semibold text-[#8c827a]">Mins</div>
                </div>
                <div className="bg-white border border-[#ede7de] rounded-xl p-3 text-center bg-[#fff8f7] border-[#c85a54]/30">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#c85a54] tabular-nums">
                    {String(duration.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] uppercase font-semibold text-[#c85a54]">Secs</div>
                </div>
              </div>
            </section>

            {/* Quick Glimpse: Photo Highlights & Upcoming Dates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Photo Memories */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#c85a54]" />
                    <h3 className="font-serif text-xl font-bold text-[#2c2420]">
                      Recent Memories
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('photos')}
                    className="text-xs font-semibold text-[#c85a54] hover:underline cursor-pointer"
                  >
                    View All ({photos.length}) →
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {photos.slice(0, 2).map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => setActiveTab('photos')}
                      className="group relative rounded-xl overflow-hidden border border-[#ede7de] h-48 cursor-pointer bg-[#2a2420]"
                    >
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 inset-x-0 p-3 text-white">
                        <div className="text-[10px] text-[#e0d7cd]">
                          {formatDatePretty(photo.date)}
                        </div>
                        <div className="text-xs font-bold truncate">{photo.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Shared Plans */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#c85a54]" />
                    <h3 className="font-serif text-xl font-bold text-[#2c2420]">
                      Next Plans On Calendar
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('calendar')}
                    className="text-xs font-semibold text-[#c85a54] hover:underline cursor-pointer"
                  >
                    Open Calendar →
                  </button>
                </div>

                <div className="bg-white border border-[#e8e2d8] rounded-2xl p-4 divide-y divide-[#f2ece4] shadow-xs">
                  {upcomingEvents.length === 0 ? (
                    <p className="text-xs text-[#8c827a] py-4 text-center">
                      No upcoming plans. Schedule a date night!
                    </p>
                  ) : (
                    upcomingEvents.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={() => setActiveTab('calendar')}
                        className="py-3 flex items-center justify-between gap-3 cursor-pointer group hover:bg-[#faf8f5] px-2 rounded-lg transition-colors"
                      >
                        <div className="space-y-0.5">
                          <div className="text-sm font-semibold text-[#2c2420] group-hover:text-[#c85a54] transition-colors">
                            {ev.title}
                          </div>
                          <div className="text-xs text-[#8c827a] flex items-center gap-2">
                            <span>{formatDatePretty(ev.date)}</span>
                            {ev.time && <span>· {ev.time}</span>}
                            {ev.location && <span>· {ev.location}</span>}
                          </div>
                        </div>

                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: ev.color || '#c85a54' }}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Little Fridge Sticky Love Notes */}
            <LoveNotesBoard
              notes={notes}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              profile={profile}
            />
          </div>
        )}

        {/* TIMER COUNT-UP TAB */}
        {activeTab === 'counter' && (
          <RelationshipCounter
            profile={profile}
            onEditDate={() => setIsSettingsOpen(true)}
          />
        )}

        {/* PHOTO ALBUM TAB */}
        {activeTab === 'photos' && (
          <PhotoGallery
            photos={photos}
            onAddPhoto={handleAddPhoto}
            onDeletePhoto={handleDeletePhoto}
            onToggleFavorite={handleToggleFavoritePhoto}
            profile={profile}
          />
        )}

        {/* INTERACTIVE CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <InteractiveCalendar
            events={events}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            profile={profile}
          />
        )}

        {/* PRIVATE MEMORY JOURNAL TAB */}
        {activeTab === 'journal' && (
          <MemoryJournal
            entries={journal}
            onAddEntry={handleAddJournalEntry}
            onUpdateEntry={handleUpdateJournalEntry}
            onDeleteEntry={handleDeleteJournalEntry}
            onAddReply={handleAddReply}
            profile={profile}
          />
        )}

        {/* BUCKET LIST TAB */}
        {activeTab === 'bucket' && (
          <BucketList
            items={bucketList}
            onToggleComplete={handleToggleBucket}
            onAddItem={handleAddBucketItem}
            onDeleteItem={handleDeleteBucketItem}
            profile={profile}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#e7e1d8] py-8 text-center text-xs text-[#8c827a] bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Everus</span>
            <span aria-hidden="true">·</span>
            <span>A private space for {profile.name1} & {profile.name2}</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Started January 6, 2026</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-[#2c2420] transition-colors cursor-pointer"
            >
              Settings & Passwords
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleLogout}
              className="hover:text-red-600 transition-colors cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>
      </footer>

      {/* Pop-up message right after she logs in */}
      {activeWelcomePopup && (
        <WelcomePopupModal
          message={activeWelcomePopup}
          profile={profile}
          onClose={() => setActiveWelcomePopup(null)}
          onReplySent={(replyText) => {
            // Also append her reply to the sticky notes board so he sees it there too!
            handleAddNote({
              from: 'partner2',
              to: 'partner1',
              message: replyText,
              color: 'rose',
              isPinned: true,
            });
          }}
        />
      )}

      {/* Surprise Message Manager Modal (For Him) */}
      {isSurpriseManagerOpen && (
        <SurpriseMessageManager
          profile={profile}
          onClose={() => setIsSurpriseManagerOpen(false)}
        />
      )}

      {/* Settings & Passwords Modal */}
      {isSettingsOpen && (
        <ProfileModal
          profile={profile}
          currentUser={currentUser}
          onSaveProfile={handleUpdateProfile}
          onClose={() => setIsSettingsOpen(false)}
          onDataReload={handleDataReload}
        />
      )}
    </div>
  );
}
