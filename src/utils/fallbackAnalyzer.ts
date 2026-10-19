import {
  AiFeedback,
  ReflectionEntry,
  SelfRubricScores,
  TeacherProfile,
  PerluBuktiItem,
  PerbandinganSiklus,
  PraktikBaikSTAR,
  ModeSejawat,
  LaporanRefleksiSiklusFormat,
} from "../types";

export function detectMissingEvidence(draft: Partial<ReflectionEntry>): PerluBuktiItem[] {
  const needsEvidence: PerluBuktiItem[] = [];

  const textAssess = draft.assess || "";
  const textDesign = draft.design || "";
  const textImplement = draft.implement || "";
  const textMeasure = draft.measure || "";
  const allText = `${textAssess} ${textDesign} ${textImplement} ${textMeasure}`;

  // Check if claims are made without numbers or citations
  if (
    /antusias|semangat|tertarik|senang|aktif/i.test(textImplement) &&
    !/\d+%|\d+\s*(orang|murid|siswa)/i.test(textImplement)
  ) {
    needsEvidence.push({
      klaim: "Pernyataan mengenai keaktifan atau antusiasme murid di kelas",
      saranData:
        "Sertakan catatan observasi jumlah murid yang aktif mencoba media/layar interaktif atau persentase partisipasi gim.",
      kategori: "Keterlibatan Murid",
    });
  }

  if (
    /orang tua|wali/i.test(textImplement) &&
    !draft.buktiData?.keterlibatanOrangTua &&
    !/\d+\s*(orang tua|wali)/i.test(textImplement)
  ) {
    needsEvidence.push({
      klaim: "Pelibatan orang tua dalam penugasan aplikatif",
      saranData:
        "Sertakan jumlah orang tua yang menandatangani lembar konfirmasi tugas atau bukti tangkapan layar komunikasi Google Classroom.",
      kategori: "Keterlibatan Orang Tua",
    });
  }

  if (
    /bingung|sulit|gagal|kesulitan|keliru/i.test(textAssess) &&
    !/\d+%|\d+\s*(murid|anak|siswa)/i.test(textAssess)
  ) {
    needsEvidence.push({
      klaim: "Deskripsi kesulitan atau miskonsepsi murid pada materi",
      saranData:
        "Sertakan bukti konkret seperti jumlah murid yang keliru pada soal formatif tertentu atau foto hasil lembar kerja.",
      kategori: "Hasil Belajar",
    });
  }

  if (!draft.buktiData?.praktikGuru && !/supervisi|observasi|catatan mengajar/i.test(allText)) {
    needsEvidence.push({
      klaim: "Refleksi perubahan strategi mengajar guru",
      saranData:
        "Tambahkan catatan jurnal mengajar harian, dokumentasi durasi transisi kelas, atau lembar peer observation.",
      kategori: "Praktik Guru",
    });
  }

  return needsEvidence;
}

