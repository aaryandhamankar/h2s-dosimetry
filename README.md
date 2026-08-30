# MRPL Wearable Colorimetric H₂S Exposure-Dosimeter Platform

> **A serious industrial occupational safety instrument and companion telemetry system for personal hydrogen sulfide exposure monitoring.**
> Developed for **Mangalore Refinery and Petrochemicals Limited (MRPL)** / Ministry of Petroleum and Natural Gas.

---

## 1. Executive Summary

This repository contains the software companion platform for a **Zero-Power Wearable Colorimetric H₂S Gas Dosimeter Wristband**. 

The platform bridges physical chemical dosimetry and enterprise petrochemical safety management through:
1. **Optical Digitization & Computer Vision**: Standardized ROI extraction, Bradford D65 chromatic adaptation, and CIELAB color space transformation.
2. **Deterministic Calibrated Exposure Inference**: Physics-informed estimation of cumulative dose ($D = \int C(t) dt$) and shift-level Time-Weighted Average ($\text{TWA}_{\text{shift}}$).
3. **Multi-Stage Safety Gating**: Refusal to extrapolate outside validated domains or fabricate numbers from low-quality/invalid scans.
4. **HSE Supervisory Intelligence**: Real-time workforce registry, cumulative exposure telemetry, and severity-tiered alert triage.
5. **Interactive 3D CAD Model Simulation**: Real-time perspective simulation of the wearable wristband with Solid Shaded, Wireframe, and Exploded Assembly views, plus `.glb` model drag-and-drop support.
6. **4-Language Localization**: Full native support for English (`en`), Hindi (`hi`), Kannada (`kn`), and Gujarati (`gu`) with untranslated scientific terminology (`H₂S`, `ppm·h`, `CIELAB`, `ΔE*ab`, `ISO D65`, `TWA`, `PEL`, `STEL`, `Cu-PAN`, `Bi(III)`).
7. **Government & Industrial Accessibility**: WCAG 2.1 AA compliance, zoomable viewport (WCAG 1.4.4), high-contrast theme, font size scaling, dynamic `lang` attribute synchronization, and keyboard-navigable ARIA dialogs.
8. **Client-Side Security Hardening**: Comprehensive HTTP security response headers (`X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`).

---

## 2. System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                          FIELD WORKER PORTAL                            │
│                                                                         │
│  Worker Identification → 8h Shift Timer → Dosimeter Pairing             │
│  Camera Viewfinder → Real-Time Torch Controls → Image Capture           │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ↓
┌─────────────────────────────────────────────────────────────────────────┐
│               8-STAGE SCIENTIFIC VERIFICATION PIPELINE                  │
│                                                                         │
│  Stage 1: ImageQualityEngine    → Blur, brightness, glare & sharpness   │
│  Stage 2: DosimeterDetection    → Locates sensor & boundary geometry    │
│  Stage 3: ROIExtractionEngine   → Extracts 4-patch calibration grid     │
│  Stage 4: ColorAnalysisEngine   → Bradford chromatic adaptation         │
│  Stage 5: CalibrationEngine     → Normalization to ISO/CIE D65          │
│  Stage 6: FeatureExtraction     → CIELAB ΔE*ab colorimetric measurement │
│  Stage 7: InferenceEngine       → Calibrated chemical dose calculation  │
│  Stage 8: RiskClassification    → Safety gating & compliance cert.      │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                       HSE SUPERVISORY DASHBOARD                         │
│                                                                         │
│  Plant Registry · Shift Telemetry · Exposure Trends · Alert Triage      │
│  Metrology Inspector · CIELAB Diagnostics · Audit Traceability Log      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Key Capabilities & Features

### A. 3D CAD Simulation & Model Viewer (`/about`)
- Real-time 3D perspective Canvas engine with 360° orbit drag, scroll/pinch zoom, and camera reset.
- 3 CAD visualization modes: **Solid Shaded**, **CAD Wireframe**, and **Exploded Assembly**.
- Dynamic chemosensor reaction simulation in 3D: spot changes color in response to selected dose (Normal `3.2 ppm·h`, Elevated `12.4 ppm·h`, Critical `24.8 ppm·h`).
- Native `.glb` 3D model support with in-browser file picker and drag-and-drop loading for production CAD models.

### B. 4-Language Localization Engine
- Complete coverage across English (`en`), Hindi (`hi`), Kannada (`kn`), and Gujarati (`gu`).
- Preserves industrial acronyms and scientific terms for universal safety compliance.

### C. Live Shift Timer & Overtime Counter
- Persistent shift timer with automatic 8-hour progress bar and live countdown.
- Overtime indicator with pulse animation and `+hh:mm:ss` counter when shifts exceed 8 hours.
- Basic shift controls modal for rapid start, pause, resume, end, and start-time edits.

