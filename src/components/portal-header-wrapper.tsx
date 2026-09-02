'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/stores/app-store';
import { TRANSLATIONS } from '@/lib/i18n';
import { determineActiveShift, ShiftConfig } from '@/services/shift-service';
import { 
  Accessibility,
  Sun,
  Calendar as CalendarIcon,
  Clock,
  X,
  Maximize2,
  Share2,
  PlusSquare,
  Camera,
  User,
  Activity,
  Users,
  AlertTriangle,
  FileText,
  Info
} from 'lucide-react';
import Image from 'next/image';
import brandLogo from '../../public/app-logo.png';
import { sfx } from '@/lib/sound-effects';
import { useMounted } from '@/hooks/use-mounted';

interface FullscreenDoc extends Document {
  webkitFullscreenElement?: Element;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface FullscreenEl extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

function HeaderClockAndDate({ language, shiftConfigs }: { language: string; shiftConfigs: ShiftConfig[] }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const activeShiftData = determineActiveShift(shiftConfigs, now);
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="flex items-center gap-2.5 text-[11px] sm:text-[12px]">
      <span className="flex items-center gap-1">
        <CalendarIcon size={12} className="text-[#5C822D]" />
        <span>{dateStr}</span>
      </span>
      <span className="text-[#D8D0C0]">|</span>
      <span className="flex items-center gap-1 font-mono">
        <Clock size={12} className="text-[#5C822D]" />
        <span>{timeStr}</span>
      </span>
      <span className="text-[#D8D0C0] hidden sm:inline">|</span>
      <span className="hidden sm:inline text-[#35551F] font-semibold">
        {activeShiftData.activeShift.name} ({activeShiftData.activeShift.startTime}–{activeShiftData.activeShift.endTime}) · Zone A
      </span>
    </div>
  );
}

