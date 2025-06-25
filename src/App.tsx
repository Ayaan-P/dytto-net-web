import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { AuthProvider } from '@/components/auth/auth-provider'
import { ProtectedRoute } from '@/components/auth/protected-route'

// Pages
import AuthPage from '@/pages/auth'
import DashboardPage from '@/pages/dashboard'
import RelationshipsPage from '@/pages/relationships'
import AnalyticsPage from '@/pages/analytics'
import QuestsPage from '@/pages/quests'
import TreePage from '@/pages/tree'
import SettingsPage from '@/pages/settings'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/relationships" element={
              <ProtectedRoute>
                <RelationshipsPage />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            <Route path="/quests" element={
              <ProtectedRoute>
                <QuestsPage />
              </ProtectedRoute>
            } />
            <Route path="/tree" element={
              <ProtectedRoute>
                <TreePage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--card-foreground))',
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App