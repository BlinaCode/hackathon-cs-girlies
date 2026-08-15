import React, { useState } from 'react';
import { Users, Plus, X, UserPlus } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import { OtterMascot } from './OtterMascot';

// Q1 — How often are you in touch? (stored value 1..5, scored by points)
const Q1_OPTIONS = [
  { value: 1, label: 'Almost every day', points: 4 },
  { value: 2, label: 'Every week or so', points: 3 },
  { value: 3, label: 'Every month or so', points: 2 },
  { value: 4, label: 'A few times a year', points: 1 },
  { value: 5, label: 'Rarely, but we pick right back up', points: 3 }
];

// Q2 — What do you usually talk about? (stored value 1..4)
const Q2_OPTIONS = [
  { value: 1, label: 'Personal stuff — they know what’s going on in my life', points: 4 },
  { value: 2, label: 'Catching up, jokes, general life', points: 3 },
  { value: 3, label: 'Mostly a shared thing — work, gym, kids, a hobby', points: 2 },
  { value: 4, label: 'Small talk', points: 1 }
];

// Derive the tier from the two answers. Sum points (2..8); the 3–4 band leans on Q2.
function deriveTier(q1Value, q2Value) {
  const q1 = Q1_OPTIONS.find(o => o.value === q1Value)?.points ?? 0;
  const q2 = Q2_OPTIONS.find(o => o.value === q2Value)?.points ?? 0;
  const total = q1 + q2;
  if (total >= 7) return 'close_friend';
  if (total >= 5) return 'friend';
  if (total >= 3) return q2 >= 3 ? 'friend' : 'acquaintance';
  return 'acquaintance';
}

const TIERS = [
  { key: 'close_friend', label: 'Close Friends', hint: 'Your inner circle', ring: 'border-seafoam-500/50 bg-seafoam-500/10', chip: 'bg-seafoam-500/20 text-seafoam-200 border-seafoam-500/40' },
  { key: 'friend', label: 'Friends', hint: 'Warm and regular', ring: 'border-sky-500/40 bg-sky-500/5', chip: 'bg-sky-500/15 text-sky-200 border-sky-500/30' },
  { key: 'acquaintance', label: 'Acquaintances', hint: 'The outer ring', ring: 'border-slate-700/60 bg-slate-900/40', chip: 'bg-slate-800 text-slate-300 border-slate-700' }
];

export function FriendCircle() {
  const { friends, addFriend, removeFriend, mascotState } = useWellness();

  const [name, setName] = useState('');
  const [q1, setQ1] = useState(1);
  const [q2, setQ2] = useState(1);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const tier = deriveTier(q1, q2);
    addFriend({ name: name.trim(), contactFrequency: q1, conversationDepth: q2, tier });
    setName('');
    setQ1(1);
    setQ2(1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl font-bold text-slate-100 flex items-center justify-center gap-2">
          <Users className="w-7 h-7 text-seafoam-400" />
          Friend Circle
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Answer two gentle questions about each person, and we’ll place them in your circle — no labels to assign yourself.
        </p>
      </div>

      <OtterMascot expression={mascotState.expression} speech={mascotState.speech} />

      {/* Add-friend form */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
        <h3 className="font-display text-xl font-bold text-slate-100 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-seafoam-400" />
          Add someone to your circle
        </h3>

        <form onSubmit={handleAdd} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Their name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Alex"
              className="w-full px-4 py-3 rounded-2xl bg-slate-900/60 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:border-seafoam-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              How often are you in touch?
            </label>
            <select
              value={q1}
              onChange={e => setQ1(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900/60 border border-slate-700 text-slate-100 focus:border-seafoam-500 text-sm"
            >
              {Q1_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              What do you usually talk about?
            </label>
            <select
              value={q2}
              onChange={e => setQ2(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900/60 border border-slate-700 text-slate-100 focus:border-seafoam-500 text-sm"
            >
              {Q2_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-seafoam-500 to-teal-400 text-ocean-950 font-bold text-sm hover:from-seafoam-400 hover:to-teal-300 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Place in my circle
          </button>
        </form>
      </div>

      {/* The circle — grouped by tier ring */}
      <div className="space-y-4">
        {TIERS.map(tier => {
          const members = friends.filter(f => f.tier === tier.key);
          return (
            <div key={tier.key} className={`rounded-3xl border p-5 sm:p-6 backdrop-blur-md ${tier.ring}`}>
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="font-display text-lg font-bold text-slate-100">{tier.label}</h3>
                <span className="text-[11px] text-slate-400">{tier.hint} · {members.length}</span>
              </div>
              {members.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No one here yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {members.map(f => (
                    <span
                      key={f.id}
                      className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${tier.chip}`}
                    >
                      {f.name}
                      <button
                        type="button"
                        onClick={() => removeFriend(f.id)}
                        aria-label={`Remove ${f.name}`}
                        className="opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
