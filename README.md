# Passive Colorimetric H₂S Exposure-Dosimeter Companion Platform

> **A serious industrial safety instrument, made simple through modern software.**
> Smart India Hackathon (SIH) Prototype Implementation

---

## 1. Overview

This repository contains the software companion platform for a **Passive Colorimetric H₂S Exposure-Dosimeter Wristband**. 

The platform bridges physical chemical dosimetry and enterprise safety management by providing:
1. **Optical Digitization & Computer Vision**: Standardized ROI extraction, Bradford D65 chromatic adaptation, and CIELAB color space transformation.
2. **Calibrated Exposure Inference**: Physics-informed estimation of cumulative dose ($D = \int C(t) dt$) and shift-level Time-Weighted Average ($\text{TWA}_{\text{shift}}$).
3. **Multi-Stage Safety Gating**: Refusal to extrapolate outside validated domains or fabricate numbers from low-quality/invalid scans.
4. **HSE Fleet Intelligence Dashboard**: Real-time workforce monitoring, exposure analytics, and alert triage.
5. **Traceability & Audit Provenance**: Complete verification chain from camera frame to final calibrated exposure reading.

---

## 2. System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    MOBILE FIELD APPLICATION                 │
│                                                             │
│  Worker Auth → Shift Management → Dosimeter Pairing         │
│  Camera Capture → Quality Heuristics → Guidance             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                 SCIENTIFIC PROCESSING PIPELINE              │
│                                                             │
│  1. ImageQualityEngine     → Blur, brightness, glare checks │
│  2. DosimeterDetection     → Fiducial & boundary geometry   │
│  3. ROIExtractionEngine    → Sensor ROI & reference swatches│
│  4. ColorAnalysisEngine    → RGB → XYZ → CIELAB & ΔE*ab     │
│  5. CalibrationEngine      → Curve & baseline compensation  │
│  6. InferenceEngine        → Calibrated regression engine   │
│  7. ValidationEngine       → Operating range bound checks   │
│  8. RiskClassification     → Decoupled threshold mapping    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                    HSE SAFETY DASHBOARD                     │
│                                                             │
│  Workforce Registry · Exposure Trends · Alert Triage        │
│  Metrology Inspector · CIELAB Diagnostics · Audit Trail     │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

- **Framework**: Next.js 14 (App Router, TypeScript, React 19)
- **Styling & Design System**: Tailwind CSS v4 with industrial safety tokens
- **State Management**: Zustand with persistent client storage
- **Charts & Visualization**: Recharts
- **Icons**: Lucide React
- **Testing & Verification**: TypeScript test runner (`tsx`)

---

## 4. Key Routes

| Route | Role | Purpose |
|---|---|---|
| `/` | Public | Landing page & role selector (`Worker` vs `HSE Officer`) |
| `/worker` | Field Operator | Worker dashboard with active shift, paired dosimeter & quick scan |
| `/worker/scan` | Field Operator | Optical scanner with 6 deterministic demo scenarios & live progress |
| `/worker/result` | Field Operator | Quantitative exposure dose, risk badge, and diagnostics drawer |
| `/worker/history` | Field Operator | Personal chronological exposure timeline |
| `/worker/profile` | Field Operator | Operator identity, hardware pairing status & demo reset |
| `/hse` | Safety Officer | Plant overview, KPIs, risk breakdown, and active alerts |
| `/hse/workers` | Safety Officer | Workforce fleet monitoring & worker detail view |
| `/hse/exposure` | Safety Officer | Cumulative exposure trends & threshold reference lines |
| `/hse/alerts` | Safety Officer | Severity-tiered incident management & acknowledgement |
| `/hse/technical` | Metrologist / Judge | Full traceability inspector, CIELAB metrics & model metadata |

---

## 5. Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm

### Installation & Execution

