'use client'

import { useState, useCallback, useRef } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import { MapPin, Navigation, Star, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Court } from '@/types'
import { COURT_DISTRICTS } from '@/lib/courts-data'

interface Props {
  courts: Court[]
}

const MAP_CENTER = { lat: -1.2921, lng: 36.8219 }
const MAP_STYLES = [
  { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e3edf7' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5f0e5' }] },
]

export function CourtsMapClient({ courts }: Props) {
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null)
  const [districtFilter, setDistrictFilter] = useState<string>('all')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const mapRef = useRef<google.maps.Map | null>(null)

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
  })

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  const filteredCourts = courts.filter(c => {
    if (showFeaturedOnly && !c.is_featured) return false
    if (districtFilter !== 'all' && c.district !== districtFilter) return false
    return true
  })

  function flyTo(court: Court) {
    mapRef.current?.panTo({ lat: court.lat, lng: court.lng })
    mapRef.current?.setZoom(16)
    setSelectedCourt(court)
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-mid">
        Failed to load Google Maps. Check your API key.
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-72px)]">
      {/* Sidebar */}
      <div className="w-full lg:w-80 xl:w-96 bg-white border-r border-gray-100 flex flex-col">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-mid" />
            <h2 className="font-display text-lg text-navy tracking-wide">COURTS</h2>
            <span className="ml-auto text-xs font-mono text-mid">{filteredCourts.length} shown</span>
          </div>
          <select
            value={districtFilter}
            onChange={e => setDistrictFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange/50"
          >
            <option value="all">All Districts</option>
            {COURT_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showFeaturedOnly}
              onChange={e => setShowFeaturedOnly(e.target.checked)}
              className="w-4 h-4 accent-orange"
            />
            <span className="text-sm text-navy">Featured courts only</span>
          </label>
        </div>

        {/* Court list */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {filteredCourts.map(court => (
            <button
              key={court.id}
              onClick={() => flyTo(court)}
              className={cn(
                'w-full text-left px-4 py-3.5 hover:bg-orange/5 transition-colors',
                selectedCourt?.id === court.id && 'bg-orange/10 border-l-2 border-orange'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                  court.is_featured ? 'bg-orange text-white' : 'bg-navy/5 text-navy'
                )}>
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy text-sm truncate">{court.name}</p>
                  <p className="text-xs text-mid mt-0.5">{court.district} · {court.surface}</p>
                  {court.is_featured && (
                    <span className="inline-flex items-center gap-1 text-xs text-orange font-mono mt-1">
                      <Star className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {!isLoaded ? (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <p className="text-mid text-sm font-mono">Loading map…</p>
          </div>
        ) : (
          <GoogleMap
            mapContainerClassName="w-full h-full"
            center={MAP_CENTER}
            zoom={13}
            onLoad={onMapLoad}
            options={{ styles: MAP_STYLES, streetViewControl: false, mapTypeControl: false }}
          >
            {filteredCourts.map(court => (
              <Marker
                key={court.id}
                position={{ lat: court.lat, lng: court.lng }}
                onClick={() => setSelectedCourt(court)}
                icon={{
                  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                    `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
                      <path d="M14 0C6.27 0 0 6.27 0 14c0 9.33 14 22 14 22S28 23.33 28 14C28 6.27 21.73 0 14 0z" fill="${court.is_featured ? '#F4622A' : '#1B2B6B'}"/>
                      <circle cx="14" cy="14" r="5" fill="white"/>
                    </svg>`
                  )}`,
                  scaledSize: new google.maps.Size(28, 36),
                }}
              />
            ))}

            {selectedCourt && (
              <InfoWindow
                position={{ lat: selectedCourt.lat, lng: selectedCourt.lng }}
                onCloseClick={() => setSelectedCourt(null)}
              >
                <div className="p-2 max-w-xs">
                  <p className="font-bold text-navy text-sm mb-1">{selectedCourt.name}</p>
                  <p className="text-xs text-gray-600 mb-0.5">{selectedCourt.address}</p>
                  <p className="text-xs text-gray-500 mb-2">{selectedCourt.surface} · {selectedCourt.hoops} hoops</p>
                  {selectedCourt.description && (
                    <p className="text-xs text-gray-500 mb-2">{selectedCourt.description}</p>
                  )}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCourt.lat},${selectedCourt.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-orange font-semibold hover:underline"
                  >
                    <Navigation className="w-3 h-3" /> Get Directions
                  </a>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </div>
    </div>
  )
}
