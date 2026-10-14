import React, { useState } from 'react';
import { UserAccount, ScreenId } from '../../types';
import { calculateLevelInfo, LevelInfo } from '../../services/gamificationService';
import {
  Trophy,
  Award,
  Sparkles,
  TrendingUp,
  ChevronRight,
  Vote,
  CalendarCheck,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface FloatingGamificationWidgetProps {
  currentUser: UserAccount;
  points: number;
  onNavigate: (screen: ScreenId) => void;
  onOpenLeaderboard?: () => void;
  dailyBonusAwarded?: boolean;
  className?: string;
}

export const FloatingGamificationWidget: React.FC<FloatingGamificationWidgetProps> = ({
  currentUser,
  points,
  onNavigate,
  onOpenLeaderboard,
  dailyBonusAwarded = false,
  className = '',
}) => {
  const levelInfo: LevelInfo = calculateLevelInfo(points);

  return (
    <div
      aria-label="Widget Gamifikasi Warga"
      className={`w-full h-[22vh] min-h-[152px] max-h-[185px] rounded-2xl p-3 sm:p-3.5 bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 text-white shadow-lg border border-red-800/40 flex flex-col justify-between relative overflow-hidden transition-all text-left ${className}`}
    >
      {/* Background Accent Subtle Glow */}
      <div className="absolute -right-8 -top-8 w-28 h-28 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-amber-500/15 rounded-full blur-xl pointer-events-none" />

      {/* Row 1: Header - Points and Level Badge */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            <Trophy size={16} className="text-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                Poin Warga
              </span>
              {dailyBonusAwarded && (
                <span className="text-[9px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded font-extrabold flex items-center gap-0.5">
                  <Zap size={9} />
                  <span>+5 Hari Ini</span>
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums leading-none">
                {levelInfo.currentPoints}
              </span>
              <span className="text-[11px] text-slate-300 font-semibold">Poin Aktivitas</span>
            </div>
          </div>
        </div>

        {/* Level Badge */}
        <div className="text-right shrink-0">
          <span className="text-[9px] text-slate-300 block uppercase font-bold tracking-wider">
            Level Warga
          </span>
          <div className="mt-0.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 border border-white/25 text-white text-xs font-black shadow-xs">
            <span>{levelInfo.badge}</span>
          </div>
        </div>
      </div>

      {/* Row 2: Visual Progress Bar towards Next Level */}
      <div className="space-y-1.5 relative z-10 bg-white/5 p-2 rounded-xl border border-white/10">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="text-amber-200 flex items-center gap-1">
            <TrendingUp size={12} className="text-amber-400 shrink-0" />
            <span className="truncate">{levelInfo.progressLabel}</span>
          </span>
          <span className="text-slate-300 text-[10px] font-mono tabular-nums shrink-0 ml-1">
            {levelInfo.currentPoints}/{levelInfo.nextThreshold} Poin
          </span>
        </div>

        {/* Bar Track */}
        <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden p-0.2 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-red-500 via-rose-400 to-amber-300 rounded-full transition-all duration-700 ease-out shadow-xs"
            style={{ width: `${Math.max(5, levelInfo.progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Row 3: Quick Action Navigation Buttons */}
      <div className="flex items-center gap-2 relative z-10 pt-0.5">
        <button
          type="button"
          onClick={() => onNavigate('profil')}
          className="flex-1 min-h-[38px] px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-[0.98] cursor-pointer"
        >
          <Award size={13} className="text-amber-950 shrink-0" />
          <span className="truncate">Profil & Level Warga</span>
          <ChevronRight size={13} className="shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('polling')}
          className="min-h-[38px] px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-white/20 transition-transform active:scale-[0.98] cursor-pointer shrink-0"
          title="Berikan aspirasi dan raih +15 poin"
        >
          <Vote size={13} className="text-rose-300 shrink-0" />
          <span>Ikut Polling (+15)</span>
        </button>
      </div>
    </div>
  );
};
