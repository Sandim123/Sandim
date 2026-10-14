import React, { useState } from 'react';
import { BucketListItem, PartnerProfile } from '../types';
import { CheckCircle2, Circle, Plus, Trash2, Sparkles, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BucketListProps {
  items: BucketListItem[];
  onToggleComplete: (id: string, note?: string) => void;
  onAddItem: (item: Omit<BucketListItem, 'id'>) => void;
  onDeleteItem: (id: string) => void;
  profile: PartnerProfile;
}

const CATEGORIES = [
  { id: 'all', label: 'All Adventures' },
  { id: 'cozy', label: 'Cozy & Home' },
  { id: 'food', label: 'Food & Culinary' },
  { id: 'travel', label: 'Trips & Travel' },
  { id: 'adventure', label: 'Adventures' },
] as const;

export const BucketList: React.FC<BucketListProps> = ({
  items,
  onToggleComplete,
  onAddItem,
  onDeleteItem,
  profile,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BucketListItem['category']>('cozy');

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const completedCount = items.filter((i) => i.isCompleted).length;
  const progressPercent = Math.round((completedCount / (items.length || 1)) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddItem({
      title: title.trim(),
      category,
      isCompleted: false,
      suggestedBy: profile.activeUser,
    });

    setTitle('');
    setIsAdding(false);
  };

  const handleToggle = (item: BucketListItem) => {
    if (!item.isCompleted) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      const note = prompt('Add a quick memory note for completing this? (Optional):');
      onToggleComplete(item.id, note || undefined);
    } else {
      onToggleComplete(item.id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section with progress */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#e7e1d8]">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[#c85a54]">
            Bucket List & Shared Dreams
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#2c2420]">
            Adventures We Dream To Do
          </h2>
          <p className="text-xs sm:text-sm text-[#6e635b] mt-1">
            {completedCount} of {items.length} adventures checked off together ({progressPercent}% achieved)
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] rounded-lg transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Dream Adventure</span>
        </button>
      </div>

      {/* Progress Card */}
      <div className="bg-white border border-[#e8e2d8] rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#d97706] flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>Relationship Adventure Index</span>
          </div>
          <h4 className="font-serif text-lg font-bold text-[#2c2420]">
            Building our story, one adventure at a time
          </h4>
        </div>

        <div className="w-full sm:w-64 space-y-1.5">
          <div className="flex justify-between text-xs text-[#8c827a] font-medium">
            <span>{completedCount} Completed</span>
            <span>{items.length - completedCount} Waiting</span>
          </div>
          <div className="w-full bg-[#f1ebe4] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#d97706] to-[#059669] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#efeae3] rounded-lg overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filter === cat.id
                ? 'bg-white text-[#2c2420] shadow-xs font-semibold'
                : 'text-[#6e635b] hover:text-[#2c2420]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Add New Item Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white border border-[#ded6cb] rounded-xl p-4 sm:p-5 space-y-3 shadow-xs">
          <h4 className="font-serif text-base font-bold text-[#2c2420]">
            Add New Adventure / Date Idea
          </h4>
          <input
            type="text"
            required
            placeholder="e.g., Go on a hot air balloon ride at sunrise"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
            autoFocus
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6e635b] font-medium">Category:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BucketListItem['category'])}
                className="text-xs border border-[#ded6cb] rounded-md px-2 py-1 bg-[#faf8f5]"
              >
                <option value="cozy">Cozy & Home</option>
                <option value="food">Food & Culinary</option>
                <option value="travel">Trips & Travel</option>
                <option value="adventure">Adventures</option>
              </select>
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
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] rounded-md transition-colors"
              >
                Save Adventure
              </button>
            </div>
          </div>
        </form>
      )}

      {/* List of bucket list items */}
      <div className="bg-white border border-[#e8e2d8] rounded-2xl divide-y divide-[#f2ece4] overflow-hidden shadow-xs">
        {filteredItems.map((item) => {
          const suggestedByName =
            item.suggestedBy === 'partner1' ? profile.name1 : profile.name2;

          return (
            <div
              key={item.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-3 transition-colors ${
                item.isCompleted ? 'bg-[#fafaf8]' : 'hover:bg-[#fdfcf9]'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggle(item)}
                  className="mt-0.5 text-[#c85a54] hover:scale-110 transition-transform cursor-pointer"
                  title={item.isCompleted ? 'Mark incomplete' : 'Mark completed!'}
                >
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 fill-[#059669] text-white" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#8c827a] hover:text-[#c85a54]" />
                  )}
                </button>

                <div className="space-y-1">
                  <h5
                    className={`text-sm sm:text-base font-medium leading-snug ${
                      item.isCompleted
                        ? 'line-through text-[#8c827a]'
                        : 'text-[#2c2420]'
                    }`}
                  >
                    {item.title}
                  </h5>

                  {item.completedNote && (
                    <p className="text-xs text-[#059669] italic bg-[#e7f4ed] px-2 py-0.5 rounded inline-block">
                      ✓ {item.completedDate ? `${item.completedDate}: ` : ''}{item.completedNote}
                    </p>
                  )}

                  <div className="text-[11px] text-[#8c827a]">
                    Suggested by: {suggestedByName}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm('Delete this bucket list item?')) {
                    onDeleteItem(item.id);
                  }
                }}
                className="text-[#b3a89e] hover:text-red-500 p-1 transition-colors"
                title="Delete item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
