'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useVisuals, useUI } from '@/context/AppContext';
import { VisualizerSettings } from '@/types';
import { useLocalStorage } from '@/hooks/utils/useLocalStorage';
import { APP_VERSION } from '@/constants';

interface SavedPreset { id: number; name: string; data: VisualizerSettings; timestamp: number; }

export const PresetManager: React.FC = () => {
  const { mode, settings, setSettings } = useVisuals();
  const { t, showToast } = useUI();
  const { getStorage, setStorage } = useLocalStorage();

  const [presets, setPresets] = useState<SavedPreset[]>([]);
  const [presetName, setPresetName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      const saved = getStorage<SavedPreset[]>('user_presets', []);
      if (Array.isArray(saved)) setPresets(saved);
  }, [getStorage]);

  const handleExport = () => {
      const exportData = {
          version: APP_VERSION,
          timestamp: Date.now(),
          mode: mode,
          settings: settings
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchorNode = document.createElement('a'); 
      downloadAnchorNode.setAttribute("href", dataStr);
      const dateStr = new Date().toISOString().slice(0,10);
      downloadAnchorNode.setAttribute("download", `aura_${mode}_${dateStr}.json`);
      document.body.appendChild(downloadAnchorNode); 
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      showToast(t?.('config.exported') || "Configuration Exported", 'success');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
          try {
              const raw = JSON.parse(evt.target?.result as string);
              const data = raw.settings || raw;
              if (data && typeof data === 'object' && !Array.isArray(data)) {
                  setSettings(prev => ({ ...prev, ...data }));
                  showToast(t?.('config.importSuccess') || "Configuration imported", 'success');
              } else {
                  throw new Error("Invalid structure");
              }
          } catch (err) {
              showToast(t?.('config.invalidFile') || "Invalid configuration file", 'error');
          }
      };
      reader.readAsText(file);
      e.target.value = ''; 
  };

  const handleSavePreset = () => {
      if (presets.length >= 3) { showToast(t?.('config.limitReached') || "Limit reached", 'error'); return; }
      if (!presetName.trim()) return;
      const newPreset = { id: Date.now(), name: presetName.trim().slice(0, 18), data: { ...settings }, timestamp: Date.now() };
      const newPresets = [...presets, newPreset];
      setPresets(newPresets); setStorage('user_presets', newPresets);
      setPresetName(''); 
      showToast(t?.('config.saved') || "Saved", 'success');
  };

  const handleDeletePreset = (id: number) => {
      if (window.confirm(t?.('config.deleteConfirm') || "Delete?")) {
          const newPresets = presets.filter(p => p.id !== id);
          setPresets(newPresets); setStorage('user_presets', newPresets);
      }
  };

  const subHeaderClass = "text-[9px] font-black text-black/30 dark:text-white/30 uppercase tracking-[0.2em] mb-2 block mt-3 first:mt-0";

  return (
    <div className="flex flex-col h-full space-y-4">
        <div className="grid grid-cols-2 gap-3">
            <button onClick={handleExport} className="py-2.5 bg-black/[0.04] dark:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all border border-black/5 dark:border-white/5">{t?.('config.export')}</button>
            <button onClick={() => fileInputRef.current?.click()} className="py-2.5 bg-black/[0.04] dark:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all border border-black/5 dark:border-white/5">{t?.('config.import')}</button>
            <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />
        </div>

        <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-3">
            <span className={subHeaderClass}>{t?.('config.library') || "PRESET ARCHIVE"} ({presets.length}/3)</span>
            <div className="flex gap-2">
                <input type="text" value={presetName} onChange={(e)=>setPresetName(e.target.value)} placeholder={t?.('config.placeholder')} className="flex-1 bg-black/[0.04] dark:bg-black/40 border border-black/5 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-black dark:text-white placeholder-black/20 dark:placeholder-white/20 outline-none focus:border-blue-500/50" maxLength={18} />
                <button onClick={handleSavePreset} disabled={presets.length>=3 || !presetName.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest disabled:opacity-20 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">{t?.('config.save')}</button>
            </div>
            <div className="space-y-1.5 overflow-y-auto custom-scrollbar max-h-[140px] pr-1">
                {presets.map(p => (
                    <div key={p.id} className="flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-xl px-3 py-2 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all group">
                        <div className="flex flex-col flex-1 cursor-pointer" onClick={() => { setSettings({...settings, ...p.data}); showToast(`${t?.('config.load')}: ${p.name}`, 'success'); }}>
                            <span className="text-[10px] font-black text-black/80 dark:text-white/80 group-hover:text-blue-600 dark:group-hover:text-blue-400 uppercase truncate">{p.name}</span>
                            <span className="text-[8px] font-mono text-black/40 dark:text-white/40">{new Date(p.timestamp).toLocaleDateString()}</span>
                        </div>
                        <button onClick={()=>handleDeletePreset(p.id)} className="p-1.5 rounded-full text-black/30 dark:text-white/30 hover:bg-red-500/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};
