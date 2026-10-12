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

  // Direct Login (Tab Masuk)
  const handleDirectLogin = async () => {
    if (!loginPhone.trim()) {
      setLoginError('Silakan masukkan nomor WhatsApp / ID Warga untuk masuk.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await api.directLogin(loginPhone, loginRole);
      setIsLoggingIn(false);
      const baseUser = res?.user || accountsData[loginRole] || MOCK_USERS[loginRole] || MOCK_USERS.pelanggan;
      const user = {
        ...baseUser,
        emailOrPhone: loginPhone.trim(),
        location: selectedLocation.name,
      };
      onContinue(user.role || loginRole, selectedLocation, user);
    } catch (err: any) {
      setIsLoggingIn(false);
      const baseUser = accountsData[loginRole] || MOCK_USERS[loginRole] || MOCK_USERS.pelanggan;
      const user = {
        ...baseUser,
        emailOrPhone: loginPhone.trim(),
        location: selectedLocation.name,
      };
      onContinue(loginRole, selectedLocation, user);
    }
  };

  return (
    <div className={`min-h-full flex flex-col justify-between p-4 ${
      isWireframe ? 'bg-zinc-50 text-zinc-900' : 'bg-gradient-to-b from-amber-50/80 via-white to-red-50/70 text-slate-800'
    }`}>
      {/* Top Header Branding */}
      <div className="pt-2 pb-1 text-center">
        <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl mb-1.5 shadow-md bg-gradient-to-tr from-red-700 to-rose-600 text-white">
          <span className="text-xl font-black tracking-wider">WA</span>
        </div>
        <h1 className="text-xl font-black tracking-tight text-red-700">
          Wong Arjawinangun
        </h1>
        <p className="text-[11px] text-slate-500">
          Layanan Digital Warga & Pasar Desa Arjawinangun
        </p>
      </div>

      {/* 1. AKSES PENGGUNA (MASUK LANGSUNG & DAFTAR WHATSAPP) */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs text-left mb-2.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
          <div className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-lg ${authMode === 'masuk' ? 'bg-red-600 text-white' : 'bg-emerald-500 text-white'} flex items-center justify-center transition-colors`}>
              {authMode === 'masuk' ? <LogIn size={15} /> : <MessageCircle size={15} />}
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">
                {authMode === 'masuk' ? 'Masuk ke Akun Warga' : 'Pendaftaran WhatsApp'}
              </h3>
              <p className="text-[9px] text-slate-500">
                {authMode === 'masuk' ? 'Masuk langsung tanpa perlu kode OTP' : 'Verifikasi nomor via kode OTP WhatsApp'}
              </p>
            </div>
          </div>

          {/* Toggle Tab Masuk / Daftar */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('masuk');
                setLoginError(null);
              }}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                authMode === 'masuk'
                  ? 'bg-white text-red-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('daftar')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                authMode === 'daftar'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Daftar Baru
            </button>
          </div>
        </div>

        {/* Form Mode Masuk (Tanpa Autentikasi WhatsApp) */}
        {authMode === 'masuk' && (
          <div className="space-y-2.5">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">
                Nomor WhatsApp / ID Akun Terdaftar
              </label>
              <div className="flex items-center rounded-xl border border-slate-300 focus-within:border-red-600 focus-within:ring-1 focus-within:ring-red-500 overflow-hidden bg-slate-50/50">
                <span className="px-2.5 py-2 text-xs font-bold text-slate-600 bg-slate-100 border-r border-slate-200 flex items-center gap-1">
                  <span>🇮🇩</span> +62
                </span>
                <input
                  type="tel"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="812-3456-7890"
                  className="flex-1 px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden bg-transparent"
                />
              </div>
            </div>

            {/* Peran Masuk */}
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">
                Pilih Profil Akses:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { role: 'pelanggan' as AppRole, label: 'Warga', icon: User },
                  { role: 'mitra' as AppRole, label: 'Partner', icon: Bike },
                  { role: 'merchant' as AppRole, label: 'Lapak', icon: Store },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = loginRole === item.role;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => setLoginRole(item.role)}
                      className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border flex flex-col items-center gap-1 transition-all ${
                        isSelected
                          ? 'border-red-600 bg-red-50/80 text-red-900 shadow-2xs ring-1 ring-red-500'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon size={14} className={isSelected ? 'text-red-600' : 'text-slate-500'} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {loginError && (
              <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
                <AlertCircle size={13} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleDirectLogin}
              disabled={isLoggingIn}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Memproses Masuk...</span>
                </>
              ) : (
                <>
                  <LogIn size={14} />
                  <span>Masuk ke Akun Sekarang (Langsung)</span>
                </>
              )}
            </button>
            <p className="text-[9px] text-center text-slate-400">
              ✓ Masuk langsung tanpa verifikasi WhatsApp OTP
            </p>
          </div>
        )}

        {/* Form Mode Daftar Baru (Dengan Verifikasi WhatsApp) */}
        {authMode === 'daftar' && (
          <div className="space-y-2">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-0.5">
                Nama Lengkap Sesuai KTP
              </label>
              <input
                type="text"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-0.5">
                  Nomor WhatsApp
                </label>
                <input
                  type="tel"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="0812xxxx"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-0.5">
                  Daftar Sebagai Peran
                </label>
                <select
                  value={registerRole}
                  onChange={(e) => setRegisterRole(e.target.value as AppRole)}
                  className="w-full px-2 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:outline-hidden bg-white"
                >
                  <option value="pelanggan">Warga</option>
                  <option value="mitra">Partner</option>
                  <option value="merchant">Lapak</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-0.5">
                Alamat Blok & RT/RW di Arjawinangun
              </label>
              <input
                type="text"
                value={registerRtRw}
                onChange={(e) => setRegisterRtRw(e.target.value)}
                placeholder="Contoh: RT 03 / RW 02 Blok Makmur"
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <button
              type="button"
              onClick={() => handleSendOtp()}
              disabled={isVerifyingOtp}
              className="w-full mt-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              <CheckCircle2 size={14} />
              <span>{isVerifyingOtp ? 'Memproses...' : 'Daftar & Kirim OTP WhatsApp'}</span>
            </button>
          </div>
        )}
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
