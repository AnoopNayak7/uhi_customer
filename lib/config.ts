export const APP_CONFIG = {
  name: 'Urbanhousein',
  description: 'Find Your Dream Property with Urbanhousein',
  primaryColor: '#FE2C2D',
  api: {
    baseUrl: 'https://g82q9hlk9h.execute-api.ap-south-1.amazonaws.com/prod/api'
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
  { value: 'apartment', label: 'Apartment' },
  // { value: 'apartment', label: 'Flat' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'plot', label: 'Plot' },
  { value: 'office', label: 'Office' },
  { value: 'shop', label: 'Shop' }
];

// Helper function to normalize property categories
export const normalizePropertyCategory = (category: string): string => {
  const categoryMap: { [key: string]: string } = {
    'flat': 'apartment',
    'apartment': 'apartment',
    'house': 'house',
    'villa': 'villa',
    'plot': 'plot',
    'office': 'office',
    'shop': 'shop'
  };
  return categoryMap[category.toLowerCase()] || category;
};

export const CITIES = [
  'Bengaluru'
];

export const BHK_OPTIONS = [
  { value: '1', label: '1 BHK' },
  { value: '2', label: '2 BHK' },
  { value: '3', label: '3 BHK' },
  { value: '4', label: '4 BHK' },
  { value: '5', label: '5 BHK' },
  { value: '6', label: '6 BHK' },
  { value: '7', label: '7 BHK' },
  { value: '8', label: '8 BHK' },
  { value: '9', label: '9 BHK' },
  { value: '10+', label: '10+ BHK' }
];

export const FURNISHING_STATUS = [
  { value: 'furnished', label: 'Furnished' },
  { value: 'semi_furnished', label: 'Semi-Furnished' },
  { value: 'unfurnished', label: 'Unfurnished' },
  { value: 'gated_communities', label: 'Gated Communities' }
];

export const POSSESSION_STATUS = [
  { value: 'new', label: 'New' },
  { value: 'resale', label: 'Resale' },
  { value: 'under_construction', label: 'Under Construction' },
  { value: 'ready_to_move', label: 'Ready To Move' }
];