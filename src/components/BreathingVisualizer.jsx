import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, Compass, CheckCircle } from 'lucide-react';
import { useBreathingTimer, BREATHING_MODES } from '../hooks/useBreathingTimer';
import { useWellness } from '../context/WellnessContext';
import { OtterMascot } from './OtterMascot';

export function BreathingVisualizer() {
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

  const { completeBreathingSession, setMascotState } = useWellness();

  // Update mascot when breathing starts
  useEffect(() => {
    if (isActive) {
      setMascotState({
        expression: 'breathing',
        speech: `Follow the expanding ocean wave. Breathe in peace, exhale tension.`
      });
    }
  }, [isActive, setMascotState]);

  // Complete session trigger when reaching 3 cycles
  const handleFinish = () => {
    completeBreathingSession();
    resetTimer();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl font-bold text-slate-100 flex items-center justify-center gap-2">
          <Compass className="w-7 h-7 text-seafoam-400" />
          Interactive Ocean Wave Breathing
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Synchronize your breath with expanding ocean waves to calm your nervous system.
        </p>
      </div>

      {/* Sisu Mascot Speech */}
      <OtterMascot expression={isActive ? 'breathing' : 'caring'} speech={isActive ? 'Breathe with me...' : 'Select your breathing technique below and press Start.'} />

      {/* Technique Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Object.entries(BREATHING_MODES).map(([key, item]) => (
          <button
            key={key}
            onClick={() => setModeKey(key)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              modeKey === key
                ? 'border-seafoam-500 bg-seafoam-500/10 text-slate-100 ring-2 ring-seafoam-500/30'
                : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:bg-slate-800/50'
            }`}
          >
            <div className="font-semibold text-sm text-seafoam-400">{item.name}</div>
            <div className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</div>
          </button>
        ))}
      </div>

      {/* Main Breathing Circle Display */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col items-center justify-center space-y-8 backdrop-blur-md relative overflow-hidden">
        
        {/* Animated Expanding Ocean Wave Ring */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
          
          {/* Wave Pulse Aura */}
          <div
            className={`absolute inset-3 rounded-full border-2 border-seafoam-400/40 bg-seafoam-500/10 transition-all duration-1000 ${
              isActive ? 'animate-ripple' : ''
            }`}
          />
          
          {/* Phase Expanding Circle */}
          <div
            className={`w-52 h-52 sm:w-64 sm:h-64 rounded-full border border-seafoam-400 flex flex-col items-center justify-center shadow-2xl transition-all duration-1000 ${
              currentPhase.name === 'Inhale'
                ? 'scale-110 bg-seafoam-500/80 border-seafoam-300 shadow-seafoam-500/50'
                : currentPhase.name === 'Exhale'
                ? 'scale-90 bg-ocean-950/80 border-teal-500/40'
                : 'scale-100 bg-teal-500/80 border-teal-400'
            }`}
          >
            <span className="text-xs uppercase font-bold tracking-widest text-seafoam-300 mb-1">
              {currentPhase.name}
            </span>
            <span className="font-display text-5xl sm:text-6xl font-bold text-slate-100">
              {secondsRemaining}s
            </span>
            <span className="text-xs text-slate-400 mt-[13px]">
              Cycle {completedCycles}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 z-10">
          <button
            onClick={toggleTimer}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-seafoam-500 to-teal-400 text-ocean-950 font-bold text-sm hover:from-seafoam-400 hover:to-teal-300 transition-all shadow-lg shadow-seafoam-500/20 flex items-center gap-2"
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            {isActive ? 'Pause' : 'Start Practice'}
          </button>

          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {completedCycles > 0 && (
            <button
              onClick={handleFinish}
              className="px-4 py-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold text-xs hover:bg-emerald-500/30 transition-all flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Complete Practice
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
