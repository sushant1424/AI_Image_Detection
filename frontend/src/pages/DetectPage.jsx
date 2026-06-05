import React from 'react';
import PageWrapper from 'src/components/layout/PageWrapper';
import DropZone from 'src/components/detection/DropZone';
import ResultCard from 'src/components/detection/ResultCard';
import HeatmapViewer from 'src/components/detection/HeatmapViewer';
import Spinner from 'src/components/common/Spinner';
import Button from 'src/components/common/Button';
import useDetection from 'src/hooks/useDetection';

export const DetectPage = () => {
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
      </div>
    </PageWrapper>
  );
};

export default DetectPage;
