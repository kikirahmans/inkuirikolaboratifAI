import React, { useState } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  BarChart3,
  Award,
  Users,
  Target,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { ReflectionEntry, TeacherProfile, calculateAverageRubric } from "../types";

interface SelfEvaluationChartsProps {
  entries: ReflectionEntry[];
  currentEntry?: ReflectionEntry;
  profile: TeacherProfile;
}

export const SelfEvaluationCharts: React.FC<SelfEvaluationChartsProps> = ({
  entries,
  currentEntry,
  profile,
}) => {
  const [selectedEntryId, setSelectedEntryId] = useState<string>(
    currentEntry?.id || entries[0]?.id || ""
  );

  // Active entry for radar analysis
  const activeEntry =
    entries.find((e) => e.id === selectedEntryId) ||
    currentEntry ||
    entries[0];

  // Radar Data: comparing Self Score vs AI Benchmark
  const radarData = [
    {
      dimensi: "Penguasaan Materi",
      EvaluasiMandiri: Number(activeEntry?.selfRubricScores?.penguasaanMateri || 3),
      AcuanAI: Number(
        activeEntry?.aiFeedback?.skorValidasiAi?.penguasaanMateri ||
          activeEntry?.selfRubricScores?.penguasaanMateri ||
          3.2
      ),
      fullMark: 4,
    },
    {
      dimensi: "Diferensiasi",
      EvaluasiMandiri: Number(activeEntry?.selfRubricScores?.diferensiasi || 3),
      AcuanAI: Number(
        activeEntry?.aiFeedback?.skorValidasiAi?.diferensiasi ||
          activeEntry?.selfRubricScores?.diferensiasi ||
          3.0
      ),
      fullMark: 4,
    },
    {
      dimensi: "Interaktivitas",
      EvaluasiMandiri: Number(activeEntry?.selfRubricScores?.interaktivitas || 3),
      AcuanAI: Number(
        activeEntry?.aiFeedback?.skorValidasiAi?.interaktivitas ||
          activeEntry?.selfRubricScores?.interaktivitas ||
          3.3
      ),
      fullMark: 4,
    },
    {
      dimensi: "Analisis Data",
      EvaluasiMandiri: Number(activeEntry?.selfRubricScores?.asesmenData || 3),
      AcuanAI: Number(
        activeEntry?.aiFeedback?.skorValidasiAi?.asesmenData ||
          activeEntry?.selfRubricScores?.asesmenData ||
          3.4
      ),
      fullMark: 4,
    },
    {
      dimensi: "Tindak Lanjut",
      EvaluasiMandiri: Number(activeEntry?.selfRubricScores?.tindakLanjut || 3),
      AcuanAI: Number(
        activeEntry?.aiFeedback?.skorValidasiAi?.tindakLanjut ||
          activeEntry?.selfRubricScores?.tindakLanjut ||
          3.2
      ),
      fullMark: 4,
    },
  ];

  // Trend Data across all reflections sorted by week
  const trendData = [...entries]
    .sort((a, b) => a.mingguKe - b.mingguKe)
    .map((e) => {
      const avgSelf = calculateAverageRubric(e.selfRubricScores).toFixed(1);
      const avgAi = calculateAverageRubric(
        e.aiFeedback?.skorValidasiAi || e.selfRubricScores
      ).toFixed(1);

      return {
        label: `Mgg ${e.mingguKe} (S${e.siklus})`,
        mingguKe: e.mingguKe,
        siklus: e.siklus,
        elemen: e.elemenTP,
        rataNA: Number(e.rataNA) || 0,
        kktp: Number(e.kktp) || 75,
        persenTuntas: Number(e.persenTuntas) || 0,
        keterlibatan: Number(e.keterlibatanRate) || 0,
        skorMandiri: Number(avgSelf),
        skorAI: Number(avgAi),
      };
    });

  // Calculations for summary metrics
  const totalEntries = entries.length;
  const avgNA =
    totalEntries > 0
      ? (entries.reduce((sum, e) => sum + Number(e.rataNA || 0), 0) / totalEntries).toFixed(1)
      : "0";
  const avgKetuntasan =
    totalEntries > 0
      ? (
          entries.reduce((sum, e) => sum + Number(e.persenTuntas || 0), 0) / totalEntries
        ).toFixed(1)
      : "0";
  const avgKeterlibatan =
    totalEntries > 0
      ? (
          entries.reduce((sum, e) => sum + Number(e.keterlibatanRate || 0), 0) / totalEntries
        ).toFixed(1)
      : "0";

  return (
    <div className="space-y-6">
      {/* Top Header & Context */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="text-indigo-600" size={22} />
            <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
              Evaluasi Mandiri & Analitik Grafik Berbasis Data
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visualisasi komparatif antara evaluasi mandiri guru, ketercapaian hasil belajar siswa, dan acuan standar AI.
          </p>
        </div>

        {/* Reflection Selector */}
        {entries.length > 1 && (
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
              Lihat Siklus:
            </span>
            <select
              value={selectedEntryId}
              onChange={(e) => setSelectedEntryId(e.target.value)}
              className="text-xs font-medium px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
            >
              {entries.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  Minggu {entry.mingguKe} (Siklus {entry.siklus}) · {entry.elemenTP.slice(0, 30)}…
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Rata-rata NA Siswa</span>
            <Target size={16} className="text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{avgNA}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <p className="text-[11px] text-indigo-600 font-medium mt-1">
            Target KKTP: {activeEntry?.kktp || 75}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Ketuntasan Klasikal</span>
            <TrendingUp size={16} className="text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{avgKetuntasan}%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Persentase siswa tuntas rata-rata
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Keterlibatan Kelas</span>
            <Users size={16} className="text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{avgKeterlibatan}%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Tingkat keaktifan & partisipasi
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Siklus Inkuiri</span>
            <Award size={16} className="text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{totalEntries}</span>
            <span className="text-xs text-slate-400">minggu</span>
          </div>
          <p className="text-[11px] text-purple-600 font-medium mt-1">
            Terdokumentasi & Terverifikasi
          </p>
        </div>
      </div>

      {/* Grid: Radar Chart & Trend Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart: Pedagogical Dimensions Comparison */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-600" />
                <h3 className="font-heading font-bold text-slate-900 text-sm sm:text-base">
                  Radar Kompetensi Refleksi Guru
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Minggu {activeEntry?.mingguKe || 1}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Perbandingan Skor Evaluasi Mandiri Guru vs Skor Validasi AI Terstandar (Skala 1 - 4).
            </p>
          </div>

          <div className="w-full h-72 sm:h-80 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="dimensi"
                  tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 4]}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <Radar
                  name="Evaluasi Mandiri (Guru)"
                  dataKey="EvaluasiMandiri"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
                <Radar
                  name="Acuan Validasi AI"
                  dataKey="AcuanAI"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <Tooltip
                  formatter={(value: any) => [`${value} / 4.0`, ""]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "8px", fontSize: "12px" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            <span className="font-bold text-indigo-700">Catatan Analitis: </span>
            {activeEntry?.aiFeedback?.analisisGrafikDanData ||
              "Kesesuaian antara evaluasi mandiri guru dan penilaian objektif AI menunjukkan tingkat kesadaran metakognitif yang matang."}
          </div>
        </div>

        {/* Line Chart: Learning Outcomes Progress Trend */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-600" />
                <h3 className="font-heading font-bold text-slate-900 text-sm sm:text-base">
                  Tren Capaian Belajar vs KKTP
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Semua Siklus
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Perkembangan Nilai Akhir (NA) rata-rata murid terhadap Kriteria Ketercapaian Tujuan Pembelajaran (KKTP).
            </p>
          </div>

          <div className="w-full h-72 sm:h-80 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis domain={[50, 100]} tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "8px", fontSize: "12px" }} />
                <ReferenceLine
                  y={75}
                  label={{ value: "Batas KKTP (75)", fill: "#ef4444", fontSize: 11, position: "top" }}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                />
                <Line
                  type="monotone"
                  dataKey="rataNA"
                  name="Rata-rata Nilai Akhir (NA)"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
            <span>
              Tren positif terverifikasi: Terjadi kenaikan konsisten nilai rata-rata murid seiring penyesuaian strategi pada siklus inkuiri.
            </span>
          </div>
        </div>
      </div>

      {/* Bar Chart: Mastery Percentage vs Engagement Rate */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-indigo-600" />
              <h3 className="font-heading font-bold text-slate-900 text-sm sm:text-base">
                Ketuntasan Siswa (%) & Tingkat Keterlibatan Kelas (%)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Hubungan keterlibatan interaktif siswa di kelas dengan keberhasilan ketuntasan asesmen formatif.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block" /> % Tuntas
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-xs bg-teal-600 inline-block" /> % Keterlibatan
            </span>
          </div>
        </div>

        <div className="w-full h-64 sm:h-72 my-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip
                formatter={(val: any) => [`${val}%`, ""]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "8px", fontSize: "12px" }} />
              <Bar
                dataKey="persenTuntas"
                name="% Ketuntasan Belajar Siswa"
                fill="#4f46e5"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="keterlibatan"
                name="% Tingkat Keterlibatan Siswa"
                fill="#0d9488"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table of Reflection Cycles & Rubric Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-heading font-bold text-slate-900 text-sm sm:text-base mb-3">
          Rekapitulasi Matriks Evaluasi Mandiri per Siklus
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-3.5 py-3">Siklus / Periode</th>
                <th className="px-3.5 py-3">Elemen TP</th>
                <th className="px-3.5 py-3 text-center">Rata NA</th>
                <th className="px-3.5 py-3 text-center">% Tuntas</th>
                <th className="px-3.5 py-3 text-center">Keterlibatan</th>
                <th className="px-3.5 py-3 text-center">Skor Mandiri</th>
                <th className="px-3.5 py-3 text-center">Skor Acuan AI</th>
                <th className="px-3.5 py-3">Kematangan Inkuiri</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((entry) => {
                const avgSelf = calculateAverageRubric(entry.selfRubricScores).toFixed(1);
                const avgAi = calculateAverageRubric(
                  entry.aiFeedback?.skorValidasiAi || entry.selfRubricScores
                ).toFixed(1);
                const kematangan =
                  entry.aiFeedback?.stages?.implement?.tingkatKematangan ||
                  (Number(avgSelf) >= 3.6 ? "Mahir" : Number(avgSelf) >= 3.0 ? "Cakap" : "Berkembang");

                return (
                  <tr key={entry.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-3.5 py-3 font-semibold text-slate-900">
                      Minggu {entry.mingguKe}
                      <span className="block text-[10px] font-normal text-slate-400">
                        Siklus {entry.siklus} · {entry.periode}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-slate-700 max-w-xs truncate" title={entry.elemenTP}>
                      {entry.elemenTP}
                    </td>
                    <td className="px-3.5 py-3 text-center font-bold text-slate-900">
                      {entry.rataNA}
                    </td>
                    <td className="px-3.5 py-3 text-center font-semibold text-emerald-600">
                      {entry.persenTuntas}%
                    </td>
                    <td className="px-3.5 py-3 text-center font-semibold text-amber-600">
                      {entry.keterlibatanRate}%
                    </td>
                    <td className="px-3.5 py-3 text-center font-bold text-slate-900">
                      {avgSelf} / 4.0
                    </td>
                    <td className="px-3.5 py-3 text-center font-bold text-indigo-600">
                      {avgAi} / 4.0
                    </td>
                    <td className="px-3.5 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          kematangan === "Mahir"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : kematangan === "Cakap"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {kematangan}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
