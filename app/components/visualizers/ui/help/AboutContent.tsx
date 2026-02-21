/**
 * File: app/components/visualizers/ui/help/AboutContent.tsx
 * Version: v1.9.73
 * Author: Sut
 */

import React from 'react';
import { APP_VERSION } from '../../../../constants/index.ts';

interface AboutContentProps { 
  h: any; // helpModal translations
  t: any; // full translations object
}

const TechBadge = ({ label, colorClass }: { label: string, colorClass: string }) => (
  <div className={`px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2 group hover:bg-white/10 transition-colors`}>
    <div className={`w-1.5 h-1.5 rounded-full ${colorClass}`} />
    <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{label}</span>
  </div>
);

export const AboutContent: React.FC<AboutContentProps> = ({ h, t }) => {
  const tech = t?.about?.tech || {};
  
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h4 className="text-sm font-black text-blue-400 uppercase tracking-[0.2em] px-1">
          {h?.projectInfoTitle || "Our Vision"}
        </h4>
        <p className="text-sm text-white/70 leading-relaxed font-medium bg-white/[0.02] p-4 rounded-2xl border border-white/5">
          {h?.aboutDescription || "Aura Flux allows you to see the invisible."}
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-black text-purple-400 uppercase tracking-[0.2em] px-1">
          {h?.techStackTitle || "Core Technology"}
        </h4>
        <div className="flex flex-wrap gap-2">
          <TechBadge label="React 19" colorClass="bg-blue-400" />
          <TechBadge label="Three.js" colorClass="bg-white" />
          <TechBadge label="WebGL" colorClass="bg-red-400" />
          <TechBadge label="Google Gemini 3.0" colorClass="bg-purple-400" />
          <TechBadge label="Web Audio API" colorClass="bg-yellow-400" />
          <TechBadge label="Tailwind CSS" colorClass="bg-cyan-400" />
        </div>
      </div>

      <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <div>
          <div className="text-xs font-bold text-white/40">VERSION</div>
          <div className="text-sm font-mono text-white/80">{APP_VERSION}</div>
        </div>
        <a href="https://github.com/sutchan/aura-flux" target="_blank" rel="noopener noreferrer" className="px-5 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-all flex items-center gap-2 border border-white/5 hover:border-white/20">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          GitHub
        </a>
      </div>
    </div>
  );
};