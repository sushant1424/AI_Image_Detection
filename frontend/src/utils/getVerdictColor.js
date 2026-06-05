// ========================================
// Verdict Color Utility
// ========================================

import { VERDICT_TYPES, VERDICT_COLORS } from 'src/constants';

/**
 * Returns the color config for a given verdict type
 * @param {string} verdict - VERDICT_TYPES value
 * @returns {object} Color config { bg, text, border, dot }
 */
export const getVerdictColor = (verdict) => {
  return VERDICT_COLORS[verdict] || VERDICT_COLORS[VERDICT_TYPES.REAL];
};
