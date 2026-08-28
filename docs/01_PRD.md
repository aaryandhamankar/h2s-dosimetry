# Product Requirements Document

# Passive Colorimetric H₂S Exposure-Dosimeter Platform

**Document:** 01_PRD.md
**Product:** Digital H₂S Exposure Dosimeter Companion Platform
**Prototype Target:** Smart India Hackathon (SIH)
**Primary Users:** Industrial workers, HSE/Safety Officers, Administrators
**Status:** Prototype / Research Validation
**Priority:** P0–P2 requirements defined below

---

# 1. PRODUCT VISION

Build a software platform that converts the color change of a passive, disposable H₂S-sensitive dosimeter into a digitally recorded and quantitatively estimated cumulative exposure result.

The software must bridge the following chain:

H₂S Exposure
→ Passive Chemical Reaction
→ Permanent/Accumulated Color Change
→ Smartphone Camera
→ Computer Vision
→ Colorimetric Features
→ Exposure-Dose Estimation
→ Confidence / Validity Assessment
→ Worker Exposure Record
→ HSE Analytics & Dashboard

The software is therefore not simply a camera app.

It is a complete:

1. Dosimeter reader
2. Computer-vision processing system
3. Exposure estimation engine
4. Validation and quality-control system
5. Worker exposure logging system
6. Offline-first field application
7. HSE analytics dashboard
8. Audit and reporting platform

---

# 2. CORE PRODUCT PRINCIPLE

The passive dosimeter measures integrated exposure over time.

The fundamental conceptual relationship is:

D = ∫ C(t) dt

where:

* D = cumulative exposure dose
* C(t) = H₂S concentration as a function of time
* t = exposure duration

The software must NOT represent the passive strip as an instantaneous gas detector.

For the prototype, the software should communicate that the optical state corresponds to cumulative exposure and that elapsed activation/exposure time can be used to derive a shift-level average:

TWA_shift = D / Δt

where:

* D = estimated cumulative exposure dose
* Δt = elapsed dosimeter exposure time

The UI must clearly distinguish:

* instantaneous H₂S concentration
* cumulative exposure dose
* shift-level TWA
* risk/status classification

These are different quantities and must never be visually conflated.

---

# 3. PRODUCT GOALS

## 3.1 Primary Goals

### G1 — Digitize passive dosimeter reading

Replace subjective visual comparison with smartphone-based optical analysis.

### G2 — Quantify cumulative exposure

Convert validated colorimetric information into an estimated exposure dose using an experimentally calibrated model.

### G3 — Make readings reproducible

Reduce variation caused by:

* ambient lighting
* camera differences
* glare
* shadows
* perspective
* image quality
* device-specific color response

### G4 — Self-validate the reading

The software must determine whether a scan is sufficiently valid before producing a trusted quantitative result.

### G5 — Maintain a digital exposure history

Every accepted reading should be associated with:

* worker
* dosimeter
* timestamp
* exposure duration
* result
* confidence
* model version
* calibration version
* validity status

### G6 — Work in field conditions

The worker application must support offline operation and synchronize records when connectivity returns.

### G7 — Provide HSE visibility

Safety personnel must be able to view:

* workers
* exposure history
* exposure trends
* risk/status
* alerts
* scan validity
* aggregate statistics
* audit history

### G8 — Demonstrate an end-to-end working prototype

The SIH prototype must be capable of demonstrating:

Scan
→ Analyze
→ Estimate
→ Save
→ Sync
→ Dashboard

---

# 4. NON-GOALS

The following are NOT core software objectives for the SIH prototype.

## NG1 — Real-time H₂S alarming

The passive dosimeter is not an instantaneous electronic detector.

Do not implement the UI as though the phone continuously measures atmospheric H₂S.

## NG2 — Deep-learning image recognition

Do not build a CNN-heavy image model unless specifically required later.

The research direction favors deterministic computer vision + color science + a lightweight gradient-boosting regression model.

## NG3 — Bluetooth gas sensing

Bluetooth-connected electronic H₂S sensing is future scope, not a prototype requirement.

## NG4 — Regulatory certification

The prototype must not claim OSHA/BIS/OISD/other regulatory certification.

Regulatory thresholds may be displayed as reference information only when they have been explicitly validated and configured.