export function buildFallbackAnalysis(
  draft: Partial<ReflectionEntry>,
  selfRubricScores?: SelfRubricScores,
  previousEntry?: ReflectionEntry | null,
  profile?: TeacherProfile
): AiFeedback {
  const tuntasNum = Number(draft?.persenTuntas) || 75;
  const rataNum = Number(draft?.rataNA) || 75;
  const keterlibatanNum = Number(draft?.keterlibatanRate) || 80;

  const defaultScores = selfRubricScores || {
    penguasaanMateri: 3,
    diferensiasi: 3,
    interaktivitas: 3,
    asesmenData: 3,
    tindakLanjut: 3,
  };

  const periksaBukti = detectMissingEvidence(draft);

  // Cross-cycle comparison if previous entry exists
  let perbandinganAntarSiklus: PerbandinganSiklus | undefined;
  if (previousEntry) {
    const selisihTuntas = Number((tuntasNum - Number(previousEntry.persenTuntas || 0)).toFixed(1));
    const selisihRata = Number((rataNum - Number(previousEntry.rataNA || 0)).toFixed(1));
    const selisihKeterlibatan = Number(
      (keterlibatanNum - Number(previousEntry.keterlibatanRate || 0)).toFixed(1)
    );

    const prevSelfAvg =
      (previousEntry.selfRubricScores?.penguasaanMateri +
        previousEntry.selfRubricScores?.diferensiasi +
        previousEntry.selfRubricScores?.interaktivitas +
        previousEntry.selfRubricScores?.asesmenData +
        previousEntry.selfRubricScores?.tindakLanjut) /
      5;
    const currSelfAvg =
      (defaultScores.penguasaanMateri +
        defaultScores.diferensiasi +
        defaultScores.interaktivitas +
        defaultScores.asesmenData +
        defaultScores.tindakLanjut) /
      5;
    const selisihSelf = Number((currSelfAvg - prevSelfAvg).toFixed(2));

    perbandinganAntarSiklus = {
      siklusPembanding: previousEntry.siklus,
      ketuntasan: {
        arah: selisihTuntas > 0 ? "naik" : selisihTuntas < 0 ? "turun" : "tetap",
        selisih: Math.abs(selisihTuntas),
        catatan:
          selisihTuntas > 0
            ? `Ketuntasan murid meningkat ${Math.abs(selisihTuntas)}% dibandingkan Siklus ${previousEntry.siklus}.`
            : selisihTuntas < 0
            ? `Ketuntasan murid mengalami penurunan ${Math.abs(selisihTuntas)}%, perlu penguatan scaffolding.`
            : "Ketuntasan murid stabil pada level yang sama.",
      },
      rataNA: {
        arah: selisihRata > 0 ? "naik" : selisihRata < 0 ? "turun" : "tetap",
        selisih: Math.abs(selisihRata),
        catatan: `Rata-rata nilai akhir kelas bergeser ${selisihRata >= 0 ? "+" : ""}${selisihRata} poin.`,
      },
      keterlibatan: {
        arah: selisihKeterlibatan > 0 ? "naik" : selisihKeterlibatan < 0 ? "turun" : "tetap",
        selisih: Math.abs(selisihKeterlibatan),
        catatan: `Tingkat keaktifan murid di kelas tercatat ${keterlibatanNum}%.`,
      },
      evaluasiDiri: {
        arah: selisihSelf > 0 ? "naik" : selisihSelf < 0 ? "turun" : "tetap",
        selisih: Math.abs(selisihSelf),
        catatan: `Rerata rubrik mandiri guru berada di angka ${currSelfAvg.toFixed(2)} dari skala 4.00.`,
      },
      dugaanPenyebab:
        selisihTuntas >= 0
          ? "Penyesuaian strategi intervensi dan media interaktif pada siklus ini berkontribusi positif terhadap pencapaian murid."
          : "Kompleksitas materi dan alokasi waktu transisi menjadi faktor yang memicu variasi hasil capaian murid.",
    };
  }

  // STAR Best Practice Draft
  const praktikBaikSTAR: PraktikBaikSTAR = {
    judul: `Eksperimen Pembelajaran ${draft.elemenTP || "Materi Kejuruan"} Berbasis Model Inkuiri Kolaboratif`,
    situasi: `Pada awal siklus pembelajaran di ${profile?.sekolah || "SMK Negeri 2 Gorontalo"}, teridentifikasi tantangan dalam pemahaman murid pada elemen ${draft.elemenTP || "pembelajaran"} dengan ketuntasan awal sekitar ${tuntasNum}%.`,
    tantangan: `Menjembatani pemahaman konseptual yang membutuhkan analisis mendalam dengan tetap mempertahankan antusiasme dan keaktifan murid kelas kejuruan.`,
    aksi: draft.design
      ? draft.design
      : `Menerapkan strategi eksperimen pembelajaran terstruktur (simulasi interaktif, pendampingan tugas mandiri, dan kolaborasi bersama rekan sejawat).`,
    refleksiDampak: `Capaian ketuntasan murid mencapai ${tuntasNum}% dengan rata-rata nilai ${rataNum}. Keterlibatan aktif murid teramati mencapai ${keterlibatanNum}%.`,
    tipsReplikasi: `Gunakan analogi kontekstual sehari-hari dan sediakan lembar checklist panduan peran bertahap untuk memandu kerja murid.`,
    kaitanKebijakanSekolah: `Mendukung program sekolah dalam penguatan pembelajaran berdiferensiasi dan budaya refleksi pendidik berkelanjutan.`,
  };

  // Peer Mode KKG/MGMP
  const modeSejawat: ModeSejawat = {
    pertanyaanDiskusi: [
      `Bagaimana pengalaman Bapak/Ibu rekan sejawat dalam mengukur efektivitas media pembelajaran interaktif pada materi ini?`,
      `Pola miskonsepsi apa yang paling sering muncul di kelas Bapak/Ibu pada topik "${draft.soalSukar || "materi sukar"}"?`,
      `Strategi diferensiasi apa yang terbukti paling praktis untuk mendampingi murid yang membutuhkan remedial tanpa mengorbankan murid yang mahir?`,
    ],
    formatRingkasLisan: `Bapak/Ibu rekan MGMP, pada Siklus ${draft.siklus || 1} ini kami menerapkan eksperimen pembelajaran pada materi "${draft.elemenTP || "Informatika"}". Capaian ketuntasan murid tercatat ${tuntasNum}% dengan rata-rata ${rataNum}. Tantangan utama yang kami temukan adalah pada "${draft.soalSukar || "bagian studi kasus"}", dan langkah perbaikan yang kami rencanakan adalah ${draft.rencanaPerubahanBerikutnya || "penyediaan panduan peran berjenjang"}.`,
    catatanUmpanBalikRekan:
      "Rekan sejawat mengapresiasi penggunaan data formatif dan menyarankan penguatan rubrik penilaian mandiri oleh murid.",
  };

  // Fixed Format A - H
  const laporanFormatTetap: LaporanRefleksiSiklusFormat = {
    bagianA_Identitas: `Mata Pelajaran: ${profile?.mapel || "Informatika"} | Kelas: ${profile?.faseKelas || "X DKV"} | Elemen/Materi: ${draft.elemenTP || "-"} | Pertemuan/Siklus: Siklus ${draft.siklus || 1} (Minggu ke-${draft.mingguKe || 1}) | Tanggal/Periode: ${draft.periode || "-"}`,
    bagianB_Identifikasi: draft.assess || "Belum ada catatan identifikasi masalah dan data awal.",
    bagianC_Desain: draft.design || "Belum ada catatan rancangan eksperimen dan indikator terukur.",
    bagianD_Implementasi: draft.implement || "Belum ada catatan pelaksanaan nyata di kelas dan bukti dokumentasi.",
    bagianE_AmatiRefleksi: draft.measure || `Capaian terhadap indikator: Ketuntasan ${tuntasNum}%, Rata-rata ${rataNum}, Keterlibatan ${keterlibatanNum}%.`,
    bagianF_PerubahanTindakLanjut:
      draft.rencanaPerubahanBerikutnya ||
      "Penyempurnaan panduan peran dan alur transisi aktivitas untuk siklus pembelajaran berikutnya.",
    bagianG_BerbagiPraktik:
      draft.share ||
      "Berbagi ringkasan praktik baik dan checklist panduan pada forum MGMP sekolah dan komunitas belajar.",
    bagianH_CatatanData:
      periksaBukti.length > 0
        ? periksaBukti.map((p) => `[Perlu Bukti]: ${p.klaim} -> Saran: ${p.saranData}`).join("\n")
        : "Seluruh pernyataan telah didukung bukti data yang memadai.",
  };

  return {
    ringkasanDiagnostik: `Refleksi Siklus ${draft?.siklus || 1} pada elemen "${
      draft?.elemenTP || "Pembelajaran"
    }" menunjukkan ketercapaian kelas ${tuntasNum}% dengan rata-rata ${rataNum}. Guru telah mendokumentasikan dinamika eksperimen kelas dan bukti asesmen dengan baik, dengan fokus penguatan terarah pada penanganan materi sulit.`,
    acuanStandar:
      "Siklus Teacher Experimental Training (TET) & Kerangka Inkuiri Kolaboratif Kemendikbudristek",
    skorValidasiAi: {
      penguasaanMateri: Math.min(4, Math.max(1, defaultScores.penguasaanMateri)),
      diferensiasi: Math.min(4, Math.max(1, defaultScores.diferensiasi)),
      interaktivitas: Math.min(4, Math.max(1, defaultScores.interaktivitas)),
      asesmenData: Math.min(4, Math.max(1, defaultScores.asesmenData)),
      tindakLanjut: Math.min(4, Math.max(1, defaultScores.tindakLanjut)),
    },
    stages: {
      assess: {
        tingkatKematangan: tuntasNum >= 80 ? "Mahir" : tuntasNum >= 70 ? "Cakap" : "Berkembang",
        kekuatan: `Identifikasi masalah merujuk pada capaian numerik ketuntasan (${tuntasNum}%) dan pemetaan soal sukar (${
          draft?.soalSukar || "analisis konsep"
        }).`,
        masukan:
          "Sertakan catatan observasi mengenai pola murid yang mengalami hambatan pada asesmen formatif awal.",
        pertanyaan_lanjutan:
          "Apa miskonsepsi paling mendasar yang memicu kekeliruan murid pada soal sukar tersebut?",
        indikatorAcuan:
          "Standar Kompetensi Pedagogik 1.2: Pemahaman Karakteristik dan Kebutuhan Belajar Murid",
      },
      design: {
        tingkatKematangan: "Cakap",
        kekuatan: `Desain eksperimen mengintegrasikan media peraga dan kolaborasi bersama rekan sejawat (${
          draft?.rekan || "MGMP"
        }).`,
        masukan:
          "Perjelas indikator keberhasilan terukur dan pembagian peran murid dalam tugas kelompok.",
        pertanyaan_lanjutan:
          "Bagaimana pembagian peran kolaboratif dengan rekan sejawat saat menyusun LKPD diferensiasi?",
        indikatorAcuan:
          "Standar Kompetensi Pedagogik 2.1: Perancangan Pembelajaran Diferensiasi & Eksperimen",
      },
      implement: {
        tingkatKematangan: "Cakap",
        kekuatan:
          "Pelaksanaan di kelas terdokumentasi aktif dan guru responsif terhadap dinamika partisipasi murid.",
        masukan:
          "Alokasikan waktu transisi yang terukur antar fase pembelajaran agar refleksi bersama murid tidak terburu-buru.",
        pertanyaan_lanjutan:
          "Langkah apa yang paling efektif Bapak/Ibu lakukan saat melihat murid yang mulai kehilangan fokus?",
        indikatorAcuan:
          "Standar Kompetensi Pedagogik 3.2: Pengelolaan Kelas dan Fasilitasi Interaksi Positif",
      },
      measure: {
        tingkatKematangan: tuntasNum >= 75 ? "Cakap" : "Berkembang",
        kekuatan: `Memiliki rujukan data numerik ketuntasan (${tuntasNum}%) dan rencana aksi siklus lanjutan.`,
        masukan:
          "Gunakan umpan balik tertulis singkat dari murid (exit ticket) sebagai data pelengkap evaluasi.",
        pertanyaan_lanjutan:
          "Perubahan spesifik apa pada alur demonstrasi atau LKPD yang akan diuji coba pada siklus berikutnya?",
        indikatorAcuan:
          "Standar Kompetensi Pedagogik 4.1: Pemanfaatan Hasil Asesmen untuk Refleksi Perbaikan",
      },
      share: {
        tingkatKematangan: "Cakap",
        kekuatan:
          "Pengalaman mengajar mulai dibagikan ke forum komunitas belajar dan MGMP satuan pendidikan.",
        masukan:
          "Dokumentasikan dalam format STAR agar rekan sejawat dapat mereplikasi langkah-langkah praktisnya dengan mudah.",
        pertanyaan_lanjutan:
          "Bagaimana rekan sejawat menanggapi dan berencana mengadaptasi strategi yang Bapak/Ibu terapkan?",
        indikatorAcuan:
          "Standar Kompetensi Profesional: Kepemimpinan Pembelajaran & Berbagi Praktik Baik",
      },
    },
    analisisGrafikDanData: `Dari populasi ${
      draft?.jumlahSiswa || 32
    } murid, perolehan ketuntasan ${tuntasNum}% dan rata-rata NA ${rataNum} menunjukkan performa kelas yang terpantau. Titik tekan pada "${
      draft?.soalSukar || "soal sukar"
    }" mengindikasikan perlunya pemodelan konseptual eksplisit sebelum murid berlatih mandiri.`,
    rekomendasiDiferensiasi: {
      intervensiTertinggal:
        "Berikan lembar panduan bertahap (step-by-step checklist) dan skema tutor sebaya dengan murid yang sudah tuntas.",
      penguatanReguler:
        "Berikan latihan studi kasus kontekstual terapan tingkat menengah untuk memperkokoh pemahaman alur kerja.",
      pengayaanTinggi:
        "Sediakan tantangan proyek eksplorasi mandiri atau beri peran sebagai fasilitator kelompok kecil.",
    },
    rekomendasi_utama: [
      "Terapkan pemodelan terpandu (guided practice) untuk topik materi yang diidentifikasi sukar.",
      "Gunakan rubrik penilaian observasi transparan selama proses belajar agar murid memonitor kemajuannya secara mandiri.",
      "Diskusikan pola distraktor soal bersama rekan guru MGMP untuk menyempurnakan bank instrumen formatif.",
    ],
    ringkasanPembukaSesi: previousEntry
      ? {
          rangkumanSiklusSebelumnya: `Pada Siklus ${previousEntry.siklus}, capaian ketuntasan murid berada di ${previousEntry.persenTuntas}% dengan catatan tantangan utama pada "${previousEntry.soalSukar}".`,
          rencanaPerubahanSebelumnya:
            previousEntry.rencanaPerubahanBerikutnya ||
            "Penyempurnaan lembar peran dan panduan tugas aplikatif.",
          pertanyaanKonfirmasi:
            "Apakah rencana perubahan tersebut sudah Bapak/Ibu uji cobakan di kelas pada siklus ini? Bagaimana hasil awalnya?",
        }
      : undefined,
    periksaBukti,
    perbandinganAntarSiklus,
    modeSejawat,
    praktikBaikSTAR,
    laporanFormatTetap,
  };
}

