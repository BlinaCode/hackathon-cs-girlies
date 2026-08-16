import React from 'react';
import { Sparkles, Heart, Smile, Compass, Award } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';

export function OtterMascot({ expression = 'caring', speech, compact = false }) {
  const { isSkyMode } = useWellness();

  return (
    <div className={`flex items-start gap-4 ${compact ? 'max-w-md' : 'max-w-xl'} mx-auto my-4`}>
      <div className="relative group shrink-0">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center animate-otter-float transition-all duration-700 shadow-xl border p-2
          ${isSkyMode
            ? 'bg-gradient-to-br from-cream-100 to-bluey-100 border-bluey-300 shadow-bluey-400/20'
            : 'bg-gradient-to-br from-bluey-800 to-bluey-900 border-bluey-600 shadow-bluey-950/50'
          }`}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <path d="M 30 75 C 30 55, 70 55, 70 75 C 70 88, 30 88, 30 75 Z" fill="#653B22" />
            <circle cx="50" cy="45" r="24" fill="#653B22" />
            <ellipse cx="50" cy="52" rx="14" ry="10" fill="#E2C4A8" />
            <circle cx="28" cy="32" r="6" fill="#4A2511" />
            <circle cx="72" cy="32" r="6" fill="#4A2511" />
            <ellipse cx="50" cy="48" rx="4" ry="3" fill="#261105" />

            {expression === 'breathing' ? (
              <g stroke="#261105" strokeWidth="2.5" strokeLinecap="round" fill="none">
                <path d="M 40 42 Q 44 46 48 42" />
                <path d="M 52 42 Q 56 46 60 42" />
              </g>
            ) : expression === 'joyful' || expression === 'celebrating' ? (
              <g stroke="#261105" strokeWidth="2.5" strokeLinecap="round" fill="none">
                <path d="M 40 43 Q 44 38 48 43" />
                <path d="M 52 43 Q 56 38 60 43" />
              </g>
            ) : (
              <g fill="#261105">
                <circle cx="43" cy="41" r="3" />
                <circle cx="57" cy="41" r="3" />
                <circle cx="44" cy="40" r="1" fill="#FFFFFF" />
                <circle cx="58" cy="40" r="1" fill="#FFFFFF" />
              </g>
            )}

            <path d="M 38 65 Q 50 60 62 65" stroke="#4A2511" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 46 63 L 54 63 L 50 58 Z" fill="#F8B4C4" />
          </svg>
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
