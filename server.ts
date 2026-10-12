import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Database initialized with default Arjawinangun data
import {
  MOCK_USERS,
  MOCK_VILLAGE_POLLS,
  MARKET_VENDORS,
  MOCK_DRIVERS,
  VEHICLE_OPTIONS,
  FORUM_POSTS,
  MOCK_USER_REVIEWS,
  MOCK_LOCATIONS,
  APP_IMAGES,
  MOCK_DONATION_CAMPAIGNS,
  MOCK_DONATION_RECORDS,
  MOCK_JOB_VACANCIES,
  MOCK_TANI_IKAN_VENDORS,
  MOCK_HALL_OF_FAME,
  MOCK_HALL_OF_FAME_NOMINATIONS,
  MOCK_NOTIFICATIONS,
} from './src/data/mockData.js';

// Deep clones for backend state persistence during server runtime
let dbUsers = JSON.parse(JSON.stringify(MOCK_USERS));
let dbPolls = JSON.parse(JSON.stringify(MOCK_VILLAGE_POLLS));
let dbVendors = JSON.parse(JSON.stringify(MARKET_VENDORS));
let dbDrivers = JSON.parse(JSON.stringify(MOCK_DRIVERS));
let dbVehicleOptions = JSON.parse(JSON.stringify(VEHICLE_OPTIONS));
let dbForumPosts = JSON.parse(JSON.stringify(FORUM_POSTS));
let dbUserReviews = JSON.parse(JSON.stringify(MOCK_USER_REVIEWS));
let dbDonationCampaigns = JSON.parse(JSON.stringify(MOCK_DONATION_CAMPAIGNS));
let dbDonationRecords = JSON.parse(JSON.stringify(MOCK_DONATION_RECORDS));
let dbJobVacancies = JSON.parse(JSON.stringify(MOCK_JOB_VACANCIES));
let dbTaniIkanVendors = JSON.parse(JSON.stringify(MOCK_TANI_IKAN_VENDORS));
let dbHallOfFame = JSON.parse(JSON.stringify(MOCK_HALL_OF_FAME));
let dbHallOfFameNominations = JSON.parse(JSON.stringify(MOCK_HALL_OF_FAME_NOMINATIONS));
let dbNotifications = JSON.parse(JSON.stringify(MOCK_NOTIFICATIONS));

// Promos data
let dbPromos = [
  {
    id: 'prm-1',
    title: 'Pasar Subuh Segar Jungjang',
    subtitle: 'Sayur & bumbu diskon s/d 20%',
    image: APP_IMAGES.promoPasar,
    tag: 'Diskon Pagi',
    validUntil: '31 Okt 2026',
    discountCode: 'PASARSEGAR',
    description: 'Belanja sayur mayur dan bumbu dapur langsung dari petani Arjawinangun di Pasar Jungjang.',
  },
  {
    id: 'prm-2',
    title: 'Kupon Becak Onthel Desa',
    subtitle: 'Gratis ongkir belanjaan pasar pertama',
    image: APP_IMAGES.becakLokal,
    tag: 'Gratis Ongkir',
    validUntil: '25 Okt 2026',
    discountCode: 'BECAKGRATIS',
    description: 'Dukungan paguyuban becak onthel untuk mengantar ibu-ibu belanja dari pasar ke rumah.',
  },
  {
    id: 'prm-3',
    title: 'Festival Kuliner Khas Cirebon',
    subtitle: 'Empal Gentong & Nasi Lengko hemat Rp 5.000',
    image: APP_IMAGES.kulinerCirebon,
    tag: 'Khas Cirebon',
    validUntil: '28 Okt 2026',
    discountCode: 'KULINERCERBON',
    description: 'Nikmati kelezatan empal gentong bumbu kayu bakar dan tahu gejrot asli Arjawinangun.',
  },
];

