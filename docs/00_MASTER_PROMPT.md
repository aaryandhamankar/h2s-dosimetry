# ANTIGRAVITY — INITIAL BUILD EXECUTION COMMAND

You are now the **primary implementation agent** for this project.

The project is the:

**Passive Colorimetric H₂S Exposure-Dosimeter Wristband with Smartphone-Based Quantitative Reading and HSE Intelligence**

Your job is to take the complete project specification already present in this repository and turn it into a **working, polished, technically defensible software prototype**.

This is an implementation task, not a brainstorming task.

---

# 1. AVAILABLE PROJECT SPECIFICATION

The repository contains the following authoritative documents:

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

Treat these documents as the project's specification.

Read them completely before making architectural decisions.

Also inspect the existing repository for:

```text
source code
package.json
configuration
assets
sample images
sample data
existing components
existing routes
existing APIs
existing database/storage
environment variables
```

---

# 2. IMPORTANT — DO NOT START BY CODING BLINDLY

Your first action must be an **implementation audit**.

Determine:

1. What technology/framework is already being used?
2. What already exists?
3. What is reusable?
4. What is incomplete?
5. What is broken?
6. What P0 functionality is missing?
7. What dependencies are already installed?
8. What architecture is currently present?
9. What must be added?
10. What can be safely changed?

Do not unnecessarily rewrite functioning code.

---

# 3. CREATE AN IMPLEMENTATION PLAN

After reading the documentation and repository, create:

```text
IMPLEMENTATION_PLAN.md
```

The plan must contain:

### A. Current state

What already exists.

### B. Required state

What the specification requires.

### C. Gap analysis

```text
Existing
vs
Required
```

### D. Architecture

How the application will be structured.

### E. Data model

Core entities and relationships.

### F. Feature implementation order

Prioritized as:

```text
P0
P1
P2
P3
```

### G. Scientific processing architecture

Explain how:

```text
image
→
quality
→
ROI
→
color
→
calibration
→
inference
→
validation
→
risk
```

will be represented in code.

### H. Demo architecture

Explain how deterministic scenarios will work.

### I. Testing strategy

Explain how the core workflows will be verified.

---

# 4. DO NOT WAIT FOR APPROVAL

After creating the implementation plan, **continue directly into implementation**.

Do not stop and ask:

> "Would you like me to proceed?"

Proceed unless there is a genuine blocker that makes implementation impossible.

---

# 5. IMPLEMENTATION ORDER

Build in the following order.

## PHASE 1 — FOUNDATION

Implement:

```text
project structure
routing
design system
global styles
core types
domain models
application state
demo data
configuration
```

Ensure the application can run cleanly.

---

# 6. PHASE 2 — WORKER EXPERIENCE

Build the complete worker journey:

```text
Worker Dashboard
        ↓
Scan Dosimeter
        ↓
Image Capture / Sample Image
        ↓
Image Quality Validation
        ↓
Dosimeter Detection
        ↓
ROI
        ↓
Color Analysis
        ↓
Calibration
        ↓
Inference
        ↓
Validation
        ↓
Risk Classification
        ↓
Result
        ↓
Save Measurement
        ↓
History
```

This is the highest-priority workflow.

It must work end-to-end.

---

# 7. PHASE 3 — SCIENTIFIC PROCESSING LAYER

Create modular scientific services.

At minimum, use clear interfaces/abstractions for:

```text
ImageQualityEngine
DosimeterDetectionEngine
ROIExtractionEngine
ColorAnalysisEngine
CalibrationEngine
InferenceEngine
ValidationEngine
RiskClassificationEngine
```

Keep these OUT of the UI layer.

The UI should consume their outputs.

---

# 8. REAL VS PROTOTYPE SCIENCE

The project may not yet contain experimentally validated calibration data or a final ML model.

That is acceptable.

Do NOT fabricate scientific results.

Instead implement replaceable prototype engines where required:

```text
MockCalibrationEngine
MockInferenceEngine
```

or equivalent architecture.

The system must clearly distinguish:

```text
SIMULATED
EXPERIMENTAL
VALIDATED
```

data states.

Never present simulated output as experimentally validated output.

---

# 9. IMAGE SCANNING

The scanner must support:

### Input A

Live camera where technically feasible.

### Input B

Upload/select sample image.

### Input C

Deterministic demo scenarios.

All three should feed into the same processing pipeline.

Conceptually:

```text
Input
 ↓
Image
 ↓
Quality
 ↓
Detection
 ↓
ROI
 ↓
Color
 ↓
Calibration
 ↓
Inference
 ↓
Validation
 ↓
Risk
 ↓
Result
```

Do not create three disconnected implementations.

---

