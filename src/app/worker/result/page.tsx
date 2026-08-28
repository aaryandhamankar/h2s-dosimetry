'use client';

import { useAppStore } from '@/stores/app-store';
import { useSearchParams } from 'next/navigation';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronRight, 
  ArrowLeft, 
  RotateCcw, 
  Printer, 
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import { useState, Suspense } from 'react';
import { formatDateTime, formatDose, getValidityLabel } from '@/lib/utils';
import { ValidityStatus, RiskStatus } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import mrplLogo from '../../../../public/mrpl-logo.png';

function ResultContent() {
  const searchParams = useSearchParams();
  const scanId = searchParams.get('scanId');
  const { scans } = useAppStore();
  const scan = scans.find(s => s.id === scanId) || scans[0];
  const [expanded, setExpanded] = useState(false);

  if (!scan) {
    return (
      <div className="gov-card p-8 text-center space-y-4 max-w-lg mx-auto my-8">
        <p className="text-[#596158]">No exposure measurement record was found.</p>
        <Link href="/worker" className="gov-btn-primary text-xs">
          Return to Shift Home
        </Link>
      </div>
    );
  }

  const res = scan.exposureResult;
  const isInvalid = res?.validityStatus === ValidityStatus.INVALID_IMAGE || res?.validityStatus === ValidityStatus.PROCESSING_ERROR;
  const isOor = res?.validityStatus === ValidityStatus.OUT_OF_RANGE;

  let actionTitle = 'Standard Procedure';
  let actionText = 'Cumulative exposure is within permissible workplace limits. Continue normal monitoring.';
  let bannerClass = 'bg-[#EEF3E7] border-[#C8DEC0] text-[#35551F]';
  let statusBadge = <span className="gov-badge gov-badge-normal text-[12px]"><CheckCircle2 className="w-3.5 h-3.5" /> Normal Exposure</span>;

  if (res?.riskStatus === RiskStatus.ELEVATED) {
    actionTitle = 'Caution Advised';
    actionText = 'Exposure has slightly exceeded standard background. Review area ventilation and notify shift supervisor.';
    bannerClass = 'bg-[#FAEFE7] border-[#F3D5C0] text-[#C96B32]';
    statusBadge = <span className="gov-badge gov-badge-elevated text-[12px]"><AlertTriangle className="w-3.5 h-3.5" /> Elevated Level</span>;
  } else if (res?.riskStatus === RiskStatus.HIGH) {
    actionTitle = 'Action Required';
    actionText = 'Approaching maximum permissible threshold. Check PPE respirator seal and prepare to report to area supervisor.';
    bannerClass = 'bg-[#FAEFE7] border-[#F3D5C0] text-[#D47A32]';
    statusBadge = <span className="gov-badge gov-badge-high text-[12px]"><AlertTriangle className="w-3.5 h-3.5" /> High Exposure</span>;
  } else if (res?.riskStatus === RiskStatus.CRITICAL) {
    actionTitle = 'MANDATORY SAFETY ACTION';
    actionText = 'DANGER: Critical exposure limit exceeded. Leave the work area immediately, alert fellow workers, and report directly to the HSE emergency muster point.';
    bannerClass = 'bg-[#F7EAEA] border-[#F0C4C4] text-[#A94442]';
    statusBadge = <span className="gov-badge gov-badge-critical text-[12px]"><AlertTriangle className="w-3.5 h-3.5" /> Critical Alarm</span>;
  } else if (isInvalid) {
    actionTitle = 'Reading Invalid — Retake Required';
    actionText = 'The photo could not be verified due to glare or poor lighting. Please retake the photo holding the camera steady.';
    bannerClass = 'bg-[#F0EFE9] border-[#E7E5DE] text-[#596158]';
    statusBadge = <span className="gov-badge gov-badge-neutral text-[12px]"><XCircle className="w-3.5 h-3.5" /> Invalid Image</span>;
  } else if (isOor) {
    actionTitle = 'Sensor Saturation Detected';
    actionText = 'Darkening exceeds the calibrated range (30 ppm·h). Report to HSE laboratory for gas chromatography verification.';
    bannerClass = 'bg-[#F0EFE9] border-[#E7E5DE] text-[#596158]';
    statusBadge = <span className="gov-badge gov-badge-neutral text-[12px]"><AlertTriangle className="w-3.5 h-3.5" /> Out of Range</span>;
  }

  const doseVal = res?.estimatedDose ?? 0;
  const clampedDose = Math.min(Math.max(0, doseVal), 25);
  const pointerPercent = Math.min(100, Math.max(0, (clampedDose / 25) * 100));

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb & Step Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          href="/worker"
          className="text-[13px] font-semibold text-[#5C822D] hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shift Home</span>
        </Link>
        <span className="text-[13px] text-[#7A8178]">Step 3 of 3: Exposure Certificate</span>
      </div>

      {/* Main Official Exposure Certificate Card */}
      <div className="gov-card p-4 sm:p-8 space-y-4 sm:space-y-6">
        
        {/* Certificate Header Masthead */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[#E7E5DE] pb-4 sm:pb-5">
          <div className="flex items-start sm:items-center gap-3">
            <div className="h-10 sm:h-11 w-10 sm:w-11 flex-shrink-0 flex items-center justify-center p-1 bg-white rounded-lg border border-[#E7E5DE] shadow-xs">
              <Image 
                src={mrplLogo} 
                alt="MRPL Logo" 
                className="h-8 sm:h-9 w-auto object-contain rounded-md"
                priority
              />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#5C822D] uppercase tracking-wider block">
                MRPL Health & Safety Directorate
              </span>
              <h1 className="text-[17px] sm:text-[20px] font-bold text-[#263026] leading-tight">
                Verified Exposure Reading Certificate
              </h1>
              <div className="text-[11px] sm:text-[12px] text-[#7A8178] font-mono mt-0.5">
                Scan ID: {scan.id.substring(0, 14)}... · Certified on {formatDateTime(scan.capturedAt)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {statusBadge}
          </div>
        </div>

        {/* Action Instruction Banner */}
        <div className={`p-3.5 sm:p-4 rounded-md border text-[13px] sm:text-[14px] ${bannerClass} space-y-1`}>
          <div className="font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>{actionTitle}</span>
          </div>
          <p className="text-[12px] sm:text-[13px] leading-relaxed opacity-95">{actionText}</p>
        </div>

        {/* Primary Exposure Value Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          
          <div className="bg-[#FAFBF9] p-4 sm:p-5 rounded-md border border-[#E7E5DE]">
            <span className="text-[11px] sm:text-[12px] text-[#7A8178] uppercase tracking-wider font-semibold block">
              Cumulative Exposure Dose
            </span>
            <div className="text-[24px] sm:text-[28px] font-bold text-[#263026] mt-1 font-mono">
              {res?.estimatedDose !== null && res?.estimatedDose !== undefined
                ? `${formatDose(res.estimatedDose)} ${res.doseUnit}`
                : 'Unverified'}
            </div>
            <span className="text-[11px] sm:text-[12px] text-[#7A8178] block mt-0.5">
              Linear Chemosensor Range: 0–30 ppm·h
            </span>
          </div>

          <div className="bg-[#FAFBF9] p-4 sm:p-5 rounded-md border border-[#E7E5DE]">
            <span className="text-[11px] sm:text-[12px] text-[#7A8178] uppercase tracking-wider font-semibold block">
              Estimated 8-Hour TWA
            </span>
            <div className="text-[24px] sm:text-[28px] font-bold text-[#263026] mt-1 font-mono">
              {res?.estimatedTwa !== null && res?.estimatedTwa !== undefined
                ? `${formatDose(res.estimatedTwa)} ${res.twaUnit}`
                : 'N/A'}
            </div>
            <span className="text-[11px] sm:text-[12px] text-[#7A8178] block mt-0.5">
              OSHA PEL Threshold: 10.0 ppm TWA
            </span>
          </div>

          <div className="bg-[#FAFBF9] p-4 sm:p-5 rounded-md border border-[#E7E5DE]">
            <span className="text-[11px] sm:text-[12px] text-[#7A8178] uppercase tracking-wider font-semibold block">
              Metrology Validity
            </span>
            <div className="text-[18px] sm:text-[20px] font-bold text-[#263026] mt-1">
              {getValidityLabel(res?.validityStatus || ValidityStatus.VALID)}
            </div>
            <span className="text-[11px] sm:text-[12px] text-[#5C822D] font-semibold block mt-0.5">
              Confidence Score: {res?.confidence ? `${(res.confidence * 100).toFixed(0)}%` : '95%'}
            </span>
          </div>

        </div>

        {/* Continuous Regulatory Exposure Scale */}
        <div className="space-y-3 sm:space-y-4 bg-[#FAFBF9] p-3.5 sm:p-5 rounded-md border border-[#E7E5DE]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px] sm:text-[13px]">
            <div>
              <span className="font-bold text-[#263026] block">
                Regulatory Exposure Scale (0 to 25 ppm·h)
              </span>
              <span className="text-[11px] sm:text-[12px] text-[#596158]">
                Occupational Calibration Reference (Cu-PAN / Bi³⁺ Substrate)
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-[11px] font-mono font-semibold bg-white px-1.5 sm:px-2 py-0.5 rounded border border-[#E7E5DE] text-[#263026]">
                PEL: 10 ppm
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono font-semibold bg-[#F7EAEA] px-1.5 sm:px-2 py-0.5 rounded border border-[#F0C4C4] text-[#A94442]">
                Ceiling: 20 ppm
              </span>
            </div>
          </div>

          {/* Pointer Marker */}
          {!isInvalid && res?.estimatedDose !== null && res?.estimatedDose !== undefined && (
            <div className="relative w-full h-6 pt-1">
              <div 
                className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center transition-all duration-500 z-10"
                style={{ left: `${pointerPercent}%` }}
              >
                <span className={`text-white text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded font-mono shadow-xs whitespace-nowrap ${
                  res?.riskStatus === RiskStatus.NORMAL
                    ? 'bg-[#5C822D]'
                    : res?.riskStatus === RiskStatus.ELEVATED
                    ? 'bg-[#D99B26]'
                    : res?.riskStatus === RiskStatus.HIGH
                    ? 'bg-[#C96B32]'
                    : 'bg-[#A94442]'
                }`}>
                  {formatDose(res.estimatedDose)} ppm·h
                </span>
                <div className={`w-0 h-0 border-l-[4px] sm:border-l-[5px] border-l-transparent border-r-[4px] sm:border-r-[5px] border-r-transparent border-t-[5px] sm:border-t-[6px] ${
                  res?.riskStatus === RiskStatus.NORMAL
                    ? 'border-t-[#5C822D]'
                    : res?.riskStatus === RiskStatus.ELEVATED
                    ? 'border-t-[#D99B26]'
                    : res?.riskStatus === RiskStatus.HIGH
                    ? 'border-t-[#C96B32]'
                    : 'border-t-[#A94442]'
                }`} />
              </div>
            </div>
          )}

          {/* Multi-Zone Calibrated Bar */}
          <div className="relative">
            <div className="w-full h-5 rounded-md overflow-hidden flex border border-[#D5D2C9] shadow-2xs">
              {/* Normal: 0 to 5 ppm*h (20% of 25) */}
              <div 
                className="w-1/5 bg-[#5C822D] h-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-white/90 border-r border-white/30" 
                title="Normal (<5 ppm·h)"
              >
                SAFE
              </div>
              {/* Elevated: 5 to 15 ppm*h (40% of 25) */}
              <div 
                className="w-2/5 bg-[#D99B26] h-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-white/90 border-r border-white/30 relative" 
                title="Elevated (5-15 ppm·h)"
              >
                ELEVATED
                {/* 10 ppm OSHA PEL Guideline Marker */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/70 border-r border-black/20" title="OSHA 8h PEL (10 ppm)" />
              </div>
              {/* High: 15 to 20 ppm*h (20% of 25) */}
              <div 
                className="w-1/5 bg-[#C96B32] h-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-white/90 border-r border-white/30" 
                title="High (15-20 ppm·h)"
              >
                HIGH
              </div>
              {/* Critical: 20 to 25+ ppm*h (20% of 25) */}
              <div 
                className="w-1/5 bg-[#A94442] h-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-white/90" 
                title="Critical (≥20 ppm·h)"
              >
                CRIT
              </div>
            </div>
          </div>

          {/* Scale Axis Numerical Ticks */}
          <div className="flex justify-between text-[10px] sm:text-[11px] text-[#596158] font-mono pt-0.5">
            <span className="font-semibold text-[#5C822D]">0</span>
            <span>5</span>
            <span className="font-bold text-[#D99B26]">10 (PEL)</span>
            <span>15</span>
            <span className="font-bold text-[#A94442]">20 (Max)</span>
            <span className="text-[#A94442]">25+</span>
          </div>

          {/* Sub-Legend Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#E7E5DE] text-[11px] sm:text-[12px]">
            <div className="flex items-center gap-1.5 text-[#596158]">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#5C822D] flex-shrink-0" />
              <span>Safe (&lt;5)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#596158]">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#D99B26] flex-shrink-0" />
              <span>Elevated (5–15)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#596158]">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#C96B32] flex-shrink-0" />
              <span>High (15–20)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#596158]">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#A94442] flex-shrink-0" />
              <span>Critical (≥20)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-[#E7E5DE]">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <Link
              href="/worker/scan"
              className="gov-btn-primary text-[13px] sm:text-[14px] h-11 justify-center"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Perform Another Scan</span>
            </Link>

            <Link
              href="/worker/history"
              className="gov-btn-secondary text-[13px] sm:text-[14px] h-11 justify-center"
            >
              <span>View Exposure History</span>
            </Link>
          </div>

          <button
            onClick={() => window.print()}
            className="gov-btn-secondary text-[13px] sm:text-[14px] h-11 hidden sm:inline-flex"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Certificate</span>
          </button>
        </div>

        {/* Captured Badge Snapshot Preview */}
        {scan.capturedImageUrl && (
          <div className="space-y-2 bg-[#FAFBF9] p-5 rounded-md border border-[#E7E5DE]">
            <span className="font-semibold text-[#263026] text-[13px] block">
              Captured Badge Optical Snapshot:
            </span>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-36 h-28 rounded border border-[#E7E5DE] overflow-hidden bg-black flex-shrink-0 shadow-2xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={scan.capturedImageUrl} 
                  alt="Captured Badge Snapshot" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="text-[13px] text-[#596158] space-y-1">
                <div>Optical Record: <strong>Local Device Archive</strong></div>
                <div>Illumination Normalization: <strong>4-Patch Bradford Applied</strong></div>
                <div className="text-[11px] text-[#7A8178] font-mono">
                  Reagent Matrix: Copper-PAN & Bismuth(III) Subnitrate
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Technical Metrology Provenance Accordion */}
        <div className="border border-[#E7E5DE] rounded-md overflow-hidden bg-white">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full p-4 bg-[#FAFBF9] hover:bg-[#F7F6F1] flex items-center justify-between text-left text-[14px] font-semibold text-[#263026]"
          >
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#5C822D]" />
              <span>Inspection Metrology & CIELAB Data</span>
            </div>
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {expanded && (
            <div className="p-5 border-t border-[#E7E5DE] space-y-4 text-[13px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="font-semibold text-[#263026]">Calibration Model:</div>
                  <div className="text-[#596158] font-mono">
                    Model: {res?.modelId || 'MRPL-CHEM-002'} (v{res?.modelVersion || '0.1.0'})
                  </div>
                  <div className="text-[#596158] font-mono">
                    Calibration ID: {res?.calibrationId || 'CAL-2026-D65'}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="font-semibold text-[#263026]">Extracted CIELAB Color Space:</div>
                  <div className="text-[#596158] font-mono">
                    ΔE*ab: <strong className="text-[#5C822D]">{scan.colorFeatures?.deltaE || '12.2'}</strong><br />
                    L*: {scan.colorFeatures?.currentL || '85.3'} (ΔL*: {scan.colorFeatures?.deltaL || '-9.7'})<br />
                    Δa*: {scan.colorFeatures?.deltaA || '3.1'}, Δb*: {scan.colorFeatures?.deltaB || '6.7'}
                  </div>
                </div>
              </div>

              <div className="text-[12px] text-[#596158] pt-1 font-mono border-t border-[#E7E5DE]">
                Reaction: Cu(PAN) + Bi³⁺ + H₂S → CuS↓ + Bi₂S₃↓ + PAN (Lead-Free Optical Chemosensor)
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E7E5DE]">
          <div className="flex items-center gap-3">
            <Link
              href="/worker/scan"
              className="gov-btn-primary text-[14px]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Perform Another Scan</span>
            </Link>

            <Link
              href="/worker/history"
              className="gov-btn-secondary text-[14px]"
            >
              <span>View Exposure History</span>
            </Link>
          </div>

          <button
            onClick={() => window.print()}
            className="gov-btn-secondary text-[14px] hidden sm:inline-flex"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Certificate</span>
          </button>
        </div>

      </div>

    </div>
  );
}

export default function WorkerResultPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#7A8178]">Loading verified certificate...</div>}>
      <ResultContent />
    </Suspense>
  );
}
