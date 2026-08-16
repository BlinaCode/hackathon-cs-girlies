import React, { useState, useRef, useMemo } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import { useAuth } from '../context/AuthContext';
import { OtterMascot } from './OtterMascot';
import journalSvg from '../assets/svg/diariodegratitudmarina.svg';
import conchaSvg from '../assets/svg/concha.svg';
import estrellaSvg from '../assets/svg/estrellademar.svg';
import algasSvg from '../assets/svg/algas.svg';

const MOOD_META = [
  { name: 'Calm', desc: 'Peaceful & grounded' },
  { name: 'Happy', desc: 'Joyful & energized' },
  { name: 'Hopeful', desc: 'Optimistic & focused' },
  { name: 'Anxious', desc: 'Restless or uneasy' },
  { name: 'Overwhelmed', desc: 'Too much to carry' },
  { name: 'Exhausted', desc: 'Low energy & tired' },
];

const COMMON_TAGS = ['Work', 'Relationships', 'Health', 'Sleep', 'Growth', 'Family', 'Self-Care'];

// --- PAST ENTRIES JOURNAL COMPONENT ---
function PastEntriesJournal({ logs, isSkyMode }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasLogs = logs && logs.length > 0;
  const selectedLog = hasLogs ? logs[currentIndex] : null;

  const [calendarDate, setCalendarDate] = useState(new Date());

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCalendarDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCalendarDate(new Date(year, month + 1, 1));

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const handlePrevEntry = () => {
    if (currentIndex < logs.length - 1) {
      setCurrentIndex(prev => prev + 1);
      const newDate = new Date(logs[currentIndex + 1].timestamp);
      setCalendarDate(newDate);
    }
  };

  const handleNextEntry = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      const newDate = new Date(logs[currentIndex - 1].timestamp);
      setCalendarDate(newDate);
    }
  };

  const logIndexByDay = useMemo(() => {
    const map = {};
    logs.forEach((log, idx) => {
      const date = new Date(log.timestamp);
      if (date.getFullYear() === year && date.getMonth() === month) {
        if (map[date.getDate()] === undefined) {
          map[date.getDate()] = idx; 
        }
      }
    });
    return map;
  }, [logs, year, month]);

  return (
    <div className="flex flex-col h-full relative z-10 space-y-6">
      {/* Mini Calendar Header */}
      <div className={`flex flex-col border-b pb-4 ${isSkyMode ? 'border-[#E5E5E5]' : 'border-midnight-800'}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-lg tracking-wide">{monthNames[month]} {year}</h3>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="hover:opacity-60 transition-opacity p-1" aria-label="Previous Month">
              <ChevronLeft strokeWidth={1} size={16} />
            </button>
            <button onClick={handleNextMonth} className="hover:opacity-60 transition-opacity p-1" aria-label="Next Month">
              <ChevronRight strokeWidth={1} size={16} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-y-2 text-center font-serif text-xs sm:text-sm italic opacity-80 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="font-semibold">{d}</div>)}
        </div>
        
        <div className="grid grid-cols-7 gap-y-2 text-center font-display text-sm sm:text-base">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const logIdx = logIndexByDay[day];
            const hasLog = logIdx !== undefined;
            const isSelected = hasLog && logIdx === currentIndex;
            
            return (
              <button
                key={day}
                onClick={() => {
                  if (hasLog) {
                    setCurrentIndex(logIdx);
                  }
                }}
                disabled={!hasLog}
                className={`relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 mx-auto rounded-full transition-all duration-300
                  ${hasLog ? 'cursor-pointer hover:scale-110' : 'opacity-40 cursor-default'}
                  ${isSelected ? (isSkyMode ? 'text-lagoon-950 font-bold' : 'text-white font-bold') : ''}
                `}
              >
                {isSelected && (
                  <img src={estrellaSvg} alt="" className="absolute inset-0 w-full h-full opacity-30 transform rotate-12" aria-hidden="true" />
                )}
                <span className="z-10">{day}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mascot Footer */}
      <div className="flex justify-center -my-2 relative z-20">
         <div className="transform scale-[0.85] origin-center">
           <OtterMascot expression={selectedLog ? 'caring' : 'default'} speech={selectedLog ? "The ocean remembers." : "I'm listening."} compact />
         </div>
      </div>

      {/* Main Journal Entry View */}
      <div className="flex-1 flex flex-col justify-start pt-2">
        {selectedLog ? (
          <div className="relative">
            <div className="flex items-center justify-between mb-4 opacity-50">
              <span className="font-serif italic text-sm">{new Date(selectedLog.timestamp).toLocaleDateString()}</span>
              <span className="font-serif italic text-sm text-right">Page {logs.length - currentIndex} of {logs.length}</span>
            </div>
            
            <div className="flex items-center justify-between gap-2 sm:gap-4">
               <button onClick={handlePrevEntry} disabled={currentIndex === logs.length - 1} className={`p-1 sm:p-2 rounded-full transition-colors ${currentIndex === logs.length - 1 ? 'opacity-20 cursor-default' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>
                 <ChevronLeft strokeWidth={1} />
               </button>
               
               <div className="flex-1 space-y-4 min-h-[160px]">
                 <div className="flex justify-between items-end">
                   <h4 className="font-display text-2xl sm:text-3xl">{selectedLog.mood}</h4>
                   <span className="font-serif italic opacity-70 text-sm">Energy: {selectedLog.energyLevel}/5</span>
                 </div>
                 <p className="font-serif italic leading-relaxed opacity-90 text-sm sm:text-base line-clamp-4">
                   "{selectedLog.reflection || 'No reflection recorded.'}"
                 </p>
                 {selectedLog.tags?.length > 0 && (
                   <div className="flex flex-wrap gap-2 opacity-60 text-[10px] sm:text-xs font-medium uppercase tracking-widest pt-2">
                     {selectedLog.tags.join(' • ')}
                   </div>
                 )}
               </div>
               
               <button onClick={handleNextEntry} disabled={currentIndex === 0} className={`p-1 sm:p-2 rounded-full transition-colors ${currentIndex === 0 ? 'opacity-20 cursor-default' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>
                 <ChevronRight strokeWidth={1} />
               </button>
            </div>
          </div>
        ) : (
          <div className="text-center opacity-50 space-y-2">
            <p className="font-serif italic">No past entries found.</p>
            <p className="text-xs">Your journal is waiting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
// --- END PAST ENTRIES JOURNAL ---

function MoodTextOption({ item, isSelected, isSkyMode, onSelect }) {
  return (
    <div className="relative">
      <input
        type="radio"
        name="mood"
        id={`mood-${item.name}`}
        value={item.name}
        checked={isSelected}
        onChange={() => onSelect(item.name)}
        className="peer sr-only"
        aria-label={item.name}
      />
      <label
        htmlFor={`mood-${item.name}`}
        className={`block cursor-pointer py-2 border-b transition-all duration-300
          peer-focus-visible:ring-2 peer-focus-visible:ring-lagoon-400 peer-focus-visible:outline-none
          ${isSelected 
            ? (isSkyMode ? 'border-lagoon-800' : 'border-lagoon-200')
            : (isSkyMode ? 'border-transparent hover:border-lagoon-300' : 'border-transparent hover:border-lagoon-600')
          }`}
      >
        <div className={`font-display text-lg sm:text-xl transition-colors duration-300 ${isSelected ? (isSkyMode ? 'text-lagoon-950 font-semibold' : 'text-white font-semibold') : (isSkyMode ? 'text-lagoon-700' : 'text-lagoon-300')}`}>
          {item.name}
        </div>
        <div className={`text-xs sm:text-sm italic transition-colors duration-300 ${isSelected ? (isSkyMode ? 'text-lagoon-800' : 'text-lagoon-100') : (isSkyMode ? 'text-lagoon-500' : 'text-lagoon-400')}`}>
          {item.desc}
        </div>
      </label>
    </div>
  );
}

const EnergyDragSlider = ({ value, onChange, isSkyMode }) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const commitFromClientX = (clientX) => {
    if (!sliderRef.current) return;
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
    <div className="space-y-2">
      <div className="flex justify-between items-end mb-1">
        <label className={`font-display text-lg ${isSkyMode ? 'text-lagoon-900' : 'text-lagoon-100'}`} id="energy-label">
          Energy Level
        </label>
        <span className={`font-serif text-sm italic ${isSkyMode ? 'text-lagoon-700' : 'text-lagoon-300'}`}>
          {value} / 5
        </span>
      </div>

      <div
        ref={sliderRef}
        role="slider"
        aria-labelledby="energy-label"
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuenow={value}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative w-full h-12 flex items-center cursor-pointer touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon-400 rounded-lg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setIsDragging(false)}
      >
        {/* Track */}
        <div className={`w-full h-[6px] rounded-full relative ${isSkyMode ? 'bg-lagoon-200' : 'bg-lagoon-800'}`}>
          {/* Fill */}
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-out bg-current opacity-60"
            style={{ width: `${((value - 1) / 4) * 100}%` }}
          />
          {/* Thumb */}
          <div
            className={`absolute top-1/2 -mt-[10px] w-5 h-5 rounded-full shadow-md transition-all duration-200 ${isDragging ? 'scale-[1.3]' : 'hover:scale-[1.15]'} ${isSkyMode ? 'bg-lagoon-900' : 'bg-lagoon-100'}`}
            style={{ left: `calc(${((value - 1) / 4) * 100}% - 10px)` }}
          />
        </div>
      </div>
      <div className={`flex justify-between text-xs italic font-serif pt-1 ${isSkyMode ? 'text-lagoon-500' : 'text-lagoon-400'}`}>
        <span>Empty</span>
        <span>Balanced</span>
        <span>Vibrant</span>
      </div>
    </div>
  );
};

export function MoodCheckIn() {
  const { logMood, isSkyMode, moodLogs } = useWellness();
  const { user } = useAuth();

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
    setTimeout(() => {
      setSubmitted(false);
      setReflection('');
      setSelectedTags([]);
    }, 4000);
  };

  return (
    <section aria-label="Sisu Gratitude Diary" className="relative w-full max-w-[1200px] mx-auto pb-16 px-4 sm:px-6">
      
      {/* Background blurs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className={`absolute top-0 left-1/4 w-[40vw] h-[40vw] rounded-full blur-[100px] mix-blend-multiply opacity-30 ${isSkyMode ? 'bg-sand-200' : 'bg-lagoon-900'}`} />
        <div className={`absolute bottom-0 right-1/4 w-[30vw] h-[30vw] rounded-full blur-[80px] mix-blend-multiply opacity-20 ${isSkyMode ? 'bg-lagoon-100' : 'bg-otterfur-900'}`} />
      </div>

      {/* Two-page book layout */}
      <div className="flex flex-col lg:flex-row gap-0 w-full perspective-[2000px]">
        
        {/* LEFT PAGE (Calendar) */}
        <div className={`flex-1 lg:w-1/2 rounded-t-[1.5rem] lg:rounded-tr-none lg:rounded-l-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 ease-in-out border lg:border-r-0 lg:origin-right animate-book-page-left relative overflow-hidden
          ${isSkyMode
            ? 'bg-[#FAFAFA] border-[#E5E5E5] text-lagoon-950'
            : 'bg-midnight-950 border-midnight-800 text-midnight-text'}`}
        >
          {/* Decorative SVGs */}
          <div className="absolute top-0 left-0 opacity-15 pointer-events-none w-24 sm:w-32 -translate-x-4 -translate-y-4">
            <img src={estrellaSvg} alt="" className="w-full h-auto transform -rotate-12" aria-hidden="true" />
          </div>
          <div className="absolute top-0 right-0 opacity-40 pointer-events-none w-48 sm:w-64 -translate-y-4 translate-x-4">
            <img src={journalSvg} alt="" className="w-full h-auto" aria-hidden="true" />
          </div>
          
          <div className="p-8 sm:p-12 h-full flex flex-col relative min-h-[70vh] z-10">
            <PastEntriesJournal logs={moodLogs} isSkyMode={isSkyMode} />
          </div>
        </div>

        {/* RIGHT PAGE (Form) */}
        <div className={`flex-1 lg:w-1/2 rounded-b-[1.5rem] lg:rounded-bl-none lg:rounded-r-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 ease-in-out border lg:border-l-0 lg:origin-left animate-book-page-right relative overflow-hidden
          ${isSkyMode
            ? 'bg-[#FDFDFD] border-[#E5E5E5] text-lagoon-950'
            : 'bg-midnight-900 border-midnight-800 text-midnight-text'}`}
        >
          {/* Decorative SVGs */}
          <div className="absolute bottom-0 right-0 opacity-[0.15] pointer-events-none w-48 sm:w-64 translate-x-4 translate-y-4">
            <img src={algasSvg} alt="" className="w-full h-auto" aria-hidden="true" />
          </div>
          <div className="absolute top-0 right-0 opacity-[0.15] pointer-events-none w-48 sm:w-56 translate-x-8 -translate-y-4">
            <img src={conchaSvg} alt="" className="w-full h-auto transform rotate-12" aria-hidden="true" />
          </div>
          {submitted ? (
            <div className="relative p-8 sm:p-12 text-center space-y-6 h-full flex flex-col items-center justify-center z-10">
              <h3 className="font-display text-3xl sm:text-4xl font-normal tracking-tight">
                Entry Saved
              </h3>
              <p className="text-sm sm:text-base max-w-sm mx-auto font-serif italic opacity-70">
                Your reflection has been safely logged. The ocean holds all your feelings without judgment.
              </p>
              <div className="pt-6">
                <OtterMascot expression="caring" speech="Thank you for sharing your thoughts." compact />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 sm:p-12 h-full flex flex-col justify-between space-y-10 min-h-[70vh] relative z-10">
              
              <div className="space-y-4">
                <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tight leading-tight">
                  Shoreline <br className="hidden sm:block" />
                  <span className="italic opacity-60">Check-In</span>
                </h2>
                <p className="text-sm sm:text-base max-w-sm font-serif italic opacity-70 leading-relaxed">
                  Honoring how you feel right now is the first step toward inner resilience.
                </p>
              </div>

              <fieldset className="space-y-4">
                <legend className="font-display text-xl mb-4">
                  How are you feeling right now?
                </legend>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {MOOD_META.map(item => (
                    <MoodTextOption
                      key={item.name}
                      item={item}
                      isSelected={selectedMood === item.name}
                      isSkyMode={isSkyMode}
                      onSelect={setSelectedMood}
                    />
                  ))}
                </div>
              </fieldset>

              <EnergyDragSlider value={energyLevel} onChange={setEnergyLevel} isSkyMode={isSkyMode} />

              <fieldset className="space-y-3">
                <legend className="font-display text-lg mb-2">
                  What is influencing your state?
                </legend>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {COMMON_TAGS.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleTag(tag)}
                        className={`text-sm font-serif italic transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lagoon-400 border-b border-transparent ${
                          isSelected
                            ? (isSkyMode ? 'text-lagoon-950 font-semibold border-lagoon-950' : 'text-white font-semibold border-white')
                            : (isSkyMode ? 'text-lagoon-600 hover:text-lagoon-900' : 'text-lagoon-400 hover:text-lagoon-200')
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="space-y-2">
                <label htmlFor="reflection" className="block font-display text-lg">
                  Private Reflection
                </label>
                <textarea
                  id="reflection"
                  value={reflection}
                  onChange={e => setReflection(e.target.value)}
                  placeholder="Start writing..."
                  rows={3}
                  className={`w-full py-2 bg-transparent text-base font-serif italic transition-all duration-300 resize-none focus:outline-none border-b focus:border-current opacity-80 focus:opacity-100 ${
                    isSkyMode
                      ? 'border-[#E5E5E5] placeholder-lagoon-400'
                      : 'border-midnight-800 placeholder-midnight-muted'
                  }`}
                />
              </div>

              <div className="pt-6 mt-auto">
                <button
                  type="submit"
                  disabled={!user}
                  className={`w-full py-3 border-b-2 font-display text-lg transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current ${
                    !user 
                      ? 'opacity-40 cursor-not-allowed border-transparent bg-black/5'
                      : (isSkyMode
                        ? 'border-lagoon-900 hover:border-lagoon-600 hover:text-lagoon-700'
                        : 'border-lagoon-200 hover:border-lagoon-400 hover:text-lagoon-300')
                  }`}
                >
                  {user ? 'Close Entry' : 'Sign in to save entry'}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </section>
  );
}
