'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';
import { useRouter } from 'next/navigation';
import { DemoScenario } from '@/types';
import { RotateCcw, X, Timer } from 'lucide-react';
import { sfx } from '@/lib/sound-effects';

export function DemoControlPanel() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { resetDemo, setShiftElapsedMinutes, language } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'd' || e.key === 'D') &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        sfx.playClick();
        setOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerScenario = (scenario: DemoScenario) => {
    sfx.playClick();
    setOpen(false);
    router.push(`/scan?scenario=${scenario}&t=${Date.now()}`);
  };

  const handleReset = () => {
    sfx.playClick();
    resetDemo();
    setOpen(false);
    router.push('/');
  };

  return (
    <>
      {/* Clean Floating Demo Button with Orange & Green Border */}
      <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-40 select-none">
        <button
          type="button"
          onClick={() => {
            sfx.playClick();
            setOpen(true);
          }}
          className="group relative p-[2px] rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer bg-gradient-to-r from-[#FF9933] to-[#138808]"
          title="Open Evaluator Demo Scenarios (Shortcut: 'D')"
        >
          <div className="bg-white rounded-full px-3.5 py-1.5 flex items-center justify-center gap-1.5 text-[#263026] font-bold text-[12px] sm:text-[13px]">
            <span className="h-2 w-2 rounded-full bg-[#FF9933] animate-pulse" />
            <span>{language === 'hi' ? 'डेमो' : 'Demo'}</span>
          </div>
        </button>
      </div>

      {/* Modal Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#E8E2D5] overflow-hidden space-y-4 p-5 sm:p-6 text-[14px]">
            
            <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-3">
              <h3 className="font-black text-[16px] sm:text-[17px] text-[#263026]">
                {language === 'hi' ? 'डेमो परीक्षण परिदृश्य' : 'Demo Test Scenarios'}
              </h3>
              <button 
                onClick={() => setOpen(false)} 
                className="text-[#7A8178] hover:text-[#263026] p-1 rounded-md hover:bg-[#F4EFE6]"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-[12px] sm:text-[13px] text-[#596158]">
              {language === 'hi' 
                ? '8-चरणीय सत्यापन पाइपलाइन शुरू करने और एक्सपोज़र परिणाम देखने के लिए नीचे से कोई भी कैलिब्रेटेड परिदृश्य चुनें:' 
                : 'Select any calibrated scenario below to trigger the 8-stage verification pipeline and inspect the decoded exposure result:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => triggerScenario(DemoScenario.NORMAL)}
                className="p-3 rounded-xl bg-[#FAF7F0] hover:bg-[#EDF3E4] border border-[#E8E2D5] hover:border-[#5C822D] text-left transition-all space-y-0.5"
              >
                <div className="font-bold text-[13px] text-[#35551F]">
                  {language === 'hi' ? '1. सामान्य (3.2 ppm·h)' : '1. Normal (3.2 ppm·h)'}
                </div>
                <div className="text-[11px] text-[#596158]">
                  {language === 'hi' ? 'सुरक्षित बेसलाइन · साफ पृष्ठभूमि' : 'Safe baseline · Clean background'}
                </div>
              </button>

              <button
                onClick={() => triggerScenario(DemoScenario.ELEVATED)}
                className="p-3 rounded-xl bg-[#FAF7F0] hover:bg-[#FAF5E8] border border-[#E8E2D5] hover:border-[#B8860B] text-left transition-all space-y-0.5"
              >
                <div className="font-bold text-[13px] text-[#B8860B]">
                  {language === 'hi' ? '2. मध्यम (12.4 ppm·h)' : '2. Elevated (12.4 ppm·h)'}
                </div>
                <div className="text-[11px] text-[#596158]">
                  {language === 'hi' ? 'मध्यम CuS प्रतिक्रिया · सावधानी' : 'Moderate CuS reaction · Caution'}
                </div>
              </button>

              <button
                onClick={() => triggerScenario(DemoScenario.HIGH)}
                className="p-3 rounded-xl bg-[#FAF7F0] hover:bg-[#FAF2EB] border border-[#E8E2D5] hover:border-[#C96B32] text-left transition-all space-y-0.5"
              >
                <div className="font-bold text-[13px] text-[#C96B32]">
                  {language === 'hi' ? '3. उच्च एक्सपोजर (18.6 ppm·h)' : '3. High Exposure (18.6 ppm·h)'}
                </div>
                <div className="text-[11px] text-[#596158]">
                  {language === 'hi' ? '10 ppm 8h TWA के करीब · PPE जांचें' : 'Near 10 ppm 8h TWA · Inspect PPE'}
                </div>
              </button>

              <button
                onClick={() => triggerScenario(DemoScenario.CRITICAL)}
                className="p-3 rounded-xl bg-[#FAF7F0] hover:bg-[#F8ECEC] border border-[#E8E2D5] hover:border-[#A94442] text-left transition-all space-y-0.5"
              >
                <div className="font-bold text-[13px] text-[#A94442]">
                  {language === 'hi' ? '4. गंभीर अलार्म (24.8 ppm·h)' : '4. Critical Alarm (24.8 ppm·h)'}
                </div>
                <div className="text-[11px] text-[#596158]">
                  {language === 'hi' ? 'सीमा से अधिक · आपातकालीन निकासी' : 'Exceeds ceiling · Evacuation'}
                </div>
              </button>

              <button
                onClick={() => triggerScenario(DemoScenario.INVALID)}
                className="p-3 rounded-xl bg-[#FAF7F0] hover:bg-[#F4EFE6] border border-[#E8E2D5] text-left transition-all space-y-0.5"
              >
                <div className="font-bold text-[13px] text-[#596158]">
                  {language === 'hi' ? '5. अमान्य छवि (चमक/धुंधला)' : '5. Invalid (Glare / Blur)'}
                </div>
                <div className="text-[11px] text-[#7A8178]">
                  {language === 'hi' ? 'ऑप्टिकल गुणवत्ता अस्वीकृति' : 'Optical quality gate refusal'}
                </div>
              </button>

              <button
                onClick={() => triggerScenario(DemoScenario.OUT_OF_RANGE)}
                className="p-3 rounded-xl bg-[#FAF7F0] hover:bg-[#FAF2EB] border border-[#E8E2D5] hover:border-[#9C4124] text-left transition-all space-y-0.5"
              >
                <div className="font-bold text-[13px] text-[#9C4124]">
                  {language === 'hi' ? '6. सीमा से अधिक (>30 ppm·h)' : '6. Out-of-Range (>30 ppm·h)'}
                </div>
                <div className="text-[11px] text-[#7A8178]">
                  {language === 'hi' ? 'सेंसर संतृप्त · लैब GC परीक्षण' : 'Sensor saturated · GC lab test'}
                </div>
              </button>
            </div>

            {/* Shift Exposure Duration & Mid-Shift Simulation Presets */}
            <div className="pt-2.5 border-t border-[#E8E2D5] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-[12.5px] text-[#263026]">
                  <Timer className="w-3.5 h-3.5 text-[#5C822D]" />
                  <span>{language === 'hi' ? 'शिफ्ट अवधि व मिड-शिफ्ट प्रीसेट' : 'Shift Duration & Mid-Shift Presets'}</span>
                </div>
                <span className="text-[10.5px] text-[#7A8178]">
                  {language === 'hi' ? '8h TWA गणना सिमुलेशन' : 'Simulate 8h TWA'}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    sfx.playClick();
                    setShiftElapsedMinutes(0);
                  }}
                  className="p-1.5 rounded-lg border border-[#E8E2D5] bg-[#FAF7F0] hover:bg-[#EDF3E4] hover:border-[#5C822D] text-[#263026] text-center transition-colors"
                >
                  0h (Start)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sfx.playClick();
                    setShiftElapsedMinutes(120);
                  }}
                  className="p-1.5 rounded-lg border border-[#E8E2D5] bg-[#FAF7F0] hover:bg-[#EDF3E4] hover:border-[#5C822D] text-[#263026] text-center transition-colors"
                >
                  2h (Mid)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sfx.playClick();
                    setShiftElapsedMinutes(240);
                  }}
                  className="p-1.5 rounded-lg border border-[#E8E2D5] bg-[#FAF7F0] hover:bg-[#EDF3E4] hover:border-[#5C822D] text-[#263026] text-center transition-colors"
                >
                  4h (Half)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sfx.playClick();
                    setShiftElapsedMinutes(360);
                  }}
                  className="p-1.5 rounded-lg border border-[#E8E2D5] bg-[#FAF7F0] hover:bg-[#EDF3E4] hover:border-[#5C822D] text-[#263026] text-center transition-colors"
                >
                  6h (Late)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sfx.playClick();
                    setShiftElapsedMinutes(480);
                  }}
                  className="p-1.5 rounded-lg border border-[#E8E2D5] bg-[#FAF7F0] hover:bg-[#EDF3E4] hover:border-[#5C822D] text-[#263026] text-center transition-colors"
                >
                  8h (Full)
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E2D5] flex items-center justify-between">
              <button
                onClick={handleReset}
                className="gov-btn-secondary text-[12px] h-8 px-3 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'डेमो रीसेट करें' : 'Reset Demo State'}</span>
              </button>

              <button
                onClick={() => setOpen(false)}
                className="gov-btn-secondary text-[12px] h-8 px-4"
              >
                {language === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
