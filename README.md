# H2S Dosimeter — Continuous Personal Hydrogen Sulfide Gas Dosimetry

> **An industrial-grade occupational health & safety companion system for personal hydrogen sulfide ($H_2S$) exposure monitoring and refinery surveillance.**
> Developed for **Mangalore Refinery and Petrochemicals Limited (MRPL)** / Ministry of Petroleum and Natural Gas.

---

## 1. Executive Summary

**H2S Dosimeter** is the software companion platform for a **Zero-Power Wearable Colorimetric $H_2S$ Gas Dosimeter Wristband**. 

The platform bridges physical chemical dosimetry and enterprise petrochemical safety management through:
1. **Optical Digitization & Computer Vision**: Standardized ROI extraction, Bradford D65 chromatic adaptation, and CIELAB color space transformation.
2. **Deterministic Calibrated Exposure Inference**: Physics-informed estimation of cumulative dose ($D = \int C(t) dt$) and shift-level Time-Weighted Average ($\text{TWA}_{\text{shift}}$).
3. **Multi-Stage Safety Gating & Image Validation**: Refusal to extrapolate outside validated domains, specular glare detection, and Tesseract.js OCR code extraction.
4. **Canonical Scan Record Pipeline**: Unifies Scanning, Personal History, and the HSE Supervisory Dashboard into a single persistent data store with live real-time synchronization.
5. **Continuous Two-Shift 24-Hour Schedule**: Automatic real-time shift detection (Shift A: `06:00 – 14:00`, Shift B: `14:00 – 06:00`) with robust mathematical midnight crossover handling (`00:00 – 05:59`).
6. **Industrial Operational Shift Strip**: Low-profile status ribbon displaying active shift window, operational mode, and live countdown with click-to-edit schedule capabilities.
7. **Mobile-First Exposure Result Interface**: High-clarity safety status ("Am I safe?", "What is my dose?", "What should I do now?"), color-coded risk alerts, and synthesized audio cues.
8. **HSE Supervisory Intelligence**: Real-time workforce registry, cumulative exposure telemetry, and severity-tiered incident triage.
9. **Interactive 3D CAD Model Simulation**: Real-time 3D wristband CAD viewer with Solid Shaded, Wireframe, Exploded Assembly, and drag-and-drop `.glb` support.
10. **4-Language Localization**: Full native support for English (`en`), Hindi (`hi`), Kannada (`kn`), and Gujarati (`gu`).

---

## 2. System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                          FIELD WORKER PORTAL                            │
│                                                                         │
│  Worker Dossier → Auto-Resolved Active Shift → Dosimeter Pairing        │
│  Camera Viewfinder → Real-Time Torch Controls → Live Optical Capture    │
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
│                   CANONICAL SCAN DATA STORE (ZUSTAND)                   │
│                                                                         │
│  • scanId        • timestamp    • workerId    • workerName              │
│  • shiftId       • shiftName    • shiftStart  • shiftEnd                │
│  • dosimeterCode • h2sReading   • riskLevel   • expiryStatus            │
│  • location      • exposureResult (CIELAB ΔE*ab, TWA, metrology)        │
└───────────────────┬─────────────────────────────────┬───────────────────┘
                    │                                 │
                    ↓                                 ↓
