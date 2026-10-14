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

// Destinasi & Titik Antar-Jemput Lengkap Wilayah Arjawinangun & Jungjang
export const MOCK_LOCATIONS: LocationItem[] = [
  { id: 'loc-1', name: 'Blok Makmur', detail: 'Pemukiman Warga Arjawinangun', tag: 'Pemukiman', latitude: -6.6450, longitude: 108.4120 },
  { id: 'loc-2', name: 'Pasar Jungjang Arjawinangun', detail: 'Sentra Sayur & Pangan Tradisional Jungjang', tag: 'Pasar', latitude: -6.6432, longitude: 108.4168 },
  { id: 'loc-3', name: 'Stasiun KA Arjawinangun', detail: 'Jl. Stasiun KA Arjawinangun (Pintu Masuk Utama)', tag: 'Transportasi', latitude: -6.6498, longitude: 108.4095 },
  { id: 'loc-4', name: 'RSUD Arjawinangun', detail: 'Jl. Bypass Arjawinangun (Lobi Utama & Rawat Inap)', tag: 'Kesehatan', latitude: -6.6520, longitude: 108.4230 },
  { id: 'loc-5', name: 'Kantor Balai Desa Jungjang', detail: 'Pusat Pelayanan Warga Desa Jungjang', tag: 'Pemerintahan', latitude: -6.6425, longitude: 108.4182 },
  { id: 'loc-6', name: 'Kantor Balai Desa Arjawinangun', detail: 'Jl. Ki Bagus Rangin No. 12', tag: 'Pemerintahan', latitude: -6.6468, longitude: 108.4145 },
  { id: 'loc-7', name: 'Alun-Alun / Lapangan Jungjang', detail: 'Ruang Publik & Olahraga Warga Jungjang', tag: 'Fasilitas Umum', latitude: -6.6418, longitude: 108.4175 },
  { id: 'loc-8', name: 'Masjid Jami Al-Hidayah Jungjang', detail: 'Pusat Ibadah & Pengajian Akbar Jungjang', tag: 'Ibadah', latitude: -6.6428, longitude: 108.4162 },
  { id: 'loc-9', name: 'Masjid Besar Arjawinangun', detail: 'Jl. Raya Kantor Pos Arjawinangun', tag: 'Ibadah', latitude: -6.6475, longitude: 108.4132 },
  { id: 'loc-10', name: 'SMP Negeri 1 Arjawinangun', detail: 'Kawasan Pendidikan Jungjang', tag: 'Pendidikan', latitude: -6.6440, longitude: 108.4190 },
  { id: 'loc-11', name: 'SMA Negeri 1 Arjawinangun', detail: 'Jl. Bypass Arjawinangun (Gerbang Depan)', tag: 'Pendidikan', latitude: -6.6535, longitude: 108.4215 },
  { id: 'loc-12', name: 'SMK Negeri 1 Arjawinangun', detail: 'Kompleks Kejuruan Teknik & Bisnis', tag: 'Pendidikan', latitude: -6.6550, longitude: 108.4245 },
  { id: 'loc-13', name: 'Puskesmas Arjawinangun', detail: 'Layanan Kesehatan Primer & Rawat Inap', tag: 'Kesehatan', latitude: -6.6482, longitude: 108.4150 },
  { id: 'loc-14', name: 'Polsek Arjawinangun', detail: 'Jl. Raya Bypass Cirebon-Jakarta', tag: 'Keamanan', latitude: -6.6505, longitude: 108.4205 },
  { id: 'loc-15', name: 'Koramil 2019 Arjawinangun', detail: 'Jl. Ki Bagus Rangin', tag: 'Keamanan', latitude: -6.6460, longitude: 108.4138 },
  { id: 'loc-16', name: 'Pasar Sandang Tegalgubug', detail: 'Pasar Grosir Sandang Pantura Arjawinangun', tag: 'Pusat Grosir', latitude: -6.6310, longitude: 108.3980 },
  { id: 'loc-17', name: 'Ponpes Darut Tauhid Arjawinangun', detail: 'Kompleks Pondok Pesantren & Asrama Santri', tag: 'Pendidikan', latitude: -6.6462, longitude: 108.4085 },
  { id: 'loc-18', name: 'Blok Kliwon Jungjang', detail: 'Kawasan Pemukiman Warga Jungjang', tag: 'Dusun', latitude: -6.6410, longitude: 108.4155 },
  { id: 'loc-19', name: 'Blok Wage Jungjang', detail: 'Sentra UMKM & Warga Dusun Wage', tag: 'Dusun', latitude: -6.6402, longitude: 108.4188 },
  { id: 'loc-20', name: 'Blok Manis Jungjang', detail: 'Perkampungan Warga & Jalur Pertanian', tag: 'Dusun', latitude: -6.6435, longitude: 108.4205 },
  { id: 'loc-21', name: 'Blok Pahing Jungjang', detail: 'Wilayah Warga & Sentra Pengrajin', tag: 'Dusun', latitude: -6.6448, longitude: 108.4220 },
  { id: 'loc-22', name: 'Blok Puhun Jungjang', detail: 'Kawasan Perumahan Warga Jungjang Timur', tag: 'Dusun', latitude: -6.6395, longitude: 108.4230 },
  { id: 'loc-23', name: 'Blok Karanganyar Jungjang', detail: 'RT 01 s/d RT 04 Kawasan Pemukiman Jungjang', tag: 'Dusun', latitude: -6.6415, longitude: 108.4245 },
  { id: 'loc-24', name: 'Blok Gudang Kereta Api Jungjang', detail: 'Kawasan Stasiun Lama & Pemukiman Jungjang', tag: 'Dusun', latitude: -6.6480, longitude: 108.4105 },
  { id: 'loc-25', name: 'Karangmulya (Blok Manis)', detail: 'Dusun Karangmulya Arjawinangun', tag: 'Dusun', latitude: -6.6380, longitude: 108.4110 },
  { id: 'loc-26', name: 'Kebonturi Arjawinangun', detail: 'Wilayah Pertanian & Pemukiman Warga', tag: 'Dusun', latitude: -6.6510, longitude: 108.4020 },
  { id: 'loc-27', name: 'Perumahan Arjawinangun Indah', detail: 'Kompleks Hunian Blok C & D', tag: 'Pemukiman', latitude: -6.6530, longitude: 108.4160 },
  { id: 'loc-28', name: 'Perumahan Griya Jungjang Asri', detail: 'Kompleks Perumahan Warga Jungjang Baru', tag: 'Pemukiman', latitude: -6.6385, longitude: 108.4210 },
  { id: 'loc-29', name: 'Pangkalan Becak Pintu Pasar Jungjang', detail: 'Pangkalan Siaga Becak Onthel Subuh & Pagi', tag: 'Transportasi', latitude: -6.6430, longitude: 108.4172 },
  { id: 'loc-30', name: 'Pangkalan Ojek Stasiun KA Arjawinangun', detail: 'Depan Pintu Keluar Penumpang Kereta Api', tag: 'Transportasi', latitude: -6.6495, longitude: 108.4092 },
  { id: 'loc-31', name: 'Pangkalan Becak Pertigaan Rawagatel', detail: 'Pangkalan Becak Siaga Jalur Utama Arjawinangun', tag: 'Transportasi', latitude: -6.6472, longitude: 108.4192 },
  { id: 'loc-32', name: 'Pertigaan Lampu Merah Arjawinangun', detail: 'Jalur Masuk Kota & Pusat Lalu Lintas', tag: 'Transportasi', latitude: -6.6480, longitude: 108.4185 },
  { id: 'loc-33', name: 'Pasar Jungjang Pintu Timur (Los Sayur)', detail: 'Akses Langsung Kios Sayur-Mayur & Bumbu Dapur', tag: 'Pasar', latitude: -6.6434, longitude: 108.4170 },
  { id: 'loc-34', name: 'Pasar Jungjang Pintu Barat (Los Ikan & Daging)', detail: 'Akses Kios Daging Sapi, Ayam Segar & Ikan Laut', tag: 'Pasar', latitude: -6.6431, longitude: 108.4165 },
  { id: 'loc-35', name: 'Pasar Hewan Arjawinangun', detail: 'Pusat Ternak & Perdagangan Tradisional', tag: 'Pasar', latitude: -6.6515, longitude: 108.4180 },
  { id: 'loc-36', name: 'RSUD Arjawinangun - IGD & UGD', detail: 'Instalasi Gawat Darurat & Apotek 24 Jam', tag: 'Kesehatan', latitude: -6.6522, longitude: 108.4235 },
  { id: 'loc-37', name: 'RSUD Arjawinangun - Poliklinik Rawat Jalan', detail: 'Layanan Dokter Spesialis & Poliklinik', tag: 'Kesehatan', latitude: -6.6518, longitude: 108.4228 },
  { id: 'loc-38', name: 'Puskesmas Pembantu Jungjang', detail: 'Puskesmas Pembantu Warga Desa Jungjang', tag: 'Kesehatan', latitude: -6.6420, longitude: 108.4195 },
  { id: 'loc-39', name: 'Sentra Kuliner Empal Gentong Jungjang', detail: 'Jl. Raya Jungjang (Pusat Kuliner Khas)', tag: 'Kuliner', latitude: -6.6445, longitude: 108.4178 },
  { id: 'loc-40', name: 'Sentra Docang & Tahu Gejrot Arjawinangun', detail: 'Pusat Jajanan Malam & Kuliner Tradisional', tag: 'Kuliner', latitude: -6.6465, longitude: 108.4152 },
  { id: 'loc-41', name: 'SPBU Bypass Arjawinangun', detail: 'Pom Bensin 24 Jam Jalur Pantura', tag: 'Fasilitas Umum', latitude: -6.6540, longitude: 108.4195 },
  { id: 'loc-42', name: 'SPBU Jungjang', detail: 'Pom Bensin Jl. Raya Jungjang - Tegalgubug', tag: 'Fasilitas Umum', latitude: -6.6375, longitude: 108.4150 },
  { id: 'loc-43', name: 'Kantor Pos Arjawinangun', detail: 'Layanan Ekspedisi & Pos Indonesia Arjawinangun', tag: 'Fasilitas Umum', latitude: -6.6478, longitude: 108.4140 },
  { id: 'loc-44', name: 'Bank BRI Unit Arjawinangun & ATM Center', detail: 'Pusat Transaksi & Penarikan Tunai BRI', tag: 'Keuangan', latitude: -6.6470, longitude: 108.4158 },
  { id: 'loc-45', name: 'Bank BJB KCP Arjawinangun', detail: 'Bank Jabar Banten Arjawinangun', tag: 'Keuangan', latitude: -6.6485, longitude: 108.4165 },
  { id: 'loc-46', name: 'Kantor Kecamatan Arjawinangun', detail: 'Kantor Pelayanan Administrasi Kecamatan', tag: 'Pemerintahan', latitude: -6.6472, longitude: 108.4142 },
  { id: 'loc-47', name: 'Kantor Urusan Agama (KUA) Arjawinangun', detail: 'Jl. Raya Kantor Pos Arjawinangun', tag: 'Pemerintahan', latitude: -6.6480, longitude: 108.4136 },
  { id: 'loc-48', name: 'SMP Negeri 2 Arjawinangun', detail: 'Jl. Ki Bagus Rangin Timur', tag: 'Pendidikan', latitude: -6.6455, longitude: 108.4250 },
  { id: 'loc-49', name: 'MTs Negeri 1 Cirebon (Arjawinangun)', detail: 'Madrasah Tsanawiyah Negeri Arjawinangun', tag: 'Pendidikan', latitude: -6.6438, longitude: 108.4115 },
  { id: 'loc-50', name: 'Lapangan Sepak Bola Lemahabang Jungjang', detail: 'Lapangan Olahraga & Pertandingan Warga', tag: 'Fasilitas Umum', latitude: -6.6398, longitude: 108.4165 },
  { id: 'loc-51', name: 'GOR Bulutangkis Jungjang', detail: 'Gedung Olahraga Bulutangkis Warga Desa', tag: 'Fasilitas Umum', latitude: -6.6412, longitude: 108.4192 },
  { id: 'loc-52', name: 'Jembatan Kali Winong Jungjang', detail: 'Batas Aliran Sungai & Jalur Lintas Jungjang', tag: 'Fasilitas Umum', latitude: -6.6442, longitude: 108.4218 },
];

