"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumInput } from '@/components/ui/premium-input';
import { PremiumCard } from '@/components/ui/premium-card';
import { useAuthContext } from './auth-provider';
import { toast } from 'sonner';

interface LoginFormProps {
  onToggleMode: () => void;
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const { signIn } = useAuthContext();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Welcome back!');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PremiumCard className="p-8 w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue your relationship journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <PremiumInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
            icon={<Mail className="h-4 w-4" />}
            required
          />

          <div className="relative">
            <PremiumInput
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter your password"
              icon={<Lock className="h-4 w-4" />}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <PremiumButton
            type="submit"
            variant="gradient"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </PremiumButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              onClick={onToggleMode}
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </PremiumCard>
    </motion.div>
  );
}