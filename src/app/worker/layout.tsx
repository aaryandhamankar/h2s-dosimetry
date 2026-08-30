'use client';

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col justify-center font-sans">
      <div className="flex-1 max-w-[1200px] mx-auto w-full p-3 sm:p-6 pb-20 md:pb-6">
        {children}
      </div>
    </div>
  );
}
