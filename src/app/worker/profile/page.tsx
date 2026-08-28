'use client';

import { useAppStore } from '@/stores/app-store';
import { useRouter } from 'next/navigation';
import { 
  LogOut, 
  RotateCcw, 
  Layers, 
  CheckCircle2,
} from 'lucide-react';

export default function WorkerProfilePage() {
  const { currentUser, logout, resetDemo, activeDosimeter } = useAppStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleReset = () => {
    if (confirm('Reset demo state to standard initial values?')) {
      resetDemo();
      router.push('/worker');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Top Header */}
      <div className="border-b border-[#E7E5DE] pb-3 sm:pb-4">
        <span className="text-[11px] sm:text-[12px] font-bold text-[#5C822D] uppercase tracking-wider block">
          Personnel Dossier
        </span>
        <h1 className="text-[18px] sm:text-[22px] font-bold text-[#263026]">Operator Profile & Hardware Specs</h1>
        <p className="text-[13px] sm:text-[14px] text-[#596158]">Personnel identification credentials and active sensor cartridge specifications</p>
      </div>

      {/* Operator Identity Card */}
      <div className="gov-card p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-md bg-[#5C822D] text-white flex items-center justify-center font-bold text-base sm:text-lg flex-shrink-0">
            {currentUser?.displayName?.split(' ').map(n => n[0]).join('') || 'RK'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[16px] sm:text-[18px] font-bold text-[#263026]">{currentUser?.displayName || 'Rajesh Kumar'}</h2>
              <span className="gov-badge gov-badge-normal text-[10px] sm:text-[11px]">
                <CheckCircle2 className="w-3 h-3" /> Certified Operator
              </span>
            </div>
            <p className="text-[12px] sm:text-[13px] text-[#596158] mt-0.5">Chemical Plant Operator · Shift Team A</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-3 border-t border-[#E7E5DE] text-[13px] text-[#596158]">
          <div className="bg-[#FAFBF9] p-3 sm:p-3.5 rounded-md border border-[#E7E5DE]">
            <span className="text-[#7A8178] text-[10px] sm:text-[11px] uppercase font-bold block">Worker ID Code</span>
            <span className="font-bold text-[#263026] text-[14px] sm:text-[15px] mt-0.5 block">{currentUser?.workerCode || 'W-001'}</span>
          </div>
          <div className="bg-[#FAFBF9] p-3 sm:p-3.5 rounded-md border border-[#E7E5DE]">
            <span className="text-[#7A8178] text-[10px] sm:text-[11px] uppercase font-bold block">Assigned Unit</span>
            <span className="font-bold text-[#263026] text-[14px] sm:text-[15px] mt-0.5 block">{currentUser?.department || 'Operations'}</span>
          </div>
          <div className="bg-[#FAFBF9] p-3 sm:p-3.5 rounded-md border border-[#E7E5DE]">
            <span className="text-[#7A8178] text-[10px] sm:text-[11px] uppercase font-bold block">Refinery Site</span>
            <span className="font-bold text-[#263026] text-[14px] sm:text-[15px] mt-0.5 block">MRPL Zone A Complex</span>
          </div>
        </div>
      </div>

      {/* Hardware Specifications */}
      <div className="gov-card p-4 sm:p-6 space-y-3">
        <div className="flex items-center gap-2 font-bold text-[14px] sm:text-[15px] text-[#263026] border-b border-[#E7E5DE] pb-2">
          <Layers className="w-4 h-4 text-[#5C822D]" />
          <span>Active Wearable Dosimeter Technical Details</span>
        </div>

        <div className="space-y-2 text-[12px] sm:text-[13px] text-[#596158]">
          <div className="flex justify-between">
            <span>Cartridge Serial Code:</span>
            <strong className="text-[#263026] font-mono">{activeDosimeter?.dosimeterCode || 'DOS-001'}</strong>
          </div>
          <div className="flex justify-between gap-2">
            <span>Chemical Reagent:</span>
            <span className="text-[#263026] text-right">Cu-PAN & Bi(III) (Lead-Free)</span>
          </div>
          <div className="flex justify-between">
            <span>Manufacturing Batch:</span>
            <span className="text-[#263026] font-mono">{activeDosimeter?.batchId || 'BATCH-2026-A'}</span>
          </div>
          <div className="flex justify-between">
            <span>Color Calibration Standard:</span>
            <span className="text-[#5C822D] font-semibold">ISO/CIE Standard D65</span>
          </div>
        </div>
      </div>

      {/* Administrative Actions */}
      <div className="gov-card p-4 sm:p-6 space-y-3 sm:space-y-4">
        <h3 className="font-bold text-[14px] sm:text-[15px] text-[#263026]">Terminal Actions</h3>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          <button
            onClick={handleLogout}
            className="gov-btn-danger text-[13px] sm:text-[14px] h-11 justify-center"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Worker Terminal</span>
          </button>

          <button
            onClick={handleReset}
            className="gov-btn-secondary text-[13px] sm:text-[14px] h-11 justify-center"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

    </div>
  );
}
