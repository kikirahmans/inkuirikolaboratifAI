export interface TeacherProfile {
  nama: string;
  nip: string;
  sekolah: string;
  mapel: string;
  faseKelas: string;
  semester: string;
  tahunAjaran: string;
  praktikBaikInovasi?: string; // e.g. "Huyula Digital: Pembelajaran Berpikir Komputasional Berbantuan Papan Interaktif"
}

export interface SelfRubricScores {
  penguasaanMateri: number; // 1 - 4
  diferensiasi: number; // 1 - 4
  interaktivitas: number; // 1 - 4
  asesmenData: number; // 1 - 4
  tindakLanjut: number; // 1 - 4
}

export interface AiValidationScores {
  penguasaanMateri: number;
  diferensiasi: number;
  interaktivitas: number;
  asesmenData: number;
  tindakLanjut: number;
}

export interface StageAnalysis {
  tingkatKematangan: "Mahir" | "Cakap" | "Berkembang" | "Perlu Pendampingan" | string;
  kekuatan: string;
  masukan: string;
  pertanyaan_lanjutan: string;
  indikatorAcuan: string;
}

export interface PerluBuktiItem {
  klaim: string;
  saranData: string;
  kategori: "Hasil Belajar" | "Keterlibatan Murid" | "Praktik Guru" | "Keterlibatan Orang Tua" | "Proses Digital" | "Umpan Balik Sejawat";
}

export interface PerbandinganMetrik {
  arah: "naik" | "turun" | "tetap";
  selisih: number;
  catatan: string;
}

export interface PerbandinganSiklus {
  siklusPembanding: number;
  ketuntasan: PerbandinganMetrik;
  rataNA: PerbandinganMetrik;
  keterlibatan: PerbandinganMetrik;
  evaluasiDiri: PerbandinganMetrik;
  dugaanPenyebab: string;
}

export interface PraktikBaikSTAR {
  judul: string;
  situasi: string;
  tantangan: string;
  aksi: string;
  refleksiDampak: string;
  tipsReplikasi: string;
  kaitanKebijakanSekolah: string;
}

export interface ModeSejawat {
  pertanyaanDiskusi: string[];
  formatRingkasLisan: string;
  catatanUmpanBalikRekan: string;
}

export interface LaporanRefleksiSiklusFormat {
  bagianA_Identitas: string;
  bagianB_Identifikasi: string;
  bagianC_Desain: string;
  bagianD_Implementasi: string;
  bagianE_AmatiRefleksi: string;
  bagianF_PerubahanTindakLanjut: string;
  bagianG_BerbagiPraktik: string;
  bagianH_CatatanData: string;
}

export interface AiFeedback {
  ringkasanDiagnostik: string;
  acuanStandar: string;
  skorValidasiAi?: AiValidationScores;
  stages: {
    assess?: StageAnalysis;
    design?: StageAnalysis;
    implement?: StageAnalysis;
    measure?: StageAnalysis;
    share?: StageAnalysis;
  };
  analisisGrafikDanData?: string;
  rekomendasiDiferensiasi?: {
    intervensiTertinggal?: string;
    penguatanReguler?: string;
    pengayaanTinggi?: string;
  };
  rekomendasi_utama: string[];
  // Fitur Baru Dokumen Acuan:
  ringkasanPembukaSesi?: {
    rangkumanSiklusSebelumnya: string;
    rencanaPerubahanSebelumnya: string;
    pertanyaanKonfirmasi: string;
  };
  periksaBukti?: PerluBuktiItem[];
  perbandinganAntarSiklus?: PerbandinganSiklus;
  modeSejawat?: ModeSejawat;
  praktikBaikSTAR?: PraktikBaikSTAR;
  laporanFormatTetap?: LaporanRefleksiSiklusFormat;
}

export interface BuktiDataInput {
  hasilBelajar: string; // Nilai formatif/sumatif, persentase ketuntasan, hasil produk (infografis) [tahap 1, 4]
  keterlibatanMurid: string; // Catatan observasi, partisipasi gim, umpan balik murid, lembar refleksi [tahap 1, 3, 4]
  praktikGuru: string; // Catatan mengajar, supervisi, peer observation, perubahan strategi [tahap 1, 3, 4]
  keterlibatanOrangTua: string; // Jumlah dan kualitas dokumentasi bersama ortu, kendala muncul [tahap 3, 4]
  prosesDigital: string; // Screenshot Classroom, jejak umpan balik, log Papan Interaktif [tahap 3, 4]
  umpanBalikSejawat: string; // Masukan KKG/MGMP, rekan, kepala sekolah [tahap 1, 4, 5]
}

export interface ReflectionEntry {
  id: string;
  savedAt: string;
  mingguKe: number;
  siklus: number;
  periode: string;
  elemenTP: string;
  rekan: string;

  // Data kuantitatif murid
  jumlahSiswa: number; // Jumlah murid
  rataNA: number;
  kktp: number;
  persenTuntas: number;
  keterlibatanRate: number;
  soalSukar: string;

  // 5 Tahap Siklus TET & Inkuiri Kolaboratif
  // 1. Identifikasi (Assess)
  assess: string;
  // 2. Desain (Design)
  design: string;
  // 3. Implementasi (Implement)
  implement: string;
  // 4. Amati dan Refleksi (Measure - Reflect - Change)
  measure: string;
  // 5. Berbagi Praktik Baik (Tindak Lanjut Komunitas)
  share: string;

  // 6 Kategori Bukti Data
  buktiData?: BuktiDataInput;

  // Rencana perubahan untuk siklus berikutnya
  rencanaPerubahanBerikutnya?: string;
  indikatorPemantauan?: string;

  // Evaluasi Mandiri Guru
  selfRubricScores: SelfRubricScores;

  // AI Feedback & Analisis
  aiFeedback: AiFeedback | null;
  status: "draft" | "final";
}

export interface WeeklySynthesisReport {
  id: string;
  generatedAt: string;
  periodeRentang: string;
  judulLaporan: string;
  rangkumanEksekutif: string;
  analisisTren: {
    trenHasilBelajar: string;
    trenKeterlibatan: string;
    efektivitasIntervensi: string;
  };
  tingkatKematanganInkuiri: string;
  catatanSupervisi: string;
  rekomendasiStrategis: string[];
}

export interface ChatMessage {
  id: string;
  sender: "ai" | "guru";
  text: string;
  tahapAktif?: 1 | 2 | 3 | 4 | 5;
  timestamp: string;
  perluBuktiLabel?: boolean;
}

export function calculateAverageRubric(
  scores?: Partial<SelfRubricScores> | Partial<AiValidationScores> | null
): number {
  if (!scores) return 0;
  const total =
    Number(scores.penguasaanMateri || 0) +
    Number(scores.diferensiasi || 0) +
    Number(scores.interaktivitas || 0) +
    Number(scores.asesmenData || 0) +
    Number(scores.tindakLanjut || 0);
  return Number((total / 5).toFixed(2));
}
