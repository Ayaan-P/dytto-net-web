"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Download,
  Trash2,
  Moon,
  Sun,
  Monitor,
  Database
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { AppShell } from '@/components/layout/app-shell';
import { PremiumCard } from '@/components/ui/premium-card';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumInput } from '@/components/ui/premium-input';
import { Badge } from '@/components/ui/badge';
import { BackupRestore } from '@/components/features/backup-restore';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useProfile } from '@/lib/hooks/use-supabase';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { profile, updateProfile } = useProfile();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'appearance' | 'data'>('profile');
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data', icon: Database },
  ];

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  const handleTabChange = useCallback((tab: typeof activeTab) => {
    setActiveTab(tab);
  }, []);

  const handleThemeChange = useCallback((newTheme: string) => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  }, [setTheme]);

  const handleSaveProfile = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const { error } = await updateProfile(formData);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  }, [formData, updateProfile]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <ErrorBoundary>
      <AppShell>
        <div className="p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gradient mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account preferences and application settings
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <PremiumCard className="p-4 hover-lift">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id as any)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </PremiumCard>
            </motion.div>

            {/* Content */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'profile' && (
                    <PremiumCard className="p-8 hover-lift">
                      <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
                      
                      <div className="space-y-6">
                        {/* Profile Photo */}
                        <div className="flex items-center gap-6">
                          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-2xl font-semibold text-primary">
                              {formData.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <PremiumButton variant="outline" size="sm">
                              Change Photo
                            </PremiumButton>
                            <p className="text-sm text-muted-foreground mt-1">
                              JPG, PNG or GIF. Max size 2MB.
                            </p>
                          </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <PremiumInput
                            label="Full Name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Enter your full name"
                          />
                          <PremiumInput
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="Enter your email"
                            disabled
                          />
                        </div>

                        <div className="flex gap-4 pt-4">
                          <PremiumButton 
                            variant="gradient" 
                            onClick={handleSaveProfile}
                            disabled={isLoading}
                          >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                          </PremiumButton>
                          <PremiumButton 
                            variant="outline"
                            onClick={() => setFormData({ name: profile?.name || '', email: profile?.email || '' })}
                          >
                            Cancel
                          </PremiumButton>
                        </div>
                      </div>
                    </PremiumCard>
                  )}

                  {activeTab === 'appearance' && (
                    <PremiumCard className="p-8 hover-lift">
                      <h2 className="text-xl font-semibold mb-6">Appearance</h2>
                      
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-4">Theme</h3>
                          <div className="grid grid-cols-3 gap-4">
                            {themeOptions.map((option) => {
                              const Icon = option.icon;
                              return (
                                <motion.button
                                  key={option.id}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleThemeChange(option.id)}
                                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                    theme === option.id
                                      ? 'border-primary bg-primary/10'
                                      : 'border-border hover:border-primary/50'
                                  }`}
                                >
                                  <Icon className="h-6 w-6 mx-auto mb-2" />
                                  <p className="text-sm font-medium">{option.label}</p>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </PremiumCard>
                  )}

                  {activeTab === 'data' && (
                    <div className="space-y-6">
                      <BackupRestore />
                    </div>
                  )}

                  {/* Other tabs would go here */}
                  {activeTab === 'notifications' && (
                    <PremiumCard className="p-8 hover-lift">
                      <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                      <p className="text-muted-foreground">Notification settings coming soon...</p>
                    </PremiumCard>
                  )}

                  {activeTab === 'privacy' && (
                    <PremiumCard className="p-8 hover-lift">
                      <h2 className="text-xl font-semibold mb-6">Privacy & Security</h2>
                      <p className="text-muted-foreground">Privacy settings coming soon...</p>
                    </PremiumCard>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </AppShell>
    </ErrorBoundary>
  );
}