import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PortalHeaderWrapper } from '@/components/portal-header-wrapper';
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
  title: 'H₂S Exposure Monitoring Portal | MRPL',
  description: 'Mangalore Refinery and Petrochemicals Limited — Wearable Zero-Power H₂S Gas Dosimeter Verification System with ISO D65 Optical Normalization.',
  keywords: [
    'H2S Dosimetry',
    'MRPL',
    'Petrochemical Safety',
    'Occupational Health',
    'Hydrogen Sulfide Sensor',
    'Cu-PAN',
    'Bradford D65',
    'Colorimetry'
  ],
  authors: [{ name: 'MRPL Industrial Health & Safety Innovation Team' }],
  creator: 'Mangalore Refinery and Petrochemicals Limited',
  publisher: 'MRPL / Ministry of Petroleum and Natural Gas',
  openGraph: {
    title: 'H₂S Exposure Monitoring Portal | MRPL',
    description: 'Real-time personal gas dosimetry verification and supervisory surveillance for petrochemical refinery personnel.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'MRPL H₂S Dosimetry Portal',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'MRPL H2S Dosimeter Portal Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'H₂S Exposure Monitoring Portal | MRPL',
    description: 'Occupational health & safety dosimeter verification system with ISO D65 optical normalization.',
    images: ['/icon.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'H2S Portal',
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
    <html lang="en">
      <body className="antialiased bg-[#FAF6EE] text-[#263026] min-h-screen flex flex-col font-sans">
        
        {/* National Portal / India.gov.in Inspired Master Header Wrapper */}
        <PortalHeaderWrapper />

        {/* Main Content Area with Adaptive Mobile/Desktop Zero-Scroll Padding */}
        <main id="main-content" className="flex-1 flex flex-col justify-center min-h-0 pb-16 sm:pb-0">
          {children}
        </main>

        {/* Institutional Team Dossier Footer Pill */}
        <InstitutionalFooter />

        {/* Mobile-Only Bottom Navigation Bar (Hidden on Desktop) */}
        <BottomNav />

        {/* Shift Exposure Timer on lower left side */}
        <ShiftTimer />

        {/* Evaluator Demo Helper (Press 'D' key or floating button on lower right side) */}
        <DemoControlPanel />

      </body>
    </html>
  );
}
