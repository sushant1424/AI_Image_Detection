import React from 'react';
import PageWrapper from 'src/components/layout/PageWrapper';
import Card from 'src/components/common/Card';
import ChangePasswordForm from 'src/components/auth/ChangePasswordForm';
import DangerZone from 'src/components/auth/DangerZone';
import useAuth from 'src/hooks/useAuth';
import { formatDate } from 'src/utils';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <PageWrapper>
      <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-text mb-1.5">
            Account Profile
          </h1>
          <p className="text-sm text-text-secondary">
            Manage your credentials and account settings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card className="flex flex-col items-center text-center p-6 gap-4 md:col-span-1">
            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center text-primary text-3xl font-bold select-none uppercase">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-text">{user.name}</h3>
              <span className="text-xs text-text-secondary">{user.email}</span>
            </div>
            <div className="border-t border-border pt-4 w-full">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-medium">Joined</span>
                <span className="text-text font-bold">{formatDate(user.created_at).split(',')[0]}</span>
              </div>
            </div>
          </Card>

          {/* Settings Column */}
          <div className="flex flex-col gap-6 md:col-span-2">
            <ChangePasswordForm />
            <DangerZone onAccountDeleted={logout} />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ProfilePage;
