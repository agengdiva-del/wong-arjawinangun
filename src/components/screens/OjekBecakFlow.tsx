import React, { useState, useEffect, useMemo } from 'react';
import { LocationItem, DriverVehicle, DriverInfo, ChatMessage } from '../../types';
import { MOCK_LOCATIONS, VEHICLE_OPTIONS, MOCK_DRIVERS, APP_IMAGES } from '../../data/mockData';
import { api } from '../../services/api';
import {
  requestDeviceLocation,
  watchDeviceLocation,
  calculateRouteDistanceKm,
  calculateDistancePrice,
  DeviceLocationResult,
} from '../../services/locationService';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  CheckCircle2,
  Phone,
  MessageSquare,
  Clock,
  Send,
  Sparkles,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';

interface OjekBecakFlowProps {
  currentLocation: LocationItem;
  onBack: () => void;
  isWireframe?: boolean;
}

const DEFAULT_DRIVER: DriverInfo = {
  id: 'drv-default',
  name: 'Mang Duloh',
  phone: '0812-3456-7890',
  vehicleType: 'Becak Onthel & Ojek Desa',
  plateOrNumber: 'paguyuban-14',
  rating: 4.95,
  completedTrips: 142,
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  locationNear: 'Blok Makmur',
  isVerified: true,
};

