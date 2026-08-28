# Feature Specification

# Passive Colorimetric H₂S Exposure-Dosimeter Platform

**Document:** 05_FEATURE_SPECIFICATION.md
**Product:** Passive Colorimetric H₂S Exposure-Dosimeter Platform
**Purpose:** Define the exact functional behavior, user flows, UI states, technical behavior, edge cases, and acceptance criteria for the software prototype.

---

# 1. HOW TO USE THIS DOCUMENT

This document is the implementation-level feature contract.

The coding agent MUST use this document together with:

```text
01_PRD.md
02_VISUAL_DESIGN.md
03_TECHNICAL_ARCHITECTURE.md
04_PROTOTYPE_REQUIREMENTS.md
```

The coding agent must NOT treat a feature as complete merely because:

* a screen exists
* a button works
* mock data appears
* an API endpoint exists
* a chart renders

A feature is complete only when its full behavior, states, validation, persistence, error handling, and acceptance criteria are satisfied.

---

# 2. FEATURE PRIORITY SYSTEM

Each feature is classified as:

### P0 — Critical

Must work in the SIH prototype.

### P1 — Important

Should work in the prototype unless time-constrained.

### P2 — Enhancement

Can be implemented after the core workflow is stable.

---

# 3. CORE PRODUCT FLOW

The central workflow is:

```text
LOGIN
  ↓
WORKER HOME
  ↓
START SHIFT
  ↓
PAIR DOSIMETER
  ↓
SCAN
  ↓
IMAGE QUALITY CHECK
  ↓
DOSIMETER DETECTION
  ↓
ROI EXTRACTION
  ↓
COLOR ANALYSIS
  ↓
EXPOSURE INFERENCE
  ↓
VALIDATION
  ↓
RESULT
  ↓
HISTORY
  ↓
SYNC
  ↓
HSE DASHBOARD
  ↓
ALERT / ACTION
```

Every P0 feature must support this workflow.

---

# 4. FEATURE INVENTORY

## P0

```text
F-001 Authentication
F-002 Worker Home
F-003 Shift Management
F-004 Dosimeter Pairing
F-005 Scanner
F-006 Image Quality Assessment
F-007 Dosimeter Detection
F-008 ROI Extraction
F-009 Color Analysis
F-010 Exposure Inference
F-011 Result Validation
F-012 Result Screen
F-013 Exposure History
F-014 Offline Storage
F-015 Synchronization
F-016 HSE Dashboard
F-017 Worker Monitoring
F-018 Exposure Analytics
F-019 Alerts
```

## P1

```text
F-020 Search & Filtering
F-021 Audit Trail
F-022 Model Registry
F-023 Calibration Registry
F-024 CSV Export
F-025 Technical Scan Details
F-026 Demo Mode
F-027 Experimental Mode
```

## P2

```text
F-028 PDF Reports
F-029 Device Profiles
F-030 Advanced Analytics
F-031 Advanced Administration
F-032 Localization
```

---

# 5. F-001 AUTHENTICATION

**Priority:** P0

## Purpose

Allow authorized users to enter the application according to their role.

---

## User types

```text
WORKER
HSE
ADMIN
RESEARCH
```

---

## Login screen

Required:

* application identity
* username/email
* password
* login button
* loading state
* error state

Optional:

* remember session
* demo login

---

## Valid login

Flow:

```text
Enter credentials
      ↓
Validate
      ↓
Authenticate
      ↓
Retrieve user profile
      ↓
Determine role
      ↓
Route to correct home
```

---

## Invalid login

Display:

```text
Unable to sign in.
Check your credentials and try again.
```

Do not reveal whether the username or password specifically was incorrect.

---

## Offline behavior

If an authenticated worker has a valid cached session:

```text
No network
   ↓
Allow offline application access
```

subject to session/security rules.

If no valid cached session exists:

```text
Offline
   ↓
Cannot authenticate
```

---

## Acceptance criteria

