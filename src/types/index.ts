// ============================================================
// H₂S Dosimeter Platform — Core Type Definitions
// ============================================================

// === Enums ===

export enum UserRole {
  WORKER = 'WORKER',
  HSE = 'HSE',
  ADMIN = 'ADMIN',
  RESEARCH = 'RESEARCH',
}

export enum ShiftStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum DosimeterStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  UNASSIGNED = 'UNASSIGNED',
  COMPLETED = 'COMPLETED',
}

export enum ProcessingStatus {
  CAPTURED = 'CAPTURED',
  VALIDATING_IMAGE = 'VALIDATING_IMAGE',
  DETECTING_DOSIMETER = 'DETECTING_DOSIMETER',
  EXTRACTING_ROI = 'EXTRACTING_ROI',
  ANALYZING_REFERENCES = 'ANALYZING_REFERENCES',
  CORRECTING_COLOR = 'CORRECTING_COLOR',
  EXTRACTING_FEATURES = 'EXTRACTING_FEATURES',
  RUNNING_INFERENCE = 'RUNNING_INFERENCE',
  VALIDATING_RESULT = 'VALIDATING_RESULT',
  COMPLETE = 'COMPLETE',
  INVALID = 'INVALID',
  ERROR = 'ERROR',
}

export enum ValidityStatus {
  VALID = 'VALID',
  LOW_CONFIDENCE = 'LOW_CONFIDENCE',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
  INVALID_IMAGE = 'INVALID_IMAGE',
  EXPIRED = 'EXPIRED',
  CALIBRATION_UNAVAILABLE = 'CALIBRATION_UNAVAILABLE',
  MODEL_UNAVAILABLE = 'MODEL_UNAVAILABLE',
  PROCESSING_ERROR = 'PROCESSING_ERROR',
}

export enum RiskStatus {
  NORMAL = 'NORMAL',
  ELEVATED = 'ELEVATED',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
  INVALID = 'INVALID',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
}

export enum DataSource {
  SIMULATED = 'SIMULATED',
  EXPERIMENTAL = 'EXPERIMENTAL',
  VALIDATED = 'VALIDATED',
}

export enum SyncStatus {
  PENDING = 'PENDING',
  SYNCING = 'SYNCING',
  SYNCED = 'SYNCED',
  FAILED = 'FAILED',
}

export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

export enum AlertStatus {
  OPEN = 'OPEN',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
}

export enum ScannerState {
  INITIALIZING = 'INITIALIZING',
  SEARCHING = 'SEARCHING',
  DETECTED = 'DETECTED',
  QUALITY_CHECK = 'QUALITY_CHECK',
  READY = 'READY',
  CAPTURING = 'CAPTURING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export enum ImageQualityStatus {
  GOOD = 'GOOD',
  WARNING = 'WARNING',
  INVALID = 'INVALID',
}

export enum DemoScenario {
  NORMAL = 'NORMAL',
  ELEVATED = 'ELEVATED',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
  INVALID = 'INVALID',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
}

// === Core Interfaces ===

export interface User {
  id: string;
  username: string;
  role: UserRole;
  displayName: string;
  department: string;
  site: string;
  workerCode: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Shift {
  id: string;
  workerId: string;
  startTime: string;
  endTime: string | null;
  status: ShiftStatus;
}

export interface Dosimeter {
  id: string;
  dosimeterCode: string;
  batchId: string;
  chemistryId: string;
  status: DosimeterStatus;
  activationTime: string | null;
  expiryTime: string | null;
  assignedWorkerId: string | null;
}

// === Scientific Data Interfaces ===

export interface ImageQualityResult {
  overallStatus: ImageQualityStatus;
  blurScore: number;
  brightnessScore: number;
  glareScore: number;
  framingScore: number;
  orientationScore: number;
  errors: string[];
  warnings: string[];
}

export interface DosimeterDetection {
  detected: boolean;
  confidence: number;
  boundingRegion: { x: number; y: number; width: number; height: number } | null;
  corners: { x: number; y: number }[] | null;
  orientation: string | null;
}

export interface ROIResult {
  roiId: string;
  sensorRoi: { x: number; y: number; width: number; height: number };
  referenceRois: { id: string; x: number; y: number; width: number; height: number }[];
  normalizedImageReference: string | null;
  geometryStatus: 'VALID' | 'INVALID';
}

export interface ColorFeatures {
  baselineL: number;
  baselineA: number;
  baselineB: number;
  currentL: number;
  currentA: number;
  currentB: number;
  deltaL: number;
  deltaA: number;
  deltaB: number;
  deltaE: number;
  featureSchemaVersion: string;
}

export interface ExposurePrediction {
  estimatedDose: number | null;
  unit: string;
  lowerBound: number | null;
  upperBound: number | null;
  confidence: number | null;
  validity: ValidityStatus;
  modelId: string;
  modelVersion: string;
  calibrationId: string;
  calibrationVersion: string;
  source: DataSource;
}

export interface ExposureResult {
  id: string;
  scanId: string;
  estimatedDose: number | null;
  doseUnit: string;
  estimatedTwa: number | null;
  twaUnit: string;
  lowerBound: number | null;
  upperBound: number | null;
  confidence: number | null;
  validityStatus: ValidityStatus;
  riskStatus: RiskStatus;
  modelId: string;
  modelVersion: string;
  calibrationId: string;
  calibrationVersion: string;
  source: DataSource;
  createdAt: string;
}

export interface Scan {
  id: string;
  workerId: string;
  shiftId: string;
  dosimeterId: string;
  capturedAt: string;
  processedAt: string | null;
  processingStatus: ProcessingStatus;
  syncStatus: SyncStatus;
  appVersion: string;
  processingVersion: string;
  imageQuality: ImageQualityResult | null;
  dosimeterDetection: DosimeterDetection | null;
  roiResult: ROIResult | null;
  colorFeatures: ColorFeatures | null;
  exposureResult: ExposureResult | null;
  source: DataSource;
  scenarioId: DemoScenario | null;
  capturedImageUrl?: string | null;
}

export interface Alert {
  id: string;
  scanId: string;
  workerId: string;
  severity: AlertSeverity;
  reason: string;
  status: AlertStatus;
  createdAt: string;
  acknowledgedBy: string | null;
  acknowledgedAt: string | null;
}

export interface RiskThresholdConfig {
  version: string;
  normalMax: number;
  elevatedMax: number;
  highMax: number;
  criticalThreshold: number;
  unit: string;
  effectiveFrom: string;
}

export interface ScanProcessingResult {
  imageQuality: ImageQualityResult;
  dosimeterDetection: DosimeterDetection;
  roi: ROIResult;
  colorFeatures: ColorFeatures;
  inference: ExposurePrediction;
  riskStatus: RiskStatus;
}

export interface DemoScenarioConfig {
  id: DemoScenario;
  label: string;
  description: string;
  colorFeatures: ColorFeatures;
  expectedDose: number | null;
  expectedRisk: RiskStatus;
  expectedValidity: ValidityStatus;
  imageQuality: ImageQualityResult;
}
