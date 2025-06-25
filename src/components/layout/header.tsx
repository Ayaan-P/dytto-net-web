"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Search, 
  Bell, 
  Settings,
  User,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAppStore } from '@/lib/store';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumInput } from '@/components/ui/premium-input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { sidebarOpen, setSidebarOpen, user } = useAppStore();
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <PremiumButton
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </PremiumButton>

        {/* Search */}
        <div className="hidden md:block w-96">
          <PremiumInput
            placeholder="Search relationships..."
            icon={<Search className="h-4 w-4" />}
            className="bg-muted/50"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <PremiumButton
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </PremiumButton>

        {/* Notifications */}
        <PremiumButton variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </PremiumButton>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <PremiumButton variant="ghost" className="relative h-10 w-10 rounded-full">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </PremiumButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || 'user@example.com'}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}