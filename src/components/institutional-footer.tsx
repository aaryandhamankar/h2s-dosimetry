'use client';

import { useEffect, useRef, useCallback } from 'react';
import { CheckCircle2, X, Award, Beaker, Code2, Users2, Cpu, Compass } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { sfx } from '@/lib/sound-effects';

const TEAM_MEMBERS = [
  {
    name: 'Aaryan Dhamankar',
    badge: 'SOFTWARE LEAD',
    role: 'Software, Digital Systems & Platform',
    code: 'TEAM-01',
    icon: Code2,
    highlight: 'Full-Stack Architecture, Real-Time Telemetry & Next.js Platform'
  },
  {
    name: 'Arya Modh',
    badge: 'CHEMISTRY & R&D',
    role: 'Chemistry, Sensor Research & Development',
    code: 'TEAM-02',
    icon: Beaker,
    highlight: 'Sensor Matrix Formulation, Color Kinetics & Assay Optimization'
  },
  {
    name: 'Avani Abhyankar',
    badge: 'AI/ML LEAD',
    role: 'AI Model Development & Analysis',
    code: 'TEAM-03',
    icon: Cpu,
    highlight: 'Deterministic Optical Inference, Calibration Models & Data Analytics'
  },
  {
    name: 'Aarushi Jha',
    badge: 'CHEMISTRY LEAD',
    role: 'Chemosensor Chemistry & Reagent Development',
    code: 'TEAM-04',
    icon: Beaker,
    highlight: 'Lead-Free Cu-PAN & Bismuth(III) Substrate Chemistry'
  },
  {
    name: 'Payas Pawar',
    badge: 'RESEARCH & MARKET LEAD',
    role: 'Market, Technology & Competitive Research',
    code: 'TEAM-05',
    icon: Compass,
    highlight: 'Industrial Metrology Standards, Competitive Landscape & Market Fit'
  },
  {
    name: 'Sudnya Irranna',
    badge: 'HARDWARE & PRODUCT DESIGN',
    role: 'Hardware, CAD & Product Development',
    code: 'TEAM-06',
    icon: Users2,
    highlight: 'Wearable Wristband Ergonomics, CAD Design & Form Factor Engineering'
  },
];

const EMOJIS = ['🎉', '🥳', '🎊', '🇮🇳', '🏆', '🚀', '✨', '🧪', '💡', '🔥', '👏', '💥', '⚡', '🌟'];
const CONFETTI_COLORS = [
  '#FF9933', // Saffron
  '#138808', // Indian Green
  '#5C822D', // Moss Green
  '#FFD700', // Gold
  '#FFFFFF', // White
  '#00C2FF', // Electric Cyan
  '#FF2E93', // Vivid Pink
  '#FF6B4A', // Bright Coral
  '#9B51E0', // Royal Purple
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  opacity: number;
  decay: number;
  isEmoji: boolean;
  isCircle?: boolean;
  emoji?: string;
}

