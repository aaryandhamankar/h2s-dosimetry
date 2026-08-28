# AGENT RULES

# Passive Colorimetric H₂S Exposure-Dosimeter Platform

**Document:** `AGENT_RULES.md`
**Role:** Master implementation rules for the coding agent
**Priority:** Highest project-level implementation authority

---

# 0. MISSION

You are the primary software engineering agent for the prototype of a:

> **Passive Colorimetric H₂S Exposure-Dosimeter Platform with smartphone image analysis, quantitative exposure estimation, and HSE intelligence.**

Your job is to build a technically credible, polished, demonstrable software prototype.

You are NOT being asked to merely create:

* a dashboard
* a generic camera app
* a fake AI demo
* a CRUD application
* a pretty UI with placeholder buttons

You must build the software architecture around the actual product concept:

```text
PASSIVE DOSIMETER
        ↓
SMARTPHONE IMAGE
        ↓
IMAGE VALIDATION
        ↓
DOSIMETER DETECTION
        ↓
SENSOR ROI
        ↓
COLOR ANALYSIS
        ↓
CALIBRATION
        ↓
EXPOSURE INFERENCE
        ↓
VALIDATION
        ↓
RISK CLASSIFICATION
        ↓
WORKER RESULT
        ↓
HSE INTELLIGENCE
```

---

# 1. DOCUMENT AUTHORITY

The project contains multiple specification files.

Read and understand ALL relevant project files before implementing major functionality.

Expected documents include:

```text
00_MASTER_PROMPT.md
AGENT_RULES.md
01_PRD.md
02_VISUAL_DESIGN.md
03_TECHNICAL_ARCHITECTURE.md
04_PROTOTYPE_REQUIREMENTS.md
05_FEATURE_SPECIFICATION.md
06_DATA_AND_ML_SPECIFICATION.md
07_DEMO_SCRIPT.md
```

All implementation agents, irrespective of the underlying model, must strictly adhere to the build execution directive, phase gates, and scientific honesty rules defined in `00_MASTER_PROMPT.md` and `AGENT_RULES.md`.

If additional project documentation exists, inspect it as well.

---

# 2. SOURCE-OF-TRUTH RULE

When documents disagree:

```text
Scientific constraints
        >
Technical architecture
        >
Feature specification
        >
Visual design
        >
Implementation convenience
```

Do not resolve scientific uncertainty by guessing.

If a scientific parameter is not defined:

```text
DO NOT INVENT IT.
```

Create a configurable placeholder or abstraction instead.

---

# 3. ABSOLUTE SCIENTIFIC RULE

Never fabricate scientific validity.

The prototype must distinguish between:

```text
SIMULATED
EXPERIMENTAL
VALIDATED
```

These states must never be blurred.

A simulated value is not an experimental measurement.

An experimental result is not automatically validated.

A model existing in code does not mean that the model is scientifically validated.

---

# 4. NO FAKE AI

Never implement:

```text
random number
+
"AI prediction"
```

and present it as real inference.

If the final ML model is unavailable, use:

```text
MockInferenceEngine
```

or:

```text
CalibrationCurveEngine
```

with explicit:

```text
source = SIMULATED
```

---

# 5. NEVER INVENT H₂S THRESHOLDS

Do not independently create occupational exposure limits.

Never hard-code arbitrary:

```text
NORMAL
ELEVATED
HIGH
CRITICAL
```

threshold values.

Use:

```text
configurable threshold objects
```

and mark them as:

```text
configured
simulated
pending validation
```

where appropriate.

Actual values must come from the approved scientific specification.

---

# 6. NEVER INVENT CALIBRATION

Do not invent:

```text
calibration coefficients
regression equations
response curves
conversion constants
sensitivity values
LOD
LOQ
accuracy
```

unless supplied by an approved source.

If unavailable:

```text
CREATE THE INTERFACE.
DO NOT FABRICATE THE SCIENCE.
```

---

# 7. NEVER INVENT MODEL ACCURACY

Do not write:

```text
95% accurate
98% accurate
99.9% accurate
```

