import React, { useState } from "react";
import {
  Sparkles,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Award,
  Users,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  GitCompare,
  FileSpreadsheet,
  Check,
  ChevronRight,
  Zap,
  HelpCircle,
  MessageSquare,
  BarChart2,
  Layers,
  GraduationCap,
} from "lucide-react";
import {
  ReflectionEntry,
  TeacherProfile,
  SelfRubricScores,
  AiFeedback,
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

// 4 Langkah Utama Inkuiri Kolaboratif & Proses Belajar (Sederhana & Mudah Dipahami Guru)
const INQUIRY_STEPS = [
  {
    step: 1,
    key: "assess" as const,
    title: "1. Masalah & Kebutuhan Belajar",
    sub: "Identifikasi kesulitan murid & temuan awal bersama rekan",
    badge: "Assess",
    color: "rose",
    quickChips: [
      "Murid cepat jenuh pada materi abstrak",
      "10 dari 32 murid belum mencapai KKTP",
      "Perbedaan kecepatan belajar murid cukup tinggi",
      "Murid pasif di 20 menit pertama",
      "Miskonsepsi logika dasar percabangan",
      "Butuh media visual interaktif kontekstual",
    ],
    placeholder:
      "Tuliskan ringkas: Apa kesulitan belajar yang dihadapi murid di kelas? Apa pola masalah yang Anda amati bersama rekan sejawat?",
  },
  {
    step: 2,
    key: "design" as const,
    title: "2. Rencana Eksperimen Kolaboratif",
    sub: "Strategi inovasi pembelajaran yang dirancang bersama rekan",
    badge: "Design",
    color: "indigo",
    quickChips: [
      "Tutor Sebaya & Diskusi Kelompok Kecil",
      "Gim Kuis di Papan Interaktif Digital",
      "Simulasi Kartu Unplugged (Praktik Nyata)",
      "Scaffolding Lembar Kerja LKPD Bertingkat",
      "Kolaborasi Pembelajaran Berbasis Masalah (PBL)",
      "Penugasan Aplikatif Bersama Orang Tua",
    ],
    placeholder:
      "Tuliskan ringkas: Strategi atau inovasi apa yang Anda dan rekan MGMP/guru rancang untuk mengatasi kesulitan belajar tersebut?",
  },
  {
    step: 3,
    key: "implement" as const,
    title: "3. Proses Pembelajaran di Kelas",
    sub: "Dinamika kelas saat strategi dijalankan & keterlibatan murid",
    badge: "Implement",
    color: "amber",
    quickChips: [
      "Antusiasme murid tinggi saat mencoba media",
      "Partisipasi keaktifan kelas mencapai 85%",
      "Kelompok lambat terbantu oleh tutor sebaya",
      "Waktu transisi aktivitas berhasil dipangkas",
      "Beberapa murid masih butuh bimbingan guru",
      "Suasana kelas hidup dan saling bantu (gotong royong)",
    ],
    placeholder:
      "Tuliskan ringkas: Bagaimana jalannya proses interaksi di kelas? Bagaimana respon dan keaktifan murid saat mencoba strategi ini?",
  },
  {
    step: 4,
    key: "measure" as const,
    title: "4. Refleksi & Rencana Siklus Baru",
    sub: "Hasil capaian, pembelajaran berharga, & perbaikan berikutnya",
    badge: "Reflect & Change",
    color: "emerald",
    quickChips: [
      "Ketuntasan murid meningkat nyata dibanding siklus lalu",
      "Tutor sebaya terbukti sangat efektif",
      "Perlu lembar panduan peran yang lebih visual",
      "Rencana: menambah visualisasi pohon keputusan",
      "Rencana: penugasan bertingkat untuk pengayaan",
      "Praktik baik siap dibagikan ke MGMP",
    ],
    placeholder:
      "Tuliskan ringkas: Apa yang terbukti berhasil dan apa yang perlu diubah bersama rekan pada siklus/pertemuan berikutnya?",
  },
];

// Opsi Bukti Pembelajaran yang Bisa Dicentang Cepat
const EVIDENCE_OPTIONS = [
  { id: "hasilBelajar", label: "Nilai / Kuis Asesmen Murid" },
  { id: "keterlibatanMurid", label: "Catatan Observasi Keaktifan Kelas" },
  { id: "prosesDigital", label: "Jejak Google Classroom / Media Digital" },
  { id: "umpanBalikSejawat", label: "Diskusi & Masukan Rekan MGMP" },
  { id: "praktikGuru", label: "Catatan Jurnal Mengajar Guru" },
  { id: "keterlibatanOrangTua", label: "Konfirmasi / Kolaborasi Orang Tua" },
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
      elemenTP: "Berpikir Komputasional: Pengenalan Pola & Logika Percabangan",
      rekan: "MGMP Informatika SMK",
      jumlahSiswa: 32,
      rataNA: 78.2,
      kktp: 75,
      persenTuntas: 81.25,
      keterlibatanRate: 84,
      soalSukar: "Soal Logika Percabangan Kondisi Majemuk",
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
        penguasaanMateri: 3,
        diferensiasi: 3,
        interaktivitas: 3,
        asesmenData: 3,
        tindakLanjut: 3,
      },
      aiFeedback: null,
      status: "draft",
    };
  });

  const [activeStep, setActiveStep] = useState<number>(1);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [isSavedAlert, setIsSavedAlert] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isStarOpen, setIsStarOpen] = useState<boolean>(false);
  const [isPeerOpen, setIsPeerOpen] = useState<boolean>(false);
  const [showEvidenceChecklist, setShowEvidenceChecklist] = useState<boolean>(false);

  // Checklist state for available evidence
  const [checkedEvidence, setCheckedEvidence] = useState<Record<string, boolean>>(() => ({
    hasilBelajar: true,
    keterlibatanMurid: true,
    prosesDigital: true,
    umpanBalikSejawat: true,
    praktikGuru: false,
    keterlibatanOrangTua: false,
  }));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleChange = (field: keyof ReflectionEntry, value: any) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleBuktiTextChange = (text: string) => {
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
        hasilBelajar: text,
      },
    }));
  };

  // Add quick chip phrase to current step's text
  const handleAddChip = (stepKey: "assess" | "design" | "implement" | "measure", chipText: string) => {
    const current = draft[stepKey] || "";
    if (current.includes(chipText)) return;
    const separator = current.trim() ? (current.trim().endsWith(".") ? " " : ". ") : "";
    const updated = current + separator + chipText + ".";
    handleChange(stepKey, updated);
    showToast(`✓ Ide "${chipText}" disisipkan!`);
  };

  // Quick fill with exemplary collaborative inquiry example
  const handleUseExample = () => {
    setDraft((prev) => ({
      ...prev,
      elemenTP: "Berpikir Komputasional: Pengenalan Pola & Algoritma Logika Percabangan",
      rekan: "MGMP Informatika & Guru Produktif DKV",
      jumlahSiswa: 32,
      rataNA: 78.5,
      kktp: 75,
      persenTuntas: 81.25,
      keterlibatanRate: 85,
      soalSukar: "Studi kasus percabangan kondisi logika majemuk (AND/OR)",
      assess:
        "Pada siklus sebelumnya, 10 dari 32 murid (31.25%) belum tuntas karena cepat jenuh dengan konsep logika abstrak. Hasil observasi dan diskusi awal bersama rekan MGMP menunjukkan perlunya media visual interaktif.",
      design:
        "Bersama rekan MGMP merancang model 'Huyula Digital': simulasi kartu alur logika, gim kuis beregu di Papan Interaktif Digital, dan tutor sebaya. Target: ketuntasan murid mencapai minimal 80% dan partisipasi aktif kelas >80%.",
      implement:
        "Pembelajaran berlangsung sangat hidup. Keterlibatan murid mencapai 85% saat berebut menjawab di layar Papan Interaktif. Murid yang lebih mahir sigap menjadi tutor sebaya bagi rekannya yang kesulitan.",
      measure:
        "Ketuntasan murid meningkat menjadi 81.25% (naik signifikan). Kunci keberhasilan: tutor sebaya dan visualisasi interaktif. Rencana perbaikan siklus berikutnya: menyediakan lembar panduan peran yang lebih rinci dan tugas bertingkat.",
      rencanaPerubahanBerikutnya:
        "Menambahkan visualisasi decision tree bertingkat dan lembar kerja scaffolding untuk murid yang membutuhkan pendampingan khusus.",
      indikatorPemantauan:
        "Ketuntasan seluruh kelompok mencapai >85% dan durasi pengerjaan mandiri murid berjalan lancar tanpa hambatan teknis.",
      share:
        "Membagikan alur aktivitas Papan Interaktif Digital dan lembar tutor sebaya pada forum MGMP Informatika dan diadaptasi oleh rekan guru kejuruan.",
      selfRubricScores: {
        penguasaanMateri: 3.5,
        diferensiasi: 3.3,
        interaktivitas: 3.8,
        asesmenData: 3.5,
        tindakLanjut: 3.5,
      },
    }));
    showToast("✨ Contoh praktik baik inkuiri kolaboratif berhasil dimuat!");
  };

  const handleSaveDraft = () => {
    const updated = {
      ...draft,
      savedAt: new Date().toISOString(),
    };
    onSave(updated);
    setIsSavedAlert(true);
    showToast("💾 Refleksi pembelajaran berhasil disimpan!");
    setTimeout(() => setIsSavedAlert(false), 2500);
  };

  // Run AI In-Depth Analysis
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

      const updated: ReflectionEntry = {
        ...draft,
        aiFeedback: analysisData,
        status: "final",
        savedAt: new Date().toISOString(),
      };

      setDraft(updated);
      onSave(updated);
      showToast("🎉 Analisis inkuiri AI selesai dan laporan telah diperbarui!");
    } catch (err) {
      console.error(err);
      showToast("Terjadi kendala saat menganalisis. Coba lagi.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  const currentStepData = INQUIRY_STEPS.find((s) => s.step === activeStep) || INQUIRY_STEPS[0];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Ringkas Siklus (Ramah Guru & Mobile-First) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              S{draft.siklus}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-base sm:text-lg text-slate-900 leading-tight">
                  Siklus Inkuiri ke-{draft.siklus}
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Minggu ke-{draft.mingguKe}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500">
                {profile.sekolah} · {profile.mapel}
              </p>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleUseExample}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition cursor-pointer"
              title="Isi form dengan contoh praktik baik inkuiri"
            >
              <Zap size={14} className="text-amber-600" />
              <span>Contoh Cepat</span>
            </button>

            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition cursor-pointer"
            >
              <Sparkles size={14} className="text-indigo-600" />
              <span>Tanya Fasilitator AI</span>
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition cursor-pointer"
            >
              <Save size={14} />
              <span className="hidden sm:inline">Simpan Draf</span>
            </button>
          </div>
        </div>

        {/* Info Pembelajaran Singkat */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Materi / Tujuan Pembelajaran (TP):
            </label>
            <input
              type="text"
              value={draft.elemenTP}
              onChange={(e) => handleChange("elemenTP", e.target.value)}
              placeholder="Contoh: Logika Percabangan dalam Desain Visual"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Rekan Kolaborasi Inkuiri / MGMP:
            </label>
            <input
              type="text"
              value={draft.rekan}
              onChange={(e) => handleChange("rekan", e.target.value)}
              placeholder="Contoh: MGMP Informatika & Guru Kejuruan"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Periode Pembelajaran:
            </label>
            <input
              type="text"
              value={draft.periode}
              onChange={(e) => handleChange("periode", e.target.value)}
              placeholder="Contoh: 25 - 29 Agustus 2026"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition"
            />
          </div>
        </div>
      </div>

      {/* 2. Data Capaian Pembelajaran Ringkas (Hanya 3 Angka Utama Saja) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 size={16} className="text-indigo-600" />
            <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
              Data Capaian Murid di Kelas (Sederhana & Mudah)
            </h3>
          </div>
          <span className="text-[10px] font-medium text-slate-500 hidden sm:inline">
            Cukup masukkan 3 angka utama hasil pembelajaran
          </span>
        </div>

        {/* 3 Touch-Friendly Numerical Cards for HP */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {/* 1. Jumlah Murid */}
          <div className="bg-slate-50/80 p-2.5 sm:p-3.5 rounded-2xl border border-slate-200/90 text-center">
            <label className="text-[10px] sm:text-xs font-semibold text-slate-600 block mb-1">
              👥 Jumlah Murid
            </label>
            <input
              type="number"
              value={draft.jumlahSiswa || 32}
              onChange={(e) => handleChange("jumlahSiswa", Number(e.target.value))}
              className="w-full font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-200 rounded-xl py-1 text-center focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Orang murid</span>
          </div>

          {/* 2. % Ketuntasan Murid */}
          <div className="bg-emerald-50/50 p-2.5 sm:p-3.5 rounded-2xl border border-emerald-200/80 text-center">
            <label className="text-[10px] sm:text-xs font-semibold text-emerald-900 block mb-1">
              🎯 % Murid Tuntas
            </label>
            <input
              type="number"
              step="0.1"
              value={draft.persenTuntas || 75}
              onChange={(e) => handleChange("persenTuntas", Number(e.target.value))}
              className="w-full font-bold text-base sm:text-lg text-emerald-700 bg-white border border-emerald-300 rounded-xl py-1 text-center focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
            <span className="text-[10px] text-emerald-600 block mt-1">Capaian KKTP</span>
          </div>

          {/* 3. % Keaktifan di Kelas */}
          <div className="bg-amber-50/50 p-2.5 sm:p-3.5 rounded-2xl border border-amber-200/80 text-center">
            <label className="text-[10px] sm:text-xs font-semibold text-amber-900 block mb-1">
              ⚡ % Keaktifan
            </label>
            <input
              type="number"
              value={draft.keterlibatanRate || 80}
              onChange={(e) => handleChange("keterlibatanRate", Number(e.target.value))}
              className="w-full font-bold text-base sm:text-lg text-amber-700 bg-white border border-amber-300 rounded-xl py-1 text-center focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
            <span className="text-[10px] text-amber-600 block mt-1">Partisipasi aktif</span>
          </div>
        </div>

        {/* Bagian Materi / Soal yang Masih Sulit bagi Murid */}
        <div>
          <label className="text-[11px] sm:text-xs font-semibold text-slate-700 block mb-1">
            Bagian materi yang masih sukar dipahami murid / miskonsepsi utama:
          </label>
          <input
            type="text"
            value={draft.soalSukar || ""}
            onChange={(e) => handleChange("soalSukar", e.target.value)}
            placeholder="Contoh: Logika kondisi percabangan majemuk saat membuat skema warna"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>
      </div>

      {/* 3. Inti Refleksi: 4 Langkah Proses Pembelajaran & Inkuiri Kolaboratif */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Step Navigation Tabs (Mudah disentuh di HP) */}
        <div className="p-1.5 sm:p-2 bg-slate-100 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2">
          {INQUIRY_STEPS.map((step) => {
            const isCurrent = activeStep === step.step;
            const hasContent = Boolean(draft[step.key]?.trim());

            return (
              <button
                key={step.step}
                type="button"
                onClick={() => setActiveStep(step.step)}
                className={`min-h-[46px] p-2 rounded-xl text-left transition flex items-center justify-between cursor-pointer ${
                  isCurrent
                    ? "bg-white text-indigo-700 shadow-xs border border-indigo-200 font-bold"
                    : "text-slate-600 hover:bg-white/60"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isCurrent
                        ? "bg-indigo-600 text-white"
                        : hasContent
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {hasContent && !isCurrent ? "✓" : step.step}
                  </span>
                  <div className="truncate">
                    <p className="text-xs truncate font-bold leading-tight">
                      {step.title.split(". ")[1]}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate hidden sm:block">
                      {step.badge}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Content */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Langkah {currentStepData.step} dari 4 · {currentStepData.badge}
                </span>
              </div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 mt-1">
                {currentStepData.title}
              </h3>
              <p className="text-xs text-slate-500">{currentStepData.sub}</p>
            </div>
          </div>

          {/* Quick Tap Chips for Teachers on Mobile: Tap to Add Idea Instantly! */}
          <div className="bg-indigo-50/40 p-3 sm:p-4 rounded-2xl border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wide flex items-center gap-1.5">
                <Zap size={13} className="text-amber-500" />
                <span>Pilihan Ide Cepat (Ketuk untuk menyisipkan):</span>
              </span>
              <span className="text-[10px] text-indigo-600 hidden sm:inline">
                Memudahkan guru tanpa mengetik panjang
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {currentStepData.quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddChip(currentStepData.key, chip)}
                  className="text-xs bg-white hover:bg-indigo-50 text-indigo-950 border border-indigo-200/80 px-2.5 py-1.5 rounded-xl font-medium transition cursor-pointer hover:border-indigo-400 active:scale-95 shadow-2xs flex items-center gap-1"
                >
                  <span className="text-indigo-400 text-xs">+</span>
                  <span>{chip}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Area for Teacher's Narrative */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                Catatan Proses Guru & Kolaborasi Sejawat:
              </label>
              <span className="text-[11px] text-slate-400">
                {draft[currentStepData.key]?.length || 0} karakter
              </span>
            </div>
            <textarea
              value={draft[currentStepData.key] || ""}
              onChange={(e) => handleChange(currentStepData.key, e.target.value)}
              rows={5}
              placeholder={currentStepData.placeholder}
              className="w-full text-xs sm:text-sm p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition leading-relaxed text-slate-800"
            />
          </div>

          {/* Step 4 Special: Rencana Perubahan Siklus Berikutnya */}
          {activeStep === 4 && (
            <div className="bg-emerald-50/60 p-3.5 sm:p-4 rounded-2xl border border-emerald-200 space-y-2">
              <span className="font-bold text-xs text-emerald-950 uppercase tracking-wide block">
                🔄 Rencana Perubahan untuk Siklus Berikutnya (Inkuiri Berkelanjutan):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div>
                  <label className="font-semibold text-emerald-900 block mb-1">
                    Apa perubahan spesifik yang akan dicoba?
                  </label>
                  <input
                    type="text"
                    value={draft.rencanaPerubahanBerikutnya || ""}
                    onChange={(e) => handleChange("rencanaPerubahanBerikutnya", e.target.value)}
                    placeholder="Contoh: Menggunakan modul kartu alur bertingkat"
                    className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-emerald-900 block mb-1">
                    Indikator keberhasilan yang dipantau:
                  </label>
                  <input
                    type="text"
                    value={draft.indikatorPemantauan || ""}
                    onChange={(e) => handleChange("indikatorPemantauan", e.target.value)}
                    placeholder="Contoh: Ketuntasan murid mencapai >85%"
                    className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl focus:outline-none text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              disabled={activeStep === 1}
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 disabled:opacity-30 transition cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Kembali</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition cursor-pointer"
              >
                Simpan
              </button>

              {activeStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => Math.min(4, prev + 1))}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-xs cursor-pointer"
                >
                  <span>Lanjut Langkah {activeStep + 1}</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAnalyzeWithAi}
                  disabled={isLoadingAi}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-xs cursor-pointer"
                >
                  {isLoadingAi ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  <span>{isLoadingAi ? "Menganalisis..." : "Selesai & Analisis AI"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bukti Data Pembelajaran Praktis (Checklist Mudah di HP - Bukan Form Panjang Menakutkan) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
        <div
          onClick={() => setShowEvidenceChecklist(!showEvidenceChecklist)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={16} className="text-indigo-600" />
            <div>
              <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                Bukti Nyata Pembelajaran yang Tersedia
              </h3>
              <p className="text-[11px] text-slate-500">
                Centang bukti yang Anda miliki (tidak perlu upload berkas berat di HP)
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-600 px-2 py-1 bg-indigo-50 rounded-xl">
            {showEvidenceChecklist ? "Tutup ▲" : "Lihat / Ubah ▼"}
          </span>
        </div>

        {/* Evidence Checklist Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
          {EVIDENCE_OPTIONS.map((opt) => {
            const isChecked = checkedEvidence[opt.id] ?? false;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() =>
                  setCheckedEvidence((prev) => ({
                    ...prev,
                    [opt.id]: !prev[opt.id],
                  }))
                }
                className={`p-2.5 rounded-xl border text-left text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
                  isChecked
                    ? "bg-indigo-50/80 border-indigo-300 text-indigo-900 font-semibold"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border transition ${
                    isChecked
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-white border-slate-300"
                  }`}
                >
                  {isChecked && <Check size={12} strokeWidth={3} />}
                </div>
                <span className="truncate text-[11px] sm:text-xs">{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Satu Kolom Catatan Ringkas Bukti Data */}
        <div className="pt-1">
          <label className="text-[11px] sm:text-xs font-semibold text-slate-700 block mb-1">
            Catatan Ringkas Bukti Data (Nilai, Hasil Karya Murid, atau Masukan Sejawat):
          </label>
          <input
            type="text"
            value={draft.buktiData?.hasilBelajar || ""}
            onChange={(e) => handleBuktiTextChange(e.target.value)}
            placeholder="Contoh: Formatif 1: 26 dari 32 murid tuntas (81.25%), foto keaktifan Papan Interaktif tersimpan"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>
      </div>

      {/* 5. Evaluasi Mandiri Guru (Skala 1 - 4 dengan Segmented Buttons Empuk di HP) */}
      <SelfRubricInput
        scores={draft.selfRubricScores}
        onChange={(newScores) => handleChange("selfRubricScores", newScores)}
      />

      {/* 6. Tombol Aksi Utama & Laporan */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h4 className="font-heading font-bold text-sm text-slate-900">
            Sintesis Refleksi Inkuiri & Laporan Format Tetap (A - H)
          </h4>
          <p className="text-xs text-slate-500">
            Validasi proses pembelajaran berbasis data dan penyusunan laporan mingguan otomatis
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onIterateNextCycle && (
            <button
              type="button"
              onClick={() => onIterateNextCycle(draft)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 transition cursor-pointer"
            >
              <GitCompare size={15} />
              <span>Jadikan Bahan Siklus Baru</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleAnalyzeWithAi}
            disabled={isLoadingAi}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-100 transition cursor-pointer"
          >
            {isLoadingAi ? (
              <Loader2 size={16} className="animate-spin text-white" />
            ) : (
              <Sparkles size={16} className="text-amber-300" />
            )}
            <span>{isLoadingAi ? "Menganalisis Data..." : "Analisis Inkuiri (AI)"}</span>
          </button>

          <button
            type="button"
            onClick={() => onViewReport(draft)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
          >
            <BookOpen size={15} />
            <span>Format Laporan A-H</span>
          </button>
        </div>
      </div>

      {/* 7. Hasil Ulasan Fasilitator Inkuiri AI (Jika Sudah Dianalisis) */}
      {draft.aiFeedback && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Ulasan Fasilitator Inkuiri Berbasis Bukti
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Acuan: <strong className="text-indigo-600">{draft.aiFeedback.acuanStandar}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPeerOpen(true)}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition cursor-pointer"
              >
                <Users size={13} />
                <span>Format Sejawat</span>
              </button>
              <button
                type="button"
                onClick={() => setIsStarOpen(true)}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
              >
                <Award size={13} />
                <span>Format STAR</span>
              </button>
            </div>
          </div>

          {/* Ringkasan Diagnostik */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed">
            <span className="font-bold text-indigo-900 block mb-1 uppercase tracking-wide text-xs">
              Ringkasan Diagnostik Fasilitator:
            </span>
            <p>{draft.aiFeedback.ringkasanDiagnostik}</p>
          </div>

          {/* Rekomendasi Utama */}
          {draft.aiFeedback.rekomendasi_utama && draft.aiFeedback.rekomendasi_utama.length > 0 && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1.5">
              <span className="font-bold text-xs text-indigo-900 uppercase tracking-wide block">
                Rekomendasi Tindak Lanjut Inkuiri:
              </span>
              <ul className="space-y-1 text-xs text-slate-800 list-disc list-inside">
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
        onSaveFeedbackNote={(note) => {
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
              umpanBalikSejawat: note,
            },
          }));
          showToast("✓ Masukan rekan sejawat disimpan!");
        }}
      />
    </div>
  );
};
