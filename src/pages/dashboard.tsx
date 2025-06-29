"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/app-shell';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RelationshipCards } from '@/components/dashboard/relationship-cards';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { useDashboardData, useBackendRelationships } from '@/lib/hooks/use-backend-api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PremiumCard } from '@/components/ui/premium-card';

export default function DashboardPage() {
  const { data: dashboardData, loading: dashboardLoading } = useDashboardData();
  const { relationships, loading: relationshipsLoading } = useBackendRelationships();

  const isLoading = dashboardLoading || relationshipsLoading;

  if (isLoading) {
    return (
      <AppShell>
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" text="Loading your dashboard..." />
        </div>
      </AppShell>
    );
  }

  // Transform backend data to match frontend expectations
  const transformedRelationships = relationships.map((rel: any) => ({
    id: rel.id,
    name: rel.name,
    bio: rel.bio,
    level: rel.level || 1,
    xp: rel.xp || 0,
    photoUrl: rel.photo_url,
    categories: rel.categories || [],
    tags: rel.tags || [],
    lastInteraction: rel.last_interaction ? new Date(rel.last_interaction) : undefined,
    reminderInterval: rel.reminder_interval || 'weekly',
    contactInfo: {
      email: rel.email,
      phone: rel.phone,
    },
    createdAt: new Date(rel.created_at),
    updatedAt: new Date(rel.updated_at),
  }));

  // Calculate stats from relationships
  const stats = {
    totalRelationships: relationships.length,
    activeRelationships: relationships.filter((rel: any) => {
      const lastInteraction = rel.last_interaction ? new Date(rel.last_interaction) : null;
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return lastInteraction && lastInteraction > oneWeekAgo;
    }).length,
    overdueConnections: relationships.filter((rel: any) => {
      const lastInteraction = rel.last_interaction ? new Date(rel.last_interaction) : null;
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      return !lastInteraction || lastInteraction < twoWeeksAgo;
    }).length,
    totalXP: relationships.reduce((sum: number, rel: any) => sum + (rel.xp || 0), 0),
  };

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
            Welcome back!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your relationships today.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PremiumCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Connections
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {stats.totalRelationships}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <div className="h-6 w-6 text-blue-500">👥</div>
                </div>
              </div>
            </PremiumCard>

            <PremiumCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active This Week
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {stats.activeRelationships}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/10">
                  <div className="h-6 w-6 text-emerald-500">📈</div>
                </div>
              </div>
            </PremiumCard>

            <PremiumCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Need Attention
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {stats.overdueConnections}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/10">
                  <div className="h-6 w-6 text-amber-500">⏰</div>
                </div>
              </div>
            </PremiumCard>

            <PremiumCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total XP
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {stats.totalXP}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <div className="h-6 w-6 text-purple-500">⚡</div>
                </div>
              </div>
            </PremiumCard>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Relationships - Takes up 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold mb-6">Your Connections</h2>
              <RelationshipCards relationships={transformedRelationships} />
            </motion.div>
          </div>

          {/* Sidebar - Takes up 1 column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <QuickActions />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ActivityFeed />
            </motion.div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}