'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/app-store';
import { DEMO_WORKERS, HSE_USER } from '@/data/demo-workers';
import { 
  User, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Camera, 
  Layers, 
  FileCheck,
} from 'lucide-react';
import Image from 'next/image';
import mrplLogo from '../../public/mrpl-logo.png';

export default function LandingPage() {
  const router = useRouter();
  const { login, initializeDemoData } = useAppStore();
  const [selectedPreviewDose, setSelectedPreviewDose] = useState<number>(3.2);

  const handleWorkerLogin = () => {
    initializeDemoData();
    login(DEMO_WORKERS[0]);
    router.push('/worker');
  };

  const handleHseLogin = () => {
    initializeDemoData();
    login(HSE_USER);
    router.push('/hse');
  };

  const getDotColor = (dose: number) => {
    if (dose <= 4) return '#F4ECE1'; // Unexposed pale neutral
    if (dose <= 12) return '#BF9F80'; // Light tan brown CuS / Bi2S3
    if (dose <= 18) return '#876043'; // Medium brown sulfide
    return '#3A2214'; // Deep dark brown Bismuth Sulfide
  };

  return (
    <div className="flex-1 py-4 sm:py-8 px-3 sm:px-8">
      <div className="max-w-[1200px] mx-auto space-y-5 sm:space-y-8">
        
        {/* Main Institutional Portal Header Panel */}
        <div className="gov-card p-4 sm:p-8 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E5DE] pb-4 sm:pb-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="h-11 sm:h-13 w-11 sm:w-13 flex-shrink-0 flex items-center justify-center p-1 bg-white rounded-lg border border-[#E7E5DE] shadow-xs">
                <Image 
                  src={mrplLogo} 
                  alt="ONGC MRPL Logo" 
                  className="h-9 sm:h-10 w-auto object-contain rounded-md"
                  priority
                />
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <span className="text-[11px] sm:text-[12px] font-bold text-[#5C822D] uppercase tracking-wider block">
                  ONGC · MRPL Directorate of HSE
                </span>
                <h1 className="text-[19px] sm:text-[28px] font-bold text-[#263026] leading-tight">
                  Wearable Passive Colorimetric H₂S Exposure Dosimeter System
                </h1>
                <p className="text-[13px] sm:text-[15px] text-[#596158] leading-relaxed">
                  Quantitative smartphone optical verification platform for refinery operators & hazardous chemical zone surveillance.
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center sm:border-l sm:border-[#E7E5DE] sm:pl-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E7E5DE]">
              <span className="gov-badge gov-badge-normal text-[11px] sm:text-[13px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> ISO/CIE Standard D65
              </span>
              <p className="text-[11px] sm:text-[12px] text-[#7A8178] sm:mt-1 font-mono">CHEM-002 · Cu-PAN & Bi(III)</p>
            </div>
          </div>

          {/* Elongated Wearable Wristband Hardware Architecture */}
          <div className="bg-[#FAFBF9] border border-[#E7E5DE] rounded-md p-3.5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-[15px] sm:text-[16px] font-bold text-[#263026] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#5C822D]" /> Wearable Silicone Wristband & Sensor Pod Schematic
                </h2>
                <p className="text-[12px] sm:text-[13px] text-[#596158]">
                  Elongated wristband strap featuring lead-free Copper-PAN / Bismuth(III) matrix & 4-patch calibration bar
                </p>
              </div>

              {/* Dose Preview Switcher */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] font-semibold">
                <span className="text-[#7A8178] w-full sm:w-auto">Simulate Exposure:</span>
                {[
                  { label: 'Normal (3.2)', val: 3.2 },
                  { label: 'Elevated (12.4)', val: 12.4 },
                  { label: 'Critical (24.8)', val: 24.8 },
                ].map(p => (
                  <button
                    key={p.val}
                    onClick={() => setSelectedPreviewDose(p.val)}
                    className={`px-2.5 sm:px-3 py-1 rounded text-[11px] sm:text-[12px] font-semibold transition-all ${
                      selectedPreviewDose === p.val
                        ? 'bg-[#5C822D] text-white shadow-2xs'
                        : 'bg-white border border-[#E7E5DE] text-[#596158] hover:bg-[#F0EFE9]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Swipe Hint */}
            <div className="sm:hidden text-center text-[11px] text-[#7A8178] font-medium bg-[#F0EFE9] py-1 px-2 rounded border border-[#E7E5DE]">
              ↔ Scroll horizontally to inspect wristband hardware
            </div>

            {/* Realistic Elongated Wristband Diagram */}
            <div className="bg-white border border-[#E7E5DE] rounded-md p-6 flex flex-col items-center justify-center overflow-x-auto">
              
              <div className="flex items-center justify-center min-w-[620px] py-4">
                
                {/* Left Elongated Strap with Buckle Frame */}
                <div className="relative w-44 h-14 bg-gradient-to-r from-[#1C241C] via-[#2A3728] to-[#384835] rounded-l-2xl flex items-center justify-between px-3 shadow-xs border-y-2 border-l-2 border-[#131A13]">
                  {/* Metallic Buckle */}
                  <div className="w-5 h-10 border-2 border-[#94A388] rounded bg-[#475545] shadow-inner flex items-center justify-center">
                    <div className="w-1.5 h-6 bg-[#CBD5C0] rounded-full" />
                  </div>

                  {/* Strap Embossed Text & Texture Ridges */}
                  <div className="flex flex-col items-center justify-center text-white/40 font-mono text-[9px] tracking-widest uppercase">
                    <span>MRPL</span>
                    <div className="flex gap-1 mt-0.5">
                      <span className="w-1 h-3 bg-white/20 rounded-full" />
                      <span className="w-1 h-3 bg-white/20 rounded-full" />
                      <span className="w-1 h-3 bg-white/20 rounded-full" />
                    </div>
                  </div>

                  {/* Lug */}
                  <div className="w-2 h-12 bg-[#131A13] rounded-xs" />
                </div>

                {/* Central Sensor Enclosure (Dosimeter Pod) */}
                <div className="w-56 h-36 bg-[#FAFBF9] rounded-xl border-2 border-[#D5D2C9] p-3 shadow-xs flex flex-col justify-between relative z-10 mx-[-2px]">
                  
                  {/* Top 4-Patch Reference Bar */}
                  <div className="flex items-center justify-between bg-[#F0EFE9] p-1.5 rounded border border-[#E7E5DE]">
                    <div className="w-6 h-4 bg-[#FFFFFF] border border-[#ADB5BD] rounded-xs shadow-2xs" title="Reference: White (L*=100)" />
                    <div className="w-6 h-4 bg-[#7F7F7F] border border-[#6C757D] rounded-xs shadow-2xs" title="Reference: Neutral Gray (L*=50)" />
                    <div className="w-6 h-4 bg-[#00A3E0] border border-[#0080B0] rounded-xs shadow-2xs" title="Reference: Cyan" />
                    <div className="w-6 h-4 bg-[#EC008C] border border-[#C00070] rounded-xs shadow-2xs" title="Reference: Magenta" />
                  </div>

                  {/* Central Reactive Chemosensor Dot */}
                  <div className="flex items-center justify-center gap-3">
                    <div 
                      className="w-13 h-13 rounded-full border-2 border-[#868E96] shadow-2xs transition-colors duration-300 flex flex-col items-center justify-center text-[9px] font-bold font-mono text-white/90"
                      style={{ backgroundColor: getDotColor(selectedPreviewDose) }}
                    >
                      <span>Cu/Bi</span>
                      <span className="text-[8px] opacity-80">Sulfide</span>
                    </div>
                    <div className="text-[12px] text-[#596158] font-mono leading-tight">
                      <div>Dose: <strong className="text-[#263026]">{selectedPreviewDose} ppm·h</strong></div>
                      <div className="text-[10px] text-[#5C822D] mt-0.5">Cu-PAN + Bi³⁺ Chemosensor</div>
                    </div>
                  </div>

                  <div className="text-[10px] text-center text-[#7A8178] font-mono uppercase tracking-wider">
                    BATCH-2026-A · LEAD-FREE MATRIX
                  </div>
                </div>

                {/* Right Elongated Strap with Sizing Holes */}
                <div className="relative w-48 h-14 bg-gradient-to-r from-[#384835] via-[#2A3728] to-[#1C241C] rounded-r-3xl flex items-center justify-around px-4 shadow-xs border-y-2 border-r-2 border-[#131A13]">
                  <div className="w-2 h-12 bg-[#131A13] rounded-xs mr-2" />

                  {/* 5 Perforated Pin Adjustment Sizing Holes */}
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0F140F] border border-white/20 shadow-inner" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0F140F] border border-white/20 shadow-inner" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0F140F] border border-white/20 shadow-inner" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0F140F] border border-white/20 shadow-inner" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0F140F] border border-white/20 shadow-inner" />
                  </div>

                  <span className="text-white/30 font-mono text-[9px] tracking-wider uppercase ml-1">
                    ZONE-A
                  </span>
                </div>

              </div>

              {/* Specifications Matrix */}
              <div className="w-full mt-4 pt-4 border-t border-[#E7E5DE] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-[13px] text-[#596158]">
                <div className="bg-[#FAFBF9] p-3 rounded border border-[#E7E5DE]">
                  <span className="text-[#7A8178] text-[11px] uppercase font-bold block">Active Chemosensor</span>
                  <strong className="text-[#263026] text-[13px]">Copper-PAN & Bismuth(III)</strong>
                </div>
                <div className="bg-[#FAFBF9] p-3 rounded border border-[#E7E5DE]">
                  <span className="text-[#7A8178] text-[11px] uppercase font-bold block">Reaction Mechanism</span>
                  <span className="font-mono text-[12px]">Cu-PAN/Bi³⁺ + H₂S → CuS/Bi₂S₃↓</span>
                </div>
                <div className="bg-[#FAFBF9] p-3 rounded border border-[#E7E5DE]">
                  <span className="text-[#7A8178] text-[11px] uppercase font-bold block">Eco-Safety Profile</span>
                  <span className="text-[#5C822D] font-bold text-[13px]">100% Non-Toxic (Lead-Free)</span>
                </div>
                <div className="bg-[#FAFBF9] p-3 rounded border border-[#E7E5DE]">
                  <span className="text-[#7A8178] text-[11px] uppercase font-bold block">Optical Normalization</span>
                  <span className="text-[#5C822D] font-bold text-[13px]">4-Patch Bradford D65</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 2 Primary Service Portals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Worker Service Portal */}
          <div className="gov-card p-6 sm:p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-md bg-[#EEF3E7] text-[#5C822D] flex items-center justify-center border border-[#C8DEC0]">
                <User className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[12px] font-bold text-[#5C822D] uppercase tracking-wider block">
                  Field Operator Terminal
                </span>
                <h3 className="text-[20px] font-bold text-[#263026]">Plant Operator & Field Staff Portal</h3>
                <p className="text-[14px] text-[#596158] mt-1 leading-relaxed">
                  Log in to your active work shift, capture a photo of your wearable wristband badge, and obtain an instant verified exposure reading certificate.
                </p>
              </div>

              <div className="bg-[#FAFBF9] p-3.5 rounded-md border border-[#E7E5DE] space-y-1 text-[13px] text-[#596158]">
                <div className="font-semibold text-[#263026]">Active Operator Dossier:</div>
                <div>Name: <strong>Rajesh Kumar</strong> (Operations Shift A)</div>
                <div>Worker Code: <strong>W-001</strong> · Site: <strong>MRPL Zone A</strong></div>
              </div>
            </div>

            <button
              onClick={handleWorkerLogin}
              className="gov-btn-primary w-full text-[14px] font-semibold"
            >
              <span>Access Worker Terminal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* HSE Officer Portal */}
          <div className="gov-card p-6 sm:p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-md bg-[#F0EFE9] text-[#35551F] flex items-center justify-center border border-[#D5D2C9]">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[12px] font-bold text-[#35551F] uppercase tracking-wider block">
                  HSE Supervisory Directorate
                </span>
                <h3 className="text-[20px] font-bold text-[#263026]">HSE Safety Officer Dashboard</h3>
                <p className="text-[14px] text-[#596158] mt-1 leading-relaxed">
                  Surveil plant-wide workforce exposure levels, acknowledge threshold alerts, inspect metrology provenance, and generate compliance audit reports.
                </p>
              </div>

              <div className="bg-[#FAFBF9] p-3.5 rounded-md border border-[#E7E5DE] space-y-1 text-[13px] text-[#596158]">
                <div className="font-semibold text-[#263026]">Supervisory Authorization:</div>
                <div>Role: <strong>Chief Safety Officer & Dispatch</strong></div>
                <div>Unit: <strong>Health, Safety & Environment Directorate</strong></div>
              </div>
            </div>

            <button
              onClick={handleHseLogin}
              className="gov-btn-primary w-full text-[14px] font-semibold"
            >
              <span>Access HSE Supervisory Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Procedural 3-Step Information Guide */}
        <div className="gov-card p-6 sm:p-7 space-y-4">
          <h3 className="text-[16px] font-bold text-[#263026] uppercase tracking-wider">
            Standard Operating Procedure (SOP) Workflow
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[14px] text-[#596158]">
            <div className="p-4 bg-[#FAFBF9] border border-[#E7E5DE] rounded-md space-y-2">
              <div className="font-bold text-[#263026] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#5C822D]" /> Step 1: Shift Verification
              </div>
              <p className="text-[13px] leading-relaxed">
                Log in at shift commencement to confirm your assigned wristband dosimeter ID and 24-hour expiration window.
              </p>
            </div>

            <div className="p-4 bg-[#FAFBF9] border border-[#E7E5DE] rounded-md space-y-2">
              <div className="font-bold text-[#263026] flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#5C822D]" /> Step 2: Optical Badge Scan
              </div>
              <p className="text-[13px] leading-relaxed">
                Capture badge photo under ambient lighting. The system normalizes illumination using the 4-patch reference bar.
              </p>
            </div>

            <div className="p-4 bg-[#FAFBF9] border border-[#E7E5DE] rounded-md space-y-2">
              <div className="font-bold text-[#263026] flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#5C822D]" /> Step 3: Verified Certificate
              </div>
              <p className="text-[13px] leading-relaxed">
                The system calculates cumulative dose ($D$), calculates 8h TWA, and certifies compliance with refinery safety thresholds.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
