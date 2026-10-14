/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenId, AppRole, LocationItem, UserAccount, VillagePoll, AppNotification } from './types';
import { MOCK_LOCATIONS, MOCK_USERS, MOCK_VILLAGE_POLLS, MOCK_NOTIFICATIONS } from './data/mockData';
import { api } from './services/api';
import { watchDeviceLocation } from './services/locationService';
import { MobileFrame } from './components/MobileFrame';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { OjekBecakFlow } from './components/screens/OjekBecakFlow';
import { BelanjaOfflineFlow } from './components/screens/BelanjaOfflineFlow';
import { JasaLokalFlow } from './components/screens/JasaLokalFlow';
import { ProfilScreen } from './components/screens/ProfilScreen';
import { BantuanKomunitasScreen } from './components/screens/BantuanKomunitasScreen';
import { MitraDashboardScreen } from './components/screens/MitraDashboardScreen';
import { MerchantDashboardScreen } from './components/screens/MerchantDashboardScreen';
import { AdminDashboardScreen } from './components/screens/AdminDashboardScreen';
import { SuperAdminDashboardScreen } from './components/screens/SuperAdminDashboardScreen';
import { AdminPortalLoginScreen } from './components/screens/AdminPortalLoginScreen';
import { PollingScreen } from './components/screens/PollingScreen';
import { QrisDonasiScreen } from './components/screens/QrisDonasiScreen';
import { LokerScreen } from './components/screens/LokerScreen';
import { TaniIkanScreen } from './components/screens/TaniIkanScreen';
import { HallOfFameScreen } from './components/screens/HallOfFameScreen';
import { NotificationModal } from './components/NotificationModal';
import { Trophy } from 'lucide-react';
import { gamificationStorage } from './services/gamificationService';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('welcome');
  const [userRole, setUserRole] = useState<AppRole>('pelanggan');
  const [currentLocation, setCurrentLocation] = useState<LocationItem>(() => {
    try {
      const savedGps = localStorage.getItem('wong_arjawinangun_gps_location');
      if (savedGps) {
        const parsed = JSON.parse(savedGps);
        if (parsed?.matchedLocation) return parsed.matchedLocation;
      }
    } catch (e) {}
    return MOCK_LOCATIONS[0];
  });
  const [isWireframe, setIsWireframe] = useState<boolean>(false);

  // Sambungkan lokasi realtime pada HP pengguna secara otomatis
  useEffect(() => {
    const stopWatching = watchDeviceLocation((result) => {
      setCurrentLocation((prev) => {
        if (prev.id === 'loc-gps-aktual' || prev.id === MOCK_LOCATIONS[0].id) {
          return result.matchedLocation;
        }
        return prev;
      });
    });
    return () => stopWatching();
  }, []);

  // Synchronized User Accounts with persistent localStorage
  const [userAccounts, setUserAccounts] = useState<Record<string, UserAccount>>(() => {
    try {
      const saved = localStorage.getItem('wong_arjawinangun_user_accounts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return MOCK_USERS;
  });

  // Synchronized Village Polls with persistent localStorage
  const [polls, setPolls] = useState<VillagePoll[]>(() => {
    try {
      const saved = localStorage.getItem('wong_arjawinangun_polls');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return MOCK_VILLAGE_POLLS;
  });

  // Synchronized In-App Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('wong_arjawinangun_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return MOCK_NOTIFICATIONS;
  });

  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);
  const [toastNotif, setToastNotif] = useState<AppNotification | null>(null);

  // Gamifikasi Warga Poin
  const [gamificationPoints, setGamificationPoints] = useState<number>(() => {
    return gamificationStorage.getPoints('usr-pelanggan');
  });
  const [profilInitialTab, setProfilInitialTab] = useState<
    'pribadi' | 'riwayat' | 'favorit' | 'pengaturan' | 'rating'
  >('pribadi');
  const [hallOfFameInitialTab, setHallOfFameInitialTab] = useState<'galeri' | 'usulan'>('galeri');

  const handleAwardPoints = (
    amount: number,
    title: string,
    category: 'Login Harian' | 'Aspirasi Polling' | 'Kegiatan Desa' | 'Donasi Sosial' | 'Ulasan Layanan'
  ) => {
    const res = gamificationStorage.addPoints(currentUser.id, amount, title, category);
    setGamificationPoints(res.newPoints);

    // Kirim notifikasi toast dan in-app
    const rewardNotif: AppNotification = {
      id: `notif-reward-${Date.now()}`,
      type: 'poll_voted' as any,
      title: `+${amount} Poin Gamifikasi! 🎉`,
      message: `${title} (${res.levelInfo.badge})`,
      timestamp: 'Baru saja',
      read: false,
      category: 'Gamifikasi',
    };
    setNotifications((prev) => [rewardNotif, ...prev]);
    setToastNotif(rewardNotif);
    setTimeout(() => setToastNotif(null), 4500);
  };

  // Sync notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wong_arjawinangun_notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  // Pembersihan otomatis data demo lama & inisialisasi aplikasi bersih siap pakai
  useEffect(() => {
    try {
      const isCleaned = localStorage.getItem('wong_arjawinangun_clean_ready_v2');
      if (!isCleaned) {
        localStorage.removeItem('wong_arjawinangun_user_accounts');
        localStorage.removeItem('wong_arjawinangun_polls');
        localStorage.removeItem('wong_arjawinangun_notifications');
        localStorage.removeItem('wong_arjawinangun_active_user');
        localStorage.setItem('wong_arjawinangun_clean_ready_v2', 'true');
        setUserAccounts(MOCK_USERS);
        setPolls([]);
        setNotifications([]);
      }
    } catch (e) {}
  }, []);

  // Load data from backend on startup
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [backendProfiles, backendPolls, backendNotifs] = await Promise.all([
          api.getProfiles(),
          api.getPolls(),
          api.getNotifications(),
        ]);
        if (backendProfiles && Object.keys(backendProfiles).length > 0) {
          setUserAccounts((prev) => ({ ...prev, ...backendProfiles }));
        }
        if (backendPolls && backendPolls.length > 0) {
          setPolls(backendPolls);
        }
        if (backendNotifs && backendNotifs.data && backendNotifs.data.length > 0) {
          setNotifications(backendNotifs.data);
        }
      } catch (err) {
        console.warn('Backend sync initial notice:', err);
      }
    }
    loadBackendData();
  }, []);

  const handleMarkNotificationRead = async (id?: string) => {
    setNotifications((prev) =>
      prev.map((n) => (id ? (n.id === id ? { ...n, read: true } : n) : { ...n, read: true }))
    );
    try {
      await api.markNotificationRead(id);
    } catch (err) {}
  };

  const handleClearNotifications = async () => {
    setNotifications([]);
    try {
      await api.clearNotifications();
    } catch (err) {}
  };

  const handleSimulateApproval = async (action: 'approve' | 'publish') => {
    try {
      const res = await api.simulateApprovalNotification(
        'Kang H. Sudirman Al-Hafidz',
        'Tokoh Masyarakat',
        action
      );
      if (res && res.notification) {
        setNotifications((prev) => [res.notification, ...prev]);
        setToastNotif(res.notification);
        setTimeout(() => setToastNotif(null), 6000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const currentUser = userAccounts[userRole] || MOCK_USERS[userRole] || MOCK_USERS.pelanggan;

  const handleUpdateAccount = async (role: AppRole, data: Partial<UserAccount>) => {
    setUserAccounts((prev) => {
      const updated = {
        ...prev,
        [role]: {
          ...(prev[role] || MOCK_USERS[role] || MOCK_USERS.pelanggan),
          ...data,
        },
      };
      try {
        localStorage.setItem('wong_arjawinangun_user_accounts', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Sync to backend
    try {
      await api.updateProfile(role, data);
    } catch (e) {
      console.warn('Failed to sync profile to backend:', e);
    }
  };

  const handleVotePoll = async (pollId: string, optionId: string) => {
    // Berikan poin gamifikasi untuk warga yang aktif memberikan aspirasi (+15 Poin)
    const pollItem = polls.find((p) => p.id === pollId);
    const pollTitle = pollItem?.title || 'Aspirasi Warga Desa';
    handleAwardPoints(15, `Aspirasi Polling: ${pollTitle}`, 'Aspirasi Polling');

    setPolls((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== pollId) return p;
        if (p.hasVoted) return p;
        const updatedOptions = p.options.map((opt) => {
          if (opt.id === optionId) {
            return { ...opt, votesCount: opt.votesCount + 1 };
          }
          return opt;
        });
        return {
          ...p,
          totalVotes: p.totalVotes + 1,
          hasVoted: true,
          userSelectedOptionId: optionId,
          options: updatedOptions,
        };
      });
      try {
        localStorage.setItem('wong_arjawinangun_polls', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Sync vote to backend
    try {
      await api.votePoll(pollId, optionId);
    } catch (e) {
      console.warn('Failed to sync vote to backend:', e);
    }
  };

  const handleCreatePoll = async (newPollData: Omit<VillagePoll, 'id' | 'totalVotes' | 'createdAt' | 'status'>) => {
    if (userRole !== 'super_admin' && userRole !== 'admin') {
      return;
    }
    const newPoll: VillagePoll = {
      ...newPollData,
      id: `poll-${Date.now()}`,
      status: 'Aktif',
      totalVotes: 0,
      hasVoted: false,
      createdAt: 'Baru saja',
    };
    setPolls((prev) => {
      const updated = [newPoll, ...prev];
      try {
        localStorage.setItem('wong_arjawinangun_polls', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Sync to backend
    try {
      await api.createPoll(newPollData);
    } catch (e) {
      console.warn('Failed to sync poll to backend:', e);
    }
  };

  const handleWelcomeContinue = (role: AppRole, location: LocationItem, verifiedUser?: UserAccount) => {
    setUserRole(role);
    setCurrentLocation(location);

    if (verifiedUser) {
      setUserAccounts((prev) => {
        const updated = {
          ...prev,
          [role]: verifiedUser,
        };
        try {
          localStorage.setItem('wong_arjawinangun_user_accounts', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
      // Sync to backend
      api.updateProfile(role, verifiedUser).catch(() => {});
    }

    if (role === 'super_admin') {
      setCurrentScreen('super_admin_dashboard');
    } else if (role === 'admin') {
      setCurrentScreen('admin_dashboard');
    } else if (role === 'mitra') {
      setCurrentScreen('mitra_dashboard');
    } else if (role === 'merchant') {
      setCurrentScreen('merchant_dashboard');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  const handleSwitchRole = (newRole: AppRole) => {
    setUserRole(newRole);
    if (newRole === 'super_admin') {
      setCurrentScreen('super_admin_dashboard');
    } else if (newRole === 'admin') {
      setCurrentScreen('admin_dashboard');
    } else if (newRole === 'mitra') {
      setCurrentScreen('mitra_dashboard');
    } else if (newRole === 'merchant') {
      setCurrentScreen('merchant_dashboard');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  return (
    <MobileFrame
      activeScreen={currentScreen}
      onNavigate={setCurrentScreen}
      userRole={userRole}
      onSwitchRole={handleSwitchRole}
      isWireframe={isWireframe}
    >
      {/* 1. Halaman Awal (Beranda / Onboarding & Role Switcher) */}
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onContinue={handleWelcomeContinue}
          onOpenAdminPortal={() => setCurrentScreen('admin_portal_login')}
          currentRole={userRole}
          currentLocation={currentLocation}
          userAccounts={userAccounts}
          isWireframe={isWireframe}
        />
      )}

      {/* 2. Dashboard Utama Pelanggan (Warga) */}
      {currentScreen === 'dashboard' && (
        <DashboardScreen
          currentLocation={currentLocation}
          onChangeLocation={setCurrentLocation}
          onNavigate={setCurrentScreen}
          userRole={userRole}
          currentUser={currentUser}
          villagePolls={polls}
          isWireframe={isWireframe}
          onOpenNotifications={() => setShowNotificationModal(true)}
          unreadNotificationsCount={unreadNotificationsCount}
          notifications={notifications}
          gamificationPoints={gamificationPoints}
          onAwardPoints={handleAwardPoints}
          onOpenLeaderboard={() => {
            setHallOfFameInitialTab('galeri');
            setCurrentScreen('hall_of_fame');
          }}
        />
      )}

      {/* 3. Detail Fitur: Ojek & Becak Lokal */}
      {currentScreen === 'ojek_becak' && (
        <OjekBecakFlow
          currentLocation={currentLocation}
          onBack={() => setCurrentScreen('dashboard')}
          isWireframe={isWireframe}
        />
      )}

      {/* 4. Detail Fitur: Belanja Offline (Pasar Tradisional) */}
      {currentScreen === 'belanja_offline' && (
        <BelanjaOfflineFlow
          initialCategory="all"
          pageTitle="Belanja Offline Pasar Tradisional"
          onBack={() => setCurrentScreen('dashboard')}
          isWireframe={isWireframe}
        />
      )}

      {/* 4b. Detail Fitur: Kuliner Khas Cirebon (Toko & Katalog tanpa pemesanan) */}
      {currentScreen === 'kuliner' && (
        <BelanjaOfflineFlow
          initialCategory="kuliner"
          pageTitle="Kuliner Khas Cirebon"
          onBack={() => setCurrentScreen('dashboard')}
          isWireframe={isWireframe}
        />
      )}

      {/* 4c. Layanan Utama: QRIS Donasi & Infaq Warga */}
      {currentScreen === 'qris_donasi' && (
        <QrisDonasiScreen
          onBack={() => setCurrentScreen('dashboard')}
          isWireframe={isWireframe}
        />
      )}

      {/* 4d. Layanan Khusus: Lowongan Kerja Arjawinangun */}
      {currentScreen === 'loker' && (
        <LokerScreen
          onBack={() => setCurrentScreen('dashboard')}
          isWireframe={isWireframe}
        />
      )}

      {/* 4e. Layanan Khusus: Tani & Ikan (Toko, Katalog, Rating & Komentar) */}
      {currentScreen === 'tani_ikan' && (
        <TaniIkanScreen
          onBack={() => setCurrentScreen('dashboard')}
          isWireframe={isWireframe}
        />
      )}

      {/* 4f. Hall of Fame Arjawinangun (Panggung Kehormatan, Papan Skor Warga & Usulan) */}
      {currentScreen === 'hall_of_fame' && (
        <HallOfFameScreen
          onBack={() => setCurrentScreen('dashboard')}
          isWireframe={isWireframe}
          userRole={userRole}
          currentUser={currentUser}
          activePoints={gamificationPoints}
          initialTab={hallOfFameInitialTab}
          onNavigateToPolling={() => setCurrentScreen('polling')}
          onOpenNotifications={() => setShowNotificationModal(true)}
          unreadNotificationsCount={unreadNotificationsCount}
          onSimulateApproval={handleSimulateApproval}
        />
      )}

      {/* 5. Detail Fitur: Jasa Lokal (Tukang) */}
      {currentScreen === 'jasa_lokal' && (
        <JasaLokalFlow
          onBack={() => setCurrentScreen('dashboard')}
          isWireframe={isWireframe}
        />
      )}

      {/* 6. Profil Pengguna (Edit Akun Asli & Penilaian Rating) */}
      {currentScreen === 'profil' && (
        <ProfilScreen
          userRole={userRole}
          userAccounts={userAccounts}
          onUpdateAccount={handleUpdateAccount}
          onSwitchRole={handleSwitchRole}
          onNavigate={setCurrentScreen}
          onBack={() => setCurrentScreen('dashboard')}
          isWireframe={isWireframe}
          gamificationPoints={gamificationPoints}
          initialTab={profilInitialTab}
        />
      )}

      {/* 7. Bantuan & Komunitas */}
      {currentScreen === 'komunitas' && (
        <BantuanKomunitasScreen
          onBack={() => setCurrentScreen('dashboard')}
          isWireframe={isWireframe}
        />
      )}

      {/* 8. Layanan Polling Aspirasi Desa (Hanya Admin yang bisa membuat) */}
      {currentScreen === 'polling' && (
        <PollingScreen
          polls={polls}
          onVote={handleVotePoll}
          onCreatePoll={handleCreatePoll}
          userRole={userRole}
          userName={currentUser.name}
          onBack={() => setCurrentScreen('dashboard')}
          onNavigate={setCurrentScreen}
        />
      )}

      {/* 9. Mode Mitra (Dashboard Khusus Driver/Becak/Ojek/Tukang) */}
      {currentScreen === 'mitra_dashboard' && (
        <MitraDashboardScreen
          onBack={() => setCurrentScreen('dashboard')}
          onSwitchRole={handleSwitchRole}
          onNavigate={setCurrentScreen}
          isWireframe={isWireframe}
        />
      )}

      {/* 10. Mode Merchant (Dashboard Khusus Pedagang Pasar & Warung) */}
      {currentScreen === 'merchant_dashboard' && (
        <MerchantDashboardScreen
          onBack={() => setCurrentScreen('dashboard')}
          onSwitchRole={handleSwitchRole}
          onNavigate={setCurrentScreen}
          isWireframe={isWireframe}
        />
      )}

      {/* 11. Mode Admin (Dashboard Khusus Admin Operasional Wilayah) */}
      {currentScreen === 'admin_dashboard' && (
        <AdminDashboardScreen
          onBack={() => setCurrentScreen('dashboard')}
          onSwitchRole={handleSwitchRole}
          onNavigate={setCurrentScreen}
          isWireframe={isWireframe}
        />
      )}

      {/* 12. Mode Super Admin (Dashboard Khusus Kuwu & Pengendali Sistem Balai Desa) */}
      {currentScreen === 'super_admin_dashboard' && (
        <SuperAdminDashboardScreen
          onBack={() => setCurrentScreen('dashboard')}
          onSwitchRole={handleSwitchRole}
          onNavigate={setCurrentScreen}
          isWireframe={isWireframe}
        />
      )}

      {/* 13. Tempat Khusus: Portal Login Petugas Balai Desa (Super Admin & Admin Ops) */}
      {currentScreen === 'admin_portal_login' && (
        <AdminPortalLoginScreen
          onSelectAdminRole={(role) => {
            handleSwitchRole(role);
          }}
          onBack={() => setCurrentScreen('welcome')}
          isWireframe={isWireframe}
        />
      )}

      {/* Floating In-App Toast Notification Banner */}
      {toastNotif && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-3 animate-in slide-in-from-top-4 duration-300">
          <div
            onClick={() => {
              setShowNotificationModal(true);
              setToastNotif(null);
            }}
            className="p-3 rounded-2xl bg-gradient-to-r from-red-800 via-rose-700 to-amber-700 text-white shadow-2xl border border-amber-300/60 cursor-pointer flex items-start gap-2.5 active:scale-[0.99] transition-transform"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-red-950 flex items-center justify-center shrink-0 shadow-xs">
              <Trophy size={16} />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase text-amber-200 tracking-wider">
                  {toastNotif.type === 'hall_of_fame_published' ? '🌟 Resmi Dipublikasikan' : '🏆 Usulan Disetujui'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setToastNotif(null);
                  }}
                  className="text-white/60 hover:text-white text-xs p-0.5"
                >
                  ✕
                </button>
              </div>
              <h4 className="text-xs font-black text-white mt-0.5 leading-snug">
                {toastNotif.title}
              </h4>
              <p className="text-[11px] text-amber-100 line-clamp-2 mt-0.5">
                {toastNotif.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* In-App Notification Center Modal */}
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotificationRead}
        onClearAll={handleClearNotifications}
        onNavigate={(screen, targetId) => {
          setShowNotificationModal(false);
          setCurrentScreen(screen);
        }}
        onSimulateApproval={handleSimulateApproval}
        isWireframe={isWireframe}
      />
    </MobileFrame>
  );
}
