import React, { useState, useRef, useEffect } from 'react';
import { Brain, Plus, Sparkles, TrendingDown, CheckCircle, ArrowRight, Check, ChevronLeft, ChevronRight, X, Loader2, HeartHandshake } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import { useAuth } from '../context/AuthContext';
import { suggestReframe } from '../services/aiSuggestions';
import cuencoSvg from '../assets/svg/cuencomar.svg';
import estrellaSvg from '../assets/svg/estrellademar.svg';
import conchaSvg from '../assets/svg/concha.svg';
import algasSvg from '../assets/svg/algas.svg';

const EMPTY_PRACTICE = {
  initialBeliefScore: 50,
  advantages: "",
  disadvantages: "",
  chosenAlternativeThought: "",
  chosenNewAction: "",
  finalBeliefScore: 50,
};

export function ReframeThoughts({ setActiveTab }) {
  const {
    beliefs,
    beliefPractices,
    addBelief,
    addBeliefPractice,
    updateBeliefStatus,
    isSkyMode,
    setMascotState,
  } = useWellness();
  const { user, fetchProfile } = useAuth();

  const activeBeliefs = beliefs.filter((b) => b.status === "active");

  useEffect(() => {
    setMascotState({
      expression: 'thoughtful',
      speech: "Let's gently examine your thoughts. The ocean softens the hardest stones."
    });
  }, [setMascotState]);

  const [selectedBeliefId, setSelectedBeliefId] = useState(
    activeBeliefs[0]?.id || "",
  );
  
  // Only show new form if explicitly clicked or if there are no beliefs
  const [showNewForm, setShowNewForm] = useState(activeBeliefs.length === 0);

  // New-belief form state
  const [statement, setStatement] = useState("");
  const [meaningToMe, setMeaningToMe] = useState("");
  const [originHistorical, setOriginHistorical] = useState("");

  // Practice worksheet state
  const [practice, setPractice] = useState(EMPTY_PRACTICE);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // AI-assisted suggestion (Gemini via the reframe-suggest Edge Function)
  const [aiEnabled, setAiEnabled] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState("");
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [aiAssisted, setAiAssisted] = useState(false);

  useEffect(() => {
    if (!user) {
      setAiEnabled(false);
      return;
    }
    let cancelled = false;
    fetchProfile()
      .then((data) => {
        if (!cancelled) setAiEnabled(!!data?.ai_features_enabled);
      })
      .catch(() => {
        if (!cancelled) setAiEnabled(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const selectedBelief = beliefs.find((b) => b.id === selectedBeliefId);
  const practiceHistory = beliefPractices
    .filter((p) => p.beliefId === selectedBeliefId)
    .sort((a, b) => new Date(a.practicedAt) - new Date(b.practicedAt));

  const setP = (field, value) => setPractice((prev) => ({ ...prev, [field]: value }));

  const resetAiState = () => {
    setSuggestError("");
    setCrisisDetected(false);
    setAiAssisted(false);
  };

  const handleAddBelief = (e) => {
    e.preventDefault();
    if (!statement.trim()) return;
    const id = addBelief(statement, meaningToMe, originHistorical);
    setSelectedBeliefId(id);
    setStatement("");
    setMeaningToMe("");
    setOriginHistorical("");
    setShowNewForm(false);
    setPractice(EMPTY_PRACTICE);
    resetAiState();
    setStep(1);
  };

  const handleSuggest = async () => {
    if (!selectedBelief) return;
    setSuggesting(true);
    setSuggestError("");
    setCrisisDetected(false);
    try {
      const result = await suggestReframe({
        statement: selectedBelief.statement,
        advantages: practice.advantages,
        disadvantages: practice.disadvantages,
      });
      if (result.crisisDetected) {
        setCrisisDetected(true);
      } else {
        setP("chosenAlternativeThought", result.alternativeThought);
        setP("chosenNewAction", result.newAction);
        setAiAssisted(true);
      }
    } catch (err) {
      setSuggestError(err.message || "Could not get an AI suggestion right now.");
    } finally {
      setSuggesting(false);
    }
  };

  const handleLogPractice = () => {
    if (!selectedBeliefId) return;
    addBeliefPractice(selectedBeliefId, { ...practice, aiAssisted });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setPractice(EMPTY_PRACTICE);
      setStep(1);
      resetAiState();
    }, 3000);
  };

  const handleNextStep = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      handleLogPractice();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <section aria-label="Reframe Thoughts" className="relative w-full max-w-[1200px] mx-auto pb-16 px-4 sm:px-6">
      {/* Background blurs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className={`absolute top-0 left-1/4 w-[40vw] h-[40vw] rounded-full blur-[100px] mix-blend-multiply opacity-30 ${isSkyMode ? 'bg-sand-200' : 'bg-lagoon-900'}`} />
        <div className={`absolute bottom-0 right-1/4 w-[30vw] h-[30vw] rounded-full blur-[80px] mix-blend-multiply opacity-20 ${isSkyMode ? 'bg-lagoon-100' : 'bg-otterfur-900'}`} />
      </div>

      <div className="flex flex-col lg:flex-row gap-0 w-full perspective-[2000px]">
        {/* LEFT PAGE (List & Progress) */}
        <div className={`flex-1 lg:w-1/2 rounded-t-[1.5rem] lg:rounded-tr-none lg:rounded-l-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 ease-in-out border lg:border-r-0 lg:origin-right animate-book-page-left relative overflow-hidden flex flex-col
          ${isSkyMode
            ? 'bg-[#FAFAFA] border-[#E5E5E5] text-lagoon-950'
            : 'bg-midnight-950 border-midnight-800 text-midnight-text'}`}
        >
          {/* Decorative SVGs */}
          <div className="absolute top-0 left-0 opacity-15 pointer-events-none w-24 sm:w-32 -translate-x-4 -translate-y-4">
             <img src={estrellaSvg} alt="" className="w-full h-auto transform -rotate-12" aria-hidden="true" />
          </div>
          
          <div className="p-8 sm:p-12 flex-1 flex flex-col relative z-10">
            <div className="mb-8">
               <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tight leading-tight">
                 Reframe <br className="hidden sm:block" />
                 <span className="italic opacity-60">Thoughts</span>
               </h2>
               <p className="font-serif italic opacity-70 leading-relaxed text-sm mt-4">
                 Gently examine a thought that is bothering you, find a kinder alternative, and watch your belief in it soften over time.
               </p>
            </div>

            <div className="flex items-center justify-between gap-3 mb-4">
               <h3 className="font-display text-xl sm:text-2xl opacity-80">
                 Your Thoughts
               </h3>
               <button
                 type="button"
                 onClick={() => setShowNewForm(true)}
                 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-serif italic ${isSkyMode ? 'border-lagoon-200 hover:bg-black/5 text-lagoon-800' : 'border-lagoon-700 hover:bg-white/5 text-lagoon-200'}`}
               >
                 <Plus className="w-3.5 h-3.5" /> Add New
               </button>
            </div>

            {activeBeliefs.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 space-y-2 py-10">
                 <img src={cuencoSvg} alt="" className="w-16 h-16 opacity-40 mb-2 grayscale" />
                 <p className="font-serif italic text-sm">No thoughts added yet.</p>
                 <p className="text-xs">Start by adding one you'd like to work on.</p>
               </div>
            ) : (
               <BeliefPicker
                 beliefs={activeBeliefs}
                 selectedId={selectedBeliefId}
                 isSkyMode={isSkyMode}
                 onSelect={(id) => {
                   setSelectedBeliefId(id);
                   setPractice(EMPTY_PRACTICE);
                   setStep(1);
                   setShowNewForm(false);
                   setSubmitted(false);
                   resetAiState();
                 }}
               />
            )}

            {/* Progress over time */}
            {!showNewForm && selectedBelief && practiceHistory.length > 0 && (
               <div className={`mt-8 pt-6 border-t ${isSkyMode ? 'border-[#E5E5E5]' : 'border-midnight-800'}`}>
                 <h4 className="font-display text-lg mb-4 opacity-80 flex items-center gap-2">
                   <TrendingDown className="w-4 h-4 opacity-60" />
                   Progress over time
                 </h4>
                 <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                   {practiceHistory.map((p) => (
                     <div
                       key={p.id}
                       className={`p-4 rounded-xl border flex justify-between items-center ${isSkyMode ? "bg-white/40 border-[#E5E5E5]" : "bg-black/20 border-midnight-800"}`}
                     >
                       <span className="text-xs font-serif italic opacity-60">
                         {new Date(p.practicedAt).toLocaleDateString()}
                       </span>
                       <div className="flex items-center gap-3 font-display">
                         <span className="text-lg opacity-60">{p.initialBeliefScore}</span>
                         <ArrowRight className="w-4 h-4 opacity-40" />
                         <span className={`text-lg font-bold ${isSkyMode ? 'text-lagoon-700' : 'text-lagoon-300'}`}>
                           {p.finalBeliefScore ?? "—"}
                         </span>
                       </div>
                     </div>
                   ))}
                 </div>
                 <button
                   type="button"
                   onClick={() => {
                     updateBeliefStatus(selectedBeliefId, "resolved");
                     setSelectedBeliefId(activeBeliefs.filter(b => b.id !== selectedBeliefId)[0]?.id || "");
                   }}
                   className={`mt-4 text-xs font-serif italic opacity-50 hover:opacity-100 transition-opacity flex items-center gap-1 justify-center w-full`}
                 >
                   <CheckCircle className="w-3.5 h-3.5" />
                   Mark this thought as resolved
                 </button>
               </div>
            )}
          </div>
        </div>

        {/* RIGHT PAGE (Wizard / Form) */}
        <div className={`flex-1 lg:w-1/2 rounded-b-[1.5rem] lg:rounded-bl-none lg:rounded-r-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 ease-in-out border lg:border-l-0 lg:origin-left animate-book-page-right relative overflow-hidden
          ${isSkyMode
            ? 'bg-[#FDFDFD] border-[#E5E5E5] text-lagoon-950'
            : 'bg-midnight-900 border-midnight-800 text-midnight-text'}`}
        >
          {/* Decorative SVGs */}
          <div className="absolute top-0 right-0 opacity-15 pointer-events-none w-48 sm:w-56 translate-x-8 -translate-y-4">
            <img src={conchaSvg} alt="" className="w-full h-auto transform rotate-12" aria-hidden="true" />
          </div>
          <div className="absolute bottom-0 right-0 opacity-[0.15] pointer-events-none w-48 sm:w-64 translate-x-4 translate-y-4">
            <img src={algasSvg} alt="" className="w-full h-auto" aria-hidden="true" />
          </div>

          <div className="p-8 sm:p-12 h-full flex flex-col justify-center relative min-h-[70vh] z-10">
            {showNewForm ? (
               <div className="space-y-8 max-w-sm w-full mx-auto animate-fade-in">
                 <div className="flex items-center gap-4 text-xs font-serif uppercase tracking-widest opacity-50 mb-6">
                   {activeBeliefs.length > 0 && (
                     <button onClick={() => setShowNewForm(false)} className="hover:opacity-100 transition-opacity p-1">
                       <ChevronLeft className="w-4 h-4" />
                     </button>
                   )}
                   <span>New Thought</span>
                 </div>

                 <form onSubmit={handleAddBelief} className="space-y-10">
                   <div className="space-y-2">
                     <label className="block font-display text-xl mb-2">What is a thought that is bothering you?</label>
                     <textarea
                       value={statement}
                       onChange={(e) => setStatement(e.target.value)}
                       placeholder="e.g. I feel that I am not good enough..."
                       rows={2}
                       className={`w-full py-2 bg-transparent text-lg font-serif italic transition-all duration-300 resize-none focus:outline-none border-b focus:border-current opacity-80 focus:opacity-100 ${isSkyMode ? 'border-[#E5E5E5] placeholder-lagoon-400' : 'border-midnight-800 placeholder-midnight-muted'}`}
                       required
                       autoFocus
                     />
                   </div>

                   <div className="space-y-2">
                     <label className="block font-display text-xl mb-2">What does that mean to you?</label>
                     <textarea
                       value={meaningToMe}
                       onChange={(e) => setMeaningToMe(e.target.value)}
                       placeholder="e.g. That I will be rejected..."
                       rows={1}
                       className={`w-full py-2 bg-transparent text-lg font-serif italic transition-all duration-300 resize-none focus:outline-none border-b focus:border-current opacity-80 focus:opacity-100 ${isSkyMode ? 'border-[#E5E5E5] placeholder-lagoon-400' : 'border-midnight-800 placeholder-midnight-muted'}`}
                     />
                   </div>

                   <div className="space-y-2">
                     <label className="block font-display text-xl mb-2">Where did it originate?</label>
                     <textarea
                       value={originHistorical}
                       onChange={(e) => setOriginHistorical(e.target.value)}
                       placeholder="e.g. An old comparison..."
                       rows={1}
                       className={`w-full py-2 bg-transparent text-lg font-serif italic transition-all duration-300 resize-none focus:outline-none border-b focus:border-current opacity-80 focus:opacity-100 ${isSkyMode ? 'border-[#E5E5E5] placeholder-lagoon-400' : 'border-midnight-800 placeholder-midnight-muted'}`}
                     />
                   </div>

                   <div className="pt-6">
                     <button
                       type="submit"
                       disabled={!statement.trim()}
                       className={`w-full py-3 border-b-2 font-display text-lg transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current ${
                         !statement.trim() 
                           ? 'opacity-30 cursor-not-allowed border-transparent'
                           : (isSkyMode
                             ? 'border-lagoon-900 hover:border-lagoon-600 hover:text-lagoon-700'
                             : 'border-lagoon-200 hover:border-lagoon-400 hover:text-lagoon-300')
                       }`}
                     >
                       Save Thought
                     </button>
                   </div>
                 </form>
               </div>
            ) : submitted ? (
               <div className="text-center space-y-6 animate-fade-in max-w-sm mx-auto">
                 <img src={cuencoSvg} alt="" className="w-24 h-24 mx-auto mb-4 drop-shadow-md" />
                 <h3 className="font-display text-3xl sm:text-4xl font-normal tracking-tight">
                   Reframe Saved
                 </h3>
                 <p className="text-sm sm:text-base max-w-sm mx-auto font-serif italic opacity-70">
                   Progress builds with repetition. The ocean softens the hardest stones over time.
                 </p>
               </div>
            ) : selectedBelief ? (
               <div className="space-y-8 max-w-md w-full mx-auto animate-fade-in flex flex-col h-full py-8">
                 <div className="flex items-center justify-between text-xs font-serif uppercase tracking-widest opacity-50 mb-2">
                   <span>Worksheet</span>
                   <span>Step {step} of 6</span>
                 </div>
                 
                 <div className="mb-4">
                   <p className="text-xs font-serif italic opacity-60 mb-1">Working on:</p>
                   <p className="font-display text-xl sm:text-2xl leading-snug">"{selectedBelief.statement}"</p>
                 </div>

                 <div className="flex-1 flex flex-col justify-center">
                   {step === 1 && (
                     <ScoreSlider
                       label="How strongly do you believe it right now?"
                       value={practice.initialBeliefScore}
                       onChange={(v) => setP("initialBeliefScore", v)}
                       isSkyMode={isSkyMode}
                     />
                   )}
                   {step === 2 && (
                     <TextArea
                       label="Advantages of thinking this way"
                       value={practice.advantages}
                       onChange={(v) => setP("advantages", v)}
                       placeholder="e.g. It keeps me cautious..."
                       isSkyMode={isSkyMode}
                     />
                   )}
                   {step === 3 && (
                     <TextArea
                       label="Disadvantages of thinking this way"
                       value={practice.disadvantages}
                       onChange={(v) => setP("disadvantages", v)}
                       placeholder="e.g. It stops me from trying..."
                       isSkyMode={isSkyMode}
                     />
                   )}
                   {step === 4 && (
                     <TextArea
                       label="Find an alternative thought"
                       value={practice.chosenAlternativeThought}
                       onChange={(v) => setP("chosenAlternativeThought", v)}
                       placeholder="A kinder, more balanced way to see this..."
                       isSkyMode={isSkyMode}
                     />
                   )}
                   {step === 5 && (
                     <TextArea
                       label="What new action can you take today?"
                       value={practice.chosenNewAction}
                       onChange={(v) => setP("chosenNewAction", v)}
                       placeholder="One small step that honors the new thought..."
                       isSkyMode={isSkyMode}
                     />
                   )}

                   {/* AI-assisted suggestion — fills both step 4 and step 5,
                       so it's offered on either one */}
                   {(step === 4 || step === 5) && aiEnabled && (
                     <div className="mt-6 space-y-3 animate-fade-in">
                       <button
                         type="button"
                         onClick={handleSuggest}
                         disabled={suggesting}
                         className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-serif italic disabled:opacity-50 ${isSkyMode ? 'border-lagoon-200 hover:bg-black/5 text-lagoon-800' : 'border-lagoon-700 hover:bg-white/5 text-lagoon-200'}`}
                       >
                         {suggesting ? (
                           <Loader2 className="w-3.5 h-3.5 animate-spin" />
                         ) : (
                           <Sparkles className="w-3.5 h-3.5" />
                         )}
                         {suggesting ? 'Thinking...' : 'Suggest with AI'}
                       </button>

                       {crisisDetected && (
                         <div className="flex items-start gap-2 text-xs sm:text-sm font-serif italic opacity-80">
                           <HeartHandshake className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
                           <div className="space-y-1.5">
                             <p>
                               This sounds heavier than a quick reframe can hold. You deserve to talk this
                               through with someone — we'd rather point you to real support than guess.
                             </p>
                             {setActiveTab && (
                               <button
                                 type="button"
                                 onClick={() => setActiveTab('resources')}
                                 className="font-bold underline underline-offset-2 not-italic"
                               >
                                 View crisis support resources
                               </button>
                             )}
                           </div>
                         </div>
                       )}

                       {suggestError && (
                         <p className="text-xs font-serif italic opacity-70">{suggestError}</p>
                       )}
                     </div>
                   )}

                   {step === 6 && (
                     <ScoreSlider
                       label="How strongly do you believe the original thought now?"
                       value={practice.finalBeliefScore}
                       onChange={(v) => setP("finalBeliefScore", v)}
                       isSkyMode={isSkyMode}
                     />
                   )}
                 </div>

                 <div className="flex items-center justify-between pt-8 mt-auto">
                   <button
                     onClick={handlePrevStep}
                     disabled={step === 1}
                     className={`p-2 rounded-full transition-colors ${step === 1 ? 'opacity-20 cursor-default' : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-60 hover:opacity-100'}`}
                   >
                     <ChevronLeft strokeWidth={1.5} />
                   </button>
                   <button
                     onClick={handleNextStep}
                     className={`flex items-center gap-2 font-display text-lg px-6 py-2 rounded-full border transition-all ${
                       isSkyMode ? 'border-lagoon-900 hover:bg-lagoon-50' : 'border-lagoon-200 hover:bg-white/5'
                     }`}
                   >
                     {step === 6 ? 'Save Reframe' : 'Next'} <ArrowRight className="w-4 h-4" />
                   </button>
                 </div>
               </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function BeliefPicker({ beliefs, selectedId, isSkyMode, onSelect }) {
  return (
    <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
      {beliefs.map((b) => {
        const isSelected = b.id === selectedId;
        return (
          <button
            key={b.id}
            type="button"
            onClick={() => onSelect(b.id)}
            className={`w-full text-left py-4 px-5 rounded-2xl border transition-all duration-300 font-serif italic flex items-center justify-between gap-3 ${
              isSelected
                ? (isSkyMode ? 'border-lagoon-900 bg-lagoon-50 text-lagoon-950 font-bold' : 'border-lagoon-200 bg-white/10 text-white font-bold')
                : (isSkyMode ? 'border-transparent hover:border-[#E5E5E5] text-lagoon-800 bg-white/40' : 'border-transparent hover:border-midnight-800 text-midnight-text bg-black/20')
            }`}
          >
            <span className="line-clamp-2 leading-relaxed">{b.statement}</span>
            {isSelected && (
              <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${isSkyMode ? "bg-lagoon-900 text-white" : "bg-lagoon-200 text-lagoon-950"}`}>
                <Check className="w-3 h-3" strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function ScoreSlider({ label, value, onChange, isSkyMode }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <label className="block font-display text-3xl leading-snug">{label}</label>
      <div className="space-y-3">
        <div className="flex justify-between items-end mb-1">
           <span className="text-sm font-serif italic opacity-60">Intensity</span>
           <span className={`font-display text-2xl ${isSkyMode ? 'text-lagoon-900' : 'text-lagoon-100'}`}>
             {value} <span className="text-sm opacity-50">/ 100</span>
           </span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full h-1.5 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lagoon-400 ${isSkyMode ? 'bg-[#E5E5E5] accent-lagoon-900' : 'bg-midnight-800 accent-lagoon-200'}`}
        />
        <div className="flex justify-between text-xs font-serif italic opacity-60">
          <span>Not at all</span>
          <span>Completely</span>
        </div>
      </div>
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, isSkyMode }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <label className="block font-display text-3xl leading-snug">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className={`w-full py-3 bg-transparent text-xl font-serif italic transition-all duration-300 resize-none focus:outline-none border-b focus:border-current opacity-80 focus:opacity-100 ${isSkyMode ? 'border-[#E5E5E5] placeholder-lagoon-400' : 'border-midnight-800 placeholder-midnight-muted'}`}
        autoFocus
      />
    </div>
  );
}