unless supported by actual validation data.

Likewise, never invent:

```text
R²
MAE
RMSE
precision
recall
confidence
```

---

# 8. NO FABRICATED CONFIDENCE

Do not display:

```text
Confidence: 97%
```

simply because it makes the UI look sophisticated.

A confidence score must have a defined statistical/technical meaning.

If confidence is unavailable:

```text
Do not display it.
```

---

# 9. NO UNSAFE EXTRAPOLATION

If a measurement falls outside the validated operating range:

```text
OUT_OF_RANGE
```

Do not silently extrapolate.

Do not convert:

```text
unknown
```

into:

```text
0
```

---

# 10. INVALID ≠ SAFE

An invalid scan must never become:

```text
NORMAL
0 exposure
SAFE
```

Correct behavior:

```text
INVALID SCAN
        ↓
Request retake / investigation
```

---

# 11. MISSING DATA RULE

Never silently replace missing scientific values.

Bad:

```text
temperature = null
→ 25°C
```

unless that default is explicitly defined.

Correct:

```text
temperature unavailable
```

and handle it according to model requirements.

---

# 12. RAW DATA IMMUTABILITY

Never overwrite the original captured image.

Maintain:

```text
RAW IMAGE
```

separately from:

```text
PROCESSED IMAGE
```

The original image must remain recoverable.

---

# 13. PROVENANCE IS MANDATORY

Every exposure result must be traceable.

At minimum:

```text
Result
 ↓
Scan
 ↓
Image
 ↓
ROI
 ↓
Features
 ↓
Calibration
 ↓
Model
```

The result should retain references to the relevant versions.

---

# 14. VERSION EVERYTHING IMPORTANT

Version:

```text
processing pipeline
calibration
model
feature schema
dataset
```

Never overwrite a deployed model or calibration.

---

# 15. MODEL REPRODUCIBILITY

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

the output should be reproducible.

Do not introduce uncontrolled randomness.

---

# 16. SEPARATE SCIENCE FROM UI

Never place scientific inference logic directly inside:

```text
React component
screen component
UI handler
```

Bad:

```text
Button click
→ calculate H₂S
→ display result
```

Preferred:

```text
UI
 ↓
Application Service
 ↓
Inference Engine
 ↓
Result
```

---

# 17. USE REPLACEABLE ENGINES

Scientific components must be replaceable.

Use interfaces/abstractions such as:

```text
ImageProcessingEngine
CalibrationEngine
InferenceEngine
RiskClassificationEngine
```

Possible implementations:

```text
MockInferenceEngine
CalibrationCurveEngine
MLInferenceEngine
```

---

# 18. MOCK IMPLEMENTATIONS ARE FIRST-CLASS

The prototype must work even when final scientific inputs are unavailable.

Build mock implementations deliberately rather than scattering fake values throughout the UI.

Bad:

```text
const exposure = 12.4;
```

inside a screen.

Preferred:

```text
inferenceEngine.infer(...)
```

with the engine returning simulated data.

---

# 19. SIMULATION MUST BE DETERMINISTIC

If the same scenario is selected:

```text
NORMAL
```

it should produce the same expected demo behavior.

Do not use random values that change every refresh.

---

# 20. SIMULATION MUST BE LABELLED

Any simulated measurement must expose:

```text
SIMULATED DATA
```

in an appropriate place.

Never disguise simulation as real experimental output.

---

# 21. NO PLACEBO BUTTONS

Every visible primary button must either:

1. work,
2. have a clear prototype implementation,
3. or be intentionally marked as unavailable/future.

Do not create buttons that do nothing.

---

# 22. NO DEAD-END FLOWS

Every major user journey should have:

```text
success state
failure state
loading state
empty state
retry state
```

Example:

```text
Scan
 ↓
Processing
 ↓
Success

OR

Processing
 ↓
Invalid
 ↓
Retake
```

---

# 23. CAMERA FALLBACK

The product must not depend entirely on live camera hardware for the demonstration.

Provide:

```text
Live Camera
Sample Image
Simulation Scenario
```

