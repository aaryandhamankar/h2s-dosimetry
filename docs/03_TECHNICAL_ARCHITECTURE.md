# Technical Architecture Specification

# Passive Colorimetric H₂S Exposure-Dosimeter Platform

**Document:** 03_TECHNICAL_ARCHITECTURE.md
**Product:** Passive Colorimetric H₂S Exposure-Dosimeter Platform
**Target:** SIH Functional Prototype
**Primary Platforms:** Android Mobile + Web HSE Dashboard
**Architecture Goal:** Modular, testable, offline-capable, scientifically traceable software

---

# 1. PURPOSE

This document defines the technical architecture of the software platform.

It describes:

* application architecture
* frontend architecture
* backend architecture
* computer-vision architecture
* color-science pipeline
* ML/inference architecture
* database architecture
* API architecture
* offline-first architecture
* synchronization
* authentication and authorization
* configuration
* model/calibration versioning
* observability
* testing
* deployment
* project structure

This document does NOT define the final physical dosimeter chemistry.

The software must consume validated information from the physical-sensor/calibration work without hard-coding unvalidated scientific assumptions.

---

# 2. ARCHITECTURAL NORTH STAR

The platform must be designed around this separation:

```text
                    ┌─────────────────────────┐
                    │       MOBILE APP        │
                    │                         │
                    │  Worker UI              │
                    │  Camera                 │
                    │  Local Storage          │
                    │  Offline Sync           │
                    └────────────┬────────────┘
                                 │
                                 │ HTTPS / API
                                 ↓
                    ┌─────────────────────────┐
                    │       BACKEND           │
                    │                         │
                    │ Auth                    │
                    │ Workers                 │
                    │ Dosimeters              │
                    │ Scans                   │
                    │ Analytics               │
                    │ Sync                    │
                    │ Audit                   │
                    └────────────┬────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ↓                         ↓
          ┌──────────────────┐       ┌──────────────────┐
          │    DATABASE      │       │  HSE DASHBOARD   │
          │                  │       │                  │
          │ PostgreSQL       │       │ Analytics        │
          │ Users            │       │ Workers          │
          │ Scans            │       │ Alerts           │
          │ Results          │       │ Reports          │
          │ Calibration      │       │ Audit            │
          └──────────────────┘       └──────────────────┘
```

The optical analysis pipeline sits logically between image acquisition and exposure-result creation.

---

# 3. CORE PRINCIPLES

## 3.1 Separation of concerns

The following must remain separate:

```text
UI
Application Services
Domain Logic
Computer Vision
Color Science
ML / Inference
Persistence
Networking
Synchronization
```

Do not allow a screen/component to directly perform all of these responsibilities.

---

## 3.2 Scientific traceability

Every quantitative result must be traceable to:

* source image
* scan
* dosimeter
* batch
* chemistry
* calibration
* model
* model version
* software processing version
* timestamp

---

## 3.3 Configuration over hard-coding

Scientific parameters must be configurable.

Do not hard-code:

* reference patch positions
* calibration coefficients
* exposure thresholds
* model versions
* chemistry-specific parameters
* operating ranges
* image-quality thresholds

---

## 3.4 Offline-first

The worker application must be designed to operate when network connectivity is unreliable.

Local functionality is not an afterthought.

---

## 3.5 Fail safely

If the system cannot produce a sufficiently trustworthy quantitative result:

```text
DO NOT FABRICATE A RESULT
```

Return a structured invalid/uncertain state.

---

## 3.6 Prototype simplicity

For the SIH prototype:

Prefer:

* modular monolith
* simple REST APIs
* local inference
* PostgreSQL
* one deployable backend

Do NOT introduce unnecessary:

* microservices
* Kubernetes
* message brokers
* distributed systems
* complicated cloud infrastructure

unless a real requirement appears.

---

# 4. RECOMMENDED TECHNOLOGY STACK

The following stack is the recommended prototype implementation.

---

## 4.1 Mobile

**React Native + Expo + TypeScript**

Responsibilities:

* authentication UI
* worker workflow
* camera
* scanner
* local persistence
* local inference integration
* sync
* result presentation

---

## 4.2 Web Dashboard

**Next.js + TypeScript**

Use:

* App Router
* reusable React components
* typed API client
* responsive design

---

## 4.3 Backend

Recommended prototype:

**FastAPI + Python**

Reason:

The computer-vision and ML pipeline is Python-native and can share processing/inference code with the backend.

Backend responsibilities:

* authentication
* authorization
* CRUD
* scan ingestion
* synchronization
* analytics
* configuration
* calibration/model metadata
* audit logging

---

## 4.4 Database

**PostgreSQL**

Use a relational schema because the platform has strongly related entities:

```text
Worker
Shift
Dosimeter
Batch
Chemistry
Scan
Result
Calibration
Model
Alert
AuditLog
```

---

## 4.5 Local Mobile Database

Use:

**SQLite**

for:

* pending scans
* local worker data
* cached configuration
* shift information
* sync queue
* offline result history

---

## 4.6 Computer Vision

Use:

**OpenCV**

for:

* image preprocessing
* blur detection
* brightness analysis
* glare detection
* geometry detection
* perspective correction
* ROI extraction
* reference patch extraction

---

## 4.7 Color Science

Implement color processing as a separate Python module.

Required capabilities:

* RGB normalization
* reference-based correction
* RGB → CIELAB
* baseline comparison
* ΔL*
* Δa*
* Δb*
* ΔE

