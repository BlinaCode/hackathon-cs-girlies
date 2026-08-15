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
      id: crypto.randomUUID(),
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
      id: crypto.randomUUID(),
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
      id: crypto.randomUUID(),
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

  // Merge belief rows pulled from Supabase into local state, keyed by id
  // (cloud wins on shared ids; local-only rows not yet pushed are kept).
  const mergeBeliefsFromCloud = (cloudBeliefs) => {
    setBeliefs(prev => {
      const map = new Map(prev.map(b => [b.id, b]));
      cloudBeliefs.forEach(b => map.set(b.id, b));
      return Array.from(map.values());
    });
  };

  const mergeBeliefPracticesFromCloud = (cloudPractices) => {
    setBeliefPractices(prev => {
      const map = new Map(prev.map(p => [p.id, p]));
      cloudPractices.forEach(p => map.set(p.id, p));
      return Array.from(map.values());
    });
  };

  // Add a friend to the circle (raw answers + app-derived tier)
  const addFriend = (friend) => {
    const newFriend = {
      id: crypto.randomUUID(),
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

  // Merge friend rows pulled from Supabase into local state, keyed by id
  const mergeFriendsFromCloud = (cloudFriends) => {
    setFriends(prev => {
      const map = new Map(prev.map(f => [f.id, f]));
      cloudFriends.forEach(f => map.set(f.id, f));
      return Array.from(map.values());
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

  // Merge the breathing streak pulled from Supabase into local state.
  // Whichever record has the more recent last-completed date wins (it reflects
  // the newest activity, e.g. logged from another device).
  const mergeBreathingStreakFromCloud = (cloudStreak) => {
    if (!cloudStreak) return;
    setBreathingStreak(prev => {
      if (!prev.lastCompletedDate || cloudStreak.lastCompletedDate > prev.lastCompletedDate) return cloudStreak;
      if (cloudStreak.lastCompletedDate === prev.lastCompletedDate && cloudStreak.count > prev.count) return cloudStreak;
      return prev;
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

  // Merge completed-resource ids pulled from Supabase into local state
  const mergeCompletedResourcesFromCloud = (cloudResourceIds) => {
    setCompletedResources(prev => Array.from(new Set([...prev, ...cloudResourceIds])));
  };

  // Wipe all local wellness state. Called when the authenticated identity on
  // this browser changes (logout, or a different account signing in) so one
  // person's private data can never be attributed to the next.
  const clearAllLocalData = () => {
    setMoodLogs([]);
    setBeliefs([]);
    setBeliefPractices([]);
    setFriends([]);
    setCompletedResources([]);
    setBreathingStreak({ count: 0, lastCompletedDate: null });
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
        mergeBeliefsFromCloud,
        mergeBeliefPracticesFromCloud,
        addFriend,
        removeFriend,
        mergeFriendsFromCloud,
        completeBreathingSession,
        mergeBreathingStreakFromCloud,
        toggleResourceCompletion,
        mergeCompletedResourcesFromCloud,
        clearAllLocalData
      }}
    >
      {children}
    </WellnessContext.Provider>
  );
}

export function useWellness() {
  return useContext(WellnessContext);
}
