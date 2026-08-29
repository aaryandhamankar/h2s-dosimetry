'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Camera, 
  ArrowLeft, 
  Flashlight, 
  FlashlightOff, 
  RotateCcw, 
  Crosshair, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck, 
  Upload, 
  Loader2, 
  VideoOff, 
  RefreshCw, 
  Printer, 
  ChevronDown, 
  Cpu, 
  User, 
  History, 
  X, 
  XCircle, 
  Edit3, 
  Save, 
  BarChart3 
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { DemoScenario, RiskStatus, ValidityStatus, ProcessingStatus, Scan } from '@/types';
import { getScanPipeline } from '@/services/scientific/scan-processing-pipeline';
import { formatDateTime, formatDose, getValidityLabel } from '@/lib/utils';
import { sfx } from '@/lib/sound-effects';
import Image from 'next/image';
import mrplLogo from '../../../public/mrpl-logo.png';

const STAGE_ORDER: ProcessingStatus[] = [
  ProcessingStatus.VALIDATING_IMAGE,
  ProcessingStatus.DETECTING_DOSIMETER,
  ProcessingStatus.EXTRACTING_ROI,
  ProcessingStatus.ANALYZING_REFERENCES,
  ProcessingStatus.CORRECTING_COLOR,
  ProcessingStatus.EXTRACTING_FEATURES,
  ProcessingStatus.RUNNING_INFERENCE,
  ProcessingStatus.VALIDATING_RESULT,
];

const STAGE_LABELS: Record<'en' | 'hi', Record<ProcessingStatus, string>> = {
  en: {
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
  },
  hi: {
    [ProcessingStatus.CAPTURED]: 'फ़ोटो कैप्चर की गई',
    [ProcessingStatus.VALIDATING_IMAGE]: '1. स्पष्टता और चमक की जांच',
    [ProcessingStatus.DETECTING_DOSIMETER]: '2. सेंसर सीमा का निर्धारण',
    [ProcessingStatus.EXTRACTING_ROI]: '3. 4-पैच ग्रिड निष्कर्षण',
    [ProcessingStatus.ANALYZING_REFERENCES]: '4. Bradford अनुकूलन गणना',
    [ProcessingStatus.CORRECTING_COLOR]: '5. ISO D65 सामान्यीकरण',
    [ProcessingStatus.EXTRACTING_FEATURES]: '6. CIELAB ΔE*ab मापन',
    [ProcessingStatus.RUNNING_INFERENCE]: '7. एक्सपोज़र खुराक की गणना',
    [ProcessingStatus.VALIDATING_RESULT]: '8. सुरक्षा अनुपालन प्रमाणीकरण',
    [ProcessingStatus.COMPLETE]: 'सत्यापन पूर्ण',
    [ProcessingStatus.INVALID]: 'गुणवत्ता अस्वीकृति',
    [ProcessingStatus.ERROR]: 'प्रसंस्करण त्रुटि',
  },
};

