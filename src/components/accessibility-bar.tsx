'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import { TRANSLATIONS } from '@/lib/i18n';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Sun,
} from 'lucide-react';
import { useMounted } from '@/hooks/use-mounted';
import { FullscreenToggle } from '@/components/fullscreen-toggle';

export function AccessibilityBar() {
  const { 
    language, 
    setLanguage, 
    fontSize, 
    setFontSize, 
    highContrast, 
    toggleHighContrast 
  } = useAppStore();

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

  const handleFontSizeChange = (size: 'sm' | 'md' | 'lg') => {
    setFontSize(size);
  };

  return (
    <div className="bg-[#F0EFE9] text-[#596158] text-[11px] sm:text-[12px] px-3 sm:px-8 py-1 select-none border-b border-[#E7E5DE]">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-2 min-h-6 flex-wrap">
        
        {/* Left: Skip Link + Date & Shift Clock */}
        <div className="flex items-center gap-2 text-[11px] sm:text-[12px]">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:bg-[#5C822D] focus:text-white focus:px-2 focus:py-0.5 focus:rounded text-xs"
          >
            {t.skipToContent}
          </a>

          <div className="flex items-center gap-1.5 sm:gap-2 text-[#596158]">
            <span className="hidden sm:flex items-center gap-1">
              <CalendarIcon size={11} className="text-[#7A8178]" />
              <span>{currentDate || '28 Aug 2026'}</span>
            </span>
            <span className="text-[#D5D2C9] hidden sm:inline">|</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock size={11} className="text-[#7A8178]" />
              <span>{currentTime || '12:55'}</span>
            </span>
            <span className="text-[#D5D2C9] hidden md:inline">|</span>
            <span className="hidden md:inline text-[#35551F] font-semibold text-[11px]">
              {t.shiftA}
            </span>
          </div>
        </div>

        {/* Right: Accessibility Controls + Language Switcher */}
        <div className="flex items-center gap-2 text-[11px] ml-auto">
          
          {/* Font Size A- / A / A+ */}
          <div className="flex items-center border border-[#D5D2C9] rounded bg-white overflow-hidden shadow-2xs">
            <button
              onClick={() => handleFontSizeChange('sm')}
              className={`px-2 py-0.5 min-w-[24px] text-center hover:bg-[#F0EFE9] transition-colors ${
                fontSize === 'sm' ? 'bg-[#5C822D] text-white font-bold' : 'text-[#263026]'
              }`}
              title="A- Smaller Text"
              aria-label="Decrease Font Size"
            >
              A-
            </button>
            <button
              onClick={() => handleFontSizeChange('md')}
              className={`px-2 py-0.5 min-w-[24px] text-center hover:bg-[#F0EFE9] transition-colors border-x border-[#D5D2C9] ${
                fontSize === 'md' ? 'bg-[#5C822D] text-white font-bold' : 'text-[#263026]'
              }`}
              title="A Standard Text"
              aria-label="Default Font Size"
            >
              A
            </button>
            <button
              onClick={() => handleFontSizeChange('lg')}
              className={`px-2 py-0.5 min-w-[24px] text-center hover:bg-[#F0EFE9] transition-colors ${
                fontSize === 'lg' ? 'bg-[#5C822D] text-white font-bold' : 'text-[#263026]'
              }`}
              title="A+ Larger Text"
              aria-label="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle (Visible on both Mobile and Desktop) */}
          <button
            onClick={toggleHighContrast}
            className={`px-2 py-0.5 rounded border transition-colors flex items-center gap-1 shadow-2xs font-semibold ${
              highContrast 
                ? 'bg-[#000000] text-[#FFFF00] border-[#FFFF00]' 
                : 'bg-white text-[#263026] border-[#D5D2C9] hover:bg-[#F0EFE9]'
            }`}
            title="Toggle High Contrast Mode"
            aria-pressed={highContrast}
          >
            <Sun size={11} />
            <span className="text-[10px] sm:text-[11px]">{t.contrast}</span>
          </button>

          {/* Full Screen Mode Toggle */}
          <FullscreenToggle />

          {/* Language Switcher (EN / हिंदी) */}
          <div className="flex items-center border border-[#D5D2C9] rounded bg-white overflow-hidden shadow-2xs text-[10px] sm:text-[11px]">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 transition-colors font-semibold ${
                language === 'en' 
                  ? 'bg-[#5C822D] text-white font-bold' 
                  : 'text-[#263026] hover:bg-[#F0EFE9]'
              }`}
              title="English"
              aria-label="Switch to English"
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-0.5 transition-colors font-semibold border-l border-[#D5D2C9] ${
                language === 'hi' 
                  ? 'bg-[#5C822D] text-white font-bold' 
                  : 'text-[#263026] hover:bg-[#F0EFE9]'
              }`}
              title="हिंदी (Hindi)"
              aria-label="हिंदी भाषा चुनें"
            >
              हिंदी
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
