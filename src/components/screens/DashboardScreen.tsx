import React, { useState, useEffect, useMemo } from 'react';
import { LocationItem, ScreenId, AppRole, UserAccount, VillagePoll } from '../../types';
import { APP_IMAGES, MOCK_LOCATIONS, LOCAL_SERVICES, MOCK_USERS, MOCK_VILLAGE_POLLS } from '../../data/mockData';
import { api } from '../../services/api';
import { requestDeviceLocation, watchDeviceLocation, DeviceLocationResult } from '../../services/locationService';
import {
  Search,
  MapPin,
  ChevronRight,
  Bike,
  ShoppingBag,
  Wrench,
  PackageCheck,
  UtensilsCrossed,
  Briefcase,
  Landmark,
  MessageCircle,
  Vote,
  CalendarDays,
  Sprout,
  Sparkles,
  Star,
  ShieldCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  X,
  HeartHandshake,
  LogOut,
  Navigation,
  RefreshCw,
  Trophy,
  Bell,
  LayoutGrid,
  Flame,
  RotateCcw,
  TrendingUp,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { AppNotification } from '../../types';
import { FloatingGamificationWidget } from '../gamification/FloatingGamificationWidget';
import { gamificationStorage } from '../../services/gamificationService';

interface DashboardScreenProps {
  currentLocation: LocationItem;
  onChangeLocation: (loc: LocationItem) => void;
  onNavigate: (screen: ScreenId) => void;
  userRole: AppRole;
  currentUser?: UserAccount;
  villagePolls?: VillagePoll[];
  isWireframe?: boolean;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  notifications?: AppNotification[];
  gamificationPoints?: number;
  onAwardPoints?: (amount: number, title: string, category: any) => void;
  onOpenLeaderboard?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  currentLocation,
  onChangeLocation,
  onNavigate,
  userRole,
  currentUser: propUser,
  villagePolls = MOCK_VILLAGE_POLLS,
  isWireframe = false,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  notifications = [],
  gamificationPoints,
  onAwardPoints,
  onOpenLeaderboard,
}) => {
  const activeUser = propUser || MOCK_USERS[userRole] || MOCK_USERS.pelanggan;
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllServicesModal, setShowAllServicesModal] = useState(false);

  // Daily Login Bonus Gamifikasi
  const [dailyLoginNotice, setDailyLoginNotice] = useState<string | null>(null);
  const [hasClaimedToday, setHasClaimedToday] = useState(false);
  const [pointsState, setPointsState] = useState<number>(() => {
    return gamificationPoints !== undefined
      ? gamificationPoints
      : gamificationStorage.getPoints(activeUser.id);
  });

  useEffect(() => {
    if (gamificationPoints !== undefined) {
      setPointsState(gamificationPoints);
    }
  }, [gamificationPoints]);

  // Cek & berikan poin harian otomatis saat pertama kali buka aplikasi setiap hari
  useEffect(() => {
    const claimRes = gamificationStorage.checkAndClaimDailyLogin(activeUser.id);
    if (claimRes.awarded) {
      setDailyLoginNotice(claimRes.message);
      setHasClaimedToday(true);
      setPointsState(claimRes.newTotal);
      if (onAwardPoints) {
        onAwardPoints(5, 'Bonus Login Aktivitas Harian', 'Login Harian');
      }
    } else {
      const today = new Date().toISOString().slice(0, 10);
      const last = localStorage.getItem(`wong_arjawinangun_last_daily_login_${activeUser.id}`);
      if (last === today) {
        setHasClaimedToday(true);
      }
    }
  }, [activeUser.id]);
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [serviceFilterCategory, setServiceFilterCategory] = useState<string>('Semua');
  const [serviceFeedbackToast, setServiceFeedbackToast] = useState<{ title: string; count: number; promoted?: boolean } | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // GPS Device Location States
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsResult, setGpsResult] = useState<DeviceLocationResult | null>(() => {
    try {
      const saved = localStorage.getItem('wong_arjawinangun_gps_location');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Promos from Backend
  const [backendPromos, setBackendPromos] = useState<any[]>([]);

  useEffect(() => {
    api.getPromos().then((data) => {
      if (data && data.length > 0) setBackendPromos(data);
    }).catch(() => {});
  }, []);

  // Pantau lokasi realtime dari HP pengguna
  useEffect(() => {
    const stopWatch = watchDeviceLocation((result) => {
      setGpsResult(result);
    });
    return () => stopWatch();
  }, []);

  const handleRequestGps = async () => {
    setGpsLoading(true);
    setGpsError(null);
    try {
      const result = await requestDeviceLocation();
      setGpsResult(result);
      onChangeLocation(result.matchedLocation);
      setGpsLoading(false);
    } catch (err: any) {
      setGpsLoading(false);
      setGpsError(err.message || 'Gagal mengakses GPS');
    }
  };

  // Latest active poll to highlight on Dashboard
  const latestActivePoll = villagePolls.find((p) => p.status === 'Aktif') || villagePolls[0];

  // -------------------------------------------------------------
  // KOLEKSI LAYANAN WARGA & URUTAN DINAMIS FREKUENSI PENGGUNAAN
  // -------------------------------------------------------------
  interface VillageServiceItem {
    id: string;
    title: string;
    subtitle: string;
    category: 'Transportasi' | 'Belanja & Kuliner' | 'Pekerjaan & Usaha' | 'Sosial & Aspirasi';
    icon: any;
    screen: ScreenId;
    defaultUsage: number;
    bg: string;
    badge?: string;
    description: string;
  }

  const ALL_VILLAGE_SERVICES: VillageServiceItem[] = [
    {
      id: 'ojek_becak',
      title: 'Ojek & Becak',
      subtitle: 'Antar jemput warga',
      category: 'Transportasi',
      icon: Bike,
      screen: 'ojek_becak',
      defaultUsage: 1840,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-red-50 text-red-600 border border-red-100',
      badge: 'Lokal',
      description: 'Armada pangkalan ojek & becak motor khas Arjawinangun siap antar warga.',
    },
    {
      id: 'kuliner',
      title: 'Kuliner',
      subtitle: 'Khas Cirebon',
      category: 'Belanja & Kuliner',
      icon: UtensilsCrossed,
      screen: 'kuliner',
      defaultUsage: 1520,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-rose-50 text-rose-600 border border-rose-100',
      badge: 'Katalog',
      description: 'Empal gentong, nasi jamblang, tahu gejrot & aneka jajanan pasar legendaris.',
    },
    {
      id: 'belanja',
      title: 'Belanja Offline',
      subtitle: 'Pasar & warung',
      category: 'Belanja & Kuliner',
      icon: ShoppingBag,
      screen: 'belanja_offline',
      defaultUsage: 1290,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-sky-50 text-sky-600 border border-sky-100',
      badge: 'Katalog',
      description: 'Kios sembako, los sayuran segar, dan bumbu dapur Pasar Jungjang.',
    },
    {
      id: 'qris_donasi',
      title: 'QRIS Donasi',
      subtitle: 'Infaq & kas desa',
      category: 'Sosial & Aspirasi',
      icon: HeartHandshake,
      screen: 'qris_donasi',
      defaultUsage: 1150,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-100',
      badge: 'Utama',
      description: 'Infaq masjid, santunan anak yatim & dana darurat siaga bencana warga.',
    },
    {
      id: 'jasa',
      title: 'Jasa Lokal',
      subtitle: 'Tukang & servis',
      category: 'Pekerjaan & Usaha',
      icon: Wrench,
      screen: 'jasa_lokal',
      defaultUsage: 980,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-amber-50 text-amber-600 border border-amber-100',
      description: 'Panggilan tukang ledeng, servis AC/elektronik, tukang kayu & tambal ban.',
    },
    {
      id: 'loker',
      title: 'Lowongan Kerja',
      subtitle: 'Loker desa & harian',
      category: 'Pekerjaan & Usaha',
      icon: Briefcase,
      screen: 'loker',
      defaultUsage: 860,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-indigo-50 text-indigo-600 border border-indigo-100',
      badge: 'Loker',
      description: 'Info lowongan kerja UMKM, pabrik, pergudangan & pekerjaan harian lepas.',
    },
    {
      id: 'tani_ikan',
      title: 'Tani & Ikan',
      subtitle: 'Gabah & benih lele',
      category: 'Pekerjaan & Usaha',
      icon: Sprout,
      screen: 'tani_ikan',
      defaultUsage: 750,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-lime-50 text-lime-700 border border-lime-100',
      badge: 'Katalog',
      description: 'Katalog bibit mangga gedong gincu, pupuk subsidi/organik, gabah & benih perikanan.',
    },
    {
      id: 'hall_of_fame',
      title: 'Hall of Fame',
      subtitle: 'Tokoh & prestasi',
      category: 'Sosial & Aspirasi',
      icon: Trophy,
      screen: 'hall_of_fame',
      defaultUsage: 710,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-amber-50 text-amber-800 border border-amber-200',
      badge: 'Tokoh',
      description: 'Panggung apresiasi tokoh masyarakat, atlet, pemuda berprestasi & usulan warga.',
    },
    {
      id: 'polling_desa',
      title: 'Polling Desa',
      subtitle: 'Rembug aspirasi',
      category: 'Sosial & Aspirasi',
      icon: Vote,
      screen: 'polling',
      defaultUsage: 640,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-red-50 text-red-600 border border-red-100',
      badge: 'Baru',
      description: 'Musyawarah & rembug suara warga untuk prioritas program pembangunan desa.',
    },
    {
      id: 'antar_barang',
      title: 'Antar Barang',
      subtitle: 'Titip & kirim cepat',
      category: 'Transportasi',
      icon: PackageCheck,
      screen: 'ojek_becak',
      defaultUsage: 590,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-orange-50 text-orange-600 border border-orange-100',
      badge: 'Kurir',
      description: 'Titip belanjaan pasar atau kirim dokumen & paket kilat langsung ke rumah.',
    },
    {
      id: 'info_desa',
      title: 'Info Desa',
      subtitle: 'Balai desa & surat',
      category: 'Sosial & Aspirasi',
      icon: Landmark,
      screen: 'komunitas',
      defaultUsage: 520,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-blue-50 text-blue-600 border border-blue-100',
      badge: 'Resmi',
      description: 'Layanan administrasi surat pengantar RT/RW dan pengumuman resmi balai desa.',
    },
    {
      id: 'chat_lokal',
      title: 'Chat Lokal',
      subtitle: 'Obrolan warga',
      category: 'Sosial & Aspirasi',
      icon: MessageCircle,
      screen: 'komunitas',
      defaultUsage: 430,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-teal-50 text-teal-600 border border-teal-100',
      description: 'Forum obrolan warga se-blok, kabar keamanan ronda malam & gotong royong.',
    },
    {
      id: 'event_budaya',
      title: 'Event & Budaya',
      subtitle: 'Sintren & wayang',
      category: 'Sosial & Aspirasi',
      icon: CalendarDays,
      screen: 'komunitas',
      defaultUsage: 380,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-yellow-50 text-yellow-700 border border-yellow-100',
      badge: 'Budaya',
      description: 'Jadwal pentas tari sintren, wayang kulit, sedekah bumi & festival seni daerah.',
    },
  ];

  // Map Default Usage
  const DEFAULT_SERVICE_USAGES = useMemo(() => {
    const map: Record<string, number> = {};
    ALL_VILLAGE_SERVICES.forEach((s) => {
      map[s.id] = s.defaultUsage;
    });
    return map;
  }, []);

  // State Dinamis Frekuensi Penggunaan (Disimpan di localStorage)
  const [serviceUsageMap, setServiceUsageMap] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('wong_arjawinangun_service_usage_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SERVICE_USAGES, ...parsed };
      }
    } catch (e) {
      // fallback
    }
    return { ...DEFAULT_SERVICE_USAGES };
  });

  // Urutkan semua layanan secara dinamis dari yang paling sering digunakan (Descending)
  const sortedAllServices = useMemo(() => {
    return [...ALL_VILLAGE_SERVICES].sort((a, b) => {
      const countA = serviceUsageMap[a.id] ?? a.defaultUsage;
      const countB = serviceUsageMap[b.id] ?? b.defaultUsage;
      return countB - countA;
    });
  }, [serviceUsageMap, isWireframe]);

  // 7 Teratas untuk ditampilkan di grid beranda
  const top7Services = useMemo(() => sortedAllServices.slice(0, 7), [sortedAllServices]);

  // Selebihnya (mulai urutan ke-8 dst) yang masuk ke tombol "Lainnya"
  const remainingServices = useMemo(() => sortedAllServices.slice(7), [sortedAllServices]);

  // Handler saat layanan diklik: frekuensi otomatis bertambah & tersimpan secara dinamis
  const handleServiceClick = (item: VillageServiceItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const currentCount = serviceUsageMap[item.id] ?? item.defaultUsage;
    const newCount = currentCount + 1;
    const updatedMap = {
      ...serviceUsageMap,
      [item.id]: newCount,
    };
    setServiceUsageMap(updatedMap);
    try {
      localStorage.setItem('wong_arjawinangun_service_usage_v3', JSON.stringify(updatedMap));
    } catch (err) {
      // ignore
    }

    setServiceFeedbackToast({
      title: item.title,
      count: newCount,
    });
    setTimeout(() => {
      setServiceFeedbackToast(null);
    }, 2800);

    onNavigate(item.screen);
  };

  // Handler untuk mensimulasikan penggunaan / boost frekuensi layanan
  const handleBoostService = (serviceId: string, delta: number = 50, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const currentCount = serviceUsageMap[serviceId] ?? DEFAULT_SERVICE_USAGES[serviceId] ?? 100;
    const newCount = currentCount + delta;
    const updatedMap = {
      ...serviceUsageMap,
      [serviceId]: newCount,
    };
    setServiceUsageMap(updatedMap);
    try {
      localStorage.setItem('wong_arjawinangun_service_usage_v3', JSON.stringify(updatedMap));
    } catch (err) {}

    const svc = ALL_VILLAGE_SERVICES.find((s) => s.id === serviceId);
    setServiceFeedbackToast({
      title: svc ? svc.title : 'Layanan',
      count: newCount,
      promoted: true,
    });
    setTimeout(() => {
      setServiceFeedbackToast(null);
    }, 2800);
  };

  // Reset frekuensi ke pengaturan awal desa
  const handleResetServiceUsage = () => {
    setServiceUsageMap({ ...DEFAULT_SERVICE_USAGES });
    try {
      localStorage.removeItem('wong_arjawinangun_service_usage_v3');
    } catch (err) {}
    setServiceFeedbackToast({
      title: 'Urutan Layanan',
      count: 0,
    });
    setTimeout(() => {
      setServiceFeedbackToast(null);
    }, 2500);
  };

  return (
    <div className={`min-h-full pb-20 ${isWireframe ? 'bg-zinc-50' : 'bg-slate-50'}`}>
      {/* Top Hero Crimson Header */}
      <div className={`p-4 pt-3 pb-5 ${
        isWireframe
          ? 'bg-zinc-800 text-white'
          : 'bg-gradient-to-b from-red-700 via-red-700 to-rose-700 text-white shadow-md'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-black tracking-tight text-white">
                Wong Arjawinangun
              </h1>
              <span className="text-[10px] bg-red-800 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                Cirebon
              </span>
            </div>
            <p className="text-[11px] text-red-100 font-medium">Bersama Lebih Nyaman</p>
          </div>

          {/* User Profile Avatar with Verification Badge & Keluar Button */}
          <div className="flex items-center gap-1.5">
            {onOpenNotifications && (
              <button
                type="button"
                onClick={onOpenNotifications}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-all relative border border-white/20 active:scale-95"
                title="Pusat Notifikasi Warga"
              >
                <Bell size={15} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-amber-400 text-red-950 text-[10px] font-black flex items-center justify-center shadow-xs">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('profil')}
              className="flex items-center gap-1.5 p-1 pr-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/20 group"
              title="Buka Profil Pengguna"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden bg-white/20 flex items-center justify-center border border-white">
                <img
                  src={activeUser.avatar}
                  alt={activeUser.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-[11px] font-bold text-white max-w-[65px] truncate">
                {activeUser.name.split(' ')[0]}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="px-2 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all text-xs font-bold flex items-center gap-1 border border-white/20 shadow-xs"
              title="Keluar dari Akun"
            >
              <LogOut size={13} />
              <span className="text-[10px]">Keluar</span>
            </button>
          </div>
        </div>

        {/* User Greeting & Switch Role Alert */}
        <div className="flex items-center justify-between mb-3 text-left">
          <div>
            <span className="text-xs text-red-200">Selamat datang,</span>
            <p className="text-base font-bold text-white leading-tight">
              Halo, {activeUser.name.split(' ')[0]}!
            </p>
          </div>
          {userRole === 'super_admin' ? (
            <button
              onClick={() => onNavigate('super_admin_dashboard')}
              className="px-2.5 py-1 rounded-full bg-purple-400 text-purple-950 font-black text-[10px] flex items-center gap-1 shadow-xs hover:bg-purple-300 transition-colors"
            >
              <span>👑 Super Admin</span>
              <ArrowRight size={12} />
            </button>
          ) : userRole === 'admin' ? (
            <button
              onClick={() => onNavigate('admin_dashboard')}
              className="px-2.5 py-1 rounded-full bg-sky-300 text-sky-950 font-black text-[10px] flex items-center gap-1 shadow-xs hover:bg-sky-200 transition-colors"
            >
              <span>🛡️ Admin Ops</span>
              <ArrowRight size={12} />
            </button>
          ) : userRole === 'mitra' ? (
            <button
              onClick={() => onNavigate('mitra_dashboard')}
              className="px-2.5 py-1 rounded-full bg-amber-400 text-red-950 font-bold text-[10px] flex items-center gap-1 shadow-xs"
            >
              <span>🚲 Mode Partner</span>
              <ArrowRight size={12} />
            </button>
          ) : userRole === 'merchant' ? (
            <button
              onClick={() => onNavigate('merchant_dashboard')}
              className="px-2.5 py-1 rounded-full bg-emerald-400 text-emerald-950 font-bold text-[10px] flex items-center gap-1 shadow-xs"
            >
              <span>🏪 Mode Lapak</span>
              <ArrowRight size={12} />
            </button>
          ) : (
            <div className="flex items-center gap-1 text-[11px] text-red-100 bg-red-800/60 px-2.5 py-0.5 rounded-full border border-red-600/60">
              <span>{activeUser.roleTitle || 'Warga Terverifikasi'}</span>
            </div>
          )}
        </div>

        {/* Search Bar with live service matching */}
        <div className="relative mb-2.5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari layanan desa, pasar, info & armada..."
            className="w-full pl-9 pr-8 py-2.5 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-xs font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all"
          />
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X size={13} />
            </button>
          )}

          {/* Quick Service Match Dropdown */}
          {searchQuery.trim().length > 0 && (() => {
            const matches = ALL_VILLAGE_SERVICES.filter(
              (s) =>
                s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (matches.length === 0) return null;
            return (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-30 text-left max-h-56 overflow-y-auto">
                <div className="flex items-center justify-between px-2 py-1 border-b border-slate-100 mb-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    Layanan Terkait ({matches.length})
                  </span>
                  <span className="text-[9px] text-slate-400">Klik untuk membuka</span>
                </div>
                <div className="space-y-1">
                  {matches.map((item) => {
                    const Icon = item.icon;
                    const count = serviceUsageMap[item.id] ?? item.defaultUsage;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={(e) => {
                          setSearchQuery('');
                          handleServiceClick(item, e);
                        }}
                        className="w-full p-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-left transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.bg}`}>
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-red-700 truncate">
                                {item.title}
                              </span>
                              <span className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.2 rounded shrink-0">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">{item.subtitle}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <span className="text-[10px] font-bold text-red-700">Buka →</span>
                          <span className="text-[8px] text-slate-400 block">{count}x</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Location selector & GPS Detection */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-1 text-[11px] text-red-100 hover:text-white transition-colors bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-lg"
          >
            <MapPin size={12} className="text-amber-300 shrink-0" />
            <span className="font-semibold truncate max-w-[170px]">
              {currentLocation.name}
            </span>
            <ChevronRight size={13} className="shrink-0 text-red-200" />
          </button>

          <button
            type="button"
            onClick={handleRequestGps}
            disabled={gpsLoading}
            className="flex items-center gap-1 text-[10px] font-bold text-amber-100 hover:text-white bg-amber-500/25 hover:bg-amber-500/35 px-2 py-1 rounded-lg border border-amber-300/30 transition-all cursor-pointer shadow-2xs"
            title="Minta Izin & Gunakan Lokasi Aktual Perangkat"
          >
            {gpsLoading ? (
              <RefreshCw size={11} className="animate-spin text-amber-300" />
            ) : (
              <Navigation size={11} className="text-amber-300" />
            )}
            <span>{gpsLoading ? 'Mencari...' : gpsResult ? `GPS Aktif (±${gpsResult.accuracy}m)` : 'GPS Aktual'}</span>
          </button>
        </div>
      </div>

      {/* Notifikasi Otomatis Login Harian Warga */}
      {dailyLoginNotice && (
        <div className="px-4 mt-2.5">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md border border-emerald-400/40 flex items-center justify-between text-left animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                <Sparkles size={16} className="text-amber-300" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase text-emerald-200 block">
                  Bonus Login Aktivitas (+5 Poin)
                </span>
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {dailyLoginNotice}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDailyLoginNotice(null)}
              className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white shrink-0 cursor-pointer"
              title="Tutup Notifikasi"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Widget Gamifikasi Warga (Ukuran ~20-25% tinggi layar) */}
      <div className="px-4 mt-2.5">
        <FloatingGamificationWidget
          currentUser={activeUser}
          points={pointsState}
          onNavigate={onNavigate}
          onOpenLeaderboard={onOpenLeaderboard || (() => onNavigate('profil'))}
          dailyBonusAwarded={hasClaimedToday}
        />
      </div>

      {/* Dynamic Services Grid: 7 Teratas Berdasarkan Frekuensi Penggunaan + 1 Slot "Lainnya" */}
      <div className="px-4 mt-3 text-left">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Layanan Warga
              </h2>
              <span className="text-[9px] bg-red-100 text-red-700 font-extrabold px-1.5 py-0.2 rounded-full flex items-center gap-0.5 border border-red-200">
                <Flame size={10} className="text-red-600 fill-red-600" />
                7 Terpopuler
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Urutan dinamis otomatis sesuai yang paling sering digunakan warga
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAllServicesModal(true)}
            className="text-[10px] font-bold text-red-700 hover:text-red-800 flex items-center gap-0.5 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg transition-colors border border-red-100 cursor-pointer"
          >
            <span>Semua (13)</span>
            <ChevronRight size={12} />
          </button>
        </div>

        {/* 4-column layout (2 rows = 8 slots): 7 Layanan Teratas + 1 Slot "Lainnya" */}
        <div className="grid grid-cols-4 gap-2.5">
          {top7Services.map((item) => {
            const Icon = item.icon;
            const usageCount = serviceUsageMap[item.id] ?? item.defaultUsage;
            return (
              <button
                key={item.id}
                type="button"
                onClick={(e) => handleServiceClick(item, e)}
                className="relative flex flex-col items-center text-center p-2 rounded-xl bg-white border border-slate-100 hover:border-red-200 shadow-2xs hover:shadow-xs transition-all group active:scale-95 cursor-pointer"
                title={`${item.title} — ${usageCount.toLocaleString('id-ID')} kali digunakan`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105 shadow-2xs ${item.bg}`}>
                  <Icon size={22} />
                </div>
                <span className="text-[11px] font-bold text-slate-800 leading-tight line-clamp-2">
                  {item.title}
                </span>
                {item.badge ? (
                  <span className="mt-1 text-[8px] font-bold text-red-700 bg-red-50 px-1 py-0.2 rounded border border-red-100">
                    {item.badge}
                  </span>
                ) : (
                  <span className="mt-1 text-[8px] font-medium text-slate-400">
                    {usageCount > 999 ? `${(usageCount / 1000).toFixed(1)}k` : usageCount}x
                  </span>
                )}
              </button>
            );
          })}

          {/* 8th Slot: "Lainnya" Button */}
          <button
            type="button"
            onClick={() => setShowAllServicesModal(true)}
            className="flex flex-col items-center text-center p-2 rounded-xl bg-gradient-to-b from-slate-50 to-red-50/50 border-2 border-dashed border-red-200 hover:border-red-400 shadow-2xs hover:shadow-xs transition-all group active:scale-95 text-slate-800 cursor-pointer"
            title={`Buka ${remainingServices.length} layanan lainnya di Arjawinangun`}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-1.5 bg-red-600 text-white group-hover:bg-red-700 group-hover:scale-105 transition-all shadow-xs">
              <LayoutGrid size={22} />
            </div>
            <span className="text-[11px] font-black text-red-900 leading-tight">
              Lainnya
            </span>
            <span className="mt-1 text-[8px] font-black text-red-700 bg-red-100 px-1.5 py-0.2 rounded-full border border-red-200">
              +{remainingServices.length} Menu
            </span>
          </button>
        </div>
      </div>

      {/* Sorotan Cepat: QRIS Infaq & Hall of Fame (Clean 2-Column Cards) */}
      <div className="px-4 mt-3 grid grid-cols-2 gap-2 text-left">
        {/* Card 1: QRIS Donasi */}
        <div
          onClick={() => onNavigate('qris_donasi')}
          className="p-3 bg-gradient-to-br from-red-700 to-rose-800 text-white rounded-2xl shadow-2xs cursor-pointer hover:shadow-sm transition-all active:scale-[0.99] group border border-red-900/40"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-black bg-white/20 text-amber-200 px-1.5 py-0.2 rounded uppercase tracking-wider">
              QRIS Resmi
            </span>
            <HeartHandshake size={15} className="text-amber-300" />
          </div>
          <h3 className="text-xs font-bold leading-tight mt-1 text-white">
            Infaq & Kas Desa
          </h3>
          <p className="text-[10px] text-red-100 mt-0.5 line-clamp-1">
            Masjid, yatim & kas darurat
          </p>
          <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold text-amber-300 mt-1.5 group-hover:translate-x-0.5 transition-transform">
            <span>Beri Donasi</span>
            <ArrowRight size={10} />
          </span>
        </div>

        {/* Card 2: Hall of Fame */}
        <div
          onClick={() => onNavigate('hall_of_fame')}
          className="p-3 bg-gradient-to-br from-amber-600 to-rose-700 text-white rounded-2xl shadow-2xs cursor-pointer hover:shadow-sm transition-all active:scale-[0.99] group border border-amber-500/40"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-black bg-black/20 text-amber-200 px-1.5 py-0.2 rounded uppercase tracking-wider">
              Apresiasi
            </span>
            <Trophy size={15} className="text-amber-300" />
          </div>
          <h3 className="text-xs font-bold leading-tight mt-1 text-white">
            Hall of Fame
          </h3>
          <p className="text-[10px] text-amber-100 mt-0.5 line-clamp-1">
            Papan Skor Poin & Sosok Teladan
          </p>
          <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold text-amber-200 mt-1.5 group-hover:translate-x-0.5 transition-transform">
            <span>Papan Skor & Tokoh</span>
            <ArrowRight size={10} />
          </span>
        </div>
      </div>

      {/* Akses Cepat Pasar Jungjang & Jasa Siaga (Clean 2-Column Links) */}
      <div className="px-4 mt-2.5 grid grid-cols-2 gap-2 text-left">
        <div
          onClick={() => onNavigate('belanja_offline')}
          className="p-2.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-red-200 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <ShoppingBag size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 leading-tight">Pasar Jungjang</h4>
              <p className="text-[9px] text-slate-400">Sayur & sembako segar</p>
            </div>
          </div>
          <ChevronRight size={13} className="text-slate-400 group-hover:text-red-600 transition-colors" />
        </div>

        <div
          onClick={() => onNavigate('jasa_lokal')}
          className="p-2.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-200 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Wrench size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 leading-tight">Jasa Siaga</h4>
              <p className="text-[9px] text-slate-400">Tukang listrik & ledeng</p>
            </div>
          </div>
          <ChevronRight size={13} className="text-slate-400 group-hover:text-amber-600 transition-colors" />
        </div>
      </div>

      {/* Polling Warga Aktif Highlight (Ringan & Bersih) */}
      {latestActivePoll && (
        <div className="px-4 mt-2.5 text-left">
          <div
            onClick={() => onNavigate('polling')}
            className="p-2.5 bg-gradient-to-r from-red-50 to-amber-50/50 rounded-2xl border border-red-200/80 flex items-center justify-between cursor-pointer hover:border-red-300 transition-all"
          >
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0">
                <Vote size={14} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black uppercase text-red-900 bg-red-100 px-1.5 py-0.2 rounded">
                    Rembug Warga
                  </span>
                  <span className="text-[9px] text-slate-500 font-semibold truncate">
                    {latestActivePoll.totalVotes} suara
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                  {latestActivePoll.title}
                </h4>
              </div>
            </div>
            <span className="text-[10px] font-bold text-red-700 shrink-0 flex items-center gap-0.5">
              <span>Ikut</span>
              <ArrowRight size={10} />
            </span>
          </div>
        </div>
      )}

      {/* Pengumuman Balai Desa (Compact Ticker) */}
      <div className="px-4 mt-2 text-left">
        <div
          onClick={() => onNavigate('komunitas')}
          className="p-2 bg-slate-100/90 hover:bg-slate-200/80 rounded-xl flex items-center justify-between cursor-pointer transition-colors text-[10px]"
        >
          <div className="flex items-center gap-2 truncate pr-2 text-slate-700">
            <span className="shrink-0">📢</span>
            <span className="font-bold shrink-0 text-slate-800">Balai Desa:</span>
            <span className="truncate text-slate-600">
              Layanan digital desa Arjawinangun aktif & siap melayani kebutuhan warga.
            </span>
          </div>
          <ChevronRight size={12} className="text-slate-400 shrink-0" />
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-4 shadow-xl border border-slate-100 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-xs text-slate-800">Pilih Lokasi Wilayah Anda</h3>
              <button
                onClick={() => setShowLocationModal(false)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Tombol Minta Izin Lokasi Perangkat Aktual */}
            <div className="py-2.5 border-b border-slate-100">
              <button
                type="button"
                onClick={async () => {
                  await handleRequestGps();
                  setShowLocationModal(false);
                }}
                disabled={gpsLoading}
                className="w-full p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-between shadow-xs transition-all active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                    {gpsLoading ? (
                      <RefreshCw size={14} className="animate-spin text-white" />
                    ) : (
                      <Navigation size={14} className="text-white" />
                    )}
                  </div>
                  <div className="text-left">
                    <span className="block leading-tight">
                      {gpsLoading ? 'Mendeteksi Koordinat GPS...' : 'Minta Izin & Gunakan Lokasi Aktual'}
                    </span>
                    <span className="text-[10px] text-emerald-100 font-normal">
                      Akurasi tinggi dari GPS perangkat Anda
                    </span>
                  </div>
                </div>
                <ChevronRight size={15} className="text-emerald-200" />
              </button>

              {gpsError && (
                <p className="text-[10px] text-amber-700 mt-1.5 px-1 bg-amber-50 p-1 rounded">
                  ⚠️ {gpsError}
                </p>
              )}
            </div>

            <div className="mt-2 max-h-60 overflow-y-auto space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                Atau Pilih Titik Blok Manual:
              </span>
              {MOCK_LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    onChangeLocation(loc);
                    setShowLocationModal(false);
                  }}
                  className={`w-full p-2 rounded-xl text-left flex items-center justify-between text-xs ${
                    currentLocation.id === loc.id
                      ? 'bg-red-50 text-red-800 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <p>{loc.name}</p>
                    <p className="text-[10px] text-slate-500">{loc.detail}</p>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100">{loc.tag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detail Penilaian Rating Integritas & Layanan Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full text-left shadow-xl border border-slate-100 animate-in zoom-in-95 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Award size={18} className="text-amber-500" />
                <h4 className="font-extrabold text-xs text-slate-900">
                  Sistem Penilaian Warga Arjawinangun
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowRatingModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-[11px] text-slate-600 leading-snug">
                Setiap warga, mitra, dan pedagang memiliki 2 indikator rating sosial desa untuk membangun kepercayaan bersama tanpa bergantung pada uang digital:
              </p>

              {/* Integritas */}
              <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 font-bold text-amber-950">
                    <span>1. Rating Integritas</span>
                  </div>
                  <strong className="text-amber-700 text-xs tabular-nums">
                    {activeUser.integrityRating ? activeUser.integrityRating.toFixed(2) : '4.95'} ★
                  </strong>
                </div>
                <p className="text-[10px] text-slate-600 mt-1">
                  Mengukur kejujuran bertransaksi, ketepatan janji jemput/bayar, dan ketaatan pada norma kerukunan warga.
                </p>
              </div>

              {/* Layanan */}
              <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 font-bold text-rose-950">
                    <span>2. Rating Layanan</span>
                  </div>
                  <strong className="text-rose-700 text-xs tabular-nums">
                    {activeUser.serviceRating ? activeUser.serviceRating.toFixed(2) : '4.88'} ★
                  </strong>
                </div>
                <p className="text-[10px] text-slate-600 mt-1">
                  Mengukur keramahan berkomunikasi, kecepatan respon, dan kepuasan timbal balik sesama warga.
                </p>
              </div>

              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/80 text-[10px] text-slate-500 flex items-center justify-between">
                <span>Predikat Aktif:</span>
                <strong className="text-slate-800 font-bold">{activeUser.reputationBadge}</strong>
              </div>
            </div>

            <div className="pt-1 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowRatingModal(false);
                  onNavigate('profil');
                }}
                className="flex-1 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl"
              >
                Buka Ulasan Profil
              </button>
              <button
                type="button"
                onClick={() => setShowRatingModal(false)}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Feedback Perubahan Frekuensi & Pembukaan Layanan */}
      {serviceFeedbackToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-3.5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-slate-700/80 animate-in fade-in slide-in-from-bottom-3 duration-200 text-xs font-semibold max-w-xs w-[90%] backdrop-blur-md">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-red-950 flex items-center justify-center shrink-0 font-black shadow-xs">
            <Flame size={18} className="fill-red-900" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-black truncate text-xs">
              {serviceFeedbackToast.title}
            </p>
            <p className="text-[10px] text-amber-200 truncate mt-0.5">
              {serviceFeedbackToast.promoted
                ? `⚡ Frekuensi bertambah: ${serviceFeedbackToast.count.toLocaleString('id-ID')}x (Urutan diperbarui!)`
                : serviceFeedbackToast.count > 0
                ? `Membuka layanan • ${serviceFeedbackToast.count.toLocaleString('id-ID')}x digunakan`
                : 'Frekuensi dikembalikan ke pengaturan awal desa'}
            </p>
          </div>
        </div>
      )}

      {/* MODAL: SEMUA LAYANAN DESA (MENU LAINNYA) DENGAN URUTAN DINAMIS */}
      {showAllServicesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col text-left shadow-2xl overflow-hidden border border-slate-200 animate-in slide-in-from-bottom duration-200">
            {/* Header Modal */}
            <div className="p-4 pb-3 bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white shrink-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                    <LayoutGrid size={20} className="text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white leading-tight">
                      Koleksi Lengkap Layanan Desa
                    </h3>
                    <p className="text-[11px] text-red-100 font-medium">
                      13 Layanan Terintegrasi • Urutan Dinamis Frekuensi
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllServicesModal(false)}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Informational Callout: Mekanisme Dinamis */}
              <div className="bg-black/25 rounded-xl p-2.5 border border-white/10 text-[10px] text-red-100 flex items-start gap-2">
                <Flame size={14} className="text-amber-300 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <strong className="text-amber-300">7 Teratas Dinamis:</strong> Layanan yang paling sering digunakan otomatis naik ke beranda utama. Layanan selebihnya berada di menu ini dan siap langsung digunakan.
                </p>
              </div>
            </div>

            {/* Search and Category Filter in Modal */}
            <div className="p-3 border-b border-slate-100 bg-slate-50/70 shrink-0 space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={serviceSearchQuery}
                  onChange={(e) => setServiceSearchQuery(e.target.value)}
                  placeholder="Cari layanan (misal: ojek, tani, donasi, loker, toko)..."
                  className="w-full pl-8 pr-7 py-2 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-xs font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                {serviceSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setServiceSearchQuery('')}
                    className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-slate-600"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
                {['Semua', 'Transportasi', 'Belanja & Kuliner', 'Pekerjaan & Usaha', 'Sosial & Aspirasi'].map((cat) => {
                  const isActive = serviceFilterCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setServiceFilterCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                        isActive
                          ? 'bg-red-700 text-white shadow-2xs'
                          : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable List of Services */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {(() => {
                // Filtered by Category & Search
                const filteredServices = sortedAllServices.filter((svc) => {
                  const matchCat =
                    serviceFilterCategory === 'Semua' || svc.category === serviceFilterCategory;
                  const matchQuery =
                    !serviceSearchQuery.trim() ||
                    svc.title.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
                    svc.subtitle.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
                    svc.description.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
                    svc.category.toLowerCase().includes(serviceSearchQuery.toLowerCase());
                  return matchCat && matchQuery;
                });

                if (filteredServices.length === 0) {
                  return (
                    <div className="text-center py-10">
                      <p className="text-xs text-slate-400 font-bold">
                        Tidak ada layanan yang sesuai dengan "{serviceSearchQuery}"
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setServiceSearchQuery('');
                          setServiceFilterCategory('Semua');
                        }}
                        className="mt-2 text-xs font-bold text-red-700 hover:underline"
                      >
                        Reset Pencarian
                      </button>
                    </div>
                  );
                }

                // Split into:
                // 1) Services that are outside top 7 (remainingServices)
                // 2) Services currently in top 7
                const filteredRemaining = filteredServices.filter((s) =>
                  remainingServices.some((r) => r.id === s.id)
                );
                const filteredTop7 = filteredServices.filter((s) =>
                  top7Services.some((t) => t.id === s.id)
                );

                return (
                  <>
                    {/* BAGIAN 1: LAYANAN DI KATEGORI "LAINNYA" */}
                    {filteredRemaining.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                              Layanan di Kategori "Lainnya" ({filteredRemaining.length})
                            </h4>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          Layanan berikut dapat kamu buka langsung. Frekuensinya otomatis meningkat dan akan naik ke Beranda Utama jika sering digunakan.
                        </p>

                        <div className="grid grid-cols-1 gap-2 pt-1">
                          {filteredRemaining.map((item) => {
                            const Icon = item.icon;
                            const usageCount = serviceUsageMap[item.id] ?? item.defaultUsage;

                            return (
                              <div
                                key={item.id}
                                className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-red-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-2.5"
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${item.bg}`}>
                                    <Icon size={22} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-xs font-black text-slate-900">
                                        {item.title}
                                      </span>
                                      <span className="text-[9px] font-bold bg-red-50 text-red-700 px-1.5 py-0.2 rounded border border-red-100">
                                        {item.category}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 font-medium line-clamp-1 mt-0.5">
                                      {item.subtitle} — {item.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1 text-[10px]">
                                      <span className="font-bold text-slate-700">
                                        🔥 {usageCount.toLocaleString('id-ID')} kali digunakan
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                  <span className="text-[10px] text-slate-500 font-medium">
                                    Siap digunakan warga
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      setShowAllServicesModal(false);
                                      handleServiceClick(item, e);
                                    }}
                                    className="px-3.5 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-black text-xs transition-colors shadow-2xs flex items-center gap-1 active:scale-95"
                                  >
                                    <span>Buka Layanan</span>
                                    <ArrowRight size={12} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* BAGIAN 2: LAYANAN UTAMA SAAT INI (TAMPIL DI BERANDA) */}
                    {filteredTop7.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-200/80">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Flame size={14} className="text-red-600 fill-red-600" />
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                              Layanan Utama (Tampil di Beranda)
                            </h4>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          {filteredTop7.map((item) => {
                            const Icon = item.icon;
                            const usageCount = serviceUsageMap[item.id] ?? item.defaultUsage;

                            return (
                              <div
                                key={item.id}
                                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white transition-colors flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-2xs ${item.bg}`}>
                                    <Icon size={16} />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold text-slate-900 truncate">
                                        {item.title}
                                      </span>
                                      <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded">
                                        {item.category}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-slate-500">
                                      {usageCount.toLocaleString('id-ID')} kali digunakan
                                    </span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    setShowAllServicesModal(false);
                                    handleServiceClick(item, e);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-red-400 text-red-700 font-bold text-[11px] shrink-0 ml-2"
                                >
                                  Buka →
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Modal Bottom Footer Actions */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={handleResetServiceUsage}
                className="px-3 py-2 rounded-xl text-slate-600 hover:text-slate-800 text-[11px] font-bold flex items-center gap-1.5 hover:bg-slate-200 transition-colors"
                title="Kembalikan urutan ranking ke bawaan default desa"
              >
                <RotateCcw size={13} />
                <span>Reset Urutan Default</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAllServicesModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black text-xs transition-colors shadow-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full text-left shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <LogOut size={24} />
            </div>
            <h3 className="font-black text-sm text-slate-900 text-center">
              Keluar dari Akun?
            </h3>
            <p className="text-xs text-slate-500 text-center mt-1.5 leading-relaxed">
              Anda akan keluar dari akun <strong className="text-slate-800">{activeUser.name}</strong> dan kembali ke halaman pemilihan akun / masuk aplikasi.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  onNavigate('welcome');
                }}
                className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <LogOut size={13} />
                <span>Ya, Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