export const OjekBecakFlow: React.FC<OjekBecakFlowProps> = ({
  currentLocation,
  onBack,
  isWireframe = false,
}) => {
  // Steps: 'select' -> 'searching' -> 'found' -> 'chat'
  const [step, setStep] = useState<'select' | 'searching' | 'found' | 'chat'>('select');

  const [pickup, setPickup] = useState<LocationItem>(currentLocation);
  const [destination, setDestination] = useState<LocationItem>(MOCK_LOCATIONS[1]); // Pasar Jungjang
  const [selectedVehicle, setSelectedVehicle] = useState<DriverVehicle>(VEHICLE_OPTIONS[0]); // Becak Onthel
  const [paymentMethod, setPaymentMethod] = useState<'tunai' | 'qris'>('tunai');
  const [activeDriver, setActiveDriver] = useState<DriverInfo>(
    MOCK_DRIVERS?.becak_onthel || DEFAULT_DRIVER
  );
  const [gpsLoading, setGpsLoading] = useState(false);
  const [destSearchQuery, setDestSearchQuery] = useState('');
  const [destCategoryFilter, setDestCategoryFilter] = useState('Semua');
  const [realtimeGps, setRealtimeGps] = useState<DeviceLocationResult | null>(() => {
    try {
      const saved = localStorage.getItem('wong_arjawinangun_gps_location');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [availableVehicles, setAvailableVehicles] = useState<DriverVehicle[]>(VEHICLE_OPTIONS);

  useEffect(() => {
    api.getDrivers().then((res) => {
      if (res && res.vehicleOptions && res.vehicleOptions.length > 0) {
        setAvailableVehicles(res.vehicleOptions);
      }
    }).catch(() => {});
  }, []);

  // Sambungkan lokasi realtime dari HP pengguna secara otomatis
  useEffect(() => {
    const stopWatching = watchDeviceLocation((result) => {
      setRealtimeGps(result);
      setPickup((prev) => {
        if (prev.id === 'loc-gps-aktual' || prev.id === currentLocation.id) {
          return result.matchedLocation;
        }
        return prev;
      });
    });
    return () => stopWatching();
  }, [currentLocation.id]);

  const handlePickupGps = async () => {
    setGpsLoading(true);
    try {
      const result = await requestDeviceLocation();
      setRealtimeGps(result);
      setPickup(result.matchedLocation);
      setGpsLoading(false);
    } catch (e) {
      setGpsLoading(false);
    }
  };

  // Hitung jarak rute aktual (km) berdasarkan titik jemput (termasuk GPS realtime HP) & tujuan
  const distanceKm = useMemo(() => {
    return calculateRouteDistanceKm(pickup, destination);
  }, [pickup, destination]);

  // Hitung harga kendaraan yang dipilih berdasarkan jarak
  const selectedVehiclePricing = useMemo(() => {
    return calculateDistancePrice(selectedVehicle, distanceKm);
  }, [selectedVehicle, distanceKm]);

  // Live chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'driver',
      text: 'Pesanan sudah diterima ya. Saya langsung meluncur ke titik jemput.',
      time: '09:32',
    },
    {
      id: 'm-2',
      sender: 'user',
      text: 'Baik Pak, saya menunggu di titik jemput sesuai lokasi aplikasi ya.',
      time: '09:33',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickReplies = [
    'Pak, sudah di mana posisinya?',
    'Saya menunggu di depan gang ya',
    'Boleh mampir beli minuman sebentar?',
    'Terima kasih banyak Pak!',
  ];

  const handleOrder = () => {
    const driver = MOCK_DRIVERS?.[selectedVehicle.id] || {
      ...DEFAULT_DRIVER,
      vehicleType: selectedVehicle.title,
    };
    setActiveDriver(driver);
    setStep('searching');

    setTimeout(() => {
      setStep('found');
    }, 1800);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      time: 'Sekarang',
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Simulate driver reply
    setTimeout(() => {
      const replies = [
        'Baik, siap saya segera menuju ke sana dengan hati-hati.',
        'Iya ini sudah dekat pos kamling, sekitar 2 menit lagi sampai.',
        'Siap, tenang saja belanjaan aman di kendaraan.',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setChatMessages((prev) => [
        ...prev,
        {
          id: `rep-${Date.now()}`,
          sender: 'driver',
          text: randomReply,
          time: 'Baru saja',
        },
      ]);
    }, 1200);
  };

  // List opsi lokasi termasuk GPS Realtime HP pengguna jika aktif
  const locationSelectOptions = useMemo(() => {
    const gpsLoc =
      pickup.id === 'loc-gps-aktual'
        ? pickup
        : realtimeGps?.matchedLocation || null;
    if (gpsLoc) {
      return [gpsLoc, ...MOCK_LOCATIONS.filter((l) => l.id !== gpsLoc.id)];
    }
    return MOCK_LOCATIONS;
  }, [pickup, realtimeGps]);

  return (
    <div className={`min-h-full flex flex-col justify-between ${isWireframe ? 'bg-zinc-50' : 'bg-slate-50'}`}>
      {/* Top Header */}
      <div className={`p-4 border-b ${isWireframe ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-red-700 text-white border-red-800'}`}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (step === 'chat') setStep('found');
              else if (step === 'found') setStep('select');
              else onBack();
            }}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft size={16} />
            <span>Kembali</span>
          </button>
          <h2 className="text-sm font-bold truncate">
            {step === 'chat'
              ? `Chat dengan ${activeDriver.name}`
              : step === 'found'
              ? 'Status Penjemputan'
              : 'Pesan Ojek & Becak Lokal'}
          </h2>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium">
            Arjawinangun
          </span>
        </div>
      </div>

      {/* Main Content Area based on Step */}
      <div className="p-4 flex-1 text-left overflow-y-auto">
        {/* STEP 1: ROUTE & VEHICLE SELECTION */}
        {step === 'select' && (
          <div className="space-y-4">
            {/* Visual Header / Becak Highlight */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white p-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-red-100">
                  <img
                    src={APP_IMAGES.becakLokal}
                    alt="Becak Arjawinangun"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-red-700 tracking-wider">
                    Tarif Otomatis Sesuai Jarak
                  </span>
                  <h3 className="text-xs font-bold text-slate-900">
                    Becak Onthel & Ojek Langganan Warga
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Terhubung dengan GPS realtime HP Anda. Harga dihitung otomatis per kilometer.
                  </p>
                </div>
              </div>
            </div>

            {/* Route Input Box */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Rute Perjalanan
                </label>
                {realtimeGps && (
                  <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    GPS HP Realtime (±{realtimeGps.accuracy}m)
                  </span>
                )}
              </div>

              {/* Pickup Point */}
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={14} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between pb-0.5">
                    <span className="text-[10px] text-slate-400 font-semibold block">Titik Jemput (Lokasi Anda):</span>
                    <button
                      type="button"
                      onClick={handlePickupGps}
                      disabled={gpsLoading}
                      className="text-[9px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-100/70 hover:bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {gpsLoading ? (
                        <>
                          <RefreshCw size={9} className="animate-spin" />
                          <span>Menyambungkan GPS...</span>
                        </>
                      ) : (
                        <>
                          <Navigation size={9} />
                          <span>Perbarui GPS HP</span>
                        </>
                      )}
                    </button>
                  </div>
                  <select
                    value={pickup.id}
                    onChange={(e) => {
                      const found = locationSelectOptions.find((l) => l.id === e.target.value);
                      if (found) setPickup(found);
                    }}
                    className="w-full text-xs font-bold text-slate-800 bg-transparent focus:outline-none"
                  >
                    {locationSelectOptions.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.detail})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Destination Point with Extensive Arjawinangun & Jungjang Locations */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                      <Navigation size={12} />
                    </div>
                    <span className="text-[10px] text-slate-700 font-bold">
                      Tujuan Pengantaran ({MOCK_LOCATIONS.length} Lokasi Terdaftar):
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-semibold">
                    Arjawinangun & Jungjang
                  </span>
                </div>

                {/* Quick Popular Destination Chips */}
                <div>
                  <span className="text-[9px] text-slate-400 font-semibold block mb-1">
                    Tujuan Populer (1 Ketukan Cepat):
                  </span>
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                    {[
                      { name: 'Pasar Jungjang', id: 'loc-2' },
                      { name: 'Stasiun KA', id: 'loc-3' },
                      { name: 'RSUD Arjawinangun', id: 'loc-4' },
                      { name: 'Balai Desa Jungjang', id: 'loc-5' },
                      { name: 'Blok Makmur', id: 'loc-1' },
                      { name: 'Pasar Tegalgubug', id: 'loc-16' },
                      { name: 'Sentra Empal Gentong', id: 'loc-39' },
                      { name: 'SMPN 1', id: 'loc-10' },
                      { name: 'SMAN 1', id: 'loc-11' },
                    ].map((item) => {
                      const isSelected = destination.id === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            const found = MOCK_LOCATIONS.find((l) => l.id === item.id);
                            if (found) setDestination(found);
                          }}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border shrink-0 ${
                            isSelected
                              ? 'bg-red-700 text-white border-red-800 shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {item.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Full Destination Select Dropdown */}
                <select
                  value={destination.id}
                  onChange={(e) => {
                    const found = MOCK_LOCATIONS.find((l) => l.id === e.target.value);
                    if (found) setDestination(found);
                  }}
                  className="w-full p-2 text-xs font-bold text-slate-900 bg-white rounded-xl border border-slate-300 focus:border-red-600 focus:outline-none"
                >
                  <optgroup label="📍 Pasar & Sentra Belanja">
                    {MOCK_LOCATIONS.filter((l) => l.tag === 'Pasar' || l.tag === 'Pusat Grosir').map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} - {l.detail}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🚆 Transportasi & Terminal">
                    {MOCK_LOCATIONS.filter((l) => l.tag === 'Transportasi').map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} - {l.detail}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🏥 Kesehatan & Medis">
                    {MOCK_LOCATIONS.filter((l) => l.tag === 'Kesehatan').map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} - {l.detail}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🏡 Dusun & Pemukiman Warga">
                    {MOCK_LOCATIONS.filter((l) => l.tag === 'Dusun' || l.tag === 'Pemukiman').map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} - {l.detail}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🏫 Pendidikan & Pesantren">
                    {MOCK_LOCATIONS.filter((l) => l.tag === 'Pendidikan').map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} - {l.detail}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🏛️ Balai Desa & Fasilitas Umum">
                    {MOCK_LOCATIONS.filter((l) => l.tag === 'Pemerintahan' || l.tag === 'Fasilitas Umum' || l.tag === 'Ibadah' || l.tag === 'Keamanan' || l.tag === 'Keuangan' || l.tag === 'Kuliner').map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} - {l.detail}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 px-0.5">
                <span>
                  Jarak Tempuh Rute: <strong className="text-red-700 font-black">{distanceKm.toFixed(1)} km</strong>
                </span>
                <span className="text-emerald-700 font-semibold">
                  Estimasi {selectedVehiclePricing.etaText}
                </span>
              </div>
            </div>

            {/* Vehicle Options with Distance-Dependent Pricing */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Pilih Jenis Armada (Harga Sesuai Jarak {distanceKm.toFixed(1)} km)
                </label>
              </div>

              <div className="space-y-2">
                {availableVehicles.map((veh) => {
                  const isSelected = selectedVehicle.id === veh.id;
                  const pricing = calculateDistancePrice(veh, distanceKm);
                  return (
                    <button
                      key={veh.id}
                      type="button"
                      onClick={() => setSelectedVehicle(veh)}
                      className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-red-600 bg-red-50/60 ring-2 ring-red-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-2 rounded-xl bg-slate-100">{veh.icon}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-slate-900">{veh.title}</h4>
                            {veh.id === 'becak_onthel' && (
                              <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                                Favorit Pasar
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{veh.desc}</p>
                          <span className="text-[10px] text-slate-600 font-medium block mt-0.5">
                            Dasar Rp {pricing.baseFare.toLocaleString('id-ID')} + Rp {pricing.perKmRate.toLocaleString('id-ID')}/km · {pricing.etaText}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-2">
                        <span className="text-xs font-extrabold text-red-700 tabular-nums block">
                          Rp {pricing.totalPrice.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold block">
                          {distanceKm.toFixed(1)} km
                        </span>
                        <div className="mt-1">
                          {isSelected ? (
                            <CheckCircle2 size={16} className="text-red-600 ml-auto" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-300 ml-auto" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Metode Pembayaran
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('tunai')}
                  className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                    paymentMethod === 'tunai'
                      ? 'border-red-600 bg-red-50 text-red-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  💵 Tunai Saat Sampai
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                    paymentMethod === 'qris'
                      ? 'border-red-600 bg-red-50 text-red-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  📱 QRIS Dompet Digital
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SEARCHING DRIVER SIMULATION */}
        {step === 'searching' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center text-3xl animate-bounce">
              {selectedVehicle.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Mencari {selectedVehicle.title}...
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Menghubungkan ke pangkalan becak & ojek di sekitar {pickup.name}.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold animate-pulse">
              <Clock size={14} />
              <span>Meminta konfirmasi partner terdekat...</span>
            </div>
          </div>
        )}

        {/* STEP 3: DRIVER FOUND / TRACKING */}
        {step === 'found' && (
          <div className="space-y-4">
            {/* Success Banner */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800">
              <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
              <div className="text-xs">
                <span className="font-bold">Partner Ditemukan & Sedang Menuju ke Anda!</span>
                <p className="text-[11px] text-emerald-700">
                  Estimasi sampai titik jemput: {selectedVehiclePricing.etaText}
                </p>
              </div>
            </div>

            {/* Driver Profile Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <img
                    src={activeDriver.avatar}
                    alt={activeDriver.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{activeDriver.name}</h4>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 rounded">
                      Terverifikasi RT
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-red-700">{activeDriver.vehicleType}</p>
                  <p className="text-[11px] text-slate-500">
                    No. Plat/Armada: <strong className="text-slate-700">{activeDriver.plateOrNumber}</strong>
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600">
                    <span className="text-amber-500 font-bold">★ {activeDriver.rating}</span>
                    <span>·</span>
                    <span>{activeDriver.completedTrips} perjalanan selesai</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Chat & Call */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep('chat')}
                  className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <MessageSquare size={15} />
                  <span>Chat Pengemudi</span>
                </button>
                <a
                  href={`tel:${activeDriver.phone}`}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone size={15} className="text-emerald-600" />
                  <span>Hubungi Telepon</span>
                </a>
              </div>
            </div>

            {/* Trip Details Card */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <h5 className="font-bold text-slate-800">Detail Perjalanan</h5>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Dari:</span>
                <span className="font-semibold text-slate-800 text-right">{pickup.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Ke:</span>
                <span className="font-semibold text-slate-800 text-right">{destination.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Jarak Tempuh:</span>
                <span className="font-bold text-slate-800">{distanceKm.toFixed(1)} km</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Pembayaran:</span>
                <span className="font-bold text-slate-800 capitalize">{paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-600 font-bold">Total Tarif ({distanceKm.toFixed(1)} km):</span>
                <span className="font-extrabold text-red-700 text-sm">
                  Rp {selectedVehiclePricing.totalPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep('select')}
              className="w-full py-2 text-xs text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1"
            >
              <RotateCcw size={13} />
              <span>Pesan Ulang / Ganti Rute</span>
            </button>
          </div>
        )}

        {/* STEP 4: INTERACTIVE CHAT WITH DRIVER */}
        {step === 'chat' && (
          <div className="flex flex-col h-[400px]">
            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto space-y-2.5 p-1 pr-2">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-2.5 rounded-2xl text-xs ${
                      msg.sender === 'user'
                        ? 'bg-red-600 text-white rounded-br-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Quick replies */}
            <div className="pt-2 pb-1 overflow-x-auto whitespace-nowrap flex gap-1.5 no-scrollbar">
              {quickReplies.map((qr, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(qr)}
                  className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full border border-slate-200/80 shrink-0 transition-colors"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Tulis pesan ke pengemudi..."
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shrink-0"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action when in 'select' step */}
      {step === 'select' && (
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] text-slate-500 block">
                Total Tarif ({distanceKm.toFixed(1)} km):
              </span>
              <span className="text-base font-black text-red-700 tabular-nums">
                Rp {selectedVehiclePricing.totalPrice.toLocaleString('id-ID')}
              </span>
            </div>
            <span className="text-[11px] text-slate-600 font-medium">
              Bayar: <strong className="capitalize text-slate-900">{paymentMethod}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={handleOrder}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5"
          >
            <Sparkles size={15} />
            <span>Konfirmasi & Panggil {selectedVehicle.title}</span>
          </button>
        </div>
      )}
    </div>
  );
};
