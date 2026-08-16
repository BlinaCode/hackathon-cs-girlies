import React from 'react';
import { Sparkles } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import otterCheckin from '../assets/otter/otter-checkin.png';
import otterBreathe from '../assets/otter/otter-breathe.png';
import otterReframe from '../assets/otter/otter-reframe.png';
import otterGrow from '../assets/otter/otter-grow.png';

// Illustrated otter portraits (hand-picked from the reference sticker set) per
// mascot expression, instead of a redrawn vector face.
const OTTER_PORTRAITS = {
  breathing: otterBreathe,
  joyful: otterCheckin,
  celebrating: otterGrow,
  caring: otterReframe,
  thoughtful: otterReframe,
};

export function OtterMascot({ expression = 'caring', speech, compact = false }) {
  const { isSkyMode } = useWellness();
  const portrait = OTTER_PORTRAITS[expression] || otterReframe;

  return (
    <div className={`flex items-start gap-4 ${compact ? 'max-w-md' : 'max-w-xl'} mx-auto my-4`}>
      <div className="relative group shrink-0">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center animate-otter-float transition-all duration-700 shadow-xl border p-1.5
          ${isSkyMode
            ? 'bg-gradient-to-br from-cream-100 to-bluey-100 border-bluey-300 shadow-bluey-400/20'
            : 'bg-gradient-to-br from-bluey-800 to-bluey-900 border-bluey-600 shadow-bluey-950/50'
          }`}
        >
          <img
            src={portrait}
            alt="Sisu the otter mascot"
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>
      </div>

      {speech && (
        <div className={`relative flex-1 border rounded-2xl p-4 text-xs sm:text-sm shadow-xl backdrop-blur-sm transition-all
          ${isSkyMode
            ? 'bg-white/90 border-bluey-200 text-bluey-900 shadow-bluey-200/50'
            : 'bg-bluey-900/90 border-bluey-700 text-bluey-100 shadow-bluey-950/50'
          }`}
        >
          <div className={`absolute top-5 -left-2 w-3 h-3 border-b border-l rotate-45 
            ${isSkyMode ? 'bg-white border-bluey-200' : 'bg-bluey-900 border-bluey-700'}`} 
          />
          <div className={`flex items-center gap-1.5 mb-1.5 text-[10px] font-bold tracking-wider uppercase 
            ${isSkyMode ? 'text-bluey-600' : 'text-bluey-400'}`}>
            <span>Sisu the Otter</span>
            <Sparkles className="w-3 h-3" />
          </div>
          <p className="leading-relaxed font-semibold">{speech}</p>
        </div>
      )}
    </div>
  );
}
