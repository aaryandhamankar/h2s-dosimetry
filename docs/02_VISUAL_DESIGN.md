# Visual Design System

# Passive Colorimetric H₂S Exposure-Dosimeter Platform

**Document:** 02_VISUAL_DESIGN.md
**Product:** H₂S Exposure Dosimeter Companion Platform
**Design Objective:** Industrial safety + scientific credibility + modern field usability
**Primary Platforms:** Android mobile application + responsive HSE web dashboard

---

# 1. DESIGN NORTH STAR

The product should visually communicate:

> **"A serious industrial safety instrument, made simple through modern software."**

The interface must feel like a combination of:

* industrial safety technology
* scientific instrumentation
* professional field software
* modern enterprise analytics

It must NOT feel like:

* a generic AI startup
* a crypto dashboard
* a consumer fitness app
* a gaming interface
* a futuristic sci-fi interface
* a generic hospital/medical application
* an AI-generated template

The design should look as though it was deliberately designed by a senior product designer for an industrial technology company.

---

# 2. DESIGN PERSONALITY

Use these five characteristics as the visual filter for every design decision.

## 2.1 Precise

Information should be aligned, structured and measurable.

## 2.2 Calm

Safety software should not constantly scream at the user.

Use strong visual emphasis only when something genuinely requires attention.

## 2.3 Technical

Scientific information should feel credible without overwhelming ordinary workers.

## 2.4 Human

The worker should feel guided rather than interrogated by a machine.

## 2.5 Industrial

The product should feel suitable for:

* refinery environments
* chemical plants
* industrial maintenance
* HSE teams
* field operators

---

# 3. CORE VISUAL PRINCIPLE

The most important piece of information on any exposure-result screen is:

**What was the estimated exposure result?**

The visual hierarchy should therefore generally follow:

```text
PRIMARY RESULT
      ↓
VALIDITY / STATUS
      ↓
INTERPRETATION
      ↓
EXPOSURE DURATION
      ↓
TIMESTAMP / DOSIMETER
      ↓
TECHNICAL DETAILS
```

Do not make technical variables such as ΔE, a*, b* or model version visually compete with the primary result.

---

# 4. DESIGN SYSTEM RULE

The application must use a consistent design system.

Do not individually style every screen.

Create reusable components and tokens for:

* colors
* typography
* spacing
* radius
* shadows
* buttons
* cards
* badges
* inputs
* charts
* alerts
* tables
* navigation
* scanner elements

---

# 5. COLOR SYSTEM

The color palette should be restrained.

Use a neutral foundation with one controlled brand/accent color and semantic safety colors.

Do NOT create a rainbow UI.

---

## 5.1 Background Colors

Use:

* primary application background
* elevated surface
* secondary surface
* input surface
* disabled surface

The background should remain visually quiet.

---

# 5.2 Text Colors

Define:

```text
Primary text
Secondary text
Tertiary text
Disabled text
Inverse text
```

Primary text should have strong contrast.

Secondary text should support hierarchy rather than disappear.

---

# 5.3 Brand Accent

Use one primary accent color consistently for:

* primary CTA
* active navigation
* selected states
* links
* focus states
* important interactive controls

Do not use the brand accent everywhere.

---

# 5.4 Semantic Safety Colors

Create explicit semantic tokens:

```text
STATUS_NORMAL
STATUS_CAUTION
STATUS_HIGH
STATUS_CRITICAL
STATUS_INVALID
STATUS_OFFLINE
STATUS_SUCCESS
STATUS_INFO
```

Semantic colors must communicate meaning consistently throughout the application.

For example:

```text
NORMAL
→ safe/normal visual treatment

CAUTION
→ attention without alarm

HIGH
→ strong warning

CRITICAL
→ immediate attention

INVALID
→ data cannot be trusted

OFFLINE
→ connectivity state, NOT exposure risk
```

IMPORTANT:

Do not use red simply because a component looks visually stronger.

Red means something operationally significant.

---

# 6. TYPOGRAPHY

Use a clean modern sans-serif typeface.

Recommended hierarchy:

```text
Display
H1
H2
H3
Body Large
Body
Body Small
Caption
Numerical Data
Monospace/Data
```

