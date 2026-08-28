# 07 — DEMO SCRIPT

# Passive Colorimetric H₂S Exposure-Dosimeter Platform

**Document:** `07_DEMO_SCRIPT.md`
**Purpose:** Define the complete demonstration flow for the software prototype, including the exact user journey, screens, interactions, simulated/real data behavior, evaluator-facing narrative, fallback paths, and demo acceptance criteria.

---

# 1. DEMO OBJECTIVE

The demonstration must prove that the software is not merely a dashboard or an AI mockup.

It must demonstrate the complete digital workflow:

```text
Worker receives dosimeter
        ↓
Worker wears dosimeter
        ↓
Exposure occurs
        ↓
Worker scans dosimeter
        ↓
App validates image
        ↓
App identifies sensor region
        ↓
App extracts color information
        ↓
Software converts color response
        ↓
Exposure is estimated
        ↓
Result is validated
        ↓
Risk level is determined
        ↓
Worker sees actionable result
        ↓
HSE/Admin sees aggregated exposure information
```

The demo should make this journey feel simple to the worker while showing technical depth underneath.

---

# 2. DEMO PRINCIPLE

The evaluator should understand three things within the first few minutes:

### 1. The physical dosimeter produces a measurable visual response.

### 2. The smartphone converts that response into quantitative information.

### 3. The software turns individual measurements into an operational safety system.

The product story is therefore:

> **Sense → Scan → Quantify → Understand → Act**

---

# 3. DEMO MODES

The prototype should support three modes.

```text
DEMO MODE
SIMULATION MODE
TECHNICAL MODE
```

---

# 4. DEMO MODE

Used during the main SIH presentation.

It should provide a controlled, polished experience.

The presenter should be able to select predefined scenarios such as:

```text
Normal Exposure
Elevated Exposure
High Exposure
Critical Exposure
Invalid Scan
```

This prevents the live demonstration from depending on unpredictable camera conditions.

---

# 5. SIMULATION MODE

Simulation mode demonstrates the full product workflow without requiring actual H₂S exposure.

It must be clearly labelled:

```text
SIMULATED DATA
```

The system must never imply that simulated values are real measurements.

---

# 6. TECHNICAL MODE

Technical mode exposes the underlying processing.

It may show:

```text
Original image
↓
Detected dosimeter
↓
Sensor ROI
↓
Reference ROI
↓
Color values
↓
Color difference
↓
Calibration
↓
Model inference
↓
Validity
↓
Final result
```

This mode is primarily for judges, technical reviewers, mentors, and R&D discussion.

---

# 7. PRIMARY DEMO PERSONA

Use a fictional worker for demonstration.

Example:

```text
Name: Rajesh Kumar
Employee ID: MRPL-1042
Role: Field Technician
Department: Operations
Shift: A
Location: Refinery Area
```

The exact fictional identity can be changed.

Do not use real employee information in the prototype.

---

# 8. DEMO START STATE

The application opens to:

```text
Worker Dashboard
```

Display:

```text
Good morning, Rajesh

Current shift
06:00 – 14:00

Dosimeter
Active

Status
Monitoring

Last scan
Not yet scanned
```

Primary CTA:

```text
SCAN DOSIMETER
```

Secondary:

```text
VIEW HISTORY
```

---

# 9. SCREEN 1 — WORKER DASHBOARD

### Purpose

Immediately communicate:

* who is logged in
* whether a dosimeter is active
* current shift
* latest exposure status
* ability to scan

### Required elements

```text
Worker identity
Active dosimeter
Current shift
Current exposure status
Last measurement
Scan button
History
```

---

# 10. SCREEN 2 — DOSIMETER SCAN

The worker taps:

```text
SCAN DOSIMETER
```

The application opens the camera/scanner interface.

The screen should provide concise guidance:

```text
Place the dosimeter inside the frame.

Keep the sensor flat.
Avoid glare.
Use sufficient lighting.
```

Display a framing guide matching the physical dosimeter geometry.

---

# 11. CAMERA UI

The scanner should contain:

```text
Camera preview

┌─────────────────────┐
│                     │
│   DOSIMETER FRAME   │
│                     │
└─────────────────────┘

Lighting indicator
Image quality indicator

[ CAPTURE ]
```

Avoid overwhelming the worker with technical information.

---

# 12. SCAN ASSISTANCE

The app should provide real-time or simulated guidance.

Examples:

```text
Move closer
```

