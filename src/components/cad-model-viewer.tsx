'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  RotateCw, 
  Maximize2, 
  AlertCircle,
  Download,
  Camera,
  Compass,
  Minimize2,
  RefreshCw,
  Eye,
  Disc,
  Target
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

interface ModelViewerElement extends HTMLElement {
  src?: string;
  cameraOrbit?: string;
  cameraTarget?: string;
  fieldOfView?: string;
  autoRotate?: boolean;
  autoRotateDelay?: number;
  rotationPerSecond?: string;
  exposure?: number;
  shadowIntensity?: number;
  shadowSoftness?: number;
  environmentImage?: string;
  toDataURL?: (type?: string, quality?: number) => string;
  jumpCameraToGoal?: () => void;
}

interface CADModelViewerProps {
  selectedDose?: number;
  onDoseChange?: (dose: number) => void;
}

type CameraPreset = 'perspective' | 'top' | 'front' | 'macro';

const PRESET_CONFIGS: Record<CameraPreset, { orbit: string; target: string; fov: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  perspective: {
    orbit: '39deg 60deg 2.29m',
    target: '0.027m 0.255m 0.038m',
    fov: '30deg',
    label: 'Perspective',
    icon: Compass,
  },
  top: {
    orbit: '0deg 0deg 2.29m',
    target: '0.027m 0.255m 0.038m',
    fov: '30deg',
    label: 'Top',
    icon: Disc,
  },
  front: {
    orbit: '0deg 85deg 2.29m',
    target: '0.027m 0.255m 0.038m',
    fov: '30deg',
    label: 'Front',
    icon: Eye,
  },
  macro: {
    orbit: '38deg 91deg 1.92m',
    target: '0.027m 0.255m 0.038m',
    fov: '21deg',
    label: 'Macro',
    icon: Target,
  },
};

