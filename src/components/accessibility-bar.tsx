'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
} from 'lucide-react';

export function AccessibilityBar({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [highContrast, setHighContrast] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const changeFontSize = (size: 'sm' | 'md' | 'lg') => {
    setFontSize(size);
    document.documentElement.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg');
    if (size === 'sm') document.documentElement.classList.add('font-scale-sm');
    if (size === 'lg') document.documentElement.classList.add('font-scale-lg');
  };

  const toggleContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    if (next) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  return (
    <div className="bg-[#F0EFE9] text-[#596158] text-[12px] px-4 sm:px-8 py-1 select-none border-b border-[#E7E5DE]">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-3 h-6">
        
        {/* Left: Skip Link + Date & Shift Clock */}
        <div className="flex items-center gap-3 text-[12px]">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:bg-[#5C822D] focus:text-white focus:px-2 focus:py-0.5 focus:rounded text-xs"
          >
            Skip to main content
          </a>

          <div className="flex items-center gap-2 text-[#596158]">
            <span className="flex items-center gap-1.5">
              <CalendarIcon size={12} className="text-[#7A8178]" />
              <span>{currentDate || '28 Aug 2026'}</span>
            </span>
            <span className="text-[#D5D2C9]">|</span>
            <span className="flex items-center gap-1.5 font-mono">
              <Clock size={12} className="text-[#7A8178]" />
              <span>{currentTime || '12:55'}</span>
            </span>
            <span className="text-[#D5D2C9] hidden sm:inline">|</span>
            <span className="hidden sm:inline text-[#35551F] font-semibold text-[11px]">
              Shift A (06:00 – 14:00 IST)
            </span>
          </div>
        </div>

        {/* Right: Accessibility Controls */}
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-[#7A8178] hidden md:inline">Font Size:</span>
          
          <div className="flex items-center border border-[#D5D2C9] rounded bg-white overflow-hidden">
            <button
              onClick={() => changeFontSize('sm')}
              className={`px-1.5 py-0.2 hover:bg-[#F0EFE9] transition-colors ${
                fontSize === 'sm' ? 'bg-[#5C822D] text-white font-bold' : 'text-[#263026]'
              }`}
              title="Decrease Font Size (A-)"
            >
              A-
            </button>
            <button
              onClick={() => changeFontSize('md')}
              className={`px-1.5 py-0.2 hover:bg-[#F0EFE9] transition-colors border-x border-[#D5D2C9] ${
                fontSize === 'md' ? 'bg-[#5C822D] text-white font-bold' : 'text-[#263026]'
              }`}
              title="Standard Font Size (A)"
            >
              A
            </button>
            <button
              onClick={() => changeFontSize('lg')}
              className={`px-1.5 py-0.2 hover:bg-[#F0EFE9] transition-colors ${
                fontSize === 'lg' ? 'bg-[#5C822D] text-white font-bold' : 'text-[#263026]'
              }`}
              title="Increase Font Size (A+)"
            >
              A+
            </button>
          </div>

          <button
            onClick={toggleContrast}
            className={`px-2 py-0.5 rounded border transition-colors hidden sm:inline-flex items-center gap-1 ${
              highContrast 
                ? 'bg-[#263026] text-white border-[#263026]' 
                : 'bg-white text-[#263026] border-[#D5D2C9] hover:bg-[#F0EFE9]'
            }`}
            title="Toggle High Contrast Mode"
          >
            <span>Contrast</span>
          </button>
        </div>

      </div>
    </div>
  );
}
