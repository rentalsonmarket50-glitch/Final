import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Map } from 'react-map-gl';

interface IAppMap extends PropsWithChildren<any> {
  center?: {
    longitude?: number;
    latitude?: number;
    lat?: number;
    long?: number;
  };
}

const AppMap: FC<IAppMap> = ({ children, center }) => {
  const [mounted, setMounted] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Default coordinates for Chandigarh
  const defaultLat = 30.7333;
  const defaultLng = 76.7794;

  // Support both lat/long and latitude/longitude formats
  const latitude = center?.latitude ?? center?.lat ?? defaultLat;
  const longitude = center?.longitude ?? center?.long ?? defaultLng;

  const [viewState, setViewState] = React.useState({
    latitude: latitude,
    longitude: longitude,
    zoom: 14,
  });

  // Only render map on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update viewState when center changes
  useEffect(() => {
    if (center?.latitude && center?.longitude) {
      setViewState({
        latitude: center.latitude,
        longitude: center.longitude,
        zoom: 14,
      });
    } else if (center?.lat && center?.long) {
      setViewState({
        latitude: center.lat,
        longitude: center.long,
        zoom: 14,
      });
    }
  }, [center]);

  // Don't render map if coordinates are invalid
  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-xl">
        <p className="text-gray-500">Map unavailable</p>
      </div>
    );
  }

  // Check if mapbox token is available
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  // If no token or error, show placeholder
  if (!mapboxToken || mapError || !mounted) {
    return (
      <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center rounded-xl border border-gray-200">
        <div className="text-center p-4">
          <p className="text-gray-600 font-medium mb-2">Map View</p>
          <p className="text-sm text-gray-500">
            {!mapboxToken ? 'Mapbox token not configured' : 'Loading map...'}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Map
        {...viewState}
        mapStyle={
          process.env.NEXT_PUBLIC_MAPBOX_STYLE || 'mapbox://styles/mapbox/streets-v12'
        }
        mapboxAccessToken={mapboxToken}
        style={{ width: '100%', height: '100%' }}
        onMove={(evt) => {
          if (evt?.viewState) {
            setViewState(evt.viewState);
          }
        }}
        onError={(error) => {
          console.error('Map error:', error);
          setMapError(true);
        }}
      >
        {children}
      </Map>
    </div>
  );
};

export default AppMap;
