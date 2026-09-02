'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, Info, User, Activity, Users, AlertTriangle, FileText } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { TRANSLATIONS } from '@/lib/i18n';
import { feedback } from '@/lib/feedback';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact: boolean;
  badgeCount?: number;
}

export function BottomNav() {
  const pathname = usePathname();
  const { language, alerts, setTeamModalOpen } = useAppStore();

  const [aboutTapCount, setAboutTapCount] = useState(0);
  const lastTapTimeRef = useRef<number>(0);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleItemClick = (href: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    feedback.select();
    if (href === '/about') {
      const now = e.timeStamp;
      if (now - lastTapTimeRef.current < 900) {
        const newCount = aboutTapCount + 1;
        setAboutTapCount(newCount);
        if (newCount >= 3) {
          setTeamModalOpen(true);
          setAboutTapCount(0);
        }
      } else {
        setAboutTapCount(1);
      }
      lastTapTimeRef.current = now;
    }
  };

  const isFieldPersonnel = pathname === '/scan' || pathname.startsWith('/worker');
  const isHSE = pathname.startsWith('/hse') || pathname.startsWith('/dashboard');

  const openAlertsCount = alerts.filter(a => a.status === 'OPEN').length;

  const navItems: NavItem[] = isFieldPersonnel
    ? [
        {
          label: t.navScan,
          href: '/scan',
          icon: Camera,
          exact: true,
        },
        {
          label: t.navHistory,
          href: '/worker/history',
          icon: User,
          exact: false,
        },
      ]
    : isHSE
    ? [
        {
          label: t.navOverview,
          href: '/hse',
          icon: Activity,
          exact: true,
        },
        {
          label: t.navWorkers,
          href: '/hse/workers',
          icon: Users,
          exact: false,
        },
        {
          label: t.navAlerts,
          href: '/hse/alerts',
          icon: AlertTriangle,
          badgeCount: openAlertsCount,
          exact: false,
        },
        {
          label: t.navReports,
          href: '/hse/exposure',
          icon: FileText,
          exact: false,
        },
      ]
    : [
        {
          label: t.navHome,
          href: '/',
          icon: Home,
          exact: true,
        },
        {
          label: language === 'hi' ? 'विवरण' : language === 'kn' ? 'ವಿವರಣೆ' : language === 'gu' ? 'વિગતો' : 'About',
          href: '/about',
          icon: Info,
          exact: true,
        },
      ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E2D5] shadow-lg"
    >
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleItemClick(item.href, e)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all min-w-[64px] active:scale-95 ${
                isActive
                  ? 'text-[#5C822D] font-bold'
                  : 'text-[#596158] hover:text-[#263026] hover:bg-[#F4EFE6]/70 font-medium'
              }`}
            >
              <div className={`relative p-1 rounded-md transition-colors ${isActive ? 'bg-[#EDF3E4]' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#5C822D] stroke-2' : 'text-[#7A8178] stroke-2'}`} />
                {item.badgeCount && item.badgeCount > 0 ? (
                  <span className="absolute -top-1 -right-1 bg-[#A94442] text-white text-[9px] font-bold px-1 min-w-[15px] h-[15px] flex items-center justify-center rounded-full shadow-xs">
                    {item.badgeCount}
                  </span>
                ) : null}
              </div>
              <span className="text-[11px] leading-tight mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
