import {
  LocationItem,
  DriverVehicle,
  DriverInfo,
  MarketVendor,
  LocalServiceWorker,
  ForumPost,
  VillageContact,
  OrderRecord,
  UserAccount,
  VerificationRequest,
  SupportTicket,
  SystemAuditLog,
  BroadcastMessage,
  MerchantOrder,
  VillagePoll,
  UserReview,
  JobVacancy,
  DonationCampaign,
  DonationRecord,
  TaniIkanVendor,
  HallOfFameItem,
  HallOfFameNomination,
  AppNotification
} from '../types';

export const APP_IMAGES = {
  promoPasar: '/src/assets/images/promo_pasar_arjawinangun_1791334818648.jpg',
  kulinerCirebon: '/src/assets/images/kuliner_khas_cirebon_1791334837478.jpg',
  becakLokal: '/src/assets/images/becak_arjawinangun_1791334847617.jpg',
};

// 8 Wilayah Blok / Dusun Resmi Arjawinangun
export const MOCK_LOCATIONS: LocationItem[] = [
  { id: 'loc-1', name: 'Blok Makmur', detail: 'Arjawinangun, Cirebon', tag: 'Rumah' },
  { id: 'loc-2', name: 'Pasar Jungjang Arjawinangun', detail: 'Jl. Pasar Jungjang', tag: 'Pasar' },
  { id: 'loc-3', name: 'Stasiun Arjawinangun', detail: 'Jl. Stasiun KA', tag: 'Transportasi' },
  { id: 'loc-4', name: 'RSUD Arjawinangun', detail: 'Jl. Bypass Arjawinangun', tag: 'Kesehatan' },
  { id: 'loc-5', name: 'Kantor Balai Desa Arjawinangun', detail: 'Jl. Ki Bagus Rangin', tag: 'Pemerintahan' },
  { id: 'loc-6', name: 'Karangmulya', detail: 'Dusun Karangmulya, Blok Manis', tag: 'Dusun' },
  { id: 'loc-7', name: 'Kebonturi', detail: 'Kecamatan Arjawinangun', tag: 'Desa Tetangga' },
  { id: 'loc-8', name: 'Pasar Sandang Tegalgubug', detail: 'Jalur Pantura Arjawinangun', tag: 'Pusat Grosir' },
];

// Opsi Armada Transportasi Desa
export const VEHICLE_OPTIONS: DriverVehicle[] = [
  {
    id: 'becak_onthel',
    title: 'Becak Onthel Tradisional',
    desc: 'Adem, muat banyak belanjaan pasar, santai & ramah lingkungan',
    capacity: '2 Orang + Belanjaan besar',
    priceEstimate: 10000,
    eta: '5-8 mnt jemput',
    icon: '🚲',
  },
  {
    id: 'ojek',
    title: 'Ojek Motor Cepat',
    desc: 'Gesit lewat gang desa, cepat sampai tujuan antar blok',
    capacity: '1 Orang (Helm SNI)',
    priceEstimate: 8000,
    eta: '3-5 mnt jemput',
    icon: '🛵',
  },
  {
    id: 'becak_motor',
    title: 'Becak Motor (Bentor)',
    desc: 'Kombinasi cepat & muat barang karungan / belanjaan pasar',
    capacity: '2-3 Orang + Barang',
    priceEstimate: 14000,
    eta: '6-9 mnt jemput',
    icon: '🛺',
  },
];

// Kontak Layanan & Darurat Resmi Balai Desa Arjawinangun
export const VILLAGE_CONTACTS: VillageContact[] = [
  {
    id: 'c-1',
    name: 'Pelayanan Kantor Balai Desa Arjawinangun',
    role: 'Administrasi Kependudukan, KTP, KK, & Surat Pengantar',
    phone: '0231-357890',
    whatsapp: '0812-3456-7788',
    category: 'Desa',
    hours: 'Senin - Jumat (08.00 - 15.00 WIB)',
  },
  {
    id: 'c-2',
    name: 'Bhabinkamtibmas Polsek Arjawinangun',
    role: 'Bimbingan Keamanan & Ketertiban Desa',
    phone: '0813-2211-4455',
    whatsapp: '0813-2211-4455',
    category: 'Keamanan',
    hours: 'Siaga 24 Jam',
  },
  {
    id: 'c-3',
    name: 'Puskesmas DTP Arjawinangun',
    role: 'Instalasi Gawat Darurat (IGD) & Ambulans Desa',
    phone: '0231-358118',
    whatsapp: '0852-1122-3300',
    category: 'Kesehatan',
    hours: '24 Jam Non-Stop',
  },
  {
    id: 'c-4',
    name: 'Babinsa Koramil 2019 Arjawinangun',
    role: 'Pengamanan Teritorial Wilayah',
    phone: '0877-6655-4433',
    whatsapp: '0877-6655-4433',
    category: 'Darurat',
    hours: 'Siaga 24 Jam',
  },
];

