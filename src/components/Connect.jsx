import React, { useMemo } from 'react';
import { Play, Pause, Waves, Users, Compass, ArrowRight } from 'lucide-react';
import { useBreathingTimer } from '../hooks/useBreathingTimer';
import { useBreathingPresence } from '../hooks/useBreathingPresence';
import { useWellness } from '../context/WellnessContext';
import nutriameditacionSvg from '../assets/svg/nutriameditacionprofunda.svg';
import nutriaalegriaSvg from '../assets/svg/nutriaalegria.svg';
import nutriacompasionSvg from '../assets/svg/nutriacompasion.svg';
import nutriaconcentracionSvg from '../assets/svg/nutriaconcentracion.svg';
import nutriaconsueloSvg from '../assets/svg/nutriaconsuelo.svg';
import nutriaentusiasmoSvg from '../assets/svg/nutriaentusiasmo.svg';
import estrellaSvg from '../assets/svg/estrellademar.svg';
import algasSvg from '../assets/svg/algas.svg';
import conchaSvg from '../assets/svg/concha.svg';

const COMPANION_PORTRAITS = [nutriaalegriaSvg, nutriacompasionSvg, nutriaconcentracionSvg, nutriaconsueloSvg, nutriaentusiasmoSvg];
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
  const { modeKey, mode, isActive, currentPhase, secondsRemaining, toggleTimer } = useBreathingTimer('ocean');

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
        ? 'scale-95'
        : 'scale-100';

  const getCenterOtterSvg = () => {
    if (!isActive) return nutriameditacionSvg;
    if (currentPhase.name === 'Inhale') return nutriaentusiasmoSvg;
    if (currentPhase.name === 'Exhale') return nutriameditacionSvg;
    return nutriaconcentracionSvg; // Hold
  };

  return (
    <div className="w-full space-y-8 pb-10 px-2 sm:px-0">
      {/* Title */}
      <div className="text-center space-y-4 pt-4 pb-2">
        <h2 className={`font-display text-4xl sm:text-5xl font-normal tracking-tight leading-tight flex flex-col items-center justify-center ${isSkyMode ? 'text-lagoon-950' : 'text-lagoon-50'}`}>
          <div className="flex items-center gap-3">
             <Waves className="w-8 h-8 sm:w-9 sm:h-9 opacity-50" />
             Shared <br className="hidden sm:block" />
          </div>
          <span className="italic opacity-60">Space</span>
        </h2>

        <p className={`text-sm sm:text-base max-w-sm mx-auto font-serif italic opacity-70 leading-relaxed ${isSkyMode ? 'text-lagoon-900' : 'text-lagoon-100'}`}>
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
          className={`lg:col-span-2 rounded-3xl p-8 sm:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden min-h-[420px] sm:min-h-[560px] flex flex-col items-center justify-center ${
            isSkyMode ? 'bg-[#FAFAFA] text-lagoon-950' : 'bg-midnight-950 text-midnight-text'
          }`}
        >
          {/* Decorative SVGs */}
          <div className="absolute top-0 left-0 opacity-15 pointer-events-none w-24 sm:w-32 -translate-x-4 -translate-y-4">
            <img src={estrellaSvg} alt="" className="w-full h-auto transform -rotate-12" aria-hidden="true" />
          </div>
          <div className="absolute bottom-0 right-0 opacity-[0.15] pointer-events-none w-48 sm:w-64 translate-x-4 translate-y-4">
            <img src={algasSvg} alt="" className="w-full h-auto" aria-hidden="true" />
          </div>
          
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
                background: isSkyMode ? 'rgba(200,190,180,0.1)' : 'rgba(200,200,200,0.05)',
              }}
            />
          ))}

          {/* Rising & falling ocean waves along the floor of the cove */}
          <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 overflow-hidden pointer-events-none rounded-b-3xl">
            <svg
              className="absolute bottom-0 left-0 w-[200%] h-full animate-wave-slide"
              viewBox="0 0 2880 320"
              preserveAspectRatio="none"
            >
              <path
                fill={isSkyMode ? '#E5E5E5' : '#1D2636'}
                fillOpacity="0.4"
                d="M0,192L60,197.3C120,203,240,213,360,197.3C480,181,600,139,720,144C840,149,960,203,1080,213.3C1200,224,1320,192,1440,176C1560,160,1680,160,1800,176C1920,192,2040,224,2160,213.3C2280,203,2400,149,2520,144C2640,139,2760,181,2820,202.7L2880,224L2880,320L0,320Z"
              />
              <path
                fill={isSkyMode ? '#E5E5E5' : '#1D2636'}
                fillOpacity="0.4"
                d="M0,192L60,197.3C120,203,240,213,360,197.3C480,181,600,139,720,144C840,149,960,203,1080,213.3C1200,224,1320,192,1440,176C1560,160,1680,160,1800,176C1920,192,2040,224,2160,213.3C2280,203,2400,149,2520,144C2640,139,2760,181,2820,202.7L2880,224L2880,320L0,320Z"
                transform="translate(1440, 0)"
              />
            </svg>
            <svg
              className="absolute bottom-0 left-0 w-[200%] h-full animate-wave-slide opacity-70"
              style={{ animationDuration: '16s', animationDirection: 'reverse' }}
              viewBox="0 0 2880 320"
              preserveAspectRatio="none"
            >
              <path
                fill={isSkyMode ? '#D1D5DB' : '#374151'}
                fillOpacity="0.25"
                d="M0,256L48,240C96,224,192,192,288,197.3C384,203,480,245,576,250.7C672,256,768,224,864,213.3C960,203,1056,213,1152,224C1248,235,1344,245,1440,240C1536,235,1632,213,1728,213.3C1824,213,1920,235,2016,240C2112,245,2208,235,2304,213.3C2400,192,2496,160,2592,160C2688,160,2784,192,2832,208L2880,224L2880,320L0,320Z"
              />
              <path
                fill={isSkyMode ? '#D1D5DB' : '#374151'}
                fillOpacity="0.25"
                d="M0,256L48,240C96,224,192,192,288,197.3C384,203,480,245,576,250.7C672,256,768,224,864,213.3C960,203,1056,213,1152,224C1248,235,1344,245,1440,240C1536,235,1632,213,1728,213.3C1824,213,1920,235,2016,240C2112,245,2208,235,2304,213.3C2400,192,2496,160,2592,160C2688,160,2784,192,2832,208L2880,224L2880,320L0,320Z"
                transform="translate(1440, 0)"
              />
            </svg>
          </div>

          <div className="relative w-80 h-80 sm:w-[28rem] sm:h-[28rem] lg:w-[32rem] lg:h-[32rem]">
            {/* Companion otters — static, no breathing animation, just present */}
            {visibleParticipants.map((p, idx) => (
              <div
                key={p.id}
                className="absolute w-12 h-12 sm:w-14 sm:h-14 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg overflow-hidden flex items-center justify-center animate-fade-in"
                style={{
                  left: ringPositions[idx].left,
                  top: ringPositions[idx].top,
                  background: isSkyMode ? 'rgba(255,255,255,0.8)' : 'rgba(18,24,34,0.8)',
                }}
                title={p.name}
              >
                <img
                  src={COMPANION_PORTRAITS[idx % COMPANION_PORTRAITS.length]}
                  alt={`${p.name}`}
                  className="w-full h-full object-contain p-1"
                  style={{ filter: `hue-rotate(${hueForId(p.id)}deg)` }}
                />
              </div>
            ))}

            {overflowCount > 0 && (
              <div
                className="absolute w-12 h-12 sm:w-14 sm:h-14 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg flex items-center justify-center text-xs font-serif italic"
                style={{
                  left: '50%',
                  top: '2%',
                  background: isSkyMode ? '#FAFAFA' : '#080C11',
                  color: isSkyMode ? '#080C11' : '#FAFAFA',
                }}
              >
                +{overflowCount}
              </div>
            )}

            {/* Self otter — center, the only one that breathes */}
            <div
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-36 sm:h-36 rounded-full shadow-2xl backdrop-blur-md flex flex-col items-center justify-center transition-all duration-1000 ${scaleClass}`}
              style={
                isSkyMode
                  ? { background: 'rgba(255,255,255,0.7)' }
                  : { background: 'rgba(18,24,34,0.7)' }
              }
            >
              <img
                src={getCenterOtterSvg()}
                alt="You"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md transition-opacity duration-300"
              />
              <div
                className={`text-xs font-serif italic flex flex-col items-center gap-1 opacity-80 ${
                  isSkyMode ? 'text-lagoon-900' : 'text-lagoon-100'
                }`}
              >
                <span>{isActive ? currentPhase.name : 'You'}</span>
                {isActive && (
                  <span className="font-display text-lg font-normal not-italic">{secondsRemaining}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center w-full max-w-md gap-3 mt-10 relative z-10">
            <button
              onClick={toggleTimer}
              className={`w-full max-w-[280px] py-3 border-b-2 font-display text-lg transition-all duration-500 focus-visible:outline-none flex justify-center items-center gap-2 ${
                isSkyMode
                  ? 'border-lagoon-900 hover:border-lagoon-600 hover:text-lagoon-700 text-lagoon-950'
                  : 'border-lagoon-200 hover:border-lagoon-400 hover:text-lagoon-300 text-lagoon-50'
              }`}
            >
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              {isActive ? 'Pause' : 'Start Breathing'}
            </button>

            <p
              className={`text-xs font-serif italic text-center max-w-sm opacity-70 mt-2 ${isSkyMode ? 'text-lagoon-900' : 'text-lagoon-100'}`}
            >
              {mode.name} — the otters around you are just keeping you company, breathe at your own pace.
            </p>
          </div>
        </div>

        {/* Roster */}
        <div
          className={`rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col relative overflow-hidden ${
            isSkyMode
              ? 'bg-[#FDFDFD] text-lagoon-950'
              : 'bg-midnight-900 text-midnight-text'
          }`}
        >
          {/* Decorative SVG */}
          <div className="absolute top-0 right-0 opacity-[0.15] pointer-events-none w-32 translate-x-4 -translate-y-4">
            <img src={conchaSvg} alt="" className="w-full h-auto transform rotate-12" aria-hidden="true" />
          </div>

          <div className="relative z-10 flex-1 flex flex-col">
            <legend
              className={`font-display text-xl mb-4 ${
                isSkyMode ? 'text-lagoon-950' : 'text-midnight-text'
              }`}
            >
              Who's in the Cove
            </legend>

            {participants.length === 0 ? (
              <p
                className={`text-sm font-serif italic opacity-70 ${isSkyMode ? 'text-lagoon-900' : 'text-lagoon-100'}`}
              >
              No one else is here yet. The cove is calm and quiet.
            </p>
          ) : (
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[460px] pr-2">
                {participants.map((p, idx) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full shadow-sm overflow-hidden shrink-0 flex items-center justify-center"
                      style={{
                        background: isSkyMode ? 'rgba(255,255,255,0.8)' : 'rgba(18,24,34,0.8)'
                      }}
                    >
                      <img
                        src={COMPANION_PORTRAITS[idx % COMPANION_PORTRAITS.length]}
                        alt=""
                        className="w-full h-full object-contain p-1"
                        style={{ filter: `hue-rotate(${hueForId(p.id)}deg)` }}
                      />
                    </div>
                    <span
                      className={`text-sm font-serif italic opacity-90 ${isSkyMode ? 'text-lagoon-900' : 'text-lagoon-100'}`}
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
              className="mt-auto pt-8 group text-left w-full"
            >
              <div
                className="rounded-2xl p-5 flex items-center gap-4 transition-all shadow-sm group-hover:shadow-md border border-transparent"
                style={
                  isSkyMode
                    ? { background: '#FAFAFA' }
                    : { background: '#080C11' }
                }
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 opacity-80"
                  style={
                    isSkyMode
                      ? { background: '#E5E5E5' }
                      : { background: '#1D2636' }
                  }
                >
                  <Compass className={`w-5 h-5 ${isSkyMode ? 'text-lagoon-950' : 'text-lagoon-50'}`} />
                </div>
                <div className="flex-1">
                  <div
                    className={`text-sm font-display tracking-wide ${isSkyMode ? 'text-lagoon-950' : 'text-midnight-text'}`}
                  >
                  Want more techniques?
                </div>
                  <div
                    className={`text-xs font-serif italic mt-1 flex items-center gap-1 opacity-70 ${
                      isSkyMode ? 'text-lagoon-900' : 'text-lagoon-100'
                    }`}
                  >
                    Open Breathing Practice
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
