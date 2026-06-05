import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';

export const ForensicsInspector = ({ metadata }) => {
  if (!metadata) return null;

  const hasExif = metadata.exif && Object.keys(metadata.exif).length > 0;

  return (
    <Card className="w-full max-w-4xl mx-auto bg-surface/30 border border-border/80">
      <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
            Image Forensics & Metadata
          </h4>
        </div>
        <Badge variant={hasExif ? 'success' : 'neutral'}>
          {hasExif ? 'Camera EXIF Data Found' : 'Metadata Stripped/Absent'}
        </Badge>
      </div>

      {/* Grid of File Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-3 bg-background/50 border border-border/50 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-text-secondary">Format</div>
          <div className="text-sm font-bold text-text mt-0.5">{metadata.format || 'Unknown'}</div>
        </div>
        <div className="p-3 bg-background/50 border border-border/50 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-text-secondary">Resolution</div>
          <div className="text-sm font-bold text-text mt-0.5">
            {metadata.width && metadata.height ? `${metadata.width} × ${metadata.height}` : 'Unknown'}
          </div>
        </div>
        <div className="p-3 bg-background/50 border border-border/50 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-text-secondary">File Size</div>
          <div className="text-sm font-bold text-text mt-0.5">{metadata.size_kb ? `${metadata.size_kb} KB` : 'Unknown'}</div>
        </div>
        <div className="p-3 bg-background/50 border border-border/50 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-text-secondary">Color Mode</div>
          <div className="text-sm font-bold text-text mt-0.5">{metadata.mode || 'Unknown'}</div>
        </div>
      </div>

      {/* EXIF Table */}
      {hasExif ? (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
            Exif Headers
          </span>
          <div className="max-h-48 overflow-y-auto border border-border/50 rounded-xl bg-background/30 scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/50 bg-background/50">
                  <th className="p-2.5 font-bold text-text-secondary">Tag Name</th>
                  <th className="p-2.5 font-bold text-text-secondary">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {Object.entries(metadata.exif).map(([key, val]) => (
                  <tr key={key} className="hover:bg-surface/20">
                    <td className="p-2.5 font-semibold text-primary">{key}</td>
                    <td className="p-2.5 text-text break-all font-mono">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 border border-dashed border-border/50 rounded-xl bg-background/25">
          <p className="text-xs text-text-secondary">
            No embedded EXIF tags found. Standard metadata might have been removed during export/compression, or this is a synthesized canvas.
          </p>
        </div>
      )}
    </Card>
  );
};

export default ForensicsInspector;