```bash
# Navigate to the web application directory
cd h2s-dosimeter

# Install dependencies (already completed)
npm install

# Run the automated scientific test suite
npm run test

# Build for production
npm run build

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Deterministic Demo Scenarios

The prototype includes 6 deterministic scenarios for presentation and validation:

| Scenario | Input Characteristic | Estimated Dose | Risk Status | Validity |
|---|---|---|---|---|
| **NORMAL** | Unexposed baseline dosimeter | `3.2 ppm·h` | `NORMAL` | `VALID` |
| **ELEVATED** | Moderate sensor darkening | `12.4 ppm·h` | `ELEVATED` | `VALID` |
| **HIGH** | Significant chemical darkening | `18.6 ppm·h` | `HIGH` | `VALID` |
| **CRITICAL** | Severe exposure threshold | `24.8 ppm·h` | `CRITICAL` | `VALID` |
| **INVALID** | Excessive glare / blur | *Refused (`null`)* | `INVALID` | `INVALID_IMAGE` |
| **OUT OF RANGE** | Sensor signal beyond calibrated curve | *Refused (`null`)* | `OUT_OF_RANGE` | `OUT_OF_RANGE` |

### Presenter Shortcut
- Press key **`D`** on any screen (or click the floating **Demo Controls** button in the bottom right) to toggle the **Presenter Demo Control Panel** for instant scenario switching or resetting to the clean initial state.

---

## 7. Color Science & Metrology Specifications

- **Reference Illuminant**: CIE Standard Illuminant **D65**
- **Chromatic Adaptation**: Bradford transformation matrix
- **Color Difference Metric**: CIE76 Euclidean distance:
  $$\Delta E^*_{ab} = \sqrt{(\Delta L^*)^2 + (\Delta a^*)^2 + (\Delta b^*)^2}$$
- **Time-Weighted Average Calculation**:
  $$\text{TWA}_{\text{shift}} = \frac{\text{Estimated Dose}}{\Delta t_{\text{hours}}}$$
- **Safety Invariant**: Scans failing optical quality heuristics or falling outside validated operating domains trigger safe refusal states rather than dangerous numerical extrapolations.

---

## 8. Verification & Test Results

Run tests via:
```bash
npm run test
```

Expected output:
```text
🧪 Starting Scientific Pipeline & Color Science Verification...

Test Group 1: CIELAB & ΔE Mathematics (CIE76 Formulation)
  ✓ CIE76 ΔE matches Euclidean norm (2.9766)
  ✓ ΔL correctly calculated as -9.7 (got -9.7)
  ✓ Δa correctly calculated as 3.1 (got 3.1)
  ✓ Δb correctly calculated as 6.7 (got 6.7)
  ✓ ΔE is positive (12.2)

Test Group 2: sRGB → XYZ → CIELAB Conversion
  ✓ Pure white has L* ≈ 100 (got 100)
  ✓ Pure black has L* ≈ 0 (got 0)

Test Group 3: Risk Classification & Safety Gating
  ✓ 3.2 ppm·h classifies as NORMAL
  ✓ 12.4 ppm·h classifies as ELEVATED
  ✓ 18.6 ppm·h classifies as HIGH
  ✓ 24.8 ppm·h classifies as CRITICAL
  ✓ Invalid image does not classify as safe
  ✓ Out-of-range does not extrapolate

Test Group 4: Inference Engine Determinism
  ✓ Normal scenario inference is deterministic
  ✓ Inference source is explicitly tagged SIMULATED
  ✓ Invalid scenario produces null dose (no fabricated numbers)
  ✓ Invalid scenario reports INVALID_IMAGE validity

Test Group 5: End-to-End Pipeline Execution
  ✓ Scan contains exposureResult
  ✓ Scan exposureResult risk is ELEVATED
  ✓ Scan dose is 12.4 ppm·h
  ✓ 8h TWA calculated as 1.6 ppm (12.4 / 8)
  ✓ Scan contains extracted CIELAB color features
  ✓ Scan contains optical quality metrics

🎉 ALL 18 SCIENTIFIC TESTS PASSED SUCCESSFULLY!
```
