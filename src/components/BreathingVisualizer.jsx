import React, { useState, useEffect } from 'react';
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

  const { completeBreathingSession, setMascotState } = useWellness();
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastSessionCycles, setLastSessionCycles] = useState(0);

  // Update mascot when breathing starts
  useEffect(() => {
    if (isActive) {
      setShowCelebration(false);
      setMascotState({
        expression: 'breathing',
        speech: `Follow the expanding ocean wave. Breathe in peace, exhale tension.`
      });
    }
  }, [isActive, setMascotState]);

  // Complete session trigger
  const handleFinish = () => {
    const cycles = completedCycles;
    setLastSessionCycles(cycles);
    setShowCelebration(true);
    completeBreathingSession();
    resetTimer();
  };

  const handleStartAgain = () => {
    setShowCelebration(false);
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

      {/* People breathing with you */}
      {participants.length > 0 && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-seafoam-400 animate-pulse" />
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
      <OtterMascot
        expression={showCelebration ? 'celebrating' : isActive ? 'breathing' : 'caring'}
        speech={
          showCelebration
            ? `Wonderful job! You completed ${lastSessionCycles} wave ${lastSessionCycles === 1 ? 'cycle' : 'cycles'}. Feel that ocean calm within you.`
            : isActive
            ? 'Follow the expanding ocean wave. Breathe in peace, exhale tension.'
            : 'Select your breathing technique below and press Start.'
        }
      />

      {/* Technique Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Object.entries(BREATHING_MODES).map(([key, item]) => (
          <button
            key={key}
            onClick={() => {
              setShowCelebration(false);
              setModeKey(key);
            }}
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
        
        {showCelebration ? (
          /* Completion Celebration View */
          <div className="flex flex-col items-center justify-center space-y-6 py-4 z-10">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              {/* Pulsing Aura */}
              <div className="absolute inset-0 rounded-full border-2 border-seafoam-400/40 bg-seafoam-500/10 animate-pulse" />
              
              {/* Celebration Center Bubble */}
              <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full border border-seafoam-300/50 bg-gradient-to-br from-seafoam-500/20 via-slate-900/80 to-ocean-950/90 flex flex-col items-center justify-center shadow-2xl backdrop-blur-md p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-seafoam-500/20 border border-seafoam-400/40 flex items-center justify-center text-2xl shadow-lg">
                  ✨
                </div>
                <div className="font-display font-bold text-xl sm:text-2xl text-slate-100">
                  Peace Achieved
                </div>
                <div className="text-xs font-semibold px-3 py-1 rounded-full bg-seafoam-500/15 border border-seafoam-500/30 text-seafoam-300">
                  {lastSessionCycles} Wave {lastSessionCycles === 1 ? 'Cycle' : 'Cycles'} Done
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleStartAgain}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-seafoam-500 to-teal-400 text-ocean-950 font-bold text-sm hover:from-seafoam-400 hover:to-teal-300 transition-all shadow-lg shadow-seafoam-500/20 flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                Start Another Wave
              </button>
            </div>
          </div>
        ) : (
          /* Active / Idle Breathing Circle & Controls */
          <>
            {/* Animated Expanding Ocean Wave Ring */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              
              {/* Wave Pulse Aura */}
              <div
                className={`absolute inset-3 rounded-full border-2 border-seafoam-400/40 bg-seafoam-500/10 transition-all duration-1000 ${
                  isActive ? 'animate-ripple' : ''
                }`}
              />
              
              {/* Phase Expanding Circle - Translucent Bubble Look */}
              <div
                className={`w-52 h-52 sm:w-64 sm:h-64 rounded-full border flex flex-col items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-1000 ${
                  currentPhase.name === 'Inhale'
                    ? 'scale-110 bg-seafoam-400/20 border-seafoam-300/60 shadow-[inset_0_2px_14px_rgba(255,255,255,0.3)] ring-4 ring-seafoam-400/20'
                    : currentPhase.name === 'Exhale'
                    ? 'scale-90 bg-ocean-950/30 border-teal-400/30 shadow-[inset_0_2px_8px_rgba(255,255,255,0.15)]'
                    : 'scale-100 bg-teal-400/20 border-teal-300/50 shadow-[inset_0_2px_12px_rgba(255,255,255,0.25)]'
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
          </>
        )}

      </div>
    </div>
  );
}