```text
Too dark
```

```text
Reduce glare
```

```text
Dosimeter detected
```

```text
Ready to capture
```

---

# 13. CAPTURE

When the image is captured:

```text
Image captured
```

The application begins processing.

Show a short processing sequence rather than an unexplained spinner.

Example:

```text
Checking image...
Detecting dosimeter...
Reading sensor...
Calculating exposure...
```

---

# 14. PROCESSING SCREEN

The processing screen should visually communicate the pipeline.

Example:

```text
SCAN PROCESSING

✓ Image quality
✓ Dosimeter detected
✓ Sensor region identified
✓ Color response extracted
● Calculating exposure
○ Risk classification
```

This creates transparency without requiring the worker to understand the mathematics.

---

# 15. TECHNICAL PROCESSING VIEW

When Technical Mode is enabled, show:

```text
IMAGE
↓
ROI
↓
COLOR FEATURES
↓
CALIBRATION
↓
MODEL
↓
EXPOSURE
```

Each stage should be clickable or expandable.

---

# 16. IMAGE QUALITY RESULT

Example:

```text
IMAGE QUALITY

✓ Good lighting
✓ Low glare
✓ Adequate resolution
✓ Dosimeter detected

Image accepted
```

If invalid:

```text
Scan could not be read.

Reason:
Excessive glare

Please retake the image.
```

---

# 17. SENSOR ROI

Technical Mode should show an overlay around the sensor region.

Example:

```text
Original image

┌──────────────────────┐
│                      │
│     ┌──────────┐     │
│     │ SENSOR   │     │
│     │   ROI    │     │
│     └──────────┘     │
│                      │
└──────────────────────┘
```

The overlay should make it obvious that the software is reading a specific physical sensing region.

---

# 18. COLOR EXTRACTION

Technical Mode may display:

```text
Color Analysis

L*      61.4
a*       8.2
b*      21.7

ΔL*     -4.2
Δa*      3.1
Δb*      1.7
ΔE       5.6
```

The displayed values are illustrative unless backed by the actual validated pipeline.

---

# 19. CALIBRATION STEP

Display:

```text
CALIBRATION

Chemistry:
[Configured chemistry]

Calibration:
CAL-001

Version:
1.0

Status:
Validated / Simulated
```

If simulation is active:

```text
SIMULATION CALIBRATION
```

must be clearly visible.

---

# 20. EXPOSURE INFERENCE

Show:

```text
EXPOSURE ESTIMATION

Color response
      ↓
Calibration / Model
      ↓
Exposure estimate
```

Then display the result.

Example:

```text
Estimated Exposure

12.4
[configured unit]
```

Do not hard-code scientifically unverified units or thresholds.

---

# 21. RESULT SCREEN

The result screen should be the strongest visual moment in the demo.

Example:

```text
EXPOSURE RESULT

12.4
configured unit

STATUS
ELEVATED

Your exposure is above the
configured normal range.

Recommended action:
Follow site safety protocol.
```

---

# 22. RESULT COMMUNICATION

The worker should not need to understand:

* ΔE
* CIELAB
* XGBoost
* regression coefficients
* calibration equations

to understand the result.

The app translates the technical output into:

```text
What happened?
How serious is it?
What should I do?
```

---

# 23. RISK STATES

Demonstrate at least three scenarios.

### NORMAL

```text
Exposure within configured normal range.
```

### ELEVATED

```text
Exposure above configured normal range.
Review exposure conditions.
```

### HIGH / CRITICAL

```text
High exposure detected.

Follow site emergency/safety protocol immediately.
```

Exact thresholds must come from the approved scientific configuration.

The demo must never invent regulatory limits.

---

# 24. CRITICAL RESULT

The critical state should visually communicate urgency.

Example:

```text
⚠ CRITICAL EXPOSURE

Immediate attention required.

Follow site emergency protocol.
Notify responsible HSE personnel.
```

Do not provide fabricated medical or emergency instructions.

Use the site's actual approved safety protocol once available.

---

# 25. RESULT PROVENANCE

Technical Mode should allow the presenter to open:

```text
Measurement Details
```

and show:

```text
Scan ID
Dosimeter ID
Timestamp
Processing version
Calibration version
Model version
Data source
Validity
```

Example:

```text
SCAN-001

Source:
SIMULATED

Processing:
1.0.0

Calibration:
CAL-001 / 1.0

Model:
MODEL-001 / 1.0

Validity:
VALID
```

