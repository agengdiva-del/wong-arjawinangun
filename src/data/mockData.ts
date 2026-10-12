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
  VendorReview,
  JobVacancy,
  DonationCampaign,
  DonationRecord,
  TaniIkanVendor,
  HallOfFameItem,
  HallOfFameNomination,
  HallOfFameCategory
} from '../types';

export const APP_IMAGES = {
  promoPasar: '/src/assets/images/promo_pasar_arjawinangun_1791334818648.jpg',
  kulinerCirebon: '/src/assets/images/kuliner_khas_cirebon_1791334837478.jpg',
  becakLokal: '/src/assets/images/becak_arjawinangun_1791334847617.jpg',
};

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

export const MOCK_DRIVERS: Record<string, DriverInfo> = {
  becak_onthel: {
    id: 'drv-1',
    name: 'Mang Duloh',
    phone: '0812-3456-7890',
    vehicleType: 'Becak Onthel No. 14',
    plateOrNumber: 'BCK-ARJ-014',
    rating: 4.9,
    completedTrips: 428,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    locationNear: 'Pangkalan Pos Blok Makmur (150m)',
    isVerified: true,
  },
  ojek: {
    id: 'drv-2',
    name: 'Kang Imron',
    phone: '0813-8899-1234',
    vehicleType: 'Honda Supra X 125 Hitam',
    plateOrNumber: 'E 4821 YW',
    rating: 4.8,
    completedTrips: 612,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    locationNear: 'Depan Alfamart Stasiun (200m)',
    isVerified: true,
  },
  becak_motor: {
    id: 'drv-3',
    name: 'Mang Rasiman',
    phone: '0857-1122-3344',
    vehicleType: 'Bentor Kencana Kuning',
    plateOrNumber: 'BTR-ARJ-008',
    rating: 4.9,
    completedTrips: 340,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    locationNear: 'Pertigaan Pasar Jungjang (300m)',
    isVerified: true,
  },
};

export const MARKET_VENDORS: MarketVendor[] = [
  {
    id: 'vnd-1',
    name: 'Kios Mbak Siti - Sayur & Bumbu Segar',
    category: 'sayur',
    stallLocation: 'Kios Blok A No. 12, Pasar Jungjang',
    rating: 4.9,
    distance: '250 m',
    image: APP_IMAGES.promoPasar,
    isVerified: true,
    phone: '0877-2233-4455',
    openTime: '05.00 - 14.00 WIB',
    products: [
      { id: 'p-1', name: 'Bawang Merah Losari', price: 15000, unit: '500 gram', image: '🧅', category: 'Bumbu', inStock: true },
      { id: 'p-2', name: 'Cabai Rawit Merah Segar', price: 12000, unit: '250 gram', image: '🌶️', category: 'Sayur', inStock: true },
      { id: 'p-3', name: 'Tomat Segar Petik', price: 8000, unit: '1 kg', image: '🍅', category: 'Sayur', inStock: true },
      { id: 'p-4', name: 'Kangkung Desa 2 Ikat', price: 5000, unit: '2 ikat', image: '🥬', category: 'Sayur', inStock: true },
    ],
    reviews: [
      { id: 'rv-1', reviewerName: 'Ibu Hj. Rokayah', rating: 5, comment: 'Bawangnya kering dan bagus, tidak susut. Timbangannya jujur sekali Mbak Siti.', date: 'Kemarin' },
      { id: 'rv-2', reviewerName: 'Pak RT Dedi', rating: 5, comment: 'Sayur selalu segar subuh-subuh. Kios langganan warga Blok Makmur.', date: '2 hari lalu' },
      { id: 'rv-3', reviewerName: 'Karsih S.', rating: 4, comment: 'Cabainya pedas mantap, harga pas di kantong pasar tradisional.', date: '4 hari lalu' }
    ]
  },
  {
    id: 'vnd-2',
    name: 'Toko Klontong Berkah H. Sanusi',
    category: 'sembako',
    stallLocation: 'Jl. Ki Bagus Rangin No. 4, Blok Makmur',
    rating: 4.8,
    distance: '180 m',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&auto=format&fit=crop&q=80',
    isVerified: true,
    phone: '0812-9876-5432',
    openTime: '06.00 - 21.00 WIB',
    products: [
      { id: 'p-5', name: 'Beras Pandan Wangi Lokal', price: 68000, unit: '5 kg', image: '🌾', category: 'Sembako', inStock: true },
      { id: 'p-6', name: 'Minyak Goreng Minyakita', price: 15500, unit: '1 Liter', image: '🛢️', category: 'Sembako', inStock: true },
      { id: 'p-7', name: 'Telur Ayam Negeri Segar', price: 28000, unit: '1 kg', image: '🥚', category: 'Sembako', inStock: true },
      { id: 'p-8', name: 'Gula Pasir Kristal Putih', price: 17000, unit: '1 kg', image: '🧂', category: 'Sembako', inStock: true },
    ],
    reviews: [
      { id: 'rv-4', reviewerName: 'Kang Imron', rating: 5, comment: 'Berasnya pulen wangi, cocok buat makan sekeluarga. Pelayanan H. Sanusi ramah.', date: 'Kemarin' },
      { id: 'rv-5', reviewerName: 'Mimin W.', rating: 5, comment: 'Telurnya tidak pernah ada yang busuk, selalu segar kiriman kandang.', date: '3 hari lalu' }
    ]
  },
  {
    id: 'vnd-3',
    name: 'Kios Daging Sapi & Kambing Kang Rasid',
    category: 'daging',
    stallLocation: 'Blok Jagal Los B, Pasar Jungjang',
    rating: 4.9,
    distance: '320 m',
    image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&auto=format&fit=crop&q=80',
    isVerified: true,
    phone: '0821-4455-6677',
    openTime: '04.30 - 11.30 WIB',
    products: [
      { id: 'p-9', name: 'Daging Sapi Segar Khas Empal', price: 65000, unit: '500 gram', image: '🥩', category: 'Daging', inStock: true },
      { id: 'p-10', name: 'Tulangan & Babat Sapi', price: 35000, unit: '500 gram', image: '🍖', category: 'Daging', inStock: true },
      { id: 'p-11', name: 'Ayam Potong Segar Bersih', price: 36000, unit: '1 Ekor (1 kg)', image: '🍗', category: 'Daging', inStock: true },
    ],
    reviews: [
      { id: 'rv-6', reviewerName: 'Yu Wasminah', rating: 5, comment: 'Dagingnya empuk dan bersih, langganan tetap warung empal gentong saya.', date: 'Hari ini' },
      { id: 'rv-7', reviewerName: 'Mang Dasuki', rating: 5, comment: 'Daging potong pagi hari masih hangat, kualitas super.', date: 'Kemarin' }
    ]
  },
  {
    id: 'vnd-4',
    name: 'Warung Kuliner Khas Cirebon Yu Wasminah',
    category: 'kuliner',
    stallLocation: 'Depan Stasiun Arjawinangun',
    rating: 4.9,
    distance: '400 m',
    image: APP_IMAGES.kulinerCirebon,
    isVerified: true,
    phone: '0852-3344-5566',
    openTime: '08.00 - 20.00 WIB',
    products: [
      { id: 'p-12', name: 'Empal Gentong Daging Komplit', price: 25000, unit: 'Porsi + Lontong', image: '🍲', category: 'Kuliner', inStock: true },
      { id: 'p-13', name: 'Nasi Lengko Khas Arjawinangun', price: 12000, unit: 'Porsi Komplit Bumbu Kacang', image: '🥗', category: 'Kuliner', inStock: true },
      { id: 'p-14', name: 'Tahu Gejrot Asli Bumbu Pedas', price: 10000, unit: 'Piring Tradisional', image: '🍢', category: 'Kuliner', inStock: true },
      { id: 'p-15', name: 'Es Campur Buah & Kelapa Muda', price: 8000, unit: 'Gelas Besar', image: '🍧', category: 'Kuliner', inStock: true },
    ],
    reviews: [
      { id: 'rv-8', reviewerName: 'Ahmad Fauzi', rating: 5, comment: 'Empal gentong paling juara di Arjawinangun! Kuah santannya gurih sedap berempah.', date: 'Kemarin' },
      { id: 'rv-9', reviewerName: 'Siti Maryam', rating: 5, comment: 'Nasi lengkonya bumbu kacangnya legit, tahu tempenya garing hangat.', date: '2 hari lalu' },
      { id: 'rv-10', reviewerName: 'Budi Santoso', rating: 4, comment: 'Tahu gejrot asem pedasnya mantul, cocok buat santap sore.', date: '5 hari lalu' }
    ]
  },
];

