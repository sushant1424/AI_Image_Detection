import React, { useState } from 'react';
import PageWrapper from 'src/components/layout/PageWrapper';
import DropZone from 'src/components/detection/DropZone';
import ResultCard from 'src/components/detection/ResultCard';
import HeatmapViewer from 'src/components/detection/HeatmapViewer';
import ForensicsInspector from 'src/components/detection/ForensicsInspector';
import AuthRequiredCard from 'src/components/detection/AuthRequiredCard';
import Spinner from 'src/components/common/Spinner';
import Button from 'src/components/common/Button';
import Input from 'src/components/common/Input';
import useDetection from 'src/hooks/useDetection';
import useAuth from 'src/hooks/useAuth';

export const DetectPage = () => {
  const { isAuthenticated } = useAuth();
  const {
    selectedImage,
    previewUrl,
    result,
    loading,
    error,
    selectImage,
    analyze,
    analyzeUrl,
    reset,
  } = useDetection();

  const [activeTab, setActiveTab] = useState('file'); // 'file' | 'url'
  const [urlInput, setUrlInput] = useState('');

  const handleUrlAnalyze = () => {
    if (!urlInput.trim()) return;
    analyzeUrl(urlInput.trim());
  };

  const handleReset = () => {
    setUrlInput('');
    reset();
  };

  return (
    <PageWrapper>
      <div className="flex flex-col items-center gap-8">
        {/* Header */}
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text mb-3">
            Analyze Image
          </h1>
          <p className="text-text-secondary text-base">
            Upload any image or paste a URL to detect if it was created by AI or is a genuine photograph.
          </p>
        </div>

        {/* Unauthenticated vs Authenticated inputs */}
        {!isAuthenticated ? (
          <AuthRequiredCard />
        ) : (
          <>
            {/* Input Selection Tabs */}
            {!result && !loading && (
              <div className="flex gap-1.5 p-1 bg-surface-light rounded-xl border border-border">
                <button
                  onClick={() => setActiveTab('file')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'file'
                      ? 'bg-background text-primary shadow-xs'
                      : 'text-text-secondary hover:text-text'
                  }`}
                >
                  File Upload
                </button>
                <button
                  onClick={() => setActiveTab('url')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'url'
                      ? 'bg-background text-primary shadow-xs'
                      : 'text-text-secondary hover:text-text'
                  }`}
                >
                  Image URL
                </button>
              </div>
            )}

            {/* Input Options */}
            {!result && !loading && (
              <div className="w-full max-w-2xl flex flex-col items-center">
                {activeTab === 'file' ? (
                  <>
                    <DropZone
                      onFileSelect={selectImage}
                      previewUrl={previewUrl}
                      selectedImage={selectedImage}
                    />
                    {selectedImage && (
                      <div className="flex items-center gap-4 mt-6">
                        <Button onClick={analyze} size="lg" className="px-10">
                          Analyze Image
                        </Button>
                        <Button onClick={handleReset} variant="ghost" size="lg">
                          Clear
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full flex flex-col gap-4">
                    <Input
                      label="Paste Image URL"
                      placeholder="https://example.com/some-fake-image.jpg"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      icon={
                        <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      }
                    />
                    <Button onClick={handleUrlAnalyze} disabled={!urlInput.trim()} size="lg" className="w-full">
                      Fetch & Analyze Image
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center gap-4 py-10">
                <Spinner className="w-12 h-12 text-primary" />
                <p className="text-sm text-text-secondary animate-pulse font-medium">
                  Verifying image authenticity...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-6">
                <p className="text-danger text-sm font-medium mb-4">{error}</p>
                <Button onClick={handleReset} variant="secondary" size="sm">
                  Try Again
                </Button>
              </div>
            )}

            {/* Results */}
            {result && !loading && (
              <div className="flex flex-col items-center gap-8 w-full">
                <ResultCard result={result} />
                {result.heatmap_image_url && (
                  <HeatmapViewer
                    originalUrl={result.original_image_url}
                    heatmapUrl={result.heatmap_image_url}
                  />
                )}
                {result.metadata && (
                  <ForensicsInspector metadata={result.metadata} />
                )}
                <Button onClick={handleReset} variant="secondary" size="lg" className="mt-4">
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
