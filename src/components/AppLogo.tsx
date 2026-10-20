import React from "react";

interface AppLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | number;
  className?: string;
  showText?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = "md",
  className = "",
  showText = false,
}) => {
  let dimension = "w-11 h-11";
  let pxSize = 44;

  if (typeof size === "number") {
    dimension = `w-[${size}px] h-[${size}px]`;
    pxSize = size;
  } else {
    switch (size) {
      case "sm":
        dimension = "w-8 h-8";
        pxSize = 32;
        break;
      case "md":
        dimension = "w-11 h-11 sm:w-12 sm:h-12";
        pxSize = 48;
        break;
      case "lg":
        dimension = "w-14 h-14 sm:w-16 sm:h-16";
        pxSize = 64;
        break;
      case "xl":
        dimension = "w-20 h-20 sm:w-24 sm:h-24";
        pxSize = 96;
        break;
    }
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Circular Simple Logo Badge */}
      <div
        className={`${dimension} relative rounded-full shrink-0 flex items-center justify-center p-0.5 shadow-sm transition-transform hover:scale-105 select-none bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-400`}
        style={{ aspectRatio: "1/1" }}
      >
        {/* Inner Circle Disc */}
        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden relative">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full p-1"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="logoPrimaryGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
              <linearGradient id="logoGoldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FDE047" />
              </linearGradient>
            </defs>

            {/* Subtle Circular Orbit / Inquiry Cycle */}
            <circle
              cx="50"
              cy="50"
              r="43"
              stroke="#6366F1"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              strokeOpacity="0.4"
            />

            {/* Collaborative Curved Arc */}
            <path
              d="M 24 64 C 18 48 24 30 38 22"
              stroke="url(#logoPrimaryGrad)"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <path
              d="M 76 36 C 82 52 76 70 62 78"
              stroke="#10B981"
              strokeWidth="2.8"
              strokeLinecap="round"
            />

            {/* Data-Driven Bars (Evaluation) */}
            <rect x="58" y="47" width="4.5" height="13" rx="2" fill="#38BDF8" opacity="0.9" />
            <rect x="65" y="41" width="4.5" height="19" rx="2" fill="#10B981" />
            <rect x="72" y="34" width="4.5" height="26" rx="2" fill="url(#logoGoldGrad)" />

            {/* Open Book of Pedagogical Reflection */}
            <path
              d="M 32 68 C 39 63 46 64 50 68 C 50 60 44 57 33 57 C 31 57 31 67 32 68 Z"
              fill="#E2E8F0"
            />
            <path
              d="M 68 68 C 61 63 54 64 50 68 C 50 60 56 57 67 57 C 69 57 69 67 68 68 Z"
              fill="#FFFFFF"
            />
            <line x1="50" y1="68" x2="50" y2="59" stroke="#94A3B8" strokeWidth="1.5" />

            {/* Inquiring Transformation Arrow Rising from Learning to Success */}
            <path
              d="M 33 57 L 44 46 L 51 51 L 67 30"
              stroke="url(#logoPrimaryGrad)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polygon points="68,28 59,31 65,38" fill="#38BDF8" />

            {/* Four-Point Sparkle of Teacher Insight */}
            <path
              d="M 36 28 Q 36 34 30 34 Q 36 34 36 40 Q 36 34 42 34 Q 36 34 36 28 Z"
              fill="url(#logoGoldGrad)"
            />
          </svg>
        </div>
      </div>

      {showText && (
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              RefleksiGuru
            </h1>
            <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
              kikybahsoan
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Inkuiri Kolaboratif & Evaluasi Berbasis Data
          </p>
        </div>
      )}
    </div>
  );
};
