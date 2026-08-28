# Prototype Requirements Specification

# Passive Colorimetric H₂S Exposure-Dosimeter Platform

**Document:** 04_PROTOTYPE_REQUIREMENTS.md
**Product:** Passive Colorimetric H₂S Exposure-Dosimeter Platform
**Purpose:** Define every software, data, model, service, asset, and test requirement necessary to build and demonstrate the prototype.

---

# 1. PURPOSE

This document answers one practical question:

> **What exactly must exist for the software prototype to work end-to-end?**

The prototype must demonstrate a credible digital workflow from:

```text
Worker
  ↓
Shift
  ↓
Dosimeter
  ↓
Camera Scan
  ↓
Image Quality
  ↓
Sensor/ROI Detection
  ↓
Color Analysis
  ↓
Exposure Estimation
  ↓
Validation
  ↓
Risk Status
  ↓
History
  ↓
HSE Dashboard
  ↓
Alerts / Analytics / Reports
```

The prototype does not need production-scale infrastructure.

It does need a convincing, technically coherent, demonstrable end-to-end system.

---

# 2. PROTOTYPE SCOPE

## MUST EXIST

The prototype must contain:

### Mobile application

* Login
* Worker profile
* Shift management
* Dosimeter pairing
* Camera scanner
* Image-quality validation
* Dosimeter detection
* ROI detection
* Color analysis
* Exposure estimation
* Result screen
* Exposure history
* Offline operation
* Sync
* Error handling

### HSE dashboard

* Login
* Overview
* Worker list
* Worker exposure history
* Scan records
* Exposure visualization
* Risk indicators
* Alerts
* Filtering
* Search
* Report/export capability

### Scientific software layer

* image preprocessing
* color correction
* RGB → CIELAB
* ΔL*
* Δa*
* Δb*
* ΔE
* feature extraction
* calibration interface
* inference interface
* validation
* uncertainty/confidence representation where supported

### Backend

* authentication
* users
* workers
* shifts
* dosimeters
* scans
* exposure results
* alerts
* synchronization
* audit records
* model metadata
* calibration metadata

---

# 3. WHAT CAN BE SIMULATED

For the SIH prototype, the following may be simulated if physical validation is not yet available:

* sensor response
* calibration dataset
* exposure values
* ML predictions
* sample sensor images
* environmental conditions
* historical exposure records
* alert events
* worker/demo data

However, simulated values must NEVER be presented as experimentally validated measurements.

Use explicit metadata:

```text
data_source:
    REAL
    SIMULATED
    EXPERIMENTAL
```

And for results:

```text
result_status:
    VALIDATED
    EXPERIMENTAL
    SIMULATED
```

---

# 4. WHAT MUST NOT BE FAKED

The prototype must not falsely claim:

* validated H₂S concentration accuracy
* validated exposure accuracy
* validated occupational dose thresholds
* clinical/safety certification
* field validation
* ML performance that has not actually been measured
* experimentally established calibration coefficients
* real-time H₂S concentration measurement if the physical system is cumulative/passive
* actual hardware connectivity if no hardware integration exists

If a capability is simulated, label it.

---

# 5. DEVELOPMENT MODES

The application must support three logical modes.

## 5.1 DEMO MODE

Used for SIH demonstration.

Uses:

* seeded users
* sample images
* deterministic simulated inference
* preloaded exposure histories

All simulated results must visibly indicate:

**DEMO / SIMULATED**

---

## 5.2 EXPERIMENTAL MODE

Used while validating the physical prototype.

Allows:

* experimental sensor images
* experimental calibration data
* research metadata
* manual inspection

Results must be marked:

**EXPERIMENTAL**

---

## 5.3 REAL MODE

Reserved for validated deployment.

Uses:

* approved calibration
* approved model
* approved chemistry
* approved configuration

Only this mode may display results as validated operational measurements.

---

# 6. REQUIRED DEVELOPMENT SOFTWARE

The development machine should have:

### Required

* Git
* Node.js
* npm/pnpm
* Python 3.x
* PostgreSQL
* Android Studio
* Android SDK
* a code editor/IDE
* Expo tooling if using Expo
* Docker Desktop, if used for local services

