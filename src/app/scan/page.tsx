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
  X, 
  XCircle, 
  Edit3, 
  Save, 
  History as HistoryIcon 
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { DemoScenario, RiskStatus, ValidityStatus, ProcessingStatus, Scan } from '@/types';
import { getScanPipeline } from '@/services/scientific/scan-processing-pipeline';
import { formatDateTime, formatDose, getValidityLabel } from '@/lib/utils';
import { sfx } from '@/lib/sound-effects';
import Image from 'next/image';
import { validateImage } from '@/services/scientific/image-validation-layer';
import { resolveCode } from '@/services/scientific/demo-code-engine';
import { useDemoConfigStore } from '@/stores/demo-config-store';
import { resolveActiveShift } from '@/services/shift-service';

function getScenarioBadgeImage(scenario: DemoScenario): string {
  const colors: Record<DemoScenario, string> = {
    [DemoScenario.NORMAL]: '#E8ECE2',
    [DemoScenario.ELEVATED]: '#C8B18A',
    [DemoScenario.HIGH]: '#8B6237',
    [DemoScenario.CRITICAL]: '#3B2818',
    [DemoScenario.INVALID]: '#E0DCD4',
    [DemoScenario.OUT_OF_RANGE]: '#1F140D',
  };
  const sensorColor = colors[scenario] || '#E8ECE2';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180">
    <rect width="240" height="180" rx="14" fill="#1C241C"/>
    <rect x="15" y="15" width="210" height="150" rx="10" fill="#FAF6EE" stroke="#D8D0C0" stroke-width="2"/>
    <rect x="25" y="30" width="85" height="115" rx="6" fill="${sensorColor}" stroke="#596158" stroke-width="1.5"/>
    <rect x="125" y="30" width="40" height="50" rx="3" fill="#FFFFFF" stroke="#D8D0C0" stroke-width="1.5"/>
    <rect x="175" y="30" width="40" height="50" rx="3" fill="#7A8178" stroke="#D8D0C0" stroke-width="1.5"/>
    <rect x="125" y="95" width="40" height="50" rx="3" fill="#00A3E0" stroke="#D8D0C0" stroke-width="1.5"/>
    <rect x="175" y="95" width="40" height="50" rx="3" fill="#E4007C" stroke="#D8D0C0" stroke-width="1.5"/>
    <text x="32" y="138" font-family="monospace" font-size="9" fill="#263026" font-weight="bold">H2S SENSOR</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

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

const STAGE_LABELS: Record<'en' | 'hi' | 'kn' | 'gu', Record<ProcessingStatus, string>> = {
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
  kn: {
    [ProcessingStatus.CAPTURED]: 'ಫೋಟೋ ಸೆರೆಹಿಡಿಯಲಾಗಿದೆ',
    [ProcessingStatus.VALIDATING_IMAGE]: '1. ತೀಕ್ಷ್ಣತೆ ಮತ್ತು ಹೊಳಪಿನ ಮೌಲ್ಯಮಾಪನ',
    [ProcessingStatus.DETECTING_DOSIMETER]: '2. ಸಂವೇದಕ ಗಡಿ ಪತ್ತೆ',
    [ProcessingStatus.EXTRACTING_ROI]: '3. 4-ಪ್ಯಾಚ್ ಗ್ರಿಡ್ ಹೊರತೆಗೆಯುವಿಕೆ',
    [ProcessingStatus.ANALYZING_REFERENCES]: '4. Bradford ಹೊಂದಾಣಿಕೆ ಲೆಕ್ಕಾಚಾರ',
    [ProcessingStatus.CORRECTING_COLOR]: '5. ISO D65 ಗೆ ಸಾಮಾನ್ಯೀಕರಣ',
    [ProcessingStatus.EXTRACTING_FEATURES]: '6. CIELAB ΔE*ab ಮಾಪನ',
    [ProcessingStatus.RUNNING_INFERENCE]: '7. ಎಕ್ಸ್‌ಪೋಶರ್ ಡೋಸ್ ಲೆಕ್ಕಾಚಾರ',
    [ProcessingStatus.VALIDATING_RESULT]: '8. ಸುರಕ್ಷತಾ ಅನುಸರಣೆ ಪ್ರಮಾಣೀಕರಣ',
    [ProcessingStatus.COMPLETE]: 'ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಂಡಿದೆ',
    [ProcessingStatus.INVALID]: 'ಗುಣಮಟ್ಟ ತಿರಸ್ಕಾರ',
    [ProcessingStatus.ERROR]: 'ಪ್ರಕ್ರಿಯೆ ದೋಷ',
  },
  gu: {
    [ProcessingStatus.CAPTURED]: 'ફોટો કેપ્ચર કર્યો',
    [ProcessingStatus.VALIDATING_IMAGE]: '1. તીક્ષ્ણતા અને ચમકની ચકાસણી',
    [ProcessingStatus.DETECTING_DOSIMETER]: '2. સેન્સર સીમા નક્કી કરવી',
    [ProcessingStatus.EXTRACTING_ROI]: '3. 4-પેચ ગ્રીડ નિષ્કર્ષણ',
    [ProcessingStatus.ANALYZING_REFERENCES]: '4. Bradford અનુકૂલન ગણતરી',
    [ProcessingStatus.CORRECTING_COLOR]: '5. ISO D65 સામાન્યકરણ',
    [ProcessingStatus.EXTRACTING_FEATURES]: '6. CIELAB ΔE*ab માપન',
    [ProcessingStatus.RUNNING_INFERENCE]: '7. એક્સપોઝર ડોઝની ગણતરી',
    [ProcessingStatus.VALIDATING_RESULT]: '8. સુરક્ષા અનુપાલન પ્રમાણીકરણ',
    [ProcessingStatus.COMPLETE]: 'ચકાસણી પૂર્ણ',
    [ProcessingStatus.INVALID]: 'ગુણવત્તા અસ્વીકાર',
    [ProcessingStatus.ERROR]: 'પ્રક્રિયા ભૂલ',
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
    shiftConfigs,
    scans, 
    addScan, 
    updateUserProfile, 
    language 
  } = useAppStore();

  // Demo config store — drives image-validation routing for live/upload captures
  const {
    demoModeEnabled,
    scanMode,
    fixedScenario,
    currentSequenceScenario,
    advanceSequence,
    codeMappings,
  } = useDemoConfigStore();

  // Screen states: 'viewfinder' | 'processing' | 'result'
  const [screenState, setScreenState] = useState<'viewfinder' | 'processing' | 'result'>('viewfinder');
  const [currentScan, setCurrentScan] = useState<Scan | null>(null);

  // Image validation rejection — shown as brief toast on viewfinder before resetting
  const [validationRejection, setValidationRejection] = useState<{ reason: string; status: string } | null>(null);
  // OCR scanning indicator — shown while Tesseract.js reads the image
  const [ocrScanning, setOcrScanning] = useState(false);

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

  // Metrology accordion & Thresholds explainer
  const [showTechnical, setShowTechnical] = useState(false);
  const [showThresholds, setShowThresholds] = useState(false);

  // Camera & Torch states
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameraRetryCount, setCameraRetryCount] = useState(0);

  const turnOffTorch = async () => {
    if (mediaStream) {
      const track = mediaStream.getVideoTracks()[0];
      if (track) {
        try {
          const capabilities = (track.getCapabilities ? track.getCapabilities() : {}) as { torch?: boolean };
          if (capabilities.torch) {
            await track.applyConstraints({
              advanced: [{ torch: false } as MediaTrackConstraintSet]
            });
          }
        } catch (e) {
          console.warn('Torch turn-off error:', e);
        }
      }
    }
    setTorchOn(false);
  };

  const stopCamera = () => {
    turnOffTorch();
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
    const finalImageUrl = imageUrl || getScenarioBadgeImage(scenario);
    setCapturedPhotoUrl(finalImageUrl);
    setCompletedStages([]);
    setCurrentStage(ProcessingStatus.VALIDATING_IMAGE);
    setScreenState('processing');

    const pipeline = getScanPipeline();
    const workerId = currentUser?.id || 'worker-001';
    const workerName = currentUser?.displayName || 'Rajesh Kumar';
    const shiftInfo = resolveActiveShift(workerId, shiftConfigs);
    const dosimeterCode = activeDosimeter?.dosimeterCode || 'DOS-001';
    const location = currentUser?.site || 'Refinery Zone A';

    try {
      const scan = await pipeline.processScenario(
        scenario,
        workerId,
        shiftInfo.shiftId,
        dosimeterCode,
        (status) => {
          setCurrentStage(status);
          setCompletedStages(prev => prev.includes(status) ? prev : [...prev, status]);
          const stepIdx = STAGE_ORDER.indexOf(status);
          if (stepIdx >= 0) {
            sfx.playStepTick(stepIdx + 1);
          }
        },
        finalImageUrl,
        {
          workerName,
          shiftName: shiftInfo.shiftName,
          shiftStart: shiftInfo.shiftStart,
          shiftEnd: shiftInfo.shiftEnd,
          location,
          dosimeterCode,
          bandCode: dosimeterCode,
          expiryStatus: activeDosimeter?.status === 'EXPIRED' ? 'EXPIRED' : 'ACTIVE',
        }
      );

      // Ensure all 8 stage labels are marked complete on finished
      setCompletedStages([...STAGE_ORDER]);

      addScan(scan);
      setCurrentScan(scan);

      // Trigger affirmative / warning / alarm sound based on certified outcome
      const resRisk = scan.exposureResult?.riskStatus;
      const isInv = scan.exposureResult?.validityStatus === ValidityStatus.INVALID_IMAGE || scan.exposureResult?.validityStatus === ValidityStatus.PROCESSING_ERROR || scan.scenarioId === DemoScenario.INVALID;
      const isOOR = scan.exposureResult?.validityStatus === ValidityStatus.OUT_OF_RANGE || scan.scenarioId === DemoScenario.OUT_OF_RANGE;

      setTimeout(() => {
        if (isInv) {
          sfx.playErrorRefusal();
        } else if (isOOR) {
          sfx.playOutOfRange();
        } else if (resRisk === RiskStatus.CRITICAL) {
          sfx.playCriticalAlarm();
        } else if (resRisk === RiskStatus.HIGH) {
          sfx.playHighAlarm();
        } else if (resRisk === RiskStatus.ELEVATED) {
          sfx.playElevatedWarning();
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

  /**
   * Core logic: Camera → Image Validation (strip detection + OCR) → Scan Mode → Pipeline
   *
   * 1. Run validateImage() — strip colour analysis + Tesseract.js OCR (async).
   * 2. If invalid: show rejection reason toast; do NOT proceed.
   * 3. If valid:
   *    a. Demo mode OFF → NORMAL (real CV model would replace this)
   *    b. Demo mode ON:
   *       - 'code': use OCR-extracted code → resolve from mapping
   *       - 'sequence': current sequence item, then advance
   *       - 'fixed': fixedScenario always
   *
   * ⚙ SCOPE: Replace the validateImage() call with a real backend CV API
   *   call when the production model is ready — everything else stays the same.
   */
  const resolveCaptureScenario = async (
    dataUrl: string,
    isInternal: boolean,
  ): Promise<{ scenario: DemoScenario; title: string } | null> => {
    // ── Step 1: Image Validation (async — strip detection + OCR) ─────────
    setOcrScanning(true);
    let validation: Awaited<ReturnType<typeof validateImage>>;
    try {
      validation = await validateImage(dataUrl, isInternal);
    } finally {
      setOcrScanning(false);
    }

    if (validation.status !== 'VALID_DOSIMETER') {
      const statusLabels: Record<string, string> = {
        GLARE_DETECTED: 'Glare Detected',
        PATCH_NOT_DETECTED: 'Patch Not Detected',
        PLEASE_RESCAN: 'Please Re-scan',
        INVALID_IMAGE: 'Invalid Image',
      };
      const reason = validation.rejectionReason ?? 'Invalid image';
      const statusLabel = statusLabels[validation.status] ?? 'Invalid Image';
      sfx.playErrorRefusal();
      setValidationRejection({ reason, status: statusLabel });
      setTimeout(() => setValidationRejection(null), 3500);
      return null;
    }

    // ── Step 2: Demo mode OFF → normal capture ────────────────────────────
    if (!demoModeEnabled) {
      return {
        scenario: DemoScenario.NORMAL,
        title: language === 'hi' ? 'लाइव कैप्चर' : 'Live Optical Capture',
      };
    }

    // ── Step 3a: Code mode — use OCR-extracted code ───────────────────────
    if (scanMode === 'code') {
      if (validation.demoCode) {
        const resolution = resolveCode(validation.demoCode, codeMappings);
        if (resolution.recognised && resolution.scenario) {
          return {
            scenario: resolution.scenario,
            title: `Code ${resolution.code} → ${resolution.scenario}`,
          };
        }
      }
      // No recognised code → fall through to sequence
    }

    // ── Step 3b: Sequence mode ────────────────────────────────────────────
    if (scanMode === 'sequence' || scanMode === 'code') {
      const scenario = currentSequenceScenario();
      advanceSequence();
      return { scenario, title: `Demo Scan (${scenario})` };
    }

    // ── Step 3c: Fixed mode ───────────────────────────────────────────────
    return { scenario: fixedScenario, title: `Demo — ${fixedScenario}` };
  };

  // Live Camera Capture with Shutter Sound
  const handleCapture = async () => {
    sfx.playCameraShutter();
    // Turn off torch automatically after clicking a picture
    turnOffTorch();

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // If live camera is not active or video has no dimensions, execute scenario directly
    if (!video || !canvas || !cameraActive || !video.videoWidth || video.videoWidth === 0) {
      const scenario = demoModeEnabled ? currentSequenceScenario() : DemoScenario.NORMAL;
      if (demoModeEnabled && scanMode === 'sequence') advanceSequence();
      executePipeline(
        scenario,
        language === 'hi' ? '1. सामान्य शिफ्ट (3.2 ppm·h)' : '1. Normal Shift (3.2 ppm·h)',
      );
      return;
    }

    try {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const resolved = await resolveCaptureScenario(dataUrl, false);
        if (!resolved) return; // Rejected by validation — toast already shown
        executePipeline(resolved.scenario, resolved.title, dataUrl);
      } else {
        // Canvas unavailable — fallback directly to demo-config
        const scenario = demoModeEnabled ? currentSequenceScenario() : DemoScenario.NORMAL;
        if (demoModeEnabled && scanMode === 'sequence') advanceSequence();
        executePipeline(
          scenario,
          language === 'hi' ? '1. सामान्य शिफ्ट (3.2 ppm·h)' : '1. Normal Shift (3.2 ppm·h)',
        );
      }
    } catch {
      const scenario = demoModeEnabled ? currentSequenceScenario() : DemoScenario.NORMAL;
      if (demoModeEnabled && scanMode === 'sequence') advanceSequence();
      executePipeline(
        scenario,
        language === 'hi' ? '1. सामान्य शिफ्ट (3.2 ppm·h)' : '1. Normal Shift (3.2 ppm·h)',
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
          setCameraError(language === 'hi' ? 'कैमरा उपलब्ध नहीं है।' : 'Camera unavailable.');
          setCameraActive(false);
        }
        return;
      }

      try {
        setCameraError(null);
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
        } catch {
          // Fallback to any available video camera (laptop webcam, front cam)
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }

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
          setCameraError(language === 'hi' ? 'कैमरा पूर्वावलोकन उपलब्ध नहीं है।' : 'Camera preview is unavailable.');
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

  // Dispose Tesseract.js worker when scan page unmounts
  useEffect(() => {
    return () => {
      import('@/services/scientific/ocr-engine').then(({ disposeOcrEngine }) => {
        disposeOcrEngine();
      }).catch(() => {});
    };
  }, []);

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
    turnOffTorch();
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      const resolved = await resolveCaptureScenario(dataUrl, false);
      if (!resolved) return; // Rejected by validation — toast already shown
      await executePipeline(
        resolved.scenario,
        language === 'hi' ? `अपलोड की गई फ़ोटो (${file.name})` : `Uploaded Photo (${file.name})`,
        dataUrl,
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

  // Unified dynamic styling & action guidance reflecting result interpretation
  let statusBadge = (
    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] sm:text-[13px] font-bold bg-[#EDF5E5] text-[#35551F] border border-[#C6DCC0] shadow-2xs">
      <CheckCircle2 className="w-4 h-4 text-[#5C822D]" />
      <span>{language === 'hi' ? 'सुरक्षित बेसलाइन' : 'SAFE BASELINE'}</span>
    </span>
  );
  let actionTitle = language === 'hi' ? 'सामान्य शिफ्ट प्रक्रिया' : 'Normal Shift Procedure';
  let actionInstruction = language === 'hi' ? 'मानक पीपीई के साथ निर्धारित शिफ्ट संचालन जारी रखें।' : 'Continue scheduled operations with standard PPE.';
  let doseTextColor = 'text-[#35551F]';
  let doseUnitColor = 'text-[#5C822D]';
  let cardAccentBorder = 'border-[#C6DCC0]';
  let bannerBg = 'bg-[#FAFDF6]';
  let actionBoxBorder = 'border-[#C6DCC0]';
  let actionBoxBg = 'bg-[#EDF5E5]';
  let actionIconColor = 'text-[#35551F]';

  if (isInvalid) {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] sm:text-[13px] font-bold bg-[#FAF6EE] text-[#7A8178] border border-[#D8D0C0] shadow-2xs">
        <XCircle className="w-4 h-4 text-[#A94442]" />
        <span>{language === 'hi' ? 'अमान्य स्कैन / चमक' : 'UNVERIFIED / GLARE'}</span>
      </span>
    );
    actionTitle = language === 'hi' ? 'रीडिंग अस्वीकृत — चमक / धुंधलापन' : 'Reading Refused — Glare / Optical Blur';
    actionInstruction = language === 'hi' ? 'अत्यधिक चमक या धुंधलापन पहचाना गया। रिस्टबैंड को फ्रेम में संरेखित कर दोबारा फोटो लें।' : 'Specular glare or blur detected. Re-align wristband inside frame and retake scan.';
    doseTextColor = 'text-[#7A8178]';
    doseUnitColor = 'text-[#7A8178]';
    cardAccentBorder = 'border-[#D8D0C0]';
    bannerBg = 'bg-[#FAF6EE]';
    actionBoxBorder = 'border-[#D8D0C0]';
    actionBoxBg = 'bg-[#EDE7DA]';
    actionIconColor = 'text-[#7A8178]';
  } else if (isOor) {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] sm:text-[13px] font-bold bg-[#FAF2EB] text-[#9C4124] border border-[#E8C4B8] shadow-2xs">
        <AlertTriangle className="w-4 h-4 text-[#9C4124]" />
        <span>{language === 'hi' ? 'सेंसर संतृप्त' : 'SENSOR SATURATED'}</span>
      </span>
    );
    actionTitle = language === 'hi' ? 'सेंसर संतृप्ति (>30.0 ppm·h)' : 'Sensor Saturation (>30.0 ppm·h)';
    actionInstruction = language === 'hi' ? 'मैट्रिक्स 30 ppm·h सीमा पार कर गया है। विस्तृत विश्लेषण के लिए बैज एचएसई लैब में जमा करें।' : 'Matrix exceeded 30 ppm·h ceiling. Submit wristband to HSE lab for chromatographic analysis.';
    doseTextColor = 'text-[#9C4124]';
    doseUnitColor = 'text-[#9C4124]';
    cardAccentBorder = 'border-[#E8C4B8]';
    bannerBg = 'bg-[#FAF3EE]';
    actionBoxBorder = 'border-[#E8C4B8]';
    actionBoxBg = 'bg-[#F7E5DB]';
    actionIconColor = 'text-[#9C4124]';
  } else if (res?.riskStatus === RiskStatus.CRITICAL) {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] sm:text-[13px] font-bold bg-[#FFF0F0] text-[#A94442] border border-[#F0C4C4] shadow-2xs animate-pulse">
        <ShieldAlert className="w-4 h-4 text-[#A94442]" />
        <span>{language === 'hi' ? 'गंभीर अलार्म' : 'CRITICAL HAZARD'}</span>
      </span>
    );
    actionTitle = language === 'hi' ? 'तत्काल सुरक्षा कार्रवाई: क्षेत्र खाली करें' : 'Mandatory Action: Immediate Evacuation';
    actionInstruction = language === 'hi' ? 'सुरक्षा सीमा पार हो गई है। तुरंत हवा की विपरीत दिशा में निकलें और आपातकालीन नियंत्रण को सूचित करें।' : 'Ceiling threshold exceeded. Evacuate upwind immediately and report to emergency safety officer.';
    doseTextColor = 'text-[#A94442]';
    doseUnitColor = 'text-[#A94442]';
    cardAccentBorder = 'border-[#F0C4C4]';
    bannerBg = 'bg-[#FFF6F6]';
    actionBoxBorder = 'border-[#F0C4C4]';
    actionBoxBg = 'bg-[#FCE8E8]';
    actionIconColor = 'text-[#A94442]';
  } else if (res?.riskStatus === RiskStatus.HIGH) {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] sm:text-[13px] font-bold bg-[#FFF5F2] text-[#C96B32] border border-[#F3D5C0] shadow-2xs">
        <AlertTriangle className="w-4 h-4 text-[#C96B32]" />
        <span>{language === 'hi' ? 'उच्च एक्सपोज़र' : 'HIGH EXPOSURE'}</span>
      </span>
    );
    actionTitle = language === 'hi' ? 'कार्रवाई आवश्यक — पीपीई व वेंटिलेशन जांचें' : 'Action Required — Inspect PPE & Check Ventilation';
    actionInstruction = language === 'hi' ? '10 ppm 8h TWA सीमा के करीब। क्षेत्र में प्रवेश सीमित करें और रेस्पिरेटर की जांच करें।' : 'Approaching 10 ppm 8h TWA limit. Restrict zone access and verify breathing apparatus.';
    doseTextColor = 'text-[#C96B32]';
    doseUnitColor = 'text-[#C96B32]';
    cardAccentBorder = 'border-[#F3D5C0]';
    bannerBg = 'bg-[#FFFBF7]';
    actionBoxBorder = 'border-[#F3D5C0]';
    actionBoxBg = 'bg-[#FDF0E6]';
    actionIconColor = 'text-[#C96B32]';
  } else if (res?.riskStatus === RiskStatus.ELEVATED) {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] sm:text-[13px] font-bold bg-[#FFFDF5] text-[#B8860B] border border-[#EAD7A8] shadow-2xs">
        <AlertTriangle className="w-4 h-4 text-[#B8860B]" />
        <span>{language === 'hi' ? 'मध्यम स्तर' : 'ELEVATED LEVEL'}</span>
      </span>
    );
    actionTitle = language === 'hi' ? 'सावधानी बरतें — सुपरवाइज़र को बताएं' : 'Caution Advised — Notify Shift Supervisor';
    actionInstruction = language === 'hi' ? 'मध्यम रंग परिवर्तन देखा गया। स्थानीय वेंटिलेशन की जांच करें और सुपरवाइज़र को रिपोर्ट करें।' : 'Moderate sensor shift observed. Verify local ventilation and report reading to shift supervisor.';
    doseTextColor = 'text-[#B8860B]';
    doseUnitColor = 'text-[#B8860B]';
    cardAccentBorder = 'border-[#EAD7A8]';
    bannerBg = 'bg-[#FFFDF7]';
    actionBoxBorder = 'border-[#EAD7A8]';
    actionBoxBg = 'bg-[#FAF3E0]';
    actionIconColor = 'text-[#B8860B]';
  }

  return (
    <div className="flex-1 flex flex-col justify-center py-4 sm:py-8 px-3 sm:px-6 max-w-[760px] mx-auto w-full">
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. INITIAL CAMERA-FIRST SCANNER STATE                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {screenState === 'viewfinder' && (
        <div className="space-y-4">
          
          {/* Clean Title & Guidance */}
          <div className="text-center space-y-0.5 pt-1">
            <h1 className="text-[22px] sm:text-[26px] font-black text-[#263026]">
              {language === 'hi' ? 'रिस्टबैंड स्कैन करें' : 'Scan Wristband'}
            </h1>
            <p className="text-[13px] sm:text-[14px] text-[#596158]">
              {language === 'hi' ? 'रिस्टबैंड को फ्रेम के अंदर रखें।' : 'Position the wristband inside the frame.'}
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

            {/* OCR Scanning Overlay — shown while Tesseract.js reads the code */}
            {ocrScanning && (
              <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full border-4 border-white/20 border-t-white animate-spin" />
                <div className="text-center">
                  <div className="text-white font-black text-[13px]">Reading Code…</div>
                  <div className="text-white/70 text-[11px] mt-0.5">Tesseract OCR running</div>
                </div>
              </div>
            )}

            {/* Validation Rejection Toast */}
            {validationRejection && (
              <div className="absolute bottom-4 left-3 right-3 z-30 animate-in slide-in-from-bottom-2 duration-200">
                <div className="bg-[#A94442]/95 backdrop-blur-sm border border-[#C96B32] rounded-xl px-4 py-3 flex items-start gap-3 shadow-xl">
                  <div className="shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7.5" stroke="white" strokeOpacity="0.7"/>
                      <path d="M8 4.5V8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="8" cy="11" r="0.75" fill="white"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-black text-[12px] leading-tight">{validationRejection.status}</div>
                    <div className="text-white/80 text-[11px] mt-0.5 leading-snug">{validationRejection.reason}</div>
                  </div>
                </div>
              </div>
            )}


            {/* Offline Viewfinder Fallback */}
            {!cameraActive && (
              <div className="p-6 text-center text-white space-y-3 z-0">
                <VideoOff className="w-9 h-9 text-white/40 mx-auto" />
                <p className="text-[13px] text-white/80 max-w-xs mx-auto">
                  {cameraError || (language === 'hi' ? 'कैमरा पूर्वावलोकन उपलब्ध नहीं है।' : 'Camera preview is currently unavailable.')}
                </p>
                <button
                  onClick={() => setCameraRetryCount(c => c + 1)}
                  className="gov-btn-secondary text-[12px] h-8 px-3 text-white bg-white/15 hover:bg-white/25 border-white/30 rounded-lg inline-flex items-center gap-1.5"
                >
                  <RefreshCw size={13} />
                  <span>{language === 'hi' ? 'पुनः प्रयास करें' : 'Retry Camera'}</span>
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
            Optical Gating · ISO/CIE D65 Spectrometry
          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. MOBILE-FIRST EXPOSURE RESULT SCREEN                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      {screenState === 'result' && currentScan && (
        <div className="space-y-3.5 sm:space-y-4 max-w-[580px] md:max-w-[700px] mx-auto w-full animate-in fade-in duration-200">
          
          {/* 1. Compact Top Bar */}
          <div className="flex items-center justify-between gap-2 px-1">
            <button
              onClick={handleResetScan}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#5C822D] hover:text-[#35551F] active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'hi' ? 'नया स्कैन' : 'Scan'}</span>
            </button>

            <div className="text-center">
              <h1 className="text-[14px] sm:text-[15px] font-bold text-[#263026]">
                {language === 'hi' ? 'एक्सपोजर परिणाम' : 'Exposure Result'}
              </h1>
              <span className="text-[10.5px] text-[#7A8178] font-mono block">
                {formatDateTime(currentScan.capturedAt)}
              </span>
            </div>

            <button
              onClick={() => window.print()}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-white border border-[#E8E2D5] text-[#596158] hover:text-[#263026] hover:bg-[#FAF8F3] active:scale-95 transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold"
              title={language === 'hi' ? 'रिपोर्ट प्रिंट करें' : 'Print Report'}
            >
              <Printer size={14} className="text-[#5C822D]" />
              <span className="hidden sm:inline">{language === 'hi' ? 'प्रिंट' : 'Print'}</span>
            </button>
          </div>

          {/* Operator & Shift Context Ribbon */}
          <div className="flex items-center justify-between text-[11.5px] sm:text-[12px] bg-[#FAF8F3] px-3.5 py-2 rounded-xl border border-[#E8E2D5] text-[#596158]">
            <div className="font-bold text-[#263026] truncate">
              {currentScan.workerName || currentUser?.displayName || 'Rajesh Kumar'}
              <span className="font-normal text-[#7A8178] ml-1.5">({currentScan.location || currentUser?.site || 'Zone A'})</span>
            </div>
            <div className="flex items-center gap-2 font-mono flex-shrink-0">
              <span>Badge: <strong className="text-[#263026]">{currentScan.dosimeterCode || currentScan.dosimeterId}</strong></span>
              <span>•</span>
              <span className="text-[#5C822D] font-bold bg-[#EDF3E4] px-1.5 py-0.2 rounded border border-[#C6DCC0]">
                {currentScan.shiftName || 'Shift A'} ({currentScan.shiftStart || '06:00'}–{currentScan.shiftEnd || '14:00'})
              </span>
            </div>
          </div>

          {/* 2. Main Safety & Exposure Hero Card */}
          <div className={`p-5 sm:p-6 rounded-3xl border ${cardAccentBorder} ${bannerBg} shadow-sm space-y-4 transition-all`}>
            
            {/* 2a. Safety Status Hero Pill */}
            <div className="flex justify-center">
              {statusBadge}
            </div>

            {/* 2b. Exposure Value: Largest Visual Hero */}
            <div className="text-center space-y-1 py-0.5">
              <div className={`text-[48px] sm:text-[62px] font-black ${doseTextColor} font-mono leading-none tracking-tight transition-colors duration-300`}>
                {isInvalid ? (
                  <span className="text-[28px] sm:text-[38px] text-[#7A8178]">
                    {language === 'hi' ? 'अमान्य स्कैन' : 'UNVERIFIED'}
                  </span>
                ) : isOor ? (
                  <span>
                    &gt; 30.0 <span className={`text-[22px] sm:text-[28px] font-bold ${doseUnitColor}`}>ppm·h</span>
                  </span>
                ) : (
                  <span>
                    {formatDose(res?.estimatedDose, 1)}{' '}
                    <span className={`text-[22px] sm:text-[28px] font-bold ${doseUnitColor}`}>
                      {res?.doseUnit || 'ppm·h'}
                    </span>
                  </span>
                )}
              </div>
              <p className="text-[12px] sm:text-[13px] font-medium text-[#7A8178]">
                {language === 'hi' ? 'संचयी H₂S एक्सपोज़र' : 'Cumulative H₂S exposure'}
              </p>
            </div>

            {/* 2c. Clear Action Recommendation Box */}
            <div className={`bg-white/90 backdrop-blur-xs border ${actionBoxBorder} rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 shadow-2xs transition-colors duration-300`}>
              <div className={`p-2 rounded-xl ${actionBoxBg} border ${actionBoxBorder} flex-shrink-0 ${actionIconColor} mt-0.5 transition-colors duration-300`}>
                {isInvalid ? (
                  <XCircle className="w-4 h-4" />
                ) : isOor ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : res?.riskStatus === RiskStatus.CRITICAL ? (
                  <ShieldAlert className="w-4 h-4" />
                ) : res?.riskStatus === RiskStatus.HIGH || res?.riskStatus === RiskStatus.ELEVATED ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="font-bold text-[13px] sm:text-[14px] text-[#263026] leading-snug">
                  {actionTitle}
                </div>
                <p className="text-[12px] text-[#596158] leading-relaxed">
                  {actionInstruction}
                </p>
              </div>
            </div>

          </div>

          {/* 3. Compact Exposure Scale Card */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E2D5] shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-bold text-[#263026]">
                {language === 'hi' ? 'एक्सपोज़र स्तर' : 'Exposure Level'}
              </span>
              <span className="text-[11px] font-mono font-bold text-[#7A8178]">
                {isInvalid ? '—' : isOor ? '> 30.0 ppm·h' : `${formatDose(doseVal, 1)} ppm·h`}
              </span>
            </div>

            {/* Gauge bar with moving pointer needle */}
            <div className="space-y-1.5">
              {!isInvalid && (
                <div className="relative w-full h-3.5">
                  <div
                    className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500 z-10"
                    style={{ left: `${pointerPercent}%` }}
                  >
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#263026]" />
                  </div>
                </div>
              )}

              <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-[#E8E2D5]">
                <div className="w-[16.6%] bg-[#5C822D]" title="Safe (0-5 ppm·h)" />
                <div className="w-[16.6%] bg-[#D99B26]" title="Elevated (5-10 ppm·h)" />
                <div className="w-[33.3%] bg-[#C96B32]" title="High (10-20 ppm·h)" />
                <div className="w-[16.6%] bg-[#A94442]" title="Critical (20-30 ppm·h)" />
                <div className="w-[16.9%] bg-[#4A1E1E]" title="Out of Range (>30 ppm·h)" />
              </div>

              <div className="flex justify-between text-[10px] text-[#7A8178] font-mono pt-0.5">
                <span>0</span>
                <span className="text-[#35551F] font-semibold">5 ({language === 'hi' ? 'सुरक्षित' : 'Safe'})</span>
                <span className="font-semibold text-[#D99B26]">10 (PEL)</span>
                <span className="font-semibold text-[#A94442]">20 (Ceiling)</span>
                <span className="font-bold text-[#4A1E1E]">30+</span>
              </div>
            </div>

            {/* Collapsible Thresholds Explainer */}
            <div className="pt-2 border-t border-[#F0EBE0]">
              <button
                onClick={() => setShowThresholds(!showThresholds)}
                className="text-[11px] font-semibold text-[#5C822D] hover:text-[#35551F] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{language === 'hi' ? 'एक्सपोज़र सीमा मानक देखें' : 'View exposure thresholds'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showThresholds ? 'rotate-180' : ''}`} />
              </button>

              {showThresholds && (
                <div className="mt-2 p-2.5 bg-[#FAF8F3] rounded-xl text-[11px] text-[#596158] space-y-1.5 animate-in fade-in duration-150 font-mono">
                  <div className="flex justify-between"><strong className="text-[#35551F] font-sans">0 – 5 ppm·h:</strong> <span>Safe Baseline (Normal Shift)</span></div>
                  <div className="flex justify-between"><strong className="text-[#D99B26] font-sans">5 – 10 ppm·h:</strong> <span>Elevated Exposure (Advisory)</span></div>
                  <div className="flex justify-between"><strong className="text-[#C96B32] font-sans">10 ppm (8h TWA):</strong> <span>OSHA PEL Action Limit</span></div>
                  <div className="flex justify-between"><strong className="text-[#A94442] font-sans">20 ppm:</strong> <span>OSHA Ceiling Limit (Evacuation)</span></div>
                  <div className="flex justify-between"><strong className="text-[#4A1E1E] font-sans">&gt; 30 ppm·h:</strong> <span>Sensor Saturation (Lab GC)</span></div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Actions: Mobile Stack (Scan Again + History) */}
          <div className="space-y-2 pt-0.5">
            <button
              onClick={handleResetScan}
              className="gov-btn-primary w-full h-12 text-[15px] font-bold rounded-xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'hi' ? 'दोबारा स्कैन करें' : 'Scan Again'}</span>
            </button>

            <div className="text-center pt-0.5">
              <Link
                href="/worker/history"
                className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#596158] hover:text-[#263026] py-1 px-3 rounded-lg hover:bg-black/5 transition-colors"
              >
                <span>{language === 'hi' ? 'स्कैन इतिहास देखें →' : 'View History →'}</span>
              </Link>
            </div>
          </div>

          {/* 5. Collapsible Technical Details Accordion */}
          <div className="border border-[#E8E2D5] rounded-2xl overflow-hidden bg-white shadow-2xs">
            <button
              onClick={() => setShowTechnical(!showTechnical)}
              className="w-full p-3.5 bg-[#FAF8F3] hover:bg-[#F4EFE6] flex items-center justify-between text-left text-[12px] font-semibold text-[#596158] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-[#5C822D]" />
                <span>{language === 'hi' ? 'तकनीकी विवरण एवं मेट्रोलॉजी' : 'Technical Details & Metrology'}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#7A8178] transition-transform ${showTechnical ? 'rotate-180' : ''}`} />
            </button>

            {showTechnical && (
              <div className="p-4 border-t border-[#E8E2D5] space-y-3 text-[11px] animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-[#596158]">
                  <div className="bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8E2D5] space-y-1">
                    <div className="font-bold text-[#263026] font-sans text-[11px]">{language === 'hi' ? 'अंशांकन व मॉडल:' : 'Calibration & Model:'}</div>
                    <div>ID: {res?.calibrationId || 'CAL-2026-D65'}</div>
                    <div>Model: {res?.modelId || 'DOSIM-CHEM-002'} (v{res?.modelVersion || '0.1.0'})</div>
                    <div>Standard: ISO/CIE D65 Bradford</div>
                  </div>

                  <div className="bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8E2D5] space-y-1">
                    <div className="font-bold text-[#263026] font-sans text-[11px]">{language === 'hi' ? 'CIELAB ΔE*ab वैक्टर:' : 'CIELAB ΔE*ab Vectors:'}</div>
                    <div>ΔE*ab: <strong className="text-[#5C822D]">{currentScan.colorFeatures?.deltaE?.toFixed(2) || '12.20'}</strong></div>
                    <div>L*: {currentScan.colorFeatures?.currentL?.toFixed(1) || '85.3'} (ΔL*: {currentScan.colorFeatures?.deltaL?.toFixed(1) || '-9.7'})</div>
                    <div>Δa*: {currentScan.colorFeatures?.deltaA?.toFixed(1) || '3.1'}, Δb*: {currentScan.colorFeatures?.deltaB?.toFixed(1) || '6.7'}</div>
                  </div>
                </div>

                {currentScan.capturedImageUrl && (
                  <div className="flex items-center gap-3 bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8E2D5]">
                    <div className="w-16 h-14 rounded-lg border border-[#E8E2D5] overflow-hidden bg-black flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={currentScan.capturedImageUrl} alt="Badge Capture" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-[#596158] space-y-0.5">
                      <div className="font-semibold text-[#263026] font-sans text-[11px]">{language === 'hi' ? 'ऑप्टिकल कैप्चर' : 'Optical Capture'}</div>
                      <div>{language === 'hi' ? 'विश्वास स्तर:' : 'Confidence:'} {res?.confidence ? `${(res.confidence * 100).toFixed(0)}%` : '95%'}</div>
                      <div className="text-[10px] text-[#7A8178]">{language === 'hi' ? 'वैधता:' : 'Validity:'} {getValidityLabel(res?.validityStatus || ValidityStatus.VALID)}</div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => window.print()}
                    className="text-[#5C822D] font-semibold hover:underline inline-flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    <Printer size={12} />
                    <span>{language === 'hi' ? 'औपचारिक प्रमाणपत्र प्रिंट करें' : 'Print Formal Certificate'}</span>
                  </button>
                </div>
              </div>
            )}
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
