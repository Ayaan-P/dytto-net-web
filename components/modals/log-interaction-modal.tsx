"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smile, Meh, Frown, Sparkles, Send } from 'lucide-react';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumInput } from '@/components/ui/premium-input';
import { PremiumCard } from '@/components/ui/premium-card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { analyzeInteraction, calculateXPGain } from '@/lib/utils/ai';
import type { Relationship, Interaction, Activity } from '@/lib/types';

interface LogInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  relationship: Relationship;
}

const moodOptions = [
  { id: 'positive', label: 'Positive', icon: Smile, color: 'text-emerald-500' },
  { id: 'neutral', label: 'Neutral', icon: Meh, color: 'text-gray-500' },
  { id: 'negative', label: 'Negative', icon: Frown, color: 'text-red-500' },
];

const interactionTags = [
  'Deep conversation', 'Casual chat', 'Work discussion', 'Personal sharing',
  'Fun activity', 'Problem solving', 'Celebration', 'Support',
  'Planning', 'Catching up', 'Learning', 'Advice'
];

export function LogInteractionModal({ isOpen, onClose, relationship }: LogInteractionModalProps) {
  const { addInteraction, updateRelationship, addActivity } = useAppStore();
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsAnalyzing(true);

    try {
      // Analyze interaction with AI
      const aiAnalysis = await analyzeInteraction(content);
      const xpGained = calculateXPGain(content, aiAnalysis.sentiment);

      // Create interaction
      const newInteraction: Interaction = {
        id: Date.now().toString(),
        relationshipId: relationship.id,
        content: content.trim(),
        sentimentScore: aiAnalysis.sentiment === 'positive' ? 0.8 : 
                       aiAnalysis.sentiment === 'negative' ? -0.3 : 0.1,
        xpGained,
        aiAnalysis,
        tags: selectedTags,
        createdAt: new Date(),
      };

      addInteraction(newInteraction);

      // Update relationship
      const newXP = relationship.xp + xpGained;
      const newLevel = Math.floor(newXP / 10) + 1; // Simple leveling formula
      const leveledUp = newLevel > relationship.level;

      updateRelationship(relationship.id, {
        xp: newXP,
        level: Math.min(newLevel, 10), // Cap at level 10
        lastInteraction: new Date(),
        updatedAt: new Date(),
      });

      // Add activity
      const activity: Activity = {
        id: Date.now().toString(),
        type: leveledUp ? 'level_up' : 'interaction',
        relationshipId: relationship.id,
        relationshipName: relationship.name,
        title: leveledUp ? `Leveled up with ${relationship.name}!` : 'New interaction logged',
        description: leveledUp 
          ? `Reached level ${newLevel} with ${relationship.name}`
          : `Logged interaction with ${relationship.name}`,
        timestamp: new Date(),
        xpGained,
      };

      addActivity(activity);

      // Reset form
      setContent('');
      setSelectedMood(null);
      setSelectedTags([]);
      onClose();
    } catch (error) {
      console.error('Error analyzing interaction:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
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
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <PremiumCard className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
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
                  <h2 className="text-2xl font-bold">Log Interaction</h2>
                  <p className="text-muted-foreground">with {relationship.name}</p>
                </div>
              </div>
              <PremiumButton variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </PremiumButton>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Interaction Content */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  What happened in your interaction?
                </label>
                <PremiumInput
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe your conversation, activity, or interaction..."
                  multiline
                  rows={6}
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Be specific! The AI will analyze sentiment and suggest XP based on the depth of your interaction.
                </p>
              </div>

              {/* Mood Selection */}
              <div>
                <label className="block text-sm font-medium mb-4">How did the interaction feel?</label>
                <div className="grid grid-cols-3 gap-3">
                  {moodOptions.map((mood) => {
                    const Icon = mood.icon;
                    const isSelected = selectedMood === mood.id;
                    
                    return (
                      <motion.button
                        key={mood.id}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedMood(mood.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon className={`h-6 w-6 mx-auto mb-2 ${mood.color}`} />
                        <p className="text-sm font-medium">{mood.label}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Interaction Tags */}
              <div>
                <label className="block text-sm font-medium mb-4">Tag this interaction (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {interactionTags.map((tag) => (
                    <motion.button
                      key={tag}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Selected Tags Preview */}
              {selectedTags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Selected Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <PremiumButton
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isAnalyzing}
                >
                  Cancel
                </PremiumButton>
                <PremiumButton
                  type="submit"
                  variant="gradient"
                  className="flex-1"
                  disabled={!content.trim() || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Log Interaction
                    </>
                  )}
                </PremiumButton>
              </div>
            </form>
          </PremiumCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}