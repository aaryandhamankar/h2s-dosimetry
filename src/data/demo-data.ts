import { 
  User, UserRole, 
  Dosimeter, DosimeterStatus,
  Scan, ProcessingStatus, SyncStatus,
  Alert, AlertSeverity, AlertStatus,
  RiskStatus, ValidityStatus, DataSource, ImageQualityStatus, DemoScenario,
  Shift, ShiftStatus
} from '@/types';
import { DEMO_WORKERS, HSE_USER } from './demo-workers';
import { DEMO_DOSIMETERS } from './demo-dosimeters';

export { DEMO_WORKERS, HSE_USER, DEMO_DOSIMETERS };

const now = new Date();

export const DEMO_SHIFTS: Shift[] = DEMO_WORKERS.map((w, i) => ({
  id: `shift-demo-${i}`,
  workerId: w.id,
  startTime: new Date(now.getTime() - (8 - i) * 60 * 60 * 1000).toISOString(),
  endTime: i % 2 === 0 ? new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString() : null,
  status: i % 2 === 0 ? ShiftStatus.COMPLETED : ShiftStatus.ACTIVE
}));

export const getDemoScans = (): Scan[] => {
  const scans: Scan[] = [];
  
  // Create some demo scans
  for (let i = 0; i < 10; i++) {
    const worker = DEMO_WORKERS[i % DEMO_WORKERS.length];
    const dosimeter = DEMO_DOSIMETERS[i % DEMO_DOSIMETERS.length];
    const shift = DEMO_SHIFTS[i % DEMO_SHIFTS.length];
    const time = new Date(now.getTime() - (Math.random() * 24) * 60 * 60 * 1000).toISOString();
    const isElevated = i === 2 || i === 7;
    const isCritical = i === 4;
    
    let riskStatus = RiskStatus.NORMAL;
    let estimatedDose = 1.2 + Math.random();
    
    if (isElevated) {
      riskStatus = RiskStatus.ELEVATED;
      estimatedDose = 5.5 + Math.random() * 2;
    } else if (isCritical) {
      riskStatus = RiskStatus.CRITICAL;
      estimatedDose = 15.0 + Math.random() * 5;
    }

    scans.push({
      id: `scan-${i}`,
      workerId: worker.id,
      shiftId: shift.id,
      dosimeterId: dosimeter.id,
      capturedAt: time,
      processedAt: new Date(new Date(time).getTime() + 5000).toISOString(),
      processingStatus: ProcessingStatus.COMPLETE,
      syncStatus: SyncStatus.SYNCED,
      appVersion: '1.0.0',
      processingVersion: '1.0.0',
      source: DataSource.SIMULATED,
      scenarioId: null,
      imageQuality: {
        overallStatus: ImageQualityStatus.GOOD,
        blurScore: 0.95,
        brightnessScore: 0.9,
        glareScore: 0.95,
        framingScore: 0.9,
        orientationScore: 1.0,
        errors: [],
        warnings: []
      },
      dosimeterDetection: {
        detected: true,
        confidence: 0.98,
        boundingRegion: { x: 100, y: 100, width: 300, height: 300 },
        corners: [{ x: 100, y: 100 }, { x: 400, y: 100 }, { x: 400, y: 400 }, { x: 100, y: 400 }],
        orientation: '0'
      },
      roiResult: {
        roiId: `roi-${i}`,
        sensorRoi: { x: 200, y: 200, width: 100, height: 100 },
        referenceRois: [],
        normalizedImageReference: null,
        geometryStatus: 'VALID'
      },
      colorFeatures: {
        baselineL: 80, baselineA: -10, baselineB: 20,
        currentL: isElevated ? 60 : isCritical ? 40 : 75,
        currentA: isElevated ? 0 : isCritical ? 10 : -8,
        currentB: isElevated ? 10 : isCritical ? 0 : 18,
        deltaL: isElevated ? 20 : isCritical ? 40 : 5,
        deltaA: isElevated ? 10 : isCritical ? 20 : 2,
        deltaB: isElevated ? 10 : isCritical ? 20 : 2,
        deltaE: isElevated ? 25 : isCritical ? 50 : 6,
        featureSchemaVersion: '1.0'
      },
      exposureResult: {
        id: `exp-${i}`,
        scanId: `scan-${i}`,
        estimatedDose,
        doseUnit: 'ppm*hr',
        estimatedTwa: estimatedDose / 8,
        twaUnit: 'ppm',
        lowerBound: estimatedDose * 0.9,
        upperBound: estimatedDose * 1.1,
        confidence: 0.92,
        validityStatus: ValidityStatus.VALID,
        riskStatus,
        modelId: 'model-v1',
        modelVersion: '1.0',
        calibrationId: 'cal-v1',
        calibrationVersion: '1.0',
        source: DataSource.SIMULATED,
        createdAt: time
      }
    });
  }
  
  return scans;
};

export const getDemoAlerts = (): Alert[] => {
  const scans = getDemoScans();
  const alerts: Alert[] = [];
  
  scans.forEach((scan, index) => {
    const risk = scan.exposureResult?.riskStatus;
    if (risk === RiskStatus.CRITICAL || risk === RiskStatus.ELEVATED || risk === RiskStatus.HIGH) {
      alerts.push({
        id: `alert-${index}`,
        scanId: scan.id,
        workerId: scan.workerId,
        severity: risk === RiskStatus.CRITICAL ? AlertSeverity.CRITICAL : AlertSeverity.WARNING,
        reason: `H2S exposure risk detected: ${risk}`,
        status: index % 2 === 0 ? AlertStatus.ACKNOWLEDGED : AlertStatus.OPEN,
        createdAt: scan.capturedAt,
        acknowledgedBy: index % 2 === 0 ? HSE_USER.id : null,
        acknowledgedAt: index % 2 === 0 ? new Date(new Date(scan.capturedAt).getTime() + 600000).toISOString() : null
      });
    }
  });
  
  return alerts;
};
