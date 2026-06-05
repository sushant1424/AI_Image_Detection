import React, { useState } from 'react';
import PageWrapper from 'src/components/layout/PageWrapper';
import Card from 'src/components/common/Card';
import Input from 'src/components/common/Input';
import Button from 'src/components/common/Button';
import Modal from 'src/components/common/Modal';
import useAuth from 'src/hooks/useAuth';
import useModal from 'src/hooks/useModal';
import { changePassword, deleteAccount } from 'src/api/authApi';
import { useToast } from 'src/hooks/useToast';
import { formatDate } from 'src/utils';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const { isOpen, open, close } = useModal();

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  // Delete Account loading
  const [deleteLoading, setDeleteLoading] = useState(false);

  const validatePasswordForm = () => {
    const errors = {};
    if (!currentPassword) errors.currentPassword = 'Current password is required';
    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters';
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    try {
      setPasswordLoading(true);
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordErrors({});
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Failed to update password';
      toast.error(errMsg);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true);
      await deleteAccount();
      toast.success('Your account has been deleted permanently');
      close();
      logout();
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Failed to delete account';
      toast.error(errMsg);
    } finally {
      setDeleteLoading(false);
    }
  };

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
            Manage your credentials and configuration options.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: User details */}
          <div className="flex flex-col gap-6 md:col-span-1">
            <Card className="flex flex-col items-center text-center p-6 gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center text-primary text-3xl font-bold select-none uppercase">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-text">{user.name}</h3>
                <span className="text-xs text-text-secondary">{user.email}</span>
              </div>
              <div className="border-t border-border pt-4 w-full flex flex-col gap-2 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary font-medium">Joined</span>
                  <span className="text-text font-bold">{formatDate(user.created_at).split(',')[0]}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Settings fields */}
          <div className="flex flex-col gap-6 md:col-span-2">
            {/* Change Password Card */}
            <Card className="p-6">
              <h3 className="text-base font-bold text-text mb-4">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                <Input
                  type="password"
                  label="Current Password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  error={passwordErrors.currentPassword}
                />
                <Input
                  type="password"
                  label="New Password"
                  placeholder="Minimum 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={passwordErrors.newPassword}
                />
                <Input
                  type="password"
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={passwordErrors.confirmPassword}
                />
                <Button type="submit" isLoading={passwordLoading} className="w-fit self-start mt-2">
                  Update Password
                </Button>
              </form>
            </Card>

            {/* Danger Zone Card */}
            <Card className="p-6 border-danger/30 bg-danger/5">
              <h3 className="text-base font-bold text-danger mb-2">Danger Zone</h3>
              <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                Permanently delete your account, saved scans history, and generated analysis heatmaps. This action is irreversible.
              </p>
              <Button onClick={open} variant="danger" size="sm">
                Delete Account
              </Button>
            </Card>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isOpen}
          onClose={close}
          title="Irreversible Account Deletion"
        >
          <div className="flex flex-col gap-4 py-2">
            <p className="text-sm text-text-secondary leading-relaxed">
              Are you sure you want to delete your account? All history logs, original scans, and heatmap files will be deleted from our storage servers permanently.
            </p>
            <div className="flex items-center gap-3 justify-end mt-4">
              <Button onClick={close} variant="ghost" size="sm">
                Cancel
              </Button>
              <Button onClick={handleDeleteAccount} isLoading={deleteLoading} variant="danger" size="sm">
                Yes, Delete My Account
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageWrapper>
  );
};

export default ProfilePage;
