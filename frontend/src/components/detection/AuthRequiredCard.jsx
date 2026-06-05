import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { ROUTES } from 'src/constants';

export const AuthRequiredCard = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default AuthRequiredCard;
