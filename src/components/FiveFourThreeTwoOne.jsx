import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';

import contentOtter from '../assests/images/contentotter.png';
import yayOtter from '../assests/images/yayotter.png';

// --- Decorative Icons Sourced from "Elementos de Bienestar" ---

function FishIcon() {
    return (
        <svg viewBox="0 0 50 30" className="w-full h-full drop-shadow-sm">
            <path d="M 8 15 C 8 8, 28 6, 36 15 C 28 24, 8 22, 8 15 Z" fill="#A4D3DE" stroke="#7AABB8" strokeWidth="1.5" />
            <path d="M 36 15 L 46 8 L 44 15 L 46 22 Z" fill="#A4D3DE" stroke="#7AABB8" strokeWidth="1.5" />
            <circle cx="15" cy="12" r="1.8" fill="#4A2511" />
            <path d="M 22 10 C 20 13, 20 17, 22 20" stroke="#7AABB8" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M 27 11 C 25 14, 25 16, 27 19" stroke="#7AABB8" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </svg>
    );
}

function SeaweedIcon() {
    return (
        <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-sm">
            <path d="M 12 38 C 6 28, 18 20, 12 10 C 8 4, 14 2, 14 2" stroke="#8BAE7B" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 24 38 C 30 26, 18 18, 25 10 C 29 4, 24 2, 25 2" stroke="#A5C496" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
    );
}

function BalanceRocksIcon() {
    return (
        <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-sm">
            <ellipse cx="20" cy="32" rx="14" ry="5.5" fill="#788487" />
            <ellipse cx="19" cy="23" rx="10" ry="4.5" fill="#95A3A5" />
            <ellipse cx="21" cy="15" rx="6.5" ry="3.5" fill="#B3C0C2" />
        </svg>
    );
}

function SeashellIcon() {
    return (
        <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-sm">
            <path d="M 10 32 C 6 16, 34 16, 30 32 C 34 37, 6 37, 10 32 Z" fill="#F5B2B8" stroke="#E08B95" strokeWidth="1.2" />
            <path d="M 20 35 L 13 20" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
            <path d="M 20 35 L 20 17" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            <path d="M 20 35 L 27 20" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        </svg>
    );
}

function SandDollarIcon() {
    return (
        <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-sm">
            <circle cx="20" cy="20" r="16" fill="#F5E8C9" stroke="#E3CE9E" strokeWidth="1.5" />
            <g stroke="#D1B882" strokeWidth="1.2" fill="none" opacity="0.85" strokeLinecap="round">
                <path d="M20 10 C21.5 15, 21.5 20, 20 25 M20 10 C18.5 15, 18.5 20, 20 25" />
                <path d="M10 20 C15 21.5, 20 21.5, 25 20 M10 20 C15 18.5, 20 18.5, 25 20" />
            </g>
        </svg>
    );
}

function SeaGlassIcon() {
    return (
        <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-sm">
            <path d="M 18 6 C 28 4, 35 14, 32 26 C 28 35, 14 36, 8 28 C 4 18, 10 8, 18 6 Z" fill="#CFE2F3" stroke="#A4D3DE" strokeWidth="1.5" opacity="0.9" />
            <path d="M 16 10 C 24 10, 28 16, 26 26" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
        </svg>
    );
}

