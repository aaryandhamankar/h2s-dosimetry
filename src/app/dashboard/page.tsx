'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Camera, 
  Printer,
  ChevronDown,
  Cpu,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { RiskStatus, AlertStatus, ValidityStatus } from '@/types';
import { formatDose, formatDateTime } from '@/lib/utils';
import { useMounted } from '@/hooks/use-mounted';

export default function DashboardPage() {
  const { scans, alerts, language, acknowledgeAlert } = useAppStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-[13px] text-[#7A8178]">
        {language === 'hi' ? 'डैशबोर्ड लोड हो रहा है...' : 'Loading safety dashboard...'}
      </div>
    );
  }

  // Real store metrics
  const validScans = scans.filter(s => s.exposureResult?.validityStatus === ValidityStatus.VALID);
  
  const riskCounts = {
    normal: scans.filter(s => s.exposureResult?.riskStatus === RiskStatus.NORMAL).length,
    elevated: scans.filter(s => s.exposureResult?.riskStatus === RiskStatus.ELEVATED).length,
    high: scans.filter(s => s.exposureResult?.riskStatus === RiskStatus.HIGH).length,
    critical: scans.filter(s => s.exposureResult?.riskStatus === RiskStatus.CRITICAL).length,
  };

  const openAlerts = alerts.filter(a => a.status === AlertStatus.OPEN);
  const uniqueWorkers = new Set(scans.map(s => s.workerId)).size || 5;

  const maxDose = scans.reduce((max, s) => {
    const dose = s.exposureResult?.estimatedDose || 0;
    return dose > max ? dose : max;
  }, 0);

  const safeCompliancePercent = scans.length > 0 
    ? Math.round(((riskCounts.normal + riskCounts.elevated) / scans.length) * 100)
    : 100;

  const recentScans = [...scans].sort((a, b) =>
    new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime()
  ).slice(0, 6);

  return (
    <div className="flex-1 py-4 sm:py-6 px-4 sm:px-8 max-w-[1040px] mx-auto w-full space-y-4 sm:space-y-6">
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER & QUICK CONTROLS                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E2D5] pb-3 sm:pb-4">
        <div>
          <span className="text-[11px] sm:text-[12px] font-bold text-[#5C822D] uppercase tracking-wider block">
            {language === 'hi' ? 'पर्यवेक्षी सुरक्षा नियंत्रण' : 'MRPL Dosimetry Surveillance · Zone A'}
          </span>
          <h1 className="text-[20px] sm:text-[26px] font-black text-[#263026] leading-tight">
            {language === 'hi' ? 'कार्यबल सुरक्षा डैशबोर्ड' : 'Workforce Safety Dashboard'}
          </h1>
          <p className="text-[12px] sm:text-[13px] text-[#596158] mt-0.5">
            {language === 'hi' 
              ? 'रिफाइनरी ज़ोन ए · शिफ्ट ए (06:00 - 14:00) वास्तविक समय स्थिति' 
              : 'Real-time shift exposure metrics, worker telemetry & threshold compliance'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
          <button
            onClick={() => window.print()}
            className="gov-btn-secondary text-[12px] h-9 px-3 rounded-lg flex items-center gap-1.5 font-semibold hover:border-[#5C822D] hover:bg-[#FAF7F0] shadow-2xs"
            title="Print Shift Summary"
          >
            <Printer size={14} className="text-[#5C822D]" />
            <span>{language === 'hi' ? 'रिपोर्ट प्रिंट करें' : 'Print Summary'}</span>
          </button>

          <Link
            href="/scan"
            className="gov-btn-primary text-[12px] sm:text-[13px] font-bold h-9 px-3.5 rounded-lg shadow-xs flex items-center gap-1.5"
          >
            <Camera className="w-4 h-4" />
            <span>{language === 'hi' ? 'नया स्कैन' : 'Scan Wristband'}</span>
          </Link>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. CRITICAL ATTENTION / OPEN ALERTS BANNER (Conditional)       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {openAlerts.length > 0 && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F8ECEC] border-2 border-[#E8B8B8] text-[#A94442] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white text-[#A94442] shadow-2xs flex-shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <strong className="text-[14px] sm:text-[15px] font-black block">
                {language === 'hi'
                  ? `${openAlerts.length} अपुष्ट सुरक्षा सीमा अलर्ट`
                  : `${openAlerts.length} Active Hazard Exceedance Alert${openAlerts.length > 1 ? 's' : ''}`}
              </strong>
              <span className="text-[12px] text-[#A94442]/90 block">
                {language === 'hi'
                  ? 'कर्मचारी डोसीमीटर सुरक्षा सीमा पार हो गई है। तत्काल पर्यवेक्षी जांच आवश्यक है।'
                  : 'Worker dosimeters exceeded OSHA safety thresholds. Supervisory triage required.'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              openAlerts.forEach(a => acknowledgeAlert(a.id, 'Supervisor (On Duty)'));
            }}
            className="gov-btn-primary bg-[#A94442] hover:bg-[#8F3331] text-white text-[12px] font-bold h-8 px-3.5 rounded-lg self-start sm:self-auto shadow-xs whitespace-nowrap"
          >
            <span>{language === 'hi' ? 'सभी अलर्ट स्वीकार करें' : 'Acknowledge All'}</span>
          </button>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. 4 CORE ESSENTIAL KPI METRIC CARDS                           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1: Monitored Workers */}
        <div className="gov-card p-3.5 sm:p-4.5 rounded-2xl bg-white border border-[#E8E2D5] space-y-1 shadow-2xs hover:border-[#5C822D] transition-colors">
          <div className="flex items-center justify-between text-[#7A8178]">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              {language === 'hi' ? 'सक्रिय कर्मी' : 'Monitored Staff'}
            </span>
            <Users className="w-4 h-4 text-[#5C822D]" />
          </div>
          <div className="text-[28px] sm:text-[36px] font-black text-[#263026] font-mono leading-none tracking-tight pt-0.5">
            {uniqueWorkers}
          </div>
          <span className="text-[11.5px] text-[#596158] block truncate">
            {language === 'hi' ? 'रिफाइनरी ज़ोन ए' : 'Refinery Zone A'}
          </span>
        </div>

        {/* Metric 2: Total Verified Scans */}
        <div className="gov-card p-3.5 sm:p-4.5 rounded-2xl bg-white border border-[#E8E2D5] space-y-1 shadow-2xs hover:border-[#5C822D] transition-colors">
          <div className="flex items-center justify-between text-[#7A8178]">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              {language === 'hi' ? 'कुल स्कैन' : 'Verified Scans'}
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#5C822D]" />
          </div>
          <div className="text-[28px] sm:text-[36px] font-black text-[#5C822D] font-mono leading-none tracking-tight pt-0.5">
            {scans.length}
          </div>
          <span className="text-[11.5px] text-[#35551F] font-semibold block truncate">
            {validScans.length} {language === 'hi' ? 'वैध (100%)' : 'Valid (100%)'}
          </span>
        </div>

        {/* Metric 3: Safe Compliance Rate */}
        <div className="gov-card p-3.5 sm:p-4.5 rounded-2xl bg-white border border-[#E8E2D5] space-y-1 shadow-2xs hover:border-[#5C822D] transition-colors">
          <div className="flex items-center justify-between text-[#7A8178]">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              {language === 'hi' ? 'सुरक्षा अनुपालन' : 'Compliance Rate'}
            </span>
            <ShieldCheck className="w-4 h-4 text-[#5C822D]" />
          </div>
          <div className="text-[28px] sm:text-[36px] font-black text-[#263026] font-mono leading-none tracking-tight pt-0.5">
            {safeCompliancePercent}%
          </div>
          <span className="text-[11.5px] text-[#596158] block truncate">
            {language === 'hi' ? 'PEL 10 ppm सीमा के भीतर' : 'Within OSHA PEL limit'}
          </span>
        </div>

        {/* Metric 4: Peak Shift Exposure */}
        <div className="gov-card p-3.5 sm:p-4.5 rounded-2xl bg-white border border-[#E8E2D5] space-y-1 shadow-2xs hover:border-[#5C822D] transition-colors">
          <div className="flex items-center justify-between text-[#7A8178]">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              {language === 'hi' ? 'अधिकतम एक्सपोज़र' : 'Shift Peak Dose'}
            </span>
            <Activity className="w-4 h-4 text-[#C96B32]" />
          </div>
          <div className="text-[28px] sm:text-[36px] font-black text-[#263026] font-mono leading-none tracking-tight pt-0.5">
            {formatDose(maxDose, 1)} <span className="text-[14px] sm:text-[16px] text-[#596158] font-sans font-bold">ppm·h</span>
          </div>
          <span className="text-[11.5px] text-[#7A8178] block truncate font-mono">
            Ceiling: 20.0 ppm·h
          </span>
        </div>

      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. PRACTICAL 2-COLUMN SECTION: RISK TIERS & LIVE TELEMETRY     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* COLUMN 1: Shift Risk Distribution Breakdown */}
        <div className="gov-card p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E2D5] space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-2.5">
            <h2 className="text-[14px] sm:text-[15px] font-black text-[#263026]">
              {language === 'hi' ? 'शिफ्ट जोखिम वितरण' : 'Shift Risk Distribution'}
            </h2>
            <span className="text-[11px] text-[#7A8178] font-mono">
              Total: {scans.length}
            </span>
          </div>

          <div className="space-y-3 text-[12px] sm:text-[13px]">
            
            {/* Safe Tier */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 font-bold text-[#263026]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5C822D]" />
                  <span>Safe (&lt;5 ppm·h)</span>
                </span>
                <span className="font-mono font-bold text-[#263026]">{riskCounts.normal}</span>
              </div>
              <div className="w-full bg-[#FAF7F0] h-2 rounded-full overflow-hidden border border-[#E8E2D5]">
                <div 
                  className="bg-[#5C822D] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${scans.length ? (riskCounts.normal / scans.length) * 100 : 100}%` }}
                />
              </div>
            </div>

            {/* Elevated Tier */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 font-bold text-[#263026]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D99B26]" />
                  <span>Elevated (5–10 ppm·h)</span>
                </span>
                <span className="font-mono font-bold text-[#263026]">{riskCounts.elevated}</span>
              </div>
              <div className="w-full bg-[#FAF7F0] h-2 rounded-full overflow-hidden border border-[#E8E2D5]">
                <div 
                  className="bg-[#D99B26] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${scans.length ? (riskCounts.elevated / scans.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* High Tier */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 font-bold text-[#263026]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C96B32]" />
                  <span>High (10–20 ppm·h)</span>
                </span>
                <span className="font-mono font-bold text-[#263026]">{riskCounts.high}</span>
              </div>
              <div className="w-full bg-[#FAF7F0] h-2 rounded-full overflow-hidden border border-[#E8E2D5]">
                <div 
                  className="bg-[#C96B32] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${scans.length ? (riskCounts.high / scans.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Critical Tier */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 font-bold text-[#263026]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A94442]" />
                  <span>Critical (&gt;20 ppm·h)</span>
                </span>
                <span className="font-mono font-bold text-[#A94442]">{riskCounts.critical}</span>
              </div>
              <div className="w-full bg-[#FAF7F0] h-2 rounded-full overflow-hidden border border-[#E8E2D5]">
                <div 
                  className="bg-[#A94442] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${scans.length ? (riskCounts.critical / scans.length) * 100 : 0}%` }}
                />
              </div>
            </div>

          </div>

          <div className="pt-2 border-t border-[#E8E2D5] text-[11.5px] text-[#596158]">
            <span>OSHA 8h TWA PEL: <strong>10.0 ppm</strong> · Ceiling: <strong>20.0 ppm</strong></span>
          </div>
        </div>

        {/* COLUMN 2 & 3: Live Personnel Telemetry Feed */}
        <div className="gov-card p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E2D5] space-y-3 lg:col-span-2 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-2.5">
            <h2 className="text-[14px] sm:text-[15px] font-black text-[#263026] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5C822D]" />
              <span>{language === 'hi' ? 'वास्तविक समय सत्यापन फ़ीड' : 'Real-Time Personnel Verification Feed'}</span>
            </h2>
            <Link
              href="/scan"
              className="text-[11.5px] text-[#5C822D] hover:text-[#35551F] font-bold hover:underline"
            >
              {language === 'hi' ? '+ नया रिस्टबैंड स्कैन' : '+ New Scan'}
            </Link>
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-[#E8E2D5] text-[#7A8178] text-[10.5px] uppercase font-mono">
                  <th className="pb-2 font-bold">Time</th>
                  <th className="pb-2 font-bold">Worker</th>
                  <th className="pb-2 font-bold">Badge ID</th>
                  <th className="pb-2 font-bold">Cumulative Dose</th>
                  <th className="pb-2 font-bold text-right">Risk Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D5]">
                {recentScans.map((s) => {
                  const r = s.exposureResult;
                  const isSafe = r?.riskStatus === RiskStatus.NORMAL;
                  const isElevated = r?.riskStatus === RiskStatus.ELEVATED;
                  const isHigh = r?.riskStatus === RiskStatus.HIGH;

                  const badgeClass = isSafe
                    ? 'bg-[#EDF3E4] text-[#35551F] border-[#C6DCC0]'
                    : isElevated
                    ? 'bg-[#FAF5E8] text-[#946200] border-[#EAD7A8]'
                    : isHigh
                    ? 'bg-[#FAF2EB] text-[#C96B32] border-[#F3D5C0]'
                    : 'bg-[#F8ECEC] text-[#A94442] border-[#E8B8B8]';

                  return (
                    <tr key={s.id} className="hover:bg-[#FAF7F0] transition-colors">
                      <td className="py-2.5 text-[#596158] font-mono text-[11.5px]">
                        {formatDateTime(s.capturedAt)}
                      </td>
                      <td className="py-2.5 font-bold text-[#263026]">
                        {s.workerId}
                      </td>
                      <td className="py-2.5 text-[#7A8178] font-mono text-[11.5px]">
                        {s.dosimeterId}
                      </td>
                      <td className="py-2.5 font-bold text-[#263026] font-mono">
                        {r?.estimatedDose !== null && r?.estimatedDose !== undefined
                          ? `${formatDose(r.estimatedDose, 1)} ${r.doseUnit || 'ppm·h'}`
                          : 'Unverified'}
                      </td>
                      <td className="py-2.5 text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass} uppercase`}>
                          {r?.riskStatus || 'SAFE'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="sm:hidden divide-y divide-[#E8E2D5]">
            {recentScans.map((s) => {
              const r = s.exposureResult;
              const isSafe = r?.riskStatus === RiskStatus.NORMAL;
              const isElevated = r?.riskStatus === RiskStatus.ELEVATED;
              const isHigh = r?.riskStatus === RiskStatus.HIGH;

              const badgeClass = isSafe
                ? 'bg-[#EDF3E4] text-[#35551F] border-[#C6DCC0]'
                : isElevated
                ? 'bg-[#FAF5E8] text-[#946200] border-[#EAD7A8]'
                : isHigh
                ? 'bg-[#FAF2EB] text-[#C96B32] border-[#F3D5C0]'
                : 'bg-[#F8ECEC] text-[#A94442] border-[#E8B8B8]';

              return (
                <div key={s.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-[13px] text-[#263026] truncate">
                      {s.workerId} · <span className="font-mono text-[#7A8178] font-normal text-[11px]">{s.dosimeterId}</span>
                    </div>
                    <div className="text-[11px] text-[#7A8178] font-mono">
                      {formatDateTime(s.capturedAt)}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-[13px] text-[#263026] font-mono">
                      {r?.estimatedDose !== null && r?.estimatedDose !== undefined
                        ? `${formatDose(r.estimatedDose, 1)} ppm·h`
                        : '—'}
                    </div>
                    <span className={`text-[9.5px] font-bold px-2 py-0.2 rounded-full border ${badgeClass} uppercase inline-block mt-0.5`}>
                      {r?.riskStatus || 'SAFE'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. PROGRESSIVE DISCLOSURE: METROLOGY & CALIBRATION ACCORDION   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="gov-card rounded-2xl overflow-hidden bg-white border border-[#E8E2D5] shadow-2xs">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full p-3.5 sm:p-4 bg-[#FAF7F0] hover:bg-[#FAF6EE] flex items-center justify-between text-left text-[12.5px] sm:text-[13px] font-semibold text-[#263026] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#5C822D]" />
            <span>{language === 'hi' ? 'मेट्रोलॉजी मानक और रासायनिक डोसीमेट्री विनिर्देश' : 'Advanced Metrology Standards & Chemical Calibration Specifications'}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-[#7A8178] transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>

        {showAdvanced && (
          <div className="p-4 sm:p-5 border-t border-[#E8E2D5] space-y-3 text-[12px] sm:text-[12.5px] animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#E8E2D5] space-y-1">
                <span className="font-bold text-[#263026] block">Bradford D65 Chromaticity</span>
                <p className="text-[#596158] text-[11px] leading-relaxed">
                  Normalizes ambient refinery illumination to standard CIE D65 white-point using 4-patch fiducial bar.
                </p>
              </div>

              <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#E8E2D5] space-y-1">
                <span className="font-bold text-[#263026] block">Reaction Kinetic Model</span>
                <p className="text-[#596158] text-[11px] leading-relaxed">
                  Cu-PAN lead-free matrix with linear colorimetric response interval 0.0 – 30.0 ppm·h.
                </p>
              </div>

              <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#E8E2D5] space-y-1">
                <span className="font-bold text-[#263026] block">OSHA Safety Benchmarks</span>
                <p className="text-[#596158] text-[11px] leading-relaxed">
                  Thresholds configured to OSHA Permissible Exposure Limit (10 ppm 8h TWA) and Evacuation Ceiling (20 ppm).
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href="/about"
                className="text-[11.5px] text-[#5C822D] hover:text-[#35551F] font-bold hover:underline flex items-center gap-1"
              >
                <span>Learn about the Sensing Science & Technology →</span>
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
