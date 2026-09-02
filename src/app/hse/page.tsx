'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/stores/app-store';
import { RiskStatus, AlertStatus, ValidityStatus } from '@/types';
import { TRANSLATIONS } from '@/lib/i18n';
import {
  Printer,
  ChevronRight,
  AlertTriangle,
  Cpu,
  ChevronDown,
} from 'lucide-react';
import { formatDose, formatDateTime } from '@/lib/utils';
import { useMounted } from '@/hooks/use-mounted';

export default function HSEOverviewPage() {
  const { scans, alerts, language } = useAppStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const mounted = useMounted();

  const t = TRANSLATIONS[language];

  if (!mounted) {
    return (
      <div className="text-[13px] text-[#7A8178]">
        {language === 'hi' 
          ? 'सुरक्षा डैशबोर्ड लोड हो रहा है...' 
          : language === 'kn'
          ? 'ಸುರಕ್ಷತಾ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...'
          : language === 'gu'
          ? 'સુરક્ષા ડેશબોર્ડ લોડ થઈ રહ્યું છે...'
          : 'Loading safety dashboard...'}
      </div>
    );
  }

  const validScans = scans.filter(s => s.exposureResult?.validityStatus === ValidityStatus.VALID || s.riskLevel === RiskStatus.NORMAL || s.status === RiskStatus.NORMAL);

  const riskCounts = {
    normal: scans.filter(s => (s.riskLevel || s.exposureResult?.riskStatus) === RiskStatus.NORMAL).length,
    elevated: scans.filter(s => (s.riskLevel || s.exposureResult?.riskStatus) === RiskStatus.ELEVATED).length,
    high: scans.filter(s => (s.riskLevel || s.exposureResult?.riskStatus) === RiskStatus.HIGH).length,
    critical: scans.filter(s => (s.riskLevel || s.exposureResult?.riskStatus) === RiskStatus.CRITICAL).length,
  };

  const openAlerts = alerts.filter(a => a.status === AlertStatus.OPEN);
  const uniqueWorkers = new Set([...scans.map(s => s.workerId), 'worker-001', 'worker-002', 'worker-003', 'worker-004', 'worker-005']).size;

  const recentScans = [...scans].sort((a, b) =>
    new Date(b.capturedAt || b.timestamp || 0).getTime() - new Date(a.capturedAt || a.timestamp || 0).getTime()
  ).slice(0, 6);

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E5DE] pb-3 sm:pb-4">
        <div>
          <span className="text-[11px] sm:text-[12px] font-bold text-[#5C822D] uppercase tracking-wider block">
            {language === 'hi' 
              ? 'पर्यवेक्षी कमांड सेंटर' 
              : language === 'kn'
              ? 'ಮೇಲ್ವಿಚಾರಣಾ ಕಮಾಂಡ್ ಸೆಂಟರ್'
              : language === 'gu'
              ? 'સુપરવાઇઝરી કમાન્ડ સેન્ટર'
              : 'Supervisory Command Center'}
          </span>
          <h1 className="text-[18px] sm:text-[24px] font-bold text-[#263026]">
            {t.dashboardTitle}
          </h1>
          <p className="text-[12px] sm:text-[14px] text-[#596158] mt-0.5">
            {language === 'hi' 
              ? 'रिफाइनरी ज़ोन ए · गैस डोसीमेट्री निगरानी' 
              : language === 'kn'
              ? 'ರಿಫೈನರಿ ವಲಯ A · ಗ್ಯಾಸ್ ಡೋಸಿಮೆಟ್ರಿ ಕಣ್ಗಾವಲು'
              : language === 'gu'
              ? 'રિફાઇનરી ઝોન A · ગેસ ડોસિમેટ્રી દેખરેખ'
              : 'Refinery Zone A · Gas Dosimetry Surveillance'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => window.print()}
            className="gov-btn-secondary text-[12px] sm:text-[13px] h-9 cursor-pointer"
          >
            <Printer size={14} />
            <span>
              {language === 'hi' ? 'रिपोर्ट प्रिंट करें' : language === 'kn' ? 'ವರದಿ ಮುದ್ರಿಸಿ' : language === 'gu' ? 'રિપોર્ટ પ્રિન્ટ કરો' : 'Print Report'}
            </span>
          </button>
        </div>
      </div>

      {/* TIER 1: ACTIVE ALERTS BANNER (If open alerts exist) */}
      {openAlerts.length > 0 && (
        <div className="p-3.5 sm:p-4 rounded-lg bg-[#F7EAEA] border-2 border-[#F0C4C4] text-[#A94442] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse" />
            <div>
              <strong className="text-[14px] block">
                {language === 'hi'
                  ? `${openAlerts.length} अपुष्ट सुरक्षा सीमा अलर्ट`
                  : language === 'kn'
                  ? `${openAlerts.length} ದೃಢೀಕರಿಸದ ಸುರಕ್ಷತಾ ಮಿತಿ ಎಚ್ಚರಿಕೆಗಳು`
                  : language === 'gu'
                  ? `${openAlerts.length} અચકાસાયેલ સુરક્ષા મર્યાદા ચેતવણીઓ`
                  : `${openAlerts.length} Unacknowledged Safety Limit Alert${openAlerts.length > 1 ? 's' : ''}`}
              </strong>
              <span className="text-[12px] text-[#A94442]/90">
                {language === 'hi'
                  ? 'कर्मचारी डोसीमीटर सीमा उल्लंघन पर पर्यवेक्षी कार्रवाई की आवश्यकता है।'
                  : language === 'kn'
                  ? 'ಸಿಬ್ಬಂದಿ ಡೋಸಿಮೀಟರ್ ಮಿತಿ ಉಲ್ಲಂಘನೆಗೆ ಮೇಲ್ವಿಚಾರಣಾ ಕ್ರಮ ಅಗತ್ಯವಿದೆ.'
                  : language === 'gu'
                  ? 'કર્મચારી ડોસિમીટર મર્યાદા ઉલ્લંઘન માટે સુપરવાઇઝરી પગલાંની જરૂર છે.'
                  : 'Personnel dosimeter threshold exceedances require supervisory triage.'}
              </span>
            </div>
          </div>

          <Link
            href="/hse/alerts"
            className="gov-btn-primary bg-[#A94442] hover:bg-[#8F3331] text-white text-[12px] sm:text-[13px] h-8 px-3.5 self-start sm:self-auto shadow-xs cursor-pointer"
          >
            <span>
              {language === 'hi' ? 'समीक्षा व स्वीकार करें →' : language === 'kn' ? 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಒಪ್ಪಿಕೊಳ್ಳಿ →' : language === 'gu' ? 'સમીક્ષા કરો અને સ્વીકારો →' : 'Review & Acknowledge →'}
            </span>
          </Link>
        </div>
      )}

      {/* TIER 1: 4 CORE ESSENTIAL KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        
        <div className="gov-card p-3.5 sm:p-5 space-y-1">
          <span className="text-[10px] sm:text-[11px] text-[#7A8178] font-bold uppercase tracking-wider block truncate">
            {t.monitoredStaff}
          </span>
          <div className="text-[24px] sm:text-[30px] font-bold text-[#263026] font-mono leading-none">
            {uniqueWorkers || 5}
          </div>
          <span className="text-[11px] sm:text-[12px] text-[#596158] block truncate pt-0.5">
            {language === 'hi' ? 'ज़ोन ए में सक्रिय' : language === 'kn' ? 'ವಲಯ A ನಲ್ಲಿ ಸಕ್ರಿಯ' : language === 'gu' ? 'ઝોન A માં સક્રિય' : 'Active in Zone A'}
          </span>
        </div>

        <div className="gov-card p-3.5 sm:p-5 space-y-1">
          <span className="text-[10px] sm:text-[11px] text-[#7A8178] font-bold uppercase tracking-wider block truncate">
            {t.totalScans}
          </span>
          <div className="text-[24px] sm:text-[30px] font-bold text-[#5C822D] font-mono leading-none">
            {scans.length}
          </div>
          <span className="text-[11px] sm:text-[12px] text-[#35551F] font-semibold block truncate pt-0.5">
            {validScans.length} {language === 'hi' ? 'वैध' : language === 'kn' ? 'ಮಾನ್ಯ' : language === 'gu' ? 'માન્ય' : 'Valid'} ({((validScans.length / Math.max(1, scans.length)) * 100).toFixed(0)}%)
          </span>
        </div>

        <div className="gov-card p-3.5 sm:p-5 space-y-1">
          <span className="text-[10px] sm:text-[11px] text-[#7A8178] font-bold uppercase tracking-wider block truncate">
            {t.exceedances}
          </span>
          <div className={`text-[24px] sm:text-[30px] font-bold font-mono leading-none ${riskCounts.high + riskCounts.critical > 0 ? 'text-[#A94442]' : 'text-[#263026]'}`}>
            {riskCounts.high + riskCounts.critical}
          </div>
          <span className="text-[11px] sm:text-[12px] text-[#A94442] font-semibold block truncate pt-0.5">
            {riskCounts.critical} {language === 'hi' ? 'गंभीर (>20 ppm·h)' : language === 'kn' ? 'ತುರ್ತು (>20 ppm·h)' : language === 'gu' ? 'ગંભીર (>20 ppm·h)' : 'Critical (>20 ppm·h)'}
          </span>
        </div>

        <div className="gov-card p-3.5 sm:p-5 space-y-1">
          <span className="text-[10px] sm:text-[11px] text-[#7A8178] font-bold uppercase tracking-wider block truncate">
            {t.activeAlerts}
          </span>
          <div className={`text-[24px] sm:text-[30px] font-bold font-mono leading-none ${openAlerts.length > 0 ? 'text-[#C96B32]' : 'text-[#5C822D]'}`}>
            {openAlerts.length}
          </div>
          <span className="text-[11px] sm:text-[12px] text-[#596158] block truncate pt-0.5">
            {openAlerts.length > 0 
              ? (language === 'hi' ? 'कार्रवाई आवश्यक' : language === 'kn' ? 'ಕ್ರಮ ಅಗತ್ಯ' : language === 'gu' ? 'પગલું જરૂરી' : 'Requires Action') 
              : (language === 'hi' ? 'सभी सामान्य' : language === 'kn' ? 'ಎಲ್ಲವೂ ಸಾಮಾನ್ಯ' : language === 'gu' ? 'બધું સામાન્ય' : 'All Clear')}
          </span>
        </div>

      </div>

      {/* TIER 2: USEFUL SUPPORTING INFORMATION (Exposure Distribution & Recent Scans) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Exposure Distribution Breakdown */}
        <div className="gov-card p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#E7E5DE] pb-2.5">
            <h2 className="text-[14px] sm:text-[15px] font-bold text-[#263026]">
              Workforce Risk Distribution
            </h2>
            <span className="text-[11px] text-[#7A8178]">Active Shift</span>
          </div>

          <div className="space-y-2 text-[12px] sm:text-[13px]">
            <div className="flex items-center justify-between p-2.5 rounded bg-[#FAFBF9] border border-[#E7E5DE]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5C822D]" />
                <span className="font-semibold text-[#263026]">Normal (&lt;5 ppm·h)</span>
              </div>
              <span className="font-bold text-[#263026] font-mono">{riskCounts.normal}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-[#FAFBF9] border border-[#E7E5DE]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D99B26]" />
                <span className="font-semibold text-[#263026]">Elevated (5–15 ppm·h)</span>
              </div>
              <span className="font-bold text-[#263026] font-mono">{riskCounts.elevated}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-[#FAFBF9] border border-[#E7E5DE]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C96B32]" />
                <span className="font-semibold text-[#263026]">High (15–20 ppm·h)</span>
              </div>
              <span className="font-bold text-[#263026] font-mono">{riskCounts.high}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-[#FAFBF9] border border-[#E7E5DE]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A94442]" />
                <span className="font-semibold text-[#263026]">Critical (&gt;20 ppm·h)</span>
              </div>
              <span className="font-bold text-[#263026] font-mono">{riskCounts.critical}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E7E5DE] flex justify-between items-center text-[12px]">
            <Link href="/hse/exposure" className="text-[#5C822D] font-semibold hover:underline flex items-center gap-1">
              <span>View Analytics Trends</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>

        {/* Real-Time Personnel Telemetry Feed (Responsive Table on Desktop, Cards on Mobile) */}
        <div className="gov-card p-4 sm:p-5 space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#E7E5DE] pb-2.5">
            <h2 className="text-[14px] sm:text-[15px] font-bold text-[#263026]">
              Real-Time Personnel Verification Feed
            </h2>
            <Link
              href="/hse/workers"
              className="text-[12px] text-[#5C822D] font-semibold hover:underline"
            >
              View Roster →
            </Link>
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#E7E5DE] text-[#7A8178] text-[11px] uppercase">
                  <th className="pb-2 font-semibold">Timestamp</th>
                  <th className="pb-2 font-semibold">Worker</th>
                  <th className="pb-2 font-semibold">Shift</th>
                  <th className="pb-2 font-semibold">Badge</th>
                  <th className="pb-2 font-semibold">Dose</th>
                  <th className="pb-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5DE]">
                {recentScans.map(s => {
                  const r = s.exposureResult;
                  const dose = s.h2sReading ?? r?.estimatedDose;
                  const risk = s.riskLevel || r?.riskStatus || RiskStatus.NORMAL;

                  return (
                    <tr key={s.id} className="hover:bg-[#FAFBF9]">
                      <td className="py-2 text-[#596158] font-mono text-[12px]">
                        {formatDateTime(s.capturedAt || s.timestamp || '')}
                      </td>
                      <td className="py-2 font-semibold text-[#263026]">
                        {s.workerName || s.workerId}
                      </td>
                      <td className="py-2 text-[#596158] text-[12px]">
                        <span className="bg-[#EDF3E4] text-[#3E6B1D] px-1.5 py-0.5 rounded text-[11px] font-medium font-mono">
                          {s.shiftName || 'Shift A'}
                        </span>
                      </td>
                      <td className="py-2 text-[#596158] font-mono">
                        {s.dosimeterCode || s.dosimeterId}
                      </td>
                      <td className="py-2 font-bold text-[#263026] font-mono">
                        {dose !== null && dose !== undefined
                          ? `${formatDose(dose, 1)} ${s.doseUnit || r?.doseUnit || 'ppm·h'}`
                          : 'Unverified'}
                      </td>
                      <td className="py-2">
                        <span className={`gov-badge ${
                          risk === RiskStatus.NORMAL
                            ? 'gov-badge-normal'
                            : risk === RiskStatus.ELEVATED
                            ? 'gov-badge-elevated'
                            : risk === RiskStatus.HIGH
                            ? 'gov-badge-high'
                            : 'gov-badge-critical'
                        } text-[10px]`}>
                          {risk}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="sm:hidden divide-y divide-[#E7E5DE]">
            {recentScans.map(s => {
              const r = s.exposureResult;
              const dose = s.h2sReading ?? r?.estimatedDose;
              const risk = s.riskLevel || r?.riskStatus || RiskStatus.NORMAL;

              return (
                <div key={s.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-[13px] text-[#263026] truncate">
                      {s.workerName || s.workerId} · <span className="font-mono text-[#596158] font-normal">{s.dosimeterCode || s.dosimeterId}</span>
                    </div>
                    <div className="text-[11px] text-[#7A8178] font-mono flex items-center gap-1.5">
                      <span>{formatDateTime(s.capturedAt || s.timestamp || '')}</span>
                      <span>·</span>
                      <span className="text-[#5C822D]">{s.shiftName || 'Shift A'}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-[14px] text-[#263026] font-mono">
                      {dose !== null && dose !== undefined
                        ? `${formatDose(dose, 1)} ppm·h`
                        : '—'}
                    </div>
                    <span className={`gov-badge ${
                      risk === RiskStatus.NORMAL
                        ? 'gov-badge-normal'
                        : risk === RiskStatus.ELEVATED
                        ? 'gov-badge-elevated'
                        : risk === RiskStatus.HIGH
                        ? 'gov-badge-high'
                        : 'gov-badge-critical'
                    } text-[9px]`}>
                      {risk}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* TIER 3: ADVANCED TELEMETRY & SCIENTIFIC PROVENANCE (Behind Progressive Disclosure Accordion) */}
      <div className="gov-card overflow-hidden">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full p-4 bg-[#FAFBF9] hover:bg-[#F0EFE9] flex items-center justify-between text-left text-[13px] font-semibold text-[#263026] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#5C822D]" />
            <span>Advanced Metrology & Calibration Standards</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-[#7A8178] transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>

        {showAdvanced && (
          <div className="p-4 sm:p-5 border-t border-[#E7E5DE] space-y-4 text-[12px] sm:text-[13px] animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#FAFBF9] p-3 rounded-lg border border-[#E7E5DE] space-y-1">
                <span className="font-bold text-[#263026] block">Bradford Adaptation</span>
                <p className="text-[#596158] text-[11px] leading-relaxed">
                  Normalizes mixed fluorescent and outdoor daylight spectra to standard ISO/CIE D65 using 4-patch fiducial bar.
                </p>
              </div>

              <div className="bg-[#FAFBF9] p-3 rounded-lg border border-[#E7E5DE] space-y-1">
                <span className="font-bold text-[#263026] block">Chemosensor Kinetic Domain</span>
                <p className="text-[#596158] text-[11px] leading-relaxed">
                  Linear reaction interval 0.0 – 30.0 ppm·h with Cu-PAN & Bismuth(III) solid matrix substrate.
                </p>
              </div>

              <div className="bg-[#FAFBF9] p-3 rounded-lg border border-[#E7E5DE] space-y-1">
                <span className="font-bold text-[#263026] block">Regulatory Benchmark</span>
                <p className="text-[#596158] text-[11px] leading-relaxed">
                  Calibrated to OSHA PEL (10 ppm 8h TWA) and Critical Ceiling (20 ppm·h evacuation threshold).
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href="/hse/technical"
                className="text-[12px] text-[#5C822D] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Open Full Metrology Inspector →</span>
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

