"use client";

import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocalização não suportada",
        loading: false,
      }));
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      console.log("Geolocalização obtida:", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });

      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      console.error("Erro de geolocalização:", error);
      setState((prev) => ({
        ...prev,
        error: error.message,
        loading: false,
      }));
    };

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

    // Watch position updates
    const watchId = navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      options,
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return state;
};
