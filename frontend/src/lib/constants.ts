import type { CategoryInfo, ServiceCategory } from '@/types';
import { 
  Bed, 
  Activity, 
  Plane, 
  Building2, 
  UtensilsCrossed, 
  Siren, 
  GraduationCap, 
  Baby, 
  Drama, 
  Heart, 
  Landmark, 
  Route, 
  Briefcase, 
  ParkingCircle, 
  PawPrint, 
  Zap, 
  TrainFront, 
  Car, 
  Wrench, 
  Church, 
  Trophy, 
  Bus 
} from 'lucide-react';

export const CATEGORIES: CategoryInfo[] = [
  { id: 'accommodation', label: 'Accommodation', icon: 'Bed', color: 'category-accommodation' },
  { id: 'activity', label: 'Activity', icon: 'Activity', color: 'category-activity' },
  { id: 'airport', label: 'Airport', icon: 'Plane', color: 'category-airport' },
  { id: 'commercial', label: 'Commercial', icon: 'Building2', color: 'category-commercial' },
  { id: 'catering', label: 'Catering', icon: 'UtensilsCrossed', color: 'category-catering' },
  { id: 'emergency', label: 'Emergency', icon: 'Siren', color: 'category-emergency' },
  { id: 'education', label: 'Education', icon: 'GraduationCap', color: 'category-education' },
  { id: 'childcare', label: 'Childcare', icon: 'Baby', color: 'category-childcare' },
  { id: 'entertainment', label: 'Entertainment', icon: 'Drama', color: 'category-entertainment' },
  { id: 'healthcare', label: 'Healthcare', icon: 'Heart', color: 'category-healthcare' },
  { id: 'heritage', label: 'Heritage', icon: 'Landmark', color: 'category-heritage' },
  { id: 'highway', label: 'Highway', icon: 'Road', color: 'category-highway' },
  { id: 'offices', label: 'Offices', icon: 'Briefcase', color: 'category-offices' },
  { id: 'parking', label: 'Parking', icon: 'ParkingCircle', color: 'category-parking' },
  { id: 'pet', label: 'Pet', icon: 'PawPrint', color: 'category-pet' },
  { id: 'power', label: 'Power', icon: 'Zap', color: 'category-power' },
  { id: 'railway', label: 'Railway', icon: 'TrainFront', color: 'category-railway' },
  { id: 'rental', label: 'Rental', icon: 'Car', color: 'category-rental' },
  { id: 'service', label: 'Service', icon: 'Wrench', color: 'category-service' },
  { id: 'religion', label: 'Religion', icon: 'Church', color: 'category-religion' },
  { id: 'sports', label: 'Sports', icon: 'Trophy', color: 'category-sports' },
  { id: 'public_transport', label: 'Public Transport', icon: 'Bus', color: 'category-transport' },
];

export const RADIUS_OPTIONS = [
  { value: 1, label: '1 km' },
  { value: 2, label: '2 km' },
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 25, label: '25 km' },
];

export const SORT_OPTIONS = [
  { label: "Distance", value: "distance" },
  { label: "Rating", value: "rating" }
];

export const getCategoryIcon = (category: ServiceCategory) => {
  switch (category) {
    case 'accommodation': return Bed;
    case 'activity': return Activity;
    case 'airport': return Plane;
    case 'commercial': return Building2;
    case 'catering': return UtensilsCrossed;
    case 'emergency': return Siren;
    case 'education': return GraduationCap;
    case 'childcare': return Baby;
    case 'entertainment': return Drama;
    case 'healthcare': return Heart;
    case 'heritage': return Landmark;
    case 'highway': return Route;
    case 'offices': return Briefcase;
    case 'parking': return ParkingCircle;
    case 'pet': return PawPrint;
    case 'power': return Zap;
    case 'railway': return TrainFront;
    case 'rental': return Car;
    case 'service': return Wrench;
    case 'religion': return Church;
    case 'sports': return Trophy;
    case 'public_transport': return Bus;
    default: return Wrench;
  }
};

export const getCategoryColor = (category: ServiceCategory): string => {
  switch (category) {
    case 'accommodation': return 'bg-blue-500 text-white';
    case 'activity': return 'bg-green-500 text-white';
    case 'airport': return 'bg-sky-500 text-white';
    case 'commercial': return 'bg-slate-600 text-white';
    case 'catering': return 'bg-orange-500 text-white';
    case 'emergency': return 'bg-red-600 text-white';
    case 'education': return 'bg-purple-500 text-white';
    case 'childcare': return 'bg-pink-400 text-white';
    case 'entertainment': return 'bg-fuchsia-500 text-white';
    case 'healthcare': return 'bg-rose-500 text-white';
    case 'heritage': return 'bg-amber-600 text-white';
    case 'highway': return 'bg-gray-500 text-white';
    case 'offices': return 'bg-indigo-500 text-white';
    case 'parking': return 'bg-blue-600 text-white';
    case 'pet': return 'bg-amber-500 text-white';
    case 'power': return 'bg-yellow-500 text-black';
    case 'railway': return 'bg-teal-600 text-white';
    case 'rental': return 'bg-cyan-500 text-white';
    case 'service': return 'bg-zinc-600 text-white';
    case 'religion': return 'bg-violet-600 text-white';
    case 'sports': return 'bg-emerald-500 text-white';
    case 'public_transport': return 'bg-lime-600 text-white';
    default: return 'bg-primary text-primary-foreground';
  }
};

export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
};

export const formatPriceRange = (range: 1 | 2 | 3 | 4): string => {
  return '$'.repeat(range);
};
