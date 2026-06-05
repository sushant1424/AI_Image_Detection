import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from 'src/components/layout/PageWrapper';
import EmptyState from 'src/components/common/EmptyState';
import Button from 'src/components/common/Button';
import { ROUTES } from 'src/constants';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper className="flex flex-col justify-center items-center min-h-[calc(100vh-8rem)]">
      <EmptyState
        icon={
          <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        title="404 — Page Not Found"
        description="The page you are looking for does not exist or has been moved."
        action={
          <Button onClick={() => navigate(ROUTES.HOME)} size="md">
            Go Back Home
          </Button>
        }
      />
    </PageWrapper>
  );
};

export default NotFoundPage;
