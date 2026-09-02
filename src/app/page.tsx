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
import { feedback } from '@/lib/feedback';

export default function HomePage() {
  const { language } = useAppStore();
  const [navigatingTo, setNavigatingTo] = useState<'scanner' | 'hse' | null>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleNavigate = (dest: 'scanner' | 'hse') => {
    feedback.tap();
    setNavigatingTo(dest);
  };

  return (
    <div className="w-full max-w-[960px] mx-auto px-4 sm:px-6 py-4 sm:py-8 flex-1 flex flex-col justify-center select-none min-h-[calc(100dvh-120px)] sm:min-h-0">
      
      {/* Sleek Interstitial Transition Bar when Navigating */}
      {navigatingTo && (
        <div className="fixed top-0 left-0 right-0 h-0.5 bg-[#5C822D] z-50 animate-pulse" />
      )}

      <div className="space-y-4 sm:space-y-6 text-center flex-1 flex flex-col justify-center py-1 sm:py-2">
        
        {/* ───────────────────────────────────────────────────────────── */}
        {/* HERO TITLE: CLEAN & MINIMAL                                   */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center justify-center space-y-1.5 max-w-xl mx-auto flex-shrink-0">
          <h1 className="text-[26px] sm:text-[32px] md:text-[36px] font-black text-[#263026] leading-tight tracking-tight">
            {language === 'hi' 
              ? 'H₂S डोसीमेट्री प्लेटफॉर्म' 
              : language === 'kn'
              ? 'H₂S ಡೋಸಿಮೆಟ್ರಿ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್'
              : language === 'gu'
              ? 'H₂S ડોસિમેટ્રી પ્લેટફોર્મ'
              : 'H₂S Dosimetry Platform'}
          </h1>
          <p className="text-[13.5px] sm:text-[15px] text-[#596158] font-normal leading-snug">
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
        {/* 2 UNIFIED HERO MODULES (Dynamically expand on mobile & desktop) */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 flex-1 pt-1">
          
          {/* ════════════════════════════════════════════════════════════ */}
          {/* TILE 1: FIELD PERSONNEL (Check Your Exposure)               */}
          {/* ════════════════════════════════════════════════════════════ */}
          <Link
            href="/scan"
            onClick={() => handleNavigate('scanner')}
            className="group relative flex flex-col justify-between p-6 sm:p-7 md:p-8 rounded-3xl bg-gradient-to-br from-[#4D7324] via-[#3D5E1C] to-[#2E4814] text-white shadow-md hover:shadow-xl active:scale-[0.98] transition-all duration-200 text-left border border-[#5E8A2C]/60 hover:border-[#86B84A] hover:-translate-y-0.5 overflow-hidden flex-1 min-h-[230px] sm:min-h-[250px] md:min-h-[270px] cursor-pointer touch-manipulation"
          >
            {/* Ambient Radial Sheen */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 rounded-full bg-white/10 blur-2xl group-hover:scale-125 group-hover:bg-white/15 transition-all duration-500 pointer-events-none" />

            <div className="space-y-4 sm:space-y-5 relative z-10">
              
              {/* Header Icon & Category Badge */}
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-xs transition-all duration-200 group-hover:bg-white group-hover:text-[#35551F]">
                  <Camera className="w-6 h-6 sm:w-7 sm:h-7 stroke-2" />
                </div>

                <span className="text-[10.5px] sm:text-[11px] font-mono font-bold tracking-widest text-white/90 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20 uppercase shadow-2xs">
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
              <div className="space-y-1">
                <h2 className="text-[22px] sm:text-[25px] font-black text-white leading-tight">
                  {t.enterWorker}
                </h2>
                <p className="text-[13px] sm:text-[14px] text-white/90 leading-snug font-normal">
                  {t.enterWorkerSub}
                </p>
              </div>

            </div>

            {/* Bottom Action Footer Bar */}
            <div className="pt-3.5 sm:pt-4 mt-3.5 sm:mt-4 flex items-center justify-between border-t border-white/20 text-[13px] sm:text-[14px] font-bold relative z-10">
              <span className="flex items-center gap-2 text-white/95 group-hover:text-white transition-colors duration-200">
                <ScanLine className="w-4 h-4 text-white/90" />
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
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#35551F] flex items-center justify-center shadow-xs transition-all duration-200 group-hover:translate-x-1 group-active:scale-95">
                <ArrowRight className="w-4 h-4 stroke-2" />
              </div>
            </div>

          </Link>

          {/* ════════════════════════════════════════════════════════════ */}
          {/* TILE 2: HSE TEAM (Safety Overview)                           */}
          {/* ════════════════════════════════════════════════════════════ */}
          <Link
            href="/hse"
            onClick={() => handleNavigate('hse')}
            className="group relative flex flex-col justify-between p-6 sm:p-7 md:p-8 rounded-3xl bg-white hover:bg-[#FAF7F0] text-[#263026] shadow-md hover:shadow-xl active:scale-[0.98] transition-all duration-200 text-left border border-[#E8E2D5] hover:border-[#5C822D] hover:-translate-y-0.5 overflow-hidden flex-1 min-h-[230px] sm:min-h-[250px] md:min-h-[270px] cursor-pointer touch-manipulation"
          >
            {/* Ambient Soft Green Glow */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 rounded-full bg-[#5C822D]/5 blur-3xl group-hover:scale-125 group-hover:bg-[#5C822D]/10 transition-all duration-500 pointer-events-none" />

            <div className="space-y-4 sm:space-y-5 relative z-10">
              
              {/* Header Icon & Category Badge */}
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#EDF3E4] border border-[#C6DCC0] text-[#5C822D] flex items-center justify-center shadow-xs transition-all duration-200 group-hover:bg-[#5C822D] group-hover:text-white">
                  <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 stroke-2" />
                </div>

                <span className="text-[10.5px] sm:text-[11px] font-mono font-bold tracking-widest text-[#5C822D] bg-[#EDF3E4] px-3 py-1 rounded-full border border-[#C6DCC0] uppercase shadow-2xs group-hover:bg-[#5C822D] group-hover:text-white group-hover:border-[#5C822D] transition-colors duration-200">
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
              <div className="space-y-1">
                <h2 className="text-[22px] sm:text-[25px] font-black text-[#263026] leading-tight group-hover:text-[#35551F] transition-colors duration-200">
                  {t.openDashboard}
                </h2>
                <p className="text-[13px] sm:text-[14px] text-[#596158] leading-snug font-normal">
                  {t.openDashboardSub}
                </p>
              </div>

            </div>

            {/* Bottom Action Footer Bar */}
            <div className="pt-3.5 sm:pt-4 mt-3.5 sm:mt-4 flex items-center justify-between border-t border-[#E8E2D5] group-hover:border-[#C6DCC0] text-[13px] sm:text-[14px] font-bold relative z-10 transition-colors duration-200">
              <span className="flex items-center gap-2 text-[#596158] group-hover:text-[#35551F] transition-colors duration-200">
                <LayoutDashboard className="w-4 h-4 text-[#5C822D]" />
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
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FAF6EE] text-[#5C822D] flex items-center justify-center shadow-xs transition-all duration-200 group-hover:translate-x-1 group-hover:bg-[#5C822D] group-hover:text-white group-active:scale-95">
                <ArrowRight className="w-4 h-4 stroke-2" />
              </div>
            </div>

          </Link>

        </div>

      </div>
    </div>
  );
}

