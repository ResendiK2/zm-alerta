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

// Tempos de expiração padrão (em milissegundos)
const DEFAULT_EXPIRATION_TIMES: Record<AlertType, number> = {
  pessoa_risco: 6 * 60 * 60 * 1000,      // 6 horas
  deslizamento: 48 * 60 * 60 * 1000,     // 48 horas
  alagamento: 8 * 60 * 60 * 1000,        // 8 horas
  abrigo: 7 * 24 * 60 * 60 * 1000,       // 7 dias
  falta_energia: 12 * 60 * 60 * 1000,    // 12 horas
};

/**
 * Obtém o tempo de expiração em milissegundos para um tipo de alerta.
 * Prioriza variáveis de ambiente, caso contrário usa o valor padrão.
 * 
 * IMPORTANTE: Next.js requer referências diretas a process.env.NEXT_PUBLIC_*
 * para injetar os valores em build time. Não podemos usar notação dinâmica.
 */
export const getAlertExpirationMs = (type: AlertType): number => {
  // Mapeamento direto para permitir que Next.js injete as variáveis em build time
  const envOverrides: Record<AlertType, string | undefined> = {
    pessoa_risco: process.env.NEXT_PUBLIC_ALERT_EXPIRATION_PESSOA_RISCO,
    deslizamento: process.env.NEXT_PUBLIC_ALERT_EXPIRATION_DESLIZAMENTO,
    alagamento: process.env.NEXT_PUBLIC_ALERT_EXPIRATION_ALAGAMENTO,
    abrigo: process.env.NEXT_PUBLIC_ALERT_EXPIRATION_ABRIGO,
    falta_energia: process.env.NEXT_PUBLIC_ALERT_EXPIRATION_FALTA_ENERGIA,
  };

  const envValue = envOverrides[type];
  
  if (envValue) {
    const parsed = parseInt(envValue, 10);
    if (!isNaN(parsed) && parsed > 0) {
      console.log(`⏱️ Usando tempo customizado para ${type}: ${parsed}ms (${parsed / 60000} minutos)`);
      return parsed;
    }
  }

  console.log(`⏱️ Usando tempo padrão para ${type}: ${DEFAULT_EXPIRATION_TIMES[type]}ms`);
  return DEFAULT_EXPIRATION_TIMES[type];
};

// Mantido por compatibilidade (usa pessoa_risco como padrão)
export const ALERT_EXPIRATION_MS = DEFAULT_EXPIRATION_TIMES.pessoa_risco;
