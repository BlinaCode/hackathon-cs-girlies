// Web Audio API ambient soundscape generator
class SoundscapeSynth {
  constructor() {
    this.ctx = null;
    this.activeNodes = [];
    this.isPlaying = false;
    this.currentTrack = null;
    this.gainNode = null;
    this.volume = 0.5;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.gainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(vol) {
    this.volume = vol;
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  stop() {
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // ignore node cleanup errors
      }
    });
    this.activeNodes = [];
    this.isPlaying = false;
    this.currentTrack = null;
  }

  playTrack(trackId) {
    this.init();
    if (!this.ctx) return;

    this.stop();
    this.isPlaying = true;
    this.currentTrack = trackId;

    if (trackId === 'waves') {
      this.createOceanWaves();
    } else if (trackId === 'rain') {
      this.createGentleRain();
    } else if (trackId === 'stream') {
      this.createSoftStream();
    }
  }

  createPinkNoiseBuffer() {
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  createOceanWaves() {
    const noiseBuffer = this.createPinkNoiseBuffer();
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Filter for deep ocean rumble
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);

    // Wave swell LFO
    const waveLfo = this.ctx.createOscillator();
    waveLfo.type = 'sine';
    waveLfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // 8-second wave cycle

    const waveGain = this.ctx.createGain();
    waveGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

    waveLfo.connect(filter.frequency);
    noise.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.gainNode);

    noise.start();
    waveLfo.start();

    this.activeNodes.push(noise, waveLfo, filter, waveGain);
  }

  createGentleRain() {
    const noiseBuffer = this.createPinkNoiseBuffer();
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.gainNode);

    noise.start();
    this.activeNodes.push(noise, filter, rainGain);
  }

  createSoftStream() {
    const noiseBuffer = this.createPinkNoiseBuffer();
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);

    const streamGain = this.ctx.createGain();
    streamGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(streamGain);
    streamGain.connect(this.gainNode);

    noise.start();
    this.activeNodes.push(noise, filter, streamGain);
  }
}

export const soundscapeSynth = new SoundscapeSynth();