┌──────────────────────────────────────┐  ┌───────────────────────────────┐
│      WORKER PROFILE & HISTORY        │  │   HSE SUPERVISORY DASHBOARD   │
│                                      │  │                               │
│  • Chronological Shift Exposure Log  │  │  • Plant Overview & Metrics   │
│  • Cumulative Dosage Gauge           │  │  • Workforce Fleet Roster     │
│  • Colorimetric Metrology Audit      │  │  • Regulatory PEL/STEL Trends │
│  • Operator Credentials Editor       │  │  • Severity-Tiered Alerts     │
└──────────────────────────────────────┘  └───────────────────────────────┘
```

---

## 3. Key Capabilities & Features

### A. Two-Shift Continuous 24-Hour System
- Continuous day and night coverage:
  - **Shift A (Morning/Day)**: `06:00` → `14:00` (8 hours)
  - **Shift B (Evening/Night)**: `14:00` → `06:00` (16 hours covering evening and night across midnight)
- **Automatic Shift Detection**: Determines the active shift directly from local device time.
- **Midnight Handling**: Post-midnight hours (`00:00` to `05:59`) reliably resolve to Shift B.
- **Configurable Timings**: Click the countdown clock in the top status bar to edit Shift A and Shift B hours with immediate recalculation.

### B. Mobile-First Exposure Result
- Designed for immediate comprehension on mobile devices:
  - Primary Safety Status Hero: Safe Baseline (Green), Elevated (Yellow), High (Orange), Critical (Red), Glare/Blur (Gray), Saturated (Brown).
  - Clear cumulative dose reading and 8h Time-Weighted Average (TWA).
  - Actionable safety instructions and emergency guidance.
  - Collapsible Metrology Inspector with CIELAB $\Delta E^*_{ab}$, RGB reference vectors, and Bradford normalization data.

### C. Optical Validation & OCR Engine
- Evaluates sensor strip presence, specular glare, and optical focus before inference.
- Integrated Tesseract.js OCR engine reads printed and handwritten badge codes.
- Evaluator demo suite supports Code Mapping (`A-NORM`, `B-WARN`, `C-HIGH`, `D-CRIT`, `E-INV`, `F-OOR`), Sequence mode, and Fixed mode.

### D. Zero-Dependency Web Audio Synthesizer
- Synthesizes industrial audio via the Web Audio API without external asset downloads:
  - Mechanical camera shutter snap.
  - Pipeline sequential stage ticks (Steps 1–8).
  - Affirmative success chime for safe exposures.
  - Cautionary and emergency pulsating alarms for elevated, high, and critical levels.

### E. 4-Language Localization Engine
- Full native coverage across English (`en`), Hindi (`hi`), Kannada (`kn`), and Gujarati (`gu`).
- Preserves universal scientific and industrial units ($H_2S$, $\text{ppm}\cdot\text{h}$, $\text{CIELAB}$, $\Delta E^*_{ab}$, $\text{ISO D65}$, $\text{TWA}$, $\text{PEL}$, $\text{STEL}$).

---

## 4. Key Routes

| Route | Role | Purpose |
|---|---|---|
| `/` | Public | Master landing portal with unified hero modules and national identity header |
| `/scan` | Field Worker | Optical scanner with live camera viewfinder, torch, and file upload |
| `/worker/result` | Field Worker | Mobile-first calibrated exposure result, safety action guidance, and metrology drawer |
| `/worker/history` | Field Worker | Personal chronological scan ledger and operator profile dossier |
| `/hse` | Safety Officer | Executive plant overview, risk breakdowns, active worker roster, and alerts |
| `/hse/workers` | Safety Officer | Workforce fleet surveillance and worker-specific exposure history |
| `/hse/exposure` | Safety Officer | Cumulative exposure trend charts with PEL/STEL regulatory lines |
| `/hse/alerts` | Safety Officer | Severity-tiered incident management and acknowledgment |
| `/hse/technical` | Metrologist / Auditor | Calibration curves, CIELAB metrics, algorithm provenance, and traceability |
| `/about` | Public / Engineer | 3D CAD simulation, wearable wristband specs, and lead-free sensor chemistry |

---

## 5. Technology Stack

- **Framework**: Next.js 16 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS v4 with Indian national safety tokens & high-contrast themes
- **State Management**: Zustand with persistent client-side storage
- **OCR Engine**: Tesseract.js
- **Charts & Visualizations**: Recharts
- **Icons**: Lucide React
- **Audio**: Web Audio API (zero external sound file dependencies)

---

## 6. Verification & Build Instructions

```bash
# 1. Check TypeScript types
npx tsc --noEmit

# 2. Compile optimized production build
npm run build

# 3. Start development server
npm run dev
```

---

## 7. Project Team

**MRPL Hackathon Innovation Team 2026**:
- **Aaryan Dhamankar** — Software, Digital Systems & Full-Stack Platform Lead
- **Arya Modh** — Chemistry, Sensor Research & Development Lead
- **Avani Abhyankar** — AI Model Development & Optical Inference Lead
- **Aarushi Jha** — Chemosensor Chemistry & Reagent Lead
- **Payas Pawar** — Market, Metrology & Standards Research Lead
- **Sudnya Irranna** — Hardware, CAD & Product Development Lead
