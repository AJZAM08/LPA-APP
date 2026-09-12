'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { ArrowLeft, UserPlus, Phone, BookOpen, X, ChevronRight } from 'lucide-react';

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

interface ClassDetail {
  id: string;
  name: string;
  gradeLevel?: string;
  students: Student[];
  sessions: any[];
}

export default function ClassDetailPage({ params }: { params: Promise<{ classId: string }> }) {
  const resolvedParams = use(params);
  const classId = resolvedParams.classId;
  const router = useRouter();

  const [cls, setCls] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClassDetail();
  }, [classId]);

  const fetchClassDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/classes/${classId}`);
      setCls(res.data);
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
        classId,
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
      fetchClassDetail();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menambahkan murid');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-center text-xs text-slate-400 font-sans">
        Memuat detail kelas...
      </div>
    );
  }

  if (!cls) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4 font-sans">
        <p className="text-sm font-semibold text-slate-600">Kelas tidak ditemukan</p>
        <Link href="/teacher/classes" className="mt-2 text-xs text-[#0D5C46] font-bold">
          Kembali ke Daftar Kelas
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans text-[#1A202C]">
      
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link
            href="/teacher/classes"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0D5C46]"
          >
            <ArrowLeft size={16} />
            <span>Daftar Kelas</span>
          </Link>
          <span className="text-xs font-bold text-[#0D5C46]">{cls.name}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#1A202C]">{cls.name}</h1>
            <p className="text-xs text-[#4A5568] mt-1">
              {cls.gradeLevel || 'Kelas Binaan'} • {cls.students.length} Murid Terdaftar
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white hover:bg-slate-50 text-[#0D5C46] border border-[#0D5C46] font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <UserPlus size={16} />
              <span>+ Murid</span>
            </button>
            <Link
              href={`/teacher/reports/new?classId=${cls.id}`}
              className="bg-[#0D5C46] hover:bg-[#094132] text-white font-bold px-4 py-2.5 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <BookOpen size={16} />
              <span>+ Buat Sesi Pembelajaran</span>
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-bold text-sm text-[#1A202C] px-1">Daftar Murid {cls.name}</h2>

          {cls.students.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 text-xs text-slate-400">
              Belum ada murid di kelas ini. Klik "+ Murid" untuk menambah murid pertama.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {cls.students.map((s) => (
                <div key={s.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center group">
                  <div>
                    <h3 className="font-bold text-sm text-[#1A202C]">{s.fullName}</h3>
                    {s.parentName && <p className="text-xs text-[#4A5568] mt-0.5">Ortu: {s.parentName}</p>}
                    <p className="text-xs text-[#0D5C46] mt-1 flex items-center gap-1 font-medium">
                      <Phone size={12} /> {s.parentPhone}
                    </p>
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
        </div>

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

            <h2 className="font-bold text-base text-[#1A202C] mb-4">Tambah Murid ke {cls.name}</h2>

            <form onSubmit={handleCreateStudent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1A202C] mb-1">Nama Lengkap Anak</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Budi Pratama"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A202C] mb-1">Nama Panggilan (Opsional)</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Budi"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A202C] mb-1">Nama Orang Tua / Wali (Opsional)</label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Ibu Ratna"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A202C] mb-1">Nomor WhatsApp Orang Tua</label>
                <input
                  type="tel"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
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
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0D5C46] hover:bg-[#094132] rounded-xl cursor-pointer"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Murid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
