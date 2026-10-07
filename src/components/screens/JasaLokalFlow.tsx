import React, { useState } from 'react';
import { LocalServiceWorker } from '../../types';
import { LOCAL_SERVICES } from '../../data/mockData';
import {
  ArrowLeft,
  Search,
  Star,
  MapPin,
  CheckCircle2,
  Calendar,
  Phone,
  MessageCircle,
  Heart,
  Wrench,
  ShieldCheck,
  Clock
} from 'lucide-react';

interface JasaLokalFlowProps {
  onBack: () => void;
  isWireframe?: boolean;
}

export const JasaLokalFlow: React.FC<JasaLokalFlowProps> = ({
  onBack,
  isWireframe = false,
}) => {
  const [selectedTrade, setSelectedTrade] = useState<string>('all');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({ 'srv-1': true });
  const [bookingWorker, setBookingWorker] = useState<LocalServiceWorker | null>(null);
  const [bookingDate, setBookingDate] = useState('Hari ini (Segera)');
  const [issueNote, setIssueNote] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const trades = [
    { id: 'all', label: 'Semua Tukang' },
    { id: 'listrik', label: '⚡ Listrik & MCB' },
    { id: 'bangunan', label: '🧱 Bangunan & Tembok' },
    { id: 'pompa', label: '💧 Pompa Air & Ledeng' },
    { id: 'urut', label: '💆 Pijat & Urut Badan' },
  ];

  const filteredServices = selectedTrade === 'all'
    ? LOCAL_SERVICES
    : LOCAL_SERVICES.filter((s) => {
        if (selectedTrade === 'listrik') return s.trade.toLowerCase().includes('listrik');
        if (selectedTrade === 'bangunan') return s.trade.toLowerCase().includes('bangunan');
        if (selectedTrade === 'pompa') return s.trade.toLowerCase().includes('pompa');
        if (selectedTrade === 'urut') return s.trade.toLowerCase().includes('urut');
        return true;
      });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConfirmBooking = () => {
    setBookingSuccess(true);
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
          <h2 className="text-sm font-bold truncate">Jasa & Tukang Lokal Arjawinangun</h2>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium">
            Terverifikasi Desa
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 flex-1 text-left overflow-y-auto space-y-4">
        {/* Search & Category Filter */}
        <div className="space-y-2.5">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari tukang listrik, ledeng, bangunan, pijat..."
              className="w-full pl-9 pr-4 py-2 bg-white text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 shadow-2xs"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {trades.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTrade(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedTrade === t.id
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Local Trust Banner */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center gap-2.5 text-amber-900">
          <ShieldCheck size={20} className="text-amber-700 shrink-0" />
          <p className="text-[11px] leading-snug">
            Semua tukang di Wong Arjawinangun merupakan warga setempat yang telah diverifikasi RT/RW dan paguyuban.
          </p>
        </div>

        {/* Worker List Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Daftar Tukang & Ahli ({filteredServices.length})
            </span>
            <span className="text-[10px] text-slate-500">Siaga Panggilan</span>
          </div>

          {filteredServices.map((worker) => {
            const isFav = favorites[worker.id];
            return (
              <div
                key={worker.id}
                className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-red-300 transition-all text-left"
              >
                <div className="flex items-start gap-3">
                  {/* Photo */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 relative">
                    <img
                      src={worker.avatar}
                      alt={worker.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-1 right-1 bg-emerald-600 text-white rounded-full p-0.5">
                      <CheckCircle2 size={10} />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {worker.name}
                        </h4>
                        <p className="text-[11px] font-semibold text-red-700">{worker.trade}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(worker.id)}
                        className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Heart size={15} className={isFav ? 'fill-red-500 text-red-500' : ''} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                      <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span>{worker.rating}</span>
                      </span>
                      <span>·</span>
                      <span>{worker.jobsCompleted} order selesai</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-medium">{worker.distance}</span>
                    </div>

                    <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin size={10} className="text-slate-400 shrink-0" />
                      <span>Wilayah: {worker.area}</span>
                    </p>

                    {/* Specialties Tags */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {worker.specialties.slice(0, 3).map((sp, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                        >
                          {sp}
                        </span>
                      ))}
                    </div>

                    {/* Pricing */}
                    <div className="mt-2 text-xs">
                      <span className="text-[10px] text-slate-500">Biaya estimasi mulai: </span>
                      <strong className="text-slate-900 font-extrabold tabular-nums">
                        Rp {worker.startingPrice.toLocaleString('id-ID')}
                      </strong>
                      <span className="text-[10px] text-slate-500"> ({worker.priceUnit})</span>
                    </div>

                    {/* Action buttons: Pesan & Chat WA */}
                    <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setBookingWorker(worker)}
                        className="flex-1 py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <Calendar size={13} />
                        <span>Pesan Kunjungan</span>
                      </button>

                      <a
                        href={`tel:${worker.phone}`}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                        title="Telepon Langsung"
                      >
                        <Phone size={14} className="text-emerald-600" />
                      </a>

                      <a
                        href={`https://wa.me/62${worker.phone.replace(/[^0-9]/g, '').slice(1)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
                        title="Chat WhatsApp"
                      >
                        <MessageCircle size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingWorker && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-4 shadow-xl border border-slate-100 text-left animate-in slide-in-from-bottom">
            {!bookingSuccess ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Pesan Jasa: {bookingWorker.name}
                    </h3>
                    <p className="text-[11px] text-red-700 font-semibold">{bookingWorker.trade}</p>
                  </div>
                  <button onClick={() => setBookingWorker(null)} className="text-xs text-slate-400">
                    ✕
                  </button>
                </div>

                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Waktu Kedatangan Tukang
                    </label>
                    <select
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded-xl bg-white"
                    >
                      <option value="Hari ini (Segera)">Hari ini (Segera dalam 30-45 mnt)</option>
                      <option value="Hari ini Sore (16.00 WIB)">Hari ini Sore (16.00 WIB)</option>
                      <option value="Besok Pagi (08.30 WIB)">Besok Pagi (08.30 WIB)</option>
                      <option value="Janjian Khusus">Janjian Khusus via WhatsApp</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Keluhan / Kebutuhan Perbaikan
                    </label>
                    <textarea
                      rows={2}
                      value={issueNote}
                      onChange={(e) => setIssueNote(e.target.value)}
                      placeholder="Contoh: Lampu ruang tamu korsleting / Kran bocor..."
                      className="w-full p-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl text-xs flex justify-between items-center">
                    <span className="text-slate-500">Estimasi Ongkos Awal:</span>
                    <strong className="text-red-700 font-bold">
                      Rp {bookingWorker.startingPrice.toLocaleString('id-ID')}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Konfirmasi Pesan Tukang
                  </button>
                </div>
              </>
            ) : (
              <div className="py-4 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Jadwal Berhasil Dibuat!</h4>
                <p className="text-xs text-slate-600">
                  {bookingWorker.name} telah menerima notifikasi dan akan segera menuju ke alamat Anda ({bookingDate}).
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setBookingSuccess(false);
                    setBookingWorker(null);
                  }}
                  className="w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-xl mt-2"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
