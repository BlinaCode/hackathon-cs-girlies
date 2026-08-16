import React, { useState } from 'react';
import { BookOpen, CheckCircle, Clock, Search, X, Sparkles, Compass, Brain, Moon, Heart } from 'lucide-react';
import { STARTER_RESOURCES } from '../services/resourcesData';
import { useWellness } from '../context/WellnessContext';
import { OtterMascot } from './OtterMascot';
import { CountryCrisisLines } from './CountryCrisisLines';

export function ResourceHub() {
  const { completedResources, toggleResourceCompletion, mascotState, isSkyMode } = useWellness();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);

  const categories = ['All', 'Anxiety & Panic Relief', 'Cognitive Reframing', 'Sleep & Relaxation', 'Mindfulness & Self-Care'];

  const filteredResources = STARTER_RESOURCES.filter(res => {
    const matchesCat = activeCategory === 'All' || res.category === activeCategory;
    const matchesQuery = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         res.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const getResourceIcon = (iconName) => {
    switch (iconName) {
      case 'Brain': return <Brain className="w-5 h-5 text-purple-400" />;
      case 'Moon': return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'Heart': return <Heart className="w-5 h-5 text-rose-400" />;
      case 'Compass':
      default: return <Compass className="w-5 h-5 text-seafoam-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className={`font-display text-3xl font-bold flex items-center justify-center gap-2 ${isSkyMode ? 'text-bluey-950' : 'text-white'}`}>
          <BookOpen className={`w-7 h-7 ${isSkyMode ? 'text-bluey-500' : 'text-seafoam-400'}`} />
          Smart Mental Health Library
        </h2>
        <p className={`text-xs sm:text-sm max-w-xl mx-auto font-semibold ${isSkyMode ? 'text-bluey-700' : 'text-bluey-300'}`}>
          Evidence-based guides, grounding practices, and CBT tools available whenever you need guidance.
        </p>
      </div>

      <OtterMascot expression={mascotState.expression} speech={mascotState.speech} />

      <CountryCrisisLines />

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 w-full sm:w-auto py-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? (isSkyMode ? 'bg-bluey-500 text-white shadow-md' : 'bg-bluey-600 text-white shadow-md shadow-bluey-900/50')
                  : (isSkyMode ? 'bg-white border border-bluey-200 text-bluey-800 hover:border-bluey-400' : 'bg-bluey-900/60 border border-bluey-700 text-bluey-300 hover:border-bluey-500')
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-bluey-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search guides..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl border text-sm font-medium focus:ring-2 resize-none transition-colors ${
              isSkyMode 
                ? 'bg-white/80 border-bluey-200 text-bluey-950 placeholder-bluey-400 focus:border-bluey-400 focus:ring-bluey-200' 
                : 'bg-bluey-950/60 border-bluey-700 text-bluey-50 placeholder-bluey-500 focus:border-bluey-500 focus:ring-bluey-800'
            }`}
          />
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
        {filteredResources.map((res, idx) => {
          const isCompleted = completedResources.includes(res.id);
          return (
            <div
              key={res.id}
              className="relative p-6 sm:p-8 min-h-[440px] overflow-visible"
            >
              <div
                className={`absolute inset-0 transition-colors duration-700`}
                style={{ borderRadius: '100% 90% 55% 85% / 80% 90% 55% 100%', background: isSkyMode ? 'linear-gradient(160deg, #4DD0E1, #00897B)' : 'linear-gradient(160deg, #0F3440, #1F4E5B)' }}
              >
                {/* Faint concentric wave lines, echoing your header wave SVG */}
                <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M5 55 Q 50 45 95 55" stroke="white" strokeWidth="0.8" fill="none" opacity="0.5" />
                  <path d="M8 68 Q 50 60 92 68" stroke="white" strokeWidth="0.6" fill="none" opacity="0.35" />
                </svg>
                {/* Floating foam using your existing animate-foam-1 / animate-foam-2 keyframes */}
                <span className="absolute top-3 left-5 text-base animate-foam-1 opacity-80">🫧</span>
                <span className="absolute bottom-5 right-6 text-sm animate-foam-2 opacity-70">🫧</span>
              </div>
              <div
                className="relative p-6 space-y-3 shadow-xl transition-transform hover:-translate-y-1 h-full flex flex-col justify-between"
                style={{
                  background: isSkyMode ? 'linear-gradient(135deg, #FDF6E2, #EAD5A0)' : 'linear-gradient(135deg, #0F3440, #061B24)',
                  borderRadius: '58% 42% 45% 55% / 48% 55% 45% 52%',
                  margin: '16px'
                }}
              >
                <div className="absolute -top-5 left-8 text-2xl drop-shadow-md">🌴</div>
                <div className="absolute -top-4 -left-2 text-4xl drop-shadow-lg z-20">🌴</div>
                <div className="absolute -top-2 left-8 text-3xl drop-shadow-lg z-20 -scale-x-100">🌴</div>
                <div className="absolute -bottom-3 -right-3 text-4xl drop-shadow-lg z-20">🌴</div>
                <div className="absolute bottom-4 -right-1 text-2xl drop-shadow-lg z-20 -scale-x-100">🌴</div>
                <div className="absolute top-1/3 -right-2 text-xl drop-shadow z-20">🪨</div>
                <div className="absolute bottom-8 -left-3 text-lg drop-shadow z-20">🪨</div>
                <div className="space-y-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className={`p-2 rounded-xl border ${isSkyMode ? 'bg-white/50 border-bluey-900/10' : 'bg-bluey-900/50 border-bluey-700'}`}>
                      {getResourceIcon(res.icon)}
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${isSkyMode ? 'text-bluey-600' : 'text-bluey-300'}`}>
                      {res.category}
                    </span>
                    <span className={`text-[11px] flex items-center gap-1 font-semibold ${isSkyMode ? 'text-bluey-800' : 'text-bluey-400'}`}>
                      <Clock className="w-3 h-3" />
                      {res.readTime}
                    </span>
                  </div>

                  <h3 className={`font-display font-bold text-lg leading-snug ${isSkyMode ? 'text-bluey-950' : 'text-white'}`}>
                    {res.title}
                  </h3>
                  <p className={`text-xs leading-relaxed break-words overflow-wrap-anywhere max-w-[90%] mx-auto font-medium ${isSkyMode ? 'text-bluey-900/80' : 'text-bluey-200'}`}>
                    {res.summary}
                  </p>
                </div>

                <div className={`pt-4 mt-4 border-t flex items-center justify-between ${isSkyMode ? 'border-bluey-900/15' : 'border-bluey-700'}`}>
                  <button
                    onClick={() => setSelectedResource(res)}
                    className={`text-xs font-bold flex items-center gap-1 transition-colors ${isSkyMode ? 'text-bluey-700 hover:text-bluey-900' : 'text-bluey-300 hover:text-bluey-100'}`}
                  >
                    Read & Practice Guide →
                  </button>
                  <button
                    onClick={() => toggleResourceCompletion(res.id)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      isCompleted
                        ? (isSkyMode ? 'bg-emerald-100 border-emerald-300 text-emerald-600' : 'bg-emerald-900/50 border-emerald-700 text-emerald-400')
                        : (isSkyMode ? 'bg-white/60 border-bluey-900/10 text-bluey-900 hover:bg-white' : 'bg-bluey-900/50 border-bluey-700 text-bluey-100 hover:bg-bluey-800')
                    }`}
                    title={isCompleted ? "Completed" : "Mark as Complete"}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
    })}
  </div>

      {/* Guide Detail Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 bg-ocean-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`border rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto ${isSkyMode ? 'bg-white border-bluey-200' : 'bg-bluey-900 border-bluey-700'}`}>
            
            <button
              onClick={() => setSelectedResource(null)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isSkyMode ? 'text-bluey-400 hover:bg-bluey-50 hover:text-bluey-800' : 'text-bluey-300 hover:bg-bluey-800 hover:text-bluey-100'}`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${isSkyMode ? 'text-bluey-500' : 'text-seafoam-400'}`}>
                {selectedResource.category} • {selectedResource.readTime}
              </span>
              <h3 className={`font-display text-2xl font-bold ${isSkyMode ? 'text-bluey-950' : 'text-white'}`}>
                {selectedResource.title}
              </h3>
            </div>

            <div className={`p-4 rounded-2xl border text-sm font-medium leading-relaxed ${isSkyMode ? 'bg-bluey-50 border-bluey-200 text-bluey-900' : 'bg-bluey-950 border-bluey-800 text-bluey-100'}`}>
              {selectedResource.content}
            </div>

            <div className="space-y-3">
              <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isSkyMode ? 'text-bluey-600' : 'text-bluey-300'}`}>
                <Sparkles className={`w-4 h-4 ${isSkyMode ? 'text-amber-400' : 'text-seafoam-400'}`} />
                Guided Steps & Practice:
              </h4>
              <ol className={`space-y-2 text-xs sm:text-sm font-medium ${isSkyMode ? 'text-bluey-900' : 'text-slate-200'}`}>
                {selectedResource.steps.map((step, idx) => (
                  <li key={idx} className={`flex items-start gap-3 p-3 rounded-xl border ${isSkyMode ? 'bg-white border-bluey-100' : 'bg-bluey-800 border-bluey-700'}`}>
                    <span className={`w-5 h-5 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${isSkyMode ? 'bg-bluey-100 text-bluey-600' : 'bg-seafoam-500/20 text-seafoam-300'}`}>
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => {
                  toggleResourceCompletion(selectedResource.id);
                  setSelectedResource(null);
                }}
                className={`px-6 py-3 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 ${
                  isSkyMode 
                    ? 'bg-bluey-500 text-white hover:bg-bluey-600 shadow-md shadow-bluey-200' 
                    : 'bg-seafoam-500 text-ocean-950 hover:bg-seafoam-400 shadow-md shadow-seafoam-900/50'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                {completedResources.includes(selectedResource.id) ? 'Completed!' : 'Mark Guide Complete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
