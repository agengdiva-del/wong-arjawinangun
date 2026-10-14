import React from 'react';
import { calculateLevelInfo, LevelInfo } from '../../services/gamificationService';
import { Award, Sparkles, TrendingUp, ChevronRight, ShieldCheck } from 'lucide-react';

interface LevelProgressBarProps {
  points: number;
  compact?: boolean;
  onViewLeaderboard?: () => void;
  className?: string;
}

export const LevelProgressBar: React.FC<LevelProgressBarProps> = ({
  points,
  compact = false,
  onViewLeaderboard,
  className = '',
}) => {
  const levelInfo: LevelInfo = calculateLevelInfo(points);

  if (compact) {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <span>{levelInfo.badge}</span>
            <span className="text-[10px] text-slate-400">·</span>
            <span className="text-amber-700 font-extrabold tabular-nums">
              {levelInfo.currentPoints} Poin
            </span>
          </div>
          <span className="text-[10px] font-extrabold text-slate-600">
            {levelInfo.progressLabel}
          </span>
        </div>

        {/* Bar Track */}
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-amber-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${levelInfo.progressPercent}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3.5 text-left ${className}`}>
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Level Partisipasi Warga
            </span>
            <span className="text-[9px] bg-red-100 text-red-700 font-extrabold px-1.5 py-0.2 rounded-full border border-red-200">
              Level {levelInfo.levelNumber} dari 4
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
              <span>{levelInfo.badge}</span>
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
            {levelInfo.description}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] text-slate-400 block font-medium">Akumulasi Poin</span>
          <span className="text-xl font-black text-red-700 tabular-nums">
            {levelInfo.currentPoints}
          </span>
          <span className="text-[10px] font-bold text-slate-500 block">Poin Warga</span>
        </div>
      </div>

      {/* Progress Track & Goal */}
      <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-800 flex items-center gap-1">
            <TrendingUp size={13} className="text-red-600" />
            <span className="text-red-700 font-extrabold">{levelInfo.progressLabel}</span>
          </span>
          <span className="text-[11px] font-mono text-slate-600 tabular-nums">
            {levelInfo.currentPoints} / {levelInfo.nextThreshold} Poin
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="h-3 w-full bg-slate-200/80 rounded-full overflow-hidden p-0.5 border border-slate-300/50">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 rounded-full transition-all duration-700 ease-out shadow-xs"
            style={{ width: `${Math.max(4, levelInfo.progressPercent)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
          <span>Tingkat Sekarang: {levelInfo.levelTitle}</span>
          <span>
            {levelInfo.isMaxLevel ? (
              <span className="text-purple-700 font-extrabold">👑 Peringkat Tertinggi</span>
            ) : (
              <span>Butuh <strong className="text-slate-800 font-black">{levelInfo.pointsNeeded} poin</strong> lagi</span>
            )}
          </span>
        </div>
      </div>

      {/* How to earn points quick tips */}
      <div className="pt-1 flex items-center justify-between gap-2 text-[10px]">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Sparkles size={12} className="text-amber-500 shrink-0" />
          <span>Polling Aspirasi (+15), Kegiatan Desa (+25), Login Harian (+5)</span>
        </div>
      </div>
    </div>
  );
};
