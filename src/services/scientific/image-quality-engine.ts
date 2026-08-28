/**
 * Image Quality Engine
 * 
 * Evaluates image quality metrics to determine if a captured image
 * is suitable for dosimeter analysis. This is the first gate in the
 * processing pipeline — poor quality images are rejected before
 * any scientific processing occurs.
 * 
 * Metrics evaluated:
 * - Blur (Laplacian variance proxy)
 * - Brightness (mean luminance)
 * - Glare (saturated pixel ratio)
 * - Framing (target overlap with guide)
 * - Orientation (planar alignment)
 */

import { ImageQualityResult, ImageQualityStatus, DemoScenario } from '@/types';

export interface ImageQualityThresholds {
  minBlurScore: number;
  minBrightnessScore: number;
  maxBrightnessScore: number;
  maxGlareScore: number;
  minFramingScore: number;
  minOrientationScore: number;
}

const DEFAULT_THRESHOLDS: ImageQualityThresholds = {
  minBlurScore: 0.4,
  minBrightnessScore: 0.25,
  maxBrightnessScore: 0.95,
  maxGlareScore: 0.3,
  minFramingScore: 0.6,
  minOrientationScore: 0.5,
};

/**
 * Deterministic quality results for demo scenarios
 */
const DEMO_QUALITY_RESULTS: Record<DemoScenario, ImageQualityResult> = {
  [DemoScenario.NORMAL]: {
    overallStatus: ImageQualityStatus.GOOD,
    blurScore: 0.92,
    brightnessScore: 0.78,
    glareScore: 0.05,
    framingScore: 0.95,
    orientationScore: 0.91,
    errors: [],
    warnings: [],
  },
  [DemoScenario.ELEVATED]: {
    overallStatus: ImageQualityStatus.GOOD,
    blurScore: 0.88,
    brightnessScore: 0.72,
    glareScore: 0.08,
    framingScore: 0.93,
    orientationScore: 0.89,
    errors: [],
    warnings: [],
  },
  [DemoScenario.HIGH]: {
    overallStatus: ImageQualityStatus.GOOD,
    blurScore: 0.85,
    brightnessScore: 0.68,
    glareScore: 0.12,
    framingScore: 0.90,
    orientationScore: 0.87,
    errors: [],
    warnings: ['Slightly reduced lighting quality'],
  },
  [DemoScenario.CRITICAL]: {
    overallStatus: ImageQualityStatus.GOOD,
    blurScore: 0.82,
    brightnessScore: 0.65,
    glareScore: 0.15,
    framingScore: 0.88,
    orientationScore: 0.84,
    errors: [],
    warnings: [],
  },
  [DemoScenario.INVALID]: {
    overallStatus: ImageQualityStatus.INVALID,
    blurScore: 0.18,
    brightnessScore: 0.42,
    glareScore: 0.72,
    framingScore: 0.35,
    orientationScore: 0.29,
    errors: ['IMAGE_TOO_BLURRY', 'EXCESSIVE_GLARE'],
    warnings: ['Insufficient framing overlap'],
  },
  [DemoScenario.OUT_OF_RANGE]: {
    overallStatus: ImageQualityStatus.GOOD,
    blurScore: 0.86,
    brightnessScore: 0.74,
    glareScore: 0.09,
    framingScore: 0.91,
    orientationScore: 0.88,
    errors: [],
    warnings: [],
  },
};

export class ImageQualityEngine {
  private thresholds: ImageQualityThresholds;

  constructor(thresholds?: Partial<ImageQualityThresholds>) {
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };
  }

  /**
   * Evaluate image quality for a demo scenario (deterministic)
   */
  evaluateForScenario(scenario: DemoScenario): ImageQualityResult {
    return { ...DEMO_QUALITY_RESULTS[scenario] };
  }

  /**
   * Evaluate image quality from raw metrics
   * In a production system, these scores would come from OpenCV analysis.
   * For the prototype, this validates pre-computed scores against thresholds.
   */
  evaluate(scores: {
    blurScore: number;
    brightnessScore: number;
    glareScore: number;
    framingScore: number;
    orientationScore: number;
  }): ImageQualityResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (scores.blurScore < this.thresholds.minBlurScore) {
      errors.push('IMAGE_TOO_BLURRY');
    }
    if (scores.brightnessScore < this.thresholds.minBrightnessScore) {
      errors.push('IMAGE_TOO_DARK');
    }
    if (scores.brightnessScore > this.thresholds.maxBrightnessScore) {
      warnings.push('Image brightness near saturation');
    }
    if (scores.glareScore > this.thresholds.maxGlareScore) {
      errors.push('EXCESSIVE_GLARE');
    }
    if (scores.framingScore < this.thresholds.minFramingScore) {
      if (scores.framingScore < this.thresholds.minFramingScore * 0.5) {
        errors.push('DOSIMETER_NOT_DETECTED');
      } else {
        warnings.push('Improve dosimeter framing');
      }
    }
    if (scores.orientationScore < this.thresholds.minOrientationScore) {
      warnings.push('Adjust dosimeter orientation');
    }

    const overallStatus = errors.length > 0
      ? ImageQualityStatus.INVALID
      : warnings.length > 0
        ? ImageQualityStatus.WARNING
        : ImageQualityStatus.GOOD;

    return {
      overallStatus,
      ...scores,
      errors,
      warnings,
    };
  }
}
