// Premium Web Audio API Tactile Sound Synthesizer for SylloTrack
// Inspired by macOS / iOS / Linear subtle haptic & UI audio design.

class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;

    try {
      const saved = localStorage.getItem('syllotrack_sound_enabled');
      if (saved !== null) {
        this.soundEnabled = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read sound preferences:', e);
    }
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    try {
      localStorage.setItem('syllotrack_sound_enabled', JSON.stringify(enabled));
    } catch (e) {
      console.warn('Could not save sound preferences:', e);
    }
  }

  toggleSound() {
    this.setSoundEnabled(!this.soundEnabled);
    if (this.soundEnabled) {
      this.playClick();
    }
    return this.soundEnabled;
  }

  // 1. Tactile Micro-Click (Subtle macOS / iOS Haptic Tap)
  playClick() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Soft damped sine tap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.012);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.015);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // 2. Theme Toggle (Warm Subtle Ambient Harmonic)
  playThemeToggle(isDark) {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const startFreq = isDark ? 440 : 660;
      const endFreq = isDark ? 660 : 440;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.08);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // 3. Topic Check / Completion (Satisfying Glass Tap / Soft Chime)
  playCheck(isCompleted = true) {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      if (isCompleted) {
        // High-end dual glass tap (E5 -> B5 chime)
        const freqs = [659.25, 987.77];

        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.03);

          gain.gain.setValueAtTime(0.05, now + idx * 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.03 + 0.12);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.03);
          osc.stop(now + idx * 0.03 + 0.12);
        });
      } else {
        // Muted low uncheck tap
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.025);

        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.025);
      }
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // 4. Success Chime (Refined Ethereal Major Triad)
  playSuccess() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.04);

        gain.gain.setValueAtTime(0.04, now + index * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.04 + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.04);
        osc.stop(now + index * 0.04 + 0.22);
      });
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // 5. Celebration Swell (Glass Harp Accord for 100% Completion)
  playCelebration() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const arpeggio = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];

      arpeggio.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0.04, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.35);
      });
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // 6. Tactile Low Thud (Muted Soft Delete Click)
  playDelete() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.035);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }
}

export const soundManager = new SoundManager();
