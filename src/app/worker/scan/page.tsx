'use client';

import { useAppStore } from '@/stores/app-store';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { getScanPipeline } from '@/services/scientific/scan-processing-pipeline';
import { 
  CheckCircle2, 
  Loader2, 
  Camera, 
  ArrowRight,
  ArrowLeft,
  Upload,
  Crosshair,
  RefreshCw,
  VideoOff
} from 'lucide-react';
import { DemoScenario, ProcessingStatus } from '@/types';
import Link from 'next/link';

const scenarios = [
  { 
    id: DemoScenario.NORMAL, 
    title: 'Sample 1: Normal Shift Exposure', 
    dose: '3.2 ppm·h',
    badge: 'NORMAL',
    badgeClass: 'gov-badge-normal',
    colorHex: '#F2EADB',
    deltaE: 'ΔE ≈ 3.0',
    desc: 'Pale cream substrate. Minimal chemical reaction. Safe background level.',
  },
  { 
    id: DemoScenario.ELEVATED, 
    title: 'Sample 2: Elevated Exposure', 
    dose: '12.4 ppm·h',
    badge: 'ELEVATED',
    badgeClass: 'gov-badge-elevated',
    colorHex: '#BFA48A',
    deltaE: 'ΔE ≈ 12.2',
    desc: 'Light brown staining. Moderate CuS / Bi₂S₃ formation. Caution advised.',
  },
  { 
    id: DemoScenario.HIGH, 
    title: 'Sample 3: High Exposure Level', 
    dose: '18.6 ppm·h',
    badge: 'HIGH',
    badgeClass: 'gov-badge-high',
    colorHex: '#8C6D53',
    deltaE: 'ΔE ≈ 20.8',
    desc: 'Medium dark brown. Nearing occupational ceiling threshold (PEL: 10 ppm 8h TWA).',
  },
  { 
    id: DemoScenario.CRITICAL, 
    title: 'Sample 4: Emergency Critical Exposure', 
    dose: '24.8 ppm·h',
    badge: 'CRITICAL',
    badgeClass: 'gov-badge-critical',
    colorHex: '#4A3222',
    deltaE: 'ΔE ≈ 30.6',
    desc: 'Deep dark brown CuS / Bi₂S₃ precipitate. Immediate evacuation required.',
  },
  { 
    id: DemoScenario.INVALID, 
    title: 'Sample 5: Unclear Image / Glare Reflection', 
    dose: 'Unverified',
    badge: 'INVALID',
    badgeClass: 'gov-badge-neutral',
    colorHex: '#E2E8F0',
    deltaE: 'Blur / Glare',
    desc: 'Specular surface glare detected. Optical validation fails safely with null dose.',
  },
  { 
    id: DemoScenario.OUT_OF_RANGE, 
    title: 'Sample 6: Out-of-Range Sensor Reading', 
    dose: 'Out of Bounds',
    badge: 'OUT OF RANGE',
    badgeClass: 'gov-badge-neutral',
    colorHex: '#CBD5E1',
    deltaE: 'ΔE > 40.0',
    desc: 'Saturation beyond 30.0 ppm·h model calibration. Flagged for laboratory GC analysis.',
  },
];

const STAGE_LABELS: Record<ProcessingStatus, string> = {
  [ProcessingStatus.CAPTURED]: 'Photo Captured Successfully',
  [ProcessingStatus.VALIDATING_IMAGE]: '1. Validating Image Sharpness & Glare',
  [ProcessingStatus.DETECTING_DOSIMETER]: '2. Locating Wristband Sensor Boundary',
  [ProcessingStatus.EXTRACTING_ROI]: '3. Extracting 4-Patch Reference Grid',
  [ProcessingStatus.ANALYZING_REFERENCES]: '4. Computing Bradford Chromatic Adaptation',
  [ProcessingStatus.CORRECTING_COLOR]: '5. Correcting Ambient Lighting to D65',
  [ProcessingStatus.EXTRACTING_FEATURES]: '6. Measuring CIELAB ΔE*ab Staining',
  [ProcessingStatus.RUNNING_INFERENCE]: '7. Calculating Exposure Dose & 8h TWA',
  [ProcessingStatus.VALIDATING_RESULT]: '8. Certifying MRPL Safety Compliance',
  [ProcessingStatus.COMPLETE]: 'Verification Complete',
  [ProcessingStatus.INVALID]: 'Verification Failed (Quality Gate)',
  [ProcessingStatus.ERROR]: 'Processing Error',
};