export const LOCAL_SERVICES: LocalServiceWorker[] = [
  {
    id: 'srv-1',
    name: 'Kang Solihin',
    trade: 'Tukang Listrik & Instalasi',
    rating: 4.9,
    distance: '300 m',
    jobsCompleted: 142,
    startingPrice: 35000,
    priceUnit: 'per pengecekan / titik',
    phone: '0812-3344-1122',
    area: 'Blok Makmur & Karangmulya',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    specialties: ['Instalasi MCB', 'Korsleting Listrik', 'Pasang Lampu Jalan', 'Kabel Stop Kontak'],
  },
  {
    id: 'srv-2',
    name: 'Kang Maman Suparman',
    trade: 'Tukang Bangunan & Renovasi',
    rating: 4.8,
    distance: '500 m',
    jobsCompleted: 88,
    startingPrice: 120000,
    priceUnit: 'ongkos harian / borongan',
    phone: '0822-5566-7788',
    area: 'Kecamatan Arjawinangun',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    specialties: ['Pasang Keramik', 'Bocoran Genteng', 'Plester & Tembok', 'Pengecatan Rumah'],
  },
  {
    id: 'srv-3',
    name: 'Mang Joko Sentosa',
    trade: 'Servis Pompa Air & Ledeng Pipa',
    rating: 4.9,
    distance: '450 m',
    jobsCompleted: 215,
    startingPrice: 45000,
    priceUnit: 'jasa perbaikan',
    phone: '0878-1122-9900',
    area: 'Kebonturi & Jungjang',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    specialties: ['Pompa Shimizu/Sanyo', 'Saluran Mampet', 'Pipa Toren Bocor', 'Ganti Otomatis Pompa'],
  },
  {
    id: 'srv-4',
    name: 'Kang Dasuki',
    trade: 'Tukang Urut Tradisional & Terapi',
    rating: 5.0,
    distance: '350 m',
    jobsCompleted: 310,
    startingPrice: 60000,
    priceUnit: 'sesi 60 menit',
    phone: '0852-7788-3322',
    area: 'Panggilan ke Rumah se-Arjawinangun',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    specialties: ['Pijat Pegal Linu', 'Keseleo Ringan', 'Refleksi Capek Tani', 'Urut Badan Masuk Angin'],
  },
];

export const FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    author: 'Pak RT 03 Slamet',
    block: 'Blok Makmur',
    role: 'Pengurus RT',
    timestamp: '2 jam lalu',
    category: 'Info Gotong Royong',
    content: 'Assalamu’alaikum warga Blok Makmur. Diberitahukan Minggu pagi jam 07.00 WIB ada agenda bersih selokan menjelang musim hujan. Harap membawa cangkul & sapu lidi. Sarapan nasi lengko disediakan di pos kamling!',
    likes: 24,
    commentsCount: 6,
    isLiked: false,
    comments: [
      { author: 'Kang Imron (Ojek)', text: 'Siap Pak RT, kulo mangkat bar subuh!', time: '1 jam lalu' },
      { author: 'Mbak Siti', text: 'Kios mbak siti siap kirim bumbu & es teh manis nggih pak RT', time: '45 mnt lalu' },
    ],
  },
  {
    id: 'post-2',
    author: 'Ageng Prasetyo',
    block: 'Blok Karangmulya',
    role: 'Warga',
    timestamp: '5 jam lalu',
    category: 'Laporan',
    content: 'Lampu penerangan jalan di perlintasan rel KA deket gardu induk padam sejak kemarin malam. Kondisi agak gelap waktu maghrib. Mohon diteruskan ke bagian pemeliharaan balai desa atau PLN. Matur kesuwun.',
    likes: 18,
    commentsCount: 3,
    isLiked: true,
    comments: [
      { author: 'Admin Desa Arjawinangun', text: 'Terima kasih laporannya Mas Ageng. Sudah diteruskan ke teknisi Kang Solihin untuk dicek saklar MCB-nya hari ini.', time: '3 jam lalu' },
    ],
  },
  {
    id: 'post-3',
    author: 'H. Sanusi',
    block: 'Pasar Jungjang',
    role: 'Mitra Pedagang',
    timestamp: 'Kemarin',
    category: 'Diskusi',
    content: 'Alhamdulillah lewat fitur Belanja Offline Wong Arjawinangun, warung toko klontong kula dadi rame pesenan antar kurir desa. Warga sepuh ora usah kepanasan menyang pasar. Top pisan aplikasine!',
    likes: 42,
    commentsCount: 8,
    isLiked: false,
    comments: [
      { author: 'Mang Duloh (Becak)', text: 'Kula nggih seneng mang, dadi sering oleh tarikan ngeterke sembako.', time: 'Kemarin' },
    ],
  },
];

