import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { WellnessProvider, useWellness } from './context/WellnessContext';
import { useSupabaseSync } from './hooks/useSupabaseSync';
import { useLocalStorage } from './hooks/useLocalStorage';
import { STORAGE_KEYS } from './services/storage';
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
import { AboutSisu } from './components/AboutSisu';
import { AccountPage } from './components/AccountPage';
import { Connect } from './components/Connect';
import { ArrowRight } from 'lucide-react';
import portadaImg from './assets/portada.png';
import portadaCelularImg from './assets/portada-celular.png';
import nightmodeImg from './assets/nightmode.png';

import svgStarfish from './assets/svg/estrellademar.svg';
import svgShell from './assets/svg/concha.svg';
import svgSandDollar from './assets/svg/dolarmarino.svg';
import svgRocks from './assets/svg/rocas.svg';
import svgAlgae from './assets/svg/algas.svg';
import svgAlgae2 from './assets/svg/alga2.svg';
import svgFish from './assets/svg/pescado.svg';
import { OceanTransition } from './components/OceanTransition';

const BEACH_WISDOM = [
  { quote: "Notice how the ocean never rushes, yet washes away all footprints on the shore. Give yourself time to settle.", author: "Zen Shoreline Reflection" },
  { quote: "You cannot stop the waves, but you can learn to float upon them with gentle grace.", author: "Jon Kabat-Zinn" },
  { quote: "Like sea glass shaped by gentle tides, your struggles carve out your unique beauty and resilience.", author: "Coastal Wisdom" },
  { quote: "Inhale the fresh salty breeze of clarity, exhale what no longer serves your peace.", author: "Ocean Meditation" },
  { quote: "Peace is not the absence of ocean storms, but finding your quiet anchor deep beneath the surface.", author: "Aquatic Zen" }
];

const SAND_DECOR_ITEMS = [
  // Left cluster
  { id: 1, img: svgRocks, left: '2%', bottom: '5px', size: 75, rotation: -5 },
  { id: 2, img: svgAlgae, left: '4%', bottom: '15px', size: 80, rotation: -15 },
  { id: 3, img: svgShell, left: '8%', bottom: '12px', size: 50, rotation: 20 },
  
  // Mid-left cluster
  { id: 4, img: svgStarfish, left: '25%', bottom: '28px', size: 60, rotation: -25 },
  { id: 5, img: svgSandDollar, left: '32%', bottom: '10px', size: 45, rotation: 10 },
  
  // Center cluster
  { id: 6, img: svgRocks, left: '48%', bottom: '8px', size: 90, rotation: 5 },
  { id: 7, img: svgFish, left: '52%', bottom: '25px', size: 60, rotation: -10 },
  { id: 8, img: svgShell, left: '58%', bottom: '18px', size: 40, rotation: -15 },

  // Mid-right cluster
  { id: 9, img: svgAlgae2, left: '75%', bottom: '5px', size: 100, rotation: 15 },
  { id: 10, img: svgStarfish, left: '82%', bottom: '22px', size: 50, rotation: 35 },
  
  // Right cluster
  { id: 11, img: svgSandDollar, left: '92%', bottom: '15px', size: 60, rotation: -5 },
  { id: 12, img: svgRocks, left: '95%', bottom: '0px', size: 70, rotation: 10 },
];

