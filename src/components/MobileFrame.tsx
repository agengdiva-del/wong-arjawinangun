import React from 'react';
import { ScreenId } from '../types';
import {
  Home,
  ShoppingBag,
  Heart,
  User,
  Users,
  Smartphone,
  Maximize2,
  Layers,
  Sparkles
} from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  isWireframe: boolean;
  onToggleWireframe: () => void;
  isFramed: boolean;
  onToggleFramed: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  activeScreen,
  onNavigate,
  isWireframe,
  onToggleWireframe,
  isFramed,
  onToggleFramed,
}) => {
  // Bottom navigation items
  const navTabs = [
    { id: 'dashboard' as ScreenId, label: 'Beranda', icon: Home },
    { id: 'ojek_becak' as ScreenId, label: 'Pesanan', icon: ShoppingBag },
    { id: 'belanja_offline' as ScreenId, label: 'Pasar', icon: Heart },
    { id: 'komunitas' as ScreenId, label: 'Komunitas', icon: Users },
    { id: 'profil' as ScreenId, label: 'Akun', icon: User },
  ];

  const showBottomNav = activeScreen !== 'welcome';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 font-sans">
      {/* Top Reviewer / Wireframe Control Bar */}
      <header className="w-full max-w-4xl mb-4 bg-slate-800/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center font-black text-sm shadow-sm">
            WA
          </div>
          <div className="text-left">
            <h1 className="text-sm font-bold text-white leading-tight">
              Wireframe "Wong Arjawinangun"
            </h1>
            <p className="text-[11px] text-slate-400">
              Prototipe Alur Mobile: Beranda · Ojek/Becak · Belanja Pasar · Profil · Komunitas
            </p>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          {/* Wireframe vs Hi-Fi Toggle */}
          <button
            type="button"
            onClick={onToggleWireframe}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isWireframe
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
            title="Ubah antara tampilan Wireframe Monokrom dan Tampilan Warna Penuh"
          >
            {isWireframe ? <Layers size={14} /> : <Sparkles size={14} />}
            <span>{isWireframe ? 'Mode: Wireframe Blueprint' : 'Mode: Full Warna (Hi-Fi)'}</span>
          </button>

          {/* Device Frame Toggle */}
          <button
            type="button"
            onClick={onToggleFramed}
            className={`p-2 rounded-xl text-xs font-medium transition-colors ${
              isFramed ? 'bg-slate-700 text-amber-300' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Smartphone Frame"
          >
            {isFramed ? <Smartphone size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </header>

      {/* Screen Flow Quick Navigation Chips */}
      <div className="w-full max-w-4xl mb-4 overflow-x-auto pb-1 no-scrollbar flex items-center gap-1.5 text-left">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Lompat Alur:
        </span>
        {[
          { id: 'welcome', label: '1. Halaman Awal' },
          { id: 'dashboard', label: '2. Dashboard Utama' },
          { id: 'ojek_becak', label: '3. Ojek & Becak' },
          { id: 'belanja_offline', label: '4. Belanja Offline' },
          { id: 'jasa_lokal', label: '5. Jasa Tukang' },
          { id: 'profil', label: '6. Profil Pengguna' },
          { id: 'komunitas', label: '7. Bantuan & Komunitas' },
          { id: 'mitra_dashboard', label: '8. Mode Mitra' },
        ].map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id as ScreenId)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-1 ring-white/20'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Main Container / Mobile Phone Enclosure */}
      <main className="w-full flex justify-center items-start">
        <div
          className={`relative transition-all duration-300 ${
            isFramed
              ? 'w-full max-w-[400px] h-[830px] rounded-[48px] p-3.5 bg-neutral-900 border-[7px] border-neutral-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/10'
              : 'w-full max-w-md min-h-[750px] rounded-3xl p-0 bg-transparent'
          }`}
        >
          {/* Inner Phone Display Container */}
          <div
            className={`w-full h-full rounded-[38px] overflow-hidden flex flex-col relative ${
              isWireframe
                ? 'grayscale contrast-125 border-2 border-dashed border-zinc-500 bg-zinc-100 text-zinc-900'
                : 'bg-white text-slate-900 shadow-inner'
            }`}
          >
            {/* Native Mobile Status Bar matching screenshot */}
            <div className={`px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold shrink-0 select-none z-30 ${
              isWireframe ? 'bg-zinc-800 text-zinc-200' : 'bg-red-700 text-white'
            }`}>
              {/* Time */}
              <span>09:41</span>

              {/* Dynamic Island / Camera Speaker pill */}
              <div className="w-24 h-4 bg-black/40 backdrop-blur-xs rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-black/60 mr-2" />
                <div className="w-2 h-2 rounded-full bg-red-950/40" />
              </div>

              {/* System icons: Signal, Wifi, Battery */}
              <div className="flex items-center gap-1.5 text-xs">
                <span>28 ıl·</span>
                <span>📶</span>
                <span className="font-mono text-[10px]">🔋98%</span>
              </div>
            </div>

            {/* Scrollable Screen Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative">
              {children}
            </div>

            {/* Fixed Bottom Mobile Tab Bar (if not on welcome screen) */}
            {showBottomNav && (
              <nav className={`w-full border-t flex items-center justify-around py-2 px-1 shrink-0 z-30 select-none transition-colors ${
                isWireframe
                  ? 'bg-zinc-100 border-zinc-300 text-zinc-800'
                  : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-600'
              }`}>
                {navTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive =
                    activeScreen === tab.id ||
                    (tab.id === 'ojek_becak' && (activeScreen === 'ojek_becak' || activeScreen === 'pesanan_aktif')) ||
                    (tab.id === 'belanja_offline' && activeScreen === 'belanja_offline');

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => onNavigate(tab.id)}
                      className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all group ${
                        isActive
                          ? isWireframe
                            ? 'text-zinc-950 font-black'
                            : 'text-red-700 font-extrabold'
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      <div className={`p-1 rounded-xl transition-transform group-hover:scale-110 ${
                        isActive && !isWireframe ? 'bg-red-50 text-red-700' : ''
                      }`}>
                        <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
                      </div>
                      <span className="text-[10px] tracking-tight leading-none mt-1">
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </nav>
            )}

            {/* Bottom Home Indicator Bar (iPhone home gesture bar) */}
            <div className="w-full py-1.5 flex justify-center bg-white shrink-0 z-30">
              <div className="w-32 h-1 bg-slate-300 rounded-full" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer Notes */}
      <footer className="mt-6 text-center text-xs text-slate-400">
        <span>Arjawinangun Local Community Platform Wireframe</span>
        <span className="mx-2">·</span>
        <span>Kecamatan Arjawinangun, Kabupaten Cirebon</span>
      </footer>
    </div>
  );
};