export const VILLAGE_CONTACTS: VillageContact[] = [
  {
    id: 'c-1',
    name: 'Balai Desa Arjawinangun',
    role: 'Pelayanan KTP, KK & Surat Keterangan Warga',
    phone: '0231-357890',
    whatsapp: '0812-3456-7788',
    category: 'Desa',
    hours: 'Senin - Jumat (08.00 - 15.00 WIB)',
  },
  {
    id: 'c-2',
    name: 'Bhabinkamtibmas (Aiptu Sudrajat)',
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

export const FAQS = [
  {
    q: 'Kepripun carane pesen Ojek & Becak Lokal?',
    a: 'Pilih menu "Ojek & Becak" ing beranda. Ketik titik jemput (misal Blok Makmur) lan tujuan sampeyan. Pilih armada (Becak Onthel Rp 10.000 utawa Ojek Motor Rp 8.000). Sawise konfirmasi, sistem bakal nemokake mitra terdekat, lan sampeyan bisa langsung ngobrol lewat chat driver utawa telpon.',
  },
  {
    q: 'Kepripun carane Belanja Pasar Tradisional offline tanpa ribet?',
    a: 'Buka menu "Belanja Offline", pilih pasar utawa warung pedagang (sayur, sembako, daging). Tambahake barang ing keranjang, banjur pilih: apa dikirim dening kurir becak/ojek lokal langsung menyang ngarep omah, utawa dijupuk dhewe ing kios tanpa kudu antre.',
  },
  {
    q: 'Kepripun carane bayar? Apa kudu nganggo HP terus?',
    a: 'Sampeyan bisa milih bayar Tunai (Cash) langsung nalika driver utawa barang wis teka, utawa nganggo Dompet Digital QRIS (Wong Pay) kanthi scan QRIS bank/e-wallet apa wae.',
  },
  {
    q: 'Kepripun carane ndaftar dadi Mitra (Tukang, Becak, Ojek, Pedagang Pasar)?',
    a: 'Ing kaca ngarep, klik tombol "Daftar" banjur pilih peran "Mitra". Isi foto KTP, jenis keahlian/armada, lan nomer WhatsApp. Tim pengurus desa bakal verifikasi sajrone 1x24 jam supaya akun sampeyan aktif lan nampa pesenan warga.',
  },
];

export const MOCK_ORDERS: OrderRecord[] = [
  {
    id: 'ORD-8821',
    type: 'becak',
    title: 'Becak Onthel - Mang Duloh',
    subtitle: 'Pasar Jungjang ➔ Rumah Blok Makmur',
    date: 'Hari ini, 09.30 WIB',
    total: 10000,
    status: 'Selesai',
    paymentMethod: 'Tunai',
  },
  {
    id: 'ORD-8819',
    type: 'belanja',
    title: 'Belanja Sayur - Kios Mbak Siti',
    subtitle: 'Bawang Merah 500g, Cabai Rawit, Tomat',
    date: 'Kemarin, 06.45 WIB',
    total: 35000,
    status: 'Selesai',
    paymentMethod: 'QRIS Cirebon Pay',
  },
  {
    id: 'ORD-8802',
    type: 'jasa',
    title: 'Servis Listrik - Kang Solihin',
    subtitle: 'Perbaikan saklar MCB kamar & teras',
    date: '02 Okt 2026',
    total: 35000,
    status: 'Selesai',
    paymentMethod: 'Tunai',
  },
];

// 5 Dedicated User Accounts with Integrity & Service Ratings
export const MOCK_USERS: Record<string, UserAccount> = {
  super_admin: {
    id: 'usr-super-admin',
    name: 'Drs. H. Mulyadi, M.Si',
    role: 'super_admin',
    roleTitle: 'Super Administrator Sistem',
    emailOrPhone: 'superadmin@arjawinangun.desa.id',
    location: 'Kantor Balai Desa Arjawinangun',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    description: 'Kuwu & Penanggung Jawab Sistem Digital Desa Arjawinangun. Mengontrol seluruh izin, tarif, kas desa & keamanan server.',
    verifiedBadge: 'Kepala Sistem Balai Desa',
    joinedDate: 'Januari 2025',
    nik: '3209140101700001',
    rtRw: 'RT 01 / RW 01 Balai Desa',
    integrityRating: 4.98,
    serviceRating: 4.96,
    totalReviewsCount: 142,
    reputationBadge: 'Aparatur Teladan Bintang 5',
  },
  admin: {
    id: 'usr-admin',
    name: 'Rian Ardiansyah, S.Kom',
    role: 'admin',
    roleTitle: 'Admin Operasional Wilayah',
    emailOrPhone: 'ops.desa@arjawinangun.id',
    location: 'Posko Operasional Balai Desa',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    description: 'Pengelola operasional lapangan harian: memverifikasi berkas mitra/merchant, memantau armada di 8 blok, & menangani aduan warga.',
    verifiedBadge: 'Verifikator Resmi Desa',
    joinedDate: 'Februari 2025',
    nik: '3209141508920002',
    rtRw: 'RT 02 / RW 01 Posko Desa',
    integrityRating: 4.95,
    serviceRating: 4.92,
    totalReviewsCount: 88,
    reputationBadge: 'Verifikator Terpercaya',
  },
  mitra: {
    id: 'usr-mitra',
    name: 'Mang Duloh',
    role: 'mitra',
    roleTitle: 'Mitra Armada Becak Onthel',
    emailOrPhone: '0812-3456-7890',
    location: 'Pangkalan Pos Blok Makmur, RT 03',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    description: 'Mitra transportasi becak onthel tradisional nomor 14. Melayani antar jemput warga dan belanjaan pasar Jungjang.',
    verifiedBadge: 'Terverifikasi Paguyuban Becak',
    joinedDate: 'Maret 2025',
    nik: '3209142304680003',
    rtRw: 'RT 03 / RW 02 Blok Makmur',
    integrityRating: 4.96,
    serviceRating: 4.94,
    totalReviewsCount: 116,
    reputationBadge: 'Mitra Pengemudi Teladan',
  },
  merchant: {
    id: 'usr-merchant',
    name: 'Mbak Siti Khotimah',
    role: 'merchant',
    roleTitle: 'Merchant / Pedagang Pasar Jungjang',
    emailOrPhone: '0877-2233-4455',
    location: 'Kios Blok A No. 12, Pasar Jungjang',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    description: 'Pemilik Kios Sayur & Bumbu Segar Mbak Siti. Melayani pesanan belanja pasar offline dan titip kurir desa.',
    verifiedBadge: 'Pedagang Resmi Pasar Jungjang',
    joinedDate: 'Maret 2025',
    nik: '3209144406850004',
    rtRw: 'Pasar Jungjang Blok A',
    integrityRating: 4.93,
    serviceRating: 4.90,
    totalReviewsCount: 79,
    reputationBadge: 'Pedagang Jujur & Amanah',
  },
  pelanggan: {
    id: 'usr-pelanggan',
    name: 'Ageng Prasetyo',
    role: 'pelanggan',
    roleTitle: 'Warga / Pelanggan Terverifikasi',
    emailOrPhone: '0812-3456-7890',
    location: 'Blok Makmur, RT 03 / RW 02',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    description: 'Warga asli Arjawinangun. Pengguna aktif layanan ojek, becak pasar, jasa tukang listrik, & forum warga.',
    verifiedBadge: 'Warga Terverifikasi RT 03',
    joinedDate: 'April 2025',
    nik: '3209141902950005',
    rtRw: 'RT 03 / RW 02 Blok Makmur',
    integrityRating: 4.95,
    serviceRating: 4.88,
    totalReviewsCount: 34,
    reputationBadge: 'Warga Berintegritas Tinggi',
  },
};

// System Verification Queue for Admin Operasional
export const MOCK_VERIFICATIONS: VerificationRequest[] = [
  {
    id: 'VER-001',
    name: 'Kang Darso (Bentor Kencana)',
    type: 'mitra',
    category: 'Becak Motor (Bentor)',
    phone: '0858-9900-1122',
    location: 'Blok Karangmulya',
    documentType: 'Foto KTP & Surat Izin Trayek Paguyuban',
    submittedAt: '15 menit lalu',
    status: 'pending',
    notes: 'Pendaftaran armada bentor baru rute Pasar Jungjang - Karangmulya',
  },
  {
    id: 'VER-002',
    name: 'Kios Bu Wartini (Sembako & Beras)',
    type: 'merchant',
    category: 'Sembako & Toko Klontong',
    phone: '0813-7766-5544',
    location: 'Pasar Jungjang Los B No. 08',
    documentType: 'Foto Kios & Surat Izin Lapak Pasar',
    submittedAt: '45 menit lalu',
    status: 'pending',
    notes: 'Pengajuan katalog beras lokal dan minyak goreng',
  },
  {
    id: 'VER-003',
    name: 'Kang Deden (Servis Pompa & Ledeng)',
    type: 'mitra',
    category: 'Jasa Tukang Ledeng',
    phone: '0821-3344-9988',
    location: 'Blok Pos Kidul',
    documentType: 'KTP & Sertifikat Keterampilan Tukang',
    submittedAt: '2 jam lalu',
    status: 'pending',
    notes: 'Keahlian perbaikan toren dan sumur bor',
  },
];

// Operational Support Tickets for Admin
export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-201',
    reporterName: 'Ibu Hj. Rokayah',
    reporterRole: 'Pelanggan',
    issue: 'Belanjaan telur di keranjang becak tertinggal 1 plastik saat turun di Blok Makmur',
    category: 'Armada',
    timestamp: '25 menit lalu',
    status: 'Diproses',
    priority: 'Tinggi',
  },
  {
    id: 'TCK-202',
    reporterName: 'Kang Imron (Ojek)',
    reporterRole: 'Mitra',
    issue: 'Akses gang Blok Karangmulya RT 02 ditutup terop hajatan, butuh penyesuaian rute jemput',
    category: 'Titik Jemput',
    timestamp: '1 jam lalu',
    status: 'Terbuka',
    priority: 'Sedang',
  },
  {
    id: 'TCK-203',
    reporterName: 'Kios Mbak Siti',
    reporterRole: 'Merchant',
    issue: 'Stok cabai rawit merah habis tadi siang tapi pelanggan sempat order, sudah diganti cabai keriting',
    category: 'Kios Pasar',
    timestamp: '3 jam lalu',
    status: 'Selesai',
    priority: 'Rendah',
  },
];

// Super Admin Audit Logs
export const MOCK_AUDIT_LOGS: SystemAuditLog[] = [
  {
    id: 'LOG-501',
    actor: 'Super Admin (Drs. H. Mulyadi)',
    action: 'Penyesuaian Tarif Dasar',
    detail: 'Menetapkan tarif minimum becak onthel Rp 10.000 & ojek motor Rp 8.000',
    timestamp: 'Hari ini, 08:15 WIB',
    level: 'info',
  },
  {
    id: 'LOG-502',
    actor: 'Admin Ops (Rian Ardiansyah)',
    action: 'Verifikasi Mitra Baru',
    detail: 'Menyetujui pendaftaran mitra Kang Solihin (Tukang Listrik) ke database sistem',
    timestamp: 'Kemarin, 14:20 WIB',
    level: 'info',
  },
  {
    id: 'LOG-503',
    actor: 'Sistem Keamanan Balai Desa',
    action: 'Backup Data Warga Berhasil',
    detail: '1.482 data kependudukan & riwayat transaksi tersinkronisasi aman',
    timestamp: 'Kemarin, 00:00 WIB',
    level: 'security',
  },
  {
    id: 'LOG-504',
    actor: 'Super Admin (Drs. H. Mulyadi)',
    action: 'Update Pembagian Kas Desa',
    detail: 'Persentase kontribusi paguyuban tetap di 3% untuk dana sosial warga',
    timestamp: '03 Okt 2026',
    level: 'warning',
  },
];

