import React, { useState, useRef } from 'react';
import { Heart, CheckCircle2, Tag } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import { OtterMascot } from './OtterMascot';
import journalSvg from '../assets/svg/diariodegratitudmarina.svg';

const MOOD_META = [
  {
    name: 'Calm', emoji: '🌊', desc: 'Peaceful & grounded',
    medallion: 'bg-lagoon-200/70',
    reaction: { expression: 'caring', speech: "Mmm... peaceful. I feel that too." },
  },
  {
    name: 'Happy', emoji: '☀️', desc: 'Joyful & energized',
    medallion: 'bg-dune-200/80',
    reaction: { expression: 'joyful', speech: 'Yay! Your joy is contagious!' },
  },
  {
    name: 'Hopeful', emoji: '🌱', desc: 'Optimistic & focused',
    medallion: 'bg-foliage-300/50',
    reaction: { expression: 'joyful', speech: "I love that hopeful spark in you." },
  },
  {
    name: 'Anxious', emoji: '🌀', desc: 'Restless or uneasy',
    medallion: 'bg-lagoon-300/60',
    reaction: { expression: 'caring', speech: "I'm right here with you. Let's breathe together." },
  },
  {
    name: 'Overwhelmed', emoji: '🌧️', desc: 'Too much to carry',
    medallion: 'bg-blush-300/70',
    reaction: { expression: 'caring', speech: "That's a lot to hold. You don't have to carry it alone." },
  },
  {
    name: 'Exhausted', emoji: '🌙', desc: 'Low energy & tired',
    medallion: 'bg-otterfur-200/60',
    reaction: { expression: 'caring', speech: 'Rest is productive too. Be gentle with yourself.' },
  },
];

const COMMON_TAGS = ['Work', 'Relationships', 'Health', 'Sleep', 'Growth', 'Family', 'Self-Care'];

function MoodButton({ item, isSelected, isSkyMode, onSelect }) {
  const [justPicked, setJustPicked] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => { onSelect(item.name); setJustPicked(true); }}
      onAnimationEnd={() => setJustPicked(false)}
      className={`group relative flex flex-col items-center gap-1.5 sm:gap-2 rounded-2xl sm:rounded-3xl border-2 p-3 sm:p-4 text-center transition-all duration-300 ease-out
        active:scale-95 hover:-translate-y-0.5
        ${justPicked ? 'animate-select-pop' : ''}
        ${isSelected
          ? (isSkyMode
              ? 'border-lagoon-400 bg-white shadow-lg shadow-lagoon-200/60 ring-2 ring-lagoon-300/70 scale-[1.03]'
              : 'border-lagoon-400 bg-lagoon-900/50 shadow-lg shadow-black/30 ring-2 ring-lagoon-500/60 scale-[1.03]')
          : (isSkyMode
              ? 'border-lagoon-100 bg-white/60 hover:border-lagoon-300 hover:bg-white hover:shadow-md'
              : 'border-lagoon-800/60 bg-lagoon-950/30 hover:border-lagoon-600 hover:bg-lagoon-900/40')
        }`}
    >
      {/* Ripple ring echoing the otter's water rings, only on fresh selection */}
      {justPicked && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-lagoon-300 animate-pick-ripple"
        />
      )}

      <span
        className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full shrink-0 transition-transform duration-300 ${item.medallion} ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}
      >
        <span className="text-[clamp(1.15rem,4.5vw,1.6rem)] leading-none" role="img" aria-hidden="true">{item.emoji}</span>
      </span>

      <span className={`font-bold text-xs sm:text-sm ${isSelected ? (isSkyMode ? 'text-lagoon-900' : 'text-white') : (isSkyMode ? 'text-lagoon-950' : 'text-lagoon-100')}`}>
        {item.name}
      </span>
      <span className={`text-[10px] sm:text-xs leading-snug ${isSelected ? (isSkyMode ? 'text-lagoon-700' : 'text-lagoon-200') : (isSkyMode ? 'text-lagoon-700/70' : 'text-lagoon-400')}`}>
        {item.desc}
      </span>
    </button>
  );
}

