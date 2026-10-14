import {
  CitizenLevelTier,
  CitizenLeaderboardEntry,
  GamificationHistoryItem,
  UserAccount,
} from '../types';

export interface LevelInfo {
  levelTitle: CitizenLevelTier;
  levelNumber: number;
  badge: string;
  badgeShort: string;
  badgeColor: string;
  bgGradient: string;
  accentColor: string;
  currentPoints: number;
  minPoints: number;
  nextThreshold: number;
  nextLevelTitle: CitizenLevelTier | null;
  pointsNeeded: number;
  progressPercent: number; // 0 to 100
  progressLabel: string;
  isMaxLevel: boolean;
  description: string;
}

export function calculateLevelInfo(rawPoints: number = 0): LevelInfo {
  const points = Math.max(0, Math.floor(rawPoints));

  if (points < 50) {
    const minPoints = 0;
    const nextThreshold = 50;
    const progressPercent = Math.min(100, Math.round((points / nextThreshold) * 100));
    const pointsNeeded = nextThreshold - points;
    return {
      levelTitle: 'Warga Baru',
      levelNumber: 1,
      badge: '🥉 Warga Baru',
      badgeShort: 'Warga Baru',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      bgGradient: 'from-emerald-600 to-teal-700',
      accentColor: 'text-emerald-600',
      currentPoints: points,
      minPoints,
      nextThreshold,
      nextLevelTitle: 'Warga Aktif',
      pointsNeeded,
      progressPercent,
      progressLabel: `${progressPercent}% menuju Warga Aktif`,
      isMaxLevel: false,
      description: 'Langkah awal berkontribusi dalam digitalisasi dan keterbukaan desa.',
    };
  }

  if (points < 150) {
    const minPoints = 50;
    const nextThreshold = 150;
    const progressPercent = Math.min(
      100,
      Math.round(((points - minPoints) / (nextThreshold - minPoints)) * 100)
    );
    const pointsNeeded = nextThreshold - points;
    return {
      levelTitle: 'Warga Aktif',
      levelNumber: 2,
      badge: '🥈 Warga Aktif',
      badgeShort: 'Warga Aktif',
      badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
      bgGradient: 'from-blue-600 to-indigo-700',
      accentColor: 'text-blue-600',
      currentPoints: points,
      minPoints,
      nextThreshold,
      nextLevelTitle: 'Warga Teladan',
      pointsNeeded,
      progressPercent,
      progressLabel: `${progressPercent}% menuju Warga Teladan`,
      isMaxLevel: false,
      description: 'Rajin bersuara di polling desa, gotong royong, dan menggunakan layanan warga.',
    };
  }

  if (points < 300) {
    const minPoints = 150;
    const nextThreshold = 300;
    const progressPercent = Math.min(
      100,
      Math.round(((points - minPoints) / (nextThreshold - minPoints)) * 100)
    );
    const pointsNeeded = nextThreshold - points;
    return {
      levelTitle: 'Warga Teladan',
      levelNumber: 3,
      badge: '🥇 Warga Teladan',
      badgeShort: 'Warga Teladan',
      badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
      bgGradient: 'from-amber-600 to-red-600',
      accentColor: 'text-amber-600',
      currentPoints: points,
      minPoints,
      nextThreshold,
      nextLevelTitle: 'Tokoh Inspiratif',
      pointsNeeded,
      progressPercent,
      progressLabel: `${progressPercent}% menuju Tokoh Inspiratif`,
      isMaxLevel: false,
      description: 'Penggerak aspirasi masyarakat dan teladan kepedulian sosial warga Arjawinangun.',
    };
  }

  // Level 4 (300+ Points)
  return {
    levelTitle: 'Tokoh Inspiratif',
    levelNumber: 4,
    badge: '👑 Tokoh Inspiratif',
    badgeShort: 'Tokoh Inspiratif',
    badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
    bgGradient: 'from-purple-600 to-rose-700',
    accentColor: 'text-purple-600',
    currentPoints: points,
    minPoints: 300,
    nextThreshold: 300,
    nextLevelTitle: null,
    pointsNeeded: 0,
    progressPercent: 100,
    progressLabel: 'Tingkat Tertinggi: Tokoh Inspiratif',
    isMaxLevel: true,
    description: 'Peringkat kehormatan tertinggi atas dedikasi luar biasa untuk kemajuan desa Arjawinangun.',
  };
}

