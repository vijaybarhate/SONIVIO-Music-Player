import React from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Brand dialog wrapper over Base UI's headless Dialog.
 * Provides: focus trap, aria-modal, Escape-to-close, scroll lock,
 * focus restore — styled with SONIVIO tokens (canvas surface,
 * hairline border, modal-shadow-lvl5, framer-motion entrance).
 *
 * Source: https://base-ui.com/react/components/dialog (MIT)
 * Adaptation: brand chrome + motion only; primitive behavior untouched.
 */

interface BrandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const BrandDialog: React.FC<BrandDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  className = '',
}) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 z-[200] bg-ink/20 backdrop-blur-xs" />
      <Dialog.Popup
        aria-modal="true"
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[210] w-full max-w-sm bg-canvas border border-hairline rounded-lg p-6 modal-shadow-lvl5 outline-none ${className}`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <Dialog.Title className="text-lg font-sans font-semibold text-ink tracking-tight">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="font-sans text-xs text-mute mt-1">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close
              aria-label="Close dialog"
              className="p-1.5 rounded-sm border border-hairline bg-canvas hover:bg-canvas-soft-2 text-mute hover:text-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong"
            >
              <X size={14} />
            </Dialog.Close>
          </div>
          {children}
        </motion.div>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
);

export default BrandDialog;