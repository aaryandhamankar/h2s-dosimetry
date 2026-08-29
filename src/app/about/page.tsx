'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  FlaskConical, 
  Cpu, 
  Activity, 
  AlertTriangle, 
  ChevronDown,
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { TRANSLATIONS } from '@/lib/i18n';

export default function AboutPage() {
  const { language, setTeamModalOpen } = useAppStore();
  const t = TRANSLATIONS[language];
  const [selectedPreviewDose, setSelectedPreviewDose] = useState<number>(3.2);
  const [showSpecs, setShowSpecs] = useState<boolean>(false);
  const [tapCount, setTapCount] = useState(0);
  const lastTapRef = useRef<number>(0);

  const handleTitleTap = (e: React.MouseEvent) => {
    const now = e.timeStamp;
    if (now - lastTapRef.current < 900) {
      const count = tapCount + 1;
      setTapCount(count);
      if (count >= 3) {
        setTeamModalOpen(true);
        setTapCount(0);
      }
    } else {
      setTapCount(1);
    }
    lastTapRef.current = now;
  };

  const getDotColor = (dose: number) => {
    if (dose <= 4) return '#F4ECE1'; // Unexposed pale neutral
    if (dose <= 12) return '#BF9F80'; // Light tan brown CuS / Bi2S3
    if (dose <= 18) return '#876043'; // Medium brown sulfide
    return '#3A2214'; // Deep dark brown Bismuth Sulfide
  };

  return (
    <div className="flex-1 py-3 sm:py-6 px-3 sm:px-6 max-w-[800px] mx-auto w-full space-y-3 sm:space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-2.5 sm:pb-3">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-lg bg-white border border-[#E8E2D5] text-[#596158] hover:text-[#263026] hover:bg-[#F4EFE6] transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div onClick={handleTitleTap} className="cursor-pointer select-none">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#5C822D] uppercase tracking-wider block">
              MRPL Innovation Lab
            </span>
            <h1 className="text-[18px] sm:text-[22px] font-black text-[#263026] leading-tight">
              {language === 'hi' ? 'उत्पाद विवरण एवं तकनीक' : 'About the Product & Technology'}
            </h1>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 1: WHAT IS IT?                                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="gov-card p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-[#E8E2D5] bg-white space-y-2 shadow-2xs">
        <div className="flex items-center gap-2 text-[#5C822D]">
          <ShieldCheck className="w-4.5 h-4.5" />
          <h2 className="text-[15px] sm:text-[17px] font-black text-[#263026]">
            {language === 'hi' ? 'यह क्या है?' : 'What is it?'}
          </h2>
        </div>
        <p className="text-[13px] sm:text-[14px] text-[#596158] leading-relaxed">
          {language === 'hi' ? (
            <>
              <strong>MRPL H₂S वियरेबल डोसीमीटर</strong> एक हल्का, बिना बिजली (जीरो-पावर) वाला व्यक्तिगत रासायनिक सेंसर बैंड है जिसे स्मार्टफोन के ऑप्टिकल रीडआउट सिस्टम से जोड़ा गया है। यह रिफाइनरी कर्मियों और एचएसई सुरक्षा अधिकारियों को भारी इलेक्ट्रॉनिक बैज या महंगी प्रयोगशाला जांच के बिना वास्तविक समय में मात्रात्मक गैस एक्सपोज़र माप प्रदान करता है।
            </>
          ) : (
            <>
              The <strong>MRPL H₂S Wearable Dosimeter</strong> is a lightweight, zero-power personal chemical sensor band paired with an optical smartphone readout system. It gives refinery personnel and HSE safety officers real-time, quantitative exposure measurements without cumbersome electronic badges or expensive laboratory turnaround.
            </>
          )}
        </p>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 2: INTERACTIVE WRISTBAND HARDWARE SCHEMATIC           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="gov-card p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-[#E8E2D5] bg-white space-y-3 shadow-2xs">
        
        {/* Header & Simulator Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#E8E2D5] pb-2.5">
          <div>
            <h2 className="text-[15px] sm:text-[16px] font-bold text-[#263026] flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-[#5C822D]" /> {t.schematicTitle}
            </h2>
            <p className="text-[11px] sm:text-[12px] text-[#596158]">
              {t.schematicSubtitle}
            </p>
          </div>

          {/* Exposure Simulator Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-[#7A8178] font-bold mr-0.5">{language === 'hi' ? 'अनुकरण:' : 'Simulate:'}</span>
            {[
              { label: t.normalDemo, val: 3.2 },
              { label: t.elevatedDemo, val: 12.4 },
              { label: t.criticalDemo, val: 24.8 },
            ].map(p => (
              <button
                key={p.val}
                onClick={() => setSelectedPreviewDose(p.val)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all min-h-[30px] ${
                  selectedPreviewDose === p.val
                    ? 'bg-[#5C822D] text-white shadow-2xs'
                    : 'bg-white border border-[#E8E2D5] text-[#596158] hover:text-[#263026] hover:bg-[#F4EFE6]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fully Responsive Wristband Pod Diagram */}
        <div className="bg-[#FAF7F0] border border-[#E8E2D5] rounded-lg sm:rounded-xl p-2.5 sm:p-4 flex flex-col items-center justify-center">
          
          {/* Responsive Container */}
          <div className="w-full max-w-lg flex items-center justify-center py-1.5 sm:py-2">
            
            {/* Left Strap */}
            <div className="w-12 xs:w-16 sm:w-28 h-9 sm:h-12 bg-gradient-to-r from-[#1C241C] via-[#2A3728] to-[#384835] rounded-l-lg sm:rounded-l-xl flex items-center justify-between px-2 sm:px-2.5 shadow-xs border-y-2 border-l-2 border-[#131A13] flex-shrink-0">
              <div className="w-2 sm:w-3.5 h-5 sm:h-7 border border-[#94A388] rounded bg-[#475545] flex items-center justify-center">
                <div className="w-0.5 sm:w-1 h-3.5 sm:h-4 bg-[#CBD5C0] rounded-full" />
              </div>
              <span className="hidden sm:inline text-white/40 font-mono text-[8px] tracking-widest uppercase">MRPL</span>
            </div>

            {/* Central Sensor Enclosure (Pod) */}
            <div className="flex-1 max-w-[210px] sm:max-w-[240px] bg-[#FAF7F0] rounded-lg sm:rounded-xl border-2 border-[#D8D0C0] p-2 sm:p-2.5 shadow-xs flex flex-col justify-between relative z-10 mx-[-2px]">
              
              {/* Top 4-Patch Reference Bar */}
              <div className="flex items-center justify-between bg-[#F4EFE6] p-1 rounded border border-[#E8E2D5]">
                <div className="w-3.5 xs:w-4 sm:w-5 h-2.5 sm:h-3 bg-[#FFFFFF] border border-[#ADB5BD] rounded-xs shadow-2xs" title="White (L*=100)" />
                <div className="w-3.5 xs:w-4 sm:w-5 h-2.5 sm:h-3 bg-[#7F7F7F] border border-[#6C757D] rounded-xs shadow-2xs" title="Neutral Gray (L*=50)" />
                <div className="w-3.5 xs:w-4 sm:w-5 h-2.5 sm:h-3 bg-[#00A3E0] border border-[#0080B0] rounded-xs shadow-2xs" title="Cyan" />
                <div className="w-3.5 xs:w-4 sm:w-5 h-2.5 sm:h-3 bg-[#EC008C] border border-[#C00070] rounded-xs shadow-2xs" title="Magenta" />
              </div>

              {/* Central Chemosensor Spot */}
              <div className="flex items-center justify-center gap-2 sm:gap-2.5 py-1.5 sm:py-2">
                <div 
                  className="w-9 sm:w-11 h-9 sm:h-11 rounded-full border-2 border-[#868E96] shadow-2xs transition-colors duration-300 flex flex-col items-center justify-center text-[7px] sm:text-[7.5px] font-bold font-mono text-white/90"
                  style={{ backgroundColor: getDotColor(selectedPreviewDose) }}
                >
                  <span>Cu/Bi</span>
                  <span className="opacity-80 leading-none">Sulfide</span>
                </div>
                <div className="text-[11px] sm:text-[12px] text-[#596158] font-mono leading-tight">
                  <div>{language === 'hi' ? 'खुराक:' : 'Dose:'} <strong className="text-[#263026] text-[12px] sm:text-[14px]">{selectedPreviewDose} ppm·h</strong></div>
                  <div className="text-[9px] sm:text-[10px] text-[#5C822D]">Cu-PAN + Bi³⁺</div>
                </div>
              </div>

              <div className="text-[7.5px] sm:text-[8.5px] text-center text-[#7A8178] font-mono uppercase tracking-wider">
                BATCH-2026-A · LEAD-FREE
              </div>
            </div>

            {/* Right Strap */}
            <div className="w-12 xs:w-16 sm:w-28 h-9 sm:h-12 bg-gradient-to-r from-[#384835] via-[#2A3728] to-[#1C241C] rounded-r-lg sm:rounded-r-xl flex items-center justify-around px-2 sm:px-2.5 shadow-xs border-y-2 border-r-2 border-[#131A13] flex-shrink-0">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0F140F] border border-white/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#0F140F] border border-white/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#0F140F] border border-white/20" />
              </div>
              <span className="hidden sm:inline text-white/30 font-mono text-[8px] uppercase">ZONE-A</span>
            </div>

          </div>

          {/* Collapsible Specifications Toggle */}
          <div className="w-full mt-1.5 pt-1.5 border-t border-[#E8E2D5]">
            <button
              onClick={() => setShowSpecs(!showSpecs)}
              className="w-full flex items-center justify-between text-[11px] sm:text-[12px] text-[#596158] font-semibold hover:text-[#263026] py-0.5"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#5C822D]" />
                <span>{t.techSpecs}</span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSpecs ? 'rotate-180' : ''}`} />
            </button>

            {showSpecs && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] text-[#596158] animate-in fade-in duration-200">
                <div className="bg-white p-2 rounded-lg border border-[#E8E2D5]">
                  <span className="text-[#7A8178] text-[9px] uppercase font-bold block">{t.reagentMatrix}</span>
                  <strong className="text-[#263026] text-[11px]">Cu-PAN & Bi(III)</strong>
                </div>
                <div className="bg-white p-2 rounded-lg border border-[#E8E2D5]">
                  <span className="text-[#7A8178] text-[9px] uppercase font-bold block">{language === 'hi' ? 'प्रतिक्रिया' : 'Reaction'}</span>
                  <span className="font-mono text-[10px]">CuS / Bi₂S₃↓</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-[#E8E2D5]">
                  <span className="text-[#7A8178] text-[9px] uppercase font-bold block">{language === 'hi' ? 'पर्यावरण सुरक्षा' : 'Eco-Safety'}</span>
                  <span className="text-[#5C822D] font-bold text-[11px]">100% Lead-Free</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-[#E8E2D5]">
                  <span className="text-[#7A8178] text-[9px] uppercase font-bold block">{language === 'hi' ? 'वर्णमिति' : 'Colorimetry'}</span>
                  <span className="text-[#5C822D] font-bold text-[11px]">Bradford D65</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 3: HOW IT WORKS & 4-STEP PIPELINE                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="gov-card p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-[#E8E2D5] bg-white space-y-2.5 shadow-2xs">
        <div className="flex items-center gap-2 text-[#5C822D]">
          <Activity className="w-4.5 h-4.5" />
          <h2 className="text-[15px] sm:text-[17px] font-black text-[#263026]">
            {language === 'hi' ? 'यह कैसे काम करता है?' : 'How it works'}
          </h2>
        </div>

        {/* 4-Step Visual Flow: 2x2 grid on mobile for compactness, 4 columns on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-0.5">
          <div className="p-2.5 sm:p-3 bg-[#FAF7F0] border border-[#E8E2D5] rounded-lg sm:rounded-xl space-y-1 text-left">
            <div className="w-6 h-6 rounded-md bg-[#EDF3E4] text-[#5C822D] flex items-center justify-center font-bold text-[11px]">
              1
            </div>
            <div className="font-bold text-[12px] sm:text-[13px] text-[#263026]">
              {language === 'hi' ? 'रिस्टबैंड' : 'Wristband'}
            </div>
            <p className="text-[11px] sm:text-[12px] text-[#596158] leading-tight">
              {language === 'hi' ? 'ऑपरेटरों द्वारा शिफ्ट के दौरान कलाई पर पहना जाता है।' : 'Worn by operators across active shifts.'}
            </p>
          </div>

          <div className="p-2.5 sm:p-3 bg-[#FAF7F0] border border-[#E8E2D5] rounded-lg sm:rounded-xl space-y-1 text-left">
            <div className="w-6 h-6 rounded-md bg-[#EDF3E4] text-[#5C822D] flex items-center justify-center font-bold text-[11px]">
              2
            </div>
            <div className="font-bold text-[12px] sm:text-[13px] text-[#263026]">
              {language === 'hi' ? 'वर्णमितीय' : 'Colorimetric'}
            </div>
            <p className="text-[11px] sm:text-[12px] text-[#596158] leading-tight">
              {language === 'hi' ? 'H₂S गैस की मात्रा के अनुपात में रंग गहरा होता है।' : 'Darkens proportionally to H₂S gas dose.'}
            </p>
          </div>

          <div className="p-2.5 sm:p-3 bg-[#FAF7F0] border border-[#E8E2D5] rounded-lg sm:rounded-xl space-y-1 text-left">
            <div className="w-6 h-6 rounded-md bg-[#EDF3E4] text-[#5C822D] flex items-center justify-center font-bold text-[11px]">
              3
            </div>
            <div className="font-bold text-[12px] sm:text-[13px] text-[#263026]">
              {language === 'hi' ? 'इमेज स्कैन' : 'Image Scan'}
            </div>
            <p className="text-[11px] sm:text-[12px] text-[#596158] leading-tight">
              {language === 'hi' ? 'फोन कैमरा परिवेशी प्रकाश में बैज की फोटो लेता है।' : 'Phone camera captures badge under ambient light.'}
            </p>
          </div>

          <div className="p-2.5 sm:p-3 bg-[#FAF7F0] border border-[#E8E2D5] rounded-lg sm:rounded-xl space-y-1 text-left">
            <div className="w-6 h-6 rounded-md bg-[#EDF3E4] text-[#5C822D] flex items-center justify-center font-bold text-[11px]">
              4
            </div>
            <div className="font-bold text-[12px] sm:text-[13px] text-[#263026]">
              {language === 'hi' ? 'खुराक अनुमान' : 'Exposure Estimate'}
            </div>
            <p className="text-[11px] sm:text-[12px] text-[#596158] leading-tight">
              {language === 'hi' ? '< 1 सेकंड में मात्रात्मक ppm प्रमाणित।' : 'Quantitative ppm certified in < 1s.'}
            </p>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 4: WHY H2S MONITORING?                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="gov-card p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-[#E8E2D5] bg-white space-y-2 shadow-2xs">
        <div className="flex items-center gap-2 text-[#C96B32]">
          <AlertTriangle className="w-4.5 h-4.5" />
          <h2 className="text-[15px] sm:text-[17px] font-black text-[#263026]">
            {language === 'hi' ? 'H₂S निगरानी क्यों आवश्यक है?' : 'Why H₂S monitoring?'}
          </h2>
        </div>
        <p className="text-[13px] sm:text-[14px] text-[#596158] leading-relaxed">
          {language === 'hi' ? (
            <>
              हाइड्रोजन सल्फाइड (H₂S) एक अत्यधिक घातक पेट्रोकेमिकल गैस है। हालांकि कम सांद्रता में इसमें सड़े हुए अंडे जैसी गंध होती है, लेकिन <strong>100 ppm</strong> से अधिक होने पर यह तुरंत <strong>सूंघने की क्षमता को सुन्न (घ्राण थकान)</strong> कर देती है, जिससे श्रमिकों को खतरे का पता नहीं चलता। मुख्य मानक: <strong>OSHA PEL (10 ppm 8h TWA)</strong> और <strong>20 ppm अधिकतम सीमा (सीलिंग)</strong>।
            </>
          ) : (
            <>
              Hydrogen Sulfide (H₂S) is an insidious petrochemical hazard. While characterized by a pungent rotten-egg odor at trace levels, it rapidly causes <strong>olfactory fatigue (loss of sense of smell)</strong> at concentrations above 100 ppm, leaving workers unaware of deadly exposure. Key benchmarks: <strong>OSHA PEL (10 ppm 8h TWA)</strong> and <strong>20 ppm ceiling</strong>.
            </>
          )}
        </p>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 5: TECHNOLOGY APPROACH                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="gov-card p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-[#E8E2D5] bg-white space-y-2.5 shadow-2xs">
        <div className="flex items-center gap-2 text-[#5C822D]">
          <FlaskConical className="w-4.5 h-4.5" />
          <h2 className="text-[15px] sm:text-[17px] font-black text-[#263026]">
            {language === 'hi' ? 'तकनीकी दृष्टिकोण' : 'Technology Approach'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 text-[12px] sm:text-[13px] text-[#596158]">
          <div className="p-3 sm:p-3.5 bg-[#FAF7F0] border border-[#E8E2D5] rounded-lg sm:rounded-xl space-y-1">
            <span className="font-bold text-[#263026] text-[13px] sm:text-[14px] flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-[#5C822D]" /> {language === 'hi' ? 'लेड-मुक्त कीमोसेंसिंग मैट्रिक्स' : 'Lead-Free Chemosensing Matrix'}
            </span>
            <p className="leading-relaxed text-[11px] sm:text-[12px]">
              {language === 'hi' 
                ? '0.0 – 50.0 ppm·h की विस्तृत प्रतिक्रिया सीमा के साथ 100% लेड-मुक्त Copper-PAN और Bismuth(III) कॉम्प्लेक्सेशन रसायन का उपयोग।'
                : 'Utilizes 100% lead-free Copper-PAN & Bismuth(III) complexation chemistry with a wide linear response across 0.0 – 50.0 ppm·h.'}
            </p>
          </div>

          <div className="p-3 sm:p-3.5 bg-[#FAF7F0] border border-[#E8E2D5] rounded-lg sm:rounded-xl space-y-1">
            <span className="font-bold text-[#263026] text-[13px] sm:text-[14px] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#5C822D]" /> {language === 'hi' ? 'Bradford D65 ऑप्टिकल सामान्यीकरण' : 'Bradford D65 Optical Normalization'}
            </span>
            <p className="leading-relaxed text-[11px] sm:text-[12px]">
              {language === 'hi'
                ? 'प्रत्येक बैज पर 4-पैच कैलिब्रेशन ग्रिड परिवेशी पीली रिफाइनरी लाइटिंग और छाया को ISO/CIE D65 मानक संदर्भ में सही करता है।'
                : '4-patch calibration grid on every badge corrects for ambient refinery yellow lighting and shadows to ISO/CIE D65 standard reference.'}
            </p>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 6: PROTOTYPE DEMONSTRATION STATUS                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="gov-card p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-[#5C822D] bg-[#FAF7F0] space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#5C822D]">
            <Sparkles className="w-4.5 h-4.5" />
            <h2 className="text-[15px] sm:text-[17px] font-black text-[#263026]">
              {language === 'hi' ? 'प्रोटोटाइप प्रदर्शन स्थिति' : 'Prototype Demonstration Status'}
            </h2>
          </div>
          <span className="gov-badge gov-badge-normal text-[10px] sm:text-[11px] font-bold py-0.5 px-2">
            {language === 'hi' ? 'चरण 1 मूल्यांकन' : 'PHASE 1 EVALUATION'}
          </span>
        </div>

        <p className="text-[12px] sm:text-[13px] text-[#596158] leading-relaxed">
          {language === 'hi'
            ? 'शुरुआत से अंत तक उपयोगकर्ता अनुभव का प्रदर्शन: कैमरा कैप्चर और ऑप्टिकल डिकोडिंग से लेकर स्वचालित शिफ्ट निष्कर्षण, वैधता फ्लैगिंग और पर्यवेक्षक डैशबोर्ड एकीकरण।'
            : 'Demonstrates the end-to-end user experience: camera capture and optical decoding to automated shift extraction, validity flagging, and supervisor dashboard integration.'}
        </p>

        <div className="pt-1 flex flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-[12px]">
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white border border-[#C6DCC0] rounded-md font-semibold text-[#35551F]">
            ✓ {language === 'hi' ? 'लाइव कैमरा और टॉर्च' : 'Live Camera & Torch'}
          </span>
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white border border-[#C6DCC0] rounded-md font-semibold text-[#35551F]">
            ✓ {language === 'hi' ? 'त्वरित मात्रात्मक ppm' : 'Instant Quantitative ppm'}
          </span>
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white border border-[#C6DCC0] rounded-md font-semibold text-[#35551F]">
            ✓ {language === 'hi' ? 'शिफ्ट और समाप्ति गणना' : 'Derived Shift & Expiry'}
          </span>
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white border border-[#C6DCC0] rounded-md font-semibold text-[#35551F]">
            ✓ {language === 'hi' ? 'मल्टी-वर्कर लाइव टेलीमेट्री' : 'Multi-Worker Feed'}
          </span>
        </div>
      </div>

    </div>
  );
}