* User can log in.
* Invalid credentials are handled.
* Loading state exists.
* Session is persisted appropriately.
* Role determines application access.
* Unauthorized screens cannot be accessed.

---

# 6. F-002 WORKER HOME

**Priority:** P0

## Purpose

Provide the worker with a simple operational overview.

---

## Display

At minimum:

* worker name
* current shift
* dosimeter status
* current exposure status
* scan action
* recent scan
* synchronization status

---

## Primary CTA

```text
SCAN DOSIMETER
```

The scanner should be the dominant action.

---

## States

### No active shift

Display:

```text
No active shift

Start a shift to begin monitoring.
```

CTA:

```text
START SHIFT
```

### Active shift

Display:

```text
Shift Active
```

with:

```text
Start time
Elapsed duration
Dosimeter status
```

---

# 7. F-003 SHIFT MANAGEMENT

**Priority:** P0

## Start shift

User taps:

```text
START SHIFT
```

System:

1. creates shift
2. stores start timestamp
3. marks shift ACTIVE
4. updates worker home

---

## End shift

User taps:

```text
END SHIFT
```

System:

1. confirms action
2. records end time
3. marks shift COMPLETED
4. prevents new scans under that shift

---

## Edge cases

### Existing active shift

Do not create another active shift.

Display current active shift.

### Offline

Create shift locally.

Sync later.

---

## Acceptance criteria

* Shift start works online.
* Shift start works offline.
* Shift end works.
* Active shift is clearly visible.
* Duplicate active shifts are prevented.

---

# 8. F-004 DOSIMETER PAIRING

**Priority:** P0

## Purpose

Associate a physical dosimeter with the current worker/shift.

---

## Preferred identification

Use:

* QR
* DataMatrix
* unique identifier

if physically supported.

Manual ID entry may be included as fallback.

---

## Flow

```text
Pair Dosimeter
      ↓
Scan identifier
      ↓
Read ID
      ↓
Lookup dosimeter
      ↓
Validate status
      ↓
Validate chemistry
      ↓
Validate expiry
      ↓
Assign
```

---

## Valid dosimeter

Display:

```text
Dosimeter connected

DOS-001
Status: Active
```

---

## Expired dosimeter

Display:

```text
Dosimeter expired

Please use another dosimeter.
```

Do not allow pairing.

---

## Already assigned

Display:

```text
Dosimeter already assigned.
```

Do not silently reassign.

---

## Acceptance criteria

* Dosimeter can be paired.
* Invalid IDs are rejected.
* Expired dosimeters are rejected.
* Assignment persists.
* Offline pairing works with cached authorized dosimeter data where supported.

---

# 9. F-005 SCANNER

**Priority:** P0

## Purpose

Capture a usable image of the dosimeter.

---

# Scanner states

```text
INITIALIZING
SEARCHING
DETECTED
QUALITY_CHECK
READY
CAPTURING
PROCESSING
SUCCESS
ERROR
```

---

## Initializing

Display:

```text
Starting camera…
```

---

## Searching

Display contextual guidance:

```text
Position the dosimeter inside the frame.
```

---

## Detected

When geometry is detected:

```text
Dosimeter detected
```

---

## Poor framing

Display:

```text
Move the dosimeter into the frame.
```

---

## Too far

```text
Move closer.
```

---

## Too close

```text
Move slightly farther away.
```

---

## Too dark

```text
Lighting is too low.
Move to a brighter area.
```

---

## Excessive glare

```text
Too much glare.
Tilt the dosimeter or change the angle.
```

---

## Too blurry

```text
Hold the phone steady.
```

---

## Ready

Only enable capture when minimum image-quality requirements are satisfied.

---

# 10. F-006 IMAGE QUALITY ASSESSMENT

**Priority:** P0

## Purpose

Prevent bad images from entering the scientific processing pipeline.

---

## Required checks

```text
Blur
Brightness
Glare
Framing
Orientation
Resolution
```

---

