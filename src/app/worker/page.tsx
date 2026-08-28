'use client';

import { useAppStore } from '@/stores/app-store';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { getScanPipeline } from '@/services/scientific/scan-processing-pipeline';
import { 
  Camera, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Edit3, 
  X, 
  Save, 
  Upload, 
  Crosshair, 
  RefreshCw, 
  VideoOff, 
  Play, 
  Square,
  ShieldAlert,
} from 'lucide-react';
import { DemoScenario, ProcessingStatus, ShiftStatus } from '@/types';
import { formatTime } from '@/lib/utils';

const scenarios = [
  { 
    id: DemoScenario.NORMAL, 
    title: 'Normal Shift (3.2 ppm·h)', 
    badge: 'NORMAL',
    badgeClass: 'gov-badge-normal',
    colorHex: '#F2EADB',
    desc: 'Safe background baseline level.',
  },
  { 
    id: DemoScenario.ELEVATED, 
    title: 'Elevated (12.4 ppm·h)', 
    badge: 'ELEVATED',
    badgeClass: 'gov-badge-elevated',
    colorHex: '#BFA48A',
    desc: 'Moderate CuS/Bi₂S₃ reaction. Caution advised.',
  },
  { 
    id: DemoScenario.HIGH, 
    title: 'High Exposure (18.6 ppm·h)', 
    badge: 'HIGH',
    badgeClass: 'gov-badge-high',
    colorHex: '#8C6D53',
    desc: 'Near 10 ppm 8h TWA limit. Check PPE.',
  },
  { 
    id: DemoScenario.CRITICAL, 
    title: 'Critical Alarm (24.8 ppm·h)', 
    badge: 'CRITICAL',
    badgeClass: 'gov-badge-critical',
    colorHex: '#4A3222',
    desc: 'Exceeds ceiling. Evacuation required.',
  },
  { 
    id: DemoScenario.INVALID, 
    title: 'Invalid (Glare / Blur)', 
    badge: 'INVALID',
    badgeClass: 'gov-badge-neutral',
    colorHex: '#E2E8F0',
    desc: 'Quality gate refuses invalid optical capture.',
  },
  { 
    id: DemoScenario.OUT_OF_RANGE, 
    title: 'Out of Range (>30 ppm·h)', 
    badge: 'OUT OF RANGE',
    badgeClass: 'gov-badge-neutral',
    colorHex: '#CBD5E1',
    desc: 'Sensor saturated. Flagged for GC lab analysis.',
  },
];

const STAGE_LABELS: Record<ProcessingStatus, string> = {
  [ProcessingStatus.CAPTURED]: 'Photo Captured',
  [ProcessingStatus.VALIDATING_IMAGE]: '1. Validating Sharpness & Glare',
  [ProcessingStatus.DETECTING_DOSIMETER]: '2. Locating Sensor Boundary',
  [ProcessingStatus.EXTRACTING_ROI]: '3. Extracting 4-Patch Grid',
  [ProcessingStatus.ANALYZING_REFERENCES]: '4. Computing Bradford Adaptation',
  [ProcessingStatus.CORRECTING_COLOR]: '5. Normalizing to ISO D65',
  [ProcessingStatus.EXTRACTING_FEATURES]: '6. Measuring CIELAB ΔE*ab',
  [ProcessingStatus.RUNNING_INFERENCE]: '7. Calculating Exposure Dose',
  [ProcessingStatus.VALIDATING_RESULT]: '8. Certifying Safety Compliance',
  [ProcessingStatus.COMPLETE]: 'Verification Complete',
  [ProcessingStatus.INVALID]: 'Quality Gate Refusal',
  [ProcessingStatus.ERROR]: 'Processing Error',
};