## NG5 — Medical diagnosis

Exposure data must not be presented as medical diagnosis or health assessment.

## NG6 — Autonomous emergency response

The prototype does not control plant equipment, evacuation systems, alarms, valves, or other safety-critical infrastructure.

## NG7 — Perfect quantitative accuracy

The system must expose uncertainty and validity rather than inventing precision.

---

# 5. TARGET USERS

## 5.1 Worker / Field Operator

### Context

A worker wears the passive dosimeter during a shift and later scans it using the companion application.

### Needs

* Fast scanning
* Minimal interaction
* Clear instructions
* Immediate result
* Clear validity status
* Personal exposure history
* Offline functionality

### Primary actions

* Login
* Start shift
* Pair dosimeter
* Scan dosimeter
* Review result
* View own history
* Sync data

---

# 5.2 HSE / Safety Officer

### Context

Responsible for monitoring worker exposure and identifying trends or abnormal exposure.

### Needs

* Worker-level exposure records
* Aggregate exposure trends
* Alerts
* Scan quality information
* Model/calibration traceability
* Reports
* Audit trail

### Primary actions

* View dashboard
* Search workers
* View worker history
* Inspect exposure event
* Filter by date/shift/location/department
* Review alerts
* Export reports
* Review invalid/low-confidence scans

---

# 5.3 Administrator

### Responsibilities

* User management
* Worker records
* Dosimeter inventory
* Chemistry/calibration configuration
* Model configuration
* System configuration
* Access control
* Audit logs

---

# 5.4 Research / Calibration User

Optional for the SIH prototype but architecturally important.

Used to manage:

* calibration datasets
* experimental measurements
* batch IDs
* model versions
* validation results
* calibration curves

This role must be separated from ordinary worker functionality.

---

# 6. PRODUCT SURFACES

The system consists of two primary software surfaces.

## 6.1 Mobile Application

Primary functions:

* authentication
* shift management
* dosimeter pairing
* camera scanning
* computer vision
* exposure estimation
* result presentation
* local storage
* synchronization
* worker history

Target:

* Android first
* iOS-compatible architecture where practical

The SIH prototype should prioritize Android because it is the primary field-prototype platform.

---

# 6.2 HSE Web Dashboard

Primary functions:

* organization overview
* worker exposure analytics
* exposure event history
* alerts
* dosimeter status
* scan quality
* reports
* audit logs
* calibration/model information

Target:

Responsive web application.

---

# 7. CORE END-TO-END WORKFLOW

The primary system workflow is:

```text
Worker Login
      ↓
Start / Continue Shift
      ↓
Pair Worker + Dosimeter
      ↓
Open Scanner
      ↓
Detect Dosimeter
      ↓
Guide Camera Alignment
      ↓
Check Image Quality
      ↓
Capture Image
      ↓
Detect / Validate ROI
      ↓
Perspective Correction
      ↓
Reference Patch Detection
      ↓
Illumination / Color Correction
      ↓
CIELAB Conversion
      ↓
Baseline Comparison
      ↓
ΔL*, Δa*, Δb*, ΔE Extraction
      ↓
Environmental / Temporal Features
      ↓
Calibration / ML Inference
      ↓
Prediction Validation
      ↓
Confidence Estimation
      ↓
Risk / Status Classification
      ↓
Display Result
      ↓
Store Locally
      ↓
Synchronize to Backend
      ↓
Update HSE Dashboard
```

Every stage must produce a structured result that can be logged for debugging and validation.

---

# 8. P0 — MUST-HAVE FEATURES

P0 features are mandatory for the SIH functional prototype.

---

## P0.1 Authentication

Users must be able to authenticate.

### Requirements

* Login screen
* Role-aware access
* Session management
* Logout
* Persistent session where appropriate
* Invalid credential handling

### Roles

At minimum:

* Worker
* HSE Officer
* Admin

---

# P0.2 Worker Profile

A worker profile must contain:

* worker ID
* display name
* role
* department/team
* optional organizational metadata
* assigned dosimeter information

The system should prefer pseudonymous identifiers for shared analytics.

---

# P0.3 Shift Start

The worker must be able to start a shift/dosimeter exposure period.

Record:

* shift ID
* worker ID
* dosimeter ID
* start timestamp
* status