// Panduan & Bantuan Aplikasi (FAQ)
export const FAQS = [
  {
    q: 'Kepripun carane pesen Ojek & Becak Lokal?',
    a: 'Pilih menu "Ojek & Becak" ing beranda. Ketik titik jemput (misal Blok Makmur) lan tujuan sampeyan. Pilih armada (Becak Onthel Rp 10.000 utawa Ojek Motor Rp 8.000). Sawise konfirmasi, sistem bakal nyambungake mitra siaga terdekat.',
  },
  {
    q: 'Kepripun carane Belanja Pasar Tradisional offline tanpa ribet?',
    a: 'Buka menu "Belanja Offline", deleng kios pedagang pasar jungjang (sayur, sembako, kuliner). Sampeyan bisa langsung hubungi pedagang utawa pesen kurir antar jemput.',
  },
  {
    q: 'Kepripun carane bayar? Apa kudu nganggo HP terus?',
    a: 'Sampeyan bisa milih bayar Tunai (Cash) langsung nalika driver utawa barang wis teka, utawa nganggo Dompet Digital QRIS kanthi scan QRIS bank/e-wallet apa wae.',
  },
  {
    q: 'Kepripun carane ndaftar dadi Mitra (Tukang, Becak, Ojek, Pedagang Pasar)?',
    a: 'Ing kaca ngarep, klik tombol "Daftar Baru" banjur pilih peran "Mitra" utawa "Merchant". Akun sampeyan bakal diverifikasi dening petugas balai desa.',
  },
];

// Baseline Akun Pengguna Siap Pakai (Tanpa Akun Demo)
export const MOCK_USERS: Record<string, UserAccount> = {
  super_admin: {
    id: 'usr-super-admin',
    name: 'Pemerintah Desa Arjawinangun',
    role: 'super_admin',
    roleTitle: 'Kuwu / Kepala Desa',
    emailOrPhone: 'kuwu@arjawinangun.desa.id',
    location: 'Kantor Balai Desa Arjawinangun',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    description: 'Pemerintah Desa Arjawinangun, Kecamatan Arjawinangun, Kabupaten Cirebon.',
    verifiedBadge: 'Pemerintah Resmi Desa',
    joinedDate: '2026',
    nik: '3209140101700001',
    rtRw: 'Balai Desa Arjawinangun',
    integrityRating: 5.0,
    serviceRating: 5.0,
    totalReviewsCount: 0,
    reputationBadge: 'Pemerintah Desa',
  },
  admin: {
    id: 'usr-admin',
    name: 'Petugas Balai Desa',
    role: 'admin',
    roleTitle: 'Admin Operasional Desa',
    emailOrPhone: 'admin@arjawinangun.desa.id',
    location: 'Posko Balai Desa Arjawinangun',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    description: 'Petugas operasional dan layanan administrasi balai desa Arjawinangun.',
    verifiedBadge: 'Petugas Balai Desa',
    joinedDate: '2026',
    nik: '3209141508920002',
    rtRw: 'Posko Balai Desa',
    integrityRating: 5.0,
    serviceRating: 5.0,
    totalReviewsCount: 0,
    reputationBadge: 'Aparatur Desa',
  },
  mitra: {
    id: 'usr-mitra',
    name: 'Mitra Transportasi Desa',
    role: 'mitra',
    roleTitle: 'Mitra Armada Warga',
    emailOrPhone: '',
    location: 'Pangkalan Siaga Desa',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    description: 'Mitra transportasi ojek & becak terdaftar desa Arjawinangun.',
    verifiedBadge: 'Mitra Resmi',
    joinedDate: '2026',
    nik: '',
    rtRw: 'Arjawinangun',
    integrityRating: 5.0,
    serviceRating: 5.0,
    totalReviewsCount: 0,
    reputationBadge: 'Mitra Terpercaya',
  },
  merchant: {
    id: 'usr-merchant',
    name: 'Pedagang Pasar Jungjang',
    role: 'merchant',
    roleTitle: 'Pedagang Pasar Tradisional',
    emailOrPhone: '',
    location: 'Pasar Jungjang Arjawinangun',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    description: 'Pedagang pasar tradisional Arjawinangun.',
    verifiedBadge: 'Pedagang Resmi',
    joinedDate: '2026',
    nik: '',
    rtRw: 'Pasar Jungjang',
    integrityRating: 5.0,
    serviceRating: 5.0,
    totalReviewsCount: 0,
    reputationBadge: 'Pedagang Terpercaya',
  },
  pelanggan: {
    id: 'usr-pelanggan',
    name: 'Warga Arjawinangun',
    role: 'pelanggan',
    roleTitle: 'Warga Terverifikasi',
    emailOrPhone: '',
    location: 'Blok Makmur, Arjawinangun',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    description: 'Warga masyarakat desa Arjawinangun untuk mengakses seluruh layanan.',
    verifiedBadge: 'Warga Terdaftar',
    joinedDate: '2026',
    nik: '',
    rtRw: 'RT 01 / RW 01',
    integrityRating: 5.0,
    serviceRating: 5.0,
    totalReviewsCount: 0,
    reputationBadge: 'Warga Arjawinangun',
  },
};

