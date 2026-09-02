import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PortalHeaderWrapper } from '@/components/portal-header-wrapper';
import { ShiftTicker } from '@/components/shift-ticker';
import { InstitutionalFooter } from '@/components/institutional-footer';
import { DemoControlPanel } from '@/components/demo-control-panel';
import { ShiftTimer } from '@/components/shift-timer';
import { BottomNav } from '@/components/bottom-nav';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#35551F',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://h2s-dosimeter.mrpl.co.in'),
  title: 'H2S Dosimeter',
  description: 'H2S Dosimeter — Continuous Personal Hydrogen Sulfide Gas Dosimetry Verification System with ISO D65 Optical Normalization.',
  keywords: [
    'H2S Dosimeter',
    'H2S Dosimetry',
    'MRPL',
    'Petrochemical Safety',
    'Occupational Health',
    'Hydrogen Sulfide Sensor',
    'Cu-PAN',
    'Bradford D65',
    'Colorimetry'
  ],
  authors: [{ name: 'Industrial Health & Safety Innovation Team' }],
  creator: 'Mangalore Refinery and Petrochemicals Limited',
  publisher: 'MRPL / Ministry of Petroleum and Natural Gas',
  openGraph: {
    title: 'H2S Dosimeter',
    description: 'Real-time personal gas dosimetry verification and supervisory surveillance for petrochemical refinery personnel.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'H2S Dosimeter',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'H2S Dosimeter Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'H2S Dosimeter',
    description: 'Occupational health & safety dosimeter verification system with ISO D65 optical normalization.',
    images: ['/icon.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'H2S Dosimeter',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[#FAF6EE] text-[#263026] min-h-screen flex flex-col font-sans" suppressHydrationWarning>
        
        {/* National Portal / India.gov.in Inspired Master Header Wrapper */}
        <PortalHeaderWrapper />

        {/* Dynamic Horizontal Shift Ticker (Position: Top Bar → Shift Ticker → Main Content) */}
        <ShiftTicker />

        {/* Main Content Area with Adaptive Mobile/Desktop Zero-Scroll Padding */}
        <main id="main-content" className="flex-1 flex flex-col justify-center min-h-0 pb-16 sm:pb-0">
          {children}
        </main>

        {/* Institutional Team Dossier Footer Pill */}
        <InstitutionalFooter />

        {/* Mobile-Only Bottom Navigation Bar (Hidden on Desktop) */}
        <BottomNav />

        {/* Shift Exposure Timer Modal & Quick Float */}
        <ShiftTimer />

        {/* Evaluator Demo Helper (Press 'D' key or floating button on lower right side) */}
        <DemoControlPanel />

      </body>
    </html>
  );
}
