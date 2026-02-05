import { memo, useMemo } from 'react';
import { MapPin, Star, ExternalLink, Phone, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCategoryIcon, getCategoryColor, formatDistance, formatPriceRange } from '@/lib/constants';
import type { ServiceProvider, Coordinates, ServiceFilters } from '@/types';

interface MapViewProps {
  services: ServiceProvider[];
  filters: ServiceFilters;
  userLocation: Coordinates | null;
  selectedProvider: ServiceProvider | null;
  onSelectProvider: (provider: ServiceProvider | null) => void;
  isLoading: boolean;
}

export const MapView = memo(function MapView({
  services,
  filters,
  userLocation,
  selectedProvider,
  onSelectProvider,
  isLoading,
}: MapViewProps) {
  // Apply client-side filtering
  const filteredServices = useMemo(() => {
    let result = [...services];

    if (filters.openNow) {
      result = result.filter(s => s.isOpen);
    }

    return result;
  }, [services, filters.openNow]);

  const handleOpenMaps = (provider: ServiceProvider) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${provider.name} ${provider.address}`
    )}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCall = (provider: ServiceProvider) => {
    window.location.href = `tel:${provider.phone}`;
  };

  const handleGetDirections = (provider: ServiceProvider) => {
    let directionsUrl = 'https://www.google.com/maps/dir/?api=1';
    if (userLocation) {
      directionsUrl += `&origin=${userLocation.lat},${userLocation.lng}`;
    }
    directionsUrl += `&destination=${encodeURIComponent(provider.address)}`;
    window.open(directionsUrl, '_blank', 'noopener,noreferrer');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="relative bg-muted rounded-xl overflow-hidden h-[60vh] min-h-[400px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-secondary/50 to-muted rounded-xl overflow-hidden h-[60vh] min-h-[400px]">
      {/* Static Map Placeholder - In production, integrate Google Maps or Mapbox here */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

      {/* Map Markers */}
      <div className="absolute inset-0 p-8">
        {/* User Location Marker */}
        {userLocation && (
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            title="Your location"
          >
            <div className="w-4 h-4 bg-info rounded-full animate-pulse ring-4 ring-info/30" />
          </div>
        )}

        {/* Service Provider Markers - positioned in a circle around center */}
        {filteredServices.map((provider, index) => {
          const angle = (index / filteredServices.length) * 2 * Math.PI;
          const radius = 30 + (provider.distance * 8); // Adjust based on distance
          const x = 50 + Math.cos(angle) * radius;
          const y = 50 + Math.sin(angle) * radius;
          
          const CategoryIcon = getCategoryIcon(provider.category);
          const colorClass = getCategoryColor(provider.category);
          const isSelected = selectedProvider?.id === provider.id;

          return (
            <button
              key={provider.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-10 ${
                isSelected ? 'z-30 scale-125' : 'hover:scale-110 hover:z-20'
              }`}
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => onSelectProvider(isSelected ? null : provider)}
              aria-label={`${provider.name}, ${provider.rating} stars, ${formatDistance(provider.distance)} away`}
            >
              <div 
                className={`map-marker ${colorClass} ${isSelected ? 'ring-4 ring-primary/50' : ''}`}
              >
                <CategoryIcon className="w-5 h-5" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Provider Info Card */}
      {selectedProvider && (
        <div 
          className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card rounded-xl shadow-elevated p-4 slide-up"
          role="dialog"
          aria-label={`Details for ${selectedProvider.name}`}
        >
          <div className="flex items-start gap-3">
            {/* Category Icon */}
            <div 
              className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${getCategoryColor(selectedProvider.category)}`}
            >
              {(() => {
                const Icon = getCategoryIcon(selectedProvider.category);
                return <Icon className="w-6 h-6" />;
              })()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">
                  {selectedProvider.name}
                </h3>
                <Badge 
                  variant="secondary"
                  className={selectedProvider.isOpen ? 'status-open' : 'status-closed'}
                >
                  {selectedProvider.isOpen ? 'Open' : 'Closed'}
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  <span className="font-medium text-foreground">{selectedProvider.rating}</span>
                  <span>({selectedProvider.reviewCount})</span>
                </div>
                <span>•</span>
                <span>{formatDistance(selectedProvider.distance)}</span>
                <span>•</span>
                <span>{formatPriceRange(selectedProvider.priceRange)}</span>
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {selectedProvider.address}
              </p>

              <div className="flex items-center gap-2">
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => handleGetDirections(selectedProvider)}
                >
                  <Navigation className="w-4 h-4" />
                  Directions
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCall(selectedProvider)}
                >
                  <Phone className="w-4 h-4" />
                  Call
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleOpenMaps(selectedProvider)}
                  aria-label="Open in Google Maps"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <button
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
            onClick={() => onSelectProvider(null)}
            aria-label="Close details"
          >
            ×
          </button>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-md">
        <p className="text-xs font-medium text-muted-foreground mb-2">Legend</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <div className="w-3 h-3 bg-info rounded-full" />
          <span>Your location</span>
        </div>
      </div>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="text-center p-4">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No services to display</p>
          </div>
        </div>
      )}
    </div>
  );
});
