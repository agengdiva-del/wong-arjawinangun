export type AppRole = 'pelanggan' | 'mitra';

export type ScreenId = 
  | 'welcome' 
  | 'dashboard' 
  | 'ojek_becak' 
  | 'belanja_offline' 
  | 'jasa_lokal' 
  | 'kuliner' 
  | 'info_desa' 
  | 'loker' 
  | 'profil' 
  | 'komunitas' 
  | 'pesanan_aktif'
  | 'mitra_dashboard';

export interface LocationItem {
  id: string;
  name: string;
  detail: string;
  tag: string;
}

export interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  badge?: string;
  color: string;
  screenTarget?: ScreenId;
  isOptional?: boolean;
}

export interface DriverVehicle {
  id: 'ojek' | 'becak_onthel' | 'becak_motor';
  title: string;
  desc: string;
  capacity: string;
  priceEstimate: number;
  eta: string;
  icon: string;
}

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  plateOrNumber: string;
  rating: number;
  completedTrips: number;
  avatar: string;
  locationNear: string;
  isVerified: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'driver' | 'vendor';
  text: string;
  time: string;
}

export interface MarketVendor {
  id: string;
  name: string;
  category: 'sayur' | 'sembako' | 'daging' | 'kuliner';
  stallLocation: string; // e.g. "Kios Blok A No. 12, Pasar Jungjang"
  rating: number;
  distance: string;
  image: string;
  isVerified: boolean;
  phone: string;
  openTime: string;
  products: ProductItem[];
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  inStock: boolean;
}

export interface CartItem {
  product: ProductItem;
  vendorId: string;
  vendorName: string;
  quantity: number;
}

export interface LocalServiceWorker {
  id: string;
  name: string;
  trade: string; // Tukang Listrik, Tukang Bangunan, Servis Pompa
  rating: number;
  distance: string;
  jobsCompleted: number;
  startingPrice: number;
  priceUnit: string;
  phone: string;
  area: string;
  avatar: string;
  specialties: string[];
}

export interface ForumPost {
  id: string;
  author: string;
  block: string;
  role: string;
  timestamp: string;
  category: 'Diskusi' | 'Laporan' | 'Info Gotong Royong' | 'Pemberitahuan';
  content: string;
  likes: number;
  commentsCount: number;
  comments: { author: string; text: string; time: string }[];
  isLiked?: boolean;
}

export interface VillageContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  whatsapp: string;
  category: 'Desa' | 'Keamanan' | 'Kesehatan' | 'Darurat';
  hours: string;
}

export interface OrderRecord {
  id: string;
  type: 'ojek' | 'becak' | 'belanja' | 'jasa';
  title: string;
  subtitle: string;
  date: string;
  total: number;
  status: 'Selesai' | 'Sedang Berjalan' | 'Dibatalkan';
  paymentMethod: string;
}
