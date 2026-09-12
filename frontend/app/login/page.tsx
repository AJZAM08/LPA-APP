'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { LogIn, GraduationCap, ShieldCheck, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstLoginUser, setFirstLoginUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/auth/login', { email, password });
      
      const { accessToken, user } = res.data;
      localStorage.setItem('lpa_token', accessToken);
      localStorage.setItem('lpa_teacher', JSON.stringify(user));

      if (user.role === 'SUPER_ADMIN') {
        router.push('/admin/dashboard');
        return;
      }

      if (user.isFirstLogin) {
        setFirstLoginUser(user);
        return;
      }

      router.push('/teacher/classes');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal, periksa email dan password Anda');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyFirstLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setVerifying(true);
      const res = await api.post('/auth/verify-first-login', {
        newPassword: newPassword || undefined,
      });

      localStorage.setItem('lpa_teacher', JSON.stringify(res.data.user));
      router.push('/teacher/classes');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal memverifikasi akun');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-[#E8F5F1] text-[#0D5C46] rounded-2xl mb-3">
            <GraduationCap size={36} />
          </div>
          <h1 className="text-2xl font-bold text-[#1A202C]">Masuk Portal LPA</h1>
          <p className="text-xs text-[#4A5568] mt-1">Sistem Laporan Perkembangan Anak (Guru & Admin)</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1A202C] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@sekolah.id"
              className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A202C] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0D5C46] hover:bg-[#094132] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
          >
            <LogIn size={18} />
            {loading ? 'Memproses...' : 'Masuk Akun'}
          </button>
        </form>

        <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-[11px] text-[#4A5568]">
          📌 Pendaftaran akun guru dikelola oleh <strong>Super Admin</strong>. Hubungi pihak sekolah jika belum memiliki akun.
        </div>

      </div>

      {firstLoginUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center gap-2 text-[#0D5C46] font-bold text-base">
              <KeyRound size={22} />
              <h2>Verifikasi Login Pertama Kali</h2>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Halo <strong>{firstLoginUser.fullName}</strong>! Ini adalah kali pertama Anda masuk. Silakan buat password baru Anda untuk mengamankan akun.
            </p>

            <form onSubmit={handleVerifyFirstLogin} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#1A202C] mb-1">Buat Password Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={verifying}
                className="w-full bg-[#0D5C46] text-white font-bold py-3 rounded-xl text-xs cursor-pointer"
              >
                {verifying ? 'Verifikasi...' : 'Simpan & Lanjutkan ke Dashboard'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}