The timestamp becomes important for later calculation of elapsed exposure time.

---

# P0.4 Dosimeter Pairing

The application must support identifying a dosimeter.

Preferred mechanism:

* DataMatrix / QR-style machine-readable identifier

Optional:

* RFID worker badge integration

For the prototype, QR/DataMatrix scanning is sufficient if RFID hardware is not available.

### Pairing record

```text
dosimeter_id
worker_id
shift_id
batch_id
chemistry_id
activation_time
expiry_date
```

---

# P0.5 Camera Scanner

The scanner is the core mobile feature.

It must:

1. Open the camera.
2. Detect the dosimeter.
3. Display an alignment guide.
4. Detect whether the dosimeter is sufficiently framed.
5. Detect potential glare.
6. Detect insufficient lighting.
7. Detect excessive blur.
8. Detect incorrect orientation.
9. Guide the user to correct the problem.
10. Capture the image when quality requirements are satisfied.

The experience should minimize manual tapping.

---

# P0.6 Dosimeter Detection

The app must determine whether the expected dosimeter/cartridge is visible.

Possible detection mechanisms:

* fiducial/corner markers
* DataMatrix/QR region
* predefined geometry
* reference patches

The prototype should prefer robust geometric detection over unnecessarily complex AI detection.

---

# P0.7 Perspective Correction

The application must compensate for camera angle.

The expected pipeline is:

```text
Camera Image
     ↓
Dosimeter Detection
     ↓
Corner / Marker Detection
     ↓
Homography
     ↓
Perspective Warp
     ↓
Standardized ROI
```

The research describes transforming the cropped region into a standardized image region.

The implementation must keep this transformation modular so dimensions can be changed when physical prototype geometry is finalized.

---

# P0.8 Reference Color Detection

The dosimeter should contain known reference color patches.

The prototype architecture should support multiple reference patches, including the proposed:

* white
* neutral gray
* cyan
* magenta

The software must locate these reference patches and use them for color correction.

Reference patch locations must be configuration-driven rather than hard-coded throughout the application.

---

# P0.9 Illumination / Color Correction

The raw smartphone image must not be directly interpreted as exposure.

The processing pipeline must compensate for camera/lighting differences before extracting color features.

The research proposes reference-based chromatic adaptation, including a Bradford transform toward a D65 reference condition.

The implementation should therefore expose a dedicated color-correction module:

```text
Raw RGB
 ↓
Reference Patch Measurements
 ↓
Color Calibration
 ↓
Corrected RGB
 ↓
CIELAB
```

The implementation must allow the color correction method to be replaced or recalibrated later.

---

# P0.10 CIELAB Extraction

The system must convert the corrected color representation into:

* L*
* a*
* b*

Interpretation:

* L* → lightness
* a* → green ↔ red
* b* → blue ↔ yellow

The app must retain these values as structured numerical features.

---

# P0.11 Baseline Comparison

The software must compare the exposed sensing region against an appropriate baseline.

Required features:

```text
L*
a*
b*

ΔL*
Δa*
Δb*
ΔE
```

The baseline may come from:

* unexposed reference measurement
* batch-specific calibration baseline
* predefined validated baseline

Do not assume that one universal baseline will remain valid across all chemistry batches.

---

# P0.12 ΔE Calculation

For the prototype, support ΔE*ab:

ΔE*ab =
√[(L* − L*₀)² + (a* − a*₀)² + (b* − b*₀)²]

The implementation must keep the color-difference calculation as an independent service/function.

Do not embed it inside UI code.

---

# P0.13 Exposure Estimation

The system must convert extracted colorimetric features into an estimated cumulative exposure dose.

Conceptually:

```text
Color Features
+
Time
+
Environmental Features
+
Batch / Chemistry
        ↓
Calibration / ML Model
        ↓
Estimated Dose
```

The primary research direction is a physics-informed XGBoost regression model.

The architecture must allow the model to be replaced without rewriting the application.

---

# P0.14 Model Output

A prediction must NOT consist only of one number.

Minimum structured output:

```text
estimated_dose
dose_unit
confidence
validity_status
model_version
calibration_version
prediction_timestamp
```

Where scientifically supported, also provide:

```text
lower_bound
upper_bound
prediction_interval
```

Do not invent confidence values.

