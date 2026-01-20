// Vastu Compliance Calculator
// Implements scoring algorithm based on traditional Vastu Shastra principles

import {
  Direction,
  CardinalDirection,
  RoomType,
  RoomVastu,
  VastuInput,
  VastuScore,
  VastuScoreBreakdown,
  VastuRecommendation,
  ROOM_CONFIGS,
  getRoomConfig,
  getDirectionConfig,
} from './vastu-types';

// Entry direction scores based on Vastu principles
const ENTRY_SCORES: Record<Direction, number> = {
  'N': 90,
  'NE': 100, // Best - Most auspicious
  'E': 95,
  'SE': 60,
  'S': 20,   // Avoid
  'SW': 10,  // Worst - Most inauspicious
  'W': 70,
  'NW': 65,
  'CENTER': 50,
};

// Sleeping direction scores
const SLEEPING_DIRECTION_SCORES: Record<CardinalDirection, number> = {
  'S': 100, // Best - Head towards South
  'E': 80,  // Second best - Knowledge and clarity
  'W': 60,  // Moderately good - Stability
  'N': 0,   // Avoid - Disturbed sleep
};

// Sleeping direction recommendations
const SLEEPING_DIRECTION_LABELS: Record<CardinalDirection, { label: string; description: string }> = {
  'S': { label: 'Excellent', description: 'Health, wealth, and peaceful sleep' },
  'E': { label: 'Good', description: 'Knowledge, clarity, and mental peace' },
  'W': { label: 'Moderate', description: 'Stability and material success' },
  'N': { label: 'Avoid', description: 'May cause disturbed sleep and health issues' },
};

// Room placement scoring weights
const PLACEMENT_WEIGHTS = {
  ideal: 100,
  acceptable: 70,
  neutral: 40,
  avoid: 10,
};

// Category weights for overall score
const CATEGORY_WEIGHTS = {
  entry: 0.2,        // 20%
  roomPlacement: 0.4, // 40%
  sleeping: 0.2,      // 20%
  openSpace: 0.2,     // 20%
};

/**
 * Calculate score for main entry direction
 */
function calculateEntryScore(mainEntry: Direction): {
  score: number;
  recommendations: VastuRecommendation[];
  compliantItems: string[];
  nonCompliantItems: string[];
} {
  const score = ENTRY_SCORES[mainEntry];
  const recommendations: VastuRecommendation[] = [];
  const compliantItems: string[] = [];
  const nonCompliantItems: string[] = [];
  const directionConfig = getDirectionConfig(mainEntry);
  const directionName = directionConfig?.fullName || mainEntry;

  if (score >= 90) {
    compliantItems.push(`Main entry facing ${directionName} is excellent for prosperity`);
  } else if (score >= 60) {
    compliantItems.push(`Main entry facing ${directionName} is acceptable`);
    if (score < 80) {
      recommendations.push({
        id: 'entry-improve',
        severity: 'low',
        category: 'entry',
        title: 'Entry Direction Could Be Better',
        description: `While ${directionName} entry is acceptable, North, Northeast, or East entries are more auspicious.`,
        currentState: `Main entry faces ${directionName}`,
        idealState: 'Ideally, main entry should face Northeast, North, or East',
      });
    }
  } else {
    nonCompliantItems.push(`Main entry facing ${directionName} is not ideal according to Vastu`);
    recommendations.push({
      id: 'entry-critical',
      severity: score <= 20 ? 'high' : 'medium',
      category: 'entry',
      title: 'Unfavorable Entry Direction',
      description: `${directionName} facing entry may bring challenges. Consider Vastu remedies or if possible, use an alternative entrance.`,
      currentState: `Main entry faces ${directionName}`,
      idealState: 'Main entry should face Northeast, North, or East',
    });
  }

  return { score, recommendations, compliantItems, nonCompliantItems };
}

/**
 * Calculate score for a single room placement
 */
