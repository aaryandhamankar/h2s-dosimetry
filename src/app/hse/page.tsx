'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import { RiskStatus, AlertStatus, ValidityStatus } from '@/types';
import {
  Printer,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { formatDose, formatDateTime } from '@/lib/utils';

export default function HSEOverviewPage() {
  const { scans, alerts } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="text-[13px] text-[#7A8178]">Loading safety dashboard...</div>;
  }

  const validScans = scans.filter(s => s.exposureResult?.validityStatus === ValidityStatus.VALID);

  const riskCounts = {
    normal: scans.filter(s => s.exposureResult?.riskStatus === RiskStatus.NORMAL).length,
    elevated: scans.filter(s => s.exposureResult?.riskStatus === RiskStatus.ELEVATED).length,
    high: scans.filter(s => s.exposureResult?.riskStatus === RiskStatus.HIGH).length,
    critical: scans.filter(s => s.exposureResult?.riskStatus === RiskStatus.CRITICAL).length,
  };

  const openAlerts = alerts.filter(a => a.status === AlertStatus.OPEN);
  const uniqueWorkers = new Set(scans.map(s => s.workerId)).size;

  const recentScans = [...scans].sort((a, b) =>
    new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime()
  ).slice(0, 7);

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E5DE] pb-3 sm:pb-4">
        <div>
          <span className="text-[11px] sm:text-[12px] font-bold text-[#5C822D] uppercase tracking-wider block">
            Supervisory Command Center
          </span>
          <h1 className="text-[19px] sm:text-[24px] font-bold text-[#263026]">
            Refinery HSE Safety Overview
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#596158] mt-0.5">
            Mangalore Refinery and Petrochemicals Limited · Gas Surveillance Zone A
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => window.print()}
            className="gov-btn-secondary text-[12px] sm:text-[13px] h-9"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 4 Core Operational Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        
        <div className="gov-card p-3.5 sm:p-5 space-y-1 sm:space-y-2">
          <span className="text-[10px] sm:text-[12px] text-[#7A8178] font-semibold uppercase tracking-wider block truncate">
            Monitored Staff
          </span>
          <div className="text-[22px] sm:text-[28px] font-bold text-[#263026] font-mono">
            {uniqueWorkers || 5}
          </div>
          <span className="text-[11px] sm:text-[12px] text-[#596158] block truncate">
            Active Personnel
          </span>
        </div>

        <div className="gov-card p-3.5 sm:p-5 space-y-1 sm:space-y-2">
          <span className="text-[10px] sm:text-[12px] text-[#7A8178] font-semibold uppercase tracking-wider block truncate">
            Total Scans Logged
          </span>
          <div className="text-[22px] sm:text-[28px] font-bold text-[#5C822D] font-mono">
            {scans.length}
          </div>
          <span className="text-[11px] sm:text-[12px] text-[#35551F] font-semibold block truncate">
            {validScans.length} Valid ({((validScans.length / Math.max(1, scans.length)) * 100).toFixed(0)}%)
          </span>
        </div>

        <div className="gov-card p-3.5 sm:p-5 space-y-1 sm:space-y-2">
          <span className="text-[10px] sm:text-[12px] text-[#7A8178] font-semibold uppercase tracking-wider block truncate">
            Exceedance
          </span>
          <div className="text-[22px] sm:text-[28px] font-bold text-[#A94442] font-mono">
            {riskCounts.high + riskCounts.critical}
          </div>
          <span className="text-[11px] sm:text-[12px] text-[#A94442] font-semibold block truncate">
            {riskCounts.critical} Critical (&gt;20 ppm)
          </span>
        </div>

        <div className="gov-card p-3.5 sm:p-5 space-y-1 sm:space-y-2">
          <span className="text-[10px] sm:text-[12px] text-[#7A8178] font-semibold uppercase tracking-wider block truncate">
            Active Alerts
          </span>
          <div className="text-[22px] sm:text-[28px] font-bold text-[#C96B32] font-mono">
            {openAlerts.length}
          </div>
          <span className="text-[11px] sm:text-[12px] text-[#596158] block truncate">
            Require Action
          </span>
        </div>

      </div>

      {/* Safety Compliance Distribution & Active Alert Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Exposure Distribution Breakdown */}
        <div className="gov-card p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E5DE] pb-3">
            <h2 className="text-[15px] sm:text-[16px] font-bold text-[#263026]">
              Workforce Exposure Breakdown
            </h2>
            <span className="text-[11px] sm:text-[12px] text-[#7A8178]">Shift Summary</span>
          </div>

          <div className="space-y-3 text-[13px]">
            <div className="flex items-center justify-between p-2.5 rounded bg-[#FAFBF9] border border-[#E7E5DE]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#5C822D]" />
                <span className="font-semibold text-[#263026]">Normal (&lt;5 ppm·h)</span>
              </div>
              <span className="font-bold text-[#263026] font-mono">{riskCounts.normal}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-[#FAFBF9] border border-[#E7E5DE]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#C96B32]" />
                <span className="font-semibold text-[#263026]">Elevated (5–15 ppm·h)</span>
              </div>
              <span className="font-bold text-[#263026] font-mono">{riskCounts.elevated}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-[#FAFBF9] border border-[#E7E5DE]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#D47A32]" />
                <span className="font-semibold text-[#263026]">High (15–20 ppm·h)</span>
              </div>
              <span className="font-bold text-[#263026] font-mono">{riskCounts.high}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-[#FAFBF9] border border-[#E7E5DE]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#A94442]" />
                <span className="font-semibold text-[#263026]">Critical (&gt;20 ppm·h)</span>
              </div>
              <span className="font-bold text-[#263026] font-mono">{riskCounts.critical}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E7E5DE]">
            <Link
              href="/hse/exposure"
              className="text-[13px] text-[#5C822D] font-semibold hover:underline flex items-center justify-between"
            >
              <span>View Full Analytics Trends</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Real-Time Shift Scan Telemetry Table */}
        <div className="gov-card p-6 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#E7E5DE] pb-3">
            <h2 className="text-[16px] font-bold text-[#263026]">
              Real-Time Personnel Verification Feed
            </h2>
            <Link
              href="/hse/workers"
              className="text-[12px] text-[#5C822D] font-semibold hover:underline"
            >
              View Roster →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#E7E5DE] text-[#7A8178] text-[12px] uppercase">
                  <th className="pb-2 font-semibold">Timestamp</th>
                  <th className="pb-2 font-semibold">Worker</th>
                  <th className="pb-2 font-semibold">Badge</th>
                  <th className="pb-2 font-semibold">Dose</th>
                  <th className="pb-2 font-semibold">8h TWA</th>
                  <th className="pb-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5DE]">
                {recentScans.map(s => {
                  const r = s.exposureResult;
                  return (
                    <tr key={s.id} className="hover:bg-[#FAFBF9]">
                      <td className="py-2.5 text-[#596158] font-mono text-[12px]">
                        {formatDateTime(s.capturedAt)}
                      </td>
                      <td className="py-2.5 font-semibold text-[#263026]">
                        {s.workerId}
                      </td>
                      <td className="py-2.5 text-[#596158] font-mono">
                        {s.dosimeterId}
                      </td>
                      <td className="py-2.5 font-bold text-[#263026] font-mono">
                        {r?.estimatedDose !== null && r?.estimatedDose !== undefined
                          ? `${formatDose(r.estimatedDose)} ${r.doseUnit}`
                          : 'Unverified'}
                      </td>
                      <td className="py-2.5 text-[#596158] font-mono">
                        {r?.estimatedTwa !== null && r?.estimatedTwa !== undefined
                          ? `${formatDose(r.estimatedTwa)} ppm`
                          : '—'}
                      </td>
                      <td className="py-2.5">
                        <span className={`gov-badge ${
                          r?.riskStatus === RiskStatus.NORMAL
                            ? 'gov-badge-normal'
                            : r?.riskStatus === RiskStatus.ELEVATED
                            ? 'gov-badge-elevated'
                            : r?.riskStatus === RiskStatus.HIGH
                            ? 'gov-badge-high'
                            : 'gov-badge-critical'
                        } text-[11px]`}>
                          {r?.riskStatus || 'UNVERIFIED'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-[#E7E5DE] flex justify-end">
            <Link
              href="/hse/technical"
              className="text-[13px] text-[#5C822D] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Inspect Metrology Calibration Space</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
