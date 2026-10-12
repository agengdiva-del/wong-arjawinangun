import React, { useState, useEffect } from 'react';
import { LocationItem, ScreenId, AppRole, UserAccount, VillagePoll } from '../../types';
import { APP_IMAGES, MOCK_LOCATIONS, LOCAL_SERVICES, MOCK_USERS, MOCK_VILLAGE_POLLS } from '../../data/mockData';
import { api } from '../../services/api';
import { requestDeviceLocation, DeviceLocationResult } from '../../services/locationService';
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
} from 'lucide-react';

interface DashboardScreenProps {
  currentLocation: LocationItem;
  onChangeLocation: (loc: LocationItem) => void;
  onNavigate: (screen: ScreenId) => void;
  userRole: AppRole;
  currentUser?: UserAccount;
  villagePolls?: VillagePoll[];
  isWireframe?: boolean;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  currentLocation,
  onChangeLocation,
  onNavigate,
  userRole,
  currentUser: propUser,
  villagePolls = MOCK_VILLAGE_POLLS,
  isWireframe = false,
}) => {
  const activeUser = propUser || MOCK_USERS[userRole] || MOCK_USERS.pelanggan;
  const [searchQuery, setSearchQuery] = useState('');
  const [showOptionalIcons, setShowOptionalIcons] = useState(true);
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

  // Main requested menu icons
  const mainServices = [
    {
      id: 'ojek_becak',
      title: 'Ojek & Becak',
      subtitle: 'Antar jemput warga',
      icon: Bike,
      screen: 'ojek_becak' as ScreenId,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-red-50 text-red-600 border border-red-100',
      badge: 'Lokal',
    },
    {
      id: 'belanja',
      title: 'Belanja Offline',
      subtitle: 'Pasar & warung',
      icon: ShoppingBag,
      screen: 'belanja_offline' as ScreenId,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-sky-50 text-sky-600 border border-sky-100',
      badge: 'Katalog',
    },
    {
      id: 'kuliner',
      title: 'Kuliner',
      subtitle: 'Khas Cirebon',
      icon: UtensilsCrossed,
      screen: 'kuliner' as ScreenId,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-rose-50 text-rose-600 border border-rose-100',
      badge: 'Katalog',
    },
    {
      id: 'qris_donasi',
      title: 'QRIS Donasi',
      subtitle: 'Infaq & sedekah warga',
      icon: HeartHandshake,
      screen: 'qris_donasi' as ScreenId,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-100',
      badge: 'Utama',
    },
    {
      id: 'jasa',
      title: 'Jasa Lokal',
      subtitle: 'Tukang & servis',
      icon: Wrench,
      screen: 'jasa_lokal' as ScreenId,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-amber-50 text-amber-600 border border-amber-100',
    },
    {
      id: 'loker',
      title: 'Lowongan Kerja',
      subtitle: 'Loker desa & harian',
      icon: Briefcase,
      screen: 'loker' as ScreenId,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-indigo-50 text-indigo-600 border border-indigo-100',
      badge: 'Loker',
    },
    {
      id: 'tani_ikan',
      title: 'Tani & Ikan',
      subtitle: 'Gabah, benih & bibit',
      icon: Sprout,
      screen: 'tani_ikan' as ScreenId,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-lime-50 text-lime-700 border border-lime-100',
      badge: 'Katalog',
    },
    {
      id: 'info_desa',
      title: 'Info Desa',
      subtitle: 'Balai desa & surat',
      icon: Landmark,
      screen: 'komunitas' as ScreenId,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-blue-50 text-blue-600 border border-blue-100',
      badge: 'Resmi',
    },
  ];

  // Optional requested menu icons
  const optionalServices = [
    {
      id: 'polling_desa',
      title: 'Polling Desa',
      subtitle: 'Rembug aspirasi',
      icon: Vote,
      screen: 'polling' as ScreenId,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-red-50 text-red-600 border border-red-100',
      badge: 'Baru',
    },
    {
      id: 'antar_barang',
      title: 'Antar Barang',
      subtitle: 'Titip & kirim',
      icon: PackageCheck,
      screen: 'ojek_becak' as ScreenId,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-orange-50 text-orange-600 border border-orange-100',
    },
    {
      id: 'chat_lokal',
      title: 'Chat Lokal',
      subtitle: 'Obrolan warga',
      icon: MessageCircle,
      screen: 'komunitas' as ScreenId,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-teal-50 text-teal-600 border border-teal-100',
    },
    {
      id: 'event_budaya',
      title: 'Event & Budaya',
      subtitle: 'Sintren & wayang',
      icon: CalendarDays,
      screen: 'komunitas' as ScreenId,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-yellow-50 text-yellow-700 border border-yellow-100',
    },
    {
      id: 'hall_of_fame',
      title: 'Hall of Fame',
      subtitle: 'Tokoh & Prestasi',
      icon: Trophy,
      screen: 'hall_of_fame' as ScreenId,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-amber-50 text-amber-800 border border-amber-200',
      badge: 'Tokoh',
    },
  ];

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
            <span className="text-xs text-red-200">Sugeng rawuh,</span>
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
              <span>🚲 Mode Mitra</span>
              <ArrowRight size={12} />
            </button>
          ) : userRole === 'merchant' ? (
            <button
              onClick={() => onNavigate('merchant_dashboard')}
              className="px-2.5 py-1 rounded-full bg-emerald-400 text-emerald-950 font-bold text-[10px] flex items-center gap-1 shadow-xs"
            >
              <span>🏪 Mode Kios</span>
              <ArrowRight size={12} />
            </button>
          ) : (
            <div className="flex items-center gap-1 text-[11px] text-red-100 bg-red-800/60 px-2.5 py-0.5 rounded-full border border-red-600/60">
              <span>{activeUser.roleTitle || 'Warga Terverifikasi'}</span>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-2.5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kebutuhan warga, pasar, & armada..."
            className="w-full pl-9 pr-4 py-2.5 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-xs font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all"
          />
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
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

      {/* PENGGANTI DOMPET: Kartu Penilaian Rating (Integritas & Layanan) Setiap Orang */}
      <div className="px-4 -mt-2.5">
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm text-left">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                <Award size={18} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-black text-slate-900">
                    Penilaian & Reputasi Warga
                  </span>
                  <span className="text-[9px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.2 rounded-full">
                    {activeUser.reputationBadge || 'Warga Terpercaya'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {activeUser.totalReviewsCount || 34} Ulasan dari Warga & Pedagang
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowRatingModal(true)}
              className="text-[10px] font-bold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg transition-colors flex items-center gap-0.5"
            >
              <span>Detail</span>
              <ChevronRight size={12} />
            </button>
          </div>

          {/* Dual Rating Score: Integritas & Layanan */}
          <div className="grid grid-cols-2 gap-2 pt-2.5">
            {/* 1. Rating Integritas */}
            <div
              onClick={() => setShowRatingModal(true)}
              className="p-2 bg-gradient-to-br from-slate-50 to-amber-50/40 rounded-xl border border-slate-100 cursor-pointer hover:border-amber-200 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500">Integritas</span>
                <span className="text-amber-500 text-[10px]">★★★★★</span>
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-black text-slate-900 tabular-nums">
                  {activeUser.integrityRating ? activeUser.integrityRating.toFixed(2) : '4.95'}
                </span>
                <span className="text-[10px] text-slate-400">/ 5.0</span>
              </div>
              <span className="text-[9px] text-emerald-700 font-semibold block truncate mt-0.5">
                Kejujuran & Amanah
              </span>
            </div>

            {/* 2. Rating Layanan */}
            <div
              onClick={() => setShowRatingModal(true)}
              className="p-2 bg-gradient-to-br from-slate-50 to-red-50/40 rounded-xl border border-slate-100 cursor-pointer hover:border-red-200 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500">Layanan</span>
                <span className="text-amber-500 text-[10px]">★★★★★</span>
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-black text-slate-900 tabular-nums">
                  {activeUser.serviceRating ? activeUser.serviceRating.toFixed(2) : '4.88'}
                </span>
                <span className="text-[10px] text-slate-400">/ 5.0</span>
              </div>
              <span className="text-[9px] text-rose-700 font-semibold block truncate mt-0.5">
                Keramahan & Kualitas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* LAYANAN UTAMA WARGA: QRIS DONASI & INFAQ DESA */}
      <div className="px-4 mt-3">
        <div
          onClick={() => onNavigate('qris_donasi')}
          className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 rounded-2xl p-3 text-white shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all active:scale-[0.99] border border-red-900/30 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 text-amber-300">
              <HeartHandshake size={22} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                  Layanan Utama Warga
                </span>
                <span className="text-[9px] bg-red-900/90 text-red-100 px-1.5 py-0.2 rounded font-bold">
                  QRIS Resmi
                </span>
              </div>
              <h3 className="text-xs font-bold text-white leading-tight mt-0.5">
                QRIS Donasi & Infaq Desa Arjawinangun
              </h3>
              <p className="text-[10px] text-red-100 mt-0.5">
                Infaq masjid, santunan yatim & kas siaga desa
              </p>
            </div>
          </div>
          <div className="p-1.5 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
            <ChevronRight size={16} className="text-white" />
          </div>
        </div>
      </div>

      {/* Main Services Grid */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Layanan Utama Warga
          </h2>
          <span className="text-[10px] text-slate-500">Arjawinangun & Sekitar</span>
        </div>

        {/* 4-column or 3-column layout matching native mobile apps */}
        <div className="grid grid-cols-4 gap-2.5">
          {mainServices.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.screen)}
                className="flex flex-col items-center text-center p-2 rounded-xl bg-white border border-slate-100 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all group active:scale-95"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105 ${item.bg}`}>
                  <Icon size={22} />
                </div>
                <span className="text-[11px] font-bold text-slate-800 leading-tight line-clamp-2">
                  {item.title}
                </span>
                {item.badge && (
                  <span className="mt-1 text-[9px] font-bold text-red-700 bg-red-50 px-1 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Toggleable Optional Services */}
        <div className="mt-3 bg-white/70 p-3 rounded-xl border border-slate-200/70">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-500" />
              <span className="text-[11px] font-bold text-slate-700">Layanan Tambahan Desa</span>
            </div>
            <button
              type="button"
              onClick={() => setShowOptionalIcons(!showOptionalIcons)}
              className="text-[10px] font-bold text-red-700 hover:underline"
            >
              {showOptionalIcons ? 'Sembunyikan' : 'Tampilkan'}
            </button>
          </div>

          {showOptionalIcons && (
            <div className="grid grid-cols-4 gap-2 pt-1">
              {optionalServices.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.screen)}
                    className="flex flex-col items-center text-center p-1.5 rounded-lg hover:bg-white transition-all active:scale-95"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1 ${item.bg}`}>
                      <Icon size={18} />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700 leading-tight">
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Promo Spesial Banner (Matching user screenshot) */}
      <div className="px-4 mt-4">
        <div
          onClick={() => onNavigate('belanja_offline')}
          className="relative rounded-2xl overflow-hidden cursor-pointer shadow-sm group border border-slate-200"
        >
          {/* Real Photo Asset */}
          <div className="h-28 w-full bg-slate-200 relative overflow-hidden">
            <img
              src={APP_IMAGES.promoPasar}
              alt="Promo Pasar Tradisional"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent flex flex-col justify-center p-3.5 text-left text-white">
              <span className="inline-block bg-amber-400 text-red-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full w-fit mb-1 uppercase tracking-wider">
                Promo Spesial!
              </span>
              <h3 className="text-xs font-bold leading-snug max-w-[210px] text-white">
                Diskon Belanja Pasar Tradisional Hemat hingga 50%
              </h3>
              <p className="text-[10px] text-amber-200 mt-0.5">
                Kios Mbak Siti & Los Sayur Pasar Jungjang
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-lg">
                  Lihat Promo →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout matching screenshot: Tukang di Sekitar & Kuliner Terdekat */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-2.5 text-left">
        {/* Tukang di Sekitar */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-800">Tukang di Sekitar</h3>
            <button
              onClick={() => onNavigate('jasa_lokal')}
              className="text-[10px] text-red-700 font-semibold hover:underline"
            >
              Semua
            </button>
          </div>

          <div className="space-y-2">
            {LOCAL_SERVICES.slice(0, 2).map((srv) => (
              <div
                key={srv.id}
                onClick={() => onNavigate('jasa_lokal')}
                className="p-1.5 rounded-xl bg-slate-50 hover:bg-red-50/50 border border-slate-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-amber-100 flex items-center justify-center">
                    <img
                      src={srv.avatar}
                      alt={srv.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="overflow-hidden min-w-0">
                    <p className="text-[11px] font-bold text-slate-900 truncate">{srv.name}</p>
                    <p className="text-[9px] text-slate-500 truncate">{srv.trade}</p>
                    <div className="flex items-center gap-1 text-[9px] text-emerald-600 font-medium">
                      <span>✓ Siap</span>
                      <span>·</span>
                      <span>{srv.distance}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kuliner Terdekat */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-800">Kuliner Terdekat</h3>
            <button
              onClick={() => onNavigate('belanja_offline')}
              className="text-[10px] text-red-700 font-semibold hover:underline"
            >
              Semua
            </button>
          </div>

          <div className="space-y-2">
            <div
              onClick={() => onNavigate('belanja_offline')}
              className="p-1.5 rounded-xl bg-slate-50 hover:bg-rose-50/50 border border-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-rose-100">
                  <img
                    src={APP_IMAGES.kulinerCirebon}
                    alt="Kuliner"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="text-[11px] font-bold text-slate-900 truncate">Empal Gentong</p>
                  <p className="text-[9px] text-slate-500">Yu Wasminah</p>
                  <div className="flex items-center gap-1 text-[9px] text-slate-700 font-bold">
                    <span className="text-amber-500">★ 4.9</span>
                    <span>·</span>
                    <span className="text-red-700">Rp 25 rb</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              onClick={() => onNavigate('belanja_offline')}
              className="p-1.5 rounded-xl bg-slate-50 hover:bg-rose-50/50 border border-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-amber-100 flex items-center justify-center text-xs">
                  🍧
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="text-[11px] font-bold text-slate-900 truncate">Es Campur Bu Ani</p>
                  <p className="text-[9px] text-slate-500">Pasar Jungjang</p>
                  <div className="flex items-center gap-1 text-[9px] text-slate-700 font-bold">
                    <span className="text-amber-500">★ 4.8</span>
                    <span>·</span>
                    <span className="text-red-700">Rp 8 rb</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Polling Aspirasi Warga Terkini Highlight Card */}
      {latestActivePoll && (
        <div className="px-4 mt-4 text-left">
          <div className="p-3.5 bg-gradient-to-r from-red-50 via-rose-50 to-amber-50 rounded-2xl border border-red-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center">
                  <Vote size={13} />
                </div>
                <span className="text-[10px] font-extrabold uppercase text-red-900 tracking-wider">
                  Rembug & Polling Warga Aktif
                </span>
              </div>
              <span className="text-[9px] bg-red-100 text-red-800 font-bold px-1.5 py-0.2 rounded-full">
                {latestActivePoll.category}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-black text-slate-900 line-clamp-1">
                {latestActivePoll.title}
              </h4>
              <p className="text-[10px] text-slate-600 line-clamp-2 mt-0.5">
                {latestActivePoll.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-red-100/80">
              <span className="text-[10px] text-slate-500 font-semibold">
                {latestActivePoll.totalVotes} warga berpartisipasi
              </span>
              <button
                type="button"
                onClick={() => onNavigate('polling')}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1"
              >
                <span>Ikut Polling</span>
                <ArrowRight size={11} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hall of Fame & Panggung Kehormatan Desa Card */}
      <div className="px-4 mt-4 text-left">
        <div
          onClick={() => onNavigate('hall_of_fame')}
          className="p-3.5 bg-gradient-to-r from-amber-600 via-rose-700 to-red-800 text-white rounded-2xl shadow-sm border border-amber-400/40 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-lg bg-amber-400 text-red-950 font-black text-xs">
                🏆
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-200">
                Panggung Kehormatan Warga
              </span>
            </div>
            <span className="text-[9px] bg-amber-400/30 text-amber-100 font-extrabold px-2 py-0.5 rounded-full border border-amber-300/40">
              Warga Bisa Mengusulkan
            </span>
          </div>

          <h3 className="text-sm font-black text-white leading-tight">
            Hall of Fame Desa Arjawinangun
          </h3>
          <p className="text-[11px] text-amber-100 mt-0.5 leading-snug">
            Apresiasi Tokoh Masyarakat, Pemuda Inspiratif, Pelajar, Atlet, Pengusaha & Relawan.
          </p>

          <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] text-amber-200 font-bold">
              <span>🌟 6 Kategori</span>
              <span>·</span>
              <span>❤️ Apresiasi & Testimoni</span>
            </div>
            <span className="text-[10px] font-extrabold bg-amber-400 text-red-950 px-2.5 py-1 rounded-lg flex items-center gap-1 group-hover:bg-amber-300 transition-colors">
              <span>Buka Hall of Fame</span>
              <ArrowRight size={11} />
            </span>
          </div>
        </div>
      </div>

      {/* Info Warga & Komunitas Ticker Card */}
      <div className="px-4 mt-4 text-left">
        <div
          onClick={() => onNavigate('komunitas')}
          className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex items-center justify-between cursor-pointer hover:border-amber-300 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-lg">📢</span>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider">
                Pengumuman Balai Desa
              </span>
              <p className="text-xs font-semibold text-slate-800">
                Gotong Royong Bersih Selokan Minggu Pagi di Blok Makmur
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-amber-700 shrink-0" />
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
