"use client";

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Users, 
  BarChart3, 
  Target, 
  TreePine, 
  Settings,
  Plus,
  Sparkles,
  UserPlus,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { PremiumButton } from '@/components/ui/premium-button';
import { AddRelationshipModal } from '@/components/modals/add-relationship-modal';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Relationships', href: '/relationships', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Quests', href: '/quests', icon: Target },
  { name: 'Tree View', href: '/tree', icon: TreePine },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { user, dashboardStats } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <div className="flex h-full w-72 flex-col bg-card border-r border-border">
        {/* Logo and Brand */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg teal-bg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">Dytto</h1>
            <p className="text-xs text-muted-foreground">Relationship Manager</p>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium teal-text">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="p-6 border-b border-border">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold teal-text">{dashboardStats.totalRelationships}</p>
              <p className="text-xs text-muted-foreground">Connections</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-500">{dashboardStats.totalXP}</p>
              <p className="text-xs text-muted-foreground">Total XP</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.name} to={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "teal-bg text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Enhanced Add Relationship Section */}
        <div className="p-4 border-t border-border bg-gradient-to-br from-primary/5 to-primary/10">
          {/* Quick Action Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mb-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/20 border border-primary/20 cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => setShowAddModal(true)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">Add Connection</h3>
                <p className="text-xs text-muted-foreground">Grow your network</p>
              </div>
              <div className="p-1 rounded-full bg-primary/10">
                <Plus className="h-4 w-4 text-primary" />
              </div>
            </div>
          </motion.div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <motion.div 
              className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-500" />
                <div>
                  <p className="text-lg font-bold text-emerald-500">{dashboardStats.totalXP}</p>
                  <p className="text-xs text-muted-foreground">XP</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-lg font-bold text-blue-500">{dashboardStats.totalRelationships}</p>
                  <p className="text-xs text-muted-foreground">People</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Primary CTA Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PremiumButton 
              variant="gradient" 
              className="w-full h-12 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setShowAddModal(true)}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Add New Person
            </PremiumButton>
          </motion.div>

          {/* Motivational Text */}
          <motion.p 
            className="text-xs text-center text-muted-foreground mt-3 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Every connection is a new opportunity to grow 🌱
          </motion.p>
        </div>
      </div>

      {/* Add Relationship Modal */}
      <AddRelationshipModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </>
  );
}