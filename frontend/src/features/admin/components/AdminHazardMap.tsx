import React from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { HazardReport } from '@/types';

export const CATEGORY_COLORS: Record<string, string> = {
  sharps: '#C62828',
  glass: '#F08A4B',
  batteries: '#F2A93B',
  chemicals: '#6B4FD8',
  medical: '#C62828',
  general: '#2E9E6B',
  unknown: '#5C6B64',
};

interface AdminHazardMapProps {
  reports: HazardReport[];
  height?: string;
  center?: [number, number];
  zoom?: number;
}

export const AdminHazardMap: React.FC<AdminHazardMapProps> = ({
  reports,
  height = '360px',
  center = [28.6139, 77.2090],
  zoom = 11,
}) => {
  // Only render markers with valid lat/lng
  const geoReports = reports.filter(
    (r) => typeof r.lat === 'number' && typeof r.lng === 'number' && !isNaN(r.lat) && !isNaN(r.lng)
  );

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-ink-100 shadow-sm relative z-0">
      <div style={{ height, width: '100%' }}>
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {geoReports.map((report) => {
            const color = CATEGORY_COLORS[report.category] || '#5C6B64';

            return (
              <CircleMarker
                key={report.id}
                center={[report.lat!, report.lng!]}
                radius={8}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.75,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="text-xs p-1 space-y-1">
                    <div className="flex items-center justify-between gap-2 border-b pb-1 font-bold">
                      <span className="capitalize" style={{ color }}>
                        {report.category}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {Math.round(report.confidence * 100)}%
                      </span>
                    </div>
                    <p className="font-semibold text-gray-800">{report.label}</p>
                    <p className="text-[10px] text-gray-500">
                      Worker: {report.workerId}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {report.createdAt.split('T')[0]}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
