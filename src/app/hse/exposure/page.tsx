'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ReferenceLine,
} from 'recharts';
import { Printer } from 'lucide-react';

export default function HSEExposurePage() {
  const { scans } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="text-[13px] text-[#7A8178]">Loading exposure analytics...</div>;

  const validScans = scans
    .filter(s => s.exposureResult?.estimatedDose !== null && s.exposureResult?.estimatedDose !== undefined)
    .sort((a, b) => new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime());

  const chartData = validScans.map((s, idx) => ({
    name: `Scan ${idx + 1}`,
    time: new Date(s.capturedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    dose: s.exposureResult?.estimatedDose || 0,
    twa: s.exposureResult?.estimatedTwa || 0,
    worker: s.workerId,
    risk: s.exposureResult?.riskStatus,
  }));

  const workerTotals: Record<string, { count: number; maxDose: number; sumDose: number }> = {};
  validScans.forEach(s => {
    const dose = s.exposureResult?.estimatedDose || 0;
    if (!workerTotals[s.workerId]) {
      workerTotals[s.workerId] = { count: 0, maxDose: 0, sumDose: 0 };
    }
    workerTotals[s.workerId].count += 1;
    workerTotals[s.workerId].sumDose += dose;
    workerTotals[s.workerId].maxDose = Math.max(workerTotals[s.workerId].maxDose, dose);
  });

  const workerBarData = Object.entries(workerTotals).map(([workerId, stats]) => ({
    workerId,
    avgDose: Math.round((stats.sumDose / stats.count) * 10) / 10,
    maxDose: stats.maxDose,
  }));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E5DE] pb-4">
        <div>
          <span className="text-[12px] font-bold text-[#5C822D] uppercase tracking-wider block">
            Exposure Analytics & Trends
          </span>
          <h1 className="text-[24px] font-bold text-[#263026]">
            Refinery Gas Dosimetry Analytics & 8h TWA Compliance
          </h1>
          <p className="text-[14px] text-[#596158] mt-0.5">
            Statistical distribution of H₂S cumulative dose relative to OSHA PEL (10 ppm) and ceiling limits
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="gov-btn-secondary text-[13px] h-9"
        >
          <Printer size={14} />
          <span>Print Analytics Audit</span>
        </button>
      </div>

      {/* Regulatory Limit Reference Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="gov-card p-4 space-y-1">
          <span className="text-[11px] text-[#7A8178] uppercase font-bold block">OSHA Permissible Limit (PEL)</span>
          <div className="text-[22px] font-bold text-[#263026] font-mono">10.0 ppm TWA</div>
          <span className="text-[12px] text-[#35551F]">8-Hour Time-Weighted Average Threshold</span>
        </div>

        <div className="gov-card p-4 space-y-1">
          <span className="text-[11px] text-[#7A8178] uppercase font-bold block">OSHA Critical Ceiling</span>
          <div className="text-[22px] font-bold text-[#A94442] font-mono">20.0 ppm·h</div>
          <span className="text-[12px] text-[#A94442]">Mandatory Immediate Area Evacuation</span>
        </div>

        <div className="gov-card p-4 space-y-1">
          <span className="text-[11px] text-[#7A8178] uppercase font-bold block">Color Calibration Space</span>
          <div className="text-[22px] font-bold text-[#5C822D] font-mono">ISO/CIE D65</div>
          <span className="text-[12px] text-[#596158]">4-Patch Bradford Chromatic Adaptation</span>
        </div>
      </div>

      {/* Primary Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Exposure Dose Progression Line Chart */}
        <div className="gov-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E5DE] pb-3">
            <div>
              <h2 className="text-[16px] font-bold text-[#263026]">Chronological Exposure Progression</h2>
              <p className="text-[12px] text-[#596158]">Measured cumulative dose ($D$) over logged shift scans</p>
            </div>
            <span className="gov-badge gov-badge-normal text-[11px]">ppm·h</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5DE" />
                <XAxis dataKey="time" stroke="#7A8178" fontSize={11} />
                <YAxis stroke="#7A8178" fontSize={11} domain={[0, 30]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E7E5DE', fontSize: '12px', borderRadius: '6px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <ReferenceLine y={10} stroke="#C96B32" strokeDasharray="4 4" label={{ value: 'OSHA PEL (10)', fill: '#C96B32', fontSize: 11 }} />
                <ReferenceLine y={20} stroke="#A94442" strokeDasharray="4 4" label={{ value: 'Ceiling (20)', fill: '#A94442', fontSize: 11 }} />
                <Line type="monotone" dataKey="dose" name="Measured Dose (ppm·h)" stroke="#5C822D" strokeWidth={2.5} dot={{ r: 4, fill: '#5C822D' }} />
                <Line type="monotone" dataKey="twa" name="8h TWA (ppm)" stroke="#35551F" strokeWidth={2} dot={{ r: 3, fill: '#35551F' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Worker Exposure Comparison Bar Chart */}
        <div className="gov-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E5DE] pb-3">
            <div>
              <h2 className="text-[16px] font-bold text-[#263026]">Peak vs. Average Worker Exposure</h2>
              <p className="text-[12px] text-[#596158]">Comparison across monitored shift operators</p>
            </div>
            <span className="gov-badge gov-badge-normal text-[11px]">PERSONNEL</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workerBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5DE" />
                <XAxis dataKey="workerId" stroke="#7A8178" fontSize={11} />
                <YAxis stroke="#7A8178" fontSize={11} domain={[0, 30]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E7E5DE', fontSize: '12px', borderRadius: '6px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <ReferenceLine y={20} stroke="#A94442" strokeDasharray="4 4" />
                <Bar dataKey="maxDose" name="Peak Dose (ppm·h)" fill="#5C822D" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgDose" name="Average Dose (ppm·h)" fill="#C8DEC0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
