import React, { useState } from 'react';
import { AppRole, ScreenId, VerificationRequest, SupportTicket } from '../../types';
import { MOCK_USERS, MOCK_VERIFICATIONS, MOCK_SUPPORT_TICKETS, MOCK_LOCATIONS } from '../../data/mockData';
import {
  ArrowLeft,
  Shield,
  FileCheck2,
  Bike,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  XCircle,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Search,
  Filter,
  Check,
  ChevronRight,
  Store,
  Wrench,
  Navigation,
  LogOut
} from 'lucide-react';

interface AdminDashboardScreenProps {
  onBack: () => void;
  onSwitchRole: (role: AppRole) => void;
  onNavigate: (screen: ScreenId) => void;
  isWireframe?: boolean;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  onBack,
  onSwitchRole,
  onNavigate,
  isWireframe = false,
}) => {
  const [activeTab, setActiveTab] = useState<'verifikasi' | 'monitoring' | 'aduan' | 'laporan'>('verifikasi');
  const [verifications, setVerifications] = useState<VerificationRequest[]>(MOCK_VERIFICATIONS);
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const handleApproveVerification = (id: string) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'disetujui' } : v))
    );
    setActionSuccessMessage('Berhasil menyetujui dan memverifikasi berkas pendaftar!');
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleRejectVerification = (id: string) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'ditolak' } : v))
    );
    setActionSuccessMessage('Pendaftaran telah ditolak dan notifikasi perbaikan dikirim ke pendaftar.');
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'Selesai' } : t))
    );
    setSelectedTicket(null);
    setActionSuccessMessage('Tiket aduan berhasil ditandai selesai.');
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  // Fleet monitoring data per block
  const fleetZones = [
    { name: 'Pasar Jungjang', becak: 8, ojek: 10, status: 'Padat Pembeli', note: 'Jam sibuk belanja sayur' },
    { name: 'Blok Makmur (RT 01-04)', becak: 4, ojek: 5, status: 'Normal', note: 'Standby di pos kamling' },
    { name: 'Stasiun Arjawinangun', becak: 3, ojek: 6, status: 'Ramai Kedatangan', note: 'Menunggu KA Airlangga' },
    { name: 'RSUD Arjawinangun', becak: 2, ojek: 2, status: 'Siaga', note: 'Pintu gerbang rawat jalan' },
    { name: 'Karangmulya & Kebonturi', becak: 1, ojek: 1, status: 'Siaga Panggilan', note: 'Antar jemput gang sempit' },
  ];

  return (
    <div className={`min-h-full flex flex-col justify-between ${isWireframe ? 'bg-zinc-50' : 'bg-slate-50'}`}>
      {/* Top Header */}
      <div className={`p-4 border-b ${
        isWireframe
          ? 'bg-zinc-800 text-white border-zinc-700'
          : 'bg-gradient-to-r from-blue-700 via-sky-700 to-indigo-800 text-white border-blue-800 shadow-md'
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
            <div className="inline-flex items-center gap-1 bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
              <Shield size={11} className="text-sky-200" />
              <span>Admin Operasional</span>
            </div>
            <h2 className="text-xs font-bold text-white mt-0.5">Posko Layanan Lapangan</h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onNavigate('polling')}
              className="text-[10px] bg-sky-500 hover:bg-sky-400 text-white font-bold px-2.5 py-1 rounded-lg border border-sky-300 shadow-xs flex items-center gap-1 transition-colors"
            >
              <span>🗳️ Polling Desa</span>
            </button>
            <button
              onClick={() => onNavigate('welcome')}
              className="text-[10px] bg-blue-900/80 hover:bg-blue-900 text-white font-bold px-2.5 py-1 rounded-lg border border-blue-400/40 cursor-pointer flex items-center gap-1 transition-colors"
              title="Keluar dari Akun Petugas"
            >
              <LogOut size={11} />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Identity bar */}
        <div className="mt-3 bg-white/10 border border-white/20 rounded-xl p-2.5 flex items-center justify-between text-left">
          <div className="flex items-center gap-2.5">
            <img
              src={MOCK_USERS.admin.avatar}
              alt="Admin"
              className="w-9 h-9 rounded-full object-cover border-2 border-sky-300 shrink-0"
            />
            <div>
              <h3 className="text-xs font-bold text-white leading-tight">
                {MOCK_USERS.admin.name}
              </h3>
              <p className="text-[10px] text-sky-100">{MOCK_USERS.admin.roleTitle}</p>
            </div>
          </div>
          <span className="text-[9px] bg-sky-500/40 text-white font-bold px-2 py-0.5 rounded-full">
            Shift Operasional Pagi
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-3.5 flex-1 text-left overflow-y-auto space-y-3.5">
        {/* Success Alert Banner */}
        {actionSuccessMessage && (
          <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {/* Operational Key Figures */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-semibold block">Verifikasi Berkas</span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-base font-black text-blue-700">
                {verifications.filter((v) => v.status === 'pending').length}
              </span>
              <FileCheck2 size={16} className="text-blue-500" />
            </div>
            <span className="text-[9px] text-slate-400">Mitra & Merchant Baru</span>
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-semibold block">Aduan Warga</span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-base font-black text-rose-600">
                {tickets.filter((t) => t.status !== 'Selesai').length}
              </span>
              <AlertCircle size={16} className="text-rose-500" />
            </div>
            <span className="text-[9px] text-slate-400">Perlu Penanganan</span>
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-semibold block">Armada Siaga</span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-base font-black text-emerald-700">42</span>
              <Bike size={16} className="text-emerald-500" />
            </div>
            <span className="text-[9px] text-slate-400">18 Becak · 24 Ojek</span>
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-semibold block">Pesanan Hari Ini</span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-base font-black text-slate-800">142</span>
              <BarChart3 size={16} className="text-indigo-500" />
            </div>
            <span className="text-[9px] text-slate-400">Selesai Beroperasi</span>
          </div>
        </div>

        {/* 4 Tabs Navigation */}
        <div className="flex bg-slate-200/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('verifikasi')}
            className={`flex-1 py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'verifikasi' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
            }`}
          >
            <FileCheck2 size={12} />
            <span>Verifikasi ({verifications.filter((v) => v.status === 'pending').length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('monitoring')}
            className={`flex-1 py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'monitoring' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
            }`}
          >
            <Navigation size={12} />
            <span>Armada Blok</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('aduan')}
            className={`flex-1 py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'aduan' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
            }`}
          >
            <AlertCircle size={12} />
            <span>Aduan ({tickets.filter((t) => t.status !== 'Selesai').length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('laporan')}
            className={`flex-1 py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'laporan' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
            }`}
          >
            <BarChart3 size={12} />
            <span>Rekap Ops</span>
          </button>
        </div>

        {/* TAB 1: VERIFIKASI MITRA & MERCHANT */}
        {activeTab === 'verifikasi' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Antrean Verifikasi Dokumen
              </span>
              <span className="text-[10px] text-slate-500">Standar Balai Desa</span>
            </div>

            <div className="space-y-2.5">
              {verifications.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs text-xs space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900">{item.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          item.type === 'mitra' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.category} · {item.location}
                      </p>
                    </div>

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : item.status === 'disetujui'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.status === 'pending' ? 'Menunggu Review' : item.status === 'disetujui' ? 'Disetujui' : 'Ditolak'}
                    </span>
                  </div>

                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] space-y-1">
                    <p className="text-slate-600">
                      📄 Dokumen: <strong className="text-slate-800">{item.documentType}</strong>
                    </p>
                    <p className="text-slate-500 italic">"{item.notes}"</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                      <span>Diajukan: {item.submittedAt}</span>
                      <a href={`tel:${item.phone}`} className="text-blue-600 font-semibold flex items-center gap-1">
                        <Phone size={10} />
                        <span>{item.phone}</span>
                      </a>
                    </div>
                  </div>

                  {item.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleRejectVerification(item.id)}
                        className="py-1.5 px-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl font-bold text-xs border border-slate-200 flex items-center justify-center gap-1 transition-colors"
                      >
                        <XCircle size={13} />
                        <span>Tolak</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApproveVerification(item.id)}
                        className="py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-1 transition-colors"
                      >
                        <CheckCircle2 size={13} />
                        <span>Setujui Resmi</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: MONITORING ARMADA PER BLOK */}
        {activeTab === 'monitoring' && (
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Sebaran Armada Aktif di 5 Zona Arjawinangun
              </span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                Live Radar
              </span>
            </div>

            <div className="space-y-2">
              {fleetZones.map((zone, idx) => (
                <div key={idx} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-red-600 shrink-0" />
                      <h4 className="font-bold text-slate-900">{zone.name}</h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-800">
                      {zone.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="p-1.5 bg-slate-50 rounded-lg flex items-center justify-between">
                      <span className="text-slate-600">🚲 Becak Onthel:</span>
                      <strong className="text-slate-900">{zone.becak} unit</strong>
                    </div>
                    <div className="p-1.5 bg-slate-50 rounded-lg flex items-center justify-between">
                      <span className="text-slate-600">🛵 Ojek Motor:</span>
                      <strong className="text-slate-900">{zone.ojek} unit</strong>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 italic pt-0.5">{zone.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ADUAN & KOMPLAIN WARGA */}
        {activeTab === 'aduan' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Tiket Aduan & Bantuan Warga
              </span>
              <span className="text-[10px] text-slate-500">Tanggapi Cepat</span>
            </div>

            <div className="space-y-2">
              {tickets.map((tck) => (
                <div key={tck.id} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-2 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{tck.reporterName}</span>
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                          {tck.reporterRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{tck.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        tck.priority === 'Tinggi' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        Prioritas: {tck.priority}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        tck.status === 'Selesai'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {tck.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    "{tck.issue}"
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                    <span className="text-slate-400 font-mono">{tck.id} · {tck.category}</span>
                    {tck.status !== 'Selesai' && (
                      <button
                        type="button"
                        onClick={() => handleResolveTicket(tck.id)}
                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold flex items-center gap-1 shadow-2xs transition-colors"
                      >
                        <Check size={11} />
                        <span>Selesaikan Aduan</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: LAPORAN REKAP HARIAN */}
        {activeTab === 'laporan' && (
          <div className="space-y-3 text-xs">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <h4 className="font-bold text-slate-900">Rekap Transaksi Hari Ini</h4>
              <p className="text-[11px] text-slate-500">
                Laporan aktivitas operasional tanggal {new Date().toLocaleDateString('id-ID')}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Tarikan Becak Onthel:</span>
                  <strong className="text-slate-900">64 Trip (Rp 640.000)</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Tarikan Ojek Cepat:</span>
                  <strong className="text-slate-900">78 Trip (Rp 624.000)</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Pesanan Belanja Pasar:</span>
                  <strong className="text-slate-900">46 Order (Rp 2.150.000)</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Panggilan Jasa Tukang:</span>
                  <strong className="text-slate-900">12 Panggilan (Rp 840.000)</strong>
                </div>
              </div>

              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm">
                <span className="text-slate-800">Total Perputaran Harian:</span>
                <span className="text-blue-700">Rp 4.254.000</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-[11px] text-blue-900 space-y-1">
              <span className="font-bold block">📌 Catatan Petugas Lapangan Balai Desa:</span>
              <p className="text-blue-800">
                Seluruh pangkalan becak & ojek terpantau tertib. Titik kemacetan pasar Jungjang diatur oleh linmas desa pukul 06.00-09.00 WIB.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
