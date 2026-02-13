import { useState, memo } from 'react';
import { MapPin, Navigation, Search, AlertCircle, Loader2 } from 'lucide-react';
import Prism from './Prism';
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
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black font-sans selection:bg-primary/30">

      {/* Prism Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={1}
        />
      </div>

      {/* Floating Navbar */}
      <nav className="relative z-20 w-full max-w-5xl mx-auto px-6 pt-6">
        <div className="flex items-center justify-between py-3 px-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="font-bold text-white tracking-tight">LocalFind</span>
          </div>
          <div className="flex-1"></div>
          <Button variant="ghost" size="sm" className="hidden md:flex text-gray-300 hover:text-white hover:bg-white/10 rounded-full" asChild>
            <a href="mailto:hello@trawl.co.in">Contact</a>
          </Button>
        </div>
      </nav>

      {/* Main Content - Centered, No Box */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 text-center">

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary backdrop-blur-sm animate-fade-in shadow-[0_0_15px_-3px_rgba(var(--primary),0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Live in your area
        </div>

        {/* Hero Heading */}
        <h1 className="max-w-4xl text-5xl md:text-7xl font-display font-bold tracking-tight text-white mb-6 leading-[1.1]">
          Bring local services <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200">
            to your doorstep.
          </span>
        </h1>

        <p className="max-w-xl text-lg md:text-xl text-gray-400 mb-10 leading-relaxed font-light">
          Connect with trusted professionals instantly.
          No calls, no hassle, just results.
        </p>

        {/* Action Buttons */}
        {!showManualInput && (
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm sm:max-w-md mx-auto">
            <Button
              variant="default"
              size="lg"
              onClick={handleRequestLocation}
              disabled={isRequesting}
              className="w-full h-14 rounded-full text-base font-semibold bg-white text-black hover:bg-gray-200 transition-all duration-300 shadow-xl shadow-white/10"
            >
              {isRequesting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Locating...
                </>
              ) : (
                <>
                  <Navigation className="w-5 h-5 mr-2" />
                  Use My Location
                </>
              )}
            </Button>


          </div>
        )}

        {/* Error State */}
        {locationState.error && (
          <div className="mt-8 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center gap-2 backdrop-blur-sm">
            <AlertCircle className="w-4 h-4" />
            {locationState.error}
          </div>
        )}

      </main>

      {/* Footer / Trust Indicators - Bottom Floating */}
      <footer className="relative z-10 py-8 text-center">
        <div className="inline-flex items-center gap-8 px-6 py-3 rounded-full bg-black/40 border border-white/5 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
            <span className="font-bold text-white text-lg">500+</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest">Providers</span>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
            <span className="font-bold text-white text-lg">10k+</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest">Users</span>
          </div>
        </div>
      </footer>

    </div>
  );
});
