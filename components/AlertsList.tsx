'use client';

import { useState } from 'react';
import { Alert, ALERT_TYPES } from '@/types/alert';

interface AlertsListProps {
    alerts: Alert[];
    onDelete: (id: string) => void;
}

export default function AlertsList({ alerts, onDelete }: AlertsListProps) {
    const [alertToDelete, setAlertToDelete] = useState<string | null>(null);

    const getTimeRemaining = (expiresAt: number): string => {
        const now = Date.now();
        const remaining = expiresAt - now;

        if (remaining <= 0) return 'Expirado';

        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `${hours}h ${minutes}m restantes`;
        }
        return `${minutes}m restantes`;
    };

    const getTimeCreated = (createdAt: number): string => {
        const now = Date.now();
        const diff = now - createdAt;

        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days > 0) return `há ${days} dia${days > 1 ? 's' : ''}`;
        if (hours > 0) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
        if (minutes > 0) return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
        return 'agora mesmo';
    };

    const handleDeleteClick = (alertId: string) => {
        setAlertToDelete(alertId);
    };

    const handleConfirmDelete = () => {
        if (alertToDelete) {
            onDelete(alertToDelete);
            setAlertToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setAlertToDelete(null);
    };

    const alertToDeleteInfo = alertToDelete
        ? alerts.find(a => a.id === alertToDelete)
        : null;

    if (alerts.length === 0) {
        return (
            <div className="alerts-list">
                <div className="empty-state">
                    <p>Você ainda não criou alertas.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="alerts-list">
            {alerts.map(alert => {
                const info = ALERT_TYPES[alert.type];
                return (
                    <div key={alert.id} className="alert-item">
                        <div className="alert-item-icon" style={{ color: info.color }}>
                            {info.icon}
                        </div>
                        <div className="alert-item-info">
                            <h3 className="alert-item-title">{info.title}</h3>
                            <p className="alert-item-time">{getTimeCreated(alert.createdAt)}</p>
                            <p className="alert-item-remaining">{getTimeRemaining(alert.expiresAt)}</p>
                        </div>
                        <button
                            className="alert-item-delete"
                            onClick={() => handleDeleteClick(alert.id)}
                            aria-label="Excluir alerta"
                        >
                            ✕
                        </button>
                    </div>
                );
            })}

            {/* Modal de Confirmação */}
            {alertToDelete && alertToDeleteInfo && (
                <>
                    <div className="delete-modal-overlay" onClick={handleCancelDelete}></div>
                    <div className="delete-modal">
                        <div className="delete-modal-content">
                            <div className="delete-modal-icon">
                                {ALERT_TYPES[alertToDeleteInfo.type].icon}
                            </div>
                            <h3 className="delete-modal-title">Excluir Alerta?</h3>
                            <p className="delete-modal-message">
                                Tem certeza que deseja excluir o alerta de <strong>{ALERT_TYPES[alertToDeleteInfo.type].title}</strong>?
                            </p>
                            <p className="delete-modal-warning">Esta ação não pode ser desfeita.</p>
                            <div className="delete-modal-actions">
                                <button className="btn btn-secondary" onClick={handleCancelDelete}>
                                    Cancelar
                                </button>
                                <button className="btn btn-danger" onClick={handleConfirmDelete}>
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
