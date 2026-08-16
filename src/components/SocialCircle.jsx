import React, { useState, useRef } from 'react';
import { Users, Plus, X, UserPlus, ChevronLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import estrellaSvg from '../assets/svg/estrellademar.svg';
import conchaSvg from '../assets/svg/concha.svg';
import algasSvg from '../assets/svg/algas.svg';

// Q1 — How often are you in touch? (stored value 1..5, scored by points)
const Q1_OPTIONS = [
  { value: 1, label: 'Almost every day', points: 4 },
  { value: 2, label: 'Every week or so', points: 3 },
  { value: 3, label: 'Every month or so', points: 2 },
  { value: 4, label: 'A few times a year', points: 1 },
  { value: 5, label: 'Rarely, but we pick right back up', points: 3 }
];

// Q2 — What do you usually talk about? (stored value 1..4)
const Q2_OPTIONS = [
  { value: 1, label: 'Personal stuff — they know what’s going on in my life', points: 4 },
  { value: 2, label: 'Catching up, jokes, general life', points: 3 },
  { value: 3, label: 'Mostly a shared thing — work, gym, kids, a hobby', points: 2 },
  { value: 4, label: 'Small talk', points: 1 }
];

// Q3 — Would you call them if something went really wrong? (stored value 1..4)
const Q3_OPTIONS = [
  { value: 1, label: 'Yes, without hesitation', points: 4 },
  { value: 2, label: 'Probably, if it was serious enough', points: 3 },
  { value: 3, label: 'Maybe, but I’d think twice', points: 2 },
  { value: 4, label: 'No, that’s not really us', points: 1 }
];

// Q4 — Do they know about the hard stuff going on in your life right now? (stored value 1..4)
const Q4_OPTIONS = [
  { value: 1, label: 'Yes, I’ve told them the real details', points: 4 },
  { value: 2, label: 'They know the headline, not the details', points: 3 },
  { value: 3, label: 'They know something’s up, not what', points: 2 },
  { value: 4, label: 'No, they wouldn’t know', points: 1 }
];

const QUESTIONS = [
  { key: 'q1', title: 'How often are you in touch?', options: Q1_OPTIONS },
  { key: 'q2', title: 'What do you usually talk about?', options: Q2_OPTIONS },
  { key: 'q3', title: 'Would you call them if something went really wrong?', options: Q3_OPTIONS },
  { key: 'q4', title: 'Do they know about the hard stuff going on in your life right now?', options: Q4_OPTIONS },
];

function deriveTier(q1Value, q2Value, q3Value, q4Value) {
  const q1 = Q1_OPTIONS.find(o => o.value === q1Value)?.points ?? 0;
  const q2 = Q2_OPTIONS.find(o => o.value === q2Value)?.points ?? 0;
  const q3 = Q3_OPTIONS.find(o => o.value === q3Value)?.points ?? 0;
  const q4 = Q4_OPTIONS.find(o => o.value === q4Value)?.points ?? 0;
  const total = q1 + q2 + q3 + q4;
  if (total >= 13) return 'close_friend';
  if (total >= 9) return 'friend';
  return 'acquaintance';
}

const TIERS = [
  { key: 'close_friend', label: 'Close Friends', hint: 'Your inner circle', radius: 110, innerRadius: 0, bandColor: 'stroke-dune-200/70', labelColor: 'fill-slate-500 dark:fill-slate-100', bubble: 'bg-dune-200 text-lagoon-950 border-dune-300' },
  { key: 'friend', label: 'Friends', hint: 'Warm and regular', radius: 170, innerRadius: 110, bandColor: 'stroke-cream-200/80', labelColor: 'fill-slate-500 dark:fill-slate-100', bubble: 'bg-cream-200 text-lagoon-950 border-cream-300' },
  { key: 'acquaintance', label: 'Acquaintances', hint: 'The outer ring', radius: 230, innerRadius: 170, bandColor: 'stroke-blush-200/80', labelColor: 'fill-slate-500 dark:fill-slate-100', bubble: 'bg-blush-200 text-lagoon-950 border-blush-300' }
];

const DIAGRAM_CENTER = 240;
const DIAGRAM_SIZE = 480;
const YOU_RADIUS = 55;
const BUBBLE_RADIUS = 16;
const LABEL_ARC_SPAN = 140;
const LABEL_GAP_DEG = LABEL_ARC_SPAN + 10;

function arcPath(cx, cy, r, startDeg, endDeg) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const start = { x: cx + r * Math.cos(toRad(startDeg)), y: cy + r * Math.sin(toRad(startDeg)) };
  const end = { x: cx + r * Math.cos(toRad(endDeg)), y: cy + r * Math.sin(toRad(endDeg)) };
  const largeArcFlag = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

const ANIMALS = ['🐙', '🦀', '🐬', '🐢', '🦭', '🐠', '🐡', '🦈', '🦞', '🦦'];

function getAnimal(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return ANIMALS[hash % ANIMALS.length];
}

function bubblePosition(tier, index, total) {
  const bandInner = tier.innerRadius === 0 ? YOU_RADIUS : tier.innerRadius;
  const bandOuter = tier.radius;
  const minR = bandInner + BUBBLE_RADIUS + 6;
  const maxR = bandOuter - BUBBLE_RADIUS - 6;

  const usableArc = 360 - LABEL_GAP_DEG;
  const startAngle = -90 + LABEL_GAP_DEG / 2;
  const angleDeg = total <= 1
    ? startAngle + usableArc / 2
    : startAngle + (usableArc / total) * index;
  const angleRad = (angleDeg * Math.PI) / 180;

  const jitter = ((index * 37) % 17) - 8;
  const radius = Math.min(maxR, Math.max(minR, (minR + maxR) / 2 + jitter));

  const cx = DIAGRAM_CENTER + radius * Math.cos(angleRad);
  const cy = DIAGRAM_CENTER + radius * Math.sin(angleRad);
  return { leftPct: (cx / DIAGRAM_SIZE) * 100, topPct: (cy / DIAGRAM_SIZE) * 100 };
}

function tierForDistance(distance) {
  if (distance <= YOU_RADIUS) return null;
  const sorted = [...TIERS].sort((a, b) => a.radius - b.radius);
  for (const tier of sorted) {
    if (distance <= tier.radius) return tier.key;
  }
  return sorted[sorted.length - 1].key;
}

function pointToDiagramSpace(clientX, clientY, containerEl) {
  const rect = containerEl.getBoundingClientRect();
  const scale = DIAGRAM_SIZE / rect.width;
  return {
    x: (clientX - rect.left) * scale,
    y: (clientY - rect.top) * scale
  };
}

const DRAG_THRESHOLD = 6;

function CircleDiagram({ friends, removeFriend, setFriendTier, isSkyMode }) {
  const [activeFriendId, setActiveFriendId] = useState(null);
  const [drag, setDrag] = useState(null);
  const containerRef = useRef(null);
  const suppressClickRef = useRef(false);

  const activeFriend = friends.find(f => f.id === activeFriendId) || null;

  let hoverTierKey = null;
  if (drag && drag.moved && containerRef.current) {
    const p = pointToDiagramSpace(drag.x, drag.y, containerRef.current);
    const dist = Math.hypot(p.x - DIAGRAM_CENTER, p.y - DIAGRAM_CENTER);
    hoverTierKey = tierForDistance(dist);
  }

  const handlePointerDown = (e, friend) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({
      friendId: friend.id,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      moved: false
    });
  };

  const handlePointerMove = (e) => {
    setDrag(prev => {
      if (!prev || e.pointerId !== prev.pointerId) return prev;
      const moved = prev.moved || Math.hypot(e.clientX - prev.startX, e.clientY - prev.startY) > DRAG_THRESHOLD;
      return { ...prev, x: e.clientX, y: e.clientY, moved };
    });
  };

  const handlePointerUp = (e, friend) => {
    if (!drag || e.pointerId !== drag.pointerId) { setDrag(null); return; }

    if (drag.moved && containerRef.current) {
      suppressClickRef.current = true;
      const p = pointToDiagramSpace(e.clientX, e.clientY, containerRef.current);
      const dist = Math.hypot(p.x - DIAGRAM_CENTER, p.y - DIAGRAM_CENTER);
      const newTier = tierForDistance(dist);
      if (newTier && newTier !== friend.tier) {
        setFriendTier(friend.id, newTier);
      }
    }
    setDrag(null);
  };

  const handleBubbleClick = (friend) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    setActiveFriendId(prev => prev === friend.id ? null : friend.id);
  };

  return (
    <div className="flex flex-col h-full relative z-10 w-full max-w-lg mx-auto">
      <div ref={containerRef} className="relative w-full aspect-square select-none">
        <svg
          viewBox={`0 0 ${DIAGRAM_SIZE} ${DIAGRAM_SIZE}`}
          role="img"
          aria-label="A concentric circle diagram: You at the center, surrounded by rings for Closed Friends, Friends, and Acquaintances."
          className="absolute inset-0 w-full h-full"
        >
          {/* Ambient ripples */}
          <circle
            cx={DIAGRAM_CENTER}
            cy={DIAGRAM_CENTER}
            r={YOU_RADIUS + 10}
            fill="none"
            className="stroke-lagoon-300/30 animate-ripple"
            strokeWidth="2"
            style={{ transformOrigin: `${DIAGRAM_CENTER}px ${DIAGRAM_CENTER}px` }}
          />
          <circle
            cx={DIAGRAM_CENTER}
            cy={DIAGRAM_CENTER}
            r={YOU_RADIUS + 10}
            fill="none"
            className="stroke-lagoon-300/20"
            strokeWidth="2"
            style={{ transformOrigin: `${DIAGRAM_CENTER}px ${DIAGRAM_CENTER}px`, animation: 'ripplePulse 3s cubic-bezier(0, 0.2, 0.8, 1) infinite 1.5s' }}
          />

          {[...TIERS].reverse().map(tier => {
            const bandInner = tier.innerRadius === 0 ? YOU_RADIUS : tier.innerRadius;
            const bandOuter = tier.radius;
            return (
              <circle
                key={tier.key}
                cx={DIAGRAM_CENTER}
                cy={DIAGRAM_CENTER}
                r={(bandInner + bandOuter) / 2}
                fill="none"
                className={tier.bandColor}
                strokeWidth={bandOuter - bandInner}
              />
            );
          })}

          <circle
            cx={DIAGRAM_CENTER}
            cy={DIAGRAM_CENTER}
            r={YOU_RADIUS}
            className={`fill-transparent border-2 ${isSkyMode ? 'stroke-lagoon-900' : 'stroke-lagoon-200'}`}
            strokeWidth="2"
          />

          {TIERS.map(tier => {
            const labelRadius = tier.radius - 22;
            const startDeg = -90 - LABEL_ARC_SPAN / 2;
            const endDeg = -90 + LABEL_ARC_SPAN / 2;
            return (
              <React.Fragment key={tier.key}>
                <path
                  id={`social-circle-arc-${tier.key}`}
                  d={arcPath(DIAGRAM_CENTER, DIAGRAM_CENTER, labelRadius, startDeg, endDeg)}
                  fill="none"
                />
                <text className={`${isSkyMode ? 'fill-lagoon-800' : 'fill-lagoon-200'} font-body font-bold uppercase tracking-wide text-[13px] opacity-80`}>
                  <textPath href={`#social-circle-arc-${tier.key}`} startOffset="50%" textAnchor="middle">
                    {tier.label}
                  </textPath>
                </text>
              </React.Fragment>
            );
          })}

          <text
            x={DIAGRAM_CENTER}
            y={DIAGRAM_CENTER + 7}
            textAnchor="middle"
            className={`${isSkyMode ? 'fill-lagoon-950' : 'fill-lagoon-50'} font-display font-normal text-xl`}
          >
            You
          </text>

          {/* Hover target highlight */}
          {hoverTierKey && (
            <circle
              cx={DIAGRAM_CENTER}
              cy={DIAGRAM_CENTER}
              r={TIERS.find(t => t.key === hoverTierKey).radius}
              fill="none"
              className="stroke-lagoon-500 opacity-50"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          )}
        </svg>

        {/* Orbiting otter */}
        <div className="absolute inset-0 animate-orbit-swim pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit-swim-reverse">
            <span className="block text-xl drop-shadow-sm animate-otter-float opacity-70">🦦</span>
          </div>
        </div>

        {/* Avatars */}
        {TIERS.map(tier => {
          const members = friends.filter(f => f.tier === tier.key);
          return members.map((f, i) => {
            const isDragging = drag?.friendId === f.id && drag.moved;
            const pos = isDragging
              ? (() => {
                const p = pointToDiagramSpace(drag.x, drag.y, containerRef.current);
                return { leftPct: (p.x / DIAGRAM_SIZE) * 100, topPct: (p.y / DIAGRAM_SIZE) * 100 };
              })()
              : bubblePosition(tier, i, members.length);
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => handleBubbleClick(f)}
                onPointerDown={(e) => handlePointerDown(e, f)}
                onPointerMove={handlePointerMove}
                onPointerUp={(e) => handlePointerUp(e, f)}
                onPointerCancel={() => setDrag(null)}
                aria-label={`${f.name}, ${tier.label}. Show details, or drag to move to another ring.`}
                style={{ left: `${pos.leftPct}%`, top: `${pos.topPct}%`, touchAction: 'none' }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 flex items-center justify-center text-base leading-none shadow-sm transition-transform ${isDragging ? 'scale-125 cursor-grabbing z-20' : 'cursor-grab hover:scale-110 focus-visible:scale-110'} ${tier.bubble}`}
              >
                <span aria-hidden="true">{getAnimal(f.id)}</span>
              </button>
            );
          });
        })}

        {/* Popover */}
        {activeFriend && (
          <div
            style={(() => {
              const tier = TIERS.find(t => t.key === activeFriend.tier);
              const members = friends.filter(f => f.tier === activeFriend.tier);
              const index = members.findIndex(f => f.id === activeFriend.id);
              const { leftPct, topPct } = bubblePosition(tier, index, members.length);
              return { left: `${leftPct}%`, top: `${topPct}%` };
            })()}
            className={`absolute z-30 -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-xl px-3 py-2.5 shadow-xl whitespace-nowrap border ${isSkyMode ? 'bg-white border-lagoon-200 text-lagoon-900' : 'bg-midnight-900 border-midnight-800 text-midnight-text'}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold">{activeFriend.name}</span>
              <button
                type="button"
                onClick={() => { removeFriend(activeFriend.id); setActiveFriendId(null); }}
                aria-label={`Remove ${activeFriend.name}`}
                className="opacity-50 hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className={`flex items-center gap-1.5 mt-2 pt-2 border-t ${isSkyMode ? 'border-lagoon-100' : 'border-lagoon-800'}`}>
              <span className="text-[10px] uppercase tracking-wide opacity-50 mr-0.5">Move to</span>
              {TIERS.map(tier => (
                <button
                  key={tier.key}
                  type="button"
                  disabled={tier.key === activeFriend.tier}
                  onClick={() => { setFriendTier(activeFriend.id, tier.key); setActiveFriendId(null); }}
                  aria-label={`Move to ${tier.label}`}
                  title={tier.label}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${tier.bubble} ${tier.key === activeFriend.tier ? 'opacity-30 cursor-default' : 'hover:scale-125 cursor-pointer'}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={`flex flex-wrap justify-center gap-4 mt-auto pt-6 border-t ${isSkyMode ? 'border-[#E5E5E5]' : 'border-midnight-800'}`}>
        {TIERS.map(tier => {
          const count = friends.filter(f => f.tier === tier.key).length;
          return (
            <div key={tier.key} className={`flex items-center gap-2 text-xs font-serif italic opacity-70`}>
              <span className={`w-2.5 h-2.5 rounded-full border ${tier.bubble}`} />
              <span className="font-semibold">{tier.label}</span>
              <span>· {count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SocialCircle() {
  const { friends, addFriend, removeFriend, setFriendTier, isSkyMode } = useWellness();

  // Wizard state:
  // 0: Start (Name)
  // 1-4: Q1-Q4
  // 5: Success
  const [step, setStep] = useState(0);
  
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState({ q1: null, q2: null, q3: null, q4: null });

  const resetForm = () => {
    setStep(0);
    setName('');
    setAnswers({ q1: null, q2: null, q3: null, q4: null });
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) setStep(1);
  };

  const handleOptionSelect = (qKey, val) => {
    setAnswers(prev => ({ ...prev, [qKey]: val }));
    setTimeout(() => {
      if (step < 4) {
        setStep(step + 1);
      } else {
        // Submit
        const tier = deriveTier(answers.q1 || 1, answers.q2 || 1, answers.q3 || 1, val);
        addFriend({
          name: name.trim(),
          contactFrequency: answers.q1 || 1,
          conversationDepth: answers.q2 || 1,
          emotionalReliability: answers.q3 || 1,
          vulnerabilityDepth: val,
          tier
        });
        setStep(5);
        setTimeout(() => resetForm(), 3000);
      }
    }, 300); // short delay for visual feedback
  };

  const currentQuestion = step >= 1 && step <= 4 ? QUESTIONS[step - 1] : null;

  return (
    <section aria-label="Social Circle" className="relative w-full max-w-[1200px] mx-auto pb-16 px-4 sm:px-6">
      
      {/* Background blurs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className={`absolute top-0 left-1/4 w-[40vw] h-[40vw] rounded-full blur-[100px] mix-blend-multiply opacity-30 ${isSkyMode ? 'bg-sand-200' : 'bg-lagoon-900'}`} />
        <div className={`absolute bottom-0 right-1/4 w-[30vw] h-[30vw] rounded-full blur-[80px] mix-blend-multiply opacity-20 ${isSkyMode ? 'bg-lagoon-100' : 'bg-otterfur-900'}`} />
      </div>

      <div className="flex flex-col lg:flex-row gap-0 w-full perspective-[2000px]">
        
        {/* LEFT PAGE (Wizard Form) */}
        <div className={`flex-1 lg:w-1/2 rounded-t-[1.5rem] lg:rounded-tr-none lg:rounded-l-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 ease-in-out border lg:border-r-0 lg:origin-right animate-book-page-left relative overflow-hidden
          ${isSkyMode
            ? 'bg-[#FDFDFD] border-[#E5E5E5] text-lagoon-950'
            : 'bg-midnight-900 border-midnight-800 text-midnight-text'}`}
        >
          {/* Decorative SVGs */}
          <div className="absolute top-0 left-0 opacity-15 pointer-events-none w-24 sm:w-32 -translate-x-4 -translate-y-4">
            <img src={conchaSvg} alt="" className="w-full h-auto transform -rotate-12" aria-hidden="true" />
          </div>
          <div className="absolute bottom-0 right-0 opacity-[0.15] pointer-events-none w-48 sm:w-64 translate-x-4 translate-y-4">
            <img src={algasSvg} alt="" className="w-full h-auto" aria-hidden="true" />
          </div>

          <div className="p-8 sm:p-12 h-full flex flex-col justify-center relative min-h-[70vh] z-10">
            
            {step === 0 && (
              <div className="space-y-8 max-w-sm w-full mx-auto animate-fade-in">
                <div className="space-y-4">
                  <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tight leading-tight">
                    Social <br className="hidden sm:block" />
                    <span className="italic opacity-60">Circle</span>
                  </h2>
                  <p className="font-serif italic opacity-70 leading-relaxed text-sm">
                    Reflect on your relationships. Add someone to your circle to visualize your support system.
                  </p>
                </div>

                <form onSubmit={handleNameSubmit} className="space-y-4 pt-6">
                  <label htmlFor="friendName" className="block font-display text-xl mb-2">
                    Who would you like to add?
                  </label>
                  <input
                    id="friendName"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Their name..."
                    className={`w-full py-2 bg-transparent text-lg font-serif italic transition-all duration-300 focus:outline-none border-b focus:border-current opacity-80 focus:opacity-100 ${
                      isSkyMode
                        ? 'border-[#E5E5E5] placeholder-lagoon-400'
                        : 'border-midnight-800 placeholder-midnight-muted'
                    }`}
                    autoFocus
                  />
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={!name.trim()}
                      className={`flex items-center gap-2 font-display text-lg px-4 py-2 rounded-full border transition-all ${
                        !name.trim() 
                          ? 'opacity-30 cursor-not-allowed border-transparent'
                          : isSkyMode ? 'border-lagoon-900 hover:bg-lagoon-50' : 'border-lagoon-200 hover:bg-white/5'
                      }`}
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step >= 1 && step <= 4 && currentQuestion && (
              <div key={step} className="space-y-8 max-w-sm w-full mx-auto animate-fade-in">
                
                <div className="flex items-center gap-4 text-xs font-serif uppercase tracking-widest opacity-50 mb-6">
                  <button onClick={() => setStep(step - 1)} className="hover:opacity-100 transition-opacity p-1">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span>Question {step} of 4</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl leading-snug">
                  {currentQuestion.title}
                </h3>
                <p className="font-serif italic opacity-60 text-sm">
                  About <span className="font-bold">{name}</span>
                </p>

                <div className="space-y-3 pt-4">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = answers[currentQuestion.key] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleOptionSelect(currentQuestion.key, opt.value)}
                        className={`w-full text-left py-3 px-4 rounded-xl border transition-all duration-300 font-serif italic ${
                          isSelected
                            ? (isSkyMode ? 'border-lagoon-900 bg-lagoon-50 text-lagoon-950 font-bold' : 'border-lagoon-200 bg-white/10 text-white font-bold')
                            : (isSkyMode ? 'border-transparent hover:border-[#E5E5E5] text-lagoon-800' : 'border-transparent hover:border-midnight-800 text-midnight-text')
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="text-center space-y-6 animate-fade-in max-w-sm mx-auto">
                <CheckCircle2 className="w-16 h-16 mx-auto opacity-50" strokeWidth={1} />
                <h3 className="font-display text-3xl font-normal tracking-tight">
                  Added to Circle
                </h3>
                <p className="font-serif italic opacity-70 text-sm">
                  {name} has been placed in your social circle.
                </p>
              </div>
            )}
            
          </div>
        </div>

        {/* RIGHT PAGE (Diagram) */}
        <div className={`flex-1 lg:w-1/2 rounded-b-[1.5rem] lg:rounded-bl-none lg:rounded-r-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 ease-in-out border lg:border-l-0 lg:origin-left animate-book-page-right relative overflow-hidden
          ${isSkyMode
            ? 'bg-[#FAFAFA] border-[#E5E5E5] text-lagoon-950'
            : 'bg-midnight-950 border-midnight-800 text-midnight-text'}`}
        >
          {/* Decorative SVGs */}
          <div className="absolute top-0 right-0 opacity-15 pointer-events-none w-32 -translate-y-4 translate-x-4">
            <img src={estrellaSvg} alt="" className="w-full h-auto transform rotate-12" aria-hidden="true" />
          </div>

          <div className="p-8 sm:p-12 h-full flex flex-col relative min-h-[70vh] z-10">
             <CircleDiagram friends={friends} removeFriend={removeFriend} setFriendTier={setFriendTier} isSkyMode={isSkyMode} />
          </div>
        </div>

      </div>
    </section>
  );
}
