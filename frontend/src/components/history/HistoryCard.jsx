import React from 'react';
import { VERDICT_TYPES } from 'src/constants';
import { formatDate, formatConfidence } from 'src/utils';
import Card from '../common/Card';
import Badge from '../common/Badge';

export const HistoryCard = ({ item, onView, onDelete }) => {
  const isAI = item.verdict === VERDICT_TYPES.AI_GENERATED;
  const badgeVariant = isAI ? 'danger' : 'success';
  const verdictLabel = isAI ? 'AI Generated' : 'Likely Real';

  // Construct correct upload serving URLs
  const getFullUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${window.location.origin}${path}`;
  };

  const originalUrl = getFullUrl(item.original_image_url);

  return (
    <Card hoverEffect className="flex flex-col gap-4 overflow-hidden p-4">
      {/* Image thumbnail wrapper */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border bg-background">
        <img
          src={originalUrl}
          alt="Original Scan"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2.5 left-2.5">
          <Badge variant={badgeVariant}>{verdictLabel}</Badge>
        </div>
      </div>

      {/* Info & Metrics */}
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-text-secondary font-medium">
            {formatDate(item.created_at)}
          </span>
          <span className="text-xs font-extrabold text-primary">
            {formatConfidence(item.confidence_score)} Match
          </span>
        </div>
      </div>

      {/* Action triggers */}
      <div className="flex items-center gap-2 pt-2 border-t border-border mt-auto">
        <button
          onClick={() => onView(item)}
          className="flex-1 py-2 text-xs font-bold bg-surface-light hover:bg-surface border border-border text-text rounded-xl transition-all"
        >
          View Details
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-text-secondary hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 rounded-xl transition-all"
          aria-label="Delete history item"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </Card>
  );
};

export default HistoryCard;
