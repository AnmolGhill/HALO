import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { GoogleMap, MarkerF, useJsApiLoader, InfoWindowF } from '@react-google-maps/api';

// Container sizes: responsive (mobile/desktop)
const containerStyle = {
  width: '100%',
  height: '320px'
};

const desktopStyle = {
  width: '100%',
  height: '420px'
};

// Medical service types for Places API
const MEDICAL_TYPES = [
  'hospital',
  'doctor',
  'pharmacy',
  'physiotherapist',
  'dentist'
];

/**
 * Enhanced GoogleMapWidget with geolocation and medical services
 * Props:
 * - center: { lat: number, lng: number }
 * - zoom: number
 * - showNearbyServices: boolean
 */
const GoogleMapWidget = ({
  center = { lat: 28.6139, lng: 77.2090 }, // New Delhi default
  zoom = 14,
  showNearbyServices = true,
}) => {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 768px)').matches);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapType, setMapType] = useState('roadmap');
  const [locationPermission, setLocationPermission] = useState('prompt');
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const handler = (e) => setIsDesktop(e.matches);
    if (mql.addEventListener) mql.addEventListener('change', handler);
    else mql.addListener(handler);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', handler);
      else mql.removeListener(handler);
    };
  }, []);

  const libraries = useMemo(() => ['places'], []);

  // Request user location permission on first load
  useEffect(() => {
    const requestLocation = async () => {
      if (!navigator.geolocation) {
        console.log('Geolocation is not supported by this browser.');
        setLocationPermission('denied');
        return;
      }

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          });
        });

        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        setUserLocation(userPos);
        setMapCenter(userPos);
        setLocationPermission('granted');
        console.log('📍 User location obtained:', userPos);

      } catch (error) {
        console.log('Location access denied or failed:', error.message);
        setLocationPermission('denied');
        // Keep default center (New Delhi)
      }
    };

    // Only request location if not already determined
    if (locationPermission === 'prompt') {
      requestLocation();
    }
  }, [locationPermission]);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const [map, setMap] = useState(null);
  
  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Search for nearby medical services
  const searchNearbyMedicalServices = useCallback((location, mapInstance) => {
    if (!mapInstance || !showNearbyServices || !window.google?.maps?.places) {
      return;
    }

    setIsLoadingPlaces(true);
    const service = new window.google.maps.places.PlacesService(mapInstance);
    
    const request = {
      location: location,
      radius: 5000, // 5km radius
      types: MEDICAL_TYPES
    };

    service.nearbySearch(request, (results, status) => {
      setIsLoadingPlaces(false);
      
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        // Filter and limit results
        const medicalPlaces = results
          .filter(place => place.rating && place.rating > 3.0) // Only well-rated places
          .slice(0, 20) // Limit to 20 places
          .map(place => ({
            id: place.place_id,
            name: place.name,
            position: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            },
            rating: place.rating,
            types: place.types,
            vicinity: place.vicinity,
            photos: place.photos,
            icon: place.icon
          }));
        
        setNearbyPlaces(medicalPlaces);
        console.log(`🏥 Found ${medicalPlaces.length} nearby medical services`);
      } else {
        console.log('Places search failed:', status);
        setNearbyPlaces([]);
      }
    });
  }, [showNearbyServices]);

  // Search for medical services when map loads and location is available
  useEffect(() => {
    if (map && (userLocation || mapCenter)) {
      const searchLocation = userLocation || mapCenter;
      searchNearbyMedicalServices(searchLocation, map);
    }
  }, [map, userLocation, mapCenter, searchNearbyMedicalServices]);

  // Toggle map type between roadmap and satellite
  const toggleMapType = () => {
    setMapType(prevType => prevType === 'roadmap' ? 'satellite' : 'roadmap');
  };

  // Get marker icon based on place type
  const getMarkerIcon = (placeTypes) => {
    if (placeTypes.includes('hospital')) return '🏥';
    if (placeTypes.includes('pharmacy')) return '💊';
    if (placeTypes.includes('doctor')) return '👨‍⚕️';
    if (placeTypes.includes('dentist')) return '🦷';
    if (placeTypes.includes('physiotherapist')) return '🤲';
    return '⚕️';
  };

  if (loadError) {
    return (
      <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Failed to load Google Maps.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', borderRadius: '12px' }}>
        <p>Loading map…</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', ...(isDesktop ? desktopStyle : containerStyle) }}>
      {/* Map Type Toggle Button */}
      <button
        onClick={toggleMapType}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          backgroundColor: 'white',
          border: '2px solid #ccc',
          borderRadius: '4px',
          padding: '8px 12px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        {mapType === 'roadmap' ? '🛰️ Satellite' : '🗺️ Map'}
      </button>

      {/* Loading indicator for places */}
      {isLoadingPlaces && (
        <div style={{
          position: 'absolute',
          top: '50px',
          right: '10px',
          zIndex: 1000,
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          🔍 Finding medical services...
        </div>
      )}

      {/* Location status indicator */}
      {locationPermission !== 'prompt' && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          zIndex: 1000,
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: '6px 10px',
          borderRadius: '4px',
          fontSize: '11px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          {locationPermission === 'granted' ? '📍 Your location' : '🌍 Default location'}
        </div>
      )}

      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '12px' }}
        center={mapCenter}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        mapTypeId={mapType}
        options={{
          disableDefaultUI: false,
          clickableIcons: true,
          fullscreenControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: true,
          scaleControl: true,
        }}
      >
        {/* User location marker */}
        {userLocation && (
          <MarkerF
            position={userLocation}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="white" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(24, 24),
            }}
            title="Your Location"
          />
        )}

        {/* Nearby medical services markers */}
        {nearbyPlaces.map((place) => (
          <MarkerF
            key={place.id}
            position={place.position}
            title={place.name}
            onClick={() => setSelectedPlace(place)}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" fill="white" stroke="#dc2626" stroke-width="2"/>
                  <text x="16" y="20" text-anchor="middle" font-size="16">${getMarkerIcon(place.types)}</text>
                </svg>
              `)}`,
              scaledSize: new window.google.maps.Size(32, 32),
            }}
          />
        ))}

        {/* Info window for selected place */}
        {selectedPlace && (
          <InfoWindowF
            position={selectedPlace.position}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div style={{ maxWidth: '200px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{selectedPlace.name}</h4>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>
                {selectedPlace.vicinity}
              </p>
              {selectedPlace.rating && (
                <p style={{ margin: '0', fontSize: '12px' }}>
                  ⭐ {selectedPlace.rating}/5
                </p>
              )}
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#888' }}>
                {getMarkerIcon(selectedPlace.types)} {selectedPlace.types.includes('hospital') ? 'Hospital' : 
                 selectedPlace.types.includes('pharmacy') ? 'Pharmacy' :
                 selectedPlace.types.includes('doctor') ? 'Doctor' :
                 selectedPlace.types.includes('dentist') ? 'Dentist' : 'Medical Service'}
              </p>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapWidget;
