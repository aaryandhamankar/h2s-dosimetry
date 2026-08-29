'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/stores/app-store';
import { TRANSLATIONS } from '@/lib/i18n';
import { 
  Search, 
  Accessibility,
  Sun,
  Calendar as CalendarIcon,
  Clock,
  X,
  Maximize2,
  Share2,
  PlusSquare,
} from 'lucide-react';
import { UniversalSearch } from './universal-search';
import Image from 'next/image';
import mrplLogo from '../../public/mrpl-logo.png';

import { useMounted } from '@/hooks/use-mounted';
import { sfx } from '@/lib/sound-effects';

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

export function PortalHeaderWrapper() {
  const pathname = usePathname();
  const { 
    language, 
    setLanguage, 
    fontSize, 
    setFontSize, 
    highContrast, 
    toggleHighContrast 
  } = useAppStore();

  const [searchOpen, setSearchOpen] = useState(false);
  const [accessibilityBarOpen, setAccessibilityBarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showIosPrompt, setShowIosPrompt] = useState(false);
  const [fullscreenToast, setFullscreenToast] = useState<string | null>(null);

  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const mounted = useMounted();

  const t = TRANSLATIONS[language];

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

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
      const active = Boolean(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(active);
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
    if (typeof window === 'undefined') return;

    const doc = document as FullscreenDoc;
    const docEl = document.documentElement as FullscreenEl;

    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone;

    if (isIos && !isStandalone && !docEl.requestFullscreen && !docEl.webkitRequestFullscreen) {
      setShowIosPrompt(true);
      return;
    }

    try {
      sfx.playClick();
      if (
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      ) {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
        setFullscreenToast(language === 'hi' ? 'फुल स्क्रीन मोड से बाहर निकले' : 'Exited Full Screen');
      } else {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
          await docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) {
          await docEl.msRequestFullscreen();
        } else if (isIos) {
          setShowIosPrompt(true);
          return;
        }
        setFullscreenToast(language === 'hi' ? 'फुल स्क्रीन मोड सक्रिय' : 'Full Screen Mode Enabled');
      }
      setTimeout(() => setFullscreenToast(null), 2200);
    } catch (err) {
      console.warn('Fullscreen toggle failed:', err);
      if (isIos) {
        setShowIosPrompt(true);
      }
    }
  };

  const handlePressStart = () => {
    isLongPressRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
      toggleFullscreen();
    }, 500);
  };

  const handlePressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  const handleAccessibilityClick = () => {
    if (isLongPressRef.current) {
      isLongPressRef.current = false;
      return;
    }
    sfx.playClick();
    setAccessibilityBarOpen(!accessibilityBarOpen);
  };

  const navLinks = [
    { href: '/', label: language === 'hi' ? 'होम' : 'Home' },
    { href: '/scan', label: language === 'hi' ? 'स्कैन' : 'Scan' },
    { href: '/dashboard', label: language === 'hi' ? 'डैशबोर्ड' : 'Dashboard' },
    { href: '/about', label: language === 'hi' ? 'विवरण' : 'About' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E7E5DE] shadow-2xs">
      
      {/* 1. Institutional Master Header Bar */}
      <div className="max-w-[1240px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[60px] sm:min-h-[68px] py-1.5 gap-2 sm:gap-4">
          
          {/* Left Brand: Official ONGC MRPL Logo & Institutional Identity */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3.5 group min-w-0 pr-1 flex-shrink-0">
            <div className="h-9 sm:h-11 w-9 sm:w-11 flex-shrink-0 flex items-center justify-center p-1 bg-white rounded-lg border border-[#E7E5DE] shadow-xs group-hover:border-[#5C822D] group-hover:shadow-sm transition-all overflow-hidden">
              <Image 
                src={mrplLogo} 
                alt="MRPL ONGC Logo" 
                className="h-7 sm:h-9 w-auto object-contain rounded-md block"
                priority
              />
            </div>

            <div className="flex flex-col justify-center min-w-0">
              <span className="font-bold text-[13px] sm:text-[16px] text-[#263026] leading-tight tracking-tight truncate">
                <span className="hidden sm:inline">
                  {language === 'hi' ? 'मंगलूर रिफाइनरी एंड पेट्रोकेमिकल्स लिमिटेड' : 'Mangalore Refinery and Petrochemicals Limited'}
                </span>
                <span className="sm:hidden">
                  {language === 'hi' ? 'एमआरपीएल डोसीमेट्री' : 'MRPL Dosimetry'}
                </span>
              </span>
              <span className="text-[10px] sm:text-[12px] text-[#596158] leading-tight truncate">
                <span className="hidden md:inline">
                  {language === 'hi' ? 'ओएनजीसी लिमिटेड की एक सहायक कंपनी · ' : 'A Subsidiary of ONGC Limited · '}
                </span>
                <span>{language === 'hi' ? 'गैस डोसीमेट्री पोर्टल' : 'Gas Dosimetry Portal'}</span>
              </span>
            </div>
          </Link>

          {/* Right Controls: Accessibility Toggle (with Long-Press Full Screen / ESC) & Search */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            
            {/* Accessibility Button with Long-Press Fullscreen Mode */}
            <button
              onClick={handleAccessibilityClick}
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
              onTouchCancel={handlePressEnd}
              className={`relative flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-[12px] sm:text-[13px] font-semibold transition-all border select-none active:scale-95 cursor-pointer ${
                accessibilityBarOpen
                  ? 'bg-[#5C822D] text-white border-[#476722] shadow-2xs'
                  : isFullscreen
                  ? 'bg-[#EDF3E4] text-[#35551F] border-[#5C822D]'
                  : 'bg-[#F4EFE6] hover:bg-[#EBE4D8] text-[#263026] border-[#E8E2D5]'
              }`}
              title={
                language === 'hi' 
                  ? 'सुगमता विकल्प (फुल स्क्रीन या बाहर निकलने के लिए दबाकर रखें)' 
                  : 'Accessibility Options (Press & hold for Full Screen / ESC)'
              }
              aria-expanded={accessibilityBarOpen}
            >
              <Accessibility size={16} className={accessibilityBarOpen ? 'text-white' : 'text-[#5C822D]'} />
              <span className="hidden lg:inline">{language === 'hi' ? 'सुगमता' : 'Accessibility'}</span>
              {isFullscreen && (
                <span 
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#5C822D] border-2 border-white rounded-full shadow-xs" 
                  title="Full Screen Active" 
                />
              )}
            </button>

            {/* Quick Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 bg-[#F4EFE6] hover:bg-[#EBE4D8] text-[#263026] font-semibold p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-[12px] sm:text-[13px] transition-colors border border-[#E8E2D5]"
              title="Search Portal (Shortcut: /)"
              aria-label="Search Portal"
            >
              <Search size={15} className="text-[#5C822D]" />
              <span className="hidden md:inline">{language === 'hi' ? 'खोजें' : 'Search'}</span>
              <kbd className="bg-white px-1 py-0.2 rounded border border-[#E8E2D5] text-[10px] font-mono text-[#7A8178] hidden lg:inline">/</kbd>
            </button>

          </div>
        </div>
      </div>

      {/* 2. Desktop-Only Main Institutional Navigation Bar */}
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

      {/* 3. Animated Accessibility & Localization Options Strip */}
      {accessibilityBarOpen && (
        <div className="bg-[#F8F4EC] border-t border-b border-[#5C822D]/40 px-3 sm:px-8 py-2 text-[12px] text-[#596158] shadow-inner animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-3 flex-wrap">
            
            {/* Left: Shift & Date Info */}
            <div className="flex items-center gap-2.5 text-[11px] sm:text-[12px]">
              <span className="flex items-center gap-1">
                <CalendarIcon size={12} className="text-[#5C822D]" />
                <span>{currentDate || '29 Aug 2026'}</span>
              </span>
              <span className="text-[#D8D0C0]">|</span>
              <span className="flex items-center gap-1 font-mono">
                <Clock size={12} className="text-[#5C822D]" />
                <span>{currentTime || '16:35'}</span>
              </span>
              <span className="text-[#D8D0C0] hidden sm:inline">|</span>
              <span className="hidden sm:inline text-[#35551F] font-semibold">
                {t.shiftA} · Zone A
              </span>
            </div>

            {/* Right: Controls (Font Scale, Contrast, Language, and Close) */}
            <div className="flex items-center gap-2.5 ml-auto flex-wrap">
              
              {/* Font Sizing (Desktop Only) */}
              <div className="hidden sm:flex items-center gap-1">
                <span className="text-[11px] text-[#7A8178] font-bold">{language === 'hi' ? 'आकार:' : 'Size:'}</span>
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

              {/* Language Switcher */}
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

      {/* 4. Indian Tricolor Horizontal Accent Ribbon */}
      <div className="tricolor-ribbon" />

      {/* 5. Universal Search Dialog */}
      <UniversalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* 6. Floating Fullscreen Feedback Notification Toast */}
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
