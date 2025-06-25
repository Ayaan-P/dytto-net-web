"use client";

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Grid3X3, List } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { PremiumButton } from '@/components/ui/premium-button';
import { RelationshipCards } from '@/components/dashboard/relationship-cards';
import { AddRelationshipModal } from '@/components/modals/add-relationship-modal';
import { RelationshipSearch } from '@/components/features/relationship-search';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useRelationships } from '@/lib/hooks/use-supabase';
import type { Relationship } from '@/lib/types';

export default function RelationshipsPage() {
  const { relationships, loading } = useRelationships();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filteredRelationships, setFilteredRelationships] = useState<Relationship[]>(relationships);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleResultsChange = useCallback((results: Relationship[]) => {
    setFilteredRelationships(results);
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div className="p-6">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

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

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <RelationshipSearch onResultsChange={handleResultsChange} />
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
            ) : filteredRelationships.length === 0 ? (
              <EmptyState
                icon={List}
                title="No matches found"
                description="Try adjusting your search terms or filters to find what you're looking for."
              />
            ) : (
              <RelationshipCards relationships={filteredRelationships} viewMode={viewMode} />
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