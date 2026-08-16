import React, { useState } from 'react';
import {
  LogOut,
  ChevronDown,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Menu,
  X,
  User
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
      ? `fixed w-full top-0 left-0 right-0 backdrop-blur-md ${isSkyMode ? 'bg-white/60 border-b border-white/20 text-slate-900' : 'bg-midnight-950/60 text-midnight-text border-b border-transparent shadow-sm shadow-black/10'}`
      : `sticky top-0 backdrop-blur-xl ${isSkyMode ? 'bg-white/80 border-b border-slate-100 text-slate-900' : 'bg-midnight-900/90 text-midnight-text border-b border-transparent shadow-sm shadow-black/20'}`;

  const textColor = isSkyMode ? 'text-slate-800' : 'text-midnight-text';

  const textHoverColor = isSkyMode ? 'hover:text-slate-500' : 'hover:text-white';

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

              <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 rounded-2xl shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden ${isSkyMode ? 'bg-white border-slate-100' : 'bg-midnight-900 border-midnight-800'}`}>
                <div className="py-2 flex flex-col">

                  <button
                    onClick={() => handleNav('checkin')}
                    className={`text-left px-5 py-2.5 text-sm font-bold transition-colors ${isSkyMode ? 'text-slate-700 hover:bg-slate-50 hover:text-slate-900' : 'text-midnight-text hover:bg-midnight-800'}`}
                  >
                    Check in
                  </button>

                  <button
                    onClick={() => handleNav('beliefs')}
                    className={`text-left px-5 py-2.5 text-sm font-bold transition-colors ${isSkyMode ? 'text-slate-700 hover:bg-slate-50 hover:text-slate-900' : 'text-midnight-text hover:bg-midnight-800'}`}
                  >
                    Reframe
                  </button>

                  <button
                    onClick={() => handleNav('friends')}
                    className={`text-left px-5 py-2.5 text-sm font-bold transition-colors ${isSkyMode ? 'text-slate-700 hover:bg-slate-50 hover:text-slate-900' : 'text-midnight-text hover:bg-midnight-800'}`}
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

              <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 rounded-2xl shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden ${isSkyMode ? 'bg-white border-slate-100' : 'bg-midnight-900 border-midnight-800'}`}>
                <div className="py-2 flex flex-col">

                  <button
                    onClick={() => handleNav('resources')}
                    className={`text-left px-5 py-2.5 text-sm font-bold transition-colors ${isSkyMode ? 'text-slate-700 hover:bg-slate-50 hover:text-slate-900' : 'text-midnight-text hover:bg-midnight-800'}`}
                  >
                    Mental health resources in your country
                  </button>

                  <button
                    onClick={() => handleNav('breathing')}
                    className={`text-left px-5 py-2.5 text-sm font-bold transition-colors ${isSkyMode ? 'text-slate-700 hover:bg-slate-50 hover:text-slate-900' : 'text-midnight-text hover:bg-midnight-800'}`}
                  >
                    Breathing technique
                  </button>

                  <button
                    onClick={() => handleNav('54321')}
                    className={`text-left px-5 py-2.5 text-sm font-bold transition-colors ${isSkyMode ? 'text-slate-700 hover:bg-slate-50 hover:text-slate-900' : 'text-midnight-text hover:bg-midnight-800'}`}
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

                <div className={`absolute top-full right-0 mt-2 w-48 rounded-2xl shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden ${isSkyMode ? 'bg-white border-slate-100' : 'bg-midnight-900 border-midnight-800'}`}>
                  <div className="py-2 flex flex-col">

                    <button
                      onClick={() => handleNav('growth')}
                      className={`flex items-center gap-2 text-left px-5 py-2.5 text-sm transition-colors ${isSkyMode ? 'text-slate-700 hover:bg-slate-50 hover:text-slate-900' : 'text-midnight-text hover:bg-midnight-800'}`}
                    >
                      🌱 Growth
                    </button>

                    <button
                      onClick={() => handleNav('account')}
                      className={`flex items-center gap-2 text-left px-5 py-2.5 text-sm transition-colors ${isSkyMode ? 'text-slate-700 hover:bg-slate-50 hover:text-slate-900' : 'text-midnight-text hover:bg-midnight-800'}`}
                    >
                      <User className="w-4 h-4" />
                      Account
                    </button>

                    <button
                      onClick={logout}
                      className={`flex items-center gap-2 text-left px-5 py-2.5 text-sm transition-colors ${isSkyMode ? 'text-rose-600 hover:bg-rose-50' : 'text-blush-400 hover:bg-midnight-800'}`}
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
          <div className={`md:hidden absolute top-full left-0 right-0 border-b shadow-xl overflow-hidden ${isSkyMode ? 'bg-white border-slate-100 text-slate-800' : 'bg-midnight-950 border-midnight-800 text-midnight-text'}`}>

            <div className="flex flex-col p-4 max-h-[80vh] overflow-y-auto">

              <button
                onClick={() => handleNav('hub')}
                className={`text-left py-3 px-4 font-medium border-b ${isSkyMode ? 'border-slate-50' : 'border-midnight-800'}`}
              >
                Home
              </button>

              <div className={`py-2 px-4 border-b ${isSkyMode ? 'border-slate-50' : 'border-midnight-800'}`}>
                <div className={`font-semibold text-xs uppercase tracking-wider mb-2 mt-2 ${isSkyMode ? 'text-slate-400' : 'text-midnight-muted'}`}>
                  Practice
                </div>

                <div className="flex flex-col ml-2 space-y-1">

                  <button
                    onClick={() => handleNav('checkin')}
                    className={`text-left py-2 px-2 text-sm ${isSkyMode ? 'text-slate-600' : 'text-midnight-text/90'}`}
                  >
                    Check in
                  </button>

                  <button
                    onClick={() => handleNav('beliefs')}
                    className={`text-left py-2 px-2 text-sm ${isSkyMode ? 'text-slate-600' : 'text-midnight-text/90'}`}
                  >
                    Reframe
                  </button>

                  <button
                    onClick={() => handleNav('friends')}
                    className={`text-left py-2 px-2 text-sm ${isSkyMode ? 'text-slate-600' : 'text-midnight-text/90'}`}
                  >
                    Social Circle
                  </button>

                </div>
              </div>

              <button
                onClick={() => handleNav('connect')}
                className={`text-left py-3 px-4 font-medium border-b ${isSkyMode ? 'border-slate-50' : 'border-midnight-800'}`}
              >
                Connect
              </button>

              <div className={`py-2 px-4 border-b ${isSkyMode ? 'border-slate-50' : 'border-midnight-800'}`}>
                <div className={`font-semibold text-xs uppercase tracking-wider mb-2 mt-2 ${isSkyMode ? 'text-slate-400' : 'text-midnight-muted'}`}>
                  Feeling down?
                </div>

                <div className="flex flex-col ml-2 space-y-1">

                  <button
                    onClick={() => handleNav('resources')}
                    className={`text-left py-2 px-2 text-sm ${isSkyMode ? 'text-slate-600' : 'text-midnight-text/90'}`}
                  >
                    Mental health resources in your country
                  </button>

                  <button
                    onClick={() => handleNav('breathing')}
                    className={`text-left py-2 px-2 text-sm ${isSkyMode ? 'text-slate-600' : 'text-midnight-text/90'}`}
                  >
                    Breathing technique
                  </button>

                  <button
                    onClick={() => handleNav('54321')}
                    className={`text-left py-2 px-2 text-sm ${isSkyMode ? 'text-slate-600' : 'text-midnight-text/90'}`}
                  >
                    5 4 3 2 1
                  </button>

                </div>
              </div>

              <button
                onClick={() => handleNav('about')}
                className={`text-left py-3 px-4 font-medium border-b ${isSkyMode ? 'border-slate-50' : 'border-midnight-800'}`}
              >
                About
              </button>

              {/* Mobile Controls */}
              <div className={`flex items-center justify-between py-4 px-4 mt-2 rounded-xl ${isSkyMode ? 'bg-slate-50' : 'bg-midnight-900'}`}>

                <div className="flex items-center gap-3">

                  <button
                    onClick={() => setShowSoundscape((prev) => !prev)}
                    className={`p-2 rounded-full shadow-sm ${isSkyMode ? 'bg-white text-slate-600' : 'bg-midnight-800 text-midnight-text'}`}
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
                    className={`p-2 rounded-full shadow-sm ${isSkyMode ? 'bg-white text-slate-600' : 'bg-midnight-800 text-midnight-text'}`}
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
                      className={`text-sm font-bold ${isSkyMode ? 'text-slate-700' : 'text-midnight-text'}`}
                    >
                      Growth
                    </button>

                    <button
                      onClick={() => handleNav('account')}
                      className={`text-sm font-bold ${isSkyMode ? 'text-slate-700' : 'text-midnight-text'}`}
                    >
                      Account
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
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => { setShowAuthModal(false); setActiveTab('hub'); }}
        />
      )}
    </>
  );
}