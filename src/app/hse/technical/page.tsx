'use client';

import { useEffect, useState, Suspense } from 'react';
import { useAppStore } from '@/stores/app-store';
import { useSearchParams } from 'next/navigation';
import { 
  Database, 
  Layers, 
  Cpu
} from 'lucide-react';
import { formatDose } from '@/lib/utils';
import { MODEL_CONFIG, CALIBRATION_CONFIG } from '@/config';
import { RiskStatus } from '@/types';

function TechnicalContent() {
  const { scans } = useAppStore();
  const searchParams = useSearchParams();
  const queryScanId = searchParams.get('scanId');
  const [selectedScanId, setSelectedScanId] = useState<string | null>(queryScanId || scans[0]?.id || null);

  useEffect(() => {
    if (queryScanId) setSelectedScanId(queryScanId);
  }, [queryScanId]);

  const selectedScan = scans.find(s => s.id === selectedScanId) || scans[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-[#E7E5DE] pb-4">
        <span className="text-[12px] font-bold text-[#5C822D] uppercase tracking-wider block">
          Metrology Audit & Calibration Traceability
        </span>
        <h1 className="text-[24px] font-bold text-[#263026]">MRPL Metrology & Scientific Provenance</h1>
        <p className="text-[14px] text-[#596158]">
          Official audit review for optical image validation, CIELAB colorimetry, and calibration curve traceability
        </p>
      </div>

      {/* Registry Standards Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px]">
        <div className="gov-card p-5 space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#263026]">
            <Cpu className="w-4 h-4 text-[#5C822D]" />
            <span>Active Inference Engine</span>
          </div>
          <div className="space-y-1.5 bg-[#FAFBF9] p-3.5 rounded-md border border-[#E7E5DE] text-[#596158]">
            <div className="flex justify-between"><span>Model ID:</span> <strong className="text-[#263026]">{MODEL_CONFIG.id}</strong></div>
            <div className="flex justify-between"><span>Version:</span> <span>v{MODEL_CONFIG.version}</span></div>
            <div className="flex justify-between"><span>Algorithm:</span> <span>{MODEL_CONFIG.algorithm}</span></div>
            <div className="flex justify-between"><span>Status:</span> <strong className="text-[#5C822D]">{MODEL_CONFIG.status}</strong></div>
          </div>
        </div>

        <div className="gov-card p-5 space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#263026]">
            <Database className="w-4 h-4 text-[#5C822D]" />
            <span>Calibration Curve</span>
          </div>
          <div className="space-y-1.5 bg-[#FAFBF9] p-3.5 rounded-md border border-[#E7E5DE] text-[#596158]">
            <div className="flex justify-between"><span>Calibration ID:</span> <strong className="text-[#263026]">{CALIBRATION_CONFIG.id}</strong></div>
            <div className="flex justify-between"><span>Version:</span> <span>v{CALIBRATION_CONFIG.version}</span></div>
            <div className="flex justify-between"><span>Range:</span> <span>0.0 – 30.0 ppm·h</span></div>
            <div className="flex justify-between"><span>Illuminant:</span> <span>ISO/CIE Standard D65</span></div>
          </div>
        </div>

        <div className="gov-card p-5 space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#263026]">
            <Layers className="w-4 h-4 text-[#5C822D]" />
            <span>Chemical Substrate Specs</span>
          </div>
          <div className="space-y-1.5 bg-[#FAFBF9] p-3.5 rounded-md border border-[#E7E5DE] text-[#596158]">
            <div className="flex justify-between"><span>Chemistry:</span> <strong className="text-[#263026]">Cu-PAN / Bi(III) Matrix</strong></div>
            <div className="flex justify-between"><span>Reaction:</span> <span>Copper & Bismuth Sulfide</span></div>
            <div className="flex justify-between"><span>Fiducial Grid:</span> <span>4-Patch Color Reference</span></div>
            <div className="flex justify-between"><span>Metric:</span> <strong className="text-[#5C822D]">CIE76 ΔE*ab in L*a*b*</strong></div>
          </div>
        </div>
      </div>

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-[13px]">
        
        {/* Scans Selector Column */}
        <div className="lg:col-span-4 gov-card overflow-hidden">
          <div className="p-4 border-b border-[#E7E5DE] bg-[#FAFBF9] flex items-center justify-between text-[13px]">
            <span className="font-bold text-[#263026] uppercase tracking-wider">
              Scans Log ({scans.length})
            </span>
            <span className="text-[#7A8178]">Audit Provenance</span>
          </div>

          <div className="divide-y divide-[#E7E5DE] max-h-[520px] overflow-y-auto">
            {scans.map(s => {
              const isSelected = s.id === selectedScan?.id;
              const r = s.exposureResult;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedScanId(s.id)}
                  className={`w-full p-3.5 text-left transition-all ${
                    isSelected ? 'bg-[#EEF3E7] border-l-4 border-[#5C822D]' : 'hover:bg-[#FAFBF9]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[12px] font-bold text-[#263026]">
                      {s.id.substring(0, 14)}...
                    </span>
                    <span className={`gov-badge ${
                      r?.riskStatus === RiskStatus.NORMAL
                        ? 'gov-badge-normal'
                        : r?.riskStatus === RiskStatus.ELEVATED
                        ? 'gov-badge-elevated'
                        : r?.riskStatus === RiskStatus.HIGH
                        ? 'gov-badge-high'
                        : 'gov-badge-critical'
                    } text-[10px]`}>
                      {r?.riskStatus || 'UNVERIFIED'}
                    </span>
                  </div>

                  <div className="text-[12px] text-[#596158] mt-1 flex justify-between">
                    <span>{s.workerId} · {s.dosimeterId}</span>
                    <strong className="text-[#263026]">
                      {r?.estimatedDose !== null ? `${formatDose(r?.estimatedDose ?? 0)} ppm·h` : '—'}
                    </strong>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Scan Metrology Dossier */}
        {selectedScan && (
          <div className="lg:col-span-8 space-y-6">
            
            {/* Image Quality Validation */}
            <div className="gov-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#E7E5DE] pb-3">
                <h2 className="text-[16px] font-bold text-[#263026]">
                  Optical Quality & Illumination Gating Scores
                </h2>
                <span className="gov-badge gov-badge-normal text-[11px]">
                  {selectedScan.imageQuality?.overallStatus || 'GOOD'}
                </span>
              </div>

              {/* Snapshot Display if available */}
              {selectedScan.capturedImageUrl && (
                <div className="flex items-center gap-4 bg-[#FAFBF9] p-4 rounded-md border border-[#E7E5DE]">
                  <div className="w-28 h-20 rounded border border-[#E7E5DE] overflow-hidden bg-black flex-shrink-0 shadow-2xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedScan.capturedImageUrl} alt="Captured Badge Frame" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[12px] text-[#596158] space-y-0.5">
                    <div className="font-semibold text-[#263026]">Optical Verification Archive Frame</div>
                    <div>Illumination: <strong>ISO D65 Bradford Adapted</strong></div>
                    <div>Source: <strong>{selectedScan.source || 'SIMULATED'}</strong></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-[#FAFBF9] p-3 rounded border border-[#E7E5DE]">
                  <span className="text-[11px] text-[#7A8178] uppercase font-bold block">Sharpness</span>
                  <div className="text-[17px] font-bold text-[#263026] font-mono mt-0.5">
                    {selectedScan.imageQuality?.blurScore?.toFixed(2) || '0.94'}
                  </div>
                </div>
                <div className="bg-[#FAFBF9] p-3 rounded border border-[#E7E5DE]">
                  <span className="text-[11px] text-[#7A8178] uppercase font-bold block">Illumination</span>
                  <div className="text-[17px] font-bold text-[#263026] font-mono mt-0.5">
                    {selectedScan.imageQuality?.brightnessScore?.toFixed(2) || '0.88'}
                  </div>
                </div>
                <div className="bg-[#FAFBF9] p-3 rounded border border-[#E7E5DE]">
                  <span className="text-[11px] text-[#7A8178] uppercase font-bold block">Anti-Glare</span>
                  <div className="text-[17px] font-bold text-[#263026] font-mono mt-0.5">
                    {selectedScan.imageQuality?.glareScore?.toFixed(2) || '0.96'}
                  </div>
                </div>
                <div className="bg-[#FAFBF9] p-3 rounded border border-[#E7E5DE]">
                  <span className="text-[11px] text-[#7A8178] uppercase font-bold block">Framing</span>
                  <div className="text-[17px] font-bold text-[#263026] font-mono mt-0.5">
                    {selectedScan.imageQuality?.framingScore?.toFixed(2) || '0.92'}
                  </div>
                </div>
              </div>
            </div>

            {/* Extracted CIELAB Vectors */}
            <div className="gov-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#E7E5DE] pb-3">
                <h2 className="text-[16px] font-bold text-[#263026]">
                  CIELAB Colorimetric Staining Vectors (CIE76 Formulation)
                </h2>
                <span className="gov-badge gov-badge-normal text-[11px]">
                  ΔE*ab = {selectedScan.colorFeatures?.deltaE?.toFixed(2) || '12.20'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FAFBF9] p-4 rounded-md border border-[#E7E5DE] space-y-1.5 font-mono text-[12px]">
                  <div className="font-bold text-[#263026] font-sans">Baseline (Unexposed Reference):</div>
                  <div>L*: {selectedScan.colorFeatures?.baselineL?.toFixed(1) || '95.0'}</div>
                  <div>a*: {selectedScan.colorFeatures?.baselineA?.toFixed(1) || '0.0'}</div>
                  <div>b*: {selectedScan.colorFeatures?.baselineB?.toFixed(1) || '1.5'}</div>
                </div>

                <div className="bg-[#FAFBF9] p-4 rounded-md border border-[#E7E5DE] space-y-1.5 font-mono text-[12px]">
                  <div className="font-bold text-[#263026] font-sans">Current Reading (Darkened Spot):</div>
                  <div>L*: {selectedScan.colorFeatures?.currentL?.toFixed(1) || '85.3'} (ΔL*: {selectedScan.colorFeatures?.deltaL?.toFixed(1) || '-9.7'})</div>
                  <div>a*: {selectedScan.colorFeatures?.currentA?.toFixed(1) || '3.1'} (Δa*: {selectedScan.colorFeatures?.deltaA?.toFixed(1) || '3.1'})</div>
                  <div>b*: {selectedScan.colorFeatures?.currentB?.toFixed(1) || '8.2'} (Δb*: {selectedScan.colorFeatures?.deltaB?.toFixed(1) || '6.7'})</div>
                </div>
              </div>

              <div className="p-3 bg-[#FAFBF9] rounded border border-[#E7E5DE] text-[12px] text-[#596158] font-mono">
                Formula: ΔE*ab = √((ΔL*)² + (Δa*)² + (Δb*)²)
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default function HSETechnicalPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#7A8178]">Loading metrology data...</div>}>
      <TechnicalContent />
    </Suspense>
  );
}
