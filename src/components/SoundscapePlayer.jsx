import React from 'react';
import {
  Volume2,
  Waves,
  CloudRain,
  Droplets,
  X,
  Clock
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';

export function SoundscapePlayer({
  onClose,
  activeTrack,
  volume,
  setVolume,
  toggleTrack,
  stopAll,
  sleepTimer,
  setSleepTimer,
  timeRemaining
}) {
  const { isSkyMode } = useWellness();
  const tracks = [
    {
      id: 'waves',
      label: 'Ocean Waves',
      icon: <Waves className="w-4 h-4 text-seafoam-400" />
    },
    {
      id: 'rain',
      label: 'Gentle Rain',
      icon: <CloudRain className="w-4 h-4 text-sky-400" />
    },
    {
      id: 'stream',
      label: 'Soft Stream',
      icon: <Droplets className="w-4 h-4 text-teal-400" />
    }
  ];

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) {
      return '';
    }

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isPlaying = activeTrack !== null;

  return (
    <div className={`w-72 rounded-2xl p-4 shadow-2xl space-y-4 backdrop-blur-xl border animate-in fade-in slide-in-from-top-2 transition-all ${isSkyMode ? 'bg-white border-bluey-200' : 'bg-slate-900 border-slate-700/90'}`}>

      {/* Header */}
      <div className={`flex items-center justify-between border-b pb-2 ${isSkyMode ? 'border-bluey-100' : 'border-slate-800'}`}>
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-seafoam-500">
          <Volume2 className="w-4 h-4" />
          <span>Ambient Sea Audio</span>
        </div>

        <button
          onClick={onClose}
          className={`p-1 rounded-lg transition-colors ${isSkyMode ? 'text-bluey-500 hover:text-bluey-900' : 'text-slate-400 hover:text-slate-100'}`}
          aria-label="Close soundscape"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Sound Tracks */}
      <div className="space-y-2">
        {tracks.map((track) => (
          <button
            key={track.id}
            onClick={() => toggleTrack(track.id)}
            className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-medium transition-all ${
              activeTrack === track.id
                ? 'border-seafoam-500 bg-seafoam-500/15 text-seafoam-600'
                : isSkyMode
                  ? 'border-bluey-100 bg-bluey-50 text-bluey-800 hover:border-bluey-300'
                  : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              {track.icon}
              <span>{track.label}</span>
            </div>

            {activeTrack === track.id && (
              <span className="w-2 h-2 rounded-full bg-seafoam-400 animate-ping" />
            )}
          </button>
        ))}
      </div>

      {/* On / Off */}
      <div className={`border-t pt-3 ${isSkyMode ? 'border-bluey-100' : 'border-slate-800/80'}`}>
        <button
          onClick={stopAll}
          disabled={!isPlaying}
          className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
            !isPlaying
              ? isSkyMode ? 'bg-bluey-50 text-bluey-300 cursor-default' : 'bg-slate-800/40 text-slate-600 cursor-default'
              : 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20'
          }`}
        >
          Turn Sound Off
        </button>
      </div>

      {/* Volume */}
      <div className="space-y-1 pt-1">
        <div className={`flex justify-between items-center text-[11px] ${isSkyMode ? 'text-bluey-600' : 'text-slate-400'}`}>
          <span>Volume</span>
          <span>{Math.round(volume * 100)}%</span>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-seafoam-500 ${isSkyMode ? 'bg-bluey-100' : 'bg-slate-800'}`}
        />
      </div>

      {/* Sleep Timer */}
      <div className={`space-y-1.5 pt-2 border-t ${isSkyMode ? 'border-bluey-100' : 'border-slate-800/80'}`}>
        <div className={`flex justify-between items-center text-[11px] ${isSkyMode ? 'text-bluey-600' : 'text-slate-400'}`}>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-seafoam-500" />
            Sleep Timer
          </span>

          {timeRemaining !== null && (
            <span className="font-semibold text-seafoam-500">
              {formatTime(timeRemaining)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-4 gap-1">
          {[
            { value: null, label: 'Off' },
            { value: 5, label: '5m' },
            { value: 15, label: '15m' },
            { value: 30, label: '30m' }
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => setSleepTimer(preset.value)}
              className={`py-1 rounded-lg text-[10px] font-semibold transition-all ${
                sleepTimer === preset.value
                  ? 'bg-seafoam-500/20 text-seafoam-600 border border-seafoam-500/40'
                  : isSkyMode
                    ? 'bg-bluey-50 text-bluey-500 hover:text-bluey-800 border border-bluey-100'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}