The color pipeline must be independently testable.

---

## 4.8 Machine Learning

Primary prototype candidate:

**XGBoost**

The research direction proposes a physics-informed gradient-boosting regressor using colorimetric and contextual features.

The model must be accessed through an abstraction layer.

Example:

```text
InferenceEngine
    ├── XGBoostInferenceEngine
    ├── CalibrationCurveEngine
    └── MockInferenceEngine
```

This allows the scientific model to change without redesigning the application.

---

# 5. HIGH-LEVEL SOFTWARE ARCHITECTURE

```text
┌─────────────────────────────────────────────────────────────┐
│                         MOBILE APP                         │
│                                                             │
│  Presentation                                               │
│  ├── Auth                                                   │
│  ├── Home                                                   │
│  ├── Scan                                                   │
│  ├── Result                                                 │
│  ├── History                                                │
│  └── Profile                                                │
│                                                             │
│  Application                                                │
│  ├── ScanService                                            │
│  ├── ShiftService                                           │
│  ├── DosimeterService                                       │
│  └── SyncService                                            │
│                                                             │
│  Domain                                                     │
│  ├── Scan                                                   │
│  ├── Exposure                                               │
│  ├── Dosimeter                                              │
│  └── Validation                                             │
│                                                             │
│  Infrastructure                                             │
│  ├── Camera                                                 │
│  ├── SQLite                                                 │
│  ├── API Client                                             │
│  └── Sync Queue                                             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │ HTTPS
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                            │
│                                                             │
│  API Layer                                                  │
│  ├── Auth                                                   │
│  ├── Workers                                                │
│  ├── Dosimeters                                             │
│  ├── Shifts                                                 │
│  ├── Scans                                                  │
│  ├── Analytics                                              │
│  ├── Models                                                 │
│  └── Calibration                                            │
│                                                             │
│  Application Layer                                          │
│  ├── ScanService                                            │
│  ├── ExposureService                                        │
│  ├── SyncService                                            │
│  └── AuditService                                           │
│                                                             │
│  Domain Layer                                               │
│                                                             │
│  Scientific Layer                                           │
│  ├── CV                                                     │
│  ├── Color Science                                          │
│  ├── Calibration                                             │
│  └── ML                                                     │
│                                                             │
│  Persistence                                                │
│  └── PostgreSQL                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 6. REPOSITORY STRUCTURE

Use a monorepo for the prototype.

Recommended:

```text
h2s-dosimeter-platform/
│
├── apps/
│   │
│   ├── mobile/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── services/
│   │   ├── storage/
│   │   ├── camera/
│   │   ├── sync/
│   │   ├── types/
│   │   └── tests/
│   │
│   └── dashboard/
│       ├── app/
│       ├── components/
│       ├── features/
│       ├── lib/
│       ├── hooks/
│       ├── types/
│       └── tests/
│
├── services/
│   │
│   ├── api/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   ├── core/
│   │   │   ├── models/
│   │   │   ├── schemas/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   └── tests/
│   │   └── requirements.txt
│   │
│   └── inference/
│       ├── cv/
│       ├── color/
│       ├── calibration/
│       ├── models/
│       ├── inference/
│       ├── validation/
│       ├── tests/
│       └── notebooks/
│
├── packages/
│   ├── shared-types/
│   ├── design-system/
│   └── config/
│
├── data/
│   ├── sample/
│   ├── calibration/
│   ├── simulated/
│   └── schemas/
│
├── models/
│   ├── registry/
│   └── artifacts/
│
├── docs/
│
├── scripts/
│
├── docker/
│
├── .env.example
├── README.md
└── package.json
```

The exact directory structure may be adapted to the chosen framework, but the separation of concerns must remain.

---

# 7. MOBILE ARCHITECTURE

Use feature-oriented architecture.

Example:

```text
features/
├── auth/
├── home/
├── shift/
├── scanner/
├── exposure/
├── history/
├── profile/
└── sync/
```

Each feature should contain its own:

```text
components
screens
hooks
services
types
validation
```

Avoid a giant global `components` folder containing every piece of application logic.

---

# 8. MOBILE STATE MANAGEMENT

Separate:

### UI state

Examples:

* scanner open
* selected tab
* loading
* modal open

### Domain state

Examples:

* active shift
* active dosimeter
* scan result

### Persistent state

Examples:

* authentication/session
* pending sync records
* cached configuration

Do not use one global state store for everything.

---

# 9. SCANNER ARCHITECTURE

The scanner should be implemented as a pipeline.

```text
Camera Frame
      ↓
Frame Quality
      ↓
Dosimeter Detection
      ↓
Geometry Validation
      ↓
ROI Extraction
      ↓
Reference Detection
      ↓
