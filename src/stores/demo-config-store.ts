/**
 * Demo Config Store
 *
 * Persisted Zustand store that holds all demo-mode runtime configuration:
 *   - Enable / disable demo mode
 *   - Code → Scenario mapping table (editable from the admin panel)
 *   - Ordered scan sequence
 *   - Sequence cursor (advances with each valid scan in sequence mode)
 *
 * This store is the single source of truth for all demo configuration.
 * The scanning UI reads from it; the hidden admin panel writes to it.
 * The actual inference pipeline stays ignorant of demo config details.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DemoScenario } from '@/types';
import { DemoCodeMapping, DEFAULT_CODE_MAPPINGS } from '@/services/scientific/demo-code-engine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ScanMode = 'sequence' | 'fixed' | 'code';

export interface DemoConfigState {
  /** Master switch — when false the validation layer behaves normally */
  demoModeEnabled: boolean;

  /**
   * Scan mode:
   *   'sequence' — advance through demoSequence on each valid scan
   *   'fixed'    — always use fixedScenario
   *   'code'     — resolve from the demo code embedded in the image
   */
  scanMode: ScanMode;

  /** Scenario used when scanMode === 'fixed' */
  fixedScenario: DemoScenario;

  /** Ordered sequence of scenarios for scanMode === 'sequence' */
  demoSequence: DemoScenario[];

  /** Current position in the sequence (0-based) */
  sequenceCursor: number;

  /** Code → Scenario mapping table */
  codeMappings: DemoCodeMapping[];

  // ── Actions ──────────────────────────────────────────────────────────────

  setDemoModeEnabled: (enabled: boolean) => void;
  setScanMode: (mode: ScanMode) => void;
  setFixedScenario: (scenario: DemoScenario) => void;

  /** Update the full sequence */
  setDemoSequence: (sequence: DemoScenario[]) => void;

  /** Move to the next item in the sequence; wraps around */
  advanceSequence: () => void;

  /** Jump to a specific index in the sequence */
  setSequenceCursor: (index: number) => void;

  /** Reset the cursor to 0 */
  resetSequence: () => void;

  /** Get the scenario at the current cursor (used by the scan page) */
  currentSequenceScenario: () => DemoScenario;

  /** Update the full mapping table */
  setCodeMappings: (mappings: DemoCodeMapping[]) => void;

  /** Update a single mapping entry by code */
  updateCodeMapping: (code: string, scenario: DemoScenario, label: string) => void;

  /** Reset mappings to defaults */
  resetCodeMappings: () => void;

  /** Reset everything to factory defaults */
  resetAll: () => void;
}

// ---------------------------------------------------------------------------
// Default sequence
// ---------------------------------------------------------------------------

export const DEFAULT_DEMO_SEQUENCE: DemoScenario[] = [
  DemoScenario.HIGH,
  DemoScenario.NORMAL,
  DemoScenario.ELEVATED,
  DemoScenario.OUT_OF_RANGE,
  DemoScenario.INVALID,
  DemoScenario.NORMAL,
  DemoScenario.HIGH,
];

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useDemoConfigStore = create<DemoConfigState>()(
  persist(
    (set, get) => ({
      demoModeEnabled: true,
      scanMode: 'sequence',
      fixedScenario: DemoScenario.NORMAL,
      demoSequence: [...DEFAULT_DEMO_SEQUENCE],
      sequenceCursor: 0,
      codeMappings: [...DEFAULT_CODE_MAPPINGS],

      // ── Actions ────────────────────────────────────────────────────────

      setDemoModeEnabled: (enabled) => set({ demoModeEnabled: enabled }),

      setScanMode: (mode) => set({ scanMode: mode }),

      setFixedScenario: (scenario) => set({ fixedScenario: scenario }),

      setDemoSequence: (sequence) =>
        set({ demoSequence: sequence, sequenceCursor: 0 }),

      advanceSequence: () =>
        set((state) => {
          const next = (state.sequenceCursor + 1) % state.demoSequence.length;
          return { sequenceCursor: next };
        }),

      setSequenceCursor: (index) =>
        set((state) => ({
          sequenceCursor: Math.max(
            0,
            Math.min(index, state.demoSequence.length - 1),
          ),
        })),

      resetSequence: () => set({ sequenceCursor: 0 }),

      currentSequenceScenario: () => {
        const { demoSequence, sequenceCursor } = get();
        if (demoSequence.length === 0) return DemoScenario.NORMAL;
        return demoSequence[sequenceCursor % demoSequence.length];
      },

      setCodeMappings: (mappings) => set({ codeMappings: mappings }),

      updateCodeMapping: (code, scenario, label) =>
        set((state) => ({
          codeMappings: state.codeMappings.map((m) =>
            m.code.toUpperCase() === code.toUpperCase()
              ? { ...m, scenario, label }
              : m,
          ),
        })),

      resetCodeMappings: () =>
        set({ codeMappings: [...DEFAULT_CODE_MAPPINGS] }),

      resetAll: () =>
        set({
          demoModeEnabled: true,
          scanMode: 'sequence',
          fixedScenario: DemoScenario.NORMAL,
          demoSequence: [...DEFAULT_DEMO_SEQUENCE],
          sequenceCursor: 0,
          codeMappings: [...DEFAULT_CODE_MAPPINGS],
        }),
    }),
    {
      name: 'h2s-demo-config-storage',
    },
  ),
);
