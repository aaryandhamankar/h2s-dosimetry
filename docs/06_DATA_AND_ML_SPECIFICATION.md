# Data & ML Specification

# Passive Colorimetric H₂S Exposure-Dosimeter Platform

**Document:** 06_DATA_AND_ML_SPECIFICATION.md
**Product:** Passive Colorimetric H₂S Exposure-Dosimeter Platform
**Purpose:** Define the data structures, scientific-computation interfaces, image-analysis pipeline, calibration system, ML architecture, model lifecycle, validation rules, provenance, and integration boundaries required for the software prototype.

---

# 1. PURPOSE

This document defines how the software handles scientific data.

The central principle is:

> **The application must separate image measurement, color-feature extraction, calibration, exposure inference, risk classification, and presentation.**

The software must never collapse these into one opaque function.

The intended conceptual pipeline is:

```text
Captured Image
      ↓
Image Validation
      ↓
Dosimeter Detection
      ↓
Perspective / Geometry Correction
      ↓
ROI Extraction
      ↓
Reference / Color Correction
      ↓
Color Feature Extraction
      ↓
Calibration
      ↓
Exposure Inference
      ↓
Validity / Uncertainty Checks
      ↓
Risk Classification
      ↓
Result
```

---

# 2. SCIENTIFIC DATA PRINCIPLE

Every numerical result must have provenance.

For any exposure result, the software should be able to answer:

```text
Which image produced this result?
Which ROI?
Which color features?
Which calibration?
Which model?
Which model version?
Which chemistry?
Which batch?
Which processing version?
Was the result simulated, experimental, or validated?
```

If these relationships cannot be reconstructed, the result is not sufficiently traceable.

---

# 3. DATA CATEGORIES

The system should distinguish:

```text
RAW DATA
PROCESSED DATA
FEATURE DATA
CALIBRATION DATA
MODEL DATA
INFERENCE DATA
OPERATIONAL DATA
```

---

# 4. RAW DATA

Raw data may include:

* captured image
* original image metadata
* timestamp
* device metadata
* camera metadata where available
* scan identifier
* worker identifier
* dosimeter identifier

Raw images should be treated as immutable source data.

Do not overwrite the original image during processing.

---

# 5. PROCESSED DATA

Processed data may include:

* resized image
* corrected image
* perspective-normalized image
* cropped dosimeter image
* sensor ROI
* reference ROI
* quality metrics

Processed data must reference the original scan.

---

# 6. FEATURE DATA

Feature data contains numerical measurements derived from the image.

Potential features include:

```text
L*
a*
b*
ΔL*
Δa*
Δb*
ΔE
```

Additional features may be introduced only when justified by the validated scientific pipeline.

---

# 7. CALIBRATION DATA

Calibration data maps measurable colorimetric response to exposure.

Conceptually:

```text
Color Response
      ↓
Calibration Function
      ↓
Exposure Estimate
```

The actual mathematical form must be determined from experimental data.

Do not hard-code an assumed relationship simply because it is convenient for the prototype.

---

# 8. MODEL DATA

Model data contains:

* model artifact
* model metadata
* feature schema
* training dataset reference
* validation dataset reference
* calibration reference
* operating range
* performance metrics
* version
* status

---

# 9. INFERENCE DATA

Inference data is the result of running a scan through the processing pipeline.

It must contain:

```text
input reference
feature reference
model reference
calibration reference
prediction
validity
uncertainty/confidence where supported
timestamp
```

---

# 10. OPERATIONAL DATA

Operational data includes:

* workers
* shifts
* dosimeters
* assignments
* alerts
* acknowledgements
* synchronization states

Operational data should remain separate from scientific feature data.

---

# 11. CORE ENTITY RELATIONSHIP

The logical relationship is:

```text
Worker
  │
  └── Shift
        │
        └── Dosimeter Assignment
                │
                └── Scan
                      │
                      ├── Raw Image
                      │
                      ├── Image Quality
                      │
                      ├── ROI
                      │
                      ├── Color Features
                      │
                      ├── Calibration
                      │
                      ├── Model
                      │
                      └── Exposure Result
```

