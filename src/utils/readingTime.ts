/**
 * Calculates estimated reading time for article body
 * @param content - Plain text or markdown content
 * @param wordsPerMinute - Average reading speed (default 200 wpm)
 * @returns Human-friendly reading time string (e.g., "5 min read")
 */
export function calculateReadingTime(content: string, wordsPerMinute = 200): string {
  if (!content) return '1 min read';
  // Strip code blocks and markdown symbols for closer word count approximation
  const cleanText = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#*`_~>[\]()]/g, ' ')
    .trim();

  const words = cleanText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}