Capture Decision
```

Each stage returns structured information.

Example:

```text
{
  status,
  confidence,
  diagnostics,
  data
}
```

---

# 10. IMAGE QUALITY MODULE

Create independent functions/services for:

### Blur detection

Estimate whether the image is sufficiently sharp.

### Brightness

Detect:

* too dark
* acceptable
* excessively bright

### Glare

Detect saturated/reflective regions that could interfere with color measurement.

### Framing

Determine whether the dosimeter is sufficiently visible.

### Orientation

Determine whether geometry is suitable for processing.

---

# 11. IMAGE QUALITY RESULT

Example domain object:

```text
ImageQualityResult {
    overall_status
    blur_score
    brightness_score
    glare_score
    framing_score
    orientation_score
    errors[]
    warnings[]
}
```

Do not collapse all of these into one opaque score internally.

The overall score may be derived from them, but individual diagnostics must remain available.

---

# 12. DOSIMETER DETECTION

Detection should support a configuration-driven physical layout.

Potential mechanisms:

* marker detection
* DataMatrix/QR identification
* geometric features
* reference patches

The software should not assume that a deep-learning object detector is required.

For the prototype, deterministic geometry is preferred where sufficiently robust.

---

# 13. ROI EXTRACTION

Once the dosimeter is identified:

```text
Image
 ↓
Dosimeter corners
 ↓
Homography
 ↓
Perspective correction
 ↓
Standardized coordinate system
 ↓
Sensor ROI
```

The ROI geometry should be stored in configuration.

Example:

```text
DosimeterGeometry {
    width
    height
    sensor_roi
    reference_rois[]
    id_roi
}
```

---

# 14. PERSPECTIVE TRANSFORMATION

Use homography/perspective transformation.

Input:

```text
four detected source points
```

Output:

```text
standardized rectangular dosimeter image
```

The transformation must be deterministic and testable.

---

# 15. REFERENCE PATCH PROCESSING

The system should detect or sample reference patches.

For each patch:

```text
reference_id
expected_color
observed_RGB
corrected_RGB
CIELAB
quality
```

Reference measurements must be retained for diagnostics.

---

# 16. COLOR CORRECTION ARCHITECTURE

The color-correction system should be replaceable.

Example interface:

```text
ColorCorrectionEngine

correct(
    image,
    reference_measurements,
    reference_profile
)
→ corrected_image
```

Potential implementation:

```text
BradfordColorCorrectionEngine
```

but do not make the entire application dependent on one correction algorithm.

---

# 17. COLOR SPACE CONVERSION

After correction:

```text
Corrected RGB
      ↓
XYZ
      ↓
CIELAB
```

Retain:

```text
L*
a*
b*
```

for relevant ROIs.

---

# 18. COLOR FEATURE EXTRACTION

Feature extraction should produce a structured object.

Example:

```text
ColorFeatures {
    baseline_L
    baseline_a
    baseline_b

    current_L
    current_a
    current_b

    delta_L
    delta_a
    delta_b

    delta_E
}
```

If multiple sensing regions exist, support:

```text
region_features[]
```

rather than assuming a single region.

---

# 19. EXPOSURE FEATURE ENGINEERING

The model input may contain:

### Optical

```text
L*
a*
b*
ΔL*
Δa*
Δb*
ΔE
```

### Temporal

```text
exposure_duration
activation_time
scan_time
```

### Environmental

Where available and experimentally supported:

```text
temperature
humidity
```

### Metadata

```text
chemistry_id
batch_id
dosimeter_type
```

Do not feed arbitrary metadata into the model merely because it exists.

Every feature must have scientific justification.

---

# 20. INFERENCE ARCHITECTURE

Create an abstraction:

```text
ExposureInferenceEngine
```

Interface:

```text
predict(features, context)
```

Returns:

```text
ExposurePrediction {
    estimated_dose
    unit
    lower_bound
    upper_bound
    confidence
    validity
    model_id
    model_version
    calibration_id
}
```

Optional fields should be null when unavailable.

Never invent uncertainty values.

---

# 21. INFERENCE IMPLEMENTATIONS

Support at minimum:

```text
MockInferenceEngine
CalibrationCurveEngine
XGBoostInferenceEngine
```

### MockInferenceEngine

For UI development and demo mode.

Must explicitly identify results as simulated.

### CalibrationCurveEngine

For deterministic validated relationships.

### XGBoostInferenceEngine

For the proposed ML model.

---

# 22. MODEL VALIDATION

Before inference is accepted:

```text
Feature validation
      ↓
Chemistry compatibility
      ↓
Batch compatibility
      ↓
Operating-range check
      ↓
Model availability
      ↓
Inference
      ↓
Prediction validation
      ↓
