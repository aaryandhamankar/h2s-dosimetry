'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, BarChart3, Info } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

export function BottomNav() {
  const pathname = usePathname();
  const { language, setTeamModalOpen } = useAppStore();

  const [aboutTapCount, setAboutTapCount] = useState(0);
  const lastTapTimeRef = useRef<number>(0);

  const handleItemClick = (href: string, e: React.MouseEvent<HTMLAnchorElement>) => {
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

  const navItems = [
    {
      label: language === 'hi' ? 'होम' : 'Home',
      href: '/',
      icon: Home,
      exact: true,
    },
    {
      label: language === 'hi' ? 'स्कैन' : 'Scan',
      href: '/scan',
      icon: Camera,
      exact: false,
    },
    {
      label: language === 'hi' ? 'डैशबोर्ड' : 'Dashboard',
      href: '/dashboard',
      icon: BarChart3,
      exact: false,
    },
    {
      label: language === 'hi' ? 'विवरण' : 'About',
      href: '/about',
      icon: Info,
      exact: false,
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
              <div className={`p-1 rounded-md transition-colors ${isActive ? 'bg-[#EDF3E4]' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#5C822D] stroke-[2.5]' : 'text-[#7A8178]'}`} />
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