For simulated prototype data, explicitly mark outputs as simulated.

---

# P0.15 Prediction Validity

Before displaying a result as valid, the system must evaluate:

* image quality
* ROI validity
* reference patch validity
* calibration availability
* model operating range
* chemistry compatibility
* batch compatibility
* expiry status
* confidence threshold
* environmental validity where applicable

Possible statuses:

```text
VALID
LOW_CONFIDENCE
OUT_OF_RANGE
INVALID_IMAGE
EXPIRED
CALIBRATION_UNAVAILABLE
UNSUPPORTED_CHEMISTRY
PROCESSING_ERROR
```

---

# P0.16 Result Screen

After scanning, show a clear result.

Primary hierarchy:

```text
EXPOSURE RESULT
     ↓
Estimated cumulative dose
     ↓
Risk / interpretation
     ↓
Confidence / validity
     ↓
Exposure duration
     ↓
Scan timestamp
```

The result must not overwhelm the worker with raw technical information.

Provide an expandable "Technical Details" section containing:

* L*
* a*
* b*
* ΔL*
* Δa*
* Δb*
* ΔE
* calibration ID
* model version
* image quality score

---

# P0.17 Shift TWA

If the required exposure duration information is available, calculate:

TWA_shift = estimated cumulative dose / elapsed exposure time

The UI must label this explicitly as:

**Shift-level estimated TWA**

It must not be presented as instantaneous concentration.

---

# P0.18 Exposure Status

The application may classify results into configurable statuses.

Example conceptual structure:

```text
NORMAL
CAUTION
HIGH
CRITICAL
```

However, the thresholds MUST NOT be hard-coded until scientifically and operationally validated.

Instead:

```text
RiskThresholdConfig
```

must contain configurable thresholds.

Every displayed threshold should have:

* source
* unit
* version
* effective date
* configuration ID

If thresholds are not configured, show:

**Status unavailable — threshold configuration required.**

---

# P0.19 Scan History

Workers should be able to see their previous scans.

Each record should contain:

* timestamp
* shift
* dosimeter ID
* cumulative dose
* TWA if available
* status
* confidence
* sync status

---

# P0.20 Offline Mode

The mobile application must remain functional when network connectivity is unavailable.

At minimum:

```text
Login/session
Dosimeter scan
Image processing
Inference
Result display
Local save
```

should work offline where the required model and configuration are already available.

---

# P0.21 Local Storage

Use encrypted local storage where practical.

The local record should include:

```text
scan_id
worker_id
dosimeter_id
shift_id
timestamp
dose
TWA
status
confidence
color_features
model_version
calibration_version
sync_status
```

Raw images should NOT automatically be retained forever.

The prototype may store images temporarily for debugging/validation, but production architecture should minimize unnecessary image retention.

---

# P0.22 Cloud Synchronization

When connectivity returns:

```text
Local Queue
    ↓
Connectivity Detected
    ↓
Upload Pending Records
    ↓
Server Validation
    ↓
Success
    ↓
Mark Synced
```

The sync engine must handle:

* retry
* duplicate prevention
* failed uploads
* partial sync
* timestamp preservation

---

# P0.23 HSE Dashboard

The dashboard must show:

### Overview

* workers monitored
* scans performed
* valid scans
* invalid scans
* high-risk events
* average exposure metrics where meaningful
* pending synchronization
* recent alerts

---

# P0.24 Worker Exposure View

HSE users should be able to select a worker and see:

* exposure events
* historical dose
* shift duration
* TWA history
* validity status
* trend graph
* dosimeter history

---

# P0.25 Exposure Analytics

Support filtering by:

* date
* worker
* department
* shift
* dosimeter
* status
* batch
* chemistry

Charts should prioritize:

* exposure over time
* dose distribution
* valid vs invalid scans
* risk/status distribution

---

# P0.26 Alerts

Generate application-level alerts when configured conditions are met.

Alert object:

```text
alert_id
worker_id
scan_id
severity
reason
timestamp
status
acknowledged_by
acknowledged_at
```

Alerts must be based on configurable thresholds.

---

# P0.27 Audit Logging

Record security-sensitive actions including:

* login
* logout
* scan
* record creation
* record modification
* record deletion
* dashboard access
* report generation
* model changes
* calibration changes
* configuration changes

