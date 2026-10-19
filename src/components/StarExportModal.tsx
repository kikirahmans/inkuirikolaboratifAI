import React, { useState } from "react";
import { X, Copy, Check, Download, Award, Share2, BookOpen } from "lucide-react";
import { PraktikBaikSTAR, TeacherProfile } from "../types";

interface StarExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  starData?: PraktikBaikSTAR;
  profile: TeacherProfile;
  siklus: number;
}

export const StarExportModal: React.FC<StarExportModalProps> = ({
  isOpen,
  onClose,
  starData,
  profile,
  siklus,
}) => {
  const [hasCopied, setHasCopied] = useState(false);

  if (!isOpen) return null;

  const data: PraktikBaikSTAR = starData || {
    judul: `Praktik Baik Pembelajaran Siklus ${siklus}`,
    situasi: `Pembelajaran ${profile.mapel} di ${profile.sekolah} pada murid kelas ${profile.faseKelas}.`,
    tantangan: `Miskonsepsi materi kejuruan dan kebutuhan scaffolding pembelajaran berdiferensiasi.`,
    aksi: `Eksperimen pembelajaran interaktif dan penugasan kolaboratif bersama orang tua.`,
    refleksiDampak: `Peningkatan capaian ketuntasan murid dan keterlibatan aktif di kelas.`,
    tipsReplikasi: `Gunakan lembar checklist peran dan media peraga kontekstual.`,
    kaitanKebijakanSekolah: `Mendukung program sekolah dalam penguatan pembelajaran digital.`,
  };

  const formattedText = `
DOKUMENTASI PRAKTIK BAIK PEMBELAJARAN (STRUKTUR STAR)
Berbasis Siklus Teacher Experimental Training (TET) & Inkuiri Kolaboratif

Judul: ${data.judul}
Penulis / Guru: ${profile.nama}
Satuan Pendidikan: ${profile.sekolah}
Mata Pelajaran: ${profile.mapel} (${profile.faseKelas})
Siklus Pembelajaran: Siklus ${siklus}

--------------------------------------------------
1. SITUASI (S):
${data.situasi}

2. TANTANGAN (T):
${data.tantangan}

3. AKSI (A):
${data.aksi}

4. REFLEKSI & DAMPAK (R):
${data.refleksiDampak}

--------------------------------------------------
TIPS REPLIKASI UNTUK REKAN SEJAWAT:
${data.tipsReplikasi}

KAITAN DENGAN PROGRAM / KEBIJAKAN SEKOLAH:
${data.kaitanKebijakanSekolah}
`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([formattedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Praktik_Baik_STAR_Siklus_${siklus}_${profile.nama.replace(/\s+/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 to-slate-950 text-white p-5 flex items-center justify-between border-b border-emerald-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Award size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm sm:text-base text-white">
                  Ekspor Praktik Baik (Format STAR)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  Situasi · Tantangan · Aksi · Refleksi
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Siap dibagikan ke KKG / MGMP / Komunitas Belajar Sekolah
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
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/50">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
              Judul Praktik Baik:
            </span>
            <h4 className="font-heading font-bold text-base text-slate-900">
              {data.judul}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Oleh: {profile.nama} · {profile.sekolah}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {/* Situasi */}
            <div className="bg-white p-4 rounded-2xl border-l-4 border-l-sky-500 border border-slate-200 shadow-xs">
              <span className="font-bold text-sky-800 text-xs uppercase tracking-wide block mb-1">
                1. Situasi (S)
              </span>
              <p className="text-slate-800">{data.situasi}</p>
            </div>

            {/* Tantangan */}
            <div className="bg-white p-4 rounded-2xl border-l-4 border-l-rose-500 border border-slate-200 shadow-xs">
              <span className="font-bold text-rose-800 text-xs uppercase tracking-wide block mb-1">
                2. Tantangan (T)
              </span>
              <p className="text-slate-800">{data.tantangan}</p>
            </div>

            {/* Aksi */}
            <div className="bg-white p-4 rounded-2xl border-l-4 border-l-indigo-600 border border-slate-200 shadow-xs">
              <span className="font-bold text-indigo-800 text-xs uppercase tracking-wide block mb-1">
                3. Aksi (A)
              </span>
              <p className="text-slate-800">{data.aksi}</p>
            </div>

            {/* Refleksi & Dampak */}
            <div className="bg-white p-4 rounded-2xl border-l-4 border-l-emerald-600 border border-slate-200 shadow-xs">
              <span className="font-bold text-emerald-800 text-xs uppercase tracking-wide block mb-1">
                4. Refleksi & Dampak (R)
              </span>
              <p className="text-slate-800">{data.refleksiDampak}</p>
            </div>
          </div>

          {/* Tips Replikasi */}
          <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-amber-950">
            <span className="font-bold text-xs uppercase tracking-wide block mb-1 text-amber-800">
              💡 Tips Replikasi untuk Rekan Guru:
            </span>
            <p className="text-xs leading-relaxed">{data.tipsReplikasi}</p>
          </div>

          {/* Kaitan Kebijakan Sekolah */}
          <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 text-slate-800">
            <span className="font-bold text-xs uppercase tracking-wide block mb-1 text-slate-700">
              🏫 Kaitan dengan Program / Kebijakan Sekolah:
            </span>
            <p className="text-xs leading-relaxed">{data.kaitanKebijakanSekolah}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-slate-500">
            Format sesuai standar diseminasi GTK Kurikulum Merdeka
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              {hasCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{hasCopied ? "Tersalin!" : "Salin Draf STAR"}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition shadow-xs cursor-pointer"
            >
              <Download size={14} />
              <span>Unduh Berkas Teks (.txt)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