Result
```

If the feature vector is outside the validated model domain:

```text
OUT_OF_RANGE
```

must be returned rather than silently extrapolating.

---

# 23. MODEL REGISTRY

The model registry must contain:

```text
model_id
version
algorithm
chemistry_id
batch_scope
training_dataset_id
validation_dataset_id
feature_schema_version
operating_range
metrics
artifact_location
status
created_at
approved_at
retired_at
```

Statuses:

```text
DRAFT
VALIDATING
APPROVED
RETIRED
```

Only APPROVED models may be used for trusted production-style inference.

---

# 24. CALIBRATION REGISTRY

Calibration records should contain:

```text
calibration_id
version
chemistry_id
batch_id
dataset_id
dose_min
dose_max
temperature_min
temperature_max
humidity_min
humidity_max
method
validation_metrics
status
created_at
```

The calibration registry must support multiple calibration versions.

---

# 25. DATABASE ARCHITECTURE

Core relational entities:

```text
users
worker_profiles
shifts
chemistries
dosimeters
dosimeter_batches
scans
image_analyses
color_features
exposure_results
calibrations
models
alerts
audit_logs
sync_records
configurations
```

---

# 26. USER TABLE

Suggested:

```text
users
-----
id
email / username
password_hash / auth_provider_id
role
status
created_at
updated_at
last_login_at
```

Roles:

```text
WORKER
HSE
ADMIN
RESEARCH
```

---

# 27. WORKER PROFILE

```text
worker_profiles
---------------
id
user_id
worker_code
display_name
department
site
status
created_at
updated_at
```

Avoid unnecessary personal data.

---

# 28. SHIFT

```text
shifts
------
id
worker_id
start_time
end_time
status
created_at
updated_at
```

Possible statuses:

```text
ACTIVE
COMPLETED
CANCELLED
```

---

# 29. CHEMISTRY

```text
chemistries
-----------
id
name
version
description
status
created_at
updated_at
```

The software must support multiple chemistry definitions even if only one is used in the prototype.

---

# 30. DOSIMETER

```text
dosimeters
----------
id
dosimeter_code
batch_id
chemistry_id
status
activation_time
expiry_time
assigned_worker_id
created_at
updated_at
```

---

# 31. DOSIMETER BATCH

```text
dosimeter_batches
-----------------
id
batch_code
chemistry_id
manufacturing_date
expiry_date
calibration_id
status
created_at
```

---

# 32. SCAN

```text
scans
-----
id
worker_id
shift_id
dosimeter_id
captured_at
processed_at
processing_status
image_quality_status
sync_status
app_version
processing_version
created_at
```

---

# 33. IMAGE ANALYSIS

```text
image_analyses
--------------
id
scan_id
image_reference
roi_status
reference_status
perspective_status
color_correction_status
blur_score
brightness_score
glare_score
framing_score
created_at
```

Raw image storage should be optional and governed by retention policy.

---

# 34. COLOR FEATURES

```text
color_features
--------------
id
scan_id

baseline_L
baseline_a
baseline_b

current_L
current_a
current_b

delta_L
delta_a
delta_b
delta_E

feature_schema_version
created_at
```

---

# 35. EXPOSURE RESULT

```text
exposure_results
----------------
id
scan_id
estimated_dose
dose_unit
estimated_twa
twa_unit
lower_bound
upper_bound
confidence
validity_status
risk_status
model_id
model_version
calibration_id
calibration_version
created_at
```

---

# 36. ALERT

```text
alerts
------
id
scan_id
worker_id
severity
reason
status
created_at
acknowledged_by
acknowledged_at
```

---

# 37. AUDIT LOG

```text
audit_logs
----------
id
user_id
action
entity_type
entity_id
metadata
created_at
```

Audit metadata must not contain unnecessary sensitive information.

---

# 38. SYNC RECORD

```text
sync_records
------------
id
local_record_id
entity_type
operation
status
attempt_count
last_attempt_at
last_error
synced_at
```

---

# 39. API ARCHITECTURE

Use REST APIs for the prototype.

All APIs must be:

* authenticated
* versioned
* typed
* documented
* validated

Base:

```text
/api/v1/
```

---

# 40. AUTH API

```text
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
POST /api/v1/auth/refresh
```

---

# 41. WORKER API

```text
GET /api/v1/workers
GET /api/v1/workers/{id}
GET /api/v1/workers/{id}/scans
GET /api/v1/workers/{id}/exposure
```

---

# 42. SHIFT API

```text
POST /api/v1/shifts
GET /api/v1/shifts/{id}
PATCH /api/v1/shifts/{id}
```

---

# 43. DOSIMETER API

```text
GET /api/v1/dosimeters
GET /api/v1/dosimeters/{id}
POST /api/v1/dosimeters/pair
POST /api/v1/dosimeters/validate
```

---

# 44. SCAN API

```text
POST /api/v1/scans
GET /api/v1/scans/{id}
GET /api/v1/scans/{id}/analysis
GET /api/v1/scans/{id}/result
```

---

# 45. SYNC API

```text
POST /api/v1/sync/push
GET  /api/v1/sync/pull
```

The push API must support idempotency.

Repeated submission of the same scan must not create duplicate exposure events.

---

# 46. ANALYTICS API

```text
GET /api/v1/analytics/overview
GET /api/v1/analytics/exposure
GET /api/v1/analytics/workers
GET /api/v1/analytics/alerts
```

Analytics should be computed server-side for dashboard consistency.

---

# 47. CALIBRATION API

```text
GET /api/v1/calibrations
GET /api/v1/calibrations/{id}
POST /api/v1/calibrations
PATCH /api/v1/calibrations/{id}
```

Only authorized roles may modify calibration configuration.

---

# 48. MODEL API

```text
GET /api/v1/models
GET /api/v1/models/{id}
POST /api/v1/models
PATCH /api/v1/models/{id}
```

Only approved models can be used for trusted inference.

---

# 49. API RESPONSE STRUCTURE

Use consistent responses.

Success:

```text
{
  "data": {...},
  "meta": {...}
}
```

Error:

```text
{
  "error": {
    "code": "DOSIMETER_EXPIRED",
    "message": "The dosimeter has expired.",
    "details": {...}
  }
}
```

Do not expose raw stack traces to users.

---

# 50. SCAN PROCESSING CONTRACT

The scan-processing service should accept:

```text
ScanInput {
    image
    dosimeter_id
    chemistry_id
    batch_id
    exposure_duration
    environment
    configuration_version
}
```

It should return:

```text
ScanProcessingResult {
    image_quality
    dosimeter_detection
    roi
    reference_analysis
    color_features
    inference
    validation
    final_result
}
```

---

# 51. COMPLETE PROCESSING PIPELINE

The canonical pipeline is:

```text
RAW IMAGE
    ↓
