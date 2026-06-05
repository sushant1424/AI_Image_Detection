import React, { useState } from 'react';
import Card from 'src/components/common/Card';
import Button from 'src/components/common/Button';
import Modal from 'src/components/common/Modal';
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

      <Modal isOpen={isOpen} onClose={close} title="Confirm Account Deletion">
        <div className="flex flex-col gap-4 py-2">
          <p className="text-sm text-text-secondary leading-relaxed">
            All history, scans, and heatmaps will be permanently removed. This is irreversible.
          </p>
          <div className="flex items-center gap-3 justify-end mt-4">
            <Button onClick={close} variant="ghost" size="sm">Cancel</Button>
            <Button onClick={handleDelete} isLoading={loading} variant="danger" size="sm">
              Yes, Delete My Account
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DangerZone;
