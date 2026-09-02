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
  const [showThresholds, setShowThresholds] = useState(false);

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
    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] sm:text-[13px] font-bold bg-[#EDF5E5] text-[#35551F] border border-[#C6DCC0] shadow-2xs">
      <CheckCircle2 className="w-4 h-4 text-[#5C822D]" />
      <span>
        {language === 'hi' 
          ? 'सुरक्षित बेसलाइन' 
          : language === 'kn'
          ? 'ಸುರಕ್ಷಿತ ಬೇಸ್‌ಲೈನ್'
          : language === 'gu'
          ? 'સુરક્ષિત બેઝલાઇન'
          : 'SAFE BASELINE'}
      </span>
    </span>
  );
  let actionTitle = language === 'hi' 
    ? 'सामान्य शिफ्ट प्रक्रिया' 
    : language === 'kn'
    ? 'ಸಾಮಾನ್ಯ ಶಿಫ್ಟ್ ಪ್ರಕ್ರಿಯೆ'
    : language === 'gu'
    ? 'સામાન્ય શિફ્ટ પ્રક્રિયા'
    : 'Normal Shift Procedure';
  let actionInstruction = language === 'hi' 
    ? 'मानक पीपीई के साथ निर्धारित शिफ्ट संचालन जारी रखें।' 
    : language === 'kn'
    ? 'ಪ್ರಮಾಣಿತ PPE ನೊಂದಿಗೆ ನಿಗದಿತ ಶಿಫ್ಟ್ ಕಾರ್ಯಾಚರಣೆ ಮುಂದುವರಿಸಿ.'
    : language === 'gu'
    ? 'પ્રમાણભૂત PPE સાથે નિર્ધારિત શિફ્ટ કામગીરી ચાલુ રાખો.'
    : 'Continue scheduled operations with standard PPE.';
  let doseTextColor = 'text-[#35551F]';
  let doseUnitColor = 'text-[#5C822D]';
  let cardAccentBorder = 'border-[#C6DCC0]';
  let bannerBg = 'bg-[#FAFDF6]';
  let actionBoxBorder = 'border-[#C6DCC0]';
  let actionBoxBg = 'bg-[#EDF5E5]';
  let actionIconColor = 'text-[#35551F]';

  if (isInvalid) {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] sm:text-[13px] font-bold bg-[#FAF6EE] text-[#7A8178] border border-[#D8D0C0] shadow-2xs">
        <XCircle className="w-4 h-4 text-[#A94442]" />
        <span>
          {language === 'hi' 
            ? 'अमान्य स्कैन / चमक' 
            : language === 'kn'
            ? 'ಅಮಾನ್ಯ ಸ್ಕ್ಯಾನ್ / ಗ್ಲೇರ್'
            : language === 'gu'
            ? 'અમાન્ય સ્કેન / ચમક'
            : 'UNVERIFIED / GLARE'}
        </span>
      </span>
    );
    actionTitle = language === 'hi' 
      ? 'रीडिंग अस्वीकृत — चमक / धुंधलापन' 
      : language === 'kn'
      ? 'ರೀಡಿಂಗ್ ತಿರಸ್ಕರಿಸಲಾಗಿದೆ — ಗ್ಲೇರ್ / ಬ್ಲರ್'
      : language === 'gu'
      ? 'રીડિંગ અસ્વીકાર — ચમક / બ્લર'
      : 'Reading Refused — Glare / Optical Blur';
    actionInstruction = language === 'hi' 
      ? 'अत्यधिक चमक या धुंधलापन पहचाना गया। रिस्टबैंड को फ्रेम में संरेखित कर दोबारा फोटो लें।' 
      : language === 'kn'
      ? 'ಅತಿಯಾದ ಹೊಳಪು ಅಥವಾ ಅಸ್ಪಷ್ಟತೆ ಇದೆ. ರೆಟಿಕಲ್‌ನಲ್ಲಿ ಮರುಹೊಂದಿಸಿ ಮತ್ತೆ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ.'
      : language === 'gu'
      ? 'વધારે પડતી ચમક અથવા અસ્પષ્ટતા છે. રેટિકલની અંદર ફરી ગોઠવો અને ફરીથી ફોટો લો.'
      : 'Specular glare or blur detected. Re-align wristband inside frame and retake scan.';
    doseTextColor = 'text-[#7A8178]';
    doseUnitColor = 'text-[#7A8178]';
    cardAccentBorder = 'border-[#D8D0C0]';
    bannerBg = 'bg-[#FAF6EE]';
    actionBoxBorder = 'border-[#D8D0C0]';
    actionBoxBg = 'bg-[#EDE7DA]';
    actionIconColor = 'text-[#7A8178]';
  } else if (isOor) {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] sm:text-[13px] font-bold bg-[#FAF2EB] text-[#9C4124] border border-[#E8C4B8] shadow-2xs">
        <AlertTriangle className="w-4 h-4 text-[#9C4124]" />
        <span>
          {language === 'hi' 
            ? 'सेंसर संतृप्त' 
            : language === 'kn'
            ? 'ಸೆನ್ಸರ್ ಸ್ಯಾಚುರೇಟೆಡ್'
            : language === 'gu'
            ? 'સેન્સર સંતૃપ્ત'
            : 'SENSOR SATURATED'}
        </span>
      </span>
    );
    actionTitle = language === 'hi' 
      ? 'सेंसर संतृप्ति (>30.0 ppm·h)' 
      : language === 'kn'
      ? 'ಸೆನ್ಸರ್ ಸ್ಯಾಚುರೇಶನ್ (>30.0 ppm·h)'
      : language === 'gu'
      ? 'સેન્સર સંતૃપ્તિ (>30.0 ppm·h)'
      : 'Sensor Saturation (>30.0 ppm·h)';
    actionInstruction = language === 'hi' 
      ? 'मैट्रिक्स 30 ppm·h सीमा पार कर गया है। विस्तृत विश्लेषण के लिए बैज एचएसई लैब में जमा करें।' 
      : language === 'kn'
      ? 'ಮ್ಯಾಟ್ರಿಕ್ಸ್ 30 ppm·h ಮೀರಿದೆ. ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಬ್ಯಾಡ್ಜ್ ಅನ್ನು HSE ಲ್ಯಾಬ್‌ಗೆ ಸಲ್ಲಿಸಿ.'
      : language === 'gu'
      ? 'મેટ્રિક્સ 30 ppm·h વટાવી ગયું છે. વિશ્લેષણ માટે બેજ HSE લેબમાં સબમિટ કરો.'
      : 'Matrix exceeded 30 ppm·h ceiling. Submit wristband to HSE lab for chromatographic analysis.';
    doseTextColor = 'text-[#9C4124]';
    doseUnitColor = 'text-[#9C4124]';
    cardAccentBorder = 'border-[#E8C4B8]';
    bannerBg = 'bg-[#FAF3EE]';
    actionBoxBorder = 'border-[#E8C4B8]';
    actionBoxBg = 'bg-[#F7E5DB]';
    actionIconColor = 'text-[#9C4124]';
  } else if (res?.riskStatus === RiskStatus.CRITICAL) {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] sm:text-[13px] font-bold bg-[#FFF0F0] text-[#A94442] border border-[#F0C4C4] shadow-2xs animate-pulse">
        <ShieldAlert className="w-4 h-4 text-[#A94442]" />
        <span>
          {language === 'hi' 
            ? 'गंभीर अलार्म' 
            : language === 'kn'
            ? 'ಗಂಭೀರ ಅಪಾಯ'
            : language === 'gu'
            ? 'ગંભીર જોખમ'
            : 'CRITICAL HAZARD'}
        </span>
      </span>
    );
    actionTitle = language === 'hi' 
      ? 'तत्काल सुरक्षा कार्रवाई: क्षेत्र खाली करें' 
      : language === 'kn'
      ? 'ಕಡ್ಡಾಯ ಕ್ರಮ: ತಕ್ಷಣ ಸ್ಥಳಾಂತರ'
      : language === 'gu'
      ? 'તાત્કાલિક પગલું: સ્થળાંતર કરો'
      : 'Mandatory Action: Immediate Evacuation';
    actionInstruction = language === 'hi' 
      ? 'सुरक्षा सीमा पार हो गई है। तुरंत हवा की विपरीत दिशा में निकलें और आपातकालीन नियंत्रण को सूचित करें।' 
      : language === 'kn'
      ? 'ಸುರಕ್ಷತಾ ಮಿತಿ ಮೀರಿದೆ. ತಕ್ಷಣ ಗಾಳಿಯ ವಿರುದ್ಧ ದಿಕ್ಕಿಗೆ ನಿರ್ಗಮಿಸಿ ಮತ್ತು ನಿಯಂತ್ರಣಕ್ಕೆ ತಿಳಿಸಿ.'
      : language === 'gu'
      ? 'સુરક્ષા મર્યાદા ઓળંગી ગઈ છે. તરત જ પવનની વિરુદ્ધ દિશામાં નીકળો અને જાણ કરો.'
      : 'Ceiling threshold exceeded. Evacuate upwind immediately and report to emergency safety officer.';
    doseTextColor = 'text-[#A94442]';
    doseUnitColor = 'text-[#A94442]';
    cardAccentBorder = 'border-[#F0C4C4]';
    bannerBg = 'bg-[#FFF6F6]';
    actionBoxBorder = 'border-[#F0C4C4]';
    actionBoxBg = 'bg-[#FCE8E8]';
    actionIconColor = 'text-[#A94442]';
  } else if (res?.riskStatus === RiskStatus.HIGH) {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] sm:text-[13px] font-bold bg-[#FFF5F2] text-[#C96B32] border border-[#F3D5C0] shadow-2xs">
        <AlertTriangle className="w-4 h-4 text-[#C96B32]" />
        <span>
          {language === 'hi' 
            ? 'उच्च एक्सपोज़र' 
            : language === 'kn'
            ? 'ಅಧಿಕ ಎಕ್ಸ್‌ಪೋಶರ್'
            : language === 'gu'
            ? 'ઉચ્ચ એક્સપોઝર'
            : 'HIGH EXPOSURE'}
        </span>
      </span>
    );
    actionTitle = language === 'hi' 
      ? 'कार्रवाई आवश्यक — पीपीई व वेंटिलेशन जांचें' 
      : language === 'kn'
      ? 'ಕ್ರಮ ಅಗತ್ಯ — PPE & ವಾತಾಯನ ಪರಿಶೀಲಿಸಿ'
      : language === 'gu'
      ? 'પગલું જરૂરી — PPE અને વેન્ટિલેશન તપાસો'
      : 'Action Required — Inspect PPE & Check Ventilation';
    actionInstruction = language === 'hi' 
      ? '10 ppm 8h TWA सीमा के करीब। क्षेत्र में प्रवेश सीमित करें और रेस्पिरेटर की जांच करें।' 
      : language === 'kn'
      ? '10 ppm 8h TWA ಮಿತಿಯ ಸಮೀಪದಲ್ಲಿದೆ. ವಲಯ ಪ್ರವೇಶ ನಿರ್ಬಂಧಿಸಿ ಮತ್ತು ರೆಸ್ಪಿರೇಟರ್ ಪರಿಶೀಲಿಸಿ.'
      : language === 'gu'
      ? '10 ppm 8h TWA મર્યાદા નજીક છે. ઝોન પ્રવેશ મર્યાદિત કરો અને રેસ્પિરેટર તપાસો.'
      : 'Approaching 10 ppm 8h TWA limit. Restrict zone access and verify breathing apparatus.';
    doseTextColor = 'text-[#C96B32]';
    doseUnitColor = 'text-[#C96B32]';
    cardAccentBorder = 'border-[#F3D5C0]';
    bannerBg = 'bg-[#FFFBF7]';
    actionBoxBorder = 'border-[#F3D5C0]';
    actionBoxBg = 'bg-[#FDF0E6]';
    actionIconColor = 'text-[#C96B32]';
  } else if (res?.riskStatus === RiskStatus.ELEVATED) {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] sm:text-[13px] font-bold bg-[#FFFDF5] text-[#946800] border border-[#EAD7A8] shadow-2xs">
        <AlertTriangle className="w-4 h-4 text-[#946800]" />
        <span>
          {language === 'hi' 
            ? 'मध्यम स्तर' 
            : language === 'kn'
            ? 'ಮಧ್ಯಮ ಮಟ್ಟ'
            : language === 'gu'
            ? 'મધ્યમ સ્તર'
            : 'ELEVATED LEVEL'}
        </span>
      </span>
    );
    actionTitle = language === 'hi' 
      ? 'सावधानी बरतें — सुपरवाइज़र को बताएं' 
      : language === 'kn'
      ? 'ಎಚ್ಚರಿಕೆ ಅಗತ್ಯ — ಮೇಲ್ವಿಚಾರಕರಿಗೆ ತಿಳಿಸಿ'
      : language === 'gu'
      ? 'સાવચેતી જરૂરી — સુપરવાઇઝરને જાણ કરો'
      : 'Caution Advised — Notify Shift Supervisor';
    actionInstruction = language === 'hi' 
      ? 'मध्यम रंग परिवर्तन देखा गया। स्थानीय वेंटिलेशन की जांच करें और सुपरवाइज़र को रिपोर्ट करें।' 
      : language === 'kn'
      ? 'ಮಧ್ಯಮ ಬಣ್ಣ ಬದಲಾವಣೆ ಕಂಡುಬಂದಿದೆ. ವಾತಾಯನ ಪರಿಶೀಲಿಸಿ ಶಿಫ್ಟ್ ಲೀಡ್‌ಗೆ ತಿಳಿಸಿ.'
      : language === 'gu'
      ? 'મધ્યમ રંગ પરિવર્તન જોવા મળ્યું. વેન્ટિલેશન તપાસો અને સુપરવાઇઝરને રિપોર્ટ કરો.'
      : 'Moderate sensor shift observed. Verify local ventilation and report reading to shift supervisor.';
    doseTextColor = 'text-[#946800]';
    doseUnitColor = 'text-[#946800]';
    cardAccentBorder = 'border-[#EAD7A8]';
    bannerBg = 'bg-[#FFFDF7]';
    actionBoxBorder = 'border-[#EAD7A8]';
    actionBoxBg = 'bg-[#FAF3E0]';
    actionIconColor = 'text-[#946800]';
  }

  const photoUrl = scan.capturedImageUrl || getFallbackBadgeThumbnail(res?.riskStatus);

  return (
    <div className="flex-1 flex flex-col justify-center py-4 sm:py-6 px-3 sm:px-6 max-w-[580px] md:max-w-[700px] mx-auto w-full space-y-3.5 sm:space-y-4 animate-in fade-in zoom-in-95 duration-200">
      
      {/* 1. Compact Top Bar */}
      <div className="flex items-center justify-between gap-2 px-1">
        <Link
          href="/worker/history"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#5C822D] hover:text-[#35551F] active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'इतिहास' : language === 'kn' ? 'ಇತಿಹಾಸ' : language === 'gu' ? 'ઇતિહાસ' : 'History'}</span>
        </Link>

        <div className="text-center">
          <h1 className="text-[14px] sm:text-[15px] font-bold text-[#263026]">
            {language === 'hi' ? 'एक्सपोजर परिणाम' : 'Exposure Result'}
          </h1>
          <span className="text-[10.5px] text-[#7A8178] font-mono block">
            {formatDateTime(scan.capturedAt)}
          </span>
        </div>

        <button
          onClick={() => window.print()}
          className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-white border border-[#E8E2D5] text-[#596158] hover:text-[#263026] hover:bg-[#FAF8F3] active:scale-95 transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold"
          title={language === 'hi' ? 'रिपोर्ट प्रिंट करें' : 'Print Report'}
        >
          <Printer size={14} className="text-[#5C822D]" />
          <span className="hidden sm:inline">{language === 'hi' ? 'प्रिंट' : 'Print'}</span>
        </button>
      </div>

      {/* Operator & Shift Context Ribbon */}
      <div className="flex items-center justify-between text-[11.5px] sm:text-[12px] bg-[#FAF8F3] px-3.5 py-2 rounded-xl border border-[#E8E2D5] text-[#596158]">
        <div className="font-bold text-[#263026] truncate">
          {scan.workerName || 'Rajesh Kumar'}
          <span className="font-normal text-[#7A8178] ml-1.5">({scan.location || 'Zone A'})</span>
        </div>
        <div className="flex items-center gap-2 font-mono flex-shrink-0">
          <span>Badge: <strong className="text-[#263026]">{scan.dosimeterCode || scan.dosimeterId}</strong></span>
          <span>•</span>
          <span className="text-[#5C822D] font-bold bg-[#EDF3E4] px-1.5 py-0.2 rounded border border-[#C6DCC0]">
            {scan.shiftName || 'Shift A'} ({scan.shiftStart || '06:00'}–{scan.shiftEnd || '14:00'})
          </span>
        </div>
      </div>

      {/* 2. Main Safety & Exposure Hero Card */}
      <div className={`p-5 sm:p-6 rounded-2xl border ${cardAccentBorder} ${bannerBg} shadow-sm space-y-4 transition-all`}>
        
        {/* 2a. Safety Status Hero Pill */}
        <div className="flex justify-center">
          {statusBadge}
        </div>

        {/* 2b. Exposure Value: Largest Visual Hero */}
        <div className="text-center space-y-1 py-0.5">
          <div className={`text-[48px] sm:text-[62px] font-black ${doseTextColor} font-mono leading-none tracking-tight transition-colors duration-300`}>
            {isInvalid ? (
              <span className="text-[28px] sm:text-[38px] text-[#7A8178]">
                {language === 'hi' ? 'अमान्य स्कैन' : 'UNVERIFIED'}
              </span>
            ) : isOor ? (
              <span>
                &gt; 30.0 <span className={`text-[22px] sm:text-[28px] font-bold ${doseUnitColor}`}>ppm·h</span>
              </span>
            ) : (
              <span>
                {formatDose(res?.estimatedDose, 1)}{' '}
                <span className={`text-[22px] sm:text-[28px] font-bold ${doseUnitColor}`}>
                  {res?.doseUnit || 'ppm·h'}
                </span>
              </span>
            )}
          </div>
          <p className="text-[12px] sm:text-[13px] font-medium text-[#7A8178]">
            {language === 'hi' ? 'संचयी H₂S एक्सपोज़र' : 'Cumulative H₂S exposure'}
          </p>
        </div>

        {/* 2c. Clear Action Recommendation Box */}
        <div className={`bg-white/90 backdrop-blur-xs border ${actionBoxBorder} rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 shadow-2xs transition-colors duration-300`}>
          <div className={`p-2 rounded-xl ${actionBoxBg} border ${actionBoxBorder} flex-shrink-0 ${actionIconColor} mt-0.5 transition-colors duration-300`}>
            {isInvalid ? (
              <XCircle className="w-4 h-4" />
            ) : isOor ? (
              <AlertTriangle className="w-4 h-4" />
            ) : res?.riskStatus === RiskStatus.CRITICAL ? (
              <ShieldAlert className="w-4 h-4" />
            ) : res?.riskStatus === RiskStatus.HIGH || res?.riskStatus === RiskStatus.ELEVATED ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="font-bold text-[13px] sm:text-[14px] text-[#263026] leading-snug">
              {actionTitle}
            </div>
            <p className="text-[12px] text-[#596158] leading-relaxed">
              {actionInstruction}
            </p>
          </div>
        </div>

      </div>

      {/* 3. Compact Exposure Scale Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E2D5] shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-[12px]">
          <span className="font-bold text-[#263026]">
            {language === 'hi' ? 'एक्सपोज़र स्तर' : 'Exposure Level'}
          </span>
          <span className="text-[11px] font-mono font-bold text-[#7A8178]">
            {isInvalid ? '—' : isOor ? '> 30.0 ppm·h' : `${formatDose(doseVal, 1)} ppm·h`}
          </span>
        </div>

        {/* Gauge bar with moving pointer needle */}
        <div className="space-y-1.5">
          {!isInvalid && (
            <div className="relative w-full h-3.5">
              <div
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500 z-10"
                style={{ left: `${pointerPercent}%` }}
              >
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#263026]" />
              </div>
            </div>
          )}

          <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-[#E8E2D5]">
            <div className="w-[16.6%] bg-[#5C822D]" title="Safe (0-5 ppm·h)" />
            <div className="w-[16.6%] bg-[#D99B26]" title="Elevated (5-10 ppm·h)" />
            <div className="w-[33.3%] bg-[#C96B32]" title="High (10-20 ppm·h)" />
            <div className="w-[16.6%] bg-[#A94442]" title="Critical (20-30 ppm·h)" />
            <div className="w-[16.9%] bg-[#4A1E1E]" title="Out of Range (>30 ppm·h)" />
          </div>

          <div className="flex justify-between text-[10px] text-[#7A8178] font-mono pt-0.5">
            <span>0</span>
            <span className="text-[#35551F] font-semibold">5 ({language === 'hi' ? 'सुरक्षित' : 'Safe'})</span>
            <span className="font-semibold text-[#D99B26]">10 (PEL)</span>
            <span className="font-semibold text-[#A94442]">20 (Ceiling)</span>
            <span className="font-bold text-[#4A1E1E]">30+</span>
          </div>
        </div>

        {/* Collapsible Thresholds Explainer */}
        <div className="pt-2 border-t border-[#F0EBE0]">
          <button
            onClick={() => setShowThresholds(!showThresholds)}
            className="text-[11px] font-semibold text-[#5C822D] hover:text-[#35551F] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{language === 'hi' ? 'एक्सपोज़र सीमा मानक देखें' : 'View exposure thresholds'}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showThresholds ? 'rotate-180' : ''}`} />
          </button>

          {showThresholds && (
            <div className="mt-2 p-2.5 bg-[#FAF8F3] rounded-xl text-[11px] text-[#596158] space-y-1.5 animate-in fade-in duration-150 font-mono">
              <div className="flex justify-between"><strong className="text-[#35551F] font-sans">0 – 5 ppm·h:</strong> <span>Safe Baseline (Normal Shift)</span></div>
              <div className="flex justify-between"><strong className="text-[#D99B26] font-sans">5 – 10 ppm·h:</strong> <span>Elevated Exposure (Advisory)</span></div>
              <div className="flex justify-between"><strong className="text-[#C96B32] font-sans">10 ppm (8h TWA):</strong> <span>OSHA PEL Action Limit</span></div>
              <div className="flex justify-between"><strong className="text-[#A94442] font-sans">20 ppm:</strong> <span>OSHA Ceiling Limit (Evacuation)</span></div>
              <div className="flex justify-between"><strong className="text-[#4A1E1E] font-sans">&gt; 30 ppm·h:</strong> <span>Sensor Saturation (Lab GC)</span></div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Actions: Mobile Stack (Scan Again + History) */}
      <div className="space-y-2 pt-0.5">
        <Link
          href="/scan"
          className="gov-btn-primary w-full h-12 text-[15px] font-bold rounded-xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>
            {language === 'hi' 
              ? 'दूसरा स्कैन करें' 
              : language === 'kn'
              ? 'ಮತ್ತೊಂದು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ'
              : language === 'gu'
              ? 'બીજો સ્કેન કરો'
              : 'Scan Again'}
          </span>
        </Link>

        <div className="text-center pt-0.5">
          <Link
            href="/worker/history"
            className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#596158] hover:text-[#263026] py-1 px-3 rounded-lg hover:bg-black/5 transition-colors"
          >
            <HistoryIcon className="w-3.5 h-3.5 text-[#5C822D]" />
            <span>
              {language === 'hi' 
                ? 'इतिहास देखें →' 
                : language === 'kn'
                ? 'ಇತಿಹಾಸ ವೀಕ್ಷಿಸಿ →'
                : language === 'gu'
                ? 'ઇતિહાસ જુઓ →'
                : 'View History →'}
            </span>
          </Link>
        </div>
      </div>

      {/* 5. Collapsible Technical Details Accordion */}
      <div className="border border-[#E8E2D5] rounded-2xl overflow-hidden bg-white shadow-2xs">
        <button
          onClick={() => setShowTechnical(!showTechnical)}
          className="w-full p-3.5 bg-[#FAF8F3] hover:bg-[#F4EFE6] flex items-center justify-between text-left text-[12px] font-semibold text-[#596158] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#5C822D]" />
            <span>
              {language === 'hi' 
                ? 'तकनीकी विवरण एवं मेट्रोलॉजी' 
                : language === 'kn'
                ? 'ತಾಂತ್ರಿಕ ವಿವರಗಳು & ಮೆಟ್ರಾಲಜಿ'
                : language === 'gu'
                ? 'તકનીકી વિગતો અને મેટ્રોલોજી'
                : 'Technical Details & Metrology'}
            </span>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-[#7A8178] transition-transform ${showTechnical ? 'rotate-180' : ''}`} />
        </button>

        {showTechnical && (
          <div className="p-4 border-t border-[#E8E2D5] space-y-3 text-[11px] animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-[#596158]">
              <div className="bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8E2D5] space-y-1">
                <div className="font-bold text-[#263026] font-sans text-[11px]">{language === 'hi' ? 'अंशांकन व मॉडल:' : 'Calibration & Model:'}</div>
                <div>ID: {res?.calibrationId || 'CAL-2026-D65'}</div>
                <div>Model: {res?.modelId || 'DOSIM-CHEM-002'} (v{res?.modelVersion || '0.1.0'})</div>
                <div>Standard: ISO/CIE D65 Bradford</div>
              </div>

              <div className="bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8E2D5] space-y-1">
                <div className="font-bold text-[#263026] font-sans text-[11px]">{language === 'hi' ? 'CIELAB ΔE*ab वैक्टर:' : 'CIELAB ΔE*ab Vectors:'}</div>
                <div>ΔE*ab: <strong className="text-[#5C822D]">{scan.colorFeatures?.deltaE?.toFixed(2) || '12.20'}</strong></div>
                <div>L*: {scan.colorFeatures?.currentL?.toFixed(1) || '85.3'} (ΔL*: {scan.colorFeatures?.deltaL?.toFixed(1) || '-9.7'})</div>
                <div>Δa*: {scan.colorFeatures?.deltaA?.toFixed(1) || '3.1'}, Δb*: {scan.colorFeatures?.deltaB?.toFixed(1) || '6.7'}</div>
              </div>
            </div>

            {photoUrl && (
              <div className="flex items-center gap-3 bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8E2D5]">
                <div className="w-16 h-14 rounded-lg border border-[#E8E2D5] overflow-hidden bg-black flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoUrl} alt="Badge Capture" className="w-full h-full object-cover" />
                </div>
                <div className="text-[#596158] space-y-0.5">
                  <div className="font-semibold text-[#263026] font-sans text-[11px]">{language === 'hi' ? 'ऑप्टिकल कैप्चर' : 'Optical Capture'}</div>
                  <div>{language === 'hi' ? 'विश्वास स्तर:' : 'Confidence:'} {res?.confidence ? `${(res.confidence * 100).toFixed(0)}%` : '95%'}</div>
                  <div className="text-[10px] text-[#7A8178]">{language === 'hi' ? 'वैधता:' : 'Validity:'} {getValidityLabel(res?.validityStatus || ValidityStatus.VALID)}</div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                onClick={() => window.print()}
                className="text-[#5C822D] font-semibold hover:underline inline-flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <Printer size={12} />
                <span>{language === 'hi' ? 'औपचारिक प्रमाणपत्र प्रिंट करें' : 'Print Formal Certificate'}</span>
              </button>
            </div>
          </div>
        )}
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