---

## 6.1 Numerical Typography

Exposure values deserve special treatment.

Large numerical values should:

* use tabular/monospaced numerals where available
* have strong contrast
* be highly legible
* avoid unnecessary decimals
* clearly display units

Example hierarchy:

```text
4.23
ppm·h
Estimated cumulative dose
```

Do NOT display:

```text
Estimated cumulative exposure:
4.234728192 ppm·h
```

unless the additional precision is scientifically justified.

---

# 7. SPACING SYSTEM

Use a consistent spacing scale.

Recommended base unit:

**4 px**

Example:

```text
4
8
12
16
20
24
32
40
48
64
```

Most standard UI spacing should use multiples of the base unit.

Avoid random values such as:

```text
13px
17px
27px
31px
```

unless specifically necessary.

---

# 8. BORDER RADIUS

Use restrained corner rounding.

Recommended categories:

```text
Small
→ inputs, compact controls

Medium
→ cards, buttons

Large
→ major result containers / scanner frame

Full
→ pills / status indicators
```

Do not make every component extremely rounded.

Avoid the "everything is a pill" look.

---

# 9. SHADOWS

Use subtle elevation.

The application should not resemble a collection of floating cards.

Prefer:

* borders
* surface contrast
* restrained shadows

Use shadows mainly to communicate hierarchy or overlays.

---

# 10. ICONOGRAPHY

Use one consistent icon library/style.

Icons should be:

* simple
* geometric
* professional
* immediately understandable

Avoid:

* cartoon icons
* 3D icons
* excessive emoji
* decorative icons with no semantic purpose

---

# 11. GENERAL COMPONENT LANGUAGE

Components should generally use:

```text
Clear hierarchy
Strong alignment
Generous whitespace
Subtle borders
Minimal decoration
Consistent spacing
```

Avoid:

* excessive gradients
* glassmorphism
* neon glows
* floating blobs
* unnecessary illustrations
* decorative AI sparkles
* excessive animations

---

# 12. MOBILE APPLICATION

The mobile application is primarily a field tool.

The worker may be:

* outdoors
* wearing gloves
* standing
* in a hurry
* in a noisy environment
* under imperfect lighting

Therefore:

**speed + readability + clarity > visual complexity**

---

# 13. MOBILE NAVIGATION

Primary navigation should expose only the most important worker actions.

Recommended:

```text
Home
Scan
History
Profile
```

The Scan action should be visually prominent.

Do not create a complicated navigation tree for workers.

---

# 14. MOBILE — LOGIN SCREEN

Purpose:

Authenticate the user quickly.

Hierarchy:

```text
Brand
 ↓
Product name
 ↓
Login fields
 ↓
Primary login button
 ↓
Connection/session information
```

Do not overload login with marketing copy.

---

# 15. MOBILE — HOME SCREEN

The home screen should immediately answer:

> "What should I do now?"

Recommended hierarchy:

```text
Greeting
 ↓
Current shift
 ↓
Dosimeter status
 ↓
Primary Scan CTA
 ↓
Latest exposure result
 ↓
Recent history
```

Primary action:

**Scan Dosimeter**

should be visually dominant.

---

# 16. MOBILE — SHIFT CARD

Show:

```text
Current shift
Start time
Elapsed time
Dosimeter ID
Status
```

Example:

```text
CURRENT SHIFT

Shift A
07:42 AM
05h 18m elapsed

Dosimeter
H2S-00421

ACTIVE
```

Keep it compact.

---

# 17. MOBILE — SCANNER

This is the most important interaction in the mobile app.

The scanner should feel like an instrument, not a normal camera.

---

# 18. SCANNER VISUAL HIERARCHY

The camera screen should contain:

```text
Top:
Instruction

Center:
Dosimeter alignment frame

Around frame:
Detection / quality indicators

Bottom:
Capture / automatic capture state

Optional:
Flash / help
```

The dosimeter should visually "lock" into position when detected.

---

# 19. SCANNER ALIGNMENT FRAME

Use a strong but unobtrusive frame around the expected dosimeter geometry.

States:

```text
SEARCHING
DETECTED
ALIGNING
READY
CAPTURING
PROCESSING
ERROR
```

