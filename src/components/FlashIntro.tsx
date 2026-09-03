import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  PieChart,
  Wallet,
  IndianRupee,
  ShieldCheck,
} from 'lucide-react';

interface FlashIntroProps {
  onComplete: () => void;
}

export const FlashIntro: React.FC<FlashIntroProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const totalDuration = 3000; // 3 seconds
    const intervalTime = 30;
    const step = (intervalTime / totalDuration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500); // Allow fade-out transition
          }, 150);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4 transition-all duration-500 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}
    >
      {/* Decorative ambient background glows */}
      <div className="absolute w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl -top-10 -left-10 animate-pulse pointer-events-none" />
      <div className="absolute w-96 h-96 bg-purple-500/30 rounded-full blur-3xl -bottom-10 -right-10 animate-pulse pointer-events-none" />

      {/* Main Flash Card Container */}
      <div className="relative max-w-lg w-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-center text-white">
        {/* Top Shimmer Banner */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-indigo-500 to-fuchsia-500" />

        {/* Skip button top right */}
        <button
          onClick={handleSkip}
          type="button"
          className="absolute top-4 right-4 text-xs font-semibold text-indigo-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Skip</span>
          <ArrowRight className="w-3 h-3" />
        </button>

        {/* Floating Animated Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-5 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span>College Finance Suite 2026</span>
        </div>

        {/* Center Graphic: Glowing 3D-styled Icon Card */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-6">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-3xl blur-md opacity-75 animate-pulse" />
          <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-800 rounded-3xl border border-white/30 flex items-center justify-center shadow-2xl">
            <GraduationCap className="w-12 h-12 text-white drop-shadow-md" />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl shadow-lg border-2 border-slate-900">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-purple-200 tracking-tight">
          Student Finance Tracker
        </h2>
        
        <p className="mt-2 text-xs sm:text-sm text-indigo-200/90 max-w-sm mx-auto leading-relaxed">
          Effortless tracking of your allowance, scholarships, daily mess expenses, and monthly budget limits.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5 text-xs text-slate-300">
          <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
            <PieChart className="w-3 h-3 text-cyan-300" />
            <span>Live Analytics</span>
          </span>
          <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
            <Wallet className="w-3 h-3 text-emerald-300" />
            <span>Budget Control</span>
          </span>
          <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
            <ShieldCheck className="w-3 h-3 text-amber-300" />
            <span>Offline Storage</span>
          </span>
        </div>

        {/* 3-Second Loading Bar */}
        <div className="mt-7">
          <div className="flex items-center justify-between text-[11px] text-indigo-300 font-medium mb-1.5 px-1">
            <span>Loading dashboard...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
