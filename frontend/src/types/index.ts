// Core type definitions for the Smart Local Services Discovery Platform

export type ServiceCategory = 
  | 'accommodation'
  | 'activity'
  | 'airport'
  | 'commercial'
  | 'catering'
  | 'emergency'
  | 'education'
  | 'childcare'
  | 'entertainment'
  | 'healthcare'
  | 'heritage'
  | 'highway'
  | 'offices'
  | 'parking'
  | 'pet'
  | 'power'
  | 'railway'
  | 'rental'
  | 'service'
  | 'religion'
  | 'sports'
  | 'public_transport';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ServiceProvider {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  rating: number;
  reviewCount: number;
  distance: number; // in kilometers
  address: string;
  phone: string;
  isOpen: boolean;
  openingHours: string;
  coordinates: Coordinates;
  imageUrl?: string;
  verified: boolean;
  priceRange: 1 | 2 | 3 | 4; // $ to $$$$
}

export interface LocationState {
  status: 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable';
  coordinates: Coordinates | null;
  city: string | null;
  error: string | null;
}

export interface ServiceFilters {
  category: ServiceCategory;
  radius: number;
  sortBy: "distance" | "rating"; // ✅ ONLY THESE
  openNow: boolean;
}


export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export type ViewMode = 'list' | 'map';

export interface CategoryInfo {
  id: ServiceCategory;
  label: string;
  icon: string;
  color: string;
}