function calculateRoomScore(room: RoomVastu): {
  score: number;
  isIdeal: boolean;
  isAcceptable: boolean;
  suggestion?: string;
} {
  const config = getRoomConfig(room.roomType);
  if (!config) {
    return { score: 50, isIdeal: false, isAcceptable: true };
  }

  const direction = room.direction;
  const directionConfig = getDirectionConfig(direction);
  const directionName = directionConfig?.fullName || direction;

  if (config.idealDirections.includes(direction)) {
    return { score: PLACEMENT_WEIGHTS.ideal, isIdeal: true, isAcceptable: true };
  }

  if (config.acceptableDirections.includes(direction)) {
    return { 
      score: PLACEMENT_WEIGHTS.acceptable, 
      isIdeal: false, 
      isAcceptable: true,
      suggestion: `${config.label} in ${directionName} is good, but ${config.idealDirections.map(d => getDirectionConfig(d)?.fullName).join(' or ')} would be ideal.`
    };
  }

  if (config.avoidDirections.includes(direction)) {
    const idealDirectionNames = config.idealDirections.map(d => getDirectionConfig(d)?.fullName).join(', ');
    return {
      score: PLACEMENT_WEIGHTS.avoid,
      isIdeal: false,
      isAcceptable: false,
      suggestion: `${config.label} should ideally be in ${idealDirectionNames}. Current placement in ${directionName} is not recommended.`
    };
  }

  // Neutral position
  return { 
    score: PLACEMENT_WEIGHTS.neutral, 
    isIdeal: false, 
    isAcceptable: true,
    suggestion: `${config.label} in ${directionName} is neutral. Consider ${config.idealDirections.map(d => getDirectionConfig(d)?.fullName).join(' or ')} for better Vastu compliance.`
  };
}

/**
 * Calculate overall room placement score
 */
function calculateRoomPlacementScore(rooms: RoomVastu[]): {
  score: number;
  recommendations: VastuRecommendation[];
  compliantItems: string[];
  nonCompliantItems: string[];
  roomScores: VastuScore['roomScores'];
} {
  const recommendations: VastuRecommendation[] = [];
  const compliantItems: string[] = [];
  const nonCompliantItems: string[] = [];
  const roomScores: VastuScore['roomScores'] = [];

  if (rooms.length === 0) {
    return { score: 50, recommendations, compliantItems, nonCompliantItems, roomScores };
  }

  let totalScore = 0;

  for (const room of rooms) {
    const config = getRoomConfig(room.roomType);
    const roomResult = calculateRoomScore(room);
    const directionConfig = getDirectionConfig(room.direction);
    const directionName = directionConfig?.fullName || room.direction;
    const roomLabel = room.label || config?.label || room.roomType;

    roomScores.push({
      roomId: room.id,
      roomType: room.roomType,
      direction: room.direction,
      score: roomResult.score,
      isIdeal: roomResult.isIdeal,
      isAcceptable: roomResult.isAcceptable,
      suggestion: roomResult.suggestion,
    });

    totalScore += roomResult.score;

    if (roomResult.isIdeal) {
      compliantItems.push(`${roomLabel} in ${directionName} is perfectly placed`);
    } else if (roomResult.isAcceptable) {
      if (roomResult.suggestion) {
        recommendations.push({
          id: `room-${room.id}-improve`,
          severity: 'low',
          category: 'room',
          title: `${roomLabel} Placement Could Be Optimized`,
          description: roomResult.suggestion,
          currentState: `${roomLabel} is in ${directionName}`,
          idealState: `Ideal placement: ${config?.idealDirections.map(d => getDirectionConfig(d)?.fullName).join(', ')}`,
          roomId: room.id,
        });
      }
    } else {
      nonCompliantItems.push(`${roomLabel} in ${directionName} conflicts with Vastu guidelines`);
      recommendations.push({
        id: `room-${room.id}-critical`,
        severity: 'high',
        category: 'room',
        title: `${roomLabel} Placement Needs Attention`,
        description: roomResult.suggestion || `This room placement is not recommended according to Vastu.`,
        currentState: `${roomLabel} is in ${directionName}`,
        idealState: `Should be in ${config?.idealDirections.map(d => getDirectionConfig(d)?.fullName).join(', ')}`,
        roomId: room.id,
      });
    }
  }

  return {
    score: Math.round(totalScore / rooms.length),
    recommendations,
    compliantItems,
    nonCompliantItems,
    roomScores,
  };
}

/**
 * Calculate sleeping direction score
 */