const EnergyDragSlider = ({ value, onChange, isSkyMode }) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  // Shared by click-to-jump and drag: turns any pointer X position into a 1-5 value.
  const commitFromClientX = (clientX) => {
    const rect = sliderRef.current.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const newValue = Math.round((x / rect.width) * 4) + 1;
    onChange(newValue);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    commitFromClientX(e.clientX);
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    commitFromClientX(e.clientX);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    commitFromClientX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    commitFromClientX(e.touches[0].clientX);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onChange(Math.min(5, value + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onChange(Math.max(1, value - 1));
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex justify-between items-center text-xs">
        <label className={`font-bold uppercase tracking-wider ${isSkyMode ? 'text-lagoon-800' : 'text-lagoon-300'}`}>
          2. Energy Level (1 to 5)
        </label>
        <span className={`font-bold text-sm ${isSkyMode ? 'text-lagoon-600' : 'text-lagoon-400'}`}>
          {value} / 5
        </span>
      </div>

      <div
        ref={sliderRef}
        role="slider"
        aria-label="Energy level, 1 to 5"
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuenow={value}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={`relative w-full h-9 sm:h-11 rounded-full cursor-pointer select-none transition-all touch-none ${isSkyMode ? 'bg-dune-100 border border-dune-300 shadow-inner' : 'bg-lagoon-950 border border-lagoon-800 shadow-inner'
          }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setIsDragging(false)}
      >
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-150 bg-gradient-to-r from-dune-300 to-lagoon-400"
          style={{ width: `${((value - 1) / 4) * 100}%` }}
        />
        <div
          className={`absolute top-1/2 -mt-4 sm:-mt-5 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all duration-150 ${isDragging ? 'scale-110 shadow-lagoon-400/60' : ''
            } ${isSkyMode
              ? 'bg-white border-2 border-lagoon-400 text-lagoon-600'
              : 'bg-lagoon-100 border-2 border-lagoon-400 text-lagoon-900'
            }`}
          style={{ left: `calc(${((value - 1) / 4) * 100}% - 16px)` }}
        >
          {value}
        </div>
      </div>
      <div className={`flex justify-between text-[10px] font-bold uppercase tracking-wider ${isSkyMode ? 'text-lagoon-700' : 'text-lagoon-400'}`}>
        <span>1 - Empty</span>
        <span>3 - Balanced</span>
        <span>5 - Vibrant</span>
      </div>
    </div>
  );
};

function SeaweedFlourish({ className }) {
  return (
    <svg viewBox="0 0 40 60" className={className} aria-hidden="true">
      <path d="M20 58 C20 40, 8 40, 10 22 C12 8, 20 8, 20 2" stroke="#7E7B51" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M20 50 C20 34, 30 34, 28 18" stroke="#A89B6E" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function ShellFlourish({ className }) {
  return (
    <svg viewBox="0 0 40 32" className={className} aria-hidden="true">
      <path d="M4 26 C2 16, 30 16, 28 26 C30 30, 2 30, 4 26 Z" fill="#C99C8B" opacity="0.5" />
      <path d="M16 28 L10 16" stroke="#FEF8F7" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <path d="M16 28 L16 14" stroke="#FEF8F7" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <path d="M16 28 L22 16" stroke="#FEF8F7" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export function MoodCheckIn() {
  const { logMood, mascotState, isSkyMode } = useWellness();

  const [selectedMood, setSelectedMood] = useState('Calm');
  const [energyLevel, setEnergyLevel] = useState(3);
  const [selectedTags, setSelectedTags] = useState([]);
  const [reflection, setReflection] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const liveReaction = MOOD_META.find(m => m.name === selectedMood)?.reaction
    ?? { expression: 'caring', speech: 'Pick whichever feeling fits best right now.' };

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
    <div className="relative max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-10">

      {/* Ambient watercolor blobs, purely decorative */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-6 h-64 overflow-hidden -z-10">
        <div className={`absolute left-0 top-0 w-72 h-72 rounded-full blur-3xl ${isSkyMode ? 'bg-lagoon-200/50' : 'bg-lagoon-700/20'}`} />
        <div className={`absolute right-0 top-6 w-80 h-80 rounded-full blur-3xl ${isSkyMode ? 'bg-blush-200/50' : 'bg-otterfur-500/10'}`} />
      </div>

      <div className="text-center space-y-4">
        <div className="flex justify-center mb-2">
          <img src={journalSvg} alt="Marine Gratitude Journal" className="w-28 h-28 object-contain drop-shadow-lg" />
        </div>
        <h2 className={`font-display text-3xl font-bold flex items-center justify-center gap-2 ${isSkyMode ? 'text-lagoon-950' : 'text-white'}`}>
          <Heart className={`w-7 h-7 ${isSkyMode ? 'text-blush-300 fill-blush-200' : 'text-blush-300 fill-blush-300/20'}`} />
          Shoreline Check-In
        </h2>
        <p className={`text-xs sm:text-sm max-w-xl mx-auto font-semibold ${isSkyMode ? 'text-lagoon-700' : 'text-lagoon-300'}`}>
          Honoring how you feel right now is the first step toward inner resilience.
        </p>
      </div>

      <div className={`relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 lg:p-10 shadow-2xl transition-all border
        ${isSkyMode
          ? 'bg-gradient-to-br from-white via-lagoon-50 to-blush-100 border-white/60'
          : 'bg-gradient-to-br from-lagoon-950 via-lagoon-900 to-[#1a2f38] border-lagoon-800'}`}
      >
        <SeaweedFlourish className="hidden sm:block absolute -bottom-2 left-4 w-8 h-14 opacity-70" />
        <ShellFlourish className="hidden sm:block absolute bottom-4 right-6 w-10 h-8 opacity-70" />

        {submitted ? (
          <div className="relative py-10 sm:py-14 text-center space-y-5">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <span className={`absolute inset-0 rounded-full border-2 animate-ripple ${isSkyMode ? 'border-lagoon-300/70' : 'border-lagoon-500/50'}`} />
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-md ${isSkyMode ? 'bg-white border border-lagoon-200' : 'bg-lagoon-800 border border-lagoon-600'}`}>
                ✨
              </div>
            </div>
            <h3 className={`font-display text-2xl font-bold ${isSkyMode ? 'text-lagoon-950' : 'text-white'}`}>
              Check-In Saved!
            </h3>
            <p className={`text-sm max-w-md mx-auto font-semibold ${isSkyMode ? 'text-lagoon-700' : 'text-lagoon-300'}`}>
              Your reflection has been safely logged. The ocean holds all your feelings without judgment.
            </p>
            <div className="pt-2">
              <OtterMascot expression={mascotState.expression} speech={mascotState.speech} compact />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative space-y-7 sm:space-y-8">

            {/* Otter reacting live to whichever mood is currently selected */}
            <div className={`rounded-2xl sm:rounded-3xl p-1 -mx-1 -mt-1 mb-1 transition-colors duration-500`}>
              <OtterMascot expression={liveReaction.expression} speech={liveReaction.speech} compact />
            </div>

            {/* Two-column layout on wide screens so the form actually uses the space */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-10">

              <div className="space-y-4">
                <label className={`block text-xs font-bold uppercase tracking-wider ${isSkyMode ? 'text-lagoon-800' : 'text-lagoon-300'}`}>
                  1. How are you feeling right now?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-3">
                  {MOOD_META.map(item => (
                    <MoodButton
                      key={item.name}
                      item={item}
                      isSelected={selectedMood === item.name}
                      isSkyMode={isSkyMode}
                      onSelect={setSelectedMood}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-7 sm:space-y-8">
                <EnergyDragSlider value={energyLevel} onChange={setEnergyLevel} isSkyMode={isSkyMode} />

                <div className="space-y-3">
                  <label className={`block text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isSkyMode ? 'text-lagoon-800' : 'text-lagoon-300'}`}>
                    <Tag className="w-3.5 h-3.5" />
                    3. What area is influencing your state?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_TAGS.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        aria-pressed={selectedTags.includes(tag)}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 hover:-translate-y-0.5 ${
                          selectedTags.includes(tag)
                            ? (isSkyMode ? 'bg-lagoon-500 text-white shadow-md shadow-lagoon-300/50 border border-lagoon-600' : 'bg-lagoon-500 text-white shadow-md shadow-black/30')
                            : (isSkyMode ? 'bg-white border border-lagoon-200 text-lagoon-800 hover:border-lagoon-400' : 'bg-lagoon-900/60 border border-lagoon-700 text-lagoon-300 hover:border-lagoon-500')
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isSkyMode ? 'text-lagoon-800' : 'text-lagoon-300'}`}>
                    4. Private Reflection (Optional)
                  </label>
                  <textarea
                    value={reflection}
                    onChange={e => setReflection(e.target.value)}
                    placeholder="Express your thoughts freely here like writing in the sand..."
                    rows={4}
                    className={`w-full px-4 py-3 rounded-2xl sm:rounded-3xl border text-sm font-medium focus:ring-2 resize-none transition-colors ${
                      isSkyMode
                        ? 'bg-white/70 border-lagoon-200 text-lagoon-950 placeholder-lagoon-400 focus:border-lagoon-400 focus:ring-lagoon-200'
                        : 'bg-lagoon-950/50 border-lagoon-700 text-lagoon-50 placeholder-lagoon-500 focus:border-lagoon-500 focus:ring-lagoon-800'
                    }`}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl font-bold text-sm tracking-wide transition-all duration-300 shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] hover:-translate-y-0.5 ${
                isSkyMode
                  ? 'bg-gradient-to-r from-lagoon-500 to-lagoon-400 text-white shadow-lagoon-400/30 hover:shadow-lagoon-400/50'
                  : 'bg-gradient-to-r from-lagoon-600 to-lagoon-500 text-white shadow-black/40 hover:shadow-lagoon-900/60'
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
