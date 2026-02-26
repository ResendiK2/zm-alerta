"use client";

import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  permissionState: "prompt" | "granted" | "denied" | "unknown";
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
    permissionState: "unknown",
  });

  useEffect(() => {
    let watchId: number | undefined;

    const requestLocation = async () => {
      // Verifica se o navegador suporta geolocalização
      if (!navigator.geolocation) {
        setState({
          latitude: null,
          longitude: null,
          error: "Seu navegador não suporta geolocalização",
          loading: false,
          permissionState: "denied",
        });
        return;
      }

      // Verifica o status da permissão (se disponível)
      try {
        if ("permissions" in navigator) {
          const permission = await navigator.permissions.query({
            name: "geolocation",
          });
          console.log(
            "📍 Status da permissão de localização:",
            permission.state,
          );

          setState((prev) => ({
            ...prev,
            permissionState: permission.state as
              | "prompt"
              | "granted"
              | "denied",
          }));

          // Escuta mudanças no estado da permissão
          permission.addEventListener("change", () => {
            console.log(
              "📍 Permissão de localização alterada:",
              permission.state,
            );
            setState((prev) => ({
              ...prev,
              permissionState: permission.state as
                | "prompt"
                | "granted"
                | "denied",
            }));
          });
        }
      } catch (err) {
        console.log("⚠️ API de permissões não disponível, continuando...");
      }

      const onSuccess = (position: GeolocationPosition) => {
        console.log("✅ Geolocalização obtida:", {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });

        setState((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
          permissionState: "granted",
        }));
      };

      const onError = (error: GeolocationPositionError) => {
        console.error("❌ Erro de geolocalização:", error.code, error.message);

        let errorMessage = "Erro ao obter localização";
        let permissionState: "prompt" | "granted" | "denied" = "denied";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Permissão de localização negada. Por favor, habilite nas configurações do navegador.";
            permissionState = "denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "Localização indisponível. Verifique se o GPS está ativado.";
            permissionState = "prompt";
            break;
          case error.TIMEOUT:
            errorMessage =
              "Tempo esgotado ao obter localização. Tente novamente.";
            permissionState = "prompt";
            break;
        }

        setState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
          permissionState,
        }));
      };

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      };

      console.log("📍 Solicitando permissão de localização...");

      // Solicita a localização atual (isso dispara o prompt de permissão)
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

      // Após obter a localização inicial, monitora atualizações
      watchId = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        options,
      );
    };

    requestLocation();

    // Cleanup: remove o watcher quando o componente desmontar
    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
        console.log("🔄 Monitoramento de localização encerrado");
      }
    };
  }, []);

  return state;
};
