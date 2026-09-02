/**
 * Demo Code Engine
 *
 * Translates an embedded demo code (e.g. "H01") into a concrete
 * DemoScenario value using a configurable mapping table.
 *
 * The mapping lives in the DemoConfigStore (Zustand, persisted) so it
 * can be changed at runtime from the hidden admin panel without touching
 * this module or the scanning UI.
 *
 * Supported codes (defaults):
 *   H01 → DemoScenario.HIGH          (High Exposure)
 *   N01 → DemoScenario.NORMAL        (Normal)
 *   E01 → DemoScenario.ELEVATED      (Elevated)
 *   C01 → DemoScenario.CRITICAL      (Critical)
 *   O01 → DemoScenario.OUT_OF_RANGE  (Out of Bounds)
 *   G01 → DemoScenario.INVALID       (Glare / Invalid)
 */

import { DemoScenario } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DemoCodeMapping {
  /** The short code embedded in the demo image, e.g. "H01" */
  code: string;
  /** The scenario this code maps to */
  scenario: DemoScenario;
  /** Human-readable label shown in the admin panel */
  label: string;
}

export interface DemoCodeResolution {
  /** Resolved scenario, or null if code is unknown */
  scenario: DemoScenario | null;
  /** The code that was looked up */
  code: string;
  /** Whether the code was recognised */
  recognised: boolean;
}

// ---------------------------------------------------------------------------
// Default mapping table
// ---------------------------------------------------------------------------

export const DEFAULT_CODE_MAPPINGS: DemoCodeMapping[] = [
  { code: 'H01', scenario: DemoScenario.HIGH,          label: 'High Exposure' },
  { code: 'N01', scenario: DemoScenario.NORMAL,        label: 'Normal' },
  { code: 'E01', scenario: DemoScenario.ELEVATED,      label: 'Elevated' },
  { code: 'C01', scenario: DemoScenario.CRITICAL,      label: 'Critical' },
  { code: 'O01', scenario: DemoScenario.OUT_OF_RANGE,  label: 'Out of Bounds' },
  { code: 'G01', scenario: DemoScenario.INVALID,       label: 'Glare / Invalid' },
];

// ---------------------------------------------------------------------------
// Resolver (pure function — no store dependency)
// ---------------------------------------------------------------------------

/**
 * Resolve a demo code against a provided mapping table.
 * The mapping table should come from the DemoConfigStore.
 */
export function resolveCode(
  code: string,
  mappings: DemoCodeMapping[],
): DemoCodeResolution {
  const entry = mappings.find(m => m.code.toUpperCase() === code.toUpperCase());

  if (!entry) {
    return { scenario: null, code, recognised: false };
  }

  return { scenario: entry.scenario, code, recognised: true };
}

/**
 * Get the label for a scenario from the mapping table.
 */
export function getLabelForScenario(
  scenario: DemoScenario,
  mappings: DemoCodeMapping[],
): string {
  const entry = mappings.find(m => m.scenario === scenario);
  return entry?.label ?? scenario;
}

/**
 * Get the code for a scenario from the mapping table.
 */
export function getCodeForScenario(
  scenario: DemoScenario,
  mappings: DemoCodeMapping[],
): string | null {
  const entry = mappings.find(m => m.scenario === scenario);
  return entry?.code ?? null;
}
