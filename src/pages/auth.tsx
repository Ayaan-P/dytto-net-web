"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumInput } from '@/components/ui/premium-input';
import { PremiumCard } from '@/components/ui/premium-card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup
  const { login, signUp } = useAuth(); // Get signUp from useAuth
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Welcome back to Dytto!');
      } else {
        // Assuming signUp takes email and password
        await signUp(email, password);
        toast.success('Welcome to Dytto! Please check your email to confirm your account.');
      }
      navigate('/');
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(`Authentication failed: ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <PremiumCard className="p-8 shadow-2xl">
          {/* Logo and Brand */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex h-16 w-16 items-center justify-center rounded-full teal-bg mx-auto mb-4"
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gradient mb-2">{isLogin ? 'Welcome Back' : 'Join Dytto'}</h1>
            <p className="text-muted-foreground">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <PremiumInput
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                required
              />
            </div>

            <div className="relative">
              <PremiumInput
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <PremiumButton
              type="submit"
              variant="gradient"
              className="w-full h-12"
              disabled={isLoading}
            >
              {isLoading ? (isLogin ? 'Signing in...' : 'Signing up...') : (isLogin ? 'Sign In' : 'Sign Up')}
            </PremiumButton>
          </form>

          {/* Toggle between Login and Signup */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
            >
              {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
            </button>
          </div>

          {/* Demo Notice */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Demo Mode:</strong> Use any email and password to sign in (Supabase email confirmation might still apply for signup depending on your Supabase settings).
            </p>
          </div>
        </PremiumCard>
      </motion.div>
    </div>
  );
}
