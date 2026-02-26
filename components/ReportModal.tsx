'use client';

import { useState } from 'react';
import { AlertType, ALERT_TYPES } from '@/types/alert';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (type: AlertType, latitude: number, longitude: number) => void;
    userLocation: { latitude: number; longitude: number } | null;
}

export default function ReportModal({ isOpen, onClose, onSubmit, userLocation }: ReportModalProps) {
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState<AlertType | null>(null);
    const [useCurrentLocation, setUseCurrentLocation] = useState(true);

    if (!isOpen) return null;

    const handleSelectType = (type: AlertType) => {
        setSelectedType(type);
    };

    const handleContinueFromStep1 = () => {
        if (selectedType) {
            setStep(2);
        }
    };

    const handleContinueFromStep2 = () => {
        setStep(3);
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            handleClose();
        }
    };

    const handleSubmit = () => {
        if (selectedType && userLocation && useCurrentLocation) {
            onSubmit(selectedType, userLocation.latitude, userLocation.longitude);
            handleClose();
        }
    };

    const handleClose = () => {
        setStep(1);
        setSelectedType(null);
        setUseCurrentLocation(true);
        onClose();
    };

    const alertTypesList: AlertType[] = ['alagamento', 'deslizamento', 'falta_energia', 'pessoa_risco', 'abrigo'];

    return (
        <>
            <div className="modal-overlay" onClick={handleClose}></div>
            <div className="modal-bottom-sheet">
                {step === 1 && (
                    <div className="modal-content">
                        <div className="modal-header">
                            <p className="modal-step">Passo 1 de 3</p>
                            <h2 className="modal-title">Selecionar ocorrência</h2>
                        </div>
                        <div className="modal-body">
                            <div className="alert-type-list">
                                {alertTypesList.map(type => {
                                    const info = ALERT_TYPES[type];
                                    return (
                                        <button
                                            key={type}
                                            className={`alert-type-card ${selectedType === type ? 'selected' : ''}`}
                                            onClick={() => handleSelectType(type)}
                                        >
                                            <span className="alert-type-icon" style={{ color: info.color }}>
                                                {info.icon}
                                            </span>
                                            <div className="alert-type-info">
                                                <h3 className="alert-type-title">{info.title}</h3>
                                                <p className="alert-type-description">{info.description}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-primary"
                                onClick={handleContinueFromStep1}
                                disabled={!selectedType}
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="modal-content">
                        <div className="modal-header">
                            <p className="modal-step">Passo 2 de 3</p>
                            <h2 className="modal-title">Confirmar localização</h2>
                        </div>
                        <div className="modal-body">
                            <div className="location-preview">
                                <div className="location-map-preview">
                                    <span className="location-pin">📍</span>
                                    <p className="location-text">
                                        {userLocation
                                            ? `${userLocation.latitude.toFixed(6)}, ${userLocation.longitude.toFixed(6)}`
                                            : 'Localizando...'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-primary"
                                onClick={handleContinueFromStep2}
                                disabled={!userLocation}
                            >
                                Usar minha localização atual
                            </button>
                            <button className="btn btn-secondary" onClick={handleBack}>
                                Voltar
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="modal-content">
                        <div className="modal-header">
                            <p className="modal-step">Passo 3 de 3</p>
                            <h2 className="modal-title">Confirmar envio</h2>
                        </div>
                        <div className="modal-body">
                            <div className="confirmation-details">
                                {selectedType && (
                                    <>
                                        <div className="confirmation-item">
                                            <span className="confirmation-label">Tipo:</span>
                                            <span className="confirmation-value">
                                                {ALERT_TYPES[selectedType].icon} {ALERT_TYPES[selectedType].title}
                                            </span>
                                        </div>
                                        <div className="confirmation-item">
                                            <span className="confirmation-label">Localização:</span>
                                            <span className="confirmation-value">
                                                {userLocation
                                                    ? 'Sua localização atual'
                                                    : 'Localizando...'}
                                            </span>
                                        </div>
                                        <div className="confirmation-warning">
                                            ⚠️ Este alerta será visível por 24 horas e depois será removido automaticamente.
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={!selectedType || !userLocation}
                            >
                                Enviar alerta
                            </button>
                            <button className="btn btn-secondary" onClick={handleBack}>
                                Voltar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
