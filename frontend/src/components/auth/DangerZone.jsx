import React, { useState } from 'react';
import Card from 'src/components/common/Card';
import Button from 'src/components/common/Button';
import ConfirmDialog from 'src/components/common/ConfirmDialog';
import useModal from 'src/hooks/useModal';
import { deleteAccount } from 'src/api/authApi';
import { useToast } from 'src/hooks/useToast';

const DangerZone = ({ onAccountDeleted }) => {
  const toast = useToast();
  const { isOpen, open, close } = useModal();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteAccount();
      toast.success('Your account has been deleted permanently');
      close();
      onAccountDeleted();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="p-6 border-danger/30 bg-danger/5">
        <h3 className="text-base font-bold text-danger mb-2">Danger Zone</h3>
        <p className="text-xs text-text-secondary mb-4 leading-relaxed">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <Button onClick={open} variant="danger" size="sm">Delete Account</Button>
      </Card>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={close}
        onConfirm={handleDelete}
        isLoading={loading}
        title="Confirm Account Deletion"
        description="Are you absolutely sure you want to delete your account? All scan history, images, and heatmaps will be permanently removed. This action is irreversible."
        confirmText="Yes, Delete My Account"
        variant="danger"
      />
    </>
  );
};

export default DangerZone;
