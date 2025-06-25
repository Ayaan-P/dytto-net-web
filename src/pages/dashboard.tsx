"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/app-shell';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RelationshipCards } from '@/components/dashboard/relationship-cards';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { useDashboard } from '@/lib/hooks/use-supabase';

export default function DashboardPage() {
  const { dashboardData, loading } = useDashboard();

  if (loading) {
    return (
      <AppShell>
        <div className="p-6">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

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
        <StatsCards stats={dashboardData?.stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Relationships - Takes up 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Your Connections</h2>
              <RelationshipCards relationships={dashboardData?.relationships} />
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