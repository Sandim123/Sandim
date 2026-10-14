import { TimeDuration, Milestone } from '../types';

/**
 * Calculates accurate duration between start date and current time
 */
export function calculateRelationshipTime(startDateStr: string, now: Date = new Date()): TimeDuration {
  const start = new Date(startDateStr);
  let diffMs = now.getTime() - start.getTime();

  if (diffMs < 0) {
    // If future date, prevent negative values
    diffMs = 0;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  // Exact calendar difference calculation (years, months, days)
  let y1 = start.getFullYear();
  let m1 = start.getMonth();
  let d1 = start.getDate();

  let y2 = now.getFullYear();
  let m2 = now.getMonth();
  let d2 = now.getDate();

  let years = y2 - y1;
  let months = m2 - m1;
  let days = d2 - d1;

  if (days < 0) {
    months -= 1;
    // get days in previous month
    const prevMonthLastDay = new Date(y2, m2, 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const hours = now.getHours() - start.getHours();
  const minutes = now.getMinutes() - start.getMinutes();
  const seconds = now.getSeconds() - start.getSeconds();

  let finalHours = hours;
  let finalMinutes = minutes;
  let finalSeconds = seconds;

  if (finalSeconds < 0) {
    finalMinutes -= 1;
    finalSeconds += 60;
  }

  if (finalMinutes < 0) {
    finalHours -= 1;
    finalMinutes += 60;
  }

  if (finalHours < 0) {
    finalHours += 24;
    // days already accounted for in calendar date comparison
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    hours: Math.max(0, finalHours),
    minutes: Math.max(0, finalMinutes),
    seconds: Math.max(0, finalSeconds),
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
  };
}

/**
 * Milestones from start date
 */
export function getRelationshipMilestones(startDateStr: string, now: Date = new Date()): {
  pastMilestones: Milestone[];
  nextMilestone: Milestone | null;
  allMilestones: Milestone[];
} {
  const start = new Date(startDateStr);
  const milestoneDays = [
    { days: 30, title: 'First Month Anniversary' },
    { days: 50, title: '50 Days of Falling in Love' },
    { days: 100, title: '100 Days Together' },
    { days: 182, title: 'Half-Year Milestone (6 Months)' },
    { days: 200, title: '200 Days of Shared Smiles' },
    { days: 250, title: 'Quarter-Thousand Days' },
    { days: 300, title: '300 Days of Adventure' },
    { days: 365, title: '1 Year Anniversary!' },
    { days: 500, title: '500 Days of Forever' },
    { days: 730, title: '2 Years Anniversary' },
    { days: 1000, title: '1,000 Days Milestone' },
  ];

  const milestones: Milestone[] = milestoneDays.map((m) => {
    const targetDate = new Date(start.getTime() + m.days * 24 * 60 * 60 * 1000);
    const diffDays = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isPast = targetDate.getTime() <= now.getTime();
    return {
      days: m.days,
      title: m.title,
      targetDate,
      isPast,
      daysLeft: Math.max(0, diffDays),
    };
  });

  const pastMilestones = milestones.filter((m) => m.isPast);
  const futureMilestones = milestones.filter((m) => !m.isPast);
  const nextMilestone = futureMilestones.length > 0 ? futureMilestones[0] : null;

  return {
    pastMilestones,
    nextMilestone,
    allMilestones: milestones,
  };
}

export function formatDatePretty(dateStr: string): string {
  try {
    const d = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatDateTimePretty(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
