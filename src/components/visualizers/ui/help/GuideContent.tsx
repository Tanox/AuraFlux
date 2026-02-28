// File: src/components/visualizers/ui/help/GuideContent.tsx | Version: v1.9.76
import React from 'react';

interface Props {
  h: any;
  guideSteps: string[];
}

export const GuideContent: React.FC<Props> = ({ h, guideSteps }) => {
  return (
    <div className="space-y-6 text-sm text-gray-300 animate-fade-in-up">
      <div>
        <h3 className="text-lg font-bold text-white mb-2">{h?.introTitle || "Welcome"}</h3>
        <p className="leading-relaxed text-white/70">
          {h?.intro || "Aura Flux is an interactive 3D music visualizer. To begin, you can either allow microphone access to visualize the audio around you, or upload your own audio files."}
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-bold text-white mb-4">{h?.howItWorksTitle || "How It Works"}</h3>
        <div className="space-y-4">
          {guideSteps && guideSteps.map((step, index) => (
            <div key={index} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold border border-blue-500/30">
                {index + 1}
              </div>
              <p className="text-white/80 pt-1">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
