import { useState, useEffect } from 'react';
import { soundscapeSynth } from '../services/audioSynth';

const VOLUME_STORAGE_KEY = 'sisu_soundscape_volume';

const parseStoredVolume = () => {
  try {
    const saved = localStorage.getItem(VOLUME_STORAGE_KEY);
    if (saved === null) return 0.4;
    const parsed = Number(saved);
    if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 1) {
      return parsed;
    }
    return 0.4;
  } catch {
    return 0.4;
  }
};

export function useSoundscape() {
  const [activeTrack, setActiveTrack] = useState(null); // 'waves', 'rain', 'stream' or null
  const [volume, setVolumeState] = useState(parseStoredVolume);

  const [sleepTimer, setSleepTimerState] = useState(null); // null | 5 | 15 | 30 (in minutes)
  const [endTime, setEndTime] = useState(null); // target epoch timestamp (ms) or null
  const [timeRemaining, setTimeRemaining] = useState(null); // seconds remaining or null

  const setVolume = (val) => {
    const clamped = Math.max(0, Math.min(1, Number.isFinite(val) ? val : 0.4));
    setVolumeState(clamped);
    try {
      localStorage.setItem(VOLUME_STORAGE_KEY, String(clamped));
    } catch (e) {
      console.warn('Could not save volume to localStorage', e);
    }
  };

  useEffect(() => {
    soundscapeSynth.setVolume(volume);
  }, [volume]);

  // Set or change sleep timer preset: intentionally sets/replaces target endTime
  const setSleepTimer = (minutes) => {
    if (!minutes) {
      setSleepTimerState(null);
      setEndTime(null);
      setTimeRemaining(null);
    } else {
      setSleepTimerState(minutes);
      const targetEnd = Date.now() + minutes * 60 * 1000;
      setEndTime(targetEnd);
      setTimeRemaining(minutes * 60);
    }
  };

  // Countdown timer effect: calculates remaining seconds from target endTime
  useEffect(() => {
    if (!activeTrack || !endTime) {
      setTimeRemaining(null);
      return;
    }

    // Immediately calculate seconds remaining to target endTime
    const initialSeconds = Math.ceil((endTime - Date.now()) / 1000);
    if (initialSeconds <= 0) {
      soundscapeSynth.stop();
      setActiveTrack(null);
      setSleepTimerState(null);
      setEndTime(null);
      setTimeRemaining(null);
      return;
    }
    setTimeRemaining(initialSeconds);

    const interval = setInterval(() => {
      const secondsLeft = Math.ceil((endTime - Date.now()) / 1000);
      if (secondsLeft <= 0) {
        clearInterval(interval);
        soundscapeSynth.stop();
        setActiveTrack(null);
        setSleepTimerState(null);
        setEndTime(null);
        setTimeRemaining(null);
      } else {
        setTimeRemaining(secondsLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTrack, endTime]);

  const toggleTrack = (trackId) => {
    if (activeTrack === trackId) {
      soundscapeSynth.stop();
      setActiveTrack(null);
      setSleepTimerState(null);
      setEndTime(null);
      setTimeRemaining(null);
    } else {
      soundscapeSynth.playTrack(trackId);
      setActiveTrack(trackId);
      // Preserves existing endTime if a timer is already running
    }
  };

  const stopAll = () => {
    soundscapeSynth.stop();
    setActiveTrack(null);
    setSleepTimerState(null);
    setEndTime(null);
    setTimeRemaining(null);
  };

  return {
    activeTrack,
    volume,
    setVolume,
    toggleTrack,
    stopAll,
    sleepTimer,
    setSleepTimer,
    timeRemaining
  };
}
