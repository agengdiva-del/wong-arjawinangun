import { LocationItem } from '../types';
import { MOCK_LOCATIONS } from '../data/mockData';

export interface DeviceLocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
  matchedLocation: LocationItem;
  isActualGps: boolean;
  formattedAddress: string;
  timestamp: number;
}

// Known Arjawinangun landmark coordinates for nearest reference matching
const ARJAWINANGUN_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'loc-1': { lat: -6.6450, lng: 108.4120 }, // Blok Makmur
  'loc-2': { lat: -6.6432, lng: 108.4168 }, // Pasar Jungjang
  'loc-3': { lat: -6.6498, lng: 108.4095 }, // Stasiun Arjawinangun
  'loc-4': { lat: -6.6520, lng: 108.4230 }, // RSUD Arjawinangun
  'loc-5': { lat: -6.6468, lng: 108.4145 }, // Balai Desa
  'loc-6': { lat: -6.6380, lng: 108.4110 }, // Dusun Karangmulya
  'loc-7': { lat: -6.6510, lng: 108.4020 }, // Kebonturi
  'loc-8': { lat: -6.6310, lng: 108.3980 }, // Pasar Sandang Tegalgubug
};

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function requestDeviceLocation(): Promise<DeviceLocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Perangkat tidak mendukung GPS Geolocation'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        // Find closest Arjawinangun point
        let nearestLoc = MOCK_LOCATIONS[0];
        let minDistance = Infinity;

        for (const loc of MOCK_LOCATIONS) {
          const coord = ARJAWINANGUN_COORDINATES[loc.id];
          if (coord) {
            const dist = calculateDistanceKm(latitude, longitude, coord.lat, coord.lng);
            if (dist < minDistance) {
              minDistance = dist;
              nearestLoc = loc;
            }
          }
        }

        const isNearbyArjawinangun = minDistance < 15; // within 15 km

        const formattedAddress = isNearbyArjawinangun
          ? `${nearestLoc.name} (${minDistance < 0.2 ? 'Tepat di Titik' : `${(minDistance * 1000).toFixed(0)}m dari lokasi`})`
          : `GPS Aktual (${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°) · Terhubung`;

        const resolvedLocation: LocationItem = {
          id: 'loc-gps-aktual',
          name: formattedAddress,
          detail: `GPS Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)} (Akurasi: ±${Math.round(accuracy)}m)`,
          tag: 'GPS Aktual',
        };

        const result: DeviceLocationResult = {
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          matchedLocation: resolvedLocation,
          isActualGps: true,
          formattedAddress,
          timestamp: Date.now(),
        };

        // Cache last known GPS
        try {
          localStorage.setItem('wong_arjawinangun_gps_location', JSON.stringify(result));
        } catch (e) {}

        resolve(result);
      },
      (error) => {
        let msg = 'Gagal mengakses GPS perangkat.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Izin lokasi ditolak oleh pengguna pada browser.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Informasi lokasi perangkat sedang tidak tersedia.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Waktu permintaan izin lokasi habis.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}
