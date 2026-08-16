import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../services/storage';

const WellnessContext = createContext();

// --- WEB AUDIO API OCEAN WAVES SOUND SYNTHESIZER ---
const useOceanSoundLogic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const noiseSourceRef = useRef(null);

  const toggleSound = () => {
    if (isPlaying) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsPlaying(false);
    } else {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtxRef.current = ctx;

        // Generate 4 seconds of brown noise for deep ocean waves
        const bufferSize = ctx.sampleRate * 4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
          data[i] *= 3.2;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        // Lowpass filter for smooth ocean water sound
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 320;

        // Gain node for main volume
        const gain = ctx.createGain();
        gain.gain.value = 0.12;

        // Low Frequency Oscillator for swelling wave rhythm
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.11; // ~9 second ocean tide cycle
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.08;

        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
        lfo.start();
        noiseSourceRef.current = noise;
        setIsPlaying(true);
      } catch (e) {
        console.error('Audio synthesis not supported', e);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return { isPlaying, toggleSound };
};

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

  // Transient (not persisted) hand-off: set when navigating to Reframe
  // Thoughts from elsewhere (e.g. Growth Dashboard's "Reframe" action) so it
  // opens pre-selected on that thought instead of defaulting to the first one.
  const [pendingReframeBeliefId, setPendingReframeBeliefId] = useState(null);

  // Global Theme & Audio State
  const [themeMode, setThemeMode] = useLocalStorage(STORAGE_KEYS.THEME_MODE, 'sky');
  const isSkyMode = themeMode === 'sky';
  const { isPlaying: isAudioPlaying, toggleSound: toggleAudio } = useOceanSoundLogic();

  useEffect(() => {
    document.body.className = isSkyMode
      ? 'bg-gradient-to-b from-cream-50 via-bluey-50 to-bluey-100 text-bluey-950 min-h-screen font-body antialiased selection:bg-bluey-300 selection:text-bluey-950'
      : 'bg-midnight-950 text-midnight-text min-h-screen font-body antialiased selection:bg-midnight-700 selection:text-white';
  }, [isSkyMode]);

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

  // Permanently remove a belief and its practice history. Local-only —
  // useSupabaseSync diffs against beliefs to also delete the row in Supabase,
  // which cascades to belief_practices there via FK ON DELETE CASCADE.
  const deleteBelief = (beliefId) => {
    setBeliefs(prev => prev.filter(b => b.id !== beliefId));
    setBeliefPractices(prev => prev.filter(p => p.beliefId !== beliefId));
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
      emotionalReliability: friend.emotionalReliability, // Q3, 1..4
      vulnerabilityDepth: friend.vulnerabilityDepth, // Q4, 1..4
      tier: friend.tier, // close_friend | friend | acquaintance
      tierSource: 'auto', // auto (from questionnaire) | manual (dragged to a ring)
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

  // Manually move a friend into a different ring (e.g. via drag-and-drop).
  // This is now the source of truth for their tier — the questionnaire
  // score is kept on the record for reference but never overwrites it again.
  const setFriendTier = (friendId, tier) => {
    setFriends(prev => prev.map(f => f.id === friendId ? { ...f, tier, tierSource: 'manual' } : f));
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
        deleteBelief,
        pendingReframeBeliefId,
        setPendingReframeBeliefId,
        mergeBeliefsFromCloud,
        mergeBeliefPracticesFromCloud,
        addFriend,
        removeFriend,
        setFriendTier,
        mergeFriendsFromCloud,
        completeBreathingSession,
        mergeBreathingStreakFromCloud,
        toggleResourceCompletion,
        mergeCompletedResourcesFromCloud,
        clearAllLocalData,
        themeMode,
        setThemeMode,
        isSkyMode,
        isAudioPlaying,
        toggleAudio
      }}
    >
      {children}
    </WellnessContext.Provider>
  );
}

export function useWellness() {
  return useContext(WellnessContext);
}
