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
import { useTheme } from '@/components/theme-provider';
import { AppShell } from '@/components/layout/app-shell';
import { PremiumCard } from '@/components/ui/premium-card';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumInput } from '@/components/ui/premium-input';
import { Badge } from '@/components/ui/badge';
import { BackupRestore } from '@/components/features/backup-restore';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useAppStore } from '@/lib/store';
import { validateUser } from '@/lib/utils/validation';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, setUser } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'appearance' | 'data'>('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
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
    setTheme(newTheme as any);
    toast.success(`Theme changed to ${newTheme}`);
  }, [setTheme]);

  const handleSaveProfile = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const validation = validateUser(formData);
      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        return;
      }

      if (user) {
        setUser({ ...user, ...formData });
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  }, [formData, user, setUser]);

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
                            onClick={() => setFormData({ name: user?.name || '', email: user?.email || '' })}
                          >
                            Cancel
                          </PremiumButton>
                        </div>
                      </div>
                    </PremiumCard>
                  )}

                  {activeTab === 'notifications' && (
                    <PremiumCard className="p-8 hover-lift">
                      <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                      
                      <div className="space-y-6">
                        {[
                          {
                            title: 'Relationship Reminders',
                            description: 'Get notified when it\'s time to reconnect with someone',
                            enabled: true,
                          },
                          {
                            title: 'Level Up Notifications',
                            description: 'Celebrate when your relationships reach new levels',
                            enabled: true,
                          },
                          {
                            title: 'Quest Completions',
                            description: 'Get notified when you complete relationship quests',
                            enabled: false,
                          },
                          {
                            title: 'Weekly Insights',
                            description: 'Receive weekly relationship analytics and insights',
                            enabled: true,
                          },
                          {
                            title: 'Email Notifications',
                            description: 'Receive important updates via email',
                            enabled: false,
                          },
                        ].map((setting, index) => (
                          <motion.div 
                            key={index} 
                            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200"
                            whileHover={{ x: 4 }}
                          >
                            <div>
                              <h3 className="font-medium">{setting.title}</h3>
                              <p className="text-sm text-muted-foreground">{setting.description}</p>
                            </div>
                            <Badge variant={setting.enabled ? 'default' : 'secondary'}>
                              {setting.enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </PremiumCard>
                  )}

                  {activeTab === 'privacy' && (
                    <PremiumCard className="p-8 hover-lift">
                      <h2 className="text-xl font-semibold mb-6">Privacy & Security</h2>
                      
                      <div className="space-y-6">
                        <motion.div 
                          className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200"
                          whileHover={{ x: 4 }}
                        >
                          <h3 className="font-medium mb-2">Data Visibility</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Control who can see your relationship data and activity
                          </p>
                          <div className="space-y-2">
                            <Badge variant="outline">Private (Only You)</Badge>
                          </div>
                        </motion.div>

                        <motion.div 
                          className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200"
                          whileHover={{ x: 4 }}
                        >
                          <h3 className="font-medium mb-2">Data Retention</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Choose how long to keep your interaction history
                          </p>
                          <div className="space-y-2">
                            <Badge variant="outline">Keep Forever</Badge>
                          </div>
                        </motion.div>

                        <motion.div 
                          className="p-4 border border-destructive/20 rounded-lg hover:bg-destructive/5 transition-colors duration-200"
                          whileHover={{ x: 4 }}
                        >
                          <h3 className="font-medium mb-2 text-destructive">Delete Account</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Permanently delete your account and all associated data
                          </p>
                          <PremiumButton variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </PremiumButton>
                        </motion.div>
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

                        <div>
                          <h3 className="font-medium mb-4">Tree Themes</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                              { name: 'Teal', color: '#84BABF' },
                              { name: 'Oak', color: '#8B4513' },
                              { name: 'Sakura', color: '#FFB7C5' },
                              { name: 'Pine', color: '#228B22' },
                            ].map((treeTheme) => (
                              <motion.div 
                                key={treeTheme.name} 
                                className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div 
                                  className="h-8 w-8 rounded-full mx-auto mb-2"
                                  style={{ backgroundColor: treeTheme.color }}
                                />
                                <p className="text-sm font-medium text-center">{treeTheme.name}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-4">Display Options</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Compact Mode</p>
                                <p className="text-sm text-muted-foreground">Show more content in less space</p>
                              </div>
                              <Badge variant="secondary">Disabled</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Animations</p>
                                <p className="text-sm text-muted-foreground">Enable smooth transitions and effects</p>
                              </div>
                              <Badge variant="default">Enabled</Badge>
                            </div>
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
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </AppShell>
    </ErrorBoundary>
  );
}