import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VERDICT_TYPES } from 'src/constants';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import ConfidenceMeter from './ConfidenceMeter';

export const ResultCard = ({ result }) => {
  if (!result) return null;

  const [copied, setCopied] = useState(false);
  const isAI = result.verdict === VERDICT_TYPES.AI_GENERATED;
  const verdictLabel = isAI ? 'AI Generated' : 'Likely Real';
  const badgeVariant = isAI ? 'danger' : 'success';
  const borderColor = isAI ? 'border-danger/30' : 'border-primary/30';

  const handleCopy = () => {
    const shareUrl = `${window.location.origin}/share/${result.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto printable-report"
    >
      <Card className={`flex flex-col items-center gap-6 ${borderColor}`}>
        {/* Verdict Badge */}
        <div className="flex flex-col items-center gap-3">
          <Badge variant={badgeVariant} className="text-sm px-4 py-1.5">
            {verdictLabel}
          </Badge>
          <h3 className="text-2xl font-extrabold tracking-tight text-text text-center">
            {isAI ? 'This image appears AI-generated' : 'This image appears authentic'}
          </h3>
          <p className="text-sm text-text-secondary text-center max-w-md">
            {isAI
              ? 'Our analysis detected patterns consistent with artificial image generation tools.'
              : 'No significant patterns of artificial generation were detected in this image.'}
          </p>
        </div>

        {/* Confidence Meter */}
        <ConfidenceMeter score={result.confidence_score} verdict={result.verdict} />

        {/* Score Detail */}
        <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-surface-light/50">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Verdict</span>
            <span className={`text-sm font-bold ${isAI ? 'text-danger' : 'text-primary'}`}>
              {verdictLabel}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-surface-light/50">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Confidence</span>
            <span className="text-sm font-bold text-text">
              {(result.confidence_score * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Export & Sharing Actions */}
        <div className="w-full flex flex-col sm:flex-row gap-3 mt-2 no-print">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied Link!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l4.636-2.318m0 0l3.08-1.54M13.32 8.424a3 3 0 11-1.34-1.34L13.32 8.424zM6 18a3 3 0 110-6 3 3 0 010 6zm12-3a3 3 0 110-6 3 3 0 010 6z" />
                </svg>
                Copy Share Link
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Print PDF Report
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default ResultCard;
