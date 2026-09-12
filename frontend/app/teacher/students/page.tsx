'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Users, UserPlus, FilePlus, LogOut, Phone, ChevronRight, Search, X } from 'lucide-react';

interface Student {
  id: string;
  fullName: string;
  nickname?: string;
  parentName?: string;
  parentPhone: string;
  _count?: {
    reports: number;
  };
}

export default function StudentListPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState<any>(null);
  const [search, setSearch] = useState('');

  // Modal Tambah Siswa State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const teacherData = localStorage.getItem('lpa_teacher');
    if (!teacherData) {
      router.push('/login');
      return;
    }
    setTeacher(JSON.parse(teacherData));
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.post('/students', {
        fullName,
        nickname,
        parentName,
        parentPhone,
      });
      setIsModalOpen(false);
      setFullName('');
      setNickname('');
      setParentName('');
      setParentPhone('');
      fetchStudents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menambahkan murid');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lpa_token');
    localStorage.removeItem('lpa_teacher');
    router.push('/login');
  };

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (s.nickname && s.nickname.toLowerCase().includes(search.toLowerCase())) ||
      (s.parentName && s.parentName.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans text-[#1A202C]">
      
      {/* Header Guru */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-bold text-lg text-[#0D5C46]">Halo, {teacher?.fullName || 'Guru'}</h1>
            <p className="text-xs text-[#4A5568]">{teacher?.schoolName || 'Sistem LPA'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
          >
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Banner Aksi Utama */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#E8F5F1] p-5 rounded-2xl border border-[#B9E5D8]">
          <div>
            <h2 className="font-bold text-base text-[#0D5C46]">Daftar Siswa Binaan</h2>
            <p className="text-xs text-[#4A5568] mt-0.5">Kelola data murid dan buat laporan pembelajaran harian</p>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white hover:bg-slate-50 text-[#0D5C46] border border-[#0D5C46] font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm flex-1 sm:flex-initial"
            >
              <UserPlus size={16} />
              <span>Tambah Siswa</span>
            </button>
            <Link
              href="/teacher/reports/new"
              className="bg-[#0D5C46] hover:bg-[#094132] text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm flex-1 sm:flex-initial"
            >
              <FilePlus size={16} />
              <span>+ Buat Laporan</span>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari siswa atau nama orang tua..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
          />
        </div>

        {/* Daftar Siswa */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Memuat daftar siswa...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
            <Users size={40} className="mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-sm text-[#1A202C]">Belum Ada Data Siswa</p>
            <p className="text-xs text-[#4A5568] mt-1 mb-4">Tambahkan siswa terlebih dahulu sebelum membuat laporan.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#0D5C46] text-white font-semibold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5"
            >
              <UserPlus size={16} />
              <span>Tambah Siswa Pertama</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredStudents.map((s) => (
              <div
                key={s.id}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-[#0D5C46] transition-all flex justify-between items-center group"
              >
                <div>
                  <h3 className="font-bold text-sm text-[#1A202C]">{s.fullName}</h3>
                  {s.parentName && (
                    <p className="text-xs text-[#4A5568] mt-0.5">Ortu: {s.parentName}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-[#4A5568]">
                    <span className="flex items-center gap-1 text-[#0D5C46] font-medium">
                      <Phone size={12} /> {s.parentPhone}
                    </span>
                    <span>• {s._count?.reports || 0} Laporan</span>
                  </div>
                </div>
                <Link
                  href={`/teacher/students/${s.id}`}
                  className="p-2 text-slate-400 group-hover:text-[#0D5C46] group-hover:bg-[#E8F5F1] rounded-xl transition-all"
                >
                  <ChevronRight size={20} />
                </Link>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Modal Tambah Siswa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <h2 className="font-bold text-base text-[#1A202C] mb-4">Tambah Siswa Baru</h2>

            <form onSubmit={handleCreateStudent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">Nama Lengkap Anak</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Budi Pratama"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">Nama Panggilan (Opsional)</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Budi"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">Nama Orang Tua / Wali (Opsional)</label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Ibu Ratna"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">Nomor WhatsApp Orang Tua</label>
                <input
                  type="tel"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
                  required
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
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0D5C46] hover:bg-[#094132] rounded-xl"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}