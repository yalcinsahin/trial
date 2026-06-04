export type TripType = 'pickup' | 'dropoff';
export type VehicleClass = 'executive-suv' | 'first-class-suv' | 'executive-van' | 'vip-sprinter';
export type BookingStatus = 'pending' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'authorized' | 'paid' | 'refunded';

export interface BookingFormData {
  tripType: TripType;
  pickupAddress: string;
  dropoffAddress: string;
  pickupDate: string;
  pickupTime: string;
  returnTrip: boolean;
  returnDate?: string;
  returnTime?: string;
  airline?: string;
  flightNumber?: string;
  passengersCount: number;
  bagsCount: number;
  childSeats: boolean;
  childSeatsCount?: number;
  meetAndGreet: boolean;
  specialRequests?: string;
  vehicleClass: VehicleClass;
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  phone: string;
  countryCode: string;
  howHeard?: string;
  promoCode?: string;
  agreeTerms: boolean;
  agreeSms: boolean;
}

export interface PriceSummary {
  baseFare: number;
  distanceFee: number;
  meetGreetFee: number;
  promoDiscount: number;
  total: number;
  estimatedMiles: number;
}
