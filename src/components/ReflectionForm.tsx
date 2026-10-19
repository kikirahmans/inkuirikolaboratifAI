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
  ArrowRight,
  GitCompare,
  Share2,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Check,
  FileSpreadsheet,
} from "lucide-react";
import {
  ReflectionEntry,
  TeacherProfile,
  SelfRubricScores,
  AiFeedback,
  calculateAverageRubric,
  BuktiDataInput,
} from "../types";
import { SelfRubricInput } from "./SelfRubricInput";
import { buildFallbackAnalysis } from "../utils/fallbackAnalyzer";
import { AiFacilitatorChat } from "./AiFacilitatorChat";
import { StarExportModal } from "./StarExportModal";
import { PeerModeModal } from "./PeerModeModal";
import { CycleComparisonCard } from "./CycleComparisonCard";

interface ReflectionFormProps {
  profile: TeacherProfile;
  initialEntry?: ReflectionEntry | null;
  previousEntry?: ReflectionEntry | null;
  onSave: (entry: ReflectionEntry) => void;
  onViewReport: (entry: ReflectionEntry) => void;
  onIterateNextCycle?: (currentEntry: ReflectionEntry) => void;
}

// 5 Tahap Siklus TET & Inkuiri Kolaboratif dari Dokumen Acuan Halaman 1-3
const TET_STAGES = [
  {
    key: "assess" as const,
    nomor: 1,
    tahapTET: "Identifikasi",
    tahapInkuiri: "Assess",
    tujuan: "Memahami kebutuhan pengembangan secara utuh dari data nyata, bukan asumsi.",
    keluaran: "Rumusan 1-3 masalah prioritas beserta bukti pendukungnya.",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    borderColor: "border-l-rose-500",
    headerColor: "text-rose-700",
    pertanyaanPemandu: [
      "Pertemuan atau siklus mana yang ingin Bapak/Ibu refleksikan, dan apa tujuan pembelajarannya?",
      "Data apa yang sudah ada: hasil belajar murid, catatan observasi kelas, umpan balik murid, dan catatan refleksi sebelumnya?",
      "Dari data tersebut, pola masalah apa yang paling sering muncul (misalnya murid cepat kehilangan minat pada materi abstrak)?",
      "Bagaimana temuan ini dibandingkan dengan masukan rekan sejawat atau kepala sekolah (jika ada)?",
    ],
    placeholder:
      "Contoh: Dari tes formatif awal, 10 dari 32 murid (31.25%) belum mencapai KKTP pada materi logika dekomposisi. Pola masalah: murid cepat jenuh ketika teori diajarkan tanpa media visual...",
  },
  {
    key: "design" as const,
    nomor: 2,
    tahapTET: "Desain",
    tahapInkuiri: "Design",
    tujuan: "Merumuskan solusi dan eksperimen pembelajaran yang spesifik dan terukur.",
    keluaran: "Rencana eksperimen singkat berisi tujuan, strategi, indikator, peran pihak terkait, dan instrumen.",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    borderColor: "border-l-indigo-600",
    headerColor: "text-indigo-700",
    pertanyaanPemandu: [
      "Strategi atau eksperimen apa yang akan dicoba (misalnya simulasi unplugged, gim di Papan Interaktif, tugas bersama orang tua, infografis berbantuan AI)?",
      "Apa tujuan yang terukur dan indikator keberhasilannya (misalnya persentase ketuntasan, tingkat keterlibatan, kualitas produk)?",
      "Siapa saja yang terlibat (murid, orang tua, rekan sejawat, kepala sekolah) dan apa perannya?",
      "Instrumen apa yang akan dipakai untuk memantau (Google Classroom, lembar observasi, lembar kerja refleksi murid)?",
    ],
    placeholder:
      "Contoh: Merancang inovasi 'Huyula Digital' memadukan kartu unplugged, gim kuis di Papan Interaktif Digital, dan tugas infografis bersama orang tua. Target: ketuntasan >80% dan partisipasi kelas >85%...",
  },
  {
    key: "implement" as const,
    nomor: 3,
    tahapTET: "Implementasi",
    tahapInkuiri: "Implement",
    tujuan: "Mencatat apa yang benar-benar terjadi saat eksperimen dijalankan di kelas.",
    keluaran: "Catatan pelaksanaan beserta daftar bukti dokumentasi.",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    borderColor: "border-l-amber-500",
    headerColor: "text-amber-700",
    pertanyaanPemandu: [
      "Apakah pelaksanaan sesuai desain? Bagian mana yang berubah dan mengapa?",
      "Bagaimana jalannya kegiatan di kelas dan keterlibatan orang tua dalam tugas aplikatif?",
      "Dokumentasi apa yang tersedia (foto, tangkapan layar Classroom, hasil kerja murid, catatan observasi)?",
      "Dukungan atau pendampingan apa yang diterima (supervisi, peer observation, lesson study)?",
    ],
    placeholder:
      "Contoh: Eksperimen di kelas berjalan aktif, keterlibatan mencapai 84%. Sebanyak 30 dari 32 orang tua mengunggah bukti tanda tangan di Classroom. Waktu transisi berhasil dipangkas berkat checklist peran...",
  },
  {
    key: "measure" as const,
    nomor: 4,
    tahapTET: "Amati dan Refleksi",
    tahapInkuiri: "Measure - Reflect - Change",
    tujuan: "Mengukur dampak, memahami keberhasilan dan tantangan, lalu merumuskan perbaikan.",
    keluaran: "Analisis dampak, daftar keberhasilan, tantangan, area perbaikan, dan rencana perubahan siklus berikutnya.",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    borderColor: "border-l-emerald-500",
    headerColor: "text-emerald-700",
    pertanyaanPemandu: [
      "Bagaimana capaian dibandingkan indikator yang ditetapkan? Sebutkan angka atau bukti konkret.",
      "Apa yang berjalan baik, apa tantangannya, dan apa penyebab yang paling mungkin?",
      "Apa yang berubah pada praktik mengajar Bapak/Ibu sendiri setelah eksperimen ini?",
      "Perubahan apa yang akan dicoba pada siklus berikutnya, dan indikator apa yang akan dipantau?",
    ],
    placeholder:
      "Contoh: Ketuntasan murid mencapai 81.25% (naik 12.5% dari siklus 1) dengan rata-rata nilai 78.2. Kunci keberhasilan: tutor sebaya. Rencana siklus berikutnya: menambahkan visualisasi decision tree...",
  },
  {
    key: "share" as const,
    nomor: 5,
    tahapTET: "Berbagi Praktik Baik",
    tahapInkuiri: "(Tindak Lanjut Komunitas)",
    tujuan: "Menyebarluaskan pengalaman efektif agar menjadi pengetahuan bersama.",
    keluaran: "Draf dokumentasi praktik baik (ringkasan, langkah, bukti, tips replikasi).",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    borderColor: "border-l-purple-500",
    headerColor: "text-purple-700",
    pertanyaanPemandu: [
      "Bagian praktik mana yang terbukti efektif dan layak dibagikan?",
      "Kepada siapa dan melalui forum apa akan dibagikan (KKG/MGMP/sekolah)? Bagaimana rekan dapat mereplikasi atau mengadaptasinya?",
      "Apa kaitannya dengan program atau kebijakan sekolah?",
    ],
    placeholder:
      "Contoh: Lembar checklist peran dan alur gim interaktif telah dibagikan kepada 5 guru MGMP Informatika. Dua rekan telah mereplikasinya untuk materi algoritma kejuruan lain...",
  },
];

