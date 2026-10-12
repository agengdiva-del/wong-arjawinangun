import React, { useState, useEffect } from 'react';
import { MarketVendor, VendorReview } from '../../types';
import { MARKET_VENDORS } from '../../data/mockData';
import { api } from '../../services/api';
import {
  ArrowLeft,
  Search,
  Star,
  Clock,
  Phone,
  MessageCircle,
  Heart,
  Store,
  ChevronRight,
  Send,
  CheckCircle2,
  Sparkles,
  MapPin,
  UtensilsCrossed,
  ShoppingBag
} from 'lucide-react';

interface BelanjaOfflineFlowProps {
  onBack: () => void;
  initialCategory?: 'all' | 'sayur' | 'sembako' | 'daging' | 'kuliner';
  isWireframe?: boolean;
  pageTitle?: string;
}

export const BelanjaOfflineFlow: React.FC<BelanjaOfflineFlowProps> = ({
  onBack,
  initialCategory = 'all',
  isWireframe = false,
  pageTitle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'sayur' | 'sembako' | 'daging' | 'kuliner'>(initialCategory);
  const [selectedVendor, setSelectedVendor] = useState<MarketVendor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({ 'vnd-1': true, 'vnd-4': true });
  const [chatVendorModal, setChatVendorModal] = useState<MarketVendor | null>(null);

  // Review Form States for citizen feedback
  const [userRating, setUserRating] = useState<number>(5);
  const [reviewerName, setReviewerName] = useState<string>('Warga Arjawinangun');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmittedSuccess, setReviewSubmittedSuccess] = useState(false);

  const categories = [
    { id: 'all', label: 'Semua Kios' },
    { id: 'kuliner', label: '🍲 Kuliner Khas' },
    { id: 'sayur', label: '🥬 Sayur & Bumbu' },
    { id: 'sembako', label: '🌾 Sembako' },
    { id: 'daging', label: '🥩 Daging Segar' },
  ];

  const [allVendors, setAllVendors] = useState<MarketVendor[]>(MARKET_VENDORS);

  useEffect(() => {
    api.getMerchants().then((data) => {
      if (data && data.length > 0) setAllVendors(data);
    }).catch(() => {});
  }, []);

  const filteredVendors = allVendors.filter((v) => {
    const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.stallLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.products.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (vendorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [vendorId]: !prev[vendorId] }));
  };

  const handleOpenVendor = (vendor: MarketVendor) => {
    setSelectedVendor(vendor);
    setUserRating(5);
    setReviewComment('');
    setReviewSubmittedSuccess(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor || !reviewComment.trim()) return;

    setIsSubmittingReview(true);
    const newRev: VendorReview = {
      id: `rev-${Date.now()}`,
      reviewerName: reviewerName.trim() || 'Warga Arjawinangun',
      rating: userRating,
      comment: reviewComment.trim(),
      date: 'Baru saja',
    };

    try {
      await api.addMerchantReview(selectedVendor.id, {
        reviewerName: newRev.reviewerName,
        rating: newRev.rating,
        comment: newRev.comment,
      });

      // Update local state instantly
      const updatedReviews = [newRev, ...(selectedVendor.reviews || [])];
      const avg = Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1));
      const updatedVendor = { ...selectedVendor, reviews: updatedReviews, rating: avg };

      setSelectedVendor(updatedVendor);
      setAllVendors((prev) => prev.map((v) => (v.id === updatedVendor.id ? updatedVendor : v)));
      setReviewComment('');
      setReviewSubmittedSuccess(true);
      setTimeout(() => setReviewSubmittedSuccess(false), 4000);
    } catch (err) {
      console.warn('Failed to submit review:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const currentDisplayTitle = pageTitle
    ? pageTitle
    : selectedCategory === 'kuliner'
    ? 'Kuliner Khas Cirebon'
    : 'Belanja Offline & Katalog Pasar';

  return (
    <div className={`min-h-full flex flex-col justify-between ${isWireframe ? 'bg-zinc-50' : 'bg-slate-50'}`}>
      {/* Top Header */}
      <div className={`p-4 border-b ${isWireframe ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-red-700 text-white border-red-800'}`}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (selectedVendor) setSelectedVendor(null);
              else onBack();
            }}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft size={16} />
            <span>{selectedVendor ? 'Katalog Lain' : 'Kembali'}</span>
          </button>
          <h2 className="text-sm font-bold truncate max-w-[200px]">
            {selectedVendor ? selectedVendor.name : currentDisplayTitle}
          </h2>
          <div className="flex items-center gap-1">
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium">
              Pasar Jungjang
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-4 flex-1 text-left overflow-y-auto">
        {!selectedVendor ? (
          /* ============================================================ */
          /* 1. LIST OF STORES / VENDORS & CATEGORY FILTERS               */
          /* ============================================================ */
          <div className="space-y-3.5">
            {/* Banner Notice: Info Katalog Saja (Tanpa Keranjang Pesanan) */}
            <div className="bg-gradient-to-r from-red-50 to-amber-50 p-3 rounded-2xl border border-red-100 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                {selectedCategory === 'kuliner' ? <UtensilsCrossed size={18} /> : <Store size={18} />}
              </div>
              <div className="text-left flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-800">Toko & Katalog Produk Resmi</h4>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Lihat daftar harga, ketersediaan produk, rating, serta ulasan dan komentar warga.
                </p>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kios, empal gentong, beras, cabai..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                      isSelected
                        ? 'bg-red-700 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Vendor Cards List */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Ditemukan {filteredVendors.length} Toko & Kios</span>
                <span className="text-[10px] text-red-600 font-bold">Katalog & Ulasan Aktif</span>
              </div>

              {filteredVendors.map((vendor) => {
                const isFav = favorites[vendor.id];
                return (
                  <div
                    key={vendor.id}
                    onClick={() => handleOpenVendor(vendor)}
                    className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-sm hover:border-red-300 transition-all cursor-pointer group"
                  >
                    <div className="flex gap-3">
                      {/* Image / Thumbnail */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                        <img
                          src={vendor.image}
                          alt={vendor.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(vendor.id, e)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-white/80 backdrop-blur-xs text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Heart size={12} className={isFav ? 'fill-red-600 text-red-600' : ''} />
                        </button>
                      </div>

                      {/* Store Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
                              {vendor.category === 'kuliner' ? 'Kuliner' : 'Pasar'}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded-md">
                              <Star size={11} className="fill-amber-500 text-amber-500" />
                              <span>{vendor.rating}</span>
                              <span className="text-slate-400 text-[10px]">
                                ({vendor.reviews ? vendor.reviews.length : 3})
                              </span>
                            </div>
                          </div>

                          <h3 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1 group-hover:text-red-700 transition-colors">
                            {vendor.name}
                          </h3>

                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                            <MapPin size={11} className="text-slate-400 shrink-0" />
                            <span className="truncate">{vendor.stallLocation}</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 mt-0.5 font-medium">
                            <Clock size={10} className="shrink-0" />
                            <span>Buka {vendor.openTime}</span>
                          </div>
                        </div>

                        {/* Bottom Action: Buka Katalog & Komentar */}
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium">
                            {vendor.products.length} Barang di Katalog
                          </span>
                          <span className="font-bold text-red-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                            Katalog & Ulasan <ChevronRight size={13} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* 2. DETAIL TOKO: PROFIL, KATALOG, RATING & KOMENTAR WARGA     */
          /* ============================================================ */
          <div className="space-y-4">
            {/* Vendor Profile Header Banner */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-2xs">
                  <img
                    src={selectedVendor.image}
                    alt={selectedVendor.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-red-100 text-red-800 font-black px-1.5 py-0.2 rounded uppercase">
                      {selectedVendor.category === 'kuliner' ? 'Kuliner' : 'Kios Pasar'}
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded border border-emerald-200/60">
                      Buka {selectedVendor.openTime}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 mt-1">{selectedVendor.name}</h3>
                  <p className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1">
                    <MapPin size={11} className="text-red-500 shrink-0" />
                    <span>{selectedVendor.stallLocation}</span>
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <div className="flex items-center gap-1 text-amber-700 font-black bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                      <Star size={13} className="fill-amber-500 text-amber-500" />
                      <span>{selectedVendor.rating}</span>
                      <span className="text-slate-400 font-normal text-[10px]">/ 5.0</span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      <strong>{selectedVendor.reviews ? selectedVendor.reviews.length : 3}</strong> ulasan warga
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Contact Button */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setChatVendorModal(selectedVendor)}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <MessageCircle size={14} />
                  <span>Hubungi Pedagang via WhatsApp</span>
                </button>
              </div>
            </div>

            {/* PRODUCT CATALOG (HANYA KATALOG & HARGA - TANPA TOMBOL PESAN) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingBag size={14} className="text-red-600" />
                    <span>Katalog Produk & Harga</span>
                  </h4>
                  <span className="text-[10px] text-slate-500">Daftar harga resmi barang dagangan di toko</span>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                  {selectedVendor.products.length} Pilihan
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {selectedVendor.products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between transition-all hover:border-slate-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shrink-0">
                        {prod.image}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">{prod.name}</h5>
                        <span className="text-[10px] text-slate-500 block">
                          Satuan: {prod.unit}
                        </span>
                        <span className="text-xs font-black text-red-700 tabular-nums">
                          Rp {prod.price.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-1 rounded-lg border border-emerald-200/60 inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                        Tersedia di Kios
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION: RATING & KOMENTAR WARGA (HANYA ADA RATING DAN KOMENTAR) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Star size={14} className="fill-amber-500 text-amber-500" />
                    <span>Rating & Komentar Warga</span>
                  </h4>
                  <p className="text-[10px] text-slate-500">Ulasan kepuasan dan kualitas produk dari warga Arjawinangun</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-slate-900">{selectedVendor.rating}</span>
                  <span className="text-xs text-slate-400">/5</span>
                </div>
              </div>

              {/* Form Tulis Rating & Komentar */}
              <form onSubmit={handleSubmitReview} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                <h5 className="text-xs font-bold text-slate-800">Beri Ulasan & Komentar Anda</h5>

                {/* Star Picker */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-600 mr-1">Penilaian:</span>
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

                {/* Reviewer Name */}
                <div>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Nama Anda (contoh: Pak RT Dedi / Ibu Mimin)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>

                {/* Review Comment */}
                <div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={2}
                    placeholder="Tulis ulasan tentang rasa, kesegaran, timbangan, atau keramahan pedagang..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmittingReview || !reviewComment.trim()}
                  className="w-full py-2 bg-red-700 hover:bg-red-800 disabled:bg-slate-300 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Send size={13} />
                  <span>{isSubmittingReview ? 'Mengirim Ulasan...' : 'Kirim Komentar & Rating'}</span>
                </button>

                {reviewSubmittedSuccess && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold rounded-lg flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Terima kasih! Komentar dan rating Anda telah ditambahkan.</span>
                  </div>
                )}
              </form>

              {/* List of Citizen Reviews */}
              <div className="space-y-2.5 pt-1">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Ulasan Terbaru Warga ({selectedVendor.reviews ? selectedVendor.reviews.length : 0}):
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
                    Belum ada ulasan. Jadilah warga pertama yang memberikan ulasan dan rating untuk toko ini!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Vendor Modal */}
      {chatVendorModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 max-w-xs w-full text-left shadow-xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-900">Hubungi {chatVendorModal.name}</h4>
              <button onClick={() => setChatVendorModal(null)} className="text-xs text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <p className="text-[11px] text-slate-600 mt-2">
              Hubungi langsung kios/warung via WhatsApp untuk tanya stok atau info pesanan harian:
            </p>
            <div className="mt-3 p-2 bg-emerald-50 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
              <Phone size={14} className="text-emerald-600" />
              <span>{chatVendorModal.phone}</span>
            </div>
            <a
              href={`https://wa.me/62${chatVendorModal.phone.replace(/[^0-9]/g, '').slice(1)}?text=Halo%20${encodeURIComponent(chatVendorModal.name)},%20saya%20warga%20Arjawinangun%20mau%20tanya%20produk%20di%20katalog%20aplikasi`}
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
