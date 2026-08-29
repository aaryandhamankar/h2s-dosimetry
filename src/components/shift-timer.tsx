'use client';

import { useState, useMemo, useSyncExternalStore } from 'react';
import { useAppStore } from '@/stores/app-store';
import { ShiftStatus } from '@/types';
import { sfx } from '@/lib/sound-effects';
import { useMounted } from '@/hooks/use-mounted';
import { 
  Timer, 
  Play, 
  Pause, 
  Square, 
  Edit3, 
  Check, 
  X
} from 'lucide-react';

// Stable global second ticker to guarantee zero infinite render loops
let globalTickerTimestamp = typeof window !== 'undefined' ? Date.now() : 0;
const tickerSubscribers = new Set<() => void>();

if (typeof window !== 'undefined') {
  setInterval(() => {
    globalTickerTimestamp = Date.now();
    tickerSubscribers.forEach(cb => cb());
  }, 1000);
}

function subscribeToTicker(callback: () => void) {
  tickerSubscribers.add(callback);
  return () => {
    tickerSubscribers.delete(callback);
  };
}

function getNowSnapshot() {
  return globalTickerTimestamp;
}

function getServerSnapshot() {
  return 0;
}

export function ShiftTimer() {
  const mounted = useMounted();
  const { 
    activeShift, 
    currentUser, 
    startShift, 
    endShift, 
    pauseShift, 
    resumeShift, 
    updateShiftStartTime, 
    shiftTimerModalOpen,
    setShiftTimerModalOpen,
    language 
  } = useAppStore();

  const currentTime = useSyncExternalStore(subscribeToTicker, getNowSnapshot, getServerSnapshot);
  const [customTimeInput, setCustomTimeInput] = useState('');
  const [editMode, setEditMode] = useState(false);

  // Compute elapsed time, formatted string, and 8h progress
  const { elapsedSeconds, elapsedFormatted, progressPercent, remainingFormatted, isOvertime } = useMemo(() => {
    if (!activeShift || !activeShift.startTime || currentTime === 0) {
      return { 
        elapsedSeconds: 0, 
        elapsedFormatted: '00:00:00', 
        progressPercent: 0, 
        remainingFormatted: '08:00:00',
        isOvertime: false 
      };
    }

    const start = new Date(activeShift.startTime).getTime();
    const diff = Math.max(0, currentTime - start);
    const secs = Math.floor(diff / 1000);

    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatted = `${pad(hrs)}:${pad(mins)}:${pad(s)}`;

    const targetSecs = 8 * 3600; // 8-hour shift standard
    const progress = Math.min(100, Math.round((secs / targetSecs) * 100));

    const remainingSecs = Math.max(0, targetSecs - secs);
    const remHrs = Math.floor(remainingSecs / 3600);
    const remMins = Math.floor((remainingSecs % 3600) / 60);
    const remS = remainingSecs % 60;
    const remFormatted = `${pad(remHrs)}:${pad(remMins)}:${pad(remS)}`;

    return {
      elapsedSeconds: secs,
      elapsedFormatted: formatted,
      progressPercent: progress,
      remainingFormatted: remFormatted,
      isOvertime: secs > targetSecs
    };
  }, [activeShift, currentTime]);

  const compactTime = useMemo(() => {
    if (!activeShift) return '00:00';
    const hrs = Math.floor(elapsedSeconds / 3600);
    const mins = Math.floor((elapsedSeconds % 3600) / 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }, [activeShift, elapsedSeconds]);

  const isRunning = activeShift?.status === ShiftStatus.ACTIVE;
  const isPaused = activeShift?.status === ShiftStatus.PAUSED;

  const handleToggleTimer = () => {
    sfx.playClick();
    if (!activeShift) {
      startShift(currentUser?.id);
    } else if (isRunning) {
      pauseShift();
    } else if (isPaused) {
      resumeShift();
    }
  };

  const handleCustomTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sfx.playClick();
    if (!customTimeInput) return;

    const [hours, minutes] = customTimeInput.split(':').map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      const now = new Date();
      now.setHours(hours, minutes, 0, 0);
      
      let targetTime = now.getTime();
      if (targetTime > Date.now()) {
        targetTime -= 24 * 60 * 60 * 1000;
      }
      
      const newIso = new Date(targetTime).toISOString();
      if (!activeShift) {
        startShift(currentUser?.id, newIso);
      } else {
        updateShiftStartTime(newIso);
      }
    }
    setEditMode(false);
  };

  const formattedStartTime = useMemo(() => {
    if (!activeShift?.startTime) return '—';
    try {
      const date = new Date(activeShift.startTime);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '—';
    }
  }, [activeShift]);

  if (!mounted) return null;

  return (
    <>
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. FLUSH LEFT EDGE SHIFT TIMER TAB (WHITE BG & ORANGE/GREEN BORDER)*/}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="fixed left-0 bottom-32 sm:bottom-24 z-40 select-none">
        <button
          type="button"
          onClick={() => {
            sfx.playClick();
            setShiftTimerModalOpen(true);
          }}
          className="group relative flex items-center justify-center p-[2px] pl-0 rounded-r-xl shadow-md hover:shadow-lg transition-all duration-200 hover:translate-x-0.5 active:scale-95 cursor-pointer overflow-hidden bg-gradient-to-b from-[#FF9933] to-[#138808]"
          title={language === 'hi' ? `शिफ्ट समय: ${compactTime}` : `Shift Elapsed: ${compactTime}`}
          aria-label="Shift Timer"
        >
          {/* White Background Inner Content Container */}
          <div className="bg-white rounded-r-[10px] rounded-l-none py-2 px-1.5 flex flex-col items-center gap-1.5 text-[#263026] min-w-[28px] sm:min-w-[32px]">
            {/* Live pulsing dot */}
            <div className="relative flex items-center justify-center">
              <span className="relative flex h-2 w-2">
                {isRunning && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9933] opacity-75" />
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  isRunning ? 'bg-[#FF9933]' : isPaused ? 'bg-[#FFC107]' : 'bg-[#9E9E9E]'
                }`} />
              </span>
            </div>

            {/* Vertical Time in Dark High-Contrast Typography */}
            <span 
              className="font-mono font-black text-[11px] sm:text-[12px] tracking-wider text-[#263026] select-none leading-none"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              {compactTime}
            </span>
          </div>
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. BASIC CONTROLS SHIFT TIMER MODAL                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      {shiftTimerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-[#E7E5DE] overflow-hidden space-y-4 p-5 text-[14px]"
            role="dialog"
            aria-labelledby="shift-timer-modal-title"
          >
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E7E5DE] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#EEF3E7] text-[#5C822D]">
                  <Timer size={18} />
                </div>
                <h3 id="shift-timer-modal-title" className="font-bold text-[16px] text-[#263026]">
                  {language === 'hi' ? 'शिफ्ट टाइमर' : 'Shift Exposure Timer'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  sfx.playClick();
                  setShiftTimerModalOpen(false);
                }}
                className="text-[#7A8178] hover:text-[#263026] p-1 rounded-md hover:bg-[#F0EFE9]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Digital Clock Display */}
            <div className="bg-[#FAFBF9] border border-[#E7E5DE] rounded-xl p-4 text-center space-y-2">
              <span className="text-[11px] font-bold text-[#7A8178] uppercase tracking-wider block">
                {language === 'hi' ? 'बीता हुआ समय' : 'Elapsed Time'}
              </span>
              <div className="font-mono text-[38px] font-black text-[#263026] leading-none tracking-tight">
                {elapsedFormatted}
              </div>

              {/* Progress bar */}
              <div className="space-y-1 pt-1">
                <div className="w-full bg-[#E7E5DE] h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${isOvertime ? 'bg-[#C96B32]' : 'bg-[#5C822D]'}`}
                    style={{ width: `${Math.min(100, progressPercent)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#7A8178]">
                  <span>{language === 'hi' ? 'शुरुआत:' : 'Start:'} {formattedStartTime}</span>
                  <span>{language === 'hi' ? 'शेष:' : 'Remaining:'} {remainingFormatted}</span>
                </div>
              </div>
            </div>

            {/* Basic Controls: Start / Pause / Resume / End */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleToggleTimer}
                className={`h-10 px-3 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 ${
                  isRunning
                    ? 'bg-[#F7F6F1] hover:bg-[#EFECE3] text-[#C96B32] border border-[#E8C4B8]'
                    : 'gov-btn-primary'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause size={15} />
                    <span>{language === 'hi' ? 'रोकें' : 'Pause'}</span>
                  </>
                ) : (
                  <>
                    <Play size={15} />
                    <span>{activeShift ? (language === 'hi' ? 'जारी रखें' : 'Resume') : (language === 'hi' ? 'शुरू करें' : 'Start')}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  if (activeShift) {
                    endShift();
                  } else {
                    startShift(currentUser?.id);
                  }
                }}
                className={`h-10 px-3 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 border shadow-xs transition-all active:scale-95 ${
                  activeShift
                    ? 'bg-white hover:bg-[#FFF9F9] text-[#B83838] border-[#F2C2C2]'
                    : 'gov-btn-secondary'
                }`}
              >
                <Square size={14} />
                <span>{activeShift ? (language === 'hi' ? 'समाप्त करें' : 'End Shift') : (language === 'hi' ? 'रीसेट' : 'Reset')}</span>
              </button>
            </div>

            {/* Edit Start Time (Mid-Shift adjustment) */}
            <div className="pt-2 border-t border-[#E7E5DE]">
              {!editMode ? (
                <button
                  type="button"
                  onClick={() => {
                    sfx.playClick();
                    setEditMode(true);
                  }}
                  className="w-full py-2 text-[12px] font-semibold text-[#5C822D] hover:bg-[#EEF3E7] rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit3 size={14} />
                  <span>{language === 'hi' ? 'शुरुआती समय संपादित करें (मिड-शिफ्ट)' : 'Edit Start Time (Mid-Shift)'}</span>
                </button>
              ) : (
                <form onSubmit={handleCustomTimeSubmit} className="space-y-2">
                  <label className="text-[11px] font-bold text-[#263026] block">
                    {language === 'hi' ? 'बैज प्रारंभ का समय (HH:MM):' : 'Badge Start Time Today (HH:MM):'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={customTimeInput}
                      onChange={(e) => setCustomTimeInput(e.target.value)}
                      className="flex-1 p-2 border border-[#D5D2C9] rounded-lg text-[13px] font-mono bg-white text-[#263026] focus:outline-2 focus:outline-[#5C822D]"
                      required
                    />
                    <button
                      type="submit"
                      className="gov-btn-primary h-9 px-3 text-[12px] font-semibold flex items-center gap-1"
                    >
                      <Check size={14} />
                      <span>{language === 'hi' ? 'लागू करें' : 'Apply'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="gov-btn-secondary h-9 px-2.5 text-[12px]"
                    >
                      {language === 'hi' ? 'रद्द' : 'Cancel'}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
