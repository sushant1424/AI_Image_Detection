import React from 'react';
import HistoryCard from './HistoryCard';
import Skeleton from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button';

export const HistoryGrid = ({
  items = [],
  loading = false,
  page = 1,
  pages = 0,
  onPageChange,
  onView,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-4 p-4 border border-border rounded-2xl bg-surface/50">
            <Skeleton variant="rect" className="aspect-[4/3] w-full" />
            <Skeleton variant="text" className="h-4 w-1/3" />
            <div className="flex gap-2 pt-2 border-t border-border mt-auto">
              <Skeleton variant="text" className="h-8 flex-1 rounded-xl" />
              <Skeleton variant="circle" className="w-8 h-8 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        }
        title="No Scans Found"
        description="You have not run any image verification scans matching this filter yet."
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {items.map((item) => (
          <HistoryCard
            key={item.id}
            item={item}
            onView={onView}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {pages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-6 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </Button>

          <span className="text-xs font-bold text-text-secondary select-none">
            Page {page} of {pages}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === pages}
          >
            Next
            <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
};

export default HistoryGrid;