Visual state should change clearly.

---

# 20. SCANNER INSTRUCTION COPY

Do not use technical language.

Bad:

> "Homography confidence below threshold."

Good:

> "Hold the dosimeter flat."

Bad:

> "Reference patch detection failed."

Good:

> "Make sure all reference markers are visible."

Bad:

> "Illumination variance exceeds threshold."

Good:

> "Move to brighter, even lighting."

The technical error can exist in diagnostics, but the worker-facing message must remain human.

---

# 21. IMAGE QUALITY FEEDBACK

The scanner should provide live feedback where technically feasible.

Potential indicators:

```text
✓ Dosimeter detected
✓ Position good
⚠ Too much glare
⚠ Hold steady
✓ Lighting acceptable
```

Do not show ten simultaneous indicators.

Prioritize the single most important correction.

---

# 22. AUTOMATIC CAPTURE

When all required quality conditions are satisfied:

```text
READY
 ↓
Capture automatically
 ↓
Short confirmation animation
 ↓
Processing
```

Avoid forcing the worker to manually press capture if automatic capture is reliable.

A manual capture option may remain available as fallback.

---

# 23. PROCESSING SCREEN

The processing screen should visually communicate that the software is doing meaningful analysis.

Show a simple progress sequence:

```text
Reading dosimeter
      ↓
Validating image
      ↓
Correcting color
      ↓
Analyzing sensor response
      ↓
Estimating exposure
```

Avoid fake long-running animations.

The progress UI must correspond to real processing stages where possible.

---

# 24. RESULT SCREEN

This is the most important mobile screen.

Use:

```text
Status
 ↓
Large Result
 ↓
Unit
 ↓
Interpretation
 ↓
Exposure Duration
 ↓
Timestamp / Dosimeter
 ↓
Technical Details
```

Example conceptual layout:

```text
┌─────────────────────────────┐
│  ESTIMATED EXPOSURE         │
│                             │
│          4.23               │
│         ppm·h               │
│                             │
│       ● WITHIN RANGE        │
│                             │
│  Exposure duration           │
│  8h 12m                      │
│                             │
│  Dosimeter H2S-00421         │
│  28 Aug 2026 · 16:42         │
│                             │
│  View technical details  >   │
└─────────────────────────────┘
```

The actual numerical values shown in the prototype must come from the configured dataset/model.

---

# 25. RESULT STATUS

The status should never rely solely on color.

Use:

**color + icon + text**

For example:

```text
✓ NORMAL
⚠ CAUTION
! HIGH
!! CRITICAL
× INVALID
```

This improves accessibility and reduces ambiguity.

---

# 26. LOW-CONFIDENCE RESULT

Do not make low-confidence results visually resemble valid measurements.

Use a distinct state:

```text
RESULT REQUIRES REVIEW

The scan could not be quantified
with sufficient confidence.

Reason:
Image quality / model operating range / calibration issue

[Retake Scan]
[View Details]
```

Do not show an impressive-looking numerical value and then quietly put "low confidence" underneath it.

---

# 27. INVALID RESULT

For invalid scans:

```text
SCAN NOT VALID

We couldn't produce a trusted exposure estimate.

Reason:
Dosimeter expired

[Scan Another]
[View Dosimeter Details]
```

The design should communicate:

**No trusted measurement was produced.**

---

# 28. TECHNICAL DETAILS

Technical information should be hidden behind an expandable section or separate technical view.

Include:

```text
Image quality
ROI status
Reference detection
L*
a*
b*
ΔL*
Δa*
Δb*
ΔE
Calibration version
Model version
Processing version
Timestamp
```

The design should resemble scientific instrumentation data rather than a normal consumer analytics card.

---

# 29. EXPOSURE HISTORY

Worker history should use a clean timeline/list.

Each item:

```text
Date
Shift
Dose
TWA if available
Status
Dosimeter
```

Use trend visualization only where it provides actual insight.

---

# 30. MOBILE OFFLINE STATE

Offline status must be visible but not alarming.

Example:

```text
● Offline
Scans will be saved securely
and synchronized when connected.
```

Do NOT use:

