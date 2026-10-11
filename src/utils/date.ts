/**
 * Utility functions for date manipulation and formatting
 */

/**
 * Format a Date object or ISO string into a human-readable string (e.g., "Oct 11, 2026")
 * @param date - Date instance, string, or number
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Extract 4-digit year from date
 */
export function getYear(date: Date | string | number): number {
  return new Date(date).getFullYear();
}

/**
 * Extract full month name (e.g., "October")
 */
export function getMonthName(date: Date | string | number): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'long' });
}

/**
 * Format date for HTML time tag attribute datetime="YYYY-MM-DD"
 */
export function formatIsoDate(date: Date | string | number): string {
  return new Date(date).toISOString().split('T')[0];
}
