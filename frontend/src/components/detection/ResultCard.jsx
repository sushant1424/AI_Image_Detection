import React from 'react';
import { motion } from 'framer-motion';
import { VERDICT_TYPES } from 'src/constants';
import { getVerdictColor } from 'src/utils';
import Card from '../common/Card';
import Badge from '../common/Badge';
import ConfidenceMeter from './ConfidenceMeter';

export const ResultCard = ({ result }) => {
  if (!result) return null;

  const isAI = result.verdict === VERDICT_TYPES.AI_GENERATED;
  const verdictLabel = isAI ? 'AI Generated' : 'Likely Real';
  const badgeVariant = isAI ? 'danger' : 'success';
  const borderColor = isAI ? 'border-danger/30' : 'border-primary/30';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto"
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
              ? 'Our neural network detected patterns consistent with AI generation tools.'
              : 'No significant AI-generation artifacts were detected in this image.'}
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
      </Card>
    </motion.div>
  );
};

export default ResultCard;