function calculateSleepingScore(rooms: RoomVastu[]): {
  score: number;
  recommendations: VastuRecommendation[];
  compliantItems: string[];
  nonCompliantItems: string[];
} {
  const recommendations: VastuRecommendation[] = [];
  const compliantItems: string[] = [];
  const nonCompliantItems: string[] = [];

  const bedrooms = rooms.filter(r => 
    (r.roomType === 'master_bedroom' || r.roomType === 'bedroom') && 
    r.sleepingDirection
  );

  if (bedrooms.length === 0) {
    return { score: 70, recommendations, compliantItems, nonCompliantItems }; // Default score if no sleeping direction specified
  }

  let totalScore = 0;

  for (const bedroom of bedrooms) {
    if (!bedroom.sleepingDirection) continue;

    const sleepingScore = SLEEPING_DIRECTION_SCORES[bedroom.sleepingDirection];
    const sleepingInfo = SLEEPING_DIRECTION_LABELS[bedroom.sleepingDirection];
    const config = getRoomConfig(bedroom.roomType);
    const roomLabel = bedroom.label || config?.label || 'Bedroom';

    totalScore += sleepingScore;

    if (sleepingScore >= 80) {
      compliantItems.push(`${roomLabel}: Sleeping with head towards ${bedroom.sleepingDirection} is ${sleepingInfo.label.toLowerCase()}`);
    } else if (sleepingScore >= 60) {
      recommendations.push({
        id: `sleeping-${bedroom.id}-improve`,
        severity: 'low',
        category: 'sleeping',
        title: `${roomLabel} Sleeping Direction`,
        description: `Sleeping with head towards ${bedroom.sleepingDirection} provides ${sleepingInfo.description.toLowerCase()}. South is ideal.`,
        currentState: `Head towards ${bedroom.sleepingDirection}`,
        idealState: 'Head towards South for best results',
        roomId: bedroom.id,
      });
    } else {
      nonCompliantItems.push(`${roomLabel}: Sleeping with head towards ${bedroom.sleepingDirection} should be avoided`);
      recommendations.push({
        id: `sleeping-${bedroom.id}-critical`,
        severity: 'high',
        category: 'sleeping',
        title: `Change Sleeping Direction in ${roomLabel}`,
        description: `Sleeping with head towards ${bedroom.sleepingDirection} ${sleepingInfo.description.toLowerCase()}. This is considered highly inauspicious in Vastu.`,
        currentState: `Head towards ${bedroom.sleepingDirection}`,
        idealState: 'Change bed position so head points South or East',
        roomId: bedroom.id,
      });
    }
  }

  return {
    score: Math.round(totalScore / bedrooms.length),
    recommendations,
    compliantItems,
    nonCompliantItems,
  };
}

/**
 * Calculate open space score
 * Rule: More open space in North than South, More in East than West
 */
function calculateOpenSpaceScore(openSpaces: VastuInput['openSpaces']): {
  score: number;
  recommendations: VastuRecommendation[];
  compliantItems: string[];
  nonCompliantItems: string[];
} {
  const recommendations: VastuRecommendation[] = [];
  const compliantItems: string[] = [];
  const nonCompliantItems: string[] = [];

  let score = 50; // Base score

  // Check North vs South (North should be more open)
  if (openSpaces.north > openSpaces.south) {
    score += 25;
    compliantItems.push('More open space in North than South - Good for positive energy flow');
  } else if (openSpaces.north === openSpaces.south) {
    score += 10;
    recommendations.push({
      id: 'space-north-south',
      severity: 'low',
      category: 'space',
      title: 'Balance Open Space North-South',
      description: 'Vastu recommends more open space in the North direction for better energy flow.',
      currentState: 'Equal open space in North and South',
      idealState: 'North should have more open space than South',
    });
  } else {
    nonCompliantItems.push('Less open space in North than South');
    recommendations.push({
      id: 'space-north-south-critical',
      severity: 'medium',
      category: 'space',
      title: 'Increase North Open Space',
      description: 'Having more construction in the North blocks positive cosmic energy. Try to keep North lighter and more open.',
      currentState: 'South has more open space than North',
      idealState: 'North should have more open space than South',
    });
  }

  // Check East vs West (East should be more open)
  if (openSpaces.east > openSpaces.west) {
    score += 25;
    compliantItems.push('More open space in East than West - Allows morning sunlight and energy');
  } else if (openSpaces.east === openSpaces.west) {
    score += 10;
    recommendations.push({
      id: 'space-east-west',
      severity: 'low',
      category: 'space',
      title: 'Balance Open Space East-West',
      description: 'Vastu recommends more open space in the East to welcome morning sun and positive energy.',
      currentState: 'Equal open space in East and West',
      idealState: 'East should have more open space than West',
    });
  } else {
    nonCompliantItems.push('Less open space in East than West');
    recommendations.push({
      id: 'space-east-west-critical',
      severity: 'medium',
      category: 'space',
      title: 'Increase East Open Space',
      description: 'Morning sunlight from the East is considered auspicious. Having more open space in the East allows this beneficial energy.',
      currentState: 'West has more open space than East',
      idealState: 'East should have more open space than West',
    });
  }

  return {
    score: Math.min(100, score),
    recommendations,
    compliantItems,
    nonCompliantItems,
  };
}

