import type {
  ServiceProvider,
  Coordinates,
  ApiResponse,
  ServiceCategory
} from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Toggle this to true if backend is not running
const USE_MOCK = false;

// Simulated delay for mock mode
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/* ------------------------------------------------------------------
   Backend Types
-------------------------------------------------------------------*/

interface BackendPlace {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  address?: string;
  distance?: number; // meters
}

interface BackendResponse {
  results: BackendPlace[];
}

/* ------------------------------------------------------------------
   Category Normalization
-------------------------------------------------------------------*/

const VALID_CATEGORIES: ServiceCategory[] = [
  "accommodation",
  "activity",
  "airport",
  "catering",
  "childcare",
  "education",
  "emergency",
  "entertainment",
  "healthcare",
  "heritage",
  "public_transport",
  "sports",
  "commercial",
  "highway",
  "offices",
  "parking",
  "pet",
  "power",
  "railway",
  "rental",
  "service",
  "religion"
];

function normalizeCategory(raw: string): ServiceCategory {
  const clean = raw.toLowerCase();

  if (VALID_CATEGORIES.includes(clean as ServiceCategory)) {
    return clean as ServiceCategory;
  }

  // Map Geoapify-style categories → UI categories
  if (clean.startsWith("healthcare")) return "healthcare";
  if (clean.startsWith("commercial")) return "commercial";
  if (clean.startsWith("transport")) return "public_transport";
  if (clean.startsWith("education")) return "education";
  if (clean.startsWith("entertainment")) return "entertainment";
  if (clean.startsWith("sport")) return "sports";
  if (clean.startsWith("catering")) return "catering";
  if (clean.startsWith("accommodation")) return "accommodation";

  return "service"; // Safe fallback
}

/* ------------------------------------------------------------------
   Mock Data (UI fallback)
-------------------------------------------------------------------*/

const mockProviders: ServiceProvider[] = [
  {
    id: "1",
    name: "Grand Plaza Hotel",
    category: "accommodation",
    description: "Luxury hotel with modern amenities, spa, and rooftop restaurant.",
    rating: 4.8,
    reviewCount: 234,
    distance: 0.8,
    address: "123 Main Street, Downtown",
    phone: "+1 (555) 123-4567",
    isOpen: true,
    openingHours: "24 hours",
    coordinates: { lat: 40.7128, lng: -74.006 },
    verified: true,
    priceRange: 3
  },
  {
    id: "2",
    name: "Adventure Sports Center",
    category: "activity",
    description: "Indoor climbing, zip-lining, and adventure activities for all ages.",
    rating: 4.9,
    reviewCount: 189,
    distance: 1.2,
    address: "456 Oak Avenue, Midtown",
    phone: "+1 (555) 234-5678",
    isOpen: true,
    openingHours: "9:00 AM - 9:00 PM",
    coordinates: { lat: 40.7148, lng: -74.008 },
    verified: true,
    priceRange: 2
  }
];

/* ------------------------------------------------------------------
   Helpers
-------------------------------------------------------------------*/

function mapBackendPlace(p: BackendPlace): ServiceProvider {
  return {
    id: p.id,
    name: p.name,
    category: normalizeCategory(p.category),
    description: p.address || "Nearby service provider",
    rating: 4.5,
    reviewCount: Math.floor(Math.random() * 300),
    distance: p.distance ? p.distance / 1000 : 0, // meters → km
    address: p.address || "Unknown address",
    phone: "N/A",
    isOpen: true,
    openingHours: "Check locally",
    coordinates: {
      lat: p.lat,
      lng: p.lng
    },
    verified: true,
    priceRange: 2
  };
}

/* ------------------------------------------------------------------
   API Calls
-------------------------------------------------------------------*/

/**
 * Fetch nearby service providers from backend
 */
export async function fetchNearbyServices(
  coordinates: Coordinates,
  categories: ServiceCategory[] = [],
  radiusKm: number = 5,
  sortBy: "distance" | "rating" = "distance",
  openNow: boolean = false
): Promise<ApiResponse<ServiceProvider[]>> {
  try {
    /* ---------------------------
       MOCK MODE
    ----------------------------*/
    if (USE_MOCK) {
      await delay(800);

      let filtered = [...mockProviders];

      if (categories.length > 0) {
        filtered = filtered.filter(p =>
          categories.includes(p.category)
        );
      }

      filtered = filtered.filter(p => p.distance <= radiusKm);

      if (sortBy === "distance") {
        filtered.sort((a, b) => a.distance - b.distance);
      }

      if (sortBy === "rating") {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      return {
        success: true,
        data: filtered
      };
    }

    /* ---------------------------
       REAL BACKEND MODE
    ----------------------------*/
    const payload = {
      lat: coordinates.lat,
      lng: coordinates.lng,
      categories, // Empty array = backend uses smart defaults
      radiusKm,
      limit: 20,
      sortBy,
      openNow
    };

    console.log("📤 Sending to backend:", payload);

    const response = await fetch(`${API_BASE_URL}/places/nearby`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Backend error ${response.status}: ${text}`);
    }

    const data: BackendResponse = await response.json();

    console.log("📥 Backend response:", data);

    return {
      success: true,
      data: data.results.map(mapBackendPlace)
    };
  } catch (error) {
    console.error("❌ Failed to fetch nearby services:", error);
    return {
      success: false,
      data: [],
      error: "Failed to fetch nearby services. Please try again."
    };
  }
}

/**
 * Reverse geocode coordinates into a city/location name
 */
export async function reverseGeocode(
  coordinates: Coordinates
): Promise<ApiResponse<string | null>> {
  try {
    if (USE_MOCK) {
      await delay(300);
      return {
        success: true,
        data: "Mock City"
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/location/reverse?lat=${coordinates.lat}&lng=${coordinates.lng}`
    );

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: data.city || null
    };
  } catch (error) {
    console.error("❌ Failed to reverse geocode:", error);
    return {
      success: false,
      data: null,
      error: "Failed to detect location."
    };
  }
}

/**
 * Geocode a city name into coordinates
 */
export async function geocodeCity(
  cityName: string
): Promise<ApiResponse<Coordinates | null>> {
  try {
    if (!cityName.trim()) {
      return {
        success: false,
        data: null,
        error: "City name is required"
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/location/geocode?city=${encodeURIComponent(cityName)}`
    );

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("❌ Failed to geocode city:", error);
    return {
      success: false,
      data: null,
      error: "Failed to find location"
    };
  }
}
