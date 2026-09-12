'use client';

import { use, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { BookOpen, Sparkles, Lightbulb, MessageSquare, CheckCircle2, HeartHandshake, AlertCircle, Calendar, UserCheck, Activity } from 'lucide-react';

interface PublicReportData {
  studentName: string;
  studentNickname?: string;
  className: string;
  teacherName: string;
  schoolName?: string;
  sessionDate: string;
  dayName: string;
  subjectTitle: string;
  lessonDescription: string;
  attendance: string;
  activityLevel: string;
  additionalNotes?: string;
  recommendations?: string;
  feedback?: {
    reaction?: string;
    feedbackText: string;
    submittedAt: string;
  };
}

export default function PublicReportPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PublicReportData | null>(null);

  const [selectedReaction, setSelectedReaction] = useState<string>('SENANG');
  const [feedbackText, setFeedbackText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [token]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/public/reports/${token}`);
      setData(res.data);
      if (res.data.feedback) {
        setSubmitted(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Laporan tidak ditemukan atau link sudah tidak aktif');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    try {
      setSubmitting(true);
      await api.post(`/public/reports/${token}/feedback`, {
        reaction: selectedReaction,
        feedbackText,
      });
      setSubmitted(true);
      fetchReport();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengirimkan tanggapan');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D5C46]"></div>
        <p className="mt-4 text-[#4A5568] font-medium text-sm">Memuat laporan perkembangan anak...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-6 text-center">
        <div className="bg-red-50 p-4 rounded-full mb-4 text-red-500">
          <AlertCircle size={48} />
        </div>
        <h1 className="text-xl font-bold text-[#1A202C] mb-2">Laporan Tidak Ditemukan</h1>
        <p className="text-[#4A5568] text-sm max-w-md">{error}</p>
      </div>
    );
  }

  const formattedDate = `${data.dayName}, ${new Date(data.sessionDate).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 px-4 font-sans text-[#1A202C]">
      <div className="max-w-md mx-auto space-y-5">

        <div className="bg-[#0D5C46] text-white rounded-2xl p-5 shadow-sm text-center relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#E8F5F1] opacity-90">
              {data.schoolName || 'Laporan Perkembangan Anak'} • {data.className}
            </span>
            <h1 className="text-2xl font-bold mt-1">Ananda {data.studentName.toUpperCase()}</h1>
            <p className="text-xs text-[#E8F5F1] mt-1 opacity-90">{formattedDate} • Bimbingan {data.teacherName}</p>
          </div>
        </div>

        {/* Section Ringkasan Presensi & Keaktifan */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-[#E8F5F1] text-[#0D5C46] rounded-xl font-bold">
              <UserCheck size={20} />
            </div>
            <div>
              <span className="block text-[11px] font-semibold text-slate-400">Kehadiran</span>
              <span className="font-bold text-xs text-[#0D5C46]">{data.attendance}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-[#FEF3C7] text-[#B45309] rounded-xl font-bold">
              <Activity size={20} />
            </div>
            <div>
              <span className="block text-[11px] font-semibold text-slate-400">Keaktifan</span>
              <span className="font-bold text-xs text-[#B45309]">
                {data.activityLevel === 'SANGAT_AKTIF' && '🌟 SANGAT AKTIF'}
                {data.activityLevel === 'AKTIF' && '👍 AKTIF'}
                {data.activityLevel === 'CUKUP' && '🙂 CUKUP'}
                {data.activityLevel === 'PASIF' && '😴 PASIF'}
              </span>
            </div>
          </div>
        </div>

        {/* Section Materi Pembelajaran Kelas */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2.5 text-[#0D5C46] font-bold text-base mb-2">
            <div className="p-2 bg-[#E8F5F1] rounded-lg">
              <BookOpen size={20} />
            </div>
            <h2>Materi Pembelajaran ({data.className})</h2>
          </div>
          <h3 className="font-bold text-sm text-[#1A202C] pl-10 mb-1">{data.subjectTitle}</h3>
          <p className="text-[#4A5568] text-sm leading-relaxed pl-10 whitespace-pre-line">
            {data.lessonDescription}
          </p>
        </div>

        {/* Section Perkembangan Khusus Anak */}
        {data.additionalNotes && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0D5C46] font-bold text-base mb-2">
              <div className="p-2 bg-[#E8F5F1] rounded-lg">
                <Sparkles size={20} />
              </div>
              <h2>Catatan Khusus Ananda</h2>
            </div>
            <p className="text-[#4A5568] text-sm leading-relaxed pl-10 whitespace-pre-line">
              {data.additionalNotes}
            </p>
          </div>
        )}

        {/* Section Saran & Latihan di Rumah */}
        {data.recommendations && (
          <div className="bg-[#FFFBEB] rounded-2xl p-5 shadow-sm border border-[#FDE68A]">
            <div className="flex items-center gap-2.5 text-[#B45309] font-bold text-base mb-2">
              <div className="p-2 bg-[#FEF3C7] rounded-lg">
                <Lightbulb size={20} />
              </div>
              <h2>Saran Latihan di Rumah</h2>
            </div>
            <p className="text-[#92400E] text-sm leading-relaxed pl-10 whitespace-pre-line">
              {data.recommendations}
            </p>
          </div>
        )}

        {/* Section Feedback Ortu */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2.5 text-[#0D5C46] font-bold text-base mb-4">
            <div className="p-2 bg-[#E8F5F1] rounded-lg">
              <MessageSquare size={20} />
            </div>
            <h2>Tanggapan Orang Tua</h2>
          </div>

          {submitted || data.feedback ? (
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4 text-center">
              <div className="flex justify-center text-[#16A34A] mb-2">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-bold text-[#166534] text-sm">Tanggapan Telah Terkirim</h3>
              <p className="text-xs text-[#15803D] mt-1">
                "{data.feedback?.feedbackText || feedbackText}"
              </p>
              <span className="inline-block mt-3 text-[11px] font-semibold bg-[#DCFCE7] text-[#15803D] px-3 py-1 rounded-full">
                Tersimpan langsung ke {data.teacherName}
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A202C] mb-2">
                  Bagaimana perasaan Ayah/Bunda hari ini?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'SENANG', emoji: '😊', label: 'Senang' },
                    { id: 'PUAS', emoji: '👍', label: 'Puas' },
                    { id: 'BINGUNG', emoji: '🤔', label: 'Butuh Diskusi' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedReaction(item.id)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        selectedReaction === item.id
                          ? 'border-[#0D5C46] bg-[#E8F5F1] font-semibold text-[#0D5C46]'
                          : 'border-slate-200 bg-white text-[#4A5568]'
                      }`}
                    >
                      <span className="text-xl block mb-1">{item.emoji}</span>
                      <span className="text-xs block">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A202C] mb-1.5">
                  Catatan untuk Guru (Tanggapan):
                </label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Contoh: Terima kasih infonya Pak/Bu, nanti malam kami dampingi ananda..."
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5C46]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#0D5C46] hover:bg-[#094132] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <HeartHandshake size={18} />
                {submitting ? 'Mengirim...' : 'Kirim Tanggapan ke Guru'}
              </button>
            </form>
          )}
        </div>

        <div className="text-center pt-2 pb-6">
          <p className="text-[11px] text-[#94A3B8]">
            Sistem Laporan Perkembangan Anak (LPA) • Komunikasi Guru & Ortu
          </p>
        </div>

      </div>
    </div>
  );
}