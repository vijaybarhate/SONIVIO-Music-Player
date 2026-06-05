import React, { useEffect, useRef } from 'react';
import { X, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { motion, AnimatePresence } from 'framer-motion';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const QueueDrawer: React.FC<QueueDrawerProps> = ({ isOpen, onClose }) => {
  const { queue, currentQueueItem, playFromQueue, removeFromQueue, clearQueue, reorderQueue } = usePlayerStore();
  const activeItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isOpen, currentQueueItem]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-surface border-l border-stroke z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-stroke flex items-center justify-between bg-surface-elevated">
              <div>
                <h2 className="text-2xl font-sans font-bold text-text-primary">Up Next</h2>
                <p className="text-xs font-sans text-text-muted mt-1">{queue.length} tracks</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearQueue}
                  className="p-2 rounded-full text-text-muted hover:bg-red-500/10 hover:text-red-400 transition-all"
                  title="Clear Queue"
                >
                  <Trash2 size={20} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full text-text-muted hover:bg-surface transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
              {queue.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mb-4">
                    <ListMusic size={24} className="text-text-muted" />
                  </div>
                  <h3 className="font-sans font-bold text-text-primary mb-2">Queue is empty</h3>
                  <p className="font-sans text-sm text-text-muted">Add some tracks to get started.</p>
                </div>
              ) : (
                queue.map((item, index) => {
                  const isActive = currentQueueItem?.id === item.id;
                  
                  return (
                    <motion.div
                      key={item.id}
                      ref={isActive ? activeItemRef : null}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.02, 0.2) }}
                      className={`
                        group flex items-center gap-3 p-2 rounded-xl transition-all cursor-pointer
                        ${isActive ? 'bg-surface-elevated shadow-md' : 'hover:bg-surface-elevated'}
                      `}
                    >
                      <div className="flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity w-6">
                        <button 
                          onClick={(e) => { e.stopPropagation(); if (index > 0) reorderQueue(index, index - 1); }}
                          disabled={index === 0}
                          className="text-text-muted hover:text-text-primary disabled:opacity-30 disabled:hover:text-text-muted"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); if (index < queue.length - 1) reorderQueue(index, index + 1); }}
                          disabled={index === queue.length - 1}
                          className="text-text-muted hover:text-text-primary disabled:opacity-30 disabled:hover:text-text-muted"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>

                      <div 
                        className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden relative"
                        onClick={() => playFromQueue(item.id)}
                      >
                        <img
                          src={item.track.thumbnail}
                          alt={item.track.title}
                          className={`w-full h-full object-cover ${isActive ? '' : 'opacity-80 group-hover:opacity-100'}`}
                        />
                        {isActive && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="flex gap-0.5 items-end h-3">
                              {[1, 2, 3].map((i) => (
                                <motion.div
                                  key={i}
                                  animate={{ height: [3, 8, 3] }}
                                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.12 }}
                                  className="w-0.5 bg-accent-start"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0" onClick={() => playFromQueue(item.id)}>
                        <h4 className={`text-sm font-sans font-medium truncate ${
                          isActive ? 'text-accent-start' : 'text-text-primary group-hover:text-accent-start'
                        }`}>
                          {item.track.title}
                        </h4>
                        <p className={`text-xs font-sans truncate ${
                          isActive ? 'text-text-primary' : 'text-text-muted'
                        }`}>
                          {item.track.artist}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromQueue(item.id);
                        }}
                        className="p-2 rounded-full text-text-muted hover:bg-red-500/10 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X size={16} />
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

// Helper ListMusic icon component since it wasn't imported from lucide
const ListMusic = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15V6"/><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path d="M12 12H3"/><path d="M16 6H3"/><path d="M12 18H3"/></svg>
);

export default QueueDrawer;