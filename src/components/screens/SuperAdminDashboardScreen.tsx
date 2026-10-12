import React, { useState } from 'react';
import { AppRole, ScreenId, UserAccount, BroadcastMessage } from '../../types';
import { MOCK_USERS, MOCK_AUDIT_LOGS, MOCK_BROADCASTS } from '../../data/mockData';
import {
  ArrowLeft,
  ShieldAlert,
  Server,
  Users,
  Settings,
  Radio,
  FileText,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  UserX,
  Search,
  PlusCircle,
  Database,
  Coins,
  RefreshCw,
  Sliders,
  Send,
  Eye,
  ChevronRight,
  ShieldCheck,
  Activity,
  LogOut
} from 'lucide-react';

interface SuperAdminDashboardScreenProps {
  onBack: () => void;
  onSwitchRole: (role: AppRole) => void;
  onNavigate: (screen: ScreenId) => void;
  isWireframe?: boolean;
}

export const SuperAdminDashboardScreen: React.FC<SuperAdminDashboardScreenProps> = ({
  onBack,
  onSwitchRole,
  onNavigate,
  isWireframe = false,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'config' | 'broadcast' | 'audit'>('users');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [systemFeePercent, setSystemFeePercent] = useState<number>(3);
  const [baseTarifBecak, setBaseTarifBecak] = useState<number>(10000);
  const [baseTarifOjek, setBaseTarifOjek] = useState<number>(8000);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  
  // Interactive user accounts list (Bersih siap pakai)
  const [userList, setUserList] = useState<UserAccount[]>([
    MOCK_USERS.super_admin,
    MOCK_USERS.admin,
    MOCK_USERS.mitra,
    MOCK_USERS.merchant,
    MOCK_USERS.pelanggan,
  ]);

  // Modal states
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserAccount | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<AppRole>('admin');

  // Broadcast states
  const [broadcastList, setBroadcastList] = useState<BroadcastMessage[]>(MOCK_BROADCASTS);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState<'Darurat' | 'Info Resmi' | 'Gotong Royong'>('Info Resmi');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Filtered users
  const filteredUsers = userList.filter((u) => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.emailOrPhone.includes(searchQuery) ||
      u.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRole && matchSearch;
  });

  const handleToggleUserStatus = (userId: string) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'aktif' ? 'ditangguhkan' : 'aktif';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleChangeRole = (userId: string, newRole: AppRole) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const titleMap: Record<AppRole, string> = {
            super_admin: 'Super Administrator Sistem',
            admin: 'Admin Operasional Wilayah',
            mitra: 'Mitra Armada & Jasa',
            merchant: 'Merchant / Pedagang',
            pelanggan: 'Warga / Pelanggan',
          };
          return { ...u, role: newRole, roleTitle: titleMap[newRole] };
        }
        return u;
      })
    );
    setSelectedUserForEdit(null);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    const roleTitleMap: Record<AppRole, string> = {
      super_admin: 'Super Administrator Sistem',
      admin: 'Admin Operasional Wilayah',
      mitra: 'Mitra Armada / Jasa',
      merchant: 'Merchant Pedagang Kios',
      pelanggan: 'Warga Terverifikasi',
    };

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: newUserName,
      role: newUserRole,
      roleTitle: roleTitleMap[newUserRole],
      emailOrPhone: newUserPhone || '0812-0000-0000',
      location: 'Kecamatan Arjawinangun',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: 'aktif',
      description: `Akun dibuat langsung oleh Super Admin pada ${new Date().toLocaleDateString('id-ID')}`,
      verifiedBadge: 'Verifikasi Balai Desa',
      joinedDate: 'Oktober 2026',
      integrityRating: 5.0,
      serviceRating: 5.0,
      totalReviewsCount: 0,
      reputationBadge: 'Warga Baru',
    };

    setUserList([newUser, ...userList]);
    setNewUserName('');
    setNewUserPhone('');
    setShowAddUserModal(false);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastContent.trim()) return;

    const newMsg: BroadcastMessage = {
      id: `BC-${Date.now()}`,
      sender: 'Super Admin (Balai Desa Arjawinangun)',
      title: broadcastTitle,
      content: broadcastContent,
      category: broadcastCategory,
      sentAt: 'Baru saja',
      target: 'Seluruh Warga (1.482 HP Terhubung)',
    };

    setBroadcastList([newMsg, ...broadcastList]);
    setBroadcastTitle('');
    setBroadcastContent('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  const handleTriggerBackup = () => {
    setBackupStatus('Sedang mencadangkan database Firestore & user auth...');
    setTimeout(() => {
      setBackupStatus('✅ Sukses! 1.482 data tersimpan aman pada Cloud Storage Balai Desa.');
      setTimeout(() => setBackupStatus(null), 4000);
    }, 1500);
  };

  return (
    <div className={`min-h-full flex flex-col justify-between ${isWireframe ? 'bg-zinc-50' : 'bg-slate-900 text-slate-100'}`}>
      {/* Top Header */}
      <div className={`p-4 border-b ${
        isWireframe
          ? 'bg-zinc-800 text-white border-zinc-700'
          : 'bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white border-purple-800/60 shadow-lg'
      }`}>
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft size={16} />
            <span>Kembali</span>
          </button>

          <div className="text-center">
            <div className="inline-flex items-center gap-1 bg-purple-500/30 text-purple-200 border border-purple-400/30 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
              <ShieldAlert size={11} className="text-purple-300" />
              <span>Super Administrator</span>
            </div>
            <h2 className="text-xs font-black text-white mt-0.5">Balai Desa Arjawinangun</h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onNavigate('polling')}
              className="text-[10px] bg-purple-600 hover:bg-purple-500 text-white font-bold px-2.5 py-1 rounded-lg border border-purple-400/50 shadow-xs flex items-center gap-1 transition-colors"
            >
              <span>🗳️ Polling Warga</span>
            </button>
            <button
              onClick={() => onNavigate('welcome')}
              className="text-[10px] bg-purple-950 hover:bg-purple-900 text-purple-200 font-bold px-2.5 py-1 rounded-lg border border-purple-600/40 cursor-pointer flex items-center gap-1 transition-colors"
              title="Keluar dari Akun Super Admin"
            >
              <LogOut size={11} />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Super Admin Identity Snippet */}
        <div className="mt-3 bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-400 shrink-0">
              <img
                src={MOCK_USERS.super_admin.avatar}
                alt="Super Admin"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <h3 className="text-xs font-extrabold text-white leading-tight flex items-center gap-1">
                <span>{MOCK_USERS.super_admin.name}</span>
                <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.2 rounded font-mono">KUWU</span>
              </h3>
              <p className="text-[10px] text-purple-200">Hak Akses: Pengendali Penuh Seluruh Sistem</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sistem 100% Online</span>
            </span>
            <p className="text-[9px] text-slate-400">Server Latency: 28ms</p>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-3.5 flex-1 text-left overflow-y-auto space-y-3.5">
        {/* Core System Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-semibold">Total Pengguna</span>
              <Users size={13} className="text-indigo-400" />
            </div>
            <p className="text-sm font-extrabold text-white">1.482 <span className="text-[10px] font-normal text-slate-400">Akun</span></p>
            <span className="text-[9px] text-emerald-400">5 Peran Terdaftar</span>
          </div>

          <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-semibold">Status Server</span>
              <Server size={13} className="text-emerald-400" />
            </div>
            <p className="text-sm font-extrabold text-emerald-400">99.98%</p>
            <span className="text-[9px] text-slate-400">Cloud Run Aktif</span>
          </div>

          <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-semibold">Omset Sistem</span>
              <Coins size={13} className="text-amber-400" />
            </div>
            <p className="text-xs font-black text-amber-300">Rp 42.85 Jt</p>
            <span className="text-[9px] text-slate-400">Bulan Oktober</span>
          </div>

          <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-semibold">Kas Sosial Desa</span>
              <ShieldCheck size={13} className="text-purple-400" />
            </div>
            <p className="text-xs font-black text-purple-300">Rp 1.28 Jt</p>
            <span className="text-[9px] text-purple-400">Potongan 3%</span>
          </div>
        </div>

        {/* 4 Tabs Navigation */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'users' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users size={12} />
            <span>Kelola User (5 Peran)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'config' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders size={12} />
            <span>Sistem & Tarif</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('broadcast')}
            className={`flex-1 py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'broadcast' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio size={12} />
            <span>Broadcast Desa</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`flex-1 py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'audit' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity size={12} />
            <span>Log Audit</span>
          </button>
        </div>

        {/* TAB 1: USER MANAGEMENT ACROSS ALL 5 ROLES */}
        {activeTab === 'users' && (
          <div className="space-y-3">
            {/* Search and Role Filter */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama, nomor HP, peran..."
                  className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
                <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: 'all', label: 'Semua' },
                  { id: 'super_admin', label: 'Super Admin' },
                  { id: 'admin', label: 'Admin Ops' },
                  { id: 'mitra', label: 'Mitra' },
                  { id: 'merchant', label: 'Merchant' },
                  { id: 'pelanggan', label: 'Pelanggan' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setRoleFilter(f.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors ${
                      roleFilter === f.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Add User Button */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">
                Menampilkan {filteredUsers.length} Akun Khusus
              </span>
              <button
                type="button"
                onClick={() => setShowAddUserModal(true)}
                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs transition-colors"
              >
                <PlusCircle size={12} />
                <span>Tambah Akun Baru</span>
              </button>
            </div>

            {/* User List */}
            <div className="space-y-2">
              {filteredUsers.map((user) => {
                const roleBadgeColors: Record<AppRole, string> = {
                  super_admin: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                  admin: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                  mitra: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                  merchant: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                  pelanggan: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                };

                return (
                  <div
                    key={user.id}
                    className="p-3 bg-slate-800/90 rounded-xl border border-slate-700/80 flex flex-col gap-2 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-600 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-white">{user.name}</h4>
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${roleBadgeColors[user.role]}`}>
                              {user.role.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {user.emailOrPhone} · {user.location}
                          </p>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        user.status === 'aktif'
                          ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-900/60 text-rose-300 border border-rose-500/40'
                      }`}>
                        {user.status === 'aktif' ? 'Aktif' : 'Ditangguhkan'}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-300 italic bg-slate-900/50 p-1.5 rounded-lg border border-slate-800">
                      "{user.description}"
                    </p>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-700/60 text-[10px]">
                      <span className="text-slate-400 font-mono text-[9px]">ID: {user.id}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedUserForEdit(user)}
                          className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold flex items-center gap-1"
                        >
                          <span>Ubah Peran</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={`px-2 py-1 rounded-lg font-semibold flex items-center gap-1 ${
                            user.status === 'aktif'
                              ? 'bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 border border-rose-700/50'
                              : 'bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                          }`}
                        >
                          {user.status === 'aktif' ? <UserX size={11} /> : <UserCheck size={11} />}
                          <span>{user.status === 'aktif' ? 'Suspend' : 'Aktifkan'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: SYSTEM CONFIG & SETTINGS */}
        {activeTab === 'config' && (
          <div className="space-y-3">
            <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sliders size={14} className="text-purple-400" />
                <span>Pengaturan Bagi Hasil & Kas Paguyuban Desa</span>
              </h4>
              <p className="text-[10px] text-slate-400">
                Setiap transaksi ojek, becak, belanja pasar, dan jasa tukang menyisihkan persentase kecil untuk kas gotong royong dan pemeliharaan balai desa.
              </p>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Bagi Hasil Kas Sosial Desa:</span>
                  <span className="font-bold text-purple-300 text-sm">{systemFeePercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={systemFeePercent}
                  onChange={(e) => setSystemFeePercent(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>0% (Bebas Biaya)</span>
                  <span>3% (Standar Rekomendasi Kuwu)</span>
                  <span>10% (Maksimal)</span>
                </div>
              </div>
            </div>

            {/* Tarif Dasar Pengaturan */}
            <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Coins size={14} className="text-amber-400" />
                <span>Pengaturan Tarif Standar Wilayah Desa</span>
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Tarif Dasar Becak Onthel</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-slate-400 text-xs">Rp</span>
                    <input
                      type="number"
                      value={baseTarifBecak}
                      onChange={(e) => setBaseTarifBecak(Number(e.target.value))}
                      className="w-full pl-8 pr-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Tarif Dasar Ojek Motor</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-slate-400 text-xs">Rp</span>
                    <input
                      type="number"
                      value={baseTarifOjek}
                      onChange={(e) => setBaseTarifOjek(Number(e.target.value))}
                      className="w-full pl-8 pr-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Database & Cloud Backup */}
            <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Database size={14} className="text-emerald-400" />
                    <span>Cadangan & Sinkronisasi Data Desa</span>
                  </h4>
                  <p className="text-[10px] text-slate-400">Sinkronkan data 1.482 warga ke Firestore Cloud Backup</p>
                </div>
                <button
                  type="button"
                  onClick={handleTriggerBackup}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                >
                  <RefreshCw size={12} />
                  <span>Backup Sekarang</span>
                </button>
              </div>

              {backupStatus && (
                <div className="p-2 bg-emerald-950/70 border border-emerald-500/50 rounded-lg text-[11px] text-emerald-200 animate-in fade-in">
                  {backupStatus}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: EMERGENCY BROADCAST DESA */}
        {activeTab === 'broadcast' && (
          <div className="space-y-3">
            <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700">
              <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                <Radio size={14} className="text-red-400" />
                <span>Kirim Siaran Darurat / Warta Balai Desa</span>
              </h4>
              <p className="text-[10px] text-slate-400 mb-3">
                Pesan ini akan langsung muncul sebagai notifikasi prioritas di aplikasi seluruh warga Arjawinangun.
              </p>

              <form onSubmit={handleSendBroadcast} className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1">Kategori Siaran</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['Info Resmi', 'Darurat', 'Gotong Royong'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setBroadcastCategory(cat)}
                        className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border transition-colors ${
                          broadcastCategory === cat
                            ? cat === 'Darurat'
                              ? 'bg-red-700 text-white border-red-500'
                              : 'bg-purple-600 text-white border-purple-400'
                            : 'bg-slate-900 text-slate-400 border-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1">Judul Siaran</label>
                  <input
                    type="text"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="Contoh: Pemadaman Listrik Terencana PLN Gardu Induk"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1">Isi Pesan Siaran</label>
                  <textarea
                    rows={3}
                    value={broadcastContent}
                    onChange={(e) => setBroadcastContent(e.target.value)}
                    placeholder="Tuliskan informasi penting lengkap untuk seluruh warga..."
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                    required
                  />
                </div>

                {broadcastSuccess && (
                  <div className="p-2 bg-emerald-900/60 border border-emerald-500/50 rounded-lg text-[11px] text-emerald-200">
                    ✅ Siaran sukses terkirim ke 1.482 ponsel warga terdaftar!
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <Send size={13} />
                  <span>Kirim Broadcast Sekarang</span>
                </button>
              </form>
            </div>

            {/* Broadcast History */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Riwayat Siaran Terkirim
              </span>
              {broadcastList.length === 0 ? (
                <div className="p-6 bg-slate-800/80 rounded-xl border border-dashed border-slate-700 text-center space-y-1">
                  <p className="text-xs font-bold text-slate-300">Belum Ada Siaran Terkirim</p>
                  <p className="text-[10px] text-slate-500">Pemberitahuan darurat atau gotong royong warga akan tercatat di sini.</p>
                </div>
              ) : (
                broadcastList.map((bc) => (
                  <div key={bc.id} className="p-2.5 bg-slate-800 rounded-xl border border-slate-700 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{bc.title}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 font-mono">
                        {bc.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300">{bc.content}</p>
                    <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-700/60">
                      <span>{bc.sentAt}</span>
                      <span>Target: {bc.target}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT TRAIL LOG */}
        {activeTab === 'audit' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Log Keamanan & Perubahan Sistem
              </span>
              <span className="text-[9px] text-slate-500">Real-time Cloud Log</span>
            </div>

            {MOCK_AUDIT_LOGS.length === 0 ? (
              <div className="p-6 bg-slate-800/80 rounded-xl border border-dashed border-slate-700 text-center space-y-1">
                <p className="text-xs font-bold text-slate-300">Log Keamanan Bersih</p>
                <p className="text-[10px] text-slate-500">Sistem siap mencatat setiap perubahan konfigurasi dan keamanan secara otomatis.</p>
              </div>
            ) : (
              MOCK_AUDIT_LOGS.map((log) => (
                <div key={log.id} className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-300">{log.action}</span>
                    <span className="text-[9px] text-slate-400">{log.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-200">{log.detail}</p>
                  <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-700/50">
                    <span>Pelaksana: <strong>{log.actor}</strong></span>
                    <span className="font-mono text-slate-500">{log.id}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal: Change User Role */}
      {selectedUserForEdit && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-xs rounded-2xl p-4 text-left shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-700">
              <h3 className="text-xs font-bold text-white">Ubah Peran Pengguna</h3>
              <button onClick={() => setSelectedUserForEdit(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <div className="py-3 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <img src={selectedUserForEdit.avatar} alt="" className="w-8 h-8 rounded-full" />
                <div>
                  <p className="font-bold text-white">{selectedUserForEdit.name}</p>
                  <p className="text-[10px] text-slate-400">Peran saat ini: {selectedUserForEdit.role}</p>
                </div>
              </div>

              <label className="block text-[10px] font-semibold text-slate-300 mt-2">Pilih Peran Baru:</label>
              <div className="space-y-1.5">
                {[
                  { role: 'super_admin' as AppRole, label: 'Super Admin (Kelola Seluruh Sistem)' },
                  { role: 'admin' as AppRole, label: 'Admin (Kelola Operasional Lapangan)' },
                  { role: 'mitra' as AppRole, label: 'Mitra (Driver Becak/Ojek/Tukang)' },
                  { role: 'merchant' as AppRole, label: 'Merchant (Pedagang Pasar / Warung)' },
                  { role: 'pelanggan' as AppRole, label: 'Pelanggan (Warga Pembeli/Pemesan)' },
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleChangeRole(selectedUserForEdit.id, item.role)}
                    className={`w-full p-2 rounded-lg text-[11px] font-semibold text-left transition-colors ${
                      selectedUserForEdit.role === item.role
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add User Manually */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-xs rounded-2xl p-4 text-left shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-700">
              <h3 className="text-xs font-bold text-white">Tambah Akun Khusus Baru</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <form onSubmit={handleAddUser} className="py-3 text-xs space-y-2.5">
              <div>
                <label className="block text-[10px] text-slate-300 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Contoh: Pak Carik Sutrisno"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-300 mb-1">Nomor HP / WhatsApp</label>
                <input
                  type="tel"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  placeholder="0812-XXXX-XXXX"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-300 mb-1">Pilih Peran Akun</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as AppRole)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="super_admin">1. Super Admin</option>
                  <option value="admin">2. Admin Operasional</option>
                  <option value="mitra">3. Mitra</option>
                  <option value="merchant">4. Merchant</option>
                  <option value="pelanggan">5. Pelanggan</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Simpan & Daftarkan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
