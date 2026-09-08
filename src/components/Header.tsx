import React from "react";
import { Sparkles, User, School, BookOpen, Download, Upload, Plus } from "lucide-react";
import { TeacherProfile } from "../types";

interface HeaderProps {
  profile: TeacherProfile;
  onEditProfile: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  historyCount: number;
  onNewReflection: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onEditProfile,
  activeTab,
  setActiveTab,
  historyCount,
  onNewReflection,
  onExportData,
  onImportData,
}) => {
  return (
    <header className="bg-white text-slate-800 no-print border-b border-slate-200 sticky top-0 z-30">
      {/* Top Watermark Bar */}
      <div
        id="app-top-watermark"
        className="bg-slate-950 text-slate-200 text-xs py-1 px-4 border-b border-slate-800 select-none"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium tracking-wide">
              Sistem Refleksi Pembelajaran Guru SMK
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span className="text-slate-400">watermark:</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-bold tracking-wider text-indigo-300 bg-indigo-950/80 border border-indigo-700/70 shadow-xs">
              kikybahsoan
            </span>
          </div>
        </div>
      </div>

      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3.5">
            <img
              src="./logo.jpg"
              alt="Logo RefleksiGuru Kikybahsoan"
              className="h-12 sm:h-14 w-auto object-contain rounded-lg border border-slate-200/80 shadow-xs bg-white shrink-0 p-0.5"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                  RefleksiGuru
                </h1>
                <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                  kikybahsoan
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">
                  Inkuiri Kolaboratif
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pelaporan Mingguan & Evaluasi Mandiri Berbasis Data Grafik
              </p>
            </div>
          </div>

          {/* Teacher Profile & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onEditProfile}
              type="button"
              className="group flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 text-left border border-slate-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
              title="Klik untuk ubah profil guru & sekolah"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                {profile.nama
                  ? profile.nama
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                  : "GR"}
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition truncate max-w-[150px]">
                  {profile.nama}
                </p>
                <p className="text-slate-400 text-[11px] truncate max-w-[160px]">
                  {profile.mapel}
                </p>
              </div>
            </button>

            <button
              onClick={onNewReflection}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-full transition shadow-md shadow-indigo-100"
              id="btn-buat-refleksi-baru"
            >
              <Plus size={15} />
              <span>Siklus Baru</span>
            </button>

            {/* Backup & Restore Buttons */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
              <button
                onClick={onExportData}
                title="Ekspor / Backup Cadangan Data (JSON)"
                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition"
              >
                <Download size={15} />
              </button>
              <label
                title="Impor / Pulihkan Data (JSON)"
                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition cursor-pointer"
              >
                <Upload size={15} />
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportData}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar gap-1.5 py-1.5">
          {[
            { id: "tulis", label: "Dashboard Refleksi", icon: BookOpen },
            { id: "evaluasi", label: "Evaluasi Mandiri & Grafik", icon: Sparkles },
            { id: "laporan", label: "Laporan Mingguan", icon: School },
            { id: "riwayat", label: `Riwayat (${historyCount})`, icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                id={`tab-${tab.id}`}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm rounded-xl font-medium whitespace-nowrap transition ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Icon size={16} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
