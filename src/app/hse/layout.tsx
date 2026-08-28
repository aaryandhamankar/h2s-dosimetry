'use client';

import { useAppStore } from '@/stores/app-store';
import { 
  Activity, 
  AlertTriangle, 
  Users, 
  Cpu, 
  TrendingUp, 
  Menu, 
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { label: 'Plant Overview', href: '/hse', icon: Activity },
  { label: 'Personnel Roster', href: '/hse/workers', icon: Users },
  { label: 'Exposure Trends', href: '/hse/exposure', icon: TrendingUp },
  { label: 'Incident & Alert Triage', href: '/hse/alerts', icon: AlertTriangle },
  { label: 'Metrology Provenance', href: '/hse/technical', icon: Cpu },
];

export default function HSELayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { alerts } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center font-sans text-[13px] text-[#7A8178]">
        Loading Safety Directorate...
      </div>
    );
  }

  const openAlerts = alerts.filter(a => a.status === 'OPEN').length;

  return (
    <div className="flex-1 flex flex-col font-sans">
      
      {/* HSE Administrative Navigation Bar */}
      <div className="bg-white border-b border-[#E7E5DE] shadow-2xs">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 flex items-center justify-between h-12">
          
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-[#596158] hover:text-[#263026] p-1">
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2 text-[13px]">
              <Link href="/" className="text-[#596158] hover:text-[#5C822D] hover:underline">MRPL Portal</Link>
              <span className="text-[#D5D2C9]">/</span>
              <span className="font-semibold text-[#263026]">HSE Supervisory Directorate</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(item => {
              const isActive = pathname === item.href || (item.href !== '/hse' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-semibold transition-all
                    ${isActive
                      ? 'bg-[#EEF3E7] text-[#35551F] border-b-2 border-[#5C822D]'
                      : 'text-[#596158] hover:text-[#263026] hover:bg-[#F7F6F1]'
                    }
                  `}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                  {item.label === 'Incident & Alert Triage' && openAlerts > 0 && (
                    <span className="ml-1 bg-[#A94442] text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                      {openAlerts}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden flex">
          <div className="w-64 bg-white border-r border-[#E7E5DE] p-5 flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E5DE]">
                <span className="font-bold text-[15px] text-[#263026]">HSE Navigation</span>
                <button onClick={() => setSidebarOpen(false)} className="text-[#7A8178]">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-1">
                {NAV_ITEMS.map(item => {
                  const isActive = pathname === item.href || (item.href !== '/hse' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center justify-between px-3 py-2.5 rounded-md text-[13px] font-semibold transition-all
                        ${isActive
                          ? 'bg-[#EEF3E7] text-[#35551F]'
                          : 'text-[#596158] hover:bg-[#F7F6F1]'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                      {item.label === 'Incident & Alert Triage' && openAlerts > 0 && (
                        <span className="bg-[#A94442] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                          {openAlerts}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E7E5DE] text-[12px] text-[#7A8178]">
              MRPL Refinery Zone A · Gas Safety System
            </div>
          </div>
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content Area (Max Width 1200px) */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full p-4 sm:p-8">
        {children}
      </main>

    </div>
  );
}
