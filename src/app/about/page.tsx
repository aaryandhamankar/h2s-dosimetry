'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  FlaskConical, 
  Cpu, 
  Activity, 
  AlertTriangle, 
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { TRANSLATIONS } from '@/lib/i18n';
import { CADModelViewer } from '@/components/cad-model-viewer';

export default function AboutPage() {
  const { language, setTeamModalOpen } = useAppStore();
  const t = TRANSLATIONS[language];
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
              {language === 'hi' 
                ? 'उत्पाद विवरण एवं तकनीक' 
                : language === 'kn'
                ? 'ಉತ್ಪನ್ನ ವಿವರಣೆ & ತಂತ್ರಜ್ಞಾನ'
                : language === 'gu'
                ? 'ઉત્પાદન વિગત અને ટેકનોલોજી'
                : 'About the Product & Technology'}
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
            {language === 'hi' ? 'यह क्या है?' : language === 'kn' ? 'ಇದು ಏನು?' : language === 'gu' ? 'આ શું છે?' : 'What is it?'}
          </h2>
        </div>
        <p className="text-[13px] sm:text-[14px] text-[#596158] leading-relaxed">
          {language === 'hi' ? (
            <>
              <strong>MRPL H₂S वियरेबल डोसीमीटर</strong> एक हल्का, बिना बिजली (जीरो-पावर) वाला व्यक्तिगत रासायनिक सेंसर बैंड है जिसे स्मार्टफोन के ऑप्टिकल रीडआउट सिस्टम से जोड़ा गया है। यह रिफाइनरी कर्मियों और एचएसई सुरक्षा अधिकारियों को भारी इलेक्ट्रॉनिक बैज या महंगी प्रयोगशाला जांच के बिना वास्तविक समय में मात्रात्मक गैस एक्सपोज़र माप प्रदान करता है।
            </>
          ) : language === 'kn' ? (
            <>
              <strong>MRPL H₂S ಧರಿಸಬಹುದಾದ ಡೋಸಿಮೀಟರ್</strong> ಎಂಬುದು ಶೂನ್ಯ-ವಿದ್ಯುತ್ ವೈಯಕ್ತಿಕ ರಾಸಾಯನಿಕ ಸಂವೇದಕ ಬ್ಯಾಂಡ್ ಆಗಿದ್ದು, ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಆಪ್ಟಿಕಲ್ ರೀಡೌಟ್ ಸಿಸ್ಟಮ್‌ನೊಂದಿಗೆ ಜೋಡಿಸಲ್ಪಟ್ಟಿದೆ. ಇದು ರಿಫೈನರಿ ಸಿಬ್ಬಂದಿ ಮತ್ತು HSE ಸುರಕ್ಷತಾ ಅಧಿಕಾರಿಗಳಿಗೆ ನೈಜ-ಸಮಯದ ಅನಿಲ ಎಕ್ಸ್‌ಪೋಶರ್ ಮಾಪನವನ್ನು ನೀಡುತ್ತದೆ.
            </>
          ) : language === 'gu' ? (
            <>
              <strong>MRPL H₂S પહેરી શકાય તેવું ડોસિમીટર</strong> એ ઝીરો-પાવર વ્યક્તિગત રાસાયણિક સેન્સર બેન્ડ છે જેને સ્માર્ટફોન ઓપ્ટિકલ રીડઆઉટ સિસ્ટમ સાથે જોડવામાં આવ્યું છે. તે રિફાઇનરી કર્મચારીઓ અને HSE સુરક્ષા અધિકારીઓને વાસ્તવિક સમયનું ગેસ એક્સપોઝર માપન પૂરું પાડે છે.
            </>
          ) : (
            <>
              The <strong>MRPL H₂S Wearable Dosimeter</strong> is a lightweight, zero-power personal chemical sensor band paired with an optical smartphone readout system. It gives refinery personnel and HSE safety officers real-time, quantitative exposure measurements without cumbersome electronic badges or expensive laboratory turnaround.
            </>
          )}
        </p>
      </div>

      {/* SECTION 2: 3D CAD MODEL VIEWER */}
      <CADModelViewer />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 3: HOW IT WORKS & 4-STEP PIPELINE                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="gov-card p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-[#E8E2D5] bg-white space-y-2.5 shadow-2xs">
        <div className="flex items-center gap-2 text-[#5C822D]">
          <Activity className="w-4.5 h-4.5" />
          <h2 className="text-[15px] sm:text-[17px] font-black text-[#263026]">
            {language === 'hi' ? 'यह कैसे काम करता है?' : language === 'kn' ? 'ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ?' : language === 'gu' ? 'આ કેવી રીતે કાર્ય કરે છે?' : 'How it works'}
          </h2>
        </div>

        {/* 4-Step Visual Flow: 2x2 grid on mobile for compactness, 4 columns on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-0.5">
          <div className="p-2.5 sm:p-3 bg-[#FAF7F0] border border-[#E8E2D5] rounded-lg sm:rounded-xl space-y-1 text-left">
            <div className="w-6 h-6 rounded-md bg-[#EDF3E4] text-[#5C822D] flex items-center justify-center font-bold text-[11px]">
              1
            </div>
            <div className="font-bold text-[12px] sm:text-[13px] text-[#263026]">
              {language === 'hi' ? 'रिस्टबैंड' : language === 'kn' ? 'ರಿಸ್ಟ್‌ಬ್ಯಾಂಡ್' : language === 'gu' ? 'રિસ્ટબેન્ડ' : 'Wristband'}
            </div>
            <p className="text-[11px] sm:text-[12px] text-[#596158] leading-tight">
              {language === 'hi' 
                ? 'ऑपरेटरों द्वारा शिफ्ट के दौरान कलाई पर पहना जाता है।' 
                : language === 'kn'
                ? 'ಆಪರೇಟರ್‌ಗಳಿಂದ ಶಿಫ್ಟ್ ಸಮಯದಲ್ಲಿ ಮಣಿಕಟ್ಟಿಗೆ ಧರಿಸಲಾಗುತ್ತದೆ.'
                : language === 'gu'
                ? 'ઓપરેટરો દ્વારા શિફ્ટ દરમિયાન કાંડા પર પહેરવામાં આવે છે.'
                : 'Worn by operators across active shifts.'}
            </p>
          </div>

          <div className="p-2.5 sm:p-3 bg-[#FAF7F0] border border-[#E8E2D5] rounded-lg sm:rounded-xl space-y-1 text-left">
            <div className="w-6 h-6 rounded-md bg-[#EDF3E4] text-[#5C822D] flex items-center justify-center font-bold text-[11px]">
              2
            </div>
            <div className="font-bold text-[12px] sm:text-[13px] text-[#263026]">
              {language === 'hi' ? 'वर्णमितीय' : language === 'kn' ? 'ಕಲರ್ಮೆಟ್ರಿಕ್' : language === 'gu' ? 'કલરીમેટ્રિક' : 'Colorimetric'}
            </div>
            <p className="text-[11px] sm:text-[12px] text-[#596158] leading-tight">
              {language === 'hi' 
                ? 'H₂S गैस की मात्रा के अनुपात में रंग गहरा होता है।' 
                : language === 'kn'
                ? 'H₂S ಅನಿಲದ ಪ್ರಮಾಣಕ್ಕೆ ತಕ್ಕಂತೆ ಬಣ್ಣ ಗಾಢವಾಗುತ್ತದೆ.'
                : language === 'gu'
                ? 'H₂S ગેસના પ્રમાણ અનુસાર રંગ ઘાટો થાય છે.'
                : 'Darkens proportionally to H₂S gas dose.'}
            </p>
          </div>

          <div className="p-2.5 sm:p-3 bg-[#FAF7F0] border border-[#E8E2D5] rounded-lg sm:rounded-xl space-y-1 text-left">
            <div className="w-6 h-6 rounded-md bg-[#EDF3E4] text-[#5C822D] flex items-center justify-center font-bold text-[11px]">
              3
            </div>
            <div className="font-bold text-[12px] sm:text-[13px] text-[#263026]">
              {language === 'hi' ? 'इमेज स्कैन' : language === 'kn' ? 'ಇಮೇಜ್ ಸ್ಕ್ಯಾನ್' : language === 'gu' ? 'ઇમેજ સ્કેન' : 'Image Scan'}
            </div>
            <p className="text-[11px] sm:text-[12px] text-[#596158] leading-tight">
              {language === 'hi' 
                ? 'फोन कैमरा परिवेशी प्रकाश में बैज की फोटो लेता है।' 
                : language === 'kn'
                ? 'ಫೋನ್ ಕ್ಯಾಮೆರಾ ಸುತ್ತಮುತ್ತಲಿನ ಬೆಳಕಿನಲ್ಲಿ ಬ್ಯಾಡ್ಜ್ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ.'
                : language === 'gu'
                ? 'ફોન કેમેરા આસપાસના પ્રકાશમાં બેજનો ફોટો લે છે.'
                : 'Phone camera captures badge under ambient light.'}
            </p>
          </div>

          <div className="p-2.5 sm:p-3 bg-[#FAF7F0] border border-[#E8E2D5] rounded-lg sm:rounded-xl space-y-1 text-left">
            <div className="w-6 h-6 rounded-md bg-[#EDF3E4] text-[#5C822D] flex items-center justify-center font-bold text-[11px]">
              4
            </div>
            <div className="font-bold text-[12px] sm:text-[13px] text-[#263026]">
              {language === 'hi' ? 'खुराक अनुमान' : language === 'kn' ? 'ಎಕ್ಸ್‌ಪೋಶರ್ ಅಂದಾಜು' : language === 'gu' ? 'એક્સપોઝર અંદાજ' : 'Exposure Estimate'}
            </div>
            <p className="text-[11px] sm:text-[12px] text-[#596158] leading-tight">
              {language === 'hi' 
                ? '< 1 सेकंड में मात्रात्मक ppm प्रमाणित।' 
                : language === 'kn'
                ? '< 1 ಸೆಕೆಂಡಿನಲ್ಲಿ ಪ್ರಮಾಣೀಕೃತ ppm.'
                : language === 'gu'
                ? '< 1 સેકન્ડમાં પ્રમાણિત ppm.'
                : 'Quantitative ppm certified in < 1s.'}
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
            {language === 'hi' ? 'H₂S निगरानी क्यों आवश्यक है?' : language === 'kn' ? 'H₂S ಕಣ್ಗಾವಲು ಏಕೆ ಮುಖ್ಯ?' : language === 'gu' ? 'H₂S દેખરેખ શા માટે જરૂરી છે?' : 'Why H₂S monitoring?'}
          </h2>
        </div>
        <p className="text-[13px] sm:text-[14px] text-[#596158] leading-relaxed">
          {language === 'hi' ? (
            <>
              हाइड्रोजन सल्फाइड (H₂S) एक अत्यधिक घातक पेट्रोकेमिकल गैस है। हालांकि कम सांद्रता में इसमें सड़े हुए अंडे जैसी गंध होती है, लेकिन <strong>100 ppm</strong> से अधिक होने पर यह तुरंत <strong>सूंघने की क्षमता को सुन्न (घ्राण थकान)</strong> कर देती है, जिससे श्रमिकों को खतरे का पता नहीं चलता। मुख्य मानक: <strong>OSHA PEL (10 ppm 8h TWA)</strong> और <strong>20 ppm अधिकतम सीमा (सीलिंग)</strong>।
            </>
          ) : language === 'kn' ? (
            <>
              ಹೈಡ್ರೋಜನ್ ಸಲ್ಫೈಡ್ (H₂S) ಅತ್ಯಂತ ಅಪಾಯಕಾರಿ ಪೆಟ್ರೋಕೆಮಿಕಲ್ ಅನಿಲವಾಗಿದೆ. ಕಡಿಮೆ ಸಾಂದ್ರತೆಯಲ್ಲಿ ಕೊಳೆತ ಮೊಟ್ಟೆಯ ವಾಸನೆಯನ್ನು ಹೊಂದಿದ್ದರೂ, <strong>100 ppm</strong> ಮೀರಿದಾಗ ಇದು ತಕ್ಷಣವೇ <strong>ವಾಸನೆ ಗ್ರಹಿಸುವ ಸಾಮರ್ಥ್ಯವನ್ನು ಕುಂಠಿತಗೊಳಿಸುತ್ತದೆ (ಘ್ರಾಣ ಆಯಾಸ)</strong>. ಮುಖ್ಯ ಮಾನದಂಡಗಳು: <strong>OSHA PEL (10 ppm 8h TWA)</strong> ಮತ್ತು <strong>20 ppm ಗರಿಷ್ಠ ಮಿತಿ (ಸೀಲಿಂಗ್)</strong>.
            </>
          ) : language === 'gu' ? (
            <>
              હાઇડ્રોજન સલ્ફાઇડ (H₂S) એક અત્યંત જોખમી પેટ્રોકેમિકલ ગેસ છે. ઓછી સાંદ્રતામાં તે સડેલા ઈંડા જેવી ગંધ ધરાવે છે, પરંતુ <strong>100 ppm</strong> થી વધુ થવા પર તે તરત જ <strong>સૂંઘવાની ક્ષમતાને સુન્ન (ઘ્રાણેન્દ્રિય થાક)</strong> કરી દે છે. મુખ્ય ધોરણો: <strong>OSHA PEL (10 ppm 8h TWA)</strong> અને <strong>20 ppm મહત્તમ મર્યાદા (સીલિંગ)</strong>.
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
      <div className="gov-card p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-[#E8E2D5] bg-white space-y-3 shadow-2xs">
        <div className="flex items-center justify-between flex-wrap gap-1.5">
          <div className="flex items-center gap-2 text-[#5C822D]">
            <FlaskConical className="w-4.5 h-4.5" />
            <h2 className="text-[15px] sm:text-[17px] font-black text-[#263026]">
              {language === 'hi' ? 'तकनीकी दृष्टिकोण एवं विनिर्देश' : language === 'kn' ? 'ತಾಂತ್ರಿಕ ವಿಧಾನ ಮತ್ತು ವಿಶೇಷಣಗಳು' : language === 'gu' ? 'ટેકનિકલ અભિગમ અને સ્પષ્ટીકરણો' : 'Technology Approach & Specifications'}
            </h2>
          </div>
          <span className="gov-badge gov-badge-normal text-[10px] sm:text-[11px] font-bold py-0.5 px-2">
            ISO / CIE D65
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 text-[12px] sm:text-[13px] text-[#596158]">
          <div className="p-3 sm:p-3.5 bg-[#FAF7F0] border border-[#E8E2D5] rounded-lg sm:rounded-xl space-y-1">
            <span className="font-bold text-[#263026] text-[13px] sm:text-[14px] flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-[#5C822D]" /> {
                language === 'hi' 
                  ? 'लेड-मुक्त कीमोसेंसिंग मैट्रिक्स' 
                  : language === 'kn'
                  ? 'ಸೀಸ-ಮುಕ್ತ ಕೀಮೋಸೆನ್ಸಿಂಗ್ ಮ್ಯಾಟ್ರಿಕ್ಸ್'
                  : language === 'gu'
                  ? 'લીડ-મુક્ત કીમોસેન્સિંગ મેટ્રિક્સ'
                  : 'Lead-Free Chemosensing Matrix'
              }
            </span>
            <p className="leading-relaxed text-[11px] sm:text-[12px]">
              {language === 'hi' 
                ? '0.0 – 50.0 ppm·h की विस्तृत प्रतिक्रिया सीमा के साथ 100% लेड-मुक्त Copper-PAN और Bismuth(III) कॉम्प्लेक्सेशन रसायन का उपयोग।'
                : language === 'kn'
                ? '0.0 – 50.0 ppm·h ವ್ಯಾಪ್ತಿಯೊಂದಿಗೆ 100% ಸೀಸ-ಮುಕ್ತ Copper-PAN & Bismuth(III) ಕಾಂಪ್ಲೆಕ್ಸೇಶನ್ ರಸಾಯನಶಾಸ್ತ್ರ ಬಳಕೆ.'
                : language === 'gu'
                ? '0.0 – 50.0 ppm·h ની વિશાળ પ્રતિક્રિયા શ્રેણી સાથે 100% લીડ-મુક્ત Copper-PAN અને Bismuth(III) રસાયણશાસ્ત્રનો ઉપયોગ.'
                : 'Utilizes 100% lead-free Copper-PAN & Bismuth(III) complexation chemistry with a wide linear response across 0.0 – 50.0 ppm·h.'}
            </p>
          </div>

          <div className="p-3 sm:p-3.5 bg-[#FAF7F0] border border-[#E8E2D5] rounded-lg sm:rounded-xl space-y-1">
            <span className="font-bold text-[#263026] text-[13px] sm:text-[14px] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#5C822D]" /> {
                language === 'hi' 
                  ? 'Bradford D65 ऑप्टिकल सामान्यीकरण' 
                  : language === 'kn'
                  ? 'Bradford D65 ಆಪ್ಟಿಕಲ್ ನಾರ್ಮಲೈಸೇಶನ್'
                  : language === 'gu'
                  ? 'Bradford D65 ઓપ્ટિકલ સામાન્યકરણ'
                  : 'Bradford D65 Optical Normalization'
              }
            </span>
            <p className="leading-relaxed text-[11px] sm:text-[12px]">
              {language === 'hi'
                ? 'प्रत्येक बैज पर 4-पैच कैलिब्रेशन ग्रिड परिवेशी पीली रिफाइनरी लाइटिंग और छाया को ISO/CIE D65 मानक संदर्भ में सही करता है।'
                : language === 'kn'
                ? 'ಪ್ರತಿ ಬ್ಯಾಡ್ಜ್‌ನಲ್ಲಿರುವ 4-ಪ್ಯಾಚ್ ಕ್ಯಾಲಿಬ್ರೇಶನ್ ಗ್ರಿಡ್ ಸುತ್ತಮುತ್ತಲಿನ ಬೆಳಕು ಮತ್ತು ನೆರಳುಗಳನ್ನು ISO/CIE D65 ಮಾನದಂಡಕ್ಕೆ ಸರಿಹೊಂದಿಸುತ್ತದೆ.'
                : language === 'gu'
                ? 'દરેક બેજ પર 4-પેચ કેલિબ્રેશન ગ્રીડ આસપાસના પ્રકાશ અને પડછાયાઓને ISO/CIE D65 માનક સંદર્ભમાં સુધારે છે.'
                : '4-patch calibration grid on every badge corrects for ambient refinery yellow lighting and shadows to ISO/CIE D65 standard reference.'}
            </p>
          </div>
        </div>

        {/* 4 Sensor & Chemical Specification Parameter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-[#596158]">
          <div className="bg-[#FAF7F0] p-2.5 rounded-lg border border-[#E8E2D5] space-y-0.5">
            <span className="text-[#7A8178] text-[9px] uppercase font-bold tracking-wider block">
              {t.reagentMatrix}
            </span>
            <strong className="text-[#263026] text-[11px] sm:text-[12px] font-mono block">
              Cu-PAN & Bi(III)
            </strong>
          </div>

          <div className="bg-[#FAF7F0] p-2.5 rounded-lg border border-[#E8E2D5] space-y-0.5">
            <span className="text-[#7A8178] text-[9px] uppercase font-bold tracking-wider block">
              {language === 'hi' ? 'प्रतिक्रिया' : language === 'kn' ? 'ಪ್ರತಿಕ್ರಿಯೆ' : language === 'gu' ? 'પ્રતિક્રિયા' : 'Reaction'}
            </span>
            <span className="font-mono text-[11px] sm:text-[12px] font-bold text-[#263026] block">
              CuS / Bi₂S₃↓
            </span>
          </div>

          <div className="bg-[#FAF7F0] p-2.5 rounded-lg border border-[#E8E2D5] space-y-0.5">
            <span className="text-[#7A8178] text-[9px] uppercase font-bold tracking-wider block">
              {language === 'hi' ? 'पर्यावरण सुरक्षा' : language === 'kn' ? 'ಪರಿಸರ ಸುರಕ್ಷತೆ' : language === 'gu' ? 'પર્યાવરણ સુરક્ષા' : 'Eco-Safety'}
            </span>
            <strong className="text-[#5C822D] text-[11px] sm:text-[12px] font-bold block">
              100% Lead-Free
            </strong>
          </div>

          <div className="bg-[#FAF7F0] p-2.5 rounded-lg border border-[#E8E2D5] space-y-0.5">
            <span className="text-[#7A8178] text-[9px] uppercase font-bold tracking-wider block">
              {language === 'hi' ? 'वर्णमिति' : language === 'kn' ? 'ಕಲರ್ಮೆಟ್ರಿ' : language === 'gu' ? 'કલરીમેટ્રી' : 'Colorimetry'}
            </span>
            <strong className="text-[#5C822D] text-[11px] sm:text-[12px] font-bold block">
              Bradford D65
            </strong>
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
              {language === 'hi' 
                ? 'प्रोटोटाइप प्रदर्शन स्थिति' 
                : language === 'kn'
                ? 'ಮಾದರಿ ಪ್ರದರ್ಶನ ಸ್ಥಿತಿ'
                : language === 'gu'
                ? 'પ્રોટોટાઇપ પ્રદર્શન સ્થિતિ'
                : 'Prototype Demonstration Status'}
            </h2>
          </div>
          <span className="gov-badge gov-badge-normal text-[10px] sm:text-[11px] font-bold py-0.5 px-2">
            {language === 'hi' ? 'चरण 1 मूल्यांकन' : language === 'kn' ? 'ಹಂತ 1 ಮೌಲ್ಯಮಾಪನ' : language === 'gu' ? 'તબક્કો 1 મૂલ્યાંકન' : 'PHASE 1 EVALUATION'}
          </span>
        </div>

        <p className="text-[12px] sm:text-[13px] text-[#596158] leading-relaxed">
          {language === 'hi'
            ? 'शुरुआत से अंत तक उपयोगकर्ता अनुभव का प्रदर्शन: कैमरा कैप्चर और ऑप्टिकल डिकोडिंग से लेकर स्वचालित शिफ्ट निष्कर्षण, वैधता फ्लैगिंग और पर्यवेक्षक डैशबोर्ड एकीकरण।'
            : language === 'kn'
            ? 'ಸಂಪೂರ್ಣ ಬಳಕೆದಾರ ಅನುಭವದ ಪ್ರದರ್ಶನ: ಕ್ಯಾಮೆರಾ ಕ್ಯಾಪ್ಚರ್ ಮತ್ತು ಆಪ್ಟಿಕಲ್ ಡಿಕೋಡಿಂಗ್‌ನಿಂದ ಸ್ವಯಂಚಾಲಿತ ಶಿಫ್ಟ್ ಹೊರತೆಗೆಯುವಿಕೆ, ಸಿಂಧುತ್ವ ಫ್ಲ್ಯಾಗಿಂಗ್ ಮತ್ತು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಏಕೀಕರಣ.'
            : language === 'gu'
            ? 'સંપૂર્ણ વપરાશકર્તા અનુભવનું પ્રદર્શન: કેમેરા કેપ્ચર અને ઓપ્ટિકલ ડીકોડિંગથી સ્વચાલિત શિફ્ટ નિષ્કર્ષણ, માન્યતા ફ્લેગિંગ અને ડેશબોર્ડ એકીકરણ.'
            : 'Demonstrates the end-to-end user experience: camera capture and optical decoding to automated shift extraction, validity flagging, and supervisor dashboard integration.'}
        </p>

        <div className="pt-1 flex flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-[12px]">
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white border border-[#C6DCC0] rounded-md font-semibold text-[#35551F]">
            ✓ {language === 'hi' ? 'लाइव कैमरा और टॉर्च' : language === 'kn' ? 'ಲೈವ್ ಕ್ಯಾಮೆರಾ & ಟಾರ್ಚ್' : language === 'gu' ? 'લાઇવ કેમેરા અને ટોર્ચ' : 'Live Camera & Torch'}
          </span>
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white border border-[#C6DCC0] rounded-md font-semibold text-[#35551F]">
            ✓ {language === 'hi' ? 'त्वरित मात्रात्मक ppm' : language === 'kn' ? 'ತ್ವರಿತ ಪರಿಮಾಣಾತ್ಮಕ ppm' : language === 'gu' ? 'ઝડપી માત્રાત્મક ppm' : 'Instant Quantitative ppm'}
          </span>
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white border border-[#C6DCC0] rounded-md font-semibold text-[#35551F]">
            ✓ {language === 'hi' ? 'शिफ्ट और समाप्ति गणना' : language === 'kn' ? 'ಶಿಫ್ಟ್ ಮತ್ತು ಅವಧಿ ಮುಕ್ತಾಯ' : language === 'gu' ? 'શિફ્ટ અને સમાપ્તિ ગણતરી' : 'Derived Shift & Expiry'}
          </span>
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white border border-[#C6DCC0] rounded-md font-semibold text-[#35551F]">
            ✓ {language === 'hi' ? 'मल्टी-वर्कर लाइव टेलीमेट्री' : language === 'kn' ? 'ಮಲ್ಟಿ-ವರ್ಕರ್ ಲೈವ್ ಟೆಲಿಮೆಟ್ರಿ' : language === 'gu' ? 'મલ્ટિ-વર્કર લાઇવ ટેલિમેટ્રી' : 'Multi-Worker Feed'}
          </span>
        </div>
      </div>

    </div>
  );
}
