import React, { useMemo } from 'react';
import { Play, Pause, Waves, Users, Compass, ArrowRight } from 'lucide-react';
import { useBreathingTimer } from '../hooks/useBreathingTimer';
import { useBreathingPresence } from '../hooks/useBreathingPresence';
import { useWellness } from '../context/WellnessContext';
import otterBreathe from '../assets/images/otter-breathe.png';
import calmOtter from '../assets/images/calmotter.png';
import contentOtter from '../assets/images/contentotter.png';
import frontOtter from '../assets/images/frontotter.png';
import shellOtter from '../assets/images/shellotter.png';
import yayOtter from '../assets/images/yayotter.png';

const COMPANION_PORTRAITS = [calmOtter, contentOtter, shellOtter, yayOtter, frontOtter];
const MAX_VISIBLE = 10;

// Deterministic hue per participant so the same person keeps the same otter
// color across presence re-syncs, instead of shuffling on every render.
function hueForId(id) {
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) % 360;
  return hash;
}

const BUBBLES = [
  { size: 18, left: '6%', top: '14%' },
  { size: 12, left: '92%', top: '10%' },
  { size: 22, left: '90%', top: '78%' },
  { size: 14, left: '4%', top: '80%' },
  { size: 10, left: '50%', top: '4%' },
  { size: 16, left: '10%', top: '48%' },
  { size: 12, left: '95%', top: '46%' },
];

