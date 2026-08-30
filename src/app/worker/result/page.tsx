'use client';

import { useAppStore } from '@/stores/app-store';
import { useSearchParams } from 'next/navigation';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ArrowLeft, 
  RotateCcw, 
  Printer, 
  Cpu,
  ShieldAlert,
  ShieldCheck,
  History as HistoryIcon
} from 'lucide-react';
import { useState, Suspense } from 'react';
import { formatDateTime, formatDose, getValidityLabel } from '@/lib/utils';
import { ValidityStatus, RiskStatus, DemoScenario } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import mrplLogo from '../../../../public/mrpl-logo.png';

function getFallbackBadgeThumbnail(riskStatus?: RiskStatus): string {
  const colors: Record<string, string> = {
    NORMAL: '#E8ECE2',
    ELEVATED: '#C8B18A',
    HIGH: '#8B6237',
    CRITICAL: '#3B2818',
    INVALID: '#E0DCD4',
  };
  const status = riskStatus || 'NORMAL';
  const sensorColor = colors[status] || '#E8ECE2';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180">
    <rect width="240" height="180" rx="14" fill="#1C241C"/>
    <rect x="15" y="15" width="210" height="150" rx="10" fill="#FAF6EE" stroke="#D8D0C0" stroke-width="2"/>
    <rect x="25" y="30" width="85" height="115" rx="6" fill="${sensorColor}" stroke="#596158" stroke-width="1.5"/>
    <rect x="125" y="30" width="40" height="50" rx="3" fill="#FFFFFF" stroke="#D8D0C0" stroke-width="1.5"/>
    <rect x="175" y="30" width="40" height="50" rx="3" fill="#7A8178" stroke="#D8D0C0" stroke-width="1.5"/>
    <rect x="125" y="95" width="40" height="50" rx="3" fill="#00A3E0" stroke="#D8D0C0" stroke-width="1.5"/>
    <rect x="175" y="95" width="40" height="50" rx="3" fill="#E4007C" stroke="#D8D0C0" stroke-width="1.5"/>
    <text x="32" y="138" font-family="monospace" font-size="9" fill="#263026" font-weight="bold">H2S SENSOR</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function ResultContent() {
  const searchParams = useSearchParams();
  const scanId = searchParams.get('scanId');
  const { scans, language } = useAppStore();
  const scan = scans.find(s => s.id === scanId) || scans[0];
  const [showTechnical, setShowTechnical] = useState(false);

  if (!scan) {
    return (
      <div className="gov-card p-6 sm:p-8 text-center space-y-4 max-w-lg mx-auto my-6">
        <p className="text-[#596158]">
          {language === 'hi' ? 'कोई एक्सपोजर रिकॉर्ड नहीं मिला।' : 'No exposure measurement record was found.'}
        </p>
        <Link href="/scan" className="gov-btn-primary text-xs">
          {language === 'hi' 
            ? 'स्कैनर पर लौटें' 
            : language === 'kn'
            ? 'ಸ್ಕ್ಯಾನರ್‌ಗೆ ಹಿಂತಿರುಗಿ'
            : language === 'gu'
            ? 'સ્કેનર પર પાછા જાઓ'
            : 'Return to Scanner'}
        </Link>
      </div>
    );
  }

  const res = scan.exposureResult;
  const isInvalid = res?.validityStatus === ValidityStatus.INVALID_IMAGE || res?.validityStatus === ValidityStatus.PROCESSING_ERROR || scan.scenarioId === DemoScenario.INVALID;
  const isOor = res?.validityStatus === ValidityStatus.OUT_OF_RANGE || scan.scenarioId === DemoScenario.OUT_OF_RANGE;

  const doseVal = res?.estimatedDose ?? (isOor ? 35 : isInvalid ? null : 0);

  // Pointer position calculation (Scale from 0 to 30 ppm·h)
  let pointerPercent = 0;
  if (isOor) {
    pointerPercent = 100;
  } else if (doseVal !== null && doseVal !== undefined) {
    pointerPercent = Math.min(100, Math.max(0, (doseVal / 30) * 100));
  }

  let statusBadge = (
    <span className="gov-badge gov-badge-normal text-[13px] py-1 px-3.5 shadow-2xs font-bold">
      <CheckCircle2 className="w-4 h-4 text-[#5C822D]" /> {
        language === 'hi' 
          ? 'सुरक्षित बेसलाइन' 
          : language === 'kn'
          ? 'ಸುರಕ್ಷಿತ ಬೇಸ್‌ಲೈನ್'
          : language === 'gu'
          ? 'સુરક્ષિત બેઝલાઇન'
          : 'SAFE BASELINE'
      }
    </span>
  );
  let actionTitle = language === 'hi' 
    ? 'सामान्य शिफ्ट प्रक्रिया — सुरक्षित बेसलाइन' 
    : language === 'kn'
    ? 'ಸಾಮಾನ್ಯ ಶಿಫ್ಟ್ ಪ್ರಕ್ರಿಯೆ — ಸುರಕ್ಷಿತ ಬೇಸ್‌ಲೈನ್'
    : language === 'gu'
    ? 'સામાન્ય શિફ્ટ પ્રક્રિયા — સુરક્ષિત બેઝલાઇન'
    : 'Normal Shift Procedure — Safe Baseline';
  let actionInstruction = language === 'hi' 
    ? 'सामान्य प्रक्रिया — मानक पीपीई के साथ निर्धारित शिफ्ट संचालन जारी रखें।' 
    : language === 'kn'
    ? 'ಸಾಮಾನ್ಯ ಪ್ರಕ್ರಿಯೆ — ಪ್ರಮಾಣಿತ PPE ನೊಂದಿಗೆ ನಿಗದಿತ ಶಿಫ್ಟ್ ಕಾರ್ಯಾಚರಣೆ ಮುಂದುವರಿಸಿ.'
    : language === 'gu'
    ? 'સામાન્ય પ્રક્રિયા — પ્રમાણભૂત PPE સાથે નિર્ધારિત શિફ્ટ કામગીરી ચાલુ રાખો.'
    : 'Normal procedure — continue scheduled shift operations with standard PPE.';
  let cardAccentBorder = 'border-[#C6DCC0]';
  let bannerBg = 'bg-[#FAF7F0]';

  if (isInvalid) {
    statusBadge = (
      <span className="gov-badge gov-badge-neutral text-[13px] py-1 px-3.5 font-bold">
        <XCircle className="w-4 h-4 text-[#A94442]" /> {
          language === 'hi' 
            ? 'गुणवत्ता अस्वीकृति' 
            : language === 'kn'
            ? 'ಗುಣಮಟ್ಟ ತಿರಸ್ಕಾರ'
            : language === 'gu'
            ? 'ગુણવત્તા અસ્વીકાર'
            : 'QUALITY GATE REFUSAL'
        }
      </span>
    );
    actionTitle = language === 'hi' 
      ? 'रीडिंग अस्वीकृत — चमक / ऑप्टिकल धुंधलापन पहचाना गया' 
      : language === 'kn'
      ? 'ರೀಡಿಂಗ್ ತಿರಸ್ಕರಿಸಲಾಗಿದೆ — ಗ್ಲೇರ್ / ಆಪ್ಟಿಕಲ್ ಬ್ಲರ್ ಕಂಡುಬಂದಿದೆ'
      : language === 'gu'
      ? 'રીડિંગ અસ્વીકાર — ગ્લેર / ઓપ્ટિકલ બ્લર જણાયું'
      : 'Reading Refused — Glare / Optical Blur Detected';
    actionInstruction = language === 'hi' 
      ? '4-पैच ग्रिड पर अत्यधिक चमक या धुंधलापन है। रेटिकल के अंदर पुनः संरेखित करें और दोबारा फोटो लें।' 
      : language === 'kn'
      ? '4-ಪ್ಯಾಚ್ ಗ್ರಿಡ್‌ನಲ್ಲಿ ಅತಿಯಾದ ಹೊಳಪು ಅಥವಾ ಅಸ್ಪಷ್ಟತೆ ಇದೆ. ರೆಟಿಕಲ್‌ನಲ್ಲಿ ಮರುಹೊಂದಿಸಿ ಮತ್ತೆ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ.'
      : language === 'gu'
      ? '4-પેચ ગ્રીડ પર વધારે પડતી ચમક અથવા અસ્પષ્ટતા છે. રેટિકલની અંદર ફરી ગોઠવો અને ફરીથી ફોટો લો.'
      : 'Specular glare or blur detected on 4-patch grid. Re-align inside reticle and retake photo.';
    cardAccentBorder = 'border-[#D8D0C0]';
    bannerBg = 'bg-[#FAF6EE]';
  } else if (isOor) {
    statusBadge = (
      <span className="gov-badge gov-badge-neutral text-[13px] py-1 px-3.5 bg-[#FAF2EB] text-[#9C4124] border-[#E8C4B8] font-bold">
        <AlertTriangle className="w-4 h-4 text-[#9C4124]" /> {
          language === 'hi' 
            ? 'सेंसर संतृप्त' 
            : language === 'kn'
            ? 'ಸೆನ್ಸರ್ ಸ್ಯಾಚುರೇಟೆಡ್'
            : language === 'gu'
            ? 'સેન્સર સંતૃપ્ત'
            : 'SENSOR SATURATED'
        }
      </span>
    );
    actionTitle = language === 'hi' 
      ? 'सेंसर संतृप्ति पहचानी गई (>30.0 ppm·h)' 
      : language === 'kn'
      ? 'ಸೆನ್ಸರ್ ಸ್ಯಾಚುರೇಶನ್ ಕಂಡುಬಂದಿದೆ (>30.0 ppm·h)'
      : language === 'gu'
      ? 'સેન્સર સંતૃપ્તિ જણાઈ (>30.0 ppm·h)'
      : 'Sensor Saturation Detected (>30.0 ppm·h)';
    actionInstruction = language === 'hi' 
      ? 'मैट्रिक्स 30 ppm·h सीमा से अधिक हो गया है। गैस क्रोमैटोग्राफी (GC) विश्लेषण के लिए बैज एचएसई लैब में जमा करें।' 
      : language === 'kn'
      ? 'ಮ್ಯಾಟ್ರಿಕ್ಸ್ 30 ppm·h ಮಿತಿಯನ್ನು ಮೀರಿದೆ. ಗ್ಯಾಸ್ ಕ್ರೊಮ್ಯಾಟೋಗ್ರಫಿ (GC) ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಬ್ಯಾಡ್ಜ್ ಅನ್ನು HSE ಲ್ಯಾಬ್‌ಗೆ ಸಲ್ಲಿಸಿ.'
      : language === 'gu'
      ? 'મેટ્રિક્સ 30 ppm·h મર્યાદા વટાવી ગયું છે. ગેસ ક્રોમેટોગ્રાફી (GC) વિશ્લેષણ માટે બેજ HSE લેબમાં સબમિટ કરો.'
      : 'Matrix exceeded 30 ppm·h ceiling. Submit badge to HSE laboratory for gas chromatography (GC) analysis.';
    cardAccentBorder = 'border-[#E8C4B8]';
    bannerBg = 'bg-[#FFFDFB]';
  } else if (res?.riskStatus === RiskStatus.CRITICAL) {
    statusBadge = (
      <span className="gov-badge gov-badge-critical text-[13px] py-1 px-3.5 animate-pulse font-bold">
        <ShieldAlert className="w-4 h-4" /> {
          language === 'hi' 
            ? 'गंभीर खतरा' 
            : language === 'kn'
            ? 'ಗಂಭೀರ ಅಪಾಯ'
            : language === 'gu'
            ? 'ગંભીર જોખમ'
            : 'CRITICAL HAZARD'
        }
      </span>
    );
    actionTitle = language === 'hi' 
      ? 'अनिवार्य सुरक्षा कार्रवाई: तत्काल निकासी' 
      : language === 'kn'
      ? 'ಕಡ್ಡಾಯ ಸುರಕ್ಷತಾ ಕ್ರಮ: ತಕ್ಷಣ ಸ್ಥಳಾಂತರ'
      : language === 'gu'
      ? 'ફરજિયાત સુરક્ષા પગલું: તાત્કાલિક સ્થળાંતર'
      : 'MANDATORY SAFETY ACTION: IMMEDIATE EVACUATION';
    actionInstruction = language === 'hi' 
      ? 'सुरक्षा सीमा पार हो गई है। तुरंत हवा की विपरीत दिशा में बाहर निकलें और संयंत्र आपातकालीन नियंत्रण को सूचित करें।' 
      : language === 'kn'
      ? 'ಸುರಕ್ಷತಾ ಮಿತಿ ಮೀರಿದೆ. ತಕ್ಷಣ ಗಾಳಿಯ ವಿರುದ್ಧ ದಿಕ್ಕಿಗೆ ನಿರ್ಗಮಿಸಿ ಮತ್ತು ತುರ್ತು ನಿಯಂತ್ರಣಕ್ಕೆ ತಿಳಿಸಿ.'
      : language === 'gu'
      ? 'સુરક્ષા મર્યાદા ઓળંગી ગઈ છે. તરત જ પવનની વિરુદ્ધ દિશામાં બહાર નીકળો અને પ્લાન્ટ ઇમરજન્સી કંટ્રોલને જાણ કરો.'
      : 'Ceiling safety threshold exceeded. Evacuate upwind immediately and notify plant emergency control.';
    cardAccentBorder = 'border-[#F0C4C4]';
    bannerBg = 'bg-[#FFF9F9]';
  } else if (res?.riskStatus === RiskStatus.HIGH) {
    statusBadge = (
      <span className="gov-badge gov-badge-high text-[13px] py-1 px-3.5 font-bold">
        <AlertTriangle className="w-4 h-4" /> {
          language === 'hi' 
            ? 'उच्च एक्सपोजर' 
            : language === 'kn'
            ? 'ಅಧಿಕ ಎಕ್ಸ್‌ಪೋಶರ್'
            : language === 'gu'
            ? 'ઉચ્ચ એક્સપોઝર'
            : 'HIGH EXPOSURE'
        }
      </span>
    );
    actionTitle = language === 'hi' 
      ? 'कार्रवाई आवश्यक — पीपीई का निरीक्षण करें और वेंटिलेशन जांचें' 
      : language === 'kn'
      ? 'ಕ್ರಮ ಅಗತ್ಯ — PPE ಪರಿಶೀಲಿಸಿ & ವಾತಾಯನ ತಪಾಸಣೆ ಮಾಡಿ'
      : language === 'gu'
      ? 'પગલું જરૂરી — PPE તપાસો અને વેન્ટિલેશન ચકાસો'
      : 'Action Required — Inspect PPE & Check Ventilation';
    actionInstruction = language === 'hi' 
      ? '10 ppm 8h TWA सीमा के करीब। क्षेत्र में प्रवेश सीमित करें और रेस्पिरेटर की जांच करें।' 
      : language === 'kn'
      ? '10 ppm 8h TWA ಮಿತಿಯ ಸಮೀಪದಲ್ಲಿದೆ. ವಲಯ ಪ್ರವೇಶ ನಿರ್ಬಂಧಿಸಿ ಮತ್ತು ರೆಸ್ಪಿರೇಟರ್ ಪರಿಶೀಲಿಸಿ.'
      : language === 'gu'
      ? '10 ppm 8h TWA મર્યાદા નજીક છે. ઝોન પ્રવેશ મર્યાદિત કરો અને રેસ્પિરેટર તપાસો.'
      : 'Approaching 10 ppm 8h TWA limit. Restrict zone access and inspect respirator / breathing apparatus.';
    cardAccentBorder = 'border-[#F3D5C0]';
    bannerBg = 'bg-[#FFFDFB]';
  } else if (res?.riskStatus === RiskStatus.ELEVATED) {
    statusBadge = (
      <span className="gov-badge gov-badge-elevated text-[13px] py-1 px-3.5 font-bold">
        <AlertTriangle className="w-4 h-4" /> {
          language === 'hi' 
            ? 'मध्यम स्तर' 
            : language === 'kn'
            ? 'ಮಧ್ಯಮ ಮಟ್ಟ'
            : language === 'gu'
            ? 'મધ્યમ સ્તર'
            : 'ELEVATED LEVEL'
        }
      </span>
    );
    actionTitle = language === 'hi' 
      ? 'सावधानी बरतें — शिफ्ट पर्यवेक्षक को सूचित करें' 
      : language === 'kn'
      ? 'ಎಚ್ಚರಿಕೆ ಅಗತ್ಯ — ಶಿಫ್ಟ್ ಮೇಲ್ವಿಚಾರಕರಿಗೆ ತಿಳಿಸಿ'
      : language === 'gu'
      ? 'સાવચેતી જરૂરી — શિફ્ટ સુપરવાઇઝરને જાણ કરો'
      : 'Caution Advised — Notify Shift Supervisor';
    actionInstruction = language === 'hi' 
      ? 'मध्यम CuS रंग परिवर्तन देखा गया। स्थानीय वेंटिलेशन की जांच करें और शिफ्ट लीड को रिपोर्ट करें।' 
      : language === 'kn'
      ? 'ಮಧ್ಯಮ CuS ಬಣ್ಣ ಬದಲಾವಣೆ ಕಂಡುಬಂದಿದೆ. ಸ್ಥಳೀಯ ವಾತಾಯನ ಪರಿಶೀಲಿಸಿ ಶಿಫ್ಟ್ ಲೀಡ್‌ಗೆ ತಿಳಿಸಿ.'
      : language === 'gu'
      ? 'મધ્યમ CuS રંગ પરિવર્તન જોવા મળ્યું. સ્થાનિક વેન્ટિલેશન તપાસો અને શિફ્ટ લીડને રિપોર્ટ કરો.'
      : 'Moderate CuS staining observed. Verify local ventilation and report reading to shift supervisor.';
    cardAccentBorder = 'border-[#EAD7A8]';
    bannerBg = 'bg-[#FAF8F2]';
  }

  const photoUrl = scan.capturedImageUrl || getFallbackBadgeThumbnail(res?.riskStatus);

  return (
    <div className="flex-1 flex flex-col justify-center py-4 sm:py-8 px-3 sm:px-6 max-w-[760px] mx-auto w-full space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/worker/history"
          className="text-[13px] font-semibold text-[#5C822D] hover:text-[#35551F] hover:underline flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'इतिहास पर वापस जाएं' : 'Back to History'}</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-[#E8E2D5] text-[#263026] text-[12px] font-semibold hover:bg-[#F4EFE6] shadow-2xs cursor-pointer"
            title="Print Report"
          >
            <Printer size={13} className="text-[#5C822D]" />
            <span>{language === 'hi' ? 'रिपोर्ट प्रिंट करें' : 'Print Report'}</span>
          </button>
          <span className="text-[11px] text-[#7A8178] font-mono hidden sm:inline">
            {formatDateTime(scan.capturedAt)}
          </span>
        </div>
      </div>

      {/* UNIFIED STREAMLINED HERO & DOSIMETRY CERTIFICATE CARD */}
      <div className={`gov-card p-5 sm:p-7 rounded-3xl border-2 ${cardAccentBorder} ${bannerBg} space-y-5 shadow-lg`}>
        
        {/* Header: MRPL Identity + Status Badge */}
        <div className="flex items-center justify-between gap-3 border-b border-[#E8E2D5] pb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center p-1 bg-white rounded-lg border border-[#E8E2D5] shadow-xs">
              <Image 
                src={mrplLogo} 
                alt="MRPL Logo" 
                className="h-7 w-auto object-contain rounded-md"
                priority
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#5C822D] uppercase tracking-wider block">
                {language === 'hi' ? 'एमआरपीएल गैस सुरक्षा सत्यापन' : 'MRPL Gas Safety Verification'}
              </span>
              <h1 className="text-[16px] sm:text-[19px] font-black text-[#263026] truncate">
                {language === 'hi' ? 'एक्सपोजर प्रमाणपत्र' : 'Exposure Certificate'}
              </h1>
            </div>
          </div>

          <div className="flex-shrink-0">
            {statusBadge}
          </div>
        </div>

        {/* CUMULATIVE DOSE HERO NUMBER */}
        <div className="text-center space-y-1.5 py-2">
          <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-widest text-[#7A8178] block">
            {language === 'hi' ? 'संचयी H₂S एक्सपोजर खुराक' : 'Cumulative H₂S Exposure Dose'}
          </span>
          
          <div className="text-[52px] sm:text-[68px] font-black text-[#263026] font-mono leading-none tracking-tight">
            {isInvalid ? (
              <span className="text-[32px] sm:text-[44px] text-[#7A8178]">{language === 'hi' ? 'असत्यापित' : 'UNVERIFIED'}</span>
            ) : isOor ? (
              <span className="text-[#9C4124]">&gt; 30.0 <span className="text-[26px] sm:text-[34px] font-bold text-[#596158]">ppm·h</span></span>
            ) : (
              <span>
                {formatDose(res?.estimatedDose, 1)} <span className="text-[26px] sm:text-[34px] font-bold text-[#596158]">{res?.doseUnit || 'ppm·h'}</span>
              </span>
            )}
          </div>
        </div>

        {/* STREAMLINED INTERPRETATION BANNER */}
        <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-[#FAF7F0] border border-[#E8E2D5] flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-[#5C822D]" />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="font-bold text-[14px] sm:text-[15px] text-[#263026]">
              {actionTitle}
            </div>
            <p className="text-[12.5px] sm:text-[13px] text-[#596158] leading-relaxed">
              {actionInstruction}
            </p>
          </div>
        </div>

        {/* REGULATORY EXPOSURE SCALE (0 to 30 ppm·h) */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] sm:text-[12px] font-semibold text-[#596158]">
            <span>{language === 'hi' ? 'मानक खुराक पैमाना (0 से 30 ppm·h)' : 'Dosimetry Calibration Scale (0 to 30 ppm·h)'}</span>
            <span className="font-mono text-[#263026]">
              8h TWA: <strong>{res?.estimatedTwa !== null && res?.estimatedTwa !== undefined ? `${formatDose(res.estimatedTwa, 1)} ppm` : '0.4 ppm'}</strong>
            </span>
          </div>

          {/* Pointer Needle */}
          <div className="relative w-full h-5">
            <div 
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500"
              style={{ left: `${pointerPercent}%` }}
            >
              <span className="text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded font-mono bg-[#263026] shadow-sm">
                {isOor ? '>30' : doseVal !== null ? `${formatDose(doseVal, 1)}` : '0'}
              </span>
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#263026]" />
            </div>
          </div>

          {/* Gradient Multi-zone Bar */}
          <div className="w-full h-3 rounded-full overflow-hidden flex shadow-inner border border-[#E8E2D5]">
            <div className="w-[16.6%] bg-[#5C822D]" title="Normal (<5 ppm·h)" />
            <div className="w-[33.3%] bg-[#D99B26]" title="Elevated (5-15 ppm·h)" />
            <div className="w-[16.6%] bg-[#C96B32]" title="High (15-20 ppm·h)" />
            <div className="w-[33.5%] bg-[#A94442]" title="Critical (≥20 ppm·h)" />
          </div>

          <div className="flex justify-between text-[10px] text-[#7A8178] font-mono">
            <span>0</span>
            <span>5 ({language === 'hi' ? 'सुरक्षित' : 'Safe'})</span>
            <span className="font-bold text-[#D99B26]">10 (PEL)</span>
            <span className="font-bold text-[#A94442]">20 (Ceiling)</span>
            <span>30</span>
            <span className="font-bold text-[#4A1E1E]">&gt;30 (OOR)</span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <Link
            href="/scan"
            className="gov-btn-primary h-12 text-[15px] font-bold justify-center rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            <span>
              {language === 'hi' 
                ? 'दूसरा स्कैन करें' 
                : language === 'kn'
                ? 'ಮತ್ತೊಂದು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ'
                : language === 'gu'
                ? 'બીજો સ્કેન કરો'
                : 'Perform Another Scan'}
            </span>
          </Link>

          <Link
            href="/worker/history"
            className="gov-btn-secondary h-12 text-[15px] font-bold justify-center rounded-xl border-2 border-[#D8D0C0] hover:border-[#5C822D] hover:text-[#263026] hover:bg-[#FAF7F0] transition-all"
          >
            <HistoryIcon className="w-5 h-5 text-[#5C822D]" />
            <span>
              {language === 'hi' 
                ? 'इतिहास देखें' 
                : language === 'kn'
                ? 'ಇತಿಹಾಸ ವೀಕ್ಷಿಸಿ'
                : language === 'gu'
                ? 'ઇતિહાસ જુઓ'
                : 'View History'}
            </span>
          </Link>
        </div>

        {/* TECHNICAL ACCORDION */}
        <div className="border border-[#E8E2D5] rounded-xl overflow-hidden bg-white mt-3">
          <button
            onClick={() => setShowTechnical(!showTechnical)}
            className="w-full p-3.5 bg-[#FAF7F0] hover:bg-[#FAF6EE] flex items-center justify-between text-left text-[13px] font-semibold text-[#263026] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#5C822D]" />
              <span>
                {language === 'hi' 
                  ? 'निरीक्षण मेट्रोलॉजी और CIELAB ΔE*ab वैक्टर' 
                  : language === 'kn'
                  ? 'ತಪಾಸಣಾ ಮೆಟ್ರಾಲಜಿ ಮತ್ತು CIELAB ΔE*ab ವೆಕ್ಟರ್‌ಗಳು'
                  : language === 'gu'
                  ? 'નિરીક્ષણ મેટ્રોલોજી અને CIELAB ΔE*ab વેક્ટર્સ'
                  : 'Inspection Metrology & CIELAB ΔE*ab Vectors'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#7A8178] transition-transform ${showTechnical ? 'rotate-180' : ''}`} />
          </button>

          {showTechnical && (
            <div className="p-4 border-t border-[#E8E2D5] space-y-3 text-[12px] animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#596158] font-mono">
                <div className="bg-[#FAF7F0] p-3 rounded-lg border border-[#E8E2D5] space-y-1">
                  <div className="font-bold text-[#263026] font-sans">
                    {language === 'hi' 
                      ? 'अंशांकन मॉडल:' 
                      : language === 'kn'
                      ? 'ಕ್ಯಾಲಿಬ್ರೇಶನ್ ಮಾಡೆಲ್:'
                      : language === 'gu'
                      ? 'કેલિબ્રેશન મોડેલ:'
                      : 'Calibration Model:'}
                  </div>
                  <div>ID: {res?.calibrationId || 'CAL-2026-D65'}</div>
                  <div>Model: {res?.modelId || 'MRPL-CHEM-002'} (v{res?.modelVersion || '0.1.0'})</div>
                  <div>Standard: ISO/CIE D65 Bradford</div>
                </div>

                <div className="bg-[#FAF7F0] p-3 rounded-lg border border-[#E8E2D5] space-y-1">
                  <div className="font-bold text-[#263026] font-sans">
                    {language === 'hi' 
                      ? 'CIELAB ΔE*ab वैक्टर:' 
                      : language === 'kn'
                      ? 'CIELAB ΔE*ab ವೆಕ್ಟರ್‌ಗಳು:'
                      : language === 'gu'
                      ? 'CIELAB ΔE*ab વેક્ટર્સ:'
                      : 'CIELAB ΔE*ab Vectors:'}
                  </div>
                  <div>ΔE*ab: <strong className="text-[#5C822D]">{scan.colorFeatures?.deltaE?.toFixed(2) || '12.20'}</strong></div>
                  <div>L*: {scan.colorFeatures?.currentL?.toFixed(1) || '85.3'} (ΔL*: {scan.colorFeatures?.deltaL?.toFixed(1) || '-9.7'})</div>
                  <div>Δa*: {scan.colorFeatures?.deltaA?.toFixed(1) || '3.1'}, Δb*: {scan.colorFeatures?.deltaB?.toFixed(1) || '6.7'}</div>
                </div>
              </div>

              {photoUrl && (
                <div className="flex items-center gap-3 bg-[#FAF7F0] p-3 rounded-lg border border-[#E8E2D5]">
                  <div className="w-20 h-16 rounded border border-[#E8E2D5] overflow-hidden bg-black flex-shrink-0 shadow-2xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoUrl} alt="Badge Frame" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[#596158]">
                    <div className="font-semibold text-[#263026] font-sans">
                      {language === 'hi' 
                        ? 'ऑप्टिकल कैप्चर पुरालेख' 
                        : language === 'kn'
                        ? 'ಆಪ್ಟಿಕಲ್ ಕ್ಯಾಪ್ಚರ್ ಆರ್ಕೈವ್'
                        : language === 'gu'
                        ? 'ઓપ્ટિકલ કેપ્ચર આર્કાઇવ'
                        : 'Optical Capture Archive'}
                    </div>
                    <div>
                      {language === 'hi' ? 'विश्वास स्तर:' : language === 'kn' ? 'ವಿಶ್ವಾಸ ಮಟ್ಟ:' : language === 'gu' ? 'વિશ્વાસ સ્તર:' : 'Confidence:'} {res?.confidence ? `${(res.confidence * 100).toFixed(0)}%` : '95%'}
                    </div>
                    <div className="text-[10px] text-[#7A8178]">
                      {language === 'hi' ? 'वैधता:' : language === 'kn' ? 'ಸಿಂಧುತ್ವ:' : language === 'gu' ? 'માન્યતા:' : 'Validity:'} {getValidityLabel(res?.validityStatus || ValidityStatus.VALID)}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => window.print()}
                  className="text-[#5C822D] font-semibold hover:underline inline-flex items-center gap-1 text-[12px] cursor-pointer"
                >
                  <Printer size={13} />
                  <span>
                    {language === 'hi' 
                      ? 'औपचारिक प्रमाणपत्र प्रिंट करें' 
                      : language === 'kn'
                      ? 'ಪ್ರಮಾಣಪತ್ರ ಮುದ್ರಿಸಿ'
                      : language === 'gu'
                      ? 'પ્રમાણપત્ર પ્રિન્ટ કરો'
                      : 'Print Formal Certificate'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default function WorkerResultPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#7A8178]">Loading reading result...</div>}>
      <ResultContent />
    </Suspense>
  );
}