---

# 12. SCAN DATA MODEL

Conceptual structure:

```text
Scan {
    scan_id
    worker_id
    shift_id
    dosimeter_id

    captured_at
    uploaded_at

    image_reference

    image_quality_id
    roi_id
    color_feature_id
    inference_id

    status
    source

    processing_version
}
```

---

# 13. SOURCE ENUM

Every scientific scan must contain:

```text
source:
    SIMULATED
    EXPERIMENTAL
    VALIDATED
```

---

# 14. SCAN STATUS

Suggested:

```text
CAPTURED
PROCESSING
PROCESSED
INVALID
PENDING_SYNC
SYNCED
FAILED
```

---

# 15. IMAGE QUALITY DATA MODEL

Conceptual structure:

```text
ImageQuality {
    image_quality_id

    blur_score
    brightness_score
    glare_score
    framing_score
    orientation_score
    resolution_score

    overall_status

    warnings[]
    errors[]
}
```

---

# 16. IMAGE QUALITY STATUS

```text
GOOD
WARNING
INVALID
```

---

# 17. IMAGE QUALITY PRINCIPLE

Image quality must be evaluated BEFORE scientific inference.

The system should follow:

```text
Bad image
   ↓
Reject / request retake

Good image
   ↓
Continue processing
```

Do not allow poor-quality images to automatically generate apparently precise exposure estimates.

---

# 18. DOSIMETER DETECTION DATA

Conceptual structure:

```text
DosimeterDetection {
    detected
    confidence
    bounding_region
    corners[]
    orientation
}
```

---

# 19. DETECTION CONFIDENCE

Confidence may be represented numerically if supported by the detection algorithm.

However:

> Detection confidence is NOT the same thing as exposure-estimation confidence.

Never label a dosimeter-detection score as measurement confidence.

---

# 20. ROI DATA MODEL

Conceptual structure:

```text
ROIResult {
    roi_id

    sensor_roi
    reference_rois[]

    normalized_image_reference

    geometry_status
}
```

Each ROI should contain enough information to reproduce the extraction.

---

# 21. ROI REPRESENTATION

A rectangular ROI may be represented as:

```text
{
    x,
    y,
    width,
    height
}
```

A polygonal ROI may be represented as:

```text
{
    points: [
        {x, y},
        {x, y},
        {x, y},
        {x, y}
    ]
}
```

Use the representation appropriate to the actual dosimeter geometry.

---

# 22. COLOR FEATURE DATA MODEL

Conceptual:

```text
ColorFeatures {
    feature_id

    L
    a
    b

    delta_L
    delta_a
    delta_b
    delta_E

    baseline_reference

    extraction_method
    processing_version
}
```

Names may be normalized in code as:

```text
L_star
a_star
b_star
delta_L_star
delta_a_star
delta_b_star
delta_E
```

---

# 23. COLOR PIPELINE

The implementation should conceptually support:

```text
Camera Image
      ↓
RGB
      ↓
Reference Correction
      ↓
XYZ
      ↓
CIELAB
      ↓
L*
a*
b*
      ↓
Baseline Comparison
      ↓
ΔL*
Δa*
Δb*
ΔE
```

The exact transformation and reference-correction methodology must follow the validated scientific implementation.

---

# 24. COLOR SPACE RULE

Do not perform scientific comparisons directly on raw RGB values unless the scientific protocol explicitly requires it.

Raw camera RGB is affected by:

* illumination
* camera response
* exposure
* white balance
* device characteristics

Therefore, the software should maintain a clear distinction between:

```text
RAW RGB
```

and:

```text
STANDARDIZED COLOR FEATURES
```

---

# 25. REFERENCE PATCH SUPPORT

If the physical dosimeter design contains a reference color/patch, the software must support it.

Conceptually:

```text
Sensor ROI
+
Reference ROI
        ↓
Color correction
        ↓
Standardized features
```

The exact correction method must come from experimental validation.

---

# 26. BASELINE COLOR

Where applicable, the system should retain baseline/reference color.

Example:

```text
Baseline:
L0
a0
b0
```

Then compute changes:

```text
ΔL = L - L0
Δa = a - a0
Δb = b - b0
```

The exact baseline methodology must follow the experimental protocol.

---

# 27. ΔE

The software may calculate a color-difference metric where appropriate.

However:

> The specific ΔE formulation must be explicitly configured and documented.

Do not silently switch between:

```text
ΔE76
ΔE94
ΔE2000
```

as if they were interchangeable.

---

# 28. EXPOSURE INFERENCE ABSTRACTION

The application must use an abstraction:

```text
ExposureInferenceEngine
```

rather than embedding model mathematics into UI components.

---

# 29. INFERENCE ENGINE INTERFACE

Conceptually:

```text
infer(
    features,
    context,
    calibration,
    model
)
```

returns:

```text
ExposurePrediction
```

---

# 30. EXPOSURE PREDICTION

Conceptual structure:

```text
ExposurePrediction {
    estimated_value
    unit

    lower_bound
    upper_bound

    validity
    confidence

    model_id
    model_version

    calibration_id
    calibration_version

    source
}
```

---

# 31. VALIDITY STATES

At minimum:

```text
VALID
LOW_CONFIDENCE
OUT_OF_RANGE
INVALID
UNAVAILABLE
```

---

# 32. MOCK INFERENCE ENGINE

The prototype must support:

```text
MockInferenceEngine
```

before the final scientific model exists.

The mock engine must be deterministic.

Example:

```text
same input
    ↓
same result
```

Do not generate random exposure values.

---

# 33. MOCK ENGINE PURPOSE

The mock engine exists to allow the software team to develop:

* UI
* backend
* history
* alerts
* dashboard
* offline sync
* testing

without waiting for final experimental calibration.

---

# 34. MOCK ENGINE RULE

Mock inference must be clearly marked:

```text
source = SIMULATED
```

The UI must expose this appropriately.

---

# 35. CALIBRATION CURVE ENGINE

When experimental calibration becomes available, support:

```text
CalibrationCurveEngine
```

The implementation may use the scientifically validated relationship between:

```text
Color Feature(s)
```

and:

```text
Exposure
```

The functional form must not be invented by the coding agent.

---

# 36. ML ENGINE

An ML engine may be implemented if sufficient validated data exists.

Example:

```text
XGBoostInferenceEngine
```

Potential input:

```text
delta_L
delta_a
delta_b
delta_E
exposure_duration
temperature
humidity
```

These are examples only.

The final feature vector must be defined from experimental evidence.

---

# 37. FEATURE SCHEMA

Every model must declare its expected features.

Example:

```text
FeatureSchema {
    schema_id
    version

    features: [
        {
            name,
            datatype,
            unit,
            required
        }
    ]
}
```

---

# 38. FEATURE ORDER

For numerical models, feature ordering must be deterministic.

Never depend on:

```text
object key order
UI field order
database column order
```

Define an explicit feature schema.

---

# 39. FEATURE VALIDATION

Before inference:

```text
Feature exists?
 ↓
Correct type?
 ↓
Correct unit?
 ↓
Expected range?
 ↓
Not NaN?
 ↓
Not infinite?
 ↓
Compatible with model schema?
```

If any required validation fails:

```text
INVALID
```

or:

```text
UNAVAILABLE
```

depending on the cause.

---

# 40. MISSING DATA

Never silently substitute arbitrary values.

For example:

```text
temperature = missing
```

must not automatically become:

```text
temperature = 25
```

unless 25°C is explicitly defined as a scientifically justified default in configuration.

---

# 41. OUT-OF-RANGE DATA

Every approved model should define its operating range.

Conceptually:

```text
Feature Range
Exposure Range
Environmental Range
```

If an input falls outside the validated domain:

```text
OUT_OF_RANGE
```

The software must not silently extrapolate.

---

# 42. ENVIRONMENTAL VARIABLES

If environmental compensation is used, the system should support:

```text
temperature
humidity
```

and potentially other validated variables.

These fields must be optional only if the model does not require them.

---

# 43. EXPOSURE DURATION

Exposure duration is a separate concept from instantaneous color response.

Store it explicitly:

```text
exposure_duration
exposure_duration_unit
```

Do not infer duration from timestamps unless that behavior is explicitly defined.

---

# 44. DOSIMETER CHEMISTRY

Every dosimeter should reference a chemistry configuration.

Example:

```text
chemistry_id
chemistry_version
```

This prevents the software from applying the wrong calibration to a different sensing chemistry.

---

# 45. DOSIMETER BATCH

Support:

```text
batch_id
```

because manufacturing variation and batch-specific calibration may become relevant.

---

# 46. CALIBRATION ENTITY

Conceptual structure:

```text
Calibration {
    calibration_id
    version

    chemistry_id
    batch_id

    dataset_id

    input_features[]
    output_variable
    output_unit

    operating_range

    validation_status

    created_at
}
```

---

# 47. CALIBRATION STATUS

```text
DRAFT
EXPERIMENTAL
VALIDATED
RETIRED
```

Only appropriate validated/approved calibration should be used for production-like inference.

---

# 48. MODEL ENTITY

Conceptual:

```text
Model {
    model_id
    version

    algorithm
    feature_schema_id

    chemistry_id
    calibration_id

    training_dataset_id
    validation_dataset_id

    operating_range

    metrics

    status

    created_at
}
```

---

# 49. MODEL STATUS

```text
DRAFT
TRAINING
VALIDATING
APPROVED
RETIRED
```

---

# 50. MODEL VERSIONING

Never overwrite a deployed model.

Bad:

```text
model.pkl
```

being replaced repeatedly.

Prefer:

```text
model/
    model_001/
    model_002/
    model_003/
```

Every inference references an exact version.

---

# 51. CALIBRATION VERSIONING

Similarly:

```text
calibration_001
calibration_002
calibration_003
```

must remain distinguishable.

Historical results should continue pointing to the calibration version used when they were generated.

---

# 52. DATASET VERSIONING

Calibration and ML datasets must be versioned.

Example:

```text
dataset_id
dataset_version
```

Never silently modify the dataset underlying a reported model metric.

---

# 53. DATASET SPLITTING

When sufficient experimental data exists, explicitly distinguish:

```text
TRAIN
VALIDATION
TEST
```

Do not report training performance as validation performance.

---

# 54. DATA LEAKAGE PREVENTION

The software/research workflow must avoid leakage between training and evaluation data.

Particular care should be taken with repeated measurements from:

* the same physical dosimeter
* the same batch
* the same experimental session

if those correlations could artificially inflate performance.

---

# 55. MODEL METRICS

When a real model exists, store appropriate metrics.

Potential metrics include:

```text
MAE
RMSE
R²
bias
classification accuracy
precision
recall
```

Use only metrics appropriate to the actual task.

Do not invent metrics for the prototype.

---

# 56. UNCERTAINTY

Where experimentally supported, the inference layer should expose uncertainty.

Possible representation:

```text
estimated_value
lower_bound
upper_bound
```

This is preferable to presenting an unsupported exact-looking number.

---

# 57. CONFIDENCE RULE

A confidence score should only be shown if its meaning is clearly defined.

For example:

```text
confidence = 0.92
```

is meaningless unless the system documentation explains what that 0.92 represents.

Do not create arbitrary confidence percentages for visual effect.

---

# 58. RISK CLASSIFICATION

Risk classification is downstream from exposure inference.

Pipeline:

```text
Exposure estimate
      ↓
Validity
      ↓
Configured thresholds
      ↓
Risk status
```