## Output

```text
ImageQualityResult
```

containing:

```text
overall_status
blur_score
brightness_score
glare_score
framing_score
orientation_score
warnings[]
errors[]
```

---

## Quality states

```text
GOOD
WARNING
INVALID
```

---

## Important rule

Do not reduce all quality information into an opaque number internally.

Individual diagnostics must remain available.

---

# 11. F-007 DOSIMETER DETECTION

**Priority:** P0

## Purpose

Identify the dosimeter in the camera image.

---

## Possible implementation

Prefer deterministic methods where practical:

* geometric detection
* markers
* QR/DataMatrix
* known layout
* reference patches

Do not introduce an object-detection model solely for visual sophistication.

---

## Output

```text
DosimeterDetectionResult {
    detected
    confidence
    corners
    orientation
}
```

---

## Failure

If not detected:

```text
Dosimeter not detected.

Adjust the position and try again.
```

---

# 12. F-008 ROI EXTRACTION

**Priority:** P0

## Purpose

Extract the sensor region and reference regions from the image.

---

## Flow

```text
Detected corners
      ↓
Perspective correction
      ↓
Standardized image
      ↓
Configured ROI
      ↓
Sensor region
      ↓
Reference regions
```

---

## Output

```text
ROIResult {
    sensor_roi
    reference_rois[]
    geometry_status
}
```

---

## Invalid geometry

Display:

```text
The dosimeter could not be aligned reliably.
Please retake the scan.
```

---

# 13. F-009 COLOR ANALYSIS

**Priority:** P0

## Purpose

Convert the captured sensor response into standardized colorimetric features.

---

## Pipeline

```text
Image
 ↓
ROI
 ↓
Reference measurement
 ↓
Color correction
 ↓
RGB
 ↓
XYZ
 ↓
CIELAB
 ↓
Baseline comparison
 ↓
ΔL*
Δa*
Δb*
ΔE
```

---

## Required features

At minimum:

```text
L*
a*
b*
ΔL*
Δa*
Δb*
ΔE
```

where scientifically applicable.

---

## Output

```text
ColorFeatures
```

---

## Technical transparency

Technical details should be available to authorized users.

Workers should not be overwhelmed with raw color-science information.

---

# 14. F-010 EXPOSURE INFERENCE

**Priority:** P0

## Purpose

Convert validated colorimetric features into an exposure estimate.

---

## Architecture

The UI must call:

```text
ExposureInferenceEngine
```

not a hard-coded mathematical function inside the screen.

---

## Supported engines

```text
MockInferenceEngine
CalibrationCurveEngine
XGBoostInferenceEngine
```

---

## Input

Conceptually:

```text
color features
exposure duration
environmental variables
chemistry
batch
configuration
```

Only scientifically justified features should be used.

---

## Output

```text
ExposurePrediction
```

containing:

```text
estimated_dose
unit
lower_bound
upper_bound
confidence
validity
model_id
model_version
calibration_id
source
```

---

# 15. F-011 RESULT VALIDATION

**Priority:** P0

## Purpose

Ensure the result is trustworthy enough to display.

---

## Validation checks

```text
Image valid?
 ↓
ROI valid?
 ↓
Reference valid?
 ↓
Calibration available?
 ↓
Model available?
 ↓
Chemistry compatible?
 ↓
Input within operating range?
 ↓
Inference valid?
 ↓
Result valid?
```

---

## Valid result

```text
VALID
```

---

## Low confidence

```text
LOW_CONFIDENCE
```

The UI must communicate uncertainty.

---

## Out of range

```text
OUT_OF_RANGE
```

Do not extrapolate silently.

---

## Invalid image

```text
INVALID_IMAGE
```

---

## Calibration unavailable

```text
CALIBRATION_UNAVAILABLE
```

---

# 16. F-012 RESULT SCREEN

**Priority:** P0

## Purpose

Give the worker an immediate and understandable interpretation.

---

## Primary content

Display:

```text
Exposure Estimate
```

Example conceptual structure:

```text
12.4 [unit]

ELEVATED
```

The actual number/unit must come from the inference engine.

---

## Secondary information

Display:

```text
Dosimeter
Exposure duration
Scan time
Validity
```

---

## Optional confidence

Only display if scientifically supported.

Example:

```text
Confidence: 91%
```

Never invent confidence.

---

## Technical details

Expandable:

```text
Image Quality
Color Features
Calibration
Model
Processing Version
```

---

## Source badge

If simulated:

```text
SIMULATED
```

If experimental:

```text
EXPERIMENTAL
```

If validated:

```text
VALIDATED
```

---

# 17. F-013 EXPOSURE HISTORY

**Priority:** P0

## Purpose

Allow workers to review previous measurements.

---

## Display

Each event should contain:

* timestamp
* dosimeter
* exposure
* status
* validity

---

## Filters

At minimum:

* date
* status

---

## Offline

Previously synchronized/cached history should remain available.

---

# 18. F-014 OFFLINE STORAGE

**Priority:** P0

## Purpose

Ensure the application continues functioning when connectivity is unavailable.

---

## Offline-capable actions

At minimum:

* view cached worker data
* view active shift
* pair authorized cached dosimeter
* perform scan
* process supported scan locally
* save result
* queue synchronization

---

## Offline indicator

Display clearly:

```text
OFFLINE
```

Do not hide the network state.

---

# 19. F-015 SYNCHRONIZATION

**Priority:** P0

## Purpose

Upload locally created records once connectivity returns.

---

## States

```text
PENDING
SYNCING
SYNCED
FAILED
```

---

## Flow

```text
Offline scan
      ↓
Local DB
      ↓
Sync queue
      ↓
Network restored
      ↓
Upload
      ↓
Server validates
      ↓
Server stores
      ↓
Client marks SYNCED
```

---

## Duplicate handling

Every scan has a client-generated UUID.

Repeated upload must not create duplicate records.

---

## Failure

If synchronization fails:

```text
Scan saved locally.
Will retry when connection is available.
```

---

# 20. F-016 HSE DASHBOARD

**Priority:** P0

## Purpose

Provide HSE personnel with an operational view of exposure status.

---

# Dashboard sections

```text
Overview
Workers
Exposure
Alerts
Scans
```

---

## Overview cards

At minimum:

```text
Active Workers
Active Dosimeters
Recent Scans
Elevated Exposures
Open Alerts
```

---

## Recent activity

Display:

* worker
* dosimeter
* time
* exposure status
* sync/processing status

---

# 21. F-017 WORKER MONITORING

**Priority:** P0

## Worker list

Each row/card:

```text
Worker
Department
Current status
Latest exposure
Last scan
```

---

## Worker detail

Display:

```text
Worker identity
Current shift
Current dosimeter
Exposure history
Alerts
Recent scans
```

---

## Important

Workers should only see their own data.

HSE users may see authorized workforce data.

---

# 22. F-018 EXPOSURE ANALYTICS

**Priority:** P0

## Required views

### Exposure trend

Show exposure measurements over time.

### Status distribution

Show:

```text
NORMAL
ELEVATED
HIGH
CRITICAL
INVALID
```

### Recent events

Provide a table/list.

---

## Avoid

Do not create charts simply to make the dashboard look sophisticated.

Every visualization must answer a meaningful operational question.

---

# 23. F-019 ALERTS

**Priority:** P0

## Trigger

Alert evaluation occurs after exposure result validation.

```text
Exposure Result
      ↓
Risk Classification
      ↓
Threshold Evaluation
      ↓
Alert
```

---

## Alert levels

At minimum:

```text
INFO
ELEVATED
HIGH
CRITICAL
```

Exact threshold values must come from configuration.

---

## Alert card

Display:

```text
Severity
Worker
Dosimeter
Time
Reason
Status
```

---

## Acknowledge