### Recommended

* VS Code
* GitHub
* Postman/Insomnia
* Python virtual environment
* Jupyter
* OpenCV
* pytest

---

# 7. REQUIRED SOFTWARE PROJECTS

The implementation should contain at minimum:

```text
mobile/
dashboard/
api/
inference/
shared/
data/
models/
docs/
```

These should be part of one repository or a clearly documented multi-repository structure.

---

# 8. REQUIRED ENVIRONMENT FILES

Create:

```text
.env.example
```

Example variables:

```text
APP_ENV=
API_BASE_URL=
DATABASE_URL=
JWT_SECRET=
MODEL_PATH=
CALIBRATION_PATH=
STORAGE_PATH=
```

Do not commit real secrets.

---

# 9. REQUIRED SAMPLE DATA

The prototype requires deterministic sample data.

Create:

```text
data/
├── workers/
├── shifts/
├── dosimeters/
├── scans/
├── exposures/
├── alerts/
└── environments/
```

---

# 10. DEMO WORKERS

Create at least:

```text
Worker 001
Worker 002
Worker 003
Worker 004
Worker 005
```

Each worker should have:

* worker ID
* display name
* department
* site
* shift history
* dosimeter history
* exposure history

Use fictional data.

Do not use real employee information.

---

# 11. DEMO DOSIMETERS

Create multiple dosimeters.

Example:

```text
DOS-001
DOS-002
DOS-003
DOS-004
DOS-005
```

Each must contain:

* dosimeter ID
* batch
* chemistry
* activation time
* expiry time
* assigned worker
* status

Example statuses:

```text
ACTIVE
EXPIRED
UNASSIGNED
COMPLETED
```

---

# 12. DEMO EXPOSURE STATES

Create deterministic examples covering:

### Normal

```text
Exposure status:
NORMAL
```

### Elevated

```text
Exposure status:
ELEVATED
```

### High

```text
Exposure status:
HIGH
```

### Critical

```text
Exposure status:
CRITICAL
```

### Invalid

```text
Exposure status:
INVALID
```

### Out of range

```text
Exposure status:
OUT_OF_RANGE
```

The values used must come from configuration rather than arbitrary UI logic.

---

# 13. DEMO IMAGE DATASET

The scanner requires a controlled test image dataset.

Minimum categories:

```text
data/images/
├── valid/
├── low_light/
├── overexposed/
├── blurry/
├── glare/
├── rotated/
├── perspective/
├── missing_reference/
└── invalid/
```

Each image should have metadata.

Example:

```text
{
    "image_id": "IMG-001",
    "category": "valid",
    "expected_status": "VALID",
    "source": "SIMULATED",
    "notes": "Standard test image"
}
```

---

# 14. WHY THE IMAGE DATASET MATTERS

Do not test the scanner only with one perfect image.

The system needs to demonstrate that it can distinguish:

```text
GOOD IMAGE
     vs
BAD IMAGE
```

before attempting exposure estimation.

This is particularly important during an SIH demonstration because the evaluator may deliberately:

* move the phone
* rotate the dosimeter
* use poor lighting
* partially cover the sensor
* introduce glare

The application must respond gracefully.

---

# 15. REQUIRED CALIBRATION DATA

The scientific team should eventually provide experimentally generated calibration data.

Until then, create a clearly marked simulated dataset.

Required conceptual fields:

```text
sample_id
chemistry_id
batch_id
known_exposure
exposure_unit
exposure_duration
temperature
humidity
L*
a*
b*
ΔL*
Δa*
Δb*
ΔE
```

Additional scientifically justified features may be added.

---

# 16. CALIBRATION DATA RULE

Do NOT fabricate a dataset and describe it as experimental.

For demonstration:

```text
dataset_type = SIMULATED
```

For actual lab data:

```text
dataset_type = EXPERIMENTAL
```

---

# 17. CALIBRATION DATASET FORMAT

Preferred:

```text
CSV
```

Example:

```text
sample_id,chemistry_id,batch_id,exposure,duration,temperature,humidity,L,a,b,delta_L,delta_a,delta_b,delta_E
```

The exact fields may evolve with the validated scientific pipeline.

---