export default function WorkerHomePage() {
  const router = useRouter();
  const { 
    currentUser, 
    activeShift, 
    activeDosimeter, 
    addScan, 
    startShift, 
    endShift, 
    updateUserProfile 
  } = useAppStore();

  // Scanner state
  const [processing, setProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<ProcessingStatus | null>(null);
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [activeScenarioTitle, setActiveScenarioTitle] = useState('');
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);

  // Edit Profile modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(currentUser?.displayName || 'Rajesh Kumar');
  const [editDept, setEditDept] = useState(currentUser?.department || 'Operations');
  const [editSite, setEditSite] = useState(currentUser?.site || 'Refinery Zone A');
  const [editCode, setEditCode] = useState(currentUser?.workerCode || 'W-001');

  // Camera stream state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Shift duration timer
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    if (activeShift?.startTime && activeShift.status === ShiftStatus.ACTIVE) {
      const updateElapsed = () => {
        const start = new Date(activeShift.startTime).getTime();
        const now = new Date().getTime();
        const diffMs = Math.max(0, now - start);
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffMins = Math.floor((diffMs % 3600000) / 60000);
        setElapsed(`${diffHrs}h ${diffMins}m`);
      };
      updateElapsed();
      const interval = setInterval(updateElapsed, 60000);
      return () => clearInterval(interval);
    } else {
      setElapsed('');
    }
  }, [activeShift]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        let stream: MediaStream | null = null;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }
        
        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
          setCameraActive(true);
        }
      }
    } catch (err) {
      console.warn('Camera viewfinder could not be started:', err);
      setCameraError('Camera offline. You can upload an image or select a calibrated sample below.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

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
    await executePipeline(DemoScenario.NORMAL, 'Live Camera Scan', photoDataUrl || undefined);
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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      displayName: editName,
      department: editDept,
      site: editSite,
      workerCode: editCode,
    });
    setEditModalOpen(false);
  };

  // Processing visualizer view
  if (processing) {
    return (
      <div className="max-w-xl mx-auto py-6 space-y-5" aria-busy="true" role="status" aria-live="polite">
        <div className="gov-card p-5 sm:p-8 space-y-5 text-center">
          <div className="w-12 h-12 rounded-full bg-[#EEF3E7] text-[#5C822D] mx-auto flex items-center justify-center border border-[#C8DEC0]">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h2 className="text-[19px] sm:text-[21px] font-bold text-[#263026]">
              Analyzing Wristband Sensor
            </h2>
            <p className="text-[13px] text-[#596158] mt-1">
              Extracting Bradford D65 chromatic vectors for {activeScenarioTitle}...
            </p>
          </div>

          {capturedPhotoUrl && (
            <div className="flex justify-center">
              <div className="w-32 h-24 rounded-md border border-[#E7E5DE] overflow-hidden bg-black shadow-2xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={capturedPhotoUrl} alt="Captured Badge Snapshot" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* Progress List */}
          <div className="bg-[#FAFBF9] border border-[#E7E5DE] rounded-lg p-4 space-y-2 text-left text-[13px]">
            {completedStages.map((stageText, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[#5C822D]">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold text-[#263026]">{stageText}</span>
              </div>
            ))}

            {currentStage && currentStage !== ProcessingStatus.COMPLETE && currentStage !== ProcessingStatus.INVALID && (
              <div className="flex items-center gap-2 text-[#C96B32] font-semibold pt-1">
                <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                <span>{STAGE_LABELS[currentStage] || 'Processing step...'}</span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-[#7A8178] font-mono">
            MRPL Optical Gating · ISO/CIE D65
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* 1. COMPACT WORKER PROFILE HEADER */}
      <div className="gov-card p-3.5 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-lg bg-[#5C822D] text-white flex items-center justify-center font-bold text-[15px] flex-shrink-0 shadow-2xs">
              {currentUser?.displayName?.split(' ').map(n => n[0]).join('') || 'RK'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[16px] sm:text-[18px] font-bold text-[#263026] truncate">
                  {currentUser?.displayName || 'Rajesh Kumar'}
                </h1>
                <span className="text-[11px] font-mono text-[#7A8178] hidden xs:inline">
                  ({currentUser?.workerCode || 'W-001'})
                </span>
              </div>
              <div className="text-[12px] text-[#596158] flex items-center gap-1.5 flex-wrap truncate">
                <span>{currentUser?.department || 'Operations'}</span>
                <span>•</span>
                <span className="truncate">{currentUser?.site || 'Refinery Zone A'}</span>
                <span>•</span>
                <span className="font-semibold text-[#35551F]">
                  {activeShift?.status === ShiftStatus.ACTIVE ? `Shift A (${elapsed || 'Ongoing'})` : 'No Active Shift'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                setEditName(currentUser?.displayName || 'Rajesh Kumar');
                setEditDept(currentUser?.department || 'Operations');
                setEditSite(currentUser?.site || 'Refinery Zone A');
                setEditCode(currentUser?.workerCode || 'W-001');
                setEditModalOpen(true);
              }}
              className="p-2 sm:px-3 sm:py-1.5 rounded-md bg-[#F7F6F1] hover:bg-[#F0EFE9] border border-[#E7E5DE] text-[#263026] text-[12px] font-semibold flex items-center gap-1.5 transition-colors"
              title="Edit Profile"
            >
              <Edit3 size={14} className="text-[#5C822D]" />
              <span className="hidden sm:inline">Edit Profile</span>
            </button>

            {activeShift?.status === ShiftStatus.ACTIVE ? (
              <button
                onClick={() => endShift()}
                className="gov-btn-danger text-[11px] sm:text-[12px] h-8 px-2.5"
                title="End Current Shift"
              >
                <Square size={12} />
                <span className="hidden xs:inline">End Shift</span>
              </button>
            ) : (
              <button
                onClick={() => startShift()}
                className="gov-btn-primary text-[11px] sm:text-[12px] h-8 px-2.5"
                title="Start New Shift"
              >
                <Play size={12} />
                <span className="hidden xs:inline">Start Shift</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. PRIMARY SCANNER INTERFACE (Immediate, High Contrast, Large Controls) */}
      <div className="gov-card p-3.5 sm:p-6 space-y-3.5 sm:space-y-4">
        
        {/* Title Bar */}
        <div className="flex items-center justify-between border-b border-[#E7E5DE] pb-2.5 sm:pb-3">
          <div>
            <h2 className="text-[16px] sm:text-[18px] font-bold text-[#263026] flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#5C822D]" />
              <span>Optical Wristband Scanner</span>
            </h2>
            <p className="text-[12px] sm:text-[13px] text-[#596158]">
              Align wristband badge in viewfinder under ambient refinery lighting
            </p>
          </div>
          <span className="gov-badge gov-badge-normal text-[10px] sm:text-[11px] hidden sm:inline-flex">
            D65 ADAPTED
          </span>
        </div>

        {/* Live Camera Viewfinder */}
        <div className="relative bg-[#131A13] rounded-lg overflow-hidden min-h-[240px] sm:min-h-[320px] max-h-[360px] flex items-center justify-center border-2 border-[#D5D2C9]">
          
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className={`w-full h-full object-cover max-h-[340px] ${cameraActive ? 'block' : 'hidden'}`}
          />

          <canvas ref={canvasRef} className="hidden" />

          {/* Alignment Reticle & 4-Patch Reference Overlay */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 z-10">
            {/* Top 4-Patch Calibration Bar Target */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1 sm:gap-1.5 bg-black/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/30 text-white shadow-xs">
                <span className="text-[9px] font-bold font-mono tracking-wider text-[#A7D7C1] mr-1">CALIBRATION:</span>
                <span className="w-4 sm:w-5 h-3 sm:h-3.5 bg-white border border-white/80 rounded-2xs" title="White (100)" />
                <span className="w-4 sm:w-5 h-3 sm:h-3.5 bg-[#7F7F7F] border border-white/50 rounded-2xs" title="Gray (50)" />
                <span className="w-4 sm:w-5 h-3 sm:h-3.5 bg-[#00A3E0] border border-white/50 rounded-2xs" title="Cyan" />
                <span className="w-4 sm:w-5 h-3 sm:h-3.5 bg-[#EC008C] border border-white/50 rounded-2xs" title="Magenta" />
              </div>
            </div>

            {/* Central Reticle */}
            <div className="flex items-center justify-center flex-1 py-2">
              <div className="w-40 sm:w-48 h-32 sm:h-36 border-2 border-dashed border-white/80 rounded-lg flex items-center justify-center relative shadow-xs">
                <div className="w-3 h-3 border-t-2 border-l-2 border-[#C96B32] absolute -top-1 -left-1" />
                <div className="w-3 h-3 border-t-2 border-r-2 border-[#C96B32] absolute -top-1 -right-1" />
                <div className="w-3 h-3 border-b-2 border-l-2 border-[#C96B32] absolute -bottom-1 -left-1" />
                <div className="w-3 h-3 border-b-2 border-r-2 border-[#C96B32] absolute -bottom-1 -right-1" />
                <Crosshair className="w-7 sm:w-8 h-7 sm:h-8 text-white/70 animate-pulse" />
              </div>
            </div>

            <div className="text-center text-[10px] text-white/90 font-mono bg-black/75 py-0.5 px-2 rounded mx-auto">
              ALIGN SENSOR SPOT INSIDE RETICLE
            </div>
          </div>

          {/* Viewfinder Offline State */}
          {!cameraActive && (
            <div className="p-4 text-center text-white space-y-2 z-0">
              <VideoOff className="w-8 h-8 text-white/40 mx-auto" />
              <p className="text-[12px] text-white/80 max-w-xs mx-auto">
                {cameraError || 'Camera viewfinder offline. Click button below to capture or use test samples.'}
              </p>
              <button
                onClick={startCamera}
                className="gov-btn-secondary text-[11px] h-7 px-3 text-white bg-white/10 hover:bg-white/20 border-white/30"
              >
                <RefreshCw size={12} />
                <span>Retry Camera</span>
              </button>
            </div>
          )}
        </div>

        {/* Primary Action Button (Large 50px+ Touch Target) */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleCaptureClick}
            className="gov-btn-primary w-full h-12 sm:h-13 text-[15px] sm:text-[16px] font-bold shadow-md hover:shadow-lg transition-all justify-center"
          >
            <Camera className="w-5 h-5" />
            <span>CAPTURE BADGE & GET READING</span>
          </button>

          {/* Upload Fallback Link */}
          <div className="text-center pt-0.5">
            <label className="text-[12px] text-[#596158] hover:text-[#5C822D] hover:underline cursor-pointer inline-flex items-center gap-1.5 p-1">
              <Upload size={13} className="text-[#5C822D]" />
              <span>Or upload badge photo from device gallery</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* 3. ONE-CLICK CALIBRATED DEMO SAMPLES (Fast Field Testing) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] sm:text-[14px] font-bold text-[#263026] uppercase tracking-wider">
            Calibrated Chemical Test Samples:
          </h3>
          <span className="text-[11px] text-[#7A8178]">1-Tap Instant Test</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => executePipeline(s.id, s.title)}
              className="p-3 sm:p-3.5 bg-white border border-[#E7E5DE] hover:border-[#5C822D] hover:bg-[#FAFBF9] rounded-lg text-left transition-all space-y-1.5 group active:bg-[#EEF3E7]"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span 
                    className="w-4 h-4 rounded-full border border-[#E7E5DE] shadow-2xs flex-shrink-0"
                    style={{ backgroundColor: s.colorHex }}
                  />
                  <span className="font-bold text-[13px] text-[#263026] group-hover:text-[#5C822D] truncate">
                    {s.title}
                  </span>
                </div>
                <span className={`gov-badge ${s.badgeClass} text-[9px] flex-shrink-0`}>
                  {s.badge}
                </span>
              </div>

              <p className="text-[11px] text-[#596158] leading-snug">
                {s.desc}
              </p>

              <div className="flex items-center justify-end text-[11px] text-[#5C822D] font-semibold group-hover:underline pt-0.5">
                <span>Run Test →</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* EDIT PROFILE MODAL (Mobile-Friendly Form) */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-[#E7E5DE] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-4 border-b border-[#E7E5DE] flex items-center justify-between bg-[#FAFBF9]">
              <div className="flex items-center gap-2 font-bold text-[15px] text-[#263026]">
                <Edit3 className="w-4 h-4 text-[#5C822D]" />
                <span>Edit Worker Profile</span>
              </div>
              <button 
                onClick={() => setEditModalOpen(false)}
                className="text-[#7A8178] hover:text-[#263026] p-1 rounded hover:bg-[#F0EFE9]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-4 sm:p-5 space-y-3.5 text-[13px]">
              <div>
                <label className="font-semibold text-[#263026] block mb-1">Worker Full Name:</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 border border-[#D5D2C9] rounded-md bg-white text-[#263026] focus:outline-2 focus:outline-[#5C822D]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#263026] block mb-1">Worker Code:</label>
                  <input
                    type="text"
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    className="w-full p-2.5 border border-[#D5D2C9] rounded-md bg-white text-[#263026] font-mono focus:outline-2 focus:outline-[#5C822D]"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#263026] block mb-1">Department:</label>
                  <input
                    type="text"
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value)}
                    className="w-full p-2.5 border border-[#D5D2C9] rounded-md bg-white text-[#263026] focus:outline-2 focus:outline-[#5C822D]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#263026] block mb-1">Refinery Work Area:</label>
                <input
                  type="text"
                  value={editSite}
                  onChange={(e) => setEditSite(e.target.value)}
                  className="w-full p-2.5 border border-[#D5D2C9] rounded-md bg-white text-[#263026] focus:outline-2 focus:outline-[#5C822D]"
                  required
                />
              </div>

              <div className="pt-3 border-t border-[#E7E5DE] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="gov-btn-secondary text-[12px] h-9 px-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gov-btn-primary text-[12px] h-9 px-4 font-semibold flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

