'use client';

export default function MapLegend() {
    return (
        <div className="map-legend">
            <h3 className="legend-title">Legenda</h3>
            <div className="legend-items">
                <div className="legend-item">
                    <span className="legend-circle" style={{ background: '#3B82F6' }}></span>
                    <span>Alagamento</span>
                </div>
                <div className="legend-item">
                    <span className="legend-circle" style={{ background: '#92400E' }}></span>
                    <span>Deslizamento</span>
                </div>
                <div className="legend-item">
                    <span className="legend-circle" style={{ background: '#EAB308' }}></span>
                    <span>Falta de Energia</span>
                </div>
                <div className="legend-item">
                    <span className="legend-marker">🚨</span>
                    <span>Pessoa em Risco</span>
                </div>
                <div className="legend-item">
                    <span className="legend-marker">🏠</span>
                    <span>Abrigo Disponível</span>
                </div>
            </div>
        </div>
    );
}
