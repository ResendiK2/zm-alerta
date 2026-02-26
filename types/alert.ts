export type AlertType =
  | "alagamento"
  | "deslizamento"
  | "falta_energia"
  | "pessoa_risco"
  | "abrigo";

export interface Alert {
  id: string;
  type: AlertType;
  latitude: number;
  longitude: number;
  createdAt: number;
  expiresAt: number;
}

export interface AlertTypeInfo {
  id: AlertType;
  title: string;
  description: string;
  color: string;
  icon: string;
  category: "environmental" | "human";
}

export const ALERT_TYPES: Record<AlertType, AlertTypeInfo> = {
  alagamento: {
    id: "alagamento",
    title: "Alagamento",
    description: "Área com acúmulo de água",
    color: "#3B82F6", // blue
    icon: "💧",
    category: "environmental",
  },
  deslizamento: {
    id: "deslizamento",
    title: "Deslizamento",
    description: "Risco de deslizamento de terra",
    color: "#92400E", // brown
    icon: "⛰️",
    category: "environmental",
  },
  falta_energia: {
    id: "falta_energia",
    title: "Falta de Energia",
    description: "Região sem energia elétrica",
    color: "#EAB308", // yellow
    icon: "⚡",
    category: "environmental",
  },
  pessoa_risco: {
    id: "pessoa_risco",
    title: "Pessoa em Risco",
    description: "Pessoa necessitando ajuda urgente",
    color: "#EF4444", // red
    icon: "🚨",
    category: "human",
  },
  abrigo: {
    id: "abrigo",
    title: "Abrigo Disponível",
    description: "Local seguro para acolhimento",
    color: "#10B981", // green
    icon: "🏠",
    category: "human",
  },
};

// Alerts expire after 24 hours
export const ALERT_EXPIRATION_MS = 24 * 60 * 60 * 1000;
