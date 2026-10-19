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
  AlertTriangle,
  Award,
  BookOpen,
  X,
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
  const [entryToDelete, setEntryToDelete] = useState<ReflectionEntry | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredEntries = entries.filter((e) => {
    const term = searchTerm.toLowerCase();
    return (
      (e.elemenTP || "").toLowerCase().includes(term) ||
      (e.periode || "").toLowerCase().includes(term) ||
      (e.rekan || "").toLowerCase().includes(term) ||
      `minggu ${e.mingguKe}`.includes(term) ||
      `siklus ${e.siklus}`.includes(term)
    );
  });

  const handleConfirmDelete = () => {
    if (!entryToDelete) return;
    const siklus = entryToDelete.siklus;
    const minggu = entryToDelete.mingguKe;
    const id = entryToDelete.id;

    onDeleteEntry(id);
    setEntryToDelete(null);
    setToastMessage(`Catatan refleksi Siklus ${siklus} (Minggu ke-${minggu}) berhasil dihapus.`);

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-600 hover:text-emerald-800 p-1 rounded-lg hover:bg-emerald-100 transition"
            title="Tutup pesan"
          >
            <X size={14} />
          </button>
        </div>
      )}

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
                      onClick={() => setEntryToDelete(entry)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 rounded-xl transition cursor-pointer"
                      title="Hapus dari riwayat"
                      aria-label={`Hapus Siklus ${entry.siklus}`}
                    >
                      <Trash2 size={13} />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* In-App Deletion Confirmation Modal */}
      {entryToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-delete-title"
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                  <Trash2 size={24} />
                </div>
                <button
                  onClick={() => setEntryToDelete(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  aria-label="Tutup dialog"
                >
                  <X size={18} />
                </button>
              </div>

              <h3 id="modal-delete-title" className="font-heading font-bold text-lg text-slate-900">
                Hapus Refleksi dari Riwayat?
              </h3>

              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Apakah Anda yakin ingin menghapus catatan refleksi ini? Tindakan ini akan menghapus data dari memori browser dan tidak dapat dibatalkan.
              </p>

              {/* Entry Details Preview */}
              <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Siklus {entryToDelete.siklus}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    Minggu ke-{entryToDelete.mingguKe}
                  </span>
                  <span className="text-[11px] text-slate-400">· {entryToDelete.periode}</span>
                </div>
                <p className="text-xs font-medium text-slate-700 line-clamp-1">
                  {entryToDelete.elemenTP || "(Tanpa Judul Elemen TP)"}
                </p>
                <div className="text-[11px] text-slate-400">
                  Rata NA: {entryToDelete.rataNA} · Ketuntasan: {entryToDelete.persenTuntas}%
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEntryToDelete(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl transition flex items-center gap-1.5 shadow-sm shadow-rose-200 cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Ya, Hapus Refleksi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
