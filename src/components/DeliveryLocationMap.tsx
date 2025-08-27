import { useState, useCallback, useRef } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import { MapPin, Navigation } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DeliveryLocation } from '@/types'
import { toast } from 'sonner'

const containerStyle = {
  width: '100%',
  height: '300px'
}

// Default center - you can set this to your business location
const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
}

interface DeliveryLocationMapProps {
  onLocationSelect: (location: DeliveryLocation) => void
  selectedLocation?: DeliveryLocation | null
}

export function DeliveryLocationMap({ onLocationSelect, selectedLocation }: DeliveryLocationMapProps) {
  const [mapCenter, setMapCenter] = useState(defaultCenter)
  const [markerPosition, setMarkerPosition] = useState<{lat: number, lng: number} | null>(
    selectedLocation ? { lat: selectedLocation.lat, lng: selectedLocation.lng } : null
  )
  const [isGeocodingAddress, setIsGeocodingAddress] = useState(false)
  const [hasError, setHasError] = useState(false)
  const mapRef = useRef<google.maps.Map | null>(null)

  // Check if API key is configured
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const isApiKeyConfigured = apiKey && apiKey !== 'YOUR_API_KEY_HERE'

  // Load Google Maps API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries: ['geometry', 'drawing'] as const
  })

  // Handle load error
  if (loadError || !isApiKeyConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin size={20} />
            Delivery Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-muted rounded-lg text-center space-y-3">
            <MapPin size={48} className="mx-auto text-muted-foreground" />
            <div>
              <p className="font-medium">Map Not Available</p>
              <p className="text-sm text-muted-foreground">
                {!isApiKeyConfigured 
                  ? 'Google Maps API key not configured. Please enter your delivery address manually below.'
                  : 'Failed to load Google Maps. Please enter your delivery address manually below.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  const onUnmount = useCallback(() => {
    mapRef.current = null
  }, [])

  // Geocode coordinates to get address
  const geocodeLatLng = async (lat: number, lng: number): Promise<string> => {
    if (!window.google) {
      throw new Error('Google Maps not loaded')
    }

    const geocoder = new window.google.maps.Geocoder()
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && Array.isArray(results) && results.length > 0 && results[0]) {
          resolve(results[0].formatted_address)
        } else {
          reject(new Error('Failed to get address'))
        }
      })
    })
  }

  // Handle map click to place marker
  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return

    const lat = event.latLng.lat()
    const lng = event.latLng.lng()

    setMarkerPosition({ lat, lng })
    setIsGeocodingAddress(true)

    try {
      const address = await geocodeLatLng(lat, lng)
      onLocationSelect({ lat, lng, address })
      toast.success('Delivery location selected!')
    } catch (error) {
      toast.error('Failed to get address for this location')
      console.error('Geocoding error:', error)
    } finally {
      setIsGeocodingAddress(false)
    }
  }

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        
        setMapCenter({ lat, lng })
        setMarkerPosition({ lat, lng })
        
        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng })
          mapRef.current.setZoom(15)
        }

        setIsGeocodingAddress(true)
        try {
          const address = await geocodeLatLng(lat, lng)
          onLocationSelect({ lat, lng, address })
          toast.success('Current location set as delivery address!')
        } catch (error) {
          toast.error('Failed to get address for current location')
        } finally {
          setIsGeocodingAddress(false)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        toast.error('Failed to get your current location')
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin size={20} />
            Delivery Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin size={20} />
          Select Delivery Location
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Click on the map to set your delivery location, or use your current location
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            className="flex items-center gap-2"
          >
            <Navigation size={16} />
            Use Current Location
          </Button>
          {selectedLocation && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin size={12} />
              Location Selected
            </Badge>
          )}
        </div>

        <div className="relative rounded-lg overflow-hidden border">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={13}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={handleMapClick}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }]
                }
              ]
            }}
          >
            {markerPosition && (
              <Marker
                position={markerPosition}
                animation={window.google?.maps.Animation.DROP}
                icon={{
                  url: "data:image/svg+xml;charset=UTF-8,%3csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z' fill='%23B7410E'/%3e%3ccircle cx='12' cy='9' r='2.5' fill='white'/%3e%3c/svg%3e",
                  scaledSize: new window.google.maps.Size(32, 32),
                  anchor: new window.google.maps.Point(16, 32)
                }}
              />
            )}
          </GoogleMap>
          
          {isGeocodingAddress && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
              <div className="bg-background border rounded-lg p-3 shadow-lg">
                <p className="text-sm">Getting address...</p>
              </div>
            </div>
          )}
        </div>

        {selectedLocation && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">Selected Address:</p>
            <p className="text-sm text-muted-foreground">{selectedLocation.address}</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>• Click anywhere on the map to set your delivery location</p>
          <p>• We'll deliver within a 5-mile radius of our store</p>
        </div>
      </CardContent>
    </Card>
  )
}