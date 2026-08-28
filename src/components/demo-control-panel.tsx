'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';
import { useRouter } from 'next/navigation';
import { getScanPipeline } from '@/services/scientific/scan-processing-pipeline';
import { DemoScenario } from '@/types';
import { RotateCcw, X } from 'lucide-react';

export function DemoControlPanel() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { currentUser, activeShift, activeDosimeter, addScan, resetDemo } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'd' || e.key === 'D') &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        setOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerScenario = async (scenario: DemoScenario) => {
    const pipeline = getScanPipeline();
    const workerId = currentUser?.id || 'worker-001';
    const shiftId = activeShift?.id || 'shift-001';
    const dosimeterId = activeDosimeter?.dosimeterCode || 'DOS-001';

    const scan = await pipeline.processScenario(scenario, workerId, shiftId, dosimeterId);
    addScan(scan);
    setOpen(false);
    router.push(`/worker/result?scanId=${scan.id}`);
  };

  const handleReset = () => {
    resetDemo();
    setOpen(false);
    router.push('/worker');
  };

  return (
    <>
      {/* Floating Demo Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-16 sm:bottom-4 right-3 sm:right-4 z-30 bg-white/95 backdrop-blur-2xs hover:bg-[#F7F6F1] text-[#263026] text-[11px] sm:text-[12px] font-semibold px-2.5 sm:px-3 py-1.5 rounded-md shadow-md border border-[#E7E5DE] flex items-center gap-1.5 sm:gap-2 transition-all"
        title="Evaluator Test Helper (Press 'D' key)"
      >
        <span className="w-2 h-2 rounded-full bg-[#5C822D]" />
        <span>Demo Controls</span>
        <kbd className="bg-[#F7F6F1] text-[#7A8178] px-1 py-0.2 rounded text-[10px] border border-[#E7E5DE] hidden sm:inline">D</kbd>
      </button>

      {/* Modal Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md max-w-md w-full shadow-lg border border-[#E7E5DE] overflow-hidden space-y-4 p-5 text-[14px]">
            
            <div className="flex items-center justify-between border-b border-[#E7E5DE] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5C822D]" />
                <h3 className="font-bold text-[16px] text-[#263026]">Evaluator Test Helper</h3>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#7A8178] hover:text-[#263026]">
                <X size={18} />
              </button>
            </div>

            <p className="text-[13px] text-[#596158] leading-relaxed">
              Inject calibrated exposure data to test the colorimetric pipeline, 8h TWA calculation, and OSHA compliance gating:
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => triggerScenario(DemoScenario.NORMAL)}
                className="p-2.5 rounded bg-[#FAFBF9] hover:bg-[#EEF3E7] border border-[#E7E5DE] text-left"
              >
                <div className="font-semibold text-[13px] text-[#35551F]">1. Normal (3.2 ppm·h)</div>
                <div className="text-[11px] text-[#7A8178]">Safe shift background</div>
              </button>

              <button
                onClick={() => triggerScenario(DemoScenario.ELEVATED)}
                className="p-2.5 rounded bg-[#FAFBF9] hover:bg-[#FAEFE7] border border-[#E7E5DE] text-left"
              >
                <div className="font-semibold text-[13px] text-[#C96B32]">2. Elevated (12.4 ppm·h)</div>
                <div className="text-[11px] text-[#7A8178]">Caution advised</div>
              </button>

              <button
                onClick={() => triggerScenario(DemoScenario.HIGH)}
                className="p-2.5 rounded bg-[#FAFBF9] hover:bg-[#FAEFE7] border border-[#E7E5DE] text-left"
              >
                <div className="font-semibold text-[13px] text-[#D47A32]">3. High (18.6 ppm·h)</div>
                <div className="text-[11px] text-[#7A8178]">Nearing OSHA limit</div>
              </button>

              <button
                onClick={() => triggerScenario(DemoScenario.CRITICAL)}
                className="p-2.5 rounded bg-[#FAFBF9] hover:bg-[#F7EAEA] border border-[#E7E5DE] text-left"
              >
                <div className="font-semibold text-[13px] text-[#A94442]">4. Critical (24.8 ppm·h)</div>
                <div className="text-[11px] text-[#7A8178]">Emergency evacuation</div>
              </button>

              <button
                onClick={() => triggerScenario(DemoScenario.INVALID)}
                className="p-2.5 rounded bg-[#FAFBF9] hover:bg-[#F0EFE9] border border-[#E7E5DE] text-left"
              >
                <div className="font-semibold text-[13px] text-[#596158]">5. Invalid (Glare)</div>
                <div className="text-[11px] text-[#7A8178]">Fails quality gate</div>
              </button>

              <button
                onClick={() => triggerScenario(DemoScenario.OUT_OF_RANGE)}
                className="p-2.5 rounded bg-[#FAFBF9] hover:bg-[#F0EFE9] border border-[#E7E5DE] text-left"
              >
                <div className="font-semibold text-[13px] text-[#596158]">6. Out-of-Range</div>
                <div className="text-[11px] text-[#7A8178]">Exceeds 30.0 limit</div>
              </button>
            </div>

            <div className="pt-3 border-t border-[#E7E5DE] flex items-center justify-between">
              <button
                onClick={handleReset}
                className="gov-btn-secondary text-[12px] h-8 px-2.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo State</span>
              </button>

              <span className="text-[11px] text-[#7A8178]">Press &apos;D&apos; to toggle</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
