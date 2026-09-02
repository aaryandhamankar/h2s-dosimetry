'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { useAppStore } from '@/stores/app-store';
import { determineActiveShift } from '@/services/shift-service';
import { useMounted } from '@/hooks/use-mounted';
import { sfx } from '@/lib/sound-effects';
import { Clock } from 'lucide-react';

// Lightweight second ticker subscription for live countdown
let globalTickerTs = typeof window !== 'undefined' ? Date.now() : 0;
const tickerListeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  setInterval(() => {
    globalTickerTs = Date.now();
    tickerListeners.forEach(fn => fn());
  }, 1000);
}

function subscribeToTicker(callback: () => void) {
  tickerListeners.add(callback);
  return () => {
    tickerListeners.delete(callback);
  };
}

function getTickerSnapshot() {
  return globalTickerTs;
}

function getServerSnapshot() {
  return 0;
}

export function ShiftTicker() {
  const mounted = useMounted();
  const { shiftConfigs, setShiftTimerModalOpen, language } = useAppStore();
  const currentTs = useSyncExternalStore(subscribeToTicker, getTickerSnapshot, getServerSnapshot);

  const activeShiftData = useMemo(() => {
    const refDate = currentTs ? new Date(currentTs) : new Date();
    return determineActiveShift(shiftConfigs, refDate);
  }, [shiftConfigs, currentTs]);

  if (!mounted) {
    return (
      <div className="w-full bg-[#F5F2EA] border-b border-[#E7E3D8] h-7 flex items-center px-4">
        <div className="h-3 w-36 bg-[#EAE5DA] rounded animate-pulse" />
      </div>
    );
  }

  const { activeShift, nextShift, remainingFormatted, isEndingSoon } = activeShiftData;
  const isShiftA = activeShift.id === 'SHIFT-A';

  const handleOpenEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    sfx.playClick();
    setShiftTimerModalOpen(true);
  };

  return (
    <div className="w-full bg-[#F6F3EB] border-b border-[#E5E0D2] select-none z-30">
      <div className="max-w-[1240px] mx-auto px-3 sm:px-6 h-7 sm:h-7.5 flex items-center justify-between gap-3 text-[11px] sm:text-[11.5px]">
        
        {/* Left: Active Shift Pill & Timing */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-[10.5px] font-bold tracking-tight shadow-2xs ${
            isShiftA
              ? 'bg-[#5C822D] text-white'
              : 'bg-[#C96B32] text-white'
          }`}>
            {activeShift.name}
          </span>

          <span className="font-mono font-bold text-[#263026]">
            {activeShift.startTime} – {activeShift.endTime}
          </span>
        </div>

        {/* Center: Clean Operational Context */}
        <div className="hidden md:flex items-center gap-2 text-[#596158] font-medium text-[11px]">
          <span>End-of-Shift Reading Mode</span>
          <span className="text-[#D0C9BA]">•</span>
          <span>Next: {nextShift.name} ({nextShift.startTime})</span>
        </div>

        {/* Right: Only the Clock Badge is Clickable to Open the Edit Menu */}
        <div className="flex items-center flex-shrink-0">
          <button
            type="button"
            onClick={handleOpenEdit}
            className={`inline-flex items-center gap-1.5 font-mono font-bold px-2 py-0.5 rounded border text-[10.5px] sm:text-[11px] transition-all hover:scale-102 active:scale-95 cursor-pointer select-none ${
              isEndingSoon
                ? 'bg-[#FFF2F0] hover:bg-[#FFE8E6] text-[#B83838] border-[#F2C2C2]'
                : 'bg-white hover:bg-[#FAF8F3] hover:border-[#5C822D] text-[#3D493B] border-[#DED7C8] shadow-3xs'
            }`}
            title={
              language === 'hi'
                ? 'शिफ्ट समय संपादित करने के लिए क्लिक करें'
                : 'Click to edit shift schedule'
            }
            aria-label={`Time remaining: ${remainingFormatted}. Click to edit shift schedule`}
          >
            <Clock size={11.5} className={isEndingSoon ? 'text-[#B83838]' : 'text-[#5C822D]'} />
            <span>{remainingFormatted}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
