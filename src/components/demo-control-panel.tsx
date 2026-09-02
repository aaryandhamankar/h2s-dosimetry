'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/app-store';
import { useDemoConfigStore, DEFAULT_DEMO_SEQUENCE, ScanMode } from '@/stores/demo-config-store';
import { DemoScenario } from '@/types';
import {
  RotateCcw, X, Timer, FlaskConical, Settings2, ChevronRight,
  GripVertical, Shuffle, List, Hash, ToggleLeft, ToggleRight,
  ArrowUpDown, Check, AlertCircle,
} from 'lucide-react';
import { sfx } from '@/lib/sound-effects';

// ─── Scenario helpers ────────────────────────────────────────────────────────

const SCENARIO_META: Record<DemoScenario, { label: string; color: string; bg: string }> = {
  [DemoScenario.NORMAL]:      { label: 'Normal',        color: '#35551F', bg: '#EDF3E4' },
  [DemoScenario.ELEVATED]:    { label: 'Elevated',      color: '#B8860B', bg: '#FAF5E8' },
  [DemoScenario.HIGH]:        { label: 'High Exposure', color: '#C96B32', bg: '#FAF2EB' },
  [DemoScenario.CRITICAL]:    { label: 'Critical',      color: '#A94442', bg: '#F8ECEC' },
  [DemoScenario.INVALID]:     { label: 'Invalid / Glare', color: '#596158', bg: '#F4EFE6' },
  [DemoScenario.OUT_OF_RANGE]: { label: 'Out of Range', color: '#9C4124', bg: '#FAF2EB' },
};

const ALL_SCENARIOS = Object.values(DemoScenario);

// ─── Tab type ────────────────────────────────────────────────────────────────

type AdminTab = 'scenarios' | 'sequence' | 'mapping' | 'shift';

interface SequenceTabContentProps {
  demoSequence: DemoScenario[];
  sequenceCursor: number;
  setDemoSequence: (seq: DemoScenario[]) => void;
  setSequenceCursor: (cur: number) => void;
}

