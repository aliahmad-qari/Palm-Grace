/** Memorial and service dates are calendar days, not moments in the visitor's timezone. */
export function calendarDateParts(value?: string | null): { year: number; month: number; day: number } | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return { year, month, day };
}

export function formatCalendarDate(value?: string | null, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }): string {
  const parts = calendarDateParts(value);
  if (!parts) return value || '';
  return new Intl.DateTimeFormat('en-GB', { ...options, timeZone: 'UTC' }).format(new Date(Date.UTC(parts.year, parts.month - 1, parts.day)));
}

export function calendarYear(value?: string | null): string {
  const parts = calendarDateParts(value);
  return parts ? String(parts.year) : '';
}

export function formatServiceTime(value?: string | null): string {
  if (!value) return '';
  const match = /^(\d{1,2}):(\d{2})(?:\s*([ap])\.?m\.?)?$/i.exec(value.trim());
  if (!match) return value;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (minutes > 59 || hours > (match[3] ? 12 : 23)) return value;
  const period = match[3]?.toLowerCase() || (hours < 12 ? 'a' : 'p');
  const displayHour = match[3] ? hours : hours % 12 || 12;
  return `${displayHour}:${match[2]} ${period}.m.`;
}

export function isPastCalendarDate(value?: string | null): boolean {
  const parts = calendarDateParts(value);
  if (!parts) return false;
  const today = new Date().toISOString().slice(0, 10);
  return `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}` < today;
}
