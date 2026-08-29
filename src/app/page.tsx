'use client';

import Link from 'next/link';
import { Camera, BarChart3, ArrowRight, ShieldCheck, Sparkles, Activity } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import Image from 'next/image';
import mrplLogo from '../../public/mrpl-logo.png';

export default function HomePage() {
  const { language } = useAppStore();

  return (
    <div className="w-full max-w-[900px] mx-auto px-4 sm:px-6 py-2 sm:py-3 md:py-4 flex-1 flex flex-col justify-center">
      <div className="space-y-3 sm:space-y-4 md:space-y-5 text-center">
        
        {/* ───────────────────────────────────────────────────────────── */}
        {/* HERO TITLE & BRAND IDENTITY BANNER                            */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center justify-center space-y-2">
          
          {/* Logo Badge with soft clean elevation */}
          <div className="relative group">
            <div className="h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center p-1.5 bg-white rounded-2xl border-2 border-[#E8E2D5] shadow-xs group-hover:border-[#5C822D] group-hover:shadow-sm group-hover:scale-105 transition-all duration-300">
              <Image 
                src={mrplLogo} 
                alt="MRPL Official Emblem" 
                className="h-9 sm:h-11 w-auto object-contain rounded-lg"
                priority
              />
            </div>
          </div>

          {/* Clean Headline & Subtitle with strict contrast hierarchy */}
          <div className="space-y-0.5 max-w-xl mx-auto">
            <h1 className="text-[22px] sm:text-[28px] md:text-[32px] font-black text-[#263026] leading-tight tracking-tight">
              {language === 'hi' ? 'H₂S एक्सपोजर मॉनिटरिंग' : 'H₂S Dosimetry Platform'}
            </h1>
            <p className="text-[12px] sm:text-[13.5px] text-[#596158] font-normal leading-snug">
              {language === 'hi' 
                ? 'त्वरित ऑप्टिकल रिस्टबैंड सत्यापन एवं कार्यस्थल सुरक्षा प्रणाली' 
                : 'Rapid Optical Wristband Verification & Real-Time Gas Exposure Safety'}
            </p>
          </div>

        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 2 MAIN HERO CARDS: UNIFIED VISUAL HIERARCHY                    */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 pt-0.5 sm:pt-1">
          
          {/* ════════════════════════════════════════════════════════════ */}
          {/* TILE 1: SCAN WRISTBAND (Primary Action Hero Card)           */}
          {/* ════════════════════════════════════════════════════════════ */}
          <Link
            href="/scan"
            className="group relative flex flex-col justify-between p-5 sm:p-6 md:p-7 rounded-3xl bg-gradient-to-br from-[#4D7324] via-[#3D5E1C] to-[#2E4814] text-white shadow-md hover:shadow-2xl hover:shadow-[#3D5E1C]/25 hover:-translate-y-1.5 active:scale-[0.98] active:translate-y-0 transition-all duration-300 text-left border-2 border-[#5E8A2C]/60 hover:border-[#86B84A] overflow-hidden min-h-[210px] sm:min-h-[235px] md:min-h-[250px] cursor-pointer"
          >
            {/* Ambient Radial Sheen */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 rounded-full bg-white/10 blur-2xl group-hover:scale-150 group-hover:bg-white/20 transition-all duration-700 pointer-events-none" />

            <div className="space-y-3 sm:space-y-3.5 relative z-10">
              
              {/* Header Icon */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-white group-hover:text-[#35551F] group-hover:rotate-[-4deg] group-active:scale-95 transition-all duration-300">
                  <Camera className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.3]" />
                </div>

                <span className="text-[10px] sm:text-[10.5px] font-mono font-bold tracking-widest text-white/90 bg-white/15 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/20 uppercase shadow-2xs">
                  {language === 'hi' ? 'प्राथमिक क्रिया' : 'Primary Action'}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-[20px] sm:text-[24px] font-black text-white leading-tight group-hover:translate-x-0.5 transition-transform duration-300">
                  {language === 'hi' ? 'रिस्टबैंड स्कैन करें' : 'Scan Wristband'}
                </h2>
                <p className="text-[12px] sm:text-[13px] text-white/90 leading-snug mt-1 font-normal">
                  {language === 'hi' 
                    ? 'कैमरा खोलें, 4-पैच ग्रिड संरेखित करें और तत्काल H₂S ppm खुराक प्रमाणपत्र प्राप्त करें।' 
                    : 'Open camera viewfinder for Bradford D65 chromatic analysis & instant H₂S ppm certificate.'}
                </p>
              </div>

            </div>

            {/* Bottom Action Footer Bar */}
            <div className="pt-3 sm:pt-3.5 mt-3 sm:mt-3.5 flex items-center justify-between border-t border-white/20 text-[12.5px] sm:text-[13.5px] font-bold relative z-10">
              <span className="flex items-center gap-1.5 text-white/95 group-hover:text-white transition-colors duration-300">
                <Sparkles className="w-3.5 h-3.5 text-white/90 group-hover:rotate-12 transition-all duration-300" />
                <span>{language === 'hi' ? 'स्कैनर प्रारंभ करें' : 'Launch Camera Scanner'}</span>
              </span>
              
              {/* Moving Arrow Pill Button */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#35551F] flex items-center justify-center shadow-md group-hover:translate-x-1.5 group-hover:scale-105 group-hover:shadow-lg group-active:scale-95 transition-all duration-300">
                <ArrowRight className="w-4 h-4 stroke-[2.6]" />
              </div>
            </div>

          </Link>

          {/* ════════════════════════════════════════════════════════════ */}
          {/* TILE 2: VIEW DASHBOARD (Command Center Hero Card)            */}
          {/* ════════════════════════════════════════════════════════════ */}
          <Link
            href="/dashboard"
            className="group relative flex flex-col justify-between p-5 sm:p-6 md:p-7 rounded-3xl bg-white hover:bg-[#FAF7F0] text-[#263026] shadow-md hover:shadow-2xl hover:shadow-[#5C822D]/15 hover:-translate-y-1.5 active:scale-[0.98] active:translate-y-0 transition-all duration-300 text-left border-2 border-[#E8E2D5] hover:border-[#5C822D] overflow-hidden min-h-[210px] sm:min-h-[235px] md:min-h-[250px] cursor-pointer"
          >
            {/* Ambient Soft Green Glow */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 rounded-full bg-[#5C822D]/5 blur-3xl group-hover:scale-150 group-hover:bg-[#5C822D]/12 transition-all duration-700 pointer-events-none" />

            <div className="space-y-3 sm:space-y-3.5 relative z-10">
              
              {/* Header Icon */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#EDF3E4] border border-[#C6DCC0] text-[#5C822D] flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-[#5C822D] group-hover:text-white group-hover:rotate-[4deg] group-active:scale-95 transition-all duration-300">
                  <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.3]" />
                </div>

                <span className="text-[10px] sm:text-[10.5px] font-mono font-bold tracking-widest text-[#5C822D] bg-[#EDF3E4] px-2.5 py-0.5 rounded-full border border-[#C6DCC0] uppercase shadow-2xs group-hover:bg-[#5C822D] group-hover:text-white group-hover:border-[#5C822D] transition-colors duration-300">
                  {language === 'hi' ? 'पर्यवेक्षी स्नैपशॉट' : 'Command Center'}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-[20px] sm:text-[24px] font-black text-[#263026] leading-tight group-hover:text-[#35551F] group-hover:translate-x-0.5 transition-all duration-300">
                  {language === 'hi' ? 'डैशबोर्ड देखें' : 'View Safety Dashboard'}
                </h2>
                <p className="text-[12px] sm:text-[13px] text-[#596158] leading-snug mt-1 font-normal">
                  {language === 'hi' 
                    ? 'कार्यबल जोखिम स्थिति, सक्रिय एक्सपोज़र अलर्ट और लाइव रिफाइनरी टेलीमेट्री देखें।' 
                    : 'Check live workforce telemetry, active hazard alarms, shift risk tiers & unit trends.'}
                </p>
              </div>

            </div>

            {/* Bottom Action Footer Bar */}
            <div className="pt-3 sm:pt-3.5 mt-3 sm:mt-3.5 flex items-center justify-between border-t border-[#E8E2D5] group-hover:border-[#C6DCC0] text-[12.5px] sm:text-[13.5px] font-bold relative z-10 transition-colors duration-300">
              <span className="flex items-center gap-1.5 text-[#596158] group-hover:text-[#35551F] transition-colors duration-300">
                <ShieldCheck className="w-4 h-4 text-[#5C822D] group-hover:scale-110 transition-all duration-300" />
                <span>{language === 'hi' ? 'कमांड सेंटर खोलें' : 'Open Safety Command Center'}</span>
              </span>
              
              {/* Moving Arrow Pill Button */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FAF6EE] border border-[#E8E2D5] text-[#5C822D] flex items-center justify-center shadow-xs group-hover:translate-x-1.5 group-hover:scale-105 group-hover:shadow-md group-hover:bg-[#5C822D] group-hover:text-white group-hover:border-[#5C822D] group-active:scale-95 transition-all duration-300">
                <ArrowRight className="w-4 h-4 stroke-[2.6]" />
              </div>
            </div>

          </Link>

        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* SUB-HERO EXPLORATION LINK                                     */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="pt-0.5 sm:pt-1 text-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-[11.5px] sm:text-[12.5px] text-[#596158] hover:text-[#263026] font-semibold transition-all px-3.5 py-1.5 rounded-full hover:bg-white border border-transparent hover:border-[#E8E2D5] hover:shadow-2xs active:scale-95"
          >
            <Activity className="w-3.5 h-3.5 text-[#5C822D]" />
            <span>
              {language === 'hi' 
                ? 'तकनीक, 4-पैच ऑप्टिकल ग्रिड एवं उत्पाद कार्यप्रणाली के बारे में जानें →' 
                : 'Learn about the lead-free chemosensor matrix & optical calibration technology →'}
            </span>
          </Link>
        </div>

      </div>
    </div>
  );
}
