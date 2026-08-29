'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';
import { useRouter } from 'next/navigation';
import { DemoScenario } from '@/types';
import { RotateCcw, X } from 'lucide-react';

export function DemoControlPanel() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { resetDemo } = useAppStore();

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

  const triggerScenario = (scenario: DemoScenario) => {
    setOpen(false);
    router.push(`/scan?scenario=${scenario}&t=${Date.now()}`);
  };

  const handleReset = () => {
    resetDemo();
    setOpen(false);
    router.push('/');
  };

  return (
    <>
      {/* Clean Floating Demo Button (No star icon) */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-40 bg-gradient-to-r from-[#5C822D] to-[#43651C] text-white text-[12px] sm:text-[13px] font-bold px-4 py-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center transition-all active:scale-95 hover:shadow-xl"
        title="Open Evaluator Demo Scenarios (Shortcut: 'D')"
      >
        <span>Demo</span>
      </button>

      {/* Modal Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#E8E2D5] overflow-hidden space-y-4 p-5 sm:p-6 text-[14px]">
            
            <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-3">
              <h3 className="font-black text-[16px] sm:text-[17px] text-[#263026]">
                Demo Test Scenarios
              </h3>
              <button 
                onClick={() => setOpen(false)} 
                className="text-[#7A8178] hover:text-[#263026] p-1 rounded-md hover:bg-[#F4EFE6]"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-[12px] sm:text-[13px] text-[#596158]">
              Select any calibrated scenario below to trigger the 8-stage verification pipeline and inspect the decoded exposure result:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => triggerScenario(DemoScenario.NORMAL)}
                className="p-3 rounded-xl bg-[#FAF7F0] hover:bg-[#EDF3E4] border border-[#E8E2D5] hover:border-[#5C822D] text-left transition-all space-y-0.5"
              >
                <div className="font-bold text-[13px] text-[#35551F]">1. Normal (3.2 ppm·h)</div>
                <div className="text-[11px] text-[#596158]">Safe baseline · Clean background</div>
              </button>

              <button
                onClick={() => triggerScenario(DemoScenario.ELEVATED)}
                className="p-3 rounded-xl bg-[#FAF7F0] hover:bg-[#FAF5E8] border border-[#E8E2D5] hover:border-[#B8860B] text-left transition-all space-y-0.5"
              >
                <div className="font-bold text-[13px] text-[#B8860B]">2. Elevated (12.4 ppm·h)</div>
                <div className="text-[11px] text-[#596158]">Moderate CuS reaction · Caution</div>
              </button>

              <button
                onClick={() => triggerScenario(DemoScenario.HIGH)}
                className="p-3 rounded-xl bg-[#FAF7F0] hover:bg-[#FAF2EB] border border-[#E8E2D5] hover:border-[#C96B32] text-left transition-all space-y-0.5"
              >
                <div className="font-bold text-[13px] text-[#C96B32]">3. High Exposure (18.6 ppm·h)</div>
                <div className="text-[11px] text-[#596158]">Near 10 ppm 8h TWA · Inspect PPE</div>
              </button>

              <button
                onClick={() => triggerScenario(DemoScenario.CRITICAL)}
                className="p-3 rounded-xl bg-[#FAF7F0] hover:bg-[#F8ECEC] border border-[#E8E2D5] hover:border-[#A94442] text-left transition-all space-y-0.5"
              >
                <div className="font-bold text-[13px] text-[#A94442]">4. Critical Alarm (24.8 ppm·h)</div>
                <div className="text-[11px] text-[#596158]">Exceeds ceiling · Evacuation</div>
              </button>

              <button
                onClick={() => triggerScenario(DemoScenario.INVALID)}
                className="p-3 rounded-xl bg-[#FAF7F0] hover:bg-[#F4EFE6] border border-[#E8E2D5] text-left transition-all space-y-0.5"
              >
                <div className="font-bold text-[13px] text-[#596158]">5. Invalid (Glare / Blur)</div>
                <div className="text-[11px] text-[#7A8178]">Optical quality gate refusal</div>
              </button>

              <button
                onClick={() => triggerScenario(DemoScenario.OUT_OF_RANGE)}
                className="p-3 rounded-xl bg-[#FAF7F0] hover:bg-[#FAF2EB] border border-[#E8E2D5] hover:border-[#9C4124] text-left transition-all space-y-0.5"
              >
                <div className="font-bold text-[13px] text-[#9C4124]">6. Out-of-Range (&gt;30 ppm·h)</div>
                <div className="text-[11px] text-[#7A8178]">Sensor saturated · GC lab test</div>
              </button>
            </div>

            <div className="pt-3 border-t border-[#E8E2D5] flex items-center justify-between">
              <button
                onClick={handleReset}
                className="gov-btn-secondary text-[12px] h-8 px-3 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo State</span>
              </button>

              <button
                onClick={() => setOpen(false)}
                className="gov-btn-secondary text-[12px] h-8 px-4"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
