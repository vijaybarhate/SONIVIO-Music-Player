import React, { useEffect, useRef } from 'react';
import { X, Trash2 } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { motion, AnimatePresence } from 'framer-motion';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const QueueDrawer: React.FC<QueueDrawerProps> = ({ isOpen, onClose }) => {
  const { queue, currentQueueItem, playFromQueue, removeFromQueue, clearQueue, currentTrack } = usePlayerStore();
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
            className="fixed inset-0 bg-black/70 z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-bg border-l border-border-hard z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-border-hard flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-display uppercase tracking-tight">System_Queue</h2>
                <p className="text-[10px] font-mono text-brand mt-1 uppercase tracking-widest">Active_Entries: {queue.length}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearQueue}
                  className="p-3 text-text-sub hover:bg-red-600 hover:text-white transition-all border border-transparent hover:border-black"
                  title="PURGE_QUEUE"
                >
                  <Trash2 size={20} />
                </button>
                <button
                  onClick={onClose}
                  className="p-3 text-text-sub hover:bg-white hover:text-black transition-all border border-transparent hover:border-black"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-0.5">
              {queue.length === 0 ? (
                <div className="flex flex-col items-start py-20 px-4">
                  <p className="font-mono text-text-sub uppercase tracking-widest text-sm">ARCHIVE_EMPTY</p>
                </div>
              ) : (
                queue.map((item, index) => (
                  <motion.div
                    key={item.id}
                    ref={currentQueueItem?.id === item.id ? activeItemRef : null}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => playFromQueue(item.id)}
                    className={`
                      group flex items-center gap-4 p-3 border border-transparent transition-all cursor-pointer
                      ${currentQueueItem?.id === item.id ? 'bg-brand text-black font-bold' : 'hover:border-border-hard'}
                    `}
                  >
                    <span className={`text-[10px] font-mono w-6 text-center tabular-nums ${
                      currentQueueItem?.id === item.id ? 'text-black' : 'text-text-sub'
                    }`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="w-10 h-10 flex-shrink-0 border border-black/20 overflow-hidden">
                      <img
                        src={item.track.thumbnail}
                        alt={item.track.title}
                        className={`w-full h-full object-cover ${currentQueueItem?.id === item.id ? '' : 'grayscale group-hover:grayscale-0'}`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-[11px] font-mono uppercase truncate tracking-tight ${
                          currentQueueItem?.id === item.id ? 'text-black font-bold' : 'text-text'
                        }`}>
                          {item.track.title}
                        </h4>
                        {currentQueueItem?.id === item.id && (
                          <span className="flex-shrink-0 w-2 h-2 bg-black animate-pulse" />
                        )}
                      </div>
                      <p className={`text-[9px] font-mono uppercase tracking-widest truncate ${
                        currentQueueItem?.id === item.id ? 'text-black/70' : 'text-text-sub'
                      }`}>
                        {item.track.artist}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromQueue(item.id);
                      }}
                      className={`p-1 transition-all ${
                        currentQueueItem?.id === item.id ? 'text-black hover:bg-black/10' : 'text-text-sub hover:text-white opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Now Playing Footer */}
            {currentTrack && (
              <div className="p-8 border-t border-border-hard bg-bg-light relative overflow-hidden">
                <div className="absolute top-0 right-4 text-[40px] font-display text-white/[0.03] pointer-events-none select-none leading-none">
                  MONITOR_01
                </div>
                <p className="text-[10px] font-mono text-brand uppercase tracking-[0.3em] mb-4">
                  Now_Playing
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 border border-border-hard">
                    <img
                      src={currentTrack.thumbnail}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-display uppercase tracking-tight text-brand truncate">{currentTrack.title}</h4>
                    <p className="text-[10px] font-mono text-text-sub uppercase tracking-widest truncate mt-1">{currentTrack.artist}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QueueDrawer;