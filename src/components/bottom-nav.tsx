'use client';

import { useState, useRef, useEffect, useCallback, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, User, Activity, Users, AlertTriangle, FileText } from 'lucide-react';
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

interface IndicatorGeometry {
  left: number;
  top: number;
  width: number;
  height: number;
  ready: boolean;
  isMoving: boolean;
}

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function BottomNav() {
  const pathname = usePathname();
  const { language, alerts, setTeamModalOpen } = useAppStore();

  const [aboutTapCount, setAboutTapCount] = useState(0);
  const lastTapTimeRef = useRef<number>(0);

  // Reference hooks for dynamic geometry tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const moveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorGeometry>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    ready: false,
    isMoving: false,
  });

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const isFieldPersonnel = pathname === '/scan' || pathname.startsWith('/worker');
  const isHSE = pathname.startsWith('/hse') || pathname.startsWith('/dashboard');

  const openAlertsCount = alerts.filter((a) => a.status === 'OPEN').length;

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
    : [];

  // Determine active item index
  const activeIndex = navItems.findIndex((item) => {
    return item.exact
      ? pathname === item.href
      : pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
  });

  // Calculate indicator position smoothly based on measured DOM offsets relative to container
  const updateIndicatorPosition = useCallback((animate = true) => {
    if (!isFieldPersonnel && !isHSE) return;
    const container = containerRef.current;
    const targetIdx = activeIndex >= 0 ? activeIndex : 0;
    const activeElement = itemRefs.current[targetIdx];

    if (!container || !activeElement) return;

    // Use exact DOM offset properties (immune to scroll or transform drift)
    const left = activeElement.offsetLeft;
    const top = activeElement.offsetTop;
    const width = activeElement.offsetWidth;
    const height = activeElement.offsetHeight;

    if (moveTimeoutRef.current) {
      clearTimeout(moveTimeoutRef.current);
    }

    setIndicatorStyle((prev) => {
      const isPositionChanged = prev.left !== left || prev.width !== width;
      const shouldTriggerMotion = animate && isPositionChanged && prev.ready && !reducedMotion;

      return {
        left,
        top,
        width,
        height,
        ready: true,
        isMoving: shouldTriggerMotion,
      };
    });

    if (animate && !reducedMotion) {
      moveTimeoutRef.current = setTimeout(() => {
        setIndicatorStyle((prev) => ({ ...prev, isMoving: false }));
      }, 260);
    }
  }, [activeIndex, isFieldPersonnel, isHSE, reducedMotion]);

  const handleItemClick = (href: string, idx: number, e: React.MouseEvent<HTMLAnchorElement>) => {
    // Subtle tactile haptic without audio chime
    feedback.vibrate(8);

    // Immediate visual responsiveness on tap
    const activeElement = itemRefs.current[idx];
    if (activeElement) {
      const left = activeElement.offsetLeft;
      const top = activeElement.offsetTop;
      const width = activeElement.offsetWidth;
      const height = activeElement.offsetHeight;

      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);

      setIndicatorStyle((prev) => ({
        left,
        top,
        width,
        height,
        ready: true,
        isMoving: !reducedMotion && (prev.left !== left || prev.width !== width),
      }));

      if (!reducedMotion) {
        moveTimeoutRef.current = setTimeout(() => {
          setIndicatorStyle((prev) => ({ ...prev, isMoving: false }));
        }, 260);
      }
    }

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

  // Update on route, language, or navItems layout change
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      updateIndicatorPosition(true);
    });
    const settleTimer = setTimeout(() => {
      updateIndicatorPosition(false);
    }, 60);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(settleTimer);
    };
  }, [updateIndicatorPosition, pathname, language, navItems.length]);

  // Window resize and observer updates
  useEffect(() => {
    const handleResize = () => {
      updateIndicatorPosition(false);
    };

    window.addEventListener('resize', handleResize);

    const container = containerRef.current;
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && container) {
      observer = new ResizeObserver(() => {
        updateIndicatorPosition(false);
      });
      observer.observe(container);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
    };
  }, [updateIndicatorPosition]);

  if (!isFieldPersonnel && !isHSE) {
    return null;
  }

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="sm:hidden fixed bottom-[calc(env(safe-area-inset-bottom,0px)+12px)] left-1/2 -translate-x-1/2 z-40 w-[calc(100%-32px)] select-none"
      style={{
        maxWidth: navItems.length > 2 ? '390px' : '270px',
      }}
    >
      {/* Floating Pill Shell - Matches App Working Surface & Palette in Light & Dark */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-around p-1.5 rounded-full bg-white/95 backdrop-blur-xl border border-[#E8E2D5] shadow-[0_8px_30px_rgba(38,48,38,0.12),0_2px_8px_rgba(38,48,38,0.06)] ring-1 ring-[#5C822D]/10 dark:bg-[#1C251C]/92 dark:backdrop-blur-xl dark:border-[#35551F]/40 dark:shadow-[0_12px_40px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3)] dark:ring-1 dark:ring-white/10 high-contrast:bg-black high-contrast:border-2 high-contrast:border-white high-contrast:shadow-none high-contrast:ring-0"
      >
        {/* Single Moving Fluid Active Indicator Pill with Physical Spring & Squash/Stretch */}
        {activeIndex >= 0 && (
          <div
            aria-hidden="true"
            className={`absolute top-0 left-0 pointer-events-none rounded-full bg-[#EDF3E4] border border-[#5C822D]/70 shadow-[0_2px_8px_rgba(92,130,45,0.18)] dark:bg-[#35551F] dark:border dark:border-[#5C822D] dark:shadow-[0_0_15px_rgba(92,130,45,0.35),0_2px_8px_rgba(0,0,0,0.4)] high-contrast:bg-transparent high-contrast:border-2 high-contrast:border-[#00FF00] ${
              indicatorStyle.ready ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: `translate3d(${indicatorStyle.left}px, ${indicatorStyle.top}px, 0) scale(${
                indicatorStyle.isMoving && !reducedMotion ? 1.05 : 1
              }, ${indicatorStyle.isMoving && !reducedMotion ? 0.96 : 1})`,
              transformOrigin: 'center center',
              width: `${indicatorStyle.width}px`,
              height: `${indicatorStyle.height}px`,
              willChange: 'transform, width, height',
              transition: reducedMotion
                ? 'none'
                : 'transform 280ms cubic-bezier(0.2, 0.9, 0.3, 1.15), width 280ms cubic-bezier(0.2, 0.9, 0.3, 1.15), height 280ms cubic-bezier(0.2, 0.9, 0.3, 1.15), opacity 150ms ease',
            }}
          />
        )}

        {/* Navigation Items */}
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive =
            item.exact
              ? pathname === item.href
              : pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              href={item.href}
              onClick={(e) => handleItemClick(item.href, idx, e)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              className="relative z-10 flex flex-1 flex-col items-center justify-center py-1.5 px-2.5 rounded-full min-h-[46px] min-w-[54px] active:scale-95 transition-transform duration-100 outline-none focus-visible:ring-2 focus-visible:ring-[#5C822D] high-contrast:focus-visible:ring-[#00FF00]"
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-all duration-200 ${
                    isActive
                      ? 'text-[#35551F] stroke-[2.25] scale-105 dark:text-[#EDF3E4] high-contrast:text-[#00FF00]'
                      : 'text-[#7A8178] stroke-[1.75] hover:text-[#263026] dark:text-[#889686] hover:dark:text-[#C5D2C3] high-contrast:text-white'
                  }`}
                />
                {item.badgeCount && item.badgeCount > 0 ? (
                  <span
                    className="absolute -top-1 -right-2 text-[9px] font-bold px-1 min-w-[15px] h-[15px] flex items-center justify-center rounded-full bg-[#A94442] text-white shadow-xs ring-1 ring-white dark:ring-[#1C251C] high-contrast:ring-black"
                  >
                    {item.badgeCount}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-[10.5px] leading-tight mt-0.5 tracking-tight truncate max-w-[76px] transition-colors duration-200 ${
                  isActive
                    ? 'text-[#35551F] font-bold dark:text-white high-contrast:text-[#00FF00]'
                    : 'text-[#596158] font-medium dark:text-[#889686] high-contrast:text-white'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
