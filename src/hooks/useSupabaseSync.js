import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWellness } from '../context/WellnessContext';
import { supabase } from '../services/supabase';

export function useSupabaseSync() {
  const { user } = useAuth();
  const { moodLogs, userValues, valueLogs } = useWellness();

  useEffect(() => {
    if (!user || !supabase) return;

    // Sync latest local mood checkin to Supabase if signed in
    const syncLatestMood = async () => {
      if (moodLogs.length === 0) return;
      const latest = moodLogs[0];
      try {
        await supabase.from('mood_checkins').upsert({
          user_id: user.id,
          mood: latest.mood,
          energy_level: latest.energyLevel,
          tags: latest.tags,
          reflection: latest.reflection,
          created_at: latest.timestamp
        });
      } catch (err) {
        console.warn('Supabase sync warning:', err);
      }
    };

    syncLatestMood();
  }, [user, moodLogs]);
}
