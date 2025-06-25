"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, AlertTriangle, CheckCircle } from 'lucide-react';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumCard } from '@/components/ui/premium-card';
import { useAppStore } from '@/lib/store';
import { exportUserData, downloadJSON, downloadCSV, exportToCSV } from '@/lib/utils/export';
import { toast } from 'sonner';

export function BackupRestore() {
  const { user, relationships, interactions, setRelationships, setInteractions } = useAppStore();
  const [isImporting, setIsImporting] = useState(false);

  const handleExportJSON = () => {
    if (!user) return;
    
    const data = exportUserData(user, relationships, interactions);
    const filename = `dytto-backup-${new Date().toISOString().split('T')[0]}.json`;
    downloadJSON(data, filename);
    toast.success('Data exported successfully!');
  };

  const handleExportCSV = () => {
    const csvContent = exportToCSV(relationships);
    const filename = `dytto-relationships-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
    toast.success('Relationships exported to CSV!');
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate the imported data structure
      if (!data.relationships || !Array.isArray(data.relationships)) {
        throw new Error('Invalid backup file format');
      }

      // Convert date strings back to Date objects
      const processedRelationships = data.relationships.map((rel: any) => ({
        ...rel,
        createdAt: new Date(rel.createdAt),
        updatedAt: new Date(rel.updatedAt),
        lastInteraction: rel.lastInteraction ? new Date(rel.lastInteraction) : undefined,
      }));

      const processedInteractions = (data.interactions || []).map((int: any) => ({
        ...int,
        createdAt: new Date(int.createdAt),
      }));

      setRelationships(processedRelationships);
      setInteractions(processedInteractions);
      
      toast.success(`Imported ${processedRelationships.length} relationships and ${processedInteractions.length} interactions!`);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data. Please check the file format.');
    } finally {
      setIsImporting(false);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <PremiumCard className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Your Data
        </h3>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Download your relationship data for backup or transfer to another device.
          </p>
          
          <div className="flex gap-4">
            <PremiumButton onClick={handleExportJSON} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export JSON (Complete)
            </PremiumButton>
            
            <PremiumButton onClick={handleExportCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV (Relationships)
            </PremiumButton>
          </div>
        </div>
      </PremiumCard>

      {/* Import Section */}
      <PremiumCard className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Data
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Warning: This will replace all current data
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Make sure to export your current data first if you want to keep it.
              </p>
            </div>
          </div>
          
          <div>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={isImporting}
              className="hidden"
              id="import-file"
            />
            <label htmlFor="import-file">
              <PremiumButton 
                as="span" 
                variant="outline" 
                disabled={isImporting}
                className="cursor-pointer"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isImporting ? 'Importing...' : 'Import JSON Backup'}
              </PremiumButton>
            </label>
          </div>
        </div>
      </PremiumCard>

      {/* Data Summary */}
      <PremiumCard className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Current Data
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-primary">{relationships.length}</p>
            <p className="text-sm text-muted-foreground">Relationships</p>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-emerald-500">{interactions.length}</p>
            <p className="text-sm text-muted-foreground">Interactions</p>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-purple-500">
              {relationships.reduce((sum, rel) => sum + rel.xp, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total XP</p>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
}