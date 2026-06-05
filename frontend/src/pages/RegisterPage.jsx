import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from 'src/constants';
import PageWrapper from 'src/components/layout/PageWrapper';
import Card from 'src/components/common/Card';
import RegisterForm from 'src/components/auth/RegisterForm';

export const RegisterPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || ROUTES.DETECT;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  return (
    <PageWrapper className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      {/* Background visual blobs */}
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-text mb-2">
            Create Account
          </h2>
          <p className="text-sm text-text-secondary">
            Register to keep a complete history of all your scans
          </p>
        </div>

        <Card className="shadow-2xl border-border bg-surface/50 backdrop-blur-sm">
          <RegisterForm />
        </Card>
      </div>
    </PageWrapper>
  );
};

export default RegisterPage;