```text
CRITICAL
OFFLINE
```

because connectivity state is not exposure risk.

---

# 31. SYNC STATUS

Each scan may show:

```text
Saved locally
Syncing
Synced
Sync failed
```

Use subtle indicators.

Example:

```text
✓ Synced
```

or:

```text
↻ Waiting for connection
```

---

# 32. MOBILE EMPTY STATES

Empty states should explain what to do next.

Bad:

> No data.

Good:

> No exposure scans yet. Complete your first dosimeter scan to start your history.

---

# 33. MOBILE ERROR STATES

Every error should provide:

1. What happened
2. Why it matters
3. What the user can do

Example:

```text
Dosimeter not detected

Make sure the full dosimeter is inside
the scanning frame.

[Try Again]
```

---

# 34. HSE WEB DASHBOARD

The dashboard serves a different user.

The HSE user wants:

**overview → identify problem → investigate → act**

The dashboard should therefore prioritize information density without becoming cluttered.

---

# 35. DASHBOARD LAYOUT

Recommended desktop structure:

```text
┌──────────────┬────────────────────────────────────────────┐
│              │                                            │
│ Navigation   │ Header                                     │
│              │                                            │
│ Overview     │ KPI / Summary                              │
│ Workers      │                                            │
│ Exposure     │ Charts                                     │
│ Alerts       │                                            │
│ Dosimeters   │ Tables                                     │
│ Reports      │                                            │
│ Calibration  │                                            │
│ Models       │                                            │
│ Settings     │                                            │
│              │                                            │
└──────────────┴────────────────────────────────────────────┘
```

---

# 36. DASHBOARD SIDEBAR

Recommended navigation:

```text
Overview
Workers
Exposure
Alerts
Dosimeters
Scans
Reports
Calibration
Models
Audit Log
Settings
```

Do not expose technical research controls to workers.

---

# 37. DASHBOARD HEADER

Include:

* current organization/site
* search
* notifications
* connection/backend status
* user menu

Avoid oversized dashboard headers.

---

# 38. DASHBOARD KPI CARDS

Use KPI cards sparingly.

Potential metrics:

```text
Workers monitored
Today's scans
Valid scans
Invalid scans
High-risk events
Pending sync
```

Do not display metrics that are not meaningful.

Do not create 15 KPI cards because there is empty space.

---

# 39. EXPOSURE OVERVIEW CHART

Primary chart:

**Exposure over time**

Possible dimensions:

* worker
* department
* date
* shift

Charts should prioritize readability.

Avoid unnecessary 3D charts.

Avoid decorative chart effects.

---

# 40. WORKER EXPOSURE TABLE

Suggested columns:

```text
Worker
Department
Latest Scan
Dose
TWA
Status
Confidence
Dosimeter
```

Use compact but readable rows.

Allow clicking into a worker.

---

# 41. WORKER DETAIL SCREEN

The worker detail page should show:

```text
Worker identity
 ↓
Current dosimeter
 ↓
Current/latest result
 ↓
Exposure trend
 ↓
Historical scans
 ↓
Alerts
 ↓
Technical scan details
```

---

# 42. EXPOSURE DETAIL

A single exposure event should provide:

```text
Result
Status
Confidence
Timestamp
Worker
Dosimeter
Shift
Exposure duration
Calibration
Model

Technical:
L*
a*
b*
ΔL*
Δa*
Δb*
ΔE

Image:
Original scan
ROI
Corrected image
```

This page should make the result auditable.

---

# 43. ALERTS SCREEN

Alerts should be sorted by:

1. severity
2. recency
3. unresolved status

Example structure:

```text
CRITICAL
Worker W-104
High estimated exposure
16:42

[Review]
```

Do not create alarm fatigue through excessive visual noise.

---

# 44. ALERT DETAIL

Display:

```text
Why was this triggered?
What measurement caused it?
When did it happen?
Who was affected?
What threshold/configuration was applied?
Has it been acknowledged?
```

Where possible, link the alert directly to the underlying scan.

---

# 45. DOSIMETER INVENTORY

Use a professional table.

Columns:

```text
Dosimeter ID
Batch
Chemistry
Worker
Status
Activation
Expiry
Last Scan
```

