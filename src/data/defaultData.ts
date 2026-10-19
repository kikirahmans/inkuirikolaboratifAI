import { TeacherProfile, ReflectionEntry } from "../types";

export const DEFAULT_PROFILE: TeacherProfile = {
  nama: "Abdul Bahsoan, S.Kom., Gr.",
  nip: "19880512 201101 1 008",
  sekolah: "SMK Negeri 2 Gorontalo",
  mapel: "Informatika (Berpikir Komputasional & KKA)",
  faseKelas: "Fase E - Kelas X Desain Komunikasi Visual (DKV)",
  semester: "Ganjil",
  tahunAjaran: "2026/2027",
  praktikBaikInovasi: "Huyula Digital (Pembelajaran Berpikir Komputasional dengan Papan Interaktif Digital, gim kolaboratif, penugasan aplikatif bersama orang tua, dan infografis murid)",
};

export const INITIAL_REFLECTIONS: ReflectionEntry[] = [
  {
    id: "ref-siklus-1",
    savedAt: "2026-08-22T14:30:00.000Z",
    mingguKe: 1,
    siklus: 1,
    periode: "18 - 22 Agustus 2026",
    elemenTP: "Berpikir Komputasional: Dekomposisi & Abstraksi Logika dalam Desain Visual",
    rekan: "MGMP Informatika & Guru Produktif DKV SMK Negeri 2 Gorontalo",
    jumlahSiswa: 32, // murid
    rataNA: 71.5,
    kktp: 75,
    persenTuntas: 68.75,
    keterlibatanRate: 72,
    soalSukar: "Soal 4 (Studi Kasus Penataan Alur Kerja Layer Desain & Dekomposisi Logika)",

    // 5 Tahap TET & Inkuiri Kolaboratif
    assess: "Dari data asesmen formatif awal, 10 dari 32 murid (31.25%) belum mencapai kriteria ketuntasan (KKTP). Pola masalah paling menonjol: murid kelas X DKV cepat kehilangan minat dan bingung saat materi logika disajikan secara murni teoritis tanpa kaitan dengan konteks visual. Catatan observasi kelas menunjukkan murid pasif pada 25 menit pertama.",
    design: "Merumuskan inovasi 'Huyula Digital' berbasis kearifan lokal gotong-royong Gorontalo. Strategi: simulasi unplugged kartu alur logika, pengenalan gim kuis interaktif di Papan Interaktif Digital, dan tugas aplikatif sederhana dengan pendampingan orang tua di rumah. Indikator keberhasilan: minimal 75% murid tuntas dan tingkat keterlibatan aktif kelas mencapai >80%. Instrumen: lembar observasi dan Google Classroom.",
    implement: "Eksperimen kartu unplugged dan gim di Papan Interaktif Digital dijalankan. Murid sangat antusias saat berebut menjawab di layar interaktif. Namun, transisi dari permainan ke pembuatan infografis mandiri memakan waktu lebih lama dari alokasi, dan 6 murid belum mengunggah tugas bersama orang tua tepat waktu.",
    measure: "Capaian ketuntasan berada di angka 68.75% dengan rata-rata nilai 71.5. Tantangan terbesar adalah manajemen waktu transisi aktivitas dan scaffolding penjelasan tugas bersama orang tua. Pada siklus 2, direncanakan penambahan lembar panduan peran yang lebih jelas dan instruksi visual terstruktur.",
    share: "Mempresentasikan temuan awal penggunaan Papan Interaktif Digital pada pertemuan rutin MGMP Informatika SMK Negeri 2 Gorontalo. Rekan guru DKV tertarik mengadaptasi analogi kartu logika untuk mata pelajaran Komposisi Pola Visual.",

    // 6 Kategori Bukti Data
    buktiData: {
      hasilBelajar: "Nilai formatif 1: 22 dari 32 murid tuntas (68.75%), rata-rata nilai 71.5. Produk infografis tahap draf telah terkumpul 26 berkas.",
      keterlibatanMurid: "Partisipasi gim interaktif mencapai 85%, namun keaktifan bertanya pada sesi refleksi mandiri baru sekitar 55%.",
      praktikGuru: "Catatan jurnal mengajar: waktu tersita 15 menit pada persiapan teknis layar interaktif di awal jam.",
      keterlibatanOrangTua: "26 dari 32 orang tua menandatangani lembar konfirmasi tugas aplikatif di rumah; 6 orang tua terkendala shift kerja.",
      prosesDigital: "Log Classroom: 26 berkas tugas diunggah, 6 revisi umpan balik digital diberikan sebelum batas waktu.",
      umpanBalikSejawat: "Masukan dari Ibu Aminah (Guru DKV): sertakan rubrik visual agar murid paham kriteria layout infografis.",
    },

    rencanaPerubahanBerikutnya: "Menyediakan lembar panduan peran (scaffolding visual) dan menyederhanakan petunjuk tugas orang tua.",
    indikatorPemantauan: "Persentase ketuntasan tugas orang tua mencapai >85% dan pengurangan waktu transisi menjadi maksimal 5 menit.",

    selfRubricScores: {
      penguasaanMateri: 3.2,
      diferensiasi: 2.8,
      interaktivitas: 3.1,
      asesmenData: 3.4,
      tindakLanjut: 2.9,
    },

    aiFeedback: {
      ringkasanDiagnostik: "Refleksi Siklus 1 berhasil mengidentifikasi akar kebingungan murid pada logika abstrak melalui data formatif nyata (68.75% tuntas). Desain strategi 'Huyula Digital' kontekstual dan relevan untuk karakteristik murid SMK DKV.",
      acuanStandar: "Panduan Pembelajaran & Asesmen (PPA) Kurikulum Merdeka & Model Siklus Teacher Experimental Training (TET)",
      skorValidasiAi: {
        penguasaanMateri: 3.3,
        diferensiasi: 2.9,
        interaktivitas: 3.2,
        asesmenData: 3.5,
        tindakLanjut: 3.0,
      },
      stages: {
        assess: {
          tingkatKematangan: "Cakap",
          kekuatan: "Data kondisi awal berbasis bukti numerik (10 dari 32 murid belum tuntas) dan menemukan pola kejenuhan teori abstrak.",
          masukan: "Tambahkan catatan asesmen diagnostik gaya belajar untuk mempertajam pemetaan kelompok murid.",
          pertanyaan_lanjutan: "Apakah murid yang pasif memiliki hambatan literasi digital atau pemahaman studi kasus?",
          indikatorAcuan: "Standar Kompetensi Pedagogik 1.2: Pemahaman Karakteristik dan Kebutuhan Murid",
        },
        design: {
          tingkatKematangan: "Cakap",
          kekuatan: "Inovasi Huyula Digital memadukan kearifan lokal gotong royong dengan Papan Interaktif Digital dan pelibatan orang tua.",
          masukan: "Perjelas rubrik panduan peran dan alokasi waktu transisi antar fase eksperimen.",
          pertanyaan_lanjutan: "Bagaimana pembagian peran murid saat berkelompok di depan Papan Interaktif?",
          indikatorAcuan: "Standar Kompetensi Pedagogik 2.1: Perancangan Pembelajaran Kontekstual & Inovatif",
        },
        implement: {
          tingkatKematangan: "Berkembang",
          kekuatan: "Dinamika kelas hidup dan partisipasi gim interaktif mencapai 85%.",
          masukan: "Siapkan antisipasi kendala teknis dan penyederhanaan instruksi tugas rumah bagi orang tua.",
          pertanyaan_lanjutan: "Apa langkah cepat guru ketika melihat 6 murid belum mengumpulkan tugas bersama orang tua?",
          indikatorAcuan: "Standar Kompetensi Pedagogik 3.2: Pengelolaan Kelas dan Fasilitasi Interaksi Positif",
        },
        measure: {
          tingkatKematangan: "Cakap",
          kekuatan: "Evaluasi jujur terhadap kendala manajemen waktu dan identifikasi rencana perubahan siklus 2.",
          masukan: "Gunakan exit ticket 2 menit di akhir sesi untuk merekam umpan balik langsung dari murid.",
          pertanyaan_lanjutan: "Perubahan spesifik apa pada LKPD yang akan diuji coba pada siklus berikutnya?",
          indikatorAcuan: "Standar Kompetensi Pedagogik 4.1: Pemanfaatan Hasil Asesmen untuk Refleksi Perbaikan",
        },
        share: {
          tingkatKematangan: "Cakap",
          kekuatan: "Praktik baik telah dipaparkan pada forum MGMP Informatika dan direspons positif oleh guru DKV.",
          masukan: "Susun draf dokumentasi STAR agar mudah direplikasi oleh sekolah kejuruan lain.",
          pertanyaan_lanjutan: "Bagaimana respons kepala sekolah terhadap integrasi pelibatan orang tua dalam tugas digital?",
          indikatorAcuan: "Standar Kompetensi Sosial & Profesional: Berbagi Praktik Baik di Komunitas Belajar",
        },
      },
      rekomendasi_utama: [
        "Sediakan lembar panduan peran (checklist) untuk mempercepat transisi murid dari gim ke tugas mandiri.",
        "Komunikasikan panduan tugas aplikatif kepada orang tua lewat grup pesan singkat dengan infografis panduan ringkas.",
        "Tindak lanjuti rencana perubahan pada siklus berikutnya dengan memantau ketuntasan kelompok 10 murid bimbingan intensif."
      ],
      periksaBukti: [
        {
          klaim: "Murid sangat antusias saat berebut menjawab di layar interaktif.",
          saranData: "Sertakan catatan observasi jumlah murid yang aktif mencoba layar atau persentase skor gim kelas.",
          kategori: "Keterlibatan Murid",
        },
      ],
      praktikBaikSTAR: {
        judul: "Penerapan Huyula Digital untuk Meningkatkan Pemahaman Berpikir Komputasional Murid DKV",
        situasi: "Murid kelas X DKV SMK Negeri 2 Gorontalo mengalami kendala memahami logika berpikir komputasional yang abstrak (ketuntasan awal hanya 68.75%).",
        tantangan: "Menjembatani konsep logika algoritmik yang kaku dengan minat estetika murid DKV serta keterbatasan waktu latihan interaktif di kelas.",
        aksi: "Mengembangkan inovasi 'Huyula Digital' dengan memadukan simulasi unplugged kartu logika, gim Papan Interaktif Digital, dan tugas infografis berbasis dialog orang tua.",
        refleksiDampak: "Keterlibatan kelas melonjak ke 72%, antusiasme murid meningkat tajam, dan pemahaman logika mulai terhubung dengan karya visual infografis.",
        tipsReplikasi: "Gunakan analogi visual kehidupan sehari-hari (misal: urutan meramu warna atau layering gambar) sebelum mengenalkan logika percabangan.",
        kaitanKebijakanSekolah: "Selaras dengan program SMK Pusat Keunggulan dalam Penguatan Pembelajaran Berbasis Digital dan Kemitraan Keluarga.",
      },
      modeSejawat: {
        pertanyaanDiskusi: [
          "Bagaimana strategi rekan guru lain mengaitkan materi logika dengan kejuruan non-teknik seperti DKV?",
          "Apa bentuk pendampingan yang paling ramah waktu bagi orang tua murid SMK dalam tugas rumah berbasis aplikasi?",
          "Apakah ada rekan yang ingin mencoba instrumen lembar panduan peran Huyula Digital pada mapel kejuruan?",
        ],
        formatRingkasLisan: "Bapak/Ibu rekan sejawat, pada siklus 1 pembelajaran Berpikir Komputasional kelas X DKV, kami menguji coba pendekatan 'Huyula Digital' menggunakan Papan Interaktif. Capaian ketuntasan 68.75% dengan catatan murid sangat antusias pada simulasi visual namun memerlukan scaffolding bertahap saat koding mandiri.",
        catatanUmpanBalikRekan: "Guru DKV menyarankan template infografis disesuaikan dengan standar portofolio kejuruan.",
      },
    },
    status: "final",
  },
  {
    id: "ref-siklus-2",
    savedAt: "2026-08-29T15:10:00.000Z",
    mingguKe: 2,
    siklus: 2,
    periode: "25 - 29 Agustus 2026",
    elemenTP: "Berpikir Komputasional: Pengenalan Pola & Algoritma Percabangan Logika",
    rekan: "MGMP Informatika & Wali Kelas X DKV",
    jumlahSiswa: 32,
    rataNA: 78.2,
    kktp: 75,
    persenTuntas: 81.25,
    keterlibatanRate: 84,
    soalSukar: "Soal 3 (Pola Kondisi Majemuk AND/OR pada Penentuan Skema Warna Otomatis)",

    // 5 Tahap TET & Inkuiri Kolaboratif
    assess: "Menindaklanjuti temuan siklus 1: Dari 10 murid yang belum tuntas di siklus 1, 7 murid telah menunjukkan kemajuan setelah diberikan remedial kartu logika. Namun, pada topik baru (Pengenalan Pola & Percabangan), data kuis formatif menunjukkan 6 murid masih bingung membedakan kondisi majemuk AND dan OR saat diterapkan dalam studi kasus skema warna.",
    design: "Menerapkan rencana perubahan dari siklus 1: Menyediakan 'Checklist Peran Huyula Digital' berjenjang dan panduan infografis 1 lembar untuk orang tua. Menggunakan simulasi gim interaktif tebak warna logika di Papan Interaktif Digital, di mana murid bekerja secara berpasangan (tutor sebaya). Target: ketuntasan mencapai >80% dan keterlibatan murid >80%.",
    implement: "Eksperimen di kelas berjalan jauh lebih tertib dan efisien. Waktu transisi berhasil dipangkas menjadi hanya 4 menit berkat checklist peran. Sebanyak 30 dari 32 orang tua (93.75%) berhasil mengirimkan konfirmasi pendampingan murid di rumah melalui Google Classroom. Pendampingan peer observation dilakukan bersama Ibu Aminah (rekan guru).",
    measure: "Capaian ketuntasan meningkat signifikan menjadi 81.25% (26 dari 32 murid tuntas) dan rata-rata kelas naik ke 78.2. Keterlibatan murid mencapai 84%. Analisis data menunjukkan strategi tutor sebaya dan panduan peran sangat efektif memangkas kebingungan. Tantangan tersisa: 6 murid yang belum tuntas membutuhkan visualisasi bercabang pohon (decision tree) yang lebih konkret.",
    share: "Membagikan lembar checklist peran Huyula Digital dan rubrik infografis kepada 5 guru anggota MGMP Informatika Kabupaten/Kota. Dua guru telah mengadaptasi format tersebut untuk materi Algoritma di SMK tetangga.",

    buktiData: {
      hasilBelajar: "Nilai formatif 2: 26 dari 32 murid tuntas (81.25%), rata-rata nilai 78.2 (+6.7 poin dari siklus 1). Seluruh 32 murid mengumpulkan draf karya infografis percabangan logika.",
      keterlibatanMurid: "Tingkat keterlibatan kelas 84% berdasarkan lembar observasi rekan sejawat. Partisipasi menjawab kuis interaktif mencapai 92%.",
      praktikGuru: "Hasil observasi rekan sejawat: waktu transisi efisien (4 menit), interaksi umpan balik positif guru meningkat tajam.",
      keterlibatanOrangTua: "30 dari 32 orang tua (93.75%) menandatangani dan memberikan komentar apresiasi pada tugas murid di Classroom.",
      prosesDigital: "Log Google Classroom menunjukkan 100% murid mengakses modul interaktif sebelum hari pembelajaran.",
      umpanBalikSejawat: "Catatan peer observation: 'Model tutor sebaya di depan Papan Interaktif membuat murid yang pemalu ikut aktif berbicara'.",
    },

    rencanaPerubahanBerikutnya: "Menambahkan visualisasi decision tree (pohon keputusan interaktif) dan fitur studi kasus bertingkat untuk pengayaan murid yang sudah mahir.",
    indikatorPemantauan: "Ketuntasan mencapai >85% dan murid berkategori mahir mampu menghasilkan modul mini untuk temannya.",

    selfRubricScores: {
      penguasaanMateri: 3.6,
      diferensiasi: 3.4,
      interaktivitas: 3.7,
      asesmenData: 3.6,
      tindakLanjut: 3.5,
    },

    aiFeedback: {
      ringkasanDiagnostik: "Refleksi Siklus 2 membuktikan keberhasilan siklus iteratif TET. Rencana perubahan dari siklus 1 (lembar peran & pelibatan orang tua) secara empiris mendongkrak ketuntasan murid dari 68.75% menjadi 81.25% (+12.5%).",
      acuanStandar: "Perdirjen GTK No. 2626/B/HK.04.01/2023 & Kerangka Kerja Inkuiri Kolaboratif Kemendikbudristek",
      skorValidasiAi: {
        penguasaanMateri: 3.6,
        diferensiasi: 3.4,
        interaktivitas: 3.8,
        asesmenData: 3.7,
        tindakLanjut: 3.6,
      },
      stages: {
        assess: {
          tingkatKematangan: "Mahir",
          kekuatan: "Re-identifikasi yang sangat mulus menghubungkan hasil remedial siklus 1 dengan identifikasi masalah baru (6 murid pada kondisi AND/OR).",
          masukan: "Pertahankan ketajaman data komparatif awal seperti ini untuk siklus-siklus berikutnya.",
          pertanyaan_lanjutan: "Apakah kekeliruan kondisi AND/OR terkait pemahaman logika matematika dasar atau aplikasi visualnya?",
          indikatorAcuan: "Standar Kompetensi Pedagogik 1.2: Asesmen Diagnostik Berkelanjutan",
        },
        design: {
          tingkatKematangan: "Mahir",
          kekuatan: "Solusi eksperimen menindaklanjuti data siklus sebelumnya dengan checklist peran, tutor sebaya, dan komunikasi ramah orang tua.",
          masukan: "Siapkan alternatif tugas pengayaan bagi murid yang menyelesaikan latihan lebih cepat.",
          pertanyaan_lanjutan: "Bagaimana kriteria penentuan pasangan tutor sebaya agar prosesnya saling memberdayakan?",
          indikatorAcuan: "Standar Kompetensi Pedagogik 2.1: Desain Eksperimen Pembelajaran Berbasis Data",
        },
        implement: {
          tingkatKematangan: "Cakap",
          kekuatan: "Peningkatan efisiensi waktu transisi menjadi 4 menit dan keterlibatan orang tua menembus 93.75%. Adanya peer observation memperkuat validitas.",
          masukan: "Dokumentasikan momen diskusi tutor sebaya dengan rekaman singkat sebagai bukti autentik.",
          pertanyaan_lanjutan: "Apa kendala yang dialami 2 orang tua yang belum mengumpulkan tugas?",
          indikatorAcuan: "Standar Kompetensi Pedagogik 3.2: Fasilitasi Kolaborasi dan Iklim Belajar Positif",
        },
        measure: {
          tingkatKematangan: "Mahir",
          kekuatan: "Analisis dampak jelas dengan bukti kenaikan numerik (+12.5% ketuntasan) dan perumusan rencana perubahan siklus 3 (pohon keputusan).",
          masukan: "Kaitkan capaian ini dengan target KKTP semester sekolah.",
          pertanyaan_lanjutan: "Bagaimana strategi khusus untuk 6 murid yang masih memerlukan pendampingan pohon keputusan?",
          indikatorAcuan: "Standar Kompetensi Pedagogik 4.1: Evaluasi & Tindak Lanjut Berkelanjutan",
        },
        share: {
          tingkatKematangan: "Mahir",
          kekuatan: "Telah dibagikan ke 5 guru MGMP dan direplikasi oleh 2 guru di sekolah kejuruan lain.",
          masukan: "Susun artikel ilmiah populer atau modul mini praktik baik untuk diseminasi tingkat provinsi.",
          pertanyaan_lanjutan: "Bagaimana tanggapan guru sekolah lain setelah mereplikasi format checklist ini?",
          indikatorAcuan: "Standar Kompetensi Sosial & Profesional: Kepemimpinan Pembelajaran (Instructional Leadership)",
        },
      },
      rekomendasi_utama: [
        "Kembangkan media visual pohon keputusan (decision tree) untuk siklus 3 guna menuntaskan 6 murid yang masih ragu pada kondisi majemuk.",
        "Pertahankan kolaborasi peer observation bersama rekan sejawat karena terbukti memberikan umpan balik objektif.",
        "Dokumentasikan infografis terbaik karya murid sebagai portofolio pameran karya digital SMK."
      ],
      periksaBukti: [],
      perbandinganAntarSiklus: {
        siklusPembanding: 1,
        ketuntasan: { arah: "naik", selisih: 12.5, catatan: "Ketuntasan murid melonjak dari 68.75% ke 81.25% (+12.5%) melampaui ambang KKTP 75%." },
        rataNA: { arah: "naik", selisih: 6.7, catatan: "Rata-rata nilai akhir kelas meningkat dari 71.5 menjadi 78.2 (+6.7 poin)." },
        keterlibatan: { arah: "naik", selisih: 12.0, catatan: "Keterlibatan aktif murid naik dari 72% ke 84% dengan efisiensi waktu transisi." },
        evaluasiDiri: { arah: "naik", selisih: 0.5, catatan: "Skor evaluasi mandiri guru meningkat dari 3.08 ke 3.56 seiring keberhasilan strategi intervensi." },
        dugaanPenyebab: "Penerapan checklist peran Huyula Digital dan skema tutor sebaya secara efektif meminimalisir waktu terbuang dan mempercepat transfer pemahaman murid.",
      },
      praktikBaikSTAR: {
        judul: "Peningkatan Pemahaman Percabangan Logika Berpikir Komputasional melalui Tutor Sebaya Huyula Digital",
        situasi: "Pada awal pembelajaran logika percabangan di kelas X DKV, murid mengalami kesulitan memahami kondisi majemuk AND/OR.",
        tantangan: "Memfasilitasi pemahaman logika tingkat analisis tanpa membuat murid yang belum menguasai konsep merasa tertinggal atau minder.",
        aksi: "Mengaktifkan model tutor sebaya di depan Papan Interaktif Digital berbantuan 'Checklist Peran Huyula Digital' serta panduan infografis komunikatif untuk orang tua murid.",
        refleksiDampak: "Ketuntasan murid mencapai 81.25% (naik 12.5%), pelibatan orang tua mencapai 93.75%, dan suasana kelas menjadi jauh lebih kolaboratif dan saling mendukung.",
        tipsReplikasi: "Pasangkan murid yang berkemampuan analitis tinggi dengan murid yang memiliki daya imajinasi visual kuat agar saling melengkapi saat memecahkan studi kasus.",
        kaitanKebijakanSekolah: "Mendukung implementasi Kurikulum Merdeka dalam pembelajaran berdiferensiasi dan penguatan iklim belajar gotong royong.",
      },
      modeSejawat: {
        pertanyaanDiskusi: [
          "Bagaimana rekan guru mengelola dinamika tutor sebaya agar murid yang menjadi tutor tidak merasa terbebani?",
          "Apakah Papan Interaktif Digital dapat dimanfaatkan untuk penilaian formatif berbasis gim di mapel kejuruan lain?",
          "Bagaimana kiat mempertahankan konsistensi orang tua dalam mendampingi tugas digital murid SMK?",
        ],
        formatRingkasLisan: "Bapak/Ibu rekan sejawat MGMP, pada Siklus 2 ini alhamdulillah terjadi lonjakan ketuntasan dari 68.75% menjadi 81.25%. Kuncinya adalah penyederhanaan instruksi menggunakan checklist peran dan pelibatan aktif orang tua yang mencapai 93.75%.",
        catatanUmpanBalikRekan: "Ketua MGMP menyarankan agar praktik baik ini dipresentasikan pada lokakarya guru kejuruan tingkat kota.",
      },
    },
    status: "final",
  },
];
