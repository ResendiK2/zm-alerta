'use client';

import { useState } from 'react';
import HelpModal from './HelpModal';

export default function Header() {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    return (
        <>
            <header className="header">
                <div className="header-content">
                    <div className="header-left">
                        <div className="app-logo">🆘</div>
                        <h1 className="app-title">Zona da Mata Alertas</h1>
                    </div>
                    <button
                        className="help-button"
                        aria-label="Ajuda"
                        onClick={() => setIsHelpModalOpen(true)}
                    >
                        ❓
                    </button>
                </div>
            </header>

            <HelpModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
            />
        </>
    );
}