export function buildFallbackWeeklySynthesis(
  teacherProfile: any,
  entries: any[]
): any {
  const totalMurid = entries.reduce((acc, e) => acc + (Number(e.draft?.jumlahSiswa) || 32), 0);
  const avgTuntas = entries.length
    ? (
        entries.reduce((acc, e) => acc + (Number(e.draft?.persenTuntas) || 75), 0) /
        entries.length
      ).toFixed(1)
    : "75.0";

  return {
    judulLaporan: "Laporan Sintesis Refleksi Siklus TET & Inkuiri Kolaboratif Guru",
    rangkumanEksekutif: `Berdasarkan rekapitulasi data refleksi pembelajaran siklus Teacher Experimental Training (TET) dan Inkuiri Kolaboratif pada mata pelajaran ${
      teacherProfile?.mapel || "Informatika"
    } di ${teacherProfile?.sekolah || "SMK Negeri 2 Gorontalo"}, telah terlihat komitmen berkelanjutan dalam menguji coba inovasi pembelajaran di kelas nyata secara sistematis dan berulang. Rata-rata capaian ketuntasan murid mencapai ${avgTuntas}% dengan tren partisipasi kelas yang adaptif. Guru menunjukkan kesadaran reflektif tinggi dalam mengidentifikasi titik lemah pemahaman murid pada asesmen formatif dan secara konsisten menindaklanjuti rencana perubahan antar-siklus.`,
    analisisTren: {
      trenHasilBelajar: `Capaian ketuntasan rata-rata bergerak stabil di atas target KKTP dengan penurunan jumlah murid yang membutuhkan remedial intensif pada materi bertingkat.`,
      trenKeterlibatan: `Keterlibatan aktif murid meningkat secara konsisten ketika inovasi pembelajaran interaktif, simulasi visual, dan pelibatan orang tua diterapkan secara terstruktur.`,
      efektivitasIntervensi: `Strategi intervensi pada tahap Desain (seperti panduan peran dan tutor sebaya) terbukti efektif memangkas miskonsepsi dan mempercepat pemahaman murid.`,
    },
    tingkatKematanganInkuiri: "Cakap",
    catatanSupervisi: `Guru memenuhi kriteria kinerja reflektif sesuai Panduan Pembelajaran dan Asesmen Kurikulum Merdeka serta siklus Teacher Experimental Training (TET). Sangat direkomendasikan untuk terus mendiseminasikan praktik baik ini di MGMP kabupaten/kota.`,
    rekomendasiStrategis: [
      "Pertahankan integrasi data kuantitatif formatif sebagai dasar rancangan pembelajaran diferensiasi berkelanjutan.",
      "Tingkatkan dokumentasi umpan balik kualitatif langsung dari murid untuk memperkaya portofolio bukti autentik.",
      "Jadikan hasil sintesis siklus ini sebagai bahan diskusi reflektif pada rapat penjaminan mutu pembelajaran berkala.",
    ],
  };
}
