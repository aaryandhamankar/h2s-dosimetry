# Implementation Plan — H₂S Dosimeter Platform

## Architecture Decision: Unified Next.js Web Application

For the SIH hackathon prototype, building a single Next.js 14 (App Router) web application that serves both the worker experience (mobile-responsive) and the HSE dashboard (desktop-first). This delivers one deployable, demonstrable application with shared data/state.

### Tech Stack
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS (design system tokens)
- Zustand (state management with localStorage persistence)
- Recharts (charts)
- Lucide React (icons)

### Scientific Pipeline: 8 Modular Engines
1. ImageQualityEngine
2. DosimeterDetectionEngine
3. ROIExtractionEngine
4. ColorAnalysisEngine
5. CalibrationEngine
6. InferenceEngine (Mock/CalibrationCurve)
7. ValidationEngine
8. RiskClassificationEngine

### Demo Scenarios (Deterministic)
| Scenario | Dose | Risk | Validity |
|----------|------|------|----------|
| NORMAL | 3.2 | NORMAL | VALID |
| ELEVATED | 12.4 | ELEVATED | VALID |
| HIGH | 18.6 | HIGH | VALID |
| CRITICAL | 24.8 | CRITICAL | VALID |
| INVALID | null | INVALID | INVALID_IMAGE |
| OUT_OF_RANGE | null | OUT_OF_RANGE | OUT_OF_RANGE |

### Implementation Phases
1. Foundation (project, routing, design, types, config)
2. Worker Experience (dashboard, scanner, pipeline, result, history)
3. Scientific Services (modular engines)
4. HSE Dashboard (overview, workers, analytics, alerts)
5. Technical Mode (provenance, inspection)
6. Demo System (scenarios, control panel, reset)
7. Polish & Acceptance Testing