---

# 26. HISTORY

After the result is generated, return to:

```text
Worker Dashboard
```

The latest result should now appear.

Example:

```text
Latest exposure

12.4
ELEVATED

Today, 10:42 AM
```

Tap:

```text
VIEW HISTORY
```

---

# 27. HISTORY SCREEN

Display a timeline.

Example:

```text
TODAY

10:42 AM
12.4
ELEVATED

08:15 AM
3.2
NORMAL

YESTERDAY

13:04 PM
7.1
NORMAL
```

Use configurable units and simulated data where necessary.

---

# 28. HISTORY DETAIL

Selecting a measurement opens:

```text
Exposure Details
```

Display:

```text
Date
Time
Exposure
Status
Dosimeter
Scan quality
Source
```

Technical users can expand:

```text
Color features
Calibration
Model
Processing
```

---

# 29. EXPOSURE TREND

Provide a graph:

```text
Exposure over time
```

The graph should make patterns obvious.

Example:

```text
Exposure
  │
  │       ╭─╮
  │   ╭───╯ ╰──╮
  │───╯         ╰────
  └────────────────── Time
```

The graph must clearly distinguish:

```text
measurement
```

from:

```text
risk threshold
```

if thresholds are configured.

---

# 30. HSE DASHBOARD

The second major persona is:

```text
HSE / Safety Officer
```

The HSE dashboard should show aggregated operational information.

---

# 31. HSE DASHBOARD — TOP LEVEL

Display:

```text
Workers monitored
Active dosimeters
Scans today
Elevated readings
High/Critical readings
Invalid scans
```

Example:

```text
24
Workers monitored

24
Active dosimeters

86
Scans today

5
Elevated

1
Critical

3
Invalid
```

Values should be clearly labelled as simulated during the demo.

---

# 32. WORKER EXPOSURE TABLE

Display:

```text
Worker
Latest Exposure
Status
Last Scan
```

Example:

```text
Rajesh Kumar     12.4    Elevated    10:42
Amit Patil        3.2    Normal       9:58
Sanjay Rao       24.8    High        10:21
```

---

# 33. FILTERS

HSE dashboard should support:

```text
Date
Shift
Department
Status
Worker
Dosimeter
```

For the prototype, filters may operate on seeded demo data.

---

# 34. ALERTS

Display an alert panel.

Example:

```text
ALERTS

⚠ High exposure
Worker: Sanjay Rao
Time: 10:21
Status: HIGH

Review required
```

---

# 35. ALERT DETAIL

Clicking an alert should show:

```text
Alert Details

Worker
Dosimeter
Timestamp
Exposure result
Status
Measurement validity
Scan details
Recommended operational follow-up
```

Avoid pretending that the app itself replaces the site's HSE procedures.

---

# 36. WORKER DETAIL VIEW

HSE can select a worker.

Display:

```text
Worker Profile

Current status
Current dosimeter
Current shift

Exposure history

Trend

Alerts
```

---

# 37. WORKER EXPOSURE TREND

Show:

```text
Exposure over current shift
Exposure over previous shifts
Number of elevated readings
Number of invalid scans
```

Do not overclaim cumulative exposure if the physical dosimeter/software methodology does not actually support that interpretation.

---

# 38. FLEET/DOSIMETER VIEW

The HSE dashboard may also contain:

```text
Dosimeters
```

Display:

```text
Dosimeter ID
Assigned worker
Status
Last scan
Battery/status if applicable
Batch
```

Only show physical attributes actually supported by the prototype.

Do not fabricate sensor telemetry that the hardware does not provide.

---

# 39. DEMO SCENARIO 1 — NORMAL

Start with:

```text
Rajesh
Active shift
Active dosimeter
```

Scan a simulated normal dosimeter.

Pipeline:

```text
Capture
↓
Validation
↓
Color extraction
↓
Calibration
↓
Inference
↓
Normal
```

Result:

```text
NORMAL
```

Narrative:

> “The worker simply scans the passive dosimeter using the phone. The software validates the image, extracts the sensor response, converts that response through the configured calibration pipeline, and returns an interpretable result.”

---

# 40. DEMO SCENARIO 2 — ELEVATED

Perform another scan.

Result:

```text
ELEVATED
```

The worker sees:

```text
Exposure above configured normal range.
```

The HSE dashboard simultaneously updates.

Demonstrate:

```text
Worker result
       ↓
HSE alert
```

---

# 41. DEMO SCENARIO 3 — CRITICAL

Select:

```text
Critical Exposure
```

Result:

```text
CRITICAL
```

Show:

```text
Worker alert
+
HSE alert
+
History update
```

This demonstrates the system's operational value.

---

# 42. DEMO SCENARIO 4 — INVALID IMAGE

Select:

```text
Invalid Scan
```

Simulate:

```text
Excessive glare
```

The system should reject the measurement.

Display:

```text
SCAN INVALID

The sensor could not be reliably read.

Reason:
Excessive glare

Please retake the image.
```

This is an important demo moment.

It proves the system does not simply produce a number every time.

---

# 43. DEMO SCENARIO 5 — OUT OF RANGE

Select:

```text
Out of Range
```

The system should show:

```text
MEASUREMENT OUT OF VALIDATED RANGE

The current input falls outside the
validated operating range.

No quantitative exposure value reported.
```

This demonstrates scientific caution.

---

# 44. TECHNICAL DEEP-DIVE MOMENT

After showing the user-facing result, switch to:

```text
TECHNICAL VIEW
```

Explain:

```text
This isn't just image classification.

The software pipeline separates:

1. Image quality
2. Dosimeter localization
3. Sensor ROI
4. Color extraction
5. Calibration
6. Exposure inference
7. Validation
8. Risk classification
```

This should be one of the key evaluator moments.

---

# 45. AI/ML EXPLANATION

If an ML model is implemented:

Show:

```text
Model:
MODEL-001

Version:
1.0

Features:
[configured feature list]

Status:
Validated / Experimental
```

Do not say:

> “AI detects H₂S.”

Prefer:

> “The model interprets the calibrated colorimetric response to estimate exposure.”

This distinction matters technically.

---

# 46. IF FINAL ML MODEL IS NOT READY

Use:

```text
MockInferenceEngine
```

or:

```text
CalibrationCurveEngine
```

with:

```text
SIMULATED
```

clearly displayed.

Narrative:

> “The software architecture already supports the final inference engine. For this prototype demonstration, this stage is running on controlled simulated data until the experimentally validated calibration/model is integrated.”

This is honest and technically defensible.

---

# 47. OFFLINE DEMO

Demonstrate offline capability if implemented.

Turn off connectivity.

Scan:

```text
Offline
```

The application should show:

```text
OFFLINE MODE

Measurement saved locally.

Sync pending.
```

When connectivity returns:

```text
SYNC COMPLETE
```

---

# 48. OFFLINE DATA RULE

Offline operation must not create contradictory results.

Each scan should receive:

```text
local_scan_id
sync_status
created_at
```

When synchronized:

```text
SYNCED
```

---

# 49. FINAL DEMO — END-TO-END

The ideal final sequence:

```text
LOGIN
 ↓
WORKER DASHBOARD
 ↓
SCAN DOSIMETER
 ↓
IMAGE VALIDATION
 ↓
DOSIMETER DETECTION
 ↓
ROI
 ↓
COLOR ANALYSIS
 ↓
CALIBRATION
 ↓
EXPOSURE RESULT
 ↓
RISK STATUS
 ↓
HISTORY
 ↓
HSE DASHBOARD
 ↓
ALERT
 ↓
TECHNICAL TRACEABILITY
```

---

# 50. IDEAL 5-MINUTE DEMO

### 0:00–0:30 — Problem

Explain:

```text
Workers may carry passive dosimeters,
but converting a visual sensor response into
quantitative, actionable information can be difficult.
```

---

### 0:30–1:00 — Product

Show:

```text
Passive dosimeter
+
Smartphone
+
Software
```

Message:

> “We turn a passive colorimetric response into a traceable digital exposure measurement.”

---

### 1:00–2:00 — Worker Scan

Demonstrate:

```text
Dashboard
→ Scan
→ Capture
→ Processing
→ Result
```

---

### 2:00–2:45 — Technical Layer

Show:

```text
ROI
→ Color
→ Calibration
→ Model
→ Validation
```

---

### 2:45–3:45 — HSE Layer

Show:

```text
Dashboard
→ Workers
→ Exposure
→ Alerts
→ Trends
```

---

### 3:45–4:30 — Failure Handling

Demonstrate:

```text
Bad image
→ Rejected

Out-of-range
→ No unsafe extrapolation
```

---

### 4:30–5:00 — Closing

