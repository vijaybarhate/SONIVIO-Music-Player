import React from 'react';
import { useUiStore } from '../../store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';

const Toasts: React.FC = () => {
  const { toasts, removeToast } = useUiStore();

  return (
    <div className="fixed bottom-28 left-6 z-[100] flex flex-col gap-2 pointer-events-none select-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: -10, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="bg-canvas border border-hairline p-3 md:p-4 min-w-[240px] pointer-events-auto flex items-center justify-between gap-4 card-shadow-lvl4 rounded-md"
          >
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-mute uppercase tracking-wider mb-0.5">Notification</span>
              <p className="font-sans text-xs font-semibold text-ink leading-tight">{toast.message}</p>
            </div>
            
            <div className="flex items-center gap-1">
              {toast.undoAction && (
                <button
                  onClick={() => {
                    toast.undoAction?.();
                    removeToast(toast.id);
                  }}
                  className="p-1 rounded hover:bg-canvas-soft-2 text-mute hover:text-ink transition-colors cursor-pointer"
                  title="Undo action"
                >
                  <RotateCcw size={13} />
                </button>
              )}
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded hover:bg-canvas-soft-2 text-mute hover:text-ink transition-colors cursor-pointer"
              >
                <X size={13} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toasts;