Status should be immediately understandable.

---

# 46. CALIBRATION UI

Calibration is an advanced/research feature.

It should look more like a scientific tool than a standard settings page.

Show:

```text
Calibration ID
Chemistry
Batch
Dataset size
Dose range
Environmental range
Model
Validation metrics
Status
Created
```

Potential status:

```text
Draft
Validating
Approved
Retired
```

---

# 47. MODEL REGISTRY UI

Model information:

```text
Model ID
Version
Algorithm
Chemistry
Training dataset
Validation dataset
Operating range
Metrics
Status
Created
```

Do not make model versioning visually decorative.

It is traceability information.

---

# 48. AUDIT LOG UI

Use a compact chronological table:

```text
Timestamp
User
Action
Entity
Entity ID
Details
```

Allow filtering by:

* user
* action
* date
* entity

---

# 49. DATA VISUALIZATION RULES

Charts must answer questions.

Before adding a chart ask:

> What decision does this chart help the HSE officer make?

If the answer is unclear, don't add the chart.

---

# 50. CHART TYPES

Prefer:

* line charts
* bar charts
* simple distributions
* timelines

Avoid:

* 3D charts
* gauges unless genuinely useful
* donut charts with too many categories
* decorative radial charts
* excessive gradients

---

# 51. EXPOSURE STATUS VISUAL LANGUAGE

Use a consistent system across:

* mobile
* dashboard
* reports
* notifications
* charts
* tables

For example:

```text
NORMAL
→ calm / neutral semantic treatment

CAUTION
→ attention

HIGH
→ warning

CRITICAL
→ strong warning

INVALID
→ measurement unavailable/untrusted
```

Do not allow each screen to invent its own interpretation.

---

# 52. CONFIDENCE VISUALIZATION

Confidence is different from exposure risk.

Do not use the same visual component for:

```text
Exposure risk
```

and:

```text
Prediction confidence
```

Example:

```text
Exposure:
HIGH

Confidence:
LOW
```

This combination must be visually possible.

---

# 53. IMAGE ANALYSIS VISUALIZATION

For technical users, visualize the processing chain.

Example:

```text
RAW IMAGE
     ↓
DOSIMETER ROI
     ↓
REFERENCE PATCHES
     ↓
CORRECTED IMAGE
     ↓
COLOR FEATURES
     ↓
MODEL
     ↓
RESULT
```

This is particularly important for demonstrating explainability during SIH.

---

# 54. ANIMATION PRINCIPLES

Animations should communicate:

* progress
* state change
* confirmation
* navigation

They should NOT exist merely because the UI library supports animation.

Use short transitions.

Avoid:

* bouncing cards
* spinning logos
* excessive parallax
* flashy transitions
* artificial "AI thinking" animations

---

# 55. SCANNER ANIMATION

The scanner may use subtle motion to indicate:

```text
Searching
Detecting
Ready
Capturing
Processing
```

The animation must never obstruct the dosimeter.

---

# 56. ACCESSIBILITY

The product must not rely on color alone.

Every semantic state should include:

* icon
* text
* appropriate contrast

Touch targets should be sufficiently large for field use.

Text must remain readable outdoors.

Do not use extremely thin fonts.

---

# 57. RESPONSIVE DESIGN

Dashboard must support:

```text
Desktop
Laptop
Tablet
```

Mobile app must support common Android phone aspect ratios.

Do not assume one fixed screen size.

---

# 58. DARK MODE

Dark mode may be supported.

If implemented:

* preserve semantic meaning
* preserve contrast
* do not simply invert colors
* maintain clear data visualization
* maintain scanner visibility

Do not make dark mode mandatory for the SIH MVP unless implementation time permits.

---

# 59. DESIGN TOKENS

Create a centralized token system.

Example conceptual structure:

```text
colors/
  background/
  surface/
  text/
  border/
  brand/
  status/

spacing/
  xs
  sm
  md
  lg
  xl

radius/
  sm
  md
  lg
  pill

typography/
  display
  heading
  body
  caption
  numeric

shadow/
  sm
  md
```

All components should consume tokens.

---

