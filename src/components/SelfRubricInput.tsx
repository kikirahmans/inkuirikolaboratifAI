import React from "react";
import { Check, Info, Award, HelpCircle } from "lucide-react";
import { SelfRubricScores, calculateAverageRubric } from "../types";

interface SelfRubricInputProps {
  scores: SelfRubricScores;
  onChange: (scores: SelfRubricScores) => void;
}

export const RUBRIC_DIMENSIONS = [
  {
    key: "penguasaanMateri" as keyof SelfRubricScores,
    title: "1. Penguasaan Materi & Alur TP",
    subtitle: "Kedalaman penguasaan konten dan kemampuan membedah prasyarat konsep serta miskonsepsi.",
    levels: [
      { score: 1, label: "Perlu Pendampingan", desc: "Masih kesulitan membedah urutan prasyarat konsep dan miskonsepsi dasar siswa." },
      { score: 2, label: "Berkembang", desc: "Memahami TP secara teoritis, namun masih terkendala mengaitkannya dengan aplikasi kontekstual." },
      { score: 3, label: "Cakap", desc: "Menguasai TP secara utuh, mampu menghubungkan dengan studi kasus nyata dan mendiagnosis miskonsepsi." },
      { score: 4, label: "Mahir", desc: "Sangat menguasai konsep esensial, transfer teknologi/AI relevan, dan desain tantangan bertingkat." },
    ],
  },
  {
    key: "diferensiasi" as keyof SelfRubricScores,
    title: "2. Diferensiasi & Akomodasi Kebutuhan Belajar",
    subtitle: "Pemberian scaffolding dan perlakuan bagi siswa lambat belajar, reguler, maupun cepat.",
    levels: [
      { score: 1, label: "Perlu Pendampingan", desc: "Pendekatan seragam satu arah tanpa penyesuaian bagi siswa dengan kecepatan belajar berbeda." },
      { score: 2, label: "Berkembang", desc: "Menyediakan variasi latihan sederhana, namun belum berbasis data pemetaan diagnostik." },
      { score: 3, label: "Cakap", desc: "Menerapkan diferensiasi proses/konten (scaffolding LKPD, bimbingan kelompok kecil terarah)." },
      { score: 4, label: "Mahir", desc: "Diferensiasi komprehensif terintegrasi penuh: intervensi tuntas, penguatan reguler, dan pengayaan inovatif." },
    ],
  },
  {
    key: "interaktivitas" as keyof SelfRubricScores,
    title: "3. Interaktivitas & Iklim Partisipatif",
    subtitle: "Mendorong keterlibatan aktif, kolaborasi antar siswa (peer learning), dan dinamika kelas.",
    levels: [
      { score: 1, label: "Perlu Pendampingan", desc: "Didominasi ceramah pasif, partisipasi siswa sangat minim atau enggan merespons." },
      { score: 2, label: "Berkembang", desc: "Ada sesi tanya jawab atau diskusi, namun hanya didominasi 3-4 siswa yang aktif." },
      { score: 3, label: "Cakap", desc: "Menerapkan model aktif (misal: Pair Programming, PBL, simulasi) dengan partisipasi merata." },
      { score: 4, label: "Mahir", desc: "Iklim kelas sangat memberdayakan, saling asah antar siswa, antusiasme tinggi (>85% terlibat aktif)." },
    ],
  },
  {
    key: "asesmenData" as keyof SelfRubricScores,
    title: "4. Analisis Data Hasil Belajar & Diagnostik",
    subtitle: "Ketajaman memanfaatkan angka ketuntasan, analisis butir soal sukar, dan pola kesalahan siswa.",
    levels: [
      { score: 1, label: "Perlu Pendampingan", desc: "Penilaian hanya berhenti pada pemberian nilai mentah tanpa analisis butir soal atau kesenjangan." },
      { score: 2, label: "Berkembang", desc: "Menghitung rata-rata dan ketuntasan, tetapi belum menelusuri akar penyebab soal sukar." },
      { score: 3, label: "Cakap", desc: "Memetakan pola distraktor/soal sukar dan mengidentifikasi daftar siswa yang butuh penguatan KKTP." },
      { score: 4, label: "Mahir", desc: "Menganalisis korelasi data formatif numerik dengan catatan observasi perilaku belajar siswa secara tajam." },
    ],
  },
  {
    key: "tindakLanjut" as keyof SelfRubricScores,
    title: "5. Rencana Tindak Lanjut & Siklus Perubahan",
    subtitle: "Komitmen melakukan modifikasi konkret pada siklus Inkuiri berikutnya dan kolaborasi sejawat.",
    levels: [
      { score: 1, label: "Perlu Pendampingan", desc: "Belum merumuskan langkah perbaikan yang jelas untuk pertemuan atau siklus mendatang." },
      { score: 2, label: "Berkembang", desc: "Rencana perbaikan masih bersifat umum dan belum terukur instrumen intervensinya." },
      { score: 3, label: "Cakap", desc: "Menetapkan tindakan adaptasi spesifik (modifikasi LKPD, alat peraga baru, strategi waktu) yang terukur." },
      { score: 4, label: "Mahir", desc: "Rencana perbaikan berbasis bukti, berorientasi keberlanjutan, dan siap diimbaskan ke komunitas MGMP." },
    ],
  },
];

