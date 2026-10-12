import React, { useState } from 'react';
import { AppNotification, ScreenId } from '../types';
import {
  Bell,
  X,
  CheckCircle2,
  Trophy,
  Sparkles,
  ArrowRight,
  Clock,
  Trash2,
  CheckCheck,
  ShieldCheck,
  Star,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkRead: (id?: string) => void;
  onClearAll: () => void;
  onNavigate: (screen: ScreenId, targetId?: string) => void;
  onSimulateApproval?: (action: 'approve' | 'publish') => void;
  isWireframe?: boolean;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onClearAll,
  onNavigate,
  onSimulateApproval,
  isWireframe = false,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'hof'>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((notif) => {
    if (filterTab === 'unread') return !notif.read;
    if (filterTab === 'hof') return notif.category === 'Hall of Fame' || notif.type.startsWith('hall_of_fame');
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notif: AppNotification) => {
    if (!notif.read) {
      onMarkRead(notif.id);
    }
    if (notif.actionLink) {
      onClose();
      onNavigate(notif.actionLink.screen, notif.actionLink.targetId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in text-left">
      <div className="bg-white w-full sm:max-w-md max-h-[90vh] rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div
          className={`p-4 border-b flex items-center justify-between text-white ${
            isWireframe
              ? 'bg-zinc-800 border-zinc-700'
              : 'bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 border-red-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center relative">
              <Bell size={18} className="text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-red-950 text-[10px] font-black flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-black text-sm text-white">Notifikasi Warga</h3>
              <p className="text-[11px] text-amber-100">
                Pemberitahuan persetujuan usulan tokoh & info desa
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filter Tabs & Quick Actions */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                filterTab === 'all'
                  ? 'bg-red-700 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Semua ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('unread')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                filterTab === 'unread'
                  ? 'bg-red-700 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Belum Dibaca ({unreadCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('hof')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${
                filterTab === 'hof'
                  ? 'bg-amber-500 text-red-950 shadow-2xs font-extrabold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>🏆</span>
              <span>Hall of Fame</span>
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => onMarkRead()}
              className="text-[10px] font-bold text-red-700 hover:underline flex items-center gap-0.5 shrink-0"
              title="Tandai semua dibaca"
            >
              <CheckCheck size={12} />
              <span>Baca Semua</span>
            </button>
          )}
        </div>

        {/* Scrollable Notification List */}
        <div className="p-3 overflow-y-auto space-y-2.5 flex-1 max-h-[60vh]">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 my-4">
              <span className="text-3xl block mb-2">🔔</span>
              <p className="text-xs font-bold text-slate-700">Tidak ada notifikasi saat ini</p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Pemberitahuan persetujuan usulan tokoh dan info resmi akan muncul di sini.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isHofApproved = notif.type === 'hall_of_fame_approved';
              const isHofPublished = notif.type === 'hall_of_fame_published';
              const isHofRelated = isHofApproved || isHofPublished;

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer relative group ${
                    !notif.read
                      ? isHofRelated
                        ? 'bg-gradient-to-r from-amber-50/80 via-rose-50/50 to-white border-amber-300 shadow-xs'
                        : 'bg-blue-50/60 border-blue-200'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  {/* Unread indicator dot */}
                  {!notif.read && (
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  )}

                  <div className="flex items-start gap-2.5">
                    {/* Icon Badge */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isHofPublished
                          ? 'bg-amber-400 text-red-950 shadow-xs'
                          : isHofApproved
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isHofPublished ? (
                        <Trophy size={18} className="fill-red-950 text-red-950" />
                      ) : isHofApproved ? (
                        <CheckCircle2 size={18} className="text-emerald-700" />
                      ) : (
                        <Bell size={16} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                            isHofPublished
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : isHofApproved
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {isHofPublished
                            ? '🌟 Resmi Dipublikasikan'
                            : isHofApproved
                            ? '✅ Usulan Disetujui'
                            : notif.category}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                          <Clock size={10} />
                          <span>{notif.timestamp}</span>
                        </span>
                      </div>

                      <h4 className="text-xs font-black text-slate-900 mt-1 leading-snug">
                        {notif.title}
                      </h4>

                      <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">
                        {notif.message}
                      </p>

                      {/* Action Link Button */}
                      {notif.actionLink && (
                        <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-red-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            <span>{notif.actionLink.label}</span>
                            <ArrowRight size={11} />
                          </span>

                          {!notif.read && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkRead(notif.id);
                              }}
                              className="text-[9px] text-slate-400 hover:text-slate-700"
                            >
                              Tandai dibaca
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Interactive Simulation Footer for Testing */}
        {onSimulateApproval && (
          <div className="p-3 bg-amber-50/70 border-t border-amber-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={11} className="text-amber-600" />
                <span>Simulasi Persetujuan Admin</span>
              </span>
              <span className="text-[9px] text-amber-700">Untuk uji coba langsung</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSimulateApproval('approve')}
                className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg shadow-2xs transition-all flex items-center justify-center gap-1"
              >
                <CheckCircle2 size={12} />
                <span>Simulasi Status Disetujui</span>
              </button>
              <button
                type="button"
                onClick={() => onSimulateApproval('publish')}
                className="py-1.5 px-2 bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-95 text-white font-extrabold text-[10px] rounded-lg shadow-2xs transition-all flex items-center justify-center gap-1"
              >
                <Trophy size={12} />
                <span>Simulasi Dipublikasikan</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
          {notifications.length > 0 ? (
            <button
              type="button"
              onClick={onClearAll}
              className="text-[10px] text-slate-500 hover:text-red-700 flex items-center gap-1"
            >
              <Trash2 size={11} />
              <span>Hapus Semua</span>
            </button>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
