import React, { useState, useEffect } from 'react';
import { TaniIkanVendor, VendorReview } from '../../types';
import { MOCK_TANI_IKAN_VENDORS } from '../../data/mockData';
import { api } from '../../services/api';
import {
  ArrowLeft,
  Sprout,
  Fish,
  Search,
  MapPin,
  Clock,
  Star,
  Phone,
  MessageCircle,
  ChevronRight,
  Send,
  CheckCircle2,
  Package,
  Store,
  Layers
} from 'lucide-react';

interface TaniIkanScreenProps {
  onBack: () => void;
  isWireframe?: boolean;
}

export const TaniIkanScreen: React.FC<TaniIkanScreenProps> = ({
  onBack,
  isWireframe = false,
}) => {
  const [vendors, setVendors] = useState<TaniIkanVendor[]>(MOCK_TANI_IKAN_VENDORS);
  const [selectedType, setSelectedType] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<TaniIkanVendor | null>(null);
  const [chatVendorModal, setChatVendorModal] = useState<TaniIkanVendor | null>(null);

  // Review Form States
  const [userRating, setUserRating] = useState<number>(5);
  const [reviewerName, setReviewerName] = useState('Petani / Warga Lokal');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const filterTabs = [
    { id: 'semua', label: 'Semua Kios', icon: Layers },
    { id: 'pertanian', label: '🌾 Gabah & Hasil Tani', icon: Sprout },
    { id: 'perikanan', label: '🐟 Tambak & Bibit Ikan', icon: Fish },
    { id: 'pupuk_sarana', label: '🌱 Pupuk & Saprotan', icon: Package },
  ];

  useEffect(() => {
    api.getTaniIkanVendors().then((data) => {
      if (data && data.length > 0) setVendors(data);
    }).catch(() => {});
  }, []);

  const filteredVendors = vendors.filter((v) => {
    const matchesType = selectedType === 'semua' || v.type === selectedType;
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.products.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleOpenVendor = (vendor: TaniIkanVendor) => {
    setSelectedVendor(vendor);
    setUserRating(5);
    setReviewComment('');
    setReviewSuccess(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor || !reviewComment.trim()) return;

    setIsSubmittingReview(true);
    const newRev: VendorReview = {
      id: `trv-${Date.now()}`,
      reviewerName: reviewerName.trim() || 'Warga Arjawinangun',
      rating: userRating,
      comment: reviewComment.trim(),
      date: 'Baru saja',
    };

    try {
      await api.addTaniIkanReview(selectedVendor.id, {
        reviewerName: newRev.reviewerName,
        rating: newRev.rating,
        comment: newRev.comment,
      });

      // Update state locally
      const updatedReviews = [newRev, ...(selectedVendor.reviews || [])];
      const avg = Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1));
      const updatedVendor = { ...selectedVendor, reviews: updatedReviews, rating: avg };

      setSelectedVendor(updatedVendor);
      setVendors((prev) => prev.map((v) => (v.id === updatedVendor.id ? updatedVendor : v)));
      setReviewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (err) {
      console.warn('Failed to submit tani & ikan review:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className={`min-h-full flex flex-col justify-between ${isWireframe ? 'bg-zinc-50' : 'bg-slate-50'}`}>
      {/* Top Header */}
      <div className={`p-4 border-b ${isWireframe ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-gradient-to-r from-emerald-800 to-teal-800 text-white border-emerald-900'}`}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (selectedVendor) setSelectedVendor(null);
              else onBack();
            }}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft size={16} />
            <span>{selectedVendor ? 'Kios Lain' : 'Kembali'}</span>
          </button>
          <div className="text-center">
            <h2 className="text-sm font-black tracking-tight truncate max-w-[210px]">
              {selectedVendor ? selectedVendor.name : 'Tani & Ikan Arjawinangun'}
            </h2>
            <p className="text-[10px] text-emerald-100 font-medium">
              Hasil Sawah, Benih & Bibit Ikan Desa
            </p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
              Lokal
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-4 flex-1 text-left overflow-y-auto space-y-3.5">
        {!selectedVendor ? (
          /* ============================================================ */
          /* 1. LIST OF STORES / FARMS / FISHERIES                        */
          /* ============================================================ */
          <div className="space-y-3.5">
            {/* Banner Notice Info Toko & Katalog (Tanpa Tambahkan Pesanan) */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-2xl border border-emerald-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sprout size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-800">Toko & Katalog Tani & Ikan</h4>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Cek stok gabah, benih padi, pupuk, dan bibit ikan air tawar langsung dari petani & pembudidaya.
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari gabah ciherang, pupuk, bibit nila, pakan..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Type Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedType(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    selectedType === tab.id
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Store Cards */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Ditemukan {filteredVendors.length} Kios & Kelompok Tani</span>
                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  Katalog & Ulasan Petani
                </span>
              </div>

              {filteredVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  onClick={() => handleOpenVendor(vendor)}
                  className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
                >
                  <div className="flex gap-3">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">
                            {vendor.type === 'pertanian' ? 'Pertanian' : vendor.type === 'perikanan' ? 'Tambak Ikan' : 'Sarana Tani'}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded-md">
                            <Star size={11} className="fill-amber-500 text-amber-500" />
                            <span>{vendor.rating}</span>
                            <span className="text-slate-400 text-[10px]">({vendor.reviews ? vendor.reviews.length : 3})</span>
                          </div>
                        </div>

                        <h3 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1 group-hover:text-emerald-800 transition-colors">
                          {vendor.name}
                        </h3>

                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {vendor.ownerName}
                        </p>

                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                          <MapPin size={10} className="shrink-0" />
                          <span className="truncate">{vendor.location}</span>
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">
                          {vendor.products.length} Komoditas di Katalog
                        </span>
                        <span className="font-bold text-emerald-800 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          Lihat Katalog <ChevronRight size={13} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* 2. DETAIL TOKO: PROFIL, KATALOG, RATING & KOMENTAR WARGA     */
          /* ============================================================ */
          <div className="space-y-4">
            {/* Vendor Profile Header */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-start gap-3.5">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <img
                    src={selectedVendor.image}
                    alt={selectedVendor.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded uppercase">
                    {selectedVendor.type === 'pertanian' ? 'Pertanian' : selectedVendor.type === 'perikanan' ? 'Tambak Perikanan' : 'Pupuk & Saprotan'}
                  </span>
                  <h3 className="text-sm font-black text-slate-900 mt-1">{selectedVendor.name}</h3>
                  <p className="text-[11px] text-slate-600 mt-0.5">{selectedVendor.ownerName}</p>

                  <div className="flex items-center gap-3 mt-1.5 text-xs">
                    <div className="flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-lg">
                      <Star size={12} className="fill-amber-500 text-amber-500" />
                      <span>{selectedVendor.rating}</span>
                      <span className="text-slate-400 font-normal text-[10px]">/ 5.0</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 flex items-center gap-1">
                      <Clock size={11} />
                      <span>Buka {selectedVendor.openHours}</span>
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                {selectedVendor.description}
              </p>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setChatVendorModal(selectedVendor)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <MessageCircle size={14} />
                  <span>Hubungi Penjual / Petani via WhatsApp</span>
                </button>
              </div>
            </div>

            {/* PRODUCT CATALOG (HANYA KATALOG & HARGA - TANPA TOMBOL PESAN) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Store size={14} className="text-emerald-700" />
                    <span>Katalog Komoditas & Harga</span>
                  </h4>
                  <span className="text-[10px] text-slate-500">Harga resmi komoditas di tingkat petani & kios</span>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                  {selectedVendor.products.length} Komoditas
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {selectedVendor.products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between transition-all hover:border-slate-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl shrink-0">
                        {prod.image}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">{prod.name}</h5>
                        <span className="text-[10px] text-slate-500 block">
                          Satuan: {prod.unit}
                        </span>
                        <span className="text-xs font-black text-emerald-800 tabular-nums">
                          Rp {prod.price.toLocaleString('id-ID')}
                        </span>
                        {prod.description && (
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                            {prod.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-1 rounded-lg border border-emerald-200/60 inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                        Tersedia
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION: RATING & KOMENTAR WARGA (HANYA RATING DAN KOMENTAR) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Star size={14} className="fill-amber-500 text-amber-500" />
                    <span>Rating & Komentar Petani/Warga</span>
                  </h4>
                  <p className="text-[10px] text-slate-500">Ulasan kualitas panen, benih, pupuk & bibit ikan</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-slate-900">{selectedVendor.rating}</span>
                  <span className="text-xs text-slate-400">/5</span>
                </div>
              </div>

              {/* Form Tulis Rating & Komentar */}
              <form onSubmit={handleSubmitReview} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                <h5 className="text-xs font-bold text-slate-800">Tulis Ulasan & Komentar Anda</h5>

                {/* Star Picker */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-600 mr-1">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        size={20}
                        className={star <= userRating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-700 ml-1.5">{userRating}.0 Bintang</span>
                </div>

                {/* Name */}
                <div>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Nama Anda (contoh: Kang Imron / Pak Kusnan)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Comment */}
                <div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={2}
                    placeholder="Ceritakan kualitas benih, pertumbuhan padi, kesehatan bibit ikan, atau ketepatan timbangan..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview || !reviewComment.trim()}
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Send size={13} />
                  <span>{isSubmittingReview ? 'Mengirim Ulasan...' : 'Kirim Komentar & Rating'}</span>
                </button>

                {reviewSuccess && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold rounded-lg flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Komentar dan rating Anda berhasil dipublikasikan!</span>
                  </div>
                )}
              </form>

              {/* List of Reviews */}
              <div className="space-y-2.5 pt-1">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Ulasan Warga & Petani ({selectedVendor.reviews ? selectedVendor.reviews.length : 0}):
                </span>

                {selectedVendor.reviews && selectedVendor.reviews.length > 0 ? (
                  selectedVendor.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{rev.reviewerName}</span>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={11}
                            className={s <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}
                          />
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed pt-0.5">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-3">
                    Belum ada ulasan untuk komoditas toko ini.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Modal */}
      {chatVendorModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 max-w-xs w-full text-left shadow-xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-900">Hubungi {chatVendorModal.ownerName}</h4>
              <button onClick={() => setChatVendorModal(null)} className="text-xs text-slate-400">✕</button>
            </div>
            <p className="text-[11px] text-slate-600 mt-2">
              Tanyakan ketersediaan bibit, gabah, atau pupuk langsung via WhatsApp:
            </p>
            <div className="mt-3 p-2 bg-emerald-50 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
              <Phone size={14} className="text-emerald-600" />
              <span>{chatVendorModal.phone}</span>
            </div>
            <a
              href={`https://wa.me/62${chatVendorModal.phone.replace(/[^0-9]/g, '').slice(1)}?text=Halo%20${encodeURIComponent(chatVendorModal.ownerName)},%20saya%20warga%20Arjawinangun%20mau%20tanya%20produk%20tani/ikan%20*${encodeURIComponent(chatVendorModal.name)}*`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block text-center py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Kirim Chat WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
