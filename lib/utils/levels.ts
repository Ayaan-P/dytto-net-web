export function getXPRequiredForLevel(level: number): number {
  // Exponential growth: Level 1 = 0 XP, Level 2 = 10 XP, Level 3 = 25 XP, etc.
  if (level <= 1) return 0;
  return Math.floor(10 * Math.pow(1.5, level - 2));
}

export function getLevelFromXP(xp: number): number {
  let level = 1;
  let totalXPRequired = 0;
  
  while (totalXPRequired <= xp) {
    level++;
    totalXPRequired += getXPRequiredForLevel(level);
  }
  
  return level - 1;
}

export function getXPProgressForCurrentLevel(xp: number, level: number): {
  current: number;
  required: number;
  percentage: number;
} {
  const currentLevelXP = getXPRequiredForLevel(level);
  const nextLevelXP = getXPRequiredForLevel(level + 1);
  
  let totalXPForCurrentLevel = 0;
  for (let i = 1; i <= level; i++) {
    totalXPForCurrentLevel += getXPRequiredForLevel(i);
  }
  
  const currentProgress = xp - totalXPForCurrentLevel;
  const requiredForNext = nextLevelXP;
  const percentage = Math.min((currentProgress / requiredForNext) * 100, 100);
  
  return {
    current: Math.max(currentProgress, 0),
    required: requiredForNext,
    percentage: Math.max(percentage, 0),
  };
}

export function getLevelColor(level: number): string {
  const colors = [
    '#6b7280', // Level 1 - Gray
    '#10b981', // Level 2 - Emerald
    '#84BABF', // Level 3 - Teal (updated to match brand)
    '#8b5cf6', // Level 4 - Violet
    '#f59e0b', // Level 5 - Amber
    '#ef4444', // Level 6 - Red
    '#ec4899', // Level 7 - Pink
    '#06b6d4', // Level 8 - Cyan
    '#84cc16', // Level 9 - Lime
    '#f97316', // Level 10 - Orange
  ];
  
  return colors[Math.min(level - 1, colors.length - 1)] || colors[0];
}

export function getLevelTitle(level: number): string {
  const titles = [
    'New Connection',     // Level 1
    'Acquaintance',       // Level 2
    'Friend',             // Level 3
    'Good Friend',        // Level 4
    'Close Friend',       // Level 5
    'Best Friend',        // Level 6
    'Confidant',          // Level 7
    'Soul Connection',    // Level 8
    'Life Partner',       // Level 9
    'Soulmate',          // Level 10
  ];
  
  return titles[Math.min(level - 1, titles.length - 1)] || titles[0];
}

export function shouldLevelUp(currentXP: number, newXP: number, currentLevel: number): boolean {
  const newLevel = getLevelFromXP(newXP);
  return newLevel > currentLevel;
}

export function getAchievementsForLevel(level: number): string[] {
  const achievements = {
    2: ['First Connection'],
    3: ['Building Bonds'],
    4: ['Growing Closer'],
    5: ['True Friendship'],
    6: ['Deep Connection'],
    7: ['Trusted Confidant'],
    8: ['Soul Bond'],
    9: ['Life Partnership'],
    10: ['Perfect Harmony'],
  };
  
  return achievements[level as keyof typeof achievements] || [];
}