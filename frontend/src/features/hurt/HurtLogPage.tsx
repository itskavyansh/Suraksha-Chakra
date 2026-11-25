import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Calendar,
  MapPin,
  Stethoscope,
  Trash2,
  Share2,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Sheet } from '@/components/ui/Sheet';
import { EmptyState } from '@/components/ui/EmptyState';
import { api } from '@/data/api';
import { Incident } from '@/types';
import { useSessionStore } from '@/store/sessionStore';
import { useToast } from '@/components/ui/Toast';

export const HurtLogPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const user = useSessionStore((state) => state.user);
  const { showToast } = useToast();

  const typeParam = searchParams.get('type') || 'needle';

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [injuryType, setInjuryType] = useState<'needle' | 'cut' | 'chemical' | 'other'>(
    (typeParam as 'needle' | 'cut' | 'chemical' | 'other') || 'needle'
  );
  const [dateTime, setDateTime] = useState<string>(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 16);
  });
  const [place, setPlace] = useState('');
  const [treatment, setTreatment] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirmation sheet
  const [deletingIncidentId, setDeletingIncidentId] = useState<string | null>(null);

  const fetchIncidents = React.useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const list = await api.getIncidents(user.id);
      setIncidents(list);
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!place.trim() || !treatment.trim()) {
      showToast('Please enter both location and treatment taken.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const typeTitles: Record<string, string> = {
        needle: t('hurt.typeNeedle'),
        cut: t('hurt.typeCut'),
        chemical: t('hurt.typeChemical'),
        other: t('hurt.typeOther'),
      };

      await api.saveIncident({
        userId: user.id,
        type: injuryType,
        title: typeTitles[injuryType] || 'Workplace injury',
        dateTime,
        place: place.trim(),
        treatment: treatment.trim(),
        note: notes.trim() || undefined,
      });

      showToast(t('hurt.incidentSavedToast'));
      setPlace('');
      setTreatment('');
      setNotes('');
      await fetchIncidents();
    } catch {
      showToast('Failed to save incident record.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!user || !deletingIncidentId) return;
    try {
      await api.deleteIncident(user.id, deletingIncidentId);
      showToast(t('hurt.incidentDeletedToast'));
      setDeletingIncidentId(null);
      await fetchIncidents();
    } catch {
      showToast('Could not delete incident', 'error');
    }
  };

  const handleShare = async (inc: Incident) => {
    const text = `Suraksha Chakra Injury Record:\nType: ${inc.title}\nDate: ${new Date(
      inc.dateTime
    ).toLocaleString()}\nPlace: ${inc.place}\nTreatment: ${inc.treatment}${
      inc.note ? `\nNote: ${inc.note}` : ''
    }`;

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: `Injury Record - ${inc.title}`,
          text,
        });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        showToast(t('common.copiedToClipboard'));
      }
    } catch {
      // User canceled or share failed
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(text);
          showToast(t('common.copiedToClipboard'));
        }
      } catch {
        showToast(t('common.shareFailed'), 'info');
      }
    }
  };

  return (
    <div className="flex-1 p-4 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-ink-900">
          {t('hurt.logTitle')}
        </h1>
        <p className="text-xs text-ink-500 mt-1">
          {t('hurt.logSubtitle')}
        </p>
      </div>

      {/* Incident Form */}
      <Card padding="md" className="border-brand-500/20">
        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-1">
              {t('hurt.whatHappened')} *
            </label>
            <select
              value={injuryType}
              onChange={(e) =>
                setInjuryType(e.target.value as 'needle' | 'cut' | 'chemical' | 'other')
              }
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-ink-100 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="needle">{t('hurt.typeNeedle')}</option>
              <option value="cut">{t('hurt.typeCut')}</option>
              <option value="chemical">{t('hurt.typeChemical')}</option>
              <option value="other">{t('hurt.typeOther')}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-1">
              {t('hurt.dateTime')} *
            </label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-ink-100 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-1">
              {t('hurt.place')} *
            </label>
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder={t('hurt.placePlaceholder')}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-ink-100 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-1">
              {t('hurt.treatment')} *
            </label>
            <input
              type="text"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              placeholder={t('hurt.treatmentPlaceholder')}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-ink-100 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-1">
              {t('hurt.notes')}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('hurt.notesPlaceholder')}
              className="w-full px-3 py-2 rounded-xl border border-ink-100 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full font-bold shadow-sm"
            isLoading={isSaving}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {t('hurt.saveRecord')}
          </Button>
        </form>
      </Card>

      {/* Saved Incidents List */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <FileText className="w-4 h-4 text-brand-700" />
          <h2 className="text-sm font-bold text-ink-900">
            {t('hurt.savedIncidents')}
          </h2>
        </div>

        {isLoading ? (
          <div className="p-4 text-center text-xs text-ink-500">Loading records...</div>
        ) : incidents.length === 0 ? (
          <EmptyState
            icon={<ShieldCheck className="w-7 h-7 text-brand-700" />}
            title="No records found"
            description={t('hurt.noIncidents')}
          />
        ) : (
          <div className="space-y-3">
            {incidents.map((inc) => (
              <Card key={inc.id} padding="md" className="border-l-4 border-l-danger-700 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-danger-700">
                      {inc.type}
                    </span>
                    <h3 className="font-bold text-sm text-ink-900 mt-0.5">
                      {inc.title}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handleShare(inc)}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center text-ink-500 hover:text-brand-700 rounded-lg"
                      aria-label="Share incident record"
                      title={t('common.share')}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingIncidentId(inc.id)}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center text-ink-500 hover:text-danger-700 rounded-lg"
                      aria-label="Delete incident record"
                      title={t('common.delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-2 space-y-1 text-xs text-ink-500">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-ink-400" />
                    <span>{new Date(inc.dateTime).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-ink-400" />
                    <span className="truncate">{inc.place}</span>
                  </div>
                  <div className="flex items-start space-x-1.5">
                    <Stethoscope className="w-3.5 h-3.5 flex-shrink-0 text-ink-400 mt-0.5" />
                    <span className="font-medium text-ink-900">{inc.treatment}</span>
                  </div>
                  {inc.note && (
                    <p className="text-[11px] text-ink-500 bg-ink-100/50 p-2 rounded-lg mt-2 italic">
                      &ldquo;{inc.note}&rdquo;
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Sheet */}
      <Sheet
        isOpen={!!deletingIncidentId}
        onClose={() => setDeletingIncidentId(null)}
        title={t('hurt.deleteConfirmTitle')}
      >
        <p className="text-xs text-ink-500 mb-5">
          {t('hurt.deleteConfirmDesc')}
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            className="flex-1 border border-ink-100"
            onClick={() => setDeletingIncidentId(null)}
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="danger"
            className="flex-1 font-bold"
            onClick={handleConfirmDelete}
          >
            {t('common.delete')}
          </Button>
        </div>
      </Sheet>
    </div>
  );
};
