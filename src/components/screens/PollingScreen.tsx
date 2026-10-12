import React, { useState } from 'react';
import { AppRole, ScreenId, VillagePoll } from '../../types';
import {
  ArrowLeft,
  Vote,
  PlusCircle,
  CheckCircle2,
  Lock,
  Clock,
  Users,
  ShieldCheck,
  Building2,
  Sparkles,
  BarChart2,
  Calendar,
  AlertCircle,
  X
} from 'lucide-react';

interface PollingScreenProps {
  polls: VillagePoll[];
  onVote: (pollId: string, optionId: string) => void;
  onCreatePoll: (newPoll: Omit<VillagePoll, 'id' | 'totalVotes' | 'createdAt' | 'status'>) => void;
  userRole: AppRole;
  userName: string;
  onBack: () => void;
  onNavigate?: (screen: ScreenId) => void;
}

export const PollingScreen: React.FC<PollingScreenProps> = ({
  polls,
  onVote,
  onCreatePoll,
  userRole,
  userName,
  onBack,
  onNavigate,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('Semua');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [justVotedId, setJustVotedId] = useState<string | null>(null);

  // Form states for Admin creating new poll
  const [pollTitle, setPollTitle] = useState('');
  const [pollDescription, setPollDescription] = useState('');
  const [pollCategory, setPollCategory] = useState<'Infrastruktur' | 'Kegiatan Desa' | 'Pasar & UMKM' | 'Keamanan & Kebersihan'>('Infrastruktur');
  const [pollEndDate, setPollEndDate] = useState('31 Okt 2026');
  const [pollOptions, setPollOptions] = useState<string[]>([
    'Setuju dengan rencana pembangunan',
    'Perlu musyawarah ulang di balai desa',
  ]);
  const [newOptionInput, setNewOptionInput] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);

  const isAdmin = userRole === 'super_admin' || userRole === 'admin';

  const categories = ['Semua', 'Infrastruktur', 'Kegiatan Desa', 'Pasar & UMKM', 'Keamanan & Kebersihan'];

  const filteredPolls = filterCategory === 'Semua'
    ? polls
    : polls.filter((p) => p.category === filterCategory);

  const handleVoteClick = (pollId: string, optionId: string) => {
    onVote(pollId, optionId);
    setJustVotedId(pollId);
    setTimeout(() => setJustVotedId(null), 2500);
  };

  const handleAddOptionField = () => {
    if (!newOptionInput.trim()) return;
    if (pollOptions.length >= 5) {
      setCreateError('Maksimal 5 pilihan opsi per polling.');
      return;
    }
    setPollOptions([...pollOptions, newOptionInput.trim()]);
    setNewOptionInput('');
    setCreateError(null);
  };

  const handleRemoveOptionField = (index: number) => {
    if (pollOptions.length <= 2) {
      setCreateError('Minimal harus ada 2 opsi pilihan.');
      return;
    }
    setPollOptions(pollOptions.filter((_, idx) => idx !== index));
    setCreateError(null);
  };

  const handleSubmitNewPoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setCreateError('Hanya Admin Desa yang memiliki hak akses menerbitkan polling.');
      return;
    }
    if (!pollTitle.trim()) {
      setCreateError('Judul polling wajib diisi.');
      return;
    }
    if (!pollDescription.trim()) {
      setCreateError('Deskripsi & latar belakang wajib diisi.');
      return;
    }
    if (pollOptions.length < 2) {
      setCreateError('Minimal cantumkan 2 opsi pilihan.');
      return;
    }

    const optionsData = pollOptions.map((optText, idx) => ({
      id: `opt-custom-${Date.now()}-${idx}`,
      text: optText,
      votesCount: 0,
    }));

    onCreatePoll({
      title: pollTitle.trim(),
      description: pollDescription.trim(),
      category: pollCategory,
      createdBy: userName,
      authorRole: userRole === 'super_admin' ? 'Super Admin (Kuwu)' : 'Admin Operasional',
      endDate: pollEndDate,
      options: optionsData,
    });

    // Reset and close
    setPollTitle('');
    setPollDescription('');
    setPollOptions(['Setuju dengan rencana pembangunan', 'Perlu musyawarah ulang di balai desa']);
    setShowCreateModal(false);
    setCreateError(null);
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-slate-50 text-slate-800">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white shadow-md">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft size={16} />
            <span>Kembali</span>
          </button>

          <div className="text-center">
            <h2 className="text-sm font-extrabold flex items-center justify-center gap-1.5">
              <Vote size={16} className="text-amber-300" />
              <span>Polling & Rembug Warga</span>
            </h2>
            <span className="text-[10px] text-red-100">Musyawarah Digital Balai Desa Arjawinangun</span>
          </div>

          <div className="w-12 text-right">
            <span className="text-[9px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full">
              Resmi
            </span>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 flex-1 text-left overflow-y-auto space-y-3.5">
        {/* Banner Hak Akses Polling */}
        <div className={`p-3.5 rounded-2xl border text-left shadow-2xs flex items-start gap-3 ${
          isAdmin
            ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 text-purple-950'
            : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 text-amber-950'
        }`}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isAdmin ? 'bg-purple-600 text-white' : 'bg-amber-500 text-white'
          }`}>
            {isAdmin ? <ShieldCheck size={20} /> : <Building2 size={20} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <h4 className="text-xs font-black">
                {isAdmin ? 'Otoritas Penerbitan Polling Aktif' : 'Layanan Polling Resmi Balai Desa'}
              </h4>
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                isAdmin ? 'bg-purple-200 text-purple-900' : 'bg-amber-200 text-amber-900'
              }`}>
                {isAdmin ? 'Akses Admin' : 'Hanya Admin'}
              </span>
            </div>
            <p className="text-[11px] mt-0.5 leading-snug opacity-90">
              {isAdmin
                ? 'Sebagai Admin/Kuwu, Anda berwenang menerbitkan polling aspirasi baru dan memantau persentase suara warga secara transparan.'
                : 'Dikelola oleh Pemerintah Desa Arjawinangun. Setiap warga memiliki 1 hak suara per topik untuk menjaga keteraturan dan keabsahan musyawarah.'}
            </p>

            {/* Admin Quick Action Button */}
            {isAdmin && (
              <div className="mt-2.5 pt-2 border-t border-purple-200/60 flex items-center justify-between">
                <span className="text-[10px] text-purple-800 font-semibold">
                  Ingin mengajukan musyawarah baru?
                </span>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs transition-colors"
                >
                  <PlusCircle size={13} />
                  <span>Buat Polling Baru</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Just Voted Notification */}
        {justVotedId && (
          <div className="p-3 bg-emerald-600 text-white rounded-2xl flex items-center gap-2 shadow-sm animate-in fade-in slide-in-from-top duration-300">
            <CheckCircle2 size={16} className="shrink-0" />
            <p className="text-xs font-semibold">
              Suara aspirasi Anda telah resmi tercatat di sistem rembug desa!
            </p>
          </div>
        )}

        {/* Polling List */}
        <div className="space-y-3.5">
          {filteredPolls.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto">
                <Vote size={24} />
              </div>
              <h4 className="text-xs font-bold text-slate-800">Belum Ada Polling Musyawarah Aktif</h4>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Aparatur desa atau pengurus RT/RW dapat membuka pemungutan suara rembug desa untuk menjaring aspirasi warga.
              </p>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  <PlusCircle size={13} />
                  <span>Buat Polling Pertama</span>
                </button>
              )}
            </div>
          ) : (
            filteredPolls.map((poll) => {
            const hasVoted = Boolean(poll.userVotedOptionId);
            const isClosed = poll.status === 'Ditutup';

            return (
              <div
                key={poll.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 text-left space-y-3 transition-all hover:border-slate-300"
              >
                {/* Poll Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        poll.category === 'Infrastruktur'
                          ? 'bg-sky-100 text-sky-800'
                          : poll.category === 'Kegiatan Desa'
                          ? 'bg-emerald-100 text-emerald-800'
                          : poll.category === 'Pasar & UMKM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {poll.category}
                      </span>

                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        isClosed ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {poll.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 mt-1 leading-snug">
                      {poll.title}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 block">Total Suara</span>
                    <strong className="text-xs font-black text-red-700 tabular-nums">
                      {poll.totalVotes}
                    </strong>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {poll.description}
                </p>

                {/* Options and Voting */}
                <div className="space-y-2 pt-1">
                  {poll.options.map((opt) => {
                    const percentage = poll.totalVotes > 0
                      ? Math.round((opt.votesCount / poll.totalVotes) * 100)
                      : 0;
                    const isSelected = poll.userVotedOptionId === opt.id;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          if (!isClosed && !hasVoted) {
                            handleVoteClick(poll.id, opt.id);
                          }
                        }}
                        className={`p-3 rounded-xl border transition-all relative overflow-hidden text-left ${
                          isSelected
                            ? 'border-red-600 bg-red-50/70 shadow-2xs ring-1 ring-red-400'
                            : isClosed || hasVoted
                            ? 'border-slate-200 bg-slate-50/60'
                            : 'border-slate-200 hover:border-red-400 hover:bg-slate-50 cursor-pointer active:scale-[0.99]'
                        }`}
                      >
                        {/* Background Progress Bar */}
                        <div
                          className={`absolute top-0 bottom-0 left-0 opacity-15 transition-all duration-500 ${
                            isSelected ? 'bg-red-600' : 'bg-slate-400'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />

                        <div className="relative z-10 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'border-red-600 bg-red-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <CheckCircle2 size={12} />}
                            </div>
                            <span className={`text-xs font-semibold leading-tight ${
                              isSelected ? 'text-red-950 font-bold' : 'text-slate-800'
                            }`}>
                              {opt.text}
                            </span>
                          </div>

                          <div className="text-right shrink-0 flex items-center gap-1.5">
                            <span className={`text-xs font-extrabold tabular-nums ${
                              isSelected ? 'text-red-700' : 'text-slate-700'
                            }`}>
                              {percentage}%
                            </span>
                            <span className="text-[10px] text-slate-400 tabular-nums">
                              ({opt.votesCount})
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Vote Status info */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock size={11} className="text-slate-400" />
                    <span>Batas: {poll.endDate}</span>
                    <span>· Diterbitkan oleh: <strong>{poll.authorRole}</strong></span>
                  </div>

                  {hasVoted ? (
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      <span>Anda Sudah Memilih</span>
                    </span>
                  ) : isClosed ? (
                    <span className="text-slate-400 font-semibold">Polling Selesai</span>
                  ) : (
                    <span className="text-red-700 font-bold animate-pulse">
                      Ketuk Opsi untuk Memilih
                    </span>
                  )}
                </div>
              </div>
            );
          }))}
        </div>
      </div>

      {/* Modal Buat Polling Baru (Hanya Admin) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full text-left shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Vote size={18} className="text-purple-700" />
                <h3 className="text-sm font-black text-slate-900">Terbitkan Polling Aspirasi Desa</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            {createError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-1.5">
                <AlertCircle size={14} className="shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitNewPoll} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Kategori Aspirasi
                </label>
                <select
                  value={pollCategory}
                  onChange={(e) => setPollCategory(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="Infrastruktur">Infrastruktur & Fasilitas Desa</option>
                  <option value="Kegiatan Desa">Kegiatan & Sosial Gotong Royong</option>
                  <option value="Pasar & UMKM">Pasar Jungjang & UMKM</option>
                  <option value="Keamanan & Kebersihan">Keamanan & Kebersihan Lingkungan</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Judul Topik Polling
                </label>
                <input
                  type="text"
                  value={pollTitle}
                  onChange={(e) => setPollTitle(e.target.value)}
                  placeholder="Contoh: Penerangan Lampu LED Jalan Gang Blok Makmur"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Latar Belakang & Keterangan
                </label>
                <textarea
                  value={pollDescription}
                  onChange={(e) => setPollDescription(e.target.value)}
                  rows={3}
                  placeholder="Jelaskan dasar musyawarah dan dampak bagi warga desa..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {/* Opsi Jawaban */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    Pilihan Jawaban (Opsi)
                  </label>
                  <span className="text-[10px] text-slate-400">Minimal 2 pilihan</span>
                </div>

                <div className="space-y-1.5 mb-2">
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="w-5 text-center font-bold text-slate-400 text-[10px]">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...pollOptions];
                          updated[idx] = e.target.value;
                          setPollOptions(updated);
                        }}
                        className="flex-1 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOptionField(idx)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Tambah Opsi Input */}
                {pollOptions.length < 5 && (
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      value={newOptionInput}
                      onChange={(e) => setNewOptionInput(e.target.value)}
                      placeholder="+ Ketik opsi baru..."
                      className="flex-1 p-1.5 bg-white border border-dashed border-slate-300 rounded-lg text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddOptionField();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddOptionField}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 font-bold rounded-lg text-[11px] text-slate-700"
                    >
                      Tambah
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Batas Akhir Voting
                </label>
                <input
                  type="text"
                  value={pollEndDate}
                  onChange={(e) => setPollEndDate(e.target.value)}
                  placeholder="Contoh: 31 Okt 2026"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-extrabold rounded-xl shadow-xs"
                >
                  Terbitkan Resmi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
