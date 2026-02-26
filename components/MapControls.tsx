'use client';

interface MapControlsProps {
    onRecenter: () => void;
    onToggleShelters: () => void;
    showSheltersOnly: boolean;
}

export default function MapControls({ onRecenter, onToggleShelters, showSheltersOnly }: MapControlsProps) {
    return (
        <div className="map-controls">
            <button
                className={`map-control-btn ${showSheltersOnly ? 'active' : ''}`}
                onClick={onToggleShelters}
                aria-label="Filtrar abrigos"
            >
                🛡️
            </button>
            <button
                className="map-control-btn"
                onClick={onRecenter}
                aria-label="Recentrar mapa"
            >
                📍
            </button>
        </div>
    );
}
