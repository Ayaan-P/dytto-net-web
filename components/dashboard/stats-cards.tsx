"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Clock, Zap } from 'lucide-react';
import { PremiumCard } from '@/components/ui/premium-card';
import { useAppStore } from '@/lib/store';

const statCards = [
  {
    title: 'Total Connections',
    key: 'totalRelationships' as const,
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Active This Week',
    key: 'activeRelationships' as const,
    icon: TrendingUp,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    title: 'Need Attention',
    key: 'overdueConnections' as const,
    icon: Clock,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    title: 'Total XP',
    key: 'totalXP' as const,
    icon: Zap,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
];

export function StatsCards() {
  const { dashboardStats } = useAppStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <PremiumCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold mt-2">
                  {dashboardStats[stat.key]}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </PremiumCard>
        </motion.div>
      ))}
    </div>
  );
}