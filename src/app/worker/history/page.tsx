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
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[12px] font-bold text-[#5C822D] uppercase tracking-wider block">
            Occupational Dossier
          </span>
          <h1 className="text-[22px] font-bold text-[#263026]">Personal Exposure History Ledger</h1>
          <p className="text-[14px] text-[#596158]">Official chronological ledger of personal dosimeter readings & captured photo archives</p>
        </div>
        <span className="gov-badge gov-badge-normal text-[12px]">
          {userScans.length} Total Records
        </span>
      </div>

      {/* History Records List */}
      {userScans.length === 0 ? (
        <div className="gov-card p-10 text-center space-y-3">
          <History className="w-10 h-10 text-[#7A8178] mx-auto" />
          <h2 className="text-[16px] font-bold text-[#263026]">No Exposure Records Found</h2>
          <p className="text-[14px] text-[#596158] max-w-sm mx-auto">
            You have not recorded any dosimeter readings yet. Use the Scan Dosimeter tab at the conclusion of your shift.
          </p>
        </div>
      ) : (
        <div className="gov-card overflow-hidden">
          <div className="p-4 border-b border-[#E7E5DE] bg-[#FAFBF9] text-[13px] font-bold text-[#263026] uppercase tracking-wider flex items-center justify-between">
            <span>Verified Shift History</span>
            <span className="text-[#7A8178]">Ordered by Date (Newest First)</span>
          </div>

          <div className="divide-y divide-[#E7E5DE]">
            {userScans.map((scan) => {
              const res = scan.exposureResult;
              const isValid = res?.validityStatus === ValidityStatus.VALID;

              let badge = <span className="gov-badge gov-badge-normal text-[12px]">Normal</span>;
              if (res?.riskStatus === RiskStatus.ELEVATED) {
                badge = <span className="gov-badge gov-badge-elevated text-[12px]">Elevated</span>;
              } else if (res?.riskStatus === RiskStatus.HIGH) {
                badge = <span className="gov-badge gov-badge-high text-[12px]">High</span>;
              } else if (res?.riskStatus === RiskStatus.CRITICAL) {
                badge = <span className="gov-badge gov-badge-critical text-[12px]">Critical</span>;
              } else if (!isValid) {
                badge = <span className="gov-badge gov-badge-neutral text-[12px]">Unverified</span>;
              }

              return (
                <Link
                  key={scan.id}
                  href={`/worker/result?scanId=${scan.id}`}
                  className="p-4 sm:p-5 flex items-center justify-between hover:bg-[#FAFBF9] transition-colors block group"
                >
                  <div className="flex items-center gap-4">
                    {/* Badge Snapshot thumbnail */}
                    {scan.capturedImageUrl ? (
                      <div className="w-14 h-11 rounded border border-[#E7E5DE] overflow-hidden bg-black flex-shrink-0 shadow-2xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={scan.capturedImageUrl} alt="Badge Thumbnail" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded bg-[#F7F6F1] border border-[#E7E5DE] flex items-center justify-center text-[#7A8178] flex-shrink-0">
                        <Camera size={18} />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="font-semibold text-[15px] text-[#263026] group-hover:text-[#5C822D]">
                        {formatDateTime(scan.capturedAt)}
                      </div>
                      <div className="text-[13px] text-[#596158] font-mono">
                        Badge ID: <strong className="text-[#263026]">{scan.dosimeterId}</strong> · Scan: {scan.id.substring(0, 14)}...
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[17px] font-bold text-[#263026] font-mono">
                        {res?.estimatedDose !== null && res?.estimatedDose !== undefined
                          ? `${formatDose(res.estimatedDose)} ${res.doseUnit}`
                          : 'Unverified'}
                      </div>
                      <div className="text-[12px] text-[#7A8178]">
                        8h TWA: {res?.estimatedTwa !== null && res?.estimatedTwa !== undefined ? `${formatDose(res.estimatedTwa)} ppm` : 'N/A'}
                      </div>
                    </div>

                    {badge}

                    <ChevronRight size={16} className="text-[#7A8178] group-hover:text-[#5C822D] hidden sm:inline" />
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
