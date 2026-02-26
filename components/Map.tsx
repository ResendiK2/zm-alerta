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
    const mapLoaded = useRef(false);
    const userLocationMarker = useRef<maplibregl.Marker | null>(null);
    const hasInitializedUserLocation = useRef(false);

    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        // Initialize map with OpenStreetMap style
        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    osm: {
                        type: 'raster',
                        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: '&copy; OpenStreetMap Contributors',
                        maxzoom: 19
                    }
                },
                layers: [
                    {
                        id: 'osm',
                        type: 'raster',
                        source: 'osm'
                    }
                ]
            },
            center: center,
            zoom: zoom,
        });

        // Handle map load event
        map.current.on('load', () => {
            mapLoaded.current = true;
            console.log('✅ Mapa carregado com sucesso');
        });

        // Handle map errors
        map.current.on('error', (e) => {
            console.error('❌ Erro no mapa:', e);
        });

        if (onMapReady && map.current) {
            onMapReady(map.current);
        }

        // Cleanup on unmount
        return () => {
            userLocationMarker.current?.remove();
            markers.current.forEach(marker => marker.remove());
            markers.current = [];
            map.current?.remove();
            map.current = null;
            hasInitializedUserLocation.current = false;
            mapLoaded.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update user location marker and center map when location changes
    useEffect(() => {
        if (!map.current || !userLocation) return;

        console.log('📍 Localização recebida no Map.tsx:', userLocation);

        // Remove old user location marker
        if (userLocationMarker.current) {
            userLocationMarker.current.remove();
        }

        // Create new user location marker
        const el = document.createElement('div');
        el.className = 'user-location-marker';

        userLocationMarker.current = new maplibregl.Marker({ element: el })
            .setLngLat([userLocation.longitude, userLocation.latitude])
            .addTo(map.current);

        // Center map on user location only on first location received
        if (!hasInitializedUserLocation.current) {
            console.log('🎯 Centralizando mapa na localização do usuário');
            hasInitializedUserLocation.current = true;

            map.current.flyTo({
                center: [userLocation.longitude, userLocation.latitude],
                zoom: 15,
                essential: true,
                duration: 2000
            });
        }
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
                // Create circle with icon for environmental events
                const el = document.createElement('div');
                el.className = 'alert-circle';

                // Convert hex to rgba for opacity
                const hex = alertInfo.color.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                el.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.25)`;

                // Add icon in the center
                const iconEl = document.createElement('div');
                iconEl.className = 'alert-circle-icon';
                iconEl.innerHTML = alertInfo.icon;
                el.appendChild(iconEl);

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
