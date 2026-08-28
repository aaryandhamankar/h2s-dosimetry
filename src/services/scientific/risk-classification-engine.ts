/**
 * Risk Classification Engine
 * 
 * Maps exposure dose estimates to risk status using CONFIGURABLE thresholds.
 * This engine is deliberately separate from inference — it converts a
 * numerical dose into an operational risk classification.
 * 
 * Thresholds come from configuration, NOT hard-coded in this engine.
 * 
 * IMPORTANT: The thresholds used in the prototype are DEMONSTRATION VALUES.
 * Real H₂S occupational exposure limits must come from validated
 * occupational health standards and experimental calibration.
 */

import { RiskStatus, ValidityStatus, RiskThresholdConfig } from '@/types';

/**
 * PROTOTYPE demonstration thresholds.
 * These are NOT validated H₂S occupational exposure limits.
 * Real thresholds must come from approved scientific/regulatory sources.
 */
const DEFAULT_THRESHOLDS: RiskThresholdConfig = {
  version: '0.1.0-demo',
  normalMax: 5.0,
  elevatedMax: 15.0,
  highMax: 20.0,
  criticalThreshold: 20.0,
  unit: 'ppm·h',
  effectiveFrom: new Date().toISOString(),
};

export class RiskClassificationEngine {
  private thresholds: RiskThresholdConfig;

  constructor(thresholds?: RiskThresholdConfig) {
    this.thresholds = thresholds ?? DEFAULT_THRESHOLDS;
  }

  /**
   * Classify risk based on dose and validity.
   * 
   * Logic:
   * - INVALID validity → INVALID risk
   * - OUT_OF_RANGE validity → OUT_OF_RANGE risk
   * - null dose → INVALID risk
   * - dose ≤ normalMax → NORMAL
   * - dose ≤ elevatedMax → ELEVATED
   * - dose ≤ highMax → HIGH
   * - dose > criticalThreshold → CRITICAL
   */
  classify(
    estimatedDose: number | null,
    validity: ValidityStatus
  ): RiskStatus {
    // Invalid scans cannot be classified as safe
    if (validity === ValidityStatus.INVALID_IMAGE || validity === ValidityStatus.PROCESSING_ERROR) {
      return RiskStatus.INVALID;
    }

    if (validity === ValidityStatus.OUT_OF_RANGE) {
      return RiskStatus.OUT_OF_RANGE;
    }

    if (validity === ValidityStatus.CALIBRATION_UNAVAILABLE || validity === ValidityStatus.MODEL_UNAVAILABLE) {
      return RiskStatus.INVALID;
    }

    if (validity === ValidityStatus.EXPIRED) {
      return RiskStatus.INVALID;
    }

    // Null dose → cannot classify
    if (estimatedDose === null) {
      return RiskStatus.INVALID;
    }

    // Apply configured thresholds
    if (estimatedDose <= this.thresholds.normalMax) {
      return RiskStatus.NORMAL;
    }
    if (estimatedDose <= this.thresholds.elevatedMax) {
      return RiskStatus.ELEVATED;
    }
    if (estimatedDose <= this.thresholds.highMax) {
      return RiskStatus.HIGH;
    }
    return RiskStatus.CRITICAL;
  }

  /**
   * Get the current thresholds for display/audit purposes.
   */
  getThresholds(): RiskThresholdConfig {
    return { ...this.thresholds };
  }

  /**
   * Get the threshold boundary for a given risk status.
   */
  getThresholdForRisk(risk: RiskStatus): { min: number; max: number | null } | null {
    switch (risk) {
      case RiskStatus.NORMAL:
        return { min: 0, max: this.thresholds.normalMax };
      case RiskStatus.ELEVATED:
        return { min: this.thresholds.normalMax, max: this.thresholds.elevatedMax };
      case RiskStatus.HIGH:
        return { min: this.thresholds.elevatedMax, max: this.thresholds.highMax };
      case RiskStatus.CRITICAL:
        return { min: this.thresholds.criticalThreshold, max: null };
      default:
        return null;
    }
  }
}