// 10 Tokoh & Warga Panutan Arjawinangun untuk Papan Skor Leaderboard
export const BASE_LEADERBOARD_CITIZENS: CitizenLeaderboardEntry[] = [
  {
    id: 'lead-1',
    name: 'H. Sudirman Al-Hafidz',
    location: 'Blok Makmur',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    points: 480,
    levelTitle: 'Tokoh Inspiratif',
    levelBadge: '👑 Tokoh Inspiratif',
  },
  {
    id: 'lead-2',
    name: 'Hj. Masitoh Hasan',
    location: 'Pasar Jungjang',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    points: 420,
    levelTitle: 'Tokoh Inspiratif',
    levelBadge: '👑 Tokoh Inspiratif',
  },
  {
    id: 'lead-3',
    name: 'Kang Dian Rohman',
    location: 'Karangmulya',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    points: 350,
    levelTitle: 'Tokoh Inspiratif',
    levelBadge: '👑 Tokoh Inspiratif',
  },
  {
    id: 'lead-4',
    name: 'Pak RT Sugeng Santoso',
    location: 'Blok Manis',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    points: 275,
    levelTitle: 'Warga Teladan',
    levelBadge: '🥇 Warga Teladan',
  },
  {
    id: 'lead-5',
    name: 'Mba Siti Aminah',
    location: 'Kebonturi',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    points: 230,
    levelTitle: 'Warga Teladan',
    levelBadge: '🥇 Warga Teladan',
  },
  {
    id: 'lead-6',
    name: 'Kang Asep Saepudin',
    location: 'Tegalgubug',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    points: 185,
    levelTitle: 'Warga Teladan',
    levelBadge: '🥇 Warga Teladan',
  },
  {
    id: 'lead-7',
    name: 'Bpk. Karsan Sasmita',
    location: 'Blok Kliwon',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    points: 135,
    levelTitle: 'Warga Aktif',
    levelBadge: '🥈 Warga Aktif',
  },
  {
    id: 'lead-8',
    name: 'Mas Rizky Maulana',
    location: 'Stasiun Arjawinangun',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    points: 105,
    levelTitle: 'Warga Aktif',
    levelBadge: '🥈 Warga Aktif',
  },
  {
    id: 'lead-9',
    name: 'Ibu Nunung Suryani',
    location: 'Pasar Jungjang',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    points: 75,
    levelTitle: 'Warga Aktif',
    levelBadge: '🥈 Warga Aktif',
  },
  {
    id: 'lead-10',
    name: 'Kang Dedi Kusuma',
    location: 'Dusun Karangmulya',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    points: 40,
    levelTitle: 'Warga Baru',
    levelBadge: '🥉 Warga Baru',
  },
];

export interface LeaderboardResult {
  topTen: CitizenLeaderboardEntry[];
  currentUserRank: number;
  currentUserPoints: number;
  totalParticipants: number;
}

export function getTopLeaderboard(currentUser: UserAccount, activePoints?: number): LeaderboardResult {
  const points = activePoints !== undefined ? activePoints : (currentUser.gamificationPoints ?? 85);
  const userLevel = calculateLevelInfo(points);

  const currentEntry: CitizenLeaderboardEntry = {
    id: currentUser.id || 'usr-current',
    name: currentUser.name || 'Warga Arjawinangun',
    location: currentUser.location || 'Blok Makmur',
    avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    points,
    levelTitle: userLevel.levelTitle,
    levelBadge: userLevel.badge,
    isCurrentUser: true,
  };

  // Filter out any duplicate if same ID
  const others = BASE_LEADERBOARD_CITIZENS.filter((c) => c.id !== currentEntry.id);
  const combined = [currentEntry, ...others];

  // Sort descending by points
  combined.sort((a, b) => b.points - a.points);

  // Assign ranks
  const ranked = combined.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  const userRankIndex = ranked.findIndex((r) => r.isCurrentUser);
  const currentUserRank = userRankIndex !== -1 ? userRankIndex + 1 : 1;

  // Take top 10
  const topTen = ranked.slice(0, 10);

  return {
    topTen,
    currentUserRank,
    currentUserPoints: points,
    totalParticipants: ranked.length,
  };
}