# 18. MODEL REQUIREMENTS

The software must support model artifacts independently of the application.

Create:

```text
models/
├── README.md
├── registry/
└── artifacts/
```

Each model must have metadata.

Example:

```text
model_id
model_version
algorithm
feature_schema_version
chemistry_id
calibration_id
training_dataset
validation_dataset
operating_range
metrics
status
```

---

# 19. DEMO MODEL

For the first functional prototype, use:

```text
MockInferenceEngine
```

or a deterministic calibration model.

Do not block UI development waiting for the final ML model.

The inference interface must be designed so the real model can later replace the mock.

---

# 20. OPTIONAL XGBOOST MODEL

If sufficient experimentally meaningful data exists, implement:

```text
XGBoostInferenceEngine
```

The model should consume a documented feature vector.

Example:

```text
[
    delta_L,
    delta_a,
    delta_b,
    delta_E,
    exposure_duration,
    temperature,
    humidity
]
```

Do not assume these are the final features.

The final feature set must follow validated research results.

---

# 21. MODEL OUTPUT CONTRACT

Every inference engine must return:

```text
{
    "estimated_dose": number | null,
    "unit": string | null,
    "lower_bound": number | null,
    "upper_bound": number | null,
    "confidence": number | null,
    "validity": "VALID" | "LOW_CONFIDENCE" | "OUT_OF_RANGE" | "INVALID",
    "model_id": string,
    "model_version": string,
    "source": "SIMULATED" | "EXPERIMENTAL" | "VALIDATED"
}
```

Never manufacture confidence values merely to make the UI look impressive.

---

# 22. CALIBRATION REQUIREMENTS

The prototype must have a calibration abstraction.

Example:

```text
CalibrationEngine
```

It should support:

```text
getCalibration()
validateRange()
transformFeatures()
estimateExposure()
```

The actual mathematical implementation may initially be simulated.

---

# 23. RISK THRESHOLD CONFIGURATION

Thresholds must live in configuration.

Example conceptual structure:

```text
risk_thresholds:
    normal:
    elevated:
    high:
    critical:
```

Do not write:

```text
if dose > 10:
```

inside a React component.

---

# 24. REQUIRED DATABASE SEED

Provide a seed script that creates:

* demo users
* demo workers
* demo shifts
* demo dosimeters
* demo batches
* demo scans
* demo exposure results
* demo alerts
* demo calibration
* demo model metadata

One command should populate the complete demo environment.

Example:

```text
npm run seed
```

or equivalent.

---

# 25. RESETTABLE DEMO ENVIRONMENT

The demo environment must be resettable.

Provide:

```text
seed
reset
```

commands.

The evaluator should be able to restore the application to a known state before a demonstration.

---

# 26. REQUIRED API MOCKING

During frontend development, provide a mock API layer.

This allows:

```text
Frontend
   ↓
Mock API
```

before:

```text
Frontend
   ↓
Real backend
```

The frontend must not contain hardcoded fake API responses spread across components.

---

# 27. REQUIRED OFFLINE DEMO

The prototype must demonstrate:

```text
Internet ON
   ↓
Scan
   ↓
Internet OFF
   ↓
Scan saved locally
   ↓
Internet ON
   ↓
Automatic synchronization
```

The UI should visibly communicate synchronization state.

---

# 28. REQUIRED SYNC STATES

Display:

```text
SYNCED
SYNCING
PENDING
FAILED
```

Example:

```text
Scan #124
✓ Synced
```

or:

```text
Scan #125
↻ Waiting for connection
```

---

# 29. CAMERA REQUIREMENTS

The mobile app needs:

* camera permission
* camera preview
* capture
* retake
* image validation
* processing state
* result

The scanner must not immediately accept every image.

---

# 30. SCANNER GUIDANCE

During scanning, show contextual guidance.

Examples:

```text
Move closer
```

```text
Hold steady
```

```text
Too much glare
```

```text
Dosimeter not detected
```

```text
Good framing — capture
```

This should be generated from actual image-quality state.

---

# 31. REQUIRED SCAN FLOW

The canonical user journey:

```text
Open scanner
     ↓
Camera permission
     ↓
Scanner guidance
     ↓
Detect dosimeter
     ↓
Check image quality
     ↓
Check geometry
     ↓
Detect reference
     ↓
Enable capture
     ↓
Capture
     ↓
Process
     ↓
Analyze
     ↓
Validate
     ↓
Result
```

---

# 32. RESULT SCREEN REQUIREMENTS

The result screen must display:

### Primary

* exposure result
* exposure status
* validity

### Secondary

* confidence/uncertainty if available
* scan time
* exposure duration
* dosimeter ID

### Technical details

Expandable section:

```text
Image quality
Color features
Calibration
Model
Processing version
```

This keeps the worker experience simple while preserving technical transparency.

---

# 33. INVALID RESULT UX

An invalid scan must not display a normal-looking exposure number.

Example:

```text
Unable to reliably analyze this scan.

Reason:
Excessive glare detected.

Please retake the scan.
```

---

# 34. OUT-OF-RANGE UX

If the model receives a value outside its validated domain:

```text
Exposure estimate unavailable

The measurement is outside the validated
operating range of this model.
```

Do not silently extrapolate.

---

# 35. DASHBOARD REQUIREMENTS

The HSE dashboard must contain:

## Overview

* active workers
* active dosimeters
* recent scans
* elevated exposure count
* open alerts

## Workers

* worker list
* current status
* exposure summary

## Exposure

* exposure history
* trends
* filtering

## Alerts

* severity
* worker
* time
* status

## Technical

* calibration
* model version
* processing status

---

# 36. DASHBOARD FILTERS

At minimum:

* date range
* worker
* department
* site
* exposure status
* dosimeter
* scan status

---

# 37. DASHBOARD SEARCH

Search should support:

```text
worker ID
worker name
dosimeter ID
scan ID
```

Search must be server-backed when using real data.

---

# 38. EXPOSURE VISUALIZATION

Use simple, interpretable charts.

Recommended:

### Worker exposure timeline

```text
Time → Exposure
```

### Site/department overview

```text
Normal
Elevated
High
Critical
```

### Recent exposure events

A table/list is often more useful than excessive charts.

Do not create dashboards full of decorative graphs.

---

# 39. ALERT REQUIREMENTS

Alerts should contain:

* severity
* worker
* exposure event
* timestamp
* reason
* acknowledgement status

Example:

```text
HIGH EXPOSURE

Worker: W-003
Dosimeter: DOS-004
Time: 14:32
Reason: Exposure exceeded configured threshold.
```

---

# 40. ALERT ACKNOWLEDGEMENT

HSE users should be able to:

```text
Acknowledge
```

an alert.

Store:

* user
* time
* alert ID

Do not delete the alert.

---

# 41. REPORT REQUIREMENTS

The prototype should support export of filtered data.

Minimum:

```text
CSV
```

Optional:

```text
PDF
```

CSV is sufficient for the first functional version.

---

# 42. REQUIRED REPORT FIELDS

Example:

```text
scan_id
worker_id
dosimeter_id
timestamp
exposure_duration
estimated_dose
unit
risk_status
validity
model_version
calibration_version
```

---

# 43. AUDIT REQUIREMENTS

At minimum record:

* login
* scan creation
* result creation
* calibration changes
* model changes
* threshold changes
* alert acknowledgement

---

# 44. TECHNICAL DEMO DATA

The prototype should include a scripted demonstration dataset.

Suggested storyline:

```text
Worker 001
 ↓
Starts shift
 ↓
Pairs DOS-001
 ↓
Performs scan
 ↓
Normal result

Worker 002
 ↓
Starts shift
 ↓
Pairs DOS-002
 ↓
Performs scan
 ↓
Elevated result
 ↓
HSE alert generated

Worker 003
 ↓
Scan
 ↓
High exposure
 ↓
HSE dashboard highlights worker

Worker 004
 ↓
Invalid image
 ↓
Retake requested

Worker 005
 ↓
Offline scan
 ↓
Sync after reconnection
```

---

# 45. DEMO SCRIPT

The software team should prepare a repeatable demonstration.

## Step 1

Login as Worker.

## Step 2

Start shift.

## Step 3

Pair dosimeter.

## Step 4

Open scanner.

## Step 5

