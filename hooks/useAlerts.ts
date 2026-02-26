"use client";

import { useState, useEffect, useMemo } from "react";
import { Alert, AlertType, getAlertExpirationMs } from "@/types/alert";
import { supabase, isSupabaseEnabled } from "@/lib/supabase";
import {
  loadAlerts as loadLocalAlerts,
  saveAlerts as saveLocalAlerts,
  addAlert as addLocalAlert,
  deleteAlert as deleteLocalAlert,
  getMyAlertIds,
  addMyAlertId,
  removeMyAlertId,
} from "@/lib/localStorage";

// Converte timestamp de ISO string para milissegundos
const isoToTimestamp = (isoString: string): number => {
  return new Date(isoString).getTime();
};

// Converte timestamp em milissegundos para ISO string
const timestampToIso = (timestamp: number): string => {
  return new Date(timestamp).toISOString();
};

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [myAlertIds, setMyAlertIds] = useState<Set<string>>(new Set());
  const [isOnline, setIsOnline] = useState(isSupabaseEnabled);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega os IDs dos alertas criados localmente
  useEffect(() => {
    setMyAlertIds(getMyAlertIds());
  }, []);

  // Filtra apenas os alertas criados neste dispositivo
  const myAlerts = useMemo(() => {
    return alerts.filter((alert) => myAlertIds.has(alert.id));
  }, [alerts, myAlertIds]);

  // Carrega alertas do Supabase
  const loadAlertsFromSupabase = async () => {
    // Se Supabase não estiver configurado, usa localStorage
    if (!isSupabaseEnabled || !supabase) {
      console.log("📦 Supabase não configurado, usando localStorage");
      const localAlerts = loadLocalAlerts();
      setAlerts(localAlerts);
      setIsOnline(false);
      setIsLoading(false);
      return localAlerts;
    }

    try {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mappedAlerts: Alert[] = (data || []).map((alert: any) => ({
        id: alert.id,
        type: alert.type,
        latitude: alert.latitude,
        longitude: alert.longitude,
        createdAt: isoToTimestamp(alert.created_at),
        expiresAt: isoToTimestamp(alert.expires_at),
      }));

      setAlerts(mappedAlerts);
      // Salva no localStorage como backup
      saveLocalAlerts(mappedAlerts);
      setIsOnline(true);
      return mappedAlerts;
    } catch (error) {
      console.error("❌ Erro ao carregar alertas do Supabase:", error);
      // Fallback para localStorage
      const localAlerts = loadLocalAlerts();
      setAlerts(localAlerts);
      setIsOnline(false);
      return localAlerts;
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega alertas na inicialização
  useEffect(() => {
    loadAlertsFromSupabase();
  }, []);

  // Polling automático para buscar novos alertas
  useEffect(() => {
    const pollingInterval = parseInt(
      process.env.NEXT_PUBLIC_ALERTS_POLLING_INTERVAL || "30000",
      10,
    );

    if (pollingInterval > 0 && isSupabaseEnabled && supabase) {
      console.log(
        `🔄 Polling ativado: buscando novos alertas a cada ${pollingInterval / 1000}s`,
      );

      const interval = setInterval(() => {
        console.log("🔄 Buscando novos alertas...");
        loadAlertsFromSupabase();
      }, pollingInterval);

      return () => {
        console.log("🔄 Polling desativado");
        clearInterval(interval);
      };
    }
  }, []);

  // Limpeza automática de alertas expirados em tempo real
  useEffect(() => {
    const checkInterval = parseInt(
      process.env.NEXT_PUBLIC_ALERTS_CLEANUP_INTERVAL || "60000",
      10,
    ); // Padrão: 1 minuto

    console.log(
      `🧹 Limpeza automática ativada (verificando a cada ${checkInterval / 1000}s)`,
    );

    const interval = setInterval(() => {
      const now = Date.now();

      setAlerts((currentAlerts) => {
        const validAlerts = currentAlerts.filter(
          (alert) => alert.expiresAt > now,
        );

        if (validAlerts.length !== currentAlerts.length) {
          const expiredCount = currentAlerts.length - validAlerts.length;
          console.log(`🧹 Removidos ${expiredCount} alerta(s) expirado(s)`);

          // Atualiza localStorage também
          saveLocalAlerts(validAlerts);
        }

        return validAlerts;
      });
    }, checkInterval);

    return () => {
      console.log("🧹 Limpeza automática desativada");
      clearInterval(interval);
    };
  }, []);

  // Inscreve-se para atualizações em tempo real
  useEffect(() => {
    // Só se inscreve se Supabase estiver configurado
    if (!isSupabaseEnabled || !supabase) {
      console.log("📦 Realtime desabilitado (Supabase não configurado)");
      return;
    }

    console.log("📡 Configurando Supabase Realtime...");

    const channel = supabase
      .channel("alerts-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "alerts",
        },
        (payload) => {
          console.log("✅ Novo alerta recebido:", payload.new);
          const newAlert: Alert = {
            id: (payload.new as any).id,
            type: (payload.new as any).type,
            latitude: (payload.new as any).latitude,
            longitude: (payload.new as any).longitude,
            createdAt: isoToTimestamp((payload.new as any).created_at),
            expiresAt: isoToTimestamp((payload.new as any).expires_at),
          };

          setAlerts((current) => {
            // Evita duplicatas
            if (current.some((a) => a.id === newAlert.id)) {
              return current;
            }
            const updated = [newAlert, ...current];
            saveLocalAlerts(updated);
            return updated;
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "alerts",
        },
        (payload) => {
          console.log("🗑️ Alerta deletado:", (payload.old as any).id);
          setAlerts((current) => {
            const updated = current.filter(
              (a) => a.id !== (payload.old as any).id,
            );
            saveLocalAlerts(updated);
            return updated;
          });
        },
      )
      .subscribe((status) => {
        console.log("📡 Status da inscrição Realtime:", status);
      });

    return () => {
      console.log("📡 Desconectando Realtime...");
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const addAlert = async (
    type: AlertType,
    latitude: number,
    longitude: number,
  ): Promise<Alert> => {
    const now = Date.now();
    const expiresAt = now + getAlertExpirationMs(type);

    // Se Supabase não estiver configurado, usa localStorage
    if (!isSupabaseEnabled || !supabase) {
      console.log("📦 Criando alerta no localStorage");
      const localAlert: Alert = {
        id: `local-${now}-${Math.random()}`,
        type,
        latitude,
        longitude,
        createdAt: now,
        expiresAt,
      };

      const updatedAlerts = addLocalAlert(localAlert);
      setAlerts(updatedAlerts);
      
      // Marca como alerta criado localmente
      addMyAlertId(localAlert.id);
      setMyAlertIds((prev) => new Set(prev).add(localAlert.id));
      
      return localAlert;
    }

    try {
      const { data, error } = await supabase
        .from("alerts")
        .insert({
          type,
          latitude,
          longitude,
          expires_at: timestampToIso(expiresAt),
        } as any)
        .select()
        .single();

      if (error) throw error;

      const newAlert: Alert = {
        id: (data as any).id,
        type: (data as any).type,
        latitude: (data as any).latitude,
        longitude: (data as any).longitude,
        createdAt: isoToTimestamp((data as any).created_at),
        expiresAt: isoToTimestamp((data as any).expires_at),
      };

      // Adiciona o alerta ao estado imediatamente
      setAlerts((current) => {
        // Evita duplicatas
        if (current.some((a) => a.id === newAlert.id)) {
          return current;
        }
        const updated = [newAlert, ...current];
        saveLocalAlerts(updated);
        return updated;
      });

      // Marca como alerta criado localmente
      addMyAlertId(newAlert.id);
      setMyAlertIds((prev) => new Set(prev).add(newAlert.id));

      console.log(
        "✅ Alerta criado no Supabase e adicionado ao estado:",
        newAlert,
      );
      return newAlert;
    } catch (error) {
      console.error("❌ Erro ao criar alerta no Supabase:", error);

      // Fallback para localStorage se offline
      const fallbackAlert: Alert = {
        id: `local-${now}-${Math.random()}`,
        type,
        latitude,
        longitude,
        createdAt: now,
        expiresAt,
      };

      const localAlerts = loadLocalAlerts();
      const updated = [fallbackAlert, ...localAlerts];
      saveLocalAlerts(updated);
      setAlerts(updated);
      setIsOnline(false);

      // Marca como alerta criado localmente
      addMyAlertId(fallbackAlert.id);
      setMyAlertIds((prev) => new Set(prev).add(fallbackAlert.id));

      return fallbackAlert;
    }
  };

  const deleteAlert = async (id: string): Promise<void> => {
    // Remove da lista de "meus alertas"
    removeMyAlertId(id);
    setMyAlertIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });

    // Se Supabase não estiver configurado, usa localStorage
    if (!isSupabaseEnabled || !supabase) {
      console.log("📦 Deletando alerta do localStorage");
      const updatedAlerts = deleteLocalAlert(id);
      setAlerts(updatedAlerts);
      return;
    }

    try {
      // Optimistic update: remove do estado local imediatamente
      setAlerts((currentAlerts) => {
        const filtered = currentAlerts.filter((alert) => alert.id !== id);
        // Atualiza localStorage também
        saveLocalAlerts(filtered);
        return filtered;
      });

      // Depois faz a exclusão no Supabase
      const { error } = await supabase.from("alerts").delete().eq("id", id);

      if (error) throw error;

      console.log("✅ Alerta deletado no Supabase:", id);
    } catch (error) {
      console.error("❌ Erro ao deletar alerta no Supabase:", error);

      // Em caso de erro, recarrega do Supabase para sincronizar
      await loadAlertsFromSupabase();
      setIsOnline(false);
    }
  };

  return {
    alerts, // Todos os alertas (aparecem no mapa)
    myAlerts, // Apenas alertas criados neste dispositivo (aparecem em "Meus Alertas")
    addAlert,
    deleteAlert,
    isOnline,
    isLoading,
    refresh: loadAlertsFromSupabase,
  };
};
