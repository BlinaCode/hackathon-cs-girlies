import React, { useState } from 'react';
import { Brain, Plus, Sparkles, TrendingDown, CheckCircle, ArrowRight } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import { OtterMascot } from './OtterMascot';
import cuencoSvg from '../assets/svg/cuencomar.svg';

const EMPTY_PRACTICE = {
  initialBeliefScore: 50,
  advantages: '',
  disadvantages: '',
  chosenAlternativeThought: '',
  chosenNewAction: '',
  finalBeliefScore: 50
};

export function ReframeThoughts() {
  const { beliefs, beliefPractices, addBelief, addBeliefPractice, updateBeliefStatus, mascotState, isSkyMode } = useWellness();

  const activeBeliefs = beliefs.filter(b => b.status === 'active');

  const [selectedBeliefId, setSelectedBeliefId] = useState(activeBeliefs[0]?.id || '');
  const [showNewForm, setShowNewForm] = useState(activeBeliefs.length === 0);

  // New-belief form
  const [statement, setStatement] = useState('');
  const [meaningToMe, setMeaningToMe] = useState('');
  const [originHistorical, setOriginHistorical] = useState('');

  // Practice worksheet
  const [practice, setPractice] = useState(EMPTY_PRACTICE);
  const [submitted, setSubmitted] = useState(false);

  const selectedBelief = beliefs.find(b => b.id === selectedBeliefId);
  const practiceHistory = beliefPractices
    .filter(p => p.beliefId === selectedBeliefId)
    .sort((a, b) => new Date(a.practicedAt) - new Date(b.practicedAt));

  const setP = (field, value) => setPractice(prev => ({ ...prev, [field]: value }));

  const handleAddBelief = (e) => {
    e.preventDefault();
    if (!statement.trim()) return;
    const id = addBelief(statement, meaningToMe, originHistorical);
    setSelectedBeliefId(id);
    setStatement('');
    setMeaningToMe('');
    setOriginHistorical('');
    setShowNewForm(false);
    setPractice(EMPTY_PRACTICE);
  };

  const handleLogPractice = (e) => {
    e.preventDefault();
    if (!selectedBeliefId) return;
    addBeliefPractice(selectedBeliefId, practice);
    setPractice(EMPTY_PRACTICE);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Title */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <img src={cuencoSvg} alt="Sea Bowl" className="w-28 h-28 object-contain drop-shadow-lg" />
        </div>
        <h2 className={`font-display text-3xl font-bold flex items-center justify-center gap-2 ${isSkyMode ? 'text-bluey-950' : 'text-slate-100'}`}>
          <Brain className="w-7 h-7 text-seafoam-400" />
          Reframe Thoughts
        </h2>
        <p className={`text-sm max-w-xl mx-auto ${isSkyMode ? 'text-bluey-800' : 'text-slate-400'}`}>
          Gently examine a thought that is bothering you, find a kinder alternative, and watch your belief in it soften over time.
        </p>
      </div>

      <OtterMascot expression={mascotState.expression} speech={mascotState.speech} />

      {/* Choose or add a belief */}
      <div className={`rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 transition-all ${isSkyMode ? 'glass-card-day' : 'glass-card-night'}`}>
        <div className="flex items-center justify-between gap-3">
          <h3 className={`font-display text-xl font-bold ${isSkyMode ? 'text-bluey-950' : 'text-slate-100'}`}>
            {showNewForm ? 'Name a thought to reframe' : 'Which thought are you working on?'}
          </h3>
          {!showNewForm && (
            <button
              type="button"
              onClick={() => setShowNewForm(true)}
              className="px-3 py-1.5 rounded-full bg-seafoam-500/10 border border-seafoam-500/30 text-seafoam-300 font-semibold text-xs flex items-center gap-1.5 hover:bg-seafoam-500/20 transition-all"
            >
              <Plus className="w-4 h-4" /> New thought
            </button>
          )}
        </div>

        {showNewForm ? (
          <form onSubmit={handleAddBelief} className="space-y-5">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isSkyMode ? 'text-bluey-700' : 'text-slate-400'}`}>
                What is one thought that is bothering you?
              </label>
              <input
                type="text"
                value={statement}
                onChange={e => setStatement(e.target.value)}
                placeholder="e.g. I feel that I am not good enough."
                className={`w-full px-4 py-3 rounded-2xl text-sm ${isSkyMode ? 'input-day' : 'input-night'}`}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isSkyMode ? 'text-bluey-700' : 'text-slate-400'}`}>
                  What does that mean to you?
                </label>
                <input
                  type="text"
                  value={meaningToMe}
                  onChange={e => setMeaningToMe(e.target.value)}
                  placeholder="e.g. That I will be rejected."
                  className={`w-full px-4 py-3 rounded-2xl text-sm ${isSkyMode ? 'input-day' : 'input-night'}`}
                />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isSkyMode ? 'text-bluey-700' : 'text-slate-400'}`}>
                  Where did it originate?
                </label>
                <input
                  type="text"
                  value={originHistorical}
                  onChange={e => setOriginHistorical(e.target.value)}
                  placeholder="e.g. Childhood, an old comparison."
                  className={`w-full px-4 py-3 rounded-2xl text-sm ${isSkyMode ? 'input-day' : 'input-night'}`}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-seafoam-500 to-teal-400 text-ocean-950 font-bold text-sm hover:from-seafoam-400 hover:to-teal-300 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-5 h-5" /> Start reframing
              </button>
              {activeBeliefs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className={`px-5 py-3.5 rounded-2xl border font-semibold text-sm transition-all ${isSkyMode ? 'border-bluey-300 text-bluey-800 hover:bg-white' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}`}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : (
          <select
            value={selectedBeliefId}
            onChange={e => { setSelectedBeliefId(e.target.value); setPractice(EMPTY_PRACTICE); }}
            className={`w-full px-4 py-3 rounded-2xl text-sm ${isSkyMode ? 'input-day' : 'input-night'}`}
          >
            {activeBeliefs.map(b => (
              <option key={b.id} value={b.id}>{b.statement}</option>
            ))}
          </select>
        )}
      </div>

      {/* Practice worksheet */}
      {!showNewForm && selectedBelief && (
        <div className={`rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 transition-all ${isSkyMode ? 'glass-card-day' : 'glass-card-night'}`}>
          {submitted ? (
            <div className="p-6 rounded-2xl bg-seafoam-500/10 border border-seafoam-500/30 text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-seafoam-400 mx-auto" />
              <h4 className="font-semibold text-slate-100">Reframe recorded!</h4>
              <p className="text-xs text-slate-300">Come back and practice this thought again anytime — progress builds with repetition.</p>
            </div>
          ) : (
            <form onSubmit={handleLogPractice} className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                <p className="text-xs text-slate-400">Working on the thought:</p>
                <p className="text-slate-100 font-semibold mt-0.5">“{selectedBelief.statement}”</p>
              </div>

              {/* Initial belief score */}
              <ScoreSlider
                label="How strongly do you believe it right now?"
                value={practice.initialBeliefScore}
                onChange={v => setP('initialBeliefScore', v)}
                isSkyMode={isSkyMode}
              />

              {/* Advantages / disadvantages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextArea
                  label="Advantages of thinking this way"
                  value={practice.advantages}
                  onChange={v => setP('advantages', v)}
                  placeholder="e.g. It keeps me cautious."
                  isSkyMode={isSkyMode}
                />
                <TextArea
                  label="Disadvantages of thinking this way"
                  value={practice.disadvantages}
                  onChange={v => setP('disadvantages', v)}
                  placeholder="e.g. It stops me from trying."
                  isSkyMode={isSkyMode}
                />
              </div>

              {/* Alternative thought */}
              <TextArea
                label="Find an alternative thought"
                icon={<Sparkles className="w-3.5 h-3.5 text-seafoam-400" />}
                value={practice.chosenAlternativeThought}
                onChange={v => setP('chosenAlternativeThought', v)}
                placeholder="A kinder, more balanced way to see this..."
                isSkyMode={isSkyMode}
              />

              {/* New action */}
              <TextArea
                label="What new action can you take today?"
                value={practice.chosenNewAction}
                onChange={v => setP('chosenNewAction', v)}
                placeholder="One small step that honors the new thought..."
                isSkyMode={isSkyMode}
              />

              {/* Final belief score */}
              <ScoreSlider
                label="How strongly do you believe the original thought now?"
                value={practice.finalBeliefScore}
                onChange={v => setP('finalBeliefScore', v)}
                isSkyMode={isSkyMode}
              />

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-seafoam-500 to-teal-400 text-ocean-950 font-bold text-sm tracking-wide hover:from-seafoam-400 hover:to-teal-300 transition-all shadow-xl shadow-seafoam-500/20 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" /> Save this reframe
              </button>
            </form>
          )}

          {/* Progress over time */}
          {practiceHistory.length > 0 && (
            <div className="pt-6 border-t border-slate-700/60 space-y-3">
              <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isSkyMode ? 'text-bluey-700' : 'text-slate-400'}`}>
                <TrendingDown className="w-3.5 h-3.5 text-seafoam-400" />
                Your belief over time ({practiceHistory.length})
              </h4>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-2">
                {practiceHistory.map(p => (
                  <div key={p.id} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-[10px] text-slate-500">
                      {new Date(p.practicedAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2 font-semibold">
                      <span className="text-slate-300">{p.initialBeliefScore}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-seafoam-300">{p.finalBeliefScore ?? '—'}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => { updateBeliefStatus(selectedBeliefId, 'resolved'); setSelectedBeliefId(''); }}
                className={`text-xs hover:text-seafoam-500 transition-colors underline underline-offset-2 ${isSkyMode ? 'text-bluey-700' : 'text-slate-400'}`}
              >
                This thought no longer bothers me — mark as resolved
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ScoreSlider({ label, value, onChange, isSkyMode }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <label className={`font-bold uppercase tracking-wider ${isSkyMode ? 'text-bluey-700' : 'text-slate-400'}`}>{label}</label>
        <span className="font-semibold text-seafoam-400 text-sm">{value} / 100</span>
      </div>
      <input
        type="range"
        min="1"
        max="100"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-seafoam-500 ${isSkyMode ? 'bg-bluey-100' : 'bg-slate-900'}`}
      />
      <div className={`flex justify-between text-[11px] font-medium px-1 ${isSkyMode ? 'text-bluey-600' : 'text-slate-500'}`}>
        <span>Not at all</span>
        <span>Completely</span>
      </div>
    </div>
  );
}

function TextArea({ label, icon, value, onChange, placeholder, isSkyMode }) {
  return (
    <div className="space-y-2">
      <label className={`block text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isSkyMode ? 'text-bluey-700' : 'text-slate-400'}`}>
        {icon}{label}
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className={`w-full px-4 py-3 rounded-2xl text-sm resize-none ${isSkyMode ? 'input-day' : 'input-night'}`}
      />
    </div>
  );
}
