import React, { useState, useEffect } from 'react';
import { AppRole, LocationItem, UserAccount } from '../../types';
import { MOCK_LOCATIONS, MOCK_USERS } from '../../data/mockData';
import { api } from '../../services/api';
import { requestDeviceLocation, DeviceLocationResult } from '../../services/locationService';
import {
  MapPin,
  ChevronRight,
  ShieldCheck,
  Bike,
  Store,
  User,
  ArrowRight,
  Lock,
  Building2,
  Phone,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Navigation,
  AlertCircle,
  KeyRound,
  X,
  Copy,
  Clock,
  ArrowLeft,
  LogIn,
} from 'lucide-react';

interface WelcomeScreenProps {
  onContinue: (role: AppRole, location: LocationItem, user?: UserAccount) => void;
  onOpenAdminPortal?: () => void;
  currentRole: AppRole;
  currentLocation: LocationItem;
  userAccounts?: Record<string, any>;
  isWireframe?: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onContinue,
  onOpenAdminPortal,
  currentRole: initialRole,
  currentLocation: initialLocation,
  userAccounts,
  isWireframe = false,
}) => {
  const accountsData = userAccounts || MOCK_USERS;

  // Selected Location State & Device Location State
  const [selectedLocation, setSelectedLocation] = useState<LocationItem>(initialLocation);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
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

  // Authentication Mode: 'masuk' | 'daftar'
  const [authMode, setAuthMode] = useState<'masuk' | 'daftar'>('masuk');

  // Direct Login Form States (Masuk Langsung)
  const [loginPhone, setLoginPhone] = useState('');
  const [loginRole, setLoginRole] = useState<AppRole>(initialRole || 'pelanggan');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // WhatsApp Auth Form States (Pendaftaran Warga Baru)
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerRole, setRegisterRole] = useState<AppRole>('pelanggan');
  const [registerRtRw, setRegisterRtRw] = useState('');

  // OTP Verification Modal States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [receivedOtpPreview, setReceivedOtpPreview] = useState<string | null>(null);
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccessNotice, setOtpSuccessNotice] = useState<string | null>(null);

  // Admin Login 8-Digit PIN Lock Modal States
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [adminGatePin, setAdminGatePin] = useState('');
  const [adminGateError, setAdminGateError] = useState<string | null>(null);

  const handleUnlockAdminPortal = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminGatePin.trim() === '45162888') {
      setShowAdminPinModal(false);
      setAdminGatePin('');
      setAdminGateError(null);
      if (onOpenAdminPortal) onOpenAdminPortal();
    } else {
      setAdminGateError('PIN Akses Admin tidak valid. Masukkan 8 digit PIN yang benar.');
    }
  };

  // OTP Timer countdown
  useEffect(() => {
    let timer: any;
    if (showOtpModal && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showOtpModal, otpCountdown]);

  // Request actual GPS location
  const handleRequestDeviceGps = async () => {
    setGpsLoading(true);
    setGpsError(null);
    try {
      const result = await requestDeviceLocation();
      setGpsResult(result);
      setSelectedLocation(result.matchedLocation);
      setGpsLoading(false);
    } catch (err: any) {
      setGpsLoading(false);
      setGpsError(err.message || 'Izin lokasi tidak dapat diakses');
    }
  };

  // Trigger Send WhatsApp OTP
  const handleSendOtp = async (phoneToUse?: string, targetRole?: AppRole) => {
    const targetPhone = phoneToUse || whatsappPhone;
    if (!targetPhone || targetPhone.length < 9) {
      alert('Masukkan nomor WhatsApp yang valid (contoh: 081234567890)');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);

    try {
      const purpose = authMode === 'daftar' ? 'register' : 'login';
      const resp = await api.sendWhatsAppOtp(targetPhone, purpose, targetRole || registerRole);
      setIsVerifyingOtp(false);
      if (resp.success) {
        setReceivedOtpPreview(resp.otpPreview || '829104');
        setOtpCode('');
        setOtpCountdown(60);
        setShowOtpModal(true);
      } else {
        alert(resp.message || 'Gagal mengirim OTP WhatsApp');
      }
    } catch (e: any) {
      setIsVerifyingOtp(false);
      setReceivedOtpPreview('829104');
      setOtpCode('');
      setOtpCountdown(60);
      setShowOtpModal(true);
    }
  };

  // Submit and verify OTP
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.trim().length < 4) {
      setOtpError('Masukkan 6-digit kode verifikasi yang dikirimkan.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);

    try {
      const roleToUse = authMode === 'daftar' ? registerRole : (initialRole || 'pelanggan');
      const newUserData = authMode === 'daftar'
        ? {
            name: registerName || `Warga (${whatsappPhone.slice(-4)})`,
            location: selectedLocation.name,
            rtRw: registerRtRw,
          }
        : undefined;

      const res = await api.verifyWhatsAppOtp(whatsappPhone, otpCode.trim(), roleToUse, newUserData);
      setIsVerifyingOtp(false);

      if (res.success && res.user) {
        setOtpSuccessNotice(`Verifikasi Berhasil! Selamat datang, ${res.user.name}`);
        setTimeout(() => {
          setShowOtpModal(false);
          onContinue(res.user.role, selectedLocation, res.user);
        }, 800);
      } else {
        setOtpError(res.message || 'Kode verifikasi tidak sesuai.');
      }
    } catch (err: any) {
      setIsVerifyingOtp(false);
      // Fallback verifikasi offline
      if (otpCode === '123456' || otpCode === receivedOtpPreview) {
        setOtpSuccessNotice('Verifikasi Berhasil!');
        setTimeout(() => {
          setShowOtpModal(false);
          const user = accountsData[registerRole] || MOCK_USERS[registerRole] || MOCK_USERS.pelanggan;
          onContinue(user.role, selectedLocation, user);
        }, 800);
      } else {
        setOtpError('Kode OTP tidak sesuai. Silakan gunakan tombol isi otomatis di atas.');
      }
    }
  };

  // State Pendaftaran Baru
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Direct Login (Tab Masuk) - HANYA PENGGUNA TERDAFTAR YANG BISA MASUK
  const handleDirectLogin = async () => {
    const cleanPhone = loginPhone.trim();
    if (!cleanPhone || cleanPhone.length < 4) {
      setLoginError('Silakan masukkan nomor WhatsApp / ID Warga terdaftar (minimal 4 karakter).');
      return;
    }

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await api.directLogin(cleanPhone, loginRole);
      setIsLoggingIn(false);

      if (!res.success || !res.user) {
        setLoginError(
          res.message ||
            `Akun "${cleanPhone}" belum terdaftar. Hanya akun yang sudah terdaftar resmi yang bisa masuk. Silakan lakukan pendaftaran di tab "Daftar Baru" terlebih dahulu.`
        );
        return;
      }

      onContinue(res.user.role || loginRole, selectedLocation, res.user);
    } catch (err: any) {
      setIsLoggingIn(false);
      setLoginError(
        err.message ||
          `Akun "${cleanPhone}" belum terdaftar. Hanya akun yang sudah terdaftar resmi yang bisa masuk. Silakan lakukan pendaftaran pada tab "Daftar Baru".`
      );
    }
  };

  // Pendaftaran Langsung & Resmi (Tab Daftar Baru)
  const handleRegisterDirect = async () => {
    if (!registerName.trim() || registerName.trim().length < 3) {
      setRegisterError('Silakan masukkan nama lengkap sesuai KTP (minimal 3 huruf).');
      return;
    }
    const cleanPhone = whatsappPhone.trim().replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setRegisterError('Silakan masukkan nomor WhatsApp yang valid (minimal 8 digit).');
      return;
    }

    setIsRegistering(true);
    setRegisterError(null);
    setRegisterSuccess(null);

    try {
      const res = await api.registerUser({
        name: registerName.trim(),
        phone: cleanPhone,
        role: registerRole,
        location: registerRtRw ? `${registerRtRw}, Arjawinangun` : selectedLocation.name,
        rtRw: registerRtRw.trim() || 'Arjawinangun',
      });
      setIsRegistering(false);

      if (!res.success || !res.user) {
        setRegisterError(res.message || 'Pendaftaran gagal. Silakan coba kembali.');
        return;
      }

      setRegisterSuccess(`Pendaftaran berhasil! Akun "${res.user.name}" aktif dengan bonus +50 Poin Warga. Membuka aplikasi...`);
      setTimeout(() => {
        onContinue(res.user.role, selectedLocation, res.user);
      }, 900);
    } catch (err: any) {
      setIsRegistering(false);
      setRegisterError(err.message || 'Pendaftaran gagal. Silakan periksa kembali data Anda.');
    }
  };

  return (
    <div className={`min-h-full flex flex-col justify-between p-3.5 sm:p-4 text-left ${
      isWireframe ? 'bg-zinc-50 text-zinc-900' : 'bg-gradient-to-b from-slate-100 via-rose-50/30 to-slate-50 text-slate-800'
    }`}>
      <div className="space-y-3">
        {/* 1. HERO BRANDING CARD (MENARIK & IDENTITAS DESA ARJAWINANGUN - JUNGJANG) */}
        <div className="bg-gradient-to-br from-red-800 via-red-700 to-rose-700 text-white rounded-3xl p-4 sm:p-5 shadow-xl relative overflow-hidden border border-red-600/40">
          {/* Decorative Glow */}
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-red-950/40 rounded-full blur-xl pointer-events-none" />

          {/* Top Pill Badge */}
          <div className="relative z-10 flex items-center justify-between gap-1 mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-xs text-[10px] font-black text-amber-300 border border-white/15">
              <span>🇮🇩</span>
              <span>Portal Resmi Warga Desa Jungjang & Arjawinangun</span>
            </span>
            <span className="text-[10px] text-red-200 font-bold bg-white/10 px-2 py-0.5 rounded-full">
              Cirebon Barat
            </span>
          </div>

          {/* Header Title with Emblem */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-white text-red-700 shadow-md flex items-center justify-center font-black text-xl shrink-0 border-2 border-amber-300">
              WA
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">
                Wong Arjawinangun
              </h1>
              <p className="text-[11px] text-red-100 font-medium mt-1 leading-snug">
                Layanan Terpadu Warga, Pasar Tradisional & Ojek-Becak Lokal
              </p>
            </div>
          </div>

          {/* Welcoming Greeting */}
          <div className="relative z-10 mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px]">
            <span className="text-amber-200 font-semibold italic">
              "Sugeng Rawuh ning Aplikasi Wong Arjawinangun"
            </span>
            <span className="text-white/80 font-bold text-[10px] bg-red-900/60 px-2 py-0.5 rounded-full">
              Guyub & Maju
            </span>
          </div>

          {/* 4 Feature Highlights Grid */}
          <div className="relative z-10 grid grid-cols-2 gap-1.5 mt-3 pt-2 border-t border-white/10 text-[10px]">
            <div className="bg-white/10 backdrop-blur-xs p-2 rounded-xl border border-white/15 flex items-center gap-1.5">
              <span className="text-base">🛵</span>
              <div className="min-w-0">
                <strong className="block text-white font-extrabold truncate">Ojek & Becak</strong>
                <span className="text-red-100 text-[9px] block truncate">Pangkalan Jungjang & KA</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-2 rounded-xl border border-white/15 flex items-center gap-1.5">
              <span className="text-base">🛒</span>
              <div className="min-w-0">
                <strong className="block text-white font-extrabold truncate">Pasar Jungjang</strong>
                <span className="text-red-100 text-[9px] block truncate">Sayur, Bumbu & Ikan</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-2 rounded-xl border border-white/15 flex items-center gap-1.5">
              <span className="text-base">🍛</span>
              <div className="min-w-0">
                <strong className="block text-white font-extrabold truncate">Kuliner Cirebon</strong>
                <span className="text-red-100 text-[9px] block truncate">Empal Gentong & Docang</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-2 rounded-xl border border-white/15 flex items-center gap-1.5">
              <span className="text-base">🗳️</span>
              <div className="min-w-0">
                <strong className="block text-white font-extrabold truncate">Aspirasi Desa</strong>
                <span className="text-red-100 text-[9px] block truncate">Polling & Rembug Warga</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. BAR LOKASI AKTUAL & GPS */}
        <div className="bg-white rounded-2xl p-2.5 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <MapPin size={15} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                Lokasi Terkini Warga:
              </span>
              <span className="font-extrabold text-slate-800 truncate block">
                {selectedLocation.name}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRequestDeviceGps}
            disabled={gpsLoading}
            className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
            title="Deteksi Lokasi GPS HP"
          >
            {gpsLoading ? (
              <RefreshCw size={11} className="animate-spin text-amber-600" />
            ) : (
              <Navigation size={11} className="text-amber-600" />
            )}
            <span>{gpsLoading ? 'Mencari...' : 'GPS Aktual'}</span>
          </button>
        </div>

        {/* 3. KARTU UTAMA AUTENTIKASI (MASUK / DAFTAR AKUN BARU) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm text-left">
          {/* Segmented Switcher Tab */}
          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold mb-4">
            <button
              type="button"
              onClick={() => {
                setAuthMode('masuk');
                setLoginError(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'masuk'
                  ? 'bg-red-700 text-white shadow-xs font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LogIn size={14} />
              <span>Masuk ke Akun</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('daftar');
                setRegisterError(null);
                setRegisterSuccess(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'daftar'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sparkles size={14} />
              <span>Daftar Akun Baru</span>
            </button>
          </div>

          {/* TAB 1: FORM MASUK KE AKUN */}
          {authMode === 'masuk' && (
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1.5">
                  Nomor WhatsApp / ID Akun Terdaftar <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center rounded-2xl border-2 border-slate-200 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-100 overflow-hidden bg-slate-50/70 transition-all">
                  <span className="px-3 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 border-r border-slate-200 flex items-center gap-1.5 shrink-0">
                    <span>🇮🇩</span>
                    <span>+62</span>
                  </span>
                  <input
                    type="tel"
                    value={loginPhone}
                    onChange={(e) => {
                      setLoginPhone(e.target.value);
                      setLoginError(null);
                    }}
                    placeholder="812-3456-7890"
                    autoFocus
                    className="flex-1 px-3 py-2.5 text-sm font-bold text-slate-900 focus:outline-hidden bg-transparent"
                  />
                  {loginPhone && (
                    <button
                      type="button"
                      onClick={() => setLoginPhone('')}
                      className="p-2 text-slate-400 hover:text-slate-600 mr-1"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Masukkan nomor WhatsApp yang sudah didaftarkan pada aplikasi.
                </span>
              </div>

              {/* Peran Akses Masuk */}
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1.5">
                  Pilih Profil Akses:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { role: 'pelanggan' as AppRole, label: 'Warga', desc: 'Pembeli & Pemesan', icon: User, activeBg: 'border-red-600 bg-red-50/80 text-red-950 ring-2 ring-red-500' },
                    { role: 'mitra' as AppRole, label: 'Partner', desc: 'Ojek, Becak & Jasa', icon: Bike, activeBg: 'border-amber-600 bg-amber-50/80 text-amber-950 ring-2 ring-amber-500' },
                    { role: 'merchant' as AppRole, label: 'Lapak', desc: 'Pasar & UMKM', icon: Store, activeBg: 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500' },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = loginRole === item.role;
                    return (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => setLoginRole(item.role)}
                        className={`py-2 px-1.5 rounded-2xl text-left border flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? item.activeBg
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white shadow-xs' : 'bg-slate-200/70'}`}>
                          <Icon size={16} className={isSelected ? 'text-red-700' : 'text-slate-600'} />
                        </div>
                        <span className="text-xs font-black truncate w-full">{item.label}</span>
                        <span className="text-[9px] text-slate-400 truncate w-full leading-tight">{item.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error Notice */}
              {loginError && (
                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2 leading-relaxed animate-in fade-in">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
                  <div>
                    <strong className="block font-black text-red-900">Akses Ditolak:</strong>
                    <span>{loginError}</span>
                  </div>
                </div>
              )}

              {/* Submit Login Button */}
              <button
                type="button"
                onClick={handleDirectLogin}
                disabled={isLoggingIn}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 active:scale-[0.99] transition-all cursor-pointer"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Memeriksa Status Akun...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    <span>Masuk ke Akun Saya</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              <div className="pt-2 border-t border-slate-100 text-center">
                <p className="text-[10px] text-slate-500 font-medium">
                  🔒 Hanya akun yang sudah terdaftar resmi yang dapat masuk.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('daftar');
                    setLoginError(null);
                  }}
                  className="mt-1 text-xs font-black text-red-700 hover:underline"
                >
                  Belum punya akun? Klik untuk Daftar Akun Baru Sekarang →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: FORM PENDAFTARAN AKUN RESMI BARU */}
          {authMode === 'daftar' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1">
                  Nama Lengkap Sesuai KTP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3 py-2.5 rounded-2xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-hidden bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-extrabold text-slate-800 block mb-1">
                    Nomor WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="0812xxxx (min. 8 digit)"
                    className="w-full px-3 py-2.5 rounded-2xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-hidden bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-800 block mb-1">
                    Daftar Sebagai Peran <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={registerRole}
                    onChange={(e) => setRegisterRole(e.target.value as AppRole)}
                    className="w-full px-2.5 py-2.5 rounded-2xl border border-slate-300 text-xs font-black text-slate-800 focus:border-emerald-500 focus:outline-hidden bg-white"
                  >
                    <option value="pelanggan">Warga (Pembeli & Pemesan)</option>
                    <option value="mitra">Partner (Ojek & Becak)</option>
                    <option value="merchant">Lapak (Pasar & UMKM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1">
                  Alamat Blok & RT/RW di Arjawinangun / Jungjang
                </label>
                <input
                  type="text"
                  value={registerRtRw}
                  onChange={(e) => setRegisterRtRw(e.target.value)}
                  placeholder="Contoh: RT 03 / RW 02 Blok Makmur / Jungjang"
                  className="w-full px-3 py-2.5 rounded-2xl border border-slate-300 text-xs text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-hidden bg-slate-50/50"
                />
              </div>

              {registerError && (
                <div className="p-2.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5 animate-in fade-in">
                  <AlertCircle size={15} className="shrink-0 text-red-600" />
                  <span>{registerError}</span>
                </div>
              )}

              {registerSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 font-bold animate-in fade-in">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                  <span>{registerSuccess}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleRegisterDirect}
                disabled={isRegistering}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-[0.99] transition-all cursor-pointer"
              >
                {isRegistering ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Mendaftarkan Akun Resmi...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} />
                    <span>Daftar Akun Baru Sekarang</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-slate-500 pt-1">
                🎁 Pendaftaran gratis & otomatis mendapatkan bonus +50 Poin Sambutan Warga.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2b. Form Pendaftaran Selesai */}

      {/* 4. TEMPAT KHUSUS: Admin Login (Dikunci dengan PIN 8 Digit: 45162888) */}
      {onOpenAdminPortal && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => {
              setAdminGatePin('');
              setAdminGateError(null);
              setShowAdminPinModal(true);
            }}
            className="w-full p-2.5 rounded-2xl border border-slate-300 hover:border-purple-300 bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center justify-between shadow-xs group cursor-pointer"
          >
            <div className="flex items-center gap-2 text-left">
              <div className="w-7 h-7 rounded-xl bg-purple-600/40 border border-purple-400/40 text-amber-300 flex items-center justify-center shrink-0">
                <Lock size={13} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white group-hover:text-purple-200">
                    Admin Login
                  </span>
                  <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-500/40 px-1 py-0.2 rounded font-bold">
                    PIN 8 Digit
                  </span>
                </div>
                <p className="text-[9px] text-slate-400">
                  Login Kuwu (Super Admin) & Admin Operasional
                </p>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-400 group-hover:text-purple-300 shrink-0 ml-2" />
          </button>
        </div>
      )}

      {/* Footer Credentials & Trust */}
      <div className="pt-2 pb-1 text-center border-t border-slate-200/80 mt-2 space-y-1">
        <p className="text-[10px] text-slate-500 font-semibold flex items-center justify-center gap-1">
          <ShieldCheck size={12} className="text-emerald-600" />
          <span>Sistem Digital Pelayanan Warga & Pasar Desa Arjawinangun - Jungjang</span>
        </p>
        <p className="text-[9px] text-slate-400">
          Kecamatan Arjawinangun, Kabupaten Cirebon, Jawa Barat 45162
        </p>
      </div>

      {/* MODAL KUNCI PIN 8 DIGIT ADMIN LOGIN */}
      {showAdminPinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl p-5 max-w-xs w-full text-left shadow-2xl border border-slate-700 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 text-amber-300 flex items-center justify-center">
                  <KeyRound size={16} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">Kunci Admin Login</h3>
                  <span className="text-[10px] text-slate-400">Masukkan PIN 8 Digit</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminPinModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleUnlockAdminPortal} className="mt-3 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
                  PIN Akses Admin (8 Digit):
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  value={adminGatePin}
                  onChange={(e) => {
                    setAdminGatePin(e.target.value.replace(/[^0-9]/g, ''));
                    setAdminGateError(null);
                  }}
                  placeholder="••••••••"
                  autoFocus
                  className="w-full text-center text-lg font-mono font-black tracking-widest py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-950 text-white focus:border-purple-400 focus:outline-hidden"
                />
              </div>

              {adminGateError && (
                <div className="p-2 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-[10px] font-semibold flex items-center gap-1.5">
                  <AlertCircle size={13} className="shrink-0 text-rose-400" />
                  <span>{adminGateError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Lock size={13} />
                <span>Buka Admin Login</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VERIFIKASI KODE OTP WHATSAPP */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full text-left shadow-2xl border border-slate-100 animate-in zoom-in-95">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">
                    Verifikasi WhatsApp
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    Balai Desa Arjawinangun
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X size={15} />
              </button>
            </div>

            {/* Simulated WhatsApp Notification Box */}
            <div className="my-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 shadow-2xs">
              <div className="flex items-center justify-between pb-1 text-[10px] text-emerald-800 font-bold">
                <span className="flex items-center gap-1">
                  <span>💬</span> Pesan WhatsApp Balai Desa:
                </span>
                <span className="text-emerald-600 font-normal">Baru saja</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Kode OTP Pendaftaran Anda adalah:{' '}
                <strong className="text-emerald-700 text-sm tracking-wider font-mono font-black bg-white px-1.5 py-0.5 rounded border border-emerald-300">
                  {receivedOtpPreview || '829104'}
                </strong>
              </p>
              <div className="mt-2 flex items-center justify-between pt-1 border-t border-emerald-200/60">
                <span className="text-[9px] text-emerald-700">Berlaku selama 5 menit</span>
                <button
                  type="button"
                  onClick={() => setOtpCode(receivedOtpPreview || '829104')}
                  className="text-[10px] font-bold text-emerald-800 hover:text-emerald-950 bg-white px-2 py-0.5 rounded-lg border border-emerald-300 shadow-2xs flex items-center gap-1 cursor-pointer"
                >
                  <Copy size={11} />
                  <span>Isi Otomatis</span>
                </button>
              </div>
            </div>

            {/* Input OTP */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 block">
                Masukkan 6-Digit Kode Verifikasi:
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Contoh: 829104"
                className="w-full text-center text-xl font-mono font-black tracking-widest py-2.5 px-3 rounded-2xl border-2 border-emerald-500 focus:ring-2 focus:ring-emerald-400 focus:outline-hidden bg-slate-50"
              />
              <p className="text-[10px] text-slate-400 text-center">
                Kode dikirimkan ke nomor WhatsApp: <strong>{whatsappPhone}</strong>
              </p>
            </div>

            {otpError && (
              <div className="mt-2 p-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
                <AlertCircle size={13} className="shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            {otpSuccessNotice && (
              <div className="mt-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 size={13} className="shrink-0" />
                <span>{otpSuccessNotice}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isVerifyingOtp}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-[0.99] transition-all cursor-pointer"
              >
                {isVerifyingOtp ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Verifikasi & Masuk Aplikasi</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[10px] pt-1">
                <span className="text-slate-400">Belum menerima pesan?</span>
                {otpCountdown > 0 ? (
                  <span className="text-slate-500 font-semibold flex items-center gap-1">
                    <Clock size={11} />
                    <span>Kirim ulang ({otpCountdown}s)</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Kirim Ulang Kode WA
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
