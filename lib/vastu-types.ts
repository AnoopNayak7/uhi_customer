// Vastu Compliance Types and Interfaces

export type Direction = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW' | 'CENTER';

export type CardinalDirection = 'N' | 'E' | 'S' | 'W';

export type RoomType = 
  | 'master_bedroom' 
  | 'bedroom' 
  | 'kitchen' 
  | 'bathroom' 
  | 'puja' 
  | 'living' 
  | 'dining' 
  | 'store' 
  | 'balcony' 
  | 'study'
  | 'garage'
  | 'utility';

export interface RoomVastu {
  id: string;
  roomType: RoomType;
  direction: Direction;
  sleepingDirection?: CardinalDirection; // Only for bedrooms
  label?: string; // Custom label like "Kids Room", "Guest Bedroom"
}

export interface OpenSpaces {
  north: number; // Scale 1-5 (1 = minimal, 5 = maximum)
  south: number;
  east: number;
  west: number;
}

export interface VastuInput {
  mainEntry: Direction;
  rooms: RoomVastu[];
  openSpaces: OpenSpaces;
  slope?: Direction; // Land slope direction (water should flow NE ideally)
  waterElements?: {
    undergroundTank?: Direction;
    overheadTank?: Direction;
    borewell?: Direction;
  };
}

export interface VastuRecommendation {
  id: string;
  severity: 'high' | 'medium' | 'low';
  category: 'entry' | 'room' | 'sleeping' | 'space' | 'water' | 'general';
  title: string;
  description: string;
  currentState: string;
  idealState: string;
  roomId?: string; // Reference to the room if applicable
}

export interface VastuScoreBreakdown {
  entryScore: number;        // 0-100
  roomPlacementScore: number; // 0-100
  sleepingDirectionScore: number; // 0-100
  openSpaceScore: number;    // 0-100
  waterElementScore?: number; // 0-100 (optional)
}

export interface VastuScore {
  overall: number; // 0-100
  grade: 'Excellent' | 'Good' | 'Average' | 'Poor' | 'Critical';
  breakdown: VastuScoreBreakdown;
  recommendations: VastuRecommendation[];
  compliantItems: string[];
  nonCompliantItems: string[];
  roomScores: {
    roomId: string;
    roomType: RoomType;
    direction: Direction;
    score: number;
    isIdeal: boolean;
    isAcceptable: boolean;
    suggestion?: string;
  }[];
}

// Room configuration for UI display
export interface RoomConfig {
  type: RoomType;
  label: string;
  icon: string; // Lucide icon name
  description: string;
  hasSleepingDirection: boolean;
  idealDirections: Direction[];
  acceptableDirections: Direction[];
  avoidDirections: Direction[];
}

// Direction configuration for UI display
export interface DirectionConfig {
  direction: Direction;
  label: string;
  fullName: string;
  angle: number; // For compass display
  isCardinal: boolean;
}

// Vastu analysis result for property storage
export interface PropertyVastu {
  data: VastuInput;
  score: VastuScore;
  lastUpdated: string; // ISO date string
  analyzedBy?: 'manual' | 'ai';
}

// Constants for direction display
export const DIRECTION_CONFIGS: DirectionConfig[] = [
  { direction: 'N', label: 'N', fullName: 'North', angle: 0, isCardinal: true },
  { direction: 'NE', label: 'NE', fullName: 'Northeast', angle: 45, isCardinal: false },
  { direction: 'E', label: 'E', fullName: 'East', angle: 90, isCardinal: true },
  { direction: 'SE', label: 'SE', fullName: 'Southeast', angle: 135, isCardinal: false },
  { direction: 'S', label: 'S', fullName: 'South', angle: 180, isCardinal: true },
  { direction: 'SW', label: 'SW', fullName: 'Southwest', angle: 225, isCardinal: false },
  { direction: 'W', label: 'W', fullName: 'West', angle: 270, isCardinal: true },
  { direction: 'NW', label: 'NW', fullName: 'Northwest', angle: 315, isCardinal: false },
  { direction: 'CENTER', label: 'Center', fullName: 'Center', angle: 0, isCardinal: false },
];