export function CADModelViewer({}: CADModelViewerProps = {}) {
  const { language } = useAppStore();

  // Container & Model-Viewer Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<ModelViewerElement | null>(null);

  // Model & State
  const [glbUrl, setGlbUrl] = useState<string>('/models/band_cad.glb');
  const [modelLoading, setModelLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [glbLoadError, setGlbLoadError] = useState<string | null>(null);
  const [modelViewerReady, setModelViewerReady] = useState<boolean>(false);

  // Controls & Camera State (Default: Perspective, spinning, calibrated coordinates)
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('perspective');
  const [cameraOrbit, setCameraOrbit] = useState<string>(PRESET_CONFIGS.perspective.orbit);
  const [cameraTarget, setCameraTarget] = useState<string>(PRESET_CONFIGS.perspective.target);
  const [fieldOfView, setFieldOfView] = useState<string>(PRESET_CONFIGS.perspective.fov);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // 1. Dynamic Script Loading for Google Model-Viewer
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (customElements.get('model-viewer')) {
        setModelViewerReady(true);
      } else {
        const existingScript = document.getElementById('google-model-viewer-script');
        if (!existingScript) {
          const script = document.createElement('script');
          script.id = 'google-model-viewer-script';
          script.type = 'module';
          script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js';
          script.async = true;
          script.onload = () => setModelViewerReady(true);
          document.head.appendChild(script);
        } else {
          existingScript.addEventListener('load', () => setModelViewerReady(true));
        }
      }
    }
  }, []);

  // 2. Verify and resolve GLB model path
  useEffect(() => {
    let isMounted = true;
    const verifyGlb = async () => {
      try {
        const primaryRes = await fetch('/models/band_cad.glb', { method: 'HEAD' });
        if (primaryRes.ok && isMounted) {
          setGlbUrl('/models/band_cad.glb');
          return;
        }
        const fallbackRes = await fetch('/models/dosimeter-wristband.glb', { method: 'HEAD' });
        if (fallbackRes.ok && isMounted) {
          setGlbUrl('/models/dosimeter-wristband.glb');
        }
      } catch {
        // Continue with default glbUrl
      }
    };
    verifyGlb();
    return () => { isMounted = false; };
  }, []);

  // 3. Attach progress & load listeners to model-viewer
  useEffect(() => {
    const mv = modelViewerRef.current;
    if (!mv) return;

    const onProgress = (event: Event) => {
      const customEvent = event as CustomEvent<{ totalProgress: number }>;
      const progress = Math.round((customEvent.detail?.totalProgress || 0) * 100);
      setLoadingProgress(progress);
    };

    const onLoad = () => {
      setModelLoading(false);
      setLoadingProgress(100);
      setGlbLoadError(null);
    };

    const onError = () => {
      setModelLoading(false);
      setGlbLoadError('Failed to load 3D CAD model file.');
    };

    mv.addEventListener('progress', onProgress);
    mv.addEventListener('load', onLoad);
    mv.addEventListener('error', onError);

    return () => {
      mv.removeEventListener('progress', onProgress);
      mv.removeEventListener('load', onLoad);
      mv.removeEventListener('error', onError);
    };
  }, [modelViewerReady, glbUrl]);

  // Camera Orbit Presets Handler
  const handleCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const config = PRESET_CONFIGS[preset];

    setCameraOrbit(config.orbit);
    setCameraTarget(config.target);
    setFieldOfView(config.fov);

    const mv = modelViewerRef.current;
    if (mv) {
      mv.cameraTarget = config.target;
      mv.cameraOrbit = config.orbit;
      mv.fieldOfView = config.fov;
    }
  };

  // Snapshot Capture Handler
  const handleCaptureSnapshot = () => {
    const mv = modelViewerRef.current;
    if (mv && mv.toDataURL) {
      const dataUrl = mv.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `MRPL-Dosimeter-CAD-${new Date().toISOString().slice(0, 10)}.png`;
      a.click();
    }
  };

  // Fullscreen Toggle Handler
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const cadTitle = language === 'hi'
    ? '3D CAD मॉडल व्यूअर'
    : language === 'kn'
    ? '3D CAD ಮಾದರಿ ವೀಕ್ಷಕ'
    : language === 'gu'
    ? '3D CAD મોડેલ દર્શક'
    : '3D CAD Model Viewer';

  return (
    <div ref={containerRef} className="gov-card p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-[#E8E2D5] bg-white space-y-2.5 sm:space-y-3 shadow-2xs">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E2D5] pb-2.5">
        <div>
          <h2 className="text-[14px] sm:text-[16px] font-bold text-[#263026] flex items-center gap-1.5">
            <Box className="w-4 h-4 text-[#5C822D] flex-shrink-0" /> {cadTitle}
          </h2>
          <p className="text-[10px] sm:text-[12px] text-[#596158] mt-0.5">
            {language === 'hi'
              ? 'इंटरैक्टिव 3D CAD व्यूअर · घुमाने के लिए ड्रैग करें, ज़ूम करने के लिए पिंच/स्क्रॉल करें'
              : 'Interactive 3D CAD viewer · Drag to rotate, scroll/pinch to zoom, and switch camera angles'}
          </p>
        </div>

        <div className="self-start sm:self-auto flex items-center">
          <a
            href={glbUrl}
            download="dosimeter-band-cad.glb"
            className="bg-[#FAF7F0] hover:bg-[#F4EFE6] text-[#263026] text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-md border border-[#E8E2D5] shadow-2xs flex items-center gap-1 transition-all cursor-pointer"
            title="Download 3D CAD Model"
          >
            <Download size={12} className="text-[#5C822D]" />
            <span>Download .glb</span>
          </a>
        </div>
      </div>

      {/* 3D CAD Viewport Window */}
      <div className="relative bg-gradient-to-b from-[#FAF7F0] to-[#F2ECE0] border border-[#E8E2D5] rounded-xl overflow-hidden shadow-inner flex flex-col items-center justify-center min-h-[300px] sm:min-h-[440px]">
        
        {/* Top Floating Controls Bar */}
        <div className="absolute top-2 left-2 right-2 z-20 flex items-center justify-between gap-1.5 pointer-events-none">
          
          {/* Camera Presets: Perspective, Top, Front, Macro (Icons on mobile, Icon + Label on desktop) */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-white/90 backdrop-blur-md p-1 rounded-lg border border-[#E8E2D5] shadow-xs pointer-events-auto text-[10px] sm:text-[11px] overflow-x-auto max-w-[calc(100%-110px)] sm:max-w-none no-scrollbar">
            {(['perspective', 'top', 'front', 'macro'] as CameraPreset[]).map(presetKey => {
              const cfg = PRESET_CONFIGS[presetKey];
              const IconComponent = cfg.icon;
              const isActive = cameraPreset === presetKey;

              return (
                <button
                  key={presetKey}
                  onClick={() => handleCameraPreset(presetKey)}
                  title={cfg.label}
                  className={`p-1.5 sm:px-2 sm:py-0.5 rounded font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#5C822D] text-white shadow-2xs'
                      : 'text-[#596158] hover:text-[#263026] hover:bg-[#F4EFE6]'
                  }`}
                >
                  <IconComponent size={14} className="flex-shrink-0" />
                  <span className="hidden sm:inline whitespace-nowrap">{cfg.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-white/90 backdrop-blur-md p-1 rounded-lg border border-[#E8E2D5] shadow-xs pointer-events-auto text-[#596158] flex-shrink-0">
            
            {/* Auto Rotate Button */}
            <button
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              className={`p-1 sm:p-1.5 rounded transition-colors cursor-pointer ${
                isAutoRotate ? 'text-[#5C822D] bg-[#EDF3E4]' : 'text-[#7A8178] hover:bg-[#F4EFE6]'
              }`}
              title={isAutoRotate ? 'Pause Auto Rotation' : 'Resume Auto Rotation'}
            >
              <RotateCw size={13} className={isAutoRotate ? 'animate-spin' : ''} style={{ animationDuration: '8s' }} />
            </button>

            {/* Reset Camera View */}
            <button
              onClick={() => handleCameraPreset('perspective')}
              className="p-1 sm:p-1.5 text-[#596158] hover:text-[#263026] hover:bg-[#F4EFE6] rounded transition-colors cursor-pointer"
              title="Reset View"
            >
              <RefreshCw size={13} />
            </button>

            {/* Snapshot */}
            <button
              onClick={handleCaptureSnapshot}
              className="p-1 sm:p-1.5 text-[#596158] hover:text-[#263026] hover:bg-[#F4EFE6] rounded transition-colors cursor-pointer"
              title="Export Snapshot PNG"
            >
              <Camera size={13} />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={handleToggleFullscreen}
              className="p-1 sm:p-1.5 text-[#596158] hover:text-[#263026] hover:bg-[#F4EFE6] rounded transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
          </div>
        </div>

        {/* Loading Progress */}
        {modelLoading && (
          <div className="absolute inset-0 z-10 bg-white/75 backdrop-blur-xs flex flex-col items-center justify-center p-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-3 border-[#5C822D]/20 border-t-[#5C822D] animate-spin mb-2" />
            <span className="text-[12px] sm:text-[13px] font-bold text-[#263026]">Loading 3D CAD Model...</span>
            <span className="text-[10px] sm:text-[11px] text-[#596158] font-mono mt-0.5">
              {loadingProgress > 0 ? `${loadingProgress}% loaded (29.4 MB)` : 'Initializing WebGL viewport...'}
            </span>
            <div className="w-40 sm:w-44 bg-[#E8E2D5] h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-[#5C822D] h-full transition-all duration-200 rounded-full" 
                style={{ width: `${Math.max(10, loadingProgress)}%` }} 
              />
            </div>
          </div>
        )}

        {/* 3D Model Viewer */}
        <div className="w-full h-[300px] sm:h-[440px] relative">
          <model-viewer
            ref={modelViewerRef}
            src={glbUrl}
            alt="MRPL H2S Dosimeter Band 3D CAD Model"
            camera-controls
            auto-rotate={isAutoRotate ? true : undefined}
            auto-rotate-delay={1000}
            rotation-per-second="20deg"
            camera-orbit={cameraOrbit}
            camera-target={cameraTarget}
            field-of-view={fieldOfView}
            shadow-intensity="1.2"
            shadow-softness="0.8"
            exposure="1.0"
            interaction-prompt="none"
            style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
          />
        </div>

        {/* Bottom Interaction Guide */}
        <div className="absolute bottom-2 left-2 z-20 pointer-events-none text-[9px] sm:text-[11px] text-[#7A8178]">
          <div className="bg-white/85 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-[#E8E2D5] pointer-events-auto">
            <span>🖱️ {language === 'hi' ? 'घुमाने के लिए ड्रैग करें · ज़ूम के लिए पिंच/स्क्रॉल' : 'Drag to rotate 3D · Pinch / Scroll to zoom'}</span>
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

    </div>
  );
}

