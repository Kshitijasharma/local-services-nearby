import { memo } from 'react';

export const ServiceCardSkeleton = memo(function ServiceCardSkeleton() {
  return (
    <div className="service-card animate-pulse" role="status" aria-label="Loading service">
      <div className="flex gap-4">
        {/* Icon Skeleton */}
        <div className="w-14 h-14 rounded-xl bg-muted shrink-0" />

        {/* Content Skeleton */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/3" />
            </div>
            <div className="h-6 w-14 bg-muted rounded-full shrink-0" />
          </div>

          {/* Rating & Distance */}
          <div className="flex items-center gap-4 mb-3">
            <div className="h-4 bg-muted rounded w-20" />
            <div className="h-4 bg-muted rounded w-16" />
          </div>

          {/* Description */}
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>

          {/* Hours */}
          <div className="h-4 bg-muted rounded w-32 mb-4" />

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <div className="h-9 bg-muted rounded-lg w-28" />
            <div className="h-9 bg-muted rounded-lg w-20" />
          </div>
        </div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
});

export const ServiceListSkeleton = memo(function ServiceListSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-busy="true" aria-label="Loading services">
      {Array.from({ length: 4 }).map((_, index) => (
        <ServiceCardSkeleton key={index} />
      ))}
    </div>
  );
});