Image Quality
    ↓
Dosimeter Detection
    ↓
Geometry Validation
    ↓
Perspective Correction
    ↓
ROI Extraction
    ↓
Reference Detection
    ↓
Color Correction
    ↓
RGB → CIELAB
    ↓
Baseline Comparison
    ↓
ΔL*, Δa*, Δb*, ΔE
    ↓
Feature Engineering
    ↓
Calibration / ML Inference
    ↓
Operating-Range Validation
    ↓
Confidence / Uncertainty
    ↓
Risk Classification
    ↓
Exposure Result
```

No step should be skipped merely because the UI can still display something.

---

# 52. PROCESSING STATUS MACHINE

Use explicit processing states:

```text
CAPTURED
VALIDATING_IMAGE
DETECTING_DOSIMETER
EXTRACTING_ROI
ANALYZING_REFERENCES
CORRECTING_COLOR
EXTRACTING_FEATURES
RUNNING_INFERENCE
VALIDATING_RESULT
COMPLETE
INVALID
ERROR
```

This can power both:

* backend diagnostics
* mobile processing UI

---

# 53. VALIDATION STATUS MACHINE

Use:

```text
PENDING
VALID
LOW_CONFIDENCE
OUT_OF_RANGE
INVALID_IMAGE
EXPIRED
CALIBRATION_UNAVAILABLE
MODEL_UNAVAILABLE
UNSUPPORTED_CHEMISTRY
PROCESSING_ERROR
```

---

# 54. OFFLINE-FIRST ARCHITECTURE

The mobile app must be able to create a scan record without network access.

Architecture:

```text
              MOBILE
                 │
       ┌─────────┴─────────┐
       │                   │
   Local DB             Network
       │                   │
       ↓                   ↓
  Scan Record          Backend API
       │                   │
       ↓                   │
   Sync Queue              │
       │                   │
       └─────────┬─────────┘
                 ↓
             Reconcile
```

---

# 55. LOCAL DATA RULES

Local storage should contain only what is needed for:

* current operation
* offline history
* pending synchronization
* cached configuration
* local inference

Do not duplicate the entire server database onto the phone.

---

# 56. SYNC ALGORITHM

When connectivity is available:

```text
Detect connectivity
      ↓
Read pending queue
      ↓
Order records
      ↓
Send batch
      ↓
Server validates
      ↓
Server deduplicates
      ↓
Server persists
      ↓
Client marks synced
```

---

# 57. SYNC FAILURE

If upload fails:

```text
SYNC_FAILED
```

Retain:

* attempt count
* error code
* timestamp

Retry using backoff.

Do not delete the local record.

---

# 58. DUPLICATE PREVENTION

Every scan must have a globally unique client-generated ID.

The backend must use that ID for idempotency.

Example:

```text
client_scan_id = UUID
```

Submitting the same UUID twice must not create two exposure records.

---

# 59. CONFLICT HANDLING

For append-only scan records:

**server wins for synchronization metadata.**

Scan measurements should generally be immutable after accepted processing.

If a correction is required:

Create a new version/audit event rather than silently modifying the original scientific result.

---

# 60. AUTHENTICATION

Prototype options:

* JWT
* managed authentication provider

The architecture must support:

```text
access token
refresh token
session expiration
logout
```

Passwords must never be stored in plaintext.

---

# 61. AUTHORIZATION

Use role-based access control.

### WORKER

Can:

* access own profile
* start own shift
* pair authorized dosimeter
* scan
* view own history

Cannot:

* modify calibration
* modify models
* access other workers
* change thresholds

### HSE

Can:

* view authorized workers
* view exposure
* view alerts
* generate reports
* inspect technical scan details

Cannot:

* arbitrarily change scientific calibration unless explicitly granted.

### ADMIN

Can:

* manage users
* manage dosimeters
* manage configuration
* manage system settings

### RESEARCH

Can:

* manage calibration datasets
* inspect model metadata
* review validation

---

# 62. DATA IMMUTABILITY

Scientific measurements should be treated as immutable records.

Once a scan is accepted:

Do not silently overwrite:

* dose
* color features
* model version
* calibration version
* timestamp

If a reprocessing occurs:

Create a new processing/version record.

---

# 63. VERSIONING

Track at least:

```text
app_version
api_version
processing_version
feature_schema_version
calibration_version
model_version
configuration_version
```

This is required for reproducibility.

---

# 64. CONFIGURATION SERVICE

Centralize configurable parameters.

Example:

```text
Configuration {
    id
    version
    chemistry_id
    dosimeter_type
    geometry
    reference_layout
    image_quality_thresholds
    model_id
    calibration_id
    risk_thresholds
    expiry_rules
    created_at
}
```

The mobile app should cache an approved configuration for offline use.

---

# 65. EXPIRY LOGIC

Expiry validation must be implemented as a domain service.

Inputs:

```text
dosimeter
current_time
configuration
```

Output:

```text
VALID
EXPIRING_SOON
EXPIRED
```

Do not duplicate expiry logic across multiple screens.

---

# 66. RISK CLASSIFICATION

Risk classification must be separate from exposure estimation.

Architecture:

```text
ExposureResult
      ↓
RiskClassificationService
      ↓
