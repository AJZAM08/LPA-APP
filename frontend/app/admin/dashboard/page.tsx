'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ShieldCheck, UserPlus, LogOut, Trash2, Search, X } from 'lucide-react';

interface TeacherItem {
  id: string;
  email: string;
  fullName: string;
  schoolName?: string;
  phoneNumber?: string;
  isFirstLogin: boolean;
  createdAt: string;
  _count?: {
    classes: number;
    sessions: number;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('lpa_teacher');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'SUPER_ADMIN') {
      router.push('/teacher/classes');
      return;
    }
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/teachers');
      setTeachers(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.post('/admin/teachers', {
        fullName,
        email,
        password,
        schoolName,
        phoneNumber,
      });
      setIsModalOpen(false);
      setFullName('');
      setEmail('');
      setPassword('');
      setSchoolName('');
      setPhoneNumber('');
      fetchTeachers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mendaftarkan guru');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTeacher = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun guru ${name}?`)) return;
    try {
      await api.delete(`/admin/teachers/${id}`);
      fetchTeachers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus guru');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lpa_token');
    localStorage.removeItem('lpa_teacher');
    router.push('/login');
  };

  const filteredTeachers = teachers.filter(
    (t) =>
      t.fullName.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      (t.schoolName && t.schoolName.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans text-[#1A202C]">
      
      <header className="bg-[#0D5C46] text-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#E8F5F1] text-[#0D5C46] rounded-xl font-bold">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="font-bold text-base">Dashboard Super Admin</h1>
              <p className="text-xs text-[#E8F5F1]">Manajemen Akun Guru & Akses Sistem</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 bg-[#094132] hover:bg-[#073227] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all text-[#E8F5F1]"
          >
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-bold text-lg text-[#1A202C]">Kelola Akun Guru</h2>
            <p className="text-xs text-[#4A5568] mt-0.5">Daftarkan akun guru baru untuk mengakses portal pembuat laporan</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0D5C46] hover:bg-[#094132] text-white font-bold px-4 py-3 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <UserPlus size={18} />
            <span>+ Buat Akun Guru Baru</span>
          </button>
        </div>

        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama guru, email, atau sekolah..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
          />
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Memuat daftar akun guru...</div>
        ) : filteredTeachers.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-xs text-slate-400">
            Belum ada akun guru yang didaftarkan.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredTeachers.map((t) => (
              <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-start gap-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-[#1A202C]">{t.fullName}</h3>
                  <p className="text-xs font-medium text-[#0D5C46]">{t.email}</p>
                  <p className="text-xs text-slate-500">{t.schoolName || 'Institusi Umum'}</p>
                  <div className="flex items-center gap-2 pt-2 text-[11px]">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-600">
                      {t._count?.classes || 0} Kelas
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-600">
                      {t._count?.sessions || 0} Sesi
                    </span>
                    {t.isFirstLogin && (
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        Login Pertama
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTeacher(t.id, t.fullName)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Hapus Akun Guru"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <h2 className="font-bold text-base text-[#1A202C] mb-4">Pendaftaran Akun Guru Baru</h2>

            <form onSubmit={handleCreateTeacher} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1A202C] mb-1">Nama Lengkap Guru</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Pak Anas Fadhilah, S.Pd."
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A202C] mb-1">Email Guru (Untuk Login)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anas@sekolah.id"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A202C] mb-1">Password Sementara (Min. 6 Karakter)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A202C] mb-1">Nama Sekolah / Bimbel (Opsional)</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="SDN Harapan Ceria"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0D5C46] hover:bg-[#094132] rounded-xl cursor-pointer"
                >
                  {saving ? 'Mendaftarkan...' : 'Daftarkan Guru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
