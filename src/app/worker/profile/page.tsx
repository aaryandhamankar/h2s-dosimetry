'use client';

import { useAppStore } from '@/stores/app-store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { 
  LogOut, 
  RotateCcw, 
  Layers, 
  CheckCircle2,
  Edit3,
  X,
  Save,
} from 'lucide-react';

export default function WorkerProfilePage() {
  const { currentUser, logout, resetDemo, activeDosimeter, updateUserProfile } = useAppStore();
  const router = useRouter();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(currentUser?.displayName || 'Rajesh Kumar');
  const [editDept, setEditDept] = useState(currentUser?.department || 'Operations');
  const [editSite, setEditSite] = useState(currentUser?.site || 'Refinery Zone A');
  const [editCode, setEditCode] = useState(currentUser?.workerCode || 'W-001');

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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      displayName: editName,
      department: editDept,
      site: editSite,
      workerCode: editCode,
    });
    setEditModalOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Top Header */}
      <div className="border-b border-[#E7E5DE] pb-3 sm:pb-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] sm:text-[12px] font-bold text-[#5C822D] uppercase tracking-wider block">
            Personnel Dossier
          </span>
          <h1 className="text-[18px] sm:text-[22px] font-bold text-[#263026]">Operator Profile & Hardware Specs</h1>
          <p className="text-[13px] sm:text-[14px] text-[#596158]">Credentials and active sensor cartridge specifications</p>
        </div>

        <button
          onClick={() => {
            setEditName(currentUser?.displayName || 'Rajesh Kumar');
            setEditDept(currentUser?.department || 'Operations');
            setEditSite(currentUser?.site || 'Refinery Zone A');
            setEditCode(currentUser?.workerCode || 'W-001');
            setEditModalOpen(true);
          }}
          className="gov-btn-secondary text-[12px] h-9 px-3 flex items-center gap-1.5"
        >
          <Edit3 size={13} className="text-[#5C822D]" />
          <span>Edit Profile</span>
        </button>
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
            <span className="font-bold text-[#263026] text-[14px] sm:text-[15px] mt-0.5 block">{currentUser?.site || 'Refinery Zone A'}</span>
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

      {/* EDIT PROFILE MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-[#E7E5DE] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-4 border-b border-[#E7E5DE] flex items-center justify-between bg-[#FAFBF9]">
              <div className="flex items-center gap-2 font-bold text-[15px] text-[#263026]">
                <Edit3 className="w-4 h-4 text-[#5C822D]" />
                <span>Edit Profile Details</span>
              </div>
              <button 
                onClick={() => setEditModalOpen(false)}
                className="text-[#7A8178] hover:text-[#263026] p-1 rounded hover:bg-[#F0EFE9]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-4 sm:p-5 space-y-3.5 text-[13px]">
              <div>
                <label className="font-semibold text-[#263026] block mb-1">Full Name:</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 border border-[#D5D2C9] rounded-md bg-white text-[#263026] focus:outline-2 focus:outline-[#5C822D]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#263026] block mb-1">Worker Code:</label>
                  <input
                    type="text"
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    className="w-full p-2.5 border border-[#D5D2C9] rounded-md bg-white text-[#263026] font-mono focus:outline-2 focus:outline-[#5C822D]"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#263026] block mb-1">Department:</label>
                  <input
                    type="text"
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value)}
                    className="w-full p-2.5 border border-[#D5D2C9] rounded-md bg-white text-[#263026] focus:outline-2 focus:outline-[#5C822D]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#263026] block mb-1">Assigned Plant Work Area:</label>
                <input
                  type="text"
                  value={editSite}
                  onChange={(e) => setEditSite(e.target.value)}
                  className="w-full p-2.5 border border-[#D5D2C9] rounded-md bg-white text-[#263026] focus:outline-2 focus:outline-[#5C822D]"
                  required
                />
              </div>

              <div className="pt-3 border-t border-[#E7E5DE] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="gov-btn-secondary text-[12px] h-9 px-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gov-btn-primary text-[12px] h-9 px-4 font-semibold flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

