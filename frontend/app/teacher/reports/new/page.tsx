'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { ArrowLeft, Send, Sparkles, ExternalLink, Eye, X, BookOpen, Users } from 'lucide-react';

interface Student {
  id: string;
  fullName: string;
  parentName?: string;
  parentPhone: string;
}

interface ClassItem {
  id: string;
  name: string;
}

interface StudentReportState {
  studentId: string;
  attendance: string;
  activityLevel: string;
  additionalNotes: string;
  recommendations: string;
}

function NewReportForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialClassId = searchParams.get('classId') || '';

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClassId, setSelectedClassId] = useState(initialClassId);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [sessionDate, setSessionDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [dayName, setDayName] = useState('');
  const [title, setTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');

  const [studentReports, setStudentReports] = useState<Record<string, StudentReportState>>({});
  const [saving, setSaving] = useState(false);

  const [batchResult, setBatchResult] = useState<{
    sessionTitle: string;
    reports: Array<{
      report: any;
      publicReportUrl: string;
      whatsappShareUrl: string;
      waText: string;
    }>;
  } | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (sessionDate) {
      const d = new Date(sessionDate);
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      setDayName(days[d.getDay()]);
    }
  }, [sessionDate]);

  useEffect(() => {
    if (selectedClassId) {
      fetchClassStudents(selectedClassId);
    }
  }, [selectedClassId]);

  const fetchClasses = async () => {
    try {
      const res = await api.get('/classes');
      setClasses(res.data);
      if (!selectedClassId && res.data.length > 0) {
        setSelectedClassId(res.data[0].id);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/login');
      }
    }
  };

  const fetchClassStudents = async (cId: string) => {
    try {
      setLoadingStudents(true);
      const res = await api.get(`/students/class/${cId}`);
      setStudents(res.data);

      const initialMap: Record<string, StudentReportState> = {};
      res.data.forEach((s: Student) => {
        initialMap[s.id] = {
          studentId: s.id,
          attendance: 'HADIR',
          activityLevel: 'AKTIF',
          additionalNotes: '',
          recommendations: '',
        };
      });
      setStudentReports(initialMap);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const updateStudentReport = (
    studentId: string,
    field: keyof StudentReportState,
    value: string,
  ) => {
    setStudentReports((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const handleSaveSessionReports = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) return alert('Silakan pilih kelas');
    if (students.length === 0) return alert('Tidak ada murid di kelas ini');

    try {
      setSaving(true);

      const payloadReports = Object.values(studentReports);

      const res = await api.post('/reports/session', {
        classId: selectedClassId,
        sessionDate,
        dayName,
        title,
        lessonDescription,
        studentReports: payloadReports,
      });

      setBatchResult({
        sessionTitle: title,
        reports: res.data.reports,
      });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan laporan sesi kelas');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-[#1A202C]">
      
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link
            href="/teacher/classes"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0D5C46]"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Kelas</span>
          </Link>
          <span className="text-xs font-bold text-[#0D5C46]">Sesi Pembelajaran Kelas</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-6">
        <form onSubmit={handleSaveSessionReports} className="space-y-6">
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-[#0D5C46] font-bold text-base border-b border-slate-100 pb-3">
              <BookOpen size={20} />
              <h2>1. Informasi Sesi Pembelajaran</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A202C] mb-1">Pilih Kelas</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full p-2.5 bg-white rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
                  required
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A202C] mb-1">Tanggal Sesi & Hari</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full p-2.5 bg-white rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
                    required
                  />
                  <input
                    type="text"
                    value={dayName}
                    onChange={(e) => setDayName(e.target.value)}
                    placeholder="Hari"
                    className="w-24 p-2.5 bg-slate-50 rounded-xl border border-slate-300 text-xs font-bold text-[#0D5C46] text-center focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A202C] mb-1">Judul / Topik Materi Pembelajaran</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Perkalian Angka 3 dan Pemahaman Cerita Singkat"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A202C] mb-1">Deskripsi Pembelajaran (Diisi 1x untuk Seluruh Kelas)</label>
              <textarea
                rows={3}
                value={lessonDescription}
                onChange={(e) => setLessonDescription(e.target.value)}
                placeholder="Contoh: Hari ini anak-anak mempelajari konsep dasar perkalian 3 menggunakan media kelereng dan menjawab 10 latihan soal cerita bersama..."
                className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
                required
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[#0D5C46] font-bold text-base">
                <Users size={20} />
                <h2>2. Presensi & Perkembangan Murid</h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">{students.length} Murid</span>
            </div>

            {loadingStudents ? (
              <div className="py-8 text-center text-xs text-slate-400">Memuat murid kelas...</div>
            ) : students.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Tidak ada murid di kelas ini. Silakan tambahkan murid terlebih dahulu.
              </div>
            ) : (
              <div className="space-y-4">
                {students.map((student, idx) => {
                  const state = studentReports[student.id] || {
                    attendance: 'HADIR',
                    activityLevel: 'AKTIF',
                    additionalNotes: '',
                    recommendations: '',
                  };

                  return (
                    <div
                      key={student.id}
                      className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-[#1A202C]">
                          {idx + 1}. {student.fullName}
                        </span>
                        <span className="text-xs text-slate-500">Ortu: {student.parentName || '-'}</span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#1A202C] mb-1">Status Kehadiran</label>
                          <select
                            value={state.attendance}
                            onChange={(e) => updateStudentReport(student.id, 'attendance', e.target.value)}
                            className="w-full p-2 bg-white rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none"
                          >
                            <option value="HADIR">✅ HADIR</option>
                            <option value="IZIN">✋ IZIN</option>
                            <option value="SAKIT">🤒 SAKIT</option>
                            <option value="ALPA">❌ ALPA</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#1A202C] mb-1">Keaktifan Belajar</label>
                          <select
                            value={state.activityLevel}
                            onChange={(e) => updateStudentReport(student.id, 'activityLevel', e.target.value)}
                            className="w-full p-2 bg-white rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none"
                          >
                            <option value="SANGAT_AKTIF">🌟 SANGAT AKTIF</option>
                            <option value="AKTIF">👍 AKTIF</option>
                            <option value="CUKUP">🙂 CUKUP</option>
                            <option value="PASIF">😴 PASIF</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#1A202C] mb-1">Catatan Tambahan untuk {student.fullName}</label>
                        <input
                          type="text"
                          value={state.additionalNotes}
                          onChange={(e) => updateStudentReport(student.id, 'additionalNotes', e.target.value)}
                          placeholder="Contoh: Sangat antusias menjawab 8 soal mandiri..."
                          className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#1A202C] mb-1">Rekomendasi di Rumah</label>
                        <input
                          type="text"
                          value={state.recommendations}
                          onChange={(e) => updateStudentReport(student.id, 'recommendations', e.target.value)}
                          placeholder="Contoh: Dampingi latihan perkalian 3 selama 5-10 menit sebelum tidur..."
                          className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none"
                        />
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving || students.length === 0}
            className="w-full bg-[#0D5C46] hover:bg-[#094132] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Send size={18} />
            {saving ? 'Menyimpan & Membuat Link...' : 'Simpan Sesi & Generate Link WA Orang Tua'}
          </button>

        </form>
      </main>

      {batchResult && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl relative space-y-4 max-h-[85vh] flex flex-col">
            <button
              onClick={() => {
                setBatchResult(null);
                router.push('/teacher/classes');
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 text-[#16A34A] font-bold text-base">
              <Sparkles size={22} />
              <h2>Laporan Sesi "{batchResult.sessionTitle}" Berhasil Dibuat!</h2>
            </div>

            <p className="text-xs text-slate-500">
              Berikut daftar link laporan dan tombol kirim WhatsApp untuk masing-masing orang tua murid:
            </p>

            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {batchResult.reports.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-[#1A202C]">
                      {item.report.student.fullName}
                    </span>
                    <span className="text-[11px] font-semibold text-[#0D5C46]">
                      {item.report.attendance} • {item.report.activityLevel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={item.whatsappShareUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#16A34A] hover:bg-[#15803D] text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
                    >
                      <ExternalLink size={14} />
                      <span>Kirim WA</span>
                    </a>
                    <Link
                      href={`/r/${item.report.access.accessToken}`}
                      target="_blank"
                      className="bg-white hover:bg-slate-100 text-slate-700 font-semibold px-3 py-1.5 rounded-lg border border-slate-300 text-xs flex items-center gap-1"
                    >
                      <Eye size={14} />
                      <span>Pratinjau Ortu</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setBatchResult(null);
                router.push('/teacher/classes');
              }}
              className="w-full bg-[#0D5C46] text-white font-bold py-2.5 rounded-xl text-xs"
            >
              Selesai & Kembali ke Kelas
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default function NewReportPage() {
  return (
    <Suspense fallback={<div className="p-4 text-xs text-slate-400">Memuat halaman...</div>}>
      <NewReportForm />
    </Suspense>
  );
}