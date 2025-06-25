"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Trophy, 
  Clock, 
  Star, 
  CheckCircle, 
  Plus,
  Calendar,
  Zap
} from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { PremiumCard } from '@/components/ui/premium-card';
import { PremiumButton } from '@/components/ui/premium-button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/lib/store';
import type { Quest } from '@/lib/types';

export default function QuestsPage() {
  const { relationships, quests, completeQuest } = useAppStore();
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'available'>('active');

  // Memoize quest generation to prevent unnecessary recalculations
  const allQuests = useMemo((): Quest[] => {
    return [
      {
        id: '1',
        title: 'Deep Conversation',
        description: 'Have a meaningful conversation about personal goals or dreams',
        type: 'daily',
        difficulty: 'medium',
        xpReward: 15,
        status: 'pending',
        createdAt: new Date(),
      },
      {
        id: '2',
        title: 'Reconnect',
        description: 'Reach out to someone you haven\'t talked to in over a month',
        type: 'weekly',
        difficulty: 'easy',
        xpReward: 10,
        status: 'pending',
        createdAt: new Date(),
      },
      {
        id: '3',
        title: 'Level Up',
        description: 'Help a relationship reach the next level through consistent interaction',
        type: 'milestone',
        difficulty: 'hard',
        xpReward: 25,
        status: 'pending',
        createdAt: new Date(),
      },
      {
        id: '4',
        title: 'New Connection',
        description: 'Add a new person to your relationship network',
        type: 'weekly',
        difficulty: 'easy',
        xpReward: 8,
        status: 'completed',
        createdAt: new Date(),
      },
    ];
  }, []);

  const questData = useMemo(() => {
    const activeQuests = allQuests.filter(q => q.status === 'pending');
    const completedQuests = allQuests.filter(q => q.status === 'completed');
    const totalXPEarned = completedQuests.reduce((sum, q) => sum + q.xpReward, 0);
    const completionRate = Math.floor((completedQuests.length / allQuests.length) * 100);

    return {
      activeQuests,
      completedQuests,
      totalXPEarned,
      completionRate
    };
  }, [allQuests]);

  const difficultyColors = {
    easy: '#10b981',
    medium: '#f59e0b',
    hard: '#ef4444',
  };

  const typeIcons = {
    daily: Clock,
    weekly: Calendar,
    milestone: Trophy,
    custom: Star,
  };

  const handleTabChange = useCallback((tab: 'active' | 'completed' | 'available') => {
    setActiveTab(tab);
  }, []);

  const handleCompleteQuest = useCallback((questId: string) => {
    completeQuest(questId);
  }, [completeQuest]);

  const availableQuests = useMemo(() => [
    {
      title: 'Share a Memory',
      description: 'Share a meaningful memory with someone special',
      difficulty: 'easy' as const,
      xpReward: 12,
      type: 'daily' as const,
    },
    {
      title: 'Plan an Activity',
      description: 'Organize and plan a fun activity with a friend',
      difficulty: 'medium' as const,
      xpReward: 18,
      type: 'weekly' as const,
    },
    {
      title: 'Express Gratitude',
      description: 'Tell someone how much they mean to you',
      difficulty: 'easy' as const,
      xpReward: 10,
      type: 'daily' as const,
    },
  ], []);

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
            <h1 className="text-3xl font-bold text-gradient mb-2">Relationship Quests</h1>
            <p className="text-muted-foreground">
              Complete challenges to strengthen your connections and earn XP
            </p>
          </div>
          
          <PremiumButton variant="gradient">
            <Plus className="h-4 w-4 mr-2" />
            Create Quest
          </PremiumButton>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <PremiumCard className="p-6 hover-lift">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{questData.activeQuests.length}</p>
                <p className="text-sm text-muted-foreground">Active Quests</p>
              </div>
            </div>
          </PremiumCard>
          
          <PremiumCard className="p-6 hover-lift">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{questData.completedQuests.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </PremiumCard>
          
          <PremiumCard className="p-6 hover-lift">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Zap className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{questData.totalXPEarned}</p>
                <p className="text-sm text-muted-foreground">XP Earned</p>
              </div>
            </div>
          </PremiumCard>
          
          <PremiumCard className="p-6 hover-lift">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Trophy className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{questData.completionRate}%</p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </PremiumCard>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex border-b border-border">
            {[
              { id: 'active', label: 'Active Quests', count: questData.activeQuests.length },
              { id: 'completed', label: 'Completed', count: questData.completedQuests.length },
              { id: 'available', label: 'Available', count: 3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`px-6 py-3 border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Quest Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'active' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {questData.activeQuests.map((quest, index) => {
                  const Icon = typeIcons[quest.type];
                  return (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="cursor-pointer"
                    >
                      <PremiumCard className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <Badge 
                              variant="secondary"
                              style={{ 
                                backgroundColor: `${difficultyColors[quest.difficulty]}20`, 
                                color: difficultyColors[quest.difficulty] 
                              }}
                            >
                              {quest.difficulty}
                            </Badge>
                          </div>
                          <Badge variant="outline">
                            +{quest.xpReward} XP
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2">{quest.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{quest.description}</p>
                        
                        {quest.deadline && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <Clock className="h-4 w-4" />
                            Due {quest.deadline.toLocaleDateString()}
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <PremiumButton 
                            variant="gradient" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleCompleteQuest(quest.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Complete
                          </PremiumButton>
                          <PremiumButton variant="outline" size="sm">
                            Skip
                          </PremiumButton>
                        </div>
                      </PremiumCard>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {activeTab === 'completed' && (
              <div className="space-y-4">
                {questData.completedQuests.map((quest, index) => {
                  const Icon = typeIcons[quest.type];
                  return (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ x: 4 }}
                    >
                      <PremiumCard className="p-6 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-emerald-500/10">
                            <CheckCircle className="h-6 w-6 text-emerald-500" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{quest.title}</h3>
                              <Badge variant="secondary">
                                +{quest.xpReward} XP
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{quest.description}</p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Completed</p>
                            <p className="text-xs text-muted-foreground">
                              {quest.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </PremiumCard>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {activeTab === 'available' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableQuests.map((quest, index) => {
                  const Icon = typeIcons[quest.type];
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="cursor-pointer"
                    >
                      <PremiumCard className="p-6 hover:shadow-lg transition-all duration-300 opacity-75 hover:opacity-90">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-muted">
                              <Icon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <Badge variant="outline">
                              {quest.difficulty}
                            </Badge>
                          </div>
                          <Badge variant="outline">
                            +{quest.xpReward} XP
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2">{quest.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{quest.description}</p>
                        
                        <PremiumButton variant="outline" size="sm" className="w-full" disabled>
                          <Plus className="h-4 w-4 mr-2" />
                          Add to Active
                        </PremiumButton>
                      </PremiumCard>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AppShell>
  );
}