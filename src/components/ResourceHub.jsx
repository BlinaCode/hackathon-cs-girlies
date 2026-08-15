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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map(res => {
          const isCompleted = completedResources.includes(res.id);
          return (
            <div
              key={res.id}
              className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl hover:border-seafoam-500/40 transition-all flex flex-col justify-between backdrop-blur-md group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/60">
                      {getResourceIcon(res.icon)}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-seafoam-400">
                      {res.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {res.readTime}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-slate-100 group-hover:text-seafoam-300 transition-colors">
                  {res.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {res.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-700/40 flex items-center justify-between">
                <button
                  onClick={() => setSelectedResource(res)}
                  className="text-xs font-semibold text-seafoam-400 hover:text-seafoam-300 flex items-center gap-1"
                >
                  Read & Practice Guide →
                </button>

                <button
                  onClick={() => toggleResourceCompletion(res.id)}
                  className={`p-1.5 rounded-lg border transition-all ${
                    isCompleted
                      ? 'bg-seafoam-500/20 border-seafoam-500/40 text-seafoam-400'
                      : 'bg-slate-900/60 border-slate-700 text-slate-500 hover:text-slate-300'
                  }`}
                  title={isCompleted ? 'Completed' : 'Mark as Complete'}
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
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