function CoastalElementIcon() {
    return (
        <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-sm">
            <path d="M 20 36 L 20 6 M 20 12 L 30 6 M 20 18 L 32 12 M 20 24 L 30 18 M 20 12 L 10 6 M 20 18 L 8 12 M 20 24 L 10 18" stroke="#84A8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    );
}

const DECOR_ICONS = {
    fish: FishIcon,
    seaweed: SeaweedIcon,
    rocks: BalanceRocksIcon,
    shell: SeashellIcon,
    sanddollar: SandDollarIcon,
    seaglass: SeaGlassIcon,
    coastal: CoastalElementIcon,
};

// Accents pulled only from "Paleta de Colores Suaves del Mar"
const GROUNDING_STEPS = [
    { sense: 'See', count: 5, prompt: 'things you can SEE around you (a color, a shadow, an object)', icon: '👀', decor: ['fish', 'seaweed'], image: contentOtter, accent: '#CFE2F3' },
    { sense: 'Touch', count: 4, prompt: 'things you can TOUCH nearby (your clothes, chair, carpet, cold water)', icon: '✋', decor: ['rocks', 'shell'], image: contentOtter, accent: '#E8E2D1' },
    { sense: 'Hear', count: 3, prompt: 'things you can HEAR around you (ambient room noise, distant traffic, your breath)', icon: '👂', decor: ['sanddollar', 'seaglass'], image: contentOtter, accent: '#A4D3DE' },
    { sense: 'Smell', count: 2, prompt: 'things you can SMELL (coffee, fresh air, paper, soap)', icon: '👃', decor: ['coastal', 'seaweed'], image: contentOtter, accent: '#D9E7D0' },
    { sense: 'Taste', count: 1, prompt: 'thing you can TASTE (mint, water, or notice your tongue)', icon: '👅', decor: ['fish', 'shell'], image: yayOtter, accent: '#F5E8C7' },
];

function OtterAvatar({ imageSrc }) {
    return (
        <div className="w-full h-full rounded-2xl overflow-hidden bg-[#FAFBF0] shadow-inner flex items-center justify-center">
            <img
                src={imageSrc}
                alt="Sisu the Otter"
                className="w-full h-full object-cover object-center"
            />
        </div>
    );
}

export function FiveFourThreeTwoOne({ onExit }) {
    const { toggleResourceCompletion } = useWellness();
    const [stepIndex, setStepIndex] = useState(0);
    const [found, setFound] = useState(() => GROUNDING_STEPS.map(s => Array(s.count).fill(false)));
    const [finished, setFinished] = useState(false);

    const step = GROUNDING_STEPS[stepIndex];
    const isLastStep = stepIndex === GROUNDING_STEPS.length - 1;
    const isFirstStep = stepIndex === 0;

    const toggleFound = (itemIdx) => {
        setFound(prev => {
            const updated = prev.map(arr => [...arr]);
            updated[stepIndex][itemIdx] = !updated[stepIndex][itemIdx];
            return updated;
        });
    };

    const goNext = () => {
        if (isLastStep) {
            toggleResourceCompletion('res-54321');
            setFinished(true);
        } else {
            setStepIndex(prev => prev + 1);
        }
    };

    const goBack = () => {
        if (!isFirstStep) setStepIndex(prev => prev - 1);
    };

    const restart = () => {
        setStepIndex(0);
        setFound(GROUNDING_STEPS.map(s => Array(s.count).fill(false)));
        setFinished(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-10 px-2 sm:px-0">
            <div className="text-center space-y-1.5">
                <span
                    className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm"
                    style={{ background: '#F5E8C9', color: '#4A2511' }}
                >
                    Anxiety & Panic Relief
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: '#4A2511' }}>
                    5-4-3-2-1 Grounding Journey
                </h2>
                <p className="text-xs sm:text-sm max-w-md mx-auto font-medium" style={{ color: '#7A5A3A' }}>
                    Walk the shoreline with Sisu, one sense at a time, until your mind settles back into the present.
                </p>
            </div>

            {!finished ? (
                <>
                    <div className="flex items-center justify-center gap-2">
                        {GROUNDING_STEPS.map((s, idx) => (
                            <div
                                key={s.sense}
                                className="h-2 rounded-full transition-all"
                                style={{
                                    width: idx === stepIndex ? '2rem' : '0.5rem',
                                    background: idx <= stepIndex ? '#A4D3DE' : '#E8E2D1',
                                }}
                            />
                        ))}
                    </div>

                    <div
                        className="rounded-3xl border p-6 sm:p-10 space-y-6 shadow-xl transition-all relative overflow-hidden"
                        style={{ background: `${step.accent}66`, borderColor: step.accent }}
                    >
                        {step.decor.map((key, i) => {
                            const Icon = DECOR_ICONS[key];
                            return (
                                <span
                                    key={i}
                                    className={`absolute w-10 h-10 sm:w-12 sm:h-12 opacity-90 ${i === 0 ? 'top-4 left-5' : 'top-6 right-6'
                                        }`}
                                >
                                    <Icon />
                                </span>
                            );
                        })}

                        <div className="flex flex-col items-center gap-3 relative z-10">
                            <div className="w-24 h-24 rounded-2xl p-1.5 shadow-sm bg-white">
                                <OtterAvatar imageSrc={step.image} />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#4A2511' }}>
                                Step {stepIndex + 1} of {GROUNDING_STEPS.length}
                            </span>
                            <h3 className="font-display text-xl sm:text-2xl font-bold text-center" style={{ color: '#4A2511' }}>
                                {step.icon} Name {step.count} {step.prompt}
                            </h3>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 relative z-10">
                            {Array.from({ length: step.count }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => toggleFound(i)}
                                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all shadow-sm"
                                    style={
                                        found[stepIndex][i]
                                            ? { background: '#A4D3DE', borderColor: '#7AABB8', color: '#FFFFFF', transform: 'scale(0.95)' }
                                            : { background: '#FAFBF0', borderColor: '#E8E2D1', color: '#7A5A3A' }
                                    }
                                >
                                    {found[stepIndex][i] ? <CheckCircle2 className="w-6 h-6" /> : i + 1}
                                </button>
                            ))}
                        </div>
                        <p className="text-center text-[11px] font-medium relative z-10" style={{ color: '#7A5A3A' }}>
                            Tap a circle each time you notice one — no need to rush.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={goBack}
                            disabled={isFirstStep}
                            className="flex-1 py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all border"
                            style={
                                isFirstStep
                                    ? { opacity: 0.4, cursor: 'not-allowed', background: '#E8E2D1', borderColor: '#D6CBAE', color: '#7A5A3A' }
                                    : { background: '#FAFBF0', borderColor: '#E8E2D1', color: '#4A2511' }
                            }
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                        <button
                            onClick={goNext}
                            className="flex-1 py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                            style={{ background: '#A4D3DE', color: '#4A2511' }}
                        >
                            {isLastStep ? 'Finish Practice' : 'Next'}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </>
            ) : (
                <div className="rounded-3xl border p-8 sm:p-12 text-center space-y-4 shadow-xl" style={{ background: '#FAFBF0', borderColor: '#E8E2D1' }}>
                    <div className="w-28 h-28 mx-auto">
                        <OtterAvatar imageSrc={yayOtter} />
                    </div>
                    <h3 className="font-display text-2xl font-bold" style={{ color: '#4A2511' }}>
                        Well Grounded! 🌊
                    </h3>
                    <p className="text-xs sm:text-sm max-w-sm mx-auto font-medium" style={{ color: '#7A5A3A' }}>
                        You walked through every sense with Sisu. However you're feeling right now, you met this moment with care.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                        <button
                            onClick={restart}
                            className="px-6 py-3 rounded-2xl font-bold text-xs transition-all border"
                            style={{ background: '#FFFFFF', borderColor: '#E8E2D1', color: '#4A2511' }}
                        >
                            Practice Again
                        </button>
                        {onExit && (
                            <button
                                onClick={onExit}
                                className="px-6 py-3 rounded-2xl font-bold text-xs transition-all shadow-md"
                                style={{ background: '#A4D3DE', color: '#4A2511' }}
                            >
                                Back to Library
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}