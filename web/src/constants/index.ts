import type { VehicleClassInfo } from '@/types';

// ─── Vehicle Classes ──────────────────────────────────────────────────────────

export const VEHICLE_CLASSES: VehicleClassInfo[] = [
  {
    id: 'standard_sedan',
    name: 'Standard Sedan',
    description:
      'A comfortable, clean sedan for reliable airport transfers. Perfect for solo travelers and couples.',
    capacity: 3,
    luggage: 2,
    amenities: ['Climate Control', 'WiFi Hotspot', 'Phone Charger', 'Water Bottle'],
  },
  {
    id: 'business_sedan',
    name: 'Business Sedan',
    description:
      'Premium sedan with upgraded interiors — ideal for business travel with elevated comfort and privacy.',
    capacity: 3,
    luggage: 2,
    amenities: ['Climate Control', 'WiFi Hotspot', 'Phone Charger', 'Water & Refreshments', 'Newspaper'],
  },
  {
    id: 'first_class_suv',
    name: 'First Class SUV',
    description:
      'Luxury SUV with spacious cabin. The ultimate in comfort and style for the discerning traveler.',
    capacity: 5,
    luggage: 4,
    amenities: [
      'Climate Control',
      'WiFi Hotspot',
      'Phone Charger',
      'Premium Refreshments',
      'Privacy Partition',
      'Leather Seats',
    ],
  },
  {
    id: 'luxury_van',
    name: 'Luxury Van',
    description:
      'Spacious luxury van for groups, families, or executives traveling with extra luggage.',
    capacity: 12,
    luggage: 8,
    amenities: [
      'Climate Control',
      'WiFi Hotspot',
      'Multiple Chargers',
      'Premium Refreshments',
      'Extra Legroom',
      'Entertainment System',
    ],
  },
];

// ─── Vehicle Class Labels ─────────────────────────────────────────────────────

export const VEHICLE_CLASS_LABELS: Record<string, string> = {
  standard_sedan: 'Standard Sedan',
  business_sedan: 'Business Sedan',
  first_class_suv: 'First Class SUV',
  luxury_van: 'Luxury Van',
};

// ─── Pricing Tiers (Base fares in USD) ───────────────────────────────────────

export const BASE_PRICING: Record<string, number> = {
  standard_sedan: 65,
  business_sedan: 95,
  first_class_suv: 145,
  luxury_van: 195,
};

// ─── Booking Status Labels ────────────────────────────────────────────────────

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  assigned: 'Driver Assigned',
  en_route: 'Driver En Route',
  arrived: 'Driver Arrived',
  in_progress: 'Ride In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No Show',
};

export const BOOKING_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-warm-white-200 text-brand-black',
  confirmed: 'bg-sea-salt-100 text-sea-salt-800',
  assigned: 'bg-sea-salt-200 text-sea-salt-900',
  en_route: 'bg-terra-cotta-100 text-terra-cotta-700',
  arrived: 'bg-terra-cotta-200 text-terra-cotta-800',
  in_progress: 'bg-terra-cotta-500 text-warm-white',
  completed: 'bg-brand-black text-warm-white',
  cancelled: 'bg-warm-white-200 text-brand-black-400',
  no_show: 'bg-warm-white-200 text-brand-black-400',
};

// ─── US States ────────────────────────────────────────────────────────────────

export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

// ─── Major US Airports ────────────────────────────────────────────────────────

export const MAJOR_AIRPORTS = [
  { iata: 'JAX', name: 'Jacksonville International Airport', city: 'Jacksonville', state: 'FL' },
  { iata: 'MIA', name: 'Miami International Airport', city: 'Miami', state: 'FL' },
  { iata: 'MCO', name: 'Orlando International Airport', city: 'Orlando', state: 'FL' },
  { iata: 'TPA', name: 'Tampa International Airport', city: 'Tampa', state: 'FL' },
  { iata: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', state: 'GA' },
  { iata: 'CLT', name: 'Charlotte Douglas International Airport', city: 'Charlotte', state: 'NC' },
  { iata: 'RDU', name: 'Raleigh-Durham International Airport', city: 'Raleigh', state: 'NC' },
  { iata: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', state: 'NY' },
  { iata: 'LGA', name: 'LaGuardia Airport', city: 'New York', state: 'NY' },
  { iata: 'EWR', name: 'Newark Liberty International Airport', city: 'Newark', state: 'NJ' },
  { iata: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', state: 'CA' },
  { iata: 'ORD', name: "O'Hare International Airport", city: 'Chicago', state: 'IL' },
  { iata: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', state: 'TX' },
  { iata: 'DEN', name: 'Denver International Airport', city: 'Denver', state: 'CO' },
  { iata: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle', state: 'WA' },
  { iata: 'BOS', name: 'Boston Logan International Airport', city: 'Boston', state: 'MA' },
  { iata: 'IAD', name: 'Washington Dulles International Airport', city: 'Washington', state: 'DC' },
  { iata: 'DCA', name: 'Ronald Reagan Washington National Airport', city: 'Arlington', state: 'VA' },
  { iata: 'PHX', name: 'Phoenix Sky Harbor International Airport', city: 'Phoenix', state: 'AZ' },
  { iata: 'LAS', name: 'Harry Reid International Airport', city: 'Las Vegas', state: 'NV' },
];

// ─── Platform Config ──────────────────────────────────────────────────────────

export const PLATFORM_FEE_PERCENTAGE = 0.2; // 20%
export const DRIVER_COMMISSION_PERCENTAGE = 0.8; // 80%
export const AGENCY_COMMISSION_PERCENTAGE = 0.05; // 5%

export const MAX_PASSENGER_COUNT = 14;
export const MAX_BAGS_COUNT = 10;

export const BOOKING_ADVANCE_HOURS = 2; // Must book at least 2 hours in advance

export const SUPPORT_PHONE = '(904) 555-0100';
export const SUPPORT_EMAIL = 'support@bookairportride.com';
export const COMPANY_ADDRESS = 'Jacksonville, FL 32099';

// ─── Navigation Links ─────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { label: 'Book a Ride', href: '/book' },
  { label: 'Track Ride', href: '/track' },
  { label: 'Service Areas', href: '/cities' },
  { label: 'Drive With Us', href: '/drivers' },
  { label: 'Agencies', href: '/agencies' },
];

export const FOOTER_LINKS = {
  services: [
    { label: 'Book Airport Transfer', href: '/book' },
    { label: 'Track Your Ride', href: '/track' },
    { label: 'Service Areas', href: '/cities' },
    { label: 'Vehicle Classes', href: '/book#vehicles' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Drive With Us', href: '/drivers' },
    { label: 'Agency Partners', href: '/agencies' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};
