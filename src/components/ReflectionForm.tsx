import React, { useState } from "react";
import {
  Sparkles,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ThumbsUp,
  Lightbulb,
  MessageCircleQuestion,
  BookOpen,
  Award,
  Users,
  Target,
  FileCheck,
  Compass,
} from "lucide-react";
import {
  ReflectionEntry,
  TeacherProfile,
  SelfRubricScores,
  AiFeedback,
  calculateAverageRubric,
} from "../types";
import { SelfRubricInput } from "./SelfRubricInput";
import { buildFallbackAnalysis } from "../utils/fallbackAnalyzer";

interface ReflectionFormProps {
  profile: TeacherProfile;
  initialEntry?: ReflectionEntry | null;
  onSave: (entry: ReflectionEntry) => void;
  onViewReport: (entry: ReflectionEntry) => void;
}

const INQUIRY_STAGES = [
  {
    key: "assess" as const,
    kode: "A",
    judul: "Assess",
    sub: "Identifikasi Kebutuhan & Data Awal",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    borderColor: "border-l-rose-500",
    headerColor: "text-rose-600",
    pertanyaan: [
      "Data apa (asesmen diagnostik/formatif awal) yang Anda gunakan untuk memahami kesiapan awal siswa?",
      "Tantangan nyata apa yang paling menonjol dihadapi siswa dalam mencapai TP?",
      "Pola kesalahan atau miskonsepsi apa yang paling sering muncul?",
    ],
    placeholder:
      "Contoh: Dari tes formatif awal, 10 dari 32 siswa mengalami kesulitan pada logika percabangan kondisi. Miskonsepsi utama terletak pada urutan eksekusi kondisi majemuk...",
  },
  {
    key: "design" as const,
    kode: "B",
    judul: "Design",
    sub: "Perancangan Strategi & Kolaborasi",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    borderColor: "border-l-indigo-600",
    headerColor: "text-indigo-600",
    pertanyaan: [
      "Strategi atau model pembelajaran apa (misal: Pair Programming, PBL, Diferensiasi) yang Anda rancang untuk menjawab tantangan tersebut?",
      "Dengan siapa Anda berdiskusi atau berkolaborasi (rekan MGMP/guru kejuruan/mitra)?",
      "Media, alat peraga, atau modul ajar/LKPD apa yang Anda siapkan?",
    ],
    placeholder:
      "Contoh: Bersama rekan MGMP Informatika, kami merancang model Pair Programming berbantuan LKPD dengan scaffolding bertahap dan simulasi kartu alur logika...",
  },
  {
    key: "implement" as const,
    kode: "C",
    judul: "Implement",
    sub: "Pelaksanaan di Kelas & Dinamika",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    borderColor: "border-l-amber-500",
    headerColor: "text-amber-600",
    pertanyaan: [
      "Bagaimana proses implementasi strategi ini berjalan di kelas/lab?",
      "Kendala nyata apa yang muncul selama proses pembelajaran?",
      "Bagaimana respons, antusiasme, dan dinamika partisipasi siswa?",
    ],
    placeholder:
      "Contoh: Pembelajaran di lab komputer berjalan aktif, keterlibatan mencapai 85%. Namun transisi antar pasangan sempat memakan waktu dan beberapa PC mengalami kendala koneksi...",
  },
  {
    key: "measure" as const,
    kode: "D",
    judul: "Measure, Reflect, Change",
    sub: "Pengukuran Hasil, Refleksi & Perubahan",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    borderColor: "border-l-emerald-500",
    headerColor: "text-emerald-600",
    pertanyaan: [
      "Bagaimana hasil belajar murid setelah strategi diterapkan (ketuntasan KKTP & rata-rata)?",
      "Bagian mana dari strategi Anda yang terbukti sangat efektif, dan mana yang kurang efektif?",
      "Tindakan konkret apa yang akan Anda ubah atau sesuaikan pada siklus berikutnya?",
    ],
    placeholder:
      "Contoh: Ketuntasan meningkat menjadi 82% dengan rata-rata 78.5. Soal analisis studi kasus masih membutuhkan visualisasi diagram alur sebelum siswa koding mandiri...",
  },
];