// Main Menu data
const dbMenus = [
  {
    id: 'ojek_becak',
    title: 'Ojek & Becak',
    subtitle: 'Antar jemput warga & pasar',
    icon: 'Bike',
    screen: 'ojek_becak',
    color: 'red',
    badge: 'Lokal',
    isActive: true,
  },
  {
    id: 'belanja',
    title: 'Belanja Offline',
    subtitle: 'Pasar Jungjang & warung',
    icon: 'ShoppingBag',
    screen: 'belanja_offline',
    color: 'sky',
    badge: 'Segar',
    isActive: true,
  },
  {
    id: 'jasa',
    title: 'Jasa Lokal',
    subtitle: 'Tukang listrik & servis ledeng',
    icon: 'Wrench',
    screen: 'jasa_lokal',
    color: 'amber',
    badge: 'Amanah',
    isActive: true,
  },
  {
    id: 'polling',
    title: 'Polling Aspirasi',
    subtitle: 'Suara warga Arjawinangun',
    icon: 'Vote',
    screen: 'polling',
    color: 'purple',
    badge: 'Musyawarah',
    isActive: true,
  },
  {
    id: 'komunitas',
    title: 'Komunitas & Info',
    subtitle: 'Forum warga & gotong royong',
    icon: 'Users',
    screen: 'komunitas',
    color: 'emerald',
    badge: 'Guyub',
    isActive: true,
  },
  {
    id: 'kuliner',
    title: 'Kuliner Cirebon',
    subtitle: 'Empal gentong & tahu gejrot',
    icon: 'UtensilsCrossed',
    screen: 'belanja_offline',
    color: 'rose',
    badge: 'Sedap',
    isActive: true,
  },
  {
    id: 'info_desa',
    title: 'Balai Desa',
    subtitle: 'Layanan surat & kontak darurat',
    icon: 'Landmark',
    screen: 'komunitas',
    color: 'blue',
    badge: 'Resmi',
    isActive: true,
  },
];

// Active WhatsApp OTP sessions: phone -> { code, expiresAt, role }
const activeOtpSessions = new Map<string, { code: string; expiresAt: number; role?: string }>();

