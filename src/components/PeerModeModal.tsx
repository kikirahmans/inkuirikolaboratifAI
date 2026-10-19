import React, { useState } from "react";
import { X, Users, Copy, Check, MessageSquare, Mic, Lightbulb, Save } from "lucide-react";
import { ModeSejawat, TeacherProfile } from "../types";

interface PeerModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  modeSejawatData?: ModeSejawat;
  profile: TeacherProfile;
  siklus: number;
  onSaveFeedbackNote?: (note: string) => void;
}

export const PeerModeModal: React.FC<PeerModeModalProps> = ({
  isOpen,
  onClose,
  modeSejawatData,
  profile,
  siklus,
  onSaveFeedbackNote,
}) => {
  const [hasCopiedSpeech, setHasCopiedSpeech] = useState(false);
  const [hasCopiedQuestions, setHasCopiedQuestions] = useState(false);
  const [peerNote, setPeerNote] = useState(
    modeSejawatData?.catatanUmpanBalikRekan || ""
  );
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const data: ModeSejawat = modeSejawatData || {
    pertanyaanDiskusi: [
      "Bagaimana rekan guru mengaitkan konsep logika abstrak dengan studi kasus kejuruan?",
      "Strategi apa yang paling efektif untuk memangkas waktu transisi kelas tanpa mengurangi interaktivitas?",
      "Bagaimana bentuk pelibatan orang tua yang paling realistis untuk murid SMK?",
    ],
    formatRingkasLisan: `Bapak/Ibu rekan sejawat, pada Siklus ${siklus} pembelajaran ${profile.mapel}, kami menerapkan inovasi ${profile.praktikBaikInovasi?.split("(")[0] || "Huyula Digital"}. Tantangan utama yang ditemukan adalah pada penanganan soal sukar, dan langkah perbaikan yang diuji coba adalah penyediaan panduan peran berjenjang dan tutor sebaya.`,
    catatanUmpanBalikRekan: "",
  };

  const handleCopySpeech = () => {
    navigator.clipboard.writeText(data.formatRingkasLisan);
    setHasCopiedSpeech(true);
    setTimeout(() => setHasCopiedSpeech(false), 2000);
  };

  const handleCopyQuestions = () => {
    const text = data.pertanyaanDiskusi.map((q, i) => `${i + 1}. ${q}`).join("\n");
    navigator.clipboard.writeText(text);
    setHasCopiedQuestions(true);
    setTimeout(() => setHasCopiedQuestions(false), 2000);
  };

  const handleSaveNote = () => {
    if (onSaveFeedbackNote) {
      onSaveFeedbackNote(peerNote);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 to-slate-950 text-white p-5 flex items-center justify-between border-b border-indigo-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <Users size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm sm:text-base text-white">
                  Mode Sejawat (Forum KKG / MGMP)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Komunitas Belajar
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Format ringkas lisan & pertanyaan inkuiri untuk diskusi rekan pendidik
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs sm:text-sm text-slate-700 bg-slate-50/50">
          {/* 1. Format Ringkas Siap Dibacakan */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Mic size={15} className="text-indigo-600" />
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900">
                  Format Ringkas Siap Dibacakan di Forum
                </h4>
              </div>
              <button
                onClick={handleCopySpeech}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition"
              >
                {hasCopiedSpeech ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                <span>{hasCopiedSpeech ? "Tersalin!" : "Salin Narasi"}</span>
              </button>
            </div>
            <p className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-800 leading-relaxed italic">
              "{data.formatRingkasLisan}"
            </p>
            <p className="text-[11px] text-slate-500 mt-2">
              💡 Durasi baca ± 30-45 detik, langsung ke inti temuan data dan rencana aksi.
            </p>
          </div>

          {/* 2. Pertanyaan Pemantik Diskusi Inkuiri */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare size={15} className="text-emerald-600" />
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900">
                  Pertanyaan Pemantik untuk Diskusi Rekan Guru
                </h4>
              </div>
              <button
                onClick={handleCopyQuestions}
                className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition"
              >
                {hasCopiedQuestions ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                <span>{hasCopiedQuestions ? "Tersalin!" : "Salin Semua"}</span>
              </button>
            </div>
            <div className="space-y-2 mt-2">
              {data.pertanyaanDiskusi.map((q, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed">{q}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Catatan Umpan Balik Rekan Sejawat */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Lightbulb size={15} className="text-amber-600" />
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900">
                  Catatan Umpan Balik / Saran Rekan Sejawat
                </h4>
              </div>
              <button
                onClick={handleSaveNote}
                className="flex items-center gap-1 text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-lg transition cursor-pointer"
              >
                {isSaved ? <Check size={12} /> : <Save size={12} />}
                <span>{isSaved ? "Tersimpan!" : "Simpan Catatan"}</span>
              </button>
            </div>
            <textarea
              value={peerNote}
              onChange={(e) => setPeerNote(e.target.value)}
              rows={3}
              placeholder="Catat masukan atau tanggapan berharga dari rekan guru di MGMP saat sesi inkuiri berlangsung..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition leading-relaxed text-slate-800"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-500">
            Komunitas Praktisi (Teacher as Researcher · Inquiry as Stance)
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