Audit entries should contain:

```text
event_id
user_id
action
timestamp
entity_type
entity_id
metadata
```

---

# 9. P1 — IMPORTANT FEATURES

P1 features should be implemented after the core scan workflow is stable.

---

# P1.1 Scan Quality Score

Provide an overall image quality score based on:

* blur
* brightness
* glare
* framing
* reference detection
* ROI confidence

Example:

```text
Excellent
Good
Marginal
Invalid
```

This is a quality score, NOT model confidence.

Keep these concepts separate.

---

# P1.2 Intelligent Retake Guidance

Instead of:

"Invalid image"

tell the user:

* "Move closer."
* "Reduce glare."
* "Hold the phone steady."
* "Move into better lighting."
* "Center the dosimeter."
* "Reference patch not detected."

---

# P1.3 Technical Scan Report

Provide a technical view for HSE/research users.

Show:

```text
Image
ROI
Reference patches
Corrected image
L*
a*
b*
ΔL*
Δa*
Δb*
ΔE
Model input features
Dose
Confidence
Model version
Calibration version
```

This is particularly useful during SIH judging because it makes the AI pipeline explainable.

---

# P1.4 Dosimeter Inventory

Track:

* dosimeter ID
* batch
* chemistry
* manufacturing date
* expiry date
* activation date
* current status
* assigned worker

Statuses:

```text
UNASSIGNED
ACTIVE
USED
EXPIRED
INVALID
DISPOSED
```

---

# P1.5 Expiry Validation

The dosimeter should be checked against its expiry metadata and, where the hardware design supports it, an expiry/self-validation patch.

If invalid:

Do not produce a trusted quantitative exposure result.

Display:

**Dosimeter validity check failed. Replace dosimeter before relying on the result.**

---

# P1.6 Batch-Aware Calibration

Calibration must be associated with:

* chemistry
* batch ID
* calibration dataset
* valid dose range
* environmental conditions
* model version

The application must never silently apply a calibration model to an incompatible batch.

---

# P1.7 Model Registry

Maintain model metadata:

```text
model_id
version
chemistry
batch_scope
training_dataset
validation_dataset
metrics
operating_range
created_at
status
```

Possible model states:

```text
DRAFT
VALIDATING
APPROVED
RETIRED
```

---

# P1.8 Configuration Management

Move variable scientific parameters into configuration.

Examples:

```text
camera_quality_thresholds
glare_threshold
blur_threshold
reference_patch_locations
dosimeter_geometry
calibration_id
model_id
risk_thresholds
expiry_rules
supported_chemistries
```

Do not hard-code these values across the application.

---

# P1.9 Reports

Generate downloadable reports containing:

* worker exposure summary
* date range
* scans
* dose estimates
* TWA
* status
* invalid scans
* alerts
* model/calibration versions

---

# P1.10 Search

HSE users should be able to search:

* worker ID
* dosimeter ID
* shift ID
* scan ID

---

# 10. P2 — FUTURE FEATURES

These are intentionally not required for the initial SIH build.

---

## P2.1 NFC Dosimeter Identification

Automatic identification using NFC.

---

## P2.2 BLE Hardware

Integration with powered electronic H₂S sensors.

---

## P2.3 Hybrid Dosimeter

Combine passive cumulative sensing with instantaneous electronic sensing.

---

## P2.4 Multi-Gas Platform

Potentially adapt the software architecture for other passive chemistries.

Examples may include:

* NH₃
* Cl₂
* other target gases

The software should therefore avoid naming all domain entities as H₂S-specific internally where a generic architecture is practical.

---

# 11. COMPUTER VISION REQUIREMENTS

The CV pipeline must be modular.

Required conceptual stages:

```text
IMAGE CAPTURE
      ↓
IMAGE QUALITY
      ↓
DOSIMETER DETECTION
      ↓
ROI EXTRACTION
      ↓
PERSPECTIVE CORRECTION
      ↓
REFERENCE DETECTION
      ↓
COLOR CORRECTION
      ↓
CIELAB
      ↓
FEATURE EXTRACTION
      ↓
VALIDATION
```

Each stage must return:

```text
success
data
confidence/quality where applicable
error_code
diagnostic_message
```

---

# 12. ML REQUIREMENTS

