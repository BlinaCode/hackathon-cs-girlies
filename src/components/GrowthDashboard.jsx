import React from 'react';
import { TrendingUp, Flame, Heart, Target, BookOpen, Award, Sparkles } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';

export function GrowthDashboard() {
  const { moodLogs, userValues, valueLogs, completedResources, breathingStreak } = useWellness();

  // Calculate mood counts
  const moodCounts = moodLogs.reduce((acc, log) => {
    acc[log.mood] = (acc[log.mood] || 0) + 1;
    return acc;
  }, {});

  // Compute total checkins and average alignment score
  const totalCheckIns = moodLogs.length;
  const avgAlignment = userValues.length > 0
    ? (userValues.reduce((sum, v) => sum + v.alignmentScore, 0) / userValues.length).toFixed(1)
    : 0;

  const milestones = [
    { title: 'First Ocean Check-In', unlocked: totalCheckIns >= 1, desc: 'Logged your first emotional state' },
    { title: 'Breathing Practitioner', unlocked: breathingStreak.count >= 3, desc: '3+ consecutive breathing streak' },
    { title: 'Values Aligned', unlocked: valueLogs.length >= 2, desc: 'Logged 2+ core value actions' },
    { title: 'Scholar of Well-Being', unlocked: completedResources.length >= 1, desc: 'Completed a mental health resource guide' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl font-bold text-slate-100 flex items-center justify-center gap-2">
          <TrendingUp className="w-7 h-7 text-seafoam-400" />
          Growth & Analytics Dashboard
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Visualizing your emotional journey, core value alignment, and personal milestones over time.
        </p>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-center space-y-1 backdrop-blur-md">
          <Flame className="w-5 h-5 text-amber-400 mx-auto" />
          <div className="font-display text-2xl font-bold text-slate-100">{breathingStreak.count} Days</div>
          <div className="text-[11px] text-slate-400 font-medium">Breathing Streak</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-center space-y-1 backdrop-blur-md">
          <Heart className="w-5 h-5 text-rose-400 mx-auto" />
          <div className="font-display text-2xl font-bold text-slate-100">{totalCheckIns}</div>
          <div className="text-[11px] text-slate-400 font-medium">Total Check-Ins</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-center space-y-1 backdrop-blur-md">
          <Target className="w-5 h-5 text-seafoam-400 mx-auto" />
          <div className="font-display text-2xl font-bold text-slate-100">{avgAlignment}/10</div>
          <div className="text-[11px] text-slate-400 font-medium">Avg Value Alignment</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-center space-y-1 backdrop-blur-md">
          <BookOpen className="w-5 h-5 text-indigo-400 mx-auto" />
          <div className="font-display text-2xl font-bold text-slate-100">{completedResources.length}</div>
          <div className="text-[11px] text-slate-400 font-medium">Guides Completed</div>
        </div>
      </div>

      {/* Mood Distribution & Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Mood Distribution */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-md">
          <h3 className="font-display text-lg font-bold text-slate-100 flex items-center gap-2">
            <Heart className="w-4 h-4 text-seafoam-400" />
            Emotional Check-In Distribution
          </h3>

          {Object.keys(moodCounts).length === 0 ? (
            <p className="text-xs text-slate-500 italic py-6 text-center">No check-ins logged yet. Complete a check-in to see your mood trends!</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(moodCounts).map(([mood, count]) => {
                const percentage = Math.round((count / totalCheckIns) * 100);
                return (
                  <div key={mood} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-200">{mood}</span>
                      <span className="text-seafoam-400">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-seafoam-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Milestone Badges */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-md">
          <h3 className="font-display text-lg font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Personal Growth Badges
          </h3>

          <div className="space-y-2.5">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                  m.unlocked
                    ? 'bg-seafoam-500/10 border-seafoam-500/30 text-slate-100'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
                }`}
              >
                <div className={`p-2 rounded-xl ${m.unlocked ? 'bg-seafoam-500/20 text-seafoam-400' : 'bg-slate-800 text-slate-600'}`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-slate-100">{m.title}</div>
                  <div className="text-[11px] text-slate-400">{m.desc}</div>
                </div>
                {m.unlocked && (
                  <span className="ml-auto text-[10px] uppercase font-bold text-seafoam-400 px-2 py-0.5 rounded-full bg-seafoam-500/20">
                    Unlocked
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mood History Timeline */}
      {moodLogs.length > 0 && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-md">
          <h3 className="font-display text-lg font-bold text-slate-100">Recent Emotional History</h3>
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-2">
            {moodLogs.map(log => (
              <div key={log.id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-seafoam-300">{log.mood}</span>
                    <span className="text-[10px] text-slate-500">Energy: {log.energyLevel}/5</span>
                  </div>
                  {log.reflection && <p className="text-slate-300 italic text-[11px]">"{log.reflection}"</p>}
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
