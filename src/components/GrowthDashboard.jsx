import React, { useState } from 'react';
import { TrendingUp, Flame, Heart, Brain, BookOpen, Award, X, CheckCircle2, Trash2, ArrowRight } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import lotoSvg from '../assets/svg/flordeloto.svg';
import { OtterMascot } from './OtterMascot';
import otterCheckin from '../assets/images/otter-checkin.png';
import otterBreathe from '../assets/images/otter-breathe.png';
import otterReframe from '../assets/images/otter-reframe.png';
import shellOtter from '../assets/images/shellotter.png';
import sadOtter from '../assets/images/sad-otter.png';
import yayOtter from '../assets/images/yayotter.png';

function SeaweedFlourish({ className }) {
  return (
    <svg viewBox="0 0 40 60" className={className} aria-hidden="true">
      <path d="M20 58 C20 40, 8 40, 10 22 C12 8, 20 8, 20 2" stroke="#7E7B51" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M20 50 C20 34, 30 34, 28 18" stroke="#A89B6E" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function ShellFlourish({ className }) {
  return (
    <svg viewBox="0 0 40 32" className={className} aria-hidden="true">
      <path d="M4 26 C2 16, 30 16, 28 26 C30 30, 2 30, 4 26 Z" fill="#C99C8B" opacity="0.5" />
      <path d="M16 28 L10 16" stroke="#FEF8F7" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <path d="M16 28 L16 14" stroke="#FEF8F7" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <path d="M16 28 L22 16" stroke="#FEF8F7" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function SandDollarFlourish({ className }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="16" fill="#F5E8C9" stroke="#E3CE9E" strokeWidth="1.2" opacity="0.7" />
      <g stroke="#D1B882" strokeWidth="1" fill="none" opacity="0.7" strokeLinecap="round">
        <path d="M20 10 C21.5 15, 21.5 20, 20 25 M20 10 C18.5 15, 18.5 20, 20 25" />
        <path d="M10 20 C15 21.5, 20 21.5, 25 20 M10 20 C15 18.5, 20 18.5, 25 20" />
      </g>
    </svg>
  );
}

const STAT_TONES = {
  dune: { medallion: 'bg-dune-200/80' },
  blush: { medallion: 'bg-blush-300/60' },
  lagoon: { medallion: 'bg-lagoon-300/60' },
  foliage: { medallion: 'bg-foliage-300/50' },
};

export function GrowthDashboard({ setActiveTab }) {
  const {
    moodLogs, beliefs, beliefPractices, completedResources, breathingStreak, isSkyMode,
    updateBeliefStatus, deleteBelief, setPendingReframeBeliefId
  } = useWellness();

  const [showThoughtsModal, setShowThoughtsModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Calculate mood counts
  const moodCounts = moodLogs.reduce((acc, log) => {
    acc[log.mood] = (acc[log.mood] || 0) + 1;
    return acc;
  }, {});

  // Compute total checkins and reframe count
  const totalCheckIns = moodLogs.length;
  const totalReframes = beliefPractices.length;

  const milestones = [
    { title: 'First Ocean Check-In', unlocked: totalCheckIns >= 1, desc: 'Logged your first emotional state', portrait: otterCheckin },
    { title: 'Breathing Practitioner', unlocked: breathingStreak.count >= 3, desc: '3+ consecutive breathing streak', portrait: otterBreathe },
    { title: 'Thought Reframer', unlocked: totalReframes >= 2, desc: 'Reframed a bothering thought twice', portrait: otterReframe },
    { title: 'Scholar of Well-Being', unlocked: completedResources.length >= 1, desc: 'Completed a mental health resource guide', portrait: shellOtter },
  ];
  const allUnlocked = milestones.every(m => m.unlocked);

  const stats = [
    { icon: Flame, label: 'Breathing Streak', value: `${breathingStreak.count} Days`, tone: 'dune' },
    { icon: Heart, label: 'Total Check-Ins', value: totalCheckIns, tone: 'blush' },
    { icon: Brain, label: 'Thoughts Reframed', value: totalReframes, tone: 'lagoon', onClick: () => setShowThoughtsModal(true) },
    { icon: BookOpen, label: 'Guides Completed', value: completedResources.length, tone: 'foliage' },
  ];

  // Active thoughts first (most recent first, already the storage order),
  // resolved ones pushed to the bottom to read as "done, kept for reference".
  const sortedBeliefs = [...beliefs].sort((a, b) => (a.status === 'resolved' ? 1 : 0) - (b.status === 'resolved' ? 1 : 0));

  const handleReframe = (beliefId) => {
    setPendingReframeBeliefId(beliefId);
    setShowThoughtsModal(false);
    setActiveTab('beliefs');
  };

  const handleDeleteClick = (beliefId) => {
    if (confirmDeleteId === beliefId) {
      deleteBelief(beliefId);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(beliefId);
    }
  };

  return (
    <div className="relative max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-10">

      {/* Ambient watercolor blobs, purely decorative */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-6 h-64 overflow-hidden -z-10">
        <div className={`absolute left-0 top-0 w-72 h-72 rounded-full blur-3xl ${isSkyMode ? 'bg-lagoon-200/50' : 'bg-lagoon-700/20'}`} />
        <div className={`absolute right-0 top-6 w-80 h-80 rounded-full blur-3xl ${isSkyMode ? 'bg-blush-200/50' : 'bg-otterfur-500/10'}`} />
      </div>

      <div className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <img src={lotoSvg} alt="Lotus Flower" className="w-28 h-28 object-contain drop-shadow-lg" />
        </div>
        <h2 className={`font-display text-3xl font-bold flex items-center justify-center gap-2 ${isSkyMode ? 'text-lagoon-950' : 'text-white'}`}>
          <TrendingUp className={`w-7 h-7 ${isSkyMode ? 'text-lagoon-500' : 'text-lagoon-400'}`} />
          Growth & Analytics Dashboard
        </h2>
        <p className={`text-xs sm:text-sm max-w-xl mx-auto font-semibold ${isSkyMode ? 'text-lagoon-700' : 'text-lagoon-300'}`}>
          Visualizing your emotional journey, thought reframing, and personal milestones over time.
        </p>
      </div>

      <OtterMascot
        expression={allUnlocked ? 'celebrating' : 'caring'}
        speech={allUnlocked
          ? "You've unlocked every badge! I'm so proud of how far you've swum."
          : "Every wave you ride adds up. Let's see how far you've come."}
        compact
      />

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {stats.map(({ icon: Icon, label, value, tone, onClick }) => {
          const CardTag = onClick ? 'button' : 'div';
          return (
            <CardTag
              key={label}
              type={onClick ? 'button' : undefined}
              onClick={onClick}
              className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-center space-y-2 shadow-xl border transition-all w-full ${
                onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-2xl active:scale-[0.98]' : ''
              } ${
                isSkyMode
                  ? 'bg-gradient-to-br from-white via-lagoon-50 to-blush-100 border-white/60'
                  : 'bg-gradient-to-br from-midnight-950 via-midnight-900 to-[#1D2636] border-midnight-800'
              }`}
            >
              <span className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full mx-auto ${STAT_TONES[tone].medallion}`}>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isSkyMode ? 'text-lagoon-800' : 'text-lagoon-100'}`} />
              </span>
              <div className={`font-display text-xl sm:text-2xl font-bold ${isSkyMode ? 'text-lagoon-950' : 'text-white'}`}>{value}</div>
              <div className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wide ${isSkyMode ? 'text-lagoon-700' : 'text-lagoon-300'}`}>{label}</div>
              {onClick && (
                <div className={`text-[9px] font-bold uppercase tracking-wide ${isSkyMode ? 'text-lagoon-500' : 'text-lagoon-500'}`}>
                  Tap to manage
                </div>
              )}
            </CardTag>
          );
        })}
      </div>

      {/* Mood Distribution & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

        {/* Mood Distribution */}
        <div className={`relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-4 transition-all border ${
          isSkyMode
            ? 'bg-gradient-to-br from-white via-lagoon-50 to-blush-100 border-white/60'
            : 'bg-gradient-to-br from-midnight-950 via-midnight-900 to-[#1D2636] border-midnight-800'
        }`}>
          <SeaweedFlourish className="hidden sm:block absolute -bottom-2 left-4 w-8 h-14 opacity-70" />

          <h3 className={`relative font-display text-lg font-bold flex items-center gap-2 ${isSkyMode ? 'text-lagoon-950' : 'text-white'}`}>
            <Heart className={`w-4 h-4 ${isSkyMode ? 'text-blush-400' : 'text-blush-300'}`} />
            Emotional Check-In Distribution
          </h3>

          {Object.keys(moodCounts).length === 0 ? (
            <div className="relative flex flex-col items-center text-center gap-3 py-4">
              <img src={sadOtter} alt="" className="w-24 h-24 object-contain opacity-90" />
              <p className={`text-xs sm:text-sm font-semibold max-w-[220px] ${isSkyMode ? 'text-lagoon-700' : 'text-lagoon-300'}`}>
                No check-ins yet — Sisu's a little lonely. Log your first mood to see your trends here.
              </p>
            </div>
          ) : (
            <div className="relative space-y-3">
              {Object.entries(moodCounts).map(([mood, count]) => {
                const percentage = Math.round((count / totalCheckIns) * 100);
                return (
                  <div key={mood} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className={isSkyMode ? 'text-lagoon-950' : 'text-lagoon-100'}>{mood}</span>
                      <span className={isSkyMode ? 'text-lagoon-600' : 'text-lagoon-400'}>{count} ({percentage}%)</span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${isSkyMode ? 'bg-dune-100' : 'bg-lagoon-950'}`}>
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-dune-300 to-lagoon-400"
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
        <div className={`relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-4 transition-all border ${
          isSkyMode
            ? 'bg-gradient-to-br from-white via-lagoon-50 to-blush-100 border-white/60'
            : 'bg-gradient-to-br from-midnight-950 via-midnight-900 to-[#1D2636] border-midnight-800'
        }`}>
          <ShellFlourish className="hidden sm:block absolute -bottom-2 right-6 w-10 h-8 opacity-70" />

          <h3 className={`relative font-display text-lg font-bold flex items-center gap-2 ${isSkyMode ? 'text-lagoon-950' : 'text-white'}`}>
            <Award className={`w-4 h-4 ${isSkyMode ? 'text-dune-400' : 'text-dune-300'}`} />
            Personal Growth Badges
          </h3>

          <div className="relative space-y-2.5">
            {milestones.map((m) => (
              <div
                key={m.title}
                className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                  m.unlocked
                    ? (isSkyMode ? 'bg-white/70 border-lagoon-200 shadow-sm' : 'bg-midnight-900/50 border-midnight-800')
                    : (isSkyMode ? 'bg-dune-50/40 border-dune-100 opacity-70' : 'bg-midnight-950/30 border-midnight-900 opacity-60')
                }`}
              >
                <div className={`w-11 h-11 rounded-full overflow-hidden shrink-0 border ${
                  isSkyMode ? 'bg-white border-lagoon-100' : 'bg-midnight-950 border-midnight-800'
                }`}>
                  <img
                    src={m.portrait}
                    alt=""
                    className={`w-full h-full object-cover ${m.unlocked ? '' : 'grayscale opacity-50'}`}
                  />
                </div>
                <div className="min-w-0">
                  <div className={`font-bold text-xs ${isSkyMode ? 'text-lagoon-950' : 'text-white'}`}>{m.title}</div>
                  <div className={`text-[11px] ${isSkyMode ? 'text-lagoon-700/80' : 'text-lagoon-400'}`}>{m.desc}</div>
                </div>
                {m.unlocked && (
                  <span className={`ml-auto shrink-0 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    isSkyMode ? 'text-lagoon-700 bg-lagoon-200/60' : 'text-lagoon-200 bg-lagoon-800'
                  }`}>
                    Unlocked
                  </span>
                )}
              </div>
            ))}
          </div>

          {allUnlocked && (
            <div className={`relative flex items-center gap-3 p-3 rounded-2xl border ${
              isSkyMode ? 'bg-dune-100/60 border-dune-200' : 'bg-otterfur-500/10 border-otterfur-500/20'
            }`}>
              <img src={yayOtter} alt="" className="w-12 h-12 object-contain shrink-0" />
              <p className={`text-xs font-bold ${isSkyMode ? 'text-lagoon-900' : 'text-lagoon-100'}`}>
                Every badge collected — what a journey!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mood History Timeline */}
      {moodLogs.length > 0 && (
        <div className={`relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-4 transition-all border ${
          isSkyMode
            ? 'bg-gradient-to-br from-white via-lagoon-50 to-blush-100 border-white/60'
            : 'bg-gradient-to-br from-midnight-950 via-midnight-900 to-[#1D2636] border-midnight-800'
        }`}>
          <SandDollarFlourish className="hidden sm:block absolute -top-2 right-8 w-10 h-10 opacity-60" />

          <h3 className={`relative font-display text-lg font-bold ${isSkyMode ? 'text-lagoon-950' : 'text-white'}`}>
            Recent Emotional History
          </h3>
          <div className="relative space-y-2.5 max-h-64 overflow-y-auto pr-2">
            {moodLogs.map(log => (
              <div
                key={log.id}
                className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                  isSkyMode ? 'bg-white/60 border-lagoon-100' : 'bg-midnight-900/40 border-midnight-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${isSkyMode ? 'text-lagoon-800' : 'text-lagoon-300'}`}>{log.mood}</span>
                    <span className={isSkyMode ? 'text-lagoon-500' : 'text-lagoon-500'}>Energy: {log.energyLevel}/5</span>
                  </div>
                  {log.reflection && (
                    <p className={`italic text-[11px] ${isSkyMode ? 'text-lagoon-700' : 'text-lagoon-300'}`}>"{log.reflection}"</p>
                  )}
                </div>
                <span className={`text-[10px] shrink-0 ${isSkyMode ? 'text-lagoon-500' : 'text-lagoon-500'}`}>
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manage Thoughts modal */}
      {showThoughtsModal && (
        <div className="fixed inset-0 z-50 bg-lagoon-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`relative border rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl max-h-[85vh] flex flex-col ${
            isSkyMode ? 'bg-white border-lagoon-200' : 'bg-midnight-900 border-midnight-800'
          }`}>
            <button
              onClick={() => { setShowThoughtsModal(false); setConfirmDeleteId(null); }}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                isSkyMode ? 'text-lagoon-400 hover:bg-lagoon-50 hover:text-lagoon-800' : 'text-lagoon-300 hover:bg-lagoon-800 hover:text-white'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 shrink-0">
              <img src={otterReframe} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
              <div>
                <h3 className={`font-display text-xl font-bold ${isSkyMode ? 'text-lagoon-950' : 'text-white'}`}>
                  Your Thoughts
                </h3>
                <p className={`text-xs font-medium ${isSkyMode ? 'text-lagoon-700' : 'text-lagoon-300'}`}>
                  Resolve, revisit, or let go of what no longer serves you.
                </p>
              </div>
            </div>

            {sortedBeliefs.length === 0 ? (
              <p className={`text-xs sm:text-sm font-semibold text-center py-6 ${isSkyMode ? 'text-lagoon-600' : 'text-lagoon-400'}`}>
                No thoughts logged yet. Head to Reframe Thoughts to name one.
              </p>
            ) : (
              <div className="space-y-2.5 overflow-y-auto pr-1">
                {sortedBeliefs.map(b => {
                  const isResolved = b.status === 'resolved';
                  const isConfirmingDelete = confirmDeleteId === b.id;
                  return (
                    <div
                      key={b.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isResolved
                          ? (isSkyMode ? 'bg-dune-50/40 border-dune-100 opacity-60' : 'bg-midnight-950/30 border-midnight-800 opacity-50')
                          : (isSkyMode ? 'bg-white border-lagoon-200 shadow-sm' : 'bg-midnight-950/40 border-midnight-800')
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className={`text-sm font-semibold leading-snug ${isSkyMode ? 'text-lagoon-950' : 'text-lagoon-100'}`}>
                          "{b.statement}"
                        </p>
                        {isResolved && (
                          <span className={`shrink-0 text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            isSkyMode ? 'text-lagoon-600 bg-lagoon-100' : 'text-lagoon-300 bg-lagoon-800'
                          }`}>
                            Resolved
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        {!isResolved && (
                          <>
                            <button
                              type="button"
                              onClick={() => updateBeliefStatus(b.id, 'resolved')}
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold transition-all active:scale-95 ${
                                isSkyMode ? 'bg-lagoon-100 text-lagoon-700 hover:bg-lagoon-200' : 'bg-lagoon-800 text-lagoon-200 hover:bg-lagoon-700'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReframe(b.id)}
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold transition-all active:scale-95 ${
                                isSkyMode ? 'bg-dune-100 text-otterfur-500 hover:bg-dune-200' : 'bg-otterfur-500/15 text-dune-300 hover:bg-otterfur-500/25'
                              }`}
                            >
                              Reframe <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(b.id)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold transition-all active:scale-95 ml-auto ${
                            isConfirmingDelete
                              ? 'bg-otterfur-500 text-white hover:bg-otterfur-400'
                              : (isSkyMode ? 'bg-blush-100 text-otterfur-500 hover:bg-blush-200' : 'bg-blush-300/10 text-blush-300 hover:bg-blush-300/20')
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" /> {isConfirmingDelete ? 'Really delete?' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
