'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { UniversalSearch } from './universal-search';
import Image from 'next/image';
import mrplLogo from '../../public/mrpl-logo.png';

import { useMounted } from '@/hooks/use-mounted';

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

          {/* Right Controls: Accessibility Toggle & Search */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            
            {/* Accessibility Drawer Toggle Button */}
            <button
              onClick={() => setAccessibilityBarOpen(!accessibilityBarOpen)}
              className={`flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-[12px] sm:text-[13px] font-semibold transition-all border ${
                accessibilityBarOpen
                  ? 'bg-[#5C822D] text-white border-[#476722] shadow-2xs'
                  : 'bg-[#F4EFE6] hover:bg-[#EBE4D8] text-[#263026] border-[#E8E2D5]'
              }`}
              title="Accessibility & Language Options"
              aria-expanded={accessibilityBarOpen}
            >
              <Accessibility size={16} className={accessibilityBarOpen ? 'text-white' : 'text-[#5C822D]'} />
              <span className="hidden lg:inline">{language === 'hi' ? 'सुगमता' : 'Accessibility'}</span>
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
              
              {/* Font Sizing */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-[#7A8178] font-bold hidden xs:inline">{language === 'hi' ? 'आकार:' : 'Size:'}</span>
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

    </header>
  );
}
