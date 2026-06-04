export const VEHICLE_CLASSES = [
  {
    id: 'executive-suv',
    name: 'Executive SUV',
    description: 'Premium SUV with leather interior and complimentary water',
    passengers: 4,
    bags: 4,
    baseFare: 65.00,
    perMileRate: 3.25,
    minimumFare: 85.00,
    amenities: ['Leather Interior', 'Climate Control', 'Complimentary Water', 'Phone Charger'],
  },
  {
    id: 'first-class-suv',
    name: 'First Class SUV',
    description: 'Full-size luxury SUV with extra legroom and premium amenities',
    passengers: 6,
    bags: 6,
    baseFare: 85.00,
    perMileRate: 4.00,
    minimumFare: 110.00,
    amenities: ['Extra Legroom', 'Premium Sound', 'Leather Interior', 'WiFi Available', 'Complimentary Water'],
  },
  {
    id: 'executive-van',
    name: 'Executive Van',
    description: 'Luxury sprinter van, ideal for groups and families',
    passengers: 10,
    bags: 8,
    baseFare: 95.00,
    perMileRate: 4.50,
    minimumFare: 125.00,
    amenities: ['Group Seating', 'Extra Luggage Space', 'Climate Control', 'Leather Seats'],
  },
  {
    id: 'vip-sprinter',
    name: 'VIP Sprinter',
    description: 'Top-tier sprinter with premium interior for corporate groups',
    passengers: 14,
    bags: 10,
    baseFare: 125.00,
    perMileRate: 5.50,
    minimumFare: 165.00,
    amenities: ['VIP Interior', 'Conference Setup', 'Premium Sound', 'WiFi', 'Refreshments'],
  },
] as const;

export const FEES = {
  meetAndGreet: 25.00,
  platformFeePercent: 20,
};

export const CANCELLATION_POLICY = {
  fullRefundHours: 24,
  halfRefundMinHours: 12,
  halfRefundMaxHours: 24,
  noRefundHours: 12,
};

export type VehicleClassId = typeof VEHICLE_CLASSES[number]['id'];

export function calculatePrice(
  vehicleId: VehicleClassId,
  distanceMiles: number,
  meetAndGreet: boolean
): { baseFare: number; distanceFee: number; meetGreetFee: number; total: number } {
  const vehicle = VEHICLE_CLASSES.find(v => v.id === vehicleId);
  if (!vehicle) throw new Error('Unknown vehicle class');

  const baseFare = vehicle.baseFare;
  const distanceFee = distanceMiles * vehicle.perMileRate;
  const meetGreetFee = meetAndGreet ? FEES.meetAndGreet : 0;
  const subtotal = baseFare + distanceFee + meetGreetFee;
  const total = Math.max(subtotal, vehicle.minimumFare + meetGreetFee);

  return { baseFare, distanceFee, meetGreetFee, total };
}
