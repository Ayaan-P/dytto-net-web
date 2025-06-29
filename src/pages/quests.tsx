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
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useBackendRelationships } from '@/lib/hooks/use-backend-api';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';

export default function QuestsPage() {
  const { relationships, loading: relationshipsLoading } = useBackendRelationships();
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'available'>('active');
  const [selectedRelationship, setSelectedRelationship] = useState<number | null>(null);
  const [quests, setQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all quests for all relationships
  const fetchAllQuests = useCallback(async () => {
    if (relationshipsLoading || !relationships.length) return;
    
    setLoading(true);
    try {
      const allQuests = [];
      for (const relationship of relationships) {
        try {
          const relationshipQuests = await api.relationships.getQuests(relationship.id);
          // Add relationship info to each quest
          const enhancedQuests = relationshipQuests.map((quest: any) => ({
            ...quest,
            relationshipName: relationship.name,
            relationshipPhotoUrl: relationship.photo_url
          }));
          allQuests.push(...enhancedQuests);
        } catch (error) {
          console.error(`Error fetching quests for relationship ${relationship.id}:`, error);
        }
      }
      setQuests(allQuests);
    } catch (error) {
      console.error('Error fetching all quests:', error);
      toast.error('Failed to load quests');
    } finally {
      setLoading(false);
    }
  }, [relationships, relationshipsLoading]);

  // Fetch quests when relationships are loaded
  React.useEffect(() => {
    if (!relationshipsLoading && relationships.length > 0) {
      fetchAllQuests();
    }
  }, [relationships, relationshipsLoading, fetchAllQuests]);

  // Memoize quest data
  const questData = useMemo(() => {
    const activeQuests = quests.filter(q => q.quest_status === 'pending');
    const completedQuests = quests.filter(q => q.quest_status === 'completed');
    const totalXPEarned = completedQuests.reduce((sum, q) => sum + 2, 0); // Assuming 2 XP per quest
    const completionRate = quests.length > 0 ? Math.floor((completedQuests.length / quests.length) * 100) : 0;

    return {
      activeQuests,
      completedQuests,
      totalXPEarned,
      completionRate
    };
  }, [quests]);

  const handleTabChange = useCallback((tab: 'active' | 'completed' | 'available') => {
    setActiveTab(tab);
  }, []);

  const handleCompleteQuest = useCallback(async (questId: number) => {
    setLoading(true);
    try {
      await api.quests.update(questId, { quest_status: 'completed' });
      toast.success('Quest completed! XP awarded.');
      fetchAllQuests(); // Refresh quests
    } catch (error) {
      console.error('Failed to complete quest:', error);
      toast.error('Failed to complete quest');
    } finally {
      setLoading(false);
    }
  }, [fetchAllQuests]);

  const handleGenerateQuest = useCallback(async (relationshipId: number) => {
    setLoading(true);
    try {
      await api.relationships.generateQuest(relationshipId);
      toast.success('New quest generated!');
      fetchAllQuests(); // Refresh quests
    } catch (error) {
      console.error('Failed to generate quest:', error);
      toast.error('Failed to generate quest');
    } finally {
      setLoading(false);
    }
  }, [fetchAllQuests]);

  if (relationshipsLoading || loading) {
    return (
      <AppShell>
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" text="Loading quests..." />
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
            <h1 className="text-3xl font-bold text-gradient mb-2">Relationship Quests</h1>
            <p className="text-muted-foreground">
              Complete challenges to strengthen your connections and earn XP
            </p>
          </div>
          
          <div className="flex gap-2">
            <select 
              className="premium-input"
              value={selectedRelationship || ''}
              onChange={(e) => setSelectedRelationship(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">All Relationships</option>
              {relationships.map((rel) => (
                <option key={rel.id} value={rel.id}>{rel.name}</option>
              ))}
            </select>
            
            <PremiumButton 
              variant="gradient"
              onClick={() => {
                if (selectedRelationship) {
                  handleGenerateQuest(selectedRelationship);
                } else if (relationships.length > 0) {
                  handleGenerateQuest(relationships[0].id);
                } else {
                  toast.error('Please add a relationship first');
                }
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Generate Quest
            </PremiumButton>
          </div>
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
                {questData.activeQuests
                  .filter(quest => !selectedRelationship || quest.relationship_id === selectedRelationship)
                  .map((quest, index) => {
                    const Icon = quest.milestone_level ? Trophy : Target;
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
                              {quest.milestone_level && (
                                <Badge variant="secondary">
                                  Level {quest.milestone_level}
                                </Badge>
                              )}
                            </div>
                            <Badge variant="outline">
                              +2 XP
                            </Badge>
                          </div>
                          
                          <h3 className="font-semibold text-lg mb-2">{quest.relationshipName}</h3>
                          <p className="text-muted-foreground text-sm mb-4">{quest.quest_description}</p>
                          
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
                          </div>
                        </PremiumCard>
                      </motion.div>
                    );
                  })}
                
                {questData.activeQuests
                  .filter(quest => !selectedRelationship || quest.relationship_id === selectedRelationship)
                  .length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No active quests</h3>
                    <p className="text-muted-foreground mb-4">
                      Generate new quests to deepen your relationships
                    </p>
                    <PremiumButton
                      variant="gradient"
                      onClick={() => {
                        if (selectedRelationship) {
                          handleGenerateQuest(selectedRelationship);
                        } else if (relationships.length > 0) {
                          handleGenerateQuest(relationships[0].id);
                        }
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Quest
                    </PremiumButton>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'completed' && (
              <div className="space-y-4">
                {questData.completedQuests
                  .filter(quest => !selectedRelationship || quest.relationship_id === selectedRelationship)
                  .map((quest, index) => (
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
                              <h3 className="font-semibold">{quest.relationshipName}</h3>
                              <Badge variant="secondary">
                                +2 XP
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{quest.quest_description}</p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Completed</p>
                            <p className="text-xs text-muted-foreground">
                              {quest.completion_date ? format(new Date(quest.completion_date), 'MMM d, yyyy') : 'Recently'}
                            </p>
                          </div>
                        </div>
                      </PremiumCard>
                    </motion.div>
                  ))}
                
                {questData.completedQuests
                  .filter(quest => !selectedRelationship || quest.relationship_id === selectedRelationship)
                  .length === 0 && (
                  <div className="text-center py-12">
                    <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No completed quests yet</h3>
                    <p className="text-muted-foreground">
                      Complete quests to see them here
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AppShell>
  );
}