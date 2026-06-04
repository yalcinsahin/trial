export const US_CITIES = [
  { name: 'Jacksonville', state: 'FL', status: 'live' as const, slug: 'jacksonville-fl' },
  { name: 'Miami', state: 'FL', status: 'coming_soon' as const, slug: 'miami-fl' },
  { name: 'Orlando', state: 'FL', status: 'coming_soon' as const, slug: 'orlando-fl' },
  { name: 'Atlanta', state: 'GA', status: 'coming_soon' as const, slug: 'atlanta-ga' },
  { name: 'New York', state: 'NY', status: 'coming_soon' as const, slug: 'new-york-ny' },
  { name: 'Los Angeles', state: 'CA', status: 'coming_soon' as const, slug: 'los-angeles-ca' },
  { name: 'Chicago', state: 'IL', status: 'coming_soon' as const, slug: 'chicago-il' },
  { name: 'Dallas', state: 'TX', status: 'coming_soon' as const, slug: 'dallas-tx' },
  { name: 'Houston', state: 'TX', status: 'coming_soon' as const, slug: 'houston-tx' },
  { name: 'Las Vegas', state: 'NV', status: 'coming_soon' as const, slug: 'las-vegas-nv' },
  { name: 'Nashville', state: 'TN', status: 'coming_soon' as const, slug: 'nashville-tn' },
  { name: 'Charlotte', state: 'NC', status: 'coming_soon' as const, slug: 'charlotte-nc' },
  { name: 'Washington', state: 'DC', status: 'coming_soon' as const, slug: 'washington-dc' },
  { name: 'Boston', state: 'MA', status: 'coming_soon' as const, slug: 'boston-ma' },
  { name: 'San Francisco', state: 'CA', status: 'coming_soon' as const, slug: 'san-francisco-ca' },
];

export const INTL_CITIES = [
  { name: 'London', country: 'United Kingdom', status: 'coming_soon' as const },
  { name: 'Paris', country: 'France', status: 'coming_soon' as const },
  { name: 'Dubai', country: 'UAE', status: 'coming_soon' as const },
  { name: 'Frankfurt', country: 'Germany', status: 'coming_soon' as const },
  { name: 'Istanbul', country: 'Turkey', status: 'coming_soon' as const },
  { name: 'Barcelona', country: 'Spain', status: 'coming_soon' as const },
  { name: 'Madrid', country: 'Spain', status: 'coming_soon' as const },
  { name: 'Cairo', country: 'Egypt', status: 'coming_soon' as const },
  { name: 'Sydney', country: 'Australia', status: 'coming_soon' as const },
];

export const JACKSONVILLE_AIRPORTS = [
  { name: 'Jacksonville International Airport', iata: 'JAX' },
  { name: 'Craig Municipal Airport', iata: 'CRG' },
  { name: 'Cecil Airport', iata: 'VQQ' },
];

export const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC'
];