function SequenceTabContent({
  demoSequence,
  sequenceCursor,
  setDemoSequence,
  setSequenceCursor,
}: SequenceTabContentProps) {
  const [localSequence, setLocalSequence] = useState<DemoScenario[]>([...demoSequence]);

  const saveSequence = () => {
    if (localSequence.length === 0) return;
    setDemoSequence(localSequence);
    sfx.playClick();
  };

  const removeFromSequence = (idx: number) => {
    setLocalSequence(prev => prev.filter((_, i) => i !== idx));
  };

  const addToSequence = (scenario: DemoScenario) => {
    setLocalSequence(prev => [...prev, scenario]);
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setLocalSequence(prev => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const moveDown = (idx: number) => {
    setLocalSequence(prev => {
      if (idx === prev.length - 1) return prev;
      const next = [...prev];
      [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-bold text-[#263026] text-[13px]">Demo Scan Sequence</div>
          <div className="text-[11.5px] text-[#596158] mt-0.5">
            Reorder, add, or remove scenarios. The cursor advances after each scan.
          </div>
        </div>
        <button
          onClick={() => { setLocalSequence([...DEFAULT_DEMO_SEQUENCE]); sfx.playClick(); }}
          className="gov-btn-secondary text-[11px] h-7 px-2.5 flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <RotateCcw size={11} /> Default
        </button>
      </div>

      {/* Sequence list */}
      <div className="space-y-1.5">
        {localSequence.map((scenario, idx) => {
          const meta = SCENARIO_META[scenario];
          const isCurrent = idx === sequenceCursor;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 p-2 rounded-lg border ${isCurrent ? 'border-[#5C822D] bg-[#EDF3E4]' : 'border-[#E8E2D5] bg-[#FAF7F0]'}`}
            >
              <GripVertical size={14} className="text-[#D8D2C2] shrink-0" />
              <span className="w-5 text-[11px] text-[#7A8178] font-mono text-center shrink-0">{idx + 1}</span>
              <div className="flex-1 font-semibold text-[12px]" style={{ color: meta.color }}>{meta.label}</div>
              {isCurrent && <span className="text-[9px] font-bold text-[#5C822D] bg-white border border-[#5C822D] rounded px-1 shrink-0">CURSOR</span>}
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1 rounded hover:bg-[#E8E2D5] disabled:opacity-30 cursor-pointer" title="Move up">↑</button>
                <button onClick={() => moveDown(idx)} disabled={idx === localSequence.length - 1} className="p-1 rounded hover:bg-[#E8E2D5] disabled:opacity-30 cursor-pointer" title="Move down">↓</button>
                <button
                  onClick={() => removeFromSequence(idx)}
                  className="p-1 rounded hover:bg-[#F8ECEC] text-[#A94442] cursor-pointer"
                  title="Remove"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add scenario */}
      <div className="space-y-1.5">
        <div className="text-[11.5px] font-bold text-[#596158]">Add to sequence:</div>
        <div className="flex flex-wrap gap-1.5">
          {ALL_SCENARIOS.map(scenario => {
            const meta = SCENARIO_META[scenario];
            return (
              <button
                key={scenario}
                onClick={() => { addToSequence(scenario); sfx.playClick(); }}
                className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#E8E2D5] bg-white hover:border-[#BCCFB0] transition-colors cursor-pointer"
                style={{ color: meta.color }}
              >
                + {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Jump to step */}
      <div className="flex items-center gap-2 p-3 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl">
        <div className="font-bold text-[#263026] text-[12.5px] shrink-0">Jump to step:</div>
        <div className="flex flex-wrap gap-1.5">
          {localSequence.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { sfx.playClick(); setSequenceCursor(idx); }}
              className={`w-7 h-7 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                idx === sequenceCursor
                  ? 'bg-[#5C822D] border-[#5C822D] text-white'
                  : 'bg-white border-[#E8E2D5] text-[#263026] hover:border-[#BCCFB0]'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={saveSequence}
        disabled={localSequence.length === 0}
        className="w-full py-2 rounded-xl bg-[#5C822D] text-white font-bold text-[13px] hover:bg-[#4A6B24] transition-colors disabled:opacity-40 cursor-pointer"
      >
        Save Sequence
      </button>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function DemoControlPanel() {
  const [open, setOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('scenarios');
  const router = useRouter();
  const navSeqRef = useRef(0);

  const { resetDemo, setShiftElapsedMinutes, language } = useAppStore();

  const {
    demoModeEnabled, setDemoModeEnabled,
    scanMode, setScanMode,
    fixedScenario, setFixedScenario,
    demoSequence, setDemoSequence,
    sequenceCursor, setSequenceCursor, resetSequence,
    codeMappings, updateCodeMapping, resetCodeMappings,
    resetAll,
  } = useDemoConfigStore();

  // ── Keyboard shortcut: D ─────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'Escape') {
        if (adminOpen) { setAdminOpen(false); return; }
        if (open) { setOpen(false); return; }
      }
      if (e.key === 'd' || e.key === 'D') {
        sfx.playClick();
        setOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, adminOpen]);

  // ── Mobile long-press on About page → open admin panel ───────────────────
  useEffect(() => {
    const handleOpenAdmin = () => {
      sfx.playClick();
      setOpen(false);
      setAdminOpen(true);
    };
    window.addEventListener('h2s:open-demo-admin', handleOpenAdmin);
    return () => window.removeEventListener('h2s:open-demo-admin', handleOpenAdmin);
  }, []);

  // ── Trigger scenario ─────────────────────────────────────────────────────
  const handleTriggerScenario = (scenario: DemoScenario) => {
    sfx.playClick();
    setOpen(false);
    navSeqRef.current += 1;
    router.push(`/scan?scenario=${scenario}&t=${navSeqRef.current}`);
  };

  const handleReset = () => {
    sfx.playClick();
    resetDemo();
    resetAll();
    setOpen(false);
    setAdminOpen(false);
    router.push('/');
  };

  // ── Mapping editor state ──────────────────────────────────────────────────
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [editScenario, setEditScenario] = useState<DemoScenario>(DemoScenario.NORMAL);
  const [editLabel, setEditLabel] = useState('');

  const startEditMapping = (code: string) => {
    const entry = codeMappings.find(m => m.code === code);
    if (!entry) return;
    setEditingCode(code);
    setEditScenario(entry.scenario);
    setEditLabel(entry.label);
  };

  const saveMapping = () => {
    if (!editingCode) return;
    updateCodeMapping(editingCode, editScenario, editLabel);
    setEditingCode(null);
    sfx.playClick();
  };

  const titleLabel = language === 'hi' ? 'डेमो परीक्षण' : language === 'kn' ? 'ಡೆಮೊ ಪರೀಕ್ಷೆ' : language === 'gu' ? 'ડેમો ટેસ્ટ' : 'Demo Test Scenarios';

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Scenario Picker Modal ── */}
      {open && !adminOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-scenarios-title"
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8E2D5] space-y-3.5 sm:space-y-4 p-4 sm:p-6 text-[14px] my-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-3">
              <h3 id="demo-scenarios-title" className="font-black text-[16px] sm:text-[17px] text-[#263026]">
                {titleLabel}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { sfx.playClick(); setAdminOpen(true); }}
                  className="p-1.5 rounded-md text-[#7A8178] hover:text-[#263026] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
                  title="Demo Admin Panel"
                  aria-label="Open Demo Admin Panel"
                >
                  <Settings2 size={16} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-[#7A8178] hover:text-[#263026] p-1 rounded-md hover:bg-[#F4EFE6] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Demo mode status */}
            {!demoModeEnabled && (
              <div className="flex items-center gap-2 p-2.5 bg-[#F8ECEC] border border-[#E8C4B8] rounded-lg text-[12px] text-[#A94442]">
                <AlertCircle size={14} />
                <span>Demo Mode is <strong>disabled</strong>. Live camera scans will use real image validation. Enable in Admin.</span>
              </div>
            )}

            {demoModeEnabled && (
              <div className="flex items-center gap-2 p-2.5 bg-[#EDF3E4] border border-[#C6DCC0] rounded-lg text-[12px] text-[#35551F]">
                <FlaskConical size={13} />
                <span>
                  <strong>Mode: </strong>
                  {scanMode === 'sequence' ? `Sequence (step ${sequenceCursor + 1}/${demoSequence.length})` : scanMode === 'fixed' ? `Fixed → ${SCENARIO_META[fixedScenario].label}` : 'Code Detection'}
                </span>
              </div>
            )}

            <p className="text-[12px] sm:text-[13px] text-[#596158]">
              Select any calibrated scenario to trigger the 8-stage verification pipeline:
            </p>

            {/* Scenario grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ALL_SCENARIOS.map((scenario, idx) => {
                const meta = SCENARIO_META[scenario];
                const isCurrentSeq = scanMode === 'sequence' && demoSequence[sequenceCursor] === scenario;
                return (
                  <button
                    key={scenario}
                    onClick={() => handleTriggerScenario(scenario)}
                    className={`p-3 rounded-xl border text-left transition-all space-y-0.5 cursor-pointer relative ${
                      isCurrentSeq
                        ? 'bg-[#EDF3E4] border-[#5C822D] ring-1 ring-[#5C822D]'
                        : 'bg-[#FAF7F0] border-[#E8E2D5] hover:border-opacity-100'
                    }`}
                    style={{ '--hover-border': meta.color } as React.CSSProperties}
                  >
                    {isCurrentSeq && (
                      <span className="absolute top-1.5 right-1.5 text-[9px] font-bold text-[#5C822D] bg-white border border-[#5C822D] rounded px-1">NEXT</span>
                    )}
                    <div className="font-bold text-[13px]" style={{ color: meta.color }}>
                      {idx + 1}. {meta.label}
                    </div>
                    <div className="text-[11px] text-[#596158]">
                      {scenario === DemoScenario.NORMAL && 'Safe baseline · 3.2 ppm·h'}
                      {scenario === DemoScenario.ELEVATED && 'Moderate CuS reaction · 12.4 ppm·h'}
                      {scenario === DemoScenario.HIGH && 'Near 10 ppm 8h TWA · 18.6 ppm·h'}
                      {scenario === DemoScenario.CRITICAL && 'Exceeds ceiling · 24.8 ppm·h'}
                      {scenario === DemoScenario.INVALID && 'Optical quality gate refusal'}
                      {scenario === DemoScenario.OUT_OF_RANGE && 'Sensor saturated · >30 ppm·h'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Shift presets */}
            <ShiftPresets setShiftElapsedMinutes={setShiftElapsedMinutes} />

            {/* Footer */}
            <div className="pt-3 border-t border-[#E8E2D5] flex items-center justify-between">
              <button
                onClick={handleReset}
                className="gov-btn-secondary text-[12px] h-8 px-3 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo State</span>
              </button>
              <button
                onClick={() => setOpen(false)}
                className="gov-btn-secondary text-[12px] h-8 px-4 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Hidden Admin Panel ── */}
      {adminOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setAdminOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-panel-title"
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E8E2D5] text-[13px]"
            onClick={e => e.stopPropagation()}
          >
            {/* Admin header */}
            <div className="flex items-center justify-between border-b border-[#E8E2D5] px-5 py-3.5 shrink-0">
              <div className="flex items-center gap-2">
                <Settings2 size={16} className="text-[#5C822D]" />
                <div>
                  <h3 id="admin-panel-title" className="font-black text-[15px] text-[#263026] leading-tight">Demo Admin Panel</h3>
                  <p className="text-[10.5px] text-[#7A8178]">Hidden — Desktop: press D · Mobile: long-press About section</p>
                </div>
              </div>
              <button onClick={() => setAdminOpen(false)} className="text-[#7A8178] hover:text-[#263026] p-1 rounded-md hover:bg-[#F4EFE6] cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#E8E2D5] px-5 gap-1 shrink-0 overflow-x-auto">
              {(['scenarios', 'sequence', 'mapping', 'shift'] as AdminTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => { sfx.playClick(); setActiveTab(tab); }}
                  className={`px-3 py-2.5 text-[12px] font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === tab
                      ? 'border-[#5C822D] text-[#35551F]'
                      : 'border-transparent text-[#7A8178] hover:text-[#263026]'
                  }`}
                >
                  {tab === 'scenarios' && 'Demo Mode'}
                  {tab === 'sequence' && 'Sequence'}
                  {tab === 'mapping' && 'Code Mapping'}
                  {tab === 'shift' && 'Shift Time'}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

              {/* ── Tab: Demo Mode ── */}
              {activeTab === 'scenarios' && (
                <div className="space-y-4">
                  {/* Enable/Disable toggle */}
                  <div className="flex items-center justify-between p-3.5 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl">
                    <div>
                      <div className="font-bold text-[#263026]">Demo Mode</div>
                      <div className="text-[11.5px] text-[#596158] mt-0.5">
                        When enabled, camera captures use the configured scan mode below instead of live CV.
                      </div>
                    </div>
                    <button
                      onClick={() => { sfx.playClick(); setDemoModeEnabled(!demoModeEnabled); }}
                      className="cursor-pointer ml-4 shrink-0"
                      aria-label={demoModeEnabled ? 'Disable demo mode' : 'Enable demo mode'}
                    >
                      {demoModeEnabled
                        ? <ToggleRight size={32} className="text-[#5C822D]" />
                        : <ToggleLeft size={32} className="text-[#D8D2C2]" />}
                    </button>
                  </div>

                  {/* Scan mode selector */}
                  <div className="space-y-2">
                    <div className="font-bold text-[#263026] text-[12.5px]">Scan Mode</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {([
                        { mode: 'sequence' as ScanMode, icon: <List size={14} />, title: 'Sequence', desc: 'Advance through the ordered list on each scan' },
                        { mode: 'fixed' as ScanMode, icon: <Hash size={14} />, title: 'Fixed', desc: 'Always produce the same scenario' },
                        { mode: 'code' as ScanMode, icon: <Shuffle size={14} />, title: 'Code Detect', desc: 'Resolve from embedded demo code in image' },
                      ] as const).map(({ mode, icon, title, desc }) => (
                        <button
                          key={mode}
                          onClick={() => { sfx.playClick(); setScanMode(mode); }}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            scanMode === mode
                              ? 'bg-[#EDF3E4] border-[#5C822D] ring-1 ring-[#5C822D]'
                              : 'bg-[#FAF7F0] border-[#E8E2D5] hover:border-[#BCCFB0]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-bold text-[#263026] mb-0.5">
                            <span className={scanMode === mode ? 'text-[#5C822D]' : 'text-[#7A8178]'}>{icon}</span>
                            {title}
                          </div>
                          <div className="text-[10.5px] text-[#596158]">{desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fixed scenario picker */}
                  {scanMode === 'fixed' && (
                    <div className="space-y-2">
                      <div className="font-bold text-[#263026] text-[12.5px]">Fixed Scenario</div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {ALL_SCENARIOS.map(scenario => {
                          const meta = SCENARIO_META[scenario];
                          return (
                            <button
                              key={scenario}
                              onClick={() => { sfx.playClick(); setFixedScenario(scenario); }}
                              className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                                fixedScenario === scenario
                                  ? 'ring-1 ring-[#5C822D] border-[#5C822D]'
                                  : 'border-[#E8E2D5] hover:border-[#BCCFB0]'
                              }`}
                              style={{ background: fixedScenario === scenario ? meta.bg : '#FAF7F0' }}
                            >
                              {fixedScenario === scenario && <Check size={11} className="text-[#5C822D] mb-0.5" />}
                              <div className="font-bold text-[12px]" style={{ color: meta.color }}>{meta.label}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Sequence quick actions */}
                  {scanMode === 'sequence' && (
                    <div className="p-3 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl space-y-2">
                      <div className="font-bold text-[#263026] text-[12.5px]">Sequence Status</div>
                      <div className="text-[12px] text-[#596158]">
                        Step <strong>{sequenceCursor + 1}</strong> of <strong>{demoSequence.length}</strong>:{' '}
                        <span style={{ color: SCENARIO_META[demoSequence[sequenceCursor % demoSequence.length]]?.color }}>
                          {SCENARIO_META[demoSequence[sequenceCursor % demoSequence.length]]?.label}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { sfx.playClick(); resetSequence(); }}
                          className="gov-btn-secondary text-[11.5px] h-7 px-2.5 flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw size={12} /> Reset Cursor
                        </button>
                        <button
                          onClick={() => { sfx.playClick(); setActiveTab('sequence'); }}
                          className="gov-btn-secondary text-[11.5px] h-7 px-2.5 flex items-center gap-1 cursor-pointer"
                        >
                          <ArrowUpDown size={12} /> Edit Sequence
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Tab: Sequence ── */}
              {activeTab === 'sequence' && (
                <SequenceTabContent
                  demoSequence={demoSequence}
                  sequenceCursor={sequenceCursor}
                  setDemoSequence={setDemoSequence}
                  setSequenceCursor={setSequenceCursor}
                />
              )}

              {/* ── Tab: Code Mapping ── */}
              {activeTab === 'mapping' && (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-[#263026] text-[13px]">Code → Result Mapping</div>
                      <div className="text-[11.5px] text-[#596158] mt-0.5">
                        Change which scenario each demo code produces. Does not affect scanning logic.
                      </div>
                    </div>
                    <button
                      onClick={() => { resetCodeMappings(); sfx.playClick(); setEditingCode(null); }}
                      className="gov-btn-secondary text-[11px] h-7 px-2.5 flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <RotateCcw size={11} /> Defaults
                    </button>
                  </div>

                  <div className="space-y-2">
                    {codeMappings.map(mapping => {
                      const meta = SCENARIO_META[mapping.scenario];
                      const isEditing = editingCode === mapping.code;
                      return (
                        <div key={mapping.code} className={`border rounded-xl transition-all ${isEditing ? 'border-[#5C822D] bg-[#EDF3E4]' : 'border-[#E8E2D5] bg-[#FAF7F0]'}`}>
                          {!isEditing ? (
                            <div className="flex items-center gap-3 p-3">
                              <code className="font-mono font-bold text-[13px] text-[#263026] bg-white border border-[#E8E2D5] rounded px-2 py-0.5 shrink-0">
                                {mapping.code}
                              </code>
                              <ChevronRight size={14} className="text-[#D8D2C2] shrink-0" />
                              <div className="flex-1">
                                <div className="font-bold text-[12px]" style={{ color: meta.color }}>{mapping.label}</div>
                                <div className="text-[10.5px] text-[#7A8178]">{mapping.scenario}</div>
                              </div>
                              <button
                                onClick={() => startEditMapping(mapping.code)}
                                className="text-[11px] text-[#5C822D] font-bold hover:underline cursor-pointer shrink-0"
                              >
                                Edit
                              </button>
                            </div>
                          ) : (
                            <div className="p-3 space-y-3">
                              <div className="flex items-center gap-2">
                                <code className="font-mono font-bold text-[13px] text-[#263026] bg-white border border-[#5C822D] rounded px-2 py-0.5">
                                  {mapping.code}
                                </code>
                                <ChevronRight size={14} className="text-[#5C822D]" />
                                <span className="font-bold text-[12px] text-[#35551F]">Editing</span>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-[#596158]">Scenario</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                                  {ALL_SCENARIOS.map(s => {
                                    const sm = SCENARIO_META[s];
                                    return (
                                      <button
                                        key={s}
                                        onClick={() => { setEditScenario(s); setEditLabel(sm.label); }}
                                        className={`p-2 rounded-lg border text-[11px] font-semibold text-left cursor-pointer transition-all ${editScenario === s ? 'ring-1 ring-[#5C822D] border-[#5C822D]' : 'border-[#E8E2D5]'}`}
                                        style={{ color: sm.color, background: editScenario === s ? sm.bg : 'white' }}
                                      >
                                        {editScenario === s && <Check size={10} className="mb-0.5" />}
                                        {sm.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-[#596158]">Label</label>
                                <input
                                  type="text"
                                  value={editLabel}
                                  onChange={e => setEditLabel(e.target.value)}
                                  className="w-full border border-[#D8D2C2] rounded-lg px-3 py-1.5 text-[12px] focus:outline-none focus:border-[#5C822D] bg-white"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button onClick={saveMapping} className="flex-1 py-1.5 rounded-lg bg-[#5C822D] text-white font-bold text-[12px] cursor-pointer hover:bg-[#4A6B24]">
                                  Save
                                </button>
                                <button onClick={() => setEditingCode(null)} className="px-4 py-1.5 rounded-lg border border-[#E8E2D5] text-[#596158] font-bold text-[12px] cursor-pointer hover:bg-[#F4EFE6]">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Tab: Shift Time ── */}
              {activeTab === 'shift' && (
                <div className="space-y-4">
                  <div>
                    <div className="font-bold text-[#263026] text-[13px]">Shift Duration & Mid-Shift Presets</div>
                    <div className="text-[11.5px] text-[#596158] mt-0.5">Simulate 8h TWA calculation at different shift stages.</div>
                  </div>
                  <ShiftPresets setShiftElapsedMinutes={setShiftElapsedMinutes} large />
                </div>
              )}
            </div>

            {/* Admin footer */}
            <div className="border-t border-[#E8E2D5] px-5 py-3 flex items-center justify-between shrink-0">
              <button
                onClick={handleReset}
                className="gov-btn-secondary text-[12px] h-8 px-3 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Demo State
              </button>
              <button
                onClick={() => setAdminOpen(false)}
                className="gov-btn-secondary text-[12px] h-8 px-4 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Shift Presets sub-component ─────────────────────────────────────────────

function ShiftPresets({
  setShiftElapsedMinutes,
  large = false,
}: {
  setShiftElapsedMinutes: (m: number) => void;
  large?: boolean;
}) {
  const presets = [
    { label: '0h (Start)', minutes: 0 },
    { label: '2h (Mid)',   minutes: 120 },
    { label: '4h (Half)',  minutes: 240 },
    { label: '6h (Late)',  minutes: 360 },
    { label: '8h (Full)',  minutes: 480 },
  ];

  return (
    <div className={`${large ? '' : 'pt-2.5 border-t border-[#E8E2D5]'} space-y-2`}>
      {!large && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-[12.5px] text-[#263026]">
            <Timer className="w-3.5 h-3.5 text-[#5C822D]" />
            <span>Shift Duration &amp; Mid-Shift Presets</span>
          </div>
          <span className="text-[10.5px] text-[#7A8178]">Simulate 8h TWA</span>
        </div>
      )}
      <div className={`grid grid-cols-5 gap-1.5 ${large ? 'text-[13px]' : 'text-[11px]'} font-bold`}>
        {presets.map(({ label, minutes }) => (
          <button
            key={minutes}
            type="button"
            onClick={() => { sfx.playClick(); setShiftElapsedMinutes(minutes); }}
            className={`${large ? 'p-2.5' : 'p-1.5'} rounded-lg border border-[#E8E2D5] bg-[#FAF7F0] hover:bg-[#EDF3E4] hover:border-[#5C822D] text-[#263026] text-center transition-colors cursor-pointer`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