HSE user can acknowledge.

Record:

```text
acknowledged_by
acknowledged_at
```

Do not delete the alert.

---

# 24. F-020 SEARCH & FILTERING

**Priority:** P1

## Search

Support:

```text
Worker ID
Worker name
Dosimeter ID
Scan ID
```

---

## Filters

Support:

```text
Date
Worker
Department
Site
Status
Dosimeter
```

---

## Rule

Filters should update results without breaking pagination/state.

---

# 25. F-021 AUDIT TRAIL

**Priority:** P1

Record:

```text
Login
Scan created
Result created
Calibration modified
Model modified
Threshold modified
Alert acknowledged
```

---

## Audit record

```text
timestamp
user
action
entity
entity_id
metadata
```

---

# 26. F-022 MODEL REGISTRY

**Priority:** P1

## Purpose

Allow authorized technical users to inspect model versions.

---

## Model list

Display:

```text
Model ID
Version
Algorithm
Chemistry
Status
Created
```

---

## Model detail

Display:

```text
Feature schema
Operating range
Training dataset
Validation dataset
Metrics
Status
```

---

## Status

```text
DRAFT
VALIDATING
APPROVED
RETIRED
```

Only APPROVED models can be used for trusted inference.

---

# 27. F-023 CALIBRATION REGISTRY

**Priority:** P1

## Purpose

Maintain traceable calibration information.

---

## Display

```text
Calibration ID
Version
Chemistry
Batch
Range
Status
```

---

## Detail

Display:

```text
Method
Dataset
Validation metrics
Operating range
Created date
```

---

# 28. F-024 CSV EXPORT

**Priority:** P1

## Purpose

Allow HSE users to export filtered exposure records.

---

## Fields

At minimum:

```text
scan_id
worker_id
dosimeter_id
timestamp
duration
estimated_dose
unit
risk_status
validity
model_version
calibration_version
```

---

## Rule

Export must respect the current filters.

---

# 29. F-025 TECHNICAL SCAN DETAILS

**Priority:** P1

Authorized technical/HSE users should be able to inspect:

```text
Scan metadata
Image quality
ROI
Reference measurements
Color features
Inference input
Inference result
Model
Calibration
Processing version
```

This is essential for technical credibility.

---

# 30. F-026 DEMO MODE

**Priority:** P1

## Purpose

Provide deterministic SIH demonstration data.

---

## Demo scenarios

At minimum:

```text
NORMAL
ELEVATED
HIGH
CRITICAL
INVALID IMAGE
OUT OF RANGE
OFFLINE
```

---

## Demo data

Must be deterministic.

Refreshing the page must not randomly change values.

---

## Visible label

Use:

```text
DEMO MODE
```

and/or:

```text
SIMULATED
```

where relevant.

---

# 31. F-027 EXPERIMENTAL MODE

**Priority:** P1

Used during physical prototype development.

Allow:

* experimental scan images
* experimental calibration
* research metadata
* technical inspection

All results marked:

```text
EXPERIMENTAL
```

unless validated.

---

# 32. F-028 PDF REPORTS

**Priority:** P2

Generate a report from filtered dashboard data.

Include:

* reporting period
* worker/site filters
* exposure summary
* alerts
* scan records
* model/calibration versions

---

# 33. F-029 DEVICE PROFILES

**Priority:** P2

Record optional:

```text
device_model
camera
resolution
capture metadata
```

This enables future device-specific color correction.

---

# 34. F-030 ADVANCED ANALYTICS

**Priority:** P2

Potential future capabilities:

* site comparison
* department comparison
* exposure distributions
* longitudinal worker trends
* batch comparison
* calibration drift analysis

Do not allow this feature to delay the core workflow.

---

# 35. F-031 ADMINISTRATION

**Priority:** P2

Potential:

* user management
* role management
* dosimeter management
* configuration management
* site management

---

# 36. F-032 LOCALIZATION

**Priority:** P2

Prepare the application for multiple languages.

