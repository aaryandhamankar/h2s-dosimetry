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
    <div className="space-y-6">
      
      {/* Top Header */}
      <div>
        <span className="text-[12px] font-bold text-[#5C822D] uppercase tracking-wider block">
          Personnel Dossier
        </span>
        <h1 className="text-[22px] font-bold text-[#263026]">Operator Profile & Hardware Specifications</h1>
        <p className="text-[14px] text-[#596158]">Personnel identification credentials and active chemical sensor specifications</p>
      </div>

      {/* Operator Identity Card */}
      <div className="gov-card p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-md bg-[#5C822D] text-white flex items-center justify-center font-bold text-lg">
            {currentUser?.displayName?.split(' ').map(n => n[0]).join('') || 'RK'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-bold text-[#263026]">{currentUser?.displayName || 'Rajesh Kumar'}</h2>
              <span className="gov-badge gov-badge-normal text-[11px]">
                <CheckCircle2 className="w-3 h-3" /> Certified Operator
              </span>
            </div>
            <p className="text-[13px] text-[#596158] mt-0.5">Role: Chemical Plant Operator · Shift Team A</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#E7E5DE] text-[13px] text-[#596158]">
          <div className="bg-[#FAFBF9] p-3.5 rounded-md border border-[#E7E5DE]">
            <span className="text-[#7A8178] text-[11px] uppercase font-bold block">Worker ID Code</span>
            <span className="font-bold text-[#263026] text-[15px] mt-0.5 block">{currentUser?.workerCode || 'W-001'}</span>
          </div>
          <div className="bg-[#FAFBF9] p-3.5 rounded-md border border-[#E7E5DE]">
            <span className="text-[#7A8178] text-[11px] uppercase font-bold block">Assigned Unit</span>
            <span className="font-bold text-[#263026] text-[15px] mt-0.5 block">{currentUser?.department || 'Operations'}</span>
          </div>
          <div className="bg-[#FAFBF9] p-3.5 rounded-md border border-[#E7E5DE]">
            <span className="text-[#7A8178] text-[11px] uppercase font-bold block">Refinery Site</span>
            <span className="font-bold text-[#263026] text-[15px] mt-0.5 block">MRPL Zone A Complex</span>
          </div>
        </div>
      </div>

      {/* Hardware Specifications */}
      <div className="gov-card p-6 space-y-3">
        <div className="flex items-center gap-2 font-bold text-[15px] text-[#263026] border-b border-[#E7E5DE] pb-2">
          <Layers className="w-4 h-4 text-[#5C822D]" />
          <span>Active Wearable Dosimeter Technical Details</span>
        </div>

        <div className="space-y-2 text-[13px] text-[#596158]">
          <div className="flex justify-between">
            <span>Cartridge Serial Code:</span>
            <strong className="text-[#263026]">{activeDosimeter?.dosimeterCode || 'DOS-001'}</strong>
          </div>
          <div className="flex justify-between">
            <span>Chemical Reagent:</span>
            <span className="text-[#263026]">Copper-PAN & Bismuth(III) Chemosensor (Lead-Free)</span>
          </div>
          <div className="flex justify-between">
            <span>Manufacturing Batch:</span>
            <span className="text-[#263026]">{activeDosimeter?.batchId || 'BATCH-2026-A'}</span>
          </div>
          <div className="flex justify-between">
            <span>Color Calibration Standard:</span>
            <span className="text-[#5C822D] font-semibold">CIE Standard D65 Bradford CIELAB</span>
          </div>
        </div>
      </div>

      {/* Administrative Actions */}
      <div className="gov-card p-6 space-y-4">
        <h3 className="font-bold text-[15px] text-[#263026]">Terminal Actions</h3>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleLogout}
            className="gov-btn-danger text-[14px]"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Worker Terminal</span>
          </button>

          <button
            onClick={handleReset}
            className="gov-btn-secondary text-[14px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

    </div>
  );
}
