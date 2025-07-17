export const APP_CONFIG = {
  name: 'UrbanHouseIN',
  description: 'Find Your Dream Property with UrbanHouseIN',
  primaryColor: '#FE2C2D',
  api: {
    baseUrl: 'https://5tcwt8cd8h.execute-api.us-east-1.amazonaws.com/dev/api'
  },
  features: {
    compare: {
      maxProperties: 3
    }
  }
};

export const PROPERTY_TYPES = [
  { value: 'sell', label: 'Buy' },
  { value: 'rent', label: 'Rent' },
  { value: 'commercial', label: 'Commercial' },
  // { value: 'pg_co_living', label: 'PG/Co-living' },
  // { value: 'plots', label: 'Plots' }
];

export const PROPERTY_CATEGORIES = [
  { value: 'flat', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'plot', label: 'Plot' },
  { value: 'office', label: 'Office' },
  { value: 'shop', label: 'Shop' }
];

export const CITIES = [
  'Bangalore',
  'Mumbai',
  'Delhi',
  'Chennai',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Ahmedabad'
];

export const BHK_OPTIONS = [
  { value: '1', label: '1 BHK' },
  { value: '2', label: '2 BHK' },
  { value: '3', label: '3 BHK' },
  { value: '4', label: '4 BHK' },
  { value: '5+', label: '5+ BHK' }
];