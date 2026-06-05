import React, { useState } from 'react';
import Card from 'src/components/common/Card';
import Input from 'src/components/common/Input';
import Button from 'src/components/common/Button';
import { changePassword } from 'src/api/authApi';
import { useToast } from 'src/hooks/useToast';

const ChangePasswordForm = () => {
  const toast = useToast();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.current) e.current = 'Current password is required';
    if (!form.next) e.next = 'New password is required';
    else if (form.next.length < 8) e.next = 'Must be at least 8 characters';
    if (form.next !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      await changePassword({ current_password: form.current, new_password: form.next });
      toast.success('Password updated successfully');
      setForm({ current: '', next: '', confirm: '' });
      setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  return (
    <Card className="p-6">
      <h3 className="text-base font-bold text-text mb-4">Change Password</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input type="password" label="Current Password" placeholder="Enter current password"
          value={form.current} onChange={set('current')} error={errors.current} />
        <Input type="password" label="New Password" placeholder="Minimum 8 characters"
          value={form.next} onChange={set('next')} error={errors.next} />
        <Input type="password" label="Confirm New Password" placeholder="Confirm new password"
          value={form.confirm} onChange={set('confirm')} error={errors.confirm} />
        <Button type="submit" isLoading={loading} className="w-fit self-start mt-2">
          Update Password
        </Button>
      </form>
    </Card>
  );
};

export default ChangePasswordForm;
