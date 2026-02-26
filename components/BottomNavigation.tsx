'use client';

interface BottomNavigationProps {
    activeTab: 'map' | 'alerts';
    onTabChange: (tab: 'map' | 'alerts') => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
    return (
        <nav className="bottom-navigation">
            <button
                className={`nav-tab ${activeTab === 'map' ? 'active' : ''}`}
                onClick={() => onTabChange('map')}
            >
                <span className="nav-icon">🗺️</span>
                <span className="nav-label">Mapa</span>
            </button>
            <button
                className={`nav-tab ${activeTab === 'alerts' ? 'active' : ''}`}
                onClick={() => onTabChange('alerts')}
            >
                <span className="nav-icon">📋</span>
                <span className="nav-label">Meus Alertas</span>
            </button>
        </nav>
    );
}
