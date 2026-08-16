import React from 'react';
import { TrendingUp, Flame, Heart, Brain, BookOpen, Award, Sparkles } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';

export function GrowthDashboard() {
  const { moodLogs, beliefs, beliefPractices, completedResources, breathingStreak, isSkyMode } = useWellness();

  // Calculate mood counts
  const moodCounts = moodLogs.reduce((acc, log) => {
    acc[log.mood] = (acc[log.mood] || 0) + 1;
    return acc;
  }, {});

  // Compute total checkins and reframe count
  const totalCheckIns = moodLogs.length;
  const totalReframes = beliefPractices.length;

  const milestones = [
    { title: 'First Ocean Check-In', unlocked: totalCheckIns >= 1, desc: 'Logged your first emotional state' },
    { title: 'Breathing Practitioner', unlocked: breathingStreak.count >= 3, desc: '3+ consecutive breathing streak' },
    { title: 'Thought Reframer', unlocked: totalReframes >= 2, desc: 'Reframed a bothering thought twice' },
    { title: 'Scholar of Well-Being', unlocked: completedResources.length >= 1, desc: 'Completed a mental health resource guide' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className={`font-display text-3xl font-bold flex items-center justify-center gap-2 ${isSkyMode ? 'text-bluey-950' : 'text-slate-100'}`}>
          <TrendingUp className="w-7 h-7 text-seafoam-400" />
          Growth & Analytics Dashboard
        </h2>
        <p className={`text-sm max-w-xl mx-auto ${isSkyMode ? 'text-bluey-800' : 'text-slate-400'}`}>
          Visualizing your emotional journey, thought reframing, and personal milestones over time.
        </p>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`${isSkyMode ? 'glass-card-day' : 'glass-card-night'} rounded-2xl p-4 text-center space-y-1 transition-all`}>
          <Flame className="w-5 h-5 text-amber-400 mx-auto" />
          <div className={`font-display text-2xl font-bold ${isSkyMode ? 'text-bluey-950' : 'text-slate-100'}`}>{breathingStreak.count} Days</div>
          <div className={`text-[11px] font-medium ${isSkyMode ? 'text-bluey-700' : 'text-slate-400'}`}>Breathing Streak</div>
        </div>

        <div className={`${isSkyMode ? 'glass-card-day' : 'glass-card-night'} rounded-2xl p-4 text-center space-y-1 transition-all`}>
          <Heart className="w-5 h-5 text-rose-400 mx-auto" />
          <div className={`font-display text-2xl font-bold ${isSkyMode ? 'text-bluey-950' : 'text-slate-100'}`}>{totalCheckIns}</div>
          <div className={`text-[11px] font-medium ${isSkyMode ? 'text-bluey-700' : 'text-slate-400'}`}>Total Check-Ins</div>
        </div>

        <div className={`${isSkyMode ? 'glass-card-day' : 'glass-card-night'} rounded-2xl p-4 text-center space-y-1 transition-all`}>
          <Brain className="w-5 h-5 text-seafoam-400 mx-auto" />
          <div className={`font-display text-2xl font-bold ${isSkyMode ? 'text-bluey-950' : 'text-slate-100'}`}>{totalReframes}</div>
          <div className={`text-[11px] font-medium ${isSkyMode ? 'text-bluey-700' : 'text-slate-400'}`}>Thoughts Reframed</div>
        </div>

        <div className={`${isSkyMode ? 'glass-card-day' : 'glass-card-night'} rounded-2xl p-4 text-center space-y-1 transition-all`}>
          <BookOpen className="w-5 h-5 text-indigo-400 mx-auto" />
          <div className={`font-display text-2xl font-bold ${isSkyMode ? 'text-bluey-950' : 'text-slate-100'}`}>{completedResources.length}</div>
          <div className={`text-[11px] font-medium ${isSkyMode ? 'text-bluey-700' : 'text-slate-400'}`}>Guides Completed</div>
        </div>
      </div>

      {/* Mood Distribution & Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Mood Distribution */}
        <div className={`rounded-3xl p-6 shadow-xl space-y-4 transition-all ${isSkyMode ? 'glass-card-day' : 'glass-card-night'}`}>
          <h3 className={`font-display text-lg font-bold flex items-center gap-2 ${isSkyMode ? 'text-bluey-950' : 'text-slate-100'}`}>
            <Heart className="w-4 h-4 text-seafoam-400" />
            Emotional Check-In Distribution
          </h3>

          {Object.keys(moodCounts).length === 0 ? (
            <p className={`text-xs italic py-6 text-center ${isSkyMode ? 'text-bluey-600' : 'text-slate-500'}`}>No check-ins logged yet. Complete a check-in to see your mood trends!</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(moodCounts).map(([mood, count]) => {
                const percentage = Math.round((count / totalCheckIns) * 100);
                return (
                  <div key={mood} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className={isSkyMode ? 'text-bluey-950' : 'text-slate-200'}>{mood}</span>
                      <span className="text-seafoam-500">{count} ({percentage}%)</span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${isSkyMode ? 'bg-bluey-100' : 'bg-slate-900'}`}>
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
        <div className={`rounded-3xl p-6 shadow-xl space-y-4 transition-all ${isSkyMode ? 'glass-card-day' : 'glass-card-night'}`}>
          <h3 className={`font-display text-lg font-bold flex items-center gap-2 ${isSkyMode ? 'text-bluey-950' : 'text-slate-100'}`}>
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
        <div className={`rounded-3xl p-6 shadow-xl space-y-4 transition-all ${isSkyMode ? 'glass-card-day' : 'glass-card-night'}`}>
          <h3 className={`font-display text-lg font-bold ${isSkyMode ? 'text-bluey-950' : 'text-slate-100'}`}>Recent Emotional History</h3>
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