// Emergency Broadcast Messages
export const MOCK_BROADCASTS: BroadcastMessage[] = [
  {
    id: 'BC-101',
    sender: 'Balai Desa Arjawinangun',
    title: 'Gotong Royong Bersih Saluran Kali Winong',
    content: 'Dihimbau seluruh warga Blok Makmur & Jungjang berkumpul Minggu 07.00 WIB untuk antisipasi genangan hujan.',
    category: 'Gotong Royong',
    sentAt: 'Hari ini, 07:00 WIB',
    target: 'Semua Warga (1.482 akun)',
  },
  {
    id: 'BC-102',
    sender: 'Kamtibmas & Balai Desa',
    title: 'Waspada Penipuan Mengatasnamakan Bantuan Desa',
    content: 'Petugas Balai Desa tidak pernah meminta uang tunai untuk pencairan bansos pangan atau kupon pasar.',
    category: 'Info Resmi',
    sentAt: '03 Okt 2026',
    target: 'Semua Warga',
  },
];

// Merchant Orders for Merchant Dashboard
export const MOCK_MERCHANT_ORDERS: MerchantOrder[] = [
  {
    id: 'ORD-M01',
    customerName: 'Ibu Hj. Rokayah',
    customerPhone: '0812-9988-7766',
    deliveryAddress: 'Blok Makmur Pos RT 03',
    items: [
      { name: 'Bawang Merah Losari', qty: 1, price: 15000 },
      { name: 'Cabai Rawit Merah Segar', qty: 1, price: 12000 },
      { name: 'Tomat Segar Petik (1 kg)', qty: 1, price: 8000 },
    ],
    total: 35000,
    status: 'Menunggu',
    orderTime: '5 menit lalu',
    courierType: 'Becak Onthel',
  },
  {
    id: 'ORD-M02',
    customerName: 'Ageng Prasetyo',
    customerPhone: '0812-3456-7890',
    deliveryAddress: 'Blok Makmur RT 03 / RW 02',
    items: [
      { name: 'Bawang Merah Losari (500g)', qty: 2, price: 30000 },
      { name: 'Kangkung Desa 2 Ikat', qty: 2, price: 10000 },
    ],
    total: 40000,
    status: 'Disiapkan',
    orderTime: '20 menit lalu',
    courierType: 'Ojek Cepat',
  },
  {
    id: 'ORD-M03',
    customerName: 'Pak Slamet (RT 03)',
    customerPhone: '0813-2211-9988',
    deliveryAddress: 'Pos Kamling Blok Makmur',
    items: [
      { name: 'Cabai Rawit Merah Segar', qty: 2, price: 24000 },
      { name: 'Tomat Segar Petik', qty: 2, price: 16000 },
    ],
    total: 40000,
    status: 'Selesai',
    orderTime: '2 jam lalu',
    courierType: 'Ambil Mandiri',
  },
];

// Official Village Polls (Only created by Admin/Kuwu, voted by Citizens)
export const MOCK_VILLAGE_POLLS: VillagePoll[] = [
  {
    id: 'poll-01',
    title: 'Penataan Jalur Parkir Becak & Ojek Pasar Jungjang',
    description: 'Menindaklanjuti usulan paguyuban dan pedagang untuk mengurai kemacetan jam sibuk pagi (06.00-09.00 WIB) di depan gerbang utama Pasar Jungjang.',
    category: 'Infrastruktur',
    createdBy: 'Drs. H. Mulyadi, M.Si',
    authorRole: 'Super Admin (Kuwu)',
    createdAt: '06 Okt 2026',
    endDate: '15 Okt 2026',
    status: 'Aktif',
    options: [
      { id: 'opt-1a', text: 'Jalur Khusus Becak Onthel di sisi timur, Ojek Motor di sisi barat', votesCount: 284 },
      { id: 'opt-1b', text: 'Pindahkan pangkalan becak ke kantong parkir eks-terminal lama', votesCount: 96 },
      { id: 'opt-1c', text: 'Bagi shift jam operasional antrean becak per blok', votesCount: 48 },
    ],
    totalVotes: 428,
  },
  {
    id: 'poll-02',
    title: 'Prioritas Alokasi Dana Kas Sosial Gotong Royong Q4 2026',
    description: 'Musyawarah digital penentuan arah penggunaan dana kas sosial desa (hasil iuran 3% transaksi digital aplikasi Wong Arjawinangun).',
    category: 'Kegiatan Desa',
    createdBy: 'Rian Ardiansyah, S.Kom',
    authorRole: 'Admin Operasional',
    createdAt: '04 Okt 2026',
    endDate: '20 Okt 2026',
    status: 'Aktif',
    options: [
      { id: 'opt-2a', text: 'Perbaikan lampu penerangan LED di 12 titik gang rawan', votesCount: 312 },
      { id: 'opt-2b', text: 'Bantuan subsidi sembako untuk lansia & janda pra-sejahtera', votesCount: 245 },
      { id: 'opt-2c', text: 'Pengadaan gerobak sampah & pembersihan saluran Kali Winong', votesCount: 180 },
    ],
    totalVotes: 737,
  },
  {
    id: 'poll-03',
    title: 'Uji Coba Hari Bebas Kendaraan Bermotor (Car Free Day) Alun-Alun',
    description: 'Wacana Car Free Day setiap Minggu pagi pukul 06.00 - 09.00 WIB untuk sarana olahraga warga dan bazar kuliner UMKM lokal.',
    category: 'Pasar & UMKM',
    createdBy: 'Drs. H. Mulyadi, M.Si',
    authorRole: 'Super Admin (Kuwu)',
    createdAt: '28 Sep 2026',
    endDate: '05 Okt 2026',
    status: 'Ditutup',
    options: [
      { id: 'opt-3a', text: 'Setuju diadakan setiap Minggu', votesCount: 490 },
      { id: 'opt-3b', text: 'Cukup 2 minggu sekali saja', votesCount: 120 },
      { id: 'opt-3c', text: 'Tidak setuju karena mengganggu akses rute', votesCount: 35 },
    ],
    totalVotes: 645,
  },
];

// Citizen Integrity & Service Reviews
export const MOCK_USER_REVIEWS: Record<string, UserReview[]> = {
  'usr-pelanggan': [
    {
      id: 'rev-1',
      reviewerName: 'Mang Duloh (Becak)',
      reviewerRole: 'Mitra',
      integrityScore: 5.0,
      serviceScore: 4.9,
      comment: 'Penumpang sangat ramah, bayar tunai pas tanpa tawar berlebihan, tepat waktu saat dijemput di pos RT 03.',
      date: 'Kemarin, 09.40 WIB',
    },
    {
      id: 'rev-2',
      reviewerName: 'Kios Mbak Siti',
      reviewerRole: 'Merchant',
      integrityScore: 4.9,
      serviceScore: 4.8,
      comment: 'Pelanggan setia belanja sayur. Konfirmasi pesanan jelas dan tidak pernah membatalkan orderan.',
      date: '03 Okt 2026',
    },
    {
      id: 'rev-3',
      reviewerName: 'Pak RT 03 Slamet',
      reviewerRole: 'Pengurus RT',
      integrityScore: 5.0,
      serviceScore: 5.0,
      comment: 'Warga teladan Blok Makmur, aktif di kegiatan gotong royong dan iuran desa tertib.',
      date: '28 Sep 2026',
    },
  ],
  'usr-mitra': [
    {
      id: 'rev-m1',
      reviewerName: 'Ibu Hj. Rokayah',
      reviewerRole: 'Pelanggan',
      integrityScore: 5.0,
      serviceScore: 5.0,
      comment: 'Mang Duloh orangnya jujur pisan, belanjaan saya ketinggalan langsung diantarkan ke rumah tanpa pamrih!',
      date: 'Hari ini, 10.15 WIB',
    },
    {
      id: 'rev-m2',
      reviewerName: 'Ageng Prasetyo',
      reviewerRole: 'Pelanggan',
      integrityScore: 4.9,
      serviceScore: 4.9,
      comment: 'Tarikan becaknya adem, sabar nungguin pas belanja di Pasar Jungjang. Tarif transparan sesuai standar desa.',
      date: '04 Okt 2026',
    },
  ],
  'usr-merchant': [
    {
      id: 'rev-s1',
      reviewerName: 'Ibu Hj. Rokayah',
      reviewerRole: 'Pelanggan',
      integrityScore: 5.0,
      serviceScore: 4.9,
      comment: 'Timbangannya selalu pas, sayur masih segar baru petik. Mbak Siti ramah dan jujur.',
      date: 'Kemarin, 07.20 WIB',
    },
  ],
};

