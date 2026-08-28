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
  { label: 'Overview', href: '/hse', icon: Activity },
  { label: 'Roster', href: '/hse/workers', icon: Users },
  { label: 'Trends', href: '/hse/exposure', icon: TrendingUp },
  { label: 'Alerts', href: '/hse/alerts', icon: AlertTriangle },
  { label: 'Metrology', href: '/hse/technical', icon: Cpu },
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
        Loading Safety Dashboard...
      </div>
    );
  }

  const openAlerts = alerts.filter(a => a.status === 'OPEN').length;

  return (
    <div className="flex-1 flex flex-col font-sans">
      
      {/* Dashboard Sub-Navigation Bar */}
      <div className="bg-white border-b border-[#E7E5DE] shadow-2xs sticky top-[68px] sm:top-[78px] z-30">
        <div className="max-w-[1200px] mx-auto px-3 sm:px-8 flex items-center justify-between h-11 sm:h-12">
          
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="lg:hidden text-[#596158] hover:text-[#263026] p-1.5 rounded hover:bg-[#F7F6F1]"
              aria-label="Toggle Dashboard Menu"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] truncate">
              <Link href="/" className="text-[#596158] hover:text-[#5C822D] hover:underline">Home</Link>
              <span className="text-[#D5D2C9]">/</span>
              <span className="font-semibold text-[#263026] truncate">Dashboard</span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(item => {
              const isActive = pathname === item.href || (item.href !== '/hse' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-semibold transition-all
                    ${isActive
                      ? 'bg-[#EEF3E7] text-[#35551F] font-bold border-b-2 border-[#5C822D]'
                      : 'text-[#596158] hover:text-[#263026] hover:bg-[#F7F6F1]'
                    }
                  `}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                  {item.label === 'Alerts' && openAlerts > 0 && (
                    <span className="ml-1 bg-[#A94442] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {openAlerts}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

        </div>

        {/* Mobile Horizontal Quick-Tab Strip */}
        <div className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[#FAFBF9] border-t border-[#E7E5DE] overflow-x-auto no-scrollbar text-[12px]">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href || (item.href !== '/hse' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold whitespace-nowrap flex-shrink-0 transition-all min-h-[34px]
                  ${isActive
                    ? 'bg-[#5C822D] text-white shadow-2xs'
                    : 'text-[#596158] bg-white border border-[#E7E5DE] hover:bg-[#F7F6F1]'
                  }
                `}
              >
                <Icon size={13} />
                <span>{item.label}</span>
                {item.label === 'Alerts' && openAlerts > 0 && (
                  <span className={`text-[10px] font-bold px-1 rounded-full ${isActive ? 'bg-white text-[#A94442]' : 'bg-[#A94442] text-white'}`}>
                    {openAlerts}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs lg:hidden flex animate-in fade-in duration-200">
          <div className="w-72 max-w-[85vw] bg-white border-r border-[#E7E5DE] p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E5DE]">
                <span className="font-bold text-[15px] text-[#263026]">Dashboard Sections</span>
                <button onClick={() => setSidebarOpen(false)} className="text-[#7A8178] p-1 rounded hover:bg-[#F0EFE9]">
                  <X size={20} />
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
                        flex items-center justify-between px-3.5 py-2.5 rounded-md text-[14px] font-semibold transition-all
                        ${isActive
                          ? 'bg-[#EEF3E7] text-[#35551F] font-bold'
                          : 'text-[#596158] hover:bg-[#F7F6F1]'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                      {item.label === 'Alerts' && openAlerts > 0 && (
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
              MRPL Safety Directorate · Zone A
            </div>
          </div>
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full p-3 sm:p-8">
        {children}
      </main>

    </div>
  );
}
