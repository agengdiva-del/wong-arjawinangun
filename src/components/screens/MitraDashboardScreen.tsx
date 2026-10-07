import React, { useState } from 'react';
import { AppRole, ScreenId } from '../../types';
import {
  ArrowLeft,
  Power,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Bike,
  User,
  ShieldCheck,
  Phone
} from 'lucide-react';

interface MitraDashboardScreenProps {
  onBack: () => void;
  onSwitchRole: (role: AppRole) => void;
  onNavigate: (screen: ScreenId) => void;
  isWireframe?: boolean;
}

export const MitraDashboardScreen: React.FC<MitraDashboardScreenProps> = ({
  onBack,
  onSwitchRole,
  isWireframe = false,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [hasNewOrder, setHasNewOrder] = useState(true);
  const [orderAccepted, setOrderAccepted] = useState(false);
  const [earnings, setEarnings] = useState(85000);

  const handleAccept = () => {
    setOrderAccepted(true);
    setHasNewOrder(false);
    setEarnings((prev) => prev + 10000);
  };

  const handleReject = () => {
    setHasNewOrder(false);
  };

  return (
    <div className={`min-h-full flex flex-col justify-between ${isWireframe ? 'bg-zinc-50' : 'bg-slate-50'}`}>
      {/* Top Header */}
      <div className={`p-4 border-b ${isWireframe ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-amber-600 text-white border-amber-700'}`}>
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft size={16} />
            <span>Kembali</span>
          </button>
          <div className="text-center">
            <h2 className="text-sm font-bold truncate">Dashboard Mitra Warga</h2>
            <span className="text-[10px] text-amber-100">Mang Duloh · Becak No. 14</span>
          </div>
          <button
            onClick={() => onSwitchRole('pelanggan')}
            className="text-[10px] bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg font-bold"
          >
            Pelanggan
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-4 flex-1 text-left overflow-y-auto space-y-4">
        {/* Online/Offline Status Toggle */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <h3 className="text-xs font-bold text-slate-900">
                {isOnline ? 'Status: Online (Siap Nampa Order)' : 'Status: Offline (Istirahat)'}
              </h3>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {isOnline ? 'Warga sekitar dapat memesan layanan Anda' : 'Anda tidak akan menerima pesanan baru'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsOnline(!isOnline)}
            className={`p-2.5 rounded-xl flex items-center gap-1 text-xs font-bold transition-all ${
              isOnline
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            <Power size={14} />
            <span>{isOnline ? 'Aktif' : 'Mati'}</span>
          </button>
        </div>

        {/* Incoming Order Notification Box */}
        {isOnline && hasNewOrder && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-2xl border-2 border-red-500/80 shadow-md animate-in slide-in-from-top duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-red-200/60">
              <span className="text-[10px] font-extrabold uppercase bg-red-600 text-white px-2 py-0.5 rounded-full tracking-wider animate-pulse">
                Tarikan Masuk!
              </span>
              <span className="text-xs font-bold text-red-800 tabular-nums">Tarif: Rp 10.000</span>
            </div>

            <div className="mt-2.5 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <Bike size={16} className="text-red-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Pesanan Becak Onthel Tradisional</h4>
                  <p className="text-[11px] text-slate-600">Pelanggan: <strong>Ibu Hj. Rokayah</strong></p>
                </div>
              </div>

              <div className="p-2 bg-white rounded-xl border border-red-100 text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <MapPin size={12} className="text-emerald-600" />
                  <span>Jemput: <strong>Blok Makmur (Pos RT 03)</strong> (120m)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <MapPin size={12} className="text-red-600" />
                  <span>Tujuan: <strong>Pasar Jungjang Los Sayur</strong></span>
                </div>
                <p className="text-[10px] text-slate-500 italic">"Gawa belanjaan kranjang gede nggih mang"</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleReject}
                  className="py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Lewatkan
                </button>
                <button
                  type="button"
                  onClick={handleAccept}
                  className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1"
                >
                  <CheckCircle2 size={14} />
                  <span>Terima Tarikan</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Accepted Order Status */}
        {orderAccepted && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 text-emerald-950 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
              <div>
                <h4 className="text-xs font-bold">Tarikan Sedang Berjalan</h4>
                <p className="text-[11px] text-emerald-800">Menuju titik jemput: Blok Makmur Pos RT 03</p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <a
                href="tel:0812-9988-7766"
                className="flex-1 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1"
              >
                <Phone size={13} />
                <span>Hubungi Penumpang</span>
              </a>
              <button
                type="button"
                onClick={() => setOrderAccepted(false)}
                className="py-2 px-3 bg-white text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold"
              >
                Selesaikan
              </button>
            </div>
          </div>
        )}

        {/* Daily Stats Summary */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 text-left">
            <span className="text-[10px] text-slate-500 font-semibold block">Pendapatan Hari Ini</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <TrendingUp size={16} className="text-emerald-600" />
              <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                Rp {earnings.toLocaleString('id-ID')}
              </span>
            </div>
            <span className="text-[9px] text-slate-400 mt-1 block">Dari 6 tarikan & titipan</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 text-left">
            <span className="text-[10px] text-slate-500 font-semibold block">Rating Pelayanan</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-amber-500 text-base font-bold">★ 4.9</span>
              <span className="text-[11px] text-slate-500">/ 5.0</span>
            </div>
            <span className="text-[9px] text-slate-400 mt-1 block">Terakreditasi Paguyuban Becak</span>
          </div>
        </div>

        {/* Paguyuban Info */}
        <div className="p-3 bg-white rounded-2xl border border-slate-200 text-left space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Info Paguyuban Mitra Desa
          </span>
          <p className="text-xs text-slate-800 font-semibold">
            Iuran bulanan kas paguyuban becak & ojek sudah lunas s/d Oktober 2026.
          </p>
          <p className="text-[10px] text-slate-500">
            Jadwal arisan rutin: Malam Jumat di Balai Pertemuan Desa Arjawinangun.
          </p>
        </div>
      </div>
    </div>
  );
};