RiskStatus
```

This prevents scientific measurement logic from becoming tangled with UI status logic.

Thresholds must be configuration-driven.

---

# 67. TWA CALCULATION

If scientifically appropriate and required inputs exist:

```text
TWA = cumulative_exposure / elapsed_exposure_time
```

The service must validate:

* exposure duration exists
* units are compatible
* dose is valid
* duration is non-zero

Otherwise:

```text
TWA = unavailable
```

Do not return zero.

---

# 68. UNIT HANDLING

Units must be explicit.

Never store a numerical measurement without a unit.

Examples:

```text
dose_value
dose_unit

twa_value
twa_unit

temperature_value
temperature_unit

humidity_value
humidity_unit
```

The backend should validate unit compatibility.

---

# 69. ERROR CODE SYSTEM

Create machine-readable error codes.

Examples:

```text
CAMERA_PERMISSION_DENIED
DOSIMETER_NOT_DETECTED
DOSIMETER_EXPIRED
INVALID_GEOMETRY
IMAGE_TOO_BLURRY
IMAGE_TOO_DARK
EXCESSIVE_GLARE
REFERENCE_NOT_FOUND
COLOR_CORRECTION_FAILED
CALIBRATION_UNAVAILABLE
MODEL_UNAVAILABLE
MODEL_OUT_OF_RANGE
LOW_CONFIDENCE
UNSUPPORTED_CHEMISTRY
NETWORK_UNAVAILABLE
SYNC_FAILED
UNAUTHORIZED
```

The UI maps these codes to human-friendly messages.

---

# 70. OBSERVABILITY

The backend should log:

* API errors
* processing failures
* inference failures
* synchronization failures
* authentication failures

Do not log:

* passwords
* access tokens
* unnecessary personal data

---

# 71. APPLICATION LOGGING

Use structured logs.

Example:

```text
{
  "timestamp": "...",
  "service": "inference",
  "scan_id": "...",
  "event": "MODEL_OUT_OF_RANGE",
  "model_version": "...",
  "details": {...}
}
```

---

# 72. TESTING STRATEGY

The software must be tested at multiple levels.

---

## 72.1 Unit tests

Test:

* ΔE
* CIELAB conversion
* TWA
* expiry
* risk classification
* validation
* feature extraction
* sync deduplication

---

## 72.2 CV tests

Use fixed test images for:

* correct framing
* perspective distortion
* blur
* glare
* low light
* incorrect orientation
* missing reference patches

Expected output should be deterministic within defined tolerance.

---

## 72.3 ML tests

Test:

* valid feature vector
* missing feature
* out-of-range feature
* incompatible chemistry
* incompatible model
* invalid model
* deterministic inference with test model

---

## 72.4 API tests

Test:

* authentication
* authorization
* CRUD
* scan submission
* duplicate scan
* sync
* error responses

---

## 72.5 Integration tests

At minimum:

```text
Create worker
→ Start shift
→ Pair dosimeter
→ Create scan
→ Process
→ Store result
→ Sync
→ Dashboard retrieves result
```

---

# 73. END-TO-END TEST

The most important automated/manual test is:

```text
Worker login
 ↓
Start shift
 ↓
Pair dosimeter
 ↓
Capture test image
 ↓
Process image
 ↓
Generate result
 ↓
Save locally
 ↓
Simulate offline
 ↓
Restore network
 ↓
Sync
 ↓
Dashboard displays scan
```

If this flow breaks, prioritize fixing it over secondary features.

---

# 74. DEMO MODE ARCHITECTURE

The application must support a controlled simulation mode.

```text
App
 ↓
Environment
 ├── REAL
 └── DEMO
```

Demo mode may use:

* seeded workers
* seeded dosimeters
* simulated scans
* known example images
* mock inference

Every simulated result must be marked:

```text
SIMULATED
```

---

# 75. MOCK INFERENCE

During UI development, use:

```text
MockInferenceEngine
```

Example behavior:

```text
Input:
sample_id = LOW

Output:
dose = configured sample value
status = NORMAL
confidence = configured sample confidence
source = SIMULATED
```

Do not generate random numbers on every refresh.

Demo results must be deterministic.

---

# 76. SAMPLE DATA ARCHITECTURE

Provide:

```text
data/
├── simulated/
│   ├── low/
│   ├── medium/
│   ├── high/
│   ├── invalid/
│   └── expired/
│
├── calibration/
│   └── README.md
│
└── sample/
    └── README.md
```

Sample data should include provenance metadata.

---

# 77. SECURITY

Minimum prototype requirements:

* HTTPS
* authenticated API
* RBAC
* secure password handling
* token expiration
* local sensitive-data protection
* audit logging

Production hardening is future scope but the architecture must not make it impossible.

---

# 78. IMAGE PRIVACY

The application should avoid unnecessary permanent storage of worker photographs or environmental imagery.

Prefer:

```text
Image
 ↓
Process
 ↓
Extract features
 ↓
Store required metadata
 ↓
Delete raw image
```

For research/debug mode, raw images may be retained under explicit retention/configuration rules.

---

# 79. API SECURITY

Every protected endpoint must verify:

```text
Authentication
+
Authorization
+
Resource ownership
```

Example:

A worker requesting another worker's scan must receive:

```text
403 FORBIDDEN
```

or equivalent authorization failure.

---

# 80. RATE LIMITING

Production API should support rate limiting.

For the prototype, simple endpoint-level protection is sufficient.

Especially protect:

* login
* upload
* model management
* calibration management

---

# 81. DEPLOYMENT ARCHITECTURE

Recommended prototype deployment:

```text
                    Internet
                       │
            ┌──────────┴──────────┐
            ↓                     ↓
      Mobile App             Web Dashboard
            │                     │
            └──────────┬──────────┘
                       ↓
                  Backend API
                       │
                ┌──────┴──────┐
                ↓             ↓
           PostgreSQL     Inference
