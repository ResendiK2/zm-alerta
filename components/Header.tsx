'use client';

export default function Header() {
    return (
        <header className="header">
            <div className="header-content">
                <div className="header-left">
                    <div className="app-logo">🆘</div>
                    <h1 className="app-title">SOS JF</h1>
                </div>
                <button className="help-button" aria-label="Ajuda">
                    ❓
                </button>
            </div>
        </header>
    );
}
