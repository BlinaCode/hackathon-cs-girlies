// Supabase Edge Function — generates a short, supportive reflection on the
// user's Growth & Analytics stats (src/components/GrowthDashboard.jsx),
// called via supabase.functions.invoke('analyze-growth') from
// src/services/aiSuggestions.js.
//
// Deliberately aggregate-only input: mood counts, streak, reframe count,
// milestones — no raw reflection or belief text ever leaves the device for
// this feature (that's the whole reason it's separate from reframe-suggest,
// which does handle raw text and has its own keyword crisis gate). With no
// free text in the payload there's nothing to keyword-match, so instead the
// system prompt itself asks the model to gently point toward real support
// when the aggregate mood pattern looks like sustained distress, rather than
// just cheerfully narrating the numbers.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

const SYSTEM_PROMPT = `You are a warm, supportive assistant inside a wellness app called Sisu, writing a short reflection on a user's activity stats for their Growth & Analytics dashboard.

You will receive: mood check-in counts by label, total check-ins, breathing streak days, thoughts reframed, resource guides completed, and which milestones are unlocked. You will NOT receive any of the user's actual written reflections or thoughts — only these aggregate numbers.

Write 2-4 short sentences that:
- Notice one or two genuine patterns in the numbers (e.g. a mood that comes up often, a streak worth acknowledging, momentum in reframing).
- Stay warm, plain, encouraging — never clinical, never a diagnosis, never definitive claims about their mental state.
- If the mood counts are dominated by difficult emotions (e.g. Anxious, Overwhelmed, Exhausted) making up most of the check-ins, gently note that a stretch like this is worth talking through with someone, and mention that support resources are available in the app — without alarm, and without treating the numbers as a diagnosis.

Respond with JSON only, matching the required schema.`;

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    analysis: { type: 'STRING' },
  },
  required: ['analysis'],
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return jsonResponse({ error: 'Missing Authorization header.' }, 401);
  }

  let body: {
    moodCounts?: Record<string, number>;
    totalCheckIns?: number;
    breathingStreakCount?: number;
    totalReframes?: number;
    completedResourcesCount?: number;
    unlockedMilestones?: string[];
  };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

  const callerClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: userErr } = await callerClient.auth.getUser();
  if (userErr || !user) {
    return jsonResponse({ error: 'Not authenticated.' }, 401);
  }

  const { data: profile, error: profileErr } = await callerClient
    .from('profiles')
    .select('ai_features_enabled')
    .eq('id', user.id)
    .single();

  if (profileErr) {
    return jsonResponse({ error: profileErr.message }, 500);
  }
  if (!profile?.ai_features_enabled) {
    return jsonResponse({ error: 'AI-assisted suggestions are not enabled for this account.' }, 403);
  }

  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    return jsonResponse({ error: 'AI suggestions are not configured right now.' }, 500);
  }
  const geminiModel = Deno.env.get('GEMINI_MODEL') || 'gemini-flash-latest';

  const moodCounts = body.moodCounts || {};
  const moodSummary = Object.entries(moodCounts)
    .map(([mood, count]) => `${mood}: ${count}`)
    .join(', ') || 'none logged yet';

  const userPrompt = [
    `Mood check-in counts: ${moodSummary}`,
    `Total check-ins: ${body.totalCheckIns ?? 0}`,
    `Breathing streak: ${body.breathingStreakCount ?? 0} days`,
    `Thoughts reframed: ${body.totalReframes ?? 0}`,
    `Resource guides completed: ${body.completedResourcesCount ?? 0}`,
    `Unlocked milestones: ${(body.unlockedMilestones || []).join(', ') || 'none yet'}`,
  ].join('\n');

  let geminiRes: Response;
  try {
    geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': geminiApiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
            temperature: 0.6,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_LOW_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
          ],
        }),
      },
    );
  } catch (err) {
    return jsonResponse({ error: 'Could not reach the AI service.' }, 502);
  }

  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    console.warn('Gemini API error:', geminiRes.status, errText);
    return jsonResponse({ error: 'The AI service could not generate an analysis right now.' }, 502);
  }

  const geminiData = await geminiRes.json();
  const candidate = geminiData?.candidates?.[0];

  if (!candidate || candidate.finishReason === 'SAFETY' || geminiData?.promptFeedback?.blockReason) {
    return jsonResponse({ error: 'Could not generate an analysis for this data.' }, 502);
  }

  const rawText = candidate?.content?.parts?.[0]?.text;
  let parsed: { analysis?: string };
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return jsonResponse({ error: 'Could not parse the AI analysis.' }, 502);
  }

  if (!parsed.analysis) {
    return jsonResponse({ error: 'Could not generate an analysis for this data.' }, 502);
  }

  return jsonResponse({ analysis: parsed.analysis }, 200);
});