```

Avoid multiple infrastructure layers unless required.

---

# 82. ENVIRONMENTS

Maintain:

```text
development
staging/demo
production
```

For SIH:

Use:

```text
development
demo
```

with production-style architecture where practical.

---

# 83. ENVIRONMENT VARIABLES

Use:

```text
DATABASE_URL
API_BASE_URL
JWT_SECRET
MODEL_STORAGE_PATH
MODEL_VERSION
CALIBRATION_VERSION
ENVIRONMENT
```

Never commit secrets.

Provide:

```text
.env.example
```

without real credentials.

---

# 84. CI/CD

The prototype should ideally run:

```text
lint
 ↓
type check
 ↓
unit tests
 ↓
integration tests
 ↓
build
```

before deployment.

Do not allow broken code to silently become the new baseline.

---

# 85. FRONTEND/BACKEND CONTRACT

Shared API schemas should be generated or centrally defined where practical.

Prefer:

```text
OpenAPI
```

as the contract.

The mobile and dashboard clients should consume typed API models.

Do not duplicate request/response interfaces manually in multiple locations when automatic generation is practical.

---

# 86. DESIGN SYSTEM INTEGRATION

The mobile and dashboard applications should share conceptual design tokens:

* typography hierarchy
* semantic statuses
* spacing
* terminology
* icon meaning
* exposure-state language

Platform-specific UI implementation may differ.

---

# 87. SCIENTIFIC DOMAIN BOUNDARY

The software should treat the following as externally validated scientific inputs:

```text
chemistry behavior
sensor response
calibration relationship
dose operating range
environmental compensation
risk thresholds
model performance
```

The application is responsible for:

```text
measurement workflow
image processing
feature extraction
inference execution
validation
storage
traceability
visualization
```

It must not silently invent scientific relationships.

---

# 88. EXTENSIBILITY

The architecture should allow:

### New chemistry

```text
Chemistry A
Chemistry B
Chemistry C
```

without rewriting the entire application.

### New model

```text
XGBoost
Calibration curve
Future model
```

without rewriting the UI.

### New dosimeter geometry

Different physical layouts should be represented through configuration.

### New sensor

The platform should eventually support other passive colorimetric sensors.

---

# 89. MULTI-CHEMISTRY ARCHITECTURE

Avoid naming core abstractions exclusively around H₂S.

Prefer:

```text
ExposureResult
ChemicalSensor
Dosimeter
Chemistry
InferenceEngine
Calibration
```

rather than:

```text
H2SResult
H2SSensor
H2SModel
```

where generalization is reasonable.

The current product may still display:

**H₂S**

to users.

---

# 90. PERFORMANCE TARGETS

Prototype goals:

### Scanner

Image-quality feedback should feel near real-time.

### Local processing

A valid scan should ideally complete within a few seconds on a supported device.

### Dashboard

Normal dashboard interactions should feel responsive.

### Sync

Pending records should synchronize automatically after connectivity returns.

These are prototype UX targets, not validated scientific performance claims.

---

# 91. RESOURCE MANAGEMENT

Camera/image processing can be memory intensive.

The mobile implementation must:

* resize images appropriately
* avoid retaining unnecessary full-resolution frames
* process one frame at a time where practical
* release camera resources correctly
* avoid memory leaks

---

# 92. CAMERA DEVICE VARIABILITY

Do not assume all smartphones have identical cameras.

The architecture should support device metadata:

```text
device_model
camera_id
image_resolution
capture_parameters
app_version
```

This information can later be used to investigate device-specific bias.

---

# 93. DEVICE CALIBRATION EXTENSIBILITY

Future versions may support device-specific calibration.

Do not make the system architecture assume:

```text
one phone = one universal color response
```

Instead support:

```text
device_profile
camera_profile
color_profile
```

as optional configuration.

---

# 94. IMAGE PROCESSING REPRODUCIBILITY

Whenever a scan is processed, record:

```text
processing_version
configuration_version
camera/device metadata
model_version
calibration_version
```

This makes it possible to reproduce or investigate a historical result.

---

# 95. IMMUTABLE PROCESSING ARTIFACT

For every processed scan, retain the numerical processing output necessary for audit:

```text
image quality metrics
ROI coordinates
reference measurements
color features
model input features
prediction
validation status
```

Raw image retention may be configurable.

---

# 96. REPROCESSING

The system should eventually support:

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

Do not overwrite the historical result.

---

# 97. DASHBOARD DATA FLOW

```text
Scan submitted
      ↓
Backend stores scan
      ↓
Inference result stored
      ↓
Analytics aggregation
      ↓
Dashboard query
      ↓
Worker table
      ↓
Exposure chart
      ↓
Alert engine
```

Dashboard must consume persisted backend records rather than maintaining a separate source of truth.

---

# 98. ALERT ENGINE

Separate alert evaluation from UI.

```text
ExposureResult
      ↓
Threshold Configuration
      ↓
AlertEvaluationService
      ↓