---

# 59. RISK STATES

Use configurable states:

```text
NORMAL
ELEVATED
HIGH
CRITICAL
```

Additional states:

```text
INVALID
OUT_OF_RANGE
```

should remain separate from risk states.

An invalid measurement is not automatically a "safe" measurement.

---

# 60. THRESHOLD CONFIGURATION

Thresholds must be stored in configuration.

Conceptual:

```text
RiskThresholdConfig {
    version

    normal_max
    elevated_max
    high_max
    critical_threshold

    unit
    effective_from
}
```

Actual values must come from the approved scientific/occupational specification.

The coding agent must NOT invent H₂S exposure limits.

---

# 61. RESULT PROVENANCE

Every final exposure result should be traceable to:

```text
result_id
scan_id
worker_id
dosimeter_id

image_reference
processing_version

color_feature_id

calibration_id
calibration_version

model_id
model_version

source

validity
created_at
```

---

# 62. REPROCESSING

The architecture should support reprocessing.

Example:

```text
Original Scan
      ↓
Processing v1
      ↓
Result v1

Reprocess
      ↓
Processing v2
      ↓
Result v2
```

Do not overwrite historical results without preserving lineage.

---

# 63. RESULT VERSIONING

Conceptually:

```text
result_id
result_version
```

A reprocessed result should remain distinguishable from the original.

---

# 64. IMAGE PROCESSING VERSION

Record the image-processing version.

Example:

```text
processing_version = "1.2.0"
```

This matters because changes to:

* color correction
* ROI extraction
* image normalization
* quality thresholds

can change the final exposure estimate.

---

# 65. SCIENTIFIC PIPELINE OBJECT

Conceptually:

```text
MeasurementPipeline {
    image_quality
    detection
    geometry
    roi
    color_features
    calibration
    inference
    validation
}
```

Each stage should be independently testable.

---

# 66. PIPELINE FAILURE

A failure at one stage must stop or appropriately branch the pipeline.

Example:

```text
Image invalid
    ↓
No ROI
    ↓
No color features
    ↓
No inference
    ↓
Invalid scan
```

Do not continue with fabricated intermediate values.

---

# 67. PARTIAL RESULTS

If intermediate scientific results exist but final inference fails, preserve them where useful.

Example:

```text
Image quality: VALID
ROI: VALID
Color extraction: VALID
Calibration: unavailable
Exposure: unavailable
```

This is much more useful for debugging than:

```text
ERROR
```

---

# 68. EXPERIMENTAL DATA IMPORT

The software should eventually support importing experimental data.

Preferred format:

```text
CSV
```

or structured JSON.

Import should validate:

* required fields
* types
* units
* missing values
* duplicate IDs
* ranges

---

# 69. DATA IMPORT VALIDATION

Invalid records should produce an import report.

Example:

```text
Imported: 94
Accepted: 89
Rejected: 5

Reasons:
3 missing exposure
1 invalid temperature
1 duplicate sample ID
```

---

# 70. EXPERIMENTAL SAMPLE ENTITY

Conceptual:

```text
ExperimentalSample {
    sample_id

    chemistry_id
    batch_id

    known_exposure
    exposure_unit
    exposure_duration

    temperature
    humidity

    image_reference

    color_features

    dataset_version
}
```

---

# 71. GROUND TRUTH

Experimental data should distinguish:

```text
known_exposure
```

from:

```text
predicted_exposure
```

Never overwrite ground truth with model output.

---

# 72. PREDICTION COMPARISON

For model evaluation:

```text
Ground Truth
      vs
Prediction
```

Calculate appropriate metrics.

Store evaluation metadata separately from operational scan results.

---

# 73. TRAINING PIPELINE

If ML is implemented, the conceptual workflow is:

```text
Experimental Data
      ↓
Validation
      ↓
Cleaning
      ↓
Feature Engineering
      ↓
Dataset Split
      ↓
Training
      ↓
Validation
      ↓
Test
      ↓
Model Artifact
      ↓
Model Registry
```