Show scanner quality guidance.

## Step 6

Capture sample image.

## Step 7

Show processing.

## Step 8

Display exposure result.

## Step 9

Open technical details.

## Step 10

Demonstrate offline scan.

## Step 11

Restore network.

## Step 12

Show synchronization.

## Step 13

Login as HSE.

## Step 14

Show worker exposure.

## Step 15

Show alert.

## Step 16

Acknowledge alert.

This should take approximately 3–5 minutes.

---

# 46. REQUIRED ERROR DEMONSTRATIONS

Prepare deterministic examples for:

### Bad image

```text
Too blurry
```

### Glare

```text
Excessive glare
```

### Missing dosimeter

```text
Dosimeter not detected
```

### Expired dosimeter

```text
Dosimeter expired
```

### Out-of-range result

```text
Outside validated range
```

### Offline

```text
Waiting for synchronization
```

These demonstrate that the system is not merely a happy-path mockup.

---

# 47. REQUIRED DOCUMENTATION

The software repository should contain:

```text
README.md
SETUP.md
ARCHITECTURE.md
API.md
DEMO.md
DATA.md
MODEL.md
CALIBRATION.md
TESTING.md
TROUBLESHOOTING.md
```

---

# 48. README REQUIREMENTS

README must explain:

* what the system does
* architecture
* prerequisites
* installation
* environment setup
* running mobile
* running dashboard
* running backend
* seeding database
* demo credentials
* running tests

A new developer should be able to start the project without asking the original developer.

---

# 49. DEMO DOCUMENTATION

`DEMO.md` must explain:

* demo accounts
* demo flow
* sample scenarios
* how to reset demo data
* how to trigger each result state
* how to demonstrate offline sync

---

# 50. SCIENTIFIC DATA DOCUMENTATION

`DATA.md` must explicitly distinguish:

```text
SIMULATED DATA
EXPERIMENTAL DATA
VALIDATED DATA
```

Never mix them without labels.

---

# 51. MODEL DOCUMENTATION

`MODEL.md` must explain:

* model name
* version
* algorithm
* input features
* output
* training dataset
* validation dataset
* operating range
* metrics
* limitations

If no real model exists:

```text
MODEL STATUS: SIMULATION
```

---

# 52. CALIBRATION DOCUMENTATION

`CALIBRATION.md` must explain:

* calibration ID
* version
* chemistry
* batch
* input range
* output unit
* method
* dataset
* validation status

If simulated:

```text
CALIBRATION STATUS: SIMULATED
```

---

# 53. REQUIRED TEST FIXTURES

Create fixtures for:

```text
valid_scan
invalid_scan
blurry_scan
glare_scan
expired_dosimeter
out_of_range_scan
offline_scan
duplicate_scan
```

---

# 54. REQUIRED AUTOMATED TESTS

At minimum:

### Domain

* expiry
* TWA
* risk classification
* unit validation

### CV

* image quality
* ROI extraction
* perspective correction

### Color

* RGB conversion
* LAB conversion
* ΔE

### Inference

* valid input
* invalid input
* out-of-range input
* deterministic mock result

### API

* login
* authorization
* scan
* sync

---

# 55. ACCEPTANCE TEST

The complete prototype passes acceptance when:

```text
User can log in
        ↓
Start shift
        ↓
Pair dosimeter
        ↓
Scan
        ↓
Image validated
        ↓
Color features generated
        ↓
Exposure estimate generated
        ↓
Result stored
        ↓
History updated
        ↓
HSE dashboard updated
        ↓
Alert generated when appropriate
```

AND:

```text
Offline scan
        ↓
Local persistence
        ↓
Network restored
        ↓
Successful sync
```

---

# 56. PERFORMANCE ACCEPTANCE

For prototype purposes:

* scanner feedback should feel responsive
* processing should complete within a few seconds for normal test images
* dashboard should load quickly with demo dataset
* offline scan must save locally without network
* sync must recover automatically

These are software performance targets, not scientific response-time claims for the physical sensor.

---

# 57. ACCESSIBILITY REQUIREMENTS

The application should provide:

* readable typography
* sufficient contrast
* clear status labels
* icons paired with text
* error messages understandable without color alone

