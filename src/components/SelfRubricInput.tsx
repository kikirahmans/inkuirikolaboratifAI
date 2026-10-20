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
      { score: 1, label: "Perlu Pendampingan", desc: "Masih kesulitan membedah urutan prasyarat konsep dan miskonsepsi dasar murid." },
      { score: 2, label: "Berkembang", desc: "Memahami TP secara teoritis, namun masih terkendala mengaitkannya dengan aplikasi kontekstual." },
      { score: 3, label: "Cakap", desc: "Menguasai TP secara utuh, mampu menghubungkan dengan studi kasus nyata dan mendiagnosis miskonsepsi." },
      { score: 4, label: "Mahir", desc: "Sangat menguasai konsep esensial, transfer teknologi/AI relevan, dan desain tantangan bertingkat." },
    ],
  },
  {
    key: "diferensiasi" as keyof SelfRubricScores,
    title: "2. Diferensiasi & Akomodasi Kebutuhan Belajar",
    subtitle: "Pemberian scaffolding dan perlakuan bagi murid lambat belajar, reguler, maupun cepat.",
    levels: [
      { score: 1, label: "Perlu Pendampingan", desc: "Pendekatan seragam satu arah tanpa penyesuaian bagi murid dengan kecepatan belajar berbeda." },
      { score: 2, label: "Berkembang", desc: "Menyediakan variasi latihan sederhana, namun belum berbasis data pemetaan diagnostik." },
      { score: 3, label: "Cakap", desc: "Menerapkan diferensiasi proses/konten (scaffolding LKPD, bimbingan kelompok kecil terarah)." },
      { score: 4, label: "Mahir", desc: "Diferensiasi komprehensif terintegrasi penuh: intervensi tuntas, penguatan reguler, dan pengayaan inovatif." },
    ],
  },
  {
    key: "interaktivitas" as keyof SelfRubricScores,
    title: "3. Interaktivitas & Iklim Partisipatif",
    subtitle: "Mendorong keterlibatan aktif, kolaborasi antar murid (peer learning), dan dinamika kelas.",
    levels: [
      { score: 1, label: "Perlu Pendampingan", desc: "Didominasi ceramah pasif, partisipasi murid sangat minim atau enggan merespons." },
      { score: 2, label: "Berkembang", desc: "Ada sesi tanya jawab atau diskusi, namun hanya didominasi 3-4 murid yang aktif." },
      { score: 3, label: "Cakap", desc: "Menerapkan model aktif (misal: Pair Programming, PBL, simulasi) dengan partisipasi merata." },
      { score: 4, label: "Mahir", desc: "Iklim kelas sangat memberdayakan, saling asah antar murid, antusiasme tinggi (>85% terlibat aktif)." },
    ],
  },
  {
    key: "asesmenData" as keyof SelfRubricScores,
    title: "4. Analisis Data Hasil Belajar & Diagnostik",
    subtitle: "Ketajaman memanfaatkan angka ketuntasan, analisis butir soal sukar, dan pola kesalahan murid.",
    levels: [
      { score: 1, label: "Perlu Pendampingan", desc: "Penilaian hanya berhenti pada pemberian nilai mentah tanpa analisis butir soal atau kesenjangan." },
      { score: 2, label: "Berkembang", desc: "Menghitung rata-rata dan ketuntasan, tetapi belum menelusuri akar penyebab soal sukar." },
      { score: 3, label: "Cakap", desc: "Memetakan pola distraktor/soal sukar dan mengidentifikasi daftar murid yang butuh penguatan KKTP." },
      { score: 4, label: "Mahir", desc: "Menganalisis korelasi data formatif numerik dengan catatan observasi perilaku belajar murid secara tajam." },
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

  const handleSetAllProficient = () => {
    onChange({
      penguasaanMateri: 3,
      diferensiasi: 3,
      interaktivitas: 3,
      asesmenData: 3,
      tindakLanjut: 3,
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
    if (avg >= 3.6) return "Mahir";
    if (avg >= 3.0) return "Cakap";
    if (avg >= 2.0) return "Berkembang";
    return "Perlu Bimbingan";
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Award size={18} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                Evaluasi Mandiri Guru (Skala 1 - 4)
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Refleksi jujur atas proses pembelajaran dan inkuiri kolaboratif di kelas
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          <button
            type="button"
            onClick={handleSetAllProficient}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50/80 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition cursor-pointer border border-indigo-200/60"
            title="Isi otomatis semua dimensi dengan skor 3 (Cakap)"
          >
            ⚡ Set Semua Cakap (Skor 3)
          </button>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shrink-0">
            <span className="text-xs font-bold text-indigo-700">
              {averageScore} <span className="text-[10px] text-slate-400">/ 4.0</span>
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeClass(
                Number(averageScore)
              )}`}
            >
              {getPredikatText(Number(averageScore))}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3.5">
        {RUBRIC_DIMENSIONS.map((dim) => {
          const currentScore = scores[dim.key] || 3;
          const activeLevel = dim.levels.find((l) => l.score === Math.round(currentScore)) || dim.levels[2];

          return (
            <div
              key={dim.key}
              className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                    {dim.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 hidden sm:block">{dim.subtitle}</p>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 border border-indigo-200 shrink-0">
                  Skor {currentScore} · {activeLevel.label}
                </span>
              </div>

              {/* Touch-Friendly Segmented Buttons (1-4) for Mobile & Desktop */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-200/70 rounded-xl">
                {dim.levels.map((lvl) => {
                  const isSelected = Math.round(currentScore) === lvl.score;
                  return (
                    <button
                      type="button"
                      key={lvl.score}
                      onClick={() => handleScoreSelect(dim.key, lvl.score)}
                      className={`min-h-[42px] sm:min-h-[40px] px-2 py-1.5 rounded-lg text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-white/80 text-slate-700 hover:bg-white hover:text-slate-900"
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-extrabold">{lvl.score}</span>
                      <span className="text-[10px] sm:text-xs truncate max-w-full">
                        {lvl.label.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active description callout */}
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-[11px] sm:text-xs text-slate-600 leading-relaxed flex items-start gap-2">
                <span className="font-bold text-indigo-600 shrink-0">
                  Tingkat {activeLevel.score} ({activeLevel.label}):
                </span>
                <span>{activeLevel.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
