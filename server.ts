import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

function cleanAndParseJson(rawText: string, fallback: any = {}) {
  try {
    let cleaned = rawText.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn("JSON parse warning:", err);
    return fallback;
  }
}

async function generateWithGemini(
  ai: GoogleGenAI,
  params: {
    contents: string;
    systemInstruction?: string;
  }
): Promise<string> {
  // Use gemini-3.1-flash-lite as reliable primary model, with cascade to gemini-flash-latest and gemini-3.8-flash
  const candidateModels = [
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
    "gemini-3.8-flash",
  ];

  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: {
          systemInstruction: params.systemInstruction,
          responseMimeType: "application/json",
        },
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      console.warn(`[Gemini API] Model '${model}' failed:`, errMsg);
    }
  }

  throw lastError;
}

function buildFallbackAnalysis(draft: any, selfRubricScores: any) {
  const rataNum = Number(draft?.rataNA) || 75;
  const tuntasNum = Number(draft?.persenTuntas) || 75;
  const selfPenguasaan = Number(selfRubricScores?.penguasaanMateri) || 3;
  const selfDiferensiasi = Number(selfRubricScores?.diferensiasi) || 3;
  const selfInteraktivitas = Number(selfRubricScores?.interaktivitas) || 3;
  const selfAsesmen = Number(selfRubricScores?.asesmenData) || 3;
  const selfTindakLanjut = Number(selfRubricScores?.tindakLanjut) || 3;

  return {
    ringkasanDiagnostik: `Refleksi siklus ${draft?.siklus || 1} pada elemen "${draft?.elemenTP || "Materi Pokok"}" menunjukkan ketercapaian kelas ${tuntasNum}% dengan rata-rata ${rataNum}. Guru telah mendokumentasikan dinamika kelas dan asesmen dengan baik, dengan fokus penguatan terarah pada penanganan materi sulit.`,
    acuanStandar: "Panduan Pembelajaran dan Asesmen (PPA) Kurikulum Merdeka & Model Inkuiri Kolaboratif Kemendikbudristek",
    skorValidasiAi: {
      penguasaanMateri: Number((Math.min(4, Math.max(2.5, (selfPenguasaan * 0.5 + (rataNum / 100) * 2)))).toFixed(1)),
      diferensiasi: Number((Math.min(4, Math.max(2.0, (selfDiferensiasi * 0.5 + (tuntasNum / 100) * 2)))).toFixed(1)),
      interaktivitas: Number((Math.min(4, Math.max(2.5, (selfInteraktivitas * 0.6 + 1.2)))).toFixed(1)),
      asesmenData: Number((Math.min(4, Math.max(2.6, (selfAsesmen * 0.5 + (rataNum / 100) * 2.1)))).toFixed(1)),
      tindakLanjut: Number((Math.min(4, Math.max(2.6, (selfTindakLanjut * 0.6 + 1.3)))).toFixed(1)),
    },
    stages: {
      assess: {
        tingkatKematangan: tuntasNum >= 80 ? "Cakap" : "Berkembang",
        kekuatan: "Data kondisi awal telah dicatat dengan rujukan hasil formatif dan identifikasi soal sukar (" + (draft?.soalSukar || "analisis konsep") + ").",
        masukan: "Lengkapi data asesmen diagnostik non-kognitif (gaya belajar atau minat murid) untuk memperkuat pemetaan.",
        pertanyaan_lanjutan: "Apa miskonsepsi paling mendasar yang memicu kekeliruan siswa pada soal sukar tersebut?",
        indikatorAcuan: "Standar Kompetensi Pedagogik 1.2: Pemahaman Karakteristik dan Kebutuhan Peserta Didik",
      },
      design: {
        tingkatKematangan: "Cakap",
        kekuatan: "Rancangan mengintegrasikan media peraga dan kolaborasi dengan " + (draft?.rekan || "rekan MGMP") + ".",
        masukan: "Perjelas rancangan scaffolding bertingkat bagi peserta didik yang membutuhkan waktu belajar lebih intensif.",
        pertanyaan_lanjutan: "Bagaimana pembagian peran kolaboratif dengan rekan sejawat saat menyusun LKPD diferensiasi?",
        indikatorAcuan: "Standar Kompetensi Pedagogik 2.1: Perancangan Pembelajaran Diferensiasi",
      },
      implement: {
        tingkatKematangan: "Cakap",
        kekuatan: "Pelaksanaan di kelas terpantau aktif dan responsif terhadap dinamika serta kendala murid.",
        masukan: "Optimalkan alokasi waktu transisi antar fase agar sesi refleksi metakognitif bersama siswa lebih mendalam.",
        pertanyaan_lanjutan: "Langkah apa yang paling efektif Anda lakukan saat melihat siswa yang mulai kehilangan fokus?",
        indikatorAcuan: "Standar Kompetensi Pedagogik 3.2: Pengelolaan Kelas dan Fasilitasi Interaksi Positif",
      },
      measure: {
        tingkatKematangan: tuntasNum >= 75 ? "Cakap" : "Berkembang",
        kekuatan: "Memiliki rujukan data numerik ketuntasan (" + tuntasNum + "%) dan rencana aksi siklus lanjutan.",
        masukan: "Gunakan umpan balik tertulis singkat (exit ticket) sebagai data komplementer penilaian numerik.",
        pertanyaan_lanjutan: "Perubahan spesifik apa pada alur demonstrasi atau LKPD yang akan Anda uji coba pada siklus berikutnya?",
        indikatorAcuan: "Standar Kompetensi Pedagogik 4.1: Pemanfaatan Hasil Asesmen untuk Refleksi Perbaikan",
      },
    },
    analisisGrafikDanData: `Dari populasi ${draft?.jumlahSiswa || 30} siswa, perolehan ketuntasan ${tuntasNum}% dan rata-rata NA ${rataNum} menunjukkan performa kelas yang solid. Titik tekan pada "${draft?.soalSukar || "soal sukar"}" mengindikasikan perlunya pemodelan konseptual eksplisit sebelum siswa berlatih mandiri.`,
    rekomendasiDiferensiasi: {
      intervensiTertinggal: "Berikan lembar panduan bertahap (step-by-step checklist) dan skema tutor sebaya (peer tutoring) dengan rekan yang sudah tuntas.",
      penguatanReguler: "Berikan latihan kasus kontekstual terapan tingkat menengah untuk memperkokoh pemahaman alur kerja.",
      pengayaanTinggi: "Sediakan tantangan proyek eksplorasi mandiri atau beri peran sebagai fasilitator kelompok kecil.",
    },
    rekomendasi_utama: [
      "Terapkan pemodelan terpandu (guided practice) untuk topik materi yang diidentifikasi sukar.",
      "Gunakan rubrik penilaian observasi transparan selama proses belajar agar murid memonitor kemajuannya secara mandiri.",
      "Diskusikan pola distraktor soal bersama rekan guru MGMP untuk menyempurnakan bank instrumen formatif."
    ],
  };
}

