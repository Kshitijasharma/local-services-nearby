import { useState, useCallback, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { LocationPrompt } from "@/components/LocationPrompt";
import { ServiceFilters } from "@/components/ServiceFilters";
import { ServiceList } from "@/components/ServiceList";
import { MapView } from "@/components/MapView";
import { ViewToggle } from "@/components/ViewToggle";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useServices } from "@/hooks/useServices";
import type {
  ServiceFilters as FilterType,
  ViewMode,
  ServiceProvider,
  ServiceCategory
} from "@/types";

/* ------------------------------------------------------------------
   Defaults
-------------------------------------------------------------------*/

const defaultFilters: FilterType = {
  category: "service",
  radius: 5, // km
  sortBy: "distance",
  openNow: false
};

const Index = () => {
  const { locationState, requestLocation, setManualLocation, clearLocation } =
    useGeolocation();

  const [filters, setFilters] = useState<FilterType>(defaultFilters);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedProvider, setSelectedProvider] =
    useState<ServiceProvider | null>(null);

  /* ------------------------------------------------------------------
     Fetch services from backend
  -------------------------------------------------------------------*/
  const backendCategories = useMemo(() => {
  return filters.category ? [filters.category] : [];
}, [filters.category]);

const { services, isLoading, isError, error, refetch } = useServices({
  coordinates: locationState.coordinates,
  categories: backendCategories, // ✅ ARRAY FOR BACKEND
  radius: filters.radius,
  sortBy: filters.sortBy,
  openNow: filters.openNow,
  enabled: locationState.status === "granted"
});


  /* ------------------------------------------------------------------
     Effects
  -------------------------------------------------------------------*/

  // Request location on first load
  useEffect(() => {
    if (locationState.status === "idle") {
      const timer = setTimeout(() => {
        requestLocation();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [locationState.status, requestLocation]);

  // Client-side count for UI display
  const filteredCount = useMemo(() => {
    let result = services;
    if (filters.openNow) {
      result = result.filter(s => s.isOpen);
    }
    return result.length;
  }, [services, filters.openNow]);

  const handleChangeLocation = useCallback(() => {
    clearLocation();
  }, [clearLocation]);

  const handleSelectProvider = useCallback(
    (provider: ServiceProvider | null) => {
      setSelectedProvider(provider);
    },
    []
  );

  /* ------------------------------------------------------------------
     Debug logging (backend contract preview)
  -------------------------------------------------------------------*/

  useEffect(() => {
    console.log("🔎 SEARCH STATE (backend payload preview)", {
      lat: locationState.coordinates?.lat,
      lng: locationState.coordinates?.lng,
      categories: filters.category,
      radiusKm: filters.radius,
      sortBy: filters.sortBy,
      openNow: filters.openNow
    });
  }, [locationState.coordinates, filters]);

  /* ------------------------------------------------------------------
     UI State
  -------------------------------------------------------------------*/

  const showLocationPrompt =
    locationState.status === "idle" ||
    locationState.status === "requesting" ||
    locationState.status === "denied" ||
    locationState.status === "unavailable";

  if (showLocationPrompt) {
    return (
      <div className="min-h-screen bg-background">
        <LocationPrompt
          locationState={locationState}
          onRequestLocation={requestLocation}
          onManualLocation={setManualLocation}
        />
      </div>
    );
  }

  /* ------------------------------------------------------------------
     Render
  -------------------------------------------------------------------*/

  return (
    <div className="min-h-screen bg-background">
      <Header
        locationState={locationState}
        onChangeLocation={handleChangeLocation}
      />

      <main className="container py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            Services Near You
          </h2>
          <p className="text-muted-foreground">
            Find trusted professionals in your area
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <ServiceFilters
            filters={filters}
            onFiltersChange={setFilters}
            resultCount={filteredCount}
          />
        </div>

        {/* View Toggle & Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <ViewToggle
              activeView={viewMode}
              onViewChange={setViewMode}
            />
          </div>

          {/* Content Area */}
          <div
            role="tabpanel"
            id={
              viewMode === "list"
                ? "service-list-panel"
                : "service-map-panel"
            }
            aria-labelledby={viewMode}
          >
            {viewMode === "list" ? (
              <ServiceList
                services={services}
                filters={filters}
                isLoading={isLoading}
                isError={isError}
                error={error}
                onRetry={refetch}
                onSelectProvider={handleSelectProvider}
              />
            ) : (
              <MapView
                services={services}
                filters={filters}
                userLocation={locationState.coordinates}
                selectedProvider={selectedProvider}
                onSelectProvider={handleSelectProvider}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2024 LocalFind. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Help
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
