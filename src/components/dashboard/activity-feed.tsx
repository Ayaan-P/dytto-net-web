"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { 
  MessageCircle, 
  TrendingUp, 
  Award, 
  Target,
  Users,
  Sparkles
} from 'lucide-react';
import { PremiumCard } from '@/components/ui/premium-card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import type { Activity } from '@/lib/types';

const activityIcons = {
  interaction: MessageCircle,
  level_up: TrendingUp,
  achievement: Award,
  quest_completed: Target,
};

const activityColors = {
  interaction: 'text-blue-500',
  level_up: 'text-emerald-500',
  achievement: 'text-purple-500',
  quest_completed: 'text-amber-500',
};

export function ActivityFeed() {
  const { activities } = useAppStore();

  if (activities.length === 0) {
    return (
      <PremiumCard className="p-6">
        <div className="text-center py-8">
          <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
          <p className="text-muted-foreground">
            Start logging interactions to see your relationship activity here.
          </p>
        </div>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Recent Activity</h2>
      </div>

      <div className="space-y-4">
        {activities.slice(0, 10).map((activity, index) => {
          const Icon = activityIcons[activity.type];
          const iconColor = activityColors[activity.type];

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className={`p-2 rounded-full bg-muted ${iconColor}`}>
                <Icon className="h-4 w-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  {activity.xpGained && (
                    <Badge variant="secondary" className="text-xs">
                      +{activity.xpGained} XP
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-1">
                  {activity.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {activity.relationshipName && (
                    <span>with {activity.relationshipName}</span>
                  )}
                  <span>•</span>
                  <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {activities.length > 10 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-primary hover:underline">
            View all activity
          </button>
        </div>
      )}
    </PremiumCard>
  );
}