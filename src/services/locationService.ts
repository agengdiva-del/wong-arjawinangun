import { LocationItem, DriverVehicle } from '../types';
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
export const ARJAWINANGUN_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'loc-1': { lat: -6.6450, lng: 108.4120 }, // Blok Makmur
  'loc-2': { lat: -6.6432, lng: 108.4168 }, // Pasar Jungjang
  'loc-3': { lat: -6.6498, lng: 108.4095 }, // Stasiun Arjawinangun
  'loc-4': { lat: -6.6520, lng: 108.4230 }, // RSUD Arjawinangun
  'loc-5': { lat: -6.6468, lng: 108.4145 }, // Balai Desa
  'loc-6': { lat: -6.6380, lng: 108.4110 }, // Dusun Karangmulya
  'loc-7': { lat: -6.6510, lng: 108.4020 }, // Kebonturi
  'loc-8': { lat: -6.6310, lng: 108.3980 }, // Pasar Sandang Tegalgubug
};

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

export function getLocationCoordinates(loc: LocationItem): { lat: number; lng: number } {
  if (typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
    return { lat: loc.latitude, lng: loc.longitude };
  }
  const known = ARJAWINANGUN_COORDINATES[loc.id];
  if (known) return known;
  return ARJAWINANGUN_COORDINATES['loc-1'];
}

/**
 * Menghitung jarak rute jalan (km) antara titik jemput dan tujuan
 */
export function calculateRouteDistanceKm(pickup: LocationItem, destination: LocationItem): number {
  if (pickup.id === destination.id && pickup.id !== 'loc-gps-aktual') {
    return 0.8;
  }

  const fromCoord = getLocationCoordinates(pickup);
  const toCoord = getLocationCoordinates(destination);

  const straightDistKm = calculateDistanceKm(fromCoord.lat, fromCoord.lng, toCoord.lat, toCoord.lng);

  // Jika pengguna menggunakan GPS di area Cirebon/Arjawinangun (<= 50 km), gunakan jarak GPS aktual * faktor kelokan jalan desa (1.25x)
  if (straightDistKm <= 50) {
    return Math.max(0.5, Number((straightDistKm * 1.25).toFixed(1)));
  }

  // Jika pengguna mengakses dari luar kota (> 50 km), hitung jarak berdasarkan titik terdekat di Arjawinangun + variasi koordinat GPS pengguna
  let nearestId = 'loc-1';
  let minDistance = Infinity;
  for (const [id, coord] of Object.entries(ARJAWINANGUN_COORDINATES)) {
    const d = calculateDistanceKm(fromCoord.lat, fromCoord.lng, coord.lat, coord.lng);
    if (d < minDistance) {
      minDistance = d;
      nearestId = id;
    }
  }
  const baseCoord = ARJAWINANGUN_COORDINATES[nearestId] || ARJAWINANGUN_COORDINATES['loc-1'];
  const localDist = calculateDistanceKm(baseCoord.lat, baseCoord.lng, toCoord.lat, toCoord.lng);
  const gpsOffset = ((Math.abs(fromCoord.lat) + Math.abs(fromCoord.lng)) * 100) % 1.2;
  return Math.max(0.6, Number(((localDist * 1.25) + gpsOffset).toFixed(1)));
}

/**
 * Menghitung harga kendaraan berdasarkan jarak tempuh (km)
 */
