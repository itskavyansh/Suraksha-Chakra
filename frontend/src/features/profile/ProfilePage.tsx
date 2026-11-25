import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import {
  User,
  QrCode,
  Download,
  Share2,
  ExternalLink,
  Edit3,
  RotateCcw,
  Trash2,
  LogOut,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Sheet } from '@/components/ui/Sheet';
import { ROUTES } from '@/app/routes';
import { TrainingModule } from '@/types';
import { api } from '@/data/api';
import { useSessionStore } from '@/store/sessionStore';
import { useToast } from '@/components/ui/Toast';

export const ProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = useSessionStore((state) => state.user);
  const isDemo = useSessionStore((state) => state.isDemo);
  const updateUser = useSessionStore((state) => state.updateUser);
  const logout = useSessionStore((state) => state.logout);

  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [allModules, setAllModules] = useState<TrainingModule[]>([]);

  // Modals & Sheets
  const [showQrModal, setShowQrModal] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(user?.name || '');
  const [editCity, setEditCity] = useState(user?.city || 'Delhi');
  const [editLang, setEditLang] = useState<'en' | 'hi'>(user?.preferredLanguage || 'en');
  const [isSaving, setIsSaving] = useState(false);

  const qrContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      if (!user) return;
      try {
        const [progress, mods] = await Promise.all([
          api.getTrainingProgress(user.id),
          api.getTrainingModules(),
        ]);
        if (mounted) {
          const completed = Object.keys(progress).filter((k) => progress[k]?.completed);
          setCompletedModules(completed);
          setAllModules(mods);
        }
      } catch {
        // Ignore
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [user]);

  if (!user) return null;

  const snapshot = api.buildPassportSnapshot(user, completedModules);
  const verifyPath = `${ROUTES.verify(user.workerId)}?d=${snapshot}`;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const fullVerifyUrl = `${origin}${verifyPath}`;

  const maskedPhone = user.phone.replace(/^(\d{2})\d{4}(\d{4})$/, '$1****$2');

  const handleDownloadQr = () => {
    try {
      const svg = qrContainerRef.current?.querySelector('svg');
      if (!svg) return;
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = 300;
        canvas.height = 300;
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, 300, 300);
          ctx.drawImage(img, 20, 20, 260, 260);
          const pngUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = `passport-${user.workerId}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          showToast(t('passport.downloadSuccess'), 'success');
        }
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch {
      showToast('Could not download QR', 'error');
    }
  };

  const handleSharePassport = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${user.name} - Suraksha Passport`,
          text: `Verified waste worker safety passport for ${user.name} (${user.workerId})`,
          url: fullVerifyUrl,
        });
      } else {
        await navigator.clipboard.writeText(fullVerifyUrl);
        showToast('Passport link copied to clipboard', 'info');
      }
    } catch {
      // Ignored if cancelled
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await api.updateAccount(user.id, {
        name: editName,
        city: editCity,
        preferredLanguage: editLang,
      });
      updateUser(updated);
      i18n.changeLanguage(editLang);
      setShowEditSheet(false);
      showToast('Profile updated', 'success');
    } catch {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDemo = async () => {
    await api.resetDemoData();
    setShowResetModal(false);
    showToast('Demo data reset', 'info');
    window.location.reload();
  };

  const handleDeleteAccount = async () => {
    await api.deleteAccount(user.id);
    logout();
    setShowDeleteModal(false);
    showToast('Account deleted', 'info');
    navigate(ROUTES.landing);
  };

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate(ROUTES.landing);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink-900 flex items-center gap-2">
          <User className="w-6 h-6 text-brand-700" />
          <span>{t('profile.title')}</span>
        </h1>
        {isDemo && <Badge variant="sample" />}
      </div>

      {/* Passport Preview Card */}
      <Card className="p-4 bg-gradient-to-br from-brand-900 to-brand-700 text-white shadow-md relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-brand-100/80">
              Suraksha Chakra • Digital Passport
            </span>
            <h2 className="text-lg font-bold mt-1 text-white">{user.name}</h2>
            <div className="text-xs text-brand-100 font-mono mt-0.5">{user.workerId}</div>
            <div className="text-xs text-brand-100/80 mt-1">{user.city} • {maskedPhone}</div>
          </div>

          <div
            ref={qrContainerRef}
            className="p-2 bg-white rounded-xl shadow-sm shrink-0 cursor-pointer"
            onClick={() => setShowQrModal(true)}
            title="Tap to enlarge QR"
          >
            <QRCodeSVG value={fullVerifyUrl} size={70} />
          </div>
        </div>

        {/* Safety Score Meter */}
        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-brand-100/80 block">
              {t('profile.safetyScore')}
            </span>
            <span className="text-lg font-black text-white">{user.safetyScore} / 100</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label={t('passport.showQrFullScreen')}
            >
              <QrCode className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleDownloadQr}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label={t('passport.downloadQr')}
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleSharePassport}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label={t('passport.shareMyPassport')}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Passport Public Link Button */}
      <Button
        variant="ghost"
        className="w-full border border-ink-100 text-xs text-brand-700 font-bold justify-between bg-white"
        rightIcon={<ExternalLink className="w-4 h-4" />}
        onClick={() => navigate(verifyPath)}
      >
        <span>View public verification passport</span>
      </Button>

      {/* Training History */}
      <Card className="p-4 space-y-2">
        <h3 className="text-xs font-bold text-ink-900 flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-brand-700" />
          <span>{t('profile.trainingHistory')} ({completedModules.length} completed)</span>
        </h3>

        <div className="space-y-1.5 pt-1">
          {allModules.map((mod) => {
            const isDone = completedModules.includes(mod.id);
            return (
              <div
                key={mod.id}
                className="flex items-center justify-between p-2 rounded-lg bg-ink-100/40 text-xs"
              >
                <span className="text-ink-900 font-medium">{t(mod.titleKey)}</span>
                {isDone ? (
                  <span className="text-brand-700 font-bold inline-flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Completed
                  </span>
                ) : (
                  <span className="text-ink-500 text-[11px]">Not completed</span>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Account Settings / Actions */}
      <div className="space-y-2 pt-2">
        <Button
          variant="ghost"
          className="w-full border border-ink-100 text-xs font-semibold justify-between bg-white"
          leftIcon={<Edit3 className="w-4 h-4 text-brand-700" />}
          onClick={() => {
            setEditName(user.name);
            setEditCity(user.city);
            setEditLang(user.preferredLanguage);
            setShowEditSheet(true);
          }}
        >
          <span>{t('profile.editProfile')}</span>
        </Button>

        {isDemo ? (
          <Button
            variant="ghost"
            className="w-full border border-warn-500/30 text-xs font-semibold justify-between bg-white text-ink-900"
            leftIcon={<RotateCcw className="w-4 h-4 text-warn-500" />}
            onClick={() => setShowResetModal(true)}
          >
            <span>{t('profile.resetDemoData')}</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="w-full border border-danger-700/20 text-xs font-semibold justify-between bg-white text-danger-700 hover:bg-danger-100/40"
            leftIcon={<Trash2 className="w-4 h-4 text-danger-700" />}
            onClick={() => setShowDeleteModal(true)}
          >
            <span>{t('profile.deleteAccount')}</span>
          </Button>
        )}

        <Button
          variant="danger"
          className="w-full text-xs font-bold"
          leftIcon={<LogOut className="w-4 h-4" />}
          onClick={() => setShowLogoutModal(true)}
        >
          {t('profile.logout')}
        </Button>
      </div>

      {/* Full-Screen QR Modal */}
      <Modal isOpen={showQrModal} onClose={() => setShowQrModal(false)} title={t('passport.qrModalTitle')}>
        <div className="space-y-4 text-center py-2">
          <div className="p-4 bg-white rounded-2xl shadow-inner border border-ink-100 inline-block mx-auto">
            <QRCodeSVG value={fullVerifyUrl} size={220} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-ink-900">{user.name}</h4>
            <p className="text-xs text-ink-500 font-mono mt-0.5">{user.workerId}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="flex-1 border border-ink-100" onClick={handleDownloadQr}>
              {t('passport.downloadQr')}
            </Button>
            <Button variant="primary" size="sm" className="flex-1" onClick={handleSharePassport}>
              {t('passport.shareLink')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Profile Sheet */}
      <Sheet isOpen={showEditSheet} onClose={() => setShowEditSheet(false)} title={t('profile.editSheetTitle')}>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink-900 block mb-1">Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-ink-100 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-900 block mb-1">City</label>
            <select
              value={editCity}
              onChange={(e) => setEditCity(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-ink-100 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
            >
              <option value="Delhi">Delhi</option>
              <option value="Gurugram">Gurugram</option>
              <option value="Noida">Noida</option>
              <option value="Ghaziabad">Ghaziabad</option>
              <option value="Faridabad">Faridabad</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-900 block mb-1">Language</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditLang('en')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                  editLang === 'en' ? 'bg-brand-100 text-brand-900 border-brand-500' : 'border-ink-100'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setEditLang('hi')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                  editLang === 'hi' ? 'bg-brand-100 text-brand-900 border-brand-500' : 'border-ink-100'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 border border-ink-100"
              onClick={() => setShowEditSheet(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary" className="flex-1 font-bold" isLoading={isSaving}>
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Sheet>

      {/* Logout Modal */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title={t('profile.logoutConfirmTitle')}>
        <div className="space-y-4">
          <p className="text-xs text-ink-500">{t('profile.logoutConfirmDesc')}</p>
          <div className="flex gap-2">
            <Button variant="ghost" className="flex-1 border border-ink-100" onClick={() => setShowLogoutModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="danger" className="flex-1 font-bold" onClick={handleLogout}>
              {t('profile.logout')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reset Demo Modal */}
      <Modal isOpen={showResetModal} onClose={() => setShowResetModal(false)} title={t('profile.resetDemoData')}>
        <div className="space-y-4">
          <p className="text-xs text-ink-500">{t('profile.resetDemoConfirm')}</p>
          <div className="flex gap-2">
            <Button variant="ghost" className="flex-1 border border-ink-100" onClick={() => setShowResetModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" className="flex-1 font-bold" onClick={handleResetDemo}>
              Reset
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title={t('profile.deleteConfirmTitle')}>
        <div className="space-y-4">
          <p className="text-xs text-ink-500">{t('profile.deleteConfirmDesc')}</p>
          <div className="flex gap-2">
            <Button variant="ghost" className="flex-1 border border-ink-100" onClick={() => setShowDeleteModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="danger" className="flex-1 font-bold" onClick={handleDeleteAccount}>
              {t('common.delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