Do not communicate:

```text
red = bad
green = good
```

without accompanying text.

Use:

```text
HIGH
NORMAL
INVALID
```

alongside visual indicators.

---

# 58. LOCALIZATION READINESS

The UI should not hard-code text throughout logic.

Use a centralized text/translation layer so future languages can be added.

English is sufficient for the prototype.

---

# 59. DATA RETENTION

Prototype retention may be simple.

However, architecture should support future policies for:

* raw images
* scan records
* audit logs
* worker records
* exposure history

Do not permanently retain unnecessary raw imagery.

---

# 60. REQUIRED FILE/ASSET INVENTORY

Before final demo, the software team should have:

```text
[ ] Source code
[ ] Environment configuration
[ ] Database schema
[ ] Seed data
[ ] Sample images
[ ] Image metadata
[ ] Calibration dataset
[ ] Model artifact or mock model
[ ] Model metadata
[ ] API documentation
[ ] Test fixtures
[ ] Automated tests
[ ] Demo accounts
[ ] Demo script
[ ] README
[ ] Architecture documentation
```

---

# 61. MINIMUM VIABLE PROTOTYPE

If time becomes extremely limited, prioritize this:

```text
1. Mobile login
2. Worker home
3. Shift
4. Dosimeter pairing
5. Camera scanner
6. Image-quality validation
7. ROI extraction
8. Color analysis
9. Deterministic exposure inference
10. Result screen
11. Local storage
12. Offline sync
13. Backend
14. PostgreSQL
15. HSE dashboard
16. Exposure history
17. Alerts
```

Everything else is secondary.

---

# 62. WHAT TO CUT FIRST

If development time is running out, cut:

* advanced animations
* unnecessary profile customization
* complex reporting
* advanced user administration
* elaborate settings
* unnecessary charts
* complicated cloud infrastructure
* advanced ML experimentation inside the application

Do NOT cut:

* scanner validation
* result validity
* scientific traceability
* offline capability
* model/calibration versioning
* error handling
* auditability

---

# 63. WHAT TO BUILD FIRST

The fastest route to a credible prototype is:

```text
Scanner
   ↓
Image Processing
   ↓
Color Features
   ↓
Mock/Calibration Inference
   ↓
Result
```

Then connect:

```text
Result
   ↓
Backend
   ↓
Database
   ↓
Dashboard
```

Then add:

```text
Offline
Sync
Alerts
Reports
```

---

# 64. PROTOTYPE ARCHITECTURAL PRIORITY

Prioritize according to:

### P0 — Critical

Required for demo.

```text
Authentication
Scanner
Image validation
ROI
Color analysis
Inference abstraction
Result
Database
Dashboard
Offline storage
Sync
```

### P1 — Important

```text
Alerts
History
Filtering
Audit
Calibration registry
Model registry
CSV export
```

### P2 — Nice to have

```text
PDF reports
Advanced analytics
Device profiling
Advanced ML
Multi-site administration
Advanced localization
```

---

# 65. FINAL PROTOTYPE REQUIREMENT

The final software should NOT feel like:

> "A dashboard that pretends to read a sensor."

It should feel like:

> **A complete digital measurement workflow with a replaceable scientific inference engine.**

The prototype must therefore make the following pipeline visible and credible:

```text
PHYSICAL DOSIMETER
       ↓
CAMERA IMAGE
       ↓
IMAGE QUALITY
       ↓
GEOMETRY
       ↓
SENSOR ROI
       ↓
REFERENCE COLOR
       ↓
COLOR CORRECTION
       ↓
CIELAB FEATURES
       ↓
CALIBRATION / MODEL
       ↓
VALIDATION
       ↓
EXPOSURE ESTIMATE
       ↓
RISK CLASSIFICATION
       ↓
WORKER RECORD
       ↓
HSE DASHBOARD
       ↓
ALERT / ACTION
```

The system must always distinguish between:

```text
WHAT WAS ACTUALLY MEASURED
WHAT WAS COMPUTED
WHAT WAS INFERRED
WHAT WAS SIMULATED
WHAT HAS BEEN VALIDATED
```

That distinction is mandatory for a technically credible SIH prototype.
