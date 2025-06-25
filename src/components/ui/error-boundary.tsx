"use client";

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { PremiumButton } from './premium-button';
import { PremiumCard } from './premium-card';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback;
        return <Fallback error={this.state.error} retry={this.retry} />;
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
          <PremiumCard className="p-8 text-center max-w-md">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-4">
              We encountered an unexpected error. Please try again.
            </p>
            <PremiumButton onClick={this.retry} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </PremiumButton>
          </PremiumCard>
        </div>
      );
    }

    return this.props.children;
  }
}