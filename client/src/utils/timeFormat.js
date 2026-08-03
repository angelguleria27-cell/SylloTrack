/**
 * Utility functions for formatting timetable and schedule times
 * in 12-hour (default) and 24-hour formats.
 */

/**
 * Formats a single time string (e.g. "09:00", "14:30", "13:00", "2:00 PM")
 * into either 12-hour format (e.g. "9:00 AM", "2:30 PM") or 24-hour format (e.g. "09:00", "14:30").
 * 
 * @param {string} timeStr - Time string to format
 * @param {boolean} is12Hour - If true, formats as 12-hour (default). If false, formats as 24-hour.
 * @returns {string} Formatted time string
 */
export const formatSingleTime = (timeStr, is12Hour = true) => {
  if (!timeStr || typeof timeStr !== 'string') return '';
  const trimmed = timeStr.trim();
  if (!trimmed) return '';

  // Check if string already contains AM/PM
  const ampmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);
  let hours, minutes;

  if (ampmMatch) {
    hours = parseInt(ampmMatch[1], 10);
    minutes = ampmMatch[2];
    const period = ampmMatch[3].toUpperCase();
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
  } else {
    const match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return trimmed; // Return original string if not in HH:MM format
    hours = parseInt(match[1], 10);
    minutes = match[2];
  }

  if (is12Hour) {
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHours}:${minutes} ${period}`;
  } else {
    const displayHours = hours.toString().padStart(2, '0');
    return `${displayHours}:${minutes}`;
  }
};

/**
 * Formats a start and end time into a formatted time range (e.g. "9:00 AM - 10:00 AM" or "09:00 - 10:00").
 * 
 * @param {string} startTime - Start time string
 * @param {string} endTime - End time string
 * @param {boolean} is12Hour - If true, formats as 12-hour. If false, formats as 24-hour.
 * @returns {string} Formatted time range string
 */
export const formatTimeRange = (startTime, endTime, is12Hour = true) => {
  if (!startTime && !endTime) return '';
  if (!endTime) return formatSingleTime(startTime, is12Hour);
  if (!startTime) return formatSingleTime(endTime, is12Hour);
  return `${formatSingleTime(startTime, is12Hour)} - ${formatSingleTime(endTime, is12Hour)}`;
};

/**
 * Helper to format a time string or range.
 */
export const formatTime = (timeStr, is12Hour = true) => {
  if (!timeStr) return '';
  if (typeof timeStr === 'string' && timeStr.includes('-') && !timeStr.includes('AM') && !timeStr.includes('PM')) {
    const parts = timeStr.split('-').map((p) => p.trim());
    if (parts.length === 2) {
      return formatTimeRange(parts[0], parts[1], is12Hour);
    }
  }
  return formatSingleTime(timeStr, is12Hour);
};
