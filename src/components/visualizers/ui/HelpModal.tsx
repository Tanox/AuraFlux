'use client';
/**
 * File: app/components/visualizers/ui/HelpModal.tsx
 * Version: v1.9.73
 * Author: Sut
 */

import React, { useState } from 'react';
import { useUI } from '@/context/AppContext';
import { GuideContent } from './help/GuideContent';
import { ShortcutsContent } from './help/ShortcutsContent';
import { AboutContent } from './help/AboutContent';

type HelpTab = 'guide' | 'shortcuts' | 'about';

export const HelpModal: React.FC<{ onClose: () => void; initialTab?: HelpTab }> = ({ onClose, initialTab = 'guide' }) => {
    const { t } = useUI();
    const [activeTab, setActiveTab] = useState<HelpTab>(initialTab);
    
    return (
        <div id="help-modal-overlay" className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-lg" onClick={onClose}>
            <div id="help-modal-content" className="w-full max-w-3xl bg-[#0a0a0c]/90 border border-white/10 rounded-3xl shadow-2xl relative flex flex-col h-[80vh] max-h-[600px] animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
                    <h2 className="text-xl font-bold text-white">{t('helpModal.title')}</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-white/40 hover:bg-white/10 hover:text-white"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
                </div>
                <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                    <div className="w-full md:w-48 p-4 border-b md:border-b-0 md:border-r border-white/5 shrink-0">
                        <nav className="flex flex-row md:flex-col gap-2">{(['guide', 'shortcuts', 'about'] as HelpTab[]).map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`w-full px-4 py-3 rounded-lg text-left text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600/20 text-blue-300' : 'text-white/40 hover:bg-white/5'}`}>{t(`helpModal.tabs.${tab}`)}</button>))}</nav>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                        {activeTab === 'guide' && <GuideContent h={{}} guideSteps={[]} />}
                        {activeTab === 'shortcuts' && <ShortcutsContent h={{}} s={{}} />}
                        {activeTab === 'about' && <AboutContent h={{}} t={t} />}
                    </div>
                </div>
            </div>
        </div>
    );
};
