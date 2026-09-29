/**
 * Utilities for formatting, parsing, and calculating maintenance cycle dates
 * for Continuous Casting industrial machinery (SMS Concast / SN Seixal).
 */

const PORTUGUESE_MONTHS: Record<string, string> = {
  jan: '01',
  fev: '02',
  mar: '03',
  abr: '04',
  mai: '05',
  jun: '06',
  jul: '07',
  ago: '08',
  set: '09',
  out: '10',
  nov: '11',
  dez: '12'
};

const MONTH_NAMES_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

/**
 * Converts any date representation (ISO, YYYY-MM-DD, DD/MM/YYYY, DD/Mes/YYYY)
 * to HTML5 date input format: 'YYYY-MM-DD'.
 */
export function toInputDateFormat(dateStr?: string): string {
  if (!dateStr || typeof dateStr !== 'string') {
    return new Date().toISOString().split('T')[0];
  }

  const clean = dateStr.trim();

  // Already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    return clean;
  }

  // DD/MM/YYYY format
  const ddmmyyyy = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddmmyyyy) {
    const day = ddmmyyyy[1].padStart(2, '0');
    const month = ddmmyyyy[2].padStart(2, '0');
    const year = ddmmyyyy[3];
    return `${year}-${month}-${day}`;
  }

  // DD/Mon/YYYY or DD/Mon/YY (e.g. 28/Mai/2026, 15/Out/24)
  const parts = clean.split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const monStr = parts[1].toLowerCase().slice(0, 3);
    const month = PORTUGUESE_MONTHS[monStr] || '01';
    let year = parts[2];
    if (year.length === 2) year = '20' + year;
    if (year.length === 4) return `${year}-${month}-${day}`;
  }

  // Fallback to Date parser
  const parsed = new Date(clean);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  return new Date().toISOString().split('T')[0];
}

/**
 * Formats a date string (YYYY-MM-DD or other) to standard Portuguese 'DD/MM/YYYY'.
 */
export function formatDateToPt(isoOrDateStr?: string): string {
  if (!isoOrDateStr || typeof isoOrDateStr !== 'string') {
    const now = new Date();
    return `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
  }

  const clean = isoOrDateStr.trim();

  // Already DD/MM/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(clean)) {
    const [d, m, y] = clean.split('/');
    return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
  }

  // YYYY-MM-DD format
  const yyyymmdd = clean.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (yyyymmdd) {
    return `${yyyymmdd[3]}/${yyyymmdd[2]}/${yyyymmdd[1]}`;
  }

  // Fallback
  const d = new Date(clean);
  if (!isNaN(d.getTime())) {
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  return clean;
}

/**
 * Formats a date string to readable Portuguese month format: 'DD/Mes/AAAA' (e.g. 28/Mai/2026).
 */
export function formatDateReadable(dateStr?: string): string {
  if (!dateStr) return '';
  const iso = toInputDateFormat(dateStr);
  const parts = iso.split('-');
  if (parts.length === 3) {
    const day = parts[2];
    const monthIdx = parseInt(parts[1], 10) - 1;
    const year = parts[0];
    const monthName = MONTH_NAMES_PT[monthIdx] || parts[1];
    return `${day}/${monthName}/${year}`;
  }
  return dateStr;
}

/**
 * Given a base date (such as last intervention date) and frequency in days,
 * calculates the next expected intervention date and remaining days relative to today.
 */
export function calculateNextCycle(baseDateStr: string, frequencyDays: number): {
  dueDate: string;
  daysRemaining: number;
} {
  const isoBase = toInputDateFormat(baseDateStr);
  const [year, month, day] = isoBase.split('-').map(Number);
  
  // Create base date in local time
  const baseDate = new Date(year, month - 1, day);
  
  // Add frequency in days
  const nextDate = new Date(baseDate);
  nextDate.setDate(baseDate.getDate() + frequencyDays);

  const formattedDueDate = `${nextDate.getDate().toString().padStart(2, '0')}/${(nextDate.getMonth() + 1).toString().padStart(2, '0')}/${nextDate.getFullYear()}`;

  // Today normalized to midnight for accurate day difference
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const nextMidnight = new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate());

  const diffMs = nextMidnight.getTime() - todayMidnight.getTime();
  const daysRemaining = Math.round(diffMs / (1000 * 60 * 60 * 24));

  return {
    dueDate: formattedDueDate,
    daysRemaining
  };
}