The ML system must be treated as a separate subsystem.

Expected prototype architecture:

```text
CV Features
     +
Temporal Features
     +
Environmental Features
     +
Batch/Chemistry Metadata
          ↓
Feature Vector
          ↓
Physics-Informed Regression
          ↓
Dose Estimate
          ↓
Prediction Validation
          ↓
Confidence / Interval
```

Primary candidate model:

**XGBoost regression**

Do not assume this is scientifically final.

The model is a prototype implementation and must ultimately be validated using real calibration data.

---

# 13. MODEL SAFETY RULES

The application must not:

* fabricate predictions when required inputs are missing
* extrapolate silently outside the validated calibration range
* report a high-precision result from low-quality imagery
* use an incompatible calibration model
* hide uncertainty
* treat simulated data as real experimental measurements

If inference cannot be trusted:

```text
DO NOT QUANTIFY
```

Instead show the reason.

---

# 14. SIMULATION MODE

Because the SIH software prototype may be developed before a complete experimentally validated dataset exists, the application may include a clearly marked:

**DEMO / SIMULATION MODE**

Simulation mode may use seeded datasets to demonstrate:

* low exposure
* medium exposure
* high exposure
* invalid scan
* expired dosimeter
* low-confidence scan
* offline sync

Every simulated result must be visibly distinguishable from experimentally validated measurements.

Never label simulated values as actual H₂S measurements.

---

# 15. DATA MODEL — CORE ENTITIES

The architecture should include at least:

```text
User
WorkerProfile
Shift
Dosimeter
DosimeterBatch
Chemistry
Scan
ImageAnalysis
ColorFeatures
ExposureResult
Calibration
Model
Alert
AuditLog
SyncQueue
Configuration
```

Relationships:

```text
User
 ↓
WorkerProfile
 ↓
Shift
 ↓
Dosimeter
 ↓
Scan
 ↓
ImageAnalysis
 ↓
ColorFeatures
 ↓
ExposureResult
```

And:

```text
Dosimeter
 ↓
DosimeterBatch
 ↓
Calibration
 ↓
Model
```

---

# 16. SCAN ENTITY

Every scan must have a unique ID.

Suggested fields:

```text
scan_id
worker_id
shift_id
dosimeter_id
batch_id
chemistry_id

captured_at
processed_at
synced_at

image_quality_status
roi_status
reference_status
expiry_status
calibration_status
model_status

L
a
b

delta_L
delta_a
delta_b
delta_E

estimated_dose
dose_unit

exposure_duration
estimated_twa
twa_unit

confidence
validity_status
risk_status

model_version
calibration_version

processing_version
app_version

sync_status
```

---

# 17. API REQUIREMENTS

The backend must expose typed APIs for:

### Authentication

```text
POST /auth/login
POST /auth/logout
```

### Workers

```text
GET /workers
GET /workers/:id
```

### Dosimeters

```text
GET /dosimeters
GET /dosimeters/:id
POST /dosimeters/pair
```

### Shifts

```text
POST /shifts
GET /shifts/:id
```

### Scans

```text
POST /scans
GET /scans/:id
GET /workers/:id/scans
```

### Sync

```text
POST /sync
```

### Analytics

```text
GET /analytics/overview
GET /analytics/exposure
```

### Alerts

```text
GET /alerts
POST /alerts/:id/acknowledge
```

### Models / Calibration

```text
GET /models
GET /calibrations
```

Exact routes may change during implementation, but equivalent separation must exist.

---

# 18. OFFLINE-FIRST REQUIREMENTS

The mobile application must be designed around intermittent connectivity.

Required architecture:

```text
             ┌──────────────┐
             │ Mobile App   │
             └──────┬───────┘
                    ↓
             ┌──────────────┐
             │ Local Store  │
             └──────┬───────┘
                    ↓
             ┌──────────────┐
             │ Sync Queue   │
             └──────┬───────┘
                    ↓
             ┌──────────────┐
             │ Backend API  │
             └──────────────┘
```

The user must know whether a record is:

```text
Saved locally
Syncing
Synced
Sync failed
```

---

# 19. SECURITY & PRIVACY

Minimum requirements:

* HTTPS
* authenticated API access
* role-based access control
* encrypted local sensitive storage
* pseudonymous worker IDs where possible
* audit logging
* minimal image retention
* no unnecessary location tracking
* no unnecessary personal data collection

Workers should only access their own exposure records.

HSE users may access authorized organizational records.

Administrators have configuration privileges.

---

# 20. UX REQUIREMENTS

The worker workflow must optimize for speed.

A worker should not need to understand:

* CIELAB
* ΔE
* homography
* XGBoost
* calibration curves

during normal scanning.

Instead:

```text
ALIGN
 ↓
HOLD
 ↓
SCANNING
 ↓
ANALYZING
 ↓
RESULT
```

Technical information belongs behind an advanced/details layer.

---

# 21. ERROR HANDLING

Every major operation must have:

### Loading state

Example:

"Analyzing dosimeter..."

### Success state

Example:

"Scan complete."

### Empty state

Example:

"No exposure records yet."

### Error state

Example:

"We couldn't read the dosimeter."

### Recovery action

Example:

"Retake scan"

or:

"Try again when connected."

Never display generic:

"Something went wrong."

when a useful recovery explanation can be provided.

---

# 22. CRITICAL ERROR STATES

The application must explicitly handle:

```text
Camera unavailable
Permission denied
Dosimeter not detected
Bad framing
Blur
Glare
Insufficient lighting
Reference patches not detected
Invalid geometry
Expired dosimeter
Unsupported batch
Missing calibration
Model unavailable
Model out of range
Low confidence
Processing failure
Offline
Sync failure
Duplicate scan
Unauthorized access
```

---

# 23. DEMO REQUIREMENTS

The prototype must support a clean SIH demonstration.

### Demo flow

```text
Worker Login
      ↓
Start Shift
      ↓
Pair Badge
      ↓
Scan Dosimeter A
      ↓
Image Analysis
      ↓
Exposure Result
      ↓
Save
      ↓
Scan Dosimeter B
      ↓
Different Exposure Result
      ↓
Open HSE Dashboard
      ↓
Worker Exposure Records Appear
      ↓
Show Exposure Trend
      ↓
Show Expired Dosimeter
      ↓
App Rejects / Flags It
```

The demo should demonstrate both:

**measurement intelligence**

and

**digital HSE recordkeeping.**

---

# 24. ACCEPTANCE CRITERIA — MVP

The prototype is considered functionally complete when all of the following are possible:

## AC01

A worker can log into the application.

## AC02

A worker can start a shift.

## AC03

A dosimeter can be associated with the worker.

## AC04

The camera can detect and guide the user toward the dosimeter.

## AC05

The application can identify the sensing ROI.

## AC06

The application can identify reference patches.

## AC07

The image can undergo perspective and color correction.

## AC08

The application can extract L*, a*, b* values.

## AC09

The application can calculate ΔL*, Δa*, Δb*, and ΔE.

## AC10

The processing pipeline can pass these features into a configurable inference engine.

## AC11

The inference engine can return a structured dose result using a calibration/model dataset.

## AC12

The application refuses or flags results when validity requirements are not met.

## AC13

The worker sees a clear result.

## AC14

The result is saved locally.

## AC15

The result synchronizes when connectivity returns.

## AC16

The HSE dashboard displays the scan.

## AC17

The HSE dashboard can display historical exposure data.

## AC18

An expired/invalid dosimeter can be flagged.

## AC19

The system records model/calibration versions.

## AC20

The system maintains an audit trail for important actions.

---

# 25. DEMO ACCEPTANCE CRITERIA

For the SIH demonstration, the system should visibly prove:

### A. Computer vision

The camera identifies the dosimeter and sensing area.

### B. Color science

The system displays or can inspect extracted color features.

### C. AI/ML

The system produces a dose estimate from a configured model/calibration dataset.

### D. Explainability

The system can show the processing chain:

```text
Image
→ ROI
→ Color Correction
→ CIELAB
→ ΔE
→ Model
→ Dose
```

### E. Digital record

The scan becomes a persistent exposure event.

### F. Offline capability

At least one scan should be demonstrably capable of being stored locally before synchronization.

### G. HSE integration

The scan appears on the dashboard.

---

# 26. IMPORTANT SCIENTIFIC DISCLAIMERS

The software must distinguish between:

### Experimentally validated data