// =============================================================
// DATA APLIKASI BERSIH & SIAP PAKAI (CLEAN BASELINE DATA)
// Semua data transaksional dan dummy dikosongkan agar siap pakai
// =============================================================

export const MOCK_ORDERS: OrderRecord[] = [];
export const MOCK_VERIFICATIONS: VerificationRequest[] = [];
export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [];
export const MOCK_AUDIT_LOGS: SystemAuditLog[] = [];
export const MOCK_BROADCASTS: BroadcastMessage[] = [];
export const MOCK_MERCHANT_ORDERS: MerchantOrder[] = [];
export const MOCK_VILLAGE_POLLS: VillagePoll[] = [];
export const MOCK_USER_REVIEWS: Record<string, UserReview[]> = {};

// Program Infaq & Kas Sosial Gotong Royong (Program Resmi Desa Siap Terima Donasi)
export const MOCK_DONATION_CAMPAIGNS: DonationCampaign[] = [
  {
    id: 'cmp-kas-desa',
    title: 'Infaq & Kas Sosial Gotong Royong Warga Arjawinangun',
    category: 'Sosial & Yatim',
    targetAmount: 10000000,
    collectedAmount: 0,
    donorsCount: 0,
    description: 'Infaq dan kas sosial resmi desa untuk santunan anak yatim, bantuan lansia dhuafa, dan dana siaga darurat kesehatan warga Arjawinangun.',
    organizer: 'Pemerintah Desa Arjawinangun',
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=500&auto=format&fit=crop&q=80',
    endDate: 'Sepanjang Masa',
    qrisCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021226680016ID.GO.BANKINDONESIA.QRIS0118936009180000000000520458125802ID5924KAS+DESA+ARJAWINANGUN6008CIREBON62070703A016304',
  },
];

export const MOCK_DONATION_RECORDS: DonationRecord[] = [];
export const MOCK_JOB_VACANCIES: JobVacancy[] = [];
export const MOCK_TANI_IKAN_VENDORS: TaniIkanVendor[] = [];
export const MOCK_HALL_OF_FAME: HallOfFameItem[] = [];
export const MOCK_HALL_OF_FAME_NOMINATIONS: HallOfFameNomination[] = [];
export const MOCK_NOTIFICATIONS: AppNotification[] = [];
export const FORUM_POSTS: ForumPost[] = [];
export const MARKET_VENDORS: MarketVendor[] = [];
export const LOCAL_SERVICES: LocalServiceWorker[] = [];
export const MOCK_DRIVERS: Record<string, DriverInfo> = {};
