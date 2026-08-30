'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/hse');
  }, [router]);

  return (
    <div className="flex-1 flex items-center justify-center p-8 text-[13px] text-[#7A8178]">
      Redirecting to HSE Overview...
    </div>
  );
}