export default function WorkerScanPage() {
  const router = useRouter();
  const { currentUser, activeShift, activeDosimeter, addScan } = useAppStore();
  const [processing, setProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<ProcessingStatus | null>(null);
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [activeScenarioTitle, setActiveScenarioTitle] = useState('');
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);

  // Camera stream state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraRetryCount, setCameraRetryCount] = useState(0);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const runCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          let stream: MediaStream | null = null;
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
            });
          } catch {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
          }
          
          if (!isCancelled && videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play().catch(() => {});
            setCameraActive(true);
          }
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          console.warn('Camera stream could not be started:', err);
          setCameraError('Camera viewfinder offline. You can upload an image or select a calibrated sample below.');
          setCameraActive(false);
        }
      }
    };

    runCamera();

    return () => {
      isCancelled = true;
      stopCamera();
    };
  }, [cameraRetryCount]);

  const handleCaptureClick = async () => {
    let photoDataUrl: string | null = null;

    if (videoRef.current && canvasRef.current && cameraActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          photoDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        }
      }
    }

    if (!photoDataUrl) {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#F7F6F1';
        ctx.fillRect(0, 0, 640, 480);
        ctx.fillStyle = '#384835';
        ctx.fillRect(120, 30, 400, 420);
        ctx.fillStyle = '#FAFBF9';
        ctx.fillRect(170, 90, 300, 300);
        ctx.strokeStyle = '#E7E5DE';
        ctx.lineWidth = 4;
        ctx.strokeRect(170, 90, 300, 300);
        ctx.fillStyle = '#FFFFFF'; ctx.fillRect(195, 110, 50, 30);
        ctx.fillStyle = '#7F7F7F'; ctx.fillRect(255, 110, 50, 30);
        ctx.fillStyle = '#00A3E0'; ctx.fillRect(315, 110, 50, 30);
        ctx.fillStyle = '#EC008C'; ctx.fillRect(375, 110, 50, 30);
        ctx.fillStyle = '#BFA48A';
        ctx.beginPath();
        ctx.arc(320, 260, 55, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        photoDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      }
    }

    setCapturedPhotoUrl(photoDataUrl);
    stopCamera();
    await executePipeline(DemoScenario.NORMAL, 'Camera Photo Reading', photoDataUrl || undefined);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedPhotoUrl(dataUrl);
      stopCamera();
      await executePipeline(DemoScenario.ELEVATED, `Uploaded Image (${file.name})`, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const executePipeline = async (scenario: DemoScenario, title: string, imageUrl?: string) => {
    if (!currentUser || processing) return;
    
    setActiveScenarioTitle(title);
    setProcessing(true);
    setCompletedStages([]);
    setCurrentStage(ProcessingStatus.VALIDATING_IMAGE);
    
    const pipeline = getScanPipeline();
    
    try {
      const scan = await pipeline.processScenario(
        scenario,
        currentUser.id,
        activeShift?.id || 'shift-001',
        activeDosimeter?.dosimeterCode || 'DOS-001',
        (status) => {
          setCurrentStage(status);
          const label = STAGE_LABELS[status];
          if (label && !completedStages.includes(label)) {
            setCompletedStages(prev => [...prev, label]);
          }
        },
        imageUrl || null
      );

      addScan(scan);
      router.push(`/worker/result?scanId=${scan.id}`);
    } catch (err) {
      console.error(err);
      setProcessing(false);
    }
  };

  if (processing) {
    return (
      <div className="max-w-xl mx-auto py-8 space-y-6" aria-busy="true" role="status" aria-live="polite">
        <div className="gov-card p-6 sm:p-8 space-y-5">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#EEF3E7] text-[#5C822D] mx-auto flex items-center justify-center border border-[#C8DEC0]">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <h2 className="text-[20px] font-bold text-[#263026]">
              Verifying Dosimeter Optical Data
            </h2>
            <p className="text-[14px] text-[#596158]">
              Performing color space transformation and exposure inference for {activeScenarioTitle}...
            </p>
          </div>

          {capturedPhotoUrl && (
            <div className="flex justify-center">
              <div className="w-36 h-28 rounded border border-[#E7E5DE] overflow-hidden bg-black shadow-2xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={capturedPhotoUrl} alt="Captured Badge Snapshot" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* Step-by-Step Progress List */}
          <div className="bg-[#FAFBF9] border border-[#E7E5DE] rounded-md p-4 space-y-2.5 text-[14px]">
            {completedStages.map((stageText, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-[#5C822D]">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold text-[#263026]">{stageText}</span>
              </div>
            ))}

            {currentStage && currentStage !== ProcessingStatus.COMPLETE && currentStage !== ProcessingStatus.INVALID && (
              <div className="flex items-center gap-2.5 text-[#C96B32] font-semibold pt-1">
                <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                <span>{STAGE_LABELS[currentStage] || 'Processing step...'}</span>
              </div>
            )}
          </div>

          <div className="text-center text-[12px] text-[#7A8178]">
            MRPL Metrology Engine · ISO/CIE Standard D65 Calibration
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          href="/worker"
          className="text-[13px] font-semibold text-[#5C822D] hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shift Home</span>
        </Link>
        <span className="text-[13px] text-[#7A8178]">Step 2 of 3: Optical Badge Verification</span>
      </div>

      {/* Main Camera Viewfinder Card */}
      <div className="gov-card p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E5DE] pb-3 sm:pb-4">
          <div>
            <h1 className="text-[18px] sm:text-[20px] font-bold text-[#263026]">
              Optical Dosimeter Scanner
            </h1>
            <p className="text-[13px] sm:text-[14px] text-[#596158]">
              Align your wristband badge inside the reticle under ambient refinery lighting.
            </p>
          </div>
          <span className="gov-badge gov-badge-normal text-[11px] sm:text-[12px] self-start sm:self-auto">
            D65 CHROMATIC ADAPTATION
          </span>
        </div>

        {/* Viewport Frame */}
        <div className="relative bg-[#1C241C] rounded-md overflow-hidden min-h-[260px] sm:min-h-[340px] flex items-center justify-center border-2 border-[#E7E5DE]">
          {/* Live Video */}
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className={`w-full h-full object-cover max-h-[340px] ${cameraActive ? 'block' : 'hidden'}`}
          />

          {/* Hidden Canvas */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Alignment Reticle & 4-Patch Reference Bar */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-4 z-10">
            {/* Top 4-Patch Reference Overlay */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1 sm:gap-1.5 bg-black/80 backdrop-blur-2xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded border border-white/30 text-white shadow-xs">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider font-mono mr-1">CALIBRATION:</span>
                <span className="w-4 sm:w-5 h-3 sm:h-3.5 bg-[#FFFFFF] border border-white/80 rounded-xs shadow-2xs" title="White" />
                <span className="w-4 sm:w-5 h-3 sm:h-3.5 bg-[#7F7F7F] border border-white/50 rounded-xs shadow-2xs" title="Gray" />
                <span className="w-4 sm:w-5 h-3 sm:h-3.5 bg-[#00A3E0] border border-white/50 rounded-xs shadow-2xs" title="Cyan" />
                <span className="w-4 sm:w-5 h-3 sm:h-3.5 bg-[#EC008C] border border-white/50 rounded-xs shadow-2xs" title="Magenta" />
              </div>
            </div>

            {/* Center Reticle Box */}
            <div className="flex items-center justify-center flex-1 py-2">
              <div className="w-44 sm:w-52 h-36 sm:h-40 border-2 border-dashed border-white/80 rounded-md flex items-center justify-center relative shadow-xs">
                <div className="w-3 h-3 border-t-2 border-l-2 border-[#C96B32] absolute -top-1 -left-1" />
                <div className="w-3 h-3 border-t-2 border-r-2 border-[#C96B32] absolute -top-1 -right-1" />
                <div className="w-3 h-3 border-b-2 border-l-2 border-[#C96B32] absolute -bottom-1 -left-1" />
                <div className="w-3 h-3 border-b-2 border-r-2 border-[#C96B32] absolute -bottom-1 -right-1" />
                <Crosshair className="w-7 sm:w-8 h-7 sm:h-8 text-white/70 animate-pulse" />
              </div>
            </div>

            <div className="text-center text-[10px] sm:text-[11px] text-white/90 font-mono bg-black/70 py-0.5 sm:py-1 px-2 rounded mx-auto">
              ALIGN SENSOR SPOT IN RETICLE
            </div>
          </div>

          {/* Fallback Message if camera ungranted */}
          {!cameraActive && (
            <div className="p-4 sm:p-6 text-center text-white space-y-2 z-0">
              <VideoOff className="w-8 sm:w-10 h-8 sm:h-10 text-white/40 mx-auto" />
              <p className="text-[12px] sm:text-[13px] text-white/80 max-w-sm mx-auto">
                {cameraError || 'Camera permission pending. Click button below to capture photo or retry.'}
              </p>
              <button
                onClick={() => setCameraRetryCount(c => c + 1)}
                className="gov-btn-secondary text-[11px] sm:text-[12px] h-8 px-3 inline-flex items-center gap-1 text-white bg-white/10 hover:bg-white/20 border-white/30"
              >
                <RefreshCw size={12} />
                <span>Retry Camera</span>
              </button>
            </div>
          )}
        </div>

        {/* Single Primary Capture Button */}
        <div className="space-y-2.5 pt-1 sm:pt-2">
          <button
            onClick={handleCaptureClick}
            className="gov-btn-primary w-full h-12 text-[15px] font-semibold shadow-sm"
          >
            <Camera className="w-5 h-5" />
            <span>Capture Badge Photo & Verify</span>
          </button>

          {/* File Upload Option */}
          <div className="text-center pt-1">
            <label className="text-[12px] sm:text-[13px] text-[#596158] hover:text-[#5C822D] hover:underline cursor-pointer inline-flex items-center gap-1.5 p-1">
              <Upload size={14} className="text-[#5C822D]" />
              <span>Or choose existing badge image file from disk</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* 6 Calibrated Test Samples */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h2 className="text-[13px] sm:text-[14px] font-bold text-[#263026] uppercase tracking-wider">
            Calibrated Chemical Darkening Test Samples:
          </h2>
          <span className="text-[11px] sm:text-[12px] text-[#7A8178]">1-Click Quick Verification</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => executePipeline(s.id, s.title)}
              className="p-3.5 sm:p-4 bg-white border border-[#E7E5DE] hover:border-[#5C822D] hover:bg-[#FAFBF9] rounded-md text-left transition-all space-y-2 group active:bg-[#EEF3E7]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span 
                    className="w-4 h-4 rounded-full border border-[#E7E5DE] shadow-2xs flex-shrink-0"
                    style={{ backgroundColor: s.colorHex }}
                  />
                  <span className="font-semibold text-[13px] sm:text-[14px] text-[#263026] group-hover:text-[#5C822D] truncate">
                    {s.title}
                  </span>
                </div>
                <span className={`gov-badge ${s.badgeClass} text-[10px] sm:text-[11px] flex-shrink-0`}>
                  {s.badge}
                </span>
              </div>

              <p className="text-[12px] sm:text-[13px] text-[#596158] leading-snug">
                {s.desc}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-[#F7F6F1] text-[11px] sm:text-[12px] font-mono">
                <span className="text-[#7A8178]">Dose: <strong className="text-[#263026]">{s.dose}</strong></span>
                <span className="text-[#5C822D] font-semibold flex items-center gap-1 group-hover:underline">
                  <span>Verify</span>
                  <ArrowRight size={12} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