Return to the product overview.

Message:

> “The physical dosimeter provides the chemical sensing layer. The smartphone provides the measurement interface. Our software connects those two into a traceable exposure-monitoring workflow.”

---

# 51. 10-MINUTE TECHNICAL DEMO

For technical judges:

```text
1. Worker workflow
2. Image processing
3. ROI extraction
4. Color feature extraction
5. Calibration
6. Inference
7. Validation
8. Model versioning
9. Provenance
10. HSE dashboard
11. Offline synchronization
12. Invalid/out-of-range handling
```

---

# 52. DEMO TALKING POINTS

The presenter should emphasize:

### Passive

No continuous powered sensing is required at the dosimeter itself if the physical design supports that claim.

### Quantitative

The software is designed to translate colorimetric response into a quantitative estimate through calibration.

### Smartphone-based

The phone becomes the readout and computation interface.

### Traceable

Every result can be associated with its scan, processing version, calibration, and model.

### Scalable

Individual scans can become fleet-level HSE information.

### Replaceable scientific engine

The prototype does not lock the product into an unvalidated model.

---

# 53. THINGS NOT TO CLAIM

Never claim:

```text
100% accuracy
Real-time H₂S concentration
Medical-grade measurement
Regulatory compliance
Certified occupational exposure measurement
AI detects H₂S directly
```

unless these have actually been validated and approved.

---

# 54. SIMULATION DISCLOSURE

Every simulated screen should include a subtle but readable:

```text
SIMULATED DATA
```

Do not hide this in tiny text.

The purpose is to demonstrate software functionality without misrepresenting scientific validation.

---

# 55. DEMO DATA RESET

Provide:

```text
RESET DEMO
```

The presenter can return the entire application to a known initial state.

Reset should restore:

* worker state
* scan history
* alerts
* dashboard metrics
* simulated readings

---

# 56. SCENARIO SELECTOR

Provide a presenter-only control:

```text
Demo Scenario

○ Normal
○ Elevated
○ High
○ Critical
○ Invalid
○ Out of Range
```

This should be accessible without disrupting the normal worker workflow.

---

# 57. PRESENTER MODE

Optional hidden shortcut:

```text
Press D
```

or an equivalent protected gesture/button to open:

```text
DEMO CONTROL PANEL
```

The exact interaction is implementation-dependent.

---

# 58. DEMO CONTROL PANEL

Show:

```text
Current scenario
Current worker
Current dosimeter
Data source
Model version
Calibration version

[ NORMAL ]
[ ELEVATED ]
[ HIGH ]
[ CRITICAL ]
[ INVALID ]
[ OUT OF RANGE ]

[ RESET DEMO ]
```

---

# 59. LIVE CAMERA FALLBACK

If live camera scanning fails during presentation:

```text
Use sample image.
```

The presenter should be able to select:

```text
Sample Scan
```

and continue the exact same processing workflow.

The audience should not see the software collapse because of camera conditions.

---

# 60. SAMPLE IMAGE LIBRARY

Provide controlled images:

```text
sample_normal.jpg
sample_elevated.jpg
sample_high.jpg
sample_critical.jpg
sample_invalid.jpg
sample_out_of_range.jpg
```

These are demonstration assets.

Clearly mark simulated/controlled data where applicable.

---

# 61. DEMO FAILURE RECOVERY

The presenter should always have:

```text
Live Camera
      ↓
Sample Image
      ↓
Scenario Simulation
```

three fallback levels.

---

# 62. VISUAL PRIORITY

During the demo:

```text
Result
   >
Exposure status
   >
Action
   >
Technical details
```

Technical details should be available but should not overwhelm the primary worker experience.

---

# 63. DEMO ANIMATION

Use subtle transitions for:

```text
Scanning
Processing
Result generation
Alert generation
Dashboard updates
```

Avoid excessive animations.

The product should feel like safety software, not a gaming UI.

---

# 64. REAL-TIME DASHBOARD UPDATE

When a worker receives an elevated/critical result:

```text
Worker App
     ↓
New Result
     ↓
Backend
     ↓
HSE Dashboard
     ↓
Alert
```

The demo should visually show this connection.

If actual realtime infrastructure is unavailable, simulate the state transition deterministically.

---

# 65. DEMO DATA ARCHITECTURE

Seed the prototype with:

```text
10–30 fictional workers
10–30 dosimeters
Multiple shifts
Multiple scans
Multiple risk states
At least one invalid scan
At least one out-of-range scan
```

