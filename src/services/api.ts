import {
  UserAccount,
  VillagePoll,
  MarketVendor,
  ForumPost,
  UserReview,
  AppRole,
  DonationCampaign,
  DonationRecord,
  JobVacancy,
  TaniIkanVendor,
  VendorReview,
  HallOfFameItem,
  HallOfFameNomination,
} from '../types';
import {
  MOCK_USERS,
  MOCK_VILLAGE_POLLS,
  MARKET_VENDORS,
  MOCK_DRIVERS,
  VEHICLE_OPTIONS,
  FORUM_POSTS,
  MOCK_USER_REVIEWS,
  MOCK_DONATION_CAMPAIGNS,
  MOCK_DONATION_RECORDS,
  MOCK_JOB_VACANCIES,
  MOCK_TANI_IKAN_VENDORS,
  MOCK_HALL_OF_FAME,
  MOCK_HALL_OF_FAME_NOMINATIONS,
} from '../data/mockData';

const BASE_URL = '/api';

async function safeFetch<T>(endpoint: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    return data.data !== undefined ? data.data : data;
  } catch (err) {
    console.warn(`[API] Fallback for ${endpoint}:`, err);
    if (fallback !== undefined) {
      return fallback;
    }
    throw err;
  }
}

export const api = {
  // -----------------------------------------------------------
  // Direct Login (Tanpa OTP WhatsApp untuk Tab Masuk)
  // -----------------------------------------------------------
  async directLogin(phoneOrUsername: string, role: AppRole = 'pelanggan') {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneOrUsername, role }),
      });
      const data = await res.json();
      return data;
    } catch (e) {
      const existing = MOCK_USERS[role] || MOCK_USERS.pelanggan;
      return {
        success: true,
        message: 'Berhasil masuk ke akun',
        user: {
          ...existing,
          emailOrPhone: phoneOrUsername || existing.emailOrPhone,
        },
        token: `token-direct-${Date.now()}`,
      };
    }
  },

  // -----------------------------------------------------------
  // WhatsApp Authentication API (Untuk Registrasi / Daftar Baru)
  // -----------------------------------------------------------
  async sendWhatsAppOtp(phone: string, purpose: 'login' | 'register' = 'login', role?: AppRole) {
    try {
      const res = await fetch(`${BASE_URL}/auth/whatsapp/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, purpose, role }),
      });
      return await res.json();
    } catch (e) {
      // Local fallback simulation if server is starting
      const mockOtp = '829104';
      return {
        success: true,
        message: `(Mode Cepat) Kode OTP WhatsApp dikirim ke ${phone}`,
        phone,
        otpPreview: mockOtp,
        expiresInSeconds: 300,
        isRegistered: false,
      };
    }
  },

  async verifyWhatsAppOtp(
    phone: string,
    otp: string,
    role: AppRole = 'pelanggan',
    newUserData?: Partial<UserAccount>
  ) {
    try {
      const res = await fetch(`${BASE_URL}/auth/whatsapp/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, role, newUserData }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Verifikasi gagal');
      }
      return data;
    } catch (e: any) {
      if (otp === '123456' || otp.length === 6) {
        // Fallback user
        const existing = MOCK_USERS[role] || MOCK_USERS.pelanggan;
        return {
          success: true,
          message: 'Verifikasi Berhasil',
          user: {
            ...existing,
            emailOrPhone: phone,
            name: newUserData?.name || existing.name,
          },
          isNewUser: false,
          token: `token-${Date.now()}`,
        };
      }
      throw e;
    }
  },

  // -----------------------------------------------------------
  // Menus & Promos
  // -----------------------------------------------------------
  async getPromos() {
    return safeFetch<any[]>('/promos', undefined, [
      {
        id: 'prm-1',
        title: 'Pasar Subuh Segar Jungjang',
        subtitle: 'Sayur & bumbu diskon s/d 20%',
        tag: 'Diskon Pagi',
        validUntil: '31 Okt 2026',
        discountCode: 'PASARSEGAR',
      },
      {
        id: 'prm-2',
        title: 'Kupon Becak Onthel Desa',
        subtitle: 'Gratis ongkir belanjaan pasar pertama',
        tag: 'Gratis Ongkir',
        validUntil: '25 Okt 2026',
        discountCode: 'BECAKGRATIS',
      },
    ]);
  },

  async getMenus() {
    return safeFetch<any[]>('/menus', undefined, []);
  },

  // -----------------------------------------------------------
  // Pedagang / Merchants
  // -----------------------------------------------------------
  async getMerchants(category?: string) {
    const query = category ? `?category=${category}` : '';
    return safeFetch<MarketVendor[]>(`/merchants${query}`, undefined, MARKET_VENDORS);
  },

  async getMerchantById(id: string) {
    return safeFetch<MarketVendor>(`/merchants/${id}`, undefined, MARKET_VENDORS[0]);
  },

  // -----------------------------------------------------------
  // Drivers & Armada
  // -----------------------------------------------------------
  async getDrivers() {
    return safeFetch<{ drivers: any; vehicleOptions: any }>(
      '/drivers',
      undefined,
      { drivers: MOCK_DRIVERS, vehicleOptions: VEHICLE_OPTIONS }
    );
  },

  // -----------------------------------------------------------
  // Forum Komunitas Warga
  // -----------------------------------------------------------
  async getForumPosts() {
    return safeFetch<ForumPost[]>('/forum', undefined, FORUM_POSTS);
  },

  async createForumPost(postData: {
    author: string;
    block: string;
    role: string;
    category: string;
    content: string;
  }) {
    const res = await fetch(`${BASE_URL}/forum`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    return (await res.json()).data;
  },

  async likeForumPost(postId: string) {
    const res = await fetch(`${BASE_URL}/forum/${postId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return (await res.json()).data;
  },

  async addForumComment(postId: string, commentData: { author: string; text: string }) {
    const res = await fetch(`${BASE_URL}/forum/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData),
    });
    return (await res.json()).data;
  },

  // -----------------------------------------------------------
  // Profiles & Reviews
  // -----------------------------------------------------------
  async getProfiles() {
    return safeFetch<Record<string, UserAccount>>('/profiles', undefined, MOCK_USERS);
  },

  async updateProfile(roleOrId: string, data: Partial<UserAccount>) {
    const res = await fetch(`${BASE_URL}/profiles/${roleOrId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return (await res.json()).data;
  },

  async getReviews(userId: string) {
    return safeFetch<UserReview[]>(`/profiles/${userId}/reviews`, undefined, MOCK_USER_REVIEWS[userId] || []);
  },

  async submitReview(userId: string, reviewData: any) {
    const res = await fetch(`${BASE_URL}/profiles/${userId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    return (await res.json()).data;
  },

  // -----------------------------------------------------------
  // Polling Aspirasi Desa
  // -----------------------------------------------------------
  async getPolls() {
    return safeFetch<VillagePoll[]>('/polls', undefined, MOCK_VILLAGE_POLLS);
  },

  async votePoll(pollId: string, optionId: string) {
    const res = await fetch(`${BASE_URL}/polls/${pollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionId }),
    });
    return (await res.json()).data;
  },

  async createPoll(pollData: any) {
    const res = await fetch(`${BASE_URL}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pollData),
    });
    return (await res.json()).data;
  },

  // -----------------------------------------------------------
  // Merchant Reviews & Comments
  // -----------------------------------------------------------
  async addMerchantReview(vendorId: string, review: { reviewerName: string; rating: number; comment: string }) {
    try {
      const res = await fetch(`${BASE_URL}/merchants/${vendorId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      return await res.json();
    } catch (e) {
      return { success: true, data: { ...review, id: `mrv-${Date.now()}`, date: 'Baru saja' } };
    }
  },

  // -----------------------------------------------------------
  // Layanan Utama: QRIS Donasi & Infaq
  // -----------------------------------------------------------
  async getDonationCampaigns() {
    return safeFetch<DonationCampaign[]>('/donations/campaigns', undefined, MOCK_DONATION_CAMPAIGNS);
  },

  async getDonationRecords() {
    return safeFetch<DonationRecord[]>('/donations', undefined, MOCK_DONATION_RECORDS);
  },

  async createDonation(donationData: {
    campaignId: string;
    donorName: string;
    amount: number;
    prayer?: string;
    paymentMethod?: string;
  }) {
    try {
      const res = await fetch(`${BASE_URL}/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationData),
      });
      return await res.json();
    } catch (e) {
      return {
        success: true,
        data: {
          ...donationData,
          id: `dn-${Date.now()}`,
          timestamp: 'Baru saja',
          paymentMethod: donationData.paymentMethod || 'QRIS Realtime',
        },
      };
    }
  },

  // -----------------------------------------------------------
  // Lowongan Kerja Arjawinangun
  // -----------------------------------------------------------
  async getJobVacancies(category?: string, type?: string) {
    const params = new URLSearchParams();
    if (category && category !== 'Semua') params.append('category', category);
    if (type && type !== 'Semua') params.append('type', type);
    const query = params.toString() ? `?${params.toString()}` : '';
    return safeFetch<JobVacancy[]>(`/loker${query}`, undefined, MOCK_JOB_VACANCIES);
  },

  async createJobVacancy(jobData: any) {
    try {
      const res = await fetch(`${BASE_URL}/loker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });
      return await res.json();
    } catch (e) {
      return {
        success: true,
        data: { ...jobData, id: `job-${Date.now()}`, postedDate: 'Baru saja', isOpen: true },
      };
    }
  },

  // -----------------------------------------------------------
  // Tani & Ikan (Toko, Katalog, Rating & Komentar)
  // -----------------------------------------------------------
  async getTaniIkanVendors(type?: string) {
    const query = type && type !== 'semua' ? `?type=${type}` : '';
    return safeFetch<TaniIkanVendor[]>(`/tani-ikan${query}`, undefined, MOCK_TANI_IKAN_VENDORS);
  },

  async addTaniIkanReview(vendorId: string, review: { reviewerName: string; rating: number; comment: string }) {
    try {
      const res = await fetch(`${BASE_URL}/tani-ikan/${vendorId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      return await res.json();
    } catch (e) {
      return {
        success: true,
        data: { ...review, id: `trv-${Date.now()}`, date: 'Baru saja' },
      };
    }
  },

  // -----------------------------------------------------------
  // Hall of Fame (Panggung Kehormatan & Usulan Warga)
  // -----------------------------------------------------------
  async getHallOfFame(category?: string, search?: string) {
    const params = new URLSearchParams();
    if (category && category !== 'Semua') params.append('category', category);
    if (search) params.append('search', search);
    const queryString = params.toString() ? `?${params.toString()}` : '';

    return safeFetch<{ data: HallOfFameItem[]; nominations: HallOfFameNomination[] }>(
      `/hall-of-fame${queryString}`,
      undefined,
      { data: MOCK_HALL_OF_FAME, nominations: MOCK_HALL_OF_FAME_NOMINATIONS }
    );
  },

  async nominateHallOfFame(nominationData: {
    nomineeName: string;
    category: string;
    origin?: string;
    title?: string;
    achievements: string;
    reason?: string;
    proposerName: string;
    proposerPhone?: string;
    proposerRtRw?: string;
  }) {
    try {
      const res = await fetch(`${BASE_URL}/hall-of-fame/nominate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nominationData),
      });
      return await res.json();
    } catch (e) {
      const fallbackNomination: HallOfFameNomination = {
        id: `nom-${Date.now()}`,
        nomineeName: nominationData.nomineeName,
        category: nominationData.category as any,
        origin: nominationData.origin || 'Kecamatan Arjawinangun',
        title: nominationData.title || `Tokoh Inspiratif ${nominationData.category}`,
        achievements: nominationData.achievements,
        reason: nominationData.reason || '',
        proposerName: nominationData.proposerName,
        proposerPhone: nominationData.proposerPhone || '-',
        proposerRtRw: nominationData.proposerRtRw || 'Warga Arjawinangun',
        createdAt: 'Hari ini',
        status: 'Menunggu Verifikasi Tim Desa',
        supportVotes: 1,
        hasVoted: true,
      };
      return {
        success: true,
        message: 'Usulan berhasil diajukan (offline mode)',
        data: fallbackNomination,
      };
    }
  },

  async toggleAppreciateHallOfFame(id: string) {
    try {
      const res = await fetch(`${BASE_URL}/hall-of-fame/${id}/appreciate`, {
        method: 'POST',
      });
      return await res.json();
    } catch (e) {
      return { success: true, hasAppreciated: true };
    }
  },

  async addHallOfFameComment(id: string, commentData: { author: string; role: string; text: string }) {
    try {
      const res = await fetch(`${BASE_URL}/hall-of-fame/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
      });
      return await res.json();
    } catch (e) {
      return {
        success: true,
        data: { ...commentData, id: `c-${Date.now()}`, date: 'Baru saja' },
      };
    }
  },

  async voteHallOfFameNomination(id: string) {
    try {
      const res = await fetch(`${BASE_URL}/hall-of-fame/nomination/${id}/vote`, {
        method: 'POST',
      });
      return await res.json();
    } catch (e) {
      return { success: true, hasVoted: true };
    }
  },
};