/**
 * Get grade based on overall score
 */
function getGrade(score: number): VastuScore['grade'] {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Average';
  if (score >= 30) return 'Poor';
  return 'Critical';
}

/**
 * Main function to calculate complete Vastu score
 */
export function calculateVastuScore(input: VastuInput): VastuScore {
  // Calculate individual category scores
  const entryResult = calculateEntryScore(input.mainEntry);
  const roomResult = calculateRoomPlacementScore(input.rooms);
  const sleepingResult = calculateSleepingScore(input.rooms);
  const spaceResult = calculateOpenSpaceScore(input.openSpaces);

  // Calculate weighted overall score
  const breakdown: VastuScoreBreakdown = {
    entryScore: entryResult.score,
    roomPlacementScore: roomResult.score,
    sleepingDirectionScore: sleepingResult.score,
    openSpaceScore: spaceResult.score,
  };

  const overallScore = Math.round(
    breakdown.entryScore * CATEGORY_WEIGHTS.entry +
    breakdown.roomPlacementScore * CATEGORY_WEIGHTS.roomPlacement +
    breakdown.sleepingDirectionScore * CATEGORY_WEIGHTS.sleeping +
    breakdown.openSpaceScore * CATEGORY_WEIGHTS.openSpace
  );

  // Combine all recommendations (sorted by severity)
  const allRecommendations = [
    ...entryResult.recommendations,
    ...roomResult.recommendations,
    ...sleepingResult.recommendations,
    ...spaceResult.recommendations,
  ].sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  // Combine compliant and non-compliant items
  const compliantItems = [
    ...entryResult.compliantItems,
    ...roomResult.compliantItems,
    ...sleepingResult.compliantItems,
    ...spaceResult.compliantItems,
  ];

  const nonCompliantItems = [
    ...entryResult.nonCompliantItems,
    ...roomResult.nonCompliantItems,
    ...sleepingResult.nonCompliantItems,
    ...spaceResult.nonCompliantItems,
  ];

  return {
    overall: overallScore,
    grade: getGrade(overallScore),
    breakdown,
    recommendations: allRecommendations,
    compliantItems,
    nonCompliantItems,
    roomScores: roomResult.roomScores,
  };
}

/**
 * Generate a unique ID for rooms
 */
export function generateRoomId(): string {
  return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get color for score display
 */
export function getScoreColor(score: number): string {
  if (score >= 85) return 'text-green-600';
  if (score >= 70) return 'text-emerald-600';
  if (score >= 50) return 'text-yellow-600';
  if (score >= 30) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Get background color for score display
 */
export function getScoreBgColor(score: number): string {
  if (score >= 85) return 'bg-green-100';
  if (score >= 70) return 'bg-emerald-100';
  if (score >= 50) return 'bg-yellow-100';
  if (score >= 30) return 'bg-orange-100';
  return 'bg-red-100';
}

/**
 * Get gradient for score display
 */
export function getScoreGradient(score: number): string {
  if (score >= 85) return 'from-green-500 to-emerald-600';
  if (score >= 70) return 'from-emerald-500 to-teal-600';
  if (score >= 50) return 'from-yellow-500 to-amber-600';
  if (score >= 30) return 'from-orange-500 to-red-500';
  return 'from-red-500 to-red-700';
}
