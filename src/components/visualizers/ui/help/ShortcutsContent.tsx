// File: src\components\visualizers\ui\help\ShortcutsContent.tsx | Version: v2.2.23
import React from 'react';

interface Props {
  h: any;
  s: any;
}

export const ShortcutsContent: React.FC<Props> = ({ h, s }) => {
  const shortcuts = [
    { key: 'Space', action: s?.playPause || 'Play/Pause' },
    { key: 'F', action: s?.toggleFullscreen || 'Toggle Fullscreen' },
    { key: 'M', action: s?.toggleMic || 'Toggle Microphone' },
    { key: 'R', action: s?.randomizeColors || 'Randomize Colors' },
    { key: 'H', action: s?.toggleUi || 'Toggle UI' },
    { key: '1-6', action: s?.switchTabs || 'Switch Control Tabs' },
  ];

  return (
    <div className="space-y-4 animate-fade-in-up">
      <h3 className="text-lg font-bold text-white mb-4">{h?.shortcutsTitle || "Keyboard Shortcuts"}</h3>
      <div className="grid grid-cols-1 gap-2">
        {shortcuts.map((item, i) => (
          <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors border border-white/5">
            <span className="text-gray-300 text-sm font-medium">{item.action}</span>
            <kbd className="px-2.5 py-1.5 bg-black/40 text-white/90 rounded-md font-mono text-[10px] font-bold border border-white/10 shadow-sm min-w-[24px] text-center">
              {item.key}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
};

