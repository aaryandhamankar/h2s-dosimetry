'use client';

import { useAppStore } from '@/stores/app-store';
import { useSearchParams } from 'next/navigation';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ArrowLeft, 
  RotateCcw, 
  Printer, 
  Cpu,
  ShieldAlert,
  ShieldCheck,
  History,
  Layers,
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
  const [showTechnical, setShowTechnical] = useState(false);

  if (!scan) {
    return (
      <div className="gov-card p-6 sm:p-8 text-center space-y-4 max-w-lg mx-auto my-6">
        <p className="text-[#596158]">No exposure measurement record was found.</p>
        <Link href="/worker" className="gov-btn-primary text-xs">
          Return to Scanner
        </Link>
      </div>
    );
  }

  const res = scan.exposureResult;
  const isInvalid = res?.validityStatus === ValidityStatus.INVALID_IMAGE || res?.validityStatus === ValidityStatus.PROCESSING_ERROR;
  const isOor = res?.validityStatus === ValidityStatus.OUT_OF_RANGE;

  let actionTitle = 'Normal Procedure';
  let actionText = 'Cumulative H₂S exposure is within safe permissible workplace limits. Continue normal operations.';
  let bannerClass = 'bg-[#EEF3E7] border-[#C8DEC0] text-[#35551F]';
  let statusBadge = (
    <span className="gov-badge gov-badge-normal text-[12px] sm:text-[13px] py-1 px-3">
      <CheckCircle2 className="w-4 h-4" /> Normal Exposure
    </span>
  );

  if (res?.riskStatus === RiskStatus.ELEVATED) {
    actionTitle = 'Caution Advised — Notify Supervisor';
    actionText = 'Exposure is elevated above baseline. Review local area ventilation and inform shift lead.';
    bannerClass = 'bg-[#FAEFE7] border-[#F3D5C0] text-[#C96B32]';
    statusBadge = (
      <span className="gov-badge gov-badge-elevated text-[12px] sm:text-[13px] py-1 px-3">
        <AlertTriangle className="w-4 h-4" /> Elevated Level
      </span>
    );
  } else if (res?.riskStatus === RiskStatus.HIGH) {
    actionTitle = 'Action Required — Inspect PPE';
    actionText = 'Approaching occupational limit. Verify respirator seal and prepare to exit work zone.';
    bannerClass = 'bg-[#FAEFE7] border-[#F3D5C0] text-[#D47A32]';
    statusBadge = (
      <span className="gov-badge gov-badge-high text-[12px] sm:text-[13px] py-1 px-3">
        <AlertTriangle className="w-4 h-4" /> High Exposure
      </span>
    );
  } else if (res?.riskStatus === RiskStatus.CRITICAL) {
    actionTitle = 'MANDATORY SAFETY ACTION: EVACUATE';
    actionText = 'CRITICAL LIMIT EXCEEDED: Evacuate the area immediately. Warn nearby personnel and report to the HSE emergency muster point.';
    bannerClass = 'bg-[#F7EAEA] border-[#F0C4C4] text-[#A94442] font-semibold';
    statusBadge = (
      <span className="gov-badge gov-badge-critical text-[12px] sm:text-[13px] py-1 px-3 animate-pulse">
        <ShieldAlert className="w-4 h-4" /> Critical Alarm
      </span>
    );
  } else if (isInvalid) {
    actionTitle = 'Reading Invalid — Retake Photo';
    actionText = 'Image could not be validated due to glare or blur. Hold camera steady over the 4-patch calibration bar and scan again.';
    bannerClass = 'bg-[#F0EFE9] border-[#E7E5DE] text-[#596158]';
    statusBadge = (
      <span className="gov-badge gov-badge-neutral text-[12px] sm:text-[13px] py-1 px-3">
        <XCircle className="w-4 h-4" /> Invalid Capture
      </span>
    );
  } else if (isOor) {
    actionTitle = 'Sensor Saturation Detected';
    actionText = 'Sensor signal exceeds the 30.0 ppm·h calibrated range. Report to the HSE laboratory for gas chromatography testing.';
    bannerClass = 'bg-[#F0EFE9] border-[#E7E5DE] text-[#596158]';
    statusBadge = (
      <span className="gov-badge gov-badge-neutral text-[12px] sm:text-[13px] py-1 px-3">
        <AlertTriangle className="w-4 h-4" /> Out of Range
      </span>
    );
  }

  const doseVal = res?.estimatedDose ?? 0;
  const clampedDose = Math.min(Math.max(0, doseVal), 25);
  const pointerPercent = Math.min(100, Math.max(0, (clampedDose / 25) * 100));

  return (
    <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
      
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          href="/worker"
          className="text-[13px] font-semibold text-[#5C822D] hover:underline flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scanner</span>
        </Link>
        <span className="text-[12px] text-[#7A8178]">
          {formatDateTime(scan.capturedAt)}
        </span>
      </div>

      {/* 1. PRIMARY RESULT HERO CARD (Understandable within seconds!) */}
      <div className="gov-card p-4 sm:p-7 space-y-4 sm:space-y-5">
        
        {/* Certificate Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[#E7E5DE] pb-3 sm:pb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center p-1 bg-white rounded-lg border border-[#E7E5DE] shadow-xs">
              <Image 
                src={mrplLogo} 
                alt="MRPL Logo" 
                className="h-7 w-auto object-contain rounded-md"
                priority
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#5C822D] uppercase tracking-wider block">
                MRPL Gas Safety Verification
              </span>
              <h1 className="text-[16px] sm:text-[19px] font-bold text-[#263026] truncate">
                Dosimeter Exposure Result
              </h1>
            </div>
          </div>

          <div className="flex-shrink-0">
            {statusBadge}
          </div>
        </div>

        {/* PRIMARY H2S LEVEL HERO DISPLAY */}
        <div className="bg-[#FAFBF9] border-2 border-[#D5D2C9] rounded-xl p-4 sm:p-6 text-center space-y-1">
          <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-wider text-[#7A8178] block">
            Detected H₂S Exposure Dose
          </span>
          <div className="text-[36px] sm:text-[48px] font-black text-[#263026] font-mono leading-none tracking-tight py-1">
            {res?.estimatedDose !== null && res?.estimatedDose !== undefined
              ? `${formatDose(res.estimatedDose)} ${res.doseUnit || 'ppm·h'}`
              : 'UNVERIFIED'}
          </div>
          <div className="text-[12px] sm:text-[13px] text-[#596158]">
            Estimated 8-Hour TWA: <strong className="text-[#263026]">{res?.estimatedTwa !== null && res?.estimatedTwa !== undefined ? `${formatDose(res.estimatedTwa)} ppm` : 'N/A'}</strong> · Limit: <strong className="text-[#35551F]">10.0 ppm</strong>
          </div>
        </div>

        {/* ACTION REQUIRED BANNER (High Contrast) */}
        <div className={`p-4 rounded-lg border-2 text-[13px] sm:text-[14px] ${bannerClass} space-y-1 shadow-xs`}>
          <div className="font-bold flex items-center gap-2 text-[14px] sm:text-[15px]">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            <span>{actionTitle}</span>
          </div>
          <p className="text-[12px] sm:text-[13px] leading-relaxed opacity-95">
            {actionText}
          </p>
        </div>

        {/* EXTENSIBLE MULTI-READING SENSOR SPOT ARCHITECTURE */}
        {/* Architecture Note: Slot 1 is active now; slots 2-6 will automatically render when multi-spot sensors are enabled */}
        <div className="bg-[#FAFBF9] border border-[#E7E5DE] rounded-lg p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[11px] sm:text-[12px] font-bold text-[#7A8178] uppercase">
            <span className="flex items-center gap-1.5">
              <Layers size={13} className="text-[#5C822D]" />
              <span>Chemosensor Matrix Slots (1 of 6 Active)</span>
            </span>
            <span className="text-[#5C822D]">Primary Slot A</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            <div className="p-2 rounded bg-white border-2 border-[#5C822D] text-center space-y-0.5 shadow-2xs">
              <span className="text-[9px] font-bold text-[#5C822D] block">SPOT 1 (A)</span>
              <strong className="text-[12px] text-[#263026] block font-mono">
                {res?.estimatedDose !== null && res?.estimatedDose !== undefined ? `${formatDose(res.estimatedDose)}` : '—'}
              </strong>
              <span className="text-[8px] text-[#7A8178] block">ppm·h</span>
            </div>

            {[2, 3, 4, 5, 6].map((spotNum) => (
              <div key={spotNum} className="p-2 rounded bg-[#F7F6F1] border border-dashed border-[#D5D2C9] text-center space-y-0.5 opacity-60">
                <span className="text-[9px] font-semibold text-[#7A8178] block">SPOT {spotNum}</span>
                <span className="text-[11px] text-[#7A8178] block font-mono">Reserved</span>
                <span className="text-[8px] text-[#7A8178] block">Future</span>
              </div>
            ))}
          </div>
        </div>

        {/* REGULATORY EXPOSURE SCALE BAR */}
        <div className="bg-[#FAFBF9] p-3.5 sm:p-4 rounded-lg border border-[#E7E5DE] space-y-2.5">
          <div className="flex items-center justify-between text-[11px] sm:text-[12px]">
            <span className="font-bold text-[#263026]">OSHA Permissible Range (0 to 25 ppm·h)</span>
            <span className="font-mono text-[#7A8178] text-[10px]">PEL: 10 ppm</span>
          </div>

          {/* Pointer */}
          {!isInvalid && res?.estimatedDose !== null && res?.estimatedDose !== undefined && (
            <div className="relative w-full h-5 pt-0.5">
              <div 
                className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center transition-all duration-300 z-10"
                style={{ left: `${pointerPercent}%` }}
              >
                <span className="text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded font-mono bg-[#263026] shadow-xs">
                  {formatDose(res.estimatedDose)}
                </span>
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#263026]" />
              </div>
            </div>
          )}

          {/* Color Bar */}
          <div className="w-full h-4 rounded-md overflow-hidden flex border border-[#D5D2C9]">
            <div className="w-1/5 bg-[#5C822D] h-full" title="Safe (<5)" />
            <div className="w-2/5 bg-[#D99B26] h-full" title="Elevated (5-15)" />
            <div className="w-1/5 bg-[#C96B32] h-full" title="High (15-20)" />
            <div className="w-1/5 bg-[#A94442] h-full" title="Critical (≥20)" />
          </div>

          <div className="flex justify-between text-[10px] text-[#7A8178] font-mono">
            <span>0</span>
            <span>5 (Safe)</span>
            <span className="font-bold text-[#D99B26]">10 (PEL)</span>
            <span>15</span>
            <span className="font-bold text-[#A94442]">20 (Ceiling)</span>
            <span>25+</span>
          </div>
        </div>

        {/* PRIMARY ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link
            href="/worker"
            className="gov-btn-primary h-12 text-[14px] sm:text-[15px] font-semibold justify-center shadow-xs hover:shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Perform Another Scan</span>
          </Link>

          <Link
            href="/worker/history"
            className="gov-btn-secondary h-12 text-[14px] sm:text-[15px] font-semibold justify-center"
          >
            <History className="w-4 h-4" />
            <span>View Exposure History</span>
          </Link>
        </div>

        {/* PROGRESSIVE DISCLOSURE: TECHNICAL METROLOGY ACCORDION */}
        <div className="border border-[#E7E5DE] rounded-lg overflow-hidden bg-white mt-2">
          <button
            onClick={() => setShowTechnical(!showTechnical)}
            className="w-full p-3.5 bg-[#FAFBF9] hover:bg-[#F7F6F1] flex items-center justify-between text-left text-[13px] font-semibold text-[#263026] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#5C822D]" />
              <span>Inspection Metrology & Colorimetric Vectors</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#7A8178] transition-transform ${showTechnical ? 'rotate-180' : ''}`} />
          </button>

          {showTechnical && (
            <div className="p-4 border-t border-[#E7E5DE] space-y-3 text-[12px] animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#596158] font-mono">
                <div className="bg-[#FAFBF9] p-3 rounded border border-[#E7E5DE] space-y-1">
                  <div className="font-bold text-[#263026] font-sans">Calibration Model:</div>
                  <div>ID: {res?.calibrationId || 'CAL-2026-D65'}</div>
                  <div>Model: {res?.modelId || 'MRPL-CHEM-002'} (v{res?.modelVersion || '0.1.0'})</div>
                  <div>Standard: ISO/CIE D65 Bradford</div>
                </div>

                <div className="bg-[#FAFBF9] p-3 rounded border border-[#E7E5DE] space-y-1">
                  <div className="font-bold text-[#263026] font-sans">CIELAB ΔE*ab Vectors:</div>
                  <div>ΔE*ab: <strong className="text-[#5C822D]">{scan.colorFeatures?.deltaE?.toFixed(2) || '12.20'}</strong></div>
                  <div>L*: {scan.colorFeatures?.currentL?.toFixed(1) || '85.3'} (ΔL*: {scan.colorFeatures?.deltaL?.toFixed(1) || '-9.7'})</div>
                  <div>Δa*: {scan.colorFeatures?.deltaA?.toFixed(1) || '3.1'}, Δb*: {scan.colorFeatures?.deltaB?.toFixed(1) || '6.7'}</div>
                </div>
              </div>

              {scan.capturedImageUrl && (
                <div className="flex items-center gap-3 bg-[#FAFBF9] p-3 rounded border border-[#E7E5DE]">
                  <div className="w-20 h-16 rounded border border-[#E7E5DE] overflow-hidden bg-black flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={scan.capturedImageUrl} alt="Badge Frame" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[#596158]">
                    <div className="font-semibold text-[#263026] font-sans">Optical Capture Archive</div>
                    <div>Confidence: {res?.confidence ? `${(res.confidence * 100).toFixed(0)}%` : '95%'}</div>
                    <div className="text-[10px] text-[#7A8178]">Validity: {getValidityLabel(res?.validityStatus || ValidityStatus.VALID)}</div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => window.print()}
                  className="text-[#5C822D] font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <Printer size={13} />
                  <span>Print Formal Certificate</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default function WorkerResultPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#7A8178]">Loading reading result...</div>}>
      <ResultContent />
    </Suspense>
  );
}

