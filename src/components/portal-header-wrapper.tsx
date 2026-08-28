'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  User, 
  ShieldCheck, 
} from 'lucide-react';
import { AccessibilityBar } from './accessibility-bar';
import { UniversalSearch } from './universal-search';
import Image from 'next/image';
import mrplLogo from '../../public/mrpl-logo.png';

export function PortalHeaderWrapper() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E7E5DE] shadow-2xs">
      
      {/* 1. Slim Top Accessibility Strip */}
      <AccessibilityBar onOpenSearch={() => setSearchOpen(true)} />

      {/* 2. Institutional Master Header */}
      <div className="max-w-[1200px] mx-auto px-3 sm:px-8">
        <div className="flex items-center justify-between min-h-[64px] sm:min-h-[74px] py-2 gap-2 sm:gap-4">
          
          {/* Brand Anchor: Official ONGC MRPL Logo & Institutional Identity */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3.5 group min-w-0 pr-1 flex-1 sm:flex-initial">
            <div className="h-10 sm:h-12 w-10 sm:w-12 flex-shrink-0 flex items-center justify-center p-1 bg-white rounded-lg border border-[#E7E5DE] shadow-xs group-hover:border-[#5C822D] group-hover:shadow-sm transition-all overflow-hidden">
              <Image 
                src={mrplLogo} 
                alt="MRPL ONGC Logo" 
                className="h-8 sm:h-10 w-auto object-contain rounded-md block"
                priority
              />
            </div>

            <div className="flex flex-col justify-center min-w-0">
              <span className="font-bold text-[13px] sm:text-[16px] text-[#263026] leading-tight tracking-tight truncate">
                <span className="hidden sm:inline">Mangalore Refinery and Petrochemicals Limited</span>
                <span className="sm:hidden">MRPL Dosimetry</span>
              </span>
              <span className="text-[11px] sm:text-[12px] text-[#596158] leading-tight truncate">
                <span className="hidden md:inline">A Subsidiary of ONGC Limited · </span>
                <span>Gas Dosimetry Portal</span>
              </span>
            </div>
          </Link>

          {/* Right Controls: Search, Zone Status, & Role Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            
            {/* Quick Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 bg-[#F7F6F1] hover:bg-[#F0EFE9] text-[#263026] font-semibold p-2 sm:px-3 sm:py-1.5 rounded-md text-[13px] transition-colors border border-[#E7E5DE]"
              title="Search Portal (Shortcut: /)"
              aria-label="Search Portal"
            >
              <Search size={15} className="text-[#5C822D]" />
              <span className="hidden md:inline">Search</span>
              <kbd className="bg-white px-1 py-0.2 rounded border border-[#E7E5DE] text-[10px] font-mono text-[#7A8178] hidden lg:inline">/</kbd>
            </button>

            {/* Plant Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 bg-[#EEF3E7] px-3 py-1.5 rounded-md border border-[#C8DEC0] text-[12px] text-[#35551F] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#5C822D] animate-pulse" />
              <span>Zone A Operational</span>
            </div>

            {/* Desktop Portal View Switcher (Segmented Control) */}
            {pathname !== '/' && (
              <div className="hidden sm:flex items-center bg-[#F0EFE9] p-0.5 rounded-md border border-[#E7E5DE] text-[12px] font-semibold">
                <Link
                  href="/worker"
                  className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                    pathname.startsWith('/worker')
                      ? 'bg-[#5C822D] text-white shadow-2xs'
                      : 'text-[#596158] hover:text-[#263026]'
                  }`}
                >
                  <User size={13} />
                  <span>Worker Mode</span>
                </Link>
                <Link
                  href="/hse"
                  className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                    pathname.startsWith('/hse')
                      ? 'bg-[#5C822D] text-white shadow-2xs'
                      : 'text-[#596158] hover:text-[#263026]'
                  }`}
                >
                  <ShieldCheck size={13} />
                  <span>HSE Dashboard</span>
                </Link>
              </div>
            )}

            {/* Mobile Mode Switcher Dropdown Toggle Button */}
            {pathname !== '/' && (
              <div className="sm:hidden flex items-center">
                <Link
                  href={pathname.startsWith('/worker') ? '/hse' : '/worker'}
                  className="flex items-center gap-1 bg-[#EEF3E7] text-[#35551F] font-semibold text-[11px] px-2.5 py-1.5 rounded-md border border-[#C8DEC0]"
                  title="Switch Role"
                >
                  {pathname.startsWith('/worker') ? (
                    <>
                      <ShieldCheck size={13} className="text-[#5C822D]" />
                      <span>HSE</span>
                    </>
                  ) : (
                    <>
                      <User size={13} className="text-[#5C822D]" />
                      <span>Worker</span>
                    </>
                  )}
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* 3. Indian Tricolor Horizontal Accent Ribbon (4px Fixed Height) */}
      <div className="tricolor-ribbon" />

      {/* 4. Universal Search Dialog */}
      <UniversalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

    </header>
  );
}
