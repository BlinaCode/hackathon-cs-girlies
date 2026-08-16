import React, { useState, useRef } from 'react';
import { Users, Plus, X, UserPlus } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import nutriaCompasion from '../assets/svg/nutriacompasion.svg';
import otterCheckin from '../assets/images/otter-checkin.png';

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

// Derive the tier from the four answers. Sum points (4..16).
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
  { key: 'close_friend', label: 'Close Friends', hint: 'Your inner circle', radius: 110, innerRadius: 0, bandColor: 'stroke-lagoon-500/60', labelColor: 'fill-lagoon-50', bubble: 'bg-lagoon-500 text-white border-lagoon-300' },
  { key: 'friend', label: 'Friends', hint: 'Warm and regular', radius: 170, innerRadius: 110, bandColor: 'stroke-dune-300/80', labelColor: 'fill-lagoon-950', bubble: 'bg-dune-300 text-lagoon-950 border-dune-100' },
  { key: 'acquaintance', label: 'Acquaintances', hint: 'The outer ring', radius: 230, innerRadius: 170, bandColor: 'stroke-blush-300/80', labelColor: 'fill-lagoon-950', bubble: 'bg-blush-300 text-lagoon-950 border-blush-200' }
];

const DIAGRAM_CENTER = 240;
const DIAGRAM_SIZE = 480;
const YOU_RADIUS = 55;
const BUBBLE_RADIUS = 16; // px, in the 480 viewBox coordinate space
const LABEL_ARC_SPAN = 140; // degrees the curved ring label sweeps, centered on top
const LABEL_GAP_DEG = LABEL_ARC_SPAN + 10; // bubble-exclusion arc, a touch wider than the label itself

// An SVG arc `d` string for a circle of radius r centered at (cx, cy), running
// clockwise from startDeg to endDeg (0deg = right/east, -90deg = top, matches
// the y-down convention used everywhere else in this file).
function arcPath(cx, cy, r, startDeg, endDeg) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const start = { x: cx + r * Math.cos(toRad(startDeg)), y: cy + r * Math.sin(toRad(startDeg)) };
  const end = { x: cx + r * Math.cos(toRad(endDeg)), y: cy + r * Math.sin(toRad(endDeg)) };
  const largeArcFlag = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

// A little sea-creature variety for each bubble, picked deterministically per
// friend (stable across re-renders/sessions) rather than by ring — so two
// people in the same ring still look distinct and a little playful.
const ANIMALS = ['🐙', '🦀', '🐬', '🐢', '🦭', '🐠', '🐡', '🦈', '🦞', '🦦'];

function getAnimal(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return ANIMALS[hash % ANIMALS.length];
}

// Evenly spaces members around their ring's band (skipping the arc where the
// label sits), with a small deterministic radius jitter per index so bubbles
// don't all land on one perfect circle. Deterministic = stable across
// re-renders, unlike Math.random().
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

// Which tier's band a point (in the 480-unit diagram space) falls in, measured
// from the diagram center. Points inside the "You" circle match nothing —
// dropping on yourself is a no-op. Points beyond the outermost ring still
// count as Acquaintances, so an imprecise drop still lands somewhere sensible.
function tierForDistance(distance) {
  if (distance <= YOU_RADIUS) return null;
  const sorted = [...TIERS].sort((a, b) => a.radius - b.radius);
  for (const tier of sorted) {
    if (distance <= tier.radius) return tier.key;
  }
  return sorted[sorted.length - 1].key;
}

// Converts a pointer event's client coordinates into the diagram's 480-unit
// coordinate space, using the container's actual rendered size (so it stays
// correct at any responsive scale).
function pointToDiagramSpace(clientX, clientY, containerEl) {
  const rect = containerEl.getBoundingClientRect();
  const scale = DIAGRAM_SIZE / rect.width;
  return {
    x: (clientX - rect.left) * scale,
    y: (clientY - rect.top) * scale
  };
}

const DRAG_THRESHOLD = 6; // px of pointer movement before a press counts as a drag, not a click

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

