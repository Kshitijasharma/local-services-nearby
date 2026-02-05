import { memo } from 'react';
import { Star, MapPin, Phone, Clock, ExternalLink, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCategoryIcon, getCategoryColor, formatDistance, formatPriceRange } from '@/lib/constants';
import type { ServiceProvider } from '@/types';

interface ServiceCardProps {
  provider: ServiceProvider;
  onSelect?: (provider: ServiceProvider) => void;
}

export const ServiceCard = memo(function ServiceCard({ provider, onSelect }: ServiceCardProps) {
  const CategoryIcon = getCategoryIcon(provider.category);
  const categoryColorClass = getCategoryColor(provider.category);

  const handleOpenMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${provider.name} ${provider.address}`
    )}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCall = () => {
    window.location.href = `tel:${provider.phone}`;
  };

  return (
    <article 
      className="service-card fade-in group"
      onClick={() => onSelect?.(provider)}
      role="article"
      aria-labelledby={`provider-${provider.id}-name`}
    >
      <div className="flex gap-4">
        {/* Category Icon */}
        <div 
          className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${categoryColorClass}`}
          aria-hidden="true"
        >
          <CategoryIcon className="w-7 h-7" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 
                  id={`provider-${provider.id}-name`}
                  className="font-semibold text-foreground truncate"
                >
                  {provider.name}
                </h3>
                {provider.verified && (
                  <BadgeCheck 
                    className="w-4 h-4 text-primary shrink-0" 
                    aria-label="Verified provider"
                  />
                )}
              </div>
              <p className="text-sm text-muted-foreground capitalize">
                {provider.category} • {formatPriceRange(provider.priceRange)}
              </p>
            </div>

            {/* Status Badge */}
            <Badge 
              variant="secondary"
              className={provider.isOpen ? 'status-open' : 'status-closed'}
            >
              {provider.isOpen ? 'Open' : 'Closed'}
            </Badge>
          </div>

          {/* Rating & Distance */}
          <div className="flex items-center gap-4 mb-3 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-warning text-warning" aria-hidden="true" />
              <span className="font-medium text-foreground">{provider.rating}</span>
              <span className="text-muted-foreground">({provider.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>{formatDistance(provider.distance)}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {provider.description}
          </p>

          {/* Address & Hours */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span>{provider.openingHours}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="default" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenMaps();
              }}
              aria-label={`Open ${provider.name} in Google Maps`}
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              Open in Maps
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleCall();
              }}
              aria-label={`Call ${provider.name}`}
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              Call
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
});
