/**
 * Utility functions for local date parsing, formatting, and string keys (YYYY-MM-DD)
 * to prevent timezone offset shifts between client local time (e.g. Asia/Kolkata UTC+5:30) and UTC.
 */

/**
 * Returns current local date formatted as YYYY-MM-DD.
 */
export const getTodayStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats local year, 0-indexed month (0-11), and day (1-31) into YYYY-MM-DD.
 */
export const formatLocalDate = (year, month, day) => {
  const yStr = year;
  const mStr = String(month + 1).padStart(2, '0');
  const dStr = String(day).padStart(2, '0');
  return `${yStr}-${mStr}-${dStr}`;
};

/**
 * Extracts local YYYY-MM-DD date string from date input (ISO string, Date object, or date string).
 */
export const getEventDateStr = (dateInput) => {
  if (!dateInput) return '';
  if (typeof dateInput === 'string') {
    if (dateInput.includes('T')) {
      const d = new Date(dateInput);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
    return dateInput.substring(0, 10);
  }
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * Formats a date value into human readable local date text (e.g. "Aug 26, 2026").
 */
export const formatEventDisplayDate = (dateVal, options = { month: 'short', day: 'numeric' }) => {
  const dateStr = getEventDateStr(dateVal);
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const localDate = new Date(y, m - 1, d);
  return localDate.toLocaleDateString('en-US', options);
};
