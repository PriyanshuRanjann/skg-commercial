"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Point = { lat: number; lng: number; label: string; kind: "start" | "end" };

// Default Pune center
const FALLBACK = { lat: 18.5204, lng: 73.8567 } as const;

export default function ShiftMap({ points }: { points: Point[] }) {
  // Patch default marker icon URLs (Next.js + Leaflet needs explicit paths)
  useEffect(() => {
    const proto = L.Icon.Default.prototype as unknown as { _getIconUrl?: () => string };
    delete proto._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const center = points[0] ?? FALLBACK;

  return (
    <div className="h-72 md:h-96">
      <MapContainer
        center={[center.lat, center.lng] as [number, number]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((p, i) => (
          <Marker key={i} position={[p.lat, p.lng]}>
            <Popup>
              <span className="font-semibold">{p.label}</span>
              <br />
              {p.kind === "start" ? "Start" : "End"} location
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