// Room configurations with Vastu guidelines
export const ROOM_CONFIGS: RoomConfig[] = [
  {
    type: 'master_bedroom',
    label: 'Master Bedroom',
    icon: 'Bed',
    description: 'Main bedroom for the head of the family',
    hasSleepingDirection: true,
    idealDirections: ['SW'],
    acceptableDirections: ['S', 'W'],
    avoidDirections: ['NE', 'N', 'E'],
  },
  {
    type: 'bedroom',
    label: 'Bedroom',
    icon: 'BedDouble',
    description: 'Guest or children bedroom',
    hasSleepingDirection: true,
    idealDirections: ['SW', 'S', 'W'],
    acceptableDirections: ['NW'],
    avoidDirections: ['NE', 'SE'],
  },
  {
    type: 'kitchen',
    label: 'Kitchen',
    icon: 'ChefHat',
    description: 'Cooking area - Fire element',
    hasSleepingDirection: false,
    idealDirections: ['SE'],
    acceptableDirections: ['NW', 'E'],
    avoidDirections: ['NE', 'SW', 'N'],
  },
  {
    type: 'bathroom',
    label: 'Bathroom/Toilet',
    icon: 'Bath',
    description: 'Washroom and toilet area',
    hasSleepingDirection: false,
    idealDirections: ['NW', 'W'],
    acceptableDirections: ['N'],
    avoidDirections: ['NE', 'SW', 'SE', 'CENTER'],
  },
  {
    type: 'puja',
    label: 'Puja Room',
    icon: 'Flame',
    description: 'Prayer and worship area',
    hasSleepingDirection: false,
    idealDirections: ['NE'],
    acceptableDirections: ['E', 'N'],
    avoidDirections: ['S', 'SW', 'SE'],
  },
  {
    type: 'living',
    label: 'Living Room',
    icon: 'Sofa',
    description: 'Main gathering and sitting area',
    hasSleepingDirection: false,
    idealDirections: ['NE', 'N', 'E'],
    acceptableDirections: ['NW', 'CENTER'],
    avoidDirections: ['SW', 'S'],
  },
  {
    type: 'dining',
    label: 'Dining Room',
    icon: 'UtensilsCrossed',
    description: 'Eating and dining area',
    hasSleepingDirection: false,
    idealDirections: ['E', 'W'],
    acceptableDirections: ['S', 'CENTER'],
    avoidDirections: ['NE', 'SW'],
  },
  {
    type: 'store',
    label: 'Store Room',
    icon: 'Archive',
    description: 'Storage for heavy items',
    hasSleepingDirection: false,
    idealDirections: ['SW'],
    acceptableDirections: ['W', 'S', 'NW'],
    avoidDirections: ['NE', 'N', 'E'],
  },
  {
    type: 'balcony',
    label: 'Balcony',
    icon: 'TreePine',
    description: 'Open area for light and air',
    hasSleepingDirection: false,
    idealDirections: ['N', 'E', 'NE'],
    acceptableDirections: ['NW', 'SE'],
    avoidDirections: ['SW', 'S'],
  },
  {
    type: 'study',
    label: 'Study/Office',
    icon: 'BookOpen',
    description: 'Work and study area',
    hasSleepingDirection: false,
    idealDirections: ['NE', 'E', 'N'],
    acceptableDirections: ['W', 'NW'],
    avoidDirections: ['S', 'SW', 'SE'],
  },
  {
    type: 'garage',
    label: 'Garage',
    icon: 'Car',
    description: 'Vehicle parking area',
    hasSleepingDirection: false,
    idealDirections: ['NW', 'SE'],
    acceptableDirections: ['E', 'N'],
    avoidDirections: ['NE', 'SW'],
  },
  {
    type: 'utility',
    label: 'Utility Room',
    icon: 'Wrench',
    description: 'Laundry and utility area',
    hasSleepingDirection: false,
    idealDirections: ['SE', 'NW'],
    acceptableDirections: ['W', 'S'],
    avoidDirections: ['NE', 'N'],
  },
];

// Helper function to get room config by type
export function getRoomConfig(roomType: RoomType): RoomConfig | undefined {
  return ROOM_CONFIGS.find(config => config.type === roomType);
}

// Helper function to get direction config
export function getDirectionConfig(direction: Direction): DirectionConfig | undefined {
  return DIRECTION_CONFIGS.find(config => config.direction === direction);
}

// Grid position mapping for 3x3 direction grid
export const DIRECTION_GRID_POSITIONS: { [key in Direction]: { row: number; col: number } } = {
  'NW': { row: 0, col: 0 },
  'N': { row: 0, col: 1 },
  'NE': { row: 0, col: 2 },
  'W': { row: 1, col: 0 },
  'CENTER': { row: 1, col: 1 },
  'E': { row: 1, col: 2 },
  'SW': { row: 2, col: 0 },
  'S': { row: 2, col: 1 },
  'SE': { row: 2, col: 2 },
};
