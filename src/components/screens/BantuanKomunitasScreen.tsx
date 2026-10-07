import React, { useState } from 'react';
import { ForumPost } from '../../types';
import { FAQS, FORUM_POSTS, VILLAGE_CONTACTS } from '../../data/mockData';
import {
  ArrowLeft,
  HelpCircle,
  Users,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  MessageSquare,
  PlusCircle,
  Phone,
  MessageCircle,
  AlertTriangle,
  Send,
  CheckCircle2
} from 'lucide-react';

interface BantuanKomunitasScreenProps {
  onBack: () => void;
  isWireframe?: boolean;
}

export const BantuanKomunitasScreen: React.FC<BantuanKomunitasScreenProps> = ({
  onBack,
  isWireframe = false,
}) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'forum' | 'kontak'>('forum');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [posts, setPosts] = useState<ForumPost[]>(FORUM_POSTS);

  // New post modal states
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<'Diskusi' | 'Laporan' | 'Info Gotong Royong'>('Laporan');

  // Commenting modal states
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      author: 'Ageng Prasetyo',
      block: 'Blok Makmur',
      role: 'Warga',
      timestamp: 'Baru saja',
      category: newPostCategory,
      content: newPostContent,
      likes: 1,
      commentsCount: 0,
      isLiked: true,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setShowNewPostModal(false);
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [
              ...p.comments,
              {
                author: 'Ageng Prasetyo',
                text: commentInput,
                time: 'Baru saja',
              },
            ],
          };
        }
        return p;
      })
    );

    setCommentInput('');
    setCommentingPostId(null);
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
          <h2 className="text-sm font-bold truncate">Bantuan & Komunitas Warga</h2>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium">
            Arjawinangun
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-4 flex-1 text-left overflow-y-auto space-y-4">
        {/* Navigation Tabs */}
        <div className="bg-white p-1 rounded-2xl border border-slate-200 grid grid-cols-3 gap-1 text-center shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('forum')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'forum'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users size={14} />
            <span>Forum Warga</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('faq')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'faq'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle size={14} />
            <span>Tanya Jawab</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kontak')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'kontak'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PhoneCall size={14} />
            <span>Admin Desa</span>
          </button>
        </div>

        {/* TAB 1: FORUM WARGA */}
        {activeTab === 'forum' && (
          <div className="space-y-3">
            {/* Action Bar: Buat Postingan Baru */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-xs">
                  AP
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Ada kabar atau laporan?</span>
                  <span className="text-[10px] text-slate-400">Bagikan saran atau kendala fasilitas desa</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewPostModal(true)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-2xs"
              >
                <PlusCircle size={13} />
                <span>Tulis</span>
              </button>
            </div>

            {/* List Postingan Warga */}
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900">{post.author}</h4>
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                          {post.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {post.block} · {post.timestamp}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        post.category === 'Laporan'
                          ? 'bg-amber-100 text-amber-900'
                          : post.category === 'Info Gotong Royong'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-sky-100 text-sky-900'
                      }`}
                    >
                      {post.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{post.content}</p>

                  {/* Likes and Comments Counters */}
                  <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-xs">
                    <button
                      type="button"
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1 font-semibold transition-colors ${
                        post.isLiked ? 'text-red-600' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <ThumbsUp size={13} className={post.isLiked ? 'fill-red-600' : ''} />
                      <span>{post.likes} Dukung</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCommentingPostId(post.id)}
                      className="flex items-center gap-1 text-slate-500 hover:text-slate-700 font-semibold"
                    >
                      <MessageSquare size={13} />
                      <span>{post.commentsCount} Tanggapan</span>
                    </button>
                  </div>

                  {/* Comment List */}
                  {post.comments.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-50 space-y-1.5 bg-slate-50/70 p-2 rounded-xl">
                      {post.comments.map((cm, cIdx) => (
                        <div key={cIdx} className="text-[11px]">
                          <strong className="text-slate-800 font-bold">{cm.author}: </strong>
                          <span className="text-slate-600">{cm.text}</span>
                          <span className="text-[9px] text-slate-400 ml-1">· {cm.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: FAQ / TANYA JAWAB */}
        {activeTab === 'faq' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pertanyaan Sering Diajukan Warga
              </span>
              <span className="text-[10px] text-slate-500">Panduan Praktis</span>
            </div>

            <div className="space-y-2">
              {FAQS.map((faq, index) => {
                const isOpen = expandedFaq === index;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full p-3.5 text-left flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <span className="pr-2">{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp size={16} className="text-red-600 shrink-0" />
                      ) : (
                        <ChevronDown size={16} className="text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: KONTAK ADMIN & DARURAT DESA */}
        {activeTab === 'kontak' && (
          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded-2xl border border-red-200/80 flex items-center gap-2 text-red-900">
              <AlertTriangle size={18} className="text-red-700 shrink-0" />
              <div className="text-[11px] leading-snug">
                <strong>Kontak Penting & Darurat Desa:</strong>
                <p>Hubungi jika membutuhkan pengawalan keamanan, ambulans, atau pelayanan surat balai desa.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {VILLAGE_CONTACTS.map((cnt) => (
                <div
                  key={cnt.id}
                  className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-start justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{cnt.name}</h4>
                      <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                        {cnt.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{cnt.role}</p>
                    <span className="text-[10px] text-emerald-700 font-medium block mt-1">
                      Jam Pelayanan: {cnt.hours}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pt-1">
                    <a
                      href={`tel:${cnt.phone}`}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors"
                      title="Panggilan Telepon"
                    >
                      <Phone size={14} className="text-red-700" />
                    </a>
                    <a
                      href={`https://wa.me/62${cnt.whatsapp.replace(/[^0-9]/g, '').slice(1)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors"
                      title="Chat WhatsApp"
                    >
                      <MessageCircle size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Buat Postingan Forum */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-4 shadow-xl border border-slate-100 text-left animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-xs text-slate-900">Tulis Kabar / Laporan Warga</h3>
              <button onClick={() => setShowNewPostModal(false)} className="text-xs text-slate-400">✕</button>
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Kategori</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Laporan', 'Diskusi', 'Info Gotong Royong'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewPostCategory(cat)}
                      className={`py-1.5 px-1 text-[10px] font-bold rounded-xl border text-center transition-colors ${
                        newPostCategory === cat
                          ? 'border-red-600 bg-red-50 text-red-900'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Isi Pesan</label>
                <textarea
                  rows={3}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Ceritakan kejadian, usulan perbaikan jalan/saluran air, atau info kegiatan..."
                  className="w-full p-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                type="button"
                onClick={handleCreatePost}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Kirim ke Forum Warga
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Beri Tanggapan / Komentar */}
      {commentingPostId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-4 shadow-xl border border-slate-100 text-left animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-xs text-slate-900">Beri Tanggapan Warga</h3>
              <button onClick={() => setCommentingPostId(null)} className="text-xs text-slate-400">✕</button>
            </div>

            <div className="mt-3 space-y-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Tulis saran atau tanggapan..."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={() => handleAddComment(commentingPostId)}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl"
              >
                Kirim Tanggapan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
