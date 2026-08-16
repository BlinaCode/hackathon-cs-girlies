import React, { useState } from 'react';
import { Flame, Waves, User, LogOut, Volume2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWellness } from '../context/WellnessContext';
import { AuthModal } from './AuthModal';
import { SoundscapePlayer } from './SoundscapePlayer';

export function Header({ activeTab, setActiveTab }) {
  const { user, isGuestMode, logout } = useAuth();
  const { breathingStreak } = useWellness();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSoundscape, setShowSoundscape] = useState(false);

  const navItems = [
    { id: 'hub', label: 'Home Hub' },
    { id: 'checkin', label: 'Mood Check-In' },
    { id: 'breathing', label: 'Ocean Breathing' },
    { id: 'beliefs', label: 'Reframe Thoughts' },
    { id: 'friends', label: 'Friend Circle' },
    { id: 'resources', label: 'Resource Library' },
    { id: 'growth', label: 'Growth & Analytics' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ocean-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <button
            onClick={() => setActiveTab('hub')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-seafoam-500 to-teal-300 flex items-center justify-center text-2xl shadow-lg shadow-seafoam-500/20 group-hover:scale-105 transition-transform">
              🦦
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-slate-100 flex items-center gap-1.5">
                Sisu
                <span className="text-xs px-2 py-0.5 rounded-full bg-seafoam-500/10 text-seafoam-400 border border-seafoam-500/20 font-sans font-medium">
                  Wellness
                </span>
              </span>
              <p className="text-[10px] text-slate-400 font-sans tracking-wide">
                Inner strength & ocean calm
              </p>
            </div>
          </button>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-seafoam-500/15 text-seafoam-400 border border-seafoam-500/30'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Icons & User Profile */}
          <div className="flex items-center gap-3">
            
            {/* Ambient Soundscape Toggle Button */}
            <button
              onClick={() => setShowSoundscape(prev => !prev)}
              className="p-2 rounded-lg text-slate-300 hover:text-seafoam-400 hover:bg-slate-800 transition-colors relative"
              title="Ambient Sea Soundscapes"
              aria-label="Toggle ambient soundscapes"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span>{breathingStreak.count} Day Streak</span>
            </div>

            {/* User Auth / Guest Status */}
            {isGuestMode ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-seafoam-500 text-ocean-950 font-medium text-xs hover:bg-seafoam-400 transition-all shadow-md shadow-seafoam-500/20"
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 hidden sm:inline font-medium">
                  {user?.email?.split('@')[0]}
                </span>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className="md:hidden flex overflow-x-auto py-2 gap-1 border-t border-slate-800/60 no-scrollbar">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === item.id
                  ? 'bg-seafoam-500 text-ocean-950 font-semibold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Soundscape Audio Control Drawer */}
      <div className={`absolute top-16 right-4 sm:right-8 z-50 ${showSoundscape ? 'block' : 'hidden'}`}>
        <SoundscapePlayer onClose={() => setShowSoundscape(false)} />
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </header>
  );
}
