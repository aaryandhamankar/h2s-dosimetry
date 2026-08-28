import { DemoScenario, ImageQualityStatus, RiskStatus, RiskThresholdConfig, ValidityStatus, DemoScenarioConfig } from '../types';

export const APP_VERSION = '0.1.0';
export const PROCESSING_VERSION = '0.1.0';

// NOTE: These are DEMO/PROTOTYPE thresholds - NOT validated H₂S limits
export const RISK_THRESHOLDS: RiskThresholdConfig = {
  version: '0.1.0',
  normalMax: 5.0,
  elevatedMax: 15.0,
  highMax: 20.0,
  criticalThreshold: 20.0,
  unit: 'ppm·h',
  effectiveFrom: new Date().toISOString()
};

export const IMAGE_QUALITY_THRESHOLDS = {
  minBlurScore: 0.6,
  minBrightnessScore: 0.4,
  maxBrightnessScore: 0.8,
  minGlareScore: 0.5,
  minFramingScore: 0.7,
  minOrientationScore: 0.8
};

export const MODEL_CONFIG = {
  id: 'MOCK-MODEL-001',
  version: '0.1.0',
  algorithm: 'MockInference',
  status: 'DRAFT'
};

export const CALIBRATION_CONFIG = {
  id: 'MOCK-CAL-001',
  version: '0.1.0',
  status: 'DRAFT'
};

export const DEMO_SCENARIOS: Record<DemoScenario, DemoScenarioConfig> = {
  [DemoScenario.NORMAL]: {
    id: DemoScenario.NORMAL,
    label: 'Normal Exposure',
    description: 'Typical background or minimal exposure.',
    colorFeatures: {
      baselineL: 95.0, baselineA: 0.1, baselineB: 1.0,
      currentL: 92.1, currentA: 0.3, currentB: 2.1,
      deltaL: 2.9, deltaA: -0.2, deltaB: -1.1, deltaE: 2.1,
      featureSchemaVersion: '1.0'
    },
    expectedDose: 3.2,
    expectedRisk: RiskStatus.NORMAL,
    expectedValidity: ValidityStatus.VALID,
    imageQuality: {
      overallStatus: ImageQualityStatus.GOOD,
      blurScore: 0.9, brightnessScore: 0.6, glareScore: 0.9, framingScore: 0.9, orientationScore: 0.9,
      errors: [], warnings: []
    }
  },
  [DemoScenario.ELEVATED]: {
    id: DemoScenario.ELEVATED,
    label: 'Elevated Exposure',
    description: 'Slightly above normal exposure levels.',
    colorFeatures: {
      baselineL: 95.0, baselineA: 0.1, baselineB: 1.0,
      currentL: 85.3, currentA: 3.1, currentB: 8.2,
      deltaL: 9.7, deltaA: -3.0, deltaB: -7.2, deltaE: 5.6,
      featureSchemaVersion: '1.0'
    },
    expectedDose: 12.4,
    expectedRisk: RiskStatus.ELEVATED,
    expectedValidity: ValidityStatus.VALID,
    imageQuality: {
      overallStatus: ImageQualityStatus.GOOD,
      blurScore: 0.8, brightnessScore: 0.6, glareScore: 0.8, framingScore: 0.9, orientationScore: 0.9,
      errors: [], warnings: []
    }
  },
  [DemoScenario.HIGH]: {
    id: DemoScenario.HIGH,
    label: 'High Exposure',
    description: 'Approaching critical limit.',
    colorFeatures: {
      baselineL: 95.0, baselineA: 0.1, baselineB: 1.0,
      currentL: 78.6, currentA: 5.8, currentB: 12.7,
      deltaL: 16.4, deltaA: -5.7, deltaB: -11.7, deltaE: 9.4,
      featureSchemaVersion: '1.0'
    },
    expectedDose: 18.6,
    expectedRisk: RiskStatus.HIGH,
    expectedValidity: ValidityStatus.VALID,
    imageQuality: {
      overallStatus: ImageQualityStatus.GOOD,
      blurScore: 0.9, brightnessScore: 0.7, glareScore: 0.9, framingScore: 0.8, orientationScore: 0.9,
      errors: [], warnings: []
    }
  },
  [DemoScenario.CRITICAL]: {
    id: DemoScenario.CRITICAL,
    label: 'Critical Exposure',
    description: 'Above safe threshold.',
    colorFeatures: {
      baselineL: 95.0, baselineA: 0.1, baselineB: 1.0,
      currentL: 71.2, currentA: 8.9, currentB: 18.4,
      deltaL: 23.8, deltaA: -8.8, deltaB: -17.4, deltaE: 14.2,
      featureSchemaVersion: '1.0'
    },
    expectedDose: 24.8,
    expectedRisk: RiskStatus.CRITICAL,
    expectedValidity: ValidityStatus.VALID,
    imageQuality: {
      overallStatus: ImageQualityStatus.GOOD,
      blurScore: 0.9, brightnessScore: 0.6, glareScore: 0.8, framingScore: 0.9, orientationScore: 0.9,
      errors: [], warnings: []
    }
  },
  [DemoScenario.INVALID]: {
    id: DemoScenario.INVALID,
    label: 'Invalid Image',
    description: 'Image too blurry or has excessive glare.',
    colorFeatures: {
      baselineL: 95.0, baselineA: 0.1, baselineB: 1.0,
      currentL: 0, currentA: 0, currentB: 0,
      deltaL: 0, deltaA: 0, deltaB: 0, deltaE: 0,
      featureSchemaVersion: '1.0'
    },
    expectedDose: null,
    expectedRisk: RiskStatus.INVALID,
    expectedValidity: ValidityStatus.INVALID_IMAGE,
    imageQuality: {
      overallStatus: ImageQualityStatus.INVALID,
      blurScore: 0.3, brightnessScore: 0.9, glareScore: 0.2, framingScore: 0.5, orientationScore: 0.8,
      errors: ['Image too blurry', 'Excessive glare detected'], warnings: []
    }
  },
  [DemoScenario.OUT_OF_RANGE]: {
    id: DemoScenario.OUT_OF_RANGE,
    label: 'Out of Range',
    description: 'Color features lie outside operating model range.',
    colorFeatures: {
      baselineL: 95.0, baselineA: 0.1, baselineB: 1.0,
      currentL: 40.2, currentA: 20.9, currentB: 40.4,
      deltaL: 54.8, deltaA: -20.8, deltaB: -39.4, deltaE: 45.2,
      featureSchemaVersion: '1.0'
    },
    expectedDose: null,
    expectedRisk: RiskStatus.OUT_OF_RANGE,
    expectedValidity: ValidityStatus.OUT_OF_RANGE,
    imageQuality: {
      overallStatus: ImageQualityStatus.GOOD,
      blurScore: 0.9, brightnessScore: 0.6, glareScore: 0.9, framingScore: 0.9, orientationScore: 0.9,
      errors: [], warnings: []
    }
  }
};
