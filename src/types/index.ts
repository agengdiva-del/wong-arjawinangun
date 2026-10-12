export type AppRole = 'super_admin' | 'admin' | 'mitra' | 'merchant' | 'pelanggan';

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
  | 'polling'
  | 'mitra_dashboard'
  | 'merchant_dashboard'
  | 'admin_dashboard'
  | 'super_admin_dashboard'
  | 'admin_portal_login'
  | 'qris_donasi'
  | 'tani_ikan'
  | 'hall_of_fame';

export interface UserAccount {
  id: string;
  name: string;
  role: AppRole;
  roleTitle: string;
  emailOrPhone: string;
  location: string;
  avatar: string;
  status: 'aktif' | 'verifikasi' | 'ditangguhkan';
  description: string;
  verifiedBadge?: string;
  joinedDate: string;
  nik?: string;
  rtRw?: string;
  integrityRating: number; // e.g. 4.95
  serviceRating: number;   // e.g. 4.90
  totalReviewsCount: number;
  reputationBadge: string;
}

export interface PollOption {
  id: string;
  text: string;
  votesCount: number;
}

export interface VillagePoll {
  id: string;
  title: string;
  description: string;
  category: 'Infrastruktur' | 'Kegiatan Desa' | 'Pasar & UMKM' | 'Keamanan & Kebersihan';
  createdBy: string;
  authorRole: 'Super Admin (Kuwu)' | 'Admin Operasional';
  createdAt: string;
  endDate: string;
  options: PollOption[];
  totalVotes: number;
  status: 'Aktif' | 'Ditutup';
  userVotedOptionId?: string;
  userSelectedOptionId?: string;
  hasVoted?: boolean;
}

export interface UserReview {
  id: string;
  reviewerName: string;
  reviewerRole: string;
  integrityScore: number;
  serviceScore: number;
  comment: string;
  date: string;
}

export interface VerificationRequest {
  id: string;
  name: string;
  type: 'mitra' | 'merchant';
  category: string;
  phone: string;
  location: string;
  documentType: string;
  submittedAt: string;
  status: 'pending' | 'disetujui' | 'ditolak';
  notes?: string;
}

export interface SupportTicket {
  id: string;
  reporterName: string;
  reporterRole: string;
  issue: string;
  category: 'Armada' | 'Kios Pasar' | 'Aplikasi' | 'Titik Jemput';
  timestamp: string;
  status: 'Terbuka' | 'Diproses' | 'Selesai';
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
}

export interface SystemAuditLog {
  id: string;
  actor: string;
  action: string;
  detail: string;
  timestamp: string;
  level: 'info' | 'warning' | 'security';
}

export interface BroadcastMessage {
  id: string;
  sender: string;
  title: string;
  content: string;
  category: 'Darurat' | 'Info Resmi' | 'Gotong Royong';
  sentAt: string;
  target: string;
}

export interface MerchantOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: 'Menunggu' | 'Disiapkan' | 'Siap Diambil Kurir' | 'Selesai';
  orderTime: string;
  courierType: 'Becak Onthel' | 'Ojek Cepat' | 'Ambil Mandiri';
}

export interface LocationItem {
  id: string;
  name: string;
  detail: string;
  tag: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  isRealtimeGps?: boolean;
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
  baseFare?: number;
  perKmRate?: number;
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

export interface VendorReview {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
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
  reviews?: VendorReview[];
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

export interface JobVacancy {
  id: string;
  title: string;
  employer: string;
  category: 'Toko & Ritel' | 'Bengkel & Otomotif' | 'UMKM & Kuliner' | 'Konveksi' | 'Driver & Kurir' | 'Bangunan & Lapangan' | 'Lainnya';
  jobType: 'Penuh Waktu' | 'Paruh Waktu' | 'Harian' | 'Borongan';
  salary: string;
  location: string;
  description: string;
  requirements: string[];
  contactPhone: string;
  contactPerson: string;
  postedDate: string;
  isOpen: boolean;
}

export interface DonationCampaign {
  id: string;
  title: string;
  category: 'Masjid & Keagamaan' | 'Sosial & Yatim' | 'Kesehatan & Siaga' | 'Infrastruktur Desa';
  targetAmount: number;
  collectedAmount: number;
  donorsCount: number;
  description: string;
  organizer: string;
  image: string;
  endDate: string;
  qrisCodeUrl?: string;
}

export interface DonationRecord {
  id: string;
  campaignId: string;
  campaignTitle: string;
  donorName: string;
  amount: number;
  prayer?: string;
  timestamp: string;
  paymentMethod: 'QRIS Realtime' | 'Transfer Bank' | 'Tunai Pos Desa';
}

export interface TaniIkanProduct {
  id: string;
  name: string;
  category: 'Gabah & Beras' | 'Pupuk & Obat' | 'Bibit Ikan & Pakan' | 'Benih Tanaman' | 'Alat Tani';
  price: number;
  unit: string;
  image: string;
  description?: string;
  inStock: boolean;
}

export interface TaniIkanVendor {
  id: string;
  name: string;
  type: 'pertanian' | 'perikanan' | 'pupuk_sarana';
  location: string;
  ownerName: string;
  rating: number;
  phone: string;
  openHours: string;
  image: string;
  description: string;
  products: TaniIkanProduct[];
  reviews: VendorReview[];
}

export type HallOfFameCategory = 
  | 'Tokoh Masyarakat'
  | 'Pemuda Inspiratif'
  | 'Pelajar Berprestasi'
  | 'Atlet Daerah'
  | 'Pengusaha Muda'
  | 'Relawan Sosial';

export interface HallOfFameComment {
  id: string;
  author: string;
  role: string;
  text: string;
  date: string;
}

export interface HallOfFameItem {
  id: string;
  name: string;
  category: HallOfFameCategory;
  title: string;
  origin: string;
  image: string;
  story: string;
  achievements: string[];
  year: string;
  appreciationsCount: number;
  hasAppreciated?: boolean;
  nominatedBy?: string;
  verifiedStatus: 'terverifikasi' | 'usulan_warga';
  comments: HallOfFameComment[];
}

export interface HallOfFameNomination {
  id: string;
  nomineeName: string;
  category: HallOfFameCategory;
  origin: string;
  title: string;
  achievements: string;
  reason: string;
  proposerName: string;
  proposerPhone: string;
  proposerRtRw: string;
  createdAt: string;
  status: 'Menunggu Verifikasi Tim Desa' | 'Disetujui' | 'Dipublikasikan' | 'Ditinjau';
  supportVotes: number;
  hasVoted?: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface AppNotification {
  id: string;
  userId?: string;
  type: 'hall_of_fame_approved' | 'hall_of_fame_published' | 'system' | 'poll' | 'general';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: 'Hall of Fame' | 'Info Desa' | 'Layanan';
  actionLink?: {
    screen: ScreenId;
    targetId?: string;
    label: string;
  };
  meta?: {
    nomineeName?: string;
    category?: string;
    adminName?: string;
    status?: string;
  };
}


