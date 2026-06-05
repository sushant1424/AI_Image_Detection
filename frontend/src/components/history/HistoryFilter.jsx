import React from 'react';

const filters = [
  { label: 'All Scans', value: 'ALL' },
  { label: 'AI Generated', value: 'AI_GENERATED' },
  { label: 'Likely Real', value: 'REAL' },
];

export const HistoryFilter = ({ activeFilter, onChange }) => {
  return (
    <div className="flex gap-2 p-1 bg-surface-light rounded-xl border border-border w-fit">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeFilter === filter.value
              ? 'bg-background text-primary shadow-xs'
              : 'text-text-secondary hover:text-text'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default HistoryFilter;
