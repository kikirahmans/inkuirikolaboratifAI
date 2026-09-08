export interface TeacherProfile {
  nama: string;
  nip: string;
  sekolah: string;
  mapel: string;
  faseKelas: string;
  semester: string;
  tahunAjaran: string;
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

export interface AiFeedback {
  ringkasanDiagnostik: string;
  acuanStandar: string;
  skorValidasiAi?: AiValidationScores;
  stages: {
    assess?: StageAnalysis;
    design?: StageAnalysis;
    implement?: StageAnalysis;
    measure?: StageAnalysis;
  };
  analisisGrafikDanData?: string;
  rekomendasiDiferensiasi?: {
    intervensiTertinggal?: string;
    penguatanReguler?: string;
    pengayaanTinggi?: string;
  };
  rekomendasi_utama: string[];
}

export interface ReflectionEntry {
  id: string;
  savedAt: string;
  mingguKe: number;
  siklus: number;
  periode: string;
  elemenTP: string;
  rekan: string;
  // Data kuantitatif
  jumlahSiswa: number;
  rataNA: number;
  kktp: number;
  persenTuntas: number;
  keterlibatanRate: number;
  soalSukar: string;
  // Narasi Inkuiri Kolaboratif
  assess: string;
  design: string;
  implement: string;
  measure: string;
  // Evaluasi Mandiri
  selfRubricScores: SelfRubricScores;
  // AI Feedback
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

