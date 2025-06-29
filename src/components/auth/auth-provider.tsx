"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@/lib/types';

import { AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>; // Changed return type to Promise<void>
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      try {
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        if (supabaseUser) {
          const userData: User = {
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
            preferences: {
              theme: 'light',
              notifications: true,
              reminderFrequency: 'weekly',
              aiInsights: true,
            },
            createdAt: new Date(supabaseUser.created_at),
          };
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
            preferences: {
              theme: 'light',
              notifications: true,
              reminderFrequency: 'weekly',
              aiInsights: true,
            },
            createdAt: new Date(session.user.created_at),
          };
          setUser(userData);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      // No explicit return needed for Promise<void>
    } catch (error: any) {
      console.error('Signup error:', error);
      setIsLoading(false);
      throw error; // Re-throw the error to be caught by the caller (AuthPage)
    } finally {
      setIsLoading(false); // Ensure loading state is updated
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
