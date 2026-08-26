import React from 'react';
import { ContextMenu } from '@base-ui/react/context-menu';
import { Menu } from '@base-ui/react/menu';
import {
  Play,
  ListMusic,
  PlusSquare,
  Heart,
  Share2,
  ArrowUpRight,
  MoreVertical,
} from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { useQueueStore } from '../../store/queueStore';
import { useLibraryStore } from '../../store/libraryStore';
import { useUiStore } from '../../store/uiStore';
import type { Track } from '../../types';

/**
 * Track context menu + more-button menu.
 * Base UI primitives (MIT, https://base-ui.com/react/components/context-menu)
 * provide arrow-key navigation, focus management, Escape-to-close, and
 * pointer positioning. Brand chrome applied via tokens.
 */

const popupClass =
  'min-w-48 bg-canvas border border-hairline rounded-md py-1 modal-shadow-lvl5 select-none outline-none origin-[var(--transform-origin)] transition-[scale,opacity] duration-100 ease-out data-starting-style:scale-[0.98] data-starting-style:opacity-0 data-ending-style:scale-[0.98] data-ending-style:opacity-0';

const labelClass =
  'px-3 py-1 font-mono text-[9px] text-mute uppercase tracking-wider';

interface TrackMenuContentProps {
  track: Track;
  Item: React.ComponentType<any>;
  onClose?: () => void;
}

const TrackMenuContent: React.FC<TrackMenuContentProps> = ({ track, Item, onClose }) => {
  const { play } = usePlayerStore();
  const { playNext, addToQueue } = useQueueStore();
  const { likedSongs, toggleLike, playlists, addTrackToPlaylist } = useLibraryStore();
  const { showToast } = useUiStore();

  const isLiked = likedSongs.some((t) => t.id === track.id);

  const run = (fn: () => void) => {
    fn();
    onClose?.();
  };

  return (
    <>
      <div className="px-3 py-1.5 border-b border-hairline mb-1">
        <p className="font-sans text-[10px] font-semibold text-mute truncate">{track.title}</p>
      </div>

      <Item
        onClick={() =>
          run(() => {
            play(track);
            showToast(`Playing "${track.title}"`);
          })
        }
      >
        <Play size={13} className="text-mute" />
        <span>Play Track</span>
      </Item>
      <Item
        onClick={() =>
          run(() => {
            playNext(track);
            showToast('Added to top of queue');
          })
        }
      >
        <ArrowUpRight size={13} className="text-mute" />
        <span>Play Next</span>
      </Item>
      <Item
        onClick={() =>
          run(() => {
            addToQueue(track);
            showToast('Added to play queue');
          })
        }
      >
        <ListMusic size={13} className="text-mute" />
        <span>Add to Queue</span>
      </Item>
      <Item
        onClick={() =>
          run(() => {
            toggleLike(track);
            showToast(isLiked ? 'Removed from favorites' : 'Added to favorites');
          })
        }
      >
        <Heart size={13} className={isLiked ? 'text-link fill-current' : 'text-mute'} />
        <span>{isLiked ? 'Remove from Favorites' : 'Add to Favorites'}</span>
      </Item>

      {playlists.length > 0 && (
        <>
          <div className="border-t border-hairline my-1" />
          <div className={labelClass}>Add to Playlist</div>
          {playlists.slice(0, 5).map((p) => (
            <Item
              key={p.id}
              onClick={() =>
                run(() => {
                  addTrackToPlaylist(p.id, track);
                  showToast(`Added to "${p.name}"`);
                })
              }
            >
              <PlusSquare size={12} className="text-mute" />
              <span className="truncate flex-1">{p.name}</span>
            </Item>
          ))}
        </>
      )}

      <div className="border-t border-hairline my-1" />
      <Item
        onClick={() =>
          run(() => {
            if (typeof navigator !== 'undefined' && navigator.clipboard) {
              navigator.clipboard.writeText(`https://youtube.com/watch?v=${track.id}`);
              showToast('Track URL copied to clipboard', 'success');
            }
          })
        }
      >
        <Share2 size={13} className="text-mute" />
        <span>Share Link</span>
      </Item>
    </>
  );
};

interface TrackContextMenuProps {
  track: Track;
  children: React.ReactNode;
  className?: string;
}

/** Right-click / long-press context menu — wraps the card content. */
export const TrackContextMenu: React.FC<TrackContextMenuProps> = ({ track, children, className = '' }) => (
  <ContextMenu.Root>
    <ContextMenu.Trigger className={`block ${className}`}>{children}</ContextMenu.Trigger>
    <ContextMenu.Portal>
      <ContextMenu.Positioner className="outline-none" align="start" sideOffset={4}>
        <ContextMenu.Popup className={popupClass}>
          <TrackMenuContent track={track} Item={ContextMenu.Item} />
        </ContextMenu.Popup>
      </ContextMenu.Positioner>
    </ContextMenu.Portal>
  </ContextMenu.Root>
);

interface TrackMenuButtonProps {
  track: Track;
  className?: string;
  ariaLabel?: string;
}

/** Visible more-button menu — supplements the context menu (Base UI guidance). */
export const TrackMenuButton: React.FC<TrackMenuButtonProps> = ({
  track,
  className = '',
  ariaLabel = 'More options',
}) => (
  <Menu.Root>
    <Menu.Trigger
      aria-label={ariaLabel}
      className={`p-1.5 text-mute hover:text-ink hover:bg-canvas rounded transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong ${className}`}
    >
      <MoreVertical size={13} />
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner className="outline-none" align="end" sideOffset={6}>
        <Menu.Popup className={popupClass}>
          <TrackMenuContent track={track} Item={Menu.Item} />
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
);

export default TrackContextMenu;