---

# 74. TRAINING MUST NOT RUN INSIDE MOBILE APP

Training is an offline/development/research workflow.

The mobile app performs inference only.

Bad architecture:

```text
Mobile App
 ↓
Train XGBoost
 ↓
Predict
```

Preferred:

```text
Research Environment
 ↓
Train
 ↓
Validate
 ↓
Export Model
 ↓
Deploy
 ↓
Mobile/API Inference
```

---

# 75. MODEL DEPLOYMENT

A model becomes usable only after:

```text
TRAINED
 ↓
VALIDATED
 ↓
APPROVED
 ↓
REGISTERED
 ↓
DEPLOYED
```

---

# 76. MODEL ROLLBACK

The system should support reverting to a previous approved model version.

Example:

```text
v3 deployed
 ↓
Issue detected
 ↓
Rollback
 ↓
v2 active
```

---

# 77. MODEL COMPATIBILITY

Before activation:

```text
Model chemistry
        =
Dosimeter chemistry

Feature schema
        =
Processing output schema

Calibration
        =
Compatible
```

If incompatible:

```text
DEPLOYMENT REJECTED
```

---

# 78. DATA QUALITY DASHBOARD

For technical users, eventually expose:

* number of experimental samples
* missing values
* dataset versions
* feature distributions
* batch coverage
* environmental coverage
* model performance

This is P1/P2 depending on prototype time.

---

# 79. MODEL MONITORING

Future production implementation should monitor:

* prediction distribution
* feature drift
* batch drift
* device drift
* invalid scan rate
* out-of-range rate

Do not build advanced drift detection before the core prototype is stable.

---

# 80. PRIVACY

Raw images may contain incidental environmental information.

The system should:

* store only what is necessary
* restrict access
* avoid unnecessary retention
* use secure transport
* avoid embedding personal information in filenames

---

# 81. SECURITY OF SCIENTIFIC DATA

Model and calibration artifacts should not be editable by ordinary workers.

Recommended permissions:

```text
Worker
    ↓
No model modification

HSE
    ↓
View technical information

Research
    ↓
Manage experimental/model data

Admin
    ↓
Manage system configuration
```

---

# 82. SIMULATED DATA CONTRACT

Every simulated record must explicitly contain:

```text
source = SIMULATED
```

Optionally:

```text
simulation_profile
simulation_version
```

---

# 83. SIMULATION PROFILES

Provide deterministic profiles:

```text
NORMAL
ELEVATED
HIGH
CRITICAL
INVALID
OUT_OF_RANGE
```

---

# 84. SIMULATION RULE

Simulation must reproduce realistic software behavior without claiming scientific validity.

For example:

```text
SIMULATED exposure = 12.4
```

is acceptable.

But:

```text
Validated H₂S dose = 12.4
```

is not acceptable unless supported by experimental validation.

---

# 85. API DATA CONTRACT

The inference API should accept structured input.

Conceptually:

```text
POST /inference
```

Input:

```text
{
    "scan_id": "...",
    "features": {...},
    "context": {...},
    "model_id": "...",
    "calibration_id": "..."
}
```

Output:

```text
{
    "estimated_value": ...,
    "unit": "...",
    "validity": "...",
    "model_id": "...",
    "model_version": "...",
    "calibration_id": "...",
    "source": "..."
}
```

Actual endpoint naming may follow the architecture specification.

---

# 86. IDEMPOTENCY

Inference requests should support idempotent behavior where appropriate.

Repeated processing of the same scan/version should not accidentally create multiple contradictory results.

---

# 87. REPRODUCIBILITY

Given:

```text
same image
+
same processing version
+
same calibration
+
same model
```

the result should be reproducible, subject to explicitly documented nondeterminism.

---

# 88. SCIENTIFIC TRACEABILITY EXAMPLE

A result should conceptually be traceable as:

