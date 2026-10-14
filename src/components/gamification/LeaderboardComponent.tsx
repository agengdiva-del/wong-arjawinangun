import React from 'react';
import { CitizenLeaderboardEntry, UserAccount } from '../../types';
import { getTopLeaderboard } from '../../services/gamificationService';
import { Trophy, Award, Medal, Crown, Sparkles, MapPin, ChevronRight, Users } from 'lucide-react';

interface LeaderboardComponentProps {
  currentUser: UserAccount;
  activePoints?: number;
  onNavigateToPolling?: () => void;
  className?: string;
}

export const LeaderboardComponent: React.FC<LeaderboardComponentProps> = ({
  currentUser,
  activePoints,
  onNavigateToPolling,
  className = '',
}) => {
  const { topTen, currentUserRank, currentUserPoints, totalParticipants } = getTopLeaderboard(
    currentUser,
    activePoints
  );

  return (
    <div className={`space-y-3.5 text-left ${className}`}>
      {/* Top Banner Leaderboard */}
      <div className="bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 rounded-2xl p-4 text-white shadow-md relative overflow-hidden border border-red-900/40">
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-1.5 text-amber-300 text-[10px] font-black uppercase tracking-wider">
              <Trophy size={14} className="text-amber-400" />
              <span>Papan Skor Warga Arjawinangun</span>
            </div>
            <h3 className="text-base font-black text-white mt-1">
              10 Warga Teraktif & Berprestasi
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">
              Apresiasi untuk warga paling aktif berpartisipasi dan memberi aspirasi.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center shrink-0">
            <Crown size={26} className="text-amber-300" />
          </div>
        </div>

        {/* Current Citizen Rank Card */}
        <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border-2 border-amber-400 shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-amber-200 font-bold block">Posisi Anda Saat Ini:</span>
              <p className="text-xs font-black text-white truncate">{currentUser.name}</p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-sm font-black text-amber-300 tabular-nums">
              Peringkat #{currentUserRank}
            </span>
            <span className="text-[10px] text-slate-300 block font-bold tabular-nums">
              {currentUserPoints} Poin
            </span>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Highlights */}
      <div className="grid grid-cols-3 gap-2">
        {topTen.slice(0, 3).map((citizen, idx) => {
          const podiumConfig = [
            {
              rank: 1,
              title: 'Juara 1',
              color: 'border-amber-400 bg-amber-50/90 text-amber-950',
              badgeColor: 'bg-amber-400 text-amber-950',
              icon: Crown,
            },
            {
              rank: 2,
              title: 'Juara 2',
              color: 'border-slate-300 bg-slate-50/90 text-slate-900',
              badgeColor: 'bg-slate-300 text-slate-900',
              icon: Medal,
            },
            {
              rank: 3,
              title: 'Juara 3',
              color: 'border-amber-600 bg-orange-50/80 text-orange-950',
              badgeColor: 'bg-amber-600 text-white',
              icon: Award,
            },
          ][idx];
          const Icon = podiumConfig.icon;

          return (
            <div
              key={citizen.id}
              className={`rounded-2xl p-2.5 border text-center flex flex-col items-center justify-between ${podiumConfig.color} shadow-2xs relative`}
            >
              <div
                className={`w-5 h-5 rounded-full ${podiumConfig.badgeColor} font-black text-[10px] flex items-center justify-center absolute -top-2 left-1/2 -translate-x-1/2 shadow-xs`}
              >
                #{podiumConfig.rank}
              </div>

              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-xs mt-1 shrink-0">
                <img
                  src={citizen.avatar}
                  alt={citizen.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="mt-1.5 w-full">
                <h4 className="text-[11px] font-extrabold truncate w-full" title={citizen.name}>
                  {citizen.name.split(' ')[0]}
                </h4>
                <p className="text-[9px] text-slate-500 truncate">{citizen.location}</p>
                <div className="mt-1 font-mono font-black text-xs text-red-700 tabular-nums">
                  {citizen.points} pts
                </div>
              </div>

              <span className="text-[8px] font-extrabold px-1 py-0.2 rounded mt-1 bg-white/80 border border-slate-200/80 truncate max-w-full">
                {citizen.levelTitle}
              </span>
            </div>
          );
        })}
      </div>

      {/* Complete Top 10 List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        <div className="p-3 bg-slate-50/80 flex items-center justify-between text-xs font-bold text-slate-700">
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-slate-500" />
            <span>Daftar 10 Besar Warga Teraktif</span>
          </div>
          <span className="text-[10px] text-slate-500 font-normal">
            Diperbarui Realtime
          </span>
        </div>

        {topTen.map((citizen, index) => {
          const isUser = citizen.isCurrentUser;
          const rank = citizen.rank ?? index + 1;

          return (
            <div
              key={citizen.id}
              className={`p-3 flex items-center justify-between transition-colors ${
                isUser
                  ? 'bg-amber-50/70 border-l-4 border-l-amber-500 font-semibold'
                  : 'hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                {/* Rank Number */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 tabular-nums ${
                    rank === 1
                      ? 'bg-amber-400 text-amber-950 shadow-xs'
                      : rank === 2
                      ? 'bg-slate-300 text-slate-900 shadow-xs'
                      : rank === 3
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {rank}
                </div>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img
                    src={citizen.avatar}
                    alt={citizen.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Citizen Info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p
                      className={`text-xs truncate ${
                        isUser ? 'font-black text-amber-950' : 'font-bold text-slate-900'
                      }`}
                    >
                      {citizen.name}
                    </p>
                    {isUser && (
                      <span className="text-[9px] bg-amber-400 text-amber-950 font-black px-1.5 py-0.2 rounded-full shrink-0">
                        Anda
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    <span className="flex items-center gap-0.5 truncate">
                      <MapPin size={10} className="text-slate-400 shrink-0" />
                      <span>{citizen.location}</span>
                    </span>
                    <span>·</span>
                    <span className="font-semibold text-slate-700 shrink-0">{citizen.levelTitle}</span>
                  </div>
                </div>
              </div>

              {/* Points Count */}
              <div className="text-right shrink-0">
                <span className="text-xs font-black text-red-700 font-mono tabular-nums">
                  {citizen.points}
                </span>
                <span className="text-[9px] text-slate-400 block">Poin</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational Call to Action */}
      <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs text-red-950">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500 shrink-0" />
          <p className="text-[11px] leading-tight font-medium">
            Ingin naik ke 3 besar? Sampaikan aspirasi di polling desa atau berdonasi kas warga!
          </p>
        </div>
        {onNavigateToPolling && (
          <button
            type="button"
            onClick={onNavigateToPolling}
            className="px-2.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-[10px] font-bold shrink-0 transition-colors"
          >
            Ikut Polling →
          </button>
        )}
      </div>
    </div>
  );
};