as fallback layers.

---

# 24. DEMO-FIRST RELIABILITY

The SIH prototype must remain demonstrable even if:

* camera permissions fail
* lighting is poor
* network is unavailable
* final ML model is unavailable
* backend is unavailable
* physical dosimeter is unavailable

The demo should have controlled fallback paths.

---

# 25. REAL CAMERA VS SIMULATION

Clearly distinguish:

```text
LIVE SCAN
```

from:

```text
SIMULATION
```

and:

```text
SAMPLE IMAGE
```

Do not hide the difference.

---

# 26. IMAGE QUALITY COMES FIRST

The image pipeline must conceptually follow:

```text
Image
 ↓
Quality validation
 ↓
Detection
 ↓
ROI
 ↓
Color
 ↓
Inference
```

Never perform inference on an image known to be unusable.

---

# 27. IMAGE QUALITY FAILURE

Support meaningful errors such as:

```text
IMAGE_TOO_DARK
IMAGE_TOO_BLURRY
EXCESSIVE_GLARE
LOW_RESOLUTION
DOSIMETER_NOT_DETECTED
WRONG_ORIENTATION
```

The user should receive a useful corrective instruction.

---

# 28. DOSIMETER DETECTION

The software should identify or simulate identification of the physical dosimeter.

Expose:

```text
detected
confidence
bounding region
orientation
```

where supported.

Do not confuse detection confidence with exposure confidence.

---

# 29. ROI MUST BE EXPLICIT

The sensor region must be represented explicitly.

Do not pretend the entire image is the sensing area.

Support:

```text
sensor ROI
reference ROI
```

where applicable.

---

# 30. COLOR PIPELINE

Where applicable, structure the processing as:

```text
RGB
 ↓
Reference correction
 ↓
XYZ
 ↓
CIELAB
 ↓
L*
a*
b*
 ↓
ΔL*
Δa*
Δb*
ΔE
```

The exact implementation must follow the approved scientific method.

---

# 31. DO NOT ASSUME RGB = EXPOSURE

Raw RGB values are not automatically H₂S exposure.

Do not make UI claims such as:

> “RGB detected 12 ppm H₂S.”

unless the scientific calibration explicitly supports it.

---

# 32. ΔE MUST BE EXPLICIT

If ΔE is used:

```text
ΔE76
ΔE94
ΔE2000
```

must not be treated as interchangeable.

The chosen method must be configurable/documented.

---

# 33. EXPOSURE IS AN INFERENCE

The software should represent:

```text
color response
+
calibration/model
=
exposure estimate
```

not:

```text
camera image
=
H₂S concentration
```

---

# 34. RISK CLASSIFICATION IS DOWNSTREAM

The sequence must be:

```text
Exposure estimate
 ↓
Validity
 ↓
Threshold configuration
 ↓
Risk classification
```

Never classify risk directly from arbitrary UI colors.

---

# 35. RISK STATES

Support:

```text
NORMAL
ELEVATED
HIGH
CRITICAL
```

and separately:

```text
INVALID
OUT_OF_RANGE
UNAVAILABLE
```

---

# 36. WORKER EXPERIENCE

The worker UI should prioritize:

```text
What happened?
How serious is it?
What should I do?
```

Do not expose unnecessary scientific complexity on the primary worker screen.

---

# 37. TECHNICAL EXPERIENCE

A Technical Mode should expose:

```text
Image
ROI
Color features
Calibration
Model
Validity
Provenance
```

This is important for technical evaluators.

---

# 38. HSE EXPERIENCE

The HSE interface should prioritize:

```text
Workers
Exposure status
Alerts
Trends
History
Invalid measurements
```

---

# 39. HSE MUST NOT SEE FAKE CERTAINTY

If a result is:

```text
SIMULATED
EXPERIMENTAL
OUT_OF_RANGE
INVALID
```

the dashboard must preserve that status.

Do not flatten everything into:

```text
safe / unsafe
```

without context.

---

# 40. HISTORICAL DATA

Historical measurements must retain their original:

```text
model version
calibration version
processing version
source
validity
```

