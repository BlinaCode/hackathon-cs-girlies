import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../services/storage';

const WellnessContext = createContext();

const INITIAL_DEFAULT_VALUES = [
  { id: 'val-resilience', name: 'Resilience', description: 'Bouncing back from challenges with courage & clarity', alignmentScore: 8 },
  { id: 'val-mindfulness', name: 'Mindfulness', description: 'Being fully present in the current moment without judgment', alignmentScore: 7 },
  { id: 'val-compassion', name: 'Self-Compassion', description: 'Offering yourself gentle kindness during difficult times', alignmentScore: 9 },
  { id: 'val-courage', name: 'Courage', description: 'Stepping into discomfort for authentic personal growth', alignmentScore: 6 }
];

export function WellnessProvider({ children }) {
  const [moodLogs, setMoodLogs] = useLocalStorage(STORAGE_KEYS.MOOD_LOGS, []);
  const [userValues, setUserValues] = useLocalStorage(STORAGE_KEYS.USER_VALUES, INITIAL_DEFAULT_VALUES);
  const [valueLogs, setValueLogs] = useLocalStorage(STORAGE_KEYS.VALUE_LOGS, []);
  const [completedResources, setCompletedResources] = useLocalStorage(STORAGE_KEYS.COMPLETED_RESOURCES, []);
  const [breathingStreak, setBreathingStreak] = useLocalStorage(STORAGE_KEYS.BREATHING_STREAK, {
    count: 3,
    lastCompletedDate: new Date().toISOString().split('T')[0]
  });

  // Mascot dynamic state trigger
  const [mascotState, setMascotState] = useState({
    expression: 'caring', // joyful, breathing, caring, thoughtful, celebrating
    speech: 'Welcome back! Take a deep breath and explore at your own pace.'
  });

  // Log a new mood check-in
  const logMood = (mood, energyLevel, tags, reflection) => {
    const newEntry = {
      id: 'mood-' + Date.now(),
      mood,
      energyLevel,
      tags: tags || [],
      reflection: reflection || '',
      timestamp: new Date().toISOString()
    };
    setMoodLogs(prev => [newEntry, ...prev]);

    // Mascot reaction
    if (mood === 'Anxious' || mood === 'Overwhelmed') {
      setMascotState({
        expression: 'caring',
        speech: `I'm holding space for you. How about a 2-minute ocean breath?`
      });
    } else if (mood === 'Calm' || mood === 'Hopeful' || mood === 'Happy') {
      setMascotState({
        expression: 'joyful',
        speech: `It's wonderful to feel ${mood.toLowerCase()}! Treasure this peaceful moment.`
      });
    } else {
      setMascotState({
        expression: 'thoughtful',
        speech: `Thank you for checking in. Naming your feeling is a powerful step.`
      });
    }
  };

  // Log core value action
  const logValueAction = (valueId, actionDescription, reflection) => {
    const newLog = {
      id: 'val-log-' + Date.now(),
      valueId,
      actionDescription,
      reflection: reflection || '',
      timestamp: new Date().toISOString()
    };
    setValueLogs(prev => [newLog, ...prev]);

    setMascotState({
      expression: 'celebrating',
      speech: `Awesome work! Living according to your core values builds true resilience.`
    });
  };

  // Complete a breathing exercise session
  const completeBreathingSession = () => {
    const today = new Date().toISOString().split('T')[0];
    const isConsecutive = breathingStreak.lastCompletedDate !== today;

    setBreathingStreak(prev => ({
      count: isConsecutive ? prev.count + 1 : prev.count,
      lastCompletedDate: today
    }));

    setMascotState({
      expression: 'celebrating',
      speech: `You completed your breathing practice! Feel that ocean calm within you.`
    });
  };

  // Toggle resource completion
  const toggleResourceCompletion = (resourceId) => {
    setCompletedResources(prev => {
      if (prev.includes(resourceId)) {
        return prev.filter(id => id !== resourceId);
      } else {
        return [...prev, resourceId];
      }
    });

    setMascotState({
      expression: 'joyful',
      speech: `Knowledge is growth! Proud of you for exploring new wellness tools.`
    });
  };

  // Update value alignment score
  const updateValueAlignment = (valueId, newScore) => {
    setUserValues(prev => prev.map(val => val.id === valueId ? { ...val, alignmentScore: newScore } : val));
  };

  return (
    <WellnessContext.Provider
      value={{
        moodLogs,
        userValues,
        valueLogs,
        completedResources,
        breathingStreak,
        mascotState,
        setMascotState,
        logMood,
        logValueAction,
        completeBreathingSession,
        toggleResourceCompletion,
        updateValueAlignment
      }}
    >
      {children}
    </WellnessContext.Provider>
  );
}

export function useWellness() {
  return useContext(WellnessContext);
}
