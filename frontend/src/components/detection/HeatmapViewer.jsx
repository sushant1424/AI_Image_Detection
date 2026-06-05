import React, { useState } from 'react';
import Card from '../common/Card';

export const HeatmapViewer = ({ originalUrl, heatmapUrl }) => {
  const [activeTab, setActiveTab] = useState('side'); // 'side' | 'overlay'
  const [opacity, setOpacity] = useState(0.5);

  // Fallback to absolute URLs if backend relative pathing is loaded
  const getFullUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${window.location.origin}${path}`;
  };

  const fullOriginal = getFullUrl(originalUrl);
  const fullHeatmap = getFullUrl(heatmapUrl);

  return (
    <Card className="flex flex-col gap-5 bg-surface/30 w-full max-w-4xl mx-auto">
      {/* View Controller Tabs */}
      <div className="flex justify-between items-center pb-3 border-b border-border">
        <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
          Explainability Visualization
        </h4>
        <div className="flex gap-1.5 p-1 bg-surface-light rounded-xl border border-border">
          <button
            onClick={() => setActiveTab('side')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'side'
                ? 'bg-background text-primary shadow-xs'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setActiveTab('overlay')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'overlay'
                ? 'bg-background text-primary shadow-xs'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            Interactive Overlay
          </button>
        </div>
      </div>

      {/* Render Area */}
      <div className="w-full overflow-hidden flex flex-col items-center">
        {activeTab === 'side' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-text-secondary text-center">Original</span>
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border bg-background">
                <img
                  src={fullOriginal}
                  alt="Original upload"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-text-secondary text-center">Grad-CAM Heatmap</span>
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border bg-background">
                <img
                  src={fullHeatmap}
                  alt="Grad-CAM analysis heatmap"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 w-full max-w-2xl">
            {/* Overlay Viewport */}
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-border bg-background">
              {/* Original base layer */}
              <img
                src={fullOriginal}
                alt="Base Original"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Heatmap overlay layer */}
              <img
                src={fullHeatmap}
                alt="Heatmap Overlay"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-75"
                style={{ opacity }}
              />
            </div>
            
            {/* Opacity slider */}
            <div className="flex items-center gap-4 w-full px-2">
              <span className="text-xs font-bold text-text-secondary select-none">Original</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="flex-1 accent-primary h-1 bg-surface-light rounded-lg cursor-pointer border-none outline-hidden"
              />
              <span className="text-xs font-bold text-text-secondary select-none">Heatmap</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default HeatmapViewer;
