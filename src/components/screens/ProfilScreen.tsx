import React, { useState } from 'react';
import { AppRole, OrderRecord } from '../../types';
import { MOCK_ORDERS } from '../../data/mockData';
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
  Edit3
} from 'lucide-react';

interface ProfilScreenProps {
  userRole: AppRole;
  onSwitchRole: (newRole: AppRole) => void;
  onBack: () => void;
  isWireframe?: boolean;
}

export const ProfilScreen: React.FC<ProfilScreenProps> = ({
  userRole,
  onSwitchRole,
  onBack,
  isWireframe = false,
}) => {
  const [activeTab, setActiveTab] = useState<'pribadi' | 'riwayat' | 'favorit' | 'pengaturan' | 'rating'>('riwayat');
  const [language, setLanguage] = useState<'id' | 'crb'>('crb'); // crb: Cirebonan
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<OrderRecord | null>(null);

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
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium">
            Wong Arjawinangun
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-4 flex-1 text-left overflow-y-auto space-y-4">
        {/* Profile Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-red-500 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                alt="Ageng Prasetyo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold text-slate-900 truncate">Ageng Prasetyo</h3>
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              </div>
              <p className="text-xs text-slate-500">0812-3456-7890 · Blok Makmur, RT 03 / RW 02</p>

              {/* Role Badge and Switcher */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                  {userRole === 'pelanggan' ? 'Peran: Pelanggan' : 'Peran: Mitra Warga'}
                </span>
                <button
                  type="button"
                  onClick={() => onSwitchRole(userRole === 'pelanggan' ? 'mitra' : 'pelanggan')}
                  className="text-[10px] font-semibold text-slate-600 hover:text-red-700 underline"
                >
                  Ganti ke {userRole === 'pelanggan' ? 'Mitra' : 'Pelanggan'}
                </button>
              </div>
            </div>
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
    </div>
  );
};
