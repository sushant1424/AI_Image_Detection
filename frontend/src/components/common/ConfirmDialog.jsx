import React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Button from './Button';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you absolutely sure?',
  description = 'This action cannot be undone. This will permanently delete your data.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'primary' | 'warning'
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const getConfirmButtonVariant = () => {
    if (variant === 'danger') return 'danger';
    return 'primary';
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
        />

        {/* Dialog Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-surface border border-border p-6 rounded-2xl shadow-xl flex flex-col gap-4 z-10"
        >
          {/* Header */}
          <div className="flex flex-col gap-1.5">
            <h3 className="text-lg font-bold text-text tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {description}
            </p>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              size="sm"
            >
              {cancelText}
            </Button>
            <Button
              variant={getConfirmButtonVariant()}
              onClick={onConfirm}
              isLoading={isLoading}
              size="sm"
            >
              {confirmText}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default ConfirmDialog;
