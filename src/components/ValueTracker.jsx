import React, { useState } from 'react';
import { Target, Plus, CheckCircle, Award } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import { OtterMascot } from './OtterMascot';

export function ValueTracker() {
  const { userValues, valueLogs, logValueAction, updateValueAlignment, mascotState } = useWellness();

  const [selectedValId, setSelectedValId] = useState(userValues[0]?.id || '');
  const [actionDesc, setActionDesc] = useState('');
  const [reflection, setReflection] = useState('');
  const [loggedSuccess, setLoggedSuccess] = useState(false);

  const handleLogAction = (e) => {
    e.preventDefault();
    if (!actionDesc.trim()) return;
    logValueAction(selectedValId, actionDesc, reflection);
    setActionDesc('');
    setReflection('');
    setLoggedSuccess(true);
    setTimeout(() => setLoggedSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl font-bold text-slate-100 flex items-center justify-center gap-2">
          <Target className="w-7 h-7 text-seafoam-400" />
          Long-Term Core Values & Alignment
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Define what matters most to your spirit, and track how your daily actions align over time.
        </p>
      </div>

      <OtterMascot expression={mascotState.expression} speech={mascotState.speech} />

      {/* Core Values Alignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userValues.map(val => (
          <div
            key={val.id}
            className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-3 backdrop-blur-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-100">{val.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{val.description}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-seafoam-500/10 border border-seafoam-500/30 text-seafoam-300 font-bold text-xs">
                {val.alignmentScore}/10 Alignment
              </span>
            </div>

            {/* Alignment Score Range */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Alignment Rating</span>
                <span>{val.alignmentScore * 10}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={val.alignmentScore}
                onChange={e => updateValueAlignment(val.id, Number(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-seafoam-500"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Log Action Form */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
        <h3 className="font-display text-xl font-bold text-slate-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-seafoam-400" />
          Log a Value-Driven Action
        </h3>

        {loggedSuccess ? (
          <div className="p-6 rounded-2xl bg-seafoam-500/10 border border-seafoam-500/30 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-seafoam-400 mx-auto" />
            <h4 className="font-semibold text-slate-100">Value Action Recorded!</h4>
            <p className="text-xs text-slate-300">Every small action aligns your life with your deepest truths.</p>
          </div>
        ) : (
          <form onSubmit={handleLogAction} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Select Core Value
              </label>
              <select
                value={selectedValId}
                onChange={e => setSelectedValId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/60 border border-slate-700 text-slate-100 focus:border-seafoam-500 text-sm"
              >
                {userValues.map(val => (
                  <option key={val.id} value={val.id}>{val.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                What action did you take today?
              </label>
              <input
                type="text"
                value={actionDesc}
                onChange={e => setActionDesc(e.target.value)}
                placeholder="e.g. Took 10 minutes to meditate instead of rushing, set a healthy boundary..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/60 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:border-seafoam-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-seafoam-500 to-teal-400 text-ocean-950 font-bold text-sm hover:from-seafoam-400 hover:to-teal-300 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Log Value Action
            </button>
          </form>
        )}

        {/* History of Value Logs */}
        {valueLogs.length > 0 && (
          <div className="pt-6 border-t border-slate-700/60 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recent Value Actions Logged ({valueLogs.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {valueLogs.map(log => {
                const matchedVal = userValues.find(v => v.id === log.valueId);
                return (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-seafoam-300">{matchedVal?.name || 'Core Value'}</span>
                      <p className="text-slate-200 mt-0.5">{log.actionDescription}</p>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
