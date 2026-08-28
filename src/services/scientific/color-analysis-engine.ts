/**
 * Color Analysis Engine
 * 
 * Handles the core color science computations:
 * - RGB → XYZ → CIELAB conversion
 * - Baseline comparison (ΔL*, Δa*, Δb*)
 * - Color difference calculation (ΔE*ab using CIE76 formulation)
 * 
 * The ΔE formulation used is explicitly CIE76 (Euclidean distance in CIELAB).
 * This is documented and configurable — do not silently switch to ΔE94 or ΔE2000.
 */

import { ColorFeatures, DemoScenario } from '@/types';

export const FEATURE_SCHEMA_VERSION = '0.1.0';

/**
 * Unexposed baseline reference color in CIELAB.
 * NOTE: These are PROTOTYPE values for demonstration only.
 * Real baseline must come from experimental calibration.
 */
export const BASELINE_REFERENCE = {
  L: 95.0,
  a: 0.0,
  b: 1.5,
};

/**
 * Deterministic color feature values for each demo scenario.
 * These are prototype demonstration values — NOT experimental data.
 */
const DEMO_COLOR_FEATURES: Record<DemoScenario, ColorFeatures> = {
  [DemoScenario.NORMAL]: {
    baselineL: BASELINE_REFERENCE.L,
    baselineA: BASELINE_REFERENCE.a,
    baselineB: BASELINE_REFERENCE.b,
    currentL: 92.1,
    currentA: 0.3,
    currentB: 2.1,
    deltaL: -2.9,
    deltaA: 0.3,
    deltaB: 0.6,
    deltaE: 3.0, // sqrt(2.9² + 0.3² + 0.6²) ≈ 3.0
    featureSchemaVersion: FEATURE_SCHEMA_VERSION,
  },
  [DemoScenario.ELEVATED]: {
    baselineL: BASELINE_REFERENCE.L,
    baselineA: BASELINE_REFERENCE.a,
    baselineB: BASELINE_REFERENCE.b,
    currentL: 85.3,
    currentA: 3.1,
    currentB: 8.2,
    deltaL: -9.7,
    deltaA: 3.1,
    deltaB: 6.7,
    deltaE: 12.2, // sqrt(9.7² + 3.1² + 6.7²) ≈ 12.2
    featureSchemaVersion: FEATURE_SCHEMA_VERSION,
  },
  [DemoScenario.HIGH]: {
    baselineL: BASELINE_REFERENCE.L,
    baselineA: BASELINE_REFERENCE.a,
    baselineB: BASELINE_REFERENCE.b,
    currentL: 78.6,
    currentA: 5.8,
    currentB: 12.7,
    deltaL: -16.4,
    deltaA: 5.8,
    deltaB: 11.2,
    deltaE: 20.8, // sqrt(16.4² + 5.8² + 11.2²) ≈ 20.8
    featureSchemaVersion: FEATURE_SCHEMA_VERSION,
  },
  [DemoScenario.CRITICAL]: {
    baselineL: BASELINE_REFERENCE.L,
    baselineA: BASELINE_REFERENCE.a,
    baselineB: BASELINE_REFERENCE.b,
    currentL: 71.2,
    currentA: 8.9,
    currentB: 18.4,
    deltaL: -23.8,
    deltaA: 8.9,
    deltaB: 16.9,
    deltaE: 30.6, // sqrt(23.8² + 8.9² + 16.9²) ≈ 30.6
    featureSchemaVersion: FEATURE_SCHEMA_VERSION,
  },
  [DemoScenario.INVALID]: {
    baselineL: BASELINE_REFERENCE.L,
    baselineA: BASELINE_REFERENCE.a,
    baselineB: BASELINE_REFERENCE.b,
    currentL: 0,
    currentA: 0,
    currentB: 0,
    deltaL: 0,
    deltaA: 0,
    deltaB: 0,
    deltaE: 0,
    featureSchemaVersion: FEATURE_SCHEMA_VERSION,
  },
  [DemoScenario.OUT_OF_RANGE]: {
    baselineL: BASELINE_REFERENCE.L,
    baselineA: BASELINE_REFERENCE.a,
    baselineB: BASELINE_REFERENCE.b,
    currentL: 42.1,
    currentA: 18.5,
    currentB: 35.2,
    deltaL: -52.9,
    deltaA: 18.5,
    deltaB: 33.7,
    deltaE: 65.3, // Well beyond calibrated range
    featureSchemaVersion: FEATURE_SCHEMA_VERSION,
  },
};

