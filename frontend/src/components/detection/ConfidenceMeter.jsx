import React from 'react';
import { motion } from 'framer-motion';
import { VERDICT_TYPES } from 'src/constants';

export const ConfidenceMeter = ({ score = 0, verdict = VERDICT_TYPES.REAL }) => {
  const isAI = verdict === VERDICT_TYPES.AI_GENERATED;
  
  // Percentage value
  const percentage = Math.round(score * 100);
  
  // Color configuration
  const colorClass = isAI ? 'stroke-danger' : 'stroke-primary';
  const textClass = isAI ? 'text-danger' : 'text-primary';
  const bgCircleClass = 'stroke-border';

  // SVG Circle parameters
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score * circumference);

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Progress Circle SVG */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
          {/* Background Track */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            strokeWidth={strokeWidth}
            className={`${bgCircleClass} fill-transparent`}
          />
          {/* Animated Foreground Progress */}
          <motion.circle
            cx="70"
            cy="70"
            r={radius}
            strokeWidth={strokeWidth}
            className={`${colorClass} fill-transparent`}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-extrabold tracking-tight ${textClass}`}>
            {percentage}%
          </span>
          <span className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mt-0.5">
            Confidence
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceMeter;
