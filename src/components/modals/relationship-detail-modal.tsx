"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MessageCircle, 
  Calendar, 
  Mail, 
  Phone, 
  Edit3,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumCard } from '@/components/ui/premium-card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { getXPProgressForCurrentLevel, getLevelColor, getLevelTitle } from '@/lib/utils/levels';
import { LogInteractionModal } from './log-interaction-modal';
import type { Relationship } from '@/lib/types';

interface RelationshipDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  relationship: Relationship;
}

export function RelationshipDetailModal({ isOpen, onClose, relationship }: RelationshipDetailModalProps) {
  const { interactions } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'interactions' | 'insights'>('overview');
  const [showLogModal, setShowLogModal] = useState(false);

  const relationshipInteractions = interactions.filter(i => i.relationshipId === relationship.id);
  const xpProgress = getXPProgressForCurrentLevel(relationship.xp, relationship.level);
  const levelColor = getLevelColor(relationship.level);
  const levelTitle = getLevelTitle(relationship.level);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'interactions', label: 'Interactions', icon: MessageCircle },
    { id: 'insights', label: 'Insights', icon: Award },
  ];

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
                    {relationship.photoUrl ? (
                      <img 
                        src={relationship.photoUrl} 
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
                        <span className="text-sm font-medium">Level {relationship.level}</span>
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
                {relationship.categories.map((category) => (
                  <Badge 
                    key={category.id} 
                    variant="secondary"
                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
              <div className="flex px-8">
                {tabs.map((tab) => {
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
                          <p className="text-2xl font-bold">{relationshipInteractions.length}</p>
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
                          <p className="text-2xl font-bold">{relationship.xp}</p>
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
                            {relationship.lastInteraction 
                              ? formatDistanceToNow(relationship.lastInteraction, { addSuffix: true })
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
                      {relationship.contactInfo.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{relationship.contactInfo.email}</span>
                        </div>
                      )}
                      {relationship.contactInfo.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{relationship.contactInfo.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Added {format(relationship.createdAt, 'MMMM d, yyyy')}</span>
                      </div>
                    </div>
                  </PremiumCard>
                </div>
              )}

              {activeTab === 'interactions' && (
                <div className="space-y-4 fade-transition">
                  {relationshipInteractions.length === 0 ? (
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
                    relationshipInteractions
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((interaction) => (
                        <PremiumCard key={interaction.id} className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">
                                +{interaction.xpGained} XP
                              </Badge>
                              {interaction.aiAnalysis && (
                                <Badge 
                                  variant={
                                    interaction.aiAnalysis.sentiment === 'positive' ? 'default' :
                                    interaction.aiAnalysis.sentiment === 'negative' ? 'destructive' :
                                    'secondary'
                                  }
                                >
                                  {interaction.aiAnalysis.sentiment}
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {format(interaction.createdAt, 'MMM d, yyyy • h:mm a')}
                            </span>
                          </div>
                          
                          <p className="text-foreground mb-3">{interaction.content}</p>
                          
                          {interaction.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {interaction.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </PremiumCard>
                      ))
                  )}
                </div>
              )}

              {activeTab === 'insights' && (
                <div className="space-y-6 fade-transition">
                  <PremiumCard className="p-6 text-center">
                    <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">AI Insights Coming Soon</h3>
                    <p className="text-muted-foreground">
                      Advanced relationship analytics and personalized suggestions will be available here.
                    </p>
                  </PremiumCard>
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