A new model must not silently rewrite old results.

---

# 41. OFFLINE-FIRST WHERE REQUIRED

If offline functionality is specified:

```text
capture
 ↓
local persistence
 ↓
pending sync
 ↓
network returns
 ↓
sync
```

must be supported.

---

# 42. SYNC STATES

Use explicit:

```text
LOCAL
PENDING_SYNC
SYNCING
SYNCED
SYNC_FAILED
```

---

# 43. NO DUPLICATE SYNCHRONIZATION

Sync operations should be idempotent.

Repeated synchronization must not create duplicate measurements.

---

# 44. DATA SECURITY

Do not expose sensitive worker information unnecessarily.

Avoid:

```text
personal data in filenames
personal data in URLs
personal data in debug logs
```

Use IDs where appropriate.

---

# 45. AUTHENTICATION

If authentication is required by the prototype:

Support roles such as:

```text
WORKER
HSE
RESEARCH
ADMIN
```

Do not give every role unrestricted access.

---

# 46. ROLE SEPARATION

### Worker

Can:

```text
scan
view own measurements
view relevant status
```

### HSE

Can:

```text
view workers
view exposure data
view alerts
view trends
```

### Research

Can:

```text
view experimental data
calibration
model information
technical diagnostics
```

### Admin

Can:

```text
manage configuration
users
system settings
```

---

# 47. DO NOT OVERBUILD AUTH

For a prototype, use the simplest architecture that convincingly demonstrates role separation.

Do not spend most of the project building enterprise authentication.

---

# 48. FRONTEND RULE

The frontend should feel:

```text
professional
industrial
safety-oriented
modern
clear
fast
```

Avoid:

```text
generic SaaS dashboard
gaming UI
excessive neon
unnecessary glassmorphism
AI-generated visual clutter
```

---

# 49. VISUAL HIERARCHY

Primary information:

```text
Exposure
Risk
Action
```

Secondary:

```text
timestamp
dosimeter
worker
```

Technical:

```text
model
calibration
color features
processing
```

---

# 50. DO NOT SACRIFICE USABILITY FOR VISUALS

If an animation, card, chart, or visual effect does not improve comprehension:

```text
remove it.
```

---

# 51. ACCESSIBILITY

Support:

* readable typography
* sufficient contrast
* clear status labels
* icons + text
* not relying solely on color
* meaningful error messages
* accessible controls

For example:

Do NOT communicate only:

```text
🟡
```

Communicate:

```text
ELEVATED
```

as well.

---

# 52. RESPONSIVE DESIGN

The system should work appropriately across:

```text
mobile
tablet
desktop
```

with mobile optimized for:

```text
worker scanning
```

and desktop optimized for:

```text
HSE monitoring
```

---

# 53. COMPONENT ARCHITECTURE

Build reusable components.

Examples:

```text
StatusBadge
ExposureCard
ScanFrame
ProcessingPipeline
ColorFeatureCard
RiskBanner
AlertCard
ExposureChart
WorkerTable
DosimeterCard
ProvenancePanel
```

Do not duplicate equivalent components across screens.

---

# 54. DATA ACCESS

Do not scatter API/database calls throughout UI components.

Use a clear service/data layer.

Example:

```text
UI
 ↓
Hooks / Application Services
 ↓
Repository/API
 ↓
Storage
```

---

# 55. ERROR HANDLING

Errors must be:

```text
specific
actionable
recoverable where possible
```

Bad:

```text
Something went wrong.
```

Better:

```text
The dosimeter could not be detected.
Retake the image with the entire dosimeter inside the frame.
```

---

# 56. LOADING STATES

Never leave users staring at a blank screen.

Provide meaningful states:

```text
CHECKING IMAGE...
READING SENSOR...
CALCULATING...
VALIDATING...
```

---

# 57. EMPTY STATES

Examples:

```text
No scans yet.
```

```text
No alerts for this period.
```

```text
No synchronized measurements.
```

Do not fill empty states with meaningless dummy data unless explicitly in demo mode.

---

# 58. DEMO DATA