// Opsi Armada Transportasi Desa
export const VEHICLE_OPTIONS: DriverVehicle[] = [
  {
    id: 'becak_onthel',
    title: 'Becak Onthel Tradisional',
    desc: 'Nyaman, muat banyak belanjaan pasar, santai & ramah lingkungan',
    capacity: '2 Orang + Belanjaan besar',
    priceEstimate: 10000,
    baseFare: 7000,
    perKmRate: 3000,
    eta: '5-8 mnt jemput',
    icon: '🚲',
  },
  {
    id: 'ojek',
    title: 'Ojek Motor Cepat',
    desc: 'Gesit lewat gang desa, cepat sampai tujuan antar blok',
    capacity: '1 Orang (Helm SNI)',
    priceEstimate: 8000,
    baseFare: 5000,
    perKmRate: 2500,
    eta: '3-5 mnt jemput',
    icon: '🛵',
  },
  {
    id: 'becak_motor',
    title: 'Becak Motor (Bentor)',
    desc: 'Kombinasi cepat & muat barang karungan / belanjaan pasar',
    capacity: '2-3 Orang + Barang',
    priceEstimate: 14000,
    baseFare: 10000,
    perKmRate: 3500,
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
    q: 'Bagaimana cara memesan Ojek & Becak Lokal?',
    a: 'Pilih menu "Ojek & Becak" di beranda. Pilih titik jemput (misalnya Blok Makmur) dan tujuan Anda. Pilih armada (Becak Onthel Rp 10.000 atau Ojek Motor Rp 8.000). Setelah konfirmasi, sistem akan menghubungkan Anda dengan partner siaga terdekat.',
  },
  {
    q: 'Bagaimana cara Belanja Pasar Tradisional offline dengan mudah?',
    a: 'Buka menu "Belanja Offline", lihat lapak pedagang Pasar Jungjang (sayur, sembako, kuliner). Anda dapat langsung menghubungi pedagang atau memesan kurir antar jemput.',
  },
  {
    q: 'Bagaimana cara membayar? Apakah harus menggunakan ponsel terus?',
    a: 'Anda dapat memilih bayar Tunai (Cash) langsung saat pengemudi atau barang tiba, atau menggunakan Dompet Digital QRIS dengan memindai QRIS bank/e-wallet apa saja.',
  },
  {
    q: 'Bagaimana cara mendaftar menjadi Partner (Tukang, Becak, Ojek) atau Lapak (Pedagang Pasar)?',
    a: 'Di halaman masuk, klik tab "Daftar Baru" lalu pilih peran "Partner" atau "Lapak". Akun Anda akan diverifikasi oleh petugas balai desa.',
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
    emailOrPhone: '081298765432',
    location: 'Pangkalan Siaga Desa',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    description: 'Mitra transportasi ojek & becak terdaftar desa Arjawinangun.',
    verifiedBadge: 'Mitra Resmi',
    joinedDate: '2026',
    nik: '3209141203850003',
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
    emailOrPhone: '081311223344',
    location: 'Pasar Jungjang Arjawinangun',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    description: 'Pedagang pasar tradisional Arjawinangun.',
    verifiedBadge: 'Pedagang Resmi',
    joinedDate: '2026',
    nik: '3209142007880004',
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
    emailOrPhone: '081234567890',
    location: 'Blok Makmur, Arjawinangun',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    description: 'Warga masyarakat desa Arjawinangun untuk mengakses seluruh layanan.',
    verifiedBadge: 'Warga Terdaftar',
    joinedDate: '2026',
    nik: '3209141005950005',
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
