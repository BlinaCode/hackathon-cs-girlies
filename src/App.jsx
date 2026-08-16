import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { WellnessProvider, useWellness } from './context/WellnessContext';
import { useSupabaseSync } from './hooks/useSupabaseSync';
import { Header } from './components/Header';
import { OtterMascot } from './components/OtterMascot';
import { WelcomeQuestionnaire } from './components/WelcomeQuestionnaire';
import { MoodCheckIn } from './components/MoodCheckIn';
import { BreathingVisualizer } from './components/BreathingVisualizer';
import { ReframeThoughts } from './components/ReframeThoughts';
import { SocialCircle } from './components/SocialCircle';
import { ResourceHub } from './components/ResourceHub';
import { GrowthDashboard } from './components/GrowthDashboard';
import { FiveFourThreeTwoOne } from './components/FiveFourThreeTwoOne';
import { ArrowRight } from 'lucide-react';
import portadaImg from './assets/portada.png';
import portadaCelularImg from './assets/portada-celular.png';

const BEACH_WISDOM = [
  { quote: "Notice how the ocean never rushes, yet washes away all footprints on the shore. Give yourself time to settle.", author: "Zen Shoreline Reflection" },
  { quote: "You cannot stop the waves, but you can learn to float upon them with gentle grace.", author: "Jon Kabat-Zinn" },
  { quote: "Like sea glass shaped by gentle tides, your struggles carve out your unique beauty and resilience.", author: "Coastal Wisdom" },
  { quote: "Inhale the fresh salty breeze of clarity, exhale what no longer serves your peace.", author: "Ocean Meditation" },
  { quote: "Peace is not the absence of ocean storms, but finding your quiet anchor deep beneath the surface.", author: "Aquatic Zen" }
];

const SAND_DECOR_ITEMS = [
  { id: 1, type: 'shell', left: '4%', bottom: '18px', size: 34, rotation: -12 },
  { id: 2, type: 'rock', left: '11%', bottom: '8px', size: 46, rotation: 0 },
  { id: 3, type: 'shell', left: '19%', bottom: '28px', size: 26, rotation: 20 },
  { id: 4, type: 'rock', left: '27%', bottom: '14px', size: 32, rotation: 0 },
  { id: 5, type: 'shell', left: '35%', bottom: '10px', size: 30, rotation: -30 },
  { id: 6, type: 'rock', left: '44%', bottom: '22px', size: 38, rotation: 0 },
  { id: 7, type: 'shell', left: '53%', bottom: '16px', size: 28, rotation: 8 },
  { id: 8, type: 'rock', left: '61%', bottom: '6px', size: 42, rotation: 0 },
  { id: 9, type: 'shell', left: '70%', bottom: '26px', size: 32, rotation: -18 },
  { id: 10, type: 'rock', left: '78%', bottom: '12px', size: 36, rotation: 0 },
  { id: 11, type: 'shell', left: '87%', bottom: '20px', size: 30, rotation: 25 },
  { id: 12, type: 'rock', left: '93%', bottom: '8px', size: 30, rotation: 0 },
];

function SeashellIcon() {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <path d="M 8 30 C 6 18, 34 18, 32 30 C 35 36, 5 36, 8 30 Z" fill="#F8B4C4" stroke="#E88C9E" strokeWidth="1" />
      <path d="M 20 34 L 12 20" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <path d="M 20 34 L 20 16" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
      <path d="M 20 34 L 28 20" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

function RockIcon() {
  return (
    <svg viewBox="0 0 40 30" className="w-full h-full">
      <ellipse cx="20" cy="20" rx="17" ry="9" fill="#8A9B9E" />
      <ellipse cx="20" cy="17" rx="17" ry="9" fill="#A9B8BA" />
      <ellipse cx="14" cy="14" rx="4" ry="2.2" fill="#C3CFD1" opacity="0.6" />
    </svg>
  );
}



function ComingSoonPlaceholder({ title }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-sm min-h-[40vh] w-full">
      <div className="text-4xl mb-4">🚧</div>
      <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-600">This feature is currently under development. Please check back later!</p>
    </div>
  );
}

