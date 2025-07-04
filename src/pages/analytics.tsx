"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Heart,
  MessageCircle,
  Target,
  Award
} from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { PremiumCard } from '@/components/ui/premium-card';
import { PremiumButton } from '@/components/ui/premium-button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useBackendRelationships } from '@/lib/hooks/use-backend-api';
import { getLevelColor, getLevelTitle } from '@/lib/utils/levels';
import { format, subDays } from 'date-fns';

export default function AnalyticsPage() {
  const { relationships, loading } = useBackendRelationships();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Calculate analytics data when relationships are loaded
  useEffect(() => {
    if (!loading && relationships.length > 0) {
      const totalXP = relationships.reduce((sum, rel) => sum + (rel.xp || 0), 0);
      const averageLevel = relationships.length > 0 
        ? relationships.reduce((sum, rel) => sum + (rel.level || 1), 0) / relationships.length 
        : 1;

      // Calculate category distribution
      const categoryDistribution: Record<string, number> = {};
      relationships.forEach(rel => {
        if (rel.categories) {
          rel.categories.forEach((cat: string) => {
            categoryDistribution[cat] = (categoryDistribution[cat] || 0) + 1;
          });
        }
      });

      // Calculate level distribution
      const levelDistribution: Record<string, number> = {
        '1-3': 0,
        '4-6': 0,
        '7-10': 0
      };
      
      relationships.forEach(rel => {
        const level = rel.level || 1;
        if (level <= 3) levelDistribution['1-3']++;
        else if (level <= 6) levelDistribution['4-6']++;
        else levelDistribution['7-10']++;
      });

      setAnalyticsData({
        totalXP,
        averageLevel,
        categoryDistribution,
        levelDistribution
      });
    }
  }, [relationships, loading, timeRange]);

  const handleTimeRangeChange = (range: 'week' | 'month' | 'year') => {
    setTimeRange(range);
  };

  if (loading || !analyticsData) {
    return (
      <AppShell>
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" text="Analyzing your relationships..." />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Analytics</h1>
            <p className="text-muted-foreground">
              Deep insights into your relationship patterns and growth
            </p>
          </div>
          
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((range) => (
              <PremiumButton
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTimeRangeChange(range)}
                className="transition-all duration-200"
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </PremiumButton>
            ))}
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <PremiumCard className="p-6 hover-lift">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{relationships.length}</p>
                <p className="text-sm text-muted-foreground">Total Connections</p>
              </div>
            </div>
          </PremiumCard>
          
          <PremiumCard className="p-6 hover-lift">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analyticsData.totalXP}</p>
                <p className="text-sm text-muted-foreground">Total XP Earned</p>
              </div>
            </div>
          </PremiumCard>
          
          <PremiumCard className="p-6 hover-lift">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Award className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analyticsData.averageLevel.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Average Level</p>
              </div>
            </div>
          </PremiumCard>
          
          <PremiumCard className="p-6 hover-lift">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <MessageCircle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {relationships.reduce((count, rel) => {
                    const lastInteraction = rel.last_interaction ? new Date(rel.last_interaction) : null;
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    return count + (lastInteraction && lastInteraction > oneWeekAgo ? 1 : 0);
                  }, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Recent Interactions</p>
              </div>
            </div>
          </PremiumCard>
        </motion.div>

        {/* Charts Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={timeRange}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          >
            {/* Category Distribution */}
            <PremiumCard className="p-6 hover-lift">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Relationship Categories
              </h3>
              <div className="space-y-4">
                {Object.entries(analyticsData.categoryDistribution).map(([category, count]) => {
                  const percentage = (count as number / relationships.length) * 100;
                  return (
                    <div key={category}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">{category}</span>
                        <span className="text-sm text-muted-foreground">{count}</span>
                      </div>
                      <Progress value={percentage} className="h-2 progress-bar" />
                    </div>
                  );
                })}
              </div>
            </PremiumCard>

            {/* Level Distribution */}
            <PremiumCard className="p-6 hover-lift">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Level Distribution
              </h3>
              <div className="space-y-4">
                {Object.entries(analyticsData.levelDistribution).map(([range, count]) => {
                  const percentage = (count as number / relationships.length) * 100;
                  const color = range === '1-3' ? '#6b7280' : range === '4-6' ? '#3b82f6' : '#8b5cf6';
                  return (
                    <div key={range}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Level {range}</span>
                        <span className="text-sm text-muted-foreground">{count}</span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2 progress-bar"
                        style={{ '--progress-background': color } as React.CSSProperties}
                      />
                    </div>
                  );
                })}
              </div>
            </PremiumCard>
          </motion.div>
        </AnimatePresence>

        {/* Top Relationships */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <PremiumCard className="p-6 hover-lift">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Relationships
            </h3>
            <div className="space-y-4">
              {relationships
                .sort((a, b) => (b.xp || 0) - (a.xp || 0))
                .slice(0, 5)
                .map((relationship, index) => (
                  <motion.div 
                    key={relationship.id} 
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors duration-200"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold text-muted-foreground w-6">
                        #{index + 1}
                      </div>
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                        {relationship.photo_url ? (
                          <img 
                            src={relationship.photo_url} 
                            alt={relationship.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-primary">
                            {relationship.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium">{relationship.name}</p>
                      <p className="text-sm text-muted-foreground">{getLevelTitle(relationship.level || 1)}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant="secondary"
                          style={{ backgroundColor: `${getLevelColor(relationship.level || 1)}20`, color: getLevelColor(relationship.level || 1) }}
                        >
                          Level {relationship.level || 1}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{relationship.xp || 0} XP</p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </PremiumCard>
        </motion.div>
      </div>
    </AppShell>
  );
}