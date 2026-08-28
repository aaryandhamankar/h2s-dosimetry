'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import { AlertStatus, AlertSeverity } from '@/types';
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function HSEAlertsPage() {
  const { alerts, acknowledgeAlert, currentUser } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'ACKNOWLEDGED'>('ALL');
  const [acknowledgingId, setAcknowledgingId] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const handleAcknowledge = async (id: string) => {
    if (acknowledgingId) return;
    setAcknowledgingId(id);
    try {
      await acknowledgeAlert(id, currentUser?.displayName || 'Safety Officer');
    } finally {
      setAcknowledgingId(null);
    }
  };

  if (!mounted) return <div className="text-[13px] text-[#7A8178]">Loading incident queue...</div>;

  const filtered = alerts
    .filter(a => filter === 'ALL' || a.status === filter)
    .sort((a, b) => {
      const sevOrder: Record<string, number> = { CRITICAL: 0, WARNING: 1, INFO: 2 };
      const sevDiff = (sevOrder[a.severity] ?? 3) - (sevOrder[b.severity] ?? 3);
      if (sevDiff !== 0) return sevDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E5DE] pb-3 sm:pb-4">
        <div>
          <span className="text-[11px] sm:text-[12px] font-bold text-[#5C822D] uppercase tracking-wider block">
            Incident Triage Dispatch
          </span>
          <h1 className="text-[18px] sm:text-[24px] font-bold text-[#263026]">Safety Incident & Alert Queue</h1>
          <p className="text-[13px] sm:text-[14px] text-[#596158]">Review and acknowledge exposure limit exceedance notifications</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-[12px] sm:text-[13px] overflow-x-auto">
          {(['ALL', 'OPEN', 'ACKNOWLEDGED'] as const).map(f => {
            const count = f === 'OPEN' 
              ? alerts.filter(a => a.status === AlertStatus.OPEN).length 
              : f === 'ACKNOWLEDGED' 
                ? alerts.filter(a => a.status === AlertStatus.ACKNOWLEDGED).length 
                : alerts.length;
            
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md font-semibold transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  filter === f
                    ? 'bg-[#5C822D] text-white shadow-2xs'
                    : 'bg-white border border-[#E7E5DE] text-[#596158] hover:bg-[#F7F6F1]'
                }`}
              >
                <span>{f}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  f === 'OPEN' && count > 0 
                    ? 'bg-[#A94442] text-white font-bold' 
                    : filter === f ? 'bg-white/20 text-white' : 'bg-[#E7E5DE] text-[#596158]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Alerts List */}
      {filtered.length === 0 ? (
        <div className="gov-card p-6 sm:p-10 text-center space-y-3">
          <CheckCircle2 className="w-8 sm:w-10 h-8 sm:h-10 text-[#5C822D] mx-auto" />
          <h2 className="text-[15px] sm:text-[16px] font-bold text-[#263026]">No Active Limit Exceedance Alerts</h2>
          <p className="text-[13px] sm:text-[14px] text-[#596158] max-w-sm mx-auto">
            All plant personnel dosimeters are currently within normal permissible workplace operating limits.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(alert => {
            const isCritical = alert.severity === AlertSeverity.CRITICAL;
            const isAcknowledged = alert.status === AlertStatus.ACKNOWLEDGED;

            return (
              <div
                key={alert.id}
                className={`gov-card p-4 sm:p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 ${
                  isCritical && !isAcknowledged ? 'border-l-4 border-l-[#A94442] bg-[#F7EAEA]' : ''
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-9 sm:w-10 h-9 sm:h-10 rounded-md flex items-center justify-center flex-shrink-0 ${
                    isCritical 
                      ? 'bg-[#F7EAEA] text-[#A94442] border border-[#F0C4C4]' 
                      : 'bg-[#FAEFE7] text-[#C96B32] border border-[#F3D5C0]'
                  }`}>
                    <AlertTriangle className="w-4 sm:w-5 h-4 sm:h-5" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`gov-badge ${
                        isCritical ? 'gov-badge-critical' : 'gov-badge-elevated'
                      } text-[10px] sm:text-[11px]`}>
                        {alert.severity}
                      </span>
                      <span className="font-bold text-[14px] sm:text-[15px] text-[#263026]">
                        {alert.reason}
                      </span>
                    </div>

                    <div className="text-[12px] sm:text-[13px] text-[#596158] flex items-center gap-2 flex-wrap">
                      <span>Worker: <strong className="text-[#263026]">{alert.workerId}</strong></span>
                      <span>•</span>
                      <span>Logged: <strong className="text-[#263026] font-mono">{formatDateTime(alert.createdAt)}</strong></span>
                      <span className="hidden xs:inline">•</span>
                      <span className="font-mono text-[11px] text-[#7A8178] hidden xs:inline">ID: {alert.id.substring(0, 10)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E7E5DE]/60">
                  {isAcknowledged ? (
                    <div className="text-right text-[12px] text-[#5C822D]">
                      <div className="flex items-center gap-1 font-semibold">
                        <CheckCircle2 size={13} />
                        <span>Acknowledged</span>
                      </div>
                      <div className="text-[#7A8178] text-[11px]">
                        By {alert.acknowledgedBy || 'Safety Officer'}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      disabled={acknowledgingId === alert.id}
                      className="gov-btn-primary w-full sm:w-auto h-9 px-4 text-[12px] sm:text-[13px] font-semibold flex items-center justify-center gap-1.5"
                    >
                      {acknowledgingId === alert.id ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          <span>Acknowledging...</span>
                        </>
                      ) : (
                        <span>Acknowledge Incident</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