// =============================================================
// LAYANAN UTAMA WARGA: QRIS DONASI & INFAQ DESA
// =============================================================
export const MOCK_DONATION_CAMPAIGNS: DonationCampaign[] = [
  {
    id: 'cmp-1',
    title: "Renovasi Kubah & Tempat Wudhu Masjid Jami' Arjawinangun",
    category: 'Masjid & Keagamaan',
    targetAmount: 25000000,
    collectedAmount: 17850000,
    donorsCount: 142,
    description: 'Penyempurnaan kubah utama dan penambahan fasilitas tempat wudhu ramah lansia & disabilitas di Masjid Jami pusat desa.',
    organizer: 'DKM Masjid Jami Arjawinangun',
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=500&auto=format&fit=crop&q=80',
    endDate: '31 Des 2026',
    qrisCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021226680016ID.GO.BANKINDONESIA.QRIS0118936009180000000000520458125802ID5924KAS+MASJID+ARJAWINANGUN6008CIREBON62070703A016304',
  },
  {
    id: 'cmp-2',
    title: 'Santunan Anak Yatim & Lansia Dhuafa Arjawinangun',
    category: 'Sosial & Yatim',
    targetAmount: 10000000,
    collectedAmount: 7650000,
    donorsCount: 96,
    description: 'Pemberian paket sembako bulanan dan uang santunan pendidikan bagi 45 anak yatim dan 30 lansia pra-sejahtera di lingkungan Blok Makmur & Jungjang.',
    organizer: 'Karang Taruna & Pengurus RT/RW Arjawinangun',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&auto=format&fit=crop&q=80',
    endDate: '15 Nov 2026',
  },
  {
    id: 'cmp-3',
    title: 'Kas Operasional Ambulans Siaga Warga Desa',
    category: 'Kesehatan & Siaga',
    targetAmount: 15000000,
    collectedAmount: 11400000,
    donorsCount: 88,
    description: 'Bahan bakar, servis rutin armada, oksigen darurat dan honor relawan driver ambulans desa siaga 24 jam gratis antar rujukan ke RSUD Arjawinangun.',
    organizer: 'Posko Siaga Kesehatan Warga',
    image: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=500&auto=format&fit=crop&q=80',
    endDate: '30 Nov 2026',
  },
  {
    id: 'cmp-4',
    title: 'Infaq Gotong Royong Perbaikan Saluran Irigasi Blok Makmur',
    category: 'Infrastruktur Desa',
    targetAmount: 8000000,
    collectedAmount: 5800000,
    donorsCount: 54,
    description: 'Bahan material pasir semen untuk perbaikan tanggul parit irigasi sawah warga agar aliran air lancar saat musim hujan tiba.',
    organizer: 'Paguyuban Warga & Mitra Tani Makmur',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&auto=format&fit=crop&q=80',
    endDate: '10 Des 2026',
  },
];

export const MOCK_DONATION_RECORDS: DonationRecord[] = [
  {
    id: 'dn-1',
    campaignId: 'cmp-1',
    campaignTitle: "Renovasi Kubah & Tempat Wudhu Masjid Jami' Arjawinangun",
    donorName: 'H. Sanusi & Keluarga',
    amount: 500000,
    prayer: 'Semoga barokah dan menjadi amal jariyah keluarga kami di Arjawinangun.',
    timestamp: '15 menit lalu',
    paymentMethod: 'QRIS Realtime',
  },
  {
    id: 'dn-2',
    campaignId: 'cmp-2',
    campaignTitle: 'Santunan Anak Yatim & Lansia Dhuafa Arjawinangun',
    donorName: 'Hamba Allah',
    amount: 100000,
    prayer: 'Semoga adik-adik yatim sehat dan bersemangat menuntut ilmu.',
    timestamp: '1 jam lalu',
    paymentMethod: 'QRIS Realtime',
  },
  {
    id: 'dn-3',
    campaignId: 'cmp-3',
    campaignTitle: 'Kas Operasional Ambulans Siaga Warga Desa',
    donorName: 'Ageng Prasetyo (Blok Makmur)',
    amount: 50000,
    prayer: 'Bismillah untuk siaga kesehatan sesama warga.',
    timestamp: '3 jam lalu',
    paymentMethod: 'QRIS Realtime',
  },
  {
    id: 'dn-4',
    campaignId: 'cmp-1',
    campaignTitle: "Renovasi Kubah & Tempat Wudhu Masjid Jami' Arjawinangun",
    donorName: 'Ibu Hj. Rokayah',
    amount: 250000,
    prayer: 'Semoga pembangunan cepat selesai dan makmur jamaahnya.',
    timestamp: '5 jam lalu',
    paymentMethod: 'QRIS Realtime',
  },
  {
    id: 'dn-5',
    campaignId: 'cmp-4',
    campaignTitle: 'Infaq Gotong Royong Perbaikan Saluran Irigasi Blok Makmur',
    donorName: 'Pak RT Dedi & Warga RT 02',
    amount: 200000,
    prayer: 'Gotong royong berkah, sawah subur panen melimpah.',
    timestamp: 'Kemarin',
    paymentMethod: 'QRIS Realtime',
  },
];

