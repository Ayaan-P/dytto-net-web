"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MessageCircle, 
  Calendar, 
  Mail, 
  Phone, 
  TrendingUp,
  Award,
  Target,
  Clock,
  CheckCircle,
  Plus
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumCard } from '@/components/ui/premium-card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useBackendInteractions, useBackendQuests, useRelationshipInsights } from '@/lib/hooks/use-backend-api';
import { getLevelColor, getLevelTitle } from '@/lib/utils/levels';
import { LogInteractionModal } from './log-interaction-modal';
import { toast } from 'sonner';

interface RelationshipDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  relationship: any;
}

export function RelationshipDetailModal({ isOpen, onClose, relationship }: RelationshipDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'interactions' | 'insights' | 'quests'>('overview');
  const [showLogModal, setShowLogModal] = useState(false);
  
  const { 
    interactions, 
    loading: interactionsLoading, 
    error: interactionsError 
  } = useBackendInteractions(relationship?.id);
  
  const {
    quests,
    loading: questsLoading,
    error: questsError,
    updateQuest,
    generateQuest
  } = useBackendQuests(relationship?.id);
  
  const {
    insights,
    loading: insightsLoading,
    error: insightsError
  } = useRelationshipInsights(relationship?.id);

  // Calculate XP progress
  const calculateXpProgress = () => {
    const level = relationship.level || 1;
    const xp = relationship.xp || 0;
    
    // Simple XP thresholds (can be adjusted)
    const thresholds = [0, 5, 12, 22, 36, 54, 78, 108, 145, 190];
    
    const currentLevelXp = thresholds[level - 1] || 0;
    const nextLevelXp = thresholds[level] || (currentLevelXp + 20);
    
    const xpInCurrentLevel = xp - currentLevelXp;
    const xpRequiredForNextLevel = nextLevelXp - currentLevelXp;
    const percentage = Math.min(100, Math.floor((xpInCurrentLevel / xpRequiredForNextLevel) * 100));
    
    return {
      current: xpInCurrentLevel,
      required: xpRequiredForNextLevel,
      percentage
    };
  };

  const xpProgress = calculateXpProgress();
  const levelColor = getLevelColor(relationship.level || 1);
  const levelTitle = getLevelTitle(relationship.level || 1);

  const handleCompleteQuest = async (questId: number) => {
    try {
      await updateQuest(questId, { quest_status: 'completed' });
      toast.success('Quest completed! XP awarded.');
    } catch (error) {
      console.error('Failed to complete quest:', error);
    }
  };

  const handleGenerateQuest = async () => {
    try {
      await generateQuest(relationship.id);
      toast.success('New quest generated!');
    } catch (error) {
      console.error('Failed to generate quest:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          <PremiumCard className="h-full flex flex-col">
            {/* Header */}
            <div className="p-8 border-b border-border">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                    {relationship.photo_url ? (
                      <img 
                        src={relationship.photo_url} 
                        alt={relationship.name}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-semibold text-primary">
                        {relationship.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{relationship.name}</h2>
                    <p className="text-lg text-muted-foreground">{levelTitle}</p>
                    {relationship.bio && (
                      <p className="text-muted-foreground mt-2">{relationship.bio}</p>
                    )}
                    
                    {/* Level Progress */}
                    <div className="mt-4 w-64">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Level {relationship.level || 1}</span>
                        <span className="text-sm text-muted-foreground">
                          {xpProgress.current}/{xpProgress.required} XP
                        </span>
                      </div>
                      <Progress 
                        value={xpProgress.percentage} 
                        className="h-3"
                        style={{ 
                          '--progress-background': levelColor 
                        } as React.CSSProperties}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <PremiumButton
                    variant="gradient"
                    onClick={() => setShowLogModal(true)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Log Interaction
                  </PremiumButton>
                  <PremiumButton variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                  </PremiumButton>
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mt-4">
                {relationship.categories && relationship.categories.map((category: string) => (
                  <Badge 
                    key={category} 
                    variant="secondary"
                    style={{ backgroundColor: `${levelColor}20`, color: levelColor }}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
              <div className="flex px-8">
                {[
                  { id: 'overview', label: 'Overview', icon: TrendingUp },
                  { id: 'interactions', label: 'Interactions', icon: MessageCircle },
                  { id: 'quests', label: 'Quests', icon: Target },
                  { id: 'insights', label: 'Insights', icon: Award }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors no-transform ${
                        isActive
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content - Fixed container to prevent sliding */}
            <div className="flex-1 overflow-y-auto p-8 tab-content">
              {activeTab === 'overview' && (
                <div className="space-y-6 fade-transition">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <PremiumCard className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <MessageCircle className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{interactions?.length || 0}</p>
                          <p className="text-sm text-muted-foreground">Interactions</p>
                        </div>
                      </div>
                    </PremiumCard>
                    
                    <PremiumCard className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10">
                          <TrendingUp className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{relationship.xp || 0}</p>
                          <p className="text-sm text-muted-foreground">Total XP</p>
                        </div>
                      </div>
                    </PremiumCard>
                    
                    <PremiumCard className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/10">
                          <Clock className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-lg font-bold">
                            {relationship.last_interaction 
                              ? formatDistanceToNow(new Date(relationship.last_interaction), { addSuffix: true })
                              : 'Never'
                            }
                          </p>
                          <p className="text-sm text-muted-foreground">Last contact</p>
                        </div>
                      </div>
                    </PremiumCard>
                  </div>

                  {/* Contact Info */}
                  <PremiumCard className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      {relationship.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{relationship.email}</span>
                        </div>
                      )}
                      {relationship.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{relationship.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Added {format(new Date(relationship.created_at), 'MMMM d, yyyy')}</span>
                      </div>
                    </div>
                  </PremiumCard>
                </div>
              )}

              {activeTab === 'interactions' && (
                <div className="space-y-4 fade-transition">
                  {interactionsLoading ? (
                    <div className="flex justify-center py-12">
                      <LoadingSpinner text="Loading interactions..." />
                    </div>
                  ) : interactionsError ? (
                    <div className="text-center py-12">
                      <p className="text-destructive mb-2">Error loading interactions</p>
                      <p className="text-muted-foreground">{interactionsError}</p>
                    </div>
                  ) : interactions?.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No interactions yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start logging your conversations and activities with {relationship.name}
                      </p>
                      <PremiumButton
                        variant="gradient"
                        onClick={() => setShowLogModal(true)}
                      >
                        Log First Interaction
                      </PremiumButton>
                    </div>
                  ) : (
                    interactions
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map((interaction) => (
                        <PremiumCard key={interaction.id} className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">
                                +{interaction.xp_gain} XP
                              </Badge>
                              {interaction.sentiment_analysis && (
                                <Badge 
                                  variant={
                                    interaction.sentiment_analysis.includes('positive') ? 'default' :
                                    interaction.sentiment_analysis.includes('negative') ? 'destructive' :
                                    'secondary'
                                  }
                                >
                                  {interaction.sentiment_analysis.includes('positive') ? 'Positive' :
                                   interaction.sentiment_analysis.includes('negative') ? 'Negative' : 'Neutral'}
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(interaction.created_at), 'MMM d, yyyy • h:mm a')}
                            </span>
                          </div>
                          
                          <p className="text-foreground mb-3">{interaction.interaction_log}</p>
                          
                          {interaction.ai_reasoning && (
                            <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground mb-3">
                              <p><strong>AI Analysis:</strong> {interaction.ai_reasoning}</p>
                            </div>
                          )}
                          
                          {interaction.tone_tag && (
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="outline" className="text-xs">
                                {interaction.tone_tag}
                              </Badge>
                            </div>
                          )}
                        </PremiumCard>
                      ))
                  )}
                </div>
              )}

              {activeTab === 'quests' && (
                <div className="space-y-6 fade-transition">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Relationship Quests</h3>
                    <PremiumButton 
                      variant="outline" 
                      size="sm"
                      onClick={handleGenerateQuest}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Quest
                    </PremiumButton>
                  </div>
                  
                  {questsLoading ? (
                    <div className="flex justify-center py-12">
                      <LoadingSpinner text="Loading quests..." />
                    </div>
                  ) : questsError ? (
                    <div className="text-center py-12">
                      <p className="text-destructive mb-2">Error loading quests</p>
                      <p className="text-muted-foreground">{questsError}</p>
                    </div>
                  ) : quests?.length === 0 ? (
                    <div className="text-center py-12">
                      <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No quests yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Generate quests to deepen your relationship with {relationship.name}
                      </p>
                      <PremiumButton
                        variant="gradient"
                        onClick={handleGenerateQuest}
                      >
                        Generate First Quest
                      </PremiumButton>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Active Quests */}
                      <div>
                        <h4 className="text-md font-medium mb-3">Active Quests</h4>
                        {quests.filter(q => q.quest_status === 'pending').map((quest) => (
                          <PremiumCard key={quest.id} className="p-4 mb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium mb-2">{quest.quest_description}</p>
                                {quest.milestone_level && (
                                  <Badge variant="secondary" className="mb-2">
                                    Level {quest.milestone_level} Milestone
                                  </Badge>
                                )}
                              </div>
                              <PremiumButton
                                variant="outline"
                                size="sm"
                                onClick={() => handleCompleteQuest(quest.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Complete
                              </PremiumButton>
                            </div>
                          </PremiumCard>
                        ))}
                        {quests.filter(q => q.quest_status === 'pending').length === 0 && (
                          <p className="text-muted-foreground text-sm">No active quests. Generate a new one!</p>
                        )}
                      </div>
                      
                      {/* Completed Quests */}
                      {quests.filter(q => q.quest_status === 'completed').length > 0 && (
                        <div>
                          <h4 className="text-md font-medium mb-3">Completed Quests</h4>
                          {quests.filter(q => q.quest_status === 'completed').map((quest) => (
                            <PremiumCard key={quest.id} className="p-4 mb-4 bg-muted/30">
                              <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-emerald-500" />
                                <div>
                                  <p className="font-medium">{quest.quest_description}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Completed {quest.completion_date ? format(new Date(quest.completion_date), 'MMM d, yyyy') : 'recently'}
                                  </p>
                                </div>
                              </div>
                            </PremiumCard>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'insights' && (
                <div className="space-y-6 fade-transition">
                  {insightsLoading ? (
                    <div className="flex justify-center py-12">
                      <LoadingSpinner text="Generating insights..." />
                    </div>
                  ) : insightsError ? (
                    <div className="text-center py-12">
                      <p className="text-destructive mb-2">Error loading insights</p>
                      <p className="text-muted-foreground">{insightsError}</p>
                    </div>
                  ) : !insights ? (
                    <div className="text-center py-12">
                      <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">Not enough data for insights</h3>
                      <p className="text-muted-foreground mb-4">
                        Log more interactions with {relationship.name} to generate AI insights.
                      </p>
                      <PremiumButton
                        variant="gradient"
                        onClick={() => setShowLogModal(true)}
                      >
                        Log New Interaction
                      </PremiumButton>
                    </div>
                  ) : (
                    <>
                      {/* Interaction Trends */}
                      {insights.interaction_trends && (
                        <PremiumCard className="p-6">
                          <h3 className="text-lg font-semibold mb-4">Interaction Trends</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <p className="text-2xl font-bold">{insights.interaction_trends.total_interactions}</p>
                              <p className="text-sm text-muted-foreground">Total Interactions</p>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <p className="text-2xl font-bold">{insights.interaction_trends.weekly_frequency}</p>
                              <p className="text-sm text-muted-foreground">Weekly Frequency</p>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <p className="text-2xl font-bold">{insights.interaction_trends.average_xp}</p>
                              <p className="text-sm text-muted-foreground">Average XP</p>
                            </div>
                          </div>
                          <p className="text-muted-foreground">{insights.interaction_trends.trend_insight}</p>
                        </PremiumCard>
                      )}
                      
                      {/* Emotional Summary */}
                      {insights.emotional_summary && (
                        <PremiumCard className="p-6">
                          <h3 className="text-lg font-semibold mb-4">Emotional Summary</h3>
                          <div className="mb-4">
                            <p className="font-medium mb-2">Common Tone: {insights.emotional_summary.common_tone}</p>
                            {insights.emotional_summary.emotional_keywords?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {insights.emotional_summary.emotional_keywords.map((keyword: string) => (
                                  <Badge key={keyword} variant="secondary">{keyword}</Badge>
                                ))}
                              </div>
                            )}
                            <p className="text-muted-foreground">{insights.emotional_summary.summary}</p>
                          </div>
                        </PremiumCard>
                      )}
                      
                      {/* Relationship Forecasts */}
                      {insights.relationship_forecasts?.forecasts && (
                        <PremiumCard className="p-6">
                          <h3 className="text-lg font-semibold mb-4">Relationship Forecasts</h3>
                          <div className="space-y-4">
                            {insights.relationship_forecasts.forecasts.map((forecast: any, index: number) => (
                              <div key={index} className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                  <p className="font-medium">{forecast.path}</p>
                                  <Badge variant="outline">{forecast.confidence}% confidence</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{forecast.reasoning}</p>
                              </div>
                            ))}
                          </div>
                        </PremiumCard>
                      )}
                      
                      {/* Smart Suggestions */}
                      {insights.smart_suggestions?.suggestions && (
                        <PremiumCard className="p-6">
                          <h3 className="text-lg font-semibold mb-4">Smart Suggestions</h3>
                          <div className="space-y-3">
                            {insights.smart_suggestions.suggestions.map((suggestion: any, index: number) => (
                              <div key={index} className="p-3 border border-border rounded-lg">
                                <p className="text-sm font-medium text-primary mb-1">{suggestion.type}</p>
                                <p>{suggestion.content}</p>
                              </div>
                            ))}
                          </div>
                        </PremiumCard>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </PremiumCard>
        </motion.div>
      </div>

      {/* Log Interaction Modal */}
      <LogInteractionModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        relationship={relationship}
      />
    </AnimatePresence>
  );
}