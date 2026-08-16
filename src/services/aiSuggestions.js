import { supabase } from './supabase';

async function invokeAiFunction(name, body) {
  if (!supabase) throw new Error('Supabase is not configured yet.');

  const { data, error } = await supabase.functions.invoke(name, { body });

  if (error) {
    let message = error.message || 'Could not reach the AI service.';
    try {
      const errBody = await error.context?.json();
      if (errBody?.error) message = errBody.error;
    } catch {
      // fall back to error.message above
    }
    throw new Error(message);
  }

  return data;
}

// Calls the reframe-suggest Edge Function (supabase/functions/reframe-suggest)
// which does the ai_features_enabled check, crisis-keyword gate, and Gemini
// call server-side. Returns either { alternativeThought, newAction } or
// { crisisDetected: true } — never throws for the crisis case, only for
// actual request/config failures.
export function suggestReframe({ statement, advantages, disadvantages }) {
  return invokeAiFunction('reframe-suggest', { statement, advantages, disadvantages });
}

// Calls the analyze-growth Edge Function (supabase/functions/analyze-growth)
// with aggregate dashboard stats only — no raw reflection/belief text.
// Returns { analysis: string }.
export function suggestGrowthAnalysis({
  moodCounts,
  totalCheckIns,
  breathingStreakCount,
  totalReframes,
  completedResourcesCount,
  unlockedMilestones,
}) {
  return invokeAiFunction('analyze-growth', {
    moodCounts,
    totalCheckIns,
    breathingStreakCount,
    totalReframes,
    completedResourcesCount,
    unlockedMilestones,
  });
}
