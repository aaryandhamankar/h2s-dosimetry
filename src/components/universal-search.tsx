'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/app-store';
import { DEMO_WORKERS } from '@/data/demo-workers';
import { 
  Search, 
  X, 
  User, 
  Layers, 
  FileText, 
  Activity, 
  ChevronRight,
} from 'lucide-react';
import { formatDose } from '@/lib/utils';

export function UniversalSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const { scans, alerts } = useAppStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'ALL' | 'WORKERS' | 'DOSIMETERS' | 'ALERTS' | 'SOP'>('ALL');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search Personnel
  const matchedWorkers = DEMO_WORKERS.filter(w => 
    !q || w.displayName.toLowerCase().includes(q) || w.workerCode.toLowerCase().includes(q) || w.department.toLowerCase().includes(q)
  );

  // Search Dosimeters
  const dosimeters = ['DOS-001', 'DOS-002', 'DOS-003', 'DOS-004', 'DOS-005'];
  const matchedDosimeters = dosimeters.filter(d => !q || d.toLowerCase().includes(q));

  // Search Scans
  const matchedScans = scans.filter(s =>
    !q || s.id.toLowerCase().includes(q) || s.dosimeterId.toLowerCase().includes(q) || s.workerId.toLowerCase().includes(q)
  ).slice(0, 5);

  // SOP standards topics
  const sopTopics = [
    { title: 'OSHA Permissible Exposure Limit (PEL)', desc: '10 ppm 8-hour Time-Weighted Average (TWA) ceiling', link: '/hse/exposure' },
    { title: 'Copper-PAN & Bismuth(III) Chemosensor Specs', desc: 'Cu-PAN / Bi³⁺ + H₂S → CuS / Bi₂S₃↓ non-toxic reaction kinetics', link: '/hse/technical' },
    { title: 'ISO/CIE Standard D65 4-Patch Colorimetry', desc: 'Bradford chromatic adaptation & CIE76 ΔE*ab formulation', link: '/hse/technical' },
    { title: 'Refinery Emergency Incident Response', desc: 'SOP for Critical (> 20 ppm·h) exposure evacuation protocol', link: '/hse/alerts' },
  ].filter(t => !q || t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q));

  const handleSelectWorker = () => {
    onClose();
    router.push('/hse/workers');
  };

  const handleSelectScan = (scanId: string) => {
    onClose();
    router.push(`/worker/result?scanId=${scanId}`);
  };

  const handleSelectSop = (link: string) => {
    onClose();
    router.push(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div 
        className="bg-white border border-[#E7E5DE] rounded-md max-w-2xl w-full shadow-lg overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Search Input Header */}
        <div className="p-4 border-b border-[#E7E5DE] flex items-center gap-3 bg-[#FAFBFD]">
          <Search className="w-5 h-5 text-[#5C822D] flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search workers, badge IDs, safety alerts, or SOP topics..."
            className="flex-1 bg-transparent text-[15px] text-[#263026] placeholder-[#7A8178] focus:outline-none"
            autoFocus
          />
          <button 
            onClick={onClose} 
            className="text-[#7A8178] hover:text-[#263026] p-1 rounded hover:bg-[#F0EFE9]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-[#F7F6F1] border-b border-[#E7E5DE] text-[12px] overflow-x-auto">
          {(['ALL', 'WORKERS', 'DOSIMETERS', 'ALERTS', 'SOP'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded font-semibold transition-all ${
                category === cat 
                  ? 'bg-[#5C822D] text-white' 
                  : 'bg-white border border-[#E7E5DE] text-[#596158] hover:bg-[#F0EFE9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-5 text-[14px]">
          
          {/* Workers Section */}
          {(category === 'ALL' || category === 'WORKERS') && matchedWorkers.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A8178] flex items-center gap-1.5">
                <User size={13} className="text-[#5C822D]" />
                <span>Personnel ({matchedWorkers.length})</span>
              </div>
              <div className="space-y-1">
                {matchedWorkers.map(w => (
                  <div
                    key={w.id}
                    onClick={() => handleSelectWorker()}
                    className="p-2.5 rounded hover:bg-[#F7F6F1] flex items-center justify-between cursor-pointer border border-transparent hover:border-[#E7E5DE]"
                  >
                    <div>
                      <span className="font-semibold text-[#263026]">{w.displayName}</span>
                      <span className="text-[12px] text-[#596158] ml-2 font-mono">({w.workerCode})</span>
                      <span className="text-[12px] text-[#7A8178] block">{w.department} · MRPL Zone A</span>
                    </div>
                    <ChevronRight size={16} className="text-[#7A8178]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dosimeters Section */}
          {(category === 'ALL' || category === 'DOSIMETERS') && matchedDosimeters.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A8178] flex items-center gap-1.5">
                <Layers size={13} className="text-[#5C822D]" />
                <span>Dosimeter Badges ({matchedDosimeters.length})</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {matchedDosimeters.map(d => (
                  <div
                    key={d}
                    onClick={() => handleSelectWorker()}
                    className="p-2 rounded border border-[#E7E5DE] bg-white hover:bg-[#F7F6F1] cursor-pointer flex items-center justify-between"
                  >
                    <span className="font-mono font-bold text-[13px] text-[#263026]">{d}</span>
                    <span className="text-[10px] text-[#5C822D] font-semibold">Active</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scans Section */}
          {(category === 'ALL' || category === 'ALERTS') && matchedScans.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A8178] flex items-center gap-1.5">
                <Activity size={13} className="text-[#5C822D]" />
                <span>Recent Shift Readings ({matchedScans.length})</span>
              </div>
              <div className="space-y-1">
                {matchedScans.map(s => (
                  <div
                    key={s.id}
                    onClick={() => handleSelectScan(s.id)}
                    className="p-2.5 rounded hover:bg-[#F7F6F1] flex items-center justify-between cursor-pointer border border-transparent hover:border-[#E7E5DE]"
                  >
                    <div>
                      <span className="font-mono text-[13px] font-bold text-[#263026]">{s.id.substring(0, 14)}...</span>
                      <span className="text-[12px] text-[#596158] ml-2">Badge: {s.dosimeterId}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[13px] text-[#263026] font-mono">
                        {s.exposureResult?.estimatedDose !== null ? `${formatDose(s.exposureResult?.estimatedDose ?? 0)} ppm·h` : '—'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SOP Documentation Topics */}
          {(category === 'ALL' || category === 'SOP') && sopTopics.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A8178] flex items-center gap-1.5">
                <FileText size={13} className="text-[#5C822D]" />
                <span>Standard Operating Procedures (SOP)</span>
              </div>
              <div className="space-y-1">
                {sopTopics.map(t => (
                  <div
                    key={t.title}
                    onClick={() => handleSelectSop(t.link)}
                    className="p-2.5 rounded hover:bg-[#F7F6F1] cursor-pointer border border-transparent hover:border-[#E7E5DE]"
                  >
                    <div className="font-semibold text-[#263026]">{t.title}</div>
                    <div className="text-[12px] text-[#596158]">{t.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#F7F6F1] border-t border-[#E7E5DE] text-[12px] text-[#7A8178] flex justify-between items-center">
          <span>Press <kbd className="bg-white px-1.5 py-0.5 rounded border border-[#E7E5DE] font-mono text-[10px]">ESC</kbd> to exit</span>
          <span className="text-[#35551F] font-semibold">MRPL Directory Search</span>
        </div>

      </div>
    </div>
  );
}
