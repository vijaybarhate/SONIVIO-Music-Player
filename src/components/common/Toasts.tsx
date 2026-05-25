import React from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';

const Toasts: React.FC = () => {
  const { toasts, removeToast } = usePlayerStore();

  return (
    <div className="fixed bottom-32 left-8 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-bg border border-brand p-4 min-w-[240px] pointer-events-auto flex items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(238,255,0,0.2)]"
          >
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-brand uppercase tracking-widest mb-1">System_Message</span>
              <p className="font-mono text-xs uppercase tracking-tight text-white">{toast.message}</p>
            </div>
            
            <div className="flex items-center gap-2">
              {toast.undoAction && (
                <button
                  onClick={() => {
                    toast.undoAction?.();
                    removeToast(toast.id);
                  }}
                  className="p-1.5 hover:bg-brand hover:text-black transition-all border border-brand/20"
                  title="UNDO_ACTION"
                >
                  <RotateCcw size={14} />
                </button>
              )}
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1.5 hover:bg-white hover:text-black transition-all border border-white/10"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toasts;
