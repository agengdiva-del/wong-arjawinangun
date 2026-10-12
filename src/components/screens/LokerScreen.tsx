import React, { useState, useEffect } from 'react';
import { JobVacancy } from '../../types';
import { MOCK_JOB_VACANCIES } from '../../data/mockData';
import { api } from '../../services/api';
import {
  ArrowLeft,
  Briefcase,
  Search,
  MapPin,
  Clock,
  Banknote,
  Phone,
  MessageCircle,
  PlusCircle,
  CheckCircle2,
  X,
  Building,
  UserCheck,
  Send,
  ChevronRight,
  Filter
} from 'lucide-react';

interface LokerScreenProps {
  onBack: () => void;
  isWireframe?: boolean;
}

export const LokerScreen: React.FC<LokerScreenProps> = ({
  onBack,
  isWireframe = false,
}) => {
  const [jobs, setJobs] = useState<JobVacancy[]>(MOCK_JOB_VACANCIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedType, setSelectedType] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);

  // Post new job modal states
  const [showPostModal, setShowPostModal] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postEmployer, setPostEmployer] = useState('');
  const [postCategory, setPostCategory] = useState<JobVacancy['category']>('Toko & Ritel');
  const [postJobType, setPostJobType] = useState<JobVacancy['jobType']>('Penuh Waktu');
  const [postSalary, setPostSalary] = useState('');
  const [postLocation, setPostLocation] = useState('Arjawinangun, Cirebon');
  const [postDesc, setPostDesc] = useState('');
  const [postRequirements, setPostRequirements] = useState('');
  const [postPhone, setPostPhone] = useState('0812-3456-7890');
  const [postContactPerson, setPostContactPerson] = useState('');
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  const categories = [
    'Semua',
    'Toko & Ritel',
    'Bengkel & Otomotif',
    'UMKM & Kuliner',
    'Konveksi',
    'Driver & Kurir',
    'Bangunan & Lapangan',
  ];

  const jobTypes = ['Semua', 'Penuh Waktu', 'Harian', 'Borongan', 'Paruh Waktu'];

  useEffect(() => {
    api.getJobVacancies().then((data) => {
      if (data && data.length > 0) setJobs(data);
    }).catch(() => {});
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesCategory = selectedCategory === 'Semua' || job.category === selectedCategory;
    const matchesType = selectedType === 'Semua' || job.jobType === selectedType;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.employer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postEmployer.trim() || !postPhone.trim()) return;

    setIsSubmittingJob(true);
    const reqArray = postRequirements
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const newJob: JobVacancy = {
      id: `job-${Date.now()}`,
      title: postTitle.trim(),
      employer: postEmployer.trim(),
      category: postCategory,
      jobType: postJobType,
      salary: postSalary.trim() || 'Sesuai kesepakatan',
      location: postLocation.trim() || 'Arjawinangun, Cirebon',
      description: postDesc.trim() || 'Dibutuhkan segera tenaga kerja jujur dan disiplin.',
      requirements: reqArray.length > 0 ? reqArray : ['Warga lokal diutamakan', 'Jujur dan rajin'],
      contactPhone: postPhone.trim(),
      contactPerson: postContactPerson.trim() || postEmployer.trim(),
      postedDate: 'Baru saja',
      isOpen: true,
    };

    try {
      await api.createJobVacancy(newJob);
      setJobs([newJob, ...jobs]);
      setPostSuccess(true);
      setTimeout(() => {
        setPostSuccess(false);
        setShowPostModal(false);
        // reset form
        setPostTitle('');
        setPostEmployer('');
        setPostSalary('');
        setPostDesc('');
        setPostRequirements('');
      }, 1500);
    } catch (err) {
      console.warn('Failed to post job:', err);
    } finally {
      setIsSubmittingJob(false);
    }
  };

  return (
    <div className={`min-h-full flex flex-col justify-between ${isWireframe ? 'bg-zinc-50' : 'bg-slate-50'}`}>
      {/* Top Header */}
      <div className={`p-4 border-b ${isWireframe ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-red-700 text-white border-red-800'}`}>
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft size={16} />
            <span>Kembali</span>
          </button>
          <div className="text-center">
            <h2 className="text-sm font-black tracking-tight">Lowongan Kerja Arjawinangun</h2>
            <p className="text-[10px] text-red-100 font-medium">Loker Lokal & Harian Desa</p>
          </div>
          <button
            onClick={() => setShowPostModal(true)}
            className="px-2.5 py-1 bg-white text-red-700 hover:bg-red-50 text-[11px] font-black rounded-lg transition-colors flex items-center gap-1 shadow-xs"
          >
            <PlusCircle size={13} />
            <span>Pasang</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-4 flex-1 text-left overflow-y-auto space-y-3.5">
        {/* Banner Welcome Loker */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-2xl border border-red-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Briefcase size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-800">Cari Kerja Dekat Rumah</h4>
            <p className="text-[11px] text-slate-600 leading-snug">
              Temukan lowongan toko, bengkel, konveksi, dan kurir se-Arjawinangun tanpa perantara.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kasir toko, mekanik, supir, jahit..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="space-y-1.5">
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedCategory === cat
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Job Type Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
            {jobTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2.5 py-1 rounded-lg font-medium shrink-0 transition-all ${
                  selectedType === type
                    ? 'bg-slate-800 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Job Vacancies List */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Ditemukan {filteredJobs.length} Lowongan Aktif</span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              Bisa Langsung Chat WA
            </span>
          </div>

          {filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-xs hover:border-red-300 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded">
                      {job.category}
                    </span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {job.jobType}
                    </span>
                  </div>
                  <h3 className="text-xs font-black text-slate-900 group-hover:text-red-700 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5 flex items-center gap-1">
                    <Building size={11} className="text-slate-400 shrink-0" />
                    <span>{job.employer}</span>
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{job.postedDate}</span>
              </div>

              {/* Salary & Location Info */}
              <div className="p-2 bg-slate-50 rounded-xl space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold">
                  <Banknote size={13} className="text-emerald-600" />
                  <span className="tabular-nums">{job.salary}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin size={12} className="text-slate-400" />
                  <span className="truncate">{job.location}</span>
                </div>
              </div>

              {/* Requirements Preview */}
              <div className="flex flex-wrap gap-1 pt-0.5">
                {job.requirements.slice(0, 2).map((req, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium"
                  >
                    ✓ {req}
                  </span>
                ))}
                {job.requirements.length > 2 && (
                  <span className="text-[10px] text-slate-400">
                    +{job.requirements.length - 2} lainnya
                  </span>
                )}
              </div>

              {/* Bottom Apply Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Kontak: {job.contactPerson}
                </span>
                <span className="text-red-700 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Detail & Lamar <ChevronRight size={13} />
                </span>
              </div>
            </div>
          ))}

          {filteredJobs.length === 0 && (
            <div className="text-center py-8 bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
              <p className="text-xs text-slate-500">Tidak ada lowongan yang sesuai kriteria pencarian.</p>
              <button
                onClick={() => {
                  setSelectedCategory('Semua');
                  setSelectedType('Semua');
                  setSearchQuery('');
                }}
                className="text-xs text-red-700 font-bold underline"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL: LIHAT DETAIL & LAMAR PEKERJAAN */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full text-left shadow-2xl border border-slate-100 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto space-y-3.5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded">
                  {selectedJob.category} · {selectedJob.jobType}
                </span>
                <h3 className="text-sm font-black text-slate-900 mt-1">{selectedJob.title}</h3>
                <p className="text-xs text-slate-600 font-medium">{selectedJob.employer}</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            {/* Salary & Address Highlights */}
            <div className="bg-red-50/60 p-3 rounded-2xl border border-red-100 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <Banknote size={15} className="text-emerald-700 shrink-0" />
                <span className="font-extrabold text-slate-900">Upah / Gaji:</span>
                <strong className="text-red-700 tabular-nums">{selectedJob.salary}</strong>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-red-600 shrink-0" />
                <span className="font-bold text-slate-700">Lokasi Kerja:</span>
                <span className="text-slate-600 truncate">{selectedJob.location}</span>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Deskripsi Pekerjaan:
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {selectedJob.description}
              </p>
            </div>

            {/* Requirements List */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Persyaratan & Kriteria:
              </h4>
              <div className="space-y-1">
                {selectedJob.requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Person Info */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
              <span className="text-[11px] text-slate-500 block">Pemberi Kerja / Pemilik Usaha:</span>
              <p className="font-bold text-slate-900">{selectedJob.contactPerson}</p>
              <p className="text-slate-600 flex items-center gap-1 font-mono text-[11px]">
                <Phone size={12} className="text-emerald-600" />
                <span>{selectedJob.contactPhone}</span>
              </p>
            </div>

            {/* Action Buttons: Lamar via WhatsApp */}
            <div className="space-y-2 pt-1">
              <a
                href={`https://wa.me/62${selectedJob.contactPhone.replace(/[^0-9]/g, '').slice(1)}?text=Halo%20${encodeURIComponent(selectedJob.contactPerson)},%20saya%20warga%20Arjawinangun%20mau%20melamar%20pekerjaan%20*${encodeURIComponent(selectedJob.title)}*%20di%20*${encodeURIComponent(selectedJob.employer)}*%20yang%20ada%20di%20aplikasi%20Wong%20Arjawinangun.`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <MessageCircle size={15} />
                <span>Lamar Langsung via WhatsApp</span>
              </a>

              <a
                href={`tel:${selectedJob.contactPhone}`}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone size={13} />
                <span>Telepon Nomor Kontak</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* POST NEW JOB MODAL: PASANG LOWONGAN BARU */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full text-left shadow-2xl border border-slate-100 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-sm font-black text-slate-900">Pasang Lowongan Kerja Baru</h3>
                <p className="text-[10px] text-slate-500">Khusus pemilik usaha & kios di Arjawinangun</p>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handlePostJob} className="space-y-2.5 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-0.5">
                  Posisi Pekerjaan *
                </label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Contoh: Kasir Toko Sembako, Montir Motor"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-0.5">
                  Nama Tempat Usaha / Kios *
                </label>
                <input
                  type="text"
                  value={postEmployer}
                  onChange={(e) => setPostEmployer(e.target.value)}
                  placeholder="Contoh: Kios Berkah Jaya, Toko H. Sanusi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Kategori</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value as any)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    {categories.filter((c) => c !== 'Semua').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Tipe Kerja</label>
                  <select
                    value={postJobType}
                    onChange={(e) => setPostJobType(e.target.value as any)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    {jobTypes.filter((t) => t !== 'Semua').map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-0.5">
                  Estimasi Upah / Gaji
                </label>
                <input
                  type="text"
                  value={postSalary}
                  onChange={(e) => setPostSalary(e.target.value)}
                  placeholder="Contoh: Rp 80.000 / hari atau Rp 2.000.000 / bln"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-0.5">
                  Lokasi Tempat Kerja
                </label>
                <input
                  type="text"
                  value={postLocation}
                  onChange={(e) => setPostLocation(e.target.value)}
                  placeholder="Contoh: Pasar Jungjang Blok A No. 5"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-0.5">
                  Deskripsi Pekerjaan
                </label>
                <textarea
                  value={postDesc}
                  onChange={(e) => setPostDesc(e.target.value)}
                  rows={2}
                  placeholder="Jelaskan gambaran tugas dan jam kerja..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-0.5">
                  Persyaratan (Satu baris per syarat)
                </label>
                <textarea
                  value={postRequirements}
                  onChange={(e) => setPostRequirements(e.target.value)}
                  rows={2}
                  placeholder="Contoh:
Pria/Wanita warga Arjawinangun
Jujur dan rajin"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-0.5">
                    No. WhatsApp *
                  </label>
                  <input
                    type="text"
                    value={postPhone}
                    onChange={(e) => setPostPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-0.5">
                    Nama Kontak
                  </label>
                  <input
                    type="text"
                    value={postContactPerson}
                    onChange={(e) => setPostContactPerson(e.target.value)}
                    placeholder="Pak / Ibu..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingJob}
                className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors mt-2"
              >
                <Send size={13} />
                <span>{isSubmittingJob ? 'Menyimpan Lowongan...' : 'Terbitkan Lowongan Kerja'}</span>
              </button>

              {postSuccess && (
                <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-[11px] font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Lowongan berhasil dipublikasikan untuk warga!</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
