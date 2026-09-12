'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { ArrowLeft, Phone, Plus, MessageCircle, Clock, Eye, CheckCircle2, Copy } from 'lucide-react';

interface ReportItem {
  id: string;
  sessionDate: string;
  subjectTopic: string;
  progressNotes: string;
  recommendations: string;
  access?: {
    accessToken: string;
    viewCount: number;
  };
  feedback?: {
    reaction?: string;
    feedbackText: string;
    submittedAt: string;
  };
}

interface StudentDetail {
  id: string;
  fullName: string;
  nickname?: string;
  parentName?: string;
  parentPhone: string;
  reports: ReportItem[];
}

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;
  const router = useRouter();

  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentDetail();
  }, [studentId]);

  const fetchStudentDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/students/${studentId}`);
      setStudent(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-center text-xs text-slate-400">
        Memuat profil siswa...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4">
        <p className="text-sm font-semibold text-slate-600">Siswa tidak ditemukan</p>
        <Link href="/teacher/students" className="mt-2 text-xs text-[#0D5C46] font-bold">
          Kembali ke Daftar Siswa
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans text-[#1A202C]">
      
      {/* Header Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link
            href="/teacher/students"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0D5C46]"
          >
            <ArrowLeft size={16} />
            <span>Kembali</span>
          </Link>
          <span className="text-xs font-bold text-[#0D5C46]">Profil Siswa</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Profile Card Siswa */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#1A202C]">{student.fullName}</h1>
            <p className="text-xs text-[#4A5568] mt-1">
              Ortu: {student.parentName || 'Orang Tua'} • WA: {student.parentPhone}
            </p>
          </div>
          <Link
            href={`/teacher/reports/new`}
            className="bg-[#0D5C46] hover:bg-[#094132] text-white font-bold px-4 py-2.5 rounded-xl text-xs inline-flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <Plus size={16} />
            <span>Buat Laporan Sesi Ini</span>
          </Link>
        </div>

        {/* Section Riwayat Pertemuan */}
        <div className="space-y-4">
          <h2 className="font-bold text-sm text-[#1A202C] px-1">Riwayat Pertemuan & Feedback Orang Tua</h2>

          {student.reports.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center border border-slate-100 text-xs text-slate-400">
              Belum ada laporan untuk {student.fullName}. Klik tombol "+ Buat Laporan Sesi Ini" di atas.
            </div>
          ) : (
            <div className="space-y-3">
              {student.reports.map((report) => {
                const formattedDate = new Date(report.sessionDate).toLocaleDateString('id-ID', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <div key={report.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                    
                    {/* Date & Status Badge */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-400">{formattedDate}</span>
                        <h3 className="font-bold text-sm text-[#1A202C] mt-0.5">{report.subjectTopic}</h3>
                      </div>
                      
                      {report.feedback ? (
                        <span className="inline-flex items-center gap-1 bg-[#DCFCE7] text-[#15803D] text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0">
                          <CheckCircle2 size={12} />
                          <span>SUDAH DIBALAS ORTU</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-[#FFEDD5] text-[#C2410C] text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0">
                          <Clock size={12} />
                          <span>MENUNGGU FEEDBACK</span>
                        </span>
                      )}
                    </div>

                    {/* Preview Catatan */}
                    <p className="text-xs text-[#4A5568] line-clamp-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {report.progressNotes}
                    </p>

                    {/* Tanggapan Ortu jika sudah ada */}
                    {report.feedback && (
                      <div className="bg-[#F0FDF4] p-3 rounded-xl border border-[#BBF7D0] text-xs text-[#166534] space-y-1">
                        <div className="flex items-center gap-1.5 font-bold">
                          <MessageCircle size={14} />
                          <span>Tanggapan Orang Tua:</span>
                          {report.feedback.reaction && (
                            <span className="text-sm">
                              {report.feedback.reaction === 'SENANG' && '😊'}
                              {report.feedback.reaction === 'PUAS' && '👍'}
                              {report.feedback.reaction === 'BINGUNG' && '🤔'}
                            </span>
                          )}
                        </div>
                        <p className="italic">"{report.feedback.feedbackText}"</p>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-slate-400 text-[11px]">
                        Dilihat {report.access?.viewCount || 0} kali oleh ortu
                      </span>
                      {report.access && (
                        <Link
                          href={`/r/${report.access.accessToken}`}
                          target="_blank"
                          className="text-[#0D5C46] font-bold hover:underline inline-flex items-center gap-1"
                        >
                          <Eye size={14} />
                          <span>Buka Link Laporan</span>
                        </Link>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}