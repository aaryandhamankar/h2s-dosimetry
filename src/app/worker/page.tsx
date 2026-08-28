'use client';

import { useAppStore } from '@/stores/app-store';
import { 
  Camera, 
  Play, 
  Square, 
  ArrowRight, 
  Layers, 
  FileCheck
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatTime, formatDateTime, formatDose } from '@/lib/utils';
import { RiskStatus, ShiftStatus } from '@/types';
import Link from 'next/link';

export default function WorkerHome() {
  const { currentUser, activeShift, activeDosimeter, scans, startShift, endShift } = useAppStore();
  const [elapsed, setElapsed] = useState('');

  const latestScan = scans.length > 0 ? scans[0] : null;

  useEffect(() => {
    if (activeShift?.startTime && activeShift.status === ShiftStatus.ACTIVE) {
      const updateElapsed = () => {
        const start = new Date(activeShift.startTime).getTime();
        const now = new Date().getTime();
        const diffMs = Math.max(0, now - start);
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffMins = Math.floor((diffMs % 3600000) / 60000);
        setElapsed(`${diffHrs}h ${diffMins}m`);
      };
      updateElapsed();
      const interval = setInterval(updateElapsed, 60000);
      return () => clearInterval(interval);
    } else {
      setElapsed('');
    }
  }, [activeShift]);

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Welcome & Shift Status Banner */}
      <div className="gov-card p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E5DE] pb-4">
          <div>
            <span className="text-[11px] sm:text-[12px] font-bold text-[#5C822D] uppercase tracking-wider block">
              MRPL Field Operator Terminal
            </span>
            <h1 className="text-[18px] sm:text-[22px] font-bold text-[#263026]">
              Welcome, {currentUser?.displayName || 'Rajesh Kumar'}
            </h1>
            <p className="text-[13px] sm:text-[14px] text-[#596158] mt-0.5">
              Assigned Plant Area: <strong>Refinery Zone A (MRPL-1042)</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeShift?.status === ShiftStatus.ACTIVE ? (
              <span className="gov-badge gov-badge-normal text-[11px] sm:text-[12px]">
                <span className="w-2 h-2 rounded-full bg-[#5C822D] animate-pulse" />
                ACTIVE SHIFT ({elapsed || 'Ongoing'})
              </span>
            ) : (
              <span className="gov-badge gov-badge-neutral text-[11px] sm:text-[12px]">
                NO ACTIVE SHIFT
              </span>
            )}
          </div>
        </div>

        {/* Shift Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-[#FAFBF9] p-3.5 sm:p-4 rounded-md border border-[#E7E5DE] flex items-center justify-between">
            <div>
              <div className="text-[11px] sm:text-[12px] text-[#7A8178] font-medium">Shift Commencement:</div>
              <div className="font-bold text-[14px] sm:text-[15px] text-[#263026]">
                {activeShift?.startTime ? formatTime(activeShift.startTime) : 'Not Started'}
              </div>
            </div>

            {activeShift?.status === ShiftStatus.ACTIVE ? (
              <button
                onClick={() => endShift()}
                className="gov-btn-danger h-9 px-3 text-[12px] sm:text-[13px]"
              >
                <Square className="w-3.5 h-3.5" />
                <span>End Shift</span>
              </button>
            ) : (
              <button
                onClick={() => startShift()}
                className="gov-btn-primary h-9 px-3 text-[12px] sm:text-[13px]"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Start Shift</span>
              </button>
            )}
          </div>

          <div className="bg-[#FAFBF9] p-3.5 sm:p-4 rounded-md border border-[#E7E5DE] flex items-center justify-between">
            <div>
              <div className="text-[11px] sm:text-[12px] text-[#7A8178] font-medium">Assigned Dosimeter:</div>
              <div className="font-bold text-[14px] sm:text-[15px] text-[#263026]">
                {activeDosimeter?.dosimeterCode || 'DOS-001'}
              </div>
            </div>
            <span className="gov-badge gov-badge-normal text-[11px] sm:text-[12px]">
              Active & Valid
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action: Large Scan Button */}
      <div className="gov-card p-5 sm:p-6 text-center space-y-3 sm:space-y-4">
        <div className="max-w-md mx-auto space-y-1.5 sm:space-y-2">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#263026]">
            Perform Optical Exposure Reading
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#596158]">
            Hold your smartphone camera over the wristband sensor to capture photo and calculate exposure level.
          </p>
        </div>

        <div className="pt-1 sm:pt-2">
          <Link
            href="/worker/scan"
            className="gov-btn-primary w-full sm:w-auto h-12 px-6 sm:px-8 text-[14px] sm:text-[15px] font-semibold inline-flex items-center justify-center gap-2.5 shadow-sm"
          >
            <Camera className="w-5 h-5" />
            <span>SCAN WEARABLE BADGE NOW</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Latest Verified Result Summary (if available) */}
      {latestScan && (
        <div className="gov-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E5DE] pb-3">
            <h3 className="text-[15px] font-bold text-[#263026] flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#5C822D]" />
              <span>Latest Verified Shift Reading</span>
            </h3>
            <span className="text-[12px] text-[#7A8178]">
              {formatDateTime(latestScan.capturedAt)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#FAFBF9] p-4 rounded-md border border-[#E7E5DE]">
              <div className="text-[12px] text-[#7A8178]">Measured Dose:</div>
              <div className="text-[22px] font-bold text-[#263026]">
                {latestScan.exposureResult?.estimatedDose !== null && latestScan.exposureResult?.estimatedDose !== undefined
                  ? `${formatDose(latestScan.exposureResult.estimatedDose)} ${latestScan.exposureResult.doseUnit}`
                  : 'Unverified'}
              </div>
            </div>

            <div className="bg-[#FAFBF9] p-4 rounded-md border border-[#E7E5DE]">
              <div className="text-[12px] text-[#7A8178]">8-Hour TWA Level:</div>
              <div className="text-[22px] font-bold text-[#263026]">
                {latestScan.exposureResult?.estimatedTwa !== null && latestScan.exposureResult?.estimatedTwa !== undefined
                  ? `${formatDose(latestScan.exposureResult.estimatedTwa)} ${latestScan.exposureResult.twaUnit}`
                  : 'N/A'}
              </div>
            </div>

            <div className="bg-[#FAFBF9] p-4 rounded-md border border-[#E7E5DE] flex flex-col justify-between">
              <div className="text-[12px] text-[#7A8178]">Compliance Classification:</div>
              <div>
                <span className={`gov-badge ${
                  latestScan.exposureResult?.riskStatus === RiskStatus.NORMAL
                    ? 'gov-badge-normal'
                    : latestScan.exposureResult?.riskStatus === RiskStatus.ELEVATED
                    ? 'gov-badge-elevated'
                    : 'gov-badge-critical'
                } text-[13px]`}>
                  {latestScan.exposureResult?.riskStatus || 'VERIFIED'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Link
              href={`/worker/result?scanId=${latestScan.id}`}
              className="text-[13px] text-[#5C822D] font-semibold hover:underline flex items-center gap-1"
            >
              <span>View Full Reading Certificate</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* Hardware Specifications Panel */}
      <div className="gov-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E7E5DE] pb-3">
          <span className="font-bold text-[14px] text-[#263026] uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#5C822D]" /> Assigned Hardware: {activeDosimeter?.dosimeterCode || 'DOS-001'}
          </span>
          <span className="gov-badge gov-badge-normal text-[11px]">BATCH-2026-A</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAFBF9] p-4 rounded-md border border-[#E7E5DE] text-[13px]">
          <div className="space-y-1">
            <div className="text-[#7A8178]">Active Substrate:</div>
            <div className="font-bold text-[#263026]">Copper-PAN & Bismuth(III) Chemosensor</div>
            <div className="text-[12px] text-[#596158]">Rx: Cu-PAN / Bi³⁺ + H₂S → CuS / Bi₂S₃↓ (Lead-Free)</div>
          </div>

          <div className="space-y-1">
            <div className="text-[#7A8178]">4-Patch Reference Bar:</div>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-5 h-4 bg-[#FFFFFF] border border-[#ADB5BD] rounded-xs shadow-2xs" title="White (L*=100)" />
              <span className="w-5 h-4 bg-[#7F7F7F] border border-[#6C757D] rounded-xs shadow-2xs" title="Neutral Gray (L*=50)" />
              <span className="w-5 h-4 bg-[#00A3E0] border border-[#0080B0] rounded-xs shadow-2xs" title="Cyan" />
              <span className="w-5 h-4 bg-[#EC008C] border border-[#C00070] rounded-xs shadow-2xs" title="Magenta" />
              <span className="text-[12px] text-[#596158] ml-2">CIE Standard D65</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
