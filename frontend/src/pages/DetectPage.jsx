import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from 'src/components/layout/PageWrapper';
import DropZone from 'src/components/detection/DropZone';
import ResultCard from 'src/components/detection/ResultCard';
import HeatmapViewer from 'src/components/detection/HeatmapViewer';
import Spinner from 'src/components/common/Spinner';
import Button from 'src/components/common/Button';
import Card from 'src/components/common/Card';
import useDetection from 'src/hooks/useDetection';
import useAuth from 'src/hooks/useAuth';
import { ROUTES } from 'src/constants';

export const DetectPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    selectedImage,
    previewUrl,
    result,
    loading,
    error,
    selectImage,
    analyze,
    reset,
  } = useDetection();

  return (
    <PageWrapper>
      <div className="flex flex-col items-center gap-10">
        {/* Header */}
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text mb-3">
            Analyze Image
          </h1>
          <p className="text-text-secondary text-base">
            Upload any image to detect if it was created by AI or is a genuine photograph.
          </p>
        </div>

        {/* Unauthenticated State Alert */}
        {!isAuthenticated ? (
          <Card className="flex flex-col items-center text-center p-8 max-w-lg w-full gap-5 border-primary/20 bg-primary/5">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-text mb-1">Authentication Required</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                To perform advanced neural network scanning and view heatmaps, you must first be logged in to your account.
              </p>
            </div>
            <div className="flex gap-3 w-full">
              <Button onClick={() => navigate(ROUTES.LOGIN)} className="flex-1">Sign In</Button>
              <Button onClick={() => navigate(ROUTES.REGISTER)} variant="secondary" className="flex-1">Create Account</Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Upload Zone */}
            {!result && (
              <DropZone
                onFileSelect={selectImage}
                previewUrl={previewUrl}
                selectedImage={selectedImage}
              />
            )}

            {/* Action Buttons */}
            {!result && selectedImage && (
              <div className="flex items-center gap-4">
                <Button onClick={analyze} isLoading={loading} size="lg" className="px-10">
                  {loading ? 'Analyzing...' : 'Analyze Image'}
                  {!loading && (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </Button>
                <Button onClick={reset} variant="ghost" size="lg">
                  Clear
                </Button>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center gap-4 py-10">
                <Spinner className="w-12 h-12 text-primary" />
                <p className="text-sm text-text-secondary animate-pulse font-medium">
                  Running neural network analysis...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-6">
                <p className="text-danger text-sm font-medium mb-4">{error}</p>
                <Button onClick={reset} variant="secondary" size="sm">
                  Try Again
                </Button>
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="flex flex-col items-center gap-8 w-full">
                <ResultCard result={result} />

                {/* Heatmap Visualization */}
                {result.heatmap_image_url && (
                  <HeatmapViewer
                    originalUrl={result.original_image_url}
                    heatmapUrl={result.heatmap_image_url}
                  />
                )}

                {/* Scan Again */}
                <Button onClick={reset} variant="secondary" size="lg" className="mt-4">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Scan Another Image
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default DetectPage;
