import { memo } from 'react';
import { MapPin, RefreshCw } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { LocationState } from '@/types';

interface HeaderProps {
  locationState: LocationState;
  onChangeLocation: () => void;
}

export const Header = memo(function Header({
  locationState,
  onChangeLocation,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-foreground leading-tight">
                LocalFind
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Trusted local services
              </p>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Location Display */}
            {locationState.status === 'granted' && locationState.city && (
              <button
                onClick={onChangeLocation}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors group"
                aria-label={`Current location: ${locationState.city}. Click to change.`}
              >
                <MapPin className="w-4 h-4 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground max-w-[150px] truncate">
                  {locationState.city}
                </span>
                <RefreshCw 
                  className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" 
                  aria-hidden="true"
                />
              </button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
});