English is sufficient for the prototype.

---

# 37. CROSS-FEATURE RULE: LOADING STATES

Every asynchronous operation must have a visible loading state.

Examples:

```text
Signing in…
Processing scan…
Loading exposure…
Syncing…
Generating report…
```

Do not leave the user wondering whether the app is frozen.

---

# 38. CROSS-FEATURE RULE: ERROR STATES

Every network/API operation must have:

```text
Loading
Success
Error
Empty
```

states.

---

# 39. CROSS-FEATURE RULE: EMPTY STATES

Empty lists should never appear as blank screens.

Example:

```text
No exposure records yet.

Complete your first scan to start
building your exposure history.
```

---

# 40. CROSS-FEATURE RULE: CONFIRMATION

Destructive actions require confirmation.

Examples:

* ending shift
* removing assignment
* deleting configuration

Scientific records should generally NOT be deletable through normal UI.

---

# 41. CROSS-FEATURE RULE: SCIENTIFIC DATA

Never silently change scientific data.

If a result is recalculated:

```text
Result v1
     ↓
Reprocessing
     ↓
Result v2
```

Preserve historical traceability.

---

# 42. CROSS-FEATURE RULE: SIMULATION

Whenever simulation is used:

The data model must know it is simulated.

Do not merely place "(Demo)" in a random UI label.

Use structured metadata.

---

# 43. CROSS-FEATURE RULE: UNCERTAINTY

The application must distinguish:

```text
High confidence
Low confidence
Invalid
Out of range
Unavailable
```

Do not convert uncertainty into a binary safe/unsafe result unless the configured risk logic explicitly supports that classification.

---

# 44. CROSS-FEATURE RULE: UNITS

Every numerical exposure value must have an explicit unit.

Never display:

```text
12.4
```

without knowing what 12.4 represents.

---

# 45. CROSS-FEATURE RULE: TIME

Store timestamps consistently.

Prefer:

```text
UTC internally
localized display
```

or another clearly documented convention.

Never mix local and UTC timestamps without explicit conversion.

---

# 46. CROSS-FEATURE RULE: IDs

All major entities need stable IDs.

At minimum:

```text
user_id
worker_id
shift_id
dosimeter_id
batch_id
scan_id
result_id
alert_id
model_id
calibration_id
```

---

# 47. CROSS-FEATURE RULE: API FAILURES

The application must gracefully handle:

```text
400
401
403
404
409
422
429
500
network timeout
offline
```

The UI should translate technical failures into useful messages.

---

# 48. CROSS-FEATURE RULE: NETWORK STATE

The application must not assume:

```text
network = available
```

Network status should be observable.

---

# 49. CROSS-FEATURE RULE: DATA OWNERSHIP

Worker:

```text
Own data
```

HSE:

```text
Authorized workforce data
```

Admin:

```text
Administrative data
```

Research:

```text
Scientific/model data
```

---

# 50. CROSS-FEATURE RULE: PERFORMANCE

Avoid:

* unnecessary API requests
* processing full-resolution images when unnecessary
* repeated model loading
* repeated database queries
* rendering massive lists without virtualization

---

# 51. CROSS-FEATURE RULE: MOBILE CAMERA

The application must:

* request permission
* handle denied permission
* release camera resources
* avoid memory leaks
* handle app backgrounding
* support retake

---

# 52. CROSS-FEATURE RULE: ACCESSIBILITY

Never rely solely on color.

For example:

Bad:

```text
Red = high
```

Good:

```text
🔴 HIGH
```

and preferably:

```text
HIGH EXPOSURE
```

Use text labels alongside status colors.

---

# 53. CROSS-FEATURE RULE: RESPONSIVE DASHBOARD

The HSE dashboard should work on:

* desktop
* laptop
* tablet

Mobile responsiveness is desirable but not the primary dashboard target.

---

# 54. END-TO-END ACCEPTANCE TEST 1

## Successful scan