export function calculateDistancePrice(
  vehicle: DriverVehicle,
  distanceKm: number
): {
  totalPrice: number;
  baseFare: number;
  perKmRate: number;
  distanceKm: number;
  etaText: string;
} {
  const baseFare =
    vehicle.baseFare ??
    (vehicle.id === 'ojek' ? 5000 : vehicle.id === 'becak_onthel' ? 7000 : 10000);
  const perKmRate =
    vehicle.perKmRate ??
    (vehicle.id === 'ojek' ? 2500 : vehicle.id === 'becak_onthel' ? 3000 : 3500);

  // 1 km pertama masuk tarif dasar, selebihnya dihitung per km
  const extraKm = Math.max(0, distanceKm - 1);
  const rawTotal = baseFare + extraKm * perKmRate;
  // Bulatkan ke kelipatan Rp 500 terdekat
  const totalPrice = Math.round(rawTotal / 500) * 500;

  let minEta = 3;
  let maxEta = 6;
  if (vehicle.id === 'ojek') {
    minEta = Math.max(2, Math.round(distanceKm * 2));
    maxEta = minEta + 3;
  } else if (vehicle.id === 'becak_onthel') {
    minEta = Math.max(4, Math.round(distanceKm * 3.8));
    maxEta = minEta + 4;
  } else {
    minEta = Math.max(3, Math.round(distanceKm * 2.6));
    maxEta = minEta + 3;
  }

  return {
    totalPrice,
    baseFare,
    perKmRate,
    distanceKm,
    etaText: `${minEta}-${maxEta} mnt`,
  };
}

function buildLocationResult(position: GeolocationPosition, customAddressName?: string): DeviceLocationResult {
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

  const formattedAddress = customAddressName
    ? customAddressName
    : isNearbyArjawinangun
    ? `GPS HP: ${nearestLoc.name} (${minDistance < 0.2 ? 'Tepat di Titik' : `${(minDistance * 1000).toFixed(0)}m`})`
    : `Lokasi Realtime HP (${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°)`;

  const resolvedLocation: LocationItem = {
    id: 'loc-gps-aktual',
    name: formattedAddress,
    detail: `GPS Realtime: ${latitude.toFixed(5)}, ${longitude.toFixed(5)} (±${Math.round(accuracy)}m)`,
    tag: 'GPS Realtime',
    latitude,
    longitude,
    accuracy: Math.round(accuracy),
    isRealtimeGps: true,
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

  try {
    localStorage.setItem('wong_arjawinangun_gps_location', JSON.stringify(result));
  } catch (e) {}

  return result;
}

async function fetchReverseGeocodeName(lat: number, lng: number): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=17&addressdetails=1`,
      {
        headers: { 'Accept-Language': 'id' },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const data = await res.json();
    const addr = data?.address;
    if (addr) {
      const primary =
        addr.road ||
        addr.neighbourhood ||
        addr.hamlet ||
        addr.village ||
        addr.suburb ||
        addr.town ||
        addr.city_district;
      const secondary = addr.village || addr.suburb || addr.city || addr.county || '';
      if (primary) {
        return secondary && secondary !== primary
          ? `${primary}, ${secondary}`
          : `${primary}`;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function requestDeviceLocation(): Promise<DeviceLocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Perangkat tidak mendukung GPS Geolocation'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const geoName = await fetchReverseGeocodeName(
          position.coords.latitude,
          position.coords.longitude
        );
        const result = buildLocationResult(
          position,
          geoName ? `📍 ${geoName}` : undefined
        );
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
        maximumAge: 15000,
      }
    );
  });
}

/**
 * Memantau lokasi realtime dari HP pengguna secara berkelanjutan (watchPosition)
 */
export function watchDeviceLocation(
  onUpdate: (result: DeviceLocationResult) => void,
  onError?: (error: Error) => void
): () => void {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    if (onError) onError(new Error('Perangkat tidak mendukung GPS Geolocation'));
    return () => {};
  }

  let lastGeocodeTime = 0;
  let cachedPlaceName: string | undefined;

  const watchId = navigator.geolocation.watchPosition(
    async (position) => {
      const now = Date.now();
      if (!cachedPlaceName || now - lastGeocodeTime > 30000) {
        lastGeocodeTime = now;
        const name = await fetchReverseGeocodeName(
          position.coords.latitude,
          position.coords.longitude
        );
        if (name) {
          cachedPlaceName = `📍 ${name}`;
        }
      }
      const result = buildLocationResult(position, cachedPlaceName);
      onUpdate(result);
    },
    (error) => {
      let msg = 'Gagal memantau GPS perangkat.';
      if (error.code === error.PERMISSION_DENIED) {
        msg = 'Izin lokasi belum diaktifkan pada browser/HP.';
      }
      if (onError) onError(new Error(msg));
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    }
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}
