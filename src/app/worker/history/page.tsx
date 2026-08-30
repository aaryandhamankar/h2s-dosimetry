'use client';

import { useAppStore } from '@/stores/app-store';
import { 
  ChevronRight, 
  History as HistoryIcon, 
  User, 
  Edit3, 
  X, 
  Save, 
  Clock, 
  Sparkles
} from 'lucide-react';
import { formatDateTime, formatDose } from '@/lib/utils';
import { ValidityStatus, RiskStatus, Scan } from '@/types';
import { TRANSLATIONS } from '@/lib/i18n';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function getScanThumbnail(scan: Scan): string {
  if (scan.capturedImageUrl) {
    return scan.capturedImageUrl;
  }
  
  const colors: Record<string, string> = {
    NORMAL: '#E8ECE2',
    ELEVATED: '#C8B18A',
    HIGH: '#8B6237',
    CRITICAL: '#3B2818',
    INVALID: '#E0DCD4',
  };
  const status = scan.exposureResult?.riskStatus || 'NORMAL';
  const sensorColor = colors[status] || '#E8ECE2';
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

export default function HistoryPage() {
  const { 
    scans, 
    currentUser, 
    activeDosimeter,
    updateUserProfile,
    language 
  } = useAppStore();

  const t = TRANSLATIONS[language];

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(currentUser?.displayName || 'Rajesh Kumar');
  const [editDept, setEditDept] = useState(currentUser?.department || 'Operations');
  const [editSite, setEditSite] = useState(currentUser?.site || 'Refinery Zone A');
  const [editCode, setEditCode] = useState(currentUser?.workerCode || 'W-001');

  // Escape key listener for profile modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && editModalOpen) {
        setEditModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editModalOpen]);

  // Sorted scans: newest first (includes mock baseline + live scans + demo runs)
  const userScans = [...scans]
    .filter(s => !currentUser || s.workerId === currentUser.id || s.workerId === 'worker-001' || s.workerId === 'w-1')
    .sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime());

  // Recent scan linked directly to the most recent live scan or demo case
  const latestScan = userScans[0] || null;

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

  const getActionSummary = (status?: RiskStatus) => {
    if (status === RiskStatus.CRITICAL) return t.actionCritical;
    if (status === RiskStatus.HIGH) return t.actionHigh;
    if (status === RiskStatus.ELEVATED) return t.actionElevated;
    return t.actionNormal;
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-[840px] mx-auto w-full">
      
      {/* ════════════════════════════════════════════════════════════ */}
      {/* 1. TOP: OPERATOR PROFILE DOSSIER (Sleek & Non-Redundant)     */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div className="gov-card p-3.5 sm:p-4 rounded-2xl bg-white shadow-xs border border-[#E8E2D5] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#EDF3E4] border border-[#C6DCC0] text-[#5C822D] flex items-center justify-center font-bold text-[16px] shadow-2xs flex-shrink-0">
            <User size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h1 className="text-[15px] sm:text-[17px] font-black text-[#263026] leading-tight truncate">
                {currentUser?.displayName || 'Rajesh Kumar'}
              </h1>
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#5C822D] bg-[#EDF3E4] px-2 py-0.5 rounded-md border border-[#C6DCC0]">
                {currentUser?.workerCode || 'W-001'}
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-[#596158] bg-[#FAF7F0] px-2 py-0.5 rounded-md border border-[#E8E2D5]">
                {activeDosimeter?.dosimeterCode || 'DOS-001'}
              </span>
            </div>
            <p className="text-[11.5px] sm:text-[12.5px] text-[#7A8178] leading-tight mt-0.5 truncate">
              {currentUser?.department || 'Operations'} · {currentUser?.site || 'Refinery Zone A'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditName(currentUser?.displayName || 'Rajesh Kumar');
            setEditDept(currentUser?.department || 'Operations');
            setEditSite(currentUser?.site || 'Refinery Zone A');
            setEditCode(currentUser?.workerCode || 'W-001');
            setEditModalOpen(true);
          }}
          className="p-1.5 sm:px-3 sm:py-2 rounded-xl bg-[#FAF6EE] hover:bg-[#F4EFE6] border border-[#E8E2D5] hover:border-[#5C822D] text-[#263026] text-[11px] sm:text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer flex-shrink-0"
          title={language === 'hi' ? 'संपादित करें' : language === 'kn' ? 'ಸಂಪಾದಿಸಿ' : language === 'gu' ? 'સંપાદિત કરો' : 'Edit Profile'}
        >
          <Edit3 size={13} className="text-[#5C822D]" />
          <span className="hidden sm:inline">
            {language === 'hi' ? 'संपादित करें' : language === 'kn' ? 'ಸಂಪಾದಿಸಿ' : language === 'gu' ? 'સંપાદિત કરો' : 'Edit Profile'}
          </span>
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* 2. RECENT SCAN LINKED TO LATEST SCAN / DEMO CASE             */}
      {/* ════════════════════════════════════════════════════════════ */}
      {latestScan ? (
        <div className="gov-card p-4 sm:p-5 border-2 border-[#5C822D]/40 bg-[#FCFDFB] space-y-3 sm:space-y-3.5 shadow-md rounded-2xl">
          
          <div className="flex items-center justify-between border-b border-[#E7E5DE] pb-2">
            <span className="text-[11px] sm:text-[12px] font-bold text-[#5C822D] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#5C822D]" /> 
              {language === 'hi' 
                ? 'नवीनतम सत्यापित स्कैन' 
                : language === 'kn'
                ? 'ಇತ್ತೀಚಿನ ದೃಢೀಕರಿಸಿದ ಸ್ಕ್ಯಾನ್'
                : language === 'gu'
                ? 'તાજેતરનો ચકાસાયેલ સ્કેન'
                : 'Most Recent Verified Scan'}
            </span>
            <span className="text-[11px] sm:text-[12px] text-[#7A8178] flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-[#5C822D]" />
              {formatDateTime(latestScan.capturedAt)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            
            {/* Left: Clicked Photo Thumbnail & Badge Info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-14 sm:w-18 h-11 sm:h-13 rounded-lg border-2 border-[#D8D0C0] overflow-hidden bg-black flex-shrink-0 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={getScanThumbnail(latestScan)} 
                  alt="Clicked Badge Snapshot" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-0.5 sm:space-y-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className={`gov-badge ${
                    latestScan.exposureResult?.riskStatus === RiskStatus.NORMAL
                      ? 'gov-badge-normal'
                      : latestScan.exposureResult?.riskStatus === RiskStatus.ELEVATED
                      ? 'gov-badge-elevated'
                      : latestScan.exposureResult?.riskStatus === RiskStatus.HIGH
                      ? 'gov-badge-high'
                      : 'gov-badge-critical'
                  } text-[10px] sm:text-[11px] font-bold py-0.5 px-2 shadow-2xs`}>
                    {latestScan.exposureResult?.riskStatus || 'NORMAL'}
                  </span>
                  <span className="font-mono text-[11px] sm:text-[12px] text-[#596158]">
                    {language === 'hi' ? 'बैज:' : language === 'kn' ? 'ಬ್ಯಾಡ್ಜ್:' : language === 'gu' ? 'બેજ:' : 'Badge:'} <strong className="text-[#263026]">{latestScan.dosimeterId}</strong>
                  </span>
                </div>

                <div className="text-[11.5px] sm:text-[12.5px] text-[#596158] leading-tight truncate">
                  <strong className="text-[#263026]">
                    {language === 'hi' ? 'कार्रवाई:' : language === 'kn' ? 'ಕ್ರಮ:' : language === 'gu' ? 'પગલું:' : 'Action:'}
                  </strong> {getActionSummary(latestScan.exposureResult?.riskStatus)}
                </div>
              </div>
            </div>

            {/* Right: Dose Calculation & Link to Result Certificate */}
            <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8E2D5]">
              <div className="text-left sm:text-right">
                <div className="text-[18px] sm:text-[22px] font-black text-[#263026] font-mono leading-none">
                  {latestScan.exposureResult?.estimatedDose !== null && latestScan.exposureResult?.estimatedDose !== undefined
                    ? `${formatDose(latestScan.exposureResult.estimatedDose)} ${latestScan.exposureResult.doseUnit}`
                    : (language === 'hi' ? 'असत्यापित' : language === 'kn' ? 'ದೃಢೀಕರಿಸದ' : language === 'gu' ? 'અચકાસાયેલ' : 'Unverified')}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#7A8178] mt-0.5 font-medium">
                  8h TWA: {latestScan.exposureResult?.estimatedTwa !== null && latestScan.exposureResult?.estimatedTwa !== undefined ? `${formatDose(latestScan.exposureResult.estimatedTwa)} ppm` : '0.4 ppm'}
                </div>
              </div>

              <Link
                href={`/worker/result?scanId=${latestScan.id}`}
                className="gov-btn-primary h-9 sm:h-10 px-3 sm:px-3.5 text-[12px] sm:text-[13px] font-bold flex items-center gap-1 shadow-xs hover:shadow-md transition-all flex-shrink-0"
              >
                <span>
                  {language === 'hi' ? 'पूर्ण रिपोर्ट' : language === 'kn' ? 'ಪೂರ್ಣ ವರದಿ' : language === 'gu' ? 'સંપૂર્ણ રિપોર્ટ' : 'View Result'}
                </span>
                <ChevronRight size={14} />
              </Link>
            </div>

          </div>
        </div>
      ) : (
        <div className="gov-card p-6 text-center text-[13px] text-[#7A8178] bg-[#FAFBF9]">
          {language === 'hi' 
            ? 'अभी तक कोई पिछला स्कैन दर्ज नहीं किया गया है। स्कैनर टैब का उपयोग करके पहला स्कैन करें।' 
            : language === 'kn'
            ? 'ಇನ್ನೂ ಯಾವುದೇ ಹಿಂದಿನ ಸ್ಕ್ಯಾನ್ ದಾಖಲಾಗಿಲ್ಲ. ನಿಮ್ಮ ಮೊದಲ ರೀಡಿಂಗ್ ದಾಖಲಿಸಲು ಸ್ಕ್ಯಾನರ್ ಟ್ಯಾಬ್ ಬಳಸಿ.'
            : language === 'gu'
            ? 'હજુ સુધી કોઈ પાછલો સ્કેન નોંધાયેલ નથી. તમારું પ્રથમ રીડિંગ નોંધવા માટે સ્કેનર ટેબનો ઉપયોગ કરો.'
            : 'No previous scan recorded yet. Use the scanner tab to log your first exposure reading.'}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* 3. HISTORICAL EXPOSURE LEDGER (Mock Data + Live/Demo Scans)  */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div className="gov-card overflow-hidden shadow-sm border border-[#E7E5DE]">
        <div className="p-3.5 sm:p-4 border-b border-[#E7E5DE] bg-[#FAFBF9] text-[12px] sm:text-[13px] font-bold text-[#263026] uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-2">
            <HistoryIcon size={16} className="text-[#5C822D]" />
            <span>
              {language === 'hi' 
                ? `एक्सपोजर इतिहास लेजर (${userScans.length})` 
                : language === 'kn'
                ? `ಎಕ್ಸ್‌ಪೋಶರ್ ಇತಿಹಾಸ ಲೆಡ್ಜರ್ (${userScans.length})`
                : language === 'gu'
                ? `એક્સપોઝર ઇતિહાસ લેજર (${userScans.length})`
                : `Exposure History Ledger (${userScans.length})`}
            </span>
          </span>
          <span className="text-[#7A8178] text-[11px] font-normal normal-case">
            {language === 'hi' 
              ? 'सभी दर्ज स्कैन व फोटो' 
              : language === 'kn'
              ? 'ದಾಖಲಾದ ಬ್ಯಾಡ್ಜ್ ಸ್ಕ್ಯಾನ್‌ಗಳು ಮತ್ತು ಫೋಟೋಗಳು'
              : language === 'gu'
              ? 'નોંધાયેલા બેજ સ્કેન અને ફોટા'
              : 'Logged badge scans & photos'}
          </span>
        </div>

        {userScans.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <HistoryIcon className="w-8 h-8 text-[#7A8178] mx-auto" />
            <p className="text-[13px] text-[#596158]">
              {language === 'hi' 
                ? 'अभी तक कोई एक्सपोजर रीडिंग दर्ज नहीं की गई है।' 
                : language === 'kn'
                ? 'ಇನ್ನೂ ಯಾವುದೇ ಎಕ್ಸ್‌ಪೋಶರ್ ರೀಡಿಂಗ್ ದಾಖಲಾಗಿಲ್ಲ.'
                : language === 'gu'
                ? 'હજુ સુધી કોઈ એક્સપોઝર રીડિંગ નોંધાયેલ નથી.'
                : 'No exposure readings logged yet.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E7E5DE]">
            {userScans.map((scan) => {
              const res = scan.exposureResult;
              const isValid = res?.validityStatus === ValidityStatus.VALID;

              let badge = <span className="gov-badge gov-badge-normal text-[10px] sm:text-[11px] font-bold">{language === 'hi' ? 'सामान्य' : language === 'kn' ? 'ಸಾಮಾನ್ಯ' : language === 'gu' ? 'સામાન્ય' : 'Normal'}</span>;
              if (res?.riskStatus === RiskStatus.ELEVATED) {
                badge = <span className="gov-badge gov-badge-elevated text-[10px] sm:text-[11px] font-bold">{language === 'hi' ? 'मध्यम' : language === 'kn' ? 'ಮಧ್ಯಮ' : language === 'gu' ? 'મધ્યમ' : 'Elevated'}</span>;
              } else if (res?.riskStatus === RiskStatus.HIGH) {
                badge = <span className="gov-badge gov-badge-high text-[10px] sm:text-[11px] font-bold">{language === 'hi' ? 'उच्च' : language === 'kn' ? 'ಅಧಿಕ' : language === 'gu' ? 'ઉચ્ચ' : 'High'}</span>;
              } else if (res?.riskStatus === RiskStatus.CRITICAL) {
                badge = <span className="gov-badge gov-badge-critical text-[10px] sm:text-[11px] font-bold">{language === 'hi' ? 'गंभीर' : language === 'kn' ? 'ತುರ್ತು' : language === 'gu' ? 'ગંભીર' : 'Critical'}</span>;
              } else if (!isValid) {
                badge = <span className="gov-badge gov-badge-neutral text-[10px] sm:text-[11px] font-bold">{language === 'hi' ? 'अस्वीकृत' : language === 'kn' ? 'ತಿರಸ್ಕೃತ' : language === 'gu' ? 'અસ્વીકાર' : 'Refusal'}</span>;
              }

              return (
                <Link
                  key={scan.id}
                  href={`/worker/result?scanId=${scan.id}`}
                  className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#FAFBF9] transition-colors group cursor-pointer"
                >
                  {/* Left: Clicked Photo Thumbnail & Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 sm:w-14 h-9 sm:h-10 rounded-md border border-[#D8D0C0] overflow-hidden bg-black flex-shrink-0 shadow-2xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={getScanThumbnail(scan)} 
                        alt="Badge Snapshot" 
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="font-semibold text-[13px] sm:text-[14px] text-[#263026] group-hover:text-[#5C822D] truncate transition-colors">
                        {formatDateTime(scan.capturedAt)}
                      </div>
                      <div className="text-[11px] text-[#596158] font-mono truncate">
                        {language === 'hi' ? 'बैज:' : language === 'kn' ? 'ಬ್ಯಾಡ್ಜ್:' : language === 'gu' ? 'બેજ:' : 'Badge:'} {scan.dosimeterId} · {currentUser?.site || 'Zone A'}
                      </div>
                    </div>
                  </div>

                  {/* Right: Dose & Action Arrow */}
                  <div className="flex items-center gap-2.5 sm:gap-3.5 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-[13.5px] sm:text-[15.5px] font-bold text-[#263026] font-mono">
                        {res?.estimatedDose !== null && res?.estimatedDose !== undefined
                          ? `${formatDose(res.estimatedDose)} ${res.doseUnit}`
                          : (language === 'hi' ? 'असत्यापित' : language === 'kn' ? 'ದೃಢೀಕರಿಸದ' : language === 'gu' ? 'અચકાસાયેલ' : 'Unverified')}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-[#7A8178]">
                        TWA: {res?.estimatedTwa !== null && res?.estimatedTwa !== undefined ? `${formatDose(res.estimatedTwa)} ppm` : '—'}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {badge}
                      <ChevronRight size={15} className="text-[#7A8178] group-hover:text-[#5C822D] group-hover:translate-x-0.5 transition-all hidden xs:inline" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* 4. EDIT PROFILE MODAL                                         */}
      {/* ════════════════════════════════════════════════════════════ */}
      {editModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4"
          onClick={() => setEditModalOpen(false)}
        >
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-modal-title"
            className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-[#E7E5DE] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            
            <div className="p-4 border-b border-[#E7E5DE] flex items-center justify-between bg-[#FAFBF9]">
              <div className="flex items-center gap-2 font-bold text-[15px] text-[#263026]">
                <Edit3 className="w-4 h-4 text-[#5C822D]" />
                <span id="edit-profile-modal-title">
                  {language === 'hi' 
                    ? 'प्रोफ़ाइल विवरण संपादित करें' 
                    : language === 'kn'
                    ? 'ಪ್ರೊಫೈಲ್ ವಿವರ ಸಂಪಾದಿಸಿ'
                    : language === 'gu'
                    ? 'પ્રોફાઇલ વિગતો સંપાદિત કરો'
                    : 'Edit Profile Details'}
                </span>
              </div>
              <button 
                onClick={() => setEditModalOpen(false)}
                className="text-[#7A8178] hover:text-[#263026] p-1 rounded hover:bg-[#F0EFE9] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-4 sm:p-5 space-y-3.5 text-[13px]">
              <div>
                <label className="font-semibold text-[#263026] block mb-1">
                  {language === 'hi' ? 'पूरा नाम:' : language === 'kn' ? 'ಪೂರ್ಣ ಹೆಸರು:' : language === 'gu' ? 'પૂરું નામ:' : 'Full Name:'}
                </label>
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
                  <label className="font-semibold text-[#263026] block mb-1">
                    {language === 'hi' ? 'श्रमिक कोड:' : language === 'kn' ? 'ಕಾರ್ಮಿಕ ಕೋಡ್:' : language === 'gu' ? 'શ્રમિક કોડ:' : 'Worker Code:'}
                  </label>
                  <input
                    type="text"
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    className="w-full p-2.5 border border-[#D5D2C9] rounded-md bg-white text-[#263026] font-mono focus:outline-2 focus:outline-[#5C822D]"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#263026] block mb-1">
                    {language === 'hi' ? 'विभाग:' : language === 'kn' ? 'ವಿಭಾಗ:' : language === 'gu' ? 'વિભાગ:' : 'Department:'}
                  </label>
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
                <label className="font-semibold text-[#263026] block mb-1">
                  {language === 'hi' ? 'रिफाइनरी कार्य स्थल:' : language === 'kn' ? 'ರಿಫೈನರಿ ಕಾರ್ಯ ಸ್ಥಳ:' : language === 'gu' ? 'રિફાઇનરી કાર્ય સ્થળ:' : 'Refinery Work Site:'}
                </label>
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
                  className="gov-btn-secondary text-[12px] h-9 px-3 cursor-pointer"
                >
                  {language === 'hi' ? 'रद्द करें' : language === 'kn' ? 'ರದ್ದು' : language === 'gu' ? 'રદ કરો' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="gov-btn-primary text-[12px] h-9 px-4 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Save size={14} />
                  <span>
                    {language === 'hi' ? 'प्रोफ़ाइल सहेजें' : language === 'kn' ? 'ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ' : language === 'gu' ? 'પ્રોફાઇલ સાચવો' : 'Save Profile'}
                  </span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