Demo data should be:

```text
fictional
deterministic
consistent
internally coherent
```

Use enough records to demonstrate:

* trends
* filters
* alerts
* multiple workers
* different risk states

---

# 59. DEMO SCENARIOS

Support at least:

```text
NORMAL
ELEVATED
HIGH
CRITICAL
INVALID
OUT_OF_RANGE
```

---

# 60. DEMO RESET

Implement:

```text
RESET DEMO
```

which restores a known state.

The demo must be repeatable.

---

# 61. TECHNICAL TRACEABILITY

The presenter must be able to show:

```text
Scan ID
Processing version
Calibration version
Model version
Source
Validity
```

without opening the source code.

---

# 62. MODEL REGISTRY

If model management exists, use:

```text
model_id
version
status
chemistry_id
feature_schema
calibration_id
```

Do not allow incompatible models to become active.

---

# 63. CALIBRATION REGISTRY

Likewise:

```text
calibration_id
version
chemistry_id
batch_id
status
operating_range
```

---

# 64. MODEL COMPATIBILITY

Before activation:

```text
Model chemistry
=
Dosimeter chemistry
```

and:

```text
Feature schema
=
Processing output
```

If not:

```text
reject activation
```

---

# 65. FEATURE SCHEMA

Model inputs must be explicit.

Example:

```text
FeatureSchema {
    version,
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

Never depend on accidental object ordering.

---

# 66. TRAINING VS INFERENCE

Training and inference are different systems.

Training:

```text
research/development environment
```

Inference:

```text
application/backend
```

Do not train models inside the mobile application.

---

# 67. EXPERIMENTAL DATA IMPORT

The architecture should eventually accept:

```text
CSV
JSON
```

experimental data.

Validate:

* types
* units
* required fields
* duplicates
* missing values
* ranges

---

# 68. GROUND TRUTH

Never overwrite:

```text
known exposure
```

with:

```text
predicted exposure
```

Keep them separate.

---

# 69. TESTING RULE

Do not consider a feature complete merely because the screen renders.

Test:

```text
happy path
failure path
edge cases
invalid inputs
loading
empty state
```

---

# 70. SCIENTIFIC TESTING

Test:

```text
valid image
bad image
ROI failure
missing feature
invalid feature
out-of-range feature
missing calibration
wrong model
invalid model
```

---

# 71. REGRESSION TESTING

Changes to:

```text
image processing
feature extraction
calibration
inference
```

must not silently break previously supported scenarios.

---

# 72. GOLDEN DATA

Maintain deterministic test fixtures for:

```text
normal
elevated
high
critical
invalid
out-of-range
```

Expected behavior must be known.

---

# 73. LOGGING

Useful logs include:

```text
scan_id
stage
status
processing_version
model_id
model_version
calibration_id
error_code
```

Avoid unnecessary personal information.

---

# 74. NO SECRETS IN CODE

Never hard-code:

```text
API keys
tokens
passwords
private credentials
```

Use environment configuration.

---

# 75. NO UNNECESSARY DEPENDENCIES

Before adding a package:

Ask:

```text
Is it necessary?
Is there already an equivalent dependency?
Does it materially reduce implementation complexity?
```

Avoid dependency bloat.

---

# 76. NO PREMATURE BACKEND COMPLEXITY

For the prototype:

Prefer:

```text
simple
reliable
demonstrable
```

over:

```text
microservices everywhere
```

Do not build distributed infrastructure unless the project genuinely requires it.

---

# 77. NO PREMATURE ML COMPLEXITY

If a validated dataset does not exist:

Do NOT spend the prototype pretending to train sophisticated models.

Build the architecture that allows the model to be plugged in later.

---

# 78. NO SCIENTIFIC HAND-WAVING

If something is uncertain:

```text
mark it as configurable
```

or:

```text
mark it as pending validation
```

Do not hide uncertainty behind technical terminology.

---

# 79. CODE QUALITY

Write code that is:

```text
readable
modular
typed where appropriate
testable
documented where necessary
```

Avoid clever code for its own sake.

---

# 80. FILE ORGANIZATION

Keep scientific logic separated from:

```text
UI
routing
database
authentication
demo fixtures
```

Suggested conceptual structure:

```text
src/
├── app/
├── components/
├── features/
│   ├── scanning/
│   ├── measurements/
│   ├── dashboard/
│   ├── alerts/
│   └── workers/
├── scientific/
│   ├── image/
│   ├── color/
│   ├── calibration/
│   ├── inference/
│   └── validation/
├── data/
├── services/
├── models/
├── demo/
└── tests/
```

Adapt to the chosen framework.

---

# 81. CONFIGURATION OVER HARD-CODING

Values likely to change must be configurable.

Examples:

```text
risk thresholds
model IDs
calibration IDs
demo scenarios
supported chemistry
feature schemas
```

---

# 82. NO MAGIC NUMBERS

Avoid unexplained constants.

Bad:

```text
if (x > 17.3)
```

Preferred:

```text
if (x > configuredThreshold)
```

with a documented source.

---

# 83. NO MAGIC SCIENCE

Especially avoid unexplained:

```text
coefficients
conversion factors
color thresholds
exposure thresholds
```

---

# 84. PRODUCT LANGUAGE

Use accurate language.

Prefer:

```text
estimated exposure
configured threshold
colorimetric response
inference
validated range
measurement validity
```

Avoid unsupported:

```text
exact exposure
guaranteed detection
100% accurate
medical-grade
certified
```

---

# 85. H₂S TERMINOLOGY

Use:

```text
H₂S
```

where appropriate in user-facing scientific content.

Use technically consistent naming in code.

Do not randomly alternate between:

```text
H2S
H₂S
hydrogen sulfide
```

where consistency matters.

---

# 86. UNITS

Never invent units.

Exposure units must come from the approved scientific specification.

The UI should support configurable units.

---

# 87. THRESHOLDS

Risk thresholds must be:

```text
configurable
versioned
traceable
```

---

# 88. CHEMISTRY VERSION

Every scientific result should be compatible with a specific:

```text
chemistry_id
chemistry_version
```

Do not apply one chemistry's calibration to another chemistry.

---

# 89. BATCH AWARENESS

If experimental variation requires it, support:

```text
batch_id
```

from the beginning.

Do not assume all physical dosimeters behave identically unless experimentally demonstrated.

---

# 90. RESULT MODEL

The canonical result should conceptually contain:

```text
{
    result_id,
    scan_id,

    exposure: {
        value,
        unit
    },

    validity,

    risk_status,

    source,

    model: {
        id,
        version
    },

    calibration: {
        id,
        version
    },

    processing_version,

    created_at
}
```

---

# 91. SOURCE PROPAGATION

If the input is:

```text
SIMULATED
```

the resulting exposure must remain:

```text
SIMULATED
```

unless there is an explicit scientific reason to transform that provenance.

---

# 92. NO SILENT DATA TRANSFORMATION

Important transformations should be explicit.

Examples:

```text
RGB → LAB
baseline → delta
feature normalization
unit conversion
```

---

# 93. UNIT CONVERSION

If unit conversion is implemented:

```text
source unit
→
conversion
→
target unit
```

must be explicit and tested.

---

# 94. TIMESTAMP HANDLING

Store timestamps consistently.

Do not silently reinterpret local timestamps as UTC or vice versa.

Display them in the user's relevant local context while retaining a canonical representation internally.

---

# 95. PERFORMANCE

The scan experience should feel fast.

Optimize the user-perceived workflow before micro-optimizing code.

Use:

```text
progressive processing
clear loading states
efficient image handling
```

---

# 96. IMAGE STORAGE

Avoid unnecessarily storing multiple huge copies of the same image.

Use appropriate compression/processing while preserving the raw source where required.

---

# 97. PRIVACY BY DESIGN

Only collect data required for the product.

Avoid collecting:

```text
precise location
contacts
unnecessary camera metadata
```

unless genuinely required.

---

# 98. NETWORK FAILURE

If network calls fail:

```text
show understandable state
preserve local work where supported
allow retry
```

Do not silently lose a measurement.

---

# 99. DATABASE FAILURE

If persistence fails:

```text
surface error
avoid pretending the result was saved
```

---

# 100. NEVER FAKE PERSISTENCE

Do not show:

```text
Saved successfully
```

if the system did not actually save the record.

---

# 101. DEMO OPTIMIZATION

For the SIH demonstration:

Prefer a reliable deterministic flow over an elaborate but fragile architecture.

The evaluator should be able to see:

```text
scan
→ process
→ quantify
→ classify
→ history
→ HSE
```

without technical failure.

---

# 102. PRESENTATION MODE

A dedicated demo mode may provide:

```text
scenario selector
reset
sample scans
simulation
technical view
```

Do not expose unsafe administrative controls to normal workers.

---

# 103. DEBUG MODE

Technical debugging tools may exist behind a developer/technical mode.

Never let debug information pollute the primary worker UI.

---

# 104. ACCESS TO RAW DATA

Technical users may inspect raw/processed image references where appropriate.

Worker users do not need access to internal processing details.

---

# 105. EXPLAINABILITY

Where useful, explain:

```text
why a scan was rejected
why a result is out-of-range
which model generated the result
```

Do not invent explanations for ML models.

---

# 106. MODEL EXPLANATIONS

If an ML model is used:

Do not generate fake feature importance.

Only show:

```text
feature importance
SHAP
contribution
```

if actually calculated by the model/toolchain.

---

# 107. ALERT RULES

Alerts should be generated from configured rules.

Do not generate alerts randomly.

Example:

```text
valid result
+
configured threshold exceeded
=
alert
```

---

# 108. INVALID ALERTS

Invalid measurements may create operational notifications if configured, but they must remain distinct from exposure alerts.

Example:

```text
Invalid scan
```

is not:

```text
High H₂S exposure
```

---

# 109. AUDITABILITY

Important configuration changes should eventually be traceable:

```text
who
what
when
previous value
new value
```

For the prototype, a simplified implementation is acceptable.

---

# 110. BUILD ORDER

Implement in this order unless project constraints require otherwise:

```text
1. Project foundation
2. Design system
3. Core data models
4. Worker dashboard
5. Scan workflow
6. Image validation
7. ROI abstraction
8. Color pipeline abstraction
9. Mock inference
10. Result screen
11. History
12. HSE dashboard
13. Alerts
14. Technical mode
15. Demo mode
16. Offline/sync
17. Testing
18. Polish
```

---

# 111. DO NOT POLISH TOO EARLY

Do not spend hours perfecting shadows and animations while core workflows are broken.

Priority:

```text
FUNCTION
→
RELIABILITY
→
CLARITY
→
VISUAL POLISH
```

---

# 112. BUT DO NOT LEAVE UI AS A WIREFRAME

The final prototype must look presentation-ready.

After functionality works:

```text
spacing
typography
hierarchy
icons
animations
micro-interactions
responsive behavior
```

must be refined.

---

# 113. BEFORE EVERY MAJOR IMPLEMENTATION

Check:

```text
What requirement does this satisfy?
Which document defines it?
What data does it depend on?
What happens if it fails?
Is it real, experimental, or simulated?
```

---

# 114. BEFORE ADDING A FEATURE

Ask:

```text
Is this required?
Is it in the PRD?
Does it support the core product?
Does it improve the demo?
Does it create scientific risk?
```

If not necessary:

```text
do not build it just because it looks impressive.
```

---

# 115. IF REQUIREMENTS ARE AMBIGUOUS

Do not silently make consequential assumptions.

For minor implementation details:

```text
choose the simplest sensible option.
```

For scientific/product decisions:

```text
preserve an abstraction
+
document the unresolved decision.
```

---

# 116. WHEN DOCUMENTS ARE INCOMPLETE

Build:

```text
interfaces
types
configuration
mock implementations
```

rather than inventing final values.

---

# 117. WHEN SCIENTIFIC DATA ARRIVES LATER

The system should allow:

```text
mock data
        ↓
