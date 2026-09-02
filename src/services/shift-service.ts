import { Shift, ShiftStatus } from '@/types';

export interface ShiftConfig {
  id: string; // 'SHIFT-A' | 'SHIFT-B'
  name: string; // 'Shift A' | 'Shift B'
  label: string; // 'Morning / Day' | 'Evening / Night'
  startTime: string; // '06:00'
  endTime: string; // '14:00'
}

export interface ActiveShiftResult {
  activeShift: ShiftConfig;
  shiftId: string;
  shiftName: string;
  shiftStart: string;
  shiftEnd: string;
  remainingMs: number;
  remainingMinutes: number;
  remainingFormatted: string;
  nextShift: ShiftConfig;
  isEndingSoon: boolean;
  progressPercent: number;
  elapsedFormatted: string;
}

export const DEFAULT_SHIFT_CONFIGS: ShiftConfig[] = [
  {
    id: 'SHIFT-A',
    name: 'Shift A',
    label: 'Morning / Day',
    startTime: '06:00',
    endTime: '14:00',
  },
  {
    id: 'SHIFT-B',
    name: 'Shift B',
    label: 'Evening / Night',
    startTime: '14:00',
    endTime: '06:00',
  },
];

export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':').map(Number);
  const h = isNaN(parts[0]) ? 0 : parts[0];
  const m = isNaN(parts[1]) ? 0 : parts[1];
  return h * 60 + m;
}

export function minutesToTimeString(mins: number): string {
  const norm = ((Math.floor(mins) % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Automatically determines the active shift based on local device time
 * and central shift configuration. Properly handles midnight crossover.
 */
export function determineActiveShift(
  configs: ShiftConfig[] = DEFAULT_SHIFT_CONFIGS,
  referenceDate: Date = new Date()
): ActiveShiftResult {
  const safeConfigs = configs && configs.length > 0 ? configs : DEFAULT_SHIFT_CONFIGS;
  const hours = referenceDate.getHours();
  const minutes = referenceDate.getMinutes();
  const seconds = referenceDate.getSeconds();
  const currentMinutes = hours * 60 + minutes + seconds / 60;

  let matchedConfig: ShiftConfig | null = null;
  let matchedMinutesLeft = 0;
  let matchedTotalDuration = 480;

  for (let i = 0; i < safeConfigs.length; i++) {
    const cfg = safeConfigs[i];
    const start = timeStringToMinutes(cfg.startTime);
    const end = timeStringToMinutes(cfg.endTime);

    if (start < end) {
      // Daytime single-day block (e.g. 06:00 to 14:00)
      if (currentMinutes >= start && currentMinutes < end) {
        matchedConfig = cfg;
        matchedMinutesLeft = end - currentMinutes;
        matchedTotalDuration = end - start;
        break;
      }
    } else {
      // Midnight crossing block (e.g. 14:00 to 06:00 or 22:00 to 06:00)
      if (currentMinutes >= start || currentMinutes < end) {
        matchedConfig = cfg;
        matchedTotalDuration = (1440 - start) + end;
        if (currentMinutes >= start) {
          matchedMinutesLeft = (1440 - currentMinutes) + end;
        } else {
          matchedMinutesLeft = end - currentMinutes;
        }
        break;
      }
    }
  }

  // Fallback if no interval matched
  if (!matchedConfig) {
    matchedConfig = safeConfigs[0] || DEFAULT_SHIFT_CONFIGS[0];
    matchedMinutesLeft = 60;
    matchedTotalDuration = 480;
  }

  // Find next upcoming shift
  const currentIndex = safeConfigs.findIndex(c => c.id === matchedConfig!.id);
  const nextShift = safeConfigs[(currentIndex + 1) % safeConfigs.length] || safeConfigs[0];

  const remainingMinsInt = Math.max(0, Math.floor(matchedMinutesLeft));
  const remainingHours = Math.floor(remainingMinsInt / 60);
  const remainingMinsOnly = remainingMinsInt % 60;

  let remainingFormatted = '';
  if (remainingHours > 0) {
    remainingFormatted = `${String(remainingHours).padStart(2, '0')}h ${String(remainingMinsOnly).padStart(2, '0')}m remaining`;
  } else {
    remainingFormatted = `${remainingMinsOnly}m remaining`;
  }

  const elapsedMinutes = Math.max(0, matchedTotalDuration - matchedMinutesLeft);
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  const elapsedMinsOnly = Math.floor(elapsedMinutes % 60);
  const elapsedFormatted = `${String(elapsedHours).padStart(2, '0')}h ${String(elapsedMinsOnly).padStart(2, '0')}m elapsed`;
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedMinutes / matchedTotalDuration) * 100)));

  return {
    activeShift: matchedConfig,
    shiftId: matchedConfig.id,
    shiftName: matchedConfig.name,
    shiftStart: matchedConfig.startTime,
    shiftEnd: matchedConfig.endTime,
    remainingMs: matchedMinutesLeft * 60 * 1000,
    remainingMinutes: remainingMinsInt,
    remainingFormatted,
    nextShift,
    isEndingSoon: remainingMinsInt <= 30,
    progressPercent,
    elapsedFormatted,
  };
}

/**
 * Resolves active shift at scan time.
 */
export function resolveActiveShift(
  workerId?: string,
  configs?: ShiftConfig[] | null,
  referenceDate: Date = new Date()
): { shiftId: string; shiftName: string; shiftStart: string; shiftEnd: string } {
  const result = determineActiveShift(configs || DEFAULT_SHIFT_CONFIGS, referenceDate);
  return {
    shiftId: result.shiftId,
    shiftName: result.shiftName,
    shiftStart: result.shiftStart,
    shiftEnd: result.shiftEnd,
  };
}
