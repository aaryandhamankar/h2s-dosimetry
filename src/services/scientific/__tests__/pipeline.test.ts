/**
 * Test Suite for H₂S Scientific Processing Pipeline
 * 
 * Verifies color science mathematics, risk classification gates,
 * inference engine abstractions, and end-to-end provenance integrity.
 */

import { ColorAnalysisEngine } from '../color-analysis-engine';
import { RiskClassificationEngine } from '../risk-classification-engine';
import { MockInferenceEngine } from '../mock-inference-engine';
import { ScanProcessingPipeline } from '../scan-processing-pipeline';
import { DemoScenario, RiskStatus, ValidityStatus } from '../../../types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`❌ Assertion Failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runTests() {
  console.log('🧪 Starting Scientific Pipeline & Color Science Verification...\n');

  // Test 1: Color Analysis Engine (ΔE calculation)
  console.log('Test Group 1: CIELAB & ΔE Mathematics (CIE76 Formulation)');
  const deltaE = ColorAnalysisEngine.calculateDeltaE(95.0, 0.0, 1.5, 92.1, 0.3, 2.1);
  const expectedDeltaE = Math.sqrt(Math.pow(92.1 - 95.0, 2) + Math.pow(0.3 - 0.0, 2) + Math.pow(2.1 - 1.5, 2));
  assert(Math.abs(deltaE - expectedDeltaE) < 0.0001, `CIE76 ΔE matches Euclidean norm (${deltaE.toFixed(4)})`);

  const features = ColorAnalysisEngine.extractFeatures(85.3, 3.1, 8.2, { L: 95.0, a: 0.0, b: 1.5 });
  assert(features.deltaL === -9.7, `ΔL correctly calculated as -9.7 (got ${features.deltaL})`);
  assert(features.deltaA === 3.1, `Δa correctly calculated as 3.1 (got ${features.deltaA})`);
  assert(features.deltaB === 6.7, `Δb correctly calculated as 6.7 (got ${features.deltaB})`);
  assert(features.deltaE > 0, `ΔE is positive (${features.deltaE})`);

  // Test 2: RGB to CIELAB Conversion
  console.log('\nTest Group 2: sRGB → XYZ → CIELAB Conversion');
  const whiteLab = ColorAnalysisEngine.rgbToLab(255, 255, 255);
  assert(whiteLab.L >= 99.0, `Pure white has L* ≈ 100 (got ${whiteLab.L})`);
  const blackLab = ColorAnalysisEngine.rgbToLab(0, 0, 0);
  assert(blackLab.L <= 1.0, `Pure black has L* ≈ 0 (got ${blackLab.L})`);

  // Test 3: Risk Classification Engine
  console.log('\nTest Group 3: Risk Classification & Safety Gating');
  const riskEngine = new RiskClassificationEngine({
    version: '1.0',
    normalMax: 5.0,
    elevatedMax: 15.0,
    highMax: 20.0,
    criticalThreshold: 20.0,
    unit: 'ppm·h',
    effectiveFrom: new Date().toISOString(),
  });

  assert(riskEngine.classify(3.2, ValidityStatus.VALID) === RiskStatus.NORMAL, '3.2 ppm·h classifies as NORMAL');
  assert(riskEngine.classify(12.4, ValidityStatus.VALID) === RiskStatus.ELEVATED, '12.4 ppm·h classifies as ELEVATED');
  assert(riskEngine.classify(18.6, ValidityStatus.VALID) === RiskStatus.HIGH, '18.6 ppm·h classifies as HIGH');
  assert(riskEngine.classify(24.8, ValidityStatus.VALID) === RiskStatus.CRITICAL, '24.8 ppm·h classifies as CRITICAL');
  
  // Safety Invariants: Invalid scan must never be classified as Normal/Safe
  assert(riskEngine.classify(null, ValidityStatus.INVALID_IMAGE) === RiskStatus.INVALID, 'Invalid image does not classify as safe');
  assert(riskEngine.classify(null, ValidityStatus.OUT_OF_RANGE) === RiskStatus.OUT_OF_RANGE, 'Out-of-range does not extrapolate');

  // Test 4: Mock Inference Engine Determinism
  console.log('\nTest Group 4: Inference Engine Determinism');
  const inferenceEngine = new MockInferenceEngine();
  const normalPred1 = inferenceEngine.predictForScenario(DemoScenario.NORMAL);
  const normalPred2 = inferenceEngine.predictForScenario(DemoScenario.NORMAL);
  assert(normalPred1.estimatedDose === normalPred2.estimatedDose, 'Normal scenario inference is deterministic');
  assert(normalPred1.source === 'SIMULATED', 'Inference source is explicitly tagged SIMULATED');

  const invalidPred = inferenceEngine.predictForScenario(DemoScenario.INVALID);
  assert(invalidPred.estimatedDose === null, 'Invalid scenario produces null dose (no fabricated numbers)');
  assert(invalidPred.validity === ValidityStatus.INVALID_IMAGE, 'Invalid scenario reports INVALID_IMAGE validity');

  // Test 5: End-to-End Pipeline Execution
  console.log('\nTest Group 5: End-to-End Pipeline Execution');
  const pipeline = new ScanProcessingPipeline();
  const scan = await pipeline.processScenario(
    DemoScenario.ELEVATED,
    'worker-test-01',
    'shift-test-01',
    'DOS-TEST-001'
  );

  assert(scan.exposureResult !== null, 'Scan contains exposureResult');
  assert(scan.exposureResult?.riskStatus === RiskStatus.ELEVATED, 'Scan exposureResult risk is ELEVATED');
  assert(scan.exposureResult?.estimatedDose === 12.4, 'Scan dose is 12.4 ppm·h');
  assert(scan.exposureResult?.estimatedTwa === 1.6, '8h TWA calculated as 1.6 ppm (12.4 / 8)');
  assert(scan.colorFeatures !== null, 'Scan contains extracted CIELAB color features');
  assert(scan.imageQuality !== null, 'Scan contains optical quality metrics');

  console.log('\n🎉 ALL 18 SCIENTIFIC TESTS PASSED SUCCESSFULLY!\n');
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
