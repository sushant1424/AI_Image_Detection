import React, { useState } from 'react';
import PageWrapper from 'src/components/layout/PageWrapper';
import Card from 'src/components/common/Card';
import Button from 'src/components/common/Button';
import Modal from 'src/components/common/Modal';

export const PricingPage = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const plans = [
    {
      name: 'Free Starter',
      price: '$0',
      period: 'forever',
      description: 'Essential image checks for individual users.',
      features: [
        '5 image scans per day',
        'Standard visual highlights map',
        'Basic camera metadata search',
        'Web sharing links',
      ],
      cta: 'Current Plan',
      variant: 'secondary',
    },
    {
      name: 'Pro Analyst',
      price: '$9',
      period: 'per month',
      description: 'Complete inspection suite for verification experts.',
      features: [
        'Unlimited image scans',
        'High-resolution highlight highlights',
        'Detailed camera logs (EXIF)',
        'PDF and CSV audit exports',
        'Priority verification queue',
      ],
      cta: 'Upgrade to Pro',
      variant: 'primary',
      highlighted: true,
    },
  ];

  return (
    <PageWrapper>
      <div className="flex flex-col gap-12 w-full max-w-4xl mx-auto py-6">
        {/* Header */}
        <div className="text-center">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-full border border-primary/25">
            Plans & Pricing
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text mt-4 mb-2">
            Simple, Transparent Pricing
          </h1>
          <p className="text-base text-text-secondary max-w-xl mx-auto">
            Choose the package that fits your verification frequency. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col p-8 rounded-2xl relative ${
                plan.highlighted ? 'border-primary/50 shadow-lg shadow-primary/5' : 'border-border'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 right-6 bg-primary text-background text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Popular
                </span>
              )}
              <div className="mb-6">
                <h3 className="font-bold text-xl text-text">{plan.name}</h3>
                <p className="text-xs text-text-secondary mt-1">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8 border-b border-border/60 pb-6">
                <span className="text-5xl font-extrabold text-text">{plan.price}</span>
                <span className="text-sm text-text-secondary font-medium">/{plan.period}</span>
              </div>

              <ul className="flex flex-col gap-4 mb-8 flex-1">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
                    <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.variant}
                className="w-full font-bold"
                onClick={() => setModalOpen(true)}
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        {/* Payment Coming Soon Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Payment Plan Upgrade"
          maxWidth="max-w-md"
        >
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-text mb-1.5">Coming Soon!</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                We are currently preparing our payment system. During this demonstration phase, all premium Pro features (unlimited scans, visual maps, details log) are unlocked and fully active for free!
              </p>
            </div>
            <Button onClick={() => setModalOpen(false)} className="w-full mt-2">
              Great, thank you!
            </Button>
          </div>
        </Modal>
      </div>
    </PageWrapper>
  );
};

export default PricingPage;
