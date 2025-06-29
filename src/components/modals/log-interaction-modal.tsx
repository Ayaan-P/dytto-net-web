"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send } from 'lucide-react';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumInput } from '@/components/ui/premium-input';
import { PremiumCard } from '@/components/ui/premium-card';
import { Badge } from '@/components/ui/badge';
import { useBackendInteractions } from '@/lib/hooks/use-backend-api';
import { toast } from 'sonner';

interface LogInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  relationship: any;
}

const interactionTags = [
  'Deep conversation', 'Casual chat', 'Work discussion', 'Personal sharing',
  'Fun activity', 'Problem solving', 'Celebration', 'Support',
  'Planning', 'Catching up', 'Learning', 'Advice'
];

export function LogInteractionModal({ isOpen, onClose, relationship }: LogInteractionModalProps) {
  const { createInteraction } = useBackendInteractions(relationship?.id);
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Please describe your interaction');
      return;
    }

    setIsSubmitting(true);
    try {
      await createInteraction({
        relationship_id: relationship.id,
        interaction_log: content.trim(),
        tone_tag: selectedTags.length > 0 ? selectedTags[0] : undefined,
      });
      
      // Reset form
      setContent('');
      setSelectedTags([]);
      onClose();
    } catch (error) {
      // Error is handled in the hook
      console.error('Failed to log interaction:', error);
    } finally {
      setIsSubmitting(false);
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
                  {relationship.photo_url ? (
                    <img 
                      src={relationship.photo_url} 
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
                  disabled={isSubmitting}
                >
                  Cancel
                </PremiumButton>
                <PremiumButton
                  type="submit"
                  variant="gradient"
                  className="flex-1"
                  disabled={!content.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
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