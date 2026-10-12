import React, { useState, useEffect } from 'react';
import { DonationCampaign, DonationRecord } from '../../types';
import { MOCK_DONATION_CAMPAIGNS, MOCK_DONATION_RECORDS } from '../../data/mockData';
import { api } from '../../services/api';
import {
  ArrowLeft,
  HeartHandshake,
  QrCode,
  Sparkles,
  CheckCircle2,
  Share2,
  Copy,
  Download,
  Users,
  Target,
  Clock,
  ShieldCheck,
  Building,
  Heart,
  ChevronRight,
  TrendingUp,
  Landmark
} from 'lucide-react';

interface QrisDonasiScreenProps {
  onBack: () => void;
  isWireframe?: boolean;
}

export const QrisDonasiScreen: React.FC<QrisDonasiScreenProps> = ({
  onBack,
  isWireframe = false,
}) => {
  const [activeTab, setActiveTab] = useState<'program' | 'qris' | 'riwayat'>('program');
  const [campaigns, setCampaigns] = useState<DonationCampaign[]>(MOCK_DONATION_CAMPAIGNS);
  const [donations, setDonations] = useState<DonationRecord[]>(MOCK_DONATION_RECORDS);
  const [selectedCampaign, setSelectedCampaign] = useState<DonationCampaign>(MOCK_DONATION_CAMPAIGNS[0]);

  // Form States
  const [donorName, setDonorName] = useState('Ageng Prasetyo');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donationAmount, setDonationAmount] = useState<number>(25000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [prayerMessage, setPrayerMessage] = useState('Bismillah semoga berkah dan bermanfaat untuk warga.');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessReceipt, setShowSuccessReceipt] = useState(false);
  const [latestReceipt, setLatestReceipt] = useState<DonationRecord | null>(null);
  const [copiedRekening, setCopiedRekening] = useState(false);

  const presetAmounts = [10000, 25000, 50000, 100000, 200000, 500000];

  useEffect(() => {
    api.getDonationCampaigns().then((data) => {
      if (data && data.length > 0) {
        setCampaigns(data);
        setSelectedCampaign(data[0]);
      }
    }).catch(() => {});

    api.getDonationRecords().then((data) => {
      if (data && data.length > 0) setDonations(data);
    }).catch(() => {});
  }, []);

  const handleSelectPreset = (amount: number) => {
    setDonationAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(raw);
    const num = Number(raw);
    if (num > 0) {
      setDonationAmount(num);
    }
  };

  const handleSelectCampaignForDonation = (campaign: DonationCampaign) => {
    setSelectedCampaign(campaign);
    setActiveTab('qris');
  };

  const handleSimulatePayment = async () => {
    if (donationAmount <= 0) return;

    setIsProcessing(true);
    const finalDonorName = isAnonymous ? 'Hamba Allah (Anonim)' : donorName.trim() || 'Warga Arjawinangun';

    const newRecord: DonationRecord = {
      id: `dn-${Date.now()}`,
      campaignId: selectedCampaign.id,
      campaignTitle: selectedCampaign.title,
      donorName: finalDonorName,
      amount: donationAmount,
      prayer: prayerMessage.trim() || 'Semoga berkah untuk kemakmuran desa.',
      timestamp: 'Baru saja',
      paymentMethod: 'QRIS Realtime',
    };

    try {
      await api.createDonation({
        campaignId: selectedCampaign.id,
        donorName: finalDonorName,
        amount: donationAmount,
        prayer: newRecord.prayer,
        paymentMethod: 'QRIS Realtime',
      });

      // Update campaigns state
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === selectedCampaign.id
            ? {
                ...c,
                collectedAmount: c.collectedAmount + donationAmount,
                donorsCount: c.donorsCount + 1,
              }
            : c
        )
      );

      // Prepend donation to history
      setDonations([newRecord, ...donations]);
      setLatestReceipt(newRecord);
      setShowSuccessReceipt(true);
    } catch (err) {
      console.warn('Payment simulation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyRekening = () => {
    navigator.clipboard?.writeText('3209140088991200');
    setCopiedRekening(true);
    setTimeout(() => setCopiedRekening(false), 2500);
  };

  const totalAllCollected = campaigns.reduce((sum, c) => sum + c.collectedAmount, 0);

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
          <div className="text-center">
            <h2 className="text-sm font-black tracking-tight">QRIS Donasi & Infaq Warga</h2>
            <p className="text-[10px] text-red-100 font-medium">Layanan Utama Desa Arjawinangun</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] bg-amber-400 text-red-950 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
              Resmi
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 gap-1 mt-3 bg-red-800/60 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('program')}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'program' ? 'bg-white text-red-700 shadow-xs' : 'text-red-100 hover:text-white'
            }`}
          >
            Program Desa
          </button>
          <button
            onClick={() => setActiveTab('qris')}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'qris' ? 'bg-white text-red-700 shadow-xs' : 'text-red-100 hover:text-white'
            }`}
          >
            Bayar QRIS
          </button>
          <button
            onClick={() => setActiveTab('riwayat')}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'riwayat' ? 'bg-white text-red-700 shadow-xs' : 'text-red-100 hover:text-white'
            }`}
          >
            Donatur ({donations.length})
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-4 flex-1 text-left overflow-y-auto space-y-3.5">
        {/* ============================================================ */}
        {/* TAB 1: DAFTAR PROGRAM DONASI                                 */}
        {/* ============================================================ */}
        {activeTab === 'program' && (
          <div className="space-y-3.5">
            {/* Top Stat Banner */}
            <div className="bg-gradient-to-r from-red-700 to-rose-700 rounded-2xl p-4 text-white shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-red-200 tracking-wider">Total Infaq & Donasi Terkumpul</span>
                <h3 className="text-xl font-black mt-0.5 tabular-nums">
                  Rp {totalAllCollected.toLocaleString('id-ID')}
                </h3>
                <p className="text-[11px] text-red-100 mt-1 flex items-center gap-1">
                  <ShieldCheck size={12} className="text-amber-300" />
                  <span>Dikelola amanah oleh Balai Desa & DKM</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 border border-white/30">
                <HeartHandshake size={26} className="text-white" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-700 font-bold">
              <span>Program Aktif ({campaigns.length})</span>
              <span className="text-[10px] text-red-600 font-extrabold">Pilih untuk Donasi</span>
            </div>

            {/* Campaign Cards */}
            <div className="space-y-3">
              {campaigns.map((camp) => {
                const percent = Math.min(100, Math.round((camp.collectedAmount / camp.targetAmount) * 100));
                return (
                  <div
                    key={camp.id}
                    className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-xs transition-all"
                  >
                    <div className="h-32 w-full relative bg-slate-100">
                      <img
                        src={camp.image}
                        alt={camp.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs px-2 py-0.5 rounded-full">
                          {camp.category}
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
                          {percent}% Terpenuhi
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 space-y-2.5">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {camp.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {camp.description}
                      </p>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="text-slate-500">
                            Terkumpul: <strong className="text-red-700 font-bold">Rp {camp.collectedAmount.toLocaleString('id-ID')}</strong>
                          </span>
                          <span className="text-slate-400">
                            Target: Rp {camp.targetAmount.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-600 to-rose-600 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users size={12} className="text-slate-400" />
                          <span><strong>{camp.donorsCount}</strong> Donatur</span>
                        </span>
                        <span className="text-slate-400 text-[10px]">
                          Penyelenggara: {camp.organizer}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectCampaignForDonation(camp)}
                        className="w-full py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <QrCode size={14} />
                        <span>Berdonasi via QRIS Sekarang</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: INTERAKTIF BAYAR VIA QRIS                             */}
        {/* ============================================================ */}
        {activeTab === 'qris' && (
          <div className="space-y-4">
            {/* Selected Campaign Header */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider block">Pilihan Program Donasi</span>
              <select
                value={selectedCampaign.id}
                onChange={(e) => {
                  const found = campaigns.find((c) => c.id === e.target.value);
                  if (found) setSelectedCampaign(found);
                }}
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Donation Nominal Selector */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
              <label className="text-xs font-bold text-slate-800 block">
                Pilih Nominal Donasi / Infaq
              </label>

              <div className="grid grid-cols-3 gap-2">
                {presetAmounts.map((amt) => {
                  const isSelected = donationAmount === amt && !customAmount;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleSelectPreset(amt)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-red-700 text-white shadow-xs ring-2 ring-red-500/20'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      Rp {amt.toLocaleString('id-ID')}
                    </button>
                  );
                })}
              </div>

              {/* Custom Input */}
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">
                  Atau Masukkan Nominal Lain (Rp):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Contoh: 75.000"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Donator Name & Prayer Message */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
              <label className="text-xs font-bold text-slate-800 block">
                Identitas Donatur & Doa
              </label>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-slate-500">Nama Lengkap Donatur:</span>
                  <label className="flex items-center gap-1 text-[10px] text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>Sembunyikan Nama (Hamba Allah)</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={donorName}
                  disabled={isAnonymous}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Nama Donatur"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 disabled:opacity-50 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">
                  Doa / Pesan Kebaikan:
                </label>
                <textarea
                  value={prayerMessage}
                  onChange={(e) => setPrayerMessage(e.target.value)}
                  rows={2}
                  placeholder="Tuliskan doa atau hajat kebaikan..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>
            </div>

            {/* Dynamic QRIS Code Card */}
            <div className="bg-white p-4 rounded-2xl border-2 border-red-500/30 shadow-md text-center space-y-3">
              {/* QRIS Official Branding Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="text-left">
                  <span className="text-sm font-black text-red-700 tracking-wider">QRIS</span>
                  <span className="text-[9px] text-slate-500 block">STANDAR PEMBAYARAN NASIONAL</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">GPN / ASPI</span>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="p-3 bg-white border border-slate-200 rounded-2xl inline-block shadow-inner mx-auto">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020101021226680016ID.GO.BANKINDONESIA.QRIS0118936009180000000000520458125802ID5924KAS+MASJID+ARJAWINANGUN6008CIREBON62070703A016304"
                  alt="QRIS Donasi Desa"
                  className="w-44 h-44 object-contain mx-auto"
                />
              </div>

              {/* Merchant Details */}
              <div className="space-y-0.5">
                <h5 className="text-xs font-black text-slate-900">
                  KAS SOSIAL DESA ARJAWINANGUN
                </h5>
                <p className="text-[10px] text-slate-500 font-mono">
                  NMID: ID1020268899112 · A01
                </p>
                <div className="pt-1">
                  <span className="text-[11px] text-slate-500">Nominal yang akan dibayar:</span>
                  <h4 className="text-lg font-black text-red-700 tabular-nums">
                    Rp {donationAmount.toLocaleString('id-ID')}
                  </h4>
                </div>
              </div>

              {/* Instant Simulation & Copy Rekening Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  disabled={isProcessing}
                  className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98]"
                >
                  <Sparkles size={15} className="text-amber-300" />
                  <span>{isProcessing ? 'Memproses Transaksi...' : 'Simulasi Bayar QRIS Sekarang'}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopyRekening}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Copy size={13} />
                    <span>{copiedRekening ? 'Tersalin!' : 'Salin Rekening Desa'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Kode QRIS telah siap dipindai oleh semua aplikasi e-wallet & mobile banking (BCA, Mandiri, BRI, BSI, Gopay, OVO, Dana).')}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                    title="Panduan Bayar"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: RIWAYAT & DAFTAR DONATUR WARGA                        */}
        {/* ============================================================ */}
        {activeTab === 'riwayat' && (
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800">Daftar Donatur Warga</span>
                <p className="text-[10px] text-slate-500">Kebaikan bersama warga Arjawinangun</p>
              </div>
              <span className="text-[11px] font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded-full">
                {donations.length} Transaksi
              </span>
            </div>

            <div className="space-y-2">
              {donations.map((dn) => (
                <div
                  key={dn.id}
                  className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{dn.donorName}</span>
                    <span className="text-xs font-black text-emerald-700 tabular-nums">
                      +Rp {dn.amount.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-500 line-clamp-1">
                    Untuk: {dn.campaignTitle}
                  </p>

                  {dn.prayer && (
                    <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg italic">
                      "{dn.prayer}"
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1">
                      <QrCode size={10} className="text-red-500" />
                      <span>{dn.paymentMethod}</span>
                    </span>
                    <span>{dn.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SUCCESS RECEIPT MODAL */}
      {showSuccessReceipt && latestReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full text-center shadow-2xl border border-slate-100 animate-in zoom-in-95 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full">
                Alhamdulillah Berhasil
              </span>
              <h4 className="font-black text-sm text-slate-900 mt-1">Donasi QRIS Terverifikasi</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Semoga barokah dan menjadi amal jariyah</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 text-left space-y-1.5 border border-slate-100 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Nominal:</span>
                <strong className="text-red-700 font-black text-xs">
                  Rp {latestReceipt.amount.toLocaleString('id-ID')}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Program:</span>
                <span className="font-bold text-slate-800 text-right truncate max-w-[150px]">
                  {latestReceipt.campaignTitle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Donatur:</span>
                <span className="font-bold text-slate-800">{latestReceipt.donorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Metode:</span>
                <span className="font-medium text-emerald-700">QRIS Realtime</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">No. Transaksi:</span>
                <span className="font-mono text-slate-400">{latestReceipt.id}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowSuccessReceipt(false);
                setActiveTab('riwayat');
              }}
              className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Tutup & Lihat Riwayat Donatur
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