// =============================================================
// LAYANAN LOWONGAN KERJA LOKAL ARJAWINANGUN
// =============================================================
export const MOCK_JOB_VACANCIES: JobVacancy[] = [
  {
    id: 'job-1',
    title: 'Pramuniaga & Kasir Toko Sembako',
    employer: 'Toko Klontong Berkah H. Sanusi',
    category: 'Toko & Ritel',
    jobType: 'Penuh Waktu',
    salary: 'Rp 1.800.000 - Rp 2.200.000 / bln',
    location: 'Jl. Ki Bagus Rangin No. 4, Blok Makmur',
    description: 'Melayani transaksi pembeli toko sembako, mencatat pembukuan harian keluar masuk barang beras/minyak, serta menata stok rak display.',
    requirements: [
      'Pria/Wanita warga Arjawinangun dan sekitarnya',
      'Pendidikan min. SMP/SMA sederajat',
      'Jujur, teliti berhitung uang, dan ramah',
      'Jam kerja 07.30 - 16.30 WIB (Minggu libur bergantian)',
      'Disediakan uang makan siang harian'
    ],
    contactPhone: '0812-9876-5432',
    contactPerson: 'H. Sanusi',
    postedDate: 'Hari ini',
    isOpen: true,
  },
  {
    id: 'job-2',
    title: 'Mekanik / Asisten Montir Servis Motor',
    employer: 'Bengkel Motor Berkah Jaya Sentosa',
    category: 'Bengkel & Otomotif',
    jobType: 'Harian',
    salary: 'Rp 85.000 - Rp 120.000 / hari',
    location: 'Dekat Stasiun KA Arjawinangun',
    description: 'Membantu pengerjaan servis berkala motor bebek dan matic warga: ganti oli, kampas rem, tune-up ringan, dan tambal ban tubeless.',
    requirements: [
      'Pria, usia 18-35 tahun',
      'Bisa dasar bongkar pasang motor matic & bebek',
      'Rajin, bertanggung jawab terhadap kunci & alat bengkel',
      'Dapat komisi bonus tiap servis besar',
      'Bisa langsung mulai kerja besok'
    ],
    contactPhone: '0813-8899-1234',
    contactPerson: 'Kang Imron / Mas Totok',
    postedDate: 'Kemarin',
    isOpen: true,
  },
  {
    id: 'job-3',
    title: 'Juru Masak & Asisten Dapur Empal Gentong',
    employer: 'Rumah Makan Kuliner Yu Wasminah',
    category: 'UMKM & Kuliner',
    jobType: 'Penuh Waktu',
    salary: 'Rp 2.000.000 - Rp 2.500.000 / bln',
    location: 'Area Parkir Stasiun Arjawinangun',
    description: 'Membantu persiapan bumbu rempah empal gentong tradisional, potong daging sapi, menanak lontong dan menjaga kebersihan dapur.',
    requirements: [
      'Pria/Wanita pengalaman dapur warung makan / pemula rajin',
      'Cekatan, bersih dan menjaga higienitas makanan',
      'Jadwal kerja 08.00 - 17.00 WIB',
      'Makan siang & malam gratis dari warung'
    ],
    contactPhone: '0852-3344-5566',
    contactPerson: 'Yu Wasminah',
    postedDate: '2 hari lalu',
    isOpen: true,
  },
  {
    id: 'job-4',
    title: 'Operator Jahit & Finishing Kain Konveksi',
    employer: 'Konveksi Berkah Tegalgubug - Arjawinangun',
    category: 'Konveksi',
    jobType: 'Borongan',
    salary: 'Rp 90.000 - Rp 140.000 / hari (Sistem Borong)',
    location: 'Jalur Pantura Batas Tegalgubug Arjawinangun',
    description: 'Menjahit busana gamis, celana katun dan daster batik harian. Bahan kain dan mesin jahit high-speed sudah disediakan di tempat.',
    requirements: [
      'Bisa mengoperasikan mesin jahit obras / jahit jarum satu',
      'Teliti jahitan rapi sesuai pola contoh',
      'Bisa dibawa pulang atau dikerjakan di tempat konveksi',
      'Upah dibayarkan mingguan tepat waktu setiap Sabtu'
    ],
    contactPhone: '0877-5544-3322',
    contactPerson: 'Hj. Fatimah',
    postedDate: '3 hari lalu',
    isOpen: true,
  },
  {
    id: 'job-5',
    title: 'Kurir Pengantaran Belanjaan & Titip Barang Pasar',
    employer: 'Paguyuban Kurir Cepat Wong Arjawinangun',
    category: 'Driver & Kurir',
    jobType: 'Harian',
    salary: 'Rp 70.000 - Rp 150.000 / hari (Bagi Hasil)',
    location: 'Posko Induk Pasar Jungjang',
    description: 'Mengantar titipan pesanan bahan sayur, sembako dan barang warga antar blok desa menggunakan motor atau becak motor.',
    requirements: [
      'Memiliki motor sendiri & SIM C aktif',
      'Paham gang dan jalan desa se-Kecamatan Arjawinangun',
      'Punya HP Android untuk konfirmasi pesanan warga',
      'Sopan, santun dan amanah menjaga barang titipan'
    ],
    contactPhone: '0812-3456-7890',
    contactPerson: 'Mang Duloh (Ketua Armada)',
    postedDate: '4 hari lalu',
    isOpen: true,
  },
  {
    id: 'job-6',
    title: 'Tenaga Angkut & Muat Gabah Gudang Beras',
    employer: 'Gudang Beras Subur Makmur',
    category: 'Bangunan & Lapangan',
    jobType: 'Harian',
    salary: 'Rp 110.000 / hari + Uang Rokok & Kopi',
    location: 'Blok Kebonturi, Arjawinangun',
    description: 'Bongkar muat karung gabah dan beras hasil gilingan mesin selep, penataan karung di atas truk dan gudang penyimpanan.',
    requirements: [
      'Pria, kondisi fisik kuat dan sehat',
      'Jujur, terbiasa kerja fisik gotong royong',
      'Jam kerja 08.00 - 16.00 WIB',
      'Disediakan sarapan pagi dan makan siang'
    ],
    contactPhone: '0822-4455-8899',
    contactPerson: 'Pak Haji Rohman',
    postedDate: '5 hari lalu',
    isOpen: true,
  },
];

