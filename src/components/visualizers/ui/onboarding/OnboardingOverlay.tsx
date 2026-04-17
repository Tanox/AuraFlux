'use client';
// File: src\components\visualizers\ui\onboarding\OnboardingOverlay.tsx | Version: v2.2.23
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '@/types';
import { useTranslation } from 'react-i18next';

interface Props {
  language: Language;
  setLanguage: (l: Language) => void;
  onComplete: () => void;
}

export const OnboardingOverlay: React.FC<Props> = ({ language, setLanguage, onComplete }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: t('onboarding.steps.0.title', 'Welcome to Aura Flux'),
      description: t('onboarding.steps.0.description', 'Experience your music like never before with AI-powered 3D visualizations.'),
      icon: '🎵'
    },
    {
      title: t('onboarding.steps.1.title', 'Interactive Controls'),
      description: t('onboarding.steps.1.description', 'Use gestures or the control panel to customize colors, sensitivity, and modes.'),
      icon: '🎮'
    },
    {
      title: t('onboarding.steps.2.title', 'AI Song Recognition'),
      description: t('onboarding.steps.2.description', 'Our AI can identify songs from your microphone and provide real-time lyrics.'),
      icon: '🧠'
    }
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div id="onboarding-overlay" className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          className="max-w-md w-full text-center text-white"
        >
          <div className="text-6xl mb-6">{steps[step].icon}</div>
          <h2 className="text-3xl font-bold mb-4">{steps[step].title}</h2>
          <p className="text-gray-400 text-lg mb-12">{steps[step].description}</p>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={nextStep}
              className="w-full py-4 bg-white text-black rounded-2xl font-bold text-lg hover:bg-gray-200 transition-colors"
            >
              {step === steps.length - 1 ? t('onboarding.getStarted', 'Get Started') : t('onboarding.next', 'Next')}
            </button>
            
            {step === 0 && (
              <div className="flex justify-center gap-2 mt-4">
                <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded ${language === 'en' ? 'bg-white/20' : ''}`}>{t('onboarding.languages.en', 'EN')}</button>
                <button onClick={() => setLanguage('zh')} className={`px-3 py-1 rounded ${language === 'zh' ? 'bg-white/20' : ''}`}>{t('onboarding.languages.zh', '中文')}</button>
              </div>
            )}
          </div>
          
          <div className="flex justify-center gap-2 mt-12">
            {steps.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-white' : 'bg-white/20'}`} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