export class ColorAnalysisEngine {
  /**
   * Calculate ΔE*ab (CIE76) from two CIELAB color values.
   * Formula: ΔE = √((ΔL*)² + (Δa*)² + (Δb*)²)
   */
  static calculateDeltaE(
    L1: number, a1: number, b1: number,
    L2: number, a2: number, b2: number
  ): number {
    const dL = L2 - L1;
    const da = a2 - a1;
    const db = b2 - b1;
    return Math.sqrt(dL * dL + da * da + db * db);
  }

  /**
   * Extract color features by comparing current sensor color to baseline.
   */
  static extractFeatures(
    currentL: number,
    currentA: number,
    currentB: number,
    baseline: { L: number; a: number; b: number } = BASELINE_REFERENCE
  ): ColorFeatures {
    const deltaL = currentL - baseline.L;
    const deltaA = currentA - baseline.a;
    const deltaB = currentB - baseline.b;
    const deltaE = Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);

    return {
      baselineL: baseline.L,
      baselineA: baseline.a,
      baselineB: baseline.b,
      currentL,
      currentA,
      currentB,
      deltaL: Math.round(deltaL * 10) / 10,
      deltaA: Math.round(deltaA * 10) / 10,
      deltaB: Math.round(deltaB * 10) / 10,
      deltaE: Math.round(deltaE * 10) / 10,
      featureSchemaVersion: FEATURE_SCHEMA_VERSION,
    };
  }

  /**
   * Get deterministic color features for a demo scenario.
   */
  static getFeaturesForScenario(scenario: DemoScenario): ColorFeatures {
    return { ...DEMO_COLOR_FEATURES[scenario] };
  }

  /**
   * Convert sRGB to CIE XYZ (D65 illuminant).
   * Uses the standard sRGB to XYZ transformation matrix.
   */
  static rgbToXYZ(r: number, g: number, b: number): { X: number; Y: number; Z: number } {
    // Normalize to [0,1]
    let rn = r / 255;
    let gn = g / 255;
    let bn = b / 255;

    // Apply inverse sRGB companding
    rn = rn > 0.04045 ? Math.pow((rn + 0.055) / 1.055, 2.4) : rn / 12.92;
    gn = gn > 0.04045 ? Math.pow((gn + 0.055) / 1.055, 2.4) : gn / 12.92;
    bn = bn > 0.04045 ? Math.pow((bn + 0.055) / 1.055, 2.4) : bn / 12.92;

    // sRGB to XYZ (D65) transformation matrix
    const X = rn * 0.4124564 + gn * 0.3575761 + bn * 0.1804375;
    const Y = rn * 0.2126729 + gn * 0.7151522 + bn * 0.0721750;
    const Z = rn * 0.0193339 + gn * 0.1191920 + bn * 0.9503041;

    return { X: X * 100, Y: Y * 100, Z: Z * 100 };
  }

  /**
   * Convert CIE XYZ to CIELAB (D65 illuminant).
   * D65 reference white: X=95.047, Y=100.000, Z=108.883
   */
  static xyzToLab(X: number, Y: number, Z: number): { L: number; a: number; b: number } {
    // D65 reference white
    const Xn = 95.047;
    const Yn = 100.000;
    const Zn = 108.883;

    const f = (t: number): number => {
      const delta = 6 / 29;
      return t > delta * delta * delta
        ? Math.cbrt(t)
        : t / (3 * delta * delta) + 4 / 29;
    };

    const fX = f(X / Xn);
    const fY = f(Y / Yn);
    const fZ = f(Z / Zn);

    const L = 116 * fY - 16;
    const a = 500 * (fX - fY);
    const b = 200 * (fY - fZ);

    return {
      L: Math.round(L * 10) / 10,
      a: Math.round(a * 10) / 10,
      b: Math.round(b * 10) / 10,
    };
  }

  /**
   * Full RGB to CIELAB conversion pipeline.
   */
  static rgbToLab(r: number, g: number, b: number): { L: number; a: number; b: number } {
    const xyz = this.rgbToXYZ(r, g, b);
    return this.xyzToLab(xyz.X, xyz.Y, xyz.Z);
  }
}
