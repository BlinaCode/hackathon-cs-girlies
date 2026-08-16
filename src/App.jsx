import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { WellnessProvider, useWellness } from './context/WellnessContext';
import { useSupabaseSync } from './hooks/useSupabaseSync';
import { Header } from './components/Header';
import { OtterMascot } from './components/OtterMascot';
import { MoodCheckIn } from './components/MoodCheckIn';
import { BreathingVisualizer } from './components/BreathingVisualizer';
import { ReframeThoughts } from './components/ReframeThoughts';
import { SocialCircle } from './components/SocialCircle';
import { ResourceHub } from './components/ResourceHub';
import { GrowthDashboard } from './components/GrowthDashboard';
import { Compass, Heart, Brain, Users, BookOpen, Flame, Sparkles, ArrowRight } from 'lucide-react';

function HomeHub({ setActiveTab }) {
  const { mascotState, breathingStreak, moodLogs } = useWellness();

  const quickTools = [
    {
      id: 'checkin',
      title: 'Daily Emotional Check-In',
      desc: 'Log your current feeling, energy level, and reflection.',
      icon: <Heart className="w-6 h-6 text-rose-400" />,
      badge: 'Quick Check-In'
    },
    {
      id: 'breathing',
      title: 'Ocean Wave Breathing',
      desc: 'Interactive 60fps breathing exercise to soothe stress.',
      icon: <Compass className="w-6 h-6 text-seafoam-400" />,
      badge: `${breathingStreak.count} Day Streak`
    },
    {
      id: 'beliefs',
      title: 'Reframe Thoughts',
      desc: 'Examine a bothering thought and find a kinder alternative.',
      icon: <Brain className="w-6 h-6 text-amber-400" />,
      badge: 'CBT Tool'
    },
    {
      id: 'friends',
      title: 'Social Circle',
      desc: 'Two quick questions place each person in your circle.',
      icon: <Users className="w-6 h-6 text-seafoam-400" />,
      badge: 'Connection'
    },
    {
      id: 'resources',
      title: 'Smart Resource Library',
      desc: 'Evidence-based guides (5-4-3-2-1 Grounding, CBT Reframing).',
      icon: <BookOpen className="w-6 h-6 text-sky-400" />,
      badge: 'Guided Tools'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-ocean-950 border border-slate-700/80 p-8 sm:p-12 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-seafoam-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-seafoam-500/15 border border-seafoam-500/30 text-seafoam-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Your Daily Sanctuary for Growth
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-slate-100 leading-tight">
            Understanding Yourself, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-seafoam-400 via-teal-300 to-sand-200">
              One Wave at a Time.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Welcome to Sisu. Explore your emotional check-ins, practice ocean breathing, track your long-term values, and receive gentle guidance from Sisu the Otter.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => setActiveTab('checkin')}
              className="px-6 py-3.5 rounded-2xl bg-seafoam-500 text-ocean-950 font-bold text-sm hover:bg-seafoam-400 transition-all shadow-xl shadow-seafoam-500/20 flex items-center gap-2"
            >
              Start Mood Check-In
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('breathing')}
              className="px-6 py-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-200 font-semibold text-sm hover:bg-slate-700 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-seafoam-400" />
              Practice Ocean Breathing
            </button>
          </div>
        </div>
      </div>

      {/* Sisu Otter Mascot Companion */}
      <OtterMascot expression={mascotState.expression} speech={mascotState.speech} />

      {/* Quick Tools Grid */}
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-slate-100">
          Wellness Tools & Features
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickTools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTab(tool.id)}
              className="bg-slate-800/80 border border-slate-700/80 hover:border-seafoam-500/50 rounded-3xl p-6 text-left transition-all duration-300 shadow-xl hover:shadow-seafoam-500/10 group flex flex-col justify-between backdrop-blur-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60 group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400">
                    {tool.badge}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-slate-100 group-hover:text-seafoam-300 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {tool.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-700/40 text-xs font-semibold text-seafoam-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open Tool →
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

function MainContent() {
  const [activeTab, setActiveTab] = useState('hub');
  useSupabaseSync();

  return (
    <div className="min-h-screen flex flex-col bg-ocean-900 text-slate-100 font-body">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'hub' && <HomeHub setActiveTab={setActiveTab} />}
        {activeTab === 'checkin' && <MoodCheckIn />}
        {activeTab === 'breathing' && <BreathingVisualizer />}
        {activeTab === 'beliefs' && <ReframeThoughts />}
        {activeTab === 'friends' && <SocialCircle />}
        {activeTab === 'resources' && <ResourceHub />}
        {activeTab === 'growth' && <GrowthDashboard />}
      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Sisu Health & Wellness • Built with React & Supabase</span>
          <span className="text-seafoam-400 font-medium">Empowering growth, one wave at a time.</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WellnessProvider>
        <MainContent />
      </WellnessProvider>
    </AuthProvider>
  );
}
