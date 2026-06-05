import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from 'src/components/layout/PageWrapper';
import StatCard from 'src/components/stats/StatCard';
import VerdictPieChart from 'src/components/stats/VerdictPieChart';
import ActivityChart from 'src/components/stats/ActivityChart';
import ConfidenceHistogram from 'src/components/stats/ConfidenceHistogram';
import Skeleton from 'src/components/common/Skeleton';
import EmptyState from 'src/components/common/EmptyState';
import Button from 'src/components/common/Button';
import useStats from 'src/hooks/useStats';
import { ROUTES } from 'src/constants';

export const StatsPage = () => {
  const { stats, loading } = useStats();
  const navigate = useNavigate();

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex flex-col gap-8 w-full">
          {/* Header Skeleton */}
          <div className="border-b border-border pb-6">
            <Skeleton variant="text" className="h-9 w-1/4 mb-2" />
            <Skeleton variant="text" className="h-4 w-1/3" />
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton variant="rect" className="h-32 rounded-2xl" />
            <Skeleton variant="rect" className="h-32 rounded-2xl" />
            <Skeleton variant="rect" className="h-32 rounded-2xl" />
          </div>

          {/* Charts Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton variant="rect" className="h-[320px] rounded-2xl md:col-span-2" />
            <Skeleton variant="rect" className="h-[320px] rounded-2xl" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  // If stats load but user has 0 total detections, show empty state dashboard
  if (!stats || stats.total_detections === 0) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center gap-6 text-center py-12">
          <EmptyState
            icon={
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            }
            title="Analytics Dashboard Empty"
            description="Run your first image scan to view detailed metrics, scan counts, and verification reports."
            action={
              <Button onClick={() => navigate(ROUTES.DETECT)} size="md">
                Scan Your First Image
              </Button>
            }
          />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="flex flex-col gap-8 w-full">
        {/* Page Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-text mb-1.5">
            Dashboard Analytics
          </h1>
          <p className="text-sm text-text-secondary">
            Insights and verification metrics on your scanned images.
          </p>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Image Scans"
            value={stats.total_detections}
            description="Accumulated scans history"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            }
          />
          <StatCard
            title="AI Detections"
            value={stats.ai_generated_count}
            description={`${((stats.ai_generated_count / stats.total_detections) * 100).toFixed(0)}% of total scans`}
            className="border-danger/10"
            icon={
              <svg className="w-6 h-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />
          <StatCard
            title="Authentic Images"
            value={stats.real_count}
            description={`${((stats.real_count / stats.total_detections) * 100).toFixed(0)}% of total scans`}
            className="border-primary/10"
            icon={
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActivityChart data={stats.daily_activity} />
          <VerdictPieChart aiCount={stats.ai_generated_count} realCount={stats.real_count} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <ConfidenceHistogram data={stats.confidence_distribution} />
        </div>
      </div>
    </PageWrapper>
  );
};

export default StatsPage;
