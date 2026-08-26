import React from 'react';
import { Command } from 'cmdk';
import { Dialog } from '@base-ui/react/dialog';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  VolumeX,
  Heart,
  Search,
  Sun,
  Moon,
  Keyboard,
  CornerDownLeft,
} from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { useLibraryStore } from '../../store/libraryStore';
import { useUiStore } from '../../store/uiStore';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

/**
 * Command palette — opened with `?`.
 * cmdk (MIT, https://github.com/dip/cmdk) provides type-ahead filtering,
 * arrow-key navigation and list semantics; Base UI Dialog provides the
 * modal shell (focus trap, aria-modal, Escape).
 */

const kbdClass =
  'ml-auto font-mono text-[9px] text-mute border border-hairline rounded-sm px-1 py-0.5 tabular-nums';

const itemClass =
  'flex items-center gap-2.5 px-3 py-2 font-sans text-xs text-ink cursor-pointer outline-none data-[selected=true]:bg-canvas-soft-2 rounded-md mx-1';

const groupLabelClass =
  'px-3 pt-2.5 pb-1 font-mono text-[9px] text-mute uppercase tracking-wider';

const CommandPalette: React.FC = () => {
  const { isKeyboardHelpOpen, setKeyboardHelpOpen, theme, toggleTheme } = useUiStore();
  const { isPlaying, play, pause, next, previous, toggleMute, currentTrack } = usePlayerStore();
  const { toggleLike } = useLibraryStore();

  // Global keyboard shortcuts (space/N/P/M/F/L/?/arrows) — mounted here so
  // they live in a persistent island across view transitions.
  useKeyboardShortcuts();

  const run = (fn: () => void) => {
    fn();
    setKeyboardHelpOpen(false);
  };

  const goTo = (path: string) => {
    setKeyboardHelpOpen(false);
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    window.location.href = `${base}${path}`;
  };

  return (
    <Dialog.Root open={isKeyboardHelpOpen} onOpenChange={setKeyboardHelpOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[200] bg-ink/20 backdrop-blur-xs" />
        <Dialog.Popup aria-modal="true" className="fixed top-[12%] left-1/2 -translate-x-1/2 z-[210] w-[calc(100%-2rem)] max-w-md outline-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <Command className="bg-canvas border border-hairline rounded-lg modal-shadow-lvl5 overflow-hidden select-none">
              <div className="flex items-center gap-2.5 px-3.5 h-11 border-b border-hairline">
                <Keyboard size={14} className="text-mute flex-shrink-0" />
                <Command.Input
                  autoFocus
                  placeholder="Type a command or search…"
                  className="flex-1 bg-transparent border-none outline-none text-ink font-sans text-sm placeholder:text-mute"
                />
              </div>

              <Command.List className="max-h-80 overflow-y-auto custom-scrollbar py-1.5">
                <Command.Empty className="px-3 py-6 text-center font-sans text-xs text-mute">
                  No matching command.
                </Command.Empty>

                <Command.Group heading="Playback" className={groupLabelClass}>
                  <Command.Item
                    onSelect={() => run(() => currentTrack && (isPlaying ? pause() : play()))}
                    className={itemClass}
                  >
                    {isPlaying ? <Pause size={13} className="text-mute" /> : <Play size={13} className="text-mute" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                    <kbd className={kbdClass}>Space</kbd>
                  </Command.Item>
                  <Command.Item onSelect={() => run(next)} className={itemClass}>
                    <SkipForward size={13} className="text-mute" />
                    <span>Next track</span>
                    <kbd className={kbdClass}>N</kbd>
                  </Command.Item>
                  <Command.Item onSelect={() => run(previous)} className={itemClass}>
                    <SkipBack size={13} className="text-mute" />
                    <span>Previous track</span>
                    <kbd className={kbdClass}>P</kbd>
                  </Command.Item>
                  <Command.Item onSelect={() => run(toggleMute)} className={itemClass}>
                    <VolumeX size={13} className="text-mute" />
                    <span>Mute / unmute</span>
                    <kbd className={kbdClass}>M</kbd>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => run(() => currentTrack && toggleLike(currentTrack))}
                    className={itemClass}
                  >
                    <Heart size={13} className="text-mute" />
                    <span>Like current track</span>
                    <kbd className={kbdClass}>F</kbd>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Navigate" className={groupLabelClass}>
                  <Command.Item onSelect={() => goTo('/search')} className={itemClass}>
                    <Search size={13} className="text-mute" />
                    <span>Search music</span>
                    <kbd className={kbdClass}>/</kbd>
                  </Command.Item>
                  <Command.Item onSelect={() => goTo('/library')} className={itemClass}>
                    <Heart size={13} className="text-mute" />
                    <span>Open library</span>
                  </Command.Item>
                  <Command.Item onSelect={() => run(toggleTheme)} className={itemClass}>
                    {theme === 'dark' ? <Sun size={13} className="text-mute" /> : <Moon size={13} className="text-mute" />}
                    <span>Toggle {theme === 'dark' ? 'light' : 'dark'} mode</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Seek" className={groupLabelClass}>
                  <Command.Item
                    onSelect={() => run(() => currentTrack && usePlayerStore.getState().seek(Math.max(0, usePlayerStore.getState().progress - 10)))}
                    className={itemClass}
                  >
                    <CornerDownLeft size={13} className="text-mute" />
                    <span>Seek back 10s</span>
                    <kbd className={kbdClass}>←</kbd>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => run(() => currentTrack && usePlayerStore.getState().seek(Math.min(usePlayerStore.getState().duration, usePlayerStore.getState().progress + 10)))}
                    className={itemClass}
                  >
                    <CornerDownLeft size={13} className="text-mute rotate-180" />
                    <span>Seek forward 10s</span>
                    <kbd className={kbdClass}>→</kbd>
                  </Command.Item>
                </Command.Group>
              </Command.List>

              <div className="flex items-center gap-3 px-3.5 h-8 border-t border-hairline">
                <span className="font-mono text-[9px] text-mute uppercase tracking-wider">
                  {isPlaying ? 'Now playing' : 'Paused'}
                </span>
                <span className="flex-1" />
                <span className="font-mono text-[9px] text-mute flex items-center gap-1">
                  <kbd className={kbdClass}>↑↓</kbd> navigate
                </span>
                <span className="font-mono text-[9px] text-mute flex items-center gap-1">
                  <kbd className={kbdClass}>↵</kbd> select
                </span>
                <span className="font-mono text-[9px] text-mute flex items-center gap-1">
                  <kbd className={kbdClass}>esc</kbd> close
                </span>
              </div>
            </Command>
          </motion.div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CommandPalette;