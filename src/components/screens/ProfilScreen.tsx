import React, { useState } from 'react';
import { AppRole, OrderRecord, ScreenId, UserAccount, UserReview } from '../../types';
import { MOCK_ORDERS, MOCK_USERS, MOCK_USER_REVIEWS } from '../../data/mockData';
import {
  ArrowLeft,
  User,
  Clock,
  Heart,
  Settings,
  Star,
  ShieldCheck,
  Globe,
  Bell,
  Receipt,
  CheckCircle2,
  ChevronRight,
  LogOut,
  Edit3,
  ShieldAlert,
  Shield,
  Bike,
  Store,
  ExternalLink,
  Lock,
  Award,
  Sparkles,
  Camera,
  X,
  PlusCircle,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';

interface ProfilScreenProps {
  userRole: AppRole;
  userAccounts?: Record<string, UserAccount>;
  onUpdateAccount?: (role: AppRole, data: Partial<UserAccount>) => void;
  onSwitchRole: (newRole: AppRole) => void;
  onNavigate?: (screen: ScreenId) => void;
  onBack: () => void;
  isWireframe?: boolean;
}

export const ProfilScreen: React.FC<ProfilScreenProps> = ({
  userRole,
  userAccounts,
  onUpdateAccount,
  onSwitchRole,
  onNavigate,
  onBack,
  isWireframe = false,
}) => {
  const [activeTab, setActiveTab] = useState<'pribadi' | 'riwayat' | 'favorit' | 'pengaturan' | 'rating'>('pribadi');
  const [language, setLanguage] = useState<'id' | 'crb'>('crb'); // crb: Cirebonan
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<OrderRecord | null>(null);

  const currentUser = userAccounts?.[userRole] || MOCK_USERS[userRole] || MOCK_USERS.pelanggan;

  // Edit Profile Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editPhone, setEditPhone] = useState(currentUser.emailOrPhone);
  const [editLocation, setEditLocation] = useState(currentUser.location);
  const [editRtRw, setEditRtRw] = useState(currentUser.rtRw || 'RT 03 / RW 02');
  const [editNik, setEditNik] = useState(currentUser.nik || '3209141902950005');
  const [editBio, setEditBio] = useState(currentUser.description || '');
  const [editAvatar, setEditAvatar] = useState(currentUser.avatar);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Review Submitting Modal States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [targetReviewUser, setTargetReviewUser] = useState('Mang Duloh (Becak Onthel)');
  const [newIntegrityScore, setNewIntegrityScore] = useState(5.0);
  const [newServiceScore, setNewServiceScore] = useState(5.0);
  const [newCommentText, setNewCommentText] = useState('');
  const [reviewsList, setReviewsList] = useState<UserReview[]>(
    MOCK_USER_REVIEWS[currentUser.id] || MOCK_USER_REVIEWS['usr-pelanggan'] || []
  );

  const avatarPresets = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  ];

  const handleOpenEditModal = () => {
    setEditName(currentUser.name);
    setEditPhone(currentUser.emailOrPhone);
    setEditLocation(currentUser.location);
    setEditRtRw(currentUser.rtRw || 'RT 03 / RW 02');
    setEditNik(currentUser.nik || '3209141902950005');
    setEditBio(currentUser.description || '');
    setEditAvatar(currentUser.avatar);
    setShowEditModal(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    if (onUpdateAccount) {
      onUpdateAccount(userRole, {
        name: editName.trim(),
        emailOrPhone: editPhone.trim(),
        location: editLocation.trim(),
        rtRw: editRtRw.trim(),
        nik: editNik.trim(),
        description: editBio.trim(),
        avatar: editAvatar,
      });
    }

    setShowEditModal(false);
    setSaveSuccessNotice('Profil asli Anda berhasil disimpan dan tersinkronisasi ke seluruh layanan!');
    setTimeout(() => setSaveSuccessNotice(null), 3500);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newRev: UserReview = {
      id: `rev-${Date.now()}`,
      reviewerName: currentUser.name,
      reviewerRole: currentUser.roleTitle,
      integrityScore: newIntegrityScore,
      serviceScore: newServiceScore,
      comment: newCommentText.trim(),
      date: 'Baru saja',
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewCommentText('');
    setShowReviewModal(false);
    setSaveSuccessNotice('Penilaian berhasil dikirim dan ditambahkan ke reputasi warga!');
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  const roleMeta: Record<AppRole, { title: string; screen: ScreenId; badgeBg: string; text: string }> = {
    super_admin: {
      title: 'Super Admin',
      screen: 'super_admin_dashboard',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
      text: 'Kelola Seluruh Sistem',
    },
    admin: {
      title: 'Admin Operasional',
      screen: 'admin_dashboard',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
      text: 'Kelola Operasional Lapangan',
    },
    mitra: {
      title: 'Mitra Warga',
      screen: 'mitra_dashboard',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      text: 'Becak, Ojek & Tukang',
    },
    merchant: {
      title: 'Merchant Kios',
      screen: 'merchant_dashboard',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      text: 'Kios Pasar & Warung',
    },
    pelanggan: {
      title: 'Pelanggan',
      screen: 'dashboard',
      badgeBg: 'bg-red-100 text-red-800 border-red-200',
      text: 'Warga Pembeli & Pemesan',
    },
  };

  return (
    <div className={`min-h-full flex flex-col justify-between ${isWireframe ? 'bg-zinc-50' : 'bg-slate-50'}`}>
      {/* Top Header */}
      <div className={`p-4 border-b ${isWireframe ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-red-700 text-white border-red-800'}`}>
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft size={16} />
            <span>Kembali</span>
          </button>
          <h2 className="text-sm font-bold truncate">Profil Pengguna</h2>
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold flex items-center gap-1 transition-colors"
            title="Keluar dari Akun"
          >
            <LogOut size={12} />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-4 flex-1 text-left overflow-y-auto space-y-4">
        {/* Profile Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-red-500 shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm font-extrabold text-slate-900 truncate">{currentUser.name}</h3>
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              </div>
              <p className="text-xs text-slate-500">{currentUser.emailOrPhone} · {currentUser.location}</p>

              {/* Role Badge and Simple Inline 1-Tap Switcher */}
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${roleMeta[userRole]?.badgeBg || 'bg-red-100 text-red-800'}`}>
                  {roleMeta[userRole]?.title || userRole}
                </span>
                <span className="text-[10px] text-slate-400">· {roleMeta[userRole]?.text}</span>
              </div>
            </div>
          </div>

          {/* Role Switching: Public Roles vs Dedicated Admin Portal */}
          {userRole !== 'super_admin' && userRole !== 'admin' ? (
            <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Ganti Akun Layanan Warga:
                </span>
                <span className="text-[9px] text-slate-400">3 Peran Publik</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center">
                {[
                  { role: 'pelanggan' as AppRole, icon: User, label: 'Pelanggan / Warga', activeBg: 'bg-red-600 text-white shadow-xs' },
                  { role: 'mitra' as AppRole, icon: Bike, label: 'Mitra Armada', activeBg: 'bg-amber-600 text-white shadow-xs' },
                  { role: 'merchant' as AppRole, icon: Store, label: 'Merchant Kios', activeBg: 'bg-emerald-600 text-white shadow-xs' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = userRole === item.role;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => onSwitchRole(item.role)}
                      className={`p-2 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? item.activeBg
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Icon size={15} className="mb-0.5 shrink-0" />
                      <span className="truncate w-full leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dedicated Admin Portal Access Link */}
              {onNavigate && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => onNavigate('admin_portal_login')}
                    className="w-full p-2 rounded-xl border border-dashed border-slate-300 hover:border-purple-300 bg-slate-50 hover:bg-purple-50/50 text-slate-600 hover:text-purple-900 text-[10px] font-bold flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <Lock size={12} className="text-amber-500" />
                      <span>Portal Khusus Petugas Balai Desa (Admin & Kuwu)</span>
                    </div>
                    <ChevronRight size={13} className="text-slate-400" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Administrator Internal View */
            <div className="mt-3 pt-2.5 border-t border-purple-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider">
                  Hak Akses Petugas Balai Desa:
                </span>
                <span className="text-[9px] font-mono bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-bold">
                  Internal
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-center">
                <button
                  type="button"
                  onClick={() => onSwitchRole('super_admin')}
                  className={`p-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                    userRole === 'super_admin'
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <ShieldAlert size={14} />
                  <span>Super Admin (Kuwu)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSwitchRole('admin')}
                  className={`p-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                    userRole === 'admin'
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Shield size={14} />
                  <span>Admin Operasional</span>
                </button>
              </div>

              <div className="pt-1 flex items-center justify-between text-[10px]">
                <button
                  type="button"
                  onClick={() => onSwitchRole('pelanggan')}
                  className="text-slate-500 hover:text-red-700 font-semibold underline"
                >
                  ← Beralih ke Akun Warga (Pelanggan)
                </button>
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate('admin_portal_login')}
                    className="text-purple-700 font-bold hover:underline"
                  >
                    Halaman Portal Petugas →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Jump to Role Dashboard shortcut (if not on customer dashboard) */}
          {userRole !== 'pelanggan' && onNavigate && (
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl">
              <div className="text-[11px]">
                <span className="font-bold text-slate-800 block">Dashboard Peran Khusus</span>
                <span className="text-[10px] text-slate-500">{roleMeta[userRole]?.text}</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(roleMeta[userRole].screen)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-lg flex items-center gap-1 transition-colors"
              >
                <span>Buka Dashboard</span>
                <ExternalLink size={11} />
              </button>
            </div>
          )}

          {/* Tombol Keluar Akun Cepat */}
          <div className="mt-3 pt-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center gap-2 border border-red-200 transition-colors shadow-2xs"
            >
              <LogOut size={14} />
              <span>Keluar dari Akun ({currentUser.name})</span>
            </button>
          </div>
        </div>

        {/* Tab Menus requested in Brief */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-5 text-center border-b border-slate-100 p-1 bg-slate-50">
            <button
              onClick={() => setActiveTab('pribadi')}
              className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-colors ${
                activeTab === 'pribadi' ? 'bg-white text-red-700 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Data Pribadi
            </button>
            <button
              onClick={() => setActiveTab('riwayat')}
              className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-colors ${
                activeTab === 'riwayat' ? 'bg-white text-red-700 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Riwayat
            </button>
            <button
              onClick={() => setActiveTab('favorit')}
              className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-colors ${
                activeTab === 'favorit' ? 'bg-white text-red-700 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Favorit
            </button>
            <button
              onClick={() => setActiveTab('pengaturan')}
              className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-colors ${
                activeTab === 'pengaturan' ? 'bg-white text-red-700 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Pengaturan
            </button>
            <button
              onClick={() => setActiveTab('rating')}
              className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-colors ${
                activeTab === 'rating' ? 'bg-white text-red-700 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Ulasan
            </button>
          </div>

          <div className="p-4">
            {/* 1. DATA PRIBADI */}
            {activeTab === 'pribadi' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Nama Lengkap</span>
                  <span className="font-bold text-slate-800">Ageng Prasetyo</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Nomor WhatsApp</span>
                  <span className="font-bold text-slate-800">0812-3456-7890</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Nomor Induk Kependudukan (NIK)</span>
                  <span className="font-mono text-slate-800">320914••••••••01</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Dusun / Blok Domisili</span>
                  <span className="font-bold text-slate-800">Blok Makmur, Arjawinangun</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Status Warga</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>Terverifikasi Balai Desa</span>
                  </span>
                </div>

                <button
                  type="button"
                  className="w-full mt-3 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700 font-bold flex items-center justify-center gap-1.5"
                >
                  <Edit3 size={13} />
                  <span>Perbarui Data KTP / Alamat</span>
                </button>
              </div>
            )}

            {/* 2. RIWAYAT TRANSAKSI */}
            {activeTab === 'riwayat' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Semua Transaksi Selesai
                  </span>
                  <span className="text-[10px] text-slate-500">3 Pesanan Terakhir</span>
                </div>

                {MOCK_ORDERS.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedReceipt(ord)}
                    className="p-3 rounded-xl border border-slate-200/80 hover:border-red-300 hover:bg-red-50/20 transition-all cursor-pointer text-left"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{ord.title}</h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{ord.subtitle}</p>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-500">
                      <span>{ord.date} · {ord.paymentMethod}</span>
                      <strong className="text-red-700 text-xs tabular-nums">
                        Rp {ord.total.toLocaleString('id-ID')}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. FAVORIT */}
            {activeTab === 'favorit' && (
              <div className="space-y-2.5 text-left text-xs">
                <div className="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-slate-900">Kios Mbak Siti - Sayur Segar</h5>
                    <p className="text-[10px] text-slate-500">Pasar Jungjang · Langganan Sayur & Bumbu</p>
                  </div>
                  <span className="text-red-600">❤️</span>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-slate-900">Mang Duloh - Becak Onthel No. 14</h5>
                    <p className="text-[10px] text-slate-500">Pangkalan Pos Blok Makmur</p>
                  </div>
                  <span className="text-red-600">❤️</span>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-slate-900">Kang Solihin - Tukang Listrik</h5>
                    <p className="text-[10px] text-slate-500">Blok Makmur · Siaga MCB & Lampu</p>
                  </div>
                  <span className="text-red-600">❤️</span>
                </div>
              </div>
            )}

            {/* 4. PENGATURAN */}
            {activeTab === 'pengaturan' && (
              <div className="space-y-3 text-xs text-left">
                {/* Language Switcher */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <span className="font-bold text-slate-800 block">Bahasa Aplikasi</span>
                    <span className="text-[10px] text-slate-500">Gunakan dialek khas Cirebonan atau Bahasa Indonesia</span>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="p-1.5 border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    <option value="crb">Basa Cerbonan</option>
                    <option value="id">Bahasa Indonesia</option>
                  </select>
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <span className="font-bold text-slate-800 block">Notifikasi WhatsApp</span>
                    <span className="text-[10px] text-slate-500">Kirim struk dan konfirmasi jemputan via WA</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      notificationsEnabled ? 'bg-red-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        notificationsEnabled ? 'left-4.5' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Mode Hemat */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <span className="font-bold text-slate-800 block">Mode Ringan (Hemat Kuota)</span>
                    <span className="text-[10px] text-slate-500">Optimalkan gambar untuk sinyal lemah di pelosok blok</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Aktif
                  </span>
                </div>

                {/* Sesi & Logout */}
                <div className="pt-2">
                  <span className="font-bold text-slate-800 block mb-1.5">Sesi & Keamanan</span>
                  <button
                    type="button"
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <LogOut size={15} />
                    <span>Keluar Akun & Ganti Pengguna</span>
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-1">
                    Keluar untuk masuk kembali dengan peran atau nomor lain
                  </p>
                </div>
              </div>
            )}

            {/* 5. RATING & ULASAN */}
            {activeTab === 'rating' && (
              <div className="space-y-2.5 text-xs text-left">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Ulasan untuk: Mang Duloh (Becak)</span>
                    <span className="text-amber-500 font-bold">★★★★★</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 italic">
                    "Tarikan becake adem, sabar nungguin kula blanja neng pasar Jungjang. Matur kesuwun mang!"
                  </p>
                  <span className="text-[9px] text-slate-400 mt-1 block">3 hari lalu</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Ulasan untuk: Kang Solihin (Listrik)</span>
                    <span className="text-amber-500 font-bold">★★★★★</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 italic">
                    "Cepet teka, saklar langsung bener rapih. Rekomendasi pisan kanggo warga Blok Makmur."
                  </p>
                  <span className="text-[9px] text-slate-400 mt-1 block">1 minggu lalu</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Digital Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full text-left shadow-xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-200">
              <div className="flex items-center gap-1.5">
                <Receipt size={16} className="text-red-700" />
                <h4 className="font-bold text-xs text-slate-900">Struk Transaksi Digital</h4>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="text-xs text-slate-400">✕</button>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="text-center py-1">
                <span className="text-base font-black text-red-700">Wong Arjawinangun</span>
                <p className="text-[10px] text-slate-500">ID: {selectedReceipt.id}</p>
              </div>

              <div className="border-t border-b border-slate-100 py-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Layanan:</span>
                  <span className="font-bold text-slate-800">{selectedReceipt.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rincian:</span>
                  <span className="text-slate-800 text-right">{selectedReceipt.subtitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Waktu:</span>
                  <span className="text-slate-800">{selectedReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Metode Bayar:</span>
                  <span className="text-slate-800">{selectedReceipt.paymentMethod}</span>
                </div>
              </div>

              <div className="flex justify-between pt-1">
                <span className="font-bold text-slate-800">Total Dibayar:</span>
                <strong className="text-sm font-extrabold text-red-700">
                  Rp {selectedReceipt.total.toLocaleString('id-ID')}
                </strong>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="mt-4 w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
            >
              Tutup Struk
            </button>
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
              Anda akan keluar dari akun <strong className="text-slate-800">{currentUser.name}</strong> ({roleMeta[userRole]?.title}) dan diarahkan ke layar pemilihan akun atau portal balai desa.
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
                  if (onNavigate) {
                    onNavigate('welcome');
                  } else {
                    onBack();
                  }
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
