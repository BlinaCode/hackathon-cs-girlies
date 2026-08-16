import React from 'react';
import { useWellness } from '../context/WellnessContext';
import otterJoyful from '../assets/svg/nutriaalegria.svg';
import otterPureJoy from '../assets/svg/nutriaalegriapura.svg';
import otterCaring from '../assets/svg/nutriacompasion.svg';
import otterFocused from '../assets/svg/nutriaconcentracion.svg';
import otterComforting from '../assets/svg/nutriaconsuelo.svg';
import otterCurious from '../assets/svg/nutriacuriosidad.svg';
import otterEnthusiastic from '../assets/svg/nutriaentusiasmo.svg';
import otterMeditating from '../assets/svg/nutriameditacionprofunda.svg';
import otterReflecting from '../assets/svg/nutriareflexion.svg';
import otterSurprise from '../assets/svg/nutriasorpresa.svg';

const OTTER_PORTRAITS = {
  breathing: otterMeditating,
  joyful: otterJoyful,
  celebrating: otterPureJoy,
  caring: otterCaring,
  thoughtful: otterReflecting,
  focused: otterFocused,
  comforting: otterComforting,
  curious: otterCurious,
  enthusiastic: otterEnthusiastic,
  surprise: otterSurprise,
};

export function OtterMascot({ expression = 'caring', speech, compact = false }) {
  const { isSkyMode } = useWellness();
  const portrait = OTTER_PORTRAITS[expression] || otterJoyful;

  return (
    <div className={`flex items-center gap-4 ${compact ? 'max-w-md' : 'max-w-xl'} my-2`}>
      <div className="relative shrink-0">
        <div className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transition-all duration-700
          ${isSkyMode ? 'opacity-90' : 'opacity-80'}`}
        >
          <img
            src={portrait}
            alt="Sisu the otter mascot"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {speech && (
        <div className={`flex-1 text-sm sm:text-base font-serif italic transition-all
          ${isSkyMode ? 'text-lagoon-900/80' : 'text-lagoon-100/70'}`}
        >
          <p className="leading-relaxed">"{speech}"</p>
        </div>
      )}
    </div>
  );
}
