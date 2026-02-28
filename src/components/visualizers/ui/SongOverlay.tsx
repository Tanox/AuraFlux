// File: src/components/visualizers/ui/SongOverlay.tsx | Version: v1.9.76
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { SongInfo } from '@/src/types';

interface Props {
  song: SongInfo | null;
  isVisible: boolean;
  language: string;
  onRetry: () => void;
  onClose: () => void;
  analyser: AnalyserNode | null;
  sensitivity: number;
  showAlbumArt: boolean;
}

const SongOverlay: React.FC<Props> = ({ song, isVisible, onClose }) => {
  if (!song || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="song-overlay"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-24 left-6 z-40 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4 max-w-sm"
      >
        {song.artwork && (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
            <Image 
              src={song.artwork} 
              alt={song.title} 
              fill 
              className="object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold truncate">{song.title}</h3>
          <p className="text-gray-400 text-sm truncate">{song.artist}</p>
          {song.album && <p className="text-gray-500 text-xs truncate">{song.album}</p>}
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white p-2">✕</button>
      </motion.div>
    </AnimatePresence>
  );
};

export default SongOverlay;
