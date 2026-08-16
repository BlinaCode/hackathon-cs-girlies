import React, { useState, useRef } from 'react';
import { Heart, CheckCircle2, Tag } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import { OtterMascot } from './OtterMascot';

const MOOD_OPTIONS = [
  { name: 'Calm', emoji: '🌊', color: 'border-bluey-400/40 bg-bluey-400/10 text-bluey-600 dark:text-bluey-300', desc: 'Peaceful & grounded' },
  { name: 'Happy', emoji: '☀️', color: 'border-amber-400/40 bg-amber-400/10 text-amber-600 dark:text-amber-300', desc: 'Joyful & energized' },
  { name: 'Hopeful', emoji: '🌱', color: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300', desc: 'Optimistic & focused' },
  { name: 'Anxious', emoji: '🌀', color: 'border-sky-400/40 bg-sky-400/10 text-sky-600 dark:text-sky-300', desc: 'Restless or uneasy' },
  { name: 'Overwhelmed', emoji: '🌧️', color: 'border-purple-400/40 bg-purple-400/10 text-purple-600 dark:text-purple-300', desc: 'Too much to carry' },
  { name: 'Exhausted', emoji: '🌙', color: 'border-indigo-400/40 bg-indigo-400/10 text-indigo-600 dark:text-indigo-300', desc: 'Low energy & tired' },
];

const COMMON_TAGS = ['Work', 'Relationships', 'Health', 'Sleep', 'Growth', 'Family', 'Self-Care'];

const EnergyDragSlider = ({ value, onChange, isSkyMode }) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const handleMove = (e) => {
    if (!isDragging) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const newValue = Math.round((x / rect.width) * 4) + 1;
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-xs">
        <label className={`font-bold uppercase tracking-wider ${isSkyMode ? 'text-bluey-700' : 'text-bluey-300'}`}>
          2. Energy Level (1 to 5)
        </label>
        <span className={`font-bold text-sm ${isSkyMode ? 'text-bluey-500' : 'text-bluey-400'}`}>
          {value} / 5
        </span>
      </div>

      <div
        ref={sliderRef}
        className={`relative w-full h-8 sm:h-10 rounded-full cursor-pointer select-none transition-all touch-none ${isSkyMode ? 'bg-cream-200 border border-cream-300 shadow-inner' : 'bg-bluey-950 border border-bluey-800 shadow-inner'
          }`}
        onMouseDown={() => setIsDragging(true)}
        onMouseMove={handleMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0]); }}
        onTouchMove={(e) => handleMove(e.touches[0])}
        onTouchEnd={() => setIsDragging(false)}
      >
        <div
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-100 ${isSkyMode ? 'bg-gradient-to-r from-bluey-200 to-bluey-400' : 'bg-gradient-to-r from-bluey-800 to-bluey-500'}`}
          style={{ width: `${((value - 1) / 4) * 100}%` }}
        />
        <div
          className={`absolute top-1/2 -mt-4 sm:-mt-5 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all duration-100 ${isDragging ? 'scale-110 shadow-bluey-500/50' : ''
            } ${isSkyMode
              ? 'bg-white border-2 border-bluey-300 text-bluey-500'
              : 'bg-bluey-100 border-2 border-bluey-400 text-bluey-900'
            }`}
          style={{ left: `calc(${((value - 1) / 4) * 100}% - 16px)` }}
        >
          {value}
        </div>
      </div>
      <div className={`flex justify-between text-[10px] font-bold uppercase tracking-wider ${isSkyMode ? 'text-bluey-600' : 'text-bluey-400'}`}>
        <span>1 - Empty</span>
        <span>3 - Balanced</span>
        <span>5 - Vibrant</span>
      </div>
    </div>
  );
};

export function MoodCheckIn() {
  const { logMood, mascotState, isSkyMode } = useWellness();

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
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      
      <div className="text-center space-y-2">
        <h2 className={`font-display text-3xl font-bold flex items-center justify-center gap-2 ${isSkyMode ? 'text-bluey-950' : 'text-white'}`}>
          <Heart className={`w-7 h-7 ${isSkyMode ? 'text-seashell-400 fill-seashell-200' : 'text-seashell-400 fill-seashell-400/20'}`} />
          Shoreline Check-In
        </h2>
        <p className={`text-xs sm:text-sm max-w-xl mx-auto font-semibold ${isSkyMode ? 'text-bluey-700' : 'text-bluey-300'}`}>
          Honoring how you feel right now is the first step toward inner resilience.
        </p>
      </div>

      <div className={`rounded-3xl p-6 sm:p-8 shadow-2xl relative transition-all ${isSkyMode ? 'glass-card-day' : 'glass-card-night'}`}>
        
        {submitted ? (
          <div className="py-16 text-center space-y-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce shadow-md ${isSkyMode ? 'bg-white border-bluey-200 shadow-bluey-200' : 'bg-bluey-800 border-bluey-600'}`}>
              ✨
            </div>
            <h3 className={`font-display text-2xl font-bold ${isSkyMode ? 'text-bluey-950' : 'text-white'}`}>
              Check-In Saved!
            </h3>
            <p className={`text-sm max-w-md mx-auto font-semibold ${isSkyMode ? 'text-bluey-700' : 'text-bluey-300'}`}>
              Your reflection has been safely logged. The ocean holds all your feelings without judgment.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="space-y-4">
              <label className={`block text-xs font-bold uppercase tracking-wider ${isSkyMode ? 'text-bluey-700' : 'text-bluey-300'}`}>
                1. How are you feeling right now?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MOOD_OPTIONS.map(item => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedMood(item.name)}
                    className={`p-3 sm:p-4 rounded-2xl border text-left transition-all ${
                      selectedMood === item.name
                        ? `${isSkyMode ? 'bg-white border-bluey-400 shadow-md shadow-bluey-200 ring-2 ring-bluey-300' : 'bg-bluey-800 border-bluey-500 shadow-lg shadow-bluey-900 ring-2 ring-bluey-500'} scale-[1.02]`
                        : (isSkyMode ? 'border-cream-300 bg-cream-100/50 text-bluey-800 hover:bg-white hover:border-bluey-200' : 'border-bluey-800 bg-bluey-900/40 text-bluey-300 hover:border-bluey-700 hover:bg-bluey-900')
                    }`}
                  >
                    <div className="text-2xl mb-1">{item.emoji}</div>
                    <div className={`font-bold text-sm ${selectedMood === item.name ? (isSkyMode ? 'text-bluey-900' : 'text-white') : ''}`}>{item.name}</div>
                    <div className={`text-[10px] sm:text-xs mt-0.5 ${selectedMood === item.name ? (isSkyMode ? 'text-bluey-600' : 'text-bluey-200') : (isSkyMode ? 'text-bluey-600/70' : 'text-bluey-400')}`}>{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <EnergyDragSlider value={energyLevel} onChange={setEnergyLevel} isSkyMode={isSkyMode} />

            <div className="space-y-3">
              <label className={`block text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isSkyMode ? 'text-bluey-700' : 'text-bluey-300'}`}>
                <Tag className="w-3.5 h-3.5" />
                3. What area is influencing your state?
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedTags.includes(tag)
                        ? (isSkyMode ? 'bg-bluey-500 text-white shadow-md shadow-bluey-300 border border-bluey-600' : 'bg-bluey-500 text-white shadow-md shadow-bluey-900/50')
                        : (isSkyMode ? 'bg-white border border-bluey-200 text-bluey-800 hover:border-bluey-400' : 'bg-bluey-900/60 border border-bluey-700 text-bluey-300 hover:border-bluey-500')
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className={`block text-xs font-bold uppercase tracking-wider ${isSkyMode ? 'text-bluey-700' : 'text-bluey-300'}`}>
                4. Private Reflection (Optional)
              </label>
              <textarea
                value={reflection}
                onChange={e => setReflection(e.target.value)}
                placeholder="Express your thoughts freely here like writing in the sand..."
                rows={3}
                className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium focus:ring-2 resize-none transition-colors ${
                  isSkyMode 
                    ? 'bg-white/80 border-bluey-200 text-bluey-950 placeholder-bluey-400 focus:border-bluey-400 focus:ring-bluey-200' 
                    : 'bg-bluey-950/60 border-bluey-700 text-bluey-50 placeholder-bluey-500 focus:border-bluey-500 focus:ring-bluey-800'
                }`}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-xl flex items-center justify-center gap-2 ${
                isSkyMode
                  ? 'bg-gradient-to-r from-bluey-500 to-bluey-400 text-white shadow-bluey-400/30 hover:shadow-bluey-400/50 hover:-translate-y-0.5'
                  : 'bg-gradient-to-r from-bluey-600 to-bluey-500 text-white shadow-bluey-900/50 hover:shadow-bluey-900/70 hover:-translate-y-0.5'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              Save Check-In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