Enough data should exist to make the dashboard feel real.

---

# 66. DASHBOARD DATA

Seed:

```text
Normal readings
Elevated readings
High readings
Critical reading
Invalid scans
```

The values are fictional/simulated unless explicitly sourced from experimental data.

---

# 67. DEMO ACCEPTANCE CRITERIA

The demo is considered successful if:

```text
[ ] Worker can open dashboard
[ ] Active dosimeter is visible
[ ] Worker can initiate scan
[ ] Camera/scanner interface works
[ ] Sample-image fallback exists
[ ] Image quality state is shown
[ ] Dosimeter can be detected/simulated
[ ] Sensor ROI is shown
[ ] Color features can be displayed
[ ] Calibration stage is visible
[ ] Inference stage is visible
[ ] Result is generated
[ ] Result has validity state
[ ] Risk state is generated
[ ] Result is stored in history
[ ] HSE dashboard updates
[ ] Alerts can be demonstrated
[ ] Technical provenance can be inspected
[ ] Simulated data is clearly labelled
[ ] Invalid scans are rejected
[ ] Out-of-range inputs are handled
[ ] Demo can be reset
[ ] Demo does not depend entirely on live hardware
```

---

# 68. JUDGE QUESTIONS THE SOFTWARE SHOULD ANSWER

The demo should make it easy to answer:

### “What does the app actually do?”

```text
It reads the passive dosimeter's colorimetric response,
processes the image, extracts quantitative color features,
applies the configured calibration/inference model,
validates the result, and presents exposure information.
```

### “Where is the AI?”

```text
The AI/ML layer is the inference component that maps validated
colorimetric features to the exposure estimate, when an
experimentally validated model is available.
```

### “What happens if the image is bad?”

```text
The image is rejected or flagged rather than generating an
apparently precise measurement.
```

### “What happens outside the calibrated range?”

```text
The result is marked out-of-range and the system does not
silently extrapolate.
```

### “Can the model change later?”

```text
Yes. Calibration and inference models are versioned and
decoupled from the application UI.
```

### “Can this work without internet?”

```text
The application architecture supports offline capture and
later synchronization where implemented.
```

### “How do you know which model generated a result?”

```text
Each result stores the relevant model and calibration version.
```

---

# 69. FINAL DEMO STORY

The entire demonstration should communicate:

```text
A worker wears a passive dosimeter.

The worker does not need to understand the chemistry.

At the end of the monitoring period,
the worker scans the dosimeter.

The phone validates the image,
identifies the sensing region,
extracts the color response,
converts it using the approved calibration/inference pipeline,
checks whether the result is valid,
and communicates the exposure status.

The measurement is stored.

HSE personnel can see the result,
track trends,
identify elevated readings,
and investigate alerts.

Every scientific result remains traceable
to its underlying scan and model/calibration version.
```

---

# 70. CLOSING DEMO LINE

The strongest closing message is:

> **“We are not replacing the passive dosimeter. We are turning its visual chemical response into usable digital safety intelligence.”**

---

# 71. IMPLEMENTATION PRIORITY

### P0 — MUST WORK

```text
Worker dashboard
Scan workflow
Sample-image fallback
Image validation
ROI
Color feature pipeline abstraction
Inference abstraction
Result screen
History
Risk classification
HSE dashboard
Alerts
Simulation mode
Demo reset
```

### P1 — SHOULD WORK

```text
Technical mode
Provenance
Offline mode
Sync
Trend charts
Scenario selector
Model/calibration version display
```

### P2 — FUTURE

```text
Advanced ML monitoring
Feature drift
Automated model management
Advanced analytics
Fleet optimization
Long-term exposure analytics
```

---

# 72. FINAL RULE FOR THE CODING AGENT

The demo must never optimize for fake technical complexity.

Optimize for:

```text
BELIEVABILITY
+
CLARITY
+
TRACEABILITY
+
RELIABILITY
+
DEMONSTRABILITY
```

The evaluator should leave understanding exactly:

```text
PHYSICAL SENSOR
       ↓
SMARTPHONE
       ↓
IMAGE ANALYSIS
       ↓
COLOR RESPONSE
       ↓
CALIBRATION / ML
       ↓
VALIDATED EXPOSURE RESULT
       ↓
WORKER ACTION
       ↓
HSE INTELLIGENCE
```

That is the complete software story.
