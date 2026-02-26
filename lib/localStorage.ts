import { Alert } from "@/types/alert";

const ALERTS_KEY = "sos_jf_alerts";

export const saveAlerts = (alerts: Alert[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  }
};

export const loadAlerts = (): Alert[] => {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(ALERTS_KEY);
  if (!stored) return [];

  try {
    const alerts: Alert[] = JSON.parse(stored);
    const now = Date.now();

    // Remove expired alerts
    const validAlerts = alerts.filter((alert) => alert.expiresAt > now);

    // Save cleaned up list
    if (validAlerts.length !== alerts.length) {
      saveAlerts(validAlerts);
    }

    return validAlerts;
  } catch {
    return [];
  }
};

export const addAlert = (alert: Alert): Alert[] => {
  const alerts = loadAlerts();
  const newAlerts = [...alerts, alert];
  saveAlerts(newAlerts);
  return newAlerts;
};

export const deleteAlert = (id: string): Alert[] => {
  const alerts = loadAlerts();
  const newAlerts = alerts.filter((alert) => alert.id !== id);
  saveAlerts(newAlerts);
  return newAlerts;
};
