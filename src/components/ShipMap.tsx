import React, { useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { Ship } from '../types';

interface ShipMapProps {
  ships: Ship[];
}

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ShipMap: React.FC<ShipMapProps> = ({ ships }) => {
  const center = useMemo(() => {
    if (ships.length === 0) {
      return { lat: 0, lng: 0 };
    }
    const { latitude, longitude } = ships[0];
    return { lat: latitude, lng: longitude };
  }, []);

  return (
    <MapContainer center={center} zoom={3} className="h-full min-h-[400px] w-full rounded-xl">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {ships.map(ship => (
        <Marker key={ship.ship_id} position={{ lat: ship.latitude, lng: ship.longitude }} icon={markerIcon}>
          <Popup>
            <div className="space-y-1 text-sm">
              <p className="font-semibold">{ship.name}</p>
              <p>
                Lat: {ship.latitude.toFixed(2)} | Lng: {ship.longitude.toFixed(2)}
              </p>
              <p>{new Date(ship.timestamp).toLocaleString()}</p>
              <p className="text-cyan-300">{ship.activity}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ShipMap;
