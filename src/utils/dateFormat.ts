export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timeZone: 'America/New_York'
  };

  const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);
  const month = parts.find(p => p.type === 'month')?.value || '';
  const day = parts.find(p => p.type === 'day')?.value || '';
  const weekday = parts.find(p => p.type === 'weekday')?.value || '';

  const dayNum = parseInt(day);
  const suffix = getDaySuffix(dayNum);

  // Format: "March 13th (Friday)"
  return `${month} ${day}${suffix} (${weekday})`;
}

export function formatTimeRange(start: Date, end: Date): string {
  const formatTime = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York'
    };
    return date.toLocaleTimeString('en-US', options);
  };

  return `${formatTime(start)} - ${formatTime(end)}`;
}

function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}