# 10. INVALID INPUT HANDLING

The application MUST support failure states.

Examples:

```text
blurred
too dark
too bright
glare
low resolution
dosimeter not detected
ROI failure
invalid color data
calibration unavailable
model unavailable
out-of-range input
```

Never convert an invalid scan into:

```text
SAFE
0 exposure
NORMAL
```

Instead clearly show:

```text
INVALID SCAN
```

or:

```text
OUT OF RANGE
```

as appropriate.

---

# 11. WORKER RESULT

The result screen must communicate three things immediately:

```text
1. What was measured?
2. What is the current status?
3. What should the worker do?
```

Do not overwhelm the worker with technical details.

Technical information belongs in Technical Mode.

---

# 12. PHASE 4 — HISTORY

Persist measurements through the application's chosen storage architecture.

The worker should be able to see:

```text
date
time
exposure
status
dosimeter
validity
source
```

Selecting a measurement should provide additional details where appropriate.

---

# 13. PHASE 5 — HSE DASHBOARD

Implement:

```text
HSE Dashboard
Worker Monitoring
Measurements
Alerts
Exposure Trends
Filters
Worker Detail
```

The dashboard should update from the same underlying measurement data generated by the worker scan workflow.

Do NOT create a separate fake dataset that is unrelated to scans.

---

# 14. PHASE 6 — ALERTS

Implement rule-based alert generation.

Conceptually:

```text
Measurement
+
Validity
+
Configured threshold
=
Risk
+
Potential Alert
```

Do not randomly generate alerts.

Invalid scans and exposure alerts are different concepts.

---

# 15. PHASE 7 — TECHNICAL MODE

Create a technical inspection experience.

Where data exists, show:

```text
Original Image
Processed Image
Sensor ROI
Reference ROI
Color Features
Calibration
Inference
Validation
Model
Processing Version
Provenance
```

The goal is to allow a technical evaluator to understand how the software converts:

```text
physical chemical response
→
digital measurement
```

---

# 16. PHASE 8 — DEMO SYSTEM

Implement deterministic demo scenarios:

```text
NORMAL
ELEVATED
HIGH
CRITICAL
INVALID
OUT_OF_RANGE
```

The scenarios must produce predictable results.

Do not rely on randomness.

Implement:

```text
Demo Mode
Scenario Selector
Reset Demo
```

The demo must be repeatable.

---

# 17. DEMO FALLBACK

The application should remain demonstrable even if:

```text
camera unavailable
internet unavailable
real model unavailable
physical sensor unavailable
backend unavailable
```

where appropriate.

Use:

```text
Live Input
→
Sample Image
→
Deterministic Simulation
```

as the fallback hierarchy.

Do not disguise fallback/simulation as real measurement.

---

# 18. DESIGN IMPLEMENTATION

Follow:

```text
02_VISUAL_DESIGN.md
```

closely.

The application should look like a serious industrial safety technology product.

Avoid:

```text
generic SaaS dashboard
excessive gradients
unnecessary glassmorphism
sci-fi gimmicks
AI-generated-looking visuals
visual clutter
```

Prioritize:

```text
clarity
hierarchy
trust
readability
professionalism
industrial credibility
```

---

# 19. RESPONSIVE DESIGN

Optimize the experience for:

### Worker

Mobile-first.

### HSE

Desktop/tablet-first.

The same underlying application/data architecture should support both.

---

# 20. COMPONENT ARCHITECTURE

Create reusable components for repeated patterns.

Examples:

```text
StatusBadge
RiskIndicator
ExposureCard
ScanFrame
ProcessingPipeline
MeasurementCard
AlertCard
ExposureChart
WorkerTable
FilterBar
ProvenancePanel
TechnicalPipeline
```

Do not duplicate equivalent UI logic.

---

# 21. DATA ARCHITECTURE

Create a coherent domain model around entities such as:

```text
User
Worker
Dosimeter
Scan
Image
Measurement
Calibration
Model
RiskConfiguration
Alert
Shift
ProcessingPipeline
```

Only implement entities that are actually required.

Avoid architecture for architecture's sake.

---

# 22. TRACEABILITY

A measurement should be traceable through:

```text
Measurement
 ↓
Scan
 ↓
Image
 ↓
Processing Version
 ↓
Calibration Version
 ↓
Model Version
```

Do not lose provenance.

Historical measurements must retain the versions that produced them.

---

# 23. CONFIGURATION

Do not hard-code scientific thresholds or calibration values inside random UI/business logic.

Use configuration.

Scientific values must come from:

```text
06_DATA_AND_ML_SPECIFICATION.md
```

or explicit project configuration.

If a value is unknown:

```text
do not invent it
```

---