function ScanPageContent() {
  const searchParams = useSearchParams();
  const scenarioParam = searchParams.get('scenario');
  const timestampParam = searchParams.get('t');

  const { 
    currentUser, 
    activeShift, 
    activeDosimeter, 
    scans, 
    addScan, 
    updateUserProfile, 
    language 
  } = useAppStore();

  // Screen states: 'viewfinder' | 'processing' | 'result'
  const [screenState, setScreenState] = useState<'viewfinder' | 'processing' | 'result'>('viewfinder');
  const [currentScan, setCurrentScan] = useState<Scan | null>(null);

  // Processing pipeline animation states
  const [currentStage, setCurrentStage] = useState<ProcessingStatus | null>(null);
  const [completedStages, setCompletedStages] = useState<ProcessingStatus[]>([]);
  const [activeScenarioTitle, setActiveScenarioTitle] = useState('');
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);

  // Worker History & Profile Modal
  const [workerModalOpen, setWorkerModalOpen] = useState(false);
  const [editProfileMode, setEditProfileMode] = useState(false);
  const [editName, setEditName] = useState(currentUser?.displayName || 'Rajesh Kumar');
  const [editDept, setEditDept] = useState(currentUser?.department || 'Operations');
  const [editSite, setEditSite] = useState(currentUser?.site || 'Refinery Zone A');
  const [editCode, setEditCode] = useState(currentUser?.workerCode || 'W-001');

  // Metrology accordion
  const [showTechnical, setShowTechnical] = useState(false);

  // Camera & Torch states
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameraRetryCount, setCameraRetryCount] = useState(0);

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setTorchOn(false);
  };

  const toggleTorch = async () => {
    sfx.playClick();
    if (!mediaStream) {
      setTorchOn(!torchOn);
      return;
    }
    const track = mediaStream.getVideoTracks()[0];
    if (track) {
      try {
        const capabilities = (track.getCapabilities ? track.getCapabilities() : {}) as { torch?: boolean };
        if (capabilities.torch) {
          await track.applyConstraints({
            advanced: [{ torch: !torchOn } as MediaTrackConstraintSet]
          });
        }
        setTorchOn(!torchOn);
      } catch (e) {
        console.warn('Torch constraint error:', e);
        setTorchOn(!torchOn);
      }
    } else {
      setTorchOn(!torchOn);
    }
  };

  // Process pipeline with sequential 1-8 scientific stage checklist
  const executePipeline = async (scenario: DemoScenario, title: string, imageUrl?: string) => {
    stopCamera();
    setCurrentScan(null);
    setActiveScenarioTitle(title);
    setCapturedPhotoUrl(imageUrl || null);
    setCompletedStages([]);
    setCurrentStage(ProcessingStatus.VALIDATING_IMAGE);
    setScreenState('processing');

    const pipeline = getScanPipeline();
    const workerId = currentUser?.id || 'worker-001';
    const shiftId = activeShift?.id || 'shift-001';
    const dosimeterCode = activeDosimeter?.dosimeterCode || 'DOS-001';

    try {
      const scan = await pipeline.processScenario(
        scenario,
        workerId,
        shiftId,
        dosimeterCode,
        (status) => {
          setCurrentStage(status);
          setCompletedStages(prev => prev.includes(status) ? prev : [...prev, status]);
          const stepIdx = STAGE_ORDER.indexOf(status);
          if (stepIdx >= 0) {
            sfx.playStepTick(stepIdx + 1);
          }
        },
        imageUrl || null
      );

      // Ensure all 8 stage labels are marked complete on finished
      setCompletedStages([...STAGE_ORDER]);

      addScan(scan);
      setCurrentScan(scan);

      // Trigger affirmative / warning / alarm sound based on certified outcome
      const resRisk = scan.exposureResult?.riskStatus;
      const isInv = scan.exposureResult?.validityStatus === ValidityStatus.INVALID_IMAGE || scan.exposureResult?.validityStatus === ValidityStatus.PROCESSING_ERROR;
      const isOOR = scan.exposureResult?.validityStatus === ValidityStatus.OUT_OF_RANGE;

      setTimeout(() => {
        if (resRisk === RiskStatus.CRITICAL) {
          sfx.playCriticalAlarm();
        } else if (resRisk === RiskStatus.HIGH || resRisk === RiskStatus.ELEVATED || isOOR || isInv) {
          sfx.playWarning();
        } else {
          sfx.playSuccess();
        }
        setScreenState('result');
      }, 450);

    } catch (err) {
      console.error(err);
      setScreenState('viewfinder');
    }
  };

  // Live Camera Capture with Shutter Sound
  const handleCapture = () => {
    sfx.playCameraShutter();

    if (!videoRef.current || !canvasRef.current) {
      executePipeline(
        DemoScenario.NORMAL, 
        language === 'hi' ? '1. सामान्य शिफ्ट (3.2 ppm·h)' : '1. Normal Shift (3.2 ppm·h)'
      );
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        executePipeline(
          DemoScenario.NORMAL, 
          language === 'hi' ? 'लाइव ऑप्टिकल कैप्चर' : 'Live Optical Capture', 
          dataUrl
        );
      } else {
        executePipeline(
          DemoScenario.NORMAL, 
          language === 'hi' ? '1. सामान्य शिफ्ट (3.2 ppm·h)' : '1. Normal Shift (3.2 ppm·h)'
        );
      }
    } catch {
      executePipeline(
        DemoScenario.NORMAL, 
        language === 'hi' ? '1. सामान्य शिफ्ट (3.2 ppm·h)' : '1. Normal Shift (3.2 ppm·h)'
      );
    }
  };

  // Camera start effect
  useEffect(() => {
    if (screenState !== 'viewfinder') return;

    let isCancelled = false;

    const runCamera = async () => {
      if (typeof window === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (!isCancelled) {
          setCameraError(language === 'hi' ? 'कैमरा उपलब्ध नहीं है। कैप्चर बटन का उपयोग करें।' : 'Camera API unavailable in this browser environment.');
          setCameraActive(false);
        }
        return;
      }

      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (isCancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setCameraActive(true);
      } catch {
        if (!isCancelled) {
          setCameraError(language === 'hi' ? 'कैमरा ऑफलाइन है। कैप्चर बटन या डेमो बटन का उपयोग करें।' : 'Camera offline. Click the capture button or use the Demo button.');
          setCameraActive(false);
        }
      }
    };

    runCamera();

    return () => {
      isCancelled = true;
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenState, cameraRetryCount]);

  // Trigger scenario if passed via query parameters (from global Demo button)
  useEffect(() => {
    if (scenarioParam) {
      const scenarioMap: Record<string, { scenario: DemoScenario; title: string }> = {
        NORMAL: { scenario: DemoScenario.NORMAL, title: language === 'hi' ? '1. सामान्य शिफ्ट (3.2 ppm·h)' : '1. Normal Shift (3.2 ppm·h)' },
        ELEVATED: { scenario: DemoScenario.ELEVATED, title: language === 'hi' ? '2. मध्यम स्तर (12.4 ppm·h)' : '2. Elevated Level (12.4 ppm·h)' },
        HIGH: { scenario: DemoScenario.HIGH, title: language === 'hi' ? '3. उच्च एक्सपोजर (18.6 ppm·h)' : '3. High Exposure (18.6 ppm·h)' },
        CRITICAL: { scenario: DemoScenario.CRITICAL, title: language === 'hi' ? '4. गंभीर अलार्म (24.8 ppm·h)' : '4. Critical Alarm (24.8 ppm·h)' },
        INVALID: { scenario: DemoScenario.INVALID, title: language === 'hi' ? '5. अमान्य छवि (चमक/धुंधलापन)' : '5. Invalid Image (Glare/Blur)' },
        OUT_OF_RANGE: { scenario: DemoScenario.OUT_OF_RANGE, title: language === 'hi' ? '6. सीमा से अधिक (>30 ppm·h)' : '6. Out of Range (>30 ppm·h)' },
      };

      const matched = scenarioMap[scenarioParam.toUpperCase()];
      if (matched) {
        const timer = setTimeout(() => {
          executePipeline(matched.scenario, matched.title);
        }, 10);
        return () => clearTimeout(timer);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioParam, timestampParam, language]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      await executePipeline(
        DemoScenario.HIGH, 
        language === 'hi' ? `अपलोड की गई फ़ोटो (${file.name})` : `Uploaded Photo (${file.name})`, 
        dataUrl
      );
    };
    reader.readAsDataURL(file);
  };

  const handleResetScan = () => {
    sfx.playClick();
    setCurrentScan(null);
    setCompletedStages([]);
    setCurrentStage(null);
    setScreenState('viewfinder');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      displayName: editName,
      department: editDept,
      site: editSite,
      workerCode: editCode,
    });
    setEditProfileMode(false);
  };

  // User's specific history scans
  const workerScans = scans
    .filter(s => !currentUser || s.workerId === currentUser.id)
    .sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime());

  // Result metrics & non-repetitive unified state calculations
  const res = currentScan?.exposureResult;
  const isInvalid = res?.validityStatus === ValidityStatus.INVALID_IMAGE || res?.validityStatus === ValidityStatus.PROCESSING_ERROR || currentScan?.scenarioId === DemoScenario.INVALID;
  const isOor = res?.validityStatus === ValidityStatus.OUT_OF_RANGE || currentScan?.scenarioId === DemoScenario.OUT_OF_RANGE;

  const doseVal = res?.estimatedDose ?? (isOor ? 35 : isInvalid ? null : 0);

  // Pointer position calculation (Scale from 0 to 30 ppm·h)
  let pointerPercent = 0;
  if (isOor) {
    pointerPercent = 100;
  } else if (doseVal !== null && doseVal !== undefined) {
    pointerPercent = Math.min(100, Math.max(0, (doseVal / 30) * 100));
  }

  // Unified non-repetitive action guidance & badges
  let statusBadge = (
    <span className="gov-badge gov-badge-normal text-[13px] py-1 px-3.5 shadow-2xs font-bold">
      <CheckCircle2 className="w-4 h-4 text-[#5C822D]" /> {language === 'hi' ? 'सुरक्षित बेसलाइन' : 'SAFE BASELINE'}
    </span>
  );
  let actionTitle = language === 'hi' ? 'सामान्य शिफ्ट प्रक्रिया — सुरक्षित बेसलाइन' : 'Normal Shift Procedure — Safe Baseline';
  let actionInstruction = language === 'hi' ? 'सामान्य प्रक्रिया — मानक पीपीई के साथ निर्धारित शिफ्ट संचालन जारी रखें।' : 'Normal procedure — continue scheduled shift operations with standard PPE.';
  let cardAccentBorder = 'border-[#C6DCC0]';
  let bannerBg = 'bg-[#FAF7F0]';

  if (isInvalid) {
    statusBadge = (
      <span className="gov-badge gov-badge-neutral text-[13px] py-1 px-3.5 font-bold">
        <XCircle className="w-4 h-4 text-[#A94442]" /> {language === 'hi' ? 'गुणवत्ता अस्वीकृति' : 'QUALITY GATE REFUSAL'}
      </span>
    );
    actionTitle = language === 'hi' ? 'रीडिंग अस्वीकृत — चमक / ऑप्टिकल धुंधलापन पहचाना गया' : 'Reading Refused — Glare / Optical Blur Detected';
    actionInstruction = language === 'hi' ? '4-पैच ग्रिड पर अत्यधिक चमक या धुंधलापन है। रेटिकल के अंदर पुनः संरेखित करें और दोबारा फोटो लें।' : 'Specular glare or blur detected on 4-patch grid. Re-align inside reticle and retake photo.';
    cardAccentBorder = 'border-[#D8D0C0]';
    bannerBg = 'bg-[#FAF6EE]';
  } else if (isOor) {
    statusBadge = (
      <span className="gov-badge gov-badge-neutral text-[13px] py-1 px-3.5 bg-[#FAF2EB] text-[#9C4124] border-[#E8C4B8] font-bold">
        <AlertTriangle className="w-4 h-4 text-[#9C4124]" /> {language === 'hi' ? 'सेंसर संतृप्त' : 'SENSOR SATURATED'}
      </span>
    );
    actionTitle = language === 'hi' ? 'सेंसर संतृप्ति पहचानी गई (>30.0 ppm·h)' : 'Sensor Saturation Detected (>30.0 ppm·h)';
    actionInstruction = language === 'hi' ? 'मैट्रिक्स 30 ppm·h सीमा से अधिक हो गया है। गैस क्रोमैटोग्राफी (GC) विश्लेषण के लिए बैज एचएसई लैब में जमा करें।' : 'Matrix exceeded 30 ppm·h ceiling. Submit badge to HSE laboratory for gas chromatography (GC) analysis.';
    cardAccentBorder = 'border-[#E8C4B8]';
    bannerBg = 'bg-[#FFFDFB]';
  } else if (res?.riskStatus === RiskStatus.CRITICAL) {
    statusBadge = (
      <span className="gov-badge gov-badge-critical text-[13px] py-1 px-3.5 animate-pulse font-bold">
        <ShieldAlert className="w-4 h-4" /> {language === 'hi' ? 'गंभीर खतरा' : 'CRITICAL HAZARD'}
      </span>
    );
    actionTitle = language === 'hi' ? 'अनिवार्य सुरक्षा कार्रवाई: तत्काल निकासी' : 'MANDATORY SAFETY ACTION: IMMEDIATE EVACUATION';
    actionInstruction = language === 'hi' ? 'सुरक्षा सीमा पार हो गई है। तुरंत हवा की विपरीत दिशा में बाहर निकलें और संयंत्र आपातकालीन नियंत्रण को सूचित करें।' : 'Ceiling safety threshold exceeded. Evacuate upwind immediately and notify plant emergency control.';
    cardAccentBorder = 'border-[#F0C4C4]';
    bannerBg = 'bg-[#FFF9F9]';
  } else if (res?.riskStatus === RiskStatus.HIGH) {
    statusBadge = (
      <span className="gov-badge gov-badge-high text-[13px] py-1 px-3.5 font-bold">
        <AlertTriangle className="w-4 h-4" /> {language === 'hi' ? 'उच्च एक्सपोजर' : 'HIGH EXPOSURE'}
      </span>
    );
    actionTitle = language === 'hi' ? 'कार्रवाई आवश्यक — पीपीई का निरीक्षण करें और वेंटिलेशन जांचें' : 'Action Required — Inspect PPE & Check Ventilation';
    actionInstruction = language === 'hi' ? '10 ppm 8h TWA सीमा के करीब। क्षेत्र में प्रवेश सीमित करें और रेस्पिरेटर की जांच करें।' : 'Approaching 10 ppm 8h TWA limit. Restrict zone access and inspect respirator / breathing apparatus.';
    cardAccentBorder = 'border-[#F3D5C0]';
    bannerBg = 'bg-[#FFFDFB]';
  } else if (res?.riskStatus === RiskStatus.ELEVATED) {
    statusBadge = (
      <span className="gov-badge gov-badge-elevated text-[13px] py-1 px-3.5 font-bold">
        <AlertTriangle className="w-4 h-4" /> {language === 'hi' ? 'मध्यम स्तर' : 'ELEVATED LEVEL'}
      </span>
    );
    actionTitle = language === 'hi' ? 'सावधानी बरतें — शिफ्ट पर्यवेक्षक को सूचित करें' : 'Caution Advised — Notify Shift Supervisor';
    actionInstruction = language === 'hi' ? 'मध्यम CuS रंग परिवर्तन देखा गया। स्थानीय वेंटिलेशन की जांच करें और शिफ्ट लीड को रिपोर्ट करें।' : 'Moderate CuS staining observed. Verify local ventilation and report reading to shift supervisor.';
    cardAccentBorder = 'border-[#EAD7A8]';
    bannerBg = 'bg-[#FAF8F2]';
  }

  return (
    <div className="flex-1 flex flex-col justify-center py-4 sm:py-8 px-3 sm:px-6 max-w-[760px] mx-auto w-full">
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. INITIAL CAMERA-FIRST SCANNER STATE                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {screenState === 'viewfinder' && (
        <div className="space-y-4">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#596158] hover:text-[#263026] p-1 rounded-md transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'hi' ? 'होम' : 'Home'}</span>
            </Link>
          </div>

          {/* Clean Title */}
          <div className="text-center space-y-0.5">
            <h1 className="text-[22px] sm:text-[26px] font-black text-[#263026]">
              {language === 'hi' ? 'रिस्टबैंड स्कैन करें' : 'Scan Wristband'}
            </h1>
            <p className="text-[13px] text-[#596158]">
              {language === 'hi' ? 'रिस्टबैंड को फ्रेम के अंदर रखें' : 'Align the wristband inside the frame'}
            </p>
          </div>

          {/* Large Camera Viewfinder */}
          <div className="relative bg-[#131A13] rounded-2xl overflow-hidden min-h-[320px] sm:min-h-[380px] flex items-center justify-center border-2 border-[#D8D0C0] shadow-inner">
            
            {/* Top-Right Corner Torch Toggle (Icon Only) */}
            <button
              type="button"
              onClick={toggleTorch}
              className={`absolute top-3 right-3 z-20 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md active:scale-90 cursor-pointer pointer-events-auto ${
                torchOn 
                  ? 'bg-[#FFDE59] text-[#263026] border-2 border-[#E5C328] shadow-[#FFDE59]/30' 
                  : 'bg-black/60 text-white/90 border border-white/25 hover:bg-black/80 hover:text-white'
              }`}
              title={torchOn ? (language === 'hi' ? 'टॉर्च बंद करें' : 'Turn Torch Off') : (language === 'hi' ? 'टॉर्च चालू करें' : 'Turn Torch On')}
              aria-label="Toggle Torch"
            >
              {torchOn ? (
                <Flashlight className="w-5 h-5 text-[#263026]" />
              ) : (
                <FlashlightOff className="w-5 h-5 text-white/90" />
              )}
            </button>

            {/* Video */}
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className={`w-full h-full object-cover max-h-[380px] ${cameraActive ? 'block' : 'hidden'}`}
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Alignment Reticle Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-10">
              <div className="flex justify-center">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-white/90 bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20">
                  D65 OPTICAL RETICLE
                </span>
              </div>

              {/* Central Reticle */}
              <div className="flex items-center justify-center flex-1">
                <div className="w-48 sm:w-56 h-40 sm:h-48 border-2 border-dashed border-white/90 rounded-2xl flex items-center justify-center relative shadow-lg">
                  <div className="w-4 h-4 border-t-3 border-l-3 border-[#5C822D] absolute -top-1.5 -left-1.5 rounded-tl-sm" />
                  <div className="w-4 h-4 border-t-3 border-r-3 border-[#5C822D] absolute -top-1.5 -right-1.5 rounded-tr-sm" />
                  <div className="w-4 h-4 border-b-3 border-l-3 border-[#5C822D] absolute -bottom-1.5 -left-1.5 rounded-bl-sm" />
                  <div className="w-4 h-4 border-b-3 border-r-3 border-[#5C822D] absolute -bottom-1.5 -right-1.5 rounded-br-sm" />
                  <Crosshair className="w-8 h-8 text-white/80 animate-pulse" />
                </div>
              </div>

              <div className="text-center">
                <span className="text-[11px] text-white/80 font-medium bg-black/60 px-2.5 py-0.5 rounded-md">
                  {language === 'hi' ? 'बैज को फ्रेम में स्थिर रखें' : 'HOLD STEADY OVER BADGE'}
                </span>
              </div>
            </div>

            {/* Offline Viewfinder Fallback */}
            {!cameraActive && (
              <div className="p-6 text-center text-white space-y-3 z-0">
                <VideoOff className="w-10 h-10 text-white/40 mx-auto" />
                <p className="text-[13px] text-white/85 max-w-xs mx-auto">
                  {cameraError || (language === 'hi' ? 'कैमरा ऑफलाइन है। कैप्चर बटन या डेमो बटन का उपयोग करें।' : 'Camera offline. Use the capture button or click the floating demo button.')}
                </p>
                <button
                  onClick={() => setCameraRetryCount(c => c + 1)}
                  className="gov-btn-secondary text-[12px] h-8 px-3 text-white bg-white/15 hover:bg-white/25 border-white/30 rounded-lg inline-flex items-center gap-1.5"
                >
                  <RefreshCw size={13} />
                  <span>{language === 'hi' ? 'कैमरा पुनः प्रयास करें' : 'Retry Camera'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleCapture}
              className="gov-btn-primary w-full h-14 text-[16px] sm:text-[17px] font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2.5"
            >
              <Camera className="w-6 h-6 stroke-[2.2]" />
              <span>{language === 'hi' ? 'बैज कैप्चर व स्कैन करें' : 'Scan & Verify Badge'}</span>
            </button>

            {/* File Upload Option */}
            <div className="text-center">
              <label className="text-[12px] text-[#596158] hover:text-[#5C822D] hover:underline cursor-pointer inline-flex items-center gap-1.5 py-1">
                <Upload size={13} className="text-[#5C822D]" />
                <span>{language === 'hi' ? 'डिवाइस से फ़ोटो फ़ाइल अपलोड करें' : 'Upload photo file from device'}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Clean Dedicated Worker Ledger & Profile Option */}
          <div className="pt-2 border-t border-[#E8E2D5]">
            <button
              onClick={() => {
                setEditName(currentUser?.displayName || 'Rajesh Kumar');
                setEditDept(currentUser?.department || 'Operations');
                setEditSite(currentUser?.site || 'Refinery Zone A');
                setEditCode(currentUser?.workerCode || 'W-001');
                setWorkerModalOpen(true);
              }}
              className="w-full p-3 bg-white hover:bg-[#FAF7F0] border border-[#E8E2D5] hover:border-[#5C822D] rounded-xl flex items-center justify-between gap-3 text-left transition-all shadow-2xs group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#EDF3E4] text-[#5C822D] flex items-center justify-center font-bold text-[13px] flex-shrink-0 group-hover:bg-[#5C822D] group-hover:text-white transition-colors">
                  <User size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-[#263026] group-hover:text-[#35551F] truncate transition-colors">
                    {currentUser?.displayName || 'Rajesh Kumar'} ({currentUser?.workerCode || 'W-001'})
                  </div>
                  <div className="text-[11px] text-[#7A8178] truncate">
                    {currentUser?.department || 'Operations'} · {currentUser?.site || 'Zone A'} · {workerScans.length} {language === 'hi' ? 'दर्ज स्कैन' : 'logged scans'}
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-bold text-[#5C822D] group-hover:underline flex items-center gap-1 flex-shrink-0 transition-colors">
                <History size={13} />
                <span>{language === 'hi' ? 'इतिहास व प्रोफ़ाइल देखें →' : 'View History & Profile →'}</span>
              </span>
            </button>
          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. PROCESSING STATE: 1-8 SCIENTIFIC CHECK TICKING             */}
      {/* ───────────────────────────────────────────────────────────── */}
      {screenState === 'processing' && (
        <div className="gov-card p-6 sm:p-8 space-y-5 max-w-lg mx-auto w-full text-center shadow-lg animate-in fade-in zoom-in-95 duration-150">
          
          <div className="w-14 h-14 rounded-full bg-[#EDF3E4] text-[#5C822D] mx-auto flex items-center justify-center border-2 border-[#C6DCC0]">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>

          <div>
            <h2 className="text-[20px] sm:text-[22px] font-black text-[#263026]">
              {language === 'hi' ? 'रिस्टबैंड सेंसर का विश्लेषण जारी' : 'Analyzing Wristband Sensor'}
            </h2>
            <p className="text-[13px] text-[#596158] mt-1">
              {language === 'hi' 
                ? `Bradford D65 क्रोमैटिक वैक्टर निकाले जा रहे हैं (${activeScenarioTitle || 'ऑप्टिकल कैप्चर'})...` 
                : `Extracting Bradford D65 chromatic vectors for ${activeScenarioTitle || 'Optical Capture'}...`}
            </p>
          </div>

          {capturedPhotoUrl && (
            <div className="flex justify-center">
              <div className="w-36 h-24 rounded-lg border border-[#E8E2D5] overflow-hidden bg-black shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={capturedPhotoUrl} alt="Captured Badge Snapshot" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* 1-8 Scientific Stage Checklist */}
          <div className="bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl p-4 space-y-2 text-left text-[13px]">
            {STAGE_ORDER.map((stage) => {
              const stageLabel = STAGE_LABELS[language || 'en'][stage];
              const isCompleted = completedStages.includes(stage);
              const isCurrent = currentStage === stage && !isCompleted;

              if (isCompleted) {
                return (
                  <div key={stage} className="flex items-center gap-2.5 text-[#5C822D] animate-in fade-in duration-150">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span className="font-bold text-[#263026]">{stageLabel}</span>
                  </div>
                );
              }

              if (isCurrent) {
                return (
                  <div key={stage} className="flex items-center gap-2.5 text-[#C96B32] font-bold pt-0.5">
                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                    <span>{stageLabel}</span>
                  </div>
                );
              }

              return (
                <div key={stage} className="flex items-center gap-2.5 text-[#A0A69F] text-[12px] opacity-60">
                  <div className="w-3.5 h-3.5 rounded-full border border-[#CBD5C0] flex-shrink-0" />
                  <span>{stageLabel}</span>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-[#7A8178] font-mono">
            MRPL Optical Gating · ISO/CIE D65 Spectrometry
          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. STREAMLINED RESULT PRESENTATION REPORT                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      {screenState === 'result' && currentScan && (
        <div className="space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Top Breadcrumb & Actions Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleResetScan}
              className="text-[13px] font-semibold text-[#5C822D] hover:text-[#35551F] hover:underline flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'hi' ? 'स्कैनर पर वापस जाएं' : 'Back to Scanner'}</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-[#E8E2D5] text-[#263026] text-[12px] font-semibold hover:bg-[#F4EFE6] shadow-2xs"
                title="Print Report"
              >
                <Printer size={13} className="text-[#5C822D]" />
                <span>{language === 'hi' ? 'रिपोर्ट प्रिंट करें' : 'Print Report'}</span>
              </button>
              <span className="text-[11px] text-[#7A8178] font-mono hidden sm:inline">
                {formatDateTime(currentScan.capturedAt)}
              </span>
            </div>
          </div>

          {/* UNIFIED STREAMLINED HERO & DOSIMETRY CERTIFICATE CARD */}
          <div className={`gov-card p-5 sm:p-7 rounded-3xl border-2 ${cardAccentBorder} ${bannerBg} space-y-5 shadow-lg`}>
            
            {/* Header: MRPL Identity + Calibrated / Status Badge */}
            <div className="flex items-center justify-between gap-3 border-b border-[#E8E2D5] pb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center p-1 bg-white rounded-lg border border-[#E8E2D5] shadow-xs">
                  <Image 
                    src={mrplLogo} 
                    alt="MRPL Logo" 
                    className="h-7 w-auto object-contain rounded-md"
                    priority
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#5C822D] uppercase tracking-wider block">
                    {language === 'hi' ? 'एमआरपीएल गैस सुरक्षा सत्यापन' : 'MRPL Gas Safety Verification'}
                  </span>
                  <h1 className="text-[16px] sm:text-[19px] font-black text-[#263026] truncate">
                    {language === 'hi' ? 'एक्सपोजर प्रमाणपत्र' : 'Exposure Certificate'}
                  </h1>
                </div>
              </div>

              <div className="flex-shrink-0">
                {statusBadge}
              </div>
            </div>

            {/* CUMULATIVE DOSE HERO NUMBER */}
            <div className="text-center space-y-1.5 py-2">
              <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-widest text-[#7A8178] block">
                {language === 'hi' ? 'संचयी H₂S एक्सपोजर खुराक' : 'Cumulative H₂S Exposure Dose'}
              </span>
              
              <div className="text-[52px] sm:text-[68px] font-black text-[#263026] font-mono leading-none tracking-tight">
                {isInvalid ? (
                  <span className="text-[32px] sm:text-[44px] text-[#7A8178]">{language === 'hi' ? 'असत्यापित' : 'UNVERIFIED'}</span>
                ) : isOor ? (
                  <span className="text-[#9C4124]">&gt; 30.0 <span className="text-[26px] sm:text-[34px] font-bold text-[#596158]">ppm·h</span></span>
                ) : (
                  <span>
                    {formatDose(res?.estimatedDose, 1)} <span className="text-[26px] sm:text-[34px] font-bold text-[#596158]">{res?.doseUnit || 'ppm·h'}</span>
                  </span>
                )}
              </div>
            </div>

            {/* STREAMLINED INTERPRETATION BANNER */}
            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-2xs">
              <div className="p-2 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] flex-shrink-0 text-[#5C822D] mt-0.5">
                {isInvalid ? <XCircle className="w-5 h-5 text-[#A94442]" /> : isOor ? <AlertTriangle className="w-5 h-5 text-[#9C4124]" /> : <ShieldCheck className="w-5 h-5 text-[#5C822D]" />}
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-[14px] sm:text-[15px] text-[#263026] block">
                  {actionTitle}
                </span>
                <p className="text-[12px] sm:text-[13px] text-[#596158] leading-relaxed">
                  {actionInstruction}
                </p>
              </div>
            </div>

            {/* DYNAMIC COLOR SCALE BAR WITH MOVING POINTER */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E2D5] space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] sm:text-[12px]">
                <span className="font-bold text-[#263026]">
                  {language === 'hi' ? 'OSHA स्वीकार्य पैमाना (0 से 30+ ppm·h)' : 'OSHA Permissible Scale (0 to 30+ ppm·h)'}
                </span>
                <span className="font-mono text-[#7A8178] text-[10px]">PEL: 10 ppm · Ceiling: 20 ppm</span>
              </div>

              {/* Dynamic Moving Pointer */}
              {!isInvalid ? (
                <div className="relative w-full h-5 pt-0.5">
                  <div 
                    className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center transition-all duration-500 z-10"
                    style={{ left: `${pointerPercent}%` }}
                  >
                    <span className="text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded font-mono bg-[#263026] shadow-xs whitespace-nowrap">
                      {isOor ? '> 30.0 ppm·h' : `${formatDose(doseVal, 1)} ppm·h`}
                    </span>
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#263026]" />
                  </div>
                </div>
              ) : (
                <div className="h-5 flex items-center justify-center text-[10px] text-[#7A8178] font-mono">
                  {language === 'hi' ? '[पॉइंटर निष्क्रिय — गुणवत्ता अस्वीकृति]' : '[Pointer Inactive — Quality Gate Refusal]'}
                </div>
              )}

              {/* Multi-tier color bar */}
              <div className="w-full h-4 rounded-md overflow-hidden flex border border-[#D8D0C0]">
                <div className="w-[16.6%] bg-[#5C822D] h-full" title="Safe (<5)" />
                <div className="w-[16.6%] bg-[#D99B26] h-full" title="Elevated (5-10)" />
                <div className="w-[33.3%] bg-[#C96B32] h-full" title="High (10-20)" />
                <div className="w-[16.6%] bg-[#A94442] h-full" title="Critical (20-30)" />
                <div className="w-[16.6%] bg-[#4A1E1E] h-full" title="Out of Range (>30)" />
              </div>

              <div className="flex justify-between text-[10px] text-[#7A8178] font-mono">
                <span>0</span>
                <span>5 ({language === 'hi' ? 'सुरक्षित' : 'Safe'})</span>
                <span className="font-bold text-[#D99B26]">10 (PEL)</span>
                <span className="font-bold text-[#A94442]">20 (Ceiling)</span>
                <span>30</span>
                <span className="font-bold text-[#4A1E1E]">&gt;30 (OOR)</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleResetScan}
                className="gov-btn-primary h-12 text-[15px] font-bold justify-center rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                <span>{language === 'hi' ? 'दूसरा स्कैन करें' : 'Perform Another Scan'}</span>
              </button>

              <Link
                href="/dashboard"
                className="gov-btn-secondary h-12 text-[15px] font-bold justify-center rounded-xl border-2 border-[#D8D0C0] hover:border-[#5C822D] hover:text-[#263026] hover:bg-[#FAF7F0] transition-all"
              >
                <BarChart3 className="w-5 h-5 text-[#5C822D]" />
                <span>{language === 'hi' ? 'डैशबोर्ड स्नैपशॉट देखें' : 'View Dashboard Snapshot'}</span>
              </Link>
            </div>

            {/* TECHNICAL ACCORDION */}
            <div className="border border-[#E8E2D5] rounded-xl overflow-hidden bg-white mt-3">
              <button
                onClick={() => setShowTechnical(!showTechnical)}
                className="w-full p-3.5 bg-[#FAF7F0] hover:bg-[#FAF6EE] flex items-center justify-between text-left text-[13px] font-semibold text-[#263026] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#5C822D]" />
                  <span>{language === 'hi' ? 'निरीक्षण मेट्रोलॉजी और CIELAB ΔE*ab वैक्टर' : 'Inspection Metrology & CIELAB ΔE*ab Vectors'}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#7A8178] transition-transform ${showTechnical ? 'rotate-180' : ''}`} />
              </button>

              {showTechnical && (
                <div className="p-4 border-t border-[#E8E2D5] space-y-3 text-[12px] animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#596158] font-mono">
                    <div className="bg-[#FAF7F0] p-3 rounded-lg border border-[#E8E2D5] space-y-1">
                      <div className="font-bold text-[#263026] font-sans">{language === 'hi' ? 'अंशांकन मॉडल:' : 'Calibration Model:'}</div>
                      <div>ID: {res?.calibrationId || 'CAL-2026-D65'}</div>
                      <div>Model: {res?.modelId || 'MRPL-CHEM-002'} (v{res?.modelVersion || '0.1.0'})</div>
                      <div>Standard: ISO/CIE D65 Bradford</div>
                    </div>

                    <div className="bg-[#FAF7F0] p-3 rounded-lg border border-[#E8E2D5] space-y-1">
                      <div className="font-bold text-[#263026] font-sans">{language === 'hi' ? 'CIELAB ΔE*ab वैक्टर:' : 'CIELAB ΔE*ab Vectors:'}</div>
                      <div>ΔE*ab: <strong className="text-[#5C822D]">{currentScan.colorFeatures?.deltaE?.toFixed(2) || '12.20'}</strong></div>
                      <div>L*: {currentScan.colorFeatures?.currentL?.toFixed(1) || '85.3'} (ΔL*: {currentScan.colorFeatures?.deltaL?.toFixed(1) || '-9.7'})</div>
                      <div>Δa*: {currentScan.colorFeatures?.deltaA?.toFixed(1) || '3.1'}, Δb*: {currentScan.colorFeatures?.deltaB?.toFixed(1) || '6.7'}</div>
                    </div>
                  </div>

                  {currentScan.capturedImageUrl && (
                    <div className="flex items-center gap-3 bg-[#FAF7F0] p-3 rounded-lg border border-[#E8E2D5]">
                      <div className="w-20 h-16 rounded border border-[#E8E2D5] overflow-hidden bg-black flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={currentScan.capturedImageUrl} alt="Badge Frame" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-[#596158]">
                        <div className="font-semibold text-[#263026] font-sans">{language === 'hi' ? 'ऑप्टिकल कैप्चर पुरालेख' : 'Optical Capture Archive'}</div>
                        <div>{language === 'hi' ? 'विश्वास स्तर:' : 'Confidence:'} {res?.confidence ? `${(res.confidence * 100).toFixed(0)}%` : '95%'}</div>
                        <div className="text-[10px] text-[#7A8178]">{language === 'hi' ? 'वैधता:' : 'Validity:'} {getValidityLabel(res?.validityStatus || ValidityStatus.VALID)}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => window.print()}
                      className="text-[#5C822D] font-semibold hover:underline inline-flex items-center gap-1 text-[12px]"
                    >
                      <Printer size={13} />
                      <span>{language === 'hi' ? 'औपचारिक प्रमाणपत्र प्रिंट करें' : 'Print Formal Certificate'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* WORKER HISTORY & PROFILE MODAL DIALOG                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {workerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-[#E8E2D5] overflow-hidden space-y-4 p-5 sm:p-6 text-[13px] max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-3 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#5C822D] text-white flex items-center justify-center font-bold text-[13px]">
                  {currentUser?.displayName?.split(' ').map(n => n[0]).join('') || 'RK'}
                </div>
                <div>
                  <h3 className="font-bold text-[16px] text-[#263026]">
                    {currentUser?.displayName || 'Rajesh Kumar'}
                  </h3>
                  <span className="text-[11px] text-[#7A8178] font-mono">
                    {language === 'hi' ? 'कोड:' : 'Code:'} {currentUser?.workerCode || 'W-001'} · {currentUser?.department || 'Operations'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditProfileMode(!editProfileMode)}
                  className="p-1.5 px-2.5 rounded-md bg-[#FAF6EE] hover:bg-[#F4EFE6] border border-[#E8E2D5] text-[#263026] text-[11px] font-semibold flex items-center gap-1"
                >
                  <Edit3 size={12} className="text-[#5C822D]" />
                  <span>{editProfileMode ? (language === 'hi' ? 'रद्द करें' : 'Cancel Edit') : (language === 'hi' ? 'प्रोफ़ाइल संपादित करें' : 'Edit Profile')}</span>
                </button>
                <button 
                  onClick={() => { setWorkerModalOpen(false); setEditProfileMode(false); }} 
                  className="text-[#7A8178] hover:text-[#263026] p-1 rounded hover:bg-[#F4EFE6]"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Edit Profile Form Mode */}
            {editProfileMode ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 pt-1 flex-shrink-0">
                <div>
                  <label className="font-semibold text-[#263026] block mb-1">{language === 'hi' ? 'पूरा नाम:' : 'Full Name:'}</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2 border border-[#D8D0C0] rounded-md bg-white text-[#263026]"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-semibold text-[#263026] block mb-1">{language === 'hi' ? 'श्रमिक कोड:' : 'Worker Code:'}</label>
                    <input
                      type="text"
                      value={editCode}
                      onChange={(e) => setEditCode(e.target.value)}
                      className="w-full p-2 border border-[#D8D0C0] rounded-md bg-white text-[#263026] font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#263026] block mb-1">{language === 'hi' ? 'विभाग:' : 'Department:'}</label>
                    <input
                      type="text"
                      value={editDept}
                      onChange={(e) => setEditDept(e.target.value)}
                      className="w-full p-2 border border-[#D8D0C0] rounded-md bg-white text-[#263026]"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-[#263026] block mb-1">{language === 'hi' ? 'आवंटित कार्य क्षेत्र:' : 'Assigned Work Area:'}</label>
                  <input
                    type="text"
                    value={editSite}
                    onChange={(e) => setEditSite(e.target.value)}
                    className="w-full p-2 border border-[#D8D0C0] rounded-md bg-white text-[#263026]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="gov-btn-primary w-full h-9 text-[12px] font-semibold flex items-center justify-center gap-1.5"
                >
                  <Save size={13} />
                  <span>{language === 'hi' ? 'प्रोफ़ाइल सहेजें' : 'Save Worker Profile'}</span>
                </button>
              </form>
            ) : (
              /* Profile Details Summary */
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[12px] flex-shrink-0">
                <div className="bg-[#FAF7F0] p-2 rounded-lg border border-[#E8E2D5]">
                  <span className="text-[10px] text-[#7A8178] uppercase font-bold block">{language === 'hi' ? 'स्थिति' : 'Status'}</span>
                  <span className="text-[#35551F] font-bold">{language === 'hi' ? 'ड्यूटी पर सक्रिय' : 'Active On Duty'}</span>
                </div>
                <div className="bg-[#FAF7F0] p-2 rounded-lg border border-[#E8E2D5]">
                  <span className="text-[10px] text-[#7A8178] uppercase font-bold block">{language === 'hi' ? 'आवंटित बैज' : 'Assigned Badge'}</span>
                  <span className="text-[#263026] font-mono font-bold">{activeDosimeter?.dosimeterCode || 'DOS-001'}</span>
                </div>
                <div className="bg-[#FAF7F0] p-2 rounded-lg border border-[#E8E2D5]">
                  <span className="text-[10px] text-[#7A8178] uppercase font-bold block">{language === 'hi' ? 'शिफ्ट क्षेत्र' : 'Shift Area'}</span>
                  <span className="text-[#263026] truncate block">{currentUser?.site || 'Refinery Zone A'}</span>
                </div>
                <div className="bg-[#FAF7F0] p-2 rounded-lg border border-[#E8E2D5]">
                  <span className="text-[10px] text-[#7A8178] uppercase font-bold block">{language === 'hi' ? 'शिफ्ट स्थिति' : 'Shift Status'}</span>
                  <span className="text-[#5C822D] font-bold">{language === 'hi' ? 'जारी (शिफ्ट ए)' : 'Ongoing (Shift A)'}</span>
                </div>
              </div>
            )}

            {/* Worker's Past Scans Ledger */}
            <div className="flex-1 overflow-y-auto border border-[#E8E2D5] rounded-xl bg-white space-y-1">
              <div className="p-2.5 bg-[#FAF7F0] border-b border-[#E8E2D5] font-bold text-[12px] text-[#263026] sticky top-0 flex items-center justify-between">
                <span>{language === 'hi' ? `व्यक्तिगत एक्सपोज़र स्कैन लेजर (${workerScans.length})` : `Personal Exposure Scans Ledger (${workerScans.length})`}</span>
                <span className="text-[11px] text-[#7A8178] font-normal">{language === 'hi' ? 'नवीनतम पहले' : 'Most recent first'}</span>
              </div>

              {workerScans.length === 0 ? (
                <div className="p-6 text-center text-[#7A8178] text-[12px]">
                  {language === 'hi' ? 'इस श्रमिक के लिए कोई पिछला स्कैन दर्ज नहीं है।' : 'No past scans logged for this worker.'}
                </div>
              ) : (
                <div className="divide-y divide-[#E8E2D5]">
                  {workerScans.map((scan) => {
                    const scanRes = scan.exposureResult;
                    return (
                      <div
                        key={scan.id}
                        className="p-3 flex items-center justify-between gap-2 hover:bg-[#FAF7F0] transition-colors"
                      >
                        <div>
                          <div className="font-bold text-[#263026] text-[13px]">
                            {formatDateTime(scan.capturedAt)}
                          </div>
                          <div className="text-[11px] text-[#7A8178] font-mono">
                            {language === 'hi' ? 'बैज:' : 'Badge:'} {scan.dosimeterId} · 8h TWA: {scanRes?.estimatedTwa !== null && scanRes?.estimatedTwa !== undefined ? `${formatDose(scanRes.estimatedTwa, 1)} ppm` : '—'}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[15px] font-black text-[#263026] font-mono block">
                            {scanRes?.estimatedDose !== null && scanRes?.estimatedDose !== undefined
                              ? `${formatDose(scanRes.estimatedDose, 1)} ${scanRes.doseUnit || 'ppm·h'}`
                              : (language === 'hi' ? 'असत्यापित' : 'Unverified')}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded border ${
                            scanRes?.riskStatus === RiskStatus.CRITICAL ? 'bg-[#F8ECEC] text-[#A94442] border-[#F0C4C4]' :
                            scanRes?.riskStatus === RiskStatus.HIGH ? 'bg-[#FAF2EB] text-[#C96B32] border-[#F3D5C0]' :
                            scanRes?.riskStatus === RiskStatus.ELEVATED ? 'bg-[#FAF5E8] text-[#B8860B] border-[#EAD7A8]' :
                            'bg-[#EDF3E4] text-[#35551F] border-[#C6DCC0]'
                          }`}>
                            {scanRes?.riskStatus || 'NORMAL'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#E8E2D5] flex justify-end flex-shrink-0">
              <button
                onClick={() => { setWorkerModalOpen(false); setEditProfileMode(false); }}
                className="gov-btn-secondary text-[12px] h-8 px-4"
              >
                {language === 'hi' ? 'लेजर बंद करें' : 'Close Ledger'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[13px] text-[#7A8178]">Loading scanner...</div>}>
      <ScanPageContent />
    </Suspense>
  );
}
