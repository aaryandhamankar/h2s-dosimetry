/**
 * Centralized Interaction Feedback Service (Haptics, Web Audio, Motion Safety)
 * Provides semantic, multi-modal feedback with graceful degradation.
 */

import { sfx } from './sound-effects';

class InteractionFeedbackService {
  private lastTriggerTime: number = 0;
  private minIntervalMs: number = 40; // Prevents accidental double-triggers / stutter

  /**
   * Safe vibration wrapper with feature detection and debounce protection
   */
  public vibrate(pattern: number | number[]): void {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    if (!('vibrate' in navigator)) return;

    const now = Date.now();
    if (now - this.lastTriggerTime < this.minIntervalMs && !Array.isArray(pattern)) {
      return;
    }
    this.lastTriggerTime = now;

    try {
      navigator.vibrate(pattern);
    } catch {
      // Graceful silence on restricted permissions or unsupported WebViews
    }
  }

  // ---------------------------------------------------------------------------
  // LEVEL 1: MICRO INTERACTIONS (Taps, Toggles, Selections)
  // ---------------------------------------------------------------------------

  /**
   * Light micro-tap for buttons and navigation items
   */
  public tap(): void {
    this.vibrate(10);
    sfx.playClick();
  }

  /**
   * Subtle selection change for tabs, segmented controls, filters
   */
  public select(): void {
    this.vibrate(8);
    sfx.playClick();
  }

  // ---------------------------------------------------------------------------
  // LEVEL 2: MEANINGFUL INTERACTIONS (Capture, Pipeline Progression)
  // ---------------------------------------------------------------------------

  /**
   * Camera shutter release: mechanical dual-click audio + dual-kick tactile haptic
   */
  public capture(): void {
    this.vibrate([15, 30, 20]);
    sfx.playCameraShutter();
  }

  /**
   * Scientific pipeline verification step tick (1 through 8)
   */
  public step(stepIndex: number = 1): void {
    this.vibrate(10);
    sfx.playStepTick(stepIndex);
  }

  // ---------------------------------------------------------------------------
  // LEVEL 3: MAJOR SYSTEM EVENTS (Results, Triage Alarms, Verification)
  // ---------------------------------------------------------------------------

  /**
   * Safe verified baseline exposure result
   */
  public success(): void {
    this.vibrate([15, 40, 25]);
    sfx.playSuccess();
  }

  /**
   * Elevated exposure (5-10 ppm·h) advisory warning
   */
  public elevatedWarning(): void {
    this.vibrate([25, 45, 25]);
    sfx.playElevatedWarning();
  }

  /**
   * High exposure (10-20 ppm·h) industrial alert
   */
  public highAlarm(): void {
    this.vibrate([40, 50, 40]);
    sfx.playHighAlarm();
  }

  /**
   * Critical exposure (>20 ppm·h) emergency siren
   */
  public criticalAlarm(): void {
    this.vibrate([50, 50, 50, 50, 60]);
    sfx.playCriticalAlarm();
  }

  /**
   * Specular glare / optical blur scan refusal
   */
  public refusal(): void {
    this.vibrate([35, 40, 35]);
    sfx.playErrorRefusal();
  }

  /**
   * Sensor saturated / out of range warning
   */
  public outOfRange(): void {
    this.vibrate([30, 40, 45]);
    sfx.playOutOfRange();
  }

  /**
   * Team commendation fanfare & victory haptic
   */
  public celebration(): void {
    this.vibrate([20, 60, 20, 60, 35]);
    sfx.playCelebration();
  }
}

export const feedback = new InteractionFeedbackService();
