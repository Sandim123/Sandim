import React, { useState } from 'react';
import { JournalEntry, PartnerProfile, JournalReply } from '../types';
import { formatDatePretty, formatDateTimePretty } from '../lib/dateUtils';
import {
  Lock,
  Unlock,
  Plus,
  Heart,
  MessageCircle,
  MapPin,
  Calendar,
  Sparkles,
  Search,
  Send,
  Trash2,
  Edit3,
  X,
  Smile,
  ShieldCheck,
} from 'lucide-react';

interface MemoryJournalProps {
  entries: JournalEntry[];
  onAddEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  onUpdateEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  onAddReply: (entryId: string, reply: Omit<JournalReply, 'id' | 'createdAt'>) => void;
  profile: PartnerProfile;
}

const MOODS = [
  { id: 'deeply-in-love', label: 'Deeply in Love', icon: '💖' },
  { id: 'grateful', label: 'Deeply Grateful', icon: '🌿' },
  { id: 'adventurous', label: 'Adventurous', icon: '✨' },
  { id: 'peaceful', label: 'Quiet & Peaceful', icon: '☕' },
  { id: 'playful', label: 'Playful & Silly', icon: '🥞' },
  { id: 'nostalgic', label: 'Nostalgic', icon: '🌙' },
] as const;

const ROMANTIC_PROMPTS = [
  'What is one small thing your partner did this week that melted your heart?',
  'Describe a moment when you felt completely safe and at home in their arms.',
  'What was the funniest thing you two couldn’t stop laughing about together?',
  'What is a dream or trip you cannot wait to experience together next?',
  'Write a short letter to them about why January 6th changed your life.',
];

