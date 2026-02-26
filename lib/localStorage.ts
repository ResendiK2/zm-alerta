import { Alert } from "@/types/alert";

const ALERTS_KEY = "sos_jf_alerts";
const MY_ALERTS_KEY = "sos_jf_my_alerts"; // IDs dos alertas criados localmente

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

// ===== Gerenciamento de "Meus Alertas" (alertas criados neste dispositivo) =====

/**
 * Retorna os IDs dos alertas criados neste dispositivo
 */
export const getMyAlertIds = (): Set<string> => {
  if (typeof window === "undefined") return new Set();

  const stored = localStorage.getItem(MY_ALERTS_KEY);
  if (!stored) return new Set();

  try {
    const ids: string[] = JSON.parse(stored);
    return new Set(ids);
  } catch {
    return new Set();
  }
};

/**
 * Salva os IDs dos alertas criados neste dispositivo
 */
const saveMyAlertIds = (ids: Set<string>): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(MY_ALERTS_KEY, JSON.stringify(Array.from(ids)));
  }
};

/**
 * Adiciona um ID à lista de alertas criados localmente
 */
export const addMyAlertId = (id: string): void => {
  const ids = getMyAlertIds();
  ids.add(id);
  saveMyAlertIds(ids);
};

/**
 * Remove um ID da lista de alertas criados localmente
 */
export const removeMyAlertId = (id: string): void => {
  const ids = getMyAlertIds();
  ids.delete(id);
  saveMyAlertIds(ids);
};

/**
 * Verifica se um alerta foi criado neste dispositivo
 */
export const isMyAlert = (id: string): boolean => {
  const ids = getMyAlertIds();
  return ids.has(id);
};