# 60. COMPONENT LIBRARY

Create reusable components for:

```text
Button
IconButton
Input
Select
Card
StatusBadge
AlertBanner
MetricCard
ExposureResult
ExposureChart
DataTable
WorkerCard
DosimeterCard
ScanProgress
ScannerFrame
QualityIndicator
ConfidenceIndicator
EmptyState
ErrorState
LoadingState
Modal
Drawer
Toast
Timeline
FilterBar
```

---

# 61. DESIGN STATES

Every interactive component should consider:

```text
Default
Hover
Pressed
Focused
Disabled
Loading
Error
Success
Selected
```

Mobile components should additionally consider:

```text
Touch
Long press where relevant
Offline
```

---

# 62. NO PLACEHOLDER VISUALS

Do not use:

* random stock imagery
* AI-generated industrial workers
* generic refinery hero images
* fake laboratory photography
* decorative 3D sensors

unless explicitly requested.

The product itself is the hero.

---

# 63. NO GENERIC AI DASHBOARD AESTHETIC

Strictly avoid the common AI-generated SaaS visual pattern:

```text
Huge gradient heading
+
purple/blue glow
+
glass cards
+
floating blobs
+
AI sparkle icon
+
rounded everything
```

This product is an industrial safety instrument.

It must look credible enough that an HSE professional would not dismiss it as a student AI demo.

---

# 64. MICROCOPY PRINCIPLES

Worker-facing language:

* short
* direct
* calm
* actionable

HSE-facing language:

* precise
* analytical
* traceable

Research/admin language:

* technical
* explicit
* versioned

Do not use marketing language inside operational screens.

---

# 65. COPY EXAMPLES

Worker:

> "Hold the dosimeter inside the frame."

HSE:

> "12 valid exposure scans recorded today."

Technical:

> "Calibration model v0.4.2 applied."

Invalid:

> "Exposure could not be quantified from this scan."

Offline:

> "Saved locally. Will sync when connected."

---

# 66. RESULT PRECISION

Do not visually imply false scientific precision.

If the validated system supports:

```text
4.2 ppm·h
```

do not show:

```text
4.237918 ppm·h
```

unless the underlying validation justifies it.

The UI must respect the precision of the scientific model.

---

# 67. SIMULATION MODE VISUAL TREATMENT

When using simulated data, display a persistent but unobtrusive indicator:

**SIMULATION MODE**

This must be visible enough that a reviewer cannot mistake simulated data for experimental results.

Possible placement:

* top navigation
* environment badge
* result metadata

Never hide simulation status inside a settings page.

---

# 68. RESEARCH / DEMO MODE

The prototype may include a technical/demo mode that exposes:

```text
Raw image
ROI
Corrected image
Reference patches
CIELAB
ΔE
Model inputs
Prediction
Confidence
Model version
Calibration version
```

This mode is for:

* developers
* researchers
* HSE reviewers
* SIH judges

It should not clutter the normal worker workflow.

---

# 69. VISUAL PRIORITY RULE

When deciding what deserves screen space, use:

```text
Safety-critical information
>
Primary task
>
Primary result
>
Action
>
Context
>
Technical details
>
Decorative elements
```

Decorative elements are always lowest priority.

---

# 70. FINAL DESIGN TEST

Before accepting any screen, ask:

### Question 1

Can a worker understand what to do within 3 seconds?

### Question 2

Can the primary exposure result be understood immediately?

### Question 3

Can an HSE officer identify an abnormal exposure quickly?

### Question 4

Can a technical reviewer understand how the result was produced?

### Question 5

Does the interface look credible in an industrial environment?

### Question 6

Does it still work visually when data is:

* missing
* invalid
* offline
* low-confidence
* loading
* errored?

### Question 7

Does the screen look deliberately designed rather than AI-generated?

If any answer is "no", redesign before implementation.

---

# 71. DESIGN SOURCE OF TRUTH

This document defines the visual design system.

The implementation must not independently invent:

* new colors
* new typography
* new component styles
* new navigation patterns
* new semantic meanings
* decorative visual systems

without a clear product reason.

The visual goal is:

**Industrial credibility + scientific precision + field simplicity + modern software quality.**