export const MemoryJournal: React.FC<MemoryJournalProps> = ({
  entries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onAddReply,
  profile,
}) => {
  // Lock state: If profile.pinLockEnabled is true, diary starts locked until unlocked with PIN
  const [isUnlocked, setIsUnlocked] = useState(!profile.pinLockEnabled);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [authorFilter, setAuthorFilter] = useState<'all' | 'partner1' | 'partner2'>('all');

  // New Entry Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState<JournalEntry['mood']>('deeply-in-love');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState<'partner1' | 'partner2'>(profile.activeUser);
  const [photoUrlInput, setPhotoUrlInput] = useState('');

  // Reply drawer state
  const [activeReplyEntryId, setActiveReplyEntryId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === (profile.pinCode || '1234')) {
      setIsUnlocked(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const openNewEntry = (promptText?: string) => {
    setEditingEntry(null);
    setTitle('');
    setEntryDate(new Date().toISOString().split('T')[0]);
    setMood('deeply-in-love');
    setLocation('');
    setContent(promptText ? `Prompt: ${promptText}\n\n` : '');
    setAuthor(profile.activeUser);
    setPhotoUrlInput('');
    setIsModalOpen(true);
  };

  const openEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setEntryDate(entry.date);
    setMood(entry.mood);
    setLocation(entry.location || '');
    setContent(entry.content);
    setAuthor(entry.author);
    setPhotoUrlInput(entry.photoUrls?.[0] || '');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const photoUrls = photoUrlInput.trim() ? [photoUrlInput.trim()] : undefined;

    if (editingEntry) {
      onUpdateEntry({
        ...editingEntry,
        title: title.trim(),
        date: entryDate,
        mood,
        location: location.trim() || undefined,
        content: content.trim(),
        author,
        photoUrls: photoUrls || editingEntry.photoUrls,
      });
    } else {
      onAddEntry({
        title: title.trim(),
        date: entryDate,
        author,
        mood,
        location: location.trim() || undefined,
        content: content.trim(),
        photoUrls,
        replies: [],
      });
    }

    setIsModalOpen(false);
  };

  const handleReplySubmit = (entryId: string) => {
    if (!replyText.trim()) return;
    onAddReply(entryId, {
      author: profile.activeUser,
      content: replyText.trim(),
    });
    setReplyText('');
    setActiveReplyEntryId(null);
  };

  // Filtered Entries
  const filteredEntries = entries.filter((entry) => {
    if (selectedMood !== 'all' && entry.mood !== selectedMood) return false;
    if (authorFilter !== 'all' && entry.author !== authorFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = entry.title.toLowerCase().includes(q);
      const matchContent = entry.content.toLowerCase().includes(q);
      const matchLocation = entry.location?.toLowerCase().includes(q);
      return matchTitle || matchContent || matchLocation;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header section with Privacy lock control */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#e7e1d8]">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[#c85a54]">
            Private Memory Sanctuary
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#2c2420]">
            Our Shared Journal
          </h2>
          <p className="text-xs sm:text-sm text-[#6e635b] mt-1">
            An intimate diary for our letters, confessions, reflections, and moments we want to cherish forever.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {profile.pinLockEnabled && (
            <button
              onClick={() => setIsUnlocked(!isUnlocked)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5d524a] bg-[#efeae3] hover:bg-[#e4ddd3] rounded-lg transition-colors border border-[#ded6cb]"
            >
              {isUnlocked ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Unlocked (Click to Lock)</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#c85a54]" />
                  <span>Private Lock Active</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => openNewEntry()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Write New Memory</span>
          </button>
        </div>
      </div>

      {/* Lock Screen if locked */}
      {!isUnlocked ? (
        <div className="max-w-md mx-auto my-12 bg-white border border-[#e8e2d8] rounded-2xl p-8 text-center space-y-5 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#fcedeb] text-[#c85a54] flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-2xl font-bold text-[#2c2420]">
              Our Secret Sanctuary is Locked
            </h3>
            <p className="text-xs text-[#6e635b]">
              Enter the 4-digit couple PIN to read and write private memories. (Default PIN: 1234)
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-3">
            <input
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              placeholder="Enter PIN"
              className="w-40 mx-auto text-center tracking-[0.5em] text-lg font-bold py-2 border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54] bg-[#faf8f5]"
              autoFocus
            />

            {pinError && (
              <p className="text-xs text-red-500 font-medium">
                Incorrect PIN. Please try again.
              </p>
            )}

            <div>
              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                Unlock Journal
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Daily Romantic Writing Prompts Spark */}
          <div className="bg-[#faf6f0] border border-[#e8e2d8] rounded-2xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c85a54]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Romantic Writing Spark</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm font-medium text-[#2c2420] italic">
                "{ROMANTIC_PROMPTS[0]}"
              </p>
              <button
                onClick={() => openNewEntry(ROMANTIC_PROMPTS[0])}
                className="text-xs font-semibold text-[#c85a54] hover:text-[#9f3a38] transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
              >
                Answer This Prompt →
              </button>
            </div>
          </div>

          {/* Search & Mood Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#8c827a] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search entries or memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-white"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => setAuthorFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
                  authorFilter === 'all'
                    ? 'bg-[#2c2420] text-white'
                    : 'bg-[#efeae3] text-[#6e635b] hover:text-[#2c2420]'
                }`}
              >
                All Writers
              </button>
              <button
                onClick={() => setAuthorFilter('partner1')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
                  authorFilter === 'partner1'
                    ? 'bg-[#c85a54] text-white'
                    : 'bg-[#efeae3] text-[#6e635b] hover:text-[#2c2420]'
                }`}
              >
                By {profile.name1}
              </button>
              <button
                onClick={() => setAuthorFilter('partner2')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
                  authorFilter === 'partner2'
                    ? 'bg-[#c85a54] text-white'
                    : 'bg-[#efeae3] text-[#6e635b] hover:text-[#2c2420]'
                }`}
              >
                By {profile.name2}
              </button>
            </div>
          </div>

          {/* Journal Entries List */}
          {filteredEntries.length === 0 ? (
            <div className="bg-white border border-[#e8e2d8] rounded-2xl p-12 text-center space-y-4 max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-[#f4ece3] text-[#c85a54] flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-[#2c2420]">
                  No journal memories found
                </h3>
                <p className="text-xs text-[#6e635b]">
                  Start writing down your shared journey. Even a few words about today can become a treasure years from now.
                </p>
              </div>
              <button
                onClick={() => openNewEntry()}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] rounded-lg transition-colors cursor-pointer"
              >
                Write First Memory
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredEntries.map((entry) => {
                const authorName = entry.author === 'partner1' ? profile.name1 : profile.name2;
                const moodObj = MOODS.find((m) => m.id === entry.mood);

                return (
                  <article
                    key={entry.id}
                    className="bg-white border border-[#e8e2d8] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4 transition-all hover:border-[#ded5c7]"
                  >
                    {/* Header: Date, Author, Mood, Actions */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        {/* Unboxed metadata per zero-pill rule */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#8c827a]">
                          <span className="font-medium text-[#2c2420]">By {authorName}</span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#c85a54]" />
                            {formatDatePretty(entry.date)}
                          </span>
                          {entry.location && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-[#c85a54]" />
                                {entry.location}
                              </span>
                            </>
                          )}
                          {moodObj && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>
                                {moodObj.icon} {moodObj.label}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="font-serif text-2xl font-bold text-[#2c2420] pt-1 leading-snug">
                          {entry.title}
                        </h3>
                      </div>

                      {/* Edit / Delete actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => openEditEntry(entry)}
                          className="p-1.5 text-[#8c827a] hover:text-[#2c2420] rounded hover:bg-[#f4ece3] transition-colors"
                          title="Edit entry"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this journal memory?')) {
                              onDeleteEntry(entry.id);
                            }
                          }}
                          className="p-1.5 text-red-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Story Body */}
                    <div className="text-sm sm:text-base text-[#4a4038] leading-relaxed whitespace-pre-line font-serif">
                      {entry.content}
                    </div>

                    {/* Attached Photo Thumbnails */}
                    {entry.photoUrls && entry.photoUrls.length > 0 && (
                      <div className="flex gap-3 pt-2 overflow-x-auto">
                        {entry.photoUrls.map((url, i) => (
                          <div
                            key={i}
                            className="w-32 h-24 rounded-xl overflow-hidden border border-[#ede7de] shrink-0 bg-[#2a2420]"
                          >
                            <img
                              src={url}
                              alt="Attached memory"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Partner Replies / Love Notes Thread */}
                    <div className="pt-4 border-t border-[#f2ece4] space-y-3">
                      {entry.replies && entry.replies.length > 0 && (
                        <div className="space-y-2">
                          {entry.replies.map((reply) => {
                            const replyAuthor =
                              reply.author === 'partner1' ? profile.name1 : profile.name2;
                            return (
                              <div
                                key={reply.id}
                                className="bg-[#faf6f0] border border-[#ede7de] rounded-xl p-3 text-xs space-y-1"
                              >
                                <div className="flex items-center justify-between text-[#8c827a]">
                                  <span className="font-semibold text-[#c85a54]">
                                    {replyAuthor}’s Note:
                                  </span>
                                  <span className="text-[11px]">
                                    {formatDateTimePretty(reply.createdAt)}
                                  </span>
                                </div>
                                <p className="text-[#3c342f] italic">"{reply.content}"</p>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Reply button or Reply input box */}
                      {activeReplyEntryId === entry.id ? (
                        <div className="space-y-2 pt-1">
                          <textarea
                            rows={2}
                            placeholder={`Leave a sweet love note response as ${
                              profile.activeUser === 'partner1' ? profile.name1 : profile.name2
                            }...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
                            autoFocus
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setActiveReplyEntryId(null);
                                setReplyText('');
                              }}
                              className="px-3 py-1 text-xs text-[#8c827a] hover:text-[#2c2420]"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleReplySubmit(entry.id)}
                              disabled={!replyText.trim()}
                              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Send className="w-3 h-3" />
                              <span>Send Note</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveReplyEntryId(entry.id);
                            setReplyText('');
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#c85a54] hover:text-[#9f3a38] transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Leave a love note reply</span>
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* New / Edit Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-[#e8e2d8] space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eae1]">
              <h3 className="font-serif text-xl font-bold text-[#2c2420]">
                {editingEntry ? 'Edit Memory' : 'Write a Shared Memory'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#8c827a] hover:text-[#2c2420] rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                  Memory Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. When we first walked into our home"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
                />
              </div>

              {/* Date & Mood */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                    Date of Memory
                  </label>
                  <input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                    Mood / Feeling
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value as JournalEntry['mood'])}
                    className="w-full px-3.5 py-2 text-sm border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
                  >
                    {MOODS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.icon} {m.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Living Room Couch"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                    Written By
                  </label>
                  <div className="flex items-center gap-3 pt-2">
                    <label className="flex items-center gap-1.5 text-xs text-[#2c2420] cursor-pointer">
                      <input
                        type="radio"
                        name="author"
                        checked={author === 'partner1'}
                        onChange={() => setAuthor('partner1')}
                        className="text-[#c85a54]"
                      />
                      <span>{profile.name1}</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-[#2c2420] cursor-pointer">
                      <input
                        type="radio"
                        name="author"
                        checked={author === 'partner2'}
                        onChange={() => setAuthor('partner2')}
                        className="text-[#c85a54]"
                      />
                      <span>{profile.name2}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Story Content */}
              <div>
                <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                  The Memory / Letter *
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Write freely from the heart. What happened? How did it make you feel? What do you want both of us to remember when we read this in 10 years?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5] font-serif leading-relaxed"
                />
              </div>

              {/* Optional Photo Image URL */}
              <div>
                <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                  Attach Photo URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Optional image link or data URL"
                  value={photoUrlInput}
                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
                />
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0eae1]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#6e635b] hover:text-[#2c2420] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() || !content.trim()}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] disabled:opacity-50 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  {editingEntry ? 'Save Changes' : 'Publish Memory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
