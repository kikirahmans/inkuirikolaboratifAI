import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import { TeacherProfile, ReflectionEntry, ChatMessage } from "../types";

interface AiFacilitatorChatProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TeacherProfile;
  currentDraft: ReflectionEntry;
  onApplyUpdates: (updates: Partial<ReflectionEntry>) => void;
}

const STAGE_TITLES = [
  "Tahap 1: Identifikasi (Assess)",
  "Tahap 2: Desain (Design)",
  "Tahap 3: Implementasi (Implement)",
  "Tahap 4: Amati dan Refleksi (Measure-Reflect-Change)",
  "Tahap 5: Berbagi Praktik Baik",
];

export const AiFacilitatorChat: React.FC<AiFacilitatorChatProps> = ({
  isOpen,
  onClose,
  profile,
  currentDraft,
  onApplyUpdates,
}) => {
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "msg-welcome",
      sender: "ai",
      tahapAktif: 1,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      text: `Selamat datang, Bapak/Ibu ${profile.nama.split(",")[0]}. Saya adalah Fasilitator Inkuiri Kolaboratif berbasis siklus Teacher Experimental Training (TET). Kita akan merefleksikan praktik pembelajaran ${profile.mapel} di ${profile.sekolah} langkah demi langkah (satu pertanyaan per giliran) berlandaskan bukti nyata.\n\nUntuk memulai **Tahap 1 - Identifikasi (Assess)**: Pertemuan atau siklus mana yang ingin Bapak/Ibu refleksikan, dan bukti data apa yang sudah ada (misalnya nilai formatif, lembar observasi, atau catatan miskonsepsi murid)?`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "guru",
      text: userText,
      tahapAktif: currentStage,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      let replyText = "";
      let nextStage = currentStage;
      let missingEvidenceDetected = false;
      let suggestedDraftUpdates: any = null;

      try {
        const res = await fetch("/api/reflect/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teacherProfile: profile,
            messages: [...messages, userMsg],
            currentStage,
            currentDraft,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          replyText = data.replyText;
          if (data.nextStage) nextStage = data.nextStage;
          missingEvidenceDetected = Boolean(data.detectedMissingEvidence);
          suggestedDraftUpdates = data.suggestedDraftUpdates;
        } else {
          throw new Error("Gagal menghubungi server");
        }
      } catch {
        // Fallback rule-based facilitator
        const lower = userText.toLowerCase();
        const hasNumbers = /\d+%|\d+\s*(orang|murid)/.test(userText);

        if (!hasNumbers && currentStage === 1) {
          replyText = `Terima kasih atas penjelasannya, Bapak/Ibu. Sebagai fasilitator berbasis data, bolehkah Bapak/Ibu menyebutkan angka atau bukti konkretnya? Misalnya: berapa dari total murid yang belum mencapai KKTP, atau soal nomor berapa yang paling banyak keliru? (Tahap 1 - Identifikasi)`;
          missingEvidenceDetected = true;
        } else if (currentStage === 1) {
          replyText = `Data tercatat dengan baik. Dari temuan tersebut, rumusan masalah prioritas apa yang paling mendesak untuk diintervensi, dan strategi atau eksperimen apa yang akan dirancang di kelas pada tahap Desain? (Tahap 2 - Desain)`;
          nextStage = 2;
        } else if (currentStage === 2) {
          replyText = `Rancangan strategi sangat menarik. Apa tujuan yang terukur dan indikator keberhasilannya (misalnya persentase ketuntasan murid atau keterlibatan orang tua)? Siapa saja rekan atau pihak yang terlibat? (Tahap 2 - Desain)`;
          nextStage = 2;
        } else if (currentStage === 3) {
          replyText = `Apakah pelaksanaan eksperimen di kelas berjalan sesuai rancangan awal? Dokumentasi apa yang berhasil dikumpulkan (misalnya hasil kuis interaktif, foto lembar kerja, atau log Classroom)? (Tahap 3 - Implementasi)`;
          nextStage = 3;
        } else if (currentStage === 4) {
          replyText = `Bagaimana capaian murid dibandingkan target indikator? Apa yang berjalan baik, apa tantangannya, dan perubahan spesifik apa yang akan dicoba pada siklus berikutnya? (Tahap 4 - Amati dan Refleksi)`;
          nextStage = 4;
        } else {
          replyText = `Terima kasih atas refleksi mendalam ini. Praktik baik ini sangat layak dibagikan. Kepada siapa dan melalui forum apa (KKG/MGMP/sekolah) pengalaman ini akan didesiminasikan agar rekan lain dapat mereplikasinya? (Tahap 5 - Berbagi Praktik Baik)`;
          nextStage = 5;
        }
      }

      const aiMsg: ChatMessage = {
        id: "ai-" + Date.now(),
        sender: "ai",
        text: replyText,
        tahapAktif: nextStage,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        perluBuktiLabel: missingEvidenceDetected,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setCurrentStage(nextStage as any);

      // If suggested updates returned, apply them
      if (suggestedDraftUpdates) {
        onApplyUpdates(suggestedDraftUpdates);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyChat = () => {
    const text = messages
      .map((m) => `[${m.timestamp}] ${m.sender === "ai" ? "Fasilitator AI" : "Guru"}:\n${m.text}\n`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl h-[90vh] max-h-[700px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Chat Header */}
        <div className="bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm text-slate-100">
                  Fasilitator Inkuiri AI (Siklus TET)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  1 Pertanyaan per Giliran
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Memandu refleksi berbasis data · Istilah murid · Bebas penilaian negatif
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyChat}
              title="Salin Seluruh Percakapan"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              {hasCopied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Stage Progress Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-600 shrink-0 overflow-x-auto">
          <span className="font-semibold text-slate-900 whitespace-nowrap">
            {STAGE_TITLES[currentStage - 1]}
          </span>
          <div className="flex items-center gap-1 ml-2">
            {[1, 2, 3, 4, 5].map((st) => (
              <button
                key={st}
                onClick={() => setCurrentStage(st as any)}
                className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center transition ${
                  currentStage === st
                    ? "bg-indigo-600 text-white shadow-xs"
                    : currentStage > st
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                }`}
                title={`Pindah ke Tahap ${st}`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === "guru" ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                <span>{m.sender === "guru" ? "Anda (Guru)" : "Fasilitator Inkuiri AI"}</span>
                <span>·</span>
                <span>{m.timestamp}</span>
                {m.tahapAktif && (
                  <span className="font-mono bg-slate-200/80 px-1.5 py-0.2 rounded text-slate-600">
                    T{m.tahapAktif}
                  </span>
                )}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  m.sender === "guru"
                    ? "bg-indigo-600 text-white rounded-br-xs shadow-xs"
                    : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs"
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                {m.perluBuktiLabel && (
                  <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex items-center gap-1.5 text-xs text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg">
                    <AlertCircle size={14} className="text-amber-600 shrink-0" />
                    <span>[Perlu Bukti]: Harap sertakan angka atau bukti autentik konkret.</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-2xl px-4 py-3 max-w-[70%]">
              <Loader2 size={16} className="animate-spin text-indigo-600 shrink-0" />
              <span>Fasilitator AI sedang mencermati bukti refleksi...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ketik refleksi atau bukti pembelajaran Anda..."
              disabled={isLoading}
              className="flex-1 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs sm:text-sm border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-2xl transition shadow-xs cursor-pointer shrink-0"
              title="Kirim pesan"
            >
              <Send size={16} />
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-500">
            <span>💡 Tips: Sebutkan angka hasil asesmen, dokumentasi kelas, atau respon orang tua.</span>
            <button
              onClick={() => {
                if (window.confirm("Mulai percakapan refleksi baru dari Tahap 1?")) {
                  setMessages([
                    {
                      id: "msg-reset",
                      sender: "ai",
                      tahapAktif: 1,
                      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                      text: `Percakapan baru dimulai. Mari kita fokus pada **Tahap 1 - Identifikasi (Assess)**. Elemen TP apa yang ingin Bapak/Ibu refleksikan, dan apa bukti masalah awalnya?`,
                    },
                  ]);
                  setCurrentStage(1);
                }
              }}
              className="hover:text-indigo-600 font-medium transition cursor-pointer"
            >
              Mulai Ulang Sesi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
