/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenId, AppRole, LocationItem } from './types';
import { MOCK_LOCATIONS } from './data/mockData';
import { MobileFrame } from './components/MobileFrame';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { OjekBecakFlow } from './components/screens/OjekBecakFlow';
import { BelanjaOfflineFlow } from './components/screens/BelanjaOfflineFlow';
import { JasaLokalFlow } from './components/screens/JasaLokalFlow';
import { ProfilScreen } from './components/screens/ProfilScreen';
import { BantuanKomunitasScreen } from './components/screens/BantuanKomunitasScreen';
import { MitraDashboardScreen } from './components/screens/MitraDashboardScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [userRole, setUserRole] = useState<AppRole>('pelanggan');
  const [currentLocation, setCurrentLocation] = useState<LocationItem>(MOCK_LOCATIONS[0]); // Blok Makmur
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [isFramed, setIsFramed] = useState<boolean>(true);

  const handleWelcomeContinue = (role: AppRole, location: LocationItem) => {
    setUserRole(role);
    setCurrentLocation(location);
    if (role === 'mitra') {
      setCurrentScreen('mitra_dashboard');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  const handleSwitchRole = (newRole: AppRole) => {
    setUserRole(newRole);
    if (newRole === 'mitra') {
      setCurrentScreen('mitra_dashboard');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  return (
    <MobileFrame
      activeScreen={currentScreen}
      onNavigate={setCurrentScreen}
      isWireframe={isWireframe}
      onToggleWireframe={() => setIsWireframe(!isWireframe)}
      isFramed={isFramed}
      onToggleFramed={() => setIsFramed(!isFramed)}
    >
      {/* 1. Halaman Awal (Beranda / Onboarding & Role Switcher) */}
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onContinue={handleWelcomeContinue}
          currentRole={userRole}
          currentLocation={currentLocation}
          isWireframe={isWireframe}
        />
      )}

      {/* 2. Dashboard Utama */}
      {currentScreen === 'dashboard' && (
        <DashboardScreen
          currentLocation={currentLocation}
          onChangeLocation={setCurrentLocation}
          onNavigate={setCurrentScreen}
          userRole={userRole}
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

      {/* 4. Detail Fitur: Belanja Offline (Pasar & Warung) */}
      {currentScreen === 'belanja_offline' && (
        <BelanjaOfflineFlow
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

      {/* 6. Profil Pengguna */}
      {currentScreen === 'profil' && (
        <ProfilScreen
          userRole={userRole}
          onSwitchRole={handleSwitchRole}
          onBack={() => setCurrentScreen('dashboard')}
          isWireframe={isWireframe}
        />
      )}

      {/* 7. Bantuan & Komunitas (FAQ, Forum Warga, Kontak Admin Desa) */}
      {currentScreen === 'komunitas' && (
        <BantuanKomunitasScreen
          onBack={() => setCurrentScreen('dashboard')}
          isWireframe={isWireframe}
        />
      )}

      {/* 8. Mode Mitra (Dashboard Khusus Driver/Tukang/Pedagang) */}
      {currentScreen === 'mitra_dashboard' && (
        <MitraDashboardScreen
          onBack={() => setCurrentScreen('dashboard')}
          onSwitchRole={handleSwitchRole}
          onNavigate={setCurrentScreen}
          isWireframe={isWireframe}
        />
      )}
    </MobileFrame>
  );
}
