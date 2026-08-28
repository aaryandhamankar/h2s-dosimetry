'use client';

import { useAppStore } from '@/stores/app-store';
import { TRANSLATIONS } from '@/lib/i18n';
import { Camera, History } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, language } = useAppStore();
  const pathname = usePathname();

  const t = TRANSLATIONS[language];

  const navItems = [
    { name: t.navScan, href: '/worker', icon: Camera },
    { name: t.navHistory, href: '/worker/history', icon: History },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between font-sans">
      {/* Sub-Header Breadcrumb & Operator Ribbon */}
      <div className="bg-white border-b border-[#E7E5DE] px-3 sm:px-8 py-2 sm:py-2.5 shadow-2xs">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] truncate">
            <Link href="/" className="text-[#596158] hover:text-[#5C822D] hover:underline">{t.navHome}</Link>
            <span className="text-[#D5D2C9]">/</span>
            <span className="font-semibold text-[#263026] truncate">{t.navWorker}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] sm:text-[13px] flex-shrink-0">
            <div className="flex items-center gap-1.5 bg-[#F7F6F1] px-2.5 sm:px-3 py-1 rounded-md border border-[#E7E5DE]">
              <span className="w-2 h-2 rounded-full bg-[#5C822D] animate-pulse" />
              <span className="font-semibold text-[#263026]">
                {currentUser?.displayName || 'Rajesh Kumar'}
              </span>
              <span className="text-[#7A8178] text-[11px] hidden xs:inline">({currentUser?.workerCode || 'W-001'})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-[1200px] mx-auto w-full p-3 sm:p-8 pb-24 md:pb-8">
        {children}
      </div>

      {/* Bottom Tab Bar (Optimized for Mobile Touch: 2 Large High-Contrast Tabs) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E7E5DE] shadow-lg z-40 md:sticky md:bottom-0">
        <div className="max-w-[1200px] mx-auto flex items-center justify-around px-3 sm:px-8 py-1.5 sm:py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/worker' 
              ? (pathname === '/worker' || pathname === '/worker/scan')
              : pathname.startsWith('/worker/history') || pathname.startsWith('/worker/profile');
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-center gap-2 min-h-[46px] py-2 px-4 rounded-lg transition-all flex-1 max-w-[240px] ${
                  isActive 
                    ? 'text-[#35551F] bg-[#EEF3E7] font-bold border-2 border-[#5C822D] shadow-xs' 
                    : 'text-[#596158] hover:text-[#263026] hover:bg-[#F7F6F1]'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#5C822D]' : 'text-[#7A8178]'}`} />
                <span className="text-[13px] sm:text-[14px] leading-tight text-center truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

