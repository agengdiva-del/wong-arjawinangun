import React from 'react';
import { ScreenId, AppRole } from '../types';
import {
  Home,
  ShoppingBag,
  Vote,
  User,
  Users
} from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  userRole?: AppRole;
  onSwitchRole?: (role: AppRole) => void;
  isWireframe?: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  activeScreen,
  onNavigate,
}) => {
  // Bottom navigation tabs for the citizen mobile app
  const navTabs = [
    { id: 'dashboard' as ScreenId, label: 'Beranda', icon: Home },
    { id: 'polling' as ScreenId, label: 'Polling', icon: Vote, badge: 'Baru' },
    { id: 'belanja_offline' as ScreenId, label: 'Pasar', icon: ShoppingBag },
    { id: 'komunitas' as ScreenId, label: 'Komunitas', icon: Users },
    { id: 'profil' as ScreenId, label: 'Akun', icon: User },
  ];

  // Hide bottom nav on welcome and dedicated admin portal screens
  const showBottomNav = activeScreen !== 'welcome' && activeScreen !== 'admin_portal_login';

  return (
    <div className="min-h-screen w-full flex justify-center bg-slate-100 sm:py-0">
      {/* Direct Clean Mobile & Responsive Web View */}
      <div className="w-full max-w-md min-h-screen flex flex-col relative bg-white text-slate-900 shadow-xl border-x border-slate-200/80">
        {/* Main Application Screen Content */}
        <main className="flex-1 flex flex-col w-full relative">
          {children}
        </main>

        {/* Mobile In-App Bottom Navigation Bar */}
        {showBottomNav && (
          <nav className="sticky bottom-0 w-full border-t flex items-center justify-around py-1.5 px-1 shrink-0 z-40 select-none bg-white/95 backdrop-blur-md border-slate-200 text-slate-600 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive =
                activeScreen === tab.id ||
                (tab.id === 'belanja_offline' && activeScreen === 'belanja_offline') ||
                (tab.id === 'polling' && activeScreen === 'polling');

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onNavigate(tab.id)}
                  className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all group relative ${
                    isActive
                      ? 'text-red-700 font-extrabold'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <div className={`p-1 rounded-xl transition-transform group-hover:scale-105 relative ${
                    isActive ? 'bg-red-50 text-red-700' : ''
                  }`}>
                    <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
                    {tab.badge && !isActive && (
                      <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-red-600 text-[8px] font-black text-white rounded-full leading-tight">
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] tracking-tight leading-none mt-0.5">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
};

