import { useState, useEffect } from 'react';
import { soundscapeSynth } from '../services/audioSynth';

export function useSoundscape() {
  const [activeTrack, setActiveTrack] = useState(null); // 'waves', 'rain', 'stream' or null
  const [volume, setVolume] = useState(0.4);

  useEffect(() => {
    soundscapeSynth.setVolume(volume);
  }, [volume]);

  const toggleTrack = (trackId) => {
    if (activeTrack === trackId) {
      soundscapeSynth.stop();
      setActiveTrack(null);
    } else {
      soundscapeSynth.playTrack(trackId);
      setActiveTrack(trackId);
    }
  };

  const stopAll = () => {
    soundscapeSynth.stop();
    setActiveTrack(null);
  };

  return {
    activeTrack,
    volume,
    setVolume,
    toggleTrack,
    stopAll
  };
}