### D. Zero-Dependency Web Audio Sound Engine
- High-fidelity industrial audio synthesized via Web Audio API:
  - Mechanical camera shutter snap with mirror slap and curtain release.
  - Sequential pipeline step tick sounds (Steps 1–8).
  - Affirmative success chime for safe exposures.
  - Dual-tone pulse alarms for critical threshold exceedances.

### E. Metrological Rigor & Safety Invariants
- **Reference Illuminant**: CIE Standard Illuminant **D65**.
- **Chromatic Adaptation**: Bradford transformation matrix.
- **Color Difference Metric**: CIE76 Euclidean distance:
  $$\Delta E^*_{ab} = \sqrt{(\Delta L^*)^2 + (\Delta a^*)^2 + (\Delta b^*)^2}$$
- **Time-Weighted Average Calculation**:
  $$\text{TWA}_{\text{shift}} = \frac{\text{Estimated Dose}}{\Delta t_{\text{hours}}}$$
- **Safety Invariant**: Low-quality images and out-of-range readings trigger quality gate refusals (`INVALID_IMAGE` / `OUT_OF_RANGE`) rather than hazardous numerical extrapolations.

---

## 4. Key Routes

| Route | Role | Purpose |
|---|---|---|
| `/` | Public | Master landing portal with unified hero modules and national identity header |
| `/scan` | Field Worker | 8-stage optical scanner with live camera viewfinder, torch, and 6 demo scenarios |
| `/worker/result` | Field Worker | Calibrated exposure result, safety action guidance, and metrology drawer |
| `/worker/history` | Field Worker | Personal chronological scan history and profile editor |
| `/hse` | Safety Officer | Executive plant overview, risk breakdowns, active worker roster, and alerts |
| `/hse/workers` | Safety Officer | Workforce fleet surveillance and worker-specific exposure history |
| `/hse/exposure` | Safety Officer | Cumulative exposure trend charts with PEL/STEL regulatory lines |
| `/hse/alerts` | Safety Officer | Severity-tiered incident management and acknowledgment |
| `/hse/technical` | Metrologist / Auditor | Calibration curves, CIELAB metrics, algorithm provenance, and traceability |
| `/about` | Public / Engineer | 3D CAD simulation, wearable wristband specs, and lead-free sensor chemistry |

---

## 5. Technology Stack

- **Framework**: Next.js 16 (App Router, TypeScript, React 19)
- **Styling**: Tailwind CSS v4 with Indian national safety tokens & high-contrast themes
- **State Management**: Zustand with persistent client-side storage
- **Charts & Visualizations**: Recharts
- **Icons**: Lucide React
- **Audio**: Web Audio API (zero external audio file dependencies)
- **Testing**: `tsx` test runner with 18 automated scientific and colorimetric test suites

---

## 6. Deterministic Demo Scenarios

Press key **`D`** anywhere or click the floating **Demo** pill to trigger any scenario:

| Scenario | Input Characteristic | Estimated Dose | Risk Status | Validity |
|---|---|---|---|---|
| **NORMAL** | Unexposed baseline dosimeter | `3.2 ppm·h` | `NORMAL` | `VALID` |
| **ELEVATED** | Moderate CuS darkening | `12.4 ppm·h` | `ELEVATED` | `VALID` |
| **HIGH** | Significant chemical darkening | `18.6 ppm·h` | `HIGH` | `VALID` |
| **CRITICAL** | Severe exposure threshold | `24.8 ppm·h` | `CRITICAL` | `VALID` |
| **INVALID** | Excessive glare / blur | *Refused (`null`)* | `INVALID` | `INVALID_IMAGE` |
| **OUT OF RANGE** | Sensor signal beyond calibrated curve | *Refused (`null`)* | `OUT_OF_RANGE` | `OUT_OF_RANGE` |

---

## 7. Verification & Build Instructions

```bash
# 1. Run unit tests and scientific validation
npm run test

# 2. Run static linter
npm run lint

# 3. Compile optimized production build
npm run build

# 4. Start development server
npm run dev
```

---

## 8. Project Team

**MRPL Hackathon Innovation Team 2026**:
- **Aaryan Dhamankar** — Software, Digital Systems & Full-Stack Platform Lead
- **Arya Modh** — Chemistry, Sensor Research & Development Lead
- **Avani Abhyankar** — AI Model Development & Optical Inference Lead
- **Aarushi Jha** — Chemosensor Chemistry & Reagent Lead
- **Payas Pawar** — Market, Metrology & Standards Research Lead
- **Sudnya Irranna** — Hardware, CAD & Product Development Lead
