import { useState, useCallback, useEffect } from 'react';
import type { LocationState, Coordinates } from '@/types';

const STORAGE_KEY = 'user-location-permission';
const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

interface UseGeolocationReturn {
  locationState: LocationState;
  requestLocation: () => Promise<void>;
  setManualLocation: (coordinates: Coordinates, city: string) => void;
  clearLocation: () => void;
}

async function reverseGeocode(coords: Coordinates): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${coords.lat}&lon=${coords.lng}&apiKey=${GEOAPIFY_API_KEY}`
    );

    if (!res.ok) return null;

    const data = await res.json();
    const props = data?.features?.[0]?.properties;

    return (
      props?.city ||
      props?.town ||
      props?.village ||
      props?.state ||
      null
    );
  } catch {
    return null;
  }
}

export function useGeolocation(): UseGeolocationReturn {
  const [locationState, setLocationState] = useState<LocationState>({
    status: 'idle',
    coordinates: null,
    city: null,
    error: null,
  });

  // Load cached location on mount
  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (!cached) return;

    try {
      const parsed = JSON.parse(cached);
      if (parsed.coordinates) {
        setLocationState({
          status: 'granted',
          coordinates: parsed.coordinates,
          city: parsed.city || null,
          error: null,
        });
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationState({
        status: 'unavailable',
        coordinates: null,
        city: null,
        error: 'Geolocation is not supported by your browser.',
      });
      return;
    }

    setLocationState(prev => ({
      ...prev,
      status: 'requesting',
      error: null,
    }));

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        });
      });

      // const coordinates: Coordinates = {
      //   lat: position.coords.latitude,
      //   lng: position.coords.longitude,
      // };

      // // Ask Geoapify for city name
      // const city =
      //   (await reverseGeocode(coordinates)) || 'Unknown location';

      // const newState: LocationState = {
      //   status: 'granted',
      //   coordinates,
      //   city,
      //   error: null,
      // };

      const coordinates: Coordinates = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    let city = "Unknown location";

    try {
      const result = await reverseGeocode(coordinates);
      console.log("🌍 Reverse geocode result:", result);

      if (result) {
        city = result;
      }
    } catch (err) {
      console.error("❌ Reverse geocode failed:", err);
    }

    const newState: LocationState = {
      status: "granted",
      coordinates,
      city,
      error: null,
    };


      setLocationState(newState);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          coordinates,
          city,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      const geoError = error as GeolocationPositionError;

      let errorMessage = 'Unable to retrieve your location.';
      let status: LocationState['status'] = 'denied';

      switch (geoError.code) {
        case geoError.PERMISSION_DENIED:
          errorMessage =
            'Location permission was denied. Please enable location access or enter your city manually.';
          status = 'denied';
          break;
        case geoError.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          status = 'unavailable';
          break;
        case geoError.TIMEOUT:
          errorMessage = 'Location request timed out. Please try again.';
          status = 'unavailable';
          break;
      }

      setLocationState({
        status,
        coordinates: null,
        city: null,
        error: errorMessage,
      });
    }
  }, []);

  const setManualLocation = useCallback(
    (coordinates: Coordinates, city: string) => {
      const newState: LocationState = {
        status: 'granted',
        coordinates,
        city,
        error: null,
      };

      setLocationState(newState);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          coordinates,
          city,
          timestamp: Date.now(),
        })
      );
    },
    []
  );

  const clearLocation = useCallback(() => {
    setLocationState({
      status: 'idle',
      coordinates: null,
      city: null,
      error: null,
    });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    locationState,
    requestLocation,
    setManualLocation,
    clearLocation,
  };
}
