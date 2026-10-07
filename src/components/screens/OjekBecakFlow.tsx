import React, { useState } from 'react';
import { LocationItem, DriverVehicle, DriverInfo, ChatMessage } from '../../types';
import { MOCK_LOCATIONS, VEHICLE_OPTIONS, MOCK_DRIVERS, APP_IMAGES } from '../../data/mockData';
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
  RotateCcw
} from 'lucide-react';

interface OjekBecakFlowProps {
  currentLocation: LocationItem;
  onBack: () => void;
  isWireframe?: boolean;
}

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
  const [activeDriver, setActiveDriver] = useState<DriverInfo>(MOCK_DRIVERS.becak_onthel);

  // Live chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'driver',
      text: 'Sampun dipun tampi nggih pesenane. Kula langsung meluncur teng titik jemput.',
      time: '09:32',
    },
    {
      id: 'm-2',
      sender: 'user',
      text: 'Nggih mang, kula nengga teng ngajeng gapura Blok Makmur nggih.',
      time: '09:33',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickReplies = [
    'Mang, sampun teng pundi posisine?',
    'Kula nengga teng ngajeng gang nggih',
    'Bade mampir tuku es sekedap saget?',
    'Matur kesuwun mang!',
  ];

  const handleOrder = () => {
    // Pick driver based on vehicle
    const driver = MOCK_DRIVERS[selectedVehicle.id] || MOCK_DRIVERS.becak_onthel;
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
        'Nggih mas, siap kulo kebut alon-alon.',
        'Iyo iki wis cedhak pos kamling, 2 menit maning tekan.',
        'Siap mas, tenang bae belanjaan aman neng becak.',
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
                    Transportasi Khas Desa
                  </span>
                  <h3 className="text-xs font-bold text-slate-900">
                    Becak Onthel & Ojek Langganan Warga
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Tarif transparan, mitra paguyuban desa terpercaya.
                  </p>
                </div>
              </div>
            </div>

            {/* Route Input Box */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Rute Perjalanan
              </label>

              {/* Pickup Point */}
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={14} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <span className="text-[10px] text-slate-400 font-semibold block">Titik Jemput:</span>
                  <select
                    value={pickup.id}
                    onChange={(e) => {
                      const found = MOCK_LOCATIONS.find((l) => l.id === e.target.value);
                      if (found) setPickup(found);
                    }}
                    className="w-full text-xs font-bold text-slate-800 bg-transparent focus:outline-none"
                  >
                    {MOCK_LOCATIONS.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.detail})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Destination Point */}
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Navigation size={14} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <span className="text-[10px] text-slate-400 font-semibold block">Tujuan Pengantaran:</span>
                  <select
                    value={destination.id}
                    onChange={(e) => {
                      const found = MOCK_LOCATIONS.find((l) => l.id === e.target.value);
                      if (found) setDestination(found);
                    }}
                    className="w-full text-xs font-bold text-slate-800 bg-transparent focus:outline-none"
                  >
                    {MOCK_LOCATIONS.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.detail})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Estimasi Jarak Tempuh: <strong>1.4 km</strong></span>
                <span className="text-emerald-700 font-semibold">Jalan Desa Lancar</span>
              </div>
            </div>

            {/* Vehicle Options */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Pilih Jenis Armada
              </label>

              <div className="space-y-2">
                {VEHICLE_OPTIONS.map((veh) => {
                  const isSelected = selectedVehicle.id === veh.id;
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
                          <span className="text-[10px] text-slate-600 font-medium">
                            Kapasitas: {veh.capacity} · {veh.eta}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-2">
                        <span className="text-xs font-extrabold text-red-700 tabular-nums">
                          Rp {veh.priceEstimate.toLocaleString('id-ID')}
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
                  💵 Tunai Pas Sampai
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
                  📱 QRIS Dompet Wong Pay
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
              <span>Meminta konfirmasi mitra terdekat...</span>
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
                <span className="font-bold">Mitra Ditemukan & Sedang Menuju ke Anda!</span>
                <p className="text-[11px] text-emerald-700">Estimasi sampai titik jemput: 3 menit lagi</p>
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
                    <span>{activeDriver.completedTrips} tarikan sukses</span>
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
                  <span>Chat Driver</span>
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
                <span className="text-slate-500">Pembayaran:</span>
                <span className="font-bold text-slate-800 capitalize">{paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-600 font-bold">Total Tarif:</span>
                <span className="font-extrabold text-red-700 text-sm">
                  Rp {selectedVehicle.priceEstimate.toLocaleString('id-ID')}
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

            {/* Quick replies in local dialect */}
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
                placeholder="Tulis pesan ke driver..."
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
              <span className="text-[10px] text-slate-500 block">Total Tarif Perjalanan:</span>
              <span className="text-base font-black text-red-700 tabular-nums">
                Rp {selectedVehicle.priceEstimate.toLocaleString('id-ID')}
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
