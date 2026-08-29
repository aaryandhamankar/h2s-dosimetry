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
  startShift: (workerId?: string) => void;
  endShift: () => void;
  pairDosimeter: (dosimeter: Dosimeter) => void;
  assignDosimeter: (dosimeterId: string) => void;
  
  addScan: (scan: Scan) => void;
  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (alertId: string, userId: string) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  
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

      setLanguage: (lang: Language) => set({ language: lang }),
      setFontSize: (size: 'sm' | 'md' | 'lg') => set({ fontSize: size }),
      setHighContrast: (val: boolean) => set({ highContrast: val }),
      toggleHighContrast: () => set(state => ({ highContrast: !state.highContrast })),
      setTeamModalOpen: (open: boolean) => set({ teamModalOpen: open }),
      
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
      
      startShift: (workerId?: string) => {
        const id = workerId || get().currentUser?.id || 'worker-001';
        const newShift: Shift = {
          id: `shift-${Date.now()}`,
          workerId: id,
          startTime: new Date().toISOString(),
          endTime: null,
          status: ShiftStatus.ACTIVE,
        };
        set(state => ({
          activeShift: newShift,
          shifts: [...state.shifts, newShift],
        }));
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
            activeDosimeter: null,
            assignedDosimeter: null,
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
          const newScans = [scan, ...state.scans];
          
          const riskStatus = scan.exposureResult?.riskStatus;
          let newAlerts = state.alerts;
          
          if (riskStatus === RiskStatus.HIGH || riskStatus === RiskStatus.CRITICAL || riskStatus === RiskStatus.ELEVATED) {
            const severity = riskStatus === RiskStatus.CRITICAL ? AlertSeverity.CRITICAL : 
                             riskStatus === RiskStatus.HIGH ? AlertSeverity.WARNING : 
                             AlertSeverity.INFO;
                             
            const alert: Alert = {
              id: `alert-${Date.now()}`,
              scanId: scan.id,
              workerId: scan.workerId,
              severity,
              reason: `H₂S exposure risk tier: ${riskStatus} (${scan.exposureResult?.estimatedDose || 0} ${scan.exposureResult?.doseUnit || 'ppm·h'})`,
              status: AlertStatus.OPEN,
              createdAt: new Date().toISOString(),
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
