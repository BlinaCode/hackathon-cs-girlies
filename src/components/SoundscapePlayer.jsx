import React from 'react';
import { Volume2, VolumeX, Waves, CloudRain, Droplets, X } from 'lucide-react';
import { useSoundscape } from '../hooks/useSoundscape';

export function SoundscapePlayer({ onClose }) {
  const { activeTrack, volume, setVolume, toggleTrack, stopAll } = useSoundscape();

  const tracks = [
    { id: 'waves', label: 'Ocean Waves', icon: <Waves className="w-4 h-4 text-seafoam-400" /> },
    { id: 'rain', label: 'Gentle Rain', icon: <CloudRain className="w-4 h-4 text-sky-400" /> },
    { id: 'stream', label: 'Soft Stream', icon: <Droplets className="w-4 h-4 text-teal-400" /> }
  ];

  return (
    <div className="w-72 bg-slate-900 border border-slate-700/90 rounded-2xl p-4 shadow-2xl space-y-4 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-seafoam-400">
          <Volume2 className="w-4 h-4" />
          <span>Ambient Sea Audio</span>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-100 rounded-lg">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {tracks.map(t => (
          <button
            key={t.id}
            onClick={() => toggleTrack(t.id)}
            className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-medium transition-all ${
              activeTrack === t.id
                ? 'border-seafoam-500 bg-seafoam-500/15 text-seafoam-300'
                : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              {t.icon}
              <span>{t.label}</span>
            </div>
            {activeTrack === t.id && (
              <span className="w-2 h-2 rounded-full bg-seafoam-400 animate-ping" />
            )}
          </button>
        ))}
      </div>

      {/* Volume slider */}
      <div className="space-y-1 pt-1">
        <div className="flex justify-between items-center text-[11px] text-slate-400">
          <span>Volume</span>
          <span>{Math.round(volume * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-seafoam-500"
        />
      </div>

      {activeTrack && (
        <button
          onClick={stopAll}
          className="w-full py-1.5 text-center text-[11px] font-semibold text-rose-400 hover:text-rose-300 flex items-center justify-center gap-1"
        >
          <VolumeX className="w-3.5 h-3.5" />
          Mute All Audio
        </button>
      )}
    </div>
  );
}
