// File: src/components/visualizers/ui/help/AboutContent.tsx | Version: v1.9.80
import React from 'react';

interface Props {
  h: any;
  t: any;
}

export const AboutContent: React.FC<Props> = ({ h, t }) => {
  return (
    <div className="space-y-6 text-sm text-gray-300 animate-fade-in-up">
      <div>
        <h3 className="text-lg font-bold text-white mb-2">{h?.aboutTitle || "About Aura Flux"}</h3>
        <p className="leading-relaxed text-white/70">
          {h?.aboutDesc || "Aura Flux is an interactive 3D music visualizer. It uses WebGL and the Web Audio API to create stunning, real-time 3D visualizations of your music."}
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-bold text-white mb-4">{h?.techStackTitle || "Technology"}</h3>
        <div className="grid grid-cols-2 gap-3">
          {['Next.js 15', 'React 19', 'Three.js (R3F)', 'Tailwind CSS', 'Gemini API', 'Web Audio API'].map((tech) => (
            <div key={tech} className="bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs font-mono text-blue-300 text-center">
              {tech}
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-white/5 flex flex-col items-center text-center gap-2">
        <p className="text-xs text-white/30 uppercase tracking-widest font-bold">Version 1.9.76</p>
        <p className="text-[10px] text-white/20">
          Designed & Built by Sut
        </p>
      </div>
    </div>
  );
};
