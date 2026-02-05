import { useQuery } from "@tanstack/react-query";
import { fetchNearbyServices } from "@/services/api";
import type {
  Coordinates,
  ServiceProvider,
  ServiceCategory
} from "@/types";

interface UseServicesOptions {
  coordinates: Coordinates | null;
  categories: ServiceCategory[];
  radius?: number;
  sortBy?: "distance" | "rating";
  openNow?: boolean;
  enabled?: boolean;
}

interface UseServicesReturn {
  services: ServiceProvider[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
}

export function useServices({
  coordinates,
  categories,
  radius = 5,
  sortBy = "distance",
  openNow = false,
  enabled = true
}: UseServicesOptions): UseServicesReturn {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [
      "services",
      coordinates?.lat,
      coordinates?.lng,
      categories.join(","), // stable cache key
      radius,
      sortBy,
      openNow
    ],
    queryFn: async () => {
      if (!coordinates) {
        throw new Error("Location required");
      }

      // Normalize categories to lowercase for backend
      const normalizedCategories = categories.map(c =>
        c.toLowerCase() as ServiceCategory
      );

      const response = await fetchNearbyServices(
        coordinates,
        normalizedCategories,
        radius,
        sortBy,
        openNow
      );

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch services");
      }

      return response.data;
    },
    enabled: enabled && !!coordinates,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false
  });

  return {
    services: data || [],
    isLoading,
    isError,
    error: error instanceof Error ? error.message : null,
    refetch
  };
}
