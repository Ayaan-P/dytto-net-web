"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TreePine, Users, Zap, Award, Download, Settings } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { PremiumCard } from '@/components/ui/premium-card';
import { PremiumButton } from '@/components/ui/premium-button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useBackendRelationships, useGlobalTree } from '@/lib/hooks/use-backend-api';
import { getLevelColor, getLevelTitle } from '@/lib/utils/levels';
import { toast } from 'sonner';

export default function TreePage() {
  const { relationships, loading: relationshipsLoading } = useBackendRelationships();
  const { treeData, loading: treeLoading, error: treeError } = useGlobalTree();
  const [selectedTheme, setSelectedTheme] = useState<'oak' | 'sakura' | 'pine' | 'teal'>('teal');

  const themes = {
    oak: { name: 'Oak', color: '#8B4513', bgColor: '#F5E6D3' },
    sakura: { name: 'Sakura', color: '#FFB7C5', bgColor: '#FFF0F5' },
    pine: { name: 'Pine', color: '#228B22', bgColor: '#F0FFF0' },
    teal: { name: 'Teal', color: '#84BABF', bgColor: '#F0F9F9' },
  };

  const isLoading = relationshipsLoading || treeLoading;

  // Calculate stats from relationships
  const totalXP = relationships.reduce((sum, rel) => sum + (rel.xp || 0), 0);
  const averageLevel = relationships.length > 0 
    ? relationships.reduce((sum, rel) => sum + (rel.level || 1), 0) / relationships.length 
    : 1;

  if (isLoading) {
    return (
      <AppShell>
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" text="Growing your relationship tree..." />
        </div>
      </AppShell>
    );
  }

  return (
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
            <h1 className="text-3xl font-bold text-gradient mb-2">Relationship Tree</h1>
            <p className="text-muted-foreground">
              Visualize your connection growth and milestones
            </p>
          </div>
          
          <div className="flex gap-2">
            <PremiumButton variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </PremiumButton>
            <PremiumButton variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Customize
            </PremiumButton>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <PremiumCard className="p-6 hover-lift">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{relationships.length}</p>
                <p className="text-sm text-muted-foreground">Connections</p>
              </div>
            </div>
          </PremiumCard>
          
          <PremiumCard className="p-6 hover-lift">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Zap className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalXP}</p>
                <p className="text-sm text-muted-foreground">Total XP</p>
              </div>
            </div>
          </PremiumCard>
          
          <PremiumCard className="p-6 hover-lift">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Award className="h-5 w-5 teal-text" />
              </div>
              <div>
                <p className="text-2xl font-bold">{averageLevel.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Avg Level</p>
              </div>
            </div>
          </PremiumCard>
          
          <PremiumCard className="p-6 hover-lift">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <TreePine className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.max(1, Math.floor(totalXP / 50))}</p>
                <p className="text-sm text-muted-foreground">Tree Rings</p>
              </div>
            </div>
          </PremiumCard>
        </motion.div>

        {/* Theme Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <PremiumCard className="p-6 hover-lift">
            <h3 className="text-lg font-semibold mb-4">Tree Theme</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(themes).map(([key, theme]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTheme(key as any)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTheme === key 
                      ? 'teal-border bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  style={{ backgroundColor: selectedTheme === key ? `${theme.color}10` : undefined }}
                >
                  <div 
                    className="h-8 w-8 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: theme.color }}
                  />
                  <p className="text-sm font-medium">{theme.name}</p>
                </motion.button>
              ))}
            </div>
          </PremiumCard>
        </motion.div>

        {/* Tree Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <PremiumCard className="p-8 min-h-[600px] hover-lift">
            {treeError ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-destructive mb-2">Error loading tree data</p>
                <p className="text-muted-foreground mb-4">{treeError}</p>
                <PremiumButton onClick={() => window.location.reload()}>
                  Try Again
                </PremiumButton>
              </div>
            ) : (
              <div 
                className="relative w-full h-full rounded-lg flex items-center justify-center"
                style={{ backgroundColor: themes[selectedTheme].bgColor }}
              >
                {/* SVG Tree Visualization */}
                <svg width="100%" height="500" viewBox="0 0 800 500" className="overflow-visible">
                  {/* Tree Trunk */}
                  <rect 
                    x="390" 
                    y="350" 
                    width="20" 
                    height="150" 
                    fill={themes[selectedTheme].color}
                    rx="10"
                  />
                  
                  {/* Tree Rings (User Level) */}
                  {Array.from({ length: Math.min(5, Math.floor(averageLevel)) }).map((_, i) => (
                    <circle
                      key={i}
                      cx="400"
                      cy="300"
                      r={50 + i * 30}
                      fill="none"
                      stroke={themes[selectedTheme].color}
                      strokeWidth="2"
                      opacity={0.3}
                    />
                  ))}
                  
                  {/* Main Crown */}
                  <circle 
                    cx="400" 
                    cy="200" 
                    r="80" 
                    fill={themes[selectedTheme].color}
                    opacity="0.8"
                  />
                  
                  {/* Relationship Branches */}
                  {relationships.slice(0, 8).map((relationship, index) => {
                    const angle = (index * 45) * (Math.PI / 180);
                    const radius = 120 + ((relationship.level || 1) * 10);
                    const x = 400 + Math.cos(angle) * radius;
                    const y = 200 + Math.sin(angle) * radius;
                    const branchColor = getLevelColor(relationship.level || 1);
                    
                    return (
                      <g key={relationship.id}>
                        {/* Branch Line */}
                        <line
                          x1="400"
                          y1="200"
                          x2={x}
                          y2={y}
                          stroke={themes[selectedTheme].color}
                          strokeWidth="3"
                          opacity="0.6"
                        />
                        
                        {/* Relationship Node */}
                        <circle
                          cx={x}
                          cy={y}
                          r={8 + (relationship.level || 1) * 2}
                          fill={branchColor}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        />
                        
                        {/* Name Label */}
                        <text
                          x={x}
                          y={y - 20}
                          textAnchor="middle"
                          className="text-xs font-medium fill-current"
                          fill={themes[selectedTheme].color}
                        >
                          {relationship.name}
                        </text>
                        
                        {/* Level Badge */}
                        <text
                          x={x}
                          y={y + 4}
                          textAnchor="middle"
                          className="text-xs font-bold fill-white"
                        >
                          {relationship.level || 1}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Central User Node */}
                  <circle 
                    cx="400" 
                    cy="200" 
                    r="25" 
                    fill="white"
                    stroke={themes[selectedTheme].color}
                    strokeWidth="3"
                  />
                  <text
                    x="400"
                    y="206"
                    textAnchor="middle"
                    className="text-sm font-bold"
                    fill={themes[selectedTheme].color}
                  >
                    You
                  </text>
                </svg>
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-400" />
                    <span className="text-xs">Level 1-3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full teal-bg" />
                    <span className="text-xs">Level 4-6</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-500" />
                    <span className="text-xs">Level 7-10</span>
                  </div>
                </div>
              </div>
            )}
          </PremiumCard>
        </motion.div>

        {/* Relationship List */}
        {relationships.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <PremiumCard className="p-6 hover-lift">
              <h3 className="text-lg font-semibold mb-4">Connection Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relationships.map((relationship) => (
                  <motion.div 
                    key={relationship.id} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors duration-200"
                    whileHover={{ x: 4 }}
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: getLevelColor(relationship.level || 1) }}
                    >
                      {relationship.level || 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{relationship.name}</p>
                      <p className="text-sm text-muted-foreground">{getLevelTitle(relationship.level || 1)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{relationship.xp || 0} XP</p>
                      <div className="flex gap-1">
                        {relationship.categories && relationship.categories.slice(0, 2).map((category: string) => (
                          <Badge 
                            key={category} 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </PremiumCard>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}