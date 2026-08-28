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
import mrplLogo from '../../public/mrpl-logo.svg';

export function PortalHeaderWrapper() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E7E5DE] shadow-2xs">
      
      {/* 1. Slim Top Accessibility Strip */}
      <AccessibilityBar onOpenSearch={() => setSearchOpen(true)} />

      {/* 2. Institutional Master Header (74px) */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-[74px] gap-4">
          
          {/* Brand Anchor: Official ONGC MRPL Logo & Institutional Identity */}
          <Link href="/" className="flex items-center gap-3.5 group flex-shrink-0">
            <div className="h-12 flex-shrink-0 flex items-center justify-center p-1 bg-white rounded-lg border border-[#E7E5DE] shadow-xs group-hover:border-[#5C822D] group-hover:shadow-sm transition-all overflow-hidden">
              <Image 
                src={mrplLogo} 
                alt="MRPL ONGC Logo" 
                className="h-10 w-auto object-contain rounded-md block"
              />
            </div>

            <div className="flex flex-col justify-center">
              <span className="font-bold text-[15px] sm:text-[16px] text-[#263026] leading-tight tracking-tight">
                Mangalore Refinery and Petrochemicals Limited
              </span>
              <span className="text-[12px] text-[#596158] leading-tight">
                A Subsidiary of ONGC Limited · Occupational Gas Dosimetry Portal
              </span>
            </div>
          </Link>

          {/* Right Controls: Search, Zone Status, & Role Switcher */}
          <div className="flex items-center gap-3 flex-shrink-0">
            
            {/* Quick Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 bg-[#F7F6F1] hover:bg-[#F0EFE9] text-[#263026] font-semibold px-3 py-1.5 rounded-md text-[13px] transition-colors border border-[#E7E5DE]"
              title="Search Portal (Shortcut: /)"
            >
              <Search size={14} className="text-[#5C822D]" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="bg-white px-1 py-0.2 rounded border border-[#E7E5DE] text-[10px] font-mono text-[#7A8178] hidden md:inline">/</kbd>
            </button>

            {/* Plant Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 bg-[#EEF3E7] px-3 py-1.5 rounded-md border border-[#C8DEC0] text-[12px] text-[#35551F] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#5C822D] animate-pulse" />
              <span>Zone A Operational</span>
            </div>

            {/* Portal View Switcher (Segmented Control) */}
            {pathname !== '/' && (
              <div className="hidden sm:flex items-center bg-[#F0EFE9] p-0.5 rounded-md border border-[#E7E5DE] text-[12px] font-semibold">
                <Link
                  href="/worker"
                  className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                    pathname.startsWith('/worker')
                      ? 'bg-[#5C822D] text-white'
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
                      ? 'bg-[#5C822D] text-white'
                      : 'text-[#596158] hover:text-[#263026]'
                  }`}
                >
                  <ShieldCheck size={13} />
                  <span>HSE Dashboard</span>
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
