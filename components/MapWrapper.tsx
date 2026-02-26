'use client';

import dynamic from 'next/dynamic';
import { Alert } from '@/types/alert';
import maplibregl from 'maplibre-gl';

// Dynamically import Map component with SSR disabled
const Map = dynamic(() => import('./Map'), {
    ssr: false,
    loading: () => (
        <div className="map-loading">
            <div className="map-loading-content">
                Carregando mapa...
            </div>
        </div>
    ),
});

interface MapWrapperProps {
    alerts: Alert[];
    userLocation: { latitude: number; longitude: number } | null;
    showSheltersOnly?: boolean;
    onMapReady?: (map: maplibregl.Map) => void;
}

export default function MapWrapper({ alerts, userLocation, showSheltersOnly, onMapReady }: MapWrapperProps) {
    return (
        <Map
            alerts={alerts}
            userLocation={userLocation}
            showSheltersOnly={showSheltersOnly}
            onMapReady={onMapReady}
        />
    );
}
