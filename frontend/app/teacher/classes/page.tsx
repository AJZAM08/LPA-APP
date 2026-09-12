'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { School, Plus, LogOut, Users, BookOpen, ChevronRight, Search, X } from 'lucide-react';

interface ClassItem {
  id: string;
  name: string;
  gradeLevel?: string;
  _count?: {
    students: number;
    sessions: number;
  };
}

export default function ClassListPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState<any>(null);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('lpa_teacher');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role === 'SUPER_ADMIN') {
      router.push('/admin/dashboard');
      return;
    }
    setTeacher(user);
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/classes');
      setClasses(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.post('/classes', { name, gradeLevel });
      setIsModalOpen(false);
      setName('');
      setGradeLevel('');
      fetchClasses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal membuat kelas');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lpa_token');
    localStorage.removeItem('lpa_teacher');
    router.push('/login');
  };

  const filteredClasses = classes.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans text-[#1A202C]">
      
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-bold text-lg text-[#0D5C46]">Halo, {teacher?.fullName || 'Guru'}</h1>
            <p className="text-xs text-[#4A5568]">{teacher?.schoolName || 'Portal Kelas & Laporan'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#E8F5F1] p-5 rounded-2xl border border-[#B9E5D8]">
          <div>
            <h2 className="font-bold text-base text-[#0D5C46]">Daftar Kelas Binaan</h2>
            <p className="text-xs text-[#4A5568] mt-0.5">Pilih kelas untuk mengelola murid atau membuat sesi laporan pembelajaran baru</p>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white hover:bg-slate-50 text-[#0D5C46] border border-[#0D5C46] font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm flex-1 sm:flex-initial cursor-pointer"
            >
              <Plus size={16} />
              <span>+ Buat Kelas Baru</span>
            </button>
            <Link
              href="/teacher/reports/new"
              className="bg-[#0D5C46] hover:bg-[#094132] text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm flex-1 sm:flex-initial cursor-pointer"
            >
              <BookOpen size={16} />
              <span>+ Sesi Pembelajaran</span>
            </Link>
          </div>
        </div>

        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama kelas..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
          />
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Memuat daftar kelas...</div>
        ) : filteredClasses.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <School size={40} className="mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-sm text-[#1A202C]">Belum Ada Kelas</p>
            <p className="text-xs text-[#4A5568] mt-1 mb-4">Buat kelas terlebih dahulu untuk memasukkan data murid.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#0D5C46] text-white font-semibold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={16} />
              <span>Buat Kelas Pertama</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredClasses.map((c) => (
              <div
                key={c.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#0D5C46] transition-all flex justify-between items-center group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-[#E8F5F1] text-[#0D5C46] rounded-xl font-bold">
                      <School size={20} />
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-[#1A202C]">{c.name}</h3>
                      {c.gradeLevel && <p className="text-xs text-slate-500">{c.gradeLevel}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3 text-xs text-[#4A5568]">
                    <span className="flex items-center gap-1 text-[#0D5C46] font-medium">
                      <Users size={14} /> {c._count?.students || 0} Murid
                    </span>
                    <span>• {c._count?.sessions || 0} Sesi Pembelajaran</span>
                  </div>
                </div>

                <Link
                  href={`/teacher/classes/${c.id}`}
                  className="p-2.5 text-slate-400 group-hover:text-[#0D5C46] group-hover:bg-[#E8F5F1] rounded-xl transition-all"
                >
                  <ChevronRight size={22} />
                </Link>
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

            <h2 className="font-bold text-base text-[#1A202C] mb-4">Buat Kelas Baru</h2>

            <form onSubmit={handleCreateClass} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1A202C] mb-1">Nama Kelas / Kelompok</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Kelas 2A / Bimbel Matematika 3"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A202C] mb-1">Tingkat / Keterangan (Opsional)</label>
                <input
                  type="text"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  placeholder="Contoh: Sekolah Dasar Kelas 2"
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
                  {saving ? 'Membuat...' : 'Simpan Kelas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
