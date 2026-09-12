"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface LocationMapProps {
  latitude: number | null
  longitude: number | null
  isEditing: boolean
  onLocationChange?: (lat: number, lng: number) => void
}

const DEFAULT_CENTER: [number, number] = [-2.5489, 118.0149]
const DEFAULT_ZOOM = 5

const ClickHandler = ({ onLocationChange }: { onLocationChange?: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onLocationChange?.(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], 15)
  }, [lat, lng, map])
  return null
}

export default function LocationMap({ latitude, longitude, isEditing, onLocationChange }: LocationMapProps) {
  const hasCoords = latitude !== null && longitude !== null
  const center: [number, number] = hasCoords ? [latitude!, longitude!] : DEFAULT_CENTER
  const zoom = hasCoords ? 15 : DEFAULT_ZOOM

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200 h-48">
      {isEditing && (
        <div className="absolute top-2 left-2 z-[1000] bg-blue-600 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow">
          Klik pada peta untuk menandai lokasi
        </div>
      )}
      <MapContainer center={center} zoom={zoom} className="w-full h-full" zoomControl>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {isEditing && <ClickHandler onLocationChange={onLocationChange} />}
        {hasCoords && (
          <>
            <Marker position={[latitude!, longitude!]} icon={defaultIcon} />
            <RecenterMap lat={latitude!} lng={longitude!} />
          </>
        )}
      </MapContainer>
    </div>
  )
}