import React, { useState } from 'react';
import { StickyLoveNote, PartnerProfile } from '../types';
import { formatDateTimePretty } from '../lib/dateUtils';
import { Plus, Trash2, Pin, Heart, Send, Sparkles } from 'lucide-react';

interface LoveNotesBoardProps {
  notes: StickyLoveNote[];
  onAddNote: (note: Omit<StickyLoveNote, 'id' | 'createdAt'>) => void;
  onDeleteNote: (id: string) => void;
  profile: PartnerProfile;
}

const COLOR_MAP = {
  rose: 'bg-[#fff1f2] border-[#fecdd3] text-[#881337]',
  amber: 'bg-[#fffbeb] border-[#fde68a] text-[#78350f]',
  emerald: 'bg-[#ecfdf5] border-[#a7f3d0] text-[#064e3b]',
  sky: 'bg-[#f0f9ff] border-[#bae6fd] text-[#0c4a6e]',
  violet: 'bg-[#f5f3ff] border-[#ddd6fe] text-[#4c1d95]',
};

export const LoveNotesBoard: React.FC<LoveNotesBoardProps> = ({
  notes,
  onAddNote,
  onDeleteNote,
  profile,
}) => {
  const [message, setMessage] = useState('');
  const [color, setColor] = useState<StickyLoveNote['color']>('rose');
  const [isAdding, setIsAdding] = useState(false);

  const activeAuthor = profile.activeUser;
  const recipient = activeAuthor === 'partner1' ? 'partner2' : 'partner1';

  const authorName = activeAuthor === 'partner1' ? profile.name1 : profile.name2;
  const recipientName = recipient === 'partner1' ? profile.name1 : profile.name2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onAddNote({
      from: activeAuthor,
      to: recipient,
      message: message.trim(),
      color,
      isPinned: true,
    });

    setMessage('');
    setIsAdding(false);
  };

  return (
    <div className="bg-[#faf6f0] border border-[#e8e2d8] rounded-2xl p-6 sm:p-7 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ece4d8]">
        <div>
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#c85a54]">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>The Little Fridge Board</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#2c2420]">
            Love Notes Left For Each Other
          </h3>
          <p className="text-xs text-[#6e635b]">
            Spontaneous little sticky notes left for {profile.name1} & {profile.name2}.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] rounded-lg transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Leave a Sticky Note</span>
        </button>
      </div>

      {/* Note composer */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white border border-[#ded6cb] rounded-xl p-4 space-y-3 shadow-xs">
          <div className="text-xs font-semibold text-[#2c2420]">
            From <span className="text-[#c85a54]">{authorName}</span> to <span className="text-[#c85a54]">{recipientName}</span>
          </div>

          <textarea
            rows={2}
            required
            placeholder="Write a sweet, funny, or encouraging note..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
            autoFocus
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#8c827a]">Color:</span>
              {(['rose', 'amber', 'emerald', 'sky', 'violet'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-5 h-5 rounded-full border transition-transform ${
                    color === c ? 'scale-125 border-[#2c2420]' : 'border-black/10'
                  } ${
                    c === 'rose'
                      ? 'bg-rose-200'
                      : c === 'amber'
                      ? 'bg-amber-200'
                      : c === 'emerald'
                      ? 'bg-emerald-200'
                      : c === 'sky'
                      ? 'bg-sky-200'
                      : 'bg-violet-200'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 text-xs text-[#6e635b] hover:text-[#2c2420]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] rounded-md transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>Stick Note</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Grid of Sticky Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => {
          const fromName = note.from === 'partner1' ? profile.name1 : profile.name2;
          const toName = note.to === 'partner1' ? profile.name1 : profile.name2;
          const colorClass = COLOR_MAP[note.color] || COLOR_MAP.rose;

          return (
            <div
              key={note.id}
              className={`p-4 rounded-xl border shadow-xs transition-transform hover:-translate-y-0.5 relative group ${colorClass}`}
            >
              <div className="flex items-start justify-between pb-2 mb-2 border-b border-black/10 text-[11px] font-semibold opacity-75">
                <span className="flex items-center gap-1">
                  <Pin className="w-3 h-3 fill-current rotate-45" />
                  <span>{fromName} → {toName}</span>
                </span>
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-700 transition-opacity"
                  title="Remove note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs sm:text-sm font-serif leading-relaxed italic">
                "{note.message}"
              </p>

              <div className="text-[10px] opacity-60 text-right mt-3">
                {formatDateTimePretty(note.createdAt)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
