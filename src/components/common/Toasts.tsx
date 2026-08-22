import React from 'react';
import { useUiStore } from '../../store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const TYPE_META = {
  success: { label: 'Success', Icon: CheckCircle2, cls: 'text-link' },
  error: { label: 'Error', Icon: AlertTriangle, cls: 'text-error' },
  info: { label: 'Notification', Icon: Info, cls: 'text-mute' },
} as const;

const Toasts: React.FC = () => {
  const { toasts, removeToast } = useUiStore();

  return (
    <div className="fixed bottom-28 left-6 z-[100] flex flex-col gap-2 pointer-events-none select-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const meta = TYPE_META[toast.type ?? 'info'];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              className="bg-canvas border border-hairline p-3 md:p-3.5 min-w-[240px] max-w-xs pointer-events-auto flex items-start justify-between gap-4 modal-shadow-lvl5 rounded-md overflow-hidden relative"
            >
              {/* Auto-dismiss progress line */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 3, ease: 'linear' }}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-hairline-strong origin-left"
              />

              <div className="flex items-start gap-2.5">
                <meta.Icon size={14} className={`${meta.cls} mt-0.5 flex-shrink-0`} />
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] text-mute uppercase tracking-wider mb-0.5">
                    {meta.label}
                  </span>
                  <p className="font-sans text-xs font-medium text-ink leading-tight">{toast.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                {toast.undoAction && (
                  <button
                    onClick={() => {
                      toast.undoAction?.();
                      removeToast(toast.id);
                    }}
                    aria-label="Undo action"
                    className="p-1 rounded hover:bg-canvas-soft-2 text-mute hover:text-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong"
                    title="Undo action"
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
                <button
                  onClick={() => removeToast(toast.id)}
                  aria-label="Dismiss notification"
                  className="p-1 rounded hover:bg-canvas-soft-2 text-mute hover:text-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong"
                >
                  <X size={13} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Toasts;