export function Connect({ setActiveTab }) {
  const participants = useBreathingPresence();
  const { isSkyMode } = useWellness();
  const { mode, isActive, currentPhase, toggleTimer } = useBreathingTimer('ocean');

  const visibleParticipants = participants.slice(0, MAX_VISIBLE);
  const overflowCount = participants.length - visibleParticipants.length;

  const ringPositions = useMemo(() => {
    const total = visibleParticipants.length || 1;
    const radius = 44;
    return visibleParticipants.map((_, idx) => {
      const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
      return {
        left: `${50 + radius * Math.cos(angle)}%`,
        top: `${50 + radius * Math.sin(angle)}%`,
      };
    });
  }, [visibleParticipants.length]);

  const scaleClass =
    currentPhase.name === 'Inhale'
      ? 'scale-110'
      : currentPhase.name === 'Exhale'
        ? 'scale-90'
        : 'scale-100';

  return (
    <div className="w-full space-y-8 pb-10 px-2 sm:px-0">
      {/* Title */}
      <div className="text-center space-y-2">
        <span
          className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm"
          style={
            isSkyMode
              ? { background: '#A4D3DE', color: '#0F3D42' }
              : { background: '#2C5560', color: '#CFEFF3' }
          }
        >
          Shared Space
        </span>

        <h2
          className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold flex items-center justify-center gap-3 ${
            isSkyMode ? 'text-bluey-950' : 'text-slate-100'
          }`}
        >
          <Waves className={`w-8 h-8 sm:w-9 sm:h-9 ${isSkyMode ? 'text-bluey-500' : 'text-seafoam-400'}`} />
          Breathe Together
        </h2>

        <p
          className={`text-sm sm:text-base max-w-xl mx-auto font-medium ${
            isSkyMode ? 'text-bluey-700' : 'text-bluey-300'
          }`}
        >
          {participants.length === 0
            ? "You're the first otter in the cove right now — settle in, others may float by."
            : participants.length === 1
              ? `${participants[0].name} is here with you.`
              : `${participants[0].name} and ${participants.length - 1} other${
                  participants.length - 1 === 1 ? '' : 's'
                } are here with you.`}
        </p>
      </div>

      {/* Cove + Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cove */}
        <div
          className="lg:col-span-2 rounded-3xl border p-8 sm:p-14 shadow-xl relative overflow-hidden min-h-[420px] sm:min-h-[560px] flex flex-col items-center justify-center"
          style={
            isSkyMode
              ? { background: '#A4D3DE33', borderColor: '#A4D3DE' }
              : { background: '#3E6B7826', borderColor: '#3E6B7888' }
          }
        >
          {/* Ambient bubbles to fill the space */}
          {BUBBLES.map((b, i) => (
            <div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: b.size,
                height: b.size,
                left: b.left,
                top: b.top,
                background: isSkyMode ? 'rgba(164,211,222,0.35)' : 'rgba(124,197,214,0.15)',
              }}
            />
          ))}

          {/* Rising & falling ocean waves along the floor of the cove */}
          <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-40 overflow-hidden pointer-events-none">
            <svg
              className="absolute bottom-0 left-0 w-[200%] h-full animate-wave-drift-slow"
              viewBox="0 0 2880 320"
              preserveAspectRatio="none"
            >
              <path
                fill={isSkyMode ? '#A4D3DE' : '#3E6B78'}
                fillOpacity="0.35"
                d="M0,192L60,197.3C120,203,240,213,360,197.3C480,181,600,139,720,144C840,149,960,203,1080,213.3C1200,224,1320,192,1440,176C1560,160,1680,160,1800,176C1920,192,2040,224,2160,213.3C2280,203,2400,149,2520,144C2640,139,2760,181,2820,202.7L2880,224L2880,320L0,320Z"
              />
              <path
                fill={isSkyMode ? '#A4D3DE' : '#3E6B78'}
                fillOpacity="0.35"
                d="M0,192L60,197.3C120,203,240,213,360,197.3C480,181,600,139,720,144C840,149,960,203,1080,213.3C1200,224,1320,192,1440,176C1560,160,1680,160,1800,176C1920,192,2040,224,2160,213.3C2280,203,2400,149,2520,144C2640,139,2760,181,2820,202.7L2880,224L2880,320L0,320Z"
                transform="translate(1440, 0)"
              />
            </svg>
            <svg
              className="absolute bottom-0 left-0 w-[200%] h-full animate-wave-drift"
              viewBox="0 0 2880 320"
              preserveAspectRatio="none"
            >
              <path
                fill={isSkyMode ? '#5FA0AF' : '#7CC5D6'}
                fillOpacity="0.3"
                d="M0,256L48,240C96,224,192,192,288,197.3C384,203,480,245,576,250.7C672,256,768,224,864,213.3C960,203,1056,213,1152,224C1248,235,1344,245,1440,240C1536,235,1632,213,1728,213.3C1824,213,1920,235,2016,240C2112,245,2208,235,2304,213.3C2400,192,2496,160,2592,160C2688,160,2784,192,2832,208L2880,224L2880,320L0,320Z"
              />
              <path
                fill={isSkyMode ? '#5FA0AF' : '#7CC5D6'}
                fillOpacity="0.3"
                d="M0,256L48,240C96,224,192,192,288,197.3C384,203,480,245,576,250.7C672,256,768,224,864,213.3C960,203,1056,213,1152,224C1248,235,1344,245,1440,240C1536,235,1632,213,1728,213.3C1824,213,1920,235,2016,240C2112,245,2208,235,2304,213.3C2400,192,2496,160,2592,160C2688,160,2784,192,2832,208L2880,224L2880,320L0,320Z"
                transform="translate(1440, 0)"
              />
            </svg>
          </div>

          <div className="relative w-80 h-80 sm:w-[28rem] sm:h-[28rem] lg:w-[32rem] lg:h-[32rem]">
            {/* Orbit ring guide */}
            <div
              className="absolute inset-6 rounded-full border-2 border-dashed opacity-30 pointer-events-none"
              style={{ borderColor: isSkyMode ? '#5FA0AF' : '#7CC5D6' }}
            />

            {/* Companion otters — static, no breathing animation, just present */}
            {visibleParticipants.map((p, idx) => (
              <div
                key={p.id}
                className="absolute w-14 h-14 sm:w-16 sm:h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-lg overflow-hidden flex items-center justify-center"
                style={{
                  left: ringPositions[idx].left,
                  top: ringPositions[idx].top,
                  background: isSkyMode ? '#FAFBF0' : '#1E2226',
                  borderColor: isSkyMode ? '#E8E2D1' : '#3A3F45',
                }}
                title={p.name}
              >
                <img
                  src={COMPANION_PORTRAITS[idx % COMPANION_PORTRAITS.length]}
                  alt={`${p.name} the otter`}
                  className="w-full h-full object-cover"
                  style={{ filter: `hue-rotate(${hueForId(p.id)}deg) saturate(1.3)` }}
                />
              </div>
            ))}

            {overflowCount > 0 && (
              <div
                className="absolute w-14 h-14 sm:w-16 sm:h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-lg flex items-center justify-center text-xs font-bold"
                style={{
                  left: '50%',
                  top: '2%',
                  background: isSkyMode ? '#F5E8C9' : '#5A4A2E',
                  borderColor: isSkyMode ? '#E3CE9E' : '#7A6238',
                  color: isSkyMode ? '#4A2511' : '#F5E8C9',
                }}
              >
                +{overflowCount}
              </div>
            )}

            {/* Self otter — center, the only one that breathes */}
            <div
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-52 sm:h-52 rounded-full border-2 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center transition-all duration-1000 ${scaleClass}`}
              style={
                isSkyMode
                  ? { background: 'rgba(255,255,255,0.6)', borderColor: '#A4D3DE' }
                  : { background: 'rgba(30,34,38,0.6)', borderColor: '#5FA0AF' }
              }
            >
              <img
                src={otterBreathe}
                alt="You"
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-md"
              />
              <span
                className={`text-xs font-bold uppercase tracking-wide mt-1 ${
                  isSkyMode ? 'text-bluey-800' : 'text-bluey-200'
                }`}
              >
                {isActive ? currentPhase.name : 'You'}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 mt-10 relative z-10">
            <button
              onClick={toggleTimer}
              className="px-8 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center gap-2"
              style={
                isSkyMode
                  ? { background: '#A4D3DE', color: '#4A2511' }
                  : { background: 'linear-gradient(to right, #3E6B78, #5FA0AF)', color: '#F5FBFC' }
              }
            >
              {isActive ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 fill-current" />
              )}
              {isActive ? 'Pause' : 'Start Breathing'}
            </button>

            <p
              className={`text-xs font-medium text-center max-w-sm ${isSkyMode ? '' : 'text-slate-400'}`}
              style={isSkyMode ? { color: '#7A5A3A' } : undefined}
            >
              {mode.name} — the otters around you are just keeping you company, breathe at your own pace.
            </p>
          </div>
        </div>

        {/* Roster */}
        <div
          className="rounded-3xl border p-6 shadow-xl flex flex-col"
          style={
            isSkyMode
              ? { background: 'rgba(255,255,255,0.6)', borderColor: '#A4D3DE' }
              : { background: 'rgba(30,34,38,0.5)', borderColor: '#3E6B7888' }
          }
        >
          <div
            className={`flex items-center gap-2 text-sm font-bold mb-4 ${
              isSkyMode ? 'text-bluey-900' : 'text-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            Who's in the Cove
          </div>

          {participants.length === 0 ? (
            <p
              className={`text-xs font-medium ${isSkyMode ? 'text-bluey-600' : 'text-bluey-400'}`}
            >
              No one else is here yet. The cove is calm and quiet.
            </p>
          ) : (
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[460px] pr-1">
              {participants.map((p, idx) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full border-2 shadow-sm overflow-hidden shrink-0"
                    style={{
                      background: isSkyMode ? '#FAFBF0' : '#1E2226',
                      borderColor: isSkyMode ? '#E8E2D1' : '#3A3F45',
                    }}
                  >
                    <img
                      src={COMPANION_PORTRAITS[idx % COMPANION_PORTRAITS.length]}
                      alt={`${p.name} the otter`}
                      className="w-full h-full object-cover"
                      style={{ filter: `hue-rotate(${hueForId(p.id)}deg) saturate(1.3)` }}
                    />
                  </div>
                  <span
                    className={`text-sm font-semibold ${isSkyMode ? 'text-bluey-800' : 'text-bluey-200'}`}
                  >
                    {p.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Link to the full guided Breathing practice */}
          <button
            onClick={() => setActiveTab?.('breathing')}
            className="mt-auto pt-5 group text-left"
          >
            <div
              className="rounded-2xl border p-4 flex items-center gap-3 transition-all shadow-sm group-hover:shadow-md"
              style={
                isSkyMode
                  ? { background: '#FAFBF0', borderColor: '#E8E2D1' }
                  : { background: 'rgba(30,34,38,0.6)', borderColor: '#3A3F45' }
              }
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={
                  isSkyMode
                    ? { background: '#A4D3DE' }
                    : { background: 'linear-gradient(to right, #3E6B78, #5FA0AF)' }
                }
              >
                <Compass className={`w-5 h-5 ${isSkyMode ? 'text-bluey-900' : 'text-slate-100'}`} />
              </div>
              <div className="flex-1">
                <div
                  className={`text-xs font-bold ${isSkyMode ? 'text-bluey-900' : 'text-slate-100'}`}
                >
                  Want more techniques?
                </div>
                <div
                  className={`text-[11px] font-medium flex items-center gap-1 ${
                    isSkyMode ? 'text-bluey-600' : 'text-bluey-400'
                  }`}
                >
                  Open Breathing Practice
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