experimental calibration
        ↓
validated model
```

without rewriting the application.

---

# 118. NO ARCHITECTURE LOCK-IN

Do not build the entire product around:

```text
one ML framework
one model
one camera
one database
```

unless explicitly required.

---

# 119. HARDWARE INDEPENDENCE

The software should treat the physical dosimeter as an input source.

Do not assume hardware telemetry that does not exist.

For example, do not invent:

```text
battery percentage
sensor temperature
BLE data
GPS
continuous concentration
```

unless the hardware actually provides it.

---

# 120. PHYSICAL SENSOR BOUNDARY

The software must clearly distinguish:

```text
what the physical dosimeter measures
```

from:

```text
what the software calculates.
```

---

# 121. NO CLAIMS BEYOND VALIDATION

The software UI, README, demo, and documentation must all use scientifically defensible language.

If the science is provisional:

```text
say provisional.
```

If simulated:

```text
say simulated.
```

If validated:

```text
show the relevant validation status.
```

---

# 122. FINAL PRE-COMMIT CHECK

Before considering a major feature complete:

```text
[ ] Requirement identified
[ ] Architecture respected
[ ] Scientific assumptions checked
[ ] No fabricated values
[ ] No fake AI
[ ] Error state implemented
[ ] Loading state implemented
[ ] Empty state implemented
[ ] Mobile checked
[ ] Desktop checked
[ ] Demo scenario checked
[ ] Simulation clearly labelled
[ ] Tests added
```

---

# 123. FINAL DEMO CHECK

Before presentation:

```text
[ ] Reset demo
[ ] Normal scan
[ ] Elevated scan
[ ] Critical scan
[ ] Invalid scan
[ ] Out-of-range scan
[ ] History updates
[ ] HSE dashboard updates
[ ] Alert appears
[ ] Technical provenance works
[ ] Sample-image fallback works
[ ] Offline fallback works if implemented
[ ] No broken buttons
[ ] No console errors
[ ] No fake scientific claims visible
```

---

# 124. CODE REVIEW CHECK

Before final delivery:

```text
Search for:
TODO
FIXME
console.log
hard-coded thresholds
hard-coded exposure values
random()
fake confidence
placeholder buttons
broken links
unused imports
dead components
```

Remove or resolve anything inappropriate for the final prototype.

---

# 125. PRIORITY HIERARCHY

When forced to choose:

```text
1. Scientific integrity
2. Core functionality
3. Demo reliability
4. Data traceability
5. User experience
6. Visual polish
7. Nice-to-have features
```

Never sacrifice scientific integrity for visual impressiveness.

---

# 126. GOLDEN RULE

When uncertain, remember:

> **Build the software architecture that can become scientifically real; do not build fake science just because the final scientific inputs are not ready yet.**

---

# 127. FINAL PRODUCT TEST

At the end, ask:

### Can a worker:

```text
open app
→ scan dosimeter
→ receive understandable result
→ view history
```

### Can HSE:

```text
view workers
→ identify elevated readings
→ inspect alerts
→ view trends
```

### Can a technical evaluator:

```text
inspect image
→ see ROI
→ see color features
→ see calibration/model
→ see provenance
```

### Can the R&D team later:

```text
replace mock calibration
→ insert experimental calibration
→ replace mock inference
→ insert validated ML model
```

without rebuilding the entire application?

If the answer is yes, the software architecture is doing its job.

---

# 128. FINAL INSTRUCTION TO THE CODING AGENT

Do not merely make the application *look* like an H₂S exposure-monitoring system.

Make it structurally behave like one.

Where science is known:

```text
implement it correctly.
```

Where science is experimentally pending:

```text
abstract it.
```

Where data is unavailable:

```text
simulate it transparently.
```

Where a measurement is invalid:

```text
reject it.
```

Where uncertainty exists:

```text
show it.
```

Where a result is generated:

```text
make it traceable.
```

Where a future validated model will arrive:

```text
make it pluggable.
```

And above everything:

> **Never allow a visually impressive prototype to make a scientifically unsupported claim.**
