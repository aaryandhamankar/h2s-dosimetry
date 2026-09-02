/**
 * Scan Processing Pipeline
 * 
 * Orchestrates the complete scientific processing chain:
 * Image → Quality → Detection → ROI → Color → Calibration → Inference → Validation → Risk
 * 
 * This is the central processing service that coordinates all scientific engines.
 * The UI layer calls this service and receives a complete ScanProcessingResult.
 * 
 * The pipeline supports three input modes:
 * 1. Demo scenario (deterministic, reproducible)
 * 2. Sample image (pre-analyzed)
 * 3. Live camera (future: real-time CV)
 * 
 * All outputs include full provenance information.
 */

import {
  Scan,
  DosimeterDetection,
  ROIResult,
  ProcessingStatus,
  ValidityStatus,
  DataSource,
  DemoScenario,
  SyncStatus,
  ImageQualityStatus,
} from '@/types';
import { ImageQualityEngine } from './image-quality-engine';
import { ColorAnalysisEngine } from './color-analysis-engine';
import { MockInferenceEngine } from './mock-inference-engine';
import { RiskClassificationEngine } from './risk-classification-engine';

const APP_VERSION = '0.1.0';
const PROCESSING_VERSION = '0.1.0';

/**
 * Deterministic dosimeter detection results for demo scenarios.
 */
function getDemoDetection(scenario: DemoScenario): DosimeterDetection {
  if (scenario === DemoScenario.INVALID) {
    return {
      detected: false,
      confidence: 0.15,
      boundingRegion: null,
      corners: null,
      orientation: null,
    };
  }
  return {
    detected: true,
    confidence: 0.94,
    boundingRegion: { x: 120, y: 180, width: 480, height: 320 },
    corners: [
      { x: 120, y: 180 },
      { x: 600, y: 180 },
      { x: 600, y: 500 },
      { x: 120, y: 500 },
    ],
    orientation: 'LANDSCAPE',
  };
}

/**
 * Deterministic ROI results for demo scenarios.
 */
function getDemoROI(scenario: DemoScenario): ROIResult {
  if (scenario === DemoScenario.INVALID) {
    return {
      roiId: `roi-${scenario.toLowerCase()}`,
      sensorRoi: { x: 0, y: 0, width: 0, height: 0 },
      referenceRois: [],
      normalizedImageReference: null,
      geometryStatus: 'INVALID',
    };
  }
  return {
    roiId: `roi-${scenario.toLowerCase()}`,
    sensorRoi: { x: 160, y: 200, width: 200, height: 120 },
    referenceRois: [
      { id: 'ref-white', x: 400, y: 200, width: 40, height: 40 },
      { id: 'ref-gray', x: 450, y: 200, width: 40, height: 40 },
      { id: 'ref-cyan', x: 400, y: 250, width: 40, height: 40 },
      { id: 'ref-magenta', x: 450, y: 250, width: 40, height: 40 },
    ],
    normalizedImageReference: null,
    geometryStatus: 'VALID',
  };
}

export class ScanProcessingPipeline {
  private imageQualityEngine: ImageQualityEngine;
  private colorAnalysisEngine: typeof ColorAnalysisEngine;
  private inferenceEngine: MockInferenceEngine;
  private riskEngine: RiskClassificationEngine;

  constructor() {
    this.imageQualityEngine = new ImageQualityEngine();
    this.colorAnalysisEngine = ColorAnalysisEngine;
    this.inferenceEngine = new MockInferenceEngine();
    this.riskEngine = new RiskClassificationEngine();
  }