```text
Login
 ↓
Start shift
 ↓
Pair dosimeter
 ↓
Open scanner
 ↓
Detect dosimeter
 ↓
Good image
 ↓
Capture
 ↓
ROI
 ↓
Color analysis
 ↓
Inference
 ↓
Validation
 ↓
Exposure result
 ↓
History
 ↓
Sync
 ↓
Dashboard
```

Expected:

**One complete exposure record exists across the system.**

---

# 55. END-TO-END ACCEPTANCE TEST 2

## Bad image

```text
Open scanner
 ↓
Introduce blur
 ↓
Quality detects blur
 ↓
Capture disabled OR rejected
```

Expected:

The system does NOT generate an exposure result.

---

# 56. END-TO-END ACCEPTANCE TEST 3

## Glare

```text
Camera
 ↓
Excessive glare
 ↓
Warning
 ↓
User adjusts angle
 ↓
Quality improves
 ↓
Capture enabled
```

---

# 57. END-TO-END ACCEPTANCE TEST 4

## Expired dosimeter

```text
Pair
 ↓
Dosimeter lookup
 ↓
Expired
 ↓
Reject
```

Expected:

No scan may be associated with the expired dosimeter unless explicitly permitted by configuration for research/debug mode.

---

# 58. END-TO-END ACCEPTANCE TEST 5

## Offline scan

```text
Internet OFF
 ↓
Open scanner
 ↓
Capture
 ↓
Process
 ↓
Save locally
 ↓
Show PENDING
```

Expected:

No data is lost.

---

# 59. END-TO-END ACCEPTANCE TEST 6

## Sync recovery

```text
Pending scan
 ↓
Internet restored
 ↓
Sync
 ↓
Server accepts
 ↓
Local record becomes SYNCED
```

Expected:

Exactly one server-side scan exists.

---

# 60. END-TO-END ACCEPTANCE TEST 7

## Out-of-range model

```text
Scan
 ↓
Features
 ↓
Model validation
 ↓
Outside validated range
```

Expected:

No misleading numerical exposure estimate is displayed.

Display:

```text
OUT OF VALIDATED RANGE
```

---

# 61. END-TO-END ACCEPTANCE TEST 8

## HSE alert

```text
Exposure result
 ↓
Risk classification
 ↓
Threshold exceeded
 ↓
Alert created
 ↓
HSE dashboard updates
 ↓
HSE acknowledges
```

Expected:

Alert remains in history with acknowledgement metadata.

---

# 62. END-TO-END ACCEPTANCE TEST 9

## Demo mode

The evaluator should be able to:

```text
Start app
 ↓
Enter demo account
 ↓
Run predetermined scan scenario
 ↓
Show result
 ↓
Show HSE dashboard
```

without requiring external services that are not part of the demo setup.

---

# 63. END-TO-END ACCEPTANCE TEST 10

## Technical traceability

Given an exposure result, an authorized user should be able to identify:

```text
Worker
 ↓
Shift
 ↓
Dosimeter
 ↓
Scan
 ↓
Image analysis
 ↓
Color features
 ↓
Calibration
 ↓
Model
 ↓
Processing version
```

If any link is missing, the feature is incomplete.

---

# 64. DEFINITION OF DONE — UI

A screen is complete when:

* correct content exists
* loading state exists
* empty state exists
* error state exists
* success state exists
* navigation works
* responsive behavior works
* accessibility basics work
* real service integration exists where required

---

# 65. DEFINITION OF DONE — BACKEND

An API feature is complete when:

* endpoint exists
* schema exists
* validation exists
* authentication exists
* authorization exists
* persistence exists
* error handling exists
* tests exist
* documentation exists

---

# 66. DEFINITION OF DONE — SCIENTIFIC PIPELINE

A processing feature is complete when:

* input schema exists
* preprocessing exists
* validation exists
* output schema exists
* deterministic tests exist
* versioning exists
* failure states exist
* provenance is recorded

