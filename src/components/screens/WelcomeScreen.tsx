import React, { useState } from 'react';
import { AppRole, LocationItem } from '../../types';
import { MOCK_LOCATIONS } from '../../data/mockData';
import { MapPin, User, Briefcase, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';

interface WelcomeScreenProps {
  onContinue: (role: AppRole, location: LocationItem) => void;
  currentRole: AppRole;
  currentLocation: LocationItem;
  isWireframe?: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onContinue,
  currentRole: initialRole,
  currentLocation: initialLocation,
  isWireframe = false,
}) => {
  const [selectedRole, setSelectedRole] = useState<AppRole>(initialRole);
  const [selectedLocation, setSelectedLocation] = useState<LocationItem>(initialLocation);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const [nameInput, setNameInput] = useState('Ageng Prasetyo');
  const [phoneInput, setPhoneInput] = useState('0812-3456-7890');

  const handleStart = () => {
    onContinue(selectedRole, selectedLocation);
  };

  return (
    <div className={`min-h-full flex flex-col justify-between p-5 ${
      isWireframe ? 'bg-zinc-50 text-zinc-900' : 'bg-gradient-to-b from-amber-50 via-white to-red-50 text-slate-800'
    }`}>
      {/* Top Branding Section */}
      <div className="pt-6 text-center">
        {/* App Logo */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-md bg-gradient-to-tr from-red-700 to-rose-600 text-white">
          <div className="relative flex items-center justify-center">
            <span className="text-3xl font-black tracking-wider">WA</span>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-[9px] font-bold text-red-900">✓</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-black tracking-tight text-red-700">
          Wong Arjawinangun
        </h1>
        <p className="text-xs font-medium text-slate-500 mt-1">
          Aplikasi Layanan & Komunitas Warga Arjawinangun
        </p>
        <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-red-100/70 text-red-800 rounded-full text-[11px] font-semibold">
          <span>Bersama Lebih Nyaman</span>
          <span className="text-xs">🤝</span>
        </div>
      </div>

      {/* Center Action Box: Role Selector & Action Buttons */}
      <div className="my-6 space-y-5">
        {/* Role Selector */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
            Pilih Peran Anda
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedRole('pelanggan')}
              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col items-start ${
                selectedRole === 'pelanggan'
                  ? 'border-red-600 bg-red-50/70 text-red-900 ring-2 ring-red-500/20'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className={`p-1.5 rounded-lg ${selectedRole === 'pelanggan' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <User size={16} />
                </div>
                {selectedRole === 'pelanggan' && (
                  <CheckCircle2 size={16} className="text-red-600" />
                )}
              </div>
              <span className="font-bold text-xs mt-1">Pelanggan</span>
              <span className="text-[10px] text-slate-500 line-clamp-1">Warga & Pembeli</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('mitra')}
              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col items-start ${
                selectedRole === 'mitra'
                  ? 'border-red-600 bg-red-50/70 text-red-900 ring-2 ring-red-500/20'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className={`p-1.5 rounded-lg ${selectedRole === 'mitra' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Briefcase size={16} />
                </div>
                {selectedRole === 'mitra' && (
                  <CheckCircle2 size={16} className="text-red-600" />
                )}
              </div>
              <span className="font-bold text-xs mt-1">Mitra Warga</span>
              <span className="text-[10px] text-slate-500 line-clamp-1">Becak / Ojek / Toko</span>
            </button>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
            <span>Terhubung langsung dengan paguyuban & RT/RW setempat</span>
          </div>
        </div>

        {/* Big Action Buttons: Masuk & Daftar */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => setAuthModal('login')}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 shadow-md shadow-red-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Masuk ke Aplikasi</span>
            <ChevronRight size={16} />
          </button>

          <button
            type="button"
            onClick={() => setAuthModal('register')}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-red-700 bg-white border border-red-300 hover:bg-red-50/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Daftar Akun Baru</span>
          </button>

          <button
            type="button"
            onClick={handleStart}
            className="w-full py-2 text-center text-xs font-semibold text-slate-500 hover:text-red-700 underline underline-offset-4 decoration-slate-300 transition-colors"
          >
            Jelajahi Langsung Sebagai Tamu (Demo Mode) →
          </button>
        </div>
      </div>

      {/* Auto Location Display at the bottom */}
      <div className="pt-2 pb-1 border-t border-slate-200/60">
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <MapPin size={16} />
            </div>
            <div className="truncate text-left">
              <span className="block text-[10px] text-slate-500 font-medium">Lokasi Otomatis Terdeteksi:</span>
              <span className="block text-xs font-bold text-slate-800 truncate">
                {selectedLocation.name}, {selectedLocation.detail}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowLocationPicker(true)}
            className="text-[11px] font-bold text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg shrink-0 transition-colors"
          >
            Ganti
          </button>
        </div>
      </div>

      {/* Location Selector Modal */}
      {showLocationPicker && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-4 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Pilih Lokasi di Arjawinangun</h3>
                <p className="text-[11px] text-slate-500">Pilih blok atau dusun tempat Anda tinggal</p>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationPicker(false)}
                className="text-xs text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>
            <div className="mt-3 max-h-60 overflow-y-auto space-y-1.5">
              {MOCK_LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => {
                    setSelectedLocation(loc);
                    setShowLocationPicker(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between text-xs transition-colors ${
                    selectedLocation.id === loc.id
                      ? 'bg-red-50 text-red-800 font-semibold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className={selectedLocation.id === loc.id ? 'text-red-600' : 'text-slate-400'} />
                    <div>
                      <p className="font-medium">{loc.name}</p>
                      <p className="text-[10px] text-slate-500">{loc.detail}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {loc.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Simple Auth Modal (Masuk / Daftar) */}
      {authModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {authModal === 'login' ? 'Masuk ke Wong Arjawinangun' : 'Daftar Akun Baru'}
                </h3>
                <p className="text-xs text-slate-500">
                  Peran: <strong className="text-red-700 capitalize">{selectedRole}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAuthModal(null)}
                className="text-xs text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {authModal === 'register' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Contoh: Ageng Prasetyo"
                  />
                </div>
              )}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="0812-XXXX-XXXX"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Kata Sandi</label>
                <input
                  type="password"
                  defaultValue="••••••••"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModal(null);
                    handleStart();
                  }}
                  className="w-full py-3 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all shadow-sm"
                >
                  {authModal === 'login' ? 'Masuk Sekarang' : 'Daftar & Lanjutkan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
