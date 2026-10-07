import React, { useState } from 'react';
import { LocationItem, ScreenId, AppRole } from '../../types';
import { APP_IMAGES, MOCK_LOCATIONS, LOCAL_SERVICES } from '../../data/mockData';
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
  QrCode,
  CalendarDays,
  Sprout,
  Sparkles,
  Wallet,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface DashboardScreenProps {
  currentLocation: LocationItem;
  onChangeLocation: (loc: LocationItem) => void;
  onNavigate: (screen: ScreenId) => void;
  userRole: AppRole;
  isWireframe?: boolean;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  currentLocation,
  onChangeLocation,
  onNavigate,
  userRole,
  isWireframe = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOptionalIcons, setShowOptionalIcons] = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState(125000);
  const [showTopupAlert, setShowTopupAlert] = useState(false);

  // Main 7 requested menu icons
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
      badge: 'Segar',
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
      id: 'antar_barang',
      title: 'Antar Barang',
      subtitle: 'Titip & kirim',
      icon: PackageCheck,
      screen: 'ojek_becak' as ScreenId,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-orange-50 text-orange-600 border border-orange-100',
    },
    {
      id: 'kuliner',
      title: 'Kuliner',
      subtitle: 'Khas Cirebon',
      icon: UtensilsCrossed,
      screen: 'belanja_offline' as ScreenId,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-rose-50 text-rose-600 border border-rose-100',
    },
    {
      id: 'loker',
      title: 'Lowongan Kerja',
      subtitle: 'Loker desa & harian',
      icon: Briefcase,
      screen: 'komunitas' as ScreenId,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    },
    {
      id: 'info_desa',
      title: 'Info Desa',
      subtitle: 'Balai desa & surat',
      icon: Landmark,
      screen: 'komunitas' as ScreenId,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      badge: 'Resmi',
    },
  ];

  // Optional 4 requested menu icons
  const optionalServices = [
    {
      id: 'chat_lokal',
      title: 'Chat Lokal',
      subtitle: 'Obrolan warga',
      icon: MessageCircle,
      screen: 'komunitas' as ScreenId,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-teal-50 text-teal-600 border border-teal-100',
    },
    {
      id: 'dompet_qris',
      title: 'Dompet / QRIS',
      subtitle: 'Bayar mudah',
      icon: QrCode,
      screen: 'dashboard' as ScreenId,
      action: () => setShowTopupAlert(true),
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-purple-50 text-purple-600 border border-purple-100',
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
      id: 'tani_ikan',
      title: 'Tani & Ikan',
      subtitle: 'Gabah & pupuk',
      icon: Sprout,
      screen: 'komunitas' as ScreenId,
      bg: isWireframe ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-lime-50 text-lime-700 border border-lime-100',
    },
  ];

  return (
    <div className={`min-h-full pb-20 ${isWireframe ? 'bg-zinc-50' : 'bg-slate-50'}`}>
      {/* Top Hero Crimson Header matching user screenshot */}
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

          {/* User Profile Avatar */}
          <button
            type="button"
            onClick={() => onNavigate('profil')}
            className="flex items-center gap-2 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/20"
            title="Buka Profil"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20 flex items-center justify-center border border-white">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                alt="Ageng"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </button>
        </div>

        {/* User Greeting & Switch Role Alert */}
        <div className="flex items-center justify-between mb-3 text-left">
          <div>
            <span className="text-xs text-red-200">Sugeng rawuh,</span>
            <p className="text-base font-bold text-white leading-tight">Halo, Ageng!</p>
          </div>
          {userRole === 'mitra' ? (
            <button
              onClick={() => onNavigate('mitra_dashboard')}
              className="px-2.5 py-1 rounded-full bg-amber-400 text-red-950 font-bold text-[10px] flex items-center gap-1 shadow-xs"
            >
              <span>Mode Mitra Aktif</span>
              <ArrowRight size={12} />
            </button>
          ) : (
            <div className="flex items-center gap-1 text-[11px] text-red-100 bg-red-800/60 px-2 py-0.5 rounded-full">
              <span>Warga Terverifikasi RT 03</span>
            </div>
          )}
        </div>

        {/* Search Bar matching screenshot */}
        <div className="relative mb-2.5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kebutuhan kamu di sini..."
            className="w-full pl-9 pr-4 py-2.5 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-xs font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all"
          />
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
        </div>

        {/* Location selector matching screenshot "📍 Karangmulya, Jawa Barat >" */}
        <button
          type="button"
          onClick={() => setShowLocationModal(true)}
          className="flex items-center gap-1 text-[11px] text-red-100 hover:text-white transition-colors bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-lg w-fit"
        >
          <MapPin size={12} className="text-amber-300 shrink-0" />
          <span className="font-semibold truncate max-w-[200px]">
            {currentLocation.name}, {currentLocation.detail}
          </span>
          <ChevronRight size={13} className="shrink-0 text-red-200" />
        </button>
      </div>

      {/* Quick Dompet Digital / QRIS Widget */}
      <div className="px-4 -mt-2">
        <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <Wallet size={16} />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-500 block font-medium">Dompet Wong Pay</span>
              <span className="text-xs font-extrabold text-slate-900 tabular-nums">
                Rp {walletBalance.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setWalletBalance((prev) => prev + 50000);
                setShowTopupAlert(true);
              }}
              className="px-2.5 py-1 text-[11px] font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              + Isi Saldo
            </button>
            <button
              type="button"
              onClick={() => setShowTopupAlert(true)}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              title="Scan QRIS"
            >
              <QrCode size={15} />
            </button>
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
                    onClick={() => {
                      if (item.action) item.action();
                      else onNavigate(item.screen);
                    }}
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
            <div className="mt-2 max-h-60 overflow-y-auto space-y-1">
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

      {/* Top up / QRIS feedback modal */}
      {showTopupAlert && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full text-center shadow-xl border border-slate-100 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={24} />
            </div>
            <h4 className="font-bold text-sm text-slate-900">QRIS Cirebon Pay Terhubung</h4>
            <p className="text-xs text-slate-600 mt-1">
              Saldo Wong Pay Anda saat ini: <strong>Rp {walletBalance.toLocaleString('id-ID')}</strong>. Siap digunakan untuk transaksi ojek, becak, dan belanja pasar.
            </p>
            <button
              onClick={() => setShowTopupAlert(false)}
              className="mt-4 w-full py-2 bg-red-600 text-white font-bold text-xs rounded-xl"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
