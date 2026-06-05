import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { SUPPORTED_FORMATS, MAX_FILE_SIZE } from 'src/constants';
import { useToast } from 'src/hooks/useToast';

export const DropZone = ({ onFileSelect, previewUrl, selectedImage }) => {
  const toast = useToast();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-too-large') {
        toast.error('Image exceeds 10MB limit');
      } else if (error.code === 'file-invalid-type') {
        toast.error('Supported formats are JPEG, PNG, and WEBP only');
      } else {
        toast.error(error.message);
      }
      return;
    }

    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative w-full aspect-[4/3] max-w-2xl mx-auto rounded-2xl border-2 border-dashed 
        flex flex-col items-center justify-center p-6 text-center cursor-pointer 
        transition-all duration-300 overflow-hidden group
        ${isDragActive ? 'border-primary bg-primary/5 glow' : 'border-border bg-surface-light/40 hover:border-primary/50'}
      `}
    >
      <input {...getInputProps()} />

      {previewUrl ? (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-background/5">
          <img
            src={previewUrl}
            alt="Upload Preview"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 backdrop-blur-xs">
            <div className="flex flex-col items-center gap-2 text-text">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-sm font-semibold">Drop or click to replace</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 animate-fade-in pointer-events-none">
          <div className="p-4 bg-surface rounded-full border border-border group-hover:border-primary/30 transition-colors">
            <svg className="w-8 h-8 text-text-secondary group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-base font-bold text-text mb-1">
              Drag & drop your image here
            </p>
            <p className="text-xs text-text-secondary">
              Supports JPEG, PNG, WEBP up to 10MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropZone;
