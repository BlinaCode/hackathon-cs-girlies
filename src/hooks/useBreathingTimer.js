import { useState, useEffect, useRef } from 'react';

// Preset breathing patterns (duration in seconds per phase)
export const BREATHING_MODES = {
  box: {
    name: 'Box Breathing (4-4-4-4)',
    description: 'Equal duration inhale, hold, exhale, hold for sharp focus & calmness.',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Exhale', duration: 4 },
      { name: 'Hold', duration: 4 }
    ]
  },
  relax: {
    name: '4-7-8 Relaxing Breath',
    description: 'Deep parasympathetic activation for sleep prep & stress relief.',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 7 },
      { name: 'Exhale', duration: 8 }
    ]
  },
  ocean: {
    name: 'Ocean Calm (5-5)',
    description: 'Smooth, rhythmic wave breathing to sync heart rate variability.',
    phases: [
      { name: 'Inhale', duration: 5 },
      { name: 'Exhale', duration: 5 }
    ]
  }
};

export function useBreathingTimer(initialMode = 'box') {
  const [modeKey, setModeKey] = useState(initialMode);
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(BREATHING_MODES[initialMode].phases[0].duration);
  const [completedCycles, setCompletedCycles] = useState(0);

  const timerRef = useRef(null);
  const mode = BREATHING_MODES[modeKey];
  const currentPhase = mode.phases[currentPhaseIndex];

  // Reset when mode changes
  useEffect(() => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setSecondsRemaining(BREATHING_MODES[modeKey].phases[0].duration);
    setCompletedCycles(0);
  }, [modeKey]);

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          // Advance to next phase
          setCurrentPhaseIndex(prevIndex => {
            const nextIndex = (prevIndex + 1) % mode.phases.length;
            if (nextIndex === 0) {
              setCompletedCycles(c => c + 1);
            }
            return nextIndex;
          });
          return mode.phases[(currentPhaseIndex + 1) % mode.phases.length].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isActive, currentPhaseIndex, mode]);

  const toggleTimer = () => setIsActive(prev => !prev);
  const resetTimer = () => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setSecondsRemaining(mode.phases[0].duration);
    setCompletedCycles(0);
  };

  return {
    modeKey,
    setModeKey,
    mode,
    isActive,
    currentPhase,
    currentPhaseIndex,
    secondsRemaining,
    completedCycles,
    toggleTimer,
    resetTimer
  };
}
