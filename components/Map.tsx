'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { Alert, ALERT_TYPES } from '@/types/alert';

interface MapProps {
    center?: [number, number];
    zoom?: number;
    alerts: Alert[];
    userLocation: { latitude: number; longitude: number } | null;
    showSheltersOnly?: boolean;
    onMapReady?: (map: maplibregl.Map) => void;
}

export default function Map({
    center = [-43.3516, -21.7645], // Juiz de Fora coordinates as default
    zoom = 13,
    alerts,
    userLocation,
    showSheltersOnly = false,
    onMapReady,
}: MapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const markers = useRef<maplibregl.Marker[]>([]);

    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        // Initialize map
        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://demotiles.maplibre.org/style.json',
            center: userLocation ? [userLocation.longitude, userLocation.latitude] : center,
            zoom: zoom,
        });

        if (onMapReady && map.current) {
            onMapReady(map.current);
        }

        // Cleanup on unmount
        return () => {
            markers.current.forEach(marker => marker.remove());
            markers.current = [];
            map.current?.remove();
            map.current = null;
        };
    }, []);

    // Update user location marker
    useEffect(() => {
        if (!map.current || !userLocation) return;

        const el = document.createElement('div');
        el.className = 'user-location-marker';

        new maplibregl.Marker({ element: el })
            .setLngLat([userLocation.longitude, userLocation.latitude])
            .addTo(map.current);
    }, [userLocation]);

    // Update alerts on map
    useEffect(() => {
        if (!map.current) return;

        // Clear existing markers
        markers.current.forEach(marker => marker.remove());
        markers.current = [];

        const filteredAlerts = showSheltersOnly
            ? alerts.filter(alert => alert.type === 'abrigo')
            : alerts;

        filteredAlerts.forEach(alert => {
            const alertInfo = ALERT_TYPES[alert.type];

            if (alertInfo.category === 'environmental') {
                // Create circle for environmental events
                const el = document.createElement('div');
                el.className = 'alert-circle';
                el.style.backgroundColor = alertInfo.color;
                el.style.opacity = '0.3';

                const marker = new maplibregl.Marker({ element: el })
                    .setLngLat([alert.longitude, alert.latitude])
                    .addTo(map.current!);

                markers.current.push(marker);
            } else {
                // Create marker for human events
                const el = document.createElement('div');
                el.className = 'alert-marker';
                el.innerHTML = `<div class="alert-marker-content" style="background: ${alertInfo.color}">${alertInfo.icon}</div>`;

                const marker = new maplibregl.Marker({ element: el })
                    .setLngLat([alert.longitude, alert.latitude])
                    .addTo(map.current!);

                markers.current.push(marker);
            }
        });
    }, [alerts, showSheltersOnly]);

    return <div ref={mapContainer} className="map-container" />;
}
