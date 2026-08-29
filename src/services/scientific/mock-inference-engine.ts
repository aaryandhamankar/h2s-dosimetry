/**
 * Mock Inference Engine
 * 
 * Provides deterministic exposure dose predictions for demo/prototype scenarios.
 * This engine explicitly labels all output as SIMULATED.
 * 
 * It implements the ExposureInferenceEngine interface pattern,
 * allowing replacement with CalibrationCurveEngine or XGBoostInferenceEngine
 * when experimental calibration data becomes available.
 * 
 * WARNING: The dose values returned by this engine are PROTOTYPE DEMONSTRATION
 * values only. They do NOT represent experimentally validated H₂S exposure measurements.
 */

import {
  ColorFeatures,
  ExposurePrediction,
  ValidityStatus,
  DataSource,
  DemoScenario,
  ImageQualityStatus,
  ImageQualityResult,
} from '@/types';

export interface InferenceContext {
  chemistryId: string;
  batchId: string;
  exposureDuration: number; // hours
  temperature?: number;
  humidity?: number;
}

export interface InferenceEngineConfig {
  modelId: string;
  modelVersion: string;
  calibrationId: string;
  calibrationVersion: string;
  operatingRange: {
    deltaEMin: number;
    deltaEMax: number;
    doseMin: number;
    doseMax: number;
  };
}

const DEFAULT_CONFIG: InferenceEngineConfig = {
  modelId: 'MOCK-MODEL-001',
  modelVersion: '0.1.0',
  calibrationId: 'MOCK-CAL-001',
  calibrationVersion: '0.1.0',
  operatingRange: {
    deltaEMin: 0,
    deltaEMax: 50.0,
    doseMin: 0,
    doseMax: 30.0,
  },
};

/**
 * Deterministic dose predictions for each demo scenario.
 * These are SIMULATED values for software demonstration only.
 */
const SCENARIO_PREDICTIONS: Record<DemoScenario, {
  dose: number | null;
  validity: ValidityStatus;
  confidence: number | null;
}> = {
  [DemoScenario.NORMAL]: {
    dose: 3.2,
    validity: ValidityStatus.VALID,
    confidence: null,
  },
  [DemoScenario.ELEVATED]: {
    dose: 12.4,
    validity: ValidityStatus.VALID,
    confidence: null,
  },
  [DemoScenario.HIGH]: {
    dose: 18.6,
    validity: ValidityStatus.VALID,
    confidence: null,
  },
  [DemoScenario.CRITICAL]: {
    dose: 24.8,
    validity: ValidityStatus.VALID,
    confidence: null,
  },
  [DemoScenario.INVALID]: {
    dose: null,
    validity: ValidityStatus.INVALID_IMAGE,
    confidence: null,
  },
  [DemoScenario.OUT_OF_RANGE]: {
    dose: null,
    validity: ValidityStatus.OUT_OF_RANGE,
    confidence: null,
  },
};

export class MockInferenceEngine {
  private config: InferenceEngineConfig;

  constructor(config?: Partial<InferenceEngineConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Run inference for a demo scenario (deterministic).
   */
  predictForScenario(scenario: DemoScenario): ExposurePrediction {
    const prediction = SCENARIO_PREDICTIONS[scenario];

    return {
      estimatedDose: prediction.dose,
      unit: 'ppm·h',
      lowerBound: prediction.dose !== null ? Math.round((prediction.dose * 0.85) * 10) / 10 : null,
      upperBound: prediction.dose !== null ? Math.round((prediction.dose * 1.15) * 10) / 10 : null,
      confidence: prediction.confidence,
      validity: prediction.validity,
      modelId: this.config.modelId,
      modelVersion: this.config.modelVersion,
      calibrationId: this.config.calibrationId,
      calibrationVersion: this.config.calibrationVersion,
      source: DataSource.SIMULATED,
    };
  }

  /**
   * Run inference from color features.
   * Uses a simple prototype mapping from ΔE to dose for demonstration.
   * 
   * NOTE: This mapping is NOT experimentally validated.
   * It exists solely to demonstrate the software pipeline.
   */
  predict(
    features: ColorFeatures,
    imageQuality: ImageQualityResult,
  ): ExposurePrediction {
    // Gate: reject invalid images
    if (imageQuality.overallStatus === ImageQualityStatus.INVALID) {
      return {
        estimatedDose: null,
        unit: 'ppm·h',
        lowerBound: null,
        upperBound: null,
        confidence: null,
        validity: ValidityStatus.INVALID_IMAGE,
        modelId: this.config.modelId,
        modelVersion: this.config.modelVersion,
        calibrationId: this.config.calibrationId,
        calibrationVersion: this.config.calibrationVersion,
        source: DataSource.SIMULATED,
      };
    }

    // Gate: check operating range
    if (features.deltaE > this.config.operatingRange.deltaEMax) {
      return {
        estimatedDose: null,
        unit: 'ppm·h',
        lowerBound: null,
        upperBound: null,
        confidence: null,
        validity: ValidityStatus.OUT_OF_RANGE,
        modelId: this.config.modelId,
        modelVersion: this.config.modelVersion,
        calibrationId: this.config.calibrationId,
        calibrationVersion: this.config.calibrationVersion,
        source: DataSource.SIMULATED,
      };
    }

    // Simple prototype linear mapping: dose ≈ deltaE * 0.8
    // This is a DEMONSTRATION relationship, NOT a calibrated curve.
    const estimatedDose = Math.round(features.deltaE * 0.8 * 10) / 10;
    const clampedDose = Math.min(estimatedDose, this.config.operatingRange.doseMax);

    return {
      estimatedDose: clampedDose,
      unit: 'ppm·h',
      lowerBound: Math.round(clampedDose * 0.85 * 10) / 10,
      upperBound: Math.round(clampedDose * 1.15 * 10) / 10,
      confidence: null, // Not fabricating confidence
      validity: ValidityStatus.VALID,
      modelId: this.config.modelId,
      modelVersion: this.config.modelVersion,
      calibrationId: this.config.calibrationId,
      calibrationVersion: this.config.calibrationVersion,
      source: DataSource.SIMULATED,
    };
  }
}