export function InstitutionalFooter() {
  const { teamModalOpen, setTeamModalOpen, language } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isRunningRef = useRef<boolean>(false);

  // Resize canvas to match actual viewport
  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas && typeof window !== 'undefined') {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }, []);

  // Main Animation Loop
  const runAnimationLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      isRunningRef.current = false;
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      isRunningRef.current = false;
      return;
    }

    const loop = () => {
      if (particlesRef.current.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        isRunningRef.current = false;
        animationFrameRef.current = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gravity = 0.38;
      const airDrag = 0.984;
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.vy += gravity;
        p.vx *= airDrag;
        p.vy *= airDrag;
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;
        p.opacity -= p.decay;

        if (p.opacity <= 0 || p.y > canvas.height + 100 || p.x < -100 || p.x > canvas.width + 100) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.isEmoji && p.emoji) {
          ctx.font = `${p.size}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.emoji, 0, 0);
        } else if (p.isCircle) {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          const wobbleScale = Math.cos(p.wobble);
          ctx.scale(1, wobbleScale);
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
        }

        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    if (!isRunningRef.current) {
      isRunningRef.current = true;
      animationFrameRef.current = requestAnimationFrame(loop);
    }
  }, []);

  // 360-Degree Center Supernova Burst + Side Cannons across entire screen
  const launchExplosion = useCallback(() => {
    if (typeof window === 'undefined') return;

    syncCanvasSize();

    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height * 0.45;

    const newParticles: Particle[] = [];

    // 1. Center Starburst (160 ribbons spreading in all 360 degrees)
    for (let i = 0; i < 160; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 9 + Math.random() * 26;
      newParticles.push({
        x: centerX + (Math.random() * 40 - 20),
        y: centerY + (Math.random() * 40 - 20),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        size: 8 + Math.random() * 11,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.25,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.08 + Math.random() * 0.1,
        opacity: 1,
        decay: 0.005 + Math.random() * 0.005,
        isEmoji: false,
        isCircle: Math.random() < 0.25,
      });
    }

    // 2. Center Emoji Shockwave (40 celebration emojis radiating outwards)
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 6 + Math.random() * 18;
      newParticles.push({
        x: centerX + (Math.random() * 60 - 30),
        y: centerY + (Math.random() * 60 - 30),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 7,
        size: 26 + Math.random() * 22,
        color: '#FFFFFF',
        rotation: (Math.random() - 0.5) * 0.4,
        rotationSpeed: (Math.random() - 0.5) * 0.06,
        wobble: 0,
        wobbleSpeed: 0,
        opacity: 1,
        decay: 0.004 + Math.random() * 0.004,
        isEmoji: true,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      });
    }

    // 3. Left Bottom Cannon (50 particles blasting upward-right)
    for (let i = 0; i < 50; i++) {
      const angle = -Math.PI / 4 + (Math.random() * 0.6 - 0.3);
      const speed = 16 + Math.random() * 22;
      newParticles.push({
        x: width * 0.08,
        y: height * 0.9,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 9 + Math.random() * 10,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.1,
        opacity: 1,
        decay: 0.006 + Math.random() * 0.005,
        isEmoji: false,
      });
    }

    // 4. Right Bottom Cannon (50 particles blasting upward-left)
    for (let i = 0; i < 50; i++) {
      const angle = -3 * Math.PI / 4 + (Math.random() * 0.6 - 0.3);
      const speed = 16 + Math.random() * 22;
      newParticles.push({
        x: width * 0.92,
        y: height * 0.9,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 9 + Math.random() * 10,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.1,
        opacity: 1,
        decay: 0.006 + Math.random() * 0.005,
        isEmoji: false,
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];
    runAnimationLoop();
  }, [syncCanvasSize, runAnimationLoop]);

  // Master Celebration Trigger: 2 Rapid Successive Bursts for Maximum Impact
  const triggerCelebration = useCallback(() => {
    sfx.playCelebration();
    launchExplosion();
    setTimeout(() => {
      launchExplosion();
    }, 280);
  }, [launchExplosion]);

  // Auto-trigger ON MOBILE ONLY when the modal opens
  useEffect(() => {
    if (teamModalOpen) {
      if (typeof window !== 'undefined' && window.innerWidth < 640) {
        triggerCelebration();
      }
    }
  }, [teamModalOpen, triggerCelebration]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      syncCanvasSize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [syncCanvasSize]);

  // Shortcut key (Shift+H)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'h' || e.key === 'H') && (e.shiftKey || e.metaKey || e.ctrlKey)) {
        setTeamModalOpen(!teamModalOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [teamModalOpen, setTeamModalOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <footer className="py-1.5 sm:py-2 px-3 sm:px-6 mt-auto flex-shrink-0">
      
      {/* Fullscreen Celebration Canvas (always ready, z-100 on top of everything) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[100] w-full h-full"
      />

      {/* Desktop-Only Sleek Pill (Hidden on Mobile) */}
      <div className="hidden sm:flex max-w-[1200px] mx-auto items-center justify-center">
        <button
          onClick={() => setTeamModalOpen(true)}
          className="group inline-flex items-center gap-2 text-[11px] sm:text-[12px] text-[#596158] hover:text-[#263026] bg-white hover:bg-[#FAF7F0] px-3.5 sm:px-4 py-1.5 rounded-full border border-[#E8E2D5] hover:border-[#5C822D] transition-all cursor-pointer shadow-2xs hover:shadow-xs"
          title="Click to view Hackathon 2026 Project Team Dossier"
        >
          <span className="font-medium tracking-normal text-center">
            Hackathon Project 2026 by Aaryan Dhamankar, Arya Modh, Avani Abhyankar, Aarushi Jha, Payas Pawar, Sudnya Irranna
          </span>
        </button>
      </div>

      {/* EASTER EGG MODAL: Hackathon 2026 Project Team */}
      {teamModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#FAF7F0] text-[#263026] rounded-2xl max-w-2xl w-full shadow-2xl border-2 border-[#5C822D] overflow-hidden animate-in zoom-in-95 duration-150 relative">
            
            {/* Indian Tricolor Ribbon Top Bar */}
            <div className="tricolor-ribbon h-1.5 w-full flex">
              <div className="flex-1 bg-[#FF9933]" />
              <div className="flex-1 bg-[#FFFFFF]" />
              <div className="flex-1 bg-[#138808]" />
            </div>

            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-white border-b border-[#E8E2D5] flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-[#EDF3E4] border border-[#C6DCC0] flex items-center justify-center text-[#5C822D] shadow-2xs flex-shrink-0">
                  <Award className="w-5 sm:w-6 h-5 sm:h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#5C822D] uppercase tracking-wider font-mono">
                      {language === 'hi' ? 'प्रशंसा पत्र · 2026' : 'COMMENDATION · 2026'}
                    </span>
                  </div>
                  <h3 className="text-[16px] sm:text-[19px] font-bold text-[#263026] leading-tight">
                    {language === 'hi' ? 'H₂S गैस डोसीमेट्री निदेशालय' : 'H₂S Gas Dosimetry Directorate'}
                  </h3>
                  <p className="text-[11px] sm:text-[12px] text-[#596158]">
                    {language === 'hi' ? 'वियरेबल वर्णमितीय कीमोसेंसर प्लेटफ़ॉर्म' : 'Wearable Colorimetric Chemosensor Platform'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setTeamModalOpen(false)}
                className="text-[#7A8178] hover:text-[#263026] p-1.5 rounded-md hover:bg-[#F4EFE6] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Team Members Grid */}
            <div className="p-4 sm:p-5 max-h-[68vh] overflow-y-auto space-y-3">
              <div className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-[#7A8178] flex items-center justify-between">
                <span>{language === 'hi' ? 'परियोजना कोर टीम (6 लीड)' : 'Core Project Team (6 Leads)'}</span>
                <span className="text-[#5C822D] font-mono">MRPL INVENT</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {TEAM_MEMBERS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <div 
                      key={m.name}
                      className="p-3 bg-white rounded-xl border border-[#E8E2D5] hover:border-[#5C822D] hover:shadow-xs transition-all space-y-1.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-lg bg-[#EDF3E4] text-[#5C822D] flex items-center justify-center flex-shrink-0 group-hover:bg-[#5C822D] group-hover:text-white transition-colors">
                            <Icon size={14} />
                          </div>
                          <div>
                            <div className="font-bold text-[13px] sm:text-[14px] text-[#263026] group-hover:text-[#5C822D] leading-tight">
                              {m.name}
                            </div>
                            <div className="text-[10px] sm:text-[11px] text-[#7A8178] font-mono">{m.code}</div>
                          </div>
                        </div>

                        <span className="gov-badge gov-badge-normal text-[8px] sm:text-[9px] py-0.5 px-1.5">
                          {m.badge}
                        </span>
                      </div>

                      <div className="text-[11px] sm:text-[12px] font-semibold text-[#35551F] pt-0.5">
                        {m.role}
                      </div>

                      <div className="text-[10px] sm:text-[11px] text-[#596158] bg-[#FAF7F0] p-1.5 rounded-lg border border-[#E8E2D5] font-mono">
                        💡 {m.highlight}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Scientific System Badge */}
              <div className="p-3 bg-[#EDF3E4] rounded-xl border border-[#C6DCC0] text-[11px] sm:text-[12px] space-y-1 text-[#35551F]">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[#5C822D]" />
                  <span>{language === 'hi' ? 'सत्यापित नवाचार सिद्धांत' : 'Validated Innovation Principles'}</span>
                </div>
                <p className="opacity-90">
                  {language === 'hi' 
                    ? 'लेड-मुक्त ऑप्टिकल कीमोसेंसिंग (Copper-PAN और Bismuth मैट्रिक्स) · ISO/CIE D65 के तहत Bradford क्रोमैटिक सामान्यीकरण।'
                    : 'Lead-free optical chemosensing (Copper-PAN & Bismuth matrix) · Bradford Chromatic Normalization under ISO/CIE D65.'}
                </p>
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="p-3 sm:p-4 bg-white border-t border-[#E8E2D5] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-[12px]">
              <div className="text-[#7A8178] text-center sm:text-left">
                <span>{language === 'hi' ? 'राष्ट्रीय गैस सुरक्षा एवं उत्कृष्टता' : 'National Gas Safety & Excellence'}</span>
              </div>

              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerCelebration();
                  }}
                  className="gov-btn-primary text-[11px] sm:text-[12px] h-8 px-3.5 font-semibold flex items-center gap-1.5 shadow-md hover:shadow-lg active:scale-95 transition-all flex-1 sm:flex-initial justify-center cursor-pointer"
                >
                  <span className="text-[14px]">🥳</span>
                  <span>{language === 'hi' ? 'टीम का अभिनंदन करें' : 'Celebrate Team'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTeamModalOpen(false)}
                  className="gov-btn-secondary text-[11px] sm:text-[12px] h-8 px-3 flex-1 sm:flex-initial justify-center cursor-pointer"
                >
                  <span>{language === 'hi' ? 'बंद करें' : 'Close'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </footer>
  );
}
