"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/app-shell';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RelationshipCards } from '@/components/dashboard/relationship-cards';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { useAppStore } from '@/lib/store';
import type { User, Relationship, DashboardStats } from '@/lib/types';

// Mock data for demo
const mockUser: User = {
  id: '1',
  email: 'demo@dytto.com',
  name: 'Demo User',
  preferences: {
    theme: 'light',
    notifications: true,
    reminderFrequency: 'weekly',
    aiInsights: true,
  },
  createdAt: new Date(),
};

const mockRelationships: Relationship[] = [
  {
    id: '1',
    userId: '1',
    name: 'Sarah Johnson',
    bio: 'Product Manager at TechCorp',
    level: 4,
    xp: 85,
    categories: [
      { id: '2', name: 'Business', color: '#3b82f6', icon: 'Briefcase' },
      { id: '1', name: 'Friend', color: '#10b981', icon: 'Users' },
    ],
    tags: [],
    lastInteraction: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    reminderInterval: 'weekly',
    contactInfo: { email: 'sarah@techcorp.com' },
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: '2',
    userId: '1',
    name: 'Mike Chen',
    bio: 'Software Engineer and hiking enthusiast',
    level: 6,
    xp: 156,
    categories: [
      { id: '1', name: 'Friend', color: '#10b981', icon: 'Users' },
    ],
    tags: [],
    lastInteraction: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    reminderInterval: 'weekly',
    contactInfo: { email: 'mike.chen@email.com' },
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: '3',
    userId: '1',
    name: 'Emma Rodriguez',
    bio: 'Marketing Director',
    level: 3,
    xp: 42,
    categories: [
      { id: '2', name: 'Business', color: '#3b82f6', icon: 'Briefcase' },
    ],
    tags: [],
    lastInteraction: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    reminderInterval: 'biweekly',
    contactInfo: { email: 'emma@marketing.com' },
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
];

const mockStats: DashboardStats = {
  totalRelationships: 3,
  activeRelationships: 2,
  overdueConnections: 1,
  weeklyGrowth: 15,
  totalXP: 283,
  averageLevel: 4.3,
};

export default function Dashboard() {
  const { 
    setUser, 
    setRelationships, 
    setDashboardStats,
    user 
  } = useAppStore();

  useEffect(() => {
    // Initialize with mock data
    if (!user) {
      setUser(mockUser);
      setRelationships(mockRelationships);
      setDashboardStats(mockStats);
    }
  }, [user, setUser, setRelationships, setDashboardStats]);

  return (
    <AppShell>
      <div className="p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your relationships today.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Relationships - Takes up 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Your Connections</h2>
              <RelationshipCards />
            </div>
          </div>

          {/* Sidebar - Takes up 1 column */}
          <div className="space-y-6">
            <QuickActions />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </AppShell>
  );
}