export type DriverStatus = 'pending' | 'approved' | 'suspended';

export interface DriverApplicationForm {
  // Section 1 - Personal
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  phone: string;
  dateOfBirth: string;
  homeAddress: string;
  city: string;
  state: string;
  zip: string;
  ssnLast4: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;

  // Section 2 - Driving Experience
  yearsDriving: string;
  previousRideshare: boolean;
  rideshareCompanies?: string[];
  hasLiveryLicense: string;
  liveryLicenseNumber?: string;
  liveryLicenseState?: string;
  liveryLicenseExpiry?: string;
  hasDUI: boolean;
  atFaultAccidents: boolean;
  movingViolations: boolean;
  violationsExplanation?: string;

  // Section 3 - Cities
  primaryCity: string;
  primaryState: string;
  additionalCities?: { city: string; state: string }[];
  airportsToServe: string[];
  longDistanceRides: boolean;
  overnightTrips: boolean;
  availability: string[];

  // Section 4 - Vehicle
  vehicleYear: number;
  vehicleMake: string;
  vehicleModel: string;
  vehicleColor: string;
  vehicleVin: string;
  vehiclePlate: string;
  vehiclePlateState: string;
  seatingCapacity: number;
  leatherInterior: boolean;
  rearClimate: boolean;
  tintedWindows: boolean;
  partition: boolean;
  wifi: boolean;
  chargingPorts: boolean;
  currentMileage: number;
  inspectionPassed: boolean;

  // Section 5 - Insurance
  dlNumber: string;
  dlState: string;
  dlExpiry: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  insuranceExpiry: string;
  coverageType: string;
  liabilityCoverage: string;
  businessName?: string;
  einNumber?: string;

  // Section 7 - Agreements
  agreeAccurate: boolean;
  agreeBackgroundCheck: boolean;
  agreePartnerAgreement: boolean;
  agreeInsurance: boolean;
  agreePlatformFee: boolean;
  signature: string;
}
