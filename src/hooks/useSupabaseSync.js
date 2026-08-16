import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWellness } from '../context/WellnessContext';
import { supabase } from '../services/supabase';

const toBeliefRow = (b, userId) => ({
  id: b.id,
  user_id: userId,
  statement: b.statement,
  meaning_to_me: b.meaningToMe,
  origin_historical: b.originHistorical,
  status: b.status,
  created_at: b.createdAt
});

const fromBeliefRow = (row) => ({
  id: row.id,
  statement: row.statement,
  meaningToMe: row.meaning_to_me,
  originHistorical: row.origin_historical,
  status: row.status,
  createdAt: row.created_at
});

const toPracticeRow = (p, userId) => ({
  id: p.id,
  belief_id: p.beliefId,
  user_id: userId,
  initial_belief_score: p.initialBeliefScore,
  advantages: p.advantages,
  disadvantages: p.disadvantages,
  chosen_alternative_thought: p.chosenAlternativeThought,
  chosen_new_action: p.chosenNewAction,
  final_belief_score: p.finalBeliefScore,
  ai_assisted: p.aiAssisted,
  practiced_at: p.practicedAt
});

const fromPracticeRow = (row) => ({
  id: row.id,
  beliefId: row.belief_id,
  initialBeliefScore: row.initial_belief_score,
  advantages: row.advantages,
  disadvantages: row.disadvantages,
  chosenAlternativeThought: row.chosen_alternative_thought,
  chosenNewAction: row.chosen_new_action,
  finalBeliefScore: row.final_belief_score,
  aiAssisted: row.ai_assisted,
  practicedAt: row.practiced_at
});

const toFriendRow = (f, userId) => ({
  id: f.id,
  user_id: userId,
  name: f.name,
  contact_frequency: f.contactFrequency,
  conversation_depth: f.conversationDepth,
  emotional_reliability: f.emotionalReliability,
  vulnerability_depth: f.vulnerabilityDepth,
  tier: f.tier,
  tier_source: f.tierSource,
  created_at: f.createdAt
});

const fromFriendRow = (row) => ({
  id: row.id,
  name: row.name,
  contactFrequency: row.contact_frequency,
  conversationDepth: row.conversation_depth,
  emotionalReliability: row.emotional_reliability,
  vulnerabilityDepth: row.vulnerability_depth,
  tier: row.tier,
  tierSource: row.tier_source,
  createdAt: row.created_at
});

const toStreakRow = (streak, userId) => ({
  user_id: userId,
  count: streak.count,
  last_completed_date: streak.lastCompletedDate
});

const fromStreakRow = (row) => ({
  count: row.count,
  lastCompletedDate: row.last_completed_date
});

const toCompletedResourceRow = (resourceId, userId) => ({
  user_id: userId,
  resource_id: resourceId
});

// Tracks who this browser's local data actually belongs to, so a logout or a
// different account signing in never gets a stale identity's data attributed
// to it. Persisted (not just a ref) so it survives page reloads.
const IDENTITY_STORAGE_KEY = 'sisu_last_synced_identity';

