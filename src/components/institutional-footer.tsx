'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { PhoneCall, CheckCircle2, Sparkles, X, Award, Beaker, Code2, Users2, Cpu, Compass } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import mrplLogo from '../../public/mrpl-logo.png';

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

const EMOJIS = ['🎉', '🥳', '🎊', '🇮🇳', '🏆', '🚀', '✨', '🧪', '💡', '🔥', '👏', '💥'];
const CONFETTI_COLORS = ['#FF9933', '#138808', '#5C822D', '#FFD700', '#FFFFFF', '#C96B32', '#00A3E0', '#EC008C'];

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
  emoji?: string;
}

export function InstitutionalFooter() {
  const [easterEggOpen, setEasterEggOpen] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  const launchConfettiCannon = useCallback(() => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const newParticles: Particle[] = [];

    // Confetti Ribbons / Flakes (120 particles)
    for (let i = 0; i < 140; i++) {
      const fromLeft = Math.random() < 0.5;
      const originX = fromLeft ? width * 0.15 : width * 0.85;
      const angle = fromLeft 
        ? -Math.PI / 4 + (Math.random() * 0.6 - 0.3)
        : -3 * Math.PI / 4 + (Math.random() * 0.6 - 0.3);
      const speed = 14 + Math.random() * 22;

      newParticles.push({
        x: originX,
        y: height * 0.85,
        vx: Math.cos(angle) * speed + (Math.random() * 6 - 3),
        vy: Math.sin(angle) * speed - Math.random() * 6,
        size: 8 + Math.random() * 10,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.08 + Math.random() * 0.08,
        opacity: 1,
        decay: 0.006 + Math.random() * 0.005,
        isEmoji: false,
      });
    }

    // Party Emojis Bursting Everywhere (36 emojis)
    for (let i = 0; i < 36; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 8 + Math.random() * 16;
      newParticles.push({
        x: width * 0.5 + (Math.random() * 200 - 100),
        y: height * 0.5 + (Math.random() * 100 - 50),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 6,
        size: 28 + Math.random() * 20,
        color: '#FFFFFF',
        rotation: (Math.random() - 0.5) * 0.4,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        wobble: 0,
        wobbleSpeed: 0,
        opacity: 1,
        decay: 0.005 + Math.random() * 0.004,
        isEmoji: true,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];
  }, []);

  const triggerCelebration = useCallback(() => {
    setCelebrating(true);
    launchConfettiCannon();
    // Second burst after 350ms for cascade effect
    setTimeout(() => {
      launchConfettiCannon();
    }, 350);
  }, [launchConfettiCannon]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'h' || e.key === 'H') && (e.shiftKey || e.metaKey || e.ctrlKey)) {
        setEasterEggOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Animation Loop for Fullscreen Canvas
  useEffect(() => {
    if (!celebrating) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let active = true;

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const animate = () => {
      if (!active || !canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gravity = 0.45;
      const airDrag = 0.985;
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

        if (p.opacity <= 0 || p.y > canvas.height + 100) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.isEmoji && p.emoji) {
          ctx.font = `${p.size}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.emoji, 0, 0);
        } else {
          ctx.fillStyle = p.color;
          const wobbleScale = Math.cos(p.wobble);
          ctx.scale(1, wobbleScale);
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
        }

        ctx.restore();
      }

      if (particles.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCelebrating(false);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      active = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [celebrating]);

  return (
    <footer className="bg-[#263026] text-white/85 border-t border-[#E7E5DE] text-[13px] mt-12">
      
      {/* FULLSCREEN CELEBRATION OVERLAY & CANVAS */}
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none z-[100] transition-opacity duration-300 ${
          celebrating ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 4-Column Directory Grid (Max Width 1200px) */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Column 1: Official MRPL Identity with Logo */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-11 flex-shrink-0 flex items-center justify-center bg-white rounded-lg p-1 border border-white/20 shadow-xs">
              <Image 
                src={mrplLogo} 
                alt="ONGC MRPL Logo" 
                className="h-9 w-auto object-contain rounded-md"
              />
            </div>
            <div>
              <span className="font-bold text-white text-[14px] block leading-tight">MRPL HSE Directorate</span>
              <span className="text-[12px] text-white/70 block">A Subsidiary of ONGC Limited</span>
            </div>
          </div>
          <p className="text-[13px] leading-relaxed text-white/70">
            Mangalore Refinery and Petrochemicals Limited<br />
            Post Kuthethur, Via Katipalla,<br />
            Mangaluru, Karnataka — 575030
          </p>
          <div className="text-[12px] text-[#A7D7C1] font-mono">
            Refinery Complex: Zone A Gas Surveillance
          </div>
        </div>

        {/* Column 2: Chemical & Metrology Specifications */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-[12px]">
            Metrology & Substrate Specs
          </h4>
          <ul className="space-y-1.5 text-[13px] text-white/75 list-disc list-inside">
            <li><strong>Active Substrate:</strong> Copper-PAN & Bismuth(III)</li>
            <li><strong>Reaction:</strong> Cu-PAN/Bi³⁺ + H₂S → CuS/Bi₂S₃↓</li>
            <li><strong>Calibration Space:</strong> CIE Standard D65</li>
            <li><strong>Formulation:</strong> CIE76 Euclidean ΔE*ab</li>
            <li><strong>Linear Domain:</strong> 0.0 – 30.0 ppm·h</li>
          </ul>
        </div>

        {/* Column 3: Regulatory Exposure Limits */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-[12px]">
            Occupational Thresholds
          </h4>
          <ul className="space-y-1.5 text-[13px] text-white/75">
            <li><strong>OSHA 8h TWA:</strong> 10 ppm (Permissible Limit)</li>
            <li><strong>OSHA Ceiling:</strong> 20 ppm (Critical Action)</li>
            <li><strong>NIOSH REL:</strong> 10 ppm / 10-min Peak</li>
            <li><strong>ACGIH TLV:</strong> 1 ppm TWA / 5 ppm STEL</li>
            <li><strong>Shift Duration:</strong> Standard 8.0 Hours</li>
          </ul>
        </div>

        {/* Column 4: Emergency Contacts & Helplines */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-[12px] flex items-center gap-1.5">
            <PhoneCall size={14} className="text-[#C8DEC0]" />
            <span>Emergency & Helplines</span>
          </h4>
          <div className="space-y-1.5 text-[13px] text-white/75">
            <div>Fire & Gas Control: <strong className="text-white">Ext. 2222 / 2333</strong></div>
            <div>Occupational Health (OHC): <strong className="text-white">Ext. 2444</strong></div>
            <div>Safety Control Room: <strong className="text-white">+91 (0824) 2270400</strong></div>
            <div>Shift Safety In-Charge: <strong className="text-[#A7D7C1]">Channel 1 (VHF)</strong></div>
          </div>
        </div>

      </div>

      {/* Bottom Compliance & Policy Bar with Center-Aligned Easter Egg Pill */}
      <div className="bg-[#1C241C] border-t border-white/10 px-4 sm:px-8 py-5 text-[12px] text-white/60 space-y-4">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          
          <div className="space-y-0.5">
            <p>© 2026 Mangalore Refinery and Petrochemicals Limited (MRPL) · ONGC Group Company.</p>
            <p className="text-[11px] text-white/40">
              Platform Version 0.1.0 · ISO 9001 / ISO 14001 / ISO 45001 Certified System
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[12px]">
            <Link href="/hse/technical" className="hover:text-white transition-colors">
              Metrology Audit
            </Link>
            <span>•</span>
            <Link href="/hse/exposure" className="hover:text-white transition-colors">
              Compliance Reports
            </Link>
            <span>•</span>
            <span className="text-[#A7D7C1] flex items-center gap-1">
              <CheckCircle2 size={13} />
              <span>GIGW & WCAG 2.1 AA Compliant</span>
            </span>
          </div>

        </div>

        {/* Center-Aligned Easter Egg Trigger Pill at the Very End */}
        <div className="max-w-[1200px] mx-auto pt-3 border-t border-white/10 flex items-center justify-center">
          <button
            onClick={() => {
              setEasterEggOpen(true);
              triggerCelebration();
            }}
            className="group inline-flex items-center gap-2 text-[11px] text-[#A7D7C1] hover:text-white bg-white/5 hover:bg-white/15 px-4 py-1.5 rounded-full border border-white/10 hover:border-[#A7D7C1] transition-all cursor-pointer shadow-xs hover:shadow-sm"
            title="Click to reveal Hackathon 2026 Engineering Directorate Dossier (or press Shift+H)"
          >
            <Sparkles size={13} className="text-[#FF9933] group-hover:rotate-12 transition-transform animate-pulse" />
            <span className="font-semibold tracking-wide">
              Hackathon Project 2026 by Aaryan Dhamankar, Arya Modh, Avani Abhyankar, Aarushi Jha, Payas Pawar, Sudnya Irranna
            </span>
            <span className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded-full font-mono uppercase font-bold">
              Explore ✨
            </span>
          </button>
        </div>
      </div>

      {/* EASTER EGG MODAL: Hackathon 2026 Engineering Directorate */}
      {easterEggOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAFBF9] text-[#263026] rounded-xl max-w-2xl w-full shadow-2xl border-2 border-[#5C822D] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Indian Tricolor Ribbon Top Bar */}
            <div className="tricolor-ribbon h-1.5 w-full flex">
              <div className="flex-1 bg-[#FF9933]" />
              <div className="flex-1 bg-[#FFFFFF]" />
              <div className="flex-1 bg-[#138808]" />
            </div>

            {/* Modal Header */}
            <div className="p-6 bg-white border-b border-[#E7E5DE] flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#EEF3E7] border border-[#C8DEC0] flex items-center justify-center text-[#5C822D] shadow-2xs">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#5C822D] uppercase tracking-wider font-mono">
                      SPECIAL COMMENDATION · HACKATHON 2026
                    </span>
                  </div>
                  <h3 className="text-[20px] font-bold text-[#263026]">
                    H₂S Gas Dosimetry Innovation Directorate
                  </h3>
                  <p className="text-[13px] text-[#596158]">
                    Wearable Passive Colorimetric Chemosensor & Optical Telemetry Platform
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEasterEggOpen(false)}
                className="text-[#7A8178] hover:text-[#263026] p-1.5 rounded-md hover:bg-[#F0EFE9] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Team Members Grid */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              <div className="text-[12px] font-bold uppercase tracking-wider text-[#7A8178] flex items-center justify-between">
                <span>Core Project Team (6 Leads)</span>
                <span className="text-[#5C822D] font-mono">MRPL INVENT-2026</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TEAM_MEMBERS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <div 
                      key={m.name}
                      className="p-3.5 bg-white rounded-lg border border-[#E7E5DE] hover:border-[#5C822D] hover:shadow-xs transition-all space-y-1.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded bg-[#EEF3E7] text-[#5C822D] flex items-center justify-center flex-shrink-0 group-hover:bg-[#5C822D] group-hover:text-white transition-colors">
                            <Icon size={15} />
                          </div>
                          <div>
                            <div className="font-bold text-[14px] text-[#263026] group-hover:text-[#5C822D] leading-tight">
                              {m.name}
                            </div>
                            <div className="text-[11px] text-[#7A8178] font-mono">{m.code}</div>
                          </div>
                        </div>

                        <span className="gov-badge gov-badge-normal text-[9px] py-0.5 px-2">
                          {m.badge}
                        </span>
                      </div>

                      <div className="text-[12px] font-semibold text-[#35551F] pt-0.5">
                        {m.role}
                      </div>

                      <div className="text-[11px] text-[#596158] bg-[#FAFBF9] p-2 rounded border border-[#E7E5DE] font-mono">
                        💡 {m.highlight}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Scientific System Badge */}
              <div className="p-4 bg-[#EEF3E7] rounded-lg border border-[#C8DEC0] text-[12px] space-y-1 text-[#35551F]">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-[#5C822D]" />
                  <span>Validated Innovation Principles</span>
                </div>
                <p className="opacity-90">
                  Lead-free optical chemosensing (Copper-PAN & Bismuth matrix) · Bradford Chromatic Normalization under ISO/CIE D65 · Deterministic Edge Inference.
                </p>
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="p-4 bg-white border-t border-[#E7E5DE] flex items-center justify-between text-[12px]">
              <div className="text-[#7A8178]">
                {celebrating ? (
                  <span className="text-[#5C822D] font-bold animate-pulse flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#FF9933]" />
                    <span>🎉 Celebrating the 2026 Hackathon Team!</span>
                  </span>
                ) : (
                  <span>Created for National Gas Safety & Public-Sector Excellence</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={triggerCelebration}
                  className="gov-btn-primary text-[12px] h-8 px-3 font-semibold flex items-center gap-1.5 shadow-xs hover:shadow-sm"
                >
                  <span className="text-[14px]">🥳</span>
                  <span>Celebrate Team</span>
                </button>

                <button
                  onClick={() => setEasterEggOpen(false)}
                  className="gov-btn-secondary text-[12px] h-8 px-3"
                >
                  <span>Close</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </footer>
  );
}
