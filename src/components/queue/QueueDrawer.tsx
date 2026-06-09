import React, { useEffect, useRef } from 'react';
import { X, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { useQueueStore } from '../../store/queueStore';
import { useUiStore } from '../../store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const QueueDrawer: React.FC<QueueDrawerProps> = ({ isOpen, onClose }) => {
  const { queue, currentQueueItem, removeFromQueue, clearQueue, reorderQueue } = useQueueStore();
  const { playFromQueue } = usePlayerStore();
  const { showToast } = useUiStore();
  const activeItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isOpen, currentQueueItem]);

  const handleClear = () => {
    clearQueue();
    showToast('Play queue cleared', 'info');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/15 backdrop-blur-xs z-[60]"
          />
          
          {/* Drawer Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-canvas border-l border-hairline z-[70] flex flex-col shadow-xl select-none"
          >
            {/* Header */}
            <div className="p-4 border-b border-hairline flex items-center justify-between bg-canvas-soft-2">
              <div>
                <h2 className="text-sm font-sans font-semibold text-ink">Up Next.</h2>
                <p className="text-[10px] font-mono text-mute mt-0.5">{queue.length} tracks</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleClear}
                  disabled={queue.length === 0}
                  className="p-1.5 rounded text-mute hover:text-error hover:bg-canvas transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
                  title="Clear Queue"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded text-mute hover:text-ink hover:bg-canvas transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar bg-canvas-soft">
              {queue.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 select-none">
                  <div className="w-10 h-10 rounded-full bg-canvas border border-hairline flex items-center justify-center mb-3 text-mute">
                    <ListMusic size={16} />
                  </div>
                  <h3 className="font-sans font-semibold text-xs text-ink mb-1">Queue is empty</h3>
                  <p className="font-sans text-[11px] text-mute">Add some tracks from search or your library.</p>
                </div>
              ) : (
                queue.map((item, index) => {
                  const isActive = currentQueueItem?.id === item.id;
                  
                  return (
                    <motion.div
                      key={item.id}
                      ref={isActive ? activeItemRef : null}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.02, 0.15) }}
                      className={`
                        group flex items-center gap-2 p-2 rounded border transition-all cursor-pointer
                        ${isActive 
                          ? 'bg-canvas border-hairline-strong shadow-sm' 
                          : 'bg-canvas border-hairline hover:border-hairline-strong hover:bg-canvas-soft'
                        }
                      `}
                    >
                      {/* Sort Controls (Reordering) */}
                      <div className="flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity w-5">
                        <button 
                          onClick={(e) => { e.stopPropagation(); if (index > 0) reorderQueue(index, index - 1); }}
                          disabled={index === 0}
                          className="text-mute hover:text-ink p-0.5 disabled:opacity-25"
                          title="Move up"
                        >
                          <ArrowUp size={11} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); if (index < queue.length - 1) reorderQueue(index, index + 1); }}
                          disabled={index === queue.length - 1}
                          className="text-mute hover:text-ink p-0.5 disabled:opacity-25"
                          title="Move down"
                        >
                          <ArrowDown size={11} />
                        </button>
                      </div>

                      {/* Thumbnail Art */}
                      <div 
                        className="w-9 h-9 flex-shrink-0 rounded overflow-hidden relative border border-hairline bg-canvas-soft-2"
                        onClick={() => playFromQueue(item.id)}
                      >
                        <img
                          src={item.track.thumbnail}
                          alt={item.track.title}
                          className={`w-full h-full object-cover ${isActive ? '' : 'opacity-90 group-hover:opacity-100'}`}
                        />
                        {isActive && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="flex gap-0.5 items-end h-2.5">
                              {[1, 2, 3].map((i) => (
                                <motion.div
                                  key={i}
                                  animate={{ height: [2, 7, 2] }}
                                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.12 }}
                                  className="w-0.5 bg-canvas"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Info Text */}
                      <div className="flex-1 min-w-0" onClick={() => playFromQueue(item.id)}>
                        <h4 className={`text-xs font-sans font-medium truncate ${
                          isActive ? 'text-link font-semibold' : 'text-ink'
                        }`}>
                          {item.track.title}
                        </h4>
                        <p className={`text-[10px] font-sans truncate mt-0.5 ${
                          isActive ? 'text-body font-medium' : 'text-mute'
                        }`}>
                          {item.track.artist}
                        </p>
                      </div>

                      {/* Delete item from queue */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromQueue(item.id);
                        }}
                        className="p-1 rounded text-mute hover:text-error hover:bg-canvas transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove from queue"
                      >
                        <X size={13} />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ListMusic = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15V6"/><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path d="M12 12H3"/><path d="M16 6H3"/><path d="M12 18H3"/></svg>
);

export default QueueDrawer;