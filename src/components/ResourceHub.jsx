import React, { useState } from 'react';
import { BookOpen, CheckCircle, Clock, Search, X, Sparkles, Compass, Brain, Moon, Heart, ArrowRight } from 'lucide-react';
import { STARTER_RESOURCES } from '../services/resourcesData';
import { useWellness } from '../context/WellnessContext';
import { CountryCrisisLines } from './CountryCrisisLines';
import frascoSvg from '../assets/svg/frascoalgas.svg';
import estrellaSvg from '../assets/svg/estrellademar.svg';
import journalSvg from '../assets/svg/diariodegratitudmarina.svg';
import algasSvg from '../assets/svg/algas.svg';
import conchaSvg from '../assets/svg/concha.svg';



export function ResourceHub({ setActiveTab }) {

  const {
    completedResources,
    toggleResourceCompletion,
    mascotState,
    isSkyMode
  } = useWellness();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);




  const categories = [
    'All',
    'Anxiety & Panic Relief',
    'Cognitive Reframing',
    'Sleep & Relaxation',
    'Mindfulness & Self-Care'
  ];

  const filteredResources = STARTER_RESOURCES.filter(res => {

    const matchesCat =
      activeCategory === 'All' ||
      res.category === activeCategory;

    const matchesQuery =
      res.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      res.summary
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesCat && matchesQuery;
  });

  const getResourceIcon = (iconName) => {

    switch (iconName) {

      case 'Brain':
        return (
          <Brain
            className="w-5 h-5"
            style={{
              color: isSkyMode
                ? '#638C55'
                : '#A5C496'
            }}
          />
        );

      case 'Moon':
        return (
          <Moon
            className="w-5 h-5"
            style={{
              color: isSkyMode
                ? '#527F8A'
                : '#A4D3DE'
            }}
          />
        );

      case 'Heart':
        return (
          <Heart
            className="w-5 h-5"
            style={{
              color: isSkyMode
                ? '#C85F73'
                : '#F5B2B8'
            }}
          />
        );

      case 'Compass':
      default:
        return (
          <Compass
            className="w-5 h-5"
            style={{
              color: isSkyMode
                ? '#4F91A5'
                : '#A4D3DE'
            }}
          />
        );
    }
  };

  return (
    <section aria-label="Sisu Resource Hub" className="relative w-full max-w-[1200px] mx-auto pb-16 px-4 sm:px-6">
      
      {/* Background blurs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className={`absolute top-0 left-1/4 w-[40vw] h-[40vw] rounded-full blur-[100px] mix-blend-multiply opacity-30 ${isSkyMode ? 'bg-sand-200' : 'bg-lagoon-900'}`} />
        <div className={`absolute bottom-0 right-1/4 w-[30vw] h-[30vw] rounded-full blur-[80px] mix-blend-multiply opacity-20 ${isSkyMode ? 'bg-lagoon-100' : 'bg-otterfur-900'}`} />
      </div>

      {/* Two-page book layout */}
      <div className="flex flex-col lg:flex-row gap-0 w-full perspective-[2000px]">
        
        {/* LEFT PAGE */}
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
          
          <div className="p-8 sm:p-12 h-full flex flex-col relative min-h-[70vh] z-10 space-y-8">
            <div className="text-center space-y-2 relative z-20">
              <div className="flex justify-center mb-2">
                <img src={frascoSvg} alt="Marine Jar" className="w-24 h-24 object-contain drop-shadow-lg" />
              </div>
              <h2 className="font-display text-3xl font-bold flex flex-wrap items-center justify-center gap-2">
                <BookOpen className={`w-7 h-7 ${isSkyMode ? 'text-seafoam-600' : 'text-seafoam-500'}`} />
                Smart Mental Health Library
              </h2>
              <p className={`text-sm max-w-sm mx-auto font-serif italic opacity-80 ${isSkyMode ? 'text-lagoon-950' : 'text-midnight-muted'}`}>
                Evidence-based guides, grounding practices, and CBT tools available whenever you need guidance.
              </p>
            </div>

            <div className="relative z-20 w-full mt-4">
              <CountryCrisisLines />
            </div>
          </div>
        </div>

        {/* RIGHT PAGE */}
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
          
          <div className="p-8 sm:p-10 h-full flex flex-col space-y-8 relative z-10">
            
            <div className="flex flex-col gap-4">
              <div className="relative w-full">
                <Search className={`w-4 h-4 absolute left-3 top-3 ${isSkyMode ? 'text-bluey-400' : 'text-midnight-muted'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search guides..."
                  className={`
                    w-full pl-9 pr-4 py-2.5 rounded-2xl border-none text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-seafoam-500
                    ${isSkyMode ? 'bg-[#F0F5F5] text-lagoon-950 placeholder-bluey-400' : 'bg-midnight-800 text-midnight-text placeholder-midnight-muted'}
                  `}
                />
              </div>

              <div className="flex flex-wrap gap-2 w-full">
                {categories.map(cat => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`
                        px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border-none
                        ${isActive 
                          ? (isSkyMode ? 'bg-lagoon-950 text-white shadow-md' : 'bg-lagoon-300 text-lagoon-950') 
                          : (isSkyMode ? 'bg-[#F0F5F5] text-lagoon-900 hover:bg-[#E5EBEB]' : 'bg-midnight-800 text-midnight-muted hover:bg-midnight-700 hover:text-midnight-text')
                        }
                      `}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RESOURCE CARDS CONTAINER */}
            <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-4 custom-scrollbar">
              {filteredResources.map(res => {
                const isCompleted = completedResources.includes(res.id);

                return (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() => setSelectedResource(res)}
                    className={`
                      relative w-full flex flex-col sm:flex-row items-center sm:items-start text-left p-5
                      rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer
                      ${isSkyMode ? 'bg-white border-[#E5E5E5] shadow-sm' : 'bg-midnight-800 border-midnight-700 shadow-black/20'}
                    `}
                  >
                    
                    {/* RESOURCE ICON */}
                    <div className={`p-3 rounded-2xl mb-4 sm:mb-0 sm:mr-4 shrink-0 ${isSkyMode ? 'bg-[#F0F5F5]' : 'bg-midnight-900'}`}>
                      {getResourceIcon(res.icon)}
                    </div>

                    <div className="flex-1 w-full">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          {/* CATEGORY */}
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isSkyMode ? 'text-seafoam-600' : 'text-seafoam-400'}`}>
                            {res.category}
                          </span>

                          {/* TITLE */}
                          <h3 className="font-display font-bold text-lg leading-snug mt-1">
                            {res.title}
                          </h3>
                        </div>

                        {/* COMPLETION CHECK */}
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={e => {
                            e.stopPropagation();
                            toggleResourceCompletion(res.id);
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleResourceCompletion(res.id);
                            }
                          }}
                          className={`
                            p-1.5 rounded-full border-none transition-all cursor-pointer shrink-0 mt-1
                            ${isCompleted 
                              ? (isSkyMode ? 'bg-seafoam-500/20 text-seafoam-600' : 'bg-seafoam-500/20 text-seafoam-400')
                              : (isSkyMode ? 'bg-[#F0F5F5] text-bluey-300 hover:text-bluey-500' : 'bg-midnight-900/60 text-midnight-muted hover:text-midnight-text')
                            }
                          `}
                          title={isCompleted ? 'Completed' : 'Mark as Complete'}
                          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </span>
                      </div>

                      {/* SUMMARY */}
                      <p className={`text-[11px] leading-relaxed mt-2 line-clamp-2 ${isSkyMode ? 'text-bluey-700' : 'text-midnight-muted'}`}>
                        {res.summary}
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        {/* READ TIME */}
                        <span className={`text-[10px] font-semibold flex items-center gap-1 ${isSkyMode ? 'text-bluey-500' : 'text-midnight-muted'}`}>
                          <Clock className="w-3 h-3" />
                          {res.readTime}
                        </span>

                        {/* GUIDE LINK */}
                        <span className={`text-[11px] font-bold underline underline-offset-4 ${isSkyMode ? 'text-lagoon-600 hover:text-lagoon-900' : 'text-slate-400 hover:text-slate-200'}`}>
                          Read Guide
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
              
              {filteredResources.length === 0 && (
                <div className="text-center py-10 opacity-60">
                   <p className="font-serif italic text-sm">No resources found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedResource && (
        <div className="fixed inset-0 z-50 backdrop-blur-md flex items-start justify-center px-4 pb-4 pt-[56px] sm:pt-[72px] bg-slate-950/60">
          
          <div className={`
            rounded-[2rem] p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative max-h-[calc(100vh-7rem)] overflow-y-auto border-none
            ${isSkyMode ? 'bg-cream-50 text-bluey-950 shadow-black/10' : 'bg-midnight-900 text-midnight-text shadow-black/40'}
          `}>
            
            {/* CLOSE */}
            <button
              type="button"
              aria-label="Close guide"
              onClick={() => setSelectedResource(null)}
              className={`
                absolute top-5 right-5 p-2 rounded-full transition-colors
                ${isSkyMode ? 'text-bluey-500 hover:bg-cream-100 hover:text-bluey-900' : 'text-midnight-muted hover:bg-midnight-800 hover:text-midnight-text'}
              `}
            >
              <X className="w-5 h-5" />
            </button>

            {/* MODAL HEADER */}
            <div className="space-y-2 pr-10">
              <span className={`text-xs font-bold uppercase tracking-wider ${isSkyMode ? 'text-seafoam-600' : 'text-seafoam-500'}`}>
                {selectedResource.category} {' • '} {selectedResource.readTime}
              </span>
              <h3 className="font-display text-2xl font-bold">
                {selectedResource.title}
              </h3>
            </div>

            {/* EXPLANATION */}
            <div className={`p-5 rounded-2xl text-sm font-medium leading-relaxed border-none ${isSkyMode ? 'bg-cream-100 text-bluey-900' : 'bg-midnight-800 text-midnight-text'}`}>
              {selectedResource.content}
            </div>

            {/* GUIDED STEPS */}
            <div className="space-y-4">
              <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isSkyMode ? 'text-bluey-600' : 'text-midnight-muted'}`}>
                <Sparkles className={`w-4 h-4 ${isSkyMode ? 'text-seafoam-500' : 'text-seafoam-400'}`} />
                Guided Steps & Practice:
              </h4>

              <ol className="space-y-3 text-xs sm:text-sm font-medium">
                {selectedResource.steps.map((step, idx) => (
                  <li key={idx} className={`flex items-start gap-4 p-4 rounded-2xl border-none ${isSkyMode ? 'bg-white shadow-sm' : 'bg-midnight-800'}`}>
                    <span className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${isSkyMode ? 'bg-bluey-100 text-bluey-900' : 'bg-midnight-900 text-midnight-text'}`}>
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* COMPLETE BUTTON */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  toggleResourceCompletion(selectedResource.id);
                  setSelectedResource(null);
                }}
                className={`
                  px-6 py-3.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-xl hover:-translate-y-0.5
                  ${isSkyMode ? 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800' : 'bg-seafoam-500 text-midnight-950 shadow-seafoam-500/20 hover:bg-seafoam-400'}
                `}
              >
                <CheckCircle className="w-4 h-4" />
                {completedResources.includes(selectedResource.id) ? 'Completed!' : 'Mark Guide Complete'}
              </button>
            </div>

            {selectedResource.id === 'res-54321' && (
              <div className={`rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left border-none mt-6 ${isSkyMode ? 'bg-bluey-100' : 'bg-midnight-800'}`}>
                <div className="space-y-1.5">
                  <p className="font-display font-bold text-base sm:text-lg">
                    Want to try it out? 🌊
                  </p>
                  <p className={`text-xs sm:text-sm font-medium ${isSkyMode ? 'text-bluey-700' : 'text-midnight-muted'}`}>
                    Walk through this grounding exercise step by step with Sisu.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('grounding-54321');
                    setSelectedResource(null);
                  }}
                  className={`
                    w-full sm:w-auto shrink-0 px-6 py-3.5 rounded-full font-bold text-sm shadow-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2
                    ${isSkyMode ? 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800' : 'bg-seafoam-500 text-midnight-950 shadow-seafoam-500/20 hover:bg-seafoam-400'}
                  `}
                >
                  Start Practice
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}