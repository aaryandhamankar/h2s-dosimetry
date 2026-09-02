'use client';

export default function HSELayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col font-sans">
      <main className="flex-1 max-w-[1200px] mx-auto w-full p-3 sm:p-8 pb-20 sm:pb-8">
        {children}
      </main>
    </div>
  );
}