export const ReflectionForm: React.FC<ReflectionFormProps> = ({
  profile,
  initialEntry,
  onSave,
  onViewReport,
}) => {
  const [draft, setDraft] = useState<ReflectionEntry>(() => {
    if (initialEntry) return initialEntry;
    return {
      id: "ref-" + Math.random().toString(36).slice(2, 9),
      savedAt: new Date().toISOString(),
      mingguKe: 4,
      siklus: 4,
      periode: "08 - 12 September 2026",
      elemenTP: "Informatika & KKA: Rekursi & Logika Algoritma Pencarian Linear",
      rekan: "MGMP Informatika SMK Negeri 2 Gorontalo",
      jumlahSiswa: 32,
      rataNA: 79.5,
      kktp: 75,
      persenTuntas: 81.25,
      keterlibatanRate: 85,
      soalSukar: "Soal 4 (Penentuan Kasus Dasar / Base Case pada Algoritma Rekursif)",
      assess:
        "Melalui kuis diagnostik, siswa telah menguasai konsep perulangan reguler (for loop). Namun ketika diperkenalkan konsep fungsi rekursif, sebagian besar siswa mengalami kesulitan memvisualisasikan penumpukan memori (call stack) dan sering melupakan kondisi base case sehingga terjadi infinite recursion.",
      design:
        "Bekerja sama dengan rekan sejawat MGMP, kami merancang pembelajaran berbasis simulasi fisik peran (Role Play Call Stack) menggunakan kartu indeks dan papan visual alur rekursi sebelum siswa menulis kode di komputer.",
      implement:
        "Aktivitas simulasi fisik di awal kelas sangat efektif memecah kebingungan siswa; mereka bergiliran menjadi 'fungsi anak' yang mengembalikan nilai. Kelas sangat hidup dengan partisipasi aktif mencapai 85%.",
      measure:
        "Hasil asesmen formatif menunjukkan 26 dari 32 siswa (81.25%) tuntas melampaui KKTP dengan nilai rata-rata 79.5. Rencana siklus berikutnya: menghubungkan konsep rekursi ini dengan algoritma pencarian biner (binary search).",
      selfRubricScores: {
        penguasaanMateri: 3.5,
        diferensiasi: 3.2,
        interaktivitas: 3.8,
        asesmenData: 3.6,
        tindakLanjut: 3.5,
      },
      aiFeedback: null,
      status: "draft",
    };
  });

  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleUpdate = (field: keyof ReflectionEntry, value: any) => {
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRubricChange = (scores: SelfRubricScores) => {
    setDraft((prev) => ({
      ...prev,
      selfRubricScores: scores,
    }));
  };

  const requestAiAnalysis = async () => {
    setIsLoadingAi(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      let result: AiFeedback;
      try {
        const response = await fetch("/api/reflect/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teacherProfile: profile,
            draft,
            selfRubricScores: draft.selfRubricScores,
          }),
        });

        if (response.ok) {
          result = await response.json();
        } else {
          // Fallback if backend route is unavailable (e.g. static hosting on GitHub Pages)
          result = buildFallbackAnalysis(draft, draft.selfRubricScores);
        }
      } catch {
        // Fallback for network error or offline mode
        result = buildFallbackAnalysis(draft, draft.selfRubricScores);
      }

      setDraft((prev) => ({
        ...prev,
        aiFeedback: result,
      }));
      setSuccessMessage("Analisis reflektif dan acuan pedagogik berhasil diperbarui!");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message || "Terjadi kesalahan saat memproses masukan analisis."
      );
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleSaveDraft = (markFinal: boolean = false) => {
    const updatedEntry: ReflectionEntry = {
      ...draft,
      savedAt: new Date().toISOString(),
      status: markFinal ? "final" : "draft",
    };
    onSave(updatedEntry);
    setSuccessMessage(
      markFinal
        ? "Refleksi berhasil disimpan dengan status Siap Lapor!"
        : "Draf refleksi berhasil disimpan!"
    );
  };

  const hasAnyNarrative =
    Boolean(draft.assess.trim()) ||
    Boolean(draft.design.trim()) ||
    Boolean(draft.implement.trim()) ||
    Boolean(draft.measure.trim());

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {errorMessage && (
        <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs sm:text-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-600" />
          <div>
            <p className="font-semibold">Perhatian</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm">
          <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-600" />
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      {/* Identitas Siklus Mingguan */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
          <BookOpen className="text-indigo-600" size={18} />
          <h3 className="font-heading font-bold text-slate-900 text-sm sm:text-base">
            Identitas Siklus & Tujuan Pembelajaran (TP)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Minggu ke-
            </label>
            <input
              type="number"
              min={1}
              value={draft.mingguKe}
              onChange={(e) => handleUpdate("mingguKe", Number(e.target.value))}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-slate-50 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Siklus Inkuiri ke-
            </label>
            <input
              type="number"
              min={1}
              value={draft.siklus}
              onChange={(e) => handleUpdate("siklus", Number(e.target.value))}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-slate-50 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Periode Pelaksanaan
            </label>
            <input
              type="text"
              value={draft.periode}
              onChange={(e) => handleUpdate("periode", e.target.value)}
              placeholder="mis. 08 - 12 September 2026"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-slate-50 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rekan Kolaborasi / Tim MGMP
            </label>
            <input
              type="text"
              value={draft.rekan}
              onChange={(e) => handleUpdate("rekan", e.target.value)}
              placeholder="mis. MGMP Informatika Satuan Pendidikan"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-slate-50 transition"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Elemen & Tujuan Pembelajaran (TP) yang Direfleksikan
            </label>
            <input
              type="text"
              value={draft.elemenTP}
              onChange={(e) => handleUpdate("elemenTP", e.target.value)}
              placeholder="mis. Algoritma & Pemrograman: Menganalisis dan Mengimplementasikan Struktur Kontrol Percabangan"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-slate-50 transition"
            />
          </div>
        </div>
      </div>

      {/* Ringkasan Data Kuantitatif Hasil Belajar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Target className="text-indigo-600" size={18} />
            <h3 className="font-heading font-bold text-slate-900 text-sm sm:text-base">
              Data Kuantitatif Hasil Belajar & Asesmen Formatif
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Tolok ukur acuan AI dan visualisasi data grafik
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jumlah Siswa
            </label>
            <input
              type="number"
              value={draft.jumlahSiswa}
              onChange={(e) => handleUpdate("jumlahSiswa", Number(e.target.value))}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-slate-50 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rata-rata Nilai Akhir (NA)
            </label>
            <input
              type="number"
              step="0.1"
              value={draft.rataNA}
              onChange={(e) => handleUpdate("rataNA", Number(e.target.value))}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-slate-50 font-semibold text-indigo-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kriteria Ketuntasan (KKTP)
            </label>
            <input
              type="number"
              value={draft.kktp}
              onChange={(e) => handleUpdate("kktp", Number(e.target.value))}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-slate-50 font-semibold text-rose-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              % Ketuntasan Siswa
            </label>
            <input
              type="number"
              step="0.1"
              value={draft.persenTuntas}
              onChange={(e) => handleUpdate("persenTuntas", Number(e.target.value))}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-slate-50 font-semibold text-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              % Keterlibatan Siswa
            </label>
            <input
              type="number"
              value={draft.keterlibatanRate}
              onChange={(e) => handleUpdate("keterlibatanRate", Number(e.target.value))}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-slate-50 font-semibold text-emerald-600"
            />
          </div>

          <div className="col-span-2 sm:col-span-3 lg:col-span-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Soal Formatif Kategori Sukar / Distraktor Utama
            </label>
            <input
              type="text"
              value={draft.soalSukar}
              onChange={(e) => handleUpdate("soalSukar", e.target.value)}
              placeholder="mis. Soal 4 (Studi Kasus Penentuan Base Case Rekursi & Nested Loop)"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* Rubrik Evaluasi Mandiri Guru */}
      <SelfRubricInput
        scores={draft.selfRubricScores}
        onChange={handleRubricChange}
      />

      {/* 4 Tahap Inkuiri Kolaboratif */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="text-indigo-600" size={20} />
            <h3 className="font-heading font-bold text-slate-900 text-sm sm:text-base">
              Catatan 4 Tahap Inkuiri Kolaboratif Guru
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Model Terstandar: Assess · Design · Implement · Measure
          </span>
        </div>

        {INQUIRY_STAGES.map((stage) => {
          return (
            <div
              key={stage.key}
              className={`bg-white rounded-2xl border border-slate-200 border-l-4 ${stage.borderColor} p-5 shadow-sm transition`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${stage.badgeColor}`}
                  >
                    Tahap {stage.kode}
                  </span>
                  <h4 className={`font-heading font-bold text-sm sm:text-base ${stage.headerColor}`}>
                    {stage.judul} <span className="font-normal text-xs text-slate-500">({stage.sub})</span>
                  </h4>
                </div>
              </div>

              {/* Guiding Questions */}
              <ul className="text-xs text-slate-500 space-y-1 mb-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {stage.pertanyaan.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>

              <textarea
                rows={4}
                value={draft[stage.key]}
                onChange={(e) => handleUpdate(stage.key, e.target.value)}
                placeholder={stage.placeholder}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white leading-relaxed resize-y"
              />
            </div>
          );
        })}
      </div>

      {/* Action Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={requestAiAnalysis}
            disabled={isLoadingAi || !hasAnyNarrative}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 transition shadow-lg shadow-indigo-100"
            id="btn-minta-acuan-ai"
          >
            {isLoadingAi ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} className="text-indigo-200" />
            )}
            <span>
              {isLoadingAi
                ? "Memproses Analisis & Acuan AI..."
                : "Minta Masukan & Acuan Terstandar AI"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveDraft(false)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
          >
            <Save size={15} />
            <span>Simpan Draf</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveDraft(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
          >
            <FileCheck size={15} />
            <span>Simpan & Siap Lapor</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onViewReport(draft)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
        >
          <BookOpen size={15} />
          <span>Lihat Format Laporan Mingguan</span>
        </button>
      </div>

      {/* AI Structured Reference Panel */}
      {draft.aiFeedback && (
        <div className="space-y-6">
          {/* Main AI Spotlight Card */}
          <div className="bg-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border border-indigo-900/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/25 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-bold shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-base sm:text-lg">
                    Wawasan & Acuan Terstandar AI
                  </h3>
                  <p className="text-xs text-indigo-300">
                    {draft.aiFeedback.acuanStandar}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs text-indigo-300">
                  Skor Validasi AI:
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
                  {calculateAverageRubric(draft.aiFeedback.skorValidasiAi).toFixed(2)}{" "}
                  / 4.0
                </span>
              </div>
            </div>

            {/* Diagnostic Summary */}
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 text-xs sm:text-sm text-indigo-100 leading-relaxed">
              <span className="font-bold text-white block mb-1 text-xs uppercase tracking-wider text-indigo-300">
                Ringkasan Diagnostik Siklus
              </span>
              {draft.aiFeedback.ringkasanDiagnostik}
            </div>
          </div>

          {/* Detailed Stage-by-Stage Analysis Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-heading font-bold text-slate-900 text-sm sm:text-base">
                Analisis Kematangan Inkuiri per Tahap
              </h4>
              <span className="text-xs text-slate-400">
                Standar Kompetensi Pedagogik Guru
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {INQUIRY_STAGES.map((s) => {
                const stageData = draft.aiFeedback?.stages[s.key];
                if (!stageData) return null;

                return (
                  <div
                    key={s.key}
                    className={`p-5 rounded-2xl border border-slate-200 border-l-4 ${s.borderColor} bg-slate-50/50 space-y-2.5`}
                  >
                    <div className="flex items-center justify-between">
                      <p className={`font-bold text-xs sm:text-sm ${s.headerColor}`}>
                        Tahap {s.kode}. {s.judul} <span className="text-slate-500 font-normal">({s.sub})</span>
                      </p>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs">
                        Tingkat: {stageData.tingkatKematangan}
                      </span>
                    </div>

                    {stageData.kekuatan && (
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                        <ThumbsUp size={15} className="shrink-0 mt-0.5 text-emerald-600" />
                        <div>
                          <span className="font-semibold text-slate-900">Kekuatan: </span>
                          <span>{stageData.kekuatan}</span>
                        </div>
                      </div>
                    )}

                    {stageData.masukan && (
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                        <Lightbulb size={15} className="shrink-0 mt-0.5 text-indigo-600" />
                        <div>
                          <span className="font-semibold text-slate-900">Masukan Perbaikan: </span>
                          <span>{stageData.masukan}</span>
                        </div>
                      </div>
                    )}

                    {stageData.pertanyaan_lanjutan && (
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 italic bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                        <MessageCircleQuestion size={15} className="shrink-0 mt-0.5 text-indigo-600 not-italic" />
                        <div>
                          <span className="font-semibold text-indigo-700 not-italic">
                            Pertanyaan Reflektif:{" "}
                          </span>
                          <span>"{stageData.pertanyaan_lanjutan}"</span>
                        </div>
                      </div>
                    )}

                    {stageData.indikatorAcuan && (
                      <p className="text-[11px] text-slate-400 font-medium pt-1.5 border-t border-slate-200">
                        Rujukan Indikator: {stageData.indikatorAcuan}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Differentiated Instruction Recommendations */}
            {draft.aiFeedback.rekomendasiDiferensiasi && (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 mt-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <h4 className="font-heading font-bold text-slate-900 text-xs sm:text-sm">
                    Rekomendasi Diferensiasi Belajar Berdasarkan Data
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="font-bold text-rose-600 block mb-1">
                      Kelompok Intervensi (&lt; KKTP)
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {draft.aiFeedback.rekomendasiDiferensiasi.intervensiTertinggal}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="font-bold text-indigo-600 block mb-1">
                      Kelompok Reguler (Tuntas)
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {draft.aiFeedback.rekomendasiDiferensiasi.penguatanReguler}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="font-bold text-emerald-600 block mb-1">
                      Kelompok Pengayaan (Tinggi)
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {draft.aiFeedback.rekomendasiDiferensiasi.pengayaanTinggi}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Rekomendasi Utama */}
            {draft.aiFeedback.rekomendasi_utama && (
              <div className="bg-indigo-50/60 p-5 rounded-2xl border border-indigo-100">
                <h4 className="font-heading font-bold text-indigo-950 text-xs sm:text-sm mb-3">
                  Rekomendasi Prioritas untuk Siklus Berikutnya
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {draft.aiFeedback.rekomendasi_utama.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
