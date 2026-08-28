import { RiskStatus, ValidityStatus } from '../types';
import { DESIGN_TOKENS } from '../config/design-tokens';

/**
 * Format a date object or ISO string to local date string
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Format a date object or ISO string to local time string
 */
export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

/**
 * Format a date object or ISO string to local date and time string
 */
export function formatDateTime(date: string | Date): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

/**
 * Format duration between start time and now (or end time)
 */
export function formatDuration(startTime: string | Date, endTime?: string | Date | null): string {
  const start = typeof startTime === 'string' ? new Date(startTime).getTime() : startTime.getTime();
  const end = endTime 
    ? (typeof endTime === 'string' ? new Date(endTime).getTime() : endTime.getTime())
    : Date.now();
  
  const diffMs = Math.max(0, end - start);
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${diffHrs}h ${diffMins}m`;
}

/**
 * Format a dose value to proper decimal places
 */
export function formatDose(dose: number | null | undefined, decimals = 2): string {
  if (dose === null || dose === undefined) return '--';
  return dose.toFixed(decimals);
}

/**
 * Basic utility for merging tailwind classes.
 * Alternatively, can use clsx and tailwind-merge if dependencies are present.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Generate a random ID (UUID v4)
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Get the design token color associated with a RiskStatus
 */
export function getRiskColor(status: RiskStatus): string {
  switch (status) {
    case RiskStatus.NORMAL: return DESIGN_TOKENS.colors.success;
    case RiskStatus.ELEVATED: return DESIGN_TOKENS.colors.warning;
    case RiskStatus.HIGH: return DESIGN_TOKENS.colors.saffronAlt;
    case RiskStatus.CRITICAL: return DESIGN_TOKENS.colors.error;
    case RiskStatus.INVALID: 
    case RiskStatus.OUT_OF_RANGE: return DESIGN_TOKENS.colors.textMuted;
    default: return DESIGN_TOKENS.colors.border;
  }
}

/**
 * Get a semantic icon name (if using icon sets) or emoji for RiskStatus
 */
export function getRiskIcon(status: RiskStatus): string {
  switch (status) {
    case RiskStatus.NORMAL: return '✓';
    case RiskStatus.ELEVATED: return '⚠';
    case RiskStatus.HIGH: return '⚠';
    case RiskStatus.CRITICAL: return '⛔';
    default: return '❓';
  }
}

/**
 * Get a human-readable label for RiskStatus
 */
export function getRiskLabel(status: RiskStatus): string {
  switch (status) {
    case RiskStatus.NORMAL: return 'Normal';
    case RiskStatus.ELEVATED: return 'Elevated';
    case RiskStatus.HIGH: return 'High';
    case RiskStatus.CRITICAL: return 'Critical';
    case RiskStatus.INVALID: return 'Invalid';
    case RiskStatus.OUT_OF_RANGE: return 'Out of Range';
    default: return 'Unknown';
  }
}

/**
 * Get a human-readable label for ValidityStatus
 */
export function getValidityLabel(status: ValidityStatus): string {
  switch (status) {
    case ValidityStatus.VALID: return 'Valid';
    case ValidityStatus.LOW_CONFIDENCE: return 'Low Confidence';
    case ValidityStatus.OUT_OF_RANGE: return 'Out of Range';
    case ValidityStatus.INVALID_IMAGE: return 'Invalid Image';
    case ValidityStatus.EXPIRED: return 'Expired';
    case ValidityStatus.CALIBRATION_UNAVAILABLE: return 'No Calibration';
    case ValidityStatus.MODEL_UNAVAILABLE: return 'No Model';
    case ValidityStatus.PROCESSING_ERROR: return 'Processing Error';
    default: return 'Unknown';
  }
}

/**
 * Determine if a scan is valid based on its ValidityStatus
 */
export function isValidScan(status: ValidityStatus): boolean {
  return status === ValidityStatus.VALID || status === ValidityStatus.LOW_CONFIDENCE;
}
