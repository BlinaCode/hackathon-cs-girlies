import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, Compass, CheckCircle } from 'lucide-react';
import { useBreathingTimer, BREATHING_MODES } from '../hooks/useBreathingTimer';
import { useBreathingPresence } from '../hooks/useBreathingPresence';
import { useWellness } from '../context/WellnessContext';
import { OtterMascot } from './OtterMascot';

export function BreathingVisualizer() {
  const participants = useBreathingPresence();

  const {
    modeKey,
    setModeKey,
    mode,
    isActive,
    currentPhase,
    secondsRemaining,
    completedCycles,
    toggleTimer,
    resetTimer
  } = useBreathingTimer('box');

  const { completeBreathingSession, setMascotState, isSkyMode } = useWellness();

  useEffect(() => {
    if (isActive) {
      setMascotState({
        expression: 'breathing',
        speech: `Follow the expanding ocean wave. Breathe in peace, exhale tension.`
      });
    }
  }, [isActive, setMascotState]);

  const handleFinish = () => {
    completeBreathingSession();
    resetTimer();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className={`font-display text-3xl font-bold flex items-center justify-center gap-2 ${isSkyMode ? 'text-bluey-950' : 'text-white'}`}>
          <Compass className={`w-7 h-7 ${isSkyMode ? 'text-bluey-500' : 'text-seafoam-400'}`} />
          Ocean Wave Breathing
        </h2>
        <p className={`text-xs sm:text-sm max-w-xl mx-auto font-semibold ${isSkyMode ? 'text-bluey-700' : 'text-bluey-300'}`}>
          Synchronize your breath with expanding ocean waves to calm your nervous system.
        </p>
      </div>

      {/* People breathing with you */}
      {participants.length > 0 && (
        <div className={`flex items-center justify-center gap-2 text-xs font-bold ${isSkyMode ? 'text-bluey-600' : 'text-bluey-300'}`}>
          <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${isSkyMode ? 'bg-bluey-400' : 'bg-seafoam-400'}`} />
          <span>
            {participants.length === 1
              ? `${participants[0].name} is breathing with you`
              : `${participants[0].name} and ${participants.length - 1} other ${
                  participants.length - 1 === 1 ? 'person' : 'people'
                } are breathing with you`}
          </span>
        </div>
      )}

      {/* Sisu Mascot Speech */}
      <OtterMascot expression={isActive ? 'breathing' : 'caring'} speech={isActive ? 'Breathe with me...' : 'Select your breathing technique below and press Start.'} />

      {/* Technique Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Object.entries(BREATHING_MODES).map(([key, item]) => (
          <button
            key={key}
            onClick={() => setModeKey(key)}
            className={`p-4 rounded-2xl border text-left transition-all shadow-sm ${
              modeKey === key
                ? (isSkyMode ? 'border-bluey-400 bg-white shadow-md shadow-bluey-200 ring-2 ring-bluey-300' : 'border-bluey-500 bg-bluey-800 shadow-md shadow-bluey-900 ring-2 ring-bluey-500')
                : (isSkyMode ? 'border-cream-300 bg-cream-100/60 text-bluey-800 hover:bg-white hover:border-bluey-200' : 'border-bluey-800 bg-bluey-900/50 text-bluey-300 hover:border-bluey-700 hover:bg-bluey-900')
            }`}
          >
            <div className={`font-bold text-sm ${modeKey === key ? (isSkyMode ? 'text-bluey-700' : 'text-white') : (isSkyMode ? 'text-bluey-900' : 'text-bluey-200')}`}>
              {item.name}
            </div>
            <div className={`text-xs mt-1 line-clamp-2 ${modeKey === key ? (isSkyMode ? 'text-bluey-600' : 'text-bluey-300') : (isSkyMode ? 'text-bluey-600/70' : 'text-bluey-400')}`}>
              {item.description}
            </div>
          </button>
        ))}
      </div>

      {/* Main Breathing Circle Display */}
      <div className={`rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col items-center justify-center space-y-8 relative overflow-hidden transition-all ${isSkyMode ? 'glass-card-day' : 'glass-card-night'}`}>
        
        {/* Animated Expanding Ocean Wave Ring */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
          
          {/* Wave Pulse Aura */}
          <div
            className={`absolute inset-3 rounded-full border-2 transition-all duration-1000 ${isActive ? 'animate-ripple' : ''
              } ${isSkyMode ? 'border-bluey-300/40 bg-bluey-200/20' : 'border-bluey-600/40 bg-bluey-500/10'}`}
          />
          
          {/* Phase Expanding Circle - Translucent Bubble Look */}
          <div
            className={`w-52 h-52 sm:w-64 sm:h-64 rounded-full border flex flex-col items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-1000 ${
              currentPhase.name === 'Inhale'
                ? (isSkyMode
                  ? 'scale-110 bg-white/40 border-white/60 shadow-[inset_0_4px_16px_rgba(255,255,255,0.7)] ring-4 ring-white/30'
                  : 'scale-110 bg-bluey-400/20 border-bluey-300/60 shadow-[inset_0_2px_14px_rgba(255,255,255,0.3)] ring-4 ring-bluey-400/20')
                : currentPhase.name === 'Exhale'
                  ? (isSkyMode
                    ? 'scale-90 bg-bluey-200/40 border-bluey-300/40 shadow-[inset_0_2px_8px_rgba(255,255,255,0.4)]'
                    : 'scale-90 bg-bluey-950/40 border-bluey-600/30 shadow-[inset_0_2px_8px_rgba(255,255,255,0.1)]')
                  : (isSkyMode
                    ? 'scale-100 bg-cream-100/50 border-cream-300/60 shadow-[inset_0_2px_12px_rgba(255,255,255,0.5)]'
                    : 'scale-100 bg-bluey-800/40 border-bluey-500/50 shadow-[inset_0_2px_12px_rgba(255,255,255,0.2)]')
            }`}
          >
            <span className={`text-xs uppercase font-bold tracking-widest mb-1 ${isSkyMode ? 'text-bluey-600' : 'text-bluey-300'}`}>
              {currentPhase.name}
            </span>
            <span className={`font-display text-5xl sm:text-6xl font-bold ${isSkyMode ? 'text-bluey-950' : 'text-slate-100'}`}>
              {secondsRemaining}s
            </span>
            <span className={`text-xs mt-[13px] font-bold ${isSkyMode ? 'text-bluey-500' : 'text-slate-400'}`}>
              Cycle {completedCycles}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 z-10">
          <button
            onClick={toggleTimer}
            className={`px-6 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-xl flex items-center gap-2 ${
              isSkyMode
                ? 'bg-gradient-to-r from-bluey-500 to-bluey-400 text-white shadow-bluey-400/30 hover:shadow-bluey-400/50 hover:-translate-y-0.5'
                : 'bg-gradient-to-r from-bluey-600 to-bluey-500 text-white shadow-bluey-900/50 hover:shadow-bluey-900/70 hover:-translate-y-0.5'
            }`}
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            {isActive ? 'Pause' : 'Start Practice'}
          </button>

          <button
            onClick={resetTimer}
            className={`p-3.5 rounded-2xl border font-bold transition-colors ${
              isSkyMode ? 'bg-white border-bluey-300 text-bluey-500 hover:text-bluey-700 hover:border-bluey-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {completedCycles > 0 && (
            <button
              onClick={handleFinish}
              className={`px-4 py-3.5 rounded-2xl border font-bold text-xs transition-all flex items-center gap-1.5 ${
                isSkyMode ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
              }`}
            >
              <CheckCircle className={`w-4 h-4 ${isSkyMode ? 'text-emerald-500' : 'text-emerald-400'}`} />
              Complete Practice
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
