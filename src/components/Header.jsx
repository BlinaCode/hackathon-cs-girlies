import React, { useState } from 'react';
import {
  LogOut,
  ChevronDown,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Menu,
  X
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useWellness } from '../context/WellnessContext';
import { AuthModal } from './AuthModal';
import { SoundscapePlayer } from './SoundscapePlayer';
import { useSoundscape } from '../hooks/useSoundscape';

export function Header({ activeTab, setActiveTab }) {
  const { user, isGuestMode, logout } = useAuth();
  const { isSkyMode, setThemeMode } = useWellness();

  const {
    activeTrack,
    volume,
    setVolume,
    toggleTrack,
    stopAll,
    sleepTimer,
    setSleepTimer,
    timeRemaining
  } = useSoundscape();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSoundscape, setShowSoundscape] = useState(false);

  const isSoundscapePlaying = activeTrack !== null;

  const handleNav = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const headerBgClass =
    activeTab === 'hub'
      ? 'fixed w-full top-0 left-0 right-0 bg-white/60 backdrop-blur-md border-b border-white/20 text-slate-900'
      : isSkyMode
        ? 'sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 text-slate-900'
        : 'sticky top-0 bg-bluey-950/90 backdrop-blur-xl border-b border-bluey-800 text-slate-100';

  const textColor =
    activeTab === 'hub' || isSkyMode
      ? 'text-slate-800'
      : 'text-slate-200';

  const textHoverColor =
    activeTab === 'hub' || isSkyMode
      ? 'hover:text-slate-500'
      : 'hover:text-white';

  const soundscapeProps = {
    activeTrack,
    volume,
    setVolume,
    toggleTrack,
    stopAll,
    sleepTimer,
    setSleepTimer,
    timeRemaining
  };

  return (
    <>
      <header className={`z-50 transition-all py-4 ${headerBgClass}`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 items-center">

          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group justify-self-start"
            onClick={() => handleNav('hub')}
          >
            <span
              className={`font-display font-bold text-xl tracking-tight transition-all ${textColor}`}
            >
              Sisu
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 justify-self-center">

            <button
              onClick={() => handleNav('hub')}
              className={`text-sm font-bold transition-colors ${textColor} ${textHoverColor}`}
            >
              Home
            </button>

            {/* Practice */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1 text-sm font-bold transition-colors py-2 ${textColor} ${textHoverColor}`}
              >
                Practice
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                <div className="py-2 flex flex-col">

                  <button
                    onClick={() => handleNav('checkin')}
                    className="text-left px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    Check in
                  </button>

                  <button
                    onClick={() => handleNav('beliefs')}
                    className="text-left px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    Reframe
                  </button>

                  <button
                    onClick={() => handleNav('friends')}
                    className="text-left px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    Social Circle
                  </button>

                </div>
              </div>
            </div>

            {/* Connect */}
            <button
              onClick={() => handleNav('connect')}
              className={`text-sm font-bold transition-colors ${textColor} ${textHoverColor}`}
            >
              Connect
            </button>

            {/* Feeling down */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1 text-sm font-bold transition-colors py-2 whitespace-nowrap ${textColor} ${textHoverColor}`}
              >
                Feeling down?
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                <div className="py-2 flex flex-col">

                  <button
                    onClick={() => handleNav('resources')}
                    className="text-left px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    Mental health resources in your country
                  </button>

                  <button
                    onClick={() => handleNav('breathing')}
                    className="text-left px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    Breathing technique
                  </button>

                  <button
                    onClick={() => handleNav('54321')}
                    className="text-left px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    5 4 3 2 1
                  </button>

                </div>
              </div>
            </div>

            {/* About */}
            <button
              onClick={() => handleNav('about')}
              className={`text-sm font-bold transition-colors ${textColor} ${textHoverColor}`}
            >
              About
            </button>
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4 justify-self-end">

            {/* Soundscape + Theme */}
            <div className="flex items-center gap-1 mr-2 relative">

              <button
                onClick={() => setShowSoundscape((prev) => !prev)}
                title={
                  isSoundscapePlaying
                    ? 'Soundscape playing'
                    : 'Soundscape off'
                }
                className={`p-1.5 rounded-full transition-colors opacity-70 hover:opacity-100 ${textColor}`}
              >
                {isSoundscapePlaying ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>

              {showSoundscape && (
                <div className="absolute top-full right-0 mt-3 z-[100]">
                  <SoundscapePlayer
                    {...soundscapeProps}
                    onClose={() => setShowSoundscape(false)}
                  />
                </div>
              )}

              {/* Theme */}
              <button
                onClick={() =>
                  setThemeMode(isSkyMode ? 'night' : 'sky')
                }
                title="Toggle Day/Night"
                className={`p-1.5 rounded-full transition-colors opacity-70 hover:opacity-100 ${textColor}`}
              >
                {isSkyMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

            </div>

            {/* Auth */}
            {isGuestMode ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:scale-105 transition-all"
              >
                Sign In
              </button>
            ) : (
              <div className="relative group">

                <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all">
                  <span className="truncate max-w-[100px]">
                    {user?.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                  <div className="py-2 flex flex-col">

                    <button
                      onClick={() => handleNav('growth')}
                      className="flex items-center gap-2 text-left px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      🌱 Growth
                    </button>

                    <button
                      onClick={logout}
                      className="flex items-center gap-2 text-left px-5 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>

                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center justify-self-end">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg ${textColor}`}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl overflow-hidden text-slate-800">

            <div className="flex flex-col p-4 max-h-[80vh] overflow-y-auto">

              <button
                onClick={() => handleNav('hub')}
                className="text-left py-3 px-4 font-medium border-b border-slate-50"
              >
                Home
              </button>

              <div className="py-2 px-4 border-b border-slate-50">
                <div className="font-semibold text-xs text-slate-400 uppercase tracking-wider mb-2 mt-2">
                  Practice
                </div>

                <div className="flex flex-col ml-2 space-y-1">

                  <button
                    onClick={() => handleNav('checkin')}
                    className="text-left py-2 px-2 text-sm text-slate-600"
                  >
                    Check in
                  </button>

                  <button
                    onClick={() => handleNav('beliefs')}
                    className="text-left py-2 px-2 text-sm text-slate-600"
                  >
                    Reframe
                  </button>

                  <button
                    onClick={() => handleNav('friends')}
                    className="text-left py-2 px-2 text-sm text-slate-600"
                  >
                    Social Circle
                  </button>

                </div>
              </div>

              <button
                onClick={() => handleNav('connect')}
                className="text-left py-3 px-4 font-medium border-b border-slate-50"
              >
                Connect
              </button>

              <div className="py-2 px-4 border-b border-slate-50">
                <div className="font-semibold text-xs text-slate-400 uppercase tracking-wider mb-2 mt-2">
                  Feeling down?
                </div>

                <div className="flex flex-col ml-2 space-y-1">

                  <button
                    onClick={() => handleNav('resources')}
                    className="text-left py-2 px-2 text-sm text-slate-600"
                  >
                    Mental health resources in your country
                  </button>

                  <button
                    onClick={() => handleNav('breathing')}
                    className="text-left py-2 px-2 text-sm text-slate-600"
                  >
                    Breathing technique
                  </button>

                  <button
                    onClick={() => handleNav('54321')}
                    className="text-left py-2 px-2 text-sm text-slate-600"
                  >
                    5 4 3 2 1
                  </button>

                </div>
              </div>

              <button
                onClick={() => handleNav('about')}
                className="text-left py-3 px-4 font-medium border-b border-slate-50"
              >
                About
              </button>

              {/* Mobile Controls */}
              <div className="flex items-center justify-between py-4 px-4 mt-2 bg-slate-50 rounded-xl">

                <div className="flex items-center gap-3">

                  <button
                    onClick={() => setShowSoundscape((prev) => !prev)}
                    className="p-2 bg-white rounded-full shadow-sm text-slate-600"
                    title={
                      isSoundscapePlaying
                        ? 'Soundscape playing'
                        : 'Soundscape off'
                    }
                  >
                    {isSoundscapePlaying ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() =>
                      setThemeMode(isSkyMode ? 'night' : 'sky')
                    }
                    className="p-2 bg-white rounded-full shadow-sm text-slate-600"
                  >
                    {isSkyMode ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                  </button>

                </div>

                {isGuestMode ? (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-5 py-2 rounded-full bg-slate-900 text-white text-sm font-bold"
                  >
                    Sign In
                  </button>
                ) : (
                  <div className="flex items-center gap-2">

                    <button
                      onClick={() => handleNav('growth')}
                      className="text-sm font-bold text-slate-700"
                    >
                      Growth
                    </button>

                    <button
                      onClick={logout}
                      className="p-2 text-rose-500"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>

                  </div>
                )}

              </div>

              {/* Mobile Soundscape */}
              {showSoundscape && (
                <div className="mt-3 flex justify-center">
                  <SoundscapePlayer
                    {...soundscapeProps}
                    onClose={() => setShowSoundscape(false)}
                  />
                </div>
              )}

            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
}