'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import MapWrapper from '@/components/MapWrapper';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import MapControls from '@/components/MapControls';
import MapLegend from '@/components/MapLegend';
import ReportModal from '@/components/ReportModal';
import AlertsList from '@/components/AlertsList';
import { useAlerts } from '@/hooks/useAlerts';
import { useGeolocation } from '@/hooks/useGeolocation';
import { AlertType } from '@/types/alert';
import maplibregl from 'maplibre-gl';

export default function Home() {
    const [activeTab, setActiveTab] = useState<'map' | 'alerts'>('map');
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [showSheltersOnly, setShowSheltersOnly] = useState(false);
    const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);

    const { alerts, addAlert, deleteAlert } = useAlerts();
    const { latitude, longitude, loading: locationLoading } = useGeolocation();

    const userLocation = useMemo(() =>
        latitude !== null && longitude !== null
            ? { latitude, longitude }
            : null,
        [latitude, longitude]
    );

    // Debug: Log user location changes
    useEffect(() => {
        if (userLocation) {
            console.log('📍 Localização do usuário atualizada:', userLocation);
        } else if (locationLoading) {
            console.log('⏳ Aguardando geolocalização...');
        }
    }, [userLocation, locationLoading]);

    const handleMapReady = useCallback((map: maplibregl.Map) => {
        setMapInstance(map);
    }, []);

    const handleRecenterMap = () => {
        if (mapInstance && userLocation) {
            mapInstance.flyTo({
                center: [userLocation.longitude, userLocation.latitude],
                zoom: 14,
            });
        }
    };

    const handleToggleShelters = () => {
        setShowSheltersOnly(!showSheltersOnly);
    };

    const handleSubmitReport = (type: AlertType, lat: number, lng: number) => {
        addAlert(type, lat, lng);
    };

    return (
        <div className="app-container">
            <Header />

            <main className="main-content">
                {activeTab === 'map' && (
                    <>
                        <MapWrapper
                            alerts={alerts}
                            userLocation={userLocation}
                            showSheltersOnly={showSheltersOnly}
                            onMapReady={handleMapReady}
                        />
                        <MapLegend />
                        <MapControls
                            onRecenter={handleRecenterMap}
                            onToggleShelters={handleToggleShelters}
                            showSheltersOnly={showSheltersOnly}
                        />
                        <FloatingActionButton onClick={() => setIsReportModalOpen(true)} />
                    </>
                )}

                {activeTab === 'alerts' && (
                    <AlertsList alerts={alerts} onDelete={deleteAlert} />
                )}
            </main>

            <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                onSubmit={handleSubmitReport}
                userLocation={userLocation}
            />
        </div>
    );
}
