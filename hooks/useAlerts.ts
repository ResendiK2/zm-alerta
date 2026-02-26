"use client";

import { useState, useEffect } from "react";
import { Alert, AlertType, ALERT_EXPIRATION_MS } from "@/types/alert";
import {
  loadAlerts,
  addAlert as addAlertToStorage,
  deleteAlert as deleteAlertFromStorage,
} from "@/lib/localStorage";

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    setAlerts(loadAlerts());
  }, []);

  const addAlert = (
    type: AlertType,
    latitude: number,
    longitude: number,
  ): Alert => {
    const now = Date.now();
    const newAlert: Alert = {
      id: `${now}-${Math.random()}`,
      type,
      latitude,
      longitude,
      createdAt: now,
      expiresAt: now + ALERT_EXPIRATION_MS,
    };

    const updatedAlerts = addAlertToStorage(newAlert);
    setAlerts(updatedAlerts);
    return newAlert;
  };

  const deleteAlert = (id: string): void => {
    const updatedAlerts = deleteAlertFromStorage(id);
    setAlerts(updatedAlerts);
  };

  return {
    alerts,
    addAlert,
    deleteAlert,
  };
};
