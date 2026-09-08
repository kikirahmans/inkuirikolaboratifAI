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
  const [reportMode, setReportMode] = useState<"mingguan" | "sintesis">(
    "mingguan"
  );
  const [synthesisReport, setSynthesisReport] =
    useState<WeeklySynthesisReport | null>(null);
  const [isLoadingSynthesis, setIsLoadingSynthesis] = useState<boolean>(false);

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
        periodeRentang: `Minggu 1 s.d. Minggu ${entries.length}`,
        judulLaporan: data.judulLaporan || "Laporan Sintesis Refleksi Mingguan Guru",
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
              onClick={() => setReportMode("mingguan")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                reportMode === "mingguan"
                  ? "bg-white text-indigo-600 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Laporan Per Minggu
            </button>
            <button
              onClick={() => {
                setReportMode("sintesis");
                if (!synthesisReport) generateSynthesisReport();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                reportMode === "sintesis"
                  ? "bg-white text-indigo-600 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>Sintesis Kumulatif AI</span>
            </button>
          </div>

          {reportMode === "mingguan" && entries.length > 1 && (
            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-xs text-slate-500">Pilih Minggu:</span>
              <select
                value={selectedEntryId}
                onChange={(e) => setSelectedEntryId(e.target.value)}
                className="text-xs font-medium px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
              >
                {entries.map((item) => (
                  <option key={item.id} value={item.id}>
                    Minggu {item.mingguKe} (Siklus {item.siklus})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {reportMode === "sintesis" && (
            <button
              onClick={generateSynthesisReport}
              disabled={isLoadingSynthesis}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition"
            >
              {isLoadingSynthesis ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              <span>Regenerasi Sintesis AI</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm"
            id="btn-cetak-laporan"
          >
            <Printer size={15} />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* DOCUMENT CANVAS (Print-ready formal sheet) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 max-w-4xl mx-auto print:p-0 print:border-none print:shadow-none">
        {/* Official Kop Laporan */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
          <p className="text-xs uppercase tracking-widest font-bold text-slate-600">
            Kementerian Pendidikan Dasar dan Menengah · Satuan Pendidikan Vokasi
          </p>
          <h2 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 uppercase mt-0.5">
            {profile.sekolah}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Portofolio Pengelolaan Kinerja & Asesmen Inkuiri Kolaboratif Pembelajaran
          </p>
          <div className="h-0.5 bg-slate-900 mt-3 mb-0.5" />
          <div className="h-px bg-slate-300" />
        </div>

        {reportMode === "mingguan" ? (
          /* ============================================================ */
          /* LAPORAN MINGGUAN SPESIFIK                                    */
          /* ============================================================ */
          <div className="space-y-6 text-slate-800 text-xs sm:text-sm">
            <div className="text-center mb-6">
              <h3 className="font-heading font-bold text-base sm:text-lg uppercase text-slate-900">
                Laporan Refleksi Pembelajaran Mingguan Guru
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Minggu ke-{activeEntry?.mingguKe || 1} · Siklus Inkuiri ke-{activeEntry?.siklus || 1} · Periode: {activeEntry?.periode || "-"}
              </p>
            </div>

            {/* Identitas Tabel */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                <div className="flex">
                  <span className="w-36 font-semibold text-slate-500">Nama Guru</span>
                  <span className="font-medium text-slate-900">: {profile.nama}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-semibold text-slate-500">NIP / NUPTK</span>
                  <span className="font-medium text-slate-900">: {profile.nip || "-"}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-semibold text-slate-500">Mata Pelajaran</span>
                  <span className="font-medium text-slate-900">: {profile.mapel}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-semibold text-slate-500">Fase / Kelas</span>
                  <span className="font-medium text-slate-900">: {profile.faseKelas}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-semibold text-slate-500">Tahun Ajaran</span>
                  <span className="font-medium text-slate-900">: {profile.tahunAjaran} ({profile.semester})</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-semibold text-slate-500">Rekan Kolaborasi</span>
                  <span className="font-medium text-slate-900">: {activeEntry?.rekan || "MGMP Satuan Pendidikan"}</span>
                </div>
                <div className="sm:col-span-2 flex">
                  <span className="w-36 font-semibold text-slate-500 shrink-0">Elemen / TP</span>
                  <span className="font-medium text-slate-900">: {activeEntry?.elemenTP}</span>
                </div>
              </div>
            </div>

            {/* I. Rekapitulasi Data Kuantitatif */}
            <div>
              <h4 className="font-heading font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 mb-2">
                I. Rekapitulasi Data Kuantitatif Hasil Belajar & Asesmen
              </h4>
              <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 border-r border-slate-200">Jumlah Siswa</th>
                    <th className="p-2.5 border-r border-slate-200 text-center">Batas KKTP</th>
                    <th className="p-2.5 border-r border-slate-200 text-center">Rata-rata NA</th>
                    <th className="p-2.5 border-r border-slate-200 text-center">% Ketuntasan</th>
                    <th className="p-2.5 text-center">% Keterlibatan Kelas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-2.5 border-r border-slate-200 font-medium">
                      {activeEntry?.jumlahSiswa} Orang
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-center font-bold text-rose-600">
                      {activeEntry?.kktp}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-center font-bold text-indigo-600">
                      {activeEntry?.rataNA}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-center font-bold text-emerald-600">
                      {activeEntry?.persenTuntas}%
                    </td>
                    <td className="p-2.5 text-center font-bold text-amber-600">
                      {activeEntry?.keterlibatanRate}%
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="text-[11px] text-slate-500 mt-1">
                * Soal Formatif Kategori Sukar / Distraktor:{" "}
                <span className="font-semibold text-slate-700">
                  {activeEntry?.soalSukar || "-"}
                </span>
              </p>
            </div>

            {/* II. Evaluasi Mandiri Guru Berbasis Rubrik */}
            <div>
              <h4 className="font-heading font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 mb-2">
                II. Evaluasi Mandiri Kompetensi Pedagogik (Skala 1 - 4)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-medium">Penguasaan Materi</span>
                  <span className="text-sm font-bold text-indigo-600 mt-0.5 block">
                    {activeEntry?.selfRubricScores?.penguasaanMateri || 3}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-medium">Diferensiasi</span>
                  <span className="text-sm font-bold text-indigo-600 mt-0.5 block">
                    {activeEntry?.selfRubricScores?.diferensiasi || 3}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-medium">Interaktivitas</span>
                  <span className="text-sm font-bold text-indigo-600 mt-0.5 block">
                    {activeEntry?.selfRubricScores?.interaktivitas || 3}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-medium">Analisis Data</span>
                  <span className="text-sm font-bold text-indigo-600 mt-0.5 block">
                    {activeEntry?.selfRubricScores?.asesmenData || 3}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 block font-medium">Tindak Lanjut</span>
                  <span className="text-sm font-bold text-indigo-600 mt-0.5 block">
                    {activeEntry?.selfRubricScores?.tindakLanjut || 3}
                  </span>
                </div>
              </div>
            </div>

            {/* III. Catatan Inkuiri Kolaboratif 4 Tahap */}
            <div>
              <h4 className="font-heading font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 mb-2">
                III. Ulasan 4 Tahap Inkuiri Kolaboratif Guru
              </h4>
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl">
                  <span className="font-bold text-xs text-rose-700 block mb-1">
                    A. ASSESS (Identifikasi Masalah & Data Awal):
                  </span>
                  <p className="text-xs leading-relaxed text-slate-700">
                    {activeEntry?.assess || "-"}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl">
                  <span className="font-bold text-xs text-indigo-700 block mb-1">
                    B. DESIGN (Perancangan Strategi & Kolaborasi):
                  </span>
                  <p className="text-xs leading-relaxed text-slate-700">
                    {activeEntry?.design || "-"}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl">
                  <span className="font-bold text-xs text-amber-700 block mb-1">
                    C. IMPLEMENT (Pelaksanaan di Kelas & Dinamika):
                  </span>
                  <p className="text-xs leading-relaxed text-slate-700">
                    {activeEntry?.implement || "-"}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl">
                  <span className="font-bold text-xs text-emerald-700 block mb-1">
                    D. MEASURE, REFLECT, CHANGE (Pengukuran, Refleksi & Perubahan):
                  </span>
                  <p className="text-xs leading-relaxed text-slate-700">
                    {activeEntry?.measure || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* IV. Rekomendasi Terstandar & Ulasan Validasi AI */}
            {activeEntry?.aiFeedback && (
              <div>
                <h4 className="font-heading font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  IV. Sintesis Validasi & Acuan Terstandar AI
                </h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                  <p>
                    <span className="font-bold text-indigo-700">
                      Landasan Acuan:{" "}
                    </span>
                    {activeEntry.aiFeedback.acuanStandar}
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-bold text-indigo-700">
                      Diagnostik Objektif:{" "}
                    </span>
                    {activeEntry.aiFeedback.ringkasanDiagnostik}
                  </p>
                  <div>
                    <span className="font-bold text-indigo-700 block mb-1">
                      Rekomendasi Tindak Lanjut Terstruktur:
                    </span>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-slate-700">
                      {activeEntry.aiFeedback.rekomendasi_utama.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ============================================================ */
          /* LAPORAN SINTESIS KUMULATIF MINGGUAN (SUPERVISORY DOSSIER)     */
          /* ============================================================ */
          <div className="space-y-6 text-slate-800 text-xs sm:text-sm">
            <div className="text-center mb-6">
              <h3 className="font-heading font-bold text-base sm:text-lg uppercase text-slate-900">
                {synthesisReport?.judulLaporan ||
                  "Laporan Sintesis Refleksi Mingguan Guru"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Dossier Rekapitulasi Pembelajaran Berkelanjutan · {profile.mapel}
              </p>
            </div>

            {/* Ringkasan Eksekutif */}
            <div>
              <h4 className="font-heading font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 mb-2">
                1. Rangkuman Eksekutif Kinerja & Refleksi Pembelajaran
              </h4>
              <p className="text-xs leading-relaxed text-slate-700 text-justify bg-slate-50 p-4 rounded-xl border border-slate-200">
                {synthesisReport?.rangkumanEksekutif ||
                  "Memuat sintesis capaian mengajar guru, komitmen inkuiri, dan evaluasi hasil belajar..."}
              </p>
            </div>

            {/* Analisis Tren Perkembangan */}
            <div>
              <h4 className="font-heading font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 mb-2">
                2. Analisis Tren Perkembangan Peserta Didik & Intervensi
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-indigo-700 block mb-1">
                    Tren Hasil Belajar (Kuantitatif):
                  </span>
                  <p className="text-slate-700">
                    {synthesisReport?.analisisTren?.trenHasilBelajar ||
                      "Data menunjukkan peningkatan bertahap pada rata-rata nilai dan ketuntasan klasikal."}
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-amber-700 block mb-1">
                    Tren Keterlibatan & Iklim Kelas:
                  </span>
                  <p className="text-slate-700">
                    {synthesisReport?.analisisTren?.trenKeterlibatan ||
                      "Keterlibatan aktif siswa meningkat secara konsisten saat metode kolaboratif diimplementasikan."}
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-teal-700 block mb-1">
                    Efektivitas Intervensi Inkuiri Guru:
                  </span>
                  <p className="text-slate-700">
                    {synthesisReport?.analisisTren?.efektivitasIntervensi ||
                      "Rancangan perbaikan pada tahap Design terbukti mampu mengatasi miskonsepsi siswa."}
                  </p>
                </div>
              </div>
            </div>

            {/* Rekomendasi Supervisi Akademik */}
            <div>
              <h4 className="font-heading font-bold text-xs sm:text-sm uppercase text-slate-900 border-b border-slate-200 pb-1 mb-2">
                3. Catatan Supervisi Akademik & Rekomendasi Strategis
              </h4>
              <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl text-xs space-y-2.5">
                <p>
                  <span className="font-bold text-indigo-900">
                    Catatan Asesor / Supervisi:{" "}
                  </span>
                  {synthesisReport?.catatanSupervisi ||
                    "Guru menunjukkan komitmen tinggi terhadap refleksi berbasis bukti dan peningkatan mutu mengajar."}
                </p>
                <div>
                  <span className="font-bold text-indigo-900 block mb-1">
                    Rekomendasi Strategis Mendatang:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-800 pl-1">
                    {(synthesisReport?.rekomendasiStrategis || []).map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Kolom Tanda Tangan Resmi (Academic Verification) */}
        <div className="pt-10 mt-8 border-t border-slate-200 grid grid-cols-2 text-center text-xs text-slate-800">
          <div>
            <p className="text-slate-500">Mengetahui,</p>
            <p className="font-semibold text-slate-700 mt-0.5">
              Kepala Sekolah / Guru Pamong
            </p>
            <div className="h-20" />
            <p className="font-bold text-slate-900 underline">
              Drs. H. Ahmad Rahim, M.Pd.
            </p>
            <p className="text-slate-500 text-[11px]">
              NIP. 19681120 199403 1 004
            </p>
          </div>

          <div>
            <p className="text-slate-500">
              Gorontalo, {currentDateFormatted}
            </p>
            <p className="font-semibold text-slate-700 mt-0.5">
              Guru Mata Pelajaran
            </p>
            <div className="h-20" />
            <p className="font-bold text-slate-900 underline">
              {profile.nama}
            </p>
            <p className="text-slate-500 text-[11px]">
              NIP. {profile.nip || "19880512 201101 1 008"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
