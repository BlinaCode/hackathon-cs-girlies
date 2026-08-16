import React, { useState } from 'react';
import { Flame, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWellness } from '../context/WellnessContext';
import { AuthModal } from './AuthModal';

export function Header({ activeTab, setActiveTab }) {
  const { user, isGuestMode, logout } = useAuth();
  const { breathingStreak, isSkyMode, setThemeMode, isAudioPlaying, toggleAudio } = useWellness();

  const [showAuthModal, setShowAuthModal] = useState(false);

  const navItems = [
    { id: 'checkin', label: 'Check-In', icon: '🌊' },
    { id: 'breathing', label: 'Breathing', icon: '💨' },
    { id: 'beliefs', label: 'Reframe', icon: '🧠' },
    { id: 'friends', label: 'Circle', icon: '🫂' },
    { id: 'resources', label: 'Library', icon: '📖' },
    { id: 'growth', label: 'Growth', icon: '🌱' }
  ];

  return (
    <>
      <header className={`p-4 sticky top-0 z-50 border-b backdrop-blur-xl transition-all ${isSkyMode ? 'bg-white/80 border-bluey-200/80 shadow-sm' : 'bg-bluey-950/90 border-bluey-800 shadow-md'}`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('hub')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-bluey-400 to-bluey-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-bluey-400/30 transform hover:scale-105 transition-all">
              🦦
            </div>
            <div>
              <span className={`font-display font-bold text-xl block leading-tight ${isSkyMode ? 'text-bluey-950' : 'text-white'}`}>Sisu</span>
              <span className={`text-[10px] block font-semibold tracking-wide ${isSkyMode ? 'text-bluey-600' : 'text-bluey-300'}`}>Zen Beach Companion</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navItems.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 ${activeTab === t.id
                  ? 'bg-bluey-500 text-white shadow-md shadow-bluey-500/30'
                  : (isSkyMode ? 'text-bluey-800 hover:bg-bluey-100/80' : 'text-bluey-200 hover:bg-bluey-800/60')
                  }`}
              >
                <span>{t.icon}</span>
                <span className="hidden lg:inline">{t.label}</span>
              </button>
            ))}
          </nav>

          {/* Action Icons & User Profile */}
          <div className="flex items-center gap-2">
            {/* Audio Soundscape Toggle */}
            <button
              onClick={toggleAudio}
              title="Toggle Ocean Waves Sound"
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${isAudioPlaying
                ? 'bg-bluey-500 border-bluey-600 text-white shadow-md'
                : (isSkyMode ? 'bg-cream-100 border-cream-300 text-bluey-900 hover:bg-cream-200' : 'bg-bluey-900 border-bluey-700 text-bluey-100 hover:bg-bluey-800')
                }`}
            >
              <span>{isAudioPlaying ? '🔊 Waves' : '🌊 Sound'}</span>
            </button>

            {/* Day / Night Theme Toggle */}
            <button
              onClick={() => setThemeMode(isSkyMode ? 'night' : 'sky')}
              title="Toggle Beach Day / Coastal Night Theme"
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${isSkyMode ? 'bg-bluey-100 border-bluey-300 text-bluey-950 hover:bg-bluey-200' : 'bg-bluey-900 border-bluey-700 text-bluey-100 hover:bg-bluey-800'
                }`}
            >
              <span>{isSkyMode ? '🌤️ Day' : '🌙 Night'}</span>
            </button>

            {/* Streak Counter */}
            <div className="hidden lg:flex text-xs px-3 py-1.5 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-700 dark:text-amber-300 font-bold items-center gap-1.5">
              <span>🔥</span> {breathingStreak.count} Streak
            </div>

            {/* User Auth / Guest Status */}
            {isGuestMode ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all shadow-md ${isSkyMode ? 'bg-bluey-500 text-white shadow-bluey-500/20 hover:bg-bluey-400' : 'bg-bluey-600 text-white shadow-bluey-700/20 hover:bg-bluey-500'}`}
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className={`text-[10px] hidden sm:inline font-bold ${isSkyMode ? 'text-bluey-800' : 'text-bluey-300'}`}>
                  {user?.email?.split('@')[0]}
                </span>
                <button
                  onClick={logout}
                  className={`p-1.5 rounded-lg transition-colors ${isSkyMode ? 'text-bluey-500 hover:text-rose-500 hover:bg-rose-50' : 'text-bluey-400 hover:text-rose-400 hover:bg-bluey-800'}`}
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className="md:hidden flex overflow-x-auto mt-2 py-2 gap-1 border-t border-bluey-200/40 no-scrollbar">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === item.id
                  ? 'bg-bluey-500 text-white font-bold'
                  : (isSkyMode ? 'bg-bluey-100/50 text-bluey-800 hover:bg-bluey-200' : 'bg-bluey-800/80 text-bluey-200 hover:bg-bluey-700')
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
}