# 24. TESTING

After each major phase, test the application.

At minimum verify:

```text
app loads
routing works
worker dashboard works
scan starts
sample image works
simulation works
processing stages work
result is generated
history updates
HSE dashboard updates
alerts work
technical mode works
invalid scan works
out-of-range works
demo reset works
```

Also check:

```text
console errors
broken imports
broken routes
missing assets
responsive layout
loading states
error states
empty states
```

---

# 25. DO NOT STOP AT A STATIC UI

A screen is NOT complete merely because it looks good.

For every important feature:

```text
UI
 ↓
state
 ↓
logic
 ↓
data
 ↓
result
```

must be connected.

Buttons must work.

Forms must work.

Navigation must work.

The scan pipeline must work.

The dashboard must reflect underlying data.

---

# 26. SCIENTIFIC HONESTY

Under NO circumstances fabricate:

```text
H₂S concentrations
accuracy
precision
LOD
LOQ
sensitivity
specificity
calibration coefficients
validated thresholds
model performance
experimental validation
regulatory compliance
```

If a prototype value is required purely for demonstration:

```text
label it as simulated/demo data
```

---

# 27. CODE QUALITY

Use:

```text
clear naming
modular architecture
typed interfaces
small reusable components
centralized configuration
clear error handling
minimal duplication
```

Avoid:

```text
giant components
giant files
magic numbers
hard-coded business logic
duplicated state
unnecessary dependencies
```

---

# 28. DO NOT OVERENGINEER

This is a hackathon prototype.

Do not spend the majority of development time building:

```text
microservices
enterprise IAM
complex DevOps
unnecessary infrastructure
advanced cloud architecture
```

unless explicitly required.

Prioritize a complete working experience.

---

# 29. DO NOT UNDERBUILD

At the same time, do not deliver:

```text
static dashboard
fake buttons
fake AI
fake analytics
isolated pages
```

The critical workflow must actually function.

---

# 30. VISUAL POLISH COMES AFTER FUNCTIONALITY

Follow this order:

```text
FUNCTION
 ↓
DATA
 ↓
INTEGRATION
 ↓
VALIDATION
 ↓
UX
 ↓
VISUAL POLISH
```

Do not spend hours polishing a screen whose underlying feature is broken.

---

# 31. AGENT AUTONOMY

Make reasonable implementation decisions yourself.

Do not repeatedly ask for permission for:

```text
component naming
folder naming
minor UI decisions
reasonable libraries
ordinary refactoring
implementation details
```

Refer to the project specifications first.

Only ask the user when:

```text
a genuine blocker exists
two documented requirements conflict
a destructive decision cannot safely be reversed
an external credential/service is absolutely required
```

---

# 32. AFTER EACH PHASE

Do NOT simply say:

> "Phase complete."

Instead verify it.

For each phase:

```text
IMPLEMENT
 ↓
RUN
 ↓
TEST
 ↓
FIX
 ↓
VERIFY
```

Only move forward once the phase is reasonably stable.

---

# 33. FINAL ACCEPTANCE TEST

At the end, execute the complete flow:

```text
Worker Login
 ↓
Worker Dashboard
 ↓
Scan Dosimeter
 ↓
Sample / Camera Input
 ↓
Image Quality
 ↓
Dosimeter Detection
 ↓
ROI
 ↓
Color Analysis
 ↓
Calibration
 ↓
Inference
 ↓
Validation
 ↓
Risk Classification
 ↓
Result
 ↓
Save
 ↓
History
 ↓
HSE Dashboard
 ↓
Alert
 ↓
Technical Inspection
```

Then test:

```text
NORMAL
ELEVATED
HIGH
CRITICAL
INVALID
OUT_OF_RANGE
```

---

# 34. FINAL DELIVERABLES

Before considering the project complete, ensure the repository contains:

```text
working application
IMPLEMENTATION_PLAN.md
README / setup instructions
demo instructions
sample/demo data
test coverage for critical flows
```

Update documentation if implementation decisions differ from the original plan.

---

# 35. FINAL STANDARD

Do not optimize for:

> "It looks like an app."

Optimize for:

> "This is a coherent, working prototype of the software layer of an industrial H₂S exposure-dosimetry system, with a scientifically honest architecture that can accept real experimental calibration and models later."

---

# START NOW

Your immediate sequence is:

```text
1. Read all specification files.
2. Inspect the repository.
3. Audit the current implementation.
4. Create IMPLEMENTATION_PLAN.md.
5. Begin P0 implementation immediately.
6. Run the application.
7. Test continuously.
8. Fix issues.
9. Continue through the phases.
10. Finish with the complete acceptance test.
```

**Do not stop after producing the plan. Start building.**
