import type { Metadata } from 'next';
import './globals.css';
import { PortalHeaderWrapper } from '@/components/portal-header-wrapper';
import { InstitutionalFooter } from '@/components/institutional-footer';
import { DemoControlPanel } from '@/components/demo-control-panel';

export const metadata: Metadata = {
  title: 'H₂S Exposure Monitoring Portal | MRPL',
  description: 'Mangalore Refinery and Petrochemicals Limited — Occupational Health & Safety Dosimeter Verification System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F7F6F1] text-[#263026] min-h-screen flex flex-col font-sans">
        
        {/* National Portal / India.gov.in Inspired Master Header Wrapper */}
        <PortalHeaderWrapper />

        {/* Main Content Area with Accessible Skip Anchor */}
        <main id="main-content" className="flex-1 flex flex-col">
          {children}
        </main>

        {/* Institutional 4-Column Directory Footer */}
        <InstitutionalFooter />

        {/* Evaluator Demo Helper (Press 'D' key or floating button) */}
        <DemoControlPanel />

      </body>
    </html>
  );
}
