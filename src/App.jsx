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
import { Compass, Heart, Brain, Users, BookOpen, Flame, Sparkles, ArrowRight } from 'lucide-react';

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

function HomeHub({ setActiveTab }) {
  const { mascotState, breathingStreak, moodLogs, isSkyMode, beliefs } = useWellness();
  const [wisdomIndex, setWisdomIndex] = useState(0);

  const nextWisdom = () => {
    setWisdomIndex((prev) => (prev + 1) % BEACH_WISDOM.length);
  };

  return (
    <div className="space-y-8">
      {/* Hero Coastal Card */}
      <div className={`rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-2xl relative overflow-hidden transition-all ${isSkyMode ? 'glass-card-day' : 'glass-card-night'}`}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-seashell-100/90 border border-seashell-300 text-seashell-500 text-xs font-bold mb-1 shadow-sm">
          <span>🦪 Inviting Beach & Aquatic Vibes</span>
        </div>

        <h1 className={`font-display text-3xl sm:text-5xl font-bold leading-tight ${isSkyMode ? 'text-bluey-950' : 'text-white'}`}>
          Find Your Inner Calm, One Wave at a Time
        </h1>

        <p className={`text-xs sm:text-base max-w-xl mx-auto leading-relaxed ${isSkyMode ? 'text-bluey-800' : 'text-bluey-200'}`}>
          Welcome to Sisu. Practice ocean tide breathing, record your feelings with shoreline check-ins, and anchor your daily mental wellness.
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-3">
          <button
            onClick={() => setActiveTab('checkin')}
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-bluey-500 to-bluey-600 hover:from-bluey-400 hover:to-bluey-500 text-white font-bold text-xs shadow-lg shadow-bluey-500/30 transition-all flex items-center gap-2"
          >
            <span>Start Mood Check-In</span>
            <span>🌊</span>
          </button>
          <button
            onClick={() => setActiveTab('breathing')}
            className={`px-7 py-3.5 rounded-2xl border font-bold text-xs transition-all flex items-center gap-2 ${isSkyMode
              ? 'bg-white border-bluey-300 text-bluey-950 hover:bg-bluey-50 shadow-sm'
              : 'bg-bluey-800 border-bluey-700 text-bluey-100 hover:bg-bluey-700'
              }`}
          >
            <span>Practice Ocean Breathing</span>
            <span>💨</span>
          </button>
        </div>
      </div>

      {/* Zen Beach Wisdom Quote Card */}
      <div className={`rounded-3xl p-6 sm:p-8 space-y-3 relative transition-all ${isSkyMode ? 'bg-gradient-to-r from-cream-100/90 via-bluey-50/80 to-cream-100/90 border border-cream-300/80 shadow-md' : 'bg-gradient-to-r from-bluey-900/90 via-bluey-950 to-bluey-900/90 border border-bluey-700 shadow-md'}`}>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-bluey-600 dark:text-bluey-300 flex items-center gap-1.5">
            <span>✨</span> Beach Wisdom of the Day
          </span>
          <button
            onClick={nextWisdom}
            className="text-[11px] font-bold text-bluey-600 dark:text-bluey-300 hover:underline flex items-center gap-1"
          >
            <span>Next Wave</span> <span>🌊</span>
          </button>
        </div>
        <blockquote className={`font-display text-lg sm:text-xl italic font-medium ${isSkyMode ? 'text-bluey-950' : 'text-bluey-50'}`}>
          "{BEACH_WISDOM[wisdomIndex].quote}"
        </blockquote>
        <p className={`text-xs font-semibold text-right ${isSkyMode ? 'text-bluey-700' : 'text-bluey-300'}`}>
          — {BEACH_WISDOM[wisdomIndex].author}
        </p>
      </div>

      {/* Quick Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`rounded-2xl p-6 text-center space-y-1 transition-all ${isSkyMode ? 'glass-card-day' : 'glass-card-night'}`}>
          <div className="text-4xl font-display font-bold text-bluey-500">{moodLogs.length}</div>
          <div className={`text-xs font-semibold ${isSkyMode ? 'text-bluey-800' : 'text-bluey-300'}`}>Check-Ins Logged</div>
        </div>
        <div className={`rounded-2xl p-6 text-center space-y-1 transition-all ${isSkyMode ? 'glass-card-day' : 'glass-card-night'}`}>
          <div className="text-4xl font-display font-bold text-amber-500">{breathingStreak.count} Days</div>
          <div className={`text-xs font-semibold ${isSkyMode ? 'text-bluey-800' : 'text-bluey-300'}`}>Breathing Streak</div>
        </div>
        <div className={`rounded-2xl p-6 text-center space-y-1 transition-all ${isSkyMode ? 'glass-card-day' : 'glass-card-night'}`}>
          <div className="text-4xl font-display font-bold text-seashell-500">{beliefs.length}</div>
          <div className={`text-xs font-semibold ${isSkyMode ? 'text-bluey-800' : 'text-bluey-300'}`}>Beliefs Reframed</div>
        </div>
      </div>
    </div>
  );
}

function MainContent({ initialTab = 'hub' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { isSkyMode, mascotState } = useWellness();
  useSupabaseSync();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden text-slate-100 font-body">
      {/* Subtle Background Beach Decor - Water Ripples */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-96 opacity-30 z-0">
        <svg viewBox="0 0 1440 320" className="w-full h-full object-cover">
          <path fill={isSkyMode ? '#B2EBF2' : '#00695C'} fillOpacity="0.4" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,150,768,203,864,208C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>

      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 space-y-8 z-10">
        <OtterMascot expression={activeTab === 'breathing' ? 'breathing' : mascotState.expression} speech={mascotState.speech} />

        {activeTab === 'hub' && <HomeHub setActiveTab={setActiveTab} />}
        {activeTab === 'checkin' && <MoodCheckIn />}
        {activeTab === 'breathing' && <BreathingVisualizer />}
        {activeTab === 'beliefs' && <ReframeThoughts />}
        {activeTab === 'friends' && <SocialCircle />}
        {activeTab === 'resources' && <ResourceHub />}
        {activeTab === 'growth' && <GrowthDashboard />}
      </main>

      {/* Sandy Shoreline Decor */}
      <div
        className="relative w-full h-28 sm:h-40 overflow-hidden bg-cream-200 mt-auto"
        style={{
          maskImage: 'linear-gradient(to top, black 55%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 55%, transparent 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0px, transparent 2px, transparent 20px)'
        }}></div>

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
    </div>
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
