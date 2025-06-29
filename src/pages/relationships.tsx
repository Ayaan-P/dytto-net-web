"use client";

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Grid3X3, List } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { PremiumButton } from '@/components/ui/premium-button';
import { RelationshipCards } from '@/components/dashboard/relationship-cards';
import { AddRelationshipModal } from '@/components/modals/add-relationship-modal';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useBackendRelationships } from '@/lib/hooks/use-backend-api';
import type { Relationship } from '@/lib/types';

export default function RelationshipsPage() {
  const { relationships, loading, error } = useBackendRelationships();
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (loading) {
    return (
      <AppShell>
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" text="Loading your relationships..." />
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Error Loading Relationships</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <PremiumButton onClick={() => window.location.reload()}>
              Try Again
            </PremiumButton>
          </div>
        </div>
      </AppShell>
    );
  }

  // Transform backend data to match frontend expectations
  const transformedRelationships: Relationship[] = relationships.map((rel: any) => ({
    id: rel.id,
    userId: rel.user_id || '',
    name: rel.name,
    bio: rel.bio,
    level: rel.level || 1,
    xp: rel.xp || 0,
    photoUrl: rel.photo_url,
    categories: rel.categories?.map((cat: string) => ({
      id: cat,
      name: cat,
      color: '#84BABF',
      icon: 'Users',
    })) || [],
    tags: rel.tags?.map((tag: string) => ({
      id: tag,
      name: tag,
      color: '#84BABF',
    })) || [],
    lastInteraction: rel.last_interaction ? new Date(rel.last_interaction) : undefined,
    reminderInterval: rel.reminder_interval || 'weekly',
    contactInfo: {
      email: rel.email,
      phone: rel.phone,
    },
    createdAt: new Date(rel.created_at),
    updatedAt: new Date(rel.updated_at),
  }));

  return (
    <ErrorBoundary>
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
              <h1 className="text-3xl font-bold text-gradient mb-2">Relationships</h1>
              <p className="text-muted-foreground">
                Manage and grow your {relationships.length} connections
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex border border-border rounded-lg">
                <PremiumButton
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </PremiumButton>
                <PremiumButton
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </PremiumButton>
              </div>

              <PremiumButton
                variant="gradient"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Relationship
              </PremiumButton>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {relationships.length === 0 ? (
              <EmptyState
                icon={Plus}
                title="No relationships yet"
                description="Start building meaningful connections by adding your first relationship."
                action={{
                  label: "Add Your First Connection",
                  onClick: () => setShowAddModal(true)
                }}
              />
            ) : (
              <RelationshipCards relationships={transformedRelationships} viewMode={viewMode} />
            )}
          </motion.div>
        </div>

        {/* Add Relationship Modal */}
        <AddRelationshipModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      </AppShell>
    </ErrorBoundary>
  );
}