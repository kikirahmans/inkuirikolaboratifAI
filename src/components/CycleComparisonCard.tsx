import React from "react";
import { TrendingUp, TrendingDown, Minus, GitCompare, HelpCircle } from "lucide-react";
import { PerbandinganSiklus } from "../types";

interface CycleComparisonCardProps {
  comparison?: PerbandinganSiklus;
  currentCycle: number;
}

export const CycleComparisonCard: React.FC<CycleComparisonCardProps> = ({
  comparison,
  currentCycle,
}) => {
  if (!comparison) return null;

  const renderBadge = (arah: "naik" | "turun" | "tetap", selisih: number) => {
    if (arah === "naik") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
          <TrendingUp size={12} />
          <span>+{selisih} (Naik)</span>
        </span>
      );
    }
    if (arah === "turun") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
          <TrendingDown size={12} />
          <span>-{selisih} (Turun)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
        <Minus size={12} />
        <span>Tetap</span>
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-indigo-200 p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <GitCompare size={17} />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-slate-900">
              Perbandingan Antar Siklus (Siklus {comparison.siklusPembanding} ➔ Siklus {currentCycle})
            </h4>
            <p className="text-xs text-slate-500">
              Analisis pergerakan capaian murid & evaluasi mandiri guru
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-auto font-semibold">
          Siklus Iteratif TET
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Ketuntasan */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-600 uppercase">Ketuntasan Murid</span>
            {renderBadge(comparison.ketuntasan.arah, comparison.ketuntasan.selisih)}
          </div>
          <p className="text-xs text-slate-700 leading-snug">{comparison.ketuntasan.catatan}</p>
        </div>

        {/* Rata NA */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-600 uppercase">Rata-rata Nilai</span>
            {renderBadge(comparison.rataNA.arah, comparison.rataNA.selisih)}
          </div>
          <p className="text-xs text-slate-700 leading-snug">{comparison.rataNA.catatan}</p>
        </div>

        {/* Keterlibatan */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-600 uppercase">Partisipasi Kelas</span>
            {renderBadge(comparison.keterlibatan.arah, comparison.keterlibatan.selisih)}
          </div>
          <p className="text-xs text-slate-700 leading-snug">{comparison.keterlibatan.catatan}</p>
        </div>

        {/* Evaluasi Diri */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-600 uppercase">Rubrik Mandiri</span>
            {renderBadge(comparison.evaluasiDiri.arah, comparison.evaluasiDiri.selisih)}
          </div>
          <p className="text-xs text-slate-700 leading-snug">{comparison.evaluasiDiri.catatan}</p>
        </div>
      </div>

      {/* Dugaan Penyebab yang Divalidasi Guru */}
      <div className="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-100 flex items-start gap-2 text-xs text-indigo-950">
        <HelpCircle size={16} className="text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block text-indigo-900 mb-0.5">
            Dugaan Penyebab Perubahan (Untuk Divalidasi Guru):
          </strong>
          <p className="leading-relaxed">{comparison.dugaanPenyebab}</p>
        </div>
      </div>
    </div>
  );
};
