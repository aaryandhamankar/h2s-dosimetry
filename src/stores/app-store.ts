import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  User, 
  Shift, 
  Dosimeter, 
  Scan, 
  Alert, 
  RiskStatus, 
  AlertSeverity, 
  AlertStatus, 
  ShiftStatus
} from '@/types';
import { getDemoScans, getDemoAlerts, DEMO_WORKERS, DEMO_DOSIMETERS, DEMO_SHIFTS, HSE_USER } from '@/data/demo-data';
import { ShiftConfig, DEFAULT_SHIFT_CONFIGS } from '@/services/shift-service';

import { Language } from '@/lib/i18n';

export interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  activeShift: Shift | null;
  activeDosimeter: Dosimeter | null;
  assignedDosimeter: Dosimeter | null;
  
  workers: User[];
  shifts: Shift[];
  dosimeters: Dosimeter[];
  scans: Scan[];
  alerts: Alert[];
  
  isDemoMode: boolean;
  showDemoPanel: boolean;

  language: Language;
  fontSize: 'sm' | 'md' | 'lg';
  highContrast: boolean;
  
  setLanguage: (lang: Language) => void;
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  setHighContrast: (val: boolean) => void;
  toggleHighContrast: () => void;
  
  login: (user: User, role?: string) => void;
  logout: () => void;
  setCurrentUser: (user: User | null) => void;
  startShift: (workerId?: string, startTime?: string) => void;
  endShift: () => void;
  pauseShift: () => void;
  resumeShift: () => void;
  updateShiftStartTime: (startTime: string) => void;
  setShiftElapsedMinutes: (elapsedMinutes: number) => void;
  pairDosimeter: (dosimeter: Dosimeter) => void;
  assignDosimeter: (dosimeterId: string) => void;
  
  addScan: (scan: Scan) => void;
  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (alertId: string, userId: string) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  
  shiftConfigs: ShiftConfig[];
  updateShiftConfig: (shiftId: string, updates: Partial<ShiftConfig>) => void;
  setShiftConfigs: (configs: ShiftConfig[]) => void;
  
  shiftTimerModalOpen: boolean;
  setShiftTimerModalOpen: (open: boolean) => void;
  teamModalOpen: boolean;
  setTeamModalOpen: (open: boolean) => void;
  toggleDemoMode: () => void;
  toggleDemoPanel: () => void;
  resetDemo: () => void;
  initializeDemoData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: DEMO_WORKERS[0] || null,
      isAuthenticated: true,
      activeShift: DEMO_SHIFTS[0] || null,
      activeDosimeter: DEMO_DOSIMETERS[0] || null,
      assignedDosimeter: DEMO_DOSIMETERS[0] || null,
      
      workers: [...DEMO_WORKERS, HSE_USER],
      shifts: [...DEMO_SHIFTS],
      dosimeters: [...DEMO_DOSIMETERS],
      scans: getDemoScans(),
      alerts: getDemoAlerts(),
      
      isDemoMode: true,
      showDemoPanel: false,

      language: 'en',
      fontSize: 'md',
      highContrast: false,
      teamModalOpen: false,
      shiftTimerModalOpen: false,
      shiftConfigs: DEFAULT_SHIFT_CONFIGS,

      setLanguage: (lang: Language) => set({ language: lang }),
      setFontSize: (size: 'sm' | 'md' | 'lg') => set({ fontSize: size }),
      setHighContrast: (val: boolean) => set({ highContrast: val }),
      toggleHighContrast: () => set(state => ({ highContrast: !state.highContrast })),
      setTeamModalOpen: (open: boolean) => set({ teamModalOpen: open }),
      setShiftTimerModalOpen: (open: boolean) => set({ shiftTimerModalOpen: open }),
      
      updateShiftConfig: (shiftId: string, updates: Partial<ShiftConfig>) => {
        set(state => {
          const updatedConfigs = (state.shiftConfigs || DEFAULT_SHIFT_CONFIGS).map(cfg =>
            cfg.id === shiftId ? { ...cfg, ...updates } : cfg
          );
          return { shiftConfigs: updatedConfigs };
        });
      },
      
      setShiftConfigs: (configs: ShiftConfig[]) => {
        set({ shiftConfigs: configs });
      },
      
      login: (user: User) => {
        set({
          currentUser: user,
          isAuthenticated: true,
        });
      },
      
      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
          activeShift: null,
          activeDosimeter: null,
          assignedDosimeter: null,
        });
      },
      
      setCurrentUser: (user) => set({ currentUser: user, isAuthenticated: !!user }),
      
      startShift: (workerId?: string, startTime?: string) => {
        const id = workerId || get().currentUser?.id || 'worker-001';
        const newShift: Shift = {
          id: `shift-${Date.now()}`,
          workerId: id,
          startTime: startTime || new Date().toISOString(),
          endTime: null,
          status: ShiftStatus.ACTIVE,
        };
        set(state => ({
          activeShift: newShift,
          shifts: [...state.shifts, newShift],
        }));
      },
      
      pauseShift: () => {
        set(state => {
          if (!state.activeShift) return state;
          const updated = {
            ...state.activeShift,
            status: ShiftStatus.PAUSED,
          };
          return {
            activeShift: updated,
            shifts: state.shifts.map(s => s.id === updated.id ? updated : s),
          };
        });
      },

      resumeShift: () => {
        set(state => {
          if (!state.activeShift) return state;
          const updated = {
            ...state.activeShift,
            status: ShiftStatus.ACTIVE,
          };
          return {
            activeShift: updated,
            shifts: state.shifts.map(s => s.id === updated.id ? updated : s),
          };
        });
      },

      updateShiftStartTime: (startTime: string) => {
        set(state => {
          if (!state.activeShift) return state;
          const updated = {
            ...state.activeShift,
            startTime,
          };
          return {
            activeShift: updated,
            shifts: state.shifts.map(s => s.id === updated.id ? updated : s),
          };
        });
      },

      setShiftElapsedMinutes: (elapsedMinutes: number) => {
        set(state => {
          const newStart = new Date(Date.now() - elapsedMinutes * 60 * 1000).toISOString();
          if (!state.activeShift) {
            const newShift: Shift = {
              id: `shift-${Date.now()}`,
              workerId: state.currentUser?.id || 'worker-001',
              startTime: newStart,
              endTime: null,
              status: ShiftStatus.ACTIVE,
            };
            return {
              activeShift: newShift,
              shifts: [...state.shifts, newShift],
            };
          }
          const updated = {
            ...state.activeShift,
            startTime: newStart,
            status: ShiftStatus.ACTIVE,
          };
          return {
            activeShift: updated,
            shifts: state.shifts.map(s => s.id === updated.id ? updated : s),
          };
        });
      },

      endShift: () => {
        set(state => {
          if (!state.activeShift) return state;
          const updatedShift = {
            ...state.activeShift,
            endTime: new Date().toISOString(),
            status: ShiftStatus.COMPLETED,
          };
          return {
            activeShift: null,
            shifts: state.shifts.map(s => s.id === updatedShift.id ? updatedShift : s),
          };
        });
      },
      
      pairDosimeter: (dosimeter: Dosimeter) => {
        set({
          activeDosimeter: dosimeter,
          assignedDosimeter: dosimeter,
        });
      },
      
      assignDosimeter: (dosimeterId: string) => {
        set(state => {
          const dosimeter = state.dosimeters.find(d => d.id === dosimeterId) || null;
          return {
            activeDosimeter: dosimeter,
            assignedDosimeter: dosimeter,
          };
        });
      },
      
      addScan: (scan: Scan) => {
        set(state => {
          // Normalize and guarantee all canonical fields
          const worker = state.workers.find(w => w.id === scan.workerId) || state.currentUser;
          const canonicalScan: Scan = {
            ...scan,
            scanId: scan.scanId || scan.id,
            timestamp: scan.timestamp || scan.capturedAt,
            workerName: scan.workerName || worker?.displayName || 'Rajesh Kumar',
            shiftName: scan.shiftName || 'Shift A (Morning)',
            shiftStart: scan.shiftStart || '06:00',
            shiftEnd: scan.shiftEnd || '14:00',
            dosimeterCode: scan.dosimeterCode || scan.bandCode || scan.dosimeterId || 'DOS-001',
            bandCode: scan.bandCode || scan.dosimeterCode || scan.dosimeterId || 'DOS-001',
            h2sReading: scan.h2sReading ?? scan.exposureResult?.estimatedDose ?? null,
            doseUnit: scan.doseUnit || scan.exposureResult?.doseUnit || 'ppm·h',
            riskLevel: scan.riskLevel || scan.exposureResult?.riskStatus || RiskStatus.NORMAL,
            status: scan.status || scan.exposureResult?.riskStatus || RiskStatus.NORMAL,
            expiryStatus: scan.expiryStatus || 'ACTIVE',
            location: scan.location || worker?.site || 'Refinery Zone A',
          };

          const newScans = [canonicalScan, ...state.scans];
          
          const riskStatus = canonicalScan.riskLevel || canonicalScan.exposureResult?.riskStatus;
          let newAlerts = state.alerts;
          
          if (riskStatus === RiskStatus.HIGH || riskStatus === RiskStatus.CRITICAL || riskStatus === RiskStatus.ELEVATED) {
            const severity = riskStatus === RiskStatus.CRITICAL ? AlertSeverity.CRITICAL : 
                             riskStatus === RiskStatus.HIGH ? AlertSeverity.WARNING : 
                             AlertSeverity.INFO;
                             
            const alert: Alert = {
              id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              scanId: canonicalScan.id,
              workerId: canonicalScan.workerId,
              severity,
              reason: `H₂S ${riskStatus} risk detected for ${canonicalScan.workerName} (${canonicalScan.shiftName}): ${canonicalScan.h2sReading || 0} ${canonicalScan.doseUnit}`,
              status: AlertStatus.OPEN,
              createdAt: canonicalScan.capturedAt || new Date().toISOString(),
              acknowledgedBy: null,
              acknowledgedAt: null,
            };
            newAlerts = [alert, ...state.alerts];
          }
          
          return {
            scans: newScans,
            alerts: newAlerts,
          };
        });
      },
      
      addAlert: (alert: Alert) => {
        set(state => ({ alerts: [alert, ...state.alerts] }));
      },
      
      acknowledgeAlert: (alertId: string, userId: string) => {
        set(state => ({
          alerts: state.alerts.map(a => 
            a.id === alertId 
              ? { 
                  ...a, 
                  status: AlertStatus.ACKNOWLEDGED,
                  acknowledgedBy: userId,
                  acknowledgedAt: new Date().toISOString(),
                } 
              : a
          ),
        }));
      },
      
      updateUserProfile: (updates: Partial<User>) => {
        set(state => {
          if (!state.currentUser) return state;
          const updatedUser = { ...state.currentUser, ...updates };
          return {
            currentUser: updatedUser,
            workers: state.workers.map(w => w.id === updatedUser.id ? updatedUser : w),
          };
        });
      },
      
      toggleDemoMode: () => set(state => ({ isDemoMode: !state.isDemoMode })),
      toggleDemoPanel: () => set(state => ({ showDemoPanel: !state.showDemoPanel })),
      
      resetDemo: () => {
        const defaultWorker = DEMO_WORKERS[0];
        const defaultShift = DEMO_SHIFTS[0];
        const defaultDosimeter = DEMO_DOSIMETERS[0];
        
        set({
          currentUser: defaultWorker,
          isAuthenticated: true,
          activeShift: defaultShift,
          activeDosimeter: defaultDosimeter,
          assignedDosimeter: defaultDosimeter,
          workers: [...DEMO_WORKERS, HSE_USER],
          shifts: [...DEMO_SHIFTS],
          dosimeters: [...DEMO_DOSIMETERS],
          scans: getDemoScans(),
          alerts: getDemoAlerts(),
          isDemoMode: true,
          showDemoPanel: false,
        });
      },
      
      initializeDemoData: () => {
        const state = get();
        if (state.scans.length === 0) {
          state.resetDemo();
        }
      },
    }),
    {
      name: 'h2s-dosimeter-storage',
    }
  )
);