export function PortalHeaderWrapper() {
  const pathname = usePathname();
  const { 
    language, 
    setLanguage, 
    fontSize, 
    setFontSize, 
    highContrast, 
    toggleHighContrast,
    shiftConfigs,
    alerts,
    setTeamModalOpen 
  } = useAppStore();

  const [accessibilityBarOpen, setAccessibilityBarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showIosPrompt, setShowIosPrompt] = useState(false);
  const [fullscreenToast, setFullscreenToast] = useState<string | null>(null);

  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const [aboutTapCount, setAboutTapCount] = useState(0);
  const lastAboutTapTimeRef = useRef<number>(0);
  const aboutLongPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isAboutLongPressRef = useRef(false);

  const mounted = useMounted();
  const t = TRANSLATIONS[language];

  const handleAboutPressStart = () => {
    isAboutLongPressRef.current = false;
    aboutLongPressTimerRef.current = setTimeout(() => {
      isAboutLongPressRef.current = true;
      sfx.playClick();
      window.dispatchEvent(new CustomEvent('h2s:open-demo-admin'));
    }, 650);
  };

  const handleAboutPressEnd = () => {
    if (aboutLongPressTimerRef.current) {
      clearTimeout(aboutLongPressTimerRef.current);
      aboutLongPressTimerRef.current = null;
    }
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    if (isAboutLongPressRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    sfx.playClick();
    const now = e.timeStamp;
    if (now - lastAboutTapTimeRef.current < 900) {
      const newCount = aboutTapCount + 1;
      setAboutTapCount(newCount);
      if (newCount >= 3) {
        e.preventDefault();
        setTeamModalOpen(true);
        setAboutTapCount(0);
        return;
      }
    } else {
      setAboutTapCount(1);
    }
    lastAboutTapTimeRef.current = now;
  };

  // Sync DOM classes with Zustand state
  useEffect(() => {
    if (!mounted) return;

    // Font scaling
    document.documentElement.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg');
    if (fontSize === 'sm') document.documentElement.classList.add('font-scale-sm');
    if (fontSize === 'lg') document.documentElement.classList.add('font-scale-lg');

    // Contrast
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [fontSize, highContrast, mounted]);

  // Fullscreen state listener & synchronization
  useEffect(() => {
    if (!mounted) return;

    const handleFullscreenChange = () => {
      const doc = document as FullscreenDoc;
      const isCurrentlyFull = !!(
        document.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFull);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [mounted]);

  const toggleFullscreen = async () => {
    try {
      const doc = document as FullscreenDoc;
      const docEl = document.documentElement as FullscreenEl;
      const isCurrentlyFull = !!(
        document.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );

      if (!isCurrentlyFull) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
          await docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) {
          await docEl.msRequestFullscreen();
        } else {
          // iOS Safari fallback
          setShowIosPrompt(true);
          return;
        }
        setIsFullscreen(true);
        setFullscreenToast(language === 'hi' ? 'फुल स्क्रीन सक्रिय (बाहर निकलने के लिए दबाकर रखें)' : 'Full Screen Active (Hold to Exit)');
        setTimeout(() => setFullscreenToast(null), 3000);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
        setIsFullscreen(false);
        setFullscreenToast(language === 'hi' ? 'फुल स्क्रीन समाप्त' : 'Exited Full Screen');
        setTimeout(() => setFullscreenToast(null), 2000);
      }
    } catch {
      setShowIosPrompt(true);
    }
  };

  const handlePressStart = () => {
    isLongPressRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      sfx.playClick();
      toggleFullscreen();
    }, 650);
  };

  const handlePressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleAccessibilityClick = (e: React.MouseEvent) => {
    if (isLongPressRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    sfx.playClick();
    setAccessibilityBarOpen(!accessibilityBarOpen);
  };

  const isFieldPersonnel = pathname === '/scan' || pathname.startsWith('/worker');
  const isHSE = pathname.startsWith('/hse') || pathname.startsWith('/dashboard');
  const navLinks = [
    { href: '/', label: t.navHome },
    { href: '/about', label: language === 'hi' ? 'विवरण' : language === 'kn' ? 'ವಿವರಣೆ' : language === 'gu' ? 'વિગતો' : 'About' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E7E5DE] shadow-2xs">
      {/* Thin Tricolor Accent Line */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      
      {/* 1. Institutional Master Header Bar */}
      <div className="max-w-[1240px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[58px] sm:min-h-[64px] py-1.5 gap-2 sm:gap-4">
          
          {/* Desktop Brand */}
          <Link href="/" className="hidden sm:flex items-center gap-2.5 sm:gap-3 group min-w-0 pr-1 flex-shrink-0 select-none">
            <div className="h-9 sm:h-10 w-9 sm:w-10 flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
              <Image 
                src={brandLogo} 
                alt="H2S Dosimeter Logo" 
                className="h-8 sm:h-9 w-auto object-contain block"
                priority
              />
            </div>

            <div className="flex flex-col justify-center min-w-0">
              <span className="font-bold text-[15px] sm:text-[17px] text-[#263026] leading-tight tracking-tight">
                {language === 'hi' ? 'H2S डोसीमीटर' : language === 'kn' ? 'H2S ಡೋಸಿಮೀಟರ್' : language === 'gu' ? 'H2S ડોસિમીટર' : 'H2S Dosimeter'}
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#596158] leading-tight font-medium">
                {language === 'hi' ? 'गैस सुरक्षा एवं एक्सपोज़र मॉनिटरिंग' : 'Gas Safety & Exposure Monitoring'}
              </span>
            </div>
          </Link>

          {/* Mobile-Only Header Brand (Tap to return Home) */}
          <div className="sm:hidden flex items-center gap-2 min-w-0 flex-1">
            <Link 
              href="/" 
              className="flex items-center gap-2 group min-w-0 pr-1 flex-shrink-0 select-none cursor-pointer"
              title={language === 'hi' ? 'होम पर जाएं' : 'Return to Home'}
            >
              <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
                <Image 
                  src={brandLogo} 
                  alt="H2S Dosimeter Logo" 
                  className="h-7 w-auto object-contain block"
                  priority
                />
              </div>
              <span className="font-bold text-[14px] text-[#263026] leading-tight truncate group-hover:text-[#5C822D] transition-colors">
                {language === 'hi' ? 'H2S डोसीमीटर' : language === 'kn' ? 'H2S ಡೋಸಿಮೀಟರ್' : language === 'gu' ? 'H2S ડોસિમીટર' : 'H2S Dosimeter'}
              </span>
            </Link>
          </div>

          {/* Right Controls: Accessibility Toggle & Search */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            
            {/* Accessibility Button */}
            <button
              onClick={handleAccessibilityClick}
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
              onTouchCancel={handlePressEnd}
              onContextMenu={(e) => e.preventDefault()}
              className={`relative flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-[12px] sm:text-[13px] font-semibold transition-all border select-none active:scale-95 cursor-pointer touch-manipulation ${
                accessibilityBarOpen
                  ? 'bg-[#5C822D] text-white border-[#476722] shadow-2xs'
                  : isFullscreen
                  ? 'bg-[#EDF3E4] text-[#35551F] border-[#5C822D]'
                  : 'bg-[#F4EFE6] hover:bg-[#EBE4D8] text-[#263026] border-[#E8E2D5]'
              }`}
              title={
                language === 'hi' 
                  ? 'सुगमता विकल्प (फुल स्क्रीन या बाहर निकलने के लिए दबाकर रखें)' 
                  : language === 'kn'
                  ? 'ಪ್ರವೇಶಿಸುವಿಕೆ ಆಯ್ಕೆಗಳು (ಫುಲ್ ಸ್ಕ್ರೀನ್‌ಗಾಗಿ ಒತ್ತಿ ಹಿಡಿಯಿರಿ)'
                  : language === 'gu'
                  ? 'સુલભતા વિકલ્પો (ફુલ સ્ક્રીન માટે દબાવી રાખો)'
                  : 'Accessibility Options (Press & hold for Full Screen / ESC)'
              }
              aria-expanded={accessibilityBarOpen}
            >
              <Accessibility size={16} className={accessibilityBarOpen ? 'text-white' : 'text-[#5C822D]'} />
              <span className="hidden lg:inline">
                {language === 'hi' ? 'सुगमता' : language === 'kn' ? 'ಪ್ರವೇಶಿಸುವಿಕೆ' : language === 'gu' ? 'સુલભતા' : 'Accessibility'}
              </span>
              {isFullscreen && (
                <span 
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#5C822D] border-2 border-white rounded-full shadow-xs" 
                  title="Full Screen Active" 
                />
              )}
            </button>

            {/* About Button (Short Tap: About page, 3-Tap: Team Dossier, Long Press: Demo Admin Panel) */}
            <Link
              href="/about"
              onClick={handleAboutClick}
              onMouseDown={handleAboutPressStart}
              onMouseUp={handleAboutPressEnd}
              onMouseLeave={handleAboutPressEnd}
              onTouchStart={handleAboutPressStart}
              onTouchEnd={handleAboutPressEnd}
              onTouchCancel={handleAboutPressEnd}
              onContextMenu={(e) => e.preventDefault()}
              className={`flex items-center gap-1.5 bg-[#F4EFE6] hover:bg-[#EBE4D8] active:scale-95 text-[#263026] font-semibold p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-[12px] sm:text-[13px] transition-all border select-none touch-manipulation cursor-pointer ${
                pathname === '/about'
                  ? 'bg-[#EDF3E4] text-[#35551F] border-[#5C822D] shadow-2xs'
                  : 'border-[#E8E2D5]'
              }`}
              title={
                language === 'hi'
                  ? 'परियोजना विवरण (3 बार दबाएं: टीम, दबाकर रखें: डेमो)'
                  : language === 'kn'
                  ? 'ಯೋಜನೆ ವಿವರಣೆ (3 ಬಾರಿ: ತಂಡ, ಹಿಡಿದುಕೊಳ್ಳಿ: ಡೆಮೊ)'
                  : language === 'gu'
                  ? 'પ્રોજેક્ટ વિગતો (3 વખત: ટીમ, દબાવી રાખો: ડેમો)'
                  : 'About Project (3-tap: Team Dossier, Hold: Demo Panel)'
              }
              aria-label="About"
            >
              <Info size={15} className={pathname === '/about' ? 'text-[#35551F]' : 'text-[#5C822D]'} />
              <span className="hidden md:inline">
                {language === 'hi' ? 'विवरण' : language === 'kn' ? 'ವಿವರಣೆ' : language === 'gu' ? 'વિગતો' : 'About'}
              </span>
            </Link>

          </div>
        </div>
      </div>

      {/* 2. Animated Accessibility & Localization Options Strip (Directly Below Master Header) */}
      {accessibilityBarOpen && (
        <div className="bg-[#F8F4EC] border-t border-b border-[#5C822D]/40 px-3 sm:px-8 py-2 text-[12px] text-[#596158] shadow-inner animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-3 flex-wrap">
            
            {/* Left: Shift & Date Info (Isolated lightweight timer) */}
            <HeaderClockAndDate language={language} shiftConfigs={shiftConfigs} />

            {/* Right: Controls (Font Scale, Contrast, 4 Languages, and Close) */}
            <div className="flex items-center gap-2 sm:gap-2.5 ml-auto flex-wrap">
              
              {/* Font Sizing (Desktop Only) */}
              <div className="hidden sm:flex items-center gap-1">
                <span className="text-[11px] text-[#7A8178] font-bold">
                  {language === 'hi' ? 'आकार:' : language === 'kn' ? 'ಗಾತ್ರ:' : language === 'gu' ? 'માપ:' : 'Size:'}
                </span>
                <div className="flex items-center border border-[#D8D0C0] rounded-lg bg-white overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setFontSize('sm')}
                    className={`px-2 py-0.5 min-w-[24px] text-center hover:bg-[#F4EFE6] transition-colors ${
                      fontSize === 'sm' ? 'bg-[#5C822D] text-white font-bold' : 'text-[#263026]'
                    }`}
                    title="Smaller Text"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSize('md')}
                    className={`px-2 py-0.5 min-w-[24px] text-center hover:bg-[#F4EFE6] transition-colors border-x border-[#D8D0C0] ${
                      fontSize === 'md' ? 'bg-[#5C822D] text-white font-bold' : 'text-[#263026]'
                    }`}
                    title="Standard Text"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('lg')}
                    className={`px-2 py-0.5 min-w-[24px] text-center hover:bg-[#F4EFE6] transition-colors ${
                      fontSize === 'lg' ? 'bg-[#5C822D] text-white font-bold' : 'text-[#263026]'
                    }`}
                    title="Larger Text"
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* High Contrast Mode Toggle */}
              <button
                onClick={toggleHighContrast}
                className={`px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 text-[11px] font-semibold shadow-2xs ${
                  highContrast 
                    ? 'bg-[#000000] text-[#FFFF00] border-[#FFFF00]' 
                    : 'bg-white text-[#263026] border-[#D8D0C0] hover:bg-[#F4EFE6]'
                }`}
                title="Toggle High Contrast"
                aria-pressed={highContrast}
              >
                <Sun size={12} />
                <span>{t.contrast}</span>
              </button>

              {/* 4-Language Switcher (EN, HI, KN, GU) */}
              <div className="flex items-center border border-[#D8D0C0] rounded-lg bg-white overflow-hidden shadow-2xs text-[11px]">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 transition-colors font-semibold ${
                    language === 'en' 
                      ? 'bg-[#5C822D] text-white font-bold' 
                      : 'text-[#263026] hover:bg-[#F4EFE6]'
                  }`}
                  title="English"
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-2 py-1 transition-colors font-semibold border-l border-[#D8D0C0] ${
                    language === 'hi' 
                      ? 'bg-[#5C822D] text-white font-bold' 
                      : 'text-[#263026] hover:bg-[#F4EFE6]'
                  }`}
                  title="हिंदी (Hindi)"
                >
                  हिंदी
                </button>
                <button
                  onClick={() => setLanguage('kn')}
                  className={`px-2 py-1 transition-colors font-semibold border-l border-[#D8D0C0] ${
                    language === 'kn' 
                      ? 'bg-[#5C822D] text-white font-bold' 
                      : 'text-[#263026] hover:bg-[#F4EFE6]'
                  }`}
                  title="ಕನ್ನಡ (Kannada)"
                >
                  ಕನ್ನಡ
                </button>
                <button
                  onClick={() => setLanguage('gu')}
                  className={`px-2 py-1 transition-colors font-semibold border-l border-[#D8D0C0] ${
                    language === 'gu' 
                      ? 'bg-[#5C822D] text-white font-bold' 
                      : 'text-[#263026] hover:bg-[#F4EFE6]'
                  }`}
                  title="ગુજરાતી (Gujarati)"
                >
                  ગુજરાતી
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setAccessibilityBarOpen(false)}
                className="p-1 rounded text-[#7A8178] hover:text-[#263026] hover:bg-[#E8E2D5] transition-colors"
                title="Close accessibility bar"
              >
                <X size={15} />
              </button>

            </div>

          </div>
        </div>
      )}

      {/* 3a. Desktop Sub-Navigation Bar for Field Personnel */}
      {isFieldPersonnel && (
        <div className="hidden sm:block bg-white border-t border-[#E8E2D5] shadow-2xs">
          <div className="max-w-[1240px] mx-auto px-6 lg:px-8 flex items-center justify-between h-11 sm:h-12">
            
            {/* Breadcrumb Section Context */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] truncate">
              <Link href="/" className="text-[#596158] hover:text-[#5C822D] hover:underline font-medium">
                {t.navHome}
              </Link>
              <span className="text-[#D5D2C9]">/</span>
              <span className="font-bold text-[#263026] truncate">
                {language === 'hi' ? 'फील्ड कार्मिक' : language === 'kn' ? 'ಫೀಲ್ಡ್ ಸಿಬ್ಬಂದಿ' : language === 'gu' ? 'ફીલ્ડ કર્મચારી' : 'Field Personnel'}
              </span>
            </div>

            {/* Desktop Nav Tabs */}
            <div className="flex items-center gap-1.5">
              <Link
                href="/scan"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                  pathname === '/scan'
                    ? 'bg-[#EEF3E7] text-[#35551F] font-bold shadow-2xs border border-[#C6DCC0]'
                    : 'text-[#596158] hover:text-[#263026] hover:bg-[#F7F6F1]'
                }`}
              >
                <Camera size={15} className={pathname === '/scan' ? 'text-[#5C822D]' : 'text-[#7A8178]'} />
                <span>{t.navScan}</span>
              </Link>

              <Link
                href="/worker/history"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                  pathname.startsWith('/worker')
                    ? 'bg-[#EEF3E7] text-[#35551F] font-bold shadow-2xs border border-[#C6DCC0]'
                    : 'text-[#596158] hover:text-[#263026] hover:bg-[#F7F6F1]'
                }`}
              >
                <User size={15} className={pathname.startsWith('/worker') ? 'text-[#5C822D]' : 'text-[#7A8178]'} />
                <span>{t.navHistory}</span>
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* 3b. Desktop Sub-Navigation Bar for HSE Team */}
      {isHSE && (
        <div className="hidden sm:block bg-white border-t border-[#E8E2D5] shadow-2xs">
          <div className="max-w-[1240px] mx-auto px-6 lg:px-8 flex items-center justify-between h-11 sm:h-12">
            
            {/* Breadcrumb Section Context */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] truncate">
              <Link href="/" className="text-[#596158] hover:text-[#5C822D] hover:underline font-medium">
                {t.navHome}
              </Link>
              <span className="text-[#D5D2C9]">/</span>
              <span className="font-bold text-[#263026] truncate">
                {language === 'hi' ? 'एचएसई टीम' : language === 'kn' ? 'HSE ತಂಡ' : language === 'gu' ? 'HSE ટીમ' : 'HSE Team'}
              </span>
            </div>

            {/* Desktop Nav Tabs */}
            <div className="flex items-center gap-1.5">
              <Link
                href="/hse"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                  pathname === '/hse'
                    ? 'bg-[#EEF3E7] text-[#35551F] font-bold shadow-2xs border border-[#C6DCC0]'
                    : 'text-[#596158] hover:text-[#263026] hover:bg-[#F7F6F1]'
                }`}
              >
                <Activity size={15} className={pathname === '/hse' ? 'text-[#5C822D]' : 'text-[#7A8178]'} />
                <span>{t.navOverview}</span>
              </Link>

              <Link
                href="/hse/workers"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                  pathname.startsWith('/hse/workers')
                    ? 'bg-[#EEF3E7] text-[#35551F] font-bold shadow-2xs border border-[#C6DCC0]'
                    : 'text-[#596158] hover:text-[#263026] hover:bg-[#F7F6F1]'
                }`}
              >
                <Users size={15} className={pathname.startsWith('/hse/workers') ? 'text-[#5C822D]' : 'text-[#7A8178]'} />
                <span>{t.navWorkers}</span>
              </Link>

              <Link
                href="/hse/alerts"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                  pathname.startsWith('/hse/alerts')
                    ? 'bg-[#EEF3E7] text-[#35551F] font-bold shadow-2xs border border-[#C6DCC0]'
                    : 'text-[#596158] hover:text-[#263026] hover:bg-[#F7F6F1]'
                }`}
              >
                <AlertTriangle size={15} className={pathname.startsWith('/hse/alerts') ? 'text-[#5C822D]' : 'text-[#7A8178]'} />
                <span>{t.navAlerts}</span>
                {alerts.filter(a => a.status === 'OPEN').length > 0 && (
                  <span className="ml-1 bg-[#C53030] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {alerts.filter(a => a.status === 'OPEN').length}
                  </span>
                )}
              </Link>

              <Link
                href="/hse/exposure"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                  pathname.startsWith('/hse/exposure')
                    ? 'bg-[#EEF3E7] text-[#35551F] font-bold shadow-2xs border border-[#C6DCC0]'
                    : 'text-[#596158] hover:text-[#263026] hover:bg-[#F7F6F1]'
                }`}
              >
                <FileText size={15} className={pathname.startsWith('/hse/exposure') ? 'text-[#5C822D]' : 'text-[#7A8178]'} />
                <span>{t.navReports}</span>
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* 3c. Desktop-Only Main Institutional Navigation Bar (Public landing & about) */}
      {!isFieldPersonnel && !isHSE && (
        <div className="hidden sm:block bg-[#F8F4EC] border-t border-[#E8E2D5] text-[13px] font-semibold text-[#596158]">
          <div className="max-w-[1240px] mx-auto px-6 lg:px-8 flex items-center justify-center gap-2.5 sm:gap-4 py-2">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-lg transition-all duration-200 ease-in-out whitespace-nowrap active:scale-95 ${
                    isActive 
                      ? 'bg-[#5C822D] text-white font-bold shadow-xs scale-105' 
                      : 'text-[#596158] hover:text-[#263026] hover:bg-[#EBE4D8] hover:-translate-y-0.5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Indian Tricolor Horizontal Accent Ribbon */}
      <div className="tricolor-ribbon" />

      {/* 5. Floating Fullscreen Feedback Notification Toast */}
      {fullscreenToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#263026] text-white text-[12px] font-semibold px-4 py-2 rounded-full shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Maximize2 size={13} className="text-[#A3E635]" />
          <span>{fullscreenToast}</span>
        </div>
      )}

      {/* 7. iOS Safari "Add to Home Screen" instructions modal */}
      {showIosPrompt && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowIosPrompt(false)}
        >
          <div 
            className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-[#E8E2D5] space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-3">
              <div className="flex items-center gap-2 text-[#35551F] font-bold text-[15px]">
                <Maximize2 size={18} className="text-[#5C822D]" />
                <span>Full Screen App Mode</span>
              </div>
              <button
                onClick={() => setShowIosPrompt(false)}
                className="p-1 text-[#7A8178] hover:text-[#263026] rounded-md transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-[13px] text-[#596158] leading-relaxed">
              To hide all Safari browser bars and run this portal in full screen without screen cut-ins:
            </p>

            <div className="space-y-2.5 bg-[#FAF7F0] p-3 rounded-xl border border-[#E8E2D5] text-[12.5px] text-[#263026]">
              <div className="flex items-start gap-2.5">
                <span className="bg-[#EDF3E4] text-[#35551F] font-bold rounded-full w-5 h-5 flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Tap the Safari <strong>Share button</strong> (<Share2 size={13} className="inline text-[#5C822D]" />) at the bottom.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="bg-[#EDF3E4] text-[#35551F] font-bold rounded-full w-5 h-5 flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Scroll down and tap <strong>&apos;Add to Home Screen&apos;</strong> (<PlusSquare size={13} className="inline text-[#5C822D]" />).
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="bg-[#EDF3E4] text-[#35551F] font-bold rounded-full w-5 h-5 flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Open the app from your home screen for a <strong>100% borderless</strong> experience!
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowIosPrompt(false)}
              className="gov-btn-primary w-full h-10 text-[13px] font-bold rounded-lg"
            >
              Got It
            </button>
          </div>
        </div>
      )}

    </header>
  );
}