  /**
   * Process a demo scenario through the complete pipeline.
   * Returns deterministic, reproducible results with a single canonical scan record.
   */
  async processScenario(
    scenario: DemoScenario,
    workerId: string,
    shiftId: string,
    dosimeterId: string,
    onProgress?: (status: ProcessingStatus) => void,
    capturedImageUrl?: string | null,
    metadata?: {
      workerName?: string;
      shiftName?: string;
      shiftStart?: string;
      shiftEnd?: string;
      location?: string;
      dosimeterCode?: string;
      bandCode?: string;
      expiryStatus?: string;
    }
  ): Promise<Scan> {
    const scanId = `scan-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const capturedAt = new Date().toISOString();

    // Simulate all 8 processing stages with snappy delays for smooth UI feedback
    const stages: ProcessingStatus[] = [
      ProcessingStatus.VALIDATING_IMAGE,
      ProcessingStatus.DETECTING_DOSIMETER,
      ProcessingStatus.EXTRACTING_ROI,
      ProcessingStatus.ANALYZING_REFERENCES,
      ProcessingStatus.CORRECTING_COLOR,
      ProcessingStatus.EXTRACTING_FEATURES,
      ProcessingStatus.RUNNING_INFERENCE,
      ProcessingStatus.VALIDATING_RESULT,
    ];

    for (const stage of stages) {
      onProgress?.(stage);
      await this.delay(180 + Math.random() * 80);
    }

    // Step 1: Image Quality
    const imageQuality = this.imageQualityEngine.evaluateForScenario(scenario);

    // Step 2: Dosimeter Detection
    const detection = getDemoDetection(scenario);

    // Step 3: ROI Extraction
    const roi = getDemoROI(scenario);

    // Step 4: Color Analysis
    const colorFeatures = this.colorAnalysisEngine.getFeaturesForScenario(scenario);

    // Step 5: Inference
    const prediction = this.inferenceEngine.predictForScenario(scenario);

    // Step 6: Risk Classification
    const riskStatus = this.riskEngine.classify(prediction.estimatedDose, prediction.validity);

    // Determine processing status
    const isInvalid = imageQuality.overallStatus === ImageQualityStatus.INVALID
      || prediction.validity === ValidityStatus.INVALID_IMAGE
      || prediction.validity === ValidityStatus.OUT_OF_RANGE;

    const processingStatus = isInvalid ? ProcessingStatus.INVALID : ProcessingStatus.COMPLETE;
    onProgress?.(processingStatus);

    // Calculate TWA if dose is available
    const exposureDuration = 8; // hours (demo shift)
    const estimatedTwa = prediction.estimatedDose !== null
      ? Math.round((prediction.estimatedDose / exposureDuration) * 10) / 10
      : null;

    const resolvedDosimeterCode = metadata?.dosimeterCode || metadata?.bandCode || dosimeterId || 'DOS-001';

    // Build the complete canonical scan record
    const scan: Scan = {
      id: scanId,
      scanId,
      timestamp: capturedAt,
      workerId,
      workerName: metadata?.workerName || 'Rajesh Kumar',
      shiftId: metadata?.shiftName ? shiftId : (shiftId || 'SHIFT-A'),
      shiftName: metadata?.shiftName || 'Shift A (Morning)',
      shiftStart: metadata?.shiftStart || '06:00',
      shiftEnd: metadata?.shiftEnd || '14:00',
      dosimeterId: resolvedDosimeterCode,
      dosimeterCode: resolvedDosimeterCode,
      bandCode: resolvedDosimeterCode,
      h2sReading: prediction.estimatedDose,
      doseUnit: prediction.unit || 'ppm·h',
      riskLevel: riskStatus,
      status: riskStatus,
      expiryStatus: metadata?.expiryStatus || 'ACTIVE',
      location: metadata?.location || 'Refinery Zone A',
      capturedAt,
      processedAt: new Date().toISOString(),
      processingStatus,
      syncStatus: SyncStatus.SYNCED,
      appVersion: APP_VERSION,
      processingVersion: PROCESSING_VERSION,
      imageQuality,
      dosimeterDetection: detection,
      roiResult: roi,
      colorFeatures: imageQuality.overallStatus !== ImageQualityStatus.INVALID ? colorFeatures : null,
      exposureResult: {
        id: `result-${scanId}`,
        scanId,
        estimatedDose: prediction.estimatedDose,
        doseUnit: prediction.unit,
        estimatedTwa,
        twaUnit: estimatedTwa !== null ? 'ppm' : '',
        lowerBound: prediction.lowerBound,
        upperBound: prediction.upperBound,
        confidence: prediction.confidence,
        validityStatus: prediction.validity,
        riskStatus,
        modelId: prediction.modelId,
        modelVersion: prediction.modelVersion,
        calibrationId: prediction.calibrationId,
        calibrationVersion: prediction.calibrationVersion,
        source: DataSource.SIMULATED,
        createdAt: new Date().toISOString(),
      },
      source: DataSource.SIMULATED,
      scenarioId: scenario,
      capturedImageUrl: capturedImageUrl || null,
    };

    return scan;
  }

  /**
   * Get the risk classification engine for threshold access.
   */
  getRiskEngine(): RiskClassificationEngine {
    return this.riskEngine;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
let pipelineInstance: ScanProcessingPipeline | null = null;

export function getScanPipeline(): ScanProcessingPipeline {
  if (!pipelineInstance) {
    pipelineInstance = new ScanProcessingPipeline();
  }
  return pipelineInstance;
}
