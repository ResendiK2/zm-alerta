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
    const [showLocationBanner, setShowLocationBanner] = useState(true);
    const [mapCenter, setMapCenter] = useState<{ latitude: number; longitude: number } | null>(null);

    const { alerts, myAlerts, addAlert, deleteAlert } = useAlerts();
    const { latitude, longitude, loading: locationLoading, error: locationError, permissionState } = useGeolocation();

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

    // Auto-hide banner after location is granted or after some time
    useEffect(() => {
        if (userLocation || permissionState === 'denied') {
            const timer = setTimeout(() => setShowLocationBanner(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [userLocation, permissionState]);

    const handleMapReady = useCallback((map: maplibregl.Map) => {
        setMapInstance(map);

        // Atualiza o centro do mapa quando ele se move
        const updateMapCenter = () => {
            const center = map.getCenter();
            setMapCenter({
                latitude: center.lat,
                longitude: center.lng,
            });
        };

        // Define o centro inicial
        updateMapCenter();

        // Atualiza o centro quando o mapa é movido
        map.on('moveend', updateMapCenter);
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

    const handleSubmitReport = async (type: AlertType, lat: number, lng: number) => {
        try {
            await addAlert(type, lat, lng);
            console.log('✅ Alerta enviado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao enviar alerta:', error);
        }
    };

    // Renderiza o banner de localização
    const renderLocationBanner = () => {
        if (!showLocationBanner) return null;

        if (locationLoading && !userLocation) {
            return (
                <div className="location-banner location-banner-info">
                    <div className="location-banner-content">
                        <span className="location-banner-icon">📍</span>
                        <span>Solicitando permissão de localização...</span>
                    </div>
                    <button
                        className="location-banner-close"
                        onClick={() => setShowLocationBanner(false)}
                        aria-label="Fechar"
                    >
                        ×
                    </button>
                </div>
            );
        }

        if (locationError) {
            return (
                <div className="location-banner location-banner-error">
                    <div className="location-banner-content">
                        <span className="location-banner-icon">⚠️</span>
                        <span>{locationError}</span>
                    </div>
                    <button
                        className="location-banner-close"
                        onClick={() => setShowLocationBanner(false)}
                        aria-label="Fechar"
                    >
                        ×
                    </button>
                </div>
            );
        }

        if (userLocation) {
            return (
                <div className="location-banner location-banner-success">
                    <div className="location-banner-content">
                        <span className="location-banner-icon">✅</span>
                        <span>Localização ativada com sucesso!</span>
                    </div>
                    <button
                        className="location-banner-close"
                        onClick={() => setShowLocationBanner(false)}
                        aria-label="Fechar"
                    >
                        ×
                    </button>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="app-container">
            <Header />
            {renderLocationBanner()}

            <main className="main-content">
                {activeTab === 'map' && (
                    <>
                        <MapWrapper
                            alerts={alerts}
                            userLocation={userLocation}
                            showSheltersOnly={showSheltersOnly}
                            onMapReady={handleMapReady}
                        />

                        <div className="center-marker">
                            <div className="center-marker-pin">📍</div>
                            <div className="center-marker-shadow"></div>
                        </div>

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
                    <AlertsList alerts={myAlerts} onDelete={deleteAlert} />
                )}
            </main>

            <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                onSubmit={handleSubmitReport}
                userLocation={userLocation}
                mapCenter={mapCenter}
            />
        </div>
    );
}