---

# 67. DEFINITION OF DONE — OFFLINE

Offline functionality is complete when:

* record can be created offline
* local persistence works
* sync queue works
* retries work
* duplicate prevention works
* sync status is visible
* server receives the record after reconnection

---

# 68. DEFINITION OF DONE — DEMO

The prototype is demo-ready when:

```text
Fresh setup
 ↓
Seed database
 ↓
Launch application
 ↓
Login
 ↓
Run complete scan
 ↓
Generate result
 ↓
Show history
 ↓
Show dashboard
 ↓
Trigger alert
 ↓
Demonstrate offline
 ↓
Synchronize
```

works without manual database editing.

---

# 69. IMPLEMENTATION PRIORITY

Build in this order:

## Phase 1 — Foundation

```text
Authentication
Navigation
Design system
Database
API
Seed data
```

## Phase 2 — Core measurement

```text
Scanner
Image quality
Dosimeter detection
ROI
Color analysis
```

## Phase 3 — Intelligence

```text
Calibration abstraction
Inference engine
Validation
Risk classification
```

## Phase 4 — Persistence

```text
Scan records
History
Offline storage
Sync
```

## Phase 5 — HSE

```text
Dashboard
Workers
Analytics
Alerts
```

## Phase 6 — Technical depth

```text
Model registry
Calibration registry
Audit
Technical scan details
Export
```

---

# 70. FEATURE DEVELOPMENT METHOD

Every P0 feature must be developed vertically.

Example:

```text
SCAN FEATURE

UI
 ↓
Scanner service
 ↓
CV service
 ↓
Processing service
 ↓
API
 ↓
Database
 ↓
Test
```

Do not build a visual shell and declare it complete.

---

# 71. NO FAKE COMPLETION RULE

The coding agent must NEVER mark a feature as implemented if it is only:

* a placeholder
* a static card
* hardcoded data
* a fake loading animation
* a button with no meaningful backend behavior
* a random generated value
* a disconnected mock

If a feature is intentionally mocked for demo purposes, label it:

```text
MOCK
SIMULATED
DEMO
```

and document what remains to be replaced.

---

# 72. FINAL FEATURE QUALITY BAR

The finished prototype must feel like a real product from the user's perspective:

```text
Worker
   ↓
Simple interaction
   ↓
Scientific processing
   ↓
Immediate result
   ↓
Persistent record
   ↓
HSE visibility
   ↓
Actionable alert
```

At the same time, a technical evaluator must be able to inspect the system and see:

```text
Image processing
+
Color science
+
Calibration
+
Inference
+
Validation
+
Offline architecture
+
Traceability
+
HSE analytics
```

The goal is not to maximize the number of screens.

The goal is to make the **measurement-to-decision pipeline demonstrably functional**.

---

# 73. FINAL PRODUCT TEST

Before declaring the prototype complete, the coding agent must be able to answer YES to all of the following:

```text
[ ] Can a worker log in?
[ ] Can a worker start a shift?
[ ] Can a worker pair a dosimeter?
[ ] Can the camera detect the dosimeter?
[ ] Can the system reject bad images?
[ ] Can the system extract the correct ROI?
[ ] Can the system calculate colorimetric features?
[ ] Can an inference engine produce a result?
[ ] Can the system reject invalid/out-of-range inputs?
[ ] Can the worker understand the result?
[ ] Is the result saved?
[ ] Does history update?
[ ] Does offline operation work?
[ ] Does synchronization work?
[ ] Does duplicate prevention work?
[ ] Can HSE see the result?
[ ] Can HSE filter/search workers?
[ ] Can alerts be generated?
[ ] Can alerts be acknowledged?
[ ] Can the result be traced to model/calibration versions?
[ ] Are simulated results clearly labelled?
[ ] Are errors handled gracefully?
[ ] Are automated tests present?
[ ] Can the entire demo be reset and repeated?
```

If any P0 item is NO, the core prototype is not complete.
