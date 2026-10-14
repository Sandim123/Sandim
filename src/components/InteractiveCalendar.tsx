import React, { useState } from 'react';
import { CalendarEvent, PartnerProfile } from '../types';
import { formatDatePretty } from '../lib/dateUtils';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Trash2,
  Edit2,
  X,
  Heart,
  Plane,
  Wine,
  Sparkles,
} from 'lucide-react';

interface InteractiveCalendarProps {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
  profile: PartnerProfile;
}

export const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  profile,
}) => {
  // Current view date in calendar
  const [currentDate, setCurrentDate] = useState(() => new Date());
  // Selected day string: YYYY-MM-DD
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    () => new Date().toISOString().split('T')[0]
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(selectedDateStr);
  const [time, setTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<CalendarEvent['category']>('date');
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState('#e11d48');
  const [createdBy, setCreatedBy] = useState<'partner1' | 'partner2'>(profile.activeUser);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Month navigation
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Month metadata
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Open Add modal
  const openAddModal = (dateForEvent?: string) => {
    setEditingEvent(null);
    setTitle('');
    setEventDate(dateForEvent || selectedDateStr);
    setTime('19:00');
    setEndDate('');
    setLocation('');
    setCategory('date');
    setNotes('');
    setColor('#e11d48');
    setCreatedBy(profile.activeUser);
    setIsModalOpen(true);
  };

  // Open Edit modal
  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setTitle(event.title);
    setEventDate(event.date);
    setTime(event.time || '');
    setEndDate(event.endDate || '');
    setLocation(event.location || '');
    setCategory(event.category);
    setNotes(event.notes || '');
    setColor(event.color || '#e11d48');
    setCreatedBy(event.createdBy);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !eventDate) return;

    if (editingEvent) {
      onUpdateEvent({
        ...editingEvent,
        title: title.trim(),
        date: eventDate,
        time: time || undefined,
        endDate: endDate || undefined,
        location: location.trim() || undefined,
        category,
        notes: notes.trim() || undefined,
        color,
        createdBy,
      });
    } else {
      onAddEvent({
        title: title.trim(),
        date: eventDate,
        time: time || undefined,
        endDate: endDate || undefined,
        location: location.trim() || undefined,
        category,
        notes: notes.trim() || undefined,
        color,
        createdBy,
      });
    }

    setIsModalOpen(false);
  };

  // Category visual tag helper
  const getCategoryIcon = (cat: CalendarEvent['category']) => {
    switch (cat) {
      case 'anniversary':
        return <Heart className="w-3.5 h-3.5" />;
      case 'date':
        return <Wine className="w-3.5 h-3.5" />;
      case 'trip':
        return <Plane className="w-3.5 h-3.5" />;
      case 'milestone':
        return <Sparkles className="w-3.5 h-3.5" />;
      default:
        return <CalendarIcon className="w-3.5 h-3.5" />;
    }
  };

  // Filter events
  const filteredEvents = events.filter((e) => {
    if (categoryFilter === 'all') return true;
    return e.category === categoryFilter;
  });

  // Selected day events
  const selectedDayEvents = filteredEvents.filter((e) => {
    if (e.date === selectedDateStr) return true;
    if (e.endDate && selectedDateStr >= e.date && selectedDateStr <= e.endDate) return true;
    return false;
  });

  // Events grouped by date for fast calendar lookup
  const eventsByDate = new Map<string, CalendarEvent[]>();
  filteredEvents.forEach((ev) => {
    const list = eventsByDate.get(ev.date) || [];
    list.push(ev);
    eventsByDate.set(ev.date, list);
  });

  // Upcoming events
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingEvents = [...events]
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header section with Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#e7e1d8]">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[#c85a54]">
            Shared Schedule
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#2c2420]">
            Our Calendar
          </h2>
          <p className="text-xs sm:text-sm text-[#6e635b] mt-1">
            Date nights, anniversaries, weekend trips, and memories we are looking forward to. Both of you can edit anytime.
          </p>
        </div>

        <button
          onClick={() => openAddModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] rounded-lg transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Shared Plan</span>
        </button>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-1.5 p-1 bg-[#efeae3] rounded-lg overflow-x-auto">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
            categoryFilter === 'all'
              ? 'bg-white text-[#2c2420] shadow-xs font-semibold'
              : 'text-[#6e635b] hover:text-[#2c2420]'
          }`}
        >
          All Plans ({events.length})
        </button>
        <button
          onClick={() => setCategoryFilter('date')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
            categoryFilter === 'date'
              ? 'bg-white text-[#2c2420] shadow-xs font-semibold'
              : 'text-[#6e635b] hover:text-[#2c2420]'
          }`}
        >
          Date Nights
        </button>
        <button
          onClick={() => setCategoryFilter('trip')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
            categoryFilter === 'trip'
              ? 'bg-white text-[#2c2420] shadow-xs font-semibold'
              : 'text-[#6e635b] hover:text-[#2c2420]'
          }`}
        >
          Trips & Travel
        </button>
        <button
          onClick={() => setCategoryFilter('anniversary')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
            categoryFilter === 'anniversary'
              ? 'bg-white text-[#2c2420] shadow-xs font-semibold'
              : 'text-[#6e635b] hover:text-[#2c2420]'
          }`}
        >
          Anniversaries
        </button>
        <button
          onClick={() => setCategoryFilter('milestone')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
            categoryFilter === 'milestone'
              ? 'bg-white text-[#2c2420] shadow-xs font-semibold'
              : 'text-[#6e635b] hover:text-[#2c2420]'
          }`}
        >
          Milestones
        </button>
      </div>

      {/* Main Calendar View: Grid on Left, Day Inspector / Upcoming on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid Container (Takes 2 columns) */}
        <div className="lg:col-span-2 bg-white border border-[#e8e2d8] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          {/* Calendar Month Navigation Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-[#f0eae1]">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2c2420]">
              {monthName}
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={goToToday}
                className="px-3 py-1 text-xs font-semibold text-[#5d524a] bg-[#f4ece3] hover:bg-[#eae1d6] rounded-md transition-colors"
              >
                Today
              </button>
              <button
                onClick={prevMonth}
                aria-label="Previous Month"
                className="p-1.5 text-[#6e635b] hover:text-[#2c2420] hover:bg-[#f4ece3] rounded-md transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                aria-label="Next Month"
                className="p-1.5 text-[#6e635b] hover:text-[#2c2420] hover:bg-[#f4ece3] rounded-md transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wider text-[#8c827a] py-1">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Previous Month trailing days */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => {
              const prevDayNum = daysInPrevMonth - firstDayOfWeek + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="min-h-[52px] sm:min-h-[85px] p-1.5 rounded-lg text-xs text-[#b8afa6] bg-[#faf8f5]/50 border border-transparent select-none opacity-40"
                >
                  <span>{prevDayNum}</span>
                </div>
              );
            })}

            {/* Current Month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const formattedDay = String(dayNum).padStart(2, '0');
              const formattedMonth = String(month + 1).padStart(2, '0');
              const dayStr = `${year}-${formattedMonth}-${formattedDay}`;

              const isSelected = selectedDateStr === dayStr;
              const isToday = todayStr === dayStr;
              const isMonthlyAnniversaryDay = dayNum === 6; // Jan 6th recurring monthly mark!

              const dayEvents = eventsByDate.get(dayStr) || [];

              return (
                <div
                  key={`curr-${dayNum}`}
                  onClick={() => setSelectedDateStr(dayStr)}
                  className={`min-h-[52px] sm:min-h-[85px] p-1 sm:p-2 rounded-xl text-xs transition-all cursor-pointer flex flex-col justify-between border ${
                    isSelected
                      ? 'border-[#c85a54] bg-[#fdf8f7] ring-1 ring-[#c85a54]'
                      : isToday
                      ? 'border-[#d97706]/40 bg-[#fffbf2]'
                      : 'border-[#ede7de] hover:border-[#ded5c7] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-semibold tabular-nums text-xs sm:text-sm ${
                        isSelected
                          ? 'text-[#c85a54] font-bold'
                          : isToday
                          ? 'text-[#d97706] font-bold'
                          : 'text-[#2c2420]'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {/* Monthly love day mark on the 6th */}
                    {isMonthlyAnniversaryDay && (
                      <span title="Monthly Love Day (The 6th)">
                        <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#c85a54] text-[#c85a54]" />
                      </span>
                    )}
                  </div>

                  {/* Mobile Dot Indicators (Clean, no text truncation clutter on phones) */}
                  <div className="flex sm:hidden items-center justify-center gap-1 mt-1 flex-wrap">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <span
                        key={ev.id}
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: ev.color || '#c85a54' }}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="w-1 h-1 rounded-full bg-[#8c827a]" />
                    )}
                  </div>

                  {/* Desktop Title Badges */}
                  <div className="hidden sm:block space-y-1 mt-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        title={ev.title}
                        className="truncate text-[10px] font-medium px-1 py-0.5 rounded text-white"
                        style={{ backgroundColor: ev.color || '#c85a54' }}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] font-bold text-[#8c827a] text-right">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Inspector & Upcoming List (Right Column) */}
        <div className="space-y-6">
          {/* Selected Date Details Panel */}
          <div className="bg-white border border-[#e8e2d8] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eae1]">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8c827a]">
                  Selected Day
                </span>
                <h4 className="font-serif text-lg font-bold text-[#2c2420]">
                  {formatDatePretty(selectedDateStr)}
                </h4>
              </div>

              <button
                onClick={() => openAddModal(selectedDateStr)}
                className="p-1.5 text-white bg-[#c85a54] hover:bg-[#b34842] rounded-md transition-colors text-xs flex items-center gap-1 px-2.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Plan</span>
              </button>
            </div>

            {selectedDayEvents.length === 0 ? (
              <div className="py-6 text-center space-y-2">
                <p className="text-xs text-[#8c827a]">
                  No events planned for this day yet.
                </p>
                <button
                  onClick={() => openAddModal(selectedDateStr)}
                  className="text-xs text-[#c85a54] hover:underline font-medium cursor-pointer"
                >
                  Schedule a date night or surprise
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDayEvents.map((ev) => {
                  const creatorName =
                    ev.createdBy === 'partner1' ? profile.name1 : profile.name2;

                  return (
                    <div
                      key={ev.id}
                      className="p-3 rounded-xl border border-[#ede7de] bg-[#faf8f5] space-y-2 relative group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: ev.color || '#c85a54' }}
                            />
                            <h5 className="text-sm font-semibold text-[#2c2420]">
                              {ev.title}
                            </h5>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-[#6e635b] pt-0.5">
                            {ev.time && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#c85a54]" />
                                {ev.time}
                              </span>
                            )}
                            {ev.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#c85a54]" />
                                {ev.location}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Edit & Delete actions */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                          <button
                            onClick={() => openEditModal(ev)}
                            className="p-1 text-[#6e635b] hover:text-[#2c2420] rounded"
                            title="Edit plan"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this event?')) {
                                onDeleteEvent(ev.id);
                              }
                            }}
                            className="p-1 text-red-500 hover:text-red-700 rounded"
                            title="Delete plan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {ev.notes && (
                        <p className="text-xs text-[#6e635b] italic bg-white/70 p-2 rounded-lg border border-[#ede7de]/60">
                          "{ev.notes}"
                        </p>
                      )}

                      <div className="text-[11px] text-[#8c827a] pt-1">
                        Added by: <span className="font-medium text-[#2c2420]">{creatorName}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming Shared Plans List */}
          <div className="bg-white border border-[#e8e2d8] rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="font-serif text-base font-bold text-[#2c2420] flex items-center justify-between">
              <span>Upcoming Dates & Trips</span>
              <span className="text-xs font-normal text-[#8c827a]">Next 5</span>
            </h4>

            <div className="divide-y divide-[#f2ece4]">
              {upcomingEvents.length === 0 ? (
                <p className="text-xs text-[#8c827a] py-3">No upcoming plans scheduled.</p>
              ) : (
                upcomingEvents.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => {
                      setSelectedDateStr(ev.date);
                      setCurrentDate(new Date(ev.date + 'T00:00:00'));
                    }}
                    className="py-2.5 flex items-center justify-between gap-3 cursor-pointer group hover:bg-[#faf8f5] px-1 rounded transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-[#2c2420] group-hover:text-[#c85a54] transition-colors">
                        {ev.title}
                      </div>
                      <div className="text-[11px] text-[#8c827a] flex items-center gap-1.5">
                        <span>{formatDatePretty(ev.date)}</span>
                        {ev.time && <span>· {ev.time}</span>}
                      </div>
                    </div>

                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: ev.color || '#c85a54' }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e8e2d8] space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eae1]">
              <h3 className="font-serif text-xl font-bold text-[#2c2420]">
                {editingEvent ? 'Edit Shared Plan' : 'Schedule a Shared Plan'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#8c827a] hover:text-[#2c2420] rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Event Title */}
              <div>
                <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                  Plan / Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunset Dinner, Weekend Getaway, Movie Night"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                    Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                  Location / Venue
                </label>
                <input
                  type="text"
                  placeholder="e.g., La Trattoria, The Coastline, Our Couch"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
                />
              </div>

              {/* Category & Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CalendarEvent['category'])}
                    className="w-full px-3.5 py-2 text-sm border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
                  >
                    <option value="date">Date Night</option>
                    <option value="trip">Trip / Vacation</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="milestone">Milestone</option>
                    <option value="surprise">Surprise</option>
                    <option value="movie">Movie / Concert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                    Theme Color
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {[
                      { code: '#e11d48', name: 'Rose' },
                      { code: '#d97706', name: 'Amber' },
                      { code: '#059669', name: 'Emerald' },
                      { code: '#2563eb', name: 'Blue' },
                      { code: '#8b5cf6', name: 'Violet' },
                    ].map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => setColor(c.code)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform ${
                          color === c.code ? 'scale-125 border-[#2c2420]' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c.code }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                  Notes & Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Dress code, reservation confirmation, things to pack..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
                />
              </div>

              {/* Created By */}
              <div>
                <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                  Added By
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-[#2c2420] cursor-pointer">
                    <input
                      type="radio"
                      name="createdBy"
                      checked={createdBy === 'partner1'}
                      onChange={() => setCreatedBy('partner1')}
                      className="text-[#c85a54]"
                    />
                    <span>{profile.name1}</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#2c2420] cursor-pointer">
                    <input
                      type="radio"
                      name="createdBy"
                      checked={createdBy === 'partner2'}
                      onChange={() => setCreatedBy('partner2')}
                      className="text-[#c85a54]"
                    />
                    <span>{profile.name2}</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
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
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  {editingEvent ? 'Save Changes' : 'Add to Calendar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