export function useSupabaseSync() {
  const { user, loading, lastAuthActionRef } = useAuth();
  const {
    moodLogs,
    beliefs,
    beliefPractices,
    mergeBeliefsFromCloud,
    mergeBeliefPracticesFromCloud,
    friends,
    mergeFriendsFromCloud,
    breathingStreak,
    mergeBreathingStreakFromCloud,
    completedResources,
    mergeCompletedResourcesFromCloud,
    clearAllLocalData
  } = useWellness();

  const knownFriendIdsRef = useRef(new Set());
  const knownCompletedResourceIdsRef = useRef(new Set());
  // 'PENDING' until the identity-check effect below runs at least once this
  // commit — fails closed, so a push effect never fires before the check has
  // had a chance to clear stale data.
  const identityRef = useRef('PENDING');

  // Detect a change in WHO this browser is authenticated as, and wipe local
  // data unless this is specifically a guest SIGNING UP for a new account
  // (the one case where local data should merge in, not be discarded).
  // - Real account -> anything else (logout, or a different account): wipe.
  // - Guest -> logging into an EXISTING account: wipe (that account's own
  //   cloud data should be all that's visible — local guest scribbles aren't
  //   theirs to inherit).
  // - Guest -> signing UP a new account: keep (local data becomes theirs).
  //
  // Gated on `loading`: AuthContext's `user` briefly passes through null on
  // every page load while it restores an existing session — without this
  // gate, that transient null would look like "logged out" and wipe a
  // still-logged-in user's data on a plain refresh.
  //
  // Declared first so its synchronous portion runs before the push effects
  // below in the same commit (see identityRef gate).
  useEffect(() => {
    if (loading) return;

    const currentIdentity = user?.id ?? 'guest';
    const storedIdentity = localStorage.getItem(IDENTITY_STORAGE_KEY);
    const identityChanged = storedIdentity !== null && storedIdentity !== currentIdentity;
    const authAction = lastAuthActionRef.current;
    lastAuthActionRef.current = null; // consume — applies to this transition only

    if (identityChanged) {
      const wasRealAccount = storedIdentity !== 'guest';
      const isGuestSignup = !wasRealAccount && authAction === 'signup';

      if (wasRealAccount || !isGuestSignup) {
        clearAllLocalData();
        identityRef.current = 'JUST_CLEARED';
      } else {
        identityRef.current = 'OK';
      }
    } else {
      identityRef.current = 'OK';
    }

    localStorage.setItem(IDENTITY_STORAGE_KEY, currentIdentity);
  }, [user, loading]);

  // Push all local mood checkins to Supabase, keyed by id so repeats update
  // the same row instead of inserting duplicates.
  useEffect(() => {
    if (!user || !supabase || moodLogs.length === 0) return;

    const syncMoodLogs = async () => {
      if (identityRef.current !== 'OK') return;

      const rows = moodLogs.map(log => ({
        id: log.id,
        user_id: user.id,
        mood: log.mood,
        energy_level: log.energyLevel,
        tags: log.tags,
        reflection: log.reflection,
        created_at: log.timestamp
      }));

      const { error } = await supabase
        .from('mood_checkins')
        .upsert(rows, { onConflict: 'id' });

      if (error) console.warn('Supabase mood sync warning:', error.message);
    };

    syncMoodLogs();
  }, [user, moodLogs]);

  // Pull beliefs + belief practices once per login and merge into local state,
  // so a returning user sees their cloud history instead of an empty guest state.
  useEffect(() => {
    if (!user || !supabase) return;

    const pullBeliefWork = async () => {
      const { data: beliefRows, error: beliefErr } = await supabase
        .from('beliefs')
        .select('*')
        .eq('user_id', user.id);

      if (beliefErr) {
        console.warn('Supabase belief pull warning:', beliefErr.message);
      } else if (beliefRows?.length) {
        mergeBeliefsFromCloud(beliefRows.map(fromBeliefRow));
      }

      const { data: practiceRows, error: practiceErr } = await supabase
        .from('belief_practices')
        .select('*')
        .eq('user_id', user.id);

      if (practiceErr) {
        console.warn('Supabase belief practice pull warning:', practiceErr.message);
      } else if (practiceRows?.length) {
        mergeBeliefPracticesFromCloud(practiceRows.map(fromPracticeRow));
      }
    };

    pullBeliefWork();
  }, [user]);

  // Push beliefs then practices (in that order — belief_practices.belief_id
  // has a foreign key to beliefs.id, so the parent must land first).
  useEffect(() => {
    if (!user || !supabase) return;
    if (beliefs.length === 0 && beliefPractices.length === 0) return;

    const syncBeliefWork = async () => {
      if (identityRef.current !== 'OK') return;

      if (beliefs.length > 0) {
        const beliefRows = beliefs.map(b => toBeliefRow(b, user.id));
        const { error } = await supabase.from('beliefs').upsert(beliefRows, { onConflict: 'id' });
        if (error) {
          console.warn('Supabase belief sync warning:', error.message);
          return;
        }
      }

      if (beliefPractices.length > 0) {
        const practiceRows = beliefPractices.map(p => toPracticeRow(p, user.id));
        const { error } = await supabase.from('belief_practices').upsert(practiceRows, { onConflict: 'id' });
        if (error) console.warn('Supabase belief practice sync warning:', error.message);
      }
    };

    syncBeliefWork();
  }, [user, beliefs, beliefPractices]);

  // Pull friends once per login and merge into local state.
  useEffect(() => {
    if (!user || !supabase) return;

    const pullFriends = async () => {
      const { data, error } = await supabase
        .from('friends')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.warn('Supabase friends pull warning:', error.message);
        return;
      }
      if (data?.length) mergeFriendsFromCloud(data.map(fromFriendRow));
    };

    pullFriends();
  }, [user]);

  // Push friends. Friends can be permanently removed locally (unlike beliefs,
  // which are only ever added/updated), so we diff against the last-known id
  // set to also delete rows in Supabase that disappeared from local state.
  useEffect(() => {
    if (!user || !supabase) return;

    const syncFriends = async () => {
      if (identityRef.current !== 'OK') return;

      const currentIds = new Set(friends.map(f => f.id));
      const removedIds = [...knownFriendIdsRef.current].filter(id => !currentIds.has(id));

      if (removedIds.length > 0) {
        const { error } = await supabase.from('friends').delete().in('id', removedIds);
        if (error) console.warn('Supabase friend delete warning:', error.message);
      }

      if (friends.length > 0) {
        const rows = friends.map(f => toFriendRow(f, user.id));
        const { error } = await supabase.from('friends').upsert(rows, { onConflict: 'id' });
        if (error) console.warn('Supabase friend sync warning:', error.message);
      }

      knownFriendIdsRef.current = currentIds;
    };

    syncFriends();
  }, [user, friends]);

  // Pull the breathing streak once per login (one row per user).
  useEffect(() => {
    if (!user || !supabase) return;

    const pullStreak = async () => {
      const { data, error } = await supabase
        .from('breathing_streaks')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.warn('Supabase breathing streak pull warning:', error.message);
        return;
      }
      if (data) mergeBreathingStreakFromCloud(fromStreakRow(data));
    };

    pullStreak();
  }, [user]);

  // Push the breathing streak, keyed by user_id (one row per user).
  useEffect(() => {
    if (!user || !supabase) return;

    const syncStreak = async () => {
      if (identityRef.current !== 'OK') return;

      const { error } = await supabase
        .from('breathing_streaks')
        .upsert(toStreakRow(breathingStreak, user.id), { onConflict: 'user_id' });

      if (error) console.warn('Supabase breathing streak sync warning:', error.message);
    };

    syncStreak();
  }, [user, breathingStreak]);

  // Pull completed resources once per login and merge into local state.
  useEffect(() => {
    if (!user || !supabase) return;

    const pullCompletedResources = async () => {
      const { data, error } = await supabase
        .from('completed_resources')
        .select('resource_id')
        .eq('user_id', user.id);

      if (error) {
        console.warn('Supabase completed resources pull warning:', error.message);
        return;
      }
      if (data?.length) mergeCompletedResourcesFromCloud(data.map(row => row.resource_id));
    };

    pullCompletedResources();
  }, [user]);

  // Push completed resources. A resource can be un-toggled locally, so we
  // diff against the last-known set to also delete rows that disappeared
  // (mirrors the friends sync approach — local state has no row id, so the
  // (user_id, resource_id) unique constraint is the upsert conflict target).
  useEffect(() => {
    if (!user || !supabase) return;

    const syncCompletedResources = async () => {
      if (identityRef.current !== 'OK') return;

      const currentIds = new Set(completedResources);
      const removedIds = [...knownCompletedResourceIdsRef.current].filter(id => !currentIds.has(id));

      if (removedIds.length > 0) {
        const { error } = await supabase
          .from('completed_resources')
          .delete()
          .eq('user_id', user.id)
          .in('resource_id', removedIds);
        if (error) console.warn('Supabase completed resource delete warning:', error.message);
      }

      if (completedResources.length > 0) {
        const rows = completedResources.map(id => toCompletedResourceRow(id, user.id));
        const { error } = await supabase
          .from('completed_resources')
          .upsert(rows, { onConflict: 'user_id,resource_id' });
        if (error) console.warn('Supabase completed resource sync warning:', error.message);
      }

      knownCompletedResourceIdsRef.current = currentIds;
    };

    syncCompletedResources();
  }, [user, completedResources]);
}