// The nested-ring visual. Rings are drawn in SVG; individual members are
// overlaid as HTML avatar-bubble buttons positioned by percentage, so both
// layers scale together responsively without pixel-syncing.
//
// Moving someone between rings works two ways, kept in sync on purpose:
// 1. Drag a bubble and drop it in a different ring (pointer/touch users).
// 2. Open a bubble's popover and use the "Move to" swatches (keyboard and
//    screen-reader users, or anyone who'd rather tap than drag).
function CircleDiagram({ friends, removeFriend, setFriendTier, isSkyMode }) {
  const [activeFriendId, setActiveFriendId] = useState(null);
  const [drag, setDrag] = useState(null); // { friendId, pointerId, startX, startY, x, y, moved }
  const containerRef = useRef(null);
  const suppressClickRef = useRef(false);

  const activeFriend = friends.find(f => f.id === activeFriendId) || null;

  // Which ring the dragged bubble is currently hovering over, for the
  // drop-target highlight. Recomputed each render from drag state — cheap
  // enough at this scale, no need for its own state slice.
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
    <div className={`relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl transition-all border
      ${isSkyMode
        ? 'bg-gradient-to-br from-white via-lagoon-50 to-blush-100 border-white/60'
        : 'bg-gradient-to-br from-lagoon-950 via-lagoon-900 to-[#1a2f38] border-lagoon-800'}`}
    >
      <SeaweedFlourish className="hidden sm:block absolute -bottom-2 left-4 w-8 h-14 opacity-70" />
      <ShellFlourish className="hidden sm:block absolute bottom-4 right-6 w-10 h-8 opacity-70" />

      <div ref={containerRef} className="relative w-full max-w-md mx-auto aspect-square select-none">
        <svg
          viewBox={`0 0 ${DIAGRAM_SIZE} ${DIAGRAM_SIZE}`}
          role="img"
          aria-label="A concentric circle diagram: You at the center, surrounded by rings for Closed Friends, Friends, and Acquaintances, from innermost to outermost."
          className="absolute inset-0 w-full h-full"
        >
          {/* Soft ambient ripples, purely decorative — a slow "calm water" pulse
              behind the rings. */}
          <circle
            cx={DIAGRAM_CENTER}
            cy={DIAGRAM_CENTER}
            r={YOU_RADIUS + 10}
            fill="none"
            className="stroke-lagoon-400/50 animate-ripple"
            strokeWidth="2"
            style={{ transformOrigin: `${DIAGRAM_CENTER}px ${DIAGRAM_CENTER}px` }}
          />
          <circle
            cx={DIAGRAM_CENTER}
            cy={DIAGRAM_CENTER}
            r={YOU_RADIUS + 10}
            fill="none"
            className="stroke-lagoon-400/40"
            strokeWidth="2"
            style={{ transformOrigin: `${DIAGRAM_CENTER}px ${DIAGRAM_CENTER}px`, animation: 'ripplePulse 3s cubic-bezier(0, 0.2, 0.8, 1) infinite 1.5s' }}
          />

          {/* Each ring is drawn as an annulus (a wide stroke, not a filled disc) so
              its color doesn't blend with the rings inside it. */}
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
            className={isSkyMode ? 'fill-white stroke-lagoon-400/80' : 'fill-lagoon-950 stroke-lagoon-500/60'}
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
                <text className={`${tier.labelColor} font-body font-bold uppercase tracking-wide text-[13px]`}>
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
            className={`font-display font-bold text-xl ${isSkyMode ? 'fill-lagoon-600' : 'fill-lagoon-300'}`}
          >
            YOU
          </text>

          {/* Drop-target highlight while a bubble is being dragged over a ring */}
          {hoverTierKey && (
            <circle
              cx={DIAGRAM_CENTER}
              cy={DIAGRAM_CENTER}
              r={TIERS.find(t => t.key === hoverTierKey).radius}
              fill="none"
              className={isSkyMode ? 'stroke-lagoon-800' : 'stroke-lagoon-100'}
              strokeWidth="3"
              strokeDasharray="6 4"
            />
          )}
        </svg>

        {/* Sisu the Otter, slowly swimming a lap around the circle — purely
            decorative. Counter-rotating inner wrapper keeps the otter itself
            upright while the outer wrapper sweeps it around. */}
        <div className="absolute inset-0 animate-orbit-swim pointer-events-none hover:[animation-play-state:paused]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit-swim-reverse hover:[animation-play-state:paused]">
            <img
              src={otterCheckin}
              alt="Sisu the otter"
              title="You're safe here 🌊"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-lg animate-otter-float pointer-events-auto cursor-help hover:[animation-play-state:paused]"
            />
          </div>
        </div>

        {/* Avatar bubbles, one per member, overlaid on their ring */}
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
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 flex items-center justify-center text-base leading-none shadow-lg transition-transform ${isDragging ? 'scale-125 cursor-grabbing z-20' : 'cursor-grab hover:scale-110 focus-visible:scale-110 focus-visible:ring-2 focus-visible:ring-lagoon-300'} ${tier.bubble}`}
              >
                <span aria-hidden="true">{getAnimal(f.id)}</span>
              </button>
            );
          });
        })}

        {/* Name + remove + "Move to" popover for the selected bubble */}
        {activeFriend && (
          <div
            style={(() => {
              const tier = TIERS.find(t => t.key === activeFriend.tier);
              const members = friends.filter(f => f.tier === activeFriend.tier);
              const index = members.findIndex(f => f.id === activeFriend.id);
              const { leftPct, topPct } = bubblePosition(tier, index, members.length);
              return { left: `${leftPct}%`, top: `${topPct}%` };
            })()}
            className="absolute z-30 -translate-x-1/2 -translate-y-[calc(100%+14px)] bg-lagoon-950 border border-lagoon-700 rounded-xl px-3 py-2.5 shadow-2xl whitespace-nowrap"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-lagoon-50">{activeFriend.name}</span>
              <button
                type="button"
                onClick={() => { removeFriend(activeFriend.id); setActiveFriendId(null); }}
                aria-label={`Remove ${activeFriend.name}`}
                className="text-lagoon-400 hover:text-blush-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-lagoon-700/60">
              <span className="text-[10px] uppercase tracking-wide text-lagoon-500 mr-0.5">Move to</span>
              {TIERS.map(tier => (
                <button
                  key={tier.key}
                  type="button"
                  disabled={tier.key === activeFriend.tier}
                  onClick={() => { setFriendTier(activeFriend.id, tier.key); setActiveFriendId(null); }}
                  aria-label={`Move ${activeFriend.name} to ${tier.label}`}
                  title={tier.label}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${tier.bubble} ${tier.key === activeFriend.tier ? 'opacity-40 cursor-default' : 'hover:scale-125 cursor-pointer'}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Compact legend — counts only, names live on the bubbles above */}
      <div className={`flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t ${isSkyMode ? 'border-lagoon-200/60' : 'border-lagoon-700/60'}`}>
        {TIERS.map(tier => {
          const count = friends.filter(f => f.tier === tier.key).length;
          return (
            <div key={tier.key} className={`flex items-center gap-2 text-xs ${isSkyMode ? 'text-lagoon-700' : 'text-lagoon-400'}`}>
              <span className={`w-2.5 h-2.5 rounded-full border ${tier.bubble}`} />
              <span className={`font-semibold ${isSkyMode ? 'text-lagoon-950' : 'text-lagoon-100'}`}>{tier.label}</span>
              <span>· {tier.hint} · {count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SocialCircle() {
  const { friends, addFriend, removeFriend, setFriendTier, isSkyMode } = useWellness();

  const [name, setName] = useState('');
  const [q1, setQ1] = useState(1);
  const [q2, setQ2] = useState(1);
  const [q3, setQ3] = useState(1);
  const [q4, setQ4] = useState(1);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const tier = deriveTier(q1, q2, q3, q4);
    addFriend({
      name: name.trim(),
      contactFrequency: q1,
      conversationDepth: q2,
      emotionalReliability: q3,
      vulnerabilityDepth: q4,
      tier
    });
    setName('');
    setQ1(1);
    setQ2(1);
    setQ3(1);
    setQ4(1);
  };

  const fieldClass = `w-full px-4 py-3 rounded-2xl border text-sm font-medium focus:ring-2 transition-colors ${
    isSkyMode
      ? 'bg-white/70 border-lagoon-200 text-lagoon-950 placeholder-lagoon-400 focus:border-lagoon-400 focus:ring-lagoon-200'
      : 'bg-lagoon-950/50 border-lagoon-700 text-lagoon-50 placeholder-lagoon-500 focus:border-lagoon-500 focus:ring-lagoon-800'
  }`;

  return (
    <div className="relative max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-10">

      {/* Ambient watercolor blobs, purely decorative */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-6 h-64 overflow-hidden -z-10">
        <div className={`absolute left-0 top-0 w-72 h-72 rounded-full blur-3xl ${isSkyMode ? 'bg-lagoon-200/50' : 'bg-lagoon-700/20'}`} />
        <div className={`absolute right-0 top-6 w-80 h-80 rounded-full blur-3xl ${isSkyMode ? 'bg-blush-200/50' : 'bg-otterfur-500/10'}`} />
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <img src={nutriaCompasion} alt="Otter showing compassion" className="w-24 h-24 object-contain drop-shadow-lg" />
        </div>
        <h2 className={`font-display text-3xl font-bold flex items-center justify-center gap-2 ${isSkyMode ? 'text-lagoon-950' : 'text-white'}`}>
          <Users className={`w-7 h-7 ${isSkyMode ? 'text-lagoon-500' : 'text-lagoon-400'}`} />
          Social Circle
        </h2>
        <p className={`text-xs sm:text-sm max-w-xl mx-auto font-semibold ${isSkyMode ? 'text-lagoon-700' : 'text-lagoon-300'}`}>
          Answer a few gentle questions about each person, and we’ll place them in your circle. Not quite right? Drag anyone to a different ring, or tap them for more options — no labels to assign yourself.
        </p>
      </div>

      {/* Add-friend form */}
      <div className={`relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-6 transition-all border
        ${isSkyMode
          ? 'bg-gradient-to-br from-white via-lagoon-50 to-blush-100 border-white/60'
          : 'bg-gradient-to-br from-lagoon-950 via-lagoon-900 to-[#1a2f38] border-lagoon-800'}`}
      >
        <SeaweedFlourish className="hidden sm:block absolute -bottom-2 left-4 w-8 h-14 opacity-70" />
        <ShellFlourish className="hidden sm:block absolute bottom-4 right-6 w-10 h-8 opacity-70" />

        <h3 className={`relative font-display text-xl font-bold flex items-center gap-2 ${isSkyMode ? 'text-lagoon-950' : 'text-white'}`}>
          <UserPlus className={`w-5 h-5 ${isSkyMode ? 'text-lagoon-500' : 'text-lagoon-400'}`} />
          Add someone to your circle
        </h3>

        <form onSubmit={handleAdd} className="relative space-y-5">
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isSkyMode ? 'text-lagoon-800' : 'text-lagoon-300'}`}>
              Their name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Alex"
              className={fieldClass}
              required
            />
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isSkyMode ? 'text-lagoon-800' : 'text-lagoon-300'}`}>
              How often are you in touch?
            </label>
            <select
              value={q1}
              onChange={e => setQ1(Number(e.target.value))}
              className={fieldClass}
            >
              {Q1_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isSkyMode ? 'text-lagoon-800' : 'text-lagoon-300'}`}>
              What do you usually talk about?
            </label>
            <select
              value={q2}
              onChange={e => setQ2(Number(e.target.value))}
              className={fieldClass}
            >
              {Q2_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isSkyMode ? 'text-lagoon-800' : 'text-lagoon-300'}`}>
              Would you call them if something went really wrong?
            </label>
            <select
              value={q3}
              onChange={e => setQ3(Number(e.target.value))}
              className={fieldClass}
            >
              {Q3_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isSkyMode ? 'text-lagoon-800' : 'text-lagoon-300'}`}>
              Do they know about the hard stuff going on in your life right now?
            </label>
            <select
              value={q4}
              onChange={e => setQ4(Number(e.target.value))}
              className={fieldClass}
            >
              {Q4_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className={`w-full py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl font-bold text-sm tracking-wide transition-all duration-300 shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] hover:-translate-y-0.5 ${
              isSkyMode
                ? 'bg-gradient-to-r from-lagoon-500 to-lagoon-400 text-white shadow-lagoon-400/30 hover:shadow-lagoon-400/50'
                : 'bg-gradient-to-r from-lagoon-600 to-lagoon-500 text-white shadow-black/40 hover:shadow-lagoon-900/60'
            }`}
          >
            <Plus className="w-5 h-5" />
            Place in my circle
          </button>
        </form>
      </div>

      {/* The circle diagram — drag a bubble to another ring, or tap it for name / remove / move options */}
      <CircleDiagram friends={friends} removeFriend={removeFriend} setFriendTier={setFriendTier} isSkyMode={isSkyMode} />
    </div>
  );
}
