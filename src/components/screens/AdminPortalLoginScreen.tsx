import React, { useState } from 'react';
import { AppRole, ScreenId } from '../../types';
import { MOCK_USERS } from '../../data/mockData';
import {
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  Shield,
  KeyRound,
  Lock,
  ChevronRight,
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface AdminPortalLoginScreenProps {
  onSelectAdminRole: (role: 'super_admin' | 'admin') => void;
  onBack: () => void;
  isWireframe?: boolean;
}

export const AdminPortalLoginScreen: React.FC<AdminPortalLoginScreenProps> = ({
  onSelectAdminRole,
  onBack,
  isWireframe = false,
}) => {
  const [selectedAdmin, setSelectedAdmin] = useState<'super_admin' | 'admin'>('super_admin');
  const [pinCode, setPinCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = (role: 'super_admin' | 'admin') => {
    if (pinCode.length < 4) {
      setErrorMessage('Masukkan 4 digit PIN Petugas Balai Desa.');
      return;
    }
    onSelectAdminRole(role);
  };

  return (
    <div className={`min-h-full flex flex-col justify-between p-4 ${
      isWireframe ? 'bg-zinc-900 text-zinc-100' : 'bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-slate-100'
    }`}>
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft size={14} />
            <span>Layanan Warga</span>
          </button>
          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
            <Lock size={10} />
            <span>Area Terbatas</span>
          </div>
        </div>

        {/* Portal Emblem */}
        <div className="text-center pt-5 pb-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-blue-600 shadow-lg shadow-purple-900/40 border border-purple-400/30 mb-2.5">
            <ShieldAlert size={30} className="text-white" />
          </div>
          <h1 className="text-base font-black text-white tracking-tight">
            Portal Khusus Petugas Balai Desa
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Kecamatan Arjawinangun · Kabupaten Cirebon
          </p>
          <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-slate-800/90 border border-slate-700 text-[10px] text-slate-300">
            <Server size={11} className="text-emerald-400" />
            <span>Sistem Administrasi & Operasional Internal</span>
          </div>
        </div>
      </div>

      {/* Center: The 2 Dedicated Administrator Accounts */}
      <div className="my-2 space-y-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left px-1">
          Pilih Akses Jabatan Petugas:
        </span>

        {/* 1. Super Admin Account Card */}
        <div
          onClick={() => setSelectedAdmin('super_admin')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
            selectedAdmin === 'super_admin'
              ? 'bg-purple-950/50 border-purple-500 shadow-md shadow-purple-950/50 ring-1 ring-purple-400/40'
              : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-purple-400 shrink-0">
                <img
                  src={MOCK_USERS.super_admin.avatar}
                  alt="Super Admin"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-xs font-black text-white">
                    {MOCK_USERS.super_admin.name}
                  </h3>
                  <span className="text-[9px] bg-purple-600 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                    KUWU DESA
                  </span>
                </div>
                <p className="text-[10px] text-purple-200 mt-0.5">
                  1. Super Administrator (Sistem Balai Desa)
                </p>
                <p className="text-[9px] text-slate-400 mt-0.5">
                  Kelola konfigurasi sistem, tarif, kas desa 3%, siaran darurat, & hak akses
                </p>
              </div>
            </div>

            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
              selectedAdmin === 'super_admin' ? 'border-purple-400 bg-purple-600' : 'border-slate-600'
            }`}>
              {selectedAdmin === 'super_admin' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </div>
        </div>

        {/* 2. Admin Operasional Account Card */}
        <div
          onClick={() => setSelectedAdmin('admin')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
            selectedAdmin === 'admin'
              ? 'bg-blue-950/50 border-blue-500 shadow-md shadow-blue-950/50 ring-1 ring-blue-400/40'
              : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-blue-400 shrink-0">
                <img
                  src={MOCK_USERS.admin.avatar}
                  alt="Admin Ops"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-xs font-black text-white">
                    {MOCK_USERS.admin.name}
                  </h3>
                  <span className="text-[9px] bg-blue-600 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                    OPERASIONAL
                  </span>
                </div>
                <p className="text-[10px] text-blue-200 mt-0.5">
                  2. Admin Operasional (Posko Lapangan)
                </p>
                <p className="text-[9px] text-slate-400 mt-0.5">
                  Verifikasi berkas mitra/merchant, radar 8 blok armada, tiket aduan warga
                </p>
              </div>
            </div>

            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
              selectedAdmin === 'admin' ? 'border-blue-400 bg-blue-600' : 'border-slate-600'
            }`}>
              {selectedAdmin === 'admin' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </div>
        </div>

        {/* PIN Security Field */}
        <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-left space-y-2">
          <label className="text-[10px] font-bold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <KeyRound size={12} className="text-amber-400" />
              <span>PIN Keamanan Petugas:</span>
            </span>
            <span className="text-[9px] text-slate-400">Minimal 4 digit</span>
          </label>

          <input
            type="password"
            value={pinCode}
            onChange={(e) => {
              setPinCode(e.target.value);
              setErrorMessage(null);
            }}
            placeholder="Masukkan 4-digit PIN"
            maxLength={6}
            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono tracking-widest text-center text-white focus:outline-none focus:border-purple-400"
          />

          {errorMessage && (
            <p className="text-[10px] text-rose-400 font-semibold">{errorMessage}</p>
          )}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => handleLogin(selectedAdmin)}
          className={`w-full py-3.5 px-4 rounded-xl font-black text-xs text-white shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
            selectedAdmin === 'super_admin'
              ? 'bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 shadow-purple-900/30'
              : 'bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 shadow-blue-900/30'
          }`}
        >
          <span>
            Masuk sebagai {selectedAdmin === 'super_admin' ? 'Super Admin (Kuwu)' : 'Admin Operasional'}
          </span>
          <ChevronRight size={16} />
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full py-2 text-center text-xs text-slate-400 hover:text-white transition-colors"
        >
          ← Kembali ke Halaman Warga & Pelanggan
        </button>
      </div>
    </div>
  );
};