export const gamificationStorage = {
  getPoints(userId: string = 'usr-pelanggan'): number {
    try {
      const saved = localStorage.getItem(`wong_arjawinangun_gamification_points_${userId}`);
      if (saved !== null) {
        return Number(saved) || 0;
      }
    } catch (e) {}
    // Default baseline points for citizen to showcase active level
    return 85;
  },

  setPoints(userId: string = 'usr-pelanggan', points: number): void {
    try {
      localStorage.setItem(`wong_arjawinangun_gamification_points_${userId}`, String(points));
    } catch (e) {}
  },

  getHistory(userId: string = 'usr-pelanggan'): GamificationHistoryItem[] {
    try {
      const saved = localStorage.getItem(`wong_arjawinangun_gamification_history_${userId}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}

    // Initial baseline history
    return [
      {
        id: 'hist-1',
        title: 'Pendaftaran Akun Terverifikasi Desa',
        points: 25,
        date: 'Hari ini',
        category: 'Kegiatan Desa',
      },
      {
        id: 'hist-2',
        title: 'Aspirasi Musyawarah Rencana Desa',
        points: 15,
        date: 'Hari ini',
        category: 'Aspirasi Polling',
      },
      {
        id: 'hist-3',
        title: 'Donasi Kas Sosial Gotong Royong',
        points: 25,
        date: 'Hari ini',
        category: 'Donasi Sosial',
      },
      {
        id: 'hist-4',
        title: 'Bonus Login Aktivitas Harian',
        points: 20,
        date: 'Hari ini',
        category: 'Login Harian',
      },
    ];
  },

  addPoints(
    userId: string = 'usr-pelanggan',
    amount: number,
    title: string,
    category: GamificationHistoryItem['category']
  ): { newPoints: number; history: GamificationHistoryItem[]; levelInfo: LevelInfo } {
    const currentPoints = this.getPoints(userId);
    const newPoints = currentPoints + amount;
    this.setPoints(userId, newPoints);

    const currentHistory = this.getHistory(userId);
    const newItem: GamificationHistoryItem = {
      id: `ghist-${Date.now()}`,
      title,
      points: amount,
      date: 'Baru saja',
      category,
    };
    const updatedHistory = [newItem, ...currentHistory];

    try {
      localStorage.setItem(
        `wong_arjawinangun_gamification_history_${userId}`,
        JSON.stringify(updatedHistory)
      );
    } catch (e) {}

    const levelInfo = calculateLevelInfo(newPoints);
    return { newPoints, history: updatedHistory, levelInfo };
  },

  checkAndClaimDailyLogin(
    userId: string = 'usr-pelanggan'
  ): { awarded: boolean; points: number; message: string; newTotal: number } {
    const today = new Date().toISOString().slice(0, 10);
    const key = `wong_arjawinangun_last_daily_login_${userId}`;
    const lastLogin = localStorage.getItem(key);

    if (lastLogin === today) {
      return {
        awarded: false,
        points: 0,
        message: 'Bonus login harian sudah diklaim hari ini.',
        newTotal: this.getPoints(userId),
      };
    }

    // Award +5 points
    const { newPoints } = this.addPoints(
      userId,
      5,
      'Bonus Login Aktivitas Harian',
      'Login Harian'
    );

    try {
      localStorage.setItem(key, today);
    } catch (e) {}

    return {
      awarded: true,
      points: 5,
      message: 'Selamat datang kembali, Anda mendapatkan 5 poin aktivitas',
      newTotal: newPoints,
    };
  },
};
