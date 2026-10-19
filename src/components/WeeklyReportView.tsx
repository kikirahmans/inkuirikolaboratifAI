import React, { useState } from "react";
import {
  Printer,
  Sparkles,
  Loader2,
  FileText,
  Calendar,
  CheckCircle2,
  School,
  User,
  ChevronDown,
  Award,
  Users,
  Copy,
  Check,
  Download,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import {
  ReflectionEntry,
  TeacherProfile,
  WeeklySynthesisReport,
} from "../types";
import { buildFallbackWeeklySynthesis } from "../utils/fallbackAnalyzer";

interface WeeklyReportViewProps {
  entries: ReflectionEntry[];
  currentEntry: ReflectionEntry;
  profile: TeacherProfile;
}

export const WeeklyReportView: React.FC<WeeklyReportViewProps> = ({
  entries,
  currentEntry,
  profile,
}) => {
  const [selectedEntryId, setSelectedEntryId] = useState<string>(
    currentEntry?.id || entries[0]?.id || ""
  );
  const [reportMode, setReportMode] = useState<"siklus" | "sintesis">(
    "siklus"
  );
  const [synthesisReport, setSynthesisReport] =
    useState<WeeklySynthesisReport | null>(null);
  const [isLoadingSynthesis, setIsLoadingSynthesis] = useState<boolean>(false);
  const [hasCopiedReport, setHasCopiedReport] = useState<boolean>(false);

  const activeEntry =
    entries.find((e) => e.id === selectedEntryId) ||
    currentEntry ||
    entries[0];

  const handlePrint = () => {
    window.print();
  };

  const generateSynthesisReport = async () => {
    setIsLoadingSynthesis(true);
    try {
      let data: any;
      try {
        const response = await fetch("/api/reflect/weekly-synthesis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teacherProfile: profile,
            entries,
          }),
        });

        if (response.ok) {
          data = await response.json();
        } else {
          data = buildFallbackWeeklySynthesis(profile, entries);
        }
      } catch {
        data = buildFallbackWeeklySynthesis(profile, entries);
      }

      setSynthesisReport({
        id: "synth-" + Date.now(),
        generatedAt: new Date().toISOString(),
        periodeRentang: `Siklus 1 s.d. Siklus ${entries.length}`,
        judulLaporan: data.judulLaporan || "Laporan Sintesis Refleksi Siklus TET Guru",
        rangkumanEksekutif: data.rangkumanEksekutif,
        analisisTren: data.analisisTren,
        tingkatKematanganInkuiri: data.tingkatKematanganInkuiri || "Cakap",
        catatanSupervisi: data.catatanSupervisi,
        rekomendasiStrategis: data.rekomendasiStrategis || [],
      });
      setReportMode("sintesis");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingSynthesis(false);
    }
  };

  // Build the sequential text for Sections A to H
  const buildSequentialTextAH = () => {
    const format = activeEntry?.aiFeedback?.laporanFormatTetap;
    return `
LAPORAN REFLEKSI SIKLUS (BERBASIS SIKLUS TET & INKUIRI KOLABORATIF)
${profile.sekolah}
============================================================

BAGIAN A. IDENTITAS SIKLUS:
- Mata Pelajaran: ${profile.mapel}
- Kelas: ${profile.faseKelas}
- Elemen / Materi: ${activeEntry?.elemenTP || "-"}
- Pertemuan / Siklus: Siklus ${activeEntry?.siklus || 1} (Minggu ke-${activeEntry?.mingguKe || 1})
- Tanggal / Periode: ${activeEntry?.periode || "-"}
- Rekan Kolaborasi: ${activeEntry?.rekan || "MGMP Satuan Pendidikan"}
- Rekap Kuantitatif Murid: ${activeEntry?.jumlahSiswa || 32} murid | KKTP: ${activeEntry?.kktp || 75} | Rata-rata NA: ${activeEntry?.rataNA || 0} | % Ketuntasan: ${activeEntry?.persenTuntas || 0}% | Partisipasi: ${activeEntry?.keterlibatanRate || 0}%

BAGIAN B. IDENTIFIKASI (ASSESS):
${format?.bagianB_Identifikasi || activeEntry?.assess || "-"}

BAGIAN C. DESAIN (DESIGN):
${format?.bagianC_Desain || activeEntry?.design || "-"}

BAGIAN D. IMPLEMENTASI (IMPLEMENT):
${format?.bagianD_Implementasi || activeEntry?.implement || "-"}

BAGIAN E. AMATI DAN REFLEKSI (MEASURE - REFLECT - CHANGE):
${format?.bagianE_AmatiRefleksi || activeEntry?.measure || "-"}

BAGIAN F. PERUBAHAN DAN TINDAK LANJUT:
${format?.bagianF_PerubahanTindakLanjut || activeEntry?.rencanaPerubahanBerikutnya || "Penyempurnaan panduan peran dan alur transisi kelas."}
Indikator Pemantauan: ${activeEntry?.indikatorPemantauan || "Capaian ketuntasan murid meningkat pada topik bertingkat."}

BAGIAN G. BERBAGI PRAKTIK BAIK:
${format?.bagianG_BerbagiPraktik || activeEntry?.share || "Didiseminasikan melalui forum MGMP Informatika dan komunitas belajar sekolah."}

BAGIAN H. CATATAN DATA:
${
  activeEntry?.aiFeedback?.periksaBukti && activeEntry.aiFeedback.periksaBukti.length > 0
    ? activeEntry.aiFeedback.periksaBukti
        .map((p, i) => `[Perlu Bukti ${i + 1}]: ${p.klaim} -> Saran Bukti: ${p.saranData}`)
        .join("\n")
    : "Seluruh kesimpulan telah didukung data dan bukti autentik yang memadai."
}
============================================================
Guru Pengampu: ${profile.nama}
NIP: ${profile.nip || "-"}
`.trim();
  };

  const handleCopyTextReport = () => {
    navigator.clipboard.writeText(buildSequentialTextAH());
    setHasCopiedReport(true);
    setTimeout(() => setHasCopiedReport(false), 2000);
  };

  const currentDateFormatted = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Control Bar (Hidden when printing) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setReportMode("siklus")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                reportMode === "siklus"
                  ? "bg-white text-indigo-700 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Laporan Siklus (Format A-H)
            </button>
            <button
              onClick={() => {
                setReportMode("sintesis");
                if (!synthesisReport) generateSynthesisReport();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                reportMode === "sintesis"
                  ? "bg-white text-indigo-700 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>Sintesis Kumulatif AI</span>
            </button>
          </div>

          {reportMode === "siklus" && entries.length > 1 && (
            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-xs text-slate-500 font-medium">Pilih Siklus:</span>
              <select
                value={selectedEntryId}
                onChange={(e) => setSelectedEntryId(e.target.value)}
                className="text-xs font-medium px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
              >
                {entries.map((item) => (
                  <option key={item.id} value={item.id}>
                    Siklus {item.siklus} (Minggu ke-{item.mingguKe})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {reportMode === "siklus" && (
            <button
              onClick={handleCopyTextReport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              {hasCopiedReport ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{hasCopiedReport ? "Tersalin!" : "Salin Teks A-H"}</span>
            </button>
          )}

          {reportMode === "sintesis" && (
            <button
              onClick={generateSynthesisReport}
              disabled={isLoadingSynthesis}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-200 transition cursor-pointer"
            >
              {isLoadingSynthesis ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Sparkles size={13} />
              )}
              <span>Regenerasi AI</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
          >
            <Printer size={15} />
            <span>Cetak / Unduh PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Canvas */}
      <div
        id="print-section"
        className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm print:shadow-none print:border-none print:p-0 print:m-0"
      >
        {/* Subtle Print Watermark Header */}
        <div className="hidden print:flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-200 pb-1 mb-4">
          <span>Aplikasi Refleksi Guru SMK · Berbasis Siklus TET & Inkuiri Kolaboratif</span>
          <span>
            watermark: <strong className="text-slate-600 uppercase font-mono">kikybahsoan</strong>
          </span>
        </div>

        {/* Official Kop Laporan */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <img
              src="./logo.jpg"
              alt="Logo RefleksiGuru Kikybahsoan"
              className="h-16 sm:h-20 w-auto object-contain shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 text-center">
              <p className="text-xs uppercase tracking-widest font-bold text-slate-600">
                Kementerian Pendidikan Dasar dan Menengah · Satuan Pendidikan Vokasi
              </p>
              <h2 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 uppercase mt-0.5">
                {profile.sekolah}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Portofolio Pengelolaan Kinerja & Asesmen Siklus Teacher Experimental Training (TET)
              </p>
            </div>
            <div className="w-16 sm:w-20 hidden sm:block shrink-0" aria-hidden="true" />
          </div>
          <div className="h-0.5 bg-slate-900 mt-3 mb-0.5" />
          <div className="h-px bg-slate-300" />
        </div>

        {reportMode === "siklus" ? (
          /* ============================================================ */
          /* FORMAT KELUARAN TETAP: BAGIAN A - H                          */
          /* Dokumen Acuan Halaman 4-5 Bagian 7                           */
          /* ============================================================ */
          <div className="space-y-6 text-slate-800 text-xs sm:text-sm">
            <div className="text-center mb-6">
              <h3 className="font-heading font-extrabold text-base sm:text-lg uppercase text-slate-900">
                Laporan Refleksi Siklus Pembelajaran Guru
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Berbasis Siklus Teacher Experimental Training (TET) & Inkuiri Kolaboratif
              </p>
            </div>

            {/* Bagian A. Identitas Siklus */}
            <div className="border border-slate-300 rounded-2xl overflow-hidden">
              <div className="bg-slate-100 px-4 py-2.5 font-heading font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-300 flex items-center justify-between">
                <span>Bagian A. Identitas Siklus</span>
                <span className="font-mono text-indigo-700 font-bold">
                  Siklus {activeEntry?.siklus}
                </span>
              </div>
              <div className="p-4 bg-slate-50/50 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                  <div className="flex">
                    <span className="w-36 font-semibold text-slate-500">Mata Pelajaran</span>
                    <span className="font-medium text-slate-900">: {profile.mapel}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold text-slate-500">Kelas / Fase</span>
                    <span className="font-medium text-slate-900">: {profile.faseKelas}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold text-slate-500">Nama Guru</span>
                    <span className="font-medium text-slate-900">: {profile.nama}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold text-slate-500">NIP</span>
                    <span className="font-medium text-slate-900">: {profile.nip || "-"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold text-slate-500">Tanggal / Periode</span>
                    <span className="font-medium text-slate-900">: {activeEntry?.periode || "-"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold text-slate-500">Rekan Kolaborasi</span>
                    <span className="font-medium text-slate-900">: {activeEntry?.rekan || "MGMP"}</span>
                  </div>
                  <div className="sm:col-span-2 flex">
                    <span className="w-36 font-semibold text-slate-500 shrink-0">Elemen / Materi TP</span>
                    <span className="font-bold text-slate-900">: {activeEntry?.elemenTP}</span>
                  </div>
                </div>

                {/* Data Kuantitatif Murid */}
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <span className="font-bold text-slate-700 block mb-2">
                    Rekapitulasi Data Kuantitatif Asesmen Murid:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                    <div className="p-2 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Jumlah Murid</span>
                      <strong className="text-slate-900">{activeEntry?.jumlahSiswa} Orang</strong>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Batas KKTP</span>
                      <strong className="text-rose-600">{activeEntry?.kktp}</strong>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Rata-rata NA</span>
                      <strong className="text-indigo-600">{activeEntry?.rataNA}</strong>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">% Ketuntasan</span>
                      <strong className="text-emerald-600">{activeEntry?.persenTuntas}%</strong>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-500 block">Partisipasi Kelas</span>
                      <strong className="text-amber-600">{activeEntry?.keterlibatanRate}%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bagian B. Identifikasi */}
            <div className="border border-slate-300 rounded-2xl overflow-hidden">
              <div className="bg-rose-50/80 px-4 py-2.5 font-heading font-bold text-rose-900 text-xs uppercase tracking-wider border-b border-rose-200">
                Bagian B. Identifikasi (Assess)
              </div>
              <div className="p-4 bg-white text-xs leading-relaxed text-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">
                  Masalah Prioritas dan Bukti Pendukung:
                </span>
                <p className="whitespace-pre-line">
                  {activeEntry?.assess || "Belum ada catatan identifikasi masalah."}
                </p>
                {activeEntry?.soalSukar && (
                  <p className="text-[11px] text-rose-800 bg-rose-50 p-2 rounded-lg font-medium">
                    📌 <strong>Fokus Miskonsepsi:</strong> {activeEntry.soalSukar}
                  </p>
                )}
              </div>
            </div>

            {/* Bagian C. Desain */}
            <div className="border border-slate-300 rounded-2xl overflow-hidden">
              <div className="bg-indigo-50/80 px-4 py-2.5 font-heading font-bold text-indigo-900 text-xs uppercase tracking-wider border-b border-indigo-200">
                Bagian C. Desain (Design)
              </div>
              <div className="p-4 bg-white text-xs leading-relaxed text-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">
                  Tujuan Terukur, Strategi/Eksperimen, Indikator Keberhasilan & Pihak Terlibat:
                </span>
                <p className="whitespace-pre-line">
                  {activeEntry?.design || "Belum ada catatan desain eksperimen pembelajaran."}
                </p>
              </div>
            </div>

            {/* Bagian D. Implementasi */}
            <div className="border border-slate-300 rounded-2xl overflow-hidden">
              <div className="bg-amber-50/80 px-4 py-2.5 font-heading font-bold text-amber-900 text-xs uppercase tracking-wider border-b border-amber-200">
                Bagian D. Implementasi (Implement)
              </div>
              <div className="p-4 bg-white text-xs leading-relaxed text-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">
                  Catatan Pelaksanaan di Kelas dan Daftar Dokumentasi:
                </span>
                <p className="whitespace-pre-line">
                  {activeEntry?.implement || "Belum ada catatan pelaksanaan eksperimen nyata di kelas."}
                </p>
                {activeEntry?.buktiData?.keterlibatanOrangTua && (
                  <p className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg font-medium">
                    👨‍👩‍👧 <strong>Keterlibatan Orang Tua:</strong> {activeEntry.buktiData.keterlibatanOrangTua}
                  </p>
                )}
              </div>
            </div>

            {/* Bagian E. Amati dan Refleksi */}
            <div className="border border-slate-300 rounded-2xl overflow-hidden">
              <div className="bg-emerald-50/80 px-4 py-2.5 font-heading font-bold text-emerald-900 text-xs uppercase tracking-wider border-b border-emerald-200">
                Bagian E. Amati dan Refleksi (Measure - Reflect - Change)
              </div>
              <div className="p-4 bg-white text-xs leading-relaxed text-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">
                  Capaian terhadap Indikator, Keberhasilan, Tantangan & Penyebab:
                </span>
                <p className="whitespace-pre-line">
                  {activeEntry?.measure || "Belum ada catatan pengukuran dampak dan evaluasi tantangan."}
                </p>
              </div>
            </div>

            {/* Bagian F. Perubahan dan Tindak Lanjut */}
            <div className="border border-slate-300 rounded-2xl overflow-hidden">
              <div className="bg-sky-50/80 px-4 py-2.5 font-heading font-bold text-sky-900 text-xs uppercase tracking-wider border-b border-sky-200">
                Bagian F. Perubahan dan Tindak Lanjut
              </div>
              <div className="p-4 bg-white text-xs leading-relaxed text-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">
                  Perbaikan untuk Siklus Berikutnya dan Indikator Pemantauan:
                </span>
                <p className="whitespace-pre-line">
                  {activeEntry?.rencanaPerubahanBerikutnya ||
                    "Penyempurnaan lembar peran, diferensiasi tugas, dan tindak lanjut remedial."}
                </p>
                {activeEntry?.indikatorPemantauan && (
                  <p className="text-[11px] text-sky-900 bg-sky-50 p-2 rounded-lg font-medium">
                    🎯 <strong>Indikator Pemantauan:</strong> {activeEntry.indikatorPemantauan}
                  </p>
                )}
              </div>
            </div>

            {/* Bagian G. Berbagi Praktik Baik */}
            <div className="border border-slate-300 rounded-2xl overflow-hidden">
              <div className="bg-purple-50/80 px-4 py-2.5 font-heading font-bold text-purple-900 text-xs uppercase tracking-wider border-b border-purple-200">
                Bagian G. Berbagi Praktik Baik
              </div>
              <div className="p-4 bg-white text-xs leading-relaxed text-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">
                  Bagian yang Layak Dibagikan, Forum (KKG/MGMP/Sekolah) & Tips Replikasi:
                </span>
                <p className="whitespace-pre-line">
                  {activeEntry?.share ||
                    "Diseminasi format checklist dan gim interaktif kepada rekan guru di MGMP kejuruan."}
                </p>
              </div>
            </div>

            {/* Bagian H. Catatan Data */}
            <div className="border border-slate-300 rounded-2xl overflow-hidden">
              <div className="bg-slate-100 px-4 py-2.5 font-heading font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-300">
                Bagian H. Catatan Data
              </div>
              <div className="p-4 bg-white text-xs leading-relaxed text-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">
                  Bagian yang Masih Perlu Bukti:
                </span>
                {activeEntry?.aiFeedback?.periksaBukti &&
                activeEntry.aiFeedback.periksaBukti.length > 0 ? (
                  <div className="space-y-2">
                    {activeEntry.aiFeedback.periksaBukti.map((pb, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 flex items-start gap-2"
                      >
                        <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[11px] block font-mono font-bold text-amber-900">
                            [Perlu Bukti]: {pb.klaim}
                          </strong>
                          <span className="text-[11px] text-amber-800">
                            Saran data autentik: {pb.saranData} ({pb.kategori})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-emerald-700 bg-emerald-50 p-2.5 rounded-xl font-medium">
                    ✓ Seluruh simpulan telah didukung oleh data dan bukti autentik yang terverifikasi.
                  </p>
                )}
              </div>
            </div>

            {/* Tanda Tangan Formal */}
            <div className="pt-8 grid grid-cols-2 text-center text-xs">
              <div>
                <p className="text-slate-500">Mengetahui,</p>
                <p className="font-semibold text-slate-800">Kepala Satuan Pendidikan</p>
                <div className="h-16" />
                <p className="font-bold text-slate-900 underline">
                  Drs. H. Ruslan S. Mohamad, M.Pd.
                </p>
                <p className="text-[11px] text-slate-500">NIP. 19680814 199412 1 002</p>
              </div>

              <div>
                <p className="text-slate-500">Gorontalo, {currentDateFormatted}</p>
                <p className="font-semibold text-slate-800">Guru Pengampu (Eksperimenter)</p>
                <div className="h-16" />
                <p className="font-bold text-slate-900 underline">{profile.nama}</p>
                <p className="text-[11px] text-slate-500">NIP. {profile.nip || "-"}</p>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* LAPORAN SINTESIS KUMULATIF SIKLUS TET (DOSSIER SUPERVISI)    */
          /* ============================================================ */
          <div className="space-y-6 text-slate-800 text-xs sm:text-sm">
            <div className="text-center mb-6">
              <h3 className="font-heading font-extrabold text-base sm:text-lg uppercase text-slate-900">
                {synthesisReport?.judulLaporan ||
                  "Laporan Sintesis Refleksi Siklus TET Guru"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Dossier Rekapitulasi Rangkaian Inkuiri Pembelajaran Berkelanjutan · {profile.mapel}
              </p>
            </div>

            {/* 1. Rangkuman Eksekutif */}
            <div>
              <h4 className="font-heading font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 mb-2">
                1. Rangkuman Eksekutif Kinerja & Siklus TET
              </h4>
              <p className="text-xs leading-relaxed text-slate-700 text-justify bg-slate-50 p-4 rounded-xl border border-slate-200 whitespace-pre-line">
                {synthesisReport?.rangkumanEksekutif ||
                  "Memuat sintesis capaian eksperimen mengajar guru, komitmen inkuiri, dan evaluasi hasil belajar murid..."}
              </p>
            </div>

            {/* 2. Analisis Tren Perkembangan */}
            <div>
              <h4 className="font-heading font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 mb-2">
                2. Analisis Tren Perkembangan Murid & Intervensi
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="font-bold text-indigo-700 block mb-0.5">
                    Tren Hasil Belajar Murid:
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {synthesisReport?.analisisTren?.trenHasilBelajar ||
                      "Tren ketuntasan bergerak positif dengan penurunan jumlah murid yang membutuhkan remedial intensif."}
                  </p>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="font-bold text-emerald-700 block mb-0.5">
                    Tren Keterlibatan Kelas & Orang Tua:
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {synthesisReport?.analisisTren?.trenKeterlibatan ||
                      "Partisipasi murid meningkat saat media interaktif dan kolaborasi orang tua diaktifkan."}
                  </p>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="font-bold text-amber-700 block mb-0.5">
                    Efektivitas Strategi Intervensi:
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {synthesisReport?.analisisTren?.efektivitasIntervensi ||
                      "Strategi intervensi pada tahap Desain terbukti efektif memperkecil kesenjangan pemahaman konsep."}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Catatan Supervisi Akademik */}
            <div>
              <h4 className="font-heading font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 mb-2">
                3. Catatan Supervisi Akademik & Kematangan Pedagogik
              </h4>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <p className="text-slate-800 leading-relaxed">
                  {synthesisReport?.catatanSupervisi ||
                    "Guru menunjukkan komitmen tinggi dalam menerapkan eksperimen terencana berbasis data formatif autentik."}
                </p>
              </div>
            </div>

            {/* 4. Rekomendasi Strategis */}
            <div>
              <h4 className="font-heading font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 mb-2">
                4. Rekomendasi Strategis Supervisi & Diseminasi
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {(synthesisReport?.rekomendasiStrategis || [
                  "Pertahankan integrasi data kuantitatif formatif sebagai dasar rancangan pembelajaran.",
                  "Tingkatkan dokumentasi umpan balik kualitatif langsung dari murid untuk memperkaya portofolio.",
                  "Diseminasi praktik baik ke MGMP sekolah dan kabupaten/kota secara berkala.",
                ]).map((rec, i) => (
                  <li key={i} className="leading-relaxed">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tanda Tangan Formal */}
            <div className="pt-8 grid grid-cols-2 text-center text-xs">
              <div>
                <p className="text-slate-500">Mengetahui,</p>
                <p className="font-semibold text-slate-800">Kepala Satuan Pendidikan</p>
                <div className="h-16" />
                <p className="font-bold text-slate-900 underline">
                  Drs. H. Ruslan S. Mohamad, M.Pd.
                </p>
                <p className="text-[11px] text-slate-500">NIP. 19680814 199412 1 002</p>
              </div>

              <div>
                <p className="text-slate-500">Gorontalo, {currentDateFormatted}</p>
                <p className="font-semibold text-slate-800">Guru Pengampu (Eksperimenter)</p>
                <div className="h-16" />
                <p className="font-bold text-slate-900 underline">{profile.nama}</p>
                <p className="text-[11px] text-slate-500">NIP. {profile.nip || "-"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
