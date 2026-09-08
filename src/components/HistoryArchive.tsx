import React, { useState } from "react";
import {
  Calendar,
  Search,
  Trash2,
  Copy,
  Edit3,
  FileText,
  CheckCircle2,
  AlertCircle,
  Award,
  BookOpen,
} from "lucide-react";
import { ReflectionEntry, calculateAverageRubric } from "../types";

interface HistoryArchiveProps {
  entries: ReflectionEntry[];
  onSelectEntry: (entry: ReflectionEntry) => void;
  onDuplicateEntry: (entry: ReflectionEntry) => void;
  onDeleteEntry: (id: string) => void;
  onViewReport: (entry: ReflectionEntry) => void;
}

export const HistoryArchive: React.FC<HistoryArchiveProps> = ({
  entries,
  onSelectEntry,
  onDuplicateEntry,
  onDeleteEntry,
  onViewReport,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEntries = entries.filter((e) => {
    const term = searchTerm.toLowerCase();
    return (
      e.elemenTP.toLowerCase().includes(term) ||
      e.periode.toLowerCase().includes(term) ||
      e.rekan.toLowerCase().includes(term) ||
      `minggu ${e.mingguKe}`.includes(term)
    );
  });

  return (
    <div className="space-y-4">
      {/* Header & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-heading font-bold text-base text-slate-900">
            Arsip Riwayat Refleksi & Evaluasi Mingguan ({entries.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Semua catatan refleksi inkuiri kolaboratif yang tersimpan secara lokal dan terekam di sistem.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari minggu, TP, materi..."
            className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 bg-slate-50 transition"
          />
        </div>
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <BookOpen size={36} className="mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-bold text-slate-700">Tidak ada refleksi yang cocok</p>
          <p className="text-xs text-slate-400 mt-1">
            {searchTerm
              ? "Coba kata kunci pencarian lain."
              : "Belum ada riwayat tersimpan. Mulai tulis refleksi pertama Anda."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => {
            const avgSelf = calculateAverageRubric(entry.selfRubricScores).toFixed(1);

            return (
              <div
                key={entry.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading font-bold text-sm text-slate-900">
                        Minggu ke-{entry.mingguKe}
                      </span>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs font-semibold text-slate-600">
                        Siklus {entry.siklus}
                      </span>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs text-slate-500">{entry.periode}</span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          entry.status === "final"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {entry.status === "final" ? "Siap Lapor" : "Draf"}
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                      {entry.elemenTP || "(Elemen TP tidak diisi)"}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Rekan Kolaborasi: {entry.rekan || "MGMP Satuan Pendidikan"}
                    </p>
                  </div>

                  {/* Quantitative Chips */}
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    <div className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Rata NA</span>
                      <span className="text-xs font-bold text-indigo-600">
                        {entry.rataNA}
                      </span>
                    </div>
                    <div className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">% Tuntas</span>
                      <span className="text-xs font-bold text-emerald-600">
                        {entry.persenTuntas}%
                      </span>
                    </div>
                    <div className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Rubrik</span>
                      <span className="text-xs font-bold text-amber-600">
                        {avgSelf} / 4.0
                      </span>
                    </div>
                  </div>
                </div>

                {/* Brief Stage Snippet */}
                <div className="text-xs text-slate-600 line-clamp-2 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700">Fokus Refleksi: </span>
                  {entry.measure || entry.assess || "Belum ada catatan refleksi."}
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 gap-2">
                  <span className="text-[11px] text-slate-400">
                    Disimpan: {new Date(entry.savedAt).toLocaleString("id-ID")}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectEntry(entry)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
                      title="Buka untuk diedit atau diperbarui"
                    >
                      <Edit3 size={13} />
                      <span>Buka Form</span>
                    </button>

                    <button
                      onClick={() => onViewReport(entry)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                      title="Lihat format dokumen laporan resmi"
                    >
                      <FileText size={13} />
                      <span>Format Laporan</span>
                    </button>

                    <button
                      onClick={() => onDuplicateEntry(entry)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition"
                      title="Duplikasi sebagai siklus berikutnya"
                    >
                      <Copy size={13} />
                      <span>Duplikasi</span>
                    </button>

                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      title="Hapus dari riwayat"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
