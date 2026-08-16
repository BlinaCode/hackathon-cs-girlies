// Supabase Edge Function — suggests a reframed thought + a small next action
// for the Reframe Thoughts worksheet (src/components/ReframeThoughts.jsx),
// called via supabase.functions.invoke('reframe-suggest') from
// src/services/aiSuggestions.js.
//
// Safety model (defense in depth, cheapest/most-certain checks first):
//   1. Caller must be authenticated (their own JWT, verified below).
//   2. profiles.ai_features_enabled must be true for that user — re-checked
//      here server-side, never trusted from the client.
//   3. A local, deterministic keyword/phrase check runs on the user's text
//      BEFORE Gemini is ever called. If it matches, Gemini is skipped
//      entirely and a fixed crisisDetected response is returned instead —
//      the client redirects to CountryCrisisLines (inside ResourceHub).
//   4. Gemini itself is also given safety settings and a system prompt that
//      refuses to reframe crisis-shaped input, as a second, probabilistic
//      layer behind the deterministic one above.
//
// Only needs the caller's own JWT (RLS already allows a user to read their
// own profiles row) — no service-role key required, unlike delete-account.

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

// Not exhaustive by design — a false positive just shows crisis resources
// instead of an AI suggestion (harmless); a false negative is the outcome
// we're trying hardest to avoid, so this errs toward matching broadly.
const CRISIS_PATTERNS = [
  /kill(ing)?\s+myself/i,
  /suicid/i,
  /want(ed)?\s+to\s+die/i,
  /end(ing)?\s+my\s+life/i,
  /no\s+reason\s+to\s+live/i,
  /better\s+off\s+dead/i,
  /hurt(ing)?\s+myself/i,
  /self[\s-]?harm/i,
  /can'?t\s+go\s+on/i,
];

function looksLikeCrisis(text: string): boolean {
  return CRISIS_PATTERNS.some((pattern) => pattern.test(text));
}

const SYSTEM_PROMPT = `You are a gentle, supportive assistant inside a wellness app called Sisu, helping a user with a CBT-style thought-reframing exercise.

Given the thought that is bothering the user, and the advantages/disadvantages they listed for holding that thought, suggest:
- alternativeThought: one kinder, more balanced way to see the situation (1-2 short sentences).
- newAction: one small, concrete action they could take today that honors the alternative thought (1 short sentence).

Rules:
- Warm, plain, non-clinical language. No medical, legal, diagnostic, or therapy advice.
- Never mention self-harm, suicide, or crisis topics in your response.
- If anything in the input suggests the user may be in crisis or in danger, do not attempt to reframe it — respond with alternativeThought and newAction both set to empty strings instead.
- Respond with JSON only, matching the required schema.`;

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    alternativeThought: { type: 'STRING' },
    newAction: { type: 'STRING' },
  },
  required: ['alternativeThought', 'newAction'],
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return jsonResponse({ error: 'Missing Authorization header.' }, 401);
  }

  let body: { statement?: string; advantages?: string; disadvantages?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400);
  }

  const statement = (body.statement || '').trim();
  const advantages = (body.advantages || '').trim();
  const disadvantages = (body.disadvantages || '').trim();

  if (!statement) {
    return jsonResponse({ error: 'Missing statement.' }, 400);
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

  const combinedText = `${statement} ${advantages} ${disadvantages}`;
  if (looksLikeCrisis(combinedText)) {
    return jsonResponse({ crisisDetected: true }, 200);
  }

  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    return jsonResponse({ error: 'AI suggestions are not configured right now.' }, 500);
  }
  // Model id is a secret, not a code constant — Google periodically retires
  // pinned model versions, sometimes just for new API keys/projects even
  // while the model still lists in the API (hit this twice: gemini-2.0-flash
  // fully retired, then gemini-2.5-flash came back "no longer available to
  // new users"). Default to the "-latest" alias Google keeps pointed at
  // whatever their current, broadly-available flash model is, so this stops
  // silently breaking for new deployments. Override via `supabase secrets
  // set GEMINI_MODEL=...` to pin a specific version instead.
  const geminiModel = Deno.env.get('GEMINI_MODEL') || 'gemini-flash-latest';

  const userPrompt = [
    `The thought bothering me: ${statement}`,
    advantages && `Advantages I see in holding this thought: ${advantages}`,
    disadvantages && `Disadvantages I see in holding this thought: ${disadvantages}`,
  ].filter(Boolean).join('\n');

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
    return jsonResponse({ error: 'The AI service could not generate a suggestion right now.' }, 502);
  }

  const geminiData = await geminiRes.json();
  const candidate = geminiData?.candidates?.[0];

  if (!candidate || candidate.finishReason === 'SAFETY' || geminiData?.promptFeedback?.blockReason) {
    // Model itself declined (our second safety layer) — treat like a crisis
    // redirect rather than surfacing a raw refusal.
    return jsonResponse({ crisisDetected: true }, 200);
  }

  const rawText = candidate?.content?.parts?.[0]?.text;
  let parsed: { alternativeThought?: string; newAction?: string };
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return jsonResponse({ error: 'Could not parse the AI suggestion.' }, 502);
  }

  if (!parsed.alternativeThought || !parsed.newAction) {
    return jsonResponse({ crisisDetected: true }, 200);
  }

  return jsonResponse(
    { alternativeThought: parsed.alternativeThought, newAction: parsed.newAction },
    200,
  );
});