export const SelfRubricInput: React.FC<SelfRubricInputProps> = ({ scores, onChange }) => {
  const handleScoreSelect = (key: keyof SelfRubricScores, score: number) => {
    onChange({
      ...scores,
      [key]: score,
    });
  };

  const averageScore = calculateAverageRubric(scores).toFixed(2);

  const getBadgeClass = (score: number) => {
    if (score >= 3.6) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (score >= 3.0) return "bg-indigo-50 text-indigo-700 border-indigo-200";
    if (score >= 2.0) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  const getPredikatText = (avg: number) => {
    if (avg >= 3.6) return "Mahir (Exemplary)";
    if (avg >= 3.0) return "Cakap (Proficient)";
    if (avg >= 2.0) return "Berkembang (Developing)";
    return "Perlu Pendampingan (Needs Support)";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Award className="text-indigo-600" size={20} />
            <h3 className="font-heading font-bold text-base text-slate-900">
              Rubrik Evaluasi Mandiri Guru (Skala 1 - 4)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Refleksi jujur atas praktik pembelajaran yang telah berlangsung sebagai basis perbandingan dengan Analisis AI.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shrink-0">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Rata-rata Mandiri
            </span>
            <span className="text-sm font-bold text-indigo-600">
              {averageScore} / 4.0
            </span>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getBadgeClass(
              Number(averageScore)
            )}`}
          >
            {getPredikatText(Number(averageScore))}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {RUBRIC_DIMENSIONS.map((dim) => {
          const currentScore = scores[dim.key] || 3;
          return (
            <div
              key={dim.key}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                    {dim.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">{dim.subtitle}</p>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-indigo-600 border border-slate-200 shadow-2xs">
                    Skor: {currentScore}
                  </span>
                </div>
              </div>

              {/* 4 Levels Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 mt-2.5">
                {dim.levels.map((lvl) => {
                  const isSelected = Math.round(currentScore) === lvl.score;
                  return (
                    <button
                      type="button"
                      key={lvl.score}
                      onClick={() => handleScoreSelect(dim.key, lvl.score)}
                      className={`text-left p-3 rounded-xl border transition text-xs flex flex-col justify-between ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-700 shadow-sm ring-2 ring-indigo-500/20"
                          : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span>
                            {lvl.score}. {lvl.label}
                          </span>
                          {isSelected && <Check size={14} className="text-indigo-200" />}
                        </div>
                        <p
                          className={`text-[11px] leading-relaxed ${
                            isSelected ? "text-indigo-100" : "text-slate-500"
                          }`}
                        >
                          {lvl.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
