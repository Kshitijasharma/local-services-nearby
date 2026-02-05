import { memo, useMemo } from 'react';
import { SearchX, RefreshCw } from 'lucide-react';
import { ServiceCard } from '@/components/ServiceCard';
import { ServiceListSkeleton } from '@/components/ServiceCardSkeleton';
import { Button } from '@/components/ui/button';
import type { ServiceProvider, ServiceFilters } from '@/types';

interface ServiceListProps {
  services: ServiceProvider[];
  filters: ServiceFilters;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  onRetry: () => void;
  onSelectProvider?: (provider: ServiceProvider) => void;
}

export const ServiceList = memo(function ServiceList({
  services,
  filters,
  isLoading,
  isError,
  error,
  onRetry,
  onSelectProvider,
}: ServiceListProps) {
  // Apply client-side filtering and sorting
  const filteredServices = useMemo(() => {
    let result = [...services];

    // Filter by open status
    if (filters.openNow) {
      result = result.filter(s => s.isOpen);
    }

    // Sort
    switch (filters.sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'distance':
      default:
        result.sort((a, b) => a.distance - b.distance);
        break;
    }

    return result;
  }, [services, filters.openNow, filters.sortBy]);

  // Loading state
  if (isLoading) {
    return <ServiceListSkeleton />;
  }

  // Error state
  if (isError) {
    return (
      <div 
        className="flex flex-col items-center justify-center py-16 text-center"
        role="alert"
      >
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <RefreshCw className="w-8 h-8 text-destructive" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Failed to load services
        </h3>
        <p className="text-muted-foreground mb-4 max-w-sm">
          {error || 'Something went wrong. Please try again.'}
        </p>
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
          Try Again
        </Button>
      </div>
    );
  }

  // Empty state
  if (filteredServices.length === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center py-16 text-center"
        role="status"
      >
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <SearchX className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No services found
        </h3>
        <p className="text-muted-foreground max-w-sm">
          {filters.openNow 
            ? 'No open services match your criteria. Try disabling the "Open now" filter.'
            : 'Try adjusting your filters or increasing the search radius.'}
        </p>
      </div>
    );
  }

  return (
    <div 
      className="space-y-4 custom-scrollbar"
      role="list"
      aria-label="Service providers"
    >
      {filteredServices.map((provider, index) => (
        <div 
          key={provider.id}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ServiceCard 
            provider={provider} 
            onSelect={onSelectProvider}
          />
        </div>
      ))}
    </div>
  );
});
