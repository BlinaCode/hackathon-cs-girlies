import React, { useState } from 'react';
import { BookOpen, CheckCircle, Clock, Search, X, Sparkles, Compass, Brain, Moon, Heart } from 'lucide-react';
import { STARTER_RESOURCES } from '../services/resourcesData';
import { useWellness } from '../context/WellnessContext';
import { OtterMascot } from './OtterMascot';

export function ResourceHub() {
  const { completedResources, toggleResourceCompletion, mascotState } = useWellness();

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
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl font-bold text-slate-100 flex items-center justify-center gap-2">
          <BookOpen className="w-7 h-7 text-seafoam-400" />
          Smart Mental Health Resource Hub
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Evidence-based guides, grounding practices, and CBT tools available whenever you need guidance.
        </p>
      </div>

      <OtterMascot expression={mascotState.expression} speech={mascotState.speech} />

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 w-full sm:w-auto py-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-seafoam-500 text-ocean-950 font-bold shadow-md'
                  : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search guides..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:border-seafoam-500"
          />
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {filteredResources.map((res, idx) => {
          const isCompleted = completedResources.includes(res.id);
          return (
            <div
              key={res.id}
              className="relative p-6 sm:p-8 min-h-[440px] overflow-visible"
            >
              <div
                className="absolute inset-0"
                style={{
                  borderRadius: "58% 42% 55% 45% / 55% 45% 58% 42%",
                  background: "linear-gradient(160deg, #4ADE80, #15803D",
                  zIndex: 0,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    borderRadius: "inherit",
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 50%)",
                  }}
                />
              </div>

              <div
                className="relative h-full rounded-2xl sm:rounded-3xl p-6 sm:p-8 m-6 sm:m-8 shadow-inner flex flex-col justify-between group transition-transform hover:-translate-y-1"
                style={{
                  background: "linear-gradient(135deg, #FDF6E2, #EAD5A0)",
                  borderRadius: "48%, 52%,50%,50%",
                  margin: "32px",
                  padding: "32px 28px",
                  xIndex: 10,
                }}
              >
                <div className="space-y-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="p-2 rounded-xl bg-white/50 border border-bluey-900/10">
                      {getResourceIcon(res.icon)}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-seafoam-600">
                      {res.category}
                    </span>
                    <span className="text-[11px] text-bluey-900/70 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {res.readTime}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-bluey-950 leading-snug">
                    {res.title}
                  </h3>
                  <p className="text-xs text-bluey-900/80 leading-relaxed break-words overflow-wrap-anywhere max-w-[90%]">
                    {res.summary}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-bluey-900/15 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedResource(res)}
                    className="text-xs font-semibold text-seafoam-700 hover:text-ocean-800 flex items-center gap-1"
                  >
                    Read & Practice Guide →
                  </button>
                  <button
                    onClick={() => toggleResourceCompletion(res.id)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      isCompleted
                        ? "bg-seafoam-500/20 border-seafoam-500/40 text-seafoam-600"
                        : "bg-white/40 border-bluey-900/10 text-bluey-900 hover:text-bluey-900/70"
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
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedResource(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 rounded-full hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-seafoam-400">
                {selectedResource.category} • {selectedResource.readTime}
              </span>
              <h3 className="font-display text-2xl font-bold text-slate-100">
                {selectedResource.title}
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 text-xs text-slate-300 leading-relaxed">
              {selectedResource.content}
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-seafoam-400" />
                Guided Steps & Practice:
              </h4>
              <ol className="space-y-2 text-xs sm:text-sm text-slate-200">
                {selectedResource.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-seafoam-500/20 text-seafoam-300 font-bold text-xs flex items-center justify-center shrink-0">
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
                className="px-6 py-3 rounded-2xl bg-seafoam-500 text-ocean-950 font-bold text-xs hover:bg-seafoam-400 transition-all flex items-center gap-2"
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
