import { AiFeedback, ReflectionEntry, SelfRubricScores } from "../types";

export function buildFallbackAnalysis(
  draft: Partial<ReflectionEntry>,
  selfRubricScores?: SelfRubricScores
): AiFeedback {
  const tuntasNum = Number(draft?.persenTuntas) || 75;
  const rataNum = Number(draft?.rataNA) || 80;

  const defaultScores = selfRubricScores || {
    penguasaanMateri: 3,
    diferensiasi: 3,
    interaktivitas: 3,
    asesmenData: 3,
    tindakLanjut: 3,
  };

  return {
    ringkasanDiagnostik: `Analisis pedagogik terstandar: Pembelajaran untuk elemen/materi "${
      draft?.elemenTP || "Tujuan Pembelajaran"
    }" menunjukkan tren positif dengan tingkat ketuntasan ${tuntasNum}% dan rata-rata nilai ${rataNum}. Penerapan tahapan inkuiri telah terstruktur secara memadai dengan area penguatan utama pada diferensiasi proses belajar dan penanganan soal sukar.`,
    acuanStandar:
      "Perdirjen GTK No. 2626/B/HK.04.01/2023 tentang Model Kompetensi Guru dan Panduan Pembelajaran & Asesmen Kurikulum Merdeka",
    skorValidasiAi: {
      penguasaanMateri: Math.min(4, Math.max(1, defaultScores.penguasaanMateri)),
      diferensiasi: Math.min(4, Math.max(1, defaultScores.diferensiasi)),
      interaktivitas: Math.min(4, Math.max(1, defaultScores.interaktivitas)),
      asesmenData: Math.min(4, Math.max(1, defaultScores.asesmenData)),
      tindakLanjut: Math.min(4, Math.max(1, defaultScores.tindakLanjut)),
    },
    stages: {
      assess: {
        tingkatKematangan: tuntasNum >= 80 ? "Cakap" : "Berkembang",
        kekuatan: `Data kondisi awal telah dicatat dengan rujukan hasil formatif dan identifikasi soal sukar (${
          draft?.soalSukar || "analisis konsep"
        }).`,
        masukan:
          "Lengkapi data asesmen diagnostik non-kognitif (gaya belajar atau minat murid) untuk memperkuat pemetaan.",
        pertanyaan_lanjutan:
          "Apa miskonsepsi paling mendasar yang memicu kekeliruan siswa pada soal sukar tersebut?",
        indikatorAcuan:
          "Standar Kompetensi Pedagogik 1.2: Pemahaman Karakteristik dan Kebutuhan Peserta Didik",
      },
      design: {
        tingkatKematangan: "Cakap",
        kekuatan: `Rancangan mengintegrasikan media peraga dan kolaborasi dengan ${
          draft?.rekan || "rekan MGMP"
        }.`,
        masukan:
          "Perjelas rancangan scaffolding bertingkat bagi peserta didik yang membutuhkan waktu belajar lebih intensif.",
        pertanyaan_lanjutan:
          "Bagaimana pembagian peran kolaboratif dengan rekan sejawat saat menyusun LKPD diferensiasi?",
        indikatorAcuan:
          "Standar Kompetensi Pedagogik 2.1: Perancangan Pembelajaran Diferensiasi",
      },
      implement: {
        tingkatKematangan: "Cakap",
        kekuatan:
          "Pelaksanaan di kelas terpantau aktif dan responsif terhadap dinamika serta kendala murid.",
        masukan:
          "Optimalkan alokasi waktu transisi antar fase agar sesi refleksi metakognitif bersama siswa lebih mendalam.",
        pertanyaan_lanjutan:
          "Langkah apa yang paling efektif Anda lakukan saat melihat siswa yang mulai kehilangan fokus?",
        indikatorAcuan:
          "Standar Kompetensi Pedagogik 3.2: Pengelolaan Kelas dan Fasilitasi Interaksi Positif",
      },
      measure: {
        tingkatKematangan: tuntasNum >= 75 ? "Cakap" : "Berkembang",
        kekuatan: `Memiliki rujukan data numerik ketuntasan (${tuntasNum}%) dan rencana aksi siklus lanjutan.`,
        masukan:
          "Gunakan umpan balik tertulis singkat (exit ticket) sebagai data komplementer penilaian numerik.",
        pertanyaan_lanjutan:
          "Perubahan spesifik apa pada alur demonstrasi atau LKPD yang akan Anda uji coba pada siklus berikutnya?",
        indikatorAcuan:
          "Standar Kompetensi Pedagogik 4.1: Pemanfaatan Hasil Asesmen untuk Refleksi Perbaikan",
      },
    },
    analisisGrafikDanData: `Dari populasi ${
      draft?.jumlahSiswa || 30
    } siswa, perolehan ketuntasan ${tuntasNum}% dan rata-rata NA ${rataNum} menunjukkan performa kelas yang solid. Titik tekan pada "${
      draft?.soalSukar || "soal sukar"
    }" mengindikasikan perlunya pemodelan konseptual eksplisit sebelum siswa berlatih mandiri.`,
    rekomendasiDiferensiasi: {
      intervensiTertinggal:
        "Berikan lembar panduan bertahap (step-by-step checklist) dan skema tutor sebaya (peer tutoring) dengan rekan yang sudah tuntas.",
      penguatanReguler:
        "Berikan latihan kasus kontekstual terapan tingkat menengah untuk memperkokoh pemahaman alur kerja.",
      pengayaanTinggi:
        "Sediakan tantangan proyek eksplorasi mandiri atau beri peran sebagai fasilitator kelompok kecil.",
    },
    rekomendasi_utama: [
      "Terapkan pemodelan terpandu (guided practice) untuk topik materi yang diidentifikasi sukar.",
      "Gunakan rubrik penilaian observasi transparan selama proses belajar agar murid memonitor kemajuannya secara mandiri.",
      "Diskusikan pola distraktor soal bersama rekan guru MGMP untuk menyempurnakan bank instrumen formatif.",
    ],
  };
}