export async function createApp() {
  const app = express();
  app.use(express.json());

  // -------------------------------------------------------------
  // API: Health Check
  // -------------------------------------------------------------
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Wong Arjawinangun Backend API',
      timestamp: new Date().toISOString(),
      activeUsersCount: Object.keys(dbUsers).length,
      activePollsCount: dbPolls.length,
    });
  });

  // -------------------------------------------------------------
  // API: Promos
  // -------------------------------------------------------------
  app.get('/api/promos', (_req: Request, res: Response) => {
    res.json({ success: true, data: dbPromos });
  });

  // -------------------------------------------------------------
  // API: Menus
  // -------------------------------------------------------------
  app.get('/api/menus', (_req: Request, res: Response) => {
    res.json({ success: true, data: dbMenus });
  });

  // -------------------------------------------------------------
  // API: Merchants / Pedagang Pasar
  // -------------------------------------------------------------
  app.get('/api/merchants', (req: Request, res: Response) => {
    const category = req.query.category as string;
    let result = dbVendors;
    if (category && category !== 'semua') {
      result = result.filter((v: any) => v.category === category);
    }
    res.json({ success: true, count: result.length, data: result });
  });

  app.get('/api/merchants/:id', (req: Request, res: Response) => {
    const vendor = dbVendors.find((v: any) => v.id === req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Pedagang tidak ditemukan' });
    }
    res.json({ success: true, data: vendor });
  });

  app.post('/api/merchants/:id/review', (req: Request, res: Response) => {
    const vendor = dbVendors.find((v: any) => v.id === req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Pedagang tidak ditemukan' });
    }
    const { reviewerName, rating, comment } = req.body;
    if (!comment) {
      return res.status(400).json({ success: false, message: 'Komentar ulasan wajib diisi' });
    }
    const newReview = {
      id: `mrv-${Date.now()}`,
      reviewerName: reviewerName || 'Warga Arjawinangun',
      rating: Number(rating) || 5,
      comment,
      date: 'Baru saja',
    };
    if (!vendor.reviews) vendor.reviews = [];
    vendor.reviews.unshift(newReview);

    // Recalculate average rating
    const totalRating = vendor.reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    vendor.rating = Number((totalRating / vendor.reviews.length).toFixed(1));

    res.status(201).json({ success: true, data: newReview, vendor });
  });

  // -------------------------------------------------------------
  // API: Drivers & Mitra Armada
  // -------------------------------------------------------------
  app.get('/api/drivers', (_req: Request, res: Response) => {
    res.json({
      success: true,
      drivers: dbDrivers,
      vehicleOptions: dbVehicleOptions,
    });
  });

  app.get('/api/drivers/:vehicleType', (req: Request, res: Response) => {
    const driver = dbDrivers[req.params.vehicleType];
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Armada tidak ditemukan' });
    }
    res.json({ success: true, data: driver });
  });

  // -------------------------------------------------------------
  // API: Forum / Komunitas Warga
  // -------------------------------------------------------------
  app.get('/api/forum', (_req: Request, res: Response) => {
    res.json({ success: true, data: dbForumPosts });
  });

  app.post('/api/forum', (req: Request, res: Response) => {
    const { author, block, role, category, content } = req.body;
    if (!content || !author) {
      return res.status(400).json({ success: false, message: 'Penulis dan isi postingan wajib diisi' });
    }
    const newPost = {
      id: `post-${Date.now()}`,
      author,
      block: block || 'Blok Makmur',
      role: role || 'Warga',
      timestamp: 'Baru saja',
      category: category || 'Diskusi',
      content,
      likes: 0,
      commentsCount: 0,
      comments: [],
      isLiked: false,
    };
    dbForumPosts.unshift(newPost);
    res.status(201).json({ success: true, data: newPost });
  });

  app.post('/api/forum/:id/like', (req: Request, res: Response) => {
    const post = dbForumPosts.find((p: any) => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Postingan tidak ditemukan' });
    }
    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;
    res.json({ success: true, data: post });
  });

  app.post('/api/forum/:id/comment', (req: Request, res: Response) => {
    const { author, text } = req.body;
    const post = dbForumPosts.find((p: any) => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Postingan tidak ditemukan' });
    }
    const newComment = {
      author: author || 'Warga Arjawinangun',
      text,
      time: 'Baru saja',
    };
    post.comments.push(newComment);
    post.commentsCount = post.comments.length;
    res.json({ success: true, data: post });
  });

  // -------------------------------------------------------------
  // API: Profiles
  // -------------------------------------------------------------
  app.get('/api/profiles', (_req: Request, res: Response) => {
    res.json({ success: true, data: dbUsers });
  });

  app.get('/api/profiles/:roleOrId', (req: Request, res: Response) => {
    const key = req.params.roleOrId;
    let user = dbUsers[key] || Object.values(dbUsers).find((u: any) => u.id === key || u.emailOrPhone === key);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Profil tidak ditemukan' });
    }
    res.json({ success: true, data: user });
  });

  app.put('/api/profiles/:roleOrId', (req: Request, res: Response) => {
    const key = req.params.roleOrId;
    const current = dbUsers[key] || Object.values(dbUsers).find((u: any) => u.id === key);
    if (!current) {
      return res.status(404).json({ success: false, message: 'Profil tidak ditemukan' });
    }
    const updated = { ...current, ...req.body };
    dbUsers[current.role] = updated;
    res.json({ success: true, data: updated });
  });

  app.get('/api/profiles/:userId/reviews', (req: Request, res: Response) => {
    const reviews = dbUserReviews[req.params.userId] || [];
    res.json({ success: true, data: reviews });
  });

  app.post('/api/profiles/:userId/reviews', (req: Request, res: Response) => {
    const { reviewerName, reviewerRole, integrityScore, serviceScore, comment } = req.body;
    const userId = req.params.userId;
    if (!comment) {
      return res.status(400).json({ success: false, message: 'Ulasan wajib memiliki komentar' });
    }
    const newReview = {
      id: `rev-${Date.now()}`,
      reviewerName: reviewerName || 'Warga Arjawinangun',
      reviewerRole: reviewerRole || 'Warga',
      integrityScore: Number(integrityScore) || 5.0,
      serviceScore: Number(serviceScore) || 5.0,
      comment,
      date: 'Hari ini',
    };
    if (!dbUserReviews[userId]) {
      dbUserReviews[userId] = [];
    }
    dbUserReviews[userId].unshift(newReview);
    res.status(201).json({ success: true, data: newReview });
  });

  // -------------------------------------------------------------
  // API: Polling Aspirasi Desa
  // -------------------------------------------------------------
  app.get('/api/polls', (_req: Request, res: Response) => {
    res.json({ success: true, data: dbPolls });
  });

  app.post('/api/polls/:id/vote', (req: Request, res: Response) => {
    const { optionId } = req.body;
    const poll = dbPolls.find((p: any) => p.id === req.params.id);
    if (!poll) {
      return res.status(404).json({ success: false, message: 'Polling tidak ditemukan' });
    }
    const option = poll.options.find((o: any) => o.id === optionId);
    if (!option) {
      return res.status(404).json({ success: false, message: 'Pilihan tidak valid' });
    }
    option.votesCount += 1;
    poll.totalVotes += 1;
    poll.hasVoted = true;
    poll.userSelectedOptionId = optionId;
    res.json({ success: true, data: poll });
  });

  app.post('/api/polls', (req: Request, res: Response) => {
    const { title, description, category, options, createdBy, authorRole } = req.body;
    if (!title || !options || options.length < 2) {
      return res.status(400).json({ success: false, message: 'Judul dan minimal 2 opsi jawaban diperlukan' });
    }
    const newPoll = {
      id: `poll-${Date.now()}`,
      title,
      description: description || '',
      category: category || 'Infrastruktur',
      createdBy: createdBy || 'Balai Desa',
      authorRole: authorRole || 'Super Admin (Kuwu)',
      createdAt: 'Hari ini',
      endDate: '30 hari kedepan',
      status: 'Aktif',
      totalVotes: 0,
      options: options.map((opt: any, index: number) => ({
        id: `opt-${Date.now()}-${index}`,
        text: typeof opt === 'string' ? opt : opt.text,
        votesCount: 0,
      })),
    };
    dbPolls.unshift(newPoll);
    res.status(201).json({ success: true, data: newPoll });
  });

  // -------------------------------------------------------------
  // API: Layanan Utama Warga: QRIS Donasi & Infaq
  // -------------------------------------------------------------
  app.get('/api/donations/campaigns', (_req: Request, res: Response) => {
    res.json({ success: true, count: dbDonationCampaigns.length, data: dbDonationCampaigns });
  });

  app.get('/api/donations', (_req: Request, res: Response) => {
    res.json({ success: true, count: dbDonationRecords.length, data: dbDonationRecords });
  });

  app.post('/api/donations', (req: Request, res: Response) => {
    const { campaignId, donorName, amount, prayer, paymentMethod } = req.body;
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Nominal donasi harus lebih dari Rp 0' });
    }

    const campaign = dbDonationCampaigns.find((c: any) => c.id === campaignId) || dbDonationCampaigns[0];
    const newRecord = {
      id: `dn-${Date.now()}`,
      campaignId: campaign ? campaign.id : 'cmp-1',
      campaignTitle: campaign ? campaign.title : 'Kas Donasi Warga Arjawinangun',
      donorName: donorName || 'Hamba Allah',
      amount: numAmount,
      prayer: prayer || 'Semoga berkah dan bermanfaat bagi warga desa.',
      timestamp: 'Baru saja',
      paymentMethod: paymentMethod || 'QRIS Realtime',
    };

    if (campaign) {
      campaign.collectedAmount += numAmount;
      campaign.donorsCount += 1;
    }

    dbDonationRecords.unshift(newRecord);
    res.status(201).json({ success: true, data: newRecord, campaign });
  });

  // -------------------------------------------------------------
  // API: Lowongan Kerja Arjawinangun
  // -------------------------------------------------------------
  app.get('/api/loker', (req: Request, res: Response) => {
    const { category, type } = req.query;
    let list = dbJobVacancies;
    if (category && category !== 'Semua') {
      list = list.filter((j: any) => j.category === category);
    }
    if (type && type !== 'Semua') {
      list = list.filter((j: any) => j.jobType === type);
    }
    res.json({ success: true, count: list.length, data: list });
  });

  app.post('/api/loker', (req: Request, res: Response) => {
    const { title, employer, category, jobType, salary, location, description, requirements, contactPhone, contactPerson } = req.body;
    if (!title || !employer || !contactPhone) {
      return res.status(400).json({ success: false, message: 'Judul loker, nama tempat kerja, dan kontak wajib diisi' });
    }

    const newJob = {
      id: `job-${Date.now()}`,
      title,
      employer,
      category: category || 'Toko & Ritel',
      jobType: jobType || 'Penuh Waktu',
      salary: salary || 'Sesuai kesepakatan',
      location: location || 'Arjawinangun, Cirebon',
      description: description || 'Dibutuhkan tenaga kerja warga lokal yang jujur dan disiplin.',
      requirements: Array.isArray(requirements) ? requirements : ['Warga lokal Arjawinangun', 'Jujur dan rajin'],
      contactPhone,
      contactPerson: contactPerson || employer,
      postedDate: 'Baru saja',
      isOpen: true,
    };

    dbJobVacancies.unshift(newJob);
    res.status(201).json({ success: true, data: newJob });
  });

  // -------------------------------------------------------------
  // API: Tani & Ikan (Toko, Katalog, Rating & Ulasan)
  // -------------------------------------------------------------
  app.get('/api/tani-ikan', (req: Request, res: Response) => {
    const { type } = req.query;
    let list = dbTaniIkanVendors;
    if (type && type !== 'semua') {
      list = list.filter((t: any) => t.type === type);
    }
    res.json({ success: true, count: list.length, data: list });
  });

  app.get('/api/tani-ikan/:id', (req: Request, res: Response) => {
    const vendor = dbTaniIkanVendors.find((t: any) => t.id === req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Toko tani & ikan tidak ditemukan' });
    }
    res.json({ success: true, data: vendor });
  });

  app.post('/api/tani-ikan/:id/review', (req: Request, res: Response) => {
    const vendor = dbTaniIkanVendors.find((t: any) => t.id === req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Toko tani & ikan tidak ditemukan' });
    }
    const { reviewerName, rating, comment } = req.body;
    if (!comment) {
      return res.status(400).json({ success: false, message: 'Komentar ulasan wajib diisi' });
    }
    const newReview = {
      id: `trv-${Date.now()}`,
      reviewerName: reviewerName || 'Warga / Petani',
      rating: Number(rating) || 5,
      comment,
      date: 'Baru saja',
    };
    if (!vendor.reviews) vendor.reviews = [];
    vendor.reviews.unshift(newReview);

    // Recalculate average rating
    const totalRating = vendor.reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    vendor.rating = Number((totalRating / vendor.reviews.length).toFixed(1));

    res.status(201).json({ success: true, data: newReview, vendor });
  });

  // -------------------------------------------------------------
  // API: Hall of Fame (Panggung Kehormatan & Usulan Tokoh Warga)
  // -------------------------------------------------------------
  app.get('/api/hall-of-fame', (req: Request, res: Response) => {
    const { category, search } = req.query;
    let list = dbHallOfFame;

    if (category && category !== 'Semua') {
      list = list.filter((item: any) => item.category === category);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(
        (item: any) =>
          item.name.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.origin.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      data: list,
      nominations: dbHallOfFameNominations,
    });
  });

  app.post('/api/hall-of-fame/nominate', (req: Request, res: Response) => {
    const {
      nomineeName,
      category,
      origin,
      title,
      achievements,
      reason,
      proposerName,
      proposerPhone,
      proposerRtRw,
    } = req.body;

    if (!nomineeName || !category || !achievements || !proposerName) {
      return res.status(400).json({
        success: false,
        message: 'Mohon lengkapi nama calon, kategori, prestasi, dan nama pengusul.',
      });
    }

    const newNomination = {
      id: `nom-${Date.now()}`,
      nomineeName,
      category,
      origin: origin || 'Kecamatan Arjawinangun',
      title: title || `Sosok Penggerak Kategori ${category}`,
      achievements,
      reason: reason || 'Diakui dan dibanggakan oleh tetangga sekitar.',
      proposerName,
      proposerPhone: proposerPhone || '-',
      proposerRtRw: proposerRtRw || 'Warga Arjawinangun',
      createdAt: 'Hari ini',
      status: 'Menunggu Verifikasi Tim Desa',
      supportVotes: 1,
      hasVoted: true,
    };

    dbHallOfFameNominations.unshift(newNomination);

    // Also optionally append as an 'usulan_warga' item in Hall of Fame if desired
    const hallItem = {
      id: `hof-nom-${Date.now()}`,
      name: nomineeName,
      category,
      title: title || `Tokoh Inspiratif Usulan Warga: ${category}`,
      origin: origin || 'Arjawinangun, Cirebon',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      story: reason || achievements,
      achievements: [achievements],
      year: '2024',
      appreciationsCount: 1,
      hasAppreciated: true,
      nominatedBy: `Diusulkan oleh ${proposerName} (${proposerRtRw || 'Warga'})`,
      verifiedStatus: 'usulan_warga',
      comments: [
        {
          id: `c-init-${Date.now()}`,
          author: proposerName,
          role: 'Pengusul',
          text: `Mengusulkan beliau karena: ${reason || achievements}`,
          date: 'Hari ini',
        },
      ],
    };
    dbHallOfFame.push(hallItem);

    res.status(201).json({
      success: true,
      message: 'Usulan sosok berprestasi berhasil diajukan dan masuk ke daftar verifikasi desa!',
      data: newNomination,
      hallItem,
    });
  });

  app.post('/api/hall-of-fame/:id/appreciate', (req: Request, res: Response) => {
    const item = dbHallOfFame.find((h: any) => h.id === req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Tokoh tidak ditemukan' });
    }

    item.hasAppreciated = !item.hasAppreciated;
    item.appreciationsCount = item.hasAppreciated
      ? (item.appreciationsCount || 0) + 1
      : Math.max(0, (item.appreciationsCount || 0) - 1);

    res.json({
      success: true,
      hasAppreciated: item.hasAppreciated,
      appreciationsCount: item.appreciationsCount,
    });
  });

  app.post('/api/hall-of-fame/:id/comment', (req: Request, res: Response) => {
    const item = dbHallOfFame.find((h: any) => h.id === req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Tokoh tidak ditemukan' });
    }

    const { author = 'Warga Arjawinangun', role = 'Warga', text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Tuliskan ulasan/testimoni penghargaan Anda.' });
    }

    const newComment = {
      id: `c-${Date.now()}`,
      author,
      role,
      text: text.trim(),
      date: 'Baru saja',
    };

    if (!item.comments) item.comments = [];
    item.comments.unshift(newComment);

    res.status(201).json({
      success: true,
      data: newComment,
    });
  });

  app.post('/api/hall-of-fame/nomination/:id/vote', (req: Request, res: Response) => {
    const nom = dbHallOfFameNominations.find((n: any) => n.id === req.params.id);
    if (!nom) {
      return res.status(404).json({ success: false, message: 'Usulan tidak ditemukan' });
    }

    nom.hasVoted = !nom.hasVoted;
    nom.supportVotes = nom.hasVoted
      ? (nom.supportVotes || 0) + 1
      : Math.max(0, (nom.supportVotes || 0) - 1);

    res.json({
      success: true,
      hasVoted: nom.hasVoted,
      supportVotes: nom.supportVotes,
    });
  });

  // -------------------------------------------------------------
  // API: Persetujuan & Publikasi Usulan Hall of Fame oleh Admin
  // -------------------------------------------------------------
  app.post('/api/hall-of-fame/nomination/:id/approve', (req: Request, res: Response) => {
    const { adminName = 'Admin Balai Desa' } = req.body;
    const nom = dbHallOfFameNominations.find((n: any) => n.id === req.params.id);
    if (!nom) {
      return res.status(404).json({ success: false, message: 'Usulan tidak ditemukan' });
    }

    nom.status = 'Disetujui';
    nom.verifiedAt = 'Hari ini';
    nom.verifiedBy = adminName;

    // Create in-app notification for the citizen/proposer
    const notif = {
      id: `notif-${Date.now()}`,
      type: 'hall_of_fame_approved',
      title: 'Usulan Tokoh Disetujui Tim Desa! 🏆',
      message: `Kabar baik! Usulan Anda untuk "${nom.nomineeName}" kategori ${nom.category} telah ditinjau dan DISETUJUI oleh ${adminName}.`,
      timestamp: 'Baru saja',
      read: false,
      category: 'Hall of Fame',
      actionLink: {
        screen: 'hall_of_fame',
        targetId: nom.id,
        label: 'Buka Hall of Fame',
      },
      meta: {
        nomineeName: nom.nomineeName,
        category: nom.category,
        adminName,
        status: 'Disetujui',
      },
    };
    dbNotifications.unshift(notif);

    res.json({
      success: true,
      message: `Usulan "${nom.nomineeName}" berhasil disetujui. Notifikasi telah dikirim ke warga pengusul.`,
      nomination: nom,
      notification: notif,
    });
  });

  app.post('/api/hall-of-fame/nomination/:id/publish', (req: Request, res: Response) => {
    const { adminName = 'Admin Balai Desa' } = req.body;
    const nom = dbHallOfFameNominations.find((n: any) => n.id === req.params.id);
    if (!nom) {
      return res.status(404).json({ success: false, message: 'Usulan tidak ditemukan' });
    }

    nom.status = 'Dipublikasikan';
    nom.verifiedAt = 'Hari ini';
    nom.verifiedBy = adminName;

    // Also update or add to official verified list in dbHallOfFame
    let existingItem = dbHallOfFame.find((h: any) => h.name.toLowerCase() === nom.nomineeName.toLowerCase());
    if (existingItem) {
      existingItem.verifiedStatus = 'terverifikasi';
    } else {
      dbHallOfFame.unshift({
        id: `hof-pub-${Date.now()}`,
        name: nom.nomineeName,
        category: nom.category,
        title: nom.title || `Tokoh Inspiratif ${nom.category}`,
        origin: nom.origin,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        story: nom.reason || nom.achievements,
        achievements: [nom.achievements],
        year: '2024',
        appreciationsCount: nom.supportVotes || 1,
        hasAppreciated: false,
        nominatedBy: `Diusulkan oleh ${nom.proposerName} (${nom.proposerRtRw})`,
        verifiedStatus: 'terverifikasi',
        comments: [
          {
            id: `c-pub-${Date.now()}`,
            author: adminName,
            role: 'Balai Desa',
            text: 'Resmi diverifikasi dan dipublikasikan ke Galeri Kehormatan Hall of Fame Desa Arjawinangun.',
            date: 'Baru saja',
          },
        ],
      });
    }

    // Create in-app notification for the citizen
    const notif = {
      id: `notif-${Date.now()}`,
      type: 'hall_of_fame_published',
      title: 'Tokoh Usulan Anda Resmi Dipublikasikan! 🌟',
      message: `Selamat! "${nom.nomineeName}" kini resmi dipublikasikan di Galeri Kehormatan Hall of Fame Desa Arjawinangun. Seluruh warga kini dapat melihat profil dan memberikan apresiasi!`,
      timestamp: 'Baru saja',
      read: false,
      category: 'Hall of Fame',
      actionLink: {
        screen: 'hall_of_fame',
        targetId: nom.id,
        label: 'Lihat Profil Tokoh',
      },
      meta: {
        nomineeName: nom.nomineeName,
        category: nom.category,
        adminName,
        status: 'Dipublikasikan',
      },
    };
    dbNotifications.unshift(notif);

    res.json({
      success: true,
      message: `"${nom.nomineeName}" resmi dipublikasikan ke Hall of Fame! Notifikasi telah dikirim ke warga pengusul.`,
      nomination: nom,
      notification: notif,
    });
  });

  // Helper endpoint to simulate receiving an approval/publication notification
  app.post('/api/hall-of-fame/nomination/simulate-approval', (req: Request, res: Response) => {
    const {
      nomineeName = 'Kang Maman Suparman',
      category = 'Relawan Sosial',
      action = 'publish', // 'approve' | 'publish'
    } = req.body;

    const isPublish = action === 'publish';
    const notif = {
      id: `notif-${Date.now()}`,
      type: isPublish ? 'hall_of_fame_published' : 'hall_of_fame_approved',
      title: isPublish
        ? 'Tokoh Usulan Anda Resmi Dipublikasikan! 🌟'
        : 'Usulan Tokoh Disetujui Tim Desa! 🏆',
      message: isPublish
        ? `Selamat! Usulan Anda untuk "${nomineeName}" (${category}) telah disetujui dan RESMI DIPUBLIKASIKAN ke Galeri Kehormatan Desa Arjawinangun!`
        : `Kabar baik! Usulan Anda untuk "${nomineeName}" (${category}) telah ditinjau dan DISETUJUI oleh Tim Verifikasi Balai Desa.`,
      timestamp: 'Baru saja',
      read: false,
      category: 'Hall of Fame',
      actionLink: {
        screen: 'hall_of_fame',
        label: 'Buka Hall of Fame',
      },
      meta: {
        nomineeName,
        category,
        status: isPublish ? 'Dipublikasikan' : 'Disetujui',
        adminName: 'Admin Balai Desa Arjawinangun',
      },
    };

    dbNotifications.unshift(notif);

    res.json({
      success: true,
      message: 'Simulasi notifikasi persetujuan berhasil dibuat!',
      notification: notif,
    });
  });

  // -------------------------------------------------------------
  // API: Pusat Notifikasi Dalam Aplikasi
  // -------------------------------------------------------------
  app.get('/api/notifications', (req: Request, res: Response) => {
    const unreadCount = dbNotifications.filter((n: any) => !n.read).length;
    res.json({
      success: true,
      unreadCount,
      data: dbNotifications,
    });
  });

  app.post('/api/notifications/mark-read', (req: Request, res: Response) => {
    const { id } = req.body;
    if (id) {
      const notif = dbNotifications.find((n: any) => n.id === id);
      if (notif) notif.read = true;
    } else {
      // Mark all as read
      dbNotifications.forEach((n: any) => {
        n.read = true;
      });
    }

    const unreadCount = dbNotifications.filter((n: any) => !n.read).length;
    res.json({
      success: true,
      unreadCount,
      data: dbNotifications,
    });
  });

  app.post('/api/notifications/clear', (req: Request, res: Response) => {
    dbNotifications = [];
    res.json({ success: true, unreadCount: 0, data: [] });
  });

  // -------------------------------------------------------------
  // API: Login Langsung (Tanpa OTP WhatsApp untuk Tab Masuk)
  // -------------------------------------------------------------
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { phoneOrUsername, role = 'pelanggan' } = req.body;
    const cleanPhone = (phoneOrUsername || '').replace(/[^0-9+]/g, '');

    // Search user in dbUsers
    let user = Object.values(dbUsers).find(
      (u: any) =>
        (cleanPhone && u.emailOrPhone && u.emailOrPhone.replace(/[^0-9]/g, '') === cleanPhone) ||
        (phoneOrUsername && u.name && u.name.toLowerCase().includes(phoneOrUsername.toLowerCase()))
    );

    if (!user) {
      user = dbUsers[role] || dbUsers.pelanggan;
    }

    res.json({
      success: true,
      message: 'Berhasil masuk ke akun',
      user,
      token: `direct-login-token-${Date.now()}`,
    });
  });

  // -------------------------------------------------------------
  // API: WhatsApp Authentication Flow (Kirim & Verifikasi OTP WA)
  // -------------------------------------------------------------
  app.post('/api/auth/whatsapp/send-otp', (req: Request, res: Response) => {
    const { phone, purpose = 'login' } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Nomor WhatsApp wajib diisi' });
    }

    // Clean phone number
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 9) {
      return res.status(400).json({ success: false, message: 'Format nomor WhatsApp tidak valid' });
    }

    // Generate random 6 digit OTP (e.g. 829104)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    activeOtpSessions.set(cleanPhone, { code: otp, expiresAt, role: req.body.role });

    // Check if user exists
    const existingUser = Object.values(dbUsers).find(
      (u: any) => u.emailOrPhone.replace(/[^0-9]/g, '') === cleanPhone.replace(/[^0-9]/g, '')
    );

    res.json({
      success: true,
      message: `Kode verifikasi WhatsApp berhasil dikirim ke ${cleanPhone}`,
      phone: cleanPhone,
      otpPreview: otp, // Returned for dev preview simulation so user sees the WhatsApp code instantly
      expiresInSeconds: 300,
      isRegistered: !!existingUser,
      existingUser: existingUser || null,
      purpose,
    });
  });

  app.post('/api/auth/whatsapp/verify-otp', (req: Request, res: Response) => {
    const { phone, otp, role = 'pelanggan', newUserData } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Nomor WhatsApp dan Kode OTP wajib diisi' });
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const session = activeOtpSessions.get(cleanPhone);

    // Accept real generated OTP or universal testing master code '123456'
    const isValidCode = (session && session.code === otp && Date.now() < session.expiresAt) || otp === '123456' || (session && session.code === otp);

    if (!isValidCode) {
      return res.status(400).json({
        success: false,
        message: 'Kode OTP WhatsApp salah atau sudah kedaluwarsa. Silakan periksa kembali atau kirim ulang.',
      });
    }

    // Clean session
    activeOtpSessions.delete(cleanPhone);

    // Find existing user by phone
    let user = Object.values(dbUsers).find(
      (u: any) => u.emailOrPhone.replace(/[^0-9]/g, '') === cleanPhone.replace(/[^0-9]/g, '')
    );

    let isNewUser = false;
    if (!user) {
      // Register new user
      isNewUser = true;
      const assignedRole = role || 'pelanggan';
      const defaultName = newUserData?.name || `Warga (${cleanPhone.slice(-4)})`;
      const newUser = {
        id: `usr-wa-${Date.now()}`,
        name: defaultName,
        role: assignedRole,
        roleTitle: assignedRole === 'mitra' ? 'Mitra Driver / Jasa' : assignedRole === 'merchant' ? 'Pedagang Pasar' : 'Warga Terverifikasi',
        emailOrPhone: cleanPhone,
        location: newUserData?.location || 'Blok Makmur, Arjawinangun',
        avatar: newUserData?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        status: 'aktif',
        description: newUserData?.description || 'Warga terdaftar melalui verifikasi WhatsApp resmi Balai Desa.',
        verifiedBadge: 'Verifikasi WhatsApp Desa',
        joinedDate: 'Oktober 2026',
        nik: newUserData?.nik || '320914' + Math.floor(1000000000 + Math.random() * 9000000000),
        rtRw: newUserData?.rtRw || 'RT 03 / RW 02',
        integrityRating: 5.0,
        serviceRating: 5.0,
        totalReviewsCount: 1,
        reputationBadge: 'Warga Terverifikasi WA',
      };
      dbUsers[assignedRole] = newUser;
      user = newUser;
    }

    res.json({
      success: true,
      message: 'Autentikasi WhatsApp Berhasil',
      user,
      isNewUser,
      token: `wa-auth-token-${cleanPhone}-${Date.now()}`,
    });
  });

  return app;
}

async function startServer() {
  const app = await createApp();
  const PORT = Number(process.env.PORT) || 3000;

  // Mount Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Wong Arjawinangun] Full-stack Server running on http://0.0.0.0:${PORT}`);
  });
}

// Start if executed directly
if (process.argv[1] && process.argv[1].endsWith('server.ts')) {
  startServer();
}
