// src/components/controls/studio/StudioRecorder.tsx v2.3.10
import React from 'react';
import { BentoCard } from '@/components/visualizers/ui/layout/BentoCard';
import { ArmedVisualizer } from './ArmedVisualizer';

const formatSize = (b: number) => b === 0 ? '0 MB' : `${(b / (1024 * 1024)).toFixed(1)} MB`;
const formatDur = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

interface StudioRecorderProps {
    isRecording: boolean;
    isProcessing: boolean;
    isFadingOut: boolean;
    isArmed: boolean;
    setIsArmed: (val: boolean) => void;
    syncStart: boolean;
    duration: number;
    size: number;
    stopRecording: () => void;
    triggerRecording: () => void;
    analyser: AnalyserNode | null;
    countdownVal: number;
    studio: any;
    t: any;
}

export const StudioRecorder: React.FC<StudioRecorderProps> = ({
    isRecording,
    isProcessing,
    isFadingOut,
    isArmed,
    setIsArmed,
    syncStart,
    duration,
    size,
    stopRecording,
    triggerRecording,
    analyser,
    countdownVal,
    studio,
    t
}) => {
    return (
        <BentoCard id="panel-studio-recorder" className="lg:col-span-5 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
            <div className={`absolute inset-0 transition-colors duration-1000 ${isRecording ? 'bg-red-500/5' : isArmed ? 'bg-blue-500/5' : 'bg-transparent'}`} />
            <div className="relative z-10 flex flex-col items-center">
                <div className="relative group mb-6 flex items-center justify-center w-32 h-32">
                    {isArmed && <ArmedVisualizer analyser={analyser} />}
                    {isRecording && <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-20 scale-150" />}
                    <button onClick={isRecording ? stopRecording : () => isArmed ? setIsArmed(false) : syncStart ? setIsArmed(true) : triggerRecording()} disabled={isProcessing} className={`w-24 h-24 rounded-full border-4 transition-all flex items-center justify-center relative z-10 duration-500 ${isRecording ? 'bg-red-900/20 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)]' : isArmed ? 'bg-blue-900/20 border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.4)] animate-pulse' : 'bg-black/10 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-red-500/50 hover:scale-105'}`}>
                        {isProcessing ? <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" /> : <div className={`transition-all duration-300 ${isRecording ? 'w-6 h-6 bg-red-500 rounded-lg animate-pulse' : isArmed ? 'w-8 h-8 bg-blue-500 rounded-full animate-pulse' : 'w-12 h-12 bg-red-600 rounded-full group-hover:scale-110 shadow-lg'}`} />}
                    </button>
                </div>
                <div className="text-center space-y-1 h-14">
                    <div className={`text-2xl font-black uppercase tracking-[0.2em] transition-all duration-300 ${isRecording ? 'text-red-500' : 'text-black dark:text-white'}`}>{isRecording ? formatDur(duration) : isFadingOut ? studio.stopping : isProcessing ? studio.processing : isArmed ? studio.arming : studio.start}</div>
                    {isRecording && <div className="text-[10px] font-mono text-black/40 dark:text-white/40 uppercase tracking-widest animate-pulse flex items-center justify-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full" />{formatSize(size)} {studio.processing || "ENCODING"}</div>}
                </div>
            </div>
            {countdownVal > 0 && <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm"><span className="text-8xl font-black text-white animate-ping">{countdownVal}</span><span className="text-xs font-black text-white/40 uppercase tracking-[0.4em] mt-8">{t?.toasts?.audioNotReady || "Initializing..."}</span></div>}
        </BentoCard>
    );
};
