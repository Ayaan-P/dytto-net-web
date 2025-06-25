"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MessageCircle, BarChart3, Target, TreePine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PremiumCard } from '@/components/ui/premium-card';
import { PremiumButton } from '@/components/ui/premium-button';
import { AddRelationshipModal } from '@/components/modals/add-relationship-modal';

export function QuickActions() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);

  const quickActions = [
    {
      title: 'Add Person',
      description: 'Create a new relationship',
      icon: Plus,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      action: () => setShowAddModal(true),
    },
    {
      title: 'Log Interaction',
      description: 'Record a conversation',
      icon: MessageCircle,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      action: () => navigate('/relationships'),
    },
    {
      title: 'View Analytics',
      description: 'See relationship insights',
      icon: BarChart3,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      action: () => navigate('/analytics'),
    },
    {
      title: 'Check Quests',
      description: 'Complete relationship goals',
      icon: Target,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      action: () => navigate('/quests'),
    },
  ];

  return (
    <>
      <PremiumCard className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <TreePine className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Quick Actions</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <PremiumButton
                variant="ghost"
                className="h-auto p-4 flex flex-col items-start gap-3 w-full hover:bg-muted/50"
                onClick={action.action}
              >
                <div className={`p-3 rounded-lg ${action.bgColor}`}>
                  <action.icon className={`h-6 w-6 ${action.color}`} />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm">{action.title}</h3>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </PremiumButton>
            </motion.div>
          ))}
        </div>
      </PremiumCard>

      {/* Add Relationship Modal */}
      <AddRelationshipModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </>
  );
}