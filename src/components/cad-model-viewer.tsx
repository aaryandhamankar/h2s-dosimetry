'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Upload, 
  FileCode,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { TRANSLATIONS } from '@/lib/i18n';

interface CADModelViewerProps {
  selectedDose: number;
  onDoseChange?: (dose: number) => void;
}

type ViewMode = 'solid' | 'wireframe' | 'exploded';

export function CADModelViewer({ selectedDose, onDoseChange }: CADModelViewerProps) {
  const { language } = useAppStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // 3D Canvas & State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: 22, y: -35 });
  const [zoom, setZoom] = useState<number>(1.1);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>('solid');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);

  // GLB Model Loading
  const [glbUrl, setGlbUrl] = useState<string | null>(null);
  const [glbLoadError, setGlbLoadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if default .glb exists in public folder
  useEffect(() => {
    let isMounted = true;
    const checkDefaultGlb = async () => {
      try {
        const res = await fetch('/models/dosimeter-wristband.glb', { method: 'HEAD' });
        if (res.ok && isMounted) {
          setGlbUrl('/models/dosimeter-wristband.glb');
        } else {
          const fallbackRes = await fetch('/models/model.glb', { method: 'HEAD' });
          if (fallbackRes.ok && isMounted) {
            setGlbUrl('/models/model.glb');
          }
        }
      } catch {
        // No local file found yet, will use interactive CAD simulation
      }
    };
    checkDefaultGlb();
    return () => { isMounted = false; };
  }, []);

  // Dynamically load @google/model-viewer script when a .glb is detected
  useEffect(() => {
    if (glbUrl && typeof window !== 'undefined' && !customElements.get('model-viewer')) {
      if (!document.getElementById('google-model-viewer-script')) {
        const script = document.createElement('script');
        script.id = 'google-model-viewer-script';
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js';
        script.async = true;
        document.head.appendChild(script);
      }
    }
  }, [glbUrl]);

  // Handle local GLB upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.glb') || file.name.endsWith('.gltf')) {
        const url = URL.createObjectURL(file);
        setGlbUrl(url);
        setGlbLoadError(null);
      } else {
        setGlbLoadError('Please select a valid .glb or .gltf 3D file.');
      }
    }
  };

  const getDotColorRGB = useCallback((dose: number) => {
    if (dose <= 4) return { r: 244, g: 236, b: 225 }; // Unexposed pale neutral
    if (dose <= 12) return { r: 191, g: 159, b: 128 }; // Light tan brown CuS / Bi2S3
    if (dose <= 18) return { r: 135, g: 96, b: 67 };  // Medium brown sulfide
    return { r: 58, g: 34, b: 20 };                  // Deep dark brown Bismuth Sulfide
  }, []);

  // 3D Canvas Rendering Pipeline (Perspective Projection & Shading)
  useEffect(() => {
    if (glbUrl) return; // If .glb is loaded, model-viewer handles 3D

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localRotationY = rotation.y;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Auto-rotation increment
      if (isAutoRotate && !isDragging) {
        localRotationY = (localRotationY + 0.4) % 360;
      }

      const radX = (rotation.x * Math.PI) / 180;
      const radY = (localRotationY * Math.PI) / 180;

      // 3D Rotation Matrix
      const cosX = Math.cos(radX);
      const sinX = Math.sin(radX);
      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);

      const cx = width / 2;
      const cy = height / 2;
      const scale = (Math.min(width, height) / 300) * zoom * 70;
      const fov = 400;

      // Project 3D point (x, y, z) to 2D screen coordinates
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;

        // Rotate around X
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX + 300;

        const pScale = fov / (fov + z2);
        return {
          x: cx + x1 * scale * pScale * 0.03,
          y: cy + y2 * scale * pScale * 0.03,
          z: z2,
          scale: pScale,
        };
      };

      // 1. Draw CAD Ground Grid & Datum Lines
      ctx.save();
      ctx.strokeStyle = '#E8E2D5';
      ctx.lineWidth = 1;
      const gridStep = 40;
      const gridCount = 4;
      for (let i = -gridCount; i <= gridCount; i++) {
        const p1 = project(i * gridStep, 45, -gridCount * gridStep);
        const p2 = project(i * gridStep, 45, gridCount * gridStep);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        const p3 = project(-gridCount * gridStep, 45, i * gridStep);
        const p4 = project(gridCount * gridStep, 45, i * gridStep);
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }
      ctx.restore();

      // Exploded View offsets
      const strapOffset = viewMode === 'exploded' ? 50 : 0;
      const podOffset = viewMode === 'exploded' ? -25 : 0;
      const cartOffset = viewMode === 'exploded' ? -65 : 0;

      // 2. Draw Wristband Straps (Left and Right)
      const drawStrap = (side: 'left' | 'right') => {
        const mult = side === 'left' ? -1 : 1;
        const xStart = mult * (55 + strapOffset);
        const xEnd = mult * (160 + strapOffset);

        const corners = [
          { x: xStart, y: -18, z: -25 },
          { x: xEnd, y: -18, z: -20 },
          { x: xEnd, y: 18, z: -20 },
          { x: xStart, y: 18, z: -25 },
          { x: xStart, y: -18, z: 25 },
          { x: xEnd, y: -18, z: 20 },
          { x: xEnd, y: 18, z: 20 },
          { x: xStart, y: 18, z: 25 },
        ];

        const proj = corners.map(c => project(c.x, c.y, c.z));

        const faces = [
          [0, 1, 2, 3], // Front
          [4, 5, 6, 7], // Back
          [0, 1, 5, 4], // Top
          [2, 3, 7, 6], // Bottom
          [0, 3, 7, 4], // Inner
          [1, 2, 6, 5], // Outer
        ];

        faces.forEach((face, idx) => {
          ctx.beginPath();
          ctx.moveTo(proj[face[0]].x, proj[face[0]].y);
          for (let i = 1; i < face.length; i++) {
            ctx.lineTo(proj[face[i]].x, proj[face[i]].y);
          }
          ctx.closePath();

          if (viewMode === 'wireframe') {
            ctx.strokeStyle = '#5C822D';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          } else {
            const shade = 35 + idx * 8;
            ctx.fillStyle = `rgb(${shade}, ${shade + 10}, ${shade})`;
            ctx.fill();
            ctx.strokeStyle = '#1C241C';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      };

      drawStrap('left');
      drawStrap('right');

      // 3. Central Sensor Pod Enclosure
      const podW = 55;
      const podH = 22;
      const podD = 40;
      const podCorners = [
        { x: -podW, y: -podH + podOffset, z: -podD },
        { x: podW, y: -podH + podOffset, z: -podD },
        { x: podW, y: podH + podOffset, z: -podD },
        { x: -podW, y: podH + podOffset, z: -podD },
        { x: -podW, y: -podH + podOffset, z: podD },
        { x: podW, y: -podH + podOffset, z: podD },
        { x: podW, y: podH + podOffset, z: podD },
        { x: -podW, y: podH + podOffset, z: podD },
      ];

      const podProj = podCorners.map(c => project(c.x, c.y, c.z));
      const podFaces = [
        [0, 1, 2, 3], // Front
        [4, 5, 6, 7], // Back
        [0, 1, 5, 4], // Top (Sensor Face)
        [2, 3, 7, 6], // Bottom
        [0, 3, 7, 4], // Left
        [1, 2, 6, 5], // Right
      ];

      podFaces.forEach((face, idx) => {
        ctx.beginPath();
        ctx.moveTo(podProj[face[0]].x, podProj[face[0]].y);
        for (let i = 1; i < face.length; i++) {
          ctx.lineTo(podProj[face[i]].x, podProj[face[i]].y);
        }
        ctx.closePath();

        if (viewMode === 'wireframe') {
          ctx.strokeStyle = '#263026';
          ctx.lineWidth = 1.4;
          ctx.stroke();
        } else {
          if (idx === 2) {
            ctx.fillStyle = '#FAF7F0'; // Top face
          } else {
            const tone = 230 - idx * 8;
            ctx.fillStyle = `rgb(${tone}, ${tone - 4}, ${tone - 10})`;
          }
          ctx.fill();
          ctx.strokeStyle = '#D8D0C0';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });

      // 4. Draw 4-Patch Reference Calibration Targets on Top Face
      const patchY = -podH + cartOffset - 1;
      const patches = [
        { x: -35, color: '#FFFFFF', name: 'W' },
        { x: -15, color: '#7F7F7F', name: 'G' },
        { x: 15, color: '#00A3E0', name: 'C' },
        { x: 35, color: '#EC008C', name: 'M' },
      ];

      patches.forEach(p => {
        const pw = 7;
        const pd = 5;
        const pz = -22;
        const pCorners = [
          project(p.x - pw, patchY, pz - pd),
          project(p.x + pw, patchY, pz - pd),
          project(p.x + pw, patchY, pz + pd),
          project(p.x - pw, patchY, pz + pd),
        ];

        ctx.beginPath();
        ctx.moveTo(pCorners[0].x, pCorners[0].y);
        pCorners.forEach(pt => ctx.lineTo(pt.x, pt.y));
        ctx.closePath();
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.strokeStyle = '#A09888';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // 5. Chemosensor Chemical Dot Matrix (Reacts dynamically to dose)
      const dotColor = getDotColorRGB(selectedDose);
      const dotRadius = 16;
      const dotSegments = 16;

      ctx.beginPath();
      for (let i = 0; i <= dotSegments; i++) {
        const angle = (i / dotSegments) * Math.PI * 2;
        const dx = Math.cos(angle) * dotRadius;
        const dz = Math.sin(angle) * dotRadius;
        const pt = project(dx, patchY, 10 + dz);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();

      if (viewMode === 'wireframe') {
        ctx.strokeStyle = '#B8860B';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgb(${dotColor.r}, ${dotColor.g}, ${dotColor.b})`;
        ctx.fill();
        ctx.strokeStyle = '#596158';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 6. CAD Dimension Annotations
      if (viewMode !== 'exploded') {
        ctx.save();
        ctx.font = '10px monospace';
        ctx.fillStyle = '#7A8178';
        ctx.strokeStyle = '#7A8178';
        ctx.lineWidth = 0.7;

        // Width label
        const w1 = project(-podW, -podH - 12, -podD);
        const w2 = project(podW, -podH - 12, -podD);
        ctx.beginPath();
        ctx.moveTo(w1.x, w1.y);
        ctx.lineTo(w2.x, w2.y);
        ctx.stroke();
        ctx.fillText('42.0 mm', (w1.x + w2.x) / 2 - 20, (w1.y + w2.y) / 2 - 4);
        ctx.restore();
      }

      // Continue animation loop
      if (isAutoRotate && !isDragging) {
        animFrameId.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [rotation, zoom, isAutoRotate, viewMode, isDragging, selectedDose, glbUrl, getDotColorRGB]);

  // Touch / Mouse Orbit Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoRotate(false);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setRotation(prev => ({
      x: Math.max(-60, Math.min(60, prev.x + deltaY * 0.5)),
      y: (prev.y + deltaX * 0.6) % 360,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setIsAutoRotate(false);
      lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - lastMousePos.current.x;
    const deltaY = e.touches[0].clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    setRotation(prev => ({
      x: Math.max(-60, Math.min(60, prev.x + deltaY * 0.5)),
      y: (prev.y + deltaX * 0.6) % 360,
    }));
  };

  const handleResetCamera = () => {
    setRotation({ x: 22, y: -35 });
    setZoom(1.1);
    setIsAutoRotate(true);
  };

  const cadTitle = language === 'hi'
    ? '3D CAD सिमुलेशन और हार्डवेयर'
    : language === 'kn'
    ? '3D CAD ಸಿಮ್ಯುಲೇಶನ್ & ಹಾರ್ಡ್‌ವೇರ್'
    : language === 'gu'
    ? '3D CAD સિમ્યુલેશન અને હાર્ડવેર'
    : '3D CAD Simulation & Hardware';

  const placeholderBadge = language === 'hi'
    ? 'CAD सिमुलेशन'
    : language === 'kn'
    ? 'CAD ಸಿಮ್ಯುಲೇಶನ್'
    : language === 'gu'
    ? 'CAD સિમ્યુલેશન'
    : 'CAD Simulation';

  return (
    <div className="gov-card p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-[#E8E2D5] bg-white space-y-3 shadow-2xs">
      
      {/* Header & Simulator Pill Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#E8E2D5] pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="gov-badge gov-badge-normal text-[10px] sm:text-[11px] font-bold font-mono py-0.5 px-2">
              {placeholderBadge}
            </span>
            <h2 className="text-[15px] sm:text-[16px] font-bold text-[#263026] flex items-center gap-1.5">
              <Box className="w-4 h-4 text-[#5C822D]" /> {cadTitle}
            </h2>
          </div>
          <p className="text-[11px] sm:text-[12px] text-[#596158] mt-0.5">
            {language === 'hi'
              ? '.glb 3D CAD मॉडल समर्थन · इंटरैक्टिव वियरेबल बैंड एन्क्लोज़र'
              : language === 'kn'
              ? '.glb 3D CAD ಮಾದರಿ ಬೆಂಬಲ · ಸಂವಾದಾತ್ಮಕ ಧರಿಸಬಹುದಾದ ಬ್ಯಾಂಡ್ ಎನ್ಕ್ಲೋಸರ್'
              : language === 'gu'
              ? '.glb 3D CAD મોડેલ સપોર્ટ · ઇન્ટરેક્ટિવ પહેરી શકાય તેવું બેન્ડ એન્ક્લોઝર'
              : '.glb 3D CAD Model Support · Interactive Wearable Band Enclosure'}
          </p>
        </div>

        {/* Exposure Simulator Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-[#7A8178] font-bold mr-0.5">
            {language === 'hi' ? 'अनुकरण:' : language === 'kn' ? 'ಅನುಕರಣೆ:' : language === 'gu' ? 'સિમ્યુલેટ:' : 'Simulate:'}
          </span>
          {[
            { label: t.normalDemo, val: 3.2 },
            { label: t.elevatedDemo, val: 12.4 },
            { label: t.criticalDemo, val: 24.8 },
          ].map(p => (
            <button
              key={p.val}
              onClick={() => onDoseChange?.(p.val)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all min-h-[30px] cursor-pointer ${
                selectedDose === p.val
                  ? 'bg-[#5C822D] text-white shadow-2xs'
                  : 'bg-white border border-[#E8E2D5] text-[#596158] hover:text-[#263026] hover:bg-[#F4EFE6]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D CAD Viewport Window */}
      <div className="relative bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl overflow-hidden shadow-inner flex flex-col items-center justify-center min-h-[280px] sm:min-h-[340px]">
        
        {/* Top Controls Overlay */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
          
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-lg border border-[#E8E2D5] shadow-xs pointer-events-auto text-[11px]">
            <button
              onClick={() => setViewMode('solid')}
              className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                viewMode === 'solid' ? 'bg-[#5C822D] text-white' : 'text-[#596158] hover:bg-[#F4EFE6]'
              }`}
            >
              Solid
            </button>
            <button
              onClick={() => setViewMode('wireframe')}
              className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                viewMode === 'wireframe' ? 'bg-[#5C822D] text-white' : 'text-[#596158] hover:bg-[#F4EFE6]'
              }`}
            >
              Wireframe
            </button>
            <button
              onClick={() => setViewMode('exploded')}
              className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                viewMode === 'exploded' ? 'bg-[#5C822D] text-white' : 'text-[#596158] hover:bg-[#F4EFE6]'
              }`}
            >
              Exploded
            </button>
          </div>

          {/* Quick Toolbar: Auto-rotate, Zoom, Reset */}
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-lg border border-[#E8E2D5] shadow-xs pointer-events-auto">
            <button
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                isAutoRotate ? 'text-[#5C822D] bg-[#EDF3E4]' : 'text-[#7A8178] hover:bg-[#F4EFE6]'
              }`}
              title={isAutoRotate ? 'Pause Rotation' : 'Auto Rotate'}
            >
              <RotateCw size={14} className={isAutoRotate ? 'animate-spin' : ''} style={{ animationDuration: '6s' }} />
            </button>
            <button
              onClick={() => setZoom(z => Math.min(2.2, z + 0.2))}
              className="p-1.5 text-[#596158] hover:text-[#263026] hover:bg-[#F4EFE6] rounded transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => setZoom(z => Math.max(0.6, z - 0.2))}
              className="p-1.5 text-[#596158] hover:text-[#263026] hover:bg-[#F4EFE6] rounded transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={handleResetCamera}
              className="p-1.5 text-[#596158] hover:text-[#263026] hover:bg-[#F4EFE6] rounded transition-colors cursor-pointer"
              title="Reset View"
            >
              <Maximize2 size={14} />
            </button>
          </div>

        </div>

        {/* 3D Rendering Canvas OR Native GLB Model Viewer */}
        {glbUrl ? (
          <div className="w-full h-[320px] sm:h-[380px]">
            {/* @ts-expect-error Custom element model-viewer */}
            <model-viewer
              src={glbUrl}
              alt="H2S Wearable Dosimeter 3D CAD Model"
              camera-controls
              auto-rotate
              shadow-intensity="1"
              exposure="1"
              style={{ width: '100%', height: '100%', backgroundColor: '#FAF7F0' }}
            />
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={640}
            height={360}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className="w-full h-[280px] sm:h-[340px] cursor-grab active:cursor-grabbing touch-none select-none"
          />
        )}

        {/* Bottom Interaction Guide & Specs Overlay */}
        <div className="absolute bottom-2 left-2.5 right-2.5 z-20 flex flex-col sm:flex-row items-center justify-between gap-1.5 pointer-events-none text-[10px] sm:text-[11px] text-[#7A8178]">
          <div className="bg-white/85 backdrop-blur-xs px-2 py-0.5 rounded-md border border-[#E8E2D5] pointer-events-auto">
            <span>🖱️ {language === 'hi' ? 'घुमाने के लिए ड्रैग करें · ज़ूम करने के लिए पिंच/स्क्रॉल' : 'Drag to rotate 3D · Pinch/Scroll to zoom'}</span>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".glb,.gltf"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/90 hover:bg-white text-[#5C822D] font-semibold px-2.5 py-1 rounded-md border border-[#C6DCC0] hover:border-[#5C822D] shadow-2xs flex items-center gap-1 transition-all cursor-pointer"
            >
              <Upload size={12} />
              <span>{glbUrl ? 'Change .glb File' : 'Load .glb Model'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Error Notice */}
      {glbLoadError && (
        <div className="p-2.5 bg-[#FDF2F2] border border-[#F8B4B4] rounded-lg text-[#9B1C1C] text-[11px] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{glbLoadError}</span>
        </div>
      )}

      {/* Model status indicator & Technical Sub-Notes */}
      <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#E8E2D5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-[11px] sm:text-[12px] text-[#596158]">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-[#5C822D] flex-shrink-0" />
          <span>
            {glbUrl ? (
              <strong className="text-[#35551F]">✓ Custom 3D Model Loaded (.glb active)</strong>
            ) : (
              <span>
                <strong>CAD Simulation Ready:</strong> Drop your <code className="text-[#263026] bg-white px-1 py-0.2 rounded border border-[#E8E2D5]">.glb</code> file or place it in <code className="text-[#263026] bg-white px-1 py-0.2 rounded border border-[#E8E2D5]">/public/models/dosimeter-wristband.glb</code>.
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] text-[#7A8178] self-end sm:self-auto">
          <span>Scale: 1:1 Solid Mesh</span>
          <span>·</span>
          <span>Lead-Free Matrix</span>
        </div>
      </div>

    </div>
  );
}
