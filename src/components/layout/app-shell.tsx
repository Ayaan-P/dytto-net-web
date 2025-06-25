"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Fixed positioning to prevent layout shifts */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:relative lg:z-auto lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto">
          {/* Remove sliding animations, use simple fade */}
          <div className="h-full fade-transition">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden fade-transition"
          onClick={() => useAppStore.getState().setSidebarOpen(false)}
        />
      )}
    </div>
  );
}