// =============================================================
// LAYANAN TANI & IKAN (TOKO, KATALOG, RATING & KOMENTAR WARGA)
// =============================================================
export const MOCK_TANI_IKAN_VENDORS: TaniIkanVendor[] = [
  {
    id: 'tani-1',
    name: 'Kelompok Tani Subur Makmur - Padi & Gabah Pilihan',
    type: 'pertanian',
    location: 'Blok Kebon Turi RT 03/RW 01, Arjawinangun',
    ownerName: 'Pak Haji Rohman (Ketua Gapoktan)',
    rating: 4.9,
    phone: '0822-4455-8899',
    openHours: '06.00 - 17.00 WIB',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&auto=format&fit=crop&q=80',
    description: 'Pusat hasil panen padi sawah Arjawinangun langsung dari petani. Menyediakan gabah kering giling mutu istimewa, beras poles pulen alami tanpa pemutih kimia.',
    products: [
      { id: 'tp-1', name: 'Beras Ciherang Asli Arjawinangun', category: 'Gabah & Beras', price: 67000, unit: '5 kg (Zak Rapi)', image: '🌾', description: 'Pulen, wangi alami, baru giling dari sawah lokal.', inStock: true },
      { id: 'tp-2', name: 'Gabah Kering Giling (GKG) Pilihan', category: 'Gabah & Beras', price: 7800, unit: 'per kg', image: '🌾', description: 'Kadar air standar 14%, rendemen beras tinggi.', inStock: true },
      { id: 'tp-3', name: 'Benih Padi Unggul Inpari 32 Label Biru', category: 'Benih Tanaman', price: 75000, unit: '5 kg (Kantong Benih)', image: '🌱', description: 'Tahan wereng coklat dan hawar daun, bulir lebat.', inStock: true },
      { id: 'tp-4', name: 'Sekam Bakar Arang Alami untuk Pupuk', category: 'Pupuk & Obat', price: 15000, unit: 'Karung 10 kg', image: '🪵', description: 'Bagus untuk penggembur tanah bedengan sawah dan cabai.', inStock: true },
    ],
    reviews: [
      { id: 'tr-1', reviewerName: 'Pak Kusnan (Petani Blok Makmur)', rating: 5, comment: 'Benih Inpari 32 dari Pak Haji Rohman daya tumbuhnya 98%, anakan padinya banyak dan tahan rebah!', date: 'Kemarin' },
      { id: 'tr-2', reviewerName: 'Ibu Hj. Rokayah', rating: 5, comment: 'Beras Ciherangnya pulen pisan, dimasak tidak cepat basi. Tanpa pemutih aman buat cucu.', date: '3 hari lalu' },
      { id: 'tr-3', reviewerName: 'Kang Dasuki', rating: 5, comment: 'Timbangan gabahnya selalu pas, harga bersahabat langsung petani tanpa tengkulak nakal.', date: '1 minggu lalu' },
    ],
  },
  {
    id: 'tani-2',
    name: 'Kios Saprotan Berkah Tani - Pupuk & Sarana Pertanian',
    type: 'pupuk_sarana',
    location: 'Los Pertanian Pasar Jungjang, Arjawinangun',
    ownerName: 'Mas Tarjo Saputra',
    rating: 4.8,
    phone: '0878-3322-1100',
    openHours: '06.30 - 16.30 WIB',
    image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500&auto=format&fit=crop&q=80',
    description: 'Penyedia saprotan resmi untuk petani desa: pupuk organik fermentasi, NPK, obat pengendali hama ramah lingkungan, bibit hortikultura dan alat semprot elektrik.',
    products: [
      { id: 'tp-5', name: 'Pupuk Kompos Organik Fermentasi Sapi & Kambing', category: 'Pupuk & Obat', price: 20000, unit: 'Karung 20 kg', image: '🪱', description: 'Kaya mikroba tanah, menyuburkan lahan lelah.', inStock: true },
      { id: 'tp-6', name: 'Pupuk NPK Mutiara 16-16-16 Asli', category: 'Pupuk & Obat', price: 18000, unit: 'per kg', image: '🧪', description: 'Mempercepat pertumbuhan akar, tunas dan bunga.', inStock: true },
      { id: 'tp-7', name: 'Bibit Cabai Rawit Merah Unggul (Biji F1)', category: 'Benih Tanaman', price: 35000, unit: 'Sachet 10 gram (1500 biji)', image: '🌶️', description: 'Tahan cuaca panas Pantura, buah lebat mengkilap.', inStock: true },
      { id: 'tp-8', name: 'Tangki Semprot Hama Elektrik 16L', category: 'Alat Tani', price: 285000, unit: '1 Unit Lengkap Nozzle', image: '🚜', description: 'Baterai tahan 8 jam semprot, semprotan halus merata.', inStock: true },
    ],
    reviews: [
      { id: 'tr-4', reviewerName: 'Mang Sanusi', rating: 5, comment: 'Pupuk organiknya bikin tanah cabai saya jadi gembur, buahnya montok-montok. Mas Tarjo juga pinter ngasih tips dosis.', date: '2 hari lalu' },
      { id: 'tr-5', reviewerName: 'H. Sudrajat', rating: 4, comment: 'Tangki elektriknya enteng dan baterai awet. Pelayanan ramah di Pasar Jungjang.', date: '5 hari lalu' },
    ],
  },
  {
    id: 'tani-3',
    name: 'Tambak Budidaya Ikan Air Tawar Mina Barokah',
    type: 'perikanan',
    location: 'Saluran Irigasi Blok Karangmulya, Arjawinangun',
    ownerName: 'Kang Hasan Basri',
    rating: 4.9,
    phone: '0857-4433-2211',
    openHours: '07.00 - 17.30 WIB',
    image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=500&auto=format&fit=crop&q=80',
    description: 'Pusat bibit dan panen ikan air tawar sehat dan lincah dari air irigasi mengalir: Nila Merah, Lele Sangkuriang, Ikan Mas dan Gurame konsumsi segar.',
    products: [
      { id: 'tp-9', name: 'Bibit Ikan Nila Merah Gesit Ukuran 5-7 cm', category: 'Bibit Ikan & Pakan', price: 400, unit: 'per ekor (Min. 100 ekor)', image: '🐟', description: 'Sehat lincah, kematian rendah, sudah disortir.', inStock: true },
      { id: 'tp-10', name: 'Bibit Ikan Lele Sangkuriang Ukuran 7-8 cm', category: 'Bibit Ikan & Pakan', price: 250, unit: 'per ekor (Min. 200 ekor)', image: '🐡', description: 'Nafsu makan tinggi, cepat panen 2,5 bulan.', inStock: true },
      { id: 'tp-11', name: 'Ikan Gurame Segar Hidup Konsumsi', category: 'Bibit Ikan & Pakan', price: 55000, unit: '1 kg (Isi 2-3 ekor)', image: '🐠', description: 'Bisa minta dibersihkan langsung, daging manis tanpa bau lumpur.', inStock: true },
      { id: 'tp-12', name: 'Pakan Pelet Ikan Apung Protein 30% (781)', category: 'Bibit Ikan & Pakan', price: 13500, unit: 'per kg', image: '🥣', description: 'Memacu pertumbuhan daging cepat tanpa mencemari kolam.', inStock: true },
    ],
    reviews: [
      { id: 'tr-6', reviewerName: 'Kang Imron (Pemancing & Budidaya)', rating: 5, comment: 'Bibit nila merahnya tahan penyakit pisan, sebulan dipelihara di kolam terpal sudah gede-gede.', date: 'Kemarin' },
      { id: 'tr-7', reviewerName: 'Yu Wasminah', rating: 5, comment: 'Guramenya tidak bau tanah sama sekali, dagingnya tebal pas buat menu bakar di warung!', date: '3 hari lalu' },
      { id: 'tr-8', reviewerName: 'Pak Dedi RT 04', rating: 5, comment: 'Beli lele hidup buat acara arisan warga, ikannya segar dan bonus beberapa ekor. Hatur nuhun Kang Hasan.', date: '1 minggu lalu' },
    ],
  },
  {
    id: 'tani-4',
    name: 'Pusat Bibit Tanaman Buah & Holtikultura Berkah Kebon',
    type: 'pertanian',
    location: 'Jl. Ki Bagus Rangin Samping Balai Desa, Arjawinangun',
    ownerName: 'Ibu Nuraeni',
    rating: 4.8,
    phone: '0813-2211-9988',
    openHours: '07.30 - 17.00 WIB',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500&auto=format&fit=crop&q=80',
    description: 'Menyediakan bibit mangga gedong gincu khas Cirebon, jambu kristal, jeruk nipis pekarangan, serta media tanam polybag siap pakai untuk pekarangan warga.',
    products: [
      { id: 'tp-13', name: 'Bibit Mangga Gedong Gincu Okulasi Asli', category: 'Benih Tanaman', price: 45000, unit: '1 Pohon Polybag (Tinggi 70 cm)', image: '🥭', description: 'Cepat berbuah dalam 1-2 tahun, buah manis legit harum.', inStock: true },
      { id: 'tp-14', name: 'Bibit Jambu Kristal Non-Biji Cangkok', category: 'Benih Tanaman', price: 35000, unit: '1 Pohon Polybag', image: '🍈', description: 'Daging renyah manis seperti apel, cocok di pot/pekarangan.', inStock: true },
      { id: 'tp-15', name: 'Media Tanam Organik Subur 4 in 1', category: 'Pupuk & Obat', price: 15000, unit: 'Karung 10 kg', image: '🪴', description: 'Campuran tanah subur, pupuk kandang, sekam bakar & cocopeat.', inStock: true },
    ],
    reviews: [
      { id: 'tr-9', reviewerName: 'Bu Guru Siti', rating: 5, comment: 'Bibit mangga gedong gincunya tumbuh subur di halaman depan rumah, daunnya rimbun hijau segar.', date: '4 hari lalu' },
      { id: 'tr-10', reviewerName: 'Ageng Prasetyo', rating: 4, comment: 'Media tanamnya gembur tidak padat, cocok buat tanaman cabai pekarangan.', date: '6 hari lalu' },
    ],
  },
];

