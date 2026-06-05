// ========================================
// Verdict Type Constants
// ========================================

export const VERDICT_TYPES = {
  AI_GENERATED: 'AI_GENERATED',
  REAL: 'REAL',
};

export const VERDICT_LABELS = {
  [VERDICT_TYPES.AI_GENERATED]: 'AI Generated',
  [VERDICT_TYPES.REAL]: 'Real Image',
};

export const VERDICT_COLORS = {
  [VERDICT_TYPES.AI_GENERATED]: {
    bg: 'bg-danger/10',
    text: 'text-danger',
    border: 'border-danger/30',
    dot: 'bg-danger',
  },
  [VERDICT_TYPES.REAL]: {
    bg: 'bg-success/10',
    text: 'text-success',
    border: 'border-success/30',
    dot: 'bg-success',
  },
};

export const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const HISTORY_PAGE_SIZE = 10;
