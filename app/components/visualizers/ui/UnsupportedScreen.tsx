// File: app/components/visualizers/ui/UnsupportedScreen.tsx | Version: v1.9.72
import React from 'react';
import { useUI } from '../../../AppContext.tsx';

export const UnsupportedScreen: React.FC = () => {
    const { t } = useUI();
    return (
        <div id="unsupported-screen" className="min-h-[100dvh] bg-black flex items-center justify-center p-6 text-center">
            <div className="max-w-md space-y-6 animate-fade-in-up">
                {/* @fix: Use correct localization keys */}
                <h1 className="text-4xl font-black text-red-400">{t?.errors?.unsupportedTitle || 'Browser Not Supported'}</h1>
                <p className="text-gray-300 leading-relaxed">
                    {t?.errors?.unsupportedText || 'Aura Flux requires modern browser features (like microphone access) that are not available. Please update to a recent version of Chrome, Firefox, or Safari.'}
                </p>
            </div>
        </div>
    );
};