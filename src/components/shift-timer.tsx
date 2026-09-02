'use client';

import { useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import { useAppStore } from '@/stores/app-store';
import { sfx } from '@/lib/sound-effects';
import { useMounted } from '@/hooks/use-mounted';
import { determineActiveShift, DEFAULT_SHIFT_CONFIGS } from '@/services/shift-service';
import { 
  Timer, 
  Edit3, 
  Check, 
  X,
  Sparkles
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

interface ShiftScheduleFormProps {
  shiftAConfig: { startTime: string; endTime: string };
  shiftBConfig: { startTime: string; endTime: string };
  onSave: (a: { startTime: string; endTime: string }, b: { startTime: string; endTime: string }) => void;
  onCancel: () => void;
  onResetDefaults: () => void;
  language: string;
}

function ShiftScheduleForm({
  shiftAConfig,
  shiftBConfig,
  onSave,
  onCancel,
  onResetDefaults,
  language,
}: ShiftScheduleFormProps) {
  const [shiftAStart, setShiftAStart] = useState(shiftAConfig.startTime);
  const [shiftAEnd, setShiftAEnd] = useState(shiftAConfig.endTime);
  const [shiftBStart, setShiftBStart] = useState(shiftBConfig.startTime);
  const [shiftBEnd, setShiftBEnd] = useState(shiftBConfig.endTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sfx.playClick();
    onSave({ startTime: shiftAStart, endTime: shiftAEnd }, { startTime: shiftBStart, endTime: shiftBEnd });
  };

  const handleReset = () => {
    sfx.playClick();
    setShiftAStart('06:00');
    setShiftAEnd('14:00');
    setShiftBStart('14:00');
    setShiftBEnd('06:00');
    onResetDefaults();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-[#FAFBF9] p-4 rounded-2xl border border-[#E7E5DE] animate-in fade-in duration-150">
      <div className="flex items-center justify-between border-b border-[#E7E5DE] pb-2">
        <span className="font-bold text-[13px] text-[#263026]">
          {language === 'hi' ? 'शिफ्ट समय अनुकूलन' : 'Configure Shift Hours'}
        </span>
        <button
          type="button"
          onClick={handleReset}
          className="text-[11px] text-[#5C822D] hover:underline font-semibold cursor-pointer"
        >
          Reset Defaults
        </button>
      </div>

      {/* Shift A Inputs */}
      <div className="space-y-1.5">
        <span className="text-[12px] font-bold text-[#35551F] block">
          Shift A (Morning/Day):
        </span>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10.5px] text-[#7A8178] block font-medium mb-1">Start Time</label>
            <input 
              type="time" 
              value={shiftAStart}
              onChange={(e) => setShiftAStart(e.target.value)}
              className="w-full p-2 border border-[#D8D2C2] rounded-lg text-[13px] font-mono bg-white text-[#263026] focus:outline-2 focus:outline-[#5C822D]"
              required
            />
          </div>
          <div>
            <label className="text-[10.5px] text-[#7A8178] block font-medium mb-1">End Time</label>
            <input 
              type="time" 
              value={shiftAEnd}
              onChange={(e) => setShiftAEnd(e.target.value)}
              className="w-full p-2 border border-[#D8D2C2] rounded-lg text-[13px] font-mono bg-white text-[#263026] focus:outline-2 focus:outline-[#5C822D]"
              required
            />
          </div>
        </div>
      </div>

      {/* Shift B Inputs */}
      <div className="space-y-1.5">
        <span className="text-[12px] font-bold text-[#C96B32] block">
          Shift B (Evening/Night):
        </span>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10.5px] text-[#7A8178] block font-medium mb-1">Start Time</label>
            <input 
              type="time" 
              value={shiftBStart}
              onChange={(e) => setShiftBStart(e.target.value)}
              className="w-full p-2 border border-[#D8D2C2] rounded-lg text-[13px] font-mono bg-white text-[#263026] focus:outline-2 focus:outline-[#5C822D]"
              required
            />
          </div>
          <div>
            <label className="text-[10.5px] text-[#7A8178] block font-medium mb-1">End Time (Next Day)</label>
            <input 
              type="time" 
              value={shiftBEnd}
              onChange={(e) => setShiftBEnd(e.target.value)}
              className="w-full p-2 border border-[#D8D2C2] rounded-lg text-[13px] font-mono bg-white text-[#263026] focus:outline-2 focus:outline-[#5C822D]"
              required
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2 border-t border-[#E7E5DE]">
        <button
          type="submit"
          className="gov-btn-primary flex-1 h-10 text-[13px] font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Check size={16} />
          <span>{language === 'hi' ? 'सहेजें व लागू करें' : 'Save & Apply Schedule'}</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="gov-btn-secondary h-10 px-4 text-[13px] rounded-xl cursor-pointer"
        >
          {language === 'hi' ? 'रद्द' : 'Cancel'}
        </button>
      </div>
    </form>
  );
}

export function ShiftTimer() {
  const mounted = useMounted();
  const { 
    shiftConfigs,
    updateShiftConfig,
    shiftTimerModalOpen,
    setShiftTimerModalOpen,
    language 
  } = useAppStore();

  const currentTime = useSyncExternalStore(subscribeToTicker, getNowSnapshot, getServerSnapshot);

  // Active shift derived dynamically from local device time and shift configuration
  const activeShiftData = useMemo(() => {
    const refDate = currentTime ? new Date(currentTime) : new Date();
    return determineActiveShift(shiftConfigs, refDate);
  }, [shiftConfigs, currentTime]);

  const [editMode, setEditMode] = useState(false);

  // Form states for Shift A and Shift B
  const shiftAConfig = useMemo(() => {
    return (shiftConfigs || DEFAULT_SHIFT_CONFIGS).find(c => c.id === 'SHIFT-A') || DEFAULT_SHIFT_CONFIGS[0];
  }, [shiftConfigs]);

  const shiftBConfig = useMemo(() => {
    return (shiftConfigs || DEFAULT_SHIFT_CONFIGS).find(c => c.id === 'SHIFT-B') || DEFAULT_SHIFT_CONFIGS[1];
  }, [shiftConfigs]);

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

  const { activeShift: currentShift, remainingFormatted, progressPercent, elapsedFormatted, isEndingSoon } = activeShiftData;

  const handleSaveConfigs = (a: { startTime: string; endTime: string }, b: { startTime: string; endTime: string }) => {
    updateShiftConfig('SHIFT-A', a);
    updateShiftConfig('SHIFT-B', b);
    setEditMode(false);
  };

  const handleResetDefaults = () => {
    updateShiftConfig('SHIFT-A', { startTime: '06:00', endTime: '14:00' });
    updateShiftConfig('SHIFT-B', { startTime: '14:00', endTime: '06:00' });
    setEditMode(false);
  };

  if (!mounted) return null;

  return (
    <>
      {/* ───────────────────────────────────────────────────────────── */}
      {/* CENTRAL 2-SHIFT CONFIGURATION & TIMING MODAL                  */}
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
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E7E5DE] space-y-4 p-4 sm:p-6 text-[14px] my-auto animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E7E5DE] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#EEF3E7] text-[#5C822D] border border-[#C6DCC0]">
                  <Timer size={20} />
                </div>
                <div>
                  <h3 id="shift-timer-modal-title" className="font-bold text-[16px] sm:text-[17px] text-[#263026] leading-tight">
                    {language === 'hi' 
                      ? 'दो-शिफ्ट चक्र प्रबंधन' 
                      : 'Two-Shift Operation System'}
                  </h3>
                  <p className="text-[11.5px] text-[#7A8178] mt-0.5">
                    {language === 'hi'
                      ? '24-घंटे निरंतर चक्र · स्वचालित समय निर्धारण'
                      : '24-Hour Continuous Cycle · Auto-Detecting'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  sfx.playClick();
                  setShiftTimerModalOpen(false);
                }}
                className="text-[#7A8178] hover:text-[#263026] p-1.5 rounded-lg hover:bg-[#F0EFE9] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Current Active Shift Live Highlight Card */}
            <div className="bg-gradient-to-br from-[#FAF8F3] to-[#F4EFE6] border border-[#E8E2D5] rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-[#7A8178] uppercase tracking-wider block">
                  {language === 'hi' ? 'वर्तमान में सक्रिय शिफ्ट' : 'Currently Active Shift'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#5C822D] bg-[#EDF3E4] px-2 py-0.5 rounded-md border border-[#C6DCC0]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5C822D] animate-ping" />
                  <span>{language === 'hi' ? 'सक्रिय' : 'LIVE'}</span>
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <div className="text-[20px] sm:text-[22px] font-black text-[#263026] font-mono leading-none">
                    {currentShift.name}
                  </div>
                  <div className="text-[12px] text-[#596158] font-medium mt-1">
                    {currentShift.label} ({currentShift.startTime} → {currentShift.endTime})
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-[18px] sm:text-[20px] font-black font-mono leading-none ${
                    isEndingSoon ? 'text-[#B83838]' : 'text-[#5C822D]'
                  }`}>
                    {remainingFormatted}
                  </div>
                  <div className="text-[10.5px] text-[#7A8178] mt-0.5">
                    {language === 'hi' ? 'शिफ्ट समाप्ति तक' : 'until shift change'}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1 pt-1">
                <div className="w-full bg-[#E7E5DE] h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#5C822D] transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10.5px] text-[#7A8178] font-mono">
                  <span>{elapsedFormatted}</span>
                  <span>{progressPercent}% {language === 'hi' ? 'पूर्ण' : 'completed'}</span>
                </div>
              </div>
            </div>

            {/* 2-Shift Schedule Overview / Edit Mode */}
            {!editMode ? (
              <div className="space-y-3">
                <div className="text-[12px] font-bold text-[#596158] uppercase tracking-wider flex items-center justify-between">
                  <span>{language === 'hi' ? 'संयंत्र शिफ्ट अनुसूची (24h)' : 'Plant Shift Schedule (24h Cycle)'}</span>
                  <span className="text-[#5C822D] lowercase font-normal">2 shifts continuous</span>
                </div>

                {/* Shift A Card */}
                <div className={`p-3 rounded-xl border transition-all ${
                  currentShift.id === 'SHIFT-A' 
                    ? 'bg-[#EEF3E7] border-[#5C822D] shadow-2xs' 
                    : 'bg-[#FAFBF9] border-[#E7E5DE]'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[14px] text-[#263026]">Shift A (Morning/Day)</span>
                      {currentShift.id === 'SHIFT-A' && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#5C822D] text-white">Active</span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-[13px] text-[#263026]">
                      {shiftAConfig.startTime} – {shiftAConfig.endTime}
                    </span>
                  </div>
                  <div className="text-[11.5px] text-[#7A8178] mt-0.5">
                    Standard 8-hour morning production shift
                  </div>
                </div>

                {/* Shift B Card */}
                <div className={`p-3 rounded-xl border transition-all ${
                  currentShift.id === 'SHIFT-B' 
                    ? 'bg-[#FDF3E9] border-[#C96B32] shadow-2xs' 
                    : 'bg-[#FAFBF9] border-[#E7E5DE]'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[14px] text-[#263026]">Shift B (Evening/Night)</span>
                      {currentShift.id === 'SHIFT-B' && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#C96B32] text-white">Active</span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-[13px] text-[#263026]">
                      {shiftBConfig.startTime} – {shiftBConfig.endTime}
                    </span>
                  </div>
                  <div className="text-[11.5px] text-[#7A8178] mt-0.5">
                    Covers evening & night cycle (crosses midnight 00:00)
                  </div>
                </div>

                {/* Edit Schedule Button */}
                <button
                  type="button"
                  onClick={() => {
                    sfx.playClick();
                    setEditMode(true);
                  }}
                  className="w-full py-2.5 rounded-xl border border-[#E8E2D5] bg-[#FAF8F3] hover:bg-[#F4EFE6] text-[#263026] text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
                >
                  <Edit3 size={15} className="text-[#5C822D]" />
                  <span>
                    {language === 'hi' 
                      ? 'शिफ्ट समय संपादित करें' 
                      : 'Edit Configured Shift Timings'}
                  </span>
                </button>
              </div>
            ) : (
              <ShiftScheduleForm
                shiftAConfig={shiftAConfig}
                shiftBConfig={shiftBConfig}
                onSave={handleSaveConfigs}
                onCancel={() => setEditMode(false)}
                onResetDefaults={handleResetDefaults}
                language={language}
              />
            )}

            {/* End-of-shift scanning reminder note */}
            <div className="p-3 bg-[#FAF8F3] rounded-xl border border-[#E8E2D5] text-[11.5px] text-[#596158] leading-relaxed flex items-start gap-2">
              <Sparkles size={14} className="text-[#5C822D] flex-shrink-0 mt-0.5" />
              <span>
                {language === 'hi'
                  ? 'स्कैन को शिफ्ट समाप्ति रीडिंग माना जाता है और वर्तमान में सक्रिय शिफ्ट स्वतः संलग्न हो जाती है।'
                  : 'Scans are automatically categorized under the current active shift as end-of-shift readings.'}
              </span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
