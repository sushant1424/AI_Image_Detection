import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from 'src/constants';
import PageWrapper from 'src/components/layout/PageWrapper';
import Card from 'src/components/common/Card';
import Button from 'src/components/common/Button';

export const LandingPage = () => {
  return (
    <PageWrapper className="relative overflow-hidden flex flex-col justify-center min-h-[calc(100vh-8rem)]">
      {/* Floating background blobs */}
      <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-blob -z-10" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-blob animation-delay-2000 -z-10" />

      {/* Hero Section */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto my-auto pt-10 pb-16">
        {/* Sparkle Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold mb-10 animate-fade-in shadow-sm">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          AI Image Verification
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.25] md:leading-[1.3] animate-slide-up">
          Can You Trust <br />
          <span className="gradient-text mt-2 block md:inline">What You See?</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl leading-relaxed animate-slide-up animation-delay-2000">
          Instantly check if a photo is real or AI-generated. Upload any image or paste a link to verify authenticity, identify digital manipulations, and view highlighted patterns.
        </p>

        {/* CTA Button */}
        <div className="animate-slide-up animation-delay-4000">
          <Link to={ROUTES.DETECT}>
            <Button size="lg" className="px-8 py-4 text-base font-bold glow">
              Detect Now
              <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-auto pt-10 border-t border-border/50">
        <Card hoverEffect className="flex flex-col gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg text-text mb-1.5">Fast Results</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Our analyzer scans image features to deliver full verification results in less than two seconds.
            </p>
          </div>
        </Card>

        <Card hoverEffect className="flex flex-col gap-4">
          <div className="w-12 h-12 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-success">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg text-text mb-1.5">Highlight Map</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Visualize which areas of the uploaded image contain artificial generation signs or structural anomalies.
            </p>
          </div>
        </Card>

        <Card hoverEffect className="flex flex-col gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg text-text mb-1.5">Safe Scan History</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Safely save your image verification history, export CSV spreadsheets, and generate PDF reports.
            </p>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default LandingPage;
