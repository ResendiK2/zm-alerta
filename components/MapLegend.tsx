'use client';

import { useState } from 'react';

export default function MapLegend() {
    const [isMinimized, setIsMinimized] = useState(false);

    return (
        <div className={`map-legend ${isMinimized ? 'minimized' : ''}`}>
            <div className="legend-header">
                <h3 className="legend-title">Legenda</h3>
                <button
                    className="legend-toggle"
                    onClick={() => setIsMinimized(!isMinimized)}
                    aria-label={isMinimized ? "Expandir legenda" : "Minimizar legenda"}
                >
                    {isMinimized ? '➕' : '➖'}
                </button>
            </div>
            {!isMinimized && (
                <div className="legend-items">
                    <div className="legend-item">
                        <span className="legend-circle-with-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.25)' }}>
                            <span className="legend-icon">💧</span>
                        </span>
                        <span>Alagamento</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-circle-with-icon" style={{ backgroundColor: 'rgba(146, 64, 14, 0.25)' }}>
                            <span className="legend-icon">⛰️</span>
                        </span>
                        <span>Deslizamento</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-circle-with-icon" style={{ backgroundColor: 'rgba(234, 179, 8, 0.25)' }}>
                            <span className="legend-icon">⚡</span>
                        </span>
                        <span>Falta de Energia</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-circle-with-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.25)' }}>
                            <span className="legend-icon">🚨</span>
                        </span>
                        <span>Pessoa em Risco</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-circle-with-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.25)' }}>
                            <span className="legend-icon">🏠</span>
                        </span>
                        <span>Abrigo Disponível</span>
                    </div>
                </div>
            )}
        </div>
    );
}
