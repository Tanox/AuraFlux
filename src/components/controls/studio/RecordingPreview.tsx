// src/components/controls/studio/RecordingPreview.tsx v2.3.8


import React from 'react';
import { createPortal } from 'react-dom';
import { SongInfo } from '../../../types/index';

interface Props {
  recordedBlob: Blob | null;
  previewUrl: string | null;
  duration: number;
  currentSong: SongInfo | null;
  studio: any;
  common: any;
  onDiscard: () => void;
  onShare: () => void;
  onSave: () => void;
}

const formatSize = (b: number) => b === 0 ? '0 MB' : `${(b / (1024 * 1024)).toFixed(1)} MB`;
const formatDur = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

export const RecordingPreview: React.FC<Props> = ({ 
  recordedBlob, previewUrl, duration, currentSong, studio, common, onDiscard, onShare, onSave 
}) => {
  if (!recordedBlob || !previewUrl) return null;

  return createPortal(
    <div id="studio-preview-portal" className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-6">
      <div id="studio-preview-modal" className="w-full max-w-3xl bg-[#0a0a0c] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-fade-in-up">
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex flex-col">
            <span className="text-xs font-black text-white uppercase tracking-widest">{studio.previewTitle}</span>
            <span className="text-[10px] text-blue-400 font-mono mt-0.5">{currentSong?.title || common?.unknownTrack || "Untitled Creation"}</span>
          </div>
          <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black rounded-lg uppercase tracking-wider">{formatSize(recordedBlob.size)} 鈥?{formatDur(duration)}</div>
        </div>
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          <video src={previewUrl} autoPlay loop controls className="max-h-[60vh] w-full" />
        </div>
        <div className="p-6 flex gap-4 bg-white/[0.01]">
          <button onClick={onDiscard} className="flex-1 py-4 rounded-xl border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest">{studio.discard}</button>
          <button onClick={onShare} className="flex-1 py-4 rounded-xl border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/></svg>
              {studio.share}
          </button>
          <button onClick={onSave} className="flex-1 py-4 rounded-xl bg-white text-black hover:bg-blue-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest shadow-xl shadow-white/5">{studio.save}</button>
        </div>
      </div>
    </div>, document.body
  );
};
