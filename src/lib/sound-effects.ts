/**
 * Web Audio API Sound Effects Engine
 * Synthesizes zero-dependency, ultra-low-latency, crisp industrial & camera sound effects.
 */

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Realistic Camera Shutter Click Sound
   * Synthesizes mechanical mirror snap + shutter curtain release
   */
  public playCameraShutter() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // First click: Mirror flip (high frequency snap + noise burst)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1400, now);
      osc1.frequency.exponentialRampToValueAtTime(180, now + 0.035);

      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.04);

      // Noise burst for mechanical texture
      const bufferSize = ctx.sampleRate * 0.03;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(2400, now);
      noiseFilter.Q.setValueAtTime(3.0, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.035);

      // Second click: Shutter release curtain (50ms later)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1800, now + 0.05);
      osc2.frequency.exponentialRampToValueAtTime(220, now + 0.09);

      gain2.gain.setValueAtTime(0, now);
      gain2.gain.setValueAtTime(0.4, now + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.05);
      osc2.stop(now + 0.095);
    } catch {
      // Audio fallback silent
    }
  }

  /**
   * Tactile Micro-Click for Buttons, Toggles & Interactions
   */
  public playClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.018);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.02);
    } catch {
      // Audio fallback silent
    }
  }

  /**
   * Scientific Pipeline Step Tick Sound
   * Pitch gently steps up with each of the 8 stages
   */
  public playStepTick(stepIndex: number = 1) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const baseFreq = 480 + (stepIndex * 55); // 535Hz up to ~920Hz

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.15, now + 0.035);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio fallback silent
    }
  }

  /**
   * Positive Confirmation / Safe Result Chime
   */
  public playSuccess() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Note 1: D5 (587.33 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.19);

      // Note 2: A5 (880.00 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.00, now + 0.09);
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.setValueAtTime(0.22, now + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.09);
      osc2.stop(now + 0.36);
    } catch {
      // Audio fallback silent
    }
  }

  /**
   * Caution / Warning Alert Chime (Elevated or High Risk)
   */
  public playWarning() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Two-tone warning beep
      [
        { freq: 660, time: now, dur: 0.09 },
        { freq: 520, time: now + 0.11, dur: 0.14 }
      ].forEach(tone => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(tone.freq, tone.time);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.24, tone.time);
        gain.gain.exponentialRampToValueAtTime(0.001, tone.time + tone.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(tone.time);
        osc.stop(tone.time + tone.dur);
      });
    } catch {
      // Audio fallback silent
    }
  }

  /**
   * Emergency / Critical Exposure Alarm Tone
   */
  public playCriticalAlarm() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Rapid urgent 3-pulse alarm
      [0, 0.12, 0.24].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now + offset);
        osc.frequency.exponentialRampToValueAtTime(440, now + offset + 0.08);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.28, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.09);

        // Lowpass filter to avoid harshness
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, now + offset);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.1);
      });
    } catch {
      // Audio fallback silent
    }
  }

  /**
   * Celebration Fanfare Arpeggio
   */
  public playCelebration() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // C5, E5, G5, C6 arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50];

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + (i * 0.08);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + (i === 3 ? 0.45 : 0.22));

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    } catch {
      // Audio fallback silent
    }
  }
}

export const sfx = new SoundEffectsEngine();