function MainContent({ initialTab = 'hub' }) {
  const [activeTab, setActiveTabState] = useLocalStorage(STORAGE_KEYS.ACTIVE_TAB, initialTab);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { isSkyMode, mascotState } = useWellness();
  useSupabaseSync();

  const setActiveTab = (tab) => {
    if (tab === activeTab) return;
    if (isTransitioning) return; // Prevent multiple clicks during transition

    setIsTransitioning(true);

    setTimeout(() => {
      setActiveTabState(tab);
      if (window.location.hash !== `#${tab}`) {
        window.history.pushState({ tab }, '', `#${tab}`);
      }
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 500);
  };

  useEffect(() => {
    const hashTab = window.location.hash.slice(1);
    if (hashTab && hashTab !== activeTab) {
      setActiveTabState(hashTab);
    } else {
      window.history.replaceState({ tab: activeTab }, '', `#${activeTab}`);
    }

    const handlePopState = (event) => {
      const tab = event.state?.tab || window.location.hash.slice(1);
      if (tab) setActiveTabState(tab);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={`min-h-screen flex flex-col relative text-slate-100 font-body ${isSkyMode ? 'bg-cream-50' : 'bg-midnight-950'}`}>
      
      {/* The Global Ocean Transition */}
      <OceanTransition isTransitioning={isTransitioning} />

      {/* Subtle Background Beach Decor - Water Ripples (Only when NOT on hub to keep hub clean) */}
      {activeTab !== 'hub' && (
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-96 opacity-30 z-0">
          <svg viewBox="0 0 1440 320" className="w-full h-full object-cover">
            <path fill={isSkyMode ? '#B2EBF2' : '#1D2636'} fillOpacity="0.4" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,150,768,203,864,208C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
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
              <source media="(min-width: 640px)" srcSet={isSkyMode ? portadaImg : nightmodeImg} />
              <img
                src={isSkyMode ? portadaCelularImg : nightmodeImg}
                alt="Sisu Hero"
                className={`w-full h-auto object-cover min-h-[60vh] sm:min-h-[70vh] transition-all duration-700 ${isSkyMode ? '-mt-16 sm:-mt-48' : '-mt-20 sm:-mt-80'}`}
              />
            </picture>

            {/* Bottom Gradient Fade */}
            <div className={`absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t ${isSkyMode ? 'from-white via-white/80' : 'from-midnight-950 via-midnight-950/80'} to-transparent pointer-events-none z-0`}></div>

            {/* Hero Typography overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-start pt-24 sm:pt-44 px-4 text-center z-10">
              <h1 className={`font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-tight ${isSkyMode ? 'text-slate-900' : 'text-slate-100'} drop-shadow-md max-w-3xl mb-4 sm:mb-6`}>
                Find Your Inner Calm,<br className="hidden sm:block" /> One Wave at a Time
              </h1>
              <p className={`text-base sm:text-lg ${isSkyMode ? 'text-slate-800' : 'text-slate-300'} font-medium max-w-2xl drop-shadow-md mb-6 sm:mb-8 px-2`}>
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

          {/* Solid Section for Scrolling */}
          <div className={`w-full ${isSkyMode ? 'bg-white' : 'bg-midnight-950'} flex flex-col items-center justify-center min-h-[50vh] p-8 text-center shadow-inner relative z-10`}>
            <h2 className={`text-2xl sm:text-3xl font-display font-bold ${isSkyMode ? 'text-bluey-900' : 'text-slate-100'} mb-4`}>A Space to Breathe</h2>
            <p className={`${isSkyMode ? 'text-bluey-700' : 'text-slate-400'} max-w-2xl mx-auto`}>
              Welcome to your daily mental wellness companion. Sisu provides a calming environment to check in with yourself, practice ocean tide breathing, and gently reframe your thoughts.
            </p>
          </div>
        </main>
      ) : (
        <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 space-y-8 z-10">
          {activeTab !== 'checkin' && activeTab !== 'about' && activeTab !== 'account' && activeTab !== 'growth' && activeTab !== 'connect' && (
            <OtterMascot expression={activeTab === 'breathing' ? 'breathing' : mascotState.expression} speech={mascotState.speech} />
          )}
          {activeTab === 'checkin' && <MoodCheckIn />}
          {activeTab === 'breathing' && <BreathingVisualizer />}
          {activeTab === 'beliefs' && <ReframeThoughts setActiveTab={setActiveTab} />}
          {activeTab === 'friends' && <SocialCircle />}
          {activeTab === 'resources' && <ResourceHub setActiveTab={setActiveTab} />}
          {activeTab === 'growth' && <GrowthDashboard setActiveTab={setActiveTab} />}
          {activeTab === 'account' && <AccountPage setActiveTab={setActiveTab} />}
          {activeTab === 'connect' && <Connect setActiveTab={setActiveTab} />}
          {activeTab === 'about' && <AboutSisu />}
          {activeTab === '54321' && <FiveFourThreeTwoOne />}
        </main>
      )
      }

      {/* Sandy Shoreline Decor */}
      <div
        className={`relative w-full h-28 sm:h-40 overflow-hidden mt-auto ${isSkyMode ? 'bg-cream-200' : 'bg-midnight-900'}`}
        style={{
          maskImage: 'linear-gradient(to top, black 55%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 55%, transparent 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0px, transparent 2px, transparent 20px)'
        }} />

        {SAND_DECOR_ITEMS.map((item) => (
          <div
            key={item.id}
            className="absolute transition-opacity duration-1000 ease-in-out"
            style={{
              left: item.left,
              bottom: item.bottom,
              width: `${item.size}px`,
              height: `${item.size}px`,
              transform: `rotate(${item.rotation}deg)`,
              opacity: 0.8,
            }}
          >
            <img src={item.img} alt="Beach decor" className="w-full h-full object-contain drop-shadow-md" />
          </div>
        ))}
      </div>

      {/* Coastal Footer */}
      <footer className={`border-t py-6 text-center text-xs font-medium relative z-10 transition-all ${isSkyMode ? 'border-bluey-200 text-bluey-700 bg-cream-50/70' : 'border-midnight-800 text-midnight-muted bg-midnight-950'}`}>
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