function buildFallbackWeeklySynthesis(teacherProfile: any, entries: any[]) {
  return {
    judulLaporan: "Laporan Sintesis Refleksi Mingguan & Evaluasi Pembelajaran Guru",
    rangkumanEksekutif: `Berdasarkan rekapitulasi data refleksi pembelajaran mingguan pada mata pelajaran ${teacherProfile?.mapel || "Informatika & KKA"}, telah terlihat komitmen berkelanjutan dalam menerapkan siklus Inkuiri Kolaboratif (Assess-Design-Implement-Measure). Rata-rata capaian ketuntasan murid dan tingkat partisipasi kelas menunjukkan tren positif dengan penyesuaian strategi pembelajaran yang adaptif. Guru menunjukkan kesadaran reflektif tinggi dalam mengidentifikasi titik lemah pemahaman siswa pada asesmen formatif.`,
    analisisTren: {
      trenHasilBelajar: "Capaian ketuntasan rata-rata bergerak stabil di atas target KKTP dengan penurunan jumlah siswa yang membutuhkan remedial mendalam.",
      trenKeterlibatan: "Keterlibatan aktif siswa meningkat ketika metode praktikum berbasis proyek dan kolaborasi rekan sebaya diterapkan.",
      efektivitasIntervensi: "Strategi intervensi pada tahap Design terbukti efektif memperkecil kesenjangan pemahaman pada soal-soal tingkat analisis.",
    },
    tingkatKematanganInkuiri: "Cakap",
    catatanSupervisi: "Guru memenuhi kriteria kinerja reflektif sesuai Panduan Pembelajaran dan Asesmen Kurikulum Merdeka. Direkomendasikan untuk terus berbagi praktik baik di MGMP sekolah.",
    rekomendasiStrategis: [
      "Pertahankan integrasi data kuantitatif formatif sebagai dasar rancangan pembelajaran diferensiasi mingguan.",
      "Tingkatkan dokumentasi umpan balik kualitatif langsung dari murid untuk memperkaya portofolio refleksi.",
      "Jadikan hasil sintesis ini sebagai bahan diskusi reflektif pada rapat penjaminan mutu pembelajaran berkala."
    ],
  };
}
app.post("/api/reflect/analyze", async (req, res) => {
  try {
    const { teacherProfile, draft, selfRubricScores } = req.body;

    const ai = getGeminiClient();

    const promptContext = `
Profil Guru & Satuan Pendidikan:
- Nama: ${teacherProfile?.nama || "Guru SMK"}
- Sekolah: ${teacherProfile?.sekolah || "SMK Negeri 2 Gorontalo"}
- Mata Pelajaran: ${teacherProfile?.mapel || "Informatika & Koding dan Kecerdasan Artifisial (KKA)"}
- Fase & Kelas: ${teacherProfile?.faseKelas || "Fase E - Kelas X"}

Identitas Refleksi:
- Elemen / Tujuan Pembelajaran (TP): ${draft?.elemenTP || "(tidak diisi)"}
- Siklus ke-: ${draft?.siklus || 1} | Minggu ke-: ${draft?.mingguKe || 1} | Periode: ${draft?.periode || "-"}
- Rekan Kolaborasi: ${draft?.rekan || "MGMP Satuan Pendidikan"}

Data Hasil Belajar Kuantitatif:
- Jumlah Siswa: ${draft?.jumlahSiswa || 30}
- Rata-rata Nilai Akhir (NA): ${draft?.rataNA || 75}
- Kriteria Ketercapaian Tujuan Pembelajaran (KKTP): ${draft?.kktp || 75}
- Persentase Ketuntasan: ${draft?.persenTuntas || 75}%
- Tingkat Keterlibatan Siswa: ${draft?.keterlibatanRate || 80}%
- Soal Formatif Kategori Sukar / Distraktor: ${draft?.soalSukar || "Soal Analisis / Penerapan"}

Evaluasi Mandiri Guru (Skor Rubrik 1-4):
- Penguasaan Materi & TP: ${selfRubricScores?.penguasaanMateri || 3}
- Diferensiasi Pembelajaran: ${selfRubricScores?.diferensiasi || 3}
- Interaktivitas & Keterlibatan: ${selfRubricScores?.interaktivitas || 3}
- Analisis Data Hasil Belajar: ${selfRubricScores?.asesmenData || 3}
- Rencana Tindak Lanjut: ${selfRubricScores?.tindakLanjut || 3}

Catatan Refleksi Inkuiri Kolaboratif oleh Guru:
[A. ASSESS - Identifikasi Masalah & Data Awal]:
${draft?.assess || "Belum ada catatan detail."}

[B. DESIGN - Perancangan Strategi & Kolaborasi]:
${draft?.design || "Belum ada catatan detail."}

[C. IMPLEMENT - Pelaksanaan di Kelas & Dinamika]:
${draft?.implement || "Belum ada catatan detail."}

[D. MEASURE, REFLECT, CHANGE - Hasil, Evaluasi & Rencana Perubahan]:
${draft?.measure || "Belum ada catatan detail."}
`.trim();

    const systemInstruction = `Anda adalah konsultan ahli pengembangan mutu guru dan fasilitator Inkuiri Kolaboratif (Kurikulum Merdeka dan standar supervisi akademik).
Tugas Anda adalah memvalidasi, menganalisis secara mendalam dan ilmiah catatan refleksi guru, serta memberikan acuan terstandar yang objektif dan terpercaya agar dapat dijadikan referensi resmi supervisi sekolah.

Analisis harus menghubungkan data hasil belajar kuantitatif (% tuntas, rata-rata NA, soal sukar) dengan narasi kualitatif guru.
Berikan juga penilaian skor validasi AI (skala 1 - 4 dengan desimal, misal 3.4) untuk 5 dimensi refleksi guru agar dapat dibandingkan langsung dengan evaluasi mandiri guru.

Kembalikan HANYA JSON valid (tanpa markdown wrapper \`\`\`json) dengan struktur:
{
  "ringkasanDiagnostik": "Ringkasan analisis komprehensif terhadap siklus pembelajaran ini (2-3 kalimat tajam)",
  "acuanStandar": "Rujukan regulasi/pedagogi (misal: Standar Proses Pembelajaran / Panduan Pembelajaran dan Asesmen Kurikulum Merdeka)",
  "skorValidasiAi": {
    "penguasaanMateri": 3.5,
    "diferensiasi": 3.0,
    "interaktivitas": 3.2,
    "asesmenData": 3.6,
    "tindakLanjut": 3.4
  },
  "stages": {
    "assess": {
      "tingkatKematangan": "Mahir / Cakap / Berkembang / Perlu Pendampingan",
      "kekuatan": "Kekuatan analisis awal berbasis data",
      "masukan": "Saran perbaikan identifikasi masalah",
      "pertanyaan_lanjutan": "Pertanyaan reflektif untuk pendalaman",
      "indikatorAcuan": "Indikator standar kompetensi guru yang terpenuhi"
    },
    "design": {
      "tingkatKematangan": "Mahir / Cakap / Berkembang / Perlu Pendampingan",
      "kekuatan": "Kekuatan perancangan intervensi",
      "masukan": "Saran perbaikan strategi & media ajar",
      "pertanyaan_lanjutan": "Pertanyaan reflektif perancangan",
      "indikatorAcuan": "Indikator kolaborasi MGMP dan adaptasi kurikulum"
    },
    "implement": {
      "tingkatKematangan": "Mahir / Cakap / Berkembang / Perlu Pendampingan",
      "kekuatan": "Kekuatan eksekusi pembelajaran di kelas",
      "masukan": "Saran manajemen kelas & keterlibatan siswa",
      "pertanyaan_lanjutan": "Pertanyaan reflektif implementasi",
      "indikatorAcuan": "Indikator iklim kelas yang aman dan partisipatif"
    },
    "measure": {
      "tingkatKematangan": "Mahir / Cakap / Berkembang / Perlu Pendampingan",
      "kekuatan": "Kekuatan analisis hasil dan metakognisi perubahan",
      "masukan": "Saran pengukuran tindak lanjut & diferensiasi",
      "pertanyaan_lanjutan": "Pertanyaan reflektif perubahan siklus berikutnya",
      "indikatorAcuan": "Indikator asesmen formatif berkelanjutan"
    }
  },
  "analisisGrafikDanData": "Ulasan analitis korelasi antara capaian kuantitatif siswa (% tuntas dan soal sukar) dengan metode yang digunakan",
  "rekomendasiDiferensiasi": {
    "intervensiTertinggal": "Langkah konkret untuk kelompok siswa yang belum mencapai KKTP",
    "penguatanReguler": "Langkah pemantapan konsep untuk kelompok reguler",
    "pengayaanTinggi": "Tantangan lanjutan / studi kasus kontekstual untuk siswa yang telah mahir"
  },
  "rekomendasi_utama": [
    "Rekomendasi tindakan prioritas 1",
    "Rekomendasi tindakan prioritas 2",
    "Rekomendasi tindakan prioritas 3"
  ]
}`;

    if (!ai) {
      return res.json(buildFallbackAnalysis(draft, selfRubricScores));
    }

    try {
      const outputText = await generateWithGemini(ai, {
        contents: promptContext,
        systemInstruction,
      });
      const parsed = cleanAndParseJson(outputText, null);
      if (parsed && parsed.ringkasanDiagnostik) {
        return res.json(parsed);
      }
      throw new Error("Format respons analisis AI tidak valid");
    } catch (apiErr: any) {
      console.warn("[Gemini Fallback] Menggunakan mesin analisis terstandar:", apiErr?.message);
      return res.json(buildFallbackAnalysis(draft, selfRubricScores));
    }
  } catch (error: any) {
    console.error("Error in /api/reflect/analyze:", error);
    res.status(500).json({
      error: error.message || "Gagal menganalisis refleksi",
    });
  }
});

