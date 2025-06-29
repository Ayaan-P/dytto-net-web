"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Briefcase, Heart, GraduationCap, Users, UserPlus } from 'lucide-react';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumInput } from '@/components/ui/premium-input';
import { PremiumCard } from '@/components/ui/premium-card';
import { useBackendRelationships } from '@/lib/hooks/use-backend-api';
import { toast } from 'sonner';

interface AddRelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryOptions = [
  { name: 'Friend', icon: Users },
  { name: 'Business', icon: Briefcase },
  { name: 'Family', icon: Heart },
  { name: 'Mentor', icon: GraduationCap },
  { name: 'Romantic', icon: Heart },
  { name: 'Acquaintance', icon: User },
];

const categoryIcons = {
  Users: Users,
  Briefcase: Briefcase,
  Heart: Heart,
  GraduationCap: GraduationCap,
  User: User,
};

export function AddRelationshipModal({ isOpen, onClose }: AddRelationshipModalProps) {
  const { createRelationship } = useBackendRelationships();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    initial_category_name: 'Friend',
    relationship_type: 'personal',
    reminder_interval: 'weekly',
    phone: '',
    email: '',
    location: '',
    preferred_communication: '',
    meeting_frequency: '',
    notes: '',
    photo_url: '',
    tags: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await createRelationship({
        name: formData.name.trim(),
        bio: formData.bio.trim() || undefined,
        initial_category_name: formData.initial_category_name,
        relationship_type: formData.relationship_type,
        reminder_interval: formData.reminder_interval,
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
        location: formData.location.trim() || undefined,
        preferred_communication: formData.preferred_communication.trim() || undefined,
        meeting_frequency: formData.meeting_frequency.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        photo_url: formData.photo_url.trim() || undefined,
        tags: formData.tags,
      });
      
      // Reset form
      setFormData({
        name: '',
        bio: '',
        initial_category_name: 'Friend',
        relationship_type: 'personal',
        reminder_interval: 'weekly',
        phone: '',
        email: '',
        location: '',
        preferred_communication: '',
        meeting_frequency: '',
        notes: '',
        photo_url: '',
        tags: [],
      });
      onClose();
    } catch (error) {
      // Error is handled in the hook
      console.error('Failed to create relationship:', error);
    } finally {
      setIsSubmitting(false);
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
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <PremiumCard className="p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">Add New Relationship</h2>
              </div>
              <PremiumButton variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </PremiumButton>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PremiumInput
                  label="Name *"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter their name"
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    value={formData.initial_category_name}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      initial_category_name: e.target.value 
                    }))}
                    className="premium-input w-full"
                    required
                  >
                    {categoryOptions.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <PremiumInput
                label="Bio / Notes"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="What should you remember about them?"
                multiline
                rows={3}
              />

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PremiumInput
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="their.email@example.com"
                />
                
                <PremiumInput
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PremiumInput
                  label="Location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, State"
                />
                
                <PremiumInput
                  label="Preferred Communication"
                  value={formData.preferred_communication}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferred_communication: e.target.value }))}
                  placeholder="Text, Email, Call, etc."
                />
              </div>

              {/* Relationship Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Reminder Frequency</label>
                  <select
                    value={formData.reminder_interval}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      reminder_interval: e.target.value 
                    }))}
                    className="premium-input w-full"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Every 2 weeks</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>

                <PremiumInput
                  label="Meeting Frequency"
                  value={formData.meeting_frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, meeting_frequency: e.target.value }))}
                  placeholder="Weekly, Monthly, etc."
                />
              </div>

              <PremiumInput
                label="Photo URL"
                value={formData.photo_url}
                onChange={(e) => setFormData(prev => ({ ...prev, photo_url: e.target.value }))}
                placeholder="https://example.com/photo.jpg"
              />

              {/* Actions */}
              <div className="flex gap-3 pt-4">
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
                  disabled={!formData.name.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Relationship'}
                </PremiumButton>
              </div>
            </form>
          </PremiumCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}