export const ReflectionForm: React.FC<ReflectionFormProps> = ({
  profile,
  initialEntry,
  previousEntry,
  onSave,
  onViewReport,
  onIterateNextCycle,
}) => {
  const [draft, setDraft] = useState<ReflectionEntry>(() => {
    if (initialEntry) return initialEntry;
    return {
      id: "ref-" + Math.random().toString(36).slice(2, 9),
      savedAt: new Date().toISOString(),
      mingguKe: 2,
      siklus: 2,
      periode: "25 - 29 Agustus 2026",
      elemenTP: "Berpikir Komputasional: Pengenalan Pola & Algoritma Percabangan Logika",
      rekan: "MGMP Informatika SMK Negeri 2 Gorontalo",
      jumlahSiswa: 32, // murid
      rataNA: 78.2,
      kktp: 75,
      persenTuntas: 81.25,
      keterlibatanRate: 84,
      soalSukar: "Soal 3 (Pola Kondisi Majemuk AND/OR pada Skema Warna)",
      assess: "",
      design: "",
      implement: "",
      measure: "",
      share: "",
      buktiData: {
        hasilBelajar: "",
        keterlibatanMurid: "",
        praktikGuru: "",
        keterlibatanOrangTua: "",
        prosesDigital: "",
        umpanBalikSejawat: "",
      },
      rencanaPerubahanBerikutnya: "",
      indikatorPemantauan: "",
      selfRubricScores: {
        penguasaanMateri: 3.5,
        diferensiasi: 3.2,
        interaktivitas: 3.5,
        asesmenData: 3.5,
        tindakLanjut: 3.4,
      },
      aiFeedback: null,
      status: "draft",
    };
  });

  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [isSavedAlert, setIsSavedAlert] = useState<boolean>(false);
  const [activeTabTahap, setActiveTabTahap] = useState<number>(1);
  const [showEvidencePanel, setShowEvidencePanel] = useState<boolean>(false);

  // Modals
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isStarOpen, setIsStarOpen] = useState<boolean>(false);
  const [isPeerOpen, setIsPeerOpen] = useState<boolean>(false);

  // Opening summary response state
  const [previousChangeTested, setPreviousChangeTested] = useState<string>("sudah");

  // Handle draft field change
  const handleChange = (
    field: keyof ReflectionEntry,
    value: any
  ) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleBuktiChange = (field: keyof BuktiDataInput, value: string) => {
    setDraft((prev) => ({
      ...prev,
      buktiData: {
        ...(prev.buktiData || {
          hasilBelajar: "",
          keterlibatanMurid: "",
          praktikGuru: "",
          keterlibatanOrangTua: "",
          prosesDigital: "",
          umpanBalikSejawat: "",
        }),
        [field]: value,
      },
    }));
  };

  const handleSelfScoresChange = (scores: SelfRubricScores) => {
    setDraft((prev) => ({ ...prev, selfRubricScores: scores }));
  };

  // Run AI Deep Analysis
  const handleAnalyzeWithAi = async () => {
    setIsLoadingAi(true);
    try {
      let analysisData: AiFeedback;

      try {
        const response = await fetch("/api/reflect/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teacherProfile: profile,
            draft,
            selfRubricScores: draft.selfRubricScores,
            previousEntry,
          }),
        });

        if (response.ok) {
          analysisData = await response.json();
        } else {
          analysisData = buildFallbackAnalysis(draft, draft.selfRubricScores, previousEntry, profile);
        }
      } catch {
        analysisData = buildFallbackAnalysis(draft, draft.selfRubricScores, previousEntry, profile);
      }

      setDraft((prev) => {
        const updated = {
          ...prev,
          aiFeedback: analysisData,
          status: "final" as const,
          savedAt: new Date().toISOString(),
        };
        onSave(updated);
        return updated;
      });

      setIsSavedAlert(true);
      setTimeout(() => setIsSavedAlert(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleSaveDraft = () => {
    const updated = {
      ...draft,
      savedAt: new Date().toISOString(),
    };
    onSave(updated);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  // Iterasi TET: Make findings of this cycle the basis of Stage 1 for the next cycle
  const handleStartNextIterativeCycle = () => {
    if (onIterateNextCycle) {
      onIterateNextCycle(draft);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Ringkasan Pembuka Sesi (Opening Session Summary - Dokumen Halaman 4 Bagian 6) */}
      {previousEntry && (
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-indigo-700/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-indigo-300">
                  Ringkasan Pembuka Sesi (Iterasi Siklus TET)
                </span>
              </div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                Melanjutkan Rencana Perubahan dari Siklus {previousEntry.siklus}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Pada Siklus {previousEntry.siklus}, capaian ketuntasan murid berada di{" "}
                <strong className="text-emerald-300">{previousEntry.persenTuntas}%</strong>. Rencana
                perubahan yang Anda tetapkan:{" "}
                <em className="text-amber-200">
                  "{previousEntry.rencanaPerubahanBerikutnya || "Penyempurnaan lembar peran & panduan orang tua"}"
                </em>
                .
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <span className="text-xs text-slate-200 font-medium">
                Apakah sudah diuji di kelas?
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPreviousChangeTested("sudah")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    previousChangeTested === "sudah"
                      ? "bg-emerald-500 text-white shadow-xs"
                      : "bg-white/10 text-slate-300 hover:bg-white/20"
                  }`}
                >
                  ✓ Sudah Dicoba
                </button>
                <button
                  type="button"
                  onClick={() => setPreviousChangeTested("belum")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    previousChangeTested === "belum"
                      ? "bg-amber-500 text-white shadow-xs"
                      : "bg-white/10 text-slate-300 hover:bg-white/20"
                  }`}
                >
                  Belum Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toolbar: AI Facilitator, Peer Mode, STAR Export */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Chat Facilitator */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm shadow-indigo-100 cursor-pointer"
          >
            <Sparkles size={16} className="text-amber-300" />
            <span>Fasilitator Inkuiri AI (Tanya-Jawab 1 Langkah)</span>
          </button>

          {/* Mode Sejawat */}
          <button
            onClick={() => setIsPeerOpen(true)}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer"
          >
            <Users size={16} className="text-indigo-600" />
            <span>Mode Sejawat (KKG/MGMP)</span>
          </button>

          {/* Ekspor STAR */}
          <button
            onClick={() => setIsStarOpen(true)}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer"
          >
            <Award size={16} className="text-emerald-600" />
            <span>Ekspor STAR (Praktik Baik)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEvidencePanel(!showEvidencePanel)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition cursor-pointer ${
              showEvidencePanel
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileSpreadsheet size={15} />
            <span>{showEvidencePanel ? "Tutup Panel Bukti Data" : "6 Kategori Bukti Data"}</span>
            {showEvidencePanel ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer"
          >
            <Save size={15} />
            <span>Simpan</span>
          </button>
        </div>
      </div>

      {/* Cross-Cycle Comparison Card (if previous cycle exists) */}
      {draft.aiFeedback?.perbandinganAntarSiklus && (
        <CycleComparisonCard
          comparison={draft.aiFeedback.perbandinganAntarSiklus}
          currentCycle={draft.siklus}
        />
      )}

      {/* Evidence Panel (6 Kategori Bukti Data - Dokumen Halaman 4 Bagian 5) */}
      {showEvidencePanel && (
        <div className="bg-slate-50/80 rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Bukti Data Multi-Sumber (6 Kategori Sesuai Dokumen Acuan)
              </h4>
              <p className="text-xs text-slate-500">
                Data bersifat sukarela. AI menggunakan bukti autentik ini dan tidak mengarang fakta.
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
              Tahap 1, 3, 4, 5
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* 1. Hasil Belajar Murid */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
              <label className="font-bold text-slate-800 block">
                1. Hasil Belajar Murid (Tahap 1, 4)
              </label>
              <p className="text-[11px] text-slate-500">
                Nilai asesmen formatif/sumatif, % ketuntasan, hasil produk (infografis).
              </p>
              <textarea
                value={draft.buktiData?.hasilBelajar || ""}
                onChange={(e) => handleBuktiChange("hasilBelajar", e.target.value)}
                rows={2}
                placeholder="Contoh: Formatif 1: 22 dari 32 murid tuntas (68.75%), draf infografis terkumpul 26..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* 2. Keterlibatan Murid */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
              <label className="font-bold text-slate-800 block">
                2. Keterlibatan Murid (Tahap 1, 3, 4)
              </label>
              <p className="text-[11px] text-slate-500">
                Catatan observasi kelas, partisipasi gim/layar, umpan balik & refleksi murid.
              </p>
              <textarea
                value={draft.buktiData?.keterlibatanMurid || ""}
                onChange={(e) => handleBuktiChange("keterlibatanMurid", e.target.value)}
                rows={2}
                placeholder="Contoh: Partisipasi menjawab gim Papan Interaktif mencapai 92%, keaktifan tanya jawab..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* 3. Praktik Guru */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
              <label className="font-bold text-slate-800 block">
                3. Praktik Guru (Tahap 1, 3, 4)
              </label>
              <p className="text-[11px] text-slate-500">
                Catatan mengajar, hasil supervisi atau peer observation, efisiensi transisi.
              </p>
              <textarea
                value={draft.buktiData?.praktikGuru || ""}
                onChange={(e) => handleBuktiChange("praktikGuru", e.target.value)}
                rows={2}
                placeholder="Contoh: Peer observation bersama rekan MGMP: waktu transisi dipangkas jadi 4 menit..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* 4. Keterlibatan Orang Tua */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
              <label className="font-bold text-slate-800 block">
                4. Keterlibatan Orang Tua (Tahap 3, 4)
              </label>
              <p className="text-[11px] text-slate-500">
                Jumlah dan kualitas dokumentasi bersama orang tua, kendala yang muncul.
              </p>
              <textarea
                value={draft.buktiData?.keterlibatanOrangTua || ""}
                onChange={(e) => handleBuktiChange("keterlibatanOrangTua", e.target.value)}
                rows={2}
                placeholder="Contoh: 30 dari 32 orang tua menandatangani konfirmasi tugas rumah di Google Classroom..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* 5. Proses Digital */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
              <label className="font-bold text-slate-800 block">
                5. Proses Digital (Tahap 3, 4)
              </label>
              <p className="text-[11px] text-slate-500">
                Tangkapan layar Google Classroom, jejak umpan balik, log Papan Interaktif.
              </p>
              <textarea
                value={draft.buktiData?.prosesDigital || ""}
                onChange={(e) => handleBuktiChange("prosesDigital", e.target.value)}
                rows={2}
                placeholder="Contoh: Log Classroom: 100% murid mengunduh modul sebelum jam pelajaran, 32 berkas..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* 6. Umpan Balik Sejawat */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
              <label className="font-bold text-slate-800 block">
                6. Umpan Balik Sejawat (Tahap 1, 4, 5)
              </label>
              <p className="text-[11px] text-slate-500">
                Masukan KKG/MGMP, rekan guru kejuruan, atau kepala sekolah.
              </p>
              <textarea
                value={draft.buktiData?.umpanBalikSejawat || ""}
                onChange={(e) => handleBuktiChange("umpanBalikSejawat", e.target.value)}
                rows={2}
                placeholder="Contoh: Masukan guru DKV: format infografis sebaiknya dipadukan dengan modul desain..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </div>
      )}

      {/* Form Section: Data Identitas & Kuantitatif Murid */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900">
              Identitas Siklus & Rekap Data Kuantitatif Murid
            </h3>
            <p className="text-xs text-slate-500">
              Konteks: {profile.sekolah} · {profile.mapel} ({profile.faseKelas})
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200 self-start sm:self-auto">
            Siklus {draft.siklus} · Minggu ke-{draft.mingguKe}
          </span>
        </div>

        {/* Identitas Input */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Elemen / Materi TP:
            </label>
            <input
              type="text"
              value={draft.elemenTP}
              onChange={(e) => handleChange("elemenTP", e.target.value)}
              placeholder="Contoh: Berpikir Komputasional - Logika Percabangan"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Periode Siklus / Tanggal:
            </label>
            <input
              type="text"
              value={draft.periode}
              onChange={(e) => handleChange("periode", e.target.value)}
              placeholder="Contoh: 25 - 29 Agustus 2026"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Rekan Kolaborasi / MGMP:
            </label>
            <input
              type="text"
              value={draft.rekan}
              onChange={(e) => handleChange("rekan", e.target.value)}
              placeholder="Contoh: MGMP Informatika & Guru DKV"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Kuantitatif Data Grid (Gunakan istilah Murid) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              Jumlah Murid
            </label>
            <input
              type="number"
              value={draft.jumlahSiswa}
              onChange={(e) => handleChange("jumlahSiswa", Number(e.target.value))}
              className="w-full font-bold text-base text-slate-900 bg-white px-2 py-1 border border-slate-200 rounded-lg text-center"
            />
            <span className="text-[10px] text-slate-400 block text-center mt-1">Orang murid</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              Batas KKTP
            </label>
            <input
              type="number"
              value={draft.kktp}
              onChange={(e) => handleChange("kktp", Number(e.target.value))}
              className="w-full font-bold text-base text-rose-600 bg-white px-2 py-1 border border-slate-200 rounded-lg text-center"
            />
            <span className="text-[10px] text-slate-400 block text-center mt-1">Standar minimal</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              Rata-rata Nilai (NA)
            </label>
            <input
              type="number"
              step="0.1"
              value={draft.rataNA}
              onChange={(e) => handleChange("rataNA", Number(e.target.value))}
              className="w-full font-bold text-base text-indigo-600 bg-white px-2 py-1 border border-slate-200 rounded-lg text-center"
            />
            <span className="text-[10px] text-slate-400 block text-center mt-1">Skala 100</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              % Ketuntasan
            </label>
            <input
              type="number"
              step="0.1"
              value={draft.persenTuntas}
              onChange={(e) => handleChange("persenTuntas", Number(e.target.value))}
              className="w-full font-bold text-base text-emerald-600 bg-white px-2 py-1 border border-slate-200 rounded-lg text-center"
            />
            <span className="text-[10px] text-slate-400 block text-center mt-1">Tuntas KKTP</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 col-span-2 sm:col-span-1">
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              % Partisipasi Kelas
            </label>
            <input
              type="number"
              value={draft.keterlibatanRate}
              onChange={(e) => handleChange("keterlibatanRate", Number(e.target.value))}
              className="w-full font-bold text-base text-amber-600 bg-white px-2 py-1 border border-slate-200 rounded-lg text-center"
            />
            <span className="text-[10px] text-slate-400 block text-center mt-1">Keaktifan murid</span>
          </div>
        </div>

        {/* Soal Sukar / Miskonsepsi */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Soal Formatif Kategori Sukar / Miskonsepsi Utama yang Ditemukan:
          </label>
          <input
            type="text"
            value={draft.soalSukar}
            onChange={(e) => handleChange("soalSukar", e.target.value)}
            placeholder="Contoh: Soal 3 (Pola Kondisi Majemuk AND/OR pada Skema Warna)"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* 2. Lima Tahap Siklus TET & Inkuiri Kolaboratif (Tabbed Navigation) */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Tab Header for 5 Stages */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex overflow-x-auto gap-1.5 no-scrollbar">
          {TET_STAGES.map((st) => (
            <button
              key={st.nomor}
              onClick={() => setActiveTabTahap(st.nomor)}
              type="button"
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeTabTahap === st.nomor
                  ? "bg-white text-indigo-700 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  activeTabTahap === st.nomor
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {st.nomor}
              </span>
              <span>
                {st.tahapTET} ({st.tahapInkuiri})
              </span>
              {draft[st.key] && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Body for Active Stage */}
        {TET_STAGES.filter((st) => st.nomor === activeTabTahap).map((st) => (
          <div key={st.nomor} className="p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${st.badgeColor}`}>
                    Tahap {st.nomor} · {st.tahapTET} ({st.tahapInkuiri})
                  </span>
                  <span className="text-xs text-slate-500">
                    Fokus: {st.tujuan}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-700 mt-1">
                  Keluaran Tahap: <span className="text-indigo-600 font-bold">{st.keluaran}</span>
                </p>
              </div>
            </div>

            {/* Pertanyaan Pemandu Dokumen Acuan */}
            <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100/80 space-y-2">
              <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block">
                Pertanyaan Pemandu Fasilitator (Pilih yang relevan):
              </span>
              <ul className="space-y-1 text-xs text-indigo-950/80 list-disc list-inside">
                {st.pertanyaanPemandu.map((q, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            {/* Narasi Catatan Guru */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                Catatan Refleksi Guru untuk {st.tahapTET} ({st.tahapInkuiri}):
              </label>
              <textarea
                value={draft[st.key] || ""}
                onChange={(e) => handleChange(st.key, e.target.value)}
                rows={6}
                placeholder={st.placeholder}
                className="w-full text-xs sm:text-sm p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition leading-relaxed text-slate-800"
              />
            </div>

            {/* Khusus Tahap 4: Tambahan Kolom Rencana Perubahan Siklus Berikutnya */}
            {st.nomor === 4 && (
              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-3">
                <span className="font-bold text-xs text-emerald-900 uppercase tracking-wide block">
                  Iterasi Siklus Lanjutan (TET):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-emerald-950 block mb-1">
                      Perubahan spesifik yang akan dicoba pada siklus berikutnya:
                    </label>
                    <textarea
                      value={draft.rencanaPerubahanBerikutnya || ""}
                      onChange={(e) => handleChange("rencanaPerubahanBerikutnya", e.target.value)}
                      rows={2}
                      placeholder="Contoh: Menambahkan visualisasi pohon keputusan (decision tree) dan tugas bertingkat..."
                      className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-emerald-950 block mb-1">
                      Indikator apa yang akan dipantau:
                    </label>
                    <textarea
                      value={draft.indikatorPemantauan || ""}
                      onChange={(e) => handleChange("indikatorPemantauan", e.target.value)}
                      rows={2}
                      placeholder="Contoh: Ketuntasan kelompok bimbingan >80% dan durasi pengerjaan mandiri..."
                      className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Navigation between stages */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                disabled={activeTabTahap === 1}
                onClick={() => setActiveTabTahap((prev) => Math.max(1, prev - 1))}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 transition cursor-pointer"
              >
                ← Tahap Sebelumnya
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition cursor-pointer"
                >
                  Simpan Draf
                </button>
                {activeTabTahap < 5 ? (
                  <button
                    type="button"
                    onClick={() => setActiveTabTahap((prev) => Math.min(5, prev + 1))}
                    className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <span>Lanjut Tahap {activeTabTahap + 1}</span>
                    <ArrowRight size={13} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAnalyzeWithAi}
                    className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles size={13} />
                    <span>Selesaikan & Analisis AI</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Evaluasi Mandiri Guru (Skala Rubrik 1 - 4) */}
      <SelfRubricInput
        scores={draft.selfRubricScores}
        onChange={handleSelfScoresChange}
      />

      {/* Action Bar: Trigger AI Analysis & Reports */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-0.5">
          <h4 className="font-heading font-bold text-sm text-slate-900">
            Sintesis Refleksi & Validasi Standar Siklus TET
          </h4>
          <p className="text-xs text-slate-500">
            Memvalidasi 5 tahap siklus, memeriksa bukti data, dan menghasilkan laporan format A-H
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onIterateNextCycle && (
            <button
              onClick={handleStartNextIterativeCycle}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs sm:text-sm rounded-xl border border-purple-200 transition cursor-pointer"
              title="Jadikan temuan siklus ini sebagai Tahap 1 siklus berikutnya (Iterasi TET)"
            >
              <GitCompare size={15} />
              <span>Jadikan Bahan Siklus Baru (Iterasi)</span>
            </button>
          )}

          <button
            onClick={handleAnalyzeWithAi}
            disabled={isLoadingAi}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-100 transition cursor-pointer"
          >
            {isLoadingAi ? (
              <Loader2 size={16} className="animate-spin text-white" />
            ) : (
              <Sparkles size={16} className="text-amber-300" />
            )}
            <span>{isLoadingAi ? "Menganalisis Bukti..." : "Analisis Siklus TET (AI)"}</span>
          </button>

          <button
            onClick={() => onViewReport(draft)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition cursor-pointer"
          >
            <BookOpen size={15} />
            <span>Format Laporan A-H</span>
          </button>
        </div>
      </div>

      {/* 4. Tampilan Hasil Analisis AI & Pemeriksa Bukti */}
      {draft.aiFeedback && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Ulasan Fasilitator Inkuiri & Bukti Terstandar
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Rujukan Acuan: <strong className="text-indigo-600">{draft.aiFeedback.acuanStandar}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsStarOpen(true)}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
              >
                <Award size={13} />
                <span>Lihat STAR</span>
              </button>
              <button
                onClick={() => setIsPeerOpen(true)}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition"
              >
                <Users size={13} />
                <span>Format Forum</span>
              </button>
            </div>
          </div>

          {/* Diagnostik Objektif */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-xs text-indigo-900 block mb-1 uppercase tracking-wide">
              Ringkasan Diagnostik Fasilitator:
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {draft.aiFeedback.ringkasanDiagnostik}
            </p>
          </div>

          {/* Pemeriksa Bukti (Evidence Checker - Dokumen Halaman 4 Bagian 6) */}
          {draft.aiFeedback.periksaBukti && draft.aiFeedback.periksaBukti.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <AlertCircle size={16} className="text-amber-600" />
                <span>Pemeriksa Bukti: Catatan Pernyataan yang Memerlukan Data Tambahan</span>
              </div>
              <div className="space-y-2">
                {draft.aiFeedback.periksaBukti.map((pb, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white/90 rounded-xl border border-amber-200 text-xs text-slate-800 space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-amber-100 text-amber-800 border border-amber-300">
                        [Perlu Bukti]
                      </span>
                      <span className="font-semibold text-slate-900">{pb.klaim}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 pl-1">
                      💡 <strong>Saran Data:</strong> {pb.saranData} ({pb.kategori})
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rekomendasi Utama */}
          {draft.aiFeedback.rekomendasi_utama && (
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
              <span className="font-bold text-xs text-indigo-900 uppercase tracking-wide block">
                Rekomendasi Tindak Lanjut Terstruktur:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-800 list-disc list-inside">
                {draft.aiFeedback.rekomendasi_utama.map((rec, i) => (
                  <li key={i} className="leading-relaxed">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Floating Modals */}
      <AiFacilitatorChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        profile={profile}
        currentDraft={draft}
        onApplyUpdates={(updates) => setDraft((prev) => ({ ...prev, ...updates }))}
      />

      <StarExportModal
        isOpen={isStarOpen}
        onClose={() => setIsStarOpen(false)}
        starData={draft.aiFeedback?.praktikBaikSTAR}
        profile={profile}
        siklus={draft.siklus}
      />

      <PeerModeModal
        isOpen={isPeerOpen}
        onClose={() => setIsPeerOpen(false)}
        modeSejawatData={draft.aiFeedback?.modeSejawat}
        profile={profile}
        siklus={draft.siklus}
        onSaveFeedbackNote={(note) => handleBuktiChange("umpanBalikSejawat", note)}
      />

      {/* Saved Toast */}
      {isSavedAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>Refleksi siklus berhasil disimpan!</span>
        </div>
      )}
    </div>
  );
};