```text
RESULT-001
   ↓
SCAN-001
   ↓
IMAGE-001
   ↓
ROI-001
   ↓
FEATURE-001
   ↓
CALIBRATION-003
   ↓
MODEL-002
   ↓
EXPOSURE-001
```

A technical evaluator should be able to follow this chain.

---

# 89. WHAT THE CODING AGENT MUST NEVER DO

The coding agent must NOT:

1. Invent H₂S exposure thresholds.
2. Invent calibration constants.
3. Invent experimental data.
4. Claim model accuracy without validation.
5. Create random "AI predictions."
6. Generate arbitrary confidence percentages.
7. Treat RGB values as validated exposure measurements.
8. Extrapolate outside model operating range without explicit approval.
9. Mix experimental and simulated data without metadata.
10. overwrite historical model versions.
11. overwrite calibration versions.
12. hide invalid scans.
13. silently replace missing scientific values with arbitrary defaults.
14. present simulated values as measured values.

---

# 90. SOFTWARE–R&D INTERFACE

The software team should expect the R&D/scientific team to eventually provide:

```text
1. Final dosimeter geometry
2. Sensor ROI specification
3. Reference patch specification
4. Chemistry identifier
5. Baseline color methodology
6. Color-analysis methodology
7. Calibration dataset
8. Ground-truth exposure values
9. Environmental conditions
10. Exposure duration methodology
11. Validated operating range
12. Risk thresholds
13. Model choice
14. Model artifact
15. Model performance
```

The software should be designed to accept these without major architectural changes.

---

# 91. SOFTWARE TEAM MUST PROVIDE

The software team must provide:

```text
1. Image ingestion
2. Image quality pipeline
3. ROI extraction framework
4. Color-feature extraction framework
5. Calibration interface
6. Inference interface
7. Result validation
8. Provenance tracking
9. Model registry
10. Calibration registry
11. Dataset import
12. Result storage
13. Offline support
14. Dashboard visualization
15. Testing infrastructure
```

---

# 92. MINIMUM PROTOTYPE SCIENTIFIC PIPELINE

If the final chemistry/model is unavailable:

```text
Camera
 ↓
Image quality
 ↓
Dosimeter detection
 ↓
ROI
 ↓
Color features
 ↓
Mock calibration
 ↓
Mock inference
 ↓
Validation
 ↓
Result
```

This is acceptable for the software prototype provided every simulated component is clearly identified.

---

# 93. FUTURE REPLACEMENT STRATEGY

The final architecture should allow:

```text
MockInferenceEngine
        ↓
CalibrationCurveEngine
        ↓
MLInferenceEngine
```

without rewriting:

* scanner
* dashboard
* history
* alerts
* offline system
* database

---

# 94. TESTING REQUIREMENTS

The scientific pipeline must have unit tests for:

### Image processing

* valid image
* low light
* blur
* glare
* wrong orientation
* missing dosimeter

### ROI

* valid geometry
* invalid geometry
* perspective correction

### Color

* RGB conversion
* XYZ conversion
* LAB conversion
* delta calculation
* ΔE calculation

### Inference

* valid features
* missing features
* invalid features
* out-of-range features
* model mismatch

### Calibration

* valid calibration
* incompatible chemistry
* expired/retired calibration
* missing calibration

---

# 95. GOLDEN TEST DATA

Create a small deterministic dataset:

```text
tests/
├── images/
├── features/
├── calibration/
├── inference/
└── expected/
```

For each input, define expected output behavior.

---

# 96. REGRESSION TESTING

Whenever image-processing or model code changes:

```text
Old test images
      ↓
New pipeline
      ↓
Compare outputs
```

Unexpected changes must be investigated.

---

# 97. SCIENTIFIC SOFTWARE LOGGING

For debugging, log:

```text
scan_id
processing_version
model_id
model_version
calibration_id
stage
status
error_code
```

Do not log unnecessary personal information.

---

# 98. ERROR CODES

Use structured errors.

