import React, { useState } from 'react';
import { MarketVendor, ProductItem, CartItem } from '../../types';
import { MARKET_VENDORS } from '../../data/mockData';
import {
  ArrowLeft,
  Search,
  ShoppingBag,
  Star,
  MapPin,
  Clock,
  Plus,
  Minus,
  CheckCircle2,
  Phone,
  MessageCircle,
  Heart,
  Truck,
  Store,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface BelanjaOfflineFlowProps {
  onBack: () => void;
  isWireframe?: boolean;
}

export const BelanjaOfflineFlow: React.FC<BelanjaOfflineFlowProps> = ({
  onBack,
  isWireframe = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'sayur' | 'sembako' | 'daging' | 'kuliner'>('all');
  const [selectedVendor, setSelectedVendor] = useState<MarketVendor | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<'kurir' | 'ambil_sendiri'>('kurir');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({ 'vnd-1': true });
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [chatVendorModal, setChatVendorModal] = useState<MarketVendor | null>(null);

  const categories = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'sayur', label: '🥬 Sayur & Bumbu' },
    { id: 'sembako', label: '🌾 Sembako' },
    { id: 'daging', label: '🥩 Daging & Ikan' },
    { id: 'kuliner', label: '🍲 Kuliner Pasar' },
  ];

  const filteredVendors = selectedCategory === 'all'
    ? MARKET_VENDORS
    : MARKET_VENDORS.filter((v) => v.category === selectedCategory);

  const toggleFavorite = (vendorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [vendorId]: !prev[vendorId] }));
  };

  const addToCart = (product: ProductItem, vendor: MarketVendor) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          vendorId: vendor.id,
          vendorName: vendor.name,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (!existing) return prev;
      if (existing.quantity === 1) {
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const getProductQtyInCart = (productId: string) => {
    const item = cart.find((c) => c.product.id === productId);
    return item ? item.quantity : 0;
  };

  const subtotalCart = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === 'kurir' ? 5000 : 0;
  const totalAmount = subtotalCart + deliveryFee;

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
            <span>Kembali</span>
          </button>
          <h2 className="text-sm font-bold truncate">
            {selectedVendor ? selectedVendor.name : 'Belanja Offline Pasar Tradisional'}
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
          /* VENDOR LIST VIEW */
          <div className="space-y-4">
            {/* Search and Category Filter Bar */}
            <div className="space-y-2.5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari pedagang, sayur, sembako, daging..."
                  className="w-full pl-9 pr-4 py-2 bg-white text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 shadow-2xs"
                />
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              </div>

              {/* Horizontal Category Scroller */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-red-700 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vendor List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Daftar Kios & Pedagang Pasar ({filteredVendors.length})
                </span>
                <span className="text-[10px] text-slate-500">Buka Hari Ini</span>
              </div>

              {filteredVendors.map((vendor) => {
                const isFav = favorites[vendor.id];
                return (
                  <div
                    key={vendor.id}
                    onClick={() => setSelectedVendor(vendor)}
                    className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-red-300 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      {/* Vendor Image */}
                      <div className="w-18 h-18 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 relative">
                        <img
                          src={vendor.image}
                          alt={vendor.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {vendor.isVerified && (
                          <div className="absolute top-1 left-1 bg-emerald-600 text-white rounded-full p-0.5">
                            <CheckCircle2 size={10} />
                          </div>
                        )}
                      </div>

                      {/* Info Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                            {vendor.name}
                          </h4>
                          <button
                            type="button"
                            onClick={(e) => toggleFavorite(vendor.id, e)}
                            className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                            title="Favorit"
                          >
                            <Heart size={15} className={isFav ? 'fill-red-500 text-red-500' : ''} />
                          </button>
                        </div>

                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 flex items-center gap-1">
                          <MapPin size={11} className="text-slate-400 shrink-0" />
                          <span>{vendor.stallLocation}</span>
                        </p>

                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-600">
                          <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                            <Star size={11} className="fill-amber-400 text-amber-400" />
                            <span>{vendor.rating}</span>
                          </span>
                          <span>·</span>
                          <span className="text-slate-500">{vendor.distance} dari lokasi</span>
                          <span>·</span>
                          <span className="text-slate-500 flex items-center gap-0.5">
                            <Clock size={10} />
                            <span>{vendor.openTime}</span>
                          </span>
                        </div>

                        {/* Action Buttons: Pesan / Chat */}
                        <div className="mt-2.5 flex items-center gap-2 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVendor(vendor);
                            }}
                            className="flex-1 py-1.5 px-2 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-lg transition-colors text-center"
                          >
                            Buka Katalog & Pesan
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setChatVendorModal(vendor);
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                            title="Chat Pedagang"
                          >
                            <MessageCircle size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* SELECTED VENDOR CATALOG & CART VIEW */
          <div className="space-y-4">
            {/* Vendor Profile Header Banner */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={selectedVendor.image}
                    alt={selectedVendor.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-slate-900">{selectedVendor.name}</h3>
                  <p className="text-[10px] text-slate-500">{selectedVendor.stallLocation}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px]">
                    <span className="text-amber-600 font-bold">★ {selectedVendor.rating}</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-medium">Buka {selectedVendor.openTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Catalog Items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Katalog Barang Dagangan
                </h4>
                <span className="text-[10px] text-slate-500">Harga Tertera Pasar Tradisional</span>
              </div>

              <div className="space-y-2">
                {selectedVendor.products.map((prod) => {
                  const qty = getProductQtyInCart(prod.id);
                  return (
                    <div
                      key={prod.id}
                      className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-2 rounded-xl bg-slate-50 shrink-0">
                          {prod.image}
                        </span>
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

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        {qty > 0 ? (
                          <div className="flex items-center gap-2 bg-red-50 p-1 rounded-xl border border-red-200">
                            <button
                              type="button"
                              onClick={() => removeFromCart(prod.id)}
                              className="w-6 h-6 rounded-lg bg-white text-red-700 flex items-center justify-center font-bold hover:bg-red-100"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-extrabold text-red-900 w-4 text-center tabular-nums">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => addToCart(prod, selectedVendor)}
                              className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold hover:bg-red-700"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addToCart(prod, selectedVendor)}
                            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-colors"
                          >
                            <Plus size={13} />
                            <span>Pesan</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Method Options */}
            {cart.length > 0 && (
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Pilih Metode Pengambilan
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('kurir')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      deliveryMethod === 'kurir'
                        ? 'border-red-600 bg-red-50/70 text-red-900 ring-2 ring-red-500/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Truck size={15} className="text-red-700" />
                      <span className="text-xs font-bold">Antar ke Rumah</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Kurir Ojek/Becak Lokal (+Rp 5.000)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('ambil_sendiri')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      deliveryMethod === 'ambil_sendiri'
                        ? 'border-red-600 bg-red-50/70 text-red-900 ring-2 ring-red-500/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Store size={15} className="text-red-700" />
                      <span className="text-xs font-bold">Ambil Sendiri</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Langsung ke Kios Pasar (Bebas Ongkir)</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Sticky Cart & Order Summary */}
      {selectedVendor && cart.length > 0 && (
        <div className="p-4 bg-white border-t border-slate-200 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] text-slate-500 block">Total ({cart.reduce((s, i) => s + i.quantity, 0)} barang):</span>
              <span className="text-base font-black text-red-700 tabular-nums">
                Rp {totalAmount.toLocaleString('id-ID')}
              </span>
            </div>
            <span className="text-[11px] text-slate-600">
              {deliveryMethod === 'kurir' ? '🛵 Dikirim Kurir Desa' : '🛍️ Ambil di Kios'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowCheckoutSuccess(true)}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5"
          >
            <ShoppingBag size={15} />
            <span>Kirim Pesanan ke {selectedVendor.name}</span>
          </button>
        </div>
      )}

      {/* Success Modal */}
      {showCheckoutSuccess && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full text-center shadow-xl border border-slate-100 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={26} />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Pesanan Belanja Terkirim!</h4>
            <p className="text-xs text-slate-600 mt-1.5">
              Pedagang sedang menyiapkan pesanan belanjaan Anda di Pasar Jungjang. Total: <strong>Rp {totalAmount.toLocaleString('id-ID')}</strong>.
            </p>
            <div className="mt-3 p-2 rounded-xl bg-slate-50 text-[11px] text-slate-600 text-left">
              <p>Metode: {deliveryMethod === 'kurir' ? 'Diantar Kurir Desa' : 'Ambil di Kios'}</p>
              <p>Estimasi Selesai: 20-30 Menit</p>
            </div>
            <button
              onClick={() => {
                setShowCheckoutSuccess(false);
                setCart([]);
                setSelectedVendor(null);
              }}
              className="mt-4 w-full py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl"
            >
              Kembali ke Menu
            </button>
          </div>
        </div>
      )}

      {/* Chat Vendor Modal */}
      {chatVendorModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 max-w-xs w-full text-left shadow-xl border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-900">Hubungi {chatVendorModal.name}</h4>
              <button onClick={() => setChatVendorModal(null)} className="text-xs text-slate-400">✕</button>
            </div>
            <p className="text-[11px] text-slate-600 mt-2">
              Tanyakan ketersediaan stok atau pesan khusus langsung ke pedagang via WhatsApp:
            </p>
            <div className="mt-3 p-2 bg-emerald-50 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
              <Phone size={14} className="text-emerald-600" />
              <span>{chatVendorModal.phone}</span>
            </div>
            <a
              href={`https://wa.me/62${chatVendorModal.phone.replace(/[^0-9]/g, '').slice(1)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block text-center py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
            >
              Kirim Chat WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
