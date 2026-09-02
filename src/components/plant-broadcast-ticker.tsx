'use client';

import { useAppStore } from '@/stores/app-store';
import { AlertStatus } from '@/types';
import { AlertTriangle, ShieldCheck, Thermometer } from 'lucide-react';
import Link from 'next/link';

export function PlantBroadcastTicker() {
  const { alerts } = useAppStore();
  const openAlerts = alerts.filter(a => a.status === AlertStatus.OPEN);

  return (
    <div className="bg-[#EDF2E8] border-b border-[#DCE3D4] text-[11px] px-4 sm:px-8 py-1 text-[#475440]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 h-5">
        
        {/* Left: Plant Telemetry */}
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex items-center gap-1.5 font-bold text-[#2E4415] whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#557A2B] animate-pulse" />
            <span>Facility Zone A Refinery Unit: Operational</span>
          </span>

          <span className="text-[#C8D8B8] hidden sm:inline">•</span>

          <span className="hidden sm:flex items-center gap-1 text-[#475440] whitespace-nowrap text-[10px]">
            <Thermometer size={11} className="text-[#557A2B]" />
            <span>29°C · 78% RH</span>
          </span>

          <span className="text-[#C8D8B8] hidden md:inline">•</span>

          <span className="hidden md:inline text-[10px] text-[#73826C] whitespace-nowrap">
            Standard: <strong>Cu-PAN / Bi(III) D65</strong>
          </span>
        </div>

        {/* Right: Alert Status / Safe Seal */}
        <div className="flex-shrink-0">
          {openAlerts.length > 0 ? (
            <Link
              href="/hse"
              className="flex items-center gap-1 text-[10px] font-bold text-[#C53030] hover:underline bg-[#FFF5F5] px-2 py-0.2 rounded border border-[#FEB2B2]"
            >
              <AlertTriangle size={11} className="text-[#C53030]" />
              <span>{openAlerts.length} Active Alert{openAlerts.length > 1 ? 's' : ''}</span>
            </Link>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-[#3E7A24] font-bold">
              <ShieldCheck size={12} />
              <span className="hidden sm:inline">All Personnel Nominal (&lt;10 ppm)</span>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
