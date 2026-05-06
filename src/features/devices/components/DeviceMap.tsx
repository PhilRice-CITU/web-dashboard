import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'

import 'leaflet/dist/leaflet.css'

import type { MapDevice } from '#/features/dashboard/types/dashboard.types'

const MAP_CENTER: [number, number] = [12.8797, 121.774]
const DEFAULT_ZOOM = 7
const SINGLE_DEVICE_ZOOM = 14
const MAX_AUTO_ZOOM = 14

function getStatusColor(status: MapDevice['status']) {
  if (status === 'active') {
    return '#16a34a'
  }

  if (status === 'scanning') {
    return '#f59e0b'
  }

  return '#6b7280'
}

function createStatusIcon(status: MapDevice['status']) {
  const markerHtml = `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:${getStatusColor(status)};border:2px solid #ffffff;box-shadow:0 1px 4px rgba(0,0,0,0.35);"></span>`

  return L.divIcon({
    className: 'device-status-marker',
    html: markerHtml,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

function MapViewportController({ devices }: { devices: MapDevice[] }) {
  const map = useMap()

  useEffect(() => {
    if (!devices.length) {
      map.flyTo(MAP_CENTER, DEFAULT_ZOOM, {
        animate: true,
        duration: 0.6,
        easeLinearity: 0.2,
      })
      return
    }

    if (devices.length === 1) {
      const [device] = devices
      map.flyTo([device.latitude, device.longitude], SINGLE_DEVICE_ZOOM, {
        animate: true,
        duration: 0.8,
        easeLinearity: 0.2,
      })
      return
    }

    const bounds = L.latLngBounds(
      devices.map(
        (device) => [device.latitude, device.longitude] as [number, number],
      ),
    )

    map.fitBounds(bounds, {
      padding: [24, 24],
      maxZoom: MAX_AUTO_ZOOM,
      animate: true,
      duration: 0.8,
      easeLinearity: 0.2,
    })
  }, [devices, map])

  return null
}

export function DeviceMap({ devices }: { devices: MapDevice[] }) {
  const [isMounted, setIsMounted] = useState(false)
  const [tilesReady, setTilesReady] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex h-full min-h-80 items-center justify-center bg-slate-950 text-sm text-slate-300">
        Loading map...
      </div>
    )
  }

  return (
    <div className="leaflet-dark-map relative h-full min-h-80 overflow-hidden bg-slate-950">
      <MapContainer
        center={MAP_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        zoomSnap={0.25}
        zoomDelta={0.25}
        wheelDebounceTime={60}
        wheelPxPerZoomLevel={90}
        className="h-full w-full"
        style={{ background: '#020617' }}
      >
        <MapViewportController devices={devices} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          className="map-tiles"
          eventHandlers={{
            load: () => setTilesReady(true),
          }}
        />

        {devices.map((device) => (
          <Marker
            key={device.id}
            position={[device.latitude, device.longitude]}
            icon={createStatusIcon(device.status)}
          >
            <Popup>
              <div className="space-y-1 font-mono text-xs">
                <p className="text-sm font-semibold">{device.name}</p>
                <p>Status: {device.status}</p>
                <p>CPU: {device.cpu}%</p>
                <p>Location: {device.location}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {!tilesReady ? (
        <div className="pointer-events-none absolute inset-0 z-10 bg-slate-950" />
      ) : null}
    </div>
  )
}
