import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ProfileModal } from "./components/ProfileModal";
import { ReflectionForm } from "./components/ReflectionForm";
import { SelfEvaluationCharts } from "./components/SelfEvaluationCharts";
import { WeeklyReportView } from "./components/WeeklyReportView";
import { HistoryArchive } from "./components/HistoryArchive";
import { TeacherProfile, ReflectionEntry } from "./types";
import { DEFAULT_PROFILE, INITIAL_REFLECTIONS } from "./data/defaultData";

const STORAGE_PROFILE_KEY = "refleksi_guru_profile_v2";
const STORAGE_ENTRIES_KEY = "refleksi_guru_entries_v2";

export default function App() {
  const [profile, setProfile] = useState<TeacherProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PROFILE;
  });

  const [entries, setEntries] = useState<ReflectionEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ENTRIES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REFLECTIONS;
  });

  const [activeTab, setActiveTab] = useState<string>("tulis");
  const [activeEntry, setActiveEntry] = useState<ReflectionEntry>(() => {
    return entries[0] || INITIAL_REFLECTIONS[0];
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error("Gagal menyimpan profil ke localStorage:", e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ENTRIES_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error("Gagal menyimpan entri refleksi ke localStorage:", e);
    }
  }, [entries]);

  // Handle saving an entry (either draft or final)
  const handleSaveEntry = (entry: ReflectionEntry) => {
    setActiveEntry(entry);
    setEntries((prev) => {
      const index = prev.findIndex((item) => item.id === entry.id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = entry;
        return copy;
      }
      return [entry, ...prev];
    });
  };

  // Start fresh reflection cycle
  const handleNewReflection = () => {
    const highestWeek = entries.reduce(
      (max, e) => Math.max(max, Number(e.mingguKe || 0)),
      0
    );
    const highestCycle = entries.reduce(
      (max, e) => Math.max(max, Number(e.siklus || 0)),
      0
    );

    const nextWeek = highestWeek + 1;
    const nextCycle = highestCycle + 1;

    const fresh: ReflectionEntry = {
      id: "ref-" + Math.random().toString(36).slice(2, 9),
      savedAt: new Date().toISOString(),
      mingguKe: nextWeek,
      siklus: nextCycle,
      periode: `Minggu ke-${nextWeek}`,
      elemenTP: "",
      rekan: "MGMP Satuan Pendidikan",
      jumlahSiswa: 32,
      rataNA: 75.0,
      kktp: 75,
      persenTuntas: 75.0,
      keterlibatanRate: 80,
      soalSukar: "",
      assess: "",
      design: "",
      implement: "",
      measure: "",
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

    setActiveEntry(fresh);
    setActiveTab("tulis");
  };

  // Select existing entry to edit
  const handleSelectEntry = (entry: ReflectionEntry) => {
    setActiveEntry(entry);
    setActiveTab("tulis");
  };

  // Duplicate entry to serve as next cycle
  const handleDuplicateEntry = (entry: ReflectionEntry) => {
    const highestWeek = entries.reduce(
      (max, e) => Math.max(max, Number(e.mingguKe || 0)),
      0
    );
    const newEntry: ReflectionEntry = {
      ...entry,
      id: "ref-" + Math.random().toString(36).slice(2, 9),
      savedAt: new Date().toISOString(),
      mingguKe: highestWeek + 1,
      siklus: entry.siklus + 1,
      periode: `Minggu ke-${highestWeek + 1}`,
      status: "draft",
      aiFeedback: null,
    };
    handleSaveEntry(newEntry);
    setActiveTab("tulis");
  };

  // Delete entry
  const handleDeleteEntry = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus refleksi ini dari riwayat?")) {
      const remaining = entries.filter((e) => e.id !== id);
      setEntries(remaining);
      if (activeEntry.id === id) {
        if (remaining.length > 0) {
          setActiveEntry(remaining[0]);
        } else {
          handleNewReflection();
        }
      }
    }
  };

  // Navigate to formal weekly report
  const handleViewReport = (entry: ReflectionEntry) => {
    setActiveEntry(entry);
    setActiveTab("laporan");
  };

  // Export JSON backup
  const handleExportData = () => {
    const backupData = {
      profile,
      entries,
      exportedAt: new Date().toISOString(),
      appVersion: "2.0.0",
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `backup_refleksi_guru_${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (parsed.profile) {
          setProfile(parsed.profile);
        }
        if (Array.isArray(parsed.entries) && parsed.entries.length > 0) {
          setEntries(parsed.entries);
          setActiveEntry(parsed.entries[0]);
        }
        alert("Data berhasil dipulihkan dari berkas cadangan!");
      } catch (err) {
        alert("Berkas JSON tidak valid atau format tidak sesuai.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col antialiased relative">
      {/* Subtle Top Watermark Ambient */}
      <div
        className="pointer-events-none fixed top-20 left-0 right-0 flex justify-center items-center z-0 overflow-hidden select-none opacity-[0.03] no-print"
        aria-hidden="true"
      >
        <span className="text-6xl sm:text-8xl md:text-9xl font-black tracking-widest text-slate-950 uppercase">
          kikybahsoan
        </span>
      </div>

      {/* App Header */}
      <Header
        profile={profile}
        onEditProfile={() => setIsProfileModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={entries.length}
        onNewReflection={handleNewReflection}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === "tulis" && (
          <ReflectionForm
            key={activeEntry.id}
            profile={profile}
            initialEntry={activeEntry}
            onSave={handleSaveEntry}
            onViewReport={handleViewReport}
          />
        )}

        {activeTab === "evaluasi" && (
          <SelfEvaluationCharts
            entries={entries}
            currentEntry={activeEntry}
            profile={profile}
          />
        )}

        {activeTab === "laporan" && (
          <WeeklyReportView
            entries={entries}
            currentEntry={activeEntry}
            profile={profile}
          />
        )}

        {activeTab === "riwayat" && (
          <HistoryArchive
            entries={entries}
            onSelectEntry={handleSelectEntry}
            onDuplicateEntry={handleDuplicateEntry}
            onDeleteEntry={handleDeleteEntry}
            onViewReport={handleViewReport}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 no-print text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            RefleksiGuru · Model Inkuiri Kolaboratif (Assess-Design-Implement-Measure) & Validasi AI
          </p>
          <p className="text-slate-400">
            {profile.sekolah} · {profile.mapel}
          </p>
        </div>
      </footer>

      {/* Teacher Profile Edit Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={(newProfile) => setProfile(newProfile)}
      />
    </div>
  );
}
