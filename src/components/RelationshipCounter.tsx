import React, { useState, useEffect } from 'react';
import { PartnerProfile } from '../types';
import { calculateRelationshipTime, getRelationshipMilestones, formatDatePretty } from '../lib/dateUtils';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Calendar, Clock, Trophy, ChevronRight } from 'lucide-react';

interface RelationshipCounterProps {
  profile: PartnerProfile;
  onEditDate?: () => void;
}

export const RelationshipCounter: React.FC<RelationshipCounterProps> = ({ profile, onEditDate }) => {
  const [duration, setDuration] = useState(() => calculateRelationshipTime(profile.relationshipStartDate));
  const [activeSubTab, setActiveSubTab] = useState<'ticker' | 'milestones'>('ticker');

  useEffect(() => {
    // Tick every 1 second
    const interval = setInterval(() => {
      setDuration(calculateRelationshipTime(profile.relationshipStartDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [profile.relationshipStartDate]);

  const { pastMilestones, nextMilestone, allMilestones } = getRelationshipMilestones(
    profile.relationshipStartDate
  );

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#c85a54', '#e28b85', '#ffd166', '#f4a261', '#e76f51'],
    });
  };

  // Calculate progress toward next milestone
  let progressPercent = 100;
  if (nextMilestone) {
    const prevMilestoneDays = pastMilestones.length > 0 ? pastMilestones[pastMilestones.length - 1].days : 0;
    const totalSpan = nextMilestone.days - prevMilestoneDays;
    const currentProgress = duration.totalDays - prevMilestoneDays;
    progressPercent = Math.min(100, Math.max(0, Math.round((currentProgress / totalSpan) * 100)));
  }

  // Estimated heartbeats shared (~72 beats per minute)
  const estimatedHeartbeats = (duration.totalMinutes * 72).toLocaleString();

  return (
    <div className="space-y-8">
      {/* Hero Love Statement */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4ece3] text-[#8c4642] text-xs font-medium tracking-wide">
          <Heart className="w-3.5 h-3.5 fill-[#c85a54] text-[#c85a54] animate-pulse" />
          <span>Every Second Since January 6th, 2026</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2c2420] tracking-tight text-balance">
          {profile.name1} & {profile.name2}
        </h1>

        <p className="text-sm sm:text-base text-[#6e635b] italic max-w-xl mx-auto">
          "{profile.anniversaryNote || 'Two lives, one shared story, growing more beautiful every day.'}"
        </p>

        {/* Start date anchor metadata */}
        <div className="flex items-center justify-center gap-3 text-xs text-[#8c827a] pt-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#c85a54]" />
            Official Start: {formatDatePretty(profile.relationshipStartDate)}
          </span>
          <span aria-hidden="true">·</span>
          <button
            onClick={onEditDate}
            className="text-[#c85a54] hover:underline cursor-pointer"
          >
            Edit Date
          </button>
        </div>
      </div>

      {/* Main Digital Clockwork Grid: 3 cols on mobile (2 rows of 3), 6 on desktop */}
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 max-w-5xl mx-auto">
        {/* Years */}
        <div className="bg-white border border-[#e8e2d8] rounded-xl p-2.5 sm:p-5 text-center shadow-xs hover:border-[#c85a54]/40 transition-colors">
          <div className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#2c2420] tabular-nums tracking-tight">
            {duration.years}
          </div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-[#8c827a] mt-1">
            {duration.years === 1 ? 'Year' : 'Years'}
          </div>
        </div>

        {/* Months */}
        <div className="bg-white border border-[#e8e2d8] rounded-xl p-2.5 sm:p-5 text-center shadow-xs hover:border-[#c85a54]/40 transition-colors">
          <div className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#2c2420] tabular-nums tracking-tight">
            {duration.months}
          </div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-[#8c827a] mt-1">
            {duration.months === 1 ? 'Month' : 'Months'}
          </div>
        </div>

        {/* Days */}
        <div className="bg-white border border-[#e8e2d8] rounded-xl p-2.5 sm:p-5 text-center shadow-xs hover:border-[#c85a54]/40 transition-colors">
          <div className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#2c2420] tabular-nums tracking-tight">
            {duration.days}
          </div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-[#8c827a] mt-1">
            {duration.days === 1 ? 'Day' : 'Days'}
          </div>
        </div>

        {/* Hours */}
        <div className="bg-white border border-[#e8e2d8] rounded-xl p-2.5 sm:p-5 text-center shadow-xs hover:border-[#c85a54]/40 transition-colors">
          <div className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#2c2420] tabular-nums tracking-tight">
            {String(duration.hours).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-[#8c827a] mt-1">
            Hours
          </div>
        </div>

        {/* Minutes */}
        <div className="bg-white border border-[#e8e2d8] rounded-xl p-2.5 sm:p-5 text-center shadow-xs hover:border-[#c85a54]/40 transition-colors">
          <div className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#2c2420] tabular-nums tracking-tight">
            {String(duration.minutes).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-[#8c827a] mt-1">
            Minutes
          </div>
        </div>

        {/* Seconds */}
        <div className="bg-white border border-[#e8e2d8] rounded-xl p-2.5 sm:p-5 text-center shadow-xs border-[#c85a54]/30 bg-[#fdfaf8]">
          <div className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#c85a54] tabular-nums tracking-tight">
            {String(duration.seconds).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-[#c85a54] mt-1">
            Seconds
          </div>
        </div>
      </div>

      {/* Aggregate Metrics Bar (Anti-Slop: clean tabular row, no fake scoreboards) */}
      <div className="max-w-4xl mx-auto bg-[#faf6f0] border border-[#e7e1d5] rounded-xl p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-xs text-[#8c827a] font-medium">Total Days Together</div>
          <div className="font-serif text-xl sm:text-2xl font-bold text-[#2c2420] tabular-nums mt-0.5">
            {duration.totalDays.toLocaleString()} Days
          </div>
        </div>
        <div>
          <div className="text-xs text-[#8c827a] font-medium">Total Hours Shared</div>
          <div className="font-serif text-xl sm:text-2xl font-bold text-[#2c2420] tabular-nums mt-0.5">
            {duration.totalHours.toLocaleString()}h
          </div>
        </div>
        <div>
          <div className="text-xs text-[#8c827a] font-medium">Minutes of Memories</div>
          <div className="font-serif text-xl sm:text-2xl font-bold text-[#2c2420] tabular-nums mt-0.5">
            {duration.totalMinutes.toLocaleString()}m
          </div>
        </div>
        <div>
          <div className="text-xs text-[#8c827a] font-medium">Estimated Heartbeats</div>
          <div className="font-serif text-xl sm:text-2xl font-bold text-[#c85a54] tabular-nums mt-0.5 flex items-center justify-center gap-1">
            <Heart className="w-4 h-4 fill-[#c85a54]" />
            <span>~{estimatedHeartbeats}</span>
          </div>
        </div>
      </div>

      {/* Next Upcoming Milestone Card */}
      {nextMilestone && (
        <div className="max-w-3xl mx-auto bg-white border border-[#e8e2d8] rounded-xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c85a54]">
                <Trophy className="w-4 h-4" />
                <span>Next Milestone on Horizon</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2c2420]">
                {nextMilestone.title} ({nextMilestone.days} Days)
              </h2>
              <p className="text-xs sm:text-sm text-[#6e635b]">
                {nextMilestone.daysLeft === 0
                  ? 'Today is the day! Celebrate together!'
                  : nextMilestone.daysLeft === 1
                  ? 'Tomorrow is the big day!'
                  : `Just ${nextMilestone.daysLeft} days until this special mark · ${formatDatePretty(
                      nextMilestone.targetDate.toISOString()
                    )}`}
              </p>
            </div>

            <button
              onClick={triggerCelebration}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer self-start sm:self-center"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Celebrate Love</span>
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs text-[#8c827a] font-medium">
              <span>Current: Day {duration.totalDays}</span>
              <span>{progressPercent}% towards milestone</span>
            </div>
            <div className="w-full bg-[#f1ebe4] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#d97706] to-[#c85a54] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sub-view toggle: Ticker info vs Milestone timeline */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="inline-flex p-1 bg-[#efeae3] rounded-lg">
            <button
              onClick={() => setActiveSubTab('ticker')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'ticker'
                  ? 'bg-white text-[#2c2420] shadow-xs'
                  : 'text-[#6e635b] hover:text-[#2c2420]'
              }`}
            >
              Our Love Story
            </button>
            <button
              onClick={() => setActiveSubTab('milestones')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'milestones'
                  ? 'bg-white text-[#2c2420] shadow-xs'
                  : 'text-[#6e635b] hover:text-[#2c2420]'
              }`}
            >
              Milestone Roadmap ({pastMilestones.length} Reached)
            </button>
          </div>
        </div>

        {activeSubTab === 'milestones' ? (
          <div className="bg-white border border-[#e8e2d8] rounded-xl p-6 divide-y divide-[#f2ece4]">
            <h3 className="font-serif text-lg font-bold text-[#2c2420] mb-4">
              Our Journey of Milestones
            </h3>
            <div className="space-y-4 pt-2">
              {allMilestones.map((m) => (
                <div
                  key={m.days}
                  className="flex items-center justify-between py-3 gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        m.isPast
                          ? 'bg-[#e7f4ed] text-[#1b7a4b] border border-[#a8dfc2]'
                          : 'bg-[#f4ece3] text-[#8c827a]'
                      }`}
                    >
                      {m.isPast ? '✓' : '•'}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#2c2420]">
                        {m.title}
                      </div>
                      <div className="text-xs text-[#8c827a]">
                        Target Date: {formatDatePretty(m.targetDate.toISOString())} · {m.days} Days
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {m.isPast ? (
                      <span className="text-xs font-medium text-[#1b7a4b] bg-[#e7f4ed] px-2.5 py-1 rounded-md">
                        Celebrated
                      </span>
                    ) : (
                      <span className="text-xs text-[#6e635b] font-medium">
                        in {m.daysLeft} days
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-[#e8e2d8] rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#c85a54] uppercase tracking-wide">
                <Clock className="w-3.5 h-3.5" />
                <span>What Time Feels Like With You</span>
              </div>
              <h4 className="font-serif text-base font-bold text-[#2c2420]">
                Every single day is a gift
              </h4>
              <p className="text-xs sm:text-sm text-[#6e635b] leading-relaxed">
                Whether we are cooking dinner together, driving with windows down, laughing until we cry,
                or holding hands on quiet evenings, this timer isn't just ticking seconds—it's counting moments
                where two souls chose each other.
              </p>
            </div>

            <div className="bg-white border border-[#e8e2d8] rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#d97706] uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Sacred Date</span>
              </div>
              <h4 className="font-serif text-base font-bold text-[#2c2420]">
                January 6th, 2026
              </h4>
              <p className="text-xs sm:text-sm text-[#6e635b] leading-relaxed">
                The anchor day of our relationship. Every year on this date, we celebrate the beginning of the
                best chapter of our lives.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
