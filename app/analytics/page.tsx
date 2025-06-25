"use client";

import React, { useState, useMemo } from 'react';
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
import { useAppStore } from '@/lib/store';
import { getLevelColor, getLevelTitle } from '@/lib/utils/levels';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

export default function AnalyticsPage() {
  const { relationships, interactions, activities } = useAppStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Memoize calculations to prevent unnecessary recalculations
  const analyticsData = useMemo(() => {
    const totalXP = relationships.reduce((sum, rel) => sum + rel.xp, 0);
    const averageLevel = relationships.length > 0 
      ? relationships.reduce((sum, rel) => sum + rel.level, 0) / relationships.length 
      : 1;

    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    const recentInteractions = interactions.filter(interaction => {
      return new Date(interaction.createdAt) > subDays(new Date(), days);
    });

    const categoryDistribution = relationships.reduce((acc, rel) => {
      rel.categories.forEach(cat => {
        acc[cat.name] = (acc[cat.name] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const levelDistribution = relationships.reduce((acc, rel) => {
      const levelRange = rel.level <= 3 ? '1-3' : rel.level <= 6 ? '4-6' : '7-10';
      acc[levelRange] = (acc[levelRange] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sentimentData = recentInteractions.reduce((acc, interaction) => {
      if (interaction.aiAnalysis) {
        acc[interaction.aiAnalysis.sentiment] = (acc[interaction.aiAnalysis.sentiment] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalXP,
      averageLevel,
      recentInteractions,
      categoryDistribution,
      levelDistribution,
      sentimentData
    };
  }, [relationships, interactions, timeRange]);

  const handleTimeRangeChange = (range: 'week' | 'month' | 'year') => {
    setTimeRange(range);
  };

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
                <p className="text-2xl font-bold">{analyticsData.recentInteractions.length}</p>
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
                  const percentage = (count / relationships.length) * 100;
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
                  const percentage = (count / relationships.length) * 100;
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

        {/* Sentiment Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <PremiumCard className="p-6 hover-lift">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Interaction Sentiment ({timeRange})
            </h3>
            {Object.keys(analyticsData.sentimentData).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(analyticsData.sentimentData).map(([sentiment, count]) => {
                  const total = Object.values(analyticsData.sentimentData).reduce((sum, val) => sum + val, 0);
                  const percentage = (count / total) * 100;
                  const color = sentiment === 'positive' ? '#10b981' : 
                               sentiment === 'negative' ? '#ef4444' : '#6b7280';
                  
                  return (
                    <motion.div 
                      key={sentiment} 
                      className="text-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div 
                        className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg transition-transform duration-200"
                        style={{ backgroundColor: color }}
                      >
                        {count}
                      </div>
                      <p className="font-medium capitalize">{sentiment}</p>
                      <p className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</p>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No interactions in this time period</p>
              </div>
            )}
          </PremiumCard>
        </motion.div>

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
                .sort((a, b) => b.xp - a.xp)
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
                        {relationship.photoUrl ? (
                          <img 
                            src={relationship.photoUrl} 
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
                      <p className="text-sm text-muted-foreground">{getLevelTitle(relationship.level)}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant="secondary"
                          style={{ backgroundColor: `${getLevelColor(relationship.level)}20`, color: getLevelColor(relationship.level) }}
                        >
                          Level {relationship.level}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{relationship.xp} XP</p>
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