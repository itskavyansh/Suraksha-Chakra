import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { HazardReport } from '../../../types';

interface HazardHeatmapProps {
  reports: HazardReport[];
}

interface HeatPoint {
  lat: number;
  lng: number;
  intensity: number;
}

// Subcomponent to add leaflet.heat layer to the Leaflet map
const HeatLayer: React.FC<{ points: HeatPoint[] }> = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;
    let heatInstance: any = null;

    const initHeat = async () => {
      try {
        if (typeof window !== 'undefined') {
          (window as any).L = L;
          await import('leaflet.heat');
          if (typeof (L as any).heatLayer === 'function') {
            const heatData = points.map((p) => [p.lat, p.lng, p.intensity]);
            heatInstance = (L as any).heatLayer(heatData, {
              radius: 28,
              blur: 18,
              maxZoom: 13,
              max: 1.0,
              gradient: { 0.3: '#1E6FD9', 0.6: '#F59E0B', 0.9: '#DC2626' },
            }).addTo(map);
          }
        }
      } catch (err) {
        console.warn('leaflet.heat plugin not loaded, using circle markers fallback', err);
      }
    };

    initHeat();

    return () => {
      if (heatInstance && map) {
        try {
          map.removeLayer(heatInstance);
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, [map, points]);

  return null;
};

export const HazardHeatmap: React.FC<HazardHeatmapProps> = ({ reports }) => {
  const { t } = useTranslation();
  const [offlineTileError, setOfflineTileError] = useState(false);

  const now = Date.now();
  const validReports = reports.filter(
    (r): r is HazardReport & { lat: number; lng: number } =>
      typeof r.lat === 'number' && typeof r.lng === 'number',
  );

  const heatPoints: HeatPoint[] = validReports.map((r) => {
    const ageDays = (now - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    const intensity = Math.max(0.35, Math.min(1.0, 1 - ageDays / 30));
    return { lat: r.lat, lng: r.lng, intensity };
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-bold text-sm text-slate-900">
          {t('admin.heatmap_title')}
        </h3>

        {/* Legend High/Medium/Low */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <span className="text-slate-600">{t('admin.heat_high')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600">{t('admin.heat_med')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-slate-600">{t('admin.heat_low')}</span>
          </div>
        </div>
      </div>

      {/* Map container with fallback styling for offline mode */}
      <div className="h-72 w-full rounded-xl overflow-hidden border border-slate-200 relative bg-[#F1F5F3]">
        <MapContainer
          center={[28.6139, 77.209]}
          zoom={10}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', backgroundColor: '#F1F5F3' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            eventHandlers={{
              tileerror: () => setOfflineTileError(true),
            }}
          />

          <HeatLayer points={heatPoints} />

          {/* Circle markers fallback ensuring coordinates always show even offline */}
          {validReports.map((r) => {
            const isDanger = r.category === 'sharps' || r.category === 'chemicals';
            return (
              <CircleMarker
                key={r.id}
                center={[r.lat, r.lng]}
                radius={6}
                pathOptions={{
                  color: isDanger ? '#DC2626' : '#D97706',
                  fillColor: isDanger ? '#EF4444' : '#F59E0B',
                  fillOpacity: 0.8,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">{r.label}</p>
                    <p className="text-slate-500 capitalize">{r.category}</p>
                    <p className="text-slate-600 font-semibold mt-0.5">
                      {Math.round(r.confidence * 100)}% confidence
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {offlineTileError && (
          <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[11px] px-2 py-1 rounded-md z-[1000] pointer-events-none">
            Offline Mode: Rendering Map Points
          </div>
        )}
      </div>
    </div>
  );
};
