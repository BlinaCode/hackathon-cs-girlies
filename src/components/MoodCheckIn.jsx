import React, { useState } from 'react';
import { Heart, Sparkles, CheckCircle2, Tag } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import { OtterMascot } from './OtterMascot';

const MOOD_OPTIONS = [
  { name: 'Calm', emoji: '🌊', color: 'border-teal-500/40 bg-teal-500/10 text-teal-300', desc: 'Peaceful & grounded' },
  { name: 'Happy', emoji: '☀️', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300', desc: 'Joyful & energized' },
  { name: 'Hopeful', emoji: '🌱', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300', desc: 'Optimistic & focused' },
  { name: 'Anxious', emoji: '🌀', color: 'border-sky-500/40 bg-sky-500/10 text-sky-300', desc: 'Restless or uneasy' },
  { name: 'Overwhelmed', emoji: '🌧️', color: 'border-purple-500/40 bg-purple-500/10 text-purple-300', desc: 'Too much to carry' },
  { name: 'Exhausted', emoji: '🌙', color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300', desc: 'Low energy & tired' },
];

const COMMON_TAGS = ['Work', 'Relationships', 'Health', 'Sleep', 'Growth', 'Family', 'Self-Care'];

export function MoodCheckIn() {
  const { logMood, mascotState } = useWellness();

  const [selectedMood, setSelectedMood] = useState('Calm');
  const [energyLevel, setEnergyLevel] = useState(3);
  const [selectedTags, setSelectedTags] = useState([]);
  const [reflection, setReflection] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    logMood(selectedMood, energyLevel, selectedTags, reflection);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl font-bold text-slate-100 flex items-center justify-center gap-2">
          <Heart className="w-7 h-7 text-seafoam-400 fill-seafoam-400/20" />
          Daily Emotional Check-In
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Honoring how you feel right now is the first step toward inner resilience.
        </p>
      </div>

      {/* Sisu Mascot Speech Bubble */}
      <OtterMascot expression={mascotState.expression} speech={mascotState.speech} />

      {/* Check-In Card */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        
        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-seafoam-500/20 border border-seafoam-500/40 text-seafoam-400 flex items-center justify-center mx-auto text-3xl animate-bounce">
              ✨
            </div>
            <h3 className="font-display text-2xl font-semibold text-slate-100">
              Check-In Saved!
            </h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Your reflection has been safely logged in your personal growth journal.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Mood Selector Grid */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                1. How are you feeling right now?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MOOD_OPTIONS.map(item => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedMood(item.name)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedMood === item.name
                        ? `${item.color} shadow-lg ring-2 ring-seafoam-400/50 scale-[1.02]`
                        : 'border-slate-700/60 bg-slate-900/40 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-2xl mb-1">{item.emoji}</div>
                    <div className="font-semibold text-sm text-slate-100">{item.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Energy Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold uppercase tracking-wider text-slate-400">
                  2. Energy Level (1 to 5)
                </label>
                <span className="font-semibold text-seafoam-400 text-sm">
                  {energyLevel} / 5
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={energyLevel}
                onChange={e => setEnergyLevel(Number(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-seafoam-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-medium px-1">
                <span>Drained</span>
                <span>Moderate</span>
                <span>Vibrant</span>
              </div>
            </div>

            {/* Tags Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-seafoam-400" />
                3. What area is influencing your state?
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-seafoam-500 text-ocean-950 font-semibold shadow-md shadow-seafoam-500/20'
                        : 'bg-slate-900/60 border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Reflection Textarea */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                4. Private Reflection & Notes (Optional)
              </label>
              <textarea
                value={reflection}
                onChange={e => setReflection(e.target.value)}
                placeholder="Express your thoughts freely here... What is on your mind?"
                rows={3}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/60 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:border-seafoam-500 focus:ring-1 focus:ring-seafoam-500 text-sm resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-seafoam-500 to-teal-400 text-ocean-950 font-bold text-sm tracking-wide hover:from-seafoam-400 hover:to-teal-300 transition-all shadow-xl shadow-seafoam-500/20 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Save Daily Check-In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
