'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-center p-4 text-xs text-slate-500 font-sans">
      Mengarahkan ke halaman login... Pendaftaran akun guru dikelola oleh Super Admin.
    </div>
  );
}