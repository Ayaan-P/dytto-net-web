"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Briefcase, Heart, GraduationCap, Users, UserPlus } from 'lucide-react';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumInput } from '@/components/ui/premium-input';
import { PremiumCard } from '@/components/ui/premium-card';
import { useAppStore } from '@/lib/store';
import type { Category, Relationship } from '@/lib/types';

interface AddRelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryIcons = {
  Users: Users,
  Briefcase: Briefcase,
  Heart: Heart,
  GraduationCap: GraduationCap,
  User: User,
};

export function AddRelationshipModal({ isOpen, onClose }: AddRelationshipModalProps) {
  const { categories, addRelationship, user } = useAppStore();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    selectedCategories: [] as Category[],
    reminderInterval: 'weekly' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !user) return;

    const newRelationship: Relationship = {
      id: Date.now().toString(),
      userId: user.id,
      name: formData.name.trim(),
      bio: formData.bio.trim() || undefined,
      level: 1,
      xp: 0,
      categories: formData.selectedCategories,
      tags: [],
      reminderInterval: formData.reminderInterval,
      contactInfo: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addRelationship(newRelationship);
    
    // Reset form
    setFormData({
      name: '',
      bio: '',
      selectedCategories: [],
      reminderInterval: 'weekly',
    });
    onClose();
  };

  const toggleCategory = (category: Category) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.find(c => c.id === category.id)
        ? prev.selectedCategories.filter(c => c.id !== category.id)
        : [...prev.selectedCategories, category]
    }));
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

        {/* Modal - Compact and focused */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md"
        >
          <PremiumCard className="p-6 shadow-2xl">
            {/* Minimal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">Add Person</h2>
              </div>
              <PremiumButton variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </PremiumButton>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name - Primary field */}
              <PremiumInput
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter their name"
                required
                className="text-base"
              />

              {/* Bio - Secondary field */}
              <PremiumInput
                label="Notes (optional)"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="What should you remember?"
                multiline
                rows={2}
              />

              {/* Categories - Visual selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Relationship Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.slice(0, 6).map((category) => {
                    const Icon = categoryIcons[category.icon as keyof typeof categoryIcons] || User;
                    const isSelected = formData.selectedCategories.find(c => c.id === category.id);
                    
                    return (
                      <motion.button
                        key={category.id}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleCategory(category)}
                        className={`p-3 rounded-lg border transition-all text-center ${
                          isSelected 
                            ? 'border-primary bg-primary/10 shadow-sm' 
                            : 'border-border hover:border-primary/30 hover:bg-muted/50'
                        }`}
                      >
                        <Icon 
                          className="h-4 w-4 mx-auto mb-1" 
                          style={{ color: isSelected ? '#84BABF' : category.color }}
                        />
                        <p className="text-xs font-medium">{category.name}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Reminder Frequency - Simple dropdown */}
              <div>
                <label className="block text-sm font-medium mb-2">Reminder Frequency</label>
                <select
                  value={formData.reminderInterval}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    reminderInterval: e.target.value as any 
                  }))}
                  className="premium-input w-full"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Every 2 weeks</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              {/* Actions - Clean and simple */}
              <div className="flex gap-3 pt-4">
                <PremiumButton
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </PremiumButton>
                <PremiumButton
                  type="submit"
                  variant="gradient"
                  className="flex-1"
                  disabled={!formData.name.trim()}
                >
                  Add Person
                </PremiumButton>
              </div>
            </form>
          </PremiumCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}