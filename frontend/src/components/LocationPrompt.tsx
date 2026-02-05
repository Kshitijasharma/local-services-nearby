import { useState, memo } from 'react';
import { MapPin, Navigation, Search, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { geocodeCity } from '@/services/api';


import type { LocationState, Coordinates } from '@/types';

interface LocationPromptProps {
  locationState: LocationState;
  onRequestLocation: () => Promise<void>;
  onManualLocation: (coordinates: Coordinates, city: string) => void;
}

export const LocationPrompt = memo(function LocationPrompt({
  locationState,
  onRequestLocation,
  onManualLocation,
}: LocationPromptProps) {
  const [cityInput, setCityInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleRequestLocation = async () => {
    await onRequestLocation();
  };

    // FIX THIS FUNCTION
  const handleCitySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInput.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    const result = await geocodeCity(cityInput);

    if (result.success && result.data) {
      onManualLocation(result.data, cityInput);
    } else {
      setSearchError(result.error || "City not found");
    }

    setIsSearching(false);
  };


  const isRequesting = locationState.status === 'requesting';
  const showManualInput = locationState.status === 'denied' || locationState.status === 'unavailable';

  return (
    <div className="min-h-screen flex items-center relative overflow-hidden bg-black">
      {/* Earth background image - rotating on the right */}
      <div 
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[60%] h-[150%] pointer-events-none flex items-center justify-center"
        aria-hidden="true"
      >
        <div 
          className="w-full h-full bg-cover bg-center animate-spin"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1920&q=80')`,
            animationDuration: '120s',
          }}
        />
      </div>
      
      {/* Content on the left */}
      <div className="max-w-md w-full text-left slide-up relative z-10 ml-8 md:ml-16 lg:ml-24 p-8">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6">
            <MapPin className="w-12 h-12 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-3">
            Find Local Services
          </h1>
          <p className="text-gray-300 text-lg">
            Discover trusted service providers near you
          </p>
        </div>

        {/* Location Request Button */}
        {!showManualInput && (
          <div className="space-y-4">
            <Button
              variant="location"
              size="xl"
              onClick={handleRequestLocation}
              disabled={isRequesting}
              className="w-full"
              aria-label="Use my current location"
            >
              {isRequesting ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden="true" />
                  Detecting Location...
                </>
              ) : (
                <>
                  <Navigation aria-hidden="true" />
                  Use My Location
                </>
              )}
            </Button>

            <p className="text-sm text-gray-400">
              We'll use your location to find nearby services
            </p>
          </div>
        )}

        {/* Error State */}
        {locationState.error && (
          <div 
            className="mt-6 p-4 bg-destructive/10 rounded-lg flex items-start gap-3 text-left"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-destructive">{locationState.error}</p>
          </div>
        )}

        
        {/* Trust indicators */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-sm text-gray-400 mb-4">
            Trusted by thousands of users
          </p>
          <div className="flex gap-8 text-gray-400">
            <div className="text-left">
              <p className="text-2xl font-bold text-white">500+</p>
              <p className="text-xs">Service Providers</p>
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-white">10k+</p>
              <p className="text-xs">Happy Customers</p>
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-white">4.8★</p>
              <p className="text-xs">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