Data generated through actual controlled H₂S exposure experiments.

### Proxy data

Data generated through chemical surrogates or laboratory proxies.

### Simulated data

Artificial data used only for software demonstration.

These must never be silently mixed.

Every dataset should have a provenance field:

```text
data_source:
  EXPERIMENTAL_H2S
  PROXY
  SIMULATED
```

---

# 27. CONFIGURATION OVER HARD-CODING

The application must be designed so that scientific parameters can change without rewriting the UI.

Configuration examples:

```text
chemistry
reference_patch_layout
dosimeter_dimensions
calibration_model
model_version
dose_range
confidence_threshold
image_quality_threshold
expiry_period
risk_thresholds
supported_device_profiles
```

The software should assume that these values will evolve during laboratory validation.

---

# 28. ARCHITECTURAL PRINCIPLE

Separate the following layers:

```text
UI
↓
Application Logic
↓
Domain Logic
↓
Computer Vision
↓
Color Science
↓
ML / Inference
↓
Persistence
↓
API / Synchronization
```

No layer should become responsible for everything.

In particular:

**UI code must not contain:**

* calibration mathematics
* image-processing algorithms
* ML inference logic
* database implementation
* authentication business rules

---

# 29. PROTOTYPE PRIORITY ORDER

Implementation priority:

## Phase 1 — Core Reader

```text
Camera
→ Dosimeter Detection
→ ROI
→ Image Quality
→ Reference Detection
→ Color Extraction
```

## Phase 2 — Exposure Intelligence

```text
CIELAB
→ ΔE
→ Calibration
→ Model
→ Dose
→ Confidence
```

## Phase 3 — Field Application

```text
Authentication
→ Worker
→ Shift
→ Scan
→ Result
→ Local Storage
```

## Phase 4 — Cloud

```text
API
→ Sync
→ Database
→ Dashboard
```

## Phase 5 — HSE Intelligence

```text
History
→ Analytics
→ Alerts
→ Reports
→ Audit
```

---

# 30. DEFINITION OF DONE

A feature is NOT considered complete merely because its UI exists.

A feature is complete only when:

1. UI exists.
2. Business logic exists.
3. Loading state exists.
4. Success state exists.
5. Error state exists.
6. Required data is persisted.
7. Required API integration exists where applicable.
8. Offline behavior exists where applicable.
9. The feature can be demonstrated.
10. The feature does not break previously completed functionality.

A button that visually exists but performs no meaningful action is NOT considered implemented.

---

# 31. FINAL PRODUCT DEFINITION

The prototype should ultimately demonstrate this complete proposition:

> A worker wears a passive, zero-power H₂S dosimeter. At the appropriate time, the worker uses a smartphone application to scan the dosimeter. The application validates the image, identifies the sensing region and reference patches, compensates for imaging conditions, converts the sensor color into quantitative colorimetric features, applies a calibrated exposure-estimation model, reports an estimated cumulative exposure with validity/confidence information, stores the result, and synchronizes it to an HSE dashboard for digital exposure history and analytics.

The central software value proposition is therefore:

**Passive physical sensing + smartphone computer vision + calibrated quantitative interpretation + digital exposure records.**

The software must optimize for:

**scientific defensibility > fake precision**

**functional workflow > decorative complexity**

**explainability > black-box AI**

**offline reliability > cloud dependency**

**validated data > invented numbers**

**maintainable architecture > rapid monolithic code**

---

# 32. SOURCE-OF-TRUTH RULE

This PRD defines the product requirements.

It must be read together with:

```text
02_VISUAL_DESIGN.md
03_TECHNICAL_ARCHITECTURE.md
04_PROTOTYPE_REQUIREMENTS.md
05_DATA_AND_ML_SPEC.md
06_USER_FLOWS.md
07_DEMO_SCRIPT.md
AGENT_RULES.md
```

If requirements conflict:

1. Scientific validity takes priority.
2. Explicit experimental evidence takes priority over assumptions.
3. Safety requirements take priority.
4. Product requirements take priority over aesthetic preferences.
5. Prototype requirements define what must work for the current demo.
6. Future-scope features must not destabilize the MVP.

Never invent scientific facts to resolve an ambiguity.

When an unresolved scientific parameter is required, make it configurable and clearly mark it as requiring experimental validation.

