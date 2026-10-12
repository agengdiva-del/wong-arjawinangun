import React, { useState, useEffect } from 'react';
import { HallOfFameItem, HallOfFameNomination, HallOfFameCategory } from '../../types';
import { MOCK_HALL_OF_FAME, MOCK_HALL_OF_FAME_NOMINATIONS } from '../../data/mockData';
import { api } from '../../services/api';
import {
  ArrowLeft,
  Award,
  Medal,
  Heart,
  MessageCircle,
  Share2,
  PlusCircle,
  Search,
  Sparkles,
  CheckCircle2,
  Clock,
  ThumbsUp,
  MapPin,
  X,
  Send,
  User,
  ShieldCheck,
  Trophy,
  Filter,
  Check,
} from 'lucide-react';

interface HallOfFameScreenProps {
  onBack: () => void;
  isWireframe?: boolean;
}

const CATEGORIES: { label: string; value: HallOfFameCategory | 'Semua' | 'Usulan Warga'; icon: string; color: string }[] = [
  { label: 'Semua', value: 'Semua', icon: '🌟', color: 'bg-slate-100 text-slate-800 border-slate-300' },
  { label: 'Tokoh Masyarakat', value: 'Tokoh Masyarakat', icon: '👑', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { label: 'Pemuda Inspiratif', value: 'Pemuda Inspiratif', icon: '🔥', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
  { label: 'Pelajar Berprestasi', value: 'Pelajar Berprestasi', icon: '🎓', color: 'bg-sky-100 text-sky-900 border-sky-300' },
  { label: 'Atlet Daerah', value: 'Atlet Daerah', icon: '🥇', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { label: 'Pengusaha Muda', value: 'Pengusaha Muda', icon: '💼', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { label: 'Relawan Sosial', value: 'Relawan Sosial', icon: '🤝', color: 'bg-rose-100 text-rose-900 border-rose-300' },
  { label: 'Usulan Warga', value: 'Usulan Warga', icon: '📋', color: 'bg-purple-100 text-purple-900 border-purple-300' },
];

export const HallOfFameScreen: React.FC<HallOfFameScreenProps> = ({
  onBack,
  isWireframe = false,
}) => {
  const [items, setItems] = useState<HallOfFameItem[]>(MOCK_HALL_OF_FAME);
  const [nominations, setNominations] = useState<HallOfFameNomination[]>(MOCK_HALL_OF_FAME_NOMINATIONS);
  const [selectedCategory, setSelectedCategory] = useState<HallOfFameCategory | 'Semua' | 'Usulan Warga'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Detail Modal State
  const [selectedItem, setSelectedItem] = useState<HallOfFameItem | null>(null);

  // Nomination Form Modal State
  const [showNominationModal, setShowNominationModal] = useState(false);
  const [nomineeName, setNomineeName] = useState('');
  const [category, setCategory] = useState<HallOfFameCategory>('Tokoh Masyarakat');
  const [origin, setOrigin] = useState('');
  const [title, setTitle] = useState('');
  const [achievements, setAchievements] = useState('');
  const [reason, setReason] = useState('');
  const [proposerName, setProposerName] = useState('');
  const [proposerPhone, setProposerPhone] = useState('');
  const [proposerRtRw, setProposerRtRw] = useState('');
  const [isSubmittingNomination, setIsSubmittingNomination] = useState(false);
  const [nominationSuccessNotice, setNominationSuccessNotice] = useState<string | null>(null);

  // Comment Form State inside Detail Modal
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Share Notification State
  const [copiedNotice, setCopiedNotice] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getHallOfFame(
        selectedCategory === 'Semua' || selectedCategory === 'Usulan Warga' ? undefined : selectedCategory,
        searchQuery || undefined
      );
      if (res && res.data) {
        setItems(res.data);
      }
      if (res && res.nominations) {
        setNominations(res.nominations);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAppreciate = async (itemId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Optimistic UI update
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const nextHasAppreciated = !item.hasAppreciated;
          return {
            ...item,
            hasAppreciated: nextHasAppreciated,
            appreciationsCount: nextHasAppreciated
              ? item.appreciationsCount + 1
              : Math.max(0, item.appreciationsCount - 1),
          };
        }
        return item;
      })
    );

    if (selectedItem && selectedItem.id === itemId) {
      const nextHasAppreciated = !selectedItem.hasAppreciated;
      setSelectedItem({
        ...selectedItem,
        hasAppreciated: nextHasAppreciated,
        appreciationsCount: nextHasAppreciated
          ? selectedItem.appreciationsCount + 1
          : Math.max(0, selectedItem.appreciationsCount - 1),
      });
    }

    try {
      await api.toggleAppreciateHallOfFame(itemId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVoteNomination = async (nomId: string) => {
    // Optimistic update
    setNominations((prev) =>
      prev.map((nom) => {
        if (nom.id === nomId) {
          const nextVoted = !nom.hasVoted;
          return {
            ...nom,
            hasVoted: nextVoted,
            supportVotes: nextVoted ? nom.supportVotes + 1 : Math.max(0, nom.supportVotes - 1),
          };
        }
        return nom;
      })
    );

    try {
      await api.voteHallOfFameNomination(nomId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitNomination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomineeName.trim() || !achievements.trim() || !proposerName.trim()) {
      alert('Mohon lengkapi nama calon, prestasi, dan nama Anda sebagai pengusul.');
      return;
    }

    setIsSubmittingNomination(true);
    try {
      const payload = {
        nomineeName: nomineeName.trim(),
        category,
        origin: origin.trim() || 'Arjawinangun, Cirebon',
        title: title.trim() || `Sosok Penggerak Kategori ${category}`,
        achievements: achievements.trim(),
        reason: reason.trim() || achievements.trim(),
        proposerName: proposerName.trim(),
        proposerPhone: proposerPhone.trim(),
        proposerRtRw: proposerRtRw.trim() || 'Warga Arjawinangun',
      };

      const res = await api.nominateHallOfFame(payload);
      if (res && res.data) {
        setNominations((prev) => [res.data, ...prev]);
      }

      setNominationSuccessNotice(
        `Terima kasih! Usulan untuk Bapak/Ibu/Saudara "${nomineeName}" telah dicatat dan masuk ke daftar usulan warga untuk verifikasi desa.`
      );

      // Reset form
      setNomineeName('');
      setOrigin('');
      setTitle('');
      setAchievements('');
      setReason('');
      setProposerName('');
      setProposerPhone('');
      setProposerRtRw('');

      setTimeout(() => {
        setNominationSuccessNotice(null);
        setShowNominationModal(false);
        setSelectedCategory('Usulan Warga');
      }, 2500);
    } catch (err) {
      console.error(err);
      alert('Gagal mengirim usulan. Silakan coba kembali.');
    } finally {
      setIsSubmittingNomination(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      const payload = {
        author: commentAuthor.trim() || 'Warga Arjawinangun',
        role: 'Warga',
        text: commentText.trim(),
      };

      const res = await api.addHallOfFameComment(selectedItem.id, payload);
      const newComment = res.data || {
        id: `c-${Date.now()}`,
        author: payload.author,
        role: payload.role,
        text: payload.text,
        date: 'Baru saja',
      };

      const updatedItem: HallOfFameItem = {
        ...selectedItem,
        comments: [newComment, ...(selectedItem.comments || [])],
      };

      setSelectedItem(updatedItem);
      setItems((prev) => prev.map((item) => (item.id === selectedItem.id ? updatedItem : item)));
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = (item: HallOfFameItem) => {
    const text = `🏆 Hall of Fame Arjawinangun: ${item.name} (${item.category}) - ${item.title}. Mari beri apresiasi untuk kebanggaan desa kita!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 2000);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchCategory =
      selectedCategory === 'Semua' || selectedCategory === 'Usulan Warga'
        ? true
        : item.category === selectedCategory;

    const matchSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  const getCategoryBadgeClass = (cat: HallOfFameCategory) => {
    switch (cat) {
      case 'Tokoh Masyarakat':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Pemuda Inspiratif':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      case 'Pelajar Berprestasi':
        return 'bg-sky-100 text-sky-900 border-sky-300';
      case 'Atlet Daerah':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'Pengusaha Muda':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Relawan Sosial':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className={`min-h-full pb-20 text-left ${isWireframe ? 'bg-zinc-50' : 'bg-slate-50'}`}>
      {/* Top Header */}
      <div
        className={`p-4 pt-3 pb-5 ${
          isWireframe
            ? 'bg-zinc-800 text-white'
            : 'bg-gradient-to-r from-red-800 via-rose-700 to-amber-700 text-white shadow-md'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={18} className="text-white" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <Trophy size={16} className="text-amber-300" />
                <h1 className="text-base font-black tracking-tight text-white">
                  Hall of Fame Arjawinangun
                </h1>
              </div>
              <p className="text-[11px] text-amber-100">
                Panggung Kehormatan & Sosok Teladan Desa
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowNominationModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-red-950 font-extrabold text-[11px] shadow-sm active:scale-95 transition-all"
          >
            <PlusCircle size={14} className="text-red-950" />
            <span>Usulkan Tokoh</span>
          </button>
        </div>

        {/* Hero Banner Intro */}
        <div className="mt-2 p-3 rounded-2xl bg-black/20 backdrop-blur-xs border border-white/20">
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center shrink-0">
              <Award size={20} className="text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                Apresiasi Warga Desa
              </span>
              <p className="text-xs font-semibold text-white leading-snug">
                Penghargaan untuk sosok yang mengharumkan nama desa & memberi manfaat nyata bagi warga.
              </p>
              <p className="text-[10px] text-amber-100/90 mt-1 flex items-center gap-1">
                <Sparkles size={11} className="text-amber-300 inline" />
                <span>Warga berhak mengusulkan sosok inspiratif di lingkungannya!</span>
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-3 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tokoh, prestasi, atau blok..."
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/10 placeholder-white/60 text-white text-xs border border-white/20 focus:outline-none focus:bg-white/20 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-4 mt-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-red-700 text-white border-red-800 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {cat.value === 'Usulan Warga' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive ? 'bg-amber-300 text-red-950' : 'bg-red-100 text-red-700'
                  }`}>
                    {nominations.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 mt-3 space-y-3">
        {/* Banner Ajakan Mengusulkan Tokoh */}
        <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🗳️</span>
            <div>
              <h4 className="text-xs font-black text-amber-950">Kenal Sosok yang Menginspirasi?</h4>
              <p className="text-[10px] text-amber-800">
                Usulkan tetangga, pemuda, guru, atlet atau relawan di sekitar Anda.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowNominationModal(true)}
            className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[10px] rounded-xl shrink-0 transition-colors shadow-2xs"
          >
            + Usulkan Sekarang
          </button>
        </div>

        {/* Tab "Usulan Warga" View */}
        {selectedCategory === 'Usulan Warga' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Daftar Usulan Warga Terbaru
              </h3>
              <span className="text-[10px] text-slate-500">
                {nominations.length} calon diusulkan
              </span>
            </div>

            {nominations.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                <span className="text-3xl block mb-2">📋</span>
                <p className="text-xs font-bold text-slate-700">Belum Ada Usulan Warga</p>
                <p className="text-[10px] text-slate-500 mt-0.5 mb-3">
                  Jadilah yang pertama mengusulkan sosok berprestasi di desa Arjawinangun.
                </p>
                <button
                  type="button"
                  onClick={() => setShowNominationModal(true)}
                  className="px-3 py-1.5 bg-red-600 text-white font-bold text-xs rounded-xl"
                >
                  + Tulis Usulan Tokoh
                </button>
              </div>
            ) : (
              nominations.map((nom) => (
                <div
                  key={nom.id}
                  className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-all text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(nom.category)}`}>
                          {nom.category}
                        </span>
                        <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <Clock size={10} />
                          <span>{nom.status}</span>
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 mt-1">
                        {nom.nomineeName}
                      </h4>
                      <p className="text-[11px] font-semibold text-slate-600">
                        {nom.title}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleVoteNomination(nom.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all active:scale-95 shrink-0 ${
                        nom.hasVoted
                          ? 'bg-rose-50 border-rose-300 text-rose-600'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                      title="Dukung Usulan Ini"
                    >
                      <ThumbsUp size={16} className={nom.hasVoted ? 'fill-rose-600' : ''} />
                      <span className="text-[10px] font-black mt-0.5">
                        {nom.supportVotes}
                      </span>
                      <span className="text-[8px] font-semibold">Dukungan</span>
                    </button>
                  </div>

                  <div className="mt-2.5 p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-700">
                    <p className="font-bold text-slate-800 mb-0.5">Prestasi / Kontribusi:</p>
                    <p className="leading-relaxed">{nom.achievements}</p>
                    {nom.reason && (
                      <p className="mt-1 text-[10px] text-slate-500 italic">
                        Alasan pengusulan: &ldquo;{nom.reason}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} className="text-slate-400" />
                      <span>{nom.origin}</span>
                    </span>
                    <span>
                      Diusulkan oleh: <strong className="text-slate-700">{nom.proposerName}</strong> ({nom.proposerRtRw})
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Inductee Cards View */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                {selectedCategory === 'Semua' ? 'Galeri Sosok Teladan Desa' : `Kategori: ${selectedCategory}`}
              </h3>
              <span className="text-[10px] text-slate-500 font-medium">
                {filteredItems.length} tokoh terdaftar
              </span>
            </div>

            {filteredItems.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                <span className="text-3xl block mb-2">🔍</span>
                <p className="text-xs font-bold text-slate-700">Tidak ada tokoh yang cocok</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Coba ubah kata kunci pencarian atau kategori.
                </p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const categoryBadge = getCategoryBadgeClass(item.category);
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
                  >
                    <div className="flex gap-3">
                      {/* Photo with frame */}
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-300 bg-amber-50">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-1 right-1 bg-amber-400 text-red-950 rounded-full p-0.5 shadow-xs">
                          <Medal size={10} />
                        </div>
                      </div>

                      {/* Info Summary */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${categoryBadge}`}>
                            {item.category}
                          </span>
                          {item.verifiedStatus === 'terverifikasi' ? (
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <ShieldCheck size={10} />
                              <span>Terverifikasi Balai Desa</span>
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                              Usulan Warga
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-black text-slate-900 mt-1 leading-snug">
                          {item.name}
                        </h4>

                        <p className="text-[11px] font-semibold text-amber-800 line-clamp-1 mt-0.5">
                          {item.title}
                        </p>

                        <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                          <MapPin size={11} className="text-slate-400 shrink-0" />
                          <span className="truncate">{item.origin}</span>
                        </div>
                      </div>
                    </div>

                    {/* Capaian Cuplikan */}
                    <div className="mt-2.5 p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-700">
                      <p className="line-clamp-2 leading-relaxed">
                        &ldquo;{item.story}&rdquo;
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Tombol Apresiasi */}
                        <button
                          type="button"
                          onClick={(e) => handleAppreciate(item.id, e)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all active:scale-95 border ${
                            item.hasAppreciated
                              ? 'bg-rose-50 text-rose-600 border-rose-300'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <Heart
                            size={14}
                            className={item.hasAppreciated ? 'fill-rose-600 text-rose-600' : 'text-slate-400'}
                          />
                          <span>{item.appreciationsCount}</span>
                          <span className="text-[10px] font-normal text-slate-500">Apresiasi</span>
                        </button>

                        {/* Testimoni Counter */}
                        <div className="flex items-center gap-1 text-slate-500 text-xs px-2 py-1">
                          <MessageCircle size={13} className="text-slate-400" />
                          <span>{item.comments?.length || 0} Testimoni</span>
                        </div>
                      </div>

                      <span className="text-[10px] font-extrabold text-red-700 group-hover:translate-x-0.5 transition-transform">
                        Lihat Profil →
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* DETAIL MODAL: Profil Lengkap Tokoh */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full sm:max-w-md max-h-[90vh] rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden text-left">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-red-800 to-rose-700 text-white">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-amber-300" />
                <h3 className="font-bold text-sm text-white">Profil Tokoh Hall of Fame</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 overflow-y-auto space-y-4">
              {/* Profile Card */}
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-400 bg-amber-50">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(selectedItem.category)}`}>
                    {selectedItem.category}
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1 leading-snug">
                    {selectedItem.name}
                  </h3>
                  <p className="text-xs font-semibold text-amber-800 mt-0.5">
                    {selectedItem.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin size={12} className="text-slate-400 shrink-0" />
                    <span>{selectedItem.origin}</span>
                  </p>
                </div>
              </div>

              {/* Action Bar (Apresiasi & Bagikan) */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleAppreciate(selectedItem.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all active:scale-95 border ${
                    selectedItem.hasAppreciated
                      ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-rose-50'
                  }`}
                >
                  <Heart size={15} className={selectedItem.hasAppreciated ? 'fill-white' : 'text-rose-500'} />
                  <span>{selectedItem.hasAppreciated ? 'Diberi Apresiasi' : 'Beri Apresiasi'}</span>
                  <span className="bg-black/10 px-1.5 py-0.2 rounded font-black text-[10px]">
                    {selectedItem.appreciationsCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShare(selectedItem)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 text-xs font-bold"
                >
                  <Share2 size={13} />
                  <span>{copiedNotice ? 'Tersalin!' : 'Bagikan'}</span>
                </button>
              </div>

              {/* Kiprah & Dedikasi */}
              <div>
                <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span>📖</span>
                  <span>Kiprah & Dedikasi</span>
                </h4>
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs text-slate-800 leading-relaxed">
                  {selectedItem.story}
                </div>
              </div>

              {/* Capaian Prestasi Konkret */}
              {selectedItem.achievements && selectedItem.achievements.length > 0 && (
                <div>
                  <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider mb-1.5 flex items-center gap-1.5">
                    <span>🏆</span>
                    <span>Capaian & Prestasi Utama</span>
                  </h4>
                  <div className="space-y-1.5">
                    {selectedItem.achievements.map((ach, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-800"
                      >
                        <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                          ✓
                        </div>
                        <span className="leading-snug">{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Komentar & Testimoni Warga */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                    <span>💬</span>
                    <span>Testimoni & Doa Warga ({selectedItem.comments?.length || 0})</span>
                  </h4>
                </div>

                {/* Form Tambah Testimoni */}
                <form onSubmit={handleSubmitComment} className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-3 space-y-2">
                  <p className="text-[11px] font-bold text-slate-700">Tuliskan Apresiasi atau Testimoni Anda:</p>
                  <input
                    type="text"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    placeholder="Nama Anda (cth: Kang Maman / Ibu Siti)"
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Tuliskan ucapan terima kasih / testimoni..."
                      className="flex-1 p-2 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingComment || !commentText.trim()}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 disabled:opacity-50"
                    >
                      <Send size={12} />
                      <span>Kirim</span>
                    </button>
                  </div>
                </form>

                {/* Testimonial List */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedItem.comments && selectedItem.comments.length > 0 ? (
                    selectedItem.comments.map((c) => (
                      <div
                        key={c.id}
                        className="p-2.5 bg-white rounded-xl border border-slate-100 shadow-2xs text-xs"
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                          <span className="font-bold text-slate-800">
                            {c.author} <span className="font-normal text-slate-400">({c.role})</span>
                          </span>
                          <span>{c.date}</span>
                        </div>
                        <p className="text-slate-700 leading-snug">{c.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-400 text-xs py-3">
                      Belum ada testimoni. Jadilah yang pertama menuliskan apresiasi!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl"
              >
                Tutup Profil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL: Formulir Usulan Sosok Berprestasi oleh Warga */}
      {showNominationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full sm:max-w-md max-h-[92vh] rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden text-left">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-200">
                  Partisipasi Warga Desa
                </span>
                <h3 className="font-black text-sm text-white">
                  Formulir Usulan Hall of Fame
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNominationModal(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 overflow-y-auto space-y-3.5">
              {nominationSuccessNotice ? (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700">
                    <CheckCircle2 size={28} />
                  </div>
                  <h4 className="text-sm font-black text-emerald-900">Usulan Berhasil Dikirim!</h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    {nominationSuccessNotice}
                  </p>
                  <p className="text-[10px] text-emerald-600">
                    Mengarahkan ke daftar usulan warga...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitNomination} className="space-y-3">
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-snug">
                    Setiap warga Arjawinangun berhak mengusulkan sosok yang dinilai layak menerima penghargaan dan penghormatan atas kiprahnya.
                  </div>

                  {/* Nama Calon */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Nama Lengkap Sosok / Tokoh <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={nomineeName}
                      onChange={(e) => setNomineeName(e.target.value)}
                      placeholder="Contoh: Bpk. H. Sudirman / Anisa Rahma"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:border-red-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>

                  {/* Kategori Pilihan (6 Kategori yang Diminta User) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Kategori Bidang <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as HallOfFameCategory)}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:border-red-600 focus:outline-none bg-white font-medium"
                    >
                      <option value="Tokoh Masyarakat">👑 Tokoh Masyarakat</option>
                      <option value="Pemuda Inspiratif">🔥 Pemuda Inspiratif</option>
                      <option value="Pelajar Berprestasi">🎓 Pelajar Berprestasi</option>
                      <option value="Atlet Daerah">🥇 Atlet Daerah</option>
                      <option value="Pengusaha Muda">💼 Pengusaha Muda</option>
                      <option value="Relawan Sosial">🤝 Relawan Sosial</option>
                    </select>
                  </div>

                  {/* Asal Blok / RT / RW */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Asal Blok / RT / RW di Arjawinangun
                    </label>
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="Contoh: Blok Makmur RT 03 / RW 02"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:border-red-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>

                  {/* Julukan / Gelar Penghargaan Singkat */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Julukan / Gelar Pengenal Singkat
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Contoh: Guru Ngaji Tanpa Pamrih / Juara Silat Pelajar"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:border-red-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>

                  {/* Prestasi & Kontribusi Utama */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Prestasi / Kontribusi Nyata <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={achievements}
                      onChange={(e) => setAchievements(e.target.value)}
                      placeholder="Tuliskan apa saja karya, medali, atau jasa beliau bagi warga / desa..."
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:border-red-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>

                  {/* Alasan Pengusulan */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Mengapa Sosok Ini Layak Masuk Hall of Fame?
                    </label>
                    <textarea
                      rows={2}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Ceritakan keteladanan atau dampak positif yang dirasakan warga..."
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:border-red-600 focus:outline-none bg-slate-50/50"
                    />
                  </div>

                  {/* Data Pengusul */}
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                      Identitas Pengusul (Warga)
                    </p>
                    <div className="space-y-2">
                      <input
                        type="text"
                        required
                        value={proposerName}
                        onChange={(e) => setProposerName(e.target.value)}
                        placeholder="Nama Lengkap Anda *"
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50/50"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={proposerPhone}
                          onChange={(e) => setProposerPhone(e.target.value)}
                          placeholder="No. WhatsApp Anda"
                          className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50/50"
                        />
                        <input
                          type="text"
                          value={proposerRtRw}
                          onChange={(e) => setProposerRtRw(e.target.value)}
                          placeholder="RT/RW Domisili Anda"
                          className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowNominationModal(false)}
                      className="px-4 py-2.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingNomination}
                      className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-xs rounded-xl shadow-sm disabled:opacity-50"
                    >
                      {isSubmittingNomination ? 'Mengirim...' : 'Kirim Usulan Warga'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
