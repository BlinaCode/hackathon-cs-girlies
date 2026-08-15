import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../services/storage';

const WellnessContext = createContext();

export function WellnessProvider({ children }) {
  const [moodLogs, setMoodLogs] = useLocalStorage(STORAGE_KEYS.MOOD_LOGS, []);
  const [beliefs, setBeliefs] = useLocalStorage(STORAGE_KEYS.BELIEFS, []);
  const [beliefPractices, setBeliefPractices] = useLocalStorage(STORAGE_KEYS.BELIEF_PRACTICES, []);
  const [friends, setFriends] = useLocalStorage(STORAGE_KEYS.FRIENDS, []);
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

  // Create a new belief to reframe (parent record)
  const addBelief = (statement, meaningToMe, originHistorical) => {
    const newBelief = {
      id: 'belief-' + Date.now(),
      statement,
      meaningToMe: meaningToMe || '',
      originHistorical: originHistorical || '',
      status: 'active', // active | resolved | archived
      createdAt: new Date().toISOString()
    };
    setBeliefs(prev => [newBelief, ...prev]);

    setMascotState({
      expression: 'thoughtful',
      speech: `Naming the thought is the first brave step. Let's gently work through it together.`
    });

    return newBelief.id;
  };

  // Log a practice session for a belief (child record; same beliefId = re-practice)
  const addBeliefPractice = (beliefId, practice) => {
    const newPractice = {
      id: 'practice-' + Date.now(),
      beliefId,
      initialBeliefScore: practice.initialBeliefScore,
      advantages: practice.advantages || '',
      disadvantages: practice.disadvantages || '',
      chosenAlternativeThought: practice.chosenAlternativeThought || '',
      chosenNewAction: practice.chosenNewAction || '',
      finalBeliefScore: practice.finalBeliefScore ?? null,
      aiAssisted: practice.aiAssisted || false,
      practicedAt: new Date().toISOString()
    };
    setBeliefPractices(prev => [newPractice, ...prev]);

    setMascotState({
      expression: 'celebrating',
      speech: `Beautiful work reframing that thought. Notice how the belief loosened its grip.`
    });

    return newPractice.id;
  };

  // Update a belief's status (active | resolved | archived)
  const updateBeliefStatus = (beliefId, status) => {
    setBeliefs(prev => prev.map(b => b.id === beliefId ? { ...b, status } : b));
  };

  // Add a friend to the circle (raw answers + app-derived tier)
  const addFriend = (friend) => {
    const newFriend = {
      id: 'friend-' + Date.now(),
      name: friend.name,
      contactFrequency: friend.contactFrequency, // Q1, 1..5
      conversationDepth: friend.conversationDepth, // Q2, 1..4
      tier: friend.tier, // close_friend | friend | acquaintance
      createdAt: new Date().toISOString()
    };
    setFriends(prev => [newFriend, ...prev]);

    setMascotState({
      expression: 'joyful',
      speech: `Connection is nourishment. It's lovely to see who fills your circle.`
    });

    return newFriend.id;
  };

  const removeFriend = (friendId) => {
    setFriends(prev => prev.filter(f => f.id !== friendId));
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

  return (
    <WellnessContext.Provider
      value={{
        moodLogs,
        beliefs,
        beliefPractices,
        friends,
        completedResources,
        breathingStreak,
        mascotState,
        setMascotState,
        logMood,
        addBelief,
        addBeliefPractice,
        updateBeliefStatus,
        addFriend,
        removeFriend,
        completeBreathingSession,
        toggleResourceCompletion
      }}
    >
      {children}
    </WellnessContext.Provider>
  );
}

export function useWellness() {
  return useContext(WellnessContext);
}
