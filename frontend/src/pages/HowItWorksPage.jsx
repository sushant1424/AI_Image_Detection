import React from 'react';
import { Link } from 'react-router-dom';
import PageWrapper from 'src/components/layout/PageWrapper';
import Card from 'src/components/common/Card';
import Button from 'src/components/common/Button';
import { ROUTES } from 'src/constants';

export const HowItWorksPage = () => {
  const steps = [
    {
      number: '01',
      title: 'Upload or Paste Link',
      description: 'Simply drag and drop your photo or enter a public web link. We support JPEG, PNG, and WebP images.',
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Analyze Patterns',
      description: 'DeepGuard scans the image pixels, examining compression consistency, noise levels, and embedded camera data tags.',
      icon: (
        <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Review Visual Report',
      description: 'Get an instant confidence score and highlight map showing areas with artificial anomalies, along with camera logs.',
      icon: (
        <svg className="w-6 h-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
  ];

  return (
    <PageWrapper>
      <div className="flex flex-col gap-12 w-full max-w-4xl mx-auto py-6">
        {/* Header */}
        <div className="text-center">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-full border border-primary/25">
            How It Works
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text mt-4 mb-2">
            Verification Simplified
          </h1>
          <p className="text-base text-text-secondary max-w-xl mx-auto">
            DeepGuard uses intelligent pixel verification to determine if an image is real or AI-generated.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <Card key={index} hoverEffect className="relative flex flex-col gap-6 p-6 overflow-hidden">
              <div className="absolute -top-4 -right-2 text-7xl font-extrabold text-border/40 select-none pointer-events-none">
                {step.number}
              </div>
              <div className="w-12 h-12 rounded-xl bg-surface-light border border-border flex items-center justify-center">
                {step.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg text-text mb-2">{step.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Explanatory section */}
        <Card className="p-8 bg-surface-light/50 border-border/80 flex flex-col md:flex-row gap-6 items-center rounded-2xl">
          <div className="flex-1 flex flex-col gap-2">
            <h3 className="font-bold text-xl text-text">No technical knowledge required</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              We design our reports to be easy to understand. Instead of dealing with raw data parameters, you get a simple gauge from 0% to 100%, and a highlighting map that shows exactly where image alterations were found.
            </p>
          </div>
          <div className="w-full md:w-auto flex-shrink-0">
            <Link to={ROUTES.DETECT}>
              <Button size="lg" className="w-full md:w-auto px-6">
                Start Scan
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default HowItWorksPage;
