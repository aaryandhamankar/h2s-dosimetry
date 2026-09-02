'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Camera, 
  BarChart3, 
  ScanLine, 
  ArrowRight,
  LayoutDashboard
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { TRANSLATIONS } from '@/lib/i18n';
import { sfx } from '@/lib/sound-effects';

export default function HomePage() {
  const { language } = useAppStore();
  const [navigatingTo, setNavigatingTo] = useState<'scanner' | 'hse' | null>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleNavigate = (dest: 'scanner' | 'hse') => {
    sfx.playClick();
    setNavigatingTo(dest);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(20);
      } catch {}
    }
  };

  return (
    <div className="w-full max-w-[900px] mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8 flex-1 flex flex-col justify-center select-none">
      
      {/* Sleek Interstitial Transition Bar when Navigating */}
      {navigatingTo && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5C822D] via-[#FFDE59] to-[#5C822D] z-50 animate-pulse" />
      )}

      <div className="space-y-4 sm:space-y-5 md:space-y-6 text-center">
        
        {/* ───────────────────────────────────────────────────────────── */}
        {/* HERO TITLE: CLEAN & MINIMAL                                   */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center justify-center space-y-1 max-w-xl mx-auto">
          <h1 className="text-[24px] sm:text-[30px] md:text-[34px] font-black text-[#263026] leading-tight tracking-tight">
            {language === 'hi' 
              ? 'H₂S डोसीमेट्री प्लेटफॉर्म' 
              : language === 'kn'
              ? 'H₂S ಡೋಸಿಮೆಟ್ರಿ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್'
              : language === 'gu'
              ? 'H₂S ડોસિમેટ્રી પ્લેટફોર્મ'
              : 'H₂S Dosimetry Platform'}
          </h1>
          <p className="text-[13px] sm:text-[15px] text-[#596158] font-normal leading-snug">
            {language === 'hi' 
              ? 'पैसिव रिस्टबैंड एक्सपोज़र मॉनिटरिंग' 
              : language === 'kn'
              ? 'ಪ್ಯಾಸಿವ್ ರಿಸ್ಟ್‌ಬ್ಯಾಂಡ್ ಎಕ್ಸ್‌ಪೋಶರ್ ಮಾನಿಟರಿಂಗ್'
              : language === 'gu'
              ? 'પેસિવ રિસ્ટબેન્ડ એક્સપોઝર મોનિટરિંગ'
              : 'Passive wristband exposure monitoring'}
          </p>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 2 UNIFIED HERO MODULES                                         */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 pt-1 sm:pt-2">
          
          {/* ════════════════════════════════════════════════════════════ */}
          {/* TILE 1: FIELD PERSONNEL (Check Your Exposure)               */}
          {/* ════════════════════════════════════════════════════════════ */}
          <Link
            href="/scan"
            onClick={() => handleNavigate('scanner')}
            className="group relative flex flex-col justify-between p-5 sm:p-6 md:p-7 rounded-3xl bg-gradient-to-br from-[#4D7324] via-[#3D5E1C] to-[#2E4814] text-white shadow-md hover:shadow-2xl hover:shadow-[#3D5E1C]/25 active:scale-[0.97] transition-all duration-300 text-left border-2 border-[#5E8A2C]/60 hover:border-[#86B84A] hover:-translate-y-1.5 overflow-hidden min-h-[215px] sm:min-h-[235px] md:min-h-[250px] cursor-pointer touch-manipulation"
          >
            {/* Ambient Radial Sheen */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 rounded-full bg-white/10 blur-2xl group-hover:scale-150 group-hover:bg-white/20 transition-all duration-700 pointer-events-none" />

            <div className="space-y-3 sm:space-y-3.5 relative z-10">
              
              {/* Header Icon & Category Badge */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-108 group-hover:-translate-y-0.5 group-hover:bg-white group-hover:text-[#35551F] group-active:scale-95">
                  <Camera className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
                </div>

                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-white/90 bg-white/15 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/20 uppercase shadow-2xs">
                  {language === 'hi' 
                    ? 'फील्ड कार्मिक' 
                    : language === 'kn'
                    ? 'ಫೀಲ್ಡ್ ಸಿಬ್ಬಂದಿ'
                    : language === 'gu'
                    ? 'ફીલ્ડ કર્મચારી'
                    : 'FIELD PERSONNEL'}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-[20px] sm:text-[24px] font-black text-white leading-tight group-hover:translate-x-0.5 transition-transform duration-300">
                  {t.enterWorker}
                </h2>
                <p className="text-[12.5px] sm:text-[13.5px] text-white/90 leading-snug mt-1 font-normal">
                  {t.enterWorkerSub}
                </p>
              </div>

            </div>

            {/* Bottom Action Footer Bar */}
            <div className="pt-3 sm:pt-3.5 mt-3 sm:mt-3.5 flex items-center justify-between border-t border-white/20 text-[12.5px] sm:text-[13.5px] font-bold relative z-10">
              <span className="flex items-center gap-2 text-white/95 group-hover:text-white transition-colors duration-300">
                <ScanLine className="w-4 h-4 text-white/90 group-hover:scale-110 transition-transform duration-300" />
                <span>
                  {language === 'hi' 
                    ? 'एक्सपोज़र स्कैनर खोलें' 
                    : language === 'kn'
                    ? 'ಎಕ್ಸ್‌ಪೋಶರ್ ಸ್ಕ್ಯಾನರ್ ತೆರೆಯಿರಿ'
                    : language === 'gu'
                    ? 'એક્સપોઝર સ્કેનર ખોલો'
                    : 'Open Exposure Scanner'}
                </span>
              </span>
              
              {/* Action Arrow Button */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#35551F] flex items-center justify-center shadow-md transition-all duration-300 group-hover:translate-x-1.5 group-hover:scale-105 group-hover:shadow-lg group-active:scale-95">
                <ArrowRight className="w-4 h-4 stroke-[2.6]" />
              </div>
            </div>

          </Link>

          {/* ════════════════════════════════════════════════════════════ */}
          {/* TILE 2: HSE TEAM (Safety Overview)                           */}
          {/* ════════════════════════════════════════════════════════════ */}
          <Link
            href="/hse"
            onClick={() => handleNavigate('hse')}
            className="group relative flex flex-col justify-between p-5 sm:p-6 md:p-7 rounded-3xl bg-white hover:bg-[#FAF7F0] text-[#263026] shadow-md hover:shadow-2xl hover:shadow-[#5C822D]/15 active:scale-[0.97] transition-all duration-300 text-left border-2 border-[#E8E2D5] hover:border-[#5C822D] hover:-translate-y-1.5 overflow-hidden min-h-[215px] sm:min-h-[235px] md:min-h-[250px] cursor-pointer touch-manipulation"
          >
            {/* Ambient Soft Green Glow */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 rounded-full bg-[#5C822D]/5 blur-3xl group-hover:scale-150 group-hover:bg-[#5C822D]/12 transition-all duration-700 pointer-events-none" />

            <div className="space-y-3 sm:space-y-3.5 relative z-10">
              
              {/* Header Icon & Category Badge */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#EDF3E4] border border-[#C6DCC0] text-[#5C822D] flex items-center justify-center shadow-xs transition-all duration-300 group-hover:scale-108 group-hover:-translate-y-0.5 group-hover:bg-[#5C822D] group-hover:text-white group-active:scale-95">
                  <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
                </div>

                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#5C822D] bg-[#EDF3E4] px-2.5 py-0.5 rounded-full border border-[#C6DCC0] uppercase shadow-2xs group-hover:bg-[#5C822D] group-hover:text-white group-hover:border-[#5C822D] transition-colors duration-300">
                  {language === 'hi' 
                    ? 'एचएसई टीम' 
                    : language === 'kn'
                    ? 'HSE ತಂಡ'
                    : language === 'gu'
                    ? 'HSE ટીમ'
                    : 'HSE TEAM'}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-[20px] sm:text-[24px] font-black text-[#263026] leading-tight group-hover:text-[#35551F] group-hover:translate-x-0.5 transition-all duration-300">
                  {t.openDashboard}
                </h2>
                <p className="text-[12.5px] sm:text-[13.5px] text-[#596158] leading-snug mt-1 font-normal">
                  {t.openDashboardSub}
                </p>
              </div>

            </div>

            {/* Bottom Action Footer Bar */}
            <div className="pt-3 sm:pt-3.5 mt-3 sm:mt-3.5 flex items-center justify-between border-t border-[#E8E2D5] group-hover:border-[#C6DCC0] text-[12.5px] sm:text-[13.5px] font-bold relative z-10 transition-colors duration-300">
              <span className="flex items-center gap-2 text-[#596158] group-hover:text-[#35551F] transition-colors duration-300">
                <LayoutDashboard className="w-4 h-4 text-[#5C822D] group-hover:scale-110 transition-transform duration-300" />
                <span>
                  {language === 'hi' 
                    ? 'एचएसई डैशबोर्ड खोलें' 
                    : language === 'kn'
                    ? 'HSE ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ'
                    : language === 'gu'
                    ? 'HSE ડેશબોર્ડ ખોલો'
                    : 'Open HSE Dashboard'}
                </span>
              </span>
              
              {/* Action Arrow Button */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FAF6EE] text-[#5C822D] flex items-center justify-center shadow-xs transition-all duration-300 group-hover:translate-x-1.5 group-hover:scale-105 group-hover:bg-[#5C822D] group-hover:text-white group-hover:shadow-md group-active:scale-95">
                <ArrowRight className="w-4 h-4 stroke-[2.6]" />
              </div>
            </div>

          </Link>

        </div>

      </div>
    </div>
  );
}