Alert
```

The same alert should not be generated repeatedly every time the dashboard refreshes.

Alerts require unique event logic.

---

# 99. REPORT GENERATION

Reports should be generated from backend data.

Possible formats:

* CSV
* PDF

Report metadata should include:

```text
generated_at
generated_by
date_range
filters
data_version
```

---

# 100. AUDITABILITY

A technical reviewer should be able to answer:

> "Where did this number come from?"

The system should allow tracing:

```text
Exposure Result
 ↓
Scan
 ↓
Color Features
 ↓
Image Analysis
 ↓
Calibration
 ↓
Model
 ↓
Model Version
 ↓
Configuration Version
```

This traceability is a core architecture requirement.

---

# 101. WHAT THE AGENT MUST NOT DO

The coding agent must NOT:

* place ML logic inside React components
* put database queries inside UI components
* hard-code calibration coefficients
* hard-code risk thresholds
* fabricate scientific values
* silently extrapolate outside model range
* make fake API calls while presenting them as real
* create fake "AI confidence" percentages
* generate random demo results
* store every camera frame permanently
* build microservices without need
* introduce unnecessary cloud infrastructure
* replace deterministic CV with deep learning merely for appearance
* use frontend state as the database
* silently overwrite historical measurements

---

# 102. IMPLEMENTATION ORDER

The recommended implementation sequence is:

## Stage 1

Repository + tooling

```text
Monorepo
TypeScript
Python
Linting
Formatting
Testing
Environment config
```

## Stage 2

Design system

```text
Tokens
Typography
Colors
Components
Navigation
```

## Stage 3

Mobile shell

```text
Auth
Home
Shift
Navigation
```

## Stage 4

Scanner

```text
Camera
Detection
Quality
ROI
Perspective
Reference
```

## Stage 5

Color science

```text
Correction
CIELAB
ΔE
Feature extraction
```

## Stage 6

Inference

```text
Calibration engine
Mock model
XGBoost abstraction
Validation
```

## Stage 7

Persistence

```text
SQLite
PostgreSQL
API
```

## Stage 8

Offline sync

```text
Queue
Retry
Deduplication
Reconciliation
```

## Stage 9

Dashboard

```text
Overview
Workers
Scans
Exposure
Alerts
```

## Stage 10

Advanced features

```text
Calibration
Model Registry
Reports
Audit
```

---

# 103. FEATURE IMPLEMENTATION RULE

Every major feature must be implemented vertically.

Do NOT build:

```text
100% frontend
then
100% backend
then
100% ML
```

Instead build:

```text
Feature
 ↓
UI
 ↓
Service
 ↓
API
 ↓
Database
 ↓
Test
```

Example:

```text
Scan
 ↓
Scanner UI
 ↓
ScanService
 ↓
POST /scans
 ↓
Scan table
 ↓
Processing
 ↓
Result
 ↓
Test
```

This keeps the application demonstrably functional throughout development.

---

# 104. MVP ARCHITECTURAL DEFINITION

The minimum viable architecture is:

```text
React Native
       ↓
SQLite
       ↓
FastAPI
       ↓
PostgreSQL
       ↓
Python CV
       ↓
Python inference
       ↓
Next.js dashboard
```

This is sufficient for the SIH prototype.

---

# 105. FUTURE PRODUCTION ARCHITECTURE

Do not implement now unless required.

Potential future additions:

* cloud object storage
* managed authentication
* background workers
* model serving infrastructure
* telemetry
* device fleet management
* enterprise SSO
* advanced observability
* distributed processing
* hardware integrations

The prototype architecture should make these possible without requiring them today.

---

# 106. ARCHITECTURAL DECISION RECORDS

Important architectural decisions should be documented.

Create:

```text
docs/adr/
```

Examples:

```text
ADR-001-mobile-framework.md
ADR-002-offline-first.md
ADR-003-inference-architecture.md
ADR-004-database-choice.md
ADR-005-color-processing.md
```

Each ADR should contain:

```text
Context
Decision
Alternatives
Reason
Consequences
```

Do not create ADRs for trivial implementation details.

---

# 107. DEFINITION OF TECHNICAL DONE

A feature is technically complete only when:

* implementation exists
* types/interfaces exist
* persistence exists where needed
* API exists where needed
* validation exists
* error handling exists
* loading state exists
* tests exist
* offline behavior exists where relevant
* audit/version information exists where relevant
* feature works in the actual application flow

A screenshot of a UI is not evidence of implementation.

---

# 108. FINAL ARCHITECTURAL RULE

The entire system should preserve this fundamental boundary:

```text
PHYSICAL SENSOR
      ↓
OPTICAL OBSERVATION
      ↓
COMPUTER VISION
      ↓
COLOR SCIENCE
      ↓
CALIBRATION / MODEL
      ↓
VALIDATED EXPOSURE RESULT
      ↓
DIGITAL RECORD
      ↓
HSE INTELLIGENCE
```

The software must make every transition explicit, testable and traceable.

The application should be capable of answering:

1. What did the camera see?
2. What region was analyzed?
3. How was the color corrected?
4. What colorimetric features were extracted?
5. Which calibration was used?
6. Which model was used?
7. Was the input inside the validated operating range?
8. What result was produced?
9. How confident/valid was the result?
10. Which worker/dosimeter/shift does it belong to?
11. Was the record synced?
12. Can the result be audited later?

If the architecture can answer all twelve questions, the prototype has a technically defensible software foundation.