function MainContent({ initialTab = 'hub' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { isSkyMode, mascotState } = useWellness();
  useSupabaseSync();

  return (
    <div className={`min-h-screen flex flex-col relative text-slate-100 font-body ${isSkyMode ? 'bg-cream-50' : 'bg-bluey-950'}`}>

      {/* Subtle Background Beach Decor - Water Ripples (Only when NOT on hub to keep hub clean) */}
      {activeTab !== 'hub' && (
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-96 opacity-30 z-0">
          <svg viewBox="0 0 1440 320" className="w-full h-full object-cover">
            <path fill={isSkyMode ? '#B2EBF2' : '#00695C'} fillOpacity="0.4" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,150,768,203,864,208C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
        </div>
      )}



      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'hub' ? (
        <main className="flex-1 w-full z-10 flex flex-col">
          {/* Hero Section */}
          <div className="relative w-full overflow-hidden">
            {/* The full image in normal flow */}
            <picture>
              <source media="(min-width: 640px)" srcSet={portadaImg} />
              <img src={portadaCelularImg} alt="Sisu Hero" className="w-full h-auto object-cover min-h-[60vh] sm:min-h-[70vh] -mt-16 sm:-mt-48" />
            </picture>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-0"></div>

            {/* Hero Typography overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-start pt-24 sm:pt-44 px-4 text-center z-10">
              <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-tight text-slate-900 drop-shadow-md max-w-3xl mb-4 sm:mb-6">
                Find Your Inner Calm,<br className="hidden sm:block" /> One Wave at a Time
              </h1>
              <p className="text-base sm:text-lg text-slate-800 font-medium max-w-2xl drop-shadow-md mb-6 sm:mb-8 px-2">
                Practice ocean tide breathing, record your feelings with shoreline check-ins, and anchor your daily mental wellness.
              </p>
              <button
                onClick={() => setActiveTab('checkin')}
                className="px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base shadow-2xl transition-all hover:scale-105 flex items-center gap-2 pointer-events-auto"
              >
                Start Mood Check-In
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* White Section for Scrolling */}
          <div className="w-full bg-white flex flex-col items-center justify-center min-h-[50vh] p-8 text-center shadow-inner relative z-10">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-bluey-900 mb-4">A Space to Breathe</h2>
            <p className="text-bluey-700 max-w-2xl mx-auto">
              Welcome to your daily mental wellness companion. Sisu provides a calming environment to check in with yourself, practice ocean tide breathing, and gently reframe your thoughts.
            </p>
          </div>
        </main>
      ) : (
        <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 space-y-8 z-10">
          {activeTab !== 'checkin' && (
            <OtterMascot expression={activeTab === 'breathing' ? 'breathing' : mascotState.expression} speech={mascotState.speech} />
          )}
          {activeTab === 'checkin' && <MoodCheckIn />}
          {activeTab === 'breathing' && <BreathingVisualizer />}
          {activeTab === 'beliefs' && <ReframeThoughts />}
          {activeTab === 'friends' && <SocialCircle />}
          {activeTab === 'resources' && <ResourceHub />}
          {activeTab === 'growth' && <GrowthDashboard />}
          {activeTab === 'connect' && <ComingSoonPlaceholder title="Connect" />}
          {activeTab === 'about' && <ComingSoonPlaceholder title="About Sisu" />}
          {activeTab === '54321' && <FiveFourThreeTwoOne />}
        </main>
      )
      }

      {/* Sandy Shoreline Decor */}
      <div
        className={`relative w-full h-28 sm:h-40 overflow-hidden mt-auto ${isSkyMode ? 'bg-cream-200' : 'bg-bluey-900'}`}
        style={{
          maskImage: 'linear-gradient(to top, black 55%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 55%, transparent 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0px, transparent 2px, transparent 20px)'
        }} />

        {SAND_DECOR_ITEMS.map(item => (
          <div
            key={item.id}
            className="absolute"
            style={{
              left: item.left,
              bottom: item.bottom,
              width: item.size,
              height: item.size,
              transform: `rotate(${item.rotation}deg)`,
            }}
          >
            {item.type === 'shell' ? <SeashellIcon /> : <RockIcon />}
          </div>
        ))}
      </div>

      {/* Coastal Footer */}
      <footer className={`border-t py-6 text-center text-xs font-medium relative z-10 transition-all ${isSkyMode ? 'border-bluey-200 text-bluey-700 bg-cream-50/70' : 'border-bluey-800 text-bluey-300 bg-bluey-950'}`}>
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>© 2026 Sisu Health & Wellness • Beach Vibes & Zen Companion</div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>🌊 Ocean Shoreline Theme</span>
            <span>•</span>
            <span>🦦 Sisu & Pastel Shell</span>
          </div>
        </div>
      </footer>
    </div >
  );
}

export default function App() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(() => {
    return localStorage.getItem('sisu_questionnaire_completed') !== 'true';
  });

  const [initialTab, setInitialTab] = useState('hub');

  const handleQuestionnaireComplete = (result) => {
    localStorage.setItem('sisu_questionnaire_completed', 'true');

    if (result?.redirect) {
      setInitialTab(result.redirect);
    }

    setShowQuestionnaire(false);
  };

  return (
    <AuthProvider>
      <WellnessProvider>
        {showQuestionnaire ? (
          <WelcomeQuestionnaire onComplete={handleQuestionnaireComplete} />
        ) : (
          <MainContent initialTab={initialTab} />
        )}
      </WellnessProvider>
    </AuthProvider>
  );
}
