import React from 'react';
import { Sparkles, Heart, Smile, Compass, Award } from 'lucide-react';

export function OtterMascot({ expression = 'caring', speech, compact = false }) {
  // Select mascot pose styling & icon badge based on expression state
  const getBadgeIcon = () => {
    switch (expression) {
      case 'joyful':
        return <Smile className="w-4 h-4 text-amber-400" />;
      case 'breathing':
        return <Compass className="w-4 h-4 text-seafoam-400" />;
      case 'celebrating':
        return <Award className="w-4 h-4 text-rose-400" />;
      case 'thoughtful':
        return <Sparkles className="w-4 h-4 text-sky-400" />;
      case 'caring':
      default:
        return <Heart className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className={`flex items-start gap-4 ${compact ? 'max-w-md' : 'max-w-xl'} mx-auto my-4`}>
      {/* Sisu Otter SVG Illustration Avatar */}
      <div className="relative group shrink-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-teal-500/20 to-seafoam-500/30 border border-seafoam-500/40 p-2 flex items-center justify-center shadow-xl shadow-seafoam-500/10 animate-otter-float">
          
          {/* Custom Otter SVG Vector Drawing */}
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Sea wave ripples background */}
            <circle cx="50" cy="50" r="45" fill="#14B8A6" fillOpacity="0.15" />
            
            {/* Otter Body & Head */}
            <path d="M 30 75 C 30 55, 70 55, 70 75 C 70 88, 30 88, 30 75 Z" fill="#8D5B4C" />
            <circle cx="50" cy="45" r="24" fill="#A06A58" />
            {/* Cream muzzle */}
            <ellipse cx="50" cy="52" rx="14" ry="10" fill="#FCE7D0" />
            
            {/* Otter Ears */}
            <circle cx="28" cy="32" r="6" fill="#8D5B4C" />
            <circle cx="72" cy="32" r="6" fill="#8D5B4C" />
            
            {/* Nose */}
            <ellipse cx="50" cy="48" rx="4" ry="3" fill="#3D261D" />
            
            {/* Eyes based on expression */}
            {expression === 'breathing' ? (
              // Serene closed eyes
              <g stroke="#3D261D" strokeWidth="2.5" strokeLinecap="round" fill="none">
                <path d="M 40 42 Q 44 46 48 42" />
                <path d="M 52 42 Q 56 46 60 42" />
              </g>
            ) : expression === 'joyful' || expression === 'celebrating' ? (
              // Happy squint eyes
              <g stroke="#3D261D" strokeWidth="2.5" strokeLinecap="round" fill="none">
                <path d="M 40 43 Q 44 38 48 43" />
                <path d="M 52 43 Q 56 38 60 43" />
              </g>
            ) : (
              // Curious friendly eyes
              <g fill="#3D261D">
                <circle cx="43" cy="41" r="3" />
                <circle cx="57" cy="41" r="3" />
                {/* Catchlight */}
                <circle cx="44" cy="40" r="1" fill="#FFFFFF" />
                <circle cx="58" cy="40" r="1" fill="#FFFFFF" />
              </g>
            )}

            {/* Little Paw holding a shell */}
            <path d="M 38 65 Q 50 60 62 65" stroke="#7A4B3E" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 46 63 L 54 63 L 50 58 Z" fill="#FDE68A" />
          </svg>

          {/* Badge Icon overlay */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-ocean-950 border border-slate-700 flex items-center justify-center shadow-md">
            {getBadgeIcon()}
          </div>
        </div>
      </div>

      {/* Speech Bubble */}
      {speech && (
        <div className="relative flex-1 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3.5 sm:p-4 text-slate-200 text-xs sm:text-sm shadow-xl backdrop-blur-sm">
          {/* Tail point */}
          <div className="absolute top-4 -left-2 w-3 h-3 bg-slate-800 border-l border-b border-slate-700/80 rotate-45" />
          
          <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold tracking-wider uppercase text-seafoam-400">
            <span>Sisu the Otter</span>
            <Sparkles className="w-3 h-3 text-seafoam-400" />
          </div>
          <p className="leading-relaxed font-medium text-slate-200">{speech}</p>
        </div>
      )}
    </div>
  );
}
