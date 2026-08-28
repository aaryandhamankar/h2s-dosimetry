'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/app-store';
import { DEMO_WORKERS, HSE_USER } from '@/data/demo-workers';
import { 
  User, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Camera, 
  Layers, 
  FileCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import mrplLogo from '../../public/mrpl-logo.png';

export default function LandingPage() {
  const router = useRouter();
  const { login, initializeDemoData } = useAppStore();
  const [selectedPreviewDose, setSelectedPreviewDose] = useState<number>(3.2);
  const [showSpecs, setShowSpecs] = useState<boolean>(false);

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
    <div className="flex-1 py-3 sm:py-8 px-3 sm:px-8">
      <div className="max-w-[1200px] mx-auto space-y-4 sm:space-y-8">
        
        {/* Main Hero Card */}
        <div className="gov-card p-4 sm:p-8 space-y-4 sm:space-y-6">
          
          {/* Header & Identity */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E5DE] pb-4 sm:pb-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="h-11 sm:h-14 w-11 sm:w-14 flex-shrink-0 flex items-center justify-center p-1.5 bg-white rounded-lg border border-[#E7E5DE] shadow-xs">
                <Image 
                  src={mrplLogo} 
                  alt="ONGC MRPL Logo" 
                  className="h-8 sm:h-11 w-auto object-contain rounded-md"
                  priority
                />
              </div>
              <div className="space-y-0.5 sm:space-y-1 min-w-0">
                <span className="text-[10px] sm:text-[12px] font-bold text-[#5C822D] uppercase tracking-wider block">
                  ONGC · MRPL Directorate of HSE
                </span>
                <h1 className="text-[18px] sm:text-[28px] font-bold text-[#263026] leading-tight">
                  H₂S Exposure Dosimeter Platform
                </h1>
                <p className="text-[12px] sm:text-[15px] text-[#596158] leading-relaxed">
                  Passive colorimetric wristband verification system for refinery plant operators and safety monitoring.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-1 border-t sm:border-t-0 sm:border-l sm:border-[#E7E5DE] pt-2.5 sm:pt-0 sm:pl-6">
              <span className="gov-badge gov-badge-normal text-[11px] sm:text-[13px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> ISO/CIE D65
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#7A8178] font-mono">Lead-Free Cu-PAN / Bi³⁺</span>
            </div>
          </div>

          {/* Primary Quick-Action Buttons (Large, Tappable, High-Contrast) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleWorkerLogin}
              className="group p-4 sm:p-5 rounded-lg bg-[#5C822D] hover:bg-[#4E6F26] active:bg-[#3E5A1E] text-white shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between gap-3 min-h-[64px]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-md bg-white/15 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-white/80 font-bold">Field Operator</div>
                  <div className="text-[15px] sm:text-[17px] font-bold leading-tight truncate">Worker Terminal</div>
                  <div className="text-[11px] sm:text-[12px] text-white/85 truncate">Scan wristband & view shift reading</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </button>

            <button
              onClick={handleHseLogin}
              className="group p-4 sm:p-5 rounded-lg bg-white hover:bg-[#FAFBF9] active:bg-[#F0EFE9] border-2 border-[#5C822D] text-[#263026] shadow-xs hover:shadow-md transition-all text-left flex items-center justify-between gap-3 min-h-[64px]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-md bg-[#EEF3E7] text-[#5C822D] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 sm:w-6 h-5 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-[#5C822D] font-bold">Safety Officer</div>
                  <div className="text-[15px] sm:text-[17px] font-bold leading-tight truncate">HSE Dashboard</div>
                  <div className="text-[11px] sm:text-[12px] text-[#596158] truncate">Plant telemetry, alerts & analytics</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#5C822D] group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </button>
          </div>

          {/* Interactive Wearable Hardware Schematic */}
          <div className="bg-[#FAFBF9] border border-[#E7E5DE] rounded-lg p-3.5 sm:p-5 space-y-3">
            
            {/* Header & Simulator Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <h2 className="text-[14px] sm:text-[16px] font-bold text-[#263026] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#5C822D]" /> Wearable Dosimeter Wristband
                </h2>
                <p className="text-[11px] sm:text-[12px] text-[#596158]">
                  4-patch optical reference bar with lead-free colorimetric chemosensor
                </p>
              </div>

              {/* Exposure Simulator Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-[#7A8178] font-bold mr-0.5">Simulate:</span>
                {[
                  { label: 'Normal (3.2)', val: 3.2 },
                  { label: 'Elevated (12.4)', val: 12.4 },
                  { label: 'Critical (24.8)', val: 24.8 },
                ].map(p => (
                  <button
                    key={p.val}
                    onClick={() => setSelectedPreviewDose(p.val)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all min-h-[32px] ${
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

            {/* Fully Responsive Wristband Pod Diagram */}
            <div className="bg-white border border-[#E7E5DE] rounded-lg p-3 sm:p-6 flex flex-col items-center justify-center">
              
              {/* Responsive Container: Scales naturally on small screens */}
              <div className="w-full max-w-xl flex items-center justify-center py-2 sm:py-3">
                
                {/* Left Strap */}
                <div className="w-12 xs:w-20 sm:w-36 h-10 sm:h-13 bg-gradient-to-r from-[#1C241C] via-[#2A3728] to-[#384835] rounded-l-xl flex items-center justify-between px-2 sm:px-3 shadow-xs border-y-2 border-l-2 border-[#131A13] flex-shrink-0">
                  <div className="w-2.5 sm:w-4 h-6 sm:h-8 border border-[#94A388] rounded bg-[#475545] flex items-center justify-center">
                    <div className="w-0.5 sm:w-1 h-4 sm:h-5 bg-[#CBD5C0] rounded-full" />
                  </div>
                  <span className="hidden sm:inline text-white/40 font-mono text-[8px] tracking-widest uppercase">MRPL</span>
                </div>

                {/* Central Sensor Enclosure (Pod) */}
                <div className="flex-1 max-w-[240px] sm:max-w-[260px] bg-[#FAFBF9] rounded-xl border-2 border-[#D5D2C9] p-2.5 sm:p-3 shadow-xs flex flex-col justify-between relative z-10 mx-[-2px]">
                  
                  {/* Top 4-Patch Reference Bar */}
                  <div className="flex items-center justify-between bg-[#F0EFE9] p-1 sm:p-1.5 rounded border border-[#E7E5DE]">
                    <div className="w-4 xs:w-5 sm:w-6 h-3 sm:h-3.5 bg-[#FFFFFF] border border-[#ADB5BD] rounded-xs shadow-2xs" title="White (L*=100)" />
                    <div className="w-4 xs:w-5 sm:w-6 h-3 sm:h-3.5 bg-[#7F7F7F] border border-[#6C757D] rounded-xs shadow-2xs" title="Neutral Gray (L*=50)" />
                    <div className="w-4 xs:w-5 sm:w-6 h-3 sm:h-3.5 bg-[#00A3E0] border border-[#0080B0] rounded-xs shadow-2xs" title="Cyan" />
                    <div className="w-4 xs:w-5 sm:w-6 h-3 sm:h-3.5 bg-[#EC008C] border border-[#C00070] rounded-xs shadow-2xs" title="Magenta" />
                  </div>

                  {/* Central Chemosensor Spot */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3 py-1.5 sm:py-2">
                    <div 
                      className="w-10 sm:w-12 h-10 sm:h-12 rounded-full border-2 border-[#868E96] shadow-2xs transition-colors duration-300 flex flex-col items-center justify-center text-[7px] sm:text-[8px] font-bold font-mono text-white/90"
                      style={{ backgroundColor: getDotColor(selectedPreviewDose) }}
                    >
                      <span>Cu/Bi</span>
                      <span className="opacity-80">Sulfide</span>
                    </div>
                    <div className="text-[11px] sm:text-[12px] text-[#596158] font-mono leading-tight">
                      <div>Dose: <strong className="text-[#263026] text-[12px] sm:text-[14px]">{selectedPreviewDose} ppm·h</strong></div>
                      <div className="text-[9px] sm:text-[10px] text-[#5C822D]">Cu-PAN + Bi³⁺</div>
                    </div>
                  </div>

                  <div className="text-[8px] sm:text-[9px] text-center text-[#7A8178] font-mono uppercase tracking-wider">
                    BATCH-2026-A · LEAD-FREE
                  </div>
                </div>

                {/* Right Strap */}
                <div className="w-12 xs:w-20 sm:w-36 h-10 sm:h-13 bg-gradient-to-r from-[#384835] via-[#2A3728] to-[#1C241C] rounded-r-xl flex items-center justify-around px-2 sm:px-3 shadow-xs border-y-2 border-r-2 border-[#131A13] flex-shrink-0">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#0F140F] border border-white/20" />
                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#0F140F] border border-white/20" />
                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#0F140F] border border-white/20" />
                  </div>
                  <span className="hidden sm:inline text-white/30 font-mono text-[8px] uppercase">ZONE-A</span>
                </div>

              </div>

              {/* Collapsible / Responsive Specifications Toggle */}
              <div className="w-full mt-2 pt-2 border-t border-[#E7E5DE]">
                <button
                  onClick={() => setShowSpecs(!showSpecs)}
                  className="w-full flex items-center justify-between text-[11px] sm:text-[12px] text-[#596158] font-semibold hover:text-[#263026] py-1"
                >
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#5C822D]" />
                    <span>Technical & Chemical Specifications</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showSpecs ? 'rotate-180' : ''}`} />
                </button>

                {showSpecs && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2.5 text-[11px] sm:text-[12px] text-[#596158] animate-in fade-in duration-200">
                    <div className="bg-[#FAFBF9] p-2.5 rounded border border-[#E7E5DE]">
                      <span className="text-[#7A8178] text-[9px] sm:text-[10px] uppercase font-bold block">Chemosensor</span>
                      <strong className="text-[#263026]">Cu-PAN & Bi(III)</strong>
                    </div>
                    <div className="bg-[#FAFBF9] p-2.5 rounded border border-[#E7E5DE]">
                      <span className="text-[#7A8178] text-[9px] sm:text-[10px] uppercase font-bold block">Reaction Matrix</span>
                      <span className="font-mono text-[10px] sm:text-[11px]">CuS / Bi₂S₃↓</span>
                    </div>
                    <div className="bg-[#FAFBF9] p-2.5 rounded border border-[#E7E5DE]">
                      <span className="text-[#7A8178] text-[9px] sm:text-[10px] uppercase font-bold block">Eco-Safety</span>
                      <span className="text-[#5C822D] font-bold">100% Lead-Free</span>
                    </div>
                    <div className="bg-[#FAFBF9] p-2.5 rounded border border-[#E7E5DE]">
                      <span className="text-[#7A8178] text-[9px] sm:text-[10px] uppercase font-bold block">Colorimetry</span>
                      <span className="text-[#5C822D] font-bold">Bradford D65</span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* 3-Step Simple SOP Guide */}
        <div className="gov-card p-4 sm:p-6 space-y-3 sm:space-y-4">
          <h3 className="text-[14px] sm:text-[15px] font-bold text-[#263026] uppercase tracking-wider">
            Standard Field Operating Procedure (SOP)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px] text-[#596158]">
            <div className="p-3.5 bg-[#FAFBF9] border border-[#E7E5DE] rounded-lg space-y-1.5">
              <div className="font-bold text-[#263026] flex items-center gap-2 text-[13px] sm:text-[14px]">
                <Clock className="w-4 h-4 text-[#5C822D]" /> 1. Start Shift
              </div>
              <p className="text-[12px] sm:text-[13px] leading-relaxed">
                Confirm your assigned wristband badge ID at the start of your shift.
              </p>
            </div>

            <div className="p-3.5 bg-[#FAFBF9] border border-[#E7E5DE] rounded-lg space-y-1.5">
              <div className="font-bold text-[#263026] flex items-center gap-2 text-[13px] sm:text-[14px]">
                <Camera className="w-4 h-4 text-[#5C822D]" /> 2. Optical Scan
              </div>
              <p className="text-[12px] sm:text-[13px] leading-relaxed">
                Take a quick photo of the sensor badge using your phone camera.
              </p>
            </div>

            <div className="p-3.5 bg-[#FAFBF9] border border-[#E7E5DE] rounded-lg space-y-1.5">
              <div className="font-bold text-[#263026] flex items-center gap-2 text-[13px] sm:text-[14px]">
                <FileCheck className="w-4 h-4 text-[#5C822D]" /> 3. Verified Result
              </div>
              <p className="text-[12px] sm:text-[13px] leading-relaxed">
                Receive instant quantitative H₂S reading and safety guidance.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

