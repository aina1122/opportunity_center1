import { format, parseISO } from 'date-fns';

// Format date
export function formatDate(date, formatString = 'MMMM dd, yyyy') {
  if (!date) return '';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
    return format(parsedDate, formatString);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
}

// Truncate text
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return truncated.substring(0, lastSpace) + '...';
}

// Extract excerpt from HTML content
export function extractExcerpt(htmlContent, maxLength = 150) {
  // Remove HTML tags
  const plainText = htmlContent.replace(/<[^>]*>/g, '');
  return truncateText(plainText, maxLength);
}

// Generate reading time estimate
export function calculateReadingTime(content) {
  // Remove HTML tags
  const plainText = content.replace(/<[^>]*>/g, '');
  
  // Average reading speed: 200-250 words per minute
  const wordsPerMinute = 225;
  const wordCount = plainText.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  return readingTime;
}

// Parse JSON safely
export function safeJsonParse(jsonString, fallback = {}) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parsing error:', error);
    return fallback;
  }
}

// Get page title with site name
export function getPageTitle(title, siteName = 'OpportunityCenter') {
  return title ? `${title} | ${siteName}` : siteName;
}

// Pagination helper
export function getPaginationData(currentPage, totalItems, itemsPerPage = 10) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const page = Math.max(1, Math.min(currentPage, totalPages));
  
  return {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
    offset: (page - 1) * itemsPerPage
  };
}

export default {
  formatDate,
  truncateText,
  extractExcerpt,
  calculateReadingTime,
  safeJsonParse,
  getPageTitle,
  getPaginationData
};