'use client';

import { useAppStore } from '@/stores/app-store';
import { ChevronRight, History, Camera } from 'lucide-react';
import { formatDateTime, formatDose } from '@/lib/utils';
import { ValidityStatus, RiskStatus } from '@/types';
import Link from 'next/link';

export default function HistoryPage() {
  const { scans, currentUser } = useAppStore();

  const userScans = scans
    .filter(s => !currentUser || s.workerId === currentUser.id)
    .sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime());

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E5DE] pb-3 sm:pb-4">
        <div>
          <span className="text-[11px] sm:text-[12px] font-bold text-[#5C822D] uppercase tracking-wider block">
            Occupational Dossier
          </span>
          <h1 className="text-[18px] sm:text-[22px] font-bold text-[#263026]">Personal Exposure History Ledger</h1>
          <p className="text-[13px] sm:text-[14px] text-[#596158]">Official chronological ledger of personal dosimeter readings</p>
        </div>
        <span className="gov-badge gov-badge-normal text-[11px] sm:text-[12px] self-start sm:self-auto">
          {userScans.length} Total Records
        </span>
      </div>

      {/* History Records List */}
      {userScans.length === 0 ? (
        <div className="gov-card p-6 sm:p-10 text-center space-y-3">
          <History className="w-8 sm:w-10 h-8 sm:h-10 text-[#7A8178] mx-auto" />
          <h2 className="text-[15px] sm:text-[16px] font-bold text-[#263026]">No Exposure Records Found</h2>
          <p className="text-[13px] sm:text-[14px] text-[#596158] max-w-sm mx-auto">
            You have not recorded any dosimeter readings yet. Use the Scan Dosimeter tab at the conclusion of your shift.
          </p>
        </div>
      ) : (
        <div className="gov-card overflow-hidden">
          <div className="p-3.5 sm:p-4 border-b border-[#E7E5DE] bg-[#FAFBF9] text-[12px] sm:text-[13px] font-bold text-[#263026] uppercase tracking-wider flex items-center justify-between">
            <span>Verified Shift History</span>
            <span className="text-[#7A8178] text-[11px] sm:text-[12px]">Newest First</span>
          </div>

          <div className="divide-y divide-[#E7E5DE]">
            {userScans.map((scan) => {
              const res = scan.exposureResult;
              const isValid = res?.validityStatus === ValidityStatus.VALID;

              let badge = <span className="gov-badge gov-badge-normal text-[11px]">Normal</span>;
              if (res?.riskStatus === RiskStatus.ELEVATED) {
                badge = <span className="gov-badge gov-badge-elevated text-[11px]">Elevated</span>;
              } else if (res?.riskStatus === RiskStatus.HIGH) {
                badge = <span className="gov-badge gov-badge-high text-[11px]">High</span>;
              } else if (res?.riskStatus === RiskStatus.CRITICAL) {
                badge = <span className="gov-badge gov-badge-critical text-[11px]">Critical</span>;
              } else if (!isValid) {
                badge = <span className="gov-badge gov-badge-neutral text-[11px]">Unverified</span>;
              }

              return (
                <Link
                  key={scan.id}
                  href={`/worker/result?scanId=${scan.id}`}
                  className="p-3.5 sm:p-5 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 hover:bg-[#FAFBF9] transition-colors block group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Badge Snapshot thumbnail */}
                    {scan.capturedImageUrl ? (
                      <div className="w-12 sm:w-14 h-10 sm:h-11 rounded border border-[#E7E5DE] overflow-hidden bg-black flex-shrink-0 shadow-2xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={scan.capturedImageUrl} alt="Badge Thumbnail" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 sm:w-11 h-10 sm:h-11 rounded bg-[#F7F6F1] border border-[#E7E5DE] flex items-center justify-center text-[#7A8178] flex-shrink-0">
                        <Camera size={16} />
                      </div>
                    )}

                    <div className="space-y-0.5 min-w-0">
                      <div className="font-semibold text-[13px] sm:text-[15px] text-[#263026] group-hover:text-[#5C822D] truncate">
                        {formatDateTime(scan.capturedAt)}
                      </div>
                      <div className="text-[11px] sm:text-[12px] text-[#596158] font-mono truncate">
                        Badge: <strong className="text-[#263026]">{scan.dosimeterId}</strong> · ID: {scan.id.substring(0, 10)}...
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between xs:justify-end gap-3 w-full xs:w-auto pt-2 xs:pt-0 border-t xs:border-t-0 border-[#F0EFE9]">
                    <div className="text-left xs:text-right">
                      <div className="text-[15px] sm:text-[17px] font-bold text-[#263026] font-mono">
                        {res?.estimatedDose !== null && res?.estimatedDose !== undefined
                          ? `${formatDose(res.estimatedDose)} ${res.doseUnit}`
                          : 'Unverified'}
                      </div>
                      <div className="text-[11px] text-[#7A8178]">
                        8h TWA: {res?.estimatedTwa !== null && res?.estimatedTwa !== undefined ? `${formatDose(res.estimatedTwa)} ppm` : 'N/A'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {badge}
                      <ChevronRight size={16} className="text-[#7A8178] group-hover:text-[#5C822D] hidden sm:inline" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
