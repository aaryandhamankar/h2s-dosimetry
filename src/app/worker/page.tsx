'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkerHomePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/scan');
  }, [router]);

  return (
    <div className="p-8 text-center text-sm text-[#7A8178]">
      Redirecting to Scanner...
    </div>
  );
}


