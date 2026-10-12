/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenId, AppRole, LocationItem, UserAccount, VillagePoll } from './types';
import { MOCK_LOCATIONS, MOCK_USERS, MOCK_VILLAGE_POLLS } from './data/mockData';
import { api } from './services/api';
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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [userRole, setUserRole] = useState<AppRole>('pelanggan');
  const [currentLocation, setCurrentLocation] = useState<LocationItem>(MOCK_LOCATIONS[0]); // Blok Makmur
  const [isWireframe, setIsWireframe] = useState<boolean>(false);

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

  // Load data from backend on startup
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [backendProfiles, backendPolls] = await Promise.all([
          api.getProfiles(),
          api.getPolls(),
        ]);
        if (backendProfiles && Object.keys(backendProfiles).length > 0) {
          setUserAccounts((prev) => ({ ...prev, ...backendProfiles }));
        }
        if (backendPolls && backendPolls.length > 0) {
          setPolls(backendPolls);
        }
      } catch (err) {
        console.warn('Backend sync initial notice:', err);
      }
    }
    loadBackendData();
  }, []);

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

      {/* 4f. Hall of Fame Arjawinangun (Panggung Kehormatan & Usulan Warga) */}
      {currentScreen === 'hall_of_fame' && (
        <HallOfFameScreen
          onBack={() => setCurrentScreen('dashboard')}
          isWireframe={isWireframe}
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
    </MobileFrame>
  );
}
