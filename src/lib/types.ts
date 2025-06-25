export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  preferences: UserPreferences;
  createdAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'monthly';
  aiInsights: boolean;
}

export interface Relationship {
  id: string;
  userId: string;
  name: string;
  bio?: string;
  photoUrl?: string;
  level: number;
  xp: number;
  categories: Category[];
  tags: Tag[];
  lastInteraction?: Date;
  reminderInterval: ReminderInterval;
  contactInfo: ContactInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  address?: string;
  birthday?: Date;
}

export type ReminderInterval = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'custom';

export interface Interaction {
  id: string;
  relationshipId: string;
  content: string;
  sentimentScore?: number;
  xpGained: number;
  aiAnalysis?: AIAnalysis;
  tags: string[];
  createdAt: Date;
}

export interface AIAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  emotionalTone: string[];
  topics: string[];
  suggestions: string[];
  confidence: number;
}

export interface Quest {
  id: string;
  relationshipId?: string;
  title: string;
  description: string;
  type: 'milestone' | 'daily' | 'weekly' | 'custom';
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  status: 'pending' | 'completed' | 'expired';
  deadline?: Date;
  createdAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'relationship' | 'interaction' | 'milestone' | 'special';
}

export interface DashboardStats {
  totalRelationships: number;
  activeRelationships: number;
  overdueConnections: number;
  weeklyGrowth: number;
  totalXP: number;
  averageLevel: number;
}

export interface AIInsights {
  sentimentAnalysis: {
    overall: 'positive' | 'neutral' | 'negative';
    trends: SentimentTrend[];
    emotionalKeywords: string[];
  };
  patterns: {
    communicationStyle: string;
    topicPreferences: string[];
    interactionFrequency: FrequencyPattern;
  };
  suggestions: {
    nextActions: ActionSuggestion[];
    conversationStarters: string[];
    relationshipGoals: Goal[];
  };
}

export interface SentimentTrend {
  date: Date;
  score: number;
  interactions: number;
}

export interface FrequencyPattern {
  average: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  lastWeek: number;
  lastMonth: number;
}

export interface ActionSuggestion {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetLevel?: number;
  deadline?: Date;
  progress: number;
}

export interface RelationshipTree {
  trunk: Category;
  branches: Category[];
  leaves: Milestone[];
  blossoms: Achievement[];
  rings: LevelRing[];
  theme: TreeTheme;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  date: Date;
  level: number;
}

export interface LevelRing {
  level: number;
  unlockedAt: Date;
  xpRequired: number;
}

export type TreeTheme = 'oak' | 'sakura' | 'pine' | 'willow' | 'maple';

export interface Activity {
  id: string;
  type: 'interaction' | 'level_up' | 'achievement' | 'quest_completed';
  relationshipId?: string;
  relationshipName?: string;
  title: string;
  description: string;
  timestamp: Date;
  xpGained?: number;
}