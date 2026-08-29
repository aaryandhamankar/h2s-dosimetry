import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PortalHeaderWrapper } from '@/components/portal-header-wrapper';
import { InstitutionalFooter } from '@/components/institutional-footer';
import { DemoControlPanel } from '@/components/demo-control-panel';
import { BottomNav } from '@/components/bottom-nav';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#35551F',
};

export const metadata: Metadata = {
  title: 'H₂S Exposure Monitoring Portal | MRPL',
  description: 'Mangalore Refinery and Petrochemicals Limited — Occupational Health & Safety Dosimeter Verification System',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'H2S Portal',
  },
  formatDetection: {
    telephone: false,
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

        {/* Evaluator Demo Helper (Press 'D' key or floating button) */}
        <DemoControlPanel />

      </body>
    </html>
  );
}
