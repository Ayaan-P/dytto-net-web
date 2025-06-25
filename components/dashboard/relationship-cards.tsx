"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { MessageCircle, Calendar, Star, MoreHorizontal, Mail, Phone } from 'lucide-react';
import { PremiumCard } from '@/components/ui/premium-card';
import { PremiumButton } from '@/components/ui/premium-button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { getXPProgressForCurrentLevel, getLevelColor, getLevelTitle } from '@/lib/utils/levels';
import { RelationshipDetailModal } from '@/components/modals/relationship-detail-modal';
import { LogInteractionModal } from '@/components/modals/log-interaction-modal';
import type { Relationship } from '@/lib/types';

interface RelationshipCardsProps {
  relationships?: Relationship[];
  viewMode?: 'grid' | 'list';
}

export function RelationshipCards({ 
  relationships: propRelationships, 
  viewMode = 'grid' 
}: RelationshipCardsProps) {
  const { relationships: storeRelationships } = useAppStore();
  const relationships = propRelationships || storeRelationships;
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null);
  const [logInteractionRelationship, setLogInteractionRelationship] = useState<Relationship | null>(null);

  if (relationships.length === 0) {
    return (
      <PremiumCard className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Star className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No relationships yet</h3>
          <p className="text-muted-foreground mb-4">
            Start building meaningful connections by adding your first relationship.
          </p>
          <PremiumButton variant="gradient">
            Add Your First Connection
          </PremiumButton>
        </div>
      </PremiumCard>
    );
  }

  if (viewMode === 'list') {
    return (
      <>
        <div className="space-y-4">
          {relationships.map((relationship, index) => {
            const xpProgress = getXPProgressForCurrentLevel(relationship.xp, relationship.level);
            const levelColor = getLevelColor(relationship.level);
            const levelTitle = getLevelTitle(relationship.level);
            
            return (
              <motion.div
                key={relationship.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ x: 4 }}
                className="cursor-pointer"
                onClick={() => setSelectedRelationship(relationship)}
              >
                <PremiumCard className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center flex-shrink-0">
                      {relationship.photoUrl ? (
                        <img 
                          src={relationship.photoUrl} 
                          alt={relationship.name}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-semibold text-primary">
                          {relationship.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{relationship.name}</h3>
                          <p className="text-sm text-muted-foreground">{levelTitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="secondary"
                            style={{ backgroundColor: `${levelColor}20`, color: levelColor }}
                          >
                            Level {relationship.level}
                          </Badge>
                        </div>
                      </div>

                      {relationship.bio && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {relationship.bio}
                        </p>
                      )}

                      {/* Categories */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {relationship.categories.slice(0, 3).map((category) => (
                          <Badge 
                            key={category.id} 
                            variant="outline"
                            className="text-xs"
                            style={{ borderColor: category.color, color: category.color }}
                          >
                            {category.name}
                          </Badge>
                        ))}
                        {relationship.categories.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{relationship.categories.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Progress */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">
                            {xpProgress.current}/{xpProgress.required} XP
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {xpProgress.percentage.toFixed(0)}%
                          </span>
                        </div>
                        <Progress 
                          value={xpProgress.percentage} 
                          className="h-1"
                          style={{ 
                            '--progress-background': levelColor 
                          } as React.CSSProperties}
                        />
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      {relationship.contactInfo.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="truncate max-w-[150px]">{relationship.contactInfo.email}</span>
                        </div>
                      )}
                      {relationship.contactInfo.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{relationship.contactInfo.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {relationship.lastInteraction 
                            ? format(relationship.lastInteraction, 'MMM d')
                            : 'No contact'
                          }
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <PremiumButton 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLogInteractionRelationship(relationship);
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Log
                      </PremiumButton>
                      <PremiumButton 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </PremiumButton>
                    </div>
                  </div>
                </PremiumCard>
              </motion.div>
            );
          })}
        </div>

        {/* Modals */}
        {selectedRelationship && (
          <RelationshipDetailModal
            isOpen={!!selectedRelationship}
            onClose={() => setSelectedRelationship(null)}
            relationship={selectedRelationship}
          />
        )}

        {logInteractionRelationship && (
          <LogInteractionModal
            isOpen={!!logInteractionRelationship}
            onClose={() => setLogInteractionRelationship(null)}
            relationship={logInteractionRelationship}
          />
        )}
      </>
    );
  }

  // Grid view (existing implementation)
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relationships.map((relationship, index) => {
          const xpProgress = getXPProgressForCurrentLevel(relationship.xp, relationship.level);
          const levelColor = getLevelColor(relationship.level);
          const levelTitle = getLevelTitle(relationship.level);
          
          return (
            <motion.div
              key={relationship.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="cursor-pointer"
              onClick={() => setSelectedRelationship(relationship)}
            >
              <PremiumCard className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      {relationship.photoUrl ? (
                        <img 
                          src={relationship.photoUrl} 
                          alt={relationship.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-primary">
                          {relationship.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{relationship.name}</h3>
                      <p className="text-sm text-muted-foreground">{levelTitle}</p>
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <PremiumButton 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </PremiumButton>
                  </motion.div>
                </div>

                {/* Level and XP */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Level {relationship.level}</span>
                    <span className="text-sm text-muted-foreground">
                      {xpProgress.current}/{xpProgress.required} XP
                    </span>
                  </div>
                  <Progress 
                    value={xpProgress.percentage} 
                    className="h-2"
                    style={{ 
                      '--progress-background': levelColor 
                    } as React.CSSProperties}
                  />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {relationship.categories.slice(0, 2).map((category) => (
                    <Badge 
                      key={category.id} 
                      variant="secondary"
                      style={{ backgroundColor: `${category.color}20`, color: category.color }}
                    >
                      {category.name}
                    </Badge>
                  ))}
                  {relationship.categories.length > 2 && (
                    <Badge variant="outline">
                      +{relationship.categories.length - 2} more
                    </Badge>
                  )}
                </div>

                {/* Last Interaction */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {relationship.lastInteraction 
                      ? format(relationship.lastInteraction, 'MMM d')
                      : 'No interactions yet'
                    }
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PremiumButton 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLogInteractionRelationship(relationship);
                      }}
                      className="hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Log
                    </PremiumButton>
                  </motion.div>
                </div>
              </PremiumCard>
            </motion.div>
          );
        })}
      </div>

      {/* Relationship Detail Modal */}
      {selectedRelationship && (
        <RelationshipDetailModal
          isOpen={!!selectedRelationship}
          onClose={() => setSelectedRelationship(null)}
          relationship={selectedRelationship}
        />
      )}

      {/* Log Interaction Modal */}
      {logInteractionRelationship && (
        <LogInteractionModal
          isOpen={!!logInteractionRelationship}
          onClose={() => setLogInteractionRelationship(null)}
          relationship={logInteractionRelationship}
        />
      )}
    </>
  );
}