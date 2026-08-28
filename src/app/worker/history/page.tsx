'use client';

import { useAppStore } from '@/stores/app-store';
import { 
  ChevronRight, 
  History as HistoryIcon, 
  Camera, 
  User, 
  Edit3, 
  X, 
  Save, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Layers
} from 'lucide-react';
import { formatDateTime, formatDose } from '@/lib/utils';
import { ValidityStatus, RiskStatus, ShiftStatus } from '@/types';
import { TRANSLATIONS } from '@/lib/i18n';
import { useState } from 'react';
import Link from 'next/link';

export default function HistoryPage() {
  const { 
    scans, 
    currentUser, 
    activeShift, 
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

  const userScans = scans
    .filter(s => !currentUser || s.workerId === currentUser.id)
    .sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime());

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
    <div className="space-y-4 sm:space-y-6">
      
      {/* 1. LAST SCAN PROMINENT HIGHLIGHT CARD */}
      {latestScan ? (
        <div className="gov-card p-4 sm:p-6 border-2 border-[#5C822D]/30 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E5DE] pb-2.5">
            <span className="text-[11px] sm:text-[12px] font-bold text-[#5C822D] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {t.lastScanTitle}
            </span>
            <span className="text-[11px] sm:text-[12px] text-[#7A8178]">
              {formatDateTime(latestScan.capturedAt)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`gov-badge ${
                  latestScan.exposureResult?.riskStatus === RiskStatus.NORMAL
                    ? 'gov-badge-normal'
                    : latestScan.exposureResult?.riskStatus === RiskStatus.ELEVATED
                    ? 'gov-badge-elevated'
                    : latestScan.exposureResult?.riskStatus === RiskStatus.HIGH
                    ? 'gov-badge-high'
                    : 'gov-badge-critical'
                } text-[11px] sm:text-[12px]`}>
                  {latestScan.exposureResult?.riskStatus || 'VERIFIED'}
                </span>
                <span className="font-mono text-[12px] text-[#596158]">
                  Badge: <strong className="text-[#263026]">{latestScan.dosimeterId}</strong>
                </span>
              </div>

              <div className="text-[12px] sm:text-[13px] text-[#596158] pt-0.5">
                <strong>Action:</strong> {getActionSummary(latestScan.exposureResult?.riskStatus)}
              </div>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-center">
              <div className="text-right">
                <div className="text-[24px] sm:text-[28px] font-black text-[#263026] font-mono leading-none">
                  {latestScan.exposureResult?.estimatedDose !== null && latestScan.exposureResult?.estimatedDose !== undefined
                    ? `${formatDose(latestScan.exposureResult.estimatedDose)} ${latestScan.exposureResult.doseUnit}`
                    : 'Unverified'}
                </div>
                <div className="text-[11px] text-[#7A8178] mt-0.5">
                  8h TWA: {latestScan.exposureResult?.estimatedTwa !== null && latestScan.exposureResult?.estimatedTwa !== undefined ? `${formatDose(latestScan.exposureResult.estimatedTwa)} ppm` : 'N/A'}
                </div>
              </div>

              <Link
                href={`/worker/result?scanId=${latestScan.id}`}
                className="gov-btn-primary h-10 px-3 text-[12px] sm:text-[13px] font-semibold flex items-center gap-1 shadow-xs"
              >
                <span>Details</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="gov-card p-4 text-center text-[13px] text-[#7A8178]">
          No previous scan recorded yet. Use the scanner tab to log your first reading.
        </div>
      )}

      {/* 2. WORKER PROFILE DETAILS CARD & EDIT FORM */}
      <div className="gov-card p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#E7E5DE] pb-2.5">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#5C822D]" />
            <h2 className="text-[14px] sm:text-[15px] font-bold text-[#263026]">
              Worker Profile Dossier
            </h2>
          </div>

          <button
            onClick={() => {
              setEditName(currentUser?.displayName || 'Rajesh Kumar');
              setEditDept(currentUser?.department || 'Operations');
              setEditSite(currentUser?.site || 'Refinery Zone A');
              setEditCode(currentUser?.workerCode || 'W-001');
              setEditModalOpen(true);
            }}
            className="p-1.5 px-2.5 rounded-md bg-[#F7F6F1] hover:bg-[#F0EFE9] border border-[#E7E5DE] text-[#263026] text-[12px] font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Edit3 size={13} className="text-[#5C822D]" />
            <span>Edit Details</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[12px] sm:text-[13px]">
          <div className="bg-[#FAFBF9] p-2.5 rounded border border-[#E7E5DE]">
            <span className="text-[10px] text-[#7A8178] uppercase font-bold block">Operator Name</span>
            <strong className="text-[#263026] truncate block">{currentUser?.displayName || 'Rajesh Kumar'}</strong>
          </div>
          <div className="bg-[#FAFBF9] p-2.5 rounded border border-[#E7E5DE]">
            <span className="text-[10px] text-[#7A8178] uppercase font-bold block">Worker Code</span>
            <span className="text-[#263026] font-mono font-bold">{currentUser?.workerCode || 'W-001'}</span>
          </div>
          <div className="bg-[#FAFBF9] p-2.5 rounded border border-[#E7E5DE]">
            <span className="text-[10px] text-[#7A8178] uppercase font-bold block">Department</span>
            <span className="text-[#263026] truncate block">{currentUser?.department || 'Operations'}</span>
          </div>
          <div className="bg-[#FAFBF9] p-2.5 rounded border border-[#E7E5DE]">
            <span className="text-[10px] text-[#7A8178] uppercase font-bold block">Work Area</span>
            <span className="text-[#263026] truncate block">{currentUser?.site || 'Refinery Zone A'}</span>
          </div>
        </div>
      </div>

      {/* 3. RECENT / HISTORICAL READINGS LIST (Clean, Compact Mobile Cards) */}
      <div className="gov-card overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-[#E7E5DE] bg-[#FAFBF9] text-[12px] sm:text-[13px] font-bold text-[#263026] uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <HistoryIcon size={14} className="text-[#5C822D]" />
            <span>Exposure Scan Ledger ({userScans.length})</span>
          </span>
          <span className="text-[#7A8178] text-[11px] sm:text-[12px]">Chronological</span>
        </div>

        {userScans.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <HistoryIcon className="w-8 h-8 text-[#7A8178] mx-auto" />
            <p className="text-[13px] text-[#596158]">No exposure readings logged yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E7E5DE]">
            {userScans.map((scan) => {
              const res = scan.exposureResult;
              const isValid = res?.validityStatus === ValidityStatus.VALID;

              let badge = <span className="gov-badge gov-badge-normal text-[10px] sm:text-[11px]">Normal</span>;
              if (res?.riskStatus === RiskStatus.ELEVATED) {
                badge = <span className="gov-badge gov-badge-elevated text-[10px] sm:text-[11px]">Elevated</span>;
              } else if (res?.riskStatus === RiskStatus.HIGH) {
                badge = <span className="gov-badge gov-badge-high text-[10px] sm:text-[11px]">High</span>;
              } else if (res?.riskStatus === RiskStatus.CRITICAL) {
                badge = <span className="gov-badge gov-badge-critical text-[10px] sm:text-[11px]">Critical</span>;
              } else if (!isValid) {
                badge = <span className="gov-badge gov-badge-neutral text-[10px] sm:text-[11px]">Unverified</span>;
              }

              return (
                <Link
                  key={scan.id}
                  href={`/worker/result?scanId=${scan.id}`}
                  className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#FAFBF9] transition-colors group"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    {scan.capturedImageUrl ? (
                      <div className="w-11 sm:w-13 h-9 sm:h-10 rounded border border-[#E7E5DE] overflow-hidden bg-black flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={scan.capturedImageUrl} alt="Badge" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded bg-[#F7F6F1] border border-[#E7E5DE] flex items-center justify-center text-[#7A8178] flex-shrink-0">
                        <Camera size={15} />
                      </div>
                    )}

                    <div className="min-w-0 space-y-0.5">
                      <div className="font-semibold text-[13px] sm:text-[14px] text-[#263026] group-hover:text-[#5C822D] truncate">
                        {formatDateTime(scan.capturedAt)}
                      </div>
                      <div className="text-[11px] text-[#596158] font-mono truncate">
                        Badge: {scan.dosimeterId} · {currentUser?.site || 'Zone A'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-[14px] sm:text-[16px] font-bold text-[#263026] font-mono">
                        {res?.estimatedDose !== null && res?.estimatedDose !== undefined
                          ? `${formatDose(res.estimatedDose)} ${res.doseUnit}`
                          : 'Unverified'}
                      </div>
                      <div className="text-[10px] text-[#7A8178]">
                        TWA: {res?.estimatedTwa !== null && res?.estimatedTwa !== undefined ? `${formatDose(res.estimatedTwa)} ppm` : '—'}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {badge}
                      <ChevronRight size={15} className="text-[#7A8178] group-hover:text-[#5C822D] hidden xs:inline" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* EDIT PROFILE MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-[#E7E5DE] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-4 border-b border-[#E7E5DE] flex items-center justify-between bg-[#FAFBF9]">
              <div className="flex items-center gap-2 font-bold text-[15px] text-[#263026]">
                <Edit3 className="w-4 h-4 text-[#5C822D]" />
                <span>Edit Profile Details</span>
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
                <label className="font-semibold text-[#263026] block mb-1">Full Name:</label>
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
                <label className="font-semibold text-[#263026] block mb-1">Assigned Plant Work Area:</label>
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
                  <span>Save Profile</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