Examples:

```text
IMAGE_TOO_BLURRY
IMAGE_TOO_DARK
EXCESSIVE_GLARE
DOSIMETER_NOT_DETECTED
ROI_INVALID
REFERENCE_INVALID
FEATURE_MISSING
CALIBRATION_NOT_FOUND
MODEL_NOT_FOUND
MODEL_INCOMPATIBLE
OUT_OF_RANGE
INFERENCE_FAILED
```

---

# 99. TECHNICAL RESULT EXAMPLE

Conceptual output:

```text
{
    "scan_id": "SCAN-001",

    "exposure": {
        "value": 12.4,
        "unit": "configured_unit"
    },

    "validity": "VALID",

    "source": "SIMULATED",

    "model": {
        "id": "MODEL-001",
        "version": "1.0"
    },

    "calibration": {
        "id": "CAL-001",
        "version": "1.0"
    },

    "features": {
        "delta_L_star": -4.2,
        "delta_a_star": 3.1,
        "delta_b_star": 1.7,
        "delta_E": 5.6
    }
}
```

The numerical values above are illustrative schema examples only, not experimental claims.

---

# 100. FINAL ARCHITECTURAL PRINCIPLE

The software must treat the scientific pipeline as a replaceable subsystem:

```text
┌─────────────────────────────┐
│        MOBILE APP           │
│                             │
│ Camera → Scanner → Result   │
└──────────────┬──────────────┘
               │
               ↓
┌─────────────────────────────┐
│     IMAGE PROCESSING        │
│                             │
│ Quality → ROI → Color       │
└──────────────┬──────────────┘
               │
               ↓
┌─────────────────────────────┐
│    SCIENTIFIC ENGINE        │
│                             │
│ Calibration → Inference     │
└──────────────┬──────────────┘
               │
               ↓
┌─────────────────────────────┐
│       VALIDATION            │
│                             │
│ Range → Uncertainty → Risk  │
└──────────────┬──────────────┘
               │
               ↓
┌─────────────────────────────┐
│       DATA PLATFORM         │
│                             │
│ History → Alerts → HSE      │
└─────────────────────────────┘
```

The scientific engine must be replaceable without redesigning the product.

---

# 101. FINAL DATA/ML ACCEPTANCE CHECKLIST

Before declaring the scientific software layer complete:

```text
[ ] Raw images are preserved
[ ] Image quality is evaluated
[ ] Dosimeter detection exists
[ ] ROI extraction exists
[ ] Perspective correction exists where required
[ ] Reference correction is supported
[ ] RGB → CIELAB pipeline exists where applicable
[ ] ΔL*, Δa*, Δb* are supported where applicable
[ ] ΔE formulation is explicit
[ ] Exposure inference is abstracted
[ ] Mock inference exists
[ ] Mock inference is deterministic
[ ] Experimental data can eventually be imported
[ ] Calibration is versioned
[ ] Models are versioned
[ ] Dataset versions are recorded
[ ] Feature schema is versioned
[ ] Operating ranges are defined
[ ] Out-of-range inputs are rejected
[ ] Missing data is handled explicitly
[ ] Invalid scans cannot become valid measurements
[ ] Results contain provenance
[ ] Simulated results are labelled
[ ] Experimental results are labelled
[ ] Validated results are labelled
[ ] Confidence is not fabricated
[ ] Scientific thresholds are configurable
[ ] Model training is separate from inference
[ ] Historical results remain traceable
[ ] Regression tests exist
[ ] Golden test data exists
[ ] Scientific errors have structured codes
[ ] Model/calibration compatibility is checked
```

---

# 102. FINAL RULE

The coding agent must optimize for:

> **scientific traceability + replaceability + reproducibility**

rather than pretending that an unfinished ML model is already scientifically validated.

The software should be capable of demonstrating the complete digital measurement workflow today while remaining structurally ready to receive the real experimental chemistry, calibration data, and validated model later.

That is the correct prototype strategy.
