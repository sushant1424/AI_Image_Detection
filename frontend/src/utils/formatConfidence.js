// ========================================
// Confidence Score Formatting Utility
// ========================================

/**
 * Formats a confidence score (0-1) to a percentage string
 * @param {number} score - Confidence score between 0 and 1
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatConfidence = (score, decimals = 1) => {
  return `${(score * 100).toFixed(decimals)}%`;
};

/**
 * Returns a text label for the confidence level
 * @param {number} score - Confidence score between 0 and 1
 * @returns {string} Confidence level label
 */
export const getConfidenceLevel = (score) => {
  const pct = score * 100;
  if (pct >= 90) return 'Very High';
  if (pct >= 75) return 'High';
  if (pct >= 60) return 'Moderate';
  if (pct >= 40) return 'Low';
  return 'Very Low';
};
