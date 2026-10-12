import React, { useState } from 'react';
import { AppRole, ScreenId, MerchantOrder, ProductItem } from '../../types';
import { MOCK_USERS, MOCK_MERCHANT_ORDERS, MARKET_VENDORS } from '../../data/mockData';
import {
  ArrowLeft,
  Store,
  Power,
  Package,
  PlusCircle,
  TrendingUp,
  Wallet,
  CheckCircle2,
  Clock,
  Bike,
  User,
  MapPin,
  ChevronRight,
  Edit2,
  Trash2,
  Coins,
  LogOut
} from 'lucide-react';

interface MerchantDashboardScreenProps {
  onBack: () => void;
  onSwitchRole: (role: AppRole) => void;
  onNavigate: (screen: ScreenId) => void;
  isWireframe?: boolean;
}

export const MerchantDashboardScreen: React.FC<MerchantDashboardScreenProps> = ({
  onBack,
  onSwitchRole,
  onNavigate,
  isWireframe = false,
}) => {
  const [activeTab, setActiveTab] = useState<'pesanan' | 'katalog' | 'keuangan' | 'laporan'>('pesanan');
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [walletBalance, setWalletBalance] = useState(680000);
  const [orders, setOrders] = useState<MerchantOrder[]>(MOCK_MERCHANT_ORDERS);
  
  // Store products list
  const [products, setProducts] = useState<ProductItem[]>(MARKET_VENDORS[0].products);

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState<number>(10000);
  const [newProductUnit, setNewProductUnit] = useState('1 kg');
  const [newProductEmoji, setNewProductEmoji] = useState('🥕');

  // Withdraw modal
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(200000);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const handleUpdateOrderStatus = (orderId: string, nextStatus: MerchantOrder['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: nextStatus } : ord))
    );
  };

  const handleToggleProductStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const newProd: ProductItem = {
      id: `p-${Date.now()}`,
      name: newProductName,
      price: newProductPrice,
      unit: newProductUnit,
      image: newProductEmoji,
      category: 'Sayur Segar',
      inStock: true,
    };

    setProducts([newProd, ...products]);
    setNewProductName('');
    setShowAddProductModal(false);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount > walletBalance) return;
    setWalletBalance((prev) => prev - withdrawAmount);
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setShowWithdrawModal(false);
    }, 2000);
  };

  return (
    <div className={`min-h-full flex flex-col justify-between ${isWireframe ? 'bg-zinc-50' : 'bg-slate-50'}`}>
      {/* Top Header */}
      <div className={`p-4 border-b ${
        isWireframe
          ? 'bg-zinc-800 text-white border-zinc-700'
          : 'bg-gradient-to-r from-emerald-800 via-teal-800 to-green-900 text-white border-emerald-900 shadow-md'
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
              <Store size={11} className="text-emerald-200" />
              <span>Merchant / Pedagang</span>
            </div>
            <h2 className="text-xs font-bold text-white mt-0.5">Pasar Jungjang Arjawinangun</h2>
          </div>

          <button
            onClick={() => onNavigate('welcome')}
            className="text-[10px] bg-emerald-950/80 hover:bg-emerald-950 text-white font-bold px-2.5 py-1 rounded-lg border border-emerald-500/40 cursor-pointer flex items-center gap-1 transition-colors"
            title="Keluar dari Akun Merchant"
          >
            <LogOut size={11} />
            <span>Keluar Akun</span>
          </button>
        </div>

        {/* Merchant Store Bar */}
        <div className="mt-3 bg-white/10 border border-white/20 rounded-xl p-2.5 flex items-center justify-between text-left">
          <div className="flex items-center gap-2.5">
            <img
              src={MOCK_USERS.merchant.avatar}
              alt="Merchant"
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-300 shrink-0"
            />
            <div>
              <h3 className="text-xs font-bold text-white leading-tight">
                {MOCK_USERS.merchant.name}
              </h3>
              <p className="text-[10px] text-emerald-100">Kios Sayur Mbak Siti · Blok A No. 12</p>
            </div>
          </div>

          {/* Store status switch */}
          <button
            type="button"
            onClick={() => setIsStoreOpen(!isStoreOpen)}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
              isStoreOpen
                ? 'bg-emerald-400 text-emerald-950 shadow-xs'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            <Power size={11} />
            <span>{isStoreOpen ? 'Kios Buka' : 'Kios Tutup'}</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-3.5 flex-1 text-left overflow-y-auto space-y-3.5">
        {/* Merchant Key Figures */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-semibold block">Omset Hari Ini</span>
            <div className="flex items-center gap-1 mt-0.5">
              <TrendingUp size={14} className="text-emerald-600" />
              <span className="text-xs font-black text-slate-900">Rp 425.000</span>
            </div>
            <span className="text-[9px] text-slate-400">14 Transaksi</span>
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-semibold block">Pesanan Masuk</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Package size={14} className="text-blue-600" />
              <span className="text-xs font-black text-blue-700">
                {orders.filter((o) => o.status !== 'Selesai').length} Belanjaan
              </span>
            </div>
            <span className="text-[9px] text-slate-400">Perlu Disiapkan</span>
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-semibold block">Saldo Siap Cair</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Wallet size={14} className="text-amber-600" />
              <span className="text-xs font-black text-amber-800">Rp 680.000</span>
            </div>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="text-[9px] font-bold text-emerald-700 hover:underline block mt-0.5"
            >
              Tarik Saldo →
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex bg-slate-200/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('pesanan')}
            className={`flex-1 py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'pesanan' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
            }`}
          >
            <Package size={12} />
            <span>Pesanan ({orders.filter((o) => o.status !== 'Selesai').length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('katalog')}
            className={`flex-1 py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'katalog' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
            }`}
          >
            <Store size={12} />
            <span>Katalog ({products.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('keuangan')}
            className={`flex-1 py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'keuangan' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
            }`}
          >
            <Wallet size={12} />
            <span>Pencairan</span>
          </button>
        </div>

        {/* TAB 1: INCOMING SHOPPING ORDERS */}
        {activeTab === 'pesanan' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Daftar Pesanan Belanja Pasar Warga
              </span>
              <span className="text-[10px] text-slate-500">Kios Mbak Siti</span>
            </div>

            <div className="space-y-2.5">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900">{ord.customerName}</span>
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-semibold">
                          {ord.courierType}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {ord.orderTime} · Antar ke: {ord.deliveryAddress}
                      </p>
                    </div>

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      ord.status === 'Menunggu'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : ord.status === 'Disiapkan'
                        ? 'bg-blue-100 text-blue-800'
                        : ord.status === 'Siap Diambil Kurir'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {ord.status}
                    </span>
                  </div>

                  {/* Item List */}
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-[11px]">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-slate-700">
                        <span>{it.qty}x {it.name}</span>
                        <span className="font-mono text-slate-800">Rp {it.price.toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-xs text-slate-900">
                      <span>Total Belanja:</span>
                      <span className="text-emerald-700">Rp {ord.total.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {/* Order Workflow Actions */}
                  <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-slate-100">
                    {ord.status === 'Menunggu' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateOrderStatus(ord.id, 'Disiapkan')}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-colors"
                      >
                        <Package size={13} />
                        <span>Mulai Siapkan Belanjaan</span>
                      </button>
                    )}

                    {ord.status === 'Disiapkan' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateOrderStatus(ord.id, 'Siap Diambil Kurir')}
                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-colors"
                      >
                        <Bike size={13} />
                        <span>Panggil Kurir Becak / Ojek Jemput</span>
                      </button>
                    )}

                    {ord.status === 'Siap Diambil Kurir' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateOrderStatus(ord.id, 'Selesai')}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-colors"
                      >
                        <CheckCircle2 size={13} />
                        <span>Selesai Diserahkan ke Kurir</span>
                      </button>
                    )}

                    {ord.status === 'Selesai' && (
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        <span>Transaksi Berhasil</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT CATALOG & STOCK */}
        {activeTab === 'katalog' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Katalog Produk Kios Pasar
              </span>
              <button
                type="button"
                onClick={() => setShowAddProductModal(true)}
                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs transition-colors"
              >
                <PlusCircle size={12} />
                <span>Tambah Produk</span>
              </button>
            </div>

            <div className="space-y-2">
              {products.map((prod) => (
                <div key={prod.id} className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{prod.image}</span>
                    <div>
                      <h4 className="font-bold text-slate-900">{prod.name}</h4>
                      <p className="text-[11px] text-emerald-700 font-extrabold mt-0.5">
                        Rp {prod.price.toLocaleString('id-ID')} <span className="text-[10px] font-normal text-slate-500">/ {prod.unit}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleProductStock(prod.id)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-colors ${
                        prod.inStock
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {prod.inStock ? 'Stok Tersedia' : 'Stok Habis'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SALDO & PENCAIRAN */}
        {activeTab === 'keuangan' && (
          <div className="space-y-3 text-xs">
            <div className="p-4 bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-2xl shadow-md space-y-2">
              <span className="text-[11px] text-emerald-100 font-semibold block">Total Saldo Hasil Penjualan:</span>
              <p className="text-2xl font-black">
                Rp {walletBalance.toLocaleString('id-ID')}
              </p>
              <p className="text-[10px] text-emerald-100">
                Dapat dicairkan ke rekening bank BJB, e-wallet DANA/OVO, atau diambil tunai di pengurus Paguyuban Pasar Jungjang.
              </p>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(true)}
                className="mt-2 w-full py-2 bg-white text-emerald-950 hover:bg-emerald-50 font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                Cairkan Dana Sekarang
              </button>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <h4 className="font-bold text-slate-900">Riwayat Pencairan Terakhir</h4>
              <div className="space-y-2 pt-1 border-t border-slate-100 text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <div>
                    <p className="font-bold text-slate-800">Tarik Tunai Kas Pasar Jungjang</p>
                    <span className="text-[10px] text-slate-400">Kemarin, 14.30 WIB</span>
                  </div>
                  <strong className="text-emerald-700">Rp 350.000</strong>
                </div>
                <div className="flex justify-between py-1">
                  <div>
                    <p className="font-bold text-slate-800">Transfer Bank BJB Cirebon</p>
                    <span className="text-[10px] text-slate-400">02 Okt 2026</span>
                  </div>
                  <strong className="text-emerald-700">Rp 500.000</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add Product */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xs rounded-2xl p-4 text-left shadow-xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900">Tambah Produk Kios Baru</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-slate-700 text-xs">✕</button>
            </div>

            <form onSubmit={handleAddProduct} className="py-2 space-y-2.5 text-xs">
              <div>
                <label className="block text-[10px] text-slate-600 mb-1">Nama Produk Pasar</label>
                <input
                  type="text"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="Contoh: Wortel Brastagi Segar"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-600 mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-600 mb-1">Satuan</label>
                  <input
                    type="text"
                    value={newProductUnit}
                    onChange={(e) => setNewProductUnit(e.target.value)}
                    placeholder="1 kg / ikat"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-600 mb-1">Pilih Ikon / Emoji</label>
                <div className="flex gap-2">
                  {['🥬', '🥕', '🥔', '🥒', '🧅', '🌶️', '🥩', '🥚'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setNewProductEmoji(em)}
                      className={`p-1.5 rounded-lg border text-base ${newProductEmoji === em ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200'}`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Simpan Produk Kios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Withdraw */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xs rounded-2xl p-4 text-left shadow-xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900">Pencairan Saldo Merchant</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="text-slate-400 hover:text-slate-700 text-xs">✕</button>
            </div>

            <form onSubmit={handleWithdraw} className="py-2 space-y-2.5 text-xs">
              <p className="text-[11px] text-slate-500">
                Saldo tersedia: <strong className="text-emerald-700">Rp {walletBalance.toLocaleString('id-ID')}</strong>
              </p>

              <div>
                <label className="block text-[10px] text-slate-600 mb-1">Nominal Penarikan (Rp)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  max={walletBalance}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-600 mb-1">Tujuan Pencairan</label>
                <select className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs">
                  <option>Kas Pengurus Pasar Jungjang (Ambil Tunai)</option>
                  <option>Rekening Bank BJB Cirebon (3209-xxxx-01)</option>
                  <option>Dompet Digital DANA / OVO</option>
                </select>
              </div>

              {withdrawSuccess && (
                <div className="p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-[11px] text-emerald-800">
                  ✅ Permintaan pencairan berhasil diproses!
                </div>
              )}

              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Konfirmasi Tarik Dana
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