// -------------------------------------------------------------
// HALL OF FAME ARJAWINANGUN (Panggung Kehormatan & Sosok Berprestasi)
// Kategori: Tokoh Masyarakat, Pemuda Inspiratif, Pelajar Berprestasi, Atlet Daerah, Pengusaha Muda, Relawan Sosial
// -------------------------------------------------------------
export const MOCK_HALL_OF_FAME: HallOfFameItem[] = [
  {
    id: 'hof-1',
    name: 'Ki H. Masduki Sastroamidjojo',
    category: 'Tokoh Masyarakat',
    title: 'Sesepuh Penjaga Budaya Tarling & Tokoh Damai Rukun Warga',
    origin: 'Blok Karang Anyar, RT 02 / RW 01, Jungjang Arjawinangun',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
    year: '2024',
    story: 'Selama lebih dari 40 tahun mendedikasikan hidupnya untuk melestarikan kesenian karawitan dan sastra pesisir Cirebon. Beliau juga memediasi perselisihan batas tanah warga secara adil musyawarah mufakat tanpa pernah sampai ke meja sengketa.',
    achievements: [
      'Penerima Anugerah Budayawan Pelestari Pesisir Cirebon 2019',
      'Inisiator Pembangunan Pendopo Komunal Balai Rembug Warga Jungjang',
      'Pembina Sanggar Seni Budaya Putra Cirebon Timur dengan 120 murid binaan'
    ],
    appreciationsCount: 142,
    hasAppreciated: false,
    verifiedStatus: 'terverifikasi',
    comments: [
      { id: 'c-1', author: 'Kang Imron', role: 'Warga Blok Makmur', text: 'Sosok panutan sejati. Nasehat Ki Masduki selalu menyejukkan hati dan menyatukan seluruh blok.', date: '2 hari lalu' },
      { id: 'c-2', author: 'Siti Aminah', role: 'Guru Madrasah', text: 'Sehat selalu Ki, terima kasih telah melestarikan kebudayaan luhur kami.', date: '1 minggu lalu' }
    ]
  },
  {
    id: 'hof-2',
    name: 'Fajar Nugraha, S.Kom.',
    category: 'Pemuda Inspiratif',
    title: 'Inovator Digital Desa & Pendiri Ruang Belajar Gratis "Rumah Koding"',
    origin: 'Blok Kebon Melati, RT 04 / RW 02, Arjawinangun',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    year: '2024',
    story: 'Lulusan perguruan tinggi yang memilih kembali ke desa untuk memberdayakan generasi muda. Membangun ruang komputer swadaya di balai RT, melatih lebih dari 80 anak desa mahir coding, desain grafis, dan pemasaran online untuk produk UMKM keluarga.',
    achievements: [
      'Penghargaan Pemuda Penggerak Literasi Digital Jawa Barat 2023',
      'Membantu 35 pedagang pasar tradisional Arjawinangun masuk katalog digital',
      'Mendirikan perpustakaan terbuka dan wifi belajar gratis desa'
    ],
    appreciationsCount: 215,
    hasAppreciated: true,
    verifiedStatus: 'terverifikasi',
    comments: [
      { id: 'c-3', author: 'Budi Santoso', role: 'Orang tua siswa', text: 'Anak saya sekarang bisa desain spanduk dan bantu toko warung berkat bimbingan Mas Fajar!', date: 'Kemarin' },
      { id: 'c-4', author: 'Rian Pratama', role: 'Alumni Rumah Koding', text: 'Inspirasi pemuda masa kini yang tidak sombong dan mengabdi penuh buat kampung halaman.', date: '4 hari lalu' }
    ]
  },
  {
    id: 'hof-3',
    name: 'Anisa Rahmawati',
    category: 'Pelajar Berprestasi',
    title: 'Siswi SMAN 1 Arjawinangun · Juara 1 Olimpiade Sains Kimia Tingkat Provinsi',
    origin: 'Dusun Karangmulya, Blok Manis, RT 01 / RW 03',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    year: '2024',
    story: 'Putri dari pengrajin genteng lokal yang dengan tekad gigih belajar hingga meraih peringkat pertama Olimpiade Sains Nasional (OSN) tingkat Provinsi Jawa Barat cabang Kimia, dan kini bersiap melaju ke kancah nasional mewakili Kabupaten Cirebon.',
    achievements: [
      'Medali Emas Olimpiade Sains Nasional Bidang Kimia Tingkat Jawa Barat 2024',
      'Juara Umum Paralel Akademik SMAN 1 Arjawinangun 3 tahun berturut-turut',
      'Peneliti Remaja Terbaik Karya Ilmiah: Pemanfaatan Limbah Sekam Padi Sebagai Penjernih Air'
    ],
    appreciationsCount: 310,
    hasAppreciated: false,
    verifiedStatus: 'terverifikasi',
    comments: [
      { id: 'c-5', author: 'Hj. Rokayah', role: 'Warga Karangmulya', text: 'Masha Allah, membanggakan seluruh warga dusun! Semoga sukses sampai tingkat nasional nduk!', date: '3 hari lalu' },
      { id: 'c-6', author: 'Drs. Supriyadi', role: 'Wali Kelas SMAN 1', text: 'Murid yang tekun, santun, dan selalu membantu temannya yang kesulitan belajar.', date: '5 hari lalu' }
    ]
  },
  {
    id: 'hof-4',
    name: 'Bayu Rizky Pratama',
    category: 'Atlet Daerah',
    title: 'Pesilat Perisai Diri · Peraih Medali Emas Kejurda Pencak Silat Jawa Barat',
    origin: 'Blok Makmur, RT 03 / RW 02, Arjawinangun',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    year: '2024',
    story: 'Berlatih keras di halaman musholla sejak usia 9 tahun bersama perguruan silat lokal. Bayu berhasil membuktikan bahwa atlet dari pelosok desa mampu bersaing dengan atlet kota besar, menjuarai kelas tanding C Remaja Jawa Barat.',
    achievements: [
      'Medali Emas Tanding Putra Kejurda Pencak Silat Jawa Barat 2024',
      'Pesilat Terbaik Piala Bupati Cirebon Kategori Teknik Bantingan 2023',
      'Melatih ekstrakurikuler silat gratis untuk 45 adik-adik SD di Arjawinangun'
    ],
    appreciationsCount: 189,
    hasAppreciated: false,
    verifiedStatus: 'terverifikasi',
    comments: [
      { id: 'c-7', author: 'Kang Maman Becak', role: 'Tetangga RT 03', text: 'Saya saksi anak ini lari pagi jam 5 subuh tiap hari. Sangat layak juara!', date: 'Kemarin' }
    ]
  },
  {
    id: 'hof-5',
    name: 'Dedi Gunawan',
    category: 'Pengusaha Muda',
    title: 'Founder Berkah Gedong Gincu & Sentra Kerupuk Sambal Desa',
    origin: 'Jl. Raya Jungjang Samping Stasiun KA Arjawinangun',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    year: '2024',
    story: 'Mengembangkan potensi panen mangga dan kerupuk desa menjadi oleh-oleh khas berkualitas ekspor lokal. Saat ini pabrik rumahan yang dikelolanya mempekerjakan 38 ibu rumah tangga dan pemuda putus sekolah dengan upah layak di atas rata-rata.',
    achievements: [
      'Juara Wirausaha Muda Mandiri Cirebon Raya 2023',
      'Menyerap 38 tenaga kerja warga lokal desa tanpa syarat ijazah',
      'Mengalokasikan 10% laba usaha untuk beasiswa anak yatim di Desa Arjawinangun'
    ],
    appreciationsCount: 268,
    hasAppreciated: false,
    verifiedStatus: 'terverifikasi',
    comments: [
      { id: 'c-8', author: 'Bu Minah (Karyawan)', role: 'Warga Jungjang', text: 'Terima kasih Pak Dedi, berkat pabrik kerupuk bapak saya bisa menyekolahkan 2 anak sampai lulus SMK.', date: '3 hari lalu' }
    ]
  },
  {
    id: 'hof-6',
    name: 'Siti Nurjanah, A.Md.Keb.',
    category: 'Relawan Sosial',
    title: 'Bidan Sahabat Warga & Koordinator Siaga Bencana Banjir Pantura',
    origin: 'Blok Kebon Kelapa RT 02 / RW 04, Arjawinangun',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    year: '2024',
    story: 'Siaga 24 jam dengan motor tua untuk menolong persalinan ibu hamil darurat di malam hari tanpa memungut bayaran bagi keluarga kurang mampu. Saat banjir musiman melanda aliran sungai kali Winong, Bidan Siti menjadi garda depan pendirian dapur umum dan pos obat mandiri.',
    achievements: [
      'Penerima Penghargaan Nakes Teladan Pengabdian Pelosok Desa 2022',
      'Koordinator Posko Dapur Umum Bencana Winong melayani 400 paket makan/hari',
      'Penggagas Posyandu Terintegrasi Lansia & Balita Sehat RT 02'
    ],
    appreciationsCount: 395,
    hasAppreciated: true,
    verifiedStatus: 'terverifikasi',
    comments: [
      { id: 'c-9', author: 'Pak RT Wardiman', role: 'Ketua RT 02', text: 'Ibu Bidan Nurjanah adalah malaikat penolong bagi warga kami saat tengah malam.', date: 'Kemarin' },
      { id: 'c-10', author: 'Yu Darmi', role: 'Ibu Balita', text: 'Waktu saya melahirkan dini hari hujan lebat, beliau datang tanpa pamrih. Semoga Allah balas berlipat.', date: '4 hari lalu' }
    ]
  }
];

export const MOCK_HALL_OF_FAME_NOMINATIONS: HallOfFameNomination[] = [
  {
    id: 'nom-1',
    nomineeName: 'H. Sudirman Al-Hafidz',
    category: 'Tokoh Masyarakat',
    origin: 'Blok Kauman RT 01 / RW 01, Dekat Masjid Jami',
    title: 'Guru Ngaji Lansia & Penggerak Wakaf Tanah Kuburan Desa',
    achievements: 'Mengajar Al-Quran tanpa pamrih lebih dari 35 tahun, mewakafkan 600 meter tanah keluarga untuk perluasan pemakaman umum warga.',
    reason: 'Sosok yang sangat ikhlas mengabdi, selalu mendamaikan perselisihan warga dan tidak pernah meminta imbalan uang dari siapapun.',
    proposerName: 'Ahmad Zaenuri',
    proposerPhone: '0812-9988-7711',
    proposerRtRw: 'RT 01 / RW 01 Blok Kauman',
    createdAt: '10 Oktober 2024',
    status: 'Menunggu Verifikasi Tim Desa',
    supportVotes: 48,
    hasVoted: false
  },
  {
    id: 'nom-2',
    nomineeName: 'Rizki Aditya Pratama',
    category: 'Pengusaha Muda',
    origin: 'Blok Pasar Lama RT 03 / RW 02',
    title: 'Pengrajin Sepatu Kulit Lokal & Pelatih Karang Taruna',
    achievements: 'Mendirikan bengkel sepatu kulit mandiri, melatih 12 pemuda desa yang menganggur hingga memiliki keahlian jahit sol.',
    reason: 'Memberikan lapangan kerja nyata bagi anak muda desa agar tidak lari ke luar kota atau terjerumus hal negatif.',
    proposerName: 'Wahyu Hidayat',
    proposerPhone: '0857-4433-2211',
    proposerRtRw: 'RT 03 / RW 02',
    createdAt: '9 Oktober 2024',
    status: 'Menunggu Verifikasi Tim Desa',
    supportVotes: 32,
    hasVoted: false
  }
];



