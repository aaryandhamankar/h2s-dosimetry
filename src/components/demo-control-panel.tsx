'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/app-store';
import { DemoScenario } from '@/types';
import { RotateCcw, X, Timer, FlaskConical } from 'lucide-react';
import { sfx } from '@/lib/sound-effects';

export function DemoControlPanel() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { resetDemo, setShiftElapsedMinutes, language } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        return;
      }
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
  }, [open]);

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

  // On mobile, hide floating pill while on /scan to prevent blocking camera controls
  const isScanPage = pathname === '/scan';

  return (
    <>
      {/* Clean Floating Demo Scenarios Capsule */}
      <div className={`fixed right-3 sm:right-6 bottom-20 sm:bottom-6 z-40 select-none ${
        isScanPage ? 'hidden sm:block' : 'block'
      }`}>
        <button
          type="button"
          onClick={() => {
            sfx.playClick();
            setOpen(true);
          }}
          className="group relative flex items-center gap-1.5 bg-[#FAF8F3]/95 backdrop-blur-md hover:bg-white text-[#263026] border border-[#D8D2C2] hover:border-[#5C822D] shadow-xs hover:shadow-md rounded-full px-2.5 sm:px-3.5 py-1 sm:py-1.5 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer text-[11px] sm:text-[12.5px] font-semibold"
          title="Open Evaluator Demo Scenarios (Shortcut: 'D')"
          aria-label="Demo Scenarios"
        >
          <FlaskConical size={13} className="text-[#5C822D]" />
          <span>
            {language === 'hi' 
              ? 'डेमो टेस्ट' 
              : language === 'kn'
              ? 'ಡೆಮೊ ಪರೀಕ್ಷೆ'
              : language === 'gu'
              ? 'ડેમો ટેસ્ટ'
              : 'Demo'}
          </span>
          <kbd className="bg-white px-1 py-0.2 rounded border border-[#D8D2C2] text-[10px] font-mono text-[#7A8178] hidden sm:inline">D</kbd>
        </button>
      </div>

      {/* Modal Dialog */}
      {open && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setOpen(false)}
        >
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-scenarios-title"
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8E2D5] space-y-3.5 sm:space-y-4 p-4 sm:p-6 text-[14px] my-auto"
            onClick={e => e.stopPropagation()}
          >
            
            <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-3">
              <h3 id="demo-scenarios-title" className="font-black text-[16px] sm:text-[17px] text-[#263026]">
                {language === 'hi' 
                  ? 'डेमो परीक्षण परिदृश्य' 
                  : language === 'kn'
                  ? 'ಡೆಮೊ ಪರೀಕ್ಷಾ ಸನ್ನಿವೇಶಗಳು'
                  : language === 'gu'
                  ? 'ડેમો ટેસ્ટ દૃશ્યો'
                  : 'Demo Test Scenarios'}
              </h3>
              <button 
                onClick={() => setOpen(false)} 
                className="text-[#7A8178] hover:text-[#263026] p-1 rounded-md hover:bg-[#F4EFE6] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-[12px] sm:text-[13px] text-[#596158]">
              {language === 'hi' 
                ? '8-चरणीय सत्यापन पाइपलाइन शुरू करने और एक्सपोज़र परिणाम देखने के लिए नीचे से कोई भी कैलिब्रेटेड परिदृश्य चुनें:' 
                : language === 'kn'
                ? '8-ಹಂತದ ಪರಿಶೀಲನಾ ಪೈಪ್‌ಲೈನ್ ಆರಂಭಿಸಲು ಮತ್ತು ಎಕ್ಸ್‌ಪೋಶರ್ ಫಲಿತಾಂಶ ವೀಕ್ಷಿಸಲು ಕೆಳಗಿನ ಯಾವುದೇ ಮಾಪನಾಂಕ ನಿರ್ಣಯ ಸನ್ನಿವೇಶವನ್ನು ಆಯ್ಕೆಮಾಡಿ:'
                : language === 'gu'
                ? '8-તબક્કાની ચકાસણી પાઇપલાઇન શરૂ કરવા અને એક્સપોઝર પરિણામ જોવા માટે નીચે આપેલા કેલિબ્રેટેડ દૃશ્યોમાંથી કોઈપણ પસંદ કરો:'
                : 'Select any calibrated scenario below to trigger the 8-stage verification pipeline and inspect the decoded exposure result:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => triggerScenario(DemoScenario.NORMAL)}
                className="p-3 rounded-xl bg-[#FAF7F0] hover:bg-[#EDF3E4] border border-[#E8E2D5] hover:border-[#5C822D] text-left transition-all space-y-0.5 cursor-pointer"
              >
                <div className="font-bold text-[13px] text-[#35551F]">
                  {language === 'hi' 
                    ? '1. सामान्य (3.2 ppm·h)' 
                    : language === 'kn'
                    ? '1. ಸಾಮಾನ್ಯ (3.2 ppm·h)'
                    : language === 'gu'
                    ? '1. સામાન્ય (3.2 ppm·h)'
                    : '1. Normal (3.2 ppm·h)'}
                </div>
                <div className="text-[11px] text-[#596158]">
                  {language === 'hi' 
                    ? 'सुरक्षित बेसलाइन · साफ पृष्ठभूमि' 
                    : language === 'kn'
                    ? 'ಸುರಕ್ಷಿತ ಬೇಸ್‌ಲೈನ್ · ಸ್ವಚ್ಛ ಹಿನ್ನೆಲೆ'
                    : language === 'gu'
                    ? 'સુરક્ષિત બેઝલાઇન · સ્વચ્છ પૃષ્ઠભૂમિ'
                    : 'Safe baseline · Clean background'}
                </div>
              </button>

              <button
                onClick={() => triggerScenario(DemoScenario.ELEVATED)}
                className="p-3 rounded-xl bg-[#FAF7F0] hover:bg-[#FAF5E8] border border-[#E8E2D5] hover:border-[#B8860B] text-left transition-all space-y-0.5 cursor-pointer"
              >
                <div className="font-bold text-[13px] text-[#B8860B]">
                  {language === 'hi' 
                    ? '2. मध्यम (12.4 ppm·h)' 
                    : language === 'kn'
                    ? '2. ಮಧ್ಯಮ (12.4 ppm·h)'
                    : language === 'gu'
                    ? '2. મધ્યમ (12.4 ppm·h)'
                    : '2. Elevated (12.4 ppm·h)'}
                </div>
                <div className="text-[11px] text-[#596158]">
                  {language === 'hi' 
                    ? 'मध्यम CuS प्रतिक्रिया · सावधानी' 
                    : language === 'kn'
                    ? 'ಮಧ್ಯಮ CuS ಪ್ರತಿಕ್ರಿಯೆ · ಎಚ್ಚರಿಕೆ'
                    : language === 'gu'
                    ? 'મધ્યમ CuS પ્રતિક્રિયા · સાવચેતી'
                    : 'Moderate CuS reaction · Caution'}
                </div>
              </button>

              <button
                onClick={() => triggerScenario(DemoScenario.HIGH)}
                className="p-3 rounded-xl bg-[#FAF7F0] hover:bg-[#FAF2EB] border border-[#E8E2D5] hover:border-[#C96B32] text-left transition-all space-y-0.5 cursor-pointer"
              >
                <div className="font-bold text-[13px] text-[#C96B32]">
                  {language === 'hi' 
                    ? '3. उच्च एक्सपोजर (18.6 ppm·h)' 
                    : language === 'kn'
                    ? '3. ಅಧಿಕ ಎಕ್ಸ್‌ಪೋಶರ್ (18.6 ppm·h)'
                    : language === 'gu'
                    ? '3. ઉચ્ચ એક્સપોઝર (18.6 ppm·h)'
                    : '3. High Exposure (18.6 ppm·h)'}
                </div>
                <div className="text-[11px] text-[#596158]">
                  {language === 'hi' 
                    ? '10 ppm 8h TWA के करीब · PPE जांचें' 
                    : language === 'kn'
                    ? '10 ppm 8h TWA ಹತ್ತಿರ · PPE ಪರಿಶೀಲಿಸಿ'
                    : language === 'gu'
                    ? '10 ppm 8h TWA નજીક · PPE તપાસો'
                    : 'Near 10 ppm 8h TWA · Inspect PPE'}
                </div>
              </button>

              <button
                onClick={() => triggerScenario(DemoScenario.CRITICAL)}
                className="p-3 rounded-xl bg-[#FAF7F0] hover:bg-[#F8ECEC] border border-[#E8E2D5] hover:border-[#A94442] text-left transition-all space-y-0.5 cursor-pointer"
              >
                <div className="font-bold text-[13px] text-[#A94442]">
                  {language === 'hi' 
                    ? '4. गंभीर अलार्म (24.8 ppm·h)' 
                    : language === 'kn'
                    ? '4. ತುರ್ತು ಎಚ್ಚರಿಕೆ (24.8 ppm·h)'
                    : language === 'gu'
                    ? '4. ગંભીર ચેતવણી (24.8 ppm·h)'
                    : '4. Critical Alarm (24.8 ppm·h)'}
                </div>
                <div className="text-[11px] text-[#596158]">
                  {language === 'hi' 
                    ? 'सीमा से अधिक · आपातकालीन निकासी' 
                    : language === 'kn'
                    ? 'ಮಿತಿ ಮೀರಿದೆ · ತುರ್ತು ಸ್ಥಳಾಂತರ'
                    : language === 'gu'
                    ? 'મર્યાદા બહાર · કટોકટી સ્થળાંતર'
                    : 'Exceeds ceiling · Evacuation'}
                </div>
              </button>

              <button
                onClick={() => triggerScenario(DemoScenario.INVALID)}
                className="p-3 rounded-xl bg-[#FAF7F0] hover:bg-[#F4EFE6] border border-[#E8E2D5] text-left transition-all space-y-0.5 cursor-pointer"
              >
                <div className="font-bold text-[13px] text-[#596158]">
                  {language === 'hi' 
                    ? '5. अमान्य छवि (चमक/धुंधला)' 
                    : language === 'kn'
                    ? '5. ಅಮಾನ್ಯ ಚಿತ್ರ (ಗ್ಲೇರ್ / ಬ್ಲರ್)'
                    : language === 'gu'
                    ? '5. અમાન્ય છબી (ગ્લેર / બ્લર)'
                    : '5. Invalid (Glare / Blur)'}
                </div>
                <div className="text-[11px] text-[#7A8178]">
                  {language === 'hi' 
                    ? 'ऑप्टिकल गुणवत्ता अस्वीकृति' 
                    : language === 'kn'
                    ? 'ಆಪ್ಟಿಕಲ್ ಗುಣಮಟ್ಟ ತಿರಸ್ಕಾರ'
                    : language === 'gu'
                    ? 'ઓપ્ટિકલ ગુણવત્તા અસ્વીકાર'
                    : 'Optical quality gate refusal'}
                </div>
              </button>

              <button
                onClick={() => triggerScenario(DemoScenario.OUT_OF_RANGE)}
                className="p-3 rounded-xl bg-[#FAF7F0] hover:bg-[#FAF2EB] border border-[#E8E2D5] hover:border-[#9C4124] text-left transition-all space-y-0.5 cursor-pointer"
              >
                <div className="font-bold text-[13px] text-[#9C4124]">
                  {language === 'hi' 
                    ? '6. सीमा से अधिक (>30 ppm·h)' 
                    : language === 'kn'
                    ? '6. ಮಿತಿ ಮೀರಿದ್ದು (>30 ppm·h)'
                    : language === 'gu'
                    ? '6. મર્યાદા બહાર (>30 ppm·h)'
                    : '6. Out-of-Range (>30 ppm·h)'}
                </div>
                <div className="text-[11px] text-[#7A8178]">
                  {language === 'hi' 
                    ? 'सेंसर संतृप्त · लैब GC परीक्षण' 
                    : language === 'kn'
                    ? 'ಸೆನ್ಸರ್ ಸ್ಯಾಚುರೇಟೆಡ್ · ಲ್ಯಾಬ್ GC ಪರೀಕ್ಷೆ'
                    : language === 'gu'
                    ? 'સેન્સર સંતૃપ્ત · લેબ GC ટેસ્ટ'
                    : 'Sensor saturated · GC lab test'}
                </div>
              </button>
            </div>

            {/* Shift Exposure Duration & Mid-Shift Simulation Presets */}
            <div className="pt-2.5 border-t border-[#E8E2D5] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-[12.5px] text-[#263026]">
                  <Timer className="w-3.5 h-3.5 text-[#5C822D]" />
                  <span>
                    {language === 'hi' 
                      ? 'शिफ्ट अवधि व मिड-शिफ्ट प्रीसेट' 
                      : language === 'kn'
                      ? 'ಶಿಫ್ಟ್ ಅವಧಿ & ಮಿಡ್-ಶಿಫ್ಟ್ ಪೂರ್ವನಿಗದಿಗಳು'
                      : language === 'gu'
                      ? 'શિફ્ટ અવધિ અને મિડ-શિફ્ટ પ્રીસેટ્સ'
                      : 'Shift Duration & Mid-Shift Presets'}
                  </span>
                </div>
                <span className="text-[10.5px] text-[#7A8178]">
                  {language === 'hi' 
                    ? '8h TWA गणना सिमुलेशन' 
                    : language === 'kn'
                    ? '8h TWA ಲೆಕ್ಕಾಚಾರ ಸಿಮ್ಯುಲೇಶನ್'
                    : language === 'gu'
                    ? '8h TWA ગણતરી સિમ્યુલેશન'
                    : 'Simulate 8h TWA'}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    sfx.playClick();
                    setShiftElapsedMinutes(0);
                  }}
                  className="p-1.5 rounded-lg border border-[#E8E2D5] bg-[#FAF7F0] hover:bg-[#EDF3E4] hover:border-[#5C822D] text-[#263026] text-center transition-colors cursor-pointer"
                >
                  0h (Start)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sfx.playClick();
                    setShiftElapsedMinutes(120);
                  }}
                  className="p-1.5 rounded-lg border border-[#E8E2D5] bg-[#FAF7F0] hover:bg-[#EDF3E4] hover:border-[#5C822D] text-[#263026] text-center transition-colors cursor-pointer"
                >
                  2h (Mid)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sfx.playClick();
                    setShiftElapsedMinutes(240);
                  }}
                  className="p-1.5 rounded-lg border border-[#E8E2D5] bg-[#FAF7F0] hover:bg-[#EDF3E4] hover:border-[#5C822D] text-[#263026] text-center transition-colors cursor-pointer"
                >
                  4h (Half)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sfx.playClick();
                    setShiftElapsedMinutes(360);
                  }}
                  className="p-1.5 rounded-lg border border-[#E8E2D5] bg-[#FAF7F0] hover:bg-[#EDF3E4] hover:border-[#5C822D] text-[#263026] text-center transition-colors cursor-pointer"
                >
                  6h (Late)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sfx.playClick();
                    setShiftElapsedMinutes(480);
                  }}
                  className="p-1.5 rounded-lg border border-[#E8E2D5] bg-[#FAF7F0] hover:bg-[#EDF3E4] hover:border-[#5C822D] text-[#263026] text-center transition-colors cursor-pointer"
                >
                  8h (Full)
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E2D5] flex items-center justify-between">
              <button
                onClick={handleReset}
                className="gov-btn-secondary text-[12px] h-8 px-3 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>
                  {language === 'hi' 
                    ? 'डेमो रीसेट करें' 
                    : language === 'kn'
                    ? 'ಡೆಮೊ ಮರುಹೊಂದಿಸಿ'
                    : language === 'gu'
                    ? 'ડેમો રીસેટ કરો'
                    : 'Reset Demo State'}
                </span>
              </button>

              <button
                onClick={() => setOpen(false)}
                className="gov-btn-secondary text-[12px] h-8 px-4 cursor-pointer"
              >
                {language === 'hi' 
                  ? 'बंद करें' 
                  : language === 'kn'
                  ? 'ಮುಚ್ಚಿ'
                  : language === 'gu'
                  ? 'બંધ કરો'
                  : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