export function buildFallbackWeeklySynthesis(
  teacherProfile: any,
  entries: any[]
) {
  return {
    judulLaporan:
      "Laporan Sintesis Refleksi Mingguan & Evaluasi Pembelajaran Guru",
    rangkumanEksekutif: `Berdasarkan rekapitulasi data refleksi pembelajaran mingguan pada mata pelajaran ${
      teacherProfile?.mapel || "Informatika & KKA"
    }, telah terlihat komitmen berkelanjutan dalam menerapkan siklus Inkuiri Kolaboratif (Assess-Design-Implement-Measure). Rata-rata capaian ketuntasan murid dan tingkat partisipasi kelas menunjukkan tren positif dengan penyesuaian strategi pembelajaran yang adaptif. Guru menunjukkan kesadaran reflektif tinggi dalam mengidentifikasi titik lemah pemahaman siswa pada asesmen formatif.`,
    analisisTren: {
      trenHasilBelajar:
        "Capaian ketuntasan rata-rata bergerak stabil di atas target KKTP dengan penurunan jumlah siswa yang membutuhkan remedial mendalam.",
      trenKeterlibatan:
        "Keterlibatan aktif siswa meningkat ketika metode praktikum berbasis proyek dan kolaborasi rekan sebaya diterapkan.",
      efektivitasIntervensi:
        "Strategi intervensi pada tahap Design terbukti efektif memperkecil kesenjangan pemahaman pada soal-soal tingkat analisis.",
    },
    tingkatKematanganInkuiri: "Cakap",
    catatanSupervisi:
      "Guru memenuhi kriteria kinerja reflektif sesuai Panduan Pembelajaran dan Asesmen Kurikulum Merdeka. Direkomendasikan untuk terus berbagi praktik baik di MGMP sekolah.",
    rekomendasiStrategis: [
      "Pertahankan integrasi data kuantitatif formatif sebagai dasar rancangan pembelajaran diferensiasi mingguan.",
      "Tingkatkan dokumentasi umpan balik kualitatif langsung dari murid untuk memperkaya portofolio refleksi.",
      "Jadikan hasil sintesis ini sebagai bahan diskusi reflektif pada rapat penjaminan mutu pembelajaran berkala.",
    ],
  };
}
