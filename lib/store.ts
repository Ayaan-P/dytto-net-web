"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  User, 
  Relationship, 
  Interaction, 
  Quest, 
  Achievement, 
  DashboardStats,
  Activity,
  Category 
} from './types';

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Relationships state
  relationships: Relationship[];
  setRelationships: (relationships: Relationship[]) => void;
  addRelationship: (relationship: Relationship) => void;
  updateRelationship: (id: string, updates: Partial<Relationship>) => void;
  deleteRelationship: (id: string) => void;
  
  // Interactions state
  interactions: Interaction[];
  setInteractions: (interactions: Interaction[]) => void;
  addInteraction: (interaction: Interaction) => void;
  
  // Quests state
  quests: Quest[];
  setQuests: (quests: Quest[]) => void;
  completeQuest: (id: string) => void;
  
  // Achievements state
  achievements: Achievement[];
  setAchievements: (achievements: Achievement[]) => void;
  unlockAchievement: (achievement: Achievement) => void;
  
  // Dashboard state
  dashboardStats: DashboardStats;
  setDashboardStats: (stats: DashboardStats) => void;
  
  // Activity feed
  activities: Activity[];
  setActivities: (activities: Activity[]) => void;
  addActivity: (activity: Activity) => void;
  
  // Categories
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  
  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Selected relationship for detailed view
  selectedRelationship: Relationship | null;
  setSelectedRelationship: (relationship: Relationship | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
      // Relationships state
      relationships: [],
      setRelationships: (relationships) => {
        set({ relationships });
        // Update dashboard stats when relationships change
        const stats = get().dashboardStats;
        set({
          dashboardStats: {
            ...stats,
            totalRelationships: relationships.length,
            totalXP: relationships.reduce((sum, rel) => sum + rel.xp, 0),
            averageLevel: relationships.length > 0 
              ? relationships.reduce((sum, rel) => sum + rel.level, 0) / relationships.length 
              : 1,
          }
        });
      },
      addRelationship: (relationship) => {
        const newRelationships = [...get().relationships, relationship];
        set({ relationships: newRelationships });
        
        // Update dashboard stats
        const stats = get().dashboardStats;
        set({
          dashboardStats: {
            ...stats,
            totalRelationships: newRelationships.length,
            totalXP: newRelationships.reduce((sum, rel) => sum + rel.xp, 0),
            averageLevel: newRelationships.reduce((sum, rel) => sum + rel.level, 0) / newRelationships.length,
          }
        });
      },
      updateRelationship: (id, updates) => {
        const newRelationships = get().relationships.map((rel) =>
          rel.id === id ? { ...rel, ...updates } : rel
        );
        set({ relationships: newRelationships });
        
        // Update dashboard stats
        const stats = get().dashboardStats;
        set({
          dashboardStats: {
            ...stats,
            totalXP: newRelationships.reduce((sum, rel) => sum + rel.xp, 0),
            averageLevel: newRelationships.reduce((sum, rel) => sum + rel.level, 0) / newRelationships.length,
          }
        });
      },
      deleteRelationship: (id) => {
        const newRelationships = get().relationships.filter((rel) => rel.id !== id);
        set({ relationships: newRelationships });
        
        // Update dashboard stats
        const stats = get().dashboardStats;
        set({
          dashboardStats: {
            ...stats,
            totalRelationships: newRelationships.length,
            totalXP: newRelationships.reduce((sum, rel) => sum + rel.xp, 0),
            averageLevel: newRelationships.length > 0 
              ? newRelationships.reduce((sum, rel) => sum + rel.level, 0) / newRelationships.length 
              : 1,
          }
        });
      },
      
      // Interactions state
      interactions: [],
      setInteractions: (interactions) => set({ interactions }),
      addInteraction: (interaction) =>
        set((state) => ({ 
          interactions: [...state.interactions, interaction] 
        })),
      
      // Quests state
      quests: [],
      setQuests: (quests) => set({ quests }),
      completeQuest: (id) =>
        set((state) => ({
          quests: state.quests.map((quest) =>
            quest.id === id ? { ...quest, status: 'completed' as const } : quest
          ),
        })),
      
      // Achievements state
      achievements: [],
      setAchievements: (achievements) => set({ achievements }),
      unlockAchievement: (achievement) =>
        set((state) => ({ 
          achievements: [...state.achievements, achievement] 
        })),
      
      // Dashboard state
      dashboardStats: {
        totalRelationships: 0,
        activeRelationships: 0,
        overdueConnections: 0,
        weeklyGrowth: 0,
        totalXP: 0,
        averageLevel: 1,
      },
      setDashboardStats: (dashboardStats) => set({ dashboardStats }),
      
      // Activity feed
      activities: [],
      setActivities: (activities) => set({ activities }),
      addActivity: (activity) =>
        set((state) => ({ 
          activities: [activity, ...state.activities].slice(0, 50) // Keep last 50 activities
        })),
      
      // Categories
      categories: [
        { id: '1', name: 'Friend', color: '#10b981', icon: 'Users', description: 'Personal friendships' },
        { id: '2', name: 'Business', color: '#3b82f6', icon: 'Briefcase', description: 'Professional contacts' },
        { id: '3', name: 'Family', color: '#f59e0b', icon: 'Heart', description: 'Family members' },
        { id: '4', name: 'Mentor', color: '#8b5cf6', icon: 'GraduationCap', description: 'Mentors and advisors' },
        { id: '5', name: 'Romantic', color: '#f43f5e', icon: 'Heart', description: 'Romantic relationships' },
        { id: '6', name: 'Acquaintance', color: '#6b7280', icon: 'User', description: 'Casual acquaintances' },
      ],
      setCategories: (categories) => set({ categories }),
      
      // UI state
      sidebarOpen: true,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      
      // Selected relationship
      selectedRelationship: null,
      setSelectedRelationship: (selectedRelationship) => set({ selectedRelationship }),
    }),
    {
      name: 'dytto-storage',
      partialize: (state) => ({
        user: state.user,
        relationships: state.relationships,
        interactions: state.interactions,
        quests: state.quests,
        achievements: state.achievements,
        categories: state.categories,
        activities: state.activities,
        dashboardStats: state.dashboardStats,
      }),
    }
  )
);