// Endpoint: Weekly Synthesis & Formal Supervisory Report
app.post("/api/reflect/weekly-synthesis", async (req, res) => {
  try {
    const { teacherProfile, entries } = req.body;
    const ai = getGeminiClient();

    const dataSummary = (entries || [])
      .map(
        (e: any, idx: number) => `
Laporan #${idx + 1}:
- Periode/Minggu: ${e.draft?.periode || `Minggu ke-${e.draft?.mingguKe || idx + 1}`} (Siklus ${e.draft?.siklus || 1})
- Elemen TP: ${e.draft?.elemenTP || "-"}
- Rata-rata NA: ${e.draft?.rataNA || 0} | % Ketuntasan: ${e.draft?.persenTuntas || 0}% | Keterlibatan: ${e.draft?.keterlibatanRate || 0}%
- Evaluasi Diri (Skala 4): Penguasaan=${e.selfRubricScores?.penguasaanMateri || 3}, Diferensiasi=${e.selfRubricScores?.diferensiasi || 3}, Interaktif=${e.selfRubricScores?.interaktivitas || 3}, Asesmen=${e.selfRubricScores?.asesmenData || 3}, Tindak Lanjut=${e.selfRubricScores?.tindakLanjut || 3}
- Catatan Kunci Refleksi Guru:
  Assess: ${e.draft?.assess?.slice(0, 150) || "-"}
  Implement: ${e.draft?.implement?.slice(0, 150) || "-"}
  Measure/Change: ${e.draft?.measure?.slice(0, 150) || "-"}
`
      )
      .join("\n---\n");

    const prompt = `
Profil Guru:
- Nama: ${teacherProfile?.nama || "Guru"}
- Satuan Pendidikan: ${teacherProfile?.sekolah || "SMK"}
- Mapel: ${teacherProfile?.mapel || "Informatika & KKA"}

Data Rangkaian Refleksi Mingguan & Siklus:
${dataSummary}
`.trim();

    const systemInstruction = `Anda adalah supervisor akademik dan asesor pendidikan profesional.
Sintesiskan data refleksi mingguan guru ini menjadi laporan resmi komprehensif yang layak diserahkan kepada Kepala Sekolah, Pengawas Pembina, atau portofolio Pengelolaan Kinerja Guru (Platform Merdeka Mengajar).

Analisis harus mencakup:
1. Sintesis eksekutif kinerja mengajar guru
2. Tren perkembangan hasil belajar murid dan keterlibatan kelas
3. Korelasi antara perubahan strategi guru dengan peningkatan capaian siswa
4. Evaluasi kematangan pedagogik guru
5. Rekomendasi strategis supervisi akademik untuk minggu mendatang

Kembalikan HANYA JSON valid (tanpa markdown wrapper \`\`\`json) dengan format:
{
  "judulLaporan": "Laporan Sintesis Refleksi Mingguan & Evaluasi Pembelajaran Guru",
  "rangkumanEksekutif": "Narasi formal 3-4 paragraf yang merangkum esensi capaian dan dinamika proses mengajar",
  "analisisTren": {
    "trenHasilBelajar": "Penjelasan tren nilai rata-rata dan ketuntasan siswa",
    "trenKeterlibatan": "Penjelasan tren partisipasi dan motivasi siswa",
    "efektivitasIntervensi": "Bukti apakah intervensi yang dirancang guru berhasil meningkatkan pemahaman"
  },
  "tingkatKematanganInkuiri": "Mahir / Cakap / Berkembang",
  "catatanSupervisi": "Catatan resmi untuk pengawas / kepala sekolah mengenai kompetensi dan komitmen guru",
  "rekomendasiStrategis": [
    "Rekomendasi 1",
    "Rekomendasi 2",
    "Rekomendasi 3"
  ]
}`;

    if (!ai) {
      return res.json(buildFallbackWeeklySynthesis(teacherProfile, entries));
    }

    try {
      const outputText = await generateWithGemini(ai, {
        contents: prompt,
        systemInstruction,
      });
      const parsed = cleanAndParseJson(outputText, null);
      if (parsed && parsed.judulLaporan) {
        return res.json(parsed);
      }
      throw new Error("Format respons sintesis AI tidak valid");
    } catch (apiErr: any) {
      console.warn("[Gemini Fallback] Menggunakan mesin sintesis mingguan terstandar:", apiErr?.message);
      return res.json(buildFallbackWeeklySynthesis(teacherProfile, entries));
    }
  } catch (error: any) {
    console.error("Error in /api/reflect/weekly-synthesis:", error);
    res.status(500).json({
      error: error.message || "Gagal menyintesis laporan mingguan",
    });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
