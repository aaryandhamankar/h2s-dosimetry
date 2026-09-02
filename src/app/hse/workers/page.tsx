'use client';

import { useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import { DEMO_WORKERS } from '@/data/demo-workers';
import { RiskStatus } from '@/types';
import Link from 'next/link';
import { formatDose, formatDateTime } from '@/lib/utils';
import { useMounted } from '@/hooks/use-mounted';

export default function HSEWorkersPage() {
  const { scans } = useAppStore();
  const [selectedWorker, setSelectedWorker] = useState<string | null>(DEMO_WORKERS[0]?.id || null);
  const mounted = useMounted();

  if (!mounted) return <div className="text-[13px] text-[#7A8178]">Loading personnel directory...</div>;

  const allWorkerMap = new Map<string, { id: string; displayName: string; workerCode: string; department: string; site: string }>();

  DEMO_WORKERS.forEach(w => {
    allWorkerMap.set(w.id, {
      id: w.id,
      displayName: w.displayName,
      workerCode: w.workerCode,
      department: w.department,
      site: w.site,
    });
  });

  scans.forEach(s => {
    if (s.workerId && !allWorkerMap.has(s.workerId)) {
      allWorkerMap.set(s.workerId, {
        id: s.workerId,
        displayName: s.workerName || s.workerId,
        workerCode: s.workerId.toUpperCase(),
        department: 'Operations',
        site: s.location || 'Refinery Zone A',
      });
    }
  });

  const workerStats = Array.from(allWorkerMap.values()).map(worker => {
    const workerScans = scans.filter(s => s.workerId === worker.id);
    const latestScan = workerScans.sort((a, b) =>
      new Date(b.capturedAt || b.timestamp || 0).getTime() - new Date(a.capturedAt || a.timestamp || 0).getTime()
    )[0];

    return {
      ...worker,
      totalScans: workerScans.length,
      latestScan,
      latestDose: latestScan?.h2sReading ?? latestScan?.exposureResult?.estimatedDose ?? null,
      latestRisk: latestScan?.riskLevel ?? latestScan?.exposureResult?.riskStatus ?? null,
      latestTime: latestScan?.capturedAt ?? latestScan?.timestamp ?? null,
      latestShift: latestScan?.shiftName ?? 'Shift A (Morning)',
    };
  });

  const selected = selectedWorker ? workerStats.find(w => w.id === selectedWorker) : workerStats[0];
  const selectedScans = selectedWorker
    ? scans.filter(s => s.workerId === selectedWorker).sort((a, b) =>
        new Date(b.capturedAt || b.timestamp || 0).getTime() - new Date(a.capturedAt || a.timestamp || 0).getTime()
      )
    : [];

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header */}
      <div className="border-b border-[#E7E5DE] pb-3 sm:pb-4">
        <span className="text-[11px] sm:text-[12px] font-bold text-[#5C822D] uppercase tracking-wider block">
          Personnel Roster
        </span>
        <h1 className="text-[18px] sm:text-[24px] font-bold text-[#263026]">Monitored Workforce Roster</h1>
        <p className="text-[13px] sm:text-[14px] text-[#596158]">Individual worker exposure records, assigned cartridges, and shift compliance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Worker Roster Column */}
        <div className="lg:col-span-5 gov-card overflow-hidden">
          <div className="p-3.5 sm:p-4 border-b border-[#E7E5DE] bg-[#FAFBF9] flex items-center justify-between text-[12px] sm:text-[13px]">
            <span className="font-bold text-[#263026] uppercase tracking-wider">
              Assigned Personnel ({workerStats.length})
            </span>
            <span className="text-[#7A8178]">Facility Zone A</span>
          </div>

          <div className="divide-y divide-[#E7E5DE]">
            {workerStats.map(w => {
              const isSelected = w.id === selectedWorker;
              return (
                <button
                  key={w.id}
                  onClick={() => setSelectedWorker(w.id)}
                  className={`w-full p-3 sm:p-4 flex items-center justify-between text-left transition-all ${
                    isSelected
                      ? 'bg-[#EEF3E7] border-l-4 border-[#5C822D]'
                      : 'hover:bg-[#FAFBF9]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className={`w-9 sm:w-10 h-9 sm:h-10 rounded-md flex items-center justify-center font-bold text-[13px] sm:text-[14px] flex-shrink-0 ${
                      isSelected ? 'bg-[#5C822D] text-white' : 'bg-[#F7F6F1] text-[#263026] border border-[#E7E5DE]'
                    }`}>
                      {w.displayName.split(' ').map(n => n[0]).join('')}
                    </div>

                    <div className="min-w-0">
                      <div className="font-bold text-[14px] sm:text-[15px] text-[#263026] truncate">{w.displayName}</div>
                      <div className="text-[11px] sm:text-[12px] text-[#596158] truncate">
                        {w.workerCode} · {w.department}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 pl-2">
                    <div className="font-bold text-[13px] sm:text-[14px] text-[#263026] font-mono">
                      {w.latestDose !== null ? `${formatDose(w.latestDose)} ppm·h` : '—'}
                    </div>
                    <span className={`gov-badge ${
                      w.latestRisk === RiskStatus.NORMAL
                        ? 'gov-badge-normal'
                        : w.latestRisk === RiskStatus.ELEVATED
                        ? 'gov-badge-elevated'
                        : w.latestRisk === RiskStatus.HIGH
                        ? 'gov-badge-high'
                        : 'gov-badge-critical'
                    } text-[9px] sm:text-[10px]`}>
                      {w.latestRisk || 'NO DATA'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Worker Dossier Column */}
        {selected && (
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            
            {/* Worker Profile Card */}
            <div className="gov-card p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E5DE] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-md bg-[#5C822D] text-white flex items-center justify-center font-bold text-[15px] sm:text-[16px] flex-shrink-0">
                    {selected.displayName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-[17px] sm:text-[18px] font-bold text-[#263026]">{selected.displayName}</h2>
                    <p className="text-[12px] sm:text-[13px] text-[#596158]">
                      ID: <strong>{selected.workerCode}</strong> · Unit: <strong>{selected.department}</strong>
                    </p>
                  </div>
                </div>

                <span className="gov-badge gov-badge-normal text-[11px] sm:text-[12px] self-start sm:self-auto">
                  ACTIVE ON SHIFT
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 sm:gap-3 text-[13px]">
                <div className="bg-[#FAFBF9] p-3 sm:p-3.5 rounded border border-[#E7E5DE]">
                  <span className="text-[#7A8178] text-[10px] sm:text-[11px] uppercase font-bold block">Assigned Cartridge</span>
                  <span className="font-bold text-[#263026] text-[14px] sm:text-[15px] font-mono mt-0.5 block">
                    {selected.latestScan?.dosimeterCode || selected.latestScan?.dosimeterId || 'DOS-001'}
                  </span>
                </div>
                <div className="bg-[#FAFBF9] p-3 sm:p-3.5 rounded border border-[#E7E5DE]">
                  <span className="text-[#7A8178] text-[10px] sm:text-[11px] uppercase font-bold block">Active Shift</span>
                  <span className="font-bold text-[#263026] text-[13px] sm:text-[14px] mt-0.5 block truncate">
                    {selected.latestScan?.shiftName || selected.latestShift || 'Shift A (Morning)'}
                  </span>
                </div>
                <div className="bg-[#FAFBF9] p-3 sm:p-3.5 rounded border border-[#E7E5DE]">
                  <span className="text-[#7A8178] text-[10px] sm:text-[11px] uppercase font-bold block">Total Shift Scans</span>
                  <span className="font-bold text-[#263026] text-[14px] sm:text-[15px] font-mono mt-0.5 block">
                    {selected.totalScans}
                  </span>
                </div>
                <div className="bg-[#FAFBF9] p-3 sm:p-3.5 rounded border border-[#E7E5DE]">
                  <span className="text-[#7A8178] text-[10px] sm:text-[11px] uppercase font-bold block">Cumulative Dose</span>
                  <span className="font-bold text-[#5C822D] text-[14px] sm:text-[15px] font-mono mt-0.5 block">
                    {selected.latestDose !== null ? `${formatDose(selected.latestDose, 1)} ppm·h` : '0.0 ppm·h'}
                  </span>
                </div>
              </div>
            </div>

            {/* Individual Worker Scan History Ledger */}
            <div className="gov-card overflow-hidden">
              <div className="p-4 border-b border-[#E7E5DE] bg-[#FAFBF9] flex items-center justify-between text-[13px]">
                <span className="font-bold text-[#263026] uppercase tracking-wider">
                  Verified Scan Ledger ({selectedScans.length})
                </span>
                <span className="text-[#7A8178]">Lead-Free Cu-PAN / Bi(III)</span>
              </div>

              {selectedScans.length === 0 ? (
                <div className="p-8 text-center text-[13px] text-[#7A8178]">
                  No scans recorded for this operator yet.
                </div>
              ) : (
                <div className="divide-y divide-[#E7E5DE]">
                  {selectedScans.map(s => {
                    const r = s.exposureResult;
                    const dose = s.h2sReading ?? r?.estimatedDose;
                    return (
                      <div key={s.id} className="p-4 flex items-center justify-between hover:bg-[#FAFBF9]">
                        <div className="space-y-0.5">
                          <div className="font-bold text-[14px] text-[#263026] flex items-center gap-2">
                            <span>{formatDateTime(s.capturedAt || s.timestamp || '')}</span>
                            <span className="text-[10px] font-mono font-medium text-[#5C822D] bg-[#EDF3E4] px-1.5 py-0.2 rounded">
                              {s.shiftName || 'Shift A'}
                            </span>
                          </div>
                          <div className="text-[12px] text-[#596158] font-mono">
                            Badge: {s.dosimeterCode || s.dosimeterId} · ID: {s.id.substring(0, 14)}...
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-bold text-[15px] text-[#263026] font-mono">
                              {dose !== null && dose !== undefined
                                ? `${formatDose(dose, 1)} ${s.doseUnit || r?.doseUnit || 'ppm·h'}`
                                : 'Unverified'}
                            </div>
                            <div className="text-[11px] text-[#7A8178]">
                              8h TWA: {r?.estimatedTwa !== null && r?.estimatedTwa !== undefined ? `${formatDose(r.estimatedTwa, 1)} ppm` : '—'}
                            </div>
                          </div>

                          <Link
                            href={`/worker/result?scanId=${s.id}`}
                            className="gov-btn-secondary text-[12px] h-8 px-2.5"
                          >
                            Inspect
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
