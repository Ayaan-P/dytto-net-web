"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumInput } from './premium-input';
import { PremiumButton } from './premium-button';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  className?: string;
  debounceMs?: number;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  suggestions = [],
  onSuggestionSelect,
  className,
  debounceMs = 300
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = useMemo(() => {
    if (!value.trim() || !suggestions.length) return [];
    return suggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 5);
  }, [value, suggestions]);

  const handleClear = useCallback(() => {
    onChange('');
    setShowSuggestions(false);
  }, [onChange]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    onChange(suggestion);
    onSuggestionSelect?.(suggestion);
    setShowSuggestions(false);
  }, [onChange, onSuggestionSelect]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setShowSuggestions(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 200);
  }, []);

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <PremiumInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          icon={<Search className="h-4 w-4" />}
          className={cn(
            "pr-10 transition-all duration-200",
            isFocused && "ring-2 ring-primary/20"
          )}
        />
        
        {value && (
          <PremiumButton
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </PremiumButton>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-muted transition-colors text-sm"
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}