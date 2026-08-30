'use client';

import { useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();
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
  const [startTimeInput, setStartTimeInput] = useState('');
  const [endTimeInput, setEndTimeInput] = useState('');
  const [editMode, setEditMode] = useState(false);

  // Escape key listener for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && shiftTimerModalOpen) {
        setShiftTimerModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shiftTimerModalOpen, setShiftTimerModalOpen]);

  // Compute elapsed time, formatted string, and 8h progress
  const { 
    elapsedFormatted, 
    progressPercent, 
    remainingFormatted, 
    overtimeFormatted,
    isOvertime 
  } = useMemo(() => {
    if (!activeShift || !activeShift.startTime || currentTime === 0) {
      return { 
        elapsedSeconds: 0, 
        elapsedFormatted: '00:00:00', 
        progressPercent: 0, 
        remainingFormatted: '08:00:00',
        overtimeFormatted: '+00:00:00',
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

    const isOver = secs > targetSecs;

    // Remaining time (down to 00:00:00)
    const remainingSecs = Math.max(0, targetSecs - secs);
    const remHrs = Math.floor(remainingSecs / 3600);
    const remMins = Math.floor((remainingSecs % 3600) / 60);
    const remS = remainingSecs % 60;
    const remFormatted = `${pad(remHrs)}:${pad(remMins)}:${pad(remS)}`;

    // Overtime count up (+00:00:01, +00:00:02, ...)
    const overSecs = Math.max(0, secs - targetSecs);
    const overHrs = Math.floor(overSecs / 3600);
    const overMins = Math.floor((overSecs % 3600) / 60);
    const overS = overSecs % 60;
    const overFormatted = `+${pad(overHrs)}:${pad(overMins)}:${pad(overS)}`;

    return {
      elapsedSeconds: secs,
      elapsedFormatted: formatted,
      progressPercent: progress,
      remainingFormatted: remFormatted,
      overtimeFormatted: overFormatted,
      isOvertime: isOver
    };
  }, [activeShift, currentTime]);

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

  // Open Edit Mode and pre-populate inputs with current shift times
  const handleOpenEdit = () => {
    sfx.playClick();
    const now = new Date();
    
    if (activeShift?.startTime) {
      const startDate = new Date(activeShift.startTime);
      const startH = startDate.getHours().toString().padStart(2, '0');
      const startM = startDate.getMinutes().toString().padStart(2, '0');
      setStartTimeInput(`${startH}:${startM}`);

      const endDate = new Date(startDate.getTime() + 8 * 60 * 60 * 1000);
      const endH = endDate.getHours().toString().padStart(2, '0');
      const endM = endDate.getMinutes().toString().padStart(2, '0');
      setEndTimeInput(`${endH}:${endM}`);
    } else {
      const startH = now.getHours().toString().padStart(2, '0');
      const startM = now.getMinutes().toString().padStart(2, '0');
      setStartTimeInput(`${startH}:${startM}`);

      const endH = ((now.getHours() + 8) % 24).toString().padStart(2, '0');
      setEndTimeInput(`${endH}:${startM}`);
    }
    setEditMode(true);
  };

  // When user changes Start Time, automatically update End Time (+8 hours)
  const handleStartTimeChange = (val: string) => {
    setStartTimeInput(val);
    if (!val) return;
    const [h, m] = val.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      const endH = ((h + 8) % 24).toString().padStart(2, '0');
      const endM = m.toString().padStart(2, '0');
      setEndTimeInput(`${endH}:${endM}`);
    }
  };

  // When user changes End Time, automatically update Start Time (-8 hours)
  const handleEndTimeChange = (val: string) => {
    setEndTimeInput(val);
    if (!val) return;
    const [h, m] = val.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      const startH = ((h - 8 + 24) % 24).toString().padStart(2, '0');
      const startM = m.toString().padStart(2, '0');
      setStartTimeInput(`${startH}:${startM}`);
    }
  };

  // Live preview of elapsed time from Start Time to Now
  const previewElapsed = useMemo(() => {
    if (!startTimeInput) return null;
    const [h, m] = startTimeInput.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return null;

    const now = new Date();
    const target = new Date();
    target.setHours(h, m, 0, 0);

    let diff = now.getTime() - target.getTime();
    if (diff < 0) {
      diff += 24 * 60 * 60 * 1000; // Started earlier
    }

    const totalMinutes = Math.floor(diff / (60 * 1000));
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    return `${hrs}h ${mins}m`;
  }, [startTimeInput]);

  const handleCustomTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sfx.playClick();
    if (!startTimeInput) return;

    const [hours, minutes] = startTimeInput.split(':').map(Number);
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
        if (isPaused) {
          resumeShift();
        }
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

  // On mobile, hide floating pill while on /scan to prevent blocking camera controls
  const isScanPage = pathname === '/scan';

  return (
    <>
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. CLEAN FLOATING SHIFT TIMER CAPSULE                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className={`fixed left-3 sm:left-6 bottom-20 sm:bottom-6 z-40 select-none ${
        isScanPage ? 'hidden sm:block' : 'block'
      }`}>
        <button
          type="button"
          onClick={() => {
            sfx.playClick();
            setShiftTimerModalOpen(true);
          }}
          className={`group relative flex items-center gap-1.5 bg-[#FAF8F3]/95 backdrop-blur-md hover:bg-white text-[#263026] border shadow-xs hover:shadow-md rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer text-[12px] sm:text-[13px] font-semibold ${
            isOvertime 
              ? 'border-[#C96B32]/80 text-[#9C4124]' 
              : isRunning
              ? 'border-[#86B84A] text-[#263026]'
              : 'border-[#D8D2C2] hover:border-[#5C822D]'
          }`}
          title={
            language === 'hi' 
              ? (isOvertime ? `अतिरिक्त समय: ${overtimeFormatted}` : `शेष समय: ${remainingFormatted}`) 
              : language === 'kn'
              ? (isOvertime ? `ಹೆಚ್ಚುವರಿ ಸಮಯ: ${overtimeFormatted}` : `ಉಳಿದ ಸಮಯ: ${remainingFormatted}`)
              : language === 'gu'
              ? (isOvertime ? `વધારાનો સમય: ${overtimeFormatted}` : `બાકી સમય: ${remainingFormatted}`)
              : (isOvertime ? `Overtime: ${overtimeFormatted}` : `Time Left: ${remainingFormatted}`)
          }
          aria-label="Shift Timer"
        >
          <Timer 
            size={14} 
            className={`transition-all duration-300 ${
              isOvertime 
                ? 'text-[#C96B32] animate-pulse' 
                : isRunning 
                ? 'text-[#5C822D] animate-pulse' 
                : 'text-[#7A8178]'
            }`} 
          />
          
          <span className="font-mono font-bold tracking-tight">
            {isOvertime ? overtimeFormatted : remainingFormatted}
          </span>
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. BASIC CONTROLS SHIFT TIMER MODAL                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      {shiftTimerModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setShiftTimerModalOpen(false)}
        >
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="shift-timer-modal-title"
            className="bg-white rounded-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E7E5DE] space-y-3.5 sm:space-y-4 p-4 sm:p-5 text-[14px] my-auto"
            onClick={e => e.stopPropagation()}
          >
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E7E5DE] pb-2.5 sm:pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#EEF3E7] text-[#5C822D]">
                  <Timer size={18} />
                </div>
                <h3 id="shift-timer-modal-title" className="font-bold text-[15px] sm:text-[16px] text-[#263026]">
                  {language === 'hi' 
                    ? 'शिफ्ट एक्सपोज़र टाइमर' 
                    : language === 'kn'
                    ? 'ಶಿಫ್ಟ್ ಎಕ್ಸ್‌ಪೋಶರ್ ಟೈಮರ್'
                    : language === 'gu'
                    ? 'શિફ્ટ એક્સપોઝર ટાઈમર'
                    : 'Shift Exposure Timer'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  sfx.playClick();
                  setShiftTimerModalOpen(false);
                }}
                className="text-[#7A8178] hover:text-[#263026] p-1.5 rounded-md hover:bg-[#F0EFE9] min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Digital Clock Display - Primary Focus: Time Left or Overtime */}
            <div className="bg-[#FAFBF9] border border-[#E7E5DE] rounded-xl p-3.5 sm:p-4 text-center space-y-2">
              <span className="text-[10.5px] sm:text-[11px] font-bold text-[#7A8178] uppercase tracking-wider block">
                {isOvertime 
                  ? (language === 'hi' ? 'अतिरिक्त समय (+)' : language === 'kn' ? 'ಹೆಚ್ಚುವರಿ ಸಮಯ (+)' : language === 'gu' ? 'વધારાનો સમય (+)' : 'Overtime (+)')
                  : (language === 'hi' ? 'शिफ्ट में शेष समय (8h)' : language === 'kn' ? 'ಶಿಫ್ಟ್‌ನಲ್ಲಿ ಉಳಿದ ಸಮಯ (8h)' : language === 'gu' ? 'શિફ્ટમાં બાકી સમય (8h)' : 'Time Remaining (8h Target)')}
              </span>
              <div className={`font-mono text-[34px] sm:text-[38px] font-black leading-none tracking-tight ${
                isOvertime ? 'text-[#C96B32]' : 'text-[#263026]'
              }`}>
                {isOvertime ? overtimeFormatted : remainingFormatted}
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-1">
                <div className="w-full bg-[#E7E5DE] h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${isOvertime ? 'bg-[#C96B32]' : 'bg-[#5C822D]'}`}
                    style={{ width: `${Math.min(100, progressPercent)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#7A8178]">
                  <span>
                    {language === 'hi' ? 'कुल समय:' : language === 'kn' ? 'ಕಳೆದ ಸಮಯ:' : language === 'gu' ? 'વીતેલો સમય:' : 'Elapsed:'} <strong className="text-[#263026]">{elapsedFormatted}</strong>
                  </span>
                  <span>
                    {language === 'hi' ? 'शुरुआत:' : language === 'kn' ? 'ಆರಂಭ:' : language === 'gu' ? 'શરૂઆત:' : 'Start:'} <strong className="text-[#263026]">{formattedStartTime}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Basic Controls: Start / Pause / Resume / End */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleToggleTimer}
                className={`h-10 px-3 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer ${
                  isRunning
                    ? 'bg-[#F7F6F1] hover:bg-[#EFECE3] text-[#C96B32] border border-[#E8C4B8]'
                    : 'gov-btn-primary'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause size={15} />
                    <span>
                      {language === 'hi' ? 'रोकें' : language === 'kn' ? 'ವಿರಾಮ' : language === 'gu' ? 'થોભાવો' : 'Pause'}
                    </span>
                  </>
                ) : (
                  <>
                    <Play size={15} />
                    <span>
                      {activeShift 
                        ? (language === 'hi' ? 'जारी रखें' : language === 'kn' ? 'ಮುಂದುವರಿಸಿ' : language === 'gu' ? 'ચાલુ રાખો' : 'Resume') 
                        : (language === 'hi' ? 'शुरू करें' : language === 'kn' ? 'ಪ್ರಾರಂಭಿಸಿ' : language === 'gu' ? 'શરૂ કરો' : 'Start')}
                    </span>
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
                className={`h-10 px-3 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 border shadow-xs transition-all active:scale-95 cursor-pointer ${
                  activeShift
                    ? 'bg-white hover:bg-[#FFF9F9] text-[#B83838] border-[#F2C2C2]'
                    : 'gov-btn-secondary'
                }`}
              >
                <Square size={14} />
                <span>
                  {activeShift 
                    ? (language === 'hi' ? 'समाप्त करें' : language === 'kn' ? 'ಶಿಫ್ಟ್ ಮುಗಿಸಿ' : language === 'gu' ? 'શિફ્ટ સમાપ્ત કરો' : 'End Shift') 
                    : (language === 'hi' ? 'रीसेट' : language === 'kn' ? 'ಮರುಹೊಂದಿಸಿ' : language === 'gu' ? 'રીસેટ' : 'Reset')}
                </span>
              </button>
            </div>

            {/* Edit Shift Times Menu (Enter Start Time OR End Time) */}
            <div className="pt-2 border-t border-[#E7E5DE]">
              {!editMode ? (
                <button
                  type="button"
                  onClick={handleOpenEdit}
                  className="w-full py-2 text-[12px] font-semibold text-[#5C822D] hover:bg-[#EEF3E7] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit3 size={14} />
                  <span>
                    {language === 'hi' 
                      ? 'समय संपादित करें (प्रारंभ या समाप्ति)' 
                      : language === 'kn'
                      ? 'ಶಿಫ್ಟ್ ಸಮಯ ಸಂಪಾದಿಸಿ (ಆರಂಭ ಅಥವಾ ಅಂತ್ಯ)'
                      : language === 'gu'
                      ? 'શિફ્ટ સમય સંપાદિત કરો (શરૂઆત અથવા અંત)'
                      : 'Edit Shift Times (Start or End)'}
                  </span>
                </button>
              ) : (
                <form onSubmit={handleCustomTimeSubmit} className="space-y-3 bg-[#FAFBF9] p-3 rounded-xl border border-[#E7E5DE]">
                  <div className="text-[11.5px] font-bold text-[#263026] flex items-center justify-between">
                    <span>
                      {language === 'hi' 
                        ? 'प्रारंभ या समाप्ति समय दर्ज करें:' 
                        : language === 'kn'
                        ? 'ಆರಂಭ ಅಥವಾ ಅಂತ್ಯದ ಸಮಯ ನಮೂದಿಸಿ:'
                        : language === 'gu'
                        ? 'શરૂઆત અથવા અંતનો સમય દાખલ કરો:'
                        : 'Enter Shift Start or End Time:'}
                    </span>
                    {previewElapsed && (
                      <span className="text-[11px] font-mono text-[#5C822D] bg-[#EEF3E7] px-2 py-0.5 rounded-md font-bold">
                        {language === 'hi' 
                          ? `बीता समय: ${previewElapsed}` 
                          : language === 'kn'
                          ? `ಕಳೆದ ಸಮಯ: ${previewElapsed}`
                          : language === 'gu'
                          ? `વીતેલો સમય: ${previewElapsed}`
                          : `Elapsed: ${previewElapsed}`}
                      </span>
                    )}
                  </div>

                  {/* 2 Linked Input Fields */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10.5px] font-bold text-[#596158] block mb-1">
                        {language === 'hi' ? '1. प्रारंभ समय (Start)' : '1. Start Time (Start)'}
                      </label>
                      <input
                        type="time"
                        value={startTimeInput}
                        onChange={(e) => handleStartTimeChange(e.target.value)}
                        className="w-full p-2 border border-[#D5D2C9] rounded-lg text-[13px] font-mono bg-white text-[#263026] focus:outline-2 focus:outline-[#5C822D]"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10.5px] font-bold text-[#596158] block mb-1">
                        {language === 'hi' ? '2. समाप्ति समय (End · 8h)' : '2. End Time (End · 8h)'}
                      </label>
                      <input
                        type="time"
                        value={endTimeInput}
                        onChange={(e) => handleEndTimeChange(e.target.value)}
                        className="w-full p-2 border border-[#D5D2C9] rounded-lg text-[13px] font-mono bg-white text-[#263026] focus:outline-2 focus:outline-[#5C822D]"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="gov-btn-primary flex-1 h-9 px-3 text-[12px] font-bold flex items-center justify-center gap-1.5 rounded-lg shadow-xs cursor-pointer"
                    >
                      <Check size={14} />
                      <span>
                        {language === 'hi' 
                          ? 'लागू करें व टाइमर चलाएं' 
                          : language === 'kn'
                          ? 'ಅನ್ವಯಿಸಿ ಮತ್ತು ಚಾಲನೆ ಮಾಡಿ'
                          : language === 'gu'
                          ? 'લાગુ કરો અને ટાઈમર ચલાવો'
                          : 'Apply & Run Timer'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="gov-btn-secondary h-9 px-3 text-[12px] rounded-lg cursor-pointer"
                    >
                      {language === 'hi' ? 'रद्द' : language === 'kn' ? 'ರದ್ದು' : language === 'gu' ? 'રદ' : 'Cancel'}
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
